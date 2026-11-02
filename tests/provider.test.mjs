import test from 'node:test';
import assert from 'node:assert/strict';
import {env} from './support/database.mjs';
import {png} from './support/images.mjs';
import {startPreview,pollPreview,cleanup,priceAndBalance} from '../src/youcam.mjs';
function setup(){
  const e=env(),db=e.DB.sqlite,user={id:crypto.randomUUID(),name:'Owner'},cid=crypto.randomUUID(),gid=crypto.randomUUID(),photo={bytes:png(),type:'image/png'};
  db.prepare('INSERT INTO users(id,name,created_at) VALUES(?,?,0)').run(user.id,user.name);
  db.prepare('INSERT INTO circles(id,owner_id,title,care_days,invite_hash,created_at) VALUES(?,?,?,1,?,0)').run(cid,user.id,'Wardrobe','hash');
  db.prepare('INSERT INTO garments(id,circle_id,title,category,size_label,photo,photo_type,created_at) VALUES(?,?,?,?,?,?,?,0)').run(gid,cid,'Blazer','outer','M',photo.bytes,photo.type);
  db.prepare('INSERT INTO members(circle_id,user_id,display_name,joined_at) VALUES(?,?,?,0)').run(cid,user.id,user.name);
  const g={id:gid,version:1,title:'Blazer',category:'outer',photo:Array.from(photo.bytes)};
  let taskCalls=0,fileCalls=0;const signedHeaders=[],deletions=[];
  e.YOUCAM_API_KEY='test-only';e.FETCH=async(url,options={})=>{
    assert.equal(options.redirect,'manual','Cloudflare requires manual redirects; credentials and images must not follow redirects');
    if(url.includes('/client/credit'))return Response.json({results:[{type:'ApiFree',amount:1000}]});
    if(url.includes('/credit/feature-cost'))return Response.json({result:{skus:[{run_task_url:'/s2s/v2.0/task/cloth-v4',amount:2}]}});
    if(url.endsWith('/file'))return Response.json({data:{files:[{file_id:'file-'+(++fileCalls),requests:[{method:'PUT',url:'https://yce-task.s3.us-west-2.amazonaws.com/upload?x='+fileCalls,headers:{'Content-Type':'image/png'}}]}]}});
    if(options.method==='PUT'){signedHeaders.push(new Headers(options.headers));await e.onPut?.();return new Response(null,{status:200});}
    if(url.endsWith('/task/delete')){const id=JSON.parse(options.body).task_id;deletions.push(id);return e.deleteFails?Response.json({error:'unavailable'},{status:503}):Response.json({ok:true});}
    if(url.endsWith('/cloth-v4')&&options.method==='POST'){taskCalls++;await e.onTask?.();return Response.json({data:{task_id:'provider-'+taskCalls}});}
    if(url.includes('/cloth-v4/')){if(e.pollFails)return Response.json({error:'unavailable'},{status:503});return Response.json({data:{task_status:'success',results:{url:'https://yce-task.s3.us-west-2.amazonaws.com/result'}}});}
    if(url.includes('/result')){await e.onResult?.();return new Response(photo.bytes,{headers:{'Content-Type':'image/png'}});}
    throw new Error('Unexpected mock destination '+url);
  };
  return {e,db,user,g,photo,input:{idempotency_key:crypto.randomUUID()},signedHeaders,deletions,get taskCalls(){return taskCalls;}};
}
test('preflight distinguishes a connection failure from a deadline without logging secrets',async t=>{
  const warning=t.mock.method(console,'warn',()=>{}),secret='private-test-only-credential';
  for(const [error,code] of [[new TypeError('network connection lost: '+secret),'PROVIDER_CONNECTION'],[new DOMException(secret,'TimeoutError'),'PROVIDER_TIMEOUT']]){
    await assert.rejects(priceAndBalance({YOUCAM_API_KEY:secret,FETCH:async()=>{throw error;}}),e=>e.code===code);
  }
  const logs=JSON.stringify(warning.mock.calls.map(c=>c.arguments));assert.equal(logs.includes(secret),false);assert.match(logs,/balance/);assert.match(logs,/timeout/);
});
test('preflight rejects a redirect before parsing a plausible balance body or sending another authenticated request',async()=>{
  let calls=0;await assert.rejects(priceAndBalance({YOUCAM_API_KEY:'test-only',FETCH:async(url,options)=>{calls++;assert.equal(options.redirect,'manual');return Response.json({results:[{type:'ApiFree',amount:1000}]},{status:307,headers:{Location:'https://untrusted.test/credit'}});}}),e=>e.code==='PROVIDER_REDIRECT');assert.equal(calls,1);
});
test('signed upload redirects stop before task creation and receive no provider credential',async()=>{
  const f=setup(),original=f.e.FETCH;f.e.FETCH=async(url,options)=>{if(options.method==='PUT'){assert.equal(options.redirect,'manual');assert.equal(new Headers(options.headers).has('Authorization'),false);return new Response(null,{status:307,headers:{Location:'https://untrusted.test/upload'}});}return original(url,options);};
  const j=await startPreview(f.e,f.user,f.g,f.input,f.photo);assert.equal(j.status,'error');assert.equal(j.error_code,'PROVIDER_UPLOAD');assert.equal(f.taskCalls,0);f.e.DB.close();
});
test('provider protocol creates one task on retries, never forwards API authorization to signed storage, and stores bounded private bytes',async()=>{
  const f=setup();const j=await startPreview(f.e,f.user,f.g,f.input,f.photo);assert.equal(j.status,'submitted');
  const repeat=await startPreview(f.e,f.user,f.g,f.input,f.photo);assert.equal(repeat.id,j.id);assert.equal(f.taskCalls,1);
  for(const headers of f.signedHeaders)assert.equal(headers.has('Authorization'),false);
  const result=await pollPreview(f.e,await f.e.DB.prepare('SELECT * FROM tryon_jobs WHERE id=?').bind(j.id).first());assert.equal(result.status,'succeeded');
  assert.equal(f.db.prepare('SELECT SUM(length(bytes)) n FROM result_chunks WHERE job_id=?').get(j.id).n,f.photo.bytes.length);assert.equal(f.deletions.length,1);f.e.DB.close();
});
test('cancelling during upload stops before billable task creation',async()=>{
  const f=setup();let once=false;f.e.onPut=()=>{if(!once){once=true;f.db.prepare("UPDATE tryon_jobs SET status='cancelled'").run();}};
  const j=await startPreview(f.e,f.user,f.g,f.input,f.photo);assert.equal(j.status,'cancelled');assert.equal(f.taskCalls,0);f.e.DB.close();
});
test('cancellation racing an accepted task preserves cancellation and retains the provider ID for cleanup',async()=>{
  const f=setup();f.e.onTask=()=>f.db.prepare("UPDATE tryon_jobs SET status='cancelled'").run();
  const j=await startPreview(f.e,f.user,f.g,f.input,f.photo);assert.equal(j.status,'cancelled');assert.equal(f.taskCalls,1);
  const row=f.db.prepare('SELECT * FROM tryon_jobs WHERE id=?').get(j.id);assert.equal(row.provider_id,'provider-1');assert.equal(row.cleanup_pending,1);f.e.DB.close();
});
test('cancellation during result download cannot resurrect saved image bytes or a succeeded state',async()=>{
  const f=setup();const j=await startPreview(f.e,f.user,f.g,f.input,f.photo);f.e.onResult=()=>f.db.prepare("UPDATE tryon_jobs SET status='cancelled'").run();
  const result=await pollPreview(f.e,await f.e.DB.prepare('SELECT * FROM tryon_jobs WHERE id=?').bind(j.id).first());assert.equal(result.status,'cancelled');assert.equal(f.db.prepare('SELECT COUNT(*) n FROM result_chunks').get().n,0);f.e.DB.close();
});
test('repeated provider failures pause polling, with explicit recheck of the same task',async()=>{
  const f=setup(),j=await startPreview(f.e,f.user,f.g,f.input,f.photo);f.e.pollFails=true;
  let result;for(let i=0;i<3;i++){f.db.prepare('UPDATE tryon_jobs SET next_poll_at=0,last_polled_at=0').run();result=await pollPreview(f.e,await f.e.DB.prepare('SELECT * FROM tryon_jobs WHERE id=?').bind(j.id).first());}
  assert.equal(result.status,'paused');assert.equal(result.can_recheck,true);assert.equal(f.taskCalls,1);
  f.e.pollFails=false;f.db.prepare('UPDATE tryon_jobs SET next_poll_at=0,last_polled_at=0').run();result=await pollPreview(f.e,await f.e.DB.prepare('SELECT * FROM tryon_jobs WHERE id=?').bind(j.id).first(),true);assert.equal(result.status,'succeeded');assert.equal(f.taskCalls,1);f.e.DB.close();
});
test('cleanup rotates through failing jobs so earlier failures do not starve later images',async()=>{
  const f=setup();f.e.deleteFails=true;
  for(let i=0;i<12;i++)f.db.prepare("INSERT INTO tryon_jobs(id,user_id,garment_id,garment_version,garment_title,idempotency_key,input_digest,provider_id,status,cost,created_at,expires_at,cleanup_pending) VALUES(?,?,?,1,'Blazer',?,'hash',?,'cancelled',2,?,?,1)").run(crypto.randomUUID(),f.user.id,f.g.id,crypto.randomUUID(),'delete-'+i,Date.now()+i,Date.now()+100000);
  await cleanup(f.e);assert.equal(f.deletions.length,10);await cleanup(f.e);assert.equal(new Set(f.deletions).size,12);f.e.DB.close();
});

test('concurrent identical inputs with different page keys reserve and create only one provider task',async()=>{
  const f=setup(),fetchMock=f.e.FETCH;let entered=0,release;const gate=new Promise(resolve=>{release=resolve;});
  f.e.FETCH=async(url,options)=>{if(url.includes('/client/credit')){if(++entered===2)release();await gate;}return fetchMock(url,options);};
  const jobs=await Promise.all([startPreview(f.e,f.user,f.g,{idempotency_key:crypto.randomUUID()},f.photo),startPreview(f.e,f.user,f.g,{idempotency_key:crypto.randomUUID()},f.photo)]);
  assert.equal(new Set(jobs.map(j=>j.id)).size,1);assert.equal(f.taskCalls,1);assert.equal(f.db.prepare("SELECT units FROM budgets WHERE key='total'").get().units,2);f.e.DB.close();
});

test('membership revoked during provider preflight cannot reserve or upload a new preview',async()=>{
  const f=setup(),cid=f.db.prepare('SELECT circle_id FROM garments WHERE id=?').get(f.g.id).circle_id,borrower={id:crypto.randomUUID(),name:'Borrower'};
  f.db.prepare('INSERT INTO users(id,name,created_at) VALUES(?,?,0)').run(borrower.id,borrower.name);f.db.prepare('INSERT INTO members(circle_id,user_id,display_name,joined_at) VALUES(?,?,?,0)').run(cid,borrower.id,borrower.name);
  const fetchMock=f.e.FETCH;f.e.FETCH=async(url,options)=>{if(url.includes('/credit/feature-cost'))f.db.prepare('DELETE FROM members WHERE circle_id=? AND user_id=?').run(cid,borrower.id);return fetchMock(url,options);};
  await assert.rejects(startPreview(f.e,borrower,f.g,{idempotency_key:crypto.randomUUID()},f.photo),e=>e.code==='GARMENT_CHANGED');
  assert.equal(f.taskCalls,0);assert.equal(f.signedHeaders.length,0);assert.equal(f.db.prepare('SELECT COUNT(*) n FROM tryon_jobs').get().n,0);f.e.DB.close();
});

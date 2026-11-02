import test from 'node:test';
import assert from 'node:assert/strict';
import {checkWardrobeAvailability} from '../public/lib/availability.mjs';

test('wardrobe availability limits concurrency, skips archived pieces and preserves unavailable answers',async()=>{
  const pieces=Array.from({length:13},(_,id)=>({id:String(id),archived:id===12}));
  let running=0,peak=0,calls=0;
  const result=await checkWardrobeAvailability(pieces,async g=>{running++;calls++;peak=Math.max(peak,running);await Promise.resolve();running--;return Number(g.id)%2===0;});
  assert.equal(calls,12);assert.ok(peak<=4);assert.equal(result.size,12);assert.equal(result.get('0'),true);assert.equal(result.get('1'),false);assert.equal(result.has('12'),false);
});

test('a changed date window discards in-flight answers and stops later lookups',async()=>{
  let current=true,calls=0;const releases=[];
  const pending=checkWardrobeAvailability(Array.from({length:12},(_,id)=>({id})),async()=>{calls++;await new Promise(resolve=>releases.push(resolve));return true;},()=>current);
  assert.equal(calls,4);current=false;releases.forEach(resolve=>resolve());assert.equal(await pending,null);assert.equal(calls,4);
});

test('failed or malformed availability does not return a partial available map',async()=>{
  const pieces=[{id:'a'},{id:'b'},{id:'c'}];
  await assert.rejects(checkWardrobeAvailability(pieces,async g=>{if(g.id==='b')throw new Error('network failed');return true;}),/network failed/);
  await assert.rejects(checkWardrobeAvailability(pieces,async()=>undefined),/could not be confirmed/);
});

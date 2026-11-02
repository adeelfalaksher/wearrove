import test from 'node:test';
import assert from 'node:assert/strict';
const event={preventDefault(){},stopPropagation(){}};
function fixture(){
  const before={fetch:globalThis.fetch,document:globalThis.document},button={dataset:{savePiece:'piece'},isConnected:true,attrs:new Map(),setAttribute(k,v){this.attrs.set(k,v);}},toast={};
  globalThis.document={querySelectorAll:()=>[button],querySelector:()=>toast};
  return {button,root:globalThis.document,close(){clearTimeout(toast._timer);globalThis.fetch=before.fetch;if(before.document===undefined)delete globalThis.document;else globalThis.document=before.document;}};
}
test('saved refresh during a pending toggle preserves the next user intent',async()=>{
  const f=fixture();try{let release,first=true;const gate=new Promise(r=>{release=r;}),methods=[];
    globalThis.fetch=async(path,options)=>{if(path==='/api/saved')return Response.json({pieces:[]});methods.push(options.method);if(first){first=false;await gate;}return Response.json({saved:options.method==='PUT'});};
    const {attachSaveButtons}=await import('../public/lib/saved.mjs?pending-refresh');await attachSaveButtons(f.root);const saving=f.button.onclick(event);await attachSaveButtons(f.root,true);release();await saving;await f.button.onclick(event);assert.deepEqual(methods,['PUT','DELETE']);assert.equal(f.button.attrs.get('aria-pressed'),'false');
  }finally{f.close();}
});
test('an older saved-list response cannot undo a mutation completed during refresh',async()=>{
  const f=fixture();try{let releaseRead,releaseWrite,readCount=0;const readGate=new Promise(r=>{releaseRead=r;}),writeGate=new Promise(r=>{releaseWrite=r;}),methods=[];
    globalThis.fetch=async(path,options)=>{if(path==='/api/saved'){if(++readCount>1)await readGate;return Response.json({pieces:[]});}methods.push(options.method);if(options.method==='PUT')await writeGate;return Response.json({saved:options.method==='PUT'});};
    const {attachSaveButtons}=await import('../public/lib/saved.mjs?stale-refresh');await attachSaveButtons(f.root);const saving=f.button.onclick(event),refreshing=attachSaveButtons(f.root,true);releaseWrite();await saving;releaseRead();await refreshing;assert.equal(f.button.attrs.get('aria-pressed'),'true');await f.button.onclick(event);assert.deepEqual(methods,['PUT','DELETE']);
  }finally{f.close();}
});

import {$$,api,toast} from './ui.mjs';
const ids=new Set(),pending=new Set(),changes=new Map();let loaded=false,loadPromise=null,revision=0;
function savedIds(refresh=false){
  if(loadPromise)return loadPromise;if(loaded&&!refresh)return Promise.resolve(ids);
  const started=revision;
  loadPromise=api('/api/saved').then(({pieces})=>{const next=new Set(pieces.map(p=>p.id));for(const [id,change] of changes)if(change.revision>started)change.saved?next.add(id):next.delete(id);ids.clear();next.forEach(id=>ids.add(id));for(const [id,change] of changes)if(change.revision<=started)changes.delete(id);loaded=true;return ids;}).finally(()=>{loadPromise=null;});return loadPromise;
}
export async function attachSaveButtons(root,refresh=false){
  const buttons=$$('[data-save-piece]',root).filter(b=>refresh||!b.dataset.bound);if(!buttons.length)return;
  buttons.forEach(b=>b.dataset.bound='1');
  try{
    await savedIds(refresh);
    for(const b of buttons){if(!b.isConnected)continue;b.disabled=pending.has(b.dataset.savePiece);b.setAttribute('aria-pressed',String(ids.has(b.dataset.savePiece)));b.onclick=async e=>{e.preventDefault();e.stopPropagation();const id=b.dataset.savePiece;if(pending.has(id))return;pending.add(id);b.disabled=true;const wasSaved=ids.has(id);try{const result=await api('/api/saved/'+id,wasSaved?'DELETE':'PUT',{});result.saved?ids.add(id):ids.delete(id);changes.set(id,{saved:result.saved,revision:++revision});toast(result.saved?'Saved. Compare your pieces in Saved.':'Removed from saved pieces.');}catch(error){toast(error.message);}finally{pending.delete(id);for(const x of $$('[data-save-piece]'))if(x.dataset.savePiece===id){x.setAttribute('aria-pressed',String(ids.has(id)));x.disabled=false;}}};}
  }catch{for(const b of buttons){b.disabled=true;b.title='Saved pieces could not be loaded. Refresh to try again.';}}
}

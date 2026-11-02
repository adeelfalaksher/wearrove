import {$$,api,toast} from './ui.mjs';
let idsPromise=null;const pending=new Set();
function savedIds(refresh=false){if(refresh||!idsPromise)idsPromise=api('/api/saved').then(({pieces})=>new Set(pieces.map(p=>p.id))).catch(error=>{idsPromise=null;throw error;});return idsPromise;}
export async function attachSaveButtons(root,refresh=false){
  const buttons=$$('[data-save-piece]',root).filter(b=>refresh||!b.dataset.bound);if(!buttons.length)return;
  buttons.forEach(b=>b.dataset.bound='1');
  try{
    const ids=await savedIds(refresh);
    for(const b of buttons){if(!b.isConnected)continue;b.disabled=pending.has(b.dataset.savePiece);b.setAttribute('aria-pressed',String(ids.has(b.dataset.savePiece)));b.onclick=async e=>{e.preventDefault();e.stopPropagation();const id=b.dataset.savePiece;if(pending.has(id))return;pending.add(id);b.disabled=true;const wasSaved=ids.has(id);try{const result=await api('/api/saved/'+id,wasSaved?'DELETE':'PUT',{});result.saved?ids.add(id):ids.delete(id);toast(result.saved?'Saved. Compare your pieces in Saved.':'Removed from saved pieces.');}catch(error){toast(error.message);}finally{pending.delete(id);for(const x of $$('[data-save-piece]'))if(x.dataset.savePiece===id){x.setAttribute('aria-pressed',String(ids.has(id)));x.disabled=false;}}};}
  }catch{for(const b of buttons){b.disabled=true;b.title='Saved pieces could not be loaded. Refresh to try again.';}}
}

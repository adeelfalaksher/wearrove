// Lookup failures never become an "available" answer. A changed date window
// stops new lookups; callers discard any already-running stale responses.
export async function checkWardrobeAvailability(garments,lookup,isCurrent=()=>true){
  const pieces=garments.filter(g=>!g.archived),results=[];
  let cursor=0,failed=false;
  const worker=async()=>{
    while(cursor<pieces.length&&!failed&&isCurrent()){
      const piece=pieces[cursor++];
      try{
        const available=await lookup(piece);
        if(typeof available!=='boolean')throw new Error('Availability could not be confirmed. Try checking the dates again.');
        results.push([piece.id,available]);
      }catch(error){failed=true;throw error;}
    }
  };
  await Promise.all(Array.from({length:Math.min(4,pieces.length)},worker));
  return isCurrent()?new Map(results):null;
}

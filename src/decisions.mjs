import {Problem,text,identifier} from './domain.mjs';
import {member} from './security.mjs';

const reviewView=r=>r?{decision:r.decision,face_checked:Boolean(r.face_checked),garment_checked:Boolean(r.garment_checked),colour_checked:Boolean(r.colour_checked),notes:r.notes,updated_at:r.updated_at,method:'human'}:null;

export async function savedPieces(db,user){
  const result=await db.prepare(`SELECT g.id,g.circle_id,g.title,g.category,g.size_label,g.colour,g.measurements,g.condition_note,g.care_note,g.asset,g.archived,g.version,g.created_at,c.title AS circle_title,c.care_days,c.is_example,s.created_at AS saved_at
    FROM saved_pieces s JOIN garments g ON g.id=s.garment_id JOIN circles c ON c.id=g.circle_id JOIN members m ON m.circle_id=c.id AND m.user_id=s.user_id
    WHERE s.user_id=? AND (g.archived=0 OR c.owner_id=?) ORDER BY s.created_at DESC LIMIT 30`).bind(user.id,user.id).all();
  return (result.results||[]).map(g=>({...g,photo_url:g.asset?'/assets/'+g.asset:'/api/garments/'+g.id+'/photo'}));
}

export async function savePiece(db,user,id,remove=false){
  identifier(id);
  if(remove){await db.prepare('DELETE FROM saved_pieces WHERE user_id=? AND garment_id=?').bind(user.id,id).run();return {saved:false};}
  const garment=await db.prepare('SELECT id,circle_id,archived FROM garments WHERE id=?').bind(id).first();
  if(!garment)throw new Problem('NOT_FOUND','This piece is not available.',404);
  await member(db,garment.circle_id,user.id);
  if(garment.archived)throw new Problem('ARCHIVED','This piece has been archived.',409);
  await db.batch([
    db.prepare(`DELETE FROM saved_pieces WHERE user_id=? AND NOT EXISTS(
      SELECT 1 FROM garments g JOIN circles c ON c.id=g.circle_id JOIN members m ON m.circle_id=c.id AND m.user_id=saved_pieces.user_id
      WHERE g.id=saved_pieces.garment_id AND (g.archived=0 OR c.owner_id=?))`).bind(user.id,user.id),
    db.prepare(`INSERT OR IGNORE INTO saved_pieces(user_id,garment_id,created_at)
    SELECT ?,g.id,? FROM garments g JOIN members m ON m.circle_id=g.circle_id AND m.user_id=?
    WHERE g.id=? AND g.archived=0 AND (SELECT COUNT(*) FROM saved_pieces WHERE user_id=?)<30`).bind(user.id,Date.now(),user.id,id,user.id)
  ]);
  if(!await db.prepare('SELECT 1 FROM saved_pieces s JOIN garments g ON g.id=s.garment_id JOIN members m ON m.circle_id=g.circle_id AND m.user_id=s.user_id WHERE s.user_id=? AND s.garment_id=?').bind(user.id,id).first())throw new Problem('SAVED_LIMIT','You can save up to 30 pieces. Remove one before adding another.',409);
  return {saved:true};
}

async function previewAccess(db,user,id){
  const job=await db.prepare('SELECT id,user_id,garment_title,garment_id,garment_version,created_at,expires_at,status FROM tryon_jobs WHERE id=? AND user_id=?').bind(identifier(id),user.id).first();
  if(!job)throw new Problem('NOT_FOUND','This private preview could not be found.',404);
  if(job.expires_at<=Date.now()||['cancelled','expired'].includes(job.status))throw new Problem('PREVIEW_EXPIRED','This preview is no longer available.',410);
  if(job.status!=='succeeded')throw new Problem('REVIEW_UNAVAILABLE','Wait for the completed preview before reviewing it.',409);
  return job;
}

export async function previewReview(db,user,id,input){
  await previewAccess(db,user,id);
  if(input!==undefined){
    const checks=['face_checked','garment_checked','colour_checked'];
    if(checks.some(k=>typeof input[k]!=='boolean')||!['ready','concern'].includes(input.decision))throw new Problem('INVALID_REVIEW','Choose a decision and complete each review control.');
    if(input.decision==='ready'&&checks.some(k=>!input[k]))throw new Problem('REVIEW_INCOMPLETE','Check each detail before marking this preview usable.');
    const notes=text(input.notes,'review notes',400,false),now=Date.now();
    const r=await db.prepare(`INSERT INTO preview_reviews(job_id,user_id,decision,face_checked,garment_checked,colour_checked,notes,updated_at)
      SELECT id,user_id,?,?,?,?,?,? FROM tryon_jobs WHERE id=? AND user_id=? AND status='succeeded' AND expires_at>?
      ON CONFLICT(job_id) DO UPDATE SET decision=excluded.decision,face_checked=excluded.face_checked,garment_checked=excluded.garment_checked,colour_checked=excluded.colour_checked,notes=excluded.notes,updated_at=excluded.updated_at
      WHERE EXISTS(SELECT 1 FROM tryon_jobs WHERE id=excluded.job_id AND user_id=excluded.user_id AND status='succeeded' AND expires_at>?)`).bind(input.decision,Number(input.face_checked),Number(input.garment_checked),Number(input.colour_checked),notes,now,id,user.id,now,now).run();
    if(!r.meta?.changes)throw new Problem('PREVIEW_EXPIRED','This preview changed while you were reviewing it. Refresh the page.',410);
  }
  return reviewView(await db.prepare('SELECT decision,face_checked,garment_checked,colour_checked,notes,updated_at FROM preview_reviews WHERE job_id=? AND user_id=?').bind(id,user.id).first());
}

export async function reviewReceipt(db,user,id){
  const job=await previewAccess(db,user,id),review=await previewReview(db,user,id);
  return {project:'Wearrove',exported_at:new Date().toISOString(),preview:{id:job.id,garment_id:job.garment_id,garment_title:job.garment_title,garment_version:job.garment_version,created_at:job.created_at,expires_at:job.expires_at,model:'YouCam clothing v4',kind:'Generated visual illustration'},review,limitations:['The review records the user’s observations. It is not automated identity or image-fidelity verification.','A preview cannot establish physical fit, exact colour, fabric feel or garment condition.','Check current measurements and availability with the owner before borrowing.']};
}

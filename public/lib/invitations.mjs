// Retain invitations issued before the public rebrand. These are exact owned
// production origins, never a suffix match or a destination to fetch/redirect.
const productionOrigins=['https://wearrove.vercel.app','https://borrowloom.vercel.app','https://wearrove-adeelfalaksher900-creators-projects.vercel.app','https://borrowloom-adeelfalaksher900-creators-projects.vercel.app'];
export function parseInvitation(value,currentOrigin){
  let url;try{url=new URL(value);}catch{throw new Error('Paste the complete invitation link.');}
  if(url.username||url.password||![currentOrigin,...productionOrigins].includes(url.origin)||!['/wardrobes','/wardrobes/'].includes(url.pathname))throw new Error('Use an invitation from the Wearrove website.');
  const part=new URLSearchParams(url.hash.slice(1)).get('join')||'',match=/^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.([0-9a-f]{64})$/i.exec(part);
  if(!match)throw new Error('This invitation is incomplete. Ask the owner for the full link.');
  return {circle_id:match[1],invite:match[2]};
}

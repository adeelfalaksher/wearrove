import test from 'node:test';
import assert from 'node:assert/strict';
import {parseInvitation} from '../public/lib/invitations.mjs';
const circle='00000000-0000-4000-8000-000000000001',secret='a'.repeat(64),fragment='#join='+circle+'.'+secret;
test('rebranded and legacy production invitations join the current account without navigating to another host',()=>{
  for(const origin of ['https://wearrove.vercel.app','https://borrowloom.vercel.app','https://wearrove-adeelfalaksher900-creators-projects.vercel.app'])assert.deepEqual(parseInvitation(origin+'/wardrobes'+fragment,'https://wearrove.vercel.app'),{circle_id:circle,invite:secret});
  assert.deepEqual(parseInvitation('http://localhost:3080/wardrobes'+fragment,'http://localhost:3080'),{circle_id:circle,invite:secret});
});
test('invitation parser rejects lookalike hosts, credentials, unrelated paths and malformed capabilities',()=>{
  for(const value of ['https://wearrove.vercel.app.evil.test/wardrobes'+fragment,'https://wearrove.vercel.app@evil.test/wardrobes'+fragment,'https://person@wearrove.vercel.app/wardrobes'+fragment,'https://wearrove.vercel.app/account'+fragment,'https://wearrove.vercel.app/wardrobes#join=broken','http://wearrove.vercel.app/wardrobes'+fragment])assert.throws(()=>parseInvitation(value,'https://wearrove.vercel.app'));
});

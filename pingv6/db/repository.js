'use strict';
const crypto = require('crypto');
const { getPool, transaction } = require('./connection');
function hash(value) { return crypto.createHash('sha256').update(String(value)).digest('hex'); }
async function upsertState(key, value) {
  const p = getPool(); if (!p) throw new Error('Postgres disabled');
  await p.query(`INSERT INTO app_state(state_key,state_value) VALUES($1,$2::jsonb)
    ON CONFLICT(state_key) DO UPDATE SET state_value=EXCLUDED.state_value, version=app_state.version+1, updated_at=now()`, [key, JSON.stringify(value)]);
}
async function readState(key) { const p=getPool(); if(!p) return null; const r=await p.query('SELECT state_value FROM app_state WHERE state_key=$1',[key]); return r.rows[0]?.state_value ?? null; }
async function idempotent(scope, key, fn, ttlMs=24*60*60*1000) {
  const p=getPool(); if(!p) return fn(null);
  return transaction(async c => {
    const existing=await c.query('SELECT response,status_code FROM idempotency_keys WHERE scope=$1 AND idempotency_key=$2 AND expires_at>now() FOR UPDATE',[scope,key]);
    if(existing.rowCount) return { replay:true, response:existing.rows[0].response, statusCode:existing.rows[0].status_code };
    const result=await fn(c);
    await c.query(`INSERT INTO idempotency_keys(scope,idempotency_key,response,status_code,expires_at) VALUES($1,$2,$3,$4,now()+$5::interval)`,[scope,key,JSON.stringify(result.response),result.statusCode||200,`${Math.ceil(ttlMs/1000)} seconds`]);
    return { replay:false,...result };
  });
}
async function audit({actorUserId=null,actorRole=null,action,targetType=null,targetId=null,ip=null,userAgent=null,metadata={}}) {
  const p=getPool(); if(!p) return;
  await p.query(`INSERT INTO audit_events(actor_user_id,actor_role,action,target_type,target_id,ip_hash,user_agent,metadata) VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,[actorUserId,actorRole,action,targetType,targetId,ip?hash(ip):null,userAgent,JSON.stringify(metadata)]);
}
module.exports={hash,upsertState,readState,idempotent,audit};

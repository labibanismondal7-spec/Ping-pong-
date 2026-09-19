'use strict';
const crypto=require('crypto');
const redis=require('../redis/client');
let handlers=new Map();
function register(name,handler){ if(typeof handler!=='function') throw new TypeError('handler required'); handlers.set(name,handler); }
async function enqueue(name,payload,{delayMs=0,maxAttempts=3}={}) {
  const job={id:crypto.randomUUID(),name,payload,attempts:0,maxAttempts,runAt:Date.now()+Math.max(0,delayMs)};
  if(redis.isEnabled()) { const c=redis.getConnection?.(); if(c){ await c.rpush(`${process.env.REDIS_KEY_PREFIX||'pingpong:'}jobs:${name}`,JSON.stringify(job)); return job.id; } }
  setTimeout(()=>run(job),Math.max(0,delayMs)).unref(); return job.id;
}
async function run(job){ const fn=handlers.get(job.name); if(!fn) return; try{await fn(job.payload,job); }catch(e){ job.attempts++; if(job.attempts<job.maxAttempts) setTimeout(()=>run(job),Math.min(30000,500*2**job.attempts)).unref(); else console.error('[jobs] dead job',job.id,e.message); } }
module.exports={register,enqueue,run};

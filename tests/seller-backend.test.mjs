import test from 'node:test';
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';

// Exercise the production backend with real SQLite transactions and streamed R2
// doubles, replacing only the Cloudflare runtime and account guard.
const runtimeMock='data:text/javascript,'+encodeURIComponent(`
 export class HttpError extends Error{constructor(status,message){super(message);this.status=status}}
 export const runtime=()=>globalThis.__sellerTestRuntime;
 export async function guard(){if(!globalThis.__sellerTestAdmin)throw new HttpError(403,'Denied')}
`);
registerHooks({resolve(specifier,context,next){
  if(context.parentURL?.endsWith('/lib/sell-server.ts')){
    if(specifier==='./server')return {url:runtimeMock,shortCircuit:true};
    if(specifier==='./sell-validation')return next(new URL('./sell-validation.ts',context.parentURL).href,context);
  }
  return next(specifier,context);
}});
globalThis.FixedLengthStream=class extends TransformStream{
  constructor(size){let received=0;super({transform(chunk,controller){received+=chunk.byteLength;if(received>size)throw Error('long');controller.enqueue(chunk)},flush(){if(received!==size)throw Error('short')}})}
};
const {uploadSellerMedia,adminSellerList,adminSellerMedia}=await import('../lib/sell-server.ts');
const id='12fa7fc4-46f8-4ab9-880e-000000000001',token='a'.repeat(64),origin='https://hp.example';
const tokenHash=Buffer.from(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token))).toString('hex');
function fixture(){
  const sqlite=new DatabaseSync(':memory:');
  for(const file of readdirSync(new URL('../drizzle/',import.meta.url)).filter(f=>f.endsWith('.sql')).sort())sqlite.exec(readFileSync(new URL('../drizzle/'+file,import.meta.url),'utf8'));
  const db={prepare(sql){let params=[];return {bind(...p){params=p;return this},async first(){return sqlite.prepare(sql).get(...params)||null},async all(){return {results:sqlite.prepare(sql).all(...params)}},async run(){const result=sqlite.prepare(sql).run(...params);return {meta:{changes:Number(result.changes)}}}}},async batch(statements){sqlite.exec('BEGIN');try{const results=[];for(const query of statements)results.push(await query.run());sqlite.exec('COMMIT');return results}catch(error){sqlite.exec('ROLLBACK');throw error}}};
  const stats={stored:0,puts:0,deletes:[],reads:0,startedAtReads:null,cancelled:false};
  const bucket={async put(_key,stream){stats.puts++;stats.startedAtReads=stats.reads;for await(const chunk of stream)stats.stored+=chunk.byteLength;return {}},async delete(key){stats.deletes.push(key)},async get(){return null}};
  globalThis.__sellerTestRuntime={DB:db,BUCKET:bucket};globalThis.__sellerTestAdmin=true;
  sqlite.prepare('INSERT INTO sell_submissions (id,reference,token_hash,data,created_at,expires_at) VALUES (?,?,?,?,?,?)').run(id,'HP-TEST',tokenHash,'{}',new Date().toISOString(),Math.floor(Date.now()/1000)+86400);
  return {sqlite,stats,bucket};
}
function request(stats,{size=2*1024*1024,actual=size,mime='video/mp4',valid=true,declared=String(size)}={}){
  let sent=0;
  const body=new ReadableStream({pull(controller){stats.reads++;if(sent===actual){controller.close();return}const chunk=new Uint8Array(Math.min(65536,actual-sent));if(sent===0&&valid){if(mime==='video/webm')chunk.set([26,69,223,163,0,0,0,0,119,101,98,109]);else chunk.set(new TextEncoder().encode('0000ftypisom0000'))}sent+=chunk.length;controller.enqueue(chunk)},cancel(){stats.cancelled=true}},{highWaterMark:0});
  return new Request(origin+'/api/sell/'+id+'/upload',{method:'POST',duplex:'half',headers:{origin,'content-type':mime,'x-upload-token':token,...(declared?{'content-length':declared}:{})},body});
}
function counters(sqlite){const row=sqlite.prepare('SELECT bytes,videos,photos FROM sell_submissions WHERE id=?').get(id);return {...row}}
test('uploads incrementally with only a signature prefix read before R2 starts',async()=>{
  const {sqlite,stats}=fixture();const response=await uploadSellerMedia(request(stats),id);
  assert.equal(response.status,201);assert.equal(stats.stored,2*1024*1024);assert.equal(stats.startedAtReads,1);
  assert.deepEqual(counters(sqlite),{bytes:2*1024*1024,videos:1,photos:0});
  assert.equal(sqlite.prepare('SELECT state FROM sell_media').get().state,'ready');sqlite.close();
});
test('WebM prefix works across small transport chunks without dropping any bytes',async()=>{
  const {sqlite,stats}=fixture();const bytes=new Uint8Array(5000);bytes.set([26,69,223,163]);bytes.set(new TextEncoder().encode('webm'),80);let offset=0;
  const body=new ReadableStream({pull(c){if(offset===bytes.length){c.close();return}const end=Math.min(offset+3,bytes.length);c.enqueue(bytes.slice(offset,end));offset=end}},{highWaterMark:0});
  const req=new Request(origin+'/api/sell/'+id+'/upload',{method:'POST',duplex:'half',headers:{origin,'content-type':'video/webm','content-length':'5000','x-upload-token':token},body});
  assert.equal((await uploadSellerMedia(req,id)).status,201);assert.equal(stats.stored,5000);sqlite.close();
});
test('incorrect declared lengths fail and release durable reservations',async()=>{
  for(const actual of [65536,196608]){
    const {sqlite,stats}=fixture();await assert.rejects(uploadSellerMedia(request(stats,{size:131072,actual}),id));
    assert.deepEqual(counters(sqlite),{bytes:0,videos:0,photos:0});assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM sell_media').get().n,0);assert.equal(stats.deletes.length,1);sqlite.close();
  }
});
test('rejects missing size and forged media before reserving storage',async()=>{
  for(const options of [{declared:''},{valid:false}]){
    const {sqlite,stats}=fixture();await assert.rejects(uploadSellerMedia(request(stats,options),id));assert.equal(stats.puts,0);assert.deepEqual(counters(sqlite),{bytes:0,videos:0,photos:0});sqlite.close();
  }
});
test('quota denial cancels the source and does not store anything',async()=>{
  const {sqlite,stats}=fixture();sqlite.prepare('UPDATE sell_submissions SET videos=2').run();await assert.rejects(uploadSellerMedia(request(stats),id),{status:409});assert.equal(stats.puts,0);assert.equal(stats.cancelled,true);sqlite.close();
});
test('R2 failures cancel the request and remove reserved metadata',async()=>{
  const {sqlite,stats,bucket}=fixture();bucket.put=async()=>{throw Error('R2 unavailable')};await assert.rejects(uploadSellerMedia(request(stats),id));assert.equal(stats.cancelled,true);assert.deepEqual(counters(sqlite),{bytes:0,videos:0,photos:0});assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM sell_media').get().n,0);sqlite.close();
});
test('deletion during upload cannot leave a newly ready private object',async()=>{
  const {sqlite,stats,bucket}=fixture();const original=bucket.put;bucket.put=async(...args)=>{sqlite.prepare("UPDATE sell_submissions SET status='deleting'").run();return original(...args)};
  await assert.rejects(uploadSellerMedia(request(stats),id),{status:409});assert.equal(stats.deletes.length,1);assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM sell_media').get().n,0);sqlite.close();
});
test('expired requests are hidden from admin list and protected media lookup',async()=>{
  const {sqlite}=fixture();sqlite.prepare("UPDATE sell_submissions SET submitted_at=?,status='new',expires_at=1 WHERE id=?").run(new Date().toISOString(),id);
  sqlite.prepare("INSERT INTO sell_media (id,submission_id,key,mime,size,state,created_at) VALUES ('m',?,'private','image/jpeg',20,'ready','now')").run(id);
  assert.deepEqual((await (await adminSellerList()).json()).submissions,[]);
  await assert.rejects(adminSellerMedia(new Request(origin),id,'m'),{status:404});sqlite.close();
});
test('anonymous users cannot list submitted requests',async()=>{
  const {sqlite}=fixture();globalThis.__sellerTestAdmin=false;await assert.rejects(adminSellerList(),{status:403});sqlite.close();
});

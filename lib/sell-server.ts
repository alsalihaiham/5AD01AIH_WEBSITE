import {runtime,guard,HttpError} from './server';
import {allowedSellerMime,matchesFileSignature,SELL_LIMITS,sellerInput} from './sell-validation';

type SubmissionRow={id:string;reference:string;token_hash:string;status:string;data:string;created_at:string;submitted_at:string|null;expires_at:number;bytes:number;photos:number;videos:number};
type MediaRow={id:string;submission_id:string;key:string;mime:string;size:number;state:string;created_at:string};
const nowSeconds=()=>Math.floor(Date.now()/1000);
const privateHeaders={'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'};
export function privateJson(data:unknown,status=200){return Response.json(data,{status,headers:privateHeaders})}
export function sellFail(error:unknown){return privateJson({error:error instanceof HttpError?error.message:'Dit lukt momenteel niet. Probeer opnieuw.'},error instanceof HttpError?error.status:500)}
export function sameOrigin(req:Request){
  const origin=req.headers.get('origin');
  if(!origin||origin!==new URL(req.url).origin||req.headers.get('sec-fetch-site')==='cross-site')throw new HttpError(403,'Deze aanvraag komt niet van onze website.');
}
async function hash(value:string){const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));return [...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,'0')).join('')}
async function rateLimit(req:Request,action:'create'|'upload'|'submit'){
  const db=runtime().DB,now=nowSeconds();
  // CF-Connecting-IP is set by Cloudflare at the edge. Never store the raw address.
  // Local development shares one bounded bucket when that header is unavailable.
  const ip=req.headers.get('cf-connecting-ip')||'local';
  const limits=action==='create'?[6,15]:action==='upload'?[80,200]:[30,80];
  for(const [i,window] of [3600,86400].entries()){
    const slot=Math.floor(now/window),key=await hash(`${new URL(req.url).hostname}|${ip}|${action}|${window}|${slot}`);
    const result=await db.prepare('INSERT INTO sell_rate_limits (key,count,expires_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 WHERE count < ? RETURNING count').bind(key,(slot+1)*window,limits[i]).first();
    if(!result)throw new HttpError(429,'Te veel aanvragen. Probeer later opnieuw.');
  }
  await db.prepare('DELETE FROM sell_rate_limits WHERE key IN (SELECT key FROM sell_rate_limits WHERE expires_at < ? LIMIT 100)').bind(now).run();
}
export async function boundedBody(req:Request,limit:number):Promise<Uint8Array>{
  const claimed=req.headers.get('content-length');
  if(claimed&&(!/^\d+$/.test(claimed)||Number(claimed)>limit))throw new HttpError(413,'Het bestand of de aanvraag is te groot.');
  if(!req.body)throw new HttpError(400,'Lege aanvraag.');
  const reader=req.body.getReader(),chunks:Uint8Array[]=[];let size=0;
  try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>limit){await reader.cancel();throw new HttpError(413,'Het bestand of de aanvraag is te groot.')}chunks.push(value)}}finally{reader.releaseLock()}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength}return bytes;
}
export async function sellJsonBody(req:Request){
  if(req.headers.get('content-type')?.split(';')[0]!=='application/json')throw new HttpError(415,'Verwacht een JSON-aanvraag.');
  const bytes=await boundedBody(req,60000);try{return JSON.parse(new TextDecoder().decode(bytes))}catch{throw new HttpError(400,'Ongeldige invoer.')}
}
async function tokenSubmission(req:Request,id:string){
  const token=req.headers.get('x-upload-token')||'';
  if(!/^[0-9a-f-]{36}$/.test(id)||!/^\w{64}$/.test(token))throw new HttpError(403,'Deze aanvraag is niet geldig of is verlopen.');
  const row=await runtime().DB.prepare('SELECT * FROM sell_submissions WHERE id=? AND token_hash=? AND expires_at>?').bind(id,await hash(token),nowSeconds()).first<SubmissionRow>();
  if(!row||row.status==='deleting')throw new HttpError(403,'Deze aanvraag is niet geldig of is verlopen.');return row;
}
async function removeSubmission(id:string){
  const db=runtime().DB;
  // Stop new reservations before listing objects; any in-flight upload detects this
  // tombstone before becoming ready and removes its own object.
  await db.prepare("UPDATE sell_submissions SET status='deleting' WHERE id=?").bind(id).run();
  const {results}=await db.prepare('SELECT key FROM sell_media WHERE submission_id=?').bind(id).all<{key:string}>();
  if(results.length)await runtime().BUCKET.delete(results.map(r=>r.key));
  await db.batch([db.prepare('DELETE FROM sell_media WHERE submission_id=?').bind(id),db.prepare('DELETE FROM sell_submissions WHERE id=?').bind(id)]);
}
async function expireOldDrafts(){
  const {results}=await runtime().DB.prepare('SELECT id FROM sell_submissions WHERE expires_at < ? LIMIT 5').bind(nowSeconds()).all<{id:string}>();
  for(const row of results)await removeSubmission(row.id);
}
export async function createSellerSubmission(req:Request){
  sameOrigin(req);await rateLimit(req,'create');
  const parsed=sellerInput.safeParse(await sellJsonBody(req));
  if(!parsed.success)throw new HttpError(400,'Controleer uw voertuiggegevens, contactgegevens en toestemming.');
  await expireOldDrafts();
  const id=crypto.randomUUID(),token=Array.from(crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,'0')).join('');
  const reference='HP-'+id.replace(/-/g,'').slice(0,12).toUpperCase(),createdAt=new Date().toISOString();
  const data={...parsed.data};delete data.website;
  await runtime().DB.prepare('INSERT INTO sell_submissions (id,reference,token_hash,status,data,created_at,expires_at,bytes,photos,videos) VALUES (?,?,?,?,?,?,?,0,0,0)').bind(id,reference,await hash(token),'draft',JSON.stringify(data),createdAt,nowSeconds()+86400).run();
  return privateJson({id,token},201);
}
// Inspect a small prefix, then forward the request with backpressure. We never
// concatenate a whole video: at most 4 KiB plus one transport chunk is retained.
async function sellerUploadStream(req:Request,mime:string,size:number){
  if(!req.body)throw new HttpError(400,'Leeg bestand.');
  const reader=req.body.getReader(),prefix=new Uint8Array(Math.min(size,mime==='video/webm'?4096:12));
  const buffered:Uint8Array[]=[];let count=0,filled=0,ended=false,released=false;
  const release=()=>{if(!released){released=true;reader.releaseLock()}};
  const cancel=async(reason?:unknown)=>{if(released)return;try{await reader.cancel(reason)}finally{release()}};
  try{
    while(filled<prefix.length){
      const next=await reader.read();
      if(next.done){ended=true;break}
      count+=next.value.byteLength;
      if(count>size)throw new HttpError(413,'Het bestand is groter dan de opgegeven bestandsgrootte.');
      buffered.push(next.value);
      const take=Math.min(next.value.byteLength,prefix.length-filled);prefix.set(next.value.subarray(0,take),filled);filled+=take;
    }
    if(!matchesFileSignature(mime,prefix.subarray(0,filled)))throw new HttpError(415,'Het bestand komt niet overeen met het gekozen formaat.');
    if(ended&&count!==size)throw new HttpError(400,'Het bestand werd onvolledig ontvangen.');
  }catch(error){await cancel(error);throw error}
  const stream=new ReadableStream<Uint8Array>({
    async pull(controller){
      try{
        const initial=buffered.shift();if(initial){controller.enqueue(initial);return}
        if(!ended){const next=await reader.read();if(!next.done){count+=next.value.byteLength;if(count>size)throw new HttpError(413,'Het bestand is groter dan de opgegeven bestandsgrootte.');controller.enqueue(next.value);return}ended=true}
        if(count!==size)throw new HttpError(400,'Het bestand werd onvolledig ontvangen.');
        release();controller.close();
      }catch(error){await cancel(error);controller.error(error)}
    },cancel,
  },{highWaterMark:0});
  return stream;
}
export async function uploadSellerMedia(req:Request,id:string){
  sameOrigin(req);const row=await tokenSubmission(req,id);if(row.status!=='draft')throw new HttpError(409,'Deze aanvraag werd al verstuurd.');
  await rateLimit(req,'upload');
  const mime=(req.headers.get('content-type')||'').split(';')[0].toLowerCase();
  if(!(allowedSellerMime as readonly string[]).includes(mime))throw new HttpError(415,'Kies JPG, PNG, WebP, MP4 of WebM.');
  const video=mime.startsWith('video/'),limit=video?SELL_LIMITS.videoBytes:SELL_LIMITS.photoBytes;
  const declared=req.headers.get('content-length');
  if(!declared||!/^\d+$/.test(declared))throw new HttpError(411,'De bestandsgrootte ontbreekt. Kies het bestand opnieuw.');
  const size=Number(declared);
  if(!Number.isSafeInteger(size)||size<12||size>limit)throw new HttpError(413,video?'Video: maximaal 50 MB.':'Foto: maximaal 12 MB.');
  const source=await sellerUploadStream(req,mime,size);
  const mediaId=crypto.randomUUID(),key=`sell-private/${id}/${mediaId}`,db=runtime().DB,field=video?'videos':'photos';
  // D1 batch is transactional. The conditional INSERT is coupled to the quota
  // UPDATE through SQLite changes(), so parallel uploads cannot exceed limits.
  let reserved=false;
  try{
  const reservation=await db.batch([
    db.prepare(`UPDATE sell_submissions SET bytes=bytes+?,${field}=${field}+1 WHERE id=? AND status='draft' AND expires_at>? AND bytes+?<=? AND ${field}<?`).bind(size,id,nowSeconds(),size,SELL_LIMITS.totalBytes,video?SELL_LIMITS.videos:SELL_LIMITS.photos),
    db.prepare("INSERT INTO sell_media (id,submission_id,key,mime,size,state,created_at) SELECT ?,?,?,?,?,'pending',? WHERE changes()=1").bind(mediaId,id,key,mime,size,new Date().toISOString()),
  ]);
  if(!reservation[1].meta.changes)throw new HttpError(409,'Uploadlimiet bereikt: maximaal 20 foto’s, 2 video’s en samen 120 MB.');
    reserved=true;
    const fixed=new FixedLengthStream(size),abort=new AbortController();
    const storing=Promise.resolve().then(()=>runtime().BUCKET.put(key,fixed.readable,{httpMetadata:{contentType:mime,cacheControl:'private, no-store'}})).catch(async error=>{abort.abort(error);await fixed.readable.cancel(error).catch(()=>{});throw error});
    const forwarding=source.pipeTo(fixed.writable,{signal:abort.signal});
    // Wait for both ends before deletion on failure, so a late R2 put cannot
    // recreate an object after cleanup has already removed its database row.
    const outcomes=await Promise.allSettled([storing,forwarding]);
    const failure=outcomes.find(outcome=>outcome.status==='rejected');
    if(failure?.status==='rejected')throw failure.reason;
    const ready=await db.prepare("UPDATE sell_media SET state='ready' WHERE id=? AND EXISTS (SELECT 1 FROM sell_submissions WHERE id=? AND status='draft' AND expires_at>?) RETURNING id").bind(mediaId,id,nowSeconds()).first();
    if(!ready)throw new HttpError(409,'Deze aanvraag is niet meer beschikbaar.');
    return privateJson({media:{id:mediaId,type:video?'video':'image',mime,size}},201);
  }catch(error){
    if(!source.locked)await source.cancel(error).catch(()=>{});
    if(!reserved)throw error;
    // Keep the pending row if object deletion is unavailable: expiry cleanup
    // can retry using its key, instead of orphaning a private object forever.
    try{await runtime().BUCKET.delete(key)}catch{throw error}
    await db.batch([
      db.prepare('DELETE FROM sell_media WHERE id=?').bind(mediaId),
      db.prepare(`UPDATE sell_submissions SET bytes=MAX(0,bytes-?),${field}=MAX(0,${field}-1) WHERE id=? AND changes()=1`).bind(size,id),
    ]);
    throw error;
  }
}
export async function submitSellerSubmission(req:Request,id:string){
  sameOrigin(req);const row=await tokenSubmission(req,id);await rateLimit(req,'submit');
  if(row.submitted_at)return privateJson({reference:row.reference});
  const result=await runtime().DB.prepare("UPDATE sell_submissions SET status='new',submitted_at=?,expires_at=? WHERE id=? AND status='draft' AND expires_at>? AND photos>=1 AND photos+videos=(SELECT COUNT(*) FROM sell_media WHERE submission_id=? AND state='ready') RETURNING reference").bind(new Date().toISOString(),nowSeconds()+180*86400,id,nowSeconds(),id).first<{reference:string}>();
  if(!result)throw new HttpError(409,'Voeg minstens één foto toe en wacht tot alle uploads klaar zijn.');
  return privateJson(result);
}
export async function adminSellerList(){
  await guard();const db=runtime().DB,now=nowSeconds();
  const {results}=await db.prepare("SELECT id,reference,status,data,created_at,submitted_at FROM sell_submissions WHERE submitted_at IS NOT NULL AND expires_at>? AND status!='deleting' ORDER BY submitted_at DESC LIMIT 200").bind(now).all<SubmissionRow>();
  const {results:allMedia}=await db.prepare("SELECT id,submission_id,mime,size FROM sell_media WHERE state='ready' AND submission_id IN (SELECT id FROM sell_submissions WHERE submitted_at IS NOT NULL AND expires_at>? AND status!='deleting' ORDER BY submitted_at DESC LIMIT 200) ORDER BY created_at,id").bind(now).all<MediaRow>();
  const grouped=new Map<string,MediaRow[]>();
  for(const media of allMedia){const list=grouped.get(media.submission_id)||[];list.push(media);grouped.set(media.submission_id,list)}
  const submissions=results.map(row=>({id:row.id,reference:row.reference,status:row.status,data:JSON.parse(row.data),createdAt:row.created_at,submittedAt:row.submitted_at,media:(grouped.get(row.id)||[]).map(m=>({id:m.id,type:m.mime.startsWith('video/')?'video':'image',mime:m.mime,size:m.size,url:`/api/admin/submissions/${row.id}/media/${m.id}`}))}));
  return privateJson({submissions});
}
export async function adminSellerUpdate(req:Request,id:string){
  await guard(req);sameOrigin(req);const data=await sellJsonBody(req);
  if(!['new','contacted','closed'].includes(data?.status))throw new HttpError(400,'Ongeldige status.');
  const row=await runtime().DB.prepare("UPDATE sell_submissions SET status=? WHERE id=? AND submitted_at IS NOT NULL AND status!='deleting' AND expires_at>? RETURNING id,status").bind(data.status,id,nowSeconds()).first();
  if(!row)throw new HttpError(404,'Aanvraag niet gevonden.');return privateJson(row);
}
export async function adminSellerDelete(req:Request,id:string){await guard(req);sameOrigin(req);await removeSubmission(id);return privateJson({deleted:true})}
export async function adminSellerMedia(req:Request,id:string,mediaId:string){
  await guard();const row=await runtime().DB.prepare("SELECT m.key,m.mime,m.size FROM sell_media m JOIN sell_submissions s ON s.id=m.submission_id WHERE m.id=? AND m.submission_id=? AND m.state='ready' AND s.submitted_at IS NOT NULL AND s.status!='deleting' AND s.expires_at>?").bind(mediaId,id,nowSeconds()).first<MediaRow>();
  if(!row)throw new HttpError(404,'Bestand niet gevonden.');
  const rangeHeader=req.headers.get('range');let range:{offset:number;length:number}|undefined;
  if(rangeHeader){
    const match=/^bytes=(\d*)-(\d*)$/.exec(rangeHeader);
    if(!match||(!match[1]&&!match[2]))return new Response(null,{status:416,headers:{...privateHeaders,'Content-Range':`bytes */${row.size}`}});
    const offset=match[1]?Number(match[1]):Math.max(0,row.size-Number(match[2]));
    const end=match[1]?(match[2]?Math.min(Number(match[2]),row.size-1):row.size-1):row.size-1;
    if(!Number.isSafeInteger(offset)||!Number.isSafeInteger(end)||offset>=row.size||end<offset)return new Response(null,{status:416,headers:{...privateHeaders,'Content-Range':`bytes */${row.size}`}});
    range={offset,length:end-offset+1};
  }
  const object=await runtime().BUCKET.get(row.key,range?{range}:undefined);
  if(!object)throw new HttpError(404,'Bestand niet gevonden.');
  const headers=new Headers({...privateHeaders,'Content-Type':row.mime,'Accept-Ranges':'bytes','Content-Length':String(range?.length??object.size),'ETag':object.httpEtag,'Content-Disposition':'inline','Content-Security-Policy':"default-src 'none'; sandbox"});
  if(range)headers.set('Content-Range',`bytes ${range.offset}-${range.offset+range.length-1}/${object.size}`);
  return new Response(object.body,{status:range?206:200,headers});
}

import {guard,fail,runtime,getCar,HttpError} from '@/lib/server';

const TYPES=['image/jpeg','image/png','image/webp','video/mp4','video/quicktime','video/webm'];

// Checks the first bytes, so a renamed file cannot pretend to be a photo.
function matches(type:string,bytes:Uint8Array){
  const ascii=new TextDecoder('latin1').decode(bytes.slice(0,16));
  if(type==='image/jpeg')return bytes[0]===255&&bytes[1]===216;
  if(type==='image/png')return bytes[0]===137&&ascii.slice(1,4)==='PNG';
  if(type==='image/webp')return ascii.startsWith('RIFF')&&ascii.slice(8,12)==='WEBP';
  if(type==='video/mp4'||type==='video/quicktime')return ['ftyp','moov','wide','mdat','free'].includes(ascii.slice(4,8));
  return bytes[0]===26&&bytes[1]===69&&bytes[2]===223&&bytes[3]===163;
}

export async function POST(req:Request){
  let stored:string|undefined;
  try{
    await guard(req);
    const carId=new URL(req.url).searchParams.get('carId')||'';
    if(!await getCar(carId,true))throw new HttpError(404,'Bewaar eerst uw wagen.');
    const type=req.headers.get('content-type')?.split(';')[0]||'';
    const video=type.startsWith('video/');
    const limit=video?50*1024*1024:12*1024*1024;
    if(!TYPES.includes(type))throw new HttpError(415,'Kies een foto (JPG, PNG, WebP) of een video (MP4, MOV, WebM).');
    const size=Number(req.headers.get('content-length'))||0;
    if(size>limit)throw new HttpError(413,video?'Video: maximaal 50 MB.':'Foto: maximaal 12 MB.');
    if(!req.body)throw new HttpError(400,'Leeg bestand.');
    const reader=req.body.getReader();
    const first=await reader.read();
    const bytes=first.value||new Uint8Array();
    if(!bytes.length)throw new HttpError(400,'Leeg bestand.');
    if(!matches(type,bytes))throw new HttpError(415,'Dit bestand komt niet overeen met het gekozen formaat.');
    const id=crypto.randomUUID();
    const key='cars/'+carId+'/'+id;
    let count=bytes.length;
    if(size){
      // Known size: stream straight into storage.
      const stream=new ReadableStream({start(c){c.enqueue(bytes)},async pull(c){const r=await reader.read();if(r.done){c.close();return}count+=r.value.length;if(count>limit){await reader.cancel();c.error(new Error('File too large'));return}c.enqueue(r.value)},cancel(){return reader.cancel()}});
      const fixed=new FixedLengthStream(size);
      await Promise.all([runtime().BUCKET.put(key,fixed.readable,{httpMetadata:{contentType:type}}),stream.pipeTo(fixed.writable)]);
    }else{
      // Some phones and proxies send no size: collect the file (within the limit) first.
      const parts=[bytes];
      for(;;){const r=await reader.read();if(r.done)break;count+=r.value.length;if(count>limit){await reader.cancel();throw new HttpError(413,video?'Video: maximaal 50 MB.':'Foto: maximaal 12 MB.')}parts.push(r.value)}
      const all=new Uint8Array(count);let at=0;for(const p of parts){all.set(p,at);at+=p.length}
      await runtime().BUCKET.put(key,all,{httpMetadata:{contentType:type}});
    }
    stored=key;
    await runtime().DB.prepare('INSERT INTO media (id,car_id,key,mime,size) VALUES (?,?,?,?,?)').bind(id,carId,key,type,count).run();
    return Response.json({media:{id,url:'/api/media/'+id,type:video?'video':'image',alt:video?'Video van de wagen':'Foto van de wagen'}});
  }catch(e){
    if(stored)await runtime().BUCKET.delete(stored).catch(()=>{});
    return fail(e);
  }
}

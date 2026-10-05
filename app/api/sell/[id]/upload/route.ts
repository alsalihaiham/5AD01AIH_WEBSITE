import {uploadSellerMedia,sellFail} from '@/lib/sell-server';
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){try{return await uploadSellerMedia(req,(await params).id)}catch(e){return sellFail(e)}}

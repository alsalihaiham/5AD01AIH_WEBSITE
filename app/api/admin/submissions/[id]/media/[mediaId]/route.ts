import {adminSellerMedia,sellFail} from '@/lib/sell-server';
export async function GET(req:Request,{params}:{params:Promise<{id:string;mediaId:string}>}){try{const {id,mediaId}=await params;return await adminSellerMedia(req,id,mediaId)}catch(e){return sellFail(e)}}

import {adminSellerUpdate,adminSellerDelete,sellFail} from '@/lib/sell-server';
export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){try{return await adminSellerUpdate(req,(await params).id)}catch(e){return sellFail(e)}}
export async function DELETE(req:Request,{params}:{params:Promise<{id:string}>}){try{return await adminSellerDelete(req,(await params).id)}catch(e){return sellFail(e)}}

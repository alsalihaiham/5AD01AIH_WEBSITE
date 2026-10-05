import {adminSellerList,sellFail} from '@/lib/sell-server';
export async function GET(){try{return await adminSellerList()}catch(e){return sellFail(e)}}

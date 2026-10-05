import {createSellerSubmission,sellFail} from '@/lib/sell-server';
export async function POST(req:Request){try{return await createSellerSubmission(req)}catch(e){return sellFail(e)}}

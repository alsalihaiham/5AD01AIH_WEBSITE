import {z} from 'zod';

export const SELL_LIMITS={photos:20,videos:2,photoBytes:12*1024*1024,videoBytes:50*1024*1024,totalBytes:120*1024*1024} as const;
export const sellerInput=z.object({
  brand:z.string().trim().min(1).max(60),model:z.string().trim().min(1).max(80),variant:z.string().trim().max(120).default(''),
  registration:z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/).refine(s=>s>='1900-01'&&s<=new Date().toISOString().slice(0,7),'Controleer de eerste inschrijving.'),
  km:z.number().int().min(0).max(3000000),
  fuel:z.enum(['Benzine','Diesel','Hybride','Elektrisch','LPG','Andere']),
  transmission:z.enum(['Automaat','Manueel']),
  body:z.enum(['Berline','Break','SUV','Hatchback','Coupé','Cabrio','Monovolume','Bestelwagen','Andere']),
  colour:z.string().trim().max(50).default(''),power:z.number().int().min(0).max(2000).optional(),
  co2:z.number().int().min(0).max(1500).optional(),euroStandard:z.string().trim().max(40).default(''),
  doors:z.number().int().min(1).max(7).optional(),seats:z.number().int().min(1).max(9).optional(),owners:z.number().int().min(1).max(30).optional(),
  serviceHistory:z.enum(['full','partial','none','unknown']).default('unknown'),
  damage:z.string().trim().max(3000).default(''),description:z.string().trim().min(10).max(10000),
  expectedPrice:z.number().min(0).max(10000000).optional(),equipment:z.array(z.string().trim().min(1).max(100)).max(80).default([]),
  name:z.string().trim().min(2).max(100),email:z.string().trim().email().max(254),
  phone:z.string().trim().max(40).default(''),postcode:z.string().trim().min(2).max(16),
  language:z.enum(['nl','fr','en']).default('nl'),consent:z.literal(true),
  website:z.string().max(0).optional(), // Honeypot; real visitors leave it empty.
});
export type SellerInput=z.infer<typeof sellerInput>;
export const allowedSellerMime=['image/jpeg','image/png','image/webp','video/mp4','video/webm'] as const;
export function matchesFileSignature(mime:string,b:Uint8Array):boolean {
  if(b.length<12)return false;
  const ascii=(from:number,to:number)=>String.fromCharCode(...b.slice(from,to));
  switch(mime){
    case 'image/jpeg':return b[0]===255&&b[1]===216&&b[2]===255;
    case 'image/png':return b[0]===137&&ascii(1,4)==='PNG'&&b[4]===13&&b[5]===10&&b[6]===26&&b[7]===10;
    case 'image/webp':return ascii(0,4)==='RIFF'&&ascii(8,12)==='WEBP';
    case 'video/mp4':return ascii(4,8)==='ftyp'&&['isom','iso2','mp41','mp42','avc1','M4V ','MSNV','dash'].includes(ascii(8,12));
    case 'video/webm':return b[0]===26&&b[1]===69&&b[2]===223&&b[3]===163&&ascii(0,Math.min(b.length,4096)).includes('webm');
    default:return false;
  }
}

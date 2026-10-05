import {env} from 'cloudflare:workers';
import {headers} from 'next/headers';
import {redirect} from 'next/navigation';
import {getChatGPTUser, chatGPTSignInPath} from '@/app/chatgpt-auth';
import {verifyAccessToken} from './access';
import {demoCar} from './demo';
import type {Car} from './types';
export type Runtime={DB:D1Database;BUCKET:R2Bucket;ADMIN_EMAILS?:string;ANTHROPIC_API_KEY?:string;ANTHROPIC_MODEL?:string;TEAM_DOMAIN?:string;POLICY_AUD?:string};
export const runtime=()=>env as unknown as Runtime;
const loopback=(host:string|null)=>/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host||'');
/** Who is signed in. On the live site only a token signed by Cloudflare Access counts; plain identity headers are accepted on this computer only. */
export async function identity():Promise<{email:string}|null>{const env=runtime(),h=await headers();if(env.TEAM_DOMAIN&&env.POLICY_AUD){const cookie=(h.get('cookie')||'').match(/(?:^|;\s*)CF_Authorization=([^;]+)/)?.[1];const email=await verifyAccessToken(h.get('cf-access-jwt-assertion')||cookie,env.TEAM_DOMAIN,env.POLICY_AUD);return email?{email}:null}return loopback(h.get('host'))?await getChatGPTUser():null}
export async function requireIdentity(returnTo:string):Promise<{email:string}|null>{const user=await identity();if(user)return user;if(!runtime().TEAM_DOMAIN&&loopback((await headers()).get('host')))redirect(chatGPTSignInPath(returnTo));return null}
export const logoutPath=async()=>runtime().TEAM_DOMAIN?'/cdn-cgi/access/logout':'/signout-with-chatgpt?return_to=/';
export async function adminUser(){const user=await identity();const allowed=(runtime().ADMIN_EMAILS||'').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);return user&&allowed.includes(user.email.toLowerCase())?user:null}
export async function guard(req?:Request){if(!await adminUser())throw new HttpError(403,'U hebt geen toegang tot het beheer. Meld u aan met een toegelaten account.');if(req&&req.method!=='GET'){const origin=req.headers.get('origin');if(origin&&origin!==new URL(req.url).origin)throw new HttpError(403,'Deze aanvraag komt niet van onze website.')} }
export class HttpError extends Error{constructor(public status:number,message:string){super(message)}}
export function fail(e:unknown){if(e instanceof HttpError)return Response.json({error:e.message},{status:e.status});console.error('Request failed',e instanceof Error?e.message:'unknown');return Response.json({error:'Dit lukt momenteel niet. Uw invoer blijft behouden. Probeer opnieuw.'},{status:500})}
export async function jsonBody(req:Request){if(!req.headers.get('content-type')?.includes('application/json'))throw new HttpError(415,'Verwacht een JSON-aanvraag.');const text=await req.text();if(text.length>60000)throw new HttpError(413,'Te veel tekst.');try{return JSON.parse(text)}catch{throw new HttpError(400,'Ongeldige invoer.')}}
export async function seed(){const db=runtime().DB;if(!db)throw new Error('Database unavailable');await db.prepare('INSERT OR IGNORE INTO cars (id,slug,status,data,updated_at) VALUES (?,?,?,?,?)').bind(demoCar.id,demoCar.slug,demoCar.status,JSON.stringify(demoCar),demoCar.updatedAt).run()}
export async function listCars(admin=false):Promise<Car[]>{await seed();const {results}=await runtime().DB.prepare(admin?"SELECT data,status,updated_at FROM cars WHERE status != 'archived' ORDER BY updated_at DESC":"SELECT data,status,updated_at FROM cars WHERE status IN ('published','sold') ORDER BY updated_at DESC").all<{data:string,status:Car['status'],updated_at:string}>();return results.map(r=>({...JSON.parse(r.data),status:r.status,updatedAt:r.updated_at,translations:JSON.parse(r.data).translations||(JSON.parse(r.data).demo?demoCar.translations:undefined)}))}
export async function getCar(key:string,admin=false):Promise<Car|null>{await seed();const row=await runtime().DB.prepare('SELECT data,status,updated_at FROM cars WHERE (slug=? OR id=?) AND status != ?').bind(key,key,'archived').first<{data:string,status:Car['status'],updated_at:string}>();if(!row||(!admin&&row.status==='draft'))return null;return {...JSON.parse(row.data),status:row.status,updatedAt:row.updated_at,translations:JSON.parse(row.data).translations||(JSON.parse(row.data).demo?demoCar.translations:undefined)}}

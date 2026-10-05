import {requireChatGPTUser} from '@/app/chatgpt-auth';
import {adminUser,listCars,runtime} from '@/lib/server';
import Admin from '@/components/auto/admin';
import {Brand} from '@/components/auto/shell';
export const dynamic='force-dynamic';
export const metadata={title:'Beheer',robots:{index:false,follow:false}};
export default async function AdminPage(){const user=await requireChatGPTUser('/beheer');if(!await adminUser())return <main className="access-page"><Brand/><h1>Alleen voor het team.</h1><p>U bent aangemeld als {user.email}, maar dit account heeft geen beheertoegang.</p><a className="button button-dark" href="/signout-with-chatgpt?return_to=/beheer" target="_top">Ander account gebruiken</a><a href="/">Terug naar de website</a></main>;return <Admin initial={await listCars(true)} email={user.email} aiConfigured={!!runtime().ANTHROPIC_API_KEY}/>}

import {requireChatGPTUser} from '@/app/chatgpt-auth';
import {adminUser} from '@/lib/server';
import Submissions from '@/components/auto/submissions';
export const dynamic='force-dynamic';
export const metadata={title:'Verkoopaanvragen — beheer',robots:{index:false,follow:false}};
export default async function Page(){const user=await requireChatGPTUser('/beheer/aanvragen');if(!await adminUser())return <main className="access-page"><h1>Geen toegang</h1><p>Uw account heeft geen beheertoegang.</p><a href="/">Terug naar de website</a></main>;return <Submissions email={user.email}/>}

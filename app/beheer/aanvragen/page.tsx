import {adminUser,requireIdentity,logoutPath} from '@/lib/server';
import Submissions from '@/components/auto/submissions';
export const dynamic='force-dynamic';
export const metadata={title:'Verkoopaanvragen — beheer',robots:{index:false,follow:false}};
export default async function Page(){const user=await requireIdentity('/beheer/aanvragen');if(!user)return <main className="access-page"><h1>Aanmelden vereist</h1><p>Open deze pagina via de beveiligde aanmelding.</p><a href="/">Terug naar de website</a></main>;if(!await adminUser())return <main className="access-page"><h1>Geen toegang</h1><p>Uw account heeft geen beheertoegang.</p><a href="/">Terug naar de website</a></main>;return <Submissions email={user.email} logoutHref={await logoutPath()}/>}

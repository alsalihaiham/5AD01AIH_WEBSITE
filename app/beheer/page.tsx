import {adminUser,listCars,runtime,requireIdentity,logoutPath} from '@/lib/server';
import Admin from '@/components/auto/admin';
import {Brand} from '@/components/auto/shell';
export const dynamic='force-dynamic';
export const metadata={title:'Beheer',robots:{index:false,follow:false}};
export default async function AdminPage(){const user=await requireIdentity('/beheer');const logout=await logoutPath();if(!user)return <main className="access-page"><Brand/><h1>Aanmelden vereist.</h1><p>Open deze pagina via de beveiligde aanmelding.</p><a href="/">Terug naar de website</a></main>;if(!await adminUser())return <main className="access-page"><Brand/><h1>Alleen voor het team.</h1><p>U bent aangemeld als {user.email}, maar dit account heeft geen beheertoegang.</p><a className="button button-dark" href={logout} target="_top">Ander account gebruiken</a><a href="/">Terug naar de website</a></main>;return <Admin logoutHref={logout} initial={await listCars(true)} email={user.email} aiConfigured={!!runtime().ANTHROPIC_API_KEY}/>}

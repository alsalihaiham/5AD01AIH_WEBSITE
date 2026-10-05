import Link from 'next/link';
import {redirect} from 'next/navigation';
import LoginForm from '@/components/hp/login-form';
import {adminUser, passwordLogin} from '@/lib/server';

export const dynamic = 'force-dynamic';
export const metadata = {title: 'Aanmelden — beheer', robots: {index: false, follow: false}};

// Only same-site paths inside the admin are allowed as a destination.
const safeNext = (value: string | undefined) => value && /^\/beheer(\/[\w-]*)?$/.test(value) && !value.startsWith('/beheer/login') ? value : '/beheer';

export default async function LoginPage({searchParams}: {searchParams: Promise<{next?: string}>}) {
  const next = safeNext((await searchParams).next);
  if (await adminUser()) redirect(next);
  if (!passwordLogin()) return <div className="hp"><main className="hp-container hp-access">
    <p className="hp-eyebrow"><span className="hp-dot"/>Beheer</p>
    <h1 className="hp-h1">Nog niet ingesteld.</h1>
    <p className="hp-lead">Maak een gebruikersnaam en wachtwoord aan met <code>npm run admin:password</code> en zet de site daarna opnieuw online.</p>
    <Link className="hp-btn hp-btn-light" href="/">Terug naar de website</Link>
  </main></div>;
  return <div className="hp"><LoginForm next={next}/></div>;
}

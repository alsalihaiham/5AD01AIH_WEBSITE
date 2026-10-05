'use client';
import Link from 'next/link';
import {useState, type FormEvent} from 'react';
import {motion} from 'framer-motion';
import {ArrowRight, Eye, EyeOff, Lock, User, ShieldCheck} from 'lucide-react';
import CarArt from './car-art';
import ThemeToggle from './theme-toggle';
import {Wordmark} from '@/components/auto/shell';

const ease = [0.22, 1, 0.36, 1] as const;

export default function LoginForm({next}: {next: string}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/login', {method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify({username, password})});
      const data = (await response.json().catch(() => ({}))) as {error?: string};
      if (!response.ok) throw new Error(data.error || 'Inloggen is niet gelukt. Probeer opnieuw.');
      setDone(true);
      window.setTimeout(() => { window.location.href = next; }, 700);
    } catch (err) {
      setError((err as Error).message);
      setPassword('');
      setBusy(false);
    }
  }

  return <main className="hp-login" id="main">
    <div className="hp-login-bg" aria-hidden="true"><span className="hp-login-glow"/><span className="hp-studio-floor"/></div>
    <div className="hp-login-top"><Wordmark/><ThemeToggle label="Wissel tussen licht en donker"/></div>
    <div className="hp-login-art" aria-hidden="true">
      <motion.div initial={{x: '-12%', opacity: 0}} animate={{x: 0, opacity: 1}} transition={{duration: 1.8, ease}}><CarArt className="hp-login-car"/></motion.div>
    </div>
    <motion.form className={'hp-login-card' + (error ? ' is-shaking' : '') + (done ? ' is-done' : '')} onSubmit={submit}
      initial={{opacity: 0, y: 40, scale: .97}} animate={{opacity: 1, y: 0, scale: 1}} transition={{duration: 1, delay: .3, ease}} key={error}>
      <span className="hp-login-badge"><ShieldCheck size={16}/>Beheer</span>
      <h1>{done ? 'Welkom terug.' : 'Aanmelden'}</h1>
      <p className="hp-login-sub">Alleen voor het team van HP-Automotive.</p>
      <label className="hp-login-field"><span>Gebruikersnaam</span>
        <span className="hp-login-input"><User size={18}/><input value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" autoCapitalize="none" spellCheck={false} required autoFocus disabled={busy}/></span>
      </label>
      <label className="hp-login-field"><span>Wachtwoord</span>
        <span className="hp-login-input"><Lock size={18}/>
          <input type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required disabled={busy}/>
          <button type="button" className="hp-login-eye" onClick={() => setShow(v => !v)} aria-label={show ? 'Verberg wachtwoord' : 'Toon wachtwoord'}>{show ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
        </span>
      </label>
      {error && <p className="hp-login-error" role="alert">{error}</p>}
      <button className="hp-btn hp-btn-accent hp-btn-block hp-login-submit" type="submit" disabled={busy}>
        {done ? 'Even geduld…' : busy ? 'Bezig…' : 'Inloggen'}<ArrowRight size={18}/>
      </button>
      <Link className="hp-login-back" href="/">← Terug naar de website</Link>
    </motion.form>
  </main>;
}

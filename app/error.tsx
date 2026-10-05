'use client';
import Link from 'next/link';
export default function ErrorPage({reset}: {reset: () => void}) {
  return <div className="hp">
    <main className="hp-container hp-access">
      <p className="hp-eyebrow"><span className="hp-dot"/>HP-AUTOMOTIVE</p>
      <h1 className="hp-h1">Even geen verbinding.</h1>
      <p className="hp-lead">We kunnen deze pagina momenteel niet ophalen. Probeer opnieuw, of mail ons via automotive@hp-company.be.</p>
      <div className="hp-hero-actions">
        <button className="hp-btn hp-btn-light" onClick={reset}>Opnieuw proberen</button>
        <Link className="hp-btn hp-btn-ghost" href="/">Terug naar de startpagina</Link>
      </div>
    </main>
  </div>;
}

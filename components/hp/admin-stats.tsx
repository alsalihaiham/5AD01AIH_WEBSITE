'use client';
import {useEffect, useState} from 'react';
import {Eye, MousePointerClick, Users, PlugZap} from 'lucide-react';

type Stats = {configured: boolean; error?: string; days?: {date: string; visitors: number}[]; totals?: {requests: number; pageViews: number; visitors: number}};
const nf = new Intl.NumberFormat('nl-BE');

/** Visitor numbers from the Cloudflare API; shows setup steps until a token is added. */
export default function AdminStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  useEffect(() => {
    let alive = true;
    fetch('/api/admin/stats').then(r => r.json() as Promise<Stats>).then(d => alive && setStats(d)).catch(() => alive && setStats({configured: true, error: 'De cijfers konden niet worden opgehaald.'}));
    return () => { alive = false; };
  }, []);
  if (!stats) return <section className="admin-visits is-loading" aria-busy="true"><span/><span/><span/></section>;
  if (!stats.configured) return <section className="admin-visits-setup">
    <PlugZap size={22}/>
    <div><strong>Toon hier uw bezoekers</strong>
      <p>Koppel Cloudflare om de bezoekers van de laatste 7 dagen te zien. Maak in Cloudflare een API-token met <em>Zone → Analytics → Lezen</em>, en volg de stappen in <code>START-HIER.md</code>.</p></div>
  </section>;
  if (stats.error) return <section className="admin-visits-setup is-error"><PlugZap size={22}/><div><strong>Cloudflare-cijfers niet beschikbaar</strong><p>{stats.error}</p></div></section>;
  const days = (stats.days || []).slice(-14), max = Math.max(1, ...days.map(d => d.visitors));
  const tiles = [{Icon: Users, label: 'Bezoekers', value: stats.totals?.visitors ?? 0}, {Icon: Eye, label: 'Paginaweergaven', value: stats.totals?.pageViews ?? 0}, {Icon: MousePointerClick, label: 'Verzoeken', value: stats.totals?.requests ?? 0}];
  return <section className="admin-visits" aria-label="Bezoekers, laatste 7 dagen">
    {tiles.map(({Icon, label, value}) => <div key={label}><Icon size={20}/><span>{label}</span><strong>{nf.format(value)}</strong><small>laatste 7 dagen</small></div>)}
    <div className="admin-visits-chart" role="img" aria-label="Bezoekers per dag, laatste 14 dagen">
      {days.map(d => <span key={d.date} title={d.date + ': ' + d.visitors} style={{height: Math.max(6, Math.round(d.visitors / max * 100)) + '%'}}/>)}
      <small>Heel hp-company.be, per dag</small>
    </div>
  </section>;
}

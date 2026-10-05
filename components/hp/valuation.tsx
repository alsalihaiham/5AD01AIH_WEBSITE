'use client';
import {useState, type FormEvent} from 'react';
import {ArrowRight, Check} from 'lucide-react';
import {href, type Lang} from '@/lib/i18n';
import {ui} from '@/lib/ui';
import {Reveal} from './motion';

/** Short first step of the seller flow; the details carry over into the full form on /verkopen. */
export default function Valuation({lang}: {lang: Lang}) {
  const v = ui[lang].valuation;
  const [data, setData] = useState({brand: '', model: '', km: ''});
  function submit(e: FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams(Object.entries(data).filter(([, value]) => value.trim()) as [string, string][]);
    location.href = href('/verkopen', lang) + (q.toString() ? '&' + q : '') + '#sell-form';
  }
  const field = (key: keyof typeof data, label: string, placeholder: string, type = 'text') =>
    <label className="hp-field"><span>{label}</span>
      <input type={type} inputMode={type === 'number' ? 'numeric' : undefined} min={type === 'number' ? 0 : undefined} placeholder={placeholder} value={data[key]} maxLength={40} onChange={e => setData(d => ({...d, [key]: e.target.value}))}/>
    </label>;
  return <section className="hp-container hp-valuation" id="waarde">
    <Reveal className="hp-valuation-copy">
      <p className="hp-eyebrow">{v.eyebrow}</p>
      <h2 className="hp-h2">{v.title}</h2>
      <p className="hp-lead">{v.note}</p>
      <ul className="hp-checks">{v.points.map(p => <li key={p}><Check size={16}/>{p}</li>)}</ul>
    </Reveal>
    <Reveal delay={.1} className="hp-valuation-card">
      <form onSubmit={submit}>
        {field('brand', v.brand, v.brandPh)}
        {field('model', v.model, v.modelPh)}
        {field('km', v.km, v.kmPh, 'number')}
        <button type="submit" className="hp-btn hp-btn-accent hp-btn-block">{v.cta}<ArrowRight size={18}/></button>
      </form>
    </Reveal>
  </section>;
}

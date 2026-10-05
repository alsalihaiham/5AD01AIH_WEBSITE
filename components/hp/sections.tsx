import {FileCheck2, ArrowLeftRight, CalendarCheck, Languages, Search, MessageCircle, KeyRound, Plus} from 'lucide-react';
import type {Lang} from '@/lib/i18n';
import {ui} from '@/lib/ui';
import {Reveal} from './motion';

const USP_ICONS = [FileCheck2, ArrowLeftRight, CalendarCheck, Languages];
const STEP_ICONS = [Search, MessageCircle, KeyRound];

export function Usps({lang}: {lang: Lang}) {
  return <section className="hp-usps" aria-label={ui[lang].usps.map(u => u[0]).join(', ')}>
    <div className="hp-container hp-usps-grid">
      {ui[lang].usps.map(([title, text], i) => {
        const Icon = USP_ICONS[i];
        return <Reveal key={title} delay={i * .06} y={20} className="hp-usp"><Icon size={22}/><span><strong>{title}</strong><small>{text}</small></span></Reveal>;
      })}
    </div>
  </section>;
}

export function Steps({lang}: {lang: Lang}) {
  const s = ui[lang].steps;
  return <section className="hp-container hp-steps-section">
    <Reveal><p className="hp-eyebrow">{s.eyebrow}</p><h2 className="hp-h2">{s.title}</h2></Reveal>
    <ol className="hp-step-grid">
      {s.items.map(([title, text], i) => {
        const Icon = STEP_ICONS[i];
        return <Reveal as="li" key={title} delay={i * .1} className="hp-step">
          <span className="hp-step-top"><span className="hp-step-n">0{i + 1}</span><Icon size={22}/></span>
          <h3>{title}</h3><p>{text}</p>
        </Reveal>;
      })}
    </ol>
  </section>;
}

export function Faq({lang}: {lang: Lang}) {
  const f = ui[lang].faq;
  return <section className="hp-container hp-faq">
    <Reveal><p className="hp-eyebrow">{f.eyebrow}</p><h2 className="hp-h2">{f.title}</h2></Reveal>
    <div className="hp-faq-list">
      {f.items.map(([q, a], i) => <Reveal key={q} delay={i * .05} y={16}>
        <details className="hp-faq-item"><summary>{q}<Plus size={20}/></summary><p>{a}</p></details>
      </Reveal>)}
    </div>
  </section>;
}

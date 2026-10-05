import {Header, Footer} from '@/components/auto/shell';
import SellForm from '@/components/auto/sell-form';
import {Reveal, RevealTitle} from '@/components/hp/motion';
import {GaugeArt} from '@/components/hp/car-art';
import {language} from '@/lib/i18n';
import {ui} from '@/lib/ui';
import {Check} from 'lucide-react';

export const metadata = {title: 'Uw wagen verkopen — Vendre votre voiture — Sell your car', description: 'Verkoop of ruil uw tweedehandswagen in bij HP-Automotive. Gratis en vrijblijvend: deel de gegevens en foto’s voor een persoonlijke beoordeling.'};

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || '';

export default async function SellPage({searchParams}: {searchParams: Promise<Record<string, string | string[] | undefined>>}) {
  const params = await searchParams;
  const lang = language(params.lang), s = ui[lang].sellPage, steps = ui[lang].sell.steps;
  // Details entered in the home-page valuation form carry over.
  const prefill: Record<string, string> = {};
  if (one(params.brand)) prefill.brand = one(params.brand).slice(0, 40);
  if (one(params.model)) prefill.model = one(params.model).slice(0, 40);
  const km = one(params.km).replace(/\D/g, '').slice(0, 7);
  if (km) prefill.km = km;
  return <div className="hp hp-sell" lang={lang}>
    <Header lang={lang} path="/verkopen"/>
    <main id="main">
      <section className="hp-sell-hero">
        <div className="hp-container hp-sell-hero-inner">
          <div>
            <Reveal><p className="hp-eyebrow"><span className="hp-dot"/>{s.eyebrow}</p></Reveal>
            <RevealTitle as="h1" className="hp-h1" lines={s.lines}/>
            <Reveal delay={.2}><p className="hp-lead hp-lead-lg">{s.intro}</p></Reveal>
            <Reveal delay={.3} className="hp-sell-badges">{s.badges.map(b => <span key={b}><Check size={16}/>{b}</span>)}</Reveal>
            <ol className="hp-steps">{steps.map(([n, label], i) => <Reveal as="li" key={n} delay={.35 + i * .08}><span>{n}</span>{label}</Reveal>)}</ol>
          </div>
          <Reveal delay={.15} className="hp-sell-art"><GaugeArt/></Reveal>
        </div>
      </section>
      <SellForm lang={lang} prefill={prefill}/>
    </main>
    <Footer lang={lang} path="/verkopen"/>
  </div>;
}

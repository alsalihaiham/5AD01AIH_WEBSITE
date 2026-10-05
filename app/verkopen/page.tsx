import {Header, Footer} from '@/components/auto/shell';
import SellForm from '@/components/auto/sell-form';
import {ParallaxImage, Reveal, RevealTitle} from '@/components/hp/motion';
import {language} from '@/lib/i18n';
import {ui} from '@/lib/ui';
import {Check} from 'lucide-react';

export const metadata = {title: 'Uw wagen verkopen — Vendre votre voiture — Sell your car', description: 'Bied uw tweedehandswagen aan HP-Automotive aan. Deel voertuiggegevens, foto’s en video’s voor een persoonlijke beoordeling.'};

export default async function SellPage({searchParams}: {searchParams: Promise<{lang?: string}>}) {
  const lang = language((await searchParams).lang), s = ui[lang].sellPage, steps = ui[lang].sell.steps;
  return <div className="hp hp-sell" lang={lang}>
    <Header lang={lang} path="/verkopen"/>
    <main id="main">
      <section className="hp-sell-hero">
        <ParallaxImage src="/media/demo-car-3.jpg" className="hp-sell-hero-media" amount={10}/>
        <div className="hp-container hp-sell-hero-inner">
          <Reveal><p className="hp-eyebrow"><span className="hp-dot"/>{s.eyebrow}</p></Reveal>
          <RevealTitle as="h1" className="hp-h1 hp-display" lines={s.lines}/>
          <Reveal delay={.2}><p className="hp-lead hp-lead-lg">{s.intro}</p></Reveal>
          <Reveal delay={.3} className="hp-sell-badges">
            {s.badges.map(b => <span key={b}><Check size={16}/>{b}</span>)}
          </Reveal>
          <ol className="hp-steps">
            {steps.map(([n, label], i) => <Reveal as="li" key={n} delay={.35 + i * .08}><span>{n}</span>{label}</Reveal>)}
          </ol>
        </div>
      </section>
      <SellForm lang={lang}/>
    </main>
    <Footer lang={lang} path="/verkopen"/>
  </div>;
}

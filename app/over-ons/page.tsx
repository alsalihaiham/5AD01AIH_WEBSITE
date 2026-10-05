import {Header, Footer} from '@/components/auto/shell';
import {Reveal, RevealTitle} from '@/components/hp/motion';
import CarArt from '@/components/hp/car-art';
import {language, href} from '@/lib/i18n';
import {ui, EMAIL} from '@/lib/ui';
import {ArrowUpRight, FileText, UserRound, Hourglass, Mail} from 'lucide-react';

export const metadata = {title: 'Over ons — À propos — About', description: 'HP-Automotive koopt en verkoopt tweedehandswagens in België, met Car-Pass, duidelijke historiek en één vast aanspreekpunt. Onderdeel van HP-Company.'};

export default async function About({searchParams}: {searchParams: Promise<{lang?: string}>}) {
  const lang = language((await searchParams).lang), a = ui[lang].about, steps = ui[lang].steps.items;
  const icons = [FileText, UserRound, Hourglass];
  return <div className="hp" lang={lang}>
    <Header lang={lang} path="/over-ons"/>
    <main id="main">
      <section className="hp-container hp-page-hero">
        <Reveal><p className="hp-eyebrow"><span className="hp-dot"/>{a.eyebrow}</p></Reveal>
        <RevealTitle as="h1" className="hp-h1" lines={a.lines}/>
        <Reveal delay={.2}><p className="hp-lead hp-lead-lg">{a.intro}</p></Reveal>
      </section>

      <Reveal className="hp-container hp-about-panel">
        <CarArt className="hp-about-art"/>
        <dl className="hp-facts">{a.facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
      </Reveal>

      <section className="hp-container hp-split">
        <Reveal><p className="hp-eyebrow">{a.storyEyebrow}</p></Reveal>
        <div className="hp-story">
          <RevealTitle className="hp-h2" lines={[a.storyTitle]}/>
          {a.story.map((p, i) => <Reveal key={i} delay={.08 + i * .08}><p className="hp-lead">{p}</p></Reveal>)}
        </div>
      </section>

      <section className="hp-container hp-values">
        <Reveal><p className="hp-eyebrow">{a.valuesEyebrow}</p></Reveal>
        <div className="hp-values-grid">
          {a.values.map(([title, text], i) => {
            const Icon = icons[i];
            return <Reveal key={title} delay={i * .1} className="hp-value">
              <span className="hp-value-icon"><Icon size={24}/></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </Reveal>;
          })}
        </div>
      </section>

      <section className="hp-container hp-process">
        <div>
          <Reveal><p className="hp-eyebrow">{a.processEyebrow}</p></Reveal>
          <RevealTitle className="hp-h2" lines={[a.processTitle]}/>
        </div>
        <ol>
          {steps.map(([title, text], i) => <Reveal as="li" key={title} delay={i * .1}>
            <span className="hp-process-n">0{i + 1}</span>
            <div><h3>{title}</h3><p>{text}</p></div>
          </Reveal>)}
        </ol>
      </section>

      <section className="hp-container hp-group">
        <Reveal className="hp-group-card">
          <p className="hp-eyebrow">{a.groupEyebrow}</p>
          <h2 className="hp-h2">{a.groupTitle}</h2>
          <p className="hp-lead">{a.groupNote}</p>
          <div className="hp-hero-actions">
            <a className="hp-btn hp-btn-light hp-btn-lg" href={href('/#aanbod', lang)}>{a.cta}<ArrowUpRight size={20}/></a>
            <a className="hp-btn hp-btn-ghost hp-btn-lg" href={'mailto:' + EMAIL}><Mail size={18}/>{a.mail}</a>
          </div>
        </Reveal>
      </section>
    </main>
    <Footer lang={lang} path="/over-ons"/>
  </div>;
}

'use client';
import {useEffect, useRef, useState} from 'react';
import {motion} from 'framer-motion';
import {ArrowRight} from 'lucide-react';
import {href, type Lang} from '@/lib/i18n';
import {ui} from '@/lib/ui';
import {Wordmark} from '@/components/auto/shell';
import {GATE_KEY, GATE_EVENT} from './gate-script';
import CarArt, {GaugeArt} from './car-art';

type Side = 'buy' | 'sell';
const ease = [0.76, 0, 0.24, 1] as const;

export default function Gate({lang}: {lang: Lang}) {
  const t = ui[lang].gate;
  const [open, setOpen] = useState(true);
  const [hover, setHover] = useState<Side | null>(null);
  const [choice, setChoice] = useState<Side | null>(null);
  const first = useRef<HTMLButtonElement>(null);

  // Visibility comes from the `hp-gate-open` class set before paint; without it the gate stays display:none.
  useEffect(() => {
    if (document.documentElement.classList.contains('hp-gate-open')) first.current?.focus({preventScroll: true});
  }, []);

  function choose(side: Side) {
    if (choice) return;
    setChoice(side);
    try { sessionStorage.setItem(GATE_KEY, side); } catch {}
    if (side === 'sell') {
      window.setTimeout(() => { window.location.href = href('/verkopen', lang); }, 900);
      return;
    }
    window.setTimeout(() => {
      document.documentElement.classList.remove('hp-gate-open');
      window.scrollTo(0, 0);
      window.dispatchEvent(new Event(GATE_EVENT));
      setOpen(false);
    }, 1000);
  }

  if (!open) return null;
  const grow = (side: Side) => choice ? (choice === side ? 1 : 0.0001) : hover === side ? 1.35 : hover ? 0.85 : 1;
  const panels: {side: Side; eyebrow: string; title: string; note: string}[] = [
    {side: 'buy', eyebrow: t.buyEyebrow, title: t.buy, note: t.buyNote},
    {side: 'sell', eyebrow: t.sellEyebrow, title: t.sell, note: t.sellNote},
  ];

  return <div className={'hp-gate' + (choice ? ' is-chosen' : '')} role="dialog" aria-modal="true" aria-label={t.question}
    onKeyDown={e => { if (e.key === 'Escape') choose('buy'); }}>
    <div className="hp-gate-panels">
      {panels.map((p, i) => <motion.button key={p.side} ref={i === 0 ? first : undefined} type="button"
        className={'hp-gate-panel is-' + p.side + (choice === p.side ? ' is-active' : '')}
        onClick={() => choose(p.side)} onMouseEnter={() => setHover(p.side)} onMouseLeave={() => setHover(null)}
        onFocus={() => setHover(p.side)} onBlur={() => setHover(null)}
        initial={{clipPath: i === 0 ? 'inset(0 0 100% 0)' : 'inset(100% 0 0 0)'}}
        animate={{clipPath: 'inset(0 0 0% 0)', flexGrow: grow(p.side)}}
        transition={{clipPath: {duration: 1.1, ease, delay: .15 + i * .12}, flexGrow: {duration: choice ? .9 : .7, ease}}}>
        <motion.span className="hp-gate-visual"
          initial={{scale: 1.25, opacity: 0}} animate={{scale: hover === p.side || choice === p.side ? 1.06 : 1, opacity: 1}}
          transition={{duration: 1.4, ease: [0.22, 1, 0.36, 1], opacity: {duration: .8, delay: .5 + i * .12}}}>
          {p.side === 'buy' ? <CarArt/> : <GaugeArt/>}
        </motion.span>
        <span className="hp-gate-shade"/>
        <motion.span className="hp-gate-copy" animate={{opacity: choice ? 0 : 1, y: choice ? -20 : 0}} transition={{duration: .4}}>
          <motion.span className="hp-gate-eyebrow" initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: .9 + i * .1, duration: .7}}>{p.eyebrow}</motion.span>
          <span className="hp-gate-title-wrap">
            <motion.span className="hp-gate-title" initial={{y: '110%'}} animate={{y: '0%'}} transition={{delay: .95 + i * .1, duration: 1, ease: [0.22, 1, 0.36, 1]}}>{p.title}</motion.span>
          </span>
          <motion.span className="hp-gate-note" initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 1.25 + i * .1, duration: .7}}>
            {p.note}<span className="hp-gate-arrow"><ArrowRight size={20}/></span>
          </motion.span>
        </motion.span>
      </motion.button>)}
    </div>
    <motion.div className="hp-gate-top" initial={{opacity: 0, y: -16}} animate={{opacity: choice ? 0 : 1, y: 0}} transition={{delay: choice ? 0 : .7, duration: .6}}>
      <Wordmark/>
      <div className="hp-langs" aria-label={t.language}>
        {(['nl', 'fr', 'en'] as Lang[]).map(l => <a key={l} href={href('/', l)} hrefLang={l} lang={l} aria-current={l === lang ? 'true' : undefined}>{l.toUpperCase()}</a>)}
      </div>
    </motion.div>
    <motion.div className="hp-gate-center" initial={{opacity: 0, scale: .8}} animate={{opacity: choice ? 0 : 1, scale: 1}} transition={{delay: choice ? 0 : 1.2, duration: .6}}>
      <span className="hp-gate-question">{t.question}</span>
      <span className="hp-gate-hint">{t.hint}</span>
    </motion.div>
  </div>;
}

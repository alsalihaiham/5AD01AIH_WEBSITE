'use client';
import {useMemo, useRef, useState, type FormEvent} from 'react';
import {gsap, useGSAP} from './gsap';
import {ArrowUpRight, ArrowRight, ChevronDown, Search} from 'lucide-react';
import {formatMoney, href, valueLabel, type Lang} from '@/lib/i18n';
import {ui, BUDGETS, FUELS} from '@/lib/ui';
import {FILTER_EVENT, filterQuery, type Filters} from '@/lib/filters';
import {GATE_EVENT} from './gate-script';
import CarArt from './car-art';

export type HeroStock = {brand: string; price: number; fuel: string; status: string};
export type HeroCar = {slug: string; title: string; price: number; year: number; km: number; image: string};

// Callout anchors on the drawing, in % of the art box.
const NOTES = [{x: 15, y: 50, up: true}, {x: 67, y: 33, up: true}, {x: 86, y: 52, up: true}, {x: 78, y: 72, up: false}];

export default function Hero({lang, stock, brands, featured, initial}: {lang: Lang; stock: HeroStock[]; brands: string[]; featured: HeroCar | null; initial: Filters}) {
  const root = useRef<HTMLElement>(null);
  const t = ui[lang].hero;
  const [filters, setFilters] = useState<Filters>(initial);
  const count = useMemo(() => stock.filter(c => c.status !== 'sold' &&
    (!filters.brand || c.brand.toLowerCase() === filters.brand.toLowerCase()) &&
    (!filters.budget || c.price <= filters.budget) &&
    (!filters.fuel || c.fuel === filters.fuel)).length, [stock, filters]);

  function submit(e: FormEvent) {
    e.preventDefault();
    const q = filterQuery(filters);
    const params = new URLSearchParams(location.search);
    ['merk', 'budget', 'brandstof', 'sort'].forEach(k => params.delete(k));
    new URLSearchParams(q).forEach((v, k) => params.set(k, v));
    history.replaceState(null, '', '?' + params.toString() + '#aanbod');
    window.dispatchEvent(new CustomEvent(FILTER_EVENT, {detail: filters}));
    document.getElementById('aanbod')?.scrollIntoView({behavior: 'smooth', block: 'start'});
  }

  useGSAP(() => {
    const el = root.current;
    if (!el) return;
    const media = el.querySelector<HTMLElement>('.hp-hero-media')!;
    const frame = el.querySelector<HTMLElement>('.hp-hero-frame')!;
    const radius = () => window.innerWidth < 760 ? 20 : 30;
    const inset = () => {
      const r = el.getBoundingClientRect(), f = frame.getBoundingClientRect();
      return `inset(${f.top - r.top}px ${r.right - f.right}px ${r.bottom - f.bottom}px ${f.left - r.left}px round ${radius()}px)`;
    };
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const strokes = gsap.utils.toArray<SVGGeometryElement>('[data-draw]', el);
    strokes.forEach(s => { const len = s.getTotalLength(); gsap.set(s, {strokeDasharray: len, strokeDashoffset: len}); });

    const tl = gsap.timeline({paused: true, defaults: {ease: 'expo.out'}});
    tl.set(media, {clipPath: 'inset(0px 0px 0px 0px round 0px)'})
      .set('.hp-art', {opacity: 1}, 0)
      .to(media, {clipPath: inset, duration: 1.8, ease: 'power4.inOut'}, 0.3)
      // The coupé rolls in while it is drawn, then the headlights come on.
      .fromTo('.hp-art', {xPercent: -18, scale: 1.35}, {xPercent: 0, scale: 1, duration: 2.2, ease: 'power3.inOut'}, 0)
      .fromTo('[data-wheel]', {rotation: -540, transformOrigin: '50% 50%'}, {rotation: 0, transformOrigin: '50% 50%', duration: 2.2, ease: 'power3.inOut'}, 0)
      .to(strokes, {strokeDashoffset: 0, duration: 1.8, stagger: 0.03, ease: 'power2.inOut'}, 0.1)
      .fromTo('[data-beam]', {opacity: 0}, {opacity: 1, duration: 0.25, repeat: 1, yoyo: true, ease: 'steps(1)'}, 2.2)
      .to('[data-beam]', {opacity: 1, duration: 0.5}, 2.75)
      .fromTo('[data-hero-line]', {yPercent: 115, opacity: 0}, {yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.1}, 1.2)
      .fromTo('[data-hero-fade]', {autoAlpha: 0, y: 18}, {autoAlpha: 1, y: 0, duration: 1, stagger: 0.09}, 1.45)
      .fromTo('[data-note]', {autoAlpha: 0, y: 14, filter: 'blur(6px)'}, {autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.18, ease: 'power3.out'}, 2.0)
      .fromTo('[data-hero-card]', {autoAlpha: 0, y: 24}, {autoAlpha: 1, y: 0, duration: 1}, 2.6)
      .fromTo(document.querySelectorAll('[data-hero-header]'), {autoAlpha: 0, y: -20}, {autoAlpha: 1, y: 0, duration: 1}, 1.3);

    const play = () => { if (reduce) tl.progress(1); else tl.play(0); };
    if (document.documentElement.classList.contains('hp-gate-open')) window.addEventListener(GATE_EVENT, play, {once: true});
    else play();
    const onResize = () => { if (tl.progress() === 1) gsap.set(media, {clipPath: inset()}); };
    window.addEventListener('resize', onResize);
    if (!reduce) gsap.to('.hp-hero-copy', {y: -60, opacity: 0.3, ease: 'none', scrollTrigger: {trigger: el, start: 'top top', end: 'bottom top', scrub: true}});
    return () => { window.removeEventListener('resize', onResize); window.removeEventListener(GATE_EVENT, play); };
  }, {scope: root});

  const select = (label: string, value: string, onChange: (v: string) => void, options: [string, string][]) =>
    <label className="hp-field">
      <span>{label}</span>
      <span className="hp-select"><select value={value} onChange={e => onChange(e.target.value)}>{options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select><ChevronDown size={16}/></span>
    </label>;

  return <section ref={root} className="hp-hero" aria-label={t.lines.join(' ')}>
    <div className="hp-hero-media" aria-hidden="true"><span className="hp-studio-floor"/></div>
    <div className="hp-container hp-hero-grid">
      <div className="hp-hero-copy">
        <p className="hp-eyebrow" data-hero-fade><span className="hp-dot"/>{t.eyebrow}</p>
        <h1 className="hp-hero-title">{t.lines.map(line => <span key={line} className="hp-line"><span data-hero-line>{line}</span></span>)}</h1>
        <p className="hp-hero-intro" data-hero-fade>{t.intro}</p>
        <form className="hp-search" onSubmit={submit} data-hero-fade aria-label={t.searchTitle}>
          {select(t.brand, filters.brand, v => setFilters(f => ({...f, brand: v})), [['', t.allBrands], ...brands.map(b => [b, b] as [string, string])])}
          {select(t.budget, String(filters.budget), v => setFilters(f => ({...f, budget: Number(v)})), [['0', t.anyBudget], ...BUDGETS.map(b => [String(b), t.upTo + ' ' + formatMoney(b, lang)] as [string, string])])}
          {select(t.fuel, filters.fuel, v => setFilters(f => ({...f, fuel: v})), [['', t.anyFuel], ...FUELS.map(f => [f, valueLabel(f, lang)] as [string, string])])}
          <button className="hp-btn hp-btn-accent hp-search-submit" type="submit"><Search size={18}/>{count ? t.show(count) : t.search}</button>
        </form>
        <a className="hp-hero-sell" href="#waarde" data-hero-fade>{t.sellCta}<ArrowRight size={16}/></a>
      </div>
      <div className="hp-hero-frame">
        <div className="hp-studio-art">
          <CarArt/>
          {t.notes.map((note, i) => <span key={note} className={'hp-note' + (NOTES[i].up ? '' : ' is-down')} style={{left: NOTES[i].x + '%', top: NOTES[i].y + '%'}} data-note>
            <i/><b>{note}</b>
          </span>)}
        </div>
        {featured && <a className="hp-newin" href={href('/wagens/' + featured.slug, lang)} data-hero-card>
          <img src={featured.image} alt="" width="160" height="110"/>
          <span><small>{t.newIn}</small><strong>{featured.title}</strong><em>{featured.year} · {featured.km.toLocaleString(lang === 'en' ? 'en-GB' : lang + '-BE')} km</em></span>
          <span className="hp-newin-price">{formatMoney(featured.price, lang)}<ArrowUpRight size={18}/></span>
        </a>}
      </div>
    </div>
  </section>;
}

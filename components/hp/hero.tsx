'use client';
import {useRef} from 'react';
import {gsap, useGSAP} from './gsap';
import {ArrowDown, ArrowUpRight} from 'lucide-react';
import {copy, href, formatMoney, formatNumber, valueLabel, type Lang} from '@/lib/i18n';
import {ui} from '@/lib/ui';
import {GATE_EVENT} from './gate-script';

export type HeroCar = {slug: string; title: string; subtitle: string; demo: boolean; status: string; price: number; year: number; km: number; power: number; fuel: string; transmission: string; image: string};

export default function Hero({lang, car}: {lang: Lang; car: HeroCar | null}) {
  const root = useRef<HTMLElement>(null);
  const t = ui[lang], c = copy[lang];
  const hp = car?.power ? Math.round(car.power * 1.35962) : 0;
  const unit = lang === 'nl' ? 'pk' : lang === 'fr' ? 'ch' : 'hp';
  const specs = car ? [
    {label: c.year, value: String(car.year)},
    {label: c.km, value: formatNumber(car.km, lang) + ' km', count: car.km, suffix: ' km'},
    ...(hp ? [{label: c.power, value: formatNumber(hp, lang) + ' ' + unit, count: hp, suffix: ' ' + unit}] : []),
    {label: c.gear, value: valueLabel(car.transmission, lang)},
    {label: c.fuel, value: valueLabel(car.fuel, lang)},
  ] : [];

  useGSAP(() => {
    const el = root.current;
    if (!el) return;
    const media = el.querySelector<HTMLElement>('.hp-hero-media')!;
    const frame = el.querySelector<HTMLElement>('.hp-hero-frame')!;
    const img = el.querySelector<HTMLElement>('.hp-hero-img')!;
    const radius = () => window.innerWidth < 760 ? 18 : 28;
    // The image layer always covers the whole hero; clipping it to the frame's box makes it "scale down" into place.
    const inset = () => {
      const r = el.getBoundingClientRect(), f = frame.getBoundingClientRect();
      return `inset(${f.top - r.top}px ${r.right - f.right}px ${r.bottom - f.bottom}px ${f.left - r.left}px round ${radius()}px)`;
    };
    const full = 'inset(0px 0px 0px 0px round 0px)';
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const counters = el.querySelectorAll<HTMLElement>('[data-count]');
    const tl = gsap.timeline({paused: true, defaults: {ease: 'expo.out'}});
    tl.set(media, {clipPath: full})
      .fromTo(img, {scale: 1.22}, {scale: 1, duration: 2.4, ease: 'power3.inOut'}, 0)
      .to(media, {clipPath: inset, duration: 1.9, ease: 'power4.inOut'}, 0.35)
      .to('.hp-hero-veil', {opacity: 0, duration: 1.4, ease: 'power2.out'}, 0.5)
      .fromTo('[data-hero-line]', {yPercent: 115, opacity: 0}, {yPercent: 0, opacity: 1, duration: 1.3, stagger: 0.1}, 1.35)
      .fromTo('[data-hero-fade]', {autoAlpha: 0, y: 18}, {autoAlpha: 1, y: 0, duration: 1, stagger: 0.09}, 1.6)
      .fromTo('[data-hero-label]', {autoAlpha: 0, x: -14}, {autoAlpha: 1, x: 0, duration: 0.9}, 1.9)
      // Specs arrive one after another, numbers counting up as they appear.
      .fromTo('[data-spec]', {autoAlpha: 0, y: 26, filter: 'blur(10px)'}, {autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.16, ease: 'power3.out'}, 2.0)
      .fromTo('[data-spec-line]', {scaleX: 0, opacity: 1}, {scaleX: 1, opacity: 1, duration: 1.4, ease: 'power3.inOut'}, 2.0)
      .fromTo('[data-hero-price]', {autoAlpha: 0, y: 20}, {autoAlpha: 1, y: 0, duration: 1}, 2.0 + specs.length * 0.16)
      .fromTo(document.querySelectorAll('[data-hero-header]'), {autoAlpha: 0, y: -20}, {autoAlpha: 1, y: 0, duration: 1}, 1.4);
    counters.forEach((node, i) => {
      const target = Number(node.dataset.count), suffix = node.dataset.suffix || '';
      const state = {v: 0};
      tl.call(() => { node.textContent = formatNumber(0, lang) + suffix; }, [], 0);
      tl.to(state, {v: target, duration: 1.6, ease: 'power3.out', onUpdate: () => { node.textContent = formatNumber(Math.round(state.v), lang) + suffix; }}, 2.05 + i * 0.16);
    });

    const play = () => {
      if (reduce) tl.progress(1); else tl.play(0);
    };
    if (document.documentElement.classList.contains('hp-gate-open')) window.addEventListener(GATE_EVENT, play, {once: true});
    else play();

    // Keep the frame aligned when the layout changes after the intro.
    const onResize = () => { if (tl.progress() === 1) gsap.set(media, {clipPath: inset()}); };
    window.addEventListener('resize', onResize);

    if (!reduce) {
      gsap.to('.hp-hero-parallax', {yPercent: 12, ease: 'none', scrollTrigger: {trigger: el, start: 'top top', end: 'bottom top', scrub: true}});
      gsap.to('.hp-hero-copy', {y: -80, opacity: 0.2, ease: 'none', scrollTrigger: {trigger: el, start: 'top top', end: 'bottom top', scrub: true}});
    }
    return () => { window.removeEventListener('resize', onResize); window.removeEventListener(GATE_EVENT, play); };
  }, {scope: root});

  const lines = t.hero.lines;
  return <section ref={root} className="hp-hero" aria-label={t.hero.featured}>
    <div className="hp-hero-media" aria-hidden="true">
      <div className="hp-hero-parallax">
        <img className="hp-hero-img" src={car?.image || '/media/demo-car-1.jpg'} alt="" width="1920" height="1080" fetchPriority="high"/>
      </div>
      <span className="hp-hero-veil"/>
      <span className="hp-hero-media-shade"/>
    </div>
    <div className="hp-container hp-hero-grid">
      <div className="hp-hero-copy">
        <p className="hp-eyebrow" data-hero-fade><span className="hp-dot"/>{t.hero.eyebrow}{car?.demo ? ' · ' + c.demo : ''}</p>
        <h1 className="hp-hero-title">
          {lines.map(line => <span key={line} className="hp-line"><span data-hero-line>{line}</span></span>)}
        </h1>
        <p className="hp-hero-intro" data-hero-fade>{t.hero.intro}</p>
        <div className="hp-hero-actions" data-hero-fade>
          {car && <a className="hp-btn hp-btn-light" href={href('/wagens/' + car.slug, lang)}>{t.hero.cta}<ArrowUpRight size={18}/></a>}
          <a className="hp-btn hp-btn-ghost" href={href('/#aanbod', lang)}>{t.hero.all}</a>
        </div>
      </div>
      <div className="hp-hero-frame">
        {car && <a className="hp-hero-label" data-hero-label href={href('/wagens/' + car.slug, lang)}>
          <strong>{car.title}</strong><span>{car.subtitle}</span>
        </a>}
      </div>
      {car && <div className="hp-hero-specs">
        <span className="hp-hero-specs-line" data-spec-line/>
        <dl>
          {specs.map(s => <div key={s.label} data-spec>
            <dt>{s.label}</dt>
            <dd {...(s.count ? {'data-count': s.count, 'data-suffix': s.suffix} : {})}>{s.value}</dd>
          </div>)}
        </dl>
        <a className="hp-hero-price" data-hero-price href={href('/wagens/' + car.slug, lang)}>
          <small>{car.demo ? c.demo : car.status === 'sold' ? c.sold : c.price}</small>
          <strong>{formatMoney(car.price, lang)}</strong>
          <span className="hp-round"><ArrowUpRight size={20}/></span>
        </a>
      </div>}
    </div>
    <a href="#aanbod" className="hp-scroll" data-hero-fade aria-label={t.hero.scroll}><span>{t.hero.scroll}</span><ArrowDown size={16}/></a>
  </section>;
}

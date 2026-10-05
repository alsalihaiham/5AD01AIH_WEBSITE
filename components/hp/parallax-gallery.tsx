'use client';
import {useRef} from 'react';
import {gsap, useGSAP} from './gsap';
import {ArrowUpRight, Play} from 'lucide-react';
import {href, type Lang} from '@/lib/i18n';
import {ui} from '@/lib/ui';

export type Tile = {url: string; type: 'image' | 'video'; alt: string; slug: string; title: string; poster?: string};

// Each tile drifts at its own speed; negative values move against the scroll for depth.
const SPEEDS = [-14, 22, -8, 30, -20, 12];

export default function ParallaxGallery({lang, tiles}: {lang: Lang; tiles: Tile[]}) {
  const root = useRef<HTMLElement>(null);
  const t = ui[lang].gallery;

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add({motion: '(prefers-reduced-motion: no-preference)', small: '(max-width: 760px)'}, context => {
      if (!context.conditions?.motion) return;
      // Tighter mobile grid: smaller drift so tiles never collide.
      const factor = context.conditions.small ? 0.3 : 1;
      const trigger = {trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1.2};
      gsap.utils.toArray<HTMLElement>('[data-tile]').forEach((tile, i) => {
        const speed = SPEEDS[i % SPEEDS.length] * factor;
        gsap.fromTo(tile, {yPercent: speed}, {yPercent: -speed, ease: 'none', scrollTrigger: trigger});
        const media = tile.querySelector('[data-tile-media]');
        if (media) gsap.fromTo(media, {yPercent: -10, scale: 1.25}, {yPercent: 10, scale: 1.1, ease: 'none', scrollTrigger: trigger});
      });
      gsap.fromTo('[data-gallery-row="a"]', {xPercent: 6}, {xPercent: -14, ease: 'none', scrollTrigger: trigger});
      gsap.fromTo('[data-gallery-row="b"]', {xPercent: -16}, {xPercent: 4, ease: 'none', scrollTrigger: trigger});
      gsap.fromTo('[data-tile]', {clipPath: 'inset(18% 18% 18% 18% round 24px)'}, {
        clipPath: 'inset(0% 0% 0% 0% round 24px)', ease: 'power2.out', stagger: 0.08,
        scrollTrigger: {trigger: root.current, start: 'top 85%', end: 'top 20%', scrub: 1},
      });
    });
    return () => mm.revert();
  }, {scope: root});

  if (!tiles.length) return null;
  return <section ref={root} className="hp-gallery" aria-labelledby="gallery-title">
    <div className="hp-gallery-type" aria-hidden="true">
      <div data-gallery-row="a">{t.lines[0]} {t.lines[0]} {t.lines[0]}</div>
      <div data-gallery-row="b" className="is-outline">{t.lines[1]} {t.lines[1]} {t.lines[1]}</div>
    </div>
    <div className="hp-container hp-gallery-head">
      <p className="hp-eyebrow">{t.eyebrow}</p>
      <h2 id="gallery-title" className="hp-h2">{t.lines[0]} <span className="hp-muted-text">{t.lines[1]}</span></h2>
      <p className="hp-lead">{t.note}</p>
    </div>
    <div className="hp-container hp-gallery-grid">
      {tiles.slice(0, 6).map((tile, i) => <a key={tile.url + i} href={href('/wagens/' + tile.slug, lang)} className={'hp-tile hp-tile-' + (i + 1)} data-tile aria-label={tile.title + ' — ' + t.open}>
        <span className="hp-tile-inner">
          {tile.type === 'video'
            ? <video data-tile-media src={tile.url} poster={tile.poster} autoPlay muted loop playsInline preload="metadata"/>
            : <img data-tile-media src={tile.url} alt={tile.alt} loading="lazy" width="1200" height="800"/>}
        </span>
        <span className="hp-tile-caption">
          <span>{tile.type === 'video' && <Play size={14}/>}{tile.title}</span>
          <ArrowUpRight size={18}/>
        </span>
      </a>)}
    </div>
  </section>;
}

'use client';
import {useRef, type ReactNode} from 'react';
import {motion} from 'framer-motion';
import {gsap, useGSAP} from './gsap';

const ease = [0.22, 1, 0.36, 1] as const;

/** Fades and lifts its children into view once. */
export function Reveal({children, delay = 0, y = 40, className, as = 'div'}: {children: ReactNode; delay?: number; y?: number; className?: string; as?: 'div' | 'li' | 'article' | 'p'}) {
  const Tag = motion[as];
  return <Tag className={className} initial={{opacity: 0, y}} whileInView={{opacity: 1, y: 0}} viewport={{once: true, margin: '-80px'}} transition={{duration: 1, delay, ease}}>{children}</Tag>;
}

/** Headline whose lines slide up from behind a mask. The heading itself is observed: the masked lines are clipped and never intersect. */
export function RevealTitle({lines, className, as = 'h2'}: {lines: string[]; className?: string; as?: 'h1' | 'h2'}) {
  const Tag = motion[as];
  return <Tag className={className} initial="hidden" whileInView="show" viewport={{once: true, margin: '-40px'}}>
    {lines.map((line, i) => <span key={line} className="hp-line">
      <motion.span style={{display: 'inline-block'}} variants={{hidden: {y: '110%'}, show: {y: '0%', transition: {duration: 1.1, delay: i * .1, ease}}}}>{line}</motion.span>
    </span>)}
  </Tag>;
}

/** Image that drifts against the scroll inside its frame (GSAP ScrollTrigger). */
export function ParallaxImage({src, alt = '', className = '', amount = 14}: {src: string; alt?: string; className?: string; amount?: number}) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('img', {yPercent: -amount, scale: 1.2}, {yPercent: amount, scale: 1.08, ease: 'none', scrollTrigger: {trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true}});
    });
    return () => mm.revert();
  }, {scope: root});
  return <div ref={root} className={'hp-parallax ' + className}><img src={src} alt={alt} loading="lazy" width="1920" height="1080"/></div>;
}

export function Marquee({items}: {items: string[]}) {
  const row = [...items, ...items];
  return <div className="hp-marquee" aria-hidden="true">
    <div className="hp-marquee-track">
      {[0, 1].map(k => <div key={k} className="hp-marquee-group">
        {row.map((item, i) => <span key={i}>{item}<i>✦</i></span>)}
      </div>)}
    </div>
  </div>;
}

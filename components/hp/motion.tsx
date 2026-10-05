'use client';
import type {ReactNode} from 'react';
import {motion} from 'framer-motion';

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

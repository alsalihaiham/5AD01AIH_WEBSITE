'use client';
import {useMemo, useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {ArrowUpRight, Camera, Play, Mail, KeyRound} from 'lucide-react';
import type {Car} from '@/lib/types';
import {copy, href, carText, formatMoney, formatNumber, valueLabel, type Lang} from '@/lib/i18n';
import {ui, EMAIL} from '@/lib/ui';

const rise = {hidden: {opacity: 0, y: 48}, show: {opacity: 1, y: 0}};

export default function Catalog({cars, lang = 'nl'}: {cars: Car[]; lang?: Lang}) {
  const t = copy[lang], u = ui[lang].inventory;
  const [filter, setFilter] = useState('all');
  const bodies = useMemo(() => Array.from(new Set(cars.map(c => c.body))), [cars]);
  const shown = filter === 'all' ? cars : cars.filter(c => c.body === filter);

  return <section className="hp-inventory" id="aanbod">
    <div className="hp-container">
      <div className="hp-section-head">
        <div>
          <motion.p className="hp-eyebrow" initial={{opacity: 0}} whileInView={{opacity: 1}} viewport={{once: true}}>{u.eyebrow}</motion.p>
          <motion.h2 className="hp-h2" initial={{opacity: 0, y: 30}} whileInView={{opacity: 1, y: 0}} viewport={{once: true}} transition={{duration: .8, ease: [0.22, 1, 0.36, 1]}}>
            {u.title} <sup className="hp-count">{u.count(cars.length)}</sup>
          </motion.h2>
        </div>
        {bodies.length > 1 && <div className="hp-chips" role="group" aria-label={t.body}>
          {['all', ...bodies].map(b => <button key={b} type="button" aria-pressed={filter === b} onClick={() => setFilter(b)} className="hp-chip">
            {b === 'all' ? u.all : valueLabel(b, lang)}
          </button>)}
        </div>}
      </div>

      <motion.div className="hp-card-grid" layout>
        <AnimatePresence mode="popLayout">
          {shown.map((raw, i) => {
            const c = carText(raw, lang);
            const cover = c.media.find(m => m.type === 'image');
            const photos = c.media.filter(m => m.type === 'image').length;
            const status = c.demo ? t.demo : c.status === 'sold' ? t.sold : t.available;
            return <motion.article key={c.id} layout className={'hp-card' + (c.status === 'sold' ? ' is-sold' : '')}
              variants={rise} initial="hidden" whileInView="show" exit={{opacity: 0, scale: .96}} viewport={{once: true, margin: '-60px'}}
              transition={{duration: .9, delay: (i % 3) * .1, ease: [0.22, 1, 0.36, 1]}}>
              <a href={href('/wagens/' + c.slug, lang)} className="hp-card-link" aria-label={c.title + ' — ' + t.details}>
                <span className="hp-card-media">
                  {cover ? <img src={cover.url} alt={cover.alt || c.title} width="900" height="600" loading="lazy"/> : <span className="hp-card-empty">{t.noPhotos}</span>}
                  <span className={'hp-badge' + (c.status === 'sold' ? ' is-dark' : c.demo ? ' is-outline' : '')}>{status}</span>
                  <span className="hp-card-count"><Camera size={14}/>{photos}{c.media.some(m => m.type === 'video') && <Play size={13}/>}</span>
                </span>
                <span className="hp-card-body">
                  <span className="hp-card-brand">{c.brand}</span>
                  <span className="hp-card-title">{c.title}</span>
                  <span className="hp-card-sub">{c.subtitle}</span>
                  <span className="hp-card-facts">
                    <span>{c.year}</span><span>{formatNumber(c.km, lang)} km</span><span>{valueLabel(c.fuel, lang)}</span><span>{valueLabel(c.transmission, lang)}</span>
                  </span>
                  <span className="hp-card-foot">
                    <span className="hp-card-price">{formatMoney(c.price, lang)}</span>
                    <span className="hp-card-cta">{u.view}<ArrowUpRight size={16}/></span>
                  </span>
                </span>
              </a>
            </motion.article>;
          })}
          <motion.article key="search" layout className="hp-card hp-card-promo" variants={rise} initial="hidden" whileInView="show" viewport={{once: true}} transition={{duration: .9, delay: .1, ease: [0.22, 1, 0.36, 1]}}>
            <a href={'mailto:' + EMAIL} className="hp-card-link">
              <span className="hp-promo-icon"><Mail size={22}/></span>
              <span className="hp-promo-title">{u.searchTitle}</span>
              <span className="hp-promo-note">{u.searchNote}</span>
              <span className="hp-btn hp-btn-ghost hp-btn-sm">{u.searchCta}<ArrowUpRight size={16}/></span>
            </a>
          </motion.article>
          <motion.article key="sell" layout className="hp-card hp-card-promo is-accent" variants={rise} initial="hidden" whileInView="show" viewport={{once: true}} transition={{duration: .9, delay: .2, ease: [0.22, 1, 0.36, 1]}}>
            <a href={href('/verkopen', lang)} className="hp-card-link">
              <span className="hp-promo-icon"><KeyRound size={22}/></span>
              <span className="hp-promo-title">{u.sellTitle}</span>
              <span className="hp-promo-note">{u.sellNote}</span>
              <span className="hp-btn hp-btn-light hp-btn-sm">{u.sellCta}<ArrowUpRight size={16}/></span>
            </a>
          </motion.article>
        </AnimatePresence>
      </motion.div>
    </div>
  </section>;
}

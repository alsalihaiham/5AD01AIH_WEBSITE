'use client';
import {useEffect, useMemo, useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {ArrowUpRight, Camera, Play, Mail, KeyRound, ChevronDown, X, SearchX} from 'lucide-react';
import type {Car} from '@/lib/types';
import {copy, href, carText, formatMoney, formatNumber, valueLabel, type Lang} from '@/lib/i18n';
import {ui, EMAIL, BUDGETS, FUELS} from '@/lib/ui';
import {applyFilters, filterQuery, FILTER_EVENT, NO_FILTERS, type Filters, type Sort} from '@/lib/filters';

const ease = [0.22, 1, 0.36, 1] as const;

export default function Catalog({cars, lang = 'nl', brands, initial = NO_FILTERS}: {cars: Car[]; lang?: Lang; brands: string[]; initial?: Filters}) {
  const t = copy[lang], u = ui[lang].inventory, h = ui[lang].hero;
  const [filters, setFilters] = useState<Filters>(initial);
  useEffect(() => {
    const onFilter = (e: Event) => setFilters((e as CustomEvent<Filters>).detail);
    window.addEventListener(FILTER_EVENT, onFilter);
    return () => window.removeEventListener(FILTER_EVENT, onFilter);
  }, []);
  function update(next: Filters) {
    setFilters(next);
    const params = new URLSearchParams(location.search);
    ['merk', 'budget', 'brandstof', 'sort'].forEach(k => params.delete(k));
    new URLSearchParams(filterQuery(next)).forEach((v, k) => params.set(k, v));
    const q = params.toString();
    history.replaceState(null, '', (q ? '?' + q : location.pathname) + '#aanbod');
  }
  const shown = useMemo(() => applyFilters(cars.map(c => carText(c, lang)), filters), [cars, filters, lang]);
  const active = !!(filters.brand || filters.budget || filters.fuel);
  const searchText = [filters.brand, filters.fuel && valueLabel(filters.fuel, lang), filters.budget && h.upTo + ' ' + formatMoney(filters.budget, lang)].filter(Boolean).join(', ');
  const requestMail = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(u.requestSubject + (searchText ? ': ' + searchText : ''));

  const select = (label: string, value: string, onChange: (v: string) => void, options: [string, string][]) =>
    <label className="hp-tool"><span className="sr-only">{label}</span>
      <span className="hp-select"><select aria-label={label} value={value} onChange={e => onChange(e.target.value)}>{options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select><ChevronDown size={16}/></span>
    </label>;

  return <section className="hp-inventory" id="aanbod">
    <div className="hp-container">
      <div className="hp-section-head">
        <div>
          <p className="hp-eyebrow">{u.eyebrow}</p>
          <h2 className="hp-h2">{u.title} <sup className="hp-count">{u.count(shown.length)}</sup></h2>
        </div>
      </div>

      {cars.length > 0 && <div className="hp-toolbar" role="group" aria-label={h.searchTitle}>
        {select(h.brand, filters.brand, v => update({...filters, brand: v}), [['', h.allBrands], ...brands.map(b => [b, b] as [string, string])])}
        {select(h.budget, String(filters.budget), v => update({...filters, budget: Number(v)}), [['0', h.budget + ': ' + h.anyBudget], ...BUDGETS.map(b => [String(b), h.upTo + ' ' + formatMoney(b, lang)] as [string, string])])}
        {select(h.fuel, filters.fuel, v => update({...filters, fuel: v}), [['', h.fuel + ': ' + h.anyFuel], ...FUELS.map(f => [f, valueLabel(f, lang)] as [string, string])])}
        <span className="hp-toolbar-spacer"/>
        {active && <button type="button" className="hp-chip-reset" onClick={() => update({...NO_FILTERS, sort: filters.sort})}><X size={14}/>{u.reset}</button>}
        {select(u.sort, filters.sort, v => update({...filters, sort: v as Sort}), Object.entries(u.sorts) as [string, string][])}
      </div>}

      {cars.length === 0 && <div className="hp-empty">
        <span className="hp-empty-icon"><SearchX size={26}/></span>
        <h3>{u.emptyTitle}</h3>
        <p>{u.emptyNote}</p>
        <div className="hp-hero-actions">
          <a className="hp-btn hp-btn-light" href={requestMail}><Mail size={18}/>{u.request}</a>
          <a className="hp-btn hp-btn-ghost" href={href('/verkopen', lang)}>{u.sellTitle}<ArrowUpRight size={18}/></a>
        </div>
      </div>}

      {cars.length > 0 && shown.length === 0 && <div className="hp-empty is-compact">
        <h3>{u.noneTitle}</h3>
        <p>{u.noneNote}</p>
        <div className="hp-hero-actions">
          <a className="hp-btn hp-btn-light" href={requestMail}><Mail size={18}/>{u.request}</a>
          <button type="button" className="hp-btn hp-btn-ghost" onClick={() => update(NO_FILTERS)}>{u.reset}</button>
        </div>
      </div>}

      {cars.length > 0 && <motion.div className="hp-card-grid" layout>
        <AnimatePresence mode="popLayout">
          {shown.map((c, i) => {
            const cover = c.media.find(m => m.type === 'image');
            const photos = c.media.filter(m => m.type === 'image').length;
            const sold = c.status === 'sold';
            return <motion.article key={c.id} layout className={'hp-card' + (sold ? ' is-sold' : '')}
              initial={{opacity: 0, y: 40}} whileInView={{opacity: 1, y: 0}} exit={{opacity: 0, scale: .96}} viewport={{once: true, margin: '-60px'}}
              transition={{duration: .8, delay: (i % 3) * .08, ease}}>
              <a href={href('/wagens/' + c.slug, lang)} className="hp-card-link" aria-label={c.title + ' — ' + t.details}>
                <span className="hp-card-media">
                  {cover ? <img src={cover.url} alt={cover.alt || c.title} width="900" height="600" loading="lazy"/> : <span className="hp-card-empty">{t.noPhotos}</span>}
                  <span className={'hp-badge' + (sold ? ' is-dark' : '')}>{sold ? t.sold : t.available}</span>
                  <span className="hp-card-count"><Camera size={14}/>{photos}{c.media.some(m => m.type === 'video') && <Play size={13}/>}</span>
                </span>
                <span className="hp-card-body">
                  <span className="hp-card-brand">{c.brand} · {valueLabel(c.body, lang)}</span>
                  <span className="hp-card-title">{c.title}</span>
                  {c.subtitle && <span className="hp-card-sub">{c.subtitle}</span>}
                  <span className="hp-card-facts">
                    <span>{c.year}</span><span>{formatNumber(c.km, lang)} km</span><span>{valueLabel(c.fuel, lang)}</span><span>{valueLabel(c.transmission, lang)}</span>
                  </span>
                  <span className="hp-card-foot">
                    <span className="hp-card-price"><small>{t.price}</small>{formatMoney(c.price, lang)}</span>
                    <span className="hp-card-cta">{u.view}<ArrowUpRight size={16}/></span>
                  </span>
                </span>
              </a>
            </motion.article>;
          })}
          {shown.length > 0 && <motion.article key="search" layout className="hp-card hp-card-promo" initial={{opacity: 0, y: 40}} whileInView={{opacity: 1, y: 0}} viewport={{once: true}} transition={{duration: .8, ease}}>
            <a href={requestMail} className="hp-card-link">
              <span className="hp-promo-icon"><Mail size={22}/></span>
              <span className="hp-promo-title">{u.request}</span>
              <span className="hp-promo-note">{u.emptyNote}</span>
              <span className="hp-btn hp-btn-ghost hp-btn-sm">{EMAIL}</span>
            </a>
          </motion.article>}
          <motion.article key="sell" layout className="hp-card hp-card-promo is-accent" initial={{opacity: 0, y: 40}} whileInView={{opacity: 1, y: 0}} viewport={{once: true}} transition={{duration: .8, delay: .08, ease}}>
            <a href={href('/verkopen', lang)} className="hp-card-link">
              <span className="hp-promo-icon"><KeyRound size={22}/></span>
              <span className="hp-promo-title">{u.sellTitle}</span>
              <span className="hp-promo-note">{u.sellNote}</span>
              <span className="hp-btn hp-btn-light hp-btn-sm">{u.sellCta}<ArrowUpRight size={16}/></span>
            </a>
          </motion.article>
        </AnimatePresence>
      </motion.div>}
    </div>
  </section>;
}

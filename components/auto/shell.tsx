'use client';
import {useEffect, useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {ArrowUpRight, Menu, X} from 'lucide-react';
import {href, type Lang} from '@/lib/i18n';
import {ui, EMAIL} from '@/lib/ui';

const LANGS: Lang[] = ['nl', 'fr', 'en'];

/** Text wordmark — the company is presented by name only, without an emblem. */
export function Wordmark({className = ''}: {className?: string}) {
  return <span className={'hp-wordmark ' + className}>HP<span className="hp-wordmark-dash">-</span>AUTOMOTIVE</span>;
}

export function Brand({lang = 'nl'}: {lang?: Lang}) {
  return <a href={href('/', lang)} className="brand hp-brand" aria-label="HP-Automotive"><Wordmark/></a>;
}

export function Header({lang = 'nl', path = '/', overlay = false}: {lang?: Lang; path?: string; overlay?: boolean}) {
  const t = ui[lang].nav;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.documentElement.lang = lang === 'nl' ? 'nl-BE' : lang === 'fr' ? 'fr-BE' : 'en';
  }, [lang]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle('hp-menu-open', open);
    const close = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [open]);
  const links = [
    {label: t.cars, to: '/#aanbod'},
    {label: t.about, to: '/over-ons'},
    {label: t.contact, to: path + '#contact'},
  ];
  return <>
    <a href="#main" className="skip-link">{lang === 'nl' ? 'Naar de inhoud' : lang === 'fr' ? 'Aller au contenu' : 'Skip to content'}</a>
    <header className={'hp-header' + (overlay ? ' is-overlay' : '') + (scrolled || !overlay ? ' is-solid' : '')} data-hero-header>
      <div className="hp-container hp-header-inner">
        <a href={href('/', lang)} className="hp-header-brand" aria-label="HP-Automotive"><Wordmark/></a>
        <nav className="hp-nav" aria-label={lang === 'nl' ? 'Hoofdnavigatie' : lang === 'fr' ? 'Navigation principale' : 'Main navigation'}>
          {links.map(l => <a key={l.to} href={href(l.to, lang)}>{l.label}</a>)}
        </nav>
        <div className="hp-header-tools">
          <div className="hp-langs" aria-label="Taal / Langue / Language">
            {LANGS.map(l => <a key={l} href={href(path, l)} hrefLang={l} lang={l} aria-current={l === lang ? 'true' : undefined}>{l.toUpperCase()}</a>)}
          </div>
          <a className="hp-btn hp-btn-light hp-btn-sm hp-header-cta" href={href('/verkopen', lang)}>{t.sell}</a>
          <button className="hp-menu-btn" onClick={() => setOpen(true)} aria-label={t.menu} aria-expanded={open}><Menu size={22}/></button>
        </div>
      </div>
    </header>
    <AnimatePresence>
      {open && <motion.div className="hp-mobile-menu" role="dialog" aria-modal="true" aria-label={t.menu}
        initial={{clipPath: 'inset(0 0 100% 0)'}} animate={{clipPath: 'inset(0 0 0% 0)'}} exit={{clipPath: 'inset(0 0 100% 0)'}}
        transition={{duration: .6, ease: [0.76, 0, 0.24, 1]}}>
        <div className="hp-container hp-mobile-top">
          <Wordmark/>
          <button className="hp-menu-btn" onClick={() => setOpen(false)} aria-label={t.close} autoFocus><X size={24}/></button>
        </div>
        <nav className="hp-container hp-mobile-links">
          {[{label: t.home, to: '/'}, ...links, {label: t.sell, to: '/verkopen'}].map((l, i) =>
            <motion.a key={l.to} href={href(l.to, lang)} onClick={() => setOpen(false)}
              initial={{y: 60, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{delay: .25 + i * .06, duration: .6, ease: [0.22, 1, 0.36, 1]}}>
              <span>0{i + 1}</span>{l.label}
            </motion.a>)}
        </nav>
        <div className="hp-container hp-mobile-bottom">
          <div className="hp-langs">{LANGS.map(l => <a key={l} href={href(path, l)} aria-current={l === lang ? 'true' : undefined}>{l.toUpperCase()}</a>)}</div>
          <a href={'mailto:' + EMAIL}>{EMAIL}</a>
        </div>
      </motion.div>}
    </AnimatePresence>
  </>;
}

export function Footer({lang = 'nl', path = '/'}: {lang?: Lang; path?: string}) {
  const t = ui[lang];
  return <footer className="hp-footer" id="contact">
    <div className="hp-container hp-footer-cta">
      <div>
        <p className="hp-eyebrow">{t.contact.eyebrow}</p>
        <h2 className="hp-h2">{t.contact.title}</h2>
        <p className="hp-lead">{t.contact.note}</p>
      </div>
      <a className="hp-mail-link" href={'mailto:' + EMAIL}>
        <span>{EMAIL}</span><ArrowUpRight className="hp-mail-arrow"/>
      </a>
    </div>
    <div className="hp-container hp-footer-grid">
      <div>
        <Wordmark className="hp-footer-mark"/>
        <p className="hp-footer-tagline">{t.footer.tagline}</p>
      </div>
      <div>
        <p className="hp-footer-title">{t.footer.explore}</p>
        <a href={href('/#aanbod', lang)}>{t.nav.cars}</a>
        <a href={href('/verkopen', lang)}>{t.nav.sell}</a>
        <a href={href('/over-ons', lang)}>{t.nav.about}</a>
      </div>
      <div>
        <p className="hp-footer-title">{t.footer.company}</p>
        <a href={'mailto:' + EMAIL}>{EMAIL}</a>
        <a href={href('/privacy', lang)}>{lang === 'nl' ? 'Privacy' : lang === 'fr' ? 'Confidentialité' : 'Privacy'}</a>
        <span>HP-Company · BE1039.979.065</span>
      </div>
      <div>
        <p className="hp-footer-title">{t.footer.languages}</p>
        <div className="hp-langs">{LANGS.map(l => <a key={l} href={href(path, l)} aria-current={l === lang ? 'true' : undefined}>{l.toUpperCase()}</a>)}</div>
      </div>
    </div>
    <div className="hp-footer-giant" aria-hidden="true">HP-AUTOMOTIVE</div>
    <div className="hp-container hp-footer-bottom">
      <span>© {new Date().getFullYear()} HP-Automotive — {t.footer.rights}</span>
      <span>Belgium</span>
    </div>
  </footer>;
}

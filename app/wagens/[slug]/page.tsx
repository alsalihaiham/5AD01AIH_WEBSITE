import {notFound} from 'next/navigation';
import {Header, Footer} from '@/components/auto/shell';
import Gallery, {ShareButton} from '@/components/auto/gallery';
import {Reveal} from '@/components/hp/motion';
import {getCar, adminUser} from '@/lib/server';
import {copy, language, href, carText, formatMoney, formatNumber, valueLabel, tr} from '@/lib/i18n';
import {ui, EMAIL} from '@/lib/ui';
import {Check, ArrowLeft, ArrowUpRight, CalendarDays, Gauge, Fuel, Settings2, Info, Zap, KeyRound, Mail} from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata({params}: {params: Promise<{slug: string}>}) {
  const c = await getCar((await params).slug);
  return {title: c ? c.title : 'HP-Automotive', description: c ? (c.demo ? 'Demonstration listing. ' : c.subtitle + ' — ') + c.title : undefined, robots: c?.demo ? {index: false, follow: true} : undefined};
}

export default async function CarPage({params, searchParams}: {params: Promise<{slug: string}>; searchParams: Promise<{lang?: string}>}) {
  const lang = language((await searchParams).lang), t = copy[lang], u = ui[lang];
  const raw = await getCar((await params).slug, !!await adminUser());
  if (!raw) notFound();
  const car = carText(raw, lang);
  const path = '/wagens/' + car.slug;
  const subject = tr(lang, 'Interesse in ', 'Intérêt pour ', 'Enquiry about ') + car.title;
  const mail = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(tr(lang,
    `Beste HP-Automotive,\n\nIk wil graag meer informatie over ${car.title} (referentie ${car.slug}) en een bezichtiging bespreken.\n\nMet vriendelijke groeten,`,
    `Bonjour HP-Automotive,\n\nJe souhaite en savoir plus sur ${car.title} (référence ${car.slug}) et organiser une visite.\n\nCordialement,`,
    `Hello HP-Automotive,\n\nI would like to learn more about ${car.title} (reference ${car.slug}) and arrange a viewing.\n\nKind regards,`));
  const v = (n: number | null | undefined, unit = '') => n === null || n === undefined ? t.unknown : formatNumber(n, lang) + (unit ? ' ' + unit : '');
  const hp = car.power ? `${car.power} kW / ${Math.round(car.power * 1.35962)} ${lang === 'nl' ? 'pk' : lang === 'fr' ? 'ch' : 'hp'}` : t.unknown;
  const quick = [
    {Icon: CalendarDays, name: t.year, value: String(car.year)},
    {Icon: Gauge, name: t.km, value: formatNumber(car.km, lang) + ' km'},
    {Icon: Fuel, name: t.fuel, value: valueLabel(car.fuel, lang)},
    {Icon: Settings2, name: t.gear, value: valueLabel(car.transmission, lang)},
    {Icon: Zap, name: t.power, value: hp},
  ];
  const specs = [[t.registration, car.registration || String(car.year)], [t.body, valueLabel(car.body, lang)], [t.power, hp], [t.colour, car.colour || t.unknown], [t.doors, v(car.doors)], [t.seats, v(car.seats)], [t.capacity, v(car.capacity, 'cm³')], [t.co2, v(car.co2, 'g/km') + (car.co2Standard ? ' (' + car.co2Standard + ')' : '')], [t.euro, car.euro || t.unknown], [t.consumption, v(car.consumption, 'l/100 km')], ...(car.fuel === 'Elektrisch' || car.fuel === 'Hybride' ? [[t.battery, v(car.battery, 'kWh')], [t.range, v(car.range, 'km')]] : [])];
  const history = [[t.owners, v(car.owners)], [t.service, valueLabel(car.serviceHistory || 'Onbekend', lang)], [t.carpass, valueLabel(car.carpass || 'Onbekend', lang)], [t.inspection, car.inspection || t.unknown], [t.damage, car.damage || t.unknown]];
  const status = car.demo ? t.demo : car.status === 'sold' ? t.sold : t.available;

  return <div className="hp" lang={lang}>
    <Header lang={lang} path={path}/>
    <main id="main" className="hp-container hp-detail">
      <div className="hp-detail-top">
        <nav className="hp-crumbs" aria-label="Breadcrumb">
          <a href={href('/#aanbod', lang)}><ArrowLeft size={16}/>{u.detail.home}</a><span>/</span><span aria-current="page">{car.title}</span>
        </nav>
        <ShareButton title={car.title} lang={lang}/>
      </div>
      {car.demo && <div className="hp-notice"><Info size={18}/><p>{t.demoNote}</p></div>}
      {car.status === 'draft' && <div className="hp-notice">Concept — alleen zichtbaar voor beheerders.</div>}

      <div className="hp-detail-grid">
        <div className="hp-detail-main">
          <Reveal y={24}><Gallery media={car.media} title={car.title} lang={lang}/></Reveal>

          <Reveal className="hp-quick" y={24}>
            {quick.map(s => <div key={s.name}><s.Icon size={20}/><small>{s.name}</small><strong>{s.value}</strong></div>)}
          </Reveal>

          <nav className="hp-tabs" aria-label={u.detail.more}>
            <a href="#omschrijving">{t.description}</a><a href="#specificaties">{t.specs}</a><a href="#uitrusting">{t.equipment}</a>
          </nav>

          <Reveal as="div" className="hp-detail-section"><section id="omschrijving">
            <h2>{t.description}</h2>
            {lang !== 'nl' && !car.translations?.[lang] && !car.demo && <p className="hp-small-note">{t.original}</p>}
            <div className="hp-description">{car.description.split('\n').filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}</div>
          </section></Reveal>

          <Reveal as="div" className="hp-detail-section"><section id="specificaties">
            <h2>{t.specs}</h2>
            <dl className="hp-spec-table">{specs.map(([k, val]) => <div key={k}><dt>{k}</dt><dd>{val}</dd></div>)}</dl>
            <details className="hp-history">
              <summary>{tr(lang, 'Historiek & staat', 'Historique & état', 'History & condition')}</summary>
              <dl className="hp-spec-table">{history.map(([k, val]) => <div key={k}><dt>{k}</dt><dd>{val}</dd></div>)}</dl>
            </details>
          </section></Reveal>

          <Reveal as="div" className="hp-detail-section"><section id="uitrusting">
            <h2>{t.equipment}</h2>
            {car.options.length > 0
              ? <ul className="hp-options">{car.options.map((o, i) => <li key={i}><Check size={16}/>{valueLabel(o, lang)}</li>)}</ul>
              : <p className="hp-muted-text">{t.unknown}</p>}
          </section></Reveal>
        </div>

        <aside className="hp-detail-aside">
          <div className="hp-buy-card">
            <span className={'hp-badge' + (car.status === 'sold' ? ' is-dark' : car.demo ? ' is-outline' : '')}>{status}</span>
            <p className="hp-buy-brand">{car.brand} · {valueLabel(car.body, lang)}</p>
            <h1>{car.title}</h1>
            <p className="hp-buy-sub">{car.subtitle}</p>
            <div className="hp-buy-facts">
              <span>{car.year}</span><span>{formatNumber(car.km, lang)} km</span><span>{valueLabel(car.fuel, lang)}</span><span>{valueLabel(car.transmission, lang)}</span>
            </div>
            <div className="hp-buy-price">
              <small>{car.demo ? t.demo : t.price}</small>
              <strong>{formatMoney(car.price, lang)}</strong>
              <p>{car.demo ? t.demoNote : t.terms}</p>
            </div>
            <a className="hp-btn hp-btn-light hp-btn-block" href={mail}>{car.demo || car.status === 'sold' ? t.contact : t.appointment}<ArrowUpRight size={18}/></a>
            <a className="hp-btn hp-btn-ghost hp-btn-block" href={mail}><Mail size={16}/>{EMAIL}</a>
            <ul className="hp-checks is-small">{u.detail.trust.map(item => <li key={item}><Check size={15}/>{item}</li>)}</ul>
            <a className="hp-trade" href={href('/verkopen', lang)}>
              <KeyRound size={20}/><span><strong>{u.detail.tradeTitle}</strong><small>{u.detail.tradeCta} →</small></span>
            </a>
          </div>
        </aside>
      </div>
      <div className="hp-mobile-bar">
        <div><small>{car.title}</small><strong>{formatMoney(car.price, lang)}</strong></div>
        <a href={mail} className="hp-btn hp-btn-light hp-btn-sm">{t.contact}<ArrowUpRight size={16}/></a>
      </div>
    </main>
    <Footer lang={lang} path={path}/>
  </div>;
}

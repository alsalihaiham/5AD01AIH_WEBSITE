import {Header, Footer} from '@/components/auto/shell';
import Catalog from '@/components/auto/catalog';
import Gate from '@/components/hp/gate';
import {gateScript} from '@/components/hp/gate-script';
import Hero, {type HeroCar} from '@/components/hp/hero';
import ParallaxGallery, {type Tile} from '@/components/hp/parallax-gallery';
import {Marquee, ParallaxImage, Reveal} from '@/components/hp/motion';
import {listCars} from '@/lib/server';
import {language, href, carText} from '@/lib/i18n';
import {ui} from '@/lib/ui';
import {ArrowUpRight} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Home({searchParams}: {searchParams: Promise<{lang?: string}>}) {
  const lang = language((await searchParams).lang), u = ui[lang];
  const cars = (await listCars()).map(c => carText(c, lang));
  const featured = cars.find(c => c.status === 'published') || cars[0];
  const cover = (c?: typeof featured) => c?.media.find(m => m.type === 'image')?.url;
  const hero: HeroCar | null = featured ? {
    slug: featured.slug, title: featured.title, subtitle: featured.subtitle, demo: featured.demo, status: featured.status,
    price: featured.price, year: featured.year, km: featured.km, power: featured.power, fuel: featured.fuel,
    transmission: featured.transmission, image: cover(featured) || '/media/demo-car-1.jpg',
  } : null;
  const tiles: Tile[] = cars.flatMap(c => c.media.map(m => ({url: m.url, type: m.type, alt: m.alt || c.title, slug: c.slug, title: c.title, poster: cover(c)})));
  // Lead with a video when one exists; it makes the largest tile.
  tiles.sort((a, b) => (a.type === 'video' ? -1 : 0) - (b.type === 'video' ? -1 : 0));
  const sellImage = featured?.media.filter(m => m.type === 'image').at(-1)?.url || '/media/demo-car-3.jpg';

  return <div className="hp hp-home" lang={lang}>
    <script dangerouslySetInnerHTML={{__html: gateScript}}/>
    <Gate lang={lang} buyImage={hero?.image || '/media/demo-car-1.jpg'} sellImage={sellImage}/>
    <Header lang={lang} overlay/>
    <main id="main">
      <Hero lang={lang} car={hero}/>
      <Marquee items={u.marquee}/>
      <Catalog cars={cars} lang={lang}/>
      <ParallaxGallery lang={lang} tiles={tiles}/>
      <section className="hp-sell-band">
        <ParallaxImage src={sellImage} className="hp-sell-band-media"/>
        <div className="hp-container hp-sell-band-inner">
          <Reveal>
            <p className="hp-eyebrow">{u.sell.eyebrow}</p>
            <h2 className="hp-h1">{u.sell.title}</h2>
            <p className="hp-lead">{u.sell.note}</p>
          </Reveal>
          <ol className="hp-steps">
            {u.sell.steps.map(([n, label], i) => <Reveal as="li" key={n} delay={.1 + i * .1}><span>{n}</span>{label}</Reveal>)}
          </ol>
          <Reveal delay={.3}>
            <a className="hp-btn hp-btn-light hp-btn-lg" href={href('/verkopen', lang)}>{u.sell.cta}<ArrowUpRight size={20}/></a>
          </Reveal>
        </div>
      </section>
    </main>
    <Footer lang={lang}/>
  </div>;
}

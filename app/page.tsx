import {Header, Footer} from '@/components/auto/shell';
import Catalog from '@/components/auto/catalog';
import Gate from '@/components/hp/gate';
import {gateScript} from '@/components/hp/gate-script';
import Hero, {type HeroCar} from '@/components/hp/hero';
import ParallaxGallery, {type Tile} from '@/components/hp/parallax-gallery';
import Valuation from '@/components/hp/valuation';
import {Usps, Steps, Faq} from '@/components/hp/sections';
import {listCars} from '@/lib/server';
import {language, carText} from '@/lib/i18n';
import {POPULAR_BRANDS} from '@/lib/ui';
import {readFilters} from '@/lib/filters';

export const dynamic = 'force-dynamic';

export default async function Home({searchParams}: {searchParams: Promise<Record<string, string | string[] | undefined>>}) {
  const params = await searchParams;
  const lang = language(params.lang);
  const filters = readFilters(params);
  const cars = (await listCars()).map(c => carText(c, lang));
  const cover = (c: (typeof cars)[number]) => c.media.find(m => m.type === 'image')?.url;
  const brands = Array.from(new Set([...cars.map(c => c.brand), ...POPULAR_BRANDS])).filter(Boolean).sort((a, b) => a.localeCompare(b));
  // The newest available car with a photo is featured in the hero.
  const newest = cars.filter(c => c.status === 'published' && cover(c)).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
  const featured: HeroCar | null = newest ? {slug: newest.slug, title: newest.title, price: newest.price, year: newest.year, km: newest.km, image: cover(newest)!} : null;
  const tiles: Tile[] = cars.flatMap(c => c.media.map(m => ({url: m.url, type: m.type, alt: m.alt || c.title, slug: c.slug, title: c.title, poster: cover(c)})));
  tiles.sort((a, b) => (a.type === 'video' ? -1 : 0) - (b.type === 'video' ? -1 : 0));

  return <div className="hp hp-home" lang={lang}>
    <script dangerouslySetInnerHTML={{__html: gateScript}}/>
    <Gate lang={lang}/>
    <Header lang={lang} overlay/>
    <main id="main">
      <Hero lang={lang} stock={cars.map(c => ({brand: c.brand, price: c.price, fuel: c.fuel, status: c.status}))} brands={brands} featured={featured} initial={filters}/>
      <Usps lang={lang}/>
      <Catalog cars={cars} lang={lang} brands={brands} initial={filters}/>
      {tiles.length >= 3 && <ParallaxGallery lang={lang} tiles={tiles}/>}
      <Steps lang={lang}/>
      <Valuation lang={lang}/>
      <Faq lang={lang}/>
    </main>
    <Footer lang={lang}/>
  </div>;
}

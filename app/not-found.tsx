import Link from 'next/link';
import {Header, Footer} from '@/components/auto/shell';
export default function Missing() {
  return <div className="hp">
    <Header/>
    <main className="hp-container hp-access">
      <p className="hp-eyebrow"><span className="hp-dot"/>404</p>
      <h1 className="hp-h1">Deze wagen staat hier niet meer.</h1>
      <p className="hp-lead">Misschien is de link gewijzigd of de advertentie offline gehaald.</p>
      <Link className="hp-btn hp-btn-light" href="/#aanbod">Bekijk het aanbod</Link>
    </main>
    <Footer/>
  </div>;
}

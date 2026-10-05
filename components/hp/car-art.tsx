/** Line drawing of a coupé. Strokes use currentColor so it follows the light/dark theme; GSAP draws it in via [data-draw]. */
export default function CarArt({className = ''}: {className?: string}) {
  const wheel = (cx: number) => <g data-wheel>
    <circle data-draw cx={cx} cy="206" r="46"/>
    <circle data-draw cx={cx} cy="206" r="31" className="hp-art-soft"/>
    {[0, 72, 144, 216, 288].map(a => <line data-draw key={a} x1={cx} y1="206" x2={cx + 29 * Math.cos(a * Math.PI / 180)} y2={206 + 29 * Math.sin(a * Math.PI / 180)} className="hp-art-soft"/>)}
    <circle cx={cx} cy="206" r="5" className="hp-art-fill"/>
  </g>;
  return <svg className={'hp-art ' + className} viewBox="0 0 820 290" fill="none" aria-hidden="true">
    <defs>
      <radialGradient id="hp-beam" cx="0" cy="0.5" r="1">
        <stop offset="0" stopColor="var(--hp-accent)" stopOpacity=".55"/>
        <stop offset="1" stopColor="var(--hp-accent)" stopOpacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="420" cy="254" rx="370" ry="14" className="hp-art-shadow"/>
    <path data-beam d="M782 166 L820 124 L820 214 Z" fill="url(#hp-beam)"/>
    <line data-draw x1="20" y1="252" x2="800" y2="252" className="hp-art-soft"/>
    <path data-draw d="M64 196 C56 182 58 166 70 156 L98 146 C150 138 200 132 250 126 C300 104 352 88 420 84 C486 81 530 88 566 106 L618 132 C670 138 730 146 764 156 C782 162 790 174 788 188 L782 200 L694 204 A54 54 0 0 0 586 204 L264 204 A54 54 0 0 0 156 204 L64 196 Z"/>
    <path data-draw d="M268 128 C318 106 360 96 420 93 C478 91 520 98 552 112 L584 130 Z" className="hp-art-soft"/>
    <path data-draw d="M446 92 L452 130 M452 130 L446 202 M590 136 L584 202 M100 156 C300 140 560 140 762 158 M270 197 L580 197" className="hp-art-soft"/>
    <path d="M752 152 L784 164 L780 172 L748 164 Z" className="hp-art-light"/>
    <path d="M70 158 L98 150 L100 158 L73 166 Z" className="hp-art-tail"/>
    {wheel(210)}
    {wheel(640)}
  </svg>;
}

/** Speedometer-style gauge used for the "sell" side: the needle swings towards a value. */
export function GaugeArt({className = ''}: {className?: string}) {
  const ticks = Array.from({length: 25}, (_, i) => {
    const a = (-210 + i * 10) * Math.PI / 180, major = i % 4 === 0;
    const r1 = major ? 118 : 126, r2 = 138;
    return <line key={i} x1={160 + r1 * Math.cos(a)} y1={160 + r1 * Math.sin(a)} x2={160 + r2 * Math.cos(a)} y2={160 + r2 * Math.sin(a)} className={major ? '' : 'hp-art-soft'}/>;
  });
  return <svg className={'hp-art hp-gauge ' + className} viewBox="0 0 320 300" fill="none" aria-hidden="true">
    <path d="M40.4 229 A138 138 0 1 1 279.6 229" className="hp-art-soft"/>
    <path d="M58 219 A118 118 0 0 1 160 42" className="hp-gauge-arc"/>
    {ticks}
    <g className="hp-gauge-needle"><line x1="160" y1="160" x2="160" y2="52"/><circle cx="160" cy="160" r="10" className="hp-art-fill"/></g>
    <text x="160" y="232" textAnchor="middle" className="hp-gauge-text">€</text>
  </svg>;
}

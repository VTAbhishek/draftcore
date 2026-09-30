import { createElement, useId } from 'react'

// Interior elevations (800 × 500) described as data so each renders two ways:
//   mode="render" — lit presentation elevation (materials, light washes, contact shadows, grain)
//   mode="wire"   — CAD sheet (linework, dimensions, leader tags, hatching, title block)
// Shape keys: t = r(ect) | e(llipse) | p(ath) | l(ine); m = material; rot = degrees about the shape centre;
// stroke/sw = explicit stroke; renderOnly / wireOnly limit a shape to one mode.

const FLOOR = 420

function rng(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const R = (x, y, w, h, m, o = {}) => ({ t: 'r', x, y, w, h, m, ...o })
const E = (cx, cy, rx, ry, m, o = {}) => ({ t: 'e', cx, cy, rx, ry, m, ...o })
const P = (d, m, o = {}) => ({ t: 'p', d, m, ...o })
const L = (x1, y1, x2, y2, o = {}) => ({ t: 'l', x1, y1, x2, y2, ...o })

function oliveTree(cx, top, seed) {
  const r = rng(seed)
  const out = [
    P(`M${cx} 352 C${cx - 6} 320 ${cx + 8} 296 ${cx - 2} ${top + 70} M${cx} 318 C${cx + 14} 300 ${cx + 22} 284 ${cx + 26} ${top + 60} M${cx - 1} 300 C${cx - 16} 286 ${cx - 24} 270 ${cx - 30} ${top + 66}`, null, {
      stroke: '#6B5846',
      sw: 2.6,
    }),
  ]
  // soft canopy masses first, then individual leaves on top
  for (const [dx, dy, rx, ry] of [[-18, 70, 34, 26], [20, 58, 36, 28], [0, 40, 30, 24], [-30, 44, 22, 18], [34, 82, 24, 18]]) {
    out.push(E(cx + dx, top + dy, rx, ry, 'canopy', { renderOnly: true }))
  }
  for (let i = 0; i < 140; i++) {
    const a = r() * Math.PI * 2
    const d = Math.sqrt(r())
    out.push(E(cx + Math.cos(a) * d * 56, top + 62 + Math.sin(a) * d * 46, 8, 2.8, r() > 0.5 ? 'leaf' : r() > 0.5 ? 'leaf2' : 'leaf3', { rot: r() * 180, wireSkip: i % 3 !== 0 }))
  }
  return out
}

// ── scenes ──────────────────────────────────────────────────────────────────
const lounge = {
  title: 'ELEVATION A — LOUNGE',
  sheet: 'DC-A01',
  back: [
    R(40, 48, 430, 360, 'flute'),
    R(40, 44, 430, 4, 'led', { renderOnly: true }),
    R(548, 112, 196, 136, 'walnut', { shadow: true }),
    R(556, 120, 180, 120, 'paper'),
    R(568, 132, 156, 96, 'art'),
    P('M574 206 C600 176 634 214 668 184 S712 162 718 150', null, { stroke: '#F1E2C4', sw: 2.4, renderOnly: true }),
    P('M580 150 C606 142 626 160 650 150', null, { stroke: '#1C3440', sw: 3, renderOnly: true }),
    E(690, 200, 16, 16, 'artDot', { renderOnly: true }),
    R(610, 97, 72, 5, 'brass', { r: 2 }),
    L(646, 102, 646, 112, { stroke: '#A87E3C', sw: 1.5 }),
  ],
  floor: [P('M92 424 H560 L604 484 H48 Z', 'rug'), P('M106 428 H546 L584 478 H68 Z', null, { stroke: '#A8927A', sw: 1.2 })],
  front: [
    R(104, 386, 312, 18, 'boucleDark', { r: 5 }),
    R(118, 404, 8, 15, 'metal', { r: 1 }),
    R(394, 404, 8, 15, 'metal', { r: 1 }),
    R(118, 284, 148, 80, 'boucle', { r: 24 }),
    R(254, 284, 148, 80, 'boucle', { r: 24 }),
    R(112, 350, 150, 42, 'boucle', { r: 14 }),
    R(258, 350, 150, 42, 'boucle', { r: 14 }),
    R(86, 310, 42, 94, 'boucle', { r: 20 }),
    R(392, 310, 42, 94, 'boucle', { r: 20 }),
    R(142, 300, 58, 52, 'terracotta', { r: 12, rot: -8 }),
    R(200, 314, 46, 40, 'linen', { r: 10, rot: 4 }),
    R(330, 304, 52, 48, 'olive', { r: 12, rot: 7 }),
    P('M394 316 C406 312 422 314 434 320 L436 372 C428 382 410 386 398 382 Z', 'throw'),
    P('M404 326 C412 346 408 362 406 378 M418 322 C424 340 422 360 420 382', null, { stroke: 'rgba(40,40,30,0.18)', sw: 1, renderOnly: true }),
    R(184, 372, 170, 13, 'travertine', { r: 6 }),
    P('M232 385 H306 L298 418 H240 Z', 'travertine'),
    R(204, 360, 46, 6, 'bookA', { r: 1 }),
    R(208, 354, 40, 6, 'bookB', { r: 1 }),
    P('M292 372 C284 366 283 350 290 342 C286 336 288 330 294 330 H302 C308 330 310 336 306 342 C313 350 312 366 304 372 Z', 'ceramic'),
    P('M298 332 C296 310 288 292 278 276 M298 332 C304 312 314 298 328 286 M296 318 C290 312 284 306 274 304', null, { stroke: '#6B5846', sw: 1.3 }),
    E(476, 362, 30, 5, 'brass'),
    R(473, 362, 6, 52, 'brass'),
    E(476, 416, 20, 3.5, 'brass'),
    P('M462 362 C458 350 460 336 468 330 H484 C492 336 494 350 490 362 Z', 'ceramicDark'),
    R(474, 318, 4, 12, 'brass'),
    P('M452 318 H500 L492 284 H460 Z', 'lampShade'),
    P('M698 418 L704 356 H752 L758 418 Z', 'planter'),
    R(700, 350, 56, 7, 'planter', { r: 2 }),
    ...oliveTree(728, 196, 7),
  ],
  shadows: [
    [262, 419, 188, 7],
    [270, 419, 48, 4],
    [476, 419, 26, 3.5],
    [728, 419, 38, 5],
    [212, 367, 30, 2.5],
  ],
  lights: [
    { k: 'cove', x: 40, y: 48, w: 430, h: 170 },
    { k: 'scallop', x: 140 },
    { k: 'scallop', x: 370 },
    { k: 'cone', x: 646, y: 102, w: 210, h: 150 },
    { k: 'glow', x: 476, y: 300, r: 110 },
    { k: 'floor', x: 476, y: 432, rx: 90 },
    { k: 'floor', x: 250, y: 430, rx: 150 },
  ],
  dims: [
    { x1: 40, y1: 34, x2: 470, y2: 34, label: '4 300' },
    { x1: 548, y1: 264, x2: 744, y2: 264, label: '1 960' },
    { x1: 20, y1: 284, x2: 20, y2: 420, label: '850' },
  ],
  tags: [
    { x: 255, y: 92, label: 'WP-01 · FLUTED OAK', to: [255, 150] },
    { x: 150, y: 258, label: 'FF-01 · SOFA', to: [180, 300] },
    { x: 330, y: 452, label: 'FF-02 · TRAVERTINE', to: [280, 380] },
    { x: 560, y: 300, label: 'LT-02 · LAMP', to: [498, 300] },
    { x: 646, y: 80, label: 'AR-01 · ARTWORK', to: [646, 112] },
    { x: 640, y: 332, label: 'PL-01', to: [704, 300] },
  ],
  hotspots: [
    { x: 255, y: 170, title: 'Fluted oak panelling', spec: 'WP-01 · veneer panels with integrated LED cove' },
    { x: 172, y: 334, title: 'Bouclé sofa', spec: 'FF-01 · three-seater in oatmeal bouclé' },
    { x: 268, y: 378, title: 'Travertine coffee table', spec: 'FF-02 · honed travertine, pedestal base' },
    { x: 476, y: 300, title: 'Table lamp', spec: 'LT-02 · ceramic base, linen shade' },
    { x: 646, y: 176, title: 'Artwork & picture light', spec: 'AR-01 · brass picture light over framed print' },
    { x: 728, y: 250, title: 'Olive tree', spec: 'PL-01 · ceramic planter' },
  ],
}

const joinery = {
  title: 'ELEVATION B — KITCHEN',
  sheet: 'DC-B02',
  back: [
    R(60, 194, 470, 96, 'zellige'),
    ...Array.from({ length: 4 }, (_, i) => R(60 + i * 117.5, 62, 115, 130, 'lacquer', { r: 2 })),
    ...Array.from({ length: 4 }, (_, i) => R(105 + i * 117.5, 180, 26, 3, 'brass', { r: 1.5 })),
    R(578, 54, 174, 356, 'oak'),
    L(665, 54, 665, 410, { stroke: 'rgba(60,40,25,0.4)', sw: 1.2 }),
    R(654, 206, 3, 74, 'brass', { r: 1.5 }),
    R(673, 206, 3, 74, 'brass', { r: 1.5 }),
  ],
  floor: [],
  front: [
    R(52, 288, 486, 14, 'travertine', { r: 2 }),
    ...Array.from({ length: 4 }, (_, i) => R(60 + i * 117.5, 302, 115, 104, 'oak')),
    ...Array.from({ length: 4 }, (_, i) => L(60 + i * 117.5, 336, 175 + i * 117.5, 336, { stroke: 'rgba(60,40,25,0.45)', sw: 1 })),
    ...Array.from({ length: 4 }, (_, i) => R(100 + i * 117.5, 316, 36, 3, 'brass', { r: 1.5 })),
    R(60, 406, 470, 8, 'metal'),
    P('M86 288 Q110 262 134 288 Z', 'ceramic'),
    E(104, 276, 7, 7, 'terracotta'),
    E(116, 274, 6, 6, 'olive'),
    R(334, 234, 40, 54, 'oakLight', { r: 8, rot: -6 }),
    R(420, 246, 50, 42, 'metal', { r: 6 }),
    R(430, 256, 30, 4, 'brass', { r: 1 }),
    R(244, 266, 24, 22, 'planter', { r: 3 }),
    ...Array.from({ length: 12 }, (_, i) => E(256 + Math.cos(i * 0.9) * 12, 256 + Math.sin(i * 1.3) * 8, 6, 2.2, i % 2 ? 'leaf' : 'leaf2', { rot: i * 33 })),
  ],
  shadows: [
    [295, 419, 245, 5],
    [665, 419, 96, 5],
    [110, 289, 26, 2],
    [445, 289, 28, 2],
  ],
  lights: [
    { k: 'scallop', x: 120 },
    { k: 'scallop', x: 330 },
    { k: 'scallop', x: 665 },
    { k: 'cove', x: 60, y: 194, w: 470, h: 90 },
    { k: 'floor', x: 300, y: 434, rx: 220 },
  ],
  dims: [
    { x1: 60, y1: 42, x2: 530, y2: 42, label: '4 700' },
    { x1: 578, y1: 40, x2: 752, y2: 40, label: '1 700' },
    { x1: 30, y1: 288, x2: 30, y2: 420, label: '900' },
  ],
  tags: [
    { x: 295, y: 128, label: 'JN-01 · WALL UNITS', to: [295, 176] },
    { x: 220, y: 238, label: 'TL-01 · ZELLIGE', to: [180, 250] },
    { x: 300, y: 452, label: 'JN-02 · BASE UNITS', to: [300, 360] },
    { x: 665, y: 330, label: 'JN-03 · TALL UNIT', to: [700, 300] },
  ],
  hotspots: [
    { x: 177, y: 128, title: 'Lacquered wall units', spec: 'JN-01 · matt lacquer, brass pulls' },
    { x: 470, y: 222, title: 'Zellige splashback', spec: 'TL-01 · glazed tile, LED under-lighting' },
    { x: 200, y: 294, title: 'Travertine worktop', spec: 'ST-01 · 30 mm honed travertine' },
    { x: 360, y: 360, title: 'Oak base units', spec: 'JN-02 · oak veneer, drawer fronts' },
    { x: 700, y: 150, title: 'Oak tall unit', spec: 'JN-03 · full-height pantry' },
  ],
}

const PRODUCT_H = [40, 52, 34, 46, 58, 38]
const PRODUCT_M = ['lacquer', 'brass', 'terracotta', 'ceramic', 'olive', 'linen']
const retail = {
  title: 'ELEVATION C — RETAIL',
  sheet: 'DC-C03',
  back: [
    R(50, 56, 400, 352, 'metal', { r: 3 }),
    R(60, 64, 380, 336, 'displayBack'),
    ...[0, 1, 2, 3].flatMap((j) => {
      const shelfY = 128 + j * 70
      return [
        ...Array.from({ length: 6 }, (_, k) => {
          const h = PRODUCT_H[(k + j) % 6]
          return R(76 + k * 60, shelfY - h, 40, h, PRODUCT_M[(k + j * 2) % 6], { r: 3 })
        }),
        R(60, shelfY, 380, 7, 'oak'),
      ]
    }),
    R(520, 108, 212, 58, 'brass', { r: 5, shadow: true }),
    R(528, 116, 196, 42, 'metal', { r: 3 }),
    ...Array.from({ length: 9 }, (_, i) => R(548 + i * 18, 130, 10, 14, 'brass', { r: 1, renderOnly: true })),
  ],
  floor: [],
  front: [
    L(60, 34, 760, 34, { stroke: '#23272D', sw: 3 }),
    ...[150, 280, 410].map((x) => R(x - 8, 34, 16, 18, 'metal', { r: 3 })),
    L(625, 24, 625, 190, { stroke: '#2A2E33', sw: 1.2 }),
    E(625, 206, 17, 17, 'globe'),
    R(486, 288, 278, 13, 'travertine', { r: 2 }),
    R(496, 301, 258, 110, 'flute'),
    R(500, 411, 250, 8, 'metal'),
    R(536, 262, 44, 26, 'metal', { r: 4 }),
    P('M700 288 C694 280 694 266 700 258 H712 C718 266 718 280 712 288 Z', 'ceramic'),
  ],
  shadows: [
    [625, 419, 140, 6],
    [250, 419, 205, 5],
    [558, 289, 26, 2],
  ],
  lights: [
    ...[128, 198, 268, 338].map((y) => ({ k: 'cove', x: 60, y: y + 7, w: 380, h: 50 })),
    ...[150, 280, 410].map((x) => ({ k: 'cone', x, y: 52, w: 150, h: 200 })),
    { k: 'glow', x: 625, y: 206, r: 130 },
    { k: 'floor', x: 625, y: 432, rx: 130 },
  ],
  dims: [
    { x1: 50, y1: 46, x2: 450, y2: 46, label: '4 000' },
    { x1: 780, y1: 288, x2: 780, y2: 420, label: '1 100' },
  ],
  tags: [
    { x: 250, y: 236, label: 'DS-01 · DISPLAY', to: [250, 280] },
    { x: 625, y: 88, label: 'SG-01', to: [625, 108] },
    { x: 625, y: 452, label: 'CT-01 · COUNTER', to: [625, 360] },
  ],
  hotspots: [
    { x: 250, y: 160, title: 'Backlit display wall', spec: 'DS-01 · oak shelves with LED strips' },
    { x: 626, y: 137, title: 'Brass signage', spec: 'SG-01 · brushed brass, halo-lit' },
    { x: 625, y: 206, title: 'Glass pendant', spec: 'LT-04 · opal globe' },
    { x: 625, y: 356, title: 'Fluted counter', spec: 'CT-01 · fluted oak, travertine top' },
  ],
}

export const SCENES = { lounge, joinery, retail }

// ── materials ───────────────────────────────────────────────────────────────
function materials(id) {
  const u = (n) => `url(#${id}-${n})`
  const solid = (fill) => ({ fill, overlays: [u('shade')] })
  return {
    wall: { fill: u('wall') },
    flute: { fill: u('flute'), overlays: [u('shade')] },
    oak: { fill: u('oakG'), overlays: [u('grain'), u('shade')] },
    oakLight: solid('#C9A57E'),
    walnut: solid('#5A3E2B'),
    lacquer: solid('#EEEAE3'),
    boucle: { fill: u('boucleG'), overlays: [u('dots')] },
    boucleDark: solid('#B9AD9B'),
    terracotta: solid('#B96A4A'),
    olive: solid('#7B7F5A'),
    linen: solid('#E8DFD0'),
    throw: solid('#8E9C8D'),
    travertine: { fill: u('trav'), overlays: [u('veins'), u('shade')] },
    ceramic: solid('#DAD4CA'),
    ceramicDark: solid('#3E4247'),
    planter: solid('#CFC6B8'),
    brass: { fill: u('brass') },
    metal: solid('#24282D'),
    lampShade: { fill: '#FBE9C8' },
    art: { fill: u('art') },
    artDot: { fill: '#D9A441' },
    paper: { fill: '#F7F4EE' },
    rug: { fill: '#D9CFBF', overlays: [u('dots')] },
    zellige: { fill: u('zellige') },
    displayBack: solid('#2E2A27'),
    globe: { fill: u('globe') },
    leaf: { fill: '#71925F' },
    leaf2: { fill: '#556F49' },
    leaf3: { fill: '#8FA878' },
    canopy: { fill: '#4E6844', overlays: [u('shade')] },
    bookA: { fill: '#37474F' },
    bookB: { fill: '#C8B79A' },
    led: { fill: '#FFF4DE' },
  }
}

function geometry(s) {
  switch (s.t) {
    case 'r':
      return ['rect', { x: s.x, y: s.y, width: s.w, height: s.h, rx: s.r || 0 }, [s.x + s.w / 2, s.y + s.h / 2]]
    case 'e':
      return ['ellipse', { cx: s.cx, cy: s.cy, rx: s.rx, ry: s.ry }, [s.cx, s.cy]]
    case 'l':
      return ['line', { x1: s.x1, y1: s.y1, x2: s.x2, y2: s.y2 }, [0, 0]]
    default:
      return ['path', { d: s.d }, [0, 0]]
  }
}

function Shape({ s, wire, M, id }) {
  if ((wire && (s.renderOnly || s.wireSkip)) || (!wire && s.wireOnly)) return null
  const [tag, geo, [cx, cy]] = geometry(s)
  const transform = s.rot ? `rotate(${s.rot} ${cx} ${cy})` : undefined
  if (wire) {
    return createElement(tag, { ...geo, transform, fill: 'none', stroke: 'currentColor', strokeWidth: s.t === 'l' || !s.m ? 0.9 : 1, strokeOpacity: s.m === 'leaf' || s.m === 'leaf2' ? 0.5 : 0.9 })
  }
  const mat = s.m ? M[s.m] : null
  const base = createElement(tag, {
    ...geo,
    transform,
    fill: mat ? mat.fill : 'none',
    stroke: s.stroke || (mat && s.t !== 'e' ? 'rgba(40,28,18,0.14)' : 'none'),
    strokeWidth: s.sw || 0.7,
    strokeLinecap: 'round',
    filter: s.shadow ? `url(#${id}-drop)` : undefined,
  })
  if (!mat?.overlays) return base
  return (
    <>
      {base}
      {mat.overlays.map((fill) => createElement(tag, { key: fill, ...geo, transform, fill, pointerEvents: 'none' }))}
    </>
  )
}

function Light({ l, id }) {
  const blend = { mixBlendMode: 'screen' }
  if (l.k === 'scallop')
    return (
      <>
        <ellipse cx={l.x} cy={150} rx={62} ry={150} fill={`url(#${id}-scallop)`} style={blend} />
        <ellipse cx={l.x} cy={25} rx={9} ry={2.2} fill="#FFFBF2" />
      </>
    )
  if (l.k === 'cove') return <rect x={l.x} y={l.y} width={l.w} height={l.h} fill={`url(#${id}-cove)`} style={blend} />
  if (l.k === 'cone')
    return <path d={`M${l.x - 5} ${l.y} H${l.x + 5} L${l.x + l.w / 2} ${l.y + l.h} H${l.x - l.w / 2} Z`} fill={`url(#${id}-cone)`} style={blend} />
  if (l.k === 'floor') return <ellipse cx={l.x} cy={l.y} rx={l.rx} ry={12} fill={`url(#${id}-glow)`} opacity="0.6" style={blend} />
  return <circle cx={l.x} cy={l.y} r={l.r} fill={`url(#${id}-glow)`} style={blend} />
}

function Dim({ x1, y1, x2, y2, label }) {
  const v = x1 === x2
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const t = 5
  return (
    <g stroke="#90E0EF" strokeOpacity=".75" strokeWidth="0.8">
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <line x1={x1 - t} y1={y1 + t} x2={x1 + t} y2={y1 - t} />
      <line x1={x2 - t} y1={y2 + t} x2={x2 + t} y2={y2 - t} />
      <text
        x={v ? mx - 8 : mx}
        y={v ? my : my - 6}
        fill="#90E0EF"
        stroke="none"
        fontSize="11"
        fontFamily="JetBrains Mono, monospace"
        textAnchor="middle"
        transform={v ? `rotate(-90 ${mx - 8} ${my})` : undefined}
      >
        {label}
      </text>
    </g>
  )
}

export default function InteriorDrawing({ scene = 'lounge', mode = 'render', className = '' }) {
  const id = useId().replace(/:/g, '')
  const data = SCENES[scene] || lounge
  const wire = mode === 'wire'
  const M = materials(id)
  const draw = (list) => list.map((s, i) => <Shape key={i} s={s} wire={wire} M={M} id={id} />)
  const planks = Array.from({ length: 27 }, (_, i) => (i - 13) * 36)

  return (
    <svg
      viewBox="0 0 800 500"
      className={`${className} ${wire ? 'text-brand-sky' : ''}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`${scene} interior elevation — ${wire ? 'CAD drawing' : 'rendered'}`}
    >
      <defs>
        <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F4EFE7" />
          <stop offset="1" stopColor="#E2D9CC" />
        </linearGradient>
        <linearGradient id={`${id}-floorG`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B38E6B" />
          <stop offset="1" stopColor="#6A4D37" />
        </linearGradient>
        <linearGradient id={`${id}-shade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id={`${id}-fluteG`}>
          <stop offset="0" stopColor="#A67C56" />
          <stop offset="0.45" stopColor="#D8B891" />
          <stop offset="1" stopColor="#9C734F" />
        </linearGradient>
        <pattern id={`${id}-flute`} width="12" height="20" patternUnits="userSpaceOnUse">
          <rect width="12" height="20" fill={`url(#${id}-fluteG)`} />
        </pattern>
        <linearGradient id={`${id}-oakG`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#BC9269" />
          <stop offset="1" stopColor="#9A7250" />
        </linearGradient>
        <pattern id={`${id}-grain`} width="160" height="48" patternUnits="userSpaceOnUse">
          <path d="M0 10 C40 6 80 14 160 9 M0 24 C50 20 110 28 160 22 M0 38 C60 34 100 42 160 36" stroke="#7C583B" strokeOpacity="0.28" fill="none" />
        </pattern>
        <linearGradient id={`${id}-boucleG`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EFE8DD" />
          <stop offset="1" stopColor="#CDC1AF" />
        </linearGradient>
        <pattern id={`${id}-dots`} width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="0.8" fill="#8F826F" fillOpacity="0.28" />
          <circle cx="4" cy="3.8" r="0.7" fill="#fff" fillOpacity="0.35" />
        </pattern>
        <linearGradient id={`${id}-trav`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#EEE5D6" />
          <stop offset="1" stopColor="#D6CAB5" />
        </linearGradient>
        <pattern id={`${id}-veins`} width="120" height="40" patternUnits="userSpaceOnUse">
          <path d="M0 8 C30 4 60 12 120 6 M0 22 C40 26 80 18 120 24 M0 34 C30 32 90 38 120 33" stroke="#B9AB93" strokeOpacity="0.45" strokeWidth="0.7" fill="none" />
        </pattern>
        <linearGradient id={`${id}-brass`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#EACB86" />
          <stop offset="0.5" stopColor="#C49A55" />
          <stop offset="1" stopColor="#9C7436" />
        </linearGradient>
        <linearGradient id={`${id}-art`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#223E4D" />
          <stop offset="0.5" stopColor="#6F9AA3" />
          <stop offset="1" stopColor="#E6D2AB" />
        </linearGradient>
        <radialGradient id={`${id}-globe`} cx="0.4" cy="0.35">
          <stop offset="0" stopColor="#FFFDF6" />
          <stop offset="1" stopColor="#F2DDB6" />
        </radialGradient>
        <pattern id={`${id}-zellige`} width="40" height="24" patternUnits="userSpaceOnUse">
          <rect width="40" height="24" fill="#F2EFE8" />
          <rect x="0.8" y="0.8" width="18.4" height="10.4" rx="1" fill="#9DB7B1" />
          <rect x="20.8" y="0.8" width="18.4" height="10.4" rx="1" fill="#8CAAA3" />
          <rect x="-9.2" y="12.8" width="18.4" height="10.4" rx="1" fill="#A9C2BC" />
          <rect x="10.8" y="12.8" width="18.4" height="10.4" rx="1" fill="#93B0AA" />
          <rect x="30.8" y="12.8" width="18.4" height="10.4" rx="1" fill="#A9C2BC" />
        </pattern>
        <radialGradient id={`${id}-scallop`} cx="0.5" cy="0" r="1" fx="0.5" fy="0">
          <stop offset="0" stopColor="#FFE7BD" stopOpacity="0.85" />
          <stop offset="0.55" stopColor="#FFE7BD" stopOpacity="0.18" />
          <stop offset="1" stopColor="#FFE7BD" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-cove`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE2AE" stopOpacity="0.75" />
          <stop offset="1" stopColor="#FFE2AE" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-cone`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE9C4" stopOpacity="0.7" />
          <stop offset="1" stopColor="#FFE9C4" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor="#FFE2B0" stopOpacity="0.8" />
          <stop offset="0.4" stopColor="#FFE2B0" stopOpacity="0.25" />
          <stop offset="1" stopColor="#FFE2B0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-ao`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#3A2A1C" stopOpacity="0.22" />
        </linearGradient>
        <radialGradient id={`${id}-vignette`} cx="0.5" cy="0.45" r="0.75">
          <stop offset="0.6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#1C140C" stopOpacity="0.28" />
        </radialGradient>
        <filter id={`${id}-blur`} x="-50%" y="-200%" width="200%" height="500%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <filter id={`${id}-drop`} x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#2A1C10" floodOpacity="0.28" />
        </filter>
        <filter id={`${id}-noise`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <pattern id={`${id}-grid`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="#3CC8FF" strokeOpacity=".08" strokeWidth=".6" />
        </pattern>
        <pattern id={`${id}-hatch`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="10" stroke="#3CC8FF" strokeOpacity="0.25" strokeWidth="1" />
        </pattern>
      </defs>

      {wire ? (
        <>
          <rect width="800" height="500" fill="#0B1526" />
          <rect width="800" height="500" fill={`url(#${id}-grid)`} />
          <rect y={FLOOR} width="800" height="80" fill={`url(#${id}-hatch)`} />
          <line x1="0" y1={FLOOR} x2="800" y2={FLOOR} stroke="currentColor" strokeWidth="1.6" />
          <line x1="0" y1="24" x2="800" y2="24" stroke="currentColor" strokeWidth="1.2" />
          {data.lights
            .filter((l) => l.k === 'scallop')
            .map((l) => (
              <g key={l.x} stroke="currentColor" strokeWidth="0.8" fill="none">
                <circle cx={l.x} cy="34" r="5" />
                <path d={`M${l.x - 3.5} 30.5 l7 7 m0 -7 l-7 7`} />
              </g>
            ))}
          {draw(data.back)}
          {draw(data.floor)}
          {draw(data.front)}
          {data.dims.map((d, i) => (
            <Dim key={i} {...d} />
          ))}
          {data.tags.map((tag) => {
            const w = tag.label.length * 6.3 + 14
            return (
              <g key={tag.label} fontFamily="JetBrains Mono, monospace" fontSize="10">
                <line x1={tag.x} y1={tag.y} x2={tag.to[0]} y2={tag.to[1]} stroke="currentColor" strokeOpacity=".7" strokeWidth=".8" />
                <circle cx={tag.to[0]} cy={tag.to[1]} r="2.6" fill="currentColor" />
                <rect x={tag.x - w / 2} y={tag.y - 9} width={w} height="18" rx="3" fill="#0B1526" stroke="currentColor" strokeOpacity=".7" />
                <text x={tag.x} y={tag.y + 3.5} textAnchor="middle" fill="#90E0EF">
                  {tag.label}
                </text>
              </g>
            )
          })}
          <g fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="1">
            <rect x="572" y="452" width="214" height="38" rx="3" fill="#0B1526" stroke="currentColor" strokeOpacity=".6" />
            <line x1="572" y1="471" x2="786" y2="471" stroke="currentColor" strokeOpacity=".4" />
            <text x="582" y="465" fill="#90E0EF">{data.title}</text>
            <text x="582" y="484" fill="#90E0EF" fillOpacity=".7">
              {data.sheet} · SCALE 1:50 · REV A
            </text>
          </g>
        </>
      ) : (
        <>
          {/* shell */}
          <rect width="800" height={FLOOR} fill={`url(#${id}-wall)`} />
          {draw(data.back)}
          {data.lights.filter((l) => l.k !== 'floor').map((l, i) => (
            <Light key={i} l={l} id={id} />
          ))}
          <rect y="0" width="800" height="24" fill="#F6F3EE" />
          <rect y="24" width="800" height="16" fill={`url(#${id}-ao)`} transform="rotate(180 400 32)" />
          <rect y={FLOOR - 26} width="800" height="26" fill={`url(#${id}-ao)`} />
          <rect y={FLOOR - 9} width="800" height="9" fill="#EFEBE4" />
          {/* floor: boards receding toward the viewer */}
          <rect y={FLOOR} width="800" height="80" fill={`url(#${id}-floorG)`} />
          {planks.map((dx) => (
            <line key={dx} x1={400 + dx} y1={FLOOR} x2={400 + dx * 1.9} y2="500" stroke="#4A3322" strokeOpacity="0.28" strokeWidth="0.8" />
          ))}
          {[436, 458, 486].map((y, i) => (
            <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="#4A3322" strokeOpacity={0.1 + i * 0.04} strokeDasharray={`${60 + i * 30} ${90 + i * 40}`} />
          ))}
          {data.lights.filter((l) => l.k === 'floor').map((l, i) => (
            <Light key={i} l={l} id={id} />
          ))}
          {draw(data.floor)}
          {data.shadows.map(([cx, cy, rx, ry], i) => (
            <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill="#2A1C10" fillOpacity="0.4" filter={`url(#${id}-blur)`} />
          ))}
          {draw(data.front)}
          {data.lights.filter((l) => l.k === 'glow').map((l, i) => (
            <Light key={i} l={{ ...l, r: l.r * 0.6 }} id={id} />
          ))}
          {/* finish: paper grain + vignette */}
          <rect width="800" height="500" filter={`url(#${id}-noise)`} opacity="0.06" style={{ mixBlendMode: 'multiply' }} />
          <rect width="800" height="500" fill={`url(#${id}-vignette)`} />
        </>
      )}
    </svg>
  )
}

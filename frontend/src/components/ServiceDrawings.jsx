import { motion } from 'framer-motion'

// Self-drawing technical illustrations, one per service (viewBox 400 × 300).
// Strokes use currentColor; `L` animates pathLength, `F` fades a filled shape, `T` fades a label.

const EASE = [0.65, 0, 0.35, 1]

function L({ d, i = 0, w = 1.4, dash, o = 1 }) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth={w}
      strokeOpacity={o}
      strokeDasharray={dash}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ pathLength: { duration: 1.1, delay: i * 0.06, ease: EASE }, opacity: { duration: 0.2, delay: i * 0.06 } }}
    />
  )
}

function F({ children, i = 0 }) {
  return (
    <motion.g initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.5 + i * 0.07, ease: EASE }} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
      {children}
    </motion.g>
  )
}

function T({ x, y, children, i = 0, anchor = 'middle', size = 9, rotate }) {
  return (
    <motion.text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={size}
      fontFamily="JetBrains Mono, monospace"
      letterSpacing="1"
      fill="currentColor"
      fillOpacity="0.75"
      transform={rotate ? `rotate(${rotate} ${x} ${y})` : undefined}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.9 + i * 0.05 }}
    >
      {children}
    </motion.text>
  )
}

// dimension line with oblique ticks
function Dim({ x1, y1, x2, y2, label, i = 0 }) {
  const v = x1 === x2
  const t = 4
  return (
    <>
      <L d={`M${x1} ${y1} L${x2} ${y2} M${x1 - t} ${y1 + t} L${x1 + t} ${y1 - t} M${x2 - t} ${y2 + t} L${x2 + t} ${y2 - t}`} w={0.8} o={0.7} i={i} />
      <T x={v ? x1 - 7 : (x1 + x2) / 2} y={v ? (y1 + y2) / 2 : y1 - 5} rotate={v ? -90 : undefined} i={i}>
        {label}
      </T>
    </>
  )
}

// ── 01 BIM: isometric massing model ─────────────────────────────────────────
const S = 13
const iso = (x, y, z) => [200 + (x - y) * S * 0.866, 200 + (x + y) * S * 0.5 - z * S]
const poly = (pts, close = true) => `M${pts.map((p) => iso(...p).map((n) => n.toFixed(1)).join(' ')).join(' L')}${close ? ' Z' : ''}`
function box(x, y, z, w, d, h) {
  const b = [[x, y, z], [x + w, y, z], [x + w, y + d, z], [x, y + d, z]]
  const t = b.map(([a, c, e]) => [a, c, e + h])
  return [poly(b), poly(t), ...b.map((p, k) => poly([p, t[k]], false))]
}
function Bim() {
  const tower = box(-2, -2, 1.4, 4, 4, 9)
  const floors = Array.from({ length: 8 }, (_, k) => poly([[-2, -2, 2.4 + k], [2, -2, 2.4 + k], [2, 2, 2.4 + k], [-2, 2, 2.4 + k]]))
  const parts = [...box(-5.5, -4.5, 0, 11, 9, 1.4), ...box(-5.2, -2.8, 1.4, 2.6, 5, 4.4), ...box(2.6, -2.8, 1.4, 2.6, 5, 3), ...tower, ...box(-1.3, -1.3, 10.4, 2.6, 2.6, 1)]
  const ground = Array.from({ length: 7 }, (_, k) => poly([[-8 + k * 2.6, -7, 0], [-8 + k * 2.6, 7, 0]], false))
  return (
    <>
      {ground.map((d, k) => (
        <L key={`g${k}`} d={d} w={0.6} o={0.25} i={k * 0.3} />
      ))}
      {parts.map((d, k) => (
        <L key={k} d={d} i={k * 0.35} />
      ))}
      {floors.map((d, k) => (
        <L key={`f${k}`} d={d} w={0.8} o={0.55} i={8 + k * 0.5} />
      ))}
      <F i={2}>
        <path d={poly([[-2, -2, 10.4], [2, -2, 10.4], [2, 2, 10.4], [-2, 2, 10.4]])} fill="currentColor" fillOpacity="0.18" />
      </F>
      <L d="M258 70 L300 44 H360" w={0.8} i={14} />
      <T x={330} y={38} i={2}>
        LOD 300
      </T>
      <T x={330} y={60} i={3} size={7}>
        REVIT · ID + ARCH
      </T>
    </>
  )
}

// ── 02 CAD: floor plan ──────────────────────────────────────────────────────
function Plan() {
  return (
    <>
      <L d="M40 40 H360 V240 H40 Z" w={2.2} />
      <L d="M47 47 H353 V233 H47 Z" w={0.8} o={0.6} i={1} />
      <L d="M195 47 V112 M195 152 V233" w={2} i={3} />
      <L d="M47 140 H118 M152 140 H195" w={2} i={4} />
      <L d="M270 47 V120 M270 150 V233 M270 150 H353" w={2} i={5} />
      <L d="M195 112 H235 M235 112 A40 40 0 0 1 195 152" w={0.9} o={0.7} i={6} />
      <L d="M118 140 V110 M118 110 A30 30 0 0 1 148 140" w={0.9} o={0.7} i={7} />
      <L d="M62 160 H132 V222 H62 Z M62 172 H132 M72 160 V172 M122 160 V172" w={1} i={8} />
      <L d="M212 185 H258 V222 H212 Z M212 185 V195 H258" w={1} i={9} />
      <L d="M88 70 m-18 0 a18 18 0 1 0 36 0 a18 18 0 1 0 -36 0" w={1} i={10} />
      <L d="M290 170 H340 V222 H290 Z M300 180 H330 V212 H300 Z" w={1} i={11} />
      <Dim x1={40} y1={24} x2={360} y2={24} label="12 000" i={12} />
      <Dim x1={24} y1={40} x2={24} y2={240} label="7 500" i={13} />
      <L d="M40 240 V262 M195 240 V262 M360 240 V262" w={0.7} dash="3 3" o={0.5} i={14} />
      {[
        [40, 'A'],
        [195, 'B'],
        [360, 'C'],
      ].map(([x, l], k) => (
        <g key={l}>
          <L d={`M${x} 274 m-9 0 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0`} w={0.9} i={15 + k} />
          <T x={x} y={277} i={k}>
            {l}
          </T>
        </g>
      ))}
      <T x={120} y={100} i={1}>LOUNGE</T>
      <T x={235} y={80} i={2}>KITCHEN</T>
      <T x={312} y={100} i={3}>BATH</T>
      <T x={98} y={210} i={4}>BED 01</T>
    </>
  )
}

// ── 03 Shop drawings: joinery elevation ─────────────────────────────────────
function Joinery() {
  return (
    <>
      <L d="M52 52 H308 V62 H52 Z" w={1.4} />
      <L d="M60 62 H300 V250 H60 Z" w={1.8} i={1} />
      <L d="M140 62 V250 M220 62 V250" w={1.2} i={2} />
      <L d="M60 118 H140 M60 178 H140" w={1} i={3} />
      <L d="M140 62 L220 156 L140 250 M300 62 L220 156 L300 250" w={0.7} dash="4 4" o={0.6} i={4} />
      <L d="M212 138 V172 M228 138 V172" w={2} i={5} />
      <L d="M60 250 V262 H300 V250" w={1.2} i={6} />
      <L d="M72 262 L80 254 M90 262 L98 254 M108 262 L116 254 M126 262 L134 254" w={0.6} o={0.5} i={7} />
      <L d="M78 100 H122 M78 160 H122 M78 230 H122" w={0.6} o={0.4} i={8} />
      <Dim x1={60} y1={284} x2={300} y2={284} label="2 400" i={9} />
      <Dim x1={326} y1={52} x2={326} y2={262} label="2 100" i={10} />
      <L d="M280 228 m-22 0 a22 22 0 1 0 44 0 a22 22 0 1 0 -44 0" w={0.9} i={11} />
      <L d="M298 214 L350 170" w={0.8} i={12} />
      <L d="M362 162 m-12 0 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0 M350 162 H374" w={0.9} i={13} />
      <T x={362} y={159} i={1} size={7}>D1</T>
      <T x={362} y={171} i={2} size={7}>J4</T>
      <T x={100} y={45} i={3}>JN-02 · TALL UNIT</T>
    </>
  )
}

// ── 04 Interior design: mood board ──────────────────────────────────────────
function Mood() {
  const chips = ['#0D182A', '#3CC8FF', '#C8A46A', '#E9E4DC', '#5B7552']
  return (
    <>
      <L d="M30 30 H370 V270 H30 Z" w={1} o={0.5} />
      <F i={0}>
        <rect x="50" y="50" width="100" height="120" rx="4" fill="#B48A63" />
        <path d="M50 70 Q100 62 150 72 M50 96 Q100 88 150 98 M50 122 Q100 116 150 126 M50 148 Q100 140 150 150" stroke="#8A6444" strokeWidth="1.2" fill="none" />
      </F>
      <F i={1}>
        <rect x="162" y="50" width="70" height="70" rx="4" fill="#D9D3C9" />
        <path d="M170 64 L200 80 M190 100 L226 90 M168 108 L186 116" stroke="#b9b1a4" strokeWidth="1" fill="none" />
      </F>
      <F i={2}>
        <rect x="162" y="128" width="70" height="42" rx="4" fill="#4C5F68" />
      </F>
      {chips.map((c, k) => (
        <F key={c} i={3 + k}>
          <circle cx={62 + k * 34} cy={205} r="13" fill={c} stroke="currentColor" strokeOpacity="0.3" />
        </F>
      ))}
      <L d="M250 196 H350 V232 H250 Z M258 178 H342 V196 M250 206 H240 V232 H250 M350 206 H360 V232 H350 M256 232 V244 M344 232 V244" w={1.3} i={2} />
      <L d="M300 30 V70 M280 94 L320 94 L310 70 L290 70 Z" w={1.2} i={4} />
      <L d="M300 100 m-18 0 a18 18 0 1 0 36 0" w={0.6} dash="2 3" o={0.6} i={6} />
      <T x={100} y={186} i={1}>OAK</T>
      <T x={197} y={44} i={2}>TRAVERTINE</T>
      <T x={197} y={184} i={3}>BOUCLÉ</T>
      <T x={300} y={262} i={4}>FF-01 · SOFA</T>
      <T x={130} y={250} i={5}>PALETTE A</T>
    </>
  )
}

// ── 05 Project delivery: programme chart ────────────────────────────────────
function Programme() {
  const rows = [
    ['CD', 70, 60],
    ['SD', 110, 70],
    ['DD', 160, 80],
    ['TND', 225, 45],
    ['IFC', 255, 55],
    ['SITE', 290, 70],
  ]
  return (
    <>
      <L d="M60 36 V250 H370" w={1.4} />
      {[110, 160, 210, 260, 310, 360].map((x, k) => (
        <L key={x} d={`M${x} 40 V250`} w={0.6} dash="2 4" o={0.35} i={1 + k * 0.4} />
      ))}
      {rows.map(([label, x, w], k) => (
        <g key={label}>
          <T x={52} y={68 + k * 32} anchor="end" i={k}>
            {label}
          </T>
          <motion.rect
            x={x}
            y={56 + k * 32}
            width={w}
            height={16}
            rx={3}
            fill="currentColor"
            fillOpacity="0.2"
            stroke="currentColor"
            strokeWidth="1.2"
            style={{ transformBox: 'fill-box', transformOrigin: 'left center' }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.4 + k * 0.15, ease: EASE }}
          />
          <F i={4 + k}>
            <path d={`M${x + w + 8} ${64 + k * 32} l6 -6 l6 6 l-6 6 z`} fill="currentColor" />
          </F>
        </g>
      ))}
      <L d="M240 30 V256" w={1.2} dash="5 4" i={10} />
      <T x={240} y={24} i={6}>TODAY</T>
      <L d="M84 274 l5 5 l10 -10 M154 274 l5 5 l10 -10 M224 274 l5 5 l10 -10" w={1.6} i={12} />
      <T x={130} y={292} i={7} size={7}>QA · SNAGGING · HANDOVER</T>
    </>
  )
}

// ── 06 FF&E: lounge chair + fabric + rug ────────────────────────────────────
function Chair() {
  return (
    <>
      <L d="M70 252 H330 L362 286 H38 Z" w={1} o={0.6} />
      <L d="M48 286 v6 M64 286 v6 M80 286 v6 M320 286 v6 M336 286 v6 M352 286 v6" w={0.8} o={0.5} i={1} />
      <L d="M136 84 Q200 52 264 84 L258 170 H142 Z" w={1.6} i={2} />
      <L d="M124 170 H276 V204 H124 Z" w={1.6} i={3} />
      <L d="M112 122 Q100 128 104 204 H128 V136 Z M288 122 Q300 128 296 204 H272 V136 Z" w={1.4} i={4} />
      <L d="M132 204 L126 246 M268 204 L274 246 M160 204 L158 236 M240 204 L242 236" w={1.4} i={5} />
      <L d="M200 70 V168 M150 110 Q200 100 250 110" w={0.7} o={0.5} i={6} />
      {['#4C5F68', '#9A8472', '#C8A46A'].map((c, k) => (
        <F key={c} i={k}>
          <rect x={300 + (k % 2) * 34} y={40 + Math.floor(k / 2) * 34} width="28" height="28" rx="3" fill={c} />
        </F>
      ))}
      <L d="M300 40 L328 68 M306 40 L328 62 M300 46 L322 68" w={0.6} o={0.4} i={8} />
      <T x={200} y={40} i={1}>FF-07 · LOUNGE CHAIR</T>
      <T x={331} y={120} i={2} size={7}>FABRIC SPEC</T>
    </>
  )
}

const DRAWINGS = [Bim, Plan, Joinery, Mood, Programme, Chair]

export default function ServiceDrawing({ index, className = '' }) {
  const Drawing = DRAWINGS[index] || Bim
  return (
    <svg viewBox="0 0 400 300" className={className} role="img" aria-hidden="true">
      <Drawing />
    </svg>
  )
}

import { useId } from 'react'
import { motion } from 'framer-motion'

// Vector redraw of the DraftCore tower mark (100 × 80 units), as path data so it can be
// filled, stroked (drawn) or animated piece by piece.
const poly = (pts) => `M${pts.replace(/ /g, ' L')} Z`
const LEFT = '0,34.6 8.2,41 8.2,54.2 14,49.9 14,27.1 27.5,17.6 27.5,50.2 18.8,56.9 18.8,80 0,80'
const RIGHT = LEFT.split(' ')
  .map((pt) => {
    const [x, y] = pt.split(',').map(Number)
    return `${+(100 - x).toFixed(1)},${y}`
  })
  .join(' ')
export const STRIPES = [12.6, 20.5, 28.4, 36.3, 44.3, 52.2]
const rect = (y, h = 5.3) => `M32.5 ${y} H67.5 V${+(y + h).toFixed(1)} H32.5 Z`

export const LOGO = {
  cap: poly('40.7,0 59.3,0 60.5,4 39.5,4'),
  header: rect(4, 6),
  stripes: STRIPES.map((y) => rect(y)),
  base: 'M30.7 59.9 H69.3 L74.6 63.9 V80 H25.4 V63.9 Z M32.5 65.2 V67.9 H67.5 V65.2 Z M32.5 72.7 V75.4 H67.5 V72.7 Z',
  left: poly(LEFT),
  right: poly(RIGHT),
}
export const LOGO_PATHS = [LOGO.base, ...[...LOGO.stripes].reverse(), LOGO.header, LOGO.cap, LOGO.left, LOGO.right]

export function LogoGradient({ id }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#4FD2FF" />
      <stop offset="1" stopColor="#0A5CFF" />
    </linearGradient>
  )
}

const wave = (i) => ({
  rest: { scaleX: 1 },
  hover: { scaleX: [1, 0.45, 1], transition: { duration: 0.6, delay: i * 0.05, ease: [0.65, 0, 0.35, 1] } },
})

// `interactive`: stripes ripple when an ancestor with whileHover="hover" is hovered.
export function LogoMark({ className = 'h-9 w-auto', interactive = false }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 100 80" className={className} aria-hidden="true">
      <defs>
        <LogoGradient id={`${id}-g`} />
      </defs>
      <g fill={`url(#${id}-g)`}>
        <path d={LOGO.cap} />
        <path d={LOGO.header} />
        {LOGO.stripes.map((d, i) =>
          interactive ? (
            <motion.path key={d} d={d} variants={wave(i)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
          ) : (
            <path key={d} d={d} />
          ),
        )}
        <path d={LOGO.base} fillRule="evenodd" />
        <motion.path d={LOGO.left} variants={interactive ? { rest: { x: 0 }, hover: { x: -3 } } : undefined} />
        <motion.path d={LOGO.right} variants={interactive ? { rest: { x: 0 }, hover: { x: 3 } } : undefined} />
      </g>
    </svg>
  )
}

export default function Logo({ compact = false, interactive = false }) {
  return (
    <span className="flex items-center gap-3">
      <LogoMark interactive={interactive} className="h-9 w-auto drop-shadow-[0_0_12px_rgba(60,200,255,0.35)]" />
      <span
        className={`overflow-hidden leading-none transition-[max-width,opacity] duration-500 ${compact ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'}`}
      >
        <span className="block whitespace-nowrap font-display text-[19px] font-bold tracking-[0.08em] text-ink">DRAFTCORE</span>
        <span className="mt-1 block whitespace-nowrap font-mono text-[8.5px] tracking-[0.4em] text-accent/80">SOLUTIONS PVT LTD</span>
      </span>
    </span>
  )
}

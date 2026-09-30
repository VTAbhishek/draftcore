import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Hand, Plus } from 'lucide-react'
import InteriorDrawing, { SCENES } from './InteriorDrawing.jsx'

const MODES = [
  { id: 'cad', label: 'CAD', pos: 100 },
  { id: 'split', label: 'Compare', pos: 50 },
  { id: 'render', label: 'Render', pos: 0 },
]
const EASE = [0.76, 0, 0.24, 1]

function Hotspot({ h, open, onToggle }) {
  const left = (h.x / 800) * 100
  const top = (h.y / 500) * 100
  const flip = left > 62
  return (
    <div className="absolute z-20" data-cursor="" style={{ left: `${left}%`, top: `${top}%` }}>
      <button
        type="button"
        onClick={onToggle}
        onMouseEnter={() => onToggle(true)}
        aria-label={h.title}
        aria-expanded={open}
        className="relative -ml-3.5 -mt-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#0D182A] shadow-[0_4px_14px_rgba(0,0,0,0.25)] backdrop-blur transition-transform hover:scale-110"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-white/60" aria-hidden="true" />
        <Plus className={`relative h-3.5 w-3.5 transition-transform duration-300 ${open ? 'rotate-45' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-5 w-56 rounded-xl border border-white/40 bg-white/90 p-3.5 text-left shadow-[0_18px_40px_-12px_rgba(20,30,50,0.45)] backdrop-blur-md ${
              flip ? 'right-0' : 'left-0'
            }`}
          >
            <p className="font-display text-sm font-semibold text-[#0A1628]">{h.title}</p>
            <p className="mt-1 font-mono text-[10px] uppercase leading-relaxed tracking-wider text-[#4E5E76]">{h.spec}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function BeforeAfter({ scene = 'lounge', autoSweep = true, controls = true, hotspots = true, className = '' }) {
  const ref = useRef(null)
  const touched = useRef(false)
  const anim = useRef(null)
  const [pos, setPos] = useState(50)
  const [interacted, setInteracted] = useState(false)
  const [openSpot, setOpenSpot] = useState(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduced = useReducedMotion()
  const data = SCENES[scene]

  const glide = (to, duration = 0.9) => {
    anim.current?.stop()
    anim.current = animate(pos, to, { duration, ease: EASE, onUpdate: setPos })
  }

  // one demonstrative sweep when first seen, until the visitor takes over
  useEffect(() => {
    if (!inView || !autoSweep || reduced) return undefined
    anim.current = animate(50, [50, 16, 84, 50], {
      duration: 4,
      delay: 0.4,
      ease: 'easeInOut',
      onUpdate: (v) => !touched.current && setPos(v),
    })
    return () => anim.current?.stop()
  }, [inView, autoSweep, reduced])

  const takeOver = () => {
    touched.current = true
    setInteracted(true)
    anim.current?.stop()
  }

  const mode = pos >= 95 ? 'cad' : pos <= 5 ? 'render' : 'split'

  return (
    <div className={className}>
      <div
        ref={ref}
        data-cursor="Drag"
        className="group relative aspect-[8/5] w-full select-none overflow-hidden rounded-2xl border border-line/10 bg-[#0B1526]"
        onMouseLeave={() => setOpenSpot(null)}
      >
        <InteriorDrawing scene={scene} mode="render" className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <InteriorDrawing scene={scene} mode="wire" className="absolute inset-0 h-full w-full" />
        </div>

        {/* side labels fade out when their side collapses */}
        <span
          className="pointer-events-none absolute left-4 top-4 z-10 rounded-full border border-brand-sky/40 bg-[#0B1526]/85 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-brand-sky backdrop-blur transition-opacity duration-300"
          style={{ opacity: pos > 14 ? 1 : 0 }}
        >
          CAD / BIM
        </span>
        <span
          className="pointer-events-none absolute right-4 top-4 z-10 rounded-full border border-white/40 bg-white/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#0A1628] backdrop-blur transition-opacity duration-300"
          style={{ opacity: pos < 86 ? 1 : 0 }}
        >
          Rendered
        </span>

        {/* divider + handle (handle is clamped so it never leaves the frame) */}
        <div className="pointer-events-none absolute inset-y-0 z-10 w-[2px] -translate-x-1/2 bg-white/90 shadow-[0_0_18px_rgba(60,200,255,0.9)]" style={{ left: `${pos}%` }} />
        <div
          className="pointer-events-none absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `clamp(26px, ${pos}%, calc(100% - 26px))` }}
        >
          {!interacted && <span className="absolute inset-0 animate-ping rounded-full bg-brand-sky/40" aria-hidden="true" />}
          <span className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-[#0B1526]/90 text-white shadow-[0_8px_30px_-6px_rgba(60,200,255,0.8)] backdrop-blur transition-transform duration-300 group-hover:scale-110">
            <ChevronLeft className="-mr-1 h-4 w-4" />
            <ChevronRight className="-ml-1 h-4 w-4" />
          </span>
        </div>

        {/* native range input: pointer, touch and keyboard control */}
        <input
          type="range"
          min="0"
          max="100"
          step="0.5"
          value={pos}
          onPointerDown={takeOver}
          onKeyDown={takeOver}
          onChange={(e) => {
            takeOver()
            setPos(Number(e.target.value))
          }}
          aria-label="Compare CAD drawing with rendered interior"
          className="absolute inset-0 z-[5] h-full w-full cursor-ew-resize opacity-0"
        />

        {/* material hotspots on the rendered side */}
        {hotspots &&
          data.hotspots
            .filter((h) => (h.x / 800) * 100 > pos + 3)
            .map((h) => (
              <Hotspot
                key={h.title}
                h={h}
                open={openSpot === h.title}
                onToggle={(force) => setOpenSpot((cur) => (force === true ? h.title : cur === h.title ? null : h.title))}
              />
            ))}

        <AnimatePresence>
          {!interacted && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ delay: 1 }}
              className="pointer-events-none absolute inset-x-0 bottom-4 z-10 mx-auto flex w-max items-center gap-2 rounded-full bg-[#0B1526]/80 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur"
            >
              <Hand className="h-3.5 w-3.5 text-brand-sky" /> Drag to compare
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {controls && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex rounded-full border border-line/10 bg-surface p-1 shadow-sm" role="group" aria-label="View mode">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={mode === m.id}
                onClick={() => {
                  takeOver()
                  glide(m.pos)
                }}
                className={`relative rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                  mode === m.id ? 'text-white' : 'text-muted hover:text-ink'
                }`}
              >
                {mode === m.id && (
                  <motion.span layoutId={`ba-mode-${scene}`} className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-blue to-brand-electric" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />
                )}
                <span className="relative">{m.label}</span>
              </button>
            ))}
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
            {data.title} · {data.sheet}
          </span>
        </div>
      )}
    </div>
  )
}

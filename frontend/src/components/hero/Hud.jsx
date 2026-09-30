import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export const PHASES = [
  { code: '01', name: 'Blueprint', detail: 'Wireframe · BIM mesh' },
  { code: '02', name: 'Section', detail: 'CAD section cut' },
  { code: '03', name: 'Render', detail: 'LOD 300 · lit interior' },
]

function Corner({ className }) {
  return (
    <span className={`absolute h-5 w-5 border-accent/50 ${className}`} aria-hidden="true" />
  )
}

// Blueprint HUD layered over the 3D hero: CAD crosshair, live coordinates, phase readout.
export default function Hud({ phase, showPhases = true }) {
  const root = useRef(null)
  const vLine = useRef(null)
  const hLine = useRef(null)
  const reticle = useRef(null)
  const xOut = useRef(null)
  const yOut = useRef(null)

  useEffect(() => {
    let raf = 0
    let cx = 0
    let cy = 0
    let inside = false
    const paint = () => {
      raf = 0
      const show = inside ? '1' : '0'
      if (vLine.current) {
        vLine.current.style.transform = `translate3d(${cx}px,0,0)`
        vLine.current.style.opacity = show
      }
      if (hLine.current) {
        hLine.current.style.transform = `translate3d(0,${cy}px,0)`
        hLine.current.style.opacity = show
      }
      if (reticle.current) {
        reticle.current.style.transform = `translate3d(${cx}px,${cy}px,0)`
        reticle.current.style.opacity = show
      }
      if (xOut.current) xOut.current.textContent = (cx * 12.5).toFixed(2).padStart(9, '0')
      if (yOut.current) yOut.current.textContent = (cy * 12.5).toFixed(2).padStart(9, '0')
    }
    const onMove = (e) => {
      if (!root.current) return
      const r = root.current.getBoundingClientRect()
      cx = e.clientX - r.left
      cy = e.clientY - r.top
      inside = cy >= 0 && cy <= r.height
      if (!raf) raf = requestAnimationFrame(paint)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={root} className="pointer-events-none absolute inset-0 overflow-hidden font-mono text-[10px] uppercase tracking-[0.2em] text-accent-soft/70">
      {/* CAD crosshair — pointer devices only */}
      <div className="hidden lg:block [@media(hover:none)]:hidden">
        <div ref={vLine} className="absolute inset-y-0 left-0 w-px bg-accent/15 opacity-0 transition-opacity duration-300" />
        <div ref={hLine} className="absolute inset-x-0 top-0 h-px bg-accent/15 opacity-0 transition-opacity duration-300" />
        <div ref={reticle} className="absolute left-0 top-0 opacity-0 transition-opacity duration-300">
          <div className="-ml-3 -mt-3 h-6 w-6 rounded-full border border-accent/70" />
          <div className="ml-4 mt-1 whitespace-nowrap text-accent">
            X <span ref={xOut}>000000.00</span>
            <br />Y <span ref={yOut}>000000.00</span>
          </div>
        </div>
      </div>

      {/* frame corners */}
      <div className="absolute inset-x-4 bottom-6 top-20 sm:inset-x-6 lg:bottom-8 lg:top-28">
        <Corner className="left-0 top-0 border-l border-t" />
        <Corner className="right-0 top-0 border-r border-t" />
        <Corner className="bottom-0 left-0 border-b border-l" />
        <Corner className="bottom-0 right-0 border-b border-r" />
      </div>

      {/* top-right readout */}
      <div className="absolute right-6 top-32 hidden text-right lg:block xl:right-10">
        <div className="inline-flex items-center gap-2 rounded border border-accent/30 bg-canvas/60 px-2.5 py-1 text-accent backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> LOD 300
        </div>
        <div className="mt-3 leading-5 text-faint">
          <div>DC-SCAN / MODEL 2026</div>
          <div>REVIT · ID + ARCH</div>
        </div>
      </div>

      {/* phase readout */}
      {showPhases && (
      <div className="absolute bottom-24 right-6 hidden w-[22rem] whitespace-nowrap rounded-xl border border-line/10 bg-canvas/70 p-4 backdrop-blur-md lg:block xl:right-10">
        <div className="mb-3 flex items-center justify-between text-faint">
          <span>Sequence</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={phase}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-accent"
            >
              {PHASES[phase].detail}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {PHASES.map((p, i) => (
            <div key={p.code}>
              <div className="h-[3px] overflow-hidden rounded bg-line/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-brand-ice to-brand-sky"
                  initial={false}
                  animate={{ width: i <= phase ? '100%' : '0%' }}
                  transition={{ duration: i === phase ? 0.8 : 0.3 }}
                />
              </div>
              <div className={`mt-2 transition-colors ${i === phase ? 'text-ink' : 'text-faint'}`}>
                {p.code} {p.name}
              </div>
            </div>
          ))}
        </div>
      </div>
      )}
    </div>
  )
}

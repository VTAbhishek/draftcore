import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LOGO_PATHS, LogoGradient } from './Logo.jsx'
import { markIntroDone } from '../lib/intro.js'
import { lockScroll } from '../lib/smoothScroll.js'

const EASE = [0.76, 0, 0.24, 1]
const SEEN_KEY = 'dc-intro-seen'
const LOG = [
  [0, 'Initialising drawing set'],
  [18, 'Loading BIM families · LOD 300'],
  [40, 'Coordinating CD / SD / DD sheets'],
  [62, 'Rendering interiors'],
  [84, 'Issued for construction'],
]
const TICKS = Array.from({ length: 60 }, (_, i) => i)

function seenBefore() {
  try {
    return !!sessionStorage.getItem(SEEN_KEY)
  } catch {
    return false
  }
}

// Page loader: progress tracks real loading (window load + fonts), eased and never shorter
// than a minimum so the sequence reads. The mark is drafted as linework, then filled.
export default function Preloader() {
  const [show, setShow] = useState(true)
  const [progress, setProgress] = useState(0)
  const minMs = useRef(seenBefore() ? 900 : 2000)

  useEffect(() => {
    lockScroll(true)
    let loaded = document.readyState === 'complete'
    let fonts = !document.fonts
    const onLoad = () => (loaded = true)
    window.addEventListener('load', onLoad)
    document.fonts?.ready.then(() => (fonts = true))

    const t0 = performance.now()
    let value = 0
    let raf = 0
    const tick = (now) => {
      const elapsed = now - t0
      const timeP = Math.min(1, elapsed / minMs.current)
      const ready = (loaded && fonts) || elapsed > 7000 // never block the site
      const target = Math.min(ready ? 100 : 90, (1 - Math.pow(1 - timeP, 3)) * 100)
      value += (target - value) * 0.14
      if (ready && timeP >= 1 && value > 99.4) {
        setProgress(100)
        try {
          sessionStorage.setItem(SEEN_KEY, '1')
        } catch {
          /* storage unavailable */
        }
        setTimeout(() => {
          setShow(false)
          markIntroDone()
          lockScroll(false)
        }, 250)
        return
      }
      setProgress(value)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('load', onLoad)
    }
  }, [])

  const p = Math.round(progress)
  const fill = Math.min(1, Math.max(0, (progress - 50) / 40))
  const logIndex = LOG.reduce((acc, [at], i) => (progress >= at ? i : acc), 0)
  const R = 104
  const C = 2 * Math.PI * R

  return (
    <AnimatePresence>
      {show && (
        <motion.div key="loader" className="fixed inset-0 z-[100]" aria-live="polite" aria-label={`Loading ${p}%`} exit={{ pointerEvents: 'none' }}>
          {/* split curtain */}
          {['top-0 origin-top', 'bottom-0 origin-bottom'].map((pos, i) => (
            <motion.div
              key={pos}
              className={`theme-dark absolute inset-x-0 h-1/2 overflow-hidden bg-canvas ${pos}`}
              exit={{ y: i === 0 ? '-100%' : '100%' }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
            >
              <div className={`bg-blueprint absolute inset-x-0 h-[200%] ${i === 0 ? 'top-0' : 'bottom-0'}`} />
            </motion.div>
          ))}

          {/* content layer */}
          <motion.div
            className="theme-dark absolute inset-0 flex flex-col items-center justify-center"
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.35, ease: 'easeIn' }}
          >
            {/* crosshair through centre */}
            <motion.div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-brand-sky/50 to-transparent" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, ease: EASE }} />
            <motion.div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-brand-sky/30 to-transparent" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 1.2, ease: EASE, delay: 0.1 }} />

            <div className="relative h-[260px] w-[260px]">
              {/* compass ring */}
              <motion.svg viewBox="0 0 260 260" className="absolute inset-0 text-brand-sky" animate={{ rotate: 360 }} transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}>
                {TICKS.map((i) => {
                  const major = i % 5 === 0
                  const a = (i / 60) * Math.PI * 2
                  const r1 = major ? 118 : 121
                  return (
                    <line
                      key={i}
                      x1={130 + Math.cos(a) * r1}
                      y1={130 + Math.sin(a) * r1}
                      x2={130 + Math.cos(a) * 126}
                      y2={130 + Math.sin(a) * 126}
                      stroke="currentColor"
                      strokeOpacity={major ? 0.7 : 0.3}
                      strokeWidth={major ? 1.4 : 1}
                    />
                  )
                })}
              </motion.svg>
              <svg viewBox="0 0 260 260" className="absolute inset-0 -rotate-90">
                <defs>
                  <linearGradient id="pl-arc" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#90E0EF" />
                    <stop offset="1" stopColor="#1E6BFF" />
                  </linearGradient>
                </defs>
                <circle cx="130" cy="130" r={R} fill="none" stroke="rgba(144,224,239,0.12)" strokeWidth="2" strokeDasharray="2 6" />
                <circle
                  cx="130"
                  cy="130"
                  r={R}
                  fill="none"
                  stroke="url(#pl-arc)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  strokeDashoffset={C * (1 - progress / 100)}
                  style={{ filter: 'drop-shadow(0 0 6px rgba(60,200,255,0.7))' }}
                />
              </svg>

              {/* the mark: drafted, then filled */}
              <svg viewBox="-6 -6 112 92" className="absolute left-1/2 top-1/2 h-[118px] w-auto -translate-x-1/2 -translate-y-1/2">
                <defs>
                  <LogoGradient id="pl-g" />
                </defs>
                {LOGO_PATHS.map((d, i) => (
                  <motion.path
                    key={d}
                    d={d}
                    fill="url(#pl-g)"
                    fillRule="evenodd"
                    fillOpacity={fill}
                    stroke="#66D9FF"
                    strokeWidth="0.6"
                    strokeOpacity={1 - fill * 0.8}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.1 + i * 0.07, ease: EASE }}
                  />
                ))}
              </svg>
            </div>

            <div className="relative mt-8 overflow-hidden">
              <motion.p
                className="font-display text-lg font-bold tracking-[0.42em] text-ink"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
              >
                DRAFTCORE
              </motion.p>
            </div>

            {/* build log */}
            <div className="absolute bottom-8 left-6 font-mono text-[11px] leading-6 sm:left-10">
              {LOG.slice(0, logIndex + 1).map(([, text], i) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: i === logIndex ? 1 : 0.35, x: 0 }}
                  className={i === logIndex ? 'text-brand-sky' : 'text-muted'}
                >
                  {i === logIndex ? '›' : '✓'} {text}
                  {i === logIndex && <span className="ml-1 inline-block h-3 w-1.5 animate-pulse bg-brand-sky align-middle" />}
                </motion.div>
              ))}
            </div>

            {/* counter + sheet info */}
            <div className="absolute bottom-6 right-6 text-right sm:right-10">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-faint">Sheet DC-000 · Rev A</div>
              <div className="mt-1 font-display text-6xl font-semibold tabular-nums text-ink sm:text-7xl">
                {String(p).padStart(3, '0')}
                <span className="text-brand-sky">%</span>
              </div>
            </div>
            <div className="absolute left-6 top-6 font-mono text-[10px] uppercase tracking-[0.25em] text-faint sm:left-10">
              Design · BIM · Documentation · Delivery
            </div>
            <div className="absolute right-6 top-6 font-mono text-[10px] uppercase tracking-[0.25em] text-faint tabular-nums sm:right-10">
              X {(progress * 12.8).toFixed(1).padStart(6, '0')} · Y {(progress * 7.2).toFixed(1).padStart(6, '0')}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

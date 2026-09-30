import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import SectionHeading from '../SectionHeading.jsx'
import MagneticButton from '../MagneticButton.jsx'
import ServiceDrawing from '../ServiceDrawings.jsx'
import { Reveal } from '../Reveal.jsx'
import { services } from '../../data/services.js'

const CYCLE_MS = 4500
const EASE = [0.22, 1, 0.36, 1]

// The "drawing board": the active service's sheet, drawn live, with a title block.
function Board({ active }) {
  const s = services[active]
  return (
    <div className="relative overflow-hidden rounded-3xl border border-line/10 bg-surface shadow-[0_40px_80px_-50px_rgba(0,0,0,0.8)]">
      <div className="bg-blueprint absolute inset-0 opacity-90" aria-hidden="true" />
      {/* crop marks */}
      {['left-4 top-4 border-l border-t', 'right-4 top-4 border-r border-t', 'bottom-[76px] left-4 border-b border-l', 'bottom-[76px] right-4 border-b border-r'].map((c) => (
        <span key={c} className={`absolute h-4 w-4 border-accent/50 ${c}`} aria-hidden="true" />
      ))}

      <div className="relative aspect-[4/3] w-full p-8 text-accent sm:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(4px)' }}
            transition={{ duration: 0.3 }}
          >
            <ServiceDrawing index={active} className="h-full w-full" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* title block */}
      <div className="relative grid grid-cols-[1.4fr_1fr_0.7fr_0.6fr] border-t border-line/10 font-mono text-[10px] uppercase tracking-[0.16em]">
        {[
          ['Title', s.short],
          ['Sheet', `DC-${s.number}`],
          ['Scale', 'NTS'],
          ['Rev', 'A'],
        ].map(([k, v], i) => (
          <div key={k} className={`px-4 py-3 ${i > 0 ? 'border-l border-line/10' : ''}`}>
            <div className="text-faint">{k}</div>
            <AnimatePresence mode="wait">
              <motion.div
                key={v}
                className="mt-1 truncate text-ink"
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -8, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {v}
              </motion.div>
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ServiceExplorer({ index = '01' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.35 })
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const [hovering, setHovering] = useState(false)
  const cycling = inView && !hovering && !reduced

  useEffect(() => {
    if (!cycling) return undefined
    const id = setTimeout(() => setActive((a) => (a + 1) % services.length), CYCLE_MS)
    return () => clearTimeout(id)
  }, [cycling, active])

  return (
    <section ref={ref} id="services" className="relative overflow-clip py-24 lg:py-32">
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[480px] w-[480px] rounded-full bg-brand-blue/20 blur-[150px]" aria-hidden="true" />
      <div className="container-x relative">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            index={index}
            eyebrow="Services"
            title="Six service streams. One accountable partner."
            highlight={[4, 5]}
            text="From Revit models and CAD documentation to fabrication drawings, site supervision and FF&E supply — every stage covered under a single contract."
          />
          <MagneticButton to="/services" variant="ghost">
            Explore Services <ArrowUpRight className="h-4 w-4" />
          </MagneticButton>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:order-2 lg:col-span-7">
            <div className="lg:sticky lg:top-28">
              <Board active={active} />
            </div>
          </Reveal>

          <ul className="lg:order-1 lg:col-span-5" onMouseLeave={() => setHovering(false)}>
            {services.map((s, i) => {
              const on = i === active
              return (
                <li key={s.slug} className="relative border-t border-line/10 last:border-b">
                  <Link
                    to={`/services/${s.slug}`}
                    data-cursor="Open"
                    onMouseEnter={() => {
                      setHovering(true)
                      setActive(i)
                    }}
                    onFocus={() => setActive(i)}
                    className="group relative flex items-start gap-5 py-6 pl-5 pr-2 outline-offset-[-2px]"
                  >
                    <motion.span
                      className="absolute left-0 top-0 h-full w-[2px] origin-top bg-gradient-to-b from-brand-sky to-brand-electric"
                      initial={false}
                      animate={{ scaleY: on ? 1 : 0 }}
                      transition={{ duration: 0.5, ease: EASE }}
                    />
                    <span className={`mt-1.5 font-mono text-xs transition-colors ${on ? 'text-accent' : 'text-faint'}`}>{s.number}</span>
                    <span className="flex-1">
                      <span
                        className={`block font-display text-2xl font-semibold transition-all duration-500 sm:text-[1.7rem] ${
                          on ? 'translate-x-1 text-ink' : 'text-muted group-hover:text-body'
                        }`}
                      >
                        {s.title}
                      </span>
                      <AnimatePresence initial={false}>
                        {on && (
                          <motion.span
                            className="block overflow-hidden"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.45, ease: EASE }}
                          >
                            <span className="block pt-3 text-[15px] leading-relaxed text-muted">{s.card}</span>
                            <span className="mt-3 flex flex-wrap gap-1.5">
                              {s.tags.slice(0, 4).map((t) => (
                                <span key={t} className="rounded-full border border-line/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-faint">
                                  {t}
                                </span>
                              ))}
                            </span>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                    <span
                      className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
                        on ? 'rotate-45 border-accent bg-accent text-obsidian' : 'border-line/15 text-muted'
                      }`}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                  {/* auto-advance timer */}
                  {on && cycling && (
                    <motion.span
                      key={`t${active}`}
                      className="absolute bottom-0 left-0 h-px bg-accent/70"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: CYCLE_MS / 1000, ease: 'linear' }}
                    />
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

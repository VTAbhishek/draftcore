import { useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, Check } from 'lucide-react'
import SectionHeading from '../SectionHeading.jsx'
import BeforeAfter from '../BeforeAfter.jsx'
import SheetRuler from '../SheetRuler.jsx'
import MagneticButton from '../MagneticButton.jsx'
import { Reveal } from '../Reveal.jsx'

const SCENE_TABS = [
  { id: 'lounge', label: 'Lounge' },
  { id: 'joinery', label: 'Kitchen joinery' },
  { id: 'retail', label: 'Retail display' },
]

const points = [
  'Revit ID & Architecture models up to LOD 300',
  'Tagged, dimensioned documentation sets',
  'Presentation-quality coloured plans and elevations',
]

export default function Showcase({ index = '04' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [60, -60])
  const [scene, setScene] = useState('lounge')

  return (
    <section ref={ref} className="theme-light relative overflow-hidden bg-canvas py-24 lg:py-32">
      <SheetRuler />
      <div className="pointer-events-none absolute right-0 top-1/4 h-[500px] w-[500px] rounded-full bg-brand-cyan/15 blur-[140px]" aria-hidden="true" />
      <div className="container-x relative grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading
            index={index}
            eyebrow="From linework to lived-in"
            title="Design intent, documented precisely."
            highlight={[3]}
            text="Drag across the elevation to move between the coordinated drawing and the finished space it describes. Tap the markers to see the specification."
          />
          <Reveal delay={0.2}>
            <ul className="mt-8 space-y-3">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-body">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <Check className="h-3 w-3" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.3} className="mt-10">
            <MagneticButton to="/projects" variant="ghost">
              View Projects <ArrowUpRight className="h-4 w-4" />
            </MagneticButton>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="lg:col-span-7">
          <motion.div style={{ y }} className="relative">
            <div className="mb-4 flex gap-1 overflow-x-auto [scrollbar-width:none]" role="tablist" aria-label="Choose elevation">
              {SCENE_TABS.map((t, i) => {
                const on = scene === t.id
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => setScene(t.id)}
                    className={`relative shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${on ? 'text-ink' : 'text-muted hover:text-ink'}`}
                  >
                    {on && (
                      <motion.span
                        layoutId="showcase-tab"
                        className="absolute inset-0 rounded-full border border-line/10 bg-surface shadow-[0_6px_20px_-10px_rgba(15,32,60,0.35)]"
                        transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                      />
                    )}
                    <span className="relative flex items-center gap-2">
                      <span className="font-mono text-[10px] text-accent">0{i + 1}</span>
                      {t.label}
                    </span>
                  </button>
                )
              })}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={scene}
                initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <BeforeAfter scene={scene} className="[&>div:first-child]:shadow-[0_50px_90px_-45px_rgba(15,32,60,0.6)]" />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </Reveal>
      </div>
    </section>
  )
}

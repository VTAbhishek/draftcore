import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion'
import { PenTool, LayoutGrid, Layers, FileText, Stamp, HardHat } from 'lucide-react'
import SectionHeading from '../SectionHeading.jsx'
import { Reveal } from '../Reveal.jsx'
import SheetRuler from '../SheetRuler.jsx'
import { stages } from '../../data/site.js'

const ICONS = [PenTool, LayoutGrid, Layers, FileText, Stamp, HardHat]
const heading = {
  eyebrow: 'Concept through handover',
  title: 'Defined standards at every project stage.',
  highlight: [3, 4, 5],
  text: 'Documentation you can build from — issued across CD, SD, DD, Tender and IFC, then carried through to site.',
}

// Desktop: the section pins while the stage cards travel horizontally with scroll.
function PinnedStages({ index }) {
  const section = useRef(null)
  const track = useRef(null)
  const [dist, setDist] = useState(0)
  const [active, setActive] = useState(0)

  useLayoutEffect(() => {
    const measure = () => track.current && setDist(Math.max(0, track.current.scrollWidth - window.innerWidth))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist])
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  useMotionValueEvent(scrollYProgress, 'change', (v) => setActive(Math.min(stages.length - 1, Math.floor(v * stages.length * 0.999 + 0.35))))

  return (
    <div ref={section} className="relative hidden lg:block" style={{ height: `calc(100vh + ${dist}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-20">
        <div className="container-x flex items-end justify-between gap-10">
          <SectionHeading index={index} {...heading} />
          <div className="mb-2 shrink-0 text-right font-mono text-xs uppercase tracking-[0.2em] text-faint">
            <span className="text-3xl font-semibold text-ink">0{active + 1}</span> / 0{stages.length}
          </div>
        </div>

        <div className="container-x mt-12">
          <div className="h-px w-full bg-line/10">
            <motion.div className="h-px origin-left bg-gradient-to-r from-brand-cyan via-brand-sky to-brand-electric" style={{ scaleX: bar }} />
          </div>
        </div>

        <motion.ol
          ref={track}
          style={{ x, paddingLeft: 'max(2.5rem, calc((100vw - 80rem) / 2 + 2.5rem))' }}
          className="mt-10 flex w-max gap-6 pr-10"
        >
          {stages.map((s, i) => {
            const Icon = ICONS[i]
            const on = i === active
            return (
              <li
                key={s.code}
                className={`relative flex h-[46vh] min-h-[320px] w-[25rem] flex-col overflow-hidden rounded-3xl border p-8 transition-all duration-500 ${
                  on ? 'border-accent/50 bg-surface shadow-[0_30px_60px_-35px_rgba(0,108,186,0.55)]' : 'border-line/10 bg-surface/60'
                }`}
              >
                <div className="bg-blueprint absolute inset-0 opacity-60" aria-hidden="true" />
                <div className="relative flex items-center justify-between">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-faint">STAGE 0{i + 1}</span>
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors duration-500 ${
                      on ? 'border-accent bg-accent text-white' : 'border-line/15 text-accent'
                    }`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                </div>
                <div className={`relative mt-auto font-display text-7xl font-semibold tracking-tight ${on ? 'text-gradient' : 'text-ink/80'}`}>
                  {s.code}
                </div>
                <div className="relative mt-3 text-base font-medium text-ink">{s.name}</div>
                <p className="relative mt-2 text-[15px] leading-relaxed text-muted">{s.text}</p>
              </li>
            )
          })}
        </motion.ol>
      </div>
    </div>
  )
}

function VerticalStages({ index }) {
  return (
    <div className="container-x py-24 lg:hidden">
      <SectionHeading index={index} {...heading} />
      <div className="relative mt-14">
        <div className="absolute left-[11px] top-0 h-full w-px bg-line/10" aria-hidden="true" />
        <motion.div
          className="absolute left-[11px] top-0 h-full w-px origin-top bg-gradient-to-b from-brand-cyan via-brand-sky to-brand-electric"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 2, ease: [0.65, 0, 0.35, 1] }}
          aria-hidden="true"
        />
        <ol className="relative grid gap-10">
          {stages.map((s, i) => (
            <Reveal as="li" key={s.code} delay={0.1 + i * 0.08} className="relative pl-12">
              <span className="absolute left-0 top-0 flex h-[23px] w-[23px] items-center justify-center rounded-full border border-accent/60 bg-canvas">
                <span className="h-2 w-2 rounded-full bg-accent" />
              </span>
              <div className="font-mono text-[11px] tracking-[0.2em] text-faint">STAGE 0{i + 1}</div>
              <div className="mt-2 font-display text-3xl font-semibold text-ink">{s.code}</div>
              <div className="mt-1 text-sm font-medium text-accent-soft">{s.name}</div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{s.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </div>
  )
}

export default function StageTimeline({ index = '02', tone = 'light' }) {
  return (
    <section className={`${tone === 'light' ? 'theme-light' : 'theme-dark'} relative bg-canvas`}>
      <SheetRuler className="top-0 z-10" />
      <PinnedStages index={index} />
      <VerticalStages index={index} />
    </section>
  )
}

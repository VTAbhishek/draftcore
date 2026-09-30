import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import SectionHeading from '../SectionHeading.jsx'
import MagneticButton from '../MagneticButton.jsx'
import { Reveal } from '../Reveal.jsx'
import { differentiators } from '../../data/site.js'

const SPECS = [
  ['Design', 'BIM', 'Documentation', 'Site', 'FF&E'],
  ['CD', 'SD', 'DD', 'Tender', 'IFC'],
  ['Joinery', 'Fit-out', 'Wall panelling', 'Ceilings'],
  ['By package', 'By stage', 'Scale up', 'Scale down'],
]

// One card in the stack: sticks, then shrinks slightly as later cards slide over it.
function StackCard({ item, i, total, progress }) {
  const target = 1 - (total - 1 - i) * 0.045
  const scale = useTransform(progress, [i / total, 1], [1, target])
  const dim = useTransform(progress, [(i + 0.75) / total, (i + 1.25) / total], [0, i < total - 1 ? 0.4 : 0])
  const Icon = item.icon

  return (
    <div className="sticky" style={{ top: `calc(7.5rem + ${i * 26}px)`, marginBottom: i < total - 1 ? '14vh' : 0 }}>
      <motion.article
        style={{ scale }}
        className="relative origin-top overflow-hidden rounded-3xl border border-line/10 bg-surface-2 p-8 shadow-[0_-20px_50px_-30px_rgba(0,0,0,0.7)] sm:p-10"
      >
        <div className="bg-blueprint absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand-electric/20 blur-[80px]" aria-hidden="true" />
        <span
          className="text-outline pointer-events-none absolute -bottom-8 right-4 select-none font-display text-[9rem] font-bold leading-none sm:text-[11rem]"
          aria-hidden="true"
        >
          0{i + 1}
        </span>

        <div className="relative flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 text-accent">
            <Icon className="h-7 w-7" strokeWidth={1.4} />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-faint">Reason 0{i + 1} / 0{total}</span>
        </div>
        <h3 className="relative mt-10 max-w-md font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">{item.title}</h3>
        <p className="relative mt-4 max-w-md text-lg leading-relaxed text-muted">{item.text}</p>
        <div className="relative mt-8 flex max-w-md flex-wrap gap-2">
          {SPECS[i].map((t) => (
            <span key={t} className="rounded-full border border-line/15 bg-canvas/40 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-body">
              {t}
            </span>
          ))}
        </div>
        <motion.div className="pointer-events-none absolute inset-0 bg-canvas" style={{ opacity: dim }} aria-hidden="true" />
      </motion.article>
    </div>
  )
}

export default function WhyGrid({ index = '03', showCta = true }) {
  const stack = useRef(null)
  const { scrollYProgress } = useScroll({ target: stack, offset: ['start start', 'end end'] })

  return (
    <section className="relative py-24 lg:py-32">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
            <SectionHeading
              index={index}
              eyebrow="Why DraftCore"
              title="A partner, not just a drafting supplier."
              highlight={[1]}
              text="A flexible extension of your existing design and technical team — combining interior designers, architectural technologists and BIM specialists."
            />
            {showCta && (
              <Reveal delay={0.2} className="mt-10">
                <MagneticButton to="/why-draftcore" variant="ghost">
                  Why partner with us <ArrowUpRight className="h-4 w-4" />
                </MagneticButton>
              </Reveal>
            )}
          </div>
          <div ref={stack} className="relative lg:col-span-7">
            {differentiators.map((d, i) => (
              <StackCard key={d.title} item={d} i={i} total={differentiators.length} progress={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

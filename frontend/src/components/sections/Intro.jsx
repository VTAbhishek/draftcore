import { Reveal, ScrollText } from '../Reveal.jsx'
import Counter from '../Counter.jsx'
import SheetRuler from '../SheetRuler.jsx'
import { stats } from '../../data/site.js'

export default function Intro() {
  return (
    <section className="theme-light relative overflow-hidden py-24 lg:py-36">
      <div className="bg-blueprint mask-radial pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <SheetRuler />
      <div className="container-x relative">
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-3">
            <p className="eyebrow flex items-center gap-3">
              <span className="text-faint">00</span>
              <span className="h-px w-8 bg-accent/50" />
              Who we are
            </p>
          </Reveal>
          <div className="lg:col-span-9">
            <ScrollText
              text="We operate as an extended arm of your design team — delivering accurate, coordinated and delivery-ready BIM models, construction documentation and shop drawings from concept through handover."
              highlight={[4, 5]}
              className="font-display text-2xl font-medium leading-[1.3] tracking-tight text-ink sm:text-3xl lg:text-[2.7rem]"
            />
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line/10 bg-line/10 shadow-[0_24px_60px_-40px_rgba(15,32,60,0.35)] lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="group relative bg-surface p-6 transition-colors duration-500 hover:bg-canvas sm:p-8">
              <span className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-brand-cyan to-brand-electric transition-transform duration-500 group-hover:scale-x-100" />
              <div className="font-display text-4xl font-semibold text-ink sm:text-5xl">
                <Counter value={s.value} prefix={s.prefix} />
              </div>
              <p className="mt-3 max-w-[14rem] text-sm text-muted">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

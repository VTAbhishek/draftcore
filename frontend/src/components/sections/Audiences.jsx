import Marquee from '../Marquee.jsx'
import { Reveal } from '../Reveal.jsx'
import ScrambleText from '../ScrambleText.jsx'
import { audiences } from '../../data/site.js'

// Two counter-running rows: a solid row whose centre item lights up in the brand gradient,
// and an outlined echo row travelling the other way.
export default function Audiences() {
  return (
    <section className="relative overflow-hidden border-y border-line/5 py-16 lg:py-24">
      <div className="bg-blueprint mask-radial pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="container-x relative">
        <Reveal>
          <p className="eyebrow flex items-center justify-center gap-3 text-center">
            <span className="h-px w-8 bg-accent/50" />
            <ScrambleText text="Who we support" />
            <span className="h-px w-8 bg-accent/50" />
          </p>
        </Reveal>
      </div>
      <Marquee
        items={audiences}
        focus
        speed={1.6}
        className="relative mt-10"
        itemClassName="font-display text-4xl font-medium tracking-tight text-ink sm:text-6xl"
      />
      <Marquee
        items={[...audiences].reverse()}
        reverse
        speed={1.1}
        className="relative mt-3"
        itemClassName="text-outline-strong font-display text-3xl font-medium tracking-tight transition-colors duration-300 hover:text-accent sm:text-5xl"
      />
    </section>
  )
}

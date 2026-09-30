import Marquee from '../Marquee.jsx'
import { capabilities } from '../../data/site.js'

// Capability strip styled as a measuring tape: tick rulers scroll in opposite directions along
// both edges, a scan beam sweeps across, and the item passing the centre lights up.
export default function CapabilityTicker() {
  return (
    <section id="capabilities" aria-label="Capabilities" className="relative overflow-hidden border-y border-line/5 bg-surface/80 py-6">
      <div className="ruler ruler-scroll pointer-events-none absolute inset-x-0 top-0 h-4 opacity-50" aria-hidden="true" />
      <div className="ruler ruler-scroll-rev pointer-events-none absolute inset-x-0 bottom-0 h-4 rotate-180 opacity-50" aria-hidden="true" />
      <div className="scan-beam pointer-events-none absolute inset-y-0 left-0 w-56 bg-gradient-to-r from-transparent via-brand-sky/[0.12] to-transparent" aria-hidden="true" />
      <Marquee
        items={capabilities}
        focus
        speed={1.8}
        renderItem={(item, i) => (
          <>
            <span className="mr-3 text-accent/80">[{String(i + 1).padStart(2, '0')}]</span>
            {item}
          </>
        )}
        itemClassName="font-mono text-xs uppercase tracking-[0.2em] text-ink sm:text-[13px]"
      />
    </section>
  )
}

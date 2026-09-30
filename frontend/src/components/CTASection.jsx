import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import MagneticButton from './MagneticButton.jsx'
import ColomboSketch from './ColomboSketch.jsx'
import { Reveal, RevealText } from './Reveal.jsx'

export default function CTASection({
  title = 'Have an upcoming project?',
  text = "Let's discuss how DraftCore can support your design, documentation and delivery requirements.",
  primary = { label: 'Discuss Your Project', to: '/contact' },
  secondary = { label: 'Request a Quotation', to: '/contact?enquiry=quotation' },
}) {
  return (
    <section className="theme-light relative bg-canvas py-20 lg:py-28">
      <div className="container-x">
        <div className="theme-dark relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#10284D] via-[#0D182A] to-[#0B2E57] px-6 pb-56 pt-16 shadow-[0_40px_90px_-45px_rgba(10,40,90,0.8)] sm:px-12 lg:px-20 lg:pb-52 lg:pt-24">
          <div className="bg-blueprint absolute inset-0 opacity-70" aria-hidden="true" />
          <ColomboSketch className="pointer-events-none absolute inset-0 h-full w-full opacity-60 lg:opacity-100 [mask-image:linear-gradient(to_top,#000_30%,rgba(0,0,0,0.28)_75%)] lg:[mask-image:linear-gradient(100deg,rgba(0,0,0,0.3)_12%,#000_58%)]" />
          <motion.div
            className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-electric/40 blur-[110px]"
            animate={{ x: [0, -80, 0], y: [0, 60, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          />
          <motion.div
            className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-brand-cyan/25 blur-[120px]"
            animate={{ x: [0, 90, 0], y: [0, -40, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          />
          {/* drawing-sheet title block */}
          <div className="absolute left-6 top-6 hidden font-mono text-[10px] uppercase leading-5 tracking-[0.2em] text-faint md:block lg:left-10">
            <div>SHEET · DC-000 · STATUS · FOR DISCUSSION</div>
            <div>COLOMBO · 6.9271° N 79.8612° E</div>
          </div>

          <div className="relative max-w-3xl">
            <Reveal>
              <p className="eyebrow">Start a conversation</p>
            </Reveal>
            <RevealText
              text={title}
              className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl"
            />
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-2xl text-lg text-muted">{text}</p>
            </Reveal>
            <Reveal delay={0.25} className="mt-10 flex flex-wrap gap-4">
              <MagneticButton to={primary.to} size="lg">
                {primary.label} <ArrowUpRight className="h-4 w-4" />
              </MagneticButton>
              {secondary && (
                <MagneticButton to={secondary.to} variant="ghost" size="lg">
                  {secondary.label}
                </MagneticButton>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

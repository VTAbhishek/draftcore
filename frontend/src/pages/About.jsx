import { Compass, Boxes, Workflow, Building2, ShieldCheck, SlidersHorizontal, Palette, DraftingCompass } from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { Reveal } from '../components/Reveal.jsx'
import Audiences from '../components/sections/Audiences.jsx'
import CTASection from '../components/CTASection.jsx'
import useSeo from '../hooks/useSeo.js'
import { audiences } from '../data/site.js'

const team = [
  { icon: Palette, title: 'Interior designers', text: 'Protecting design intent from concept development through technical design.' },
  { icon: DraftingCompass, title: 'Architectural technologists', text: 'Turning design into coordinated, buildable documentation and shop drawings.' },
  { icon: Boxes, title: 'BIM specialists', text: 'Revit ID and Architecture models developed up to LOD 300.' },
]

const pillars = [
  {
    icon: Compass,
    title: 'Our approach',
    text: 'We work as an extended arm of our clients’ design teams — aligning to your standards and programme so our output reads as your own.',
  },
  {
    icon: Boxes,
    title: 'Our technical capability',
    text: 'Revit ID and Architecture modelling up to LOD 300, complete CAD interior documentation, and fabrication-level fit-out and joinery shop drawings.',
  },
  {
    icon: Workflow,
    title: 'Our delivery model',
    text: 'Design, BIM, documentation, site support and FF&E available under one contract, across CD, SD, DD, Tender and IFC through to handover.',
  },
  {
    icon: Building2,
    title: 'Client types served',
    text: `${audiences.join(', ')}.`,
  },
  {
    icon: ShieldCheck,
    title: 'Quality and coordination',
    text: 'Consistent naming, sheet setup and family libraries; site inspections, snagging and quality control against approved ID details.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Flexible resource model',
    text: 'Resource can increase or reduce by package or project stage — scaling with your workload rather than your overheads.',
  },
]

export default function About() {
  useSeo({
    title: 'About Us',
    description:
      'DraftCore Solutions is a specialist design and documentation practice serving interior design studios, architects, joinery item providers and value engineering providers.',
  })

  return (
    <>
      <PageHero
        crumbs={[{ label: 'About' }]}
        eyebrow="About DraftCore"
        title="An extended arm of your design team."
        highlight={[1, 2]}
        text="DraftCore Solutions PVT LTD is a specialist design and documentation practice serving interior design studios, architects, joinery item providers and value engineering providers."
      />

      <section className="theme-light relative bg-canvas py-20 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow">Who we are</p>
          </Reveal>
          <div className="space-y-6 text-lg leading-relaxed text-body lg:col-span-7">
            <Reveal>
              <p>
                We produce BIM models, construction documentation and shop drawings that are{' '}
                <span className="text-ink">accurate, coordinated and delivery-ready</span> across every project stage — from
                concept through to handover.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                Our team combines interior designers, architectural technologists and BIM specialists, allowing us to support
                both design intent and technical delivery within a single accountable partner.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="container-x mt-20 grid gap-5 md:grid-cols-3">
          {team.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.1}>
              <div className="glass group h-full rounded-2xl p-8 transition-colors hover:border-accent/40">
                <t.icon className="h-8 w-8 text-accent" strokeWidth={1.4} />
                <h3 className="mt-8 font-display text-2xl font-semibold text-ink">{t.title}</h3>
                <p className="mt-3 text-muted">{t.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative border-t border-line/5 bg-surface py-24 lg:py-32">
        <div className="bg-blueprint absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="container-x relative">
          <SectionHeading
            eyebrow="How we work"
            title="Built around design intent and technical delivery."
            highlight={[2, 3]}
          />
          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line/10 bg-line/10 md:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={(i % 3) * 0.08} className="group bg-surface p-8 transition-colors hover:bg-surface-2 lg:p-10">
                <div className="flex items-center justify-between">
                  <p.icon className="h-6 w-6 text-accent" strokeWidth={1.5} />
                  <span className="font-mono text-xs text-faint">0{i + 1}</span>
                </div>
                <h3 className="mt-8 font-display text-xl font-semibold text-ink">{p.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{p.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Audiences />
      <CTASection
        title="Work with us."
        text="Talk to us about adding DraftCore capacity to your design and technical team."
        primary={{ label: 'Work With Us', to: '/contact' }}
        secondary={{ label: 'Request Capability Statement', to: '/contact?enquiry=capability' }}
      />
    </>
  )
}

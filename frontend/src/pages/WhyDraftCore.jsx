import PageHero from '../components/PageHero.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { Reveal } from '../components/Reveal.jsx'
import Counter from '../components/Counter.jsx'
import WhyGrid from '../components/sections/WhyGrid.jsx'
import Audiences from '../components/sections/Audiences.jsx'
import CTASection from '../components/CTASection.jsx'
import useSeo from '../hooks/useSeo.js'
import { stats } from '../data/site.js'

const steps = [
  { title: 'Share your brief', text: 'Send drawings, standards, templates and the programme for the package.' },
  { title: 'Align to your environment', text: 'Consistent naming, sheet setup and family libraries so work transfers cleanly into your models.' },
  { title: 'Deliver by package or stage', text: 'Documentation issued across CD, SD, DD, Tender and IFC — with shop drawings and site support where needed.' },
  { title: 'Scale as you need', text: 'Resource increases or reduces with each package or project stage.' },
]

export default function WhyDraftCore() {
  useSeo({
    title: 'Why DraftCore',
    description: 'Single accountable partner, documentation you can build from, interior specialists and flexible, scalable capacity.',
  })

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Why DraftCore' }]}
        eyebrow="Why DraftCore"
        title="Your extended design and technical delivery team."
        highlight={[1, 2, 3, 4]}
        text="DraftCore is a flexible extension of your existing design and technical team — not only a drafting supplier."
      />

      <section className="theme-light relative bg-canvas py-16">
        <div className="container-x grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line/10 bg-line/10 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-surface p-6 sm:p-8">
              <div className="font-display text-4xl font-semibold text-gradient sm:text-5xl">
                <Counter value={s.value} prefix={s.prefix} />
              </div>
              <p className="mt-3 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <WhyGrid index="" showCta={false} />

      <section className="theme-light relative bg-canvas py-24 lg:py-32">
        <div className="bg-blueprint absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="container-x relative">
          <SectionHeading eyebrow="How the partnership works" title="Plugged into your team in four steps." highlight={[4, 5, 6]} />
          <ol className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.1} className="relative rounded-2xl border border-line/10 bg-canvas p-7">
                <span className="font-mono text-xs text-accent">STEP 0{i + 1}</span>
                <h3 className="mt-6 font-display text-xl font-semibold text-ink">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{s.text}</p>
                {i < steps.length - 1 && (
                  <span className="absolute -right-3 top-1/2 hidden h-px w-6 bg-accent/50 lg:block" aria-hidden="true" />
                )}
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <Audiences />
      <CTASection
        title="Start a conversation."
        primary={{ label: 'Start a Conversation', to: '/contact' }}
        secondary={{ label: 'Request a Consultation', to: '/contact?enquiry=quotation' }}
      />
    </>
  )
}

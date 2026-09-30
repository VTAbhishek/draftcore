import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import { Reveal } from '../components/Reveal.jsx'
import StageTimeline from '../components/sections/StageTimeline.jsx'
import CTASection from '../components/CTASection.jsx'
import useSeo from '../hooks/useSeo.js'
import { services } from '../data/services.js'

export default function Services() {
  useSeo({
    title: 'Services',
    description:
      'BIM modelling, CAD documentation, shop drawings, interior design, project delivery and FF&E solutions — six service streams from DraftCore Solutions.',
  })

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Services' }]}
        eyebrow="Services"
        title="Six service streams, from concept through handover."
        highlight={[0, 1, 2]}
        text="Choose a single service or combine them — BIM, documentation, fabrication drawings, design, delivery and FF&E under one contract."
      />

      <section className="theme-light relative bg-canvas py-10 lg:py-16">
        <div className="container-x">
          {services.map((s, i) => (
            <Reveal key={s.slug}>
              <Link
                to={`/services/${s.slug}`}
                data-cursor="Explore"
                className="group relative grid gap-8 border-t border-line/10 py-12 transition-colors lg:grid-cols-12 lg:py-16"
              >
                <span
                  className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-brand-sky to-brand-electric transition-transform duration-700 group-hover:scale-x-100"
                  aria-hidden="true"
                />
                <div className="flex items-start gap-6 lg:col-span-5">
                  <span className="font-mono text-sm text-accent">{s.number}</span>
                  <div>
                    <h2 className="font-display text-3xl font-semibold text-ink transition-colors group-hover:text-accent-soft sm:text-4xl">
                      {s.title}
                    </h2>
                    <p className="mt-4 max-w-md text-muted">{s.intro}</p>
                  </div>
                </div>
                <ul className="grid content-start gap-x-8 gap-y-3 sm:grid-cols-2 lg:col-span-6">
                  {s.items.map((item) => (
                    <li key={item.title} className="flex gap-3 text-[15px] text-body">
                      <span className="mt-2.5 h-px w-3 shrink-0 bg-accent" />
                      {item.title}
                    </li>
                  ))}
                </ul>
                <div className="flex items-start lg:col-span-1 lg:justify-end">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line/15 text-ink transition-all duration-500 group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-obsidian">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </div>
                {i === services.length - 1 && <span className="absolute inset-x-0 bottom-0 h-px bg-line/10" aria-hidden="true" />}
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <StageTimeline index="" tone="dark" />
      <CTASection />
    </>
  )
}

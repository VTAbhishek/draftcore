import { Link, useParams } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import MagneticButton from '../components/MagneticButton.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { Reveal } from '../components/Reveal.jsx'
import CTASection from '../components/CTASection.jsx'
import useSeo from '../hooks/useSeo.js'
import { getService, services } from '../data/services.js'
import { stages } from '../data/site.js'
import NotFound from './NotFound.jsx'

export default function ServiceDetail() {
  const { slug } = useParams()
  const service = getService(slug)
  useSeo({ title: service?.title || 'Service not found', description: service?.intro })

  if (!service) return <NotFound />

  const Icon = service.icon
  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3)
  const enquiry = `/contact?service=${service.slug}`

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Services', to: '/services' }, { label: service.short }]}
        eyebrow={`Service ${service.number}`}
        title={service.title}
        text={service.intro}
      >
        <Reveal delay={0.3} className="mt-10 flex flex-wrap gap-4">
          <MagneticButton to={enquiry} size="lg">
            {service.cta} <ArrowUpRight className="h-4 w-4" />
          </MagneticButton>
          <MagneticButton to="/services" variant="ghost" size="lg">
            All Services
          </MagneticButton>
        </Reveal>
      </PageHero>

      <section className="theme-light relative bg-canvas py-20 lg:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal className="lg:sticky lg:top-32">
              <div className="glass relative overflow-hidden rounded-2xl p-8">
                <div className="bg-blueprint absolute inset-0 opacity-60" aria-hidden="true" />
                <Icon className="relative h-14 w-14 text-accent" strokeWidth={1.1} />
                <p className="eyebrow relative mt-10">Scope tags</p>
                <div className="relative mt-4 flex flex-wrap gap-2">
                  {service.tags.map((t) => (
                    <span key={t} className="rounded-full border border-accent/25 bg-accent/5 px-3 py-1 font-mono text-[11px] uppercase text-accent-soft">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <SectionHeading eyebrow="What's included" title="Scope of service" />
            <ol className="mt-12 divide-y divide-line/10 border-y border-line/10">
              {service.items.map((item, i) => (
                <Reveal as="li" key={item.title} delay={i * 0.05} className="group grid gap-3 py-7 sm:grid-cols-[4rem_1fr]">
                  <span className="font-mono text-sm text-accent/70 transition-colors group-hover:text-accent">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-ink">{item.title}</h3>
                    <p className="mt-2 text-muted">{item.text}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {service.showStages && (
        <section className="border-y border-line/5 bg-surface py-16">
          <div className="container-x">
            <p className="eyebrow">Issued across every stage</p>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {stages.slice(0, 5).map((s, i) => (
                <Reveal key={s.code} delay={i * 0.06}>
                  <div className="rounded-xl border border-line/10 bg-canvas p-5 transition-colors hover:border-accent/40">
                    <div className="font-display text-2xl font-semibold text-ink">{s.code}</div>
                    <div className="mt-1 text-xs text-muted">{s.name}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="theme-light relative bg-canvas py-20 lg:py-24">
        <div className="container-x">
          <p className="eyebrow">Related services</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                to={`/services/${r.slug}`}
                className="group flex items-center justify-between rounded-2xl border border-line/10 p-6 transition hover:border-accent/40 hover:bg-line/[0.02]"
              >
                <span>
                  <span className="font-mono text-xs text-accent">{r.number}</span>
                  <span className="mt-2 block font-display text-lg font-semibold text-ink">{r.short}</span>
                </span>
                <ArrowUpRight className="h-5 w-5 text-faint transition group-hover:rotate-45 group-hover:text-accent" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title={`${service.cta}.`}
        text="Share your drawings, programme and scope — we'll come back with how DraftCore can support the package."
        primary={{ label: service.cta, to: enquiry }}
      />
    </>
  )
}

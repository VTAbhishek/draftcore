import { Mail, Phone, Globe, MessageCircle } from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import ContactForm from '../components/ContactForm.jsx'
import { Reveal } from '../components/Reveal.jsx'
import useSeo from '../hooks/useSeo.js'
import { site } from '../data/site.js'

const next = [
  { title: 'We review your brief', text: 'Drawings, scope and programme are reviewed by the relevant specialists.' },
  { title: 'Scope & quotation', text: 'We confirm deliverables, stages and resourcing, and issue a proposal.' },
  { title: 'Kick-off', text: 'We align to your standards and templates and start delivery.' },
]

export default function Contact() {
  useSeo({
    title: 'Contact',
    description: 'Send your project details to DraftCore Solutions — BIM, documentation, shop drawings, interior design, project delivery and FF&E.',
  })

  const channels = [
    { icon: Mail, label: 'Email', value: site.email, href: `mailto:${site.email}` },
    { icon: Phone, label: 'Telephone', value: site.phone, href: site.phoneHref },
    site.whatsapp && { icon: MessageCircle, label: 'WhatsApp', value: site.phone, href: `https://wa.me/${site.whatsapp}`, external: true },
    { icon: Globe, label: 'Website', value: site.website, href: site.url },
  ].filter(Boolean)

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Contact' }]}
        eyebrow="Contact"
        title="Let's discuss your project."
        highlight={[2, 3]}
        text="Tell us about your design, documentation and delivery requirements. Upload drawings or reference files and we'll take it from there."
      />

      <section className="theme-light relative bg-canvas py-16 lg:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Reveal>
              <ContactForm />
            </Reveal>
          </div>

          <aside className="space-y-6 lg:col-span-4">
            <Reveal delay={0.1}>
              <div className="glass rounded-3xl p-7">
                <p className="eyebrow">Direct contact</p>
                <p className="mt-3 font-display text-lg font-semibold text-ink">{site.name}</p>
                <ul className="mt-6 space-y-3">
                  {channels.map((c) => (
                    <li key={c.label}>
                      <a
                        href={c.href}
                        {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="group flex items-center gap-4 rounded-2xl border border-line/10 p-4 transition hover:border-accent/40 hover:bg-accent/[0.05]"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent transition group-hover:shadow-[0_0_20px_-4px_#3CC8FF]">
                          <c.icon className="h-5 w-5" />
                        </span>
                        <span className="min-w-0">
                          <span className="block font-mono text-[10px] uppercase tracking-wider text-faint">{c.label}</span>
                          <span className="block truncate text-sm text-ink">{c.value}</span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="rounded-3xl border border-line/10 p-7">
                <p className="eyebrow">What happens next</p>
                <ol className="mt-6 space-y-6">
                  {next.map((n, i) => (
                    <li key={n.title} className="flex gap-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent/40 font-mono text-[11px] text-accent">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-medium text-ink">{n.title}</p>
                        <p className="mt-1 text-sm text-muted">{n.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>
    </>
  )
}

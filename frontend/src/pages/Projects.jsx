import { forwardRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Info } from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import BeforeAfter from '../components/BeforeAfter.jsx'
import InteriorDrawing from '../components/InteriorDrawing.jsx'
import { Reveal } from '../components/Reveal.jsx'
import CTASection from '../components/CTASection.jsx'
import useSeo from '../hooks/useSeo.js'
import { projectCategories } from '../data/site.js'
import { projects } from '../data/projects.js'

const FILTERS = ['All', ...projectCategories]

const ProjectCard = forwardRef(function ProjectCard({ project }, ref) {
  return (
    <motion.article
      ref={ref}
      data-cursor="CAD view"
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group overflow-hidden rounded-2xl border border-line/10 bg-surface shadow-[0_20px_50px_-35px_rgba(15,32,60,0.35)] transition-[border-color,box-shadow] duration-500 hover:border-accent/40 hover:shadow-[0_30px_60px_-30px_rgba(0,108,186,0.45)]"
    >
      <div className="relative aspect-[8/5] overflow-hidden">
        <InteriorDrawing scene={project.scene} mode="render" className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <InteriorDrawing scene={project.scene} mode="wire" className="absolute inset-0 h-full w-full" />
        </div>
        <span className="absolute left-3 top-3 rounded-full bg-canvas/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-accent backdrop-blur">
          {project.category}
        </span>
        <span className="absolute right-3 top-3 rounded-full border border-amber-300/30 bg-amber-300/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-amber-200 backdrop-blur">
          Sample
        </span>
      </div>
      <div className="p-6">
        <h3 className="font-display text-xl font-semibold text-ink">{project.title}</h3>
        <p className="mt-1 text-sm text-faint">Location to be confirmed</p>
        <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-line/10 pt-5 text-sm">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-faint">Services</dt>
            <dd className="mt-1 text-body">{project.services.join(', ')}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-faint">Stage · Software</dt>
            <dd className="mt-1 text-body">
              {project.stage} · {project.software}
            </dd>
          </div>
        </dl>
      </div>
    </motion.article>
  )
})

export default function Projects() {
  const [filter, setFilter] = useState('All')
  useSeo({
    title: 'Projects',
    description: 'DraftCore project portfolio — hospitality, residential, commercial, retail, F&B, joinery and fit-out.',
  })

  const visible = filter === 'All' ? projects : projects.filter((p) => p.category === filter)

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Projects' }]}
        eyebrow="Projects"
        title="From drawing set to delivered space."
        highlight={[4, 5]}
        text="A selection of the project types DraftCore supports across hospitality, residential, commercial, retail, F&B, joinery and fit-out."
      />

      <section className="pb-12">
        <div className="container-x">
          <Reveal>
            <BeforeAfter scene="retail" />
          </Reveal>
        </div>
      </section>

      <section className="theme-light relative bg-canvas py-20 lg:py-28">
        <div className="container-x">
          <Reveal>
            <div className="flex items-start gap-3 rounded-xl border border-amber-300/20 bg-amber-300/[0.06] p-4 text-sm text-amber-100/80">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-200" />
              <p>
                Portfolio in preparation — the cards below are illustrative placeholders showing the layout. Approved DraftCore
                projects, imagery and descriptions will replace them before launch.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]" role="tablist" aria-label="Filter projects by category">
            {FILTERS.map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm transition-colors ${
                  filter === f ? 'text-obsidian' : 'text-muted hover:text-ink'
                }`}
              >
                {filter === f && (
                  <motion.span
                    layoutId="project-filter"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-ice to-brand-sky"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{f}</span>
              </button>
            ))}
          </div>

          <motion.div layout className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visible.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </AnimatePresence>
          </motion.div>
          {visible.length === 0 && <p className="mt-10 text-faint">No projects in this category yet.</p>}
        </div>
      </section>

      <CTASection title="Have a project like these?" primary={{ label: 'Send Your Project', to: '/contact' }} />
    </>
  )
}

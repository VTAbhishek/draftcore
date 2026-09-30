import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, Pause, Play } from 'lucide-react'
import MagneticButton from '../MagneticButton.jsx'
import HeroVideo from './HeroVideo.jsx'
import ScrambleText from '../ScrambleText.jsx'
import Hud from './Hud.jsx'
import { site } from '../../data/site.js'
import { useIntroDone } from '../../lib/intro.js'

const EASE = [0.22, 1, 0.36, 1]
// each word lights up while the film shows its stage: 0 blueprint, 1 section, 2 render
const LINES = [
  [
    { w: 'Design.', phase: 0 },
    { w: 'BIM.', phase: 0 },
  ],
  [{ w: 'Documentation.', phase: 1 }],
  [{ w: 'Delivery.', phase: 2 }],
]

function Word({ text, on }) {
  return (
    <span className="relative inline-block">
      <span className={`transition-opacity duration-700 ${on ? 'opacity-0' : 'opacity-100'}`}>{text}</span>
      <span className={`text-gradient absolute inset-0 transition-opacity duration-700 ${on ? 'opacity-100' : 'opacity-0'}`}>{text}</span>
    </span>
  )
}

export default function Hero() {
  const ref = useRef(null)
  const [phase, setPhase] = useState(0)
  const [active, setActive] = useState(true)
  const [paused, setPaused] = useState(false)
  const [ended, setEnded] = useState(false)
  const ready = useIntroDone()

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 160])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])

  const show = (delay) => ({
    initial: { opacity: 0, y: 18 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    transition: { duration: 0.9, delay, ease: EASE },
  })
  // once the film finishes the poster (final render) holds, so settle on the render stage
  const highlight = ended ? 2 : phase

  return (
    <section ref={ref} className="theme-dark relative flex min-h-[100svh] flex-col overflow-hidden bg-canvas" aria-label="Introduction">
      <motion.div className="absolute inset-0" style={{ scale: mediaScale, y: mediaY }}>
        <HeroVideo active={active} paused={paused} onPhase={setPhase} onEnded={() => setEnded(true)} />
      </motion.div>

      {/* legibility */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canvas via-canvas/70 to-transparent lg:bg-gradient-to-r lg:from-canvas lg:via-canvas/55 lg:to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-canvas/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-canvas to-transparent" />
      <div className="bg-blueprint pointer-events-none absolute inset-0 opacity-40 [mask-image:linear-gradient(90deg,#000,transparent_60%)]" />

      <Hud phase={highlight} />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container-x relative z-10 flex flex-1 flex-col justify-end pb-24 pt-32 lg:justify-center lg:pb-16"
      >
        <motion.p {...show(0.1)} className="eyebrow flex items-center gap-3">
          <motion.span
            className="h-px w-10 origin-left bg-accent/60"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: ready ? 1 : 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          />
          <ScrambleText text="Specialist design & documentation partner" start={ready} duration={1100} />
        </motion.p>

        <h1 className="mt-6 font-display text-[clamp(2.6rem,7vw,6.4rem)] font-semibold leading-[0.98] tracking-[-0.025em] text-ink">
          <span className="sr-only">Design. BIM. Documentation. Delivery.</span>
          {LINES.map((line, i) => (
            <span key={i} className="block overflow-hidden pb-[0.06em]" aria-hidden="true">
              <motion.span
                className="block"
                initial={{ y: '105%', rotate: 2 }}
                animate={ready ? { y: '0%', rotate: 0 } : { y: '105%', rotate: 2 }}
                transition={{ duration: 1.1, delay: 0.2 + i * 0.12, ease: EASE }}
              >
                {line.map((word, j) => (
                  <span key={word.w}>
                    {j > 0 && ' '}
                    <Word text={word.w} on={highlight === word.phase} />
                  </span>
                ))}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p {...show(0.6)} className="mt-7 max-w-xl text-base leading-relaxed text-body sm:text-lg">
          DraftCore Solutions is a specialist design and documentation partner delivering BIM modelling, interior
          documentation, shop drawings, project support and FF&amp;E solutions from concept through handover.
        </motion.p>

        <motion.div {...show(0.75)} className="mt-10 flex flex-wrap items-center gap-4">
          <MagneticButton to="/contact" size="lg">
            Discuss Your Project <ArrowUpRight className="h-4 w-4" />
          </MagneticButton>
          <MagneticButton to="/services" variant="ghost" size="lg">
            View Our Services
          </MagneticButton>
        </motion.div>

        <motion.p {...show(0.95)} className="mt-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_#3CC8FF]" />
          <ScrambleText text={site.tagline} start={ready} duration={1400} />
        </motion.p>
      </motion.div>

      {!ended && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? 'Play background video' : 'Pause background video'}
          className="absolute bottom-6 left-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-line/15 bg-canvas/50 text-ink backdrop-blur transition hover:border-accent/60 sm:left-6 lg:left-10"
        >
          {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </button>
      )}

      <motion.a
        href="#capabilities"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted hover:text-accent lg:flex"
      >
        Scroll
        <span className="relative flex h-10 w-6 justify-center overflow-hidden rounded-full border border-line/20">
          <motion.span
            className="mt-2 h-2 w-1 rounded-full bg-accent"
            animate={{ y: [0, 14, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.a>
    </section>
  )
}

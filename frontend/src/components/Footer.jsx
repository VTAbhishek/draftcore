import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowUp, ArrowUpRight, Check, Copy, Mail, Phone, Globe } from 'lucide-react'
import Logo from './Logo.jsx'
import SheetRuler from './SheetRuler.jsx'
import { RevealText } from './Reveal.jsx'
import { nav, site } from '../data/site.js'
import { services } from '../data/services.js'
import { scrollToTopSmooth } from '../lib/smoothScroll.js'

const EASE = [0.22, 1, 0.36, 1]

function FooterLink({ to, href, children, icon: Icon }) {
  const content = (
    <>
      {Icon && <Icon className="h-4 w-4 shrink-0 text-accent" />}
      <span className="relative">
        {children}
        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-accent transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
      </span>
      <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 text-accent opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
    </>
  )
  const cls = 'group inline-flex items-center gap-2.5 text-sm text-body transition-colors hover:text-ink'
  return to ? (
    <Link to={to} className={cls}>
      {content}
    </Link>
  ) : (
    <a href={href} className={cls}>
      {content}
    </a>
  )
}

// Big magnetic disc with a rotating ring of text.
function StartBadge() {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 180, damping: 14 })
  const sy = useSpring(y, { stiffness: 180, damping: 14 })
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * 0.35)
    y.set((e.clientY - r.top - r.height / 2) * 0.35)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }
  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={reset} className="p-6">
      <motion.div style={{ x: sx, y: sy }}>
        <Link
          to="/contact"
          aria-label="Send your project"
          className="group relative flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-brand-sky via-brand-cyan to-brand-electric text-obsidian shadow-[0_20px_60px_-15px_rgba(60,200,255,0.7)] sm:h-48 sm:w-48"
        >
          <motion.svg viewBox="0 0 200 200" className="absolute inset-0" animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} aria-hidden="true">
            <defs>
              <path id="badge-circle" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
            </defs>
            <text fontSize="11" fontFamily="JetBrains Mono, monospace" letterSpacing="3.2" fill="currentColor" fontWeight="500">
              <textPath href="#badge-circle">SEND YOUR PROJECT • DISCUSS YOUR PROJECT • </textPath>
            </text>
          </motion.svg>
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-obsidian text-brand-sky transition-transform duration-500 group-hover:rotate-45 group-hover:scale-110">
            <ArrowUpRight className="h-7 w-7" />
          </span>
        </Link>
      </motion.div>
    </div>
  )
}

function EmailBand() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }
  return (
    <div className="container-x relative grid items-center gap-10 py-20 lg:grid-cols-12 lg:py-28">
      <div className="lg:col-span-8">
        <p className="eyebrow flex items-center gap-3">
          <span className="h-px w-8 bg-accent/60" /> Let&apos;s talk
        </p>
        <RevealText
          text="Got a project on the drawing board?"
          highlight={[5, 6]}
          className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl"
        />
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a href={`mailto:${site.email}`} data-cursor="Email" className="group relative font-display text-[clamp(1.25rem,4.2vw,3.1rem)] font-medium leading-none text-muted">
            {site.email}
            <span
              className="text-gradient absolute inset-0 transition-[clip-path] duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] [clip-path:inset(0_100%_0_0)] group-hover:[clip-path:inset(0_0_0_0)]"
              aria-hidden="true"
            >
              {site.email}
            </span>
            <span className="absolute -bottom-2 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-brand-sky to-brand-electric transition-transform duration-700 group-hover:scale-x-100" />
          </a>
          <button
            type="button"
            onClick={copy}
            className="flex items-center gap-2 rounded-full border border-line/15 px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted transition hover:border-accent/60 hover:text-ink"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <div className="flex lg:col-span-4 lg:justify-end">
        <StartBadge />
      </div>
    </div>
  )
}

function LocalTime() {
  const fmt = useMemo(
    () => new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Colombo', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
    [],
  )
  const [now, setNow] = useState(() => fmt.format(new Date()))
  useEffect(() => {
    const id = setInterval(() => setNow(fmt.format(new Date())), 1000)
    return () => clearInterval(id)
  }, [fmt])
  return (
    <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
      </span>
      Sri Lanka · <span className="tabular-nums text-ink">{now}</span> · GMT+5:30
    </div>
  )
}

function BackToTop() {
  const { scrollYProgress } = useScroll()
  const C = 2 * Math.PI * 20
  const offset = useTransform(scrollYProgress, [0, 1], [C, 0])
  return (
    <button
      type="button"
      onClick={scrollToTopSmooth}
      aria-label="Back to top"
      className="group relative flex h-12 w-12 items-center justify-center rounded-full text-ink transition hover:text-accent"
    >
      <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5" />
        <motion.circle cx="24" cy="24" r="20" fill="none" stroke="#3CC8FF" strokeWidth="1.5" strokeLinecap="round" strokeDasharray={C} style={{ strokeDashoffset: offset }} />
      </svg>
      <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1" />
    </button>
  )
}

// Each letter rises and fills with the brand gradient as the pointer passes near it.
function Letter({ ch, mx }) {
  const ref = useRef(null)
  const near = useTransform(mx, (x) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return 0
    return Math.max(0, 1 - Math.abs(x - (r.left + r.width / 2)) / (r.width * 2))
  })
  const p = useSpring(near, { stiffness: 220, damping: 22 })
  const y = useTransform(p, [0, 1], ['0%', '-14%'])
  return (
    <motion.span
      className="inline-block"
      variants={{ hidden: { y: '110%' }, show: { y: '0%', transition: { duration: 1, ease: EASE } } }}
    >
      <motion.span ref={ref} className="relative inline-block" style={{ y }}>
        <span className="text-outline">{ch}</span>
        <motion.span className="text-gradient absolute inset-0" style={{ opacity: p }}>
          {ch}
        </motion.span>
      </motion.span>
    </motion.span>
  )
}

function Wordmark() {
  const mx = useMotionValue(-9999)
  return (
    <motion.div
      className="flex select-none justify-center overflow-hidden pt-[2.5vw] font-display text-[18vw] font-bold leading-[0.8] tracking-tight"
      aria-hidden="true"
      onPointerMove={(e) => mx.set(e.clientX)}
      onPointerLeave={() => mx.set(-9999)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      variants={{ show: { transition: { staggerChildren: 0.05 } } }}
    >
      {'DRAFTCORE'.split('').map((ch, i) => (
        <Letter key={i} ch={ch} mx={mx} />
      ))}
    </motion.div>
  )
}

export default function Footer() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const y = useTransform(scrollYProgress, [0, 1], [-160, 0])
  const year = new Date().getFullYear()

  return (
    <footer ref={ref} className="theme-dark relative overflow-hidden bg-surface">
      <motion.div style={{ y }}>
        <div className="bg-blueprint mask-radial pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-40 top-10 h-[420px] w-[420px] rounded-full bg-brand-electric/15 blur-[140px]" aria-hidden="true" />

        <EmailBand />

        <div className="relative">
          <SheetRuler />
        </div>

        <div className="container-x relative grid gap-12 pb-10 pt-16 md:grid-cols-2 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-4">
            <Logo />
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              Specialist design and documentation partner delivering BIM modelling, interior documentation, shop drawings,
              project support and FF&amp;E solutions from concept through handover.
            </p>
            <LocalTime />
          </div>

          <div className="lg:col-span-3">
            <h3 className="eyebrow text-faint">Services</h3>
            <ul className="mt-5 space-y-3">
              {services.map((s) => (
                <li key={s.slug}>
                  <FooterLink to={`/services/${s.slug}`}>{s.short}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="eyebrow text-faint">Company</h3>
            <ul className="mt-5 space-y-3">
              {nav
                .filter((n) => n.to !== '/services')
                .map((n) => (
                  <li key={n.to}>
                    <FooterLink to={n.to}>{n.label}</FooterLink>
                  </li>
                ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="eyebrow text-faint">Contact</h3>
            <ul className="mt-5 space-y-4">
              <li>
                <FooterLink href={`mailto:${site.email}`} icon={Mail}>
                  {site.email}
                </FooterLink>
              </li>
              <li>
                <FooterLink href={site.phoneHref} icon={Phone}>
                  {site.phone}
                </FooterLink>
              </li>
              <li>
                <FooterLink href={site.url} icon={Globe}>
                  {site.website}
                </FooterLink>
              </li>
            </ul>
          </div>
        </div>

        <Wordmark />

        <div className="relative border-t border-line/10">
          <div className="container-x flex flex-col items-center justify-between gap-4 py-5 text-xs text-faint sm:flex-row">
            <p>
              © {year} {site.name}. All rights reserved.
            </p>
            <p className="font-mono uppercase tracking-[0.2em]">{site.tagline}</p>
            <BackToTop />
          </div>
        </div>
      </motion.div>
    </footer>
  )
}

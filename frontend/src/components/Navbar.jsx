import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ArrowUpRight, Mail, Phone } from 'lucide-react'
import Logo from './Logo.jsx'
import RollText from './RollText.jsx'
import MagneticButton from './MagneticButton.jsx'
import ServiceDrawing from './ServiceDrawings.jsx'
import { nav, site } from '../data/site.js'
import { services } from '../data/services.js'
import { lockScroll } from '../lib/smoothScroll.js'

const EASE = [0.76, 0, 0.24, 1]

// Two bars that fold into an X.
function MenuToggle({ open, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
      className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-line/15 bg-canvas/40 text-ink backdrop-blur lg:hidden"
    >
      <motion.span className="absolute h-[1.5px] w-5 rounded bg-current" animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }} transition={{ duration: 0.35, ease: EASE }} />
      <motion.span className="absolute h-[1.5px] w-5 rounded bg-current" animate={open ? { rotate: -45, y: 0, width: 20 } : { rotate: 0, y: 4, width: 14 }} transition={{ duration: 0.35, ease: EASE }} />
    </button>
  )
}

// Services mega menu: list on the left, the hovered service's sheet drafts itself on the right.
function MegaMenu() {
  const [preview, setPreview] = useState(0)
  const s = services[preview]
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.15 } }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="grid w-[820px] grid-cols-[1fr_1.05fr] gap-3 rounded-3xl border border-line/10 bg-surface p-3 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]"
    >
      <ul className="py-1">
        {services.map((item, i) => (
          <li key={item.slug}>
            <Link
              to={`/services/${item.slug}`}
              onMouseEnter={() => setPreview(i)}
              onFocus={() => setPreview(i)}
              className="relative flex items-center gap-4 rounded-2xl px-4 py-3"
            >
              {preview === i && (
                <motion.span layoutId="mega-hover" className="absolute inset-0 rounded-2xl bg-accent/[0.08]" transition={{ type: 'spring', stiffness: 400, damping: 35 }} />
              )}
              <span
                className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                  preview === i ? 'border-accent bg-accent text-obsidian' : 'border-line/10 text-accent'
                }`}
              >
                <item.icon className="h-5 w-5" />
              </span>
              <span className="relative min-w-0">
                <span className="flex items-center gap-2 text-sm font-medium text-ink">
                  <span className="font-mono text-[10px] text-faint">{item.number}</span>
                  {item.short}
                </span>
                <span className="mt-0.5 block truncate text-xs text-muted">{item.card}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link to={`/services/${s.slug}`} className="relative flex flex-col overflow-hidden rounded-2xl border border-line/10 bg-canvas">
        <div className="bg-blueprint absolute inset-0 opacity-80" aria-hidden="true" />
        <div className="relative flex-1 p-6 text-accent">
          <AnimatePresence mode="wait">
            <motion.div key={preview} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <ServiceDrawing index={preview} className="h-full w-full" />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="relative flex items-center justify-between border-t border-line/10 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.16em]">
          <span className="text-faint">
            Sheet DC-{s.number} · <span className="text-ink">{s.short}</span>
          </span>
          <span className="flex items-center gap-1 text-accent">
            Open <ArrowUpRight className="h-3 w-3" />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

function MobileMenu({ onClose }) {
  const origin = 'calc(100% - 44px) 40px'
  return (
    <motion.div
      className="theme-dark fixed inset-0 z-[45] overflow-y-auto bg-canvas lg:hidden"
      initial={{ clipPath: `circle(0px at ${origin})` }}
      animate={{ clipPath: `circle(150% at ${origin})` }}
      exit={{ clipPath: `circle(0px at ${origin})` }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="bg-blueprint absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-brand-electric/25 blur-[100px]" aria-hidden="true" />
      <nav className="container-x relative flex min-h-full flex-col pb-10 pt-28" aria-label="Mobile">
        <ul>
          {nav.map((item, i) => (
            <li key={item.to} className="overflow-hidden border-b border-line/10">
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.05, ease: EASE }}
              >
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-baseline gap-4 py-4 font-display text-[2.1rem] font-medium leading-none ${isActive ? 'text-ink' : 'text-muted'}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="w-6 font-mono text-xs text-accent">0{i + 1}</span>
                      {item.label}
                      {isActive && <span className="ml-auto h-2 w-2 self-center rounded-full bg-accent shadow-[0_0_10px_#3CC8FF]" />}
                    </>
                  )}
                </NavLink>
              </motion.div>
            </li>
          ))}
        </ul>
        <motion.div
          className="mt-6 grid grid-cols-2 gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.5 }}
        >
          {services.map((s) => (
            <Link key={s.slug} to={`/services/${s.slug}`} onClick={onClose} className="flex items-center gap-2 rounded-xl border border-line/10 px-3 py-2.5 text-xs text-body">
              <s.icon className="h-4 w-4 text-accent" /> {s.short}
            </Link>
          ))}
        </motion.div>
        <motion.div
          className="mt-auto space-y-4 pt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
        >
          <MagneticButton to="/contact" size="lg" block className="w-full" onClick={onClose}>
            Discuss Your Project <ArrowUpRight className="h-4 w-4" />
          </MagneticButton>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-[11px] text-muted">
            <a href={`mailto:${site.email}`} className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-accent" /> {site.email}
            </a>
            <a href={site.phoneHref} className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-accent" /> {site.phone}
            </a>
          </div>
        </motion.div>
      </nav>
    </motion.div>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const [dropdown, setDropdown] = useState(false)
  const [hovered, setHovered] = useState(null)
  const lastY = useRef(0)
  const menuOpen = useRef(false)
  const menuTimer = useRef(0)

  // Services mega menu: opens only after resting on the Services link (hover intent), stays open while
  // the pointer is on the link or the open menu, and a closing menu can never re-open itself.
  const setMenu = (v) => {
    clearTimeout(menuTimer.current)
    menuOpen.current = v
    setDropdown(v)
  }
  const openMenu = (delay = 140) => {
    clearTimeout(menuTimer.current)
    menuTimer.current = setTimeout(() => setMenu(true), delay)
  }
  const closeMenu = (delay = 180) => {
    clearTimeout(menuTimer.current)
    menuTimer.current = setTimeout(() => setMenu(false), delay)
  }
  const keepMenu = () => {
    if (menuOpen.current) clearTimeout(menuTimer.current)
  }
  useEffect(() => () => clearTimeout(menuTimer.current), [])
  const location = useLocation()

  // morph to a floating pill once scrolled; tuck away while scrolling down, return on scroll up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      if (y > 480 && y > lastY.current + 6) setHidden(true)
      else if (y < lastY.current - 6 || y < 480) setHidden(false)
      lastY.current = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
    setMenu(false)
    setHidden(false)
  }, [location.pathname])

  useEffect(() => {
    if (open) lockScroll(true)
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        setMenu(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      if (open) lockScroll(false)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const pill = scrolled && !open

  return (
    <>
    <AnimatePresence>{open && <MobileMenu onClose={() => setOpen(false)} />}</AnimatePresence>
    <motion.header
      className="fixed inset-x-0 top-0 z-50 px-3 sm:px-4"
      animate={{ y: hidden && !open && !dropdown ? '-120%' : '0%' }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <div
        className={`relative mx-auto flex items-center justify-between transition-[max-width,height,margin,padding,border-radius,background-color,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          pill
            ? 'mt-3 h-14 max-w-6xl rounded-full border border-line/10 bg-canvas/80 pl-4 pr-2 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl'
            : 'mt-0 h-16 max-w-7xl rounded-none border border-transparent bg-transparent px-1 sm:px-2 lg:h-20 lg:px-6'
        }`}
      >
        <motion.div initial="rest" animate="rest" whileHover="hover" className="relative z-10">
          <Link to="/" aria-label="DraftCore Solutions — home">
            <Logo interactive compact={pill} />
          </Link>
        </motion.div>

        <nav className="hidden items-center lg:flex" aria-label="Primary" onMouseLeave={() => setHovered(null)}>
          {nav.map((item) => {
            const pillBg = hovered === item.to && (
              <motion.span layoutId="nav-hover" className="absolute inset-0 rounded-full bg-line/[0.08]" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />
            )
            const cls = ({ isActive }) =>
              `group relative flex items-center gap-1 rounded-full px-4 py-2 text-[13px] font-medium tracking-wide transition-colors ${
                isActive ? 'text-ink' : 'text-muted hover:text-ink'
              }`
            const inner = (isActive, extra) => (
              <>
                {pillBg}
                <span className="relative flex items-center gap-1">
                  <RollText>{item.label}</RollText>
                  {extra}
                </span>
                {isActive && (
                  <motion.span layoutId="nav-dot" className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_8px_#3CC8FF]" />
                )}
              </>
            )
            return item.dropdown ? (
              <div
                key={item.to}
                className="relative"
                onFocus={() => openMenu(0)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) setMenu(false)
                }}
              >
                <NavLink
                  to={item.to}
                  className={cls}
                  aria-haspopup="true"
                  aria-expanded={dropdown}
                  onMouseEnter={() => {
                    setHovered(item.to)
                    openMenu()
                  }}
                  onMouseLeave={() => closeMenu()}
                >
                  {({ isActive }) => inner(isActive, <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${dropdown ? 'rotate-180' : ''}`} />)}
                </NavLink>
                <AnimatePresence>
                  {dropdown && (
                    <div className="absolute left-1/2 top-full -translate-x-1/2 pt-4" onMouseEnter={keepMenu} onMouseLeave={() => closeMenu()}>
                      <MegaMenu />
                    </div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className={cls} onMouseEnter={() => setHovered(item.to)}>
                {({ isActive }) => inner(isActive)}
              </NavLink>
            )
          })}
        </nav>

        <div className="hidden lg:block">
          <MagneticButton to="/contact" size="sm">
            Discuss Your Project <ArrowUpRight className="h-4 w-4" />
          </MagneticButton>
        </div>

        <MenuToggle open={open} onClick={() => setOpen((v) => !v)} />
      </div>
    </motion.header>
    </>
  )
}

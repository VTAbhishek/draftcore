import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import RollText from './RollText.jsx'

const VARIANTS = {
  primary:
    'bg-gradient-to-r from-brand-cyan via-brand-sky to-brand-electric text-obsidian font-semibold glow-cyan hover:brightness-110',
  ghost: 'border border-line/15 bg-line/[0.03] text-ink hover:border-accent/50 hover:bg-accent/10',
}

export default function MagneticButton({
  to,
  href,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  strength = 0.3,
  block = false,
  ...rest
}) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 })
  const [ripples, setRipples] = useState([])

  const onMove = (e) => {
    if (e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * strength)
    y.set((e.clientY - r.top - r.height / 2) * strength)
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
  }
  const onDown = (e) => {
    const r = ref.current.getBoundingClientRect()
    const id = `${Date.now()}-${Math.random()}`
    setRipples((rs) => [...rs, { id, x: e.clientX - r.left, y: e.clientY - r.top }])
    setTimeout(() => setRipples((rs) => rs.filter((rp) => rp.id !== id)), 700)
  }

  const sizing = size === 'lg' ? 'px-7 py-4 text-[15px]' : size === 'sm' ? 'px-4 py-2.5 text-sm' : 'px-6 py-3.5 text-sm'
  const classes = `group relative inline-flex items-center justify-center overflow-hidden rounded-full transition-[filter,background-color,border-color] duration-300 ${sizing} ${VARIANTS[variant]} ${className}`

  const content = (
    <>
      <span className="relative z-10 flex items-center gap-2">
        <RollText>{children}</RollText>
      </span>
      {ripples.map((rp) => (
        <span key={rp.id} className="ripple" style={{ left: rp.x, top: rp.y }} />
      ))}
    </>
  )

  const shared = { ref, className: classes, onPointerDown: onDown, ...rest }

  return (
    <motion.span
      className={block ? 'block' : 'inline-block'}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {to ? (
        <Link to={to} {...shared}>
          {content}
        </Link>
      ) : href ? (
        <a href={href} {...shared}>
          {content}
        </a>
      ) : (
        <button type="button" {...shared}>
          {content}
        </button>
      )}
    </motion.span>
  )
}

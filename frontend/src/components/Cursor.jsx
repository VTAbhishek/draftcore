import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'

const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, label'

// Follower ring for fine pointers (the native cursor stays visible).
// Elements with data-cursor="Label" turn it into a labelled disc.
export default function Cursor() {
  const [enabled] = useState(
    () => window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [hover, setHover] = useState(false)
  const [label, setLabel] = useState('')
  const [visible, setVisible] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 })

  useEffect(() => {
    if (!enabled) return undefined
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
    }
    const over = (e) => {
      const t = e.target
      setLabel(t.closest?.('[data-cursor]')?.getAttribute('data-cursor') || '')
      setHover(!!t.closest?.(INTERACTIVE))
    }
    const leave = () => setVisible(false)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [enabled, x, y])

  if (!enabled) return null
  const labelled = !!label
  return (
    <motion.div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[90]" style={{ x: sx, y: sy }}>
      {/* plain ring (inverts what it passes over) */}
      <motion.div
        className="absolute -ml-4 -mt-4 h-8 w-8 rounded-full border border-white mix-blend-difference"
        animate={{
          scale: labelled ? 0 : hover ? 1.8 : 1,
          opacity: visible && !labelled ? (hover ? 0.9 : 0.55) : 0,
          backgroundColor: hover ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      />
      {/* labelled disc */}
      <motion.div
        className="absolute -ml-11 -mt-11 flex h-[88px] w-[88px] items-center justify-center rounded-full bg-gradient-to-br from-brand-sky to-brand-electric shadow-[0_10px_40px_-10px_rgba(60,200,255,0.8)]"
        animate={{ scale: labelled && visible ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      >
        <AnimatePresence mode="wait">
          {labelled && (
            <motion.span
              key={label}
              className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-obsidian"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

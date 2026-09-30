import { useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'

const wrap = (min, max, v) => {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

function Cross({ spin }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5 shrink-0 text-accent"
      style={spin ? { transform: 'rotate(calc(var(--t, 0) * 135deg)) scale(calc(0.85 + var(--t, 0) * 0.5))' } : undefined}
      aria-hidden="true"
    >
      <path d="M8 0v16M0 8h16" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="8" cy="8" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

// Infinite strip. Drifts on its own, speeds up / reverses with scroll velocity and leans into it,
// slows to a crawl on hover. `focus` lights up whichever item is passing the centre.
// With reduced motion it still drifts, slowly, without the velocity boost or skew.
export default function Marquee({
  items,
  reverse = false,
  speed = 2.2,
  focus = false,
  renderItem,
  className = '',
  itemClassName = '',
}) {
  const reduced = useReducedMotion()
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const factor = useTransform(velocity, [0, 1000], [0, 4], { clamp: false })
  const skewX = useTransform(velocity, [-2500, 2500], [7, -7], { clamp: true })
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`)
  const dir = useRef(reverse ? -1 : 1)
  const hovering = useRef(false)
  const pace = useRef(1)
  const box = useRef(null)
  const itemEls = useRef([])

  useAnimationFrame((_, delta) => {
    pace.current += ((hovering.current ? 0.12 : 1) - pace.current) * 0.06
    const base = reverse ? -1 : 1
    let move
    if (reduced) {
      move = -base * speed * 0.35 * (delta / 1000)
    } else {
      const f = factor.get()
      if (f < 0) dir.current = -base
      else if (f > 0) dir.current = base
      move = -dir.current * speed * (delta / 1000)
      move += move * Math.abs(f)
    }
    baseX.set(baseX.get() + move * pace.current)

    if (focus && box.current) {
      const b = box.current.getBoundingClientRect()
      const centre = b.left + b.width / 2
      const span = b.width * 0.3
      const rects = itemEls.current.map((el) => el?.getBoundingClientRect())
      rects.forEach((r, i) => {
        if (!r) return
        const t = Math.max(0, 1 - Math.abs(r.left + r.width / 2 - centre) / span)
        itemEls.current[i].style.setProperty('--t', t.toFixed(3))
      })
    }
  })

  const row = [...items, ...items]
  return (
    <div
      ref={box}
      className={`mask-fade-x relative flex overflow-hidden ${className}`}
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => (hovering.current = false)}
    >
      <motion.ul className="flex w-max shrink-0 items-center" style={{ x, skewX: reduced ? 0 : skewX }}>
        {row.map((item, i) => {
          const content = renderItem ? renderItem(item, i % items.length) : item
          return (
            <li
              key={i}
              ref={(el) => (itemEls.current[i] = el)}
              aria-hidden={i >= items.length}
              className="flex items-center gap-6 whitespace-nowrap px-6"
            >
              <Cross spin={focus} />
              {focus ? (
                <span className="relative inline-block" style={{ transform: 'scale(calc(0.94 + var(--t, 0) * 0.06))' }}>
                  <span className={`block ${itemClassName}`} style={{ opacity: 'calc(0.4 + var(--t, 0) * 0.6)' }}>
                    {content}
                  </span>
                  <span className={`text-gradient absolute inset-0 block ${itemClassName} !text-transparent`} style={{ opacity: 'var(--t, 0)' }} aria-hidden="true">
                    {content}
                  </span>
                </span>
              ) : (
                <span className={itemClassName}>{content}</span>
              )}
            </li>
          )
        })}
      </motion.ul>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

const GLYPHS = '/\\|+-=<>#01XYZ▚▞░▒'

// Resolves from random CAD-ish glyphs to the real text, left to right.
// Starts when `start` becomes true, or when scrolled into view if `start` is omitted.
export default function ScrambleText({ text, start, duration = 900, className }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduced = useReducedMotion()
  const go = start === undefined ? inView : start
  const [out, setOut] = useState(reduced ? text : text.replace(/\S/g, ' '))

  useEffect(() => {
    if (reduced) {
      setOut(text)
      return undefined
    }
    if (!go) return undefined
    let raf = 0
    const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration)
      const shown = Math.floor(p * text.length)
      let s = ''
      for (let i = 0; i < text.length; i++) {
        const c = text[i]
        s += i < shown || c === ' ' ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]
      }
      setOut(s)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [go, text, duration, reduced])

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{out}</span>
    </span>
  )
}

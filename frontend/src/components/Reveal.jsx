import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]

export function Reveal({ children, delay = 0, y = 28, className, as = 'div' }) {
  const M = motion[as]
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </M>
  )
}

// Word-by-word masked slide-up. `highlight` holds word indexes to render with the brand gradient.
export function RevealText({ text, as = 'h2', className, delay = 0, highlight = [] }) {
  const M = motion[as]
  const words = text.split(' ')
  return (
    <M
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: delay } } }}
    >
      {words.map((word, i) => (
        <span key={i} aria-hidden="true">
          <span className="inline-block overflow-hidden pb-[0.1em] align-bottom -mb-[0.1em]">
            <motion.span
              className={`inline-block ${highlight.includes(i) ? 'text-gradient' : ''}`}
              variants={{ hidden: { y: '110%' }, show: { y: '0%', transition: { duration: 0.85, ease: EASE } } }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </M>
  )
}

function ScrollWord({ children, progress, range, highlight }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  return (
    <motion.span style={{ opacity }} className={highlight ? 'text-gradient' : undefined}>
      {children}
    </motion.span>
  )
}

// Words brighten one after another as the paragraph scrolls through the viewport.
export function ScrollText({ text, as = 'p', className, highlight = [] }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = text.split(' ')
  const Tag = as
  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i}>
          <ScrollWord progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} highlight={highlight.includes(i)}>
            {word}
          </ScrollWord>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}

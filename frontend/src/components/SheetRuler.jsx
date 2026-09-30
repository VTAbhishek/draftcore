import { motion } from 'framer-motion'

// Scale-rule tick strip that draws in along a section edge.
export default function SheetRuler({ className = 'top-0' }) {
  return (
    <motion.div
      aria-hidden="true"
      className={`ruler pointer-events-none absolute inset-x-0 h-4 origin-left ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
    />
  )
}

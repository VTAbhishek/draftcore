import { motion } from 'framer-motion'
import { LOGO_PATHS } from './Logo.jsx'

// Inline loader for lazily loaded pages: the mark is redrafted in a loop over a scanning rule.
export default function SheetLoader({ label = 'Loading sheet' }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center" role="status" aria-label={label}>
      <svg viewBox="-4 -4 108 88" className="h-16 w-auto text-accent">
        {LOGO_PATHS.map((d, i) => (
          <motion.path
            key={d}
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            initial={{ pathLength: 0, opacity: 0.2 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0.2, 1, 1, 0.2] }}
            transition={{ duration: 2.4, times: [0, 0.45, 0.75, 1], delay: i * 0.06, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </svg>
      <div className="relative mt-6 h-px w-40 overflow-hidden bg-line/10">
        <motion.span
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-accent to-transparent"
          animate={{ x: ['-100%', '300%'] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-faint">
        {label}
        <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
          …
        </motion.span>
      </p>
    </div>
  )
}

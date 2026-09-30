import { motion } from 'framer-motion'
import { Reveal, RevealText } from './Reveal.jsx'
import ScrambleText from './ScrambleText.jsx'

export default function SectionHeading({ index, eyebrow, title, text, highlight, align = 'left', className = '' }) {
  const centered = align === 'center'
  return (
    <div className={`${centered ? 'mx-auto text-center' : ''} max-w-3xl ${className}`}>
      <Reveal>
        <p className={`eyebrow flex items-center gap-3 ${centered ? 'justify-center' : ''}`}>
          {index && <span className="text-faint">{index}</span>}
          <motion.span
            className="h-px w-8 origin-left bg-accent/60"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          />
          <ScrambleText text={eyebrow} />
        </p>
      </Reveal>
      <RevealText
        text={title}
        highlight={highlight}
        className="mt-5 font-display text-3xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-4xl lg:text-5xl"
      />
      {text && (
        <Reveal delay={0.15}>
          <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">{text}</p>
        </Reveal>
      )}
    </div>
  )
}

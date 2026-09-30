// Hover roll: the label slides up and an identical copy rolls in from below.
// Needs a `group` class on the hovered ancestor.
export default function RollText({ children, className = '' }) {
  return (
    <span className={`relative inline-flex overflow-hidden ${className}`}>
      <span className="inline-flex items-center gap-2 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
        {children}
      </span>
      <span
        className="absolute inset-0 inline-flex translate-y-full items-center gap-2 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0"
        aria-hidden="true"
      >
        {children}
      </span>
    </span>
  )
}

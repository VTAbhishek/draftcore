import { ArrowUpRight } from 'lucide-react'
import MagneticButton from '../components/MagneticButton.jsx'
import useSeo from '../hooks/useSeo.js'

export default function NotFound() {
  useSeo({ title: 'Page not found' })
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden pt-24">
      <div className="bg-blueprint mask-radial absolute inset-0" aria-hidden="true" />
      <div className="container-x relative text-center">
        <p className="eyebrow">Error · 404</p>
        <h1 className="mt-6 font-display text-7xl font-semibold text-ink sm:text-9xl">
          <span className="text-gradient">404</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-lg text-muted">This sheet isn't in the drawing set. Let's get you back on plan.</p>
        <div className="mt-10 flex justify-center gap-4">
          <MagneticButton to="/">
            Back to Home <ArrowUpRight className="h-4 w-4" />
          </MagneticButton>
          <MagneticButton to="/contact" variant="ghost">
            Contact DraftCore
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}

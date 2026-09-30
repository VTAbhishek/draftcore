import { useEffect, useRef, useState } from 'react'
import { heroVideo } from '../../data/site.js'

const base = import.meta.env.BASE_URL
const url = (p) => `${base}${p}`

function pickSet() {
  return window.matchMedia('(max-aspect-ratio: 1/1)').matches ? heroVideo.mobile : heroVideo.desktop
}

function phaseAt(t) {
  let idx = 0
  for (const [from, phase] of heroVideo.phases || []) if (t >= from) idx = phase
  return idx
}

// Background hero film. Respects reduced motion (poster only), pauses off-screen, reports HUD phase.
export default function HeroVideo({ active, paused, reduced, onPhase }) {
  const ref = useRef(null)
  const [set, setSet] = useState(pickSet)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-aspect-ratio: 1/1)')
    const onChange = () => setSet(pickSet())
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (active && !paused && !reduced) v.play().catch(() => {})
    else v.pause()
  }, [active, paused, reduced, set])

  useEffect(() => {
    const v = ref.current
    if (!v || !heroVideo.phases) return undefined
    let last = -1
    const tick = () => {
      const p = phaseAt(v.currentTime)
      if (p !== last) {
        last = p
        onPhase?.(p)
      }
    }
    v.addEventListener('timeupdate', tick)
    return () => v.removeEventListener('timeupdate', tick)
  }, [onPhase, set])

  return (
    <>
      <img
        src={url(set.poster)}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        fetchpriority="high"
      />
      {!reduced && (
        <video
          key={set.mp4}
          ref={ref}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          poster={url(set.poster)}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          aria-hidden="true"
          onCanPlay={() => setLoaded(true)}
        >
          <source src={url(set.mp4)} type="video/mp4" />
          <source src={url(set.webm)} type="video/webm" />
        </video>
      )}
    </>
  )
}

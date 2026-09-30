import Lenis from 'lenis'

let lenis = null

export function startSmoothScroll() {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null
  lenis = new Lenis({ autoRaf: true, anchors: { offset: -80 }, lerp: 0.1, wheelMultiplier: 0.95 })
  if (document.body.style.overflow === 'hidden') lenis.stop() // a lock (e.g. the preloader) is already active
  return lenis
}

export function stopSmoothScroll() {
  lenis?.destroy()
  lenis = null
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
  else window.scrollTo({ top: 0, behavior: 'instant' })
}

// Pause/resume page scrolling (e.g. while the mobile menu is open).
export function lockScroll(locked) {
  document.body.style.overflow = locked ? 'hidden' : ''
  if (lenis) locked ? lenis.stop() : lenis.start()
}

export function scrollToTopSmooth() {
  if (lenis) lenis.scrollTo(0, { duration: 1.6 })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}

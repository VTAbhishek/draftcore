import { useEffect, useState } from 'react'

// Tiny store so the hero can hold its entrance until the preloader has lifted.
let done = false
const listeners = new Set()

export function markIntroDone() {
  if (done) return
  done = true
  listeners.forEach((fn) => fn())
}

export function useIntroDone() {
  const [ready, setReady] = useState(done)
  useEffect(() => {
    if (done) {
      setReady(true)
      return undefined
    }
    const fn = () => setReady(true)
    listeners.add(fn)
    return () => listeners.delete(fn)
  }, [])
  return ready
}

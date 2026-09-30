import { useEffect } from 'react'
import { defaultDescription } from '../data/site.js'

const DEFAULT_TITLE = 'DraftCore Solutions | BIM, Interior Documentation, Shop Drawings & FF&E'

export default function useSeo({ title, description } = {}) {
  useEffect(() => {
    document.title = title ? `${title} | DraftCore Solutions` : DEFAULT_TITLE
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', description || defaultDescription)
  }, [title, description])
}

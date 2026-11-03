import { useEffect, useState } from 'react'
import { API } from './data.js'

// Accepts a plain array or an object like { items: [...] }.
const toList = d => (Array.isArray(d) ? d : (d && (d.items || d.results || d.data)) || [])

// GET {API}/{path}. If the endpoint is missing, empty or unreachable, items is [] and the UI shows the "no info" notice.
export function useCollection(path) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    fetch(`${API}/${path}`)
      .then(r => (r.ok ? r.json() : []))
      .then(d => { if (alive) setItems(toList(d)) })
      .catch(() => {})
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [path])

  return { items, loading }
}

// Maps whatever field names the backend uses onto the names the UI expects.
// If your backend names things differently, change them here and nowhere else.
export function toSite(x, i) {
  return {
    id: x.id ?? i,
    name: x.name || x.title || 'Untitled',
    state: x.state || 'Unsorted',
    city: x.city || '',
    type: x.type || 'Other',
    purpose: x.purpose || 'Other',
    image: x.image || x.image_url || x.url || '',
    description: x.description || x.blurb || '',
    architecture: x.architecture || ''
  }
}

export function useSites() {
  const { items, loading } = useCollection('sites')
  return { sites: items.map(toSite), loading }
}

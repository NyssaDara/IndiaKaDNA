import { useEffect, useState } from 'react'
import { API, photos } from '../data.js'

const MIN_MS = 2600 // always show the photostrips for at least this long
const MAX_MS = 6000 // stop waiting for the backend after this long

export default function PhotoLoader({ title, subtitle = 'Connecting to the archive', onDone }) {
  const [elapsed, setElapsed] = useState(0)
  const [status, setStatus] = useState('connecting')

  const cols = [0, 2, 4, 1, 3].map(o => [...photos.slice(o), ...photos.slice(0, o)])

  useEffect(() => {
    const t0 = performance.now()
    const since = () => (performance.now() - t0) / 1000
    const tick = setInterval(() => setElapsed(since()), 100)
    const ctl = new AbortController()
    const timeout = setTimeout(() => ctl.abort(), MAX_MS)
    let alive = true

    // Any HTTP reply from the server counts as connected. A network error or timeout counts as offline.
    const ping = fetch(`${API}/health`, { signal: ctl.signal }).then(() => 'online').catch(() => 'offline')
    const minimum = new Promise(r => setTimeout(r, MIN_MS))

    Promise.all([ping, minimum]).then(([result]) => {
      if (!alive) return
      clearInterval(tick)
      setElapsed(since())
      setStatus(result)
      setTimeout(() => { if (alive) onDone() }, 800)
    })

    return () => {
      alive = false
      clearInterval(tick)
      clearTimeout(timeout)
      ctl.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const text =
    status === 'connecting'
      ? `Connecting… ${elapsed.toFixed(1)}s`
      : status === 'online'
        ? `Connected in ${elapsed.toFixed(1)}s`
        : `Server not reachable after ${elapsed.toFixed(1)}s. Opening anyway.`

  return (
    <div className="loader" role="status" aria-live="polite">
      <div className="loader-cols" aria-hidden="true">
        {cols.map((col, i) => (
          <div key={i} className={`loader-col ${i % 2 ? 'down' : 'up'}`}>
            <div className="loader-track">
              {[...col, ...col].map((src, j) => (
                <div className="loader-photo" key={j}>
                  <img src={src} alt="" onError={e => { e.currentTarget.style.visibility = 'hidden' }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="loader-shade" />
      <div className="loader-card">
        <div className="brand">INDIA<span>KA</span>DNA<span className="brand-dot">.</span></div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <div className="loader-bar"><i className={status === 'connecting' ? '' : 'full'} /></div>
        <small className={status === 'offline' ? 'warn' : ''}>{text}</small>
      </div>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { STATES, SITES, photos } from '../data.js'

export default function IndiaMap({ onOpenSite }) {
  const [state, setState] = useState(null)
  const [city, setCity] = useState(null)
  const [hover, setHover] = useState(null)

  const withSites = useMemo(() => new Set(SITES.map(s => s.state)), [])
  const stateSites = state ? SITES.filter(s => s.state === state) : []
  const cities = [...new Set(stateSites.map(s => s.city))]
  const citySites = city ? stateSites.filter(s => s.city === city) : []

  function pickState(name) {
    setState(name)
    setCity(null)
  }

  return (
    <div className="map-layout">
      <div className="map-card">
        <div className="india-grid">
          {STATES.map(([name, code, c, r], i) => (
            <motion.button
              key={name}
              className={`tile ${withSites.has(name) ? 'has' : ''} ${state === name ? 'sel' : ''}`}
              style={{ gridColumn: c + 1, gridRow: r + 1 }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.025, type: 'spring', stiffness: 260, damping: 18 }}
              whileHover={{ scale: 1.18, zIndex: 5 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => pickState(name)}
              onMouseEnter={() => setHover(name)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(name)}
              onBlur={() => setHover(null)}
              aria-label={name}
            >
              {code}
            </motion.button>
          ))}
        </div>
        <p className="map-caption">
          {hover || state || 'Touch a state to begin'}
        </p>
        <p className="map-legend"><i className="dot has" /> Has heritage records <i className="dot" /> Coming soon</p>
      </div>

      <div className="map-panel">
        <div className="crumbs">
          <button onClick={() => { setState(null); setCity(null) }}>India</button>
          {state && <><ChevronRight size={14} /><button onClick={() => setCity(null)}>{state}</button></>}
          {city && <><ChevronRight size={14} /><span>{city}</span></>}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${state}-${city}`}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
          >
            {!state && (
              <>
                <h3>Explore India by location</h3>
                <p className="muted">Pick a state, then a city, then step into the sites that tell its story.</p>
              </>
            )}

            {state && !city && (
              <>
                <h3>{state}</h3>
                {cities.length === 0 && <p className="muted">No records yet. Contributors are still adding this state.</p>}
                <ul className="list">
                  {cities.map(c => (
                    <li key={c}>
                      <button onClick={() => setCity(c)}>
                        <span>{c}</span>
                        <small>{stateSites.filter(s => s.city === c).length} site(s)</small>
                        <ChevronRight size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {city && (
              <>
                <h3>{city}</h3>
                <ul className="list">
                  {citySites.map(s => (
                    <li key={s.id}>
                      <button onClick={() => onOpenSite(s)}>
                        <img src={photos[s.img].src} alt="" onError={e => { e.currentTarget.style.visibility = 'hidden' }} />
                        <span>{s.name}</span>
                        <small>{s.type}</small>
                        <ChevronRight size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

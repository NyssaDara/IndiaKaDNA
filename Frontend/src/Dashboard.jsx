import { useCallback, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Compass, ScrollText, Map as MapIcon, MessageCircle, Search,
  ArrowLeft, Volume2, Square, CheckCircle2, Loader2
} from 'lucide-react'
import IndiaMap from '../components/IndiaMap.jsx'
import SiteModal from '../components/SiteModal.jsx'
import BeforeAfter from '../components/BeforeAfter.jsx'
import { API, STATES, SITES, MANUSCRIPTS, STORIES, photos, speak, stopSpeaking } from '../data.js'

const TABS = [
  ['explore', 'Explore', Compass],
  ['manuscripts', 'Manuscripts', ScrollText],
  ['map', 'India map', MapIcon],
  ['share', 'Share knowledge', MessageCircle]
]

const hideBroken = e => { e.currentTarget.style.visibility = 'hidden' }

/* ---------- Tab 1: albums by state, purpose and type ---------- */
function ExploreTab({ onOpen }) {
  const [by, setBy] = useState('state')
  const [cat, setCat] = useState(null)
  const [q, setQ] = useState('')

  const groups = useMemo(() => {
    const map = {}
    SITES.forEach(s => {
      const key = s[by]
      if (!map[key]) map[key] = []
      map[key].push(s)
    })
    return map
  }, [by])

  const albums = by === 'state' ? STATES.map(s => s[0]) : Object.keys(groups)
  const shown = albums.filter(a => a.toLowerCase().includes(q.toLowerCase()))
  const modes = [['state', 'By state'], ['purpose', 'By purpose'], ['type', 'By type']]

  if (cat) {
    return (
      <div>
        <button className="back-btn" onClick={() => setCat(null)}><ArrowLeft size={16} /> All albums</button>
        <h2 className="tab-title">{cat}</h2>
        <div className="site-grid">
          {(groups[cat] || []).map(s => (
            <button key={s.id} className="site-card" onClick={() => onOpen(s)}>
              <img src={photos[s.img].src} alt={s.name} onError={hideBroken} />
              <div>
                <h3>{s.name}</h3>
                <p>{s.city}</p>
              </div>
            </button>
          ))}
          {!(groups[cat] || []).length && <p className="muted">Nothing here yet. Be the first to contribute.</p>}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="explore-bar">
        <div className="seg">
          {modes.map(([id, label]) => (
            <button key={id} className={by === id ? 'on' : ''} onClick={() => { setBy(id); setQ('') }}>{label}</button>
          ))}
        </div>
        <div className="search-box">
          <Search size={18} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search albums" />
        </div>
      </div>

      <div className="album-grid">
        {shown.map((a, i) => {
          const list = groups[a] || []
          const cover = list[0] ? photos[list[0].img].src : null
          return (
            <motion.button
              key={a}
              className={`album ${list.length ? '' : 'empty'}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.4) }}
              whileHover={{ y: -6 }}
              onClick={() => list.length && setCat(a)}
              disabled={!list.length}
            >
              {cover && <img src={cover} alt="" onError={hideBroken} />}
              <div className="album-text">
                <h3>{a}</h3>
                <p>{list.length ? `${list.length} place${list.length > 1 ? 's' : ''}` : 'Coming soon'}</p>
              </div>
            </motion.button>
          )
        })}
        {!shown.length && <p className="muted">No albums match that search.</p>}
      </div>
    </div>
  )
}

/* ---------- Tab 2: manuscripts, forgotten stories, time travel ---------- */
function ManuscriptsTab() {
  const [sub, setSub] = useState('manuscripts')
  const [playing, setPlaying] = useState(null)
  const [pick, setPick] = useState(SITES[0].id)
  const site = SITES.find(s => s.id === pick)

  function toggle(story) {
    if (playing === story.id) {
      stopSpeaking()
      setPlaying(null)
      return
    }
    setPlaying(story.id)
    speak(`${story.title}. ${story.text}`, () => setPlaying(null))
  }

  const subs = [['manuscripts', 'Manuscripts'], ['stories', 'Forgotten stories'], ['time', 'Time travel']]

  return (
    <div>
      <div className="seg">
        {subs.map(([id, label]) => (
          <button key={id} className={sub === id ? 'on' : ''} onClick={() => { stopSpeaking(); setPlaying(null); setSub(id) }}>{label}</button>
        ))}
      </div>

      {sub === 'manuscripts' && (
        <div className="doc-grid">
          {MANUSCRIPTS.map(m => (
            <article key={m.id} className="doc-card">
              <small>{m.era}</small>
              <h3>{m.title}</h3>
              <p><b>Script:</b> {m.script}</p>
              <p><b>Where it began:</b> {m.origin}</p>
              <p><b>How to read it:</b> {m.reading}</p>
            </article>
          ))}
          <p className="muted wide">Sample entries. Real transcriptions and translations will appear here after review.</p>
        </div>
      )}

      {sub === 'stories' && (
        <div className="doc-grid">
          {STORIES.map(s => (
            <article key={s.id} className="doc-card">
              <small>{s.place}</small>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <button className="outline-btn dark" onClick={() => toggle(s)}>
                {playing === s.id ? <Square size={16} /> : <Volume2 size={16} />} {playing === s.id ? 'Stop audio' : 'Listen'}
              </button>
            </article>
          ))}
        </div>
      )}

      {sub === 'time' && (
        <div className="time-wrap">
          <label className="select-label">
            Choose a place
            <select value={pick} onChange={e => setPick(e.target.value)}>
              {SITES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </label>
          <BeforeAfter src={photos[site.img].src} thenLabel="Then (demo)" nowLabel="Now" />
          <p className="muted">Drag the slider. When contributors upload new photos of the same place, the oldest and newest are paired here automatically.</p>
        </div>
      )}
    </div>
  )
}

/* ---------- Tab 4: share knowledge or feedback ---------- */
function ShareTab() {
  const [form, setForm] = useState({ name: '', state: '', place: '', message: '' })
  const [status, setStatus] = useState('idle')
  const set = k => e => setForm({ ...form, [k]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(`${API}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error('bad status')
      setStatus('done')
      setForm({ name: '', state: '', place: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <h2 className="tab-title">Know something we don't?</h2>
      <p className="muted">Tell us a local story, a correction or an idea. Everything is reviewed before it joins the archive.</p>

      <label>Your name
        <input required value={form.name} onChange={set('name')} placeholder="Your name" />
      </label>
      <div className="two-col">
        <label>State
          <select required value={form.state} onChange={set('state')}>
            <option value="">Choose a state</option>
            {STATES.map(s => <option key={s[0]}>{s[0]}</option>)}
          </select>
        </label>
        <label>Place (optional)
          <input value={form.place} onChange={set('place')} placeholder="e.g. Dashashwamedh Ghat" />
        </label>
      </div>
      <label>What would you like to share?
        <textarea required rows="6" value={form.message} onChange={set('message')} placeholder="Tell us what you know" />
      </label>

      <button className="primary-btn" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? <><Loader2 size={16} className="spin" /> Sending</> : 'Send to the archive'}
      </button>
      {status === 'done' && <p className="ok"><CheckCircle2 size={16} /> Thank you. Your contribution was received.</p>}
      {status === 'error' && <p className="err">Could not reach the server. Check that the backend is running and that it has a /feedback endpoint.</p>}
    </form>
  )
}

export default function Dashboard() {
  const [tab, setTab] = useState('explore')
  const [site, setSite] = useState(null)
  const closeSite = useCallback(() => setSite(null), [])

  return (
    <main className="dash">
      <header className="dash-head">
        <h1>Explore India's heritage.</h1>
        <p>Albums, manuscripts, maps and your own stories, all in one place.</p>
      </header>

      <div className="tabs" role="tablist">
        {TABS.map(([id, label, Icon]) => (
          <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>
            {tab === id && <motion.span layoutId="tab-pill" className="tab-pill" />}
            <span className="lbl"><Icon size={17} /> {label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.section
          key={tab}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22 }}
        >
          {tab === 'explore' && <ExploreTab onOpen={setSite} />}
          {tab === 'manuscripts' && <ManuscriptsTab />}
          {tab === 'map' && <IndiaMap onOpenSite={setSite} />}
          {tab === 'share' && <ShareTab />}
        </motion.section>
      </AnimatePresence>

      <AnimatePresence>
        {site && <SiteModal key={site.id} site={site} onClose={closeSite} />}
      </AnimatePresence>
    </main>
  )
}

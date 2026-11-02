import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { X, Volume2, Square, Upload, Download, Wand2, Loader2 } from 'lucide-react'
import BeforeAfter from './BeforeAfter.jsx'
import { API, photos, speak, stopSpeaking } from '../data.js'

const clamp = (n, a, b) => Math.min(b, Math.max(a, n))

const loadImage = (url, cors) =>
  new Promise((resolve, reject) => {
    const img = new Image()
    if (cors) img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })

function Compose({ src }) {
  const stage = useRef(null)
  const dragging = useRef(false)
  const [file, setFile] = useState(null)
  const [me, setMe] = useState(null)
  const [pos, setPos] = useState({ x: 50, y: 68 })
  const [scale, setScale] = useState(38)
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState('')

  function pick(e) {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setMe(URL.createObjectURL(f))
    setNote('')
  }

  function move(e) {
    if (!dragging.current || !stage.current) return
    const r = stage.current.getBoundingClientRect()
    setPos({
      x: clamp(((e.clientX - r.left) / r.width) * 100, 0, 100),
      y: clamp(((e.clientY - r.top) / r.height) * 100, 0, 100)
    })
  }

  async function cutout() {
    setBusy(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch(`${API}/cutout`, { method: 'POST', body: fd })
      if (!res.ok) throw new Error('cutout failed')
      setMe(URL.createObjectURL(await res.blob()))
      setNote('Background removed.')
    } catch {
      setNote('Background removal needs a /cutout endpoint on your backend. Your photo is placed as it is.')
    }
    setBusy(false)
  }

  async function save() {
    try {
      const [bg, fg] = await Promise.all([loadImage(src, true), loadImage(me)])
      const W = 1200
      const H = 900
      const canvas = document.createElement('canvas')
      canvas.width = W
      canvas.height = H
      const ctx = canvas.getContext('2d')
      const k = Math.max(W / bg.naturalWidth, H / bg.naturalHeight)
      const bw = bg.naturalWidth * k
      const bh = bg.naturalHeight * k
      ctx.drawImage(bg, (W - bw) / 2, (H - bh) / 2, bw, bh)
      const fw = (W * scale) / 100
      const fh = (fw * fg.naturalHeight) / fg.naturalWidth
      ctx.drawImage(fg, (W * pos.x) / 100 - fw / 2, (H * pos.y) / 100 - fh / 2, fw, fh)
      const a = document.createElement('a')
      a.href = canvas.toDataURL('image/png')
      a.download = 'me-at-heritage.png'
      a.click()
    } catch {
      setNote('This image source blocks exporting. Try another monument photo.')
    }
  }

  return (
    <div className="compose">
      <div
        className="stage"
        ref={stage}
        onPointerMove={move}
        onPointerUp={() => { dragging.current = false }}
        onPointerCancel={() => { dragging.current = false }}
      >
        <img className="stage-bg" src={src} alt="" draggable={false} />
        {me && (
          <img
            className="stage-me"
            src={me}
            alt="You"
            draggable={false}
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, width: `${scale}%` }}
            onPointerDown={e => {
              dragging.current = true
              e.currentTarget.setPointerCapture(e.pointerId)
            }}
          />
        )}
        {!me && <div className="stage-hint">Add your photo, then drag it anywhere in the scene.</div>}
      </div>

      <div className="compose-tools">
        <label className="outline-btn dark">
          <Upload size={16} /> {me ? 'Change photo' : 'Add your photo'}
          <input type="file" accept="image/*" hidden onChange={pick} />
        </label>
        {me && (
          <>
            <label className="range-label">
              Size
              <input type="range" min="10" max="80" value={scale} onChange={e => setScale(Number(e.target.value))} />
            </label>
            <button className="outline-btn dark" onClick={cutout} disabled={busy}>
              {busy ? <Loader2 size={16} className="spin" /> : <Wand2 size={16} />} Remove background
            </button>
            <button className="primary-btn" onClick={save}>
              <Download size={16} /> Save picture
            </button>
          </>
        )}
      </div>
      {note && <p className="compose-note">{note}</p>}
    </div>
  )
}

export default function SiteModal({ site, onClose }) {
  const [tab, setTab] = useState('about')
  const [speaking, setSpeaking] = useState(false)
  const src = photos[site.img].src

  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      stopSpeaking()
    }
  }, [onClose])

  function listen() {
    if (speaking) {
      stopSpeaking()
      setSpeaking(false)
      return
    }
    setSpeaking(true)
    speak(`${site.name}. ${site.blurb} ${site.architecture}`, () => setSpeaking(false))
  }

  const tabs = [
    ['about', 'About'],
    ['architecture', 'Architecture'],
    ['you', 'Place yourself'],
    ['time', 'Then and now']
  ]

  return (
    <motion.div className="modal-back" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={site.name}
        initial={{ y: 40, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ type: 'spring', damping: 24, stiffness: 260 }}
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close"><X size={20} /></button>

        <div className="modal-hero">
          <img src={src} alt={site.name} onError={e => { e.currentTarget.style.visibility = 'hidden' }} />
          <div>
            <h2>{site.name}</h2>
            <p>{site.city}, {site.state}</p>
            <div className="chips">
              <span className="chip">{site.state}</span>
              <span className="chip">{site.purpose}</span>
              <span className="chip">{site.type}</span>
            </div>
          </div>
        </div>

        <div className="modal-tabs">
          {tabs.map(([id, label]) => (
            <button key={id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>

        <div className="modal-body">
          {tab === 'about' && <p className="lead">{site.blurb}</p>}
          {tab === 'architecture' && <p className="lead">{site.architecture}</p>}
          {(tab === 'about' || tab === 'architecture') && (
            <button className="outline-btn dark" onClick={listen}>
              {speaking ? <Square size={16} /> : <Volume2 size={16} />} {speaking ? 'Stop audio' : 'Listen to this'}
            </button>
          )}
          {tab === 'you' && <Compose src={src} />}
          {tab === 'time' && (
            <>
              <BeforeAfter src={src} thenLabel="Then (demo)" nowLabel="Now" />
              <p className="compose-note">Demo view. Once two verified photographs of this place exist, they will show here as a real then and now pair.</p>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

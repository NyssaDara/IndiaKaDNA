import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Upload, Sparkles, Loader2, CheckCircle2 } from 'lucide-react'
import { API } from '../data.js'

// The backend is expected to answer POST {API}/upload (multipart, field "file") with JSON like:
// { categories: { state, purpose, type }, tags: [...], description: "..." }
// Flat responses ({ state, purpose, type, tags, description }) work too.
function normalise(d) {
  const c = d.categories || d
  return {
    state: c.state,
    purpose: c.purpose,
    type: c.type,
    tags: d.tags || [],
    description: d.description || d.caption || ''
  }
}

export default function Contribute() {
  const [items, setItems] = useState([])

  if (localStorage.getItem('ikd_role') !== 'contributor') {
    return <Navigate to="/login" replace />
  }

  const patch = (id, change) =>
    setItems(prev => prev.map(x => (x.id === id ? { ...x, ...change } : x)))

  function add(fileList) {
    const next = [...fileList]
      .filter(f => f.type.startsWith('image/'))
      .map(f => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file: f,
        url: URL.createObjectURL(f),
        status: 'ready'
      }))
    setItems(prev => [...prev, ...next])
  }

  async function analyse(item) {
    patch(item.id, { status: 'working', error: '' })
    try {
      const fd = new FormData()
      fd.append('file', item.file)
      const res = await fetch(`${API}/upload`, { method: 'POST', body: fd })
      if (!res.ok) throw new Error(`The server replied with status ${res.status}.`)
      patch(item.id, { status: 'done', result: normalise(await res.json()) })
    } catch (e) {
      patch(item.id, { status: 'error', error: e.message || 'Could not reach the backend.' })
    }
  }

  async function analyseAll() {
    for (const item of items.filter(i => i.status !== 'done')) {
      await analyse(item)
    }
  }

  return (
    <main className="dash">
      <header className="dash-head">
        <h1>Add to the archive.</h1>
        <p>Upload photographs. The AI reads each one and sorts it by state, purpose and type.</p>
      </header>

      <label
        className="dropzone"
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); add(e.dataTransfer.files) }}
      >
        <Upload size={34} />
        <strong>Drop photographs here, or choose files</strong>
        <span>JPG, PNG or WEBP. You can add many at once.</span>
        <input type="file" accept="image/*" multiple hidden onChange={e => add(e.target.files)} />
      </label>

      {items.length > 0 && (
        <div className="upload-actions">
          <button className="primary-btn" onClick={analyseAll}>
            <Sparkles size={16} /> Categorise all with AI
          </button>
        </div>
      )}

      <div className="upload-list">
        {items.map(it => (
          <article key={it.id} className="upload-item">
            <img src={it.url} alt={it.file.name} />
            <div>
              <h3>{it.file.name}</h3>

              {it.status === 'ready' && (
                <button className="outline-btn dark" onClick={() => analyse(it)}>
                  <Sparkles size={16} /> Categorise with AI
                </button>
              )}
              {it.status === 'working' && <p className="muted"><Loader2 size={16} className="spin" /> Reading the photograph</p>}
              {it.status === 'error' && (
                <>
                  <p className="err">{it.error} Check that the backend is running and that /upload is the right endpoint.</p>
                  <button className="outline-btn dark" onClick={() => analyse(it)}>Try again</button>
                </>
              )}
              {it.status === 'done' && (
                <>
                  <p className="ok"><CheckCircle2 size={16} /> Sorted by AI</p>
                  <div className="chips">
                    {it.result.state && <span className="chip">{it.result.state}</span>}
                    {it.result.purpose && <span className="chip">{it.result.purpose}</span>}
                    {it.result.type && <span className="chip">{it.result.type}</span>}
                    {it.result.tags.map(t => <span className="chip soft" key={t}>{t}</span>)}
                  </div>
                  {it.result.description && <p className="muted">{it.result.description}</p>}
                </>
              )}
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}

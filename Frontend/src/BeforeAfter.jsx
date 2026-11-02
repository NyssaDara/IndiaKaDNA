import { useState } from 'react'

// Drag the slider to compare an earlier photo with a later one.
// Pass `thenSrc` and `nowSrc` for real pairs. With only `src`, the "then" side is shown in sepia as a demo.
export default function BeforeAfter({ src, thenSrc, nowSrc, thenLabel = 'Then', nowLabel = 'Now' }) {
  const [v, setV] = useState(50)
  const now = nowSrc || src
  const then = thenSrc || src

  return (
    <div className="ba">
      <img className="ba-img" src={now} alt={nowLabel} />
      <div className="ba-then" style={{ clipPath: `inset(0 ${100 - v}% 0 0)` }}>
        <img className={`ba-img ${thenSrc ? '' : 'sepia'}`} src={then} alt={thenLabel} />
      </div>
      <div className="ba-handle" style={{ left: `${v}%` }}><span>‹ ›</span></div>
      <span className="ba-tag left">{thenLabel}</span>
      <span className="ba-tag right">{nowLabel}</span>
      <input
        type="range"
        min="0"
        max="100"
        value={v}
        onChange={e => setV(Number(e.target.value))}
        aria-label="Compare then and now"
      />
    </div>
  )
}

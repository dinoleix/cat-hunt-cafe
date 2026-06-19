import { useRef, useState, useCallback } from 'react'
import Cat from './Cat.jsx'

/**
 * CafeScene — the playable SVG. Background art + hidden cats + hit testing.
 *
 * The scene is level-driven: it receives the level's `Background` component and
 * `cats` array as props, so the same engine renders any level.
 *
 * Tap handling: the pointer position is converted from screen pixels into the
 * SVG's own 1200x800 coordinate space, then tested against each unfound cat's
 * circular hitbox. This keeps the tap tolerance consistent no matter how the
 * scene is scaled or letterboxed on different screens.
 */
export default function CafeScene({
  cats,
  Background,
  foundIds,
  onFind,
  onMiss,
  hintCatId = null,
  className = '',
}) {
  const svgRef = useRef(null)
  // transient visual effects: { id, x, y, type: 'hit' | 'miss' }
  const [fx, setFx] = useState([])

  const addFx = useCallback((x, y, type) => {
    const id = Math.random().toString(36).slice(2)
    setFx((cur) => [...cur, { id, x, y, type }])
    setTimeout(() => setFx((cur) => cur.filter((f) => f.id !== id)), 900)
  }, [])

  const toScene = useCallback((evt) => {
    const svg = svgRef.current
    if (!svg) return null
    const pt = svg.createSVGPoint()
    pt.x = evt.clientX
    pt.y = evt.clientY
    const ctm = svg.getScreenCTM()
    if (!ctm) return null
    return pt.matrixTransform(ctm.inverse())
  }, [])

  const handleTap = useCallback(
    (evt) => {
      const p = toScene(evt)
      if (!p) return
      // nearest unfound cat within its radius wins
      let best = null
      let bestDist = Infinity
      for (const cat of cats) {
        if (foundIds.includes(cat.id)) continue
        const d = Math.hypot(p.x - cat.cx, p.y - cat.cy)
        if (d <= cat.radius && d < bestDist) {
          best = cat
          bestDist = d
        }
      }
      if (best) {
        addFx(best.cx, best.cy - best.scale * 50, 'hit')
        onFind?.(best)
      } else {
        addFx(p.x, p.y, 'miss')
        onMiss?.(p)
      }
    },
    [foundIds, cats, toScene, addFx, onFind, onMiss],
  )

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid meet"
      className={`cursor-pencil select-none touch-manipulation ${className}`}
      onPointerDown={handleTap}
      role="img"
      aria-label="Café scene — tap to find hidden cats"
    >
      <Background />

      {/* Hint highlight ring around an unfound cat */}
      {hintCatId &&
        (() => {
          const c = cats.find((x) => x.id === hintCatId)
          if (!c || foundIds.includes(c.id)) return null
          return (
            <circle
              cx={c.cx}
              cy={c.cy}
              r={c.radius + 26}
              fill="#f5a623"
              className="animate-hint-pulse"
              pointerEvents="none"
            />
          )
        })()}

      {/* The cats */}
      {cats.map((cat) => {
        const found = foundIds.includes(cat.id)
        const s = cat.scale
        const tx = cat.cx - 50 * s
        const ty = cat.cy - 50 * s
        const flip = cat.flip ? -1 : 1
        const transform =
          `translate(${cat.cx} ${cat.cy}) ` +
          `rotate(${cat.rot || 0}) ` +
          `scale(${s * flip} ${s}) ` +
          `translate(-50 -50)`
        return (
          <g key={cat.id} transform={transform} pointerEvents="none">
            <Cat pose={cat.pose} found={found} />
          </g>
        )
      })}

      {/* Transient effects (checkmark / ripple) */}
      {fx.map((f) =>
        f.type === 'hit' ? (
          <g key={f.id} transform={`translate(${f.x} ${f.y})`} pointerEvents="none">
            <g className="animate-check-pop" style={{ transformOrigin: 'center' }}>
              <circle r="18" fill="#3fae6a" />
              <path
                d="M-8 0 L-2 7 L9 -7"
                fill="none"
                stroke="#fff"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>
        ) : (
          <circle
            key={f.id}
            cx={f.x}
            cy={f.y}
            r="16"
            fill="none"
            stroke="#7a736a"
            strokeWidth="3"
            className="animate-ripple-out"
            style={{ transformOrigin: `${f.x}px ${f.y}px` }}
            pointerEvents="none"
          />
        ),
      )}
    </svg>
  )
}

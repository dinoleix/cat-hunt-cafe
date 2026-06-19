/**
 * sceneParts.jsx — small line-art primitives shared by every café level
 * (brick walls, hanging pendant lights). Authored in the 1200 x 800 viewBox.
 */

export const ink = '#1c1a17'

/**
 * Scene bounds. The café furniture + cats are authored in the original
 * 0..1200 × 0..800 band, but the viewBox is taller (ceiling above, floor below)
 * so the room fills a portrait phone instead of letterboxing. Cat coordinates
 * and hitboxes are unaffected — only the visible canvas grew.
 */
export const SCENE = { x: 0, y: -360, w: 1200, h: 1540 }
export const SCENE_TOP = SCENE.y // -360 (ceiling)
export const SCENE_BOTTOM = SCENE.y + SCENE.h // 1180 (front of floor)
export const SCENE_VIEWBOX = `${SCENE.x} ${SCENE.y} ${SCENE.w} ${SCENE.h}`

/** A run of offset bricks for a wall band. */
export function BrickBand({ y, h, rows, cols }) {
  const rh = h / rows
  const cw = 1200 / cols
  const lines = []
  for (let r = 0; r <= rows; r++) {
    const yy = y + r * rh
    lines.push(<line key={`h${r}`} x1="0" y1={yy} x2="1200" y2={yy} />)
  }
  for (let r = 0; r < rows; r++) {
    const offset = r % 2 === 0 ? 0 : cw / 2
    for (let c = 0; c <= cols; c++) {
      const xx = c * cw + offset
      if (xx > 1200) continue
      lines.push(
        <line key={`v${r}-${c}`} x1={xx} y1={y + r * rh} x2={xx} y2={y + (r + 1) * rh} />,
      )
    }
  }
  return <g stroke={ink} strokeWidth="1.4" opacity="0.55">{lines}</g>
}

/**
 * A pendant light. `top` is the ceiling the cord starts from; `len` is the cord
 * length, so the shade can hang at the same visual height even from a tall
 * ceiling. The shade dome sits at `top + len`.
 */
export function PendantLight({ x, top = 0, len = 70 }) {
  const c = top + len
  return (
    <g stroke={ink} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <line x1={x} y1={top} x2={x} y2={c} />
      <path d={`M${x - 34} ${c + 40} Q${x} ${c - 6} ${x + 34} ${c + 40} Z`} />
      <line x1={x - 30} y1={c + 40} x2={x + 30} y2={c + 40} />
      <circle cx={x} cy={c + 48} r="6" />
    </g>
  )
}

/**
 * Fills the extended ceiling + floor around a scene so the taller viewBox reads
 * as one tall room. `floorY` is where the wall meets the floor for that level.
 * Drawn first (under the furniture); pure line art, no interactivity.
 */
export function RoomExtension({ floorY }) {
  const lines = []
  // receding floorboards from the wall down to the front of the room
  for (let i = -2; i <= 14; i++) {
    lines.push(
      <line key={`fb${i}`} x1={i * 100} y1={floorY} x2={i * 100 - 220} y2={SCENE_BOTTOM} />,
    )
  }
  // horizontal floor seams, spaced wider as they come forward (fake perspective)
  const seams = [floorY + 70, floorY + 170, floorY + 300, floorY + 460]
  return (
    <g stroke={ink} strokeLinecap="round">
      {/* paper fills the whole tall canvas */}
      <rect x={SCENE.x} y={SCENE.y} width={SCENE.w} height={SCENE.h} fill="#f7f3ea" stroke="none" />
      {/* high brick wall up to the new ceiling */}
      <BrickBand y={SCENE_TOP} h={floorY - SCENE_TOP} rows={15} cols={14} />
      {/* crown-moulding line just under the ceiling */}
      <line x1="0" y1={SCENE_TOP + 26} x2="1200" y2={SCENE_TOP + 26} strokeWidth="2.5" opacity="0.7" />
      <line x1="0" y1={SCENE_TOP + 34} x2="1200" y2={SCENE_TOP + 34} strokeWidth="1.4" opacity="0.5" />
      {/* floor */}
      <line x1="0" y1={floorY} x2="1200" y2={floorY} strokeWidth="3" />
      <g strokeWidth="1.3" opacity="0.45">
        {lines}
        {seams.map((y) => (
          <line key={y} x1="0" y1={y} x2="1200" y2={y} />
        ))}
      </g>
      {/* a soft rug in the front of the room to anchor the foreground */}
      <ellipse cx="600" cy={floorY + 380} rx="430" ry="96" stroke={ink} strokeWidth="2" opacity="0.6" fill="none" />
      <ellipse cx="600" cy={floorY + 380} rx="392" ry="80" stroke={ink} strokeWidth="1.4" opacity="0.35" fill="none" />
    </g>
  )
}

/**
 * sceneParts.jsx — small line-art primitives shared by every café level
 * (brick walls, hanging pendant lights). Authored in the 1200 x 800 viewBox.
 */

export const ink = '#1c1a17'

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

/** A pendant light hanging from the top of the frame. */
export function PendantLight({ x, top = 0 }) {
  return (
    <g stroke={ink} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <line x1={x} y1={top} x2={x} y2={top + 70} />
      <path d={`M${x - 34} ${top + 110} Q${x} ${top + 64} ${x + 34} ${top + 110} Z`} />
      <line x1={x - 30} y1={top + 110} x2={x + 30} y2={top + 110} />
      <circle cx={x} cy={top + 118} r="6" />
    </g>
  )
}

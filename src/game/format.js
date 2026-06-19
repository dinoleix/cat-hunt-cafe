/** Format milliseconds as M:SS (used everywhere a time is shown). */
export function formatTime(ms) {
  const totalSec = Math.floor((ms || 0) / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

/** Format a date range like "Jun 15 – Jun 21". */
export function formatRange(start, end) {
  const opts = { month: 'short', day: 'numeric' }
  const fmt = (d) => (d ? new Date(d + 'T00:00:00').toLocaleDateString(undefined, opts) : '—')
  return `${fmt(start)} – ${fmt(end)}`
}

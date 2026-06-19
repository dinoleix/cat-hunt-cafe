import { formatTime } from './format.js'

/** Build a CSV string from leaderboard entries and trigger a download. */
export function exportLeaderboardCSV(entries) {
  const header = ['Rank', 'Name', 'Level', 'Cats Found', 'Time', 'Time (ms)', 'Date', 'Prize Won']
  const rows = entries.map((e, i) => [
    i + 1,
    `"${String(e.name).replace(/"/g, '""')}"`,
    e.level || 1,
    e.cats,
    formatTime(e.timeMs),
    e.timeMs,
    new Date(e.createdAt).toISOString(),
    e.prizeWonId ? 'Yes' : '',
  ])
  const csv = [header, ...rows].map((r) => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `cat-hunt-cafe-leaderboard-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

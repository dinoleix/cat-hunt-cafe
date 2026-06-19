import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import PrizeBanner from '../components/PrizeBanner.jsx'
import { store } from '../storage/index.js'
import { formatTime } from '../game/format.js'
import useActivePrize from '../hooks/useActivePrize.js'
import { LEVELS } from '../data/levels.js'

const medal = ['🥇', '🥈', '🥉']

export default function LeaderboardScreen() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const highlightId = state?.highlightId
  const { prize } = useActivePrize()
  const [activeLevel, setActiveLevel] = useState(state?.level || LEVELS[0].id)
  const [rows, setRows] = useState(null)

  useEffect(() => {
    setRows(null)
    let alive = true
    store.getLeaderboard(activeLevel, 10).then((r) => alive && setRows(r))
    return () => {
      alive = false
    }
  }, [activeLevel])

  return (
    <div className="min-h-screen-d scroll-y safe-x bg-ink text-paper">
      <div
        className="mx-auto max-w-md px-5"
        style={{
          paddingTop: 'calc(2rem + env(safe-area-inset-top))',
          paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))',
        }}
      >
        <div className="mb-4 flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
            aria-label="Back"
          >
            ‹
          </button>
          <h1 className="font-display text-3xl font-extrabold text-amber-glow">Leaderboard</h1>
        </div>

        {/* Level tabs */}
        <div className="mb-4 flex gap-2">
          {LEVELS.map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => setActiveLevel(lvl.id)}
              className={`font-display flex-1 rounded-xl px-3 py-2 text-sm font-bold transition ${
                activeLevel === lvl.id
                  ? 'bg-amber-glow text-ink'
                  : 'bg-white/5 text-paper/60 hover:bg-white/10'
              }`}
            >
              Lvl {lvl.id}: {lvl.name}
            </button>
          ))}
        </div>

        {prize && (
          <div className="mb-4">
            <PrizeBanner prize={prize} />
          </div>
        )}

        {rows === null ? (
          <p className="py-12 text-center text-paper/50">Loading…</p>
        ) : rows.length === 0 ? (
          <div className="rounded-2xl bg-white/5 p-8 text-center text-paper/60">
            No scores yet. Be the first! 🐱
          </div>
        ) : (
          <ol className="space-y-2">
            {rows.map((r, i) => {
              const isWinner = !!r.prizeWonId
              const isHighlight = r.id === highlightId
              return (
                <li
                  key={r.id}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
                    isHighlight
                      ? 'border-amber-glow bg-amber-glow/15'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div className="w-8 text-center font-display text-lg font-bold">
                    {medal[i] || i + 1}
                  </div>
                  <div className="flex-1 truncate font-bold">
                    {isWinner && <span className="mr-1">🏆</span>}
                    {r.name}
                    {isHighlight && <span className="ml-2 text-xs text-amber-glow">you</span>}
                  </div>
                  <div className="text-right text-sm">
                    <div className="font-bold text-amber-glow">🐱 {r.cats}</div>
                    <div className="text-paper/60">{formatTime(r.timeMs)}</div>
                  </div>
                </li>
              )
            })}
          </ol>
        )}

        <button
          onClick={() => navigate(`/play/${activeLevel}`)}
          className="font-display mt-6 w-full rounded-2xl bg-amber-glow px-6 py-4 text-xl font-bold text-ink shadow-lg transition active:scale-95 hover:bg-amber-deep hover:text-paper"
        >
          ▶ Play Level {activeLevel}
        </button>
        <Link
          to="/"
          className="mt-3 block text-center text-sm text-paper/50 hover:text-paper"
        >
          Back to menu
        </Link>
      </div>
    </div>
  )
}

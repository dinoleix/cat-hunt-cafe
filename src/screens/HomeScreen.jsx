import { Link, useNavigate } from 'react-router-dom'
import CafeBackground from '../components/CafeBackground.jsx'
import Cat from '../components/Cat.jsx'
import PrizeBanner from '../components/PrizeBanner.jsx'
import SoundToggle from '../components/SoundToggle.jsx'
import useActivePrize from '../hooks/useActivePrize.js'
import { LEVELS } from '../data/levels.js'

export default function HomeScreen() {
  const { prize } = useActivePrize()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen-d scroll-y safe-x relative overflow-x-hidden bg-ink">
      {/* Faded café preview behind everything */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.18]">
        <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
          <CafeBackground />
        </svg>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/70 to-ink" />

      <div
        className="absolute z-10"
        style={{
          right: 'max(1rem, env(safe-area-inset-right))',
          top: 'max(1rem, env(safe-area-inset-top))',
        }}
      >
        <SoundToggle />
      </div>

      <div
        className="relative z-10 mx-auto flex min-h-screen-d max-w-md flex-col items-center justify-center px-6 text-center text-paper"
        style={{
          paddingTop: 'calc(2.5rem + env(safe-area-inset-top))',
          paddingBottom: 'calc(2.5rem + env(safe-area-inset-bottom))',
        }}
      >
        {/* Logo: a hero cat */}
        <div className="mb-2 h-28 w-28">
          <svg viewBox="0 0 100 100" className="h-full w-full">
            <g transform="translate(0 0)">
              <Cat pose="sit" found />
            </g>
          </svg>
        </div>

        <h1 className="font-display text-5xl font-extrabold tracking-tight text-amber-glow drop-shadow">
          Cat Hunt
        </h1>
        <h2 className="font-display -mt-1 text-3xl font-bold text-paper">Café ☕</h2>
        <p className="mt-3 max-w-xs text-paper/70">
          Sneaky cats are hiding in the café. Pick a level and tap to find them
          all as fast as you can!
        </p>

        {prize && (
          <div className="mt-5 w-full">
            <PrizeBanner prize={prize} />
          </div>
        )}

        {/* Level picker */}
        <div className="mt-7 flex w-full flex-col gap-3">
          <div className="text-left text-sm font-bold uppercase tracking-wide text-paper/40">
            Choose a level
          </div>
          {LEVELS.map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => navigate(`/play/${lvl.id}`)}
              className="group flex items-center gap-3 rounded-2xl border-2 border-paper/20 bg-white/5 px-4 py-3.5 text-left transition active:scale-95 hover:border-amber-glow hover:bg-white/10"
            >
              <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-amber-glow font-display text-xl font-extrabold text-ink">
                {lvl.id}
              </span>
              <span className="flex-1">
                <span className="font-display block text-lg font-bold text-paper">
                  {lvl.name}
                </span>
                <span className="block text-sm text-paper/60">
                  {lvl.cats.length} cats · {lvl.blurb}
                </span>
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                  lvl.difficulty === 'Easy'
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-red-500/20 text-red-300'
                }`}
              >
                {lvl.difficulty}
              </span>
            </button>
          ))}
          <Link
            to="/leaderboard"
            className="font-display mt-1 rounded-2xl border-2 border-paper/30 bg-white/5 px-6 py-3.5 text-center text-lg font-bold text-paper transition active:scale-95 hover:bg-white/10"
          >
            🏆 Leaderboard
          </Link>
        </div>

        <Link to="/admin" className="mt-8 text-xs text-paper/40 hover:text-paper/70">
          Admin
        </Link>
      </div>
    </div>
  )
}

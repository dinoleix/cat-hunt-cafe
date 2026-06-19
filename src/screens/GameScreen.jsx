import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CafeScene from '../components/CafeScene.jsx'
import Cat from '../components/Cat.jsx'
import PrizeBanner from '../components/PrizeBanner.jsx'
import SoundToggle from '../components/SoundToggle.jsx'
import useGame from '../hooks/useGame.js'
import useActivePrize from '../hooks/useActivePrize.js'
import { formatTime } from '../game/format.js'
import { getLevel } from '../data/levels.js'

export default function GameScreen() {
  const { levelId } = useParams()
  const level = getLevel(levelId)
  const game = useGame(level.cats)
  const { prize } = useActivePrize()
  const navigate = useNavigate()
  const startedRef = useRef(null)
  const [parallax, setParallax] = useState({ x: 0, y: 0 })

  // (re)start whenever the level changes
  useEffect(() => {
    if (startedRef.current !== level.id) {
      startedRef.current = level.id
      game.start()
    }
  }, [game, level.id])

  // on win, head to the end screen with the result
  useEffect(() => {
    if (game.won) {
      const t = setTimeout(
        () =>
          navigate('/end', {
            state: {
              cats: game.foundIds.length,
              timeMs: game.elapsed,
              level: level.id,
              total: level.cats.length,
            },
          }),
        1100,
      )
      return () => clearTimeout(t)
    }
  }, [game.won, game.foundIds.length, game.elapsed, navigate, level])

  // subtle parallax following the pointer for a sense of depth — mouse only, so
  // it never jiggles the scene under a finger on touch devices.
  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width - 0.5
    const ny = (e.clientY - r.top) / r.height - 0.5
    setParallax({ x: nx * -14, y: ny * -10 })
  }

  return (
    <div className="game-shell relative bg-ink">
      {/* Top HUD — clusters are absolutely pinned so the score can never be
          pushed off-screen by the scaled scene or narrow viewports. Offsets use
          the safe-area insets so nothing hides under a notch / Dynamic Island. */}
      <div
        className="absolute z-20 flex items-center gap-2"
        style={{
          left: 'max(0.75rem, env(safe-area-inset-left))',
          top: 'max(0.75rem, env(safe-area-inset-top))',
        }}
      >
        <button
          onClick={() => navigate('/')}
          className="grid h-10 w-10 place-items-center rounded-full bg-black/40 text-paper backdrop-blur transition hover:bg-black/60"
          aria-label="Back to menu"
        >
          ‹
        </button>
        <div className="hidden rounded-full bg-black/40 px-3 py-2 font-display text-sm font-bold text-paper backdrop-blur sm:block">
          Lvl {level.id} · {level.name}
        </div>
      </div>

      {prize && (
        <div
          className="absolute left-1/2 z-20 hidden -translate-x-1/2 sm:block"
          style={{ top: 'max(0.75rem, env(safe-area-inset-top))' }}
        >
          <PrizeBanner prize={prize} compact />
        </div>
      )}

      <div
        className="absolute z-20 flex items-center gap-2"
        style={{
          right: 'max(0.75rem, env(safe-area-inset-right))',
          top: 'max(0.75rem, env(safe-area-inset-top))',
        }}
      >
        <div className="rounded-full bg-black/40 px-3 py-2 font-display text-sm font-bold text-paper backdrop-blur">
          ⏱ {formatTime(game.elapsed)}
        </div>
        <div className="rounded-full bg-amber-glow px-3 py-2 font-display text-sm font-bold text-ink shadow">
          🐱 {game.foundIds.length}/{game.total}
        </div>
      </div>

      {/* Play area */}
      <div
        className="paper-bg relative flex-1 overflow-hidden"
        onPointerMove={onMove}
        onPointerLeave={() => setParallax({ x: 0, y: 0 })}
      >
        <div
          className="h-full w-full transition-transform duration-200 ease-out"
          style={{ transform: `scale(1.06) translate(${parallax.x}px, ${parallax.y}px)` }}
        >
          <CafeScene
            cats={level.cats}
            Background={level.Background}
            foundIds={game.foundIds}
            onFind={game.onFind}
            onMiss={game.onMiss}
            hintCatId={game.hintCatId}
            className="h-full w-full"
          />
        </div>

        {/* "Found!" toast */}
        {game.lastFound && (
          <div
            key={game.lastFound.id}
            className="animate-float-up pointer-events-none absolute left-1/2 top-20 -translate-x-1/2 rounded-full bg-amber-deep px-4 py-1.5 font-display font-bold text-paper shadow-lg"
          >
            Found one — {game.lastFound.spot}!
          </div>
        )}
      </div>

      {/* Bottom bar: found-cat strip + hint (kept clear of the home indicator) */}
      <div
        className="safe-x z-20 flex items-center gap-3 bg-ink px-3 pt-2.5"
        style={{ paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom))' }}
      >
        <div className="no-scrollbar flex flex-1 items-center gap-1.5 overflow-x-auto">
          {level.cats.map((cat) => {
            const found = game.foundIds.includes(cat.id)
            return (
              <div
                key={cat.id}
                title={found ? cat.spot : 'Still hiding…'}
                className={`grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg border ${
                  found ? 'border-amber-deep bg-amber-glow/20' : 'border-white/15 bg-white/5'
                }`}
              >
                <svg viewBox="0 0 100 100" className="h-7 w-7">
                  {found ? (
                    <Cat pose={cat.pose} found />
                  ) : (
                    <text x="50" y="68" textAnchor="middle" fontSize="44" fill="#fff" opacity="0.25">
                      ?
                    </text>
                  )}
                </svg>
              </div>
            )
          })}
        </div>

        <SoundToggle className="flex-shrink-0" />

        <button
          onClick={game.useHint}
          disabled={game.hintsLeft <= 0}
          className="font-display flex-shrink-0 rounded-xl bg-amber-glow px-4 py-2.5 font-bold text-ink shadow transition active:scale-95 enabled:hover:bg-amber-deep enabled:hover:text-paper disabled:cursor-not-allowed disabled:opacity-40"
        >
          💡 Hint · {game.hintsLeft}
        </button>
      </div>
    </div>
  )
}

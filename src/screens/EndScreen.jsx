import { useState } from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import Confetti from '../components/Confetti.jsx'
import Cat from '../components/Cat.jsx'
import { formatTime } from '../game/format.js'
import { store } from '../storage/index.js'
import { getLevel, nextLevel } from '../data/levels.js'

export default function EndScreen() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  // guard: must arrive with a result
  if (!state || typeof state.cats !== 'number') {
    return <Navigate to="/" replace />
  }

  const { cats, timeMs } = state
  const levelId = state.level || 1
  const level = getLevel(levelId)
  const total = state.total || level.cats.length
  const allFound = cats === total
  const next = nextLevel(levelId)

  const submit = async (e) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    const { entry } = await store.submitScore({
      name: name.trim() || 'Anonymous',
      cats,
      timeMs,
      level: levelId,
    })
    setDone(true)
    navigate('/leaderboard', { state: { highlightId: entry.id, level: levelId }, replace: true })
  }

  const shareText = `I found ${cats}/${total} cats in Cat Hunt Café (${level.name}) in ${formatTime(
    timeMs,
  )}! Can you beat me? 🐱☕`

  const share = async () => {
    const url = window.location.origin
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Cat Hunt Café', text: shareText, url })
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(`${shareText} ${url}`)
      alert('Copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen-d scroll-y safe-x relative overflow-x-hidden bg-ink text-paper">
      <Confetti active={allFound} />

      <div
        className="relative z-10 mx-auto flex min-h-screen-d max-w-md flex-col items-center justify-center px-6 text-center"
        style={{
          paddingTop: 'calc(2.5rem + env(safe-area-inset-top))',
          paddingBottom: 'calc(2.5rem + env(safe-area-inset-bottom))',
        }}
      >
        <div className="h-24 w-24">
          <svg viewBox="0 0 100 100" className="h-full w-full">
            <Cat pose="loaf" found />
          </svg>
        </div>

        <h1 className="font-display mt-2 text-4xl font-extrabold text-amber-glow">
          {allFound ? 'All cats found! 🎉' : 'Time to relax ☕'}
        </h1>
        <p className="mt-1 text-sm text-paper/50">
          Level {level.id} · {level.name}
        </p>

        <div className="mt-6 grid w-full grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/5 p-4">
            <div className="text-3xl font-extrabold text-amber-glow">
              {cats}/{total}
            </div>
            <div className="text-sm text-paper/60">cats found</div>
          </div>
          <div className="rounded-2xl bg-white/5 p-4">
            <div className="text-3xl font-extrabold text-amber-glow">{formatTime(timeMs)}</div>
            <div className="text-sm text-paper/60">your time</div>
          </div>
        </div>

        <form onSubmit={submit} className="mt-6 w-full">
          <label className="mb-1 block text-left text-sm text-paper/70">
            Enter your name for the leaderboard
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            placeholder="Your name"
            autoFocus
            className="w-full rounded-xl border-2 border-white/15 bg-white/5 px-4 py-3 text-lg text-paper outline-none placeholder:text-paper/30 focus:border-amber-glow"
          />
          <div className="mt-1 text-right text-xs text-paper/40">{name.length}/20</div>

          <button
            type="submit"
            disabled={submitting || done}
            className="font-display mt-3 w-full rounded-2xl bg-amber-glow px-6 py-4 text-xl font-bold text-ink shadow-lg transition active:scale-95 enabled:hover:bg-amber-deep enabled:hover:text-paper disabled:opacity-60"
          >
            {submitting ? 'Saving…' : 'Submit Score 🏆'}
          </button>
        </form>

        {/* Next level — highlighted when you cleared the current one */}
        {next && (
          <button
            onClick={() => navigate(`/play/${next.id}`)}
            className="font-display mt-3 w-full rounded-2xl border-2 border-amber-glow bg-amber-glow/15 px-6 py-3.5 text-lg font-bold text-amber-glow transition active:scale-95 hover:bg-amber-glow/25"
          >
            ➡ Next Level: {next.name} ({next.cats.length} cats)
          </button>
        )}

        <div className="mt-3 flex w-full gap-3">
          <button
            onClick={share}
            className="font-display flex-1 rounded-2xl border-2 border-paper/20 bg-white/5 px-4 py-3 font-bold text-paper transition active:scale-95 hover:bg-white/10"
          >
            📤 Share
          </button>
          <button
            onClick={() => navigate(`/play/${levelId}`)}
            className="font-display flex-1 rounded-2xl border-2 border-paper/20 bg-white/5 px-4 py-3 font-bold text-paper transition active:scale-95 hover:bg-white/10"
          >
            🔁 Play Again
          </button>
        </div>
      </div>
    </div>
  )
}

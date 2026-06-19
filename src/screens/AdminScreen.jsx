import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { store, BACKEND } from '../storage/index.js'
import { formatTime, formatRange } from '../game/format.js'
import { exportLeaderboardCSV } from '../game/csv.js'

// Simple gate. For production with Firebase, move writes behind real auth /
// security rules — this password only guards the UI.
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'catcafe'
const AUTH_KEY = 'chc.admin.ok'

const EMPTY_PRIZE = { name: '', description: '', icon: '🍜', startDate: '', endDate: '' }

function Login({ onOk }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, '1')
      onOk()
    } else {
      setErr(true)
    }
  }
  return (
    <div className="min-h-screen-d safe-x grid place-items-center bg-ink px-6 py-10 text-paper">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white/5 p-6">
        <h1 className="font-display mb-1 text-2xl font-extrabold text-amber-glow">Admin Login</h1>
        <p className="mb-4 text-sm text-paper/50">Enter the admin password to continue.</p>
        <input
          type="password"
          value={pw}
          onChange={(e) => {
            setPw(e.target.value)
            setErr(false)
          }}
          placeholder="Password"
          autoFocus
          className="w-full rounded-xl border-2 border-white/15 bg-white/5 px-4 py-3 text-paper outline-none focus:border-amber-glow"
        />
        {err && <p className="mt-2 text-sm text-red-400">Incorrect password.</p>}
        <button className="font-display mt-4 w-full rounded-xl bg-amber-glow px-4 py-3 font-bold text-ink transition hover:bg-amber-deep hover:text-paper">
          Enter
        </button>
        <Link to="/" className="mt-4 block text-center text-sm text-paper/40 hover:text-paper">
          ← Back to game
        </Link>
      </form>
    </div>
  )
}

function Section({ title, children, right }) {
  return (
    <section className="rounded-2xl bg-white/5 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-amber-glow">{title}</h2>
        {right}
      </div>
      {children}
    </section>
  )
}

export default function AdminScreen() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === '1')
  const [prizes, setPrizes] = useState([])
  const [entries, setEntries] = useState([])
  const [draft, setDraft] = useState(EMPTY_PRIZE)
  const [editingId, setEditingId] = useState(null)

  const refresh = async () => {
    setPrizes(await store.getPrizes())
    setEntries(await store.getAllEntries())
  }

  useEffect(() => {
    if (authed) refresh()
  }, [authed])

  if (!authed) return <Login onOk={() => setAuthed(true)} />

  const savePrize = async (e) => {
    e.preventDefault()
    if (!draft.name.trim()) return
    await store.savePrize(editingId ? { ...draft, id: editingId } : draft)
    setDraft(EMPTY_PRIZE)
    setEditingId(null)
    refresh()
  }

  const editPrize = (p) => {
    setEditingId(p.id)
    setDraft({
      name: p.name || '',
      description: p.description || '',
      icon: p.icon || '🎁',
      startDate: p.startDate || '',
      endDate: p.endDate || '',
    })
  }

  const removePrize = async (id) => {
    if (!confirm('Delete this prize?')) return
    await store.deletePrize(id)
    if (editingId === id) {
      setEditingId(null)
      setDraft(EMPTY_PRIZE)
    }
    refresh()
  }

  const pickWinner = async (prizeId, entryId) => {
    await store.setWinner(prizeId, entryId)
    refresh()
  }

  const autoWinner = async (prizeId) => {
    if (entries.length === 0) return alert('No leaderboard entries yet.')
    await store.setWinner(prizeId, entries[0].id) // entries already ranked
    refresh()
  }

  const winnerName = (prize) => {
    if (!prize.winnerEntryId) return null
    return entries.find((e) => e.id === prize.winnerEntryId)?.name || '(removed)'
  }

  return (
    <div className="min-h-screen-d scroll-y safe-x bg-ink text-paper">
      <div
        className="mx-auto max-w-3xl space-y-5 px-5"
        style={{
          paddingTop: 'calc(2rem + env(safe-area-inset-top))',
          paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))',
        }}
      >
        <header className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-amber-glow">Admin Panel</h1>
            <p className="text-xs text-paper/40">
              Backend: <span className="font-mono">{BACKEND}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/"
              className="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold transition hover:bg-white/20"
            >
              Game
            </Link>
            <button
              onClick={() => {
                sessionStorage.removeItem(AUTH_KEY)
                setAuthed(false)
              }}
              className="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold transition hover:bg-white/20"
            >
              Log out
            </button>
          </div>
        </header>

        {/* ---- Prize editor ---- */}
        <Section title={editingId ? 'Edit Prize' : 'Add Prize'}>
          <form onSubmit={savePrize} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="text-sm">
              <span className="text-paper/60">Name</span>
              <input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="Free Ramen"
                className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 outline-none focus:border-amber-glow"
              />
            </label>
            <label className="text-sm">
              <span className="text-paper/60">Icon (emoji)</span>
              <input
                value={draft.icon}
                onChange={(e) => setDraft({ ...draft, icon: e.target.value })}
                placeholder="🍜"
                className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 outline-none focus:border-amber-glow"
              />
            </label>
            <label className="text-sm sm:col-span-2">
              <span className="text-paper/60">Description</span>
              <input
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                placeholder="One free ramen bowl at the counter"
                className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 outline-none focus:border-amber-glow"
              />
            </label>
            <label className="text-sm">
              <span className="text-paper/60">Start date</span>
              <input
                type="date"
                value={draft.startDate}
                onChange={(e) => setDraft({ ...draft, startDate: e.target.value })}
                className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-paper outline-none focus:border-amber-glow [color-scheme:dark]"
              />
            </label>
            <label className="text-sm">
              <span className="text-paper/60">End date</span>
              <input
                type="date"
                value={draft.endDate}
                onChange={(e) => setDraft({ ...draft, endDate: e.target.value })}
                className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-paper outline-none focus:border-amber-glow [color-scheme:dark]"
              />
            </label>
            <div className="flex gap-2 sm:col-span-2">
              <button className="font-display rounded-lg bg-amber-glow px-5 py-2.5 font-bold text-ink transition hover:bg-amber-deep hover:text-paper">
                {editingId ? 'Save changes' : 'Add prize'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null)
                    setDraft(EMPTY_PRIZE)
                  }}
                  className="rounded-lg bg-white/10 px-5 py-2.5 font-bold transition hover:bg-white/20"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </Section>

        {/* ---- Prize list ---- */}
        <Section title="Prizes">
          {prizes.length === 0 ? (
            <p className="text-paper/50">No prizes yet.</p>
          ) : (
            <ul className="space-y-2">
              {prizes.map((p) => (
                <li key={p.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{p.icon}</span>
                    <div className="flex-1">
                      <div className="font-bold">{p.name}</div>
                      <div className="text-xs text-paper/50">
                        {formatRange(p.startDate, p.endDate)}
                        {p.description ? ` · ${p.description}` : ''}
                      </div>
                      {p.winnerEntryId && (
                        <div className="mt-0.5 text-xs text-amber-glow">
                          🏆 Winner: {winnerName(p)}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => autoWinner(p.id)}
                        className="rounded-lg bg-amber-glow/20 px-3 py-1.5 text-xs font-bold text-amber-glow transition hover:bg-amber-glow/30"
                        title="Auto-select current #1"
                      >
                        Auto #1
                      </button>
                      <button
                        onClick={() => editPrize(p)}
                        className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold transition hover:bg-white/20"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removePrize(p.id)}
                        className="rounded-lg bg-red-500/15 px-3 py-1.5 text-xs font-bold text-red-300 transition hover:bg-red-500/25"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Section>

        {/* ---- Leaderboard + winner selection ---- */}
        <Section
          title="Leaderboard"
          right={
            <button
              onClick={() => exportLeaderboardCSV(entries)}
              disabled={entries.length === 0}
              className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-bold transition hover:bg-white/20 disabled:opacity-40"
            >
              ⬇ Export CSV
            </button>
          }
        >
          {entries.length === 0 ? (
            <p className="text-paper/50">No scores yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-paper/50">
                  <tr>
                    <th className="py-2 pr-2">#</th>
                    <th className="py-2 pr-2">Name</th>
                    <th className="py-2 pr-2">Lvl</th>
                    <th className="py-2 pr-2">Cats</th>
                    <th className="py-2 pr-2">Time</th>
                    <th className="py-2 pr-2">Award prize</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e, i) => (
                    <tr key={e.id} className="border-t border-white/10">
                      <td className="py-2 pr-2">{i + 1}</td>
                      <td className="py-2 pr-2 font-bold">
                        {e.prizeWonId && <span className="mr-1">🏆</span>}
                        {e.name}
                      </td>
                      <td className="py-2 pr-2">{e.level || 1}</td>
                      <td className="py-2 pr-2">{e.cats}</td>
                      <td className="py-2 pr-2">{formatTime(e.timeMs)}</td>
                      <td className="py-2 pr-2">
                        {prizes.length === 0 ? (
                          <span className="text-paper/30">no prizes</span>
                        ) : (
                          <select
                            value=""
                            onChange={(ev) => ev.target.value && pickWinner(ev.target.value, e.id)}
                            className="rounded-lg border border-white/15 bg-ink px-2 py-1 text-xs outline-none focus:border-amber-glow"
                          >
                            <option value="">Set as winner…</option>
                            {prizes.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.icon} {p.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>
      </div>
    </div>
  )
}

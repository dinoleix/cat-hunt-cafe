/**
 * localAdapter — a fully working backend on top of localStorage.
 *
 * It implements the exact same async contract the rest of the app consumes, so
 * swapping in Firebase/Supabase later (see firebaseAdapter.js) requires zero
 * changes in the UI. Every method returns a Promise on purpose.
 */

const LB_KEY = 'chc.leaderboard'
const PRIZE_KEY = 'chc.prizes'

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7)

/** Rank: most cats found, then fastest time. */
export function rankEntries(entries) {
  return [...entries].sort((a, b) => {
    if (b.cats !== a.cats) return b.cats - a.cats
    return a.timeMs - b.timeMs
  })
}

const localAdapter = {
  // ---- Leaderboard ----
  // `level` filters to a single level; pass null/undefined for all levels.
  async getLeaderboard(level = null, limit = 10) {
    let all = read(LB_KEY, [])
    if (level != null) all = all.filter((e) => Number(e.level) === Number(level))
    return rankEntries(all).slice(0, limit)
  },

  async getAllEntries() {
    return rankEntries(read(LB_KEY, []))
  },

  async submitScore({ name, cats, timeMs, level = 1 }) {
    const entries = read(LB_KEY, [])
    const entry = {
      id: uid(),
      name: String(name || 'Anonymous').slice(0, 20),
      cats: Number(cats) || 0,
      timeMs: Number(timeMs) || 0,
      level: Number(level) || 1,
      createdAt: Date.now(),
      prizeWonId: null,
    }
    entries.push(entry)
    write(LB_KEY, entries)
    // rank within the same level
    const ranked = rankEntries(entries.filter((e) => e.level === entry.level))
    const rank = ranked.findIndex((e) => e.id === entry.id) + 1
    return { entry, rank }
  },

  // ---- Prizes ----
  async getPrizes() {
    return read(PRIZE_KEY, [])
  },

  async savePrize(prize) {
    const prizes = read(PRIZE_KEY, [])
    if (prize.id) {
      const idx = prizes.findIndex((p) => p.id === prize.id)
      if (idx >= 0) prizes[idx] = { ...prizes[idx], ...prize }
    } else {
      prizes.push({ ...prize, id: uid(), winnerEntryId: null })
    }
    write(PRIZE_KEY, prizes)
    return prizes
  },

  async deletePrize(id) {
    write(
      PRIZE_KEY,
      read(PRIZE_KEY, []).filter((p) => p.id !== id),
    )
    return read(PRIZE_KEY, [])
  },

  /** The prize whose [startDate, endDate] range contains today. */
  async getActivePrize(now = Date.now()) {
    const prizes = read(PRIZE_KEY, [])
    return (
      prizes.find((p) => {
        const start = p.startDate ? new Date(p.startDate + 'T00:00:00').getTime() : -Infinity
        const end = p.endDate ? new Date(p.endDate + 'T23:59:59').getTime() : Infinity
        return now >= start && now <= end
      }) || null
    )
  },

  /** Mark a leaderboard entry as the winner of a prize (also tags the entry). */
  async setWinner(prizeId, entryId) {
    const prizes = read(PRIZE_KEY, [])
    const prize = prizes.find((p) => p.id === prizeId)
    if (prize) {
      prize.winnerEntryId = entryId
      write(PRIZE_KEY, prizes)
    }
    const entries = read(LB_KEY, [])
    // clear any previous winner of this prize, then tag the new one
    entries.forEach((e) => {
      if (e.prizeWonId === prizeId) e.prizeWonId = null
    })
    const entry = entries.find((e) => e.id === entryId)
    if (entry) entry.prizeWonId = prizeId
    write(LB_KEY, entries)
    return { prizes, entries }
  },
}

export default localAdapter

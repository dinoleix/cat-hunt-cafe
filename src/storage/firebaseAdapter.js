/**
 * firebaseAdapter — a ready-to-fill Firestore implementation of the same
 * contract as localAdapter. It is intentionally NOT wired up by default so the
 * app runs with zero config. To switch backends:
 *
 *   1. npm i firebase
 *   2. create a .env.local with your project keys (see .env.example)
 *   3. set  VITE_BACKEND=firebase
 *
 * The collections used:
 *   leaderboard  { name, cats, timeMs, createdAt, prizeWonId }
 *   prizes       { name, description, icon, startDate, endDate, winnerEntryId }
 *
 * Suggested Firestore rules (no auth, public game): allow reads on both
 * collections, allow create on leaderboard, and lock prize writes behind a
 * Cloud Function or the admin SDK in production.
 */
import { rankEntries } from './localAdapter.js'

let dbPromise = null

async function getDb() {
  if (dbPromise) return dbPromise
  dbPromise = (async () => {
    const { initializeApp } = await import('firebase/app')
    const { getFirestore } = await import('firebase/firestore')
    const app = initializeApp({
      apiKey: import.meta.env.VITE_FB_API_KEY,
      authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FB_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FB_SENDER_ID,
      appId: import.meta.env.VITE_FB_APP_ID,
    })
    return getFirestore(app)
  })()
  return dbPromise
}

const firebaseAdapter = {
  async getLeaderboard(level = null, limit = 10) {
    let all = await this.getAllEntries()
    if (level != null) all = all.filter((e) => Number(e.level) === Number(level))
    return all.slice(0, limit)
  },

  async getAllEntries() {
    const db = await getDb()
    const { collection, getDocs } = await import('firebase/firestore')
    const snap = await getDocs(collection(db, 'leaderboard'))
    const entries = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    return rankEntries(entries)
  },

  async submitScore({ name, cats, timeMs, level = 1 }) {
    const db = await getDb()
    const { collection, addDoc } = await import('firebase/firestore')
    const data = {
      name: String(name || 'Anonymous').slice(0, 20),
      cats: Number(cats) || 0,
      timeMs: Number(timeMs) || 0,
      level: Number(level) || 1,
      createdAt: Date.now(),
      prizeWonId: null,
    }
    const ref = await addDoc(collection(db, 'leaderboard'), data)
    const all = (await this.getAllEntries()).filter((e) => e.level === data.level)
    const rank = all.findIndex((e) => e.id === ref.id) + 1
    return { entry: { id: ref.id, ...data }, rank }
  },

  async getPrizes() {
    const db = await getDb()
    const { collection, getDocs } = await import('firebase/firestore')
    const snap = await getDocs(collection(db, 'prizes'))
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  },

  async savePrize(prize) {
    const db = await getDb()
    const { collection, addDoc, doc, updateDoc } = await import('firebase/firestore')
    if (prize.id) {
      const { id, ...rest } = prize
      await updateDoc(doc(db, 'prizes', id), rest)
    } else {
      await addDoc(collection(db, 'prizes'), { ...prize, winnerEntryId: null })
    }
    return this.getPrizes()
  },

  async deletePrize(id) {
    const db = await getDb()
    const { doc, deleteDoc } = await import('firebase/firestore')
    await deleteDoc(doc(db, 'prizes', id))
    return this.getPrizes()
  },

  async getActivePrize(now = Date.now()) {
    const prizes = await this.getPrizes()
    return (
      prizes.find((p) => {
        const start = p.startDate ? new Date(p.startDate + 'T00:00:00').getTime() : -Infinity
        const end = p.endDate ? new Date(p.endDate + 'T23:59:59').getTime() : Infinity
        return now >= start && now <= end
      }) || null
    )
  },

  async setWinner(prizeId, entryId) {
    const db = await getDb()
    const { doc, updateDoc } = await import('firebase/firestore')
    await updateDoc(doc(db, 'prizes', prizeId), { winnerEntryId: entryId })
    await updateDoc(doc(db, 'leaderboard', entryId), { prizeWonId: prizeId })
    return { prizes: await this.getPrizes(), entries: await this.getAllEntries() }
  },
}

export default firebaseAdapter

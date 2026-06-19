/**
 * Storage facade. The whole app imports from here and never touches an adapter
 * directly, so the backend is a single env-var switch.
 *
 *   VITE_BACKEND = "local"     -> localStorage (default, zero config)
 *   VITE_BACKEND = "firebase"  -> Firestore (fill .env.local, npm i firebase)
 *
 * The Firebase adapter is loaded lazily on first use (no top-level await, so it
 * stays compatible with the build's browser target and keeps firebase out of
 * the main bundle when the local backend is selected).
 */
import localAdapter from './localAdapter.js'

const backend = import.meta.env.VITE_BACKEND || 'local'

let adapterPromise = null
function getAdapter() {
  if (backend !== 'firebase') return Promise.resolve(localAdapter)
  if (!adapterPromise) {
    adapterPromise = import('./firebaseAdapter.js').then((m) => m.default)
  }
  return adapterPromise
}

// Every adapter method is async, so we expose a thin proxy that resolves the
// chosen adapter first, then forwards the call. Same contract for the UI.
const METHODS = [
  'getLeaderboard',
  'getAllEntries',
  'submitScore',
  'getPrizes',
  'savePrize',
  'deletePrize',
  'getActivePrize',
  'setWinner',
]

export const store = Object.fromEntries(
  METHODS.map((name) => [name, (...args) => getAdapter().then((a) => a[name](...args))]),
)

export { rankEntries } from './localAdapter.js'
export const BACKEND = backend

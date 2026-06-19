/**
 * Storage facade. The whole app imports from here and never touches an adapter
 * directly, so the backend is a single env-var switch.
 *
 *   VITE_BACKEND = "local"     -> localStorage (default, zero config)
 *   VITE_BACKEND = "firebase"  -> Firestore (fill .env.local, npm i firebase)
 */
import localAdapter from './localAdapter.js'

const backend = import.meta.env.VITE_BACKEND || 'local'

let adapter = localAdapter
if (backend === 'firebase') {
  // dynamic import keeps firebase out of the bundle unless selected
  const mod = await import('./firebaseAdapter.js')
  adapter = mod.default
}

export const store = adapter
export { rankEntries } from './localAdapter.js'
export const BACKEND = backend

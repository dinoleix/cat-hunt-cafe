import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createRequire } from 'node:module'

// The Firebase adapter is dynamically imported only when VITE_BACKEND=firebase.
// If the `firebase` package isn't installed (the default localStorage setup),
// mark it external so the production build still succeeds. Once you run
// `npm i firebase`, this resolves normally and Firebase gets bundled.
const require = createRequire(import.meta.url)
let firebaseInstalled = true
try {
  require.resolve('firebase/app')
} catch {
  firebaseInstalled = false
}

export default defineConfig({
  plugins: [react()],
  // When firebase isn't installed, keep the dev dep-scanner from trying to
  // pre-bundle it (the adapter is only ever loaded when VITE_BACKEND=firebase).
  optimizeDeps: {
    exclude: firebaseInstalled ? [] : ['firebase/app', 'firebase/firestore'],
  },
  build: {
    rollupOptions: {
      external: firebaseInstalled ? [] : [/^firebase(\/.*)?$/],
    },
  },
})

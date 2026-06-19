/**
 * levels.js — the registry of playable levels. Adding a Level 3 later is just
 * one more entry here (a Background component + a cats array).
 */
import CafeBackground from '../components/CafeBackground.jsx'
import CafeBackground2 from '../components/CafeBackground2.jsx'
import { CATS } from './cats.js'
import { CATS2 } from './cats2.js'

export const LEVELS = [
  {
    id: 1,
    name: 'Cozy Café',
    blurb: 'A gentle warm-up',
    difficulty: 'Easy',
    Background: CafeBackground,
    cats: CATS,
  },
  {
    id: 2,
    name: 'Busy Bistro',
    blurb: 'More cats, more clutter',
    difficulty: 'Hard',
    Background: CafeBackground2,
    cats: CATS2,
  },
]

export function getLevel(id) {
  return LEVELS.find((l) => l.id === Number(id)) || LEVELS[0]
}

export function nextLevel(id) {
  const idx = LEVELS.findIndex((l) => l.id === Number(id))
  return idx >= 0 && idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null
}

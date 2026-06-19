import { useState, useRef, useCallback, useEffect } from 'react'
import { sound } from '../game/sound.js'

const MAX_HINTS = 3

/**
 * useGame — the playable game's state machine, driven by a level's `cats` array.
 *
 * Tracks found cats, an up-counting timer (rAF-driven for smoothness), and a
 * limited hint system. Exposes handlers the scene calls on tap. Win is derived
 * from foundIds length.
 */
export default function useGame(cats) {
  const TOTAL_CATS = cats.length
  const [foundIds, setFoundIds] = useState([])
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [hintsLeft, setHintsLeft] = useState(MAX_HINTS)
  const [hintCatId, setHintCatId] = useState(null)
  const [lastFound, setLastFound] = useState(null) // for the toast/strip

  const startRef = useRef(0)
  const rafRef = useRef(0)
  const accRef = useRef(0)

  const won = foundIds.length === TOTAL_CATS

  const tick = useCallback(() => {
    setElapsed(accRef.current + (performance.now() - startRef.current))
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const start = useCallback(() => {
    setFoundIds([])
    setElapsed(0)
    setHintsLeft(MAX_HINTS)
    setHintCatId(null)
    setLastFound(null)
    accRef.current = 0
    startRef.current = performance.now()
    setRunning(true)
    sound.startAmbient()
  }, [])

  // drive / stop the timer loop
  useEffect(() => {
    if (running) {
      startRef.current = performance.now()
      rafRef.current = requestAnimationFrame(tick)
      return () => cancelAnimationFrame(rafRef.current)
    }
  }, [running, tick])

  // stop on win
  useEffect(() => {
    if (won && running) {
      accRef.current = elapsed
      setRunning(false)
      cancelAnimationFrame(rafRef.current)
      sound.stopAmbient()
      sound.fanfare()
    }
  }, [won, running, elapsed])

  const onFind = useCallback(
    (cat) => {
      setFoundIds((cur) => (cur.includes(cat.id) ? cur : [...cur, cat.id]))
      setLastFound(cat)
      sound.chime()
      sound.meow()
      if (hintCatId === cat.id) setHintCatId(null)
    },
    [hintCatId],
  )

  const onMiss = useCallback(() => {
    sound.wrong()
  }, [])

  const useHint = useCallback(() => {
    if (hintsLeft <= 0) return
    const remaining = cats.filter((c) => !foundIds.includes(c.id))
    if (remaining.length === 0) return
    const pick = remaining[Math.floor(Math.random() * remaining.length)]
    setHintCatId(pick.id)
    setHintsLeft((n) => n - 1)
    setTimeout(() => setHintCatId((cur) => (cur === pick.id ? null : cur)), 3200)
  }, [hintsLeft, foundIds, cats])

  return {
    foundIds,
    elapsed,
    running,
    won,
    hintsLeft,
    hintCatId,
    lastFound,
    total: TOTAL_CATS,
    start,
    onFind,
    onMiss,
    useHint,
  }
}

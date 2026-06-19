import { useState, useEffect } from 'react'
import { store } from '../storage/index.js'

/** Loads the currently-active prize (date range contains today), if any. */
export default function useActivePrize() {
  const [prize, setPrize] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let alive = true
    store
      .getActivePrize()
      .then((p) => alive && setPrize(p))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])
  return { prize, loading }
}

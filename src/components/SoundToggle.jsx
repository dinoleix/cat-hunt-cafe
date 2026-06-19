import { useState } from 'react'
import { sound } from '../game/sound.js'

/** A small mute/unmute pill, used on the game bar and menus. */
export default function SoundToggle({ className = '' }) {
  const [muted, setMuted] = useState(sound.muted)
  return (
    <button
      onClick={() => setMuted(sound.toggleMute())}
      aria-label={muted ? 'Unmute' : 'Mute'}
      className={`grid h-10 w-10 place-items-center rounded-full bg-white/10 text-lg transition hover:bg-white/20 ${className}`}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  )
}

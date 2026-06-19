/**
 * sound.js — all audio is synthesized with the Web Audio API so the game ships
 * with no binary asset files. A single shared AudioContext is lazily created on
 * first user gesture (browsers block audio before that).
 *
 * Exposes: chime() on correct, meow() on discovery, wrong() on a miss, and a
 * gentle ambient café loop you can toggle. Mute state is persisted.
 */

let ctx = null
let master = null
let ambientNodes = null

const state = {
  muted: JSON.parse(localStorage.getItem('chc.muted') || 'false'),
  ambientOn: false,
}

function ac() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)()
    master = ctx.createGain()
    master.gain.value = state.muted ? 0 : 0.8
    master.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone({ freq, type = 'sine', dur = 0.25, gain = 0.2, slideTo = null, delay = 0 }) {
  const c = ac()
  const t0 = c.currentTime + delay
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g)
  g.connect(master)
  osc.start(t0)
  osc.stop(t0 + dur + 0.05)
}

export const sound = {
  get muted() {
    return state.muted
  },

  toggleMute() {
    state.muted = !state.muted
    localStorage.setItem('chc.muted', JSON.stringify(state.muted))
    if (master) master.gain.value = state.muted ? 0 : 0.8
    return state.muted
  },

  // Soft two-note chime on a correct tap.
  chime() {
    if (state.muted) return
    tone({ freq: 880, type: 'triangle', dur: 0.18, gain: 0.18 })
    tone({ freq: 1320, type: 'triangle', dur: 0.3, gain: 0.14, delay: 0.08 })
  },

  // A little synthesized "meow" — a pitch glide up then down.
  meow() {
    if (state.muted) return
    tone({ freq: 520, type: 'sawtooth', dur: 0.16, gain: 0.1, slideTo: 760 })
    tone({ freq: 760, type: 'sawtooth', dur: 0.22, gain: 0.09, slideTo: 430, delay: 0.15 })
  },

  // Gentle low thud on a wrong tap (no harshness — there's no penalty).
  wrong() {
    if (state.muted) return
    tone({ freq: 180, type: 'sine', dur: 0.18, gain: 0.12, slideTo: 120 })
  },

  // Celebration arpeggio for the win screen.
  fanfare() {
    if (state.muted) return
    ;[523, 659, 784, 1047].forEach((f, i) =>
      tone({ freq: f, type: 'triangle', dur: 0.4, gain: 0.16, delay: i * 0.12 }),
    )
  },

  startAmbient() {
    if (ambientNodes || state.muted) return
    const c = ac()
    // soft filtered noise = distant café murmur
    const bufferSize = 2 * c.sampleRate
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5
    const noise = c.createBufferSource()
    noise.buffer = buffer
    noise.loop = true
    const filter = c.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 480
    const g = c.createGain()
    g.gain.value = 0.04
    noise.connect(filter)
    filter.connect(g)
    g.connect(master)
    noise.start()
    ambientNodes = { noise, g }
    state.ambientOn = true
  },

  stopAmbient() {
    if (!ambientNodes) return
    try {
      ambientNodes.noise.stop()
    } catch {
      /* already stopped */
    }
    ambientNodes = null
    state.ambientOn = false
  },

  get ambientOn() {
    return state.ambientOn
  },
}

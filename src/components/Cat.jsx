/**
 * Cat.jsx — a single hidden cat drawn as black-and-white line art.
 *
 * Each pose is authored inside a local 0..100 x 0..100 box so the parent
 * scene can place it with a simple translate + scale. When `found` is true the
 * cat fills with the warm amber glow described in the brief.
 *
 * Strokes use `currentColor`; the wrapping <g> sets color so found/unfound
 * states are a one-line swap.
 */

// Each pose returns the inner line-art (drawn around a 0..100 box).
const POSES = {
  // Classic sitting cat, tail curled to the side.
  sit: (
    <>
      <path d="M50 92 C30 92 26 70 30 56 C33 44 40 38 50 38 C60 38 67 44 70 56 C74 70 70 92 50 92 Z" />
      <path d="M34 50 L28 30 L42 44 Z" />
      <path d="M66 50 L72 30 L58 44 Z" />
      <circle cx="50" cy="56" r="16" />
      <circle cx="44" cy="54" r="2" fill="currentColor" stroke="none" />
      <circle cx="56" cy="54" r="2" fill="currentColor" stroke="none" />
      <path d="M47 60 Q50 63 53 60" />
      <path d="M68 88 C84 84 86 70 78 66" />
    </>
  ),
  // Loaf — a cat tucked into a bread-loaf shape.
  loaf: (
    <>
      <path d="M20 80 C20 56 34 48 50 48 C66 48 80 56 80 80 Z" />
      <path d="M30 56 L26 40 L40 52 Z" />
      <path d="M70 56 L74 40 L60 52 Z" />
      <circle cx="42" cy="60" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="58" cy="60" r="1.8" fill="currentColor" stroke="none" />
      <path d="M48 65 Q50 68 52 65" />
      <path d="M50 64 L50 67" />
    </>
  ),
  // Curled asleep, tail wrapped around.
  curl: (
    <>
      <circle cx="50" cy="55" r="32" />
      <path d="M28 40 L24 26 L38 36 Z" />
      <path d="M30 70 C50 88 78 80 80 58 C82 44 72 40 66 44" />
      <path d="M40 50 Q44 48 48 50" />
      <path d="M40 50 L40 52" />
    </>
  ),
  // Peeking over an edge — just ears, eyes and paws showing.
  peek: (
    <>
      <path d="M28 64 C28 44 40 36 50 36 C60 36 72 44 72 64" />
      <path d="M34 44 L30 28 L44 40 Z" />
      <path d="M66 44 L70 28 L56 40 Z" />
      <circle cx="43" cy="52" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="57" cy="52" r="2.2" fill="currentColor" stroke="none" />
      <path d="M48 57 Q50 60 52 57" />
      <path d="M30 64 L70 64" />
      <path d="M40 64 L40 70 M48 64 L48 70 M56 64 L56 70" />
    </>
  ),
  // Standing, walking, tail up.
  stand: (
    <>
      <path d="M22 56 C22 46 30 42 44 42 L66 42 C76 42 80 48 80 56 L80 64 L22 64 Z" />
      <circle cx="78" cy="44" r="11" />
      <path d="M71 36 L68 26 L78 34 Z" />
      <path d="M86 36 L90 26 L82 34 Z" />
      <circle cx="80" cy="44" r="1.6" fill="currentColor" stroke="none" />
      <path d="M26 64 L26 76 M38 64 L38 76 M58 64 L58 76 M70 64 L70 76" />
      <path d="M22 56 C8 54 6 38 16 34" />
    </>
  ),
  // Big stretch / arch.
  stretch: (
    <>
      <path d="M18 72 C18 52 34 40 52 44 C70 48 82 56 86 64" />
      <path d="M18 72 L18 84 M30 70 L30 84" />
      <path d="M86 64 L88 76 M78 62 L80 76" />
      <circle cx="88" cy="58" r="9" />
      <path d="M82 51 L80 42 L88 49 Z" />
      <path d="M94 51 L98 42 L90 49 Z" />
      <path d="M14 70 C4 64 6 52 14 50" />
    </>
  ),
  // Just the face/head poking out (smallest, hardest).
  face: (
    <>
      <circle cx="50" cy="56" r="22" />
      <path d="M33 44 L27 24 L45 38 Z" />
      <path d="M67 44 L73 24 L55 38 Z" />
      <circle cx="42" cy="54" r="2.4" fill="currentColor" stroke="none" />
      <circle cx="58" cy="54" r="2.4" fill="currentColor" stroke="none" />
      <path d="M47 62 Q50 66 53 62" />
      <path d="M50 60 L50 62" />
      <path d="M30 58 L20 56 M30 62 L20 63" />
      <path d="M70 58 L80 56 M70 62 L80 63" />
    </>
  ),
}

export default function Cat({ pose = 'sit', found = false, hinted = false }) {
  const inner = POSES[pose] || POSES.sit
  return (
    <g
      style={{ color: found ? '#e07b00' : '#1c1a17' }}
      className={[
        'transition-colors duration-300',
        found ? 'animate-cat-pop' : '',
      ].join(' ')}
    >
      <g
        fill={found ? '#f5a623' : 'none'}
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-300"
        style={{ filter: found ? 'drop-shadow(0 0 6px rgba(245,166,35,0.85))' : 'none' }}
      >
        {inner}
      </g>
    </g>
  )
}

export const CAT_POSES = Object.keys(POSES)

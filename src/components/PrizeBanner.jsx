import { formatRange } from '../game/format.js'

/** The "this week's prize" banner shown on home & game screens. */
export default function PrizeBanner({ prize, compact = false }) {
  if (!prize) return null
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border-2 border-amber-deep bg-amber-glow/95 text-ink shadow-lg ${
        compact ? 'px-3 py-1.5 text-sm' : 'px-4 py-3'
      }`}
    >
      <span className={compact ? 'text-xl' : 'text-3xl'}>{prize.icon || '🎁'}</span>
      <div className="leading-tight">
        <div className="font-display font-bold">
          This week's prize: {prize.name}
        </div>
        {!compact && (
          <div className="text-sm opacity-80">
            {prize.description ? prize.description + ' · ' : ''}
            Top scorer wins! ({formatRange(prize.startDate, prize.endDate)})
          </div>
        )}
      </div>
    </div>
  )
}

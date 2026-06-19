/**
 * CafeBackground2.jsx — Level 2: a busier two-storey bistro.
 *
 * Same 1200 x 800 viewBox as Level 1 but far more clutter — double shelving,
 * a long counter with two machines, a window onto the street, a reading nook,
 * a cat tree, hanging plants, a chandelier and lots of little props — so the
 * 20 hidden cats have many more places to blend in.
 */
import { ink, BrickBand, PendantLight } from './sceneParts.jsx'

// A shelf full of books packed at varying heights.
function BookRow({ x, y, n, w = 16, h = 52, gap = 3 }) {
  return (
    <g strokeWidth="2">
      {Array.from({ length: n }).map((_, i) => {
        const bw = w + (i % 3) * 4
        const bh = h - (i % 4) * 6
        const bx = x + i * (w + gap)
        return <rect key={i} x={bx} y={y + (h - bh)} width={bw} height={bh} />
      })}
    </g>
  )
}

function Jar({ x, y, w = 36, h = 50, lid = true }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} />
      {lid && <rect x={x + w * 0.15} y={y - 9} width={w * 0.7} height={11} rx={3} />}
      <line x1={x} y1={y + h * 0.4} x2={x + w} y2={y + h * 0.4} opacity="0.5" />
    </g>
  )
}

function Mug({ x, y, s = 1 }) {
  return (
    <g>
      <path d={`M${x} ${y} L${x + 4 * s} ${y + 22 * s} L${x + 26 * s} ${y + 22 * s} L${x + 30 * s} ${y} Z`} />
      <path d={`M${x + 30 * s} ${y + 6 * s} Q${x + 44 * s} ${y + 6 * s} ${x + 44 * s} ${y + 14 * s} Q${x + 44 * s} ${y + 20 * s} ${x + 30 * s} ${y + 18 * s}`} />
    </g>
  )
}

function Chair({ x, y }) {
  return (
    <g>
      <rect x={x} y={y - 46} width="34" height="46" rx="4" />
      <line x1={x + 4} y1={y} x2={x + 4} y2={y + 30} />
      <line x1={x + 30} y1={y} x2={x + 30} y2={y + 30} />
    </g>
  )
}

function Customer({ x, y, r = 28 }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} />
      <path d={`M${x - r} ${y + r + 30} C${x - r} ${y + r} ${x + r} ${y + r} ${x + r} ${y + r + 30} L${x + r} ${y + r + 70} L${x - r} ${y + r + 70} Z`} />
    </g>
  )
}

function HangingPlant({ x, top = 0 }) {
  return (
    <g>
      <line x1={x} y1={top} x2={x} y2={top + 50} strokeWidth="1.6" />
      <path d={`M${x - 22} ${top + 70} Q${x} ${top + 50} ${x + 22} ${top + 70} L${x + 16} ${top + 88} L${x - 16} ${top + 88} Z`} />
      <path d={`M${x - 14} ${top + 88} C${x - 24} ${top + 120} ${x - 18} ${top + 130} ${x - 16} ${top + 140} M${x + 6} ${top + 88} C${x + 18} ${top + 124} ${x + 10} ${top + 136} ${x + 8} ${top + 148} M${x - 2} ${top + 88} C${x - 4} ${top + 124} ${x - 2} ${top + 134} ${x} ${top + 146}`} />
    </g>
  )
}

export default function CafeBackground2() {
  return (
    <g fill="none" stroke={ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {/* ---- Walls & floor ---- */}
      <rect x="0" y="0" width="1200" height="800" fill="#f7f3ea" stroke="none" />
      <BrickBand y={0} h={540} rows={10} cols={16} />
      <line x1="0" y1="540" x2="1200" y2="540" strokeWidth="3" />
      {/* herringbone-ish floor */}
      <g stroke={ink} strokeWidth="1.3" opacity="0.45">
        {Array.from({ length: 16 }).map((_, i) => (
          <line key={`fl${i}`} x1={i * 80} y1="540" x2={i * 80 - 80} y2="800" />
        ))}
        <line x1="0" y1="620" x2="1200" y2="620" />
        <line x1="0" y1="700" x2="1200" y2="700" />
        <line x1="0" y1="770" x2="1200" y2="770" />
      </g>
      {/* floor rug under the front tables */}
      <ellipse cx="600" cy="720" rx="300" ry="60" opacity="0.7" />
      <ellipse cx="600" cy="720" rx="270" ry="50" opacity="0.4" />

      {/* ---- Ceiling: chandelier + pendants + hanging plants ---- */}
      <PendantLight x={250} />
      <PendantLight x={980} />
      <g stroke={ink} strokeWidth="2.5">
        {/* central chandelier */}
        <line x1="600" y1="0" x2="600" y2="40" />
        <path d="M520 70 Q600 40 680 70" />
        <line x1="520" y1="70" x2="520" y2="86" />
        <line x1="560" y1="58" x2="560" y2="74" />
        <line x1="600" y1="52" x2="600" y2="68" />
        <line x1="640" y1="58" x2="640" y2="74" />
        <line x1="680" y1="70" x2="680" y2="86" />
        {[520, 560, 600, 640, 680].map((x, i) => (
          <circle key={i} cx={x} cy={i === 2 ? 74 : i === 0 || i === 4 ? 92 : 80} r="6" />
        ))}
      </g>
      <HangingPlant x={430} />
      <HangingPlant x={760} />

      {/* ---- Far-left: tall double bookshelf packed with stuff ---- */}
      <g>
        <rect x="24" y="80" width="240" height="460" rx="6" />
        {[164, 248, 332, 416, 478].map((y) => (
          <line key={y} x1="24" y1={y} x2="264" y2={y} />
        ))}
        <line x1="144" y1="80" x2="144" y2="540" opacity="0.5" />
        {/* shelf 1: books */}
        <BookRow x={36} y={106} n={6} />
        <BookRow x={156} y={110} n={5} />
        {/* shelf 2: jars + cups */}
        <Jar x={40} y={196} />
        <Jar x={92} y={200} w={30} h={46} />
        <Mug x={158} y={206} s={0.9} />
        <Jar x={210} y={196} w={40} />
        {/* shelf 3: books + a teapot */}
        <BookRow x={36} y={282} n={5} />
        <path d="M160 332 L160 300 Q160 292 172 292 L210 292 Q222 292 222 300 L222 332 Z" />
        <path d="M222 304 Q240 304 240 318 Q240 330 222 328" />
        <path d="M176 292 Q186 280 196 292" />
        {/* shelf 4: jars + plant */}
        <Jar x={40} y={364} w={34} />
        <Jar x={92} y={368} w={30} h={44} />
        <g>
          <path d="M168 416 L176 380 L222 380 L230 416 Z" />
          <path d="M199 380 C186 352 174 348 178 330 M199 380 C214 354 228 352 224 332 M199 380 C199 354 199 344 199 332" />
        </g>
        {/* shelf 5: stacked books lying down + a cup */}
        <g strokeWidth="2">
          <rect x="40" y="452" width="90" height="10" />
          <rect x="46" y="442" width="80" height="10" />
          <rect x="52" y="432" width="70" height="10" />
        </g>
        <Mug x={170} y={446} s={0.9} />
      </g>

      {/* ---- Chalkboard menu on the wall ---- */}
      <g>
        <rect x="300" y="110" width="190" height="150" rx="6" />
        <rect x="312" y="122" width="166" height="126" rx="3" opacity="0.5" />
        <g strokeWidth="1.6" opacity="0.7">
          <line x1="330" y1="146" x2="460" y2="146" />
          <line x1="330" y1="170" x2="440" y2="170" />
          <line x1="330" y1="194" x2="452" y2="194" />
          <line x1="330" y1="218" x2="420" y2="218" />
        </g>
      </g>

      {/* ---- Picture frame cluster ---- */}
      <g>
        <rect x="300" y="280" width="70" height="56" rx="3" />
        <path d="M308 330 L328 308 L342 320 L356 300 L364 330 Z" />
        <rect x="386" y="280" width="56" height="70" rx="3" />
        <circle cx="414" cy="312" r="14" />
      </g>

      {/* ---- Long central counter with two machines ---- */}
      <g>
        <rect x="470" y="360" width="380" height="180" rx="6" />
        <line x1="470" y1="392" x2="850" y2="392" />
        <g strokeWidth="1.5" opacity="0.55">
          <line x1="540" y1="392" x2="540" y2="540" />
          <line x1="620" y1="392" x2="620" y2="540" />
          <line x1="700" y1="392" x2="700" y2="540" />
          <line x1="780" y1="392" x2="780" y2="540" />
        </g>
        {/* espresso machine 1 */}
        <g>
          <rect x="486" y="286" width="104" height="74" rx="6" />
          <rect x="500" y="270" width="76" height="20" rx="4" />
          <circle cx="512" cy="308" r="8" />
          <circle cx="562" cy="308" r="8" />
          <rect x="528" y="338" width="20" height="10" />
        </g>
        {/* cake stand */}
        <g>
          <ellipse cx="660" cy="320" rx="44" ry="9" />
          <line x1="660" y1="320" x2="660" y2="344" />
          <ellipse cx="660" cy="346" rx="20" ry="5" />
          <path d="M624 318 C624 300 696 300 696 318" />
          <path d="M636 318 L648 300 L660 318 M660 318 L672 300 L684 318" opacity="0.7" />
        </g>
        {/* register + cup stacks */}
        <g>
          <rect x="734" y="318" width="48" height="42" rx="4" />
          <rect x="742" y="300" width="32" height="18" rx="3" />
          <path d="M800 332 L804 360 L828 360 L832 332 Z" />
          <ellipse cx="816" cy="332" rx="16" ry="4" />
        </g>
        {/* bar stools in front */}
        {[520, 600, 680, 760].map((x) => (
          <g key={x}>
            <ellipse cx={x} cy="582" rx="26" ry="8" />
            <line x1={x - 16} y1="588" x2={x - 20} y2="650" />
            <line x1={x + 16} y1="588" x2={x + 20} y2="650" />
          </g>
        ))}
      </g>

      {/* ---- Bottle shelf right of counter ---- */}
      <g>
        <rect x="868" y="300" width="120" height="120" rx="4" />
        <line x1="868" y1="360" x2="988" y2="360" />
        {[882, 910, 938, 966].map((x) => (
          <g key={x}>
            <rect x={x} y={318} width={16} height={40} rx={4} />
            <rect x={x + 3} y={310} width={10} height={10} />
          </g>
        ))}
        {[896, 928, 960].map((x) => (
          <Jar key={x} x={x} y={372} w={22} h={40} lid={false} />
        ))}
      </g>

      {/* ---- Big window onto the street ---- */}
      <g>
        <rect x="1000" y="120" width="176" height="250" rx="6" />
        <line x1="1088" y1="120" x2="1088" y2="370" />
        <line x1="1000" y1="245" x2="1176" y2="245" />
        {/* street: little buildings */}
        <g strokeWidth="1.6" opacity="0.6">
          <rect x="1014" y="170" width="28" height="60" />
          <rect x="1050" y="150" width="30" height="80" />
          <rect x="1100" y="180" width="26" height="50" />
          <rect x="1136" y="160" width="28" height="70" />
          <line x1="1020" y1="186" x2="1036" y2="186" />
          <line x1="1056" y1="170" x2="1074" y2="170" />
        </g>
        {/* windowsill plants */}
        <Jar x={1018} y={372} w={34} h={28} lid={false} />
        <path d="M1024 372 C1014 350 1008 350 1012 332 M1040 372 C1052 350 1060 352 1056 334" />
        <Jar x={1120} y={372} w={34} h={28} lid={false} />
        <path d="M1126 372 C1118 352 1112 352 1116 336 M1142 372 C1152 352 1158 354 1154 338" />
      </g>

      {/* ---- Reading-nook bench under window ---- */}
      <g>
        <rect x="1000" y="430" width="180" height="60" rx="8" />
        <rect x="1008" y="404" width="50" height="30" rx="6" />
        <rect x="1066" y="404" width="50" height="30" rx="6" />
        <line x1="1010" y1="490" x2="1010" y2="540" />
        <line x1="1170" y1="490" x2="1170" y2="540" />
      </g>

      {/* ---- A cat tree (great hiding spot) ---- */}
      <g>
        <rect x="300" y="700" width="120" height="20" rx="4" />
        <rect x="348" y="470" width="24" height="240" />
        <rect x="300" y="556" width="90" height="22" rx="6" />
        <circle cx="360" cy="466" r="34" />
        <rect x="392" y="600" width="70" height="22" rx="6" />
        <line x1="360" y1="500" x2="360" y2="556" opacity="0.5" />
      </g>

      {/* ---- Front-left round table, two customers ---- */}
      <g>
        <ellipse cx="180" cy="650" rx="120" ry="30" />
        <line x1="180" y1="678" x2="180" y2="760" />
        <path d="M150 760 L210 760" />
        <Mug x={140} y={624} />
        <Mug x={210} y={628} s={0.9} />
        <path d="M180 624 L196 624 L194 612 Z" />
        <Customer x={90} y={556} r={26} />
        <Chair x={250} y={690} />
      </g>

      {/* ---- Front-right table with laptop + customer ---- */}
      <g>
        <ellipse cx="960" cy="690" rx="150" ry="34" />
        <line x1="960" y1="724" x2="960" y2="796" />
        <path d="M912 796 L1008 796" />
        <path d="M906 672 L984 672 L990 700 L900 700 Z" />
        <rect x="916" y="652" width="58" height="22" rx="2" />
        <Mug x={1010} y={664} />
        <Customer x={1080} y={600} r={28} />
        <Chair x={1040} y={730} />
      </g>

      {/* ---- Center small two-top + chairs ---- */}
      <g>
        <ellipse cx="600" cy="700" rx="70" ry="18" />
        <line x1="600" y1="712" x2="600" y2="770" />
        <path d="M576 770 L624 770" />
        <Mug x={566} y={680} s={0.85} />
        <Chair x={520} y={736} />
        <Chair x={648} y={736} />
      </g>

      {/* ---- Coat rack far right ---- */}
      <g>
        <line x1="1180" y1="560" x2="1180" y2="760" />
        <path d="M1180 760 L1160 780 M1180 760 L1200 780" />
        <path d="M1180 576 L1162 588 M1180 590 L1198 602" />
        <path d="M1162 588 C1150 596 1150 620 1166 624 L1166 596" />
      </g>

      {/* ---- Stack of books on the floor ---- */}
      <g strokeWidth="2">
        <rect x="40" y="724" width="86" height="14" />
        <rect x="48" y="710" width="78" height="14" />
        <rect x="44" y="696" width="70" height="14" />
        <Mug x={70} y={668} s={0.8} />
      </g>
    </g>
  )
}

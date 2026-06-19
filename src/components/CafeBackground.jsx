/**
 * CafeBackground.jsx — Level 1: the cozy café line art.
 *
 * Authored in the scene's 1200 x 800 viewBox. Pure decoration: it carries no
 * interactivity. Hidden cats and hitboxes are layered on top by CafeScene.
 * Everything is line work (no fills) so it reads like a coloring-book page.
 */
import { ink, BrickBand, PendantLight } from './sceneParts.jsx'

export default function CafeBackground() {
  return (
    <g fill="none" stroke={ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {/* ---- Walls & floor ---- */}
      <rect x="0" y="0" width="1200" height="800" fill="#f7f3ea" stroke="none" />
      <BrickBand y={0} h={560} rows={9} cols={14} />
      {/* floor line + tiles */}
      <line x1="0" y1="560" x2="1200" y2="560" strokeWidth="3" />
      <g stroke={ink} strokeWidth="1.4" opacity="0.5">
        {Array.from({ length: 13 }).map((_, i) => (
          <line key={i} x1={i * 100} y1="560" x2={i * 100 - 60} y2="800" />
        ))}
        <line x1="0" y1="650" x2="1200" y2="650" />
        <line x1="0" y1="730" x2="1200" y2="730" />
      </g>

      {/* ---- Pendant lights ---- */}
      <PendantLight x={300} />
      <PendantLight x={620} />
      <PendantLight x={920} />

      {/* ---- Left bookshelf with jars & books ---- */}
      <g>
        <rect x="40" y="120" width="250" height="430" rx="6" />
        {[200, 290, 380, 470].map((y) => (
          <line key={y} x1="40" y1={y} x2="290" y2={y} />
        ))}
        {/* books on top shelf */}
        <g strokeWidth="2">
          {[60, 80, 100, 120, 140, 160, 188, 210, 232].map((x, i) => (
            <rect key={x} x={x} y={150 + (i % 3) * 4} width={i % 4 === 0 ? 26 : 18} height={50 - (i % 3) * 4} />
          ))}
        </g>
        {/* jars on second shelf */}
        <g>
          <rect x="70" y="225" width="44" height="60" rx="8" />
          <rect x="78" y="216" width="28" height="12" rx="3" />
          <rect x="140" y="232" width="38" height="53" rx="18" />
          <rect x="205" y="228" width="50" height="57" rx="6" />
          <line x1="205" y1="248" x2="255" y2="248" />
        </g>
        {/* more books + a mug on third shelf */}
        <g strokeWidth="2">
          {[58, 76, 94, 112].map((x) => (
            <rect key={x} x={x} y="320" width="16" height="58" />
          ))}
          <path d="M150 372 L150 336 Q150 330 158 330 L196 330 Q204 330 204 336 L204 372 Z" />
          <path d="M204 340 Q220 340 220 352 Q220 364 204 364" />
        </g>
        {/* potted plant bottom shelf */}
        <g>
          <path d="M84 470 L96 510 L150 510 L162 470 Z" />
          <path d="M123 470 C110 440 96 432 100 410 M123 470 C136 442 152 436 150 414 M123 470 C123 440 123 430 123 416" />
        </g>
      </g>

      {/* ---- Coffee bar counter (center) ---- */}
      <g>
        <rect x="430" y="360" width="360" height="200" rx="6" />
        <line x1="430" y1="392" x2="790" y2="392" />
        {/* wood panel lines */}
        <g strokeWidth="1.6" opacity="0.6">
          <line x1="500" y1="392" x2="500" y2="560" />
          <line x1="600" y1="392" x2="600" y2="560" />
          <line x1="700" y1="392" x2="700" y2="560" />
        </g>
        {/* espresso machine */}
        <g>
          <rect x="470" y="280" width="120" height="86" rx="8" />
          <rect x="486" y="262" width="88" height="22" rx="4" />
          <circle cx="500" cy="306" r="9" />
          <circle cx="560" cy="306" r="9" />
          <path d="M496 330 L496 348 L512 348" />
          <path d="M556 330 L556 348 L540 348" />
          <rect x="520" y="338" width="20" height="10" />
        </g>
        {/* cup stack + cups */}
        <g>
          <path d="M640 330 L644 366 L676 366 L680 330 Z" />
          <path d="M680 340 Q694 340 694 352 Q694 362 680 360" />
          <ellipse cx="660" cy="330" rx="20" ry="5" />
          <path d="M720 344 L724 366 L748 366 L752 344 Z" />
          <ellipse cx="736" cy="344" rx="16" ry="4" />
        </g>
      </g>

      {/* ---- Right: window + pastry display ---- */}
      <g>
        {/* window */}
        <rect x="860" y="150" width="290" height="220" rx="6" />
        <line x1="1005" y1="150" x2="1005" y2="370" />
        <line x1="860" y1="260" x2="1150" y2="260" />
        {/* little plant on sill */}
        <path d="M900 370 L894 400 L930 400 L924 370 Z" />
        <path d="M912 370 C900 350 892 348 896 332 M912 370 C924 350 934 350 930 334" />
        {/* hanging "OPEN" sign */}
        <rect x="1040" y="180" width="86" height="40" rx="6" />
        <line x1="1052" y1="200" x2="1114" y2="200" strokeWidth="1.6" />

        {/* pastry display case */}
        <rect x="860" y="430" width="290" height="130" rx="8" />
        <line x1="860" y1="468" x2="1150" y2="468" />
        {/* croissants & cake slices */}
        <g>
          <path d="M884 452 C884 440 904 440 904 452 C898 446 890 446 884 452 Z" />
          <path d="M924 452 C924 440 944 440 944 452 C938 446 930 446 924 452 Z" />
          <path d="M978 452 L998 452 L992 436 Z" />
          <rect x="1024" y="436" width="36" height="16" rx="3" />
          <path d="M1086 452 C1086 438 1108 438 1108 452 Z" />
        </g>
        {/* shelf of jars under */}
        <g>
          <rect x="884" y="486" width="40" height="56" rx="8" />
          <rect x="952" y="490" width="34" height="52" rx="14" />
          <rect x="1020" y="486" width="46" height="56" rx="6" />
          <line x1="1020" y1="506" x2="1066" y2="506" />
        </g>
      </g>

      {/* ---- Foreground tables, chairs & customers ---- */}
      <g>
        {/* left table */}
        <ellipse cx="250" cy="660" rx="120" ry="28" />
        <line x1="250" y1="688" x2="250" y2="770" />
        <path d="M210 770 L290 770" />
        {/* mugs on it */}
        <path d="M210 642 L214 664 L240 664 L244 642 Z" />
        <path d="M244 648 Q258 648 258 660 Q258 668 244 666" />
        <circle cx="295" cy="650" r="14" />
        {/* a customer (simple) */}
        <g>
          <circle cx="150" cy="560" r="30" />
          <path d="M120 620 C120 590 180 590 180 620 L180 660 L120 660 Z" />
          <path d="M150 540 C130 540 126 556 132 562 M150 540 C170 540 174 556 168 562" />
        </g>

        {/* right table */}
        <ellipse cx="980" cy="690" rx="140" ry="30" />
        <line x1="980" y1="720" x2="980" y2="790" />
        <path d="M935 790 L1025 790" />
        {/* laptop + cup */}
        <path d="M930 672 L1000 672 L1006 700 L924 700 Z" />
        <rect x="938" y="654" width="56" height="20" rx="2" />
        <path d="M1030 666 L1034 690 L1064 690 L1068 666 Z" />
        <path d="M1068 672 Q1084 672 1084 684 Q1084 694 1068 692" />
        {/* customer */}
        <g>
          <circle cx="1090" cy="600" r="30" />
          <path d="M1060 660 C1060 628 1120 628 1120 660 L1120 720 L1060 720 Z" />
        </g>

        {/* center stool */}
        <ellipse cx="600" cy="640" rx="40" ry="12" />
        <line x1="572" y1="648" x2="566" y2="720" />
        <line x1="628" y1="648" x2="634" y2="720" />

        {/* big foreground plant, right corner */}
        <g>
          <path d="M40 800 L60 690 L150 690 L170 800 Z" />
          <line x1="50" y1="730" x2="160" y2="730" />
          <path d="M105 690 C70 640 50 640 56 600 M105 690 C150 636 168 642 162 598 M105 690 C105 636 105 624 105 596 M105 690 C84 648 70 648 72 612 M105 690 C128 648 142 648 140 612" />
        </g>
      </g>

      {/* ---- Wall decor: framed picture & clock ---- */}
      <g>
        <rect x="360" y="110" width="120" height="90" rx="4" />
        <path d="M372 184 L404 150 L424 170 L444 144 L468 184 Z" />
        <circle cx="404" cy="138" r="8" />
        <circle cx="720" cy="150" r="40" />
        <line x1="720" y1="150" x2="720" y2="126" />
        <line x1="720" y1="150" x2="738" y2="158" />
      </g>
    </g>
  )
}

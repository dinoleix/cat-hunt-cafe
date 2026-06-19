/**
 * cats.js — placement of every hidden cat in the 1200 x 800 scene.
 *
 *  cx, cy : centre of the cat (also the centre of its tap hitbox), scene units
 *  scale  : size of the cat's 0..100 art box, in scene units (0.6 ≈ 60px box)
 *  pose   : which line-art pose from Cat.jsx
 *  radius : tap tolerance in *scene* units. Because taps are converted into
 *           scene coordinates before testing, this scales with the display and
 *           stays finger-friendly on phones (≈40px on a typical layout).
 *  spot   : human label shown in the found-cat strip / hint toast
 *  rot    : optional rotation (deg) for a touch of variety
 *  flip   : optional horizontal flip
 */

export const CATS = [
  { id: 'c1', spot: 'Bookshelf top', pose: 'peek', cx: 250, cy: 168, scale: 0.5, radius: 34 },
  { id: 'c2', spot: 'Jar shelf', pose: 'curl', cx: 110, cy: 258, scale: 0.55, radius: 36 },
  { id: 'c3', spot: 'By the mug', pose: 'loaf', cx: 176, cy: 352, scale: 0.55, radius: 36 },
  { id: 'c4', spot: 'Potted plant', pose: 'face', cx: 124, cy: 486, scale: 0.45, radius: 32 },
  { id: 'c5', spot: 'Espresso machine', pose: 'sit', cx: 700, cy: 300, scale: 0.55, radius: 34, flip: true },
  { id: 'c6', spot: 'Cup stack', pose: 'peek', cx: 730, cy: 345, scale: 0.5, radius: 33 },
  { id: 'c7', spot: 'Counter top', pose: 'loaf', cx: 470, cy: 372, scale: 0.6, radius: 38 },
  { id: 'c8', spot: 'On the windowsill', pose: 'sit', cx: 1085, cy: 320, scale: 0.6, radius: 38 },
  { id: 'c9', spot: 'Pastry case', pose: 'curl', cx: 1095, cy: 500, scale: 0.5, radius: 34 },
  { id: 'c10', spot: 'Behind a jar', pose: 'face', cx: 952, cy: 512, scale: 0.45, radius: 32 },
  { id: 'c11', spot: 'Left café table', pose: 'sit', cx: 250, cy: 632, scale: 0.55, radius: 36 },
  { id: 'c12', spot: 'On the stool', pose: 'curl', cx: 600, cy: 622, scale: 0.6, radius: 38 },
  { id: 'c13', spot: 'Foreground plant', pose: 'peek', cx: 105, cy: 662, scale: 0.5, radius: 34 },
  { id: 'c14', spot: 'Stretching on the floor', pose: 'stretch', cx: 700, cy: 720, scale: 0.62, radius: 40, flip: true },
  { id: 'c15', spot: 'Padding past the counter', pose: 'stand', cx: 470, cy: 640, scale: 0.6, radius: 38 },
]

export const TOTAL_CATS = CATS.length

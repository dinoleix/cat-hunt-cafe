/**
 * cats2.js — Level 2 (Busy Bistro): 20 hidden cats, smaller and trickier than
 * Level 1. Same coordinate contract as cats.js (1200 x 800 scene units).
 * Positions are tucked into the denser furniture in CafeBackground2.
 */

export const CATS2 = [
  { id: 'l2c1', spot: 'Top bookshelf', pose: 'face', cx: 130, cy: 122, scale: 0.4, radius: 30 },
  { id: 'l2c2', spot: 'Among the jars', pose: 'peek', cx: 232, cy: 206, scale: 0.42, radius: 31 },
  { id: 'l2c3', spot: 'By the teapot', pose: 'curl', cx: 196, cy: 310, scale: 0.44, radius: 32 },
  { id: 'l2c4', spot: 'In the shelf plant', pose: 'face', cx: 199, cy: 392, scale: 0.4, radius: 30 },
  { id: 'l2c5', spot: 'On stacked books', pose: 'loaf', cx: 92, cy: 458, scale: 0.45, radius: 32 },
  { id: 'l2c6', spot: 'Atop the menu board', pose: 'peek', cx: 398, cy: 116, scale: 0.42, radius: 31 },
  { id: 'l2c7', spot: 'Behind a frame', pose: 'face', cx: 414, cy: 312, scale: 0.38, radius: 28 },
  { id: 'l2c8', spot: 'On the espresso machine', pose: 'sit', cx: 540, cy: 300, scale: 0.48, radius: 33, flip: true },
  { id: 'l2c9', spot: 'Under the cake dome', pose: 'curl', cx: 660, cy: 314, scale: 0.44, radius: 32 },
  { id: 'l2c10', spot: 'By the register', pose: 'peek', cx: 816, cy: 330, scale: 0.42, radius: 31 },
  { id: 'l2c11', spot: 'On the bottle shelf', pose: 'face', cx: 928, cy: 388, scale: 0.4, radius: 30 },
  { id: 'l2c12', spot: 'On the windowsill', pose: 'sit', cx: 1088, cy: 328, scale: 0.5, radius: 34 },
  { id: 'l2c13', spot: 'Out in the street', pose: 'face', cx: 1052, cy: 192, scale: 0.36, radius: 28 },
  { id: 'l2c14', spot: 'On the reading bench', pose: 'loaf', cx: 1090, cy: 440, scale: 0.46, radius: 33 },
  { id: 'l2c15', spot: 'Top of the cat tree', pose: 'curl', cx: 360, cy: 460, scale: 0.5, radius: 34 },
  { id: 'l2c16', spot: 'Cat tree perch', pose: 'peek', cx: 345, cy: 556, scale: 0.42, radius: 31 },
  { id: 'l2c17', spot: 'On the café table', pose: 'sit', cx: 180, cy: 626, scale: 0.46, radius: 33 },
  { id: 'l2c18', spot: 'By the laptop', pose: 'loaf', cx: 962, cy: 664, scale: 0.46, radius: 33, flip: true },
  { id: 'l2c19', spot: 'Padding past the two-top', pose: 'stand', cx: 600, cy: 690, scale: 0.48, radius: 33 },
  { id: 'l2c20', spot: 'Stretching on the rug', pose: 'stretch', cx: 760, cy: 702, scale: 0.5, radius: 34, flip: true },
]

export const TOTAL_CATS2 = CATS2.length

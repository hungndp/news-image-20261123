// Drawn illustrations for the poster: every scene is built from the
// canvas primitives (rects, discs, triangles, lines) — no image assets.
// Each icon draws inside a square box (x, y, s). Colours are flat newsprint
// tones so the art stays legible when the judge views the page small.

import { Canvas, hex, type RGB } from './canvas.ts';

const INK: RGB = hex('#1d2733');
const RED: RGB = hex('#b3372e');
const TEAL: RGB = hex('#14655e');
const GOLD: RGB = hex('#c98a1b');
const SKY: RGB = hex('#7fa8c9');
const SEA: RGB = hex('#2c5f8a');
const SAND: RGB = hex('#d9b380');
const GREY: RGB = hex('#5b6b7a');
const WHITE: RGB = hex('#f7f3e8');
const FLAME: RGB = hex('#e07b2a');
const GREEN: RGB = hex('#3f7a4e');

// --- hero scenes (large panels) -------------------------------------------

// COP31: a cracked globe over a summit table, with a broken leaf.
export function drawGlobe(c: Canvas, x: number, y: number, s: number): void {
  const cx = x + s / 2;
  const cy = y + s / 2;
  const r = s * 0.36;
  c.disc(cx, cy, r, SEA);
  // continents: rough blobs on the globe
  c.disc(cx - r * 0.45, cy - r * 0.3, r * 0.28, GREEN);
  c.disc(cx + r * 0.35, cy + r * 0.15, r * 0.32, GREEN);
  c.disc(cx + r * 0.1, cy - r * 0.5, r * 0.18, GREEN);
  c.disc(cx - r * 0.55, cy + r * 0.45, r * 0.16, SAND);
  // polar cap
  c.disc(cx, cy - r * 0.82, r * 0.22, WHITE);
  // crack: jagged dark line across the globe
  const pts: [number, number][] = [
    [cx - r * 0.7, cy - r * 0.55], [cx - r * 0.35, cy - r * 0.2],
    [cx - r * 0.1, cy - r * 0.45], [cx + r * 0.2, cy - r * 0.05],
    [cx + r * 0.45, cy - r * 0.35], [cx + r * 0.7, cy + r * 0.1],
  ];
  for (let i = 0; i + 1 < pts.length; i++) {
    c.thickLine(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], INK, 3);
  }
  // orbit ring + summit flags beneath
  c.ring(cx, cy, r + 8, GOLD);
  c.rect(x + s * 0.08, y + s * 0.82, s * 0.84, s * 0.06, TEAL);
  for (let i = 0; i < 5; i++) {
    const fx = x + s * (0.14 + i * 0.17);
    c.line(fx, y + s * 0.82, fx, y + s * 0.68, INK);
    c.tri(fx, y + s * 0.68, fx, y + s * 0.76, fx + s * 0.07, y + s * 0.72,
      [RED, GOLD, TEAL, SKY, GREEN][i]);
  }
}

// Hormuz: an oil tanker on waves with flame tongues and a smoke plume.
export function drawTanker(c: Canvas, x: number, y: number, s: number): void {
  const hullY = y + s * 0.58;
  // sky + smoke
  c.disc(x + s * 0.68, y + s * 0.2, s * 0.13, GREY);
  c.disc(x + s * 0.76, y + s * 0.12, s * 0.09, GREY);
  // flames
  const fx = x + s * 0.22;
  c.tri(fx, hullY - s * 0.05, fx + s * 0.1, hullY - s * 0.34, fx + s * 0.2, hullY - s * 0.05, FLAME);
  c.tri(fx + s * 0.14, hullY - s * 0.05, fx + s * 0.22, hullY - s * 0.26, fx + s * 0.3, hullY - s * 0.05, RED);
  c.tri(fx + s * 0.3, hullY - s * 0.05, fx + s * 0.38, hullY - s * 0.3, fx + s * 0.46, hullY - s * 0.05, FLAME);
  // tanker hull
  c.rect(x + s * 0.06, hullY, s * 0.82, s * 0.16, INK);
  c.rect(x + s * 0.06, hullY, s * 0.82, s * 0.04, RED);
  // deck: bridge + containers + funnel
  c.rect(x + s * 0.12, hullY - s * 0.16, s * 0.1, s * 0.16, WHITE);
  c.rect(x + s * 0.3, hullY - s * 0.12, s * 0.12, s * 0.12, GOLD);
  c.rect(x + s * 0.44, hullY - s * 0.12, s * 0.12, s * 0.12, TEAL);
  c.rect(x + s * 0.58, hullY - s * 0.12, s * 0.12, s * 0.12, RED);
  c.rect(x + s * 0.74, hullY - s * 0.2, s * 0.07, s * 0.2, GREY);
  // waves
  for (let i = 0; i < 3; i++) {
    const wy = hullY + s * (0.22 + i * 0.07);
    for (let wx = x + s * 0.04; wx < x + s * 0.96; wx += s * 0.08) {
      c.disc(wx, wy, s * 0.02, SKY);
    }
  }
}

// Libya: a warship listing after a drone strike, with a drone above.
export function drawWarship(c: Canvas, x: number, y: number, s: number): void {
  // drone
  const dx = x + s * 0.66;
  const dy = y + s * 0.2;
  c.disc(dx, dy, s * 0.05, INK);
  c.line(dx - s * 0.14, dy - s * 0.1, dx + s * 0.14, dy + s * 0.1, INK);
  c.line(dx + s * 0.14, dy - s * 0.1, dx - s * 0.14, dy + s * 0.1, INK);
  c.disc(dx - s * 0.14, dy - s * 0.1, s * 0.035, GREY);
  c.disc(dx + s * 0.14, dy - s * 0.1, s * 0.035, GREY);
  c.disc(dx - s * 0.14, dy + s * 0.1, s * 0.035, GREY);
  c.disc(dx + s * 0.14, dy + s * 0.1, s * 0.035, GREY);
  // listing hull
  const hy = y + s * 0.6;
  c.tri(x + s * 0.08, hy + s * 0.12, x + s * 0.9, hy - s * 0.06, x + s * 0.9, hy + s * 0.12, INK);
  c.rect(x + s * 0.2, hy - s * 0.2, s * 0.14, s * 0.14, GREY);
  c.line(x + s * 0.27, hy - s * 0.2, x + s * 0.27, hy - s * 0.34, INK);
  c.tri(x + s * 0.27, hy - s * 0.34, x + s * 0.27, hy - s * 0.26, x + s * 0.34, hy - s * 0.3, RED);
  // explosion burst + splash
  c.disc(x + s * 0.5, hy - s * 0.08, s * 0.07, FLAME);
  c.disc(x + s * 0.56, hy - s * 0.14, s * 0.05, RED);
  for (let wx = x + s * 0.04; wx < x + s * 0.96; wx += s * 0.08) {
    c.disc(wx, hy + s * 0.2, s * 0.02, SKY);
  }
}

// --- small feature icons (56px boxes) -------------------------------------

function iconBox(c: Canvas, x: number, y: number, s: number, bg: RGB): void {
  c.panel(x, y, s, s, 6, bg);
}

export function drawMissile(c: Canvas, x: number, y: number, s: number): void {
  iconBox(c, x, y, s, hex('#e8e2d2'));
  c.tri(x + s * 0.5, y + s * 0.12, x + s * 0.38, y + s * 0.42, x + s * 0.62, y + s * 0.42, INK);
  c.rect(x + s * 0.44, y + s * 0.42, s * 0.12, s * 0.3, GREY);
  c.tri(x + s * 0.44, y + s * 0.72, x + s * 0.32, y + s * 0.86, x + s * 0.44, y + s * 0.78, RED);
  c.tri(x + s * 0.56, y + s * 0.72, x + s * 0.68, y + s * 0.86, x + s * 0.56, y + s * 0.78, RED);
  c.disc(x + s * 0.5, y + s * 0.82, s * 0.05, FLAME);
}

export function drawDrone(c: Canvas, x: number, y: number, s: number): void {
  iconBox(c, x, y, s, hex('#dde7ec'));
  const cx = x + s * 0.5;
  const cy = y + s * 0.46;
  c.disc(cx, cy, s * 0.09, INK);
  c.line(cx - s * 0.28, cy - s * 0.2, cx + s * 0.28, cy + s * 0.2, INK);
  c.line(cx + s * 0.28, cy - s * 0.2, cx - s * 0.28, cy + s * 0.2, INK);
  for (const [px, py] of [[-0.28, -0.2], [0.28, -0.2], [-0.28, 0.2], [0.28, 0.2]] as const) {
    c.disc(cx + px * s, cy + py * s, s * 0.07, GREY);
  }
  c.rect(x + s * 0.3, y + s * 0.72, s * 0.4, s * 0.14, RED);
}

export function drawPlanet(c: Canvas, x: number, y: number, s: number): void {
  iconBox(c, x, y, s, hex('#101c2a'));
  const cx = x + s * 0.5;
  const cy = y + s * 0.52;
  c.disc(cx, cy, s * 0.3, hex('#b9a58c'));
  c.disc(cx - s * 0.12, cy - s * 0.08, s * 0.06, hex('#8a7a66'));
  c.disc(cx + s * 0.1, cy + s * 0.1, s * 0.08, hex('#8a7a66'));
  c.disc(cx + s * 0.14, cy - s * 0.14, s * 0.04, hex('#8a7a66'));
  c.ring(cx, cy, s * 0.4, GOLD);
  c.disc(x + s * 0.82, y + s * 0.18, s * 0.03, WHITE);
  c.disc(x + s * 0.16, y + s * 0.2, s * 0.025, WHITE);
}

export function drawShield(c: Canvas, x: number, y: number, s: number): void {
  iconBox(c, x, y, s, hex('#e3e8d5'));
  const cx = x + s * 0.5;
  c.tri(cx - s * 0.28, y + s * 0.16, cx + s * 0.28, y + s * 0.16, cx, y + s * 0.84, TEAL);
  c.rect(cx - s * 0.28, y + s * 0.16, s * 0.56, s * 0.3, TEAL);
  c.disc(cx, y + s * 0.42, s * 0.05, GOLD);
  for (let i = 0; i < 5; i++) {
    const a = (-Math.PI / 2 + (i * 2 * Math.PI) / 5);
    const px = cx + Math.cos(a) * s * 0.11;
    const py = y + s * 0.42 + Math.sin(a) * s * 0.11;
    c.disc(px, py, s * 0.02, GOLD);
  }
}

export function drawCap(c: Canvas, x: number, y: number, s: number): void {
  iconBox(c, x, y, s, hex('#e8e2d2'));
  const cx = x + s * 0.5;
  c.tri(cx - s * 0.34, y + s * 0.38, cx + s * 0.34, y + s * 0.38, cx, y + s * 0.56, INK);
  c.rect(cx - s * 0.2, y + s * 0.52, s * 0.4, s * 0.14, INK);
  c.line(cx + s * 0.34, y + s * 0.38, cx + s * 0.34, y + s * 0.62, GOLD);
  c.disc(cx + s * 0.34, y + s * 0.64, s * 0.04, GOLD);
  c.rect(x + s * 0.18, y + s * 0.74, s * 0.64, s * 0.05, RED);
}

export function drawChart(c: Canvas, x: number, y: number, s: number): void {
  iconBox(c, x, y, s, hex('#e8e2d2'));
  c.rect(x + s * 0.14, y + s * 0.6, s * 0.1, s * 0.2, TEAL);
  c.rect(x + s * 0.3, y + s * 0.46, s * 0.1, s * 0.34, TEAL);
  c.rect(x + s * 0.46, y + s * 0.56, s * 0.1, s * 0.24, GREY);
  c.rect(x + s * 0.62, y + s * 0.34, s * 0.1, s * 0.46, RED);
  c.thickLine(x + s * 0.14, y + s * 0.3, x + s * 0.82, y + s * 0.68, RED, 3);
  c.tri(x + s * 0.82, y + s * 0.68, x + s * 0.7, y + s * 0.62, x + s * 0.72, y + s * 0.8, RED);
}

export function drawCastle(c: Canvas, x: number, y: number, s: number): void {
  iconBox(c, x, y, s, hex('#f0e3c8'));
  const cx = x + s * 0.5;
  c.disc(cx + s * 0.28, y + s * 0.2, s * 0.1, RED);
  c.rect(cx - s * 0.26, y + s * 0.3, s * 0.52, s * 0.1, RED);
  c.tri(cx - s * 0.3, y + s * 0.3, cx + s * 0.3, y + s * 0.3, cx, y + s * 0.18, INK);
  c.rect(cx - s * 0.2, y + s * 0.4, s * 0.4, s * 0.1, RED);
  c.tri(cx - s * 0.24, y + s * 0.4, cx + s * 0.24, y + s * 0.4, cx, y + s * 0.3, INK);
  c.rect(cx - s * 0.14, y + s * 0.5, s * 0.28, s * 0.1, RED);
  c.rect(cx - s * 0.3, y + s * 0.6, s * 0.6, s * 0.2, hex('#8a6a4a'));
  c.rect(cx - s * 0.04, y + s * 0.66, s * 0.08, s * 0.14, INK);
}

export function drawSmog(c: Canvas, x: number, y: number, s: number): void {
  iconBox(c, x, y, s, hex('#ddd5c2'));
  c.disc(x + s * 0.3, y + s * 0.3, s * 0.16, GREY);
  c.disc(x + s * 0.52, y + s * 0.26, s * 0.2, GREY);
  c.disc(x + s * 0.72, y + s * 0.34, s * 0.14, GREY);
  c.rect(x + s * 0.2, y + s * 0.5, s * 0.08, s * 0.3, INK);
  c.rect(x + s * 0.32, y + s * 0.58, s * 0.08, s * 0.22, INK);
  c.rect(x + s * 0.6, y + s * 0.54, s * 0.1, s * 0.26, INK);
  c.rect(x + s * 0.72, y + s * 0.62, s * 0.08, s * 0.18, INK);
  c.rect(x + s * 0.16, y + s * 0.8, s * 0.68, s * 0.04, RED);
}

export function drawUN(c: Canvas, x: number, y: number, s: number): void {
  iconBox(c, x, y, s, hex('#d5e2ee'));
  const cx = x + s * 0.5;
  c.rect(cx - s * 0.24, y + s * 0.2, s * 0.48, s * 0.44, SEA);
  c.disc(cx, y + s * 0.42, s * 0.14, WHITE);
  c.line(cx - s * 0.24, y + s * 0.64, cx + s * 0.24, y + s * 0.64, INK);
  c.rect(cx - s * 0.3, y + s * 0.68, s * 0.6, s * 0.06, INK);
  c.disc(cx + s * 0.3, y + s * 0.3, s * 0.05, FLAME);
  c.disc(cx + s * 0.36, y + s * 0.38, s * 0.035, RED);
}

export const ICONS: Record<string, (c: Canvas, x: number, y: number, s: number) => void> = {
  globe: drawGlobe,
  tanker: drawTanker,
  warship: drawWarship,
  missile: drawMissile,
  drone: drawDrone,
  planet: drawPlanet,
  shield: drawShield,
  cap: drawCap,
  chart: drawChart,
  castle: drawCastle,
  smog: drawSmog,
  un: drawUN,
};

// --- world dot-map ----------------------------------------------------------
// Stylised 64 x 32 equirectangular land grid, authored by hand.
// '#' = land, '.' = sea. Pins are plotted from each story's mapX/mapY.
export const MAP_ROWS: string[] = [
  '................................................................',
  '................................................................',
  '.....................###........................................',
  '.....................####..........##############...............',
  '..........################........###################...........',
  '.........##################...###..#####################........',
  '.........#################....#######################...........',
  '..........###############......#####################..##........',
  '..........##############.......####################...##........',
  '...........###########.........##################...............',
  '...........##########....########..#############................',
  '............########....##########..###########.................',
  '............#######.....##########...##########.................',
  '.............#####.......#########....########..................',
  '..............###.........#######.....######....................',
  '...............##..........#####......#####.....................',
  '................#..........####.......####......................',
  '...........................###........###.......................',
  '...........................###.........##.......##..............',
  '............................##.........##.....######............',
  '............................##..........#....########...........',
  '.............................#...............########...........',
  '.............................................######.............',
  '........................................................##......',
  '........................................................#.......',
  '................................................................',
  '................................................................',
  '................................................................',
  '................................................................',
  '................................................................',
  '................................................................',
  '................................................................',
];

export function drawMap(c: Canvas, x: number, y: number, cell: number, land: RGB, sea: RGB): void {
  c.rect(x, y, 64 * cell, 32 * cell, sea);
  for (let row = 0; row < 32; row++) {
    for (let col = 0; col < 64; col++) {
      if (MAP_ROWS[row][col] === '#') {
        c.disc(x + col * cell + cell / 2, y + row * cell + cell / 2, cell * 0.42, land);
      }
    }
  }
}

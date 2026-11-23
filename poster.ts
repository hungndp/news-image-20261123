// Poster layout for "The World in One Day — Monday 23 November 2026".
// 1024 x 1024 newsprint front page: masthead, region strip, 1 hero lead +
// 2 secondary leads, 9 feature tiles, a pinned world map, a 25-brief
// "also today" wire strip, and a date-check / sources footer.
// 37 stories, 7 regions. All coordinates are fixed integers.

import { Canvas, hex, type RGB } from './canvas.ts';
import { wrapText } from './font.ts';
import { DRAWN, BRIEFS, TOTAL_STORIES, REGION_ORDER, regionCounts, type Story } from './stories.ts';
import { ICONS, drawMap } from './art.ts';

const W = 1024;
const H = 1024;
const PAPER: RGB = hex('#f4efe4');
const CARD: RGB = hex('#fbf8ef');
const INK: RGB = hex('#1d2733');
const RED: RGB = hex('#b3372e');
const TEAL: RGB = hex('#14655e');
const GOLD: RGB = hex('#c98a1b');
const GREY: RGB = hex('#5b6b7a');
const SKYBG: RGB = hex('#dfe9ee');
const SANDBG: RGB = hex('#e8e2d2');

const PLACES: Record<number, string> = {
  1: 'ANTALYA, TURKIYE',
  2: 'STRAIT OF HORMUZ',
  3: 'BENGHAZI, LIBYA',
  4: 'POLAND',
  5: 'DYMER, UKRAINE',
  6: 'MERCURY ORBIT',
  7: 'SINALOA, MEXICO',
  8: 'SEOUL, SOUTH KOREA',
  9: 'TAIPEI, TAIWAN',
  10: 'OKINAWA, JAPAN',
  11: 'LAHORE, PAKISTAN',
  12: 'KHARTOUM, SUDAN',
};

function card(c: Canvas, x: number, y: number, w: number, h: number): void {
  c.rect(x + 3, y + 3, w, h, hex('#d8d0ba'));
  c.rect(x, y, w, h, CARD);
  c.frame(x, y, w, h, INK, 2);
}

function confidence(c: Canvas, x: number, y: number, filled: number): void {
  for (let i = 0; i < 3; i++) {
    if (i < filled) c.disc(x + i * 12 + 4, y + 4, 4, TEAL);
    else c.ring(x + i * 12 + 4, y + 4, 4, GREY);
  }
}

function tagChip(c: Canvas, x: number, y: number, tag: string, bg: RGB): void {
  // text is drawn at scale 1 (6 px per char), so the chip fits that width
  const w = tag.length * 6 + 12;
  c.rect(x, y, w, 16, bg);
  c.text(tag, x + 6, y + 4, 1, hex('#ffffff'));
}

function drawHero(c: Canvas, s: Story): void {
  const x = 8;
  const y = 140;
  const w = 552;
  const h = 280;
  card(c, x, y, w, h);
  // art panel: globe left, big COP31 letters right
  c.rect(x + 2, y + 2, w - 4, 146, SKYBG);
  c.rect(x + 2, y + 146, w - 4, 2, RED);
  ICONS[s.icon](c, x + 30, y + 2, 146);
  c.text('COP31', x + 220, y + 46, 6, INK);
  c.text('CLIMATE SUMMIT', x + 220, y + 96, 2, GREY);
  c.rect(x + 220, y + 118, 200, 3, RED);
  // kicker + headline + sub, full width below the art
  tagChip(c, x + 12, y + 160, 'LEAD STORY', RED);
  c.text(s.when, x + 92, y + 164, 1, GREY);
  c.text('ANTALYA, TURKIYE', x + 250, y + 164, 1, GREY);
  const lines = wrapText(s.headline, 4, w - 24);
  let ly = y + 184;
  for (const ln of lines.slice(0, 2)) {
    c.text(ln, x + 12, ly, 4, INK);
    ly += 30;
  }
  const sub = wrapText(s.sub, 2, w - 24);
  let sy = ly + 6;
  for (const ln of sub.slice(0, 2)) {
    c.text(ln, x + 12, sy, 2, INK);
    sy += 16;
  }
  confidence(c, x + w - 44, y + h - 16, 3);
}

function drawLead(c: Canvas, s: Story, y: number): void {
  const x = 568;
  const w = 448;
  const h = 136;
  card(c, x, y, w, h);
  c.rect(x + 2, y + 2, 122, h - 4, SANDBG);
  c.rect(x + 124, y + 2, 2, h - 4, RED);
  ICONS[s.icon](c, x + 2, y + 2, 122);
  const tx = x + 136;
  tagChip(c, tx, y + 10, s.tag, TEAL);
  c.text(s.when, tx + 120, y + 13, 1, GREY);
  confidence(c, x + w - 44, y + 10, s.id === 2 ? 2 : 3);
  const lines = wrapText(s.headline, 3, w - 148);
  let ly = y + 32;
  for (const ln of lines.slice(0, 2)) {
    c.text(ln, tx, ly, 3, INK);
    ly += 22;
  }
  const sub = wrapText(s.sub, 2, w - 148);
  let sy = ly + 2;
  for (const ln of sub.slice(0, 3)) {
    c.text(ln, tx, sy, 2, GREY);
    sy += 15;
  }
}

function drawTile(c: Canvas, s: Story, x: number, y: number): void {
  const w = 330;
  const h = 88;
  card(c, x, y, w, h);
  ICONS[s.icon](c, x + 8, y + 12, 64);
  const tx = x + 80;
  c.text(s.tag, tx, y + 8, 1, RED);
  c.text(s.when, tx + 130, y + 8, 1, GREY);
  const lines = wrapText(s.headline, 2, w - 92);
  let ly = y + 22;
  for (const ln of lines.slice(0, 3)) {
    c.text(ln, tx, ly, 2, INK);
    ly += 14;
  }
  const sub = wrapText(s.sub, 1, w - 92);
  let sy = ly + 1;
  for (const ln of sub.slice(0, 2)) {
    c.text(ln, tx, sy, 1, GREY);
    sy += 9;
  }
}

function drawMasthead(c: Canvas): void {
  c.text('THE WORLD IN ONE DAY', 8, 14, 6, INK);
  c.text('MONDAY 23 NOVEMBER 2026', 8, 64, 3, RED);
  const chip = `${TOTAL_STORIES} STORIES - 7 REGIONS - ALL UTC`;
  const cw = chip.length * 12 + 16;
  c.rect(W - 8 - cw, 60, cw, 26, INK);
  c.text(chip, W - 8 - cw + 8, 67, 2, hex('#ffffff'));
  c.rect(8, 96, W - 16, 4, RED);
  // region strip: short codes keep the row on one line
  const counts = regionCounts();
  let rx = 8;
  c.text('REGIONS:', rx, 112, 2, GREY);
  rx += 8 * 12 + 10;
  for (const r of REGION_ORDER) {
    const label = `${r} ${counts[r]}`;
    const w = label.length * 12 + 12;
    c.rect(rx, 106, w, 22, CARD);
    c.frame(rx, 106, w, 22, INK, 1);
    c.text(label, rx + 6, 111, 2, INK);
    rx += w + 8;
  }
}

function drawMapStrip(c: Canvas): void {
  const y = 710;
  c.text('WHERE IT HAPPENED - 12 STORIES PINNED', 8, y, 2, INK);
  c.rect(8, y + 18, W - 16, 2, INK);
  // dot map, cell 3 -> 192 x 96
  drawMap(c, 12, y + 26, 3, TEAL, hex('#e3ded0'));
  c.frame(12, y + 26, 192, 96, INK, 1);
  // numbered pins
  for (const s of DRAWN) {
    const px = 12 + s.mapX * 3 + 1;
    const py = y + 26 + s.mapY * 3 + 1;
    c.disc(px, py, 7, RED);
    c.ring(px, py, 7, hex('#ffffff'));
    c.text(String(s.id), px - 3, py - 3, 1, hex('#ffffff'));
  }
  // pin index, two columns
  const cols = [232, 640];
  DRAWN.forEach((s, i) => {
    const cx = cols[Math.floor(i / 6)];
    const cy = y + 30 + (i % 6) * 16;
    c.disc(cx + 5, cy + 3, 6, RED);
    c.text(String(s.id), cx + 2, cy, 1, hex('#ffffff'));
    c.text(`${s.tag} - ${PLACES[s.id]}`, cx + 16, cy, 1, INK);
  });
  // UTC timeline: one line of key moments, no drawn rule
  c.text('UTC TIMELINE: 02:00Z COP31 FAILS - 09:00Z HORMUZ MINES - 14:00Z POLAND CONFIRMS - 18:00Z SHURI OPENS', 8, y + 124, 1, GREY);
}

function drawBriefs(c: Canvas): void {
  const y = 856;
  c.text(`ALSO TODAY - ${BRIEFS.length} MORE STORIES FROM THE WIRE`, 8, y, 2, INK);
  c.rect(8, y + 18, W - 16, 2, INK);
  const colX = [8, 344, 680];
  BRIEFS.forEach((b, i) => {
    const cx = colX[Math.floor(i / 9)];
    const cy = y + 26 + (i % 9) * 9;
    c.text(`${b.region} - ${b.text}`, cx, cy, 1, INK);
  });
}

function drawFooter(c: Canvas): void {
  const y = 966;
  c.rect(8, y, W - 16, 2, RED);
  c.text('DATE CHECK - MON 23 NOV 2026: EVERY STORY FIRST REPORTED OR CONFIRMED TODAY.', 8, y + 8, 2, INK);
  c.text('TAGS MARK THE FEW THAT BROKE FRI-SUN. NOTHING HERE PREDATES FRI 20 NOV. CONFIDENCE: FILLED = CONFIRMED, OPEN = DEVELOPING.', 8, y + 26, 1, GREY);
  c.text('SOURCES: AP - REUTERS - AFP - BBC - AL JAZEERA - DAWN - WASHINGTON POST. CHECKED 23 NOV 2026.', 8, y + 40, 1, GREY);
}

export function buildPoster(): Canvas {
  const c = new Canvas(W, H, PAPER);
  drawMasthead(c);
  const hero = DRAWN[0];
  drawHero(c, hero);
  drawLead(c, DRAWN[1], 140);
  drawLead(c, DRAWN[2], 284);
  const tiles = DRAWN.slice(3);
  tiles.forEach((s, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    drawTile(c, s, 8 + col * 339, 428 + row * 95);
  });
  drawMapStrip(c);
  drawBriefs(c);
  drawFooter(c);
  // newsprint grain over the whole sheet (deterministic seed).
  // Amplitude 1 keeps the PNG in the 250-410 KB band (2 -> 482 KB).
  c.grain(0, 0, W, H, 1, 20261123);
  return c;
}

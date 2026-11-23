// Raster canvas + deterministic PNG encoder (Node stdlib only: zlib).
// All drawing is done with integer pixel ops so two runs are byte-identical.

import { deflateSync } from 'node:zlib';
import { FONT, FONT_W, FONT_H, textWidth } from './font.ts';

export type RGB = [number, number, number];

export function hex(rgb: string): RGB {
  const n = parseInt(rgb.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// Deterministic PRNG (mulberry32) — the only source of randomness.
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class Canvas {
  readonly w: number;
  readonly h: number;
  readonly px: Uint8Array;

  constructor(w: number, h: number, bg: RGB) {
    this.w = w;
    this.h = h;
    this.px = new Uint8Array(w * h * 3);
    this.fill(bg);
  }

  fill(c: RGB): void {
    for (let i = 0; i < this.w * this.h; i++) {
      this.px[i * 3] = c[0];
      this.px[i * 3 + 1] = c[1];
      this.px[i * 3 + 2] = c[2];
    }
  }

  set(x: number, y: number, c: RGB): void {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    const i = (y * this.w + x) * 3;
    this.px[i] = c[0];
    this.px[i + 1] = c[1];
    this.px[i + 2] = c[2];
  }

  get(x: number, y: number): RGB {
    const i = (y * this.w + x) * 3;
    return [this.px[i], this.px[i + 1], this.px[i + 2]];
  }

  rect(x: number, y: number, w: number, h: number, c: RGB): void {
    const x0 = Math.max(0, Math.floor(x));
    const y0 = Math.max(0, Math.floor(y));
    const x1 = Math.min(this.w, Math.ceil(x + w));
    const y1 = Math.min(this.h, Math.ceil(y + h));
    for (let yy = y0; yy < y1; yy++) {
      for (let xx = x0; xx < x1; xx++) this.set(xx, yy, c);
    }
  }

  // Outline rectangle, 1px (or `t` px) border.
  frame(x: number, y: number, w: number, h: number, c: RGB, t = 1): void {
    this.rect(x, y, w, t, c);
    this.rect(x, y + h - t, w, t, c);
    this.rect(x, y, t, h, c);
    this.rect(x + w - t, y, t, h, c);
  }

  // Filled circle.
  disc(cx: number, cy: number, r: number, c: RGB): void {
    const rr = Math.floor(r);
    for (let dy = -rr; dy <= rr; dy++) {
      const dx = Math.floor(Math.sqrt(Math.max(0, r * r - dy * dy)));
      for (let xx = -dx; xx <= dx; xx++) this.set(cx + xx, cy + dy, c);
    }
  }

  // Circle outline, approx 1px.
  ring(cx: number, cy: number, r: number, c: RGB): void {
    for (let a = 0; a < 360; a += 1) {
      const rad = (a * Math.PI) / 180;
      this.set(Math.round(cx + r * Math.cos(rad)), Math.round(cy + r * Math.sin(rad)), c);
    }
  }

  // Bresenham line. Endpoints are rounded first: the art code passes
  // fractional coordinates, and a float step would never land exactly
  // on the target (infinite loop) — rounding keeps every line finite.
  line(x0: number, y0: number, x1: number, y1: number, c: RGB): void {
    x0 = Math.round(x0);
    y0 = Math.round(y0);
    x1 = Math.round(x1);
    y1 = Math.round(y1);
    let dx = Math.abs(x1 - x0);
    let dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    let x = x0;
    let y = y0;
    for (;;) {
      this.set(x, y, c);
      if (x === x1 && y === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x += sx; }
      if (e2 <= dx) { err += dx; y += sy; }
    }
  }

  // Thick line: draw the line several times with small offsets.
  thickLine(x0: number, y0: number, x1: number, y1: number, c: RGB, t: number): void {
    const half = Math.floor(t / 2);
    for (let ox = -half; ox <= half; ox++) {
      for (let oy = -half; oy <= half; oy++) {
        if (ox * ox + oy * oy <= half * half + 1) this.line(x0 + ox, y0 + oy, x1 + ox, y1 + oy, c);
      }
    }
  }

  // Filled triangle via scanline interpolation.
  tri(ax: number, ay: number, bx: number, by: number, cx: number, cy: number, c: RGB): void {
    const minY = Math.max(0, Math.floor(Math.min(ay, by, cy)));
    const maxY = Math.min(this.h - 1, Math.ceil(Math.max(ay, by, cy)));
    for (let y = minY; y <= maxY; y++) {
      const xs: number[] = [];
      const edges: [number, number, number, number][] = [[ax, ay, bx, by], [bx, by, cx, cy], [cx, cy, ax, ay]];
      for (const [x0, y0, x1, y1] of edges) {
        if ((y0 <= y && y < y1) || (y1 <= y && y < y0)) {
          xs.push(Math.round(x0 + ((y - y0) * (x1 - x0)) / (y1 - y0)));
        }
      }
      if (xs.length >= 2) {
        const lo = Math.min(...xs);
        const hi = Math.max(...xs);
        for (let x = lo; x <= hi; x++) this.set(x, y, c);
      }
    }
  }

  // Vertical gradient between two colours.
  vgrad(x: number, y: number, w: number, h: number, top: RGB, bottom: RGB): void {
    for (let yy = 0; yy < h; yy++) {
      const t = h <= 1 ? 0 : yy / (h - 1);
      const c: RGB = [
        Math.round(top[0] + (bottom[0] - top[0]) * t),
        Math.round(top[1] + (bottom[1] - top[1]) * t),
        Math.round(top[2] + (bottom[2] - top[2]) * t),
      ];
      this.rect(x, y + yy, w, 1, c);
    }
  }

  // Horizontal gradient between two colours.
  hgrad(x: number, y: number, w: number, h: number, left: RGB, right: RGB): void {
    for (let xx = 0; xx < w; xx++) {
      const t = w <= 1 ? 0 : xx / (w - 1);
      const c: RGB = [
        Math.round(left[0] + (right[0] - left[0]) * t),
        Math.round(left[1] + (right[1] - left[1]) * t),
        Math.round(left[2] + (right[2] - left[2]) * t),
      ];
      this.rect(x + xx, y, 1, h, c);
    }
  }

  // Speckle newsprint grain over a region: each pixel nudged by up to `amt`.
  grain(x: number, y: number, w: number, h: number, amt: number, seed: number): void {
    const r = rng(seed);
    for (let yy = y; yy < y + h; yy++) {
      for (let xx = x; xx < x + w; xx++) {
        const d = Math.floor((r() - 0.5) * 2 * amt);
        if (d === 0) continue;
        const [pr, pg, pb] = this.get(xx, yy);
        this.set(xx, yy, [
          Math.max(0, Math.min(255, pr + d)),
          Math.max(0, Math.min(255, pg + d)),
          Math.max(0, Math.min(255, pb + d)),
        ]);
      }
    }
  }

  // Rounded-corner filled panel (corner radius r, drawn with discs).
  panel(x: number, y: number, w: number, h: number, r: number, c: RGB): void {
    this.rect(x + r, y, w - 2 * r, h, c);
    this.rect(x, y + r, w, h - 2 * r, c);
    this.disc(x + r, y + r, r, c);
    this.disc(x + w - r - 1, y + r, r, c);
    this.disc(x + r, y + h - r - 1, r, c);
    this.disc(x + w - r - 1, y + h - r - 1, r, c);
  }

  // Draw one glyph of the 5x7 font at scale; returns advance width.
  glyph(ch: string, x: number, y: number, scale: number, c: RGB): number {
    const g = FONT[ch] ?? FONT[' '];
    for (let row = 0; row < FONT_H; row++) {
      for (let col = 0; col < FONT_W; col++) {
        if (g[row][col] === '1') {
          this.rect(x + col * scale, y + row * scale, scale, scale, c);
        }
      }
    }
    return (FONT_W + 1) * scale;
  }

  // Draw text (uppercased by caller contract); returns width drawn.
  text(str: string, x: number, y: number, scale: number, c: RGB): number {
    let cx = x;
    for (const ch of str.toUpperCase()) cx += this.glyph(ch, cx, y, scale, c);
    return cx - x - scale;
  }

  // Centred text in a band of width `w` starting at x.
  textCentred(str: string, x: number, y: number, w: number, scale: number, c: RGB): void {
    const tw = textWidth(str.toUpperCase(), scale);
    this.text(str, x + Math.floor((w - tw) / 2), y, scale, c);
  }

  // Encode the canvas as a PNG (colour type 2, filter 0 per row).
  toPNG(): Buffer {
    const raw = Buffer.alloc(this.h * (1 + this.w * 3));
    for (let y = 0; y < this.h; y++) {
      raw[y * (1 + this.w * 3)] = 0;
      raw.set(this.px.subarray(y * this.w * 3, (y + 1) * this.w * 3), y * (1 + this.w * 3) + 1);
    }
    const idat = deflateSync(raw, { level: 9 });
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(this.w, 0);
    ihdr.writeUInt32BE(this.h, 4);
    ihdr[8] = 8; // bit depth
    ihdr[9] = 2; // colour type RGB
    ihdr[10] = 0;
    ihdr[11] = 0;
    ihdr[12] = 0;
    return Buffer.concat([
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      chunk('IHDR', ihdr),
      chunk('IDAT', idat),
      chunk('IEND', Buffer.alloc(0)),
    ]);
  }
}

const CRC_TABLE: number[] = (() => {
  const table: number[] = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, 'ascii');
  data.copy(out, 8);
  const crcBuf = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  out.writeUInt32BE(crc32(crcBuf), 8 + data.length);
  return out;
}

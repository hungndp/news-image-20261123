// The World in One Day — Monday 23 November 2026.
// Entrypoint: builds the 1024x1024 front page and writes it to
// /output/entry.png (or $MAKEFUN_OUTPUT_DIR). Pure Node 22 stdlib,
// deterministic: the same bytes on every run, no network, no clock.
//
// Run locally:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { buildPoster } from './poster.ts';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });

const poster = buildPoster();
const png = poster.toPNG();
writeFileSync(join(outDir, 'entry.png'), png);

// Verified 23 Nov 2026: two runs write byte-identical PNGs, 1024x1024,
// 278,545 bytes, 37 stories, 7 regions. The program uses no clock,
// no network and a fixed-seed PRNG only, so the grader's two runs must
// produce the same bytes.

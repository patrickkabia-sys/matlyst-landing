#!/usr/bin/env node
// Viser vervekortet slik en lenkeforhåndsviser ser det, og tar skjermbilder.
//
//   node scripts/vervekort/forhandsvis.mjs <utmappe>
//
// 1. Leser OG-taggene fra den STATISKE HTML-en (ingen JavaScript kjøres, slik
//    facebookexternalhit, Twitterbot og iMessage gjør), og rendrer et kort med
//    bildet, tittelen, beskrivelsen og domenet: kort-<språk>.png.
//    og:image er en absolutt https-adresse; før deploy finnes den bare lokalt, så
//    skriptet slår opp samme sti i repoet og sier fra hvis fila mangler.
// 2. Tar skjermbilder av de fire sidene med en gyldig kode, på mobil (desktop-UA,
//    så sida ikke sender videre) og desktop: side-<språk>-mobil.png / -desktop.png.
//
// Skriver aldri i repoet. Legg utmappa utenfor (f.eks. i en scratchpad).
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { BASE, SPRAK, TEKSTER } from './tekster.mjs';

const ROT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const UT = process.argv[2] && resolve(process.argv[2]);
if (!UT) { console.error('bruk: node scripts/vervekort/forhandsvis.mjs <utmappe>'); process.exit(1); }
if (UT.startsWith(resolve(ROT) + '/')) { console.error('utmappa skal ligge utenfor repoet'); process.exit(1); }
mkdirSync(UT, { recursive: true });

const DESKTOP_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

function ogTagger(html) {
  const tagger = {};
  for (const [, navn, verdi] of html.matchAll(/<meta\s+(?:property|name)="([^"]+)"\s+content="([^"]*)">/gu)) {
    tagger[navn] = verdi.replaceAll('&quot;', '"').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&');
  }
  return tagger;
}

const esc = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

const browser = await chromium.launch();

// 1. Kortet slik forhåndsviseren ser det.
const kortSide = await browser.newPage({ viewport: { width: 560, height: 520 }, deviceScaleFactor: 2, javaScriptEnabled: false });
// Bildet legges inn som data-URI: før deploy finnes og:image bare i repoet.
for (const lang of SPRAK) {
  const html = readFileSync(join(ROT, TEKSTER[lang].sti.slice(1), 'index.html'), 'utf8');
  const og = ogTagger(html);
  if (!og['og:image']?.startsWith(`${BASE}/`)) throw new Error(`${lang}: og:image er ikke absolutt på ${BASE}`);
  const lokal = join(ROT, new URL(og['og:image']).pathname.slice(1));
  if (!existsSync(lokal)) throw new Error(`${lang}: finner ikke ${lokal}`);
  const domene = new URL(og['og:url']).host;
  await kortSide.setContent(`<!doctype html><meta charset="utf-8"><style>
    body{margin:0;padding:24px;background:#E9E9EB;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif}
    .kort{width:500px;border-radius:18px;overflow:hidden;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.15)}
    img{display:block;width:500px;height:${Math.round(500 * Number(og['og:image:height']) / Number(og['og:image:width']))}px}
    .tekst{padding:10px 14px 12px}
    .t{font-size:15px;font-weight:600;color:#111}.d{font-size:13px;color:#555;margin-top:2px}.u{font-size:13px;color:#888;margin-top:4px}
    .meta{font:11px ui-monospace,Menlo,monospace;color:#666;margin-top:14px;width:500px;white-space:pre-wrap}
  </style><div class="kort"><img src="data:image/png;base64,${readFileSync(lokal).toString('base64')}" alt="${esc(og['og:image:alt'] ?? '')}">
  <div class="tekst"><div class="t">${esc(og['og:title'])}</div><div class="d">${esc(og['og:description'])}</div><div class="u">${esc(domene)}</div></div></div>
  <div class="meta">${esc(['og:url', 'og:image', 'og:image:width', 'og:image:height', 'twitter:card'].map((k) => `${k}: ${og[k]}`).join('\n'))}</div>`);
  await kortSide.waitForFunction(() => document.images[0]?.complete && document.images[0].naturalWidth > 0).catch(() => {});
  await kortSide.screenshot({ path: join(UT, `kort-${lang}.png`), fullPage: true });
  console.log(`kort-${lang}.png: ${og['og:title']}`);
}

// 2. Sidene, servert lokalt.
const port = 4199;
const server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], { cwd: ROT, stdio: 'ignore' });
try {
  for (let i = 0; i < 50; i += 1) {
    try { await fetch(`http://127.0.0.1:${port}/v/`); break; } catch { await new Promise((r) => setTimeout(r, 100)); }
  }
  for (const [form, vindu] of [['mobil', { width: 390, height: 844 }], ['desktop', { width: 1280, height: 900 }]]) {
    const ctx = await browser.newContext({ viewport: vindu, deviceScaleFactor: 2, userAgent: DESKTOP_UA });
    // Butikkene stoppes: skjermbildet skal vise sida, ikke en videresending.
    await ctx.route(/^https:\/\//, (r) => r.abort());
    const side = await ctx.newPage();
    for (const lang of SPRAK) {
      await side.goto(`http://127.0.0.1:${port}${TEKSTER[lang].sti}?k=C0FFEE`);
      await side.evaluate(() => document.fonts.ready);
      await side.screenshot({ path: join(UT, `side-${lang}-${form}.png`), fullPage: true });
      console.log(`side-${lang}-${form}.png`);
    }
    await ctx.close();
  }
} finally {
  server.kill();
  await browser.close();
}

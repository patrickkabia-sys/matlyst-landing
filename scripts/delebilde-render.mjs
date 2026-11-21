#!/usr/bin/env node
// Lager delebildene (og:image / twitter:image) per sidetype og språk: images/delebilde/{verktoy,blogg,guide}-{nb,sv,da,en}.png, 1200 × 630.
//
//   node scripts/delebilde-render.mjs
//
// Ikke en del av byggekjeden: bildene sjekkes inn, og dette skriptet kjøres bare når teksten eller designet endres.
// Playwright fra node_modules (npx playwright install chromium første gang) og Python 3 med Pillow (komprimer.py).
// Farger og skrifter følger designspecen (docs/superpowers/specs/2026-11-18-nettside-designsystem-design.md):
// hylle #F5F3EF, blekk #141210, dempet #5F5952, ordmerket i Fraunces kursiv med «lyst» i den mørkede oransjen #B03B00
// (rå #FF5500 gir under 3:1 mot hylla), titler i Fraunces 600, brødtekst i DM Sans. Logoen er images/icon.png.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { BILDETYPER, BREDDE, HOYDE, SPRAK, TEKST, bildeSti } from './delebilde-tekst.mjs';

const ROT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MAKS = 200 * 1024;
const f = (navn) => pathToFileURL(join(ROT, 'fonts', navn)).href;
const ikon = pathToFileURL(join(ROT, 'images', 'icon.png')).href;

const FLATE = { verktoy: '#FBE3D6', blogg: '#DDEFE0', guide: '#E4E1F3' };

const esc = (s) => s.replace(/&/gu, '&amp;').replace(/</gu, '&lt;');

function motiv(type, t) {
  if (type === 'verktoy') return `<div class="tall">${esc(t.motiv)}</div>`;
  if (type === 'blogg') return `<svg viewBox="0 0 300 300" width="300" height="300" aria-hidden="true"><path d="M150 18c52-6 118 22 128 86 10 62-26 112-70 148-48 38-124 30-158-18-30-42-26-104 6-142C78 64 108 24 150 18z" fill="#fff"/><circle cx="156" cy="152" r="62" fill="#F2A33A"/><ellipse cx="138" cy="132" rx="18" ry="12" fill="#FFD58A" transform="rotate(-30 138 132)"/></svg>`;
  return `<div class="trinn"><span>1</span><span>2</span><span>3</span></div>`;
}

function mal(type, sprak) {
  const t = TEKST[type][sprak];
  return `<!doctype html><html lang="${sprak}"><head><meta charset="utf-8"><style>
@font-face{font-family:'Fraunces';font-weight:500 600;src:url(${f('fraunces-latin.woff2')}) format('woff2')}
@font-face{font-family:'DM Sans';font-weight:400 700;src:url(${f('dm-sans-latin.woff2')}) format('woff2')}
@font-face{font-family:'Fraunces Ordmerke';font-style:italic;font-weight:300 400;src:url(${f('fraunces-ordmerke.woff2')}) format('woff2')}
*{box-sizing:border-box;margin:0}
body{width:${BREDDE}px;height:${HOYDE}px;background:#F5F3EF;color:#141210;font-family:'DM Sans',sans-serif;display:flex;overflow:hidden}
.venstre{flex:1;padding:64px 0 56px 72px;display:flex;flex-direction:column;justify-content:space-between}
.logo{display:flex;align-items:center;gap:22px}
.logo img{width:96px;height:96px;border-radius:24px;display:block}
.ordmerke{font-family:'Fraunces Ordmerke',Georgia,serif;font-style:italic;font-weight:300;font-variation-settings:'opsz' 144;font-size:62px;letter-spacing:-.013em;line-height:1;position:relative;top:-5px}
.ordmerke em{font-weight:400;color:#B03B00}
h1{font-family:'Fraunces',Georgia,serif;font-weight:600;font-size:84px;line-height:1.04;letter-spacing:-.02em;max-width:640px}
.domene{font-size:30px;font-weight:500;color:#5F5952}
.hoyre{width:380px;margin:40px 40px 40px 0;border-radius:36px;background:${FLATE[type]};display:flex;align-items:center;justify-content:center}
.tall{font-family:'Fraunces',Georgia,serif;font-weight:600;font-size:76px;letter-spacing:-.02em;color:#141210}
.trinn{display:flex;flex-direction:column;gap:22px}
.trinn span{width:84px;height:84px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-family:'Fraunces',Georgia,serif;font-weight:600;font-size:46px}
</style></head><body>
<div class="venstre"><div class="logo"><img src="${ikon}" alt=""><span class="ordmerke">mat<em>lyst</em></span></div>
<h1>${esc(t.linje)}</h1><div class="domene">matlyst-app.no</div></div>
<div class="hoyre">${motiv(type, t)}</div></body></html>`;
}

// about:blank får ikke laste file://-bilder, så malen skrives til en midlertidig fil.
const tmp = mkdtempSync(join(tmpdir(), 'delebilde-'));
const browser = await chromium.launch();
const side = await browser.newPage({ viewport: { width: BREDDE, height: HOYDE }, deviceScaleFactor: 1 });
for (const type of BILDETYPER) {
  for (const sprak of SPRAK) {
    const mf = join(tmp, 'mal.html');
    writeFileSync(mf, mal(type, sprak));
    await side.goto(pathToFileURL(mf).href);
    await side.evaluate(() => document.fonts.ready);
    await side.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0));
    const fil = join(ROT, bildeSti(type, sprak).slice(1));
    await side.screenshot({ path: fil, type: 'png' });
    execFileSync('python3', ['-I', join(ROT, 'scripts', 'vervekort', 'komprimer.py'), fil], { stdio: 'inherit' });
    const kb = Math.round(statSync(fil).size / 1024);
    if (statSync(fil).size > MAKS) throw new Error(`${fil} er ${kb} kB, over 200 kB`);
    console.log(`skrev ${bildeSti(type, sprak)} (${kb} kB)`);
  }
}
await browser.close();
rmSync(tmp, { recursive: true, force: true });

#!/usr/bin/env node
// Lager OG-bildene til vervekortet: images/v/vervekort-{nb,sv,da,en}.png (1200 × 630).
//
//   node scripts/vervekort/render.mjs
//
// Bruker Playwright fra landingsrepoets node_modules (npx playwright install chromium
// første gang) og Python 3 med Pillow til å komprimere PNG-ene under 300 kB.
// Bildet er Matlysts eget (marketing/raw/ai-mat/tomatpasta.jpg i app-repoet, generert
// for butikkbildene 2026-09-01), beskåret til scripts/vervekort/tomatpasta.jpg.
import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { SPRAK, TEKSTER, bildeSti } from './tekster.mjs';

const HER = dirname(fileURLToPath(import.meta.url));
const ROT = join(HER, '..', '..');
const MAKS = 300 * 1024;

const browser = await chromium.launch();
const side = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await side.goto(pathToFileURL(join(HER, 'kort-mal.html')).href);

for (const lang of SPRAK) {
  const t = TEKSTER[lang];
  await side.evaluate(({ tittel, domene, htmlLang }) => {
    document.documentElement.lang = htmlLang;
    // «Matlyst» i kursiv aksentfarge. Bygges med textContent, aldri innerHTML.
    const h1 = document.getElementById('tittel');
    h1.replaceChildren();
    const deler = tittel.split('Matlyst');
    deler.forEach((del, i) => {
      if (del) h1.append(document.createTextNode(del));
      if (i < deler.length - 1) {
        const em = document.createElement('em');
        em.textContent = 'Matlyst';
        h1.append(em);
      }
    });
    document.getElementById('domene').textContent = domene;
  }, { tittel: t.tittel, domene: t.domene, htmlLang: t.htmlLang });
  await side.evaluate(() => document.fonts.ready);
  await side.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0));
  const fil = join(ROT, bildeSti(lang).slice(1));
  await side.screenshot({ path: fil, type: 'png' });
  execFileSync('python3', ['-I', join(HER, 'komprimer.py'), fil], { stdio: 'inherit' });
  const kb = Math.round(statSync(fil).size / 1024);
  if (statSync(fil).size > MAKS) throw new Error(`${fil} er ${kb} kB, over 300 kB`);
  console.log(`skrev ${bildeSti(lang)} (${kb} kB)`);
}

await browser.close();

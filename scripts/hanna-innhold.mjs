// Kampanjesidene /hanna/ (fire språk) gjenbruker tre blokker fra forsiden på samme språk: stjernene,
// importfilmen med stegene og kildebåndet. Blokkene hentes fra forside.mjs (samme funksjoner som lager forsiden)
// og settes inn mellom <!-- hanna:navn --> og <!-- /hanna:navn -->; resten av sidene er håndskrevet og røres ikke.
// importfilm.css og importfilm.js er utdrag av forside.css og forside.js mellom markørene importfilm:start og
// importfilm:slutt, så filmen og båndet oppfører seg likt og endringer på forsiden følger med.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { forsideBlokker } from './forside.mjs';

export const HANNA_SIDER = { nb: 'hanna', sv: 'sv/hanna', da: 'da/hanna', en: 'en/hanna' };
export const BLOKKER = ['bevis', 'film', 'kilder'];

export function settInnBlokk(html, navn, innhold) {
  const apner = `<!-- hanna:${navn} -->`, lukker = `<!-- /hanna:${navn} -->`;
  const a = html.indexOf(apner), b = html.indexOf(lukker);
  if (a < 0 || b < a) throw new Error(`Mangler markørene ${apner} ... ${lukker}`);
  return html.slice(0, a + apner.length) + innhold + html.slice(b);
}

export function utdrag(kilde, marker, navn) {
  const deler = [...kilde.matchAll(new RegExp(`${marker('start')}\\n([\\s\\S]*?)\\n\\s*${marker('slutt')}`, 'gu'))].map((m) => m[1]);
  if (deler.length === 0) throw new Error(`Fant ingen importfilm-markører i ${navn}`);
  return deler.join('\n');
}

export function importfilmCss(forsideCss) {
  return `/* GENERERT av scripts/hanna-innhold.mjs fra forside.css (importfilm:start til importfilm:slutt). Ikke rediger. */\n${utdrag(forsideCss, (k) => `/\\*importfilm:${k}\\*/`, 'forside.css')}\n`;
}

export function importfilmJs(forsideJs) {
  return `// GENERERT av scripts/hanna-innhold.mjs fra forside.js (importfilm:start til importfilm:slutt). Ikke rediger.\n(() => {\n${utdrag(forsideJs, (k) => `// importfilm:${k}`, 'forside.js')}\n})();\n`;
}

export function kjor(rot) {
  for (const [sprak, mappe] of Object.entries(HANNA_SIDER)) {
    const sti = join(rot, mappe, 'index.html');
    const blokker = forsideBlokker(sprak);
    let html = readFileSync(sti, 'utf8');
    for (const navn of BLOKKER) html = settInnBlokk(html, navn, blokker[navn]);
    writeFileSync(sti, html);
  }
  writeFileSync(join(rot, 'importfilm.css'), importfilmCss(readFileSync(join(rot, 'forside.css'), 'utf8')));
  writeFileSync(join(rot, 'importfilm.js'), importfilmJs(readFileSync(join(rot, 'forside.js'), 'utf8')));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  kjor(fileURLToPath(new URL('..', import.meta.url)));
}

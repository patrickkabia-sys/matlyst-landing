import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import test from 'node:test';

const rot = fileURLToPath(new URL('..', import.meta.url));
const les = (fil) => readFileSync(join(rot, fil), 'utf8');
const css = les('tokens.css');
const verdi = (navn) => css.match(new RegExp(`--${navn}:\\s*([^;]+);`))?.[1].trim();

// WCAG 2.x: relativ luminans og kontrastforhold.
function luminans(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function kontrast(a, b) {
  const [lys, mork] = [luminans(a), luminans(b)].sort((x, y) => y - x);
  return (lys + 0.05) / (mork + 0.05);
}

test('tokens har verdiene fra specens punkt 6', () => {
  assert.deepEqual(
    ['flate', 'hylle', 'linje', 'blekk', 'blekk-lys', 'dempet', 'a-tekst', 'a-dempet', 'a-oransje', 'a-knapp', 'a-merke', 'a-gronn'].map(verdi),
    ['#FFFFFF', '#F5F3EF', '#E6E2DB', '#141210', '#2B2723', '#5F5952', '#1A1714', '#69645E', '#B03B00', '#B34600', '#FF5500', '#146B3A'],
  );
});

test('tokens har flaten, kula, skriftene og bevegelseskurven', () => {
  assert.equal(verdi('a-flate'), '#FFFFFF');
  assert.deepEqual(['kule1', 'kule2', 'kule3'].map(verdi), ['#F9C8B3', '#EFC5D4', '#BEB4DF']);
  assert.match(verdi('f'), /^'Schibsted Grotesk'/);
  assert.match(verdi('mono'), /^'IBM Plex Mono'/);
  assert.equal(verdi('ut'), 'cubic-bezier(.16,1,.3,1)');
});

test('tekstfargene holder AA mot flatene de står på', () => {
  for (const [tekst, flate] of [['dempet', 'flate'], ['dempet', 'hylle'], ['blekk', 'hylle'], ['a-dempet', 'a-flate'], ['a-oransje', 'a-flate'], ['a-gronn', 'a-flate']]) {
    assert.ok(kontrast(verdi(tekst), verdi(flate)) >= 4.5, `${tekst} på ${flate}`);
  }
  assert.ok(kontrast('#A8A199', verdi('blekk')) >= 4.5, 'støttetekst på mørk bunn');
  assert.ok(kontrast('#FFFFFF', verdi('a-knapp')) >= 4.5, 'hvit tekst på fylt knapp');
});

test('hver skriftfil finnes, og ingen skrift hentes utenfra', () => {
  const kilder = [...css.matchAll(/url\(([^)]+)\)/g)].map((m) => m[1].replace(/["']/g, ''));
  assert.ok(kilder.length >= 6);
  for (const sti of kilder) { assert.match(sti, /^\/fonts\/[\w-]+\.woff2$/); assert.ok(existsSync(join(rot, sti))); }
  assert.doesNotMatch(css, /googleapis|gstatic/);
});

test('alle fem skriftfamiliene er deklarert', () => {
  const familier = new Set([...css.matchAll(/font-family:\s*'([^']+)'/g)].map((m) => m[1]));
  for (const f of ['Schibsted Grotesk', 'IBM Plex Mono', 'Fraunces', 'DM Sans', 'Fraunces Ordmerke']) {
    assert.ok(familier.has(f), `${f} mangler som @font-face`);
  }
});

test('lisensene følger de nye skriftene', () => {
  for (const fil of ['fonts/schibsted-grotesk-OFL.txt', 'fonts/ibm-plex-mono-OFL.txt']) {
    assert.match(les(fil), /SIL Open Font License/);
  }
});

test('tokens.css har ingen velgere utenom :root og @font-face', () => {
  assert.deepEqual([...css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/(^|\})\s*([^{}@]+)\{/g)].map((m) => m[2].trim()).filter((v) => v !== ':root'), []);
});

test('skallet bruker prototypens skyggefarge', () => {
  assert.equal(verdi('skygge'), '40 30 18');
});

test('kulas lys og refleks og svarets kant har nøyaktig prototypens verdier', () => {
  assert.deepEqual(['kule-topp', 'kule-dyp', 'kule-kant', 'kule-rosa', 'kule-lys', 'kule-refleks', 'a-kant'].map(verdi),
    ['#FFF4EC', '#8A7CC2', '86 68 156', '#EE92BB', '255 249 238', '167 149 209', 'rgb(90 70 50 / .14)']);
});

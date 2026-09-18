import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import test from 'node:test';

const ROT = new URL('..', import.meta.url).pathname;

function* html(dir) {
  for (const navn of readdirSync(dir)) {
    if (navn === 'node_modules' || navn === '.git' || navn === 'fonts') continue;
    const sti = join(dir, navn);
    if (statSync(sti).isDirectory()) yield* html(sti);
    else if (navn.endsWith('.html')) yield sti;
  }
}

const css = () => readFileSync(join(ROT, 'styles.css'), 'utf8');

test('ingen side laster fonter fra en tredjepart', () => {
  const brudd = [...html(ROT)].filter((f) =>
    /fonts\.(googleapis|gstatic)\.com/.test(readFileSync(f, 'utf8')),
  );
  assert.deepEqual(brudd, [], `laster Google Fonts: ${brudd.join(', ')}`);
});

test('stilarket henter ingen font fra en tredjepart', () => {
  assert.doesNotMatch(css(), /fonts\.(googleapis|gstatic)\.com/u);
  assert.doesNotMatch(css(), /@import/u);
});

test('stilarket definerer begge fontene lokalt med font-display: swap', () => {
  const blokker = [...css().matchAll(/@font-face\s*\{([^}]*)\}/gu)].map((m) => m[1]);
  assert.ok(blokker.length > 0, 'fant ingen @font-face i styles.css');

  const familier = new Set(
    blokker.map((b) => b.match(/font-family:\s*'([^']+)'/u)?.[1]),
  );
  assert.ok(familier.has('Fraunces'), 'Fraunces mangler som @font-face');
  assert.ok(familier.has('DM Sans'), 'DM Sans mangler som @font-face');

  for (const b of blokker) {
    assert.match(b, /font-display:\s*swap/u, `@font-face uten swap: ${b.trim()}`);
  }
});

test('hver fontfil som stilarket peker på finnes i repoet', () => {
  const urler = [...css().matchAll(/url\(([^)]+)\)/gu)]
    .map((m) => m[1].replace(/['"]/gu, '').trim())
    .filter((u) => /\.woff2?$/u.test(u));
  assert.ok(urler.length >= 6, `fant bare ${urler.length} fontfiler i stilarket`);
  for (const u of urler) {
    const sti = join(ROT, u.replace(/^\//u, ''));
    assert.ok(existsSync(sti), `fontfil mangler i repoet: ${u}`);
  }
});

test('lisensen følger fontfilene', () => {
  for (const fil of ['fonts/fraunces-OFL.txt', 'fonts/dm-sans-OFL.txt']) {
    const tekst = readFileSync(join(ROT, fil), 'utf8');
    assert.match(tekst, /SIL Open Font License/u, `${fil} ser ikke ut som en OFL-lisens`);
  }
});

test('alle vektene sidene bruker er dekket av de lokale fontene', () => {
  const blokker = [...css().matchAll(/@font-face\s*\{([^}]*)\}/gu)].map((m) => m[1]);
  function dekker(familie, stil, vekt) {
    return blokker.some((b) => {
      if (b.match(/font-family:\s*'([^']+)'/u)?.[1] !== familie) return false;
      if ((b.match(/font-style:\s*(\w+)/u)?.[1] ?? 'normal') !== stil) return false;
      const w = b.match(/font-weight:\s*([\d\s]+);/u)?.[1].trim().split(/\s+/u).map(Number) ?? [400];
      const [min, maks] = w.length === 2 ? w : [w[0], w[0]];
      return vekt >= min && vekt <= maks;
    });
  }
  for (const vekt of [300, 400, 500]) {
    assert.ok(dekker('Fraunces', 'normal', vekt), `Fraunces normal ${vekt} mangler`);
  }
  for (const vekt of [300, 400]) {
    assert.ok(dekker('Fraunces', 'italic', vekt), `Fraunces kursiv ${vekt} mangler`);
  }
  for (const vekt of [300, 400, 500, 600]) {
    assert.ok(dekker('DM Sans', 'normal', vekt), `DM Sans ${vekt} mangler`);
  }
});

// Fire sider har egne, fullstendige stilark i markupen og lenker ikke
// /styles.css. De trenger derfor sine egne @font-face. Testen sammenligner dem
// mot styles.css i stedet for å gjenta mønsteret, slik at et par som driver fra
// hverandre blir rødt.
const SIDER_MED_EGET_STILARK = [
  'personvern.html',
  'slett-konto.html',
  'vilkar.html',
  'avmeld/index.html',
];

function fontFaces(tekst) {
  return [...tekst.matchAll(/@font-face\s*\{[^}]*\}/gu)].map((m) => m[0].replace(/\s+/gu, ''));
}

test('sidene med eget stilark har nøyaktig de samme @font-face som styles.css', () => {
  const fasit = fontFaces(css());
  assert.ok(fasit.length >= 6, `styles.css har bare ${fasit.length} @font-face`);
  for (const side of SIDER_MED_EGET_STILARK) {
    const sti = join(ROT, side);
    const tekst = readFileSync(sti, 'utf8');
    assert.ok(!/href="\/?styles\.css"/u.test(tekst), `${side} lenker nå styles.css, oppdater lista i testen`);
    assert.deepEqual(fontFaces(tekst), fasit, `${side} har andre @font-face enn styles.css`);
  }
});

test('personvernerklæringen sier ikke lenger at skriftene hentes fra Google', () => {
  const tekst = readFileSync(join(ROT, 'personvern.html'), 'utf8');
  assert.doesNotMatch(tekst, /Google Fonts/u);
  assert.match(tekst, /Skriftene ligger på vår egen server/u);
});

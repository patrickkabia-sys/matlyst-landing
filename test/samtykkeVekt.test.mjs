import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import test from 'node:test';

// Datatilsynet DK og Digitaliseringsstyrelsen (fellesveiledning, mai 2025):
// valget om a avvise skal vaere like synlig som valget om a godta. Testen
// sammenligner derfor de to knappereglene MED HVERANDRE. En test som bare
// sjekker at begge knappene finnes ville vaert gronn ogsa da «Godta» var fylt
// og oransje og «Bare nodvendige» var et gjennomsiktig omriss.

const ROT = new URL('..', import.meta.url).pathname;
// Kommentarer strippes for parsing: kommentaren som forklarer regelen under
// inneholder bade komma og tekst, og ville ellers blitt lest som en del av
// velgeren i regelen rett etter.
const css = readFileSync(join(ROT, 'styles.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//gu, '');
const index = readFileSync(join(ROT, 'index.html'), 'utf8');

// Egenskaper som avgjor hvor mye en knapp veier visuelt.
const VEKTEGENSKAPER = [
  'background',
  'background-color',
  'color',
  'border',
  'border-color',
  'border-width',
  'border-style',
  'padding',
  'font-weight',
  'font-size',
  'font-family',
  'opacity',
  'box-shadow',
  'text-decoration',
  'text-transform',
  'letter-spacing',
  'flex',
  'transform',
];

function regler(kilde) {
  return [...kilde.matchAll(/([^{}]+)\{([^{}]*)\}/gu)].map(([, velger, kropp]) => ({
    velgere: velger.split(',').map((v) => v.trim()),
    erklaeringer: kropp,
  }));
}

// Samler opp hva som faktisk gjelder for en knapp: alle regler som treffer
// den, i filrekkefolge, slik kaskaden ville gjort det.
function effektiv(klasse, tilstand) {
  const treff = {};
  for (const { velgere, erklaeringer } of regler(css)) {
    const gjelder = velgere.some((v) => {
      const suffiks = tilstand ? `:${tilstand}` : '';
      return v === `.ck-btn${suffiks}` || v === `.${klasse}${suffiks}`;
    });
    if (!gjelder) continue;
    for (const del of erklaeringer.split(';')) {
      const [egenskap, ...rest] = del.split(':');
      if (!rest.length) continue;
      const navn = egenskap.trim();
      if (!VEKTEGENSKAPER.includes(navn)) continue;
      treff[navn] = rest.join(':').trim();
    }
  }
  return treff;
}

test('begge samtykkeknappene finnes i banneret', () => {
  assert.match(index, /class="ck-btn ck-accept"[^>]*>Godta</u);
  assert.match(index, /class="ck-btn ck-reject"[^>]*>Bare nødvendige</u);
});

test('«Bare nødvendige» veier nøyaktig like mye som «Godta»', () => {
  const godta = effektiv('ck-accept');
  const avvis = effektiv('ck-reject');
  assert.ok(Object.keys(godta).length > 0, 'fant ingen stil for «Godta»');
  assert.deepEqual(
    avvis,
    godta,
    'de to knappene har ulik visuell vekt: ' +
      JSON.stringify({ godta, avvis }),
  );
});

test('knappene er like også når musepekeren er over dem', () => {
  assert.deepEqual(effektiv('ck-reject', 'hover'), effektiv('ck-accept', 'hover'));
  assert.deepEqual(effektiv('ck-reject', 'focus-visible'), effektiv('ck-accept', 'focus-visible'));
});

test('ingen av knappene er fylt mens den andre bare har omriss', () => {
  const fyll = (t) => {
    const b = t['background'] ?? t['background-color'] ?? 'transparent';
    return !/^(transparent|none|rgba\([^)]*,\s*0\))$/u.test(b);
  };
  assert.equal(
    fyll(effektiv('ck-accept')),
    fyll(effektiv('ck-reject')),
    'den ene knappen er fylt og den andre gjennomsiktig',
  );
});

test('knappeteksten holder AA mot knappeflaten', () => {
  const variabler = Object.fromEntries(
    [...css.matchAll(/--([\w-]+):\s*(#[0-9A-Fa-f]{3,8})/gu)].map((m) => [m[1], m[2]]),
  );
  const los = (v) => {
    const n = v.match(/var\(--([\w-]+)\)/u);
    return (n ? variabler[n[1]] : v).trim();
  };
  const kanal = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const lum = (hex) => {
    const h = hex.replace('#', '');
    const full = h.length === 3 ? h.split('').map((x) => x + x).join('') : h;
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
    return 0.2126 * kanal(r) + 0.7152 * kanal(g) + 0.0722 * kanal(b);
  };
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05);
  };

  for (const klasse of ['ck-accept', 'ck-reject']) {
    const t = effektiv(klasse);
    const tekst = los(t['color']);
    const flate = los(t['background'] ?? t['background-color']);
    assert.match(tekst, /^#[0-9A-Fa-f]{3,8}$/u, `${klasse}: tekstfargen er ikke en hex-verdi`);
    assert.match(flate, /^#[0-9A-Fa-f]{3,8}$/u, `${klasse}: knappeflaten er ikke en hex-verdi`);
    const r = ratio(tekst, flate);
    assert.ok(r >= 4.5, `${klasse}: kontrast ${r.toFixed(2)}:1, AA krever 4,5:1`);
  }
});

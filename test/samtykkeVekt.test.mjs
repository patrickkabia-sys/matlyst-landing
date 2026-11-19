import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { effektiv } from './hjelp/knappevekt.mjs';

// Datatilsynet DK og Digitaliseringsstyrelsen (fellesveiledning, mai 2025):
// valget om a avvise skal vaere like synlig som valget om a godta. Testen
// sammenligner derfor de to knappereglene MED HVERANDRE. En test som bare
// sjekker at begge knappene finnes ville vaert gronn ogsa da «Godta» var fylt
// og oransje og «Bare nodvendige» var et gjennomsiktig omriss.

const ROT = fileURLToPath(new URL('..', import.meta.url));
// Kommentarer strippes for parsing: kommentaren som forklarer regelen under
// inneholder bade komma og tekst, og ville ellers blitt lest som en del av
// velgeren i regelen rett etter.
const css = readFileSync(join(ROT, 'styles.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//gu, '');
const index = readFileSync(join(ROT, 'index.html'), 'utf8');

test('begge samtykkeknappene finnes i banneret', () => {
  assert.match(index, /class="ck-btn ck-accept"[^>]*>Godta</u);
  assert.match(index, /class="ck-btn ck-reject"[^>]*>Bare nødvendige</u);
});

test('«Bare nødvendige» veier nøyaktig like mye som «Godta»', () => {
  const godta = effektiv(css, 'ck-accept');
  const avvis = effektiv(css, 'ck-reject');
  assert.ok(Object.keys(godta).length > 0, 'fant ingen stil for «Godta»');
  assert.deepEqual(
    avvis,
    godta,
    'de to knappene har ulik visuell vekt: ' +
      JSON.stringify({ godta, avvis }),
  );
});

test('knappene er like også når musepekeren er over dem', () => {
  assert.deepEqual(effektiv(css, 'ck-reject', 'hover'), effektiv(css, 'ck-accept', 'hover'));
  assert.deepEqual(effektiv(css, 'ck-reject', 'focus-visible'), effektiv(css, 'ck-accept', 'focus-visible'));
});

test('ingen av knappene er fylt mens den andre bare har omriss', () => {
  const fyll = (t) => {
    const b = t['background'] ?? t['background-color'] ?? 'transparent';
    return !/^(transparent|none|rgba\([^)]*,\s*0\))$/u.test(b);
  };
  assert.equal(
    fyll(effektiv(css, 'ck-accept')),
    fyll(effektiv(css, 'ck-reject')),
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
    const t = effektiv(css, klasse);
    const tekst = los(t['color']);
    const flate = los(t['background'] ?? t['background-color']);
    assert.match(tekst, /^#[0-9A-Fa-f]{3,8}$/u, `${klasse}: tekstfargen er ikke en hex-verdi`);
    assert.match(flate, /^#[0-9A-Fa-f]{3,8}$/u, `${klasse}: knappeflaten er ikke en hex-verdi`);
    const r = ratio(tekst, flate);
    assert.ok(r >= 4.5, `${klasse}: kontrast ${r.toFixed(2)}:1, AA krever 4,5:1`);
  }
});

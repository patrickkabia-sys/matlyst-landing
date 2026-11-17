import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('lokal løkke bygger statiske sider og tester før commit eller PR', () => {
  const tekst = readFileSync(
    new URL('../seo-data/instrukser/lokal-lokke.md', import.meta.url),
    'utf8',
  );

  assert.match(tekst, /node scripts\/generer-norske-importguider\.mjs/u);
  assert.match(tekst, /node scripts\/generer-lokalsider\.mjs/u);
  assert.match(tekst, /npm test/u);
  assert.ok(tekst.indexOf('npm test') < tekst.indexOf('PR fra'));
});

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (name) => readFileSync(new URL('../seo/' + name, import.meta.url), 'utf8');
const svenskSlug = (verdi) => verdi.normalize('NFC').toLowerCase().replace(/[åä]/gu, 'a').replace(/ö/gu, 'o');
const danskSlug = (verdi) => verdi.normalize('NFC').toLowerCase().replace(/æ/gu, 'ae').replace(/ø/gu, 'oe').replace(/å/gu, 'aa');

test('svenske slugs bruker å→a, ä→a og ö→o', () => {
  assert.equal(svenskSlug('töm-kylskåpet'), 'tom-kylskapet');
  assert.equal(svenskSlug('inköpslista'), 'inkopslista');
  assert.equal(svenskSlug('Landleys-kök'), 'landleys-kok');
  const tekst = read('sv-sokeord.md');
  for (const slug of ['/sv/tom-kylskapet/', '/sv/inkopslista/', '/sv/landleys-kok/', '/sv/enkel-middag/']) {
    assert.match(tekst, new RegExp(slug.replaceAll('/', '\\/'), 'u'));
  }
  assert.doesNotMatch(tekst, /\/sv\/(?:toem-kylskapet|inkoepslista|landleys-koek|enkla-middagar)\//u);
});

test('danske slugs bruker æ→ae, ø→oe og å→aa', () => {
  assert.equal(danskSlug('tøm-køleskabet'), 'toem-koeleskabet');
  assert.equal(danskSlug('håndskrevne-opskrifter'), 'haandskrevne-opskrifter');
  const tekst = read('da-sokeord.md');
  assert.match(tekst, /\/da\/toem-koeleskabet\//u);
  assert.doesNotMatch(tekst, /\/da\/tom-koeleskabet\//u);
});

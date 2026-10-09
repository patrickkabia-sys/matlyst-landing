import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const ROOT = new URL('..', import.meta.url).pathname;
const les = (sti) => readFileSync(join(ROOT, sti), 'utf8');

test('bokmålsvilkårene beskriver abonnement, prøveperiode, angrerett og forbrukervern', () => {
  const html = les('vilkar.html');
  assert.match(html, /månedlig eller årlig/u);
  assert.match(html, /gratis prøveperiode på én uke/u);
  assert.match(html, /senest 24 timer før/u);
  assert.match(html, /14 dagers angrerett/u);
  assert.match(html, /ufravikelig forbrukervern/iu);
  assert.match(html, /rett til å saksøke i ditt eget hjemland/u);
  assert.match(html, /Sist oppdatert 9\. oktober 2026/u);
});

test('svenske og danske vilkår forklarer de norske klageorganene', () => {
  const sv = les('sv/villkor/index.html');
  const da = les('da/vilkaar/index.html');
  assert.match(sv, /Forbrukertilsynet \(norsk konsumentmyndighet\)/u);
  assert.match(sv, /Forbrukerklageutvalget \(norsk nämnd för konsumenttvister\)/u);
  assert.match(da, /Forbrukertilsynet \(norsk forbrugermyndighed\)/u);
  assert.match(da, /Forbrukerklageutvalget \(norsk klagenævn for forbrugersager\)/u);
});

test('personvernsidene forklarer ledende og lokale tilsynsmyndigheter', () => {
  const nb = les('personvern.html');
  const sv = les('sv/integritet/index.html');
  const da = les('da/privatliv/index.html');
  assert.match(nb, /Sist oppdatert 9\. oktober 2026/u);
  assert.match(sv, /Senast uppdaterad 9 oktober 2026/u);
  assert.match(da, /Senest opdateret 9\. oktober 2026/u);
  assert.match(nb, /Integritetsskyddsmyndigheten \(imy\.se\)/u);
  assert.match(nb, /Datatilsynet i Danmark \(datatilsynet\.dk\)/u);
  assert.match(sv, /Datatilsynet i Norge \(datatilsynet\.no\) ledande tillsynsmyndighet/u);
  assert.match(sv, /lokala tillsynsmyndighet, Integritetsskyddsmyndigheten \(imy\.se\)/u);
  assert.match(da, /Datatilsynet i Norge \(datatilsynet\.no\) ledende tilsynsmyndighed/u);
  assert.match(da, /lokale tilsynsmyndighed, Datatilsynet i Danmark \(datatilsynet\.dk\)/u);
});

test('generatoren er sannhetskilden for de svenske og danske rettelsene', () => {
  const generator = les('scripts/generer-lokalsider.mjs');
  for (const tekst of [
    'Forbrukertilsynet (norsk konsumentmyndighet)',
    'Forbrukerklageutvalget (norsk nämnd för konsumenttvister)',
    'Forbrukertilsynet (norsk forbrugermyndighed)',
    'Forbrukerklageutvalget (norsk klagenævn for forbrugersager)',
    'ledande tillsynsmyndighet',
    'ledende tilsynsmyndighed',
  ]) assert.ok(generator.includes(tekst), tekst);
});

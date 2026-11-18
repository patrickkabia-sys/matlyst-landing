import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { HYLLER, synligeLenker } from '../scripts/hyller.mjs';

const rot = fileURLToPath(new URL('..', import.meta.url));

test('bokmål har de seks hyllene i specens rekkefølge', () => {
  assert.deepEqual(HYLLER.nb.map((h) => h.navn), ['Appen', 'Lagre oppskrifter', 'Middag', 'Verktøy', 'Kjøkkentips', 'Matlyst']);
});

test('hver synlige lenke peker på en side som finnes', () => {
  for (const hylle of HYLLER.nb) for (const { tekst, href } of synligeLenker(hylle)) {
    if (/^https?:/.test(href)) continue;
    const sti = href.split('#')[0];
    assert.ok(existsSync(join(rot, sti.endsWith('/') ? `${sti}index.html` : sti)), `${hylle.navn}: ${tekst} (${href})`);
  }
});

test('de seks kalkulatorene som ikke finnes, vises ikke', () => {
  const verktoy = HYLLER.nb.find((h) => h.id === 'verktoy');
  const manglerSider = verktoy.lenker.filter((l) => l.finnes === false).map((l) => l.tekst);
  for (const tekst of ['Dl til gram', 'Porsjoner', 'Kakeform', 'Steketid', 'Pizzadeig', 'Gjær']) assert.ok(manglerSider.includes(tekst), tekst);
  assert.ok(!synligeLenker(verktoy).some((l) => l.finnes === false));
});

test('ingen hylle sier kopper i synlig tekst', () => {
  const tekster = HYLLER.nb.flatMap((h) => [h.navn, ...h.lenker.map((l) => l.tekst)]);
  assert.doesNotMatch(tekster.join('\n'), /kopp/i);
});

test('hver hylle har en flis og unike id-er', () => {
  assert.equal(new Set(HYLLER.nb.map((h) => h.id)).size, 6);
  for (const h of HYLLER.nb) assert.match(h.flis, /^[\w-]+\.webp$/);
});

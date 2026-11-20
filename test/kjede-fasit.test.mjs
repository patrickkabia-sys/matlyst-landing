// Byggekjeden (generatorene og etterbehandlingen) skal gi de publiserte sidene. Kjøres i en kopi (kjedeprøven), aldri mot arbeidskopien.
// Kjente avvik står i test/fasit/kjede-kjente-avvik.json; testen feiler ved NYE avvik og ved avvik som er rettet men fortsatt står i fasiten.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { kjor } from '../scripts/kjedeproeve.mjs';
import { ETTERBEHANDLING, GENERATORER, KJEDE } from '../scripts/kjede.mjs';

const rot = fileURLToPath(new URL('..', import.meta.url));
const fasit = JSON.parse(readFileSync(new URL('./fasit/kjede-kjente-avvik.json', import.meta.url), 'utf8'));

test('kjeden er generatorene først og så etterbehandlingen, med forsidene sist', () => {
  assert.deepEqual(KJEDE, [...GENERATORER, ...ETTERBEHANDLING]);
  assert.ok(KJEDE.indexOf('forside') > KJEDE.indexOf('omregner-flertall'));
  assert.deepEqual(KJEDE.slice(-3), ['forside', 'lastmod', 'llms']);
  assert.ok(KJEDE.indexOf('skall-paa') > KJEDE.indexOf('generer-lokalsider'));
  assert.ok(KJEDE.indexOf('omregner-flertall') > KJEDE.indexOf('skall-paa'));
});

test('byggekjeden gir de publiserte sidene: bare de kjente avvikene i fasiten', { timeout: 300_000 }, () => {
  const { avvik, hasher } = kjor(rot, 'alle');
  const kjente = Object.keys(fasit.avvik).sort();
  assert.deepEqual(avvik.filter((sti) => !kjente.includes(sti)), [], 'NYE avvik: generatorene gir noe annet enn de publiserte sidene');
  assert.deepEqual(kjente.filter((sti) => !avvik.includes(sti)), [], 'avvik som er rettet står fortsatt i fasiten');
  // Unntaket gjelder bare akkurat dette innholdet: en ny forskjell i den publiserte eller genererte fila gir rødt.
  for (const sti of kjente) {
    assert.equal(hasher[sti].publisert, fasit.avvik[sti].sha256_publisert, `${sti}: den publiserte fila er endret siden fasiten`);
    assert.equal(hasher[sti].generert, fasit.avvik[sti].sha256_generert, `${sti}: den genererte fila er endret siden fasiten`);
  }
});

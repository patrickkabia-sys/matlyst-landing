import test from 'node:test';
import assert from 'node:assert/strict';

import {
  kanPublisere,
  lesModus,
  osloDato,
  skalSperre,
  tellAvvisningerPåRad,
} from '../seo-motor/modus.mjs';

test('ukjent variabel gir av', () => {
  assert.equal(lesModus({ variabel: 'aktiv', sperre: null }), 'av');
});

test('sperre tvinger utkast', () => {
  assert.equal(lesModus({ variabel: 'på', sperre: { grunn: 'tre avvisninger' } }), 'utkast');
});

test('andre kjøring samme Oslo-døgn nektes', () => {
  const publisert = [{ dato: osloDato(new Date('2026-03-29T00:30:00Z')) }];

  assert.equal(kanPublisere(publisert, new Date('2026-03-29T21:30:00Z')), false);
  assert.equal(kanPublisere(publisert, new Date('2026-03-29T22:30:00Z')), true);
});

test('tre avvisninger på rad gir sperre', () => {
  const antall = tellAvvisningerPåRad([
    { resultat: 'publisert' },
    { resultat: 'avvist' },
    { resultat: 'avvist' },
    { resultat: 'avvist' },
  ]);

  assert.equal(antall, 3);
  assert.equal(skalSperre(antall), true);
});

test('tom kø teller ikke som avvisning', () => {
  const antall = tellAvvisningerPåRad([
    { resultat: 'avvist' },
    { resultat: 'avvist' },
    { resultat: 'tom' },
  ]);

  assert.equal(antall, 0);
  assert.equal(skalSperre(antall), false);
});

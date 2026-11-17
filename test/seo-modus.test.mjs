import test from 'node:test';
import assert from 'node:assert/strict';

import {
  kanPublisere,
  lesModus,
  osloDato,
  skalSperre,
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

test('tre registrerte avvisninger gir sperre', () => {
  assert.equal(skalSperre(2), false);
  assert.equal(skalSperre(3), true);
});

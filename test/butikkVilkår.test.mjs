import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const ROOT = new URL('..', import.meta.url).pathname;
const les = (sti) => readFileSync(join(ROOT, sti), 'utf8');

const PROVEPERIODE = {
  sv: 'Årsabonnemanget kan börja med en gratis provperiod på en vecka. Provperioden övergår i ett betalt abonnemang om du inte säger upp det senast 24 timmar innan den tar slut.',
  da: 'Årsabonnementet kan begynde med en gratis prøveperiode på 1 uge. Prøveperioden fortsætter som et betalt årsabonnement, hvis du ikke opsiger senest 24 timer før prøveperiodens udløb.',
};

test('svenske og danske vilkår har butikkens prøveperiode og 24-timersfrist', () => {
  assert.ok(les('sv/villkor/index.html').includes(PROVEPERIODE.sv));
  assert.ok(les('da/vilkaar/index.html').includes(PROVEPERIODE.da));

  const generator = les('scripts/generer-lokalsider.mjs');
  assert.ok(generator.includes(PROVEPERIODE.sv));
  assert.ok(generator.includes(PROVEPERIODE.da));
});

test('juridisk kildeoversikt dokumenterer App Store-prøveperioden', () => {
  const kilder = les('qa/sv-da/juridiske-kilder.md');
  assert.match(kilder, /gratis prøveperiode på én uke/iu);
  assert.match(kilder, /App Store Connect/u);
  assert.match(kilder, /2026-10-05/u);
});

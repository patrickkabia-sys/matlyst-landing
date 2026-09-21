import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const filnavn = 'googleeaf5ec75e707227b.html';

test('Search Console-verifiseringsfilen har Googles eksakte innhold', () => {
  const innhold = readFileSync(new URL(`../${filnavn}`, import.meta.url), 'utf8');
  assert.equal(innhold, `google-site-verification: ${filnavn}\n`);
});

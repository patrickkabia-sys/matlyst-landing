// Alle sider med samtykkebanner skal ha kontrollen for å trekke samtykket tilbake
// (GDPR art. 7(3)), uansett sidetype og språk. Sidene utledes fra alleSider(), ikke fra en liste.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { alleSider } from '../scripts/sidetyper.mjs';

const rot = new URL('..', import.meta.url).pathname;
const lesSide = (s) => readFileSync(new URL(`../${s.fil}`, import.meta.url), 'utf8');
const medBanner = alleSider(rot).filter((s) => lesSide(s).includes('id="ck-accept"'));

test('det finnes sider med samtykkebanner å sjekke', () => {
  assert.ok(medBanner.length > 100, `bare ${medBanner.length} sider med banner`);
  assert.ok(medBanner.some((s) => s.familie === 'tjeneste:kampanje'), 'kampanjesidene må være med');
});

test('alle sider med samtykkebanner har data-consent-withdraw', () => {
  const mangler = medBanner.filter((s) => !/<a\b[^>]*\bdata-consent-withdraw\b/u.test(lesSide(s))).map((s) => s.sti);
  assert.deepEqual(mangler, [], `Mangler lenke for å trekke samtykke: ${mangler.join(', ')}`);
});

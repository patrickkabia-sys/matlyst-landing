import assert from 'node:assert/strict';
import test from 'node:test';
import { beregn, blokk, kartForSprak, settInn, tittel } from '../scripts/lenker-sett.mjs';

const kart = { hubber: { a: { hub: '/en/h/', tilleggshubber: ['/en/h2/'], eiker: ['/en/e1/', '/en/e2/', '/en/e3/'], planlagt: ['/en/p/'] } } };

test('hub lenker til alle eiker og planlagte sider', () => {
  const per = beregn(kart, '/en/');
  assert.deepEqual(per.get('/en/h/'), ['/en/e1/', '/en/e2/', '/en/e3/', '/en/p/']);
});

test('eike lenker opp til hub og tilleggshub og til to søsken, aldri til seg selv', () => {
  const per = beregn(kart, '/en/');
  assert.deepEqual(per.get('/en/e1/'), ['/en/h/', '/en/h2/', '/en/e2/', '/en/e3/']);
  assert.ok(!per.get('/en/e2/').includes('/en/e2/'));
});

test('forsiden lenker til hubbene', () => {
  assert.deepEqual(beregn(kart, '/en/').get('/en/'), ['/en/h/']);
});

test('settInn er idempotent og legger blokken før FAQ', () => {
  const html = '<main><section class="prose"></section><section class="faq"></section></main>';
  const b = blokk('en', [['/en/h/', 'Hub']]);
  const en = settInn(html, b);
  assert.ok(en.indexOf('relatert:start') < en.indexOf('class="faq"'));
  assert.equal(settInn(en, b), en);
  assert.equal(en.match(/relatert:start/gu).length, 1);
});

test('tittel fjerner merkenavnet', () => {
  assert.equal(tittel('<title>Pantry app | Matlyst</title>'), 'Pantry app');
});

test('kartet oversettes til nordiske språk via sidegruppene, og hubbene finnes i alle språk', () => {
  const en = { hubber: { l: { hub: '/en/recipe-book-app/', eiker: ['/en/import-recipes-from-instagram/', '/en/import-recipes-from-tiktok/'], planlagt: [] } } };
  assert.deepEqual(kartForSprak(en, 'nb').hubber.l.hub, '/oppskriftsbok-app/');
  assert.deepEqual(kartForSprak(en, 'sv').hubber.l.eiker, ['/sv/spara-recept-fran-instagram/', '/sv/spara-recept-fran-tiktok/']);
  assert.deepEqual(kartForSprak(en, 'da').hubber.l.hub, '/da/opskrifts-app/');
});

test('generatoren for relaterte lenker lar rotsiden stå urørt', () => {
  const html = '<main id="hovedinnhold">Ny forside</main>';
  assert.equal(settInn(html, blokk('nb', [['/ukemeny/', 'Ukemeny']]), '/'), html);
});

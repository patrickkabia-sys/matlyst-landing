import { krevGuidemeny } from './hjelp/guidemeny.mjs';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
const rot = fileURLToPath(new URL('..', import.meta.url));
import { SITEMAPER, UTELATT, MONSTER, filFor, guider, settInn } from '../scripts/guidelenker.mjs';
import { hylledel } from '../scripts/skall.mjs';

const VIA_HUB = {
  // Landleys Kök nås gjennom importhubbens kuraterte relatert-blokk.
  '/importer-fra-landleys-kok/': '/importer-oppskrifter/',
  // Alletiders Kogebog nås gjennom importhubbens kuraterte relatert-blokk.
  '/importer-fra-alletiders-kokebok/': '/importer-oppskrifter/',
  // DR Mad nås gjennom importhubbens kuraterte relatert-blokk.
  '/importer-fra-dr-mat/': '/importer-oppskrifter/',
};

// Låser at ingen guide er foreldreløs: hver side i en sitemap med bunntekst skal
// lenke til guidene på sitt språk. Rotsiden bruker det nye sideskallet og kan
// også lenke gjennom en hub. Andre sider beholder den felles guideblokken.
for (const lang of Object.keys(SITEMAPER)) {
  const liste = guider(lang);

  test(`${lang}: guidelista har innhold og ingen juridiske sider`, () => {
    assert.ok(liste.length >= 15, `bare ${liste.length} guider`);
    for (const { sti, tekst } of liste) {
      assert.ok(!UTELATT.has(sti), sti);
      assert.ok(tekst.length > 0, `tom lenketekst for ${sti}`);
      assert.doesNotMatch(tekst, /[—–]/u, `tankestrek i lenketeksten for ${sti}`);
    }
  });

  const sider = [...readFileSync(new URL(`../${SITEMAPER[lang]}`, import.meta.url), 'utf8')
    .matchAll(/<loc>https:\/\/matlyst-app\.no([^<]+)<\/loc>/gu)].map((m) => m[1]);

  test(`${lang}: hver side lenker til alle guidene på sitt språk`, () => {
    for (const side of sider) {
      const html = readFileSync(filFor(side), 'utf8');
      if (!html.includes('</footer>')) continue;
      // Det nye sideskallet lenker til guider direkte eller gjennom en synlig hub.
      // Ingen guide får forsvinne fra navigasjonen når den gamle lenkelista fjernes.
      if (side === '/') {
        krevGuidemeny(html, liste, VIA_HUB, (sti) => readFileSync(filFor(sti), 'utf8'));
        continue;
      }
      const blokk = html.match(MONSTER)?.[0];
      assert.ok(blokk, `${side} mangler guideblokken`);
      for (const { sti } of liste) {
        assert.ok(blokk.includes(`href="${sti}"`), `${side} lenker ikke til ${sti}`);
      }
    }
  });
}

test('bunnteksten lenker ikke til enkeltsider under en hub (ingen lenkefarm)', () => {
  for (const lang of Object.keys(SITEMAPER)) {
    const liste = guider(lang);
    assert.ok(liste.length <= 40, `${lang}: ${liste.length} lenker i bunnteksten`);
    assert.ok(!liste.some(({ sti }) => /\/(tools|verktoy|verktyg|vaerktoejer)\/[a-z-]+-(to|til|till)-/u.test(sti)), `${lang}: omregner i bunnteksten`);
  }
  assert.ok(guider('en').some(({ sti }) => sti === '/en/tools/unit-converter/'), 'huben skal stå i bunnteksten');
  assert.ok(guider('en').some(({ sti }) => sti === '/en/holidays/'), 'høytidshuben skal stå i bunnteksten');
});

test('guidelenkegeneratoren lar rotsiden stå urørt', () => {
  const html = readFileSync(join(rot, 'index.html'), 'utf8');
  assert.equal(settInn(html, '<p>Uønsket guideblokk</p>', '/'), html);
});

test('settInn bruker plassen i hylledelen når blokka mangler, og er idempotent', () => {
  const html = `${hylledel('nb')}<footer></footer>`;
  const ny = '<!-- guider:bunn --><div class="f-guider">x</div><!-- /guider:bunn -->';
  const ut = settInn(html, ny);
  assert.ok(ut.indexOf(ny) > ut.indexOf('<summary>') && ut.indexOf(ny) < ut.indexOf('</details>'));
  assert.equal(settInn(ut, ny), ut);
  assert.ok(!ut.includes('<!-- guider:plass -->'));
  assert.ok(!ut.includes('</footer>') || ut.indexOf(ny) < ut.indexOf('<footer>'), 'blokka står ikke i bunnteksten');
});

test('settInn faller tilbake til bunnteksten uten plass, og tåler $ i blokka', () => {
  const ny = '<!-- guider:bunn --><a>$& $1</a><!-- /guider:bunn -->';
  assert.ok(settInn('<footer></footer>', ny).includes(ny));
});

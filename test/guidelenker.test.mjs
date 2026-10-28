import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { SITEMAPER, UTELATT, MONSTER, filFor, guider } from '../scripts/guidelenker.mjs';

// Låser at ingen guide er foreldreløs: hver side i en sitemap med bunntekst skal
// lenke til alle guidene på sitt språk. En generator som skriver en side på nytt
// uten blokken gjør denne rød; kjør da node scripts/guidelenker.mjs.
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
      const blokk = html.match(MONSTER)?.[0];
      assert.ok(blokk, `${side} mangler guideblokken`);
      for (const { sti } of liste) {
        assert.ok(blokk.includes(`href="${sti}"`), `${side} lenker ikke til ${sti}`);
      }
    }
  });
}

import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { BLOGGROT, bloggArtikler } from '../scripts/blogg.mjs';

const ROT = new URL('../', import.meta.url);
const les = (sti) => readFileSync(new URL(`.${sti}index.html`, ROT), 'utf8');
const celle = (html) => String(html).replace(/<small>(.*?)<\/small>/gu, ' <span class="merknad">($1)</span>');
const ren = (html) => String(html).replace(/<small>.*?<\/small>/gu, '').replace(/<[^>]+>/gu, '').trim();

for (const lang of Object.keys(BLOGGROT)) {
  const artikler = bloggArtikler(lang);

  test(`${lang}: bloggen har artikler og en forside som lenker til alle`, () => {
    assert.ok(artikler.length >= 7, `${lang}: ${artikler.length} artikler`);
    const indeks = les(BLOGGROT[lang]);
    for (const a of artikler) assert.ok(indeks.includes(`href="${a.path}"`), `${lang}: forsiden lenker ikke til ${a.path}`);
  });

  test(`${lang}: hver artikkel har hele karusellen, bildene og app-CTA-en`, () => {
    for (const a of artikler) {
      const html = les(a.path);
      assert.match(html, new RegExp(`<h1 class="disp">${a.title.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')}</h1>`, 'u'), a.path);
      for (const side of a.karusell.sider.filter((s) => s.type === 'tabell')) {
        assert.ok(html.includes(`<h2>${ren(side.tittel)}</h2>`), `${a.path}: mangler «${ren(side.tittel)}»`);
        for (const [venstre, hoyre] of side.rader) {
          const rad = `<tr><th scope="row">${celle(venstre)}</th><td>${celle(hoyre)}</td></tr>`;
          assert.ok(html.includes(rad), `${a.path}: mangler raden «${ren(venstre)}»`);
        }
        if (side.notis) assert.ok(html.includes(side.notis), `${a.path}: mangler notisen under «${ren(side.tittel)}»`);
      }
      for (const fil of a.karusell.bilder) {
        assert.ok(existsSync(new URL(`images/blogg/${lang}/${a.tema}/${fil}`, ROT)), `${a.path}: mangler bildet ${fil}`);
      }
      assert.match(html, /class="app-cta"/u, a.path);
      assert.match(html, /"@type":"Article"/u, a.path);
    }
  });
}

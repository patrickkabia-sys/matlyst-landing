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

// Tallene om mattrygghet i rester- og fryserartiklene er rettet til kildene (Mattilsynet først, MatPrat med årstall).
// karuseller.json skrives på nytt av eksporter-karuseller.mjs fra marketing-mappa; vakten under blir rød
// hvis en ny eksport tar med de gamle tallene uten kilde tilbake.
const lesKarusell = () => JSON.parse(readFileSync(new URL('blogg-kilde/karuseller.json', ROT), 'utf8'));
const GAMLE_TALL = {
  rester: [/kokt ris', '<b>1<\/b> d/u, /kogte ris', '<b>1<\/b> d/u, /kokt fisk|kogt fisk/u, /<b>én<\/b> gang|<b>en<\/b> gång/u, /rykende|rykande|rygende/u],
  fryser: [/<b>12<\/b> m/u, /<b>3<\/b> m[nåd]+\.?'\],\s*\['(?:kaker|kakor|kager)/u, /kokt ris|kogte ris/u, /brød og boller|bröd och bullar/u],
};
for (const lang of ['nb', 'sv', 'da']) {
  for (const [tema, forbudt] of Object.entries(GAMLE_TALL)) {
    test(`${lang}/${tema}: ingen tall uten kilde, og kildene står på siden`, () => {
      const karusell = lesKarusell()[lang][tema];
      assert.ok(karusell, `${lang}/${tema} mangler`);
      const tekst = JSON.stringify(karusell.sider).replaceAll('"', "'") + karusell.ingress;
      for (const m of forbudt) assert.doesNotMatch(tekst, m, `${lang}/${tema}: gammelt tall uten kilde (${m})`);
      const a = bloggArtikler(lang).find((x) => x.tema === tema);
      assert.ok(a, `${lang}/${tema}: artikkelen finnes ikke`);
      const html = les(a.path);
      assert.match(html, /<h2 id="kilder">/u, `${a.path}: mangler kildeseksjonen`);
      for (const url of ['https://www.mattilsynet.no/mat-og-drikke/forbrukere/rad-for-oppbevaring-av-mat', tema === 'rester' ? 'https://www.matprat.no/artikler/oppbevaring-og-holdbarhet/hvordan-oppbevare-rester-av-ris-og-pasta/' : 'https://www.matprat.no/artikler/oppbevaring-og-holdbarhet/oppbevaring-i-fryser/']) {
        assert.ok(html.includes(`href="${url}"`), `${a.path}: mangler lenke til ${url}`);
      }
      const start = html.indexOf('<h2 id="kilder">');
      const kilder = html.slice(start, html.indexOf('</section>', start));
      assert.ok(kilder.indexOf('mattilsynet.no') > -1 && kilder.indexOf('matprat.no') > kilder.indexOf('mattilsynet.no'), `${a.path}: Mattilsynet skal stå før MatPrat`);
    });
  }
}

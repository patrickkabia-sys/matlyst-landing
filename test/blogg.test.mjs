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

// Kjernetemperatur, koketider og airfryer: tallene står i kildene (Mattilsynet først, så MatPrat, Arla og Philips med årstall).
// Gamle tall uten kilde (laks 50, kylling 12 osv.) skal ikke komme tilbake med en ny eksport fra marketing-mappa.
const GAMLE_TALL_2 = {
  kjernetemp: [/'<b>52<\/b> °C'|<b>52<\/b>/u, /<b>58<\/b>/u, /<b>65–70<\/b>/u, /<b>50<\/b> °C/u, /laks på 50|lax vid 50|laks ved 50/u, /10 minutter|10 minuter|10 minuten/u],
  koketid: [/<b>18–22<\/b>/u, /<b>8–12<\/b>/u, /<b>10–12<\/b>/u, /brokkoli|blomkål|quinoa|jasminris/u],
  airfryer: [/<b>20<\/b> °C lavere|<b>20<\/b> °C lägre/u, /220 °C, 30 min/u, /<b>180<\/b> °C, <b>20<\/b>|<b>200<\/b> °C, <b>24<\/b>/u, /20 grader|20 grader/u],
};
const KILDE_URLER = {
  kjernetemp: ['https://www.mattilsynet.no/mat-og-drikke/forbrukere/mat-i-sommervarmen', 'https://www.matprat.no/artikler/steke--og-koketips/steke--og-koketips-for-lammekjott/', 'https://www.matprat.no/artikler/steke--og-koketips/steke--og-koketips-for-svinekjott/', 'https://www.matprat.no/artikler/steke--og-koketips/steke--og-koketips-for-fisk-og-skalldyr/'],
  koketid: ['https://www.matprat.no/artikler/tilberedning/slik-koker-du-egg/', 'https://www.matprat.no/oppskrifter/tradisjon/hvordan-koke-poteter/', 'https://www.matprat.no/oppskrifter/tradisjon/hvordan-koke-ris/'],
  airfryer: ['https://www.mattilsynet.no/mat-og-drikke/forbrukere/mat-i-sommervarmen', 'https://www.arla.dk/opskrifter/leksikon/viden/airfryer/', 'https://dam.versuni.com/m/59b7caa0caaf68e4/original/User-Manual-Philips-Essential-Airfryer.pdf'],
};
for (const [tema, forbudt] of Object.entries(GAMLE_TALL_2)) {
  for (const lang of tema === 'koketid' ? ['nb'] : ['nb', 'sv', 'da']) {
    test(`${lang}/${tema}: tallene står i kildene, ingen gamle tall uten kilde`, () => {
      const karusell = lesKarusell()[lang][tema];
      assert.ok(karusell, `${lang}/${tema} mangler`);
      const tekst = JSON.stringify(karusell.sider).replaceAll('"', "'") + karusell.ingress;
      for (const m of forbudt) assert.doesNotMatch(tekst, m, `${lang}/${tema}: gammelt tall uten kilde (${m})`);
      const a = bloggArtikler(lang).find((x) => x.tema === tema);
      assert.ok(a, `${lang}/${tema}: artikkelen finnes ikke`);
      const html = les(a.path);
      const start = html.indexOf('<h2 id="kilder">');
      assert.ok(start > -1, `${a.path}: mangler kildeseksjonen`);
      const kilder = html.slice(start, html.indexOf('</section>', start));
      for (const url of KILDE_URLER[tema]) assert.ok(kilder.includes(`href="${url}"`), `${a.path}: mangler lenke til ${url}`);
      if (kilder.includes('mattilsynet.no') && kilder.includes('matprat.no')) assert.ok(kilder.indexOf('mattilsynet.no') < kilder.indexOf('matprat.no'), `${a.path}: Mattilsynet skal stå før MatPrat`);
      assert.match(html, /"citation":\[/u, `${a.path}: Article-schema mangler citation`);
    });
  }
}
test('nb: kjernetemperatur og koketider og airfryer lenker til familiesidene', () => {
  const kt = les(bloggArtikler('nb').find((x) => x.tema === 'kjernetemp').path);
  assert.ok(kt.includes('href="/kjernetemperatur/"'));
  const kk = les(bloggArtikler('nb').find((x) => x.tema === 'koketid').path);
  assert.ok(kk.includes('href="/steketid/"'));
  const af = les(bloggArtikler('nb').find((x) => x.tema === 'airfryer').path);
  assert.ok(af.includes('href="/airfryer/ovn-til-airfryer/"'));
  assert.ok(existsSync(new URL('airfryer/ovn-til-airfryer/index.html', ROT)));
});
test('kjernetemperatur-bloggen bruker de samme tallene som datafila', () => {
  const d = JSON.parse(readFileSync(new URL('scripts/familier/kjernetemperatur/data.nb.json', ROT), 'utf8'));
  const tall = (id, n) => d.rader.find((r) => r.id === id).tall[n].verdi;
  const tekst = JSON.stringify(lesKarusell().nb.kjernetemp.sider);
  for (const v of [tall('lammelar', 'ben-gj'), tall('svinefilet', 'ind-medium'), tall('oksefilet', 'filet-medium'), tall('biff', 'gj'), tall('laks', 'fisk'), tall('kjottdeig', 'over')]) assert.ok(tekst.includes(`<b>${v}</b>`), `mangler ${v} fra datafila`);
});

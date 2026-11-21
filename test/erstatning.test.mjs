// Familiene «erstatning» (/erstatning/) og «rester» (/hva-kan-jeg-lage/med-<vare>/), bare norsk: adressene er låst,
// hvert tall og hver påstand har et sitat fra en navngitt kilde, og sidene lover ikke mer enn kildene gir.
// Selve kontrollen mot kildesidene krever nett og kjøres med: node scripts/familier/erstatning/kildekontroll.mjs erstatning|rester
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { lesData, publiserbare } from '../scripts/familier/felles.mjs';
import { FAMILIER, familieForSti } from '../scripts/familier/register.mjs';
import { avvik, kildetekst } from '../scripts/familier/erstatning/kildekontroll.mjs';
import { fmt } from '../scripts/familier/erstatning/bygg.mjs';

const ROT = fileURLToPath(new URL('..', import.meta.url));
const familie = (id) => FAMILIER.find((f) => f.id === id);
const data = (id) => lesData(fileURLToPath(familie(id).mappe), 'nb');
const rader = (id) => publiserbare(data(id));
const hoved = (sti) => readFileSync(join(ROT, sti, 'index.html'), 'utf8').match(/<main[\s\S]*?<\/main>/u)?.[0] ?? '';
const tekstAv = (html) => html.replace(/<script[\s\S]*?<\/script>/gu, ' ').replace(/<[^>]+>/gu, ' ').replace(/\s+/gu, ' ');

const ERSTATNING = ['egg', 'kulturmelk-og-kefir', 'bakepulver', 'natron', 'gjaer', 'smor', 'floete', 'creme-fraiche', 'romme', 'melk', 'hvetemel', 'maisenna', 'sukker', 'brun-farin', 'vaniljesukker', 'hvitvin', 'friske-og-torkede-urter', 'hvitlok'];
const RESTER = ['kjottdeig', 'kylling', 'egg', 'poteter', 'kokte-poteter', 'ris', 'pasta', 'laks', 'kokt-skinke', 'floete', 'gulrotter', 'brod', 'bananer', 'epler', 'ribbe-og-pinnekjott'];

test('adresselås: erstatning har samleside og 18 sider, rester har 15 undersider under /hva-kan-jeg-lage/ og bare norsk', () => {
  assert.deepEqual(familie('erstatning').markeder, { nb: { rot: 'erstatning/' } });
  assert.deepEqual(familie('rester').markeder, { nb: { rot: 'hva-kan-jeg-lage/', gruppeFinnes: true } });
  assert.deepEqual(rader('erstatning').map((r) => r.slug), ERSTATNING);
  assert.deepEqual(rader('rester').map((r) => r.slug), RESTER.map((r) => `med-${r}`));
  const kart = readFileSync(join(ROT, 'sitemap.xml'), 'utf8');
  for (const a of ['/erstatning/', ...ERSTATNING.map((s) => `/erstatning/${s}/`), '/hva-kan-jeg-lage/', ...RESTER.map((s) => `/hva-kan-jeg-lage/med-${s}/`)]) {
    assert.match(kart, new RegExp(`<loc>https://matlyst-app\\.no${a}</loc>`, 'u'), a);
    assert.match(readFileSync(join(ROT, a.slice(1), 'index.html'), 'utf8'), new RegExp(`<link rel="canonical" href="https://matlyst-app\\.no${a}">`, 'u'), a);
  }
  for (const mk of ['sv', 'da', 'en']) assert.doesNotMatch(readFileSync(join(ROT, `sitemap-${mk}.xml`), 'utf8'), /\/erstatning\/|hva-kan-jeg-lage\/med-/u, mk);
  assert.equal(familieForSti('/erstatning/egg/'), 'erstatning');
  assert.equal(familieForSti('/hva-kan-jeg-lage/med-egg/'), 'rester');
});

test('samlesidene står i llms.txt, enkeltsidene gjør det ikke, og /hva-kan-jeg-lage/ har fortsatt hreflang til de andre språkene', () => {
  const llms = readFileSync(join(ROT, 'llms.txt'), 'utf8');
  assert.match(llms, /\]\(https:\/\/matlyst-app\.no\/erstatning\/\)/u);
  assert.doesNotMatch(llms, /matlyst-app\.no\/erstatning\/[a-z]/u);
  assert.doesNotMatch(llms, /matlyst-app\.no\/hva-kan-jeg-lage\/med-/u);
  const html = readFileSync(join(ROT, 'hva-kan-jeg-lage/index.html'), 'utf8');
  for (const spraak of ['sv-SE', 'da-DK', 'en']) assert.match(html, new RegExp(`<link rel="alternate" hreflang="${spraak}"`, 'u'), spraak);
});

for (const id of ['erstatning', 'rester']) {
  test(`${id}: hvert tall har et sitat, en kilde med https-adresse og lesedato, og hver tekstpåstand peker på en kilde i fila`, () => {
    const d = data(id);
    for (const r of d.rader) {
      for (const [navn, t] of Object.entries(r.tall)) {
        assert.ok(t.merknad && t.merknad.length > 8, `${id}/${r.id}/${navn}: mangler sitat`);
        assert.ok(d.kilder[t.kilde], `${id}/${r.id}/${navn}: ukjent kilde`);
      }
      for (const [navn, v] of Object.entries(r.tekst ?? {})) {
        const [kilde, ...rest] = v.split('::');
        assert.ok(d.kilder[kilde] && rest.join('::').length > 8, `${id}/${r.id}/${navn}`);
      }
    }
    for (const [kid, k] of Object.entries(d.kilder)) {
      assert.match(k.adresse, /^https:\/\/[^/]+\//u, kid);
      assert.ok(k.aar >= 2017 && k.aar <= 2026, `${kid}: ${k.aar}`);
    }
  });
}

// Tallet i datafila må stå i sitatet: ellers kan en verdi endres uten at kildekontrollen (som sammenligner sitatet med kilden) ser det.
const ORD = { 0.5: ['½', 'halv', 'halve'], 0.25: ['¼'], 1: ['én', 'en ', 'ett', 'en vekt'], 2: ['par', 'to '], 3: ['tre'], 4: ['fire'], 5: ['fem'] };
export function stårISitatet(verdi, sitat) {
  const flat = sitat.replace(/\s+/gu, '').toLowerCase();
  const kandidater = [String(verdi), String(verdi).replace('.', ','), fmt(verdi), ...(ORD[verdi] ?? [])].map((k) => k.replace(/\s+/gu, '').toLowerCase());
  return kandidater.some((k) => flat.includes(k));
}
for (const id of ['erstatning', 'rester']) {
  test(`${id}: verdien til hvert tall står i sitatet fra kilden`, () => {
    for (const r of data(id).rader) {
      for (const [navn, t] of Object.entries(r.tall)) assert.ok(stårISitatet(t.verdi, t.merknad), `${id}/${r.id}/${navn}: ${t.verdi} står ikke i «${t.merknad}»`);
    }
  });
}
test('verdivakten blir rød når verdien ikke er den sitatet sier', () => {
  assert.equal(stårISitatet(0.25, 'vil 1 ts bakepulver kunne erstattes med 1/4 ts natron'), true);
  assert.equal(stårISitatet(0.3, 'vil 1 ts bakepulver kunne erstattes med 1/4 ts natron'), false);
  assert.equal(stårISitatet(1.5, 'kan du tilsette 1/2 ts vaniljeessens, 1, 5 ts vaniljesukker'), true);
  assert.equal(stårISitatet(3, 'Eggehviter | 8-10 dager'), false);
});

test('kildekontrollen blir rød når et sitat ikke står hos kilden, og grønn når det gjør det (også med lenker midt i setningen)', () => {
  const d = { rader: [{ id: 'x', tall: { a: { verdi: 1, enhet: 'ts', kilde: 'k', merknad: 'vil 1 ts bakepulver kunne erstattes med 1/4 ts natron' } }, tekst: { q1: 'k::Siden kefir er litt tykkere enn kulturmelk' } }] };
  const side = kildetekst('<p>Er det syre, vil 1 ts bakepulver kunne erstattes med 1/4 ts natron.</p><p>Siden <a href="/x">kefir</a> er litt tykkere enn kulturmelk, så</p>');
  assert.deepEqual(avvik(d, { k: side }), []);
  const endret = JSON.parse(JSON.stringify(d));
  endret.rader[0].tall.a.merknad = 'vil 1 ts bakepulver kunne erstattes med 1/2 ts natron';
  assert.deepEqual(avvik(endret, { k: side }), [{ id: 'x', felt: 'a', kilde: 'k' }]);
  const endretTekst = JSON.parse(JSON.stringify(d));
  endretTekst.rader[0].tekst.q1 = 'k::Siden kefir er litt tynnere enn kulturmelk';
  assert.deepEqual(avvik(endretTekst, { k: side }), [{ id: 'x', felt: 'q1', kilde: 'k' }]);
  assert.deepEqual(avvik(d, {}), [{ id: 'x', felt: 'a', kilde: 'k' }, { id: 'x', felt: 'q1', kilde: 'k' }], 'en kilde som ikke ble hentet er et avvik');
  assert.equal(fmt(0.25), '1/4');
  assert.equal(fmt(1.5), '1,5');
});

test('sidene har ingen tankestrek, ingen emoji, ingen oppskriftsoverskrifter og ingen mattrygghets- eller allergiråd av oss', () => {
  const alle = [...ERSTATNING.map((s) => `erstatning/${s}`), 'erstatning', ...RESTER.map((s) => `hva-kan-jeg-lage/med-${s}`), 'hva-kan-jeg-lage'];
  for (const sti of alle) {
    // Kildetittelen «Kosthold ved eggallergi» og påminnelsen om at vi ikke gir allergiråd er ikke råd.
    const t = tekstAv(hoved(sti)).replace(/Kosthold ved eggallergi/gu, ' ').replace(/ingen råd om mattrygghet eller allergi/giu, ' ');
    assert.doesNotMatch(t, /[—–]/u, `${sti}: tankestrek`);
    assert.doesNotMatch(t, /\p{Extended_Pictographic}/u, `${sti}: emoji`);
    assert.doesNotMatch(t, /\b(?:Ingredienser|Fremgangsmåte|Slik lager du)\b/u, `${sti}: ser ut som en oppskrift`);
    assert.doesNotMatch(t, /\b(?:allergi|allergiker|intoleranse|anbefaler vi at du spiser|helsegevinst|sunn(?:t|e)?)\b/iu, `${sti}: helse- eller allergiråd`);
  }
});

test('hver side har appkort fra spiskammer og to app-bevis, og lenker til samlesiden', () => {
  for (const [rot, ider] of [['erstatning', ERSTATNING], ['hva-kan-jeg-lage/med', RESTER]]) {
    for (const id of ider) {
      const sti = rot === 'erstatning' ? `erstatning/${id}` : `hva-kan-jeg-lage/med-${id}`;
      const html = readFileSync(join(ROT, sti, 'index.html'), 'utf8');
      // Kjøletekniker-linjen passer ikke på bakeerstatninger: bare restesidene har den.
      assert.equal(/Av <a href="\/om\/">Patrick Kabia<\/a>, kjøletekniker/u.test(html), rot !== 'erstatning', `${sti}: forfatterlinje`);
      assert.ok((html.match(/class="i-appen i-/gu) ?? []).length >= 2, `${sti}: app-bevis`);
      assert.match(html, new RegExp(`href="/${rot === 'erstatning' ? 'erstatning' : 'hva-kan-jeg-lage'}/"`, 'u'), `${sti}: lenke til samlesiden`);
      assert.match(html, /href="\/spiskammer-app\/"/u, `${sti}: spiskammer-app`);
    }
  }
});

test('sidene er reelt forskjellige: ingen to rester- eller erstatningssider har lik tittel, H1 eller beskrivelse', () => {
  for (const [rot, ider] of [['erstatning', ERSTATNING], ['hva-kan-jeg-lage/med', RESTER]]) {
    const felt = { title: new Set(), h1: new Set(), desc: new Set() };
    for (const id of ider) {
      const html = readFileSync(join(ROT, rot === 'erstatning' ? `erstatning/${id}` : `hva-kan-jeg-lage/med-${id}`, 'index.html'), 'utf8');
      const verdier = { title: html.match(/<title>([^<]*)<\/title>/u)[1], h1: html.match(/<h1[^>]*>([^<]*)<\/h1>/u)[1], desc: html.match(/<meta name="description" content="([^"]*)"/u)[1] };
      for (const [k, v] of Object.entries(verdier)) { assert.ok(!felt[k].has(v), `${rot}/${id}: lik ${k}`); felt[k].add(v); }
    }
  }
});

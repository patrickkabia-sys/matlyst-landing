// Familiene «holdbarhet» (holdbarhed), «frysing» (kan man fryse) og «kjernetemperatur» (kernetemperatur) på dansk: adressene, kildene og reglene for innholdet.
// Tallene er hentet fra danske kilder (Fødevarestyrelsen, Forbrugerrådet Tænk, Madens Verden, Landbrug & Fødevarer, Teknologisk Institut, Arla), ikke oversatt fra norsk.
// Den generelle tallvakten og likhetsvakten står i test/familier.test.mjs; sitatkontrollen mot kildene kjøres med kildekontroll.mjs <familie> da.
import assert from 'node:assert/strict';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { avvik } from '../scripts/familier/holdbarhet/kildekontroll.mjs';
import { lesData, publiserbare } from '../scripts/familier/felles.mjs';
import { FAMILIER, familieGrupper, familieSider } from '../scripts/familier/register.mjs';
import { NORSKE_RESTORD } from './hjelp/restord.mjs';
import { synligTekst, tallUtenforData } from './hjelp/familievakt.mjs';

const ROT = { holdbarhet: 'holdbarhed/', frysing: 'kan-man-fryse/', kjernetemperatur: 'kernetemperatur/' };
const ANTALL = { holdbarhet: 11, frysing: 9, kjernetemperatur: 13 };
const FAM = Object.keys(ROT);
const familie = (id) => FAMILIER.find((f) => f.id === id);
const data = (id) => lesData(fileURLToPath(familie(id).mappe), 'da');
const mal = (id) => import(new URL('mal-da.mjs', familie(id).mappe));
const sider = async (id) => Object.entries(await familieSider('da', [familie(id)]));
const DOMENER = /^https:\/\/(?:www\.)?(?:foedevarestyrelsen\.dk|taenk\.dk|madensverden\.dk|voresmad\.dk|teknologisk\.dk|arla\.dk)\//u;

/** Brudd: sifrene i verdien står ikke som tall i sitatet. */
export const verdiManglerISitat = (t) => (t.merknad ? [Math.abs(t.verdi)].filter((v) => !new RegExp(`(?<![\\d])${String(v).replace('.', '[.,]')}(?![\\d])`, 'u').test(t.merknad)) : [t.verdi]);

test('adressene er låst: samleside og varesider under /da/holdbarhed/, /da/kan-man-fryse/ og /da/kernetemperatur/', async () => {
  for (const id of FAM) {
    assert.deepEqual(familie(id).markeder.da, { rot: ROT[id] }, id);
    const stier = (await sider(id)).map(([sti]) => sti);
    assert.equal(stier.length, ANTALL[id], id);
    assert.ok(stier.includes(ROT[id]), id);
    for (const sti of stier) assert.match(sti, new RegExp(`^${ROT[id]}(?:[a-z0-9-]+/)?$`, 'u'), sti);
  }
});

test('hvert tall har kilde hos en dansk myndighet eller navngitt dansk fagkilde, sitat, lenke og årstall, og verdien står i sitatet', () => {
  for (const id of FAM) {
    const d = data(id);
    for (const [k, kilde] of Object.entries(d.kilder)) {
      assert.match(kilde.adresse, DOMENER, `${id}: ${k}`);
      assert.ok(kilde.aar >= 2018, `${id}: ${k} mangler årstall`);
    }
    for (const r of d.rader) {
      for (const [felt, t] of Object.entries(r.tall)) {
        assert.ok(Object.hasOwn(d.kilder, t.kilde), `${id}/${r.id}/${felt}: kilden ${t.kilde} mangler`);
        assert.ok(t.merknad && t.merknad.length >= 10, `${id}/${r.id}/${felt}: mangler sitatet fra kilden`);
        assert.deepEqual(verdiManglerISitat(t), [], `${id}/${r.id}/${felt}: verdien står ikke i sitatet`);
      }
    }
  }
});

test('verdivakten kan bli rød: et tall som ikke står i sitatet feiler', () => {
  assert.deepEqual(verdiManglerISitat({ verdi: 4, merknad: 'Hakket kød kan holde sig op til 4 dage i køleskab.' }), []);
  assert.deepEqual(verdiManglerISitat({ verdi: 5, merknad: 'Hakket kød kan holde sig op til 4 dage i køleskab.' }), [5]);
  assert.deepEqual(verdiManglerISitat({ verdi: 4, merknad: 'Kan holde sig 14 dage.' }), [4]);
  assert.deepEqual(verdiManglerISitat({ verdi: -18, merknad: 'skal din fryser være minimum -18 C°.' }), []);
});

test('hvert tall på hver side står i datafila', async () => {
  for (const id of FAM) {
    const d = data(id);
    const m = await mal(id);
    for (const [sti, side] of await sider(id)) {
      const rad = publiserbare(d).find((r) => sti === `${ROT[id]}${r.slug}/`);
      assert.deepEqual(tallUtenforData(side, rad ? m.tillatteTall(rad, d) : m.tillatteTallNav(d)), [], sti);
    }
  }
});

test('ingen norske kilder eller ord, ingen tankestrek, ingen forfatterlinje, kildeliste med lenke og lesedato, Fødevarestyrelsen først', async () => {
  for (const id of FAM) {
    for (const [sti, side] of await sider(id)) {
      const tekst = synligTekst(side);
      assert.doesNotMatch(tekst, /[—–]/u, sti);
      assert.doesNotMatch(tekst, /Mattilsynet|MatPrat|Helsedirektoratet/u, sti);
      assert.doesNotMatch(tekst, NORSKE_RESTORD, sti);
      assert.doesNotMatch(tekst, /\b(?:kjøleskap|oppbevar\w*|holdbarhet|kjernetemperatur|hvor lenge|oppskrift\w*)\b/iu, sti);
      assert.doesNotMatch(tekst, /\bnok\b/iu, `${sti}: ordet «nok» ligner valutakoden NOK i locale-vakten`);
      const kilder = /<ol class="kilder" id="kilder">([\s\S]*?)<\/ol>/u.exec(side.rik)?.[1] ?? '';
      const punkter = [...kilder.matchAll(/<li>([\s\S]*?)<\/li>/gu)].map((m) => m[1]);
      assert.ok(punkter.length > 0, `${sti}: mangler kildeliste`);
      for (const li of punkter) assert.match(li, /<a href="https:\/\/[^"]+" rel="noopener">[^<]+<\/a> \(\d{4}\)\. Læst \d{1,2}\. [a-z]+ \d{4}\./u, sti);
      const forste = punkter.findIndex((li) => li.startsWith('Fødevarestyrelsen'));
      if (forste >= 0) assert.equal(forste, 0, `${sti}: Fødevarestyrelsen skal stå først i kildelisten`);
      assert.ok(!JSON.stringify(side.schemas).includes('"Person"'), `${sti}: danske sider har ikke Person-forfatter`);
      assert.doesNotMatch(side.rik, /Af <a href="\/om\/">/u, sti);
    }
  }
});

test('samme rad-id på nb, da og en gir hreflang, og en vare uten norsk motstykke står uten nb', () => {
  const grupper = familieGrupper();
  const g = (navn) => grupper.find((x) => x.id === navn);
  assert.deepEqual(g('auto-fam-holdbarhet-egg').sider, { nb: '/holdbarhet/egg/', sv: '/sv/hallbarhet/agg/', da: '/da/holdbarhed/aeg/', en: '/en/how-long-does-it-last/eggs/' });
  assert.deepEqual(g('auto-fam-holdbarhet-rester').sider, { nb: '/holdbarhet/rester/', sv: '/sv/hallbarhet/matrester/', da: '/da/holdbarhed/rester/', en: '/en/how-long-does-it-last/leftovers/' });
  assert.deepEqual(g('auto-fam-holdbarhet-nav').sider, { nb: '/holdbarhet/', sv: '/sv/hallbarhet/', da: '/da/holdbarhed/', en: '/en/how-long-does-it-last/' });
  assert.deepEqual(g('auto-fam-frysing-nav').sider, { nb: '/frysing/', sv: '/sv/frysa/', da: '/da/kan-man-fryse/', en: '/en/can-you-freeze/' });
  assert.deepEqual(g('auto-fam-frysing-fisk').sider, { nb: '/frysing/fisk/', sv: '/sv/frysa/fisk/', da: '/da/kan-man-fryse/fisk/'});
  assert.deepEqual(g('auto-fam-holdbarhet-baer').sider, { da: '/da/holdbarhed/baer/' });
  assert.deepEqual(g('auto-fam-kjernetemperatur-kylling').sider.da, '/da/kernetemperatur/kylling/');
  assert.deepEqual(g('auto-fam-kjernetemperatur-nav').sider.da, '/da/kernetemperatur/');
});

test('sidene som ikke har dansk tall holdes ute: ingen side om ris, pasta, rå kylling, kogte æg eller fisk i kernetemperatur', () => {
  for (const [id, slug] of [['holdbarhet', 'ris'], ['holdbarhet', 'kylling'], ['holdbarhet', 'kogte-aeg'], ['kjernetemperatur', 'fisk'], ['kjernetemperatur', 'laks'], ['kjernetemperatur', 'torsk']]) {
    assert.equal(data(id).rader.some((r) => r.slug === slug), false, `${id}/${slug}`);
  }
});

test('kildekontrollen sjekker setninger i radens tekst også, og PDF-kilder uten mellomrom', () => {
  const d = { rader: [{ id: 'x', tall: { a: { verdi: 5, enhet: 'dage', kilde: 'k', merknad: 'opbevar det ved maks. 5°C i op til 5 dage' } }, tekst: { s: 'k|Brug dine sanser' } }] };
  assert.deepEqual(avvik(d, { k: 'Så opbevar det ved maks. 5°C i op til 5 dage. Brug dine sanser, ellers smid ud.' }), []);
  assert.deepEqual(avvik(d, { k: 'opbevar det ved maks. 5°C i op til 5 dage' }), [{ id: 'x', felt: 's', kilde: 'k' }]);
  assert.deepEqual(avvik(d, { k: 'opbevardetvedmaks.5°Cioptil5dageBrugdinesanser' }, new Set(['k'])), []);
  assert.deepEqual(avvik(d, { k: 'opbevardetvedmaks.5°Cioptil5dageBrugdinesanser' }), [{ id: 'x', felt: 'a', kilde: 'k' }, { id: 'x', felt: 's', kilde: 'k' }]);
});

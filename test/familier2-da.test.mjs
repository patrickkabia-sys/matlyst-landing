// Familiene «steketid» (stegetid), «airfryer», «erstatning» og «mengde-per-person» (hvor-meget-pr-person) på dansk: adressene, kildene og reglene for innholdet.
// Tallene er hentet fra danske kilder (Madens Verden, Arla, Dr. Oetker, Landbrug & Fødevarer og Danish Crown som producent), ikke oversatt fra norsk eller engelsk.
// Den generelle tallvakten og likhetsvakten står i test/familier.test.mjs; sitatkontrollen mot kildene kjøres med
// node scripts/familier/holdbarhet/kildekontroll.mjs <familie> da
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { avvik } from '../scripts/familier/holdbarhet/kildekontroll.mjs';
import { lesData, publiserbare } from '../scripts/familier/felles.mjs';
import { FAMILIER, familieGrupper, familieSider } from '../scripts/familier/register.mjs';
import { NORSKE_RESTORD } from './hjelp/restord.mjs';
import { synligTekst, tallUtenforData } from './hjelp/familievakt.mjs';

const ROT = { steketid: 'stegetid/', airfryer: 'airfryer/', erstatning: 'erstatning/', 'mengde-per-person': 'hvor-meget-pr-person/' };
const ANTALL = { steketid: 12, airfryer: 12, erstatning: 9, 'mengde-per-person': 11 };
const FAM = Object.keys(ROT);
const ROTMAPPE = fileURLToPath(new URL('..', import.meta.url));
const familie = (id) => FAMILIER.find((f) => f.id === id);
const data = (id) => lesData(fileURLToPath(familie(id).mappe), 'da');
const mal = (id) => import(new URL('mal-da.mjs', familie(id).mappe));
const sider = async (id) => Object.entries(await familieSider('da', [familie(id)]));
const DOMENER = /^https:\/\/(?:www\.)?(?:madensverden\.dk|arla\.dk|oetker\.dk|danishcrown\.com|voresmad\.dk)\//u;

/** Brudd: sifrene i verdien står ikke som tall i sitatet. Barnefaktoren 0,5 står i kilden som «halv» (ingen siffer). */
export const verdiManglerISitat = (t, felt = '') => {
  if (felt === 'barn' && t.verdi === 0.5 && /halv/u.test(t.merknad ?? '')) return [];
  return t.merknad ? [Math.abs(t.verdi)].filter((v) => !new RegExp(`(?<![\\d])${String(v).replace('.', '[.,]')}(?![\\d])`, 'u').test(t.merknad)) : [t.verdi];
};

test('adressene er låst: samleside og varesider under /da/stegetid/, /da/airfryer/, /da/erstatning/ og /da/hvor-meget-pr-person/', async () => {
  for (const id of FAM) {
    assert.deepEqual(familie(id).markeder.da, { rot: ROT[id] }, id);
    const stier = (await sider(id)).map(([sti]) => sti);
    assert.equal(stier.length, ANTALL[id], id);
    assert.ok(stier.includes(ROT[id]), id);
    for (const sti of stier) assert.match(sti, new RegExp(`^${ROT[id]}(?:[a-z0-9-]+/)?$`, 'u'), sti);
  }
});

test('hvert tall har kilde hos en dansk madside eller producent, sitat, lenke og årstal, og verdien står i sitatet', () => {
  for (const id of FAM) {
    const d = data(id);
    for (const [k, kilde] of Object.entries(d.kilder)) {
      assert.match(kilde.adresse, DOMENER, `${id}: ${k}`);
      assert.ok(kilde.aar >= 2017, `${id}: ${k} mangler årstal`);
    }
    for (const r of d.rader) {
      for (const [felt, t] of Object.entries(r.tall)) {
        assert.ok(Object.hasOwn(d.kilder, t.kilde), `${id}/${r.id}/${felt}: kilden ${t.kilde} mangler`);
        assert.ok(t.merknad && t.merknad.length >= 10, `${id}/${r.id}/${felt}: mangler sitatet fra kilden`);
        assert.deepEqual(verdiManglerISitat(t, felt), [], `${id}/${r.id}/${felt}: verdien står ikke i sitatet`);
      }
    }
  }
});

test('verdivakten kan bli rød: et tall som ikke står i sitatet feiler, og barnefaktoren trenger «halv» i sitatet', () => {
  assert.deepEqual(verdiManglerISitat({ verdi: 60, merknad: 'Ovn 180-200 °C: ca. 60-75 min. pr. kg' }), []);
  assert.deepEqual(verdiManglerISitat({ verdi: 61, merknad: 'Ovn 180-200 °C: ca. 60-75 min. pr. kg' }), [61]);
  assert.deepEqual(verdiManglerISitat({ verdi: 6, merknad: 'ca. 60-75 min.' }), [6]);
  assert.deepEqual(verdiManglerISitat({ verdi: 0.5, merknad: 'Et barn regnes som cirka en halv voksenportion.' }, 'barn'), []);
  assert.deepEqual(verdiManglerISitat({ verdi: 0.5, merknad: 'Et barn spiser mindre.' }, 'barn'), [0.5]);
  assert.deepEqual(verdiManglerISitat({ verdi: 0.5, merknad: 'en halv banan' }, 'banan'), [0.5]);
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

test('ingen norske kilder eller ord, ingen tankestrek, ingen forfatterlinje, kildeliste med lenke og læsedato', async () => {
  for (const id of FAM) {
    for (const [sti, side] of await sider(id)) {
      const tekst = synligTekst(side);
      assert.doesNotMatch(tekst, /[—–]/u, sti);
      assert.doesNotMatch(tekst, /Mattilsynet|MatPrat|Helsedirektoratet|Idun|melk\.no/u, sti);
      assert.doesNotMatch(tekst, NORSKE_RESTORD, sti);
      assert.doesNotMatch(tekst, /\b(?:kjøleskap|oppbevar\w*|holdbarhet|kjernetemperatur|hvor lenge|oppskrift\w*|mengde per person)\b/iu, sti);
      assert.doesNotMatch(tekst, /\bnok\b/iu, `${sti}: ordet «nok» ligner valutakoden NOK i locale-vakten`);
      assert.doesNotMatch(tekst, /regnemaskine/iu, `${sti}: dansk bruger «omregner»`);
      const kilder = /<ol class="kilder" id="kilder">([\s\S]*?)<\/ol>/u.exec(side.rik)?.[1] ?? '';
      const punkter = [...kilder.matchAll(/<li>([\s\S]*?)<\/li>/gu)].map((m) => m[1]);
      assert.ok(punkter.length > 0, `${sti}: mangler kildeliste`);
      for (const li of punkter) assert.match(li, /<a href="https:\/\/[^"]+" rel="noopener">[^<]+<\/a> \(\d{4}\)\. Læst \d{1,2}\. [a-z]+ \d{4}\./u, sti);
      assert.ok(!JSON.stringify(side.schemas).includes('"Person"'), `${sti}: danske sider har ikke Person-forfatter`);
      assert.doesNotMatch(side.rik, /Af <a href="\/om\/">/u, sti);
    }
  }
});

test('samme rad-id på nb, da og en gir hreflang, og en vare uten norsk motstykke står uten nb', () => {
  const g = (navn) => familieGrupper().find((x) => x.id === navn);
  assert.deepEqual(g('auto-fam-steketid-kalkun').sider, { nb: '/steketid/kalkun/', sv: '/sv/tillagningstid/kalkon/', da: '/da/stegetid/kalkun/', en: '/en/cooking-times/turkey/' });
  assert.deepEqual(g('auto-fam-steketid-nav').sider.da, '/da/stegetid/');
  assert.deepEqual(g('auto-fam-steketid-flaeskesteg').sider, { da: '/da/stegetid/flaeskesteg/' });
  assert.deepEqual(g('auto-fam-airfryer-egg').sider, { nb: '/airfryer/egg/', sv: '/sv/airfryer/koka-agg/', da: '/da/airfryer/aeg/', en: '/en/air-fryer/hard-boiled-eggs/' });
  assert.deepEqual(g('auto-fam-airfryer-andebryst').sider, { da: '/da/airfryer/andebryst/' });
  assert.deepEqual(g('auto-fam-erstatning-egg').sider, { nb: '/erstatning/egg/', da: '/da/erstatning/aeg/', en: '/en/substitutes/eggs/' });
  assert.deepEqual(g('auto-fam-erstatning-nav').sider.da, '/da/erstatning/');
  assert.deepEqual(g('auto-fam-mengde-per-person-ris').sider, { nb: '/mengde-per-person/ris/', sv: '/sv/hur-mycket-per-person/ris/', da: '/da/hvor-meget-pr-person/ris/', en: '/en/how-much-per-person/rice/' });
  assert.deepEqual(g('auto-fam-mengde-per-person-flaeskesteg').sider, { da: '/da/hvor-meget-pr-person/flaeskesteg/' });
});

test('varene uten dansk kildetall holdes ute: ingen side om vaniljesukker, gær, ribbensteg, gås eller fiskepinde', () => {
  for (const [id, slug] of [['erstatning', 'vaniljesukker'], ['erstatning', 'gaer'], ['erstatning', 'hvidvin'], ['steketid', 'ribbensteg'], ['steketid', 'gaas'], ['airfryer', 'fiskepinde'], ['airfryer', 'poelser'], ['mengde-per-person', 'and']]) {
    assert.equal(data(id).rader.some((r) => r.slug === slug), false, `${id}/${slug}`);
  }
});

test('kildekontrollen sjekker setninger i radens tekst også, og PDF-kilder uten mellemrum (Landbrug & Fødevarer)', () => {
  const d = { rader: [{ id: 'x', tall: { a: { verdi: 65, enhet: '°C', kilde: 'k', merknad: 'Flæskesteg 65°C' } }, tekst: { s: 'k|Mørbrad fra gris 62-65°C' } }] };
  assert.deepEqual(avvik(d, { k: 'Flæskesteg65°CMørbradfragris62-65°C' }, new Set(['k'])), []);
  assert.deepEqual(avvik(d, { k: 'Flæskesteg 65°C. Mørbrad fra gris 62-65°C.' }), []);
  assert.deepEqual(avvik(d, { k: 'Flæskesteg 65°C' }), [{ id: 'x', felt: 's', kilde: 'k' }]);
});

test('airfryer: tiden i Arlas tabel er en femtedel kortere i hver række, og temperaturen er lavere i airfryeren', () => {
  const rad = publiserbare(data('airfryer')).find((r) => r.id === 'ovn-til-airfryer');
  for (let i = 1; i <= 6; i += 1) {
    const [ovn, af, mo, ma] = ['ovn', 'af', 'mo', 'ma'].map((k) => rad.tall[`a${i}-${k}`].verdi);
    assert.ok(Math.abs(ma - mo * 0.8) < 1e-9, `række ${i}: ${mo} og ${ma}`);
    assert.ok(af < ovn, `række ${i}: ${af} er ikke lavere end ${ovn}`);
  }
});

test('airfryer: omregneren på ovn-til-airfryer har tabellen som data og bruger samme skript som på norsk', async () => {
  const side = (await sider('airfryer')).find(([sti]) => sti === 'airfryer/ovn-til-airfryer/')[1];
  assert.match(side.rik, /<form data-oaf /u);
  assert.match(side.rik, /<script src="\/airfryer-omregner\.js" defer><\/script>/u);
  const json = /<script type="application\/json" data-oaf-data>([\s\S]*?)<\/script>/u.exec(side.rik)[1];
  const d = JSON.parse(json);
  assert.deepEqual(d.rader.map((r) => r[0]), [150, 165, 175, 190, 200, 225]);
  assert.equal(d.tider.length, 6);
});

test('mengde per person: omregneren har børn som halv voksen og dansk tekst, og tabellen har 2 til 12 voksne', async () => {
  const d = data('mengde-per-person');
  for (const [sti, side] of await sider('mengde-per-person')) {
    assert.match(side.rik, /<form class="kalk" data-kalk="porsjon"/u, sti);
    const json = JSON.parse(/<script type="application\/json" class="kalk-data">([\s\S]*?)<\/script>/u.exec(side.rik)[1]);
    assert.equal(json.b, 0.5, sti);
    assert.equal(json.t.barn, 'børn', sti);
    assert.equal(json.t.ettBarn, 'barn', sti);
    assert.match(json.t.feil, /Skriv hele tal/u, sti);
    if (sti !== ROT['mengde-per-person']) assert.match(side.rik, /<th scope="col">12<\/th>/u, sti);
    assert.doesNotMatch(side.rik, /\sstyle=/u, `${sti}: ingen style-attributt`);
  }
  for (const r of publiserbare(d)) assert.equal(r.tall.barn.verdi, 0.5, `${r.id}: barn tæller en halv portion`);
});

test('mengde per person: omregnerens setning bruger «barn» ved ét barn og «børn» ved flere (site.js og regn.mjs)', async () => {
  const { setning } = await import('../scripts/familier/mengde-per-person/regn.mjs');
  const t = { voksen: 'voksen', voksne: 'voksne', barn: 'børn', ettBarn: 'barn', og: 'og', trenger: 'skal bruge', eller: 'eller', til: 'til' };
  const v = { navn: 'Ris', deler: [{ min: 80, maks: 80, enhet: 'g' }] };
  assert.equal(setning(v, 2, 1, 0.5, t), 'Ris: 2 voksne og 1 barn skal bruge 200 g.');
  assert.equal(setning(v, 2, 2, 0.5, t), 'Ris: 2 voksne og 2 børn skal bruge 240 g.');
  // Norsk bruger ikke ettBarn og er uændret.
  assert.equal(setning(v, 2, 1, 0.5, { ...t, barn: 'barn', ettBarn: undefined, trenger: 'trenger' }), 'Ris: 2 voksne og 1 barn trenger 200 g.');
  const js = readFileSync(`${ROTMAPPE}site.js`, 'utf8');
  assert.ok(js.includes('barn === 1 && t.ettBarn ? t.ettBarn : t.barn'), 'site.js har samme regel som regn.mjs');
});

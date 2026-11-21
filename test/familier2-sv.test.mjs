// Fire familier på svensk (sv): tillagningstid (steketid), airfryer, ersatta (erstatning) og hur mycket per person (mengde-per-person).
// Adressene, kildene og reglene for innholdet. Tallene er hentet fra svenske kilder, ikke oversatt fra norsk eller engelsk.
// Den generelle tallvakten og likhetsvakten står i test/familier.test.mjs; sitatkontrollen mot kildene kjøres med holdbarhet/kildekontroll.mjs <familie> sv (curl-fallback for Arla).
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { lesData, publiserbare } from '../scripts/familier/felles.mjs';
import { FAMILIER, familieGrupper, familieSider } from '../scripts/familier/register.mjs';
import { avvik } from '../scripts/familier/holdbarhet/kildekontroll.mjs';
import { synligTekst, tallUtenforData } from './hjelp/familievakt.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const ROT = { steketid: 'tillagningstid/', airfryer: 'airfryer/', erstatning: 'ersatta/', 'mengde-per-person': 'hur-mycket-per-person/' };
const ANTALL = { steketid: 11, airfryer: 16, erstatning: 6, 'mengde-per-person': 11 };
const FAM = Object.keys(ROT);
const familie = (id) => FAMILIER.find((f) => f.id === id);
const data = (id) => lesData(fileURLToPath(familie(id).mappe), 'sv');
const mal = (id) => import(new URL('mal-sv.mjs', familie(id).mappe));
const sider = async (id) => Object.entries(await familieSider('sv', [familie(id)]));
// Svenske kilder: myndighet, bransjeorganisasjon eller produsent/merke med navngitt side. Aldri norske kilder.
const UTGIVERE = new Set(['Arla', 'Svenskt Kött', 'Svensk Fågel', 'Svenska Ägg', 'Kronfågel', 'Findus', 'OBH Nordica', 'Kungsörnen', 'Dansukker', 'KronJäst']);
const DOMENER = /^https:\/\/(?:www\.arla\.se|svensktkott\.se|svenskfagel\.se|www\.svenskaagg\.se|www\.kronfagel\.se|www\.findus\.se|www\.obhnordica\.se|www\.kungsornen\.se|forum\.kungsornen\.se|www\.dansukker\.se|kronjast\.se)\//u;

test('adressene er låst: samleside og varesider per familie under /sv/', async () => {
  for (const id of FAM) {
    assert.deepEqual(familie(id).markeder.sv, { rot: ROT[id] }, id);
    const stier = (await sider(id)).map(([sti]) => sti);
    assert.equal(stier.length, ANTALL[id] + 1, id);
    assert.ok(stier.includes(ROT[id]), id);
    for (const sti of stier) assert.match(sti, new RegExp(`^${ROT[id]}(?:[a-z0-9-]+/)?$`, 'u'), sti);
  }
});

test('alle sidene står i sitemap-sv.xml og bare der, og samlesidene står i llms.txt', async () => {
  const kart = readFileSync(join(ROOT, 'sitemap-sv.xml'), 'utf8');
  const llms = readFileSync(join(ROOT, 'llms.txt'), 'utf8');
  for (const id of FAM) {
    for (const [sti] of await sider(id)) {
      assert.match(kart, new RegExp(`<loc>https://matlyst-app\\.no/sv/${sti}</loc>`, 'u'), sti);
      assert.match(readFileSync(join(ROOT, 'sv', sti, 'index.html'), 'utf8'), new RegExp(`<link rel="canonical" href="https://matlyst-app\\.no/sv/${sti}">`, 'u'), sti);
    }
    assert.match(llms, new RegExp(`\\]\\(https://matlyst-app\\.no/sv/${ROT[id]}\\)`, 'u'), id);
  }
  assert.doesNotMatch(readFileSync(join(ROOT, 'sitemap.xml'), 'utf8'), /<loc>[^<]*\/sv\/(?:tillagningstid|ersatta|hur-mycket-per-person)\//u);
});

test('hvert tall har kilde hos en svensk utgiver, sitat, lenke og årstall', () => {
  for (const id of FAM) {
    const d = data(id);
    for (const [k, kilde] of Object.entries(d.kilder)) {
      assert.match(kilde.adresse, DOMENER, `${id}: ${k}`);
      assert.ok(UTGIVERE.has(kilde.utgiver), `${id}: ${k}: ${kilde.utgiver}`);
      assert.ok(kilde.aar >= 2024, `${id}: ${k} mangler årstall`);
    }
    for (const r of d.rader) {
      assert.equal(r.status, 'kontrollert', `${id}/${r.id}`);
      for (const [felt, t] of Object.entries(r.tall)) {
        assert.ok(Object.hasOwn(d.kilder, t.kilde), `${id}/${r.id}/${felt}: kilden ${t.kilde} mangler`);
        assert.ok(t.merknad && t.merknad.length >= 10, `${id}/${r.id}/${felt}: mangler sitatet fra kilden`);
      }
      for (const [felt, v] of Object.entries(r.tekst ?? {})) assert.ok(Object.hasOwn(d.kilder, v.split('|')[0]), `${id}/${r.id}/${felt}: kilden mangler`);
    }
  }
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

test('ingen norske kilder, ingen tankestrek, ingen norske ord, kildeliste med lenke og lesedato, og ingen Person-forfatter', async () => {
  for (const id of FAM) {
    for (const [sti, side] of await sider(id)) {
      const tekst = synligTekst(side);
      assert.doesNotMatch(tekst, /[—–]/u, sti);
      assert.doesNotMatch(tekst, /Mattilsynet|MatPrat|Helsedirektoratet|Gilde|Nortura|veiledende/u, sti);
      const kilder = /<ol class="kilder" id="kilder">([\s\S]*?)<\/ol>/u.exec(side.rik)?.[1] ?? '';
      const punkter = [...kilder.matchAll(/<li>([\s\S]*?)<\/li>/gu)].map((m) => m[1]);
      assert.ok(punkter.length > 0, `${sti}: mangler kildeliste`);
      for (const li of punkter) assert.match(li, /<a href="https:\/\/[^"]+" rel="noopener">[^<]+<\/a> \(\d{4}\)\. Läst \d{1,2} [a-z]+ \d{4}\./u, sti);
      assert.ok(!JSON.stringify(side.schemas).includes('"Person"'), `${sti}: svenske sider har ikke Person-forfatter`);
    }
  }
});

test('samme rad-id på nb og sv gir hreflang, og en vare uten norsk motstykke står alene', () => {
  const g = (navn) => familieGrupper().find((x) => x.id === navn);
  assert.equal(g('auto-fam-steketid-kalkun').sider.sv, '/sv/tillagningstid/kalkon/');
  assert.equal(g('auto-fam-steketid-nav').sider.sv, '/sv/tillagningstid/');
  assert.equal(g('auto-fam-steketid-potatis').sider.sv, '/sv/tillagningstid/koka-potatis/');
  assert.deepEqual(g('auto-fam-steketid-potatis').sider, { sv: '/sv/tillagningstid/koka-potatis/' });
  assert.equal(g('auto-fam-airfryer-ovn-til-airfryer').sider.sv, '/sv/airfryer/ugn-till-airfryer/');
  assert.deepEqual(g('auto-fam-airfryer-hel-kylling').sider, { sv: '/sv/airfryer/hel-kyckling/', da: '/da/airfryer/hel-kylling/' });
  assert.equal(g('auto-fam-erstatning-gjaer').sider.sv, '/sv/ersatta/jast/');
  assert.equal(g('auto-fam-erstatning-egg').sider.sv, undefined, 'äggsidan handlade bara om storlek och är borttagen');
  assert.deepEqual(g('auto-fam-erstatning-florsocker').sider, { sv: '/sv/ersatta/florsocker/' });
  assert.equal(g('auto-fam-mengde-per-person-ris').sider.sv, '/sv/hur-mycket-per-person/ris/');
  assert.equal(g('auto-fam-mengde-per-person-nav').sider.sv, '/sv/hur-mycket-per-person/');
});

test('siffrorna är svenska: hel kyckling 80 °C hos Svensk Fågel, och Arlas tabellrad med trasiga tider är utelämnad', async () => {
  const hk = Object.fromEntries(await sider('steketid'))['tillagningstid/hel-kyckling/'];
  assert.match(synligTekst(hk), /Svensk Fågel \(2024\) anger 80 °C/u);
  const ugn = synligTekst(Object.fromEntries(await sider('airfryer'))['airfryer/ugn-till-airfryer/']);
  assert.match(ugn, /175 °C 165 °C 30 minuter 24 minuter/u);
  assert.doesNotMatch(ugn, /\b220\b/u);
});

test('mängd per person: kalkylatorn räknar personer, barnfältet är dolt, och ingen siffra för barn finns', async () => {
  const s = Object.fromEntries(await sider('mengde-per-person'));
  for (const [sti, side] of Object.entries(s)) {
    assert.match(side.rik, /<input data-felt="barn" type="hidden" value="0">/u, sti);
    assert.doesNotMatch(side.rik, /halv porsjon|halv portion|halv vuxen/u, sti);
    assert.doesNotMatch(JSON.stringify(side.schemas), /"offers"/u, sti);
  }
});

test('kildekontrollen blir rød når et sitat ikke står hos kilden, og grønn når alle gjør det', () => {
  const d = data('airfryer');
  const tekster = {};
  for (const r of d.rader) {
    for (const t of Object.values(r.tall)) tekster[t.kilde] = `${tekster[t.kilde] ?? ''} ${t.merknad}`;
    for (const v of Object.values(r.tekst ?? {})) { const [k, ...rest] = v.split('|'); tekster[k] = `${tekster[k] ?? ''} ${rest.join('|')}`; }
  }
  assert.deepEqual(avvik(d, tekster), []);
  const kilde = Object.keys(d.kilder)[0];
  const ødelagt = { ...tekster, [kilde]: tekster[kilde].replace(/\d/gu, 'x') };
  assert.ok(avvik(d, ødelagt).length > 0);
});

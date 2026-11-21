// Familiene «holdbarhet» og «frysing» på amerikansk engelsk (en-US): adressene, kildene og reglene for innholdet.
// Tallene er hentet fra amerikanske kilder (FoodSafety.gov, USDA FSIS, FDA), ikke oversatt fra norsk. Fahrenheit først, Celsius i parentes.
// Den generelle tallvakten og likhetsvakten står i test/familier.test.mjs; sitatkontrollen mot kildene kjøres med kildekontroll.mjs.
import assert from 'node:assert/strict';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { lesData, publiserbare } from '../scripts/familier/felles.mjs';
import { FAMILIER, familieGrupper, familieSider } from '../scripts/familier/register.mjs';
import { synligTekst, tallUtenforData } from './hjelp/familievakt.mjs';

const FAM = ['holdbarhet', 'frysing'];
const ROT = { holdbarhet: 'how-long-does-it-last/', frysing: 'can-you-freeze/' };
const familie = (id) => FAMILIER.find((f) => f.id === id);
const data = (id) => lesData(fileURLToPath(familie(id).mappe), 'en');
const mal = (id) => import(new URL('mal-en.mjs', familie(id).mappe));
const sider = async (id) => Object.entries(await familieSider('en', [familie(id)]));
const DOMENER = /^https:\/\/www\.(?:foodsafety\.gov|fsis\.usda\.gov|fda\.gov|cdc\.gov)\//u;

/** Brudd på temperaturregelen: en °C-verdi som ikke står i parentes rett etter en °F-verdi. */
export const temperaturBrudd = (tekst) => [...tekst.matchAll(/-?\d+\s?°C/gu)].filter((m) => !/\d°F \($/u.test(tekst.slice(Math.max(0, m.index - 8), m.index))).map((m) => m[0]);

test('adressene er låst: samleside og 21 varesider per familie under /en/', async () => {
  for (const id of FAM) {
    assert.deepEqual(familie(id).markeder.en, { rot: ROT[id] }, id);
    const stier = (await sider(id)).map(([sti]) => sti);
    assert.equal(stier.length, 22, id);
    assert.ok(stier.includes(ROT[id]), id);
    for (const sti of stier) assert.match(sti, new RegExp(`^${ROT[id]}(?:[a-z0-9-]+/)?$`, 'u'), sti);
  }
});

test('hvert tall har kilde hos amerikansk myndighet, sitat, lenke og årstall', () => {
  for (const id of FAM) {
    const d = data(id);
    for (const [k, kilde] of Object.entries(d.kilder)) {
      assert.match(kilde.adresse, DOMENER, `${id}: ${k}`);
      assert.ok(kilde.aar >= 2020, `${id}: ${k} mangler årstall`);
    }
    for (const r of d.rader) {
      for (const [felt, t] of Object.entries(r.tall)) {
        assert.ok(Object.hasOwn(d.kilder, t.kilde), `${id}/${r.id}/${felt}: kilden ${t.kilde} mangler`);
        assert.ok(t.merknad && t.merknad.length >= 10, `${id}/${r.id}/${felt}: mangler sitatet fra kilden`);
      }
    }
  }
});

test('hvert tall på hver side står i datafila, og Fahrenheit står først med Celsius i parentes', async () => {
  for (const id of FAM) {
    const d = data(id);
    const m = await mal(id);
    for (const [sti, side] of await sider(id)) {
      const rad = publiserbare(d).find((r) => sti === `${ROT[id]}${r.slug}/`);
      assert.deepEqual(tallUtenforData(side, rad ? m.tillatteTall(rad, d) : m.tillatteTallNav(d)), [], sti);
      assert.deepEqual(temperaturBrudd(synligTekst(side)), [], sti);
    }
  }
});

test('temperaturregelen kan bli rød: Celsius først eller uten parentes feiler', () => {
  assert.deepEqual(temperaturBrudd('Keep it at 40°F (4°C) or below, and 0°F (-18°C) in the freezer.'), []);
  assert.deepEqual(temperaturBrudd('Keep it at 4°C or below.'), ['4°C']);
  assert.deepEqual(temperaturBrudd('Keep it at 4°C (40°F) or below.'), ['4°C']);
});

test('ingen norske kilder, ingen tankestrek, kildeliste med lenke og lesedato, og ingen Person-forfatter', async () => {
  for (const id of FAM) {
    for (const [sti, side] of await sider(id)) {
      const tekst = synligTekst(side);
      assert.doesNotMatch(tekst, /[—–]/u, sti);
      assert.doesNotMatch(tekst, /Mattilsynet|MatPrat/u, sti);
      const kilder = /<ol class="kilder" id="kilder">([\s\S]*?)<\/ol>/u.exec(side.rik)?.[1] ?? '';
      const punkter = [...kilder.matchAll(/<li>([\s\S]*?)<\/li>/gu)].map((m) => m[1]);
      assert.ok(punkter.length > 0, `${sti}: mangler kildeliste`);
      for (const li of punkter) assert.match(li, /<a href="https:\/\/[^"]+" rel="noopener">[^<]+<\/a> \(\d{4}\)\. Accessed [A-Z][a-z]+ \d{1,2}, \d{4}\./u, sti);
      assert.ok(!JSON.stringify(side.schemas).includes('"Person"'), `${sti}: engelske sider har ikke Person-forfatter`);
    }
  }
});

test('samme rad-id på nb, da og en gir hreflang, og en vare uten norsk motstykke står alene', () => {
  const grupper = familieGrupper();
  const g = (navn) => grupper.find((x) => x.id === navn);
  assert.deepEqual(g('auto-fam-holdbarhet-egg').sider, { nb: '/holdbarhet/egg/', sv: '/sv/hallbarhet/agg/', da: '/da/holdbarhed/aeg/', en: '/en/how-long-does-it-last/eggs/' });
  assert.deepEqual(g('auto-fam-frysing-skalldyr').sider, { nb: '/frysing/skalldyr/', en: '/en/can-you-freeze/shrimp/' });
  assert.deepEqual(g('auto-fam-holdbarhet-cooked-rice').sider, { en: '/en/how-long-does-it-last/cooked-rice/' });
  assert.deepEqual(g('auto-fam-holdbarhet-nav').sider, { nb: '/holdbarhet/', sv: '/sv/hallbarhet/', da: '/da/holdbarhed/', en: '/en/how-long-does-it-last/' });
});

test('sidene om ris og pasta sier at kildene ikke har en egen linje for dem', async () => {
  for (const id of FAM) {
    const s = Object.fromEntries(await sider(id));
    for (const slug of ['cooked-rice']) assert.match(synligTekst(s[`${ROT[id]}${slug}/`]), /does not list rice by name|do not list rice on its own|not on the .{0,40} chart or in/u, `${id}/${slug}`);
  }
});

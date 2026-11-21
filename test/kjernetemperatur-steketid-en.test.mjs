// Familiene «kjernetemperatur» og «steketid» på amerikansk engelsk (en-US): adressene, kildene og reglene for innholdet.
// Tallene er hentet fra amerikanske kilder (FoodSafety.gov, USDA FSIS, Oregon State Extension), ikke oversatt fra norsk.
// Fahrenheit først, Celsius i parentes. Den generelle tallvakten og likhetsvakten står i test/familier.test.mjs; sitatkontrollen
// mot kildene kjøres med scripts/familier/steketid/kildekontroll.mjs <familie> en.
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { lesData, publiserbare } from '../scripts/familier/felles.mjs';
import { FAMILIER, familieGrupper, familieSider } from '../scripts/familier/register.mjs';
import { synligTekst, tallUtenforData } from './hjelp/familievakt.mjs';

/** Brudd på temperaturregelen: en °C-verdi som ikke står i parentes rett etter en °F-verdi. */
const temperaturBrudd = (tekst) => [...tekst.matchAll(/-?\d+\s?°C/gu)].filter((m) => !/\d°F \($/u.test(tekst.slice(Math.max(0, m.index - 8), m.index))).map((m) => m[0]);

const FAM = ['kjernetemperatur', 'steketid'];
const ROT = { kjernetemperatur: 'internal-temperature/', steketid: 'cooking-times/' };
const ANTALL = { kjernetemperatur: 16, steketid: 16 };
const familie = (id) => FAMILIER.find((f) => f.id === id);
const data = (id) => lesData(fileURLToPath(familie(id).mappe), 'en');
const mal = (id) => import(new URL('mal-en.mjs', familie(id).mappe));
const sider = async (id) => Object.entries(await familieSider('en', [familie(id)]));
const DOMENER = /^https:\/\/(?:www\.foodsafety\.gov|www\.fsis\.usda\.gov|extension\.oregonstate\.edu)\//u;

test('temperaturregelen kan bli rød: Celsius først eller uten parentes feiler', () => {
  assert.deepEqual(temperaturBrudd('Roast at 325°F (163°C).'), []);
  assert.deepEqual(temperaturBrudd('Roast at 163°C.'), ['163°C']);
  assert.deepEqual(temperaturBrudd('Roast at 163°C (325°F).'), ['163°C']);
});

test('adressene er låst: samleside og varesider under /en/internal-temperature/ og /en/cooking-times/', async () => {
  for (const id of FAM) {
    assert.deepEqual(familie(id).markeder.en, { rot: ROT[id] }, id);
    const stier = (await sider(id)).map(([sti]) => sti);
    assert.equal(stier.length, ANTALL[id], id);
    assert.ok(stier.includes(ROT[id]), id);
    for (const sti of stier) assert.match(sti, new RegExp(`^${ROT[id]}(?:[a-z0-9-]+/)?$`, 'u'), sti);
  }
});

test('hvert tall har kilde hos amerikansk myndighet eller extension, sitat, lenke og årstall', () => {
  for (const id of FAM) {
    const d = data(id);
    for (const [k, kilde] of Object.entries(d.kilder)) {
      assert.match(kilde.adresse, DOMENER, `${id}: ${k}`);
      assert.ok(kilde.aar >= 2019, `${id}: ${k} mangler årstall`);
    }
    for (const r of d.rader) {
      assert.ok(Object.keys(r.tall).length > 0, `${id}/${r.id}: ingen tall`);
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

test('FSIS-minimum står først: sider om kjøtt og fjærkre nevner den føderale kilden før noen annen', async () => {
  const s = Object.fromEntries(await sider('kjernetemperatur'));
  for (const slug of ['chicken', 'turkey', 'ground-beef', 'steak', 'pork', 'lamb', 'salmon', 'ham']) {
    const tekst = synligTekst(s[`${ROT.kjernetemperatur}${slug}/`]);
    assert.match(tekst, /FoodSafety\.gov|USDA FSIS/u, slug);
    assert.doesNotMatch(tekst, /\b(?:rare|medium rare)\b[^.]{0,20}\d+°F/u, `${slug}: stekegrad med tall uten kilde`);
  }
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
      for (const li of punkter) assert.match(li, /<a href="https:\/\/[^"]+" rel="noopener">[^<]+<\/a> \(\d{4}\)\. Read [A-Z][a-z]+ \d{1,2}, \d{4}\./u, sti);
      assert.ok(!JSON.stringify(side.schemas).includes('"Person"'), `${sti}: engelske sider har ikke Person-forfatter`);
    }
  }
});

test('samme rad-id på nb og en gir hreflang, og en vare uten norsk motstykke står alene', () => {
  const grupper = familieGrupper();
  const g = (navn) => grupper.find((x) => x.id === navn);
  assert.deepEqual(g('auto-fam-kjernetemperatur-kalkun').sider, { nb: '/kjernetemperatur/kalkun/', sv: '/sv/innertemperatur/kalkon/', da: '/da/kernetemperatur/kalkun/', en: '/en/internal-temperature/turkey/' });
  assert.deepEqual(g('auto-fam-steketid-kalkun').sider, { nb: '/steketid/kalkun/', en: '/en/cooking-times/turkey/' });
  assert.deepEqual(g('auto-fam-steketid-hel-kylling').sider, { nb: '/steketid/hel-kylling/', en: '/en/cooking-times/whole-chicken/' });
  assert.deepEqual(g('auto-fam-steketid-tining').sider, { en: '/en/cooking-times/thaw-turkey/' });
  assert.deepEqual(g('auto-fam-kjernetemperatur-nav').sider, { nb: '/kjernetemperatur/', sv: '/sv/innertemperatur/', da: '/da/kernetemperatur/', en: '/en/internal-temperature/' });
  assert.deepEqual(g('auto-fam-steketid-nav').sider, { nb: '/steketid/', en: '/en/cooking-times/' });
});

test('kalkunkalkulatoren slår opp vekten i FSIS-tabellen: bandene i skjemaet er radens egne tall', async () => {
  const d = data('steketid');
  const kalkun = d.rader.find((r) => r.id === 'kalkun');
  const side = (await sider('steketid')).find(([sti]) => sti === 'cooking-times/turkey/')[1];
  const json = JSON.parse(/<script type="application\/json" class="kalk-data">([\s\S]*?)<\/script>/u.exec(side.rik)[1].replaceAll('\\u003c', '<'));
  assert.deepEqual(json.band.map((s) => s.navn), ['Unstuffed', 'Stuffed']);
  assert.deepEqual(json.band[0].band[2], { a: kalkun.tall['u3w-min'].verdi, b: kalkun.tall['u3w-maks'].verdi, c: kalkun.tall['u3t-min'].verdi, d: kalkun.tall['u3t-maks'].verdi });
  assert.deepEqual(json.band[0].band[2], { a: 14, b: 18, c: 3.75, d: 4.25 });
  assert.match(synligTekst(side), /16 pounds, unstuffed: 3 3\/4 to 4 1\/4 hours/u);
});

test('kalkulator-blokka i site.js har ingen språkstrenger og håndterer grensevekter', () => {
  const js = readFileSync(new URL('../site.js', import.meta.url), 'utf8');
  const blokk = js.slice(js.indexOf('Vekt-til-tid med tabellbånd'), js.indexOf('Mengde per person (form.kalk'));
  assert.ok(blokk.length > 500, 'blokka finnes');
  const kode = blokk.slice(blokk.indexOf('(() => {')).replace(/\/\/[^\n]*/gu, '');
  assert.doesNotMatch(kode, /pound|hour|day|thaw|turkey/iu, 'ingen engelske strenger i site.js');
  assert.match(blokk, /treff\.length === 1/u);
  assert.match(js, /:not\(\[data-kalk="band"\]\)/u, 'den generelle kalkulatoren hopper over band-kortet');
});

test('sidene om stekegrader finnes ikke: ingen kilde navngir rare og medium', async () => {
  const stier = (await sider('kjernetemperatur')).map(([sti]) => sti);
  assert.ok(!stier.some((s) => /rare|medium|doneness/u.test(s)));
});

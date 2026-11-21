// Familiene «holdbarhet», «frysing» og «kjernetemperatur» på svensk (sv): adressene, kildene og reglene for innholdet.
// Tallene er hentet fra svenske kilder (Livsmedelsverket først, så Svenskt Kött og Svensk Fågel), ikke oversatt fra norsk.
// Den generelle tallvakten og likhetsvakten står i test/familier.test.mjs; sitatkontrollen mot kildene kjøres med holdbarhet/kildekontroll.mjs <familie> sv.
import assert from 'node:assert/strict';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { lesData, publiserbare } from '../scripts/familier/felles.mjs';
import { FAMILIER, familieGrupper, familieSider } from '../scripts/familier/register.mjs';
import { synligTekst, tallUtenforData } from './hjelp/familievakt.mjs';

const ROT = { holdbarhet: 'hallbarhet/', frysing: 'frysa/', kjernetemperatur: 'innertemperatur/' };
const ANTALL = { holdbarhet: 10, frysing: 11, kjernetemperatur: 6 };
const FAM = Object.keys(ROT);
const familie = (id) => FAMILIER.find((f) => f.id === id);
const data = (id) => lesData(fileURLToPath(familie(id).mappe), 'sv');
const mal = (id) => import(new URL('mal-sv.mjs', familie(id).mappe));
const sider = async (id) => Object.entries(await familieSider('sv', [familie(id)]));
const DOMENER = /^https:\/\/(?:www\.livsmedelsverket\.se|svensktkott\.se|svenskfagel\.se)\//u;
const UTGIVERE = new Set(['Livsmedelsverket', 'Svenskt Kött', 'Svensk Fågel']);

test('adressene er låst: samleside og varesider per familie under /sv/', async () => {
  for (const id of FAM) {
    assert.deepEqual(familie(id).markeder.sv, { rot: ROT[id] }, id);
    const stier = (await sider(id)).map(([sti]) => sti);
    assert.equal(stier.length, ANTALL[id] + 1, id);
    assert.ok(stier.includes(ROT[id]), id);
    for (const sti of stier) assert.match(sti, new RegExp(`^${ROT[id]}(?:[a-z0-9-]+/)?$`, 'u'), sti);
  }
});

test('hvert tall har kilde hos svensk myndighet eller bransjeorganisasjon, sitat, lenke og årstall', () => {
  for (const id of FAM) {
    const d = data(id);
    for (const [k, kilde] of Object.entries(d.kilder)) {
      assert.match(kilde.adresse, DOMENER, `${id}: ${k}`);
      assert.ok(UTGIVERE.has(kilde.utgiver), `${id}: ${k}`);
      assert.ok(kilde.aar >= 2023, `${id}: ${k} mangler årstall`);
    }
    for (const r of d.rader) {
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

test('ingen norske kilder, ingen tankestrek, kildeliste med lenke og lesedato, og ingen Person-forfatter', async () => {
  for (const id of FAM) {
    for (const [sti, side] of await sider(id)) {
      const tekst = synligTekst(side);
      assert.doesNotMatch(tekst, /[—–]/u, sti);
      assert.doesNotMatch(tekst, /Mattilsynet|MatPrat|Helsedirektoratet/u, sti);
      const kilder = /<ol class="kilder" id="kilder">([\s\S]*?)<\/ol>/u.exec(side.rik)?.[1] ?? '';
      const punkter = [...kilder.matchAll(/<li>([\s\S]*?)<\/li>/gu)].map((m) => m[1]);
      assert.ok(punkter.length > 0, `${sti}: mangler kildeliste`);
      for (const li of punkter) assert.match(li, /<a href="https:\/\/[^"]+" rel="noopener">[^<]+<\/a> \(\d{4}\)\. Läst \d{1,2} [a-z]+ \d{4}\./u, sti);
      assert.ok(!JSON.stringify(side.schemas).includes('"Person"'), `${sti}: svenske sider har ikke Person-forfatter`);
    }
  }
});

test('Livsmedelsverket står først i kildelista når siden bruker den', async () => {
  for (const id of FAM) {
    for (const [sti, side] of await sider(id)) {
      const utgivere = [...side.rik.matchAll(/<li>([^:<]+): <a href/gu)].map((m) => m[1]);
      const lv = utgivere.indexOf('Livsmedelsverket');
      if (lv >= 0) assert.equal(lv, 0, `${sti}: Livsmedelsverket skal stå først`);
    }
  }
});

test('samme rad-id på nb og sv gir hreflang, og en vare uten norsk motstykke står alene', () => {
  const grupper = familieGrupper();
  const g = (navn) => grupper.find((x) => x.id === navn);
  assert.deepEqual(g('auto-fam-holdbarhet-egg').sider, { nb: '/holdbarhet/egg/', sv: '/sv/hallbarhet/agg/', en: '/en/how-long-does-it-last/eggs/' });
  assert.deepEqual(g('auto-fam-kjernetemperatur-kylling').sider.sv, '/sv/innertemperatur/kyckling/');
  assert.deepEqual(g('auto-fam-holdbarhet-framme').sider, { sv: '/sv/hallbarhet/framme/' });
  assert.equal(g('auto-fam-frysing-nav').sider.sv, '/sv/frysa/');
});

test('siden om kokt ris sier at källorna inte har en egen tid for ris', async () => {
  const s = Object.fromEntries(await sider('holdbarhet'));
  assert.match(synligTekst(s['hallbarhet/kokt-ris-och-pasta/']), /ingen särskild tid för kokt ris/u);
});

test('svensk kyckling: tallene er de svenske (70 og 80), ikke de norske 75', async () => {
  const s = Object.fromEntries(await sider('kjernetemperatur'));
  const tekst = synligTekst(s['innertemperatur/kyckling/']);
  assert.match(tekst, /80 °C intill benet/u);
  assert.doesNotMatch(tekst, /\b75\b/u);
});

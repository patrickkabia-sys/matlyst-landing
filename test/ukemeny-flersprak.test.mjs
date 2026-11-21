// Ukemenyene på svensk (/sv/veckomenyer/), dansk (/da/madplaner/) og amerikansk engelsk (/en/weekly-meal-plans/).
// Rettene er det man lager en hverdag i landet (ikke de norske rettene oversatt), lenkene går til en kilde i landet (Arla, Taste of Home),
// tallene og sitatene er fra myndigheten i landet (Livsmedelsverket, Fødevarestyrelsen, USDA FSIS), og hver uke henger sammen via rester.
// Den generelle tall-, likhets- og filvakten står i test/familier.test.mjs; sitatkontrollen mot kildene kjøres med
// node scripts/familier/holdbarhet/kildekontroll.mjs ukemeny <marked>. Norsk står i test/ukemeny.test.mjs.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { avvik } from '../scripts/familier/holdbarhet/kildekontroll.mjs';
import { lesData, publiserbare } from '../scripts/familier/felles.mjs';
import { FAMILIER, familieForSti, familieGrupper, familieSider } from '../scripts/familier/register.mjs';
import { DAGER_MARKED, handleliste, lesMenyerMarked, validerMenyer } from '../scripts/familier/ukemeny/meny.mjs';
import { NORSKE_RESTORD } from './hjelp/restord.mjs';
import { synligTekst, tallUtenforData } from './hjelp/familievakt.mjs';

const ROT = fileURLToPath(new URL('..', import.meta.url));
const FAMILIE = FAMILIER.find((f) => f.id === 'ukemeny');
const OPPSETT = {
  sv: { rot: 'veckomenyer/', sprak: '/sv/', vert: 'www.arla.se', myndighet: /^https:\/\/www\.livsmedelsverket\.se\//u, utgiver: 'Livsmedelsverket', appside: 'sv/veckomeny-app/', lest: /Läst \d{1,2} [a-z]+ \d{4}\./u },
  da: { rot: 'madplaner/', sprak: '/da/', vert: 'www.arla.dk', myndighet: /^https:\/\/www\.foedevarestyrelsen\.dk\//u, utgiver: 'Fødevarestyrelsen', appside: 'da/madplan-app/', lest: /Læst \d{1,2}\. [a-z]+ \d{4}\./u },
  en: { rot: 'weekly-meal-plans/', sprak: '/en/', vert: 'www.tasteofhome.com', myndighet: /^https:\/\/www\.fsis\.usda\.gov\//u, utgiver: 'USDA Food Safety and Inspection Service', appside: 'en/meal-plan-app/', lest: /Accessed [A-Z][a-z]+ \d{1,2}, \d{4}\./u },
};
const SLUGS = {
  sv: ['barnfamilj', 'billig', 'vegetarisk', 'for-en-person', 'husmanskost'],
  da: ['boernefamilie', 'billig', 'vegetarisk', 'til-en', 'klassiske-retter'],
  en: ['family', 'budget', 'vegetarian', 'for-one', 'comfort-food'],
};
const IDER = ['familie', 'billig', 'vegetar', 'for-en', 'husmannskost'];
const MARKEDER = Object.keys(OPPSETT);
const html = (sti) => readFileSync(join(ROT, sti, 'index.html'), 'utf8');
const hoved = (sti) => html(sti).match(/<main[\s\S]*?<\/main>/u)?.[0] ?? '';
const data = (mk) => lesData(fileURLToPath(FAMILIE.mappe), mk);
const sider = async (mk) => Object.entries(await familieSider(mk, [FAMILIE]));
const adresser = (mk) => ['', ...SLUGS[mk]].map((s) => `${OPPSETT[mk].sprak}${OPPSETT[mk].rot}${s ? `${s}/` : ''}`);

test('adresselås: samleside og fem menyer per marked, i sitemap, med canonical, og samlesiden i llms.txt', () => {
  const llms = readFileSync(join(ROT, 'llms.txt'), 'utf8');
  for (const mk of MARKEDER) {
    assert.deepEqual(FAMILIE.markeder[mk], { rot: OPPSETT[mk].rot }, mk);
    assert.deepEqual(publiserbare(data(mk)).map((r) => r.slug), SLUGS[mk], mk);
    assert.deepEqual(publiserbare(data(mk)).map((r) => r.id), IDER, mk);
    const kart = readFileSync(join(ROT, `sitemap-${mk}.xml`), 'utf8');
    for (const a of adresser(mk)) {
      assert.match(kart, new RegExp(`<loc>https://matlyst-app\\.no${a}</loc>`, 'u'), a);
      assert.equal(familieForSti(a), 'ukemeny', a);
      assert.match(html(a.slice(1)), new RegExp(`<link rel="canonical" href="https://matlyst-app\\.no${a}">`, 'u'), a);
    }
    assert.match(llms, new RegExp(`\\]\\(https://matlyst-app\\.no${adresser(mk)[0]}\\)`, 'u'), mk);
    assert.doesNotMatch(llms, new RegExp(`matlyst-app\\.no${adresser(mk)[0]}[a-z]`, 'u'), `${mk}: enkeltsidene står ikke i llms.txt`);
  }
});

test('samme rad-id gir hreflang mellom alle fire språk for samme menytype', () => {
  const grupper = familieGrupper();
  for (const [i, id] of IDER.entries()) {
    const g = grupper.find((x) => x.id === `auto-fam-ukemeny-${id}`);
    assert.ok(g, id);
    assert.equal(Object.keys(g.sider).length, 4, id);
    for (const mk of MARKEDER) assert.equal(g.sider[mk], `${OPPSETT[mk].sprak}${OPPSETT[mk].rot}${SLUGS[mk][i]}/`, `${id}/${mk}`);
    for (const side of Object.values(g.sider)) {
      const h = html(side.slice(1));
      for (const lang of ['nb-NO', 'sv-SE', 'da-DK', 'en']) assert.match(h, new RegExp(`<link rel="alternate" hreflang="${lang}" href="https://matlyst-app\\.no/`, 'u'), `${side} ${lang}`);
    }
  }
  const nav = grupper.find((x) => x.id === 'auto-fam-ukemeny-nav');
  assert.deepEqual(nav.sider, { nb: '/ukemenyer/', sv: '/sv/veckomenyer/', da: '/da/madplaner/', en: '/en/weekly-meal-plans/' });
});

test('hver meny har sju dager i rekkefølge, og hver rest kommer fra en tidligere dag som lager mer', () => {
  for (const mk of MARKEDER) {
    const M = lesMenyerMarked(mk);
    assert.deepEqual(Object.keys(M.menyer).sort(), [...IDER].sort(), mk);
    for (const [id, meny] of Object.entries(M.menyer)) {
      assert.deepEqual(meny.dager.map((x) => x.dag), DAGER_MARKED[mk], `${mk}/${id}`);
      const rester = meny.dager.filter((x) => x.rest);
      assert.ok(rester.length >= 1, `${mk}/${id}: uka har ingen rest`);
      assert.ok(meny.dager.filter((x) => x.lagMer).length === rester.length, `${mk}/${id}: hver dag som lager mer har en dag som bruker det`);
    }
    // For én har en rest via fryseren, slik den norske uka har.
    assert.ok(M.menyer['for-en'].dager.some((x) => x.rest?.via === 'fryser'), `${mk}: for en går én porsjon via fryseren`);
  }
});

test('hver dag lenker til en oppskrift i landet eller har egen framgangsmåte, og lenkene står på siden', async () => {
  for (const mk of MARKEDER) {
    const M = lesMenyerMarked(mk);
    for (const r of publiserbare(data(mk))) {
      const side = hoved(`${mk}/${OPPSETT[mk].rot}${r.slug}`);
      for (const x of M.menyer[r.id].dager) {
        if (x.oppskrift) {
          assert.equal(new URL(x.oppskrift).hostname, OPPSETT[mk].vert, `${mk}/${r.id}/${x.dag}`);
          assert.ok(side.includes(`href="${x.oppskrift}"`), `${mk}/${r.id}/${x.dag}`);
        } else assert.ok(x.framgang.every((s) => side.includes(s)), `${mk}/${r.id}/${x.dag}`);
      }
      assert.doesNotMatch(side, /matprat\.no/u, `${mk}/${r.id}: ingen norsk kilde`);
    }
  }
});

test('handlelista på siden dekker nøyaktig varene rettene trenger, i appens hyller', () => {
  for (const mk of MARKEDER) {
    const M = lesMenyerMarked(mk);
    for (const r of publiserbare(data(mk))) {
      const side = hoved(`${mk}/${OPPSETT[mk].rot}${r.slug}`);
      const paaSiden = new Map();
      for (const [, hylle, liste] of side.matchAll(/<ul class="handleliste" data-hylle="([^"]+)">([\s\S]*?)<\/ul>/gu)) {
        for (const [, vare] of liste.matchAll(/<li data-vare="([^"]+)">/gu)) {
          assert.ok(!paaSiden.has(vare), `${mk}/${r.id}: ${vare} står to ganger`);
          paaSiden.set(vare.replace(/&amp;/gu, '&'), hylle.replace(/&amp;/gu, '&'));
        }
      }
      const trengs = new Set(M.menyer[r.id].dager.flatMap((x) => x.varer));
      assert.deepEqual([...paaSiden.keys()].sort(), [...trengs].sort(), `${mk}/${r.id}`);
      for (const [vare, hylle] of paaSiden) assert.equal(hylle, M.varer[vare], `${mk}/${r.id}: ${vare}`);
      assert.deepEqual(handleliste(M.menyer[r.id], M, mk).flatMap((h) => h.varer.map((v) => v.vare)).sort(), [...trengs].sort(), `${mk}/${r.id}`);
    }
  }
});

test('tall og sitater er fra myndigheten i landet: kilde, årstall, lesedato og sitat for hvert tall', async () => {
  for (const mk of MARKEDER) {
    const d = data(mk);
    for (const [k, kilde] of Object.entries(d.kilder)) {
      assert.match(kilde.adresse, OPPSETT[mk].myndighet, `${mk}: ${k}`);
      assert.equal(kilde.utgiver, OPPSETT[mk].utgiver, `${mk}: ${k}`);
      assert.ok(kilde.aar >= 2020, `${mk}: ${k}`);
    }
    for (const r of d.rader) {
      for (const [felt, t] of Object.entries(r.tall)) {
        assert.ok(t.merknad && t.merknad.length >= 10, `${mk}/${r.id}/${felt}: mangler sitatet`);
        assert.ok(Object.hasOwn(d.kilder, t.kilde), `${mk}/${r.id}/${felt}`);
      }
    }
    // Hvert tall på hver side står i datafila, og hver side bruker hver kilde i datafila.
    const m = await import(new URL(`mal-${mk}.mjs`, FAMILIE.mappe));
    for (const [sti, side] of await sider(mk)) {
      const rad = publiserbare(d).find((r) => sti === `${OPPSETT[mk].rot}${r.slug}/`);
      assert.deepEqual(tallUtenforData(side, rad ? m.tillatteTall(rad, d) : m.tillatteTallNav(d)), [], sti);
      const kilder = /<ol class="kilder" id="kilder">([\s\S]*?)<\/ol>/u.exec(side.rik)?.[1] ?? '';
      const punkter = [...kilder.matchAll(/<li>([\s\S]*?)<\/li>/gu)].map((x) => x[1]);
      assert.equal(punkter.length, Object.keys(d.kilder).length, `${sti}: kildelista har alle kildene siden bruker`);
      for (const li of punkter) {
        assert.match(li, /<a href="https:\/\/[^"]+" rel="noopener">[^<]+<\/a> \(\d{4}\)\./u, sti);
        assert.match(li, OPPSETT[mk].lest, sti);
      }
    }
  }
});

test('sitatene er ordrett kontrollerbare: avvik() gir rødt for et sitat som ikke står i kilden', () => {
  for (const mk of MARKEDER) {
    const d = data(mk);
    const [forste] = Object.keys(d.kilder);
    // En kildetekst som mangler sitatene gir avvik; en som har dem gir ingen.
    const alle = Object.fromEntries(Object.keys(d.kilder).map((k) => [k, d.rader.flatMap((r) => [...Object.values(r.tall).filter((t) => t.kilde === k).map((t) => t.merknad), ...Object.values(r.tekst ?? {}).filter((v) => v.startsWith(`${k}|`)).map((v) => v.split('|').slice(1).join('|'))]).join(' ')]));
    assert.deepEqual(avvik(d, alle), [], mk);
    assert.ok(avvik(d, { ...alle, [forste]: 'tom side' }).length > 0, `${mk}: avvik() må bli rød`);
  }
});

test('ingen tankestrek, ingen norske restord, ingen priser, ingen Person-forfatter, og dansk uten «nok»', async () => {
  for (const mk of MARKEDER) {
    for (const [sti, side] of await sider(mk)) {
      const tekst = synligTekst(side);
      assert.doesNotMatch(tekst, /[—–]/u, sti);
      assert.doesNotMatch(tekst, /Mattilsynet|MatPrat|Helsedirektoratet/u, sti);
      assert.equal(NORSKE_RESTORD.test(tekst), false, sti);
      assert.doesNotMatch(tekst, /(?<![\p{L}])(?:kr|kronor|DKK|SEK|NOK|USD)(?![\p{L}])|[$€£]/u, `${sti}: ingen priser`);
      assert.ok(!JSON.stringify(side.schemas).includes('"Person"'), `${sti}: ingen Person-forfatter`);
      if (mk === 'da') assert.doesNotMatch(tekst, /\bnok\b/iu, `${sti}: dansk tekst kan ikke inneholde «nok»`);
    }
  }
});

test('siden skriver ingen helsepåstander eller næringstall', async () => {
  const FORBUDT = /(?<![\p{L}])(?:kalorier|calories|protein|vitaminer|vitamins|sund|sunn|hälsosam|healthy|nutrition|näring|næring)(?![\p{L}])/iu;
  for (const mk of MARKEDER) {
    for (const [sti, side] of await sider(mk)) {
      const tekst = synligTekst(side).replace(/(?:Vi anger inga priser, kalorier[^.]*\.|Vi oplyser ingen priser, kalorier[^.]*\.|We list no prices, calories[^.]*\.|Hvorfor står der ingen priser eller kalorier\?|Varför står det inga priser eller kalorier\?|Why are there no prices or calories\?|Vi skriver kun tal[^.]*\.|Vi skriver bara siffror[^.]*\.|We only write numbers[^.]*\.|Priserne ændrer[^.]*\.|Priserna ändras[^.]*\.|Prices change[^.]*\.|Inga siffror[^.]*\.|Ingen tal[^.]*\.|No numbers[^.]*\.)/gu, ' ');
      assert.doesNotMatch(tekst, FORBUDT, sti);
    }
  }
});

test('appsidene for ukemeny lenker til samlesiden på hvert språk', () => {
  for (const mk of MARKEDER) {
    assert.match(html(OPPSETT[mk].appside), new RegExp(`href="${OPPSETT[mk].sprak}${OPPSETT[mk].rot}"`, 'u'), mk);
  }
});

test('valideringen er rød for en lenke til en annen kilde, en rest som er for gammel, en vare uten hylle og en uke uten sju dager', () => {
  for (const mk of MARKEDER) {
    const kopi = () => structuredClone(JSON.parse(readFileSync(new URL(`../scripts/familier/ukemeny/menyer.${mk}.json`, import.meta.url), 'utf8')));
    assert.doesNotThrow(() => validerMenyer(kopi(), mk), mk);
    const norsk = kopi();
    norsk.menyer.familie.dager[0].oppskrift = 'https://www.matprat.no/oppskrifter/familien/spagetti-bolognese/';
    assert.throws(() => validerMenyer(norsk, mk), /godkjent oppskriftskilde/u, mk);
    const utenHylle = kopi();
    utenHylle.menyer.billig.dager[0].varer.push('safran');
    assert.throws(() => validerMenyer(utenHylle, mk), /ingen hylle/u, mk);
    const seks = kopi();
    seks.menyer.vegetar.dager.pop();
    assert.throws(() => validerMenyer(seks, mk), mk);
    const gammel = kopi();
    const dagene = gammel.menyer['for-en'].dager;
    const i = dagene.findIndex((x) => x.rest && !x.rest.via);
    // Finnes ingen rest uten fryser i for-en, bruk en annen meny.
    const [menyId, dag] = i >= 0 ? ['for-en', dagene[i]] : ['familie', gammel.menyer.familie.dager.find((x) => x.rest && !x.rest.via)];
    gammel.menyer[menyId].dager.find((x) => x === dag).rest.fra = DAGER_MARKED[mk][0];
    gammel.menyer[menyId].dager[0].lagMer = 'Make more.';
    gammel.menyer[menyId].dager[1].lagMer = 'Make more.';
    assert.throws(() => validerMenyer(gammel, mk), mk);
  }
});

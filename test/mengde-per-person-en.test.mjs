// «How much per person» på amerikansk engelsk (en-US): /en/how-much-per-person/. Adressene er låst, hvert tall har sitat fra en navngitt amerikansk kilde,
// kalkulatoren i site.js (blokken portion:start til portion:slutt) regner likt som tabellene (regn-en.mjs), og US-mål står først med metrisk i parentes.
// Tallene er hentet fra kildene, ikke oversatt fra norsk. Sitatkontrollen mot kildene: node scripts/familier/mengde-per-person/kildekontroll.mjs en
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { lesData, publiserbare } from '../scripts/familier/felles.mjs';
import { FAMILIER, familieForSti, familieGrupper, familieSider } from '../scripts/familier/register.mjs';
import { avvik } from '../scripts/familier/mengde-per-person/kildekontroll.mjs';
import { PERSONS, START, delTekst, setning, variantDeler } from '../scripts/familier/mengde-per-person/regn-en.mjs';
import { perPerson } from '../scripts/familier/mengde-per-person/mal-en.mjs';
import { TEKST } from '../scripts/familier/mengde-per-person/tekst-en.mjs';
import { synligTekst } from './hjelp/familievakt.mjs';

const ROT = fileURLToPath(new URL('..', import.meta.url));
const familie = FAMILIER.find((f) => f.id === 'mengde-per-person');
const data = lesData(fileURLToPath(familie.mappe), 'en');
const rader = publiserbare(data);
const html = (sti) => readFileSync(join(ROT, sti, 'index.html'), 'utf8');
const hoved = (sti) => html(sti).match(/<main[\s\S]*?<\/main>/u)?.[0] ?? '';
const siteJs = readFileSync(join(ROT, 'site.js'), 'utf8');
const tekstAv = (h) => h.replace(/<script[\s\S]*?<\/script>/gu, ' ').replace(/<[^>]+>/gu, ' ').replace(/\s+/gu, ' ');

// Adressene er låst: en endring her er en bevisst adresseendring.
const SLUGS = ['turkey', 'ham', 'prime-rib', 'chicken', 'mashed-potatoes', 'potato-salad', 'stuffing', 'rice', 'pasta', 'salad', 'vegetables', 'burgers', 'tacos', 'meat-for-a-party', 'thanksgiving-dinner'];
const ADRESSER = ['/en/how-much-per-person/', ...SLUGS.map((s) => `/en/how-much-per-person/${s}/`)];
const DOMENER = /^https:\/\/(?:www\.fsis\.usda\.gov|www\.eatturkey\.org|extension\.sdstate\.edu|www\.beefitswhatsfordinner\.com|www\.wholefoodsmarket\.com|blogs\.extension\.iastate\.edu|food\.unl\.edu|successrice\.com|idahopotato\.com)\//u;

test('adresselås: samleside og 15 sider, alle i sitemap-en.xml og bare der, og ikke i norsk sitemap', () => {
  assert.deepEqual(familie.markeder.en, { rot: 'how-much-per-person/' });
  assert.deepEqual(rader.map((r) => r.slug), SLUGS);
  const kart = readFileSync(join(ROT, 'sitemap-en.xml'), 'utf8');
  for (const a of ADRESSER) {
    assert.match(kart, new RegExp(`<loc>https://matlyst-app\\.no${a}</loc>`, 'u'), a);
    assert.equal(familieForSti(a), 'mengde-per-person', a);
    assert.match(html(a.slice(1)), new RegExp(`<link rel="canonical" href="https://matlyst-app\\.no${a}">`, 'u'), a);
  }
  assert.doesNotMatch(readFileSync(join(ROT, 'sitemap.xml'), 'utf8'), /how-much-per-person/u);
  const llms = readFileSync(join(ROT, 'llms.txt'), 'utf8');
  assert.match(llms, /\]\(https:\/\/matlyst-app\.no\/en\/how-much-per-person\/\)/u);
  assert.doesNotMatch(llms, /matlyst-app\.no\/en\/how-much-per-person\/[a-z]/u);
});

test('hver rad har tekst og omvendt, kids teller halvt, og hvert tall har sitat og kilde hos en amerikansk utgiver med lenke og år', () => {
  assert.deepEqual(Object.keys(TEKST).sort(), rader.map((r) => r.id).sort());
  for (const [id, k] of Object.entries(data.kilder)) {
    assert.match(k.adresse, DOMENER, id);
    assert.ok(k.aar >= 2010 && k.aar <= 2026, `${id}: ${k.aar}`);
    assert.doesNotMatch(`${k.navn} ${k.utgiver}`, /MatPrat|Helsedirektoratet/u, id);
  }
  for (const r of rader) {
    assert.equal(r.tall.barn.verdi, 0.5, `${r.id}: barn teller en halv porsjon`);
    for (const [felt, t] of Object.entries(r.tall)) {
      assert.ok(t.merknad && t.merknad.length > 5, `${r.id}/${felt}: sitat mangler`);
      assert.ok(data.kilder[t.kilde], `${r.id}/${felt}: ukjent kilde`);
      assert.ok(stårISitatet(t.verdi, t.merknad), `${r.id}/${felt}: ${t.verdi} står ikke i «${t.merknad}»`);
    }
  }
});

// Verdien i datafila må stå i sitatet, som tall, brøk eller ord.
const ORD = { 0.25: ['¼', 'quarter'], 0.75: ['¾'], 1: ['one'], 2: ['two'], 3: ['three'], 1.25: ['1¼', '1 1/4'], 0.5: ['½'], 2.5: ['2 ½'] };
const BROK = { 0.25: ['1/4'], 0.333: ['1/3'], 0.5: ['1/2'], 0.75: ['3/4'] };
export function stårISitatet(verdi, sitat) {
  const flat = sitat.replace(/\s+/gu, ' ').toLowerCase();
  const kandidater = [String(verdi), ...(BROK[verdi] ?? []), ...(ORD[verdi] ?? [])].map((k) => k.toLowerCase());
  return kandidater.some((k) => new RegExp(`(?<![\\d/.])${k.replace(/[.*+?^${}()|[\]\\/]/gu, '\\$&')}(?!\\d|/\\d|\\.\\d)`, 'u').test(flat));
}
test('verdivakten blir rød når verdien ikke er den sitatet sier', () => {
  assert.equal(stårISitatet(0.333, 'boneless ham: 1/4-1/3 lb. per serving'), true);
  assert.equal(stårISitatet(1.25, 'Turkey* / | 1¼ pounds / | 5 – 6 pounds'), true);
  assert.equal(stårISitatet(4, 'about 3/4 cup of stuffing'), false);
  assert.equal(stårISitatet(0.5, 'about 3/4 cup'), false);
});

test('kildekontrollen blir rød når et sitat ikke står hos kilden, og grønn når alle gjør det', () => {
  const tekster = {};
  for (const r of data.rader) for (const t of Object.values(r.tall)) tekster[t.kilde] = `${tekster[t.kilde] ?? ''} ${t.merknad}`;
  assert.deepEqual(avvik(data, tekster), []);
  const endret = structuredClone(tekster);
  endret.fsisturkey = endret.fsisturkey.replaceAll('Allow 1 pound of turkey per person.', 'Allow 2 pounds of turkey per person.');
  assert.ok(avvik(data, endret).some((f) => f.id === 'kalkun' && f.felt === 'usda'), 'et endret sitat gir rødt');
  assert.ok(avvik(data, {}).length > 0, 'uten kildetekst er alt avvik');
});

// Regnereglene i site.js (blokken mellom portion:start og portion:slutt) er en kopi av regn-en.mjs. Her kjøres kopien mot originalen.
function siteRegler(kilde = siteJs) {
  const a = kilde.indexOf('// portion:start');
  const b = kilde.indexOf('// portion:slutt');
  assert.ok(a > -1 && b > a, 'markørene portion:start og portion:slutt må finnes i site.js');
  return new Function(`${kilde.slice(a, b)}\nreturn { delTekst, deler, setningTekst };`)();
}
const TEKSTER = { adult: 'adult', adults: 'adults', kid: 'kid', kids: 'kids', and: 'and', need: 'need', needs: 'needs', or: 'or', to: 'to' };
const varianterAv = (r) => TEKST[r.id].varianter.map((v) => ({ navn: v.navn, deler: v.deler.map((d) => { const [a, b] = Array.isArray(d) ? d : [d, d]; const x = perPerson(r.tall[a]); const y = perPerson(r.tall[b]); return { min: x.verdi, maks: y.verdi, enhet: x.enhet }; }) }));

test('kalkulatoren i site.js regner likt som regn-en.mjs for alle varianter, mange antall og kids', () => {
  const js = siteRegler();
  let antall = 0;
  for (const r of rader) {
    for (const v of varianterAv(r)) {
      const vd = { n: v.navn, d: v.deler.map((d) => [d.min, d.maks, d.enhet]) };
      for (const voksne of [0, 1, 2, 3, 4, 7, 10, 12, 25, 100, 999]) {
        for (const barn of [0, 1, 2, 5, 13]) {
          assert.deepEqual(js.deler(vd, voksne, barn, 0.5, 'to'), variantDeler(v, voksne, barn, 0.5, 'to'), `${r.id}/${v.navn} ${voksne}+${barn}`);
          assert.equal(js.setningTekst(vd, voksne, barn, 0.5, TEKSTER), setning(v, voksne, barn, 0.5, TEKSTER), `${r.id}/${v.navn} ${voksne}+${barn}`);
          antall += 1;
        }
      }
    }
  }
  assert.ok(antall > 2000, `kontrollerte ${antall}`);
});

test('kalkulatorvakten kan bli rød: en kopi med annen kilokonstant eller annen kopp gir andre svar', () => {
  const ødelagt = siteJs.replace('Math.round(g / 5) * 5} g', 'Math.round(g / 10) * 10} g');
  assert.notEqual(ødelagt, siteJs);
  assert.notEqual(siteRegler(ødelagt).delTekst(2, 2, 'oz', 'to'), delTekst(2, 2, 'oz', 'to'));
  const kopp = siteJs.replace('const CUP_ML = 240;', 'const CUP_ML = 250;');
  assert.notEqual(kopp, siteJs);
  assert.notEqual(siteRegler(kopp).delTekst(3, 3, 'cup', 'to'), delTekst(3, 3, 'cup', 'to'));
  assert.equal(siteRegler(siteJs).delTekst(4, 4, 'lb', 'to'), '4 lb (1.8 kg)');
});

test('tallskrivemåten: US først, metrisk i parentes, brøker, oz blir lb fra 16, intervaller og tellbare enheter', () => {
  assert.equal(delTekst(4, 4, 'lb'), '4 lb (1.8 kg)');
  assert.equal(delTekst(1.25, 1.5, 'lb'), '1 1/4 to 1 1/2 lb (565 g to 680 g)');
  assert.equal(delTekst(0.25, 0.333, 'lb'), '1/4 to 1/3 lb (115 g to 150 g)');
  assert.equal(delTekst(16, 24, 'oz'), '1 to 1 1/2 lb (455 g to 680 g)');
  assert.equal(delTekst(12, 18, 'oz'), '3/4 to 1 1/8 lb (340 g to 510 g)');
  assert.equal(delTekst(8, 8, 'oz'), '8 oz (225 g)');
  assert.equal(delTekst(3, 3, 'cup'), '3 cups (720 mL)');
  assert.equal(delTekst(3.75, 3.75, 'cup'), '3 3/4 cups (900 mL)');
  assert.equal(delTekst(0.5, 0.5, 'cup'), '1/2 cup (120 mL)');
  assert.equal(delTekst(6, 6, 'cup'), '6 cups (1.4 L)');
  assert.equal(delTekst(8, 12, 'taco'), '8 to 12 tacos');
  assert.equal(delTekst(1.5, 1.5, 'sandwich'), '1.5 sandwiches');
  assert.equal(delTekst(1, 1, 'slice'), '1 slice');
  assert.deepEqual(PERSONS, [2, 4, 6, 8, 10, 12]);
  assert.deepEqual(START, { adults: 4, kids: 0 });
  assert.deepEqual(perPerson({ verdi: 12.5, enhet: 'lb per 50 guests' }), { verdi: 0.25, enhet: 'lb' });
  assert.deepEqual(perPerson({ verdi: 1, enhet: 'rib per 2 guests' }), { verdi: 0.5, enhet: 'rib' });
  assert.equal(perPerson({ verdi: 8, enhet: 'people per pound' }), null);
});

test('hver side har kalkulator med riktig startsvar, tabell med seks kolonner, kilder og lenker som finnes', () => {
  for (const a of ADRESSER) {
    const side = hoved(a.slice(1));
    assert.match(side, /<form class="kalk" data-kalk="portion"/u, a);
    assert.doesNotMatch(side, /\sstyle=/u, `${a}: ingen inline style på engelske sider`);
    const json = JSON.parse(side.match(/<script type="application\/json" class="kalk-data">([\s\S]*?)<\/script>/u)[1]);
    assert.equal(json.b, 0.5, a);
    assert.deepEqual(json.s, [...PERSONS], a);
    const v0 = { navn: json.v[0].n, deler: json.v[0].d.map(([min, maks, enhet]) => ({ min, maks, enhet })) };
    const start = variantDeler(v0, START.adults, START.kids, json.b, 'to').map((x) => x.replace(/ \([^)]*\)/gu, ''));
    assert.ok(side.includes(`>${start[0]}</output>`), `${a}: startsvaret ${start[0]}`);
    assert.ok(side.includes(setning(v0, START.adults, START.kids, json.b, TEKSTER).replace(/&/gu, '&amp;')), `${a}: setningen`);
    if (a !== '/en/how-much-per-person/') assert.match(side, /<th scope="col">Number of adults<\/th><th scope="col">2<\/th><th scope="col">4<\/th><th scope="col">6<\/th><th scope="col">8<\/th><th scope="col">10<\/th><th scope="col">12<\/th>/u, a);
    assert.match(side, /<ol class="kilder" id="kilder"><li>/u, a);
    assert.match(side, /class="i-appen i-skalering"/u, `${a}: appkort for skalering`);
    for (const [, href] of side.matchAll(/href="(\/en\/how-much-per-person\/[^"]*)"/gu)) assert.ok(ADRESSER.includes(href), `${a}: lenken ${href} finnes ikke`);
    if (a !== '/en/how-much-per-person/') assert.match(side, /href="\/en\/how-much-per-person\/">All amounts per person</u, `${a}: lenke til samlesiden`);
  }
});

test('sentrale tall står både i data og på siden, fra den amerikanske kilden', () => {
  const t = (id, felt) => data.rader.find((r) => r.id === id).tall[felt].verdi;
  assert.equal(t('kalkun', 'usda'), 1);
  assert.equal(t('kalkun', 'wf'), 1.25);
  assert.equal(t('ham', 'med-ben-maks'), 0.5);
  assert.equal(t('stuffing', 'kasserolle'), 0.5);
  assert.equal(t('ris', 'hvit'), 0.5);
  assert.match(tekstAv(hoved('en/how-much-per-person/turkey')), /10 adults need 10 lb \(4\.5 kg\)/u);
  assert.match(hoved('en/how-much-per-person/turkey'), /<td>2 lb \(905 g\)<\/td>/u);
  assert.match(hoved('en/how-much-per-person/stuffing'), /12 to 15 cups/u);
});

test('samme rad-id som norsk gir hreflang, og en vare uten norsk motstykke står alene', () => {
  const g = (navn) => familieGrupper().find((x) => x.id === navn);
  assert.deepEqual(g('auto-fam-mengde-per-person-kalkun').sider, { nb: '/mengde-per-person/kalkun/', da: '/da/hvor-meget-pr-person/kalkun/', en: '/en/how-much-per-person/turkey/' });
  assert.deepEqual(g('auto-fam-mengde-per-person-ris').sider, { nb: '/mengde-per-person/ris/', sv: '/sv/hur-mycket-per-person/ris/', da: '/da/hvor-meget-pr-person/ris/', en: '/en/how-much-per-person/rice/' });
  assert.deepEqual(g('auto-fam-mengde-per-person-thanksgiving').sider, { en: '/en/how-much-per-person/thanksgiving-dinner/' });
  assert.deepEqual(g('auto-fam-mengde-per-person-nav').sider, { nb: '/mengde-per-person/', sv: '/sv/hur-mycket-per-person/', da: '/da/hvor-meget-pr-person/', en: '/en/how-much-per-person/' });
});

test('sidene har ingen tankestrek, ingen emoji, ingen norske kilder, ingen egne råd om hva som er nok, ingen forfatterlinje og en egen tittel hver', async () => {
  const sider = await familieSider('en', [familie]);
  assert.equal(Object.keys(sider).length, 16);
  const tittel = new Set();
  for (const [sti, side] of Object.entries(sider)) {
    const t = synligTekst(side);
    assert.doesNotMatch(t, /[—–]/u, `${sti}: tankestrek`);
    assert.doesNotMatch(t, /\p{Extended_Pictographic}/u, `${sti}: emoji`);
    assert.doesNotMatch(t, /MatPrat|Helsedirektoratet|Mattilsynet/u, `${sti}: norsk kilde`);
    assert.doesNotMatch(t, /\b(?:we recommend|we suggest|you should|healthy|unhealthy|safe to eat)\b/iu, `${sti}: egne råd`);
    assert.ok(!JSON.stringify(side.schemas).includes('"Person"'), `${sti}: engelske sider har ikke Person-forfatter`);
    assert.ok(!tittel.has(side.title), `${sti}: lik tittel`);
    tittel.add(side.title);
  }
});

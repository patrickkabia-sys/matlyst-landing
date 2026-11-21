// Familien «erstatning» på amerikansk engelsk (en-US): /en/substitutes/. Adressene er låst, hvert tall har et sitat fra en amerikansk kilde
// (land-grant extension eller King Arthur Baking), og sidene lover ikke mer enn kildene gir. Tallene er hentet fra kildene, ikke oversatt fra norsk.
// Den generelle tallvakten og likhetsvakten står i test/familier.test.mjs; sitatkontrollen mot kildene kjøres med:
// node scripts/familier/erstatning/kildekontroll.mjs erstatning en
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { lesData, publiserbare } from '../scripts/familier/felles.mjs';
import { FAMILIER, familieForSti, familieGrupper, familieSider } from '../scripts/familier/register.mjs';
import { avvik } from '../scripts/familier/erstatning/kildekontroll.mjs';
import { fmt } from '../scripts/familier/erstatning/bygg-en.mjs';
import { synligTekst } from './hjelp/familievakt.mjs';

const ROT = fileURLToPath(new URL('..', import.meta.url));
const familie = FAMILIER.find((f) => f.id === 'erstatning');
const data = lesData(fileURLToPath(familie.mappe), 'en');
const rader = publiserbare(data);
const hoved = (sti) => readFileSync(join(ROT, sti, 'index.html'), 'utf8');
const tekstAv = (html) => (html.match(/<main[\s\S]*?<\/main>/u)?.[0] ?? '').replace(/<script[\s\S]*?<\/script>/gu, ' ').replace(/<[^>]+>/gu, ' ').replace(/\s+/gu, ' ');
const SLUGS = ['buttermilk', 'eggs', 'baking-powder', 'yeast', 'butter', 'heavy-cream', 'half-and-half', 'sour-cream', 'milk', 'cake-flour', 'self-rising-flour', 'cornstarch', 'brown-sugar', 'powdered-sugar', 'honey', 'white-wine', 'red-wine', 'lemon-juice', 'fresh-vs-dried-herbs', 'garlic', 'broth', 'vanilla-extract'];
const DOMENER = /^https:\/\/(?:extension\.colostate\.edu|extension\.usu\.edu|food\.unl\.edu|www\.ndsu\.edu|agrilifeextension\.tamu\.edu|extension\.illinois\.edu|montana\.edu|www\.kingarthurbaking\.com)\//u;

test('adresselås: samleside og 22 sider under /en/substitutes/, alle i sitemap-en.xml og bare der', () => {
  assert.deepEqual(familie.markeder.en, { rot: 'substitutes/' });
  assert.deepEqual(rader.map((r) => r.slug), SLUGS);
  const kart = readFileSync(join(ROT, 'sitemap-en.xml'), 'utf8');
  for (const a of ['/en/substitutes/', ...SLUGS.map((s) => `/en/substitutes/${s}/`)]) {
    assert.match(kart, new RegExp(`<loc>https://matlyst-app\\.no${a}</loc>`, 'u'), a);
    assert.equal(familieForSti(a), 'erstatning', a);
    assert.match(hoved(a.slice(1)), new RegExp(`<link rel="canonical" href="https://matlyst-app\\.no${a}">`, 'u'), a);
  }
  assert.doesNotMatch(readFileSync(join(ROT, 'sitemap.xml'), 'utf8'), /\/en\/substitutes\//u, 'norsk sitemap');
  const llms = readFileSync(join(ROT, 'llms.txt'), 'utf8');
  assert.match(llms, /\]\(https:\/\/matlyst-app\.no\/en\/substitutes\/\)/u);
  assert.doesNotMatch(llms, /matlyst-app\.no\/en\/substitutes\/[a-z]/u);
});

test('hvert tall har sitat, kilde hos en amerikansk utgiver med lenke og år, og verdien står i sitatet', () => {
  for (const [id, k] of Object.entries(data.kilder)) {
    assert.match(k.adresse, DOMENER, id);
    assert.ok(k.aar >= 2019 && k.aar <= 2026, `${id}: ${k.aar}`);
    assert.doesNotMatch(`${k.navn} ${k.utgiver}`, /Mattilsynet|MatPrat|Idun/u, id);
  }
  for (const r of data.rader) {
    for (const [felt, t] of Object.entries(r.tall)) {
      assert.ok(Object.hasOwn(data.kilder, t.kilde), `${r.id}/${felt}: ukjent kilde`);
      assert.ok(t.merknad && t.merknad.length >= 10, `${r.id}/${felt}: mangler sitatet`);
      assert.ok(stårISitatet(t.verdi, t.merknad), `${r.id}/${felt}: ${t.verdi} står ikke i «${t.merknad}»`);
    }
    for (const [navn, v] of Object.entries(r.tekst ?? {})) {
      const [kilde, ...rest] = v.split('::');
      assert.ok(data.kilder[kilde] && rest.join('::').length > 20, `${r.id}/${navn}`);
    }
  }
});

// Verdien i datafila må stå i sitatet (som tall, brøk eller ord): ellers kan en verdi endres uten at kildekontrollen ser det.
const ORD = { 0.5: ['½', 'half'], 0.25: ['¼', 'quarter'], 0.75: ['¾'], 1: ['one'], 2: ['two'], 3: ['three'] };
const BROK = { 0.125: ['1/8'], 0.25: ['1/4', '¼'], 0.333: ['1/3'], 0.5: ['1/2', '½'], 0.625: ['5/8'], 0.667: ['2/3'], 0.75: ['3/4', '¾'], 0.8125: ['13/16'], 0.875: ['7/8', '⅞'], 1.125: ['1 1/8'], 1.25: ['1 1/4', '1-¼'], 1.333: ['1 1/3'], 1.5: ['1 1/2', '1-½', '1 ½'], 1.75: ['1 3/4'], 2.25: ['2 1/4', '2 ¼'], 2.5: ['2 1/2', '2 ½'], 0.6: ['6/10'] };
export function stårISitatet(verdi, sitat) {
  const flat = sitat.replace(/\s+/gu, ' ').toLowerCase();
  const kandidater = [String(verdi), fmt(verdi), ...(BROK[verdi] ?? []), ...(ORD[verdi] ?? [])].map((k) => k.toLowerCase());
  // Hele tall: «4» skal ikke treffe «3/4» eller «14».
  return kandidater.some((k) => new RegExp(`(?<![\\d/.])${k.replace(/[.*+?^${}()|[\]\\/]/gu, '\\$&')}(?!\\d|/\\d|\\.\\d)`, 'u').test(flat));
}
test('verdivakten blir rød når verdien ikke er den sitatet sier', () => {
  assert.equal(stårISitatet(0.25, 'use 1/4 teaspoon baking soda plus 5/8 teaspoon cream of tartar'), true);
  assert.equal(stårISitatet(0.625, 'use 1/4 teaspoon baking soda plus 5/8 teaspoon cream of tartar'), true);
  assert.equal(stårISitatet(0.3, 'use 1/4 teaspoon baking soda plus 5/8 teaspoon cream of tartar'), false);
  assert.equal(stårISitatet(1.75, 'Or 1 3/4 teaspoons cream of tartar plus 1 cup milk'), true);
  assert.equal(stårISitatet(4, 'Or 1 3/4 teaspoons cream of tartar'), false);
});

test('kildekontrollen blir rød når et sitat ikke står hos kilden, og grønn når det gjør det', () => {
  const tekster = {};
  for (const r of data.rader) {
    for (const t of Object.values(r.tall)) tekster[t.kilde] = `${tekster[t.kilde] ?? ''} ${t.merknad.replaceAll(' ¦ ', ' ')}`;
    for (const v of Object.values(r.tekst ?? {})) { const [k, ...rest] = v.split('::'); tekster[k] = `${tekster[k] ?? ''} ${rest.join('::')}`; }
  }
  assert.deepEqual(avvik(data, tekster), []);
  const endret = structuredClone(tekster);
  endret.unl = endret.unl.replaceAll('1 tablespoon lemon juice or vinegar plus enough regular milk to make 1 cup', '2 tablespoons lemon juice');
  const feil = avvik(data, endret);
  assert.ok(feil.some((f) => f.id === 'buttermilk' && f.felt === 'syre'), JSON.stringify(feil));
  assert.ok(avvik(data, {}).length > 0, 'uten kildetekst er alt avvik');
});

test('samme rad-id som norsk gir hreflang, og en vare uten norsk motstykke står alene', () => {
  const g = (navn) => familieGrupper().find((x) => x.id === navn);
  assert.deepEqual(g('auto-fam-erstatning-egg').sider, { nb: '/erstatning/egg/', da: '/da/erstatning/aeg/', en: '/en/substitutes/eggs/' });
  assert.deepEqual(g('auto-fam-erstatning-brun-farin').sider, { nb: '/erstatning/brun-farin/', en: '/en/substitutes/brown-sugar/' });
  assert.deepEqual(g('auto-fam-erstatning-buttermilk').sider, { en: '/en/substitutes/buttermilk/' });
  assert.deepEqual(g('auto-fam-erstatning-nav').sider, { nb: '/erstatning/', da: '/da/erstatning/', en: '/en/substitutes/' });
});

test('sidene har ingen tankestrek, ingen emoji, ingen norske kilder, ingen allergi- eller helseråd og ingen forfatterlinje', async () => {
  const sider = await familieSider('en', [familie]);
  assert.equal(Object.keys(sider).length, 23);
  for (const [sti, side] of Object.entries(sider)) {
    const t = synligTekst(side);
    assert.doesNotMatch(t, /[—–]/u, `${sti}: tankestrek`);
    assert.doesNotMatch(t, /\p{Extended_Pictographic}/u, `${sti}: emoji`);
    assert.doesNotMatch(t, /Mattilsynet|MatPrat|Idun|melk\.no/u, `${sti}: norsk kilde`);
    // «no allergy or food safety advice» i samlesiden er en erklæring om at vi ikke gir slike råd.
    assert.doesNotMatch(t.replace(/no recipes, and no allergy or food safety advice/giu, ' '), /\b(?:allerg\w*|intoleran\w*|healthy|unhealthy|safe to eat|you should eat)\b/iu, `${sti}: allergi- eller helseråd`);
    assert.doesNotMatch(t, /\b(?:Ingredients|Directions|Instructions|Method)\b/u, `${sti}: ser ut som en oppskrift`);
    assert.ok(!JSON.stringify(side.schemas).includes('"Person"'), `${sti}: engelske sider har ikke Person-forfatter`);
    const kilder = /<ol class="kilder" id="kilder">([\s\S]*?)<\/ol>/u.exec(side.rik)?.[1] ?? '';
    const punkter = [...kilder.matchAll(/<li>([\s\S]*?)<\/li>/gu)].map((m) => m[1]);
    assert.ok(punkter.length > 0, `${sti}: mangler kildeliste`);
    for (const li of punkter) assert.match(li, /<a href="https:\/\/[^"]+" rel="noopener">[^<]+<\/a> \(\d{4}\)\. Accessed [A-Z][a-z]+ \d{1,2}, \d{4}\./u, sti);
  }
  for (const a of SLUGS) assert.doesNotMatch(hoved(`en/substitutes/${a}`), /Patrick Kabia/u, a);
});

test('hver side har pantry- og swap-kort fra appen og lenker til samlesiden, og hver sidetittel og H1 er egen', () => {
  const sett = { title: new Set(), h1: new Set() };
  for (const s of SLUGS) {
    const html = hoved(`en/substitutes/${s}`);
    assert.match(html, /class="i-appen i-pantry"/u, `${s}: pantry-kort`);
    assert.match(html, /class="i-appen i-ask"/u, `${s}: Ask Matlyst-kort`);
    assert.match(html, /href="\/en\/substitutes\/"/u, `${s}: samleside`);
    const v = { title: html.match(/<title>([^<]*)<\/title>/u)[1], h1: html.match(/<h1[^>]*>([^<]*)<\/h1>/u)[1] };
    for (const [k, x] of Object.entries(v)) { assert.ok(!sett[k].has(x), `${s}: lik ${k}`); sett[k].add(x); }
  }
});

test('der kildene er uenige, viser siden begge tallene (self-rising flour, half-and-half, powdered sugar)', () => {
  const sr = tekstAv(hoved('en/substitutes/self-rising-flour'));
  for (const n of ['1 1/4 teaspoons', '1 1/2 teaspoons']) assert.ok(sr.includes(n), `self-rising flour: ${n}`);
  const hh = tekstAv(hoved('en/substitutes/half-and-half'));
  for (const n of ['3 tablespoons', '1 1/2 tablespoons']) assert.ok(hh.includes(n), `half-and-half: ${n}`);
  const ps = tekstAv(hoved('en/substitutes/powdered-sugar'));
  for (const n of ['1 tablespoon', '1 teaspoon']) assert.ok(ps.includes(n), `powdered sugar: ${n}`);
});

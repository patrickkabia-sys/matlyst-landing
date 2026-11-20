// Malen for «dl til gram»: sidene skrives fra datafila, og hvert tall på siden kan regnes ut derfra.
import assert from 'node:assert/strict';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { lesData, publiserbare } from '../scripts/familier/felles.mjs';
import { VIS_TOPPET, kalkHtml, navSide, sideForRad, tillatteTall, utregnet } from '../scripts/familier/dl-til-gram/mal-nb.mjs';
import { TEKST } from '../scripts/familier/dl-til-gram/tekst-nb.mjs';
import { htmlTilTekst, synligTekst, tallUtenforData } from './hjelp/familievakt.mjs';

const MAPPE = fileURLToPath(new URL('../scripts/familier/dl-til-gram/', import.meta.url));
const data = lesData(MAPPE, 'nb');
const rader = publiserbare(data);
const rad = (id) => rader.find((r) => r.id === id);
const alleSider = () => [['nav', navSide(data, rader)], ...rader.map((r) => [r.id, sideForRad(r, data, rader)])];

test('hvetemel: svaret står i ingress, kort svar, tabell og kalkulator, og er det samme tallet', () => {
  const s = sideForRad(rad('hvetemel'), data, rader);
  assert.match(s.lead, /1 dl hvetemel veier 55 g/u);
  assert.match(s.topp, /2 dl hvetemel = 110 g/u);
  assert.match(s.topp, /1 dl siktet hvetemel er 55 g/u);
  assert.match(s.rik, /<td>1 dl<\/td><td>55 g<\/td>/u);
  assert.equal(s.title.length <= 60, true);
  assert.ok(s.description.length >= 100 && s.description.length <= 160, String(s.description.length));
  assert.equal(s.h1, 'Hvetemel: dl til gram');
});

test('utregningene følger tallreglene', () => {
  const u = utregnet({ tall: { dl: { verdi: 55 } } });
  assert.deepEqual(u.tilbake, [[100, '1,8'], [250, '4,5'], [500, '9,1'], [1000, '18,2']]);
  assert.equal(u.ss, 8);
  assert.equal(u.ts, 3);
  assert.equal(utregnet({ tall: { dl: { verdi: 35 } } }).ts, 2);
  assert.deepEqual(u.tabell.map(([e]) => e), ['1 ts', '1 ss', '0,5 dl', '1 dl', '2 dl', '3 dl', '4 dl', '5 dl', '1 liter']);
  assert.deepEqual(u.tabell.map(([, g]) => g), [3, 8, 28, 55, 110, 165, 220, 275, 550]);
  // Aldri under 1 g, også for en vare som veier lite per dl.
  assert.ok(utregnet({ tall: { dl: { verdi: 5 } } }).tabell.every(([, g]) => g >= 1));
});

test('en vare uten sammenligning får ingen tomme avsnitt, og bare rader med USDA-tall får kildesammenligning', () => {
  const uten = rader.find((r) => !r.tall.dl_usda);
  assert.ok(uten, 'datafila har en vare uten USDA-tall');
  const s = sideForRad(uten, data, rader);
  for (const forbudt of ['Kildene side om side', 'USDA', 'toppet', 'undefined', 'NaN', '<h2></h2>', 'null']) assert.equal(s.rik.includes(forbudt), false, forbudt);
  const med = sideForRad(rad('hvetemel'), data, rader);
  assert.match(med.rik, /Kildene side om side/u);
  assert.match(med.rik, /«Wheat flour, white, all-purpose, enriched, unbleached»/u);
});

test('andre poster i Matvaretabellen vises med navn og vekt, og bare når raden har dem', () => {
  const smor = sideForRad(rad('smor'), data, rader).rik;
  assert.match(smor, /<h2>Andre poster i Matvaretabellen<\/h2>/u);
  assert.match(smor, /<td>«Smør, usaltet»<\/td><td>90 g<\/td>/u);
  assert.match(smor, /«Smør, meierismør, ekstra salt, Kviteseidsmør»/u);
  const uten = rader.find((r) => !r.tekst.andrePoster);
  assert.ok(uten, 'datafila har en vare uten andre poster');
  assert.equal(sideForRad(uten, data, rader).rik.includes('Andre poster i Matvaretabellen'), false);
});

test('brunt sukker og melis viser begge USDA-tallene som egne rader', () => {
  const brunt = sideForRad(rad('brunt-sukker'), data, rader).rik;
  assert.match(brunt, /cup unpacked/u);
  assert.match(brunt, /cup packed/u);
  assert.equal((brunt.match(/class="sprik"[\s\S]*?<\/table>/u)[0].match(/<tr/gu) ?? []).length, 1 + 1 + 2, 'topprad, Matvaretabellen og to USDA-rader');
  const melis = sideForRad(rad('melis'), data, rader).rik;
  assert.match(melis, /cup sifted/u);
  assert.match(melis, /cup unsifted/u);
});

test('toppede skjeer står ikke på sidene, og rapporten er ikke blant kildene', () => {
  assert.equal(VIS_TOPPET, false);
  for (const [navn, s] of alleSider()) {
    const tekst = JSON.stringify(s);
    assert.equal(/toppet|Mål, vekt og porsjonsstørrelser|IS-2286/iu.test(tekst), false, navn);
  }
  // Tallene ligger likevel i datafila.
  assert.ok(rad('hvetemel').tall.ss_toppet);
});

test('spiseskje og teskje er merket som utregnet, ikke som målt', () => {
  const s = sideForRad(rad('hvetemel'), data, rader);
  assert.match(s.topp, /strøken spiseskje \(15 ml\) er 8 g/u);
  assert.match(s.topp, /regnet ut fra dl-tallet/u);
  assert.match(s.rik, /regnet ut fra dl-tallet/u);
  const ss = s.faq.find(([q]) => /1 ss/u.test(q));
  assert.ok(ss, 'FAQ om spiseskje');
  assert.match(ss[1], /strøken/u);
  assert.match(ss[1], /regnet ut/u);
});

test('siden svarer uten JavaScript', () => {
  const s = sideForRad(rad('hvetemel'), data, rader);
  assert.match(s.topp, /<output[^>]*>110<\/output>/u);
  assert.match(s.rik, /<table class="otabell">/u);
  assert.match(s.topp, /class="kalksetning"[^>]*>2 dl hvetemel = 110 g</u);
});

test('hvert tall på hver side kan regnes ut fra datafila', () => {
  for (const r of rader) assert.deepEqual(tallUtenforData(sideForRad(r, data, rader), tillatteTall(r, data)), [], r.id);
  const alle = new Set(rader.flatMap((r) => [...tillatteTall(r, data)]));
  assert.deepEqual(tallUtenforData(navSide(data, rader), alle), []);
});

test('tallvakten ser et tall som er endret i malen', () => {
  const r = rad('hvetemel');
  const s = sideForRad(r, data, rader);
  const feil = { ...s, rik: s.rik.replace('<td>1 dl</td><td>55 g</td>', '<td>1 dl</td><td>57 g</td>') };
  assert.deepEqual(tallUtenforData(feil, tillatteTall(r, data)), ['57']);
});

test('samlesiden lister alle varene med lenke, og tittelen har riktig antall', () => {
  const s = navSide(data, rader);
  for (const r of rader) assert.ok(s.rik.includes(`href="/verktoy/dl-til-gram/${r.slug}/"`), r.id);
  assert.ok(s.title.includes(`${rader.length} varer`), s.title);
  assert.equal(s.h1, 'Dl til gram');
  assert.match(s.topp, /<select data-felt="vare">/u);
  assert.match(s.topp, /2 dl hvetemel = 110 g/u);
  assert.ok(s.title.length <= 60 && s.description.length >= 100 && s.description.length <= 160);
});

test('strukturerte data: kalkulator og artikkel med kilder, ingen HowTo og ingen FAQPage', () => {
  const typer = sideForRad(rad('hvetemel'), data, rader).schemas.map((x) => x['@type']);
  assert.deepEqual(typer, ['BreadcrumbList', 'WebApplication', 'Article']);
  assert.deepEqual(navSide(data, rader).schemas.map((x) => x['@type']), ['BreadcrumbList', 'WebApplication', 'Article', 'ItemList']);
  const art = sideForRad(rad('hvetemel'), data, rader).schemas[2];
  assert.deepEqual(art.citation.map((c) => c.name), ['Matvaretabellen 2026', 'FoodData Central, SR Legacy']);
  const utenUsda = sideForRad(rader.find((r) => !r.tall.dl_usda), data, rader).schemas[2];
  assert.deepEqual(utenUsda.citation.map((c) => c.name), ['Matvaretabellen 2026']);
  assert.equal(navSide(data, rader).schemas[3].numberOfItems, rader.length);
});

test('kilder: nummerert liste med utgiver, år, lenke og hentedato, og Matvaretabellens kildelinje', () => {
  const s = sideForRad(rad('hvetemel'), data, rader);
  assert.match(s.rik, /<ol class="kilder" id="kilder">/u);
  assert.match(s.rik, /Matvaretabellen 2026\. Mattilsynet\./u);
  assert.match(s.rik, /Hentet 20\. november 2026/u);
  assert.match(s.topp, /«Hvetemel, siktet»/u);
});

test('alle sider har tittel og beskrivelse innenfor grensene, ingen tankestrek og ingen like titler', () => {
  const titler = new Set();
  for (const [navn, s] of alleSider()) {
    assert.ok(s.title.length <= 60, `${navn}: ${s.title.length} tegn`);
    assert.ok(s.description.length >= 100 && s.description.length <= 160, `${navn}: beskrivelse ${s.description.length}`);
    assert.equal(/[—–]/u.test(synligTekst(s)), false, `${navn}: tankestrek`);
    assert.equal(/undefined|NaN|\[object/u.test(synligTekst(s)), false, `${navn}: ugyldig tekst`);
    assert.equal(titler.has(s.title), false, `${navn}: lik tittel`);
    titler.add(s.title);
    assert.ok(s.faq.length >= 3 && s.faq.length <= 6, `${navn}: ${s.faq.length} spørsmål`);
    assert.ok(s.steg.length > 0, `${navn}: steg mangler (registeret krever det)`);
  }
});

test('hver vare har en variantbetegnelse i tekst-nb, og ingenting for en vare som ikke finnes', () => {
  for (const r of rader) assert.ok(TEKST[r.id]?.variant, r.id);
  assert.deepEqual(Object.keys(TEKST).filter((id) => !rad(id)), []);
});

test('kalkulatorens data: varene står som [ord, gram per dl], og faste varer har bare én', () => {
  const html = kalkHtml({ rader, fast: rad('kakao') });
  const json = JSON.parse(html.match(/<script type="application\/json" class="kalk-data">([\s\S]*?)<\/script>/u)[1]);
  assert.deepEqual(json.varer, [['kakao', 50]]);
  assert.equal(json.feil, 'Skriv inn en mengde, for eksempel 2 eller 2,5.');
  assert.match(html, /<b>Kakao<\/b>/u);
  assert.match(html, /<a href="\/verktoy\/dl-til-gram\/">Bytt vare<\/a>/u);
  const valg = kalkHtml({ rader });
  assert.equal(JSON.parse(valg.match(/class="kalk-data">([\s\S]*?)<\/script>/u)[1]).varer.length, rader.length);
});

test('andre varer: åtte lenker pluss «Alle varer», og aldri varen selv', () => {
  const s = sideForRad(rad('hvetemel'), data, rader);
  const blokk = s.rik.match(/<div class="related">[\s\S]*?<\/div>/u)[0];
  const lenker = [...blokk.matchAll(/href="([^"]+)"/gu)].map((m) => m[1]);
  assert.equal(lenker.length, 9);
  assert.equal(lenker.includes('/verktoy/dl-til-gram/hvetemel/'), false);
  assert.equal(lenker.at(-1), '/verktoy/dl-til-gram/');
  assert.equal(lenker[0], '/verktoy/dl-til-gram/sammalt-hvetemel/', 'nær variant først');
});

test('teksten leses som ren tekst uten rester av markup', () => {
  const tekst = htmlTilTekst(sideForRad(rad('hvetemel'), data, rader).rik, { attributter: false });
  assert.equal(/&[a-z]+;|<|>/u.test(tekst.replace(/[«»]/gu, '')), false);
});

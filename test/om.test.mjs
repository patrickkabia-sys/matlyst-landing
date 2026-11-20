// Om-siden (/om/, bare norsk). BARE disse faktaene om personen er godkjent: Patrick Kabia, kjøletekniker av yrke, har laget Matlyst.
// Siden skal ikke dikte: ingen alder, bosted, familie, utdanning, årstall, sitater eller bilde. Seksjonen «Hvorfor Matlyst ble laget» bruker bare det som står i seksjonen «Hvorfor jeg lagde den» på /oppskriftsbok-app/ (godkjent av Patrick).
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { SIDEGRUPPER, alternativerFor, byggLocalePageMap } from '../scripts/locale-sider.mjs';
import { sidetype } from '../scripts/sidetyper.mjs';
import { ORG_ID, PERSON_ID, side } from '../scripts/nb-om/om.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const STI = '/om/';
const html = readFileSync(join(ROOT, 'om/index.html'), 'utf8');
const hoved = html.match(/<main[\s\S]*?<\/main>/u)?.[0] ?? '';
const utenBevis = (t) => t.replace(/<!-- app-bevis:start -->[\s\S]*?<!-- app-bevis:slutt -->/gu, ' ').replace(/<!-- relatert:start -->[\s\S]*?<!-- relatert:slutt -->/gu, ' ');
const tekst = utenBevis(hoved).replace(/<!--[\s\S]*?-->/gu, ' ').replace(/<script[\s\S]*?<\/script>/gu, ' ').replace(/<\/(?:h[1-6]|p|li|summary)>/gu, ' ¶ ').replace(/<[^>]+>/gu, ' ').replace(/&#?\w+;/gu, ' ').replace(/\s+/gu, ' ');

// Alt som ikke er godkjent som fakta om personen eller historien. Treffer et ord, er siden dikta.
export const DIKTET = /\b(?:født|oppvokst|bosatt|bor i|gift|kone|samboer|barn|familie|utdann\w*|student\w*|lærling|sivilingeniør|fagbrev|grunnla\w*|grunnlegger|startet|startet opp|etablert|historien|bakgrunn|motivasjon|drømmen|lidenskap|hjertet)\b|\bsiden 20\d\d|"[^"]{20,}"/iu;

// De godkjente setningene (fra /oppskriftsbok-app/) fjernes før diktevakten, så resten av siden ikke kan dikte noe nytt.
const GODKJENT = ['Patrick er ikke utdannet kokk. Han er utdannet kjøletekniker.', 'Som lærling kom han inn i noen av de beste restaurantkjøkkenene i hjembyen sin.', 'for helt vanlige familiemiddager'];
const godkjentFjernet = (t) => GODKJENT.reduce((rest, setning) => rest.split(setning).join(' '), t);
const KILDE_TEKST = readFileSync(join(ROOT, 'oppskriftsbok-app/index.html'), 'utf8').replace(/<[^>]+>/gu, ' ').replace(/\s+/gu, ' ');

test('siden er egen sidegruppe med bare norsk, og hreflang har bare nb og x-default', () => {
  const gruppe = SIDEGRUPPER.find(({ sider }) => sider.nb === STI);
  assert.ok(gruppe);
  assert.deepEqual(Object.keys(gruppe.sider), ['nb']);
  assert.deepEqual(alternativerFor(STI), [['nb-NO', STI], ['x-default', STI]]);
  assert.equal(byggLocalePageMap()[STI], undefined);
  assert.match(readFileSync(join(ROOT, 'sitemap.xml'), 'utf8'), /<loc>https:\/\/matlyst-app\.no\/om\/<\/loc>\s*<lastmod>2026-11-20<\/lastmod>/u);
});

test('sidetypen er guide-lang, tittel og beskrivelse har lovlig lengde', () => {
  assert.equal(sidetype(STI, html), 'guide-lang');
  const tittel = html.match(/<title>([^<]*)<\/title>/u)[1];
  const meta = html.match(/<meta name="description" content="([^"]*)">/u)[1];
  assert.ok(tittel.length <= 60, `tittel ${tittel.length}`);
  assert.ok(meta.length >= 100 && meta.length <= 160, `meta ${meta.length}`);
});

test('strukturerte data: AboutPage og Person koblet til Organization på forsiden, uten ekstra personopplysninger', () => {
  const skjema = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gu)].flatMap(([, r]) => [JSON.parse(r)].flat());
  assert.deepEqual(skjema.map((s) => s['@type']), ['BreadcrumbList', 'AboutPage', 'Person']);
  const [, om, person] = skjema;
  assert.equal(person['@id'], PERSON_ID);
  assert.equal(om.mainEntity['@id'], PERSON_ID);
  assert.equal(person.worksFor['@id'], ORG_ID);
  assert.equal(om.about['@id'], ORG_ID);
  // Bare de godkjente feltene: navn og yrke. Ingen fødselsdato, adresse, bilde, sameAs eller lignende.
  assert.deepEqual(Object.keys(person).sort(), ['@context', '@id', '@type', 'jobTitle', 'name', 'url', 'worksFor']);
  assert.equal(person.name, 'Patrick Kabia');
  assert.equal(person.jobTitle, 'Kjøletekniker');
  // Organization finnes på forsiden med samme @id, så koblingen peker på noe.
  const forside = readFileSync(join(ROOT, 'index.html'), 'utf8');
  assert.ok(forside.includes(`"@type":"Organization","@id":"${ORG_ID}"`));
  // Hvilke sider som har forfatter, låses av test/forfatter.test.mjs (registeret scripts/forfatter.mjs).
});

test('siden sier bare det som er godkjent om personen: navn, yrke og at han har laget Matlyst', () => {
  assert.match(tekst, /Matlyst er laget av Patrick Kabia\. Han er kjøletekniker av yrke\./u);
  assert.match(tekst, /Matlyst drives av en privatperson i Norge/u);
  assert.doesNotMatch(godkjentFjernet(tekst), DIKTET);
  assert.doesNotMatch(tekst, /\d/u, 'ingen tall på om-siden: ingen alder, årstall eller antall');
  assert.doesNotMatch(hoved, /<img[^>]*(?:patrick|portrett|foto)/iu);
});

test('diktevakten kan bli rød', () => {
  for (const t of ['Han er født i Bergen.', 'Han bor i Oslo.', 'Patrick er utdannet kokk.', 'Han grunnla Matlyst', 'Historien bak appen', 'Han startet Matlyst siden 2024.']) assert.match(t, DIKTET, t);
  assert.doesNotMatch('Matlyst er laget av Patrick Kabia. Han er kjøletekniker av yrke.', DIKTET);
});

test('siden forklarer yrket nøkternt og sier at tallene kommer fra navngitte kilder', () => {
  assert.match(tekst, /Det betyr ikke at tallene på sidene er hans egne vurderinger/u);
  assert.match(tekst, /Tallene kommer fra navngitte kilder, for eksempel Mattilsynet og MatPrat/u);
  assert.match(tekst, /Hvert tall har en kilde med adresse og datoen vi åpnet og leste kilden/u);
  assert.match(tekst, /Finner vi ikke en kilde, tas tallet ut av siden/u);
  assert.match(tekst, /Vi gir ikke egne tall/u);
  assert.match(tekst, /Ingen egne oppskrifter/u);
  assert.match(tekst, /Matlyst er ikke tilknyttet kildene/u);
  assert.doesNotMatch(tekst, /\b(?:best|ledende|ekspert\w*|autoritet|garantert|100 ?%)\b/iu);
});

test('kontakt og lenker: e-post, personvern, vilkår og siden om julemiddagen', () => {
  assert.ok(hoved.includes('href="mailto:hei@matlyst-app.no"'));
  for (const sti of ['/personvern.html', '/vilkar.html', '/julemiddag/', '/ukemeny/', '/handleliste/', '/spiskammer-app/', '/oppskriftsbok-app/']) assert.ok(hoved.includes(`href="${sti}"`), sti);
  assert.ok(side.faq.length >= 5);
  for (const [q, a] of side.faq) { assert.ok(hoved.includes(`<summary>${q}</summary>`), q); assert.ok(hoved.includes(`<p>${a}</p>`), q); }
});

test('teksten har ingen tankestrek, ingen emoji og ingen helsepåstander', () => {
  assert.doesNotMatch(tekst, /(?<!\d)[–—]|[–—](?!\d)/u);
  assert.doesNotMatch(tekst, /\p{Extended_Pictographic}/u);
  assert.doesNotMatch(tekst, /\b(?:sunn|slank\w*|kalori\w*|diett\w*|allergi\w*|forebygg\w*)\b/iu);
});

test('«Hvorfor Matlyst ble laget» har bare fakta som står i den godkjente seksjonen på /oppskriftsbok-app/', () => {
  const seksjon = hoved.match(/<h2 id="hvorfor-matlyst-ble-laget">[\s\S]*?(?=<h2 )/u)?.[0] ?? '';
  assert.ok(seksjon.length > 200, 'seksjonen finnes');
  for (const fakta of ['ikke utdannet kokk', 'utdannet kjøletekniker', 'kjærlighetsspråket', 'slutte å miste oppskriftene', 'lærling', 'noen av de beste restaurantkjøkkenene i hjembyen', 'fikset kjølerommet før første bestilling kom inn', 'Ingenting er tilfeldig', 'faste plass, merkelapp og dato', 'åtte steder', 'OneNote', 'helt vanlige familiemiddager']) {
    assert.ok(KILDE_TEKST.includes(fakta), `${fakta}: står ikke på /oppskriftsbok-app/`);
  }
  const ord = (x) => x.replace(/<[^>]+>/gu, ' ').toLowerCase().match(/[a-zæøå]{6,}/gu) ?? [];
  // Ingen nye detaljer: hvert langt ord i seksjonen finnes på kilden (bøyd likt) eller er en kjent omskriving.
  const kilde = new Set(ord(KILDE_TEKST));
  const OMSKRIVING = new Set(['patrick', 'hjembyen', 'hjemme', 'oppskriftene', 'lagde', 'derfra', 'nært', 'profesjonelle', 'ingenting', 'tilfeldig', 'merkelapp', 'bygde', 'systemet', 'familiemiddager', 'kokk', 'kjøletekniker', 'bestilling', 'restaurantkjøkkenene']);
  for (const o of new Set(ord(seksjon))) assert.ok(kilde.has(o) || OMSKRIVING.has(o) || kilde.has(o.replace(/ene$|ne$|en$/u, '')), `nytt ord uten dekning i kilden: ${o}`);
});

test('én setning om KI og at tallene har kilde, og ingen flere påstander om KI', () => {
  assert.match(tekst, /Tekstene på nettstedet skrives med hjelp av KI og gjennomgås av Patrick, og tallene har kilde\./u);
  assert.equal([...tekst.matchAll(/\bKI\b/gu)].length, 2, 'KI nevnes i denne setningen og i omtalen av appens oppskriftsimport');
});

test('om-siden har lenke i bunnteksten (hyllen Matlyst) på alle norske sider, men ikke på sv, da og en', () => {
  for (const fil of ['handleliste/index.html', 'blogg/index.html', 'index.html', 'personvern.html', 'julemiddag/index.html', 'om/index.html']) assert.match(readFileSync(join(ROOT, fil), 'utf8'), /<li><a href="\/om\/"><span>Om Matlyst<\/span><\/a><\/li>/u, fil);
  for (const fil of ['sv/index.html', 'da/index.html', 'en/index.html', 'en/shopping-list/index.html', 'sv/inkopslista/index.html']) assert.doesNotMatch(readFileSync(join(ROOT, fil), 'utf8'), /href="\/om\/"/u, fil);
});

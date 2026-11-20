// Strukturerte data for sidefamilier, og guidePage som tar ferdige objekter i `schemas`.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test, { after } from 'node:test';
import { fileURLToPath } from 'node:url';
import { kopier } from '../scripts/kjedeproeve.mjs';
import { artikkel, brodsmuler, elementliste, webApplikasjon } from '../scripts/familier/skjema.mjs';

const ROT = fileURLToPath(new URL('..', import.meta.url));
const KILDER = [
  { navn: 'Prøvetabellen', utgiver: 'Prøveinstituttet', aar: 2024, adresse: 'https://eksempel.test/a', hentet: '2026-11-20' },
  { navn: 'Prøveboka', utgiver: 'Prøveforlaget', aar: 2022, adresse: 'https://eksempel.test/b', hentet: '2026-11-20' },
];

test('hver bygger gir riktig @type og @context', () => {
  const alle = [
    brodsmuler([{ navn: 'Forside', adresse: '/' }, { navn: 'Verktøy', adresse: '/verktoy/' }]),
    webApplikasjon({ navn: 'X', beskrivelse: 'Y', adresse: '/verktoy/x/', sprak: 'nb' }),
    artikkel({ tittel: 'T', beskrivelse: 'B', adresse: '/verktoy/x/', sprak: 'nb', publisert: '2026-11-20', kilder: KILDER }),
    elementliste({ navn: 'L', adresse: '/verktoy/', elementer: [{ navn: 'A', adresse: '/verktoy/a/' }] }),
  ];
  assert.deepEqual(alle.map((o) => o['@type']), ['BreadcrumbList', 'WebApplication', 'Article', 'ItemList']);
  for (const o of alle) {
    assert.equal(o['@context'], 'https://schema.org');
    assert.equal(/HowTo|FAQPage/u.test(JSON.stringify(o)), false);
  }
});

test('brødsmuler og elementliste har posisjon og absolutte adresser', () => {
  const b = brodsmuler([{ navn: 'Forside', adresse: '/' }, { navn: 'Verktøy', adresse: 'https://matlyst-app.no/verktoy/' }]);
  assert.deepEqual(b.itemListElement.map((e) => [e.position, e.item]), [[1, 'https://matlyst-app.no/'], [2, 'https://matlyst-app.no/verktoy/']]);
  const l = elementliste({ navn: 'L', adresse: '/verktoy/', elementer: [{ navn: 'A', adresse: '/verktoy/a/' }, { navn: 'B', adresse: '/verktoy/b/' }] });
  assert.equal(l.numberOfItems, 2);
  assert.deepEqual(l.itemListElement.map((e) => [e.position, e.url]), [[1, 'https://matlyst-app.no/verktoy/a/'], [2, 'https://matlyst-app.no/verktoy/b/']]);
});

test('webApplikasjon er gratis, uten plattformkrav og med valuta etter språk', () => {
  const w = webApplikasjon({ navn: 'X', beskrivelse: 'Y', adresse: '/en/tools/x/', sprak: 'en' });
  assert.equal(w.applicationCategory, 'UtilitiesApplication');
  assert.equal(w.operatingSystem, 'Any');
  assert.equal(w.isAccessibleForFree, true);
  assert.equal(w.offers.price, '0');
  assert.equal(w.offers.priceCurrency, 'USD');
  assert.equal(webApplikasjon({ navn: 'X', beskrivelse: 'Y', adresse: '/x/', sprak: 'nb' }).offers.priceCurrency, 'NOK');
});

test('artikkel med to kilder gir to citation med url og publisher', () => {
  const a = artikkel({ tittel: 'T', beskrivelse: 'B', adresse: '/verktoy/x/', sprak: 'nb', publisert: '2026-11-20', endret: '2026-11-21', kilder: KILDER });
  assert.equal(a.citation.length, 2);
  assert.deepEqual(a.citation.map((c) => [c['@type'], c.url, c.publisher.name, c.datePublished]), [
    ['CreativeWork', 'https://eksempel.test/a', 'Prøveinstituttet', '2024'],
    ['CreativeWork', 'https://eksempel.test/b', 'Prøveforlaget', '2022'],
  ]);
  assert.equal(a.dateModified, '2026-11-21');
  assert.equal(a.author.name, 'Matlyst');
  const person = { '@type': 'Person', name: 'Ola' };
  assert.deepEqual(artikkel({ tittel: 'T', beskrivelse: 'B', adresse: '/x/', sprak: 'nb', publisert: '2026-11-20', kilder: [], forfatter: person }).author, person);
});

// guidePage ligger i et skript som skriver sidene når det importeres. Derfor kjøres den i en isolert kopi, aldri i arbeidskopien.
const kopi = mkdtempSync(join(tmpdir(), 'familie-skjema-'));
after(() => rmSync(kopi, { recursive: true, force: true }));
kopier(ROT, kopi);

function guide(sprak, side) {
  const kode = `const m = await import('./scripts/generer-lokalsider.mjs');
    const { RIKE } = await import('./scripts/rike-sider-register.mjs');
    const side = JSON.parse(process.env.SIDE);
    const base = side.fraRik ? { path: side.fraRik, ...RIKE[process.env.SPRAK][side.fraRik] } : side;
    process.stdout.write(m.guidePage(process.env.SPRAK, { ...base, ...(side.schemas ? { schemas: side.schemas } : {}) }));`;
  return execFileSync(process.execPath, ['--input-type=module', '-e', kode], { cwd: kopi, env: { ...process.env, SIDE: JSON.stringify(side), SPRAK: sprak }, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}
const jsonLd = (html) => JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/u)[1]);
const SIDE = { path: 'mealime-alternative/', title: 'T', description: 'B', publisert: '2026-11-20', h1: 'H', lead: 'L', eyebrow: 'E', forst: 'F', stegTittel: 'S', steg: [['a', 'b']], alternativ: '', grense: '', seksjoner: [], faqTittel: 'Q', faq: [['Q1?', 'A1']], cta: 'C', rik: '<p>x</p>' };

test('guidePage skriver et objekt i schemas ut som det er, etter brødsmulene, uten HowTo', () => {
  const objekt = webApplikasjon({ navn: 'X', beskrivelse: 'Y', adresse: '/en/tools/x/', sprak: 'en' });
  const ld = jsonLd(guide('en', { ...SIDE, schemas: [objekt] }));
  assert.equal(ld.length, 2);
  assert.equal(ld[0]['@type'], 'BreadcrumbList');
  assert.deepEqual(ld[1], objekt);
  assert.equal(JSON.stringify(ld).includes('HowTo'), false);
});

test('navn og objekter kan blandes, i oppgitt rekkefølge', () => {
  const objekt = webApplikasjon({ navn: 'X', beskrivelse: 'Y', adresse: '/en/tools/x/', sprak: 'en' });
  const ld = jsonLd(guide('en', { ...SIDE, schemas: ['faq', objekt] }));
  assert.deepEqual(ld.map((o) => o['@type']), ['BreadcrumbList', 'FAQPage', 'WebApplication']);
});

test('tekstnavnene virker som før: samme JSON-LD som den publiserte mealime-siden', () => {
  const publisert = jsonLd(readFileSync(join(ROT, 'en/mealime-alternative/index.html'), 'utf8'));
  const generert = jsonLd(guide('en', { fraRik: 'mealime-alternative/' }));
  assert.deepEqual(generert.map((o) => o['@type']), publisert.map((o) => o['@type']));
  assert.deepEqual(generert, publisert);
});

test('standardlisten er HowTo og FAQ som før, og et ukjent navn feiler i stedet for å skrive null', () => {
  const { schemas, ...uten } = SIDE;
  assert.deepEqual(jsonLd(guide('en', uten)).map((o) => o['@type']), ['BreadcrumbList', 'HowTo', 'FAQPage']);
  assert.throws(() => guide('en', { ...SIDE, schemas: ['finnes-ikke'] }), /Ukjent skjema/u);
  assert.throws(() => guide('en', { ...SIDE, schemas: [null] }), /Ukjent skjema/u);
  assert.equal(schemas, undefined);
});

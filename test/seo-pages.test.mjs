import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const importerSide = readFileSync(
  new URL('../importer-oppskrifter/index.html', import.meta.url),
  'utf8',
);
const sitemap = readFileSync(new URL('../sitemap.xml', import.meta.url), 'utf8');

test('den norske importsiden bruker ikke tankestrek som skilletegn', () => {
  assert.doesNotMatch(importerSide, /[–—]/u);
});

test('sitemap viser publiseringsdatoen for den oppdaterte importsiden', () => {
  assert.match(
    sitemap,
    /<loc>https:\/\/matlyst-app\.no\/importer-oppskrifter\/<\/loc>\s*<lastmod>2026-10-27<\/lastmod>/u,
  );
});

test('den norske importsiden består grunnleggende HTML-kvalitetsregler', () => {
  assert.match(importerSide, /^<!DOCTYPE html>/u);
  assert.doesNotMatch(importerSide, /\sstyle=/u);
});

test('importsiden beskriver titteloversettelsen slik appen faktisk gjør', () => {
  const forventet = 'Titler på norsk og engelsk beholdes. Titler på andre språk oversettes til norsk bokmål.';
  assert.ok((importerSide.match(new RegExp(forventet, 'gu'))?.length ?? 0) >= 1);
  assert.doesNotMatch(importerSide, /Tittelen beholdes på originalspråket/u);
});

test('importsiden opplyser at bildeimport krever Pro', () => {
  assert.match(importerSide, /<strong>Bilde:<\/strong>[^<]*Bildeimport krever Matlyst Pro/u);
  assert.match(importerSide, /Du får 5 importer fra lenker i måneden gratis/u);
  assert.match(importerSide, /<meta name="description" content="[^"]*Bildeimport krever Pro\./u);
  assert.match(importerSide, /(?:og|twitter):description" content="[^"]*Bildeimport krever Pro\./u);
});

test('skip-lenken peker på et hovedlandemerke som omslutter sideinnholdet', () => {
  assert.match(importerSide, /<main id="hovedinnhold">\s*<header class="locale-page-hero">/u);
  assert.match(importerSide, /<section class="page-cta">[\s\S]*<\/section><\/main>\s*<footer>/u);
});

test('delingsbildet har alternativtekst i Open Graph og Twitter', () => {
  const alt = importerSide.match(/<meta property="og:image:alt" content="([^"]+)">/u)?.[1];
  assert.ok(alt);
  assert.match(importerSide, new RegExp(`<meta property="og:image:alt" content="${alt}">`, 'u'));
  assert.match(importerSide, new RegExp(`<meta name="twitter:image:alt" content="${alt}">`, 'u'));
});

test('Pro-løftet beskriver kvotefordelen uten å love et grenseløst system', () => {
  assert.doesNotMatch(importerSide, /ubegrenset import/iu);
  assert.equal(
    importerSide.match(/Pro fjerner grensen på fem lenkeimporter/gu)?.length,
    2,
  );
});

test('enhetsløftet tar høyde for brukerens valgte innstilling', () => {
  assert.doesNotMatch(importerSide, /regnes alltid om til metris/iu);
  assert.doesNotMatch(importerSide, /gjør målene metriske/iu);
  assert.ok((importerSide.match(/Metriske mål er standard, og du kan velge amerikanske mål i innstillingene\./gu)?.length ?? 0) >= 1);
});

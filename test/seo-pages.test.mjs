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
    /<loc>https:\/\/matlyst-app\.no\/importer-oppskrifter\/<\/loc>\s*<lastmod>2026-09-15<\/lastmod>/u,
  );
});

test('den norske importsiden består grunnleggende HTML-kvalitetsregler', () => {
  assert.match(importerSide, /^<!DOCTYPE html>/u);
  assert.doesNotMatch(importerSide, /\sstyle=/u);
});

test('importsiden beskriver titteloversettelsen slik appen faktisk gjør', () => {
  const forventet = 'Titler på norsk og engelsk beholdes. Titler på andre språk oversettes til norsk bokmål.';
  assert.equal(importerSide.match(new RegExp(forventet, 'gu'))?.length, 3);
  assert.doesNotMatch(importerSide, /Tittelen beholdes på originalspråket/u);
});

test('importsiden opplyser at bildeimport krever Pro', () => {
  assert.match(importerSide, /Fra et bilde:<\/strong>[^<]*Bildeimport krever Matlyst Pro/u);
  assert.match(importerSide, /Du får 5 importer fra lenker i måneden gratis/u);
  assert.match(importerSide, /<meta name="description" content="[^"]*Bildeimport krever Pro\./u);
  assert.doesNotMatch(importerSide, /(?:og|twitter):description" content="[^"]*et bilde/u);
});

test('skip-lenken peker på et hovedlandemerke som omslutter sideinnholdet', () => {
  assert.match(importerSide, /<main id="hovedinnhold">\s*<header class="hero">/u);
  assert.match(importerSide, /<\/section>\s*<\/main>\s*<footer>/u);
});

test('delingsbildet har alternativtekst i Open Graph og Twitter', () => {
  const alt = 'Matlyst viser hvordan du deler en oppskrift fra Instagram til appen';
  assert.match(importerSide, new RegExp(`<meta property="og:image:alt" content="${alt}">`, 'u'));
  assert.match(importerSide, new RegExp(`<meta name="twitter:image:alt" content="${alt}">`, 'u'));
});

import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const expectedFiles = [
  '_previews/da/index.html',
  '_previews/da/importer-opskrifter/index.html',
  '_previews/sv/index.html',
  '_previews/sv/importera-recept/index.html',
  '_config.yml',
  'locale-readiness.json',
];

const read = (path) => {
  const url = new URL(path, root);
  return existsSync(url) ? readFileSync(url, 'utf8') : '';
};

const pages = {
  daHome: read('_previews/da/index.html'),
  daImport: read('_previews/da/importer-opskrifter/index.html'),
  svHome: read('_previews/sv/index.html'),
  svImport: read('_previews/sv/importera-recept/index.html'),
};

const requiredBlockers = [
  'physical_address',
  'norwegian_legal_source_current',
  'localized_legal_pages',
  'language_routed_app_legal_links',
  'apple_store_listing',
  'google_play_listing',
  'recipe_translation_verification',
  'consent_banner',
  'self_hosted_fonts',
  'wcag_aa',
];

test('den danske og svenske forhåndsvisningen har alle avtalte filer', () => {
  for (const path of expectedFiles) {
    assert.equal(existsSync(new URL(path, root)), true, `${path} mangler`);
  }
});

test('alle landssidene er eksplisitt sperret fra søk og publisering', () => {
  for (const [name, html] of Object.entries(pages)) {
    assert.match(html, /<meta name="robots" content="noindex, nofollow">/u, name);
    assert.match(html, /data-launch-state="preview"/u, name);
    assert.doesNotMatch(html, /apps\.apple\.com|play\.google\.com/u, name);
    assert.doesNotMatch(html, /\b(?:NOK|SEK|DKK|kr\.?\s*\d|\d+\s*kr\.?)/iu, name);
  }

  assert.equal(existsSync(new URL('da/index.html', root)), false);
  assert.equal(existsSync(new URL('sv/index.html', root)), false);
  assert.match(read('_config.yml'), /^exclude:\s*\n\s+- _previews\s*$/u);
});

test('språk, nettadresser og delingsmetadata er riktige for hvert marked', () => {
  const cases = [
    [pages.daHome, 'da', 'da_DK', 'https://matlyst-app.no/da/'],
    [pages.daImport, 'da', 'da_DK', 'https://matlyst-app.no/da/importer-opskrifter/'],
    [pages.svHome, 'sv', 'sv_SE', 'https://matlyst-app.no/sv/'],
    [pages.svImport, 'sv', 'sv_SE', 'https://matlyst-app.no/sv/importera-recept/'],
  ];

  for (const [html, language, locale, canonical] of cases) {
    assert.match(html, new RegExp(`<html lang="${language}">`, 'u'));
    assert.match(html, new RegExp(`<meta property="og:locale" content="${locale}">`, 'u'));
    assert.match(html, new RegExp(`<link rel="canonical" href="${canonical}">`, 'u'));
    assert.match(html, /<meta property="og:image:alt" content="[^"]+">/u);
    assert.match(html, /<meta name="twitter:image:alt" content="[^"]+">/u);
  }
});

test('landssidene har samme innholdsstruktur slik at kontekst ikke faller bort', () => {
  const sections = (html) => [...html.matchAll(/data-section="([^"]+)"/gu)].map((match) => match[1]);
  const expected = [
    'hero',
    'import',
    'collections',
    'weekly-menu',
    'shopping-list',
    'cooking-mode',
    'household',
    'privacy',
    'launch-status',
  ];

  assert.deepEqual(sections(pages.daHome), expected);
  assert.deepEqual(sections(pages.svHome), expected);
});

test('importsidenes kontekst og begrensninger er parallelle', () => {
  const sections = (html) => [...html.matchAll(/data-section="([^"]+)"/gu)].map((match) => match[1]);
  const expected = ['hero', 'how-it-works', 'sources', 'limits', 'next-step', 'launch-status'];

  assert.deepEqual(sections(pages.daImport), expected);
  assert.deepEqual(sections(pages.svImport), expected);
});

test('tekstene lover ikke oppskriftsoversettelse før funksjonen er verifisert', () => {
  for (const [name, html] of Object.entries(pages)) {
    assert.doesNotMatch(html, /overs(?:æ|a)tt(?:er|es)[^<.]*til dansk|översätt(?:er|s)[^<.]*till svenska/iu, name);
    assert.doesNotMatch(html, /alle opskrifter[^<.]*dansk|alla recept[^<.]*svenska/iu, name);
  }
});

test('Pro-kontekst følger funksjonene den begrenser', () => {
  assert.match(pages.daHome, /Matlyst Pro kræves for at oprette eller blive medlem af en husstand\./u);
  assert.match(pages.svHome, /Fotoimport kräver Matlyst Pro\./u);
  assert.match(pages.svHome, /Matlyst Pro krävs för att skapa eller gå med i ett hushåll\./u);
  assert.match(pages.svImport, /Fotoimport kräver Matlyst Pro\./u);
});

test('nettsiden bruker de samme Fokus-termene som appen', () => {
  assert.match(pages.daHome, /Fokustilstand/u);
  assert.match(pages.svHome, /Fokusläge/u);
  assert.doesNotMatch(pages.daHome, /Madlavningstilstand/u);
  assert.doesNotMatch(pages.svHome, /Matlagningsläge/u);
});

test('forhåndsvisningene bruker ingen tredjepartsfont eller sporingsskript', () => {
  for (const [name, html] of Object.entries(pages)) {
    assert.doesNotMatch(html, /fonts\.googleapis\.com|fonts\.gstatic\.com|site\.js|posthog|googletagmanager/iu, name);
  }
});

test('HTML-en følger grunnreglene og bruker ikke tankestrek som skilletegn', () => {
  for (const [name, html] of Object.entries(pages)) {
    assert.match(html, /^<!DOCTYPE html>/u, name);
    assert.doesNotMatch(html, /\sstyle=/u, name);
    assert.doesNotMatch(html, /[–—]/u, name);
    assert.match(html, /<main id="hovedinnhold">[\s\S]*<\/main>/u, name);
  }
});

test('readiness-filen holder begge markeder stengt til alle harde blokker er løst', () => {
  const raw = read('locale-readiness.json');
  const readiness = raw ? JSON.parse(raw) : {};

  for (const language of ['da', 'sv']) {
    assert.equal(readiness[language]?.public, false, language);
    assert.deepEqual(readiness[language]?.blockers, requiredBlockers, language);
  }
});

test('forhåndsvisningene er ikke lenket fra den offentlige siden eller sitemap', () => {
  assert.doesNotMatch(read('index.html'), /href="\/(?:da|sv)\//u);
  assert.doesNotMatch(read('sitemap.xml'), /matlyst-app\.no\/(?:da|sv)\//u);
});

test('delingslenker og små tekster har egne lesbare stiler', () => {
  const styles = read('styles.css');

  assert.match(styles, /--ink-faint:rgba\(30,24,19,\.62\)/u);
  assert.match(styles, /--accent-text:#B34824/u);
  assert.match(styles, /\.more\{[^}]*text-decoration:none/u);
});

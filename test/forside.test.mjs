import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { forside, kjor } from '../scripts/forside.mjs';
import { TEKST } from '../scripts/forside-tekst.mjs';
const rot = fileURLToPath(new URL('..', import.meta.url));
const les = (fil) => readFileSync(join(rot, fil), 'utf8');
const html = les('index.html');

test('index.html er nøyaktig det generatoren lager', () => {
  assert.equal(html, forside('nb'));
});

test('hodet er urørt: tittel, beskrivelse, hreflang og skjema', () => {
  assert.match(html, /<title>Matlyst: oppskriftsappen for iPhone og Android<\/title>/);
  assert.match(html, /<meta name="description" content="Oppskriftsappen som oversetter og tilpasser oppskriftene dine\. /);
  for (const [kode, href] of [['nb-NO', '/'], ['sv-SE', '/sv/'], ['da-DK', '/da/'], ['en', '/en/'], ['x-default', '/en/']]) assert.match(html, new RegExp(`<link rel="alternate" hreflang="${kode}" href="https://matlyst-app\\.no${href}">`));
  assert.match(html, /"ratingValue": "5\.0", "ratingCount": "12"/);
  assert.match(html, /"@type":\s*"Organization"/);
  assert.match(html, /<meta name="theme-color" content="#FFFFFF">/);
});

test('siden laster de nye stilarkene og ikke det gamle', () => {
  for (const fil of ['/tokens.css', '/skall.css', '/forside.css', '/language-switcher.css']) assert.match(html, new RegExp(`<link rel="stylesheet" href="${fil}">`));
  assert.doesNotMatch(html, /href="\/styles\.css"/);
  for (const fil of ['/locale.js', '/language-switcher.js', '/site.js', '/skall.js', '/forside.js']) assert.match(html, new RegExp(`<script src="${fil}" defer></script>`));
});

test('toppen: én H1, ingress, knapp, stjerner og seks steg', () => {
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.match(html, /<h1[^>]*>Oppskrifter du faktisk lager\.<\/h1>/);
  assert.match(html, /<p class="lead">Fra en Reel, en nettside eller et bilde av bestemors kort\. Matlyst gjør dem om til ingredienser og steg\.<\/p>/);
  assert.deepEqual([...html.matchAll(/class="st" data-t="([\d.]+)"/g)].map((m) => +m[1]), [0, 2.5, 6.0, 9.7, 13.3, 16.5]);
  assert.match(html, /5,0<\/b> av 5 i App Store/);
});

test('filmen har plakat, faste mål og ingen kontroller', () => {
  const film = html.match(/<div class="film"[\s\S]*?<\/div>/)[0];
  assert.match(film, /<video[^>]*poster="\/images\/forside\/film\/import-nb-plakat\.webp"[^>]*muted[^>]*playsinline[^>]*loop/);
  assert.doesNotMatch(film, /<button|controls/);
});

test('ingenting på siden kan stoppes', () => {
  assert.doesNotMatch(html, /class="[^"]*\b(pause|spillav|filmknapp)\b/);
  assert.doesNotMatch(html, />\s*(Pause|Spill av|Stopp)\s*</);
});

test('nøyaktig to språkvelgere, og aria-current="page" bare der', () => {
  assert.equal((html.match(/class="language-switcher(?: [^"]*)?"/g) ?? []).length, 2);
  assert.equal((html.match(/aria-current="page"/g) ?? []).length, 2);
});

test('uten JavaScript står overskriften synlig', () => {
  const css = les('forside.css');
  assert.doesNotMatch(css, /^\.hero h1\s*\{[^}]*(visibility:\s*hidden|opacity:\s*0)/m, 'bare .js-varianten kan skjule den');
});

test('nedlastingsdelen finnes og har ingen e-postfelt', () => {
  assert.match(html, /<section class="bunn" id="last-ned"/);
  assert.doesNotMatch(html, /<form\b|type="email"/);
});

test('følgemenyen har fem lenker, og hver peker på en del som finnes', () => {
  const meny = html.match(/<nav class="folg"[\s\S]*?<\/nav>/)[0];
  const lenker = [...meny.matchAll(/<a href="#([\w-]+)">([^<]+)<\/a>/g)].map(([, id, tekst]) => [id, tekst]);
  assert.deepEqual(lenker.map((l) => l[1]), ['Lagre', 'Spør Matlyst', 'Lag maten', 'Pris', 'Spørsmål']);
  assert.deepEqual(lenker.map((l) => l[0]), ['lagre', 'spor', 'middag', 'pris', 'svar']);
  assert.match(html, /id="lagre"/);
});

test('kildene på båndet er de godkjente, og lista står fire ganger', () => {
  const lister = [...html.match(/<div class="band"[\s\S]*?<\/div>\s*<\/div>/)[0].matchAll(/<ul[^>]*>([\s\S]*?)<\/ul>/g)];
  assert.equal(lister.length, 4);
  assert.deepEqual([...lister[0][1].matchAll(/<span>([^<]+)<\/span>/g)].map((m) => m[1]), TEKST.nb.kilder.map((k) => k.navn));
  assert.equal(lister.filter((l) => /^<ul[^>]*aria-hidden="true"/.test(l[0])).length, 3);
});

test('ukjent språk gir en tydelig feil', () => {
  assert.throws(() => forside('sv'), /Mangler.*sv/);
});

test('manglende tekst kaster med nøkkelstien, også i lister', () => {
  for (const [objekt, nokkel, sti] of [[TEKST.nb, 'h1', 'nb.h1'], [TEKST.nb.kilder[0], 'navn', 'nb.kilder.0.navn'], [TEKST.nb.folg.lenker[0], 'tekst', 'nb.folg.lenker.0.tekst']]) {
    const gammel = objekt[nokkel];
    try {
      delete objekt[nokkel];
      assert.throws(() => forside('nb'), (feil) => feil.message.includes(sti));
    } finally { objekt[nokkel] = gammel; }
  }
});

test('tom vurdering fjerner hele linja med stjernene', () => {
  const gammel = TEKST.nb.vurdering;
  try {
    TEKST.nb.vurdering = '';
    assert.doesNotMatch(forside('nb'), /class="bevis"|class="stjerner"/);
  } finally { TEKST.nb.vurdering = gammel; }
  assert.match(forside('nb'), /class="bevis"/);
  assert.match(forside('nb'), /class="stjerner"/);
});

test('generatoren bruker tekstkilden og skjermer HTML-tegn', () => {
  const gammel = TEKST.nb.ingress;
  try {
    TEKST.nb.ingress = 'Prøve <tekst> & "tegn"';
    assert.ok(forside('nb').includes('Prøve &lt;tekst&gt; &amp; &quot;tegn&quot;'));
  } finally { TEKST.nb.ingress = gammel; }
});

test('nedlastingsknappene og sideskallet står i avtalt rekkefølge', () => {
  assert.deepEqual([...html.matchAll(/data-hent="([^"]+)"/g)].map((m) => m[1]), ['topp', 'helt', 'bunn', 'fast']);
  assert.match(html, /<a class="knapp" href="\/app" data-hent="helt">/);
  assert.match(html, /<body data-app-uttrykk="1">/);
  assert.match(html, /<main id="hovedinnhold">/);
  assert.match(html, /rel="apple-touch-icon"/);
  assert.doesNotMatch(html, /id="dl-bar"|class="hero-stage"|Relaterte guider/);
});

test('filmen lastes direkte med metadata og faste mål', () => {
  const video = html.match(/<video\b[^>]*>/)[0];
  assert.match(video, /src="\/images\/forside\/film\/import-nb.mp4"/);
  assert.match(video, /preload="metadata"/);
  assert.match(video, /width="628" height="1300"/);
});

test('kjor skriver samme dokument i valgt rot og tåler mellomrom i stien', () => {
  const mappe = mkdtempSync(join(tmpdir(), 'matlyst forside '));
  try {
    kjor(mappe);
    assert.equal(readFileSync(join(mappe, 'index.html'), 'utf8'), forside('nb'));
  } finally { rmSync(mappe, { recursive: true, force: true }); }
});

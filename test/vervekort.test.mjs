// Statiske vakter for vervekortet (/v/, /sv/v/, /da/v/, /en/v/).
// Oppførselen i nettleseren (videresending, koden, referrer) vokter
// test/playwright/vervekort.spec.mjs.
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

import { side } from '../scripts/vervekort/generer.mjs';
import { BASE, SPRAK, TEKSTER, bildeSti, bildeUrl } from '../scripts/vervekort/tekster.mjs';

const ROT = new URL('..', import.meta.url).pathname;
const fil = (lang) => join(ROT, TEKSTER[lang].sti.slice(1), 'index.html');
const les = (lang) => readFileSync(fil(lang), 'utf8');

// Leser én meta-tagg. Kaster hvis den mangler eller står flere ganger, så en
// manglende tagg aldri blir «undefined === undefined».
function meta(html, navn) {
  const treff = [...html.matchAll(/<meta\s+(?:property|name)="([^"]+)"\s+content="([^"]*)">/gu)]
    .filter(([, n]) => n === navn);
  assert.equal(treff.length, 1, `${navn} skal stå nøyaktig én gang, fant ${treff.length}`);
  return treff[0][2];
}

const avEsc = (s) => s.replaceAll('&quot;', '"').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&');

for (const lang of SPRAK) {
  test(`vervekort ${lang}: OG- og Twitter-taggene er riktige og bildet er absolutt https`, () => {
    const html = les(lang);
    const t = TEKSTER[lang];
    assert.match(html, new RegExp(`^<!DOCTYPE html>\\n<html lang="${t.htmlLang}">`, 'u'));
    assert.equal(avEsc(meta(html, 'og:title')), t.tittel);
    assert.equal(avEsc(meta(html, 'og:description')), t.beskrivelse);
    assert.equal(meta(html, 'og:type'), 'website');
    assert.equal(meta(html, 'og:url'), `${BASE}${t.sti}`);
    assert.doesNotMatch(meta(html, 'og:url'), /[?#]/u, 'og:url skal være uten spørrestreng');
    const bilde = meta(html, 'og:image');
    assert.equal(bilde, bildeUrl(lang));
    assert.match(bilde, /^https:\/\/matlyst-app\.no\/images\/v\/vervekort-(?:nb|sv|da|en)\.png$/u);
    assert.equal(meta(html, 'og:image:width'), '1200');
    assert.equal(meta(html, 'og:image:height'), '630');
    assert.ok(avEsc(meta(html, 'og:image:alt')).length > 20, 'og:image:alt mangler innhold');
    assert.equal(meta(html, 'twitter:card'), 'summary_large_image');
    assert.equal(meta(html, 'twitter:image'), bilde);
    assert.equal(avEsc(meta(html, 'twitter:title')), t.tittel);
  });

  test(`vervekort ${lang}: noindex, CSP 'self', ingen tredjepart og ingen innebygd kode`, () => {
    const html = les(lang);
    assert.equal(meta(html, 'robots'), 'noindex');
    assert.equal(meta(html, 'referrer'), 'no-referrer');
    // Butikklenkene sender verken Referer eller adressen med koden videre.
    const butikk = [...html.matchAll(/<a [^>]*href="https:\/\/(?:apps\.apple\.com|play\.google\.com)[^"]*"[^>]*>/gu)].map(([a]) => a);
    assert.equal(butikk.length, 2, 'to butikklenker');
    for (const a of butikk) assert.match(a, /\srel="noreferrer noopener"/u, a);
    const csp = html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)">/u)?.[1];
    assert.match(csp ?? '', /^default-src 'none'; script-src 'self';/u, 'CSP mangler');
    assert.doesNotMatch(csp, /unsafe|https?:|\*/u, 'CSP slipper inn noe utenfra');
    // Bare ett skript, eget, og ingen innebygde skript som kunne lest spørrestrengen.
    const skript = [...html.matchAll(/<script\b[^>]*>/gu)].map(([s]) => s);
    assert.deepEqual(skript, ['<script src="/v/vervekort.js" defer>']);
    assert.doesNotMatch(html, /\sstyle=|\son[a-z]+=/u);
    // Ingen forhåndshenting av butikkene og ingen eksterne ressurser.
    assert.doesNotMatch(html, /rel="(?:preconnect|dns-prefetch|prefetch|preload|prerender|modulepreload)"/u);
    assert.doesNotMatch(html, /http-equiv="refresh"|speculationrules/u);
    for (const [, url] of html.matchAll(/\s(?:src|href)="([^"]+)"/gu)) {
      if (url.startsWith('/')) continue;
      assert.match(url, /^https:\/\/(?:apps\.apple\.com|play\.google\.com)\//u, `ekstern ressurs: ${url}`);
    }
  });

  test(`vervekort ${lang}: HTML-kilden har ingen kode og ingen spørrestreng`, () => {
    const html = les(lang);
    // Ingen ?k= eller referrer i kilden. Referrer settes bare av skriptet ved gyldig kode.
    assert.doesNotMatch(html, /[?&]k=|referrer=|matlyst_kode/u);
    // Ingen sekstegnskode utenfor fargeverdier (#F7F3EC er en farge, ikke en kode).
    assert.deepEqual(html.match(/(?<![#\w])[A-F0-9]{6}(?!\w)/gu), null);
  });

  test(`vervekort ${lang}: fila er det generatoren lager (ingen håndretting)`, () => {
    assert.equal(les(lang), side(lang));
  });

  test(`vervekort ${lang}: OG-bildet finnes, er PNG 1200 × 630 og under 300 kB`, () => {
    const sti = join(ROT, bildeSti(lang).slice(1));
    assert.ok(existsSync(sti), sti);
    const buf = readFileSync(sti);
    assert.equal(buf.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', 'ikke en PNG');
    assert.equal(buf.subarray(12, 16).toString('ascii'), 'IHDR');
    assert.equal(buf.readUInt32BE(16), 1200, 'bredde');
    assert.equal(buf.readUInt32BE(20), 630, 'høyde');
    assert.ok(statSync(sti).size < 300 * 1024, `${statSync(sti).size} byte`);
  });
}

test('vervekortet står ikke i noe sitemap, og robots.txt stenger det ikke for forhåndsviserne', () => {
  const sitemaper = readdirSync(ROT).filter((f) => /^sitemap.*\.xml$/u.test(f));
  assert.ok(sitemaper.length >= 4, sitemaper.join(', '));
  for (const f of sitemaper) {
    assert.doesNotMatch(readFileSync(join(ROT, f), 'utf8'), /matlyst-app\.no\/(?:(?:sv|da|en)\/)?v\//u, f);
  }
  // Disallow ville stoppet Twitterbot og facebookexternalhit, og da blir det ikke noe kort.
  assert.doesNotMatch(readFileSync(join(ROT, 'robots.txt'), 'utf8'), /Disallow:\s*\/(?:(?:sv|da|en)\/)?v\b/u);
});

test('vervekorttekstene har ingen tankestrek og ingen ferdig delingstekst', () => {
  for (const lang of SPRAK) {
    for (const [nokkel, verdi] of Object.entries(TEKSTER[lang])) {
      assert.doesNotMatch(verdi, /[–—]/u, `${lang}.${nokkel}`);
    }
    // Kortet beskriver hvor lenka går. Det taler ikke i første person på vegne av den som deler.
    const kort = `${TEKSTER[lang].tittel} ${TEKSTER[lang].beskrivelse}`;
    assert.doesNotMatch(kort, /\b(?:jeg|meg|min|jag|mig|mitt|I|I'm|I’m|my)\b/u, lang);
  }
});

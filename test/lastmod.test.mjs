import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITEMAPER, avtrykk, byggIndeks, filForUrl, kjorLastmod, nyOppforing } from '../scripts/lastmod.mjs';

const rot = fileURLToPath(new URL('..', import.meta.url));

const side = (tittel, innhold, ramme = 'meny') => `<!doctype html><html><head><title>${tittel}</title><meta name="description" content="b"><link rel="canonical" href="https://matlyst-app.no/a/"></head><body><nav>${ramme}</nav><main><p>${innhold}</p></main><footer>${ramme}</footer></body></html>`;

function lagRot(html) {
  const m = mkdtempSync(join(tmpdir(), 'lastmod-'));
  mkdirSync(join(m, 'a'));
  mkdirSync(join(m, 'scripts'));
  writeFileSync(join(m, 'a/index.html'), html);
  const xml = '<?xml version="1.0"?>\n<urlset>\n  <url>\n    <loc>https://matlyst-app.no/a/</loc>\n    <lastmod>2000-01-01</lastmod>\n  </url>\n</urlset>\n';
  for (const f of SITEMAPER) writeFileSync(join(m, f), xml);
  return m;
}

test('avtrykket ser bort fra rammen, men ikke fra innhold, tittel eller beskrivelse', () => {
  assert.equal(avtrykk(side('T', 'x', 'meny')), avtrykk(side('T', 'x', 'helt annen meny')));
  assert.notEqual(avtrykk(side('T', 'x')), avtrykk(side('T', 'y')));
  assert.notEqual(avtrykk(side('T', 'x')), avtrykk(side('U', 'x')));
  assert.notEqual(avtrykk(side('T', 'x')), avtrykk(side('T', 'x').replace('content="b"', 'content="c"')));
});

test('adresse til fil', () => {
  assert.equal(filForUrl('https://matlyst-app.no/'), 'index.html');
  assert.equal(filForUrl('https://matlyst-app.no/a/b/'), 'a/b/index.html');
  assert.equal(filForUrl('https://matlyst-app.no/personvern.html'), 'personvern.html');
});

test('uendret innhold beholder datoen, endret innhold får ny dato', () => {
  const m = lagRot(side('T', 'x'));
  try {
    kjorLastmod(m, '2026-01-01');
    const foer = readFileSync(join(m, 'sitemap.xml'), 'utf8');
    assert.ok(foer.includes('<lastmod>2026-01-01</lastmod>'));
    kjorLastmod(m, '2026-06-06');
    assert.equal(readFileSync(join(m, 'sitemap.xml'), 'utf8'), foer, 'to bygg uten endring skal gi identisk sidekart');
    writeFileSync(join(m, 'a/index.html'), side('T', 'x', 'ny ramme'));
    kjorLastmod(m, '2026-07-07');
    assert.equal(readFileSync(join(m, 'sitemap.xml'), 'utf8'), foer, 'rammeendring skal ikke flytte datoen');
    writeFileSync(join(m, 'a/index.html'), side('T', 'endret'));
    kjorLastmod(m, '2026-08-08');
    assert.ok(readFileSync(join(m, 'sitemap.xml'), 'utf8').includes('<lastmod>2026-08-08</lastmod>'));
  } finally {
    rmSync(m, { recursive: true, force: true });
  }
});

test('nyOppforing', () => {
  assert.deepEqual(nyOppforing({ hash: 'a', dato: 'D1' }, 'a', 'D2'), { hash: 'a', dato: 'D1' });
  assert.deepEqual(nyOppforing({ hash: 'a', dato: 'D1' }, 'b', 'D2'), { hash: 'b', dato: 'D2' });
  assert.deepEqual(nyOppforing(undefined, 'b', 'D2'), { hash: 'b', dato: 'D2' });
});

test('de publiserte sidekartene: lastmod følger kartet, og kartet følger sidene', () => {
  const kart = JSON.parse(readFileSync(join(rot, 'scripts/lastmod-kart.json'), 'utf8'));
  let antall = 0;
  for (const navn of SITEMAPER) {
    const xml = readFileSync(join(rot, navn), 'utf8');
    for (const [, url, dato] of xml.matchAll(/<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/gu)) {
      antall++;
      assert.match(dato, /^\d{4}-\d{2}-\d{2}$/u, url);
      assert.ok(kart[url], `mangler i kartet: ${url}`);
      assert.equal(kart[url].dato, dato, url);
      assert.equal(kart[url].hash, avtrykk(readFileSync(join(rot, filForUrl(url)), 'utf8')), `innholdet er endret uten ny lastmod: ${url}`);
    }
  }
  assert.ok(antall > 800);
});

test('sidekartindeksen peker på de fire sidekartene med deres nyeste lastmod, og de fire beholder adressene', () => {
  const idx = readFileSync(join(rot, 'sitemap-index.xml'), 'utf8');
  assert.match(idx, /<sitemapindex xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/u);
  const poster = [...idx.matchAll(/<sitemap>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>\s*<\/sitemap>/gu)];
  assert.deepEqual(poster.map((p) => p[1]), SITEMAPER.map((n) => `https://matlyst-app.no/${n}`));
  for (const [, url, dato] of poster) {
    const xml = readFileSync(join(rot, new URL(url).pathname.slice(1)), 'utf8');
    assert.ok(xml.includes('<urlset'), `${url} skal fortsatt være et vanlig sidekart`);
    assert.equal(dato, [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/gu)].map((m) => m[1]).sort().at(-1));
  }
  assert.ok(readFileSync(join(rot, 'robots.txt'), 'utf8').includes('Sitemap: https://matlyst-app.no/sitemap-index.xml\n'));
  assert.equal(byggIndeks({ 'a.xml': '<lastmod>2026-01-02</lastmod><lastmod>2026-03-04</lastmod>' }).includes('<lastmod>2026-03-04</lastmod>'), true);
});

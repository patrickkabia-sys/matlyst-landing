import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = dirname(fileURLToPath(import.meta.url)) + '/..';

function finnHtml(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? finnHtml(path) : entry.name === 'index.html' ? [path] : [];
  });
}

const filer = ['sv', 'da'].flatMap((lang) => finnHtml(join(root, lang)));
const les = (fil) => readFileSync(fil, 'utf8');
const urlTilFil = (href) => {
  const path = new URL(href).pathname;
  if (path === '/') return join(root, 'index.html');
  if (path.endsWith('/')) return join(root, path, 'index.html');
  return join(root, path);
};
const regexEsc = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test('alle lokale sider har språk, canonical, hreflang og gyldig strukturert data', () => {
  assert.equal(filer.length, 48);
  for (const fil of filer) {
    const html = les(fil);
    const rel = relative(root, fil);
    const lang = rel.startsWith('sv/') ? 'sv' : 'da';
    assert.match(html, new RegExp(`<html lang="${lang}">`), rel);
    assert.match(html, /<link rel="canonical" href="https:\/\/matlyst-app\.no\/(?:sv|da)\/[^"]*">/u, rel);
    for (const kode of ['sv-SE', 'da-DK']) {
      assert.match(html, new RegExp(`<link rel="alternate" hreflang="${kode}" href="[^"]+">`), `${rel}: ${kode}`);
    }
    const blokker = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gu)];
    assert.ok(blokker.length > 0, `${rel}: mangler JSON-LD`);
    for (const [, raw] of blokker) assert.doesNotThrow(() => JSON.parse(raw), rel);
    assert.match(html, /<main id="hovedinnhold"/u, rel);
    assert.doesNotMatch(html, /\sstyle=/u, rel);
    assert.doesNotMatch(html, /\b(?:NOK|SEK|DKK)\b|\d+\s*(?:kr|kroner)\b/iu, rel);
  }
});

test('alle hreflang-mål finnes og peker gjensidig tilbake', () => {
  for (const fil of filer) {
    const html = les(fil);
    const canonical = html.match(/<link rel="canonical" href="([^"]+)">/u)?.[1];
    for (const [, kode, href] of html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/gu)) {
      const målfil = urlTilFil(href);
      assert.equal(existsSync(målfil), true, `${relative(root, fil)} → ${href}`);
      if (kode === 'sv-SE' || kode === 'da-DK') {
        assert.match(les(målfil), new RegExp(`<link rel="alternate" hreflang="(?:sv-SE|da-DK)" href="${regexEsc(canonical)}">`), href);
      }
    }
  }
});

test('synlig lokal tekst inneholder ikke sentrale norske restord', () => {
  const stop = /\b(?:oppskrift|oppskrifter|handleliste|ukemeny|spiskammer|slett konto|hverdagsmiddag)\b/iu;
  for (const fil of filer) {
    const synlig = les(fil)
      .replace(/<script[\s\S]*?<\/script>/gu, ' ')
      .replace(/<style[\s\S]*?<\/style>/gu, ' ')
      .replace(/<[^>]+>/gu, ' ')
      .replace(/\s+/gu, ' ');
    assert.doesNotMatch(synlig, stop, relative(root, fil));
  }
});

test('lokale sider bruker engelske butikkmerker og kundespråk', () => {
  for (const fil of filer) {
    const html = les(fil);
    const rel = relative(root, fil);
    if (html.includes('class="btn-store"')) {
      assert.match(html, /\/images\/appstore-badge\.svg/u, rel);
      assert.match(html, /\/images\/googleplay-badge-en\.png/u, rel);
      assert.doesNotMatch(html, /badge-(?:sv|da)\./u, rel);
    }
    const lang = rel.startsWith('sv/') ? 'sv' : 'da';
    assert.doesNotMatch(html, /abonnemangs?gate|abonnementsgate/iu, rel);
    if (lang === 'da') assert.doesNotMatch(html, /\bugemenu(?:en)?\b/iu, rel);
  }
});

test('alle statiske HTML-sider bruker bare offisielle engelske butikkmerker', () => {
  const htmlFiler = finnHtml(root).filter((fil) => !relative(root, fil).startsWith('qa/'));
  for (const fil of htmlFiler) {
    const html = les(fil);
    if (!html.includes('class="btn-store"')) continue;
    const rel = relative(root, fil);
    assert.ok(html.includes('images/appstore-badge.svg'), rel);
    assert.ok(html.includes('images/googleplay-badge-en.png'), rel);
    assert.doesNotMatch(html, /badge-(?:sv|da)./u, rel);
    assert.doesNotMatch(html, /googleplay-badge.png/u, rel);
  }
});

test('FAQ-spørsmål ender med spørsmålstegn og synlig FAQ er identisk med JSON-LD', () => {
  for (const fil of filer) {
    const html = les(fil);
    const rel = relative(root, fil);
    const visible = [...html.matchAll(/<details[^>]*>\s*<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>/gu)]
      .map(([, question, answer]) => ({ question: question.replace(/<[^>]+>/gu, '').trim(), answer: answer.replace(/<[^>]+>/gu, '').trim() }));
    const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gu)]
      .map(([, raw]) => JSON.parse(raw)).flatMap((schema) => Array.isArray(schema) ? schema : [schema])
      .filter((schema) => schema['@type'] === 'FAQPage')
      .flatMap((schema) => schema.mainEntity ?? [])
      .map((entry) => ({ question: entry.name, answer: entry.acceptedAnswer.text }));
    assert.deepEqual(jsonLd, visible, rel);
    for (const entry of visible) assert.match(entry.question, /\?$/u, rel);
  }
});

test('overskrifter har ikke gjentatte ord', () => {
  for (const fil of filer) {
    const html = les(fil);
    const rel = relative(root, fil);
    for (const [, raw] of html.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gu)) {
      const text = raw.replace(/<[^>]+>/gu, ' ').replace(/&[^;]+;/gu, ' ').trim();
      const words = text.toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
      for (let i = 1; i < words.length; i += 1) assert.notEqual(words[i], words[i - 1], `${rel}: ${text}`);
    }
  }
});

test('alle sider som laster site.js har samtykkebanner og mulighet for å trekke samtykke tilbake', () => {
  for (const fil of filer) {
    const html = les(fil);
    const rel = relative(root, fil);
    assert.match(html, /<script src="\/site\.js" defer><\/script>/u, rel);
    assert.match(html, /id="cookie"/u, rel);
    assert.match(html, /data-consent-withdraw/u, rel);
  }
});

test('produktbevis har språktilpassede kildesider og riktige funksjonsreferanser', () => {
  const qa = les(join(root, 'qa/sv-da/produktpaastander.md'));
  const rader = [...qa.matchAll(/^\| (\/(?:sv|da)\/[^ ]+\/) \| (.+?) \| `/gmu)];
  assert.equal(rader.length, 34);
  for (const [, side, sitat] of rader) {
    assert.ok(les(join(root, side, 'index.html')).includes(sitat), `${side}: påstanden er ikke sitert ordrett`);
  }
  assert.match(qa, /\/da\/haandskrevne-opskrifter\/[^\n]+lib\/importEngine\.ts/u);
  assert.match(qa, /\/da\/spisekammer-app\/[^\n]+hooks\/usePantry\.ts/u);
});

test('butikklenkene er dokumentert som sperret til Patricks lanseringsordre', () => {
  const qa = les(join(root, 'qa/sv-da/README.md'));
  assert.match(qa, /butikklenkene[^\n]+ikke[^\n]+live[^\n]+Patrick[^\n]+«lanser»/iu);
});

test('støttesider er noindex og publiseringssitemap er urørt', () => {
  for (const fil of filer.filter((f) => /\/(?:avregistrera|afmeld|tiktok|tiktok-auth)\//u.test(f))) {
    assert.match(les(fil), /<meta name="robots" content="noindex, follow">/u, relative(root, fil));
  }
  const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');
  assert.doesNotMatch(sitemap, /matlyst-app\.no\/(?:sv|da)\//u);
});

test('språkvelgeren peker på samme sides motstykker', () => {
  for (const fil of filer) {
    const html = les(fil);
    const sv = html.match(/hreflang="sv-SE" href="([^"]+)"/u)?.[1];
    const da = html.match(/hreflang="da-DK" href="([^"]+)"/u)?.[1];
    assert.match(html, new RegExp(`href="${regexEsc(new URL(sv).pathname)}\\?sprak=sv"`), relative(root, fil));
    assert.match(html, new RegExp(`href="${regexEsc(new URL(da).pathname)}\\?sprak=da"`), relative(root, fil));
  }
});

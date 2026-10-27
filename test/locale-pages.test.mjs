import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

import { SIDEGRUPPER, alternativerFor, filForSti } from '../scripts/locale-sider.mjs';

const root = dirname(fileURLToPath(import.meta.url)) + '/..';

function finnHtml(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? finnHtml(path) : entry.name === 'index.html' ? [path] : [];
  });
}

const filer = ['sv', 'da', 'en'].flatMap((lang) => finnHtml(join(root, lang)));
const les = (fil) => readFileSync(fil, 'utf8');
const urlTilFil = (href) => {
  const path = new URL(href).pathname;
  if (path === '/') return join(root, 'index.html');
  if (path.endsWith('/')) return join(root, path, 'index.html');
  return join(root, path);
};
const regexEsc = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test('alle lokale sider har språk, canonical, hreflang og gyldig strukturert data', () => {
  const tabellforte = new Set(SIDEGRUPPER.flatMap(({ sider }) => Object.values(sider))
    .filter((sti) => /^\/(?:sv|da|en)\//u.test(sti))
    .map((sti) => join(root, filForSti(sti))));
  for (const fil of tabellforte) assert.equal(existsSync(fil), true, relative(root, fil));
  assert.ok(filer.length >= tabellforte.size, `${filer.length} filer, ${tabellforte.size} tabellført`);
  for (const fil of filer) {
    const html = les(fil);
    const rel = relative(root, fil);
    const lang = rel.split('/')[0];
    assert.match(html, new RegExp(`<html lang="${lang}">`), rel);
    assert.match(html, new RegExp(`<link rel="canonical" href="https://matlyst-app\\.no/${lang}/[^"]*">`, 'u'), rel);
    const canonicalSti = new URL(html.match(/<link rel="canonical" href="([^"]+)">/u)[1]).pathname;
    for (const [kode, href] of alternativerFor(canonicalSti)) {
      assert.match(html, new RegExp(`<link rel="alternate" hreflang="${kode}" href="https://matlyst-app\\.no${regexEsc(href)}">`), `${rel}: ${kode}`);
    }
    const blokker = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gu)];
    assert.ok(blokker.length > 0, `${rel}: mangler JSON-LD`);
    for (const [, raw] of blokker) assert.doesNotThrow(() => JSON.parse(raw), rel);
    assert.match(html, /<main id="hovedinnhold"/u, rel);
    assert.doesNotMatch(html, /\sstyle=/u, rel);
    assert.doesNotMatch(html, /\b(?:NOK|SEK|DKK)\b|\d+\s*(?:kr(?![a-zåäöæø])|kroner\b)/iu, rel);
  }
});

test('alle hreflang-mål finnes og peker gjensidig tilbake', () => {
  for (const fil of filer) {
    const html = les(fil);
    const canonical = html.match(/<link rel="canonical" href="([^"]+)">/u)?.[1];
    for (const [, kode, href] of html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/gu)) {
      const målfil = urlTilFil(href);
      assert.equal(existsSync(målfil), true, `${relative(root, fil)} → ${href}`);
      if (kode !== 'x-default' && href !== canonical) {
        assert.match(les(målfil), new RegExp(`<link rel="alternate" hreflang="[^"]+" href="${regexEsc(canonical)}">`), href);
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
    const lang = rel.split('/')[0];
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
    if (/\/(?:avregistrera|afmeld|unsubscribe|tiktok-auth)\/index\.html$/u.test(fil)) {
      assert.doesNotMatch(html, /site\.js|id="cookie"|data-consent-withdraw/u, rel);
      continue;
    }
    assert.match(html, /<script src="\/site\.js" defer><\/script>/u, rel);
    assert.match(html, /id="cookie"/u, rel);
    assert.match(html, /data-consent-withdraw/u, rel);
  }
});

test('produktbevis har språktilpassede kildesider og riktige funksjonsreferanser', () => {
  const qa = les(join(root, 'qa/sv-da/produktpaastander.md'));
  const rader = [...qa.matchAll(/^\| (\/(?:sv|da)\/[^ ]+\/) \| (.+?) \| `/gmu)];
  assert.ok(rader.length >= 40, `${rader.length} dokumenterte påstander`);
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
  for (const fil of filer.filter((f) => /\/(?:tiktok|tiktok-auth)\//u.test(f))) {
    assert.match(les(fil), /<meta name="robots" content="noindex, follow">/u, relative(root, fil));
  }
  for (const fil of filer.filter((f) => /\/(?:avregistrera|afmeld|unsubscribe)\//u.test(f))) {
    assert.match(les(fil), /<meta name="robots" content="noindex, nofollow">/u, relative(root, fil));
  }
  const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');
  assert.doesNotMatch(sitemap, /matlyst-app\.no\/(?:sv|da)\//u);
});

test('språkvelgeren peker på samme sides motstykker', () => {
  for (const gruppe of SIDEGRUPPER) {
    for (const [aktivtSprak, sti] of Object.entries(gruppe.sider)) {
      const fil = join(root, filForSti(sti));
      const html = les(fil);
      assert.match(html, /<link rel="stylesheet" href="\/language-switcher\.css">/u, relative(root, fil));
      assert.match(html, /<script src="\/language-switcher\.js" defer><\/script>/u, relative(root, fil));
      assert.equal((html.match(/class="language-switcher(?: [^"]*)?"/gu) ?? []).length, 2, relative(root, fil));
      assert.equal((html.match(/role="navigation" aria-label="(?:Språk|Sprog|Language)"/gu) ?? []).length, 2, relative(root, fil));
      assert.equal((html.match(/aria-current="page"/gu) ?? []).length, 2, relative(root, fil));
      for (const [sprak, href] of Object.entries(gruppe.sider)) {
        const lenke = `href="${href}?sprak=${sprak}"`;
        assert.equal(html.split(lenke).length - 1, 2, `${relative(root, fil)}: ${sprak}`);
      }
      assert.match(html, new RegExp(`href="${regexEsc(sti)}\\?sprak=${aktivtSprak}"[^>]*aria-current="page"`), relative(root, fil));
    }
  }
});

test('språkvelgeren lager ingen tomme plassholdere', () => {
  for (const gruppe of SIDEGRUPPER) {
    for (const sti of Object.values(gruppe.sider)) {
      const html = les(join(root, filForSti(sti)));
      assert.doesNotMatch(html, /<div class="language-switcher-standalone[^"]*">\s*<\/div>/u, sti);
    }
  }
});

test('alle TikTok-retursidene viser og kan kopiere autorisasjonskoden', () => {
  for (const sti of ['/tiktok-auth/', '/sv/tiktok-auth/', '/da/tiktok-auth/', '/en/tiktok-auth/']) {
    const html = les(join(root, filForSti(sti)));
    assert.match(html, /id="kode"/u, sti);
    assert.match(html, /id="kopier"/u, sti);
    assert.match(html, /<script src="\/tiktok-auth\.js" defer><\/script>/u, sti);
    assert.match(html, /<link rel="stylesheet" href="\/tiktok-auth\.css">/u, sti);
    assert.doesNotMatch(html, /site\.js|posthog|googletagmanager/iu, sti);
  }
});

test('tokenbærende tekniske sider laster aldri nettstedsanalyse', () => {
  for (const sti of [
    '/avmeld/', '/sv/avregistrera/', '/da/afmeld/', '/en/unsubscribe/',
    '/tiktok-auth/', '/sv/tiktok-auth/', '/da/tiktok-auth/', '/en/tiktok-auth/',
  ]) {
    const html = les(join(root, filForSti(sti)));
    assert.doesNotMatch(html, /site\.js|posthog|googletagmanager/iu, sti);
    assert.match(html, /<meta name="referrer" content="no-referrer">/u, sti);
  }
});

test('x-default peker på engelsk når gruppen har det, ellers på bokmål', () => {
  for (const gruppe of SIDEGRUPPER.filter(({ sider }) => sider.nb)) {
    for (const sti of Object.values(gruppe.sider)) {
      assert.deepEqual(alternativerFor(sti).at(-1), ['x-default', gruppe.sider.en ?? gruppe.sider.nb], sti);
    }
  }
});

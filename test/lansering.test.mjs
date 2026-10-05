import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const ROOT = new URL('..', import.meta.url).pathname;
const les = (path) => readFileSync(join(ROOT, path), 'utf8');

function finnHtml(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? finnHtml(path) : entry.name === 'index.html' ? [path] : [];
  });
}

const urlTilFil = (href) => {
  const path = new URL(href).pathname;
  return join(ROOT, path.endsWith('/') ? `${path}index.html` : path);
};

test('robots.txt tillater alt og peker på norsk, svensk og dansk sitemap', () => {
  const robots = les('robots.txt');
  assert.match(robots, /^User-agent: \*\nAllow: \/\n/u);
  for (const navn of ['sitemap.xml', 'sitemap-sv.xml', 'sitemap-da.xml']) {
    assert.match(robots, new RegExp(`^Sitemap: https://matlyst-app\\.no/${navn.replace('.', '\\.')}$`, 'mu'), navn);
    assert.ok(existsSync(join(ROOT, navn)), navn);
  }
});

for (const lang of ['sv', 'da']) {
  test(`sitemap-${lang}.xml har alle indekserbare ${lang}-sider med lastmod og gjensidige alternativer`, () => {
    const xml = les(`sitemap-${lang}.xml`);
    assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>\n<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9" xmlns:xhtml="http:\/\/www\.w3\.org\/1999\/xhtml">/u);
    const blokker = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/gu)].map(([, blokk]) => blokk);
    const loc = blokker.map((blokk) => blokk.match(/<loc>([^<]+)<\/loc>/u)[1]);
    const forventet = finnHtml(join(ROOT, lang))
      .map((fil) => readFileSync(fil, 'utf8'))
      .filter((html) => !html.includes('content="noindex'))
      .map((html) => html.match(/<link rel="canonical" href="([^"]+)">/u)[1])
      .sort();
    assert.equal(forventet.length, 21);
    assert.deepEqual([...loc].sort(), forventet);
    for (const blokk of blokker) {
      const side = blokk.match(/<loc>([^<]+)<\/loc>/u)[1];
      assert.match(blokk, /<loc>[^<]+<\/loc>\s*<lastmod>2026-10-05<\/lastmod>/u, side);
      const html = readFileSync(urlTilFil(side), 'utf8');
      assert.doesNotMatch(html, /content="noindex/u, side);
      const iSitemap = [...blokk.matchAll(/hreflang="([^"]+)" href="([^"]+)"/gu)].map(([, k, h]) => `${k} ${h}`).sort();
      const iHtml = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/gu)].map(([, k, h]) => `${k} ${h}`).sort();
      assert.deepEqual(iSitemap, iHtml, side);
      for (const linje of iSitemap) assert.ok(existsSync(urlTilFil(linje.split(' ')[1])), linje);
    }
  });
}

test('det norske sitemapet er fortsatt bare norske sider', () => {
  assert.doesNotMatch(les('sitemap.xml'), /matlyst-app\.no\/(?:sv|da)\//u);
});


test('forsidene har posisjoneringen i ingress og meta description, uten superlativer', () => {
  const forsider = [
    ['index.html', 'Oppskriftsappen som oversetter og tilpasser oppskriftene dine.'],
    ['sv/index.html', 'Receptappen som översätter och anpassar dina recept.'],
    ['da/index.html', 'Opskriftsappen, der oversætter og tilpasser dine opskrifter.'],
  ];
  const superlativ = /(?<!\p{L})(?:beste?|bedste|bästa?|best|nr\. ?1|nummer (?:1|én|en|ett)|#1)(?!\p{L})/iu;
  for (const [fil, posisjonering] of forsider) {
    const html = les(fil);
    assert.ok(html.match(/<meta name="description" content="([^"]+)"/u)[1].startsWith(posisjonering), `${fil}: meta description`);
    assert.ok(html.match(/<p class="lead">([^<]+)<\/p>/u)[1].startsWith(posisjonering), `${fil}: ingress`);
    const synlig = html.replace(/<script[\s\S]*?<\/script>/gu, ' ').replace(/<[^>]+>/gu, ' ');
    assert.doesNotMatch(synlig, superlativ, fil);
    assert.doesNotMatch(html.match(/<head>[\s\S]*?<\/head>/u)[0], superlativ, `${fil}: head`);
  }
});

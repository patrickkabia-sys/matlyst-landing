import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

// GitHub Pages bygger nettstedet med Jekyll og publiserer ALT i repoet som ikke
// står under `exclude` i _config.yml. Markdown blir til egne sider, og skript,
// tester og datafiler kopieres ut som de er. 18.11.2026 lå blant annet
// /docs/vervekort-jus, /SEO-SEARCH-CONSOLE, /seo/sokevolum-2026-10-28 og
// /package.json åpent på matlyst-app.no. Testen her vokter at arbeidsfiler aldri
// publiseres, og at ingen offentlig side blir utelatt ved et uhell.

const root = fileURLToPath(new URL('..', import.meta.url));

function utelatt() {
  const linjer = readFileSync(`${root}_config.yml`, 'utf8').split('\n');
  const start = linjer.findIndex((linje) => /^exclude:\s*$/u.test(linje));
  assert.notEqual(start, -1, '_config.yml mangler exclude-lista');
  const liste = [];
  for (const linje of linjer.slice(start + 1)) {
    if (/^\s*(#.*)?$/u.test(linje)) continue;
    const treff = linje.match(/^\s+-\s+(.+?)\s*$/u);
    if (!treff) break;
    liste.push(treff[1].replace(/^["']|["']$/gu, ''));
  }
  return liste;
}

const filer = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
const liste = utelatt();
const erUtelatt = (sti) => liste.some((oppføring) => sti === oppføring || sti.startsWith(`${oppføring}/`));
const publiserte = (mønster) => filer.filter((sti) => mønster.test(sti) && !erUtelatt(sti));

test('hver oppføring i exclude-lista treffer noe i repoet', () => {
  // En skrivefeil i lista feiler ikke noe sted: fila blir bare publisert likevel.
  // test-results lages av Playwright og er ikke sjekket inn.
  assert.ok(liste.length > 1, 'exclude-lista er tom eller ble ikke lest');
  const døde = liste.filter((oppføring) => oppføring !== 'test-results' && !filer.some((sti) => sti === oppføring || sti.startsWith(`${oppføring}/`)));
  assert.deepEqual(døde, []);
});

test('hver fil i repoet er enten en offentlig filtype eller utelatt', () => {
  // Exclude-lista stopper bare det noen har husket å føre opp. Denne testen snur
  // det: en fil som verken er utelatt eller av en type nettstedet faktisk bruker,
  // feiler her. Da må den som legger til en ny slags fil ta stilling til den.
  // Jekyll publiserer aldri stier som begynner med punktum eller understrek.
  const offentlig = /\.(html|css|js|xml|txt|webp|jpg|png|svg|mp4|woff2)$/u;
  const skjultAvJekyll = (sti) => sti.split('/').some((ledd) => /^[._]/u.test(ledd));
  const uavklart = filer.filter((sti) => !erUtelatt(sti) && !skjultAvJekyll(sti) && !offentlig.test(sti) && sti !== 'CNAME');
  assert.deepEqual(uavklart, []);
});

test('ingen Markdown-filer publiseres', () => {
  assert.ok(filer.some((sti) => /\.md$/u.test(sti)), 'fant ingen Markdown-filer, så testen vokter ingenting');
  assert.deepEqual(publiserte(/\.md$/u), []);
});

test('skript, tester og pakkefiler publiseres ikke', () => {
  assert.ok(filer.some((sti) => /\.mjs$/u.test(sti)), 'fant ingen .mjs-filer, så testen vokter ingenting');
  assert.deepEqual(publiserte(/\.mjs$/u), []);
  assert.deepEqual(publiserte(/^(package(-lock)?\.json|locale-readiness\.json)$/u), []);
  assert.deepEqual(publiserte(/^(seo-data|blogg-kilde)\//u), []);
});

test('ingen side i sitemappene er utelatt', () => {
  // Fasiten hentes fra sitemappene, ikke fra en liste her: da fanges en ny side også.
  const stier = [];
  for (const kart of filer.filter((sti) => /^sitemap[^/]*\.xml$/u.test(sti))) {
    for (const [, adresse] of readFileSync(`${root}${kart}`, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/gu)) {
      const sti = decodeURIComponent(new URL(adresse).pathname).replace(/^\//u, '');
      stier.push(sti === '' || sti.endsWith('/') ? `${sti}index.html` : sti);
    }
  }
  assert.ok(stier.length > 500, `fant bare ${stier.length} adresser i sitemappene`);
  assert.deepEqual(stier.filter((sti) => !filer.includes(sti) && !filer.includes(`${sti}.html`)), [], 'adresser uten fil');
  assert.deepEqual(stier.filter(erUtelatt), []);
  for (const sti of ['index.html', 'styles.css', 'site.js', 'sitemap.xml', 'robots.txt', 'llms.txt', 'CNAME']) {
    assert.ok(filer.includes(sti), `${sti} finnes ikke`);
    assert.equal(erUtelatt(sti), false, `${sti} er utelatt`);
  }
});

// Omfang for sidekontrollen på PR-er: full kontroll når delt stil, skall eller skript endres
// (eller når git ikke finner basen), utvalg ellers.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { PR_TRYGGE, omfang } from '../scripts/revisjon-omfang.mjs';

const ROT = fileURLToPath(new URL('..', import.meta.url));
const SKRIPT = join(ROT, 'scripts', 'revisjon-omfang.mjs');

test('delt stil, skall, skript og bilder gir full kontroll', () => {
  for (const f of ['side.css', 'tokens.css', 'site.js', 'skall.js', 'locale.js', 'scripts/skall-paa.mjs', 'scripts/sidetyper.mjs',
    'scripts/generer-lokalsider.mjs', 'scripts/familier/felles.mjs', 'scripts/familier/skjema.mjs', 'scripts/familier/register.mjs',
    'test/playwright/revisjon.spec.mjs', 'fonts/x.woff2', 'playwright.config.mjs', '.github/workflows/revisjon.yml', 'package.json', 'package-lock.json',
    // Skriptene i ETTERBEHANDLING som skriver alle sider, og Codex sine eksempler.
    'scripts/hyller.mjs', 'scripts/app-bevis.mjs', 'scripts/bilde-attributter.mjs', 'scripts/guidelenker.mjs', 'scripts/lenker-sett.mjs',
    'scripts/sprak-signaler.mjs', 'scripts/forside.mjs', 'scripts/enheter.mjs', 'scripts/locale-sider.mjs',
    'images/forside/logo/14.webp', 'images/forside/qr-app.svg', 'images/en-guide/bilder.json', 'images/og.jpg', 'images/icon.png']) {
    assert.equal(omfang([f]), 'full', f);
  }
});
test('en helt ukjent sti gir full kontroll', () => {
  assert.equal(omfang(['noe-nytt/fil.xyz']), 'full');
  assert.equal(omfang(['README.md', 'noe-nytt/fil.xyz']), 'full');
});
test('sider, data, maler for én familie, tekstmoduler og drift gir utvalg', () => {
  for (const f of ['verktoy/dl-til-kopp/index.html', '404.html', 'en/tools/cups-to-grams/index.html', 'scripts/familier/dl-til-gram/data.nb.json',
    'scripts/familier/dl-til-gram/mal-nb.mjs', 'scripts/nb-enhetssider.mjs', 'scripts/sv-rike-sider.mjs', 'scripts/en-hoytider/x.mjs', 'scripts/nb-jul/x.mjs',
    'scripts/nb-om/x.mjs', 'scripts/en-flytting/x.mjs', 'scripts/en-ekstra/x.mjs', 'scripts/blogg.mjs', 'scripts/forfatter.mjs',
    'scripts/lastmod.mjs', 'scripts/lastmod-fro.mjs', 'scripts/llms.mjs', 'scripts/indexnow.mjs', 'scripts/serp-sjekk.mjs', 'scripts/sweetspot.mjs', 'scripts/kjede.mjs', 'scripts/kjedeproeve.mjs',
    '.github/workflows/test.yml', '.github/workflows/indexnow.yml',
    'README.md', 'docs/x/plan.md', 'sitemap.xml', 'sitemap-en.xml', 'llms.txt', 'robots.txt',
    'test/revisjon-omfang.test.mjs', 'test/fiksturer/a/b.json', 'test/fasit/x.json', 'test/hjelp/x.mjs',
    'seo-motor/x.mjs', 'seo-data/x.json', 'seo/x.md', 'blogg-kilde/x.md', 'qa/x.png', 'images/blogg/nb/x.webp']) {
    assert.equal(omfang([f]), 'pr', f);
  }
});
test('tom liste gir utvalg', () => {
  assert.equal(omfang([]), 'pr');
});
test('én fil som ikke er trygg blant mange sider gir full kontroll', () => {
  assert.equal(omfang(['verktoy/dl-til-kopp/index.html', 'README.md', 'playwright.config.mjs']), 'full');
});
test('stil og skript i undermapper av sider regnes ikke som trygge', () => {
  assert.equal(omfang(['blogg/x/stil.css']), 'full');
  assert.equal(omfang(['verktoy/x/app.js']), 'full');
});
test('html-filer under test/ og scripts/ er ikke publiserte sider', () => {
  assert.equal(omfang(['test/fixtures/revisjon-px-tekst.html']), 'full');
  assert.equal(omfang(['scripts/vervekort/mal.html']), 'full');
});
test('en sti i anførselstegn (git siterer æøå som oktaleskaper) gir full kontroll', () => {
  assert.equal(omfang(['"blogg/r\\303\\270re/index.html"']), 'full');
});
test('ukjent grunnlag gir full kontroll', () => {
  assert.equal(omfang(null), 'full');
});
test('mønstrene er en liste av regulære uttrykk', () => {
  assert.ok(PR_TRYGGE.length >= 10);
  for (const m of PR_TRYGGE) assert.ok(m instanceof RegExp);
});
test('kommandolinjen leser endringslista fra stdin, og --ukjent gir full', () => {
  const kjor = (args, input) => spawnSync(process.execPath, [SKRIPT, ...args], { input, encoding: 'utf8' });
  assert.equal(kjor([], 'README.md\nsitemap.xml\n').stdout.trim(), 'pr');
  assert.equal(kjor([], 'README.md\nside.css\n').stdout.trim(), 'full');
  assert.equal(kjor([], 'noe-nytt/fil.xyz\n').stdout.trim(), 'full');
  assert.equal(kjor([], '').stdout.trim(), 'pr');
  assert.equal(kjor(['--ukjent'], '').stdout.trim(), 'full');
});

const yml = readFileSync(join(ROT, '.github/workflows/revisjon.yml'), 'utf8');
test('arbeidsflyten har ukentlig kjøring, omfangsjobb og ingen typematrise', () => {
  assert.match(yml, /schedule:\s*\n\s*- cron: '0 4 \* \* 1'/u);
  assert.match(yml, /fetch-depth: 0/u);
  assert.match(yml, /REVISJON: pr/u);
  assert.match(yml, /REVISJON: alle/u);
  assert.equal(/type: omregner/u.test(yml), false);
});
test('arbeidsflyten kjører full kontroll på manuell start, og faller tilbake til full når git feiler', () => {
  assert.match(yml, /workflow_dispatch:/u);
  assert.match(yml, /github\.event\.pull_request\.base\.sha/u);
  assert.match(yml, /--ukjent/u);
  // --no-renames: ellers viser en omdøping bare det nye navnet, og en flyttet side.css ser trygg ut.
  assert.match(yml, /git -c core\.quotePath=false diff --no-renames --name-only/u);
  assert.match(yml, /REVISJON_ENDRET: /u);
  assert.match(yml, /timeout-minutes: 30/u);
  assert.match(yml, /--shard=\$\{\{ matrix\.skar \}\}\/12/u);
  assert.match(yml, /--shard=\$\{\{ matrix\.skar \}\}\/2/u);
});

test('kontroll-jobben krever at nøyaktig én revisjonsjobb lyktes, og bruker samme output som omfang definerer', () => {
  const jobb = (navn) => {
    const m = new RegExp(`^  ${navn}:\\n([\\s\\S]*?)(?=^  \\w[\\w-]*:\\n|(?![\\s\\S]))`, 'mu').exec(yml);
    assert.ok(m, `mangler jobben ${navn}`);
    return m[1];
  };
  const kontroll = jobb('kontroll');
  assert.match(kontroll, /needs: \[omfang, utvalg, full\]/u);
  assert.match(kontroll, /if: always\(\)/u);
  // Outputen som omfang definerer er den samme som begge revisjonsjobbene tester på.
  const definert = /outputs:\s*\n\s*(\w+): \$\{\{ steps\.\w+\.outputs\.\w+ \}\}/u.exec(jobb('omfang'))?.[1];
  assert.ok(definert, 'omfang definerer ingen output');
  const stegOutput = /steps\.(\w+)\.outputs\.(\w+)/u.exec(jobb('omfang'));
  const skrevet = /echo "(\w+)=\$modus" >> "\$GITHUB_OUTPUT"/u.exec(jobb('omfang'))?.[1];
  assert.equal(skrevet, stegOutput[2], 'steget skriver en annen output enn omfang henter ut');
  for (const [navn, verdi] of [['utvalg', 'pr'], ['full', 'full']]) {
    const m = /if: needs\.omfang\.outputs\.(\w+) == '(\w+)'/u.exec(jobb(navn));
    assert.ok(m, `${navn} mangler if på omfang`);
    assert.equal(m[1], definert, `${navn} tester en annen output enn omfang definerer`);
    assert.equal(m[2], verdi);
  }
  assert.match(kontroll, /needs\.omfang\.result/u);
  assert.match(kontroll, /needs\.utvalg\.result/u);
  assert.match(kontroll, /needs\.full\.result/u);
  assert.match(kontroll, /exit 1/u);
});

// Filer utenfor sidene som generatorene og etterbehandlingen leser. Endres de, kan mer enn én gruppe sider endre seg.
const GENERATORER_SOM_LESER = ['generer-lokalsider', 'generer-norske-importguider', 'blogg', 'forside', 'lenker-sett', 'rik-sider', 'app-bevis'];
test('datafiler som generatorene leser gir full kontroll', () => {
  const funnet = new Set(['seo-data/sprak/nb.json', 'seo-data/lenkekart.json', 'images/en-guide/bilder.json']);
  for (const navn of GENERATORER_SOM_LESER) {
    const kilde = readFileSync(join(ROT, 'scripts', `${navn}.mjs`), 'utf8').replace(/\/\/.*$/gmu, '');
    for (const m of kilde.matchAll(/(seo-data|images\/en-guide)\/[\w./${}-]+\.json/gu)) funnet.add(m[0].replace('${lang}', 'nb').replace('${språk}', 'nb'));
  }
  assert.ok(funnet.size >= 3);
  for (const f of funnet) {
    assert.ok(!f.includes('$'), `ulest mal i ${f}`);
    assert.equal(omfang([f]), 'full', f);
  }
  for (const lang of ['nb', 'sv', 'da', 'en']) assert.equal(omfang([`seo-data/sprak/${lang}.json`]), 'full', lang);
});
test('seo-data som bare SEO-motoren bruker, og kilder til enkeltsider, er fortsatt trygge', () => {
  for (const f of ['seo-data/publisert.json', 'seo-data/kilder.json', 'seo-data/logg/x.json', 'blogg-kilde/karuseller.json', 'blogg-kilde/auto/x.json']) {
    assert.equal(omfang([f]), 'pr', f);
  }
});

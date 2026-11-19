import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { allePar } from '../scripts/enheter.mjs';
import {
  BLOGGINDEKS, EKSEMPEL, TYPER, alleSider, erUtrullet, nokkel, sidetype, sidetypeEllerNull, tjenestefamilie,
} from '../scripts/sidetyper.mjs';

const rot = fileURLToPath(new URL('..', import.meta.url));
const les = (fil) => readFileSync(`${rot}${fil}`, 'utf8');
const sider = alleSider(rot);
const type = (sti) => sider.find((s) => s.sti === sti)?.type;

test('hver publiserbar HTML-fil får én type og én nøkkel', () => {
  assert.equal(sider.length, 876, 'nye sider: forklar endringen i commit-meldingen og rett tallet');
  for (const s of sider) { assert.ok(TYPER.includes(s.type), s.sti); assert.ok(s.nokkel, s.sti); }
  assert.ok(!sider.some((s) => s.fil.includes('/.')));
});
test('omregnerne er alle parene pluss fire hubber', () => {
  const par = ['nb', 'sv', 'da', 'en'].reduce((n, l) => n + allePar(l).length, 0);
  assert.equal(sider.filter((s) => s.type === 'omregner').length, par + 4);
});
test('typene har de målte antallene', () => {
  assert.deepEqual(TYPER.map((t) => sider.filter((s) => s.type === t).length), [4, 714, 31, 56, 4, 33, 12, 22]);
});
test('kjente sider får riktig type', () => {
  for (const [sti, forventet] of [
    ['/', 'forside'], ['/verktoy/kopp-til-dl/', 'omregner'], ['/en/tools/unit-converter/', 'omregner'],
    ['/lagre-oppskrifter-fra-instagram/', 'guide-lang'], ['/en/holidays/thanksgiving/', 'guide-lang'], ['/blogg/velg-oppskriftsapp/', 'guide-lang'],
    ['/ukemeny/', 'guide-kort'], ['/importer-oppskrifter/', 'guide-kort'], ['/finn-oppskrifter/', 'guide-gammel'],
    ['/blogg/koketider/', 'blogg'], ['/da/blog/', 'blogg'], ['/personvern.html', 'juss'], ['/en/delete-account/', 'juss'],
    ['/avmeld/', 'tjeneste'], ['/v/', 'tjeneste'], ['/404.html', 'tjeneste'], ['/sv/tiktok/', 'tjeneste'],
  ]) assert.equal(type(sti), forventet, sti);
});
test('en side med både bloggartikkel og has-toc er blogg', () => {
  const html = '<html lang="nb"><body><article class="blogg-artikkel"><section class="prose locale-prose has-toc"></section></article></body></html>';
  assert.equal(sidetype('/blogg/x/', html), 'blogg');
});
test('nøkkel og predikat: type for vanlige sider, familie for tjenester, null utenfor registeret', () => {
  assert.equal(nokkel('/verktoy/kopp-til-dl/', les('verktoy/kopp-til-dl/index.html')), 'omregner');
  assert.equal(nokkel('/da/afmeld/', les('da/afmeld/index.html')), 'tjeneste:avmeld');
  assert.equal(nokkel('/x/', '<html lang="nb"><body></body></html>'), null);
  assert.equal(erUtrullet('/da/afmeld/', les('da/afmeld/index.html'), new Set(['tjeneste:avmeld'])), true);
  assert.equal(erUtrullet('/en/tiktok-auth/', les('en/tiktok-auth/index.html'), new Set(['tjeneste:avmeld'])), false);
  assert.equal(erUtrullet('/x/', '<html><body></body></html>', new Set(TYPER)), false);
});
test('hver eksempelside har typen den står som', () => {
  for (const [t, perSprak] of Object.entries(EKSEMPEL)) for (const sti of Object.values(perSprak)) assert.equal(type(sti), t, sti);
});
test('ukjent side kaster med stien, og EllerNull gir null', () => {
  assert.throws(() => sidetype('/ingenting/', '<html lang="nb"><body></body></html>'), /\/ingenting\//);
  assert.equal(sidetypeEllerNull('/ingenting/', '<html lang="nb"><body></body></html>'), null);
});
test('tjenestefamilier og bloggindekser dekker alle språk', () => {
  assert.equal(tjenestefamilie('/googleeaf5ec75e707227b.html'), 'verifisering');
  assert.equal(tjenestefamilie('/christine/'), 'kampanje');
  assert.equal(tjenestefamilie('/ukemeny/'), null);
  assert.deepEqual(Object.keys(BLOGGINDEKS).sort(), ['da', 'en', 'nb', 'sv']);
});
test('alleSider hopper over punktmapper og verktøymapper, også med HTML i dem', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'sidetyper-'));
  try {
    const hero = '<html lang="nb"><body><header class="locale-page-hero"></header></body></html>';
    for (const mappe of ['.superpowers', 'node_modules', 'docs', 'test', 'scripts', 'seo-motor', 'seo-data', 'seo', 'blogg-kilde', 'qa', 'test-results', 'playwright-report', 'ukemeny']) {
      mkdirSync(join(tmp, mappe), { recursive: true });
      writeFileSync(join(tmp, mappe, 'index.html'), hero);
    }
    assert.deepEqual(alleSider(tmp).map((s) => s.sti), ['/ukemeny/']);
  } finally { rmSync(tmp, { recursive: true, force: true }); }
});

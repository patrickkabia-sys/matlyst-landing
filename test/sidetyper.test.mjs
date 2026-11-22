import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { allePar } from '../scripts/enheter.mjs';
import { familieAntall } from '../scripts/familier/register.mjs';
import {
  BLOGGINDEKS, EKSEMPEL, TYPER, UTRULLET, alleSider, erGenerertFamilie, erUtrullet, nokkel, normaliserSti, sidetype, sidetypeEllerNull, tjenestefamilie,
} from '../scripts/sidetyper.mjs';

const rot = fileURLToPath(new URL('..', import.meta.url));
const les = (fil) => readFileSync(`${rot}${fil}`, 'utf8');
const sider = alleSider(rot);
const type = (sti) => sider.find((s) => s.sti === sti)?.type;

test('hver publiserbar HTML-fil får én type og én nøkkel', () => {
  assert.equal(sider.length, 900 + familieAntall().omregner + familieAntall()['guide-lang'], 'nye sider: forklar endringen i commit-meldingen og rett tallet');
  for (const s of sider) {
    assert.ok(TYPER.includes(s.type), s.sti);
    assert.equal(s.nokkel, s.type === 'tjeneste' ? `tjeneste:${tjenestefamilie(s.sti)}` : s.type, s.sti);
  }
  assert.ok(!sider.some((s) => s.fil.includes('/.')));
});
test('hver side har en familie, og omregnerne fordeler seg på enhetsgrupper', () => {
  for (const s of sider) assert.equal(typeof s.familie, 'string', s.sti);
  for (const s of sider.filter((x) => x.type !== 'omregner' && !x.familie.startsWith('fam:'))) assert.equal(s.familie, s.nokkel, s.sti);
  const tell = (f) => sider.filter((s) => s.familie === f).length;
  assert.equal(tell('omregner:nav'), 4);
  // «nav» er nøyaktig de fire hubbene. En ny side som havner der, må få en egen familie (se oppgave 5) i stedet for å regnes som håndskrevet.
  assert.deepEqual(sider.filter((s) => s.familie === 'omregner:nav').map((s) => s.sti).sort(),
    ['/da/vaerktoejer/enhedsomregner/', '/en/tools/unit-converter/', '/sv/verktyg/enhetsomvandlare/', '/verktoy/enhetsomregner/']);
  const fam = new Set(sider.filter((s) => s.type === 'omregner' && !s.familie.startsWith('fam:')).map((s) => s.familie));
  assert.deepEqual([...fam].sort(), ['omregner:lengde', 'omregner:nav', 'omregner:temperatur', 'omregner:vekt', 'omregner:volum']);
  assert.equal(sider.filter((s) => s.type === 'omregner' && !s.familie.startsWith('fam:')).length, ['volum', 'vekt', 'lengde', 'temperatur', 'nav'].reduce((n, g) => n + tell(`omregner:${g}`), 0));
  assert.equal(erGenerertFamilie('omregner:volum'), true);
  assert.equal(erGenerertFamilie('omregner:nav'), false);
  assert.equal(erGenerertFamilie('fam:dl-til-gram'), true);
  assert.equal(erGenerertFamilie('guide-lang'), false);
});
test('omregnerne er alle parene pluss fire hubber', () => {
  const par = ['nb', 'sv', 'da', 'en'].reduce((n, l) => n + allePar(l).length, 0);
  assert.equal(sider.filter((s) => s.type === 'omregner').length, par + 4 + familieAntall().omregner);
});
test('typene har de målte antallene', () => {
  const fa = familieAntall();
  assert.deepEqual(TYPER.map((t) => sider.filter((s) => s.type === t).length), [4, 714 + fa.omregner, 52 + fa['guide-lang'], 56, 3, 33, 12, 26]);
});
test('kjente sider får riktig type', () => {
  for (const [sti, forventet] of [
    ['/', 'forside'], ['/verktoy/kopp-til-dl/', 'omregner'], ['/en/tools/unit-converter/', 'omregner'],
    ['/lagre-oppskrifter-fra-instagram/', 'guide-lang'], ['/en/holidays/thanksgiving/', 'guide-lang'], ['/en/mealime-alternative/', 'guide-lang'], ['/julemiddag/', 'guide-lang'], ['/om/', 'guide-lang'], ['/blogg/velg-oppskriftsapp/', 'guide-lang'], ['/beste-oppskriftsapp/', 'guide-lang'], ['/en/best-recipe-app/', 'guide-lang'], ['/sv/basta-receptapp/', 'guide-lang'], ['/da/bedste-madplan-app/', 'guide-lang'],
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
  for (const t of TYPER) assert.ok(Object.keys(EKSEMPEL[t] ?? {}).length > 0, `ingen eksempel for ${t}`);
  for (const [t, perSprak] of Object.entries(EKSEMPEL)) for (const sti of Object.values(perSprak)) assert.equal(type(sti), t, sti);
});
test('ukjent side kaster med stien, og EllerNull gir null', () => {
  assert.throws(() => sidetype('/ingenting/', '<html lang="nb"><body></body></html>'), { message: 'Ukjent sidetype: /ingenting/' });
  assert.equal(sidetypeEllerNull('/ingenting/', '<html lang="nb"><body></body></html>'), null);
});
test('tjenestefamilier og bloggindekser dekker alle språk', () => {
  assert.equal(tjenestefamilie('/googleeaf5ec75e707227b.html'), 'verifisering');
  assert.equal(tjenestefamilie('/christine/'), 'kampanje');
  assert.equal(tjenestefamilie('/hanna/'), 'kampanje');
  assert.equal(tjenestefamilie('/ukemeny/'), null);
  assert.deepEqual(Object.keys(BLOGGINDEKS).sort(), ['da', 'en', 'nb', 'sv']);
  for (const sti of Object.values(BLOGGINDEKS)) assert.equal(type(sti), 'blogg', sti);
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
test('omregnerne, de lange og de korte guidene er rullet ut så langt', () => {
  // Utrullingsoppgavene (12 til 18) endrer denne testen med vilje når de legger til nøkler.
  assert.deepEqual([...UTRULLET], ['omregner', 'guide-lang', 'guide-kort', 'blogg', 'guide-gammel', 'juss', 'tjeneste:avmeld', 'tjeneste:bekreft', 'tjeneste:vervekort', 'tjeneste:auth', 'tjeneste:app', 'tjeneste:kampanje', 'tjeneste:feil']);
});
test('stien normaliseres likt: med og uten skråstrek, index.html, spørring og anker', () => {
  assert.equal(normaliserSti('/personvern.html?x=1#a'), '/personvern.html');
  assert.equal(normaliserSti('avmeld'), '/avmeld/');
  assert.equal(normaliserSti(''), '/');
  for (const s of sider) {
    const html = les(s.fil);
    const varianter = s.sti.endsWith('.html')
      ? [s.sti, s.sti.slice(1), `${s.sti}?a=1#b`]
      : [s.sti, s.sti === '/' ? '' : s.sti.slice(0, -1), s.sti.slice(1), `${s.sti}index.html`, `${s.sti}?a=1#b`];
    for (const v of varianter) {
      assert.equal(nokkel(v, html), s.nokkel, `${s.sti} som «${v}»`);
      assert.equal(sidetypeEllerNull(v, html), s.type, v);
      assert.equal(erUtrullet(v, html, new Set([s.nokkel])), true, v);
    }
  }
});

test('alleSider hopper over symlenkede HTML-filer og mapper, og trygtUnderRot avviser stier utenfor rota', async () => {
  const { symlinkSync } = await import('node:fs');
  const { alleSider, trygtUnderRot } = await import('../scripts/sidetyper.mjs');
  const tmp = mkdtempSync(join(tmpdir(), 'symlenke-'));
  try {
    const rot = join(tmp, 'rot'), ute = join(tmp, 'ute');
    mkdirSync(rot); mkdirSync(ute);
    const html = '<html><body><main id="hovedinnhold"><div class="locale-page-hero"></div></main></body></html>';
    writeFileSync(join(ute, 'hemmelig.html'), html);
    writeFileSync(join(rot, 'ekte.html'), html);
    mkdirSync(join(ute, 'mappe'));
    writeFileSync(join(ute, 'mappe', 'inne.html'), html);
    symlinkSync(join(ute, 'hemmelig.html'), join(rot, 'lenke.html'));
    symlinkSync(join(ute, 'mappe'), join(rot, 'lenkemappe'));
    assert.deepEqual(alleSider(rot).map((s) => s.fil), ['ekte.html']);
    assert.equal(trygtUnderRot(rot, join(rot, 'ekte.html')), true);
    assert.equal(trygtUnderRot(rot, join(rot, 'lenke.html')), false);
    assert.equal(trygtUnderRot(rot, join(rot, 'lenkemappe', 'inne.html')), false);
    assert.equal(trygtUnderRot(rot, join(rot, 'finnes-ikke.html')), false);
    assert.equal(trygtUnderRot(rot, rot), false);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

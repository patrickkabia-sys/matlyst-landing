// Det valgfrie feltet `topp` i side(v): HTML som står i toppen av siden, rett under ingressen.
// Generatoren skriver alle sider når den kjøres, så den kjøres bare i en kopi (aldri i arbeidskopien),
// med en prøvefamilie (test/fiksturer/familier/proeve-topp) lagt inn i en kopi av registeret.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test, { after } from 'node:test';
import { fileURLToPath } from 'node:url';
import { kopier } from '../scripts/kjedeproeve.mjs';

const ROT = fileURLToPath(new URL('..', import.meta.url));
const kopi = mkdtempSync(join(tmpdir(), 'side-topp-'));
after(() => rmSync(kopi, { recursive: true, force: true }));
kopier(ROT, kopi);

const registerFil = join(kopi, 'scripts/familier/register.mjs');
const original = readFileSync(registerFil, 'utf8');
// Registeret byttes som helhet, så prøvefamilien er den eneste i kopien uansett hvilke ekte familier som er registrert.
const LISTE = /export const FAMILIER = Object\.freeze\(\[[\s\S]*?\n?\]\);/u;
assert.ok(LISTE.test(original), 'fant ikke FAMILIER-lista i registeret');
writeFileSync(registerFil, original.replace(LISTE, () => `export const FAMILIER = Object.freeze([{ id: 'proeve-topp', sidetype: 'omregner', mappe: new URL(${JSON.stringify(`file://${ROT}test/fiksturer/familier/proeve-topp/`)}), markeder: { nb: { rot: 'verktoy/proeve-topp/' } } }]);`));
execFileSync(process.execPath, ['scripts/generer-norske-importguider.mjs'], { cwd: kopi, stdio: 'pipe', maxBuffer: 64 * 1024 * 1024 });

const les = (sti) => readFileSync(join(kopi, sti, 'index.html'), 'utf8');
const hode = (html) => html.slice(html.indexOf('<header class="locale-page-hero">'), html.indexOf('</header>'));

test('en side med topp har feltet inne i heroen, mellom ingressen og lesedelen', () => {
  const html = les('verktoy/proeve-topp');
  const skjema = html.indexOf('<form class="kalk"');
  const ingress = html.indexOf('class="lead"');
  const lesedel = html.indexOf('<section class="prose');
  assert.ok(ingress > -1 && skjema > -1 && lesedel > -1, 'ingress, skjema og lesedel må finnes');
  assert.ok(ingress < skjema && skjema < lesedel, 'skjemaet skal stå mellom ingressen og lesedelen');
  assert.ok(hode(html).includes('<form class="kalk"'), 'skjemaet skal stå inne i header.locale-page-hero');
});

test('en norsk omregner har kalkulatorkortet inne i heroen, mellom ingressen og lesedelen, uten has-toc', () => {
  const html = les('verktoy/dl-til-kopp');
  const ingress = html.indexOf('class="lead"');
  const skjema = html.indexOf('<form class="kalk" data-kalk="enhet"');
  const lesedel = html.indexOf('<section class="prose');
  assert.ok(ingress > -1 && skjema > -1 && lesedel > -1, 'ingress, kort og lesedel må finnes');
  assert.ok(ingress < skjema && skjema < lesedel, 'kortet skal stå mellom ingressen og lesedelen');
  assert.ok(hode(html).includes('<form class="kalk" data-kalk="enhet"'), 'kortet skal stå inne i header.locale-page-hero');
  assert.ok(hode(html).endsWith('</p>'), 'heroen slutter med det korte svaret');
  assert.equal(/<section class="prose[^"]*"/u.exec(html)[0], '<section class="prose locale-prose"');
});

test('en side med topp får ingen innholdsfortegnelse-markør', () => {
  const html = les('verktoy/proeve-topp');
  const lesedel = /<section class="prose[^"]*"/u.exec(html)[0];
  assert.equal(lesedel.includes('has-toc'), false, lesedel);
});

test('sider uten topp er som før: ingen topp i heroen, og has-toc står der', () => {
  const html = les('verktoy/proeve-topp/provemel');
  assert.equal(html.includes('class="kalk"'), false);
  assert.ok(hode(html).endsWith('</p>') || /<\/p>(<p class="author[^>]*>[\s\S]*?<\/p>)?$/u.test(hode(html)), 'heroen slutter med ingressen eller forfatterlinjen');
  assert.match(/<section class="prose[^"]*"/u.exec(html)[0], /has-toc/u);
});

// Fasit: de publiserte sidene. Etterbehandlingen (lenker, appbevis) endrer innholdet lenger ned, men ikke heroen og åpningen av lesedelen,
// så de to sammenlignes tegn for tegn, side for side. Et `topp` som endrer noe for sider uten feltet (en tom streng, en linjeskift) gir rødt.
const HERO = /<header class="locale-page-hero">[\s\S]*?<section class="prose[^"]*">/u;
function nbSider(mappe, rel = '') {
  return readdirSync(join(mappe, rel), { withFileTypes: true }).flatMap((e) => {
    if (!rel && ['node_modules', '.git', 'sv', 'da', 'en', 'qa', 'test', 'scripts', 'docs'].includes(e.name)) return [];
    const sti = join(rel, e.name);
    if (e.isDirectory()) return nbSider(mappe, sti);
    return e.name === 'index.html' ? [sti] : [];
  });
}

test('sider uten topp gir nøyaktig samme hero og lesedel-åpning som de publiserte sidene', () => {
  let sammenlignet = 0;
  let medTopp = 0;
  const avvik = [];
  for (const rel of nbSider(kopi)) {
    if (rel.startsWith('verktoy/proeve-topp')) continue;
    if (!existsSync(join(ROT, rel))) continue;
    const generert = HERO.exec(readFileSync(join(kopi, rel), 'utf8'));
    const publisert = HERO.exec(readFileSync(join(ROT, rel), 'utf8'));
    if (!generert && !publisert) continue;
    // De norske omregnerne har fått kalkulatorkortet i topp (oppgave 3); de vokter test('en norsk omregner ...') og omregner-sider.test.mjs.
    if (generert && generert[0].includes('data-kalk="enhet"')) { medTopp++; continue; }
    sammenlignet++;
    if (!generert || !publisert || generert[0] !== publisert[0]) avvik.push(rel);
  }
  assert.equal(medTopp, 203, 'de 203 norske omregnerne har kortet i topp (202 par og samlesiden)');
  assert.ok(sammenlignet >= 30, `forventet minst 30 sider å sammenligne, fant ${sammenlignet}`);
  assert.deepEqual(avvik, []);
});

test('feltet er valgfritt: ingen «undefined» i heroen på en vanlig side', () => {
  assert.equal(hode(les('oppskriftsbok-app')).includes('undefined'), false);
});

// Den engelske generatoren (guidePage i generer-lokalsider.mjs) har samme `topp`-felt. Den skriver sidene ved import, så den kalles i kopien.
function engelsk(side) {
  const kode = `const m = await import('./scripts/generer-lokalsider.mjs');
    const { RIKE } = await import('./scripts/rike-sider-register.mjs');
    const side = JSON.parse(process.env.SIDE);
    const base = side.fraRik ? { path: side.fraRik, ...RIKE.en[side.fraRik] } : side;
    process.stdout.write(m.guidePage('en', { ...base, ...(side.topp ? { topp: side.topp } : {}) }));`;
  return execFileSync(process.execPath, ['--input-type=module', '-e', kode], { cwd: kopi, env: { ...process.env, SIDE: JSON.stringify(side) }, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}
const ENGELSK = { path: 'mealime-alternative/', title: 'T', description: 'B', publisert: '2026-11-20', h1: 'H', lead: 'L', eyebrow: 'E', forst: 'F', stegTittel: 'S', steg: [['a', 'b']], alternativ: '', grense: '', seksjoner: [], faqTittel: 'Q', faq: [['Q1?', 'A1']], cta: 'C', rik: '<p>x</p>' };
const TOPP = '<form class="kalk" data-kalk="proeve"><p>Calculator</p></form>';

test('engelsk side med topp: skjemaet står mellom ingressen og lesedelen, inne i heroen, uten has-toc', () => {
  const html = engelsk({ ...ENGELSK, topp: TOPP });
  const ingress = html.indexOf('class="lead"');
  const skjema = html.indexOf('<form class="kalk"');
  const lesedel = html.indexOf('<section class="prose locale-prose');
  assert.ok(ingress > -1 && skjema > -1 && lesedel > -1, 'ingress, skjema og lesedel må finnes');
  assert.ok(ingress < skjema && skjema < lesedel);
  assert.ok(hode(html).includes('<form class="kalk"') && hode(html).endsWith(`${TOPP}`), 'topp står rett før </header>');
  assert.equal(/<section class="prose[^"]*"/u.exec(html)[0], '<section class="prose locale-prose"');
});

test('engelsk side uten topp: has-toc står der, og heroen er uten rest', () => {
  const html = engelsk(ENGELSK);
  assert.match(/<section class="prose[^"]*"/u.exec(html)[0], /has-toc/u);
  assert.equal(hode(html).includes('undefined'), false);
  assert.equal(hode(html).includes('class="kalk"'), false);
});

test('engelsk side uten topp er tegn for tegn lik den publiserte (hero og åpningen av lesedelen)', () => {
  const sti = 'pantry-app/'; // en side som fortsatt er uten topp (omregnerne får topp i oppgave 5)
  const generert = HERO.exec(engelsk({ fraRik: sti }));
  const publisert = HERO.exec(readFileSync(join(ROT, 'en', sti, 'index.html'), 'utf8'));
  assert.ok(generert && publisert, 'begge sidene har hero og lesedel');
  assert.equal(generert[0], publisert[0]);
});

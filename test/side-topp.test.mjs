// Det valgfrie feltet `topp` i side(v): HTML som står i toppen av siden, rett under ingressen.
// Generatoren skriver alle sider når den kjøres, så den kjøres bare i en kopi (aldri i arbeidskopien),
// med en prøvefamilie (test/fiksturer/familier/proeve-topp) lagt inn i en kopi av registeret.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test, { after } from 'node:test';
import { fileURLToPath } from 'node:url';
import { kopier } from '../scripts/kjedeproeve.mjs';

const ROT = fileURLToPath(new URL('..', import.meta.url));
const kopi = mkdtempSync(join(tmpdir(), 'side-topp-'));
after(() => rmSync(kopi, { recursive: true, force: true }));
kopier(ROT, kopi);
symlinkSync(join(ROT, 'node_modules'), join(kopi, 'node_modules'), 'dir');

const registerFil = join(kopi, 'scripts/familier/register.mjs');
const original = readFileSync(registerFil, 'utf8');
const TOM = 'export const FAMILIER = Object.freeze([]);';
assert.ok(original.includes(TOM), 'registeret har ikke lenger det tomme FAMILIER-uttrykket testen bytter ut');
writeFileSync(registerFil, original.replace(TOM, `export const FAMILIER = Object.freeze([{ id: 'proeve-topp', sidetype: 'omregner', mappe: new URL(${JSON.stringify(`file://${ROT}test/fiksturer/familier/proeve-topp/`)}), markeder: { nb: { rot: 'verktoy/proeve-topp/' } } }]);`));
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
  const avvik = [];
  for (const rel of nbSider(kopi)) {
    if (rel.startsWith('verktoy/proeve-topp')) continue;
    if (!existsSync(join(ROT, rel))) continue;
    const generert = HERO.exec(readFileSync(join(kopi, rel), 'utf8'));
    const publisert = HERO.exec(readFileSync(join(ROT, rel), 'utf8'));
    if (!generert && !publisert) continue;
    sammenlignet++;
    if (!generert || !publisert || generert[0] !== publisert[0]) avvik.push(rel);
  }
  assert.ok(sammenlignet >= 200, `forventet minst 200 sider å sammenligne, fant ${sammenlignet}`);
  assert.deepEqual(avvik, []);
});

test('feltet er valgfritt: ingen «undefined» i heroen på en vanlig side', () => {
  assert.equal(hode(les('verktoy/dl-til-kopp')).includes('undefined'), false);
});

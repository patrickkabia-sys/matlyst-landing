// Familieregisteret og koblingene til generatorene, målt mot fiksturen «proeve».
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { familieAntall, familieForSti, familieGrupper, familieSider } from '../scripts/familier/register.mjs';
import { FAMILIER } from '../scripts/familier/register.mjs';
import { RIKE } from '../scripts/rike-sider-register.mjs';
import { SIDEGRUPPER } from '../scripts/locale-sider.mjs';

const MAPPE = (navn) => new URL(`./fiksturer/familier/${navn}/`, import.meta.url);
const PROEVE = { id: 'proeve', sidetype: 'omregner', mappe: MAPPE('proeve'), markeder: { nb: { rot: 'verktoy/proeve/' }, en: { rot: 'tools/proeve/' } } };
const UFULLSTENDIG = { id: 'ufullstendig', sidetype: 'omregner', mappe: MAPPE('ufullstendig'), markeder: { nb: { rot: 'verktoy/ufullstendig/' } } };

test('bare kontrollerte rader blir sider, pluss samlesiden', async () => {
  const sider = await familieSider('nb', [PROEVE]);
  assert.deepEqual(Object.keys(sider).sort(), ['verktoy/proeve/', 'verktoy/proeve/provemel/', 'verktoy/proeve/provesukker/']);
});

test('samme id på to markeder gir én sidegruppe med begge språk', () => {
  const g = familieGrupper([PROEVE]).find((x) => x.id === 'auto-fam-proeve-provemel');
  assert.deepEqual(g.sider, { nb: '/verktoy/proeve/provemel/', en: '/en/tools/proeve/test-flour/' });
});

test('rad på ett marked gir gruppe med ett språk', () => {
  const g = familieGrupper([PROEVE]).find((x) => x.id === 'auto-fam-proeve-provesukker');
  assert.deepEqual(Object.keys(g.sider), ['nb']);
  const nav = familieGrupper([PROEVE]).find((x) => x.id === 'auto-fam-proeve-nav');
  assert.deepEqual(nav.sider, { nb: '/verktoy/proeve/', en: '/en/tools/proeve/' });
  // Utkastet er ingen side.
  assert.equal(familieGrupper([PROEVE]).some((x) => x.id.endsWith('provesalt')), false);
});

test('sti slås opp til familie, og nabostier gjør det ikke', () => {
  assert.equal(familieForSti('/verktoy/proeve/provemel/', [PROEVE]), 'proeve');
  assert.equal(familieForSti('/en/tools/proeve/test-flour/', [PROEVE]), 'proeve');
  assert.equal(familieForSti('/verktoy/proeve/', [PROEVE]), 'proeve');
  assert.equal(familieForSti('/verktoy/proeve-annet/', [PROEVE]), null);
  assert.equal(familieForSti('/tools/proeve/test-flour/', [PROEVE]), null);
  assert.equal(familieForSti('/verktoy/dl-til-kopp/', [PROEVE]), null);
});

test('hvert sideobjekt har feltene generatorene krever', async () => {
  for (const marked of ['nb', 'en']) {
    for (const [sti, s] of Object.entries(await familieSider(marked, [PROEVE]))) {
      for (const felt of ['title', 'description', 'eyebrow', 'h1', 'lead', 'steg', 'rik', 'faq', 'cta', 'publisert', 'schemas']) assert.ok(s[felt], `${sti}: ${felt}`);
    }
  }
});

test('en mal som gir en side uten steg stopper bygget i stedet for å bli droppet stille', async () => {
  await assert.rejects(familieSider('nb', [UFULLSTENDIG]), /ufullstendig\/nb\/nav: malen gir en side uten steg/u);
});

test('en datafil med feil familie-id avvises', async () => {
  await assert.rejects(familieSider('nb', [{ ...PROEVE, id: 'annet' }]), /datafila sier familie «proeve»/u);
});

test('antall sider per type regnes med samleside og publiserbare rader', () => {
  assert.deepEqual(familieAntall([PROEVE]), { omregner: 3 + 3, 'guide-lang': 0 });
  assert.deepEqual(familieAntall([{ ...PROEVE, sidetype: 'guide-lang' }]), { omregner: 0, 'guide-lang': 6 });
});

test('tomt register endrer ingenting', async () => {
  assert.equal(FAMILIER.length, 0);
  assert.deepEqual(await familieSider('nb'), {});
  assert.deepEqual(familieGrupper(), []);
  assert.deepEqual(familieAntall(), { omregner: 0, 'guide-lang': 0 });
  assert.equal(familieForSti('/verktoy/proeve/provemel/'), null);
});

// Markørtest på kildetekst: kommentarene strippes, og hver markør må finnes (indexOf gir -1 for manglende, og -1 er mindre enn alt).
const utenKommentarer = (kilde) => kilde.replace(/\/\*[\s\S]*?\*\//gu, '').replace(/^\s*\/\/.*$/gmu, '');
const kilde = (fil) => utenKommentarer(readFileSync(new URL(`../scripts/${fil}`, import.meta.url), 'utf8'));
const pos = (tekst, markor) => {
  const i = tekst.indexOf(markor);
  assert.ok(i > -1, `mangler: ${markor}`);
  return i;
};

test('koblingene står i de tre filene generatorene leser', () => {
  const rike = kilde('rike-sider-register.mjs');
  assert.match(rike, /\.\.\.await familieSider\('nb'\)\s*\}/u);
  for (const mk of ['sv', 'da', 'en']) pos(rike, `...await familieSider('${mk}')`);
  const grupper = kilde('locale-sider.mjs');
  assert.ok(pos(grupper, '...familieGrupper()') > pos(grupper, '...enhetsGrupper()'));
  const typer = kilde('sidetyper.mjs');
  const fam = typer.slice(pos(typer, 'export function familie('), pos(typer, 'export function erGenerertFamilie') + 1);
  assert.ok(pos(fam, 'familieForSti(') < pos(fam, 'ENHETSGRUPPE_FRA_ID'), 'familieregelen må stå foran omregnerreglene');
});

test('markørtesten kan bli rød: en kilde uten koblingen feiler pos()', () => {
  assert.throws(() => pos(utenKommentarer('// ...familieGrupper()\nexport const x = 1;'), '...familieGrupper()'), /mangler/u);
});

test('tomt register gir ingen auto-fam-grupper og ingen familiesider i RIKE', () => {
  assert.equal(SIDEGRUPPER.some((g) => g.id.startsWith('auto-fam-')), false);
  assert.equal(Object.keys(RIKE.nb).some((s) => s.includes('proeve')), false);
});

// Generatorene kopieres av mange tester til mapper uten node_modules. Med tomt register skal registeret derfor
// ikke trenge zod; først når en familie faktisk leses, skal manglende zod gi en tydelig feil.
test('registeret virker uten zod så lenge ingen familie leses, og sier fra tydelig når en leses', () => {
  const mappe = mkdtempSync(join(tmpdir(), 'familie-uten-zod-'));
  try {
    mkdirSync(join(mappe, 'familier'));
    for (const f of ['register.mjs', 'felles.mjs']) copyFileSync(new URL(`../scripts/familier/${f}`, import.meta.url), join(mappe, 'familier', f));
    const kjor = (kode) => spawnSync(process.execPath, ['--input-type=module', '-e', kode], { cwd: mappe, encoding: 'utf8' });
    const tom = kjor("const r = await import('./familier/register.mjs'); console.log(JSON.stringify([r.familieGrupper(), await r.familieSider('nb'), r.familieAntall(), r.familieForSti('/x/')]));");
    assert.equal(tom.status, 0, tom.stderr);
    assert.equal(tom.stdout.trim(), '[[],{},{"omregner":0,"guide-lang":0},null]');
    const med = kjor(`const r = await import('./familier/register.mjs'); r.familieGrupper([{ id: 'x', sidetype: 'omregner', mappe: new URL('file:///finnes-ikke/'), markeder: { nb: { rot: 'a/' } } }]);`);
    assert.notEqual(med.status, 0);
    assert.match(med.stderr, /zod/u);
  } finally {
    rmSync(mappe, { recursive: true, force: true });
  }
});

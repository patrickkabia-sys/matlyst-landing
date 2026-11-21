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

test('en tom liste endrer ingenting', async () => {
  assert.deepEqual(await familieSider('nb', []), {});
  assert.deepEqual(familieGrupper([]), []);
  assert.deepEqual(familieAntall([]), { omregner: 0, 'guide-lang': 0 });
  assert.equal(familieForSti('/verktoy/proeve/provemel/', []), null);
});

test('det ekte registeret har alle familiene, og ingen fiksturfamilier', () => {
  assert.deepEqual(FAMILIER.map((f) => f.id), ['dl-til-gram', 'kjernetemperatur', 'steketid', 'ukemeny', 'holdbarhet', 'frysing', 'mengde-per-person', 'airfryer', 'erstatning', 'rester']);
  assert.equal(familieForSti('/mengde-per-person/ris/'), 'mengde-per-person');
  assert.equal(familieForSti('/kjernetemperatur/kylling/'), 'kjernetemperatur');
  assert.equal(familieForSti('/steketid/ribbe/'), 'steketid');
  assert.equal(familieForSti('/ukemenyer/familie/'), 'ukemeny');
  assert.equal(familieForSti('/ukemeny/'), null, 'produktsiden /ukemeny/ hører ikke til familien');
  assert.equal(familieForSti('/verktoy/dl-til-gram/hvetemel/'), 'dl-til-gram');
  assert.equal(familieForSti('/holdbarhet/egg/'), 'holdbarhet');
  assert.equal(familieForSti('/frysing/egg/'), 'frysing');
  assert.equal(familieForSti('/verktoy/proeve/provemel/'), null);
  assert.equal(familieForSti('/verktoy/dl-til-kopp/'), null);
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
  for (const mk of ['nb', 'sv', 'da', 'en']) pos(rike, `...await familieSider('${mk}'`);
  const grupper = kilde('locale-sider.mjs');
  assert.ok(pos(grupper, '...familieGrupper()') > pos(grupper, '...enhetsGrupper()'));
  const typer = kilde('sidetyper.mjs');
  const fam = typer.slice(pos(typer, 'export function familie('), pos(typer, 'export function erGenerertFamilie') + 1);
  assert.ok(pos(fam, 'familieForSti(') < pos(fam, 'ENHETSGRUPPE_FRA_ID'), 'familieregelen må stå foran omregnerreglene');
});

test('markørtesten kan bli rød: en kilde uten koblingen feiler pos()', () => {
  assert.throws(() => pos(utenKommentarer('// ...familieGrupper()\nexport const x = 1;'), '...familieGrupper()'), /mangler/u);
});

test('registeret gir auto-fam-grupper og RIKE-sider for dl til gram, og ingenting for fiksturfamilier', () => {
  assert.ok(SIDEGRUPPER.some((g) => g.id === 'auto-fam-dl-til-gram-nav'));
  assert.equal(SIDEGRUPPER.some((g) => g.id.startsWith('auto-fam-proeve')), false);
  assert.ok(Object.hasOwn(RIKE.nb, 'verktoy/dl-til-gram/'));
  assert.ok(Object.hasOwn(RIKE.nb, 'verktoy/dl-til-gram/hvetemel/'));
  assert.equal(Object.keys(RIKE.nb).some((s) => s.includes('proeve')), false);
  // De andre språkene har samme familie under egne roter: «dl til gram» på nb, «dl till gram» på sv, «dl til gram» på da og «cups to grams» på en.
  for (const [mk, rot] of [['sv', 'verktyg/dl-till-gram/'], ['da', 'vaerktoejer/dl-til-gram/'], ['en', 'tools/cups-to-grams/']]) {
    assert.ok(Object.hasOwn(RIKE[mk], rot), `${mk}: samleside`);
    assert.equal(Object.keys(RIKE[mk]).some((s) => s.includes('proeve')), false, mk);
  }
  assert.ok(Object.hasOwn(RIKE.sv, 'verktyg/dl-till-gram/vetemjol/'));
  assert.ok(Object.hasOwn(RIKE.da, 'vaerktoejer/dl-til-gram/hvedemel/'));
});

// Registeret skal ikke trenge zod så lenge ingen familie leses; først når en familie faktisk leses, skal manglende zod gi en tydelig feil.
// (Kopier av generatorene lenkes til node_modules, se kopier i scripts/kjedeproeve.mjs, fordi det ekte registeret har en familie.)
test('registeret virker uten zod så lenge ingen familie leses, og sier fra tydelig når en leses', () => {
  const mappe = mkdtempSync(join(tmpdir(), 'familie-uten-zod-'));
  try {
    mkdirSync(join(mappe, 'familier'));
    for (const f of ['register.mjs', 'felles.mjs']) copyFileSync(new URL(`../scripts/familier/${f}`, import.meta.url), join(mappe, 'familier', f));
    const kjor = (kode) => spawnSync(process.execPath, ['--input-type=module', '-e', kode], { cwd: mappe, encoding: 'utf8' });
    const tom = kjor("const r = await import('./familier/register.mjs'); console.log(JSON.stringify([r.familieGrupper([]), await r.familieSider('nb', []), r.familieAntall([]), r.familieForSti('/x/', [])]));");
    assert.equal(tom.status, 0, tom.stderr);
    assert.equal(tom.stdout.trim(), '[[],{},{"omregner":0,"guide-lang":0},null]');
    const med = kjor(`const r = await import('./familier/register.mjs'); r.familieGrupper([{ id: 'x', sidetype: 'omregner', mappe: new URL('file:///finnes-ikke/'), markeder: { nb: { rot: 'a/' } } }]);`);
    assert.notEqual(med.status, 0);
    assert.match(med.stderr, /zod/u);
  } finally {
    rmSync(mappe, { recursive: true, force: true });
  }
});

// Retterunde: rot og id valideres, og kollisjoner kaster med begge navngitt.
const fam = (navn, markeder, id = navn) => ({ id, sidetype: 'omregner', mappe: MAPPE(navn), markeder });
const ALLE = (f, marked = 'nb') => [
  () => familieSider(marked, [f]), () => familieGrupper([f]), () => familieForSti('/x/', [f]), () => familieAntall([f]),
];
const kaster = async (f, monster) => {
  for (const kall of ALLE(f)) await assert.rejects(async () => kall(), monster);
};

test('rot må ha formen a/b/ (små bokstaver, tall og bindestrek, slutter på skråstrek), ellers kaster alt', async () => {
  for (const rot of ['../x/', '/verktoy/proeve/', 'Verktoy/proeve/', 'verktoy//proeve/', 'verktoy/proeve', 'verktoy/./proeve/', 'verktoy/proeve/../', '', 'verk toy/', 'verktoy\\proeve/']) {
    await kaster({ ...PROEVE, markeder: { nb: { rot } } }, /rot/u);
  }
  for (const rot of ['verktoy/proeve/', 'a/', 'a-b/c-d/e1/']) assert.doesNotThrow(() => familieForSti('/x/', [{ ...PROEVE, markeder: { nb: { rot } } }]));
});

test('id og marked valideres på samme måte', async () => {
  for (const id of ['Proeve', 'a/b', '', '../proeve', 'proeve ']) await kaster({ ...PROEVE, id }, /id/u);
  await kaster({ ...PROEVE, markeder: { fr: { rot: 'verktoy/proeve/' } } }, /marked/u);
  await kaster({ ...PROEVE, sidetype: 'blogg' }, /sidetype/u);
});

test('en familieside som får samme sti som en side i RIKE kaster med begge navngitt', async () => {
  const kollisjon = fam('kollisjon', { nb: { rot: 'verktoy/' } });
  const basis = { 'verktoy/dl-til-kopp/': { title: 'Håndskrevet' } };
  await assert.rejects(familieSider('nb', [kollisjon], basis), /verktoy\/dl-til-kopp\/.*kollisjon.*RIKE\.nb|RIKE\.nb.*kollisjon.*verktoy\/dl-til-kopp\//u);
  // Uten kollisjon i basen går det fint.
  await assert.doesNotReject(familieSider('nb', [kollisjon], { 'verktoy/noe-annet/': {} }));
});

test('kollisjonen mot ekte RIKE fanges: verktoy/ med slug dl-til-kopp', async () => {
  const { RIKE } = await import('../scripts/rike-sider-register.mjs');
  assert.ok(RIKE.nb['verktoy/dl-til-kopp/'], 'forutsetning: siden finnes i RIKE');
  await assert.rejects(familieSider('nb', [fam('kollisjon', { nb: { rot: 'verktoy/' } })], RIKE.nb), /verktoy\/dl-til-kopp\//u);
});

test('to familier som gir samme sti kaster, med begge familiene navngitt', async () => {
  const a = PROEVE;
  const b = fam('proeve-lik', { nb: { rot: 'verktoy/proeve/' } });
  await assert.rejects(familieSider('nb', [a, b]), /\/verktoy\/proeve\/.*«proeve».*«proeve-lik»/u);
  assert.throws(() => familieGrupper([a, b]), /proeve.*proeve-lik/u);
});

test('en families rot under en annens kaster, begge veier, med begge røttene navngitt', async () => {
  const a = fam('proeve', { nb: { rot: 'verktoy/proeve/' } });
  const under = fam('proeve-under', { nb: { rot: 'verktoy/proeve/under/' } });
  for (const par of [[a, under], [under, a]]) {
    await assert.rejects(familieSider('nb', par), /verktoy\/proeve\/under\/.*verktoy\/proeve\/|verktoy\/proeve\/.*verktoy\/proeve\/under\//u);
    assert.throws(() => familieGrupper(par), /rot/u);
  }
  // Søsken med felles prefiks i navnet er ikke nøstet.
  assert.doesNotThrow(() => familieGrupper([a, fam('proeve-under', { nb: { rot: 'verktoy/proeve-under/' } })]));
});

test('kollisjonsvakten er koblet inn i rike-sider-register', () => {
  const rike = kilde('rike-sider-register.mjs');
  for (const [mk, basis] of [['en', 'en'], ['nb', '{ ...nb, ...nbEnh }'], ['sv', '{ ...sv, ...svEnh }'], ['da', '{ ...da, ...daEnh }']]) pos(rike, `await familieSider('${mk}', undefined, ${basis})`);
});

test('samme sti i to sidegrupper stopper bygget, med stien og begge gruppe-id-ene', async () => {
  const { byggStiOppslag } = await import('../scripts/locale-sider.mjs');
  // Dagens grupper har ingen duplikater.
  assert.doesNotThrow(() => byggStiOppslag(SIDEGRUPPER));
  // En familie med rot lik en håndskrevet side utenfor RIKE.
  const lik = fam('proeve-lik', { nb: { rot: 'julemiddag/' } });
  assert.throws(() => byggStiOppslag([...SIDEGRUPPER, ...familieGrupper([lik])]), /\/julemiddag\/.*auto-julemiddag.*auto-fam-proeve-lik-nav|\/julemiddag\/.*auto-fam-proeve-lik-nav.*auto-julemiddag/u);
  // Gjelder alle grupper, ikke bare familier.
  assert.throws(() => byggStiOppslag([{ id: 'a', sider: { nb: '/x/' } }, { id: 'b', sider: { en: '/x/' } }]), /\/x\/.*«a».*«b»/u);
});

// Vaktene for alle sidefamilier. Del 1: hver vakt kan bli rød. Del 2: familiene i registeret består vaktene.
import assert from 'node:assert/strict';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { lesData, publiserbare } from '../scripts/familier/felles.mjs';
import { FAMILIER, SPRAKMAPPE } from '../scripts/familier/register.mjs';
import { dupliserte, forLike, kontrollerFamilier, sideMotData, synligTekst, tallUtenforData } from './hjelp/familievakt.mjs';

const ROT = fileURLToPath(new URL('..', import.meta.url));
const FIKS = new URL('./fiksturer/familier/', import.meta.url);
const rodSide = (navn) => JSON.parse(readFileSync(new URL(`rode-sider/${navn}.json`, FIKS), 'utf8'));
const familieFor = (navn, markeder) => ({ id: navn, sidetype: 'omregner', mappe: new URL(`${navn}/`, FIKS), markeder });
const PROEVE = familieFor('proeve', { nb: { rot: 'verktoy/proeve/' }, en: { rot: 'tools/proeve/' } });
const PROEVE_ROD = familieFor('proeve-rod', { nb: { rot: 'verktoy/proeverod/' } });

// Skriver en tom side for samlesiden og hver publiserbare rad, slik generatorene ville gjort.
function skrivSider(rotmappe, familie) {
  for (const [marked, { rot }] of Object.entries(familie.markeder)) {
    const slugs = ['', ...publiserbare(lesData(fileURLToPath(familie.mappe), marked)).map((r) => `${r.slug}/`)];
    for (const slug of slugs) {
      const fil = join(rotmappe, SPRAKMAPPE[marked], rot, slug, 'index.html');
      mkdirSync(dirname(fil), { recursive: true });
      writeFileSync(fil, '<html></html>');
    }
  }
}
async function medMappe(f) {
  const mappe = mkdtempSync(join(tmpdir(), 'familievakt-'));
  try { return await f(mappe); } finally { rmSync(mappe, { recursive: true, force: true }); }
}

test.describe('Vaktene kan bli røde', () => {
  test('tallUtenforData: 137 felles, tillatte tall og tusenskille slipper gjennom', () => {
    assert.deepEqual(tallUtenforData(rodSide('tall-utenfor-data'), new Set(['55'])), ['137']);
    const gronn = { lead: 'Én dl veier 55 g.', rik: '<p>Se 1 200 g, eller 0,5 kg.</p><script>var x = 999;</script><style>a{top:7px}</style>', steg: [], faq: [] };
    assert.deepEqual(tallUtenforData(gronn, new Set(['55', '0,5'])), ['1200']);
    assert.deepEqual(tallUtenforData(gronn, new Set(['55', '1200', '0,5'])), []);
    assert.equal(synligTekst(gronn).includes('999'), false);
  });

  test('forLike: tre sider der bare varenavnet er byttet ut felles, egne tekster slipper gjennom', () => {
    const felt = forLike(rodSide('for-like'));
    assert.deepEqual(felt.map((r) => r.sti), ['/verktoy/proeve/mel/', '/verktoy/proeve/sukker/', '/verktoy/proeve/salt/']);
    for (const r of felt) assert.ok(r.unik < 0.2, String(r.unik));
    const egne = rodSide('for-like').map((s, i) => ({ ...s, tekst: `${s.tekst} ${['Mel er tørt og støver når du heller det i begeret.', 'Sukker er grovt og renner raskt ned i begeret uten å pakke seg.', 'Salt trekker fuktighet fra lufta og klumper seg i fuktig vær.'][i]} Hvert sted trenger sin egen måte å måle på, og derfor har vi skrevet en egen forklaring til ${['første', 'andre', 'tredje'][i]} vare, med egne ord og egne eksempler fra kjøkkenet.` }));
    assert.deepEqual(forLike(egne, 0.2).map((r) => r.sti), []);
    // Én side alene har ingen å ligne på, men en tom side har ingenting eget.
    assert.deepEqual(forLike([{ sti: '/a/', tekst: 'Dette er en tekst med nok ord til å lage ordfemmere.' }]), []);
    assert.deepEqual(forLike([{ sti: '/tom/', tekst: '' }]).map((r) => r.sti), ['/tom/']);
  });

  test('dupliserte: to sider med lik tittel felles, ulike slipper gjennom', () => {
    assert.deepEqual(dupliserte(rodSide('lik-tittel'), 'title'), [['/a/', '/b/']]);
    assert.deepEqual(dupliserte(rodSide('lik-tittel'), 'h1'), []);
    assert.deepEqual(dupliserte(rodSide('lik-tittel'), 'description'), []);
  });

  test('restord: norsk ord i synlig engelsk tekst felles', async () => {
    const { NORSKE_RESTORD } = await import('./hjelp/restord.mjs');
    assert.equal(NORSKE_RESTORD.test(synligTekst(rodSide('restord-en'))), true);
    assert.equal(NORSKE_RESTORD.test(synligTekst({ lead: 'Save every recipe in one place.', rik: '', steg: [], faq: [] })), false);
  });

  test('sideMotData: rad uten fil, utkast med fil og fremmed fil under familierota felles', () => medMappe((mappe) => {
    skrivSider(mappe, PROEVE);
    assert.deepEqual(sideMotData(PROEVE, mappe), { manglerFil: [], manglerRad: [] });
    // Rad uten fil.
    rmSync(join(mappe, 'verktoy/proeve/provesukker/index.html'));
    assert.deepEqual(sideMotData(PROEVE, mappe).manglerFil, ['verktoy/proeve/provesukker/index.html']);
    // Fremmed, håndskrevet fil under rota (ligger under en egen mappe og rett i rota), og fil for et utkast.
    for (const rel of ['verktoy/proeve/handskrevet/index.html', 'en/tools/proeve/annet.html', 'verktoy/proeve/provesalt/index.html']) {
      mkdirSync(dirname(join(mappe, rel)), { recursive: true });
      writeFileSync(join(mappe, rel), '<html>håndskrevet</html>');
    }
    assert.deepEqual(sideMotData(PROEVE, mappe).manglerRad, ['en/tools/proeve/annet.html', 'verktoy/proeve/handskrevet/index.html', 'verktoy/proeve/provesalt/index.html']);
  }));

  test('en fremmed index.html under fiksturfamiliens rot felles av hele kjeden og navngis', async () => {
    await medMappe(async (mappe) => {
      skrivSider(mappe, PROEVE);
      assert.deepEqual((await kontrollerFamilier([PROEVE], mappe)).feil, []);
      mkdirSync(join(mappe, 'en/tools/proeve/fremmed'), { recursive: true });
      writeFileSync(join(mappe, 'en/tools/proeve/fremmed/index.html'), '<html>fra en annen kilde</html>');
      const { feil } = await kontrollerFamilier([PROEVE], mappe);
      assert.deepEqual(feil, ['proeve/en: fil uten rad: en/tools/proeve/fremmed/index.html']);
    });
  });

  test('hele kjeden felles den røde fiksturfamilien på tall, likhet og tittel', async () => {
    await medMappe(async (mappe) => {
      skrivSider(mappe, PROEVE_ROD);
      const { feil } = await kontrollerFamilier([PROEVE_ROD], mappe);
      const tekst = feil.join('\n');
      assert.match(tekst, /tall utenfor data på verktoy\/proeverod\/provemel\/: 137/u);
      assert.match(tekst, /for lik de andre sidene/u);
      assert.match(tekst, /lik title på/u);
      assert.match(tekst, /lik description på/u);
      assert.doesNotMatch(tekst, /lik h1 på/u);
    });
  });
});

test.describe('Familiene i registeret', () => {
  test('hver familie består alle vaktene', async () => {
    const { feil } = await kontrollerFamilier(FAMILIER, ROT);
    assert.deepEqual(feil, []);
  });

  test('del 2 kjører faktisk når fiksturen gis som register (grønn fordi alt er sjekket, ikke fordi alt er hoppet over)', async () => {
    await medMappe(async (mappe) => {
      skrivSider(mappe, PROEVE);
      const { feil, kontrollert } = await kontrollerFamilier([PROEVE], mappe);
      assert.deepEqual(feil, []);
      assert.equal(kontrollert, 6, 'tre sider på nb og tre på en');
    });
  });

  test('en norsk tekst i en engelsk fikstur gir restordfeil gjennom hele kjeden', async () => {
    await medMappe(async (mappe) => {
      const tmp = join(mappe, 'fam');
      for (const f of ['data.en.json', 'mal-en.mjs']) { mkdirSync(tmp, { recursive: true }); copyFileSync(new URL(`proeve/${f}`, FIKS), join(tmp, f)); }
      const d = JSON.parse(readFileSync(join(tmp, 'data.en.json'), 'utf8'));
      d.rader[0].tekst.beskrivelse = 'Save every oppskrift in one place, with enough other words to keep this page unique from the rest of its family here.';
      writeFileSync(join(tmp, 'data.en.json'), JSON.stringify(d));
      // Malen importerer skjema.mjs med relativ sti, så den ligger i fiksturmappa; kopien peker dit.
      writeFileSync(join(tmp, 'mal-en.mjs'), readFileSync(join(tmp, 'mal-en.mjs'), 'utf8').replace("'../../../../scripts/", `'${ROT}scripts/`));
      const fam = { id: 'proeve', sidetype: 'omregner', mappe: new URL(`file://${tmp}/`), markeder: { en: { rot: 'tools/proeve/' } } };
      skrivSider(mappe, fam);
      const { feil } = await kontrollerFamilier([fam], mappe);
      assert.deepEqual(feil.filter((f) => f.includes('restord')), ['proeve/en: norsk restord på tools/proeve/test-flour/']);
    });
  });
});

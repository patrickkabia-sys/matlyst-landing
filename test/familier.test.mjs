// Vaktene for alle sidefamilier. Del 1: hver vakt kan bli rød. Del 2: familiene i registeret består vaktene.
import assert from 'node:assert/strict';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { lesData, publiserbare } from '../scripts/familier/felles.mjs';
import { FAMILIER, SPRAKMAPPE, familieSider } from '../scripts/familier/register.mjs';
import { antallFeil, dupliserte, forLike, kontrollerFamilier, sideMotData, synligTekst, tallUtenforData } from './hjelp/familievakt.mjs';

const ROT = fileURLToPath(new URL('..', import.meta.url));
const FIKS = new URL('./fiksturer/familier/', import.meta.url);
const rodSide = (navn) => JSON.parse(readFileSync(new URL(`rode-sider/${navn}.json`, FIKS), 'utf8'));
const familieFor = (navn, markeder) => ({ id: navn, sidetype: 'omregner', mappe: new URL(`${navn}/`, FIKS), markeder });
const PROEVE = familieFor('proeve', { nb: { rot: 'verktoy/proeve/' }, en: { rot: 'tools/proeve/' } });
const PROEVE_ROD = familieFor('proeve-rod', { nb: { rot: 'verktoy/proeverod/' } });

const esc = (t) => String(t).replace(/&/gu, '&amp;').replace(/</gu, '&lt;').replace(/>/gu, '&gt;').replace(/"/gu, '&quot;');
// Skriver en fil for samlesiden og hver publiserbare rad, med sidens title, h1 og lead slik generatorene ville gjort.
async function skrivSider(rotmappe, familie) {
  for (const [marked, { rot }] of Object.entries(familie.markeder)) {
    const sider = await familieSider(marked, [{ ...familie, markeder: { [marked]: { rot } } }]);
    for (const [nokkel, side] of Object.entries(sider)) {
      const fil = join(rotmappe, SPRAKMAPPE[marked], nokkel, 'index.html');
      mkdirSync(dirname(fil), { recursive: true });
      writeFileSync(fil, `<html><head><title>${esc(side.title)} | Matlyst</title></head><body><h1>${side.h1}</h1><p>${side.lead}</p></body></html>`);
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

  test('sideMotData: rad uten fil, utkast med fil og fremmed fil under familierota felles', () => medMappe(async (mappe) => {
    await skrivSider(mappe, PROEVE);
    assert.deepEqual(sideMotData(PROEVE, mappe), { manglerFil: [], manglerRad: [], symlenker: [] });
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
      await skrivSider(mappe, PROEVE);
      assert.deepEqual((await kontrollerFamilier([PROEVE], mappe)).feil, []);
      mkdirSync(join(mappe, 'en/tools/proeve/fremmed'), { recursive: true });
      writeFileSync(join(mappe, 'en/tools/proeve/fremmed/index.html'), '<html>fra en annen kilde</html>');
      const { feil } = await kontrollerFamilier([PROEVE], mappe);
      assert.deepEqual(feil, ['proeve/en: fil uten rad: en/tools/proeve/fremmed/index.html']);
    });
  });

  test('hele kjeden felles den røde fiksturfamilien på tall, likhet og tittel', async () => {
    await medMappe(async (mappe) => {
      await skrivSider(mappe, PROEVE_ROD);
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

test.describe('Tallvakten: tall deles ikke feil og synlige tall utelates ikke', () => {
  const lead = (tekst) => ({ lead: tekst, rik: '', steg: [], faq: [] });
  test('tusenskille (vanlig og hardt mellomrom) er ett tall som sammenlignes uten mellomrom', () => {
    for (const mellomrom of [' ', '\u00a0', '\u202f']) {
      const side = lead(`Du trenger 1${mellomrom}200 g mel.`);
      assert.deepEqual(tallUtenforData(side, new Set(['1', '200'])), ['1200'], JSON.stringify(mellomrom));
      assert.deepEqual(tallUtenforData(side, new Set(['1200'])), []);
      assert.deepEqual(tallUtenforData(side, new Set(['1 200'])), []);
    }
    assert.deepEqual(tallUtenforData(lead('Opptil 1 200,5 g.'), new Set(['1200,5'])), []);
  });
  test('brøk med skråstrek er ett symbol, og brøktegn er symboler som må være tillatt', () => {
    assert.deepEqual(tallUtenforData(lead('Bruk 1/2 kopp.'), new Set(['1', '2'])), ['1/2']);
    assert.deepEqual(tallUtenforData(lead('Bruk 1/2 kopp.'), new Set(['1/2'])), []);
    for (const tegn of ['½', '⅓', '⅔', '¼', '¾', '⅛', '⅜', '⅝', '⅞']) {
      assert.deepEqual(tallUtenforData(lead(`Bruk ${tegn} kopp.`), new Set(['1', '2'])), [tegn], tegn);
      assert.deepEqual(tallUtenforData(lead(`Bruk ${tegn} kopp.`), new Set([tegn])), [], tegn);
    }
    assert.deepEqual(tallUtenforData(lead('Bruk 1½ kopp.'), new Set(['1'])), ['½']);
  });
  test('tittel, beskrivelse, H1, overskrift, knapp og topp kontrolleres også', () => {
    for (const felt of ['title', 'description', 'h1', 'eyebrow', 'cta', 'topp']) {
      assert.deepEqual(tallUtenforData({ [felt]: '137 gram', lead: '', rik: '', steg: [], faq: [] }, new Set()), ['137'], felt);
    }
  });
  test('attributter leseren ser eller som styrer det leseren ser, og JSON-data, kontrolleres', () => {
    const rik = (html) => ({ lead: '', rik: html, steg: [], faq: [] });
    for (const html of [
      '<input value="137">', '<input placeholder=\'137\'>', '<button aria-label="137 g">x</button>', '<a title="137">x</a>',
      '<img alt="137 gram" src="/x.png">', '<meta content="137">', '<div data-v="137"></div>', '<div data-kalk-faktor="137"></div>',
      '<script type="application/json">{"faktor":137}</script>', "<script type='application/json' id='k'>[137]</script>",
    ]) assert.deepEqual(tallUtenforData(rik(html), new Set()), ['137'], html);
    for (const html of [
      '<script type="application/ld+json">{"x":137}</script>', '<style>a{top:137px}</style>', '<script>var x = 137;</script>', '<div class="b137"></div>',
    ]) assert.deepEqual(tallUtenforData(rik(html), new Set()), [], html);
  });
});

test.describe('Likhetsvakten: skjult tekst gir ikke unikt innhold', () => {
  test('tre nesten like sider med 30 støyord i skjult tekst felles fortsatt', () => {
    const felt = forLike(rodSide('for-like-skjult'));
    assert.equal(felt.length, 3);
  });
  test('støy i attributter og skript gir heller ikke unikt innhold', () => {
    const basis = rodSide('for-like-skjult')[0].tekst.replace(/<span hidden>[\s\S]*<\/span>/u, '');
    const sider = [0, 1, 2].map((i) => ({ sti: `/${i}/`, tekst: `${basis}<div data-x="${Array.from({ length: 30 }, (_, j) => `a${i}x${j}`).join(' ')}"></div><script>var s = "${Array.from({ length: 30 }, (_, j) => `b${i}x${j}`).join(' ')}";</script>` }));
    assert.equal(forLike(sider).length, 3);
  });
  test('alle måter å skjule på regnes som skjult, og synlig tekst regnes som unik', () => {
    const basis = rodSide('for-like-skjult')[0].tekst.replace(/<span hidden>[\s\S]*<\/span>/u, '');
    const stoy = (i) => Array.from({ length: 30 }, (_, j) => `ord${i}x${j}`).join(' ');
    for (const skjul of ['<span hidden>', '<div aria-hidden="true">', '<p style="color:red; display : none">', '<p style="visibility:hidden">', '<div class="a skjult b">']) {
      const navn = skjul.match(/<(\w+)/u)[1];
      const sider = [0, 1, 2].map((i) => ({ sti: `/${i}/`, tekst: `${basis}${skjul}${stoy(i)}<${navn}>dypt</${navn}></${navn}>` }));
      assert.equal(forLike(sider).length, 3, skjul);
    }
    const synlige = [0, 1, 2].map((i) => ({ sti: `/${i}/`, tekst: `${basis}<span>${Array.from({ length: 30 }, (_, j) => `ord${i}x${j}`).join(' ')}</span>` }));
    assert.equal(forLike(synlige).length, 0);
  });
});

test.describe('Filvakten: symlenker, tomme familier og filene på disk', () => {
  test('symlenker under familierota (fil, mappe og samleside) navngis, aldri godkjent som side', () => medMappe(async (mappe) => {
    await skrivSider(mappe, PROEVE);
    const utenfor = join(mappe, 'utenfor.html');
    writeFileSync(utenfor, '<html>utenfor</html>');
    mkdirSync(join(mappe, 'utenfor-mappe'));
    symlinkSync(utenfor, join(mappe, 'verktoy/proeve/lenke.html'));
    symlinkSync(join(mappe, 'utenfor-mappe'), join(mappe, 'en/tools/proeve/mappe'));
    rmSync(join(mappe, 'verktoy/proeve/provemel/index.html'));
    symlinkSync(utenfor, join(mappe, 'verktoy/proeve/provemel/index.html'));
    const m = sideMotData(PROEVE, mappe);
    assert.deepEqual(m.symlenker, ['en/tools/proeve/mappe', 'verktoy/proeve/lenke.html', 'verktoy/proeve/provemel/index.html']);
    const { feil } = await kontrollerFamilier([PROEVE], mappe);
    for (const f of m.symlenker) assert.ok(feil.some((x) => x.includes(`symlenke: ${f}`)), f);
  }));

  test('en symlenke i selve familierota (mappa) feller også', () => medMappe(async (mappe) => {
    mkdirSync(join(mappe, 'annen'), { recursive: true });
    mkdirSync(join(mappe, 'verktoy'), { recursive: true });
    symlinkSync(join(mappe, 'annen'), join(mappe, 'verktoy/proeve'));
    const m = sideMotData(familieFor('proeve', { nb: { rot: 'verktoy/proeve/' } }), mappe);
    assert.deepEqual(m.symlenker, ['verktoy/proeve']);
  }));

  test('en familie uten markeder gir feil, og antall kontrollerte sider sammenlignes med forventet', () => medMappe(async (mappe) => {
    const tom = await kontrollerFamilier([familieFor('proeve', {})], mappe);
    assert.deepEqual(tom.feil, ['proeve: familien har ingen markeder']);
    assert.deepEqual([tom.kontrollert, tom.forventet], [0, 0]);
    await skrivSider(mappe, PROEVE);
    const ok = await kontrollerFamilier([PROEVE], mappe);
    assert.deepEqual([ok.kontrollert, ok.forventet], [6, 6]);
  }));

  test('færre kontrollerte sider enn forventet gir feil', () => {
    assert.deepEqual(antallFeil(5, 6), ['kontrollerte 5 av 6 sider som skal finnes']);
    assert.deepEqual(antallFeil(6, 6), []);
  });

  test('filen på disk må inneholde sidens title, h1 og lead; en fil med annen HTML felles', () => medMappe(async (mappe) => {
    await skrivSider(mappe, PROEVE);
    assert.deepEqual((await kontrollerFamilier([PROEVE], mappe)).feil, []);
    writeFileSync(join(mappe, 'verktoy/proeve/provemel/index.html'), '<html><title>Noe helt annet</title><h1>Annet</h1></html>');
    const { feil } = await kontrollerFamilier([PROEVE], mappe);
    assert.deepEqual(feil, ['proeve/nb: filen verktoy/proeve/provemel/index.html mangler title, h1, lead fra malen']);
  }));

});

test.describe('Familiene i registeret', () => {
  test('hver familie består alle vaktene', async () => {
    const { feil, kontrollert, forventet } = await kontrollerFamilier(FAMILIER, ROT);
    assert.deepEqual(feil, []);
    assert.equal(kontrollert, forventet, 'vaktene må ha sett hver side som skal finnes');
  });

  test('del 2 kjører faktisk når fiksturen gis som register (grønn fordi alt er sjekket, ikke fordi alt er hoppet over)', async () => {
    await medMappe(async (mappe) => {
      await skrivSider(mappe, PROEVE);
      const { feil, kontrollert, forventet } = await kontrollerFamilier([PROEVE], mappe);
      assert.deepEqual(feil, []);
      assert.equal(kontrollert, 6, 'tre sider på nb og tre på en');
      assert.equal(forventet, 6);
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
      await skrivSider(mappe, fam);
      const { feil } = await kontrollerFamilier([fam], mappe);
      assert.deepEqual(feil.filter((f) => f.includes('restord')), ['proeve/en: norsk restord på tools/proeve/test-flour/']);
    });
  });
});

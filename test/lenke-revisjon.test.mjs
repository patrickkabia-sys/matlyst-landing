import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { kjorCli, normaliserLenke, revider } from '../scripts/lenke-revisjon.mjs';

function fixture(t, filer) {
  const rot = mkdtempSync(join(tmpdir(), 'matlyst-lenker-'));
  t.after(() => rmSync(rot, { recursive: true, force: true }));
  for (const [sti, innhold] of Object.entries(filer)) {
    const fil = join(rot, sti);
    mkdirSync(dirname(fil), { recursive: true });
    writeFileSync(fil, innhold);
  }
  return rot;
}

const lenke = (sti, tekst = 'Oppskrifter') => `<a href="${sti}">${tekst}</a>`;
const kart = { en: { hubber: { lagre: { hub: '/en/hub/', eiker: ['/en/eike/'], planlagt: ['/en/senere/'] } } } };

test('en side uten innkommende brødtekstlenker er foreldreløs', (t) => {
  const rot = fixture(t, { 'en/a/index.html': lenke('/en/b/'), 'en/b/index.html': '<p>Mat</p>' });
  const rapport = revider({ rot }).sprak.en;
  assert.deepEqual(rapport.foreldrelose, ['/en/a/']);
  assert.equal(rapport.sider.find((side) => side.sti === '/en/b/').innkommendeBrodtekst, 1);
});

test('to unike kildesider gir under tre, mens tre er tilstrekkelig', (t) => {
  const rot = fixture(t, {
    'en/a/index.html': lenke('/en/mal/') + lenke('/en/mal/') + lenke('/en/tre/'),
    'en/b/index.html': lenke('/en/mal/') + lenke('/en/tre/'),
    'en/c/index.html': lenke('/en/tre/'),
    'en/mal/index.html': lenke('#innhold'),
    'en/tre/index.html': '',
  });
  const rapport = revider({ rot }).sprak.en;
  assert.equal(rapport.sider.find((side) => side.sti === '/en/mal/').innkommendeBrodtekst, 2);
  assert.ok(rapport.underTre.includes('/en/mal/'));
  assert.ok(!rapport.foreldrelose.includes('/en/mal/'));
  assert.ok(!rapport.underTre.includes('/en/tre/'));
});

test('ødelagte interne lenker krever en fil, også i navigasjonen', (t) => {
  const rot = fixture(t, {
    'en/index.html': lenke('/en/borte/') + '<nav>' + lenke('/en/tom/') + '</nav>'
      + lenke('/en/skjult/') + lenke('/bilder/mat.png') + lenke('https://eksempel.no/borte/'),
    'en/tom/annet.txt': '',
    'en/skjult/index.html': '<meta name="robots" content="noindex">',
    'bilder/mat.png': 'bilde',
  });
  const rapport = revider({ rot }).sprak.en;
  assert.deepEqual(rapport.odelagte.map(({ til }) => til), ['/en/borte/', '/en/tom/']);
});

test('nav, header og footer teller ikke som innkommende brødtekst', (t) => {
  const rot = fixture(t, {
    'en/a/index.html': `<header>${lenke('/en/mal/')}</header><nav><div>${lenke('/en/mal/')}</div></nav>`
      + `<footer><nav>${lenke('/en/mal/')}</nav>${lenke('/en/mal/')}</footer>`
      + `<div role="navigation">${lenke('/en/mal/')}</div><main>${lenke('/en/annen/')}</main>`,
    'en/mal/index.html': '',
    'en/annen/index.html': '',
  });
  const rapport = revider({ rot }).sprak.en;
  assert.ok(rapport.foreldrelose.includes('/en/mal/'));
  assert.ok(!rapport.foreldrelose.includes('/en/annen/'));
  const side = rapport.sider.find(({ sti }) => sti === '/en/a/');
  assert.equal(side.utgaende, 6);
  assert.equal(side.utgaendeBrodtekst, 1);
});

test('read more og øvrige svake eller tomme ankre flagges', (t) => {
  const tekster = ['klikk her', 'les mer', 'her', 'more', '<b>READ</b>&nbsp; more', 'click here', '  '];
  const rot = fixture(t, {
    'en/index.html': tekster.map((tekst) => lenke('/en/mal/', tekst)).join('')
      + lenke('/en/mal/', '<img src="mat.png" alt="Middagstips">')
      + lenke('/en/mal/', 'Les mer om middag'),
    'en/mal/index.html': '',
  });
  const svake = revider({ rot }).sprak.en.svakeAnkere;
  assert.equal(svake.length, 7);
  assert.ok(svake.some(({ tekst }) => tekst === 'READ more'));
  assert.ok(svake.some(({ tekst }) => tekst === ''));
});

test('noindex hoppes over som kilde og mål i sideoversikten', (t) => {
  const rot = fixture(t, {
    'en/a/index.html': '<META CONTENT="NOINDEX, follow" NAME=robots>' + lenke('/en/mal/'),
    'en/b/index.html': "<meta content='noindex' name='bingbot'>",
    'en/mal/index.html': '<!-- <meta name="robots" content="noindex"> --><p>noindex er bare tekst</p>',
  });
  const rapport = revider({ rot }).sprak.en;
  assert.deepEqual(rapport.sider.map(({ sti }) => sti), ['/en/mal/']);
  assert.deepEqual(rapport.foreldrelose, ['/en/mal/']);
});

test('utelatte mapper leses ikke som sider', (t) => {
  const mapper = ['node_modules', '.git', 'test', 'seo-data', 'seo-motor', 'scripts', 'docs', 'design', 'blogg-kilde', 'test-results'];
  const rot = fixture(t, Object.fromEntries([
    ['index.html', '<p>Mat</p>'],
    ...mapper.map((mappe) => [`${mappe}/index.html`, lenke('/')]),
  ]));
  assert.deepEqual(revider({ rot }).sprak.nb.sider.map(({ sti }) => sti), ['/']);
  assert.deepEqual(revider({ rot }).sprak.nb.foreldrelose, ['/']);
});

test('absolutte og relative lenker normaliseres likt', (t) => {
  const rot = fixture(t, { 'en/mal/index.html': '', 'vilkar.html': '' });
  for (const href of ['https://matlyst-app.no/en/mal/', '../mal/', '/en/mal', '//matlyst-app.no/en/mal/index.html']) {
    assert.equal(normaliserLenke(href, '/en/kilde/', rot), '/en/mal/', href);
  }
  assert.equal(normaliserLenke('/vilkar', '/en/', rot), '/vilkar.html');
  assert.equal(normaliserLenke('../vilkar.html', '/en/', rot), '/vilkar.html');
  for (const href of ['https://eksempel.no/en/', 'mailto:hei@matlyst-app.no', 'tel:123', 'javascript:void(0)']) {
    assert.equal(normaliserLenke(href, '/en/', rot), null);
  }
});

test('fragment og query fjernes fra lenkemålet', (t) => {
  const rot = fixture(t, { 'en/mal/index.html': '' });
  assert.equal(normaliserLenke('../mal/?kilde=meny#oppskrift', '/en/kilde/', rot), '/en/mal/');
  assert.equal(normaliserLenke('#oppskrift', '/en/mal/', rot), '/en/mal/');
  assert.equal(normaliserLenke('?kilde=meny', '/en/mal/', rot), '/en/mal/');
});

test('kommentarer, skript og tekst i attributter skaper ikke falske lenker', (t) => {
  const rot = fixture(t, {
    'en/index.html': `<!-- ${lenke('/falsk/')} --><script>const eksempel = '${lenke('/falsk/')}';</script>`
      + `<style>/* ${lenke('/falsk/')} */</style><a title="2 > 1" HREF='/en/mal/?a=1&amp;b=2'>God <b>mat</b></a>`,
    'en/mal/index.html': '',
  });
  const rapport = revider({ rot }).sprak.en;
  assert.equal(rapport.sider.find(({ sti }) => sti === '/en/').utgaende, 1);
  assert.deepEqual(rapport.odelagte, []);
  assert.equal(rapport.sider.find(({ sti }) => sti === '/en/mal/').innkommendeBrodtekst, 1);
});

test('over hundre lenker gjelder alle områder og eksterne lenker', (t) => {
  const rot = fixture(t, {
    'en/hundre/index.html': lenke('https://eksempel.no/').repeat(100),
    'en/mange/index.html': lenke('https://eksempel.no/').repeat(100) + `<footer>${lenke('/en/hundre/')}</footer>`,
  });
  assert.deepEqual(revider({ rot }).sprak.en.overHundre, ['/en/mange/']);
});

test('hub som mangler brødtekstlenke til eike flagges', (t) => {
  const rot = fixture(t, {
    'en/hub/index.html': `<nav>${lenke('/en/eike/')}</nav>`,
    'en/eike/index.html': lenke('/en/hub/'),
  });
  assert.deepEqual(revider({ rot, kart }).sprak.en.kartbrudd, [
    { type: 'hub-mangler-eike', gruppe: 'lagre', fra: '/en/hub/', til: '/en/eike/' },
  ]);
});

test('eiker må lenke opp til alle hubber og planlagte sider er unntatt', (t) => {
  const rot = fixture(t, {
    'en/hub/index.html': lenke('/en/eike/'),
    'en/import/index.html': lenke('/en/eike/'),
    'en/eike/index.html': `<footer>${lenke('/en/hub/')}</footer>`,
  });
  const medToHubber = structuredClone(kart);
  medToHubber.en.hubber.lagre.tilleggshubber = ['/en/import/'];
  assert.deepEqual(revider({ rot, kart: medToHubber }).sprak.en.kartbrudd, [
    { type: 'eike-mangler-hub', gruppe: 'lagre', fra: '/en/eike/', til: '/en/hub/' },
    { type: 'eike-mangler-hub', gruppe: 'lagre', fra: '/en/eike/', til: '/en/import/' },
  ]);
});

test('manglende filer i kartet rapporteres også for hubber og andre språk', (t) => {
  const rot = fixture(t, { 'index.html': '' });
  const rapport = revider({ rot, kart: { nb: { hubber: { mat: { hub: '/hub/', eiker: ['/eike/'], planlagt: ['/senere/'] } } } } });
  assert.deepEqual(rapport.sprak.nb.kartbrudd, [
    { type: 'mangler-fil', gruppe: 'mat', sti: '/hub/' },
    { type: 'mangler-fil', gruppe: 'mat', sti: '/eike/' },
  ]);
});

test('rapporten grupperer på målsidens språk og filteret beholder innkommende fra andre språk', (t) => {
  const rot = fixture(t, {
    'index.html': lenke('/en/'), 'en/index.html': '', 'sv/index.html': '', 'da/index.html': '',
  });
  assert.deepEqual(Object.keys(revider({ rot }).sprak), ['nb', 'sv', 'da', 'en']);
  const rapport = revider({ rot, sprak: 'en' });
  assert.deepEqual(Object.keys(rapport.sprak), ['en']);
  assert.equal(rapport.sprak.en.sider[0].innkommendeBrodtekst, 1);
});

test('CLI skriver tabell og JSON med funn uten å endre filene', (t) => {
  const innhold = lenke('/borte/');
  const rot = fixture(t, { 'index.html': innhold, 'seo-data/lenkekart.json': '{}' });
  const ut = [];
  kjorCli([], { rot, skriv: (tekst) => ut.push(tekst) });
  assert.match(ut.join('\n'), /Språk.*Foreldreløse.*Under 3.*Ødelagte/u);
  assert.match(ut.join('\n'), /\/borte\//u);
  ut.length = 0;
  kjorCli(['--sprak', 'nb', '--json'], { rot, skriv: (tekst) => ut.push(tekst) });
  assert.equal(JSON.parse(ut.join('')).sprak.nb.odelagte.length, 1);
  assert.equal(readFileSync(join(rot, 'index.html'), 'utf8'), innhold);
});

test('CLI rapporterer ugyldige argumenter og kart som data uten å kaste feil', (t) => {
  const rot = fixture(t, { 'seo-data/lenkekart.json': '{' });
  for (const args of [['--sprak', 'xx', '--json'], ['--ukjent', '--json'], ['--json']]) {
    const ut = [];
    assert.doesNotThrow(() => kjorCli(args, { rot, skriv: (tekst) => ut.push(tekst) }));
    assert.ok(JSON.parse(ut.join('')).feil.length > 0);
  }
  writeFileSync(join(rot, 'seo-data/lenkekart.json'), JSON.stringify({ en: { hubber: { lagre: { hub: '/en/', eiker: 'feil' } } } }));
  const ut = [];
  kjorCli(['--json'], { rot, skriv: (tekst) => ut.push(tekst) });
  assert.ok(JSON.parse(ut.join('')).feil.length > 0);
});

test('røkprøve: revisjonen kjører på engelske sider og alle hubber finnes', () => {
  const rot = fileURLToPath(new URL('../', import.meta.url));
  const lenkekart = JSON.parse(readFileSync(join(rot, 'seo-data/lenkekart.json'), 'utf8'));
  for (const gruppe of Object.values(lenkekart.en.hubber)) {
    for (const hub of [gruppe.hub, ...(gruppe.tilleggshubber ?? [])]) {
      assert.ok(statSync(join(rot, hub, 'index.html')).isFile(), hub);
    }
  }
  const resultat = spawnSync(process.execPath, [join(rot, 'scripts/lenke-revisjon.mjs'), '--sprak', 'en', '--json'], { encoding: 'utf8' });
  assert.equal(resultat.status, 0, resultat.stderr);
  assert.ok(JSON.parse(resultat.stdout).sprak.en.sider.length > 0);
});

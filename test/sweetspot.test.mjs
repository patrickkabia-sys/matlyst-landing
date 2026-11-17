import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
import {
  readKeywordPlannerFile, parseKeywordPlannerCsv, tellStore, skaar,
  byggTabell, tilMarkdown,
} from '../scripts/sweetspot.mjs';

const kjør = promisify(execFile);
const csvFil = new URL('./fixtures/sweetspot/kp.csv', import.meta.url);
const skript = new URL('../scripts/sweetspot.mjs', import.meta.url);

async function midlertidig(t) {
  const mappe = await mkdtemp(join(tmpdir(), 'sweetspot-'));
  t.after(() => rm(mappe, { recursive: true, force: true }));
  return mappe;
}

const forventedeRader = [
  { keyword: 'adhd planning tips', bucket: 1, bucketLabel: '10 - 100', competition: 'Medium', bidLow: 0.25, bidHigh: 1.75 },
  { keyword: 'ukemeny', bucket: 2, bucketLabel: '100 - 1K', competition: 'Low', bidLow: null, bidHigh: null },
  { keyword: 'middag', bucket: 3, bucketLabel: '1K - 10K', competition: 'High', bidLow: 1.5, bidHigh: 3.25 },
  { keyword: 'matplan', bucket: 4, bucketLabel: '10K - 100K', competition: 'Low', bidLow: 0, bidHigh: 2 },
  { keyword: 'mat', bucket: 5, bucketLabel: '100K - 1M', competition: 'High', bidLow: 2, bidHigh: 4 },
  { keyword: 'smalt søkeord', bucket: 0, bucketLabel: 'Under 10', competition: null, bidLow: null, bidHigh: null },
];

test('CSV med BOM gir alle volumgrupper, bud og normaliserte søkeord uten tom rad', async () => {
  const bytes = await readFile(csvFil);
  assert.deepEqual([...bytes.subarray(0, 2)], [255, 254]);
  assert.deepEqual(parseKeywordPlannerCsv(await readKeywordPlannerFile(csvFil)), forventedeRader);
});

for (const koding of ['utf16le', 'utf8']) {
  test(`CSV uten BOM leses som ${koding}`, async (t) => {
    const mappe = await midlertidig(t);
    const tekst = (await readFile(csvFil)).subarray(2).toString('utf16le');
    const fil = join(mappe, 'kp.csv');
    await writeFile(fil, tekst, koding);
    assert.equal(await readKeywordPlannerFile(fil), tekst);
    assert.deepEqual(parseKeywordPlannerCsv(await readKeywordPlannerFile(fil)), forventedeRader);
  });
}

test('CSV følger kolonnenavn og støtter siterte felter og UTF-8-BOM', () => {
  const tekst = '\uFEFFTittel\n"Periode"\nCompetition\tKeyword\tTop of page bid (high range)\tAvg. monthly searches\tTop of page bid (low range)\nUkjent\t"  Mat ""nå""  "\t\t500.0\t\n';
  assert.deepEqual(parseKeywordPlannerCsv(tekst), [
    { keyword: 'mat "nå"', bucket: 2, bucketLabel: '100 - 1K', competition: null, bidLow: null, bidHigh: null },
  ]);
});

test('CSV uten påkrevde kolonner avvises tydelig', () => {
  assert.throws(() => parseKeywordPlannerCsv('Tittel\nPeriode\nKeyword\nmat'), /kolonn/i);
});

test('store aktører telles per resultatplass og bare blant de ti første', () => {
  assert.equal(tellStore(['WWW.WIKIPEDIA.ORG', 'amazon.com', 'matprat.no', 'nrk.no', 'koket.se', 'dr.dk', 'litenblogg.no']), 6);
  assert.equal(tellStore(['youtube.com', 'youtube.com']), 2);
  assert.equal(tellStore([...Array(10).fill('litenblogg.no'), 'amazon.com']), 0);
  assert.equal(tellStore(['pineapple.com', 'ikke-nrk.no']), 0);
});

const grunnlag = { bucket: 2, fit: 2, intent: 2, store: 2, harKonverteringsvei: true };
for (const [store, difficulty, total] of [[0, 3, 9], [2, 3, 9], [3, 2, 8], [4, 2, 8], [5, 1, 7], [6, 1, 7], [7, 0, 6], [10, 0, 6]]) {
  test(`difficulty ved ${store} store aktører er ${difficulty}`, () => {
    const resultat = skaar({ ...grunnlag, store });
    assert.equal(resultat.difficulty, difficulty);
    assert.equal(resultat.total, total);
  });
}
for (const [bucket, demand, total] of [[0, 0, 7], [1, 1, 8], [2, 2, 9], [3, 3, 10], [4, 3, 10], [5, 3, 10]]) {
  test(`demand ved bucket ${bucket} er ${demand}`, () => {
    const resultat = skaar({ ...grunnlag, bucket });
    assert.equal(resultat.demand, demand);
    assert.equal(resultat.total, total);
  });
}
for (const [bucket, vei, inkluder] of [[0, true, false], [1, true, true], [1, false, false], [2, false, false]]) {
  test(`inkludering med bucket ${bucket} og vei ${vei} blir ${inkluder}`, () => {
    assert.equal(skaar({ ...grunnlag, bucket, harKonverteringsvei: vei }).inkluder, inkluder);
  });
}
test('maksimal skår er 12 og ukjent konkurranse gir ukjent total', () => {
  assert.deepEqual(skaar({ bucket: 5, fit: 3, intent: 3, store: 0, harKonverteringsvei: true }),
    { demand: 3, fit: 3, intent: 3, difficulty: 3, total: 12, inkluder: true });
  assert.deepEqual(skaar({ ...grunnlag, store: null }),
    { demand: 2, fit: 2, intent: 2, difficulty: null, total: null, inkluder: false });
});
for (const felt of ['fit', 'intent']) {
  for (const verdi of [-1, 4, 1.5, NaN, null, '2', undefined]) {
    test(`${felt} avviser ${String(verdi)}`, () => {
      assert.throws(() => skaar({ ...grunnlag, [felt]: verdi }), RangeError);
    });
  }
}

function tabellgrunnlag() {
  const rad = (keyword) => ({ keyword, bucket: 2, bucketLabel: '100 - 1K', bidHigh: 1.75 });
  return {
    rader: ['zebra', 'alfa', 'best', 'uten vei', 'uten etikett', 'uten serp', 'uten begge', 'tom serp'].map(rad),
    serp: Object.fromEntries(['zebra', 'alfa', 'best', 'uten vei', 'uten etikett'].map(ord => [ord, { domener: ['blogg.no'] }]).concat([['tom serp', { domener: [] }]])),
    etiketter: {
      zebra: { fit: 2, intent: 2, side: '/zebra/' }, alfa: { fit: 2, intent: 2, side: '/alfa/' },
      best: { fit: 3, intent: 3, side: '/best/' }, 'uten vei': { fit: 3, intent: 3, side: '  ' },
      'uten serp': { fit: 3, intent: 3, side: '/serp/' }, 'tom serp': { fit: 3, intent: 3 },
    },
  };
}

test('tabellen slår sammen, sorterer og markerer manglende data uten inkludering', () => {
  const tabell = byggTabell(tabellgrunnlag());
  assert.deepEqual(tabell.map(rad => rad.keyword), ['best', 'uten vei', 'alfa', 'zebra', 'tom serp', 'uten begge', 'uten etikett', 'uten serp']);
  const finn = ord => tabell.find(rad => rad.keyword === ord);
  assert.equal(finn('best').total, 11);
  assert.equal(finn('best').inkluder, true);
  assert.equal(finn('uten vei').inkluder, false);
  for (const [ord, mangler] of [['uten etikett', ['etikett']], ['uten serp', ['serp']], ['uten begge', ['etikett', 'serp']], ['tom serp', ['serp']]]) {
    assert.deepEqual(finn(ord).mangler, mangler);
    assert.equal(finn(ord).inkluder, false);
    assert.equal(finn(ord).total, null);
  }
});

test('Markdown viser konkrete verdier, sorterer selv og har egen mangelliste', () => {
  const tekst = tilMarkdown(byggTabell(tabellgrunnlag()).reverse(), { sprak: 'en-US', dato: '2026-11-18' });
  assert.match(tekst, /^# /);
  assert.match(tekst, /en-US/);
  assert.match(tekst, /2026-11-18/);
  assert.ok(tekst.includes('| Søkeord | Volum | Bud (høy) | Store av 10 | Fit | Intent | Total | Vei | Inkluder |'));
  assert.ok(tekst.includes('| best | 100 - 1K | 1.75 | 0 | 3 | 3 | 11 | /best/ | Ja |'));
  const markører = ['| best |', '| uten vei |', '| alfa |', '| zebra |', '| tom serp |', '| uten begge |', '| uten etikett |', '| uten serp |', '## Mangler'];
  for (const markør of markører) assert.ok(tekst.includes(markør), `Mangler markør: ${markør}`);
  for (let i = 1; i < markører.length; i++) assert.ok(tekst.indexOf(markører[i - 1]) < tekst.indexOf(markører[i]));
  assert.match(tekst, /- uten begge: etikett, serp/);
  assert.doesNotMatch(tekst, /[\u2013\u2014]/);
});

test('Markdown beskytter tabellceller mot skilletegn, linjeskift og tankestrek', () => {
  const tekst = tilMarkdown([{ keyword: 'a|b\nc\u2014d', bucketLabel: '10 - 100', bidHigh: null, store: null, fit: null, intent: null, total: null, side: '/a|b', inkluder: false, mangler: ['serp'] }], { sprak: 'nb', dato: '2026-11-18' });
  assert.ok(tekst.includes('a&#124;b c-d'));
  assert.ok(tekst.includes('/a&#124;b'));
  assert.doesNotMatch(tekst, /[\u2013\u2014]/);
});

test('CLI slår sammen flere CSV-filer med siste duplikat og skriver bare utfil', async (t) => {
  const mappe = await midlertidig(t);
  const ekstra = join(mappe, 'ekstra.csv');
  await writeFile(ekstra, 'Tittel\n"Periode"\nKeyword\tAvg. monthly searches\tCompetition\tTop of page bid (low range)\tTop of page bid (high range)\nUKEMENY\t5000\tHigh\t1\t9.5\n');
  const serp = join(mappe, 'serp.json');
  const etiketter = join(mappe, 'etiketter.json');
  const ut = join(mappe, 'resultat.md');
  await writeFile(serp, JSON.stringify({ ukemeny: { domener: ['blogg.no'] } }));
  await writeFile(etiketter, JSON.stringify({ ukemeny: { fit: 3, intent: 3, side: '/ukemeny/' } }));
  const { stdout, stderr } = await kjør(process.execPath, [skript.pathname, '--csv', csvFil.pathname, '--csv', ekstra, '--serp', serp, '--etiketter', etiketter, '--sprak', 'en-US', '--ut', ut]);
  assert.equal(stdout, '');
  assert.equal(stderr, '');
  const tekst = await readFile(ut, 'utf8');
  assert.ok(tekst.includes('| ukemeny | 1K - 10K | 9.5 | 0 | 3 | 3 | 12 | /ukemeny/ | Ja |'));
  assert.equal(tekst.split('\n').filter(linje => linje.startsWith('| ukemeny |')).length, 1);
});

test('import av skåringsskriptet kjører ikke CLI', async () => {
  const { stdout, stderr } = await kjør(process.execPath, ['--input-type=module', '-e', `await import(${JSON.stringify(skript.href)})`]);
  assert.equal(stdout, '');
  assert.equal(stderr, '');
});

import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { domainsFromDdgHtml, fetchSerp } from '../scripts/serp-sjekk.mjs';

const html = await readFile(new URL('./fixtures/sweetspot/ddg.html', import.meta.url), 'utf8');
const forventet = ['example.com', 'example.com', 'matprat.no', 'blogg.no', 'nrk.no', 'sub.example.org', 'koket.se', 'youtube.com', 'oppskrift.no', 'tiende.no'];
const kjør = promisify(execFile);
const skript = new URL('../scripts/serp-sjekk.mjs', import.meta.url);

test('DDG tar de ti første resultatplassene uten reklame og normaliserer vertsnavn', () => {
  assert.deepEqual(domainsFromDdgHtml(html), forventet);
  assert.deepEqual(domainsFromDdgHtml(''), []);
  assert.deepEqual(domainsFromDdgHtml('<a class="result__url-feil">feil.no</a>'), []);
});

test('DDG håndterer protokoll, port, HTML-mellomrom og underdomener', () => {
  assert.deepEqual(domainsFromDdgHtml('<a class="result__url">&nbsp;https://WWW.Example.COM:443/path?q=x</a><a class="result__url">sub.blogg.no/sti mer</a>'), ['example.com', 'sub.blogg.no']);
});

test('fetchSerp koder søkeord, bruker Safari og returnerer domener ved første treff', async () => {
  const kall = [];
  const venting = [];
  const resultat = await fetchSerp('middag & grønt', {
    ventMs: 0, sov: async ms => venting.push(ms),
    fetchFn: async (url, options) => { kall.push({ url, options }); return new Response(html); },
  });
  assert.deepEqual(resultat, forventet);
  assert.equal(kall.length, 1);
  assert.equal(kall[0].url, 'https://html.duckduckgo.com/html/?q=middag%20%26%20gr%C3%B8nt');
  assert.match(kall[0].options.headers['User-Agent'], /Version\/.*Safari\//);
  assert.deepEqual(venting.filter(ms => ms > 0), []);
});

test('tomt svar forsøkes to ganger med fire sekunder mellom forsøkene', async () => {
  let antall = 0;
  const venting = [];
  assert.deepEqual(await fetchSerp('mat', {
    ventMs: 0, sov: async ms => venting.push(ms),
    fetchFn: async () => { antall++; return new Response(''); },
  }), []);
  assert.equal(antall, 2);
  assert.deepEqual(venting.filter(ms => ms > 0), [4000]);
});

test('nettverksfeil kan etterfølges av et vellykket nytt forsøk', async () => {
  let antall = 0;
  assert.deepEqual(await fetchSerp('mat', {
    ventMs: 0, sov: async () => {},
    fetchFn: async () => { if (++antall === 1) throw new Error('Frakoblet'); return new Response(html); },
  }), forventet);
  assert.equal(antall, 2);
});

for (const type of ['nettverk', 'http']) {
  test(`vedvarende ${type}-feil stopper etter angitt antall forsøk`, async () => {
    let antall = 0;
    const venting = [];
    assert.deepEqual(await fetchSerp('mat', {
      forsok: 3, ventMs: 0, sov: async ms => venting.push(ms),
      fetchFn: async () => {
        antall++;
        if (type === 'nettverk') throw new Error('Frakoblet');
        return new Response(html, { status: 503 });
      },
    }), []);
    assert.equal(antall, 3);
    assert.deepEqual(venting.filter(ms => ms > 0), [4000, 4000]);
  });
}

test('ventMs bruker injisert sov før forespørselen', async () => {
  const hendelser = [];
  await fetchSerp('mat', {
    ventMs: 1600, sov: async ms => hendelser.push(ms),
    fetchFn: async () => { hendelser.push('hent'); return new Response(html); },
  });
  assert.deepEqual(hendelser, [1600, 'hent']);
});

test('SERP-CLI skriver JSON til fil og fremdrift bare til stderr uten nettverk', async t => {
  const mappe = await mkdtemp(join(tmpdir(), 'serp-sjekk-'));
  t.after(() => rm(mappe, { recursive: true, force: true }));
  const ord = join(mappe, 'ord.txt');
  const ut = join(mappe, 'serp.json');
  await writeFile(ord, ' Mat \n\nGrønt\n');
  const injeksjon = new URL('./fixtures/sweetspot/cli-fetch.mjs', import.meta.url);
  const { stdout, stderr } = await kjør(process.execPath, ['--import', injeksjon.href, skript.pathname, '--ord', ord, '--ut', ut]);
  assert.equal(stdout, '');
  assert.match(stderr, /1\/2.*mat/);
  assert.match(stderr, /2\/2.*grønt/);
  assert.deepEqual(JSON.parse(await readFile(ut, 'utf8')), { mat: { domener: ['matprat.no'] }, grønt: { domener: ['blogg.no'] } });
});

test('import av SERP-skriptet kjører ikke CLI eller nettverk', async () => {
  const { stdout, stderr } = await kjør(process.execPath, ['--input-type=module', '-e', `globalThis.fetch = () => { throw new Error('Uventet nettverk'); }; await import(${JSON.stringify(skript.href)})`]);
  assert.equal(stdout, '');
  assert.equal(stderr, '');
});

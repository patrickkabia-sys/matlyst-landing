import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

import { SIDEGRUPPER, byggLocalePageMap, filForSti } from '../scripts/locale-sider.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const source = readFileSync(join(ROOT, 'locale.js'), 'utf8');

function lastInn() {
  const context = { globalThis: {}, URLSearchParams };
  vm.runInNewContext(source, context);
  return context.globalThis.MatlystLocale;
}

// Kjører locale.js som i en nettleser. Last-handleren utløses eksplisitt, slik at
// testen også låser at ingen navigasjon skjer før siden er ferdig lastet.
function besok(url, {
  sprak = 'nb-NO',
  sprakliste = [sprak],
  lagret = null,
  vurdert = false,
  userAgent = 'Mozilla/5.0',
} = {}) {
  const { pathname, search, hash } = new URL(url, 'https://matlyst-app.no');
  const lager = new Map();
  if (lagret) lager.set('matlyst-sprak', lagret);
  if (vurdert) lager.set('matlyst-sprak-vurdert', '1');
  const omdirigert = [];
  let vedLast = null;
  const document = { readyState: 'loading', cookie: '' };
  const window = {
    document,
    location: { pathname, search, hash, replace: (til) => omdirigert.push(til) },
    navigator: { languages: sprakliste, language: sprak, userAgent },
    localStorage: { getItem: (k) => lager.get(k) ?? null, setItem: (k, v) => lager.set(k, v) },
    addEventListener: (navn, handler) => { if (navn === 'load') vedLast = handler; },
  };
  vm.runInNewContext(source, { window, URLSearchParams });
  const forLast = omdirigert[0] ?? null;
  vedLast?.();
  return {
    forLast,
    til: omdirigert[0] ?? null,
    lagret: lager.get('matlyst-sprak') ?? null,
    vurdert: lager.get('matlyst-sprak-vurdert') ?? null,
  };
}

test('bare primært svensk eller dansk nettleserspråk foreslår automatisk språk', () => {
  const { foreslaSprak } = lastInn();
  assert.equal(foreslaSprak('sv-SE'), 'sv');
  assert.equal(foreslaSprak('da-DK'), 'da');
  assert.equal(foreslaSprak('nb-NO'), null);
  assert.equal(foreslaSprak('en-US'), null);
});

test('side uten motstykke omdirigeres ikke', () => {
  assert.equal(lastInn().finnMaalsti('/ukjent/', 'sv', {}), null);
});

test('omdirigering skjer først etter lasting', () => {
  const svar = besok('/', { sprak: 'sv-SE' });
  assert.equal(svar.forLast, null);
  assert.equal(svar.til, '/sv/');
});

test('første norske besøk med svensk eller dansk primærspråk sendes til motstykket', () => {
  assert.equal(besok('/', { sprak: 'sv-SE' }).til, '/sv/');
  assert.equal(besok('/personvern.html', { sprak: 'da-DK' }).til, '/da/privatliv/');
  assert.equal(besok('/vilkar.html?utm_source=x#les', { sprak: 'sv-SE' }).til, '/sv/villkor/?utm_source=x#les');
});

test('sekundært svensk eller dansk språk utløser ikke omdirigering', () => {
  assert.equal(besok('/', { sprak: 'en-US', sprakliste: ['en-US', 'sv-SE'] }).til, null);
  assert.equal(besok('/', { sprak: 'nb-NO', sprakliste: ['nb-NO', 'da-DK'] }).til, null);
});

test('norsk og engelsk primærspråk blir på norsk', () => {
  for (const sprak of ['nb-NO', 'no', 'en-US']) assert.equal(besok('/', { sprak }).til, null, sprak);
});

test('direkte besøk på lokaliserte sider omdirigeres aldri', () => {
  for (const sti of ['/sv/', '/da/privatliv/', '/en/', '/sv/importera-recept/']) {
    assert.equal(besok(sti, { sprak: 'nb-NO' }).til, null, sti);
    assert.equal(besok(sti, { sprak: 'da-DK' }).til, null, sti);
  }
});

test('førstegangsbeslutningen huskes og gjentas ikke på en norsk side', () => {
  const forste = besok('/', { sprak: 'sv-SE' });
  assert.deepEqual(forste, { forLast: null, til: '/sv/', lagret: 'sv', vurdert: '1' });
  assert.equal(besok('/personvern.html', { sprak: 'sv-SE', lagret: forste.lagret, vurdert: true }).til, null);
});

test('språkvelgeren lagrer norsk og hindrer senere automatisk omdirigering', () => {
  const valgt = besok('/?sprak=nb', { sprak: 'sv-SE' });
  assert.deepEqual(valgt, { forLast: null, til: null, lagret: 'nb', vurdert: '1' });
  assert.equal(besok('/personvern.html', { sprak: 'sv-SE', lagret: 'nb', vurdert: true }).til, null);
});

test('språkvelgeren omdirigeres ikke på målsiden og lagrer valget', () => {
  assert.deepEqual(besok('/sv/?sprak=sv', { sprak: 'da-DK' }), {
    forLast: null, til: null, lagret: 'sv', vurdert: '1',
  });
});

test('roboter omdirigeres aldri', () => {
  const svar = besok('/', { sprak: 'sv-SE', userAgent: 'Googlebot/2.1' });
  assert.equal(svar.til, null);
  assert.equal(svar.vurdert, null);
});

test('tekniske retursider og avmeldingslenker omdirigeres aldri', () => {
  for (const sti of ['/tiktok-auth/?code=abc', '/avmeld/?u=bruker&s=signatur']) {
    assert.equal(besok(sti, { sprak: 'sv-SE' }).til, null, sti);
  }
});

test('LOCALE_PAGE_MAP er bygd fra den samme tabellen som hreflang', () => {
  const faktisk = JSON.parse(JSON.stringify(lastInn().LOCALE_PAGE_MAP));
  assert.deepEqual(faktisk, byggLocalePageMap());
  assert.equal(Object.keys(faktisk).length > 40, true);
});

test('alle norske sider med motstykke laster locale.js utsatt', () => {
  for (const gruppe of SIDEGRUPPER.filter(({ sider, redirect }) => sider.nb && Object.keys(sider).length > 1 && redirect !== false)) {
    const fil = filForSti(gruppe.sider.nb);
    assert.match(readFileSync(join(ROOT, fil), 'utf8'), /<script src="\/locale\.js" defer><\/script>/u, fil);
  }
});

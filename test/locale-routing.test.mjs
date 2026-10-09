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

// Kjører locale.js som i en nettleser og returnerer hvor siden sendes, og hva som er lagret.
function besok(url, { sprak = ['nb-NO'], lagret = null } = {}) {
  const { pathname, search, hash } = new URL(url, 'https://matlyst-app.no');
  const lager = new Map(lagret ? [['matlyst-sprak', lagret]] : []);
  const omdirigert = [];
  const window = {
    location: { pathname, search, hash, replace: (til) => omdirigert.push(til) },
    navigator: { languages: sprak, language: sprak[0] },
    localStorage: { getItem: (k) => lager.get(k) ?? null, setItem: (k, v) => lager.set(k, v) },
  };
  vm.runInNewContext(source, { window, URLSearchParams });
  return { til: omdirigert[0] ?? null, lagret: lager.get('matlyst-sprak') ?? null };
}

test('språklisten velger første språk Matlyst støtter', () => {
  const { velgSprak } = lastInn();
  assert.equal(velgSprak(['sv-SE', 'en'], null), 'sv');
  assert.equal(velgSprak(['en-GB', 'da'], null), 'da');
  assert.equal(velgSprak(['nb-NO'], null), 'nb');
  assert.equal(velgSprak(['en-US'], null), null);
});

test('lagret språk overstyrer nettleserspråket', () => {
  assert.equal(lastInn().velgSprak(['sv-SE'], 'da'), 'da');
});

test('side uten motstykke omdirigeres ikke', () => {
  assert.equal(lastInn().finnMaalsti('/ukjent/', 'sv', {}), null);
});

test('en norsk bruker blir på norsk', () => {
  for (const sti of ['/', '/personvern.html', '/vilkar.html', '/slett-konto.html', '/ukemeny/']) {
    assert.equal(besok(sti, { sprak: ['nb-NO', 'en'] }).til, null, sti);
    assert.equal(besok(sti, { sprak: ['no'] }).til, null, sti);
  }
});

test('en norsk bruker på en svensk eller dansk side med norsk motpart sendes til norsk', () => {
  assert.equal(besok('/sv/', { sprak: ['nb-NO'] }).til, '/');
  assert.equal(besok('/da/privatliv/', { sprak: ['nb'] }).til, '/personvern.html');
  assert.equal(besok('/sv/importera-recept/', { sprak: ['nb-NO'] }).til, '/importer-oppskrifter/');
});

test('svensk og dansk språk sendes til riktig side', () => {
  assert.equal(besok('/', { sprak: ['sv-SE'] }).til, '/sv/');
  assert.equal(besok('/', { sprak: ['da-DK'] }).til, '/da/');
  assert.equal(besok('/index.html', { sprak: ['da'] }).til, '/da/');
  assert.equal(besok('/personvern.html', { sprak: ['sv-SE'] }).til, '/sv/integritet/');
  assert.equal(besok('/personvern', { sprak: ['da-DK'] }).til, '/da/privatliv/');
  assert.equal(besok('/vilkar.html', { sprak: ['da-DK'] }).til, '/da/vilkaar/');
  assert.equal(besok('/slett-konto.html', { sprak: ['sv-SE'] }).til, '/sv/radera-konto/');
  assert.equal(besok('/sv/importera-recept/', { sprak: ['da-DK'] }).til, '/da/importer-opskrifter/');
  assert.equal(besok('/da/nem-mad/', { sprak: ['sv-SE'] }).til, '/sv/enkel-middag/');
  assert.equal(besok('/', { sprak: ['en-US'] }).til, null);
});

test('omdirigering beholder spørring og anker', () => {
  assert.equal(besok('/?utm_source=x#funksjoner', { sprak: ['sv-SE'] }).til, '/sv/?utm_source=x#funksjoner');
});

test('?sprak= vinner over nettleserspråket og lagres', () => {
  const svar = besok('/?sprak=nb', { sprak: ['sv-SE'] });
  assert.deepEqual(svar, { til: null, lagret: 'nb' });
  assert.deepEqual(besok('/sv/?sprak=sv', { sprak: ['da-DK'], lagret: 'nb' }), { til: null, lagret: 'sv' });
});

test('lagret valg vinner over nettleserspråket', () => {
  assert.equal(besok('/', { sprak: ['sv-SE'], lagret: 'nb' }).til, null);
  assert.equal(besok('/', { sprak: ['nb-NO'], lagret: 'da' }).til, '/da/');
  assert.equal(besok('/sv/villkor/', { sprak: ['sv-SE'], lagret: 'da' }).til, '/da/vilkaar/');
});

test('tekniske TikTok-retursider omdirigeres aldri', () => {
  for (const sti of ['/sv/tiktok-auth/', '/da/tiktok-auth/', '/tiktok-auth/']) {
    assert.equal(besok(`${sti}?code=abc`, { sprak: ['da-DK'] }).til, null, sti);
  }
});

test('avmeldingslenker omdirigeres aldri og beholder funksjonskallet på siden', () => {
  for (const sti of ['/avmeld/', '/sv/avregistrera/', '/da/afmeld/']) {
    assert.equal(besok(`${sti}?u=bruker&s=signatur`, { sprak: ['sv-SE'], lagret: 'da' }).til, null, sti);
  }
});

test('LOCALE_PAGE_MAP er bygd fra den samme tabellen som hreflang', () => {
  const faktisk = JSON.parse(JSON.stringify(lastInn().LOCALE_PAGE_MAP));
  assert.deepEqual(faktisk, byggLocalePageMap());
  assert.equal(Object.keys(faktisk).length > 40, true);
});

test('alle norske sider med en motpart laster locale.js', () => {
  for (const gruppe of SIDEGRUPPER.filter(({ sider, redirect }) => sider.nb && Object.keys(sider).length > 1 && redirect !== false)) {
    const fil = filForSti(gruppe.sider.nb);
    assert.match(readFileSync(join(ROOT, fil), 'utf8'), /<script src="\/locale\.js"><\/script>/u, fil);
  }
});

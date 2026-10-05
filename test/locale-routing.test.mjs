import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

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
  assert.equal(besok('/sv/importera-recept/', { sprak: ['nb-NO'] }).til, null);
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

function finnHtml(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? finnHtml(path) : entry.name === 'index.html' ? [path] : [];
  });
}

test('LOCALE_PAGE_MAP er nøyaktig hreflang-parene på sidene', () => {
  const kode = { 'nb-NO': 'nb', 'sv-SE': 'sv', 'da-DK': 'da' };
  const filer = [...finnHtml(join(ROOT, 'sv')), ...finnHtml(join(ROOT, 'da')), ...['index.html', 'personvern.html', 'vilkar.html', 'slett-konto.html'].map((f) => join(ROOT, f))];
  const forventet = {};
  for (const fil of filer) {
    const html = readFileSync(fil, 'utf8');
    const canonical = new URL(html.match(/<link rel="canonical" href="([^"]+)">/u)[1]).pathname;
    if (canonical.endsWith('/tiktok-auth/')) continue;
    const rad = {};
    for (const [, k, href] of html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/gu)) {
      if (kode[k]) rad[kode[k]] = new URL(href).pathname;
    }
    assert.ok(Object.values(rad).includes(canonical), `${canonical}: peker ikke på seg selv`);
    for (const sti of Object.values(rad)) {
      if (forventet[sti]) assert.deepEqual(forventet[sti], rad, `${sti}: ulike hreflang-sett`);
      forventet[sti] = rad;
      if (sti.endsWith('.html')) forventet[sti.slice(0, -5)] = rad;
      if (sti === '/') forventet['/index.html'] = rad;
    }
  }
  const faktisk = JSON.parse(JSON.stringify(lastInn().LOCALE_PAGE_MAP));
  assert.deepEqual(faktisk, forventet);
  assert.equal(Object.keys(faktisk).length > 40, true);
});

test('de fire norske sidene med motpart laster locale.js', () => {
  for (const fil of ['index.html', 'personvern.html', 'vilkar.html', 'slett-konto.html']) {
    assert.match(readFileSync(join(ROOT, fil), 'utf8'), /<script src="\/locale\.js"><\/script>/u, fil);
  }
});

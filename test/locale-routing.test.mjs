import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

import { SIDEGRUPPER, filForSti } from '../scripts/locale-sider.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const source = readFileSync(join(ROOT, 'locale.js'), 'utf8');

// Hreflang-lenkene slik de står i den ekte HTML-fila for stien. Adresser uten
// endelse (/personvern) og /index.html serveres av samme fil som sider med endelse.
function ekteAlternativer(sti) {
  const kandidater = [filForSti(sti), `${sti.replace(/^\//u, '')}.html`, sti === '/index.html' ? 'index.html' : null].filter(Boolean);
  const fil = kandidater.find((f) => existsSync(join(ROOT, f)));
  if (!fil) return [];
  const html = readFileSync(join(ROOT, fil), 'utf8');
  return [...html.matchAll(/<link rel="alternate" hreflang="([^"]*)" href="([^"]*)"/gu)].map((m) => [m[1], m[2]]);
}

// Enhver script-tagg med src=/locale.js, uansett attributtrekkefølge og anførselstegn.
const harLocaleScript = (html) => /<script\b[^>]*\bsrc\s*=\s*["']?\/locale\.js(?![\w.])/iu.test(html);

function lastInn() {
  const context = { globalThis: {}, URLSearchParams, URL };
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
  alternativer = null,
} = {}) {
  const { pathname, search, hash } = new URL(url, 'https://matlyst-app.no');
  const lager = new Map();
  if (lagret) lager.set('matlyst-sprak', lagret);
  if (vurdert) lager.set('matlyst-sprak-vurdert', '1');
  const omdirigert = [];
  let vedLast = null;
  const lenker = (alternativer ?? ekteAlternativer(pathname)).map(([hreflang, href]) => ({
    getAttribute: (navn) => (navn === 'hreflang' ? hreflang : href),
  }));
  const document = { readyState: 'loading', cookie: '', querySelectorAll: () => lenker };
  const window = {
    document,
    location: { pathname, search, hash, href: new URL(url, 'https://matlyst-app.no').href, replace: (til) => omdirigert.push(til) },
    navigator: { languages: sprakliste, language: sprak, userAgent },
    localStorage: { getItem: (k) => lager.get(k) ?? null, setItem: (k, v) => lager.set(k, v) },
    addEventListener: (navn, handler) => { if (navn === 'load') vedLast = handler; },
  };
  vm.runInNewContext(source, { window, URLSearchParams, URL });
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
  assert.equal(lastInn().finnMaalsti('sv', []), null);
  assert.equal(lastInn().finnMaalsti('sv', [{ sprak: 'nb', sti: '/ukjent/' }]), null);
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

test('tekniske retursider og avmeldingslenker laster ikke locale.js', () => {
  // Kartet var det som holdt disse utenfor; nå er det fraværet av script-taggen.
  for (const fil of ['tiktok-auth/index.html', 'avmeld/index.html']) {
    assert.equal(harLocaleScript(readFileSync(join(ROOT, fil), 'utf8')), false, fil);
  }
  for (const gruppe of SIDEGRUPPER.filter(({ redirect }) => redirect === false)) {
    for (const sti of Object.values(gruppe.sider)) {
      assert.equal(harLocaleScript(readFileSync(join(ROOT, filForSti(sti)), 'utf8')), false, sti);
    }
  }
});

test('locale.js bærer ikke lenger noe sidekart', () => {
  assert.equal(source.includes('LOCALE_PAGE_MAP'), false);
  assert.equal('LOCALE_PAGE_MAP' in lastInn(), false);
  assert.ok(Buffer.byteLength(source) < 6000);
});

test('adresser uten endelse sendes videre som før', () => {
  assert.equal(besok('/personvern', { sprak: 'da-DK' }).til, '/da/privatliv/');
  assert.equal(besok('/index.html', { sprak: 'sv-SE' }).til, '/sv/');
});

test('hreflang som ikke er til å stole på gir ingen videresending ut av nettstedet', () => {
  for (const href of ['', 'https://eksempel.no/sv/', 'http://[', 'javascript:alert(1)', 'https://eksempel.no//ond.no/', '//ond.no/']) {
    const r = besok('/', { sprak: 'sv-SE', alternativer: [['nb-NO', 'https://matlyst-app.no/'], ['sv-SE', href]] });
    assert.ok(r.til === null || r.til.startsWith('/'), href);
    assert.equal(/^\/\//u.test(r.til ?? ''), false, href);
  }
  // Annen vert enn matlyst-app.no og sidens egen vert hoppes over.
  const annen = besok('/', { sprak: 'sv-SE', alternativer: [['nb-NO', 'https://matlyst-app.no/'], ['sv-SE', 'https://eksempel.no/sv/']] });
  assert.equal(annen.til, null);
  // Egen vert og matlyst-app.no virker.
  assert.equal(besok('/', { sprak: 'sv-SE', alternativer: [['nb-NO', 'https://matlyst-app.no/'], ['sv-SE', 'https://matlyst-app.no/sv/']] }).til, '/sv/');
  assert.equal(besok('/', { sprak: 'sv-SE', alternativer: [['nb-NO', '/'], ['sv-SE', '/sv/']] }).til, '/sv/');
});

test('vakten mot script-taggen fanger enhver rekkefølge og anførsel, og kan bli rød', () => {
  assert.equal(harLocaleScript('<script src="/locale.js" defer></script>'), true);
  assert.equal(harLocaleScript('<script defer src="/locale.js"></script>'), true);
  assert.equal(harLocaleScript("<script defer src='/locale.js'></script>"), true);
  assert.equal(harLocaleScript('<script async\n src=/locale.js></script>'), true);
  assert.equal(harLocaleScript('<script src="/site.js" defer></script>'), false);
});

test('lesAlternativer hopper over x-default og ukjente språk', () => {
  const { lesAlternativer } = lastInn();
  const lenker = [['x-default', '/'], ['nb-NO', '/'], ['fr-FR', '/fr/'], ['sv-SE', '/sv/']]
    .map(([h, href]) => ({ getAttribute: (n) => (n === 'hreflang' ? h : href) }));
  const r = lesAlternativer({ querySelectorAll: () => lenker }, 'https://matlyst-app.no/');
  assert.deepEqual(JSON.parse(JSON.stringify(r)), [{ sprak: 'nb', sti: '/' }, { sprak: 'sv', sti: '/sv/' }]);
});

test('side uten hreflang eller uten norsk alternativ omdirigeres ikke', () => {
  assert.equal(besok('/', { sprak: 'sv-SE', alternativer: [] }).til, null);
  assert.equal(besok('/', { sprak: 'sv-SE', alternativer: [['sv-SE', '/sv/']] }).til, null);
});

test('alle norske sider med motstykke laster locale.js utsatt', () => {
  for (const gruppe of SIDEGRUPPER.filter(({ sider, redirect }) => sider.nb && Object.keys(sider).length > 1 && redirect !== false)) {
    const fil = filForSti(gruppe.sider.nb);
    assert.match(readFileSync(join(ROOT, fil), 'utf8'), /<script src="\/locale\.js" defer><\/script>/u, fil);
  }
});

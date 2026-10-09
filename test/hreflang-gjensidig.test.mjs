import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

import { SIDEGRUPPER, alternativerFor, byggLocalePageMap, filForSti } from '../scripts/locale-sider.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const BASE = 'https://matlyst-app.no';
const les = (sti) => readFileSync(join(ROOT, filForSti(sti)), 'utf8');

function finnHtml(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'test-results') return [];
    const fil = join(dir, entry.name);
    return entry.isDirectory() ? finnHtml(fil) : entry.name.endsWith('.html') ? [fil] : [];
  });
}

function hreflang(html) {
  return Object.fromEntries([...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/gu)]
    .map(([, kode, href]) => [kode, href]));
}

test('sidetabellen har alle ekte trioer, par og enkeltstående sider', () => {
  const trioer = SIDEGRUPPER.filter(({ sider }) => sider.nb && sider.sv && sider.da);
  const par = SIDEGRUPPER.filter(({ sider }) => !sider.nb && sider.sv && sider.da);
  const enkelt = SIDEGRUPPER.filter(({ sider }) => Object.keys(sider).length === 1);
  assert.equal(trioer.length, 16);
  assert.equal(par.length, 6);
  assert.equal(enkelt.length, 7);
});

test('alle tabellførte sider har eksisterende, gjensidig hreflang fra samme tabell', () => {
  for (const gruppe of SIDEGRUPPER) {
    for (const [sprak, sti] of Object.entries(gruppe.sider)) {
      const fil = join(ROOT, filForSti(sti));
      assert.equal(existsSync(fil), true, `${gruppe.id}: ${sti}`);
      const faktisk = hreflang(readFileSync(fil, 'utf8'));
      const forventet = Object.fromEntries(alternativerFor(sti).map(([kode, maal]) => [kode, `${BASE}${maal}`]));
      assert.deepEqual(faktisk, forventet, `${gruppe.id}: ${sprak}`);

      for (const [kode, maal] of alternativerFor(sti)) {
        assert.equal(existsSync(join(ROOT, filForSti(maal))), true, `${sti} → ${maal}`);
        if (kode === 'x-default') continue;
        const tilbake = hreflang(les(maal));
        const egenKode = { nb: 'nb-NO', sv: 'sv-SE', da: 'da-DK' }[sprak];
        assert.equal(tilbake[egenKode], `${BASE}${sti}`, `${maal} → ${sti}`);
      }
    }
  }
});

test('alle hreflang-lenker i alle HTML-filer peker på en side som finnes', () => {
  for (const fil of finnHtml(ROOT)) {
    for (const [, href] of readFileSync(fil, 'utf8').matchAll(/<link rel="alternate" hreflang="[^"]+" href="([^"]+)">/gu)) {
      const url = new URL(href);
      if (url.origin !== BASE) continue;
      assert.equal(existsSync(join(ROOT, filForSti(url.pathname))), true, `${fil}: ${url.pathname}`);
    }
  }
});

test('LOCALE_PAGE_MAP bygges direkte fra sidetabellen', () => {
  const source = readFileSync(join(ROOT, 'locale.js'), 'utf8');
  const context = { globalThis: {}, URLSearchParams };
  vm.runInNewContext(source, context);
  const faktisk = JSON.parse(JSON.stringify(context.globalThis.MatlystLocale.LOCALE_PAGE_MAP));
  assert.deepEqual(faktisk, byggLocalePageMap());
});

test('lokale kildesider har ingen falske språk-motstykker', () => {
  for (const sti of ['/sv/koket/', '/sv/landleys-kok/', '/da/alletiders-kogebog/', '/da/dr-mad/']) {
    const språklenker = alternativerFor(sti).filter(([kode]) => kode !== 'x-default');
    assert.deepEqual(språklenker, [[sti.startsWith('/sv/') ? 'sv-SE' : 'da-DK', sti]]);
  }
});

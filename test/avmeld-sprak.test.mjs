import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const ROOT = new URL('..', import.meta.url).pathname;
const SIDER = ['avmeld/index.html', 'sv/avregistrera/index.html', 'da/afmeld/index.html'];

test('alle avmeldingssider bruker det samme skriptet og omdirigeres ikke', () => {
  for (const fil of SIDER) {
    const html = readFileSync(join(ROOT, fil), 'utf8');
    assert.match(html, /<script src="\/avmeld\.js" defer><\/script>/u, fil);
    assert.match(html, /<link rel="stylesheet" href="\/avmeld\.css">/u, fil);
    assert.doesNotMatch(html, /<script src="\/locale\.js"/u, fil);
    assert.doesNotMatch(html, /fetch\(['"]https:\/\/uaryzmqvoqljjwqvgzoi\.supabase\.co/u, fil);
  }
});

test('alle sidene bruker klassene fra det felles stilarket', () => {
  const css = readFileSync(join(ROOT, 'avmeld.css'), 'utf8');
  for (const klasse of ['avmeld-doc', 'avmeld-kort', 'avmeld-knapp', 'avmeld-status']) {
    assert.match(css, new RegExp(`\\.${klasse}\\b`, 'u'), klasse);
    for (const fil of SIDER) {
      assert.match(readFileSync(join(ROOT, fil), 'utf8'), new RegExp(`class="[^"]*${klasse}`, 'u'), `${fil}: ${klasse}`);
    }
  }
  assert.match(css, /\.avmeld-feil\b/u);
  assert.doesNotMatch(readFileSync(join(ROOT, 'avmeld/index.html'), 'utf8'), /<style>/u);
});

test('det delte skriptet sender u og s til avmeld-endepunktet', () => {
  const js = readFileSync(join(ROOT, 'avmeld.js'), 'utf8');
  assert.match(js, /functions\/v1\/avmeld/u);
  assert.match(js, /q\.get\('u'\)/u);
  assert.match(js, /q\.get\('s'\)/u);
  assert.match(js, /method:\s*'POST'/u);
  assert.match(js, /List-Unsubscribe=One-Click/u);
  assert.match(js, /RFC 8058/u);
  assert.match(js, /avmeldLenke\.ts/u);
  assert.match(js, /Bekreftelsessida/u);
  assert.match(js, /avmeld-status avmeld-feil/u);
});

test('alle sidene har samme funksjonelle elementer', () => {
  for (const fil of SIDER) {
    const html = readFileSync(join(ROOT, fil), 'utf8');
    for (const id of ['bekreft', 'ferdig', 'mangler', 'meldAv', 'status', 'reserve']) {
      assert.match(html, new RegExp(`id="${id}"`, 'u'), `${fil}: ${id}`);
    }
  }
});

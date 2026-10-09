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
  assert.match(css, /\.avmeld-intro \+ \.avmeld-intro/u);
  assert.doesNotMatch(css, /\.doc-intro/u);
  for (const velger of [':root', '*', 'body', 'a']) {
    assert.doesNotMatch(css, new RegExp(`(?:^|\\n)\\s*${velger.replace('*', '\\*')}(?:[\\s,{])`, 'u'), velger);
  }
  assert.match(css, /\.avmeld-rot\s*\{/u);
  assert.match(css, /\.avmeld-rot \*, \.avmeld-rot \*::before, \.avmeld-rot \*::after/u);
  assert.match(css, /body\.avmeld-rot/u);
  assert.match(css, /\.avmeld-rot a\s*\{/u);
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
  assert.match(js, /avmeld-status avmeld-feil/u);
  assert.match(js, /den ekte lenka går til/u);
  assert.match(js, /høflighetssjekk, ikke et/u);
  assert.match(js, /RFC 8058-kroppen/u);
});

test('bokmålssiden beholder forklaringen for reserveflyten uten JavaScript', () => {
  const html = readFileSync(join(ROOT, 'avmeld/index.html'), 'utf8');
  assert.match(html, /Uten JavaScript: samme handling, men skjemaet går rett til funksjonen,/u);
  assert.match(html, /og brukeren lander på dens egen bekreftelsesside\./u);
});

test('alle sidene har samme funksjonelle elementer', () => {
  for (const fil of SIDER) {
    const html = readFileSync(join(ROOT, fil), 'utf8');
    for (const id of ['bekreft', 'ferdig', 'mangler', 'meldAv', 'status', 'reserve']) {
      assert.match(html, new RegExp(`id="${id}"`, 'u'), `${fil}: ${id}`);
    }
  }
});

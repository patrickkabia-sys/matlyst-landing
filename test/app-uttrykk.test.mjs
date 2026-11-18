import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import { behandle } from '../scripts/app-uttrykk.mjs';

const side = (lang, ekstra = '') => `<html lang="${lang}"><head></head><body><nav><div class="nav-right"><a class="link" href="/x">X</a></div></nav><main>${ekstra}<a href="https://apps.apple.com/app/matlyst/id1">a</a><a href="https://play.google.com/store/apps/details?id=app.matlyst">p</a></main></body></html>`;

test('alle språk får nedlastingsknapp og fast linje, og behandlingen er idempotent', () => {
  for (const lang of ['nb', 'sv', 'da', 'en']) {
    const ut = behandle(side(lang), '/x/');
    assert.match(ut, /class="nav-dl"/u, lang);
    assert.match(ut, /id="dl-bar"/u, lang);
    assert.equal(behandle(ut, '/x/'), ut, lang);
  }
});

test('noindex-sider og sider uten butikklenker får ingen nedlastingsknapp', () => {
  const noindex = side('en').replace('<head>', '<head><meta name="robots" content="noindex, follow">');
  assert.equal(behandle(noindex, '/x/'), noindex);
  const utenButikk = '<html lang="en"><body><div class="nav-right"></div></body></html>';
  assert.equal(behandle(utenButikk, '/x/'), utenButikk);
});

test('forsidene får telefoner i heroen og rader med telefon', () => {
  const hero = '<header class="hero locale-home-hero"><div><h1>x</h1></div><div class="hero-side">y</div></header><section class="locale-grid"><article class="locale-card"><h2 class="disp">A</h2><p>a</p></article><article class="locale-card"><h2 class="disp">B</h2><p>b</p><a class="more" href="/en/b">More →</a></article></section>';
  const ut = behandle(side('en', hero), '/en/');
  assert.match(ut, /has-stage/u);
  assert.match(ut, /class="hero-stage"/u);
  assert.equal((ut.match(/class="step-card /gu) ?? []).length, 2);
});

test('hver indekserbar side har nedlastingsknapp og fast linje', () => {
  const rot = new URL('..', import.meta.url).pathname;
  const mangler = [];
  const gaa = (mappe) => {
    for (const d of readdirSync(mappe, { withFileTypes: true })) {
      if (d.isDirectory()) { if (!['node_modules', '.git', 'test-results', 'playwright-report'].includes(d.name)) gaa(`${mappe}/${d.name}`); continue; }
      if (!d.name.endsWith('.html')) continue;
      const html = readFileSync(`${mappe}/${d.name}`, 'utf8');
      if (/<meta name="robots" content="[^"]*noindex/iu.test(html) || !/apps\.apple\.com/u.test(html) || !/class="nav-right"/u.test(html)) continue;
      if (!html.includes('class="nav-dl"') || !html.includes('id="dl-bar"')) mangler.push(`${mappe.replace(rot, '')}/${d.name}`);
    }
  };
  gaa(rot.replace(/\/$/u, ''));
  assert.deepEqual(mangler, []);
});

test('Guider-panelet er skjult til det åpnes (hidden vinner over display)', () => {
  const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(css, /\.nav-panel\[hidden\]\s*\{\s*display:\s*none/u);
});

// Leser den ferdige kaskaden i en ekte nettleser: en senere regel som overstyrer en tidligere,
// eller en regel bak en bredde-betingelse, fanges bare her.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const ROT = fileURLToPath(new URL('..', import.meta.url));
const lenke = (f) => pathToFileURL(join(ROT, f)).href;
const FIKSTUR = `<!doctype html><html lang="nb"><head><meta charset="utf-8">
<link rel="stylesheet" href="${lenke('tokens.css')}"><link rel="stylesheet" href="${lenke('skall.css')}"><link rel="stylesheet" href="${lenke('side.css')}"></head>
<body data-sidetype="guide-lang"><div class="side"><div class="kort"><div class="blad"><main>
<header class="locale-page-hero"><p class="eyebrow">x</p><h1 id="h1">Tittel</h1><p class="lead">l</p></header>
<section class="prose locale-prose"><h2 id="h2">Overskrift</h2><p>Tekst <a id="lenke" href="#">lenke</a> og <a id="mer" class="more" href="#">mer</a>.</p>
<table id="tabell"><thead><tr><th>a</th><th>b</th></tr></thead><tbody><tr><td>1</td><td>2</td></tr></tbody></table></section>
<section class="app-cta"><div class="app-cta-tekst"><h2 id="h2-app">K</h2></div></section>
<section class="related"><h2 id="h2-rel">R</h2><ul><li><a href="#">r</a></li></ul></section>
<section class="faq"><h2 id="h2-faq">F</h2><details open><summary>s</summary><p>Svar <a id="faq-lenke" href="#">l</a></p></details></section>
<section class="page-cta"><h2 id="h2-side">P</h2></section>
<ol class="steps"><li id="s-li">uten tall</li><div class="step" id="s-n"><div class="n" id="n">01</div><div>t</div></div><div class="step" id="s-b"><b id="b">1</b><span>t</span></div></ol>
</main></div></div></div>
<div class="cookie" id="cookie"><h3>t</h3><p>p</p><div class="cookie-actions"><button class="ck-btn ck-accept" id="a">Godta</button><button class="ck-btn ck-reject" id="r">Avvis</button></div></div>
</body></html>`;

let nettleser, mappe, side, url;
before(async () => {
  mappe = mkdtempSync(join(tmpdir(), 'side-css-'));
  const fil = join(mappe, 'fikstur.html');
  writeFileSync(fil, FIKSTUR);
  url = pathToFileURL(fil).href;
  nettleser = await chromium.launch();
});
after(async () => { await nettleser?.close(); if (mappe) rmSync(mappe, { recursive: true, force: true }); });

async function lesPaa(bredde, fn, arg) {
  const ctx = await nettleser.newContext({ viewport: { width: bredde, height: 900 }, reducedMotion: 'reduce' });
  try {
    const p = await ctx.newPage();
    await p.goto(url);
    return await p.evaluate(fn, arg);
  } finally { await ctx.close(); }
}

const px = (v) => Number.parseFloat(v);

test('H1 og alle H2 følger trinnene på 390 og 1280 px', async () => {
  const les = (ider) => Object.fromEntries(ider.map((i) => [i, getComputedStyle(document.getElementById(i)).fontSize]));
  const ider = ['h1', 'h2', 'h2-app', 'h2-rel', 'h2-faq', 'h2-side'];
  const mobil = await lesPaa(390, les, ider);
  const pc = await lesPaa(1280, les, ider);
  assert.equal(px(mobil.h1), 38);
  assert.equal(px(pc.h1), 62);
  for (const i of ider.slice(1)) {
    assert.equal(px(mobil[i]), 26, `${i} på 390 px`);
    assert.equal(px(pc[i]), 34, `${i} på 1280 px`);
  }
});

test('lenker i brødtekst og FAQ er understreket i den ferdige kaskaden (også .more)', async () => {
  for (const bredde of [390, 1280]) {
    const r = await lesPaa(bredde, () => Object.fromEntries(['lenke', 'mer', 'faq-lenke'].map((i) => [i, getComputedStyle(document.getElementById(i)).textDecorationLine])));
    for (const [i, v] of Object.entries(r)) assert.match(v, /underline/u, `${i} på ${bredde} px`);
  }
});

test('et steg har nøyaktig ett tall: eget tall blir sirkel, generert tall bare uten eget', async () => {
  for (const bredde of [390, 1280]) {
    const r = await lesPaa(bredde, () => {
      const f = (id, pseudo) => getComputedStyle(document.getElementById(id), pseudo);
      return {
        liForan: f('s-li', '::before').content, liBredde: f('s-li', '::before').width,
        nForan: f('s-n', '::before').content, bForan: f('s-b', '::before').content,
        nBredde: f('n').width, nBakgrunn: f('n').backgroundColor, bBredde: f('b').width, bBakgrunn: f('b').backgroundColor,
      };
    });
    assert.match(r.liForan, /counter\(steg\)/u, `generert tall uten eget tall (${bredde})`);
    assert.equal(px(r.liBredde), 32);
    assert.equal(r.nForan, 'none', `.step med .n skal ikke ha generert tall (${bredde})`);
    assert.equal(r.bForan, 'none', `.step med b skal ikke ha generert tall (${bredde})`);
    for (const k of ['nBredde', 'bBredde']) assert.equal(px(r[k]), 32);
    for (const k of ['nBakgrunn', 'bBakgrunn']) assert.equal(r[k], 'rgb(20, 18, 16)');
  }
});

test('godta og avvis ser likt ut på alle bredder', async () => {
  const egenskaper = ['backgroundColor', 'color', 'fontSize', 'fontWeight', 'fontFamily', 'lineHeight', 'padding', 'borderTopWidth', 'borderTopColor', 'borderRadius', 'minHeight', 'opacity', 'textDecorationLine', 'textTransform', 'letterSpacing', 'flexGrow', 'boxShadow'];
  for (const bredde of [320, 390, 720, 721, 1000, 1001, 1280]) {
    const r = await lesPaa(bredde, (e) => {
      const les = (id) => Object.fromEntries(e.map((k) => [k, getComputedStyle(document.getElementById(id))[k]]));
      return { godta: les('a'), avvis: les('r') };
    }, egenskaper);
    assert.deepEqual(r.avvis, r.godta, `samtykkeknappene avviker på ${bredde} px`);
  }
});

test('tabellens linjehøyde er 1,55 (prototypen)', async () => {
  const r = await lesPaa(1280, () => { const c = getComputedStyle(document.getElementById('tabell')); return [c.lineHeight, c.fontSize]; });
  assert.ok(Math.abs(px(r[0]) / px(r[1]) - 1.55) < 0.01, r.join(' / '));
});

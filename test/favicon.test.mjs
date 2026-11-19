// Nettsideikonet er honning-logoen (14-honning): to icon-lenker og apple-touch-icon på alle publiserte sider. icon.png er appikonet og røres ikke.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { alleSider } from '../scripts/sidetyper.mjs';

const rot = fileURLToPath(new URL('..', import.meta.url));
const ICO = '<link rel="icon" href="/favicon.ico" sizes="48x48">';
const PNG = '<link rel="icon" type="image/png" sizes="192x192" href="/images/favicon-192.png">';
const APPLE = '<link rel="apple-touch-icon" href="/images/apple-touch-icon.png">';
const MAAL = (f) => { const b = readFileSync(join(rot, f)); return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), farge: b[25] }; };

test('hver publisert side har nøyaktig de to icon-lenkene (ico først) og apple-touch-icon, og ingen icon.png som ikon', () => {
  const sider = alleSider(rot).filter((s) => !/^\/(googleeaf|pinterest-)/u.test(s.sti));
  assert.ok(sider.length >= 800);
  for (const s of sider) {
    const html = readFileSync(join(rot, s.fil), 'utf8');
    const ikoner = [...html.matchAll(/<link[^>]*\brel="(?:shortcut )?icon"[^>]*>/gu)].map((m) => m[0]);
    assert.deepEqual(ikoner, [ICO, PNG], s.sti);
    assert.ok(html.indexOf(ICO) < html.indexOf(PNG), `${s.sti}: ico først`);
    assert.equal(html.split(APPLE).length - 1, 1, `${s.sti}: apple-touch-icon`);
    assert.ok(!/<link[^>]*rel="icon"[^>]*icon\.png/u.test(html), s.sti);
  }
});

test('filene finnes med riktige mål, og apple-touch-icon har ingen gjennomsiktighet', () => {
  assert.deepEqual(MAAL('images/favicon-192.png'), { w: 192, h: 192, farge: 2 });
  assert.equal(MAAL('images/favicon-48.png').w, 48);
  const apple = MAAL('images/apple-touch-icon.png');
  assert.equal(apple.w, 180); assert.equal(apple.h, 180);
  assert.ok(apple.farge === 2 || apple.farge === 3, 'RGB uten alfa');
  const ico = readFileSync(join(rot, 'favicon.ico'));
  assert.equal(ico.readUInt16LE(2), 1, 'ICO');
  const n = ico.readUInt16LE(4);
  const mal = [...Array(n)].map((_, i) => ico[6 + i * 16] || 256).sort((a, b) => a - b);
  assert.deepEqual(mal, [16, 32, 48]);
});

test('appikonet er uendret: icon.png og icon-64.png finnes, og organisasjonslogoen i JSON-LD peker fortsatt på icon.png', () => {
  assert.ok(existsSync(join(rot, 'images/icon.png')) && existsSync(join(rot, 'images/icon-64.png')));
  const html = readFileSync(join(rot, 'index.html'), 'utf8');
  assert.match(html, /"logo":"https:\/\/matlyst-app\.no\/images\/icon\.png"/u);
});

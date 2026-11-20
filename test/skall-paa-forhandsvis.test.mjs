import assert from 'node:assert/strict';
import { cpSync, readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync, existsSync, realpathSync, symlinkSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import test from 'node:test';
import * as skall from '../scripts/skall-paa.mjs';
import { alleSider, EKSEMPEL, UTRULLET, tjenestefamilie } from '../scripts/sidetyper.mjs';

const rot = fileURLToPath(new URL('..', import.meta.url));
const les = (fil) => readFileSync(join(rot, fil), 'utf8');
function kopi(t) {
  const mappe = realpathSync(mkdtempSync(join(tmpdir(), 'skall-forhandsvis-')));
  t.after(() => rmSync(mappe, { recursive: true, force: true }));
  cpSync(join(rot, 'scripts'), join(mappe, 'scripts'), { recursive: true });
  // Familiene (scripts/familier/) leser dataene sine med zod.
  symlinkSync(join(rot, 'node_modules'), join(mappe, 'node_modules'), 'dir');
  const eksempler = new Set(Object.values(EKSEMPEL).flatMap(Object.values));
  const sider = alleSider(rot).filter((s) => eksempler.has(s.sti) || s.type === 'tjeneste');
  for (const s of sider) {
    mkdirSync(dirname(join(mappe, s.fil)), { recursive: true });
    writeFileSync(join(mappe, s.fil), les(s.fil));
  }
  return { mappe, sider };
}

test('CLI lager speilet forhåndsvisning med noindex uten locale.js og bevarer kildesidene', (t) => {
  const { mappe, sider } = kopi(t);
  execFileSync(process.execPath, [join(mappe, 'scripts/skall-paa.mjs'), '--forhandsvis', 'qa/forhandsvisning'], { cwd: tmpdir() });
  const kartfil = join(mappe, 'qa/forhandsvisning/kart.json');
  assert.ok(existsSync(kartfil), 'forhåndsvisningen må skrive kart.json');
  const kart = JSON.parse(readFileSync(kartfil, 'utf8'));
  // 25 eksempelsider, pluss de utrullede tjenestefamiliene: fire avmeldingssider, bekreftelsen, fire vervekort, fire auth-sider, /app/, fire kampanjesider (nb, sv, da, en) og 404.
  assert.equal(kart.length, 25 + 9 + 5 + 5);
  assert.equal(kart.filter((s) => s.type === 'tjeneste').length, 9 + 5 + 5);
  assert.deepEqual(new Set(kart.filter((s) => s.type === 'tjeneste').map((s) => tjenestefamilie(s.sti))), new Set(['avmeld', 'bekreft', 'vervekort', 'auth', 'app', 'kampanje', 'feil']));
  for (const s of sider) {
    assert.equal(readFileSync(join(mappe, s.fil), 'utf8'), les(s.fil), s.sti);
    if (s.type === 'tjeneste') continue;
    const rad = kart.find((r) => r.sti === s.sti);
    assert.deepEqual(rad, { sti: s.sti, url: `/qa/forhandsvisning${s.sti}`, type: s.type, sprak: s.sprak });
    const ut = readFileSync(join(mappe, 'qa/forhandsvisning', s.fil), 'utf8');
    assert.match(ut, /<meta name="robots" content="noindex">/u);
    assert.doesNotMatch(ut, /<script\b[^>]*src=["']\/locale\.js["']/u);
    assert.doesNotMatch(ut, /<meta\b[^>]*content="index, follow"/u);
    const seo = (h) => h.match(/<link\b[^>]*(?:rel="canonical"|hreflang=)[^>]*>/gu);
    assert.deepEqual(seo(ut), seo(les(s.fil)), s.sti);
    if (s.type === 'forside') assert.ok(ut.includes('<header class="topp">'), s.sti);
    else assert.match(ut, /<!-- skall:topp -->/u, s.sti);
  }
  const foer = kart.map((s) => readFileSync(join(mappe, s.url, s.url.endsWith('/') ? 'index.html' : ''), 'utf8'));
  execFileSync(process.execPath, [join(mappe, 'scripts/skall-paa.mjs'), '--forhandsvis', 'qa/forhandsvisning']);
  assert.equal(readFileSync(kartfil, 'utf8'), JSON.stringify(kart, null, 2) + '\n');
  assert.deepEqual(kart.map((s) => readFileSync(join(mappe, s.url, s.url.endsWith('/') ? 'index.html' : ''), 'utf8')), foer);
  assert.deepEqual([...UTRULLET], ['omregner', 'guide-lang', 'guide-kort', 'blogg', 'guide-gammel', 'juss', 'tjeneste:avmeld', 'tjeneste:bekreft', 'tjeneste:vervekort', 'tjeneste:auth', 'tjeneste:app', 'tjeneste:kampanje', 'tjeneste:feil']);
  assert.ok(les('side.css').startsWith('/* == Grunnstil == */'), 'grunnstilarket må finnes før forhåndsvisningen åpnes');
});

test('forhåndsvisning tar med utrullede tjenestefamilier og avviser mål utenfor qa', (t) => {
  assert.equal(typeof skall.forhandsvis, 'function');
  const { mappe } = kopi(t);
  const kart = skall.forhandsvis(mappe, new Set(['tjeneste:auth']), 'qa/forhandsvisning');
  const tjenester = kart.filter((s) => s.type === 'tjeneste');
  assert.equal(tjenester.length, 4);
  assert.ok(tjenester.every((s) => s.sti.includes('tiktok-auth')));
  assert.throws(() => skall.forhandsvis(mappe, new Set(), '.'), /qa/u);
  assert.throws(() => skall.forhandsvis(mappe, new Set(), 'qa/../verktoy'), /qa/u);
});

test('kjor tar forhåndsvisningsvalg og lar kildene stå urørt', (t) => {
  const { mappe, sider } = kopi(t);
  const kart = skall.kjor(mappe, new Set(['omregner']), { forhandsvis: 'qa/api' });
  assert.equal(kart.length, 25);
  assert.deepEqual(JSON.parse(readFileSync(join(mappe, 'qa/api/kart.json'), 'utf8')), kart);
  for (const s of sider) assert.equal(readFileSync(join(mappe, s.fil), 'utf8'), les(s.fil), s.sti);
  assert.match(readFileSync(join(mappe, 'qa/api/verktoy/kopp-til-dl/index.html'), 'utf8'), /<!-- skall:topp -->/u);
});

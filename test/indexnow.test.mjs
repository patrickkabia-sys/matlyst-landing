import assert from 'node:assert/strict';
import test from 'node:test';
import { begrens, endredeUrler, finnNokkel, lagNutlast, send, urlerFraSitemap, urlerMellomCommits } from '../scripts/indexnow.mjs';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rot = fileURLToPath(new URL('..', import.meta.url));

test('nøkkelfila finnes og inneholder nøkkelen', () => {
  assert.match(finnNokkel(rot), /^[0-9a-f]{32}$/u);
});

test('urler hentes fra sitemap og fremmede verter filtreres bort', () => {
  const xml = '<loc>https://matlyst-app.no/a/</loc><loc>https://annen.no/b/</loc>';
  assert.deepEqual(urlerFraSitemap(xml), ['https://matlyst-app.no/a/']);
});

test('nyttelasten har host, key, keyLocation og unike urler', () => {
  const n = lagNutlast({ nokkel: 'k'.repeat(32), urler: ['https://matlyst-app.no/a/', 'https://matlyst-app.no/a/'] });
  assert.equal(n.host, 'matlyst-app.no');
  assert.equal(n.keyLocation, `https://matlyst-app.no/${'k'.repeat(32)}.txt`);
  assert.equal(n.urlList.length, 1);
  assert.throws(() => lagNutlast({ nokkel: 'k', urler: [] }));
});

test('send godtar 200 og 202 og feiler på annet', async () => {
  const n = lagNutlast({ nokkel: 'k'.repeat(32), urler: ['https://matlyst-app.no/a/'] });
  assert.equal(await send(n, async () => ({ status: 202 })), 202);
  await assert.rejects(send(n, async () => ({ status: 403 })));
});

test('alle sitemap-URL-er er på vår vert', () => {
  for (const f of ['sitemap.xml', 'sitemap-sv.xml', 'sitemap-da.xml', 'sitemap-en.xml']) {
    const xml = readFileSyncSafe(f);
    const alle = [...xml.matchAll(/<loc>([^<]+)<\/loc>/gu)].length;
    assert.equal(urlerFraSitemap(xml).length, alle, f);
  }
});

import { readFileSync } from 'node:fs';
function readFileSyncSafe(f) { return readFileSync(new URL(`../${f}`, import.meta.url), 'utf8'); }

const xml = (...par) => `<urlset>${par.map(([u, d]) => `<url><loc>${u}</loc><lastmod>${d}</lastmod></url>`).join('')}</urlset>`;
const A = 'https://matlyst-app.no/a/', B = 'https://matlyst-app.no/b/', C = 'https://matlyst-app.no/c/';

test('bare nye og endrede adresser sendes: uendret, fjernet og fremmed vert gjør det ikke', () => {
  const gammel = xml([A, '2026-01-01'], [B, '2026-01-01']);
  const ny = xml([A, '2026-01-01'], [B, '2026-02-02'], [C, '2026-02-02'], ['https://annen.no/x/', '2026-02-02']);
  assert.deepEqual(endredeUrler(gammel, ny), [B, C]);
  assert.deepEqual(endredeUrler(ny, gammel), [B], 'fjernet C sendes ikke, B har ny dato');
  assert.deepEqual(endredeUrler(ny, ny), []);
});

test('taket begrenser og melder hvor mange som ble utelatt', () => {
  assert.deepEqual(begrens([A, B, C], 2), { urler: [A, B], utelatt: 1 });
  assert.deepEqual(begrens([A], 2), { urler: [A], utelatt: 0 });
});

test('urler mellom to commits utledes fra sidekartene i git', () => {
  const m = mkdtempSync(join(tmpdir(), 'indexnow-'));
  const git = (...a) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...a], { cwd: m, encoding: 'utf8' });
  try {
    git('init', '-q');
    writeFileSync(join(m, 'sitemap.xml'), xml([A, '2026-01-01']));
    git('add', '.'); git('commit', '-qm', 'en');
    const forste = git('rev-parse', 'HEAD').trim();
    writeFileSync(join(m, 'sitemap.xml'), xml([A, '2026-01-01'], [B, '2026-03-03']));
    git('add', '.'); git('commit', '-qm', 'to');
    assert.deepEqual(urlerMellomCommits(m, forste, 'HEAD'), [B]);
    assert.deepEqual(urlerMellomCommits(m, 'HEAD', 'HEAD'), []);
    assert.throws(() => urlerMellomCommits(m, 'finnes-ikke', 'HEAD'), 'ukjent commit skal kaste, ikke sende alt');
  } finally {
    rmSync(m, { recursive: true, force: true });
  }
});

test('arbeidsflyten sender bare etter vellykket publisering, har tak og kan ikke gjøre publiseringen rød', () => {
  const yml = readFileSync(join(rot, '.github/workflows/indexnow.yml'), 'utf8');
  assert.match(yml, /workflows: \['pages build and deployment'\]/u);
  assert.match(yml, /workflow_run\.conclusion == 'success'/u);
  assert.match(yml, /continue-on-error: true/u);
  assert.match(yml, /--maks \d+ --send/u);
  assert.ok(!/secrets\./u.test(yml), 'ingen hemmeligheter trengs');
});

test('uten --send sendes ingenting (tørrkjøring er standard lokalt)', () => {
  const ut = execFileSync(process.execPath, [join(rot, 'scripts/indexnow.mjs')], { encoding: 'utf8' });
  assert.match(ut, /Tørrkjøring/u);
});

test('feil i scriptet gir utgangskode 0', () => {
  const r = execFileSync(process.execPath, [join(rot, 'scripts/indexnow.mjs'), '--fra', 'finnes-ikke-sha'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  assert.equal(r, '');
});

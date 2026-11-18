import assert from 'node:assert/strict';
import test from 'node:test';
import { finnNokkel, lagNutlast, send, urlerFraSitemap } from '../scripts/indexnow.mjs';

const rot = new URL('..', import.meta.url).pathname;

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

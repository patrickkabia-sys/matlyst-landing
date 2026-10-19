import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const ROOT = new URL('..', import.meta.url).pathname;
import { lesSide as les } from './hjelp/side.mjs';

// YouTube API Services Developer Policies III.A.1: egne vilkår skal si at brukeren ved bruk
// godtar å være bundet av YouTubes vilkår, med lenke til https://www.youtube.com/t/terms.
test('vilkårene binder YouTube-import til YouTubes vilkår (nb)', () => {
  const html = les('vilkar.html');
  assert.match(html, /Matlyst bruker YouTube API Services\. Når du importerer fra YouTube, godtar du å være bundet av/u);
  assert.ok(html.includes('href="https://www.youtube.com/t/terms"'));
});

test('vilkårene binder YouTube-import til YouTubes vilkår (sv, da, en)', () => {
  const sider = {
    'sv/villkor/index.html': /Matlyst använder YouTube API Services\. När du importerar från YouTube godkänner du att du är bunden av/u,
    'da/vilkaar/index.html': /Matlyst bruger YouTube API Services\. Når du importerer fra YouTube, accepterer du at være bundet af/u,
    'en/terms/index.html': /Matlyst uses YouTube API Services\. By importing from YouTube, you agree to be bound by/u,
  };
  for (const [fil, setning] of Object.entries(sider)) {
    const html = les(fil);
    assert.match(html, setning, fil);
    assert.ok(html.includes('href="https://www.youtube.com/t/terms"'), fil);
  }
  assert.match(les('sv/villkor/index.html'), /Senast uppdaterad 13 oktober 2026/u);
  assert.match(les('da/vilkaar/index.html'), /Senest opdateret 13\. oktober 2026/u);
  assert.match(les('en/terms/index.html'), /Last updated 13 October 2026/u);
});

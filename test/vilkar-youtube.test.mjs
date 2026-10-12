import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const ROOT = new URL('..', import.meta.url).pathname;
const les = (sti) => readFileSync(join(ROOT, sti), 'utf8');

// YouTube API Services Developer Policies III.A.1: egne vilkår skal si at brukeren ved bruk
// godtar å være bundet av YouTubes vilkår, med lenke til https://www.youtube.com/t/terms.
test('vilkårene binder YouTube-import til YouTubes vilkår (nb)', () => {
  const html = les('vilkar.html');
  assert.match(html, /Matlyst bruker YouTube API Services\. Når du importerer fra YouTube, godtar du å være bundet av/u);
  assert.ok(html.includes('href="https://www.youtube.com/t/terms"'));
});

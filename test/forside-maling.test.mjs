import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { forside } from '../scripts/forside.mjs';
import { TEKST } from '../scripts/forside-tekst.mjs';
const rot = fileURLToPath(new URL('..', import.meta.url));

test('site.js inneholder verken optional chaining eller nullish coalescing', () => {
  const js = readFileSync(join(rot, 'site.js'), 'utf8');
  assert.doesNotMatch(js, /\?\.|\?\?/, 'site.js skal kunne leses uten disse nyere operatorene');
});

test('site.js måler nedlastingsklikk bare gjennom capture, med plassering', () => {
  const js = readFileSync(join(rot, 'site.js'), 'utf8');
  assert.match(js, /closest\('\[data-hent\]'\)/);
  assert.match(js, /capture\('download_click'/);
  assert.doesNotMatch(js.replace(/function capture[\s\S]*?\n  \}/, ''), /posthog\.capture\(/, 'all måling skal gå gjennom capture, som sjekker samtykket');
});

test('en femte handlevare bruker sine egne prikkfarger uten indekskobling', () => {
  const varer = TEKST.nb.middag.handle.varer;
  varer.push({ navn: 'testvare', mengder: ['1 stk', '2 stk'], prikker: [4, 1] });
  try {
    assert.match(forside('nb'), /testvare<\/span><b><i style="--p:var\(--a-prikk4\)"><\/i><i style="--p:var\(--a-prikk1\)">/);
  } finally { varer.pop(); }
});

test('innflygingen har markører for pris, personvern og svar uten ubrukt forsinkelse', () => {
  const html = forside('nb');
  for (const klasse of ['plan', 'plan pro', 'vernblokk', 'svarliste']) assert.match(html, new RegExp(`class="${klasse}" data-inn`));
  assert.doesNotMatch(html, /data-forsink/);
});

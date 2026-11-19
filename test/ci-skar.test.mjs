// CI: Playwright er delt i to skår (matrise og --shard), og enhetstestene kjøres bare i én jobb.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';

const yml = readFileSync(new URL('../.github/workflows/test.yml', import.meta.url), 'utf8');
const jobb = (navn) => { const m = new RegExp(`^  ${navn}:\\n([\\s\\S]*?)(?=^  \\w[\\w-]*:\\n|(?![\\s\\S]))`, 'mu').exec(yml); assert.ok(m, `mangler jobben ${navn}`); return m[1]; };

test('Playwright kjøres i to skår med --shard fra matrisen', () => {
  const e2e = jobb('e2e');
  assert.match(e2e, /matrix:\s*\n\s*skar: \[1, 2\]/u);
  assert.match(e2e, /npx playwright test --shard=\$\{\{ matrix\.skar \}\}\/2/u);
  assert.equal([...yml.matchAll(/playwright test/gu)].length, 1, 'bare ett Playwright-steg');
  assert.ok(!/test:e2e/u.test(yml), 'hele suiten kjøres ikke i ett steg lenger');
});

test('enhetstestene kjøres én gang, i en egen jobb uten Playwright', () => {
  assert.equal([...yml.matchAll(/run: npm test\b/gu)].length, 1);
  assert.match(jobb('enhet'), /run: npm test\b/u);
  assert.ok(!/matrix/u.test(jobb('enhet')) && !/playwright test/u.test(jobb('enhet')));
  assert.ok(!/run: npm test\b/u.test(jobb('e2e')));
});

test('hver jobb som kjører enhetstester som starter Chromium, installerer Chromium', () => {
  const dir = new URL('./', import.meta.url);
  const medChromium = readdirSync(dir).filter((f) => f.endsWith('.test.mjs') && /\bchromium\b/u.test(readFileSync(new URL(f, dir), 'utf8').replace(/\/\/.*$/gmu, '')));
  assert.ok(medChromium.length >= 2, `forventet enhetstester med Chromium, fant ${medChromium}`);
  const jobber = [...yml.matchAll(/^  (\w[\w-]*):\n/gmu)].map((m) => m[1]).filter((n) => /run: npm test\b/u.test(jobb(n)));
  assert.ok(jobber.length >= 1);
  for (const n of jobber) assert.match(jobb(n), /playwright install[^\n]*chromium/u, `jobben ${n} kjører ${medChromium.join(', ')} men installerer ikke Chromium`);
});

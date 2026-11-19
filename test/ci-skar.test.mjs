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

test('seo-autopilot publiserer ingen sider: den stager bare seo-data, og skulle den stage mer, må byggekjeden kjøres først', () => {
  const auto = readFileSync(new URL('../.github/workflows/seo-autopilot.yml', import.meta.url), 'utf8');
  const stages = [...auto.matchAll(/git add ([^\n]+)/gu)].map((m) => m[1].trim());
  assert.ok(stages.length >= 1);
  const bareData = stages.every((s) => s === 'seo-data');
  const kjorerKjeden = /scripts\/kjede\.mjs|node scripts\/skall-paa\.mjs|npm run skall/u.test(auto);
  assert.ok(bareData || kjorerKjeden, `autopiloten stager ${stages.join(', ')} uten å kjøre byggekjeden: sider kunne publiseres uten skall`);
  // Autopiloten kjører SEO-motoren, som bare skriver kildedata (blogg-kilde/auto og seo-data), aldri HTML.
  assert.match(auto, /node seo-motor\/kjor\.mjs/u);
});

test('e2e-jobben installerer hver nettleser Playwright-testene starter (chromium og webkit)', () => {
  const dir = new URL('./playwright/', import.meta.url);
  const kode = readdirSync(dir).filter((f) => f.endsWith('.mjs')).map((f) => readFileSync(new URL(f, dir), 'utf8').replace(/\/\/.*$/gmu, '')).join('\n');
  const nettlesere = ['webkit', 'firefox'].filter((n) => new RegExp(`\\b${n}\\b[^\\n]*(?:launch|from '@playwright/test')|import \\{[^}]*\\b${n}\\b[^}]*\\} from '@playwright/test'`, 'u').test(kode));
  assert.ok(nettlesere.includes('webkit'), 'forventet at en Playwright-test starter WebKit');
  const e2e = jobb('e2e');
  for (const n of ['chromium', ...nettlesere]) assert.match(e2e, new RegExp(`playwright install[^\\n]*\\b${n}\\b`, 'u'), `e2e-jobben installerer ikke ${n}`);
});

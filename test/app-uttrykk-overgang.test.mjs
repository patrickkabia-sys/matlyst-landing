import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { behandle, kjor } from '../scripts/app-uttrykk.mjs';
import { TYPER } from '../scripts/sidetyper.mjs';

const rot = fileURLToPath(new URL('..', import.meta.url));
const generert = readFileSync(join(rot, 'test/fixtures/skall-paa/omregner-nb-generert.html.fiks'), 'utf8');
const sti = '/verktoy/kopp-til-dl/';

test('en regenerert side av en type som ikke er rullet ut, får hele den gamle behandlingen', () => {
  const ut = behandle(generert, sti, new Set());
  for (const del of ['class="nav-meny"', 'class="nav-dl"', 'class="f-kolonner"', 'id="dl-bar"', 'class="brand-ml"', 'data-app-uttrykk="1"']) assert.ok(ut.includes(del), del);
});

test('en utrullet type røres ikke', () => {
  assert.equal(behandle(generert, sti, new Set(['omregner'])), generert);
});

test('en side utenfor registeret behandles som før', () => {
  const side = '<html lang="nb"><head></head><body><nav><div class="nav-right"></div></nav><main><a href="https://apps.apple.com/app/matlyst/id1">a</a><a href="https://play.google.com/store/apps/details?id=app.matlyst">p</a></main><footer></footer></body></html>';
  assert.match(behandle(side, '/x/', new Set(TYPER)), /class="nav-dl"/u);
});

test('kjor skanner bare publiserbare sider', (t) => {
  const mappe = mkdtempSync(join(tmpdir(), 'app-overgang-'));
  t.after(() => rmSync(mappe, { recursive: true, force: true }));
  const skjulte = ['docs', 'test', 'qa', 'scripts', '.arbeid'];
  for (const del of ['verktoy/kopp-til-dl', ...skjulte]) {
    mkdirSync(join(mappe, del), { recursive: true });
    writeFileSync(join(mappe, del, 'index.html'), generert);
  }
  assert.deepEqual(kjor(mappe), ['verktoy/kopp-til-dl/index.html']);
  for (const del of skjulte) assert.equal(readFileSync(join(mappe, del, 'index.html'), 'utf8'), generert, del);
  assert.deepEqual(kjor(mappe), []);
});

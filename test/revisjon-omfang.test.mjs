// Omfang for sidekontrollen på PR-er: full kontroll når delt stil, skall eller skript endres
// (eller når git ikke finner basen), utvalg ellers.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { FULL_MONSTRE, omfang } from '../scripts/revisjon-omfang.mjs';

const ROT = fileURLToPath(new URL('..', import.meta.url));
const SKRIPT = join(ROT, 'scripts', 'revisjon-omfang.mjs');

test('delt stil, skall og skript gir full kontroll', () => {
  for (const f of ['side.css', 'tokens.css', 'site.js', 'skall.js', 'scripts/skall-paa.mjs', 'scripts/sidetyper.mjs',
    'scripts/generer-lokalsider.mjs', 'scripts/familier/felles.mjs', 'test/playwright/revisjon.spec.mjs', 'fonts/x.woff2']) {
    assert.equal(omfang([f]), 'full', f);
  }
});
test('sider, data og maler for én familie gir utvalg', () => {
  for (const f of ['verktoy/dl-til-kopp/index.html', 'scripts/familier/dl-til-gram/data.nb.json',
    'scripts/familier/dl-til-gram/mal-nb.mjs', 'scripts/nb-enhetssider.mjs', 'README.md', 'sitemap.xml']) {
    assert.equal(omfang([f]), 'pr', f);
  }
});
test('én delt fil blant mange sider gir full kontroll', () => {
  assert.equal(omfang(['verktoy/dl-til-kopp/index.html', 'README.md', 'playwright.config.mjs']), 'full');
  assert.equal(omfang(['.github/workflows/revisjon.yml']), 'full');
});
test('stil og skript i undermapper regnes ikke som delt, bare de i rota', () => {
  assert.equal(omfang(['blogg/x/stil.css']), 'pr');
  assert.equal(omfang(['verktoy/x/app.js']), 'pr');
});
test('ukjent grunnlag gir full kontroll', () => {
  assert.equal(omfang(null), 'full');
});
test('mønstrene er en liste av regulære uttrykk', () => {
  assert.ok(FULL_MONSTRE.length >= 10);
  for (const m of FULL_MONSTRE) assert.ok(m instanceof RegExp);
});
test('kommandolinjen leser endringslista fra stdin, og --ukjent gir full', () => {
  const kjor = (args, input) => spawnSync(process.execPath, [SKRIPT, ...args], { input, encoding: 'utf8' });
  assert.equal(kjor([], 'README.md\nsitemap.xml\n').stdout.trim(), 'pr');
  assert.equal(kjor([], 'README.md\nside.css\n').stdout.trim(), 'full');
  assert.equal(kjor([], '').stdout.trim(), 'pr');
  assert.equal(kjor(['--ukjent'], '').stdout.trim(), 'full');
});

const yml = readFileSync(join(ROT, '.github/workflows/revisjon.yml'), 'utf8');
test('arbeidsflyten har ukentlig kjøring, omfangsjobb og ingen typematrise', () => {
  assert.match(yml, /schedule:\s*\n\s*- cron: '0 4 \* \* 1'/u);
  assert.match(yml, /fetch-depth: 0/u);
  assert.match(yml, /REVISJON: pr/u);
  assert.match(yml, /REVISJON: alle/u);
  assert.equal(/type: omregner/u.test(yml), false);
});
test('arbeidsflyten kjører full kontroll på manuell start, og faller tilbake til full når git feiler', () => {
  assert.match(yml, /workflow_dispatch:/u);
  assert.match(yml, /github\.event\.pull_request\.base\.sha/u);
  assert.match(yml, /--ukjent/u);
  assert.match(yml, /REVISJON_ENDRET: /u);
  assert.match(yml, /timeout-minutes: 30/u);
  assert.match(yml, /--shard=\$\{\{ matrix\.skar \}\}\/12/u);
  assert.match(yml, /--shard=\$\{\{ matrix\.skar \}\}\/2/u);
});

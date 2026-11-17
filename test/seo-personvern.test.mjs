import assert from 'node:assert/strict';
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

import { validerOffentlig } from '../seo-motor/offentlig.mjs';

const REPO = new URL('../', import.meta.url);
const HEMMELIGE = [
  'middag med rester fra kjøleskapet',
  'middag med rester i kjøleskapet',
  'middag med rester fra i går',
];

function kopierRepo(t) {
  const mappe = mkdtempSync(join(tmpdir(), 'matlyst-seo-personvern-'));
  t.after(() => rmSync(mappe, { recursive: true, force: true }));
  cpSync(REPO, mappe, {
    recursive: true,
    filter: (kilde) => !['.git', '.superpowers', 'node_modules'].includes(kilde.split('/').at(-1)),
  });
  symlinkSync(fileURLToPath(new URL('../node_modules', import.meta.url)), join(mappe, 'node_modules'), 'dir');
  return mappe;
}

function utenMiljø() {
  const miljø = { ...process.env };
  for (const navn of [
    'SEO_AUTOPILOT',
    'GSC_SERVICE_ACCOUNT_JSON',
    'SEO_DATA_NOKKEL',
  ]) delete miljø[navn];
  return miljø;
}

function typeFor(navn) {
  if (navn === 'publisert.json') return 'publisert';
  if (navn === 'sperre.json') return 'sperre';
  if (navn.startsWith('logg/')) return 'logg';
  if (navn.startsWith('avvist/')) return 'avvist';
  if (navn.startsWith('bestillinger/')) return 'bestilling';
  return null;
}

test('tørr motor og levering lekker ingen søkedata i output eller offentlig JSON', (t) => {
  const mappe = kopierRepo(t);
  const motor = spawnSync(process.execPath, ['seo-motor/kjor.mjs', '--tørt'], {
    cwd: mappe,
    env: utenMiljø(),
    encoding: 'utf8',
  });
  assert.equal(motor.status, 0, `${motor.stdout}\n${motor.stderr}`);

  const levering = spawnSync(process.execPath, [
    'seo-motor/lever.mjs',
    'seo-motor/test/fixtures/lever/bestilling.json',
    'seo-motor/test/fixtures/lever/artikkel.json',
    '--gransking',
    'seo-motor/test/fixtures/lever/gransking.json',
    '--tørt',
  ], {
    cwd: mappe,
    env: utenMiljø(),
    encoding: 'utf8',
  });
  assert.equal(levering.status, 0, `${levering.stdout}\n${levering.stderr}`);

  const offentligOutput = `${motor.stdout}\n${motor.stderr}\n${levering.stdout}\n${levering.stderr}`;
  for (const hemmelig of HEMMELIGE) assert.doesNotMatch(offentligOutput, new RegExp(hemmelig, 'iu'));
  assert.doesNotMatch(offentligOutput, /"(?:sokeord|klikk|visninger|score|poeng|volum)"/iu);

  const dataRot = join(mappe, 'seo-data');
  const konfigurasjon = new Set(['grenser.json', 'forbudt.json', 'kilder.json']);
  const jsonfiler = readdirSync(dataRot, { recursive: true })
    .map(String)
    .filter((navn) => navn.endsWith('.json'))
    .filter((navn) => !navn.startsWith('sprak/'))
    .filter((navn) => !navn.startsWith('instrukser/'))
    .filter((navn) => !konfigurasjon.has(navn));
  assert.ok(jsonfiler.length >= 3);
  for (const navn of jsonfiler) {
    const type = typeFor(navn);
    assert.ok(type, navn);
    const tekst = readFileSync(join(dataRot, navn), 'utf8');
    for (const hemmelig of HEMMELIGE) assert.doesNotMatch(tekst, new RegExp(hemmelig, 'iu'), navn);
    validerOffentlig(type, JSON.parse(tekst));
  }
});

import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync, symlinkSync, existsSync, lstatSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';
import test from 'node:test';
import { kopier } from '../scripts/kjedeproeve.mjs';

const rot = fileURLToPath(new URL('..', import.meta.url));
const node = process.execPath;
const kjede = ['guidelenker', 'lenker-sett', 'skall-paa', 'app-bevis', 'bilde-attributter', 'sprak-signaler'];

test('kjedeprøven kjører i kopi, avgrenser nøkkelen og gir feilkode ved avvik', (t) => {
  assert.ok(existsSync(join(rot, 'scripts/kjedeproeve.mjs')), 'kjedeprøven må finnes');
  const mappe = mkdtempSync(join(tmpdir(), 'kjedeproeve-test-'));
  t.after(() => rmSync(mappe, { recursive: true, force: true }));
  kopier(rot, mappe);
  for (const skript of kjede) execFileSync(node, [`scripts/${skript}.mjs`], { cwd: mappe });
  const kjor = (nokkel) => spawnSync(node, ['scripts/kjedeproeve.mjs', nokkel], { cwd: mappe, encoding: 'utf8' });
  const ren = kjor('omregner');
  assert.equal(ren.status, 0, ren.stdout + ren.stderr);
  assert.match(ren.stdout, /0 avvik for omregner/u);
  const fil = join(mappe, 'verktoy/kopp-til-dl/index.html');
  const gammel = readFileSync(fil, 'utf8').replace('<meta http-equiv="content-language" content="nb-NO">', '');
  writeFileSync(fil, gammel);
  const feil = kjor('omregner');
  assert.equal(feil.status, 1, feil.stdout + feil.stderr);
  assert.match(feil.stdout, /\/verktoy\/kopp-til-dl\//u);
  assert.equal(readFileSync(fil, 'utf8'), gammel, 'arbeidskopien skal ikke repareres av prøven');
  assert.equal(kjor('juss').status, 0, 'avvik i omregner skal ikke telle for juss');
  assert.equal(kjor('ukjent').status, 1, 'ukjent nøkkel skal ikke gi falskt null avvik');
});

test('kjedeprøvens kopi hopper over symlenker, så ingen skriving kan gå ut av kopien', (t) => {
  const utenfor = mkdtempSync(join(tmpdir(), 'kjedeproeve-utenfor-'));
  const kilde = mkdtempSync(join(tmpdir(), 'kjedeproeve-kilde-'));
  const mal = join(mkdtempSync(join(tmpdir(), 'kjedeproeve-mal-')), 'kopi');
  t.after(() => { for (const m of [utenfor, kilde, join(mal, '..')]) rmSync(m, { recursive: true, force: true }); });
  writeFileSync(join(utenfor, 'hemmelig.html'), '<html>urørt</html>');
  mkdirSync(join(kilde, 'ekte'));
  writeFileSync(join(kilde, 'ekte/index.html'), '<html>ekte</html>');
  symlinkSync(utenfor, join(kilde, 'lenket-mappe'), 'dir');
  symlinkSync(join(utenfor, 'hemmelig.html'), join(kilde, 'lenket-fil.html'));
  symlinkSync(join(kilde, 'finnes-ikke'), join(kilde, 'brutt'));
  kopier(kilde, mal);
  assert.ok(existsSync(join(mal, 'ekte/index.html')), 'vanlige filer kopieres');
  const alle = (mappe) => readdirSync(mappe, { withFileTypes: true, recursive: true });
  for (const navn of ['lenket-mappe', 'lenket-fil.html', 'brutt']) assert.equal(lstatSync(join(mal, navn), { throwIfNoEntry: false }), undefined, `${navn} skal ikke finnes i kopien`);
  assert.deepEqual(alle(mal).filter((e) => lstatSync(join(e.parentPath, e.name)).isSymbolicLink()), [], 'ingen symlenker i kopien');
  assert.deepEqual(readdirSync(utenfor), ['hemmelig.html'], 'ingenting skrevet utenfor kopien');
});

test('kjedeprøven skriver ut avvik på andre sider med sti og første avvikende linje, uten å endre koden', (t) => {
  const mappe = mkdtempSync(join(tmpdir(), 'kjedeproeve-andre-'));
  t.after(() => rmSync(mappe, { recursive: true, force: true }));
  kopier(rot, mappe);
  for (const skript of kjede) execFileSync(process.execPath, [`scripts/${skript}.mjs`], { cwd: mappe });
  const fil = join(mappe, 'personvern.html');
  writeFileSync(fil, readFileSync(fil, 'utf8').replace('<meta http-equiv="content-language" content="nb-NO">', ''));
  const r = spawnSync(process.execPath, ['scripts/kjedeproeve.mjs', 'omregner'], { cwd: mappe, encoding: 'utf8' });
  assert.equal(r.status, 0, 'avvik på andre sider skal ikke gi feilkode');
  assert.match(r.stdout, /0 avvik for omregner/u);
  assert.match(r.stdout, /\/personvern\.html\s+linje \d+: .*content-language/u);
});

// Prøv hele byggekjeden (generatorene og etterbehandlingen, scripts/kjede.mjs) i en isolert kopi, aldri mot arbeidskopien,
// og sammenlign resultatet fil for fil med de publiserte sidene. Nøkkelen `alle` teller alle sider.
import { cpSync, existsSync, lstatSync, mkdtempSync, readFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { alleSider, trygtUnderRot } from './sidetyper.mjs';
import { EKSTRA_FILER, KJEDE } from './kjede.mjs';

const UTELATT = new Set(['.git', '.superpowers', 'node_modules', 'qa', 'test-results', 'playwright-report']);

// Første linje som skiller de to filene, ellers null.
function foersteForskjell(a, b) {
  const x = a.toString('utf8').split('\n'), y = b.toString('utf8').split('\n');
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    if (x[i] !== y[i]) return `linje ${i + 1}: ${(y[i] ?? '(mangler)').trim().slice(0, 160)}`;
  }
  return null;
}

// Kopien følger aldri symlenker: de hoppes over, så ingen skriving kan gå ut av kopien.
const ikkeLenke = (kilde) => !lstatSync(kilde).isSymbolicLink();

// Hver skriving må havne inne i kopien (målets forelder finnes alltid når barnet filtreres).
const trygtMal = (mappe, mal) => {
  let naermest = dirname(resolve(mal));
  while (!existsSync(naermest)) naermest = dirname(naermest);
  return resolve(mal) === resolve(mappe) || resolve(naermest) === resolve(mappe) || trygtUnderRot(mappe, naermest);
};

export function kopier(rot, mappe) {
  cpSync(rot, mappe, { recursive: true, dereference: false, filter: (kilde, mal) => !UTELATT.has(basename(kilde)) && ikkeLenke(kilde) && trygtMal(mappe, mal) });
}

export function kjor(rot, nokkel) {
  const foer = alleSider(rot).filter((s) => nokkel === 'alle' || s.nokkel === nokkel);
  if (!foer.length) throw new Error(`Ukjent eller tom nøkkel: ${nokkel ?? '(mangler)'}`);
  const mappe = mkdtempSync(join(tmpdir(), 'matlyst-kjedeproeve-'));
  try {
    kopier(rot, mappe);
    if (existsSync(join(rot, 'node_modules'))) symlinkSync(resolve(rot, 'node_modules'), join(mappe, 'node_modules'), 'dir');
    for (const skript of KJEDE) execFileSync(process.execPath, [`scripts/${skript}.mjs`], { cwd: mappe, stdio: 'pipe' });
    const hent = (rotmappe) => new Map(alleSider(rotmappe).map((s) => [s.fil, s]));
    const alleFoer = hent(rot), alleEtter = hent(mappe);
    const avvik = [], andre = [];
    for (const fil of [...new Set([...alleFoer.keys(), ...alleEtter.keys()])].sort()) {
      const a = alleFoer.get(fil), b = alleEtter.get(fil);
      const side = a ?? b;
      let forskjell = null;
      if (!a) forskjell = 'ny fil';
      else if (!b) forskjell = 'fjernet';
      else {
        const innA = readFileSync(join(rot, fil)), innB = readFileSync(join(mappe, fil));
        if (!innA.equals(innB)) forskjell = foersteForskjell(innA, innB);
      }
      if (forskjell === null) continue;
      if (nokkel === 'alle' || side.nokkel === nokkel || a?.nokkel === nokkel || b?.nokkel === nokkel) avvik.push(side.sti);
      else andre.push({ sti: side.sti, forskjell });
    }
    for (const fil of EKSTRA_FILER) {
      if (!existsSync(join(rot, fil)) && !existsSync(join(mappe, fil))) continue;
      const a = existsSync(join(rot, fil)) ? readFileSync(join(rot, fil)) : null, b = existsSync(join(mappe, fil)) ? readFileSync(join(mappe, fil)) : null;
      if (!a || !b || !a.equals(b)) avvik.push(`/${fil}`);
    }
    return { avvik, andre };
  } finally {
    rmSync(mappe, { recursive: true, force: true });
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length !== 3) throw new Error('Bruk: node scripts/kjedeproeve.mjs <nøkkel>');
    const nokkel = process.argv[2];
    const { avvik, andre } = kjor(fileURLToPath(new URL('..', import.meta.url)), nokkel);
    console.log(`${avvik.length} avvik for ${nokkel}`);
    for (const sti of avvik) console.log(sti);
    if (andre.length) {
      console.log(`${andre.length} avvik på andre sider (nevnes i PR-en, påvirker ikke kode)`);
      for (const { sti, forskjell } of andre) console.log(`  ${sti}  ${forskjell}`);
    }
    if (avvik.length) process.exitCode = 1;
  } catch (feil) {
    console.error(feil.message);
    process.exitCode = 1;
  }
}

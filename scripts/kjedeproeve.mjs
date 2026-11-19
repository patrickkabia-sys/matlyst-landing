// Prøv etterbehandlingen i en isolert kopi. Generatorene kjøres ikke her.
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { alleSider } from './sidetyper.mjs';

const KJEDE = ['guidelenker', 'lenker-sett', 'skall-paa', 'app-uttrykk', 'app-bevis', 'bilde-attributter', 'sprak-signaler'];
const UTELATT = new Set(['.git', '.superpowers', 'node_modules', 'qa', 'test-results', 'playwright-report']);

export function kjor(rot, nokkel) {
  const foer = alleSider(rot).filter((s) => s.nokkel === nokkel);
  if (!foer.length) throw new Error(`Ukjent eller tom nøkkel: ${nokkel ?? '(mangler)'}`);
  const mappe = mkdtempSync(join(tmpdir(), 'matlyst-kjedeproeve-'));
  try {
    cpSync(rot, mappe, { recursive: true, filter: (kilde) => !UTELATT.has(basename(kilde)) });
    if (existsSync(join(rot, 'node_modules'))) symlinkSync(resolve(rot, 'node_modules'), join(mappe, 'node_modules'), 'dir');
    for (const skript of KJEDE) execFileSync('/opt/homebrew/bin/node', [`scripts/${skript}.mjs`], { cwd: mappe, stdio: 'pipe' });
    const etter = alleSider(mappe).filter((s) => s.nokkel === nokkel);
    const opprinnelige = new Map(foer.map((s) => [s.fil, s]));
    const nye = new Map(etter.map((s) => [s.fil, s]));
    return [...new Set([...opprinnelige.keys(), ...nye.keys()])].sort().filter((fil) =>
      !opprinnelige.has(fil) || !nye.has(fil) || !readFileSync(join(rot, fil)).equals(readFileSync(join(mappe, fil)))
    ).map((fil) => (opprinnelige.get(fil) ?? nye.get(fil)).sti);
  } finally {
    rmSync(mappe, { recursive: true, force: true });
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length !== 3) throw new Error('Bruk: node scripts/kjedeproeve.mjs <nøkkel>');
    const nokkel = process.argv[2];
    const avvik = kjor(fileURLToPath(new URL('..', import.meta.url)), nokkel);
    console.log(`${avvik.length} avvik for ${nokkel}`);
    for (const sti of avvik) console.log(sti);
    if (avvik.length) process.exitCode = 1;
  } catch (feil) {
    console.error(feil.message);
    process.exitCode = 1;
  }
}

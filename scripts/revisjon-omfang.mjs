// Hvor stor sidekontrollen skal være på en PR: 'full' (alle klare sider) eller 'pr' (utvalg).
// Delt stil, skall, generatorer og selve revisjonen kan endre alle sider, så da kjøres alt.
// Bruk: git diff --name-only <base>...HEAD | node scripts/revisjon-omfang.mjs
// Feiler git diff (grunn klone, gren fra en gaffel), kalles skriptet med --ukjent og svarer full.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const FULL_MONSTRE = Object.freeze([
  /^[^/]+\.css$/u, // stilark i rota
  /^[^/]+\.js$/u, // skript i rota (site.js, skall.js, locale.js ...)
  /^fonts\//u,
  /^scripts\/skall[^/]*\.mjs$/u,
  /^scripts\/sidetyper\.mjs$/u,
  /^scripts\/rik-sider\.mjs$/u,
  /^scripts\/generer-[^/]*\.mjs$/u,
  /^scripts\/familier\/felles\.mjs$/u,
  /^scripts\/familier\/skjema\.mjs$/u,
  /^test\/playwright\//u,
  /^playwright\.config\.mjs$/u,
  /^\.github\/workflows\/revisjon\.yml$/u,
]);

/** @param {string[] | null} filer endrede filer relativt til repoet, eller null når grunnlaget er ukjent */
export function omfang(filer) {
  if (filer === null) return 'full';
  const rene = filer.map((f) => f.trim().replace(/^\.\//u, '')).filter(Boolean);
  return rene.some((f) => FULL_MONSTRE.some((m) => m.test(f))) ? 'full' : 'pr';
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--ukjent')) {
    console.log(omfang(null));
  } else {
    console.log(omfang(readFileSync(0, 'utf8').split('\n')));
  }
}

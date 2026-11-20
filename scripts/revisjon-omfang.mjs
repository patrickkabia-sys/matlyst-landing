// Hvor stor sidekontrollen skal være på en PR: 'full' (alle klare sider) eller 'pr' (utvalg).
// Regelen er snudd: bare filer som er kjent for å gi tekst eller data til enkeltsider, eller som ikke
// påvirker sidenes utseende, kan gå i utvalg. Alt annet, også en helt ny filtype eller mappe, gir full kontroll.
// Bruk: git -c core.quotePath=false diff --name-only <base>...HEAD | node scripts/revisjon-omfang.mjs
// Feiler git diff (grunn klone, gren fra en gaffel), kalles skriptet med --ukjent og svarer full.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const PR_TRYGGE = Object.freeze([
  // Publiserte sider og sidekart. *.html utenfor test/ og scripts/ (der ligger fiksturer og maler).
  /^(?!test\/|scripts\/).+\.html$/u,
  /^sitemap[^/]*\.xml$/u,
  /^(llms|robots)\.txt$/u,
  // Dokumentasjon og kilde-/dataområder som ikke publiseres som sider.
  /\.md$/u,
  /^docs\//u,
  /^(seo-motor|seo-data|seo|blogg-kilde|qa)\//u,
  // Tester: enhetstester og deres fiksturer, men ikke test/playwright/ (revisjonen selv).
  /^test\/[^/]+\.test\.mjs$/u,
  /^test\/(fiksturer|fasit|hjelp)\//u,
  // Familiene: data og maler per familie, men ikke felles.mjs, skjema.mjs og register.mjs.
  /^scripts\/familier\/[^/]+\/[^/]+$/u,
  // Innholdsmoduler som bare gir tekst til én gruppe sider.
  /^scripts\/[^/]+-enhetssider\.mjs$/u,
  /^scripts\/[^/]+-rike-sider\.mjs$/u,
  /^scripts\/(en-hoytider|nb-jul|nb-om|en-flytting|en-ekstra)\//u,
  /^scripts\/(blogg|forfatter)\.mjs$/u,
  // Drift uten virkning på sidenes utseende.
  /^scripts\/(lastmod[^/]*|llms[^/]*|indexnow|serp-sjekk|sweetspot|kjede[^/]*)\.(mjs|json)$/u,
  // Arbeidsflyter, unntatt selve revisjonen.
  /^\.github\/workflows\/(?!revisjon\.yml$)[^/]+$/u,
  // Bilder som bare bloggen laster. Skallet, forsiden og app-bevisene bruker resten (også images/en-guide).
  /^images\/blogg\//u,
]);

/** @param {string[] | null} filer endrede filer relativt til repoet, eller null når grunnlaget er ukjent */
export function omfang(filer) {
  if (filer === null) return 'full';
  const rene = filer.map((f) => f.trim().replace(/^\.\//u, '')).filter(Boolean);
  // En sti i anførselstegn betyr at git har skrevet æøå som oktaleskaper: vi kan ikke dømme den, så full kontroll.
  if (rene.some((f) => f.startsWith('"'))) return 'full';
  return rene.every((f) => PR_TRYGGE.some((m) => m.test(f))) ? 'pr' : 'full';
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--ukjent')) {
    console.log(omfang(null));
  } else {
    console.log(omfang(readFileSync(0, 'utf8').split('\n')));
  }
}

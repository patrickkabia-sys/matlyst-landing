// Flertall i omregnerens svar («1 kopp», «2 kopper»). Ordformene bor i enheter.mjs (FLERTALL) og skrives
// inn i sidens egne data (omregner-data, feltet `o`); site.js leser dem derfra og har ingen formtabell selv.
// Skriptet bringer eksisterende sider på linje med generatorene (omregnerData og ordFor), og er idempotent.
// Det leser og skriver bare .html-filer som har en omregner; ingen generator kjøres.
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ENHETER, FLERTALL, omregnerData, ordFor } from './enheter.mjs';

const ROT = fileURLToPath(new URL('..', import.meta.url));
const MAPPER = ['verktoy', 'sv/verktyg', 'da/vaerktoejer', 'en/tools'];
const DATA = /(<script type="application\/json" class="omregner-data">)([^<]*)(<\/script>)/u;
const SVAR = /(data-felt="svar">)([^<]*)(<)/u;

/** Tallet slik generatorene skriver det (norsk, svensk og dansk bruker komma og hardt mellomrom, engelsk punktum). */
const tilTall = (t) => Number(t.replace(/[\s ]/gu, '').replace(',', '.'));

/** Setter riktig ordform inn i svaret «<tall> <enhet> = <tall> <enhet>». Andre svar røres ikke. */
export function svarMedOrd(lang, f, svar) {
  const ord = new Map();
  for (const id of Object.keys(f)) {
    for (const form of [ENHETER[id]?.[lang]?.kort, ...(FLERTALL[lang]?.[id] ?? [])]) if (form) ord.set(form, id);
  }
  const ordliste = [...ord.keys()].sort((a, b) => b.length - a.length).map((o) => o.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')).join('|');
  const m = new RegExp(`^(-?[\\d\\s\\u00a0.,]+) (${ordliste}) = (-?[\\d\\s\\u00a0.,]+) (${ordliste})$`, 'u').exec(svar);
  if (!m) return svar;
  const [, a, fra, b, til] = m;
  return `${a} ${ordFor(lang, ord.get(fra), tilTall(a))} = ${b} ${ordFor(lang, ord.get(til), tilTall(b))}`;
}

export function oppdater(html) {
  const lang = /<html\b[^>]*\blang="([a-z]{2})/u.exec(html)?.[1];
  const d = DATA.exec(html);
  if (!lang || !d) return html;
  const data = JSON.parse(d[2]);
  const ny = omregnerData(lang, data.f, data.t);
  let ut = html.replace(DATA, (_, a, _b, c) => `${a}${JSON.stringify(ny)}${c}`);
  ut = ut.replace(SVAR, (_, a, svar, c) => `${a}${svarMedOrd(lang, data.f, svar)}${c}`);
  return ut;
}

function filer(mappe) {
  return readdirSync(mappe).flatMap((n) => {
    const sti = join(mappe, n);
    return statSync(sti).isDirectory() ? filer(sti) : n === 'index.html' ? [sti] : [];
  });
}

export function kjor(rot = ROT) {
  const endret = [];
  for (const fil of MAPPER.flatMap((m) => filer(join(rot, m)))) {
    const html = readFileSync(fil, 'utf8');
    const ut = oppdater(html);
    if (ut !== html) { writeFileSync(fil, ut); endret.push(fil); }
  }
  return endret;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(`omregner-flertall: ${kjor().length} sider oppdatert`);

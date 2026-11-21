// Kontroll mot kilden for familien «airfryer»: hvert tall i datafila har sitatet fra kilden i `merknad`, og hvert utsagn uten tall
// har sitatet i radens `tekst` (nøkkel «kildeid: tema»). Her sjekkes at sitatene fortsatt står ordrett på kildesiden.
// Endrer ingenting når noe avviker; da skrives lista, og koden blir 1. Er alt i orden, settes `kontrollert` og `hentet` til dagens dato.
// Bruk: node scripts/familier/airfryer/kildekontroll.mjs
// Tabellceller blir «a | b», og linjeskift i en celle «a / b», så et sitat fra en tabellrad kan kontrolleres som tekst.
// En PDF (Philips sin brukerhåndbok) leses med pdftotext, både i vanlig og i rå modus (tabellrader og løpende tekst brytes ulikt), og sitatet må stå i den ene.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validerData } from '../felles.mjs';

const ENT = { aring: 'å', aelig: 'æ', oslash: 'ø', Aring: 'Å', AElig: 'Æ', Oslash: 'Ø', ndash: '–', mdash: '—', ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’', deg: '°', eacute: 'é', amp: '&', lt: '<', gt: '>', quot: '"', nbsp: ' ', shy: '' };
const avkod = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/giu, (hel, e) => {
  if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : Number(e.slice(1)));
  return ENT[e] ?? ENT[e.toLowerCase()] ?? hel;
});

/** Kildesidens HTML som én linje tekst, med tabellceller skilt med « | ». */
export function kildetekst(html) {
  let s = String(html).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<svg[\s\S]*?<\/svg>/giu, ' ');
  s = s.replace(/<tr\b[^>]*>([\s\S]*?)<\/tr>/giu, (_, tr) => {
    const celler = [...tr.matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/giu)].map(([, c]) => c.replace(/<br\s*\/?>/giu, ' / ').replace(/<[^>]+>/gu, ''));
    return ` ${celler.map((c) => avkod(c).replace(/\s+/gu, ' ').trim()).join(' | ')} `;
  });
  return avkod(s.replace(/<br\s*\/?>/giu, ' ').replace(/<[^>]+>/gu, ' ')).replace(/­/gu, '').replace(/\s+/gu, ' ');
}

/** Samme normalisering for sitat og kildetekst: ett mellomrom, ingen bløt bindestrek, og ingen mellomrom foran komma og punktum (lenker i kilden gir det). */
export const norm = (t) => t.replace(/­/gu, '').replace(/\s+/gu, ' ').replace(/ ([,.;:])/gu, '$1').trim();

/** Sitat som ikke står i kildeteksten: { id, felt, kilde }[]. `tekster` er { [kildeId]: string[] } (flere tekster for en PDF, sitatet må stå i én av dem). */
export function avvik(data, tekster) {
  const ut = [];
  const finnes = (kilde, sitat) => (tekster[kilde] ?? []).some((t) => t.includes(norm(sitat)));
  for (const r of data.rader) {
    for (const [felt, tall] of Object.entries(r.tall)) {
      if (!tall.merknad || !finnes(tall.kilde, tall.merknad)) ut.push({ id: r.id, felt, kilde: tall.kilde });
    }
    for (const [nokkel, sitat] of Object.entries(r.tekst ?? {})) {
      const kilde = nokkel.split(':')[0];
      if (!finnes(kilde, sitat)) ut.push({ id: r.id, felt: nokkel, kilde });
    }
  }
  return ut;
}

async function hent(k) {
  const svar = await fetch(k.adresse, { headers: { 'user-agent': 'Mozilla/5.0' }, redirect: 'follow' });
  if (!svar.ok) throw new Error(`${k.adresse} svarte ${svar.status}`);
  if (k.adresse.endsWith('.pdf')) {
    const mappe = mkdtempSync(join(tmpdir(), 'airfryer-kilde-'));
    const fil = join(mappe, 'kilde.pdf');
    writeFileSync(fil, Buffer.from(await svar.arrayBuffer()));
    return ['-layout', '-raw'].map((modus) => norm(execFileSync('pdftotext', [modus, fil, '-'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })));
  }
  return [norm(kildetekst(await svar.text()))];
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const fil = fileURLToPath(new URL('./data.nb.json', import.meta.url));
  const data = validerData(JSON.parse(readFileSync(fil, 'utf8')));
  const tekster = {};
  for (const [id, k] of Object.entries(data.kilder)) {
    try { tekster[id] = await hent(k); } catch (e) { console.error(`${id}: ${e.message}`); process.exitCode = 1; }
  }
  const liste = avvik(data, tekster);
  if (liste.length || process.exitCode) {
    for (const a of liste) console.error(`airfryer/${a.id}: sitatet for «${a.felt}» står ikke hos ${a.kilde}`);
    process.exit(1);
  }
  const idag = new Date().toISOString().slice(0, 10);
  const ny = JSON.parse(readFileSync(fil, 'utf8'));
  for (const r of ny.rader) if (r.status === 'kontrollert') r.kontrollert = idag;
  for (const k of Object.values(ny.kilder)) k.hentet = idag;
  writeFileSync(fil, `${JSON.stringify(ny, null, 2)}\n`);
  const antall = ny.rader.reduce((n, r) => n + Object.keys(r.tall).length + Object.keys(r.tekst ?? {}).length, 0);
  console.log(`airfryer: alle ${antall} sitater står hos kilden (${idag})`);
}

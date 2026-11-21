// Kontroll mot kilden for familien «mengde per person»: hvert tall i datafila har sitatet fra kilden i `merknad`, og tekstsitater
// (uten tall, nøkkel «sitat:<kilde>:<n>» i `tekst`) står i samme fil. Her sjekkes at sitatene fortsatt står ordrett på kildesiden.
// Endrer ingenting når noe avviker; da skrives lista og koden blir 1. Er alt i orden, settes `kontrollert` og `hentet` til dagens dato.
// Bruk: node scripts/familier/mengde-per-person/kildekontroll.mjs
// Tabellceller blir «a | b» og linjeskift i en celle «a / b», så et sitat fra en tabellrad kan kontrolleres som tekst.
// En kilde som er en PDF (Helsedirektoratets tabell) leses med pdftotext -layout, og sitatet er teksten slik den står der, med mellomrom slått sammen.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validerData } from '../felles.mjs';

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', nbsp: ' ', shy: '' };
const avkod = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/giu, (hel, e) => {
  if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : Number(e.slice(1)));
  return ENT[e.toLowerCase()] ?? hel;
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

/** PDF-tekst (pdftotext -layout) som én linje. */
export function pdfTekst(bytes) {
  const mappe = mkdtempSync(join(tmpdir(), 'mpp-'));
  try {
    const fil = join(mappe, 'k.pdf');
    writeFileSync(fil, bytes);
    const ut = spawnSync('pdftotext', ['-layout', fil, '-'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    if (ut.status !== 0) throw new Error(`pdftotext feilet: ${ut.stderr}`);
    return ut.stdout.replace(/\s+/gu, ' ');
  } finally { rmSync(mappe, { recursive: true, force: true }); }
}

const norm = (t) => t.replace(/­/gu, '').replace(/\s+/gu, ' ').trim();

/** Sitater som ikke står i kildeteksten: { id, felt, kilde }[]. `tekster` er { [kildeId]: kildetekst }. */
export function avvik(data, tekster) {
  const ut = [];
  for (const r of data.rader) {
    for (const [felt, tall] of Object.entries(r.tall)) {
      const tekst = tekster[tall.kilde];
      if (!tall.merknad || !tekst || !tekst.includes(norm(tall.merknad))) ut.push({ id: r.id, felt, kilde: tall.kilde });
    }
    for (const [felt, sitat] of Object.entries(r.tekst ?? {})) {
      if (!felt.startsWith('sitat:')) continue;
      const kilde = felt.split(':')[1];
      const tekst = tekster[kilde];
      if (!tekst || !tekst.includes(norm(sitat))) ut.push({ id: r.id, felt, kilde });
    }
  }
  return ut;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const fil = join(fileURLToPath(new URL('.', import.meta.url)), 'data.nb.json');
  const data = validerData(JSON.parse(readFileSync(fil, 'utf8')));
  const tekster = {};
  for (const [id, k] of Object.entries(data.kilder)) {
    const svar = await fetch(k.adresse, { headers: { 'user-agent': 'Mozilla/5.0' } });
    if (!svar.ok) throw new Error(`${id}: ${k.adresse} svarte ${svar.status}`);
    const bytes = Buffer.from(await svar.arrayBuffer());
    tekster[id] = bytes.subarray(0, 4).toString('latin1') === '%PDF' ? pdfTekst(bytes) : kildetekst(bytes.toString('utf8'));
  }
  const liste = avvik(data, tekster);
  if (liste.length) {
    for (const a of liste) console.error(`mengde-per-person/${a.id}: sitatet for «${a.felt}» står ikke hos ${a.kilde}`);
    process.exit(1);
  }
  const idag = new Date().toISOString().slice(0, 10);
  const ny = JSON.parse(readFileSync(fil, 'utf8'));
  for (const r of ny.rader) if (r.status === 'kontrollert') r.kontrollert = idag;
  for (const k of Object.values(ny.kilder)) k.hentet = idag;
  writeFileSync(fil, `${JSON.stringify(ny, null, 2)}\n`);
  console.log(`mengde-per-person: alle ${ny.rader.reduce((n, r) => n + Object.keys(r.tall).length + Object.keys(r.tekst ?? {}).filter((k) => k.startsWith('sitat:')).length, 0)} sitater står hos kilden (${idag})`);
}

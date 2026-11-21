// Kontroll mot kilden for familiene «erstatning» og «rester»: hvert tall i datafila har sitatet fra kilden i `merknad`,
// og her sjekkes at sitatet står ordrett på kildesiden. Når noe avviker, skrives lista og koden blir 1.
// Bruk: node scripts/familier/erstatning/kildekontroll.mjs erstatning|rester [nb|en]  (uten marked: nb)
// Tabellceller blir «a | b» og linjeskift i en celle «a / b», så et sitat fra en tabellrad kan kontrolleres som tekst.
// Et tall kan ha flere sitater i merknaden, skilt med « ¦ »: alle må stå på siden.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validerData } from '../felles.mjs';

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', shy: '', aring: 'å', Aring: 'Å', oslash: 'ø', Oslash: 'Ø', aelig: 'æ', AElig: 'Æ', eacute: 'é', egrave: 'è', ndash: '–', mdash: '—', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”', hellip: '…', deg: '°', reg: '®', frac12: '½' };
const avkod = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/giu, (hel, e) => {
  if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : Number(e.slice(1)));
  return ENT[e] ?? ENT[e.toLowerCase()] ?? hel;
});

// Mellomrom foran tegnsetting og etter parentes kommer av lenker og uthevinger i kildens HTML; de teller ikke.
const tegn = (t) => t.replace(/\s+([.,;:!?)])/gu, '$1').replace(/\(\s+/gu, '(');

/** Kildesidens HTML som én linje tekst, med tabellceller skilt med « | ». */
export function kildetekst(html) {
  // Oppskriftssider (TINE) har ingrediensene som JSON-LD i stedet for synlig HTML i tjenerens svar: de tas med som tekst.
  const ld = [...String(html).matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/giu)].map((m) => m[1].replace(/["\[\]{},]+/gu, ' ')).join(' ');
  let s = String(html).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<svg[\s\S]*?<\/svg>/giu, ' ');
  s = s.replace(/<tr\b[^>]*>([\s\S]*?)<\/tr>/giu, (_, tr) => {
    const celler = [...tr.matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/giu)].map(([, c]) => c.replace(/<br\s*\/?>/giu, ' / ').replace(/<[^>]+>/gu, ''));
    return ` ${celler.map((c) => avkod(c).replace(/\s+/gu, ' ').trim()).join(' | ')} `;
  });
  return tegn(`${avkod(s.replace(/<br\s*\/?>/giu, ' ').replace(/<[^>]+>/gu, ' '))} ${ld}`.normalize('NFC').replace(/\u00ad/gu, '').replace(/\s+/gu, ' '));
}

/** PDF-tekst (pdftotext -layout) som én linje. Brukes for kilder som er en PDF (Texas A&M). */
export function pdfTekst(bytes) {
  const mappe = mkdtempSync(join(tmpdir(), 'erstatning-'));
  try {
    const fil = join(mappe, 'k.pdf');
    writeFileSync(fil, bytes);
    const ut = spawnSync('pdftotext', ['-layout', fil, '-'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    if (ut.status !== 0) throw new Error(`pdftotext feilet: ${ut.stderr}`);
    return ut.stdout.replace(/\s+/gu, ' ');
  } finally { rmSync(mappe, { recursive: true, force: true }); }
}

const norm = (t) => tegn(t.normalize('NFC').replace(/\u00ad/gu, '').replace(/\s+/gu, ' ')).trim();
export const SKILLE = ' ¦ ';

/** Tall der minst ett sitat ikke står i kildeteksten: { id, felt, kilde }[]. `tekster` er { [kildeId]: kildetekst }. */
export function avvik(data, tekster) {
  const ut = [];
  for (const r of data.rader) {
    for (const [felt, tall] of Object.entries(r.tall)) {
      const tekst = tekster[tall.kilde];
      const sitater = (tall.merknad ?? '').split(SKILLE).map(norm).filter(Boolean);
      if (!sitater.length || !tekst || !sitater.every((s) => tekst.includes(s))) ut.push({ id: r.id, felt, kilde: tall.kilde });
    }
    // Sitatene som bærer påstander uten tall: «kildeId::sitat» under tekst.
    for (const [felt, verdi] of Object.entries(r.tekst ?? {})) {
      const [kilde, ...resten] = verdi.split('::');
      const sitat = norm(resten.join('::'));
      if (!tekster[kilde] || !sitat || !tekster[kilde].includes(sitat)) ut.push({ id: r.id, felt, kilde });
    }
  }
  return ut;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const familie = process.argv[2];
  const marked = process.argv[3] ?? 'nb';
  const fil = join(fileURLToPath(new URL('..', import.meta.url)), familie, `data.${marked}.json`);
  const data = validerData(JSON.parse(readFileSync(fil, 'utf8')));
  const tekster = {};
  for (const [id, k] of Object.entries(data.kilder)) {
    const svar = await fetch(k.adresse, { headers: { 'user-agent': 'Mozilla/5.0' } });
    if (!svar.ok) throw new Error(`${id}: ${k.adresse} svarte ${svar.status}`);
    tekster[id] = k.adresse.endsWith('.pdf') ? pdfTekst(Buffer.from(await svar.arrayBuffer())) : kildetekst(await svar.text());
  }
  const liste = avvik(data, tekster);
  if (liste.length) {
    for (const a of liste) console.error(`${familie}/${marked}/${a.id}: sitatet for «${a.felt}» står ikke hos ${a.kilde}`);
    process.exit(1);
  }
  const idag = new Date().toISOString().slice(0, 10);
  const ny = JSON.parse(readFileSync(fil, 'utf8'));
  for (const r of ny.rader) if (r.status === 'kontrollert') r.kontrollert = idag;
  for (const k of Object.values(ny.kilder)) k.hentet = idag;
  writeFileSync(fil, `${JSON.stringify(ny, null, 2)}\n`);
  console.log(`${familie}/${marked}: alle ${ny.rader.reduce((n, r) => n + Object.keys(r.tall).length, 0)} tall har sitat som står hos kilden (${idag})`);
}

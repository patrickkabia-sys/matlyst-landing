// Kontroll mot kilden for familiene «holdbarhet» og «frysing»: hvert tall i datafila har sitatet fra kilden i `merknad`,
// og her sjekkes at sitatet fortsatt står ordrett på kildesiden. Endrer ingenting når noe avviker; da skrives lista og koden blir 1.
// Bruk: node scripts/familier/holdbarhet/kildekontroll.mjs holdbarhet|frysing|kjernetemperatur [nb|sv|da|en]
// Setningene prosaen siterer ligger i radens `tekst` som «kildeId|sitat» og kontrolleres på samme måte som tallenes sitater.
// Tabellceller blir «a | b» og linjeskift i en celle «a / b», så et sitat fra en tabellrad kan kontrolleres som tekst.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validerData } from '../felles.mjs';

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', nbsp: ' ', shy: '', aelig: 'æ', AElig: 'Æ', oslash: 'ø', Oslash: 'Ø', aring: 'å', Aring: 'Å', eacute: 'é', egrave: 'è', ouml: 'ö', auml: 'ä', uuml: 'ü', deg: '°', ndash: '–', mdash: '—', laquo: '«', raquo: '»', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”', hellip: '…', frac12: '½' };
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
  return avkod(s.replace(/<br\s*\/?>/giu, ' ').replace(/<[^>]+>/gu, ' ')).replace(/[­​﻿]/gu, '').replace(/\s+/gu, ' ').replace(/ ([,.;:!?])/gu, '$1');
}

/** PDF-kilder (for eksempel Teknologisk Institut): teksten hentes med pdftotext -raw (poppler), som gir sammenhengende setninger. */
export function pdfTekst(bytes) {
  const mappe = mkdtempSync(join(tmpdir(), 'kilde-pdf-'));
  try {
    const fil = join(mappe, 'kilde.pdf');
    writeFileSync(fil, bytes);
    return execFileSync('pdftotext', ['-raw', fil, '-'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).replace(/\s+/gu, ' ');
  } finally {
    rmSync(mappe, { recursive: true, force: true });
  }
}

// Noen kilder (Arla) svarer 404 på en kort user-agent.
// Svenske kilder vil ha et fullt sett nettleserhoder (språk og accept), ellers svarer noen med feil.
const SPRAK = 'sv-SE,sv;q=0.9,da;q=0.9,nb;q=0.8,en;q=0.7';
const ACCEPT = 'text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.8';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

/** Henter siden med fetch, og med curl når fetch ikke får 200 (Arla svarer 404 på Node sin fetch, men 200 på curl). */
export async function hent(adresse, id) {
  try {
    const svar = await fetch(adresse, { headers: { 'user-agent': UA, 'accept-language': SPRAK, accept: ACCEPT } });
    if (svar.ok) return Buffer.from(await svar.arrayBuffer());
  } catch { /* faller tilbake på curl */ }
  try {
    return execFileSync('curl', ['-sfL', '--max-time', '60', '-A', UA, '-H', `Accept-Language: ${SPRAK}`, '-H', `Accept: ${ACCEPT}`, adresse], { maxBuffer: 64 * 1024 * 1024 });
  } catch {
    throw new Error(`${id}: ${adresse} kunne ikke hentes`);
  }
}

// Kildeteksten mister mellomrom foran tegnsetting (se kildetekst), så sitatet normaliseres likt («Charkuterier : 1-2» hos Svenskt Kött).
const norm = (t) => t.replace(/[­​﻿]/gu, '').replace(/\s+/gu, ' ').trim().replace(/ ([,.;:!?])/gu, '$1');

const utenRom = (t) => t.replace(/\s+/gu, '');

/**
 * Tall og setninger der sitatet ikke står i kildeteksten: { id, felt, kilde }[]. `tekster` er { [kildeId]: kildetekst }.
 * Radens `tekst` (valgfritt, «kildeId|sitat») kontrolleres på samme måte som tallene.
 * `utenMellomrom`: kilder (PDF) der pdftotext mister mellomrom mellom ord; der sammenlignes sitat og tekst uten mellomrom.
 */
export function avvik(data, tekster, utenMellomrom = new Set()) {
  const ut = [];
  const finnes = (kilde, sitat) => {
    const tekst = tekster[kilde];
    if (!sitat || !tekst) return false;
    return utenMellomrom.has(kilde) ? utenRom(tekst).includes(utenRom(norm(sitat))) : tekst.includes(norm(sitat));
  };
  for (const r of data.rader) {
    for (const [felt, tall] of Object.entries(r.tall)) {
      if (!finnes(tall.kilde, tall.merknad)) ut.push({ id: r.id, felt, kilde: tall.kilde });
    }
    for (const [felt, verdi] of Object.entries(r.tekst ?? {})) {
      const [kilde, ...rest] = verdi.split('|');
      if (!finnes(kilde, rest.join('|'))) ut.push({ id: r.id, felt, kilde });
    }
  }
  return ut;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // Bruk: kildekontroll.mjs <familie> [marked]. Uten marked kontrolleres alle markeder familien har (data.nb.json, data.sv.json, data.da.json, data.en.json).
  const familie = process.argv[2];
  const mappe = join(fileURLToPath(new URL('..', import.meta.url)), familie);
  const markeder = process.argv[3] ? [process.argv[3]] : ['nb', 'sv', 'da', 'en'].filter((m) => existsSync(join(mappe, `data.${m}.json`)));
  let feilet = false;
  for (const marked of markeder) {
    const fil = join(mappe, `data.${marked}.json`);
    const data = validerData(JSON.parse(readFileSync(fil, 'utf8')));
    const tekster = {};
    const pdf = new Set();
    for (const [id, k] of Object.entries(data.kilder)) {
      const bytes = await hent(k.adresse, id);
      const erPdf = /\.pdf(\?|$)/iu.test(k.adresse) || bytes.subarray(0, 5).toString() === '%PDF-';
      if (erPdf) pdf.add(id);
      tekster[id] = erPdf ? pdfTekst(bytes) : kildetekst(bytes.toString('utf8'));
    }
    const liste = avvik(data, tekster, pdf);
    if (liste.length) {
      feilet = true;
      for (const a of liste) console.error(`${familie}/${marked}/${a.id}: sitatet for «${a.felt}» står ikke hos ${a.kilde}`);
      continue;
    }
    const idag = new Date().toISOString().slice(0, 10);
    const ny = JSON.parse(readFileSync(fil, 'utf8'));
    for (const r of ny.rader) if (r.status === 'kontrollert') r.kontrollert = idag;
    for (const k of Object.values(ny.kilder)) k.hentet = idag;
    writeFileSync(fil, `${JSON.stringify(ny, null, 2)}\n`);
    console.log(`${familie}/${marked}: alle ${ny.rader.reduce((n, r) => n + Object.keys(r.tall).length + Object.keys(r.tekst ?? {}).length, 0)} sitater står hos kilden (${idag})`);
  }
  if (feilet) process.exit(1);
}

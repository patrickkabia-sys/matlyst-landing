// Kontroll mot kilden for familiene «kjernetemperatur» og «steketid»: hvert tall i datafila har sitatet fra kilden i `merknad`,
// og setningene prosaen siterer ligger i radens `tekst` som «kildeId|sitat». Her sjekkes at hvert sitat fortsatt står ordrett på kildesiden.
// Endrer ingenting når noe avviker; da skrives lista og koden blir 1. Uten avvik settes kontrollert og hentet til dagens dato.
// Bruk: node scripts/familier/steketid/kildekontroll.mjs kjernetemperatur|steketid
// Tabellceller blir «a | b» og linjeskift i en celle «a / b», så et sitat fra en tabellrad kan kontrolleres som tekst.
import { readFileSync, writeFileSync } from 'node:fs';
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

const norm = (t) => t.replace(/­/gu, '').replace(/\s+/gu, ' ').trim();

/** Tall der sitatet ikke står i kildeteksten: { id, felt, kilde }[]. `tekster` er { [kildeId]: kildetekst }. */
export function avvik(data, tekster) {
  const ut = [];
  for (const r of data.rader) {
    for (const [felt, tall] of Object.entries(r.tall)) {
      const tekst = tekster[tall.kilde];
      if (!tall.merknad || !tekst || !tekst.includes(norm(tall.merknad))) ut.push({ id: r.id, felt, kilde: tall.kilde });
    }
    for (const [felt, verdi] of Object.entries(r.tekst ?? {})) {
      const [kilde, ...rest] = verdi.split('|');
      const sitat = rest.join('|');
      if (!sitat || !tekster[kilde] || !tekster[kilde].includes(norm(sitat))) ut.push({ id: r.id, felt, kilde });
    }
  }
  return ut;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const familie = process.argv[2];
  const fil = join(fileURLToPath(new URL('..', import.meta.url)), familie, 'data.nb.json');
  if (!['kjernetemperatur', 'steketid'].includes(familie)) throw new Error('Bruk: kildekontroll.mjs kjernetemperatur|steketid');
  const data = validerData(JSON.parse(readFileSync(fil, 'utf8')));
  const tekster = {};
  for (const [id, k] of Object.entries(data.kilder)) {
    const svar = await fetch(k.adresse, { headers: { 'user-agent': 'Mozilla/5.0' } });
    if (!svar.ok) throw new Error(`${id}: ${k.adresse} svarte ${svar.status}`);
    tekster[id] = kildetekst(await svar.text());
  }
  const liste = avvik(data, tekster);
  if (liste.length) {
    for (const a of liste) console.error(`${familie}/${a.id}: sitatet for «${a.felt}» står ikke hos ${a.kilde}`);
    process.exit(1);
  }
  const idag = new Date().toISOString().slice(0, 10);
  const ny = JSON.parse(readFileSync(fil, 'utf8'));
  for (const r of ny.rader) if (r.status === 'kontrollert') { r.kontrollert = idag; r.oppdatert = r.oppdatert > idag ? idag : r.oppdatert; }
  for (const k of Object.values(ny.kilder)) k.hentet = idag;
  writeFileSync(fil, `${JSON.stringify(ny, null, 2)}\n`);
  console.log(`${familie}: alle ${ny.rader.reduce((n, r) => n + Object.keys(r.tall).length + Object.keys(r.tekst ?? {}).length, 0)} sitater står hos kilden (${idag})`);
}

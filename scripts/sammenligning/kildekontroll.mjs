// Kontroll mot kilden for sammenligningssidene: hvert faktum i apper.<marked>.json har ett eller flere sitater, og her
// sjekkes at hvert sitat fortsatt står ordrett på kildesiden (App Store, Google Play eller appens egen nettside).
// Fakta i løpende tekst som ikke hører til et appkort (for eksempel at Mealime er lagt ned) står under `notiser` og sjekkes likt.
// Endrer ingenting når noe avviker; da skrives lista og koden blir 1. Når alt stemmer, settes hentet og sjekket til i dag.
// Bruk: node scripts/sammenligning/kildekontroll.mjs [nb|en|sv|da]   (uten markedet sjekkes alle)
// App Store-sidene hentes med en vanlig nettleser som user-agent og kommer da på engelsk, som sitatene.
// Det engelske markedet bruker amerikansk App Store (/us/) og Google Play med hl=en_US&gl=US.
// Svensk og dansk bruker /se/ og /dk/, Google Play med hl=sv&gl=SE og hl=da&gl=DK, og sitatene ble hentet med
// accept-language sv-SE og da-DK. Svensk App Store svarer på svensk; dansk App Store viser beskrivelsen på appens språk
// og resten av siden på engelsk, og Listonic sender da videre til /sv og /da.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const MARKEDER = ['nb', 'en', 'sv', 'da'];
// Norske sitater ble hentet uten accept-language (noen nettsider svarer da på engelsk).
const SPRAK = { en: 'en-US,en;q=0.9', sv: 'sv-SE,sv;q=0.9', da: 'da-DK,da;q=0.9' };
const fil = (marked) => fileURLToPath(new URL(`./apper.${marked}.json`, import.meta.url));
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15';
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', shy: '' };
const avkod = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/giu, (hel, e) => {
  if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : Number(e.slice(1)));
  return ENT[e.toLowerCase()] ?? hel;
});

/** Kildesidens HTML som én linje tekst. */
export function kildetekst(html) {
  const s = String(html).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<svg[\s\S]*?<\/svg>/giu, ' ');
  return avkod(s.replace(/<br\s*\/?>/giu, ' ').replace(/<[^>]+>/gu, ' ')).replace(/­/gu, '').replace(/\s+/gu, ' ');
}

const norm = (t) => String(t).replace(/­/gu, '').replace(/\s+/gu, ' ').trim();

/** Alle sitater i datafila: { app, felt, kilde, sitat }[]. */
export function sitater(data) {
  const ut = [];
  for (const [app, a] of Object.entries(data.apper)) {
    for (const [felt, f] of Object.entries(a.fakta)) for (const k of f.kilder ?? []) ut.push({ app, felt, kilde: k.kilde, sitat: k.sitat });
  }
  for (const [felt, f] of Object.entries(data.notiser ?? {})) for (const k of f.kilder ?? []) ut.push({ app: 'notiser', felt, kilde: k.kilde, sitat: k.sitat });
  return ut;
}

/** Sitater som ikke står i kildeteksten. `tekster` er { [kildeId]: kildetekst }. */
export const avvik = (data, tekster) => sitater(data).filter((s) => !tekster[s.kilde]?.includes(norm(s.sitat)));

async function kontroller(marked) {
  const FIL = fil(marked);
  const data = JSON.parse(readFileSync(FIL, 'utf8'));
  const tekster = {};
  for (const [id, k] of Object.entries(data.kilder)) {
    // App Store svarer 429 når vi spør for tett: vent litt mellom hver side, og prøv igjen ved 429.
    let svar;
    for (let forsok = 0; forsok < 4; forsok += 1) {
      await new Promise((ok) => setTimeout(ok, 1500 * (forsok + 1)));
      svar = await fetch(k.adresse, { headers: { 'user-agent': UA, ...(SPRAK[marked] ? { 'accept-language': SPRAK[marked] } : {}) } });
      if (svar.status !== 429) break;
    }
    if (!svar.ok) throw new Error(`${marked}/${id}: ${k.adresse} svarte ${svar.status}`);
    tekster[id] = kildetekst(await svar.text());
  }
  const liste = avvik(data, tekster);
  if (liste.length) {
    for (const a of liste) console.error(`${marked} ${a.app}/${a.felt}: sitatet «${a.sitat}» står ikke hos ${a.kilde}`);
    return false;
  }
  const idag = new Date().toISOString().slice(0, 10);
  data.sjekket = idag;
  for (const k of Object.values(data.kilder)) k.hentet = idag;
  writeFileSync(FIL, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`sammenligning ${marked}: alle ${sitater(data).length} sitater står hos kilden (${idag})`);
  return true;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const valgt = process.argv[2] ? [process.argv[2]] : MARKEDER;
  for (const m of valgt) if (!MARKEDER.includes(m)) throw new Error(`ukjent marked «${m}» (${MARKEDER.join(', ')})`);
  let ok = true;
  for (const m of valgt) ok = (await kontroller(m)) && ok;
  if (!ok) process.exit(1);
}

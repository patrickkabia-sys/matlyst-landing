// Kontroll mot kilden for sammenligningssidene: hvert faktum i apper.nb.json har ett eller flere sitater, og her
// sjekkes at hvert sitat fortsatt står ordrett på kildesiden (App Store, Google Play eller appens egen nettside).
// Endrer ingenting når noe avviker; da skrives lista og koden blir 1. Når alt stemmer, settes hentet og sjekket til i dag.
// Bruk: node scripts/nb-sammenligning/kildekontroll.mjs
// App Store-sidene hentes med en vanlig nettleser som user-agent og kommer da på engelsk, som sitatene.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const FIL = fileURLToPath(new URL('./apper.nb.json', import.meta.url));
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
  return ut;
}

/** Sitater som ikke står i kildeteksten. `tekster` er { [kildeId]: kildetekst }. */
export const avvik = (data, tekster) => sitater(data).filter((s) => !tekster[s.kilde]?.includes(norm(s.sitat)));

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const data = JSON.parse(readFileSync(FIL, 'utf8'));
  const tekster = {};
  for (const [id, k] of Object.entries(data.kilder)) {
    // App Store svarer 429 når vi spør for tett: vent litt mellom hver side, og prøv igjen ved 429.
    let svar;
    for (let forsok = 0; forsok < 4; forsok += 1) {
      await new Promise((ok) => setTimeout(ok, 1500 * (forsok + 1)));
      svar = await fetch(k.adresse, { headers: { 'user-agent': UA } });
      if (svar.status !== 429) break;
    }
    if (!svar.ok) throw new Error(`${id}: ${k.adresse} svarte ${svar.status}`);
    tekster[id] = kildetekst(await svar.text());
  }
  const liste = avvik(data, tekster);
  if (liste.length) {
    for (const a of liste) console.error(`${a.app}/${a.felt}: sitatet «${a.sitat}» står ikke hos ${a.kilde}`);
    process.exit(1);
  }
  const idag = new Date().toISOString().slice(0, 10);
  data.sjekket = idag;
  for (const k of Object.values(data.kilder)) k.hentet = idag;
  writeFileSync(FIL, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`sammenligning: alle ${sitater(data).length} sitater står hos kilden (${idag})`);
}

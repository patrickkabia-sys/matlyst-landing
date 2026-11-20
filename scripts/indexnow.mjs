// IndexNow: varsler Bing, Yandex og andre om nye eller endrede sider.
// Lokalt er det alltid tørrkjøring (skriver bare listen). Sending krever --send og gjøres av
// .github/workflows/indexnow.yml etter at Pages har publisert. Nøkkelfila ligger i rota og heter <nøkkel>.txt.
//
// Bruk:
//   node scripts/indexnow.mjs                          alle adresser i sidekartene (tørrkjøring)
//   node scripts/indexnow.mjs --alle --send           hele sidekartene, med tak (må være uttrykkelig)
//   node scripts/indexnow.mjs --fra <sha> [--til <sha>] [--maks N] [--send]
//       bare adresser som er NYE eller har ENDRET lastmod i sidekartene mellom to commits.
//       lastmod er innholdsdato (scripts/lastmod.mjs), så en ren rammeendring gir ingen adresser.
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HOST = 'matlyst-app.no';
const ENDEPUNKT = 'https://api.indexnow.org/IndexNow';

export function finnNokkel(mappe) {
  const filer = readdirSync(mappe).filter((f) => /^[0-9a-f]{32}\.txt$/u.test(f));
  if (filer.length !== 1) throw new Error(`Forventet én nøkkelfil, fant ${filer.length}`);
  const nokkel = filer[0].slice(0, -4);
  if (readFileSync(join(mappe, filer[0]), 'utf8').trim() !== nokkel) throw new Error('Nøkkelfila må inneholde nøkkelen');
  return nokkel;
}

export function urlerFraSitemap(xml, host = HOST) {
  return [...xml.matchAll(/<loc>(https:\/\/[^<]+)<\/loc>/gu)].map((m) => m[1]).filter((u) => new URL(u).host === host);
}

export const SITEMAPER = ['sitemap.xml', 'sitemap-sv.xml', 'sitemap-da.xml', 'sitemap-en.xml'];
export const STANDARD_MAKS = 500;

function urlMedDato(xml, host = HOST) {
  const kart = new Map();
  for (const [, url, dato] of xml.matchAll(/<loc>(https:\/\/[^<]+)<\/loc>\s*(?:<lastmod>([^<]*)<\/lastmod>)?/gu)) {
    if (new URL(url).host === host) kart.set(url, dato ?? '');
  }
  return kart;
}

// Adresser som er nye (finnes ikke i gammel) eller har fått annen lastmod. Fjernede adresser sendes ikke.
export function endredeUrler(gammelXml, nyXml, host = HOST) {
  const gammel = urlMedDato(gammelXml, host);
  return [...urlMedDato(nyXml, host)].filter(([url, dato]) => !gammel.has(url) || gammel.get(url) !== dato).map(([url]) => url).sort();
}

// Tak per kjøring. Resten rapporteres, ikke sendes stille.
export function begrens(urler, maks = STANDARD_MAKS) {
  return { urler: urler.slice(0, maks), utelatt: Math.max(0, urler.length - maks) };
}

export function urlerMellomCommits(rot, fra, til = 'HEAD', git = (...a) => execFileSync('git', a, { cwd: rot, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })) {
  for (const sha of [fra, til]) git('rev-parse', '--verify', `${sha}^{commit}`);
  // Begge commitene er verifisert over, så en fil som mangler i en av dem betyr bare at den ikke fantes da.
  const les = (sha, fil) => { try { return git('show', `${sha}:${fil}`); } catch { return ''; } };
  return SITEMAPER.flatMap((fil) => endredeUrler(les(fra, fil), les(til, fil)));
}

export function lagNutlast({ nokkel, urler, host = HOST }) {
  if (!urler.length) throw new Error('Ingen URL-er');
  if (urler.length > 10000) throw new Error('Maks 10 000 URL-er per kall');
  return { host, key: nokkel, keyLocation: `https://${host}/${nokkel}.txt`, urlList: [...new Set(urler)] };
}

export async function send(nyttlast, hent = fetch) {
  const svar = await hent(ENDEPUNKT, { method: 'POST', headers: { 'content-type': 'application/json; charset=utf-8' }, body: JSON.stringify(nyttlast) });
  if (![200, 202].includes(svar.status)) throw new Error(`IndexNow svarte ${svar.status}`);
  return svar.status;
}

// Verdien etter et flagg, eller null. En verdi som mangler, er tom eller ser ut som et nytt flagg regnes som mangler.
export function flaggVerdi(args, navn) {
  const i = args.indexOf(navn);
  if (i < 0) return undefined;
  const v = args[i + 1];
  return v && !v.startsWith('--') ? v : null;
}

// Hva som skal sendes, avgjort før noe nett er i nærheten. Feiler lukket: alt uklart gir { avbrutt }.
//   --fra <sha>  bare nye og endrede adresser siden <sha>
//   --alle       hele sidekartene (kreves uttrykkelig for å sende uten --fra)
// Taket gjelder alle veier. Uten --send er det tørrkjøring, også for --alle.
export function planlegg(args, rot, git) {
  const send = args.includes('--send');
  const maks = Number(flaggVerdi(args, '--maks') ?? STANDARD_MAKS);
  if (!Number.isInteger(maks) || maks < 1) return { avbrutt: '--maks må være et positivt heltall' };
  let urler;
  if (args.includes('--fra')) {
    const fra = flaggVerdi(args, '--fra');
    if (!fra) return { avbrutt: '--fra mangler verdi, sender ingenting' };
    const til = args.includes('--til') ? flaggVerdi(args, '--til') : 'HEAD';
    if (!til) return { avbrutt: '--til mangler verdi, sender ingenting' };
    try { urler = urlerMellomCommits(rot, fra, til, git); } catch (feil) { return { avbrutt: `kunne ikke sammenligne ${fra} med ${til}: ${feil.message.split('\n')[0]}` }; }
  } else if (args.includes('--alle') || !send) {
    const filer = args.filter((a) => a.endsWith('.xml'));
    urler = (filer.length ? filer : SITEMAPER).flatMap((f) => urlerFraSitemap(readFileSync(join(rot, f), 'utf8')));
  } else {
    return { avbrutt: '--send krever --fra <sha> eller uttrykkelig --alle' };
  }
  return { send, ...begrens(urler, maks) };
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1] === fileURLToPath(import.meta.url)) {
  const rot = fileURLToPath(new URL('../', import.meta.url));
  try {
    const plan = planlegg(process.argv.slice(2), rot);
    if (plan.avbrutt) { console.warn(`IndexNow: ${plan.avbrutt}`); process.exit(0); }
    if (!plan.urler.length) { console.log('IndexNow: ingen nye eller endrede adresser, ingenting å sende.'); process.exit(0); }
    const nyttlast = lagNutlast({ nokkel: finnNokkel(rot), urler: plan.urler });
    if (plan.utelatt) console.warn(`IndexNow: ${plan.utelatt} adresser over taket utelatt`);
    if (plan.send) console.log('Sendt', nyttlast.urlList.length, 'adresser, status', await send(nyttlast));
    else console.log(`Tørrkjøring: ${nyttlast.urlList.length} URL-er, nøkkelfil ${nyttlast.keyLocation}. Bruk --send for å sende.`);
  } catch (feil) {
    // Et varsel som ikke går gjennom skal aldri gjøre publiseringen rød.
    console.warn(`IndexNow feilet, publiseringen påvirkes ikke: ${feil.message}`);
    process.exit(0);
  }
}

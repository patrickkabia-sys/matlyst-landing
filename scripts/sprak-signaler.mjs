// Setter <meta http-equiv="content-language"> på hver side, utledet fra <html lang>.
// Bing vektlegger språkattributtet og content-language sterkere enn hreflang, og toppdomenet vårt
// er .no, så uten tydelig språk- og landsignal kan Bing knytte alle språkvariantene til Norge.
//
// Kjøres ETTER generatorene (som guidelenker.mjs): node scripts/sprak-signaler.mjs
// Idempotent. Rører ikke <html lang>, fordi generatorene og testene leter etter nøyaktige verdier,
// og hopper over sider med noindex (verve- og støttesider, som også har generatortester).
// Låst av test/sprak-signaler.test.mjs.
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

export const KODER = { no: 'nb-NO', nb: 'nb-NO', sv: 'sv-SE', da: 'da-DK', en: 'en-US' };
const TAGG = /<meta http-equiv="content-language" content="[^"]*">/u;
const UTELATT_MAPPER = new Set(['node_modules', '.git', 'test-results', 'playwright-report']);

/** Landkode for en side, fra <html lang="...">. null hvis siden ikke har en kjent verdi. */
export function kodeFor(html) {
  const lang = html.match(/<html[^>]*\blang="([^"]+)"/u)?.[1];
  return lang ? (KODER[lang.toLowerCase()] ?? null) : null;
}

/** Legger inn eller oppdaterer taggen. Returnerer html uendret hvis siden ikke skal ha den. */
export function settInn(html) {
  const kode = kodeFor(html);
  if (!kode || !/<head[\s>]/u.test(html)) return html;
  if (/content="noindex/u.test(html)) return html; // støttesider som ikke indekseres trenger ikke taggen
  const tagg = `<meta http-equiv="content-language" content="${kode}">`;
  if (TAGG.test(html)) return html.replace(TAGG, tagg);
  if (/<meta charset="[^"]*">/iu.test(html)) return html.replace(/(<meta charset="[^"]*">)/iu, `$1\n${tagg}`);
  return html.replace(/(<head[^>]*>)/u, `$1\n${tagg}`);
}

function* htmlFiler(mappe) {
  for (const navn of readdirSync(mappe)) {
    if (UTELATT_MAPPER.has(navn)) continue;
    const sti = join(mappe, navn);
    if (statSync(sti).isDirectory()) yield* htmlFiler(sti);
    else if (navn.endsWith('.html')) yield sti;
  }
}

export function kjor(rot) {
  const endret = [];
  for (const fil of htmlFiler(rot)) {
    const html = readFileSync(fil, 'utf8');
    const ny = settInn(html);
    if (ny !== html) {
      writeFileSync(fil, ny);
      endret.push(relative(rot, fil));
    }
  }
  return endret;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const rot = fileURLToPath(new URL('..', import.meta.url));
  const endret = kjor(rot);
  console.log(`content-language: ${endret.length} sider oppdatert`);
}

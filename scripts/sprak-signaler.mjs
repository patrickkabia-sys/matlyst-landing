// Setter <meta http-equiv="content-language"> på hver indekserbar side, utledet fra <html lang>.
// Bing vektlegger språkattributtet og content-language sterkere enn hreflang, og toppdomenet vårt
// er .no, så uten tydelig språk- og landsignal kan Bing knytte alle språkvariantene til Norge.
//
// Kjøres ETTER generatorene (som guidelenker.mjs): node scripts/sprak-signaler.mjs
// Generatorene skriver sidene på nytt uten taggen, så kjør skriptet etter hver generering.
// Idempotent. Rører ikke <html lang>, fordi generatorene og testene leter etter nøyaktige verdier,
// og hopper over sider med noindex (verve- og støttesider, som også har generatortester).
// Leser HTML med tåle regler: enkle eller doble anførselstegn, store eller små bokstaver, vilkårlig
// attributtrekkefølge, og kommentarer ignoreres. Låst av test/sprak-signaler.test.mjs.
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

export const KODER = { no: 'nb-NO', nb: 'nb-NO', sv: 'sv-SE', da: 'da-DK', en: 'en-US' };
const UTELATT_MAPPER = new Set(['node_modules', '.git', 'test-results', 'playwright-report']);
const ROBOT_NAVN = new Set(['robots', 'googlebot', 'bingbot']);

/** Kommentarer erstattes med like mange mellomrom, så posisjoner er like i begge tekstene. */
function utenKommentarer(html) {
  return html.replace(/<!--[\s\S]*?-->/gu, (m) => ' '.repeat(m.length));
}

/** Verdien til et attributt i én tagg, eller null. Krever mellomrom foran navnet (ikke data-lang). */
function attributt(tagg, navn) {
  const m = tagg.match(new RegExp(`\\s${navn}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'>]+))`, 'iu'));
  return m ? (m[1] ?? m[2] ?? m[3]) : null;
}

/** Landkode for en side, fra <html lang="...">. null hvis siden ikke har en kjent verdi. */
export function kodeFor(html) {
  const htmlTagg = utenKommentarer(html).match(/<html\b[^>]*>/iu)?.[0];
  const lang = htmlTagg ? attributt(htmlTagg, 'lang') : null;
  return lang ? (KODER[lang.trim().toLowerCase()] ?? null) : null;
}

/** Sann bare når en robots-, googlebot- eller bingbot-meta sier noindex. Annen tekst teller ikke. */
export function erNoindex(html) {
  return [...utenKommentarer(html).matchAll(/<meta\b[^>]*>/giu)].some((m) => {
    const navn = attributt(m[0], 'name')?.trim().toLowerCase();
    return ROBOT_NAVN.has(navn) && /noindex/iu.test(attributt(m[0], 'content') ?? '');
  });
}

/** Legger inn eller oppdaterer taggen. Returnerer html uendret hvis siden ikke skal ha den. */
export function settInn(html) {
  const kode = kodeFor(html);
  const maske = utenKommentarer(html);
  const headStart = maske.match(/<head\b[^>]*>/iu);
  if (!kode || !headStart || erNoindex(html)) return html;
  const tagg = `<meta http-equiv="content-language" content="${kode}">`;

  // Eksisterende content-language-tagger, uansett attributtrekkefølge og anførselstegn.
  const finnes = [...maske.matchAll(/<meta\b[^>]*>/giu)].filter(
    (m) => attributt(m[0], 'http-equiv')?.trim().toLowerCase() === 'content-language',
  );
  if (finnes.length > 0) {
    let ut = html;
    for (const m of [...finnes].reverse()) {
      const erForste = m === finnes[0];
      ut = ut.slice(0, m.index) + (erForste ? tagg : '') + ut.slice(m.index + m[0].length);
    }
    return ut;
  }

  const etterHead = headStart.index + headStart[0].length;
  const charset = [...maske.matchAll(/<meta\b[^>]*\bcharset\b[^>]*>/giu)].find((m) => m.index >= etterHead);
  const pos = charset ? charset.index + charset[0].length : etterHead;
  return `${html.slice(0, pos)}\n${tagg}${html.slice(pos)}`;
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

import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

function htmlTekst(tekst) {
  return tekst.replace(/<[^>]*>/g, '').replace(/&(?:nbsp|amp|lt|gt|quot|apos);|&#(?:x[0-9a-f]+|\d+);/gi, tegn => {
    const navn = tegn.slice(1, -1).toLowerCase();
    const kjente = { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
    if (navn[0] !== '#') return kjente[navn];
    const kode = navn[1] === 'x' ? parseInt(navn.slice(2), 16) : Number(navn.slice(1));
    return kode <= 0x10ffff ? String.fromCodePoint(kode) : '';
  });
}

export function domainsFromDdgHtml(html) {
  const domener = [];
  for (const lenke of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a\s*>/gi)) {
    const klasse = /(?:^|\s)class\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(lenke[1]);
    if (!klasse || !(klasse[1] ?? klasse[2] ?? klasse[3]).split(/\s+/).includes('result__url')) continue;
    const token = htmlTekst(lenke[2]).trim().split(/\s+/)[0];
    if (!token) continue;
    try {
      const url = new URL(/^https?:\/\//i.test(token) ? token : `https://${token.replace(/^\/\//, '')}`);
      const vert = url.hostname.toLowerCase().replace(/^www\./, '');
      if (!vert) continue;
      // Duplikater beholdes fordi hvert treff opptar en plass på resultatsiden.
      domener.push(vert);
      if (domener.length === 10) break;
    } catch {
      // Uleselige resultatlenker gir ikke et domene.
    }
  }
  return domener;
}

const sovStandard = ms => new Promise(ferdig => setTimeout(ferdig, ms));
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15';

export async function fetchSerp(keyword, { fetchFn = fetch, ventMs = 1600, forsok = 2, sov = sovStandard } = {}) {
  for (let forsøk = 0; forsøk < forsok; forsøk++) {
    if (forsøk > 0) await sov(4000);
    else if (ventMs > 0) await sov(ventMs);
    try {
      const svar = await fetchFn(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(keyword)}`, {
        headers: { 'User-Agent': USER_AGENT },
      });
      if (!svar.ok) continue;
      const domener = domainsFromDdgHtml(await svar.text());
      if (domener.length) return domener;
    } catch {
      // Nettverksfeil behandles som et tomt resultat og kan prøves på nytt.
    }
  }
  return [];
}

async function cli() {
  const { values } = parseArgs({ options: { ord: { type: 'string' }, ut: { type: 'string' } } });
  if (!values.ord || !values.ut) throw new Error('Oppgi --ord og --ut.');
  const ord = [...new Set((await readFile(values.ord, 'utf8')).split(/\r?\n/).map(linje => linje.trim().toLowerCase()).filter(Boolean))];
  const resultat = Object.create(null);
  for (const [indeks, søkeord] of ord.entries()) {
    console.error(`${indeks + 1}/${ord.length}: ${søkeord}`);
    resultat[søkeord] = { domener: await fetchSerp(søkeord) };
  }
  await writeFile(values.ut, `${JSON.stringify(resultat, null, 2)}\n`, 'utf8');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  cli().catch(feil => { console.error(`Kunne ikke sjekke søkeresultatene: ${feil.message}`); process.exitCode = 1; });
}

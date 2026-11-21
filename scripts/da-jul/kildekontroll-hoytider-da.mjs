// Kontroll mot kilden for de danske høytidssidene (/da/julefrokost/, /da/juleaften/): hvert sitat i hoytider.data.da.json skal stå ordrett på kildesiden.
// Bruk: node scripts/da-jul/kildekontroll-hoytider-da.mjs   (nett kreves; avvik skrives og koden blir 1)
// Arla svarer 404 på Node sin fetch, men 200 på curl, så curl er reserve.
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { kildetekst } from '../familier/holdbarhet/kildekontroll.mjs';
import { avvik } from '../nb-jul/kildekontroll-hoytider.mjs';
import { DATA_DA } from './felles-da.mjs';

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
const hent = async (url, id) => {
  try {
    const svar = await fetch(url, { headers: { 'user-agent': UA, 'accept-language': 'da-DK,da;q=0.9' } });
    if (svar.ok) return await svar.text();
  } catch { /* faller tilbake på curl */ }
  try {
    return execFileSync('curl', ['-sfL', '--max-time', '60', '-A', UA, '-H', 'Accept-Language: da-DK,da;q=0.9', url], { maxBuffer: 64 * 1024 * 1024 }).toString('utf8');
  } catch {
    throw new Error(`${id}: ${url} kunne ikke hentes`);
  }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const tekster = {};
  for (const [id, k] of Object.entries(DATA_DA.kilder)) tekster[id] = kildetekst(await hent(k.url, id));
  const liste = avvik(DATA_DA, tekster);
  if (liste.length) {
    for (const a of liste) console.error(`${a.id}: sitatet står ikke hos ${a.kilde}`);
    process.exit(1);
  }
  console.log(`Alle ${Object.keys(DATA_DA.tall).length + Object.keys(DATA_DA.tekst).length} sitater står hos kilden.`);
}

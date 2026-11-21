// Kontroll mot kilden for høytidssidene (/julebord/, /nyttarsmiddag/): hvert sitat i hoytider.data.json skal stå ordrett på kildesiden.
// Bruk: node scripts/nb-jul/kildekontroll-hoytider.mjs [nb|sv]   (nett kreves; avvik skrives og koden blir 1)
// Svensk: sidene i scripts/sv-jul/ bruker samme kontroll mot hoytider.data.json der. Svenske kilder hentes med curl-fallback (Arla svarer 404 på Node sin fetch).
import { fileURLToPath } from 'node:url';
import { hent, kildetekst } from '../familier/holdbarhet/kildekontroll.mjs';
import { lagMarked } from './hoytid-felles.mjs';

// NFC: noen sider (Arla) skriver ö som o + tegn for prikker, og sitatet er skrevet med ett tegn.
const norm = (t) => t.normalize('NFC').replace(/­/gu, '').replace(/\s+/gu, ' ').trim().replace(/ ([,.;:!?])/gu, '$1');

/** Sitater som ikke står i kildeteksten: { id, kilde }[]. `tekster` er { [kildeId]: kildetekst }. */
export function avvik(data, tekster) {
  const ut = [];
  for (const [gruppe, rader] of [['tall', data.tall], ['tekst', data.tekst]]) {
    for (const [id, x] of Object.entries(rader)) {
      const tekst = tekster[x.kilde];
      if (!x.sitat || !tekst || !norm(tekst).includes(norm(x.sitat))) ut.push({ id: `${gruppe}/${id}`, kilde: x.kilde });
    }
  }
  return ut;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const DATA = lagMarked(process.argv[2] ?? 'nb').DATA;
  const tekster = {};
  for (const [id, k] of Object.entries(DATA.kilder)) tekster[id] = kildetekst((await hent(k.url, id)).toString('utf8'));
  const liste = avvik(DATA, tekster);
  if (liste.length) {
    for (const a of liste) console.error(`${a.id}: sitatet står ikke hos ${a.kilde}`);
    process.exit(1);
  }
  console.log(`Alle ${Object.keys(DATA.tall).length + Object.keys(DATA.tekst).length} sitater står hos kilden.`);
}

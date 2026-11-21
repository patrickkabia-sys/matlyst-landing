// Kontroll mot kilden for høytidssidene (/julebord/, /nyttarsmiddag/): hvert sitat i hoytider.data.json skal stå ordrett på kildesiden.
// Bruk: node scripts/nb-jul/kildekontroll-hoytider.mjs   (nett kreves; avvik skrives og koden blir 1)
import { fileURLToPath } from 'node:url';
import { kildetekst } from '../familier/holdbarhet/kildekontroll.mjs';
import { DATA } from './hoytid-felles.mjs';

const norm = (t) => t.replace(/­/gu, '').replace(/\s+/gu, ' ').trim();

/** Sitater som ikke står i kildeteksten: { id, kilde }[]. `tekster` er { [kildeId]: kildetekst }. */
export function avvik(data, tekster) {
  const ut = [];
  for (const [gruppe, rader] of [['tall', data.tall], ['tekst', data.tekst]]) {
    for (const [id, x] of Object.entries(rader)) {
      const tekst = tekster[x.kilde];
      if (!x.sitat || !tekst || !tekst.includes(norm(x.sitat))) ut.push({ id: `${gruppe}/${id}`, kilde: x.kilde });
    }
  }
  return ut;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const tekster = {};
  for (const [id, k] of Object.entries(DATA.kilder)) {
    const svar = await fetch(k.url, { headers: { 'user-agent': 'Mozilla/5.0' } });
    if (!svar.ok) throw new Error(`${id}: ${k.url} svarte ${svar.status}`);
    tekster[id] = kildetekst(await svar.text());
  }
  const liste = avvik(DATA, tekster);
  if (liste.length) {
    for (const a of liste) console.error(`${a.id}: sitatet står ikke hos ${a.kilde}`);
    process.exit(1);
  }
  console.log(`Alle ${Object.keys(DATA.tall).length + Object.keys(DATA.tekst).length} sitater står hos kilden.`);
}

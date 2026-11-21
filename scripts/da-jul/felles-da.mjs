// Felles verktøy for de danske høytidssidene (/da/julefrokost/, /da/juleaften/). Samme generator som de norske og svenske
// (../nb-jul/hoytid-felles.mjs, lagMarked('da')), med dansk datafil og danske kilder: HVERT tall på siden kommer fra hoytider.data.da.json,
// med kilde, adresse, dato og sitat. Tallene er hentet fra danske kilder, aldri oversatt fra norsk. Låst av test/hoytider-da.test.mjs.
import { lagMarked } from '../nb-jul/hoytid-felles.mjs';

export { p, ul, tabell, kg, dl } from '../nb-jul/hoytid-felles.mjs';
const M = lagMarked('da');
export const { DATA: DATA_DA, HENTET, HENTET_TEKST, KILDEINTRO } = M;

/** Én sidevariant med dansk datafil og kilder. */
export function lagDaSide() {
  const s = M.lagSide();
  return {
    ...s,
    fvst: s.henv('Fødevarestyrelsen', 'Fødevarestyrelsen'),
    tk: s.henv('Forbrugerrådet Tænk', 'Forbrugerrådet Tænk'),
    mv: s.henv('Madens Verden', 'Madens Verden'),
    arla: s.henv('Arla', 'Arla'),
    dc: s.henv('Danish Crown', 'Danish Crown'),
  };
}

// FAQPage kommer fra navnet 'faq' i schemas (locale-pages krever at synlig FAQ også står i JSON-LD).
export const skjemaDa = M.skjemaFor;

// Klokkeslæt regnet ud fra kildernes minutter.
export const kl = (min) => `kl. ${String(Math.floor(min / 60)).padStart(2, '0')}.${String(min % 60).padStart(2, '0')}`;

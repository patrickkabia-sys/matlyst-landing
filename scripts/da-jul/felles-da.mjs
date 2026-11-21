// Felles verktøy for de danske høytidssidene (/da/julefrokost/, /da/juleaften/). Samme generator som de norske (../nb-jul/hoytid-felles.mjs),
// med dansk datafil og danske kilder: HVERT tall på siden kommer fra hoytider.data.da.json, med kilde, adresse, dato og sitat.
// Tallene er hentet fra danske kilder, aldri oversatt fra norsk. Låst av test/hoytider-da.test.mjs.
import { fileURLToPath } from 'node:url';
import { BASE, lagSide, lesDatasett, skjemaFor as skjemaNb } from '../nb-jul/hoytid-felles.mjs';

export { p, ul, tabell, kg, dl } from '../nb-jul/hoytid-felles.mjs';
export const DATA_DA = lesDatasett(new URL('./hoytider.data.da.json', import.meta.url));
export const DATA_FIL = fileURLToPath(new URL('./hoytider.data.da.json', import.meta.url));
export const HENTET = DATA_DA.hentet;
export const HENTET_TEKST = DATA_DA.hentetTekst;
export const KORTORD_DA = { adresse: 'Adresse', dato: 'Dato på kilden', hentet: 'Læst', tall: 'Tal vi bruger', ingen: 'Ingen tal, kun fremgangsmåde og regler i tekst.' };

/** Én sidevariant med dansk datafil og kilder. */
export function lagDaSide() {
  const s = lagSide({ data: DATA_DA, kortord: KORTORD_DA });
  return {
    ...s,
    fvst: s.henv('Fødevarestyrelsen', 'Fødevarestyrelsen'),
    tk: s.henv('Forbrugerrådet Tænk', 'Forbrugerrådet Tænk'),
    mv: s.henv('Madens Verden', 'Madens Verden'),
    arla: s.henv('Arla', 'Arla'),
    dc: s.henv('Danish Crown', 'Danish Crown'),
  };
}

// Den danske generatoren legger selv på brødsmulestien, så bare Article hentes herfra. FAQPage kommer fra navnet 'faq' i schemas (locale-pages krever at synlig FAQ også står i JSON-LD).
export const skjemaDa = (a) => skjemaNb({ ...a, data: DATA_DA, lang: 'da', forside: 'Forside', hjem: `${BASE}/da/` }).filter((x) => x['@type'] === 'Article');

export const KILDEINTRO = `<p>Hvert tal om mad, mængde og tid på denne side står her, med kilde, adresse og dato. Tabellerne er regnet ud ved at gange tallene pr. person med antal gæster. Vi har åbnet og læst hver side ${HENTET_TEKST}, og de citater, vi bygger på, er gemt ordret og kontrolleret mod siderne. Fødevarestyrelsen er den danske myndighed for fødevaresikkerhed. Madens Verden er en dansk madside, Forbrugerrådet Tænk er en forbrugerorganisation, og Arla og Danish Crown er danske fødevarevirksomheder. Mængder og tider er vejledende. Gælder kilden en anden situation end din, for eksempel et andet stykke kød eller et andet køleskab, så gælder kilden, ikke siden her.</p>`;

// Klokkeslæt regnet ud fra kildernes minutter.
export const kl = (min) => `kl. ${String(Math.floor(min / 60)).padStart(2, '0')}.${String(min % 60).padStart(2, '0')}`;

// Malen for familien «dl til gram» (da): se mal-nordisk.mjs. Her står bare koblingen mellom språkpakken og varetekstene.
import { lagMal } from './mal-nordisk.mjs';
import { DA } from './sprak-nordisk.mjs';
import { TEKST } from './tekst-da.mjs';

export const { utregnet, kalkHtml, tillatteTall, tillatteTallNav, sideForRad, navSide, maskeNavn, gramTekst, mengdeTekst } = lagMal(DA, TEKST);

// Malen for familien «dl till gram» (sv): se mal-nordisk.mjs. Her står bare koblingen mellom språkpakken og varetekstene.
import { lagMal } from './mal-nordisk.mjs';
import { SV } from './sprak-nordisk.mjs';
import { TEKST } from './tekst-sv.mjs';

export const { utregnet, kalkHtml, tillatteTall, tillatteTallNav, sideForRad, navSide, maskeNavn, gramTekst, mengdeTekst } = lagMal(SV, TEKST);

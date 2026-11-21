// Malen for familien «ukemeny» (sv): /sv/veckomenyer/ og én side per veckomeny. Se mal-felles.mjs.
import { lagMal } from './mal-felles.mjs';
import { T } from './tekst-sv.mjs';

export const ROT = T.rot;
export const { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn, menyFor, alleMenyer } = lagMal(T);

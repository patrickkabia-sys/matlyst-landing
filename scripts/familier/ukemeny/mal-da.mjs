// Malen for familien «ukemeny» (da): /da/madplaner/ og én side per madplan. Se mal-felles.mjs.
import { lagMal } from './mal-felles.mjs';
import { T } from './tekst-da.mjs';

export const ROT = T.rot;
export const { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn, menyFor, alleMenyer } = lagMal(T);

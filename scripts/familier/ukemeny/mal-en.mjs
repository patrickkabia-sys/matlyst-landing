// Template for the ukemeny family in US English: /en/weekly-meal-plans/ and one page per meal plan. See mal-felles.mjs.
import { lagMal } from './mal-felles.mjs';
import { T } from './tekst-en.mjs';

export const ROT = T.rot;
export const { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn, menyFor, alleMenyer } = lagMal(T);

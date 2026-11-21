// Malen for familien «frysing» (nb): samleside og én side per vare, skrevet fra data.nb.json og tekst-nb.mjs.
// Selve byggingen er felles med «holdbarhet» (../holdbarhet/kjoling.mjs).
import { lagMal } from '../holdbarhet/kjoling.mjs';
import { TEKST, nav } from './tekst-nb.mjs';

export const ROT = '/frysing/';
export const { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn } = lagMal({
  rot: ROT, eyebrowNavn: 'Frysing', alleTekst: 'Frysetider for alle varene', cta: 'Hold oversikt over maten du har, i Matlyst', TEKST, nav,
});

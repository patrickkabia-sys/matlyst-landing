// Malen for familien «holdbarhet» (nb): samleside og én side per vare, skrevet fra data.nb.json og tekst-nb.mjs.
// Selve byggingen er felles med «frysing» (kjoling.mjs).
import { lagMal } from './kjoling.mjs';
import { TEKST, nav } from './tekst-nb.mjs';

export const ROT = '/holdbarhet/';
export const { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn } = lagMal({
  rot: ROT, eyebrowNavn: 'Holdbarhet i kjøleskapet', alleTekst: 'Holdbarhet for alle varene', cta: 'Hold oversikt over maten du har, i Matlyst', TEKST, nav,
});

// Mal for familien «steketid» (da): samleside og én side per ret, skrevet fra data.da.json og tekst-da.mjs.
// Selve byggingen er felles med de andre danske familier (../mal-da-felles.mjs).
import { lagDaMal } from '../mal-da-felles.mjs';
import { TEKST, nav } from './tekst-da.mjs';

export const ROT = '/da/stegetid/';
export const { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn } = lagDaMal({
  rot: ROT, eyebrowNavn: 'Stegetid', alleTekst: 'Stegetider for alle retter', cta: 'Lav maden trin for trin med Matlyst', kilderTitel: 'Det siger kilderne', TEKST, nav,
  app: [['Brug madlavningstilstand med timer', 'I Matlyst viser madlavningstilstanden ét trin ad gangen og foreslår en timer, når et trin nævner en tid.'], ['Læg aftensmaden i madplanen', 'Se hele ugens aftensmad samlet, og send alt til én indkøbsliste.']],
});

// Mal for familien «kjernetemperatur» (da): samleside og én side per vare, skrevet fra data.da.json og tekst-da.mjs.
// Selve byggingen er felles med «holdbarhet» og «frysing» (../holdbarhet/kjoling-da.mjs).
import { lagMal } from '../holdbarhet/kjoling-da.mjs';
import { TEKST, nav } from './tekst-da.mjs';

export const ROT = '/da/kernetemperatur/';
export const { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn } = lagMal({
  rot: ROT, eyebrowNavn: 'Kernetemperatur', alleTekst: 'Kernetemperatur for alle varer', cta: 'Lav aftensmaden trin for trin med Matlyst', kilderTitel: 'Hvad kilderne siger', TEKST, nav,
  app: [['Følg trinnene i madlavningstilstand', 'I Matlyst bliver trinnene til en tjekliste, og madlavningstilstanden foreslår timere.'], ['Planlæg aftensmaden i madplanen', 'Læg opskriften på den dag, du skal lave den, så ser du ugen samlet.']],
});

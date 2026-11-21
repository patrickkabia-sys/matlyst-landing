// Mal for familien «holdbarhet» (da): samleside og én side per vare, skrevet fra data.da.json og tekst-da.mjs.
// Selve byggingen er felles med «frysing» og «kjernetemperatur» (kjoling-da.mjs).
import { lagMal } from './kjoling-da.mjs';
import { TEKST, nav } from './tekst-da.mjs';

export const ROT = '/da/holdbarhed/';
export const { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn } = lagMal({
  rot: ROT, eyebrowNavn: 'Holdbarhed i køleskabet', alleTekst: 'Holdbarhed for alle varer', cta: 'Hold styr på maden i dit køkken med Matlyst', kilderTitel: 'Det siger kilderne', TEKST, nav,
  app: [['Brug op, hvad du har i køleskabet', 'I Matlyst kan du se, hvor mange dage der er tilbage på varerne i dit spisekammer.'], ['Planlæg ugen efter det, der skal bruges først', 'Læg aftensmaden i madplanen, så ser du, hvad der skal bruges først.']],
});

// Mal for familien «frysing» (da): samleside og én side per vare, skrevet fra data.da.json og tekst-da.mjs.
// Selve byggingen er felles med «holdbarhet» (../holdbarhet/kjoling-da.mjs).
import { lagMal } from '../holdbarhet/kjoling-da.mjs';
import { TEKST, nav } from './tekst-da.mjs';

export const ROT = '/da/kan-man-fryse/';
export const { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn } = lagMal({
  rot: ROT, eyebrowNavn: 'Kan man fryse det?', alleTekst: 'Tid i fryseren for alle varer', cta: 'Hold styr på maden i dit køkken med Matlyst', kilderTitel: 'Hvad kilderne siger', TEKST, nav,
  app: [['Brug op, hvad du har i fryseren og spisekammeret', 'I Matlyst kan du se, hvor mange dage der er tilbage på varerne i dit spisekammer.'], ['Planlæg ugen efter det, du skal bruge først', 'Læg aftensmaden i madplanen, så ser du, hvad du skal bruge eller tø op først.']],
});

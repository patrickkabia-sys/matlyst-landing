// Malen för familjen «kjernetemperatur» (sv): samlingssida och en sida per sort, skrivna från data.sv.json och tekst-sv.mjs.
// Själva byggandet är gemensamt för de tre svenska familjerna (../mal-sv-felles.mjs).
import { lagMal } from '../mal-sv-felles.mjs';
import { TEKST, nav } from './tekst-sv.mjs';

export const ROT = '/sv/innertemperatur/';
export const { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn } = lagMal({
  rot: ROT, eyebrowNavn: 'Innertemperatur', alleTekst: 'Innertemperatur för kött och fågel', cta: 'Följ stegen i Matlyst', TEKST, nav,
  app: [['Följ stegen i matlagningsläget', 'I Matlyst blir stegen en checklista, och matlagningsläget föreslår timers.'], ['Planera middagen i veckomenyn', 'Lägg receptet på dagen du ska laga det, så ser du veckan samlad.']],
});

// Malen för familjen «airfryer» (sv): samlingssida (/sv/airfryer/) och en sida per vara, skrivna från data.sv.json och tekst-sv.mjs.
// Själva byggandet är gemensamt för de svenska familjerna (../mal-sv-felles.mjs). Tiderna kommer från Arla, Findus och OBH Nordica, inte från norska källor.
import { lagMal } from '../mal-sv-felles.mjs';
import { TEKST, nav } from './tekst-sv.mjs';

export const ROT = '/sv/airfryer/';
export const { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn } = lagMal({
  rot: ROT, eyebrowNavn: 'Airfryer', alleTekst: 'Airfryer: tid och temperatur för alla varor', cta: 'Följ stegen i Matlyst', TEKST, nav,
  app: [['Följ stegen i matlagningsläget', 'I Matlyst blir stegen en checklista, och matlagningsläget föreslår timers när ett steg nämner en tid.'], ['Planera middagen i veckomenyn', 'Lägg receptet på dagen du ska laga det, så ser du veckan samlad.']],
});

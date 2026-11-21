// Malen för familjen «steketid» (sv): samlingssida (/sv/tillagningstid/) och en sida per rätt, skrivna från data.sv.json och tekst-sv.mjs.
// Själva byggandet är gemensamt för de svenska familjerna (../mal-sv-felles.mjs). Siffrorna är hämtade från svenska källor, inte översatta.
import { lagMal } from '../mal-sv-felles.mjs';
import { TEKST, nav } from './tekst-sv.mjs';

export const ROT = '/sv/tillagningstid/';
export const { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn } = lagMal({
  rot: ROT, eyebrowNavn: 'Tillagningstider', alleTekst: 'Tillagningstider för mat', cta: 'Följ stegen i Matlyst', TEKST, nav,
  app: [['Följ stegen i matlagningsläget', 'I Matlyst blir stegen en checklista, och matlagningsläget föreslår timers när ett steg nämner en tid.'], ['Planera middagen i veckomenyn', 'Lägg receptet på dagen du ska laga det, så ser du veckan samlad.']],
});

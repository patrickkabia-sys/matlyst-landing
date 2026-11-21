// Malen för familjen «holdbarhet» (sv): samlingssida och en sida per vara, skrivna från data.sv.json och tekst-sv.mjs.
// Själva byggandet är gemensamt för de tre svenska familjerna (../mal-sv-felles.mjs).
import { lagMal } from '../mal-sv-felles.mjs';
import { TEKST, nav } from './tekst-sv.mjs';

export const ROT = '/sv/hallbarhet/';
export const { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn } = lagMal({
  rot: ROT, eyebrowNavn: 'Hållbarhet i kylen', alleTekst: 'Hållbarhet för alla varor', cta: 'Ha koll på maten du har hemma, i Matlyst', TEKST, nav,
  app: [['Använd upp det som finns i kylskåpet', 'I Matlyst ser du hur många dagar det är kvar på maten i ditt skafferi.'], ['Planera veckan efter det som ska användas först', 'Lägg middagarna i veckomenyn och se vad som ska användas först.']],
});

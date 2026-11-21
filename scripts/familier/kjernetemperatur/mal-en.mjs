// Template for the family «kjernetemperatur» (en-US): hub page and one page per food, written from data.en.json and tekst-en.mjs.
// The build itself is shared with «steketid» (steketid/mal-felles-en.mjs).
import { lagMal } from '../steketid/mal-felles-en.mjs';
import { TEKST, nav } from './tekst-en.mjs';

export const ROT = '/en/internal-temperature/';
export const { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn } = lagMal({
  rot: ROT, eyebrowNavn: 'Internal temperature', alleTekst: 'Safe temperatures for every food', cta: 'Make dinner step by step in Matlyst', TEKST, nav,
  app: [['Follow the steps in cook mode', 'In Matlyst the steps become a checklist, and cook mode suggests timers.'], ['Plan dinner in the weekly menu', 'Put the recipe on the day you will make it and see the whole week in one place.']],
});

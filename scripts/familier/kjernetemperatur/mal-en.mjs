// Template for the family «kjernetemperatur» (en-US): hub page and one page per food, written from data.en.json and tekst-en.mjs.
// The build itself is shared with «steketid» (steketid/mal-felles-en.mjs).
import { lagMal } from '../steketid/mal-felles-en.mjs';
import { TEKST, nav } from './tekst-en.mjs';

export const ROT = '/en/internal-temperature/';
export const { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn } = lagMal({
  rot: ROT, eyebrowNavn: 'Internal temperature', alleTekst: 'Safe temperatures for every food', cta: 'Cook it step by step with Matlyst', TEKST, nav,
  app: [['Follow the steps in cook mode', 'Cook mode shows one step at a time, with the ingredients that step needs.'], ['Put dinner on your meal plan', 'See the whole week of dinners in one place, and send it all to one grocery list.']],
});

// Template for the family «frysing» (en-US): hub page and one page per food, written from data.en.json and tekst-en.mjs.
// The build itself is shared with «holdbarhet» (../holdbarhet/kjoling-en.mjs).
import { lagMal } from '../holdbarhet/kjoling-en.mjs';
import { TEKST, nav } from './tekst-en.mjs';

export const ROT = '/en/can-you-freeze/';
export const { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn } = lagMal({
  rot: ROT, eyebrowNavn: 'Freezer storage times', alleTekst: 'Freezer times for every food', cta: "Keep track of what's in your kitchen with Matlyst", TEKST, nav,
  app: [["Use up what's in your freezer", 'Add what you buy to the pantry in Matlyst and keep an eye on what needs using up.'], ['Plan the week around what needs thawing first', 'Put your dinners on your meal plan and see what to thaw or use up first.']],
});

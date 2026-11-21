// Template for the family «holdbarhet» (en-US): hub page and one page per food, written from data.en.json and tekst-en.mjs.
// The build itself is shared with «frysing» (kjoling-en.mjs).
import { lagMal } from './kjoling-en.mjs';
import { TEKST, nav } from './tekst-en.mjs';

export const ROT = '/en/how-long-does-it-last/';
export const { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn } = lagMal({
  rot: ROT, eyebrowNavn: 'Fridge storage times', alleTekst: 'Fridge times for every food', cta: "Keep track of what's in your kitchen with Matlyst", TEKST, nav,
  app: [["Use up what's in your fridge", 'Add what you buy to the pantry in Matlyst and keep an eye on what needs using up.'], ['Plan the week around what needs using first', 'Put your dinners on your meal plan and see what to use up first.']],
});

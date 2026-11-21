// Template for the family «holdbarhet» (en-US): hub page and one page per food, written from data.en.json and tekst-en.mjs.
// The build itself is shared with «frysing» (kjoling-en.mjs).
import { lagMal } from './kjoling-en.mjs';
import { TEKST, nav } from './tekst-en.mjs';

export const ROT = '/en/how-long-does-it-last/';
export const { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn } = lagMal({
  rot: ROT, eyebrowNavn: 'Fridge storage times', alleTekst: 'Fridge times for every food', cta: 'Keep track of what is in your kitchen, in Matlyst', TEKST, nav,
  app: [['Use up what is in your fridge', 'In Matlyst you can see how many days are left on the food in your pantry.'], ['Plan the week around what needs using first', 'Put your dinners in the weekly menu and see what to use first.']],
});

// Template for the family «erstatning» (en-US): hub page (/en/substitutes/) and one page per ingredient. The numbers are in data.en.json with a quote from the source.
import { lagMal } from './bygg-en.mjs';
import { NAV, TEKST } from './tekst-en.mjs';

export const ROT = '/en/substitutes/';
export const { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn } = lagMal({
  familie: 'erstatning',
  rot: ROT,
  innhold: TEKST,
  nav: NAV,
  eyebrow: 'Ingredient substitutes',
  cta: 'See what you can make with what you have in Matlyst',
  relatertTittel: 'More substitutes',
  kildeIntro: "Every ratio on this page comes from the sources below, and we checked each quote against the source page. If a page has no date, the year shown is the year we accessed it. We don't give any number that isn't in a source.",
});

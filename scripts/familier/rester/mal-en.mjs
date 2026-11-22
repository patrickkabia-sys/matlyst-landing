// Template for the family «rester» (en-US): hub page /en/recipes-by-ingredients/ and one page per item under /en/recipes-by-ingredients/with-<item>/.
// Storage numbers come from data.en.json (FoodSafety.gov and USDA FSIS, the same as the pages on how long food lasts and whether you can freeze it), not from the Norwegian pages.
import { lagMal } from './bygg-flersprak.mjs';
import { NAV, STORE, TEKST } from './tekst-en.mjs';

export const ROT = '/en/recipes-by-ingredients/';
export const { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn } = lagMal({
  lang: 'en',
  hjem: ['Home', '/en/'],
  rot: ROT,
  innhold: TEKST,
  nav: NAV,
  eyebrow: 'What can I make?',
  cta: 'See what you can make with what you have in Matlyst',
  relatertTittel: 'More items',
  kildeH2: 'Sources',
  kildeIntro: 'Numbers about storage come from the sources below, and we checked each one against the source page. If a page has no date, the year shown is the year we accessed it. The dishes are our suggestions and have no source.',
  lest: 'Accessed',
  post: 'Did a source change, or did you spot a mistake? Write to <a href="mailto:hei@matlyst-app.no">hei@matlyst-app.no</a>.',
  stegTittel: 'In short',
  faqTittel: 'Questions and answers',
  til: 'to',
  sitat: ['“', '”'],
  grad: '',
  desimal: '.',
  dato: (a, m, d) => `${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][m - 1]} ${d}, ${a}`,
  enkelt: { days: 'day', weeks: 'week', months: 'month', hours: 'hour' },
  kort: { 'FoodSafety.gov (U.S. Department of Health and Human Services)': 'FoodSafety.gov', 'USDA Food Safety and Inspection Service': 'USDA FSIS' },
  oppbevaringH2: STORE,
  se: {
    tittel: 'See also:',
    navn: { holdbarhet: 'How long it lasts', frysing: 'Can you freeze it' },
    rot: { holdbarhet: '/en/how-long-does-it-last/', frysing: '/en/can-you-freeze/' },
    lenker: {
      kjottdeig: { holdbarhet: ['ground-beef'], frysing: ['ground-beef'] },
      kylling: { holdbarhet: ['raw-chicken', 'cooked-chicken'], frysing: ['raw-chicken'] },
      'rotisserie-chicken': { holdbarhet: ['cooked-chicken'], frysing: ['cooked-chicken'] },
      egg: { holdbarhet: ['egg', 'kokte-egg'], frysing: ['egg'] },
      'kokte-poteter': { holdbarhet: ['rester'] },
      ris: { holdbarhet: ['cooked-rice'], frysing: ['cooked-rice'] },
      pasta: { holdbarhet: ['cooked-pasta'], frysing: ['cooked-pasta'] },
      laks: { holdbarhet: ['salmon'], frysing: ['salmon'] },
      'turkey-leftovers': { holdbarhet: ['turkey-leftovers'], frysing: ['turkey-leftovers'] },
      'kokt-skinke': { holdbarhet: ['ham'], frysing: ['ham'] },
      floete: { holdbarhet: ['rester'] },
      gulrotter: { holdbarhet: ['rester'] },
    },
  },
});

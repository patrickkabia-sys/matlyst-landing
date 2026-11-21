// Template for the family «steketid» (en-US): hub page and one page per dish, written from data.en.json and tekst-en.mjs.
// The build itself is shared with «kjernetemperatur» (mal-felles-en.mjs). The weight calculators (turkey roasting and turkey thawing)
// look the weight up in the FSIS table bands: kalkBand in mal-felles-en.mjs and the data-kalk="band" block in site.js.
import { kalkBand, lagMal } from './mal-felles-en.mjs';
import { TEKST, nav } from './tekst-en.mjs';

export const ROT = '/en/cooking-times/';
const bander = (rad, forkortelse, antall) => Array.from({ length: antall }, (_, i) => {
  const f = (k) => rad.tall[`${forkortelse}${i + 1}${k}`];
  return [f('w-min').verdi, f('w-maks').verdi, f('t-min').verdi, f('t-maks').verdi];
});
const KALK = {
  kalkun: (rad, h) => {
    h.k('fsis-turkey');
    const sett = [{ navn: 'Unstuffed', enhet: ['hour', 'hours'], band: bander(rad, 'u', 5) }, { navn: 'Stuffed', enhet: ['hour', 'hours'], band: bander(rad, 's', 5) }];
    const alle = sett[0].band;
    return kalkBand({ sett, ariaLabel: 'Calculator: turkey weight to roasting time', vektEtikett: 'Turkey weight in pounds', vareEtikett: 'Stuffed or unstuffed', eksempel: 16, feil: `Enter a whole turkey weight from ${alle[0][0]} to ${alle.at(-1)[1]} pounds.` });
  },
  tining: (rad, h) => {
    h.k('fsis-thaw');
    const sett = [{ navn: 'Refrigerator', enhet: ['day', 'days'], band: bander(rad, 'k', 4) }, { navn: 'Cold water', enhet: ['hour', 'hours'], band: bander(rad, 'v', 4) }];
    return kalkBand({ sett, ariaLabel: 'Calculator: turkey weight to thawing time', vektEtikett: 'Turkey weight in pounds', vareEtikett: 'Thawing method', eksempel: 14, feil: `Enter a turkey weight from ${sett[0].band[0][0]} to ${sett[0].band.at(-1)[1]} pounds.` });
  },
};
// Tallene på sidene som ikke er kildetall: eksempelvektene i spørsmålene og kalkulatorens eksempel.
const EKSTRA = { kalkun: ['10', '16'], tining: ['14'], kalkunbryst: ['6'], skinke: ['10'], roastbiff: ['5'], svinestek: ['4'], 'hel-kylling': ['4', '6'], lammelar: ['6'], brisket: ['1', '2', '3', '4'] };

export const { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn } = lagMal({
  rot: ROT, eyebrowNavn: 'Cooking times', alleTekst: 'Cooking times for every dish', cta: 'Cook it step by step with Matlyst', TEKST, nav,
  kalk: (rad, h) => KALK[rad.id](rad, h), ekstraTall: (rad) => EKSTRA[rad.id] ?? [],
  app: [['Follow the steps in cook mode', 'Cook mode shows one step at a time and suggests a timer when a step mentions a time.'], ['Put dinner on your meal plan', 'See the whole week of dinners in one place, and send it all to one grocery list.']],
});

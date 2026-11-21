// Mal for familien «erstatning» (da): samleside og én side per vare, skrevet fra data.da.json og tekst-da.mjs.
// Selve byggingen er felles med de andre danske familier (../mal-da-felles.mjs).
import { lagDaMal } from '../mal-da-felles.mjs';
import { TEKST, nav } from './tekst-da.mjs';

export const ROT = '/da/erstatning/';
export const { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn } = lagDaMal({
  rot: ROT, eyebrowNavn: 'Erstatning', alleTekst: 'Erstatning for alle varer', cta: 'Byt ingredienser i dine opskrifter med Matlyst', kilderTitel: 'Det siger kilderne', TEKST, nav,
  app: [['Byt ingredienser i Matlyst', 'Spørg Matlyst kan bytte ingredienser og viser ændringerne, før du gemmer dem. Det er en Pro-funktion.'], ['Se hvad du har i spisekammeret', 'I Matlyst kan du se, hvad du har i spisekammeret, så du ved, hvad der mangler, før du handler.']],
});

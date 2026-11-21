// Malen for familien «kjernetemperatur» (nb): samleside og én side per råvare, skrevet fra data.nb.json og tekst-nb.mjs.
// Selve byggingen er felles med «steketid» (steketid/mal-felles.mjs).
import { lagMal } from '../steketid/mal-felles.mjs';
import { TEKST, nav } from './tekst-nb.mjs';

export const ROT = '/kjernetemperatur/';
// Kokemodus og ukemeny: app-bevis.mjs legger skjermbilde eller video under disse overskriftene (reglene «kokemodus» og «plan»).
const APP = '<h2>Følg stegene i kokemodus</h2><p>I Matlyst blir stegene en sjekkliste, og kokemodus foreslår tidtakere.</p>\n<h2>Planlegg middagen i ukemenyen</h2><p>Legg oppskriften på dagen du skal lage den, så ser du uka samlet.</p>';
export const { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn } = lagMal({
  rot: ROT, navEkstra: '<div class="related"><h2>Les også</h2><ul><li><a href="/airfryer/">Airfryer: tid og temperatur for vanlig mat</a></li></ul></div>',
  eyebrowNavn: 'Kjernetemperatur', alleTekst: 'Kjernetemperatur for alle råvarene', cta: 'Lag middagen steg for steg i Matlyst',
  stegTittel: 'Slik leser du tabellen', steg0: 'Finn råvaren', steg1: 'Tallene står i tabellen, med kilde.', app: APP, TEKST, nav,
});

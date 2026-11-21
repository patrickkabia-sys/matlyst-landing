// Malen for familien «rester» (nb): samleside /hva-kan-jeg-lage/ og én side per vare under /hva-kan-jeg-lage/med-<vare>/.
// Typer retter, hvorfor de passer og hva du trenger ellers. Ingen oppskrifter. Oppbevaring står bare med tall eller uttalelse fra en kilde.
import { lagMal } from '../erstatning/bygg.mjs';
import { NAV, TEKST } from './tekst-nb.mjs';

export const ROT = '/hva-kan-jeg-lage/';
export const { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn } = lagMal({
  familie: 'rester',
  rot: ROT,
  innhold: TEKST,
  nav: NAV,
  eyebrow: 'Hva kan jeg lage?',
  cta: 'Se hva du kan lage med det du har, i Matlyst',
  relatertTittel: 'Flere varer',
  kildeIntro: 'Tall om oppbevaring er hentet fra kildene under, og sitatet er kontrollert mot kildesiden. Der en side ikke har egen dato, står året vi leste den. Rettene er våre forslag og har ingen kilde.',
});

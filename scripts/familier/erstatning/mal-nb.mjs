// Malen for familien «erstatning» (nb): samleside (/erstatning/) og én side per vare. Tallene står i data.nb.json med sitat fra kilden.
import { lagMal } from './bygg.mjs';
import { NAV, TEKST } from './tekst-nb.mjs';

export const ROT = '/erstatning/';
export const { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn } = lagMal({
  familie: 'erstatning',
  rot: ROT,
  innhold: TEKST,
  nav: NAV,
  eyebrow: 'Erstatning',
  cta: 'Finn ut hva du kan lage med det du har, i Matlyst',
  relatertTittel: 'Flere bytter',
  kildeIntro: 'Hvert forhold på siden er hentet fra kildene under, og sitatet er kontrollert mot kildesiden. Der en side ikke har egen dato, står året vi leste den. Vi oppgir ingen tall som ikke står hos en kilde.',
});

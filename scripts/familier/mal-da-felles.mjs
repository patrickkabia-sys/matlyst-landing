// Felles mal for de danske familier «steketid», «airfryer» og «erstatning»: bygger på holdbarhet/kjoling-da.mjs (samleside og én side per rad
// med kilder, tabell, ekstra blokker og FAQ), men tallvakten tillater også tallene i radens sitater (`tekst`), fordi prosaen gengiver hele
// sætninger fra kilden. Sitaterne kontrolleres mod kildesiderne af kildekontroll.mjs.
import { lagMal } from './holdbarhet/kjoling-da.mjs';

const TALL = /\d+(?:[.,]\d+)?|[½⅓⅔¼¾⅛⅜⅝⅞]/gu;
const iSitater = (rad) => Object.values(rad.tekst ?? {}).flatMap((v) => v.split('|').slice(1).join('|').match(TALL) ?? []);

export function lagDaMal(cfg) {
  const m = lagMal(cfg);
  const tillatteTall = (rad, data) => {
    const s = m.tillatteTall(rad, data);
    for (const n of iSitater(rad)) { s.add(n); s.add(n.replace(',', '.')); s.add(n.replace('.', ',')); }
    return s;
  };
  const tillatteTallNav = (data) => {
    const s = m.tillatteTallNav(data);
    for (const rad of data.rader) for (const n of tillatteTall(rad, data)) s.add(n);
    return s;
  };
  return { ...m, tillatteTall, tillatteTallNav };
}

// Leser en side fra repoet. Engelske juridiske sider publiseres først med #14 (/en/).
// Til da finnes ikke fila, og teksten hentes fra scripts/juridisk-tekster.mjs, som er
// den samme kilden generatoren bygger /en/privacy/ og /en/terms/ fra. Slik kan testene
// for engelsk bli røde allerede nå, i stedet for å hoppe stille over et språk.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { legal } from '../../scripts/juridisk-tekster.mjs';

const ROOT = new URL('../..', import.meta.url).pathname;

const EN_UTEN_FIL = {
  'en/privacy/index.html': 'privacy',
  'en/terms/index.html': 'terms',
};

export function enFraKilde(key) {
  const d = legal.en[key];
  if (!d) throw new Error(`Mangler legal.en.${key}`);
  return `<html lang="en"><main class="legal-doc"><header><h1>${d.h1}</h1><p class="lead">${d.intro}</p><p class="legal-updated">${d.oppdatert}</p></header>\n`
    + d.sections.map(([h, p]) => `<section><h2>${h}</h2>${p.startsWith('<') ? p : `<p>${p}</p>`}</section>`).join('\n')
    + '\n</main></html>';
}

export function lesSide(sti) {
  const fil = join(ROOT, sti);
  if (existsSync(fil)) return readFileSync(fil, 'utf8');
  if (EN_UTEN_FIL[sti]) return enFraKilde(EN_UTEN_FIL[sti]);
  throw new Error(`Finner ikke ${sti}`);
}

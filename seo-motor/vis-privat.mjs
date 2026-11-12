import { pathToFileURL } from 'node:url';

import {
  lesPrivat,
  lesSeoDataNokkel,
} from './privat.mjs';

const PRIVAT_FIL = new URL('../seo-data/privat.enc', import.meta.url);

export function visPrivat({ fil = PRIVAT_FIL, nokkel }) {
  return lesPrivat(fil, nokkel);
}

function cli() {
  const nokkel = lesSeoDataNokkel({ tillatNokkelring: true });
  process.stdout.write(`${JSON.stringify(visPrivat({ nokkel }), null, 2)}\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  cli();
}

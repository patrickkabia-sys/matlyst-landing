import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const kilde = readFileSync(fileURLToPath(new URL('../../scripts/generer-lokalsider.mjs', import.meta.url)), 'utf8');

// Leser `const common = {` i kildeteksten til generer-lokalsider.mjs uten å kjøre generatoren
// (den skriver til arbeidskopien). Returnerer feltene skallet deler med L for ett språk.
export function lesCommon(sprak) {
  const start = kilde.indexOf('const common = {');
  if (start < 0) throw new Error('fant ikke const common = { i generer-lokalsider.mjs');
  const fra = kilde.indexOf(`\n  ${sprak}: {`, start);
  if (fra < 0) throw new Error(`fant ikke ${sprak} i common`);
  const slutt = kilde.indexOf('\n  },', fra);
  const blokk = kilde.slice(fra, slutt);
  const felt = (navn) => {
    const m = blokk.match(new RegExp(`\\b${navn}: '((?:[^'\\\\]|\\\\.)*)'`));
    if (!m) throw new Error(`fant ikke ${navn} i common.${sprak}`);
    return m[1].replace(/\\'/g, "'");
  };
  return Object.fromEntries(['appStore', 'play', 'consent', 'accept', 'reject', 'privacy', 'terms', 'withdraw'].map((n) => [n, felt(n)]));
}

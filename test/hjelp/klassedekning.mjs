// Finner klasser i sideinnholdet som ingen regel i side.css eller skall.css nevner.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { alleSider } from '../../scripts/sidetyper.mjs';
import { trekkUt } from '../../scripts/skall-paa.mjs';

const ROT = fileURLToPath(new URL('../..', import.meta.url));

export function utenKommentarer(css) {
  return css.replace(/\/\*[\s\S]*?\*\//gu, '');
}

function klasserIVelgere(css) {
  const ut = new Set();
  for (const m of utenKommentarer(css).matchAll(/\.(-?[_a-zA-Z][\w-]*)/gu)) ut.add(m[1]);
  return ut;
}

/** Klassene i innholdet på alle sider av typen, minus de som har en regel
 * (`.klasse` i en velger i side.css eller skall.css), minus unntakene.
 * `unntak` er { klasse: begrunnelse }. Innholdet leses med trekkUt. */
export function klasserUtenRegel(type, unntak = {}) {
  const regler = new Set([
    ...klasserIVelgere(readFileSync(join(ROT, 'side.css'), 'utf8')),
    ...klasserIVelgere(readFileSync(join(ROT, 'skall.css'), 'utf8')),
  ]);
  const funnet = new Set();
  for (const s of alleSider(ROT).filter((x) => x.type === type)) {
    const html = readFileSync(join(ROT, s.fil), 'utf8');
    let innhold;
    try { innhold = trekkUt(html, s.sti).innhold; } catch { continue; }
    for (const m of innhold.matchAll(/\sclass="([^"]*)"/gu)) for (const k of m[1].split(/\s+/u)) if (k) funnet.add(k);
  }
  return [...funnet].filter((k) => !regler.has(k) && !(k in unntak)).sort();
}

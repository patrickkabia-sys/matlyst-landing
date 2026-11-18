// Samler de lange sidene per språk og slår dem sammen med de tynne sidene i generatorene.
import { rikeSider as en } from './en-rike-sider.mjs';
import { rikeSider as nb } from './nb-rike-sider.mjs';
import { rikeSider as sv } from './sv-rike-sider.mjs';
import { rikeSider as da } from './da-rike-sider.mjs';

export const RIK_DATO = '2026-11-18';
// Enhetsomregnerne på nordiske språk lastes hvis filene finnes (de skrives av egne økter).
const laster = async (fil, navn) => (await import(fil).catch(() => ({})))[navn] ?? {};
const nbEnh = await laster('./nb-enhetssider.mjs', 'enhetsSiderNb');
const svEnh = await laster('./sv-enhetssider.mjs', 'enhetsSiderSv');
const daEnh = await laster('./da-enhetssider.mjs', 'enhetsSiderDa');
export const RIKE = { en, nb: { ...nb, ...nbEnh }, sv: { ...sv, ...svEnh }, da: { ...da, ...daEnh } };

/** Legger de lange feltene oppå sider med samme path, og tar med helt nye sider (må ha eyebrow og steg). */
export function utvid(lang, basis) {
  const rike = RIKE[lang];
  const stier = new Set(basis.map((s) => s.path));
  return [
    ...basis.map((s) => ({ ...s, ...(rike[s.path] ?? {}) })),
    ...Object.entries(rike).filter(([sti, s]) => !stier.has(sti) && s.eyebrow && s.steg).map(([path, s]) => ({ path, ...s })),
  ];
}

export const medRik = (lang, side) => ({ ...side, ...(RIKE[lang][side.path] ?? {}) });

/** Alle offentlige adresser (med språkmappe) som har en lang side, til lastmod. */
export function rikeAdresser() {
  const prefiks = { en: '/en/', nb: '/', sv: '/sv/', da: '/da/' };
  return Object.entries(RIKE).flatMap(([lang, sider]) => Object.keys(sider).map((sti) => `${prefiks[lang]}${sti}`));
}

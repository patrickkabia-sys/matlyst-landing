// Vaktene for alle sidefamilier (scripts/familier/). Hver vakt er en ren funksjon, så testen kan vise at den blir rød.
import { existsSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lesData, publiserbare, validerData } from '../../scripts/familier/felles.mjs';
import { SPRAKMAPPE, familieSider } from '../../scripts/familier/register.mjs';
import { NORSKE_RESTORD } from './restord.mjs';

const ENTITETER = { '&nbsp;': ' ', '&#160;': ' ', '&#8239;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" };
const utenTagger = (html) => String(html)
  .replace(/<!--[\s\S]*?-->/gu, ' ').replace(/<script[\s\S]*?<\/script>/gu, ' ').replace(/<style[\s\S]*?<\/style>/gu, ' ')
  .replace(/<[^>]+>/gu, ' ')
  .replace(/&(?:nbsp|amp|lt|gt|quot|#160|#8239|#39);/gu, (e) => ENTITETER[e]);

/** Lead, forst, rik, steg og faq som tekst, uten HTML-tagger, script og stil. */
export function synligTekst(side) {
  const deler = [side.lead, side.forst, side.rik, ...(side.steg ?? []).flat(), ...(side.faq ?? []).flat()];
  return deler.filter((d) => typeof d === 'string').map(utenTagger).join(' ').replace(/[ \t\r\n]+/gu, ' ').trim();
}

/** Hvert tall i synlig tekst som ikke står i `tillatte`. Hardt mellomrom som tusenskille slås sammen først. */
export function tallUtenforData(side, tillatte) {
  const tekst = synligTekst(side).replace(/(\d)[  ](?=\d{3}(?!\d))/gu, '$1');
  return (tekst.match(/\d+(?:[.,]\d+)?/gu) ?? []).filter((t) => !tillatte.has(t));
}

const ord = (tekst) => tekst.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
const femmere = (tekst) => {
  const o = ord(tekst);
  return new Set(Array.from({ length: Math.max(0, o.length - 4) }, (_, i) => o.slice(i, i + 5).join(' ')));
};

/**
 * For hver side: andelen ordfemmere som ikke finnes på noen annen side i lista.
 * Sider under terskelen returneres. En side uten én eneste ordfemmer regnes som 0 (ingenting eget).
 * Terskelen 0,2 er et startpunkt; familie 1 måler den mot ekte sider og senker den aldri for å få grønt.
 */
export function forLike(sider, terskel = 0.2) {
  const sett = sider.map((s) => femmere(s.tekst));
  const iAntallSider = new Map();
  for (const f of sett) for (const g of f) iAntallSider.set(g, (iAntallSider.get(g) ?? 0) + 1);
  return sider.map((s, i) => {
    const alle = sett[i];
    const unik = alle.size === 0 ? 0 : [...alle].filter((g) => iAntallSider.get(g) === 1).length / alle.size;
    return { sti: s.sti, unik };
  }).filter((r) => r.unik < terskel);
}

/** Grupper av stier med samme verdi i feltet (små og store bokstaver og ytre mellomrom teller ikke). */
export function dupliserte(sider, felt) {
  const perVerdi = new Map();
  for (const s of sider) {
    const v = String(s[felt] ?? '').trim().toLowerCase();
    perVerdi.set(v, [...(perVerdi.get(v) ?? []), s.sti]);
  }
  return [...perVerdi.values()].filter((g) => g.length > 1);
}

function htmlUnder(mappe) {
  if (!existsSync(mappe)) return [];
  return readdirSync(mappe, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? htmlUnder(join(mappe, e.name)) : e.name.endsWith('.html') ? [join(mappe, e.name)] : []));
}

/**
 * Samsvar mellom data og filer. manglerFil: publiserbare rader (og samlesiden) uten fil på disk.
 * manglerRad: HTML-fil under familiens rot som ikke hører til en publiserbar rad. Alt under en familierot
 * skal komme fra datafila: en håndskrevet fil, en fil for et utkast og en gammel fil etter at en rad er
 * fjernet gir alle manglerRad. Stiene er relative til `rotmappe`.
 */
export function sideMotData(familie, rotmappe) {
  const manglerFil = [];
  const manglerRad = [];
  for (const [marked, { rot }] of Object.entries(familie.markeder)) {
    const mappe = join(rotmappe, SPRAKMAPPE[marked], rot);
    const forventet = new Map([[join(mappe, 'index.html'), 'samleside']]);
    for (const rad of publiserbare(lesData(fileURLToPath(familie.mappe), marked))) forventet.set(join(mappe, rad.slug, 'index.html'), rad.id);
    for (const fil of forventet.keys()) if (!existsSync(fil)) manglerFil.push(relative(rotmappe, fil));
    for (const fil of htmlUnder(mappe)) if (!forventet.has(fil)) manglerRad.push(relative(rotmappe, fil));
  }
  return { manglerFil: manglerFil.sort(), manglerRad: manglerRad.sort() };
}

/**
 * Kjører alle vaktene for hver familie og marked. Gir `feil` (lesbare linjer, tom når alt er i orden)
 * og `kontrollert` (antall sider vaktene faktisk så på), så en test kan kreve at vaktene ikke hoppet over alt.
 */
export async function kontrollerFamilier(familier, rotmappe) {
  const feil = [];
  let kontrollert = 0;
  for (const familie of familier) {
    for (const marked of Object.keys(familie.markeder)) {
      const navn = `${familie.id}/${marked}`;
      const data = (() => {
        try { return lesData(fileURLToPath(familie.mappe), marked); } catch (e) { feil.push(`${navn}: ${e.message}`); return null; }
      })();
      if (!data) continue;
      try { validerData(data); } catch (e) { feil.push(`${navn}: ${e.message}`); continue; }
      const sider = await familieSider(marked, [{ ...familie, markeder: { [marked]: familie.markeder[marked] } }]);
      const mal = await import(new URL(`mal-${marked}.mjs`, familie.mappe));
      const rader = publiserbare(data);
      const alleTillatte = new Set(rader.flatMap((r) => [...mal.tillatteTall(r, data)]));
      const liste = Object.entries(sider).map(([nokkel, side]) => ({ sti: nokkel, ...side, tekst: synligTekst(side) }));
      for (const s of liste) {
        kontrollert += 1;
        const rad = rader.find((r) => s.sti === `${familie.markeder[marked].rot}${r.slug}/`);
        for (const t of tallUtenforData(s, rad ? mal.tillatteTall(rad, data) : alleTillatte)) feil.push(`${navn}: tall utenfor data på ${s.sti}: ${t}`);
        if (marked !== 'nb' && NORSKE_RESTORD.test(s.tekst)) feil.push(`${navn}: norsk restord på ${s.sti}`);
      }
      for (const r of forLike(liste)) feil.push(`${navn}: for lik de andre sidene: ${r.sti} (${r.unik.toFixed(2)} unik)`);
      for (const felt of ['title', 'h1', 'description']) for (const g of dupliserte(liste, felt)) feil.push(`${navn}: lik ${felt} på ${g.join(', ')}`);
      const m = sideMotData({ ...familie, markeder: { [marked]: familie.markeder[marked] } }, rotmappe);
      for (const f of m.manglerFil) feil.push(`${navn}: rad uten fil: ${f}`);
      for (const f of m.manglerRad) feil.push(`${navn}: fil uten rad: ${f}`);
    }
  }
  return { feil, kontrollert };
}

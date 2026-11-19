// Setter inn «Related»-blokker fra seo-data/lenkekart.json (hub og eiker), så hver side får
// innkommende lenker fra brødtekstområdet og alt henger sammen. Kjøres ETTER generatorene:
//   node scripts/lenker-sett.mjs
// Regler: hub lenker til alle sine eiker; eike lenker opp til hubben (og tilleggshubber) og til to søsken;
// forsiden lenker til alle hubber. Mål som ikke finnes som fil hoppes over (planlagte sider).
// Ankertekst er målsidens tittel. Idempotent: blokken mellom markørene skrives på nytt hver gang.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SIDEGRUPPER } from './locale-sider.mjs';

const START = '<!-- relatert:start -->';
const SLUTT = '<!-- relatert:slutt -->';
const OVERSKRIFT = { en: 'Related guides', nb: 'Relaterte guider', sv: 'Relaterade guider', da: 'Relaterede guider' };
const FORSIDE = { en: '/en/', nb: '/', sv: '/sv/', da: '/da/' };

export function filFraSti(rot, sti) {
  return join(rot, sti.endsWith('/') ? `${sti.slice(1)}index.html` : sti.slice(1));
}

export function tittel(html) {
  const t = html.match(/<title>([^<]*)<\/title>/iu)?.[1] ?? '';
  return t.replace(/\s*\|\s*Matlyst\s*$/iu, '').replace(/\s+[—–]\s+/gu, ': ').trim();
}

/** Beregner relaterte mål per side fra kartet. Rekkefølge og innhold er deterministisk. */
export function beregn(kart, forside) {
  const per = new Map();
  const leggTil = (side, mal) => {
    if (side === mal) return;
    const liste = per.get(side) ?? [];
    if (!liste.includes(mal)) liste.push(mal);
    per.set(side, liste);
  };
  const hubber = [];
  for (const g of Object.values(kart.hubber)) {
    hubber.push(g.hub);
    const alle = [...g.eiker, ...(g.planlagt ?? [])];
    for (const eike of alle) leggTil(g.hub, eike);
    for (const th of g.tilleggshubber ?? []) for (const eike of g.eiker) leggTil(th, eike);
    alle.forEach((eike, i) => {
      leggTil(eike, g.hub);
      for (const th of g.tilleggshubber ?? []) leggTil(eike, th);
      for (const d of [1, 2]) if (alle.length > d) leggTil(eike, alle[(i + d) % alle.length]);
    });
  }
  for (const h of hubber) leggTil(forside, h);
  return per;
}

export function blokk(lang, lenker) {
  const li = lenker.map(([sti, tekst]) => `<li><a href="${sti}">${tekst}</a></li>`).join('');
  return `${START}<section class="related"><h2>${OVERSKRIFT[lang]}</h2><ul>${li}</ul></section>${SLUTT}`;
}

export function settInn(html, blokkTekst, sti) {
  if (sti === '/') return html;
  const uten = html.replace(new RegExp(`${START}[\\s\\S]*?${SLUTT}\\n?`, 'u'), '');
  for (const anker of ['<section class="faq">', '<section class="page-cta">', '<section class="cta">', '</main>']) {
    const i = uten.indexOf(anker);
    if (i > -1) return `${uten.slice(0, i)}${blokkTekst}\n${uten.slice(i)}`;
  }
  return uten;
}

/** Oversetter det engelske kartet til et annet språk via sidegruppene. Sider uten motstykke hoppes over. */
export function kartForSprak(enKart, lang) {
  if (lang === 'en') return enKart;
  const tilSprak = (sti) => SIDEGRUPPER.find((g) => g.sider.en === sti)?.sider[lang] ?? null;
  const lista = (l) => (l ?? []).map(tilSprak).filter(Boolean);
  const hubber = {};
  for (const [navn, g] of Object.entries(enKart.hubber)) {
    const hub = tilSprak(g.hub);
    if (!hub) continue;
    hubber[navn] = { hub, tilleggshubber: lista(g.tilleggshubber), eiker: lista(g.eiker), planlagt: lista(g.planlagt) };
  }
  return { hubber };
}

export function kjor(rot, lang = 'en') {
  const enKart = JSON.parse(readFileSync(join(rot, 'seo-data/lenkekart.json'), 'utf8')).en;
  const kart = kartForSprak(enKart, lang);
  const per = beregn(kart, FORSIDE[lang]);
  const endret = [];
  for (const [side, maal] of per) {
    const fil = filFraSti(rot, side);
    if (!existsSync(fil)) continue;
    const lenker = maal.filter((m) => existsSync(filFraSti(rot, m))).map((m) => [m, tittel(readFileSync(filFraSti(rot, m), 'utf8'))]);
    if (!lenker.length) continue;
    const html = readFileSync(fil, 'utf8');
    const ny = settInn(html, blokk(lang, lenker), side);
    if (ny !== html) { writeFileSync(fil, ny); endret.push(side); }
  }
  return endret;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const rot = fileURLToPath(new URL('..', import.meta.url));
  for (const lang of ['en', 'nb', 'sv', 'da']) console.log(`lenker-sett ${lang}: ${kjor(rot, lang).length} sider oppdatert`);
}

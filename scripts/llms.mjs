// Skriver llms.txt fra sideregisteret (scripts/sidetyper.mjs). Faktadelen og språkintroene ligger i
// scripts/llms-tekst.json; lenkene, titlene og beskrivelsene hentes fra sidene selv. Står sist i byggekjeden.
// Rekkefølgen er deterministisk (sortert på sti), så to bygg på rad gir identisk fil.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FAMILIER, SPRAKMAPPE } from './familier/register.mjs';
import { alleSider } from './sidetyper.mjs';

const BASE = 'https://matlyst-app.no';
const SPRAK = ['nb', 'da', 'sv', 'en'];
const BLOGGROT = { nb: '/blogg/', sv: '/sv/blogg/', da: '/da/blog/', en: '/en/blog/' };
const VERKTOYHUB = { nb: '/verktoy/enhetsomregner/', sv: '/sv/verktyg/enhetsomvandlare/', da: '/da/vaerktoejer/enhedsomregner/', en: '/en/tools/unit-converter/' };

const ENTITETER = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
export function avkod(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/giu, (m, e) => {
    if (e[0] === '#') return String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return ENTITETER[e.toLowerCase()] ?? m;
  });
}

export function sideInfo(html) {
  const tittel = /<title>([^<]*)<\/title>/u.exec(html)?.[1];
  const beskrivelse = /<meta name="description" content="([^"]*)"/u.exec(html)?.[1];
  const noindex = /<meta name="robots" content="[^"]*noindex/u.test(html);
  return { tittel: tittel && avkod(tittel).replace(/\s*\|\s*Matlyst\s*$/u, '').trim(), beskrivelse: beskrivelse && avkod(beskrivelse).trim(), noindex };
}

// Samlesidene til de registrerte familiene (scripts/familier/), per språk. Enkeltsidene under dem tas ikke med.
const familiesamlesider = (familier, sprak) => new Set(familier.flatMap((f) => Object.entries(f.markeder).filter(([marked]) => marked === sprak).map(([marked, { rot }]) => `/${SPRAKMAPPE[marked]}${rot}`)));

// Pure funksjon: registeroppføringer med tittel/beskrivelse inn, llms.txt-tekst ut.
export function byggLlms(sider, tekst, familier = FAMILIER) {
  const ut = [tekst.head.trimEnd(), ''];
  const linje = (s) => `- [${s.tittel}](${BASE}${s.sti}): ${s.beskrivelse}`;
  const liste = (xs) => xs.sort((a, b) => a.sti.localeCompare(b.sti)).map(linje);
  for (const sprak of SPRAK) {
    const t = tekst.sprak[sprak];
    const av = sider.filter((s) => s.sprak === sprak && !s.noindex && s.tittel && s.beskrivelse);
    const blogg = av.filter((s) => s.sti.startsWith(BLOGGROT[sprak]));
    const nav = familiesamlesider(familier, sprak);
    const hub = av.filter((s) => s.sti === VERKTOYHUB[sprak] || nav.has(s.sti));
    const juss = av.filter((s) => s.type === 'juss');
    const forside = av.filter((s) => s.type === 'forside');
    const funksjoner = av.filter((s) => ['guide-kort', 'guide-lang', 'guide-gammel'].includes(s.type) && !s.sti.startsWith(BLOGGROT[sprak]));
    ut.push(`## ${t.navn}`, '', t.intro, '', ...liste(forside), ...liste(funksjoner), '');
    ut.push(`## ${t.navn}: ${t.blogg}`, '', ...liste(blogg), '');
    ut.push(`## ${t.navn}: ${t.verktoy}`, '', ...liste(hub), '');
    ut.push(`## ${t.navn}: ${t.juss}`, '', ...liste(juss), '');
  }
  ut.push('## Personvern / Privacy', '', tekst.personvern, '', tekst.hale.trimEnd());
  return `${ut.join('\n')}\n`;
}

export function lagLlms(rot) {
  const tekst = JSON.parse(readFileSync(join(rot, 'scripts/llms-tekst.json'), 'utf8'));
  const sider = alleSider(rot).map((s) => ({ ...s, ...sideInfo(readFileSync(join(rot, s.fil), 'utf8')) }));
  return byggLlms(sider, tekst);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const rot = fileURLToPath(new URL('..', import.meta.url));
  writeFileSync(join(rot, 'llms.txt'), lagLlms(rot));
}

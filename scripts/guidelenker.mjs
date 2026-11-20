// Legger en blokk med lenker til alle guidene i bunnen av hver side, per språk.
// Uten den var de fleste undersidene foreldreløse: forsiden lenket til 5 av 24,
// og Google fant resten bare via sitemap (36 av ~96 sider indeksert 28.10.2026).
// Listen utledes fra sitemapene, så en ny side i sitemapen får lenker automatisk.
// Kjør etter generatorene: node scripts/guidelenker.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { familieForSti } from './familier/register.mjs';

const ROT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOMENE = 'https://matlyst-app.no';

export const SITEMAPER = { nb: 'sitemap.xml', sv: 'sitemap-sv.xml', da: 'sitemap-da.xml', en: 'sitemap-en.xml' };
const ETIKETT = { nb: 'Guider', sv: 'Guider', da: 'Guider', en: 'Guides' };

// Forsider og juridiske sider står allerede i bunnteksten eller er ikke guider.
export const UTELATT = new Set([
  '/', '/sv/', '/da/', '/en/',
  '/personvern.html', '/vilkar.html', '/slett-konto.html',
  '/sv/integritet/', '/sv/villkor/', '/sv/radera-konto/',
  '/da/privatliv/', '/da/vilkaar/', '/da/slet-konto/',
  '/en/privacy/', '/en/terms/', '/en/delete-account/',
]);

export const UNDER_HUB = /^\/(?:[a-z]{2}\/)?(?:tools|verktoy|verktyg|vaerktoejer|holidays)\/(?!unit-converter\/$|enhetsomregner\/$|enhetsomvandlare\/$|enhedsomregner\/$)[^/]+\/$/u;

// Plassmerket scripts/skall.mjs skriver i hylledelen til guideblokka.
export const PLASS = '<!-- guider:plass -->';

const BUNNRAD = '<div class="bunnrad">';

export const MONSTER = /<!-- guider:bunn -->[\s\S]*?<!-- \/guider:bunn -->/u;

export function filFor(sti) {
  return path.join(ROT, sti.endsWith('/') ? `${sti}index.html` : sti);
}

export function sprakFor(sti) {
  const m = sti.match(/^\/(sv|da|en)\//u);
  return m ? m[1] : 'nb';
}

function stierFraSitemap(fil) {
  const xml = readFileSync(path.join(ROT, fil), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/gu)].map((m) => m[1].replace(DOMENE, ''));
}

function lenketekst(html) {
  const tittel = html.match(/<title>([^<]+)<\/title>/u)?.[1] ?? '';
  return tittel.replace(/\s*\|\s*Matlyst.*$/u, '').replace(/\s+[—–]\s+/gu, ': ').trim();
}

export function guider(lang) {
  return stierFraSitemap(SITEMAPER[lang])
    .filter((sti) => !UTELATT.has(sti))
    // Bloggartiklene lenkes fra bloggforsiden og fra hverandre, ikke fra hver bunntekst.
    .filter((sti) => !/^\/(?:[a-z]{2}\/)?blogg?\/[^/]+\/$/u.test(sti))
    // Enkeltsider under en hub (enhetsomregnere, høytider) lenkes fra huben og fra hverandre.
    // Uten dette fikk hver bunntekst over 200 omregnerlenker (designgjennomgang 18.11.2026).
    .filter((sti) => !UNDER_HUB.test(sti))
    // Det samme gjelder alt under roten til en datadrevet familie (scripts/familier/), som ligger to nivåer under huben.
    .filter((sti) => familieForSti(sti) === null)
    .map((sti) => ({ sti, tekst: lenketekst(readFileSync(filFor(sti), 'utf8')) }));
}

export function blokk(lang, liste) {
  const lenker = liste.map(({ sti, tekst }) => `<a href="${sti}">${tekst}</a>`).join('');
  return `<!-- guider:bunn --><div class="f-guider" role="navigation" aria-label="${ETIKETT[lang]}">${lenker}</div><!-- /guider:bunn -->`;
}

export function settInn(html, ny, sti) {
  // Forsidene på alle fire språk bygges av scripts/forside.mjs med eget skall.
  if (['/', '/sv/', '/da/', '/en/'].includes(sti)) return html;
  if (MONSTER.test(html)) return html.replace(MONSTER, () => ny);
  // Det nye skallet har en plass i hylledelen (<details class="alle-guider">).
  if (html.includes(PLASS)) return html.replace(PLASS, () => ny);
  // Hylledel uten plassmerke: blokka står i hylledelen foran .bunnrad, aldri etter bunnteksten.
  if (html.includes(BUNNRAD)) return html.replace(BUNNRAD, () => `${ny}${BUNNRAD}`);
  return html.replace('</footer>', () => `  ${ny}\n</footer>`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  let endret = 0;
  for (const lang of Object.keys(SITEMAPER)) {
    const liste = guider(lang);
    for (const sti of stierFraSitemap(SITEMAPER[lang])) {
      const fil = filFor(sti);
      if (!existsSync(fil)) continue;
      const html = readFileSync(fil, 'utf8');
      if (!html.includes('</footer>')) continue;
      const neste = settInn(html, blokk(lang, liste), sti);
      if (neste !== html) { writeFileSync(fil, neste); endret += 1; }
    }
  }
  console.log(`guidelenker: ${endret} sider oppdatert`);
}

// Gir sidene delebildet for sin type og sitt språk (og:image og twitter:image). Kjøres ETTER generatorene:
//   node scripts/delebilde.mjs
// Bare sider som har det felles bildet (/images/og.jpg) får nytt: en side med eget bilde (bloggartikler,
// vervekort, de gamle guidene) beholder sitt. Forsider, juss og tjenester står utenfor.
// Idempotent. Rører bare <head>-metataggene; lastmod-avtrykket (lastmod.mjs) leser dem ikke.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sidetypeEllerNull } from './sidetyper.mjs';
import { BASE, BILDETYPE_FOR_SIDETYPE, BREDDE, FELLES_BILDE, HOYDE, bildeAlt, bildeUrl } from './delebilde-tekst.mjs';

const UTELATT = new Set(['node_modules', '.git', 'test-results', 'playwright-report', 'docs', 'test', 'scripts', 'seo-motor', 'seo-data', 'seo', 'blogg-kilde', 'qa']);
const FELLES = `${BASE}${FELLES_BILDE}`;
const esc = (s) => s.replace(/&/gu, '&amp;').replace(/"/gu, '&quot;').replace(/</gu, '&lt;');

function htmlFiler(mappe) {
  return readdirSync(mappe, { withFileTypes: true }).flatMap((d) => {
    if (d.name.startsWith('.') || d.isSymbolicLink()) return [];
    if (d.isDirectory()) return UTELATT.has(d.name) ? [] : htmlFiler(join(mappe, d.name));
    return d.name.endsWith('.html') ? [join(mappe, d.name)] : [];
  });
}

function stiForFil(fil) {
  if (fil === 'index.html') return '/';
  return fil.endsWith('/index.html') ? `/${fil.slice(0, -'index.html'.length)}` : `/${fil}`;
}

export const sprakForSti = (sti) => /^\/(sv|da|en)(\/|$)/u.exec(sti)?.[1] ?? 'nb';

// Hvilket delebilde en side skal ha, eller null for sider som ikke får et.
export function bildetypeFor(sti, html) {
  return BILDETYPE_FOR_SIDETYPE[sidetypeEllerNull(sti, html)] ?? null;
}

export function settDelebilde(html, type, sprak) {
  if (!html.includes(`<meta property="og:image" content="${FELLES}">`)) return html;
  const url = bildeUrl(type, sprak);
  const alt = esc(bildeAlt(type, sprak));
  let ut = html
    .replace(`<meta property="og:image" content="${FELLES}">`, `<meta property="og:image" content="${url}">\n<meta property="og:image:width" content="${BREDDE}">\n<meta property="og:image:height" content="${HOYDE}">`)
    .replace(`<meta name="twitter:image" content="${FELLES}">`, `<meta name="twitter:image" content="${url}">`);
  ut = ut.replace(/<meta property="og:image:alt" content="[^"]*">/u, `<meta property="og:image:alt" content="${alt}">`);
  ut = ut.replace(/<meta name="twitter:image:alt" content="[^"]*">/u, `<meta name="twitter:image:alt" content="${alt}">`);
  // Mangler alt-taggene, legges de rett etter bildet.
  if (!/<meta property="og:image:alt"/u.test(ut)) ut = ut.replace(`<meta property="og:image:height" content="${HOYDE}">`, `$&\n<meta property="og:image:alt" content="${alt}">`);
  if (!/<meta name="twitter:image:alt"/u.test(ut)) ut = ut.replace(`<meta name="twitter:image" content="${url}">`, `$&\n<meta name="twitter:image:alt" content="${alt}">`);
  return ut;
}

export function kjor(rot) {
  const endret = [];
  for (const full of htmlFiler(rot)) {
    const fil = relative(rot, full).split('\\').join('/');
    const sti = stiForFil(fil);
    const html = readFileSync(full, 'utf8');
    const type = bildetypeFor(sti, html);
    if (type === null) continue;
    const ny = settDelebilde(html, type, sprakForSti(sti));
    if (ny !== html) { writeFileSync(full, ny); endret.push({ sti, type, sprak: sprakForSti(sti) }); }
  }
  return endret;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const endret = kjor(fileURLToPath(new URL('..', import.meta.url)));
  const tall = {};
  for (const e of endret) tall[`${e.type}/${e.sprak}`] = (tall[`${e.type}/${e.sprak}`] ?? 0) + 1;
  console.log(`delebilde: ${endret.length} sider oppdatert`, JSON.stringify(tall));
}

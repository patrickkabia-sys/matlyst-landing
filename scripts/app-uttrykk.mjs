// App-uttrykk: gjør nettsiden til en appside. Kjøres ETTER generatorene (som sprak-signaler.mjs):
//   node scripts/app-uttrykk.mjs
// 1. Alle indekserbare sider får nedlastingsknapp i toppmenyen og en fast nedlastingslinje på mobil.
// 2. Forsidene (nb, sv, da, en) får telefoner og matformer i heroen, og funksjonskortene blir rader med telefon.
// Idempotent: markørene data-app-uttrykk og app-uttrykk:slutt hindrer dobbel innsetting.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { matformer, tomat, sitron, chili, blad, egg } from './illustrasjon.mjs';

const TEKSTER = {
  nb: { last: 'Få appen', tittel: 'Last ned Matlyst', under: 'Gratis for iPhone og Android', regionnavn: 'Last ned appen' },
  sv: { last: 'Hämta', tittel: 'Hämta Matlyst', under: 'Gratis för iPhone och Android', regionnavn: 'Hämta appen' },
  da: { last: 'Hent', tittel: 'Hent Matlyst', under: 'Gratis til iPhone og Android', regionnavn: 'Hent appen' },
  en: { last: 'Get the app', tittel: 'Get Matlyst', under: 'Free for iPhone and Android', regionnavn: 'Get the app' },
};
const ALT = {
  nb: { plan: 'Matlyst-skjerm med ukemenyen: middag for hver dag', handle: 'Matlyst-skjerm med handlelista sortert etter butikkavdeling', hero: 'Matlyst på mobilen' },
  sv: { plan: 'Matlyst-skärm med veckomenyn: middag för varje dag', handle: 'Matlyst-skärm med inköpslistan sorterad efter butiksavdelning', hero: 'Matlyst i mobilen' },
  da: { plan: 'Matlyst-skærm med madplanen: aftensmad for hver dag', handle: 'Matlyst-skærm med indkøbslisten sorteret efter butiksafdeling', hero: 'Matlyst på mobilen' },
  en: { plan: 'Matlyst meal plan screen with a dinner for each day', handle: 'Matlyst grocery list grouped by store section', hero: 'Matlyst on a phone' },
};
const IMPORT_BILDE = {
  en: { src: '/images/en-guide/matlyst-import-screen-paste-link-400.webp', srcset: '/images/en-guide/matlyst-import-screen-paste-link-400.webp 400w, /images/en-guide/matlyst-import-screen-paste-link-800.webp 800w', w: 400, h: 870, alt: 'Matlyst import screen with a field to paste a link' },
  nb: { src: '/images/en-guide/nb/matlyst-share-instagram-post-to-matlyst-poster.webp', w: 540, h: 960, alt: 'Illustrasjon: del et innlegg til Matlyst' },
  sv: { src: '/images/en-guide/sv/matlyst-share-instagram-post-to-matlyst-poster.webp', w: 540, h: 960, alt: 'Illustration: dela ett inlägg med Matlyst' },
  da: { src: '/images/en-guide/da/matlyst-share-instagram-post-to-matlyst-poster.webp', w: 540, h: 960, alt: 'Illustration: del et opslag med Matlyst' },
};
const HJEM = { '/': 'nb', '/sv/': 'sv', '/da/': 'da', '/en/': 'en' };
const UTELATT = new Set(['node_modules', '.git', 'test-results', 'playwright-report']);
const MERKE = '<!-- app-uttrykk:start -->';
const MERKE_SLUTT = '<!-- app-uttrykk:slutt -->';

const attr = (html, navn) => html.match(new RegExp(`<html[^>]*\\slang="([^"]+)"`, 'iu'))?.[1] ?? null;
const sprakFra = (html) => { const l = attr(html); return l === 'no' ? 'nb' : l; };
const erNoindex = (html) => /<meta name="robots" content="[^"]*noindex/iu.test(html);
const butikk = (html) => ({
  ios: html.match(/href="(https:\/\/apps\.apple\.com\/[^"]+)"/u)?.[1] ?? null,
  play: html.match(/href="(https:\/\/play\.google\.com\/[^"]+)"/u)?.[1] ?? null,
});

export function nedlastingsKnapp(lang, urler) {
  const t = TEKSTER[lang];
  return `<a class="nav-dl" href="${urler.ios}" data-dl="ios" rel="noopener">${t.last}</a>`;
}

export function nedlastingsLinje(lang, urler) {
  const t = TEKSTER[lang];
  return `${MERKE}<div class="dl-bar" id="dl-bar" role="region" aria-label="${t.regionnavn}"><img class="dl-icon" src="/images/icon.png" width="40" height="40" alt=""><span class="dl-tekst"><strong>${t.tittel}</strong><span>${t.under}</span></span><span class="dl-knapper"><a class="btn-store" href="${urler.ios}" data-dl="ios" rel="noopener"><img src="/images/appstore-badge.svg" width="120" height="40" alt="Download on the App Store"></a><a class="btn-store" href="${urler.play}" data-dl="play" rel="noopener"><img src="/images/googleplay-badge-en.png" width="134" height="40" alt="Get it on Google Play"></a></span></div>${MERKE_SLUTT}`;
}

export function scene(lang) {
  const a = ALT[lang];
  const tel = (n, alt, klasse) => `<img class="tel ${klasse}" src="/images/app/${lang}/tel-${n}.webp" width="536" height="1108" alt="${alt}" decoding="async"${klasse === 'a' ? '' : ' loading="lazy"'}>`;
  return `<div class="hero-stage" aria-label="${a.hero}"><span class="blob" aria-hidden="true"></span>${tel('02', a.plan, 'a')}${tel('03', a.handle, 'b')}${matformer}</div>`;
}

const kortRegex = /<article class="locale-card"><h2 class="disp">([\s\S]*?)<\/h2><p>([\s\S]*?)<\/p>(?:<a class="more" href="([^"]+)">([\s\S]*?)<\/a>)?<\/article>/gu;

export function rader(lang, kort) {
  const a = ALT[lang];
  const ib = IMPORT_BILDE[lang];
  const mat = [[tomat, blad], [sitron, egg], [chili, tomat], [blad, sitron]];
  const telefon = [
    ib.srcset
      ? `<img class="tel" src="${ib.src}" srcset="${ib.srcset}" sizes="260px" width="${ib.w}" height="${ib.h}" alt="${ib.alt}" loading="lazy" decoding="async">`
      : `<img class="tel tel-illustrasjon" src="${ib.src}" width="${ib.w}" height="${ib.h}" alt="${ib.alt}" loading="lazy" decoding="async">`,
    `<img class="tel" src="/images/app/${lang}/tel-02.webp" width="536" height="1108" alt="${a.plan}" loading="lazy" decoding="async">`,
    `<img class="tel" src="/images/app/${lang}/tel-03.webp" width="536" height="1108" alt="${a.handle}" loading="lazy" decoding="async">`,
    '',
  ];
  return `${MERKE}<section class="app-rows" aria-label="${TEKSTER[lang].last}">${kort.map(([h, p, href, mer], i) => `<div class="app-row"><div class="app-row-tekst"><h2 class="disp">${h}</h2><p>${p}</p>${href ? `<a class="more" href="${href}">${mer}</a>` : ''}</div><div class="app-row-scene"><span class="blob" aria-hidden="true"></span>${telefon[i] ?? ''}${(mat[i] ?? mat[0]).map((m, j) => m.replace('class="mat ', `class="mat m${j + 1} `)).join('')}</div></div>`).join('')}</section>${MERKE_SLUTT}`;
}

export function behandle(html, sti) {
  if (html.includes('data-app-uttrykk') || erNoindex(html)) return html;
  const lang = sprakFra(html);
  if (!TEKSTER[lang]) return html;
  const hjemsprak = HJEM[sti];
  const urler = butikk(html);
  if (!urler.ios || !urler.play) return html;
  let ut = html;
  ut = ut.replace(/(<div class="nav-right">[\s\S]*?)(<\/div>)/u, (m, a, b) => `${a}${nedlastingsKnapp(lang, urler)}${b}`);
  if (hjemsprak) {
    ut = ut.replace(/<header class="hero([^"]*)"([^>]*)>([\s\S]*?)<\/header>/u, (m, k, rest, inn) => `<header class="hero${k} has-stage"${rest}>${inn}${scene(lang)}</header>`);
    ut = ut.replace(/<section class="locale-grid"[^>]*>([\s\S]*?)<\/section>/u, (m, inn) => {
      const kort = [...inn.matchAll(kortRegex)].map(([, h, p, href, mer]) => [h, p, href, mer]);
      return kort.length ? rader(lang, kort) : m;
    });
  }
  ut = ut.replace('</body>', `${nedlastingsLinje(lang, urler)}</body>`);
  return ut.replace('<body', '<body data-app-uttrykk="1"');
}

function htmlFiler(mappe) {
  return readdirSync(mappe, { withFileTypes: true }).flatMap((d) => {
    if (d.isDirectory()) return UTELATT.has(d.name) ? [] : htmlFiler(join(mappe, d.name));
    return d.name.endsWith('.html') ? [join(mappe, d.name)] : [];
  });
}

export function kjor(rot) {
  const endret = [];
  for (const fil of htmlFiler(rot)) {
    const rel = relative(rot, fil);
    const sti = rel === 'index.html' ? '/' : `/${rel.replace(/index\.html$/u, '')}`;
    const html = readFileSync(fil, 'utf8');
    const ny = behandle(html, sti);
    if (ny !== html) { writeFileSync(fil, ny); endret.push(rel); }
  }
  return endret;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(`app-uttrykk: ${kjor(fileURLToPath(new URL('..', import.meta.url))).length} sider oppdatert`);
}

// App-uttrykk: gjør nettsiden til en appside. Kjøres ETTER generatorene (som sprak-signaler.mjs):
//   node scripts/app-uttrykk.mjs
// 1. Forsidene sv, da og en får nedlastingsknapp i toppmenyen og en fast nedlastingslinje på mobil.
// 2. De samme forsidene får telefoner og matformer i heroen, og funksjonskortene blir rader med telefon.
// Idempotent: markørene data-app-uttrykk og app-uttrykk:slutt hindrer dobbel innsetting.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { matformer, tomat, sitron, chili, blad, egg } from './illustrasjon.mjs';
import { SIDEGRUPPER } from './locale-sider.mjs';
import { alleSiderMedUkjente, trygtUnderRot } from './sidetyper.mjs';
import { SOSIALE, organisasjonSkjema } from './organisasjon.mjs';

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

const KORTTEKST = {
  nb: { eyebrow: 'Slik fungerer det', h2: 'Fra lagret oppskrift til middag på bordet.', chips: ['Instagram', 'TikTok', 'Nett', 'Bilde'], pro: 'Pro' },
  sv: { eyebrow: 'Så fungerar det', h2: 'Från sparat recept till middag på bordet.', chips: ['Instagram', 'TikTok', 'Webben', 'Foto'], pro: 'Pro' },
  da: { eyebrow: 'Sådan virker det', h2: 'Fra gemt opskrift til aftensmad på bordet.', chips: ['Instagram', 'TikTok', 'Nettet', 'Foto'], pro: 'Pro' },
  en: { eyebrow: 'How it works', h2: 'From saved recipe to dinner on the table.', chips: ['Instagram', 'TikTok', 'Web', 'Photo'], pro: 'Pro' },
};
const KORTFARGE = ['terra', 'sennep', 'salvie', 'blekk'];

export function rader(lang, kort) {
  const a = ALT[lang];
  const ib = IMPORT_BILDE[lang];
  const k = KORTTEKST[lang];
  const mat = [[tomat, blad], [sitron, egg], [chili, tomat], [blad, sitron]];
  const telefon = [
    ib.srcset
      ? `<img class="tel" src="${ib.src}" srcset="${ib.srcset}" sizes="260px" width="${ib.w}" height="${ib.h}" alt="${ib.alt}" loading="lazy" decoding="async">`
      : `<img class="tel tel-illustrasjon" src="${ib.src}" width="${ib.w}" height="${ib.h}" alt="${ib.alt}" loading="lazy" decoding="async">`,
    `<img class="tel" src="/images/app/${lang}/tel-02.webp" width="536" height="1108" alt="${a.plan}" loading="lazy" decoding="async">`,
    `<img class="tel" src="/images/app/${lang}/tel-03.webp" width="536" height="1108" alt="${a.handle}" loading="lazy" decoding="async">`,
    '',
  ];
  const kortHtml = kort.map(([h, p, href, mer], i) => `<article class="step-card sc-${KORTFARGE[i] ?? 'terra'} si-${i}"><div class="sc-tekst"><span class="sc-nr">${i < 3 ? `0${i + 1}` : k.pro}</span><h3 class="disp">${h}</h3><p>${p}</p>${i === 0 ? `<ul class="sc-chips" aria-label="Instagram, TikTok">${k.chips.map((c) => `<li>${c}</li>`).join('')}</ul>` : ''}${href ? `<a class="more" href="${href}">${mer}</a>` : ''}</div><div class="sc-scene">${telefon[i] ?? ''}${(mat[i] ?? mat[0]).map((m, j) => m.replace('class="mat ', `class="mat m${j + 1} `)).join('')}</div></article>`).join('');
  return `${MERKE}<section class="step-cards" aria-labelledby="slik"><div class="step-cards-hode"><p class="eyebrow">${k.eyebrow}</p><h2 class="disp" id="slik">${k.h2}</h2></div>${kortHtml}</section>${MERKE_SLUTT}`;
}


// ---- Logo, bunntekst med kolonner og sosiale lenker ----
const GRUPPER = ['oppskrifts-app', 'importer-oppskrifter', 'ukemeny', 'handleliste', 'spiskammer', 'instagram-oppskrifter', 'tiktok-oppskrifter', 'auto-velg-oppskriftsapp', 'skapere', 'vilkar', 'personvern'];
const ETIKETT = {
  nb: { produkt: 'Produkt', laer: 'Lær mer', selskap: 'Om Matlyst', folg: 'Følg oss', blogg: 'Kjøkkentips', kontakt: 'Kontakt',
    id: { 'oppskrifts-app': 'Oppskriftsbok-app', 'importer-oppskrifter': 'Importer oppskrifter', ukemeny: 'Ukemeny', handleliste: 'Handleliste', spiskammer: 'Spiskammer', 'instagram-oppskrifter': 'Lagre fra Instagram', 'tiktok-oppskrifter': 'Lagre fra TikTok', 'auto-velg-oppskriftsapp': 'Velg oppskriftsapp', skapere: 'For skapere', vilkar: 'Vilkår', personvern: 'Personvern' } },
  sv: { produkt: 'Produkt', laer: 'Läs mer', selskap: 'Om Matlyst', folg: 'Följ oss', blogg: 'Köksråd', kontakt: 'Kontakt',
    id: { 'oppskrifts-app': 'Receptbok-app', 'importer-oppskrifter': 'Importera recept', ukemeny: 'Veckomeny', handleliste: 'Inköpslista', spiskammer: 'Skafferi', 'instagram-oppskrifter': 'Spara från Instagram', 'tiktok-oppskrifter': 'Spara från TikTok', 'auto-velg-oppskriftsapp': 'Välj receptapp', skapere: 'För skapare', vilkar: 'Villkor', personvern: 'Integritet' } },
  da: { produkt: 'Produkt', laer: 'Læs mere', selskap: 'Om Matlyst', folg: 'Følg os', blogg: 'Køkkentips', kontakt: 'Kontakt',
    id: { 'oppskrifts-app': 'Opskrifts-app', 'importer-oppskrifter': 'Importér opskrifter', ukemeny: 'Madplan', handleliste: 'Indkøbsliste', spiskammer: 'Spisekammer', 'instagram-oppskrifter': 'Gem fra Instagram', 'tiktok-oppskrifter': 'Gem fra TikTok', 'auto-velg-oppskriftsapp': 'Vælg opskriftsapp', skapere: 'For skabere', vilkar: 'Vilkår', personvern: 'Privatliv' } },
  en: { produkt: 'Product', laer: 'Learn', selskap: 'About Matlyst', folg: 'Follow us', blogg: 'Kitchen tips', kontakt: 'Contact',
    id: { 'oppskrifts-app': 'Recipe organizer app', 'importer-oppskrifter': 'Import recipes', ukemeny: 'Meal plan', handleliste: 'Grocery list', spiskammer: 'Pantry', 'instagram-oppskrifter': 'Save from Instagram', 'tiktok-oppskrifter': 'Save from TikTok', 'auto-velg-oppskriftsapp': 'Choose a recipe app', skapere: 'For creators', vilkar: 'Terms', personvern: 'Privacy' } },
};
const BLOGGROT = { nb: '/blogg/', sv: '/sv/blogg/', da: '/da/blog/', en: '/en/blog/' };
const stiFor = (id, lang) => SIDEGRUPPER.find((g) => g.id === id)?.sider[lang === 'nb' ? 'nb' : lang] ?? null;

export const sosialeIkoner = () => `<ul class="f-sosial">${SOSIALE.map((s) => `<li><a href="${s.url}" rel="noopener me" aria-label="${s.navn}"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false" fill="currentColor">${s.ikon}</svg></a></li>`).join('')}</ul>`;

export function bunnKolonner(lang) {
  const e = ETIKETT[lang];
  const lenke = (id) => { const sti = stiFor(id, lang); return sti ? `<li><a href="${sti}">${e.id[id]}</a></li>` : ''; };
  const kol = (tittel, innhold) => `<div class="f-kol"><p class="f-kol-tittel">${tittel}</p><ul>${innhold}</ul></div>`;
  return `${MERKE}<div class="f-kolonner">${kol(e.produkt, ['oppskrifts-app', 'importer-oppskrifter', 'ukemeny', 'handleliste', 'spiskammer'].map(lenke).join(''))}${kol(e.laer, `<li><a href="${BLOGGROT[lang]}">${e.blogg}</a></li>${['auto-velg-oppskriftsapp', 'instagram-oppskrifter', 'tiktok-oppskrifter'].map(lenke).join('')}`)}${kol(e.selskap, `${lenke('skapere')}${lenke('vilkar')}${lenke('personvern')}<li><a href="mailto:hei@matlyst-app.no">${e.kontakt}</a></li>`)}<div class="f-kol"><p class="f-kol-tittel">${e.folg}</p>${sosialeIkoner()}</div></div>${MERKE_SLUTT}`;
}


const HYLLE = {
  nb: { verktoy: 'Verktøy', meny: 'Meny', enh: 'Enhetsomregner' },
  sv: { verktoy: 'Verktyg', meny: 'Meny', enh: 'Enhetsomvandlare' },
  da: { verktoy: 'Værktøjer', meny: 'Menu', enh: 'Enhedsomregner' },
  en: { verktoy: 'Tools', meny: 'Menu', enh: 'Unit converter' },
};

// Kjøkkenhylle: hver gruppe er en krukke på en trehylle, lenkene er små etiketter under.
export function navMeny(lang) {
  const e = ETIKETT[lang];
  const h = HYLLE[lang];
  const lenke = (id, tekst) => { const sti = stiFor(id, lang); return sti ? `<li><a href="${sti}">${tekst ?? e.id[id]}</a></li>` : ''; };
  const krukke = (farge, tittel, innhold) => innhold ? `<div class="hylle-gruppe hylle-${farge}"><p class="hylle-krukke"><span class="hylle-lokk" aria-hidden="true"></span><span class="hylle-glass" aria-hidden="true"></span><span class="hylle-tittel">${tittel}</span></p><ul>${innhold}</ul></div>` : '';
  const a = ['oppskrifts-app', 'importer-oppskrifter', 'ukemeny', 'handleliste', 'spiskammer'].map((id) => lenke(id)).join('');
  const verktoy = lenke('auto-enhetsomregner', h.enh);
  const b = `<li><a href="${BLOGGROT[lang]}">${e.blogg}</a></li>${['auto-velg-oppskriftsapp', 'instagram-oppskrifter', 'tiktok-oppskrifter'].map((id) => lenke(id)).join('')}`;
  const sosial = SOSIALE.map((x) => `<li><a href="${x.url}" rel="noopener me">${x.navn}</a></li>`).join('');
  const tittel = { nb: 'Guider', sv: 'Guider', da: 'Guider', en: 'Guides' }[lang];
  return `${MERKE}<div class="nav-meny"><button type="button" class="nav-meny-knapp" aria-expanded="false" aria-controls="nav-panel" aria-label="${h.meny}"><span class="nav-meny-tekst">${tittel}</span></button><div class="nav-panel" id="nav-panel" hidden>${krukke('terracotta', e.produkt, a)}${krukke('honning', h.verktoy, verktoy)}${krukke('salvie', e.laer, b)}${krukke('plomme', e.folg, sosial)}</div></div>${MERKE_SLUTT}`;
}

// Alle undersider har skall-paa. Her står bare forsidene sv, da og en igjen (nb eies av forside.mjs).
const FORSIDER_IGJEN = new Set(['/sv/', '/da/', '/en/']);

export function behandle(html, sti) {
  if (!FORSIDER_IGJEN.has(sti)) return html;
  if (html.includes('data-app-uttrykk') || erNoindex(html)) return html;
  const lang = sprakFra(html);
  if (!TEKSTER[lang]) return html;
  const hjemsprak = HJEM[sti];
  const urler = butikk(html);
  if (!urler.ios || !urler.play) return html;
  let ut = html;
  ut = ut.replace(/(<div class="nav-right">)([\s\S]*?)(<\/div>)/u, (m, a, mid, b) => `${a}${navMeny(lang)}${mid}${nedlastingsKnapp(lang, urler)}${b}`);
  if (hjemsprak) {
    ut = ut.replace(/<header class="hero([^"]*)"([^>]*)>([\s\S]*?)<\/header>/u, (m, k, rest, inn) => `<header class="hero${k} has-stage"${rest}>${inn}${scene(lang)}</header>`);
    ut = ut.replace(/<section class="locale-grid"[^>]*>([\s\S]*?)<\/section>/u, (m, inn) => {
      const kort = [...inn.matchAll(kortRegex)].map(([, h, p, href, mer]) => [h, p, href, mer]);
      return kort.length ? rader(lang, kort) : m;
    });
  }
  // Logo (ml.) foran ordmerket, apple-touch-icon, bunntekst med kolonner og sosiale lenker.
  ut = ut.replace(/(<a [^>]*class="brand"[^>]*>)(?!<img)/gu, '$1<img class="brand-ml" src="/images/icon-64.png" width="28" height="28" alt="">');
  if (!ut.includes('apple-touch-icon')) ut = ut.replace(/(<link rel="icon"[^>]*>)/u, '$1\n<link rel="apple-touch-icon" href="/images/apple-touch-icon.png">');
  ut = ut.replace(/<footer>/u, `<footer>${bunnKolonner(lang)}`);
  if (hjemsprak) ut = ut.replace('</head>', `${organisasjonSkjema(lang, urler)}\n</head>`);
  ut = ut.replace('</body>', `${nedlastingsLinje(lang, urler)}</body>`);
  return ut.replace('<body', '<body data-app-uttrykk="1"');
}

export function kjor(rot) {
  const endret = [];
  // Ukjente sider (type null) behandles som før 7b, ikke som feil.
  for (const { fil: rel, sti } of alleSiderMedUkjente(rot)) {
    const fil = join(rot, rel);
    if (!trygtUnderRot(rot, fil)) continue;
    const html = readFileSync(fil, 'utf8');
    const ny = behandle(html, sti);
    if (ny !== html && trygtUnderRot(rot, fil)) { writeFileSync(fil, ny); endret.push(rel); }
  }
  return endret;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(`app-uttrykk: ${kjor(fileURLToPath(new URL('..', import.meta.url))).length} sider oppdatert`);
}

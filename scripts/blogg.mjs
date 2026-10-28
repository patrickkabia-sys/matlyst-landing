// Bloggen: SoMe-karusellene som artikler. Innholdet er karusellens egen tekst
// (blogg-kilde/karuseller.json, hentet med eksporter-karuseller.mjs): tabellene blir
// ekte HTML-tabeller, lysbildene vises som bilder, og sluttsiden blir app-CTA-en.
// Ingen fyllprosa: artikkelen sier det karusellen sier, verken mer eller mindre.
// Her står bare det som ikke finnes i karusellen: adresse, sidetittel og CTA-bilde.
import { existsSync, readFileSync } from 'node:fs';
import { appCta } from './app-cta.mjs';

const base = 'https://matlyst-app.no';
export const PUBLISERT = '2026-10-28';

export const BLOGGROT = { nb: '/blogg/', sv: '/sv/blogg/', da: '/da/blog/', en: '/en/blog/' };
const SPRAKKODE = { nb: 'nb-NO', sv: 'sv-SE', da: 'da-DK', en: 'en-US' };

// tema → språk → [slug, sidetittel]. Sidetittelen er skrevet for søket, ikke for karusellen.
export const BLOGGTEMAER = {
  koketid: {
    nb: ['koketider', 'Koketider for egg, ris, pasta og grønnsaker'],
    en: ['boiling-times', 'Boiling times for eggs and vegetables'],
  },
  kjernetemp: {
    nb: ['kjernetemperatur', 'Kjernetemperatur for kjøtt, kylling og fisk'],
    sv: ['innertemperatur', 'Innertemperatur för kött, kyckling och fisk'],
    da: ['kernetemperatur', 'Kernetemperatur for kød, kylling og fisk'],
    en: ['safe-internal-temperatures', 'Safe internal temperatures for meat, chicken, and fish'],
  },
  egg: {
    nb: ['erstatte-egg', 'Erstatte egg i baking: dette kan du bruke i stedet'],
    sv: ['ersatta-agg', 'Ersätta ägg i bakning: det här kan du använda i stället'],
    da: ['erstat-aeg', 'Erstat æg i bagning: det her kan du bruge i stedet'],
  },
  rester: {
    nb: ['rester-i-kjoleskapet', 'Hvor lenge holder rester i kjøleskapet?'],
    sv: ['rester-i-kylen', 'Hur länge håller rester i kylen?'],
    da: ['rester-i-koeleskabet', 'Hvor længe holder rester i køleskabet?'],
    en: ['leftovers-in-the-fridge', 'How long do leftovers last in the fridge?'],
  },
  fryser: {
    nb: ['mat-i-fryseren', 'Hvor lenge kan mat ligge i fryseren?'],
    sv: ['mat-i-frysen', 'Hur länge håller mat i frysen?'],
    da: ['mad-i-fryseren', 'Hvor længe kan mad holde sig i fryseren?'],
    en: ['freezer-storage-times', 'How long can you freeze meat, fish, and leftovers?'],
  },
  airfryer: {
    nb: ['ovnsoppskrift-i-airfryer', 'Ovnsoppskrift i airfryer: slik regner du om tid og temperatur'],
    sv: ['ugnsrecept-i-airfryer', 'Ugnsrecept i airfryer: så räknar du om tid och temperatur'],
    da: ['ovnopskrift-i-airfryer', 'Ovnopskrift i airfryer: sådan omregner du tid og temperatur'],
    en: ['oven-to-air-fryer', 'How to convert an oven recipe to an air fryer'],
  },
  doble: {
    nb: ['doble-oppskrift', 'Doble en oppskrift: dette må du passe på'],
    sv: ['dubbla-recept', 'Dubbla ett recept: det här ska du se upp med'],
    da: ['fordoble-opskrift', 'Fordoble en opskrift: det her skal du passe på'],
    en: ['double-a-recipe', 'How to double or halve a recipe'],
  },
  eggtest: {
    nb: ['er-egget-ferskt', 'Er egget ferskt? Slik tester du med et glass vann'],
    sv: ['ar-agget-farskt', 'Är ägget färskt? Så testar du med ett glas vatten'],
    da: ['er-aegget-friskt', 'Er ægget friskt? Sådan tester du med et glas vand'],
    en: ['egg-float-test', 'How to tell if eggs are fresh: the float test'],
  },
};

// Sluttsiden i karusellen peker på én funksjon; CTA-bildet viser den.
const CTA_BILDE = { koketid: '05-kokemodus', kjernetemp: '05-kokemodus', airfryer: '05-kokemodus', rester: '02-ukemeny', fryser: '02-ukemeny', eggtest: '02-ukemeny', egg: '01-import', doble: '01-import' };

const TEKST = {
  nb: { blogg: 'Blogg', hjem: 'Forside', galleri: 'Hele karusellen', flere: 'Flere kjøkkentips', indeksTittel: 'Kjøkkentips fra Matlyst', indeksIngress: 'Korte svar på det du lurer på ved komfyren: koketider, kjernetemperatur, rester, fryser og airfryer. Hver artikkel er en av karusellene våre, samlet på ett sted.', indeksBeskrivelse: 'Kjøkkentips fra Matlyst: koketider, kjernetemperatur, rester, fryser, airfryer og eggtest, med tabeller du kan slå opp i.' },
  sv: { blogg: 'Blogg', hjem: 'Hem', galleri: 'Hela karusellen', flere: 'Fler kökstips', indeksTittel: 'Kökstips från Matlyst', indeksIngress: 'Korta svar på det du undrar över vid spisen: innertemperatur, rester, frysen och airfryern. Varje artikel är en av våra karuseller, samlad på ett ställe.', indeksBeskrivelse: 'Kökstips från Matlyst: innertemperatur, rester, frysen, airfryer och äggtest, med tabeller att slå upp i.' },
  da: { blogg: 'Blog', hjem: 'Forside', galleri: 'Hele karrusellen', flere: 'Flere køkkentips', indeksTittel: 'Køkkentips fra Matlyst', indeksIngress: 'Korte svar på det, du undrer dig over ved komfuret: kernetemperatur, rester, fryseren og airfryeren. Hver artikel er en af vores karruseller, samlet ét sted.', indeksBeskrivelse: 'Køkkentips fra Matlyst: kernetemperatur, rester, fryseren, airfryer og ægtest, med tabeller, du kan slå op i.' },
  en: { blogg: 'Blog', hjem: 'Home', galleri: 'The full carousel', flere: 'More kitchen tips', indeksTittel: 'Kitchen tips from Matlyst', indeksIngress: 'Quick answers to the questions you have at the stove: boiling times, safe temperatures, leftovers, the freezer, and the air fryer. Each article is one of our carousels, all in one place.', indeksBeskrivelse: 'Kitchen tips from Matlyst: boiling times, safe internal temperatures, leftovers, freezer times, air fryer conversions, and the egg float test.' },
};

const ren = (html) => String(html ?? '').replace(/<[^>]+>/gu, '').replace(/\s+/gu, ' ').trim();
const celle = (html) => String(html).replace(/<small>(.*?)<\/small>/gu, ' <span class="merknad">($1)</span>');

let kilde = null;
function lastKilde() {
  if (kilde) return kilde;
  const fil = new URL('../blogg-kilde/karuseller.json', import.meta.url);
  kilde = existsSync(fil) ? JSON.parse(readFileSync(fil, 'utf8')) : {};
  return kilde;
}

// Meta-beskrivelsen: ingressen kuttet ved hel setning, rundt 155 tegn.
function beskrivelse(ingress) {
  const setninger = ingress.match(/[^.!?]+[.!?]+/gu) ?? [ingress];
  let ut = '';
  for (const s of setninger) {
    if (ut && (ut + s).length > 160) break;
    ut += s;
  }
  return ut.trim();
}

export function bloggArtikler(lang) {
  const data = lastKilde()[lang] ?? {};
  return Object.entries(BLOGGTEMAER)
    .filter(([tema, sprak]) => sprak[lang] && data[tema])
    .map(([tema, sprak]) => {
      const [slug, title] = sprak[lang];
      const k = data[tema];
      return { tema, lang, path: `${BLOGGROT[lang]}${slug}/`, title, description: beskrivelse(k.ingress), karusell: k };
    });
}

// Språkgruppene til hreflang og språkvelgeren (locale-sider.mjs sprer dem inn i SIDEGRUPPER).
export function bloggGrupper() {
  const grupper = [{ id: 'blogg', sider: { ...BLOGGROT } }];
  for (const [tema, sprak] of Object.entries(BLOGGTEMAER)) {
    grupper.push({ id: `blogg-${tema}`, sider: Object.fromEntries(Object.entries(sprak).map(([lang, [slug]]) => [lang, `${BLOGGROT[lang]}${slug}/`])) });
  }
  return grupper;
}

function bilde(lang, tema, fil) {
  return `/images/blogg/${lang}/${tema}/${fil}`;
}

export function artikkelSchema(a) {
  const t = TEKST[a.lang];
  return [{
    '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: t.hjem, item: `${base}${a.lang === 'nb' ? '/' : `/${a.lang}/`}` },
      { '@type': 'ListItem', position: 2, name: t.blogg, item: `${base}${BLOGGROT[a.lang]}` },
      { '@type': 'ListItem', position: 3, name: a.title, item: `${base}${a.path}` },
    ],
  }, {
    '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.description,
    image: [`${base}${bilde(a.lang, a.tema, a.karusell.bilder[0])}`], inLanguage: SPRAKKODE[a.lang],
    datePublished: PUBLISERT, dateModified: PUBLISERT, mainEntityOfPage: `${base}${a.path}`,
    author: { '@type': 'Organization', name: 'Matlyst', url: base }, publisher: { '@type': 'Organization', name: 'Matlyst', url: base },
  }];
}

export function artikkelMain(a, knapper) {
  const t = TEKST[a.lang];
  const { sider, bilder, etikett, ingress } = a.karusell;
  const forside = sider[0];
  const logo = sider.at(-1);
  const tabeller = sider.filter((s) => s.type === 'tabell').map((s) => `<h2>${ren(s.tittel)}</h2><table class="blogg-tabell"><tbody>${s.rader.map(([a1, b1]) => `<tr><th scope="row">${celle(a1)}</th><td>${celle(b1)}</td></tr>`).join('')}</tbody></table>${s.notis ? `<p>${s.notis}</p>` : ''}`).join('\n');
  const galleri = bilder.slice(1).map((fil, i) => `<img src="${bilde(a.lang, a.tema, fil)}" width="800" height="1000" loading="lazy" decoding="async" alt="${ren(sider[i + 1].tittel)}">`).join('');
  const cta = appCta(a.lang, {
    bilde: CTA_BILDE[a.tema], bildeAlt: ren(logo.under),
    appCtaTittel: ren(logo.tittel).replace(/^(?:Eller|Or|Annars)\s+/iu, '').replace(/^./u, (c) => c.toUpperCase()),
    appCtaTekst: ren(logo.under),
  }, knapper);
  const flere = bloggArtikler(a.lang).filter((b) => b.tema !== a.tema)
    .map((b) => `<li><a href="${b.path}">${b.title}</a></li>`).join('');
  return `<main id="hovedinnhold"><article class="blogg-artikkel"><header class="locale-page-hero"><p class="eyebrow"><a href="${BLOGGROT[a.lang]}">${t.blogg}</a> · ${etikett}</p><h1 class="disp">${a.title}</h1><p class="lead">${ingress}</p></header>
<figure class="blogg-forside"><img src="${bilde(a.lang, a.tema, bilder[0])}" width="800" height="1000" decoding="async" alt="${ren(forside.tittel)} ${ren(forside.under)}"></figure>
<section class="prose locale-prose">${tabeller}</section>
<section class="blogg-galleri" aria-label="${t.galleri}"><h2>${t.galleri}</h2><div class="blogg-galleri-rad">${galleri}</div></section>
${cta}
<div class="blogg-flere" role="navigation" aria-label="${t.flere}"><h2>${t.flere}</h2><ul>${flere}</ul></div></article></main>`;
}

export function indeksMain(lang) {
  const t = TEKST[lang];
  const kort = bloggArtikler(lang).map((a) => `<li><a href="${a.path}"><img src="${bilde(lang, a.tema, a.karusell.bilder[0])}" width="800" height="1000" loading="lazy" decoding="async" alt=""><span>${a.title}</span></a></li>`).join('');
  return `<main id="hovedinnhold"><header class="locale-page-hero"><p class="eyebrow">${t.blogg}</p><h1 class="disp">${t.indeksTittel}</h1><p class="lead">${t.indeksIngress}</p></header>
<ul class="blogg-kort">${kort}</ul></main>`;
}

export function indeksMeta(lang) {
  const t = TEKST[lang];
  return { path: BLOGGROT[lang], title: t.indeksTittel, description: t.indeksBeskrivelse,
    schema: [{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: t.indeksTittel, url: `${base}${BLOGGROT[lang]}`, inLanguage: SPRAKKODE[lang] }] };
}

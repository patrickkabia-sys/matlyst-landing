// Enheter og omregning for enhetsomregnerne (/en/tools/<fra>-to-<til>/ osv.).
// Alle faktorer er definisjoner, ikke målinger: US-enheter fra den amerikanske definisjonen
// (1 US gallon = 3,785411784 liter, 1 pound = 0,45359237 kg, 1 inch = 2,54 cm).
// Volum regnes via milliliter, vekt via gram, lengde via millimeter. Temperatur har egne formler.
import { esc, kalkSkjelett, presisTekst } from './kalk-kort.mjs';

export const GRUPPER = {
  volum: { base: 'ml', navn: { en: 'volume' } },
  vekt: { base: 'g', navn: { en: 'weight' } },
  lengde: { base: 'mm', navn: { en: 'length' } },
  temperatur: { base: 'c', navn: { en: 'temperature' } },
};

// id: slug i URL-en. f: faktor til gruppens basisenhet. navn: entall, flertall, kort skrivemåte.
export const ENHETER = {
  ml: { gruppe: 'volum', f: 1, en: { en: 'milliliter', fl: 'milliliters', kort: 'ml' }, nb: { en: 'milliliter', fl: 'milliliter', kort: 'ml' }, sv: { en: 'milliliter', fl: 'milliliter', kort: 'ml' }, da: { en: 'milliliter', fl: 'milliliter', kort: 'ml' } },
  cl: { gruppe: 'volum', f: 10, en: { en: 'centiliter', fl: 'centiliters', kort: 'cl' }, nb: { en: 'centiliter', fl: 'centiliter', kort: 'cl' }, sv: { en: 'centiliter', fl: 'centiliter', kort: 'cl' }, da: { en: 'centiliter', fl: 'centiliter', kort: 'cl' } },
  dl: { gruppe: 'volum', f: 100, en: { en: 'deciliter', fl: 'deciliters', kort: 'dl' }, nb: { en: 'desiliter', fl: 'desiliter', kort: 'dl' }, sv: { en: 'deciliter', fl: 'deciliter', kort: 'dl' }, da: { en: 'deciliter', fl: 'deciliter', kort: 'dl' } },
  l: { gruppe: 'volum', f: 1000, en: { en: 'liter', fl: 'liters', kort: 'l' }, nb: { en: 'liter', fl: 'liter', kort: 'l' }, sv: { en: 'liter', fl: 'liter', kort: 'l' }, da: { en: 'liter', fl: 'liter', kort: 'l' } },
  tsp: { gruppe: 'volum', f: 4.92892159375, en: { en: 'US teaspoon', fl: 'US teaspoons', kort: 'tsp' }, nb: { en: 'amerikansk teskje', fl: 'amerikanske teskjeer', kort: 'tsp' }, sv: { en: 'amerikansk tesked', fl: 'amerikanska teskedar', kort: 'tsp' }, da: { en: 'amerikansk teskefuld', fl: 'amerikanske teskefulde', kort: 'tsp' } },
  tbsp: { gruppe: 'volum', f: 14.78676478125, en: { en: 'US tablespoon', fl: 'US tablespoons', kort: 'tbsp' }, nb: { en: 'amerikansk spiseskje', fl: 'amerikanske spiseskjeer', kort: 'tbsp' }, sv: { en: 'amerikansk matsked', fl: 'amerikanska matskedar', kort: 'tbsp' }, da: { en: 'amerikansk spiseskefuld', fl: 'amerikanske spiseskefulde', kort: 'tbsp' } },
  oz: { gruppe: 'volum', f: 29.5735295625, en: { en: 'US fluid ounce', fl: 'US fluid ounces', kort: 'fl oz' }, nb: { en: 'amerikansk væskeunse', fl: 'amerikanske væskeunser', kort: 'fl oz' }, sv: { en: 'amerikanskt flytande uns', fl: 'amerikanska flytande uns', kort: 'fl oz' }, da: { en: 'amerikansk flydende ounce', fl: 'amerikanske flydende ounces', kort: 'fl oz' } },
  cups: { gruppe: 'volum', f: 236.5882365, en: { en: 'US cup', fl: 'US cups', kort: 'cup' }, nb: { en: 'cup', fl: 'cups', kort: 'cups' }, sv: { en: 'cup', fl: 'cups', kort: 'cup' }, da: { en: 'cup', fl: 'cups', kort: 'cup' } },
  pints: { gruppe: 'volum', f: 473.176473, en: { en: 'US pint', fl: 'US pints', kort: 'pt' }, nb: { en: 'amerikansk pint', fl: 'amerikanske pints', kort: 'pint' }, sv: { en: 'amerikansk pint', fl: 'amerikanska pints', kort: 'pint' }, da: { en: 'amerikansk pint', fl: 'amerikanske pints', kort: 'pint' } },
  quarts: { gruppe: 'volum', f: 946.352946, en: { en: 'US quart', fl: 'US quarts', kort: 'qt' }, nb: { en: 'amerikansk quart', fl: 'amerikanske quarts', kort: 'quart' }, sv: { en: 'amerikansk quart', fl: 'amerikanska quarts', kort: 'quart' }, da: { en: 'amerikansk quart', fl: 'amerikanske quarts', kort: 'quart' } },
  gallons: { gruppe: 'volum', f: 3785.411784, en: { en: 'US gallon', fl: 'US gallons', kort: 'gal' }, nb: { en: 'amerikansk gallon', fl: 'amerikanske gallon', kort: 'gallon' }, sv: { en: 'amerikansk gallon', fl: 'amerikanska gallon', kort: 'gallon' }, da: { en: 'amerikansk gallon', fl: 'amerikanske gallon', kort: 'gallon' } },
  krm: { gruppe: 'volum', f: 1, spr: ['nb', 'sv'], nb: { en: 'kryddermål', fl: 'kryddermål', kort: 'krm' }, sv: { en: 'kryddmått', fl: 'kryddmått', kort: 'krm' } },
  ts: { gruppe: 'volum', f: 5, spr: ['nb'], nb: { en: 'teskje', fl: 'teskjeer', kort: 'ts' } },
  ss: { gruppe: 'volum', f: 15, spr: ['nb'], nb: { en: 'spiseskje', fl: 'spiseskjeer', kort: 'ss' } },
  tsk: { gruppe: 'volum', f: 5, spr: ['sv', 'da'], sv: { en: 'tesked', fl: 'teskedar', kort: 'tsk' }, da: { en: 'teskefuld', fl: 'teskefulde', kort: 'tsk' } },
  msk: { gruppe: 'volum', f: 15, spr: ['sv'], sv: { en: 'matsked', fl: 'matskedar', kort: 'msk' } },
  spsk: { gruppe: 'volum', f: 15, spr: ['da'], da: { en: 'spiseskefuld', fl: 'spiseskefulde', kort: 'spsk' } },
  g: { gruppe: 'vekt', f: 1, en: { en: 'gram', fl: 'grams', kort: 'g' }, nb: { en: 'gram', fl: 'gram', kort: 'g' }, sv: { en: 'gram', fl: 'gram', kort: 'g' }, da: { en: 'gram', fl: 'gram', kort: 'g' } },
  kg: { gruppe: 'vekt', f: 1000, en: { en: 'kilogram', fl: 'kilograms', kort: 'kg' }, nb: { en: 'kilogram', fl: 'kilogram', kort: 'kg' }, sv: { en: 'kilogram', fl: 'kilogram', kort: 'kg' }, da: { en: 'kilogram', fl: 'kilogram', kort: 'kg' } },
  'oz-vekt': { gruppe: 'vekt', f: 28.349523125, en: { en: 'ounce', fl: 'ounces', kort: 'oz' }, nb: { en: 'unse', fl: 'unser', kort: 'oz' }, sv: { en: 'uns', fl: 'uns', kort: 'oz' }, da: { en: 'ounce', fl: 'ounces', kort: 'oz' } },
  lb: { gruppe: 'vekt', f: 453.59237, en: { en: 'pound', fl: 'pounds', kort: 'lb' }, nb: { en: 'pund', fl: 'pund', kort: 'lb' }, sv: { en: 'pund', fl: 'pund', kort: 'lb' }, da: { en: 'pund', fl: 'pund', kort: 'lb' } },
  mm: { gruppe: 'lengde', f: 1, en: { en: 'millimeter', fl: 'millimeters', kort: 'mm' }, nb: { en: 'millimeter', fl: 'millimeter', kort: 'mm' }, sv: { en: 'millimeter', fl: 'millimeter', kort: 'mm' }, da: { en: 'millimeter', fl: 'millimeter', kort: 'mm' } },
  cm: { gruppe: 'lengde', f: 10, en: { en: 'centimeter', fl: 'centimeters', kort: 'cm' }, nb: { en: 'centimeter', fl: 'centimeter', kort: 'cm' }, sv: { en: 'centimeter', fl: 'centimeter', kort: 'cm' }, da: { en: 'centimeter', fl: 'centimeter', kort: 'cm' } },
  inches: { gruppe: 'lengde', f: 25.4, en: { en: 'inch', fl: 'inches', kort: 'in' }, nb: { en: 'tomme', fl: 'tommer', kort: 'tommer' }, sv: { en: 'tum', fl: 'tum', kort: 'tum' }, da: { en: 'tomme', fl: 'tommer', kort: 'tommer' } },
  c: { gruppe: 'temperatur', en: { en: 'degree Celsius', fl: 'degrees Celsius', kort: '°C' }, nb: { en: 'grad celsius', fl: 'grader celsius', kort: '°C' }, sv: { en: 'grad Celsius', fl: 'grader Celsius', kort: '°C' }, da: { en: 'grad celsius', fl: 'grader celsius', kort: '°C' } },
  f: { gruppe: 'temperatur', en: { en: 'degree Fahrenheit', fl: 'degrees Fahrenheit', kort: '°F' }, nb: { en: 'grad fahrenheit', fl: 'grader fahrenheit', kort: '°F' }, sv: { en: 'grad Fahrenheit', fl: 'grader Fahrenheit', kort: '°F' }, da: { en: 'grad fahrenheit', fl: 'grader fahrenheit', kort: '°F' } },
};

export function konverter(verdi, fra, til) {
  const a = ENHETER[fra]; const b = ENHETER[til];
  if (!a || !b || a.gruppe !== b.gruppe) throw new Error(`Kan ikke regne ${fra} til ${til}`);
  if (a.gruppe === 'temperatur') {
    if (fra === til) return verdi;
    return fra === 'c' ? verdi * 9 / 5 + 32 : (verdi - 32) * 5 / 9;
  }
  return verdi * a.f / b.f;
}

/** Tall til visning: fire gjeldende sifre, 1000 og over som heltall, uten unødvendige nuller og uten tak på desimaler (punktum; generatorene setter komma selv). Samme regel som kalkulatorkortet (presisTekst). */
export function tall(n) {
  if (!Number.isFinite(n)) return '';
  return presisTekst(n, 4);
}

/** Enheter som finnes på et språk (nordiske husholdningsmål finnes bare der de brukes). */
export const enheterFor = (lang = 'en') => Object.keys(ENHETER).filter((id) => (ENHETER[id].spr ?? ['en', 'nb', 'sv', 'da']).includes(lang) && ENHETER[id][lang]);

/** Alle par innenfor samme gruppe (ikke samme enhet), i fast rekkefølge. */
export function allePar(lang = 'en') {
  const ids = enheterFor(lang);
  return ids.flatMap((fra) => ids.filter((til) => til !== fra && ENHETER[til].gruppe === ENHETER[fra].gruppe).map((til) => [fra, til]));
}

const SLUGDEL = {
  en: { 'oz-vekt': 'oz' },
  nb: { cups: 'kopp', oz: 'fl-oz', pints: 'pint', quarts: 'quart', gallons: 'gallon', 'oz-vekt': 'unse', inches: 'tommer', f: 'fahrenheit', c: 'celsius' },
  sv: { cups: 'kopp', oz: 'fl-oz', pints: 'pint', quarts: 'quart', gallons: 'gallon', 'oz-vekt': 'uns', inches: 'tum', f: 'fahrenheit', c: 'celsius' },
  da: { cups: 'kop', oz: 'fl-oz', pints: 'pint', quarts: 'quart', gallons: 'gallon', 'oz-vekt': 'ounce', inches: 'tommer', f: 'fahrenheit', c: 'celsius' },
};
const TIL = { en: 'to', nb: 'til', sv: 'till', da: 'til' };
const slugDel = (id, lang) => SLUGDEL[lang]?.[id] ?? id;
export const parSlug = (fra, til, lang = 'en') => `${slugDel(fra, lang)}-${TIL[lang]}-${slugDel(til, lang)}`;
export const VERKTOY = { en: 'tools', nb: 'verktoy', sv: 'verktyg', da: 'vaerktoejer' };
export const parSti = (fra, til, lang = 'en') => `${VERKTOY[lang]}/${parSlug(fra, til, lang)}/`;

/** Ordformen for enheter som skrives som ord (ikke symbol): [entall, flertall]. Entall gjelder bare for nøyaktig 1.
 *  Symboler (ml, dl, fl oz, pt, qt, °C ...) og ord uten egen flertallsform står ikke her og skrives som `kort`. */
export const FLERTALL = {
  nb: { cups: ['cup', 'cups'], pints: ['pint', 'pints'], quarts: ['quart', 'quarts'], inches: ['tomme', 'tommer'] },
  sv: { cups: ['cup', 'cups'], pints: ['pint', 'pints'], quarts: ['quart', 'quarts'] },
  da: { cups: ['cup', 'cups'], pints: ['pint', 'pints'], quarts: ['quart', 'quarts'], inches: ['tomme', 'tommer'] },
  en: { cups: ['cup', 'cups'] },
};

// Kalkulatorkortet for enhetsomregnerne (data-kalk="enhet"). Siden skriver alt synlig tekst fra disse dataene; site.js har ingen språkstrenger.

/** Hurtigmengdene (seks per enhet, stigende). Tallene skrives med språkets desimaltegn i kortet. */
export const HURTIG = {
  ml: [50, 100, 150, 250, 500, 1000], cl: [1, 2, 4, 10, 33, 75], dl: [0.5, 1, 2, 3, 5, 10], l: [0.5, 1, 1.5, 2, 3, 5], krm: [1, 2, 3, 4, 5, 10],
  ts: [0.5, 1, 2, 3, 4, 5], tsk: [0.5, 1, 2, 3, 4, 5], ss: [0.5, 1, 2, 3, 4, 6], msk: [0.5, 1, 2, 3, 4, 6], spsk: [0.5, 1, 2, 3, 4, 6],
  tsp: [0.25, 0.5, 1, 2, 3, 4], tbsp: [0.5, 1, 2, 3, 4, 8], oz: [1, 2, 4, 8, 12, 16], cups: [0.25, 0.5, 1, 2, 3, 4], pints: [0.5, 1, 2, 3, 4, 8],
  quarts: [0.5, 1, 2, 3, 4, 6], gallons: [0.25, 0.5, 1, 2, 3, 5],
  g: [50, 100, 150, 250, 500, 1000], kg: [0.25, 0.5, 1, 1.5, 2, 5], 'oz-vekt': [1, 2, 4, 8, 12, 16], lb: [0.25, 0.5, 1, 2, 3, 5],
  mm: [1, 2, 5, 10, 20, 30], cm: [5, 10, 18, 20, 24, 30], inches: [1, 6, 8, 9, 10, 12],
  c: [100, 150, 180, 200, 220, 250], f: [300, 325, 350, 375, 400, 450],
};
/** Brøker som hurtigmengder på engelsk (amerikanske oppskrifter), for cups, tbsp og tsp. */
export const HURTIG_BROK = {
  cups: ['1/4', '1/3', '1/2', '1', '2', '4'], tbsp: ['1/2', '1', '2', '3', '4', '8'], tsp: ['1/4', '1/2', '1', '2', '3', '4'],
};
/** Startmengden i kortet. Alle andre enheter starter på 1. */
export const START = { c: 180, f: 350 };

/** Etikettene i kortet per språk. `aria` får enhetsnavnene (ENHETER[id][lang]). */
export const KORT_ETIKETTER = {
  nb: { aria: (F, T) => `Kalkulator: ${F.fl} til ${T.fl}`, mengde: 'Mengde', fra: 'Fra', til: 'Til', bytt: 'Bytt enheter', vanlige: 'Vanlige mengder', feil: 'Skriv inn en mengde, for eksempel 2 eller 2,5.' },
  sv: { aria: (F, T) => `Omvandlare: ${F.fl} till ${T.fl}`, mengde: 'Mängd', fra: 'Från', til: 'Till', bytt: 'Byt enheter', vanlige: 'Vanliga mängder', feil: 'Skriv en mängd, till exempel 2 eller 2,5.' },
  da: { aria: (F, T) => `Regnemaskine: ${F.fl} til ${T.fl}`, mengde: 'Mængde', fra: 'Fra', til: 'Til', bytt: 'Skift enheder', vanlige: 'Almindelige mængder', feil: 'Skriv en mængde, for eksempel 2 eller 2,5.' },
  en: { aria: (F, T) => `Calculator: ${F.fl} to ${T.fl}`, mengde: 'Amount', fra: 'From', til: 'To', bytt: 'Swap units', vanlige: 'Common amounts', feil: 'Enter an amount, for example 2 or 1/2.' },
};

const storBokstav = (t) => t.charAt(0).toUpperCase() + t.slice(1);
/** Valgteksten: «Flertallsnavn (kort)». Er kortformen lik flertallsnavnet eller entallet («Cups»), står navnet alene, ikke «Cups (cups)» eller «Cups (cup)». */
const valgtekst = (lang, id) => {
  const { en, fl, kort } = ENHETER[id][lang];
  return [fl, en].some((t) => t.toLocaleLowerCase() === kort.toLocaleLowerCase()) ? storBokstav(fl) : `${storBokstav(fl)} (${kort})`;
};
// Samme regel som site.js: entall for nøyaktig 1, og for en ekte brøk under 1 skrevet som brøk («1/2»).
const erEntall = (v) => {
  const m = /^(\d+)\/(\d+)$/u.exec(v);
  return m ? Number(m[1]) < Number(m[2]) : Number(String(v).replace(',', '.')) === 1;
};

const ordI = (lang, id, entall) => {
  const form = FLERTALL[lang]?.[id];
  return form ? form[entall ? 0 : 1] : ENHETER[id][lang].kort;
};

/** Ordet for enheten ved en mengde, bøyd etter samme regel som kortet: entall når mengden vises som «1» (fire gjeldende sifre), ellers flertall. Enheter uten ordform står som kortformen. */
export const ordVed = (lang, id, v) => ordI(lang, id, tall(v) === '1');

/**
 * Tittel og H1 for en enhetsomregner. `verb(a, b)` er språkets «Regn om a til b». Mønsteret er det samme for alle sidene, også de med like ledd (cups):
 * tittel «<verb kort>: <navn> til <navn>» (kortformen alene når den er over 60 tegn eller når delen etter kolon bare gjentar leddet foran),
 * H1 «<Navn> til <navn> (<kort> til <kort>)» (uten parentes når parentesen ville vært lik teksten foran).
 */
export function tittelOgH1(lang, fra, til, verb) {
  const F = ENHETER[fra][lang]; const T = ENHETER[til][lang];
  const ledd = { nb: 'til', sv: 'till', da: 'til', en: 'to' }[lang];
  const parKort = `${F.kort} ${ledd} ${T.kort}`;
  const parNavn = `${F.fl} ${ledd} ${T.fl}`;
  const lik = parNavn.toLocaleLowerCase() === parKort.toLocaleLowerCase();
  const lang0 = `${verb(F.kort, T.kort)}: ${parNavn}`;
  const base = `${storBokstav(F.fl)} ${ledd} ${T.fl}`;
  return { title: lik || lang0.length > 60 ? verb(F.kort, T.kort) : lang0, h1: lik ? base : `${base} (${parKort})` };
}

/** Setningen kortet viser uten JavaScript: startmengden regnet om («1 cup = 2,366 dl», «180 °C = 356 °F»). Det korte svaret under kortet åpner med den samme setningen, så de to viser samme regnestykke. */
export function kortSetning(lang, fra, til) {
  const komma = lang !== 'en';
  const start = START[fra] ?? 1;
  const svar = presisTekst(konverter(start, fra, til), 4, { komma });
  return `${presisTekst(start, 4, { komma })} ${ordI(lang, fra, start === 1)} = ${svar} ${ordI(lang, til, svar === '1')}`;
}

/**
 * Ferdig kalkulatorkort (form.kalk, data-kalk="enhet") for en enhetsomregner: enhetene i gruppen til `fra` (eller `ids`, for samlesidene),
 * uten varerad. Mengden står ved bytte, svaret har fire gjeldende sifre, og temperatur er affin og kan være negativ. Engelsk tar brøker.
 * Det statiske eksempelet (uten JavaScript) er det kortet selv regner ut ved lasting.
 */
export function enhetsKort(lang, fra, til, { ids } = {}) {
  const gruppe = ENHETER[fra].gruppe;
  const valg = ids ?? enheterFor(lang).filter((id) => ENHETER[id].gruppe === gruppe);
  const komma = lang !== 'en';
  const brok = lang === 'en';
  const E = KORT_ETIKETTER[lang];
  const ml = {}, g = {}, kort = {}, steg = {};
  for (const id of valg) {
    if (ENHETER[id].gruppe === 'vekt') g[id] = ENHETER[id].f;
    else if (ENHETER[id].gruppe !== 'temperatur') ml[id] = ENHETER[id].f;
    kort[id] = FLERTALL[lang]?.[id] ?? ENHETER[id][lang].kort;
    steg[id] = brok && HURTIG_BROK[id] ? HURTIG_BROK[id] : HURTIG[id].map((n) => presisTekst(n, 4, { komma }));
  }
  const temperatur = gruppe === 'temperatur';
  const data = {
    ml, g, kort, stegFor: Object.fromEntries(valg.map((id) => [id, id])), steg, sifre: 4, beholdMengde: true,
    ...(temperatur ? { affin: { c: [1, 0], f: [5 / 9, -160 / 9] }, negativ: true } : {}),
    ...(brok ? { brok: true } : {}),
    feil: E.feil,
  };
  const start = START[fra] ?? 1;
  const svar = presisTekst(konverter(start, fra, til), 4, { komma });
  const mengde = presisTekst(start, 4, { komma });
  return kalkSkjelett({
    etiketter: { aria: E.aria(ENHETER[fra][lang], ENHETER[til][lang]), mengde: E.mengde, fra: E.fra, til: E.til, bytt: E.bytt, vanlige: E.vanlige },
    enheter: valg.map((id) => [id, esc(valgtekst(lang, id))]),
    fra, til, data, vareHtml: '', type: 'enhet',
    start: {
      mengde, svar,
      setning: esc(kortSetning(lang, fra, til)),
      hurtig: steg[fra].map((v) => [v, esc(`${v} ${ordI(lang, fra, erEntall(v))}`)]),
    },
  });
}

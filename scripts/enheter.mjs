// Enheter og omregning for enhetsomregnerne (/en/tools/<fra>-to-<til>/ osv.).
// Alle faktorer er definisjoner, ikke målinger: US-enheter fra den amerikanske definisjonen
// (1 US gallon = 3,785411784 liter, 1 pound = 0,45359237 kg, 1 inch = 2,54 cm).
// Volum regnes via milliliter, vekt via gram, lengde via millimeter. Temperatur har egne formler.
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
  cups: { gruppe: 'volum', f: 236.5882365, en: { en: 'US cup', fl: 'US cups', kort: 'cup' }, nb: { en: 'amerikansk kopp', fl: 'amerikanske kopper', kort: 'kopp' }, sv: { en: 'amerikansk kopp', fl: 'amerikanska koppar', kort: 'kopp' }, da: { en: 'amerikansk kop', fl: 'amerikanske kopper', kort: 'kop' } },
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

/** Tall til visning: opptil 4 gjeldende sifre, uten unødvendige nuller. */
export function tall(n) {
  if (!Number.isFinite(n)) return '';
  const abs = Math.abs(n);
  const d = abs >= 1000 ? 0 : abs >= 100 ? 1 : abs >= 10 ? 2 : abs >= 1 ? 3 : abs >= 0.1 ? 4 : 5;
  return String(Number(n.toFixed(d)));
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

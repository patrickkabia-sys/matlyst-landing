// Rules for «how much per person» (en-US): ONE source for the numbers in the tables, in the calculator's starting answer, and in the calculator card.
// site.js (the block between «portion:start» and «portion:slutt») has a copy of these rules as plain JavaScript without modules;
// test/mengde-per-person-en.test.mjs runs that copy against the functions here and catches drift.
// US measures first, metric in parentheses (converted from the source's US figure, rounded). The source's own numbers are never converted before they are shown:
// pounds stay pounds, cups stay cups. Weights: 1 lb = 0.4536 kg, 1 oz = 28.35 g. Volume: 1 cup = 240 mL (the US nutrition-label cup).

export const PERSONS = Object.freeze([2, 4, 6, 8, 10, 12]);
export const START = Object.freeze({ adults: 4, kids: 0 });
const CUP_ML = 240;
const COUNT = { sandwich: 'sandwiches' };

const round = (n, d) => Math.round(Number((n * 10 ** d).toPrecision(12))) / 10 ** d;
const plain = (n, d) => {
  const t = round(n, d).toFixed(d);
  return t.includes('.') ? t.replace(/0+$/u, '').replace(/\.$/u, '') : t;
};
const FRAC = { 0.125: '1/8', 0.25: '1/4', 0.375: '3/8', 0.5: '1/2', 0.625: '5/8', 0.75: '3/4', 0.875: '7/8' };
/** Cups the way a US recipe writes them: whole numbers and eighths, for example 3 3/4. */
const cups = (n) => {
  const q = Math.round(n * 8) / 8;
  const whole = Math.floor(q);
  const f = FRAC[q - whole];
  if (!f) return String(whole);
  return whole ? `${whole} ${f}` : f;
};
/** Pounds the way a US recipe writes them: halves, thirds, quarters, and eighths as fractions (1 1/3, 3/4), otherwise a decimal. */
export const frak = (n) => {
  const whole = Math.floor(n + 1e-9);
  const rest = n - whole;
  if (rest < 0.005) return String(whole);
  for (const d of [2, 3, 4, 8]) {
    const k = Math.round(rest * d);
    if (k > 0 && k < d && Math.abs(rest * d - k) < 0.03) return whole ? `${whole} ${k}/${d}` : `${k}/${d}`;
  }
  return plain(n, 2);
};
const metricWeight = (g) => (g >= 1000 ? `${plain(g / 1000, 1)} kg` : `${Math.round(g / 5) * 5} g`);
const metricVolume = (ml) => (ml >= 1000 ? `${plain(ml / 1000, 1)} L` : `${Math.round(ml / 10) * 10} mL`);

/** { tall, enhet, metrisk } for an amount in lb, oz, or cup. Ounces from 16 up are written as pounds. */
export function del(n, unit) {
  if (unit === 'lb') return { tall: frak(n), enhet: 'lb', metrisk: metricWeight(n * 453.6) };
  if (unit === 'oz') return { tall: plain(n, 1), enhet: 'oz', metrisk: metricWeight(n * 28.35) };
  if (unit === 'cup') {
    const t = cups(n);
    return { tall: t, enhet: n > 1 ? 'cups' : 'cup', metrisk: metricVolume(Math.round(n * 8) / 8 * CUP_ML) };
  }
  const flertall = COUNT[unit] ?? `${unit}s`;
  const t = plain(n, 1);
  return { tall: t, enhet: Number(t) > 1 ? flertall : unit, metrisk: null };
}

/** «5 lb (2.3 kg)», «1.25 to 1.5 lb (570 to 680 g)», «3 3/4 cups (900 mL)», «6 tacos». */
export function delTekst(min, maks, unit, til = 'to') {
  let u = unit;
  let a0 = min;
  let b0 = maks;
  // Ounces at 16 or more become pounds, for both ends of a range, so «12 oz to 1.13 lb» never appears.
  if (u === 'oz' && round(maks, 1) >= 16) { u = 'lb'; a0 = min / 16; b0 = maks / 16; }
  const a = del(a0, u);
  if (b0 === a0) return a.metrisk ? `${a.tall} ${a.enhet} (${a.metrisk})` : `${a.tall} ${a.enhet}`;
  const b = del(b0, u);
  if (!a.metrisk) return `${a.tall} ${til} ${b.tall} ${b.enhet}`;
  return `${a.tall} ${til} ${b.tall} ${b.enhet} (${a.metrisk} ${til} ${b.metrisk})`;
}

/** The amount for adults and kids: each kid counts `kidShare` of an adult. */
export const totalt = (perPerson, adults, kids, kidShare) => perPerson * (adults + kidShare * kids);

/** All parts of a variant, as texts. `variant.deler`: [{ min, maks, enhet }]. */
export const variantDeler = (variant, adults, kids, kidShare, til = 'to') => variant.deler.map((d) => delTekst(totalt(d.min, adults, kids, kidShare), totalt(d.maks, adults, kids, kidShare), d.enhet, til));

export const wordAdults = (n, t) => (n === 1 ? t.adult : t.adults);

/** The sentence under the calculator: «Turkey: 4 adults and 2 kids need 5 lb (2.3 kg).» */
export function setning(variant, adults, kids, kidShare, t) {
  const who = `${adults} ${wordAdults(adults, t)}${kids > 0 ? ` ${t.and} ${kids} ${kids === 1 ? t.kid : t.kids}` : ''}`;
  return `${variant.navn}: ${who} ${adults + kids === 1 ? t.needs : t.need} ${variantDeler(variant, adults, kids, kidShare, t.to).join(` ${t.or} `)}.`;
}

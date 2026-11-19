// Egenskaper som avgjør hvor mye en knapp veier visuelt.
const VEKTEGENSKAPER = [
  'background',
  'background-color',
  'color',
  'border',
  'border-color',
  'border-width',
  'border-style',
  'padding',
  'font-weight',
  'font-size',
  'font-family',
  'opacity',
  'box-shadow',
  'text-decoration',
  'text-transform',
  'letter-spacing',
  'flex',
  'transform',
];

export function regler(kilde) {
  return [...kilde.matchAll(/([^{}]+)\{([^{}]*)\}/gu)].map(([, velger, kropp]) => ({
    velgere: velger.split(',').map((v) => v.trim()),
    erklaeringer: kropp,
  }));
}

// Samler opp hva som faktisk gjelder for en knapp: alle regler som treffer
// den, i filrekkefølge, slik kaskaden ville gjort det.
export function effektiv(css, klasse, tilstand) {
  const treff = {};
  for (const { velgere, erklaeringer } of regler(css)) {
    const gjelder = velgere.some((v) => {
      const suffiks = tilstand ? `:${tilstand}` : '';
      return v === `.ck-btn${suffiks}` || v === `.${klasse}${suffiks}`;
    });
    if (!gjelder) continue;
    for (const del of erklaeringer.split(';')) {
      const [egenskap, ...rest] = del.split(':');
      if (!rest.length) continue;
      const navn = egenskap.trim();
      if (!VEKTEGENSKAPER.includes(navn)) continue;
      treff[navn] = rest.join(':').trim();
    }
  }
  return treff;
}

// WCAG-kontrast regnet rett ut av hex-verdiene i stilarket, slik at en
// fargeendring som faller under AA blir rod med en gang.

const kanal = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

export function luminans(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((x) => x + x).join('') : h;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  return 0.2126 * kanal(r) + 0.7152 * kanal(g) + 0.0722 * kanal(b);
}

export function forhold(a, b) {
  const [x, y] = [luminans(a), luminans(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/** Slar opp var(--navn) i :root-variablene i stilarket. */
export function farge(verdi, css) {
  const variabler = Object.fromEntries(
    [...css.matchAll(/--([\w-]+):\s*(#[0-9A-Fa-f]{3,8})/gu)].map((m) => [m[1], m[2]]),
  );
  const navn = verdi.match(/var\(--([\w-]+)\)/u);
  return (navn ? variabler[navn[1]] : verdi).replace(/!important/u, '').trim();
}

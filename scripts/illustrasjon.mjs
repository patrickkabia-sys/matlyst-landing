// Egen illustrasjon til forsidene: flate matformer i merkefargene, tegnet som inline SVG.
// Dekorative (aria-hidden), ingen eksterne filer. Plasseres av stilarkene (forside.css, side.css).
const form = (klasse, innhold, vb) => `<svg class="mat ${klasse}" viewBox="${vb}" aria-hidden="true" focusable="false">${innhold}</svg>`;

export const tomat = form('mat-tomat', '<circle cx="60" cy="66" r="48" fill="#C4552A"/><path d="M60 22c-8 8-20 10-28 8 6 10 16 12 28 10 12 2 22 0 28-10-8 2-20 0-28-8z" fill="#7C9A74"/><path d="M60 22v-10" stroke="#5F7C58" stroke-width="6" stroke-linecap="round"/><ellipse cx="42" cy="58" rx="9" ry="14" fill="#E07A52" opacity=".55" transform="rotate(25 42 58)"/>', '0 0 120 120');
export const sitron = form('mat-sitron', '<path d="M12 60C12 34 34 14 60 14c10 0 20 3 28 8 6-5 14-8 20-8-1 8-4 15-8 20 4 8 6 16 6 26 0 26-22 46-48 46S12 86 12 60z" fill="#EBB93B"/><ellipse cx="44" cy="46" rx="10" ry="18" fill="#F6D775" opacity=".7" transform="rotate(20 44 46)"/>', '0 0 120 120');
export const chili = form('mat-chili', '<path d="M30 20c24-12 56-4 70 22 8 16 6 40-4 56-6-22-20-38-40-46-14-6-24-14-26-32z" fill="#B8410B"/><path d="M30 20c-2-8 2-14 10-16 6 6 4 12-2 18z" fill="#7C9A74"/><path d="M52 44c14 4 26 14 34 28" stroke="#E07A52" stroke-width="6" stroke-linecap="round" fill="none" opacity=".6"/>', '0 0 120 120');
export const blad = form('mat-blad', '<path d="M14 100C10 52 44 14 104 14c4 54-28 92-90 86z" fill="#7C9A74"/><path d="M22 92C44 66 66 44 98 22" stroke="#5F7C58" stroke-width="5" stroke-linecap="round" fill="none"/>', '0 0 120 120');
export const egg = form('mat-egg', '<path d="M60 10c24 0 42 34 42 62 0 22-18 38-42 38S18 94 18 72C18 44 36 10 60 10z" fill="#F7E4C4"/><circle cx="60" cy="74" r="20" fill="#EBB93B"/><circle cx="53" cy="67" r="6" fill="#F6D775" opacity=".8"/>', '0 0 120 120');

export const matformer = `${tomat}${sitron}${chili}${blad}${egg}`;

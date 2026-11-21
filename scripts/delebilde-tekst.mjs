// Delebilder per sidetype og språk: ÉN kilde for teksten, filnavnene og hvilke sidetyper som får hvilket bilde.
// Brukes av render-skriptet (scripts/delebilde-render.mjs), byggetrinnet (scripts/delebilde.mjs) og testen.
export const SPRAK = Object.freeze(['nb', 'sv', 'da', 'en']);
export const BASE = 'https://matlyst-app.no';
export const FELLES_BILDE = '/images/og.jpg';
export const BREDDE = 1200;
export const HOYDE = 630;

// Sidetype (fra sidetyper.mjs) til delebildetype. Forsider, juss og tjenester står utenfor.
export const BILDETYPE_FOR_SIDETYPE = Object.freeze({ omregner: 'verktoy', blogg: 'blogg', 'guide-lang': 'guide', 'guide-kort': 'guide' });
export const BILDETYPER = Object.freeze(['verktoy', 'blogg', 'guide']);

// linje = teksten på bildet. motiv = det store tegnet i høyre flate (tall og enheter, ikke setninger).
export const TEKST = Object.freeze({
  verktoy: {
    nb: { linje: 'Omregner for kjøkkenet', motiv: 'dl → g' },
    sv: { linje: 'Måttomvandlare för köket', motiv: 'dl → g' },
    da: { linje: 'Omregner til køkkenet', motiv: 'dl → g' },
    en: { linje: 'Kitchen unit converter', motiv: 'cups → g' },
  },
  blogg: {
    nb: { linje: 'Praktiske kjøkkentips' },
    sv: { linje: 'Praktiska köksknep' },
    da: { linje: 'Praktiske køkkentips' },
    en: { linje: 'Practical kitchen tips' },
  },
  guide: {
    nb: { linje: 'Slik bruker du Matlyst' },
    sv: { linje: 'Så använder du Matlyst' },
    da: { linje: 'Sådan bruger du Matlyst' },
    en: { linje: 'How to use Matlyst' },
  },
});

export const bildeSti = (type, sprak) => `/images/delebilde/${type}-${sprak}.png`;
export const bildeUrl = (type, sprak) => `${BASE}${bildeSti(type, sprak)}`;
// Alt-teksten beskriver bildet: logoen og linjen som står på det.
export const bildeAlt = (type, sprak) => `Matlyst: ${TEKST[type][sprak].linje}`;

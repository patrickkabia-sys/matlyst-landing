// CTA med skjermbilde fra App Store på sidens språk. Bildene er butikkens egne
// markedsbilder per land (us, se, dk, no), lastet ned til images/app/<språk>/ i 400 og 800 px.
// Blokken står midt på siden, mellom innholdet og FAQ, i tillegg til knappene nederst.
const UNDERTEKST = {
  nb: 'Gratis å laste ned for iPhone og Android.',
  sv: 'Gratis att ladda ner för iPhone och Android.',
  da: 'Hent appen gratis til iPhone og Android.',
  en: 'Free to download for iPhone and Android.',
};

// Bildene er 800 × 1738 (App Store 6,9 tommer, nedskalert).
export function appCta(lang, v, knapper) {
  const mappe = `/images/app/${lang}`;
  return `<section class="app-cta"><figure class="app-cta-bilde"><img src="${mappe}/${v.bilde}-400.webp" srcset="${mappe}/${v.bilde}-400.webp 400w, ${mappe}/${v.bilde}-800.webp 800w" sizes="(min-width: 760px) 280px, 70vw" width="400" height="869" loading="lazy" decoding="async" alt="${v.bildeAlt}"></figure><div class="app-cta-tekst"><h2 class="disp">${v.appCtaTittel}</h2><p>${UNDERTEKST[lang]}</p>${knapper}</div></section>`;
}

// Om-siden på sv, da og en. Samme fakta som den norske (scripts/nb-om/om.mjs), skrevet fra meningen i hvert språk.
// BARE disse faktaene om personen er godkjent: Patrick Kabia, kjøletekniker av yrke, har laget Matlyst. Matlyst drives av en privatperson i Norge.
// Ingen alder, bosted, familie, utdanning utover det som står på receptbok-/opskrifts-/recipe-book-siden, årstall, sitater, bilde eller historie. Låst av test/om-sprak.test.mjs.
import { byggRik } from '../rik-sider.mjs';
import { BASE, ORG_ID, PERSON_ID } from '../nb-om/om.mjs';

export const PUBLISERT = '2026-11-21';

const p = (...ps) => ps.map((x) => `<p>${x}</p>`).join('');
const ul = (...li) => `<ul>${li.map((x) => `<li>${x}</li>`).join('')}</ul>`;
const SOSIALE = [
  ['https://www.instagram.com/matlyst_app/', 'Instagram: @matlyst_app'],
  ['https://www.tiktok.com/@matlyst.appen', 'TikTok: @matlyst.appen'],
  ['https://www.youtube.com/@matlyst', 'YouTube: @matlyst'],
  ['https://www.pinterest.com/matlystapp/', 'Pinterest: @matlystapp'],
];
const sosiale = ul(...SOSIALE.map(([href, tekst]) => `<a href="${href}" rel="noopener">${tekst}</a>`));

/** T: alle tekstene for ett språk. Returnerer {side, STI}. */
export function lagOm(lang, T) {
  const sti = `/${T.mappe}/`;
  const rik = byggRik({
    lang,
    svarTekst: T.svar,
    seksjoner: [
      [T.h.hvem, p(T.hvem1, T.hvem2)],
      [T.h.hvorfor, p(T.hvorfor1, T.hvorfor2, T.hvorfor3)],
      [T.h.lagre, p(T.lagre1, T.lagre2)],
      [T.h.planlegg, p(T.planlegg)],
      [T.h.yrket, p(T.yrket1, T.yrket2)],
      [T.h.hvordan, p(T.hvordan1, T.hvordan2) + ul(...T.regler) + p(T.eksempel, T.ikkeTilknyttet)],
      [T.h.rettelser, p(T.rettelser)],
      [T.h.kontakt, p(T.kontakt) + sosiale],
    ],
  }).html;
  const skjema = [
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: T.forside, item: `${BASE}${T.forsideSti}` },
      { '@type': 'ListItem', position: 2, name: T.h1, item: `${BASE}${sti}` },
    ] },
    { '@context': 'https://schema.org', '@type': 'AboutPage', '@id': `${BASE}${sti}#side`, url: `${BASE}${sti}`, name: T.tittel, description: T.beskrivelse, inLanguage: lang,
      about: { '@id': ORG_ID }, mainEntity: { '@id': PERSON_ID } },
    { '@context': 'https://schema.org', '@type': 'Person', '@id': PERSON_ID, name: 'Patrick Kabia', jobTitle: T.yrkeTittel, url: `${BASE}/om/`, worksFor: { '@id': ORG_ID } },
  ];
  const side = {
    title: T.tittel,
    description: T.beskrivelse,
    eyebrow: T.eyebrow,
    h1: T.h1,
    lead: T.lead,
    publisert: PUBLISERT,
    schemas: [...skjema, 'faq'],
    forst: '',
    stegTittel: T.stegTittel,
    steg: T.steg,
    alternativ: '',
    grense: '',
    seksjoner: [],
    faqTittel: T.faqTittel,
    rik,
    faq: T.faq,
    cta: T.cta,
  };
  return { side, STI: sti };
}

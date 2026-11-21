// Builder for the family «erstatning» (en-US): hub page and one page per ingredient, like bygg.mjs (nb) but in American English.
// The page writes no number itself: every number in the text comes from data.en.json with T(id) or E(id), where it carries a quote from the source.
// Amounts are US customary exactly as the source writes them (cups, tablespoons, teaspoons, ounces). The sources are not converted or translated.
// No author line and no Person author on English pages (same as /en/tools/cups-to-grams/).
// c (content per page): tittel, h1, beskrivelse, ingress, svar, seksjoner [[h2, html]], faq [[q, a]], steg [[title, text]], kilder [source id], kort, gruppe, lenke.
import { artikkel, brodsmuler, elementliste } from '../skjema.mjs';
import { byggRik } from '../../rik-sider.mjs';
import { esc } from '../../kalk-kort.mjs';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const engelskDato = (iso) => { const [a, m, d] = iso.split('-').map(Number); return `${MONTHS[m - 1]} ${d}, ${a}`; };
export const stor = (s) => s.charAt(0).toUpperCase() + s.slice(1);
export const og = (xs) => (xs.length > 2 ? `${xs.slice(0, -1).join(', ')}, and ${xs.at(-1)}` : xs.join(' and '));
/** FAQPage with the answers as plain text: the tests require the visible FAQ (without tags) to equal the JSON-LD. */
const faqSkjema = (faq) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/gu, '').trim() } })),
});
export const p = (...xs) => xs.map((x) => `<p>${x}</p>`).join('');
export const ul = (xs) => `<ul>${xs.map((x) => `<li>${x}</li>`).join('')}</ul>`;

const BROK = [[0.125, '1/8'], [0.25, '1/4'], [0.333, '1/3'], [0.375, '3/8'], [0.5, '1/2'], [0.625, '5/8'], [0.667, '2/3'], [0.75, '3/4'], [0.8, '4/5'], [0.8125, '13/16'], [0.875, '7/8']];
/** The number the way a US recipe writes it: whole numbers as they are, fractions as 1/4 and 1 1/2, otherwise a decimal point. */
export function fmt(v) {
  const hel = Math.floor(v + 1e-9);
  const rest = v - hel;
  if (rest < 0.005) return String(hel);
  const treff = BROK.find(([x]) => Math.abs(x - rest) < 0.0015);
  if (treff) return hel ? `${hel} ${treff[1]}` : treff[1];
  return String(v);
}
const flertall = (enhet, v) => (v > 1 && !/s$|fat$/u.test(enhet) ? `${enhet}s` : enhet);

/** T(id) is the number, E(id) the number with its unit. Both throw when the number is missing in the data file. */
export function tallFor(rad, familie) {
  const hent = (id) => {
    const t = rad.tall[id];
    if (!t) throw new Error(`${familie}/${rad.id}: the number «${id}» is missing in data.en.json`);
    return t;
  };
  return { T: (id) => fmt(hent(id).verdi), E: (id) => `${fmt(hent(id).verdi)} ${flertall(hent(id).enhet, hent(id).verdi)}` };
}

export function kilderFraId(data, ider, hvor) {
  return [...new Set(ider)].map((id) => {
    const k = data.kilder[id];
    if (!k) throw new Error(`${hvor}: the source «${id}» is not in data.en.json`);
    return k;
  });
}

/** One card per swap: title and label/value pairs. */
export function kortListe(kort) {
  return kort.map(([navn, ...rader]) => `<div class="scenario"><h3>${navn}</h3><dl>${rader.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl></div>`).join('');
}

function kildeAvsnitt(kilder, intro) {
  return p(intro)
    + `<ol class="kilder" id="kilder">${kilder.map((k) => `<li>${esc(k.utgiver)}: <a href="${esc(k.adresse)}" rel="noopener">${esc(k.navn)}</a> (${k.aar}). Accessed ${engelskDato(k.hentet)}.</li>`).join('')}</ol>`
    + p('Spot a mistake, or did a source change? Email <a href="mailto:hei@matlyst-app.no">hei@matlyst-app.no</a>.');
}

const TALL = /\d+(?:[.,]\d+)?(?:\/\d+)?|[½⅓⅔¼¾⅛⅜⅝⅞]/gu;
const tallene = (t) => String(t ?? '').match(TALL) ?? [];

export function lagMal({ familie, rot, innhold, nav, kildeIntro, eyebrow, cta, relatertTittel }) {
  const sti = (rad) => `${rot}${rad.slug}/`;
  const bygg = (rad) => {
    const mal = innhold[rad.id];
    if (!mal) throw new Error(`${familie}/${rad.id}: no text in tekst-en.mjs`);
    const { T, E } = tallFor(rad, familie);
    return mal(T, E, rad);
  };
  const kildeTall = (k) => [String(k.aar), ...tallene(engelskDato(k.hentet)), ...tallene(k.navn)];

  /** The numbers the page may show: the quotes of the row, the numbers as written, and the sources' years and dates. */
  function tillatteTall(rad, data) {
    const s = new Set();
    for (const t of Object.values(rad.tall)) { s.add(fmt(t.verdi)); s.add(String(t.verdi)); fmt(t.verdi).split(' ').forEach((x) => s.add(x)); tallene(t.merknad).forEach((n) => s.add(n)); }
    for (const v of Object.values(rad.tekst ?? {})) tallene(v).forEach((n) => s.add(n));
    for (const k of kilderFraId(data, bygg(rad).kilder, `${familie}/${rad.id}`)) kildeTall(k).forEach((n) => s.add(n));
    return s;
  }
  function tillatteTallNav(data) {
    const s = new Set();
    for (const r of data.rader.filter((x) => x.status === 'kontrollert')) for (const n of tillatteTall(r, data)) s.add(n);
    for (const k of Object.values(data.kilder)) kildeTall(k).forEach((n) => s.add(n));
    return s;
  }
  const maskeNavn = (rad) => [rad.navn.toLowerCase(), rad.slug.replace(/-/gu, ' '), rad.slug];

  function sideForRad(rad, data, rader) {
    const c = bygg(rad);
    const adresse = sti(rad);
    const kilder = kilderFraId(data, c.kilder, `${familie}/${rad.id}`);
    const rik = byggRik({ lang: 'en', svarTekst: c.svar, seksjoner: [...c.seksjoner, ['Sources', kildeAvsnitt(kilder, kildeIntro)]] }).html;
    const andre = (c.beslektet ?? []).map((id) => rader.find((r) => r.id === id)).filter(Boolean);
    const relatert = `<div class="related"><h2>${relatertTittel}</h2><ul>${andre.map((r) => `<li><a href="${sti(r)}">${esc(bygg(r).lenke ?? bygg(r).h1)}</a></li>`).join('')}<li><a href="${rot}">${esc(nav.lenke)}</a></li></ul></div>`;
    return {
      title: c.tittel,
      description: c.beskrivelse,
      eyebrow: `<a href="${rot}">${esc(eyebrow)}</a><span aria-hidden="true"> › </span>${esc(stor(rad.navn))}`,
      h1: c.h1,
      lead: c.ingress,
      steg: c.steg,
      stegTittel: 'In short', forst: '', alternativ: '', grense: '', seksjoner: [],
      rik: `${rik}\n${relatert}`,
      faqTittel: 'Questions and answers', faq: c.faq.map(([q, a]) => [q, esc(a)]),
      cta,
      publisert: rad.oppdatert,
      schemas: [
        brodsmuler([{ navn: 'Home', adresse: '/en/' }, { navn: nav.lenke, adresse: rot }, { navn: c.h1, adresse }]),
        artikkel({ tittel: c.h1, beskrivelse: c.beskrivelse, adresse, sprak: 'en', publisert: rad.oppdatert, kilder }),
        faqSkjema(c.faq),
      ],
    };
  }

  function navSide(data, rader) {
    const n = nav.innhold(rader.map((r) => ({ rad: r, c: bygg(r), href: sti(r) })));
    const kilder = kilderFraId(data, rader.flatMap((r) => bygg(r).kilder), `${familie}/hub`);
    const rik = byggRik({ lang: 'en', svarTekst: n.svar, seksjoner: [...n.seksjoner, ['Sources', kildeAvsnitt(kilder, kildeIntro)]] }).html;
    const publisert = rader.map((r) => r.oppdatert).sort().at(-1);
    return {
      title: n.tittel,
      description: n.beskrivelse,
      eyebrow: esc(eyebrow),
      h1: n.h1,
      lead: n.ingress,
      steg: n.steg,
      stegTittel: 'In short', forst: '', alternativ: '', grense: '', seksjoner: [],
      rik,
      faqTittel: 'Questions and answers', faq: n.faq.map(([q, a]) => [q, esc(a)]),
      cta,
      publisert,
      schemas: [
        brodsmuler([{ navn: 'Home', adresse: '/en/' }, { navn: n.h1, adresse: rot }]),
        artikkel({ tittel: n.h1, beskrivelse: n.beskrivelse, adresse: rot, sprak: 'en', publisert, kilder }),
        elementliste({ navn: n.h1, adresse: rot, elementer: rader.map((r) => ({ navn: bygg(r).h1, adresse: sti(r) })) }),
        faqSkjema(n.faq),
      ],
    };
  }

  return { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn, bygg };
}

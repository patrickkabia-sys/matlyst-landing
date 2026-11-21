// Generatoren for de nøytrale sammenligningssidene, felles for alle markeder (nb.mjs og en.mjs).
// Regelen (designspec punkt 10): Matlyst står oppgitt som avsender øverst, hvert faktum om en app har kilde og dato,
// og det som ikke står i kildene, står som «ikke oppgitt» / «not stated». Ingen stjerner, vurderinger, priser eller logoer.
// Faktaene og sitatene står i apper.<marked>.json; kildekontroll.mjs sjekker at hvert sitat fortsatt står hos kilden.
// Et marked gir bare tekst og innstillinger: språk, feltnavn, datoformat, sidetekstene og hvilke apper som står på hvilken side.
// Låst av test/sammenligning.test.mjs.
import { readFileSync } from 'node:fs';
import { BASE } from '../forfatter.mjs';
import { byggRik } from '../rik-sider.mjs';

export const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
export const p = (...xs) => xs.map((x) => `<p>${x}</p>`).join('');
export const ul = (xs) => `<ul>${xs.map((x) => `<li>${x}</li>`).join('')}</ul>`;

/**
 * @param {object} m markedet
 * @param {string} m.lang 'nb' eller 'en'
 * @param {URL} m.datafil apper.<marked>.json
 * @param {string} m.prefiks adresseprefiks for markedet ('/' eller '/en/')
 * @param {Record<string,string>} m.stier { oppskrift, handleliste, ukemeny } uten prefiks
 * @param {Record<string,string[]>} m.sideapper app-id-er per sidenøkkel
 */
export function lagSammenligning(m) {
  const DATA = JSON.parse(readFileSync(m.datafil, 'utf8'));
  const SJEKKET = DATA.sjekket;
  const T = m.tekst;
  const og = (xs) => m.liste(xs);

  const app = (id) => {
    const a = DATA.apper[id];
    if (!a) throw new Error(`sammenligning/${m.lang}: ukjent app «${id}»`);
    return a;
  };
  const fakta = (id, felt) => {
    const f = app(id).fakta[felt];
    if (!f) throw new Error(`sammenligning/${m.lang}: ${id} mangler feltet «${felt}»`);
    return f;
  };
  const verdi = (id, felt) => (fakta(id, felt).tekst === m.ikke ? m.ikke.toLowerCase() : esc(fakta(id, felt).tekst));

  /** Kildene én app bruker, i rekkefølgen de først nevnes. */
  function kilderForApp(id) {
    const ider = [...new Set(Object.values(app(id).fakta).flatMap((f) => (f.kilder ?? []).map((k) => k.kilde)))];
    return ider.map((k) => ({ id: k, ...DATA.kilder[k] }));
  }

  const KILDETYPE = (k) => (k.utgiver.startsWith('App Store') ? 'App Store' : k.utgiver.startsWith('Google Play') ? 'Google Play' : k.utgiver);
  const href = (nokkel) => `${m.prefiks}${m.stier[nokkel]}`;

  function tabell(ider, felt, tittel) {
    const hode = `<tr><th scope="col">${T.app}</th>${felt.map((f) => `<th scope="col">${m.felt[f]}</th>`).join('')}</tr>`;
    const rader = ider.map((id) => `<tr><th scope="row"><a href="#app-${id}">${esc(app(id).navn)}</a></th>${felt.map((f) => `<td>${verdi(id, f)}</td>`).join('')}</tr>`).join('');
    return `<div class="table-wrap" tabindex="0" role="region" aria-label="${esc(tittel)}"><table class="stabell"><caption>${esc(tittel)}. ${T.sjekketStor} ${m.kortDato(SJEKKET)}.</caption><thead>${hode}</thead><tbody>${rader}</tbody></table></div>`;
  }

  function kort(id, felt, bestFor) {
    const a = app(id);
    const rader = [[T.bestFor, bestFor], ...felt.map((f) => [m.felt[f], verdi(id, f)])];
    const kilder = kilderForApp(id).map((k) => `<a href="${esc(k.adresse)}" rel="noopener">${esc(KILDETYPE(k))}</a>`);
    rader.push([T.kilder, `${og(kilder)}, ${T.sjekket} ${m.kortDato(SJEKKET)}`]);
    return `<div class="scenario" id="app-${id}"><h3>${esc(a.navn)}</h3><dl>${rader.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl></div>`;
  }

  const SIDEAPPER = Object.fromEntries(Object.entries(m.sideapper).map(([nokkel, ider]) => [m.stier[nokkel], [...ider]]));
  // Alfabetisk etter navn: rekkefølgen på siden er ingen rangering.
  for (const sti of Object.keys(SIDEAPPER)) SIDEAPPER[sti].sort((x, y) => app(x).navn.localeCompare(app(y).navn, m.lang));
  const apperPaSide = (sti) => SIDEAPPER[sti];
  const sideKilder = (sti) => new Set(SIDEAPPER[sti].flatMap((id) => kilderForApp(id).map((k) => k.adresse)));

  /** Article med kildene som citation. Markedet pakker den inn (brødsmuler, FAQ) slik generatoren for språket vil ha det. */
  function artikkel(sti, h1, beskrivelse) {
    const kilder = [...new Map(Object.values(DATA.kilder).map((k) => [k.adresse, k])).values()];
    return {
      '@context': 'https://schema.org', '@type': 'Article', headline: h1, description: beskrivelse, image: [`${BASE}/images/og.jpg`], inLanguage: m.lang,
      datePublished: SJEKKET, dateModified: SJEKKET, mainEntityOfPage: `${BASE}${m.prefiks}${sti}`,
      author: { '@type': 'Organization', name: 'Matlyst', url: BASE }, publisher: { '@type': 'Organization', name: 'Matlyst', url: BASE },
      citation: kilder.filter((k) => sideKilder(sti).has(k.adresse)).map((k) => ({ '@type': 'WebPage', name: `${k.navn} (${k.utgiver})`, url: k.adresse })),
    };
  }

  const andreSider = (her) => p(T.andreSider(og(Object.keys(m.stier).filter((k) => k !== her).map((k) => `<a href="${href(k)}">${T.sidenavn[k]}</a>`))));

  function side(nokkel, s) {
    const sti = m.stier[nokkel];
    const ider = SIDEAPPER[sti];
    for (const id of ider) if (!s.best[id]) throw new Error(`sammenligning/${m.lang}/${sti}: mangler «best for» for ${id}`);
    const rik = byggRik({
      lang: m.lang,
      svarTekst: s.svar,
      seksjoner: [
        [T.hvem, p(`<strong>${m.avsender}</strong> ${T.hvemTekst(m.langDato(SJEKKET))}`)],
        [T.valg, s.valg],
        [T.sammenligning, p(T.tabellIntro) + tabell(ider, s.tabellFelt, T.tabellTittel)],
        [T.enForEn, ider.map((id) => kort(id, s.kortFelt, s.best[id])).join('')],
        ...s.ekstra,
        s.iMatlyst,
        [T.slikValgte, T.slikValgteTekst(s.kategori, m.langDato(SJEKKET)) + andreSider(nokkel)],
      ],
    }).html;
    return {
      title: s.title, description: s.description,
      eyebrow: T.eyebrow,
      h1: s.h1, lead: `${m.avsender} ${s.lead}`,
      forst: '', stegTittel: T.stegTittel, steg: s.steg,
      alternativ: '', grense: '', seksjoner: [],
      rik,
      faqTittel: T.faqTittel, faq: s.faq, cta: s.cta,
      publisert: SJEKKET,
      schemas: m.skjemaer({ sti, h1: s.h1, beskrivelse: s.description, artikkel: artikkel(sti, s.h1, s.description) }),
    };
  }

  const sider = Object.fromEntries(Object.entries(m.sider).map(([nokkel, s]) => [m.stier[nokkel], side(nokkel, s)]));
  return { DATA, AVSENDER: m.avsender, STIER: m.stier, PREFIKS: m.prefiks, IKKE: m.ikke, FELT: Object.keys(m.felt), T, apperPaSide, kilderForApp, kortDato: m.kortDato, langDato: m.langDato, sider };
}

// Felles bygger for familiene «erstatning» og «rester» (nb): samleside og én side per rad.
// Hver familie har data.nb.json (tall med kilde og sitat) og tekst-nb.mjs (teksten per rad). Malene kaller lagMal() med innholdet sitt.
// Siden skriver ingen tall selv: hvert tall i teksten hentes fra datafila med T(id), og tillatteTall() er nøyaktig det datafila gir.
// Innholdet per side (c) har feltene: tittel, h1, beskrivelse, ingress, svar, seksjoner [[h2, html]], faq [[spørsmål, svar]],
// steg [[tittel, tekst]], kilder [kilde-id], kort (én linje til samlesiden) og gruppe (overskrift på samlesiden).
import { kilderFor } from '../felles.mjs';
import { artikkel, brodsmuler, elementliste } from '../skjema.mjs';
import { byggRik } from '../../rik-sider.mjs';
import { esc, tallI } from '../../kalk-kort.mjs';
import { forfatterPerson, harForfatter } from '../../forfatter.mjs';

const MAANEDER = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'];
export const norskDato = (iso) => { const [a, m, d] = iso.split('-').map(Number); return `${d}. ${MAANEDER[m - 1]} ${a}`; };
export const stor = (s) => s.charAt(0).toUpperCase() + s.slice(1);
export const og = (xs) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} og ${xs.at(-1)}` : xs[0] ?? '');
export const p = (...xs) => xs.map((x) => `<p>${x}</p>`).join('');
export const ul = (xs) => `<ul>${xs.map((x) => `<li>${x}</li>`).join('')}</ul>`;

/** Tallet slik det står på siden: heltall som de er, ½ og ¼ som 1/2 og 1/4, ellers komma som desimaltegn. */
export function fmt(v) {
  if (v === 0.5) return '1/2';
  if (v === 0.25) return '1/4';
  return String(v).replace('.', ',');
}

/** Tallfunksjonene en side bruker: T(id) er tallet, E(id) er tallet med enhet. Kaster når tallet mangler i datafila. */
export function tallFor(rad, familie) {
  const hent = (id) => {
    const t = rad.tall[id];
    if (!t) throw new Error(`${familie}/${rad.id}: tallet «${id}» mangler i data.nb.json`);
    return t;
  };
  const T = (id) => fmt(hent(id).verdi);
  const E = (id) => `${fmt(hent(id).verdi)} ${hent(id).enhet}`;
  return { T, E };
}

/** Kilder fra id-er (ikke bare de tallene peker på): kaster når en id ikke finnes. */
export function kilderFraId(data, ider, hvor) {
  return [...new Set(ider)].map((id) => {
    const k = data.kilder[id];
    if (!k) throw new Error(`${hvor}: kilden «${id}» finnes ikke i data.nb.json`);
    return k;
  });
}

/** Kort per bytte: tittel og et sett etikett/verdi-par. */
export function kortListe(kort) {
  return kort.map(([navn, ...rader]) => `<div class="scenario"><h3>${navn}</h3><dl>${rader.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl></div>`).join('');
}

function kildeAvsnitt(kilder, intro) {
  return p(intro)
    + `<ol class="kilder" id="kilder">${kilder.map((k) => `<li>${esc(k.utgiver)}: ${esc(k.navn)} (${k.aar}). <a href="${esc(k.adresse)}" rel="noopener">${esc(new URL(k.adresse).hostname)}</a>. Lest ${norskDato(k.hentet)}.</li>`).join('')}</ol>`
    + p('Har en kilde endret seg, eller fant du en feil? Skriv til <a href="mailto:hei@matlyst-app.no">hei@matlyst-app.no</a>.');
}

/**
 * @param {object} f
 * rot: '/erstatning/'. innhold: { [rad-id]: (T, E, rad) => c }. nav: innholdet på samlesiden (eller null når samlesiden ikke genereres).
 * kildeIntro: setningen over kildelista. eyebrow: navnet i brødsmulen. cta: knappeteksten. navnTall: sidetittelen på lista over sider.
 */
export function lagMal({ familie, rot, innhold, nav, kildeIntro, eyebrow, cta, relatertTittel }) {
  const sti = (rad) => `${rot}${rad.slug}/`;
  const bygg = (rad) => {
    const mal = innhold[rad.id];
    if (!mal) throw new Error(`${familie}/${rad.id}: ingen tekst i tekst-nb.mjs`);
    const { T, E } = tallFor(rad, familie);
    return mal(T, E, rad);
  };

  /** Tallene siden kan vise: radens tall (slik de står), sitatene, kildenes år og lesedatoer. */
  function tillatteTall(rad, data) {
    const s = new Set();
    for (const t of Object.values(rad.tall)) { s.add(fmt(t.verdi)); s.add(String(t.verdi)); tallI(t.merknad).forEach((n) => s.add(n)); }
    for (const k of kilderFraId(data, bygg(rad).kilder, `${familie}/${rad.id}`)) { s.add(String(k.aar)); tallI(norskDato(k.hentet)).forEach((n) => s.add(n)); tallI(k.navn).forEach((n) => s.add(n)); }
    return s;
  }
  function tillatteTallNav(data) {
    const s = new Set();
    for (const r of data.rader.filter((x) => x.status === 'kontrollert')) for (const n of tillatteTall(r, data)) s.add(n);
    for (const k of Object.values(data.kilder)) { s.add(String(k.aar)); tallI(norskDato(k.hentet)).forEach((n) => s.add(n)); tallI(k.navn).forEach((n) => s.add(n)); }
    return s;
  }
  const maskeNavn = (rad) => [rad.navn.toLowerCase(), rad.slug];

  function sideForRad(rad, data, rader) {
    const c = bygg(rad);
    const adresse = sti(rad);
    const kilder = kilderFraId(data, c.kilder, `${familie}/${rad.id}`);
    const rik = byggRik({
      lang: 'nb',
      svarTekst: c.svar,
      seksjoner: [...c.seksjoner, ['Kilder', kildeAvsnitt(kilder, kildeIntro)]],
    }).html;
    const andre = rader.filter((r) => r.id !== rad.id);
    const relatert = `<div class="related"><h2>${relatertTittel}</h2><ul>${andre.map((r) => `<li><a href="${sti(r)}">${esc(bygg(r).lenke ?? bygg(r).h1)}</a></li>`).join('')}<li><a href="${rot}">${esc(nav.lenke)}</a></li></ul></div>`;
    return {
      title: c.tittel,
      description: c.beskrivelse,
      eyebrow: `<a href="${rot}">${esc(eyebrow)}</a><span aria-hidden="true"> › </span>${esc(stor(rad.navn))}`,
      h1: c.h1,
      lead: c.ingress,
      steg: c.steg,
      stegTittel: 'Kort fortalt', forst: '', alternativ: '', grense: '', seksjoner: [],
      rik: `${rik}\n${relatert}`,
      faqTittel: c.faqTittel ?? 'Spørsmål og svar', faq: c.faq.map(([q, a]) => [q, esc(a)]),
      cta,
      publisert: rad.oppdatert,
      schemas: [
        brodsmuler([{ navn: 'Forside', adresse: '/' }, { navn: nav.lenke, adresse: rot }, { navn: c.h1, adresse }]),
        artikkel({ tittel: c.h1, beskrivelse: c.beskrivelse, adresse, sprak: 'nb', publisert: rad.oppdatert, kilder, forfatter: harForfatter(adresse) ? forfatterPerson() : undefined }),
      ],
    };
  }

  function navSide(data, rader) {
    const n = nav.innhold(rader.map((r) => ({ rad: r, c: bygg(r), href: sti(r) })));
    const kilder = kilderFraId(data, rader.flatMap((r) => bygg(r).kilder), `${familie}/samleside`);
    const rik = byggRik({
      lang: 'nb',
      svarTekst: n.svar,
      seksjoner: [...n.seksjoner, ['Kilder', kildeAvsnitt(kilder, kildeIntro)]],
    }).html;
    const publisert = rader.map((r) => r.oppdatert).sort().at(-1);
    return {
      title: n.tittel,
      description: n.beskrivelse,
      eyebrow: esc(eyebrow),
      h1: n.h1,
      lead: n.ingress,
      steg: n.steg,
      stegTittel: 'Kort fortalt', forst: '', alternativ: '', grense: '', seksjoner: [],
      rik,
      faqTittel: 'Spørsmål og svar', faq: n.faq.map(([q, a]) => [q, esc(a)]),
      cta,
      publisert,
      schemas: [
        brodsmuler([{ navn: 'Forside', adresse: '/' }, { navn: n.h1, adresse: rot }]),
        artikkel({ tittel: n.h1, beskrivelse: n.beskrivelse, adresse: rot, sprak: 'nb', publisert, kilder, forfatter: harForfatter(rot) ? forfatterPerson() : undefined }),
        elementliste({ navn: n.h1, adresse: rot, elementer: rader.map((r) => ({ navn: bygg(r).h1, adresse: sti(r) })) }),
      ],
    };
  }

  return { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn, bygg };
}

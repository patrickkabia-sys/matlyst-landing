// Felles mal for familiene «holdbarhet» (kjøleskap) og «frysing» (fryser), norsk. Hver familie har sin datafil og sin tekst (tekst-nb.mjs);
// denne fila bygger sidene. Regler (Patrick 20.11.2026): Mattilsynet først, MatPrat etterpå med årstall, ingen egne råd, og
// ingen tall uten kilde. Prosaen i tekst-nb.mjs skriver aldri et tall selv: den henter dem med t(felt), og t() noterer kilden,
// så kildelista på siden er nøyaktig de kildene siden bruker. Tallvakten (test/hjelp/familievakt.mjs) feller et tall som ikke står i datafila.
import { publiserbare } from '../felles.mjs';
import { artikkel, brodsmuler, elementliste } from '../skjema.mjs';
import { forfatterPerson } from '../../forfatter.mjs';

export const esc = (s) => String(s).replace(/&/gu, '&amp;').replace(/</gu, '&lt;').replace(/>/gu, '&gt;').replace(/"/gu, '&quot;');
const MAANEDER = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'];
export const norskDato = (iso) => { const [a, m, d] = iso.split('-').map(Number); return `${d}. ${MAANEDER[m - 1]} ${a}`; };
const kort = (k) => (k.utgiver.startsWith('MatPrat') ? 'MatPrat' : k.utgiver);
const erMattilsynet = (k) => k.utgiver === 'Mattilsynet';
const tallTekst = (n) => String(Math.abs(n)).replace('.', ',');
const enhetTekst = (enhet) => (enhet === '°C' ? ' °C' : ` ${enhet}`);

/** Hjelperne en side skrives med. `brukt` samler kildene siden faktisk bruker. */
function hjelpere(rad, data, brukt = new Set()) {
  const tall = (felt) => {
    const x = rad.tall[felt];
    if (!x) throw new Error(`${rad.id}: tallet «${felt}» finnes ikke i datafila`);
    brukt.add(x.kilde);
    return x;
  };
  /** «3 til 4 måneder», «4 dager», «minus 18 °C». Med ca: «ca. 6 måneder». Felt uten -min/-maks er ett tall. */
  const t = (felt, { ca = false } = {}) => {
    if (rad.tall[felt]) { const x = tall(felt); return `${x.verdi < 0 ? 'minus ' : ''}${tallTekst(x.verdi)}${enhetTekst(x.enhet)}`; }
    const min = tall(`${felt}-min`);
    const maks = rad.tall[`${felt}-maks`] ? tall(`${felt}-maks`) : null;
    const tekst = maks && maks.verdi !== min.verdi ? `${tallTekst(min.verdi)} til ${tallTekst(maks.verdi)}` : tallTekst(min.verdi);
    return `${ca ? 'ca. ' : ''}${tekst}${enhetTekst(min.enhet)}`;
  };
  /** «MatPrat (2023)» eller «Mattilsynet (2026)», og kilden noteres. */
  const k = (id) => {
    const kilde = data.kilder[id];
    if (!kilde) throw new Error(`${rad.id}: kilden «${id}» finnes ikke i datafila`);
    brukt.add(id);
    return `${kort(kilde)} (${kilde.aar})`;
  };
  /** Som k, men til bruk inne i en parentes: «Mattilsynet, 2022». */
  const kp = (id) => k(id).replace(/ \((\d{4})\)$/u, ', $1');
  return { t, k, kp, brukt };
}

function kildeliste(data, brukt) {
  const ider = [...brukt].sort((a, b) => Number(erMattilsynet(data.kilder[b])) - Number(erMattilsynet(data.kilder[a])));
  return `<h2>Kilder</h2>\n<ol class="kilder" id="kilder">${ider.map((id) => {
    const k = data.kilder[id];
    return `<li>${esc(k.utgiver)}: <a href="${esc(k.adresse)}" rel="noopener">${esc(k.navn)}</a> (${k.aar}). Lest ${norskDato(k.hentet)}.</li>`;
  }).join('')}</ol>`;
}

/** Tabellen: kolonner er overskriftene, rader er [etikett, ...celler] der en celle er et felt, { felt, ca }, { tekst } eller null (ikke oppgitt). */
function tabell(h, { tittel, kolonner, rader }) {
  const celle = (c) => {
    if (c == null) return '<td>Ikke oppgitt</td>';
    if (typeof c === 'string') return `<td>${h.t(c)}</td>`;
    if (c.tekst) return `<td>${esc(c.tekst)}</td>`;
    return `<td>${h.t(c.felt, { ca: c.ca })}</td>`;
  };
  return `<div class="table-wrap" tabindex="0" role="region" aria-label="${esc(tittel)}"><table class="sprik"><thead><tr>${kolonner.map((x) => `<th scope="col">${esc(x)}</th>`).join('')}</tr></thead><tbody>${rader.map(([etikett, ...celler]) => `<tr><td>${esc(etikett)}</td>${celler.map(celle).join('')}</tr>`).join('')}</tbody></table></div>`;
}

// Appen på sidene: app-bevis.mjs legger skjermbilde av spiskammeret og ukemenyen under disse overskriftene (reglene «pantry» og «plan»).
const APP = '<h2>Bruk opp det du har i kjøleskapet</h2><p>I Matlyst ser du hvor mange dager som er igjen på varene i spiskammeret.</p>\n<h2>Planlegg uka etter det som må brukes først</h2><p>Legg middagene i ukemenyen, så ser du hva som skal brukes eller tines først.</p>';
const p = (liste) => liste.filter(Boolean).map((x) => `<p>${x}</p>`).join('');
const kildeTall = (k) => [String(k.aar), ...norskDato(k.hentet).match(/\d+/gu)];

/**
 * cfg: { rot, sti (samlesidens navn i brødsmula), eyebrowNavn, cta, TEKST, nav(h, data, rader) }.
 * TEKST[radId](h) gir { title, h1, description, lead, mattilsynet: string[], tabell: { tittel, intro, kolonner, rader, kilde, etter? }, ekstra?: [h2, html][], faq, soster? }.
 */
export function lagMal(cfg) {
  const sti = (rad) => `${cfg.rot}${rad.slug}/`;
  const eyebrowVare = `<a href="${cfg.rot}">${esc(cfg.eyebrowNavn)}</a>`;
  const SKJELETT = { stegTittel: 'Slik leser du tabellen', forst: '', alternativ: '', grense: '', seksjoner: [], cta: cfg.cta, steg: [['Finn varen', 'Tidene står i tabellen, med kilde.']] };
  const brodsmule = (...ledd) => brodsmuler([{ navn: 'Forside', adresse: '/' }, { navn: cfg.eyebrowNavn, adresse: cfg.rot }, ...ledd]);

  function sideForRad(rad, data, rader) {
    const h = hjelpere(rad, data);
    const tekst = cfg.TEKST[rad.id];
    if (!tekst) throw new Error(`${rad.id}: mangler tekst i tekst-nb.mjs`);
    const s = tekst(h);
    const tb = s.tabell;
    h.k(tb.kilde);
    const lenker = [...(s.soster ? [s.soster] : []), [cfg.rot, cfg.alleTekst], ...(s.andre ?? [])];
    const rik = [
      `<h2>Dette sier Mattilsynet</h2>${p(s.mattilsynet)}`,
      `<h2>${esc(tb.tittel)}</h2>${p([tb.intro])}${tabell(h, tb)}<p><small>Kilde: ${h.k(tb.kilde)}, «${esc(data.kilder[tb.kilde].navn)}». Lest ${norskDato(data.kilder[tb.kilde].hentet)}.</small></p>${p(tb.etter ?? [])}`,
      ...(s.ekstra ?? []).map(([tittel, html]) => `<h2>${esc(tittel)}</h2>${html}`),
      APP,
      `<div class="related"><h2>Les også</h2><ul>${lenker.map(([href, t]) => `<li><a href="${href}">${esc(t)}</a></li>`).join('')}</ul></div>`,
    ];
    const faq = s.faq;
    const kilder = kildeliste(data, h.brukt);
    const adresse = sti(rad);
    const kildeObjekter = [...h.brukt].map((id) => data.kilder[id]);
    return {
      title: s.title, description: s.description, eyebrow: eyebrowVare, h1: s.h1, lead: s.lead,
      ...SKJELETT, rik: [...rik, kilder].join('\n'),
      faqTittel: s.faqTittel ?? `Spørsmål om ${s.ord ?? rad.navn.toLowerCase()}`, faq,
      publisert: rad.oppdatert,
      schemas: [
        brodsmule({ navn: rad.navn, adresse }),
        artikkel({ tittel: s.h1, beskrivelse: s.description, adresse, sprak: 'nb', publisert: rad.oppdatert, kilder: kildeObjekter, forfatter: forfatterPerson() }),
      ],
    };
  }

  function navSide(data, rader) {
    const brukt = new Set();
    const s = cfg.nav({ data, rader, sti, h: (rad) => hjelpere(rad, data, brukt), tabell, p, esc, norskDato });
    const publisert = rader.map((r) => r.oppdatert).sort().at(-1);
    return {
      title: s.title, description: s.description, eyebrow: esc(cfg.eyebrowNavn), h1: s.h1, lead: s.lead,
      ...SKJELETT, rik: [s.rik, APP, kildeliste(data, brukt)].join('\n'),
      faqTittel: s.faqTittel, faq: s.faq, publisert,
      schemas: [
        brodsmule(),
        artikkel({ tittel: s.h1, beskrivelse: s.description, adresse: cfg.rot, sprak: 'nb', publisert, kilder: [...brukt].map((id) => data.kilder[id]), forfatter: forfatterPerson() }),
        elementliste({ navn: s.h1, adresse: cfg.rot, elementer: rader.map((r) => ({ navn: r.navn, adresse: sti(r) })) }),
      ],
    };
  }

  /** Tallene DEN siden kan bruke: radens egne tall (uten fortegn) og år og lesedato for kildene. */
  function tillatteTall(rad, data) {
    const s = new Set();
    for (const x of Object.values(rad.tall)) s.add(tallTekst(x.verdi));
    for (const k of Object.values(data.kilder)) kildeTall(k).forEach((n) => s.add(n));
    return s;
  }
  /** Samlesiden: alle publiserbare raders tall, antallet varer og kildenes år og datoer. */
  function tillatteTallNav(data) {
    const alle = publiserbare(data);
    const s = new Set([String(alle.length)]);
    for (const r of alle) for (const n of tillatteTall(r, data)) s.add(n);
    return s;
  }
  const maskeNavn = (rad) => [rad.navn, rad.navn.toLowerCase()];
  return { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn, sti };
}

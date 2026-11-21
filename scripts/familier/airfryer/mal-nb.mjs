// Malen for familien «airfryer» (nb): samleside med omregner (/airfryer/), omregningssiden (/airfryer/ovn-til-airfryer/) og én side per råvare.
// Hver side er skrevet i tekst-nb.mjs, og hvert tall på siden hentes derfra med t(felt) fra data.nb.json, der sitatet bak tallet står i `merknad`.
// scripts/familier/airfryer/kildekontroll.mjs sjekker at sitatene fortsatt står hos kilden. Tidene er veiledende og merkes slik på hver side.
// Regler (Patrick 20.11.2026): kilde med lenke og årstall for hvert tall, to kilder som spriker vises side om side, og ingen egne råd om mattrygghet.
import { publiserbare } from '../felles.mjs';
import { artikkel, brodsmuler, elementliste } from '../skjema.mjs';
import { forfatterPerson } from '../../forfatter.mjs';
import { byggRik } from '../../rik-sider.mjs';
import { esc } from '../../kalk-kort.mjs';
import { NAV, TEKST } from './tekst-nb.mjs';

export const ROT = '/airfryer/';
const MAANEDER = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'];
export const norskDato = (iso) => { const [a, m, d] = iso.split('-').map(Number); return `${d}. ${MAANEDER[m - 1]} ${a}`; };
const sti = (rad) => `${ROT}${rad.slug}/`;
const kort = (k) => (k.utgiver.startsWith('MatPrat') ? 'MatPrat' : k.utgiver);
const tallTekst = (n) => String(n).replace('.', ',');
const ENTALL = { minutter: 'minutt', timer: 'time', dager: 'dag', ganger: 'gang' };
const enhetTekst = (enhet, verdi) => (enhet === 'stk' ? '' : enhet === '°C' ? ' °C' : ` ${verdi === 1 ? (ENTALL[enhet] ?? enhet) : enhet}`);
const p = (...xs) => xs.filter(Boolean).map((x) => `<p>${x}</p>`).join('');

/** Hjelperne en side skrives med. `brukt` samler kildene siden faktisk bruker. */
export function hjelpere(rad, data, brukt = new Set()) {
  const tall = (felt) => {
    const x = rad.tall[felt];
    if (!x) throw new Error(`${rad.id}: tallet «${felt}» finnes ikke i datafila`);
    brukt.add(x.kilde);
    return x;
  };
  /** «6 minutter», «20 til 25 minutter», «180 °C». Med ca: «ca. 8 minutter». Felt uten -min/-maks er ett tall. */
  const t = (felt, { ca = false } = {}) => {
    if (rad.tall[felt]) { const x = tall(felt); return `${ca ? 'ca. ' : ''}${tallTekst(x.verdi)}${enhetTekst(x.enhet, x.verdi)}`; }
    const min = tall(`${felt}-min`);
    const maks = rad.tall[`${felt}-maks`] ? tall(`${felt}-maks`) : null;
    const tekst = maks && maks.verdi !== min.verdi ? `${tallTekst(min.verdi)} til ${tallTekst(maks.verdi)}` : tallTekst(min.verdi);
    return `${ca ? 'ca. ' : ''}${tekst}${enhetTekst(min.enhet, maks && maks.verdi !== min.verdi ? 2 : min.verdi)}`;
  };
  /** Bare tallet, uten enhet (til tabellceller med enheten i overskriften). */
  const n = (felt) => {
    if (rad.tall[felt]) return tallTekst(tall(felt).verdi);
    const min = tall(`${felt}-min`);
    const maks = rad.tall[`${felt}-maks`] ? tall(`${felt}-maks`) : null;
    return maks && maks.verdi !== min.verdi ? `${tallTekst(min.verdi)} til ${tallTekst(maks.verdi)}` : tallTekst(min.verdi);
  };
  /** «MatPrat (2022)», og kilden noteres. */
  const k = (id) => {
    const kilde = data.kilder[id];
    if (!kilde) throw new Error(`${rad.id}: kilden «${id}» finnes ikke i datafila`);
    brukt.add(id);
    return `${kort(kilde)} (${kilde.aar})`;
  };
  /** Som k, men til bruk inne i en parentes: «MatPrat, 2022». */
  const kp = (id) => k(id).replace(/ \((\d{4})\)$/u, ', $1');
  /** Tallet er brukt (kilden noteres), men teksten skrives av siden selv. */
  const bruk = (...felt) => { felt.forEach(tall); return ''; };
  return { t, n, k, kp, bruk, esc, p, tabell, brukt };
}

function kildeliste(data, brukt) {
  const ider = [...brukt];
  return `<ol class="kilder" id="kilder">${ider.map((id) => {
    const k = data.kilder[id];
    return `<li>${esc(k.utgiver)}: <a href="${esc(k.adresse)}" rel="noopener">${esc(k.navn)}</a> (${k.aar}). Lest ${norskDato(k.hentet)}.</li>`;
  }).join('')}</ol>`;
}

/** Tabell: kolonner er overskriftene, rader er arrays av ferdig HTML. */
export function tabell(tittel, kolonner, rader) {
  return `<div class="table-wrap" tabindex="0" role="region" aria-label="${esc(tittel)}"><table class="sprik"><thead><tr>${kolonner.map((x) => `<th scope="col">${esc(x)}</th>`).join('')}</tr></thead><tbody>${rader.map(([forst, ...celler]) => `<tr><th scope="row">${forst}</th>${celler.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

// Appen på sidene. app-bevis.mjs legger skjermbilder under overskrifter som passer (kokemodus, ukemeny og handleliste).
const APP = (tekst) => [
  ['Legg middagen i ukemenyen', `${p(tekst)}${p('Matlyst lagrer oppskrifter fra nettet, legger dem på dagene i ukemenyen og lager én handleliste av dem.')}`],
  ['Lag maten med kokemodus', p('Kokemodus i Matlyst viser stegene som en sjekkliste og foreslår tidtakere. Tidene fra denne siden er et sted å begynne, ikke en erstatning for oppskriften din.')],
];

const SKJELETT = { stegTittel: 'Slik leser du tidene', forst: '', alternativ: '', grense: '', seksjoner: [], cta: 'Planlegg middagene i Matlyst', steg: [['Velg kilde', 'Tidene står med kilde og år, side om side der kildene er uenige.']] };
const brodsmule = (...ledd) => brodsmuler([{ navn: 'Forside', adresse: '/' }, { navn: 'Airfryer', adresse: ROT }, ...ledd]);

function relatert(egenSti, ekstra = [], overskrift = 'Les også') {
  const lenker = [...ekstra, [ROT, 'Airfryer: tid og temperatur for vanlig mat'], [`${ROT}ovn-til-airfryer/`, 'Ovn til airfryer: slik regner du om temperatur og tid']];
  const sett = new Set();
  const unike = lenker.filter(([href]) => (sett.has(href) || href === egenSti ? false : sett.add(href)));
  return `<div class="related"><h2>${overskrift}</h2><ul>${unike.map(([href, tekst]) => `<li><a href="${href}">${esc(tekst)}</a></li>`).join('')}</ul></div>`;
}

export function sideForRad(rad, data, rader) {
  const h = hjelpere(rad, data);
  const lag = TEKST[rad.id];
  if (!lag) throw new Error(`${rad.id}: mangler tekst i tekst-nb.mjs`);
  const s = lag(h);
  const adresse = sti(rad);
  const eyebrow = `<a href="${ROT}">Airfryer</a><span aria-hidden="true"> › </span>${esc(rad.navn)}`;
  const kildeAvsnitt = (brukt) => ['Kilder', `${p(s.kilderTekst ?? 'Alle tall på siden er hentet fra disse kildene. Sitatet bak hvert tall ligger i datafila vi bygger siden fra, og blir kontrollert mot kilden.')}${kildeliste(data, brukt)}`];
  const seksjoner = s.seksjoner ? [...s.seksjoner, ...(s.app ? APP(s.app) : [])] : [
    [s.tabell.tittel, `${p(s.tabell.intro)}${tabell(s.tabell.tittel, s.tabell.kolonner, s.tabell.rader)}${p(...(s.tabell.etter ?? []))}`],
    ...(s.avsnitt ?? []),
    ...(s.kjerne ? [s.kjerne] : []),
    ...APP(s.app),
  ];
  const rik = byggRik({ lang: 'nb', svarTekst: s.svar, seksjoner: [...seksjoner, kildeAvsnitt(h.brukt)] }).html;
  const kildeObjekter = [...h.brukt].map((id) => data.kilder[id]);
  return {
    title: s.title, description: s.description, eyebrow, h1: s.h1, lead: s.lead,
    ...SKJELETT, rik: `${rik}\n${relatert(adresse, s.les ?? [])}`,
    faqTittel: s.faqTittel ?? `Spørsmål om ${s.ord ?? rad.navn.toLowerCase()} i airfryer`, faq: s.faq,
    publisert: rad.oppdatert,
    schemas: [
      brodsmule({ navn: s.h1, adresse }),
      artikkel({ tittel: s.h1, beskrivelse: s.description, adresse, sprak: 'nb', publisert: rad.oppdatert, kilder: kildeObjekter, forfatter: forfatterPerson() }),
    ],
  };
}

export function navSide(data, rader) {
  const brukt = new Set();
  const h = (rad) => hjelpere(rad, data, brukt);
  const s = NAV({ data, rader, h, sti, tabell, p, esc, norskDato });
  const publisert = rader.map((r) => r.oppdatert).sort().at(-1);
  const kildeAvsnitt = ['Kilder', `${p(s.kilderTekst)}${kildeliste(data, brukt)}`];
  const rik = byggRik({ lang: 'nb', svarTekst: s.svar, seksjoner: [...s.seksjoner, ...(s.app ? APP(s.app) : []), kildeAvsnitt] }).html;
  const navn = (r) => TEKST[r.id](hjelpere(r, data)).h1;
  const alle = `<div class="related"><h2>Alle sidene om airfryer</h2><ul>${rader.map((r) => `<li><a href="${sti(r)}">${esc(navn(r))}</a></li>`).join('')}</ul></div>`;
  return {
    title: s.title, description: s.description, eyebrow: 'Airfryer', h1: s.h1, lead: s.lead,
    ...SKJELETT, stegTittel: 'Slik bruker du siden', steg: [['Velg råvaren', 'Hver råvare har en side med tid og temperatur fra navngitte kilder.'], ['Regn om fra ovn', 'Omregneren gir temperatur og tid i airfryeren.']],
    rik: `${rik}\n${alle}`,
    faqTittel: s.faqTittel, faq: s.faq, publisert,
    schemas: [
      brodsmule(),
      artikkel({ tittel: s.h1, beskrivelse: s.description, adresse: ROT, sprak: 'nb', publisert, kilder: [...brukt].map((id) => data.kilder[id]), forfatter: forfatterPerson() }),
      elementliste({ navn: s.h1, adresse: ROT, elementer: rader.map((r) => ({ navn: navn(r), adresse: sti(r) })) }),
    ],
  };
}

const kildeTall = (k) => [String(k.aar), ...norskDato(k.hentet).match(/\d+/gu)];

/** Tallene DEN siden kan bruke: radens egne tall og år og lesedato for kildene. */
export function tillatteTall(rad, data) {
  const s = new Set();
  for (const x of Object.values(rad.tall)) s.add(tallTekst(x.verdi));
  for (const k of Object.values(data.kilder)) kildeTall(k).forEach((n) => s.add(n));
  return s;
}
/** Samlesiden: alle publiserbare raders tall og kildenes år og datoer (og antall sider). */
export function tillatteTallNav(data) {
  const alle = publiserbare(data);
  const s = new Set([String(alle.length)]);
  for (const r of alle) for (const n of tillatteTall(r, data)) s.add(n);
  return s;
}
export const maskeNavn = (rad) => [rad.navn, rad.navn.toLowerCase()];

// Template for the family «airfryer» (en-US): hub page with the converter (/en/air-fryer/), the conversion page (/en/air-fryer/oven-to-air-fryer/)
// and one page per food, written from data.en.json and tekst-en.mjs.
// The numbers are NOT translated from Norwegian: they come from US sources (Cosori, KitchenAid, Instant Pot, Philips, Mississippi State and
// Illinois Extension, USDA FSIS) with a quote per number in data.en.json. Prose never writes a number itself: h.t(field) reads it, and records
// the source, so the source list on a page is exactly the sources the page uses. Fahrenheit first, Celsius in parentheses (rounded from °F).
// Ingen forfatterlinje og ingen Person-forfatter: engelske sider følger /en/tools/cups-to-grams/ (Organization), som holdbarhet og frysing.
import { publiserbare } from '../felles.mjs';
import { artikkel, brodsmuler, elementliste } from '../skjema.mjs';
import { byggRik } from '../../rik-sider.mjs';
import { NAV, TEKST, kontrollerRegel, OVN_TABELL, celsius } from './tekst-en.mjs';

export const ROT = '/en/air-fryer/';
export const esc = (s) => String(s).replace(/&/gu, '&amp;').replace(/</gu, '&lt;').replace(/>/gu, '&gt;').replace(/"/gu, '&quot;');
const MAANEDER = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const engelskDato = (iso) => { const [a, m, d] = iso.split('-').map(Number); return `${MAANEDER[m - 1]} ${d}, ${a}`; };
const sti = (rad) => `${ROT}${rad.slug}/`;
const KORT = { 'Mississippi State': 'Mississippi State Extension', 'University of Illinois': 'Illinois Extension', USDA: 'USDA FSIS', 'Idaho Potato': 'Idaho Potato Commission' };
const kort = (k) => Object.entries(KORT).find(([start]) => k.utgiver.startsWith(start))?.[1] ?? k.utgiver;
const tempTekst = (f) => `${f}°F (${celsius(f)}°C)`;
const enhet = (e, verdi) => (verdi === 1 ? e.replace(/s$/u, '') : e);
const p = (...xs) => xs.filter(Boolean).map((x) => `<p>${x}</p>`).join('');
// Felt som er en forskjell i grader (ikke en temperatur): ingen Celsius, siden 25°F lavere ikke er 25 minus 32.
const erForskjell = (felt) => /-grad(?:-min|-maks)?$/u.test(felt);

/** Hjelperne en side skrives med. `brukt` samler kildene siden faktisk bruker. */
export function hjelpere(rad, data, brukt = new Set()) {
  const tall = (felt) => {
    const x = rad.tall[felt];
    if (!x) throw new Error(`${rad.id}: tallet «${felt}» finnes ikke i datafila`);
    brukt.add(x.kilde);
    return x;
  };
  const enTekst = (felt, x) => {
    if (x.enhet === '°F') return erForskjell(felt) ? `${x.verdi}°F` : tempTekst(x.verdi);
    return `${x.verdi} ${enhet(x.enhet, x.verdi)}`;
  };
  /** «390°F (199°C)», «15 to 22 minutes», «20 percent». Felt uten -min/-maks er ett tall. */
  const t = (felt) => {
    if (rad.tall[felt]) return enTekst(felt, tall(felt));
    const min = tall(`${felt}-min`);
    const maks = rad.tall[`${felt}-maks`] ? tall(`${felt}-maks`) : null;
    if (min.enhet === '°F') {
      if (!maks || maks.verdi === min.verdi) return enTekst(`${felt}-min`, min);
      return erForskjell(felt) ? `${min.verdi} to ${maks.verdi}°F` : `${tempTekst(min.verdi)} to ${tempTekst(maks.verdi)}`;
    }
    if (!maks || maks.verdi === min.verdi) return `${min.verdi} ${enhet(min.enhet, min.verdi)}`;
    return `${min.verdi} to ${maks.verdi} ${enhet(maks.enhet, maks.verdi)}`;
  };
  /** «USDA FSIS (2025)», og kilden noteres. */
  const k = (id) => {
    const kilde = data.kilder[id];
    if (!kilde) throw new Error(`${rad.id}: kilden «${id}» finnes ikke i datafila`);
    brukt.add(id);
    return `${kort(kilde)} (${kilde.aar})`;
  };
  /** Tallet er brukt (kilden noteres), men teksten skrives av siden selv. */
  const bruk = (...felt) => { felt.forEach(tall); return ''; };
  /** Utsagn uten tall: sitatet står i radens `tekst`; her noteres kilden og det sjekkes at utsagnet finnes. */
  const u = (nokkel) => {
    if (!rad.tekst?.[nokkel]) throw new Error(`${rad.id}: utsagnet «${nokkel}» finnes ikke i datafila`);
    brukt.add(nokkel.split(':')[0]);
    return '';
  };
  return { t, k, bruk, u, esc, p, tabell, brukt };
}

function kildeliste(data, brukt) {
  const rekkefolge = Object.keys(data.kilder);
  const ider = [...brukt].sort((a, b) => rekkefolge.indexOf(a) - rekkefolge.indexOf(b));
  return `<ol class="kilder" id="kilder">${ider.map((id) => {
    const k = data.kilder[id];
    return `<li>${esc(k.utgiver)}: <a href="${esc(k.adresse)}" rel="noopener">${esc(k.navn)}</a> (${k.aar}). Read ${engelskDato(k.hentet)}.</li>`;
  }).join('')}</ol>`;
}

/** Tabell: kolonner er overskriftene, rader er arrays av ferdig HTML (første celle er radoverskrift). */
export function tabell(tittel, kolonner, rader) {
  return `<div class="table-wrap" tabindex="0" role="region" aria-label="${esc(tittel)}"><table class="sprik"><thead><tr>${kolonner.map((x) => `<th scope="col">${esc(x)}</th>`).join('')}</tr></thead><tbody>${rader.map(([forst, ...celler]) => `<tr><th scope="row">${forst}</th>${celler.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

/** FAQPage med svarene som ren tekst: testene krever at synlig FAQ (uten tagger) er lik JSON-LD. */
const faqSkjema = (faq) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/gu, '').trim() } })),
});

// Appen på sidene. Overskriftene er valgt så app-bevis.mjs legger skjermbilder under dem (plan og cook mode), og ingen andre overskrifter treffer regelene.
const APP = (tekst) => [
  ['Put dinner on the weekly menu', `${p(esc(tekst))}${p('Matlyst saves recipes from the web, puts them on the days of the weekly menu, and builds one shopping list from them.')}`],
  ['Cook with step-by-step timers', p('Cook mode in Matlyst shows the steps as a checklist and suggests timers. The times on this page are a place to start, not a replacement for your recipe.')],
];

const SKJELETT = { stegTittel: 'How to read the times', forst: '', alternativ: '', grense: '', seksjoner: [], cta: 'Plan your dinners in Matlyst', steg: [['Pick a source', 'Every time has a source and a year, side by side where the sources disagree.']] };
const brodsmule = (...ledd) => brodsmuler([{ navn: 'Home', adresse: '/en/' }, { navn: 'Air fryer', adresse: ROT }, ...ledd]);

function relatert(egenSti, ekstra = []) {
  const lenker = [...ekstra, [ROT, 'Air fryer times and temperatures for common foods'], [`${ROT}oven-to-air-fryer/`, 'Oven to air fryer: how to convert temperature and time'], ['/en/blog/oven-to-air-fryer/', 'How to convert an oven recipe to an air fryer']];
  const sett = new Set();
  const unike = lenker.filter(([href]) => (sett.has(href) || href === egenSti ? false : sett.add(href)));
  return `<div class="related"><h2>Related pages</h2><ul>${unike.map(([href, tekst]) => `<li><a href="${href}">${esc(tekst)}</a></li>`).join('')}</ul></div>`;
}

const kildeAvsnitt = (data, brukt) => ['Sources', `${p('Every number on this page comes from these sources. The quote behind each number is stored in the data file the page is built from, and it is checked against the source.')}${kildeliste(data, brukt)}`];

export function sideForRad(rad, data) {
  const h = hjelpere(rad, data);
  const lag = TEKST[rad.id];
  if (!lag) throw new Error(`${rad.id}: mangler tekst i tekst-en.mjs`);
  const s = lag(h, rad);
  const adresse = sti(rad);
  const eyebrow = `<a href="${ROT}">Air fryer</a><span aria-hidden="true"> › </span>${esc(rad.navn)}`;
  const seksjoner = s.seksjoner ? [...s.seksjoner, ...(s.app ? APP(s.app) : [])] : [
    [s.tabell.tittel, `${p(s.tabell.intro)}${tabell(s.tabell.tittel, s.tabell.kolonner, s.tabell.rader)}${p(...(s.tabell.etter ?? []))}`],
    ...(s.avsnitt ?? []),
    ...(s.kjerne ? [s.kjerne] : []),
    ...APP(s.app),
  ];
  const rik = byggRik({ lang: 'en', svarTekst: s.svar, seksjoner: [...seksjoner, kildeAvsnitt(data, h.brukt)] }).html;
  return {
    title: s.title, description: s.description, eyebrow, h1: s.h1, lead: s.lead,
    ...SKJELETT, rik: `${rik}\n${relatert(adresse, s.les ?? [])}`,
    faqTittel: s.faqTittel ?? `Questions about air fryer ${s.ord ?? rad.navn.toLowerCase()}`, faq: s.faq,
    publisert: rad.oppdatert,
    schemas: [
      brodsmule({ navn: rad.navn, adresse }),
      artikkel({ tittel: s.h1, beskrivelse: s.description, adresse, sprak: 'en', publisert: rad.oppdatert, kilder: [...h.brukt].map((id) => data.kilder[id]) }),
      faqSkjema(s.faq),
    ],
  };
}

export function navSide(data, rader) {
  const brukt = new Set();
  const h = (rad) => hjelpere(rad, data, brukt);
  const s = NAV({ data, rader, h, sti, tabell, p, esc });
  const publisert = rader.map((r) => r.oppdatert).sort().at(-1);
  const rik = byggRik({ lang: 'en', svarTekst: s.svar, seksjoner: [...s.seksjoner, ...APP(s.app), kildeAvsnitt(data, brukt)] }).html;
  const navn = (r) => TEKST[r.id](hjelpere(r, data), r).h1;
  const alle = `<div class="related"><h2>All air fryer pages</h2><ul>${rader.map((r) => `<li><a href="${sti(r)}">${esc(navn(r))}</a></li>`).join('')}</ul></div>`;
  return {
    title: s.title, description: s.description, eyebrow: 'Air fryer', h1: s.h1, lead: s.lead,
    ...SKJELETT, stegTittel: 'How to use this page', steg: [['Pick a food', 'Each food has a page with times and temperatures from named sources.'], ['Convert from the oven', 'The converter gives air fryer settings from an oven recipe.']],
    rik: `${rik}\n${alle}`,
    faqTittel: s.faqTittel, faq: s.faq, publisert,
    schemas: [
      brodsmule(),
      artikkel({ tittel: s.h1, beskrivelse: s.description, adresse: ROT, sprak: 'en', publisert, kilder: [...brukt].map((id) => data.kilder[id]) }),
      elementliste({ navn: s.h1, adresse: ROT, elementer: rader.map((r) => ({ navn: navn(r), adresse: sti(r) })) }),
      faqSkjema(s.faq),
    ],
  };
}

const kildeTall = (k) => [String(k.aar), ...engelskDato(k.hentet).match(/\d+/gu)];

/** Tallene DEN siden kan bruke: radens egne tall, Celsius regnet fra °F, og år og lesedato for kildene. Omregningssiden har i tillegg eksempelrader regnet med KitchenAids regel. */
export function tillatteTall(rad, data) {
  const s = new Set();
  for (const [felt, x] of Object.entries(rad.tall)) {
    s.add(String(x.verdi));
    if (x.enhet === '°F' && !erForskjell(felt)) s.add(String(celsius(x.verdi)));
  }
  for (const k of Object.values(data.kilder)) kildeTall(k).forEach((n) => s.add(n));
  if (rad.id === 'ovn-til-airfryer') for (const n of OVN_TABELL(rad).tall) s.add(String(n));
  return s;
}
/** Samlesiden: alle publiserbare raders tall, antallet sider og kildenes år og datoer. */
export function tillatteTallNav(data) {
  const alle = publiserbare(data);
  const s = new Set([String(alle.length)]);
  for (const r of alle) for (const n of tillatteTall(r, data)) s.add(n);
  return s;
}
export const maskeNavn = (rad) => [rad.navn, rad.navn.toLowerCase()];
export { kontrollerRegel };

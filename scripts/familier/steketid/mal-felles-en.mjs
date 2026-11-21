// Felles mal for familiene «kjernetemperatur» (internal temperature) og «steketid» (cooking times) på amerikansk engelsk (en-US).
// Speiler mal-felles.mjs (nb), men tallene er IKKE oversatt fra norsk: de står i data.en.json med sitat fra amerikanske kilder
// (USDA FSIS, FoodSafety.gov, land-grant extension). Prosaen i tekst-en.mjs skriver aldri et tall selv: den henter dem med t(felt),
// og t() noterer kilden, så kildelista på siden er nøyaktig de kildene siden bruker. Setninger fra kilden hentes med s(id) (radens `tekst`).
// Fahrenheit først med Celsius i parentes (regnet fra °F og avrundet), pounds først. Ingen forfatterlinje og ingen Person-forfatter.
import { publiserbare } from '../felles.mjs';
import { artikkel, brodsmuler, elementliste } from '../skjema.mjs';
import { kalkSkjelett } from '../../kalk-kort.mjs';

export const esc = (s) => String(s).replace(/&/gu, '&amp;').replace(/</gu, '&lt;').replace(/>/gu, '&gt;').replace(/"/gu, '&quot;');
const MAANEDER = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const engelskDato = (iso) => { const [a, m, d] = iso.split('-').map(Number); return `${MAANEDER[m - 1]} ${d}, ${a}`; };
const KORT = { 'FoodSafety.gov': 'FoodSafety.gov', USDA: 'USDA FSIS', Oregon: 'Oregon State Extension' };
const kort = (k) => Object.entries(KORT).find(([start]) => k.utgiver.startsWith(start))?.[1] ?? k.utgiver;
export const celsius = (f) => Math.round(((f - 32) * 5) / 9);
const BROK = { 0.25: '1/4', 0.5: '1/2', 0.75: '3/4' };
/** 2.25 gir «2 1/4», 0.75 gir «3/4», 3 gir «3». */
export const tallTekst = (n) => {
  const a = Math.abs(n); const hel = Math.floor(a); const f = Number((a - hel).toFixed(4));
  if (f === 0) return String(hel);
  const b = BROK[f];
  if (!b) return String(a);
  return hel ? `${hel} ${b}` : b;
};
const ENHET = {
  minutes: ['minute', 'minutes'], hours: ['hour', 'hours'], days: ['day', 'days'], weeks: ['week', 'weeks'], seconds: ['second', 'seconds'], pounds: ['pound', 'pounds'], ounces: ['ounce', 'ounces'],
  inches: ['inch', 'inches'], percent: ['percent', 'percent'], 'min/lb': ['minute per pound', 'minutes per pound'], 'min/side': ['minute per side', 'minutes per side'], briquettes: ['briquette', 'briquettes'],
};
const enhetTekst = (enhet, verdi) => { const e = ENHET[enhet]; if (!e) throw new Error(`ukjent enhet ${enhet}`); return verdi <= 1 ? e[0] : e[1]; };
const tempEn = (f) => `${f}°F (${celsius(f)}°C)`;

/** Hjelperne en side skrives med. `brukt` samler kildene siden faktisk bruker. */
export function hjelpere(rad, data, brukt = new Set()) {
  const tall = (felt) => {
    const x = rad.tall[felt];
    if (!x) throw new Error(`${rad.id}: tallet «${felt}» finnes ikke i datafila`);
    brukt.add(x.kilde);
    return x;
  };
  /** «145°F (63°C)», «20 to 25 minutes per pound», «2 3/4 to 3 hours», «3/4 to 1 pound». Felt uten -min/-maks er ett tall. */
  const t = (felt, { ca = false } = {}) => {
    const forst = ca ? 'about ' : '';
    if (rad.tall[felt]) {
      const x = tall(felt);
      return x.enhet === '°F' ? `${forst}${tempEn(x.verdi)}` : `${forst}${tallTekst(x.verdi)} ${enhetTekst(x.enhet, x.verdi)}`;
    }
    const min = tall(`${felt}-min`);
    const maks = rad.tall[`${felt}-maks`] ? tall(`${felt}-maks`) : null;
    if (!maks || maks.verdi === min.verdi) return min.enhet === '°F' ? tempEn(min.verdi) : `${forst}${tallTekst(min.verdi)} ${enhetTekst(min.enhet, min.verdi)}`;
    if (min.enhet === '°F') return `${tempEn(min.verdi)} to ${tempEn(maks.verdi)}`;
    return `${forst}${tallTekst(min.verdi)} to ${tallTekst(maks.verdi)} ${enhetTekst(maks.enhet, maks.verdi)}`;
  };
  /** Bare tallet uten enhet («2 3/4»), til setninger som «from 8 to 12 pounds». */
  const n = (felt) => tallTekst(tall(felt).verdi);
  /** «USDA FSIS (2024)», og kilden noteres. */
  const k = (id) => {
    const kilde = data.kilder[id];
    if (!kilde) throw new Error(`${rad.id}: kilden «${id}» finnes ikke i datafila`);
    brukt.add(id);
    return `${kort(kilde)} (${kilde.aar})`;
  };
  /** Som k, men til bruk inne i en parentes: «USDA FSIS, 2024». */
  const kp = (id) => k(id).replace(/ \((\d{4})\)$/u, ', $1');
  /** En setning fra kilden, ordrett, med kilde: “…” (USDA FSIS, 2024). Kontrolleres mot kildesiden. */
  const s = (id) => {
    const verdi = rad.tekst?.[id];
    if (!verdi) throw new Error(`${rad.id}: sitatet «${id}» finnes ikke i datafila`);
    const [kilde, ...rest] = verdi.split('|');
    return `“${esc(rest.join('|').trim())}” (${kp(kilde)})`;
  };
  /** Kildelinje under en tabell. */
  const note = (id) => `<p><small>Source: ${k(id)}, “${esc(data.kilder[id].navn)}”. Read ${engelskDato(data.kilder[id].hentet)}.</small></p>`;
  return { t, n, k, kp, s, note, brukt };
}

function kildeliste(data, brukt) {
  const rekkefolge = Object.keys(data.kilder);
  const ider = [...brukt].sort((a, b) => rekkefolge.indexOf(a) - rekkefolge.indexOf(b));
  return `<h2>Sources</h2>\n<ol class="kilder" id="kilder">${ider.map((id) => {
    const k = data.kilder[id];
    return `<li>${esc(k.utgiver)}: <a href="${esc(k.adresse)}" rel="noopener">${esc(k.navn)}</a> (${k.aar}). Read ${engelskDato(k.hentet)}.</li>`;
  }).join('')}</ol>`;
}

/** Tabellen: kolonner er overskriftene, rader er [etikett, ...celler] der en celle er et felt, { felt, ca }, { tekst }, { html } eller null. */
export function tabell(h, { tittel, kolonner, rader }) {
  const celle = (c) => {
    if (c == null) return '<td>Not listed</td>';
    if (typeof c === 'string') return `<td>${h.t(c)}</td>`;
    if (c.html) return `<td>${c.html}</td>`;
    if (c.tekst) return `<td>${esc(c.tekst)}</td>`;
    return `<td>${h.t(c.felt, { ca: c.ca })}</td>`;
  };
  return `<div class="table-wrap" tabindex="0" role="region" aria-label="${esc(tittel)}"><table class="sprik"><thead><tr>${kolonner.map((x) => `<th scope="col">${esc(x)}</th>`).join('')}</tr></thead><tbody>${rader.map(([e, ...celler]) => `<tr><td>${esc(e)}</td>${celler.map(celle).join('')}</tr>`).join('')}</tbody></table></div>`;
}

/** FAQPage med svarene som ren tekst: synlig FAQ (uten tagger) må være lik JSON-LD. */
const faqSkjema = (faq) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/gu, '').trim() } })),
});

export const p = (liste) => liste.filter(Boolean).map((x) => `<p>${x}</p>`).join('');
export const liste = (punkter) => `<ul>${punkter.map((x) => `<li>${x}</li>`).join('')}</ul>`;
const kildeTall = (k) => [String(k.aar), ...engelskDato(k.hentet).match(/\d+/gu)];
const tallI = (tekst) => String(tekst ?? '').match(/\d+(?:\.\d+)?/gu) ?? [];

/**
 * Vekt-til-tid-kalkulatoren: slår opp vekten i tabellbånd (FSIS oppgir tider per vektgruppe, ikke per pound), så den bruker ikke
 * de affine enhetene til kalkulatorkortet. Kortet er `data-kalk="band"` og site.js leser bandene fra skjemaets data.
 * sett: [{ navn, enhet: [entall, flertall], band: [[vektFra, vektTil, tidFra, tidTil]] }]. Bandene skrives som {a, b, c, d} i skjemaets data:
 * kommaskilte tall i JSON leses som ett tall av tallvakten (12,2 er et desimaltall), så hvert tall får sin egen nøkkel.
 */
export function kalkBand({ sett, ariaLabel, vektEtikett, eksempel, vareEtikett, feil }) {
  const frac = tallTekst;
  const tid = (sett0, lo, hi) => `${frac(lo)}${hi !== lo ? ` to ${frac(hi)}` : ''} ${hi <= 1 ? sett0.enhet[0] : sett0.enhet[1]}`;
  const s0 = sett[0];
  const treff = s0.band.filter(([a, b]) => eksempel >= a && eksempel <= b);
  const lo = Math.min(...treff.map((b) => b[2])); const hi = Math.max(...treff.map((b) => b[3]));
  const svar = `${frac(lo)}${hi !== lo ? ` to ${frac(hi)}` : ''}`;
  const alle = sett.flatMap((x) => x.band);
  const hurtig = [...new Set(alle.flatMap(([a, b]) => [a, b]))].sort((x, y) => x - y).slice(0, 5).map(String);
  const html = kalkSkjelett({
    etiketter: { aria: ariaLabel, mengde: vektEtikett, fra: 'From', til: 'To', bytt: 'Swap', vanlige: 'Common weights' },
    enheter: [['lb', 'pounds']],
    fra: 'lb', til: 'tid',
    data: { band: sett.map((x) => ({ navn: x.navn, enhet: x.enhet, band: x.band.map(([a, b, c, d]) => ({ a, b, c, d })) })), t: { feil, til: 'to', to: 'two rows apply,', og: 'and', lb: ['pound', 'pounds'] } },
    start: { mengde: String(eksempel), svar, setning: `${eksempel} pounds, ${s0.navn.toLowerCase()}: ${tid(s0, lo, hi)}`, hurtig: hurtig.map((v) => [v, `${v} lb`]) },
    type: 'band',
    vareHtml: `<div class="kalkvare"><label class="kalkenhet"><span class="skjult">${esc(vareEtikett)}</span><select data-felt="vare">${sett.map((x) => `<option>${esc(x.navn)}</option>`).join('')}</select></label></div>`,
  });
  return html
    .replace(/(<select data-felt="til">)[\s\S]*?(<\/select>)/u, `$1<option value="tid" selected>${esc(s0.enhet[1])}</option>$2`)
    .replace('<button type="button" class="bytt"', '<button type="button" class="bytt" tabindex="-1" aria-hidden="true"');
}

/**
 * cfg: { rot, eyebrowNavn, alleTekst, cta, app: [h2, p][], TEKST, nav, kalk?(rad, h), ekstraTall?(rad) }.
 * TEKST[radId](h, hjelp) gir { title, h1, description, lead, ord?, blokker: [[tittel, html]], faq, faqTittel?, soster?, andre?, kalk? }.
 */
export function lagMal(cfg) {
  const sti = (rad) => `${cfg.rot}${rad.slug}/`;
  const eyebrowVare = `<a href="${cfg.rot}">${esc(cfg.eyebrowNavn)}</a>`;
  const APP = cfg.app.map(([h2, tekst]) => `<h2>${esc(h2)}</h2><p>${esc(tekst)}</p>`).join('\n');
  const SKJELETT = { stegTittel: 'How to read the table', forst: '', alternativ: '', grense: '', seksjoner: [], cta: cfg.cta, steg: [['Find your food', 'The numbers are in the table, with a source.']] };
  const brodsmule = (...ledd) => brodsmuler([{ navn: 'Home', adresse: '/en/' }, { navn: cfg.eyebrowNavn, adresse: cfg.rot }, ...ledd]);

  function sideForRad(rad, data) {
    const h = hjelpere(rad, data);
    const tekst = cfg.TEKST[rad.id];
    if (!tekst) throw new Error(`${rad.id}: mangler tekst i tekst-en.mjs`);
    const s = tekst(h, { tabell: (x) => tabell(h, x), p, liste, esc });
    const kalkHtml = s.kalk && cfg.kalk ? cfg.kalk(rad, h) : '';
    const lenker = [...(s.soster ? [s.soster] : []), ...(s.andre ?? []), [cfg.rot, cfg.alleTekst]];
    const rik = [
      ...s.blokker.map(([tittel, html]) => `<h2>${esc(tittel)}</h2>${html.replace('@@KALK@@', kalkHtml)}`),
      APP,
      `<div class="related"><h2>Related pages</h2><ul>${lenker.map(([href, t]) => `<li><a href="${href}">${esc(t)}</a></li>`).join('')}</ul></div>`,
    ];
    const adresse = sti(rad);
    return {
      title: s.title, description: s.description, eyebrow: eyebrowVare, h1: s.h1, lead: s.lead,
      ...SKJELETT, rik: [...rik, kildeliste(data, h.brukt)].join('\n'),
      faqTittel: s.faqTittel ?? `Questions about ${s.ord ?? rad.navn.toLowerCase()}`, faq: s.faq,
      publisert: rad.oppdatert,
      schemas: [
        brodsmule({ navn: rad.navn, adresse }),
        artikkel({ tittel: s.h1, beskrivelse: s.description, adresse, sprak: 'en', publisert: rad.oppdatert, kilder: [...h.brukt].map((id) => data.kilder[id]) }),
        faqSkjema(s.faq),
      ],
    };
  }

  function navSide(data, rader) {
    const brukt = new Set();
    const s = cfg.nav({ data, rader, sti, h: (rad) => hjelpere(rad, data, brukt), tabell, p, liste, esc, brukt });
    const publisert = rader.map((r) => r.oppdatert).sort().at(-1);
    return {
      title: s.title, description: s.description, eyebrow: esc(cfg.eyebrowNavn), h1: s.h1, lead: s.lead,
      ...SKJELETT, rik: [s.rik, APP, kildeliste(data, brukt)].join('\n'),
      faqTittel: s.faqTittel, faq: s.faq, publisert,
      schemas: [
        brodsmule(),
        artikkel({ tittel: s.h1, beskrivelse: s.description, adresse: cfg.rot, sprak: 'en', publisert, kilder: [...brukt].map((id) => data.kilder[id]) }),
        elementliste({ navn: s.h1, adresse: cfg.rot, elementer: rader.map((r) => ({ navn: r.navn, adresse: sti(r) })) }),
        faqSkjema(s.faq),
      ],
    };
  }

  /** Tallene DEN siden kan bruke: radens egne tall (også hele deler og brøker), Celsius regnet fra °F, tall i radens sitater, og år og lesedato for kildene. */
  function tillatteTall(rad, data) {
    const s = new Set(['1/4', '1/2', '3/4']);
    for (const x of Object.values(rad.tall)) {
      s.add(String(Math.abs(x.verdi)));
      s.add(String(Math.floor(Math.abs(x.verdi))));
      if (x.enhet === '°F') s.add(String(celsius(x.verdi)));
    }
    for (const q of Object.values(rad.tekst ?? {})) tallI(q.split('|').slice(1).join('|')).forEach((x) => s.add(x));
    for (const x of cfg.ekstraTall?.(rad) ?? []) s.add(x);
    for (const k of Object.values(data.kilder)) kildeTall(k).forEach((x) => s.add(x));
    return s;
  }
  /** Samlesiden: alle publiserbare raders tall, antallet sider og kildenes år og datoer. */
  function tillatteTallNav(data) {
    const alle = publiserbare(data);
    const s = new Set([String(alle.length)]);
    for (const r of alle) for (const x of tillatteTall(r, data)) s.add(x);
    return s;
  }
  const maskeNavn = (rad) => [rad.navn, rad.navn.toLowerCase()];
  return { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn, sti };
}

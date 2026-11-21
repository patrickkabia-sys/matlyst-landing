// Felles mal for familiene «holdbarhet» (fridge) og «frysing» (freezer), amerikansk engelsk (en-US). Speiler kjoling.mjs (nb), men
// tallene er IKKE oversatt fra norsk: de står i data.en.json med sitat fra amerikanske kilder (FoodSafety.gov, USDA FSIS, FDA).
// Prosaen i tekst-en.mjs skriver aldri et tall selv: den henter dem med t(felt), og t() noterer kilden, så kildelista på siden er
// nøyaktig de kildene siden bruker. Fahrenheit først, Celsius i parentes (regnet fra °F, avrundet til heltall).
// Ingen forfatterlinje og ingen Person-forfatter: engelske sider følger /en/tools/cups-to-grams/ (Organization).
import { publiserbare } from '../felles.mjs';
import { artikkel, brodsmuler, elementliste } from '../skjema.mjs';

export const esc = (s) => String(s).replace(/&/gu, '&amp;').replace(/</gu, '&lt;').replace(/>/gu, '&gt;').replace(/"/gu, '&quot;');
const MAANEDER = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const engelskDato = (iso) => { const [a, m, d] = iso.split('-').map(Number); return `${MAANEDER[m - 1]} ${d}, ${a}`; };
const KORT = { 'FoodSafety.gov': 'FoodSafety.gov', USDA: 'USDA FSIS', 'U.S. Food': 'FDA' };
const kort = (k) => Object.entries(KORT).find(([start]) => k.utgiver.startsWith(start))?.[1] ?? k.utgiver;
const celsius = (f) => Math.round(((f - 32) * 5) / 9);
const tallTekst = (n) => String(Math.abs(n));
const enhet = (e, verdi) => (verdi === 1 ? e.replace(/s$/u, '') : e);
const tempTekst = (f) => `${f}°F (${celsius(f) < 0 ? '-' : ''}${Math.abs(celsius(f))}°C)`;

/** Hjelperne en side skrives med. `brukt` samler kildene siden faktisk bruker. */
function hjelpere(rad, data, brukt = new Set()) {
  const tall = (felt) => {
    const x = rad.tall[felt];
    if (!x) throw new Error(`${rad.id}: tallet «${felt}» finnes ikke i datafila`);
    brukt.add(x.kilde);
    return x;
  };
  /** «3 to 4 days», «1 week», «40°F (4°C)». Felt uten -min/-maks er ett tall. */
  const t = (felt) => {
    if (rad.tall[felt]) {
      const x = tall(felt);
      return x.enhet === '°F' ? tempTekst(x.verdi) : `${tallTekst(x.verdi)} ${enhet(x.enhet, x.verdi)}`;
    }
    const min = tall(`${felt}-min`);
    const maks = rad.tall[`${felt}-maks`] ? tall(`${felt}-maks`) : null;
    if (!maks || maks.verdi === min.verdi) return `${tallTekst(min.verdi)} ${enhet(min.enhet, min.verdi)}`;
    return `${tallTekst(min.verdi)} to ${tallTekst(maks.verdi)} ${enhet(maks.enhet, maks.verdi)}`;
  };
  /** «USDA FSIS (2020)», og kilden noteres. */
  const k = (id) => {
    const kilde = data.kilder[id];
    if (!kilde) throw new Error(`${rad.id}: kilden «${id}» finnes ikke i datafila`);
    brukt.add(id);
    return `${kort(kilde)} (${kilde.aar})`;
  };
  /** Som k, men til bruk inne i en parentes: «USDA FSIS, 2020». */
  const kp = (id) => k(id).replace(/ \((\d{4})\)$/u, ', $1');
  return { t, k, kp, brukt };
}

function kildeliste(data, brukt) {
  const rekkefolge = Object.keys(data.kilder);
  const ider = [...brukt].sort((a, b) => rekkefolge.indexOf(a) - rekkefolge.indexOf(b));
  return `<h2>Sources</h2>\n<ol class="kilder" id="kilder">${ider.map((id) => {
    const k = data.kilder[id];
    return `<li>${esc(k.utgiver)}: <a href="${esc(k.adresse)}" rel="noopener">${esc(k.navn)}</a> (${k.aar}). Read ${engelskDato(k.hentet)}.</li>`;
  }).join('')}</ol>`;
}

/** Tabellen: kolonner er overskriftene, rader er [etikett, ...celler] der en celle er et felt, { tekst } eller null (ikke oppgitt). */
function tabell(h, { tittel, kolonner, rader }) {
  const celle = (c) => {
    if (c == null) return '<td>Not listed</td>';
    if (typeof c === 'string') return `<td>${h.t(c)}</td>`;
    return `<td>${esc(c.tekst)}</td>`;
  };
  return `<div class="table-wrap" tabindex="0" role="region" aria-label="${esc(tittel)}"><table class="sprik"><thead><tr>${kolonner.map((x) => `<th scope="col">${esc(x)}</th>`).join('')}</tr></thead><tbody>${rader.map(([etikett, ...celler]) => `<tr><td>${esc(etikett)}</td>${celler.map(celle).join('')}</tr>`).join('')}</tbody></table></div>`;
}

/** FAQPage med svarene som ren tekst: testene krever at synlig FAQ (uten tagger) er lik JSON-LD. */
const faqSkjema = (faq) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/gu, '').trim() } })),
});

const p = (liste) => liste.filter(Boolean).map((x) => `<p>${x}</p>`).join('');
const kildeTall = (k) => [String(k.aar), ...engelskDato(k.hentet).match(/\d+/gu)];

/**
 * cfg: { rot, eyebrowNavn, alleTekst, cta, app: [h2, p][], TEKST, nav }.
 * TEKST[radId](h) gir { title, h1, description, lead, kilder: string[], tabell: { tittel, intro, kolonner, rader, kilde, etter? }, ekstra?: [h2, html][], faq, soster?, andre? }.
 */
export function lagMal(cfg) {
  const sti = (rad) => `${cfg.rot}${rad.slug}/`;
  const eyebrowVare = `<a href="${cfg.rot}">${esc(cfg.eyebrowNavn)}</a>`;
  const APP = cfg.app.map(([h2, tekst]) => `<h2>${esc(h2)}</h2><p>${esc(tekst)}</p>`).join('\n');
  const SKJELETT = { stegTittel: 'How to read the table', forst: '', alternativ: '', grense: '', seksjoner: [], cta: cfg.cta, steg: [['Find your food', 'The times are in the table, with a source.']] };
  const brodsmule = (...ledd) => brodsmuler([{ navn: 'Home', adresse: '/en/' }, { navn: cfg.eyebrowNavn, adresse: cfg.rot }, ...ledd]);

  function sideForRad(rad, data) {
    const h = hjelpere(rad, data);
    const tekst = cfg.TEKST[rad.id];
    if (!tekst) throw new Error(`${rad.id}: mangler tekst i tekst-en.mjs`);
    const s = tekst(h);
    const tb = s.tabell;
    h.k(tb.kilde);
    const lenker = [...(s.soster ? [s.soster] : []), [cfg.rot, cfg.alleTekst], ...(s.andre ?? [])];
    const rik = [
      `<h2>What the federal sources say</h2>${p(s.kilder)}`,
      `<h2>${esc(tb.tittel)}</h2>${p([tb.intro])}${tabell(h, tb)}<p><small>Source: ${h.k(tb.kilde)}, “${esc(data.kilder[tb.kilde].navn)}”. Read ${engelskDato(data.kilder[tb.kilde].hentet)}.</small></p>${p(tb.etter ?? [])}`,
      ...(s.ekstra ?? []).map(([tittel, html]) => `<h2>${esc(tittel)}</h2>${html}`),
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
    const s = cfg.nav({ data, rader, sti, h: (rad) => hjelpere(rad, data, brukt), tabell, p, esc });
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

  /** Tallene DEN siden kan bruke: radens egne tall, Celsius regnet fra °F, og år og lesedato for kildene. */
  function tillatteTall(rad, data) {
    const s = new Set();
    for (const x of Object.values(rad.tall)) {
      s.add(tallTekst(x.verdi));
      if (x.enhet === '°F') s.add(tallTekst(celsius(x.verdi)));
    }
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
  return { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn, sti, hjelpere };
}

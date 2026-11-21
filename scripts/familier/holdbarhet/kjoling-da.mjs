// Felles mal for de danske familierne «holdbarhet» (holdbarhed), «frysing» (kan man fryse) og «kjernetemperatur» (kernetemperatur).
// Speiler kjoling-en.mjs, men tallene er IKKE oversatt fra norsk: de står i data.da.json med sitat fra danske kilder
// (Fødevarestyrelsen først, så Forbrugerrådet Tænk, Madens Verden, Landbrug & Fødevarer, Teknologisk Institut og Arla, alle med årstall).
// Prosaen i tekst-da.mjs skriver aldri et tall selv: den henter dem med t(felt), og t() noterer kilden, så kildelista på siden er
// nøyaktig de kildene siden bruker. Setninger fra kilden hentes ordrett med s(id) (radens `tekst`, «kildeId|sitat»).
// Ingen forfatterlinje og ingen Person-forfatter: danske sider følger /da/vaerktoejer/dl-til-gram/ (Organization).
import { publiserbare } from '../felles.mjs';
import { artikkel, brodsmuler, elementliste } from '../skjema.mjs';

export const esc = (s) => String(s).replace(/&/gu, '&amp;').replace(/</gu, '&lt;').replace(/>/gu, '&gt;').replace(/"/gu, '&quot;');
const MAANEDER = ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'];
export const danskDato = (iso) => { const [a, m, d] = iso.split('-').map(Number); return `${d}. ${MAANEDER[m - 1]} ${a}`; };
const KORT = { 'Landbrug & Fødevarer': 'Landbrug & Fødevarer' };
const kort = (k) => Object.entries(KORT).find(([start]) => k.utgiver.startsWith(start))?.[1] ?? k.utgiver;
const erFodevarestyrelsen = (k) => k.utgiver === 'Fødevarestyrelsen';
const tallTekst = (n) => String(Math.abs(n)).replace('.', ',');
const ENHET_ET = { dage: 'dag', uger: 'uge', måneder: 'måned', timer: 'time', minutter: 'minut' };
const enhetTekst = (enhet, verdi) => {
  if (enhet === '°C') return ' °C';
  if (enhet === '%') return ' %';
  return ` ${verdi === 1 ? (ENHET_ET[enhet] ?? enhet) : enhet}`;
};
/** Sitater skrives med »…«, og teksten står ordrett som hos kilden. */
const sitat = (tekst) => `»${esc(tekst)}«`;

/** Hjelperne en side skrives med. `brukt` samler kildene siden faktisk bruker. */
function hjelpere(rad, data, brukt = new Set()) {
  const tall = (felt) => {
    const x = rad.tall[felt];
    if (!x) throw new Error(`${rad.id}: tallet «${felt}» finnes ikke i datafila`);
    brukt.add(x.kilde);
    return x;
  };
  /** «3-4 dage», «1 uge», «5 °C», «-18 °C». Med ca: «cirka 6 måneder». Felt uten -min/-maks er ett tall. */
  const t = (felt, { ca = false } = {}) => {
    const forst = ca ? 'cirka ' : '';
    if (rad.tall[felt]) {
      const x = tall(felt);
      return `${forst}${x.verdi < 0 ? '-' : ''}${tallTekst(x.verdi)}${enhetTekst(x.enhet, x.verdi)}`;
    }
    const min = tall(`${felt}-min`);
    const maks = rad.tall[`${felt}-maks`] ? tall(`${felt}-maks`) : null;
    if (!maks || maks.verdi === min.verdi) return `${forst}${tallTekst(min.verdi)}${enhetTekst(min.enhet, min.verdi)}`;
    return `${forst}${tallTekst(min.verdi)}-${tallTekst(maks.verdi)}${enhetTekst(maks.enhet, maks.verdi)}`;
  };
  /** Bare tallet eller tallene uten enhet, til setninger der enheten står til slutt. */
  const n = (felt) => {
    if (rad.tall[felt]) return tallTekst(tall(felt).verdi);
    const min = tall(`${felt}-min`);
    const maks = rad.tall[`${felt}-maks`] ? tall(`${felt}-maks`) : null;
    return !maks || maks.verdi === min.verdi ? tallTekst(min.verdi) : `${tallTekst(min.verdi)}-${tallTekst(maks.verdi)}`;
  };
  /** «Fødevarestyrelsen (2026)», og kilden noteres. */
  const k = (id) => {
    const kilde = data.kilder[id];
    if (!kilde) throw new Error(`${rad.id}: kilden «${id}» finnes ikke i datafila`);
    brukt.add(id);
    return `${kort(kilde)} (${kilde.aar})`;
  };
  /** Som k, men til bruk inne i en parentes: «Fødevarestyrelsen, 2026». */
  const kp = (id) => k(id).replace(/ \((\d{4})\)$/u, ', $1');
  /** En setning fra kilden, ordrett: »…« (Fødevarestyrelsen, 2026). Med { med: false} utelates kilden når setningen selv nevner den. Kontrolleres mod kildesiden. */
  const s = (id, { med = true } = {}) => {
    const verdi = rad.tekst?.[id];
    if (!verdi) throw new Error(`${rad.id}: sitatet «${id}» finnes ikke i datafila`);
    const [kilde, ...rest] = verdi.split('|');
    const kk = kp(kilde);
    return med ? `${sitat(rest.join('|'))} (${kk})` : sitat(rest.join('|'));
  };
  return { t, n, k, kp, s, brukt };
}

function kildeliste(data, brukt) {
  const rekkefolge = Object.keys(data.kilder);
  const ider = [...brukt].sort((a, b) => Number(erFodevarestyrelsen(data.kilder[b])) - Number(erFodevarestyrelsen(data.kilder[a])) || rekkefolge.indexOf(a) - rekkefolge.indexOf(b));
  return `<h2>Kilder</h2>\n<ol class="kilder" id="kilder">${ider.map((id) => {
    const k = data.kilder[id];
    return `<li>${esc(k.utgiver)}: <a href="${esc(k.adresse)}" rel="noopener">${esc(k.navn)}</a> (${k.aar}). Læst ${danskDato(k.hentet)}.</li>`;
  }).join('')}</ol>`;
}

/** Tabellen: kolonner er overskriftene, rader er [etikett, ...celler] der en celle er et felt, { felt, ca }, { tekst } eller null (ikke oppgitt). */
function tabell(h, { tittel, kolonner, rader }) {
  const celle = (c) => {
    if (c == null) return '<td>Ikke oplyst</td>';
    if (typeof c === 'string') return `<td>${h.t(c)}</td>`;
    if (c.tekst) return `<td>${esc(c.tekst)}</td>`;
    return `<td>${h.t(c.felt, { ca: c.ca })}</td>`;
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
const kildeTall = (k) => [String(k.aar), ...danskDato(k.hentet).match(/\d+/gu)];

/**
 * cfg: { rot, eyebrowNavn, alleTekst, cta, app: [h2, p][], kilderTitel, tabelTitel, TEKST, nav }.
 * TEKST[radId](h) gir { title, h1, description, lead, kilder: string[], tabell: { tittel, intro, kolonner, rader, kilde, etter? }, ekstra?: [h2, html][], faq, soster?, andre? }.
 * h har t, n, k, kp, s og tabell(x), p(liste) og esc.
 */
export function lagMal(cfg) {
  const sti = (rad) => `${cfg.rot}${rad.slug}/`;
  const eyebrowVare = `<a href="${cfg.rot}">${esc(cfg.eyebrowNavn)}</a>`;
  const APP = cfg.app.map(([h2, tekst]) => `<h2>${esc(h2)}</h2><p>${esc(tekst)}</p>`).join('\n');
  const SKJELETT = { stegTittel: 'Læs tabellen', forst: '', alternativ: '', grense: '', seksjoner: [], cta: cfg.cta, steg: [['Find varen', 'Tallene står i tabellen, med kilde.']] };
  const brodsmule = (...ledd) => brodsmuler([{ navn: 'Forside', adresse: '/da/' }, { navn: cfg.eyebrowNavn, adresse: cfg.rot }, ...ledd]);

  function sideForRad(rad, data) {
    const h = hjelpere(rad, data);
    const tekst = cfg.TEKST[rad.id];
    if (!tekst) throw new Error(`${rad.id}: mangler tekst i tekst-da.mjs`);
    const s = tekst({ ...h, tabell: (x) => tabell(h, x), p, esc });
    const tb = s.tabell;
    h.k(tb.kilde);
    const lenker = [...(s.soster ? [s.soster] : []), [cfg.rot, cfg.alleTekst], ...(s.andre ?? [])];
    const rik = [
      `<h2>${esc(cfg.kilderTitel)}</h2>${p(s.kilder)}`,
      `<h2>${esc(tb.tittel)}</h2>${p([tb.intro])}${tabell(h, tb)}<p><small>Kilde: ${h.k(tb.kilde)}, »${esc(data.kilder[tb.kilde].navn)}«. Læst ${danskDato(data.kilder[tb.kilde].hentet)}.</small></p>${p(tb.etter ?? [])}`,
      ...(s.ekstra ?? []).map(([tittel, html]) => `<h2>${esc(tittel)}</h2>${html}`),
      APP,
      `<div class="related"><h2>Læs også</h2><ul>${lenker.map(([href, t]) => `<li><a href="${href}">${esc(t)}</a></li>`).join('')}</ul></div>`,
    ];
    const adresse = sti(rad);
    return {
      title: s.title, description: s.description, eyebrow: eyebrowVare, h1: s.h1, lead: s.lead,
      ...SKJELETT, rik: [...rik, kildeliste(data, h.brukt)].join('\n'),
      faqTittel: s.faqTittel ?? `Spørgsmål om ${s.ord ?? rad.navn.toLowerCase()}`, faq: s.faq,
      publisert: rad.oppdatert,
      schemas: [
        brodsmule({ navn: rad.navn, adresse }),
        artikkel({ tittel: s.h1, beskrivelse: s.description, adresse, sprak: 'da', publisert: rad.oppdatert, kilder: [...h.brukt].map((id) => data.kilder[id]) }),
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
        artikkel({ tittel: s.h1, beskrivelse: s.description, adresse: cfg.rot, sprak: 'da', publisert, kilder: [...brukt].map((id) => data.kilder[id]) }),
        elementliste({ navn: s.h1, adresse: cfg.rot, elementer: rader.map((r) => ({ navn: r.navn, adresse: sti(r) })) }),
        faqSkjema(s.faq),
      ],
    };
  }

  /** Tallene DEN siden kan bruke: radens egne tall (uden fortegn) og år og læsedato for kilderne. */
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
  return { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn, sti, hjelpere };
}

// Felles mal for familiene «holdbarhet» (hallbarhet), «frysing» (frysa) og «kjernetemperatur» (innertemperatur) på svensk.
// Speiler holdbarhet/kjoling-en.mjs, men tallene er IKKE oversatt: de står i data.sv.json med sitat fra svenske kilder
// (Livsmedelsverket først, så Svenskt Kött og Svensk Fågel). Setninger fra kilden hentes med s(id) (radens `tekst`, «kildeId|sitat»).
// Prosaen i tekst-sv.mjs skriver aldri et tall selv: den henter dem med t(felt), og t() og s() noterer kilden,
// så kildelista på siden er nøyaktig de kildene siden bruker. Sitatene kontrolleres av holdbarhet/kildekontroll.mjs.
// Forfatterlinje: ingen (Organization, som /sv/verktyg/dl-till-gram/). Se test/familier-sv.test.mjs.
import { publiserbare } from './felles.mjs';
import { artikkel, brodsmuler, elementliste } from './skjema.mjs';

export const esc = (s) => String(s).replace(/&/gu, '&amp;').replace(/</gu, '&lt;').replace(/>/gu, '&gt;').replace(/"/gu, '&quot;');
const MAANEDER = ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'];
export const svenskDato = (iso) => { const [a, m, d] = iso.split('-').map(Number); return `${d} ${MAANEDER[m - 1]} ${a}`; };
const KORT = { Livsmedelsverket: 'Livsmedelsverket', 'Svenskt Kött': 'Svenskt Kött', 'Svensk Fågel': 'Svensk Fågel' };
const kort = (k) => KORT[k.utgiver] ?? k.utgiver;
const erLivsmedelsverket = (k) => k.utgiver === 'Livsmedelsverket';
const tallTekst = (n) => String(Math.abs(n)).replace('.', ',');
const ETT = { dagar: 'dag', veckor: 'vecka', timmar: 'timme', månader: 'månad', minuter: 'minut', grader: 'grad', gånger: 'gång' };
const enhet = (e, verdi) => (verdi === 1 ? (ETT[e] ?? e) : e);
const mellanrum = (e) => (e === '°C' ? ' °C' : ` ${e}`);
const kildeTall = (k) => [String(k.aar), ...svenskDato(k.hentet).match(/\d+/gu)];
const tallIText = (tekst) => String(tekst ?? '').match(/\d+(?:[.,]\d+)?/gu) ?? [];

/** Hjelperne en side skrives med. `brukt` samler kildene siden faktisk bruker. */
export function hjelpere(rad, data, brukt = new Set()) {
  const tall = (felt) => {
    const x = rad.tall[felt];
    if (!x) throw new Error(`${rad.id}: tallet «${felt}» finnes ikke i datafila`);
    brukt.add(x.kilde);
    return x;
  };
  const verdiTekst = (x) => `${x.verdi < 0 ? '-' : ''}${tallTekst(x.verdi)}`;
  /** «3 till 4 dagar», «1 vecka», «-18 °C». Felt uten -min/-maks er ett tall. */
  const t = (felt) => {
    if (rad.tall[felt]) {
      const x = tall(felt);
      return `${verdiTekst(x)}${mellanrum(enhet(x.enhet, x.verdi))}`;
    }
    const min = tall(`${felt}-min`);
    const maks = rad.tall[`${felt}-maks`] ? tall(`${felt}-maks`) : null;
    if (!maks || maks.verdi === min.verdi) return `${verdiTekst(min)}${mellanrum(enhet(min.enhet, min.verdi))}`;
    return `${verdiTekst(min)} till ${verdiTekst(maks)}${mellanrum(enhet(maks.enhet, maks.verdi))}`;
  };
  /** Bare tallet uten enhet, til setninger der enheten står til slutt. */
  const n = (felt) => verdiTekst(tall(felt));
  /** «Livsmedelsverket (2026)», og kilden noteres. */
  const k = (id) => {
    const kilde = data.kilder[id];
    if (!kilde) throw new Error(`${rad.id}: kilden «${id}» finnes ikke i datafila`);
    brukt.add(id);
    return `${kort(kilde)} (${kilde.aar})`;
  };
  /** Som k, men til bruk inne i en parentes: «Livsmedelsverket, 2026». */
  const kp = (id) => k(id).replace(/ \((\d{4})\)$/u, ', $1');
  /** En setning fra kilden, ordrett, med kilde: ”…” (Livsmedelsverket, 2026). Kontrolleres mot kildesiden. */
  const s = (id) => {
    const verdi = rad.tekst?.[id];
    if (!verdi) throw new Error(`${rad.id}: sitatet «${id}» finnes ikke i datafila`);
    const [kilde, ...rest] = verdi.split('|');
    return `”${esc(rest.join('|'))}” (${kp(kilde)})`;
  };
  return { t, n, k, kp, s, brukt };
}

function kildeliste(data, brukt) {
  const rekkefolge = Object.keys(data.kilder);
  const ider = [...brukt].sort((a, b) => (Number(erLivsmedelsverket(data.kilder[b])) - Number(erLivsmedelsverket(data.kilder[a]))) || (rekkefolge.indexOf(a) - rekkefolge.indexOf(b)));
  return `<h2>Källor</h2>\n<ol class="kilder" id="kilder">${ider.map((id) => {
    const k = data.kilder[id];
    return `<li>${esc(k.utgiver)}: <a href="${esc(k.adresse)}" rel="noopener">${esc(k.navn)}</a> (${k.aar}). Läst ${svenskDato(k.hentet)}.</li>`;
  }).join('')}</ol>`;
}

/** Tabellen: kolonner er overskriftene, rader er [etikett, ...celler] der en celle er et felt, { tekst } eller null (ikke oppgitt). */
function tabell(h, { tittel, kolonner, rader }) {
  const celle = (c) => {
    if (c == null) return '<td>Ingen uppgift</td>';
    if (typeof c === 'string') return `<td>${h.t(c)}</td>`;
    return `<td>${esc(c.tekst)}</td>`;
  };
  return `<div class="table-wrap" tabindex="0" role="region" aria-label="${esc(tittel)}"><table class="sprik"><thead><tr>${kolonner.map((x) => `<th scope="col">${esc(x)}</th>`).join('')}</tr></thead><tbody>${rader.map(([etikett, ...celler]) => `<tr><td>${esc(etikett)}</td>${celler.map(celle).join('')}</tr>`).join('')}</tbody></table></div>`;
}

/** FAQPage med svaren som ren text: testerna kräver att synlig FAQ (utan taggar) är lik JSON-LD. */
const faqSkjema = (faq) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/gu, '').trim() } })),
});

export const p = (liste) => liste.filter(Boolean).map((x) => `<p>${x}</p>`).join('');

/**
 * cfg: { rot, eyebrowNavn, alleTekst, cta, app: [h2, p][], TEKST, nav }.
 * TEKST[radId](h) gir { title, h1, description, lead, kilder: string[], tabell: { tittel, intro, kolonner, rader, kilde, etter? }, ekstra?: [h2, html][], faq, soster?, andre?, ord? }.
 */
export function lagMal(cfg) {
  const sti = (rad) => `${cfg.rot}${rad.slug}/`;
  const eyebrowVare = `<a href="${cfg.rot}">${esc(cfg.eyebrowNavn)}</a>`;
  const APP = cfg.app.map(([h2, tekst]) => `<h2>${esc(h2)}</h2><p>${esc(tekst)}</p>`).join('\n');
  const SKJELETT = { stegTittel: 'Så läser du tabellen', forst: '', alternativ: '', grense: '', seksjoner: [], cta: cfg.cta, steg: [['Hitta din vara', 'Siffrorna står i tabellen, med källa.']] };
  const brodsmule = (...ledd) => brodsmuler([{ navn: 'Hem', adresse: '/sv/' }, { navn: cfg.eyebrowNavn, adresse: cfg.rot }, ...ledd]);

  function sideForRad(rad, data) {
    const h = hjelpere(rad, data);
    const tekst = cfg.TEKST[rad.id];
    if (!tekst) throw new Error(`${rad.id}: mangler tekst i tekst-sv.mjs`);
    const s = tekst({ ...h, rad });
    const tb = s.tabell;
    h.k(tb.kilde);
    const lenker = [...(s.soster ? [s.soster] : []), [cfg.rot, cfg.alleTekst], ...(s.andre ?? [])];
    const rik = [
      `<h2>${esc(cfg.kilderH2 ?? 'Det här säger källorna')}</h2>${p(s.kilder)}`,
      `<h2>${esc(tb.tittel)}</h2>${p([tb.intro])}${tabell(h, tb)}<p><small>Källa: ${h.k(tb.kilde)}, ”${esc(data.kilder[tb.kilde].navn)}”. Läst ${svenskDato(data.kilder[tb.kilde].hentet)}.</small></p>${p(tb.etter ?? [])}`,
      ...(s.ekstra ?? []).map(([tittel, html]) => `<h2>${esc(tittel)}</h2>${html}`),
      APP,
      `<div class="related"><h2>Läs också</h2><ul>${lenker.map(([href, t]) => `<li><a href="${href}">${esc(t)}</a></li>`).join('')}</ul></div>`,
    ];
    const adresse = sti(rad);
    return {
      title: s.title, description: s.description, eyebrow: eyebrowVare, h1: s.h1, lead: s.lead,
      ...SKJELETT, rik: [...rik, kildeliste(data, h.brukt)].join('\n'),
      faqTittel: s.faqTittel ?? `Frågor om ${s.ord ?? rad.navn.toLowerCase()}`, faq: s.faq,
      publisert: rad.oppdatert,
      schemas: [
        brodsmule({ navn: rad.navn, adresse }),
        artikkel({ tittel: s.h1, beskrivelse: s.description, adresse, sprak: 'sv', publisert: rad.oppdatert, kilder: [...h.brukt].map((id) => data.kilder[id]) }),
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
        artikkel({ tittel: s.h1, beskrivelse: s.description, adresse: cfg.rot, sprak: 'sv', publisert, kilder: [...brukt].map((id) => data.kilder[id]) }),
        elementliste({ navn: s.h1, adresse: cfg.rot, elementer: rader.map((r) => ({ navn: r.navn, adresse: sti(r) })) }),
        faqSkjema(s.faq),
      ],
    };
  }

  /** Tallene DEN siden kan bruke: radens egne tall, tall i radens sitater, og år og lesedato for kildene. */
  function tillatteTall(rad, data) {
    const s = new Set();
    for (const x of Object.values(rad.tall)) s.add(tallTekst(x.verdi));
    for (const q of Object.values(rad.tekst ?? {})) tallIText(q.split('|').slice(1).join('|')).forEach((x) => s.add(x));
    for (const x of cfg.ekstraTall?.(rad) ?? []) s.add(x);
    for (const k of Object.values(data.kilder)) kildeTall(k).forEach((x) => s.add(x));
    return s;
  }
  /** Samlesiden: alle publiserbare raders tall, antallet varer og kildenes år og datoer. */
  function tillatteTallNav(data) {
    const alle = publiserbare(data);
    const s = new Set([String(alle.length)]);
    for (const r of alle) for (const x of tillatteTall(r, data)) s.add(x);
    return s;
  }
  const maskeNavn = (rad) => [rad.navn, rad.navn.toLowerCase()];
  return { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn, sti, hjelpere };
}

// Felles mal for familiene «kjernetemperatur» og «steketid» (norsk). Hver familie har sin datafil og sin tekst (tekst-nb.mjs);
// denne fila bygger sidene. Regler (Patrick 20.11.2026): Mattilsynet først, MatPrat etterpå med årstall, ingen egne råd, og
// ingen tall uten kilde. Prosaen i tekst-nb.mjs skriver aldri et tall selv: den henter dem med t(felt), og t() noterer kilden,
// så kildelista på siden er nøyaktig de kildene siden bruker. Setninger fra kilden hentes med s(id) (radens `tekst`, «kildeId|sitat»).
// Tallvakten (test/hjelp/familievakt.mjs) feller et tall som ikke står i datafila. Sitatene kontrolleres av kildekontroll.mjs.
import { publiserbare } from '../felles.mjs';
import { artikkel, brodsmuler, elementliste } from '../skjema.mjs';
import { forfatterPerson } from '../../forfatter.mjs';
import { kalkSkjelett } from '../../kalk-kort.mjs';

export const esc = (s) => String(s).replace(/&/gu, '&amp;').replace(/</gu, '&lt;').replace(/>/gu, '&gt;').replace(/"/gu, '&quot;');
const MAANEDER = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'];
export const norskDato = (iso) => { const [a, m, d] = iso.split('-').map(Number); return `${d}. ${MAANEDER[m - 1]} ${a}`; };
const kort = (k) => (k.utgiver.startsWith('MatPrat') ? 'MatPrat' : k.utgiver);
const erMattilsynet = (k) => k.utgiver === 'Mattilsynet';
export const tallTekst = (n) => String(Math.abs(n)).replace('.', ',');
const enhetTekst = (enhet) => (enhet === '°C' ? ' °C' : ` ${enhet}`);
export const tallI = (tekst) => String(tekst ?? '').match(/\d+(?:[.,]\d+)?/gu) ?? [];

/** Hjelperne en side skrives med. `brukt` samler kildene siden faktisk bruker. */
export function hjelpere(rad, data, brukt = new Set()) {
  const tall = (felt) => {
    const x = rad.tall[felt];
    if (!x) throw new Error(`${rad.id}: tallet «${felt}» finnes ikke i datafila`);
    brukt.add(x.kilde);
    return x;
  };
  /** «3 til 4 måneder», «4 dager», «68 °C». Med ca: «ca. 6 måneder». Felt uten -min/-maks er ett tall. */
  const t = (felt, { ca = false } = {}) => {
    if (rad.tall[felt]) { const x = tall(felt); return `${ca ? 'ca. ' : ''}${x.verdi < 0 ? 'minus ' : ''}${tallTekst(x.verdi)}${enhetTekst(x.enhet)}`; }
    const min = tall(`${felt}-min`);
    const maks = rad.tall[`${felt}-maks`] ? tall(`${felt}-maks`) : null;
    const tekst = maks && maks.verdi !== min.verdi ? `${tallTekst(min.verdi)} til ${tallTekst(maks.verdi)}` : tallTekst(min.verdi);
    return `${ca ? 'ca. ' : ''}${tekst}${enhetTekst(min.enhet)}`;
  };
  /** Bare tallet uten enhet, til setninger som «fra 55 til 60 °C» der enheten står til slutt. */
  const n = (felt) => tallTekst(tall(felt).verdi);
  /** «MatPrat (2014)» eller «Mattilsynet (2023)», og kilden noteres. */
  const k = (id) => {
    const kilde = data.kilder[id];
    if (!kilde) throw new Error(`${rad.id}: kilden «${id}» finnes ikke i datafila`);
    brukt.add(id);
    return `${kort(kilde)} (${kilde.aar})`;
  };
  /** Som k, men til bruk inne i en parentes: «Mattilsynet, 2022». */
  const kp = (id) => k(id).replace(/ \((\d{4})\)$/u, ', $1');
  /** En setning fra kilden, ordrett, med kilde: «…» (Mattilsynet, 2022). Kontrolleres mot kildesiden. */
  const s = (id) => {
    const verdi = rad.tekst?.[id];
    if (!verdi) throw new Error(`${rad.id}: sitatet «${id}» finnes ikke i datafila`);
    const [kilde, ...rest] = verdi.split('|');
    return `«${esc(rest.join('|'))}» (${kp(kilde)})`;
  };
  return { t, n, k, kp, s, brukt };
}

function kildeliste(data, brukt) {
  const ider = [...brukt].sort((a, b) => Number(erMattilsynet(data.kilder[b])) - Number(erMattilsynet(data.kilder[a])));
  return `<h2>Kilder</h2>\n<ol class="kilder" id="kilder">${ider.map((id) => {
    const k = data.kilder[id];
    return `<li>${esc(k.utgiver)}: <a href="${esc(k.adresse)}" rel="noopener">${esc(k.navn)}</a> (${k.aar}). Lest ${norskDato(k.hentet)}.</li>`;
  }).join('')}</ol>`;
}

/** Tabellen: kolonner er overskriftene, rader er [etikett, ...celler] der en celle er et felt, { felt, ca }, { tekst }, { html } eller null (ikke oppgitt). */
export function tabell(h, { tittel, kolonner, rader }) {
  const celle = (c) => {
    if (c == null) return '<td>Ikke oppgitt</td>';
    if (typeof c === 'string') return `<td>${h.t(c)}</td>`;
    if (c.html) return `<td>${c.html}</td>`;
    if (c.tekst) return `<td>${esc(c.tekst)}</td>`;
    return `<td>${h.t(c.felt, { ca: c.ca })}</td>`;
  };
  const etikett = (e) => (typeof e === 'object' && e.html ? e.html : esc(e));
  return `<div class="table-wrap" tabindex="0" role="region" aria-label="${esc(tittel)}"><table class="sprik"><thead><tr>${kolonner.map((x) => `<th scope="col">${esc(x)}</th>`).join('')}</tr></thead><tbody>${rader.map(([e, ...celler]) => `<tr><td>${etikett(e)}</td>${celler.map(celle).join('')}</tr>`).join('')}</tbody></table></div>`;
}

export const p = (liste) => liste.filter(Boolean).map((x) => `<p>${x}</p>`).join('');
export const liste = (punkter) => `<ul>${punkter.map((x) => `<li>${x}</li>`).join('')}</ul>`;
const kildeTall = (k) => [String(k.aar), ...norskDato(k.hentet).match(/\d+/gu)];

/** Kalkulatoren «vekt inn, tid ut»: bruker kalkulatorkortet (site.js) med affine enheter, så faktoren (minutter per kilo) står i skjemaets data. */
export function kalkTid({ perKilo, ordKilde, eksempelKg, steg }) {
  const utregnet = perKilo * eksempelKg;
  const html = kalkSkjelett({
    etiketter: { aria: 'Kalkulator: vekt til steketid', mengde: 'Vekt i kilo', fra: 'Fra', til: 'Til', bytt: 'Bytt retning', vanlige: 'Vanlige vekter' },
    enheter: [['kg', 'kilo'], ['min', 'minutter'], ['timer', 'timer']],
    fra: 'kg', til: 'min',
    data: {
      ml: {}, g: { kg: 1 }, stegFor: { kg: 'kg' }, steg: { kg: steg },
      kort: { kg: 'kg', min: 'min', timer: ['time', 'timer'] },
      affin: { kg: [perKilo, 0], min: [1, 0], timer: [60, 0] },
      feil: 'Skriv inn en vekt i kilo, for eksempel 6 eller 6,5.',
    },
    start: { mengde: String(eksempelKg), svar: String(utregnet), setning: `${eksempelKg} kg = ${utregnet} min`, hurtig: steg.map((v) => [v, `${v} kg`]) },
    type: 'tid',
    vareHtml: `<div class="kalkvare"><span><span class="hva">Regel</span><br><b>${esc(ordKilde)}</b></span></div>`,
  });
  // Kortet har bare én vei: kilo inn, tid ut. Fra-listen har bare kilo, til-listen bare tid, og bytteknappen skjules med CSS (side.css, data-kalk="tid").
  return html
    .replace(/(<select data-felt="fra">)[\s\S]*?(<\/select>)/u, '$1<option value="kg" selected>kilo</option>$2')
    .replace(/(<select data-felt="til">)[\s\S]*?(<\/select>)/u, '$1<option value="min" selected>minutter</option><option value="timer">timer</option>$2')
    .replace('<button type="button" class="bytt"', '<button type="button" class="bytt" tabindex="-1" aria-hidden="true"');
}

/**
 * cfg: { rot, eyebrowNavn, alleTekst, cta, stegTittel, app (html), TEKST, nav(...) , ekstraTall(rad) }.
 * TEKST[radId](h) gir { title, h1, description, lead, ord?, blokker: [[tittel, html]], faq, faqTittel?, soster?, andre?, kalk? }.
 */
export function lagMal(cfg) {
  const sti = (rad) => `${cfg.rot}${rad.slug}/`;
  const eyebrowVare = `<a href="${cfg.rot}">${esc(cfg.eyebrowNavn)}</a>`;
  const SKJELETT = { stegTittel: cfg.stegTittel, forst: '', alternativ: '', grense: '', seksjoner: [], cta: cfg.cta, steg: [[cfg.steg0, cfg.steg1]] };
  const brodsmule = (...ledd) => brodsmuler([{ navn: 'Forside', adresse: '/' }, { navn: cfg.eyebrowNavn, adresse: cfg.rot }, ...ledd]);

  function sideForRad(rad, data, rader) {
    const h = hjelpere(rad, data);
    const tekst = cfg.TEKST[rad.id];
    if (!tekst) throw new Error(`${rad.id}: mangler tekst i tekst-nb.mjs`);
    const s = tekst({ ...h, tabell: (x) => tabell(h, x), p, liste, esc, kalk: kalkTid, rad, sti: cfg.sti });
    const kalkHtml = s.kalk && cfg.kalk ? cfg.kalk(rad, h) : '';
    const lenker = [...(s.soster ?? []), ...(s.andre ?? []), [cfg.rot, cfg.alleTekst]];
    const rik = [
      ...s.blokker.map(([tittel, html]) => `<h2>${esc(tittel)}</h2>${html.replace('@@KALK@@', kalkHtml)}`),
      cfg.app,
      `<div class="related"><h2>Les også</h2><ul>${lenker.map(([href, t]) => `<li><a href="${href}">${esc(t)}</a></li>`).join('')}</ul></div>`,
    ];
    const kilder = kildeliste(data, h.brukt);
    const adresse = sti(rad);
    const kildeObjekter = [...h.brukt].map((id) => data.kilder[id]);
    return {
      title: s.title, description: s.description, eyebrow: eyebrowVare, h1: s.h1, lead: s.lead,
      ...SKJELETT, rik: [...rik, kilder].join('\n'),
      faqTittel: s.faqTittel ?? `Spørsmål om ${s.ord ?? rad.navn.toLowerCase()}`, faq: s.faq,
      publisert: rad.oppdatert,
      schemas: [
        brodsmule({ navn: rad.navn, adresse }),
        artikkel({ tittel: s.h1, beskrivelse: s.description, adresse, sprak: 'nb', publisert: rad.oppdatert, kilder: kildeObjekter, forfatter: forfatterPerson() }),
      ],
    };
  }

  function navSide(data, rader) {
    const brukt = new Set();
    const s = cfg.nav({ data, rader, sti, h: (rad) => hjelpere(rad, data, brukt), tabell, p, liste, esc, norskDato, brukt, k: (id) => { brukt.add(id); const kk = data.kilder[id]; return `${kort(kk)} (${kk.aar})`; } });
    const publisert = rader.map((r) => r.oppdatert).sort().at(-1);
    return {
      title: s.title, description: s.description, eyebrow: esc(cfg.eyebrowNavn), h1: s.h1, lead: s.lead,
      ...SKJELETT, rik: [s.rik, cfg.app, kildeliste(data, brukt)].join('\n'),
      faqTittel: s.faqTittel, faq: s.faq, publisert,
      schemas: [
        brodsmule(),
        artikkel({ tittel: s.h1, beskrivelse: s.description, adresse: cfg.rot, sprak: 'nb', publisert, kilder: [...brukt].map((id) => data.kilder[id]), forfatter: forfatterPerson() }),
        elementliste({ navn: s.h1, adresse: cfg.rot, elementer: rader.map((r) => ({ navn: r.navn, adresse: sti(r) })) }),
      ],
    };
  }

  /** Tallene DEN siden kan bruke: radens egne tall (uten fortegn), tall i radens sitater, ekstra tall fra malen, og år og lesedato for kildene. */
  function tillatteTall(rad, data) {
    const s = new Set();
    for (const x of Object.values(rad.tall)) s.add(tallTekst(x.verdi));
    for (const q of Object.values(rad.tekst ?? {})) tallI(q.split('|').slice(1).join('|')).forEach((n) => s.add(n));
    for (const n of cfg.ekstraTall?.(rad) ?? []) s.add(n);
    for (const k of Object.values(data.kilder)) kildeTall(k).forEach((n) => s.add(n));
    return s;
  }
  /** Samlesiden: alle publiserbare raders tall, antallet sider og kildenes år og datoer. */
  function tillatteTallNav(data) {
    const alle = publiserbare(data);
    const s = new Set([String(alle.length)]);
    for (const r of alle) for (const n of tillatteTall(r, data)) s.add(n);
    return s;
  }
  const maskeNavn = (rad) => [rad.navn, rad.navn.toLowerCase()];
  return { sideForRad, navSide, tillatteTall, tillatteTallNav, maskeNavn, sti };
}

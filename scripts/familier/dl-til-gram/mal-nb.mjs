// Malen for familien «dl til gram» (nb): en samleside og én side per vare, skrevet fra data.nb.json.
// Malen skriver bare tall som kan regnes ut fra datafila (se tillatteTall). Teksten per vare ligger i tekst-nb.mjs.
import { kilderFor, publiserbare } from '../felles.mjs';
import { artikkel, brodsmuler, elementliste, webApplikasjon } from '../skjema.mjs';
import { TEKST } from './tekst-nb.mjs';

// Rapportens toppede skjetall (ss_toppet, ts_toppet) ligger i datafila, men skrives ikke på sidene ennå:
// «toppede» tall er ofte like de strøkne målene, og vi venter på svar fra Mattilsynet.
export const VIS_TOPPET = false;

const ROT = '/verktoy/dl-til-gram/';
const fmt = (n) => String(n).replace('.', ',');
const gram = (n) => `${fmt(n)} g`;
const tegn = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
const esc = (t) => String(t).replace(/[&<>"]/gu, (c) => tegn[c]);
const ord = (rad) => rad.navn.toLowerCase();
const MAANEDER = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'];
const norskDato = (iso) => { const [a, m, d] = iso.split('-').map(Number); return `${d}. ${MAANEDER[m - 1]} ${a}`; };
const tallI = (tekst) => String(tekst ?? '').match(/\d+(?:[.,]\d+)?/gu) ?? [];
const USDA_FELT = ['dl_usda', 'dl_usda_pakket', 'dl_usda_siktet'];

/** Alle utregninger på siden, ett sted. Skjeer og andre mengder avrundes til heltall, minst 1 g. Gram til dl får én desimal. */
export function utregnet(rad) {
  const dl = rad.tall.dl.verdi;
  const rund = (x) => Math.max(1, Math.round(x));
  const ss = rund(dl * 15 / 100);
  const ts = rund(dl * 5 / 100);
  return {
    dl, ss, ts,
    tabell: [['1 ts', ts], ['1 ss', ss], ['0,5 dl', rund(dl / 2)], ['1 dl', dl], ['2 dl', 2 * dl], ['3 dl', 3 * dl], ['4 dl', 4 * dl], ['5 dl', 5 * dl], ['1 liter', 10 * dl]],
    tilbake: [100, 250, 500, 1000].map((g) => [g, (g / dl).toFixed(1).replace('.', ',')]),
  };
}

// Raden slik siden bruker den: rapporten vises ikke (VIS_TOPPET), så kilden hører ikke hjemme i kildelista.
const synligRad = (rad) => ({ ...rad, tall: Object.fromEntries(Object.entries(rad.tall).filter(([k]) => k === 'dl' || USDA_FELT.includes(k) || (VIS_TOPPET && k.endsWith('_toppet')))) });
const usdaTall = (rad) => USDA_FELT.filter((k) => rad.tall[k]).map((k) => {
  const m = /^(\d+(?:[.,]\d+)?) g per (.+)$/u.exec(rad.tall[k].merknad ?? '');
  return { verdi: rad.tall[k].verdi, gPerCup: m?.[1], mal: m?.[2] };
});

const PIL = '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"></path></svg>';
const BYTT = '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"></path></svg>';
const ENHETER = [['dl', 'Desiliter (dl)'], ['ss', 'Spiseskjeer (ss)'], ['ts', 'Teskjeer (ts)'], ['ml', 'Milliliter (ml)'], ['l', 'Liter (l)'], ['cups', 'Amerikanske cups'], ['g', 'Gram (g)'], ['kg', 'Kilo (kg)']];
const valg = (valgt) => ENHETER.map(([v, t]) => `<option value="${v}"${v === valgt ? ' selected' : ''}>${t}</option>`).join('');
const KALK = {
  varer: null,
  ml: { dl: 100, ss: 15, ts: 5, ml: 1, l: 1000, cups: 236.5882365 },
  g: { g: 1, kg: 1000 },
  kort: { dl: 'dl', ss: 'ss', ts: 'ts', ml: 'ml', l: 'l', cups: 'cups', g: 'g', kg: 'kg' },
  steg: { volum: ['0,5', '1', '2', '3', '5', '10'], ml: ['25', '50', '100', '250', '500', '1000'], g: ['50', '100', '150', '250', '500', '1000'], kg: ['0,25', '0,5', '1', '1,5', '2', '5'] },
  feil: 'Skriv inn en mengde, for eksempel 2 eller 2,5.',
};

/** Kalkulatorkortet (HTML-kontrakten fra designspec 16.8). Med `fast` står varen fast øverst; ellers velges den i en liste. */
export function kalkHtml({ rader, fast }) {
  const varer = fast ? [fast] : [...rader].sort((a, b) => a.navn.localeCompare(b.navn, 'nb'));
  const forste = fast ?? varer.find((r) => r.id === 'hvetemel') ?? varer[0];
  const indeks = varer.indexOf(forste);
  const dl = forste.tall.dl.verdi;
  const json = JSON.stringify({ ...KALK, varer: varer.map((r) => [ord(r), r.tall.dl.verdi]) });
  const vare = fast
    ? `<div class="kalkvare"><span><span class="hva">Vare</span><br><b>${esc(fast.navn)}</b></span><a href="${ROT}">Bytt vare</a></div>`
    : `<div class="kalkvare"><label><span class="hva">Vare</span><select data-felt="vare">${varer.map((r, i) => `<option value="${i}"${i === indeks ? ' selected' : ''}>${esc(r.navn)}</option>`).join('')}</select></label></div>`;
  const hurtig = KALK.steg.volum.map((v) => `<button type="button" data-v="${v}">${v} dl</button>`).join('');
  return `<form class="kalk" data-kalk="volumvekt" onsubmit="return false" aria-label="Kalkulator: desiliter til gram">
  ${vare}
  <div class="kalkrad">
    <div class="kalkside">
      <label class="kalktall"><span class="skjult">Mengde</span><input data-felt="mengde" type="text" inputmode="decimal" autocomplete="off" value="2"></label>
      <label class="kalkenhet"><span class="skjult">Fra</span><select data-felt="fra">${valg('dl')}</select>${PIL}</label>
    </div>
    <button type="button" class="bytt" data-felt="bytt" aria-label="Bytt retning">${BYTT}</button>
    <div class="kalkside til">
      <output class="kalktall" data-felt="svar">${fmt(2 * dl)}</output>
      <label class="kalkenhet"><span class="skjult">Til</span><select data-felt="til">${valg('g')}</select>${PIL}</label>
    </div>
  </div>
  <div class="hurtig" role="group" aria-label="Vanlige mengder">${hurtig}</div>
  <p class="kalksetning" data-felt="setning" role="status" aria-live="polite">2 dl ${esc(ord(forste))} = ${gram(2 * dl)}</p>
  <script type="application/json" class="kalk-data">${json.replaceAll('<', '\\u003c')}</script>
</form>`;
}

const kildeNavn = (k) => (k.navn.includes(String(k.aar)) ? k.navn : `${k.navn} (${k.aar})`);
const vert = (adresse) => new URL(adresse).hostname;
function kildeliste(data, kilder) {
  return `<h2>Kilder</h2>\n<ol class="kilder" id="kilder">${kilder.map((k) => `<li>${esc(kildeNavn(k))}. ${esc(k.utgiver)}. <a href="${esc(k.adresse)}" rel="noopener">${esc(vert(k.adresse))}</a>. Hentet ${norskDato(k.hentet)}.</li>`).join('')}</ol>`;
}

const APPKORT = `<h2>Slutt å regne om for hånd</h2>
<aside class="i-appen i-enheter"><div class="i-appen-tekst"><p class="i-appen-tittel"><img src="/images/icon-64.png" width="22" height="22" alt="">I Matlyst</p><p>Med Enheter på Metrisk blir cups, unser og pund gjort om til dl og gram når du importerer. Gjelder nye importer.</p><a class="more" href="/oppskriftsbok-app/">Les mer</a></div><div class="i-appen-media"><img class="tel" src="/images/en-guide/nb/matlyst-settings-units-metric-400.webp" srcset="/images/en-guide/nb/matlyst-settings-units-metric-400.webp 400w, /images/en-guide/nb/matlyst-settings-units-metric-800.webp 800w" sizes="200px" width="400" height="867" loading="lazy" decoding="async" alt="Innstillinger i Matlyst med Enheter satt til Metrisk"></div></aside>`;

const EYEBROW_VARE = `<a href="/verktoy/">Verktøy</a><span aria-hidden="true"> › </span><a href="${ROT}">Dl til gram</a>`;
const EYEBROW_NAV = '<a href="/verktoy/">Verktøy</a><span aria-hidden="true"> › </span>Dl til gram';
const MVT = 'Matvaretabellen 2026, Mattilsynet';
const sti = (rad) => `${ROT}${rad.slug}/`;
const lenke = (rad, tekst = rad.navn) => `<a href="${sti(rad)}">${esc(tekst)}</a>`;
const STEG = [['Skriv inn mengden', 'Kalkulatoren regner om mens du skriver.']];
const SKJELETT = { stegTittel: 'Slik bruker du kalkulatoren', forst: '', alternativ: '', grense: '', seksjoner: [], cta: 'Regn om oppskrifter i Matlyst' };
const brodsmule = (...ledd) => brodsmuler([{ navn: 'Forside', adresse: '/' }, { navn: 'Verktøy', adresse: '/verktoy/' }, ...ledd]);

/** Tallene en side kan bruke: alt malen regner ut fra raden (og de nære varene), tall i betegnelsene fra kildene og kildenes år og datoer. */
export function tillatteTall(rad, data) {
  const s = new Set(['0,5', '0,25', '1', '1,5', '2', '2,5', '3', '4', '5', '10', '15', '25', '50', '100', '150', '250', '500', '1000', '236.5882365']);
  const legg = (n) => s.add(fmt(n));
  const raderIData = publiserbare(data);
  legg(raderIData.length);
  // Varevalget på samlesiden bærer indeksen i value (0, 1, 2 ...).
  raderIData.forEach((_, i) => s.add(String(i)));
  const bruk = [rad, ...(TEKST[rad.id]?.naer ?? []).map((id) => raderIData.find((r) => r.id === id)).filter(Boolean)];
  for (const r of bruk) {
    const u = utregnet(r);
    [u.dl, u.ss, u.ts, 2 * u.dl].forEach(legg);
    u.tabell.forEach(([, g]) => legg(g));
    u.tilbake.forEach(([, d]) => s.add(d));
    for (const t of [r.tekst?.matvaretabell, r.tekst?.andrePoster, r.tekst?.usdaNavn, r.tekst?.usdaFdcId, TEKST[r.id]?.variant, ...USDA_FELT.map((k) => r.tall[k]?.merknad)]) tallI(t).forEach((n) => s.add(n));
    for (const k of USDA_FELT) if (r.tall[k]) legg(r.tall[k].verdi);
  }
  for (const r of raderIData) { const u = utregnet(r); [u.dl, u.ss, u.ts].forEach(legg); }
  for (const k of Object.values(data.kilder)) { s.add(String(k.aar)); tallI(norskDato(k.hentet)).forEach((n) => s.add(n)); }
  return s;
}

function sprikAvsnitt(rad, data) {
  const usda = usdaTall(rad);
  if (!usda.length) return '';
  const dl = rad.tall.dl.verdi;
  const lik = usda.every((u) => u.verdi === dl);
  const k = data.kilder.usda;
  const rader = [
    `<tr class="valgt"><td>${MVT}<small>«${esc(rad.tekst.matvaretabell)}». Tallet vi bruker.</small></td><td>${gram(dl)}</td></tr>`,
    ...usda.map((u) => `<tr><td>USDA FoodData Central<small>«${esc(rad.tekst.usdaNavn)}» (FDC ${rad.tekst.usdaFdcId}). ${esc(`${u.gPerCup} g per ${u.mal}`)}, regnet om fra cup til dl.</small></td><td>${gram(u.verdi)}</td></tr>`),
  ];
  return `<h2>Kildene side om side</h2>
<p>Matvaretabellen og ${esc(k.utgiver.startsWith('U.S.') ? 'USDA' : k.navn)} oppgir ${lik ? 'samme' : 'ikke samme'} vekt for 1 dl ${esc(ord(rad))}. Vi bruker tallet fra Matvaretabellen.</p>
<table class="sprik"><thead><tr><th scope="col">Kilde</th><th scope="col">1 dl</th></tr></thead><tbody>${rader.join('')}</tbody></table>`;
}

function andrePosterAvsnitt(rad) {
  const andre = JSON.parse(rad.tekst.andrePoster ?? '[]');
  if (!andre.length) return '';
  const rader = andre.map(([navn, dl]) => `<tr><td>«${esc(navn)}»</td><td>${gram(dl)}</td></tr>`).join('');
  return `<h2>Andre poster i Matvaretabellen</h2>
<p>Matvaretabellen har flere poster som ligner. Vi bruker «${esc(rad.tekst.matvaretabell)}». De andre postene oppgir denne vekten for 1 dl:</p>
<table class="sprik"><thead><tr><th scope="col">Post</th><th scope="col">1 dl</th></tr></thead><tbody>${rader}</tbody></table>`;
}

function spmForRad(rad, data, rader, u) {
  const t = TEKST[rad.id];
  const o = ord(rad);
  const spm = [
    [`Hvor mange gram er 1 dl ${o}?`, `1 dl ${esc(t.variant)} veier ${gram(u.dl)} (${MVT}, «${esc(rad.tekst.matvaretabell)}»).`],
    [`Hvor mange dl er 100 g ${o}?`, `100 g ${o} er ${u.tilbake[0][1]} dl. Du får det ved å dele vekten på ${u.dl}.`],
    [`Hvor mye veier 1 ss ${o}?`, `En strøken spiseskje (15 ml) veier ${gram(u.ss)}, regnet ut fra dl-tallet. En strøken teskje (5 ml) veier ${gram(u.ts)}.`],
  ];
  const naer = (t.naer ?? []).map((id) => rader.find((r) => r.id === id)).filter(Boolean);
  const usda = usdaTall(rad);
  if (naer[0]) {
    const n = naer[0];
    const dlN = n.tall.dl.verdi;
    spm.push([`Veier ${ord(n)} det samme som ${o}?`, `${dlN === u.dl ? 'Ja' : 'Nei'}. 1 dl ${esc(TEKST[n.id].variant)} veier ${gram(dlN)}${dlN === u.dl ? ', det samme som' : ', mot'} ${gram(u.dl)} for ${esc(t.variant)}. ${lenke(n, `Se siden for ${ord(n)}`)}.`]);
  } else if (!usda.length) {
    spm.push([`Hvor mye er 1 liter ${o} i gram?`, `1 liter ${o} er 10 dl, og det veier ${gram(10 * u.dl)}. 1 kg ${o} er ${u.tilbake[3][1]} dl.`]);
  } else if (usda.length) {
    const deler = usda.map((x) => `${esc(`${x.gPerCup} g per ${x.mal}`)} er ${gram(x.verdi)} per dl`);
    spm.push([`Hva oppgir USDA for 1 dl ${o}?`, `USDA har posten «${esc(rad.tekst.usdaNavn)}»: ${deler.join(', og ')}. Vi bruker tallet fra Matvaretabellen, ${gram(u.dl)}.`]);
  }
  return [...spm, ...(t.ekstraSpm ?? [])];
}

function andreVarer(rad, rader) {
  const naer = (TEKST[rad.id]?.naer ?? []).map((id) => rader.find((r) => r.id === id)).filter(Boolean);
  const i = rader.indexOf(rad);
  const etter = [...rader.slice(i + 1), ...rader.slice(0, i)].filter((r) => !naer.includes(r));
  const valgt = [...naer, ...etter].slice(0, 8);
  return `<div class="related"><h2>Andre varer</h2><ul>${[...valgt.map((r) => `<li>${lenke(r)}</li>`), `<li><a href="${ROT}">Alle varer</a></li>`].join('')}</ul></div>`;
}

function kortsvar(rad, u) {
  return `<p class="kortsvar"><b>Kort svar:</b> 1 dl ${esc(TEKST[rad.id].variant)} er ${gram(u.dl)}. En strøken spiseskje (15 ml) er ${gram(u.ss)}, og en strøken teskje (5 ml) er ${gram(u.ts)}, regnet ut fra dl-tallet.</p>
<p class="kilde">Kilde: <a href="#kilder">${MVT}</a>, «${esc(rad.tekst.matvaretabell)}».</p>`;
}

export function sideForRad(rad, data, rader) {
  const u = utregnet(rad);
  const o = ord(rad);
  const adresse = sti(rad);
  const lang = `1 dl ${o} i gram: regn om dl, ss og ts`;
  const title = lang.length <= 60 ? lang : `1 dl ${o} i gram: dl, ss og ts`;
  const medUsda = usdaTall(rad).length > 0;
  const description = `1 dl ${o} veier ${gram(u.dl)}. Regn om dl, ss, ts og gram med kalkulatoren, og se tabell, kilde${medUsda ? ' og USDA ved siden av' : ' og hvordan tallet er regnet ut'}.`;
  const lead = `1 dl ${o} veier ${gram(u.dl)}. Skriv inn mengden, så ser du vekten med en gang.`;
  const tabell = `<table class="otabell"><thead><tr><th scope="col">${esc(rad.navn)}</th><th scope="col">Gram</th></tr></thead><tbody>${u.tabell.map(([e, g]) => `<tr><td>${e}</td><td>${gram(g)}</td></tr>`).join('')}</tbody></table>`;
  const eks = u.tilbake.map(([g, d]) => `<li><b>${g === 1000 ? '1 kg' : `${g} g`}</b><span>${d} dl</span></li>`).join('');
  const rik = [
    `<div class="oto"><div class="okort"><h2>${esc(rad.navn)} fra dl til gram</h2><p>Mengdene oppskrifter bruker mest, regnet ut fra dl-tallet: 1 dl ${o} veier ${gram(u.dl)}.</p>${tabell}</div>`,
    `<div class="okort"><h2>Fra gram til dl</h2><p>Del vekten i gram på ${u.dl} for å få dl ${o}. Motsatt vei ganger du dl ${o} med ${u.dl}.</p><p class="formel"><span>dl</span><i>=</i><span>gram</span><i>÷</i><b>${u.dl}</b></p><p class="liten">Eksempler</p><ul class="eksempler">${eks}</ul></div></div>`,
    APPKORT,
    sprikAvsnitt(rad, data),
    andrePosterAvsnitt(rad),
    kildeliste(data, kilderFor(data, [synligRad(rad)])),
    andreVarer(rad, rader),
  ].filter(Boolean).join('\n');
  return {
    title, description, eyebrow: EYEBROW_VARE, h1: `${rad.navn}: dl til gram`, lead,
    topp: `${kalkHtml({ rader, fast: rad })}\n${kortsvar(rad, u)}`,
    steg: STEG, ...SKJELETT, rik,
    faqTittel: `Spørsmål om ${o}`, faq: spmForRad(rad, data, rader, u),
    publisert: rad.oppdatert,
    schemas: [
      brodsmule({ navn: 'Dl til gram', adresse: ROT }, { navn: rad.navn, adresse }),
      webApplikasjon({ navn: `${rad.navn}: dl til gram`, beskrivelse: description, adresse, sprak: 'nb' }),
      artikkel({ tittel: `${rad.navn}: dl til gram`, beskrivelse: description, adresse, sprak: 'nb', publisert: rad.oppdatert, kilder: kilderFor(data, [synligRad(rad)]) }),
    ],
  };
}

export function navSide(data, rader) {
  const sortert = [...rader].sort((a, b) => a.navn.localeCompare(b.navn, 'nb'));
  const etterVekt = [...rader].sort((a, b) => a.tall.dl.verdi - b.tall.dl.verdi);
  const lett = etterVekt[0];
  const tung = etterVekt.at(-1);
  const kjent = (id) => rader.find((r) => r.id === id);
  const eks = [kjent('hvetemel'), kjent('sukker'), kjent('havregryn')].filter(Boolean);
  const eksTekst = eks.map((r) => `1 dl ${ord(r)} er ${gram(r.tall.dl.verdi)}`);
  const rekke = eksTekst.length > 1 ? `${eksTekst.slice(0, -1).join(', ')} og ${eksTekst.at(-1)}` : eksTekst[0];
  const rows = sortert.map((r) => { const u = utregnet(r); return `<tr><td>${lenke(r)}</td><td>${gram(u.dl)}</td><td>${gram(u.ss)}</td><td>${gram(u.ts)}</td></tr>`; }).join('');
  const title = `Dl til gram: kalkulator og tabell for ${rader.length} varer`;
  const description = `Hva veier 1 dl? Regn om dl, ss, ts og gram for ${rader.length} varer, fra ${ord(lett)} til ${ord(tung)}, med kilde på hvert tall.`;
  const kilder = kilderFor(data, rader.map((r) => ({ ...r, tall: { dl: r.tall.dl } })));
  const rik = [
    `<h2>Hva veier 1 dl?</h2><p>Velg en vare for tabell, gram til dl og kilder. Skjeene er regnet ut fra dl-tallet.</p>
<div class="varerull"><table class="varer"><thead><tr><th scope="col">Vare</th><th scope="col">1 dl</th><th scope="col">1 ss (15 ml)</th><th scope="col">1 ts (5 ml)</th></tr></thead><tbody>${rows}</tbody></table></div>`,
    APPKORT,
    `<h2>Hvorfor veier ikke 1 dl det samme?</h2><p>Desiliter måler volum, og gram måler vekt. 1 dl ${ord(tung)} veier ${gram(tung.tall.dl.verdi)}, og 1 dl ${ord(lett)} veier ${gram(lett.tall.dl.verdi)}. Derfor har hver vare sitt eget tall når du regner mellom dl og gram.</p>
<h2>Slik har vi regnet</h2><p>Vekten per dl er hentet fra Matvaretabellen 2026, fra Mattilsynet. Spiseskje og teskje er regnet ut fra dl-tallet, som strøkne mål på 15 ml og 5 ml. Gram til dl regnes ved å dele vekten på tallet for varen.</p>`,
    kildeliste(data, kilder),
    `<div class="related"><h2>Beslektede omregninger</h2><ul><li><a href="/verktoy/dl-til-ss/">dl til ss</a></li><li><a href="/verktoy/dl-til-ts/">dl til ts</a></li><li><a href="/verktoy/dl-til-ml/">dl til ml</a></li><li><a href="/verktoy/dl-til-kopp/">dl til kopp</a></li><li><a href="/verktoy/kopp-til-dl/">kopp til dl</a></li><li><a href="/verktoy/enhetsomregner/">Enhetsomregner</a></li></ul></div>`,
  ].join('\n');
  const faq = [
    ['Hvor mange gram er 1 dl?', `Det kommer an på varen. ${eksTekst.length ? `${rekke.charAt(0).toUpperCase()}${rekke.slice(1)}.` : ''} Velg varen i kalkulatoren eller i tabellen.`.replace('  ', ' ')],
    ['Hvordan regner jeg om dl til gram?', `Gang antall dl med vekten per dl for varen. For ${ord(eks[0] ?? lett)} er det ${eks[0] ? eks[0].tall.dl.verdi : lett.tall.dl.verdi}, så 2 dl blir ${2 * (eks[0] ?? lett).tall.dl.verdi} g.`],
    ['Hvordan regner jeg om gram til dl?', `Del vekten på vekten per dl for varen. 100 g ${ord(eks[0] ?? lett)} er ${utregnet(eks[0] ?? lett).tilbake[0][1]} dl.`],
    ['Hvor kommer tallene fra?', 'Vekten per dl er hentet fra Matvaretabellen 2026 fra Mattilsynet. Spiseskje og teskje er regnet ut fra dl-tallet.'],
  ];
  return {
    title, description, eyebrow: EYEBROW_NAV, h1: 'Dl til gram',
    lead: 'Hvor mye 1 dl veier, kommer an på varen. Velg vare, så regner kalkulatoren om.',
    topp: `${kalkHtml({ rader })}
<p class="kortsvar"><b>Kort svar:</b> ${rekke}.</p>
<p class="kilde">Kilde: <a href="#kilder">${MVT}</a>. Skjeene er regnet ut fra dl-tallet.</p>`,
    steg: STEG, ...SKJELETT, rik,
    faqTittel: 'Spørsmål om dl til gram', faq,
    publisert: rader.map((r) => r.oppdatert).sort().at(-1),
    schemas: [
      brodsmule({ navn: 'Dl til gram', adresse: ROT }),
      webApplikasjon({ navn: 'Dl til gram', beskrivelse: description, adresse: ROT, sprak: 'nb' }),
      artikkel({ tittel: 'Dl til gram', beskrivelse: description, adresse: ROT, sprak: 'nb', publisert: rader.map((r) => r.oppdatert).sort().at(-1), kilder }),
      elementliste({ navn: 'Dl til gram: alle varer', adresse: ROT, elementer: sortert.map((r) => ({ navn: r.navn, adresse: sti(r) })) }),
    ],
  };
}

// Malen for familien «dl til gram» (nb): en samleside og én side per vare, skrevet fra data.nb.json.
// Malen skriver bare tall som kan regnes ut fra datafila (se tillatteTall). Teksten per vare ligger i tekst-nb.mjs.
import { kilderFor, publiserbare } from '../felles.mjs';
import { artikkel, brodsmuler, elementliste, webApplikasjon } from '../skjema.mjs';
import { esc, gramTekst as gramFelles, kalkSkjelett, mengdeTekst as mengdeFelles, tallI } from './felles-mal.mjs';
import { TEKST } from './tekst-nb.mjs';

// Rapportens toppede skjetall (ss_toppet, ts_toppet) ligger i datafila, men vises ikke: tallene lar seg ikke skille fra strøkne mål
// (rapportens «toppede» skjeer veier ofte det samme som de strøkne), så de ville gitt en påstand vi ikke kan stå for.
export const VIS_TOPPET = false;

const ROT = '/verktoy/dl-til-gram/';
const fmt = (n) => String(n).replace('.', ',');
const gram = (n) => `${fmt(n)} g`;
const ord = (rad) => rad.navn.toLowerCase();
const MAANEDER = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'];
const norskDato = (iso) => { const [a, m, d] = iso.split('-').map(Number); return `${d}. ${MAANEDER[m - 1]} ${a}`; };
const USDA_FELT = ['dl_usda', 'dl_usda_pakket', 'dl_usda_siktet'];

// Tallreglene (felles-mal.mjs) er de samme som i kalkulatorkortet (site.js, svarTekst), låst av test/playwright/kalk-tabell.spec.mjs, her med komma.
export const gramTekst = (n) => gramFelles(n, { komma: true });
export const mengdeTekst = (n) => mengdeFelles(n, { komma: true });
const gramVerdi = (n) => Number(gramTekst(n).replace(',', '.'));

/** Alle utregninger på siden, ett sted. */
export function utregnet(rad) {
  const dl = rad.tall.dl.verdi;
  const ss = gramVerdi(dl * 15 / 100);
  const ts = gramVerdi(dl * 5 / 100);
  return {
    dl, ss, ts,
    tabell: [['1 ts', ts], ['1 ss', ss], ['0,5 dl', gramVerdi(dl / 2)], ['1 dl', dl], ['2 dl', 2 * dl], ['3 dl', 3 * dl], ['4 dl', 4 * dl], ['5 dl', 5 * dl], ['1 liter', 10 * dl]],
    tilbake: [100, 250, 500, 1000].map((g) => [g, mengdeTekst(g / dl)]),
  };
}

// Raden slik siden bruker den: rapporten vises ikke (VIS_TOPPET), så kilden hører ikke hjemme i kildelista.
const synligRad = (rad) => ({ ...rad, tall: Object.fromEntries(Object.entries(rad.tall).filter(([k]) => k === 'dl' || USDA_FELT.includes(k) || (VIS_TOPPET && k.endsWith('_toppet')))) });
// USDA-målene står på engelsk i datafila (ordrett fra kilden) og skrives på norsk på sidene. Postnavnet står ordrett i «».
const USDA_MAL = {
  cup: 'per cup',
  'cup unpacked': 'per løst fylt cup',
  'cup packed': 'per pakket cup',
  'cup sifted': 'per cup, siktet',
  'cup unsifted': 'per cup, usiktet',
  'cup, whole': 'per cup, hele mandler',
  'cup (not packed)': 'per cup (ikke pakket)',
  'cup, fluid (yields 2 cups whipped)': 'per cup flytende fløte (gir 2 cups pisket)',
};
const usdaTall = (rad) => USDA_FELT.filter((k) => rad.tall[k]).map((k) => {
  const m = /^(\d+(?:[.,]\d+)?) g (per .+)$/u.exec(rad.tall[k].merknad ?? '');
  const mal = USDA_MAL[m?.[2].replace(/^per /u, '')];
  if (!mal) throw new Error(`${rad.id}: ukjent USDA-mål «${rad.tall[k].merknad}», legg det til i USDA_MAL`);
  return { verdi: rad.tall[k].verdi, gPerCup: m[1], mal };
});
const kortUsdaNavn = (navn) => navn.replace(/\s*\(Includes[^)]*\)/u, '');

const ENHETER = [['dl', 'Desiliter (dl)'], ['ss', 'Spiseskjeer (ss)'], ['ts', 'Teskjeer (ts)'], ['ml', 'Milliliter (ml)'], ['l', 'Liter (l)'], ['cups', 'Amerikanske cups'], ['g', 'Gram (g)'], ['kg', 'Kilo (kg)']];
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
  return kalkSkjelett({
    etiketter: { aria: 'Kalkulator: desiliter til gram', mengde: 'Mengde', fra: 'Fra', til: 'Til', bytt: 'Bytt retning', vanlige: 'Vanlige mengder' },
    enheter: ENHETER, fra: 'dl', til: 'g', data: JSON.parse(json), vareHtml: vare,
    start: { mengde: '2', svar: fmt(2 * dl), setning: `2 dl ${esc(ord(forste))} = ${gram(2 * dl)}`, hurtig: KALK.steg.volum.map((v) => [v, `${v} dl`]) },
  });
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
const MVT = 'Matvaretabellen 2026 (Mattilsynet)';
const sti = (rad) => `${ROT}${rad.slug}/`;
const lenke = (rad, tekst = rad.navn) => `<a href="${sti(rad)}">${esc(tekst)}</a>`;
const STEG = [['Skriv inn mengden', 'Kalkulatoren regner om mens du skriver.']];
const SKJELETT = { stegTittel: 'Slik bruker du kalkulatoren', forst: '', alternativ: '', grense: '', seksjoner: [], cta: 'Regn om oppskrifter i Matlyst' };
const brodsmule = (...ledd) => brodsmuler([{ navn: 'Forside', adresse: '/' }, { navn: 'Verktøy', adresse: '/verktoy/' }, ...ledd]);

// De faste mengdene i tabellene, hurtigknappene og kalkulatorens data (enhetsfaktorene og veiledningen «2 eller 2,5»), skrevet ut eksplisitt. Ingen intervaller.
const FASTE_MENGDER = ['0,25', '0,5', '1', '1,5', '2', '2,5', '3', '4', '5', '10', '15', '25', '50', '100', '150', '250', '500', '1000', '236.5882365'];
const kildeTall = (k) => [String(k.aar), ...tallI(norskDato(k.hentet))];

/**
 * Tallene DEN siden kan bruke: radens egne kildetall, de utregnede verdiene, de faste mengdene, tall i postnavn og varianter,
 * og år og datoer for kildene siden viser. Tall fra den nære varen tillates bare der de vises (spørsmålet om den første nære varen).
 */
export function tillatteTall(rad, data) {
  const s = new Set(FASTE_MENGDER);
  const legg = (n) => s.add(fmt(n));
  const u = utregnet(rad);
  [u.dl, u.ss, u.ts, 2 * u.dl].forEach(legg);
  u.tabell.forEach(([, g]) => legg(g));
  u.tilbake.forEach(([, d]) => s.add(d));
  for (const t of [rad.tekst?.matvaretabell, rad.tekst?.andrePoster, rad.tekst?.usdaNavn, rad.tekst?.usdaFdcId, TEKST[rad.id]?.variant]) tallI(t).forEach((n) => s.add(n));
  for (const k of USDA_FELT) {
    if (!rad.tall[k]) continue;
    legg(rad.tall[k].verdi);
    tallI(rad.tall[k].merknad).forEach((n) => s.add(n));
  }
  const naer = publiserbare(data).find((r) => r.id === TEKST[rad.id]?.naer?.[0]);
  if (naer) { legg(naer.tall.dl.verdi); tallI(TEKST[naer.id].variant).forEach((n) => s.add(n)); }
  kildeTall(data.kilder.matvaretabellen).forEach((n) => s.add(n));
  if (usdaTall(rad).length) kildeTall(data.kilder.usda).forEach((n) => s.add(n));
  return s;
}

/** Samlesiden: alle varenes dl, ss og ts (varetabellen), antallet og indeksene i varevalget, eksemplet i spørsmålene og kildenes år og datoer. */
export function tillatteTallNav(data) {
  const alle = publiserbare(data);
  const s = new Set(FASTE_MENGDER);
  s.add(String(alle.length));
  alle.forEach((_, i) => s.add(String(i)));
  for (const r of alle) { const u = utregnet(r); [u.dl, u.ss, u.ts].forEach((n) => s.add(fmt(n))); }
  const hvete = alle.find((r) => r.id === 'hvetemel') ?? alle[0];
  const u = utregnet(hvete);
  s.add(fmt(2 * u.dl)); s.add(u.tilbake[0][1]);
  kildeTall(data.kilder.matvaretabellen).forEach((n) => s.add(n));
  return s;
}

const og = (liste) => (liste.length > 1 ? `${liste.slice(0, -1).join(', ')} og ${liste.at(-1)}` : liste[0]);

function sprikAvsnitt(rad, data) {
  const usda = usdaTall(rad);
  if (!usda.length) return '';
  const dl = rad.tall.dl.verdi;
  const o = ord(rad);
  const lik = usda.every((u) => u.verdi === dl);
  const innledning = lik
    ? `Matvaretabellen og USDA oppgir begge ${gram(dl)} for 1 dl ${esc(o)}.`
    : `Matvaretabellen oppgir ${gram(dl)} for 1 dl ${esc(o)}, USDA ${og(usda.map((u) => gram(u.verdi)))}. Vi bruker tallet fra Matvaretabellen.`;
  const rader = [
    `<tr class="valgt"><td>${MVT}<small>«${esc(rad.tekst.matvaretabell)}». Tallet vi bruker.</small></td><td>${gram(dl)}</td></tr>`,
    ...usda.map((u) => `<tr><td>USDA FoodData Central<small>«${esc(rad.tekst.usdaNavn)}» (FDC ${rad.tekst.usdaFdcId}). ${esc(`${u.gPerCup} g ${u.mal}`)}, regnet om fra cup til dl.</small></td><td>${gram(u.verdi)}</td></tr>`),
  ];
  return `<h2>Kildene side om side</h2>
<p>${innledning}</p>
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
    [`Hvor mange gram er 1 dl ${o}?`, `1 dl ${esc(t.variant)} veier ${gram(u.dl)}. Kilde: ${MVT}, «${esc(rad.tekst.matvaretabell)}».`],
    [`Hvor mange dl er 100 g ${o}?`, `100 g ${o} er ${u.tilbake[0][1]} dl.${u.dl === 100 ? '' : ` Del 100 på ${u.dl}.`}`],
    [`Hvor mye veier 1 ss ${o}?`, t.flytende
      ? `En spiseskje (15 ml) veier ${gram(u.ss)}, regnet ut fra dl-tallet. En teskje (5 ml) veier ${gram(u.ts)}.`
      : `En strøken spiseskje (15 ml) veier ${gram(u.ss)}, regnet ut fra dl-tallet. En strøken teskje (5 ml) veier ${gram(u.ts)}.`],
  ];
  const naer = (t.naer ?? []).map((id) => rader.find((r) => r.id === id)).filter(Boolean);
  const usda = usdaTall(rad);
  if (naer[0]) {
    const n = naer[0];
    const dlN = n.tall.dl.verdi;
    const svar = dlN === u.dl
      ? `Ja. 1 dl ${esc(TEKST[n.id].variant)} veier ${gram(dlN)}, like mye som ${esc(t.variant)}.`
      : `Nei. 1 dl ${esc(TEKST[n.id].variant)} veier ${gram(dlN)}, mot ${gram(u.dl)} for ${esc(t.variant)}.`;
    spm.push([`Veier ${ord(n)} det samme som ${o}?`, `${svar} ${lenke(n, `Se siden for ${ord(n)}`)}.`]);
  } else if (!usda.length) {
    spm.push([`Hvor mye er 1 liter ${o} i gram?`, `1 liter ${o} er 10 dl, og det veier ${gram(10 * u.dl)}. 1 kg ${o} er ${u.tilbake[3][1]} dl.`]);
  } else {
    const deler = usda.map((x) => `${esc(`${x.gPerCup} g ${x.mal}`)}, som tilsvarer ${gram(Math.round(Number(x.gPerCup.replace(',', '.')) / 2.365882))} per dl`);
    spm.push([`Hva oppgir USDA for 1 dl ${o}?`, `USDA har posten «${esc(kortUsdaNavn(rad.tekst.usdaNavn))}»: ${deler.join(', og ')}. Vi bruker Matvaretabellens ${gram(u.dl)}.`]);
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
  const t = TEKST[rad.id];
  const skjeer = t.flytende
    ? `En spiseskje (15 ml) er ${gram(u.ss)}, og en teskje (5 ml) er ${gram(u.ts)}, regnet ut fra dl-tallet.`
    : `En strøken spiseskje (15 ml) er ${gram(u.ss)}, og en strøken teskje (5 ml) er ${gram(u.ts)}, regnet ut fra dl-tallet.`;
  return `<p class="kortsvar"><b>Kort svar:</b> 1 dl ${esc(t.variant)} er ${gram(u.dl)}. ${skjeer}</p>
<p class="kilde">Kilde: <a href="#kilder">${MVT}</a>, «${esc(rad.tekst.matvaretabell)}».</p>`;
}

export function sideForRad(rad, data, rader) {
  const u = utregnet(rad);
  const o = ord(rad);
  const adresse = sti(rad);
  const lang = `1 dl ${o} i gram: regn om dl, ss og ts`;
  const title = lang.length <= 60 ? lang : `1 dl ${o} i gram: dl, ss og ts`;
  const medUsda = usdaTall(rad).length > 0;
  const variant = esc(TEKST[rad.id].variant);
  const description = `1 dl ${variant} veier ${gram(u.dl)}. Regn om mellom dl, ss, ts og gram, med tabell og tall${medUsda ? '' : 'et'} fra Matvaretabellen${medUsda ? ' og USDA' : ''}.`;
  const lead = `1 dl ${variant} veier ${gram(u.dl)}. Skriv inn mengden, så ser du vekten med en gang.`;
  const tabell = `<table class="otabell"><thead><tr><th scope="col">${esc(rad.navn)}</th><th scope="col">Gram</th></tr></thead><tbody>${u.tabell.map(([e, g]) => `<tr><td>${e}</td><td>${gram(g)}</td></tr>`).join('')}</tbody></table>`;
  const eks = u.tilbake.map(([g, d]) => `<li><b>${g === 1000 ? '1 kg' : `${g} g`}</b><span>${d} dl</span></li>`).join('');
  const rik = [
    `<div class="oto"><div class="okort"><h2>${esc(rad.navn)} fra dl til gram</h2><p>1 dl ${variant} veier ${gram(u.dl)}.</p>${tabell}</div>`,
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

/** Radens egne navn som duplikatvakten maskerer (test/hjelp/familievakt.mjs): ord og variant, og postene vi valgte bort. */
export const maskeNavn = (rad) => [ord(rad), TEKST[rad.id]?.variant, ...JSON.parse(rad.tekst?.andrePoster ?? '[]').map(([n]) => n)];

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
  const description = `Hva veier 1 dl? Regn om dl, ss, ts og gram for ${rader.length} varer, fra mel og sukker til smør og melk, med kilde på hvert tall.`;
  const kilder = kilderFor(data, rader.map((r) => ({ ...r, tall: { dl: r.tall.dl } })));
  const rik = [
    `<h2>Hva veier 1 dl?</h2><p>Trykk på en vare for flere mengder, gram til dl og kilder.</p>
<div class="varerull"><table class="varer"><thead><tr><th scope="col">Vare</th><th scope="col">1 dl</th><th scope="col">1 ss (15 ml)</th><th scope="col">1 ts (5 ml)</th></tr></thead><tbody>${rows}</tbody></table></div>`,
    APPKORT,
    `<h2>Hvorfor veier ikke 1 dl det samme?</h2><p>Desiliter måler volum, og gram måler vekt. 1 dl ${ord(tung)} veier ${gram(tung.tall.dl.verdi)}, og 1 dl ${ord(lett)} veier ${gram(lett.tall.dl.verdi)}. Derfor har hver vare sitt eget tall når du regner mellom dl og gram.</p>
<h2>Slik har vi regnet</h2><p>Vekten per dl er hentet fra Matvaretabellen 2026 (Mattilsynet). Spiseskje og teskje regnes som strøkne mål på 15 ml og 5 ml. Gram til dl regnes ved å dele vekten på tallet for varen.</p>`,
    kildeliste(data, kilder),
    `<div class="related"><h2>Beslektede omregninger</h2><ul><li><a href="/verktoy/dl-til-ss/">dl til ss</a></li><li><a href="/verktoy/dl-til-ts/">dl til ts</a></li><li><a href="/verktoy/dl-til-ml/">dl til ml</a></li><li><a href="/verktoy/dl-til-kopp/">dl til kopp</a></li><li><a href="/verktoy/kopp-til-dl/">kopp til dl</a></li><li><a href="/verktoy/enhetsomregner/">Enhetsomregner</a></li></ul></div>`,
  ].join('\n');
  const faq = [
    ['Hvor mange gram er 1 dl?', `Det kommer an på varen. ${eksTekst.length ? `${rekke.charAt(0).toUpperCase()}${rekke.slice(1)}.` : ''} Velg varen i kalkulatoren eller i tabellen.`.replace('  ', ' ')],
    ['Hvordan regner jeg om dl til gram?', `Gang antall dl med vekten per dl for varen. 1 dl ${ord(eks[0] ?? lett)} veier ${gram((eks[0] ?? lett).tall.dl.verdi)}, så 2 dl blir ${gram(2 * (eks[0] ?? lett).tall.dl.verdi)}.`],
    ['Hvordan regner jeg om gram til dl?', `Del antall gram på det 1 dl av varen veier. 100 g ${ord(eks[0] ?? lett)} er ${utregnet(eks[0] ?? lett).tilbake[0][1]} dl.`],
    ['Hvor kommer tallene fra?', 'Vekten per dl er hentet fra Matvaretabellen 2026 (Mattilsynet).'],
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

// Malen for familien «dl til gram» på engelsk («cups to grams»): en samleside og én side per vare, skrevet fra data.en.json.
// Malen skriver bare tall som kan regnes ut fra datafila (se tillatteTall). Teksten per vare ligger i tekst-en.mjs og varer-en.mjs.
// Amerikansk engelsk, punktum som desimaltegn. Gram er grunnlaget; ounces, tablespoon og teaspoon regnes fra cup (1 cup = 16 tbsp = 48 tsp).
import { kilderFor, publiserbare } from '../felles.mjs';
import { artikkel, elementliste, webApplikasjon } from '../skjema.mjs';
import { esc, gramTekst, kalkSkjelett, mengdeTekst, tallI } from './felles-mal.mjs';
import { TEKST_EN } from './tekst-en.mjs';
import { VARER_EN } from './varer-en.mjs';

const ROT = '/en/tools/cups-to-grams/';
const ML_PER_CUP = 236.5882365;
const ML_PER_CUP_DL = 2.365882365;
const G_PER_OZ = 28.349523125;
const SKJE_PER_CUP = { tbsp: 16, tsp: 48 };
const vareEn = (id) => VARER_EN.find((v) => v.id === id);
const gram = (n) => `${gramTekst(n)} g`;
const ouncesTekst = (n) => mengdeTekst(n / G_PER_OZ);
const MAANEDER = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const engelskDato = (iso) => { const [a, m, d] = iso.split('-').map(Number); return `${MAANEDER[m - 1]} ${d}, ${a}`; };
const kortUsdaNavn = (navn) => navn.replace(/\s*\(Includes[^)]*\)/u, '');
const cupsEnhet = (tekst) => (tekst === '1' ? 'cup' : 'cups');
const erTsp = (rad) => Boolean(rad.tall.tsp);
const sti = (rad) => `${ROT}${rad.slug}/`;
const lenke = (rad, tekst = rad.navn) => `<a href="${sti(rad)}">${esc(tekst)}</a>`;
const ord = (rad) => vareEn(rad.id).ord;
const variant = (rad) => vareEn(rad.id).variant;

/** Alle utregninger på siden, ett sted. Tallene i tabellene er tekst slik de skrives (reglene i felles-mal.mjs, samme som kalkulatoren). */
export function utregnetEn(rad) {
  const tsp = erTsp(rad);
  const gPerCup = tsp ? rad.tall.tsp.verdi * SKJE_PER_CUP.tsp : rad.tall.cup.verdi;
  const perCup = (brøk) => gPerCup * brøk;
  const rad_ = (etikett, g) => [etikett, gramTekst(g), ouncesTekst(g)];
  const cups = [['1/4 cup', 1 / 4], ['1/3 cup', 1 / 3], ['1/2 cup', 1 / 2], ['2/3 cup', 2 / 3], ['3/4 cup', 3 / 4], ['1 cup', 1], ['2 cups', 2]];
  const tabell = tsp
    ? [['1/2 tsp', 1 / 96], ['1 tsp', 1 / 48], ['2 tsp', 1 / 24], ['1 tbsp', 1 / 16], ['1/4 cup', 1 / 4], ['1/2 cup', 1 / 2], ['1 cup', 1]].map(([e, b]) => rad_(e, perCup(b)))
    : [['1 tsp', 1 / 48], ['1 tbsp', 1 / 16], ...cups].map(([e, b]) => rad_(e, perCup(b)));
  const grunn = tsp ? rad.tall.tsp.verdi : gPerCup;
  const tilbake = (tsp ? [5, 10, 25, 50] : [50, 100, 250, 500]).map((g) => [g, mengdeTekst(g / grunn)]);
  return {
    gPerCup, gPerDl: gPerCup / ML_PER_CUP_DL, oz: ouncesTekst(gPerCup), grunn,
    tbsp: gramTekst(gPerCup / SKJE_PER_CUP.tbsp), tsp: gramTekst(gPerCup / SKJE_PER_CUP.tsp),
    tabell, tilbake,
  };
}

// ---- Kalkulatorkortet (HTML- og datakontrakten fra designspec 16.8, engelsk utgave) ----

const ENHETER = [['cups', 'Cups'], ['tbsp', 'Tablespoons (tbsp)'], ['tsp', 'Teaspoons (tsp)'], ['floz', 'Fluid ounces (fl oz)'], ['ml', 'Milliliters (ml)'], ['g', 'Grams (g)'], ['oz', 'Ounces (oz)'], ['lb', 'Pounds (lb)']];
export const KALK_EN = {
  varer: null,
  brok: true,
  ml: { cups: ML_PER_CUP, tbsp: 14.78676478125, tsp: 4.92892159375, floz: 29.5735295625, ml: 1 },
  g: { g: 1, oz: G_PER_OZ, lb: 453.59237 },
  kort: { cups: ['cup', 'cups'], tbsp: 'tbsp', tsp: 'tsp', floz: 'fl oz', ml: 'ml', g: 'g', oz: 'oz', lb: 'lb' },
  stegFor: { cups: 'cup', tbsp: 'skje', tsp: 'skje', floz: 'floz', ml: 'ml', g: 'g', oz: 'oz', lb: 'lb' },
  byttTil: { cups: '1', tbsp: '1', tsp: '1', floz: '8', ml: '100', g: '100', oz: '4', lb: '1' },
  steg: {
    cup: ['1/4', '1/3', '1/2', '3/4', '1', '2'],
    skje: ['1/2', '1', '2', '3', '4', '8'],
    floz: ['1', '2', '4', '6', '8', '16'],
    ml: ['30', '60', '125', '250', '500', '1000'],
    g: ['50', '100', '150', '250', '500', '1000'],
    oz: ['1', '2', '4', '8', '12', '16'],
    lb: ['1/4', '1/2', '1', '2', '3', '5'],
  },
  feil: 'Enter an amount, like 2 or 1/2.',
};
// Entall for nøyaktig 1 og for en ekte brøk under 1 («1/4 cup»), som kalkulatorkortet (site.js, tolkMengde).
const brokUnder1 = (v) => { const m = /^(\d+)\/(\d+)$/u.exec(v); return Boolean(m) && Number(m[2]) > Number(m[1]); };
const hurtigTekst = (v, e) => `${v} ${e === 'cup' && v !== '1' && !brokUnder1(v) ? 'cups' : e}`;

/** Kalkulatorkortet. Med `fast` står varen fast øverst; ellers velges den i en liste. Hevemidler starter på teskje, alle andre på cup. */
export function kalkHtmlEn({ rader, fast }) {
  const varer = fast ? [fast] : [...rader].sort((a, b) => a.navn.localeCompare(b.navn, 'en'));
  const forste = fast ?? varer.find((r) => r.id === 'hvetemel') ?? varer[0];
  const indeks = varer.indexOf(forste);
  const enhet = erTsp(forste) ? 'tsp' : 'cups';
  const u = utregnetEn(forste);
  const svar = gramTekst(2 * (enhet === 'tsp' ? u.gPerCup / SKJE_PER_CUP.tsp : u.gPerCup));
  const data = { ...KALK_EN, varer: varer.map((r) => [ord(r), utregnetEn(r).gPerDl]) };
  const vare = fast
    ? `<div class="kalkvare"><span><span class="hva">Ingredient</span><br><b>${esc(fast.navn)}</b></span><a href="${ROT}">Change ingredient</a></div>`
    : `<div class="kalkvare"><label><span class="hva">Ingredient</span><select data-felt="vare">${varer.map((r, i) => `<option value="${i}"${i === indeks ? ' selected' : ''}>${esc(r.navn)}</option>`).join('')}</select></label></div>`;
  const grp = enhet === 'tsp' ? KALK_EN.steg.skje : KALK_EN.steg.cup;
  return kalkSkjelett({
    etiketter: { aria: 'Calculator: cups to grams', mengde: 'Amount', fra: 'From', til: 'To', bytt: 'Swap direction', vanlige: 'Common amounts' },
    enheter: ENHETER, fra: enhet, til: 'g', data, vareHtml: vare,
    start: { mengde: '2', svar, setning: `2 ${enhet === 'tsp' ? 'tsp' : 'cups'} ${esc(ord(forste))} = ${svar} g`, hurtig: grp.map((v) => [v, hurtigTekst(v, enhet === 'tsp' ? 'tsp' : 'cup')]) },
  });
}

// ---- USDA-porsjonene ----

const delEtikett = (etikett) => { const m = /^(\d+(?:\.\d+)?) (.+)$/u.exec(etikett); return m ? { mengde: Number(m[1]), mod: m[2] } : { mengde: 1, mod: etikett }; };
const SKJULES = /container|package|box|NLEA|slice|packet|dash|cube|cubic inch|^almond$|^(?:extra|small|medium|large)\b/u;
const BEHOLDES = /^(?:cup|tbsp|tablespoon|tsp|teaspoon|stick|pat|fl oz|quart|ml|serving 1)/u;
/** Porsjoner som sier leseren noe om cups, skjeer og stick. Mengder utenfor 1 («2 tbsp», «50 raisins») står med mengden slik USDA skriver den. */
export function visPorsjon(etikett) {
  const { mengde, mod } = delEtikett(etikett);
  if (SKJULES.test(mod)) return false;
  return mengde !== 1 || BEHOLDES.test(mod);
}
/** Porsjonene i én av radens poster (prefiks '' eller 'b_'), med grunnlaget først: [etikett, gram, brukt]. Brukt gjelder bare den første posten. */
export function usdaPorsjoner(rad, prefiks = '') {
  const grunnNokkel = `${prefiks}${rad.tall[`${prefiks}cup`] ? 'cup' : 'tsp'}`;
  return Object.entries(rad.tall)
    .filter(([felt]) => felt.startsWith('b_') === (prefiks === 'b_'))
    .filter(([felt, t]) => felt === grunnNokkel || visPorsjon(t.merknad))
    .map(([felt, t]) => [t.merknad, t.verdi, prefiks === '' && felt === grunnNokkel]);
}
/** Postene raden bygger på: [{ fdcId, navn, prefiks }]. */
export const poster = (rad) => [{ fdcId: rad.tekst.fdcId, navn: rad.tekst.usdaNavn, prefiks: '' }, ...(rad.tekst.fdcId2 ? [{ fdcId: rad.tekst.fdcId2, navn: rad.tekst.usdaNavn2, prefiks: 'b_' }] : [])];
/** USDAs egne tbsp- og tsp-tall som avviker mer enn 10 prosent fra det som regnes ut fra cup (eller teskje): [enhet, USDAs tall, utregnet gram per enhet]. */
export function skjeAvvik(rad) {
  const u = utregnetEn(rad);
  const ut = [];
  for (const [etikett, verdi] of usdaPorsjoner(rad)) {
    const { mengde, mod } = delEtikett(etikett);
    if (mengde !== 1) continue;
    const enhet = /^(?:tbsp|tablespoon)$/u.test(mod) ? 'tbsp' : /^(?:tsp|teaspoon)$/u.test(mod) ? 'tsp' : null;
    if (!enhet || (enhet === 'tsp' && erTsp(rad))) continue;
    const regnet = u.gPerCup / SKJE_PER_CUP[enhet];
    if (Math.abs(verdi - regnet) / regnet > 0.1) ut.push([enhet, verdi, regnet]);
  }
  return ut;
}

const kildeLinje = (k) => `${esc(k.utgiver)}. ${esc(k.navn)} (${k.aar}). <a href="${esc(k.adresse)}" rel="noopener">${esc(new URL(k.adresse).hostname)}</a>. Retrieved ${engelskDato(k.hentet)}.`;
const kildeliste = (kilder) => `<h2>Sources</h2>\n<ol class="kilder" id="sources">${kilder.map((k) => `<li>${kildeLinje(k)}</li>`).join('')}</ol>`;

// Samme kortoppsett som APPKORT i mal-nb.mjs: overskrift og kort med telefonbilde. Teksten er setninger fra «Stop converting by hand» på de engelske
// omregnersidene, og bildet er det de bruker for Units (images/en-guide/bilder.json, matlyst-settings-units-language).
const APPKORT = `<h2>Stop converting by hand</h2>
<aside class="i-appen i-enheter"><div class="i-appen-tekst"><p class="i-appen-tittel"><img src="/images/icon-64.png" width="22" height="22" alt="">In Matlyst</p><p>With Units set to Metric in Settings, cups, ounces, and pounds from a US recipe are converted to milliliters and grams as you import it. The setting applies to new imports.</p><a class="more" href="/en/recipe-book-app/">Read more</a></div><div class="i-appen-media"><img class="tel" src="/images/en-guide/matlyst-settings-units-language-400.webp" srcset="/images/en-guide/matlyst-settings-units-language-400.webp 400w, /images/en-guide/matlyst-settings-units-language-800.webp 800w" sizes="200px" width="400" height="870" loading="lazy" decoding="async" alt="Settings screen with Units set to US and the language set to English"></div></aside>`;

const EYEBROW_VARE = `Tools<span aria-hidden="true"> › </span><a href="${ROT}">Cups to grams</a>`;
const EYEBROW_NAV = 'Tools<span aria-hidden="true"> › </span>Cups to grams';
const STEG = [['Type an amount', 'The calculator converts as you type.']];
const SKJELETT = { stegTittel: 'How to use the calculator', forst: '', alternativ: '', grense: '', seksjoner: [], cta: 'Convert recipes in Matlyst' };

// De faste tallene på sidene: brøkene i hurtigknappene og tabellene, enhetsfaktorene i kalkulatorens data, definisjonene av enhetene,
// og tallene i appkortet. Ingen intervaller.
const FASTE = ['1/4', '1/3', '1/2', '2/3', '3/4', '1', '2', '3', '4', '5', '6', '8', '12', '16', '20', '25', '30', '48', '50', '60', '96', '100', '125', '150', '250', '500', '1000', '236.6', '28.35', '454',
  ...Object.values(KALK_EN.ml).map(String), ...Object.values(KALK_EN.g).map(String), ...Object.values(KALK_EN.steg).flat(), ...Object.values(KALK_EN.byttTil)];
const kildeTall = (k) => [String(k.aar), ...tallI(engelskDato(k.hentet))];

/** Tallene DEN siden kan bruke: radens egne USDA-tall og postnavn, de utregnede verdiene, de faste tallene og tallene til nære varer og andre porsjoner. */
export function tillatteTall(rad, data) {
  const s = new Set(FASTE);
  const u = utregnetEn(rad);
  const tsp = erTsp(rad);
  [u.gPerCup, u.gPerDl, u.grunn].forEach((n) => s.add(String(n)));
  [u.oz, u.tbsp, u.tsp, gramTekst(u.gPerCup), ouncesTekst(u.gPerCup)].forEach((t) => s.add(t));
  for (const [, g, o] of u.tabell) { s.add(g); s.add(o); }
  for (const [g, c] of u.tilbake) { s.add(String(g)); s.add(c); }
  s.add(mengdeTekst(453.59237 / (tsp ? u.grunn : u.gPerCup))); s.add(mengdeTekst(1000 / (tsp ? u.grunn : u.gPerCup)));
  for (const t of Object.values(rad.tall)) { s.add(String(t.verdi)); tallI(t.merknad).forEach((n) => s.add(n)); s.add(gramTekst(t.verdi)); s.add(ouncesTekst(t.verdi)); }
  for (const [, usda, regnet] of skjeAvvik(rad)) { s.add(String(usda)); s.add(gramTekst(regnet)); }
  for (const t of [rad.tekst?.usdaNavn, rad.tekst?.fdcId, rad.tekst?.usdaNavn2, rad.tekst?.fdcId2, variant(rad)]) tallI(t).forEach((n) => s.add(n));
  for (const id of TEKST_EN[rad.id]?.naer ?? []) {
    const n = publiserbare(data).find((r) => r.id === id);
    if (!n) continue;
    const un = utregnetEn(n);
    [String(un.gPerCup), String(un.grunn), gramTekst(un.gPerCup), gramTekst(un.grunn)].forEach((x) => s.add(x));
    tallI(variant(n)).forEach((x) => s.add(x));
  }
  kildeTall(data.kilder.usda).forEach((n) => s.add(n));
  return s;
}

/** Samlesiden: alle varenes cup, ounces, tbsp og tsp (varetabellen), antallet og indeksene i varevalget, og kildenes år og dato. */
export function tillatteTallNav(data) {
  const alle = publiserbare(data);
  const s = new Set(FASTE);
  s.add(String(alle.length));
  alle.forEach((_, i) => s.add(String(i)));
  for (const r of alle) {
    const u = utregnetEn(r);
    [String(u.gPerDl), gramTekst(u.gPerCup), u.oz, u.tbsp, u.tsp, String(u.gPerCup)].forEach((t) => s.add(t));
  }
  const hvete = alle.find((r) => r.id === 'hvetemel') ?? alle[0];
  const uh = utregnetEn(hvete);
  s.add(gramTekst(2 * uh.gPerCup)); s.add(uh.tilbake[1][1]);
  for (const r of alle) for (const [g] of utregnetEn(r).tilbake) s.add(String(g));
  kildeTall(data.kilder.usda).forEach((n) => s.add(n));
  return s;
}

function usdaAvsnitt(rad, data) {
  const t = TEKST_EN[rad.id] ?? {};
  const tabellFor = (prefiks) => `<table class="sprik"><thead><tr><th scope="col">Portion</th><th scope="col">Grams</th></tr></thead><tbody>${usdaPorsjoner(rad, prefiks).map(([etikett, g, brukt]) => `<tr${brukt ? ' class="valgt"' : ''}><td>${esc(etikett)}${brukt ? '<small>Used in the calculator</small>' : ''}</td><td>${g} g</td></tr>`).join('')}</tbody></table>`;
  const [forste, andre] = poster(rad);
  const avvik = skjeAvvik(rad).map(([e, usda, regnet]) => `<p>USDA lists 1 ${e} of ${esc(ord(rad))} as ${usda} g. The calculator and the chart use the ${erTsp(rad) ? 'teaspoon' : 'cup'} weight, which gives ${gramTekst(regnet)} g for 1 ${e}.</p>`).join('\n');
  const stick = Object.values(rad.tall).find((x) => x.merknad === 'stick');
  const naer = (t.naer ?? []).map((id) => publiserbare(data).find((r) => r.id === id)).filter(Boolean);
  const grunnTall = rad.tall.cup ?? rad.tall.tsp;
  const likt = andre && rad.tall.b_cup && rad.tall.b_cup.verdi === grunnTall.verdi ? `\n<p>Both entries list ${grunnTall.verdi} g for 1 ${grunnTall.merknad}.</p>` : '';
  return `<h2>USDA entries</h2>
<p>USDA FoodData Central, SR Legacy, FDC ID ${forste.fdcId}: “${esc(forste.navn)}”. Every portion in the ${andre ? 'entries' : 'entry'} is shown as USDA writes it.</p>
${tabellFor('')}${andre ? `\n<p>FDC ID ${andre.fdcId}: “${esc(andre.navn)}”.</p>\n${tabellFor('b_')}${likt}` : ''}${avvik ? `\n${avvik}` : ''}${naer.length ? `\n<p>Close entries with their own page: ${naer.map((n) => lenke(n)).join(', ')}.</p>` : ''}`;
}

function spmForRad(rad, data, rader, u) {
  const t = TEKST_EN[rad.id] ?? {};
  const o = ord(rad);
  const v = variant(rad);
  const tsp = erTsp(rad);
  const enhet = tsp ? 'teaspoon' : 'cup';
  const kilde = `Source: USDA FoodData Central, SR Legacy, ${poster(rad).map((p) => `FDC ID ${p.fdcId}, “${esc(kortUsdaNavn(p.navn))}”`).join(' and ')}.`;
  const spm = [[
    `How many grams are in a ${enhet} of ${o}?`,
    `1 ${enhet} of ${v} weighs ${tsp ? gram(u.grunn) : gram(u.gPerCup)} (${tsp ? ouncesTekst(u.grunn) : u.oz} oz). ${kilde}`,
  ]];
  const [g0, c0] = u.tilbake[1];
  spm.push(tsp
    ? [`How many teaspoons is ${g0} grams of ${o}?`, `${g0} g of ${v} is ${c0} tsp. Divide the grams by ${u.grunn}.`]
    : [`How many cups is ${g0} grams of ${o}?`, `${g0} g of ${v} is ${c0} ${cupsEnhet(c0)}. Divide the grams by ${u.gPerCup}.`]);
  spm.push([`How much does 1 tablespoon of ${o} weigh?`, tsp
    ? `1 teaspoon of ${v} weighs ${u.tsp} g. 1 tablespoon of ${v}, calculated from the teaspoon weight, is ${u.tbsp} g.`
    : `1 tablespoon of ${v} weighs ${u.tbsp} g and 1 teaspoon weighs ${u.tsp} g, calculated from the cup weight.`]);
  const stick = Object.values(rad.tall).find((x) => x.merknad === 'stick');
  const alt = t.alt && Object.values(rad.tall).find((x) => x.merknad === t.alt.porsjon);
  const naer = (t.naer ?? []).map((id) => rader.find((r) => r.id === id)).filter(Boolean);
  if (stick) {
    spm.push([`How many grams are in a stick of ${o}?`, `USDA lists 1 stick of ${v} as ${stick.verdi} g.`]);
  } else if (alt) {
    spm.push([t.alt.sporsmal, `USDA lists ${alt.verdi} g for 1 ${t.alt.porsjon}. This page uses 1 ${rad.tall.cup.merknad}, which is ${rad.tall.cup.verdi} g.`]);
  } else if (naer[0] && utregnetEn(naer[0]).gPerCup !== u.gPerCup) {
    // Samme vekt gir ikke et eget spørsmål: «Yes, the same» ville gjort de to sidene til speilbilder av hverandre.
    const n = naer[0];
    const un = utregnetEn(n);
    const tall = (x) => (tsp ? gram(x.grunn) : gram(x.gPerCup));
    spm.push([`Does ${ord(n)} weigh the same as ${o}?`, `No. 1 ${enhet} of ${variant(n)} weighs ${tall(un)}, compared with ${tall(u)} for ${v}.`]);
  } else {
    spm.push([`How many ounces does a cup of ${o} weigh?`, `1 cup of ${v} weighs ${u.oz} oz. A cup holds 8 fluid ounces.`]);
  }
  return spm;
}

function andreVarer(rad, rader) {
  const naer = (TEKST_EN[rad.id]?.naer ?? []).map((id) => rader.find((r) => r.id === id)).filter(Boolean);
  const i = rader.indexOf(rad);
  const etter = [...rader.slice(i + 1), ...rader.slice(0, i)].filter((r) => !naer.includes(r));
  const valgt = [...naer, ...etter].slice(0, 8);
  return `<div class="related"><h2>Other ingredients</h2><ul>${[...valgt.map((r) => `<li>${lenke(r)}</li>`), `<li><a href="${ROT}">All ingredients</a></li>`].join('')}</ul></div>`;
}

function kortsvar(rad, u) {
  const v = esc(variant(rad));
  const svar = erTsp(rad)
    ? `1 teaspoon of ${v} is ${gram(u.grunn)}. 1 tablespoon is ${u.tbsp} g and 1 cup is ${gram(u.gPerCup)}, calculated from the teaspoon weight.`
    : `1 cup of ${v} is ${gram(u.gPerCup)}. 1 tablespoon is ${u.tbsp} g and 1 teaspoon is ${u.tsp} g, calculated from the cup weight.`;
  return `<p class="kortsvar"><b>Short answer:</b> ${svar}</p>
<p class="kilde">Source: <a href="#sources">USDA FoodData Central, SR Legacy</a>, ${poster(rad).map((p) => `“${esc(p.navn)}”`).join(' and ')}.</p>`;
}

const tittel = (navn, enhet, g, medOunces) => `${navn}: ${enhet} to grams${medOunces ? ' and ounces' : ''} (1 ${enhet === 'cups' ? 'cup' : 'tsp'} = ${g} g)`;

export function sideForRad(rad, data, rader) {
  const u = utregnetEn(rad);
  const tsp = erTsp(rad);
  const o = ord(rad);
  const v = esc(variant(rad));
  const enhetNavn = tsp ? 'teaspoons' : 'cups';
  const enhetEn = tsp ? 'teaspoon' : 'cup';
  const gEn = gram(tsp ? u.grunn : u.gPerCup);
  const ozEn = tsp ? ouncesTekst(u.grunn) : u.oz;
  const adresse = sti(rad);
  const gTall = gramTekst(tsp ? u.grunn : u.gPerCup);
  const kandidater = [tittel(rad.navn, enhetNavn, gTall, true), tittel(rad.navn, enhetNavn, gTall, false), `${rad.navn}: ${enhetNavn} to grams`];
  const title = kandidater.find((t) => t.length <= 60) ?? kandidater.at(-1);
  const lead = `1 ${enhetEn} of ${v} weighs ${gEn} (${ozEn} oz). Type an amount to convert.`;
  const beskr = (kort) => `1 ${enhetEn} of ${variant(rad)} weighs ${gEn} (${ozEn} oz). Convert ${tsp ? 'teaspoons, tablespoons, and cups' : 'cups, tablespoons, and teaspoons'} to grams and ounces${kort ? '.' : ', with a chart and USDA numbers.'}`;
  const description = beskr(false).length <= 160 ? beskr(false) : beskr(true);
  const tabell = `<table class="otabell"><thead><tr><th scope="col">${esc(rad.navn)}</th><th scope="col">Grams</th><th scope="col">Ounces</th></tr></thead><tbody>${u.tabell.map(([e, g, oz]) => `<tr><td>${e}</td><td>${g} g</td><td>${oz} oz</td></tr>`).join('')}</tbody></table>`;
  const eks = u.tilbake.map(([g, c]) => `<li><b>${g} g</b><span>${c} ${tsp ? 'tsp' : cupsEnhet(c)}</span></li>`).join('');
  const pundCups = mengdeTekst(453.59237 / (tsp ? u.grunn : u.gPerCup));
  const kiloCups = mengdeTekst(1000 / (tsp ? u.grunn : u.gPerCup));
  const pund = `<p>1 pound of ${v} is ${gramTekst(453.59237)} g, or ${pundCups} ${tsp ? 'tsp' : cupsEnhet(pundCups)}. 1 kilogram is 1000 g, or ${kiloCups} ${tsp ? 'tsp' : cupsEnhet(kiloCups)} of ${v}.</p>`;
  const rik = [
    `<div class="oto"><div class="okort"><h2>${esc(rad.navn)} in grams and ounces</h2><p>1 ${enhetEn} of ${v} weighs ${gEn}.</p>${tabell}</div>`,
    `<div class="okort"><h2>Convert grams back to ${enhetNavn}</h2><p>Divide the weight in grams by ${tsp ? u.grunn : u.gPerCup} to get ${enhetNavn} of ${esc(o)}. Going the other way, multiply ${enhetNavn} by ${tsp ? u.grunn : u.gPerCup}.</p><p class="formel"><span>${enhetNavn}</span><i>=</i><span>grams</span><i>÷</i><b>${tsp ? u.grunn : u.gPerCup}</b></p><p class="liten">Examples</p><ul class="eksempler">${eks}</ul>${pund}</div></div>`,
    APPKORT,
    `<h2>Ounces: volume and weight</h2>\n<p>A cup holds 8 fluid ounces. A cup of ${v} weighs ${u.oz} oz.</p>`,
    usdaAvsnitt(rad, data),
    kildeliste(kilderFor(data, [rad])),
    andreVarer(rad, rader),
  ].join('\n');
  return {
    title, description, eyebrow: EYEBROW_VARE, h1: `${rad.navn}: ${enhetNavn} to grams`, lead,
    topp: `${kalkHtmlEn({ rader, fast: rad })}\n${kortsvar(rad, u)}`,
    steg: STEG, ...SKJELETT, rik,
    faqTittel: `Questions about ${o}`, faq: spmForRad(rad, data, rader, u),
    publisert: rad.oppdatert,
    schemas: [
      webApplikasjon({ navn: `${rad.navn}: ${enhetNavn} to grams`, beskrivelse: description, adresse, sprak: 'en' }),
      artikkel({ tittel: `${rad.navn}: ${enhetNavn} to grams`, beskrivelse: description, adresse, sprak: 'en', publisert: rad.oppdatert, kilder: kilderFor(data, [rad]) }),
      'faq',
    ],
  };
}

export function navSide(data, rader) {
  const sortert = [...rader].sort((a, b) => a.navn.localeCompare(b.navn, 'en'));
  const kjent = (id) => rader.find((r) => r.id === id);
  const eks = [kjent('hvetemel'), kjent('sukker'), kjent('smor')].filter(Boolean);
  const cupG = (r) => utregnetEn(r).gPerCup;
  const etterVekt = [...rader].sort((a, b) => cupG(a) - cupG(b));
  const lett = etterVekt[0];
  const tung = etterVekt.at(-1);
  const rekke = eks.map((r) => `1 cup of ${variant(r)} is ${gram(cupG(r))}`);
  const rekkeTekst = `${rekke.slice(0, -1).join(', ')}, and ${rekke.at(-1)}`;
  const hvete = eks[0] ?? lett;
  const uh = utregnetEn(hvete);
  const rows = sortert.map((r) => { const u = utregnetEn(r); return `<tr><td>${lenke(r)}</td><td>${gram(u.gPerCup)}</td><td>${u.oz} oz</td><td>${u.tbsp} g</td><td>${u.tsp} g</td></tr>`; }).join('');
  const title = `Cups to grams: calculator and chart for ${rader.length} ingredients`;
  const description = `How much does a cup weigh? Convert cups, tablespoons, and teaspoons to grams and ounces for ${rader.length} ingredients, with USDA numbers.`;
  const kilder = kilderFor(data, rader);
  const rik = [
    `<h2>What does 1 cup weigh?</h2><p>Select an ingredient for more amounts, grams to cups, and the USDA entries.</p>
<div class="varerull"><table class="varer"><thead><tr><th scope="col">Ingredient</th><th scope="col">1 cup (g)</th><th scope="col">1 cup (oz)</th><th scope="col">1 tbsp (g)</th><th scope="col">1 tsp (g)</th></tr></thead><tbody>${rows}</tbody></table></div>`,
    APPKORT,
    `<h2>Why a cup does not weigh the same</h2><p>A cup measures volume, and grams measure weight. 1 cup of ${esc(variant(tung))} weighs ${gram(cupG(tung))}, and 1 cup of ${esc(variant(lett))} weighs ${gram(cupG(lett))}. So every ingredient has its own number when you convert between cups and grams.</p>
<h2>How we calculated</h2><p>The cup weights come from USDA FoodData Central, SR Legacy. Tablespoons and teaspoons are calculated from the cup weight (1 cup = 16 tbsp = 48 tsp). For baking powder, baking soda, and active dry yeast, USDA lists a teaspoon, so the cup weight is calculated from the teaspoon weight. Ounces are weight ounces (1 oz = 28.35 g), not fluid ounces.</p>`,
    kildeliste(kilder),
    `<div class="related"><h2>Related conversions</h2><ul><li><a href="/en/tools/cups-to-tbsp/">Cups to tablespoons</a></li><li><a href="/en/tools/cups-to-tsp/">Cups to teaspoons</a></li><li><a href="/en/tools/cups-to-ml/">Cups to milliliters</a></li><li><a href="/en/tools/g-to-oz/">Grams to ounces</a></li><li><a href="/en/tools/oz-to-g/">Ounces to grams</a></li><li><a href="/en/tools/g-to-lb/">Grams to pounds</a></li><li><a href="/en/tools/unit-converter/">Unit converter</a></li></ul></div>`,
  ].join('\n');
  const [g0, c0] = uh.tilbake[1];
  const faq = [
    ['How many grams are in a cup?', `It depends on the ingredient. ${rekkeTekst}.`],
    ['How do I convert cups to grams?', `Multiply the cups by the weight of 1 cup of the ingredient. 1 cup of ${ord(hvete)} weighs ${gram(uh.gPerCup)}, so 2 cups weigh ${gram(2 * uh.gPerCup)}.`],
    ['How do I convert grams to cups?', `Divide the grams by the weight of 1 cup. ${g0} g of ${ord(hvete)} is ${c0} ${cupsEnhet(c0)}.`],
    ['Where do the numbers come from?', 'From USDA FoodData Central, SR Legacy. Tablespoons and teaspoons are calculated from the cup weight.'],
  ];
  return {
    title, description, eyebrow: EYEBROW_NAV, h1: 'Cups to grams',
    lead: 'How much a cup weighs depends on what is in it. Pick an ingredient, then type an amount to convert.',
    topp: `${kalkHtmlEn({ rader })}
<p class="kortsvar"><b>Short answer:</b> ${rekkeTekst}.</p>
<p class="kilde">Source: <a href="#sources">USDA FoodData Central, SR Legacy</a>. Tablespoons and teaspoons are calculated from the cup weight.</p>`,
    steg: STEG, ...SKJELETT, rik,
    faqTittel: 'Questions about cups to grams', faq,
    publisert: rader.map((r) => r.oppdatert).sort().at(-1),
    schemas: [
      webApplikasjon({ navn: 'Cups to grams', beskrivelse: description, adresse: ROT, sprak: 'en' }),
      artikkel({ tittel: 'Cups to grams', beskrivelse: description, adresse: ROT, sprak: 'en', publisert: rader.map((r) => r.oppdatert).sort().at(-1), kilder }),
      elementliste({ navn: 'Cups to grams: all ingredients', adresse: ROT, elementer: sortert.map((r) => ({ navn: r.navn, adresse: sti(r) })) }),
      'faq',
    ],
  };
}

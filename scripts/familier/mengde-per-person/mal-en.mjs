// Template for the family «mengde per person» (en-US): a hub page (/en/how-much-per-person/) and one page per food or dish, written from data.en.json.
// Every number comes from a US source with a link and a year (kildekontroll.mjs checks the quotes against the source pages). The text per page is in tekst-en.mjs
// and writes numbers through the helpers (h.t, h.r, h.sum ...), which also note which sources the page uses, so the source list is exactly what the page uses.
// The rules (tables and the calculator's starting answer) are in regn-en.mjs, and the calculator itself in site.js (the block «portion»).
// US measures first, metric in parentheses. The source's figures are never converted before they are used: the numbers are the source's, the parentheses are ours.
// No author line and no Person author: English pages follow /en/tools/cups-to-grams/ (Organization).
import { publiserbare } from '../felles.mjs';
import { artikkel, brodsmuler, elementliste, webApplikasjon } from '../skjema.mjs';
import { esc } from '../../kalk-kort.mjs';
import { PERSONS, START, delTekst, frak, setning, variantDeler } from './regn-en.mjs';
import { TEKST } from './tekst-en.mjs';

export const ROT = '/en/how-much-per-person/';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const engelskDato = (iso) => { const [a, m, d] = iso.split('-').map(Number); return `${MONTHS[m - 1]} ${d}, ${a}`; };
const KORTNAVN = { fsisturkey: 'USDA FSIS', fsisham: 'USDA FSIS', fsisstuff: 'USDA FSIS', ntf: 'National Turkey Federation', sdsu: 'SDSU Extension', biwfd: 'Beef. It\'s What\'s For Dinner', wf: 'Whole Foods Market', isuholiday: 'Iowa State Extension', isugrad: 'Iowa State Extension', isupasta: 'Iowa State Extension', unl: 'Nebraska Extension', success: 'Success Rice', ipc: 'Idaho Potato Commission' };
const sti = (rad) => `${ROT}${rad.slug}/`;
const CALC = new Set(['lb', 'oz', 'cup', 'taco', 'burger', 'meatball', 'sandwich', 'piece', 'slice', 'rib']);
const PER = /^(lb|oz|cup) per (\d+) (guests|servings)$/u;
const RIB = /^rib per (\d+) guests$/u;
const plain = (n) => String(Math.round(n * 100) / 100);

// Texts the calculator uses (site.js has no language strings).
const TEKSTER = { adult: 'adult', adults: 'adults', kid: 'kid', kids: 'kids', and: 'and', need: 'need', needs: 'needs', or: 'or', to: 'to', error: 'Enter whole numbers, for example 4.' };

/** A number from the data file as a per-person amount in a unit the calculator knows, or null. «lb per 50 guests» is divided by 50, «rib per 2 guests» by 2. */
export function perPerson(x) {
  const m = PER.exec(x.enhet);
  if (m) return { verdi: x.verdi / Number(m[2]), enhet: m[1] };
  const r = RIB.exec(x.enhet);
  if (r) return { verdi: x.verdi / Number(r[1]), enhet: 'rib' };
  return CALC.has(x.enhet) ? { verdi: x.verdi, enhet: x.enhet } : null;
}

/** The helpers a page is written with. `brukt` collects the sources the page actually uses. */
function lagH(rad, data, brukt) {
  const tall = (felt) => {
    const x = rad.tall[felt];
    if (!x) throw new Error(`mengde-per-person/en/${rad.id}: the number «${felt}» is not in the data file`);
    brukt.add(x.kilde);
    return x;
  };
  /** One number the way the source states it, with metric in parentheses where it is a weight or a volume. */
  const fmt = (x, antall = 1) => {
    const m = PER.exec(x.enhet);
    // «12.5 lb per 50 guests» as the source states it, or, for a group, the amount for that many people.
    if (m) return antall === 1 ? `${delTekst(x.verdi, x.verdi, m[1])} per ${m[2]} ${m[3]}` : delTekst((x.verdi / Number(m[2])) * antall, (x.verdi / Number(m[2])) * antall, m[1]);
    const r = RIB.exec(x.enhet);
    if (r) return antall === 1 ? `${frak(x.verdi)} ${x.verdi > 1 ? 'ribs' : 'rib'} per ${r[1]} guests` : delTekst((x.verdi / Number(r[1])) * antall, (x.verdi / Number(r[1])) * antall, 'rib');
    if (CALC.has(x.enhet)) return delTekst(x.verdi * antall, x.verdi * antall, x.enhet);
    if (x.enhet === 'percent') return `${plain(x.verdi)}%`;
    return `${frak(x.verdi * antall)} ${x.enhet}`;
  };
  const spenn = (a, b, antall = 1) => {
    const x = tall(a);
    const y = tall(b);
    if (x.enhet !== y.enhet) throw new Error(`mengde-per-person/en/${rad.id}: ${a} and ${b} have different units`);
    const m = PER.exec(x.enhet);
    if (m) return antall === 1 ? `${delTekst(x.verdi, y.verdi, m[1])} per ${m[2]} ${m[3]}` : delTekst((x.verdi / Number(m[2])) * antall, (y.verdi / Number(m[2])) * antall, m[1]);
    if (CALC.has(x.enhet)) return delTekst(x.verdi * antall, y.verdi * antall, x.enhet);
    return `${frak(x.verdi * antall)} to ${frak(y.verdi * antall)} ${x.enhet}`;
  };
  const k = (id) => {
    const kilde = data.kilder[id];
    if (!kilde) throw new Error(`mengde-per-person/en/${rad.id}: the source «${id}» is not in the data file`);
    brukt.add(id);
    return `${KORTNAVN[id] ?? kilde.utgiver} (${kilde.aar})`;
  };
  // For use inside parentheses: «USDA FSIS, 2010».
  const kp = (id) => k(id).replace(/ \((\d{4})\)$/u, ', $1');
  return {
    t: (felt) => fmt(tall(felt)),
    r: (a, b) => spenn(a, b),
    n: (felt) => plain(tall(felt).verdi),
    sum: (felt, antall) => fmt(tall(felt), antall),
    sumR: (a, b, antall) => spenn(a, b, antall),
    k,
    kp,
    sprik: (linjer) => `<div class="table-wrap" tabindex="0" role="region" aria-label="The sources side by side"><table class="sprik"><thead><tr><th scope="col">Source</th><th scope="col">What it says</th><th scope="col">Amount</th></tr></thead><tbody>${linjer.map(([id, hva, tekst]) => `<tr><td>${esc(k(id))}</td><td>${esc(hva)}</td><td>${tekst}</td></tr>`).join('')}</tbody></table></div>`,
  };
}

/** Variants the way the calculator and the table use them: { navn, deler: [{ min, maks, enhet }] } with numbers from the data file. */
function lesVarianter(rad, spec, brukt) {
  const felt = (navn) => {
    const x = rad.tall[navn];
    if (!x) throw new Error(`mengde-per-person/en/${rad.id}: a variant points at «${navn}», which does not exist`);
    const pp = perPerson(x);
    if (!pp) throw new Error(`mengde-per-person/en/${rad.id}: «${navn}» has the unit ${x.enhet}, and the calculator does not count in that`);
    brukt.add(x.kilde);
    return pp;
  };
  return spec.map((v) => ({
    navn: v.navn,
    deler: v.deler.map((d) => {
      const [a, b] = Array.isArray(d) ? d : [d, d];
      const x = felt(a);
      const y = felt(b);
      if (x.enhet !== y.enhet) throw new Error(`mengde-per-person/en/${rad.id}: ${a} and ${b} have different units`);
      return { min: x.verdi, maks: y.verdi, enhet: x.enhet };
    }),
  }));
}

const kidShare = (rad, brukt) => {
  const x = rad.tall.barn;
  if (!x) throw new Error(`mengde-per-person/en/${rad.id}: the row is missing the number «barn»`);
  brukt.add(x.kilde);
  return x.verdi;
};

/** The calculator card (the HTML contract from the design spec, with adults and kids). */
export function kalkHtml(varianter, faktor, { valg = 'What are you making?', fast = null } = {}) {
  const v0 = varianter[0];
  const data = { v: varianter.map((v) => ({ n: v.navn, d: v.deler.map((d) => [d.min, d.maks, d.enhet]) })), b: faktor, s: [...PERSONS], t: TEKSTER };
  // A space after a comma before a number, so the number guard does not read «60,100» as one decimal.
  const json = JSON.stringify(data).replace(/,(?=[\d-])/gu, ', ').replaceAll('<', '\\u003c');
  const vare = varianter.length > 1
    ? `<div class="kalkvare"><label><span class="hva">${esc(valg)}</span><select data-felt="vare">${varianter.map((v, i) => `<option value="${String.fromCharCode(97 + i)}"${i === 0 ? ' selected' : ''}>${esc(v.navn)}</option>`).join('')}</select></label></div>`
    : `<div class="kalkvare"><span><span class="hva">Per person</span><br><b>${esc(fast ?? v0.navn)}</b></span></div>`;
  const hurtig = PERSONS.map((n) => `<button type="button" data-v="${n}"${n === START.adults ? ' aria-pressed="true"' : ''}>${n} adults</button>`).join('');
  // The big answer is the US amount; the metric amount stands in the sentence below (site.js does the same).
  const start = variantDeler(v0, START.adults, START.kids, faktor, TEKSTER.to).map((t) => t.replace(/ \([^)]*\)/gu, ''));
  return `<form class="kalk" data-kalk="portion" onsubmit="return false" aria-label="Calculator: how much per person">
  ${vare}
  <div class="kalkrad">
    <div class="kalkside">
      <label class="kalktall"><span class="skjult">Number of adults</span><input data-felt="voksne" type="text" inputmode="numeric" autocomplete="off" value="${START.adults}"></label>
      <span class="kalkmerke">adults</span>
    </div>
    <div class="kalkside">
      <label class="kalktall"><span class="skjult">Number of kids</span><input data-felt="barn" type="text" inputmode="numeric" autocomplete="off" value="${START.kids}"></label>
      <span class="kalkmerke">kids, half portion</span>
    </div>
    <div class="kalkside til">
      <output class="kalktall" data-felt="svar">${start[0]}</output>
      <span class="kalkmerke">in total</span>
    </div>
  </div>
  <div class="hurtig" role="group" aria-label="Common party sizes">${hurtig}</div>
  <p class="kalksetning" data-felt="setning" role="status" aria-live="polite">${esc(setning(v0, START.adults, START.kids, faktor, TEKSTER))}</p>
  <script type="application/json" class="kalk-data">${json}</script>
</form>`;
}

/** The table: rows are the variants, columns are 2, 4, 6, 8, 10, and 12 adults. */
function tabell(varianter, faktor, tittel) {
  const celle = (v, n) => variantDeler(v, n, 0, faktor).join('<br>');
  return `<div class="table-wrap" tabindex="0" role="region" aria-label="${esc(tittel)}"><table class="persontabell"><thead><tr><th scope="col">Number of adults</th>${PERSONS.map((n) => `<th scope="col">${n}</th>`).join('')}</tr></thead><tbody>${varianter.map((v) => `<tr><th scope="row">${esc(v.navn)}</th>${PERSONS.map((n) => `<td>${celle(v, n)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

const kildeliste = (data, brukt) => {
  const rekkefolge = Object.keys(data.kilder);
  const ider = [...brukt].sort((a, b) => rekkefolge.indexOf(a) - rekkefolge.indexOf(b));
  return `<h2>Sources</h2>\n<ol class="kilder" id="kilder">${ider.map((id) => {
    const k = data.kilder[id];
    return `<li>${esc(k.utgiver)}: <a href="${esc(k.adresse)}" rel="noopener">${esc(k.navn)}</a> (${k.aar}). Read ${engelskDato(k.hentet)}.</li>`;
  }).join('')}</ol>`;
};

// The app on the pages: app-bevis.mjs puts screenshots under these headings (the rules «scale» and «list»).
const APP = '<h2>Scale your recipes to more servings</h2><p>If you have the recipe in Matlyst, you change the number of servings and every amount in the recipe follows.</p>\n<h2>A grocery list once you know the amount</h2><p>Put your recipes on the weekly menu in Matlyst, and all the items land on one grocery list, sorted by store section.</p>';

const STEG = [['Enter how many you are', 'The calculator works as you type.']];
const SKJELETT = { stegTittel: 'How to use the calculator', forst: '', alternativ: '', grense: '', seksjoner: [], cta: 'Scale your recipes in Matlyst', steg: STEG };
const EYEBROW_VARE = `<a href="${ROT}">How much per person</a>`;
const brodsmule = (...ledd) => brodsmuler([{ navn: 'Home', adresse: '/en/' }, { navn: 'How much per person', adresse: ROT }, ...ledd]);
const p = (...xs) => xs.filter(Boolean).map((x) => `<p>${x}</p>`).join('');
/** FAQPage with the answers as plain text: the tests require the visible FAQ (without tags) to equal the JSON-LD. */
const faqSkjema = (faq) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/gu, '').trim() } })),
});
const TABELLINTRO = 'The table counts adults. Each kid counts as half an adult, the way the calculator does.';
const forsteFelt = (def) => { const f = def.varianter[0].deler[0]; return Array.isArray(f) ? f[0] : f; };

export function sideForRad(rad, data) {
  const brukt = new Set();
  const h = lagH(rad, data, brukt);
  const def = TEKST[rad.id];
  if (!def) throw new Error(`mengde-per-person/en/${rad.id}: no text in tekst-en.mjs`);
  const faktor = kidShare(rad, brukt);
  const varianter = lesVarianter(rad, def.varianter, brukt);
  const s = def.tekst(h);
  const adresse = sti(rad);
  const hovedKilde = rad.tall[forsteFelt(def)].kilde;
  const kilde = data.kilder[hovedKilde];
  const topp = `${kalkHtml(varianter, faktor, { fast: rad.navn })}
<p class="kortsvar"><b>Short answer:</b> ${s.svar}</p>
<p class="kilde">Source: <a href="#kilder">${esc(KORTNAVN[hovedKilde] ?? kilde.utgiver)} (${kilde.aar})</a>, “${esc(kilde.navn)}”.</p>`;
  const rik = [
    topp,
    `<h2>Table for 2 to 12 adults</h2>${p(TABELLINTRO)}${tabell(varianter, faktor, `Amount of ${rad.navn.toLowerCase()} for 2 to 12 adults`)}`,
    ...s.avsnitt.map(([tittel, html]) => `<h2>${esc(tittel)}</h2>${html}`),
    APP,
    `<div class="related"><h2>Related pages</h2><ul>${[...s.soster, [ROT, 'All amounts per person']].map(([href, tekst]) => `<li><a href="${href}">${esc(tekst)}</a></li>`).join('')}</ul></div>`,
    kildeliste(data, brukt),
  ].join('\n');
  const kilderObjekter = [...brukt].map((id) => data.kilder[id]);
  return {
    title: s.title, description: s.description, eyebrow: EYEBROW_VARE, h1: s.h1, lead: s.lead,
    ...SKJELETT, rik,
    faqTittel: `Questions about ${s.ord ?? rad.navn.toLowerCase()}`, faq: s.faq,
    publisert: rad.oppdatert,
    schemas: [
      brodsmule({ navn: s.h1, adresse }),
      webApplikasjon({ navn: s.h1, beskrivelse: s.description, adresse, sprak: 'en' }),
      artikkel({ tittel: s.h1, beskrivelse: s.description, adresse, sprak: 'en', publisert: rad.oppdatert, kilder: kilderObjekter }),
      faqSkjema(s.faq),
    ],
  };
}

const merkeNavn = (rad, v) => (v.navn.toLowerCase().includes(rad.navn.toLowerCase()) ? v.navn : `${rad.navn}: ${v.navn.charAt(0).toLowerCase()}${v.navn.slice(1)}`);

export function navSide(data, rader) {
  const brukt = new Set();
  const per = rader.map((rad) => {
    const faktor = kidShare(rad, brukt);
    const varianter = lesVarianter(rad, TEKST[rad.id].varianter, brukt);
    return { rad, faktor, varianter, v0: varianter[0], kilde: data.kilder[rad.tall[forsteFelt(TEKST[rad.id])].kilde], kildeId: rad.tall[forsteFelt(TEKST[rad.id])].kilde };
  });
  const faktor = per[0].faktor;
  const valg = per.map(({ rad, v0 }) => ({ navn: merkeNavn(rad, v0), deler: v0.deler }));
  const radTekst = ({ rad, faktor: f, v0, kilde, kildeId }) => `<tr><th scope="row"><a href="${sti(rad)}">${esc(rad.navn)}</a></th><td>${variantDeler(v0, 1, 0, f).join('<br>')}</td><td>${esc(v0.navn)}</td><td>${esc(KORTNAVN[kildeId] ?? kilde.utgiver)} (${kilde.aar})</td></tr>`;
  const tg = per.find((x) => x.rad.id === 'thanksgiving');
  const kalkun = per.find((x) => x.rad.id === 'kalkun');
  brukt.add(tg.rad.tall.kalkun.kilde);
  brukt.add(kalkun.rad.tall.usda.kilde);
  brukt.add('isuholiday');
  brukt.add('isugrad');
  const turkey = kalkun.rad.tall.usda;
  const topp = `${kalkHtml(valg, faktor, { valg: 'What are you making?' })}
<p class="kortsvar"><b>Short answer:</b> ${KORTNAVN[turkey.kilde]} (${data.kilder[turkey.kilde].aar}) says to allow ${delTekst(turkey.verdi, turkey.verdi, turkey.enhet)} of turkey per person. Iowa State Extension says plan for 1 to 1.5 pounds of food per guest at a party. Each page has the numbers for one food, with the source.</p>
<p class="kilde">Source: <a href="#kilder">${esc(KORTNAVN[turkey.kilde])} (${data.kilder[turkey.kilde].aar})</a>, “${esc(data.kilder[turkey.kilde].navn)}”.</p>`;
  const rik = [
    topp,
    `<h2>Amounts per person for every food</h2>${p('Tap a food for the calculator, a table for 2 to 12 adults, what changes the amount, and the sources. The amounts are per adult.')}<div class="varerull"><table class="varer"><thead><tr><th scope="col">Food or dish</th><th scope="col">Per person</th><th scope="col">What the number covers</th><th scope="col">Source</th></tr></thead><tbody>${per.map(radTekst).join('')}</tbody></table></div>`,
    `<h2>How we work out the amounts</h2>${p(
      'Every number on these pages comes from a source, and the source is named with a link and a year on the page. We do not make up our own numbers for what is enough. All we do is multiply the source\'s amount per person by the number of people.',
      `Kids: each kid counts as half an adult in the calculator, because Iowa State Extension lists half the adult amount per child (Iowa State Extension, ${data.kilder.isuholiday.aar}).`,
      'US measures come first and metric is in parentheses. The parentheses are our conversion of the source\'s figure, rounded. The figure in the source is always the US one.',
      'Where sources disagree, the page shows both numbers and says which one the calculator uses. That is usually the first one listed.',
    )}`,
    `<h2>For Thanksgiving and parties</h2>${ul([
      `<a href="${sti(tg.rad)}">How much food per person for Thanksgiving dinner?</a>`,
      `<a href="${sti(kalkun.rad)}">How much turkey per person?</a>`,
      `<a href="${sti(per.find((x) => x.rad.id === 'ham').rad)}">How much ham per person?</a>`,
      `<a href="${sti(per.find((x) => x.rad.id === 'party-meat').rad)}">How much meat per person for a party?</a>`,
    ])}`,
    APP,
    kildeliste(data, brukt),
  ].join('\n');
  const publisert = rader.map((r) => r.oppdatert).sort().at(-1);
  const description = `How much food per person? A calculator for adults and kids and a table for ${rader.length} foods and dishes, from turkey and ham to rice and pasta, with a source for every number.`;
  const kilderObjekter = [...brukt].map((id) => data.kilder[id]);
  const faqNav = [
      ['How much turkey per person?', `${KORTNAVN[turkey.kilde]} says to allow ${delTekst(turkey.verdi, turkey.verdi, turkey.enhet)} per person. The National Turkey Federation says at least 1 pound of uncooked turkey, and 1.25 to 1.5 pounds for seconds or leftovers.`],
      ['Do kids count as a whole person?', 'The calculator counts each kid as half an adult, because Iowa State Extension lists half the adult amount per child.'],
      ['Where do the numbers come from?', 'From USDA, university extension services, the National Turkey Federation, and other named sources. Every page has the sources with a link and a year.'],
      ['Why do some pages show more than one number for the same food?', 'Sources do not always agree. The page shows both and says which one the calculator uses.'],
    ];
  return {
    title: 'How much food per person? Calculator and chart',
    description,
    eyebrow: 'How much per person',
    h1: 'How much food per person?',
    lead: 'Pick the food, enter how many adults and kids you are, and you get the whole amount. Every number comes from a source.',
    ...SKJELETT, rik,
    faqTittel: 'Questions about amounts per person',
    faq: faqNav,

    publisert,
    schemas: [
      brodsmule(),
      webApplikasjon({ navn: 'How much food per person?', beskrivelse: description, adresse: ROT, sprak: 'en' }),
      artikkel({ tittel: 'How much food per person?', beskrivelse: description, adresse: ROT, sprak: 'en', publisert, kilder: kilderObjekter }),
      elementliste({ navn: 'How much per person', adresse: ROT, elementer: rader.map((r) => ({ navn: r.navn, adresse: sti(r) })) }),
      faqSkjema(faqNav),
    ],
  };
}

const ul = (xs) => `<ul>${xs.map((x) => `<li>${x}</li>`).join('')}</ul>`;
const TALL = /\d+(?:[.,]\d+)?(?:\/\d+)?|[½⅓⅔¼¾⅛⅜⅝⅞]/gu;
const tallene = (t) => String(t ?? '').match(TALL) ?? [];
const kildeTall = (k) => [String(k.aar), ...tallene(engelskDato(k.hentet))];

/** The numbers THAT page may use: the row's own numbers and quotes, the persons in the table and what they give times the source's number, the calculator's start, and the sources' years and dates. */
export function tillatteTall(rad, data) {
  const s = new Set();
  const legg = (t) => tallene(t).forEach((n) => s.add(n));
  PERSONS.forEach((n) => legg(n));
  legg(START.adults); legg(START.kids);
  for (const x of Object.values(rad.tall)) {
    legg(x.verdi); legg(x.merknad); legg(plain(x.verdi));
    const pp = perPerson(x);
    if (pp) for (const n of [...PERSONS, 1, 3, 5, 7, 9, 11]) legg(delTekst(pp.verdi * n, pp.verdi * n, pp.enhet));
    legg(delTekst(x.verdi, x.verdi, PER.test(x.enhet) ? PER.exec(x.enhet)[1] : x.enhet));
  }
  for (const k of Object.values(data.kilder)) kildeTall(k).forEach((n) => s.add(n));
  // The numbers in the table and in the calculator's data fields (ranges, two units) come from the same values.
  const brukt = new Set();
  const def = TEKST[rad.id];
  if (def) {
    const varianter = lesVarianter(rad, def.varianter, brukt);
    const f = rad.tall.barn.verdi;
    for (const v of varianter) {
      for (const n of [...PERSONS, START.adults]) variantDeler(v, n, 0, f).forEach(legg);
      variantDeler(v, 1, 0, f).forEach(legg);
      for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) variantDeler(v, n, 0, f).forEach(legg);
      v.deler.forEach((d) => { legg(d.min); legg(d.maks); });
    }
  }
  return s;
}

export function tillatteTallNav(data) {
  const alle = publiserbare(data);
  const s = new Set();
  s.add(String(alle.length));
  for (const r of alle) for (const n of tillatteTall(r, data)) s.add(n);
  return s;
}

/** The row's own names, which the duplicate guard masks: the row and its variants. */
export const maskeNavn = (rad) => [rad.navn, rad.navn.toLowerCase(), rad.slug.replace(/-/gu, ' '), ...(TEKST[rad.id]?.varianter ?? []).map((v) => v.navn)];

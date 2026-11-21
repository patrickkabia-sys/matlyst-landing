// Malen för familjen «mängd per person» (sv): en samlingssida (/sv/hur-mycket-per-person/) och en sida per vara, skrivna från data.sv.json.
// Varje siffra kommer från en svensk källa med länk och år (kildekontroll.mjs sv kontrollerar citaten mot källsidorna). Texterna per sida ligger i tekst-sv.mjs
// och skriver siffrorna genom hjälparna (h.t, h.r, h.sum ...), som också noterar vilka källor sidan använder, så källistan är exakt det sidan använder.
// Reglerna (tabellerna och kalkylatorns startsvar) ligger i regn.mjs, och kalkylatorn själv i site.js (blocket «porsjon»); samma regler som på norska, med svenska ord.
// Barn: vi har inte hittat en svensk källa som anger hur mycket barn äter jämfört med vuxna, så kalkylatorn räknar personer och har inget barnavdrag.
// Barnfältet i kalkylatorn finns kvar som ett dolt fält med värdet 0, eftersom site.js kräver det. Ingen författarrad (Organization), som övriga svenska sidor.
import { publiserbare } from '../felles.mjs';
import { artikkel, brodsmuler, elementliste, webApplikasjon } from '../skjema.mjs';
import { esc } from '../../kalk-kort.mjs';
import { PERSONER, START, delTekst, setning, variantDeler } from './regn.mjs';
import { TEKST, nav as navTekst } from './tekst-sv.mjs';

export const ROT = '/sv/hur-mycket-per-person/';
// Utan «offers»: skjemats prisvaluta för svenska är SEK, och sidvakten tillåter inga kronor på lokala sidor. Verktyget är gratis, och skjemat gäller även utan pris.
const webbApp = (a) => { const { offers, ...resten } = webApplikasjon(a); return resten; };
const MAANADER = ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'];
const svenskDato = (iso) => { const [a, m, d] = iso.split('-').map(Number); return `${d} ${MAANADER[m - 1]} ${a}`; };
const tallTekst = (n) => String(n).replace('.', ',');
const sti = (rad) => `${ROT}${rad.slug}/`;
const enMaal = (enhet) => enhet === 'g' || enhet === 'dl';
const PER = /^(g|dl) per (\d+) personer$/u;
const TILL = 'till';
// Barn räknas inte olika: faktorn är 1 och barnfältet är dolt. Se kommentaren överst.
const FAKTOR = 1;

// Texterna kalkylatorn använder (site.js har inga språksträngar).
const TEKSTER = { voksen: 'person', voksne: 'personer', barn: 'barn', og: 'och', trenger: 'behöver', eller: 'eller', til: TILL, feil: 'Skriv hela tal, till exempel 4.' };

/** Ett tal ur datafilen som mängd per person i en enhet kalkylatorn kan (g eller dl), eller null. «g per 4 personer» delas på 4. */
export function perPerson(x) {
  if (enMaal(x.enhet)) return { verdi: x.verdi, enhet: x.enhet };
  const m = PER.exec(x.enhet);
  if (m) return { verdi: x.verdi / Number(m[2]), enhet: m[1] };
  return null;
}

/** Hjälparna en sida skrivs med. `brukt` samlar källorna sidan faktiskt använder. */
function lagH(rad, data, brukt) {
  const tall = (felt) => {
    const x = rad.tall[felt];
    if (!x) throw new Error(`mengde-per-person/sv/${rad.id}: talet «${felt}» finns inte i datafilen`);
    brukt.add(x.kilde);
    return x;
  };
  const fmt = (x, antal = 1) => {
    const m = PER.exec(x.enhet);
    if (m) return antal === 1 ? `${delTekst(x.verdi, x.verdi, m[1], TILL)} till ${m[2]} personer` : delTekst((x.verdi / Number(m[2])) * antal, (x.verdi / Number(m[2])) * antal, m[1], TILL);
    if (enMaal(x.enhet)) return delTekst(x.verdi * antal, x.verdi * antal, x.enhet, TILL);
    return `${tallTekst(x.verdi * antal)} ${x.enhet}`;
  };
  const spann = (a, b, antal = 1) => {
    const x = tall(a);
    const y = tall(b);
    if (x.enhet !== y.enhet) throw new Error(`mengde-per-person/sv/${rad.id}: ${a} och ${b} har olika enhet`);
    const m = PER.exec(x.enhet);
    if (m) return antal === 1 ? `${delTekst(x.verdi, y.verdi, m[1], TILL)} till ${m[2]} personer` : delTekst((x.verdi / Number(m[2])) * antal, (y.verdi / Number(m[2])) * antal, m[1], TILL);
    if (enMaal(x.enhet)) return delTekst(x.verdi * antal, y.verdi * antal, x.enhet, TILL);
    return `${tallTekst(x.verdi * antal)} ${TILL} ${tallTekst(y.verdi * antal)} ${x.enhet}`;
  };
  const k = (id) => {
    const kilde = data.kilder[id];
    if (!kilde) throw new Error(`mengde-per-person/sv/${rad.id}: källan «${id}» finns inte i datafilen`);
    brukt.add(id);
    return `${kilde.utgiver} (${kilde.aar})`;
  };
  // Till bruk inne i en parentes: «Svenskt Kött, 2026».
  const kp = (id) => k(id).replace(/ \((\d{4})\)$/u, ', $1');
  return {
    t: (felt) => fmt(tall(felt)),
    r: (a, b) => spann(a, b),
    n: (felt) => tallTekst(tall(felt).verdi),
    /** Mängd per person också när källan anger den för flera personer («600 g till 4 personer» ger 150 g). */
    pp: (felt) => { const x = tall(felt); const m = PER.exec(x.enhet); return m ? delTekst(x.verdi / Number(m[2]), x.verdi / Number(m[2]), m[1], TILL) : fmt(x); },
    sum: (felt, antal) => fmt(tall(felt), antal),
    sumR: (a, b, antal) => spann(a, b, antal),
    k,
    kp,
    /** En mening ur källan, ordagrant, med källa: ”…” (Arla, 2026). Kontrolleras mot källsidan. */
    s: (id) => {
      const verdi = rad.tekst?.[id];
      if (!verdi) throw new Error(`mengde-per-person/sv/${rad.id}: citatet «${id}» finns inte i datafilen`);
      const [kalla, ...rest] = verdi.split('|');
      return `”${esc(rest.join('|'))}” (${kp(kalla)})`;
    },
    sprik: (linjer) => `<div class="table-wrap" tabindex="0" role="region" aria-label="Källorna sida vid sida"><table class="sprik"><thead><tr><th scope="col">Källa</th><th scope="col">Vad källan anger</th><th scope="col">Siffra</th></tr></thead><tbody>${linjer.map(([id, vad, tekst]) => `<tr><td>${esc(k(id))}</td><td>${esc(vad)}</td><td>${tekst}</td></tr>`).join('')}</tbody></table></div>`,
  };
}

/** Varianter så som kalkylatorn och tabellen använder dem: { navn, deler: [{ min, maks, enhet }] } med siffror ur datafilen. */
function lesVarianter(rad, spec, brukt) {
  const falt = (navn) => {
    const x = rad.tall[navn];
    if (!x) throw new Error(`mengde-per-person/sv/${rad.id}: en variant pekar på talet «${navn}», som inte finns`);
    const pp = perPerson(x);
    if (!pp) throw new Error(`mengde-per-person/sv/${rad.id}: «${navn}» har enheten ${x.enhet}, och kalkylatorn räknar bara i g och dl`);
    brukt.add(x.kilde);
    return pp;
  };
  return spec.map((v) => ({
    navn: v.navn,
    deler: v.deler.map((d) => {
      const [a, b] = Array.isArray(d) ? d : [d, d];
      const x = falt(a);
      const y = falt(b);
      if (x.enhet !== y.enhet) throw new Error(`mengde-per-person/sv/${rad.id}: ${a} och ${b} har olika enhet`);
      return { min: x.verdi, maks: y.verdi, enhet: x.enhet };
    }),
  }));
}

/** Kalkylatorkortet. Barnfältet är dolt (värde 0), se kommentaren överst. */
export function kalkHtml(varianter, { val = 'Vad ska du laga?', fast = null } = {}) {
  const v0 = varianter[0];
  const data = { v: varianter.map((v) => ({ n: v.navn, d: v.deler.map((d) => [d.min, d.maks, d.enhet]) })), b: FAKTOR, s: [...PERSONER], t: TEKSTER };
  // Mellanslag efter komma före tal, så sifferkontrollen inte läser «60,100» som ett decimaltal.
  const json = JSON.stringify(data).replace(/,(?=[\d-])/gu, ', ').replaceAll('<', '\\u003c');
  const vare = varianter.length > 1
    ? `<div class="kalkvare"><label><span class="hva">${esc(val)}</span><select data-felt="vare">${varianter.map((v, i) => `<option value="${String.fromCharCode(97 + i)}"${i === 0 ? ' selected' : ''}>${esc(v.navn)}</option>`).join('')}</select></label></div>`
    : `<div class="kalkvare"><span><span class="hva">Per person</span><br><b>${esc(fast ?? v0.navn)}</b></span></div>`;
  const snabb = PERSONER.map((n) => `<button type="button" data-v="${n}"${n === START.voksne ? ' aria-pressed="true"' : ''}>${n} personer</button>`).join('');
  const start = variantDeler(v0, START.voksne, START.barn, FAKTOR, TILL);
  return `<form class="kalk" data-kalk="porsjon" onsubmit="return false" aria-label="Kalkylator: mängd per person">
  ${vare}
  <div class="kalkrad">
    <div class="kalkside">
      <label class="kalktall"><span class="skjult">Antal personer</span><input data-felt="voksne" type="text" inputmode="numeric" autocomplete="off" value="${START.voksne}"></label>
      <span class="kalkmerke">personer</span>
      <input data-felt="barn" type="hidden" value="0">
    </div>
    <div class="kalkside til">
      <output class="kalktall" data-felt="svar">${start[0]}</output>
      <span class="kalkmerke">tillsammans</span>
    </div>
  </div>
  <div class="hurtig" role="group" aria-label="Vanliga sällskapsstorlekar">${snabb}</div>
  <p class="kalksetning" data-felt="setning" role="status" aria-live="polite">${esc(setning(v0, START.voksne, START.barn, FAKTOR, TEKSTER))}</p>
  <script type="application/json" class="kalk-data">${json}</script>
</form>`;
}

/** Tabellen: raderna är varianterna, kolumnerna 2, 4, 6, 8, 10 och 12 personer. */
function tabell(varianter, rubrik) {
  const cell = (v, n) => variantDeler(v, n, 0, FAKTOR, TILL).join('<br>');
  return `<div class="table-wrap" tabindex="0" role="region" aria-label="${esc(rubrik)}"><table class="persontabell"><thead><tr><th scope="col">Antal personer</th>${PERSONER.map((n) => `<th scope="col">${n}</th>`).join('')}</tr></thead><tbody>${varianter.map((v) => `<tr><th scope="row">${esc(v.navn)}</th>${PERSONER.map((n) => `<td>${cell(v, n)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

const kallista = (data, brukt) => {
  const ordning = Object.keys(data.kilder);
  const ider = [...brukt].sort((a, b) => ordning.indexOf(a) - ordning.indexOf(b));
  return `<h2>Källor</h2>\n<ol class="kilder" id="kilder">${ider.map((id) => {
    const k = data.kilder[id];
    return `<li>${esc(k.utgiver)}: <a href="${esc(k.adresse)}" rel="noopener">${esc(k.navn)}</a> (${k.aar}). Läst ${svenskDato(k.hentet)}.</li>`;
  }).join('')}</ol>`;
};

// Appen på sidorna: app-bevis.mjs lägger skärmbilder under de här rubrikerna (reglerna «skalering» och «liste»).
const APP = '<h2>Räkna om recepten till fler portioner</h2><p>Har du receptet i Matlyst ändrar du antalet portioner, och alla mängder i receptet följer med.</p>\n<h2>Inköpslista när du vet mängden</h2><p>Lägg recepten i veckomenyn i Matlyst, så samlas alla varor på en inköpslista, sorterad efter butiksavdelning.</p>';

const STEG = [['Skriv in hur många ni är', 'Kalkylatorn räknar medan du skriver.']];
const SKJELETT = { stegTittel: 'Så använder du kalkylatorn', forst: '', alternativ: '', grense: '', seksjoner: [], cta: 'Skala dina recept i Matlyst', steg: STEG };
const EYEBROW_VARE = `<a href="${ROT}">Mängd per person</a>`;
const brodsmule = (...ledd) => brodsmuler([{ navn: 'Hem', adresse: '/sv/' }, { navn: 'Mängd per person', adresse: ROT }, ...ledd]);
const p = (...xs) => xs.filter(Boolean).map((x) => `<p>${x}</p>`).join('');
const TABELLINTRO = 'Tabellen räknar antal personer. Siffrorna är källans mängd per person gånger antalet personer.';
/** FAQPage med svaren som ren text: testerna kräver att synlig FAQ (utan taggar) är lik JSON-LD. */
const faqSkjema = (faq) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/gu, '').trim() } })),
});
const forstaFalt = (def) => { const f = def.varianter[0].deler[0]; return Array.isArray(f) ? f[0] : f; };

export function sideForRad(rad, data) {
  const brukt = new Set();
  const h = lagH(rad, data, brukt);
  const def = TEKST[rad.id];
  if (!def) throw new Error(`mengde-per-person/sv/${rad.id}: saknar text i tekst-sv.mjs`);
  const varianter = lesVarianter(rad, def.varianter, brukt);
  const s = def.tekst(h);
  const adresse = sti(rad);
  const huvudKalla = rad.tall[forstaFalt(def)].kilde;
  const kalla = data.kilder[huvudKalla];
  const topp = `${kalkHtml(varianter, { fast: rad.navn })}
<p class="kortsvar"><b>Kort svar:</b> ${s.svar}</p>
<p class="kilde">Källa: <a href="#kilder">${esc(kalla.utgiver)} (${kalla.aar})</a>, ”${esc(kalla.navn)}”.</p>`;
  const rik = [
    topp,
    `<h2>Tabell för 2 till 12 personer</h2>${p(TABELLINTRO)}${tabell(varianter, `Mängd för ${rad.navn.toLowerCase()}, 2 till 12 personer`)}`,
    ...s.avsnitt.map(([rubrik, html]) => `<h2>${esc(rubrik)}</h2>${html}`),
    APP,
    `<div class="related"><h2>Läs också</h2><ul>${[...s.soster, [ROT, 'Mängd per person för fler varor']].map(([href, text]) => `<li><a href="${href}">${esc(text)}</a></li>`).join('')}</ul></div>`,
    kallista(data, brukt),
  ].join('\n');
  const kallorObjekt = [...brukt].map((id) => data.kilder[id]);
  return {
    title: s.title, description: s.description, eyebrow: EYEBROW_VARE, h1: s.h1, lead: s.lead,
    ...SKJELETT, rik,
    faqTittel: `Frågor om ${s.ord ?? rad.navn.toLowerCase()}`, faq: s.faq,
    publisert: rad.oppdatert,
    schemas: [
      brodsmule({ navn: s.h1, adresse }),
      webbApp({ navn: s.h1, beskrivelse: s.description, adresse, sprak: 'sv' }),
      artikkel({ tittel: s.h1, beskrivelse: s.description, adresse, sprak: 'sv', publisert: rad.oppdatert, kilder: kallorObjekt }),
      faqSkjema(s.faq),
    ],
  };
}

export function navSide(data, rader) {
  const brukt = new Set();
  const per = rader.map((rad) => {
    const varianter = lesVarianter(rad, TEKST[rad.id].varianter, brukt);
    const f = TEKST[rad.id].varianter[0].deler[0];
    return { rad, v0: varianter[0], kalla: data.kilder[rad.tall[Array.isArray(f) ? f[0] : f].kilde] };
  });
  const val = per.map(({ rad, v0 }) => ({ navn: v0.navn.toLowerCase().includes(rad.navn.toLowerCase()) ? v0.navn : `${rad.navn}: ${v0.navn.charAt(0).toLowerCase()}${v0.navn.slice(1)}`, deler: v0.deler }));
  const radText = ({ rad, v0, kalla }) => `<tr><th scope="row"><a href="${sti(rad)}">${esc(rad.navn)}</a></th><td>${variantDeler(v0, 1, 0, FAKTOR, TILL).join('<br>')}</td><td>${esc(v0.navn)}</td><td>${esc(kalla.utgiver)} (${kalla.aar})</td></tr>`;
  const x = navTekst({ rader, h: (rad) => lagH(rad, data, brukt), per, p, esc });
  const topp = `${kalkHtml(val, { val: 'Vad ska du laga?' })}
<p class="kortsvar"><b>Kort svar:</b> ${x.kortsvar}</p>
<p class="kilde">Källa: <a href="#kilder">${esc(x.huvudKalla.utgiver)} (${x.huvudKalla.aar})</a>, ”${esc(x.huvudKalla.navn)}”.</p>`;
  const rik = [
    topp,
    `<h2>Mängd per person för alla varor</h2>${p('Välj en vara för kalkylator, tabell för 2 till 12 personer, vad som ändrar mängden och källor. Siffrorna är per person.')}<div class="varerull"><table class="varer"><thead><tr><th scope="col">Vara</th><th scope="col">Per person</th><th scope="col">Vad siffran gäller</th><th scope="col">Källa</th></tr></thead><tbody>${per.map(radText).join('')}</tbody></table></div>`,
    ...x.avsnitt.map(([rubrik, html]) => `<h2>${esc(rubrik)}</h2>${html}`),
    APP,
    kallista(data, brukt),
  ].join('\n');
  const publisert = rader.map((r) => r.oppdatert).sort().at(-1);
  const kallorObjekt = [...brukt].map((id) => data.kilder[id]);
  return {
    title: x.title, description: x.description, eyebrow: 'Mängd per person', h1: x.h1, lead: x.lead,
    ...SKJELETT, rik,
    faqTittel: 'Frågor om mängd per person', faq: x.faq, publisert,
    schemas: [
      brodsmule(),
      webbApp({ navn: x.h1, beskrivelse: x.description, adresse: ROT, sprak: 'sv' }),
      artikkel({ tittel: x.h1, beskrivelse: x.description, adresse: ROT, sprak: 'sv', publisert, kilder: kallorObjekt }),
      elementliste({ navn: 'Mängd per person', adresse: ROT, elementer: rader.map((r) => ({ navn: r.navn, adresse: sti(r) })) }),
      faqSkjema(x.faq),
    ],
  };
}

const TALL = /\d{1,3}(?:[   ]\d{3})+(?:[.,]\d+)?(?:\/\d+)?|\d+(?:[.,]\d+)?(?:\/\d+)?|[½⅓⅔¼¾⅛⅜⅝⅞]/gu;
const tallene = (t) => (String(t ?? '').match(TALL) ?? []).map((x) => x.replace(/[   ]/gu, ''));
const kildeTall = (k) => [String(k.aar), ...tallene(svenskDato(k.hentet))];
const medBegge = (s, n) => { s.add(n); s.add(n.replace('.', ',')); s.add(n.replace(',', '.')); };

/** Talen DEN sidan får använda: radens egna tal och citat, personerna i tabellen och det de ger gånger källans tal, kalkylatorns start, och källornas år och datum. */
export function tillatteTall(rad, data) {
  const s = new Set();
  const legg = (t) => tallene(t).forEach((n) => medBegge(s, n));
  PERSONER.forEach((n) => legg(n));
  legg(START.voksne); legg(START.barn); legg(FAKTOR);
  for (const x of Object.values(rad.tall)) {
    legg(x.verdi); legg(x.merknad);
    const pp = perPerson(x);
    if (pp) for (const n of PERSONER) legg(delTekst(pp.verdi * n, pp.verdi * n, pp.enhet, TILL));
    if (pp && x.enhet !== pp.enhet) legg(delTekst(x.verdi, x.verdi, pp.enhet, TILL));
  }
  for (const v of Object.values(rad.tekst ?? {})) legg(v);
  for (const k of Object.values(data.kilder)) kildeTall(k).forEach((n) => medBegge(s, n));
  const def = TEKST[rad.id];
  if (def) {
    for (const v of lesVarianter(rad, def.varianter, new Set())) {
      for (const n of [...PERSONER, START.voksne]) variantDeler(v, n, 0, FAKTOR, TILL).forEach(legg);
      variantDeler(v, 1, 0, FAKTOR, TILL).forEach(legg);
      v.deler.forEach((d) => { legg(d.min); legg(d.maks); });
    }
  }
  return s;
}

export function tillatteTallNav(data) {
  const alla = publiserbare(data);
  const s = new Set();
  medBegge(s, String(alla.length));
  for (const r of alla) for (const n of tillatteTall(r, data)) s.add(n);
  return s;
}

/** Radens egna namn som dubblettvakten maskerar: raden och varianterna. */
export const maskeNavn = (rad) => [rad.navn, rad.navn.toLowerCase(), ...(TEKST[rad.id]?.varianter ?? []).map((v) => v.navn)];

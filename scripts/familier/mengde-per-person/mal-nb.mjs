// Malen for familien «mengde per person» (nb): en samleside (/mengde-per-person/) og én side per rett eller råvare, skrevet fra data.nb.json.
// Hvert tall kommer fra en kilde med lenke og år (kildekontroll.mjs sjekker sitatene mot kildesidene). Tekstene per side ligger i tekst-nb.mjs
// og skriver tallene gjennom hjelperne (h.t, h.r, h.sum ...), som også noterer hvilke kilder siden bruker, så kildelista er nøyaktig det siden bruker.
// Regnereglene (tabellene og kalkulatorens startsvar) ligger i regn.mjs, og kalkulatoren selv i site.js (blokken «porsjon»).
import { publiserbare } from '../felles.mjs';
import { artikkel, brodsmuler, elementliste, webApplikasjon } from '../skjema.mjs';
import { forfatterPerson } from '../../forfatter.mjs';
import { esc } from '../../kalk-kort.mjs';
import { PERSONER, START, delTekst, setning, variantDeler } from './regn.mjs';
import { TEKST } from './tekst-nb.mjs';

export const ROT = '/mengde-per-person/';
const MAANEDER = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'];
const norskDato = (iso) => { const [a, m, d] = iso.split('-').map(Number); return `${d}. ${MAANEDER[m - 1]} ${a}`; };
const tallTekst = (n) => String(n).replace('.', ',');
const KORTNAVN = { 'hdir-porsjon': 'Helsedirektoratets tabell' };
const kortNavn = (id, k) => KORTNAVN[id] ?? (k.utgiver.startsWith('MatPrat') ? 'MatPrat' : k.utgiver);
const sti = (rad) => `${ROT}${rad.slug}/`;
const enMaal = (enhet) => enhet === 'g' || enhet === 'dl';

// Tekstene kalkulatoren bruker (site.js har ingen språkstrenger).
const TEKSTER = { voksen: 'voksen', voksne: 'voksne', barn: 'barn', og: 'og', trenger: 'trenger', eller: 'eller', til: 'til', feil: 'Skriv hele tall, for eksempel 4.' };

/** Hjelperne en side skrives med. `brukt` samler kildene siden faktisk bruker. */
function lagH(rad, data, brukt) {
  const tall = (felt) => {
    const x = rad.tall[felt];
    if (!x) throw new Error(`mengde-per-person/${rad.id}: tallet «${felt}» finnes ikke i datafila`);
    brukt.add(x.kilde);
    return x;
  };
  const fmt = (x, antall = 1) => (enMaal(x.enhet) ? delTekst(x.verdi * antall, x.verdi * antall, x.enhet) : `${tallTekst(x.verdi * antall)} ${x.enhet}`);
  const spenn = (a, b, antall = 1) => {
    const x = tall(a);
    const y = tall(b);
    if (x.enhet !== y.enhet) throw new Error(`mengde-per-person/${rad.id}: ${a} og ${b} har ulik enhet`);
    return enMaal(x.enhet) ? delTekst(x.verdi * antall, y.verdi * antall, x.enhet) : `${tallTekst(x.verdi * antall)} til ${tallTekst(y.verdi * antall)} ${x.enhet}`;
  };
  const k = (id) => {
    const kilde = data.kilder[id];
    if (!kilde) throw new Error(`mengde-per-person/${rad.id}: kilden «${id}» finnes ikke i datafila`);
    brukt.add(id);
    return `${kortNavn(id, kilde)} (${kilde.aar})`;
  };
  // Til bruk inne i en parentes: «MatPrat, 2023».
  const kp = (id) => k(id).replace(/ \((\d{4})\)$/u, ', $1');
  return {
    t: (felt) => fmt(tall(felt)),
    r: (a, b) => spenn(a, b),
    n: (felt) => tallTekst(tall(felt).verdi),
    sum: (felt, antall) => fmt(tall(felt), antall),
    sumR: (a, b, antall) => spenn(a, b, antall),
    k,
    kp,
    sprik: (linjer) => `<div class="table-wrap" tabindex="0" role="region" aria-label="Kildene side om side"><table class="sprik"><thead><tr><th scope="col">Kilde</th><th scope="col">Hva kilden oppgir</th><th scope="col">Tall</th></tr></thead><tbody>${linjer.map(([id, hva, tekst]) => `<tr><td>${esc(k(id))}</td><td>${esc(hva)}</td><td>${tekst}</td></tr>`).join('')}</tbody></table></div>`,
  };
}

/** Varianter slik kalkulatoren og tabellen bruker dem: { navn, deler: [{ min, maks, enhet }] } med tall fra datafila. */
function lesVarianter(rad, spec, brukt) {
  const felt = (navn) => {
    const x = rad.tall[navn];
    if (!x) throw new Error(`mengde-per-person/${rad.id}: variant peker på tallet «${navn}», som ikke finnes`);
    if (!enMaal(x.enhet)) throw new Error(`mengde-per-person/${rad.id}: «${navn}» har enheten ${x.enhet}, og kalkulatoren regner bare i g og dl`);
    brukt.add(x.kilde);
    return x;
  };
  return spec.map((v) => ({
    navn: v.navn,
    deler: v.deler.map((d) => {
      const [a, b] = Array.isArray(d) ? d : [d, d];
      const x = felt(a);
      const y = felt(b);
      if (x.enhet !== y.enhet) throw new Error(`mengde-per-person/${rad.id}: ${a} og ${b} har ulik enhet`);
      return { min: x.verdi, maks: y.verdi, enhet: x.enhet };
    }),
  }));
}

const barnFaktor = (rad, brukt) => {
  const x = rad.tall.barn;
  if (!x) throw new Error(`mengde-per-person/${rad.id}: raden mangler tallet «barn»`);
  brukt.add(x.kilde);
  return x.verdi;
};

/** Kalkulatorkortet (HTML-kontrakten fra designspec 16.8, med voksne og barn i stedet for enheter). */
export function kalkHtml(varianter, faktor, { valg = 'Hva skal du lage?', fast = null } = {}) {
  const v0 = varianter[0];
  const data = { v: varianter.map((v) => ({ n: v.navn, d: v.deler.map((d) => [d.min, d.maks, d.enhet]) })), b: faktor, s: [...PERSONER], t: TEKSTER };
  // Mellomrom etter komma foran tall, så tallvakten ikke leser «60,100» som ett desimaltall.
  const json = JSON.stringify(data).replace(/,(?=[\d-])/gu, ', ').replaceAll('<', '\\u003c');
  const vare = varianter.length > 1
    ? `<div class="kalkvare"><label><span class="hva">${esc(valg)}</span><select data-felt="vare">${varianter.map((v, i) => `<option value="${String.fromCharCode(97 + i)}"${i === 0 ? ' selected' : ''}>${esc(v.navn)}</option>`).join('')}</select></label></div>`
    : `<div class="kalkvare"><span><span class="hva">Per person</span><br><b>${esc(fast ?? v0.navn)}</b></span></div>`;
  const hurtig = PERSONER.map((n) => `<button type="button" data-v="${n}"${n === START.voksne ? ' aria-pressed="true"' : ''}>${n} voksne</button>`).join('');
  const start = variantDeler(v0, START.voksne, START.barn, faktor, TEKSTER.til);
  return `<form class="kalk" data-kalk="porsjon" onsubmit="return false" aria-label="Kalkulator: mengde per person">
  ${vare}
  <div class="kalkrad">
    <div class="kalkside">
      <label class="kalktall"><span class="skjult">Antall voksne</span><input data-felt="voksne" type="text" inputmode="numeric" autocomplete="off" value="${START.voksne}"></label>
      <span class="kalkmerke">voksne</span>
    </div>
    <div class="kalkside">
      <label class="kalktall"><span class="skjult">Antall barn</span><input data-felt="barn" type="text" inputmode="numeric" autocomplete="off" value="${START.barn}"></label>
      <span class="kalkmerke">barn, halv porsjon</span>
    </div>
    <div class="kalkside til">
      <output class="kalktall" data-felt="svar" style="--tegn:${start[0].length}">${start[0]}</output>
      <span class="kalkmerke">til sammen</span>
    </div>
  </div>
  <div class="hurtig" role="group" aria-label="Vanlige selskapsstørrelser">${hurtig}</div>
  <p class="kalksetning" data-felt="setning" role="status" aria-live="polite">${esc(setning(v0, START.voksne, START.barn, faktor, TEKSTER))}</p>
  <script type="application/json" class="kalk-data">${json}</script>
</form>`;
}

/** Tabellen: radene er variantene, kolonnene 2, 4, 6, 8, 10 og 12 voksne. */
function tabell(varianter, faktor, tittel) {
  const celle = (v, n) => variantDeler(v, n, 0, faktor).join('<br>');
  return `<div class="table-wrap" tabindex="0" role="region" aria-label="${esc(tittel)}"><table class="persontabell"><thead><tr><th scope="col">Antall voksne</th>${PERSONER.map((n) => `<th scope="col">${n}</th>`).join('')}</tr></thead><tbody>${varianter.map((v) => `<tr><th scope="row">${esc(v.navn)}</th>${PERSONER.map((n) => `<td>${celle(v, n)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

const kildeliste = (data, brukt) => {
  const ider = [...brukt].sort((a, b) => Number(data.kilder[b].utgiver.startsWith('MatPrat')) - Number(data.kilder[a].utgiver.startsWith('MatPrat')));
  return `<h2>Kilder</h2>\n<ol class="kilder" id="kilder">${ider.map((id) => {
    const k = data.kilder[id];
    return `<li>${esc(k.utgiver)}: <a href="${esc(k.adresse)}" rel="noopener">${esc(k.navn)}</a> (${k.aar}). Lest ${norskDato(k.hentet)}.</li>`;
  }).join('')}</ol>`;
};

// Appet på sidene: app-bevis.mjs legger skjermbilder under disse overskriftene (reglene «skalering» og «liste»).
const APP = '<h2>Regn om oppskriftene til flere porsjoner</h2><p>Har du oppskriften i Matlyst, endrer du antall porsjoner, og alle mengdene i oppskriften følger med.</p>\n<h2>Handleliste når du vet mengden</h2><p>Legg oppskriftene i ukemenyen i Matlyst, så samles alle varene på én handleliste, sortert etter butikkavdeling.</p>';

const STEG = [['Skriv inn hvor mange dere er', 'Kalkulatoren regner mens du skriver.']];
const SKJELETT = { stegTittel: 'Slik bruker du kalkulatoren', forst: '', alternativ: '', grense: '', seksjoner: [], cta: 'Skaler oppskriftene dine i Matlyst', steg: STEG };
const EYEBROW_VARE = `<a href="${ROT}">Mengde per person</a>`;
const brodsmule = (...ledd) => brodsmuler([{ navn: 'Forside', adresse: '/' }, { navn: 'Mengde per person', adresse: ROT }, ...ledd]);
const p = (...xs) => xs.filter(Boolean).map((x) => `<p>${x}</p>`).join('');
const TABELLINTRO = 'Tabellen regner med voksne. Skal barn spise, teller hvert barn som en halv voksen, slik kalkulatoren regner.';

export function sideForRad(rad, data) {
  const brukt = new Set();
  const h = lagH(rad, data, brukt);
  const def = TEKST[rad.id];
  if (!def) throw new Error(`mengde-per-person/${rad.id}: mangler tekst i tekst-nb.mjs`);
  const faktor = barnFaktor(rad, brukt);
  const varianter = lesVarianter(rad, def.varianter, brukt);
  const s = def.tekst(h);
  const adresse = sti(rad);
  const forste = def.varianter[0].deler[0];
  const hovedKilde = rad.tall[Array.isArray(forste) ? forste[0] : forste].kilde;
  const kilde = data.kilder[hovedKilde];
  const topp = `${kalkHtml(varianter, faktor, { fast: rad.navn })}
<p class="kortsvar"><b>Kort svar:</b> ${s.svar}</p>
<p class="kilde">Kilde: <a href="#kilder">${esc(kortNavn(hovedKilde, kilde))} (${kilde.aar})</a>, «${esc(kilde.navn)}».</p>`;
  const rik = [
    topp,
    `<h2>Tabell for 2 til 12 voksne</h2>${p(TABELLINTRO)}${tabell(varianter, faktor, `Mengde for ${rad.navn.toLowerCase()}, 2 til 12 voksne`)}`,
    ...s.avsnitt.map(([tittel, html]) => `<h2>${esc(tittel)}</h2>${html}`),
    APP,
    `<div class="related"><h2>Les også</h2><ul>${[...s.soster, [ROT, 'Alle mengder per person']].map(([href, tekst]) => `<li><a href="${href}">${esc(tekst)}</a></li>`).join('')}</ul></div>`,
    kildeliste(data, brukt),
  ].join('\n');
  const kilderObjekter = [...brukt].map((id) => data.kilder[id]);
  return {
    title: s.title, description: s.description, eyebrow: EYEBROW_VARE, h1: s.h1, lead: s.lead,
    ...SKJELETT, rik,
    faqTittel: `Spørsmål om ${s.ord ?? rad.navn.toLowerCase()}`, faq: s.faq,
    publisert: rad.oppdatert,
    schemas: [
      brodsmule({ navn: s.h1, adresse }),
      webApplikasjon({ navn: s.h1, beskrivelse: s.description, adresse, sprak: 'nb' }),
      artikkel({ tittel: s.h1, beskrivelse: s.description, adresse, sprak: 'nb', publisert: rad.oppdatert, kilder: kilderObjekter, forfatter: forfatterPerson() }),
    ],
  };
}

const merkeNavn = (rad, v) => (v.navn.toLowerCase().includes(rad.navn.toLowerCase()) ? v.navn : `${rad.navn}: ${v.navn.charAt(0).toLowerCase()}${v.navn.slice(1)}`);

export function navSide(data, rader) {
  const brukt = new Set();
  const per = rader.map((rad) => {
    const faktor = barnFaktor(rad, brukt);
    const varianter = lesVarianter(rad, TEKST[rad.id].varianter, brukt);
    const forste = TEKST[rad.id].varianter[0].deler[0];
    return { rad, faktor, varianter, v0: varianter[0], kilde: data.kilder[rad.tall[Array.isArray(forste) ? forste[0] : forste].kilde] };
  });
  const faktor = per[0].faktor;
  const valg = per.map(({ rad, v0 }) => ({ navn: merkeNavn(rad, v0), deler: v0.deler }));
  const radTekst = ({ rad, faktor: f, v0, kilde }) => `<tr><th scope="row"><a href="${sti(rad)}">${esc(rad.navn)}</a></th><td>${variantDeler(v0, 1, 0, f).join('<br>')}</td><td>${esc(v0.navn)}</td><td>${esc(kilde.utgiver.startsWith('MatPrat') ? 'MatPrat' : 'Helsedirektoratet')} (${kilde.aar})</td></tr>`;
  const ris = per.find((x) => x.rad.id === 'ris');
  const selskap = per.find((x) => x.rad.id === 'mat-til-selskap');
  const julemat = per.find((x) => x.rad.id === 'julemat');
  const g = (x, felt) => x.rad.tall[felt];
  const total = g(selskap, 'total');
  brukt.add(total.kilde);
  const ristall = ris.v0.deler[0];
  const topp = `${kalkHtml(valg, faktor, { valg: 'Hva skal du lage?' })}
<p class="kortsvar"><b>Kort svar:</b> Til et selskap regner MatPrat ca. ${delTekst(total.verdi, total.verdi, total.enhet)} mat per person, hvor om lag halvparten er kjøtt eller fisk. Ris er ${delTekst(ristall.min, ristall.min, ristall.enhet)} per person.</p>
<p class="kilde">Kilde: <a href="#kilder">${esc(kortNavn(total.kilde, data.kilder[total.kilde]))} (${data.kilder[total.kilde].aar})</a>, «${esc(data.kilder[total.kilde].navn)}».</p>`;
  const rik = [
    topp,
    `<h2>Mengde per person for alle varene</h2>${p('Trykk på en rett for kalkulator, tabell for 2 til 12 personer, hva som endrer mengden, og kilder. Tallene er per voksen.')}<div class="varerull"><table class="varer"><thead><tr><th scope="col">Rett eller råvare</th><th scope="col">Per person</th><th scope="col">Hva tallet gjelder</th><th scope="col">Kilde</th></tr></thead><tbody>${per.map(radTekst).join('')}</tbody></table></div>`,
    `<h2>Slik regner vi</h2>${p(
      'Hvert tall på sidene er hentet fra en kilde, og kilden står med lenke og år på siden. Vi regner ikke ut egne tall for hva som er nok. Det eneste vi gjør, er å gange kildens tall per person med antall personer.',
      `Barn: hvert barn teller som en halv voksen i kalkulatoren, fordi MatPrat sier at du gjerne kan regne en halv porsjon til små barn og en full porsjon til ungdom og voksne (${kortNavn('mp-julemat', data.kilder['mp-julemat'])}, ${data.kilder['mp-julemat'].aar}).`,
      'Der kildene er uenige, viser siden begge tallene og sier hvilket kalkulatoren bruker. Oftest er det det nyeste.',
    )}`,
    `<h2>Til selskap og høytid</h2>${p(`Skal du lage mat til mange, er grunnregelen ca. ${delTekst(total.verdi, total.verdi, total.enhet)} mat per person (${kortNavn(total.kilde, data.kilder[total.kilde])}, ${data.kilder[total.kilde].aar}).`)}<ul><li><a href="${sti(selskap.rad)}">Hvor mye mat per person til selskap?</a></li><li><a href="${sti(per.find((x) => x.rad.id === 'koldtbord').rad)}">Hvor mye mat til koldtbord per person?</a></li><li><a href="${sti(per.find((x) => x.rad.id === 'spekemat').rad)}">Hvor mye spekemat per person?</a></li><li><a href="${sti(julemat.rad)}">Hvor mye julemat per person?</a></li></ul>`,
    APP,
    kildeliste(data, brukt),
  ].join('\n');
  const publisert = rader.map((r) => r.oppdatert).sort().at(-1);
  const description = `Hvor mye mat per person? Kalkulator for voksne og barn og tabell for ${rader.length} retter og råvarer, fra ris og pasta til ribbe og koldtbord, med kilde på hvert tall.`;
  const kilderObjekter = [...brukt].map((id) => data.kilder[id]);
  return {
    title: 'Hvor mye mat per person? Kalkulator og tabell',
    description,
    eyebrow: 'Mengde per person',
    h1: 'Hvor mye mat per person?',
    lead: 'Velg retten, skriv inn hvor mange voksne og barn dere er, så får du hele mengden. Hvert tall er hentet fra en kilde.',
    ...SKJELETT, rik,
    faqTittel: 'Spørsmål om mengde per person',
    faq: [
      ['Hvor mye mat per person?', `Til et selskap regner MatPrat ca. ${delTekst(total.verdi, total.verdi, total.enhet)} mat per person, hvor om lag halvparten er kjøtt eller fisk. For enkeltvarer varierer tallet: se tabellen over.`],
      ['Teller barn som en hel person?', 'MatPrat sier at du gjerne kan regne en halv porsjon til små barn og en full porsjon til ungdom og voksne. Kalkulatoren regner hvert barn som en halv voksen.'],
      ['Hvor kommer tallene fra?', 'Fra MatPrat og fra Helsedirektoratets tabell over mål, vekt og porsjonsstørrelser. Hver side har kildene med lenke og år.'],
      ['Hvorfor viser noen sider flere tall for samme vare?', 'Kildene har ikke alltid samme tall, og de eldste sidene er fra 2014. Siden viser begge og sier hvilket kalkulatoren bruker.'],
    ],
    publisert,
    schemas: [
      brodsmule(),
      webApplikasjon({ navn: 'Hvor mye mat per person?', beskrivelse: description, adresse: ROT, sprak: 'nb' }),
      artikkel({ tittel: 'Hvor mye mat per person?', beskrivelse: description, adresse: ROT, sprak: 'nb', publisert, kilder: kilderObjekter, forfatter: forfatterPerson() }),
      elementliste({ navn: 'Mengde per person', adresse: ROT, elementer: rader.map((r) => ({ navn: r.navn, adresse: sti(r) })) }),
    ],
  };
}

const TALL = /\d{1,3}(?:[   ]\d{3})+(?:[.,]\d+)?(?:\/\d+)?|\d+(?:[.,]\d+)?(?:\/\d+)?|[½⅓⅔¼¾⅛⅜⅝⅞]/gu;
const tallene = (t) => (String(t ?? '').match(TALL) ?? []).map((x) => x.replace(/[   ]/gu, ''));
const kildeTall = (k) => [String(k.aar), ...tallene(norskDato(k.hentet))];
const medBegge = (s, n) => { s.add(n); s.add(n.replace('.', ',')); s.add(n.replace(',', '.')); };

/** Tallene DEN siden kan bruke: radens egne tall og sitater, personene i tabellen og det de gir ganget med kildens tall, kalkulatorens start, og kildenes år og datoer. */
export function tillatteTall(rad, data) {
  const s = new Set();
  const legg = (t) => tallene(t).forEach((n) => medBegge(s, n));
  PERSONER.forEach((n) => legg(n));
  legg(START.voksne); legg(START.barn);
  for (const x of Object.values(rad.tall)) {
    legg(x.verdi); legg(x.merknad);
    if (enMaal(x.enhet)) for (const n of PERSONER) legg(delTekst(x.verdi * n, x.verdi * n, x.enhet));
  }
  for (const v of Object.values(rad.tekst ?? {})) legg(v);
  for (const k of Object.values(data.kilder)) kildeTall(k).forEach((n) => medBegge(s, n));
  // Tallene i tabellen og i kalkulatorens datafelt (for intervaller og to enheter) kommer av de samme verdiene.
  const brukt = new Set();
  const def = TEKST[rad.id];
  if (def) {
    const varianter = lesVarianter(rad, def.varianter, brukt);
    const f = rad.tall.barn.verdi;
    for (const v of varianter) {
      for (const n of [...PERSONER, START.voksne]) variantDeler(v, n, 0, f).forEach(legg);
      variantDeler(v, 1, 0, f).forEach(legg);
      v.deler.forEach((d) => { legg(d.min); legg(d.maks); });
    }
  }
  return s;
}

export function tillatteTallNav(data) {
  const alle = publiserbare(data);
  const s = new Set();
  medBegge(s, String(alle.length));
  for (const r of alle) for (const n of tillatteTall(r, data)) s.add(n);
  return s;
}

/** Radens egne navn som duplikatvakten maskerer: raden og variantene. */
export const maskeNavn = (rad) => [rad.navn, rad.navn.toLowerCase(), ...(TEKST[rad.id]?.varianter ?? []).map((v) => v.navn)];

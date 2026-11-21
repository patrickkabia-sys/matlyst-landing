// Mal for familien «mengde per person» (da): en samleside (/da/hvor-meget-pr-person/) og én side per ret eller råvare, skrevet fra data.da.json og tekst-da.mjs.
// Hvert tal kommer fra en dansk kilde med link og årstal (kildekontroll.mjs mengde-per-person da kontrollerer sitaterne mod kildesiderne).
// Prosaen skriver aldrig et tal selv: den bruger hjælperne h.t, h.r og h.sum, som også noterer kilden, så kildelisten er nøjagtig det, siden bruger.
// Regnereglerne (tabellerne og kalkulatorens startsvar) er de samme som på norsk og står i regn.mjs; kalkulatoren selv er site.js (blokken «porsjon»), med danske tekster i TEKSTER.
// Ingen forfatterlinje (Organization), som de andre danske sider. Børn tæller som en halv voksen: Madens Verden og Arla skriver begge halv portion.
import { publiserbare } from '../felles.mjs';
import { artikkel, brodsmuler, elementliste } from '../skjema.mjs';
import { BASE } from '../../forfatter.mjs';
import { esc } from '../../kalk-kort.mjs';
import { PERSONER, START, delTekst, setning, variantDeler } from './regn.mjs';
import { TEKST } from './tekst-da.mjs';

export const ROT = '/da/hvor-meget-pr-person/';
const MAANEDER = ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'];
const danskDato = (iso) => { const [a, m, d] = iso.split('-').map(Number); return `${d}. ${MAANEDER[m - 1]} ${a}`; };
const tallTekst = (n) => String(n).replace('.', ',');
const sti = (rad) => `${ROT}${rad.slug}/`;
// WebApplication uden «offers»: locale-vagten tillader ingen valutakode (DKK) på danske sider, og de andre danske omregnere har heller ingen.
const webApplikasjon = ({ navn, beskrivelse, adresse }) => ({ '@context': 'https://schema.org', '@type': 'WebApplication', name: navn, description: beskrivelse, url: `${BASE}${adresse}`, inLanguage: 'da', applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any', isAccessibleForFree: true });
const enMaal = (enhet) => enhet === 'g' || enhet === 'dl';
const KORT = { 'Madens Verden': 'Madens Verden', Arla: 'Arla', 'Danish Crown': 'Danish Crown' };
const kortNavn = (k) => KORT[k.utgiver] ?? k.utgiver;

// Tekstene kalkulatoren bruger (site.js har ingen sprogstrenge). ettBarn bruges ved præcis ét barn.
const TEKSTER = { voksen: 'voksen', voksne: 'voksne', barn: 'børn', ettBarn: 'barn', og: 'og', trenger: 'skal bruge', eller: 'eller', til: 'til', feil: 'Skriv hele tal, for eksempel 4.' };

/** Hjælperne en side skrives med. `brukt` samler kilderne siden faktisk bruger. */
function lagH(rad, data, brukt) {
  const tall = (felt) => {
    const x = rad.tall[felt];
    if (!x) throw new Error(`mengde-per-person/${rad.id}: tallet «${felt}» findes ikke i datafilen`);
    brukt.add(x.kilde);
    return x;
  };
  const fmt = (x, antall = 1) => (enMaal(x.enhet) ? delTekst(x.verdi * antall, x.verdi * antall, x.enhet) : `${tallTekst(x.verdi * antall)} ${x.enhet}`);
  const spenn = (a, b, antall = 1) => {
    const x = tall(a);
    const y = tall(b);
    if (x.enhet !== y.enhet) throw new Error(`mengde-per-person/${rad.id}: ${a} og ${b} har forskellig enhed`);
    return enMaal(x.enhet) ? delTekst(x.verdi * antall, y.verdi * antall, x.enhet) : `${tallTekst(x.verdi * antall)} til ${tallTekst(y.verdi * antall)} ${x.enhet}`;
  };
  const k = (id) => {
    const kilde = data.kilder[id];
    if (!kilde) throw new Error(`mengde-per-person/${rad.id}: kilden «${id}» findes ikke i datafilen`);
    brukt.add(id);
    return `${kortNavn(kilde)} (${kilde.aar})`;
  };
  const kp = (id) => k(id).replace(/ \((\d{4})\)$/u, ', $1');
  /** En sætning fra kilden, ordret, med kilde (eller uden, når sætningen selv nævner den). */
  const s = (id, { med = true } = {}) => {
    const verdi = rad.tekst?.[id];
    if (!verdi) throw new Error(`mengde-per-person/${rad.id}: sitatet «${id}» findes ikke i datafilen`);
    const [kilde, ...rest] = verdi.split('|');
    const kk = kp(kilde);
    const tekst = `»${esc(rest.join('|'))}«`;
    return med ? `${tekst} (${kk})` : tekst;
  };
  return {
    t: (felt) => fmt(tall(felt)),
    r: (a, b) => spenn(a, b),
    n: (felt) => tallTekst(tall(felt).verdi),
    sum: (felt, antall) => fmt(tall(felt), antall),
    sumR: (a, b, antall) => spenn(a, b, antall),
    k, kp, s,
  };
}

/** Varianter, som kalkulatoren og tabellen bruger dem: { navn, deler: [{ min, maks, enhet }] } med tal fra datafilen. */
function lesVarianter(rad, spec, brukt) {
  const felt = (navn) => {
    const x = rad.tall[navn];
    if (!x) throw new Error(`mengde-per-person/${rad.id}: variant peger på tallet «${navn}», som ikke findes`);
    if (!enMaal(x.enhet)) throw new Error(`mengde-per-person/${rad.id}: «${navn}» har enheden ${x.enhet}, og kalkulatoren regner kun i g og dl`);
    brukt.add(x.kilde);
    return x;
  };
  return spec.map((v) => ({
    navn: v.navn,
    deler: v.deler.map((d) => {
      const [a, b] = Array.isArray(d) ? d : [d, d];
      const x = felt(a);
      const y = felt(b);
      if (x.enhet !== y.enhet) throw new Error(`mengde-per-person/${rad.id}: ${a} og ${b} har forskellig enhed`);
      return { min: x.verdi, maks: y.verdi, enhet: x.enhet };
    }),
  }));
}

const barnFaktor = (rad, brukt) => {
  const x = rad.tall.barn;
  if (!x) throw new Error(`mengde-per-person/${rad.id}: rækken mangler tallet «barn»`);
  brukt.add(x.kilde);
  return x.verdi;
};

/** Kalkulatorkortet (HTML-kontrakten fra designspec 16.8, med voksne og børn i stedet for enheder). */
export function kalkHtml(varianter, faktor, { valg = 'Hvad skal du lave?', fast = null } = {}) {
  const v0 = varianter[0];
  const data = { v: varianter.map((v) => ({ n: v.navn, d: v.deler.map((d) => [d.min, d.maks, d.enhet]) })), b: faktor, s: [...PERSONER], t: TEKSTER };
  // Mellemrum efter komma foran tal, så tallvagten ikke læser «60,100» som ét decimaltal.
  const json = JSON.stringify(data).replace(/,(?=[\d-])/gu, ', ').replaceAll('<', '\\u003c');
  const vare = varianter.length > 1
    ? `<div class="kalkvare"><label><span class="hva">${esc(valg)}</span><select data-felt="vare">${varianter.map((v, i) => `<option value="${String.fromCharCode(97 + i)}"${i === 0 ? ' selected' : ''}>${esc(v.navn)}</option>`).join('')}</select></label></div>`
    : `<div class="kalkvare"><span><span class="hva">Pr. person</span><br><b>${esc(fast ?? v0.navn)}</b></span></div>`;
  const hurtig = PERSONER.map((n) => `<button type="button" data-v="${n}"${n === START.voksne ? ' aria-pressed="true"' : ''}>${n} voksne</button>`).join('');
  const start = variantDeler(v0, START.voksne, START.barn, faktor, TEKSTER.til);
  return `<form class="kalk" data-kalk="porsjon" onsubmit="return false" aria-label="Omregner: mængde pr. person">
  ${vare}
  <div class="kalkrad">
    <div class="kalkside">
      <label class="kalktall"><span class="skjult">Antal voksne</span><input data-felt="voksne" type="text" inputmode="numeric" autocomplete="off" value="${START.voksne}"></label>
      <span class="kalkmerke">voksne</span>
    </div>
    <div class="kalkside">
      <label class="kalktall"><span class="skjult">Antal børn</span><input data-felt="barn" type="text" inputmode="numeric" autocomplete="off" value="${START.barn}"></label>
      <span class="kalkmerke">børn, halv portion</span>
    </div>
    <div class="kalkside til">
      <output class="kalktall" data-felt="svar">${start[0]}</output>
      <span class="kalkmerke">i alt</span>
    </div>
  </div>
  <div class="hurtig" role="group" aria-label="Almindelige selskabsstørrelser">${hurtig}</div>
  <p class="kalksetning" data-felt="setning" role="status" aria-live="polite">${esc(setning(v0, START.voksne, START.barn, faktor, TEKSTER))}</p>
  <script type="application/json" class="kalk-data">${json}</script>
</form>`;
}

/** Tabellen: rækkerne er varianterne, kolonnerne 2, 4, 6, 8, 10 og 12 voksne. */
function tabell(varianter, faktor, tittel) {
  const celle = (v, n) => variantDeler(v, n, 0, faktor).join('<br>');
  return `<div class="table-wrap" tabindex="0" role="region" aria-label="${esc(tittel)}"><table class="persontabell"><thead><tr><th scope="col">Antal voksne</th>${PERSONER.map((n) => `<th scope="col">${n}</th>`).join('')}</tr></thead><tbody>${varianter.map((v) => `<tr><th scope="row">${esc(v.navn)}</th>${PERSONER.map((n) => `<td>${celle(v, n)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

const kildeliste = (data, brukt) => {
  const rekkefolge = Object.keys(data.kilder);
  const ider = [...brukt].sort((a, b) => rekkefolge.indexOf(a) - rekkefolge.indexOf(b));
  return `<h2>Kilder</h2>\n<ol class="kilder" id="kilder">${ider.map((id) => {
    const k = data.kilder[id];
    return `<li>${esc(k.utgiver)}: <a href="${esc(k.adresse)}" rel="noopener">${esc(k.navn)}</a> (${k.aar}). Læst ${danskDato(k.hentet)}.</li>`;
  }).join('')}</ol>`;
};

const APP = '<h2>Skaler opskrifterne til flere portioner</h2><p>Har du opskriften i Matlyst, skifter du antallet af portioner, og alle mængderne i opskriften følger med.</p>\n<h2>Indkøbsliste, når du kender mængden</h2><p>Læg opskrifterne i madplanen i Matlyst, så samles alle varerne på én indkøbsliste, sorteret efter butiksafdeling.</p>';
const STEG = [['Skriv, hvor mange I er', 'Omregneren regner, mens du skriver.']];
const SKJELETT = { stegTittel: 'Sådan bruger du omregneren', forst: '', alternativ: '', grense: '', seksjoner: [], cta: 'Skaler dine opskrifter i Matlyst', steg: STEG };
const EYEBROW_VARE = `<a href="${ROT}">Mængde pr. person</a>`;
const brodsmule = (...ledd) => brodsmuler([{ navn: 'Forside', adresse: '/da/' }, { navn: 'Mængde pr. person', adresse: ROT }, ...ledd]);
const p = (...xs) => xs.filter(Boolean).map((x) => `<p>${x}</p>`).join('');
const TABELLINTRO = 'Tabellen regner med voksne. Skal børn spise med, tæller hvert barn som en halv voksen, sådan som omregneren regner.';

const faqSkjema = (faq) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/gu, '').trim() } })),
});

export function sideForRad(rad, data) {
  const brukt = new Set();
  const h = lagH(rad, data, brukt);
  const def = TEKST[rad.id];
  if (!def) throw new Error(`mengde-per-person/${rad.id}: mangler tekst i tekst-da.mjs`);
  const faktor = barnFaktor(rad, brukt);
  const varianter = lesVarianter(rad, def.varianter, brukt);
  const s = def.tekst({ ...h, p });
  const adresse = sti(rad);
  const forste = def.varianter[0].deler[0];
  const hovedKilde = rad.tall[Array.isArray(forste) ? forste[0] : forste].kilde;
  const kilde = data.kilder[hovedKilde];
  const topp = `${kalkHtml(varianter, faktor, { fast: rad.navn })}
<p class="kortsvar"><b>Kort svar:</b> ${s.svar}</p>
<p class="kilde">Kilde: <a href="#kilder">${esc(kortNavn(kilde))} (${kilde.aar})</a>, »${esc(kilde.navn)}«.</p>`;
  const rik = [
    topp,
    `<h2>Tabel for 2 til 12 voksne</h2>${p(TABELLINTRO)}${tabell(varianter, faktor, `Mængde for ${rad.navn.toLowerCase()}, 2 til 12 voksne`)}`,
    ...s.avsnitt.map(([tittel, html]) => `<h2>${esc(tittel)}</h2>${html}`),
    APP,
    `<div class="related"><h2>Læs også</h2><ul>${[...s.soster, [ROT, 'Alle mængder pr. person']].map(([href, tekst]) => `<li><a href="${href}">${esc(tekst)}</a></li>`).join('')}</ul></div>`,
    kildeliste(data, brukt),
  ].join('\n');
  const kilderObjekter = [...brukt].map((id) => data.kilder[id]);
  return {
    title: s.title, description: s.description, eyebrow: EYEBROW_VARE, h1: s.h1, lead: s.lead,
    ...SKJELETT, rik,
    faqTittel: `Spørgsmål om ${s.ord ?? rad.navn.toLowerCase()}`, faq: s.faq,
    publisert: rad.oppdatert,
    schemas: [
      brodsmule({ navn: s.h1, adresse }),
      webApplikasjon({ navn: s.h1, beskrivelse: s.description, adresse }),
      artikkel({ tittel: s.h1, beskrivelse: s.description, adresse, sprak: 'da', publisert: rad.oppdatert, kilder: kilderObjekter }),
      faqSkjema(s.faq),
    ],
  };
}

export function navSide(data, rader) {
  const brukt = new Set();
  const per = rader.map((rad) => {
    const faktor = barnFaktor(rad, brukt);
    const varianter = lesVarianter(rad, TEKST[rad.id].varianter, brukt);
    const forste = TEKST[rad.id].varianter[0].deler[0];
    return { rad, faktor, varianter, v0: varianter[0], kilde: data.kilder[rad.tall[Array.isArray(forste) ? forste[0] : forste].kilde] };
  });
  const faktor = per[0].faktor;
  const valg = per.map(({ rad, v0 }) => ({ navn: v0.navn.toLowerCase().includes(rad.navn.toLowerCase()) ? v0.navn : `${rad.navn}: ${v0.navn.charAt(0).toLowerCase()}${v0.navn.slice(1)}`, deler: v0.deler }));
  const radTekst = ({ rad, faktor: f, v0, kilde }) => `<tr><th scope="row"><a href="${sti(rad)}">${esc(rad.navn)}</a></th><td>${variantDeler(v0, 1, 0, f).join('<br>')}</td><td>${esc(v0.navn)}</td><td>${esc(kortNavn(kilde))} (${kilde.aar})</td></tr>`;
  const ris = per.find((x) => x.rad.id === 'ris');
  const flaesk = per.find((x) => x.rad.id === 'flaeskesteg');
  const gaester = per.find((x) => x.rad.id === 'mat-til-selskap');
  const barn = gaester.rad.tall.barn;
  brukt.add(barn.kilde);
  const kod = gaester.rad.tall.koed;
  brukt.add(kod.kilde);
  const ristall = ris.v0.deler[0];
  const jul = flaesk.rad.tall['dc-jul'];
  brukt.add(jul.kilde);
  const topp = `${kalkHtml(valg, faktor, { valg: 'Hvad skal du lave?' })}
<p class="kortsvar"><b>Kort svar:</b> Til gæster regner Madens Verden med ${delTekst(kod.verdi, kod.verdi, kod.enhet)} kød uden ben pr. voksen. Ris er ${delTekst(ristall.min, ristall.min, ristall.enhet)} pr. person hos Madens Verden og ${delTekst(per[0].varianter[1].deler[0].min, per[0].varianter[1].deler[0].min, per[0].varianter[1].deler[0].enhet)} hos Arla.</p>
<p class="kilde">Kilde: <a href="#kilder">${esc(kortNavn(data.kilder[kod.kilde]))} (${data.kilder[kod.kilde].aar})</a>, »${esc(data.kilder[kod.kilde].navn)}«.</p>`;
  const rik = [
    topp,
    `<h2>Mængde pr. person for alle varer</h2>${p('Tryk på en ret for omregner, tabel for to til tolv personer, hvad der ændrer mængden, og kilderne. Tallene er pr. voksen.')}<div class="varerull"><table class="varer"><thead><tr><th scope="col">Ret eller råvare</th><th scope="col">Pr. person</th><th scope="col">Hvad tallet gælder</th><th scope="col">Kilde</th></tr></thead><tbody>${per.map(radTekst).join('')}</tbody></table></div>`,
    `<h2>Sådan regner vi</h2>${p(
      'Hvert tal på siderne er hentet fra en dansk kilde, og kilden står med link og årstal på siden. Vi regner ikke egne tal ud for, hvad der er rigeligt. Det eneste vi gør, er at gange kildens tal pr. person med antallet af personer.',
      `Børn: hvert barn tæller som en halv voksen i omregneren. Madens Verden skriver: »Børn mellem cirka ${tallTekst(4)} og ${tallTekst(10)} år regnes som en halv voksenportion.« (Madens Verden, ${data.kilder[barn.kilde].aar}). Arla skriver, at man som regel kan halvere mængden til børn.`,
      'Hvor kilderne er uenige, viser siden begge tal og siger, hvilket omregneren bruger. Oftest er det det første, der står i listen.',
    )}`,
    `<h2>Til jul og gæster</h2>${p(`Til juleaften eller gæstemiddag regner Danish Crown med ${delTekst(jul.verdi, jul.verdi, jul.enhet)} rå flæskesteg pr. voksen (Danish Crown, ${data.kilder[jul.kilde].aar}).`)}<ul><li><a href="${sti(flaesk.rad)}">Hvor meget flæskesteg pr. person?</a></li><li><a href="${sti(per.find((x) => x.rad.id === 'kalkun').rad)}">Hvor meget kalkun pr. person?</a></li><li><a href="${sti(gaester.rad)}">Hvor meget mad pr. person til gæster?</a></li></ul>`,
    APP,
    kildeliste(data, brukt),
  ].join('\n');
  const publisert = rader.map((r) => r.oppdatert).sort().at(-1);
  const description = `Hvor meget mad pr. person? Omregner for voksne og børn og tabel for ${rader.length} retter og råvarer, fra ris og pasta til flæskesteg og kalkun, med kilde på hvert tal.`;
  const kilderObjekter = [...brukt].map((id) => data.kilder[id]);
  const faq = [
    ['Hvor meget mad pr. person?', `Til gæster regner Madens Verden med ${delTekst(kod.verdi, kod.verdi, kod.enhet)} kød uden ben pr. voksen. For enkeltvarer varierer tallet: se tabellen oven for.`],
    ['Tæller børn som en hel person?', 'Madens Verden regner børn fra cirka fire til ti år som en halv voksenportion. Arla skriver, at man som regel kan halvere mængden til børn. Omregneren regner hvert barn som en halv voksen.'],
    ['Hvor kommer tallene fra?', 'Fra Madens Verden, Arla og Danish Crown. Hver side har kilderne med link og årstal.'],
    ['Hvorfor viser nogle sider flere tal for den samme vare?', 'Kilderne har ikke altid de samme tal. Siden viser begge og siger, hvilket omregneren bruger.'],
  ];
  return {
    title: 'Hvor meget mad pr. person? Omregner og tabel',
    description,
    eyebrow: 'Mængde pr. person',
    h1: 'Hvor meget mad pr. person?',
    lead: 'Vælg retten, skriv hvor mange voksne og børn I er, så får du hele mængden. Hvert tal er hentet fra en dansk kilde.',
    ...SKJELETT, rik,
    faqTittel: 'Spørgsmål om mængde pr. person',
    faq,
    publisert,
    schemas: [
      brodsmule(),
      webApplikasjon({ navn: 'Hvor meget mad pr. person?', beskrivelse: description, adresse: ROT }),
      artikkel({ tittel: 'Hvor meget mad pr. person?', beskrivelse: description, adresse: ROT, sprak: 'da', publisert, kilder: kilderObjekter }),
      elementliste({ navn: 'Mængde pr. person', adresse: ROT, elementer: rader.map((r) => ({ navn: r.navn, adresse: sti(r) })) }),
      faqSkjema(faq),
    ],
  };
}

const TALL = /\d{1,3}(?:[   ]\d{3})+(?:[.,]\d+)?(?:\/\d+)?|\d+(?:[.,]\d+)?(?:\/\d+)?|[½⅓⅔¼¾⅛⅜⅝⅞]/gu;
const tallene = (t) => (String(t ?? '').match(TALL) ?? []).map((x) => x.replace(/[   ]/gu, ''));
const kildeTall = (k) => [String(k.aar), ...tallene(danskDato(k.hentet))];
const medBegge = (s, n) => { s.add(n); s.add(n.replace('.', ',')); s.add(n.replace(',', '.')); };

/** Tallene DEN siden kan bruge: radens egne tal og sitater, personerne i tabellen og det de giver ganget med kildens tal, omregnerens start, og kildernes år og datoer. */
export function tillatteTall(rad, data) {
  const s = new Set();
  const legg = (t) => tallene(t).forEach((n) => medBegge(s, n));
  PERSONER.forEach((n) => legg(n));
  legg(START.voksne); legg(START.barn);
  for (const x of Object.values(rad.tall)) {
    legg(x.verdi); legg(x.merknad);
    if (enMaal(x.enhet)) for (const n of PERSONER) legg(delTekst(x.verdi * n, x.verdi * n, x.enhet));
    for (const n of PERSONER) legg(x.verdi * n);
  }
  for (const v of Object.values(rad.tekst ?? {})) legg(v.split('|').slice(1).join('|'));
  for (const k of Object.values(data.kilder)) kildeTall(k).forEach((n) => medBegge(s, n));
  // Faktoren for børn og tallene i omregnerens datafelt kommer af de samme værdier.
  return s;
}

/** Samlesiden: alle publiserbare rækkers tal, personerne, aldersgruppen for børn, kildernes år og datoer. */
export function tillatteTallNav(data) {
  const alle = publiserbare(data);
  const s = new Set([String(alle.length), '4', '10']);
  for (const r of alle) for (const n of tillatteTall(r, data)) s.add(n);
  return s;
}

export const maskeNavn = (rad) => [rad.navn, rad.navn.toLowerCase()];

// Malen for familien «ukemeny» (nb): en samleside (/ukemenyer/) og én side per ukemeny.
// Rettene, restene og varene står i menyer.nb.json (kontrollert av meny.mjs). Tallene står i data.nb.json med kilde.
// Siden skriver ingen tall selv: alt med sifre kommer fra datafila (tillatteTall), og priser, kalorier og
// porsjonsstørrelser står ikke på sidene fordi vi ikke har en åpen kilde for dem per rett.
// Oppskriftene er MatPrats. Vi lenker til dem og gjengir dem ikke; handlelista har varene uten mengder.
import { kilderFor } from '../felles.mjs';
import { artikkel, brodsmuler, elementliste } from '../skjema.mjs';
import { byggRik } from '../../rik-sider.mjs';
import { esc, tallI } from '../../kalk-kort.mjs';
import { handleliste, lesMenyer, resteKjeder } from './meny.mjs';

const ROT = '/ukemenyer/';
const MENYER = lesMenyer();
// Appens gratisgrense for import fra lenker, slik nettstedet selv oppgir den (/importer-oppskrifter/, /oppskriftsbok-app/).
export const GRATIS_IMPORTER = 5;

const MAANEDER = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'];
const norskDato = (iso) => { const [a, m, d] = iso.split('-').map(Number); return `${d}. ${MAANEDER[m - 1]} ${a}`; };
const stor = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const og = (xs) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} og ${xs.at(-1)}` : xs[0] ?? '');
const p = (...xs) => xs.map((x) => `<p>${x}</p>`).join('');
const ul = (xs) => `<ul>${xs.map((x) => `<li>${x}</li>`).join('')}</ul>`;
const sti = (rad) => `${ROT}${rad.slug}/`;
const ORD = ['ingen', 'én', 'to', 'tre', 'fire', 'fem', 'seks', 'sju'];
const KORT = { mandag: 'man', tirsdag: 'tir', onsdag: 'ons', torsdag: 'tor', fredag: 'fre', lørdag: 'lør', søndag: 'søn' };

/** Tallteksten fra datafila: «2 til 4 dager», «60 °C» osv. Kaster hvis tallet mangler, så siden aldri skriver et tall uten kilde. */
function tall(rad, id) {
  const t = rad.tall[id];
  if (!t) throw new Error(`ukemeny/${rad.id}: tallet «${id}» mangler i data.nb.json`);
  return t.verdi;
}
const restDager = (rad) => `${tall(rad, 'rester_min')} til ${tall(rad, 'rester_maks')} dager`;

export const menyFor = (rad) => {
  const m = MENYER.menyer[rad.id];
  if (!m) throw new Error(`ukemeny/${rad.id}: ingen meny i menyer.nb.json`);
  return m;
};
export const alleMenyer = () => MENYER;

// Tekst som er lik for alle ukemenyene står ett sted, så den kan rettes ett sted.
function mattrygghet(rad, hvor = 'i denne uka') {
  return ul([
    `<strong>Kjøl ned med en gang.</strong> Mattilsynet sier at varm mat skal ned fra ${tall(rad, 'avkjol_fra')} °C til ${tall(rad, 'avkjol_til')} °C så raskt som mulig, og senest i løpet av to timer. Del maten i mindre bokser, så går det fortere.`,
    `<strong>Kjøleskapet under ${tall(rad, 'kjoleskap')} °C.</strong> Legg et termometer inne i skapet og sjekk det.`,
    `<strong>Rester holder ${restDager(rad)}.</strong> Det er Mattilsynets ramme for restemat i kjøleskap. Restene ${hvor} brukes senest to dager etter, eller de fryses. Se, lukt og smak før du spiser.`,
    `<strong>Varm restene godt.</strong> Over ${tall(rad, 'oppvarming')} grader i flere minutter dreper de aller fleste bakterier, ifølge Mattilsynet. Maten skal være rykende varm.`,
    '<strong>Ris og pasta lagres ikke.</strong> Mattilsynet råder deg til å koke bare den risen du trenger til hvert måltid. Derfor går ingen ris eller pasta videre som rest i menyene våre.',
  ]);
}

function dagKort(x) {
  const rader = [['Hvorfor denne dagen', esc(x.hvorfor)]];
  if (x.lagMer) rader.push(['Lag mer', esc(x.lagMer)]);
  if (x.rest) rader.push(['Bruker rester', `${stor(esc(x.rest.hva))} fra ${x.rest.fra}${x.rest.via === 'fryser' ? ', via fryseren' : ''}.`]);
  if (x.framgang) rader.push(['Slik gjør du', `<ol>${x.framgang.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>`]);
  else rader.push(['Oppskrift', `<a href="${esc(x.oppskrift)}" rel="noopener">Oppskriften hos MatPrat</a>`]);
  return `<div class="scenario" id="dag-${x.dag.replace('ø', 'o')}"><h3>${stor(x.dag)}: ${esc(x.rett)}</h3><dl>${rader.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl></div>`;
}

function oversikt(meny) {
  return `${p('Dagene merket «rester» bruker noe du lager mer av tidligere i uka. Under tabellen står hvorfor hver rett står der den står.')}<table><thead><tr><th scope="col">Dag</th><th scope="col">Middag</th></tr></thead><tbody>${meny.dager.map((x) => `<tr><th scope="row">${stor(x.dag)}</th><td>${esc(x.rett)}${x.rest ? ' <small>(rester)</small>' : ''}</td></tr>`).join('')}</tbody></table>`;
}

function resterAvsnitt(rad, meny) {
  const kjeder = resteKjeder(meny).map((k) => `<strong>${stor(k.fra)} til ${k.til}${k.via ? ', via fryseren' : ''}:</strong> ${esc(k.lagMer)} ${stor(k.til)} bruker ${esc(k.hva)}.`);
  return p(esc(meny.vinkel)) + ul(kjeder) + '<h3>Regler for restene</h3>' + mattrygghet(rad);
}

function handlelisteAvsnitt(meny) {
  const liste = handleliste(meny, MENYER);
  return p(`Lista har alle varene de sju oppskriftene trenger, gruppert etter hyllene i butikken. Der en rett bruker rester, står bare det du må kjøpe i tillegg. Mengdene står i oppskriftene. Dagene etter hver vare viser hvilke middager den skal til. Ferskvarer til slutten av uka kan du kjøpe nærmere dagen.`)
    + liste.map((h) => `<h3>${esc(h.hylle)}</h3><ul class="handleliste" data-hylle="${esc(h.hylle)}">${h.varer.map((v) => `<li data-vare="${esc(v.vare)}">${esc(stor(v.vare))} <small>(${v.dager.map((d) => KORT[d]).join(', ')})</small></li>`).join('')}</ul>`).join('')
    + p(`<strong>Sjekk at du har:</strong> ${esc(og(MENYER.basis))}. Disse står ikke i lista over.`);
}

function appAvsnitt(meny) {
  const egne = meny.dager.filter((x) => x.framgang).map((x) => x.dag);
  const lenker = meny.dager.filter((x) => x.oppskrift).length;
  return p('Matlyst lager ikke ukemenyen for deg, og den vet ikke hvilke rester du har. Det du får, er en ukemeny med oppskriftene dine og én handleliste som lages fra dem. Slik legger du inn denne uka:')
    + `<ol>
<li><strong>Lagre oppskriftene.</strong> Åpne hver lenke over og del den til Matlyst, eller lim inn lenken i appen. Se <a href="/importer-fra-matprat/">slik lagrer du MatPrat-oppskrifter</a>.${egne.length ? ` For ${og(egne)} har uka ingen lenke. Skriv framgangsmåten over inn som en egen oppskrift.` : ''}</li>
<li><strong>Legg dem på dagene.</strong> Åpne <a href="/ukemeny/">Ukemeny</a> og legg hver oppskrift på dagen den står på her.</li>
<li><strong>Juster porsjonene.</strong> Der uka sier «lag mer», øker du antall porsjoner på den oppskriften før du handler.</li>
<li><strong>Legg uka på handlelista.</strong> Matlyst samler like varer på én linje og sorterer lista etter hylle. Før varene legges inn, ser du lista og kan fjerne haken ved det du får fra restene, for eksempel kjøttsausen i en rett som bruker sausen fra en tidligere dag.</li>
</ol>`
    + p(`<strong>Gratis eller Pro:</strong> Ukemenyen og handlelista er gratis. Import fra lenker er gratis for ${GRATIS_IMPORTER} oppskrifter i måneden, og denne uka har ${ORD[lenker]} lenker${lenker > GRATIS_IMPORTER ? '. Med gratisversjonen kan du lagre resten måneden etter, eller skrive dem inn selv' : ''}. Med Matlyst Pro er det ingen slik grense, og husstanden kan dele ukemenyen og handlelista.`);
}

function kildeAvsnitt(data, rader, meny) {
  const kilder = kilderFor(data, rader);
  return p(`${meny ? `Oppskriftene er MatPrats (Opplysningskontoret for egg og kjøtt). Vi lenker til dem og gjengir dem ikke, og lenkene ble åpnet ${norskDato(MENYER.hentet)}. Framgangsmåtene uten lenke er våre egne. ` : ''}Rådene om rester, kjøling og oppvarming er fra Mattilsynet, den norske myndigheten for mattrygghet.`)
    + `<ol class="kilder" id="kilder">${kilder.map((k) => `<li>${esc(k.utgiver)}: ${esc(k.navn)} (${k.aar}). <a href="${esc(k.adresse)}" rel="noopener">${esc(new URL(k.adresse).hostname)}</a>. Hentet ${norskDato(k.hentet)}.</li>`).join('')}</ol>`
    + p('Vi oppgir ingen priser, kalorier eller porsjonsstørrelser, fordi vi ikke har en åpen kilde for dem per rett. Fant du en feil, eller har en lenke sluttet å virke? Skriv til <a href="mailto:hei@matlyst-app.no">hei@matlyst-app.no</a>.');
}

function felleSpm(rad) {
  return [
    ['Hvor lenge holder restene seg i kjøleskapet?', `Mattilsynet sier at restemat holder seg ${restDager(rad)} i kjøleskap. Kjøl maten ned raskt, senest i løpet av to timer, og frys det du ikke skal spise snart. Restene i denne uka brukes senest to dager etter.`],
    ['Kan jeg lagre ukemenyen i Matlyst?', 'Ja. Lagre oppskriftene, legg dem på dagene i ukemenyen, og legg uka på handlelista. Matlyst lager ikke menyen for deg, så du legger den inn selv.'],
  ];
}

const svarFor = (meny) => {
  const rester = meny.dager.filter((x) => x.rest).length;
  return `${stor(og(meny.dager.map((x) => `${x.dag} ${esc(x.rett.charAt(0).toLowerCase() + x.rett.slice(1))}`)))}. ${stor(ORD[rester])} av middagene bruker rester fra en tidligere dag, og handlelista under har alt du trenger for hele uka.`;
};

/** Tallene siden kan vise: radens tall og merknader, kildenes år og hentedatoer, og appens gratisgrense. */
export function tillatteTall(rad, data) {
  const s = new Set([String(GRATIS_IMPORTER)]);
  for (const t of Object.values(rad.tall)) { s.add(String(t.verdi)); tallI(t.merknad).forEach((n) => s.add(n)); }
  for (const k of kilderFor(data, [rad])) { s.add(String(k.aar)); tallI(norskDato(k.hentet)).forEach((n) => s.add(n)); }
  tallI(norskDato(MENYER.hentet)).forEach((n) => s.add(n));
  return s;
}

export function tillatteTallNav(data) {
  const s = new Set();
  for (const r of data.rader.filter((x) => x.status === 'kontrollert')) for (const n of tillatteTall(r, data)) s.add(n);
  return s;
}

/** Radens egne navn som duplikatvakten maskerer: menyens navn og rettene. */
export const maskeNavn = (rad) => [rad.navn.toLowerCase(), ...menyFor(rad).dager.map((x) => x.rett)];

export function sideForRad(rad, data) {
  const meny = menyFor(rad);
  const adresse = sti(rad);
  const fyll = (a) => (a.includes('{fryser}') ? a.replace('{fryser}', `${tall(rad, 'fryser_kv_min')} til ${tall(rad, 'fryser_kv_maks')} måneder`) : a);
  const faq = [...meny.faq.map(([q, a]) => [q, esc(fyll(a))]), ...felleSpm(rad)];
  const rik = byggRik({
    lang: 'nb',
    svarTekst: svarFor(meny),
    seksjoner: [
      ['Ukemenyen dag for dag', oversikt(meny) + meny.dager.map(dagKort).join('')],
      ['Slik bruker du restene', resterAvsnitt(rad, meny)],
      ['Handleliste for hele uka', handlelisteAvsnitt(meny)],
      ['Lagre uka i Matlyst', appAvsnitt(meny)],
      ['Kilder', kildeAvsnitt(data, [rad], meny)],
    ],
  }).html;
  const andre = data.rader.filter((r) => r.status === 'kontrollert' && r.id !== rad.id);
  const relatert = `<div class="related"><h2>Andre ukemenyer</h2><ul>${andre.map((r) => `<li><a href="${sti(r)}">${esc(menyFor(r).h1)}</a></li>`).join('')}<li><a href="${ROT}">Alle ukemenyer</a></li></ul></div>`;
  return {
    title: meny.tittel,
    description: meny.beskrivelse,
    eyebrow: `<a href="${ROT}">Ukemenyer</a><span aria-hidden="true"> › </span>${esc(rad.navn)}`,
    h1: meny.h1,
    lead: esc(meny.ingress),
    steg: [['Les gjennom uka', 'Sju middager, og hvilke dager som lager rester.'], ['Handle én gang', 'Bruk handlelista, som er gruppert etter hylle.'], ['Lag mer der uka sier det', 'Så har du middagen to dager senere.']],
    stegTittel: 'Slik bruker du ukemenyen', forst: '', alternativ: '', grense: '', seksjoner: [],
    rik: `${rik}\n${relatert}`,
    faqTittel: 'Spørsmål om ukemenyen', faq,
    cta: 'Planlegg uka i Matlyst',
    publisert: rad.oppdatert,
    schemas: [
      brodsmuler([{ navn: 'Forside', adresse: '/' }, { navn: 'Ukemenyer', adresse: ROT }, { navn: meny.h1, adresse }]),
      artikkel({ tittel: meny.h1, beskrivelse: meny.beskrivelse, adresse, sprak: 'nb', publisert: rad.oppdatert, kilder: kilderFor(data, [rad]) }),
      elementliste({ navn: `${meny.h1}: sju middager`, adresse, elementer: meny.dager.map((x) => ({ navn: `${stor(x.dag)}: ${x.rett}`, adresse: x.oppskrift ?? `${adresse}#dag-${x.dag.replace('ø', 'o')}` })) }),
    ],
  };
}

export function navSide(data, rader) {
  const kort = rader.map((r) => {
    const m = menyFor(r);
    return `<div class="scenario"><h3><a href="${sti(r)}">${esc(m.h1)}</a></h3><p>${esc(m.ingress)}</p><p>${esc(og(m.dager.map((x) => x.rett)))}.</p></div>`;
  }).join('');
  const navn = rader.map((r) => r.navn.toLowerCase());
  const rad0 = rader[0];
  const rik = byggRik({
    lang: 'nb',
    svarTekst: `Hver ukemeny har sju middager med lenke til oppskriften, en plan for hvordan restene brukes videre i uka, og én handleliste gruppert etter hylle. Velg mellom ${og(navn)}.`,
    seksjoner: [
      ['Velg en ukemeny', p('Alle ukemenyene går fra mandag til søndag og har samme oppbygging: dagene, restene, handlelista og veien inn i appen.') + kort],
      ['Slik er ukemenyene satt opp', ul([
        '<strong>Rester er planlagt inn.</strong> Hver uke har dager som lager mer, og dager som bruker det. Ingen rest står lenger enn to dager i kjøleskapet, og ingen ris eller pasta går videre som rest.',
        '<strong>Én handleliste for hele uka.</strong> Varene står én gang, gruppert etter de samme hyllene som i Matlyst, med dagene som trenger dem.',
        '<strong>Oppskriftene er MatPrats.</strong> Vi lenker til dem og gjengir dem ikke. Der en rett ikke trenger oppskrift, står en kort framgangsmåte vi har skrevet selv.',
        '<strong>Ingen tall uten kilde.</strong> Vi oppgir ingen priser, kalorier eller porsjonsstørrelser. Rådene om rester og kjøling er fra Mattilsynet.',
      ])],
      ['Regler for restene', mattrygghet(rad0, 'i ukemenyene våre')],
      ['Planlegg med dine egne oppskrifter', p('Vil du heller bruke oppskriftene du allerede har? I <a href="/ukemeny/">ukemenyen i Matlyst</a> legger du dine egne oppskrifter på dagene og får én handleliste for hele uka, sortert etter hylle. Matlyst velger ikke rettene for deg.')],
      ['Kilder', kildeAvsnitt(data, rader, null)],
    ],
  }).html;
  const publisert = rader.map((r) => r.oppdatert).sort().at(-1);
  const description = 'Ferdige ukemenyer med sju middager, rester planlagt inn i uka og én handleliste etter hylle: for familien, billig, vegetar, for én og husmannskost.';
  return {
    title: 'Ukemenyer: sju middager med handleliste',
    description,
    eyebrow: 'Ukemenyer',
    h1: 'Ukemenyer med handleliste',
    lead: 'Sju middager per uke, satt opp slik at én middag lager den neste, og med én handleliste for hele uka.',
    steg: [['Velg en ukemeny', 'Familie, billig, vegetar, for én eller husmannskost.'], ['Handle én gang', 'Bruk den samlede handlelista.'], ['Bruk restene', 'Uka sier hvilke dager som lager mer.']],
    stegTittel: 'Slik bruker du ukemenyene', forst: '', alternativ: '', grense: '', seksjoner: [],
    rik,
    faqTittel: 'Spørsmål om ukemenyene',
    faq: [
      ['Er ukemenyene gratis?', 'Ja. Sidene er gratis å bruke, og du trenger ikke appen for å følge dem. Ukemenyen og handlelista i Matlyst er også gratis.'],
      ['Kommer det en ny ukemeny hver uke?', 'Nei. Dette er faste ukemenyer du kan bruke når du vil. Bytt gjerne ut en rett, men hold avstanden mellom en rett og restene den lager.'],
      ['Hvorfor står det ingen priser eller kalorier?', 'Vi skriver bare tall vi har en åpen kilde for. Priser endrer seg fra butikk til butikk og uke til uke, og vi har ingen kilde for næringsinnholdet i hver rett.'],
      ['Hvor lenge holder restene seg?', `Mattilsynet sier at restemat holder seg ${restDager(rad0)} i kjøleskap. Restene i ukemenyene våre brukes senest to dager etter.`],
    ],
    cta: 'Planlegg uka i Matlyst',
    publisert,
    schemas: [
      brodsmuler([{ navn: 'Forside', adresse: '/' }, { navn: 'Ukemenyer', adresse: ROT }]),
      artikkel({ tittel: 'Ukemenyer med handleliste', beskrivelse: description, adresse: ROT, sprak: 'nb', publisert, kilder: kilderFor(data, rader) }),
      elementliste({ navn: 'Ukemenyer', adresse: ROT, elementer: rader.map((r) => ({ navn: menyFor(r).h1, adresse: sti(r) })) }),
    ],
  };
}

// Nyttårsmiddag (nb): kalkun fra tre uker før nyttårsaften. Utkast til Patricks godkjenning, skrevet 2026-11-21.
// Hvert tall kommer fra hoytider.data.json (se hoytid-felles.mjs). Siden gir ingen oppskrifter.
import { byggRik } from '../rik-sider.mjs';
import { HENTET, KILDEINTRO, kg, lagSide, p, skjemaFor, tabell, ul } from './hoytid-felles.mjs';

export const STI = 'nyttarsmiddag/';
const s = lagSide();
const { t, rad, mp, mt, tekst } = s;

export const GJESTER = [4, 6, 8, 10, 12, 16];
export const VEKTER = [5, 6, 7];
const rader = { pp: rad('kalkun-pp'), ung: rad('kalkun-pp-unge'), filet: rad('jm-filet'), pot: rad('jm-poteter'), saus: rad('jm-saus') };
const dlfmt = (x) => String(x).replace('.', ',');
export const kalkunRad = (n) => [String(n), kg(n * rader.pp.g), kg(n * rader.ung.g)];
export const tilbehorRad = (n) => [String(n), kg(n * rader.filet.g), kg(n * rader.pot.g), `${dlfmt(n * rader.saus.dl[0])} til ${dlfmt(n * rader.saus.dl[1])} dl`];
const PER_KILO_MIN = 30;
export const FYLT = [30, 45];
export const tid = (min) => { const t_ = Math.floor(min / 60); const m = min % 60; return `${t_} ${t_ === 1 ? 'time' : 'timer'}${m ? ` ${m} minutter` : ''}`; };
export const stekRad = (kilo) => {
  const min = kilo * PER_KILO_MIN;
  return [`${kilo} kg`, tid(min), `${tid(min + FYLT[0])} til ${tid(min + FYLT[1])}`, `${(kilo * 1000) / rader.pp.g} gjester`];
};
['kalkun-kilo', 'kalkun-fylt', 'kalkun-vekt'].forEach((id) => rad(id));

// Tidslinjen regnes fra middagstid, steketiden for 6 kilo (3 timer) og hviletiden (minst 20 minutter). Nyttårsaften 2026 er torsdag 31. desember.
export const MIDDAG_MIN = 18 * 60;
export const STEK_6KG_MIN = 6 * PER_KILO_MIN;
export const HVILE_MIN = 20;
export const INN_I_OVN_MIN = MIDDAG_MIN - HVILE_MIN - STEK_6KG_MIN;
export const kl = (min) => `kl. ${String(Math.floor(min / 60)).padStart(2, '0')}.${String(min % 60).padStart(2, '0')}`;

const tidsrader = [
  ['Tre uker før, torsdag 10. desember', ul(
    `Sett antall gjester. ${mp('mp-hel-kalkun')} sier at hovedregelen er ${t('kalkun-pp')} kalkun per person, og ${t('kalkun-pp-unge')} hvis mange av gjestene er unge voksne med god matlyst. Kilden gir et eksempel: en kalkun på ${t('kalkun-6kg')} til et selskap med ${t('kalkun-10pers')} med god matlyst.`,
    `Bestill kalkunen. ${mp('mp-julemat')} sier at kalkun stort sett selges frossen.${tekst('jm-frossen')}`,
    `Er dere flere enn én kalkun holder til, sier ${mp('mp-hel-kalkun')} at du kan supplere med kalkunfilet eller marinerte kalkunbryst.${tekst('kalkun-supplere')}`)],
  ['Én uke før, torsdag 24. desember', ul(
    `Legg et termometer i kjøleskapet. ${mt('mt-oppbevaring')} sier at det bør være under ${t('mt-kjole-ned')}, men over ${t('mt-kjole-opp')}. Rydd plass til kalkunen, for den skal tines der.`,
    'Handle første liste: det som holder seg, som tørrvarer, drikke og hermetikk.')],
  ['Tre dager før, mandag 28. desember', ul(
    `Ta kalkunen ut av fryseren. ${mp('mp-julefaq')} sier at den skal ut ${t('kalkun-tine')} før serveringsdagen, og at det tar ${t('kalkun-tine-dogn')} å tine i kjøleskap. ${mt('mt-oppbevaring')} sier at tining i kjøleskap går saktere, men er tryggere.${tekst('mt-tine')}`,
    `Er kjøleskapet helt fullt, sier ${mp('mp-hel-kalkun')} at kalkunen kan stå i det kaldeste rommet du har.${tekst('kalkun-tine-fullt')} Har du glemt å tine den, kan den tines raskt i kaldt vann.${tekst('kalkun-tine-vann')}`)],
  ['Dagen før, onsdag 30. desember', ul(
    `Ta ut innmatsposen så snart den løsner, og kok kraft av den i ${t('kalkun-kraft')}, ifølge ${mp('mp-hel-kalkun')}.${tekst('kalkun-innmat')} Kraften bruker du i sausen.`,
    `${mp('mp-hel-kalkun')} sier at sausen gjerne kan lages ferdig dagen før.${tekst('kalkun-saus')} Lag desserten og dekk bordet.`,
    'Handle andre liste: det ferske, som poteter, grønnsaker og det som skal spises raskt.')],
  ['Nyttårsaften, torsdag 31. desember', ul(
    `Stek kalkunen ved ${t('kalkun-ovn')}, i ca. ${t('kalkun-kilo')}, ifølge ${mp('mp-hel-kalkun')}. En kalkun på ${t('kalkun-6kg')} trenger ${t('kalkun-6kg-tid')}. Skal maten stå på bordet kl. 18.00, og kalkunen skal hvile ${t('kalkun-hvile')} først, må den altså inn i ovnen ${kl(INN_I_OVN_MIN)}. Regnet ut: middagstid minus hviletid minus steketid.`,
    `Ha ${t('kalkun-vann')} vann i pannen under steking. Er kalkunen fylt, legger du til ${t('kalkun-fylt')}, ifølge ${mp('mp-hel-kalkun')}.`,
    `La kalkunen hvile på kjøkkenbenken i minst ${t('kalkun-hvile')} før du skjærer den. ${mp('mp-hel-kalkun')} sier at kalkun ikke trenger å serveres glohet, men at sausen og poteter serveres rykende varme.${tekst('kalkun-lun')}`,
    `Skal sausen og tilbehøret holdes varmt, sier ${mt('mt-rykende')} at maten skal holdes rykende varm, ${t('mt-over-60')}, fram til servering, etter oppvarming til ${t('mt-over-70')}.`)],
  ['Nyttårsdag og romjul', ul(
    `${mt('mt-oppbevaring')} sier at varm, hjemmelaget mat skal kjøles fra ${t('mt-avkjol-fra')} til ${t('mt-avkjol-til')} så raskt som mulig, og senest i løpet av to timer. Del maten i mindre porsjoner, så går det fortere.${tekst('mt-del')}`,
    `Restemat holder seg ${t('mt-rester')} i kjøleskap. Skal du ikke spise den snart, frys den med en gang.${tekst('mt-frys')}`,
    'Se også <a href="/holdbarhet/rester/">holdbarhet for rester</a> og <a href="/frysing/">hva som kan fryses</a>. Trenger du idéer til restene, finnes <a href="/hva-kan-jeg-lage/">hva kan jeg lage med det du har igjen</a>.')],
];
const tidslinje = tidsrader.map(([naar, hva]) => `<h3>${naar}</h3>${hva}`).join('');

const mengder = p(`${mp('mp-hel-kalkun')} sier ${t('kalkun-pp')} kalkun per person, og ${t('kalkun-pp-unge')} når mange er unge voksne med god matlyst. ${mp('mp-julefaq')} regner at en kalkun på ${t('kalkun-6kg')} holder til ${t('kalkun-6kg-12')}.`)
  + tabell(['Gjester', `Hel kalkun, ${rader.pp.vis} per person`, `Hel kalkun, ${rader.ung.vis} per person`], GJESTER.map(kalkunRad))
  + p(`${mp('mp-kalkun')} oppgir hel kalkun på ${t('kalkun-vekt')} i tabellen sin. Er du flere enn kalkunen holder til, sier ${mp('mp-hel-kalkun')} at du kan supplere med kalkunfilet.`)
  + '<h3>Filet, poteter og saus</h3>'
  + p(`${mp('mp-julemat')} oppgir ${t('jm-filet')} kalkunfilet eller kalkunbryst per person, ${t('jm-poteter')} poteter og ${t('jm-saus')} saus.`)
  + tabell(['Gjester', 'Kalkunfilet', 'Poteter', 'Saus'], GJESTER.map(tilbehorRad))
  + p(`Små barn: ${mp('mp-julemat')} sier at du kan beregne en ${t('jm-barn')} til dem og en full porsjon til ungdom og voksne.`)
  + p('Les også <a href="/mengde-per-person/kalkun/">hvor mye kalkun per person</a> og <a href="/mengde-per-person/julemat/">hvor mye julemat per person</a>.');

const steking = p(`${mp('mp-hel-kalkun')} anbefaler ${t('kalkun-kilo')} ved ${t('kalkun-ovn')}, og sier at en kalkun på ${t('kalkun-6kg')} trenger ${t('kalkun-6kg-tid')}. Er den fylt, legger du til ${t('kalkun-fylt')}. Tabellen regner ut steketiden for vektene i ${mp('mp-kalkun')}, ${t('kalkun-vekt')}.`)
  + tabell(['Vekt', 'Steketid', 'Fylt kalkun', `Holder til (${rader.pp.vis} per person)`], VEKTER.map(stekRad))
  + p('Se også <a href="/steketid/kalkun/">steketid for kalkun, med kalkulator for vekt</a>.')
  + p(`Ekstra for filet: ${mp('mp-kalkun')} oppgir kalkunfilet uten skinn på ${t('kalkun-filet-g')}, brunet i stekepanne og stekt i ovn ${t('kalkun-filet-tid')} på ${t('kalkun-filet-ovn')}.`);

const kjerne = p(`Her sier kildene ikke det samme, så vi viser begge. Mattilsynet er myndigheten for mattrygghet, og står først.`)
  + ul(
    `${mt('mt-rykende')} sier at fjørfekjøtt bør gjennomstekes, fordi det kan være bakterier gjennom hele produktet.${tekst('mt-fjorfe')}`,
    `I rådene om grilling skriver ${mt('mt-sommer')} at alt fjørfekjøtt bør gjennomstekes, og at gjennomstekt betyr en kjernetemperatur på minimum ${t('mt-gjennom')}.${tekst('mt-fjorfe-sommer')}`,
    `${mp('mp-kalkun')} oppgir en kjernetemperatur på ${t('kalkun-kjerne')} for ferdig tilberedt hel kalkun, og ${t('kalkun-filet-kjerne')} for kalkunfilet.`,
    `${mp('mp-hel-kalkun')} sier at kalkunen er ferdig stekt hvis kjøttsaften som siver ut er klar, og at rosa kjøttsaft betyr litt lenger steketid.${tekst('kalkun-saft')}`,
    `${mp('mp-julefaq')} sier at plastdingsen som følger med noen kalkuner ikke er et sikkert hjelpemiddel, fordi den ofte spretter ut for sent.${tekst('kalkun-plast')}`)
  + p('Tallene er ikke like, og vi avgjør ikke hvilket som gjelder for din kalkun. Les begge kildene nederst på siden. Se også <a href="/kjernetemperatur/kalkun/">kjernetemperatur for kalkun</a>.');

const liste = `<ul>
<li><strong>Kjøtt:</strong> hel kalkun, og kalkunfilet hvis dere er flere enn kalkunen holder til (se tabellen).</li>
<li><strong>Grønt:</strong> poteter, og grønnsaker du selv velger som tilbehør.</li>
<li><strong>Kjøleskap:</strong> smør til å pensle kalkunen med, fløte eller melk til sausen.</li>
<li><strong>Til kraften:</strong> grønnsaker og krydder. Kraften lages av innmaten, og du bruker den i sausen.</li>
<li><strong>Tørrvarer og krydder:</strong> salt og pepper, mel eller maisenna til sausen.</li>
<li><strong>Dessert og drikke:</strong> det du selv skal ha til dessert og til bordet.</li></ul>`;

export const FAQ = [
  ['Hvor mye kalkun trenger jeg per person?', `${mp('mp-hel-kalkun')} sier ${t('kalkun-pp')} per person, og ${t('kalkun-pp-unge')} hvis mange er unge voksne med god matlyst. En kalkun på ${t('kalkun-6kg')} holder til ${t('kalkun-6kg-12')} ved ${t('kalkun-pp')} per person, ifølge ${mp('mp-julefaq')}.`],
  ['Når skal jeg ta kalkunen ut av fryseren?', `${mp('mp-julefaq')} sier ${t('kalkun-tine')} før serveringsdagen, og at det tar ${t('kalkun-tine-dogn')} å tine i kjøleskap. ${mt('mt-oppbevaring')} sier at tining i kjøleskap er tryggere enn på kjøkkenbenken.`],
  ['Hvor lenge skal kalkunen steke?', `${mp('mp-hel-kalkun')} anbefaler ${t('kalkun-kilo')} ved ${t('kalkun-ovn')}. Er kalkunen fylt, legger du til ${t('kalkun-fylt')}.`],
  ['Hvilken kjernetemperatur skal kalkunen ha?', `${mt('mt-sommer')} sier at gjennomstekt betyr minimum ${t('mt-gjennom')} i rådene om grilling. ${mp('mp-kalkun')} oppgir ${t('kalkun-kjerne')} for hel kalkun. Kildene er ikke like, så les begge på siden.`],
  ['Hvor lenge skal kalkunen hvile?', `${mp('mp-hel-kalkun')} sier minst ${t('kalkun-hvile')} på kjøkkenbenken før du skjærer den.`],
  ['Hvor lenge holder kalkunrester?', `${mt('mt-oppbevaring')} sier at restemat holder seg ${t('mt-rester')} i kjøleskap. Skal du ikke spise den snart, frys den med en gang.`],
  ['Gir Matlyst oppskrifter eller steketider til nyttårsmiddagen?', 'Nei. Du lagrer oppskriftene du selv bruker, regner dem om til antall gjester og sender ingrediensene til én handleliste.'],
];

const avsnitt = () => [
  ['Tidslinje fra tre uker før nyttårsaften',
    p(`Nyttårsaften 2026 er en torsdag. Tidslinjen under teller bakover fra den dagen. Alle tider og mengder på siden er <strong>veiledende</strong>: de kommer fra kildene nederst, og vekten på kalkunen, ovnen og kjøleskapet ditt kan endre dem. Bruk oppskriften og pakken som fasit.`)
    + tidslinje],
  ['Mengder ut fra antall gjester', mengder],
  ['Steketid for kalkun', steking],
  ['Kjernetemperatur: hva kildene sier', kjerne],
  ['Handleliste for nyttårsmiddagen',
    p('Handle i to runder: først det som holder seg, så det ferske. Lista under har ingen mengder, for dem finner du i tabellene over. I Matlyst legger du oppskriftene dine på handlelista, så får du alt samlet og sortert etter hylle.')
    + liste],
  ['Slik bruker du Matlyst til nyttårsmiddagen',
    p('Matlyst gir deg ingen oppskrifter og ingen steketider. Du lagrer oppskriftene du selv bruker, og Matlyst hjelper deg å holde orden.')
    + ul(
      'Lagre kalkun-, saus- og dessertoppskriften din fra nettsiden, Instagram eller TikTok, eller ta bilde av oppskriften i kokeboka (bildeimport er en Matlyst Pro-funksjon). Sjekk alltid utkastet mot originalen før du lagrer.',
      'Regn om oppskriften fra 1 til 20 porsjoner til antall gjester. Omregningen er lineær, så sjekk krydder og salt selv.',
      'Legg oppskriftene i <a href="/ukemeny/">ukemenyen</a>, de dagene du skal lage dem.',
      'Legg ukemenyen på <a href="/handleliste/">handlelista</a>, så får du like varer samlet og sortert etter hylle. Varer du har i spiskammeret, er fravalgt og merket «Har hjemme».',
      'Legg inn det som blir til overs i <a href="/spiskammer-app/">spiskammeret</a>, med utløpsdato, så ser du hva som bør brukes først.')
    + p('Matlyst varsler ikke om tining eller steketider. Skriv tidene i notatene på oppskriften, eller bruk tidslinjen over. Har du julemiddag også? Se <a href="/julemiddag/">planen for julemiddagen</a>.')],
  ['Kilder og tall',
    KILDEINTRO + s.kilderListe()
    + p('Fant du en feil, eller har en kilde endret seg? Skriv til <a href="mailto:hei@matlyst-app.no">hei@matlyst-app.no</a>, så rettes siden og datoen oppdateres. Les mer om hvordan vi jobber på <a href="/om/">om-siden</a>.')],
];

const TITTEL = 'Nyttårsmiddag: kalkun, tider og mengder';
const BESKRIVELSE = 'Plan for nyttårsmiddag med kalkun fra tre uker før: tining, steketid, kjernetemperatur, mengder per gjest og handleliste. Tall med kilde og dato.';
const H1 = 'Nyttårsmiddag med kalkun: tider og mengder';

const svarTekst = `Regn ${t('kalkun-pp')} kalkun per person. Ta en frossen kalkun ut av fryseren ${t('kalkun-tine')} før, og tin den i kjøleskap. Stek ved ${t('kalkun-ovn')} i ca. ${t('kalkun-kilo')}, og la den hvile i minst ${t('kalkun-hvile')}. Alle mengder og tider er veiledende, og hvert tall har kilde nederst på siden.`;
const seksjoner = avsnitt();
const rik = byggRik({ lang: 'nb', svarTekst, seksjoner }).html;

export const side = {
  title: TITTEL,
  description: BESKRIVELSE,
  eyebrow: 'Nyttårsmiddag',
  h1: H1,
  lead: 'Tidslinje fra tre uker før nyttårsaften, tining, steketid, mengder ut fra antall gjester og handleliste. Hvert tall har en kilde med adresse og hentedato, og tidene er veiledende.',
  publisert: HENTET,
  schemas: skjemaFor({ sti: STI, tittel: TITTEL, h1: H1, beskrivelse: BESKRIVELSE, kilder: s.brukt().kilder }),
  forst: '',
  stegTittel: 'Slik bruker du siden',
  steg: [
    ['Velg antall gjester', 'Regn kalkun per person og supplér med filet ved behov.'],
    ['Følg tidslinjen', 'Tin i kjøleskap, lag kraft og saus dagen før.'],
    ['Stek og la hvile', 'Regn steketiden bakover fra middagstid.'],
  ],
  alternativ: '',
  grense: '',
  seksjoner: [],
  faqTittel: 'Spørsmål om nyttårsmiddagen',
  rik,
  faq: FAQ,
  cta: 'Lagre nyttårsmiddagens oppskrifter i Matlyst',
};
export const BRUKT = () => s.brukt();

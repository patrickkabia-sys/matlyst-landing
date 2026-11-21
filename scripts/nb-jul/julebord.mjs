// Julebord hjemme (nb): plan fra tre uker før, mengder per gjest til koldtbord og buffet, handleliste og kjøling.
// Utkast til Patricks godkjenning, skrevet 2026-11-21. Hvert tall kommer fra hoytider.data.json (se hoytid-felles.mjs).
import { byggRik } from '../rik-sider.mjs';
import { DATA, HENTET, KILDEINTRO, kg, lagSide, p, skjemaFor, tabell, ul } from './hoytid-felles.mjs';

export const STI = 'julebord/';
const s = lagSide();
const { t, rad, mp, mt, tekst } = s;

// Antall gjester i tabellene. Regnestykket står her og gjentas uavhengig i testen.
export const GJESTER_TOTALT = [6, 10, 15, 20, 30];
export const GJESTER_RETTER = [10, 20];
// Rettene i MatPrats koldtbordtabell, i kildens rekkefølge. id peker på et tall i hoytider.data.json.
export const RETTER = [
  ['Roastbiff', 'kb-roastbiff'], ['Røkt skinke', 'kb-skinke'], ['Spekemat', 'kb-spekemat'], ['Kokt ørret', 'kb-orret'],
  ['Karbonade med løk', 'kb-karbonade'], ['Eggerøre', 'kb-egg'],
  ['Grønn salat', 'kb-salat'], ['Potetsalat', 'kb-salat'], ['Waldorfsalat', 'kb-salat'],
  ['Rømme', 'kb-romme'], ['Pepperrotkrem', 'kb-romme'], ['Remulade', 'kb-remulade'], ['Cumberlandsaus', 'kb-remulade'],
];
export const retterRad = ([navn, id]) => {
  const x = rad(id);
  const mengde = (n) => (x.g ? kg(n * x.g) : `${n * x.stk} ${id === 'kb-egg' ? 'egg' : 'stk'}`);
  return [navn, x.vis, ...GJESTER_RETTER.map(mengde)];
};
export const totalRad = (n) => {
  const [lav, hoy] = rad('kb-total').g;
  return [String(n), `${kg(n * lav)} til ${kg(n * hoy)}`, `${kg((n * lav) / 2)} til ${kg((n * hoy) / 2)}`];
};

const tidsrader = [
  ['Tre uker før', ul(
    `Sett dato og antall gjester. ${mp('mp-selskaper')} sier at du bør bestemme tidlig om du vil ha en meny i flere retter eller en buffet. ${tekst('sel-menyvalg')}${mp('mp-koldtbord')} beskriver et koldtbord som en buffet med kalde og lune retter.`,
    `Skriv en arbeidsplan med datoer og tider for når hver rett skal være ferdig. ${mp('mp-selskaper')} anbefaler det.${tekst('sel-arbeidsplan')}`,
    'Bestill kjøtt og fisk, og handle første liste: drikke, tørrvarer, brød, kjeks og det som holder seg.')],
  ['En uke før', ul(
    `Legg et termometer i kjøleskapet. ${mt('mt-oppbevaring')} sier at det bør være under ${t('mt-kjole-ned')}, men over ${t('mt-kjole-opp')}. Rydd plass, for et koldtbord fyller mye.`,
    `Lag det som tåler fryseren nå. ${mp('mp-koldtbord')} oppgir karbonader og paté som retter som kan fryses ned.${tekst('kb-fryses')}`)],
  ['Ett til to dager før', ul(
    `${mp('mp-koldtbord')} sier at disse kan lages ${t('kb-forveien')} før: roastbiff, skinkestek, helkokt laks eller ørret, kabaret, potetsalat, waldorfsalat, cumberlandsaus og remulade.`,
    `Del varm mat i små porsjoner og kjøl den raskt. ${mt('mt-oppbevaring')} sier at maten skal kjøles fra ${t('mt-avkjol-fra')} til ${t('mt-avkjol-til')} så raskt som mulig, og senest i løpet av to timer.${tekst('mt-del')}`)],
  ['Dagen før', ul(
    `${mp('mp-selskaper')} sier at du bør ha så mye som mulig ferdig eller forberedt dagen før selskapet.${tekst('sel-dagenfor')} Rens og skyll grønnsaker og poteter, og oppbevar dem i kaldt vann i kjøleskapet.${tekst('sel-gronnsaker')}`,
    `Sett rettene kaldt etter hvert som de er ferdige, ifølge ${mp('mp-selskaper')}.${tekst('sel-kaldt')} ${mt('mt-sommer')} oppsummerer det slik: hold varm mat varm og kald mat kald.${tekst('mt-varm-kald')}`,
    'Dekk bordet, finn fram fat og serveringsbestikk, og skriv hva som skal fram av kjøleskapet når.')],
  ['Selskapsdagen', ul(
    `${mp('mp-koldtbord')} sier at eggerøre, grønn salat og pepperrotkrem bør lages samme dag.${tekst('kb-samme-dag')}`,
    `Skal du servere varme retter, sier ${mt('mt-rykende')} at maten skal holdes rykende varm, ${t('mt-over-60')}, fram til servering, etter at den er varmet opp til ${t('mt-over-70')}.`,
    `Spekemat kan stå fremme ${t('sp-fremme')}, så lenge det ikke er veldig varmt eller direkte sollys, ifølge ${mp('mp-spekemat')}.`)],
  ['Dagen etter', ul(
    `${mt('mt-oppbevaring')} sier at restemat holder seg ${t('mt-rester')} i kjøleskap, og at du skal fryse den med en gang hvis du ikke skal spise den snart.${tekst('mt-frys')}`,
    'Se også <a href="/holdbarhet/rester/">holdbarhet for rester</a> og <a href="/frysing/">hva som kan fryses</a>.')],
];
const tidslinje = tidsrader.map(([naar, hva]) => `<h3>${naar}</h3>${hva}`).join('');

const mengder = p(`${mp('mp-koldtbord')} sier at du bør beregne ${t('kb-total')} mat per person på et koldtbord, med tilbehør, og at omtrent halvparten bør være fisk eller kjøtt. ${mp('mp-selskaper')} har en grunnregel på ${t('sel-grunn')} mat per person til selskap, og et eksempel: ${t('sel-20')} gir cirka ${t('sel-10kg')} mat totalt, med cirka ${t('sel-kjott')} rent kjøtt og fisk, ${t('sel-3kg')} grønnsaker og ${t('sel-3kg')} poteter, ris eller pasta.`)
  + tabell(['Gjester', 'Mat totalt', 'Herav kjøtt og fisk (halvparten)'], GJESTER_TOTALT.map(totalRad))
  + p(`Tabellen er regnet ut fra ${t('kb-total')} per person. Halvparten er kildens «omtrent halvparten», regnet ut for deg.`)
  + '<h3>Per rett</h3>'
  + p(`${mp('mp-koldtbord')} oppgir en mengde per porsjon for hver rett. Tabellen ganger dem opp til ti og tjue gjester. Du skal ikke ha alle rettene: ${mp('mp-koldtbord')} sier at du kan velge færre retter, så lenge total mengde mat er omtrent den samme.${tekst('kb-enklere')}`)
  + tabell(['Rett', 'Per porsjon', `${GJESTER_RETTER[0]} gjester`, `${GJESTER_RETTER[1]} gjester`], RETTER.map(retterRad))
  + '<h3>Når du justerer</h3>'
  + ul(
    `Spekemat som del av et større koldtbord: ${t('kb-spekemat-stort')} per person, ifølge ${mp('mp-koldtbord')}.`,
    `Små barn: ${mp('mp-julemat')} sier at du kan beregne en ${t('jm-barn')}, og en full porsjon til ungdom og voksne.`,
    `${mp('mp-selskaper')} sier at du bør beregne litt ekstra av hver rett på en buffet, så ikke alle fatene er tomme når gjestene har forsynt seg.${tekst('sel-buffet')} Saus, dressing, pynt og tilbehør kommer i tillegg.${tekst('sel-sauser')}`,
    `${mp('mp-koldtbord')} minner om at noe er mer populært enn annet. Er det mange retter, beregner du mindre av hver, ifølge ${mp('mp-mange')}.${tekst('kb-populaert')}${tekst('mange-flere')}`)
  + '<h3>Varm julemat i tillegg</h3>'
  + p(`Skal det også være ribbe eller pinnekjøtt, regner ${mp('mp-julemat')} ${t('jm-ribbe')} ribbe eller ${t('jm-pinnekjott')} tørket pinnekjøtt per person, og ${t('jm-poteter')} poteter og ${t('jm-saus')} saus. Har du koldtbord ved siden av, bruker du mindre av hver rett. Planen for selve steketiden står på <a href="/julemiddag/">julemiddagssiden</a>.`)
  + p('Les også <a href="/mengde-per-person/koldtbord/">hvor mye mat til koldtbord</a>, <a href="/mengde-per-person/spekemat/">hvor mye spekemat per person</a>, <a href="/mengde-per-person/mat-til-selskap/">hvor mye mat til selskap</a> og <a href="/mengde-per-person/julemat/">hvor mye julemat per person</a>.');

const liste = `<ul>
<li><strong>Kjøtt og pålegg:</strong> roastbiff, skinkestek, røkt skinke, spekemat, karbonader og paté. Du kan kjøpe det meste ferdig oppskåret, ifølge ${mp('mp-koldtbord')}.${tekst('kb-ferdig')}</li>
<li><strong>Fisk:</strong> helkokt laks, kokt ørret eller kabaret.</li>
<li><strong>Salater:</strong> potetsalat, waldorfsalat og grønn salat.</li>
<li><strong>Sauser:</strong> rømme, remulade, cumberlandsaus og pepperrotkrem.</li>
<li><strong>Ost og kjeks:</strong> ${t('kb-ost')} og ${t('kb-kjeks')}, ifølge klassikeren hos ${mp('mp-koldtbord')}.</li>
<li><strong>Pynt:</strong> druer, selleri og reddiker.</li>
<li><strong>Brød, smør og egg:</strong> brød og smør, og egg til eggerøre.</li>
<li><strong>Drikke og dessert:</strong> det du selv skal ha til bordet.</li></ul>`;

const avsnitt = () => [
  ['Tidslinje fra tre uker før',
    p(`Julebord hjemme er ofte et koldtbord eller en buffet. Tidslinjen under teller bakover fra selskapsdagen, så du setter datoene selv. Alle tider og mengder på siden er <strong>veiledende</strong>: de kommer fra kildene nederst, og antall gjester, hva du serverer og kjøleskapet ditt kan endre dem.`)
    + tidslinje],
  ['Mengder ut fra antall gjester', mengder],
  ['Handleliste for julebordet',
    p(`Handle i to runder: først det som holder seg, så det ferske. Lista følger koldtbordet hos ${mp('mp-koldtbord')}. Den har ingen mengder, for dem finner du i tabellene over. I Matlyst legger du oppskriftene dine på handlelista, så får du alt samlet og sortert etter hylle.`)
    + liste],
  ['Kjøling, varmholding og rester',
    p(`Reglene under gjelder alt du setter fram. Mattilsynet er den norske myndigheten for mattrygghet, og vi viser dens regler først.`)
    + ul(
      `<strong>Kjøleskapet:</strong> under ${t('mt-kjole-ned')}, men over ${t('mt-kjole-opp')}, ifølge ${mt('mt-oppbevaring')}.`,
      `<strong>Bakterier:</strong> ${mt('mt-kjokken')} sier at de trives og formerer seg raskt ved temperaturer fra ${t('mt-bakterier')}.`,
      `<strong>Varmt:</strong> hold maten rykende varm, ${t('mt-over-60')}, etter oppvarming til ${t('mt-over-70')}, ifølge ${mt('mt-rykende')}.`,
      `<strong>Avkjøling:</strong> fra ${t('mt-avkjol-fra')} til ${t('mt-avkjol-til')} så raskt som mulig, og senest i løpet av to timer, ifølge ${mt('mt-oppbevaring')}.`,
      `<strong>Tining:</strong> ${mt('mt-oppbevaring')} sier at tining i kjøleskap går saktere, men er tryggere.${tekst('mt-tine')}`,
      `<strong>Rester:</strong> ${t('mt-rester')} i kjøleskap. Skal du ikke spise dem snart, frys dem med en gang. Kvaliteten i fryseren går ned etter ${t('mt-fryser-kv')}, avhengig av produktet.`)],
  ['Slik bruker du Matlyst til julebordet',
    p('Matlyst gir deg ingen oppskrifter og ingen tider. Du lagrer oppskriftene du selv bruker, og Matlyst hjelper deg å holde orden.')
    + ul(
      'Lagre oppskriftene til retter du lager selv, fra nettsiden, Instagram eller TikTok, eller ta bilde av oppskriften i kokeboka (bildeimport er en Matlyst Pro-funksjon). Sjekk alltid utkastet mot originalen før du lagrer.',
      'Regn om oppskriften fra 1 til 20 porsjoner til antall gjester. Omregningen er lineær, så sjekk krydder og salt selv.',
      'Legg oppskriftene i <a href="/ukemeny/">ukemenyen</a>, de dagene du skal lage dem.',
      'Legg ukemenyen på <a href="/handleliste/">handlelista</a>, så får du like varer samlet og sortert etter hylle. Varer du har i spiskammeret, er fravalgt og merket «Har hjemme».',
      'Legg inn det som blir til overs i <a href="/spiskammer-app/">spiskammeret</a>, med utløpsdato, så ser du hva som bør brukes først.')
    + p('Matlyst varsler ikke om når du skal lage hva. Skriv tidene i notatene på oppskriften, eller bruk tidslinjen over.')],
  ['Kilder og tall',
    KILDEINTRO + s.kilderListe()
    + p('Fant du en feil, eller har en kilde endret seg? Skriv til <a href="mailto:hei@matlyst-app.no">hei@matlyst-app.no</a>, så rettes siden og datoen oppdateres. Les mer om hvordan vi jobber på <a href="/om/">om-siden</a>.')],
];

export const FAQ = [
  ['Hvor mye mat per person trenger jeg til julebord hjemme?', `${mp('mp-koldtbord')} regner ${t('kb-total')} mat per person på et koldtbord, med tilbehør. Omtrent halvparten bør være fisk eller kjøtt.`],
  ['Hvor mye spekemat per person på julebordet?', `${mp('mp-koldtbord')} sier ${t('kb-spekemat-stort')} per person når spekemat er en del av et større koldtbord.`],
  ['Hvor lenge før kan jeg lage koldtbordet?', `${mp('mp-koldtbord')} sier at roastbiff, skinkestek, helkokt laks eller ørret, kabaret, potetsalat, waldorfsalat, cumberlandsaus og remulade kan lages ${t('kb-forveien')} før. Eggerøre, grønn salat og pepperrotkrem bør lages samme dag.`],
  ['Hvor lenge kan spekematen stå fremme?', `${mp('mp-spekemat')} sier ${t('sp-fremme')}, så lenge det ikke er veldig varmt eller står i direkte sollys.`],
  ['Hvor lenge holder rester etter julebordet?', `${mt('mt-oppbevaring')} sier at restemat holder seg ${t('mt-rester')} i kjøleskap. Skal du ikke spise den snart, frys den med en gang.`],
  ['Hvilken temperatur skal kjøleskapet ha?', `${mt('mt-oppbevaring')} sier under ${t('mt-kjole-ned')}, men over ${t('mt-kjole-opp')}. Legg et termometer inne i kjøleskapet og sjekk det.`],
  ['Gir Matlyst oppskrifter eller tider til julebordet?', 'Nei. Du lagrer oppskriftene du selv bruker, regner dem om til antall gjester og sender ingrediensene til én handleliste.'],
];

const TITTEL = 'Julebord hjemme: plan, mengder og handleliste';
const BESKRIVELSE = 'Plan for julebord hjemme fra tre uker før: tidslinje, mengder per gjest til koldtbord og buffet, handleliste og kjøling. Tall med kilde og dato.';
const H1 = 'Julebord hjemme planlagt fra tre uker før';

const svarTekst = `Regn ${t('kb-total')} mat per person på et koldtbord, og omtrent halvparten av det som kjøtt og fisk. Lag det meste ${t('kb-forveien')} før, eggerøre og grønn salat samme dag, og hold maten under ${t('mt-kjole-ned')} i kjøleskapet. Alle mengder og tider er veiledende, og hvert tall har kilde nederst på siden.`;
const seksjoner = avsnitt();
const rik = byggRik({ lang: 'nb', svarTekst, seksjoner }).html;

export const side = {
  title: TITTEL,
  description: BESKRIVELSE,
  eyebrow: 'Julebord hjemme',
  h1: H1,
  lead: 'Tidslinje, mengder ut fra antall gjester, handleliste og regler for kjøling og rester. Hvert tall har en kilde med adresse og hentedato, og mengdene er veiledende.',
  publisert: HENTET,
  schemas: skjemaFor({ sti: STI, tittel: TITTEL, h1: H1, beskrivelse: BESKRIVELSE, kilder: s.brukt().kilder }),
  forst: '',
  stegTittel: 'Slik bruker du siden',
  steg: [
    ['Velg dato og antall gjester', 'Koldtbord, buffet eller begge deler.'],
    ['Følg tidslinjen', 'Lag det som kan lages i forveien, og hold kaldt kaldt.'],
    ['Handle fra to lister', 'Først det som holder seg, så det ferske.'],
  ],
  alternativ: '',
  grense: '',
  seksjoner: [],
  faqTittel: 'Spørsmål om julebord hjemme',
  rik,
  faq: FAQ,
  cta: 'Lagre julebordets oppskrifter i Matlyst',
};
export const BRUKT = () => s.brukt();
export { DATA };

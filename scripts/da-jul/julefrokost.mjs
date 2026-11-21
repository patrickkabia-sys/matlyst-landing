// Julefrokost derhjemme (da): plan fra tre uger før, mængder pr. gæst, indkøbsliste og køling.
// Samme generator som /julebord/ (nb), men med danske kilder. Hvert tal kommer fra hoytider.data.da.json (se felles-da.mjs).
import { byggRik } from '../rik-sider.mjs';
import { DATA_DA, HENTET, KILDEINTRO, dl, kg, lagDaSide, p, skjemaDa, tabell, ul } from './felles-da.mjs';

export const STI = 'da/julefrokost/';
const s = lagDaSide();
const { t, rad, tekst, fvst, tk, mv } = s;

// Antal gæster i tabellerne. Regnestykket står her og gentages uafhængigt i testen.
export const GAESTER = [6, 10, 15, 20, 30];
export const koedRad = (n) => {
  const [lav, hoej] = rad('g-buffet').g;
  return [String(n), kg(n * rad('g-kod').g), `${kg(n * lav)} til ${kg(n * hoej)}`];
};
export const tilbehoerRad = (n) => {
  const [dLav, dHoej] = rad('g-dessert').g;
  return [String(n), kg(n * rad('g-kartofler').g), kg(n * rad('g-salat').g), dl(n * rad('g-sovs').dl), `${kg(n * dLav)} til ${kg(n * dHoej)}`];
};

const tidsrader = [
  ['Tre uger før', ul(
    `Fastlæg dato og antal gæster. ${tk('taenk-jul')} skriver, at du kan begrænse udvalget af retter, og at der skal være mindre af hver ret, jo flere retter du serverer.${tekst('taenk-begraens')}${tekst('taenk-faerre')}`,
    `Lav en indkøbsliste. ${tk('taenk-jul')} anbefaler at tjekke køkkenskabe, køleskab og fryser først, så du ikke køber noget, du allerede har.${tekst('taenk-liste')}${tekst('taenk-tjek')}`,
    'Bestil det, du ikke laver selv, og køb det, der kan ligge: drikkevarer, tørvarer og brød.')],
  ['En uge før', ul(
    `Læg et termometer i køleskabet. ${fvst('fvst-koel')} skriver, at køleskabet skal holde højst ${t('fvst-kjol')}, og at du skal tjekke temperaturen jævnligt.${tekst('fvst-tjek')}`,
    `Ryd plads. ${fvst('fvst-koel')} skriver, at du ikke skal overfylde køleskabet, så den kolde luft kan cirkulere.${tekst('fvst-overfyld')} En buffet fylder meget.`)],
  ['Dagen før', ul(
    `Skal du gemme varm mad til næste dag, skal den ifølge ${fvst('fvst-koel')} kun lige dampe af, før den kommer i køleskabet.${tekst('fvst-dampe')} Del store portioner af sovs og kødretter op i mindre portioner, så de køler hurtigere.${tekst('fvst-portioner')}`,
    `Bakterier stortrives ved ${t('fvst-vaekst')}, skriver ${fvst('fvst-koel')}.`,
    `Find små tallerkener og små fade frem. ${tk('taenk-jul')} skriver, at gæsterne så tager mindre, og at der bliver mindre madspild.${tekst('taenk-fade')}`)],
  ['Selskabsdagen', ul(
    `Sæt mindre portioner frem ad gangen og fyld op efter behov, ifølge ${mv('mv-gaester')}.${tekst('g-lidt')}`,
    `Frikadeller, medisterpølse og andre farsprodukter skal gennemvarmes, skriver ${fvst('fvst-varm')}.${tekst('fvst-hakket')} Varm mad skal være rygende og gennemvarm.${tekst('fvst-rygende')}`)],
  ['Dagen efter', ul(
    `${fvst('fvst-koel')} skriver, at rester fra aftensmaden skal i køleskab ved højst ${t('fvst-kjol')}.`,
    `${tk('taenk-jul')} skriver, at du skal have alle rester på køl hurtigst muligt.${tekst('taenk-rester')} Er de stadig friske, kan du fryse dem, bruge dem i dagene efter eller give dem med hjem til gæsterne.${tekst('taenk-rester-brug')}`,
    'Læs også <a href="/da/holdbarhed/rester/">hvor længe rester holder sig</a> og <a href="/da/kan-man-fryse/">hvad du kan fryse</a>.')],
];
const tidslinje = tidsrader.map(([naar, hvad]) => `<h3>${naar}</h3>${hvad}`).join('');

const maengder = p(`En julefrokost er en buffet med mange små retter. ${mv('mv-julemad')} nævner sild, sylte, leverpostej, frikadeller og forskellige slags pålæg som almindelige.${tekst('jul-frokost')} Vi har ikke fundet en dansk kilde med mængder til en julefrokost, så tallene her er Madens Verdens tal for buffet og gæster. Brug dem som udgangspunkt.`)
  + p(`${mv('mv-gaester')} regner ${t('g-kod')} kød uden ben pr. voksen. Til en buffet fordeler du de samme ${t('g-kod')} mellem retterne. Med tre slags kød bliver det ${t('g-buffet')} af hver slags.${tekst('g-buffet200')} Du skal ikke lave en fuld portion af hver ret til hver gæst.${tekst('g-fuld')}`)
  + '<h3>Kød</h3>'
  + tabell(['Gæster', `Kød i alt (${t('g-kod')} pr. voksen)`, `Hver af tre slags kød (${t('g-buffet')})`], GAESTER.map(koedRad))
  + '<h3>Kartofler, salat, sovs og dessert</h3>'
  + tabell(['Gæster', `Kartofler (${t('g-kartofler')}, før skrælning)`, `Salat og grøntsager (${t('g-salat')})`, `Sovs (${t('g-sovs')})`, `Dessert (${t('g-dessert')})`], GAESTER.map(tilbehoerRad))
  + p(`Tabellerne er regnet ud fra tallene pr. voksen. ${mv('mv-gaester')} skriver, at mængderne er vejledende og skal tilpasses menuen.${tekst('g-vejl')}`)
  + '<h3>Når du justerer</h3>'
  + ul(
    `Børn i alderen ${t('g-barn')} regnes som en halv voksenportion, ifølge ${mv('mv-gaester')}.`,
    `Nogle retter er mere populære end andre, skriver ${mv('mv-gaester')}.${tekst('g-populaer')}`,
    `Serverer du flere slags tilbehør, skal du ikke regne fuld portion af hver, ifølge ${mv('mv-gaester')}.${tekst('g-flere')}`,
    `Er der mange retter, skal der være mindre af hver, skriver ${tk('taenk-jul')}.${tekst('taenk-faerre')}`,
    'Vi har ikke fundet danske tal i gram pr. gæst for sild, leverpostej eller frikadeller. De står derfor uden tal.')
  + p('Se også <a href="/da/hvor-meget-pr-person/gaester/">hvor meget mad pr. person til gæster</a> og <a href="/da/juleaften/">planen for juleaften med and og flæskesteg</a>.');

const liste = `<ul>
<li><strong>Kød og pålæg:</strong> frikadeller, sylte, leverpostej og pålæg. ${mv('mv-julemad')} nævner dem som almindelige til julefrokost.${tekst('jul-frokost')}</li>
<li><strong>Fisk:</strong> sild.</li>
<li><strong>Brød og smør:</strong> rugbrød og smør.</li>
<li><strong>Tilbehør:</strong> kartofler, salat og grøntsager og sovs.</li>
<li><strong>Dessert:</strong> det, du selv vil servere.</li>
<li><strong>Drikkevarer og pynt:</strong> det, du selv vil have på bordet.</li></ul>`;

const avsnitt = () => [
  ['Tidslinje fra tre uger før',
    p('En julefrokost derhjemme er en buffet med kolde og varme retter. Tidslinjen tæller baglæns fra selskabsdagen, så du sætter datoerne selv. Alle tider og mængder på siden er <strong>vejledende</strong>: de kommer fra kilderne nederst, og antal gæster, menu og dit køleskab kan ændre dem.')
    + tidslinje],
  ['Mængder ud fra antal gæster', maengder],
  ['Indkøbsliste til julefrokosten',
    p(`Handl i to omgange: først det, der kan ligge, så det friske. ${tk('taenk-jul')} anbefaler en indkøbsliste.${tekst('taenk-liste')} Listen har ingen mængder, for dem finder du i tabellerne ovenfor. I Matlyst lægger du dine opskrifter på indkøbslisten, så får du alt samlet og sorteret efter afdeling.`)
    + liste],
  ['Køling, varmholdning og rester',
    p('Reglerne her gælder alt, du sætter frem. Fødevarestyrelsen er den danske myndighed for fødevaresikkerhed, og vi viser dens regler først.')
    + ul(
      `<strong>Køleskabet:</strong> højst ${t('fvst-kjol')} til kød, pålæg, mejeriprodukter, ost og rester, ifølge ${fvst('fvst-koel')}.`,
      `<strong>Bakterier:</strong> de stortrives ved ${t('fvst-vaekst')}, skriver ${fvst('fvst-koel')}.`,
      `<strong>Varmt:</strong> varm maden helt igennem, så den er rygende og gennemvarm, ifølge ${fvst('fvst-varm')}.${tekst('fvst-rygende')} Hakket kød, som frikadeller og medisterpølse, skal gennemvarmes.${tekst('fvst-hakket')}`,
      `<strong>Afkøling:</strong> varm mad, du vil gemme, skal kun lige dampe af, før den kommer i køleskabet, og store portioner deles op, ifølge ${fvst('fvst-koel')}.${tekst('fvst-dampe')}${tekst('fvst-portioner')}`,
      `<strong>Optøning:</strong> ${fvst('fvst-opto')} skriver, at frosne madvarer bør tøs op i køleskabet.${tekst('fvst-opto')}${tekst('fvst-opto-bakt')}`,
      `<strong>Rester af kød:</strong> ${tk('taenk-hold')} skriver, at tilberedt kød kan holde sig ${t('taenk-rester')} i køleskab, hvis det er varmet grundigt igennem og kølet hurtigt ned. Det skal ligge i en pose eller en anden lufttæt emballage.${tekst('taenk-lufttaet')}`)],
  ['Sådan bruger du Matlyst til julefrokosten',
    p('Matlyst giver dig ingen opskrifter og ingen tider. Du gemmer de opskrifter, du selv bruger, og Matlyst hjælper dig med at holde orden.')
    + ul(
      'Gem opskrifterne til de retter, du laver selv, fra en hjemmeside, Instagram eller TikTok, eller tag et billede af opskriften i kogebogen (fotoimport er en Matlyst Pro-funktion). Tjek altid udkastet mod originalen, før du gemmer.',
      'Skalér opskriften fra 1 til 20 portioner til antal gæster. Skaleringen er lineær, så tjek krydderier og salt selv.',
      'Læg opskrifterne i <a href="/da/madplan-app/">madplanen</a> på de dage, du skal lave dem.',
      'Læg madplanen på <a href="/da/indkoebsliste-app/">indkøbslisten</a>, så bliver ens varer lagt sammen og sorteret efter afdeling. Varer, du har i spisekammeret, er fravalgt og mærket «På lager».',
      'Skriv det, der bliver til overs, i <a href="/da/spisekammer-app/">spisekammeret</a> med udløbsdato, så kan du se, hvad der bør bruges først.')
    + p('Matlyst minder dig ikke om, hvornår du skal lave hvad. Skriv tiderne i noterne på opskriften, eller brug tidslinjen ovenfor.')],
  ['Kilder og tal',
    KILDEINTRO + s.kilderListe()
    + p('Har du fundet en fejl, eller har en kilde ændret sig? Skriv til <a href="mailto:hei@matlyst-app.no">hei@matlyst-app.no</a>, så bliver siden rettet, og datoen opdateret.')],
];

export const FAQ = [
  ['Hvor meget mad pr. person skal jeg regne med til julefrokost derhjemme?', `${mv('mv-gaester')} regner ${t('g-kod')} kød uden ben pr. voksen, og ${t('g-kartofler')} kartofler, ${t('g-salat')} salat og grøntsager, ${t('g-sovs')} sovs og ${t('g-dessert')} dessert. Det er tal for buffet og gæster, ikke for julefrokost særskilt, og de er vejledende.`],
  ['Hvor meget kød pr. gæst til en buffet?', `${mv('mv-gaester')} regner ${t('g-kod')} pr. voksen i alt. Med tre slags kød bliver det ${t('g-buffet')} af hver.`],
  ['Hvor mange retter skal en julefrokost have?', `${tk('taenk-jul')} skriver, at du kan begrænse udvalget, og at der skal være mindre af hver ret, jo flere retter du har.`],
  ['Hvor længe kan resterne holde sig?', `${tk('taenk-hold')} skriver ${t('taenk-rester')} for tilberedt kød i køleskab, hvis det er varmet grundigt igennem og kølet hurtigt ned. ${fvst('fvst-koel')} skriver, at rester skal i køleskab ved højst ${t('fvst-kjol')}.`],
  ['Hvilken temperatur skal køleskabet have?', `${fvst('fvst-koel')} skriver højst ${t('fvst-kjol')}. Læg et termometer i køleskabet og tjek det jævnligt.`],
  ['Hvordan får jeg frikadeller og medisterpølse sikkert varmet?', `${fvst('fvst-varm')} skriver, at hakket kød som medisterpølse og frikadeller skal gennemvarmes, og at varm mad skal være rygende og gennemvarm.`],
  ['Giver Matlyst opskrifter eller tider til julefrokosten?', 'Nej. Du gemmer de opskrifter, du selv bruger, skalerer dem til antal gæster og sender ingredienserne til én indkøbsliste.'],
];

const TITTEL = 'Julefrokost derhjemme: plan, mængder, indkøbsliste';
const BESKRIVELSE = 'Julefrokost derhjemme fra tre uger før: tidslinje, mængder pr. gæst til buffet, indkøbsliste og køling. Alle tal har kilde og dato.';
const H1 = 'Julefrokost derhjemme: plan, mængder og indkøbsliste';

const svarTekst = `Regn ${t('g-kod')} kød uden ben pr. voksen til en buffet, fordelt på retterne, så det med tre slags kød bliver ${t('g-buffet')} af hver. Hold maden i køleskab ved højst ${t('fvst-kjol')}, og gem resterne hurtigt på køl. Alle mængder og tider er vejledende, og hvert tal har en kilde nederst på siden.`;
const seksjoner = avsnitt();
const rik = byggRik({ lang: 'da', svarTekst, seksjoner }).html;

export const side = {
  title: TITTEL,
  description: BESKRIVELSE,
  eyebrow: 'Julefrokost derhjemme',
  h1: H1,
  lead: 'Tidslinje, mængder ud fra antal gæster, indkøbsliste og regler for køling og rester. Hvert tal har en kilde med adresse og læsedato, og mængderne er vejledende.',
  publisert: HENTET,
  schemas: [...skjemaDa({ sti: STI, tittel: TITTEL, h1: H1, beskrivelse: BESKRIVELSE, kilder: s.brukt().kilder }), 'faq'],
  forst: '',
  stegTittel: 'Sådan bruger du siden',
  steg: [
    ['Vælg dato og antal gæster', 'Buffet med kolde og varme retter.'],
    ['Følg tidslinjen', 'Lav det, der kan laves i forvejen, og hold koldt koldt.'],
    ['Handl fra to lister', 'Først det, der kan ligge, så det friske.'],
  ],
  alternativ: '',
  grense: '',
  seksjoner: [],
  faqTittel: 'Spørgsmål om julefrokost derhjemme',
  rik,
  faq: FAQ,
  cta: 'Gem julefrokostens opskrifter i Matlyst',
};
export const BRUKT = () => s.brukt();
export { DATA_DA };

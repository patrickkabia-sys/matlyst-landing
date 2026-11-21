// Juleaften (da): tidsplan fra tre uger før med and og flæskesteg, mængder pr. gæst og hvornår stegen skal i ovnen.
// Samme generator som /julemiddag/ (nb), men med danske kilder. Hvert tal kommer fra hoytider.data.da.json (se felles-da.mjs).
import { byggRik } from '../rik-sider.mjs';
import { DATA_DA, HENTET, KILDEINTRO, dl, kg, kl, lagDaSide, p, skjemaDa, tabell, ul } from './felles-da.mjs';

export const STI = 'da/juleaften/';
const s = lagDaSide();
const { t, rad, tall, tekst, fvst, tk, mv, arla, dc } = s;

// Gæster i tabellerne og tidspunktet for maden. Regnestykket står her og gentages uafhængigt i testen.
export const GAESTER = [4, 6, 8, 10, 12];
export const MIDDAG_MIN = 18 * 60;
export const ANDEVAEGTE = [['2', 'and-2kg', 'opto-2'], ['2,5', 'and-25kg', 'opto-2'], ['3', 'and-3kg', 'opto-3'], ['3,5', 'and-35kg', 'opto-3'], ['4', 'and-4kg', 'opto-4']];
export const HVILE_AND_MIN = tall('tab-and-hvile').min;
export const AND_3KG_START = MIDDAG_MIN - HVILE_AND_MIN - tall('and-3kg').min;
export const FLAESK_START = MIDDAG_MIN - tall('fl-hvile').min - tall('fl-tid').min;
export const FLAESK_SKY = FLAESK_START + tall('fl-sky').min;

export const andRad = ([vaegt, tid, opto]) => {
  const x = rad(tid);
  rad(opto);
  return [`${vaegt} kg`, tall(opto).vis, x.vis, tall('tab-and-hvile').vis, kl(MIDDAG_MIN - HVILE_AND_MIN - x.min)];
};
export const flaeskRad = (n) => {
  const [aL, aH] = rad('fl-arla').g;
  const [mL, mH] = rad('fl-mv-min').g;
  return [String(n), kg(n * rad('fl-dc').g), `${kg(n * aL)} til ${kg(n * aH)}`, `${kg(n * mL)} til ${kg(n * mH)}`];
};
export const tilbehoerRad = (n) => {
  const [bL, bH] = rad('br-alene').g;
  const [hL, hH] = rad('br-hvide').g;
  const [dL, dH] = rad('g-dessert').g;
  return [String(n), `${kg(n * bL)} til ${kg(n * bH)}`, `${kg(n * hL)} til ${kg(n * hH)}`, dl(n * rad('g-sovs').dl), `${kg(n * dL)} til ${kg(n * dH)}`];
};

const tidsrader = [
  ['Tre uger før, torsdag 3. december', ul(
    `Vælg menuen: and, flæskesteg eller begge dele. ${tk('taenk-jul')} skriver, at mange serverer begge dele juleaften, men at du kan overveje, om I behøver begge.${tekst('taenk-begge')} Vælger du begge, skal du regne med kød til overs.${tekst('taenk-tilovers')}`,
    `Lav en indkøbsliste, og tjek først, hvad du har i køkkenskabe, køleskab og fryser, ifølge ${tk('taenk-jul')}.${tekst('taenk-liste')}${tekst('taenk-tjek')}`,
    'Bestil kødet, og køb det, der kan ligge: tørvarer, drikkevarer og dessertens tørre ingredienser.')],
  ['En uge før, torsdag 17. december', ul(
    `Læg et termometer i køleskabet. ${fvst('fvst-koel')} skriver, at køleskabet skal holde højst ${t('fvst-kjol')}, og at du skal tjekke temperaturen jævnligt.${tekst('fvst-tjek')}`,
    `Ryd plads, for ${fvst('fvst-koel')} skriver, at køleskabet ikke skal overfyldes.${tekst('fvst-overfyld')}`)],
  ['Tre dage før, mandag 21. december', ul(
    `Er anden frossen, så tø den op i køleskabet. ${fvst('fvst-opto')} skriver, at frosne madvarer bør tøs op der.${tekst('fvst-opto')} ${mv('mv-opto-and')} regner med ${t('opto-3')} for en and på tre til tre og en halv kilo. Det højeste tal er tre døgn, så den skal i køleskabet senest her.`,
    `Tø ikke anden op på køkkenbordet, skriver ${mv('mv-opto-and')}.${tekst('opto-bord')} Læg den i et fad med høje kanter, så saften ikke løber ud i køleskabet.${tekst('opto-fad')}`)],
  ['Dagen før, onsdag 23. december', ul(
    `Kog og pil kartoflerne til de brunede kartofler. ${mv('mv-brunede')} skriver, at du først skal brune dem kort inden servering.${tekst('br-dagen')}`,
    `Anden kan laves dagen før, ifølge ${mv('mv-and')}.${tekst('and-dagen')} ${mv('mv-genop-and')} skriver, at den skal være helt færdigstegt, og at du skal sætte den hurtigt på køl, når den kun lige har dampet af.${tekst('genop-helt')}${tekst('genop-kol')}`,
    `Flæskesteg dagen før: kilderne er ikke enige. ${arla('arla-flaesk')} skriver, at du kan stege den næsten færdig dagen før.${tekst('fl-arla-dagen')} ${dc('dc-flaesk')} skriver, at du sagtens kan lave den dagen før og varme den op.${tekst('fl-dc-dagen')}`,
    `Varm mad, du gemmer, skal kun lige dampe af, før den kommer i køleskabet, og store portioner deles, ifølge ${fvst('fvst-koel')}.${tekst('fvst-dampe')}${tekst('fvst-portioner')}`)],
  [`Juleaften, torsdag 24. december`, p(`Planen er regnet baglæns fra spisetid ${kl(MIDDAG_MIN)}. Er det et andet tidspunkt hos dig, flytter du tiderne. Stegetiderne står i afsnittet nedenfor.`)
    + ul(
      `<strong>And på cirka tre kilo:</strong> i ovnen ${kl(AND_3KG_START)}. Vend anden efter en time, altså ${kl(AND_3KG_START + 60)}.${tekst('and-vend')}`,
      `<strong>Flæskesteg på ${t('fl-vaegt')}:</strong> i ovnen ${kl(FLAESK_START)}. Hæld skyen fra efter ${t('fl-sky')}, altså ${kl(FLAESK_SKY)}.`,
      `<strong>Brunede kartofler:</strong> brun dem kort inden servering, ifølge ${mv('mv-brunede')}.`)],
  ['Dagen efter, fredag 25. december', ul(
    `${fvst('fvst-koel')} skriver, at rester skal i køleskab ved højst ${t('fvst-kjol')}. ${tk('taenk-hold')} skriver, at tilberedt kød kan holde sig ${t('taenk-rester')}, hvis det er varmet grundigt igennem og kølet hurtigt ned.`,
    `${tk('taenk-jul')} skriver, at du skal have alle rester på køl hurtigst muligt.${tekst('taenk-rester')} Er de stadig friske, kan du fryse dem, bruge dem i dagene efter eller give dem med hjem.${tekst('taenk-rester-brug')}`,
    'Se <a href="/da/holdbarhed/rester/">hvor længe rester holder sig</a> og <a href="/da/kan-man-fryse/">hvad du kan fryse</a>.')],
];
const tidslinje = tidsrader.map(([naar, hvad]) => `<h3>${naar}</h3>${hvad}`).join('');

const maengder = p(`Juleaften serverer mange både and og flæskesteg. ${tk('taenk-jul')} skriver, at du kan overveje, om I behøver begge dele.${tekst('taenk-begge')} Tabellerne nedenfor regner hver for sig.`)
  + '<h3>Flæskesteg pr. gæst</h3>'
  + p(`Kilderne er ikke helt enige, så de står side om side, og det højeste tal står først. ${dc('dc-flaesk')} regner ${t('fl-dc')} rå flæskesteg pr. voksen til juleaften eller gæstemiddag. ${arla('arla-flaesk')} regner ${t('fl-arla')}, og ${t('fl-arla-tilbehor')}, når der er meget tilbehør, forret og dessert. ${mv('mv-flaesk')} regner ${t('fl-mv-min')} pr. voksen. En steg svinder ${t('fl-dc-svind')} under tilberedning, skriver ${dc('dc-flaesk')}, så det er bedre at købe en lidt større steg.`)
  + tabell(['Gæster', `Danish Crown, juleaften (${t('fl-dc')})`, `Arla (${t('fl-arla')})`, `Madens Verden (${t('fl-mv-min')})`], GAESTER.map(flaeskRad))
  + p(`${mv('mv-flaesk')} skriver, at en steg på ${t('fl-vaegt')} passer godt til seks personer og giver kød til næste dag.${tekst('fl-seks')} Det er det samme som regnestykket i tabellen.`)
  + '<h3>And</h3>'
  + p(`${mv('mv-and')} bruger en and på cirka tre kilo til ${t('and-4pers')}. Det er hele fuglen med ben og skind. Skal du lave en hel steg med ben, skal du købe mere, fordi knoglerne ikke bliver spist.${tekst('g-med-ben')} Vi har ikke fundet en dansk kilde med gram and pr. gæst, så der står ingen tabel for det.`)
  + '<h3>Kartofler, sovs og dessert</h3>'
  + p(`${mv('mv-brunede')} regner ${t('br-alene')} brunede kartofler pr. person. Serveres der også hvide kartofler og meget andet tilbehør, er det ${t('br-hvide')}. ${mv('mv-gaester')} regner ${t('g-kartofler')} almindelige kartofler, før skrælning, ${t('g-sovs')} sovs og ${t('g-dessert')} dessert pr. voksen. Regn ikke fuld portion af alle slags kartofler, skriver ${mv('mv-gaester')}.${tekst('g-flere')}`)
  + tabell(['Gæster', `Brunede kartofler (${t('br-alene')})`, `Brunede, når der også er hvide (${t('br-hvide')})`, `Sovs (${t('g-sovs')})`, `Dessert (${t('g-dessert')})`], GAESTER.map(tilbehoerRad))
  + p(`Børn i alderen ${t('g-barn')} regnes som en halv voksenportion, ifølge ${mv('mv-gaester')}. Mængderne er vejledende.${tekst('g-vejl')}`)
  + p('Se også <a href="/da/hvor-meget-pr-person/flaeskesteg/">hvor meget flæskesteg pr. person</a> og <a href="/da/hvor-meget-pr-person/kartofler/">hvor mange kartofler pr. person</a>.');

const stegetider = '<h3>And</h3>'
  + p(`Der er to tal for and, og de står side om side her. ${mv('mv-and')} skriver ${t('and-tid')} ved ${t('and-temp')}, og tabellen hos ${mv('mv-kerne')} skriver ${t('tab-and-tid')} ved ${t('tab-and-ovn')}. Det højeste tal er en time pr. kilo, så tabellen nedenfor bruger det. Hviletiden er ${t('tab-and-hvile')} i tabellen, og planen bruger den højeste.`)
  + tabell(['Andens vægt', 'Optøning i køleskab', 'Stegetid', 'Hvile', `I ovnen senest, hvis I spiser ${kl(MIDDAG_MIN)}`], ANDEVAEGTE.map(andRad))
  + p(`Anden skal have brystet nedad i den første time og vendes derefter.${tekst('and-vend')} Kernetemperaturen er ${t('and-kerne')}, målt i den tykkeste del af brystet og inderst i låret uden at ramme knoglen.${tekst('and-sted')} Det er kernetemperaturen, ikke tiden, der afgør, hvornår anden er færdig.${tekst('and-term')} Skyl ikke anden under vandhanen.${tekst('and-skyl')}`)
  + p(`Skal anden varmes dagen efter, giver ${mv('mv-genop-and')} ${t('genop-tid')} i ovnen ved ${t('genop-temp')}, til de tykkeste stykker er ${t('genop-kerne')}. Gem noget af andefedtet til genopvarmningen.${tekst('genop-fedt')}`)
  + '<h3>Flæskesteg</h3>'
  + p(`${mv('mv-flaesk')} steger en svinekam på ${t('fl-vaegt')} i ${t('fl-tid')} ved ${t('fl-temp')}. Efter ${t('fl-sky')} hældes skyen fra til sovs, og stegen er færdig ved en kernetemperatur på ${t('fl-kerne')}. Den hviler ${t('fl-hvile')} utildækket, så sværen holder sig sprød.${tekst('fl-utildaekt')} Sværen skal ligge vandret.${tekst('fl-vandret')}`)
  + tabell(['Steg', 'Ovn', 'Stegetid', 'Hvile', `I ovnen senest, hvis I spiser ${kl(MIDDAG_MIN)}`], [[`Svinekam på ${t('fl-vaegt')}`, t('fl-temp'), t('fl-tid'), t('fl-hvile'), kl(FLAESK_START)]])
  + p(`Tabellen hos ${mv('mv-kerne')} har andre tal: ${t('tab-fl-tid')} ved ${t('tab-fl-ovn')}, kernetemperatur ${t('tab-fl-kerne')} og hvile ${t('tab-fl-hvile')}. ${mv('mv-flaesk')} skriver selv, at en større steg ikke nødvendigvis skal have længere tid i direkte forhold til vægten.${tekst('fl-vaegt-tid')} Brug derfor et stegetermometer og mål i den tykkeste del af kødet.${tekst('tab-termo')} Stegetiden er kun vejledende.${tekst('tab-vejl')}`)
  + p('Steger du både and og flæskesteg, har de forskellige ovntemperaturer i kilderne, og kilderne beskriver dem hver for sig. Planlæg ovnen selv efter det.')
  + p('Læs også <a href="/da/stegetid/and/">stegetid for and</a>, <a href="/da/stegetid/flaeskesteg/">stegetid for flæskesteg</a>, <a href="/da/kernetemperatur/and/">kernetemperatur for and</a> og <a href="/da/kernetemperatur/flaeskesteg/">kernetemperatur for flæskesteg</a>.');

const liste = `<ul>
<li><strong>Kød:</strong> and og svinekam til flæskesteg. Den hele and kan være frossen, og den skal så tø op i køleskabet.</li>
<li><strong>Tilbehør:</strong> kartofler til kogning og til brunede kartofler, rødkål og det, du bruger til sovsen.</li>
<li><strong>Til brunede kartofler:</strong> sukker og smør.</li>
<li><strong>Til anden:</strong> svesker og æbler til fyld, ifølge ${mv('mv-and')}.${tekst('and-fyld')}</li>
<li><strong>Dessert:</strong> det, du selv vil servere.</li>
<li><strong>Salt:</strong> til anden og til sværen.</li></ul>`;

const avsnitt = () => [
  ['Tidslinje fra tre uger før juleaften',
    p('Juleaften er torsdag 24. december i 2026. Tidslinjen tæller baglæns fra den dag. Alle tider og mængder på siden er <strong>vejledende</strong>: de kommer fra kilderne nederst, og stegens størrelse, din ovn og dit køleskab kan ændre dem.')
    + tidslinje],
  ['Mængder ud fra antal gæster', maengder],
  ['Stegetid, og hvornår stegen skal i ovnen', stegetider],
  ['Indkøbsliste til juleaften',
    p(`Handl i to omgange: først det, der kan ligge, så det friske. Listen har ingen mængder, for dem finder du i tabellerne ovenfor. I Matlyst lægger du opskrifterne på indkøbslisten, så får du alt samlet og sorteret efter afdeling.`)
    + liste],
  ['Kernetemperatur, køling og rester',
    p('Fødevarestyrelsen er den danske myndighed for fødevaresikkerhed, og vi viser dens regler først.')
    + ul(
      `<strong>Fjerkræ:</strong> ${fvst('fvst-varm')} skriver, at fisk og fjerkræ bør være helt gennemstegt.${tekst('fvst-fjerkrae')} ${mv('mv-and')} går efter ${t('and-kerne')} i anden.`,
      `<strong>Køleskabet:</strong> højst ${t('fvst-kjol')} til kød, pålæg, mejeriprodukter, ost og rester, ifølge ${fvst('fvst-koel')}.`,
      `<strong>Bakterier:</strong> de stortrives ved ${t('fvst-vaekst')}, skriver ${fvst('fvst-koel')}.`,
      `<strong>Afkøling:</strong> varm mad, du vil gemme, skal kun lige dampe af, før den kommer i køleskabet, og store portioner deles op, ifølge ${fvst('fvst-koel')}.${tekst('fvst-dampe')}${tekst('fvst-portioner')}`,
      `<strong>Optøning:</strong> frosne madvarer bør tøs op i køleskabet, ifølge ${fvst('fvst-opto')}.${tekst('fvst-opto')}${tekst('fvst-opto-bakt')}`,
      `<strong>Rester af kød:</strong> ${t('taenk-rester')} i køleskab, hvis det er varmet grundigt igennem og kølet hurtigt ned, skriver ${tk('taenk-hold')}. Det skal ligge i en pose eller en anden lufttæt emballage.${tekst('taenk-lufttaet')}`)],
  ['Sådan bruger du Matlyst til juleaften',
    p('Matlyst giver dig ingen opskrifter og ingen tider. Du gemmer de opskrifter, du selv bruger, og Matlyst hjælper dig med at holde orden.')
    + ul(
      'Gem opskrifterne til anden, flæskestegen og tilbehøret fra en hjemmeside, Instagram eller TikTok, eller tag et billede af opskriften i kogebogen (fotoimport er en Matlyst Pro-funktion). Tjek altid udkastet mod originalen, før du gemmer.',
      'Skalér opskriften fra 1 til 20 portioner til antal gæster. Skaleringen er lineær, så tjek krydderier og salt selv.',
      'Læg opskrifterne i <a href="/da/madplan-app/">madplanen</a> på de dage, du skal lave dem.',
      'Læg madplanen på <a href="/da/indkoebsliste-app/">indkøbslisten</a>, så bliver ens varer lagt sammen og sorteret efter afdeling. Varer, du har i spisekammeret, er fravalgt og mærket «På lager».',
      'Skriv det, der bliver til overs, i <a href="/da/spisekammer-app/">spisekammeret</a> med udløbsdato, så kan du se, hvad der bør bruges først.')
    + p('Matlyst minder dig ikke om, hvornår du skal lave hvad. Skriv tiderne i noterne på opskriften, eller brug tidslinjen ovenfor.')
    + p('Planlægger du også julefrokost? Se <a href="/da/julefrokost/">julefrokost derhjemme</a>.')],
  ['Kilder og tal',
    KILDEINTRO + s.kilderListe()
    + p('Har du fundet en fejl, eller har en kilde ændret sig? Skriv til <a href="mailto:hei@matlyst-app.no">hei@matlyst-app.no</a>, så bliver siden rettet, og datoen opdateret.')],
];

export const FAQ = [
  ['Hvor længe skal en and på tre kilo have i ovnen?', `${mv('mv-and')} regner ${t('and-3kg')} ved ${t('and-temp')}. Kernetemperaturen på ${t('and-kerne')} afgør, hvornår anden er færdig, ikke tiden.`],
  ['Hvor længe skal en flæskesteg på halvanden kilo have?', `${mv('mv-flaesk')} steger den i ${t('fl-tid')} ved ${t('fl-temp')} og tager den ud ved ${t('fl-kerne')} i kernen. Lad den hvile ${t('fl-hvile')}.`],
  ['Hvor meget flæskesteg pr. person til juleaften?', `${dc('dc-flaesk')} regner ${t('fl-dc')} rå flæskesteg pr. voksen til juleaften. ${arla('arla-flaesk')} regner ${t('fl-arla')} og ${mv('mv-flaesk')} regner ${t('fl-mv-min')}.`],
  ['Hvornår skal anden ud af fryseren?', `${mv('mv-opto-and')} regner ${t('opto-3')} i køleskab for en and på tre til tre og en halv kilo. ${fvst('fvst-opto')} skriver, at frosne madvarer bør tøs op i køleskabet.`],
  ['Hvilken kernetemperatur skal anden have?', `${fvst('fvst-varm')} skriver, at fjerkræ bør være helt gennemstegt. ${mv('mv-and')} går efter ${t('and-kerne')}, målt i den tykkeste del af brystet og inderst i låret.`],
  ['Hvor mange brunede kartofler pr. person?', `${mv('mv-brunede')} regner ${t('br-alene')} pr. person, og ${t('br-hvide')}, hvis der også er hvide kartofler og meget andet tilbehør.`],
  ['Hvor længe holder resterne fra juleaften?', `${tk('taenk-hold')} skriver ${t('taenk-rester')} for tilberedt kød i køleskab, hvis det er varmet grundigt igennem og kølet hurtigt ned. ${fvst('fvst-koel')} skriver, at rester skal i køleskab ved højst ${t('fvst-kjol')}.`],
  ['Giver Matlyst opskrifter eller tider til juleaften?', 'Nej. Du gemmer de opskrifter, du selv bruger, skalerer dem til antal gæster og sender ingredienserne til én indkøbsliste.'],
];

const TITTEL = 'Juleaften: tidsplan for and og flæskesteg';
const BESKRIVELSE = 'Tidsplan for juleaften fra tre uger før: mængder pr. gæst til and og flæskesteg, stegetid og hvornår stegen skal i ovnen. Alle tal har kilde og dato.';
const H1 = 'Juleaften: tidsplan, mængder og stegetid for and og flæskesteg';

const svarTekst = `Regn ${t('fl-dc')} rå flæskesteg pr. voksen til juleaften, en and på cirka tre kilo til ${t('and-4pers')}, og tø anden op i køleskabet i ${t('opto-3')}. Anden skal have ${t('and-3kg')} ved ${t('and-temp')}, flæskestegen ${t('fl-tid')} ved ${t('fl-temp')}, og kernetemperaturen afgør, hvornår de er færdige. Alle mængder og tider er vejledende, og hvert tal har en kilde nederst på siden.`;
const seksjoner = avsnitt();
const rik = byggRik({ lang: 'da', svarTekst, seksjoner }).html;

export const side = {
  title: TITTEL,
  description: BESKRIVELSE,
  eyebrow: 'Juleaften',
  h1: H1,
  lead: 'Tidslinje fra tre uger før, mængder ud fra antal gæster, stegetid for and og flæskesteg og klokkeslæt for, hvornår stegen skal i ovnen. Hvert tal har en kilde med adresse og læsedato.',
  publisert: HENTET,
  schemas: [...skjemaDa({ sti: STI, tittel: TITTEL, h1: H1, beskrivelse: BESKRIVELSE, kilder: s.brukt().kilder }), 'faq'],
  forst: '',
  stegTittel: 'Sådan bruger du siden',
  steg: [
    ['Vælg menu og antal gæster', 'And, flæskesteg eller begge dele.'],
    ['Følg tidslinjen', 'Tø anden op i køleskabet, og forbered kartoflerne dagen før.'],
    ['Sæt stegen i ovnen til tiden', 'Regn baglæns fra spisetid, og mål kernetemperaturen.'],
  ],
  alternativ: '',
  grense: '',
  seksjoner: [],
  faqTittel: 'Spørgsmål om juleaften',
  rik,
  faq: FAQ,
  cta: 'Gem juleaftens opskrifter i Matlyst',
};
export const BRUKT = () => s.brukt();
export { DATA_DA };

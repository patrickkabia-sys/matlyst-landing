// Nyårsmiddag (sv): tidslinje från måndag 28 december, kalkon med steketid och innertemperatur, mängder per gäst och inköpslista.
// Utkast till Patricks godkännande, skrivet 2026-11-21. Varje siffra kommer från hoytider.data.json i den här mappen
// (se ../nb-jul/hoytid-felles.mjs, samma generator som /nyttarsmiddag/). Bara det de svenska källorna täcker står med.
import { byggRik } from '../rik-sider.mjs';
import { kg, lagMarked, p, tabell, ul } from '../nb-jul/hoytid-felles.mjs';

export const STI = 'sv/nyarsmiddag/';
const M = lagMarked('sv');
const { DATA, HENTET, KILDEINTRO, skjemaFor } = M;
const s = M.lagSide();
const { t, rad, henv, tekst } = s;
const sk = henv('Svenskt Kött', 'Svenskt Kött');
const sf = henv('Svensk Fågel', 'Svensk Fågel');
const arla = henv('Arla', 'Arla');
const lv = henv('Livsmedelsverket', 'Livsmedelsverket');

export const GAESTER = [4, 6, 8, 10, 12, 16];
export const VIKTER = [4, 5];
const r = { benfritt: rad('middag-benfritt'), ben: rad('middag-ben'), lax: rad('lax-forratt'), pot: rad('potatis') };
export const kottRad = (n) => [String(n), `${kg(n * r.benfritt.g[0])} till ${kg(n * r.benfritt.g[1])}`, kg(n * r.ben.g)];
export const tillbehorRad = (n) => [String(n), kg(n * r.lax.g), kg(n * r.pot.g)];

// Steketiden regnas som Svensk Fågels recept: 20 minuter först, sedan 30 minuter per kilo, och minst 30 minuter vila.
// Tiderna står i hoytider.data.json (kalkon-start, kalkon-kilo, kalkon-vila). Nyårsafton 2026 är en torsdag.
export const START_MIN = rad('kalkon-start').min;
export const PER_KILO_MIN = rad('kalkon-kilo').min;
export const VILA_MIN = rad('kalkon-vila').min;
export const MIDDAG_MIN = 18 * 60;
export const tid = (min) => { const h = Math.floor(min / 60); const m = min % 60; return `${h} ${h === 1 ? 'timme' : 'timmar'}${m ? ` ${m} minuter` : ''}`; };
export const kl = (min) => `kl. ${String(Math.floor(min / 60)).padStart(2, '0')}.${String(min % 60).padStart(2, '0')}`;
export const efterStart = (kilo) => kilo * PER_KILO_MIN;
export const totalt = (kilo) => START_MIN + efterStart(kilo);
export const inIUgn = (kilo) => MIDDAG_MIN - VILA_MIN - totalt(kilo);
export const stekRad = (kilo) => [`${kilo} kg`, tid(efterStart(kilo)), tid(totalt(kilo)), kl(inIUgn(kilo))];
rad('kalkon-tid');

const tidsrader = [
  ['Måndag 28 december, tre dagar före', ul(
    `Ta kalkonen ur frysen om den är fryst. ${lv('lv-frysa')} säger att du kan tina maten i kylskåp eller i ett kallt vattenbad, och att upptinad mat ska förvaras kallt om du inte ska tillaga den direkt.${tekst('lv-tina')}${tekst('lv-tina-kallt')} Källorna vi läste anger ingen tid för att tina en hel kalkon, så vi anger ingen heller.`,
    `${sf('sf-jul')} räknar i sitt recept med en tinad kalkon på ${t('kalkon-recept')}, som räcker till ${t('kalkon-portioner')}. Det är receptets eget exempel, inte en regel för alla kalkoner.`)],
  ['Tisdag 29 december', ul(
    `${arla('arla-planering')} föreslår att du planerar nyårsmiddagen och lägger champagnen på kylning den 29 december.${tekst('arla-nyar-29')}`,
    `Lägg en termometer i kylskåpet. ${lv('lv-kylvaror')} anger ${t('kylskap')} som lämplig kylskåpstemperatur. Gör plats för kalkonen.`,
    'Handla första listan: det som håller sig, som torrvaror och dryck.')],
  ['Onsdag 30 december, dagen före', ul(
    'Handla andra listan: det färska, som potatis och grönsaker.',
    `Förvara den upptinade kalkonen kallt tills du ska tillaga den.${tekst('lv-tina-kallt')} Dukning och dryck kan du ta hand om nu.`)],
  ['Nyårsafton, torsdag 31 december', ul(
    `Sätt in kalkonen nederst i ugnen i ${t('kalkon-start')}. Sänk sedan värmen till ${t('kalkon-temp')}, och räkna med ${t('kalkon-kilo')}, enligt ${sf('sf-jul')}. Receptet låter den steka vidare i ${t('kalkon-tid')} efter starten.`,
    `Ska maten stå på bordet kl. 18.00, och kalkonen väger fyra kilo, måste den alltså in i ugnen ${kl(inIUgn(4))}. Räknat så: middagstid minus vilotid minus steketid, där steketiden är starten plus tiden per kilo. Väger den fem kilo blir det ${kl(inIUgn(5))}.`,
    `Täck med aluminiumfolie om skinnet börjar få mycket färg.${tekst('sf-folie')} Ta ut kalkonen vid ${t('kalkon-ut')}, och låt den vila i minst ${t('kalkon-vila')} innan du skär den.`,
    `Inkråmet från kalkonen kan användas till sås eller buljong, enligt ${sf('sf-jul')}.${tekst('sf-inkrav')} Vill du värma köttet efter vilan, kan det värmas försiktigt under folie i ugnen vid ${t('kalkon-temp')} före serveringen.${tekst('sf-varma')}`,
    `${arla('arla-planering')} föreslår att du skålar in det nya året med krutonger med friterad grönkål och löjrom.${tekst('arla-nyar-31')}`,
    `När maten står framme: ${lv('lv-kylvaror')} säger att kylvaror inte ska stå framme längre än ${t('framme')}.`)],
  ['Nyårsdagen fredag 1 januari och dagarna efter', ul(
    `Låt resterna svalna och sätt in dem i kylskåpet så fort som möjligt, enligt ${lv('lv-kylvaror')}.${tekst('lv-rester-in')} Är det mer än ${t('halvliter')}, kan det svalna i ett kallt vattenbad.${tekst('lv-svalna')}`,
    `${lv('lv-matlada')} säger att tillagad mat håller sig ${t('rester')} i kylskåp, rätt förvarad vid ${t('kylskap')}. Frys in det du inte hinner äta.${tekst('lv-frys-in')}`,
    'Se också <a href="/sv/hallbarhet/matrester/">hållbarhet för matrester</a> och <a href="/sv/frysa/matrester/">frysa matrester</a>.')],
];
const tidslinje = tidsrader.map(([nar, vad]) => `<h3>${nar}</h3>${vad}`).join('');

const mangder = p(`${sk('sk-servera')} räknar vid en middagsbjudning ${t('middag-benfritt')} benfritt kött per person, och ${t('middag-ben')} per portion för kött med ben. Är det kött med en fettkappa, räknar du i det övre spannet, eftersom fettkappan oftast inte äts upp.${tekst('sk-fettkappa')}`)
  + tabell(['Gäster', `Benfritt kött (${r.benfritt.vis} per person)`, `Kött med ben (${r.ben.vis} per person)`], GAESTER.map(kottRad))
  + p(`Sidan hos Svenskt Kött nämner ingen kalkon, så tabellen gäller kött i allmänhet. Det enda vi har om kalkon är Svensk Fågels recept: ${t('kalkon-recept')} tinad kalkon till ${t('kalkon-portioner')}.`)
  + '<h3>Förrätt och potatis</h3>'
  + p(`Vill du börja med gravad lax, säger ${arla('arla-lax')} ${t('lax-forratt')} per person som förrätt. Till kalkonen räknar ${arla('arla-potatis')} med runt ${t('potatis')} potatis per person.`)
  + tabell(['Gäster', 'Gravad lax som förrätt', 'Kokt potatis'], GAESTER.map(tillbehorRad))
  + p('Läs mer: <a href="/sv/hur-mycket-per-person/lax/">hur mycket lax per person</a>, <a href="/sv/hur-mycket-per-person/potatis/">hur mycket potatis per person</a> och <a href="/sv/hur-mycket-per-person/kott/">hur mycket kött per person</a>.');

const steking = p(`${sf('sf-jul')} räknar med ${t('kalkon-start')} nederst i ugnen, sedan ${t('kalkon-temp')} varmluft och ${t('kalkon-kilo')}. Tabellen räknar ut tiden för en kalkon på fyra och fem kilo. Receptet gäller en kalkon på ${t('kalkon-recept')}, så fem kilo är ett exempel som följer samma regel, inte en uppgift från receptet.`)
  + tabell(['Vikt', 'Efter starten', 'Totalt med start', 'In i ugnen för middag kl. 18.00, med vila'], VIKTER.map(stekRad))
  + p('Se också <a href="/sv/tillagningstid/kalkon/">tillagningstid för kalkon</a>, där flera källor står sida vid sida.');

const kjerne = p(`Här är källorna inte helt överens, så vi visar alla. Livsmedelsverkets sidor som vi använder på den här sidan, om kyla, tining och rester, anger ingen innertemperatur för kalkon. Den här delen bygger därför på Svensk Fågel och Arla.`)
  + ul(
    `${sf('sf-jul')} säger att kalkonen är klar när saften från lårköttet är genomskinlig och innertemperaturen har nått ${t('kalkon-klar')}.${tekst('sf-saft')} Ta gärna ut den vid ${t('kalkon-ut')}, eftersom köttet fortsätter att tillagas under vilan.`,
    `${sf('sf-hellberg')} skriver i Christian Hellbergs recept att temperaturen ska vara ${t('kalkon-hellberg')} inne vid lårbenet.`,
    `${arla('arla-kalkon')} skriver ${t('kalkon-arla')} intill lårbenet.`)
  + p('Siffrorna är inte lika, och vi avgör inte vilken som gäller för din kalkon. Läs källorna längst ned på sidan. Se också <a href="/sv/innertemperatur/kalkon/">innertemperatur för kalkon</a>.');

const lista = `<ul>
<li><strong>Kött:</strong> hel kalkon, eller kött du själv väljer. Mängderna står i tabellen ovan.</li>
<li><strong>Fisk:</strong> gravad lax, om du vill ha en förrätt.</li>
<li><strong>Potatis och grönt:</strong> potatis och grönsaker du själv väljer som tillbehör.</li>
<li><strong>Mejeri:</strong> grädde eller mjölk till såsen, om du gör en.</li>
<li><strong>Torrvaror och kryddor:</strong> salt, peppar och det såsen behöver.</li>
<li><strong>Dryck och dessert:</strong> det du själv ska ha till bordet. ${arla('arla-planering')} föreslår att champagnen läggs på kylning den 29 december.</li></ul>`;

const avsnitt = () => [
  ['Tidslinje från tre dagar före nyårsafton',
    p('Nyårsafton 2026 är en torsdag. Tidslinjen räknar bakåt från den dagen. Alla tider och mängder på sidan är <strong>riktvärden</strong>: de kommer från källorna längst ned, och kalkonens vikt, din ugn och ditt kylskåp kan ändra dem. Använd receptet och förpackningen som facit.')
    + tidslinje],
  ['Mängder per gäst', mangder],
  ['Steketid för kalkon', steking],
  ['Innertemperatur: vad källorna säger', kjerne],
  ['Inköpslista till nyårsmiddagen',
    p('Handla i två omgångar: först det som håller sig, sedan det färska. Listan har inga mängder, för dem hittar du i tabellerna ovan. I Matlyst lägger du recepten på inköpslistan, så får du allt samlat och sorterat efter butikens avdelningar.')
    + lista],
  ['Så använder du Matlyst till nyårsmiddagen',
    p('Matlyst ger dig inga recept och inga tider. Du sparar recepten du själv använder, och Matlyst hjälper dig hålla ordning.')
    + ul(
      'Spara kalkon-, sås- och dessertrecepten från en webbsida, Instagram eller TikTok, eller fota receptet i kokboken (fotoimport är en funktion i Matlyst Pro). Kontrollera alltid utkastet mot originalet innan du sparar.',
      'Räkna om receptet mellan 1 och 20 portioner till antalet gäster. Omräkningen är linjär, så kontrollera krydda och salt själv.',
      'Lägg recepten i <a href="/sv/veckomeny-app/">veckomenyn</a> de dagar du ska laga dem.',
      'Skicka veckomenyn till <a href="/sv/inkopslista/">inköpslistan</a>, så får du lika varor ihopslagna och sorterade efter butikens avdelningar. Varor du redan har i skafferiet är bortvalda och märkta «I skafferiet».',
      'Lägg in det som blir över i <a href="/sv/skafferi-app/">skafferiet</a>, med bäst före-datum, så ser du vad som bör användas först.')
    + p('Matlyst varnar inte för tining eller steketider. Skriv tiderna i anteckningarna på receptet, eller använd tidslinjen ovan. Ska du också laga julbord? Se <a href="/sv/julbord/">planen för julbordet</a>.')],
  ['Källor och siffror',
    KILDEINTRO + s.kilderListe()
    + p('Hittade du ett fel, eller har en källa ändrats? Skriv till <a href="mailto:hei@matlyst-app.no">hei@matlyst-app.no</a>, så rättas sidan och datumet uppdateras.')],
];

export const FAQ = [
  ['Hur stor kalkon behöver jag till nyårsmiddagen?', `${sf('sf-jul')} räknar i sitt recept med en tinad kalkon på ${t('kalkon-recept')} till ${t('kalkon-portioner')}. Det är receptets eget exempel, inte en regel.`],
  ['Hur länge ska kalkonen stekas?', `${sf('sf-jul')} säger ${t('kalkon-start')} nederst i ugnen, sedan ${t('kalkon-temp')} varmluft och ${t('kalkon-kilo')}.`],
  ['Vilken innertemperatur ska kalkonen ha?', `${sf('sf-jul')} säger ${t('kalkon-klar')} och att du kan ta ut den vid ${t('kalkon-ut')}. ${arla('arla-kalkon')} skriver ${t('kalkon-arla')} intill lårbenet. Källorna är inte lika, så läs båda på sidan.`],
  ['Hur länge ska kalkonen vila?', `${sf('sf-jul')} säger att kalkonen behöver vila i minst ${t('kalkon-vila')} innan den kan skäras.`],
  ['Hur tinar jag kalkonen?', `${lv('lv-frysa')} säger att du kan tina maten i kylskåp eller i ett kallt vattenbad, och förvara upptinad mat kallt. Källorna vi läste anger ingen tid för en hel kalkon.`],
  ['Hur mycket kött per person till nyårsmiddagen?', `${sk('sk-servera')} räknar ${t('middag-benfritt')} benfritt kött per person vid en middag, och ${t('middag-ben')} per portion för kött med ben.`],
  ['Hur länge får maten stå framme?', `${lv('lv-kylvaror')} säger att kylvaror inte ska stå framme längre än ${t('framme')}.`],
  ['Hur länge håller resterna?', `${lv('lv-matlada')} säger att tillagad mat håller sig ${t('rester')} i kylskåp, rätt förvarad vid ${t('kylskap')}. Frys in det du inte hinner äta.`],
  ['Ger Matlyst recept eller steketider till nyårsmiddagen?', 'Nej. Du sparar recepten du själv använder, räknar om dem till antalet gäster och skickar ingredienserna till en inköpslista.'],
];

const TITEL = 'Nyårsmiddag: planering, tider och mängder';
const BESKRIVNING = 'Planera nyårsmiddagen hemma: tidslinje, kalkon med steketid och innertemperatur, mängder per gäst och inköpslista. Siffror med källa och datum.';
const H1 = 'Nyårsmiddag hemma: planering, tider och mängder';

const svarText = `Räkna ${t('middag-benfritt')} benfritt kött per person. Stek kalkonen ${t('kalkon-start')} först och sedan vid ${t('kalkon-temp')}, med ${t('kalkon-kilo')}, och låt den vila i minst ${t('kalkon-vila')}. Håll kylskåpet på ${t('kylskap')}. Alla mängder och tider är riktvärden, och varje siffra har en källa längst ned på sidan.`;
const rik = byggRik({ lang: 'sv', svarTekst: svarText, seksjoner: avsnitt() }).html;

export const side = {
  title: TITEL,
  description: BESKRIVNING,
  eyebrow: 'Nyårsmiddag',
  h1: H1,
  lead: 'Tidslinje från tre dagar före nyårsafton, steketid och innertemperatur för kalkon, mängder per gäst och inköpslista. Varje siffra har en källa med adress och datum, och tiderna är riktvärden.',
  publisert: HENTET,
  // FAQPage lages av generatoren fra den synlige FAQ-en når 'faq' står i lista.
  schemas: [...skjemaFor({ sti: STI, tittel: TITEL, h1: H1, beskrivelse: BESKRIVNING, kilder: s.brukt().kilder }), 'faq'],
  forst: '',
  stegTittel: 'Så använder du sidan',
  steg: [
    ['Välj antal gäster', 'Räkna kött per person och välj förrätt och tillbehör.'],
    ['Följ tidslinjen', 'Tina kallt och förbered det som går i förväg.'],
    ['Stek och låt vila', 'Räkna steketiden bakåt från middagstid.'],
  ],
  alternativ: '',
  grense: '',
  seksjoner: [],
  faqTittel: 'Frågor om nyårsmiddagen',
  rik,
  faq: FAQ,
  cta: 'Spara nyårsmiddagens recept i Matlyst',
};
export const BRUKT = () => s.brukt();
export { DATA };

// Julbord hemma (sv): tidslinje från början av december, mängder per gäst, inköpslista och kylregler.
// Utkast till Patricks godkännande, skrivet 2026-11-21. Varje siffra kommer från hoytider.data.json i den här mappen
// (se ../nb-jul/hoytid-felles.mjs, samma generator som /julebord/). Siffrorna är hämtade från svenska källor, inte översatta från norska.
import { byggRik } from '../rik-sider.mjs';
import { kg, lagMarked, p, tabell, ul } from '../nb-jul/hoytid-felles.mjs';

export const STI = 'sv/julbord/';
const M = lagMarked('sv');
const { DATA, HENTET, KILDEINTRO, skjemaFor } = M;
const s = M.lagSide();
const { t, rad, henv, tekst } = s;
const sk = henv('Svenskt Kött', 'Svenskt Kött');
const arla = henv('Arla', 'Arla');
const arlaK = henv('Arla Kundwebb', 'Arla');
const lv = henv('Livsmedelsverket', 'Livsmedelsverket');

// Antal gäster i tabellerna. Uträkningen står här och görs om oberoende i testen.
export const GAESTER_TOTALT = [6, 10, 15, 20, 30];
export const GAESTER_RATTER = [10, 20];
const spann = (g) => (Array.isArray(g) ? `${kg(g[0])} till ${kg(g[1])}` : kg(g));
const gange = (g, n) => (Array.isArray(g) ? g.map((x) => x * n) : g * n);
// Rätterna i tabellen. id pekar på ett tal i hoytider.data.json. Ingen svensk källa vi läst anger en mängd för just köttbullar, prinskorv,
// revbensspjäll och sill, så de räknas som proteinrätter enligt Svenskt Kötts tumregel (buffe-rad). Källkolumnen säger det rakt ut.
export const RATTER = [
  ['Julskinka', 'skinka-jul', () => `${sk('sk-skinka')}`],
  ['Köttbullar', 'buffe-rad', () => `${sk('sk-servera')}, tumregel`],
  ['Prinskorv', 'buffe-rad', () => `${sk('sk-servera')}, tumregel`],
  ['Revbensspjäll', 'buffe-rad', () => `${sk('sk-servera')}, tumregel`],
  ['Sill', 'buffe-rad', () => `${sk('sk-servera')}, tumregel`],
  ['Gravad lax', 'lax-buffe', () => `${arla('arla-lax')}`],
  ['Janssons frestelse', 'jansson', () => `${arlaK('arla-jansson')}`],
  ['Kokt potatis', 'potatis', () => `${arla('arla-potatis')}`],
];
export const rattRad = ([namn, id, kalla]) => {
  const x = rad(id);
  return [namn, x.vis, ...GAESTER_RATTER.map((n) => spann(gange(x.g, n))), kalla()];
};
export const totalRad = (n) => {
  const x = rad('buffe-rad');
  return [String(n), kg(n * x.g), kg(n * x.g * 3)];
};

const tidsrader = [
  ['Tidigt i december, till exempel söndag 6 december', ul(
    `Bestäm hur många ni blir och vilka rätter som ska med. ${arla('arla-utanstress')} föreslår att alla som ska äta julbord får önska sig var sin favoriträtt.${tekst('arla-onskerratt')} Julbordet behöver inte bli gigantiskt, särskilt inte när ni är få.${tekst('arla-farre')}`,
    `Stek köttbullar och frys in dem. Den 6 december lägger ${arla('arla-planering')} det i sin julplanering.${tekst('arla-6dec')} ${arla('arla-utanstress')} föreslår att du bygger upp ett lager i frysen med köttbullar och vegetarisk Jansson.${tekst('arla-forsta')}`,
    'Räkna ut mängderna med tabellerna längre ned och skriv inköpslistan.')],
  ['En vecka före, torsdag 17 december', ul(
    `Lägg en termometer i kylskåpet. ${lv('lv-kylvaror')} anger ${t('kylskap')} som lämplig kylskåpstemperatur. Gör plats i kylen, för ett julbord tar stor plats.`,
    'Handla det som håller sig: dryck, torrvaror och bröd. Spara det färska till de sista dagarna.')],
  ['Tisdag 22 december', ul(
    `Den 22 december föreslår ${arla('arla-planering')} att du gör i ordning julskinkan och griljerar den.${tekst('arla-22')} Hur länge skinkan behöver i ugnen står på <a href="/sv/tillagningstid/julskinka/">tillagningstid för julskinka</a>.`,
    `${arla('arla-julbord')} skriver att skinkan serveras med en god senap.${tekst('arla-skinka-senap')}`)],
  ['Dan före dan, onsdag 23 december', ul(
    `Gör Janssons frestelse. ${arla('arla-planering')} skriver att den smakar bäst om du gör den dagen innan och värmer upp den på julafton med en skvätt grädde.${tekst('arla-23')}`,
    `Låt den svalna innan den går in i kylen. ${lv('lv-avsvalning')} säger att mat i volymer under ${t('halvliter')} kan ställas in direkt i kylen även om den är lite varm.${tekst('lv-delaupp')} Större volymer kan svalna i ett kallt vattenbad.${tekst('lv-svalna')}`)],
  ['Julafton, torsdag 24 december', ul(
    `Gör i ordning sillen. ${arla('arla-planering')} tipsar om Gummans currysill från Skåne.${tekst('arla-24')}`,
    `Ta fram köttbullar, korv och lax ur frysen så att de hinner tina, enligt ${arla('arla-planering')}.${tekst('arla-24-tina')} ${lv('lv-frysa')} säger att du kan tina maten i kylskåp eller i ett kallt vattenbad, och att upptinad mat ska förvaras kallt om du inte ska äta den direkt.${tekst('lv-tina')}${tekst('lv-tina-kallt')}`,
    `Laxen går lättast att skära i tunna skivor när den är halvfryst, enligt ${arla('arla-planering')}.${tekst('arla-24-lax')}`,
    `När du dukar fram: ${lv('lv-kylvaror')} säger att kylvaror inte ska stå framme längre än ${t('framme')}.`)],
  ['Annandag jul och dagarna efter', ul(
    `${arla('arla-planering')} föreslår en paj på julskinkan som blivit över, den 27 december.${tekst('arla-27')}`,
    `${lv('lv-matlada')} säger att tillagad mat håller sig ${t('rester')} i kylskåp, rätt förvarad vid ${t('kylskap')}. Frys in det du inte hinner äta.${tekst('lv-frys-in')} Märk med datum och innehåll.${tekst('lv-marka')}`,
    'Se också <a href="/sv/hallbarhet/matrester/">hållbarhet för matrester</a> och <a href="/sv/frysa/matrester/">frysa matrester</a>.')],
];
const tidslinje = tidsrader.map(([nar, vad]) => `<h3>${nar}</h3>${vad}`).join('');

const mangder = p(`${sk('sk-servera')} räknar med ${t('buffe-rad')} per portion och rätt som tumregel när du serverar flera proteinrätter, och säger att du kan dra ner portionerna när det blir fler än tre.${tekst('sk-tre')} ${arla('arla-julbord')} säger samma sak om hela bordet: ju fler rätter, desto mindre äter gästerna av varje.${tekst('arla-flerratter')} Om du är osäker, räkna hellre lite för mycket än för lite och spara det som blir över, enligt ${sk('sk-servera')}.${tekst('sk-hellre-mer')}`)
  + tabell(['Gäster', `En proteinrätt (${rad('buffe-rad').vis} per person)`, 'Tre proteinrätter'], GAESTER_TOTALT.map(totalRad))
  + p(`Tabellen är räknad från ${t('buffe-rad')} per person och rätt. Tre rätter är bara ett exempel, du väljer själv hur många.`)
  + '<h3>Per rätt</h3>'
  + p(`Här är mängderna per person där en källa anger dem, uträknade för tio och tjugo gäster. Du ska inte ha alla rätterna. Julskinka på ett traditionellt julbord, där mycket annat också står framdukat: ${t('skinka-jul')} per person, enligt ${sk('sk-skinka')}.`)
  + tabell(['Rätt', 'Per gäst', `${GAESTER_RATTER[0]} gäster`, `${GAESTER_RATTER[1]} gäster`, 'Källa'], RATTER.map(rattRad))
  + p(`Vi hittade ingen svensk källa som anger en mängd för just köttbullar, prinskorv, revbensspjäll och sill. Därför visar tabellen tumregeln för proteinrätter på en buffé, ${t('buffe-rad')} per rätt. Det är en startpunkt, inte en uppgift om just den rätten. Vill du ha fler siffror om kött, se <a href="/sv/hur-mycket-per-person/kott/">hur mycket kött per person</a> och <a href="/sv/hur-mycket-per-person/korv/">hur mycket korv per person</a>.`)
  + '<h3>Om julskinkan är huvudrätten</h3>'
  + p(`Är skinkan huvudrätt vid en vanlig middag, gäller andra siffror. ${sk('sk-servera')} räknar ${t('middag-benfritt')} benfritt kött per person vid en middag, och ${t('middag-ben')} per portion för kött med ben. Ska du laga skinkan själv, säger ${sk('sk-gris')} ${t('skinka-sjalv-utan')} per person utan ben och ${t('skinka-sjalv-med')} med ben. Av färdiglagad skinka är ${t('skinka-fardig')} per person lagom, enligt samma källa. Se <a href="/sv/hur-mycket-per-person/julskinka/">hur mycket julskinka per person</a>.`)
  + '<h3>Lax på olika sätt</h3>'
  + p(`${arla('arla-lax')} skriver att det beror på sammanhanget: ${t('lax-huvud')} per person som huvudrätt, ${t('lax-buffe')} som en del av en buffé och ${t('lax-forratt')} som förrätt. Se <a href="/sv/hur-mycket-per-person/lax/">hur mycket lax per person</a>.`)
  + '<h3>När du justerar</h3>'
  + ul(
    `${arla('arla-julbord')} skriver att ett recept för fyra personer räcker till ungefär ${t('recept-buffe')}. Receptets portioner är alltså inte samma sak som gäster vid ett julbord.`,
    `Servera köttet i skivor på ett fat som gästerna tar från, så blir det mindre kvar på tallrikarna, enligt ${sk('sk-servera')}.${tekst('sk-fat')}`,
    `Potatis: ${arla('arla-potatis')} räknar med runt ${t('potatis')} per person, och skriver att det beror på hur hungriga gästerna är och hur mycket annan mat som serveras.`);

const lista = `<ul>
<li><strong>Kött och charkuterier:</strong> julskinka, köttbullar, prinskorv och revbensspjäll. Julskinkan serveras med en god senap.${tekst('arla-skinka-senap')}</li>
<li><strong>Fisk:</strong> sill och gravad lax.</li>
<li><strong>Varmt och gratänger:</strong> Janssons frestelse och grönkål.</li>
<li><strong>Kalla rätter:</strong> rödbetssallad, ägghalvor och gubbröra, som ${arla('arla-julbord')} räknar upp bland julbordets klassiker.${tekst('arla-ratter')}</li>
<li><strong>Potatis:</strong> till sill, lax och skinka.</li>
<li><strong>Bröd:</strong> vörtbröd och knäckebröd. ${arla('arla-planering')} skriver att det inte blir någon skinkmacka utan vörtbröd.${tekst('arla-vortbrod')}</li>
<li><strong>Ostbricka, gröt och godis:</strong> ostar, risgrynsgröt och julgodis.</li>
<li><strong>Dryck:</strong> det du själv ska ha till bordet.</li></ul>`;

const avsnitt = () => [
  ['Tidslinje från början av december',
    p('Julbord hemma blir lättare om du sprider arbetet över flera dagar. Tidslinjen följer Arlas julplanering och räknar fram till julafton torsdag 24 december 2026. Alla tider och mängder på sidan är <strong>riktvärden</strong>: de kommer från källorna längst ned, och antalet gäster, vad du serverar och ditt kylskåp kan ändra dem.')
    + tidslinje],
  ['Mängder per gäst', mangder],
  ['Inköpslista till julbordet',
    p(`Handla i två omgångar: först det som håller sig, sedan det färska. Listan följer julbordets klassiska rätter hos ${arla('arla-julbord')}. Den har inga mängder, för dem hittar du i tabellerna ovan. I Matlyst lägger du recepten på inköpslistan, så får du allt samlat och sorterat efter butikens avdelningar.`)
    + lista],
  ['Kyla, tina och rester',
    p('Reglerna nedan gäller allt du ställer fram. Livsmedelsverket är den svenska myndigheten för mat och livsmedel, och vi visar dess regler först.')
    + ul(
      `<strong>Kylskåpet:</strong> ${t('kylskap')}, enligt ${lv('lv-kylvaror')}.`,
      `<strong>Framme:</strong> kylvaror ska inte stå framme längre än ${t('framme')}, enligt ${lv('lv-kylvaror')}. Undvik direkt solljus.${tekst('lv-solljus')}`,
      `<strong>In i kylen:</strong> sätt in kylvaror som färsk fisk, kött och mejerivaror i kylskåpet så fort som möjligt, och matresterna när de har svalnat, enligt ${lv('lv-kylvaror')}.${tekst('lv-snabbt')}${tekst('lv-rester-in')}`,
      `<strong>Tina:</strong> i kylskåp eller i ett kallt vattenbad, och förvara upptinad mat kallt, enligt ${lv('lv-frysa')}.${tekst('lv-tina')}${tekst('lv-tina-kallt')} Titta, lukta och smaka på maten när den har tinat.${tekst('lv-sinnen')}`,
      `<strong>Rester:</strong> ${t('rester')} i kylskåp, enligt ${lv('lv-matlada')}. Lagom temperatur i frysen är ${t('frys')}, enligt ${lv('lv-frysa')}.`)
    + p('Läs mer: <a href="/sv/hallbarhet/framme/">hållbarhet för mat som står framme</a>, <a href="/sv/hallbarhet/kylskapstemperatur/">kylskåpstemperatur</a> och <a href="/sv/frysa/matrester/">frysa matrester</a>.')],
  ['Så använder du Matlyst till julbordet',
    p('Matlyst ger dig inga recept och inga tider. Du sparar recepten du själv använder, och Matlyst hjälper dig hålla ordning.')
    + ul(
      'Spara recepten till rätter du lagar själv, från en webbsida, Instagram eller TikTok, eller fota receptet i kokboken (fotoimport är en funktion i Matlyst Pro). Kontrollera alltid utkastet mot originalet innan du sparar.',
      'Räkna om receptet mellan 1 och 20 portioner till antalet gäster. Omräkningen är linjär, så kontrollera krydda och salt själv.',
      'Lägg recepten i <a href="/sv/veckomeny-app/">veckomenyn</a> de dagar du ska laga dem.',
      'Skicka veckomenyn till <a href="/sv/inkopslista/">inköpslistan</a>, så får du lika varor ihopslagna och sorterade efter butikens avdelningar. Varor du redan har i skafferiet är bortvalda och märkta «I skafferiet».',
      'Lägg in det som blir över i <a href="/sv/skafferi-app/">skafferiet</a>, med bäst före-datum, så ser du vad som bör användas först.')
    + p('Matlyst skickar inga påminnelser om när du ska laga vad. Skriv tiderna i anteckningarna på receptet, eller använd tidslinjen ovan. Ska du också laga nyårsmiddag? Se <a href="/sv/nyarsmiddag/">planen för nyårsmiddagen</a>.')],
  ['Källor och siffror',
    KILDEINTRO + s.kilderListe()
    + p('Hittade du ett fel, eller har en källa ändrats? Skriv till <a href="mailto:hei@matlyst-app.no">hei@matlyst-app.no</a>, så rättas sidan och datumet uppdateras.')],
];

export const FAQ = [
  ['Hur mycket mat per person behöver jag till julbord hemma?', `${sk('sk-servera')} räknar ${t('buffe-rad')} per portion och rätt när du serverar flera proteinrätter, och mindre per rätt om det blir fler än tre. ${arla('arla-julbord')} skriver att ju fler rätter du serverar, desto mindre äter gästerna av varje.`],
  ['Hur mycket julskinka per person?', `${sk('sk-skinka')} säger ${t('skinka-jul')} per person på ett traditionellt julbord där mycket annat också står framdukat. Är skinkan huvudrätten, säger ${sk('sk-servera')} ${t('middag-benfritt')} benfritt kött per person.`],
  ['Hur mycket gravad lax per person?', `${arla('arla-lax')} säger ${t('lax-buffe')} per person som en del av en buffé, ${t('lax-forratt')} som förrätt och ${t('lax-huvud')} som huvudrätt.`],
  ['Hur mycket Janssons frestelse per person?', `${arlaK('arla-jansson')} säger ${t('jansson')} gratäng per person på ett stort julbord.`],
  ['Hur mycket sill, köttbullar och prinskorv per person?', `Vi hittade ingen svensk källa som anger en mängd för just de rätterna. ${sk('sk-servera')} har en tumregel på ${t('buffe-rad')} per proteinrätt på en buffé, som är en startpunkt.`],
  ['Hur länge får julbordet stå framme?', `${lv('lv-kylvaror')} säger att kylvaror inte ska stå framme längre än ${t('framme')}.`],
  ['Hur länge håller resterna efter julbordet?', `${lv('lv-matlada')} säger att tillagad mat håller sig ${t('rester')} i kylskåp, rätt förvarad vid ${t('kylskap')}. Frys in det du inte hinner äta.`],
  ['Vilken temperatur ska kylskåpet ha?', `${lv('lv-kylvaror')} anger ${t('kylskap')} som lämplig kylskåpstemperatur. Lägg en termometer i kylskåpet och kontrollera den.`],
  ['Ger Matlyst recept eller tider till julbordet?', 'Nej. Du sparar recepten du själv använder, räknar om dem till antalet gäster och skickar ingredienserna till en inköpslista.'],
];

const TITEL = 'Julbord hemma: planering, mängder och inköpslista';
const BESKRIVNING = 'Planera julbord hemma med tidslinje från början av december, mängder per gäst för julskinka, lax och Janssons samt inköpslista och kylregler. Siffror med källa.';
const H1 = 'Julbord hemma: planering, mängder och inköpslista';

const svarText = `Räkna ${t('buffe-rad')} per portion och rätt när du serverar flera proteinrätter, ${t('skinka-jul')} julskinka per person på ett traditionellt julbord och ${t('lax-buffe')} gravad lax på en buffé. Gör maten i god tid, håll kylskåpet på ${t('kylskap')} och låt inte kylvaror stå framme längre än ${t('framme')}. Alla mängder och tider är riktvärden, och varje siffra har en källa längst ned på sidan.`;
const rik = byggRik({ lang: 'sv', svarTekst: svarText, seksjoner: avsnitt() }).html;

export const side = {
  title: TITEL,
  description: BESKRIVNING,
  eyebrow: 'Julbord hemma',
  h1: H1,
  lead: 'Tidslinje från början av december, mängder per gäst, inköpslista och regler för kyla och rester. Varje siffra har en källa med adress och datum, och mängderna är riktvärden.',
  publisert: HENTET,
  // FAQPage lages av generatoren fra den synlige FAQ-en når 'faq' står i lista.
  schemas: [...skjemaFor({ sti: STI, tittel: TITEL, h1: H1, beskrivelse: BESKRIVNING, kilder: s.brukt().kilder }), 'faq'],
  forst: '',
  stegTittel: 'Så använder du sidan',
  steg: [
    ['Välj antal gäster', 'Och vilka rätter som ska med, helst färre än du tror.'],
    ['Följ tidslinjen', 'Gör det som går i förväg och frys in det som tål det.'],
    ['Handla från två listor', 'Först det som håller sig, sedan det färska.'],
  ],
  alternativ: '',
  grense: '',
  seksjoner: [],
  faqTittel: 'Frågor om julbord hemma',
  rik,
  faq: FAQ,
  cta: 'Spara julbordets recept i Matlyst',
};
export const BRUKT = () => s.brukt();
export { DATA };

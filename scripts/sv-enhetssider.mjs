// Enhetsomvandlare på svenska: en sida per enhetspar (ml till dl, cup till ml, °F till °C osv.) plus en hubbsida.
// Samma motor och samma kalkylator (site.js) som de engelska sidorna; texten är skriven för svenska recept och svenska hushållsmått.
import { ENHETER, FLERTALL, allePar, enheterFor, enhetsKort, kortSetning, konverter, parSti, tall } from './enheter.mjs';
import { byggLese } from './rik-sider.mjs';

const esc = (s) => String(s).replace(/&/gu, '&amp;').replace(/</gu, '&lt;').replace(/"/gu, '&quot;');
const p = (...ps) => ps.map((t) => `<p>${t}</p>`).join('');
const stor = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const N = (id) => ENHETER[id].sv;
const gruppeIds = (g) => enheterFor('sv').filter((id) => ENHETER[id].gruppe === g);

/** Svenskt talformat: decimalkomma, fyra gällande siffror och inget tusentalsmellanrum. Samma regel som omvandlarkortet, så tabellen och kortets svar blir lika. */
const k = (n) => tall(n).replace('.', ',');
const er1 = (v) => Math.abs(v - 1) < 1e-9;
/** Ordet för en enhet vid en viss mängd (kort skrivsätt, men «1 cup» och «2 cups»). */
const label = (v, id) => (FLERTALL.sv[id] ? FLERTALL.sv[id][er1(v) ? 0 : 1] : N(id).kort);
const val = (v, id) => `${k(v)} ${label(v, id)}`;

const VERDIER = {
  ml: [5, 10, 15, 25, 50, 75, 100, 150, 200, 250, 300, 500, 750, 1000], cl: [1, 2, 3, 5, 10, 15, 20, 25, 33, 50, 75, 100], dl: [0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 7.5, 10],
  l: [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 5, 10], krm: [1, 2, 3, 5], tsk: [0.5, 1, 2, 3], msk: [0.5, 1, 2, 3, 4, 5, 6],
  tsp: [0.25, 0.5, 1, 1.5, 2, 3, 4], tbsp: [0.5, 1, 1.5, 2, 3, 4, 5, 6, 8], oz: [1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 32],
  cups: [0.25, 0.33, 0.5, 0.67, 0.75, 1, 1.5, 2, 2.5, 3, 4, 5, 8], pints: [0.5, 1, 2, 3, 4], quarts: [0.5, 1, 2, 3, 4], gallons: [0.25, 0.5, 1, 2, 3, 5],
  g: [5, 10, 25, 50, 100, 150, 200, 250, 500, 750, 1000], kg: [0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 5, 10], 'oz-vekt': [1, 2, 3, 4, 6, 8, 10, 12, 16, 24, 32], lb: [0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 4, 5, 10],
  mm: [1, 2, 5, 10, 15, 20, 25, 30], cm: [5, 10, 15, 18, 20, 22, 23, 24, 25, 26, 28, 30, 35], inches: [1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 13, 14],
  c: [100, 120, 140, 150, 160, 170, 180, 190, 200, 220, 230, 250], f: [250, 275, 300, 325, 350, 375, 400, 425, 450, 475, 500],
};

// «Cup» är huvudordet (sökvolym: «cup till dl» 3 162 mot «kopp till dl» 32 i månaden), men folk frågar också med «kopp».
// Meningarna nedan är de enda ställena där «kopp» står i synlig text: förklaringen på varje sida med cups, och två frågor med svar
// (om cup och kopp på alla sidor med cups, om dl och kopp på sidorna mellan cups och dl). test/omregner-sider.test.mjs låser det.
export const KOPP_BIORD = {
  forklaring: 'En cup är en amerikansk kopp på 236,6 ml, eller 8 flytande uns.',
  sammeSporsmal: 'Är en cup samma sak som en kopp?',
  sammeSvar: 'En cup är en amerikansk kopp på 236,6 ml. Koppen i skåpet har sällan samma storlek.',
  dlSporsmal: 'Hur många dl är en kopp?',
  dlSvar: 'En kopp i ett amerikanskt recept är en cup, alltså 2,366 dl. Recept avrundar ofta till 2,4 dl.',
};

// Var enheten förekommer (efter «förekommer i»), för kökanteckningen när paret saknar egen text.
const BRUK = {
  ml: 'metriska recept, mätglas och de flesta recept från andra länder än USA',
  cl: 'drinkar, cocktails och en del europeiska recept',
  dl: 'svenska recept, där deciliter är det vanligaste hushållsmåttet för mjöl, mjölk och grädde',
  l: 'buljong, soppa, mjölk och allt som lagas i en stor gryta',
  krm: 'svenska recept för små mängder salt, peppar, kryddor och bakpulver',
  tsk: 'svenska recept för kryddor, bakpulver, vaniljsocker och små mängder av det mesta',
  msk: 'svenska recept för olja, soja, smör och mjöl',
  tsp: 'amerikanska recept för kryddor, bakpulver, essenser och små mängder av det mesta',
  tbsp: 'amerikanska recept för olja, såser, smör och mjöl',
  oz: 'amerikanska recept för vätskor och på amerikanska förpackningar av drycker och såser',
  cups: 'amerikanska recept, som mäter de flesta ingredienser i volym',
  pints: 'amerikanska recept för grädde, glass och bär',
  quarts: 'amerikanska recept för buljong, soppa och mejeriprodukter',
  gallons: 'amerikansk mjölk, vatten och stora satser',
  g: 'metriska recept, köksvågar och näringsdeklarationer',
  kg: 'metriska recept för kött, potatis, mjöl och storinköp',
  'oz-vekt': 'amerikanska recept och förpackningar av kött, ost, choklad och konserver',
  lb: 'amerikanska recept och livsmedelsförpackningar för kött, grönsaker och mjöl',
  mm: 'degtjocklek och fina skärningar',
  cm: 'bakformar, degtjocklek och skärstorlekar i metriska recept',
  inches: 'amerikanska bakformsstorlekar och degtjocklek',
  c: 'recept och ugnar utanför USA',
  f: 'amerikanska recept och de flesta amerikanska ugnar',
};

// Handskrivna kökanteckningar för de vanligaste paren (nyckel «från>till»).
const NOTE = {
  'ml>dl': 'Deciliter är det vanligaste hushållsmåttet i svenska recept, så när ett recept vill ha 2 dl mjölk är det 200 ml. Många mätglas visar båda måtten, så du kan läsa av dl-strecket direkt.',
  'dl>ml': 'Ett recept som anger 3 dl vill ha 300 ml. Visar ditt mätglas bara milliliter multiplicerar du med 100 och häller upp till det strecket.',
  'ml>cl': 'Centiliter ser du mest på flaskor och i drinkrecept. 33 cl är en vanlig burkstorlek och är samma sak som 330 ml.',
  'cl>ml': 'En centiliter är 10 milliliter. Ett drinkrecept som vill ha 4 cl sprit menar alltså 40 ml.',
  'cl>dl': 'Tio centiliter går på en deciliter. 25 cl grädde är därför 2,5 dl, vilket är en vanlig förpackningsstorlek.',
  'dl>cl': 'En deciliter är 10 centiliter. 2 dl är alltså 20 cl, vilket är bra att veta när ett recept blandar mått med en flaskas märkning.',
  'dl>l': 'Tio deciliter är en liter. Det gör det lätt att räkna ut hur stor gryta ett recept behöver: 15 dl soppa är 1,5 liter.',
  'l>dl': 'En liter är 10 deciliter. Ett recept på 1,5 liter buljong vill alltså ha 15 dl, och då kan du mäta upp med dl-måttet.',
  'cups>ml': 'Amerikanska recept mäter i cups, men en cup är inte samma sak som muggen i skåpet. En cup är 236,6 ml. Många kokböcker avrundar till 240 ml, och därför ser du båda talen. Vid bakning är vägning säkrare än något volymmått.',
  'ml>cups': 'Står receptet i milliliter och du bara har mått i cups delar du med 236,6. 250 ml är drygt en cup.',
  'cups>dl': 'En cup är 2,366 dl, och recept avrundar ofta till 2,4 dl. Står det 2,5 dl i ett svenskt recept är det lite mer än en cup, och i förlåtande rätter som soppa spelar skillnaden ingen roll.',
  'dl>cups': 'Deciliter till cups: dela med 2,366. Tre deciliter är cirka 1,27 cups, alltså ungefär en och en kvarts cup i de flesta recept.',
  'cups>msk': 'En cup är ungefär 16 matskedar. Med svenska matskedar på 15 ml blir det 15,8 msk, så avrunda till 16 för de flesta recept och räkna noggrannare när du bakar.',
  'cups>tbsp': 'En cup innehåller 16 amerikanska matskedar. En kvarts cup är alltså 4 matskedar, och en tredjedels cup är drygt 5.',
  'tbsp>ml': 'En amerikansk matsked är 14,8 ml, vilket de flesta recept avrundar till 15 ml. Det är samma storlek som en svensk matsked, så skillnaden är sällan något att bry sig om.',
  'ml>tbsp': 'Små mängder vätska i metriska recept blir matskedar i amerikanska recept. 15 ml är ungefär en amerikansk matsked.',
  'tsp>ml': 'En amerikansk tesked är 4,9 ml, vilket recept avrundar till 5 ml. Använd en riktig måttsked, inte en tesked ur besticklådan, vars storlek varierar mycket.',
  'ml>tsp': 'Fem milliliter är ungefär en amerikansk tesked. För små mängder kryddor och essenser mäter du bäst med måttsked i stället för mätglas.',
  'tbsp>tsp': 'En amerikansk matsked innehåller 3 amerikanska teskedar. Det är det enklaste sättet att öka eller minska en kryddmängd.',
  'tsp>tbsp': 'Tre amerikanska teskedar är en matsked. Fyra teskedar är en matsked och en tesked.',
  'msk>ml': 'En matsked är 15 ml i svenska recept. Det betyder att 4 msk olja är 60 ml, vilket är lite mer än en halv deciliter.',
  'ml>msk': 'Dela milliliter med 15 för att få matskedar. 45 ml är 3 msk, och 100 ml är 6 och två tredjedels msk.',
  'tsk>ml': 'En tesked är 5 ml. Räkna med det när du mäter vätska, till exempel 2 tsk vinäger, som är 10 ml.',
  'ml>tsk': 'Dela milliliter med 5 för att få teskedar. 10 ml är 2 tsk, och 25 ml är 5 tsk.',
  'krm>ml': 'Ett kryddmått är 1 ml, det minsta av de svenska hushållsmåtten. Det används för små mängder salt, peppar och kryddor, och är en femtedels tesked.',
  'ml>krm': 'En milliliter är ett kryddmått. Har du bara mätglas är 2 ml för litet för att läsa av, så mät hellre med kryddmått eller tesked.',
  'krm>tsk': 'Fem kryddmått är en tesked. En halv tesked är alltså 2,5 krm, vilket de flesta recept skriver som ”knappt 3 krm”.',
  'dl>msk': 'En deciliter är 100 ml, alltså 6 och två tredjedels matsked. Många recept avrundar till 6 eller 7 msk, och det går bra i soppor och såser men inte alltid i bakverk.',
  'msk>dl': 'En matsked är 0,15 dl. Fyra matskedar är 0,6 dl, vilket är lite mer än en halv deciliter.',
  'dl>tsk': 'En deciliter är 20 teskedar. Det är sällan du mäter så, men det är bra att veta för små mängder kryddor.',
  'msk>tsk': 'En matsked är 3 teskedar. Så när du bara har tesked ur lådan mäter du upp tre för varje matsked.',
  'tsk>msk': 'Tre teskedar är en matsked. Fyra teskedar är en matsked och en tesked.',
  'msk>tbsp': 'En svensk matsked är 15 ml och en amerikansk är 14,8 ml. Skillnaden är så liten att du kan behandla dem som lika, utom när du bakar stora satser.',
  'tbsp>msk': 'En amerikansk matsked är 14,8 ml, alltså nästan exakt en svensk matsked på 15 ml. I praktiken byter du dem rakt av.',
  'tsk>tsp': 'En svensk tesked är 5 ml och en amerikansk är 4,9 ml. I praktiken är de samma mått.',
  'tsp>tsk': 'En amerikansk tesked är 4,9 ml och en svensk är 5 ml. Du kan byta dem rakt av i ett recept.',
  'oz>ml': 'Den här sidan räknar om flytande uns, ett volymmått. Ett amerikanskt flytande uns är 29,57 ml. Uns på ett mjölpaket eller en ostbit är vikt, så för dem ska du använda omvandlaren från uns till gram.',
  'ml>oz': 'Milliliter till amerikanska flytande uns: dela med 29,57. 250 ml är cirka 8,5 fl oz. Flytande uns mäter volym, medan uns på livsmedelsförpackningar mäter vikt.',
  'oz-vekt>g': 'Ett uns är 28,35 gram, så 4 uns är cirka 113 g och 8 uns är cirka 227 g. Det är talet du behöver för smör, ost, choklad och kött i amerikanska recept.',
  'g>oz-vekt': 'Gram till uns: dela med 28,35. 100 g är cirka 3,5 uns och 250 g är cirka 8,8 uns. Använd köksvåg när du kan, den är noggrannare än ett volymmått.',
  'lb>g': 'Ett pund är 453,6 gram. Ett recept på ett pund köttfärs behöver cirka 450 g, vilket också är en vanlig förpackningsstorlek i svenska butiker.',
  'g>lb': 'Gram till pund: dela med 453,6. 500 g är cirka 1,1 pund. I länder som räknar i pund säljs ofta 1 pund-förpackningar där svenska butiker har 450 eller 500 g.',
  'lb>kg': 'Ett pund är 0,4536 kilogram. Två pund är drygt 900 g, så ett kilo är lite mer än två pund.',
  'kg>lb': 'Kilogram till pund: multiplicera med 2,205. En kyckling på 1,5 kg är cirka 3,3 pund, bra att veta när ett amerikanskt recept anger kycklingen i pund.',
  'kg>g': 'Ett kilogram är 1000 gram. Det är den enklaste omräkningen i köket: flytta bara decimalkommat tre steg.',
  'g>kg': 'Gram till kilogram: dela med 1000. 750 g är 0,75 kg, och 1500 g är 1,5 kg.',
  'f>c': 'De flesta amerikanska ugnar och recept använder Fahrenheit. 350 °F är 177 °C, vilket svenska recept ofta avrundar till 175 eller 180 °C. Ugnar med varmluft behöver ofta lägre temperatur, så titta också i ugnens manual.',
  'c>f': 'Celsius till Fahrenheit: multiplicera med 9/5 och addera 32. 180 °C är 356 °F, vilket amerikanska recept avrundar till 350 °F. Förvärm alltid ugnen helt innan du sätter in något.',
  'gallons>l': 'En amerikansk gallon är 3,785 liter. Brittiska (imperial) gallon är större än den amerikanska, så en gallon i ett brittiskt recept är inte samma mått som i ett amerikanskt.',
  'l>gallons': 'Liter till amerikanska gallon: dela med 3,785. En gryta på 4 liter rymmer lite mer än en gallon.',
  'inches>cm': 'Ett tum är exakt 2,54 centimeter. En kakform på 9 tum är cirka 23 cm och en på 8 tum cirka 20 cm, de storlekar som de flesta recept vill ha.',
  'cm>inches': 'Centimeter till tum: dela med 2,54. En form på 20 cm är cirka 8 tum och en på 30 cm cirka 12 tum.',
  'mm>cm': 'Tio millimeter är en centimeter. Det är praktiskt när ett recept anger degtjocklek i millimeter och linjalen visar centimeter.',
  'cm>mm': 'En centimeter är 10 millimeter. En deg som ska kavlas till 0,5 cm ska alltså vara 5 mm tjock.',
  'pints>ml': 'En amerikansk pint är 473 ml, alltså knappt en halv liter. Brittiska pints är större, så kolla varifrån receptet kommer.',
  'quarts>ml': 'En amerikansk quart är 946 ml, nästan en liter. Fyra quarts är en amerikansk gallon.',
};

const FEIL = {
  volum: [
    'Att använda en kaffemugg som mätglas. En kaffemugg är sällan lika stor som ett mätglas, medan en cup är 236,6 ml.',
    'Att blanda ihop flytande uns och uns som mäter vikt. Flytande uns är volym, uns på en förpackning är vikt.',
    'Att anta att en amerikansk pint, quart eller gallon är lika stor som den brittiska. De brittiska (imperial) måtten är större.',
    'Att avrunda för tidigt. Räkna om hela receptet först och avrunda sedan de färdiga mängderna.',
    'Att mäta torra ingredienser i ett mätglas för vätska. Då packas de och du får för mycket.',
  ],
  vekt: [
    'Att läsa uns på förpackningen som flytande uns. Vikt och volym är olika mått.',
    'Att mäta mjöl i cups och förvänta sig samma gram varje gång. Skopar du mjölet packas det, medan sked och avstrykning ger mindre.',
    'Att avrunda ett pund till 500 g när receptet är känsligt, till exempel bröd. Ett pund är 454 g.',
    'Att glömma nollställa vågen efter att du ställt skålen på den.',
    'Att räkna om en ingrediens men inte de andra, så att proportionerna förskjuts.',
  ],
  lengde: [
    'Att mäta formen från den yttre kanten i stället för insidan.',
    'Att byta en form på 9 tum mot en på 20 cm utan att kontrollera, vilket är en annan yta.',
    'Att glömma att en djupare form behöver längre gräddningstid.',
    'Att läsa mm som cm när du kavlar deg.',
    'Att inte runda av till en formstorlek som du faktiskt kan köpa.',
  ],
  temperatur: [
    'Att använda Celsiustalet i en ugn som visar Fahrenheit, vilket blir långt för svalt.',
    'Att glömma sänka temperaturen när du använder varmluft.',
    'Att lita på ugnens ratt i stället för en termometer.',
    'Att öppna ugnsluckan för ofta, vilket sänker temperaturen snabbt.',
    'Att räkna om ett recept som anger gasregleringsnivå utan att kontrollera din egen ugn.',
  ],
};

const MENTAL = {
  volum: 'En snabb uppskattning: en cup är lite mindre än 2,5 dl, och en liter är lite mer än fyra cups. Använd omvandlaren för allt du ska hälla i en skål.',
  vekt: 'En snabb uppskattning: ett pund är lite mindre än ett halvt kilo, och ett kilo är lite mer än två pund. Ett uns är cirka 28 gram.',
  lengde: 'En snabb uppskattning: ett tum är cirka två och en halv centimeter, och en form på 9 tum är cirka 23 cm.',
  temperatur: 'En snabb uppskattning: dubbla Celsiustalet och lägg till 30 för ett ungefärligt Fahrenheittal. Det blir mindre exakt ju varmare det blir, så använd omvandlaren för bakning.',
};

const SKILLNAD = {
  volum: 'I svenska recept är 1 krm = 1 ml, 1 tsk = 5 ml, 1 msk = 15 ml och 1 dl = 100 ml. De amerikanska måtten är lite annorlunda: en amerikansk tesked är 4,9 ml, en amerikansk matsked 14,8 ml och en cup 236,6 ml. Många recept avrundar cupen till 240 ml eller 2,4 dl, så du kan se olika tal för samma mått. Brittiska (imperial) pint och gallon är dessutom större än de amerikanska.',
  vekt: 'Ett uns är 28,35 gram och ett pund är 453,6 gram. Sexton uns går på ett pund. Svenska recept anger nästan alltid gram och kilogram, så uns och pund dyker upp när du lagar efter ett amerikanskt eller brittiskt recept.',
  lengde: 'Ett tum är exakt 2,54 centimeter. Svenska recept anger formar och degtjocklek i centimeter och millimeter, medan amerikanska recept anger dem i tum, till exempel en kakform på 9 tum.',
  temperatur: 'Vattnet fryser vid 0 °C, som är 32 °F, och kokar vid 100 °C, som är 212 °F. Svenska recept använder Celsius. Amerikanska recept använder Fahrenheit, så 350 °F är 177 °C och 400 °F är 204 °C.',
};

const MAALETIPS = {
  volum: p('Använd mätglas för vätska och avstrukna mått för torra ingredienser. Läs av glaset i ögonhöjd på ett plant underlag, och stryk av skedar och mått med knivbladets baksida. Amerikanska, brittiska och australiska mått med samma namn är inte alltid lika stora, så kontrollera varifrån receptet kommer.'),
  vekt: p('En köksvåg slår varje volymmått, särskilt för mjöl och socker. Ställ skålen på vågen, nollställ och tillsätt ingrediensen. Har du bara cups, kom ihåg att en cup mjöl och en cup socker inte väger lika mycket.'),
  lengde: p('Mät formen tvärs över toppen från insida till insida, inte över den yttre kanten. En form som är en storlek fel ändrar gräddningstiden, så titta till kakan tidigare om din form är större än receptets.'),
  temperatur: p('Ugnsrattar visar ofta fel. En billig ugnstermometer talar om den verkliga temperaturen. Ugnar med varmluft bakar varmare, så många recept föreslår lägre temperatur när du använder varmluft.'),
};

const SLUTA = {
  volum: 'När ett helt recept står i cups eller flytande uns blir det många omräkningar, och varje avrundning kan skjuta proportionerna ur led.',
};

function regelTekst(fra, til) {
  const a = ENHETER[fra]; const b = ENHETER[til];
  if (a.gruppe === 'temperatur') return fra === 'f' ? 'dra av 32 och multiplicera sedan med 5/9' : 'multiplicera med 9/5 och addera sedan 32';
  const x = a.f / b.f;
  if (x >= 1) return `multiplicera med ${k(x)}`;
  const inv = b.f / a.f;
  const rundt = Math.abs(inv - Math.round(inv)) < 1e-9;
  return rundt ? `dela med ${k(inv)}` : `multiplicera med ${k(x)} (eller dela med ${k(inv)})`;
}

function tabell(fra, til) {
  const rader = (VERDIER[fra] ?? [1, 2, 5, 10]).map((v) => `<tr><td>${val(v, fra)}</td><td>${val(konverter(v, fra, til), til)}</td></tr>`).join('');
  return `<div class="table-wrap"><table><thead><tr><th>${esc(stor(N(fra).fl))}</th><th>${esc(stor(N(til).fl))}</th></tr></thead><tbody>${rader}</tbody></table></div>`;
}

function eksempler(fra, til) {
  const vals = (VERDIER[fra] ?? [1, 2, 5]).filter((v) => v >= 1).slice(1, 4);
  const lista = (vals.length ? vals : [1, 2, 5]).map((v) => `<li><strong>${val(v, fra)}</strong> = ${val(konverter(v, fra, til), til)}</li>`).join('');
  return `<ul>${lista}</ul>`;
}

function relaterte(fra, til) {
  const par = allePar('sv');
  const sammeFra = par.filter(([a, b]) => a === fra && b !== til).slice(0, 5);
  const sammeTil = par.filter(([a, b]) => b === til && a !== fra).slice(0, 5);
  const alle = [[til, fra], ...sammeFra, ...sammeTil];
  return `<ul class="omregner-liste">${alle.map(([a, b]) => `<li><a href="/sv/${parSti(a, b, 'sv')}">${esc(N(a).kort)} till ${esc(N(b).kort)}</a>: ${esc(N(a).fl)} till ${esc(N(b).fl)}</li>`).join('')}</ul>`;
}

const MATLYST = p('Att räkna om för hand blir snabbt tjatigt, särskilt när ett helt recept står i fel enheter. När du importerar ett recept i Matlyst väljer du under <strong>Enheter</strong> i Inställningar om mängderna visas metriskt eller behålls som källan skrev dem. Med <strong>Metriskt</strong> räknas cups, uns och pund från ett amerikanskt recept om till milliliter och gram vid import. Väljer du <strong>Amerikanskt</strong> behåller Matlyst källans mängder som de står. Inställningen gäller nya importer.')
  + '<ul><li><strong>Importera en gång, ingen huvudräkning.</strong> Dela ett recept från Instagram, TikTok eller en webbplats med Matlyst och kontrollera utkastet innan du sparar.</li><li><strong>Skala portionerna.</strong> Ändra från 1 till 20 portioner så följer alla mängder med. Skalningen är linjär, så kontrollera bakning och kryddor själv.</li><li><strong>En inköpslista.</strong> Alla ingredienser samlas i en lista som är sorterad efter butiksavdelning.</li></ul>'
  + p('Matlyst är gratis att börja med, med 5 importer per kalendermånad. Läs mer om <a href="/sv/receptbok-app/">receptboksappen</a> eller se hur <a href="/sv/inkopslista/">inköpslistan</a> fungerar.');

function titelFor(F, T) {
  const full = `Räkna om ${F.kort} till ${T.kort}: ${F.fl} till ${T.fl}`;
  return full.length <= 60 ? full : `Räkna om ${F.kort} till ${T.kort}`;
}

function beskrivningFor(F, T, kortSvar) {
  const kandidater = [
    `Räkna om ${F.fl} till ${T.fl} med en gratis omvandlare. ${kortSvar}. Med tabell, formel och köksråd.`,
    `Räkna om ${F.kort} till ${T.kort} med en gratis omvandlare. ${kortSvar}. Med tabell, formel och köksråd för recept.`,
    `Räkna om ${F.kort} till ${T.kort} med en gratis omvandlare. ${kortSvar}. Med tabell, formel och köksråd.`,
  ];
  return kandidater.find((t) => t.length >= 100 && t.length <= 160) ?? kandidater[1];
}

/** Är kortformen lika med namnet («cups», «tum»), skrivs enheten utan parentes: «Cups», inte «Cups (cup)». */
const likNavn = (id) => [N(id).fl, N(id).en].some((t) => t.toLocaleLowerCase() === N(id).kort.toLocaleLowerCase());
/** Parentesen sløyfes også når kortformen er siste ord i navnet («amerikanska gallon (gallon)» ville gitt to like nabo-ord). */
const sisteOrd = (id) => N(id).fl.toLocaleLowerCase().split(' ').pop() === N(id).kort.toLocaleLowerCase();
const medKort = (id) => (likNavn(id) || sisteOrd(id) ? N(id).fl : `${N(id).fl} (${N(id).kort})`);

export function sideForPar(fra, til) {
  const F = N(fra); const T = N(til);
  const g = ENHETER[fra].gruppe;
  const x = konverter(1, fra, til);
  const svar = `${kortSetning('sv', fra, til)}. För att räkna om ${F.fl} till ${T.fl}, ${regelTekst(fra, til)}.`;
  const medCups = fra === 'cups' || til === 'cups';
  const note = NOTE[`${fra}>${til}`] ?? `${stor(F.fl)} förekommer i ${BRUK[fra]}. ${stor(T.fl)} förekommer i ${BRUK[til]}. Därför räknar du om varje gång ett recept är skrivet för ett system och dina redskap följer det andra.`;
  const formel = g === 'temperatur' ? (fra === 'f' ? '°C = (°F - 32) × 5/9' : '°F = °C × 9/5 + 32') : `${T.kort} = ${F.kort} × ${k(x)}`;
  const kortSvar = `1 ${label(1, fra)} = ${val(x, til)}`;
  const likt = likNavn(fra) || likNavn(til);
  const exVal = (VERDIER[fra] ?? [2]).find((v) => v >= 2) ?? 2;
  const rik = byggLese({
    seksjoner: [
      [`Tabell: ${F.kort} till ${T.kort}`, p('Siffrorna nedan är de som recept använder oftast. Hitta din mängd i den vänstra kolumnen.') + tabell(fra, til)],
      [`Så räknar du om ${F.fl} till ${T.fl}`, p(`Regeln: ${regelTekst(fra, til)}. Som formel: ${formel}.`) + p(SKILLNAD[g]) + p('Tre snabba exempel:') + eksempler(fra, til)],
      [`Där recept använder ${F.fl} och ${T.fl}`, (medCups ? p(KOPP_BIORD.forklaring) : '') + p(note) + p(`Det här är förklaringen till att samma recept kan se olika ut beroende på var det är skrivet. Titta alltid efter vilken enhet receptet använder innan du mäter upp, och räkna om alla mängder på en gång.`)],
      ['Tips för mätning', MAALETIPS[g] + p(MENTAL[g])],
      ['Vanliga misstag vid omräkning', `<ul>${FEIL[g].map((t) => `<li>${t}</li>`).join('')}</ul>`],
      ['Räkna om ett helt recept', p(`När ett recept är skrivet i ${F.fl} och du lagar mat med ${T.fl}, räkna om alla mängder i ett svep och behåll proportionerna. Skriv de nya mängderna bredvid de gamla så att du kan kontrollera arbetet. Ska du också skala receptet uppåt eller nedåt, räkna om först och skala sedan, så slipper du avrunda två gånger.`) + p('Att göra det för ett recept går bra. Att göra det för hundra sparade recept är varför många använder en app.')],
      ['Sluta räkna om för hand', MATLYST],
      ['Närliggande omvandlingar', relaterte(fra, til)],
    ],
  });
  const topp = `${enhetsKort('sv', fra, til)}\n<p class="kortsvar"><b>Kort svar:</b> ${esc(svar)}</p>`;
  const q = (a, b) => [a, b];
  const temp = g === 'temperatur';
  const faq = [
    q(`Hur många ${T.fl} är 1 ${F.en}?`, `1 ${F.en} är ${k(x)} ${T.fl}.`),
    q(`Hur många ${F.fl} är 1 ${T.en}?`, `1 ${T.en} är ${k(konverter(1, til, fra))} ${F.fl}.`),
    q(`Hur räknar jag om ${F.kort} till ${T.kort} utan räknare?`, `${stor(regelTekst(fra, til))}. Till exempel är ${val(exVal, fra)} lika med ${val(konverter(exVal, fra, til), til)}.`),
    q('Är omräkningen exakt?', temp ? 'Formeln är exakt. Recept avrundar oftast till närmaste 5 grader.' : 'Faktorn är exakt, men recept avrundar den ofta, till exempel 236,6 ml för en cup till 240 ml. Använd det avrundade talet bara när receptet är förlåtande.'),
    q(`Var används ${F.kort} och ${T.kort} i matlagning?`, `${stor(F.fl)} förekommer i ${BRUK[fra]}. ${stor(T.fl)} förekommer i ${BRUK[til]}.`),
    q(`Kan jag räkna om ${T.kort} tillbaka till ${F.kort}?`, `Ja. Använd knappen för att byta enheter i omvandlaren, eller öppna sidan för ${T.kort} till ${F.kort}. 1 ${T.en} är ${k(konverter(1, til, fra))} ${F.fl}.`),
    ...(medCups ? [[KOPP_BIORD.sammeSporsmal, KOPP_BIORD.sammeSvar]] : []),
    ...((fra === 'cups' && til === 'dl') || (fra === 'dl' && til === 'cups') ? [[KOPP_BIORD.dlSporsmal, KOPP_BIORD.dlSvar]] : []),
    q('Räknar Matlyst om enheter i recept?', 'När du importerar ett recept visar Matlyst mängderna metriskt eller behåller källans mängder, beroende på inställningen Enheter i Inställningar. Med Metriskt räknas cups, uns och pund om till milliliter och gram. Inställningen gäller nya importer.'),
  ];
  return {
    title: titelFor(F, T),
    description: beskrivningFor(F, T, kortSvar),
    eyebrow: 'Enhetsomvandlare',
    h1: likt ? `${stor(medKort(fra))} till ${medKort(til)}` : `${stor(F.fl)} till ${T.fl} (${F.kort} till ${T.kort})`,
    lead: `${stor(F.fl)} till ${T.fl}, med tabell, formel och det du bör se upp med i ett recept.`,
    forst: 'Skriv en mängd, välj enheter och läs av svaret.',
    stegTittel: `Så räknar du om ${F.fl} till ${T.fl}`,
    steg: [['Ange mängden', `Skriv antalet ${F.fl}.`], ['Kontrollera enheterna', `Se till att Från är ${F.fl} och Till är ${T.fl}.`], ['Läs av svaret', `Resultatet visas medan du skriver: ${kortSvar}.`]],
    alternativ: '', grense: '', seksjoner: [], faqTittel: `Frågor om ${F.kort} till ${T.kort}`, topp, rik, faq,
    cta: 'Räkna om recept i Matlyst',
  };
}

const enhetsHub = (() => {
  const gruppe = (g, tittel) => {
    const ids = gruppeIds(g);
    const rader = ids.map((a) => `<li><strong>${N(a).fl}</strong>: ${ids.filter((b) => b !== a).map((b) => `<a href="/sv/${parSti(a, b, 'sv')}">till ${N(b).kort}</a>`).join(', ')}</li>`).join('');
    return [tittel, `<ul>${rader}</ul>`];
  };
  return p('En gratis omvandlare för matlagning med alla kombinationer: milliliter, centiliter, deciliter, liter, kryddmått, teskedar, matskedar, cups, flytande uns, pints, quarts, gallon, gram, kilogram, uns, pund, millimeter, centimeter, tum och grader Celsius till Fahrenheit. Välj en omräkning nedan eller använd omvandlaren.') + p('Den här omvandlaren räknar volym. För vikt, längd och temperatur använder du listorna nedan.') + '\n' + byggLese({
    seksjoner: [
      gruppe('volum', 'Volym: ml, dl, cups, matskedar och mer'),
      gruppe('vekt', 'Vikt: gram, kilogram, uns och pund'),
      gruppe('lengde', 'Längd: cm, mm och tum för formar och deg'),
      gruppe('temperatur', 'Temperatur: Celsius och Fahrenheit'),
      ['Därför använder recept olika enheter', p('I Sverige lagar vi mat med gram, deciliter, matskedar, teskedar och kryddmått, och ugnen ställs in i Celsius. I USA mäts det mesta i cups och skedar, vikt anges i uns och pund och ugnen går på Fahrenheit. Ett recept du hittar på nätet kan vara skrivet i vilket system som helst, och därför sparar en bra omvandlare tid.')],
      ['Sluta räkna om för hand', p('När du importerar ett recept i Matlyst väljer du under <strong>Enheter</strong> i Inställningar om mängderna visas metriskt eller behålls som källan skrev dem. Med <strong>Metriskt</strong> räknas cups, uns och pund om till milliliter och gram vid import. Inställningen gäller nya importer. Ändra portionerna från 1 till 20 så följer alla mängder med, och alla ingredienser samlas i en inköpslista sorterad efter butiksavdelning.') + p('Matlyst är gratis att börja med, med 5 importer per kalendermånad. Läs mer om <a href="/sv/receptbok-app/">receptboksappen</a> och <a href="/sv/inkopslista/">inköpslistan</a>.')],
    ],
  });
})();

const hubSida = {
  title: 'Enhetsomvandlare för matlagning: dl, ml, cups, °F',
  description: 'Gratis enhetsomvandlare för matlagning med alla kombinationer: ml till dl, cup till ml, uns till g, pund till kg, °F till °C. Med tabeller och köksråd.',
  eyebrow: 'Enhetsomvandlare',
  h1: 'Enhetsomvandlare för matlagning',
  lead: 'Alla köksomräkningar på ett ställe, med en tabell och en omvandlare för var och en.',
  forst: 'Välj två enheter och läs av svaret.',
  stegTittel: 'Så använder du omvandlaren',
  steg: [['Välj enheterna', 'Välj den enhet receptet använder och den du vill ha.'], ['Skriv mängden', 'Svaret visas medan du skriver.'], ['Använd tabellen', 'Varje sida har en tabell med vanliga mängder.']],
  alternativ: '', grense: '', seksjoner: [], faqTittel: 'Frågor om enhetsomvandlaren', topp: enhetsKort('sv', 'cups', 'ml', { ids: gruppeIds('volum') }), rik: enhetsHub,
  faq: [
    ['Hur många ml är en cup?', 'En cup är 236,6 ml. Många recept avrundar till 240 ml, och många svenska recept avrundar till 2,4 dl.'],
    [KOPP_BIORD.sammeSporsmal, KOPP_BIORD.sammeSvar],
    ['Hur många ml är en matsked?', 'En svensk matsked är 15 ml. En amerikansk matsked är 14,8 ml, vilket recept oftast avrundar till 15 ml.'],
    ['Hur många ml är en tesked och ett kryddmått?', 'En tesked är 5 ml och ett kryddmått är 1 ml. En amerikansk tesked är 4,9 ml.'],
    ['Hur många gram är ett uns?', 'Ett uns är 28,35 gram. Flytande uns mäter volym i stället: ett amerikanskt flytande uns är 29,57 ml.'],
    ['Hur räknar jag om Fahrenheit till Celsius?', 'Dra av 32 och multiplicera sedan med 5/9. Till exempel är 350 °F cirka 177 °C.'],
    ['Hur många dl går på en liter?', 'Tio deciliter är en liter, och en deciliter är 100 ml.'],
    ['Räknar Matlyst om enheter i recept?', 'Med inställningen Enheter på Metriskt räknas cups, uns och pund från ett recept om till milliliter och gram vid import. Inställningen gäller nya importer.'],
  ],
  cta: 'Räkna om recept i Matlyst',
};

export const enhetsSiderSv = {
  ...Object.fromEntries(allePar('sv').map(([fra, til]) => [parSti(fra, til, 'sv'), sideForPar(fra, til)])),
  'verktyg/enhetsomvandlare/': hubSida,
};
export const enhetsStierSv = Object.keys(enhetsSiderSv);

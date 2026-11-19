// Enhetsomregnere på norsk (bokmål): én side per enhetspar (ml til dl, kopp til ml, °F til °C osv.) pluss en hub.
// Samme struktur som den engelske (en-enhetssider.mjs), men skrevet for norske kjøkken: dl, ss, ts og krm er førsteklasses enheter.
// Statisk tekst bruker desimalkomma og mellomrom som tusenskille; kalkulatoren (site.js) tar seg av tallene i nettleseren.
import { ENHETER, FLERTALL, allePar, enheterFor, konverter, omregnerData, parSti, tall } from './enheter.mjs';
import { byggRik } from './rik-sider.mjs';

const esc = (s) => String(s).replace(/&/gu, '&amp;').replace(/</gu, '&lt;').replace(/"/gu, '&quot;');
const p = (...ps) => ps.map((t) => `<p>${t}</p>`).join('');
const stor = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const N = (id) => ENHETER[id].nb;
const gruppeIds = (g) => enheterFor('nb').filter((id) => ENHETER[id].gruppe === g);
const href = (fra, til) => `/${parSti(fra, til, 'nb')}`;

/** Norsk tallformat: desimalkomma og hardt mellomrom som tusenskille. */
const k = (n) => {
  const [h, d] = tall(n).split('.');
  const hh = h.replace(/\B(?=(\d{3})+(?!\d))/gu, ' ');
  return d ? `${hh},${d}` : hh;
};
const er1 = (v) => Math.abs(v - 1) < 1e-9;
/** Ordet for en enhet ved en gitt mengde (kort skrivemåte, men «1 kopp» og «2 kopper»). */
const label = (v, id) => (FLERTALL.nb[id] ? FLERTALL.nb[id][er1(v) ? 0 : 1] : N(id).kort);
const val = (v, id) => `${k(v)} ${label(v, id)}`;
const enhetOrd = (v, id) => (er1(v) ? N(id).en : N(id).fl);

const VERDIER = {
  ml: [5, 10, 15, 25, 50, 75, 100, 150, 200, 250, 300, 500, 750, 1000], cl: [1, 2, 3, 5, 10, 15, 20, 25, 33, 50, 75, 100], dl: [0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 7.5, 10],
  l: [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 5, 10], krm: [1, 2, 3, 5], ts: [0.5, 1, 2, 3], ss: [0.5, 1, 2, 3, 4, 5, 6],
  tsp: [0.25, 0.5, 1, 1.5, 2, 3, 4], tbsp: [0.5, 1, 1.5, 2, 3, 4, 5, 6, 8], oz: [1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 32],
  cups: [0.25, 0.33, 0.5, 0.67, 0.75, 1, 1.5, 2, 2.5, 3, 4, 5, 8], pints: [0.5, 1, 2, 3, 4], quarts: [0.5, 1, 2, 3, 4], gallons: [0.25, 0.5, 1, 2, 3, 5],
  g: [5, 10, 25, 50, 100, 150, 200, 250, 500, 750, 1000], kg: [0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 5, 10], 'oz-vekt': [1, 2, 3, 4, 6, 8, 10, 12, 16, 24, 32], lb: [0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 4, 5, 10],
  mm: [1, 2, 5, 10, 15, 20, 25, 30], cm: [5, 10, 15, 18, 20, 22, 23, 24, 25, 26, 28, 30, 35], inches: [1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 13, 14],
  c: [100, 120, 150, 160, 175, 180, 190, 200, 210, 220, 225, 250], f: [250, 275, 300, 325, 350, 375, 400, 425, 450, 475, 500],
};

// Hvor enheten dukker opp (til generisk kjøkkennotat). Setter inn etter «brukes i».
const BRUK = {
  ml: 'metriske oppskrifter, målebeger og de fleste oppskrifter fra utlandet', cl: 'drikke, cocktailer og enkelte oppskrifter fra Europa',
  dl: 'norske oppskrifter, der desiliter er det vanligste målet for både væske og tørrvarer', l: 'kraft, suppe, melk og alt som lages i store gryter',
  krm: 'norske oppskrifter for små mengder krydder, salt og bakepulver', ts: 'norske oppskrifter for krydder, bakepulver og små mengder av det meste', ss: 'norske oppskrifter for olje, sauser, smør og mel',
  tsp: 'amerikanske oppskrifter for krydder, bakepulver, ekstrakter og små mengder av det meste', tbsp: 'amerikanske oppskrifter for olje, sauser, smør og mel',
  oz: 'amerikanske oppskrifter for væske og på amerikanske drikke- og sauseemballasjer', cups: 'amerikanske oppskrifter, der de fleste ingredienser måles i volum',
  pints: 'amerikanske oppskrifter for fløte, iskrem og bær', quarts: 'amerikanske oppskrifter for kraft, suppe og meieriprodukter', gallons: 'amerikansk melk, vann og matlaging i store mengder',
  g: 'norske oppskrifter, kjøkkenvekter og næringsdeklarasjoner', kg: 'norske oppskrifter for kjøtt, poteter, mel og storhandel',
  'oz-vekt': 'amerikanske oppskrifter og emballasje for kjøtt, ost, sjokolade og hermetikk', lb: 'amerikanske oppskrifter og dagligvareemballasje for kjøtt, grønnsaker og mel',
  mm: 'tykkelsen på deig og fine kutt', cm: 'bakeformer, deigtykkelse og skjæring i norske oppskrifter', inches: 'størrelser på amerikanske bakeformer og tykkelse på deig',
  c: 'oppskrifter og ovner i Norge og resten av Europa', f: 'amerikanske oppskrifter og de fleste amerikanske ovner',
};

// Kort om hva enheten er (definisjoner).
const DEF = {
  ml: '1 ml er en tusendel liter.', cl: '1 cl er 10 ml.', dl: '1 dl er 100 ml, altså en tidel liter.', l: '1 l er 1000 ml, eller 10 dl.',
  krm: '1 krm er 1 ml.', ts: '1 ts er 5 ml.', ss: '1 ss er 15 ml.',
  tsp: 'En amerikansk teskje er 4,93 ml, som oppskrifter avrunder til 5 ml.', tbsp: 'En amerikansk spiseskje er 14,8 ml, som oppskrifter avrunder til 15 ml.',
  oz: 'En amerikansk væskeunse er 29,57 ml.', cups: 'En amerikansk kopp er 236,6 ml, eller 8 væskeunser.', pints: 'En amerikansk pint er 473,2 ml, eller 16 væskeunser.',
  quarts: 'En amerikansk quart er 946,4 ml, eller to pints.', gallons: 'En amerikansk gallon er 3,785 liter, eller fire quarts.',
  g: '1 g er en tusendel kilo.', kg: '1 kg er 1000 g.', 'oz-vekt': 'En unse (vekt) er 28,35 g.', lb: 'Et pund er 453,6 g, eller 16 unser.',
  mm: '1 mm er en tidel centimeter.', cm: '1 cm er 10 mm.', inches: 'En tomme er 2,54 cm, eller 25,4 mm.',
  c: 'Vann fryser ved 0 °C og koker ved 100 °C.', f: 'Vann fryser ved 32 °F og koker ved 212 °F.',
};

// Håndskrevne notater for de mest brukte parene (nøkkel «fra>til»).
const NOTE = {
  'ml>dl': 'Desiliter er hverdagsmålet i norske oppskrifter, så 2 dl melk er det samme som 200 ml. Mange målebeger viser begge deler, slik at du kan lese av dl-streken direkte.',
  'dl>ml': 'Står det 3 dl i oppskriften, betyr det 300 ml. Har målebegeret bare milliliter, ganger du med 100 og heller opp til den streken.',
  'ml>l': 'Tusen milliliter er én liter. 750 ml er altså 0,75 l, og 1500 ml er 1,5 l. Det er greit å vite når en oppskrift oppgir kraft i ml og kjelen din har liter-merker.',
  'l>ml': 'Én liter er 1000 ml. Oppskrifter på suppe og kraft oppgir ofte liter, mens små mengder av for eksempel olje og eddik står i ml.',
  'l>dl': 'Én liter er 10 dl. En oppskrift på 0,75 l kraft betyr 7,5 dl, og en halv liter er 5 dl.',
  'dl>l': 'Ti desiliter er én liter. 25 dl vann er altså 2,5 l, noe du ofte trenger når du lager en stor gryte.',
  'cl>ml': 'Én centiliter er 10 ml. Centiliter finner du først og fremst i drikkeoppskrifter og på flasker, der 4 cl er en vanlig dram.',
  'ml>cl': 'Del milliliter på 10 for å få centiliter. 40 ml er 4 cl, og 150 ml er 15 cl.',
  'cl>dl': 'Ti centiliter er én desiliter. En oppskrift som oppgir 25 cl fløte, trenger altså 2,5 dl.',
  'dl>cl': 'Én desiliter er 10 cl. Ganger du desiliter med 10, får du centiliter.',
  'krm>ml': 'Ett kryddermål er 1 ml, altså en femtedel teskje. Det er en liten klype eller en spiss av en målesje, og mengden er ment å være omtrentlig.',
  'ml>krm': 'Én milliliter er ett kryddermål. For slike små mengder er det enklest å måle med kryddermålet eller teskje i stedet for et målebeger.',
  'krm>ts': 'Fem kryddermål er én teskje. Har du bare teskje, regner du ett kryddermål som en femtedel av den.',
  'ts>krm': 'En teskje er fem kryddermål. Står det 2 krm i oppskriften, er det to femtedeler av en teskje.',
  'ts>ml': 'En teskje er 5 ml. Bruk en målesje og stryk av, ikke teskjeen fra bestikkskuffen, for den varierer mye i størrelse.',
  'ml>ts': 'Fem milliliter er én teskje. 10 ml er 2 ts. For små mengder krydder og bakepulver er målesjeer mer presise enn et målebeger.',
  'ss>ml': 'En spiseskje er 15 ml i norske oppskrifter. Tre teskjeer gir den samme mengden, så du kan bytte mellom dem uten å regne lenge.',
  'ml>ss': 'Femten milliliter er én spiseskje. 45 ml er 3 ss, og 100 ml er litt over 6 ss.',
  'ss>ts': 'Det går tre teskjeer på en spiseskje. Det er den enkleste måten å skalere en kryddermengde opp eller ned.',
  'ts>ss': 'Tre teskjeer er én spiseskje. Fire teskjeer er altså én spiseskje og én teskje.',
  'ss>dl': 'Én spiseskje er 0,15 dl. Det går litt over seks spiseskjeer på en desiliter, så en oppskrift med 1 dl og 6 ss er ikke helt det samme.',
  'dl>ss': 'Én desiliter er 6,7 spiseskjeer, som du i praksis kan runde til 6 til 7 ss. Ønsker du presise mengder, kan du måle i ml.',
  'ts>tsp': 'En norsk teskje er 5 ml og en amerikansk er 4,93 ml. Forskjellen er så liten at du kan bruke dem om hverandre.',
  'tsp>ts': 'En amerikansk teskje er 4,93 ml, mens norske oppskrifter regner 5 ml. I praksis er det samme mengde, og du kan bruke samme målesje.',
  'ss>tbsp': 'En norsk spiseskje er 15 ml og en amerikansk er 14,8 ml. Det er ikke noe å bry seg om i vanlig matlaging.',
  'tbsp>ss': 'En amerikansk spiseskje er 14,8 ml, mens norske oppskrifter regner 15 ml. Det kan du se bort fra i vanlig matlaging.',
  'cups>ml': 'Amerikanske oppskrifter måler med kopp, men en amerikansk kopp er ikke koppen du har i skapet. Den er 236,6 ml, og mange oppskrifter runder av til 2,4 dl. Til baking er det sikrere å veie enn å måle i volum.',
  'ml>cups': 'Er en oppskrift skrevet i milliliter og du bare har amerikanske målekopper, deler du på 236,6. 250 ml er litt mer enn én amerikansk kopp.',
  'cups>dl': 'En amerikansk kopp er 2,37 dl, og oppskrifter runder ofte av til 2,4 dl. Står det 2,5 dl i en norsk oppskrift, er det litt mer enn en amerikansk kopp, og i suppe og gryte spiller forskjellen liten rolle.',
  'dl>cups': 'Del desiliter på 2,366 for å få amerikanske kopper. Tre desiliter er ca. 1,27 kopper, altså én og en kvart kopp i de fleste oppskrifter.',
  'cups>l': 'En amerikansk kopp er 0,237 liter. Fire kopper er litt under en liter, noe som er greit å huske når du skal lage en stor porsjon suppe.',
  'l>cups': 'Én liter er litt over fire amerikanske kopper (4,23). Skal du lage en oppskrift for én liter kraft, trenger du altså litt mer enn fire kopper.',
  'cups>tbsp': 'Det går 16 amerikanske spiseskjeer på én kopp. En kvart kopp er 4 spiseskjeer, og en tredjedel kopp er litt over 5.',
  'tbsp>ml': 'En amerikansk spiseskje er 14,8 ml, og de fleste oppskrifter runder av til 15 ml. I Australia er en spiseskje 20 ml, så sjekk hvor oppskriften kommer fra før du regner om.',
  'ml>tbsp': 'Små mengder væske i metriske oppskrifter blir spiseskjeer i amerikanske. 15 ml er ca. én amerikansk spiseskje.',
  'tsp>ml': 'En amerikansk teskje er 4,9 ml, som oppskrifter runder av til 5 ml. Bruk en målesje og stryk av, ikke teskjeen fra bestikkskuffen.',
  'ml>tsp': 'Fem milliliter er ca. én amerikansk teskje. For små mengder krydder og ekstrakter er målesje mer presist enn målebeger.',
  'tbsp>tsp': 'Det går tre teskjeer på én amerikansk spiseskje. Det er den enkleste måten å skalere en kryddermengde opp eller ned.',
  'tsp>tbsp': 'Tre teskjeer er én amerikansk spiseskje. Fire teskjeer er én spiseskje og én teskje.',
  'oz>ml': 'Denne siden regner om væskeunser, som er et volummål. En amerikansk væskeunse er 29,57 ml. Unser på en melpakke eller en ostebit måler vekt, så bruk omregneren fra unser til gram for dem.',
  'ml>oz': 'Milliliter til amerikanske væskeunser: del på 29,57. 250 ml er ca. 8,5 fl oz. Væskeunser måler volum, mens unser på pakket mat måler vekt.',
  'oz>cups': 'En amerikansk kopp rommer 8 væskeunser, så 16 fl oz er 2 kopper. Dette er volum, ikke vekt: en kopp mel veier ikke det samme som en kopp vann.',
  'cups>oz': 'Én amerikansk kopp er 8 væskeunser. Bruk dette for væske. For tørrvarer er kopper og unser vekt to helt ulike mål.',
  'pints>ml': 'En amerikansk pint er 473,2 ml, altså to amerikanske kopper. Britiske (imperial) pints er større enn amerikanske, så sjekk hvor oppskriften kommer fra.',
  'pints>cups': 'En amerikansk pint er to amerikanske kopper eller 16 væskeunser. Det samme gjelder pints av fløte og iskrem i amerikanske butikker.',
  'quarts>l': 'En amerikansk quart er 0,946 liter, litt under en liter. Fire quarts er én gallon. Britiske quarts er større enn amerikanske.',
  'gallons>l': 'En amerikansk gallon er 3,785 liter. En britisk (imperial) gallon er større, så en gallon i en britisk oppskrift er ikke det samme som i en amerikansk.',
  'l>gallons': 'Liter til amerikanske gallon: del på 3,785. En gryte på 4 liter rommer litt mer enn én gallon.',
  'oz-vekt>g': 'En unse (vekt) er 28,35 gram, så 4 oz er ca. 113 g og 8 oz er ca. 227 g. Det er tallet du trenger for smør, ost, sjokolade og kjøtt i amerikanske oppskrifter.',
  'g>oz-vekt': 'Gram til unser: del på 28,35. 100 g er ca. 3,5 oz, og 250 g er ca. 8,8 oz. Bruk helst kjøkkenvekt, som er mer presis enn målebeger.',
  'lb>g': 'Et pund er 453,6 gram. En oppskrift på ett pund kjøttdeig trenger ca. 450 g, som er vanlig pakkestørrelse i norske butikker.',
  'g>lb': 'Gram til pund: del på 453,6. 500 g er ca. 1,1 lb. Butikker i land som bruker pund, selger ofte pakker på 1 lb der norske butikker selger 450 g eller 500 g.',
  'lb>kg': 'Et pund er 0,4536 kilo. To pund er litt over 900 g, og derfor er en pakke på 1 kg litt mer enn 2 lb.',
  'kg>lb': 'Kilo til pund: gang med 2,205. En kylling på 1,5 kg er ca. 3,3 lb, som er greit å vite når en amerikansk oppskrift oppgir kylling i pund.',
  'lb>oz-vekt': 'Det går 16 unser på ett pund. Et halvt pund er 8 oz, og et kvart pund er 4 oz.',
  'oz-vekt>lb': 'Seksten unser er ett pund. 8 oz er et halvt pund, og 4 oz er et kvart pund.',
  'kg>g': 'Ett kilo er 1000 gram. 1,5 kg er 1500 g, og 0,25 kg er 250 g.',
  'g>kg': 'Tusen gram er ett kilo. 500 g er et halvt kilo, og 1500 g er 1,5 kg.',
  'inches>cm': 'En tomme er nøyaktig 2,54 centimeter. En kakeform på 9 tommer er ca. 23 cm og en på 8 tommer er ca. 20 cm, som er de vanligste størrelsene i oppskrifter.',
  'cm>inches': 'Centimeter til tommer: del på 2,54. En form på 20 cm er ca. 8 tommer, og en på 30 cm er ca. 12 tommer.',
  'cm>mm': 'Én centimeter er 10 mm. 2,5 cm er 25 mm, noe du bruker når du skal kjevle deig til riktig tykkelse.',
  'mm>cm': 'Ti millimeter er én centimeter. 5 mm er 0,5 cm, og 25 mm er 2,5 cm.',
  'f>c': 'De fleste amerikanske ovner og oppskrifter bruker fahrenheit. 350 °F er 177 °C, som norske oppskrifter gjerne runder av til 175 eller 180 °C. Ovn med varmluft trenger ofte lavere temperatur, så sjekk også bruksanvisningen til ovnen din.',
  'c>f': 'Celsius til fahrenheit: gang med 9/5 og legg til 32. 180 °C er 356 °F, som amerikanske oppskrifter runder av til 350 °F. Forvarm alltid ovnen helt før du baker.',
};

const FEIL = {
  volum: ['Å bruke en kaffekopp som målekopp. Koppen i skapet har sjelden samme størrelse som en målekopp, mens en amerikansk kopp er 236,6 ml.', 'Å blande væskeunser og unser. Væskeunser måler volum, mens unser på en pakke måler vekt.', 'Å tro at amerikansk og britisk pint, quart og gallon er like. De britiske er større.', 'Å avrunde for tidlig. Regn om hele oppskriften først, og rund av til slutt.', 'Å måle tørrvarer i et målebeger for væske. Mel og sukker pakker seg, og du får for mye.', 'Å bruke skjeen fra bestikkskuffen i stedet for en målesje. Størrelsen varierer mye fra skje til skje.'],
  vekt: ['Å lese unser på pakken som væskeunser. Vekt og volum er ulike mål.', 'Å bruke kopper til mel og vente samme antall gram hver gang. Øser du mel rett fra posen, pakker det seg. Skjer du det i målebegeret og stryker av, blir det mindre.', 'Å runde et pund til 500 g når oppskriften er følsom, som brødbaking. Et pund er 454 g.', 'Å glemme å nullstille vekten etter at bollen er satt på.', 'Å regne om én ingrediens og ikke resten, slik at forholdene mellom dem forskyves.'],
  lengde: ['Å måle formen utenpå kanten i stedet for på innsiden.', 'Å bytte en form på 9 tommer med en på 20 cm uten å sjekke. Arealet er ikke det samme.', 'Å glemme at en dypere form trenger lengre steketid.', 'Å lese mm som cm når du kjevler deig.', 'Å ikke runde av til en formstørrelse du faktisk kan kjøpe.'],
  temperatur: ['Å bruke celsius-tallet på en ovn som viser fahrenheit. Da blir det alt for kaldt.', 'Å glemme at en ovn med varmluft ofte trenger lavere temperatur.', 'Å stole på ovnens knapp i stedet for et ovnstermometer.', 'Å åpne ovnsdøren for ofte. Temperaturen faller raskt.', 'Å regne om en oppskrift som oppgir gassmerke uten å sjekke din egen ovn.'],
};

const MAALETIPS = {
  volum: p('Bruk et målebeger for væske og strykemål for tørre ingredienser. Les av målebegeret i øyehøyde på et flatt underlag, og stryk av skjeer og kopper med baksiden av en kniv. Amerikanske, britiske og australske mål med samme navn er ikke alltid like store, så sjekk hvor oppskriften kommer fra.'),
  vekt: p('En kjøkkenvekt slår alle målekopper, særlig for mel og sukker. Sett bollen på vekten, nullstill den og hell i ingrediensen. Har du bare kopper, husk at en kopp mel og en kopp sukker ikke veier det samme.'),
  lengde: p('Mål formen på tvers, fra innside til innside av kanten, ikke over den ytre kanten. En form som er én størrelse unna, endrer steketiden, så sjekk kaken tidligere hvis formen din er større enn oppskriften sier.'),
  temperatur: p('Ovnens knapp viser ikke alltid riktig temperatur. Et rimelig ovnstermometer forteller deg hva som faktisk skjer inni. Ovner med varmluft steker raskere, så mange oppskrifter anbefaler lavere temperatur når du bruker varmluft.'),
};
const MENTAL = {
  volum: 'Et raskt anslag: en amerikansk kopp er litt under 2,5 dl, og en liter er litt over fire amerikanske kopper. Bruk kalkulatoren for alt du skal helle i en bolle.',
  vekt: 'Et raskt anslag: et pund er litt under et halvt kilo, og ett kilo er litt over to pund. En unse er ca. 28 gram.',
  lengde: 'Et raskt anslag: en tomme er ca. to og en halv centimeter, og en form på 9 tommer er ca. 23 cm.',
  temperatur: 'Noen faste punkter som går igjen i oppskrifter: 180 °C er ca. 350 °F, 200 °C er ca. 400 °F og 220 °C er ca. 425 °F. Bruk kalkulatoren når det skal være nøyaktig.',
};
const UTVID = {
  volum: p('Skal du regne om en hel oppskrift fra amerikansk til norsk, er det lurt å begynne med de store mengdene, som væske og mel, og ta skjeene til slutt. Små mengder tåler avrunding, mens feilen vokser når mengden blir stor. Står oppskriften både i kopper og gram, er gramtallet nesten alltid mest pålitelig, fordi det ikke avhenger av hvordan du fyller målebegeret.', 'Mål gjerne opp en kjent mengde vann i beholderen din én gang, så vet du hva den faktisk rommer. Det er en rask måte å teste om koppene dine er amerikanske, europeiske eller noe helt annet.'),
  vekt: p('Veier du ingrediensene, slipper du å tenke på hvor tett mel er pakket eller hvor høyt du hoper skjeen. Derfor gir baking etter vekt mer like resultater fra gang til gang.', 'Når du regner om til gram, runder du av til hele gram for små mengder og til nærmeste 5 eller 10 for større mengder. Mer presisjon enn det gir kjøkkenvekten sjelden, og oppskriften krever det sjelden.'),
  lengde: p('Formstørrelsen styrer både steketid og tykkelse på kaken. Bytter du form, regn ut arealet, ikke bare bredden: en rund form på 20 cm har et areal på ca. 314 cm², og en på 23 cm har ca. 415 cm². Den største formen rommer altså ca. en tredjedel mer deig ved samme høyde.', 'Tykkelsen på utkjevlet deig og skårne grønnsaker oppgis gjerne i millimeter eller tommer. Ha en linjal på kjøkkenet, så slipper du å anslå. Tykkelse påvirker både steketid og konsistens, så et lite avvik merkes oftere enn du tror.'),
  temperatur: p('Oppskrifter i fahrenheit er ofte skrevet i trinn på 25 grader. Omregnede tall får derfor ofte desimaler, som 176,7 °C. Rund av til nærmeste 5 grader, for de fleste ovner lar seg ikke stille inn mer presist.', 'Står det en temperatur i oppskriften uten enhet, kan tallet røpe hvor den kommer fra: tall rundt 350 til 450 er nesten alltid fahrenheit, mens 160 til 230 er celsius. Steketid og temperatur henger sammen, så regn om begge før du setter i gang.'),
};
const EKSTRASPORSMAL = {
  volum: ['Er amerikanske og britiske mål like?', 'Nei. Britiske (imperial) pint og gallon er større enn de amerikanske. Sjekk hvor oppskriften kommer fra før du regner om.'],
  vekt: ['Er unser på pakken det samme som væskeunser?', 'Nei. Unser på pakket mat måler vekt og er 28,35 g. Væskeunser måler volum og er 29,57 ml.'],
  lengde: ['Hvordan måler jeg en kakeform riktig?', 'Mål på tvers fra innside til innside av kanten. En form som er målt utenpå, ser større ut enn den er.'],
  temperatur: ['Hva med ovn med varmluft?', 'Ovner med varmluft steker raskere, så mange oppskrifter anbefaler lavere temperatur. Regn om temperaturen først, og sjekk deretter bruksanvisningen til ovnen din.'],
};

function regelTekst(fra, til) {
  const a = ENHETER[fra]; const b = ENHETER[til];
  if (a.gruppe === 'temperatur') return fra === 'f' ? 'trekk fra 32, og gang så med 5/9' : 'gang med 9/5, og legg så til 32';
  const x = a.f / b.f;
  if (x >= 1) return `gang med ${k(x)}`;
  const inv = b.f / a.f;
  const rundt = Math.abs(inv - Math.round(inv)) < 1e-9;
  return rundt ? `del på ${k(inv)}` : `gang med ${k(x)} (eller del på ${k(inv)})`;
}

function formel(fra, til) {
  const x = konverter(1, fra, til);
  if (ENHETER[fra].gruppe === 'temperatur') return fra === 'f' ? '°C = (°F - 32) × 5/9' : '°F = °C × 9/5 + 32';
  return `${N(til).kort} = ${N(fra).kort} × ${k(x)}`;
}

function skjema(fra, til, ids = gruppeIds(ENHETER[fra].gruppe)) {
  const g = ENHETER[fra].gruppe;
  const data = Object.fromEntries(ids.map((id) => [id, g === 'temperatur' ? 0 : ENHETER[id].f]));
  const opt = (valgt) => ids.map((id) => `<option value="${id}"${id === valgt ? ' selected' : ''}>${esc(stor(N(id).fl))} (${esc(N(id).kort)})</option>`).join('');
  const svar = `1 ${label(1, fra)} = ${val(konverter(1, fra, til), til)}`;
  return `<form class="omregner" data-gruppe="${g}" onsubmit="return false"><div class="omregner-rad">`
    + `<label>Mengde<input type="number" inputmode="decimal" step="any" value="1" data-felt="verdi"></label>`
    + `<label>Fra<select data-felt="fra">${opt(fra)}</select></label>`
    + `<button type="button" class="omregner-bytt" data-handling="bytt" aria-label="Bytt enheter">⇄</button>`
    + `<label>Til<select data-felt="til">${opt(til)}</select></label></div>`
    + `<p class="omregner-svar" role="status" aria-live="polite" data-felt="svar">${esc(svar)}</p>`
    + `<script type="application/json" class="omregner-data">${JSON.stringify(omregnerData('nb', data, g === 'temperatur'))}</script></form>`;
}

function tabell(fra, til) {
  const rader = (VERDIER[fra] ?? [1, 2, 5, 10]).map((v) => `<tr><td>${val(v, fra)}</td><td>${val(konverter(v, fra, til), til)}</td></tr>`).join('');
  return `<div class="table-wrap"><table><thead><tr><th>${esc(stor(N(fra).fl))}</th><th>${esc(stor(N(til).fl))}</th></tr></thead><tbody>${rader}</tbody></table></div>`;
}

function eksempelVerdier(fra) {
  const v = (VERDIER[fra] ?? [1, 2, 5]).filter((x) => x >= 1);
  return v.length >= 4 ? v.slice(1, 4) : (v.length ? v.slice(0, 3) : [1, 2, 5]);
}
function eksempler(fra, til) {
  return `<ul>${eksempelVerdier(fra).map((v) => `<li><strong>${val(v, fra)}</strong> = ${val(konverter(v, fra, til), til)}</li>`).join('')}</ul>`;
}

function relaterte(fra, til) {
  const par = allePar('nb');
  const sammeFra = par.filter(([a, b]) => a === fra && b !== til).slice(0, 5);
  const sammeTil = par.filter(([a, b]) => b === til && a !== fra).slice(0, 5);
  const alle = [[til, fra], ...sammeFra, ...sammeTil];
  return `<ul class="omregner-liste">${alle.map(([a, b]) => `<li><a href="${href(a, b)}">${esc(N(a).kort)} til ${esc(N(b).kort)}</a>: ${esc(N(a).fl)} til ${esc(N(b).fl)}</li>`).join('')}</ul>`;
}

const MATLYST = p('Å regne om for hånd blir fort slitsomt, særlig når en hel oppskrift står i feil enheter. Når du importerer en oppskrift i Matlyst, velger du i Innstillinger under <strong>Enheter</strong> om mengdene vises <strong>Metrisk</strong>, eller beholdes slik kilden skrev dem (<strong>Amerikansk</strong>). Med Metrisk regnes cups, unser og pund fra en amerikansk oppskrift om til milliliter og gram ved import. Innstillingen gjelder nye importer.')
  + '<ul><li><strong>Importer én gang, uten regning.</strong> Del en oppskrift fra Instagram, TikTok eller en nettside med Matlyst, og sjekk utkastet før du lagrer.</li><li><strong>Regn om porsjonene.</strong> Endre fra 1 til 20 porsjoner, så følger alle mengdene med. Omregningen er lineær, så sjekk bakst og krydder selv.</li><li><strong>Én handleliste.</strong> Ingrediensene samles i én handleliste, sortert etter butikkavdeling.</li></ul>'
  + p('Matlyst er gratis å starte med, med 5 importer per kalendermåned. Les mer om <a href="/oppskriftsbok-app/">oppskriftsappen</a>, eller se hvordan <a href="/handleliste/">handlelisten</a> fungerer.');

const HELOPPSKRIFT = (F, T) => p(`Når en oppskrift står i ${F.fl} og du lager mat i ${T.fl}, regner du om alle mengdene i én runde og holder forholdene mellom dem uendret. Skriv de nye mengdene ved siden av de gamle, så kan du kontrollere underveis. Skal du også skalere oppskriften opp eller ned, regner du først om enhetene og skalerer etterpå, slik at du ikke avrunder to ganger.`)
  + p('Å gjøre dette for én oppskrift går fint. Å gjøre det for hundre lagrede oppskrifter er grunnen til at mange bruker en app.');

export function sideForPar(fra, til) {
  const F = N(fra); const T = N(til);
  const x = konverter(1, fra, til);
  const y = konverter(1, til, fra);
  const g = ENHETER[fra].gruppe;
  const svar = `1 ${label(1, fra)} = ${val(x, til)}. Skal du regne om ${F.fl} til ${T.fl}, ${regelTekst(fra, til)}.`;
  const note = NOTE[`${fra}>${til}`] ?? `${stor(F.fl)} brukes i ${BRUK[fra]}. ${stor(T.fl)} brukes i ${BRUK[til]}. Derfor regner du om hver gang en oppskrift er skrevet for ett system og redskapene dine følger et annet.`;
  const rik = byggRik({
    lang: 'nb',
    svarTekst: svar,
    seksjoner: [
      [`Kalkulator: ${F.fl} til ${T.fl}`, skjema(fra, til)],
      [`Omregningstabell: ${F.kort} til ${T.kort}`, p('Tallene under er de oppskrifter bruker mest. Finn mengden din i kolonnen til venstre.') + tabell(fra, til)],
      [`Slik regner du om ${F.fl} til ${T.fl}`, p(`Regelen: ${regelTekst(fra, til)}. Som formel: ${formel(fra, til)}. Motsatt vei gjelder: ${regelTekst(til, fra)}.`) + p('Tre raske eksempler:') + eksempler(fra, til)],
      [`Hvor oppskrifter bruker ${F.fl} og ${T.fl}`, p(note) + p(`Kort om enhetene: ${DEF[fra]} ${DEF[til]}`)],
      ['Tips til måling', MAALETIPS[g] + p(MENTAL[g]) + UTVID[g]],
      ['Vanlige feil ved omregning', `<ul>${FEIL[g].map((t) => `<li>${t}</li>`).join('')}</ul>`],
      ['Regn om en hel oppskrift', HELOPPSKRIFT(F, T)],
      ['Slutt å regne om for hånd', MATLYST],
      ['Beslektede omregninger', relaterte(fra, til)],
    ],
  }).html;
  const [ev] = eksempelVerdier(fra).slice(0, 1);
  const q = (a, b) => [a, b];
  const faq = [
    q(`Hvor mange ${T.fl} er 1 ${F.en}?`, `1 ${F.en} er ${val(x, til)}.`),
    q(`Hvor mange ${F.fl} er 1 ${T.en}?`, `1 ${T.en} er ${val(y, fra)}.`),
    q(`Hvordan regner jeg om ${F.kort} til ${T.kort} uten kalkulator?`, `${stor(regelTekst(fra, til))}. For eksempel er ${val(ev, fra)} det samme som ${val(konverter(ev, fra, til), til)}.`),
    q('Er omregningen eksakt?', g === 'temperatur' ? 'Formelen er eksakt. Oppskrifter runder vanligvis av til nærmeste 5 grader.' : 'Faktoren er eksakt, men oppskrifter runder den ofte av, for eksempel 236,6 ml for en amerikansk kopp til 240 ml. Bruk den avrundede verdien bare når oppskriften tåler det.'),
    q(`Hva brukes ${F.kort} til i matlaging?`, `${stor(F.fl)} brukes i ${BRUK[fra]}. ${stor(T.fl)} brukes i ${BRUK[til]}.`),
    q(`Kan jeg regne om ${T.kort} tilbake til ${F.kort}?`, `Ja. Bruk bytteknappen i kalkulatoren, eller åpne siden for ${T.kort} til ${F.kort}. 1 ${T.en} er ${val(y, fra)}.`),
    EKSTRASPORSMAL[g],
    q('Regner Matlyst om enheter i oppskrifter?', 'Når du importerer en oppskrift, kan mengdene vises metrisk eller beholdes slik kilden skrev dem, avhengig av innstillingen Enheter i Innstillinger. Med Metrisk regnes cups, unser og pund om til milliliter og gram. Innstillingen gjelder nye importer.'),
  ];
  // Tittel: «Regn om kort til kort: fl til fl», forkortet om den blir for lang.
  const langTittel = `Regn om ${F.kort} til ${T.kort}: ${F.fl} til ${T.fl}`;
  const title = langTittel.length <= 60 ? langTittel : `Regn om ${F.kort} til ${T.kort}`;
  const kortSvar = `1 ${label(1, fra)} = ${val(x, til)}`;
  const descKand = [
    `Regn om ${F.fl} til ${T.fl} med en gratis kalkulator. ${kortSvar}. Med tabell, formel og tips til kjøkkenet.`,
    `Regn om ${F.kort} til ${T.kort} med en gratis kalkulator. ${kortSvar}. Med tabell, formel og tips til kjøkkenet.`,
    `Regn om ${F.kort} til ${T.kort} med gratis kalkulator. ${kortSvar}. Tabell, formel og tips til kjøkkenet.`,
    `Regn om ${F.fl} til ${T.fl}: ${kortSvar}. Gratis kalkulator med tabell, formel og tips.`,
  ];
  const description = descKand.find((d) => d.length >= 100 && d.length <= 160) ?? descKand[2];
  return {
    title,
    description,
    eyebrow: 'Enhetsomregner',
    h1: `${stor(F.fl)} til ${T.fl} (${F.kort} til ${T.kort})`,
    lead: `${stor(F.fl)} til ${T.fl}, med tabell, formel og tips til hva du bør passe på i en oppskrift.`,
    forst: 'Skriv inn en mengde, velg enhetene og les av svaret.',
    stegTittel: `Slik regner du om ${F.fl} til ${T.fl}`,
    steg: [['Skriv inn mengden', `Skriv inn antall ${F.fl}.`], ['Sjekk enhetene', `Kontroller at Fra er ${F.fl} og Til er ${T.fl}.`], ['Les av svaret', `Svaret vises mens du skriver: ${kortSvar}.`]],
    alternativ: '', grense: '', seksjoner: [], faqTittel: `Spørsmål om ${F.kort} til ${T.kort}`, rik, faq,
    cta: 'Regn om oppskrifter i Matlyst',
  };
}

const enhetsHub = (() => {
  const gruppe = (g, tittel) => {
    const ids = gruppeIds(g);
    const rader = ids.map((a) => `<li><strong>${esc(stor(N(a).fl))}</strong>: ${ids.filter((b) => b !== a).map((b) => `<a href="${href(a, b)}">til ${esc(N(b).kort)}</a>`).join(', ')}</li>`).join('');
    return [tittel, `<ul>${rader}</ul>`];
  };
  return byggRik({
    lang: 'nb',
    svarTekst: 'En gratis omregner for matlaging, med alle kombinasjoner: milliliter, desiliter, liter, kryddermål, teskjeer, spiseskjeer, amerikanske kopper, væskeunser, pints, quarts og gallon, gram, kilo, unser, pund, centimeter, tommer og °C til °F. Velg en omregning under, eller bruk kalkulatoren.',
    seksjoner: [
      ['Regn om alle kjøkkenmål', skjema('cups', 'ml', gruppeIds('volum')) + p('Kalkulatoren her regner om volum. For vekt, lengde og temperatur bruker du listene under.')],
      gruppe('volum', 'Volum: ml, dl, ss, ts, kopper og mer'),
      gruppe('vekt', 'Vekt: gram, unser og pund'),
      gruppe('lengde', 'Lengde: cm, mm og tommer til former og deig'),
      gruppe('temperatur', 'Temperatur: celsius og fahrenheit'),
      ['Hvorfor oppskrifter bruker ulike enheter', p('I Norge måler vi med desiliter, spiseskjeer og teskjeer, og veier mye i gram og kilo. 1 dl er 100 ml, 1 ss er 15 ml, 1 ts er 5 ml og 1 krm er 1 ml. USA måler det meste i volum, med kopper og skjeer, og bruker unser og pund for vekt. En oppskrift du finner på nett kan være skrevet i hvilket som helst av systemene, og da sparer du tid på en god omregner.')],
      ['Slutt å regne om for hånd', MATLYST],
    ],
  }).html;
})();

export const enhetsSiderNb = {
  ...Object.fromEntries(allePar('nb').map(([fra, til]) => [parSti(fra, til, 'nb'), sideForPar(fra, til)])),
  'verktoy/enhetsomregner/': {
    title: 'Enhetsomregner for mat: dl, ml, kopper, gram og °F',
    description: 'Gratis enhetsomregner for matlaging: dl til ml, kopper til ml, unser til gram, pund til kilo, °F til °C og mer, med tabeller og tips til kjøkkenet.',
    eyebrow: 'Enhetsomregner',
    h1: 'Enhetsomregner for matlaging',
    lead: 'Alle kjøkkenmål samlet, med tabell og kalkulator for hver omregning.',
    forst: 'Velg to enheter og les av svaret.',
    stegTittel: 'Slik bruker du omregneren',
    steg: [['Velg enhetene', 'Velg enheten oppskriften bruker og enheten du vil ha.'], ['Skriv inn mengden', 'Svaret vises mens du skriver.'], ['Bruk tabellen', 'Hver side har en tabell med de vanligste mengdene.']],
    alternativ: '', grense: '', seksjoner: [], faqTittel: 'Spørsmål om enhetsomregneren', rik: enhetsHub,
    faq: [
      ['Hvor mange ml er en amerikansk kopp?', 'En amerikansk kopp er 236,6 ml. Mange oppskrifter runder av til 2,4 dl eller 240 ml.'],
      ['Hvor mange ml er en spiseskje?', 'I norske oppskrifter er 1 ss 15 ml. En amerikansk spiseskje er 14,8 ml, som oppskrifter også runder av til 15 ml.'],
      ['Hvor mange ml er en teskje og et kryddermål?', '1 ts er 5 ml og 1 krm er 1 ml. Det går altså fem kryddermål på én teskje og tre teskjeer på én spiseskje.'],
      ['Hvor mange gram er en unse?', 'En unse (vekt) er 28,35 gram. Væskeunser måler volum i stedet: 1 amerikansk væskeunse er 29,57 ml.'],
      ['Hvordan regner jeg fahrenheit om til celsius?', 'Trekk fra 32, og gang så med 5/9. For eksempel er 350 °F ca. 177 °C.'],
      ['Hvor mange dl er en liter?', 'Én liter er 10 dl eller 1000 ml. Det betyr at 1 dl er 100 ml.'],
      ['Regner Matlyst om enhetene i oppskrifter?', 'Når Enheter står på Metrisk i Innstillinger, regnes cups, unser og pund fra en oppskrift om til milliliter og gram ved import. Innstillingen gjelder nye importer.'],
    ],
    cta: 'Regn om oppskrifter i Matlyst',
  },
};
export const enhetsStierNb = Object.keys(enhetsSiderNb);

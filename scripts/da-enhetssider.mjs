// Enhedsomregnere på dansk: én side pr. enhedspar (ml til dl, kopper til ml, °F til °C osv.) plus en hub.
// Samme motor som den engelske (en-enhetssider.mjs), men med danske tekster, dansk decimalkomma
// og danske husholdningsmål (1 tsk = 5 ml, 1 spsk = 15 ml, 1 dl = 100 ml).
import { ENHETER, allePar, enheterFor, konverter, omregnerData, ordFor, parSti, tall } from './enheter.mjs';
import { byggRik } from './rik-sider.mjs';

const esc = (s) => String(s).replace(/&/gu, '&amp;').replace(/</gu, '&lt;').replace(/"/gu, '&quot;');
const p = (...ps) => ps.map((t) => `<p>${t}</p>`).join('');
const stor = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const N = (id) => ENHETER[id].da;
const gruppeIds = (g) => enheterFor('da').filter((id) => ENHETER[id].gruppe === g);

// Dansk talformat: decimalkomma og punktum som tusindtalsseparator.
function dk(n) {
  const s = tall(n);
  if (s === '') return s;
  const [h, d] = s.split('.');
  const hs = h.replace(/\B(?=(\d{3})+(?!\d))/gu, '.');
  return d ? `${hs},${d}` : hs;
}

const AMERIKANSK = new Set(['tsp', 'tbsp', 'oz', 'cups', 'pints', 'quarts', 'gallons', 'oz-vekt', 'lb', 'inches', 'f']);

const VERDIER = {
  ml: [5, 10, 15, 25, 50, 75, 100, 150, 200, 250, 300, 500, 750, 1000], cl: [1, 2, 3, 5, 10, 15, 20, 25, 33, 50, 75, 100], dl: [0.5, 1, 1.5, 2, 2.5, 3, 4, 5],
  l: [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 5, 10], tsp: [0.25, 0.5, 1, 1.5, 2, 3, 4], tbsp: [0.5, 1, 1.5, 2, 3, 4, 5, 6, 8], oz: [1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 32],
  cups: [0.25, 0.33, 0.5, 0.67, 0.75, 1, 1.5, 2, 2.5, 3, 4, 5, 8], pints: [0.5, 1, 2, 3, 4], quarts: [0.5, 1, 2, 3, 4], gallons: [0.25, 0.5, 1, 2, 3, 5],
  tsk: [0.5, 1, 2, 3], spsk: [0.5, 1, 2, 3, 4, 5, 6],
  g: [5, 10, 25, 50, 100, 150, 200, 250, 500, 750, 1000], kg: [0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 5, 10], 'oz-vekt': [1, 2, 3, 4, 6, 8, 10, 12, 16, 24, 32], lb: [0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 4, 5, 10],
  mm: [1, 2, 5, 10, 15, 20, 25, 30], cm: [5, 10, 15, 18, 20, 22, 23, 24, 25, 26, 28, 30, 35], inches: [1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 13, 14],
  c: [100, 120, 140, 150, 160, 175, 180, 190, 200, 220, 225, 250], f: [250, 275, 300, 325, 350, 375, 400, 425, 450, 475, 500],
};

// Hvor enheden optræder (til det generiske køkkennotat). Hvert led begynder lige efter «bruges».
const BRUG = {
  ml: 'i metriske opskrifter, på målebægre og i de fleste opskrifter uden for USA', cl: 'til drinks og cocktails og på mange flasker og målebægre', dl: 'i danske og andre nordiske opskrifter, hvor en deciliter er et helt almindeligt hverdagsmål',
  l: 'til bouillon, suppe, mælk og alt, der koges i en stor gryde', tsp: 'i amerikanske opskrifter til krydderier, bagepulver, essenser og små mængder af alt muligt', tbsp: 'i amerikanske opskrifter til olie, saucer, smør og mel',
  oz: 'i amerikanske opskrifter til væsker og på amerikanske flasker og pakker', cups: 'i amerikanske opskrifter, hvor de fleste ingredienser måles i volumen', pints: 'i amerikanske opskrifter til fløde, is og bær', quarts: 'i amerikanske opskrifter til bouillon, suppe og mejeriprodukter', gallons: 'til amerikansk mælk, vand og madlavning i store portioner',
  tsk: 'i danske opskrifter til krydderier, bagepulver og andre små mængder', spsk: 'i danske opskrifter til olie, smør, mel og sukker',
  g: 'i metriske opskrifter, på køkkenvægte og i varedeklarationer', kg: 'i metriske opskrifter til kød, kartofler, mel og større indkøb', 'oz-vekt': 'i amerikanske opskrifter og på emballager til kød, ost, chokolade og dåsemad', lb: 'i amerikanske opskrifter og på varer som kød, grøntsager og mel',
  mm: 'til tykkelsen på dej og til fine snit', cm: 'til bageforme, tykkelsen på dej og snit med kniv i metriske opskrifter', inches: 'i amerikanske opskrifter til størrelsen på bageforme og tykkelsen på dej',
  c: 'i opskrifter og ovne uden for USA, også herhjemme', f: 'i amerikanske opskrifter og de fleste amerikanske ovne',
};

// Håndskrevne noter for de mest brugte par (nøgle «fra>til»).
const NOTE = {
  'ml>dl': 'En deciliter er hverdagsmålet i danske opskrifter, så 2 dl mælk er det samme som 200 ml. Mange målebægre har begge skalaer, så du kan aflæse dl-stregen direkte.',
  'dl>ml': 'Står der 3 dl i en opskrift, er det 300 ml. Har dit målebæger kun milliliter, ganger du med 100 og skænker op til den streg.',
  'ml>cl': 'Centiliter ser du mest på flasker og i drinks. 10 ml er 1 cl, så en snaps på 2 cl er 20 ml, og en flaske med 70 cl indeholder 700 ml.',
  'cl>ml': 'Centiliter bruges til drinks og på flasker. 1 cl er 10 ml, så 4 cl er 40 ml. Mange målebægre til drinks viser begge dele.',
  'dl>cl': 'En deciliter er 10 centiliter. 2,5 dl er derfor 25 cl, og en halv liter er 50 cl.',
  'cl>dl': 'Ti centiliter er en deciliter. 33 cl, som står på en almindelig sodavandsdåse, er 3,3 dl.',
  'l>dl': 'En liter er 10 dl. En opskrift på 0,75 liter bouillon beder altså om 7,5 dl, og en halv liter er 5 dl.',
  'dl>l': 'Ti deciliter er en liter. 15 dl er 1,5 liter, og 5 dl er en halv liter, som er mængden i en almindelig karton fløde eller yoghurt.',
  'l>ml': 'En liter er 1.000 ml. Skal du bruge 1,5 liter, skal du bruge 1.500 ml. Det er den omregning, du skal bruge, når et målebæger kun viser milliliter.',
  'ml>l': 'Tusind milliliter er en liter. 750 ml er 0,75 liter, og 250 ml er en kvart liter.',
  'cups>ml': 'Amerikanske opskrifter måler i kopper, men en amerikansk kop er ikke den kop, du har i skabet. En amerikansk kop er 236,6 ml. Mange kogebøger runder den af til 240 ml, derfor ser du begge tal. Ved bagning er det mere pålideligt at veje end at måle i volumen.',
  'ml>cups': 'Er en opskrift skrevet i milliliter, og du kun har amerikanske målekopper, dividerer du med 236,6. 250 ml er lidt mere end én amerikansk kop.',
  'cups>dl': 'En amerikansk kop er 2,37 dl, og opskrifter runder den ofte af til 2,4 dl. Står der 2,5 dl i en dansk opskrift, er det lidt mere end en amerikansk kop. I en suppe eller en gryderet gør forskellen ingenting.',
  'dl>cups': 'Fra deciliter til amerikanske kopper dividerer du med 2,366. Tre deciliter er cirka 1,27 kopper, altså en og en kvart kop i de fleste opskrifter.',
  'tbsp>ml': 'En amerikansk spiseskefuld er 14,8 ml, som de fleste opskrifter runder af til 15 ml. En dansk spiseskefuld er 15 ml, så forskellen er så lille, at du sjældent mærker den. I Australien er en spiseskefuld 20 ml, så tjek, hvor opskriften kommer fra.',
  'ml>tbsp': 'Små mængder væske i metriske opskrifter bliver til spiseskefulde i amerikanske opskrifter. 15 ml er cirka én amerikansk spiseskefuld.',
  'tsp>ml': 'En amerikansk teskefuld er 4,9 ml, som opskrifter runder af til 5 ml. Brug en afstrøget målske og ikke en ske fra bestikskuffen, for dens størrelse varierer meget.',
  'ml>tsp': 'Fem milliliter er cirka én amerikansk teskefuld. Til små mængder krydderi og essens er det bedre at måle med skeer end med et målebæger.',
  'spsk>ml': 'En spiseskefuld er 15 ml. Tre spiseskefulde olie er derfor 45 ml, og seks er 90 ml, altså lidt under 1 dl.',
  'ml>spsk': 'Fra milliliter til spiseskefulde dividerer du med 15. 30 ml er 2 spsk, og 100 ml er cirka 6,7 spsk.',
  'tsk>ml': 'En teskefuld er 5 ml. To teskefulde er 10 ml, og tre er 15 ml, altså det samme som én spiseskefuld.',
  'ml>tsk': 'Fra milliliter til teskefulde dividerer du med 5. 10 ml er 2 tsk, og 25 ml er 5 tsk.',
  'spsk>tsk': 'En spiseskefuld er 3 teskefulde. Det er den nemmeste måde at gøre en krydderimængde større eller mindre.',
  'tsk>spsk': 'Tre teskefulde er én spiseskefuld. Fire teskefulde er altså én spiseskefuld og én teskefuld.',
  'dl>spsk': 'En deciliter er 100 ml, og en spiseskefuld er 15 ml, så 1 dl er cirka 6,7 spsk. Brug det, hvis du mangler et målebæger.',
  'spsk>dl': 'Fra spiseskefulde til deciliter dividerer du med 6,67 (eller ganger med 0,15). Seks spiseskefulde er 0,9 dl, altså lidt under 1 dl.',
  'tsk>dl': 'En deciliter er 20 teskefulde. Fem teskefulde er 0,25 dl, og ti teskefulde er 0,5 dl.',
  'dl>tsk': 'Fra deciliter til teskefulde ganger du med 20. En halv deciliter er 10 tsk, og 1 dl er 20 tsk.',
  'oz>ml': 'Denne side omregner flydende ounces, som er et mål for volumen. En amerikansk flydende ounce er 29,57 ml. Ounces på en pose mel eller en ostepakke måler i stedet vægt, så brug omregneren fra ounces til gram til dem.',
  'ml>oz': 'Fra milliliter til amerikanske flydende ounces dividerer du med 29,57. 250 ml er cirka 8,5 fl oz. Flydende ounces måler volumen, mens ounces på emballagen måler vægt.',
  'oz-vekt>g': 'En ounce er 28,35 gram, så 4 oz er cirka 113 g, og 8 oz er cirka 227 g. Det er det tal, du skal bruge til smør, ost, chokolade og kød i amerikanske opskrifter.',
  'g>oz-vekt': 'Fra gram til ounces dividerer du med 28,35. 100 g er cirka 3,5 oz, og 250 g er cirka 8,8 oz. Brug en køkkenvægt, når du kan, for den er mere præcis end et målebæger.',
  'lb>g': 'Et pund er 453,6 gram. En opskrift med ét pund hakket oksekød skal bruge cirka 450 g, som er en almindelig pakkestørrelse herhjemme.',
  'g>lb': 'Fra gram til pund dividerer du med 453,6. 500 g er cirka 1,1 pund. Butikker i lande, der bruger pund, sælger ofte pakker på 1 pund, hvor vi køber 450 g eller 500 g.',
  'lb>kg': 'Et pund er 0,4536 kg. To pund er lidt over 900 g, derfor er en pakke på 1 kg lidt mere end 2 pund.',
  'kg>lb': 'Fra kilo til pund ganger du med 2,205. En kylling på 1,5 kg er cirka 3,3 pund, og det er nyttigt, når en amerikansk opskrift opgiver kyllingen i pund.',
  'kg>g': 'Et kilo er 1.000 gram. 1,5 kg er 1.500 g, og en kvart kilo er 250 g. Det er den omregning, du skal bruge, når køkkenvægten kun viser gram.',
  'g>kg': 'Tusind gram er et kilo. 750 g er 0,75 kg, og 250 g er en kvart kilo.',
  'f>c': 'De fleste amerikanske ovne og opskrifter bruger Fahrenheit. 350 °F er 177 °C, som de fleste metriske opskrifter runder af til 175 eller 180 °C. En ovn med varmluft har ofte en lavere temperatur end en almindelig ovn, så tjek også ovnens vejledning.',
  'c>f': 'Fra Celsius til Fahrenheit ganger du med 9/5 og lægger 32 til. 180 °C er 356 °F, som amerikanske opskrifter runder af til 350 °F. Forvarm altid ovnen helt, før du begynder at bage.',
  'gallons>l': 'En amerikansk gallon er 3,785 liter. En britisk (imperial) gallon er større, så en gallon i en britisk opskrift er ikke det samme som en gallon i en amerikansk.',
  'l>gallons': 'Fra liter til amerikanske gallon dividerer du med 3,785. En gryde på 4 liter rummer lidt mere end én gallon.',
  'inches>cm': 'En tomme er præcis 2,54 cm. En kageform på 9 tommer er cirka 23 cm, og en på 8 tommer er cirka 20 cm. Det er de to størrelser, de fleste opskrifter bruger.',
  'cm>inches': 'Fra centimeter til tommer dividerer du med 2,54. En form på 20 cm er cirka 8 tommer, og en på 30 cm er cirka 12 tommer.',
  'tbsp>tsp': 'En amerikansk spiseskefuld er 3 amerikanske teskefulde. Det er den nemmeste måde at gøre en krydderimængde større eller mindre.',
  'tsp>tbsp': 'Tre amerikanske teskefulde er én amerikansk spiseskefuld. Fire teskefulde er én spiseskefuld og én teskefuld.',
  'cups>tbsp': 'Der går 16 amerikanske spiseskefulde på én amerikansk kop. En kvart kop er altså 4 spiseskefulde, og en tredjedel kop er godt 5.',
  'cups>oz': 'Én amerikansk kop er 8 flydende ounces. Brug det til væsker. Til tørre ingredienser kan kopper og ounces som vægtmål ikke bruges i flæng.',
  'oz>cups': 'En amerikansk kop rummer 8 flydende ounces, så 16 fl oz er 2 kopper. Det er volumen og ikke vægt: en kop mel vejer cirka 4 oz og ikke 8.',
  'tbsp>spsk': 'En amerikansk spiseskefuld er 14,8 ml, og en dansk er 15 ml. I praksis kan du bytte dem, men i en følsom opskrift, for eksempel bagning, skal du holde dig til samme mål hele vejen.',
  'spsk>tbsp': 'En dansk spiseskefuld er 15 ml og en amerikansk 14,8 ml. Forskellen er så lille, at du kan bruge dem i flæng i de fleste opskrifter.',
  'tsp>tsk': 'En amerikansk teskefuld er 4,9 ml, og en dansk er 5 ml. Forskellen er så lille, at du kan bruge dem i flæng.',
  'tsk>tsp': 'En dansk teskefuld er 5 ml og en amerikansk 4,9 ml. I praksis er de det samme, når du måler krydderier og bagepulver.',
};

const FEJL = {
  volum: ['Du bruger en kaffekop som kop. En kaffekop er sjældent lige så stor som et målebæger, mens en amerikansk kop er 236,6 ml.', 'Du blander flydende ounces og ounces som vægtmål. Flydende ounces måler volumen, mens ounces på en pakke måler vægt.', 'Du tror, at en pint eller en gallon er lige stor i USA og Storbritannien. De britiske (imperial) er større end de amerikanske.', 'Du runder af for tidligt. Regn hele opskriften om først, og rund først de endelige mængder af.', 'Du måler tørre ingredienser i et målebæger til væske, så de pakker sig og giver for meget.'],
  vekt: ['Du tror, at ounces på pakken er flydende ounces. Vægt og volumen er to forskellige mål.', 'Du måler mel i kopper og venter samme antal gram hver gang. Øser du, pakker melet sig, og hælder du det løst i og stryger af, bliver det mindre.', 'Du runder et pund af til 500 g i en følsom opskrift, for eksempel brød. Et pund er 454 g.', 'Du glemmer at nulstille vægten, når du har sat skålen på.', 'Du regner én ingrediens om og lader de andre stå, så forholdene mellem dem skrider.'],
  lengde: ['Du måler formen på ydersiden af kanten og ikke indvendigt.', 'Du skifter en form på 9 tommer ud med en på 20 cm uden at tjekke, men det er et andet areal.', 'Du glemmer, at en dybere form kræver længere bagetid.', 'Du læser mm som cm, når du ruller dej ud.', 'Du runder ikke af til en formstørrelse, som du faktisk kan købe.'],
  temperatur: ['Du bruger celsiustallet i en ovn, der viser Fahrenheit, og så bliver den langt for kold.', 'Du glemmer, at ovne med varmluft ofte kører med en lavere temperatur end en almindelig ovn.', 'Du stoler på ovnens drejeknap og ikke på et termometer.', 'Du åbner lågen for tit, så temperaturen falder hurtigt.', 'Du regner en opskrift om, der angiver gasmærke, uden at tjekke din egen ovn.'],
};

const MENTAL = {
  volum: 'Et hurtigt overslag: en amerikansk kop er lidt mindre end 2,5 dl, og en liter er lidt mere end fire amerikanske kopper. Brug regnemaskinen til alt, der skal hældes i en skål.',
  vekt: 'Et hurtigt overslag: et pund er lidt mindre end et halvt kilo, og et kilo er lidt mere end to pund. En ounce er cirka 28 gram.',
  lengde: 'Et hurtigt overslag: en tomme er cirka 2,5 cm, og en form på 9 tommer er cirka 23 cm.',
  temperatur: 'Et hurtigt overslag: fordobl celsiustallet, og læg 30 til for en grov Fahrenheit-værdi. Jo højere temperaturen er, jo mere unøjagtigt bliver det, så brug regnemaskinen til bagning.',
};

const GODT = {
  volum: 'De danske husholdningsmål er enkle: 1 tsk er 5 ml, 1 spsk er 15 ml, og 1 dl er 100 ml. De amerikanske mål ligner dem i navnet, men er ikke helt ens: en amerikansk kop er 236,6 ml, en amerikansk spiseskefuld er 14,8 ml, og en amerikansk teskefuld er 4,9 ml. Mange opskrifter runder dem af til 2,4 dl, 15 ml og 5 ml. Er opskriften britisk, skal du huske, at de britiske (imperial) pint og gallon er større end de amerikanske.',
  vekt: 'Herhjemme vejer vi i gram og kilo, mens amerikanske opskrifter vejer i ounces og pund. 1 ounce er 28,35 g, og 1 pund er 453,6 g, så en pakke på 500 g er lidt mere end et pund. Opskrifter og emballager runder ofte af, for eksempel til 450 g for et pund. I en gryderet gør det sjældent noget, men i brød og kage kan du mærke det.',
  lengde: 'En tomme er præcis 2,54 cm. Bageforme opgives i USA i tommer og herhjemme i centimeter. En form på 9 tommer er cirka 23 cm, og en på 8 tommer er cirka 20 cm. Formens størrelse afgør, hvor tyk dejen bliver, og dermed hvor lang bagetiden er.',
  temperatur: 'Danmark bruger Celsius, og USA bruger Fahrenheit. De to skalaer mødes ved minus 40 grader. En ovn med varmluft kører ofte med en lavere temperatur end en almindelig ovn, så tjek, hvad opskriften forudsætter.',
};

const EKSTRA = {
  volum: 'Volumen er den omregning, der oftest går galt, fordi mange mål har samme navn i forskellige lande. Når du er i tvivl, så find ud af, om opskriften er dansk, amerikansk eller britisk, før du vælger faktor. I en suppe, en sauce eller en gryderet tåler opskriften en lille afvigelse. I brød, kage og desserter med gelé skal mængderne ramme tættere på, fordi forholdet mellem væske og tørre ingredienser bestemmer resultatet.',
  vekt: 'Vægt er den sikreste måde at måle på, fordi gram ikke afhænger af, hvor tæt en ingrediens pakker sig. Derfor angiver gode bageopskrifter mel og sukker i gram. Står der ounces eller pund, så regn dem om til gram med det samme, og skriv tallene ned. Så slipper du for at gætte, når dejen skal ligne den på billedet.',
  lengde: 'Længder betyder mest, når du bager. Formens størrelse afgør, hvor høj kagen bliver, hvor hurtigt den bliver gennembagt, og om du har tilstrækkeligt med dej. Har du ikke den størrelse, opskriften nævner, så vælg den nærmeste, du har, og hold øje med kagen de sidste minutter. Til udrulning af dej er et lineal i køkkenet mere præcist end et øjemål.',
  temperatur: 'Temperaturen er den enkelte indstilling, der oftest afgør, om en ret lykkes. En ovn, der er 20 grader for kold, giver blegt og tungt brød, og en ovn, der er for varm, brænder kanterne, før midten er færdig. Forvarm ovnen helt, brug gerne et ovntermometer, og tjek, om opskriften er skrevet til en almindelig ovn eller til en ovn med varmluft.',
};

const MAALETIPS = {
  volum: p('Brug et målebæger til væske og afstrøgne målskeer eller målebægre til tørre ingredienser. Aflæs bægeret i øjenhøjde på et vandret underlag, og stryg skeer og kopper af med bagsiden af en kniv.', 'Amerikanske, britiske og australske mål med samme navn er ikke altid lige store, så tjek, hvor opskriften kommer fra, før du regner om.'),
  vekt: p('En køkkenvægt slår ethvert målebæger, især til mel og sukker. Sæt skålen på vægten, nulstil den, og hæld ingrediensen i.', 'Har du kun målebægre, så husk, at en kop mel og en kop sukker ikke vejer det samme.'),
  lengde: p('Mål formen på tværs af toppen fra indvendig kant til indvendig kant og ikke over ydersiden af kanten.', 'En form, der er en størrelse forkert, ændrer bagetiden, så kig til kagen tidligere, hvis din form er større end den, opskriften nævner.'),
  temperatur: p('Ovnens drejeknap er ofte upræcis. Et billigt ovntermometer viser den rigtige temperatur.', 'Ovne med varmluft bager varmere, så mange opskrifter foreslår en lavere temperatur, når du bruger dem.'),
};


function regelTekst(fra, til) {
  const a = ENHETER[fra]; const b = ENHETER[til];
  if (a.gruppe === 'temperatur') return fra === 'f' ? 'træk 32 fra, og gang derefter med 5/9' : 'gang med 9/5, og læg derefter 32 til';
  const x = a.f / b.f;
  if (x >= 1) return `gang med ${dk(x)}`;
  const inv = b.f / a.f;
  const rundt = Math.abs(inv - Math.round(inv)) < 1e-9;
  return rundt ? `divider med ${dk(inv)}` : `gang med ${dk(x)} (eller divider med ${dk(inv)})`;
}

function skjema(fra, til) {
  const g = ENHETER[fra].gruppe;
  const ids = gruppeIds(g);
  const data = Object.fromEntries(ids.map((id) => [id, g === 'temperatur' ? 0 : ENHETER[id].f]));
  const opt = (valgt) => ids.map((id) => `<option value="${id}"${id === valgt ? ' selected' : ''}>${esc(N(id).fl)} (${esc(N(id).kort)})</option>`).join('');
  const svar = `1 ${ordFor('da', fra, 1)} = ${dk(konverter(1, fra, til))} ${ordFor('da', til, konverter(1, fra, til))}`;
  return `<form class="omregner" data-gruppe="${g}" onsubmit="return false"><div class="omregner-rad">`
    + `<label>Mængde<input type="number" inputmode="decimal" step="any" value="1" data-felt="verdi"></label>`
    + `<label>Fra<select data-felt="fra">${opt(fra)}</select></label>`
    + `<button type="button" class="omregner-bytt" data-handling="bytt" aria-label="Skift enheder">⇄</button>`
    + `<label>Til<select data-felt="til">${opt(til)}</select></label></div>`
    + `<p class="omregner-svar" role="status" aria-live="polite" data-felt="svar">${esc(svar)}</p>`
    + `<script type="application/json" class="omregner-data">${JSON.stringify(omregnerData('da', data, g === 'temperatur'))}</script></form>`;
}

function tabell(fra, til) {
  const rader = (VERDIER[fra] ?? [1, 2, 5, 10]).map((v) => `<tr><td>${dk(v)} ${N(fra).kort}</td><td>${dk(konverter(v, fra, til))} ${N(til).kort}</td></tr>`).join('');
  return `<div class="table-wrap"><table><thead><tr><th>${esc(stor(N(fra).fl))}</th><th>${esc(stor(N(til).fl))}</th></tr></thead><tbody>${rader}</tbody></table></div>`;
}

function eksempelVaerdier(fra) {
  const g = ENHETER[fra].gruppe;
  if (g === 'temperatur') return fra === 'c' ? [160, 180, 200] : [350, 375, 400];
  const v = (VERDIER[fra] ?? [1, 2, 5]).filter((x) => x >= 1);
  const valgt = v.length >= 4 ? v.slice(1, 4) : v.slice(0, 3);
  return valgt.length ? valgt : [1, 2, 5];
}

function eksempler(fra, til) {
  return `<ul>${eksempelVaerdier(fra).map((v) => `<li><strong>${dk(v)} ${N(fra).kort}</strong> = ${dk(konverter(v, fra, til))} ${N(til).kort}</li>`).join('')}</ul>`;
}

function relaterte(fra, til) {
  const par = allePar('da');
  const sammeFra = par.filter(([a, b]) => a === fra && b !== til).slice(0, 5);
  const sammeTil = par.filter(([a, b]) => b === til && a !== fra).slice(0, 5);
  const alle = [[til, fra], ...sammeFra, ...sammeTil];
  return `<ul class="omregner-liste">${alle.map(([a, b]) => `<li><a href="/da/${parSti(a, b, 'da')}">${esc(N(a).kort)} til ${esc(N(b).kort)}</a>: ${esc(N(a).fl)} til ${esc(N(b).fl)}</li>`).join('')}</ul>`;
}

const MATLYST = p('Det bliver hurtigt trælsomt at regne om i hånden, især når en hel opskrift står i de forkerte enheder. Når du importerer en opskrift i Matlyst, vælger du under <strong>Enheder</strong> i Indstillinger, om mængderne vises <strong>Metrisk</strong>, eller om de beholdes, som kilden skrev dem (<strong>Amerikansk</strong>). Med Metrisk regnes cups, ounces og pund fra en amerikansk opskrift om til milliliter og gram ved import. Indstillingen gælder nye importer.')
  + '<ul><li><strong>Importér én gang, uden regnestykker.</strong> Del en opskrift fra Instagram, TikTok eller en hjemmeside med Matlyst, og gennemgå udkastet, før du gemmer.</li><li><strong>Regn portionerne om.</strong> Vælg fra 1 til 20 portioner, og alle mængder følger med. Omregningen er lineær, så tjek selv bagning og krydderier.</li><li><strong>Én indkøbsliste.</strong> Alle ingredienser samles på én liste, sorteret efter afdeling i butikken.</li></ul>'
  + p('Matlyst er gratis at starte med, med 5 importer pr. kalendermåned. Læs mere om <a href="/da/opskrifts-app/">opskriftsappen</a>, eller se, hvordan <a href="/da/indkoebsliste-app/">indkøbslisten</a> fungerer.');

function titel(F, T) {
  const lang = `Regn ${F.kort} om til ${T.kort}: ${F.fl} til ${T.fl}`;
  if (lang.length <= 60) return lang;
  const mellem = `Regn ${F.kort} om til ${T.kort}: ${F.kort} til ${T.kort}`;
  return mellem.length <= 60 ? mellem : `Regn ${F.kort} om til ${T.kort}`;
}

function beskrivelse(F, T, x) {
  const kandidater = [
    `Regn ${F.fl} om til ${T.fl} med en gratis regnemaskine. 1 ${F.kort} = ${dk(x)} ${T.kort}. Med tabel, formel og gode tips til køkkenet.`,
    `Regn ${F.kort} om til ${T.kort} med en gratis regnemaskine. 1 ${F.kort} = ${dk(x)} ${T.kort}. Med tabel, formel og gode tips til køkkenet.`,
    `Regn ${F.kort} om til ${T.kort} med en gratis regnemaskine. 1 ${F.kort} = ${dk(x)} ${T.kort}. Med tabel og formel.`,
  ];
  const ok = kandidater.find((t) => t.length >= 100 && t.length <= 160);
  return ok ?? kandidater[2];
}

export function sideForPar(fra, til) {
  const F = N(fra); const T = N(til);
  const g = ENHETER[fra].gruppe;
  const x = konverter(1, fra, til);
  const temp = g === 'temperatur';
  const svar = `1 ${F.kort} = ${dk(x)} ${T.kort}. Når du skal regne ${F.fl} om til ${T.fl}, ${regelTekst(fra, til)}.`;
  const note = NOTE[`${fra}>${til}`] ?? `${stor(F.fl)} bruges ${BRUG[fra]}. ${stor(T.fl)} bruges ${BRUG[til]}. Derfor regner du om, når en opskrift er skrevet i den ene enhed, og dine måleredskaber bruger den anden.`;
  const formel = temp ? (fra === 'f' ? '(°F - 32) × 5/9' : '°C × 9/5 + 32') : `${T.kort} = ${F.kort} × ${dk(x)}`;
  const formelTekst = temp ? `${T.kort} = ${formel}` : formel;
  const rik = byggRik({
    lang: 'da',
    svarTekst: svar,
    seksjoner: [
      [`Regnemaskine: ${F.fl} til ${T.fl}`, skjema(fra, til)],
      [`Tabel: ${F.kort} til ${T.kort}`, p('Tallene herunder er dem, opskrifter oftest bruger. Find din mængde i den venstre kolonne.') + tabell(fra, til)],
      [`Sådan regner du ${F.fl} om til ${T.fl}`, p(`Reglen er: ${regelTekst(fra, til)}. Som formel: ${formelTekst}.`) + p('Her er tre hurtige eksempler:') + eksempler(fra, til) + p(GODT[g])],
      [`Hvor opskrifter bruger ${F.fl} og ${T.fl}`, p(note)],
      ['Tips til måling', MAALETIPS[g] + p(MENTAL[g]) + p(EKSTRA[g])],
      ['Almindelige fejl, når du regner om', `<ul>${FEJL[g].map((t) => `<li>${t}</li>`).join('')}</ul>`],
      ['Regn en hel opskrift om', p(`Står en opskrift i ${F.fl}, og du laver mad i ${T.fl}, så regn alle mængder om i ét hug, og hold forholdene mellem dem ens. Skriv de nye mængder ved siden af de gamle, så du kan kontrollere dit regnestykke. Skal opskriften også gøres større eller mindre, så regn enhederne om først og skalér bagefter, så du ikke runder af to gange.`) + p('At gøre det for én opskrift går an. For en hel samling gemte opskrifter er det grunden til, at mange vælger en app.')],
      ['Hold op med at regne om i hånden', MATLYST],
      ['Beslægtede omregninger', relaterte(fra, til)],
    ],
  }).html;
  const q = (a, b) => [a, b];
  const eksVal = eksempelVaerdier(fra)[0];
  const eksRes = konverter(eksVal, fra, til);
  const eksakt = (AMERIKANSK.has(fra) || AMERIKANSK.has(til))
    ? 'Faktoren er nøjagtig, men opskrifter runder den ofte af, så du møder lidt forskellige tal i forskellige kilder. Brug det afrundede tal, når opskriften tåler det.'
    : temp ? 'Formlen er nøjagtig. Opskrifter runder som regel af til nærmeste 5 grader.' : 'Ja. Begge enheder er metriske eller danske husholdningsmål, så faktoren er nøjagtig, og regnemaskinen viser kun de gældende cifre.';
  const faq = [
    temp ? q(`Hvad er ${dk(eksVal)} ${F.kort} i ${T.kort}?`, `${dk(eksVal)} ${F.kort} er ${dk(eksRes)} ${T.kort}. ${stor(regelTekst(fra, til))}.`)
      : q(`Hvor mange ${T.fl} er der i 1 ${F.en}?`, `1 ${F.en} er ${dk(x)} ${T.fl}.`),
    temp ? q(`Hvad er ${dk(eksempelVaerdier(til)[0])} ${T.kort} i ${F.kort}?`, `${dk(eksempelVaerdier(til)[0])} ${T.kort} er ${dk(konverter(eksempelVaerdier(til)[0], til, fra))} ${F.kort}.`)
      : q(`Hvor mange ${F.fl} er der i 1 ${T.en}?`, `1 ${T.en} er ${dk(konverter(1, til, fra))} ${F.fl}.`),
    q(`Hvordan regner jeg ${F.kort} om til ${T.kort} uden en regnemaskine?`, `${stor(regelTekst(fra, til))}. For eksempel er ${dk(eksVal)} ${F.kort} lig med ${dk(eksRes)} ${T.kort}.`),
    q('Er omregningen nøjagtig?', eksakt),
    q(`Hvad bruges ${F.fl} og ${T.fl} til i madlavning?`, `${stor(F.fl)} bruges ${BRUG[fra]}. ${stor(T.fl)} bruges ${BRUG[til]}.`),
    q(`Kan jeg regne ${T.kort} om til ${F.kort}?`, `Ja. Brug knappen til at skifte enheder i regnemaskinen, eller åbn siden om ${T.kort} til ${F.kort}. 1 ${T.en} er ${dk(konverter(1, til, fra))} ${F.fl}.`),
    q('Kan jeg bruge omregningen til en hel opskrift?', 'Ja, men regn alle ingredienser om i ét hug, og hold forholdene mellem dem ens. Rund først af til sidst. Bagning er følsom, så tjek mængderne, før du går i gang.'),
    q('Regner Matlyst enheder om i opskrifter?', 'Når du importerer en opskrift, vælger du under Enheder i Indstillinger, om mængderne vises Metrisk, eller beholdes, som kilden skrev dem. Med Metrisk regnes cups, ounces og pund om til milliliter og gram. Indstillingen gælder nye importer.'),
  ];
  return {
    title: titel(F, T),
    description: beskrivelse(F, T, x),
    eyebrow: 'Enhedsomregner',
    h1: `${stor(F.fl)} til ${T.fl} (${F.kort} til ${T.kort})`,
    lead: `${stor(F.fl)} til ${T.fl} med tabel, formel og det, du skal være opmærksom på i en opskrift.`,
    forst: 'Skriv en mængde, vælg enhederne, og aflæs svaret.',
    stegTittel: `Sådan regner du ${F.fl} om til ${T.fl}`,
    steg: [['Skriv mængden', `Skriv antallet af ${F.fl}.`], ['Tjek enhederne', `Sørg for, at Fra er ${F.fl}, og at Til er ${T.fl}.`], ['Aflæs svaret', `Resultatet vises, mens du skriver: 1 ${F.kort} = ${dk(x)} ${T.kort}.`]],
    alternativ: '', grense: '', seksjoner: [], faqTittel: `Spørgsmål om ${F.kort} til ${T.kort}`, rik, faq,
    cta: 'Importér opskrifter i Matlyst',
  };
}

function hub() {
  const grupper = [['volum', 'Volumen: milliliter, deciliter, kopper og skeer'], ['vekt', 'Vægt: gram, kilo, ounces og pund'], ['lengde', 'Længde: centimeter og tommer'], ['temperatur', 'Temperatur: Celsius og Fahrenheit']];
  const sektion = ([g, h]) => {
    const par = allePar('da').filter(([a]) => ENHETER[a].gruppe === g);
    const lister = par.map(([a, b]) => `<li><a href="/da/${parSti(a, b, 'da')}">${esc(N(a).kort)} til ${esc(N(b).kort)}</a>: ${esc(N(a).fl)} til ${esc(N(b).fl)}</li>`).join('');
    return [h, `<ul class="omregner-liste">${lister}</ul>`];
  };
  const rik = byggRik({
    lang: 'da',
    svarTekst: 'Her finder du alle køkkenomregninger samlet: ml til dl, kopper til ml, ounces til gram, pund til kilo og °F til °C. Hver side har en regnemaskine, en tabel og tips til opskrifter.',
    seksjoner: [
      ['Danske og amerikanske mål', p('Herhjemme måler vi med 1 tsk = 5 ml, 1 spsk = 15 ml og 1 dl = 100 ml. Amerikanske opskrifter bruger kopper, spiseskefulde og teskefulde, som er lidt anderledes: en amerikansk kop er 236,6 ml, og mange opskrifter runder den af til 2,4 dl. Vægt opgives i ounces og pund (1 ounce er 28,35 g, og 1 pund er 453,6 g), længder i tommer (1 tomme er 2,54 cm) og temperaturer i Fahrenheit.')],
      ...grupper.map(sektion),
      ['Hold op med at regne om i hånden', MATLYST],
    ],
  }).html;
  return {
    title: 'Enhedsomregner til køkkenet: dl, ml, kopper, g, °F',
    description: 'Gratis enhedsomregner til køkkenet: ml til dl, kopper til ml, ounces til gram, pund til kilo og °F til °C. Med tabeller og tips til opskrifter.',
    eyebrow: 'Enhedsomregner',
    h1: 'Enhedsomregner til køkkenet',
    lead: 'Alle køkkenomregninger samlet, med en regnemaskine og en tabel til hver.',
    forst: 'Vælg to enheder, og aflæs svaret.',
    stegTittel: 'Sådan bruger du omregneren',
    steg: [['Vælg enhederne', 'Vælg den enhed, din opskrift bruger, og den enhed, du vil have.'], ['Skriv mængden', 'Svaret vises, mens du skriver.'], ['Brug tabellen', 'Hver side har en tabel over de mængder, der oftest bruges.']],
    alternativ: '', grense: '', seksjoner: [], faqTittel: 'Spørgsmål om enhedsomregneren', rik,
    faq: [
      ['Hvor mange ml er der i en amerikansk kop?', 'En amerikansk kop er 236,6 ml. Mange opskrifter runder den af til 2,4 dl eller 240 ml.'],
      ['Hvor mange ml er der i en teskefuld og en spiseskefuld?', 'En dansk teskefuld er 5 ml, og en dansk spiseskefuld er 15 ml. De amerikanske er lidt mindre, henholdsvis 4,9 ml og 14,8 ml.'],
      ['Hvor mange gram er der i en ounce?', 'En ounce som vægtmål er 28,35 gram. En flydende ounce måler i stedet volumen: 1 amerikansk flydende ounce er 29,57 ml.'],
      ['Hvor mange gram er der i et pund?', 'Et pund er 453,6 gram. Mange amerikanske opskrifter og butikker runder det af til 450 g.'],
      ['Hvordan regner jeg Fahrenheit om til Celsius?', 'Træk 32 fra, og gang derefter med 5/9. For eksempel er 350 °F cirka 177 °C.'],
      ['Hvor mange centimeter er en tomme?', 'En tomme er præcis 2,54 cm. En form på 9 tommer er cirka 23 cm.'],
      ['Er de britiske mål de samme som de amerikanske?', 'Ikke altid. De britiske (imperial) pint og gallon er større end de amerikanske, så tjek, hvor opskriften kommer fra.'],
      ['Regner Matlyst enheder om i opskrifter?', 'Når du importerer en opskrift, vælger du under Enheder i Indstillinger, om mængderne vises Metrisk, eller beholdes, som kilden skrev dem. Med Metrisk regnes cups, ounces og pund om til milliliter og gram. Indstillingen gælder nye importer.'],
    ],
    cta: 'Importér opskrifter i Matlyst',
  };
}

export const enhetsSiderDa = { ...Object.fromEntries(allePar('da').map(([fra, til]) => [parSti(fra, til, 'da'), sideForPar(fra, til)])), 'vaerktoejer/enhedsomregner/': hub() };
export const enhetsStierDa = Object.keys(enhetsSiderDa);

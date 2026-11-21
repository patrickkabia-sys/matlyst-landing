// Lange sider på norsk bokmål (utkast til Patricks godkjenning). Samme oppbygging som en-rike-sider.mjs:
// felt per path som legges oppå den tynne siden, eller en ny side når path ikke finnes fra før.
// Skrevet fra meningen etter matlyst-sprak, ikke oversatt. Fakta følger de engelske sidene (funksjonssjekken 18.11.2026).
// Matsikkerhetstall er utelatt med vilje: Mattilsynets sider kunne ikke leses (HTTP 429), og vi bruker ingen tall vi ikke har hentet derfra.
import { side as julemiddag } from './nb-jul/julemiddag.mjs';
import { side as om } from './nb-om/om.mjs';
import { byggRik, founder, illustrasjon, scenario, scenarioNotat } from './rik-sider.mjs';

const p = (...ps) => ps.map((t) => `<p>${t}</p>`).join('');
const sn = () => scenarioNotat('nb');
const sc = (tittel, felt) => scenario(tittel, felt, 'nb');
const ill = (fil, tekst) => illustrasjon('nb', fil, tekst);

const oppskriftsbokApp = byggRik({
  lang: 'nb',
  svarTekst: 'Matlyst er en oppskriftsapp. Del en oppskrift fra en nettside, et Instagram-innlegg eller en TikTok, eller ta bilde av en, så blir den til en ryddig liste med ingredienser og steg som du kan søke i, regne om, planlegge med og handle fra. Det er gratis å komme i gang.',
  seksjoner: [
    ['Hvorfor jeg lagde den', founder([
      'Jeg er ikke utdannet kokk. Jeg er utdannet kjøletekniker.',
    ], 'Patrick, grunnlegger av Matlyst. Mat er kjærlighetsspråket mitt. Jeg ville bare slutte å miste oppskriftene jeg lager maten etter.')
      + p('Som lærling kom jeg inn i noen av de beste restaurantkjøkkenene i hjembyen min. Jeg var aldri den som lagde maten. Jeg var den som fikset kjølerommet før første bestilling kom inn. Derfra fikk jeg se på nært hold hvordan profesjonelle jobber. Ingenting er tilfeldig. Alt har sin faste plass, merkelapp og dato.',
        'Hjemme lå oppskriftene mine på åtte steder: notater, OneNote, en oppskriftsapp, bokmerker, TikTok, Instagram, YouTube og favoritter. Jeg kunne lage maten, men hadde ikke noe system. Så jeg bygde systemet jeg hadde sett i de kjøkkenene, for helt vanlige familiemiddager.',
        'Resten av denne siden viser hva systemet gjør, steg for steg, og hvor grensene går.')],
    ['Slik fungerer det i tre steg', p('Du trenger ikke flytte hele samlingen den første dagen. Begynn med oppskriftene du lager oftest.')
      + '<h3>1. Lagre den fra stedet der du fant den</h3>'
      + p('Del en lenke eller et innlegg med Matlyst fra delingsmenyen, eller åpne <strong>Legg til oppskrift</strong> og velg <strong>Lim inn lenke</strong>. Matlyst leser siden eller teksten i innlegget og gjør den om til en oppskrift: ingredienser med mengder, nummererte steg og bilde der det finnes. Nettsider, Instagram, TikTok (også korte lenker) og YouTube-beskrivelser fungerer. Med Matlyst Pro kan du også importere fra bilder, opptil 20 per oppskrift.')
      + '<h3>2. Sjekk den og gjør den til din</h3>'
      + p('Les oppskriften før du lagrer. Rett en mengde, gi en ingrediens nytt navn eller skriv et notat. Oppskrifter på andre språk oversettes til norsk bokmål. Matlyst bruker metriske enheter som standard.')
      + '<h3>3. Finn den igjen med en gang</h3>'
      + p('Søk på tittel eller ingrediens, eller åpne en mappe. Skriv «hvitløk», så ser du alle lagrede oppskrifter som bruker den. Merk favorittene, og la lenken til kilden bli stående på hver oppskrift, så du kan gå tilbake til den som lagde den.')],
    ['Hva en oppskriftsapp egentlig bør gjøre', p('De fleste har allerede en oppskriftssamling. Den er bare spredt: et notat her, et skjermbilde der, en lagret video du ikke finner igjen. En god oppskriftsapp gjør fire ting.')
      + '<h3>Den samler alt på ett sted</h3>'
      + p('Oppskrifter fra nettsider, sosiale medier og bilder lagres på samme måte, i mapper du velger selv. Alle oppskrifter har samme oppsett, så du slipper å lete i tre apper for å finne den ene.')
      + '<h3>Den gjør lagrede oppskrifter lette å finne</h3>'
      + p('En samling du ikke kan søke i, er bare en større haug. Du bør kunne søke på ingredienser, for det er slik du bestemmer hva du skal lage en tirsdag kveld.')
      + '<h3>Den gjør oppskrifter til en plan</h3>'
      + p('Legg oppskrifter i en ukemeny, så går ingrediensene til én handleliste, slått sammen og sortert etter hylle i butikken. Les mer om <a href="/ukemeny/">ukemenyen</a> og <a href="/handleliste/">handlelista som lages fra oppskrifter</a>.')
      + '<h3>Den hjelper deg mens du lager maten</h3>'
      + p('Kokemodus viser oppskriften som én sjekkliste du kan krysse av underveis. Når et steg nevner en tid, foreslår Matlyst en tidtaker. Tidtakeren går videre i bakgrunnen, og skjermen slukner ikke. Kokemodus krever internettforbindelse.')],
    ['Regn om oppskriften til flere eller færre', p('Velg mellom 1 og 20 porsjoner, så endres alle mengdene. Omregningen er lineær, så sjekk egg, salt og hevemiddel selv når du baker. De kan ikke alltid bare ganges opp.')],
    ['Fire situasjoner, og hva du gjør', sn()
      + sc('Tenk deg at du så en TikTok der mengdene bare blir sagt', {
        situasjon: 'Den som lager videoen sier «en god skvett soyasaus og omtrent to ss honning», og i bildeteksten står det bare emojier.',
        galt: 'Du tar skjermbilde av videoen, ser den aldri igjen, og oppskriften er borte.',
        gjor: 'Del videoen med oppskriftsappen din, og les resultatet før du stoler på det.',
        tall: 'Matlyst leser bildeteksten. Den transkriberer ikke videoen, så mengder som bare blir sagt, kommer ikke med.',
        matlyst: 'Del videoen, sjekk utkastet, skriv inn mengdene du hørte, og lagre.' })
      + sc('Tenk deg at du har arvet et håndskrevet oppskriftskort', {
        situasjon: '«Smør på størrelse med et egg», et flekkete hjørne og skrå håndskrift.',
        galt: 'Kortet blir liggende i en skuff, og ingen lager maten.',
        gjor: 'Ta bilde av det og importer det som en oppskrift du kan søke i og regne om. Bildeimport er en Matlyst Pro-funksjon.',
        tall: 'Håndskrift er det vanskeligste tilfellet. Sjekk hver mengde mot kortet før du lagrer.',
        matlyst: 'Importer fra bilde, og rett alt som ble lest feil.' })
      + sc('Tenk deg at én oppskrift ligger på fem steder', {
        situasjon: 'Et notat, et bokmerke, et skjermbilde, en lagret reel og en video.',
        galt: 'Du vet ikke hvilken utgave som er den gode.',
        gjor: 'Behold én kopi på ett sted, og skriv et notat om hva du har endret.',
        matlyst: 'Én oppskrift med lenke til kilden, og dine egne endringer oppå.' })
      + sc('Tenk deg at du planlegger middager for en familie på fire', {
        situasjon: 'Fem middager, ett budsjett og én tur til butikken.',
        galt: 'To oppskrifter trenger hver sin løk, og du kjøper tre.',
        gjor: 'Planlegg uka først, og handle fra én samlet liste.',
        matlyst: 'Legg oppskriftene i ukemenyen og åpne handlelista. Like varer med samme enhet legges sammen, og varer du allerede har i spiskammeret, er fravalgt og merket «Har hjemme» når du legger til en oppskrift.' })],
    ['Bytt ut en ingrediens eller lag din egen versjon', p('Mangler du kefir eller de friske urtene? Åpne oppskriften og be Spør Matlyst om en erstatning. <strong>Bruk det jeg har</strong> foreslår erstatninger fra varene i spiskammeret ditt. Du kan også be om en vegetarisk, vegansk, raskere eller mindre utgave, eller skrive hva du selv vil ha, for eksempel «gjør den mer spennende».')
      + p('Endringene vises som en liste du kan angre. Når du lagrer, velger du <strong>Lag en kopi</strong>, som beholder originalen og lenker tilbake til kilden merket «tilpasset», eller <strong>Overskriv</strong>, som skriver over din egen oppskrift. Spør Matlyst er en Pro-funksjon, bruker KI og har en månedlig kvote. Sjekk resultatet før du lager maten.')],
    ['Spiskammeret ditt, og oppskriftene du glemte', p('Matlyst kan holde styr på hva du har hjemme. Søk i de lagrede oppskriftene dine på en ingrediens fra kjøleskapet og se hvilke som bruker den. I gratisversjonen viser spiskammeret 5 varer. Les mer om <a href="/spiskammer-app/">spiskammer-appen</a>.')
      + p('En kveld hadde jeg en boks miso i kjøleskapet, søkte på «miso» og fant en misokylling jeg hadde lagret og glemt. Middagen var avgjort på et par sekunder. For min ADHD-hjerne betyr det noe. Middagen er bestemt, og jeg kan gå videre med resten av dagen.')],
    ['Hva en oppskriftsapp gjør bedre enn andre måter å ta vare på oppskrifter på', p('De fleste bruker en blanding av alternativene under. Hvert av dem fungerer til noe, og hvert av dem svikter et sted.')
      + '<div class="table-wrap"><table><thead><tr><th>Måte å ta vare på oppskrifter</th><th>Hva den gjør bra</th><th>Hvor den svikter</th></tr></thead><tbody>'
      + '<tr><td>Skjermbilder og lagrede innlegg</td><td>Raskt å lagre, ingen skriving.</td><td>Du kan ikke søke på ingrediens eller regne om mengder, og innlegget kan forsvinne.</td></tr>'
      + '<tr><td>Notatapp eller dokumenter</td><td>Fleksibelt, og alt er ditt.</td><td>Hver oppskrift ser forskjellig ut, og ingenting henger sammen med en handleliste.</td></tr>'
      + '<tr><td>Trykte kort og kokebøker</td><td>Pålitelige på kjøkkenet og fulle av familiehistorie.</td><td>Én kopi som lett blir flekkete eller borte, og ingen søk.</td></tr>'
      + '<tr><td>En oppskriftsapp</td><td>Ett oppsett for alt, søkbart, kan regnes om og henger sammen med ukemeny og handleliste.</td><td>Du må lagre oppskriften én gang, og mengder som bare blir sagt i videoer, må fortsatt skrives inn.</td></tr>'
      + '</tbody></table></div>'
      + p('Skal du sammenligne apper? Guiden vår om <a href="/blogg/velg-oppskriftsapp/">hvordan du velger en oppskriftsapp</a> viser hva du bør se etter, uansett hvilken du ender opp med.')],
    ['Hva Matlyst ikke gjør', p('Et godt verktøy sier fra om hvor grensene går. Her er det du bør vite, så du slipper overraskelser på kjøkkenet.')
      + '<ul><li><strong>Den leser tekst, ikke lyd.</strong> Matlyst transkriberer ikke videoer. Hvis mengdene bare blir sagt, må du skrive dem inn etter importen.</li>'
      + '<li><strong>Den leser ikke kommentarfelt.</strong> Har den som lagde innlegget lagt oppskriften i en kommentar eller bak en lenke i profilen, må du kopiere den inn selv eller dele lenken til selve oppskriftssiden.</li>'
      + '<li><strong>Én oppskrift per innlegg.</strong> Viser en reel tre oppskrifter, må du dele dem opp selv.</li>'
      + '<li><strong>KI kan ta feil.</strong> Matlyst bruker KI til å lese og oversette oppskrifter, så sjekk mengder og steg før du lager maten, særlig fra bilder og håndskrift.</li>'
      + '<li><strong>Kokemodus krever internett.</strong> Du kan lese en lagret oppskrift uten nett i opptil 30 dager etter siste synkronisering.</li></ul>'],
    ['Vanlige feil når du rydder oppskrifter', p('Dette er feilene som koster folk mest tid.')
      + '<ul><li><strong>Å lagre uten å lese.</strong> Det er mengdene som oftest blir feil. Les utkastet én gang, hver gang.</li>'
      + '<li><strong>Å ha fem kopier.</strong> Velg ett sted. Skriv et notat om hva du har endret, så du slipper å gjette neste gang.</li>'
      + '<li><strong>Å lagre bare videoen.</strong> Da ser du den på nytt hver gang du skal lage maten. Lagre oppskriften i stedet.</li>'
      + '<li><strong>Å bygge det perfekte mappesystemet først.</strong> Begynn med noen få mapper, som hverdagsmiddager og høytider, og legg til flere først når du trenger dem.</li>'
      + '<li><strong>Å glemme kilden.</strong> La lenken til den som lagde oppskriften stå på oppskriften, så finner du de andre oppskriftene deres senere.</li></ul>'],
    ['Oppskriftene dine er dine', p('Du kan eksportere alle oppskriftene dine når som helst, gratis, som en Matlyst-fil (en zip med mapper og bilder) eller som HTML. Skal du flytte fra Paprika? <a href="/bytt-fra-paprika/">Importer Paprika-eksporten</a>, så blir kategoriene dine til mapper.')
      + p('Oppskrifter og handleliste kan leses uten nett i opptil 30 dager etter siste synkronisering. Redigering og kokemodus trenger forbindelse.')
      + p('Har du håndskrevne familieoppskrifter? Se siden om <a href="/handskrevne-oppskrifter/">håndskrevne oppskrifter</a>. Vil du hente flere oppskrifter inn, finner du oversikten på <a href="/importer-oppskrifter/">importer oppskrifter</a>.')],
    ['Abonnement, grenser og deling', p('Matlyst er gratis å komme i gang med: 5 importer per kalendermåned, og spiskammeret viser 5 varer. Lagring av oppskrifter, mapper, søk, ukemeny og handleliste er med i gratisversjonen. Matlyst Pro gir flere importer, bildeimport, Spør Matlyst og muligheten til å opprette en husstand.')
      + p('Et Pro-medlem kan opprette en husstand for opptil 6 personer, og det er gratis å bli med. Handlelista, ukemenyen og spiskammeret deles og oppdateres direkte hos alle. På siden om <a href="/handleliste/">handlelista</a> står det hvordan delingen fungerer.')],
  ],
}).html;

const instagram = byggRik({
  lang: 'nb',
  svarTekst: 'Åpne innlegget eller reelen, trykk på Del, velg Matlyst, og sjekk utkastet til oppskrift som appen lager fra teksten i innlegget. Lagre den, så har du en søkbar oppskrift med ingredienser og steg i stedet for et bokmerke du aldri finner igjen. Det fungerer når oppskriften står i bildeteksten.',
  seksjoner: [
    ['Tre måter folk lagrer Instagram-oppskrifter på, og hvor hver av dem svikter', p('De fleste bruker en av disse. Alle tre fungerer helt til du faktisk skal bruke oppskriften.')
      + '<h3>Instagrams egen lagre-knapp</h3>'
      + p('Det går raskt, og innlegget blir liggende under Lagret. Haken er at det er et bokmerke, ikke en oppskrift. Du kan ikke søke på ingrediens, regne om porsjoner eller legge den på en handleliste, og hvis den som lagde innlegget sletter det, er det borte.')
      + '<h3>Skjermbilde eller kopiert tekst</h3>'
      + p('Du beholder teksten, men et skjermbilde av en lang bildetekst er vanskelig å lese senere, og kopiert tekst blir en lang tekstklump i et notat. Ingen av delene lar seg søke i på samme måte som en ekte oppskrift.')
      + '<h3>Å lagre reelen i bildegalleriet</h3>'
      + p('Du beholder videoen, men mengdene blir ofte bare sagt eller vist et sekund på skjermen. Du ser den på nytt hver gang du skal lage maten.')
      + '<h3>Å dele rett med en oppskriftsapp</h3>'
      + p('Innlegget blir en strukturert oppskrift med ingredienser, mengder og nummererte steg. Det er det resten av denne guiden viser.')],
    ['Slik lagrer du en oppskrift fra Instagram, steg for steg', ill('share-instagram-post-to-matlyst', 'Slik deler du et Instagram-innlegg med Matlyst med noen få trykk.')
      + '<ol><li><strong>Åpne innlegget eller reelen</strong> som har oppskriften i bildeteksten.</li>'
      + '<li><strong>Trykk på del-ikonet</strong> (papirflyet), og velg Matlyst blant appene. Ser du den ikke med en gang, blar du i applisten.</li>'
      + '<li><strong>Vent et øyeblikk</strong> mens Matlyst leser bildeteksten.</li>'
      + '<li><strong>Les utkastet.</strong> Sammenlign mengder og steg med innlegget.</li>'
      + '<li><strong>Rett det som ser rart ut,</strong> velg en mappe og lagre.</li></ol>'
      + p('Vil du heller ikke bruke delingsmenyen? Kopier lenken til innlegget, åpne <strong>Legg til oppskrift</strong> i Matlyst og velg <strong>Lim inn lenke</strong>. Kan du kopiere selve oppskriftsteksten, men lenken ikke lar seg lese, limer du inn teksten under <strong>Skriv inn</strong>.')],
    ['Dette fant vi da vi testet det', p('18. november 2026 importerte vi to ekte reels. En kort bildetekst med 5 ingredienser og 5 steg kom gjennom med 5 av 5 ingredienser og 5 av 5 steg. En lang bildetekst på 1 716 tegn, med 18 ingredienser i tre grupper, kom gjennom med 18 av 18 ingredienser og 5 av 5 steg, selv om Instagram kutter lange tekster med «… mer».')
      + p('Det er to reels, ikke et løfte. Bildetekster varierer, så les utkastet hver gang. Det er mengdene som oftest blir feil.')],
    ['Når oppskriften ikke står i bildeteksten', p('Noen legger oppskriften i en kommentar, bak en lenke i profilen eller bare i videoen. Her er hva Matlyst kan og ikke kan gjøre.')
      + '<ul><li><strong>Oppskrift i en kommentar eller lenke i profilen.</strong> Matlyst leser ikke kommentarer. Kopier oppskriften fra kommentaren og lim den inn under <strong>Skriv inn</strong>, eller del lenken hvis den går til en oppskriftsside.</li>'
      + '<li><strong>Oppskrift som bare blir sagt i videoen.</strong> Matlyst transkriberer ikke tale eller tekst som bare vises i videoen, og den laster ikke ned videoen. Se den én gang, og legg inn mengdene selv etter importen.</li>'
      + '<li><strong>Flere oppskrifter i én reel.</strong> Matlyst importerer én oppskrift per innlegg. Del dem opp for hånd.</li>'
      + '<li><strong>Private, slettede eller begrensede innlegg.</strong> Matlyst trenger tilgang til et offentlig innlegg, så det er ikke sikkert at de lar seg lese.</li></ul>'],
    ['Dette bør du sjekke i utkastet før du lagrer', p('Det tar et minutt å lese utkastet, og det er steget som avgjør om oppskriften fungerer. Sjekk i denne rekkefølgen.')
      + '<ol><li><strong>Mengder og enheter.</strong> Har hver ingrediens et tall? Mangler det en mengde, har som regel ikke den som lagde innlegget skrevet en. Matlyst bruker metriske enheter som standard. Sjekk at tallene er rimelige.</li>'
      + '<li><strong>Ingrediensgrupper.</strong> Lange bildetekster deler ofte ingrediensene i grupper, som saus, fyll og topping. Sjekk at ingenting havnet i feil gruppe.</li>'
      + '<li><strong>Ovnstemperatur og tider.</strong> Disse er lette å overse i en lang tekst. Sammenlign med innlegget.</li>'
      + '<li><strong>Stegene.</strong> Står de i riktig rekkefølge, og er hvert steg noe du gjør? Fjern det som er en spøk eller en emneknagg.</li>'
      + '<li><strong>Språk.</strong> Var bildeteksten på et annet språk, er oppskriften oversatt til norsk. Se på ingrediensnavn du ikke kjenner igjen.</li></ol>'
      + p('Matlyst bruker KI til å lese og oversette oppskrifter, og KI kan ta feil. Derfor kommer utkastet først og lagringen etterpå.')],
    ['Etter at du har lagret: hva du kan gjøre med oppskriften', p('En lagret oppskrift er en vanlig Matlyst-oppskrift, og det betyr at du får alt det andre også.')
      + '<ul><li><strong>Regn den om</strong> til mellom 1 og 20 porsjoner.</li>'
      + '<li><strong>Planlegg den.</strong> Legg den i <a href="/ukemeny/">ukemenyen</a>, og send ingrediensene til én <a href="/handleliste/">handleliste</a>, slått sammen og sortert etter hylle i butikken.</li>'
      + '<li><strong>Lag maten fra den.</strong> Kokemodus viser stegene som en sjekkliste og foreslår tidtakere fra teksten i stegene. Den krever internettforbindelse.</li>'
      + '<li><strong>Tilpass den.</strong> Med Spør Matlyst, en Pro-funksjon, kan du be om en vegansk, raskere eller mindre utgave og lagre den som en kopi.</li>'
      + '<li><strong>Ta den med deg.</strong> Eksporter alle oppskrifter gratis som en Matlyst-fil eller HTML.</li></ul>'
      + p('Matlyst er gratis å komme i gang med, med 5 importer per kalendermåned. Matlyst Pro gir flere importer og bildeimport.')],
    ['Fire situasjoner, og hva du gjør', sn()
      + sc('Tenk deg at bildeteksten slutter med «… mer»', {
        situasjon: 'Du ser en pastagrateng, trykker, og teksten er kuttet etter ingrediensene.',
        galt: 'Du lagrer innlegget og finner senere en halv oppskrift.',
        gjor: 'Del innlegget og les utkastet før du lagrer.',
        tall: 'Da vi testet en lang bildetekst, kom alle de 18 ingrediensene og alle de 5 stegene med.',
        matlyst: 'Del, les utkastet, legg til det som mangler, og lagre.' })
      + sc('Tenk deg at mengdene bare blir sagt i en voiceover', {
        situasjon: 'Den som lager videoen sier «fire deciliter mel» høyt og skriver ingenting.',
        galt: 'Matlyst leser bildeteksten, ikke lyden, så det er ingen mengder å importere.',
        gjor: 'Se én gang, og skriv inn mengdene du hører.',
        matlyst: 'Importer innlegget, rediger ingredienslista og lagre.' })
      + sc('Tenk deg at du har lagret 40 oppskrifter og ikke finner suppa', {
        situasjon: 'Lagret-fanen din på Instagram er et langt rutenett av miniatyrbilder.',
        galt: 'Du blar i ti minutter og gir opp.',
        gjor: 'Flytt oppskriftene du faktisk lager, over i en søkbar samling.',
        matlyst: 'Søk på «linser», eller åpne en mappe.' })
      + sc('Tenk deg at du vil ha oppskriften til seks, ikke fire', {
        situasjon: 'Den som lager videoen lager mat til fire, og du har gjester.',
        galt: 'Du regner i hodet og bommer på saltet.',
        gjor: 'Regn om porsjonene. Omregningen er lineær, så sjekk egg og hevemiddel selv når du baker.',
        matlyst: 'Endre porsjonene fra 4 til 6. Du kan velge mellom 1 og 20.' })],
    ['Det egentlige problemet: ingen mengder', p('Den vanligste grunnen til at en lagret Instagram-oppskrift er ubrukelig, er at den som lagde innlegget aldri skrev ned mengdene. Matlyst kan ikke finne på dem, og skal heller ikke det. Står det «salt og pepper» uten mengde, eller bare «en skvett soyasaus», er utkastet et utgangspunkt. Smak til, juster og lagre dine egne mengder, så slipper du å gjette neste gang.')],
    ['Respekt for den som lagde oppskriften', p('Hver oppskrift som lagres fra Instagram, viser kilden: plattformen og brukernavnet til den som lagde innlegget, i et merke på oppskriften. Trykk på det for å åpne originalinnlegget, eller profilen hvis lenken til innlegget mangler, så du kan komme tilbake for flere oppskrifter. Jeg bygde det slik av respekt for dem som skriver oppskriftene. Når du tilpasser en oppskrift med Spør Matlyst, beholder kopien den opprinnelige kilden, merket «tilpasset».')
      + p('Matlyst lagrer den strukturerte oppskriften og lenken til kilden. Den laster ikke ned reelen som videofil.')],
    ['Vanlige feil', '<ul><li><strong>Å lagre uten å sjekke.</strong> Les utkastet én gang. Det er mengdene som oftest blir feil.</li>'
      + '<li><strong>Å stole på et skjermbilde.</strong> Det er et bilde, ikke en oppskrift.</li>'
      + '<li><strong>Å lagre bare reelen.</strong> Du ser den på nytt hver gang.</li>'
      + '<li><strong>Å ikke ta vare på kilden.</strong> La lenken til den som lagde oppskriften stå på oppskriften.</li></ul>'
      + p('Når oppskriften er lagret, kan du regne den om, legge den i <a href="/ukemeny/">ukemenyen</a> og sende ingrediensene til <a href="/handleliste/">handlelista</a>. Vil du se helheten, finner du den på siden om <a href="/oppskriftsbok-app/">oppskriftsappen</a>. Du kan også lagre fra <a href="/lagre-oppskrifter-fra-tiktok/">TikTok</a>, og se alle mulighetene under <a href="/importer-oppskrifter/">importer oppskrifter</a>.')],
  ],
}).html;

const tiktok = byggRik({
  lang: 'nb',
  svarTekst: 'Åpne TikTok-videoen, trykk på Del, velg Matlyst, og se over utkastet til oppskrift som er laget fra bildeteksten. Lagre den, så kan du søke i den, regne den om og handle fra den. Det fungerer når oppskriften står i bildeteksten. Korte lenker som vm.tiktok.com fungerer også.',
  seksjoner: [
    ['Hvorfor TikToks egne favoritter ikke holder', p('Favoritter tar vare på videoen, ikke oppskriften. Du ser på de samme førti sekundene hver gang du skal lage maten, du kan ikke søke på ingrediens, og hvis den som lagde videoen sletter den, er oppskriften din borte.')],
    ['Slik lagrer du en oppskrift fra TikTok, steg for steg', ill('share-tiktok-video-to-matlyst', 'Slik deler du en TikTok med Matlyst med noen få trykk.')
      + '<ol><li><strong>Åpne TikTok-videoen</strong> som har oppskriften i bildeteksten.</li>'
      + '<li><strong>Trykk på Del,</strong> og velg <strong>Matlyst</strong>. Er den ikke synlig, åpner du applisten og velger den derfra. Du kan også kopiere lenken og lime den inn under <strong>Lim inn lenke</strong> i Matlyst.</li>'
      + '<li><strong>Vent et øyeblikk</strong> mens Matlyst leser bildeteksten.</li>'
      + '<li><strong>Les utkastet.</strong> Sammenlign mengder og steg med videoen.</li>'
      + '<li><strong>Rett det som ser rart ut,</strong> velg en mappe og lagre.</li></ol>'
      + p('Korte lenker som vm.tiktok.com, vt.tiktok.com og tiktok.com/t/ støttes.')],
    ['Når bildeteksten ikke har noen oppskrift', p('Matlyst leser bildeteksten, ikke lyden. Matlyst transkriberer ikke tale eller tekst som bare vises i videoen, og den laster ikke ned videoen. Sier den som lager videoen «to ss honning» høyt og skriver ingenting, er det ingenting å importere. Lag oppskriften for hånd med mengdene du hører, eller se etter en skriftlig utgave på profilen eller nettsiden til den som lagde videoen. En TikTok helt uten tekst lar seg ikke importere.')],
    ['Dette bør du sjekke i utkastet før du lagrer', p('Bruk et minutt på utkastet. Det er steget som avgjør om oppskriften fungerer når du lager maten.')
      + '<ul><li><strong>Mengder og enheter.</strong> Mangler det et tall, har som regel ikke den som lagde videoen skrevet det. Matlyst bruker metriske enheter som standard, så sjekk at tallene er rimelige.</li>'
      + '<li><strong>Steg i riktig rekkefølge.</strong> TikTok-tekster er korte og noen ganger rotete. Flytt eller slett steg til de stemmer med videoen.</li>'
      + '<li><strong>Temperaturer og tider.</strong> Sammenlign med det som blir sagt eller vist.</li>'
      + '<li><strong>Oversatte navn.</strong> Var teksten på et annet språk, er oppskriften oversatt til norsk. Sjekk ingrediensnavn du ikke kjenner igjen.</li></ul>'
      + p('Matlyst bruker KI til å lese og oversette oppskrifter, og KI kan ta feil. Les før du lager maten.')],
    ['Etter at du har lagret', p('Oppskriften er nå en vanlig Matlyst-oppskrift. Regn den om fra 1 til 20 porsjoner, legg den i <a href="/ukemeny/">ukemenyen</a> og send ingrediensene til <a href="/handleliste/">handlelista</a>. Åpne den i kokemodus for en sjekkliste og tidtakere som foreslås fra stegene. Gratisversjonen har 5 importer per kalendermåned, og Matlyst Pro gir flere.')],
    ['Fire situasjoner, og hva du gjør', sn()
      + sc('Tenk deg at en video på 30 sekunder bare viser mengdene på skjermen', {
        situasjon: 'Mengdene blinker forbi og står ikke i bildeteksten.',
        galt: 'Du myser, går glipp av én og gjetter.',
        gjor: 'Sett videoen på pause, skriv mengdene inn i en ny oppskrift og la videolenken stå som kilde.',
        matlyst: 'Importer videoen, skriv inn mengdene du så, og lagre.' })
      + sc('Tenk deg at du vil lage oppskriften til seks, ikke to', {
        situasjon: 'Den som lager videoen lager én porsjon, og du har gjester.',
        galt: 'Du ganger med tre i hodet og mister oversikten over krydderet.',
        gjor: 'Regn om oppskriften. Omregningen er lineær, så sjekk egg og hevemiddel selv når du baker.',
        matlyst: 'Endre antall porsjoner. Du kan velge mellom 1 og 20.' })
      + sc('Tenk deg at du har lagret ti TikTok-oppskrifter denne uka', {
        situasjon: 'Alle ligger i favoritter, uten noe system.',
        galt: 'På tirsdag finner du ikke kyllingretten.',
        gjor: 'Flytt de du skal lage, inn i mapper, og søk på ingrediens.',
        matlyst: 'Lagre i en mappe for hverdagsmiddager, og søk så på «kylling».' })
      + sc('Tenk deg at den som lager videoen skriver «smak til»', {
        situasjon: 'Det står ingen mengde for saltet, sitronen eller chilien.',
        galt: 'Du krydrer for mye eller for lite og husker aldri hvor mye du brukte.',
        gjor: 'Se på det som et utgangspunkt: ta en klype, smak, juster.',
        matlyst: 'Rediger oppskriften og skriv ned mengden du endte på, så slipper du å gjette neste gang.' })],
    ['Respekt for den som lagde videoen', p('Hver oppskrift som lagres fra TikTok, viser brukernavnet til den som lagde videoen og en lenke tilbake til originalvideoen, eller til profilen hvis videolenken mangler. Det gjør vi av respekt for den som lagde oppskriften, og det lar deg komme tilbake for flere av dem.')],
    ['Vanlige feil', '<ul><li><strong>Å ikke lese utkastet før du lagrer.</strong> Det er mengdene som oftest blir feil.</li>'
      + '<li><strong>Å forvente mengder som bare ble sagt.</strong> Matlyst leser tekst, ikke lyd.</li>'
      + '<li><strong>Å lagre videolenken som oppskriften.</strong> Lagre selve oppskriften.</li></ul>'
      + p('Flere måter å lagre på: <a href="/lagre-oppskrifter-fra-instagram/">Instagram</a>, <a href="/importer-oppskrifter/">importer oppskrifter</a> og oversikten over <a href="/oppskriftsbok-app/">oppskriftsappen</a>.')],
  ],
}).html;

const spiskammer = byggRik({
  lang: 'nb',
  svarTekst: 'Legg inn det du har på kjøkkenet, så viser Matlyst hva du har, hvor mange dager det er igjen på hver vare, og hvilke av de lagrede oppskriftene dine som bruker den. Varer du allerede har i spiskammeret, er fravalgt og merket «Har hjemme» når du legger til en oppskrift på handlelista, så du ikke kjøper en ny boks.',
  seksjoner: [
    ['Hvorfor en liste over spiskammeret hjelper', p('Matsvinn handler som regel om hukommelse, ikke matlaging. Du glemmer at spinaten finnes, restene havner bakerst, og en uke senere havner det i søpla. Skriver du det ned én gang, husker du det.')
      + founder(['Nå søker jeg på det jeg har i spiskammeret, finner misokyllingen jeg hadde lagret, og middagen er avgjort på et par sekunder.'], 'Patrick, grunnlegger av Matlyst. Vi spiser oss gjennom kjøleskapet i stedet for å kaste maten.')],
    ['Hva spiskammeret gjør i Matlyst', '<h3>Det holder en liste med dager igjen</h3>'
      + p('Legg inn en vare med utløpsdato, så viser spiskammeret hvor mange dager som er igjen. Da har du det som går ut først, friskt i minnet. I gratisversjonen viser spiskammeret 5 varer.')
      + '<h3>Det finner oppskrifter du allerede har lagret</h3>'
      + p('Søk i dine egne oppskrifter på en ingrediens fra kjøleskapet, for eksempel «miso», og se hva du kan lage. Det er vanlig søk, så det fungerer uten KI. Se <a href="/hva-kan-jeg-lage/">hva kan jeg lage</a> og <a href="/tom-kjoleskapet/">tøm kjøleskapet</a>.')
      + '<h3>Det foreslår middager fra det du har (Pro)</h3>'
      + p('I Spør Matlyst lager <strong>Lag noe av det jeg har</strong> middagsforslag fra varene i spiskammeret ditt, med tilberedningstid. Det bruker KI og har en månedlig kvote, så les resultatet før du lager maten.')
      + '<h3>Det bytter ut det du mangler</h3>'
      + p('Er du tom for kefir? Åpne oppskriften og be Spør Matlyst om en erstatning som bruker det du har i spiskammeret. Du ser endringene som en liste og kan angre dem. Se også <a href="/erstatning/">hva du kan bruke i stedet</a>, og <a href="/hva-kan-jeg-lage/">hva du kan lage med det du har</a>.')
      + '<h3>Det holder dubletter unna handlelista</h3>'
      + p('Varer du allerede har i spiskammeret, er fravalgt og merket «Har hjemme» når du legger til en oppskrift på <a href="/handleliste/">handlelista</a>, så du ikke kjøper enda en boks av det du har. Har du en husstand, deles spiskammeret med den og oppdateres direkte.')],
    ['Slik setter du opp spiskammeret på ti minutter', p('Du trenger ikke føre opp hele kjøkkenet. En kort liste du holder oppdatert, slår en perfekt liste du gir opp.')
      + '<ol><li><strong>Begynn med det som blir dårlig først.</strong> Ferske grønnsaker, meieriprodukter, åpnede glass og alt du kjøpte til én oppskrift og har igjen.</li>'
      + '<li><strong>Legg inn utløpsdato der pakken har en.</strong> For fersk mat uten dato legger du inn dagen du kjøpte den og bruker skjønn.</li>'
      + '<li><strong>Ta fryseren etterpå.</strong> Før opp hva som ligger der, med dato, så det eldste brukes først.</li>'
      + '<li><strong>Hopp over basisvarene</strong> du aldri går tom for, som salt og olje, til du vil ha dem på lista.</li>'
      + '<li><strong>Oppdater den når du handler og når du lager mat.</strong> To minutter da sparer deg for ti senere.</li></ol>'
      + p('I gratisversjonen viser spiskammeret 5 varer. Det holder til å prøve ut vanen på det som blir dårlig først.')],
    ['Bruk spiskammeret og ukemenyen sammen', p('Spiskammeret gjør mest nytte når du planlegger ut fra det. Slik fungerer det i en vanlig uke.')
      + '<ol><li>Åpne spiskammeret og se hva som går ut først.</li>'
      + '<li>Søk i de lagrede oppskriftene dine på de ingrediensene, og sett to eller tre i <a href="/ukemeny/">ukemenyen</a>.</li>'
      + '<li>Send ingrediensene til handlelista. Varer du har i spiskammeret, er fravalgt og merket «Har hjemme» når du legger til en oppskrift, så du handler det som mangler.</li>'
      + '<li>Lag maten, og oppdater spiskammeret.</li></ol>'
      + p('Det er fortsatt du som bestemmer hva som kommer på planen. Matlyst fyller ikke uka for deg.')],
    ['Del spiskammeret med husstanden', p('Et Pro-medlem kan opprette en husstand for opptil 6 personer, og det er gratis å bli med. Handlelista, ukemenyen og spiskammeret deles og oppdateres direkte hos alle. Den som nettopp brukte de siste eggene, kan ta dem av lista, og den som står i butikken, ser det med en gang.')],
    ['Hva Matlyst ikke gjør', '<ul><li><strong>Den skanner ikke strekkoder.</strong> Du legger inn varer for hånd.</li>'
      + '<li><strong>Den vet ikke hva som faktisk ligger i kjøleskapet.</strong> Listen er bare så god som forrige gang du oppdaterte den.</li>'
      + '<li><strong>Den avgjør ikke matsikkerhet for deg.</strong> Datoen du legger inn, er en påminnelse, ikke en vurdering av om maten er trygg. Bruk sunn fornuft, og se Mattilsynets råd.</li></ul>'],
    ['Om hvor lenge maten holder', p('Vi gir ingen tabell med antall dager og temperaturer her, for tallene skal komme fra Mattilsynet og ikke fra oss. Du finner råd om oppbevaring, rester og temperatur i kjøleskapet på <a href="https://www.mattilsynet.no/mat-og-drikke">Mattilsynets sider om mat og drikke</a>. Les datoen på pakken, og når du er i tvil, så kast.')
      + p('En vane jeg tok med meg fra profesjonelle kjøkken: rått kjøtt skal stå nederst i kjøleskapet, under mat som ikke skal varmebehandles mer, slik at ingenting kan dryppe ned på den. Som kjøletekniker så jeg det gjort med vilje, hver dag. Det koster ingenting, og det virker.')],
    ['Fire situasjoner, og hva du gjør', sn()
      + sc('Tenk deg at du har en halv grillkylling, spinat og ris', {
        situasjon: 'Klokka er seks, og ingenting ser ut til å henge sammen.',
        galt: 'Du bestiller takeaway, og kyllingen havner i søpla på fredag.',
        gjor: 'Søk i oppskriftene dine på «kylling» og «spinat», eller be om forslag fra det du har.',
        matlyst: 'Søk på ingrediens, eller bruk Spør Matlyst, en Pro-funksjon.' })
      + sc('Tenk deg at tre ting går ut denne uka', {
        situasjon: 'En boks yoghurt, en pose spinat og en pakke kyllinglår.',
        galt: 'Du handler til fem nye middager, og de gamle blir dårlige.',
        gjor: 'Planlegg to middager rundt varene som går ut først.',
        matlyst: 'Legg inn varene, se på dagene som er igjen, og sett passende oppskrifter i ukemenyen.' })
      + sc('Tenk deg at fryseren din er et mysterium', {
        situasjon: 'Umerkede poser nederst i fryseren.',
        galt: 'Du vet ikke hva de er eller hvor gamle de er.',
        gjor: 'Før opp det som ligger der, så det eldste går først.',
        matlyst: 'Legg inn hver vare med en dato.' })
      + sc('Tenk deg at det er uka før en reise', {
        situasjon: 'Kjøleskapet er halvfullt, og du drar på lørdag.',
        galt: 'Du handler en full handlekurv og kommer hjem til mat som har blitt dårlig.',
        gjor: 'Planlegg måltidene fra spiskammeret og handle bare det som mangler.',
        matlyst: 'Sjekk spiskammeret, planlegg uka og send bare det som mangler, til handlelista.' })],
    ['Vanlige feil', '<ul><li><strong>Å føre opp bare ferskvarer.</strong> Også i fryseren og tørrvareskapet går mat til spille.</li>'
      + '<li><strong>Å aldri oppdatere lista.</strong> Fjern varer når de er brukt, ellers slutter lista å stemme.</li>'
      + '<li><strong>Å kjøpe dubletter.</strong> Sjekk spiskammeret før du handler.</li></ul>'
      + p('Se videre hvordan spiskammeret henger sammen med <a href="/ukemeny/">ukemenyen</a> og hele <a href="/oppskriftsbok-app/">oppskriftsappen</a>.')],
  ],
}).html;

const handleliste = byggRik({
  lang: 'nb',
  svarTekst: 'Legg til en oppskrift, eller en hel planlagt uke, på handlelista i Matlyst, så havner ingrediensene på én liste. Like varer med samme enhet legges sammen, lista er sortert etter hylle i butikken, og varer du allerede har i spiskammeret, er fravalgt og merket «Har hjemme» når du legger til en oppskrift.',
  seksjoner: [
    ['Slik lager du en handleliste fra oppskrifter', '<ol><li><strong>Åpne en oppskrift eller ukemenyen.</strong> Velg én oppskrift, eller en dag eller uke du har planlagt.</li>'
      + '<li><strong>Legg den til på handlelista.</strong> Ingrediensene havner på lista med mengdene oppskriften har.</li>'
      + '<li><strong>Handle etter hylle.</strong> Varene er gruppert etter hylle i butikken, for eksempel frukt og grønt, meieri og krydder. Kryss av underveis.</li></ol>'
      + p('Det fungerer med alle oppskrifter i Matlyst, enten du har lagret dem fra en nettside, TikTok eller Instagram, eller skrevet dem inn selv. Du kan også legge til ting som ikke står i en oppskrift, som kaffe og tørkepapir.')],
    ['Hva skjer når to oppskrifter trenger det samme', p('Tenk deg at to oppskrifter trenger hver sin løk. Da får du én linje for løk, ikke to. Matlyst legger varer med samme navn på én linje. Er enhetene forskjellige, som 2 dl i én oppskrift og 200 g i en annen, står begge mengdene på samme linje, for eksempel «2 dl · 200 g». Matlyst gjetter ikke hvordan de skal regnes om. Vil du ha én mengde, trykker du på mengden og skriver inn én mengde og enhet.')
      + p('Lista er sortert etter hylle i butikken, så du går gjennom butikken én gang i stedet for å krysse den to ganger for den ene tingen du glemte.')],
    ['Planlegg først, handle én gang', p('En handleliste er bare så god som planen bak. Sett ukas middager i <a href="/ukemeny/">ukemenyen</a>, legg hele uka på handlelista, og ta én tur i stedet for tre. Vil du se hvordan lagring, rydding og matlaging henger sammen, finner du det på siden om <a href="/oppskriftsbok-app/">oppskriftsappen</a>.')],
    ['Hopp over det du allerede har', p('Varer du allerede har i <a href="/spiskammer-app/">spiskammeret</a>, er fravalgt og merket «Har hjemme» når du legger til en oppskrift på lista. Det er en påminnelse, ikke en regel: du ser hva du har før du kjøper en ny boks. Sjekk spiskammeret før du handler, og oppdater det når du har laget mat.')],
    ['Del lista med husstanden', p('Et Pro-medlem kan opprette en husstand for opptil 6 personer, og det er gratis å bli med. Handlelista, ukemenyen og spiskammeret deles og oppdateres direkte hos alle. Én planlegger, en annen handler, og den som står i butikken, krysser av for alle.')],
    ['Tre situasjoner, og hva du gjør', sn()
      + sc('Tenk deg at du planlegger fem middager for en familie på fire', {
        situasjon: 'Ett budsjett og én tur til butikken.',
        galt: 'To oppskrifter trenger hver sin løk, og du kjøper tre.',
        gjor: 'Planlegg uka først, og handle fra én samlet liste.',
        matlyst: 'Legg oppskriftene i ukemenyen, legg uka på handlelista og handle etter hylle.' })
      + sc('Tenk deg at partneren din handler på vei hjem', {
        situasjon: 'Du har planlagt uka, og den andre er i butikken.',
        galt: 'Du sender en liste på melding, og halvparten forsvinner i tråden.',
        gjor: 'Del én felles liste som oppdateres direkte.',
        matlyst: 'Med en Pro-husstand deles lista og oppdateres hos begge to. Det er gratis å bli med.' })
      + sc('Tenk deg at du vil lage en oppskrift til sju, ikke fire', {
        situasjon: 'Det kommer gjester.',
        galt: 'Du regner om oppskriften i hodet og kjøper for lite.',
        gjor: 'Regn om porsjonene først, og legg så oppskriften på lista. Omregningen er lineær, så sjekk egg og hevemiddel selv når du baker.',
        matlyst: 'Endre antall porsjoner (mellom 1 og 20), og legg den så på handlelista.' })],
    ['Hva handlelista ikke gjør', '<ul><li><strong>Den bestiller ikke varer.</strong> Det er en liste, ikke en butikk.</li>'
      + '<li><strong>Den regner ikke om enheter for deg.</strong> Like enheter legges sammen, og ulike enheter vises som egne linjer.</li>'
      + '<li><strong>Den kan lese en oppskrift feil.</strong> Matlyst bruker KI til å lese oppskrifter fra innlegg og bilder, så sjekk mengdene før du stoler på lista.</li></ul>'],
  ],
}).html;

const kjoperguide = byggRik({
  lang: 'nb',
  svarTekst: 'En god oppskriftsapp lagrer oppskrifter fra stedene du faktisk finner dem, gjør dem søkbare på ingrediens, regner om mengdene og henger sammen med en ukemeny og en handleliste. Test enhver app med fem oppskrifter fra ditt eget liv før du bestemmer deg. Vi lager Matlyst, så vi sier hvor den passer og hvor den ikke gjør det.',
  seksjoner: [
    ['Hvem denne guiden er for', p('Du har oppskrifter på for mange steder: skjermbilder, bokmerker, lagrede reels, en notatapp og en bunke trykte kort. Du vil ha ett sted til dem. Guiden viser hva du bør se etter, hvordan du tester en app på ti minutter, og feilene folk gjør når de velger.')
      + p('For ordens skyld: vi lager Matlyst, en oppskriftsapp. Guiden rangerer ikke apper og nevner ingen konkurrenter. Den gir deg kriterier som fungerer for alle apper, og sier ærlig hvor Matlyst passer og hvor den ikke gjør det.')],
    ['Ti ting å se etter i en oppskriftsapp', '<h3>1. Den lagrer oppskrifter fra stedene du faktisk finner dem</h3>'
      + p('Skriv en liste over de ti siste oppskriftene du fant. Var det på nettsider, Instagram, TikTok, YouTube, et bilde av en side eller en melding fra en venn? Appen bør klare det meste av lista med ett eller to trykk.')
      + '<h3>2. Den rydder opp i oppskriften</h3>'
      + p('En lagret lenke er ikke en oppskrift. Du vil ha ingredienser med mengder og nummererte steg i samme oppsett hver gang, uten reklamen og livshistorien.')
      + '<h3>3. Du kan sjekke og rette</h3>'
      + p('Import fra innlegg og bilder kan bli feil, særlig mengdene. Du må kunne lese resultatet før du lagrer, rette det og legge til egne notater.')
      + '<h3>4. Den søker på ingrediens</h3>'
      + p('Spørsmålet en tirsdag kveld er ikke «hva het den suppa», men «hva kan jeg lage av kylling og spinat». Søk på ingrediens er funksjonen som gjør en haug til et verktøy.')
      + '<h3>5. Den regner om porsjoner</h3>'
      + p('Se etter omregning som endrer alle mengdene på én gang. Husk at omregningen er lineær, så baking krever fortsatt skjønn med egg, salt og hevemiddel.')
      + '<h3>6. Den håndterer enhetene dine</h3>'
      + p('Lager du mat etter norske oppskrifter, vil du ha gram, desiliter og grader celsius. Lager du mat etter amerikanske oppskrifter, møter du cups og fahrenheit. Sjekk om appen regner om, beholder kildens enheter eller ingen av delene.')
      + '<h3>7. Den henger sammen med ukemeny og handleliste</h3>'
      + p('Å rydde er halve jobben. Gevinsten kommer når du legger ukas oppskrifter i en plan og får én samlet handleliste, sortert etter hylle i butikken.')
      + '<h3>8. Den fungerer på kjøkkenet</h3>'
      + p('Kan du lage maten fra den med skitne fingre? Se etter en sjekkliste eller stegvisning, tidtakere og en skjerm som blir på. Sjekk om den fungerer uten nett når dekningen er dårlig.')
      + '<h3>9. Du kan ta med deg alt og bytte</h3>'
      + p('Du bør kunne eksportere alle oppskriftene dine, gratis, i et format du kan åpne et annet sted. Får du ikke oppskriftene ut, eier du dem ikke.')
      + '<h3>10. Den er ærlig om grensene og prisen</h3>'
      + p('Les hva som er gratis og hva som ikke er det, før du lagrer hundre oppskrifter. Se etter en tydelig beskrivelse av hva appen ikke kan, som å lese tekst i videoer eller kommentarer.')],
    ['En test på ti minutter som du kan kjøre på alle apper', p('Ikke stol på en funksjonsliste. Prøv fem ekte oppskrifter.')
      + '<ol><li><strong>En oppskrift fra en nettside</strong> med en lang historie før ingrediensene.</li>'
      + '<li><strong>En oppskrift fra Instagram eller TikTok</strong> der oppskriften står i bildeteksten.</li>'
      + '<li><strong>En oppskrift der mengdene bare blir sagt</strong> i en video. Se hva appen gjør, og om den sier det ærlig.</li>'
      + '<li><strong>Et bilde av en trykt eller håndskrevet oppskrift.</strong> Sjekk hver mengde mot originalen.</li>'
      + '<li><strong>To oppskrifter som begge trenger en løk.</strong> Legg begge på handlelista og se hva du får.</li></ol>'
      + p('Søk deretter på en ingrediens, regn om én oppskrift til et annet antall porsjoner, og prøv å eksportere alt. Tar noe av dette mer enn et par minutter, eller gjør deg usikker, er det nyttig å vite.')],
    ['Hva apper ofte gjør feil', '<ul><li><strong>Stille feil.</strong> En app som importerer en oppskrift med feil mengde uten å vise et utkast, er farligere enn en som ber deg sjekke.</li>'
      + '<li><strong>Å late som den leser video.</strong> Mange sier bare mengdene høyt. En app bør si fra når den ikke kan lese dem.</li>'
      + '<li><strong>Enhetsoverraskelser.</strong> Noen apper regner om i det stille og runder av på måter som ødelegger oppskriften.</li>'
      + '<li><strong>Ingen vei ut.</strong> Oppskriftssamlingen din er mange års arbeid. Sørg for at du kan ta den med deg.</li></ul>'],
    ['Fire situasjoner, og hva du bør se etter', sn()
      + sc('Tenk deg at du lagrer oppskrifter mest fra Instagram og TikTok', {
        situasjon: 'Lagret-fanene dine er fulle, og du finner ingenting.',
        galt: 'Du velger en app som bare lagrer lenker til nettsider.',
        gjor: 'Velg en app som leser bildetekster fra innlegg, og test den med to ekte innlegg. Sjekk hva den gjør når oppskriften ikke står i bildeteksten.',
        matlyst: 'Matlyst leser bildetekster fra Instagram og TikTok. Den transkriberer ikke video og leser ikke kommentarer.' })
      + sc('Tenk deg at du har arvet en eske med håndskrevne kort', {
        situasjon: 'Falmet blekk, «en klype smør» og ingen ovnstemperaturer.',
        galt: 'Du stoler på skanningen og lager maten etter den.',
        gjor: 'Bruk en app med bildeimport, og sjekk hver mengde mot kortet. Behold originalen.',
        matlyst: 'Bildeimport er en Matlyst Pro-funksjon, opptil 20 bilder per oppskrift, og resultatet bør alltid sjekkes.' })
      + sc('Tenk deg at du lager mat til en familie på fem', {
        situasjon: 'Oppskriftene er til fire, og handlelista er lang.',
        galt: 'Du regner om i hodet og går tom for salt.',
        gjor: 'Se etter omregning og en handleliste som slår sammen like varer.',
        matlyst: 'Porsjonene kan regnes om fra 1 til 20, og like varer med samme enhet legges sammen på handlelista.' })
      + sc('Tenk deg at dere deler på matlagingen', {
        situasjon: 'Én av dere planlegger, den andre handler.',
        galt: 'Dere sender lister på melding og mister halvparten av varene.',
        gjor: 'Se etter en delt liste som oppdateres direkte.',
        matlyst: 'Et Pro-medlem oppretter en husstand for opptil 6 personer. Handlelista, ukemenyen og spiskammeret oppdateres direkte, og det er gratis å bli med.' })],
    ['Hvor Matlyst passer, og hvor den ikke gjør det', p('Vi lagde Matlyst for å løse problemet som er beskrevet øverst i guiden. Her er den ærlige oppsummeringen.')
      + '<div class="table-wrap"><table><thead><tr><th>Matlyst passer godt hvis du …</th><th>Den er trolig ikke noe for deg hvis du …</th></tr></thead><tbody>'
      + '<tr><td>lagrer oppskrifter fra Instagram, TikTok, nettsider eller bilder</td><td>trenger at appen transkriberer det som blir sagt i videoer</td></tr>'
      + '<tr><td>vil ha en ukemeny og en handleliste laget av dine egne oppskrifter</td><td>vil at en app skal lage hele ukemenyen for deg</td></tr>'
      + '<tr><td>vil søke på ingrediens og ha et spiskammer</td><td>trenger strekkodeskanning for varer i spiskammeret</td></tr>'
      + '<tr><td>vil kunne eksportere alt du lagrer, gratis</td><td>bare lager mat fra trykte kokebøker og aldri lagrer noe digitalt</td></tr>'
      + '</tbody></table></div>'
      + p('Matlyst er gratis å komme i gang med, med 5 importer per kalendermåned. Les mer på siden om <a href="/oppskriftsbok-app/">oppskriftsappen</a>, eller se hvordan den fungerer med <a href="/lagre-oppskrifter-fra-instagram/">Instagram</a>, <a href="/lagre-oppskrifter-fra-tiktok/">TikTok</a>, <a href="/ukemeny/">ukemenyen</a> og <a href="/handleliste/">handlelista</a>.')],
    ['Vanlige feil når du velger', '<ul><li><strong>Å velge etter funksjonsliste.</strong> Test med dine egne oppskrifter.</li>'
      + '<li><strong>Å flytte alt den første dagen.</strong> Begynn med de ti oppskriftene du lager oftest.</li>'
      + '<li><strong>Å ikke lese importen.</strong> Sjekk alltid mengdene.</li>'
      + '<li><strong>Å overse eksport.</strong> Test den før du stoler på appen.</li></ul>'],
  ],
}).html;

export const rikeSider = {
  'oppskriftsbok-app/': {
    title: 'Digital oppskriftsbok og oppskriftsapp',
    description: 'Digital oppskriftsbok som samler oppskrifter fra nettsider, Instagram, TikTok og bilder. Søk, regn om porsjoner og planlegg uka. Gratis å komme i gang.',
    h1: 'En digital oppskriftsbok for alle oppskriftene dine',
    rik: oppskriftsbokApp,
    faq: [
      ['Finnes det en gratis oppskriftsapp?', 'Ja. Matlyst er gratis å komme i gang med: 5 importer per kalendermåned, mapper, søk, ukemeny og handleliste. Matlyst Pro gir flere importer, bildeimport, Spør Matlyst og deling med husstanden.'],
      ['Kan jeg lagre oppskrifter fra Instagram og TikTok?', 'Ja, ved å dele innlegget med Matlyst. Appen leser oppskriften i bildeteksten. Den transkriberer ikke det som blir sagt i videoen, så hvis mengdene bare blir sagt, legger du dem inn selv etter importen.'],
      ['Kan jeg regne om en oppskrift til flere porsjoner?', 'Ja, fra 1 til 20 porsjoner. Omregningen er lineær, så sjekk egg og hevemiddel selv når du baker.'],
      ['Fungerer den uten nett?', 'Du kan lese oppskriftene og handlelista uten nett i opptil 30 dager etter siste synkronisering. Kokemodus og redigering krever forbindelse.'],
      ['Kan jeg dele oppskrifter og handleliste med husstanden?', 'Ja. Et Pro-medlem oppretter husstanden, opptil 6 personer kan være med, og det er gratis å bli med. Handlelista, ukemenyen og spiskammeret oppdateres direkte hos alle.'],
      ['Hvilke enheter bruker den?', 'Matlyst bruker metriske enheter som standard. Oppskrifter på andre språk oversettes til norsk bokmål.'],
      ['Kan jeg eksportere oppskriftene mine?', 'Ja, gratis, som en Matlyst-fil (en zip med mapper og bilder) eller som HTML.'],
      ['Fungerer Matlyst på iPhone og Android?', 'Ja. Matlyst finnes i App Store og på Google Play.'],
    ],
  },
  'lagre-oppskrifter-fra-instagram/': {
    title: 'Lagre oppskrifter fra Instagram og reels',
    description: 'Del et Instagram-innlegg eller en reel med Matlyst, så blir oppskriften i bildeteksten til ingredienser og steg. Slik gjør du, og hva om teksten mangler.',
    h1: 'Slik lagrer du oppskrifter fra Instagram og reels',
    rik: instagram,
    faq: [
      ['Hvordan lagrer jeg en oppskrift fra Instagram?', 'Åpne innlegget eller reelen, trykk på Del og velg Matlyst. Appen leser bildeteksten og lager et utkast med ingredienser og steg. Les over utkastet og lagre.'],
      ['Kan jeg lagre en Instagram-oppskrift uten å skrive den av?', 'Ja, så lenge oppskriften står i bildeteksten. Du deler innlegget med Matlyst, og appen gjør teksten om til ingredienser og nummererte steg.'],
      ['Leser Matlyst oppskrifter som bare blir sagt i videoen?', 'Nei. Matlyst transkriberer ikke tale eller tekst som bare vises i videoen, og den laster ikke ned videoen. Står mengdene bare i lyden, må du skrive dem inn etter importen.'],
      ['Hva om oppskriften står i en kommentar eller bak en lenke i profilen?', 'Matlyst leser ikke kommentarer. Kopier oppskriften fra kommentaren og lim den inn, eller del lenken hvis den går til en oppskriftsside.'],
      ['Kan jeg lagre flere oppskrifter fra én reel?', 'Nei, Matlyst importerer én oppskrift per innlegg. Viser reelen flere oppskrifter, må du dele dem opp selv.'],
      ['Fungerer det med private eller slettede innlegg?', 'Trolig ikke. Matlyst trenger tilgang til et offentlig innlegg for å lese bildeteksten.'],
      ['Hva koster det å lagre oppskrifter fra Instagram?', 'Matlyst er gratis å komme i gang med, med 5 importer per kalendermåned. Matlyst Pro gir flere importer og bildeimport.'],
      ['Kan KI ta feil når den leser en oppskrift?', 'Ja. Matlyst bruker KI til å lese og oversette oppskrifter, og mengdene er det som oftest går galt. Les utkastet før du lagrer.'],
    ],
  },
  'lagre-oppskrifter-fra-tiktok/': {
    title: 'Slik lagrer du oppskrifter fra TikTok',
    description: 'Gjør en TikTok-oppskrift om til ingredienser og steg. Del videoen med Matlyst, sjekk utkastet og lag maten fra en oppskrift du finner igjen. Gratis å prøve.',
    h1: 'Gjør en TikTok om til en oppskrift du faktisk kan lage',
    rik: tiktok,
    faq: [
      ['Hvordan lagrer jeg en oppskrift fra TikTok?', 'Åpne videoen, trykk på Del og velg Matlyst. Appen leser bildeteksten og lager et utkast med ingredienser og steg. Les over det og lagre.'],
      ['Leser Matlyst det som blir sagt i videoen?', 'Nei. Matlyst transkriberer ikke tale eller tekst som bare vises i videoen. Står oppskriften bare i lyden, må du skrive den inn selv.'],
      ['Laster Matlyst ned TikTok-videoen?', 'Nei. Matlyst laster ikke ned videoen. Den lagrer den strukturerte oppskriften og lenken til kilden.'],
      ['Fungerer korte TikTok-lenker?', 'Ja. Korte lenker som vm.tiktok.com, vt.tiktok.com og tiktok.com/t/ støttes.'],
      ['Hva om bildeteksten ikke har noen oppskrift?', 'Da er det ingenting å importere. Lag oppskriften for hånd med mengdene du hører, eller se etter en skriftlig utgave på profilen eller nettsiden til den som lagde videoen.'],
      ['Kan jeg regne om en TikTok-oppskrift til flere porsjoner?', 'Ja, fra 1 til 20 porsjoner. Omregningen er lineær, så sjekk egg og hevemiddel selv når du baker.'],
      ['Hva koster det å lagre oppskrifter fra TikTok?', 'Matlyst er gratis å komme i gang med, med 5 importer per kalendermåned. Matlyst Pro gir flere importer.'],
      ['Kan KI ta feil når den leser en oppskrift?', 'Ja. Matlyst bruker KI til å lese og oversette oppskrifter, så sjekk mengder og steg før du lager maten.'],
    ],
  },
  'spiskammer-app/': {
    title: 'Spiskammer-app: se hva du har og lag mat av det',
    description: 'En spiskammer-app som viser hva du har, hvor mange dager som er igjen og hvilke lagrede oppskrifter som bruker det. Legg inn varer raskt og kast mindre mat.',
    h1: 'En spiskammer-app som gjør det du har, til middag',
    eyebrow: 'Spiskammer',
    lead: 'Legg inn det du har på kjøkkenet, se hva som bør brukes først, og finn oppskriftene du allerede har lagret som bruker det.',
    forst: 'Begynn med kjøleskapet. Fryseren og tørrvarene kan du legge til senere.',
    stegTittel: 'Slik bruker du spiskammeret',
    steg: [
      ['Legg inn det du har', 'Åpne spiskammeret og legg inn varer, med utløpsdato hvis varen har en.'],
      ['Se hva som bør brukes først', 'Spiskammeret viser hvor mange dager som er igjen på hver vare.'],
      ['Lag mat av det', 'Søk i de lagrede oppskriftene dine etter en ingrediens, eller be Spør Matlyst om forslag ut fra det du har. Det er en Pro-funksjon.'],
    ],
    alternativ: '',
    grense: '',
    seksjoner: [],
    faqTittel: 'Spørsmål om spiskammeret',
    cta: 'Start spiskammeret ditt',
    rik: spiskammer,
    faq: [
      ['Skanner Matlyst strekkoder?', 'Nei. Du legger inn varer i spiskammeret for hånd.'],
      ['Er spiskammeret gratis?', 'I gratisversjonen viser spiskammeret 5 varer. Matlyst Pro gir mer, sammen med Spør Matlyst og deling med husstanden.'],
      ['Kan Matlyst foreslå middag fra det jeg har?', 'Ja, med Matlyst Pro. I Spør Matlyst lager «Lag noe av det jeg har» middagsforslag fra spiskammeret ditt. Det bruker KI og har en månedlig kvote, så sjekk resultatet før du lager maten.'],
      ['Hindrer spiskammeret at jeg kjøper dubletter?', 'Varer du har i spiskammeret, er fravalgt og merket «Har hjemme» når du legger til en oppskrift på handlelista, så du ser hva du allerede har før du handler.'],
      ['Kan jeg finne oppskrifter fra en ingrediens i kjøleskapet?', 'Ja. Søk i de lagrede oppskriftene dine på ingrediensen. Det er vanlig søk og fungerer uten KI.'],
      ['Kan jeg dele spiskammeret med husstanden?', 'Ja. Et Pro-medlem oppretter en husstand for opptil 6 personer, og det er gratis å bli med. Spiskammeret, handlelista og ukemenyen oppdateres direkte hos alle.'],
      ['Fungerer det uten nett?', 'Du kan lese oppskriftene og handlelista uten nett i opptil 30 dager etter siste synkronisering. Redigering krever forbindelse.'],
      ['Hvor lenge holder rester i kjøleskapet?', 'Det finner du i Mattilsynets råd om mat og drikke på mattilsynet.no. Vi oppgir ikke egne tall.'],
    ],
  },
  'handleliste/': {
    title: 'Handleliste-app: lages fra oppskriftene dine',
    description: 'Handleliste-app som lages fra oppskriftene dine. Like varer slås sammen og sorteres etter hylle. Gratis å komme i gang, deling med husstanden krever Pro.',
    h1: 'En handleliste som lages rett fra oppskriftene dine',
    rik: handleliste,
    faq: [
      ['Finnes det en handleliste-app som legger inn ingredienser fra oppskrifter?', 'Ja. I Matlyst legger du en oppskrift eller en planlagt dag på handlelista, og ingrediensene havner på lista med like varer slått sammen.'],
      ['Er handlelista i Matlyst gratis?', 'Ja, handlelista er gratis. Å opprette en husstand for å dele lista krever Matlyst Pro, og det er gratis å bli med i en.'],
      ['Kan jeg dele handlelista med partneren min?', 'Ja. Et Pro-medlem oppretter en husstand for opptil 6 personer. Handlelista, ukemenyen og spiskammeret oppdateres direkte hos alle, og det er gratis å bli med.'],
      ['Sorterer lista varene etter hylle i butikken?', 'Ja. Varene er gruppert etter hylle, for eksempel frukt og grønt, kjøtt og meieri.'],
      ['Hva skjer når to oppskrifter trenger den samme ingrediensen?', 'Matlyst legger varer med samme navn på én linje. Er enhetene forskjellige, står mengdene sammen på linja, for eksempel «2 dl · 200 g».'],
      ['Kan jeg legge til ting som ikke står i en oppskrift?', 'Ja. Trykk på + og skriv det du trenger.'],
      ['Vet lista hva jeg allerede har hjemme?', 'Varer du har i spiskammeret, er fravalgt og merket «Har hjemme» når du legger til en oppskrift på lista, så du ser hva du har før du kjøper det.'],
    ],
  },
  'blogg/velg-oppskriftsapp/': {
    title: 'Hvordan velge en oppskriftsapp',
    description: 'Ti ting å se etter i en oppskriftsapp, en test på ti minutter du kan kjøre på alle apper, og feilene folk gjør når de velger. Ingen rangering, bare kriterier.',
    eyebrow: 'Kjøperguide',
    h1: 'Hvordan velge en oppskriftsapp',
    lead: 'Ti ting å se etter, en test på ti minutter og hva apper ofte gjør feil. Skrevet av de som lager Matlyst, uten rangering og uten konkurrentnavn.',
    forst: 'Test med dine egne oppskrifter, ikke en funksjonsliste.',
    stegTittel: 'Slik tester du en oppskriftsapp',
    steg: [
      ['Prøv fem ekte oppskrifter', 'En nettsideoppskrift, et innlegg fra sosiale medier, en video der mengdene bare blir sagt, et bilde av en trykt oppskrift og to oppskrifter som deler en ingrediens.'],
      ['Søk, regn om og eksporter', 'Søk på en ingrediens, regn om én oppskrift og prøv å eksportere alt.'],
      ['Bestem deg', 'Er et steg tregt eller gjør deg usikker, har du svaret.'],
    ],
    alternativ: '',
    grense: '',
    seksjoner: [],
    faqTittel: 'Å velge en oppskriftsapp',
    rik: kjoperguide,
    faq: [
      ['Hva er den beste måten å samle oppskrifter på?', 'Samle dem på ett sted, i samme oppsett, med mulighet til å søke på ingrediens. En oppskriftsapp gjør det, og knytter oppskriftene til en ukemeny og en handleliste.'],
      ['Hva bør jeg se etter i en oppskriftsapp?', 'Se etter lagring fra stedene du faktisk finner oppskrifter, et utkast du kan sjekke og rette, søk på ingrediens, omregning, enhetene dine, ukemeny og handleliste, lesing uten nett og gratis eksport.'],
      ['Bør en oppskriftsapp lese oppskrifter fra videoer?', 'Den bør være ærlig om det. Mange sier bare mengdene høyt. En app bør si fra når den ikke kan lese dem, så du kan legge dem inn selv.'],
      ['Holder det med en gratis oppskriftsapp?', 'For mange gjør det det. Sjekk hva gratisversjonen begrenser, som antall importer per måned, før du lagrer en stor samling.'],
      ['Hvordan flytter jeg oppskriftene mellom apper?', 'Se etter eksport i et format andre apper kan åpne, og etter import som leser andre appers eksportfiler. Test begge før du flytter alt.'],
    ],
    cta: 'Prøv med dine egne oppskrifter',
  },  'julemiddag/': julemiddag,
  'om/': om,
};

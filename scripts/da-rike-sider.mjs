// Lange sider på språket «da» (utkast til Patricks godkjenning). Samme oppbygging som en-rike-sider.mjs:
// felt per path som legges oppå den tynne siden, eller en ny side når path ikke finnes fra før.
// Fakta følger de engelske sidene (funksjonssjekken 18.11.2026). Ingen skjermbilder fra den engelske appen.
// Matvaretrygg-tall er utelatt: de er ikke hentet fra Fødevarestyrelsen (se rapporten).
import { byggRik, founder, illustrasjon, scenario, scenarioNotat } from './rik-sider.mjs';

const p = (...ps) => ps.map((t) => `<p>${t}</p>`).join('');

const FVST = 'https://www.foedevarestyrelsen.dk/kost-og-foedevarer/alt-om-mad/madspild-i-hjemmet/saadan-undgaar-du-madspild-hjemme';

// ---------------------------------------------------------------- 1. Opskrifts-app
const opskriftsApp = byggRik({
  lang: 'da',
  svarTekst: 'Matlyst er en opskriftsapp. Del en opskrift fra en hjemmeside, et opslag på Instagram eller en TikTok, eller tag et billede af den, så bliver den til en ryddelig liste med ingredienser og trin, som du kan søge i, skalere, planlægge efter og handle ind fra. Det er gratis at komme i gang.',
  seksjoner: [
    ['Hvorfor jeg byggede den', founder([
      'Jeg er ikke uddannet kok. Jeg er uddannet køletekniker.',
    ], 'Patrick, grundlægger af Matlyst. Mad er mit kærlighedssprog. Jeg ville bare holde op med at miste de opskrifter, jeg laver den efter.')
      + p('Som lærling kom jeg rundt i nogle af de bedste restaurantkøkkener i min hjemby. Jeg var aldrig den, der lavede maden. Jeg var den, der reparerede kølerummet, inden den første bestilling kom ind. Derfra fik jeg et tæt indblik i, hvordan professionelle arbejder. Intet er tilfældigt. Alt har sin plads, sin etiket og sin dato.',
        'Hjemme lå mine opskrifter otte forskellige steder: noter, OneNote, en opskriftsapp, bogmærker, TikTok, Instagram, YouTube og favoritter. Jeg havde madlavningen, men intet system. Så jeg byggede det system, jeg havde set i de køkkener, til helt almindelig aftensmad i en familie.',
        'Resten af siden viser, hvad systemet gør, trin for trin, og hvor det har sine grænser.')],
    ['Sådan virker det i tre trin', p('Du behøver ikke flytte hele din samling over første dag. Start med de opskrifter, du laver oftest.')
      + '<h3>1. Gem den, uanset hvor du fandt den</h3>'
      + p('Del et link eller et opslag med Matlyst fra menuen Del, eller åbn importskærmen og indsæt en webadresse. Matlyst læser siden eller billedteksten og laver en opskrift af den: ingredienser med mængder, nummererede trin og et billede, når der er et. Hjemmesider, Instagram, TikTok (også korte links) og YouTube-beskrivelser virker. Med Matlyst Pro kan du også importere fra billeder, op til 20 pr. opskrift.')
      + '<h3>2. Tjek den, og gør den til din egen</h3>'
      + p('Læs opskriften, før du gemmer den, og ret en mængde, omdøb en ingrediens eller skriv en note. Opskrifter på andre sprog bliver oversat til dansk. Mængderne er metriske som standard. Vælg <strong>Amerikansk</strong> under <strong>Enheder</strong> i <strong>Indstillinger</strong>, så beholder Matlyst de cups, ounces og grader Fahrenheit, som kilden brugte. Matlyst regner ikke metriske opskrifter om til cups for dig.')
      + '<h3>3. Find den igen på få sekunder</h3>'
      + p('Søg på titel eller ingrediens, eller åbn en mappe. Skriv ”hvidløg”, og du ser alle de gemte opskrifter, der bruger det. Marker dem, du holder af, som favoritter, og behold kildelinket på hver opskrift, så du kan finde tilbage til skaberen.')],
    ['Hvad en opskriftsapp egentlig bør kunne', p('De fleste har allerede en opskriftssamling. Den er bare spredt ud: en note her, et skærmbillede dér, en gemt video, du ikke kan finde igen. En god opskriftsapp gør fire ting.')
      + '<h3>Den samler alt på ét sted</h3>'
      + p('Opskrifter fra hjemmesider, sociale medier og billeder bliver gemt på samme måde, i mapper, du selv vælger. Alle opskrifter har samme opstilling, så du ikke skal lede i tre apps efter den ene.')
      + '<h3>Den gør de gemte opskrifter nemme at finde</h3>'
      + p('En samling, du ikke kan søge i, er bare en større bunke. Søgningen skal kunne tage udgangspunkt i ingredienser, for det er sådan, du bestemmer, hvad du skal lave en tirsdag aften.')
      + '<h3>Den gør opskrifter til en plan</h3>'
      + p('Læg opskrifter ind i en ugentlig madplan, og ingredienserne havner på én indkøbsliste, lagt sammen og sorteret efter afdeling i butikken. Læs mere om <a href="/da/madplan-app/">madplanen</a> og <a href="/da/indkoebsliste-app/">indkøbslisten ud fra opskrifter</a>.')
      + '<h3>Den hjælper dig, mens du laver maden</h3>'
      + p('Madlavningstilstanden viser opskriften som én tjekliste, du kan krydse af undervejs. Når et trin nævner en tid, foreslår Matlyst en timer. Den kører videre i baggrunden, og skærmen bliver ved med at være tændt. Madlavningstilstanden kræver internetforbindelse.')],
    ['Skalér en opskrift til flere eller færre personer', p('Ændr antallet af portioner fra 1 til 20, og alle mængder følger med. Skaleringen er lineær, så tjek selv æg, salt og hævemidler, når du bager, for de skalerer ikke altid i en lige linje.')],
    ['Fire situationer, og hvad du kan gøre', scenarioNotat('da')
      + scenario('Sig, at du så en TikTok, hvor mængderne kun bliver sagt højt', {
        situasjon: 'Skaberen siger ”en god sjat soja og cirka to spiseskefulde honning”, og billedteksten er kun emojis.',
        galt: 'Du tager et skærmbillede af videoen, ser den aldrig igen og mister opskriften.',
        gjor: 'Del videoen med din opskriftsapp, og læs resultatet, før du stoler på det.',
        tall: 'Matlyst læser billedteksten. Den transskriberer ikke videoen, så mængder, der kun bliver sagt højt, kommer ikke med.',
        matlyst: 'Del videoen, tjek udkastet, skriv de mængder ind, du hørte, og gem.' }, 'da')
      + scenario('Sig, at du har arvet et håndskrevet familiekort', {
        situasjon: '”Smør på størrelse med et æg”, et plettet hjørne og skrå håndskrift.',
        galt: 'Kortet ligger i en skuffe, og ingen laver mad efter det.',
        gjor: 'Tag et billede af det, og importér det som en opskrift, du kan søge i og skalere. Billedimport er en funktion i Matlyst Pro.',
        tall: 'Håndskrift er det svære tilfælde. Sammenlign hver mængde med kortet, før du gemmer.',
        matlyst: 'Importér fra billede, og ret så alt det, der blev læst forkert. Se også <a href="/da/haandskrevne-opskrifter/">håndskrevne opskrifter</a>.' }, 'da')
      + scenario('Sig, at den samme opskrift ligger fem forskellige steder', {
        situasjon: 'En note, et bogmærke, et skærmbillede, en pin og en video.',
        galt: 'Du kan ikke se, hvilken udgave der er den gode.',
        gjor: 'Behold én kopi ét sted, og skriv en note om, hvad du har ændret.',
        matlyst: 'Én opskrift med kildelinket på, og dine egne rettelser ovenpå.' }, 'da')
      + scenario('Sig, at du planlægger aftensmad for en familie på fire', {
        situasjon: 'Fem aftener, ét budget og én tur i butikken.',
        galt: 'To opskrifter skal begge bruge ét løg, og du køber tre.',
        gjor: 'Planlæg ugen først, og handl så ind fra én samlet liste.',
        matlyst: 'Læg opskrifterne ind i den ugentlige madplan, og åbn indkøbslisten. Ens varer med samme enhed bliver lagt sammen, og varer, du allerede har i spisekammeret, starter uden flueben.' }, 'da')],
    ['Byt en ingrediens, eller lav din egen version', p('Mangler du kærnemælk eller den friske krydderurt? Åbn opskriften, og bed Spørg Matlyst om et bud på en erstatning. <strong>Brug det, jeg har</strong> foreslår erstatninger ud fra det, du har i spisekammeret. Du kan også bede om en vegetarisk, vegansk, hurtigere eller mindre udgave, eller skrive dit eget ønske, for eksempel ”gør den mere spændende”.')
      + p('Ændringerne vises som en liste, du kan fortryde. Når du gemmer, vælger du <strong>Lav en kopi</strong>, som beholder originalen og linker tilbage til kilden med mærket ”tilpasset”, eller <strong>Overskriv</strong>, som erstatter din egen opskrift. Spørg Matlyst er en Pro-funktion, den bruger AI, og den har en månedlig kvote. Tjek resultatet, før du går i gang med at lave maden.')],
    ['Dit spisekammer, og opskrifterne du glemte', p('Matlyst kan holde styr på det, du har derhjemme. Søg i dine gemte opskrifter på en ingrediens fra køleskabet, og se, hvilke der bruger den. I den gratis version viser spisekammeret 5 varer. Læs mere om <a href="/da/spisekammer-app/">spisekammer-appen</a>.')
      + p('En aften havde jeg en krukke miso i køleskabet, søgte på ”miso” og fandt en misokylling, jeg havde gemt og glemt. Aftensmaden var afgjort på et par sekunder. For min ADHD-hjerne betyder det meget. Aftensmaden er på plads, og jeg kan komme videre med resten af dagen.')],
    ['Hvor en opskriftsapp slår de andre måder at gemme opskrifter på', p('De fleste bruger en blanding af mulighederne herunder. Hver af dem virker til noget, og hver af dem kommer til kort et sted.')
      + '<div class="table-wrap"><table><thead><tr><th>Måde at gemme opskrifter på</th><th>Det, den er god til</th><th>Der, hvor den kommer til kort</th></tr></thead><tbody>'
      + '<tr><td>Skærmbilleder og gemte opslag</td><td>Hurtigt at gemme, ingen tastning.</td><td>Du kan ikke søge på ingrediens eller skalere mængder, og opslaget kan forsvinde.</td></tr>'
      + '<tr><td>En notesapp eller dokumenter</td><td>Fleksibelt, og det er helt dit eget.</td><td>Alle opskrifter ser forskellige ud, og intet hænger sammen med en indkøbsliste.</td></tr>'
      + '<tr><td>Trykte kort og kogebøger</td><td>Pålideligt i køkkenet og fuldt af familiehistorie.</td><td>Kun ét eksemplar, let at få pletter på eller miste, og ingen søgning.</td></tr>'
      + '<tr><td>En opskriftsapp</td><td>Én opstilling til alt, med søgning, skalering og forbindelse til madplan og indkøbsliste.</td><td>Du skal gemme opskriften én gang, og mængder, der kun bliver sagt højt i en video, skal stadig skrives ind.</td></tr>'
      + '</tbody></table></div>'
      + p('Sammenligner du apps, så har vi skrevet en guide til, <a href="/da/blog/vaelg-opskriftsapp/">hvordan du vælger en opskriftsapp</a>, med ting at kigge efter, uanset hvilken du ender med.')],
    ['Hvad Matlyst ikke gør', p('Et godt værktøj siger, hvor det stopper. Her er, hvad du kan forvente, så intet kommer bag på dig i køkkenet.')
      + '<ul><li><strong>Den læser billedtekster, ikke lyd.</strong> Matlyst transskriberer ikke videoer og læser ikke tekst, der kun vises i selve videoen. Hvis mængderne kun bliver sagt højt, skriver du dem ind efter importen.</li>'
      + '<li><strong>Den læser ikke kommentarer.</strong> Har skaberen skrevet opskriften i en kommentar eller lagt den bag et link i profilen, så kopiér den ind i hånden, eller del linket til opskriftssiden.</li>'
      + '<li><strong>Én opskrift pr. opslag.</strong> Viser en reel tre opskrifter, må du selv dele dem op.</li>'
      + '<li><strong>Den regner ikke enheder om ved import.</strong> Metrisk er standard. Enheder: Amerikansk beholder det, kilden brugte.</li>'
      + '<li><strong>AI kan tage fejl.</strong> Matlyst bruger AI til at læse og oversætte opskrifter, så tjek mængder og trin, før du laver maden, især fra billeder og håndskrift.</li>'
      + '<li><strong>Madlavningstilstanden kræver internetforbindelse.</strong> Du kan læse en gemt opskrift uden net i op til 30 dage efter sidste synkronisering.</li></ul>'],
    ['Sådan kommer du i gang i dag', p('Det er nemmere at holde fast i en ny vane, når første skridt er lille. Her er en rækkefølge, der kan klares på en aften.')
      + '<ol><li><strong>Find de fem opskrifter, du laver oftest.</strong> Tænk på den uge, der lige er gået. Hvad lavede du, og hvor fandt du opskriften?</li>'
      + '<li><strong>Gem dem én ad gangen.</strong> Del dem med Matlyst fra de steder, hvor de ligger, og læs hvert udkast igennem, før du gemmer. Du lærer hurtigt, hvor udkastene plejer at være svage, og hvad du skal tjekke.</li>'
      + '<li><strong>Læg dem i to eller tre mapper.</strong> Hverdagsaftensmad, Weekend og Bagning er rigeligt at starte med. Du kan altid omdøbe eller slå mapper sammen senere.</li>'
      + '<li><strong>Prøv søgningen.</strong> Skriv en ingrediens, du har derhjemme, og se, hvad der dukker op. Det er her, du mærker forskellen på en samling og en bunke.</li>'
      + '<li><strong>Planlæg en enkelt uge.</strong> Læg tre opskrifter ind i madplanen, send dem til indkøbslisten, og se, hvordan ingredienserne bliver lagt sammen.</li></ol>'
      + p('Når du har prøvet det med fem opskrifter, ved du, om det passer til den måde, du laver mad på. Det har kostet dig en aften, og du har ikke mistet nogen opskrifter, for intet bliver slettet de steder, hvor de lå i forvejen.')],
    ['Almindelige fejl, når man samler sine opskrifter', p('Det er dem, der koster flest timer.')
      + '<ul><li><strong>At gemme uden at læse.</strong> Det er mængderne, der går galt. Læs udkastet igennem hver eneste gang.</li>'
      + '<li><strong>At beholde fem kopier.</strong> Vælg ét sted. Skriv en note om, hvad du har ændret, så du ikke gætter næste gang.</li>'
      + '<li><strong>At gemme kun videoen.</strong> Så ser du den igen hver gang, du skal lave maden. Gem opskriften i stedet.</li>'
      + '<li><strong>At bygge det perfekte mappesystem først.</strong> Start med et par mapper som Hverdagsaftensmad og Højtider, og tilføj flere, når du får brug for dem.</li>'
      + '<li><strong>At glemme kilden.</strong> Behold linket til skaberen på opskriften, så du kan finde vedkommendes andre opskrifter senere.</li></ul>'],
    ['Dine opskrifter forbliver dine', p('Du kan eksportere alle dine opskrifter når som helst og uden beregning, som en Matlyst-fil (en zip med mapper og billeder) eller som HTML. Skal du flytte fra Paprika? <a href="/da/skift-fra-paprika/">Importér din Paprika-eksport</a>, så bliver dine kategorier til mapper. Vil du vide mere om import i det hele taget, så se <a href="/da/importer-opskrifter/">importér opskrifter</a>.')
      + p('Du kan læse dine opskrifter og din indkøbsliste uden net i op til 30 dage efter sidste synkronisering. Redigering og madlavningstilstand kræver forbindelse.')],
    ['Abonnement, grænser og deling', p('Matlyst er gratis at komme i gang med: 5 importer pr. kalendermåned, og spisekammeret viser 5 varer. Du kan gemme opskrifter, bruge mapper og søgning, lave madplan og indkøbsliste i den gratis version. Matlyst Pro giver flere importer, billedimport, Spørg Matlyst og mulighed for at oprette en husstand.')
      + p('Et Pro-medlem kan oprette en husstand for op til 6 personer, og det er gratis at blive medlem af den. Indkøbslisten, den ugentlige madplan og spisekammeret deles og opdateres live for alle. Se siden om <a href="/da/indkoebsliste-app/">indkøbslisten</a> for, hvordan delingen virker.')],
  ],
}).html;

// ---------------------------------------------------------------- 2. Instagram
const instagram = byggRik({
  lang: 'da',
  svarTekst: 'Åbn opslaget eller reelen, tryk på Del, vælg Matlyst, og tjek det udkast til opskrift, der bliver bygget ud fra billedteksten. Gem den, så er den en opskrift, du kan søge i, med ingredienser og trin, og ikke et bogmærke, du aldrig finder igen. Det virker, når opskriften står i billedteksten. Matlyst transskriberer ikke tale eller tekst, der kun vises i videoen, og downloader ikke videoen.',
  seksjoner: [
    ['Tre måder, folk gemmer Instagram-opskrifter på, og hvor hver af dem kommer til kort', p('De fleste bruger en af disse. Alle tre fungerer et stykke tid, og så får du brug for opskriften.')
      + '<h3>Instagrams egen Gem-knap</h3>'
      + p('Den er hurtig, og opslaget ligger i fanen Gemt. Men det er et bogmærke og ikke en opskrift. Du kan ikke søge på ingrediens, skalere portioner eller sætte den på en indkøbsliste, og hvis skaberen sletter opslaget, er det væk.')
      + '<h3>Et skærmbillede eller en kopieret billedtekst</h3>'
      + p('Du beholder teksten, men et skærmbillede af en lang billedtekst er svært at læse bagefter, og kopieret tekst er en mur af ord i en notesapp. Ingen af delene kan gennemsøges, som en rigtig opskrift kan.')
      + '<h3>At gemme reelen i kamerarullen</h3>'
      + p('Du beholder videoen, men mængderne bliver ofte kun sagt højt eller blinker forbi på skærmen i et sekund. Så ser du den igen, hver gang du skal lave maden.')
      + '<h3>At dele direkte med en opskriftsapp</h3>'
      + p('Opslaget bliver til en opskrift med ingredienser, mængder og nummererede trin. Det er det, resten af guiden handler om.')],
    ['Sådan gemmer du en opskrift fra Instagram, trin for trin', illustrasjon('da', 'share-instagram-post-to-matlyst', 'Et Instagram-opslag bliver delt med Matlyst med få tryk.')
      + '<ol><li><strong>Åbn opslaget eller reelen,</strong> hvor opskriften står i billedteksten.</li>'
      + '<li><strong>Tryk på Del-ikonet</strong> (papirflyveren), og vælg <strong>Matlyst</strong> i listen over apps. Kan du ikke se den med det samme, så rul i listen.</li>'
      + '<li><strong>Vent et øjeblik,</strong> mens Matlyst læser billedteksten.</li>'
      + '<li><strong>Læs udkastet.</strong> Sammenlign mængder og trin med opslaget.</li>'
      + '<li><strong>Ret det, der ser forkert ud,</strong> vælg en mappe, og gem.</li></ol>'
      + p('Vil du hellere undvære delemenuen? Kopiér linket til opslaget, åbn <strong>Tilføj opskrift</strong> i Matlyst, og vælg <strong>Indsæt link</strong>. Kan du kopiere opskriftsteksten, men linket ikke kan læses, så indsæt teksten under <strong>Skriv</strong>.')],
    ['Det fandt vi, da vi testede det', p('Den 18. november 2026 importerede vi to rigtige reels. En kort billedtekst med 5 ingredienser og 5 trin kom igennem som 5 af 5 ingredienser og 5 af 5 trin. En lang billedtekst på 1.716 tegn med 18 ingredienser i tre grupper kom igennem som 18 af 18 ingredienser og 5 af 5 trin, selv om Instagram afskærer lange billedtekster med ”… mere”.')
      + p('Det er to reels og ikke et løfte. Billedtekster varierer, så læs udkastet hver gang. Det er mængderne, der går galt.')],
    ['Når opskriften ikke står i billedteksten', p('Nogle skabere skriver opskriften i en kommentar, bag et link i profilen eller kun i videoen. Her er, hvad Matlyst kan og ikke kan.')
      + '<ul><li><strong>Opskrift i en kommentar eller et link i profilen.</strong> Matlyst læser ikke kommentarer. Kopiér opskriften fra kommentaren og indsæt den under <strong>Skriv</strong>, eller del linket, hvis det går til en opskriftsside.</li>'
      + '<li><strong>Opskrift, der kun bliver sagt højt i videoen.</strong> Matlyst transskriberer ikke tale og læser ikke tekst, der kun vises inde i en reel, og den downloader heller ikke videoen. Se den én gang, og skriv så selv mængderne ind efter importen.</li>'
      + '<li><strong>Flere opskrifter i én reel.</strong> Matlyst importerer én opskrift pr. opslag. Del dem op i hånden.</li>'
      + '<li><strong>Private, slettede eller begrænsede opslag.</strong> Matlyst skal kunne se et offentligt opslag, så disse kan være umulige at læse.</li></ul>'],
    ['Det skal du tjekke i udkastet, før du gemmer', p('Det tager et minut at læse udkastet, og det er det trin, der afgør, om opskriften virker. Tjek i denne rækkefølge.')
      + '<ol><li><strong>Mængder og enheder.</strong> Har hver ingrediens et tal? Mangler der en mængde, har skaberen som regel ikke skrevet en. Matlyst bruger metriske enheder som standard, så vælg <strong>Amerikansk</strong> under <strong>Enheder</strong> i <strong>Indstillinger</strong>, hvis du vil beholde cups og ounces, som kilden skrev dem. Matlyst regner ikke om mellem dem.</li>'
      + '<li><strong>Ingrediensgrupper.</strong> Lange billedtekster deler ofte ingredienserne op i grupper som sovs, fyld og topping. Kontrollér, at intet er havnet i den forkerte gruppe.</li>'
      + '<li><strong>Ovntemperatur og tider.</strong> Dem er det let at overse i en lang billedtekst. Sammenlign med opslaget.</li>'
      + '<li><strong>Trinnene.</strong> Står de i rigtig rækkefølge, og er hvert trin noget, du gør? Slet alt, der er en joke eller et hashtag.</li>'
      + '<li><strong>Sproget.</strong> Var billedteksten på et andet sprog, er opskriften oversat til dansk. Kig på ingrediensnavne, du ikke kender.</li></ol>'
      + p('Matlyst bruger AI til at læse og oversætte opskrifter, og AI kan tage fejl. Derfor kommer udkastet først og gemningen bagefter.')],
    ['Efter du har gemt: det kan du bruge opskriften til', p('En gemt opskrift er en helt almindelig Matlyst-opskrift, og så får du alt det andet med.')
      + '<ul><li><strong>Skalér den</strong> fra 1 til 20 portioner.</li>'
      + '<li><strong>Planlæg den.</strong> Læg den ind i den ugentlige <a href="/da/madplan-app/">madplan</a>, og send ingredienserne til én <a href="/da/indkoebsliste-app/">indkøbsliste</a>, lagt sammen og sorteret efter afdeling i butikken.</li>'
      + '<li><strong>Lav mad efter den.</strong> Madlavningstilstanden viser trinnene som en tjekliste og foreslår timere ud fra teksten. Den kræver internetforbindelse.</li>'
      + '<li><strong>Tilpas den.</strong> Med Spørg Matlyst, en Pro-funktion, kan du bede om en vegansk, hurtigere eller mindre udgave og gemme den som en kopi.</li>'
      + '<li><strong>Tag den med dig.</strong> Eksportér alle opskrifter uden beregning som en Matlyst-fil eller HTML.</li></ul>'
      + p('Matlyst er gratis at komme i gang med, med 5 importer pr. kalendermåned. Matlyst Pro giver flere importer og billedimport.')],
    ['Fire situationer, og hvad du kan gøre', scenarioNotat('da')
      + scenario('Sig, at billedteksten ender med ”… mere”', {
        situasjon: 'Du ser en pastaret i ovn, trykker, og billedteksten er skåret af efter ingredienserne.',
        galt: 'Du gemmer opslaget og finder senere kun en halv opskrift.',
        gjor: 'Del opslaget, og læs udkastet, før du gemmer.',
        tall: 'I vores test af en lang billedtekst kom alle 18 ingredienser og 5 trin med.',
        matlyst: 'Del, læs udkastet, tilføj det, der mangler, og gem.' }, 'da')
      + scenario('Sig, at mængderne kun står i et voiceover', {
        situasjon: 'Skaberen siger ”to dl mel” højt og skriver ingenting.',
        galt: 'Matlyst læser billedteksten og ikke lyden, så der er ingen mængder at importere.',
        gjor: 'Se videoen én gang, og skriv så de mængder ind, du hører.',
        matlyst: 'Importér opslaget, redigér ingredienslisten, og gem.' }, 'da')
      + scenario('Sig, at du har gemt 40 opskrifter og ikke kan finde suppen', {
        situasjon: 'Din Instagram-fane Gemt er et langt gitter af miniaturer.',
        galt: 'Du ruller i ti minutter og giver op.',
        gjor: 'Flyt de opskrifter, du faktisk laver, over i en samling, du kan søge i.',
        matlyst: 'Søg på ”linser”, eller åbn en mappe.' }, 'da')
      + scenario('Sig, at du vil have opskriften til seks og ikke fire', {
        situasjon: 'En skaber laver mad til fire, og du har gæster.',
        galt: 'Du regner i hovedet og rammer forkert med saltet.',
        gjor: 'Skalér portionerne. Skaleringen er lineær, så tjek selv æg og hævemidler, når du bager.',
        matlyst: 'Ændr portionerne fra 4 til 6, fra 1 til 20 i alt.' }, 'da')],
    ['Det virkelige problem: mængderne mangler', p('Den mest almindelige grund til, at en gemt Instagram-opskrift er ubrugelig, er, at skaberen aldrig har skrevet mængderne ned. Det kan Matlyst ikke finde på, og det skal den heller ikke. Når du ser ”salt og peber” uden mængde eller bare ”en sjat soja”, så betragt udkastet som et udgangspunkt. Smag til, ret, og gem dine egne mængder, så du ikke gætter næste gang.')],
    ['Respekt for skaberen', p('Hver opskrift, der bliver gemt fra Instagram, viser sin kilde: platformen og skaberens brugernavn i et mærke på opskriften. Tryk på det for at åbne det oprindelige opslag, eller skaberens profil, hvis linket til opslaget mangler, så du kan vende tilbage efter flere af vedkommendes opskrifter. Jeg byggede det sådan af respekt for dem, der skriver opskrifterne. Når du tilpasser en opskrift med Spørg Matlyst, beholder kopien den oprindelige kilde med mærket ”tilpasset”.')
      + p('Matlyst gemmer den opdelte opskrift og kildelinket. Den downloader ikke reelen som en videofil.')
      + p('Kilden følger med. Privat eller utilgængeligt indhold kan ikke altid importeres.')],
    ['Hvis importen ikke giver noget', p('Somme tider kommer der intet fornuftigt ud af et opslag. Så kan du gøre følgende, i denne rækkefølge.')
      + '<ol><li><strong>Tjek, at opslaget er offentligt.</strong> Matlyst skal kunne se et offentligt opslag. Private og begrænsede opslag kan ikke altid læses.</li>'
      + '<li><strong>Prøv linket i stedet for delemenuen.</strong> Kopiér linket, åbn <strong>Tilføj opskrift</strong>, og vælg <strong>Indsæt link</strong>.</li>'
      + '<li><strong>Kopiér opskriftsteksten selv.</strong> Står opskriften i billedteksten, men importen mislykkes, så indsæt teksten under <strong>Skriv</strong>.</li>'
      + '<li><strong>Søg efter en skrevet udgave.</strong> Mange skabere har den samme opskrift på en hjemmeside eller en blog. Del den side i stedet.</li></ol>'
      + p('Hvis skaberen slet ikke har skrevet opskriften ned, er der ikke noget at importere. Så er det hurtigste at se videoen én gang og skrive den ind selv.')],
    ['Almindelige fejl', '<ul><li><strong>At gemme uden at tjekke.</strong> Læs altid udkastet igennem. Det er mængderne, der går galt.</li>'
      + '<li><strong>At stole på et skærmbillede.</strong> Det er et billede og ikke en opskrift.</li>'
      + '<li><strong>At gemme kun reelen.</strong> Så ser du den igen, hver gang.</li>'
      + '<li><strong>At undlade at beholde kilden.</strong> Lad skaberens link blive på opskriften.</li></ul>'
      + p('Når en opskrift er gemt, kan du skalere den, lægge den ind i din <a href="/da/madplan-app/">madplan</a> og sende ingredienserne til din <a href="/da/indkoebsliste-app/">indkøbsliste</a>. Vil du se det store billede, så læs siden om <a href="/da/opskrifts-app/">opskriftsappen</a>, eller gem også fra <a href="/da/gem-opskrifter-fra-tiktok/">TikTok</a> og fra <a href="/da/haandskrevne-opskrifter/">billeder af håndskrevne opskrifter</a>.')],
  ],
}).html;

// ---------------------------------------------------------------- 3. TikTok
const tiktok = byggRik({
  lang: 'da',
  svarTekst: 'Åbn TikTok-videoen, tryk på Del, vælg Matlyst, og gennemgå det udkast til opskrift, der bliver bygget ud fra videoens billedtekst. Gem den, så kan du søge i den, skalere den og handle ind fra den. Det virker, når opskriften står i billedteksten. Matlyst transskriberer ikke tale eller tekst, der kun vises i videoen, og downloader ikke videoen. Korte links som vm.tiktok.com virker også.',
  seksjoner: [
    ['Hvorfor TikToks egne Favoritter ikke slår til', p('Favoritter gemmer videoen og ikke opskriften. Du ser de samme 40 sekunder igen, hver gang du skal lave maden, du kan ikke søge på ingrediens, og hvis skaberen sletter videoen, er din opskrift væk.')],
    ['Sådan gemmer du en opskrift fra TikTok, trin for trin', illustrasjon('da', 'share-tiktok-video-to-matlyst', 'En TikTok bliver delt med Matlyst med få tryk.')
      + '<ol><li><strong>Åbn den TikTok,</strong> hvor opskriften står i billedteksten.</li>'
      + '<li><strong>Tryk på Del,</strong> og vælg <strong>Matlyst</strong>. Kan du ikke se den, så åbn listen over apps og vælg den dér. Du kan også kopiere linket og indsætte det under <strong>Indsæt link</strong> i Matlyst.</li>'
      + '<li><strong>Vent et øjeblik,</strong> mens Matlyst læser billedteksten.</li>'
      + '<li><strong>Læs udkastet.</strong> Sammenlign mængder og trin med videoen.</li>'
      + '<li><strong>Ret det, der ser forkert ud,</strong> vælg en mappe, og gem.</li></ol>'
      + p('Korte links som vm.tiktok.com, vt.tiktok.com og tiktok.com/t/ understøttes.')],
    ['Når billedteksten ikke indeholder en opskrift', p('Matlyst læser billedteksten og ikke lyden. Den transskriberer ikke tale og læser ikke tekst, der kun vises inde i videoen, og den downloader ikke videoen. Siger en skaber ”to spiseskefulde honning” højt og skriver intet, er der ikke noget at importere. Lav opskriften i hånden med de mængder, du hører, eller se, om der ligger en skrevet udgave på skaberens profil eller hjemmeside. En TikTok helt uden tekst kan ikke importeres.')],
    ['Det skal du tjekke i udkastet, før du gemmer', p('Brug et minut på udkastet. Det er det trin, der afgør, om opskriften virker, når du laver maden.')
      + '<ul><li><strong>Mængder og enheder.</strong> Et manglende tal betyder som regel, at skaberen ikke har skrevet et. Metrisk er standard, og Enheder: Amerikansk beholder cups og ounces, som kilden skrev dem.</li>'
      + '<li><strong>Trin i rækkefølge.</strong> TikTok-billedtekster er korte og somme tider rodede. Flyt eller slet trin, til de passer med videoen.</li>'
      + '<li><strong>Temperaturer og tider.</strong> Sammenlign dem med det, skaberen siger eller viser.</li>'
      + '<li><strong>Oversatte navne.</strong> Var billedteksten på et andet sprog, er opskriften oversat til dansk. Tjek ingrediensnavne, du ikke kender.</li></ul>'
      + p('Matlyst bruger AI til at læse og oversætte opskrifter, og AI kan tage fejl. Læs, før du går i gang med at lave maden.')],
    ['Efter du har gemt', p('Opskriften er nu en helt almindelig Matlyst-opskrift. Skalér den fra 1 til 20 portioner, læg den ind i din <a href="/da/madplan-app/">madplan</a>, og send ingredienserne til din <a href="/da/indkoebsliste-app/">indkøbsliste</a>. Åbn den i madlavningstilstand for en tjekliste og timere, der bliver foreslået ud fra trinnene. Den gratis version har 5 importer pr. kalendermåned, og Matlyst Pro giver flere.')],
    ['Fire situationer, og hvad du kan gøre', scenarioNotat('da')
      + scenario('Sig, at en video på 30 sekunder kun viser mængderne på skærmen', {
        situasjon: 'Mængderne blinker forbi og står ikke i billedteksten.',
        galt: 'Du skeler, går glip af en og gætter.',
        gjor: 'Sæt på pause, skriv mængderne ind i en ny opskrift, og behold videolinket som kilde.',
        matlyst: 'Importér videoen, skriv de mængder ind, du så, og gem.' }, 'da')
      + scenario('Sig, at du vil lave den til seks og ikke to', {
        situasjon: 'Skaberen laver én portion, og du har gæster.',
        galt: 'Du ganger med tre i hovedet og mister overblikket over krydderierne.',
        gjor: 'Skalér opskriften. Skaleringen er lineær, så tjek selv æg og hævemidler, når du bager.',
        matlyst: 'Ændr portionerne, fra 1 til 20 i alt.' }, 'da')
      + scenario('Sig, at du har gemt ti TikTok-opskrifter i denne uge', {
        situasjon: 'De ligger alle i Favoritter i tilfældig rækkefølge.',
        galt: 'Om tirsdagen kan du ikke finde den med kylling.',
        gjor: 'Flyt dem, du vil lave, over i mapper, og søg på ingrediens.',
        matlyst: 'Gem i en mappe til hverdagsaftensmad, og søg så på ”kylling”.' }, 'da')
      + scenario('Sig, at skaberen skriver ”smag til”', {
        situasjon: 'Der er ingen mængde på saltet, citronen eller chilien.',
        galt: 'Du krydrer for meget eller for lidt og kan ikke huske, hvor meget du brugte.',
        gjor: 'Betragt det som et udgangspunkt: tilsæt en knivspids, smag og ret til.',
        matlyst: 'Redigér opskriften, så den viser din endelige mængde, og så du ikke gætter næste gang.' }, 'da')],
    ['Respekt for skaberen', p('Hver opskrift, der bliver gemt fra TikTok, viser skaberens brugernavn og et link tilbage til den oprindelige video, eller til skaberens profil, hvis videolinket mangler. Det er af respekt for skaberen, og det gør, at du kan vende tilbage efter flere af vedkommendes opskrifter.')
      + p('Privat, slettet eller geografisk blokeret indhold kan ikke altid læses.')],
    ['Sådan læser du et udkast fra en kort billedtekst', p('TikTok-billedtekster er ofte korte, og mange skabere bruger pladsen på hashtags. Når teksten er knap, er det her, du får mest ud af at bruge to minutter ekstra.')
      + '<ul><li><strong>Se videoen igen med udkastet ved siden af.</strong> Tæl ingredienserne i videoen, og sammenlign med listen. Mangler der en, så skriv den ind.</li>'
      + '<li><strong>Skriv mængderne ind, mens du kan huske dem.</strong> Har du lige set videoen, ved du stadig, om det var en sjat eller en kop.</li>'
      + '<li><strong>Slet hashtags og reklametekst.</strong> De hører ikke til i trinnene.</li>'
      + '<li><strong>Tilføj en note om det, du ændrede.</strong> Så ved du næste gang, hvad der virkede.</li></ul>'
      + p('Står opskriften i en kommentar, eller henviser skaberen til et link i profilen, så læser Matlyst ikke det. Kopiér teksten, og indsæt den under <strong>Skriv</strong>, eller del linket, hvis det går til en opskriftsside.')],
    ['Almindelige fejl', '<ul><li><strong>At gemme uden at læse udkastet.</strong> Det er mængderne, der går galt.</li>'
      + '<li><strong>At forvente mængder, der kun blev sagt højt.</strong> Matlyst læser tekst og ikke lyd.</li>'
      + '<li><strong>At gemme videolinket som opskriften.</strong> Gem selve opskriften.</li></ul>'
      + p('Flere måder at gemme på: <a href="/da/gem-opskrifter-fra-instagram/">Instagram</a>, <a href="/da/haandskrevne-opskrifter/">billeder af håndskrevne opskrifter</a> og oversigten over <a href="/da/opskrifts-app/">opskriftsappen</a>.')],
  ],
}).html;

// ---------------------------------------------------------------- 4. Spisekammer
const spisekammer = byggRik({
  lang: 'da',
  svarTekst: 'Tilføj det, du har i køkkenet, så viser Matlyst, hvad du har, hvor mange dage der er tilbage på hver vare, og hvilke af dine gemte opskrifter der bruger den. Varer, du allerede har i spisekammeret, starter uden flueben på din indkøbsliste, så du ikke køber endnu en krukke.',
  seksjoner: [
    ['Hvorfor en liste over spisekammeret hjælper', p('At smide mad ud handler som regel om hukommelse og ikke om madlavning. Du glemmer, at spinaten findes, resterne bliver skubbet bagerst, og en uge efter ender det i skraldespanden. Når du skriver det ned én gang, husker du det.')
      + founder(['Nu søger jeg i mit spisekammer, finder den misokylling, jeg havde gemt, og aftensmaden er afgjort på et par sekunder.'], 'Patrick, grundlægger af Matlyst. Vi spiser os ud af køleskabet i stedet for at smide mad ud.')],
    ['Hvad spisekammeret kan i Matlyst', '<h3>Det holder en liste med dage tilbage</h3>'
      + p('Tilføj en vare med en udløbsdato, og spisekammeret viser, hvor mange dage der er tilbage, så det, der går først, ligger øverst i tankerne. I den gratis version viser spisekammeret 5 varer.')
      + '<h3>Det finder opskrifter, du allerede har gemt</h3>'
      + p('Søg i dine egne opskrifter på en ingrediens fra køleskabet, for eksempel ”miso”, og se, hvad du kan lave. Det er helt almindelig søgning, så den virker uden AI. Se <a href="/da/opskrifter-ud-fra-ingredienser/">opskrifter ud fra ingredienser</a> og <a href="/da/toem-koeleskabet/">sådan bruger du det, der er i køleskabet</a>.')
      + '<h3>Det foreslår aftensmad ud fra det, du har (Pro)</h3>'
      + p('I Spørg Matlyst laver <strong>Brug det, jeg har</strong> forslag til aftensmad ud fra varerne i dit spisekammer, med tilberedningstider. Det bruger AI og har en månedlig kvote, så læs resultatet, før du går i gang med at lave maden.')
      + '<h3>Det finder en erstatning for det, du mangler</h3>'
      + p('Mangler du kærnemælk? Åbn opskriften, og bed Spørg Matlyst om en erstatning, der bruger det, du har i spisekammeret. Du ser ændringerne som en liste og kan fortryde dem.')
      + '<h3>Det holder dubletter væk fra din indkøbsliste</h3>'
      + p('Varer, du allerede har i spisekammeret, starter uden flueben på <a href="/da/indkoebsliste-app/">indkøbslisten</a>, så du ikke køber endnu en krukke af det, du allerede har. Et spisekammer, der opdateres live, deles også med din husstand, hvis du har en.')
      + p('I gratisversionen er der plads til et begrænset antal varer. Med Pro er der plads til flere.')],
    ['Sådan sætter du spisekammeret op på ti minutter', p('Du behøver ikke skrive hele dit køkken ind. En kort liste, du holder ved lige, slår en perfekt liste, du opgiver.')
      + '<ol><li><strong>Start med det, der bliver dårligt først.</strong> Friske grøntsager, mejeriprodukter, åbnede glas og alt det, du købte til én opskrift og har tilbage.</li>'
      + '<li><strong>Skriv en udløbsdato på, hvor emballagen har en.</strong> For frisk mad uden dato kan du skrive den dag, du købte den, og bruge dit skøn.</li>'
      + '<li><strong>Tag fryseren bagefter.</strong> Skriv ind, hvad der ligger i den, med dato, så det ældste bliver brugt først.</li>'
      + '<li><strong>Spring basisvarerne over,</strong> som du aldrig løber tør for, som salt og olie, til du vil have dem på listen.</li>'
      + '<li><strong>Opdatér, når du handler, og når du laver mad.</strong> To minutter dér sparer dig ti senere.</li></ol>'
      + p('I den gratis version viser spisekammeret 5 varer. Det rækker til at prøve vanen af på de ting, der bliver dårligt først.')],
    ['Brug spisekammeret og madplanen sammen', p('Spisekammeret gør mest gavn, når du planlægger ud fra det. Sådan ser en løkke ud, der virker i en almindelig uge.')
      + '<ol><li>Åbn spisekammeret, og se, hvad der udløber først.</li>'
      + '<li>Søg i dine gemte opskrifter på de ingredienser, og læg to eller tre ind i <a href="/da/madplan-app/">madplanen</a>.</li>'
      + '<li>Send ingredienserne til indkøbslisten. Varer, du allerede har i spisekammeret, starter uden flueben, så du handler ind til hullerne.</li>'
      + '<li>Lav maden, og opdatér spisekammeret.</li></ol>'
      + p('Du bestemmer stadig selv, hvad der kommer på planen. Matlyst fylder ikke ugen ud for dig.')],
    ['Del et spisekammer med din husstand', p('Et Pro-medlem kan oprette en husstand for op til 6 personer, og det er gratis at blive medlem af den. Indkøbslisten, den ugentlige madplan og spisekammeret deles og opdateres live for alle. Den, der lige har brugt de sidste æg, kan tage dem af listen, og den, der står i butikken, kan se det.')],
    ['Hvad Matlyst ikke gør', '<ul><li><strong>Den scanner ikke stregkoder.</strong> Du tilføjer varer i hånden.</li>'
      + '<li><strong>Den ved ikke, hvad der virkelig ligger i dit køleskab.</strong> Listen er kun så god som sidste gang, du opdaterede den.</li>'
      + '<li><strong>Den afgør ikke fødevaresikkerhed for dig.</strong> En udløbsdato er en rettesnor. Brug myndighedernes anbefalinger og dit eget skøn.</li></ul>'],
    ['Hvor længe holder maden', p('Hvor længe rester og andre madvarer kan holdes, og hvor koldt køleskabet skal være, afhænger af, hvad det er for en vare. Vi viser ikke egne tal her. Fødevarestyrelsen har råd om madspild i hjemmet, blandt andet om rester og datomærkning: <a href="' + FVST + '">Sådan undgår du madspild hjemme</a>. Er du i tvivl om en vare, så brug dit eget skøn.')
      + p('Endnu en vane fra professionelle køkkener: rå kød står på den nederste hylde, under mad, der ikke skal varmes op igen, så intet kan dryppe ned på den. Som køletekniker så jeg det gjort med vilje, hver eneste dag. Det koster ingenting, og det virker.')],
    ['Fire situationer, og hvad du kan gøre', scenarioNotat('da')
      + scenario('Sig, at du har en halv grillkylling, spinat og ris', {
        situasjon: 'Klokken er 18, og intet ser ud til at ”gå op”.',
        galt: 'Du bestiller takeaway, og kyllingen ender i skraldespanden fredag.',
        gjor: 'Søg i dine opskrifter på ”kylling” og ”spinat”, eller bed om forslag ud fra det, du har.',
        matlyst: 'Søg på ingrediens, eller brug Spørg Matlyst, en Pro-funktion.' }, 'da')
      + scenario('Sig, at tre ting udløber denne uge', {
        situasjon: 'En spand yoghurt, en pose spinat og en pakke kyllingelår.',
        galt: 'Du køber ind til fem nye aftensmåltider, og de gamle bliver dårlige.',
        gjor: 'Planlæg to aftensmåltider ud fra de varer, der udløber først.',
        matlyst: 'Tilføj varerne, tjek dagene tilbage, og læg de opskrifter, der passer, ind i madplanen.' }, 'da')
      + scenario('Sig, at din fryser er en gåde', {
        situasjon: 'Poser uden mærkat nederst i fryseren.',
        galt: 'Du ved ikke, hvad de er, eller hvor gamle de er.',
        gjor: 'Skriv ind, hvad der ligger i den, så det ældste bliver brugt først.',
        matlyst: 'Tilføj hver vare med en dato.' }, 'da')
      + scenario('Sig, at det er ugen før en rejse', {
        situasjon: 'Køleskabet er halvt fyldt, og du rejser lørdag.',
        galt: 'Du fylder indkøbskurven helt op og kommer hjem til fordærvet mad.',
        gjor: 'Planlæg måltider ud fra spisekammeret, og køb kun ind til hullerne.',
        matlyst: 'Tjek spisekammeret, planlæg ugen, og send kun det, der mangler, til indkøbslisten.' }, 'da')],
    ['Sådan bruger du spisekammeret, uden at det bliver et arbejde', p('Listen skal hjælpe dig og ikke give dig endnu en pligt. Her er tre vaner, der holder den levende.')
      + '<ul><li><strong>Kig på listen, før du planlægger.</strong> Tjek, hvad der udløber først, og lad det bestemme, hvad ugens første aftensmåltid skal være.</li>'
      + '<li><strong>Fjern en vare, når du bruger den.</strong> Det tager et sekund, mens du alligevel står i køkkenet.</li>'
      + '<li><strong>Tilføj, når du pakker ud.</strong> Når du kommer hjem fra butikken, skriver du de ting ind, der bliver dårligt først, og lader resten ligge.</li></ul>'
      + p('Du skal ikke have det hele med. Et spisekammer med ti rigtige varer er mere værd end et med hundrede, du holder op med at opdatere.')],
    ['Almindelige fejl', '<ul><li><strong>Kun at skrive frisk mad ind.</strong> Fryseren og tørvareskabet spilder også penge.</li>'
      + '<li><strong>Aldrig at opdatere listen.</strong> Fjern varer, når de er brugt, ellers holder listen op med at passe.</li>'
      + '<li><strong>At købe dubletter.</strong> Tjek spisekammeret, før du handler.</li></ul>'
      + p('Se derefter, hvordan et spisekammer hænger sammen med <a href="/da/madplan-app/">madplanen</a> og hele <a href="/da/opskrifts-app/">opskriftsappen</a>.')],
  ],
}).html;

// ---------------------------------------------------------------- 5. Indkøbsliste
const indkoeb = byggRik({
  lang: 'da',
  svarTekst: 'Læg en opskrift, eller en hel planlagt uge, ind på din Matlyst-indkøbsliste, så havner ingredienserne på én liste. Ens varer med samme enhed bliver lagt sammen, listen er sorteret efter afdeling i butikken, og varer, du allerede har i spisekammeret, starter uden flueben.',
  seksjoner: [
    ['Sådan laver du en indkøbsliste ud fra opskrifter', '<ol><li><strong>Åbn en opskrift eller din madplan.</strong> Vælg én opskrift eller en dag eller uge, du har planlagt.</li>'
      + '<li><strong>Læg den på indkøbslisten.</strong> Ingredienserne kommer på listen med de mængder, opskriften kræver.</li>'
      + '<li><strong>Handl efter afdeling.</strong> Varerne er grupperet efter afdeling i butikken, som frugt og grønt, mejeri og krydderier. Kryds dem af, mens du går.</li></ol>'
      + p('Det virker med alle opskrifter i Matlyst, uanset om du har gemt dem fra en hjemmeside, TikTok eller Instagram eller skrevet dem ind selv. Du kan også tilføje ting, der ikke står i en opskrift, som kaffe og køkkenrulle.')],
    ['Hvad sker der, når to opskrifter skal bruge det samme', p('Sig, at to opskrifter begge skal bruge et løg. Så får du én linje med løg og ikke to. Matlyst lægger ens varer sammen, når de har samme enhed. Er enhederne forskellige, for eksempel 1 dl af den ene ting og 200 g af en anden, står de to linjer ved siden af hinanden, så du selv kan beslutte, for Matlyst gætter ikke på, hvordan de skal regnes om.')
      + p('Listen er sorteret efter afdeling i butikken, så du går butikken igennem én gang og ikke krydser den to gange for den ene ting, du glemte.')],
    ['Planlæg først, og handl én gang', p('En indkøbsliste er kun så god som den plan, der ligger bag. Læg ugens aftensmåltider ind i <a href="/da/madplan-app/">madplanen</a>, læg hele ugen over på indkøbslisten, og tag én tur i stedet for tre. Vil du se det store billede af at gemme, ordne og lave opskrifter, så læs siden om <a href="/da/opskrifts-app/">opskriftsappen</a>.')],
    ['Spring over det, du allerede har', p('Varer, du allerede har i <a href="/da/spisekammer-app/">spisekammeret</a>, starter uden flueben på listen. Det er en påmindelse og ikke en regel: du ser, hvad du allerede har, før du køber endnu en krukke. Tjek spisekammeret, før du handler, og opdatér det, når du laver mad.')],
    ['Del listen med din husstand', p('Et Pro-medlem kan oprette en husstand for op til 6 personer, og det er gratis at blive medlem af den. Indkøbslisten, den ugentlige madplan og spisekammeret deles og opdateres live for alle. Én planlægger, en anden handler, og den, der står i butikken, krydser af for alle.')],
    ['Tre situationer, og hvad du kan gøre', scenarioNotat('da')
      + scenario('Sig, at du planlægger fem aftensmåltider til en familie på fire', {
        situasjon: 'Ét budget og én tur i butikken.',
        galt: 'To opskrifter skal begge bruge et løg, og du køber tre.',
        gjor: 'Planlæg ugen først, og handl så ind fra én samlet liste.',
        matlyst: 'Læg opskrifterne ind i den ugentlige madplan, læg ugen over på indkøbslisten, og handl efter afdeling.' }, 'da')
      + scenario('Sig, at din partner handler på vej hjem', {
        situasjon: 'Du har planlagt ugen, og vedkommende er i butikken.',
        galt: 'Du sender en liste som sms, og halvdelen forsvinder i tråden.',
        gjor: 'Del én liste, der opdateres live.',
        matlyst: 'Med en Pro-husstand deles listen og opdateres for jer begge. Det er gratis at blive medlem.' }, 'da')
      + scenario('Sig, at du vil lave en opskrift til syv og ikke fire', {
        situasjon: 'Der kommer gæster.',
        galt: 'Du skalerer opskriften i hovedet og køber for lidt.',
        gjor: 'Skalér portionerne først, og læg så opskriften på listen. Skaleringen er lineær, så tjek selv æg og hævemidler, når du bager.',
        matlyst: 'Ændr portionerne, fra 1 til 20 i alt, og læg den så på indkøbslisten.' }, 'da')],
    ['Sådan holder du listen kort', p('En lang liste er ikke det samme som en god liste. Et par vaner gør den lettere at handle efter.')
      + '<ul><li><strong>Planlæg, før du tilføjer.</strong> En liste bygget af en plan er kortere end en liste bygget af lyst i butikken.</li>'
      + '<li><strong>Tjek spisekammeret først.</strong> Se, hvad du har, og lad det, du har, blive stående.</li>'
      + '<li><strong>Skalér, før du lægger på listen.</strong> Er opskriften til fire, og I er to, så ændr portionerne først.</li>'
      + '<li><strong>Tilføj hverdagsvarerne sidst.</strong> Kaffe, køkkenrulle og lignende skriver du ind, når opskrifterne er lagt på.</li></ul>'
      + '<h3>En almindelig uge, fra plan til kurv</h3>'
      + p('Søndag aften lægger du tre eller fire opskrifter ind i madplanen. Du åbner indkøbslisten, ser, hvilke varer der står uden flueben, og går butikken igennem efter afdeling. Du krydser varerne af undervejs, og hjemme tilføjer du det, der skal bruges først, til spisekammeret. Det er hele rutinen, og den tager få minutter.')],
    ['Hvad indkøbslisten ikke gør', '<ul><li><strong>Den bestiller ikke dagligvarer.</strong> Det er en liste og ikke en butik.</li>'
      + '<li><strong>Den regner ikke enheder om for dig.</strong> Ens enheder bliver lagt sammen, og forskellige enheder står som separate linjer.</li>'
      + '<li><strong>Den kan læse en opskrift forkert.</strong> Matlyst bruger AI til at læse opskrifter fra opslag og billeder, så tjek mængderne, før du stoler på listen.</li></ul>'],
  ],
}).html;

// ---------------------------------------------------------------- 6. Købsguide
const kobsguide = byggRik({
  lang: 'da',
  svarTekst: 'En god opskriftsapp gemmer opskrifter fra de steder, hvor du faktisk finder dem, gør dem søgbare på ingrediens, skalerer mængderne og hænger sammen med en madplan og en indkøbsliste. Prøv enhver app af med fem opskrifter fra dit eget liv, før du binder dig. Vi laver Matlyst, så vi siger, hvor den passer, og hvor den ikke gør.',
  seksjoner: [
    ['Hvem guiden er til', p('Du har opskrifter for mange steder: skærmbilleder, bogmærker, gemte reels, en notesapp og en stak trykte kort. Du vil have dem samlet ét sted. Guiden gennemgår, hvad du skal kigge efter, hvordan du afprøver en app på ti minutter, og hvilke fejl folk begår, når de vælger.')
      + p('For god ordens skyld: Vi laver Matlyst, en opskriftsapp. Guiden rangerer ikke apps og nævner ikke konkurrenter. Den giver dig kriterier, der virker for enhver app, og siger ærligt, hvor Matlyst passer, og hvor den ikke gør.')],
    ['Ti ting at kigge efter i en opskriftsapp', '<h3>1. Den gemmer opskrifter fra de steder, hvor du virkelig finder dem</h3>'
      + p('Lav en liste over dine ti seneste opskriftsfund. Var det på hjemmesider, Instagram, TikTok, YouTube, et billede af en side eller en besked fra en ven? Appen bør klare det meste af din liste med et eller to tryk.')
      + '<h3>2. Den gør opskriften ren</h3>'
      + p('Et gemt link er ikke en opskrift. Du vil have ingredienser med mængder og nummererede trin i samme opstilling hver gang, uden reklamer og uden livshistorie.')
      + '<h3>3. Du kan tjekke og rette</h3>'
      + p('Importer fra opslag på sociale medier og fra billeder kan være forkerte, især mængderne. Du skal kunne læse resultatet, før du gemmer, rette det og skrive dine egne noter.')
      + '<h3>4. Den kan søge på ingrediens</h3>'
      + p('Spørgsmålet en tirsdag aften er ikke ”hvad hed den suppe”, men ”hvad kan jeg lave med kylling og spinat”. Søgning på ingrediens er den funktion, der gør en bunke til et værktøj.')
      + '<h3>5. Den skalerer portioner</h3>'
      + p('Se efter skalering, der ændrer alle mængder på én gang. Husk, at skaleringen er lineær, så når du bager, kræver æg, salt og hævemidler stadig dit eget skøn.')
      + '<h3>6. Den håndterer dine enheder</h3>'
      + p('Laver du mad efter amerikanske opskrifter, vil du have cups, ounces og grader Fahrenheit, som de står. Laver du mad efter metriske opskrifter, vil du have gram og dl. Tjek, om appen regner om, beholder kildens enheder eller ingen af delene.')
      + '<h3>7. Den hænger sammen med en madplan og en indkøbsliste</h3>'
      + p('At holde orden er kun halvdelen af arbejdet. Gevinsten er at lægge ugens opskrifter ind i en plan og få én samlet indkøbsliste, sorteret efter afdeling i butikken.')
      + '<h3>8. Den virker i køkkenet</h3>'
      + p('Kan du lave mad efter den med beskidte hænder? Se efter en tjekliste eller en trin-for-trin-visning, timere og en skærm, der forbliver tændt. Tjek, om den virker uden net, når forbindelsen er dårlig.')
      + '<h3>9. Du kan forlade den</h3>'
      + p('Du skal kunne eksportere alle dine opskrifter uden beregning i et format, du kan åbne et andet sted. Kan du ikke få dine opskrifter ud, ejer du dem ikke.')
      + '<h3>10. Den er ærlig om sine grænser og sin pris</h3>'
      + p('Læs, hvad der er gratis, og hvad der ikke er, før du gemmer hundrede opskrifter. Se efter en klar beskrivelse af, hvad appen ikke kan, som at læse tekst i videoer eller kommentarer.')],
    ['En test på ti minutter, du kan køre på enhver app', p('Stol ikke på en liste over funktioner. Prøv fem rigtige opskrifter.')
      + '<ol><li><strong>En opskrift fra en hjemmeside</strong> med en lang historie før ingredienserne.</li>'
      + '<li><strong>En opskrift fra Instagram eller TikTok,</strong> hvor opskriften står i billedteksten.</li>'
      + '<li><strong>En opskrift, hvor mængderne kun bliver sagt højt</strong> i en video. Se, hvad appen gør, og om den fortæller dig det ærligt.</li>'
      + '<li><strong>Et billede af en trykt eller håndskrevet opskrift.</strong> Sammenlign hver mængde med originalen.</li>'
      + '<li><strong>To opskrifter, der begge skal bruge et løg.</strong> Læg begge på indkøbslisten, og se, hvad du får.</li></ol>'
      + p('Søg så på en ingrediens, skalér en opskrift til et andet antal portioner, og prøv at eksportere det hele. Tager et trin mere end et par minutter eller efterlader dig i tvivl, er det nyttig viden.')],
    ['Hvad apps ofte gør forkert', '<ul><li><strong>Skjulte fejl.</strong> En app, der importerer en opskrift med en forkert mængde og ikke viser noget udkast, er farligere end en, der beder dig tjekke.</li>'
      + '<li><strong>At lade, som om den læser video.</strong> Mange skabere siger kun mængderne højt. En app bør sige til, når den ikke kan læse dem.</li>'
      + '<li><strong>Overraskelser med enheder.</strong> Nogle apps regner om uden at sige det og runder mængder af på måder, der ødelægger en opskrift.</li>'
      + '<li><strong>Ingen vej ud.</strong> Din opskriftssamling er flere års arbejde. Sørg for, at du kan tage den med dig.</li></ul>'],
    ['Fire situationer, og hvad du skal kigge efter', scenarioNotat('da')
      + scenario('Sig, at du mest gemmer opskrifter fra Instagram og TikTok', {
        situasjon: 'Dine faner med gemte opslag er fulde, og du kan ikke finde noget.',
        galt: 'Du vælger en app, der kun gemmer links til hjemmesider.',
        gjor: 'Vælg en app, der læser billedtekster fra sociale medier, og prøv den af med to rigtige opslag. Tjek, hvad den gør, når opskriften ikke står i billedteksten.',
        matlyst: 'Matlyst læser billedtekster fra Instagram og TikTok. Den transskriberer ikke video og læser ikke kommentarer.' }, 'da')
      + scenario('Sig, at du har arvet en æske med håndskrevne kort', {
        situasjon: 'Falmet blæk, ”en klump smør” og ingen ovntemperaturer.',
        galt: 'Du stoler på scanningen og laver mad efter den.',
        gjor: 'Brug en app med billedimport, og sammenlign hver mængde med kortet. Behold originalen.',
        matlyst: 'Billedimport er en funktion i Matlyst Pro, op til 20 billeder pr. opskrift, og resultatet bør altid tjekkes.' }, 'da')
      + scenario('Sig, at du laver mad til en familie på fem', {
        situasjon: 'Opskrifterne er til fire, og indkøbslisten er lang.',
        galt: 'Du skalerer i hovedet og løber tør for salt.',
        gjor: 'Se efter skalering og en indkøbsliste, der lægger ens varer sammen.',
        matlyst: 'Portionerne skalerer fra 1 til 20, og ens varer med samme enhed bliver lagt sammen på indkøbslisten.' }, 'da')
      + scenario('Sig, at du deler madlavningen med din partner', {
        situasjon: 'Den ene planlægger, den anden handler.',
        galt: 'I sender lister som sms og mister halvdelen af varerne.',
        gjor: 'Se efter en delt liste, der opdateres live.',
        matlyst: 'Et Pro-medlem opretter en husstand for op til 6 personer. Indkøbslisten, den ugentlige madplan og spisekammeret opdateres live, og det er gratis at blive medlem.' }, 'da')],
    ['Hvor Matlyst passer, og hvor den ikke gør', p('Vi byggede Matlyst for at løse det problem, der er beskrevet øverst i guiden. Her er det ærlige resumé.')
      + '<div class="table-wrap"><table><thead><tr><th>Matlyst passer godt, hvis du …</th><th>Den er sandsynligvis ikke noget for dig, hvis du …</th></tr></thead><tbody>'
      + '<tr><td>gemmer opskrifter fra Instagram, TikTok, hjemmesider eller billeder</td><td>har brug for, at appen transskriberer det, der bliver sagt i videoer</td></tr>'
      + '<tr><td>vil have en madplan og en indkøbsliste bygget af dine egne opskrifter</td><td>vil have en app, der laver en hel madplan for dig</td></tr>'
      + '<tr><td>vil søge på ingrediens og have et spisekammer</td><td>har brug for stregkodescanning til varerne i spisekammeret</td></tr>'
      + '<tr><td>vil have gratis eksport af alt, hvad du gemmer</td><td>kun laver mad efter trykte kogebøger og aldrig gemmer noget digitalt</td></tr>'
      + '</tbody></table></div>'
      + p('Matlyst er gratis at komme i gang med, med 5 importer pr. kalendermåned. Læs mere på siden om <a href="/da/opskrifts-app/">opskriftsappen</a>, eller se, hvordan den virker med <a href="/da/gem-opskrifter-fra-instagram/">Instagram</a>, <a href="/da/gem-opskrifter-fra-tiktok/">TikTok</a>, <a href="/da/madplan-app/">madplanen</a> og <a href="/da/indkoebsliste-app/">indkøbslisten</a>. Skal du flytte fra en anden app, så se <a href="/da/skift-fra-paprika/">skift fra Paprika</a>.')],
    ['Hvad det koster at skifte', p('Det er billigere at skifte, end mange tror, hvis du gør det i små skridt. Start med de ti opskrifter, du laver oftest, og lad resten ligge, hvor det ligger, til du får brug for det. Ligger dine opskrifter i en anden opskriftsapp, så se, om den kan eksportere, og om den nye kan importere filen. Matlyst kan for eksempel læse en Paprika-eksport, se <a href="/da/skift-fra-paprika/">skift fra Paprika</a>.')
      + p('Husk også, hvad der sker den anden vej. Du skal kunne tage dine opskrifter med dig igen, hvis du bliver træt af appen. Det er den bedste forsikring mod at vælge forkert.')],
    ['Almindelige fejl, når man vælger', '<ul><li><strong>At vælge efter funktionslisten.</strong> Prøv med dine egne opskrifter.</li>'
      + '<li><strong>At flytte alt over første dag.</strong> Start med de ti opskrifter, du laver oftest.</li>'
      + '<li><strong>At undlade at læse importen.</strong> Tjek altid mængderne.</li>'
      + '<li><strong>At overse eksporten.</strong> Prøv den af, før du stoler på appen.</li></ul>'],
  ],
}).html;

export const rikeSider = {
  'opskrifts-app/': {
    title: 'Opskrifts-app: ét sted til alle dine opskrifter',
    description: 'Gem opskrifter fra hjemmesider, Instagram, TikTok og billeder i én opskriftsapp. Skalér portioner, planlæg ugen og lav indkøbsliste. Gratis at komme i gang.',
    h1: 'En opskriftsapp, der samler alle dine opskrifter ét sted',
    rik: opskriftsApp,
    faq: [
      ['Findes der en gratis opskriftsapp?', 'Ja. Matlyst er gratis at komme i gang med: 5 importer pr. kalendermåned, mapper, søgning, madplan og indkøbsliste. Matlyst Pro giver flere importer, billedimport, Spørg Matlyst og deling i en husstand.'],
      ['Kan jeg gemme opskrifter fra Instagram og TikTok?', 'Ja, ved at dele opslaget med Matlyst. Den læser opskriften fra billedteksten. Den transskriberer ikke det, der bliver sagt i videoen, så hvis mængderne kun bliver sagt højt, skal du tilføje dem i hånden efter importen.'],
      ['Kan jeg skalere en opskrift til flere portioner?', 'Ja, fra 1 til 20 portioner. Skaleringen er lineær, så tjek selv æg og hævemidler, når du bager.'],
      ['Virker den uden net?', 'Du kan læse dine opskrifter og din indkøbsliste uden net i op til 30 dage efter sidste synkronisering. Madlavningstilstand og redigering kræver forbindelse.'],
      ['Kan jeg dele opskrifter og en indkøbsliste med min husstand?', 'Ja. Et Pro-medlem opretter husstanden, op til 6 personer kan være med, og det er gratis at blive medlem. Indkøbslisten, den ugentlige madplan og spisekammeret opdateres live for alle.'],
      ['Hvilke enheder bruger den?', 'Mængderne er metriske som standard. Vælg Amerikansk under Enheder i Indstillinger, så beholder Matlyst de cups, ounces og grader Fahrenheit, som kilden brugte. Opskrifter på andre sprog bliver oversat til dansk.'],
      ['Kan jeg eksportere mine opskrifter?', 'Ja, uden beregning, som en Matlyst-fil (en zip med mapper og billeder) eller som HTML.'],
      ['Virker Matlyst på iPhone og Android?', 'Ja. Matlyst findes i App Store og på Google Play.'],
      ['Hvad er med i gratisversionen?', 'Gratisversionen har et begrænset antal importer om måneden, og appen viser, hvor mange du har brugt. Med Matlyst Pro får du flere importer og fotoimport.'],
    ],
  },
  'gem-opskrifter-fra-instagram/': {
    title: 'Sådan gemmer du opskrifter fra Instagram',
    description: 'Gem en opskrift fra et Instagram-opslag eller en reel ved at dele den med Matlyst. Trin for iPhone og Android, og hvad du gør, når billedteksten er tom.',
    h1: 'Sådan gemmer du opskrifter fra Instagram',
    rik: instagram,
  },
  'gem-opskrifter-fra-tiktok/': {
    title: 'Sådan gemmer du opskrifter fra TikTok trin for trin',
    description: 'Gør en TikTok-opskrift til ingredienser og trin, du kan søge i. Del videoen med Matlyst, tjek udkastet, skalér portionerne og lav maden. Gratis at komme i gang.',
    h1: 'Gør en TikTok til en opskrift, du faktisk kan lave mad efter',
    rik: tiktok,
  },
  'spisekammer-app/': {
    title: 'Spisekammer-app: se, hvad du har, og lav mad af det',
    description: 'En spisekammer-app, der viser, hvad du har, hvor mange dage der er tilbage, og hvilke gemte opskrifter der bruger det. Tilføj varer hurtigt og spild mindre mad.',
    h1: 'En spisekammer-app, der gør det, du har, til aftensmad',
    eyebrow: 'Spisekammer',
    lead: 'Skriv det ind, du har i køkkenet, se hvad der skal bruges først, og find de opskrifter, du allerede har gemt, der bruger det.',
    forst: 'Start med køleskabet. Fryseren og tørvareskabet kan du tilføje senere.',
    stegTittel: 'Sådan bruger du spisekammeret',
    steg: [
      ['Tilføj det, du har', 'Åbn spisekammeret og tilføj varer, med udløbsdato hvis varen har en.'],
      ['Se hvad der skal bruges først', 'Spisekammeret viser, hvor mange dage der er tilbage på hver vare.'],
      ['Lav mad af det', 'Søg i dine gemte opskrifter efter en ingrediens, eller bed Spørg Matlyst om forslag ud fra det, du har. Det er en Pro-funktion.'],
    ],
    alternativ: '',
    grense: 'I gratisversionen er der plads til et begrænset antal varer. Med Pro er der plads til flere.',
    seksjoner: [],
    faqTittel: 'Spørgsmål om spisekammeret',
    cta: 'Kom i gang med dit spisekammer',
    rik: spisekammer,
    faq: [
      ['Scanner Matlyst stregkoder?', 'Nej. Du tilføjer varer til spisekammeret i hånden.'],
      ['Er spisekammeret gratis?', 'I den gratis version viser spisekammeret 5 varer. Matlyst Pro giver flere, sammen med Spørg Matlyst og deling i en husstand.'],
      ['Kan Matlyst foreslå aftensmad ud fra det, jeg har?', 'Ja, med Matlyst Pro. I Spørg Matlyst laver ”Brug det, jeg har” forslag til aftensmad ud fra dit spisekammer. Det bruger AI og har en månedlig kvote, så tjek resultatet, før du laver maden.'],
      ['Forhindrer spisekammeret, at jeg køber dubletter?', 'Varer, du har i spisekammeret, starter uden flueben på din indkøbsliste, så du kan se, hvad du allerede har, før du handler.'],
      ['Virker det uden net?', 'Du kan læse dine opskrifter og din indkøbsliste uden net i op til 30 dage efter sidste synkronisering. Redigering kræver forbindelse.'],
      ['Hvor længe kan rester holde sig i køleskabet?', 'Det afhænger af, hvad det er. Matlyst giver ikke egne tal. Fødevarestyrelsen har råd om rester og madspild i hjemmet på foedevarestyrelsen.dk. Brug også dit eget skøn.'],
    ],
  },
  'indkoebsliste-app/': {
    title: 'Indkøbsliste ud fra opskrifter: én liste til ugen',
    description: 'Læg opskrifter ind i Matlyst, så havner ingredienserne på én indkøbsliste, lagt sammen og sorteret efter afdeling. Spring det over, du har. Gratis at starte.',
    h1: 'En indkøbsliste, der kommer direkte fra dine opskrifter',
    rik: indkoeb,
    faq: [
      ['Findes der en indkøbsliste-app, der tilføjer ingredienser fra opskrifter?', 'Ja. I Matlyst lægger du en opskrift eller en planlagt dag på indkøbslisten, og ingredienserne kommer på listen, hvor ens varer er lagt sammen.'],
      ['Kan jeg dele min indkøbsliste med min partner?', 'Ja. Et Pro-medlem opretter en husstand for op til 6 personer. Indkøbslisten, den ugentlige madplan og spisekammeret opdateres live for alle, og det er gratis at blive medlem.'],
      ['Sorterer listen varerne efter afdeling i butikken?', 'Ja. Varerne er grupperet efter afdeling, som frugt og grønt, kød og mejeri.'],
      ['Hvad sker der, når to opskrifter skal bruge den samme ingrediens?', 'Matlyst lægger ens varer sammen, når de har samme enhed. Er enhederne forskellige, står linjerne ved siden af hinanden.'],
      ['Kan jeg tilføje varer, der ikke står i en opskrift?', 'Ja. Tryk på + og skriv, hvad du har brug for.'],
      ['Ved listen, hvad jeg allerede har derhjemme?', 'Varer, du allerede har i spisekammeret, starter uden flueben på listen, så du kan se, hvad du har, før du køber det.'],
      ['Er indkøbslisten gratis?', 'Indkøbslisten er gratis. Det kræver Matlyst Pro at dele en fælles liste med husstanden. Du kan altid sende listen som tekst med del-knappen.'],
    ],
  },
  'blog/vaelg-opskriftsapp/': {
    title: 'Sådan vælger du en opskriftsapp',
    description: 'Ti ting at kigge efter i en opskriftsapp, en test på ti minutter, du kan køre på enhver app, og de fejl, folk begår, når de vælger. Fra dem bag Matlyst.',
    eyebrow: 'Købsguide',
    h1: 'Sådan vælger du en opskriftsapp',
    lead: 'Ti ting at kigge efter, en test på ti minutter og det, apps ofte gør forkert. Skrevet af dem, der laver Matlyst, uden rangering og uden konkurrenters navne.',
    forst: 'Prøv med dine egne opskrifter og ikke med en funktionsliste.',
    stegTittel: 'Sådan tester du en opskriftsapp',
    steg: [
      ['Prøv fem rigtige opskrifter', 'En opskrift fra en hjemmeside, et opslag på sociale medier, en video, hvor mængderne kun bliver sagt højt, et billede af en trykt opskrift og to opskrifter, der deler en ingrediens.'],
      ['Søg, skalér og eksportér', 'Søg på en ingrediens, skalér en opskrift, og prøv at eksportere det hele.'],
      ['Beslut dig', 'Hvis et trin er langsomt eller efterlader dig i tvivl, er det dit svar.'],
    ],
    alternativ: '',
    grense: '',
    seksjoner: [],
    faqTittel: 'Spørgsmål om at vælge opskriftsapp',
    rik: kobsguide,
    faq: [
      ['Hvad er den bedste måde at holde orden i opskrifter på?', 'Hav dem ét sted, i samme opstilling, med mulighed for at søge på ingrediens. En opskriftsapp gør det og kobler dine opskrifter til en madplan og en indkøbsliste.'],
      ['Hvad skal jeg kigge efter i en opskriftsapp?', 'Se efter, at den kan gemme fra de steder, hvor du faktisk finder opskrifter, at du kan tjekke og rette et udkast, søgning på ingrediens, skalering, enheder, madplan og indkøbsliste, læsning uden net og gratis eksport.'],
      ['Skal en opskriftsapp kunne læse opskrifter fra videoer?', 'Den skal være ærlig om det. Mange skabere siger kun mængderne højt. En app bør sige til, når den ikke kan læse dem, så du kan tilføje dem selv.'],
      ['Rækker en gratis opskriftsapp?', 'For mange, ja. Tjek, hvad den gratis version begrænser, for eksempel importer pr. måned, før du gemmer en stor samling.'],
      ['Hvordan flytter jeg mine opskrifter mellem apps?', 'Se efter eksport i et format, andre apps kan åbne, og efter en import, der kan læse andre apps’ eksportfiler. Prøv begge dele af, før du flytter alt.'],
    ],
    cta: 'Prøv med dine egne opskrifter',
  },
};

// All synlig tekst på forsiden, ett språk per gren under TEKST.
// Generatoren bygger siden av denne modulen. Oversettere jobber fra MENINGEN:
// kommentaren over hver gruppe sier hvor teksten står og hva den gjør.
// Hyllenavn og hyllelenker i menyen bor i scripts/hyller.mjs, og skalltekstene (meny, bunn,
// QR-vindu, samtykke) i scripts/skall-tekst.mjs, ikke her.
//
// PLASSHOLDERE: {klammer} i en tekst fylles inn av generatoren med fyll() under.
// Oversettere beholder plassholderne ordrett, men kan flytte dem i setningen.
// Disse tekstene tar plassholdere, og ingen andre:
//   spor.kort.svarAria          {oppskrift} {forklaring}  beskrivelse av det viste svaret
//   spor.kort.endringer         {antall}      antall endringer i listen
//   spor.kort.byttet            {fra} {til}   ingrediens som byttes, og erstatningen
//   spor.kort.fjernet           {vare}        ingrediens som er fjernet
//   spor.kort.omskrevet         {steg}        stegets navn, for eksempel «Steg 4»
//   middag.husstand.telling     {n} {ledige}  medlemmer og ledige plasser (av seks)
// Verdiene kommer fra `eksempler` og er håndskrevne.

// Fyller plassholdere i en mal. Kaster ved manglende, ukjent eller tom (undefined/null) verdi
// og ved klammer som ikke er en gyldig plassholder,
// slik at en skrivefeil i en nøkkel aldri havner på siden som «{navn}».
export function fyll(mal, verdier = {}) {
  const brukt = new Set();
  const ut = mal.replace(/\{(\w+)\}/g, (_, navn) => {
    if (!Object.hasOwn(verdier, navn)) throw new Error(`Mangler plassholder {${navn}} i «${mal}»`);
    if (verdier[navn] === undefined || verdier[navn] === null) throw new Error(`Plassholder {${navn}} har ingen verdi i «${mal}»`);
    brukt.add(navn);
    return String(verdier[navn]);
  });
  // En klammer som blir igjen (for eksempel {feil-navn}) er en skrivefeil i malen.
  if (/[{}]/.test(mal.replace(/\{\w+\}/g, ''))) throw new Error(`Ugyldig plassholder i «${mal}»`);
  for (const navn of Object.keys(verdier)) {
    if (!brukt.has(navn)) throw new Error(`Ukjent plassholder {${navn}} for «${mal}»`);
  }
  return ut;
}

// Stiene (punktert, relativt til TEKST.<språk>) til alt som er håndskrevet eksempelinnhold.
// Alt under disse stiene skal byttes ut med ekte utdata fra appen senere, og
// oversettes som levende eksempler, ikke ord for ord.
export const EKSEMPELSTIER = [
  'kokebok.retter',
  'spor.kort.oppskrift',
  'middag.demo.porsjoner',
  'middag.lag.tider',
  'middag.lag.skala',
  'middag.ukemeny.kalender',
  'middag.skaler.oppskrift',
  'middag.skaler.tid',
  'middag.skaler.lager',
  'middag.skaler.ingredienser',
  'middag.lag.steg',
  'middag.lag.timerTekst',
  'middag.ukemeny.uke',
  'middag.ukemeny.maaned',
  'middag.ukemeny.dager',
  'middag.handle.retter',
  'middag.handle.varer',
  'middag.handle.ark.oppskrift',
  'eksempler',
];

export const TEKST = {
  nb: {
    // ---------- Toppen av siden ----------
    // Menyen, språkvelgeren, bunnen og QR-vinduet bor i scripts/skall-tekst.mjs.
    // Lenkene i toppfeltet som følger deg nedover siden. Hver lenke hopper til en seksjon.
    // `mal` er seksjonens anker, `tekst` er det som vises.
    folg: {
      lenker: [
        { mal: 'lagre', tekst: 'Lagre' },
        { mal: 'spor', tekst: 'Spør Matlyst' },
        { mal: 'middag', tekst: 'Lag maten' },
        { mal: 'pris', tekst: 'Pris' },
        { mal: 'svar', tekst: 'Spørsmål' },
      ],
    },

    // ---------- Hero: det første man ser ----------
    // Hovedoverskriften. Skrives ut bokstav for bokstav ved sidelasting.
    h1: 'Oppskrifter du faktisk lager.',
    // Underteksten rett under overskriften: hva appen gjør, med tre eksempler på kilder.
    ingress: 'Fra en Reel, en nettside eller et bilde av bestemors kort. Matlyst gjør dem om til ingredienser og steg.',
    // Hovedknappen. Står øverst, nederst og som fast knapp når man har rullet forbi den første.
    // Fører til nedlasting (på stor skjerm åpnes QR-vinduet).
    knapp: 'Last ned gratis',
    // Linjen under knappen, ved siden av fem stjerner. Antall vurderinger vises ikke.
    vurdering: '5,0 av 5 i App Store',

    // Seks trinn ved siden av filmen som viser hvordan man lagrer en oppskrift fra Instagram.
    // Hvert trinn er en knapp som spoler filmen til riktig sted (`stegtider`, i sekunder).
    // Siste trinn er et resultat, ikke en handling, og har et hakemerke i stedet for nummer.
    stegAria: 'Slik lagrer du en oppskrift fra Instagram',
    steg: [
      'Trykk på papirflyet',
      'Trykk Del til',
      'Velg Matlyst',
      'Velg mappe og trykk Lagre',
      'Matlyst henter oppskriften',
      'Ferdig. Ingredienser, steg og bilde.',
    ],
    stegtider: [0, 2.5, 6.0, 9.7, 13.3, 16.5],
    // Beskrivelse av filmen for skjermlesere. Filmen viser en telefon.
    filmAria: 'Film: en oppskrift deles fra Instagram til Matlyst og blir til ingredienser, steg og bilde',

    // Det rullende båndet under heroen: hvor man kan lagre oppskrifter fra.
    // `ikon` er en kort id for ikonet og oversettes ikke.
    kildetittel: 'Lagre oppskrifter fra',
    kilderAria: 'Kilder du kan lagre fra',
    kilder: [
      { navn: 'Instagram', ikon: 'instagram' },
      { navn: 'TikTok', ikon: 'tiktok' },
      { navn: 'YouTube', ikon: 'youtube' },
      { navn: 'Facebook', ikon: 'facebook' },
      { navn: 'Nettsider', ikon: 'nettsider' },
      { navn: 'Matblogger', ikon: 'matblogger' },
      { navn: 'Bildegalleri', ikon: 'bildegalleri' },
      { navn: 'Kokebøker', ikon: 'kokeboker' },
    ],

    // ---------- Kokeboken: en rad med åtte retter ----------
    // Tittel og ingress over radene med rettbilder.
    kokebok: {
      tittel: 'Din egen kokebok',
      ingress: 'Alt du lagrer, havner på ett sted. Med bilde, ingredienser og steg.',
      // Hver rett er et kort med bilde, rettens navn og tilberedningstid.
      // `fil` er bildefilen i images/forside/mat/ uten endelse og oversettes ikke.
      // Dette er eksempelretter (se EKSEMPELSTIER). Oversetter: bruk retter som er naturlige
      // i målgruppens land, med navn på målspråket. Ikke oversett de norske navnene ord for ord.
      // Tidsformatet følger språket. Filnavnet i `fil` må følge bildet, så bytter du rett, bytter du bilde.
      // EKSEMPEL
      retter: [
        { fil: 'butterchicken', tittel: 'Butter chicken', tid: '50 min' },
        { fil: 'laks', tittel: 'Ovnsbakt laks med grønnsaker', tid: '30 min' },
        { fil: 'focaccia', tittel: 'Focaccia med tomat og rosmarin', tid: '2 t 30 min' },
        { fil: 'ramen', tittel: 'Ramen med egg og mais', tid: '40 min' },
        { fil: 'kanelboller', tittel: 'Kanelboller', tid: '1 t 45 min' },
        { fil: 'taco', tittel: 'Biff-taco med pico de gallo', tid: '30 min' },
        { fil: 'tomatpasta', tittel: 'Kremet tomatpasta', tid: '25 min' },
        { fil: 'sjokoladekake', tittel: 'Saftig sjokoladekake', tid: '60 min' },
      ],
      // Liten merknad under radene. Opplyser at matbildene er KI-genererte.
      kimerke: 'Bildene er laget med KI.',
    },

    // ---------- Spør Matlyst ----------
    // Seksjonen med en animert eksempelsamtale til venstre og et appkort til høyre.
    spor: {
      tittel: 'Spør Matlyst',
      // Forklarer funksjonen: bytte ingredienser eller få hele oppskriften skrevet om.
      ingress: 'Bytt ut ingredienser, eller be om en ny versjon av hele oppskriften. Matlyst skriver den om, og du velger om du vil lagre den.',
      // Feltet der eksemplene skrives ut bokstav for bokstav. Skjermleserlabel.
      feltAria: 'Eksempel på hva du kan be om',
      // Fire knapper med eksempler på hva man kan be om. Å trykke på en knapp skriver
      // teksten i feltet og viser det tilhørende svaret (se `eksempler.svar`, samme rekkefølge).
      forslagAria: 'Flere eksempler',
      forslag: [
        'Gjør denne vegansk',
        'Jeg ønsker en lavkarbo-versjon',
        'Bytt ut fløten',
        'Bruk det jeg har i spiskammeret',
      ],
      // Liten tekst under knappene. Sier hva som er gratis og hva som krever Pro.
      smaatt: 'Spørsmål om en oppskrift er gratis. Å skrive den om krever Matlyst Pro.',

      // Appkortet til høyre: en gjengivelse av hvordan svaret ser ut i appen.
      kort: {
        // Beskrivelse av hele kortet for skjermlesere.
        svarAria: 'Eksempel fra appen: {oppskrift}. {forklaring} Med valgene Overskriv og Lag en kopi.',
        aria: 'Eksempel fra appen: Spør Matlyst har skrevet om en kremet kyllinggryte etter ønsket ved siden av, og viser hvilke ingredienser som er byttet, med valgene Overskriv og Lag en kopi.',
        // Toppen av kortet: ordet «spør» foran ordmerket «matlyst», og Pro-merket.
        spor: 'spør',
        merkeStart: 'mat',
        merkeSlutt: 'lyst',
        pro: 'PRO',
        // Navnet på oppskriften som er skrevet om. Et eksempel, ikke en ekte oppskrift.
        // EKSEMPEL
        oppskrift: 'Kremet kyllinggryte',
        // Overskriften over listen med endringer. Antallet settes inn i parentes. Tar {antall}.
        endringer: 'Endringer ({antall})',
        // Én rad i endringslisten, i tre varianter. Verdiene som settes inn står i fet skrift:
        // {fra}, {til} og {vare} er ingrediensnavn fra `eksempler.svar[].endringer`, og {steg}
        // er stegets navn («Steg 4»). Raden har plass til én linje på en smal telefon,
        // så hold malen kort, og la ingrediensnavn og steg stå sist eller først etter språkets rytme.
        byttet: 'Byttet {fra} med {til}',
        fjernet: 'Fjernet {vare}',
        omskrevet: '{steg} skrevet om',
        // De to knappene nederst i kortet: erstatt originalen, eller lagre som ny oppskrift.
        overskriv: 'Overskriv',
        kopi: 'Lag en kopi',
        // Knappen som angrer endringen.
        angre: 'Angre',
        // Merknad nederst i kortet. Opplyser at svaret er KI-generert og må kontrolleres.
        ki: 'Matlyst bruker KI. Sjekk alltid oppskriften.',
        // Vises i stedet for «Endringer (n)» mens svaret «tenkes ut». Ledsages av tre grå skjelettlinjer.
        endrer: 'Endrer…',
      },
    },

    // ---------- Fra oppskrift til middag ----------
    // Seksjonen med fem kort. Hvert kort har overskrift, en kort forklaring og et lite appeksempel.
    // Alle navn, mengder og tall i appeksemplene er håndskrevne eksempler.
    middag: {
      // Tall og tegn som vises i de animerte eksemplene.
      demo: { porsjoner: ['4', '5', '6'], minus: '−', pluss: '+' },
      tittel: 'Fra oppskrift til middag',
      ingress: 'Når oppskriften er lagret, kan du skalere den, handle til den og lage den steg for steg.',

      // Kort 1: porsjonsteller som øker fra 4 til 6 og skalerer mengdene.
      skaler: {
        tittel: 'Skaler',
        tekst: 'Fra 4 til 6 porsjoner, og alle mengdene følger med.',
        aria: 'Fra appen: porsjonstelleren står på 4 og økes til 6. Hvetemel går fra 4 til 6 dl, sukker fra 3 til 4,5 dl og kakao fra 1 til 1,5 dl.',
        // EKSEMPEL
        oppskrift: 'Saftig sjokoladekake',
        // EKSEMPEL
        tid: '60 min',
        // Lagerstatus: hvor mange av ingrediensene man har i spiskammeret.
        // EKSEMPEL
        lager: '3 av 9 på lager',
        // Tre ingredienser. `mengder` er mengden ved 4, 5 og 6 porsjoner.
        // EKSEMPEL
        ingredienser: [
          { navn: 'hvetemel', mengder: ['4 dl', '5 dl', '6 dl'] },
          { navn: 'sukker', mengder: ['3 dl', '3¾ dl', '4½ dl'] },
          { navn: 'kakao', mengder: ['1 dl', '1¼ dl', '1½ dl'] },
        ],
      },

      // Kort 2: kokemodus. Stegene er en sjekkliste, og en tid i steget blir en tidtaker.
      lag: {
        tittel: 'Lag maten',
        tekst: 'Stegene blir en sjekkliste. Står det en tid i steget, trykker du på den og får en tidtaker.',
        aria: 'Fra appen: i steg 2 trykkes det på tiden 10 minutter. En tidtaker kommer fram, startes og teller ned, og steget krysses av.',
        // Tre steg fra en ramenoppskrift. Steg 2 har tiden «10 minutter» som man trykker på.
        // `tidsuttrykk` er ordene i `tekst` som blir en trykkbar tid, og må stå ordrett i teksten.
        // EKSEMPEL
        steg: [
          { nr: 2, tekst: 'Varm buljongen og visp inn miso, soyasaus og sesamolje. La den trekke på lav varme i 10 minutter.', tidsuttrykk: '10 minutter' },
          { nr: 3, tekst: 'Kok nudlene etter anvisningen på pakken og fordel dem i fire dype boller.' },
          { nr: 4, tekst: 'Hell over buljongen og topp med egg, mais, strimlet vårløk og en skje chiliolje.' },
        ],
        // Tidtakerkortet som kommer opp når man trykker på tiden: «Steg 2», midtpunkt og hele stegteksten.
        // Teksten gjentar steg 2 i `steg` ovenfor. De to MÅ holdes like på hvert språk,
        // også tidsuttrykket, ellers ser det ut som tidtakeren hører til et annet steg.
        // EKSEMPEL
        timerTekst: 'Steg 2 · Varm buljongen og visp inn miso, soyasaus og sesamolje. La den trekke på lav varme i 10 minutter.',
        // Tidtakerens eksempeltilstander og ytterpunkter.
        tider: ['10:00', '9:59', '9:58', '9:57', '9:56', '9:55'],
        skala: ['1:00', '20:00'],
        avbryt: 'Avbryt',
        start: 'Start',
      },

      // Kort 3 (bredt): ukemenyen, med en kalender som åpnes fra ukelinjen.
      ukemeny: {
        tittel: 'Ukemeny',
        tekst: 'Planlegg uka. Åpner du kalenderen, ser du hele måneden, og en prikk betyr at dagen er planlagt.',
        aria: 'Fra appen: ukemenyen for 16. til 22. november. Ukelinja åpnes til en kalender for hele november, der dagene med planlagte måltider har en prikk og dagen i dag har en ring.',
        // Ukelinja. Tallområdet bruker tankestrek mellom to tall.
        // EKSEMPEL
        uke: '16–22. nov 2026',
        // Kalenderoverskriften og ukedagene i kalenderen (mandag først, forkortet).
        // EKSEMPEL
        maaned: 'November 2026',
        // November starter på søndag (0). Eksempelets markerte dag beholdes.
        kalender: { startUkedag: 0, idag: '18', dager: Array.from({ length: 30 }, (_, i) => String(i + 1)), planlagt: ['3', '5', '6', '10', '12', '13', '19', '20', '22', '24', '26', '27'] },
        ukedager: ['man', 'tir', 'ons', 'tor', 'fre', 'lør', 'søn'],
        // To planlagte dager under kalenderen. Rettene er de samme som i kokeboken.
        // EKSEMPEL
        dager: [
          { dag: 'Torsdag 19. nov.', rett: 'Butter chicken', fil: 'butterchicken', tid: '50 min' },
          { dag: 'Fredag 20. nov.', rett: 'Biff-taco med pico de gallo', fil: 'taco', tid: '30 min' },
        ],
        // Måltidstypen på hver planlagt rett.
        maltid: 'Middag',
      },

      // Kort 4: handlelisten. Samme vare i flere retter står på én linje.
      // Man holder inne på en rett for å endre porsjonene.
      handle: {
        tittel: 'Handle',
        tekst: 'Trenger flere retter det samme, står det på én linje. Hold inne på en rett for å endre porsjonene, så følger mengdene med.',
        aria: 'Fra appen: handlelista for fire retter. Hvitløk trengs i tre av dem og står på én linje. Det holdes inne på kyllingsuppa, Endre porsjoner velges, porsjonene økes fra 4 til 6, og hvitløk, gulrot og dill øker med.',
        // De fire rettene handlelisten er laget for (merkelapper øverst).
        // EKSEMPEL
        retter: ['Ovnsbakt laks med grønnsaker', 'Kyllingsuppe med urter', 'Butter chicken', 'Biff-taco med pico de gallo'],
        // Butikkhyllen varene står under.
        hylle: 'FRUKT & GRØNT',
        // Varene. `mengder` gjelder 4 og 6 porsjoner av kyllingsuppa. `prikker` viser rettene som bruker varen.
        // EKSEMPEL
        varer: [
          { navn: 'hvitløk', prikker: [1, 2, 3], mengder: ['6 fedd', '7 fedd'] },
          { navn: 'gulrot', prikker: [2, 4], mengder: ['4 stk', '5 stk'] },
          { navn: 'dill', prikker: [2], mengder: ['0,5 bunt', '0,75 bunt'] },
          { navn: 'brokkoli', prikker: [1], mengder: ['1 stk', '1 stk'] },
        ],
        // Menyen som kommer opp når man holder inne på en rett.
        meny: ['Endre porsjoner', 'Fjern fra handleliste'],
        // Arket for å endre porsjoner, med oppskriftsnavn, teller og en knapp.
        ark: {
          // EKSEMPEL
          oppskrift: 'Kyllingsuppe med urter',
          antall: 'Antall porsjoner',
          oppdater: 'Oppdater handleliste',
        },
      },

      // Kort 5: husstand. Velgeren og innholdet fylles fra `eksempler.husstander`.
      husstand: {
        tittel: 'Husstand',
        tekst: 'En husstand er dem du lager mat sammen med: familien, vennegjengen på hyttetur eller alle som skal på 17. mai-frokost. Alle ser den samme lista, og hvem som la inn hva.',
        // Gruppen med tre knapper som bytter mellom husstandene.
        velgAria: 'Velg husstand',
        // Under husstandsnavnet. {n} er antall medlemmer, {ledige} antall ledige plasser av seks.
        telling: '{n} av 6 · {ledige} plasser ledige',
        // Overskriften over en handleliste i husstanden. Undertittelen står i `eksempler.husstander`.
        listehode: 'Handleliste',
        // Måltidstypen på en planlagt rett i husstanden.
        maltid: 'Middag',
      },
    },

    // ---------- Hva koster det? ----------
    pris: {
      tittel: 'Hva koster det?',
      ingress: 'Appen er gratis. Pro er for deg som vil lagre mer.',
      // Kortet for gratisplanen. `linje` er hovedpoenget, `punkter` er det du får, `fot` er den lille linjen nederst.
      gratis: {
        tittel: 'Gratis',
        linje: '5 importer i måneden.',
        punkter: ['Ukemeny og handleliste', 'Skaler porsjoner', 'Lag maten steg for steg'],
        fot: 'Ingen tidsgrense.',
      },
      // Kortet for Pro. Prisen nevnes ikke her; appen viser den før kjøp.
      pro: {
        tittel: 'Pro',
        linje: 'Uten grensen på fem importer.',
        punkter: ['Lagre fra bilder og kokebøker', 'Skriv om oppskrifter med Spør Matlyst', 'Næringsinnhold per porsjon', 'Del med husstanden, opptil 6'],
        fot: 'Prisen ser du i appen før du kjøper.',
      },
      // Den store linjen under prisene: et lett og varmt løfte om at vi ikke sporer deg.
      vernord: 'Vi har bedre ting å gjøre enn å spore deg. Nyt maten din.',
      // Den lille, faktiske setningen ved siden av lenken. Må være sann ordrett.
      vern: 'Matlyst sporer deg ikke for reklame. Ingen annonser, ingen salg av data.',
      // Lenken som fører til personvernsiden.
      vernlenke: 'Slik behandler vi data',
    },

    // ---------- Spørsmål og svar ----------
    // Seks sammenleggbare spørsmål. Spørsmålet er alltid synlig, svaret åpnes ved trykk.
    svar: {
      tittel: 'Spørsmål og svar',
      sporsmal: [
        { q: 'Hva koster Matlyst?', a: 'Appen er gratis, og du kan lagre 5 oppskrifter fra lenker hver måned uten å betale. Pro fjerner grensen og lar deg lagre fra bilder. Prisen ser du i appen før du kjøper.' },
        { q: 'Hvor kan jeg lagre oppskrifter fra?', a: 'Fra Instagram, TikTok, YouTube og nettsider som Matprat. Trykk på Del i innlegget og velg Matlyst. Med Pro kan du også ta bilde av en oppskrift i en kokebok.' },
        { q: 'Kan jeg flytte oppskriftene mine fra Paprika?', a: 'Ja. Eksporter oppskriftene fra Paprika, og velg eksportfilen i Matlyst.' },
        { q: 'Blir oppskrifter på andre språk oversatt?', a: 'Ja. Ingredienser og fremgangsmåte oversettes til språket du bruker i appen. Sjekk alltid mengdene mot originalen.' },
        { q: 'Kan vi være flere om ukemeny og handleliste?', a: 'Ja. Med Pro inviterer du husstanden, opptil 6 personer. Det er gratis for dem du inviterer.' },
        { q: 'Finnes Matlyst for Android?', a: 'Ja. Matlyst finnes for iPhone, iPad og Android.' },
      ],
    },

    // ---------- Eksempler ----------
    // Håndskrevne eksempler som vises i appmockupene. De skal byttes ut med ekte
    // utdata fra appen senere. Oversett dem som levende eksempler, ikke ord for ord:
    // rettene og navnene skal virke naturlige for målgruppen.
    // Flere eksempler står i selve seksjonene; alle stiene er samlet i EKSEMPELSTIER.
    // EKSEMPEL
    eksempler: {
      // Håndskrevne eksempelsvar. Byttes mot ekte svar fra appen senere (EKSEMPELSTIER).
      // Svarene i Spør Matlyst-kortet, i samme rekkefølge som `spor.forslag`.
      // `endringer` bruker malene i `spor.kort` (byttet, fjernet, omskrevet).
      // `forklaring` er den korte teksten under listen.
      svar: [
        {
          endringer: [
            { byttet: { fra: 'kyllingfilet', til: 'kikerter' } },
            { byttet: { fra: 'smør', til: 'olivenolje' } },
            { byttet: { fra: 'kremfløte', til: 'havrefløte' } },
          ],
          antall: 3,
          forklaring: 'Kyllingen er byttet med kikerter, og smør og fløte med plantebaserte varianter. Resten av retten er som før.',
        },
        {
          endringer: [
            { byttet: { fra: 'basmatiris', til: 'blomkålris' } },
            { fjernet: 'hvetemel' },
          ],
          antall: 2,
          forklaring: 'Risen er byttet med blomkålris, og sausen jevnes uten mel.',
        },
        {
          endringer: [
            { byttet: { fra: 'kremfløte', til: 'kokosmelk' } },
            { omskrevet: 'Steg 4' },
          ],
          antall: 2,
          forklaring: 'Kokosmelk gir samme fylde. Steg 4 er justert så sausen ikke skiller seg.',
        },
        {
          endringer: [
            { byttet: { fra: 'sjalottløk', til: 'gul løk' } },
            { byttet: { fra: 'fersk timian', til: 'tørket timian' } },
          ],
          antall: 2,
          forklaring: 'To ingredienser er byttet med det du har i spiskammeret.',
        },
      ],

      // De tre husstandene i husstandskortet. `merke` er teksten på knappen i velgeren over
      // kortet (kort, ett eller to ord), `navn` står i fet skrift øverst i kortet.
      // `folk` er bildenumre (images/forside/folk/), ikke tekst, og `sist` er hvem som la inn det siste.
      // En husstand har enten `dager` (planlagte middager, hver med dag, rett, minutter og eier)
      // eller `varer` (en handleliste med `listetittel` som undertittel, og varer med mengde og eier).
      // `eier` er navnet på den som la inn raden, `ansikt` er personens bildenummer.
      // `ny: true` betyr at raden glir inn litt etter at husstanden er valgt.
      husstander: [
        {
          merke: 'Familien',
          navn: 'Hjemme hos oss',
          folk: [1, 2, 3, 4],
          sist: 3,
          dager: [
            { dag: 'Torsdag 19. nov.', rett: 'Butter chicken', fil: 'butterchicken', tid: '50 min', min: 50, eier: 'Jonas', ansikt: 2 },
            { dag: 'Fredag 20. nov.', rett: 'Biff-taco med pico de gallo', fil: 'taco', tid: '30 min', min: 30, eier: 'Emma', ansikt: 3, ny: true },
          ],
        },
        {
          merke: 'Hytteturen',
          navn: 'Hytteturen',
          folk: [5, 6, 7, 8],
          sist: 8,
          listetittel: 'til helga',
          varer: [
            { navn: 'tacolefser', mengde: '2 pk', eier: 'Mia', ansikt: 5 },
            { navn: 'kjøttdeig', mengde: '800 g', eier: 'Sander', ansikt: 6 },
            { navn: 'rømme', mengde: '3 dl', eier: 'Nora', ansikt: 7 },
            { navn: 'kakao', mengde: '1 boks', eier: 'Mia', ansikt: 5 },
            { navn: 'pølser', mengde: '2 pk', eier: 'Elias', ansikt: 8, ny: true },
          ],
        },
        {
          merke: '17. mai-frokost',
          navn: '17. mai-frokost',
          folk: [9, 10, 11, 12],
          sist: 11,
          listetittel: 'til frokosten',
          varer: [
            { navn: 'røkelaks', mengde: '400 g', eier: 'Liv', ansikt: 9 },
            { navn: 'egg', mengde: '12 stk', eier: 'Amir', ansikt: 10 },
            { navn: 'rundstykker', mengde: '10 stk', eier: 'Henrik', ansikt: 12 },
            { navn: 'gressløk', mengde: '1 bunt', eier: 'Amir', ansikt: 10 },
            { navn: 'jordbær', mengde: '2 kurver', eier: 'Sofie', ansikt: 11, ny: true },
          ],
        },
      ],
    },
  },

  // sv: fra ~/matlyst-privat/seo-matlyst/2026-11-18/sprak/forside-sv.mjs (skalltekstene bor i skall-tekst.mjs).
  // Svensk forside (/sv/). Samme nøkkelstruktur som TEKST.nb i scripts/forside-tekst.mjs.
  // Skrevet fra meningen, ikke oversatt setning for setning. Rapport: forside-sv-rapport.md.
  // Eksempelinnholdet (EKSEMPELSTIER) er svensk hverdag: svenske retter, navn og mål (dl, msk, st).
  // Bildefilene i `fil` og `folk`/`ansikt` er de samme som på norsk; rettene er valgt så de passer bildene.
  sv: {
    folg: {
      aria: 'På den här sidan',
      lenker: [
        { mal: 'lagre', tekst: 'Spara' },
        { mal: 'spor', tekst: 'Fråga Matlyst' },
        { mal: 'middag', tekst: 'Laga maten' },
        { mal: 'pris', tekst: 'Pris' },
        { mal: 'svar', tekst: 'Frågor' },
      ],
    },

    // ---------- Hero ----------
    h1: 'Recepten du faktiskt lagar.',
    ingress: 'Från en reel, en receptsida eller ett foto av mormors receptkort. Matlyst gör dem till ingredienser och steg.',
    knapp: 'Hämta gratis',
    // Samme linje som på norsk (Patrick 19.11); antallet vises ikke.
    vurdering: '5,0 av 5 i App Store',

    stegAria: 'Så sparar du ett recept från Instagram',
    // «Dela till» er knappen slik den heter i svensk Instagram (samme ord som appkatalogen).
    steg: [
      'Tryck på pappersflygplanet',
      'Tryck på Dela till…',
      'Välj Matlyst',
      'Välj mapp och tryck på Spara',
      'Matlyst hämtar receptet',
      'Klart. Ingredienser, steg och bild.',
    ],
    stegtider: [0, 2.5, 6.0, 9.7, 13.3, 16.5],
    filmAria: 'Film: på Instagram väljs Matlyst i delningsmenyn, och inlägget blir ett recept med ingredienser, steg och bild',

    kildetittel: 'Spara recept från',
    kilderAria: 'Källor du kan spara från',
    kilder: [
      { navn: 'Instagram', ikon: 'instagram' },
      { navn: 'TikTok', ikon: 'tiktok' },
      { navn: 'YouTube', ikon: 'youtube' },
      { navn: 'Facebook', ikon: 'facebook' },
      { navn: 'Webbplatser', ikon: 'nettsider' },
      { navn: 'Matbloggar', ikon: 'matblogger' },
      { navn: 'Bilder i mobilen', ikon: 'bildegalleri' },
      { navn: 'Kokböcker', ikon: 'kokeboker' },
    ],

    // ---------- Kokboken ----------
    kokebok: {
      tittel: 'Din egen kokbok',
      ingress: 'Allt du sparar hamnar på ett ställe. Med bild, ingredienser och steg.',
      // EKSEMPEL. Rettene følger bildene; tårta (ikke kladdkaka) fordi bildet er en lagkake med glasyr.
      retter: [
        { fil: 'butterchicken', tittel: 'Butter chicken', tid: '50 min' },
        { fil: 'laks', tittel: 'Ugnsbakad lax med grönsaker', tid: '30 min' },
        { fil: 'focaccia', tittel: 'Focaccia med tomat och rosmarin', tid: '2 tim 30 min' },
        { fil: 'ramen', tittel: 'Ramen med ägg och majs', tid: '40 min' },
        { fil: 'kanelboller', tittel: 'Kanelbullar', tid: '1 tim 45 min' },
        { fil: 'taco', tittel: 'Tacos med pico de gallo', tid: '30 min' },
        { fil: 'tomatpasta', tittel: 'Krämig tomatpasta', tid: '25 min' },
        { fil: 'sjokoladekake', tittel: 'Saftig chokladtårta', tid: '60 min' },
      ],
      kimerke: 'Bilderna är skapade med AI.',
    },

    // ---------- Fråga Matlyst ----------
    spor: {
      tittel: 'Fråga Matlyst',
      ingress: 'Byt ut ingredienser eller be om en ny version av hela receptet. Matlyst skriver om det, och du väljer själv om du vill spara det.',
      feltAria: 'Exempel på vad du kan be om',
      forslagAria: 'Fler exempel',
      // Samme rekkefølge som eksempler.svar.
      forslag: [
        'Gör den vegansk',
        'Jag vill ha en LCHF-version',
        'Byt ut grädden',
        'Använd det jag har i skafferiet',
      ],
      smaatt: 'Att fråga om ett recept är gratis. För att skriva om det behöver du Matlyst Pro.',

      // Ordene i kortet følger appens svenske katalog (lib/sprak/sv/tekster.json).
      kort: {
        aria: 'Exempel från appen: Fråga Matlyst har skrivit om en krämig kycklinggryta efter önskemålet bredvid och visar vilka ingredienser som har bytts ut, med valen Skriv över och Skapa en kopia.',
        spor: 'fråga',
        pro: 'PRO',
        // EKSEMPEL
        oppskrift: 'Krämig kycklinggryta',
        endringer: 'Ändringar ({antall})',
        byttet: 'Bytte {fra} mot {til}',
        fjernet: 'Tog bort {vare}',
        omskrevet: '{steg} omskrivet',
        overskriv: 'Skriv över',
        kopi: 'Skapa en kopia',
        angre: 'Ångra',
        ki: 'Matlyst använder AI. Kontrollera alltid receptet.',
        endrer: 'Ändrar…',
      },
    },

    // ---------- Från recept till middag ----------
    middag: {
      tittel: 'Från recept till middag',
      ingress: 'När receptet är sparat kan du ändra antalet portioner, handla det som behövs och laga det steg för steg.',

      skaler: {
        tittel: 'Portioner',
        tekst: 'Öka från 4 till 6 portioner, så följer alla mängder med.',
        aria: 'Från appen: antalet portioner står på 4 och ökas till 6. Vetemjöl går från 4 till 6 dl, strösocker från 2 till 3 dl och kakao från 8 till 12 msk.',
        // EKSEMPEL (samme kake som i kokboken)
        oppskrift: 'Saftig chokladtårta',
        // EKSEMPEL
        tid: '60 min',
        // EKSEMPEL. Appens form: «{antall} av {total} i skafferiet».
        lager: '3 av 9 i skafferiet',
        // EKSEMPEL. Mengder ved 4, 5 og 6 portioner (×1, ×1,25, ×1,5).
        ingredienser: [
          { navn: 'vetemjöl', mengder: ['4 dl', '5 dl', '6 dl'] },
          { navn: 'strösocker', mengder: ['2 dl', '2½ dl', '3 dl'] },
          { navn: 'kakao', mengder: ['8 msk', '10 msk', '12 msk'] },
        ],
      },

      lag: {
        tittel: 'Laga maten',
        tekst: 'Stegen blir en checklista. Tryck på en tid i ett steg, så får du en timer.',
        aria: 'Från appen: i steg 2 trycker någon på tiden 10 minuter. En timer dyker upp, startas och räknar ned, och steget bockas av.',
        // EKSEMPEL. `tidsuttrykk` står ordrett i teksten.
        steg: [
          { nr: 2, tekst: 'Värm buljongen och vispa ner miso, soja och sesamolja. Låt sjuda på svag värme i 10 minuter.', tidsuttrykk: '10 minuter' },
          { nr: 3, tekst: 'Koka nudlarna enligt anvisningen på förpackningen och fördela dem i fyra djupa skålar.' },
          { nr: 4, tekst: 'Häll över buljongen och toppa med ägg, majs, strimlad salladslök och en sked chiliolja.' },
        ],
        // EKSEMPEL. Må være identisk med steg 2 over.
        timerTekst: 'Steg 2 · Värm buljongen och vispa ner miso, soja och sesamolja. Låt sjuda på svag värme i 10 minuter.',
        avbryt: 'Avbryt',
        start: 'Starta',
      },

      ukemeny: {
        tittel: 'Veckomeny',
        tekst: 'Planera veckan. Öppnar du kalendern ser du hela månaden, och en prick betyder att dagen är planerad.',
        aria: 'Från appen: veckomenyn för 16 till 22 november. Veckoraden öppnas till en kalender för hela november, där dagar med planerade måltider har en prick och dagens datum har en ring.',
        // EKSEMPEL
        uke: '16–22 nov. 2026',
        // EKSEMPEL
        maaned: 'November 2026',
        ukedager: ['mån', 'tis', 'ons', 'tors', 'fre', 'lör', 'sön'],
        // EKSEMPEL. Fredagstacos.
        dager: [
          { dag: 'Torsdag 19 nov.', rett: 'Butter chicken', tid: '50 min' },
          { dag: 'Fredag 20 nov.', rett: 'Tacos med pico de gallo', tid: '30 min' },
        ],
        maltid: 'Middag',
      },

      handle: {
        tittel: 'Handla',
        tekst: 'Om flera rätter behöver samma vara hamnar den på samma rad. Håll en rätt nedtryckt för att ändra portionerna, så följer mängderna med.',
        aria: 'Från appen: inköpslistan för fyra rätter. Vitlök behövs i tre av dem och står på en rad. Någon håller kycklingsoppan nedtryckt och väljer Ändra portioner. Portionerna ökas från 4 till 6, och mängderna av vitlök, morot och dill ökar.',
        // EKSEMPEL
        retter: ['Ugnsbakad lax med grönsaker', 'Kycklingsoppa med örter', 'Butter chicken', 'Tacos med pico de gallo'],
        hylle: 'FRUKT & GRÖNT',
        // EKSEMPEL. Mengder ved 4 og 6 portioner av kycklingsoppan.
        // Vitlök: 4 klyftor i de andra rätterna + 2 → 3 i soppan. Morot: 2 i laxen + 2 → 3 i soppan.
        varer: [
          { navn: 'vitlök', mengder: ['6 klyftor', '7 klyftor'] },
          { navn: 'morot', mengder: ['4 st', '5 st'] },
          { navn: 'dill', mengder: ['1 knippe', '1½ knippe'] },
          { navn: 'broccoli', mengder: ['1 st', '1 st'] },
        ],
        meny: ['Ändra portioner', 'Ta bort från inköpslistan'],
        ark: {
          // EKSEMPEL
          oppskrift: 'Kycklingsoppa med örter',
          antall: 'Antal portioner',
          oppdater: 'Uppdatera inköpslista',
        },
      },

      husstand: {
        tittel: 'Hushåll',
        tekst: 'Ett hushåll är de du lagar mat med: familjen, kompisgänget i stugan eller alla som firar midsommar ihop. Alla ser samma lista och vem som lade till vad.',
        velgAria: 'Välj hushåll',
        // Appens form. Ingen entallsform: alle eksempler har 4 av 6 (2 ledige), aldri 1 ledig.
        telling: '{n} av 6 · {ledige} platser lediga',
        listehode: 'Inköpslista',
        maltid: 'Middag',
      },
    },

    // ---------- Pris ----------
    pris: {
      tittel: 'Vad kostar det?',
      ingress: 'Appen är gratis. Pro är för dig som vill spara mer.',
      gratis: {
        tittel: 'Gratis',
        linje: '5 importer per månad.',
        punkter: ['Veckomeny och inköpslista', 'Ändra antal portioner', 'Laga maten steg för steg'],
        fot: 'Ingen tidsgräns.',
      },
      pro: {
        tittel: 'Pro',
        // Grensen fjernes; ikke lov «obegränsad».
        linje: 'Gränsen på fem importer tas bort.',
        punkter: ['Spara från bilder och kokböcker', 'Skriv om recept med Fråga Matlyst', 'Näringsvärde per portion', 'Dela med hushållet, upp till 6'],
        fot: 'Priset ser du i appen innan du köper.',
      },
      vernord: 'Vi har bättre saker för oss än att spåra dig. Smaklig måltid.',
      // Må være sann ordrett.
      vern: 'Matlyst spårar dig inte i reklamsyfte. Inga annonser och ingen försäljning av data.',
      vernlenke: 'Så hanterar vi data',
    },

    // ---------- Frågor och svar ----------
    svar: {
      tittel: 'Frågor och svar',
      sporsmal: [
        { q: 'Vad kostar Matlyst?', a: 'Appen är gratis, och du kan spara 5 recept från länkar varje månad utan att betala. Pro tar bort gränsen och låter dig spara från bilder. Priset ser du i appen innan du köper.' },
        { q: 'Varifrån kan jag spara recept?', a: 'Från Instagram, TikTok, YouTube och receptsidor som Köket.se. Tryck på delningsknappen i inlägget och välj Matlyst. Med Pro kan du också fotografera ett recept i en kokbok.' },
        { q: 'Kan jag flytta mina recept från Paprika?', a: 'Ja. Exportera recepten från Paprika och välj exportfilen i Matlyst.' },
        { q: 'Översätts recept på andra språk?', a: 'Ja. Ingredienser och instruktioner översätts till språket du använder i appen. Kontrollera alltid mängderna mot originalet.' },
        { q: 'Kan hela hushållet dela veckomenyn och inköpslistan?', a: 'Ja. Med Pro bjuder du in hushållet, upp till 6 personer. Det är gratis för dem du bjuder in.' },
        { q: 'Finns Matlyst för Android?', a: 'Ja. Matlyst finns för iPhone, iPad och Android.' },
      ],
    },

    // ---------- Eksempler (EKSEMPEL) ----------
    eksempler: {
      // Samme rekkefølge som spor.forslag.
      svar: [
        {
          endringer: [
            { byttet: { fra: 'kycklingfilé', til: 'kikärter' } },
            { byttet: { fra: 'smör', til: 'olivolja' } },
            { byttet: { fra: 'grädde', til: 'havregrädde' } },
          ],
          antall: 3,
          forklaring: 'Kycklingen är utbytt mot kikärter, och smöret och grädden mot växtbaserade alternativ. Resten av rätten är som förut.',
        },
        {
          endringer: [
            { byttet: { fra: 'basmatiris', til: 'blomkålsris' } },
            { fjernet: 'vetemjöl' },
          ],
          antall: 2,
          forklaring: 'Riset är utbytt mot blomkålsris, och såsen reds utan mjöl.',
        },
        {
          endringer: [
            { byttet: { fra: 'grädde', til: 'kokosmjölk' } },
            { omskrevet: 'Steg 4' },
          ],
          antall: 2,
          forklaring: 'Kokosmjölken ger samma fyllighet. Steg 4 är ändrat så att såsen inte skär sig.',
        },
        {
          endringer: [
            { byttet: { fra: 'schalottenlök', til: 'gul lök' } },
            { byttet: { fra: 'färsk timjan', til: 'torkad timjan' } },
          ],
          antall: 2,
          forklaring: 'Två ingredienser är utbytta mot sådant du har i skafferiet.',
        },
      ],

      husstander: [
        {
          merke: 'Familjen',
          navn: 'Hemma hos oss',
          folk: [1, 2, 3, 4],
          sist: 3,
          dager: [
            { dag: 'Torsdag 19 nov.', rett: 'Butter chicken', min: 50, eier: 'Oskar', ansikt: 2 },
            { dag: 'Fredag 20 nov.', rett: 'Tacos med pico de gallo', min: 30, eier: 'Elsa', ansikt: 3, ny: true },
          ],
        },
        {
          merke: 'Stughelgen',
          navn: 'Stughelgen',
          folk: [5, 6, 7, 8],
          sist: 8,
          listetittel: 'till helgen',
          varer: [
            { navn: 'tortillabröd', mengde: '2 paket', eier: 'Maja', ansikt: 5 },
            { navn: 'köttfärs', mengde: '800 g', eier: 'Viktor', ansikt: 6 },
            { navn: 'gräddfil', mengde: '3 dl', eier: 'Alva', ansikt: 7 },
            { navn: 'kakao', mengde: '1 paket', eier: 'Maja', ansikt: 5 },
            { navn: 'grillkorv', mengde: '2 paket', eier: 'Hugo', ansikt: 8, ny: true },
          ],
        },
        {
          merke: 'Midsommar',
          navn: 'Midsommarlunchen',
          folk: [9, 10, 11, 12],
          sist: 11,
          listetittel: 'till lunchen',
          varer: [
            { navn: 'inlagd sill', mengde: '2 burkar', eier: 'Ebba', ansikt: 9 },
            { navn: 'färskpotatis', mengde: '2 kg', eier: 'Amir', ansikt: 10 },
            { navn: 'knäckebröd', mengde: '1 paket', eier: 'Gustav', ansikt: 12 },
            { navn: 'gräslök', mengde: '1 knippe', eier: 'Amir', ansikt: 10 },
            { navn: 'jordgubbar', mengde: '2 liter', eier: 'Saga', ansikt: 11, ny: true },
          ],
        },
      ],
    },
  },

  // da: fra ~/matlyst-privat/seo-matlyst/2026-11-18/sprak/forside-da.mjs (skalltekstene bor i skall-tekst.mjs).
  // Dansk forside (matlyst-app.no/da/). Samme nøglestruktur som TEKST.nb i
  // matlyst-landing-forside/scripts/forside-tekst.mjs. Skrevet fra meningen, ikke fra den norske setningen.
  // Begrunnelser og kilder: forside-da-rapport.md i samme mappe.
  da: {
    folg: {
      aria: 'På denne side',
      lenker: [
        { mal: 'lagre', tekst: 'Gem' },
        { mal: 'spor', tekst: 'Spørg Matlyst' },
        { mal: 'middag', tekst: 'Lav maden' },
        { mal: 'pris', tekst: 'Pris' },
        { mal: 'svar', tekst: 'Spørgsmål' },
      ],
    },

    h1: 'Opskrifter, der ender på bordet.',
    ingress: 'En reel, en hjemmeside eller et foto af mormors opskriftskort. Matlyst laver det om til ingredienser og trin.',
    knapp: 'Hent gratis',
    vurdering: '5,0 ud af 5 i App Store',

    stegAria: 'Sådan gemmer du en opskrift fra Instagram',
    steg: [
      'Tryk på papirflyet',
      'Tryk på Del til…',
      'Vælg Matlyst',
      'Vælg en mappe, og tryk på Gem',
      'Matlyst henter opskriften',
      'Færdig. Ingredienser, trin og billede.',
    ],
    stegtider: [0, 2.5, 6.0, 9.7, 13.3, 16.5],
    filmAria: 'Film: et opslag fra Instagram gemmes i Matlyst og bliver til en opskrift med ingredienser, trin og billede',

    kildetittel: 'Gem opskrifter fra',
    kilderAria: 'Steder, du kan gemme fra',
    kilder: [
      { navn: 'Instagram', ikon: 'instagram' },
      { navn: 'TikTok', ikon: 'tiktok' },
      { navn: 'YouTube', ikon: 'youtube' },
      { navn: 'Facebook', ikon: 'facebook' },
      { navn: 'Hjemmesider', ikon: 'nettsider' },
      { navn: 'Madblogs', ikon: 'matblogger' },
      { navn: 'Dine fotos', ikon: 'bildegalleri' },
      { navn: 'Kogebøger', ikon: 'kokeboker' },
    ],

    kokebok: {
      tittel: 'Din egen kogebog',
      ingress: 'Alt, du gemmer, samles ét sted, med billede, ingredienser og trin.',
      retter: [
        { fil: 'butterchicken', tittel: 'Butter chicken', tid: '50 min' },
        { fil: 'laks', tittel: 'Ovnbagt laks med grøntsager', tid: '30 min' },
        { fil: 'focaccia', tittel: 'Focaccia med tomat og rosmarin', tid: '2 t 30 min' },
        { fil: 'ramen', tittel: 'Ramen med æg og majs', tid: '40 min' },
        { fil: 'kanelboller', tittel: 'Kanelsnegle', tid: '1 t 45 min' },
        { fil: 'taco', tittel: 'Tacos med bøf og pico de gallo', tid: '30 min' },
        { fil: 'tomatpasta', tittel: 'Cremet tomatpasta', tid: '25 min' },
        { fil: 'sjokoladekake', tittel: 'Chokoladelagkage', tid: '60 min' },
      ],
      kimerke: 'Billederne er lavet med AI.',
    },

    spor: {
      tittel: 'Spørg Matlyst',
      ingress: 'Skift en ingrediens ud, eller bed om en ny udgave af hele opskriften. Matlyst skriver den om, og du bestemmer, om den skal gemmes.',
      feltAria: 'Eksempel på, hvad du kan bede om',
      forslagAria: 'Flere eksempler',
      forslag: [
        'Gør den vegansk',
        'Gør den low carb',
        'Skift fløden ud',
        'Brug det, jeg har i spisekammeret',
      ],
      smaatt: 'Det er gratis at spørge om en opskrift. Det kræver Matlyst Pro at få den skrevet om.',

      kort: {
        aria: 'Eksempel fra appen: Spørg Matlyst har skrevet en cremet kyllingegryde om efter ønsket ved siden af og viser, hvilke ingredienser der er byttet ud, med valgene Overskriv og Lav en kopi.',
        spor: 'spørg',
        pro: 'PRO',
        oppskrift: 'Cremet kyllingegryde',
        endringer: 'Ændringer ({antall})',
        byttet: 'Byttede {fra} ud med {til}',
        fjernet: 'Fjernede {vare}',
        omskrevet: '{steg} omskrevet',
        overskriv: 'Overskriv',
        kopi: 'Lav en kopi',
        angre: 'Fortryd',
        ki: 'Matlyst bruger AI. Tjek altid opskriften.',
        endrer: 'Ændrer…',
      },
    },

    middag: {
      tittel: 'Fra opskrift til aftensmad',
      ingress: 'Når opskriften er gemt, kan du skalere den, købe ind til den og lave den trin for trin.',

      skaler: {
        tittel: 'Skalér',
        tekst: 'Fra 4 til 6 portioner, og alle mængder følger med.',
        aria: 'Fra appen: portionstælleren står på 4 og bliver sat op til 6. Hvedemel går fra 200 til 300 g, sukker fra 2 til 3 dl og kakao fra 4 til 6 spsk.',
        oppskrift: 'Chokoladelagkage',
        tid: '60 min',
        lager: '3 af 9 på lager',
        ingredienser: [
          { navn: 'hvedemel', mengder: ['200 g', '250 g', '300 g'] },
          { navn: 'sukker', mengder: ['2 dl', '2½ dl', '3 dl'] },
          { navn: 'kakao', mengder: ['4 spsk', '5 spsk', '6 spsk'] },
        ],
      },

      lag: {
        tittel: 'Lav maden',
        tekst: 'Trinnene bliver til en tjekliste. Står der en tid i et trin, trykker du på den og får en timer.',
        aria: 'Fra appen: i trin 2 bliver der trykket på tiden 10 minutter. En timer dukker op, bliver startet og tæller ned, og trinnet bliver krydset af.',
        steg: [
          { nr: 2, tekst: 'Varm bouillonen op, og pisk miso, sojasauce og sesamolie i. Lad den simre ved svag varme i 10 minutter.', tidsuttrykk: '10 minutter' },
          { nr: 3, tekst: 'Kog nudlerne efter anvisningen på pakken, og fordel dem i fire dybe skåle.' },
          { nr: 4, tekst: 'Hæld bouillonen over, og top med æg, majs, strimlede forårsløg og en skefuld chiliolie.' },
        ],
        timerTekst: 'Trin 2 · Varm bouillonen op, og pisk miso, sojasauce og sesamolie i. Lad den simre ved svag varme i 10 minutter.',
        avbryt: 'Annuller',
        start: 'Start',
      },

      ukemeny: {
        tittel: 'Madplan',
        tekst: 'Planlæg ugen. Åbner du kalenderen, ser du hele måneden, og en prik betyder, at dagen er planlagt.',
        aria: 'Fra appen: madplanen for 16. til 22. november. Ugelinjen åbner en kalender for hele november, hvor dagene med planlagte måltider har en prik, og dagen i dag har en ring.',
        uke: '16.-22. nov. 2026',
        maaned: 'november 2026',
        ukedager: ['man', 'tir', 'ons', 'tor', 'fre', 'lør', 'søn'],
        dager: [
          { dag: 'Torsdag 19. nov.', rett: 'Butter chicken', tid: '50 min' },
          { dag: 'Fredag 20. nov.', rett: 'Tacos med bøf og pico de gallo', tid: '30 min' },
        ],
        maltid: 'Aftensmad',
      },

      handle: {
        tittel: 'Indkøb',
        tekst: 'Bruger flere retter det samme, står det på én linje. Tryk og hold på en ret for at ændre portionerne, så følger mængderne med.',
        aria: 'Fra appen: indkøbslisten til fire retter. Hvidløg skal bruges i tre af dem og står på én linje. Der bliver trykket og holdt på kyllingesuppen, Rediger portioner bliver valgt, portionerne bliver sat op fra 4 til 6, og hvidløg, gulerødder og dild stiger med.',
        retter: ['Ovnbagt laks med grøntsager', 'Kyllingesuppe med krydderurter', 'Butter chicken', 'Tacos med bøf og pico de gallo'],
        hylle: 'FRUGT & GRØNT',
        varer: [
          { navn: 'hvidløg', mengder: ['6 fed', '7 fed'] },
          { navn: 'gulerødder', mengder: ['4 stk', '5 stk'] },
          { navn: 'dild', mengder: ['½ bundt', '¾ bundt'] },
          { navn: 'broccoli', mengder: ['1 stk', '1 stk'] },
        ],
        meny: ['Rediger portioner', 'Fjern fra indkøbslisten'],
        ark: {
          oppskrift: 'Kyllingesuppe med krydderurter',
          antall: 'Antal portioner',
          oppdater: 'Opdater indkøbsliste',
        },
      },

      husstand: {
        tittel: 'Husstand',
        tekst: 'En husstand er dem, du laver mad sammen med: familien, vennerne i sommerhuset eller alle, der skal med til julefrokosten. Alle ser den samme liste og kan følge med i, hvem der har tilføjet hvad.',
        velgAria: 'Vælg husstand',
        telling: '{n} af 6 · {ledige} ledige pladser',
        listehode: 'Indkøbsliste',
        maltid: 'Aftensmad',
      },
    },

    pris: {
      tittel: 'Hvad koster det?',
      ingress: 'Appen er gratis. Pro er til dig, der vil gemme mere.',
      gratis: {
        tittel: 'Gratis',
        linje: '5 importer om måneden.',
        punkter: ['Madplan og indkøbsliste', 'Skalér portioner', 'Lav maden trin for trin'],
        fot: 'Ingen tidsbegrænsning.',
      },
      pro: {
        tittel: 'Pro',
        linje: 'Uden loftet på fem importer.',
        punkter: ['Gem fra fotos og kogebøger', 'Skriv opskrifter om med Spørg Matlyst', 'Næringsindhold pr. portion', 'Del med husstanden, op til 6'],
        fot: 'Prisen ser du i appen, før du køber.',
      },
      vernord: 'Vi har bedre ting at lave end at holde øje med dig. Nyd maden.',
      vern: 'Matlyst sporer dig ikke til reklameformål. Ingen annoncer, og vi sælger ikke data.',
      vernlenke: 'Sådan behandler vi data',
    },

    svar: {
      tittel: 'Spørgsmål og svar',
      sporsmal: [
        { q: 'Hvad koster Matlyst?', a: 'Appen er gratis, og du kan gemme 5 opskrifter fra links om måneden uden at betale. Pro fjerner loftet, lader dig gemme fra fotos og skriver opskrifter om for dig. Prisen ser du i appen, før du køber.' },
        { q: 'Hvor kan jeg gemme opskrifter fra?', a: 'Fra Instagram, TikTok, YouTube og hjemmesider som DR Mad. Tryk på Del i opslaget, og vælg Matlyst. Med Pro kan du også tage et foto af en opskrift i en kogebog.' },
        { q: 'Kan jeg flytte mine opskrifter fra Paprika?', a: 'Ja. Eksportér opskrifterne fra Paprika, og vælg eksportfilen i Matlyst.' },
        { q: 'Bliver opskrifter på andre sprog oversat?', a: 'Ja. Ingredienser og fremgangsmåde bliver oversat til det sprog, du bruger i appen. Tjek altid mængderne mod originalen.' },
        { q: 'Kan vi dele madplan og indkøbsliste?', a: 'Ja. Med Pro inviterer du husstanden, op til 6 personer. Det er gratis at blive medlem.' },
        { q: 'Findes Matlyst til Android?', a: 'Ja. Matlyst findes til iPhone, iPad og Android.' },
      ],
    },

    eksempler: {
      svar: [
        {
          endringer: [
            { byttet: { fra: 'kyllingebryst', til: 'kikærter' } },
            { byttet: { fra: 'smør', til: 'olivenolie' } },
            { byttet: { fra: 'piskefløde', til: 'havrefløde' } },
          ],
          antall: 3,
          forklaring: 'Kyllingen er byttet ud med kikærter, og smør og fløde med plantebaserede alternativer. Resten af retten er uændret.',
        },
        {
          endringer: [
            { byttet: { fra: 'basmatiris', til: 'blomkålsris' } },
            { fjernet: 'hvedemel' },
          ],
          antall: 2,
          forklaring: 'Risen er byttet ud med blomkålsris, og saucen bliver jævnet uden mel.',
        },
        {
          endringer: [
            { byttet: { fra: 'piskefløde', til: 'kokosmælk' } },
            { omskrevet: 'Trin 4' },
          ],
          antall: 2,
          forklaring: 'Kokosmælk giver den samme fylde. Trin 4 er justeret, så saucen ikke skiller.',
        },
        {
          endringer: [
            { byttet: { fra: 'skalotteløg', til: 'løg' } },
            { byttet: { fra: 'frisk timian', til: 'tørret timian' } },
          ],
          antall: 2,
          forklaring: 'To ingredienser er byttet ud med det, du har i spisekammeret.',
        },
      ],

      husstander: [
        {
          merke: 'Familien',
          navn: 'Hjemme hos os',
          folk: [1, 2, 3, 4],
          sist: 3,
          dager: [
            { dag: 'Torsdag 19. nov.', rett: 'Butter chicken', min: 50, eier: 'Mads', ansikt: 2 },
            { dag: 'Fredag 20. nov.', rett: 'Tacos med bøf og pico de gallo', min: 30, eier: 'Ida', ansikt: 3, ny: true },
          ],
        },
        {
          merke: 'Sommerhuset',
          navn: 'Sommerhuset',
          folk: [5, 6, 7, 8],
          sist: 8,
          listetittel: 'til weekenden',
          varer: [
            { navn: 'tortillas', mengde: '2 pakker', eier: 'Freja', ansikt: 5 },
            { navn: 'hakket oksekød', mengde: '800 g', eier: 'Oliver', ansikt: 6 },
            { navn: 'creme fraiche', mengde: '3 dl', eier: 'Clara', ansikt: 7 },
            { navn: 'pålægschokolade', mengde: '1 pakke', eier: 'Freja', ansikt: 5 },
            { navn: 'grillpølser', mengde: '2 pakker', eier: 'Magnus', ansikt: 8, ny: true },
          ],
        },
        {
          merke: 'Julefrokost',
          navn: 'Julefrokosten',
          folk: [9, 10, 11, 12],
          sist: 11,
          listetittel: 'til julefrokosten',
          varer: [
            { navn: 'marinerede sild', mengde: '2 glas', eier: 'Line', ansikt: 9 },
            { navn: 'æg', mengde: '12 stk', eier: 'Amir', ansikt: 10 },
            { navn: 'rugbrød', mengde: '2 stk', eier: 'Henrik', ansikt: 12 },
            { navn: 'karse', mengde: '1 bakke', eier: 'Amir', ansikt: 10 },
            { navn: 'kirsebærsauce', mengde: '1 flaske', eier: 'Sofie', ansikt: 11, ny: true },
          ],
        },
      ],
    },
  },

  // en: fra ~/matlyst-privat/seo-matlyst/2026-11-18/sprak/forside-en.mjs (skalltekstene bor i skall-tekst.mjs).
  // US English (en-US) for the front page at /en/. Same key structure as TEKST.nb in
  // scripts/forside-tekst.mjs. Written from the meaning of each string, not line by line.
  // Placeholders are kept verbatim. Example content (EKSEMPELSTIER) is rewritten for the US.
  en: {
    folg: {
      aria: 'On this page',
      lenker: [
        { mal: 'lagre', tekst: 'Save' },
        { mal: 'spor', tekst: 'Ask Matlyst' },
        { mal: 'middag', tekst: 'Cook' },
        { mal: 'pris', tekst: 'Pricing' },
        { mal: 'svar', tekst: 'FAQ' },
      ],
    },

    h1: 'Recipes you’ll actually make.',
    ingress: 'Save a recipe from a reel, a website, or a photo of Grandma’s recipe card. Matlyst turns it into ingredients and steps.',
    knapp: 'Get it free',
    vurdering: '5.0 out of 5 on the App Store',

    stegAria: 'How to save a recipe from Instagram',
    steg: [
      'Tap the paper airplane',
      'Tap Share to…',
      'Choose Matlyst',
      'Pick a folder and tap Save',
      'Matlyst reads the caption',
      'Done. Ingredients, steps, and a photo.',
    ],
    stegtider: [0, 2.5, 6.0, 9.7, 13.3, 16.5],
    filmAria: 'Video: a recipe is shared from Instagram to Matlyst and becomes ingredients, steps, and a photo',

    kildetittel: 'Save recipes from',
    kilderAria: 'Places you can save recipes from',
    kilder: [
      { navn: 'Instagram', ikon: 'instagram' },
      { navn: 'TikTok', ikon: 'tiktok' },
      { navn: 'YouTube', ikon: 'youtube' },
      { navn: 'Facebook', ikon: 'facebook' },
      { navn: 'Websites', ikon: 'nettsider' },
      { navn: 'Food blogs', ikon: 'matblogger' },
      { navn: 'Photos', ikon: 'bildegalleri' },
      { navn: 'Cookbooks', ikon: 'kokeboker' },
    ],

    kokebok: {
      tittel: 'Your own cookbook',
      ingress: 'Everything you save lands in one place, with the photo, ingredients, and steps.',
      // EXAMPLE
      retter: [
        { fil: 'butterchicken', tittel: 'Butter Chicken', tid: '50 min' },
        { fil: 'laks', tittel: 'Sheet-Pan Salmon and Veggies', tid: '30 min' },
        { fil: 'focaccia', tittel: 'Tomato and Rosemary Focaccia', tid: '2 hr 30 min' },
        { fil: 'ramen', tittel: 'Miso Ramen with Egg and Corn', tid: '40 min' },
        { fil: 'kanelboller', tittel: 'Cinnamon Buns', tid: '1 hr 45 min' },
        { fil: 'taco', tittel: 'Steak Tacos with Pico de Gallo', tid: '30 min' },
        { fil: 'tomatpasta', tittel: 'Creamy Tomato Pasta', tid: '25 min' },
        { fil: 'sjokoladekake', tittel: 'Fudgy Chocolate Cake', tid: '1 hr' },
      ],
      kimerke: 'These photos were made with AI.',
    },

    spor: {
      tittel: 'Ask Matlyst',
      ingress: 'Swap out an ingredient, or ask for a whole new take on the recipe. Matlyst rewrites it, and you decide whether to keep it.',
      feltAria: 'Example of what you can ask for',
      forslagAria: 'More examples',
      forslag: [
        'Make this vegan',
        'Give me a low-carb version',
        'Swap out the cream',
        'Use what I have',
      ],
      smaatt: 'Asking about a recipe is free. Rewriting one takes Matlyst Pro.',

      kort: {
        aria: 'Example from the app: Ask Matlyst has rewritten a creamy chicken and rice dish based on the request next to it. It shows which ingredients were swapped, with the options Replace and Save a copy.',
        spor: 'ask',
        pro: 'PRO',
        // EXAMPLE
        oppskrift: 'Creamy Chicken and Rice',
        endringer: 'Changes ({antall})',
        byttet: 'Swapped {fra} for {til}',
        fjernet: 'Removed {vare}',
        omskrevet: 'Rewrote {steg}',
        overskriv: 'Replace',
        kopi: 'Save a copy',
        angre: 'Undo',
        ki: 'Matlyst uses AI. Always check the recipe.',
        endrer: 'Making changes…',
      },
    },

    middag: {
      tittel: 'From saved to served',
      ingress: 'Once a recipe is saved, you can scale it, shop for it, and cook it step by step.',

      skaler: {
        tittel: 'Scale',
        tekst: 'Go from 4 to 6 servings, and every amount adjusts.',
        aria: 'From the app: the servings counter is at 4 and goes up to 6. Flour goes from 2 to 3 cups, sugar from 1 to 1½ cups, and eggs from 4 to 6.',
        // EXAMPLE
        oppskrift: 'Fudgy Chocolate Cake',
        // EXAMPLE
        tid: '1 hr',
        // EXAMPLE
        lager: '3 of 9 in your pantry',
        // EXAMPLE: amounts at 4, 5, and 6 servings
        ingredienser: [
          { navn: 'flour', mengder: ['2 cups', '2½ cups', '3 cups'] },
          { navn: 'sugar', mengder: ['1 cup', '1¼ cups', '1½ cups'] },
          { navn: 'eggs', mengder: ['4', '5', '6'] },
        ],
      },

      lag: {
        tittel: 'Cook',
        tekst: 'Your steps become a checklist. If a step has a time in it, tap the time to start a timer.',
        aria: 'From the app: in step 2, the time 10 minutes is tapped. A timer appears, starts counting down, and the step gets checked off.',
        // EXAMPLE
        steg: [
          { nr: 2, tekst: 'Heat the broth and whisk in the miso, soy sauce, and sesame oil. Let it simmer over low heat for 10 minutes.', tidsuttrykk: '10 minutes' },
          { nr: 3, tekst: 'Cook the noodles according to the package directions and divide them among four bowls.' },
          { nr: 4, tekst: 'Ladle the broth over the noodles and top with the eggs, corn, sliced scallions, and a spoonful of chili oil.' },
        ],
        // EXAMPLE: repeats step 2 word for word
        timerTekst: 'Step 2 · Heat the broth and whisk in the miso, soy sauce, and sesame oil. Let it simmer over low heat for 10 minutes.',
        avbryt: 'Cancel',
        start: 'Start',
      },

      ukemeny: {
        tittel: 'Meal Plan',
        tekst: 'Plan your week. Open the calendar to see the whole month, where a dot marks each day you’ve planned.',
        aria: 'From the app: the meal plan for November 16–22. The week row opens into a calendar for all of November, where days with planned meals have a dot and today has a ring.',
        // EXAMPLE
        uke: 'Nov 16–22, 2026',
        // EXAMPLE
        maaned: 'November 2026',
        // Monday first, to match the calendar grid the generator draws.
        ukedager: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        // EXAMPLE
        dager: [
          { dag: 'Thursday, Nov 19', rett: 'Butter Chicken', tid: '50 min' },
          { dag: 'Friday, Nov 20', rett: 'Steak Tacos with Pico de Gallo', tid: '30 min' },
        ],
        maltid: 'Dinner',
      },

      handle: {
        tittel: 'Grocery List',
        tekst: 'When two recipes need the same thing, it goes on one line. Touch and hold a recipe to change its servings, and the amounts update to match.',
        aria: 'From the app: the grocery list for four recipes. Garlic is in three of them and shows up as one line. Touching and holding Chicken Noodle Soup opens a menu; choosing Change servings and raising the servings from 4 to 6 increases the soup’s share of garlic, carrots, and parsley.',
        // EXAMPLE
        retter: ['Sheet-Pan Salmon and Veggies', 'Chicken Noodle Soup', 'Butter Chicken', 'Steak Tacos with Pico de Gallo'],
        hylle: 'PRODUCE',
        // EXAMPLE: amounts with the soup at 4 and at 6 servings
        varer: [
          { navn: 'garlic', mengder: ['6 cloves', '7 cloves'] },
          { navn: 'carrots', mengder: ['4', '5'] },
          { navn: 'parsley', mengder: ['½ bunch', '¾ bunch'] },
          { navn: 'broccoli', mengder: ['1 head', '1 head'] },
        ],
        meny: ['Change servings', 'Remove from grocery list'],
        ark: {
          // EXAMPLE
          oppskrift: 'Chicken Noodle Soup',
          antall: 'Servings',
          oppdater: 'Update grocery list',
        },
      },

      husstand: {
        tittel: 'Household',
        tekst: 'A household is the people you cook with: your family, your friends on a cabin weekend, or everyone coming to Friendsgiving. Everyone sees the same list, including who added what.',
        velgAria: 'Choose a household',
        telling: '{n} of 6 · {ledige} spots open',
        listehode: 'Grocery List',
        maltid: 'Dinner',
      },
    },

    pris: {
      tittel: 'What does it cost?',
      ingress: 'The app is free. Go Pro when you want to save more.',
      gratis: {
        tittel: 'Free',
        linje: '5 imports a month.',
        punkter: ['Meal plan and grocery list', 'Scale servings', 'Cook step by step'],
        fot: 'It stays free.',
      },
      pro: {
        tittel: 'Pro',
        linje: 'No five-import limit.',
        punkter: ['Save from photos and cookbooks', 'Rewrite recipes with Ask Matlyst', 'Nutrition per serving', 'Share with your household (up to 6)'],
        fot: 'You’ll see the price in the app before you buy.',
      },
      vernord: 'We’ve got better things to do than track you. Go enjoy your dinner.',
      vern: 'Matlyst doesn’t track you for ads. No ads, no selling your data.',
      vernlenke: 'How we handle your data',
    },

    svar: {
      tittel: 'Questions and answers',
      sporsmal: [
        { q: 'How much does Matlyst cost?', a: 'The app is free, and you can save 5 recipes from links every month without paying. Pro removes that limit and lets you save from photos too. You’ll see the price in the app before you buy.' },
        { q: 'Where can I save recipes from?', a: 'Instagram, TikTok, YouTube, recipe websites, and food blogs. Tap Share on the post or page and choose Matlyst. The recipe needs to be written out in the post, the video description, or on the page. With Pro, you can also snap a photo of a recipe in a cookbook.' },
        { q: 'Can I move my recipes over from Paprika?', a: 'Yes. Export your recipes from Paprika, then choose the export file in Matlyst.' },
        { q: 'Are recipes in other languages translated?', a: 'Yes. The ingredients and steps are translated into the language you use in the app. Always check the amounts against the original.' },
        { q: 'Can my household share the meal plan and grocery list?', a: 'Yes. With Pro, you can invite your household, up to 6 people. It’s free for the people you invite.' },
        { q: 'Is there an Android version?', a: 'Yes. Matlyst is available for iPhone, iPad, and Android.' },
      ],
    },

    // EXAMPLE
    eksempler: {
      svar: [
        {
          endringer: [
            { byttet: { fra: 'chicken breasts', til: 'chickpeas' } },
            { byttet: { fra: 'butter', til: 'olive oil' } },
            { byttet: { fra: 'heavy cream', til: 'cashew cream' } },
          ],
          antall: 3,
          forklaring: 'Chickpeas stand in for the chicken, and the butter and cream are now plant-based. The rest of the dish is unchanged.',
        },
        {
          endringer: [
            { byttet: { fra: 'basmati rice', til: 'cauliflower rice' } },
            { fjernet: 'flour' },
          ],
          antall: 2,
          forklaring: 'Cauliflower rice replaces the rice, and the sauce thickens without flour.',
        },
        {
          endringer: [
            { byttet: { fra: 'heavy cream', til: 'coconut milk' } },
            { omskrevet: 'step 4' },
          ],
          antall: 2,
          forklaring: 'Coconut milk keeps it just as rich. Step 4 is adjusted so the sauce won’t curdle.',
        },
        {
          endringer: [
            { byttet: { fra: 'shallots', til: 'yellow onion' } },
            { byttet: { fra: 'fresh thyme', til: 'dried thyme' } },
          ],
          antall: 2,
          forklaring: 'Two ingredients are swapped for what’s already in your pantry.',
        },
      ],

      husstander: [
        {
          merke: 'Family',
          navn: 'Our house',
          folk: [1, 2, 3, 4],
          sist: 3,
          dager: [
            { dag: 'Thursday, Nov 19', rett: 'Butter Chicken', min: 50, eier: 'Jake', ansikt: 2 },
            { dag: 'Friday, Nov 20', rett: 'Steak Tacos with Pico de Gallo', min: 30, eier: 'Emma', ansikt: 3, ny: true },
          ],
        },
        {
          merke: 'Cabin trip',
          navn: 'Cabin trip',
          folk: [5, 6, 7, 8],
          sist: 8,
          listetittel: 'for the weekend',
          varer: [
            { navn: 'ground beef', mengde: '2 lb', eier: 'Mia', ansikt: 5 },
            { navn: 'hamburger buns', mengde: '2 packs', eier: 'Tyler', ansikt: 6 },
            { navn: 'cheddar slices', mengde: '1 pack', eier: 'Nora', ansikt: 7 },
            { navn: 'marshmallows', mengde: '1 bag', eier: 'Mia', ansikt: 5 },
            { navn: 'hot dogs', mengde: '2 packs', eier: 'Ethan', ansikt: 8, ny: true },
          ],
        },
        {
          merke: 'Friendsgiving',
          navn: 'Friendsgiving',
          folk: [9, 10, 11, 12],
          sist: 11,
          listetittel: 'for the big dinner',
          varer: [
            { navn: 'turkey breast', mengde: '3 lb', eier: 'Linda', ansikt: 9 },
            { navn: 'russet potatoes', mengde: '5 lb', eier: 'Amir', ansikt: 10 },
            { navn: 'dinner rolls', mengde: '12', eier: 'Tom', ansikt: 12 },
            { navn: 'fresh cranberries', mengde: '12 oz', eier: 'Amir', ansikt: 10 },
            { navn: 'whipped cream', mengde: '1 can', eier: 'Sophie', ansikt: 11, ny: true },
          ],
        },
      ],
    },
  },
};

// De private språkfilene (sprak/forside-<språk>.mjs) ble skrevet mot en eldre nb. Fire slags nøkler ble lagt til
// i nb etter det, og de er enten språkløse (tall, filnavn, prikker) eller bygget av språkets egne tekster.
// De legges inn her, slik at tekstene fra de private filene står uendret over.
const SVARARIA = {
  sv: 'Exempel från appen: {oppskrift}. {forklaring} Med valen Skriv över och Skapa en kopia.',
  da: 'Eksempel fra appen: {oppskrift}. {forklaring} Med valgene Overskriv og Lav en kopi.',
  en: 'Example from the app: {oppskrift}. {forklaring} With the options Replace and Save a copy.',
};
for (const sprak of Object.keys(SVARARIA)) {
  const t = TEKST[sprak], nb = TEKST.nb;
  t.spor.kort.svarAria = SVARARIA[sprak];
  t.spor.kort.merkeStart = nb.spor.kort.merkeStart;
  t.spor.kort.merkeSlutt = nb.spor.kort.merkeSlutt;
  t.middag.demo = structuredClone(nb.middag.demo);
  t.middag.lag.tider = structuredClone(nb.middag.lag.tider);
  t.middag.lag.skala = structuredClone(nb.middag.lag.skala);
  t.middag.ukemeny.kalender = structuredClone(nb.middag.ukemeny.kalender);
  // Rettene i uke og husstand er de samme som på norsk, med bilde og tid per rett.
  t.middag.ukemeny.dager.forEach((dag, i) => { dag.fil = nb.middag.ukemeny.dager[i].fil; });
  t.middag.handle.varer.forEach((vare, i) => { vare.prikker = [...nb.middag.handle.varer[i].prikker]; });
  t.eksempler.husstander[0].dager.forEach((dag, i) => {
    dag.fil = nb.eksempler.husstander[0].dager[i].fil;
    dag.tid = t.middag.ukemeny.dager[i].tid;
  });
}

// All synlig tekst på forsiden, ett språk per gren under TEKST.
// Generatoren bygger siden av denne modulen. Oversettere jobber fra MENINGEN:
// kommentaren over hver gruppe sier hvor teksten står og hva den gjør.
// Hyllenavn og hyllelenker i menyen bor i scripts/hyller.mjs, ikke her.
//
// PLASSHOLDERE: {klammer} i en tekst fylles inn av generatoren med fyll() under.
// Oversettere beholder plassholderne ordrett, men kan flytte dem i setningen.
// Disse tekstene tar plassholdere, og ingen andre:
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
    topp: {
      // Logoen øverst til venstre. Skjermleserlabel for lenken til forsiden.
      merkeAria: 'Matlyst, til forsiden',
      // Knappen som åpner hovedmenyen på små skjermer og ved siden av nedlastingsknappen.
      meny: 'Meny',
      menyAria: 'Meny',
      // Navnet på selve menypanelet, for skjermlesere.
      panelAria: 'Hovedmeny',
      // Den lille knappen øverst til høyre. Åpner nedlasting.
      lastNed: 'Last ned',
    },

    // Lenkene i toppfeltet som følger deg nedover siden. Hver lenke hopper til en seksjon.
    // `mal` er seksjonens anker, `tekst` er det som vises.
    folg: {
      aria: 'På denne siden',
      lenker: [
        { mal: 'lagre', tekst: 'Lagre' },
        { mal: 'spor', tekst: 'Spør Matlyst' },
        { mal: 'middag', tekst: 'Lag maten' },
        { mal: 'pris', tekst: 'Pris' },
        { mal: 'svar', tekst: 'Spørsmål' },
      ],
    },

    // Språkvelgeren, i menyen og i bunnen. Språkene står alltid på sitt eget språk.
    sprak: {
      aria: 'Språk',
      valg: [
        { kode: 'nb', navn: 'Norsk' },
        { kode: 'sv', navn: 'Svenska' },
        { kode: 'da', navn: 'Dansk' },
        { kode: 'en', navn: 'English' },
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
        aria: 'Eksempel fra appen: Spør Matlyst har skrevet om en kremet kyllinggryte etter ønsket ved siden av, og viser hvilke ingredienser som er byttet, med valgene Overskriv og Lag en kopi.',
        // Toppen av kortet: ordet «spør» foran ordmerket «matlyst», og Pro-merket.
        spor: 'spør',
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
        ukedager: ['man', 'tir', 'ons', 'tor', 'fre', 'lør', 'søn'],
        // To planlagte dager under kalenderen. Rettene er de samme som i kokeboken.
        // EKSEMPEL
        dager: [
          { dag: 'Torsdag 19. nov.', rett: 'Butter chicken', tid: '50 min' },
          { dag: 'Fredag 20. nov.', rett: 'Biff-taco med pico de gallo', tid: '30 min' },
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
        // Varene. `mengder` er mengden ved 4 og 6 porsjoner av kyllingsuppa.
        // EKSEMPEL
        varer: [
          { navn: 'hvitløk', mengder: ['6 fedd', '7 fedd'] },
          { navn: 'gulrot', mengder: ['4 stk', '5 stk'] },
          { navn: 'dill', mengder: ['0,5 bunt', '0,75 bunt'] },
          { navn: 'brokkoli', mengder: ['1 stk', '1 stk'] },
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
        punkter: ['Lagre fra bilder og kokebøker', 'Spør Matlyst', 'Næringsinnhold per porsjon', 'Del med husstanden, opptil 6'],
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

    // ---------- Bunnen av siden ----------
    // Siste oppfordring rett over bunnmenyen, ved siden av nedlastingsknappen.
    bunnlinje: 'Den oppskriften du lagret? Lag den i kveld.',
    // Skjermlesernavn på bunnseksjonen og på menyen i den.
    bunn: {
      aria: 'Alt på Matlyst',
      menyAria: 'Bunnmeny',
    },
    // Fotlinjen nederst. Gruppa heter Juridisk og samler personvern, vilkår og informasjonskapsler.
    under: {
      vilkarAria: 'Juridisk',
      lenker: ['Personvern', 'Vilkår', 'Informasjonskapsler'],
      // Opphavslinje nederst. Flaggbildet vises rett etter teksten, med et mellomrom
      // mellom (mellomrommet ligger i siden, ikke i strengen). Oversettes som en vanlig setning.
      laget: '© 2026 Matlyst. Laget i Norge',
      // Skjermlesertekst for flaggbildet etter opphavslinjen.
      flaggAlt: 'Norsk flagg',
      epost: 'hei@matlyst-app.no',
    },
    // Den faste knappen som glir inn nederst på skjermen når man har rullet forbi
    // den første knappen og ennå ikke nådd den siste.
    fast: {
      knapp: 'Last ned gratis',
    },

    // QR-vinduet som åpnes når man trykker på en nedlastingsknapp på stor skjerm.
    // På mobil går knappene rett til butikken.
    hent: {
      // Skjermlesertekst for krysset øverst i vinduet som lukker det.
      lukkAria: 'Lukk',
      // Skjermlesertekst for QR-koden (et bilde). Koden peker til nedlastingssiden.
      qrAlt: 'QR-kode til matlyst-app.no/app',
      // Overskriften i vinduet, rett under QR-koden. Oppfordrer til å skanne koden med telefonkameraet.
      tittel: 'Skann med telefonen',
      // Forklaringen rett under overskriften, i én eller to korte linjer: hva som skjer når man skanner.
      ingress: 'Kameraet tar deg til riktig butikk, enten du har iPhone eller Android.',
      // Navnene på de to knappene nederst i vinduet, som fører til hver sin butikk. Egennavn, oversettes ikke.
      butikker: ['App Store', 'Google Play'],
    },

    // ---------- Eksempler ----------
    // Håndskrevne eksempler som vises i appmockupene. De skal byttes ut med ekte
    // utdata fra appen senere. Oversett dem som levende eksempler, ikke ord for ord:
    // rettene og navnene skal virke naturlige for målgruppen.
    // Flere eksempler står i selve seksjonene; alle stiene er samlet i EKSEMPELSTIER.
    // EKSEMPEL
    eksempler: {
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
            { dag: 'Torsdag 19. nov.', rett: 'Butter chicken', min: 50, eier: 'Jonas', ansikt: 2 },
            { dag: 'Fredag 20. nov.', rett: 'Biff-taco med pico de gallo', min: 30, eier: 'Emma', ansikt: 3, ny: true },
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
};

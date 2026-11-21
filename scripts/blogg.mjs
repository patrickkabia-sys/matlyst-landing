// Bloggen: SoMe-karusellene som artikler. Innholdet er karusellens egen tekst
// (blogg-kilde/karuseller.json, hentet med eksporter-karuseller.mjs): tabellene blir
// ekte HTML-tabeller, lysbildene vises som bilder, og sluttsiden blir app-CTA-en.
// Ingen fyllprosa: artikkelen sier det karusellen sier, verken mer eller mindre.
// Her står bare det som ikke finnes i karusellen: adresse, sidetittel og CTA-bilde.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { appCta } from './app-cta.mjs';
import { FORFATTERLINJE, forfatterPerson, harForfatter } from './forfatter.mjs';

const base = 'https://matlyst-app.no';
export const PUBLISERT = '2026-10-28';

export const BLOGGROT = { nb: '/blogg/', sv: '/sv/blogg/', da: '/da/blog/', en: '/en/blog/' };
const SPRAKKODE = { nb: 'nb-NO', sv: 'sv-SE', da: 'da-DK', en: 'en-US' };
const REPO_ROT = new URL('../', import.meta.url);
const AUTO_CTA_BILDE = {
  import: '01-import',
  ukemeny: '02-ukemeny',
  handleliste: '03-handleliste',
  'bruk-det-jeg-har': '02-ukemeny',
  kokemodus: '05-kokemodus',
};

// tema → språk → [slug, sidetittel]. Sidetittelen er skrevet for søket, ikke for karusellen.
export const BLOGGTEMAER = {
  koketid: {
    nb: ['koketider', 'Koketid for poteter, egg og ris', 'Poteter koker i 15 til 25 minutter, smilende egg i 7 til 8, sier MatPrat. Her er koketidene for egg, poteter og ris, og hvor lenge poteter står i ovnen.'],
    en: ['boiling-times', 'How long to boil eggs, potatoes, and vegetables', 'Large eggs need 12 minutes in the hot water after you turn off the heat. Whole medium potatoes take 30 to 40 minutes. Times for eggs and vegetables.'],
  },
  kjernetemp: {
    nb: ['kjernetemperatur', 'Kjernetemperatur for lam, storfe, svin og kylling', 'Lam er medium ved 60 til 65 grader og gjennomstekt ved 75, sier MatPrat. Her er kjernetemperaturene for lam, storfe, svin, kylling og fisk.'],
    sv: ['innertemperatur', 'Innertemperatur för kött, kyckling och fisk'],
    da: ['kernetemperatur', 'Kernetemperatur for lam, oksekød, svin og kylling', 'Lam er medium ved 60 til 65 grader og gennemstegt ved 75, siger MatPrat. Her er kernetemperaturerne for lam, oksekød, svin, kylling og fisk.'],
    en: ['safe-internal-temperatures', 'Safe internal temperatures for meat, chicken, and fish'],
  },
  egg: {
    nb: ['erstatte-egg', 'Erstatte egg i baking: dette kan du bruke i stedet'],
    sv: ['ersatta-agg', 'Ersätta ägg i bakning: det här kan du använda i stället'],
    da: ['erstat-aeg', 'Erstat æg i bagning: det her kan du bruge i stedet'],
  },
  rester: {
    nb: ['rester-i-kjoleskapet', 'Hvor lenge holder rester i kjøleskapet?'],
    sv: ['rester-i-kylen', 'Hur länge håller rester i kylen?'],
    da: ['rester-i-koeleskabet', 'Hvor længe holder rester i køleskabet?'],
    en: ['leftovers-in-the-fridge', 'How long do leftovers last in the fridge?'],
  },
  fryser: {
    nb: ['mat-i-fryseren', 'Hvor lenge kan mat ligge i fryseren?'],
    sv: ['mat-i-frysen', 'Hur länge håller nötkött och annan mat i frysen?', 'Kan man frysa mat? Det mesta går bra. Köttfärs håller fyra månader i frysen, nötkött 10 till 12. Tider för kött, fisk, bakverk och rester.'],
    da: ['mad-i-fryseren', 'Kan man fryse mad? Så længe holder det i fryseren', 'Kan man fryse mad? Det meste går fint. Hakket kød holder fire måneder i fryseren, oksekød 10 til 12. Tider for kød, fisk, bagværk og rester.'],
    en: ['freezer-storage-times', 'How long can you freeze meat, fish, and leftovers?'],
  },
  airfryer: {
    nb: ['ovnsoppskrift-i-airfryer', 'Ovnsoppskrift i airfryer: slik regner du om tid og temperatur'],
    sv: ['ugnsrecept-i-airfryer', 'Ugnsrecept i airfryer: så räknar du om tid och temperatur'],
    da: ['ovnopskrift-i-airfryer', 'Ovnopskrift i airfryer: sådan omregner du tid og temperatur'],
    en: ['oven-to-air-fryer', 'How to convert an oven recipe to an air fryer'],
  },
  doble: {
    nb: ['doble-oppskrift', 'Doble en oppskrift: dette må du passe på'],
    sv: ['dubbla-recept', 'Dubbla ett recept: det här ska du se upp med'],
    da: ['fordoble-opskrift', 'Fordoble en opskrift: det her skal du passe på'],
    en: ['double-a-recipe', 'How to double or halve a recipe'],
  },
  eggtest: {
    nb: ['er-egget-ferskt', 'Er egget ferskt? Slik tester du med et glass vann'],
    sv: ['ar-agget-farskt', 'Är ägget färskt? Så testar du med ett glas vatten'],
    da: ['er-aegget-friskt', 'Er ægget friskt? Sådan tester du med et glas vand'],
    en: ['egg-float-test', 'How to tell if eggs are fresh: the float test'],
  },
};

// Kildene til tallene i karusellartiklene om mattrygghet, i samme form som /julemiddag/: adresse, dato på kilden,
// hentedato og hvert tall vi bruker. Mattilsynet først, MatPrat etter med årstall. Tall uten kilde står ikke i artikkelen.
// Ligger her og ikke i karuseller.json, fordi eksporter-karuseller.mjs skriver den fila på nytt fra marketing-mappa.
export const KILDER_HENTET = '2026-11-21';
const KILDE = {
  'mt-oppbevaring': { navn: 'Mattilsynet: Råd for oppbevaring av mat og drikke', url: 'https://www.mattilsynet.no/mat-og-drikke/forbrukere/rad-for-oppbevaring-av-mat', dato: '2026-02-20' },
  'mt-ris': { navn: 'Mattilsynet: Kokt ris og pasta som står fremme, kan lage giftstoffer', url: 'https://www.mattilsynet.no/mat-og-drikke/forbrukere/kokt-ris-og-pasta-som-star-fremme-kan-lage-giftstoffer', dato: '2023-08-14' },
  'mt-kjokken': { navn: 'Mattilsynet: Kjøkkenhygiene', url: 'https://www.mattilsynet.no/mat-og-drikke/forbrukere/kjokkenhygiene', dato: '2023-10-27' },
  'mp-ris': { navn: 'MatPrat: Er det farlig å spise rester av ris og pasta?', url: 'https://www.matprat.no/artikler/oppbevaring-og-holdbarhet/hvordan-oppbevare-rester-av-ris-og-pasta/', dato: '2022-02-24' },
  'mp-fryser': { navn: 'MatPrat: Oppbevaring i fryser', url: 'https://www.matprat.no/artikler/oppbevaring-og-holdbarhet/oppbevaring-i-fryser/', dato: '2023-08-22' },
  // Kilder med bare årstall (fra datafilene i scripts/familier/): dato er da årstallet.
  'mt-sommer': { navn: 'Mattilsynet: Mat i sommervarmen', url: 'https://www.mattilsynet.no/mat-og-drikke/forbrukere/mat-i-sommervarmen', dato: '2023' },
  'mt-hamburger': { navn: 'Mattilsynet: Er det trygt å servere medium stekte hamburgere?', url: 'https://www.mattilsynet.no/mat-og-drikke/matservering/salg-medium-stekte-hamburgere', dato: '2022' },
  'mp-storfe': { navn: 'MatPrat: Steke- og koketips for storfekjøtt', url: 'https://www.matprat.no/artikler/steke--og-koketips/steke--og-koketips-for-storfekjott/', dato: '2014' },
  'mp-grill': { navn: 'MatPrat: Grilltider, metoder og temperaturer', url: 'https://www.matprat.no/artikler/tema/grilltider-metoder-og-temperaturer/', dato: '2018' },
  'mp-lam': { navn: 'MatPrat: Steke- og koketips for lammekjøtt', url: 'https://www.matprat.no/artikler/steke--og-koketips/steke--og-koketips-for-lammekjott/', dato: '2020' },
  'mp-svin': { navn: 'MatPrat: Steke- og koketips for svin', url: 'https://www.matprat.no/artikler/steke--og-koketips/steke--og-koketips-for-svinekjott/', dato: '2025' },
  'mp-fisk': { navn: 'MatPrat: Steke- og koketips for fisk og skalldyr', url: 'https://www.matprat.no/artikler/steke--og-koketips/steke--og-koketips-for-fisk-og-skalldyr/', dato: '2026' },
  'mp-kyllingfilet': { navn: 'MatPrat: Hvordan steke saftig kyllingfilet', url: 'https://www.matprat.no/artikler/tilberedning/slik-steker-du-kyllingfilet/', dato: '2026' },
  'mp-egg': { navn: 'MatPrat: Hvordan koke egg', url: 'https://www.matprat.no/artikler/tilberedning/slik-koker-du-egg/', dato: '2026' },
  'mp-poteter': { navn: 'MatPrat: Hvordan koke poteter', url: 'https://www.matprat.no/oppskrifter/tradisjon/hvordan-koke-poteter/', dato: '2019' },
  'mp-koke-ris': { navn: 'MatPrat: Hvordan koke ris', url: 'https://www.matprat.no/oppskrifter/tradisjon/hvordan-koke-ris/', dato: '2020' },
  'mp-bakt-potet': { navn: 'MatPrat: Bakt potet', url: 'https://www.matprat.no/oppskrifter/gjester/bakt-potet/', dato: '2014' },
  'mp-saltbakt': { navn: 'MatPrat: Saltbakte poteter', url: 'https://www.matprat.no/oppskrifter/gjester/saltbakte-poteter/', dato: '2014' },
  'mp-hasselback': { navn: 'MatPrat: Hasselbackpoteter', url: 'https://www.matprat.no/oppskrifter/gjester/hasselbackpoteter/', dato: '2014' },
  'ar-airfryer': { navn: 'Arla: Airfryer, anvendelse, opskrifter og tips', url: 'https://www.arla.dk/opskrifter/leksikon/viden/airfryer/', dato: '2026' },
  'ph-hd920': { navn: 'Philips: Brukerhåndbok for Essential Airfryer', url: 'https://dam.versuni.com/m/59b7caa0caaf68e4/original/User-Manual-Philips-Essential-Airfryer.pdf', dato: '2021' },
};
// tema → språk → kilde-id → [hva, tall] (tall tomt når kilden står bak et råd uten tall).
const KARUSELL_KILDER = {
  rester: {
    nb: {
      'mt-oppbevaring': [['restemat i kjøleskapet', '2 til 4 dager'], ['kjøleskapet', 'under 4 °C'], ['kjøle ned fra 60 til 10 °C', 'innen 2 timer']],
      'mt-ris': [['kokt ris og pasta skal kjøles ned så raskt som mulig og oppbevares i kjøleskapet', '']],
      'mt-kjokken': [['nedkjølingen går fortere når maten deles i mindre porsjoner', '']],
      'mp-ris': [['kokt ris og pasta i kjøleskapet, når restene er kjølt raskt ned', '2 til 3 dager']],
    },
    sv: {
      'mt-oppbevaring': [['matrester i kylen', '2 till 4 dagar'], ['kylskåpet', 'under 4 °C'], ['kyla ner från 60 till 10 °C', 'inom 2 timmar']],
      'mt-ris': [['kokt ris och pasta ska kylas ner så snabbt som möjligt och förvaras i kylen', '']],
      'mt-kjokken': [['nedkylningen går fortare när maten delas upp i mindre portioner', '']],
      'mp-ris': [['kokt ris och pasta i kylen, när resterna har kylts ner snabbt', '2 till 3 dagar']],
    },
    da: {
      'mt-oppbevaring': [['madrester i køleskabet', '2 til 4 dage'], ['køle ned fra 60 til 10 °C', 'inden for 2 timer']],
      'mt-ris': [['kogte ris og pasta skal køles ned så hurtigt som muligt og opbevares i køleskabet', '']],
      'mt-kjokken': [['nedkølingen går hurtigere, når maden deles i mindre portioner', '']],
      'mp-ris': [['kogte ris og pasta i køleskabet, når resterne er kølet hurtigt ned', '2 til 3 dage']],
    },
  },
  fryser: {
    nb: {
      'mt-oppbevaring': [['fryseren', '-18 °C eller kaldere'], ['kvaliteten blir dårligere etter', '3 til 12 måneder, avhengig av varen'], ['tin i kjøleskapet, ikke på kjøkkenbenken', '']],
      'mp-fryser': [['storfe', '10 til 12 måneder'], ['kylling', '4 måneder'], ['magert svinekjøtt', '6 måneder'], ['kjøttdeig', '4 måneder'], ['mager fisk', 'ca. 6 måneder'], ['fet fisk, som laks', 'ca. 3 måneder'], ['brød og rundstykker', '6 til 7 måneder'], ['kaker og søt bakst', '3 til 6 måneder'], ['middagsrester, gryter og supper', '3 til 6 måneder']],
    },
    sv: {
      'mt-oppbevaring': [['frysen', '-18 °C eller kallare'], ['kvaliteten blir sämre efter', '3 till 12 månader, beroende på varan'], ['tina i kylen, inte på köksbänken', '']],
      'mp-fryser': [['nötkött', '10 till 12 månader'], ['kyckling', '4 månader'], ['magert fläskkött', '6 månader'], ['köttfärs', '4 månader'], ['mager fisk', 'cirka 6 månader'], ['fet fisk, som lax', 'cirka 3 månader'], ['bröd och frallor', '6 till 7 månader'], ['kakor och söta bakverk', '3 till 6 månader'], ['matrester, grytor och soppor', '3 till 6 månader']],
    },
    da: {
      'mt-oppbevaring': [['fryseren', '-18 °C eller koldere'], ['kvaliteten bliver dårligere efter', '3 til 12 måneder, afhængigt af varen'], ['tø op i køleskabet, ikke på køkkenbordet', '']],
      'mp-fryser': [['oksekød', '10 til 12 måneder'], ['kylling', '4 måneder'], ['magert svinekød', '6 måneder'], ['hakket kød', '4 måneder'], ['mager fisk', 'ca. 6 måneder'], ['fed fisk, som laks', 'ca. 3 måneder'], ['brød og rundstykker', '6 til 7 måneder'], ['kager og sødt bagværk', '3 til 6 måneder'], ['madrester, gryderetter og supper', '3 til 6 måneder']],
    },
  },
  kjernetemp: {
    nb: {
      'mt-sommer': [['gjennomstekt betyr en kjernetemperatur på minst', '75 °C']],
      'mt-hamburger': [['hamburgere og kjøttdeig gjennomstekes til en kjernetemperatur over', '70 °C']],
      'mp-storfe': [['storfe, medium', '60 °C'], ['storfe, gjennomstekt', '70 °C']],
      'mp-grill': [['storfe, rødt', '55 til 60 °C']],
      'mp-lam': [['lam, medium', '60 til 65 °C'], ['lam, gjennomstekt', '75 °C']],
      'mp-svin': [['svinefilet, medium', '65 °C'], ['svinefilet, gjennomstekt', '75 °C']],
      'mp-fisk': [['fisk i ovn, tykkere stykker', 'ca. 60 °C, eller lavere om du vil ha rå kjerne']],
      'mp-kyllingfilet': [['kyllingfilet stiger mens den hviler', '1 til 3 °C']],
    },
    sv: {
      'mt-sommer': [['genomstekt betyder en innertemperatur på minst', '75 °C']],
      'mt-hamburger': [['hamburgare och köttfärs genomstekts till en innertemperatur över', '70 °C']],
      'mp-storfe': [['nöt, medium', '60 °C'], ['nöt, genomstekt', '70 °C']],
      'mp-grill': [['nöt, blodigt', '55 till 60 °C']],
      'mp-lam': [['lamm, medium', '60 till 65 °C'], ['lamm, genomstekt', '75 °C']],
      'mp-svin': [['fläskfilé, medium', '65 °C'], ['fläskfilé, genomstekt', '75 °C']],
      'mp-fisk': [['fisk i ugn, tjockare bitar', 'ca 60 °C, eller lägre om du vill ha en rå kärna']],
      'mp-kyllingfilet': [['kycklingfilé stiger medan den vilar', '1 till 3 °C']],
    },
    da: {
      'mt-sommer': [['gennemstegt betyder en kernetemperatur på mindst', '75 °C']],
      'mt-hamburger': [['hamburgere og hakket kød gennemstegt til en kernetemperatur over', '70 °C']],
      'mp-storfe': [['okse, medium', '60 °C'], ['okse, gennemstegt', '70 °C']],
      'mp-grill': [['okse, rød', '55 til 60 °C']],
      'mp-lam': [['lam, medium', '60 til 65 °C'], ['lam, gennemstegt', '75 °C']],
      'mp-svin': [['svinefilet, medium', '65 °C'], ['svinefilet, gennemstegt', '75 °C']],
      'mp-fisk': [['fisk i ovn, tykkere stykker', 'ca. 60 °C, eller lavere, hvis du vil have en rå kerne']],
      'mp-kyllingfilet': [['kyllingefilet stiger, mens den hviler', '1 til 3 °C']],
    },
  },
  koketid: {
    nb: {
      'mp-egg': [['bløtkokt egg', '5 til 6 minutter'], ['smilende egg', '7 til 8 minutter'], ['hardkokt egg', '9 til 11 minutter'], ['kalde, store og ferske egg', 'litt lengre tid'], ['avkjøl eggene raskt i', 'kaldt vann']],
      'mp-poteter': [['poteter, avhengig av type og størrelse', '15 til 25 minutter']],
      'mp-koke-ris': [['hvit ris, sjekk etter', '18 minutter'], ['fullkornsris', '30 til 40 minutter'], ['villris uten bløtlegging', '45 til 50 minutter'], ['lokket står på gjennom hele koketiden', '']],
      'mp-bakt-potet': [['bakt potet i ovn på 220 °C', '1 til 1½ time']],
      'mp-saltbakt': [['saltbakte poteter i ovn på 200 °C', 'ca. 40 minutter']],
      'mp-hasselback': [['hasselbackpoteter i ovn på 225 °C', 'ca. 40 minutter']],
    },
  },
  airfryer: {
    nb: {
      'mt-sommer': [['gjennomstekt betyr en kjernetemperatur på minst', '75 °C']],
      'ar-airfryer': [['ovn 150 °C og 10 min', 'airfryer 135 °C og 8 min'], ['ovn 165 °C og 15 min', 'airfryer 150 °C og 12 min'], ['ovn 175 °C og 20 min', 'airfryer 165 °C og 16 min'], ['ovn 190 °C og 30 min', 'airfryer 175 °C og 24 min'], ['ovn 200 °C og 45 min', 'airfryer 185 °C og 36 min'], ['ovn 225 °C og 60 min', 'airfryer 200 °C og 48 min'], ['tabellen er en tommelfingerregel, det kommer an på ovnen og airfryeren', '']],
      'ph-hd920': [['rist kurven under steking', '2 til 3 ganger']],
    },
    sv: {
      'mt-sommer': [['genomstekt betyder en innertemperatur på minst', '75 °C']],
      'ar-airfryer': [['ugn 150 °C och 10 min', 'airfryer 135 °C och 8 min'], ['ugn 165 °C och 15 min', 'airfryer 150 °C och 12 min'], ['ugn 175 °C och 20 min', 'airfryer 165 °C och 16 min'], ['ugn 190 °C och 30 min', 'airfryer 175 °C och 24 min'], ['ugn 200 °C och 45 min', 'airfryer 185 °C och 36 min'], ['ugn 225 °C och 60 min', 'airfryer 200 °C och 48 min'], ['tabellen är en tumregel, det beror på ugnen och airfryern', '']],
      'ph-hd920': [['skaka korgen under tillagningen', '2 till 3 gånger']],
    },
    da: {
      'mt-sommer': [['gennemstegt betyder en kernetemperatur på mindst', '75 °C']],
      'ar-airfryer': [['ovn 150 °C og 10 min', 'airfryer 135 °C og 8 min'], ['ovn 165 °C og 15 min', 'airfryer 150 °C og 12 min'], ['ovn 175 °C og 20 min', 'airfryer 165 °C og 16 min'], ['ovn 190 °C og 30 min', 'airfryer 175 °C og 24 min'], ['ovn 200 °C og 45 min', 'airfryer 185 °C og 36 min'], ['ovn 225 °C og 60 min', 'airfryer 200 °C og 48 min'], ['tabellen er en tommelfingerregel, det afhænger af ovnen og airfryeren', '']],
      'ph-hd920': [['ryst kurven under tilberedningen', '2 til 3 gange']],
    },
  },
};
const KILDETEKST = {
  nb: { tittel: 'Kilder og tall', intro: 'Hvert tall i tabellene står her, med kilde, adresse og dato. Mattilsynet er den norske myndigheten for mattrygghet, og MatPrat er Opplysningskontoret for egg og kjøtt. Vi har åpnet og lest hver side 21. november 2026. Tidene er veiledende.', adresse: 'Adresse', dato: 'Dato på kilden', hentet: 'Hentet', tall: 'Det vi bruker', mnd: ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'], punktum: '.' },
  sv: { tittel: 'Källor och siffror', intro: 'Varje siffra i tabellerna finns här, med källa, adress och datum. Mattilsynet är den norska myndigheten för livsmedelssäkerhet, och MatPrat är Opplysningskontoret for egg og kjøtt, den norska ägg- och köttbranschens informationskontor. Vi har öppnat och läst varje sida den 21 november 2026. Tiderna är ungefärliga.', adresse: 'Webbadress', dato: 'Datum på källan', hentet: 'Hämtad', tall: 'Det vi använder', mnd: ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'], punktum: '' },
  da: { tittel: 'Kilder og tal', intro: 'Hvert tal i tabellerne står her med kilde, adresse og dato. Mattilsynet er den norske fødevaremyndighed, og MatPrat er Opplysningskontoret for egg og kjøtt, den norske æg- og kødbranches oplysningskontor. Vi har åbnet og læst hver side den 21. november 2026. Tiderne er vejledende.', adresse: 'Webadresse', dato: 'Dato på kilden', hentet: 'Hentet', tall: 'Det, vi bruger', mnd: ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'], punktum: '.' },
};
const AAR_ETIKETT = { nb: 'Årstall på kilden', sv: 'Årtal på källan', da: 'Årstal på kilden' };
// Tema som ikke bruker standardinnledningen (Mattilsynet og MatPrat, tidene veiledende).
const KILDEINTRO = {
  kjernetemp: {
    nb: 'Hvert tall i tabellene står her, med kilde, adresse og årstall. Mattilsynet er den norske myndigheten for mattrygghet, og MatPrat er Opplysningskontoret for egg og kjøtt. Vi har åpnet og lest hver side 21. november 2026. Tallene er veiledende.',
    sv: 'Varje siffra i tabellerna finns här, med källa, adress och årtal. Mattilsynet är den norska myndigheten för livsmedelssäkerhet, och MatPrat är Opplysningskontoret for egg og kjøtt, den norska ägg- och köttbranschens informationskontor. Vi har öppnat och läst varje sida den 21 november 2026. Siffrorna är vägledande.',
    da: 'Hvert tal i tabellerne står her med kilde, adresse og årstal. Mattilsynet er den norske fødevaremyndighed, og MatPrat er Opplysningskontoret for egg og kjøtt, den norske æg- og kødbranches oplysningskontor. Vi har åbnet og læst hver side den 21. november 2026. Tallene er vejledende.',
  },
  koketid: {
    nb: 'Hvert tall i tabellene står her, med kilde, adresse og årstall. MatPrat er Opplysningskontoret for egg og kjøtt. Vi har åpnet og lest hver side 21. november 2026. Tidene er veiledende.',
  },
  airfryer: {
    nb: 'Hvert tall i tabellene står her, med kilde, adresse og årstall. Mattilsynet er den norske myndigheten for mattrygghet, Arla er et meieriselskap, og Philips lager airfryere. Omregningstabellen er Arlas. Vi har åpnet og lest hver side 21. november 2026. Tidene er veiledende.',
    sv: 'Varje siffra i tabellerna finns här, med källa, adress och årtal. Mattilsynet är den norska myndigheten för livsmedelssäkerhet, Arla är ett mejeriföretag och Philips tillverkar airfryers. Omräkningstabellen kommer från Arla. Vi har öppnat och läst varje sida den 21 november 2026. Tiderna är ungefärliga.',
    da: 'Hvert tal i tabellerne står her med kilde, adresse og årstal. Mattilsynet er den norske fødevaremyndighed, Arla er et mejerifirma, og Philips laver airfryere. Omregningstabellen er Arlas. Vi har åbnet og læst hver side den 21. november 2026. Tiderne er vejledende.',
  },
};
// Lenker til sidefamiliene som har alle tallene (bare norsk, familiene finnes bare på norsk).
const KILDELENKE = {
  kjernetemp: { nb: ['Alle råvarene med kjernetemperatur og kilder:', '/kjernetemperatur/', 'Kjernetemperatur'] },
  koketid: { nb: ['Steketider for kjøtt, fisk og poteter i ovnen:', '/steketid/', 'Steketid'] },
  airfryer: { nb: ['Omregner og tabeller for flere retter, med kilder:', '/airfryer/ovn-til-airfryer/', 'Ovn til airfryer'] },
};
const datoTekst = (lang, iso) => {
  if (/^\d{4}$/u.test(iso)) return iso; // kilder som bare har årstall
  const [aar, mnd, dag] = iso.split('-').map(Number);
  const t = KILDETEKST[lang];
  return `${dag}${t.punktum} ${t.mnd[mnd - 1]} ${aar}`;
};
export const karusellKilder = (lang, tema) => KARUSELL_KILDER[tema]?.[lang] ?? null;

function kilderSeksjon(lang, tema) {
  const kilder = karusellKilder(lang, tema);
  if (!kilder) return '';
  const t = KILDETEKST[lang];
  const l = KILDELENKE[tema]?.[lang];
  const lenke = l ? `<p>${l[0]} <a href="${l[1]}">${l[2]}</a>.</p>` : '';
  const kort = Object.entries(kilder).map(([id, tall]) => {
    const k = KILDE[id];
    const liste = tall.map(([hva, vis]) => `<li>${hva}${vis ? `: <strong>${vis}</strong>` : ''}</li>`).join('');
    return `<div class="scenario" id="kilde-${id}"><h3>${k.navn}</h3><dl><dt>${t.adresse}</dt><dd><a href="${k.url}" rel="noopener">${k.url}</a></dd><dt>${/^\d{4}$/u.test(k.dato) ? AAR_ETIKETT[lang] : t.dato}</dt><dd><time datetime="${k.dato}">${datoTekst(lang, k.dato)}</time></dd><dt>${t.hentet}</dt><dd><time datetime="${KILDER_HENTET}">${datoTekst(lang, KILDER_HENTET)}</time></dd><dt>${t.tall}</dt><dd><ul>${liste}</ul></dd></dl></div>`;
  }).join('');
  return `<section class="prose locale-prose"><h2 id="kilder">${t.tittel}</h2><p>${KILDEINTRO[tema]?.[lang] ?? t.intro}</p>${lenke}${kort}</section>\n`;
}

// Sluttsiden i karusellen peker på én funksjon; CTA-bildet viser den.
const CTA_BILDE = { koketid: '05-kokemodus', kjernetemp: '05-kokemodus', airfryer: '05-kokemodus', rester: '02-ukemeny', fryser: '02-ukemeny', eggtest: '02-ukemeny', egg: '01-import', doble: '01-import' };

const TEKST = {
  nb: { blogg: 'Blogg', hjem: 'Forside', galleri: 'Hele karusellen', flere: 'Flere kjøkkentips', indeksTittel: 'Kjøkkentips fra Matlyst', indeksIngress: 'Korte svar på det du lurer på ved komfyren: koketider, kjernetemperatur, rester, fryser og airfryer. Hver artikkel er en av karusellene våre, samlet på ett sted.', indeksBeskrivelse: 'Kjøkkentips fra Matlyst: koketider, kjernetemperatur, rester, fryser, airfryer og eggtest, med tabeller du kan slå opp i.' },
  sv: { blogg: 'Blogg', hjem: 'Hem', galleri: 'Hela karusellen', flere: 'Fler kökstips', indeksTittel: 'Kökstips från Matlyst', indeksIngress: 'Korta svar på det du undrar över vid spisen: innertemperatur, rester, frysen och airfryern. Varje artikel är en av våra karuseller, samlad på ett ställe.', indeksBeskrivelse: 'Kökstips från Matlyst: innertemperatur, rester, frysen, airfryer och äggtest, med tabeller att slå upp i.' },
  da: { blogg: 'Blog', hjem: 'Forside', galleri: 'Hele karrusellen', flere: 'Flere køkkentips', indeksTittel: 'Køkkentips fra Matlyst', indeksIngress: 'Korte svar på det, du undrer dig over ved komfuret: kernetemperatur, rester, fryseren og airfryeren. Hver artikel er en af vores karruseller, samlet ét sted.', indeksBeskrivelse: 'Køkkentips fra Matlyst: kernetemperatur, rester, fryseren, airfryer og ægtest, med tabeller, du kan slå op i.' },
  en: { blogg: 'Blog', hjem: 'Home', galleri: 'The full carousel', flere: 'More kitchen tips', indeksTittel: 'Kitchen tips from Matlyst', indeksIngress: 'Quick answers to the questions you have at the stove: boiling times, safe temperatures, leftovers, the freezer, and the air fryer. Each article is one of our carousels, all in one place.', indeksBeskrivelse: 'Kitchen tips from Matlyst: boiling times, safe internal temperatures, leftovers, freezer times, air fryer conversions, and the egg float test.' },
};

const ren = (html) => String(html ?? '').replace(/<[^>]+>/gu, '').replace(/\s+/gu, ' ').trim();
const celle = (html) => String(html).replace(/<small>(.*?)<\/small>/gu, ' <span class="merknad">($1)</span>');
const esc = (tekst) => String(tekst ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

function autoSprakfil(lang) {
  return JSON.parse(readFileSync(new URL(`seo-data/sprak/${lang}.json`, REPO_ROT), 'utf8'));
}

let kilde = null;
function lastKilde() {
  if (kilde) return kilde;
  const fil = new URL('../blogg-kilde/karuseller.json', import.meta.url);
  kilde = existsSync(fil) ? JSON.parse(readFileSync(fil, 'utf8')) : {};
  return kilde;
}

// Meta-beskrivelsen: ingressen kuttet ved hel setning, rundt 155 tegn.
function beskrivelse(ingress) {
  const setninger = ingress.match(/[^.!?]+[.!?]+/gu) ?? [ingress];
  let ut = '';
  for (const s of setninger) {
    if (ut && (ut + s).length > 160) break;
    ut += s;
  }
  return ut.trim();
}

export function bloggArtikler(lang) {
  const data = lastKilde()[lang] ?? {};
  return Object.entries(BLOGGTEMAER)
    .filter(([tema, sprak]) => sprak[lang] && data[tema])
    .map(([tema, sprak]) => {
      const [slug, title, meta] = sprak[lang];
      const k = data[tema];
      return { tema, lang, path: `${BLOGGROT[lang]}${slug}/`, title, description: meta ?? beskrivelse(k.ingress), karusell: k };
    });
}

export function autoArtikler(lang, rot = REPO_ROT) {
  const mappe = new URL(`blogg-kilde/auto/${lang}/`, rot);
  if (!existsSync(mappe)) return [];
  return readdirSync(mappe, { withFileTypes: true })
    .filter((fil) => fil.isFile() && fil.name.endsWith('.json'))
    .map((fil) => JSON.parse(readFileSync(new URL(fil.name, mappe), 'utf8')))
    .map((auto) => ({
      lang,
      path: `${BLOGGROT[lang]}${auto.slug}/`,
      title: auto.tittel,
      description: auto.meta,
      auto,
    }))
    .sort((a, b) => String(b.auto.publisert).localeCompare(String(a.auto.publisert)));
}

// Språkgruppene til hreflang og språkvelgeren (locale-sider.mjs sprer dem inn i SIDEGRUPPER).
export function bloggGrupper(rot = REPO_ROT) {
  const grupper = [{ id: 'blogg', sider: { ...BLOGGROT } }];
  for (const [tema, sprak] of Object.entries(BLOGGTEMAER)) {
    grupper.push({ id: `blogg-${tema}`, sider: Object.fromEntries(Object.entries(sprak).map(([lang, [slug]]) => [lang, `${BLOGGROT[lang]}${slug}/`])) });
  }
  const autoGrupper = new Map();
  for (const lang of Object.keys(BLOGGROT)) {
    for (const artikkel of autoArtikler(lang, rot)) {
      const id = `auto-${artikkel.auto.emne_id}`;
      const gruppe = autoGrupper.get(id) ?? { id, sider: {} };
      gruppe.sider[lang] = artikkel.path;
      autoGrupper.set(id, gruppe);
    }
  }
  grupper.push(...autoGrupper.values());
  return grupper;
}

function bilde(lang, tema, fil) {
  return `/images/blogg/${lang}/${tema}/${fil}`;
}

export function artikkelSchema(a) {
  const t = TEKST[a.lang];
  return [{
    '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: t.hjem, item: `${base}${a.lang === 'nb' ? '/' : `/${a.lang}/`}` },
      { '@type': 'ListItem', position: 2, name: t.blogg, item: `${base}${BLOGGROT[a.lang]}` },
      { '@type': 'ListItem', position: 3, name: a.title, item: `${base}${a.path}` },
    ],
  }, {
    '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.description,
    image: [`${base}${bilde(a.lang, a.tema, a.karusell.bilder[0])}`], inLanguage: SPRAKKODE[a.lang],
    datePublished: PUBLISERT, dateModified: PUBLISERT, mainEntityOfPage: `${base}${a.path}`,
    ...(karusellKilder(a.lang, a.tema) ? { citation: Object.keys(karusellKilder(a.lang, a.tema)).map((id) => ({ '@type': 'WebPage', name: KILDE[id].navn, url: KILDE[id].url })) } : {}),
    author: medForfatter(a) ? forfatterPerson() : { '@type': 'Organization', name: 'Matlyst', url: base }, publisher: { '@type': 'Organization', name: 'Matlyst', url: base },
  }];
}

const medForfatter = (a) => a.lang === 'nb' && harForfatter(a.path);

export function artikkelMain(a, knapper) {
  const t = TEKST[a.lang];
  const { sider, bilder, etikett, ingress } = a.karusell;
  const forside = sider[0];
  const logo = sider.at(-1);
  const tabeller = sider.filter((s) => s.type === 'tabell').map((s) => `<h2>${ren(s.tittel)}</h2><table class="blogg-tabell"><tbody>${s.rader.map(([a1, b1]) => `<tr><th scope="row">${celle(a1)}</th><td>${celle(b1)}</td></tr>`).join('')}</tbody></table>${s.notis ? `<p>${s.notis}</p>` : ''}`).join('\n');
  const galleri = bilder.slice(1).map((fil, i) => `<img src="${bilde(a.lang, a.tema, fil)}" width="800" height="1000" loading="lazy" decoding="async" alt="${ren(sider[i + 1].tittel)}">`).join('');
  const cta = appCta(a.lang, {
    bilde: CTA_BILDE[a.tema], bildeAlt: ren(logo.under),
    appCtaTittel: ren(logo.tittel).replace(/^(?:Eller|Or|Annars)\s+/iu, '').replace(/^./u, (c) => c.toUpperCase()),
    appCtaTekst: ren(logo.under),
  }, knapper);
  const flere = bloggArtikler(a.lang).filter((b) => b.tema !== a.tema)
    .map((b) => `<li><a href="${b.path}">${b.title}</a></li>`).join('');
  return `<main id="hovedinnhold"><article class="blogg-artikkel"><header class="locale-page-hero"><p class="eyebrow"><a href="${BLOGGROT[a.lang]}">${t.blogg}</a> · ${etikett}</p><h1 class="disp">${a.title}</h1><p class="lead">${ingress}</p>${medForfatter(a) ? FORFATTERLINJE : ''}</header>
<figure class="blogg-forside"><img src="${bilde(a.lang, a.tema, bilder[0])}" width="800" height="1000" decoding="async" alt="${ren(forside.tittel)} ${ren(forside.under)}"></figure>
<section class="prose locale-prose">${tabeller}</section>
${kilderSeksjon(a.lang, a.tema)}<section class="blogg-galleri" aria-label="${t.galleri}"><h2>${t.galleri}</h2><div class="blogg-galleri-rad" tabindex="0">${galleri}</div></section>
${cta}
<div class="blogg-flere" role="navigation" aria-label="${t.flere}"><h2>${t.flere}</h2><ul>${flere}</ul></div></article></main>`;
}

export function autoArtikkelSchema(a) {
  const t = TEKST[a.lang];
  const artikkel = a.auto;
  return [{
    '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: t.hjem, item: `${base}${a.lang === 'nb' ? '/' : `/${a.lang}/`}` },
      { '@type': 'ListItem', position: 2, name: t.blogg, item: `${base}${BLOGGROT[a.lang]}` },
      { '@type': 'ListItem', position: 3, name: artikkel.tittel, item: `${base}${a.path}` },
    ],
  }, {
    '@context': 'https://schema.org', '@type': 'Article', headline: artikkel.tittel,
    description: artikkel.meta, image: [`${base}/images/og.jpg`], inLanguage: SPRAKKODE[a.lang],
    datePublished: artikkel.publisert, dateModified: artikkel.publisert,
    mainEntityOfPage: `${base}${a.path}`, citation: (artikkel.kilder ?? []).map(({ url }) => url),
    author: { '@type': 'Organization', name: 'Matlyst', url: base },
    publisher: { '@type': 'Organization', name: 'Matlyst', url: base },
  }, {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: (artikkel.faq ?? []).map(({ sporsmal, svar }) => ({
      '@type': 'Question', name: sporsmal,
      acceptedAnswer: { '@type': 'Answer', text: svar },
    })),
  }];
}

export function autoArtikkelMain(a, knapper) {
  const artikkel = a.auto;
  const sprakfil = autoSprakfil(a.lang);
  const autoTekst = sprakfil.autoBlogg;
  const seksjoner = (artikkel.seksjoner ?? []).map((seksjon) => {
    const overskrift = `<h2>${esc(seksjon.overskrift)}</h2>`;
    if (seksjon.type === 'avsnitt') return `${overskrift}<p>${esc(seksjon.tekst)}</p>`;
    if (seksjon.type === 'tabell') {
      const rader = seksjon.rader.map(([venstre, hoyre]) => `<tr><th scope="row">${esc(venstre)}</th><td>${esc(hoyre)}</td></tr>`).join('');
      return `${overskrift}<table class="blogg-tabell"><tbody>${rader}</tbody></table>`;
    }
    const punkter = seksjon.punkter.map((punkt) => `<li>${esc(punkt)}</li>`).join('');
    return `${overskrift}<ul>${punkter}</ul>`;
  }).join('\n');
  const faq = (artikkel.faq ?? []).map(({ sporsmal, svar }, indeks) =>
    `<details${indeks === 0 ? ' open' : ''}><summary>${esc(sporsmal)}</summary><p>${esc(svar)}</p></details>`).join('');
  const kilder = (artikkel.kilder ?? []).map(({ id, url }) =>
    `<li><a href="${esc(url)}" rel="noopener">${esc(id)}</a></li>`).join('');
  const relaterte = [...(artikkel.lenker ?? []), ...(artikkel.lesOgså ?? [])]
    .map(({ sti, tittel }) => `<li><a href="${esc(sti)}">${esc(tittel)}</a></li>`).join('');
  const ctaTekst = sprakfil.appCta[artikkel.appkobling];
  const cta = appCta(a.lang, {
    bilde: AUTO_CTA_BILDE[artikkel.appkobling],
    bildeAlt: ctaTekst.tittel,
    appCtaTittel: ctaTekst.tittel,
    appCtaTekst: ctaTekst.tekst,
  }, knapper);
  return `<main id="hovedinnhold"><article class="blogg-artikkel"><header class="locale-page-hero"><p class="eyebrow"><a href="${BLOGGROT[a.lang]}">${TEKST[a.lang].blogg}</a></p><h1 class="disp">${esc(artikkel.tittel)}</h1><p class="lead">${esc(artikkel.ingress)}</p></header>
<section class="prose locale-prose">${seksjoner}</section>
<section class="faq"><h2>${esc(autoTekst.faqTittel)}</h2>${faq}</section>
<section class="prose locale-prose"><h2>${esc(autoTekst.kilderTittel)}</h2><ol class="blogg-kilder">${kilder}</ol></section>
${cta}
${relaterte ? `<div class="blogg-flere" role="navigation" aria-label="${esc(autoTekst.lesOgsåTittel)}"><h2>${esc(autoTekst.lesOgsåTittel)}</h2><ul>${relaterte}</ul></div>` : ''}</article></main>`;
}

export function indeksMain(lang, rot = REPO_ROT) {
  const t = TEKST[lang];
  const kort = bloggArtikler(lang).map((a) => `<li><a href="${a.path}"><img src="${bilde(lang, a.tema, a.karusell.bilder[0])}" width="800" height="1000" loading="lazy" decoding="async" alt=""><span>${a.title}</span></a></li>`).join('');
  const autoTekst = autoSprakfil(lang).autoBlogg;
  const autoKort = autoArtikler(lang, rot)
    .map((a) => `<li><a href="${a.path}"><span>${esc(a.title)}</span></a></li>`).join('');
  return `<main id="hovedinnhold"><header class="locale-page-hero"><p class="eyebrow">${t.blogg}</p><h1 class="disp">${t.indeksTittel}</h1><p class="lead">${t.indeksIngress}</p></header>
<ul class="blogg-kort">${kort}</ul>${autoKort ? `<section class="blogg-flere"><h2>${esc(autoTekst.indeksTittel)}</h2><ul>${autoKort}</ul></section>` : ''}</main>`;
}

export function indeksMeta(lang) {
  const t = TEKST[lang];
  return { path: BLOGGROT[lang], title: t.indeksTittel, description: t.indeksBeskrivelse,
    schema: [{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: t.indeksTittel, url: `${base}${BLOGGROT[lang]}`, inLanguage: SPRAKKODE[lang] }] };
}

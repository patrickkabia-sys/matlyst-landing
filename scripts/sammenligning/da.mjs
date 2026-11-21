// Tre neutrale sammenligningssider for Danmark (da-DK): /da/bedste-opskriftsapp/, /da/bedste-indkoebsliste-app/, /da/bedste-madplan-app/.
// Samme generator som de norske, engelske og svenske sider (sammenligning.mjs); her står kun det danske marked: tekst, feltnavne og appvalg.
// Alle oplysninger og citater står i apper.da.json, hentet fra dansk App Store, Google Play (Danmark) og appsenes egne hjemmesider 2026-11-21.
// kildekontroll.mjs da tjekker, at hvert citat stadig står hos kilden. Låst af test/sammenligning.test.mjs.
// Skrevet ud fra meningen (matlyst-sprak, da), ikke oversat fra de norske sider. Dansk siger aftensmad, aldrig middag.
// Det, der siges om Matlyst, følger de danske appsider: metriske mængder som standard, opskrifter på andre sprog oversættes til dansk.
import { lagSammenligning, p, ul } from './sammenligning.mjs';

const MAANEDER = ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'];
const delt = (iso) => iso.split('-').map(Number);
const langDato = (iso) => { const [a, m, d] = delt(iso); return `${d}. ${MAANEDER[m - 1]} ${a}`; };
const kortDato = (iso) => { const [a, m, d] = delt(iso); return `${String(d).padStart(2, '0')}.${String(m).padStart(2, '0')}.${a}`; };
const og = (xs) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} og ${xs.at(-1)}` : xs[0] ?? '');
const NEUTRAL = ['Kan siden være neutral, når Matlyst har lavet den?', 'Vi er part i sagen, og det står øverst. Derfor linker hver oplysning til sin kilde og har en dato, så du selv kan tjekke den.'];

export const MARKED = {
  lang: 'da',
  datafil: new URL('./apper.da.json', import.meta.url),
  prefiks: '/da/',
  avsender: 'Vi laver Matlyst, så vi er part i sagen. Derfor har alt her en kilde og en dato.',
  ikke: 'Ikke oplyst',
  stier: Object.freeze({ oppskrift: 'bedste-opskriftsapp/', handleliste: 'bedste-indkoebsliste-app/', ukemeny: 'bedste-madplan-app/' }),
  langDato, kortDato, liste: og,
  felt: {
    plattformer: 'Platforme',
    sprak: 'Dansk i appen',
    gratis: 'Gratis',
    betalt: 'Betalt',
    nett: 'Import fra hjemmesider',
    sosiale: 'Import fra sociale medier',
    ukemeny: 'Madplan',
    handleliste: 'Indkøbsliste',
    deling: 'Deling i husstanden',
    spiskammer: 'Spisekammer',
    saerpreg: 'Godt at vide',
  },
  sideapper: {
    oppskrift: ['matlyst', 'paprika', 'recime', 'recipekeeper', 'samsung', 'valdemarsro'],
    handleliste: ['matlyst', 'bring', 'coop', 'listonic', 'netto', 'rema'],
    ukemeny: ['matlyst', 'mambeno', 'paprika', 'plantoeat', 'recipekeeper', 'samsung', 'valdemarsro'],
  },
  tekst: {
    app: 'App',
    bestFor: 'Bedst for dig, der',
    kilder: 'Kilder',
    sjekket: 'tjekket',
    sjekketStor: 'Tjekket',
    eyebrow: 'Sammenligning',
    stegTittel: 'Sådan vælger du',
    faqTittel: 'Spørgsmål og svar',
    hvem: 'Hvem har skrevet siden',
    hvemTekst: (dato) => `Matlyst er en af appsene på siden. Alt, hvad vi skriver om de andre apps, kommer fra deres egne sider i App Store og Google Play og fra deres egne hjemmesider, og kortene linker dertil. Sidst tjekket ${dato}.`,
    valg: 'Kort svar: vælg efter behov',
    sammenligning: 'Side om side',
    tabellIntro: 'Tabellen viser, hvad appsene selv oplyser. Stryg sidelæns i tabellen for at se alle kolonner.',
    tabellTittel: 'Det, appsene selv oplyser',
    enForEn: 'Appsene en for en',
    slikValgte: 'Sådan valgte vi',
    sidenavn: { oppskrift: 'opskriftsapps', handleliste: 'apps til indkøbslister', ukemeny: 'madplan-apps' },
    andreSider: (lenker) => `Vi har også sammenlignet ${lenker} på samme måde.`,
    slikValgteTekst: (kategori, dato) => p(
      `Vi tog apps med, der findes i den danske App Store, og hvor ${kategori} er en af hovedfunktionerne. De fleste findes også på Google Play. Udvalget er vores eget, og en app, der ikke står her, er ikke dårligere af den grund.`,
      `Alle oplysninger kommer fra appens egen side i App Store (Danmark), fra Google Play (Danmark) og fra appens egen hjemmeside. Vi tjekkede dem ${dato}. Hvert kort linker til kilderne.`,
    ) + ul([
      '<strong>Alfabetisk rækkefølge.</strong> Appsene står efter navn, og rækkefølgen er ingen rangering.',
      '<strong>»Ikke oplyst«</strong> betyder, at vi ikke fandt det i kilderne. Det betyder ikke, at appen mangler funktionen.',
      '<strong>Ingen stjerner eller bedømmelser.</strong> De ændrer sig fra uge til uge, og de siger ikke meget om, hvad der passer til dig.',
      '<strong>Ingen priser i kroner.</strong> Priserne ændrer sig og kan være forskellige i App Store og Google Play. Du ser prisen i butikken, før du køber.',
      '<strong>Dansk i appen</strong> betyder, at dansk står blandt sprogene på appens side i App Store.',
      '<strong>Ingen logoer eller skærmbilleder</strong> fra andre apps. Navnene tilhører deres ejere, og Matlyst har ingen forbindelse til nogen af dem.',
    ]) + p('Har vi taget fejl, eller har en app ændret sig? Skriv til <a href="mailto:hei@matlyst-app.no">hei@matlyst-app.no</a>, så tjekker vi kilden og retter siden.'),
  },
  // guidePage (generer-lokalsider.mjs) tilføjer selv BreadcrumbList og bygger FAQPage ud fra den synlige FAQ.
  skjemaer: ({ artikkel }) => [artikkel, 'faq'],
  sider: {
    oppskrift: {
      title: 'Bedste opskriftsapp: seks apps sammenlignet',
      description: 'Hvilken opskriftsapp passer til dig? Seks apps sammenlignet på dansk i appen, gratisversion, import fra hjemmesider og sociale medier, madplan og deling. Med kilde og dato.',
      h1: 'Bedste opskriftsapp: seks apps sammenlignet',
      lead: 'Her er seks opskriftsapps, du kan få i Danmark, sammenlignet ud fra det, appsene selv oplyser.',
      kategori: 'opskrifterne',
      svar: 'Der findes ingen app, der er bedst for alle. Gemmer du opskrifter fra Instagram og TikTok, oplyser Matlyst, ReciMe og Recipe Keeper, at de kan det, og Paprika kan det med Premium. Af dem har Matlyst, Paprika og Recipe Keeper dansk i appen. Vil du have samme app på computer og Android, så se på Paprika eller Recipe Keeper. Vil du have færdige opskrifter og en madplan hver uge, er Valdemarsro bygget til det. Samsung Food har et stort bibliotek af offentlige opskrifter.',
      valg: ul([
        '<strong>Du gemmer fra Instagram og TikTok:</strong> Matlyst, ReciMe og Recipe Keeper oplyser, at de importerer fra begge. Paprika gør det med Premium.',
        '<strong>Du vil have appen på dansk:</strong> Matlyst, Paprika, Recipe Keeper og Valdemarsro har dansk blandt sprogene i App Store.',
        '<strong>Du vil bruge den gratis:</strong> ReciMe giver fem importer om ugen, Matlyst fem om måneden og Paprika op til 50 opskrifter på én enhed.',
        '<strong>Du bruger pc eller Mac:</strong> Paprika findes til Mac og Windows, og Recipe Keeper til pc og Mac.',
        '<strong>Du vil have færdige opskrifter, ikke kun dine egne:</strong> Valdemarsro er fyldt med opskrifter, og Samsung Food har et stort bibliotek af offentlige opskrifter.',
        '<strong>Du vil planlægge ugen i samme app:</strong> Matlyst, Paprika, ReciMe, Recipe Keeper og Samsung Food har en madplan. I Valdemarsro følger den med Premium.',
      ]),
      tabellFelt: ['plattformer', 'sprak', 'gratis', 'nett', 'sosiale', 'deling'],
      kortFelt: ['plattformer', 'sprak', 'gratis', 'betalt', 'nett', 'sosiale', 'ukemeny', 'handleliste', 'deling', 'saerpreg'],
      best: {
        matlyst: 'gemmer opskrifter fra TikTok, Instagram, YouTube og hjemmesider og vil have madplan, indkøbsliste og spisekammer i samme app, på dansk.',
        paprika: 'vil have samme app på iPhone, Mac, Android og Windows og kunne lave mad offline.',
        recime: 'gemmer meget fra Instagram, TikTok og Pinterest og vil have gratis importer hver uge.',
        recipekeeper: 'vil scanne opskrifter fra billeder og PDF-filer eller flytte over fra en anden opskriftsapp.',
        samsung: 'vil have et stort bibliotek af opskrifter at kigge i og en gratis ugeplan.',
        valdemarsro: 'vil have opskrifter fra Valdemarsro og en færdig madplan hver uge, som husstanden deler.',
      },
      ekstra: [
        ['Gem dine egne opskrifter, eller find nye', p('De fleste apps her er bygget til at <strong>gemme dine egne opskrifter</strong> fra hjemmesider, sociale medier og billeder. Valdemarsro er bygget op om <strong>sine egne opskrifter</strong>, og Samsung Food har sit eget bibliotek at kigge i.',
          'Resten adskiller sig mest ved, hvor du finder dine opskrifter, hvilke enheder du bruger, og om du vil have et abonnement. Vil du selv teste, så læs guiden <a href="/da/blog/vaelg-opskriftsapp/">Sådan vælger du en opskriftsapp</a>.')],
      ],
      iMatlyst: ['Sådan gemmer du en opskrift og planlægger ugen i Matlyst', p('Vælger du Matlyst, deler du et link eller et opslag fra Instagram, TikTok, YouTube eller en hjemmeside med Matlyst, eller du indsætter linket i appen. Læs kladden, før du gemmer, for det er AI, der læser opskriften, og den kan læse en mængde forkert. Læg derefter opskriften på en dag i madplanen, så havner ingredienserne på indkøbslisten.', 'Læs, <a href="/da/importer-opskrifter/">hvordan importen virker</a>, og <a href="/da/opskrifts-app/">hvad opskriftsappen kan</a>.')],
      steg: [['Tænk over, hvor dine opskrifter kommer fra', 'Hjemmesider, Instagram, TikTok eller kogebøger.'], ['Tjek enheder og sprog', 'Sørg for, at appen findes til din telefon og computer og på et sprog, du vil bruge.'], ['Prøv gratisversionen', 'Gem fem rigtige opskrifter, før du beslutter dig.']],
      faq: [
        ['Hvad er den bedste opskriftsapp?', 'Det afhænger af, hvad du har brug for. Gemmer du fra Instagram og TikTok, så se på Matlyst, ReciMe eller Recipe Keeper. Vil du have færdige opskrifter og en madplan hver uge, så se på Valdemarsro. Bruger du pc eller Mac, så se på Paprika eller Recipe Keeper.'],
        ['Findes der en gratis opskriftsapp?', 'Ja. Alle apps på siden er gratis at hente. Gratisversionerne har forskellige grænser, fx fem importer om ugen i ReciMe, fem om måneden i Matlyst og 50 opskrifter på én enhed i Paprika.'],
        ['Hvilke opskriftsapps findes på dansk?', 'Matlyst, Paprika, Recipe Keeper og Valdemarsro har dansk blandt sprogene i App Store. Det har ReciMe og Samsung Food ikke.'],
        ['Hvorfor er der ingen stjerner eller priser?', 'Bedømmelser og priser ændrer sig tit. Vi skriver kun det, vi kan finde på appens egen side i butikken eller på dens hjemmeside, med dato.'],
        NEUTRAL,
      ],
      cta: 'Prøv Matlyst med dine egne opskrifter',
    },
    handleliste: {
      title: 'Bedste indkøbsliste-app: seks apps sammenlignet',
      description: 'Hvilken indkøbsliste-app passer til din husstand? Seks apps sammenlignet på deling, gratisversion, sortering efter afdeling og lister ud fra opskrifter. Med kilde og dato.',
      h1: 'Bedste indkøbsliste-app: seks apps sammenlignet',
      lead: 'Her er seks apps til indkøbslister, du kan få i Danmark, sammenlignet ud fra det, appsene selv oplyser.',
      kategori: 'indkøbslisten',
      svar: 'Vil du bare have en gratis fælles liste, oplyser Bring! og Listonic, at listerne er gratis og kan deles. Handler du mest i én kæde, kan du dele listen i Netto+ og REMA 1000 og lægge varer fra ugens avis på den. Coop har indkøbslister til 365discount, SuperBrugsen, Brugsen og Kvickly. Vil du have listen lavet ud fra dine opskrifter og din madplan, så se på Matlyst.',
      valg: ul([
        '<strong>Du vil have en fælles liste gratis:</strong> Bring! og Listonic er gratis, og begge deler listen med husstanden.',
        '<strong>Du handler mest i én kæde:</strong> Coop, Netto+ og REMA 1000 har indkøbslister i deres egne apps, og du kan lægge tilbudsvarer på listen.',
        '<strong>Du vil have listen lavet ud fra opskrifter:</strong> Matlyst laver listen ud fra dine gemte opskrifter og madplanen. REMA 1000 giver en komplet indkøbsliste ud fra kædens egne opskrifter.',
        '<strong>Du vil se tilbud, mens du skriver listen:</strong> Bring! viser tilbud fra butikker i nærheden.',
        '<strong>Du holder øje med prisen:</strong> Listonic regner ud, hvad indkøbet koster.',
      ]),
      tabellFelt: ['plattformer', 'gratis', 'deling', 'handleliste'],
      kortFelt: ['plattformer', 'sprak', 'gratis', 'betalt', 'handleliste', 'deling', 'ukemeny', 'spiskammer', 'saerpreg'],
      best: {
        matlyst: 'vil have indkøbslisten direkte fra dine gemte opskrifter og madplanen og vil holde styr på spisekammeret.',
        bring: 'vil have en gratis fælles liste og tilbud fra butikker i nærheden.',
        coop: 'handler i 365discount, SuperBrugsen, Brugsen eller Kvickly og vil have listen og tilbuddene samlet.',
        listonic: 'vil have en gratis fælles liste, der virker offline og regner ud, hvad indkøbet koster.',
        netto: 'handler i Netto og vil dele listen og lægge varer fra Netto-avisen på den.',
        rema: 'handler i REMA 1000 og vil have en komplet indkøbsliste ud fra kædens opskrifter.',
      },
      ekstra: [
        ['Det, der adskiller appsene', p('Der er tre slags apps her. <strong>Liste-apps</strong> som Bring! og Listonic er bygget til at dele en liste hurtigt. <strong>Kædernes egne apps</strong>, som Coop, Netto+ og REMA 1000, kobler listen til tilbud i kæden. <strong>Opskriftsapps med indkøbsliste</strong>, som Matlyst, laver listen ud fra det, du vil lave.',
          'Matlyst har også en side om <a href="/da/indkoebsliste-app/">indkøbslisten, der kommer fra dine opskrifter</a>.')],
      ],
      iMatlyst: ['Sådan planlægger du ugen og handler med Matlyst', p('Vælger du Matlyst, lægger du opskrifter på dagene i madplanen og fører ugens ingredienser over på indkøbslisten. Listen er sorteret efter afdeling i butikken, og du kan tilføje dine egne varer.', 'Læs mere om <a href="/da/indkoebsliste-app/">indkøbslisten</a> og <a href="/da/madplan-app/">madplanen</a>.')],
      steg: [['Tænk over, hvem der handler', 'Kun dig, eller hele husstanden på én liste.'], ['Tænk over, hvor du handler', 'I én kæde, i flere butikker eller online.'], ['Vælg, hvordan listen bliver til', 'Skrevet i hånden, ud fra tilbud eller ud fra opskrifter.']],
      faq: [
        ['Hvad er den bedste indkøbsliste-app?', 'Det afhænger af, hvordan du handler. Til en gratis fælles liste kan du se på Bring! eller Listonic. Handler du mest i én kæde, så se på kædens app: Coop, Netto+ eller REMA 1000. Skal listen komme fra dine opskrifter, så se på Matlyst.'],
        ['Hvilken indkøbsliste kan familien dele?', 'Bring!, Listonic, Netto+ og REMA 1000 oplyser, at listen kan deles med andre. I Matlyst kræver deling med husstanden Matlyst Pro. For Coop er det ikke oplyst.'],
        ['Findes der en gratis indkøbsliste-app?', 'Ja. Alle apps på siden er gratis at hente. Bring! og Listonic oplyser, at listerne er gratis, og indkøbslisten i Matlyst er gratis. Bring!, Listonic og Netto+ viser reklamer.'],
        ['Hvilke apps sorterer listen efter afdeling?', 'Bring! og Listonic sorterer varerne efter butikkens afdelinger eller gange, og Matlyst sorterer listen efter afdeling i butikken.'],
        NEUTRAL,
      ],
      cta: 'Lav indkøbslisten ud fra dine opskrifter i Matlyst',
    },
    ukemeny: {
      title: 'Bedste madplan-app: syv apps sammenlignet',
      description: 'Hvilken madplan-app passer til din uge? Syv apps sammenlignet på gratisversion, indkøbsliste ud fra planen, deling og om appen laver planen for dig.',
      h1: 'Bedste madplan-app: syv apps sammenlignet',
      lead: 'Her er syv madplan-apps, du kan få i Danmark, sammenlignet ud fra det, appsene selv oplyser.',
      kategori: 'madplanen',
      svar: 'Vil du planlægge med dine egne opskrifter og få én indkøbsliste for ugen, gør Matlyst, Paprika, Plan to Eat og Recipe Keeper det. Vil du have en færdig madplan hver uge, laver Mambeno og Valdemarsro den for dig, og Mambeno bygger den ud fra ugens tilbud. Vil du have en plan ud fra dine egne opskrifter, oplyser Recipe Keeper, at den kan lave en tilfældig plan. Vil du have det gratis, er madplanen gratis i Matlyst og Samsung Food.',
      valg: ul([
        '<strong>Du planlægger med dine egne opskrifter:</strong> Matlyst, Paprika, Plan to Eat og Recipe Keeper lægger dine gemte opskrifter på dagene og fører ugen over på indkøbslisten.',
        '<strong>Du vil have en færdig madplan:</strong> Mambeno laver madplaner med ugens tilbud, og Valdemarsro har 3 madplaner hver uge med Premium. Samsung Food+ giver ugeplaner lavet med AI.',
        '<strong>Du vil have varerne leveret:</strong> Med Mambeno kan du få varerne leveret fra REMA 1000.',
        '<strong>Du planlægger rester og frosne måltider:</strong> Plan to Eat oplyser, at den kan begge dele.',
        '<strong>Du vil bruge den gratis:</strong> Madplanen er gratis i Matlyst og Samsung Food. Mambeno kan prøves gratis i 30 dage, Valdemarsro i 7 dage og Plan to Eat i 14 dage.',
      ]),
      tabellFelt: ['gratis', 'ukemeny', 'handleliste', 'deling'],
      kortFelt: ['plattformer', 'sprak', 'gratis', 'betalt', 'ukemeny', 'handleliste', 'deling', 'spiskammer', 'saerpreg'],
      best: {
        matlyst: 'planlægger ugen med opskrifter, du har gemt fra sociale medier og hjemmesider, og vil have madplan og indkøbsliste gratis.',
        mambeno: 'vil have en færdig madplan hver uge ud fra ugens tilbud og måske få varerne leveret.',
        paprika: 'vil planlægge pr. dag, uge eller måned og bruge appen på mange enheder.',
        plantoeat: 'planlægger med rester og frosne måltider og vil dele planen med familien.',
        recipekeeper: 'vil have en tilfældig plan ud fra dine egne opskrifter som udgangspunkt.',
        samsung: 'vil have ugeplaner lavet til dig (med Samsung Food+) og et stort opskriftsbibliotek.',
        valdemarsro: 'vil vælge mellem færdige madplaner hver uge og dele dem med husstanden.',
      },
      ekstra: [
        ['Planlægger du selv, eller gør appen?', p('Det er den største forskel. I de fleste af appsene vælger <strong>du</strong> måltiderne, og appen holder styr på dagene og indkøbslisten. Nogle <strong>laver planen</strong> for dig: Mambeno og Valdemarsro har færdige madplaner hver uge, og Samsung Food med Samsung Food+ og Recipe Keeper oplyser, at de kan lave en plan. Matlyst laver ikke planen for dig.',
          'Læs mere om <a href="/da/madplan-app/">madplanen i Matlyst</a>.')],
      ],
      iMatlyst: ['Sådan bliver ugen til en indkøbsliste i Matlyst', p('Vælger du Matlyst, lægger du de opskrifter, du har gemt, på dagene i madplanen. Derefter fører du ugens ingredienser over på indkøbslisten, som er sorteret efter afdeling i butikken.', 'Læs mere om <a href="/da/madplan-app/">madplanen</a> og <a href="/da/indkoebsliste-app/">indkøbslisten</a>.')],
      steg: [['Beslut, hvem der vælger måltiderne', 'Dig selv eller appen.'], ['Tjek indkøbslisten', 'Sørg for, at hele ugen bliver til én liste, du kan dele.'], ['Prøv en uge', 'Planlæg fem aftensmåltider, før du beslutter dig.']],
      faq: [
        ['Hvad er den bedste madplan-app?', 'Det afhænger af, om du vil planlægge selv. Med dine egne opskrifter kan du se på Matlyst, Paprika, Plan to Eat eller Recipe Keeper. Vil du have en færdig madplan hver uge, så se på Mambeno eller Valdemarsro. Planlægger du rester, så se på Plan to Eat.'],
        ['Findes der en gratis madplan-app?', 'Ja. Madplanen er gratis i Matlyst og Samsung Food. Mambeno, Valdemarsro og Plan to Eat har en gratis prøveperiode. Samsung Food oplyser, at ugeplaner lavet med AI kræver Samsung Food+.'],
        ['Laver Matlyst madplanen for mig?', 'Nej. Du vælger opskrifterne og lægger dem på dagene. Matlyst fører derefter ingredienserne over på én indkøbsliste.'],
        ['Kan familien dele madplanen?', 'Paprika (Premium), Plan to Eat, Valdemarsro (Premium) og Matlyst (Pro) oplyser, at planen kan deles. Recipe Keeper har en fælles opskriftssamling, og Samsung Food oplyser, at indkøbslister kan deles.'],
        NEUTRAL,
      ],
      cta: 'Planlæg ugen i Matlyst',
    },
  },
};

export const { DATA, AVSENDER, STIER, apperPaSide, kilderForApp, sider } = lagSammenligning(MARKED);
export { kortDato, langDato };

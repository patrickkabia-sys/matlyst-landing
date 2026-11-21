// Tre neutrala jämförelsesidor för Sverige (sv-SE): /sv/basta-receptapp/, /sv/basta-inkopslista-app/, /sv/basta-veckomeny-app/.
// Samma generator som de norska och engelska sidorna (sammenligning.mjs); här står bara den svenska marknaden: text, fältnamn och appval.
// Alla uppgifter och citat står i apper.sv.json, hämtade ur svenska App Store, Google Play (Sverige) och apparnas egna webbplatser 2026-11-21.
// kildekontroll.mjs sv kontrollerar att varje citat fortfarande står hos källan. Låst av test/sammenligning.test.mjs.
// Skrivet från meningen (matlyst-sprak, sv), inte översatt från de norska sidorna. Det som sägs om Matlyst följer de svenska
// appsidorna: metriska mängder som standard, recept på andra språk översätts till svenska, cups, uns och pund räknas om till dl och gram vid import.
import { lagSammenligning, p, ul } from './sammenligning.mjs';

const MANADER = ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'];
const langDato = (iso) => { const [a, m, d] = iso.split('-').map(Number); return `${d} ${MANADER[m - 1]} ${a}`; };
// Svensk kortform är ISO-datum.
const kortDato = (iso) => iso;
const och = (xs) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} och ${xs.at(-1)}` : xs[0] ?? '');
const NEUTRAL = ['Kan sidan vara neutral när Matlyst har gjort den?', 'Vi är part i saken, och det står överst. Därför länkar varje uppgift till sin källa och har ett datum, så att du kan kontrollera själv.'];

export const MARKED = {
  lang: 'sv',
  datafil: new URL('./apper.sv.json', import.meta.url),
  prefiks: '/sv/',
  avsender: 'Vi gör Matlyst, så vi är part i saken. Därför har allt här en källa och ett datum.',
  ikke: 'Uppges inte',
  stier: Object.freeze({ oppskrift: 'basta-receptapp/', handleliste: 'basta-inkopslista-app/', ukemeny: 'basta-veckomeny-app/' }),
  langDato, kortDato, liste: och,
  felt: {
    plattformer: 'Plattformar',
    sprak: 'Svenska i appen',
    gratis: 'Gratis',
    betalt: 'Betalt',
    nett: 'Import från webbsidor',
    sosiale: 'Import från sociala medier',
    ukemeny: 'Veckomeny',
    handleliste: 'Inköpslista',
    deling: 'Delning i hushållet',
    spiskammer: 'Skafferi',
    saerpreg: 'Bra att veta',
  },
  sideapper: {
    oppskrift: ['matlyst', 'arla', 'ica', 'paprika', 'recime', 'recipekeeper', 'samsung'],
    handleliste: ['matlyst', 'bring', 'coop', 'ica', 'listonic', 'willys'],
    ukemeny: ['matlyst', 'arla', 'paprika', 'plantoeat', 'recime', 'recipekeeper', 'samsung'],
  },
  tekst: {
    app: 'App',
    bestFor: 'Bäst för dig som',
    kilder: 'Källor',
    sjekket: 'kontrollerat',
    sjekketStor: 'Kontrollerat',
    eyebrow: 'Jämförelse',
    stegTittel: 'Så väljer du',
    faqTittel: 'Frågor och svar',
    hvem: 'Vem som har skrivit sidan',
    hvemTekst: (dato) => `Matlyst är en av apparna på sidan. Allt vi skriver om de andra apparna kommer från deras egna sidor i App Store och Google Play och från deras egna webbplatser, och korten länkar dit. Senast kontrollerat ${dato}.`,
    valg: 'Kort svar: välj efter vad du behöver',
    sammenligning: 'Sida vid sida',
    tabellIntro: 'Tabellen visar vad apparna själva uppger. Svep i sidled i tabellen för att se alla kolumner.',
    tabellTittel: 'Det apparna själva uppger',
    enForEn: 'Apparna en och en',
    slikValgte: 'Så valde vi',
    sidenavn: { oppskrift: 'receptappar', handleliste: 'appar för inköpslistor', ukemeny: 'appar för veckomeny' },
    andreSider: (lenker) => `Vi har också jämfört ${lenker} på samma sätt.`,
    slikValgteTekst: (kategori, dato) => p(
      `Vi tog med appar som finns i svenska App Store och där ${kategori} är en av huvudfunktionerna. De flesta finns också på Google Play. Urvalet är vårt eget, och en app som inte står här är inte sämre för det.`,
      `Alla uppgifter kommer från appens egen sida i App Store (Sverige), från Google Play (Sverige) och från appens egen webbplats. Vi kontrollerade dem den ${dato}. Varje kort länkar till källorna.`,
    ) + ul([
      '<strong>Bokstavsordning.</strong> Apparna står i bokstavsordning efter namn, och ordningen är ingen rankning.',
      '<strong>”Uppges inte”</strong> betyder att vi inte hittade det i källorna. Det betyder inte att appen saknar funktionen.',
      '<strong>Inga stjärnor eller betyg.</strong> De ändras från vecka till vecka och säger lite om vad som passar dig.',
      '<strong>Inga priser i kronor.</strong> Priserna ändras och kan skilja sig mellan App Store och Google Play. Du ser priset i butiken innan du köper.',
      '<strong>Svenska i appen</strong> betyder att svenska står bland språken på appens sida i App Store.',
      '<strong>Inga logotyper eller skärmbilder</strong> från andra appar. Namnen tillhör sina ägare, och Matlyst har ingen koppling till någon av dem.',
    ]) + p('Har vi fel, eller har en app ändrats? Mejla <a href="mailto:hei@matlyst-app.no">hei@matlyst-app.no</a>, så kontrollerar vi källan och rättar sidan.'),
  },
  // guidePage (generer-lokalsider.mjs) lägger själv till BreadcrumbList och bygger FAQPage av den synliga FAQ:n.
  skjemaer: ({ artikkel }) => [artikkel, 'faq'],
  sider: {
    oppskrift: {
      title: 'Bästa receptapp: sju appar jämförda',
      description: 'Vilken receptapp passar dig? Sju appar jämförda på svenska i appen, gratisversion, import från webbsidor och sociala medier, veckomeny och delning. Med källa och datum.',
      h1: 'Bästa receptapp: sju appar jämförda',
      lead: 'Här är sju receptappar som finns i Sverige, jämförda utifrån vad apparna själva uppger.',
      kategori: 'recepten',
      svar: 'Det finns ingen app som är bäst för alla. Sparar du recept från Instagram och TikTok uppger Matlyst, ReciMe och Recipe Keeper att de klarar det, och Paprika gör det med Premium. Av dem har Matlyst, Paprika och Recipe Keeper svenska i appen. Vill du ha samma app på dator och Android, titta på Paprika eller Recipe Keeper. Vill du ha färdiga recept att bläddra bland, är Arla Mat och ICA byggda för det. Samsung Food har ett stort bibliotek med offentliga recept.',
      valg: ul([
        '<strong>Du sparar från Instagram och TikTok:</strong> Matlyst, ReciMe och Recipe Keeper uppger att de importerar från båda. Paprika gör det med Premium.',
        '<strong>Du vill ha appen på svenska:</strong> Arla Mat, ICA, Matlyst, Paprika och Recipe Keeper har svenska bland språken i App Store.',
        '<strong>Du vill använda den gratis:</strong> ReciMe ger fem importer i veckan, Matlyst fem i månaden och Paprika upp till 50 recept på en enhet. Arla Mat och ICA är gratis att ladda ner.',
        '<strong>Du använder pc eller Mac:</strong> Paprika finns för Mac och Windows, och Recipe Keeper för pc och Mac.',
        '<strong>Du vill ha färdiga recept, inte bara dina egna:</strong> Arla Mat har över 6500 recept och ICA tusentals. Samsung Food har ett stort bibliotek med offentliga recept.',
        '<strong>Du vill planera veckan i samma app:</strong> Arla Mat, Matlyst, Paprika, ReciMe, Recipe Keeper och Samsung Food har en veckomeny eller måltidsplan.',
      ]),
      tabellFelt: ['plattformer', 'sprak', 'gratis', 'nett', 'sosiale', 'deling'],
      kortFelt: ['plattformer', 'sprak', 'gratis', 'betalt', 'nett', 'sosiale', 'ukemeny', 'handleliste', 'deling', 'saerpreg'],
      best: {
        matlyst: 'sparar recept från TikTok, Instagram, YouTube och webbsidor och vill ha veckomeny, inköpslista och skafferi i samma app, på svenska.',
        arla: 'vill bläddra bland många recept och få färdiga veckomenyer varje vecka.',
        ica: 'handlar på ICA och vill lägga recept och erbjudanden på en lista som sorteras efter din butik.',
        paprika: 'vill ha samma app på iPhone, Mac, Android och Windows och kunna laga mat offline.',
        recime: 'sparar mycket från Instagram, TikTok och Pinterest och vill ha gratis importer varje vecka.',
        recipekeeper: 'vill skanna recept från foton och PDF-filer, eller flytta över från en annan receptapp.',
        samsung: 'vill ha ett stort bibliotek med recept att bläddra i och en gratis veckoplan.',
      },
      ekstra: [
        ['Spara dina egna recept, eller hitta nya', p('De flesta apparna här är byggda för att <strong>spara dina egna recept</strong> från webbsidor, sociala medier och foton. Arla Mat och ICA är byggda kring <strong>sina egna recept</strong>, och Samsung Food har ett eget bibliotek att bläddra i.',
          'Resten skiljer sig mest i var du hittar dina recept, vilka enheter du använder och om du vill ha abonnemang. Vill du testa själv? Läs guiden <a href="/sv/blogg/valj-receptapp/">Så väljer du receptapp</a>.')],
      ],
      iMatlyst: ['Så sparar du ett recept och planerar veckan i Matlyst', p('Väljer du Matlyst delar du en länk eller ett inlägg från Instagram, TikTok, YouTube eller en webbsida med Matlyst, eller klistrar in länken i appen. Läs utkastet innan du sparar, för det är AI som läser receptet och den kan få en mängd fel. Lägg sedan receptet på en dag i veckomenyn, så hamnar ingredienserna på inköpslistan.', 'Läs <a href="/sv/importera-recept/">hur importen fungerar</a> och <a href="/sv/receptbok-app/">vad receptappen gör</a>.')],
      steg: [['Tänk på var dina recept kommer ifrån', 'Webbsidor, Instagram, TikTok eller kokböcker.'], ['Kolla enheter och språk', 'Se till att appen finns för din telefon och dator, och på ett språk du vill använda.'], ['Prova gratisversionen', 'Spara fem riktiga recept innan du bestämmer dig.']],
      faq: [
        ['Vilken är den bästa receptappen?', 'Det beror på vad du behöver. Sparar du från Instagram och TikTok, titta på Matlyst, ReciMe eller Recipe Keeper. Vill du ha många färdiga recept att välja bland, titta på Arla Mat eller ICA. På pc eller Mac, titta på Paprika eller Recipe Keeper.'],
        ['Finns det en gratis receptapp?', 'Ja. Alla appar på sidan är gratis att ladda ner. Gratisversionerna har olika gränser, till exempel fem importer i veckan i ReciMe, fem i månaden i Matlyst och 50 recept på en enhet i Paprika.'],
        ['Vilka receptappar finns på svenska?', 'Arla Mat, ICA, Matlyst, Paprika och Recipe Keeper har svenska bland språken i App Store. ReciMe och Samsung Food har det inte.'],
        ['Varför finns det inga stjärnor eller priser?', 'Betyg och priser ändras ofta. Vi skriver bara det vi kan visa på appens egen sida i butiken eller på dess webbplats, med datum.'],
        NEUTRAL,
      ],
      cta: 'Prova Matlyst med dina egna recept',
    },
    handleliste: {
      title: 'Bästa appen för inköpslistor: sex appar jämförda',
      description: 'Vilken app för inköpslistan passar ditt hushåll? Sex appar jämförda på delning, gratisversion, sortering efter avdelning och listor från recept. Med källa och datum.',
      h1: 'Bästa appen för inköpslistor: sex appar jämförda',
      lead: 'Här är sex appar för inköpslistor som finns i Sverige, jämförda utifrån vad apparna själva uppger.',
      kategori: 'inköpslistan',
      svar: 'Vill du bara ha en gratis delad lista, uppger Bring! och Listonic att listorna är gratis och kan delas. Handlar du mest i en kedja, låter ICA och Willys dig dela listan med hushållet, och ICA sorterar den efter din butik. Coop har en inköpslista i appen. Vill du att listan ska komma från dina recept och din veckomeny, titta på Matlyst.',
      valg: ul([
        '<strong>Du vill ha en delad lista gratis:</strong> Bring! och Listonic är gratis, och båda delar listan med hushållet.',
        '<strong>Du handlar mest på Coop, ICA eller Willys:</strong> Kedjornas egna appar har inköpslistor och erbjudanden. ICA sorterar listan efter din ICA-butik, och i Coop och Willys kan du också handla online.',
        '<strong>Du vill att listan ska komma från recept:</strong> Matlyst gör listan av dina sparade recept och veckomenyn. I ICA kan du lägga hela recept på listan.',
        '<strong>Du vill ha erbjudanden på listan:</strong> ICA och Willys låter dig lägga erbjudanden på listan.',
        '<strong>Du håller koll på vad det kostar:</strong> Listonic räknar ut vad inköpen kostar.',
      ]),
      tabellFelt: ['plattformer', 'gratis', 'deling', 'handleliste'],
      kortFelt: ['plattformer', 'sprak', 'gratis', 'betalt', 'handleliste', 'deling', 'ukemeny', 'spiskammer', 'saerpreg'],
      best: {
        matlyst: 'vill att inköpslistan ska komma direkt från dina sparade recept och veckomenyn, och vill ha koll på skafferiet.',
        bring: 'vill ha en gratis delad lista med kategorier som följer butikens gångar.',
        coop: 'handlar på Coop och vill ha inköpslistan, erbjudandena och e-handeln i samma app.',
        ica: 'handlar på ICA och vill ha en delad lista som sorteras efter din butik.',
        listonic: 'vill ha en gratis delad lista som fungerar utan internet och räknar ut vad inköpen kostar.',
        willys: 'handlar på Willys och vill dela listan med hushållet och lägga erbjudanden på den.',
      },
      ekstra: [
        ['Listappar, butikernas egna appar och receptappar', p('Här finns tre slags appar. <strong>Listappar</strong> som Bring! och Listonic är byggda för att dela en lista snabbt. <strong>Butikernas egna appar</strong>, som Coop, ICA och Willys, kopplar listan till erbjudanden och handel i kedjan. <strong>Receptappar med inköpslista</strong>, som Matlyst, bygger listan på det du tänker laga.',
          'Matlyst har också en egen sida om <a href="/sv/inkopslista/">inköpslistan som kommer från dina recept</a>.')],
      ],
      iMatlyst: ['Så planerar du veckan och handlar med Matlyst', p('Väljer du Matlyst lägger du recept på dagarna i veckomenyn och för över veckans ingredienser till inköpslistan. Listan är sorterad efter butikens avdelningar, och du kan lägga till egna varor.', 'Läs mer om <a href="/sv/inkopslista/">inköpslistan</a> och <a href="/sv/veckomeny-app/">veckomenyn</a>.')],
      steg: [['Tänk på vem som handlar', 'Bara du, eller hela hushållet på samma lista.'], ['Tänk på var du handlar', 'I en kedja, i flera butiker eller online.'], ['Välj hur listan blir till', 'Skriven för hand, från erbjudanden eller från recept.']],
      faq: [
        ['Vilken är den bästa appen för inköpslistor?', 'Det beror på hur du handlar. För en gratis delad lista, titta på Bring! eller Listonic. Handlar du mest i en kedja, titta på kedjans app: Coop, ICA eller Willys. Ska listan komma från dina recept, titta på Matlyst.'],
        ['Vilken inköpslista kan familjen dela?', 'Bring!, ICA, Listonic och Willys uppger att listan kan delas med andra. I Matlyst kräver delning med hushållet Matlyst Pro. För Coop uppges det inte.'],
        ['Finns det en gratis app för inköpslistor?', 'Ja. Alla appar på sidan är gratis att ladda ner. Bring! och Listonic uppger att listorna är gratis, och inköpslistan i Matlyst är gratis. Bring! och Listonic visar reklam.'],
        ['Vilka appar sorterar listan efter avdelning?', 'Bring! och Listonic grupperar varorna efter butikens gångar eller avdelningar, och ICA sorterar listan efter din ICA-butik. Matlyst sorterar listan efter butikens avdelningar.'],
        NEUTRAL,
      ],
      cta: 'Gör inköpslistan av dina recept i Matlyst',
    },
    ukemeny: {
      title: 'Bästa app för veckomeny: sju matplanerare jämförda',
      description: 'Vilken matplanerare passar din vecka? Sju appar för veckomeny jämförda på gratisversion, inköpslista från planen, delning och om appen planerar åt dig.',
      h1: 'Bästa app för veckomeny: sju matplanerare jämförda',
      lead: 'Här är sju appar för veckomeny som finns i Sverige, jämförda utifrån vad apparna själva uppger.',
      kategori: 'veckomenyn',
      svar: 'Vill du planera med dina egna recept och få en inköpslista för veckan, gör Matlyst, Paprika, Plan to Eat och Recipe Keeper det. Vill du ha färdiga veckomenyer, ger Arla Mat två varje vecka. Vill du att appen gör planen, uppger Samsung Food (med Samsung Food+) och Recipe Keeper att de kan det. Planerar du med rester, uppger Plan to Eat att den klarar det. Vill du ha det gratis, är veckomenyn gratis i Matlyst, ReciMe och Samsung Food, och Arla Mat är gratis att ladda ner.',
      valg: ul([
        '<strong>Du planerar med dina egna recept:</strong> Matlyst, Paprika, Plan to Eat och Recipe Keeper lägger dina sparade recept på dagarna och för över veckan till inköpslistan.',
        '<strong>Du vill ha färdiga menyer:</strong> Arla Mat ger två färdiga veckomenyer varje vecka, och i Min Matsedel gör du egna.',
        '<strong>Du vill att appen gör planen:</strong> Samsung Food+ ger veckoplaner gjorda med AI. Recipe Keeper kan göra en slumpad plan utifrån dina önskemål.',
        '<strong>Du planerar rester och fryst mat:</strong> Plan to Eat uppger att den klarar båda.',
        '<strong>Du planerar frukost och lunch också:</strong> ReciMe delar upp planen i frukost, lunch och middag, och Paprika planerar per dag, vecka eller månad.',
        '<strong>Du vill använda den gratis:</strong> Veckomenyn är gratis i Matlyst, ReciMe och Samsung Food, och Arla Mat är gratis att ladda ner. Plan to Eat har 14 dagars gratis provperiod.',
      ]),
      tabellFelt: ['gratis', 'ukemeny', 'handleliste', 'deling'],
      kortFelt: ['plattformer', 'sprak', 'gratis', 'betalt', 'ukemeny', 'handleliste', 'deling', 'spiskammer', 'saerpreg'],
      best: {
        matlyst: 'planerar veckan med recept du har sparat från sociala medier och webbsidor, och vill ha veckomeny och inköpslista gratis.',
        arla: 'vill ha färdiga veckomenyer att utgå från och laga efter.',
        paprika: 'vill planera per dag, vecka eller månad och använda appen på många enheter.',
        plantoeat: 'planerar med rester och fryst mat och vill dela planen med familjen.',
        recime: 'vill ha en gratis måltidsplan för frukost, lunch och middag.',
        recipekeeper: 'vill ha en slumpad plan av dina egna recept som utgångspunkt.',
        samsung: 'vill få veckoplaner gjorda åt dig (med Samsung Food+) och ett stort receptbibliotek.',
      },
      ekstra: [
        ['Planerar du själv, eller gör appen det?', p('Det är den största skillnaden. I de flesta apparna väljer <strong>du</strong> måltiderna, och appen håller ordning på dagarna och inköpslistan. Några kan också <strong>göra planen</strong> åt dig: Arla Mat har färdiga veckomenyer, och Samsung Food med Samsung Food+ och Recipe Keeper uppger att de kan planera. Matlyst gör inte planen åt dig.',
          'Läs mer om <a href="/sv/veckomeny-app/">veckomenyn i Matlyst</a>.')],
      ],
      iMatlyst: ['Så blir veckan en inköpslista i Matlyst', p('Väljer du Matlyst lägger du recepten du har sparat på dagarna i veckomenyn. Sedan för du över veckans ingredienser till inköpslistan, som är sorterad efter butikens avdelningar.', 'Läs mer om <a href="/sv/veckomeny-app/">veckomenyn</a> och <a href="/sv/inkopslista/">inköpslistan</a>.')],
      steg: [['Bestäm vem som väljer måltiderna', 'Du själv, eller appen.'], ['Kolla inköpslistan', 'Se till att hela veckan blir en lista som du kan dela.'], ['Prova en vecka', 'Planera fem middagar innan du bestämmer dig.']],
      faq: [
        ['Vilken är den bästa appen för veckomeny?', 'Det beror på om du vill planera själv. Med dina egna recept, titta på Matlyst, Paprika, Plan to Eat eller Recipe Keeper. Vill du ha färdiga menyer, titta på Arla Mat. Vill du att appen gör planen, titta på Samsung Food+ eller Recipe Keeper.'],
        ['Finns det en gratis matplanerare?', 'Ja. Veckomenyn är gratis i Matlyst, ReciMe och Samsung Food, och Arla Mat är gratis att ladda ner. Samsung Food uppger att veckoplaner gjorda med AI kräver Samsung Food+.'],
        ['Gör Matlyst veckomenyn åt mig?', 'Nej. Du väljer recepten och lägger dem på dagarna. Matlyst för sedan över ingredienserna till en inköpslista.'],
        ['Kan familjen dela veckomenyn?', 'Paprika (Premium), Plan to Eat, Recipe Keeper och Matlyst (Pro) uppger att planen eller recepten kan delas. Samsung Food uppger att inköpslistor kan delas.'],
        NEUTRAL,
      ],
      cta: 'Planera veckan i Matlyst',
    },
  },
};

export const { DATA, AVSENDER, STIER, apperPaSide, kilderForApp, sider } = lagSammenligning(MARKED);
export { kortDato, langDato };

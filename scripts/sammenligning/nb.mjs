// Tre nøytrale sammenligningssider (nb): /beste-oppskriftsapp/, /beste-handleliste-app/ og /beste-ukemeny-app/.
// Generatoren er felles (sammenligning.mjs); her står bare det norske markedet: tekst, feltnavn og appvalg.
// Faktaene og sitatene står i apper.nb.json; kildekontroll.mjs sjekker at hvert sitat fortsatt står hos kilden.
// Tekst om «best for» bygger bare på faktaene i datafila. Låst av test/sammenligning.test.mjs.
import { brodsmuler } from '../familier/skjema.mjs';
import { lagSammenligning, p, ul } from './sammenligning.mjs';

const MAANEDER = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'];
const delt = (iso) => iso.split('-').map(Number);
const langDato = (iso) => { const [a, m, d] = delt(iso); return `${d}. ${MAANEDER[m - 1]} ${a}`; };
const kortDato = (iso) => { const [a, m, d] = delt(iso); return `${String(d).padStart(2, '0')}.${String(m).padStart(2, '0')}.${a}`; };
const og = (xs) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} og ${xs.at(-1)}` : xs[0] ?? '');

export const MARKED = {
  lang: 'nb',
  datafil: new URL('./apper.nb.json', import.meta.url),
  prefiks: '/',
  avsender: 'Vi lager Matlyst, så vi er part i saken. Derfor står alt med kilde og dato.',
  ikke: 'Ikke oppgitt',
  stier: Object.freeze({ oppskrift: 'beste-oppskriftsapp/', handleliste: 'beste-handleliste-app/', ukemeny: 'beste-ukemeny-app/' }),
  langDato, kortDato, liste: og,
  felt: {
    plattformer: 'Plattformer',
    norsk: 'Norsk i appen',
    gratis: 'Gratis',
    betalt: 'Betalt',
    nett: 'Import fra nettsider',
    sosiale: 'Import fra sosiale medier',
    ukemeny: 'Ukemeny',
    handleliste: 'Handleliste',
    deling: 'Deling i husstanden',
    spiskammer: 'Spiskammer',
    saerpreg: 'Ellers verdt å vite',
  },
  sideapper: {
    oppskrift: ['matlyst', 'paprika', 'recime', 'samsung', 'recipekeeper', 'crouton', 'matprat'],
    handleliste: ['matlyst', 'bring', 'listonic', 'anylist', 'rema', 'coop', 'oda'],
    ukemeny: ['matlyst', 'paprika', 'samsung', 'anylist', 'plantoeat', 'recipekeeper', 'meny'],
  },
  tekst: {
    app: 'App',
    bestFor: 'Best for deg som',
    kilder: 'Kilder',
    sjekket: 'sjekket',
    sjekketStor: 'Sjekket',
    eyebrow: 'Sammenligning',
    stegTittel: 'Slik velger du',
    faqTittel: 'Spørsmål og svar',
    hvem: 'Hvem som har skrevet siden',
    hvemTekst: (dato) => `Matlyst er en av appene på denne siden. Alt vi skriver om de andre appene, er hentet fra deres egen oppføring i App Store og Google Play og fra deres egen nettside, og kortene lenker dit. Sist sjekket ${dato}.`,
    valg: 'Kort svar: velg etter behov',
    sammenligning: 'Sammenligning',
    tabellIntro: 'Tabellen viser det appene selv oppgir. Sveip sidelengs i tabellen for å se alle kolonnene.',
    tabellTittel: 'Det appene selv oppgir',
    enForEn: 'Appene én for én',
    slikValgte: 'Slik valgte vi',
    sidenavn: { oppskrift: 'oppskriftsapper', handleliste: 'handlelisteapper', ukemeny: 'ukemeny-apper' },
    andreSider: (lenker) => `Vi har også sammenlignet ${lenker} på samme måte.`,
    slikValgteTekst: (kategori, dato) => p(
      `Vi tok med apper som finnes i den norske App Store, og som har ${kategori} som en av hovedfunksjonene. De fleste finnes også på Google Play. Vi har valgt dem etter skjønn, og en app som ikke står her, er ikke dårligere av den grunn.`,
      `Alle faktaene er hentet fra appens egen oppføring i App Store (norsk butikk), fra Google Play (Norge) og fra appens egen nettside. Vi sjekket dem ${dato}. Hvert kort lenker til kildene.`,
    ) + ul([
      '<strong>Alfabetisk rekkefølge.</strong> Appene står etter navn, og rekkefølgen er ingen rangering.',
      '<strong>«Ikke oppgitt»</strong> betyr at vi ikke fant det i kildene. Det betyr ikke at appen mangler funksjonen.',
      '<strong>Ingen stjerner eller vurderinger.</strong> De endrer seg fra uke til uke, og de sier lite om hva som passer deg.',
      '<strong>Ingen priser i kroner.</strong> Prisene endrer seg og kan være ulike i App Store og på Google Play. Du ser prisen i butikken før du kjøper.',
      '<strong>Norsk i appen</strong> betyr at norsk bokmål står blant språkene i App Store-oppføringen.',
      '<strong>Ingen logoer eller skjermbilder</strong> fra andre apper. Navnene tilhører eierne, og Matlyst er ikke tilknyttet noen av dem.',
    ]) + p('Har vi tatt feil, eller har en app endret seg? Skriv til <a href="mailto:hei@matlyst-app.no">hei@matlyst-app.no</a>, så sjekker vi kilden og retter siden.'),
  },
  // Norske sider bygges av generer-norske-importguider.mjs, som tar hele skjemalista fra siden (brødsmuler og Article).
  skjemaer: ({ sti, h1, artikkel }) => [brodsmuler([{ navn: 'Forside', adresse: '/' }, { navn: h1, adresse: `/${sti}` }]), artikkel],
  sider: {
    oppskrift: {
      title: 'Beste oppskriftsapp: sju apper sammenlignet',
      description: 'Hvilken oppskriftsapp passer deg? Sju apper sammenlignet på norsk språk, gratisversjon, import fra nettsider og sosiale medier, ukemeny og deling. Med kilde og dato.',
      h1: 'Beste oppskriftsapp: sju apper sammenlignet',
      lead: 'Her er sju oppskriftsapper du får i Norge, sammenlignet på det appene selv oppgir.',
      kategori: 'lagring av oppskrifter',
      svar: 'Det finnes ingen app som er best for alle. Vil du lagre fra Instagram og TikTok, oppgir Matlyst, ReciMe og Recipe Keeper det. Av dem har Matlyst og Recipe Keeper norsk i appen. Vil du ha samme app på PC, Mac og Android, se på Paprika eller Recipe Keeper. Bruker du bare Apple-enheter, er Crouton laget for dem. Vil du ha ferdige norske oppskrifter, er Matprat-appen et naturlig valg.',
      valg: ul([
        '<strong>Du lagrer fra Instagram og TikTok:</strong> Matlyst, ReciMe og Recipe Keeper oppgir import fra begge. Paprika gjør det med Premium.',
        '<strong>Du vil ha appen på norsk:</strong> Matlyst, Paprika, Recipe Keeper og Matprat har norsk bokmål i App Store. Matlyst oppgir i tillegg at utenlandske oppskrifter oversettes til norsk og at målene regnes om til metrisk.',
        '<strong>Du vil bruke den gratis:</strong> ReciMe oppgir fem importer per uke, Matlyst fem per måned, og Paprika lar deg lagre opptil 50 oppskrifter på én enhet.',
        '<strong>Du bruker PC eller Windows:</strong> Paprika og Recipe Keeper oppgir begge Windows eller PC.',
        '<strong>Du bruker bare Apple-enheter:</strong> Crouton finnes for iPhone, iPad, Mac, Apple Vision og Apple Watch.',
        '<strong>Du vil finne nye norske oppskrifter, ikke lagre egne:</strong> Matprat-appen har Matprats egne oppskrifter, mange med video.',
      ]),
      tabellFelt: ['plattformer', 'norsk', 'gratis', 'nett', 'sosiale', 'deling'],
      kortFelt: ['plattformer', 'norsk', 'gratis', 'betalt', 'nett', 'sosiale', 'ukemeny', 'handleliste', 'deling', 'saerpreg'],
      best: {
        matlyst: 'lagrer fra TikTok, Instagram og nettsider og vil ha oppskriftene på norsk med metriske mål.',
        paprika: 'vil ha samme app på iPhone, Mac, Android og Windows, og lagrer mange oppskrifter.',
        recime: 'lagrer mye fra sosiale medier og vil ha flest gratis importer.',
        samsung: 'vil finne nye oppskrifter i et stort bibliotek og planlegge gratis.',
        recipekeeper: 'vil skanne oppskrifter fra bilder og PDF, eller flytte fra en annen oppskriftsapp.',
        crouton: 'bare bruker Apple-enheter og vil lage mat ett steg om gangen.',
        matprat: 'vil ha ferdige norske oppskrifter med video og trinnbilder.',
      },
      ekstra: [
        ['Hva oppskriftsappene gjør ulikt', p('Appene løser to ulike ting. De fleste her er laget for å <strong>lagre dine egne oppskrifter</strong> fra nettsider, sosiale medier og bilder. Matprat-appen er først og fremst laget for å <strong>finne oppskrifter</strong> fra Matprat. Samsung Food gjør litt av begge deler.',
          'Det som skiller lagre-appene mest, er hvor du finner oppskriftene, om du vil ha dem på norsk, og hvor mange enheter du bruker. Vil du teste selv, se <a href="/blogg/velg-oppskriftsapp/">ti ting å se etter i en oppskriftsapp</a>.')],
      ],
      iMatlyst: ['Slik lagrer du en oppskrift i Matlyst', p('Velger du Matlyst, gjør du slik: del en lenke eller et innlegg fra Instagram, TikTok, YouTube eller en nettside til Matlyst, eller lim inn lenken i appen. Les over utkastet før du lagrer, fordi KI leser oppskriften og kan ta feil av en mengde.', 'Se <a href="/importer-oppskrifter/">slik importerer du oppskrifter</a> og <a href="/oppskriftsbok-app/">hva oppskriftsappen gjør</a>.')],
      steg: [['Tenk på hvor du finner oppskriftene', 'Nettsider, Instagram, TikTok eller kokebøker.'], ['Sjekk språk og enheter', 'Norsk i appen, og om den finnes på telefonen og PC-en din.'], ['Prøv gratisversjonen', 'Lagre fem ekte oppskrifter før du bestemmer deg.']],
      faq: [
        ['Hva er den beste oppskriftsappen?', 'Det kommer an på hva du trenger. Lagrer du fra Instagram og TikTok og vil ha norsk, se på Matlyst eller Recipe Keeper. Vil du ha flest gratis importer, se på ReciMe. Bruker du PC eller Windows, se på Paprika eller Recipe Keeper. Vil du ha ferdige norske oppskrifter, se på Matprat-appen.'],
        ['Finnes det en gratis oppskriftsapp?', 'Ja. Alle appene på siden kan lastes ned gratis. Gratisversjonene har ulike grenser, for eksempel fem importer per uke i ReciMe, fem per måned i Matlyst og 50 oppskrifter på én enhet i Paprika.'],
        ['Hvilke oppskriftsapper er på norsk?', 'Matlyst, Paprika, Recipe Keeper og Matprat har norsk bokmål blant språkene i App Store. ReciMe, Samsung Food og Crouton har det ikke.'],
        ['Hvorfor står det ingen stjerner eller priser?', 'Stjerner og priser endrer seg ofte. Vi skriver bare det vi kan vise til i appens egen oppføring eller nettside, med dato.'],
        ['Er siden nøytral når Matlyst har laget den?', 'Vi er part i saken, og det står øverst. Derfor har hvert faktum en lenke til kilden og en dato, så du kan sjekke selv.'],
      ],
      cta: 'Prøv Matlyst med dine egne oppskrifter',
    },

    handleliste: {
      title: 'Beste handleliste-app: sju apper sammenlignet',
      description: 'Hvilken handleliste-app passer dere? Sju apper sammenlignet på deling i familien, norsk språk, gratisversjon, sortering etter hylle og handleliste fra oppskrifter. Med kilde og dato.',
      h1: 'Beste handleliste-app: sju apper sammenlignet',
      lead: 'Her er sju handleliste-apper du får i Norge, sammenlignet på det appene selv oppgir.',
      kategori: 'handleliste',
      svar: 'Vil dere bare dele en enkel liste gratis, er Bring! og Listonic laget for det, og begge er på norsk. Handler dere fast i én kjede, har REMA 1000-appen og Coop-appen egne handlelister. Handler dere på nett, har Oda handleliste i appen. Vil du at lista skal lages fra oppskriftene og ukemenyen, se på Matlyst eller AnyList.',
      valg: ul([
        '<strong>Dere vil dele én liste i familien, gratis:</strong> Bring! og Listonic oppgir begge gratis deling. AnyList oppgir at å lage og dele lister er gratis.',
        '<strong>Dere handler mest i én kjede:</strong> REMA 1000-appen og Coop-appen har handleliste som kan deles med familien, sammen med bonus, kuponger og tilbud.',
        '<strong>Dere handler på nett:</strong> Oda har egne handlelister i appen og leverer varene hjem.',
        '<strong>Lista skal lages fra oppskriftene:</strong> Matlyst lager lista fra oppskriftene og ukemenyen. AnyList gjør det også, og ukemenyen der krever AnyList Complete. Bring! kan hente ingrediensene fra oppskrifter på nettsider.',
        '<strong>Du vil se tilbud mens du skriver lista:</strong> Bring! viser tilbud fra butikker i nærheten. Coop-appen lar deg legge varer fra kuponger og kundeavisen rett i lista.',
      ]),
      tabellFelt: ['plattformer', 'norsk', 'gratis', 'deling', 'handleliste'],
      kortFelt: ['plattformer', 'norsk', 'gratis', 'betalt', 'handleliste', 'deling', 'nett', 'ukemeny', 'spiskammer', 'saerpreg'],
      best: {
        matlyst: 'vil at handlelista skal lages fra oppskriftene og ukemenyen, og vil holde oversikt over spiskammeret.',
        bring: 'vil dele en enkel liste gratis med hele husstanden og se tilbud i nærheten.',
        listonic: 'vil dele lister gratis på mange enheter og holde oversikt over hva handelen koster.',
        anylist: 'vil ha lister og oppskrifter i samme app, og ikke trenger appen på norsk.',
        rema: 'handler mest på REMA 1000 og vil ha lista sammen med bonus og priskutt.',
        coop: 'er Coop-medlem og vil legge varer fra kuponger og kundeavisen rett i lista.',
        oda: 'handler dagligvarer på nett og vil få varene levert hjem.',
      },
      ekstra: [
        ['Hva handleliste-appene gjør ulikt', p('Det finnes tre slags handleliste-apper her. <strong>Rene listeapper</strong>, som Bring! og Listonic, er laget for å dele lister raskt. <strong>Kjedeappene</strong> fra REMA 1000, Coop og Oda har lista sammen med medlemskap, tilbud eller netthandel. <strong>Oppskriftsapper med handleliste</strong>, som Matlyst og AnyList, lager lista fra det du skal lage.',
          'Matlyst har også en egen side om <a href="/handleliste/">handlelista som lages fra oppskriftene</a>.')],
      ],
      iMatlyst: ['Slik planlegger du uka og handler i Matlyst', p('Velger du Matlyst, legger du oppskriftene på dagene i ukemenyen og sender hele uka til handlelista med ett trykk. Lista er sortert etter hvor varene står i butikken, og du kan legge til egne varer.', 'Les mer om <a href="/handleliste/">handlelista</a> og <a href="/ukemeny/">ukemenyen</a>.')],
      steg: [['Tenk på hvem som handler', 'Én person, eller hele husstanden som deler lista.'], ['Tenk på hvor dere handler', 'Én kjede, flere butikker eller på nett.'], ['Velg hvordan lista lages', 'Skrevet for hånd, fra tilbud eller fra oppskrifter.']],
      faq: [
        ['Hva er den beste handleliste-appen?', 'Det kommer an på hvordan dere handler. Vil dere dele en enkel liste gratis, passer Bring! eller Listonic. Handler dere i én kjede, har kjedeappen ofte handleliste. Skal lista lages fra oppskrifter, se på Matlyst eller AnyList.'],
        ['Hvilken handleliste-app kan vi dele i familien?', 'Alle disse oppgir deling: Bring!, Listonic, AnyList, REMA 1000-appen og Coop-appen. I Matlyst krever deling i husstanden Matlyst Pro. For Oda fant vi ikke deling oppgitt.'],
        ['Finnes det en gratis handleliste-app?', 'Ja. Alle appene på siden kan lastes ned gratis. Bring! og Listonic oppgir at grunnfunksjonene er gratis, og handlelista i Matlyst er gratis.'],
        ['Hvilke handleliste-apper er på norsk?', 'Matlyst, Bring!, Listonic, REMA 1000, Coop og Oda har norsk bokmål blant språkene i App Store. AnyList har engelsk og tysk.'],
        ['Er siden nøytral når Matlyst har laget den?', 'Vi er part i saken, og det står øverst. Derfor har hvert faktum en lenke til kilden og en dato, så du kan sjekke selv.'],
      ],
      cta: 'Lag handlelista fra oppskriftene i Matlyst',
    },

    ukemeny: {
      title: 'Beste ukemeny-app og middagsplanlegger',
      description: 'Hvilken middagsplanlegger passer dere? Sju ukemeny-apper sammenlignet på norsk språk, gratisversjon, handleliste fra uka, deling og om appen lager planen for deg. Med kilde og dato.',
      h1: 'Beste ukemeny-app: sju middagsplanleggere sammenlignet',
      lead: 'Her er sju apper for ukemeny og middagsplanlegging du får i Norge, sammenlignet på det appene selv oppgir.',
      kategori: 'ukemeny eller måltidsplan',
      svar: 'Vil du planlegge med dine egne oppskrifter og få handlelista for uka på norsk, passer Matlyst eller Paprika. Vil du at appen skal lage planen for deg, oppgir Samsung Food (med Samsung Food+) og Recipe Keeper det. Planlegger du rester, oppgir Plan to Eat det. Handler du hos MENY, har MENY-appen ukemeny med middagstips.',
      valg: ul([
        '<strong>Du planlegger med egne oppskrifter:</strong> Matlyst, Paprika, Plan to Eat og Recipe Keeper legger dine lagrede oppskrifter på dagene og sender uka til handlelista. AnyList gjør det samme med AnyList Complete.',
        '<strong>Du vil at appen lager planen:</strong> Samsung Food+ oppgir ukeplaner laget med KI. Recipe Keeper kan lage en tilfeldig plan ut fra hint du gir.',
        '<strong>Du vil ha den på norsk:</strong> Matlyst, Paprika, Recipe Keeper og MENY har norsk bokmål i App Store.',
        '<strong>Du vil planlegge rester og frosne måltider:</strong> Plan to Eat oppgir begge deler.',
        '<strong>Du handler hos MENY:</strong> MENY-appen har middagstips med ukemeny, og favorittoppskrifter kan legges rett i handlevognen.',
        '<strong>Du vil bruke den gratis:</strong> Ukemenyen er gratis i Matlyst, og Paprika merker ikke ukemenyen som Premium. I AnyList krever ukemenyen AnyList Complete, og Plan to Eat har en prøveperiode på 14 dager.',
      ]),
      tabellFelt: ['norsk', 'gratis', 'ukemeny', 'handleliste', 'deling'],
      kortFelt: ['plattformer', 'norsk', 'gratis', 'betalt', 'ukemeny', 'handleliste', 'deling', 'spiskammer', 'saerpreg'],
      best: {
        matlyst: 'planlegger uka med oppskrifter du har lagret fra nettet og sosiale medier, og vil ha handlelista på norsk.',
        paprika: 'vil planlegge for dag, uke eller måned og bruke appen på mange enheter.',
        samsung: 'vil ha ukeplaner laget for deg (med Samsung Food+) og et stort bibliotek med oppskrifter.',
        anylist: 'vil ha ukemeny og handleliste i samme app, og ikke trenger appen på norsk.',
        plantoeat: 'planlegger rester og frosne måltider, og deler planen med familien.',
        recipekeeper: 'vil ha en tilfeldig plan som utgangspunkt, laget av dine egne oppskrifter.',
        meny: 'handler hos MENY og vil ha middagstips rett i handleappen.',
      },
      ekstra: [
        ['Planlegger du selv, eller skal appen gjøre det?', p('Det er det største skillet. I de fleste appene her velger <strong>du</strong> middagene, og appen holder orden på dagene og handlelista. Noen kan også <strong>lage planen</strong> for deg: Samsung Food med Samsung Food+ og Recipe Keeper oppgir det. Matlyst lager ikke planen for deg.',
          'Vil du ha et ferdig utgangspunkt uten app, finnes det <a href="/ukemenyer/">ferdige ukemenyer med handleliste</a> her på nettstedet. Les mer om <a href="/ukemeny/">ukemenyen i Matlyst</a>.')],
      ],
      iMatlyst: ['Slik lager du handlelista fra uka i Matlyst', p('Velger du Matlyst, legger du oppskriftene du har lagret på dagene i ukemenyen. Så sender du hele uka til handlelista med ett trykk, og lista er sortert etter hvor varene står i butikken.', 'Les mer om <a href="/ukemeny/">ukemenyen</a> og <a href="/handleliste/">handlelista</a>.')],
      steg: [['Bestem hvem som velger middagene', 'Du selv, eller appen.'], ['Sjekk handlelista', 'At hele uka blir én liste du kan dele.'], ['Prøv én uke', 'Planlegg fem middager før du bestemmer deg.']],
      faq: [
        ['Hva er den beste ukemeny-appen?', 'Det kommer an på om du vil planlegge selv. Med egne oppskrifter og norsk språk, se på Matlyst eller Paprika. Vil du at appen lager planen, se på Samsung Food+ eller Recipe Keeper. Handler du hos MENY, har MENY-appen ukemeny.'],
        ['Finnes det en gratis middagsplanlegger?', 'Ja. Ukemenyen er gratis i Matlyst, og Paprika merker ikke ukemenyen som Premium. Samsung Food oppgir at planlegging er gratis, mens ukeplaner laget med KI krever Samsung Food+.'],
        ['Lager Matlyst ukemenyen for meg?', 'Nei. Du velger oppskriftene og legger dem på dagene. Matlyst sender ingrediensene til én handleliste.'],
        ['Kan vi dele ukemenyen i familien?', 'Paprika (Premium), AnyList (Complete), Plan to Eat og Matlyst (Pro) oppgir deling. Samsung Food oppgir delte handlelister.'],
        ['Er siden nøytral når Matlyst har laget den?', 'Vi er part i saken, og det står øverst. Derfor har hvert faktum en lenke til kilden og en dato, så du kan sjekke selv.'],
      ],
      cta: 'Planlegg uka i Matlyst',
    },
  },
};

export const { DATA, AVSENDER, STIER, apperPaSide, kilderForApp, sider } = lagSammenligning(MARKED);
export { kortDato, langDato };

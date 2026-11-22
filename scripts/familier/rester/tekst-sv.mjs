// Text för familjen «rester» (sv): vad man kan laga med det man har hemma. Sidorna listar typer av rätter, utan recept: rättens namn,
// varför den passar och vad du behöver mer, i grova drag. Rätterna är våra förslag och har ingen källa. Förvaring står bara med siffra
// eller mening från Livsmedelsverket eller Svenskt Kött (samma som sidorna om hållbarhet och frysa). Siffror skrivs aldrig här:
// h.t(fält) läser dem ur data.sv.json och h.q(id) ger en mening ur källan, ordagrant.
import { kortListe, p, ul } from './bygg-flersprak.mjs';
const og = (xs) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} och ${xs.at(-1)}` : xs[0] ?? '');

const retter = (lista) => kortListe(lista.map(([namn, varfor, behover]) => [namn, ['Därför passar den', varfor], ['Du behöver också', behover]]));
export const FORVARING = 'Så förvarar du det som blir över';
const forvaring = (...delar) => [FORVARING, delar.join('')];
const SKAFFERI = 'I <a href="/sv/skafferi-app/">skafferiet</a> i Matlyst lägger du in det du har och ser hur många dagar det är kvar på varje vara. ';
const SOK = 'Sök bland recepten du har sparat på varan, så ser du vilka som använder den. Det är vanlig sökning och fungerar utan AI. ';
const LAGA = 'Med <strong>Laga något av det jag har</strong> i Fråga Matlyst får du middagsförslag utifrån varorna i skafferiet, med tillagningstid. Det är en Pro-funktion, använder AI och har en månadskvot, så läs resultatet innan du lagar maten.';
const app = (...delar) => [
  ['Från skafferiet till middag', p(delar.filter((d) => d !== SOK).join(''))],
  ['Sök bland dina egna recept', p(`${SOK}Har du inget sparat som passar kan du importera ett recept från en länk och söka i det efteråt.`)],
];

export const TEKST = {
  kjottdeig: (h) => ({
    gruppe: 'Kött och fisk', kort: 'Köttfärssås, köttbullar, pannbiff, tacos, lasagne och kåldolmar.',
    tittel: 'Vad kan man göra med köttfärs?',
    h1: 'Vad kan man göra med köttfärs?',
    beskrivelse: 'Sex rätter som passar en förpackning köttfärs, med varför de passar och vad du behöver mer. Dessutom vad Livsmedelsverket och Svenskt Kött skriver om förvaring.',
    ingress: 'Köttfärs är en av de enklaste varorna att bygga en middag runt. Du kan steka den, rulla den eller låta den puttra i en sås.',
    svar: `Köttfärs passar till köttfärssås, köttbullar, pannbiff, tacos, lasagne och kåldolmar. Livsmedelsverket skriver att köttfärs ska ha nått ${h.t('fars')} innertemperatur för att vara säker, och Svenskt Kött att den bör användas senast på sista förbrukningsdag, annars frysas.`,
    steg: [['Välj en rättstyp', 'Sås, bullar, biffar, tacos, lasagne eller kåldolmar.'], ['Kolla vad du har mer', 'Tomat, lök, potatis, pasta eller tortillabröd.'], ['Stek färdigt', `Livsmedelsverket: ${h.t('fars')} innertemperatur.`]],
    seksjoner: [
      ['Sex rätter som passar', retter([
        ['Köttfärssås med pasta', 'Du brynner färsen och låter den koka med tomat. Det blir mycket mat av lite kött, och såsen går bra att göra i stor sats.', 'Krossade tomater, lök, vitlök och pasta.'],
        ['Köttbullar', 'Smeten rullas och steks eller ugnsbakas. Det passer när du vill ha något som är lätt att dela i portioner.', 'Ägg, mjölk och ströbröd eller mjöl, och potatis och sås till.'],
        ['Pannbiff', 'Färsen formas till platta biffar som steks snabbt. Det går fortare än bullar.', 'Lök, ägg, potatis och lingon eller en brun sås.'],
        ['Tacos eller tacopaj', 'Färsen kryddas och sätts fram med tillbehör var för sig, så bygger alla sin egen.', 'Tacokrydda, tortillabröd eller tacoskal, grönsaker och ost.'],
        ['Lasagne', 'Köttfärssåsen görs först och läggs i lager. Rätten kan stå klar innan gästerna kommer.', 'Lasagneplattor, en vit sås och riven ost.'],
        ['Kåldolmar', 'Färsen blir fyllning i kålblad. Det är en gammal svensk rätt som använder färsen på ett annat sätt än bullar.', 'Vitkål, ris eller gryn, sirap och lingon till.'],
      ])],
      forvaring(
        p(`${h.k('skforvara')} anger ${h.t('kjol')} som bra kylskåpstemperatur. ${h.q('kanslig')} ${h.q('sista')}`),
        p(`${h.q('par')} ${h.q('vakuum')}`),
        p(`Om du fryser färsen: ${h.q('bra')} ${h.q('harskna')}`),
        p(`Livsmedelsverket skriver också: ${h.q('genomstek')}`),
      ),
      ...app(SKAFFERI, SOK, LAGA),
    ],
    faq: [
      ['Vad kan man göra med köttfärs och nästan ingenting annat?', 'En enkel köttfärssås eller pannbiffar. Du vill helst ha tomat eller något som binder, men det du har av grönsaker och stärkelse avgör resten.'],
      ['Hur länge håller köttfärs?', `${h.q('sista')} Följ alltså datumet på förpackningen.`],
      ['Går köttfärs att frysa?', h.q('bra')],
    ],
  }),

  kylling: (h) => ({
    gruppe: 'Kött och fisk', kort: 'Gryta, wok, soppa, sallad och pasta, och vad Livsmedelsverket skriver om tillagad mat.',
    tittel: 'Vad kan man göra med kyckling?',
    h1: 'Vad kan man göra med kyckling?',
    beskrivelse: 'Sex rätter som passar kyckling, rå eller som rester. Med vad Livsmedelsverket skriver om hur länge tillagad mat håller sig i kylskåpet.',
    ingress: 'Kyckling går till allt från wok till soppa. Vad du väljer beror på om kycklingen är rå eller redan stekt.',
    svar: `Rå kyckling passar till gryta, wok, ugnsrätt och soppa. Stekt kyckling passar till sallad, wraps och pasta. Livsmedelsverket (2026) skriver att tillagad mat som förvarats rätt håller upp till ${h.t('vecka')} i kylskåpet.`,
    steg: [['Är den rå eller stekt?', 'Rå till gryta och wok, stekt till sallad och wraps.'], ['Se vad du har mer', 'Grönsaker, ris, pasta eller tortillabröd.'], ['Kyl resten snabbt', 'Sätt in den i kylskåpet så fort den har svalnat.']],
    seksjoner: [
      ['Sex rätter som passar', retter([
        ['Kycklinggryta eller curry', 'Kycklingen får koka i såsen. Det är en rätt som tål att stå och blir bättre dagen efter.', 'Lök, tomat eller kokosmjölk, krydda och ris.'],
        ['Wok med grönsaker', 'Kycklingen skärs i strimlor och steks snabbt. Det passar när du har lite tid och grönsaker som ska användas.', 'Grönsaker, nudlar eller ris och en sås, till exempel soja.'],
        ['Kycklingsoppa', 'Kycklingen ger smak åt buljongen, och rester av stekt kyckling kan rivas ner i soppan.', 'Buljong, rotfrukter och pasta eller ris.'],
        ['Ugnsrätt', 'Allt läggs i ett fat och går in i ugnen. Du behöver inte stå vid spisen.', 'Potatis eller rotfrukter, olja och krydda.'],
        ['Kycklingsallad eller wraps', 'Stekt kyckling är redan klar. Du skär eller river den och sätter ihop.', 'Sallad, grönsaker, en dressing och tortillabröd.'],
        ['Pasta med kyckling', 'Rester av kyckling passar bra i en gräddsås eller tomatsås, och pastan blir mer mättande.', 'Pasta, grädde eller tomat och något grönt.'],
      ])],
      forvaring(
        p(`Livsmedelsverket skriver om tillagad mat, och det gäller även stekt kyckling: rätt förvarad håller den upp till ${h.t('vecka')} i kylskåpet. ${h.q('sinnen')}`),
        p(`${h.q('kallt')} ${h.q('frys')}`),
      ),
      ...app(SKAFFERI, 'Då ser du hur många dagar kycklingen har kvar innan du bestämmer dig för en rätt. ', LAGA),
    ],
    faq: [
      ['Kan jag använda kyckling som är stekt i går?', `Ja, så länge den har förvarats rätt. Livsmedelsverket skriver att tillagad mat håller upp till ${h.t('vecka')} i kylskåpet.`],
      ['Ska varm kyckling ställas direkt i kylen?', h.q('kallt')],
      ['Vad gör jag med kyckling jag inte hinner äta?', h.q('frys')],
    ],
  }),

  egg: (h) => ({
    gruppe: 'Ägg och mejeri', kort: 'Omelett, äggakaka, pannkakor, äggsallad och vad du gör med vitor och gulor.',
    tittel: 'Vad kan man göra med ägg?',
    h1: 'Vad kan man göra med ägg?',
    beskrivelse: 'Rätter som passar ägg, och vad du gör med äggvitor och äggulor som blir över, med vad Livsmedelsverket skriver om förvaring.',
    ingress: 'Ägg är mer än frukost. Här är rätterna, och vad du gör när du har vitor eller gulor över.',
    svar: `Ägg passar till omelett, äggröra, äggakaka, pannkakor och äggsallad. Livsmedelsverket (2026) skriver att råa ägg ska förvaras i kylskåpet, cirka ${h.t('kjol')}, och att vitor och gulor som blir över går bra att frysa in.`,
    steg: [['Vad har du?', 'Hela ägg, kokta ägg eller bara vitor eller gulor.'], ['Välj rättstyp', 'Omelett, äggakaka, pannkakor eller äggsallad.'], ['Ta vara på resten', 'Vitor och gulor kan frysas in.']],
    seksjoner: [
      ['Fem rätter som passar', retter([
        ['Omelett eller äggröra', 'Det är det snabbaste. Du kan ta det som finns i kylen, till exempel skinka, ost eller grönsaksrester.', 'Smör eller olja och det du vill ha i. Bröd till.'],
        ['Äggakaka', 'Äggen stannar i pannan eller ugnen tillsammans med fläsk eller grönsaker och blir en tjock kaka som går bra kall.', 'Fläsk eller grönsaker, mjölk och mjöl, och lingon till.'],
        ['Pannkakor eller plättar', 'Äggen är en del av smeten. Har du ägg, mjölk och mjöl behöver du inte mycket mer.', 'Mjöl, mjölk och smör att steka i.'],
        ['Äggsallad', 'Kokta ägg är redan klara. Du hackar dem och blandar med något krämigt.', 'Majonnäs, gräddfil eller crème fraiche, och bröd eller knäckebröd.'],
        ['Gulor till sås eller kräm', 'Äggulor passar rätter som ska bli rika och gula, så du slipper använda hela ägget.', 'Grädde eller mjölk, och något surt eller sött att smaka av med.'],
      ])],
      forvaring(
        p(`${h.q('veckor')} ${h.q('sinnen')}`),
        p(`${h.q('vitor')} ${h.q('skal')}`),
      ),
      ...app(SKAFFERI, SOK),
    ],
    faq: [
      ['Vad gör jag med äggvitor som blir över?', h.q('vitor')],
      ['Hur ska ägg förvaras?', `Livsmedelsverket: råa ägg i kylskåpet, cirka ${h.t('kjol')}.`],
      ['Går det att frysa ägg?', h.q('skal')],
    ],
  }),

  poteter: (h) => ({
    gruppe: 'Grönt och rotfrukter', kort: 'Ugnsbakad, mos, gratäng, raggmunk och soppa, och hur potatis ska förvaras.',
    tittel: 'Vad kan man göra med potatis?',
    h1: 'Vad kan man göra med potatis?',
    beskrivelse: 'Rätter som passar rå potatis, från ugnsbakad till soppa, och vad Livsmedelsverket skriver om förvaring och varför potatisen ska ligga mörkt.',
    ingress: 'Potatis är basvaran i många hem. Här är rätterna du kan bygga, och hur du får den att hålla.',
    svar: `Rå potatis passar till klyftpotatis, potatismos, gratäng, raggmunk och soppa. Livsmedelsverket (2026) skriver att potatis ska förvaras mörkt och svalt, ${h.t('svalt')}.`,
    steg: [['Välj tillagning', 'Ugn, kokning, stekning eller soppa.'], ['Se vad du har mer', 'Grädde, ost, lök eller köttrester.'], ['Titta på potatisen', 'Livsmedelsverket säger varför den ska ligga mörkt.']],
    seksjoner: [
      ['Fem rätter som passar', retter([
        ['Klyftpotatis eller ugnsbakad potatis', 'Du skär, kryddar och sätter in den i ugnen. Det går nästan av sig självt.', 'Olja, salt och krydda, och något att ha vid sidan av.'],
        ['Potatismos', 'En trygg rätt för alla. Du kan blanda i andra rotfrukter för att använda upp dem.', 'Smör eller mjölk och salt.'],
        ['Potatisgratäng', 'Tunna skivor läggs i lager och gräddas i en gräddig sås. Den passar en längre middag.', 'Grädde eller mjölk, ost och gärna vitlök.'],
        ['Raggmunk eller rårakor', 'Riven rå potatis steks som en tunn kaka. Klassiskt med fläsk och lingon.', 'Mjöl, ägg, mjölk, fett att steka i och fläsk.'],
        ['Potatissoppa', 'Potatisen gör soppan tjock utan mycket grädde. Den passar tillsammans med purjolök.', 'Buljong, purjolök eller lök, och krydda.'],
      ])],
      forvaring(
        p(`${h.q('potatis')}`),
        p(`${h.q('solanin')}`),
      ),
      ...app(SKAFFERI, SOK),
    ],
    faq: [
      ['Var ska potatis förvaras?', `Livsmedelsverket: mörkt och svalt, ${h.t('svalt')}.`],
      ['Varför ska potatis ligga mörkt?', h.q('solanin')],
      ['Vad gör jag med potatis jag inte hinner äta?', 'Koka den och använd den i en rätt som pytt i panna eller potatissallad. Sidan om kokt potatis har det Livsmedelsverket skriver om tillagad mat.'],
    ],
  }),

  'kokte-poteter': (h) => ({
    gruppe: 'Grönt och rotfrukter', kort: 'Pytt i panna, stekt potatis, potatissallad och potatisbullar av dagen före.',
    tittel: 'Vad kan man göra med kokt potatis från i går?',
    h1: 'Vad kan man göra med kokt potatis från i går?',
    beskrivelse: 'Kokt potatis är rester som är lätta att använda igen. Fyra rätter, och vad Livsmedelsverket skriver om avsvalning och hur länge maten håller.',
    ingress: 'Har du kokat för mycket? Kokt potatis är ett av de enklaste resterna att göra något nytt av.',
    svar: `Kokt potatis passar till pytt i panna, stekt potatis, potatissallad och potatisbullar. Livsmedelsverket (2026) skriver att tillagad mat som förvarats rätt håller upp till ${h.t('vecka')} i kylskåpet, och att större mängder än ${h.t('halv')} ska svalna snabbt först.`,
    steg: [['Låt den svalna snabbt', 'Dela upp i mindre behållare.'], ['Välj rätt', 'Pytt i panna, stekt potatis, sallad eller bullar.'], ['Använd inom en vecka', 'Eller frys in det du inte hinner äta.']],
    seksjoner: [
      ['Fyra rätter som passar', retter([
        ['Pytt i panna', 'Den klassiska resträtten: kokt potatis i tärningar steks med lök och det som finns kvar av kött eller korv.', 'Lök, kött eller korv, ägg och rödbetor eller inlagd gurka.'],
        ['Stekt potatis i skivor', 'Potatisen är redan kokt, så du behöver bara steka den gyllene i smör.', 'Smör eller olja, salt och gärna ägg eller sill till.'],
        ['Potatissallad', 'Du skär potatisen och blandar med en sås medan den är kall.', 'Gräddfil, majonnäs eller en vinägrett, och rödlök eller gräslök.'],
        ['Potatisbullar', 'Potatis som mosas och blandas med ägg och mjöl blir bullar som steks i panna.', 'Ägg, mjöl, lök och fett att steka i.'],
      ])],
      forvaring(
        p(`Livsmedelsverket skriver att tillagad mat som förvarats rätt håller upp till ${h.t('vecka')} i kylskåpet. ${h.q('kallt')}`),
        p(`${h.q('vatten')} ${h.q('behallare')}`),
        p(`Livsmedelsverket nämner också potatis bland stärkelserika rätter: ${h.q('starkelse')}`),
      ),
      ...app(SKAFFERI, 'Lägg in den kokta potatisen med dagen du kokade den, så ser du när det börjar bli dags. ', LAGA),
    ],
    faq: [
      ['Hur länge håller kokt potatis i kylskåpet?', `Livsmedelsverket: tillagad mat håller upp till ${h.t('vecka')} i kylskåpet, om den har förvarats rätt.`],
      ['Hur snabbt ska den svalna?', h.q('kallt')],
      ['Kan jag frysa kokt potatis?', 'Livsmedelsverket skriver om tillagad mat i allmänhet: ' + h.q('frys')],
    ],
  }),

  ris: (h) => ({
    gruppe: 'Ris och pasta', kort: 'Stekt ris, risgrynsgröt, risallad, fylld paprika och soppa, och varför riset ska svalna snabbt.',
    tittel: 'Vad kan man göra med kokt ris från i går?',
    h1: 'Vad kan man göra med kokt ris från i går?',
    beskrivelse: 'Fem rätter som använder kokt ris, och vad Livsmedelsverket skriver om att kyla ner stärkelserika rester snabbt och hur länge maten håller.',
    ingress: 'Rester av ris är en vanlig början på nästa dags middag. Men ris kräver mer omsorg än andra rester.',
    svar: `Kokt ris passar till stekt ris, risgrynsgröt, risallad, fylld paprika och soppa. Livsmedelsverket (2026) skriver att tillagad mat som förvarats rätt håller upp till ${h.t('vecka')} i kylskåpet, och att du snabbt ska kyla ner eller frysa in matrester.`,
    steg: [['Kyl ner snabbt', 'Dela upp riset i mindre behållare.'], ['Välj en rätt', 'Stekt ris, gröt, sallad, fyllning eller soppa.'], ['Frys in det du inte hinner äta', 'Livsmedelsverket: kyl eller frys snabbt.']],
    seksjoner: [
      ['Fem rätter som passar', retter([
        ['Stekt ris', 'Kallt ris från dagen före är det stekt ris helst görs på. Du steker det i het panna med det du har.', 'Ägg, grönsaker, soja eller annan sås och olja.'],
        ['Risgrynsgröt', 'Det kokta riset kan bli gröt tillsammans med mjölk. Då slipper du koka riset från början.', 'Mjölk, kanel och socker eller smör.'],
        ['Risallad', 'Riset blandas med en dressing och grönsaker och äts kallt.', 'Grönsaker, en dressing och något mättande, som ägg eller kyckling.'],
        ['Fylld paprika eller tomat', 'Riset ger fyllningen kropp. Du behöver inte koka något nytt.', 'Grönsaker att fylla, ost eller sås och krydda.'],
        ['Soppa', 'Riset gör soppan mer mättande och drar åt sig smak från buljongen.', 'Buljong och grönsaker eller köttrester.'],
      ])],
      forvaring(
        p(`${h.q('starkelse')}`),
        p(`${h.q('kyl')} ${h.q('vattenbad')}`),
        p(`Rätt förvarad håller tillagad mat upp till ${h.t('vecka')} i kylskåpet enligt Livsmedelsverket. Större mängder än ${h.t('halv')} ska enligt samma källa svalna snabbt innan de ställs in.`),
      ),
      ...app(SKAFFERI, 'Lägg in riset med dagen du kokade det, så ser du hur många dagar det har kvar. ', LAGA),
    ],
    faq: [
      ['Kan jag använda ris som har stått framme över natten?', 'Livsmedelsverket skriver att det bästa är att snabbt kyla ner eller frysa in matrester. Se sidan om hållbarhet för kokt ris och pasta.'],
      ['Hur länge håller kokt ris i kylskåpet?', `Livsmedelsverket: tillagad mat håller upp till ${h.t('vecka')} i kylskåpet om den förvarats rätt.`],
      ['Vad är bäst att göra med ris från i går?', 'Stekt ris är det vanligaste. Risgrynsgröt och soppa är två andra sätt att använda det.'],
    ],
  }),

  pasta: (h) => ({
    gruppe: 'Ris och pasta', kort: 'Pastasallad, gratäng, soppa och omelett av kokt pasta.',
    tittel: 'Vad kan man göra med kokt pasta från i går?',
    h1: 'Vad kan man göra med kokt pasta från i går?',
    beskrivelse: 'Fyra rätter som använder kokt pasta, och vad Livsmedelsverket skriver om att dela upp maten i behållare, hur länge den håller och hur du bedömer den.',
    ingress: 'Pasta är lätt att koka för mycket av. Här är fyra sätt att ge den ett nytt liv dagen efter.',
    svar: `Kokt pasta passar till pastasallad, gratäng, soppa och pastaomelett. Livsmedelsverket (2026) skriver att tillagad mat som förvarats rätt håller upp till ${h.t('vecka')} i kylskåpet.`,
    steg: [['Dela upp snabbt', 'Mindre behållare svalnar fortare.'], ['Välj rätt', 'Sallad, gratäng, soppa eller omelett.'], ['Använd sinnena', 'Luktar och ser den ut som den ska?']],
    seksjoner: [
      ['Fyra rätter som passar', retter([
        ['Pastasallad', 'Pastan är klar. Du blandar den med grönsaker och en dressing och äter den kall, till exempel i matlådan.', 'Grönsaker, en dressing och något proteinrikt, som skinka eller ägg.'],
        ['Gratinerad pasta', 'Pastan läggs i ett fat med sås och ost och går in i ugnen. Rätten blir som en ny middag.', 'En tomat- eller gräddsås, ost och eventuellt köttrester.'],
        ['Pastasoppa', 'Pastan kan läggas i en buljong med grönsaker så att soppan blir mer mättande.', 'Buljong, grönsaker och krydda.'],
        ['Pastaomelett', 'Kokt pasta blandas med ägg och steks som en tjock omelett. Det passar när det bara finns lite pasta kvar.', 'Ägg, ost och kanske lite skinka eller grönsaker.'],
      ])],
      forvaring(
        p(`${h.q('flera')}`),
        p(`${h.q('behallare')} ${h.q('sinnen')}`),
      ),
      ...app(SKAFFERI, 'Lägg in pastan med dagen du kokade den, så ser du när det börjar bli dags. ', LAGA),
    ],
    faq: [
      ['Hur länge håller kokt pasta i kylskåpet?', `Livsmedelsverket: tillagad mat håller upp till ${h.t('vecka')} i kylskåpet om den förvarats rätt.`],
      ['Hur vet jag att pastan går att äta?', h.q('sinnen')],
      ['Hur kyler jag ner pasta snabbt?', h.q('behallare')],
    ],
  }),

  laks: (h) => ({
    gruppe: 'Kött och fisk', kort: 'Ugnsbakad lax, pasta, soppa, paj och sallad, och vad Livsmedelsverket skriver om fet fisk i frysen.',
    tittel: 'Vad kan man göra med lax?',
    h1: 'Vad kan man göra med lax?',
    beskrivelse: 'Rätter som passar lax, färsk eller som rester, och vad Livsmedelsverket skriver om fet fisk, förpackning och hur länge tillagad mat håller.',
    ingress: 'Lax passar till allt från vardagsmiddag till sallad. Här är rätterna, och hur du tar hand om det som blir över.',
    svar: `Lax passar till ugnsbakad lax med rotfrukter, laxpasta, laxsoppa, laxpaj och sallad. Livsmedelsverket (2026) skriver att kött och fisk med hög fetthalt, som lax, har kortare hållbarhet i frysen, och att tillagad mat som förvarats rätt håller upp till ${h.t('vecka')} i kylskåpet.`,
    steg: [['Är den rå eller tillagad?', 'Rå till ugn och soppa, tillagad till sallad och pasta.'], ['Se vad du har mer', 'Potatis, pasta, grädde eller grönsaker.'], ['Frys in det du inte hinner äta', 'Förpacka så att fisken inte kommer i kontakt med luft.']],
    seksjoner: [
      ['Fem rätter som passar', retter([
        ['Ugnsbakad lax med rotfrukter', 'Allt går i ett fat. Du behöver bara sätta in det och göra en enkel sås medan fisken tillagas.', 'Potatis eller rotfrukter, citron, dill och olja.'],
        ['Laxpasta', 'Tillagad lax delas i bitar och värms i en gräddig sås. Rester från gårdagens middag räcker långt.', 'Pasta, grädde eller crème fraiche och något grönt.'],
        ['Laxsoppa', 'Laxen ger smak åt buljongen och mjölken, och soppan går att göra på lite fisk.', 'Buljong, potatis, purjolök och grädde.'],
        ['Laxpaj', 'Laxen blir fyllning tillsammans med ägg och grädde i en paj.', 'Pajdeg, ägg, grädde och ost.'],
        ['Laxsallad eller wraps', 'Kall lax delas i bitar och sätts ihop med grönsaker. Det går fort och passar som lunch.', 'Sallad, gurka, en dressing och bröd eller tortillabröd.'],
      ])],
      forvaring(
        p(`${h.q('fett')} ${h.q('harskna')}`),
        p(`${h.q('luft')} Frysen ska hålla ${h.t('fryser')}.`),
        p(`För tillagad lax gäller det Livsmedelsverket skriver om tillagad mat: rätt förvarad håller den upp till ${h.t('vecka')} i kylskåpet.`),
      ),
      ...app(SKAFFERI, 'Då ser du hur många dagar laxen har kvar innan du bestämmer dig. ', LAGA),
    ],
    faq: [
      ['Går lax att frysa?', `Ja. Livsmedelsverket skriver att fet fisk som lax har kortare hållbarhet i frysen, och att en lagom temperatur är ${h.t('fryser')}.`],
      ['Hur förpackar jag fisken?', h.q('luft')],
      ['Hur länge håller tillagad lax?', `Livsmedelsverket: tillagad mat håller upp till ${h.t('vecka')} i kylskåpet om den förvarats rätt.`],
    ],
  }),

  'kokt-skinke': (h) => ({
    gruppe: 'Kött och fisk', kort: 'Skinkmacka, pytt i panna, paj, omelett och pasta av julskinkan, och hur länge den får stå framme.',
    tittel: 'Vad kan man göra med resterna av julskinkan?',
    h1: 'Vad kan man göra med resterna av julskinkan?',
    beskrivelse: 'Fem rätter som passar rester av julskinka och kokt skinka, och vad Livsmedelsverket skriver om hur länge mat får stå framme och hur länge den håller.',
    ingress: 'Julskinkan räcker ofta längre än julen. Här är rätterna som tar vara på resten.',
    svar: `Rester av skinka passar till skinkmacka, pytt i panna, skinkpaj, omelett och pasta. Livsmedelsverket (2026) skriver att tillagad mat som förvarats rätt håller upp till ${h.t('vecka')} i kylskåpet.`,
    steg: [['Se vad som finns kvar', 'Skivor, bitar eller rester vid benet.'], ['Välj rätt', 'Macka, pytt, paj, omelett eller pasta.'], ['Förvara rätt', 'Tillbaka i kylen efter måltiden.']],
    seksjoner: [
      ['Fem rätter som passar', retter([
        ['Skinkmacka eller toast', 'Skivor från skinkan passar direkt på bröd. Det är det enklaste sättet att använda resten.', 'Bröd, ost och senap eller smör.'],
        ['Pytt i panna', 'Skinkan skärs i tärningar och steks med potatis och lök. Rätten använder det som blir över av jul.', 'Kokt potatis, lök, ägg och rödbetor.'],
        ['Skinkpaj', 'Skinkan blir fyllning tillsammans med ägg och ost i en paj.', 'Pajdeg, ägg, grädde och riven ost.'],
        ['Omelett', 'Tärnad skinka passar i en omelett, och det går på några minuter.', 'Ägg, ost och gärna lite lök.'],
        ['Pasta med skinka', 'Skinkan värms i en sås av grädde eller tomat och blandas med pastan.', 'Pasta, grädde eller tomat och ärtor eller broccoli.'],
      ])],
      forvaring(
        p(`${h.q('regel')}`),
        p(`${h.q('helg')}`),
        p(`Livsmedelsverket skriver om tillagad mat: rätt förvarad håller den upp till ${h.t('vecka')} i kylskåpet. ${h.q('frys')}`),
      ),
      ...app(SKAFFERI, 'Lägg in skinkan med dagen du öppnade den, så ser du hur länge den håller. ', LAGA),
    ],
    faq: [
      ['Hur länge får skinkan stå framme?', h.q('regel')],
      ['Hur länge håller tillagad skinka i kylskåpet?', `Livsmedelsverket: tillagad mat håller upp till ${h.t('vecka')} i kylskåpet om den förvarats rätt.`],
      ['Vad gör jag med skinka jag inte hinner äta?', h.q('frys')],
    ],
  }),

  floete: (h) => ({
    gruppe: 'Ägg och mejeri', kort: 'Gräddsås, gratäng, soppa, pastasås och efterrätt, och vad Livsmedelsverket skriver om frysning.',
    tittel: 'Vad kan man göra med grädde som blir över?',
    h1: 'Vad kan man göra med grädde som blir över?',
    beskrivelse: 'Rätter som passar en grädde som blir över, och vad Livsmedelsverket skriver om att frysa grädde och hur du bedömer den innan du slänger den.',
    ingress: 'Grädde blir ofta över efter en middag. Här är rätterna som tar vara på den.',
    svar: `Grädde som blir över passar till gräddsås, gratäng, soppa, pastasås och efterrätter. Livsmedelsverket (2026) skriver att grädde kan frysas in om den inte går åt i tid, men att den kan vara svår att vispa efter det.`,
    steg: [['Se hur mycket du har', 'En skvätt eller en hel förpackning.'], ['Välj rätt', 'Sås, gratäng, soppa eller efterrätt.'], ['Frys in resten', 'Frusen grädde går att laga mat med.']],
    seksjoner: [
      ['Fem rätter som passar', retter([
        ['Gräddsås till kött eller fisk', 'En skvätt grädde gör en sås rund och len. Du behöver inte mycket.', 'Buljong, senap eller peppar, och något att servera till.'],
        ['Potatisgratäng', 'Gratängen kräver ganska mycket grädde, så den passar när förpackningen är nästan full.', 'Potatis, lök eller vitlök och ost.'],
        ['Gräddig pastasås', 'Grädden blir bas för en sås som går fort att göra och passar till det mesta.', 'Pasta, ost och något grönt eller kött.'],
        ['Soppa', 'Grädde i slutet gör soppan mjuk och rund, till exempel tomatsoppa eller svampsoppa.', 'Grönsaker eller svamp, buljong och krydda.'],
        ['Efterrätt', 'Grädden vispas eller kokas till en kräm, till exempel pannacotta.', 'Socker, vanilj och gelatin eller frukt.'],
      ])],
      forvaring(
        p(`${h.q('mjolk')} ${h.q('gradde')}`),
        p(`Livsmedelsverket anger en lagom temperatur i frysen på ${h.t('fryser')}. ${h.q('lukta')}`),
      ),
      ...app(SKAFFERI, SOK),
    ],
    faq: [
      ['Går grädde att frysa?', h.q('mjolk')],
      ['Går fryst grädde att vispa?', h.q('gradde')],
      ['Hur vet jag om grädden är bra?', h.q('lukta')],
    ],
  }),

  gulrotter: (h) => ({
    gruppe: 'Grönt och rotfrukter', kort: 'Soppa, kaka, rårivna, ugnsrostade och biffar, och hur du får tillbaka spänsten.',
    tittel: 'Vad kan man göra med morötter?',
    h1: 'Vad kan man göra med morötter?',
    beskrivelse: 'Rätter som passar morötter, även de som blivit slappa, och vad Livsmedelsverket skriver om att få tillbaka spänsten och om att frysa grönsaker.',
    ingress: 'Morötter håller länge, men en påse blir lätt kvar längst bak. Här är rätterna som använder dem.',
    svar: `Morötter passar till soppa, morotskaka, rårivna morötter, ugnsrostade morötter och morotsbiffar. Livsmedelsverket (2026) skriver att morötter som tappat spänsten blir pigga om de ligger i vatten i kylskåpet några timmar, och att bär, frukter och grönsaker håller ${h.t('ar')} eller mer i frysen.`,
    steg: [['Titta på morötterna', 'Slappa går ofta att rädda i kallt vatten.'], ['Välj rätt', 'Soppa, kaka, riven, rostad eller biffar.'], ['Frys in resten', 'Grönsaker förvälls först.']],
    seksjoner: [
      ['Fem rätter som passar', retter([
        ['Morotssoppa', 'Morötterna kokas mjuka och mixas. Det är ett bra sätt att använda slappa morötter.', 'Buljong, lök och gärna ingefära eller apelsin.'],
        ['Morotskaka', 'Rivna morötter gör kakan saftig. Det går åt flera morötter på en gång.', 'Mjöl, ägg, socker, olja och kanel.'],
        ['Rårivna morötter', 'Du river dem och blandar med en dressing. Det är en enkel sallad som passar till det mesta.', 'Olja, citron och något krispigt, till exempel nötter.'],
        ['Ugnsrostade morötter', 'Hela eller halverade morötter får sötma i ugnen. Det är lite arbete och mycket smak.', 'Olja, salt och krydda, till exempel timjan.'],
        ['Morotsbiffar', 'Morötterna rivs och blandas med ägg och mjöl eller gryn och steks i panna.', 'Ägg, mjöl eller havregryn, lök och en sås.'],
      ])],
      forvaring(
        p(`${h.q('kylen')} ${h.q('sallad')}`),
        p(`${h.q('forvall')}`),
      ),
      ...app(SKAFFERI, SOK),
    ],
    faq: [
      ['Kan jag använda slappa morötter?', h.q('sallad')],
      ['Går morötter att frysa?', h.q('forvall')],
      ['Var förvarar jag morötter?', h.q('kylen')],
    ],
  }),

  brod: (h) => ({
    gruppe: 'Bröd och frukt', kort: 'Fattiga riddare, krutonger, ströbröd och bruschetta, och varför bröd inte ska ligga i kylen.',
    tittel: 'Vad kan man göra med gammalt bröd?',
    h1: 'Vad kan man göra med gammalt bröd?',
    beskrivelse: 'Fyra rätter som passar bröd som blivit torrt, och vad Livsmedelsverket skriver om förvaring i rumstemperatur, mögel och frysning.',
    ingress: 'Bröd blir torrt före det blir dåligt. Här är fyra sätt att använda det.',
    svar: `Gammalt bröd passar till fattiga riddare, krutonger, ströbröd och bruschetta. Livsmedelsverket (2026) skriver att bröd generellt möglar efter ungefär ${h.t('mogel')}, och att det mår bäst i rumstemperatur, inte i kylskåp.`,
    steg: [['Titta på brödet', 'Torrt går bra, mögligt ska inte ätas.'], ['Välj rätt', 'Fattiga riddare, krutonger, ströbröd eller bruschetta.'], ['Frys in resten', 'Skiva brödet först.']],
    seksjoner: [
      ['Fyra rätter som passar', retter([
        ['Fattiga riddare', 'Torra brödskivor dras genom en äggblandning och steks. Det är det klassiska sättet att göra något av bröd som blivit torrt.', 'Ägg, mjölk, smör att steka i och sylt eller sirap.'],
        ['Krutonger', 'Brödet skärs i tärningar och steks eller rostas knaprigt. Ett bra sätt att använda bröd som är hårt.', 'Olja eller smör, salt och gärna vitlök.'],
        ['Ströbröd', 'Torrt bröd mals eller rivs till ströbröd. Det håller länge i en burk.', 'Ett rivjärn eller en matberedare.'],
        ['Bruschetta', 'Skivor rostas och får topping. Torrt bröd passar bra, för det ska ändå bli knaprigt.', 'Tomat, vitlök, olja och basilika.'],
      ])],
      forvaring(
        p(`${h.q('rum')} ${h.q('kylen')}`),
        p(`${h.q('surdeg')} ${h.q('frys')}`),
        p(`${h.q('delaupp')}`),
      ),
      ...app(SKAFFERI, SOK),
    ],
    faq: [
      ['Ska bröd ligga i kylskåpet?', h.q('rum')],
      ['Går bröd att frysa?', h.q('frys')],
      ['Hur länge håller bröd innan det möglar?', `Livsmedelsverket: bröd möglar ofta efter ungefär ${h.t('mogel')}, men vissa håller längre.`],
    ],
  }),

  bananer: (h) => ({
    gruppe: 'Bröd och frukt', kort: 'Bananbröd, smoothie, pannkakor och glass, och vad Livsmedelsverket skriver om att frysa frukt.',
    tittel: 'Vad kan man göra med bananer som blivit mogna?',
    h1: 'Vad kan man göra med bananer som blivit mogna?',
    beskrivelse: 'Fyra rätter som passar bananer som blivit för mogna, och vad Livsmedelsverket skriver om att frysa frukt i bitar.',
    ingress: 'Bananer blir bruna fort. Då är de som bäst i bakning och smoothies.',
    svar: `Mogna bananer passar till bananbröd, smoothie, pannkakor och glass. Livsmedelsverket (2026) skriver att frukt kan frysas in men måste först delas i mindre bitar, och att bär, frukter och grönsaker håller ${h.t('ar')} eller mer i frysen.`,
    steg: [['Titta på bananerna', 'Bruna går bra till bakning och smoothies.'], ['Välj rätt', 'Bröd, smoothie, pannkakor eller glass.'], ['Frys in resten', 'Dela i mindre bitar först.']],
    seksjoner: [
      ['Fyra rätter som passar', retter([
        ['Bananbröd', 'Mogna bananer ger sötma och fukt, så brödet behöver mindre socker.', 'Mjöl, ägg, smör och bakpulver.'],
        ['Smoothie', 'Bananen mixas med mjölk eller yoghurt. Frysta bitar ger en tjockare smoothie.', 'Mjölk eller yoghurt och bär.'],
        ['Bananpannkakor', 'Mosad banan blandas med ägg och havregryn och steks som små plättar.', 'Ägg, havregryn och smör att steka i.'],
        ['Glass av frysta bananer', 'Frysta bitar mixas tills de blir krämiga som glass. Det går utan grädde.', 'En mixer eller matberedare, och gärna kakao eller bär.'],
      ])],
      forvaring(
        p(`${h.q('delas')}`),
        p(`${h.q('farlig')}`),
      ),
      ...app(SKAFFERI, SOK),
    ],
    faq: [
      ['Går bananer att frysa?', h.q('delas')],
      ['Hur länge håller frukt i frysen?', `Livsmedelsverket: bär, frukter och grönsaker håller ${h.t('ar')} eller mer i frysen.`],
      ['Blir frusen mat farlig med tiden?', h.q('farlig')],
    ],
  }),
};

const GRUPPER = ['Kött och fisk', 'Ägg och mejeri', 'Grönt och rotfrukter', 'Ris och pasta', 'Bröd och frukt'];

const GRENSE = 'Förslagen är ett hjälpmedel. Kontrollera alltid mängderna, hållbarheten och att varorna fortfarande går att äta.';

export const NAV = {
  lenke: 'Vad kan jag laga?',
  innhold(sider) {
    const grupper = GRUPPER.map((g) => [g, sider.filter((s) => s.c.gruppe === g)]).filter(([, l]) => l.length);
    return {
      tittel: 'Vad kan jag laga med det jag har?',
      h1: 'Vad kan jag laga med det jag har?',
      beskrivelse: 'Välj varan du har över, från köttfärs och kyckling till potatis, ris och bröd, och se vilka typer av rätter som passar och hur resten förvaras.',
      grense: GRENSE,
      ingress: 'Välj varan du har, och se vilka typer av rätter som passar. Appen kan också föreslå rätter utifrån det du har hemma.',
      svar: 'Välj varan du har över: ' + og(sider.map((s) => s.rad.navn)) + '. Varje sida listar typer av rätter som passar, vad du behöver mer och hur resten förvaras, med källa. Sidorna har inga recept.',
      steg: [['Välj varan', 'Kött, ägg, grönt, ris, pasta, bröd eller frukt.'], ['Läs rätterna', 'Varför de passar och vad du behöver mer.'], ['Lägg in varan i skafferiet', 'Matlyst hittar recept och förslag.']],
      seksjoner: [
        ['Från skafferiet till middag', p('Lägg in det du har hemma i skafferiet, så matchar Matlyst varorna mot recepten i din samling. Du ser direkt vad du kan laga utan en tur till affären.')],
        ['Sök bland dina egna recept', p('Skriv in en vara, till exempel ”köttfärs”, i sökningen i Matlyst, så ser du vilka av dina sparade recept som använder den. Det är vanlig sökning och fungerar utan AI.')],
        ['Välj varan du har', grupper.map(([g, l]) => `<h3>${g}</h3>${l.map((s) => `<div class="scenario"><h3><a href="${s.href}">${s.c.h1}</a></h3><p>${s.c.kort}</p></div>`).join('')}`).join('')],
        ['Rädda maten innan den blir dålig', p('Matlyst håller koll på datumen. När något närmar sig får du förslag på hur du använder upp det, så mindre mat hamnar i soporna och mer på tallriken.')],
        ['Färre turer till affären', p('När du ser vad du redan kan laga hoppar du över det extra inköpet. Du handlar mindre, slänger mindre och använder det du redan har betalat för.')],
        ['Bra att veta', p(GRENSE)],
        ['Så är sidorna gjorda', ul([
          '<strong>Inga recept.</strong> Varje sida har typer av rätter, varför de passar och vad du behöver mer, i grova drag.',
          '<strong>Förvaring bara med källa.</strong> Siffror och meningar om förvaring kommer från Livsmedelsverket och Svenskt Kött, med länk längst ner. Där vi inte har en källa står det inget.',
          '<strong>Siffrorna är en ram.</strong> De kommer från källorna och är ingen garanti för en enskild vara.',
        ])],
        ['Mer från Matlyst', p('Se också <a href="/sv/vad-ska-jag-laga/">middagsförslag varje dag</a>, <a href="/sv/tom-kylskapet/">töm kylskåpet</a> och <a href="/sv/skafferi-app/">skafferi-appen</a>. Saknar du en ingrediens? Se <a href="/sv/ersatta/">vad du kan använda i stället</a>.')],
      ],
      faq: [
        ['Skapar sökningen nya recept?', 'Nej. Den matchar mot recept i din egen samling. Fråga Matlyst kan skapa eller anpassa en rätt.'],
        ['Är sidorna gratis?', 'Ja, du behöver inte appen för att använda dem. Sökning bland egna recept och skafferiet är också gratis. Middagsförslag från skafferiet är en Pro-funktion.'],
        ['Har sidorna recept?', 'Nej. De listar typer av rätter som passar, varför, och vad du behöver mer.'],
        ['Var kommer siffrorna ifrån?', 'Från Livsmedelsverket och Svenskt Kött. Källorna står längst ner på varje sida.'],
      ],
    };
  },
};


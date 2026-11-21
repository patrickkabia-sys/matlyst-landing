// Teksten til familien «erstatning» (nb): én funksjon per vare. T(id) og E(id) henter tallene fra data.nb.json, så ingen tall står skrevet for hånd.
// Alt som står her har en kilde i datafila (tall eller sitat under tekst). Der kildene ikke sier noe, sier siden det og gir ikke et tall.
// Ingen allergiråd: byttet nevnes bare nøkternt. Ingen oppskrifter: vi viser hva som kan byttes, ikke hvordan du lager retten.
import { kortListe, og, p, ul } from './bygg.mjs';

const APP_FELLES = 'Åpne oppskriften i appen og bruk <strong>Spør Matlyst</strong>, så får du forslag til en erstatning ut fra det du har i spiskammeret. Du ser endringene som en liste før du lagrer, og kan angre dem. Spør Matlyst er en Pro-funksjon, bruker KI og har en månedlig kvote, så les resultatet før du lager maten.';
// To avsnitt: spiskammeret (hva du har) og Spør Matlyst (selve byttet). Overskriftene styrer hvilke app-bevis siden får (scripts/app-bevis.mjs).
const app = (innledning) => [
  ['Se hva du har i spiskammeret', p(innledning, 'I <a href="/spiskammer-app/">spiskammeret</a> i Matlyst legger du inn det du har og ser hvor mange dager det er igjen på hver vare. Da vet du hva du kan bytte med, før du begynner.')],
  ['Bytt ut ingrediensen i Matlyst', p(APP_FELLES)],
];

export const TEKST = {
  egg: (T, E) => ({
    gruppe: 'Baking', kort: 'Bakepulver, litt væske og maismel. Og hva et egg veier.',
    tittel: 'Erstatte egg i baking: hva kan jeg bruke i stedet?',
    h1: 'Hva kan jeg bruke i stedet for egg i baking?',
    beskrivelse: 'Mangler du egg? Se hva MatPrat og Idun nevner som bytte, hva som endrer seg, og hva ett egg veier når du må veie opp i stedet for å telle.',
    ingress: 'Egget gjør flere jobber i en kake. Det gir løft, væske og farge. Derfor finnes det ikke ett bytte som passer overalt.',
    svar: 'MatPrat nevner bakepulver, maismel for farge og litt vann eller olje for væsken. Kilden gir ikke eksakte mengder, så vi gir heller ingen. Følg oppskriften, eller anvisningen på pakken hvis du kjøper en ferdig eggerstatning.',
    steg: [['Se hva egget gjør', 'Løft, væske eller farge?'], ['Velg bytte', 'Bakepulver, vann eller olje, maismel, eller en ferdig eggerstatning.'], ['Veie opp', 'Trenger du bare plomme eller hvite, kan du veie.']],
    kilder: ['mp-eggallergi', 'idun-muffins', 'idun-pannekaker', 'idun-omregning'],
    seksjoner: [
      ['Fire ting som kan ta over for egget', kortListe([
        ['Bakepulver', ['Forhold', 'MatPrat sier at bakepulver kan erstatte egg i noen bakverk, men oppgir ikke hvor mye. Idun har en pannekakerøre uten egg som bruker ' + T('pann-bp') + ' ts bakepulver til ' + T('pann-mel') + ' g hvetemel og ' + T('pann-vaeske') + ' dl havremelk.'], ['Dette endrer seg', 'Bakepulveret tar løftet. Det tar ikke bindingen. Idun skriver om muffins uten egg at strukturen kanskje ikke blir like luftig og lett som med egg.']],
        ['Vann eller olje', ['Forhold', 'MatPrat nevner et par spiseskjeer (' + T('vann-olje') + ' ss) vann eller olje for å erstatte væsken fra egget. Kilden sier ikke hvor mange egg det gjelder.'], ['Dette endrer seg', 'Du får tilbake væsken som egget ga. Bruk det sammen med bakepulver, slik MatPrat setter det opp.']],
        ['Maismel', ['Forhold', 'Litt maismel. MatPrat oppgir ikke noe tall.'], ['Dette endrer seg', 'Det gir den gule fargen egget ga. Det gir ikke løft eller binding.']],
        ['Ferdig eggerstatning', ['Forhold', 'MatPrat sier at det finnes flere erstatningsprodukter, og at pakningen forklarer hvordan de brukes.'], ['Dette endrer seg', 'Følg pakningen. Vi har ingen kilde som sammenligner dem.']],
      ])],
      ['Trenger du bare en del av egget?', p('Mange oppskrifter bruker bare plommen eller bare hviten. Da kan du veie i stedet for å telle. Idun oppgir at et gjennomsnittlig egg veier ' + T('egg-vekt') + ' g, og at det tilsvarer egg merket M eller L i butikken. Av dette er ' + T('plomme-vekt') + ' g plomme og ' + T('hvite-vekt') + ' g hvite. Resten er skall.', 'Trenger du et halvt egg, kan du vispe egget sammen og veie opp det du trenger. Det er vår framgangsmåte, ikke Iduns.')],
      ...app('Egg er den vanligste varen folk mangler midt i en bakeøkt.'),
    ],
    faq: [
      ['Kan jeg lage pannekaker uten egg?', 'Ja, Idun har en oppskrift på pannekaker uten egg og melk. Røren har hvetemel, sukker, bakepulver, salt, havremelk og Melange uten melk, og ingen egg.'],
      ['Hvor mye veier ett egg?', 'Idun oppgir ' + T('egg-vekt') + ' gram for et gjennomsnittlig egg merket M eller L, og ' + T('plomme-vekt') + ' gram av dette er plomme.'],
      ['Kan jeg bare droppe egget?', 'MatPrat sier at egg kan erstattes i noen bakverk, ikke i alle. Egget gir løft, væske og farge, og du må dekke det som mangler i oppskriften din.'],
    ],
  }),

  'kulturmelk-og-kefir': (T) => ({
    gruppe: 'Meieri', kort: 'Kefir, kulturmelk og yoghurt kan bytte plass, men tykkelsen er ulik.',
    tittel: 'Kulturmelk i stedet for kefir, og omvendt',
    h1: 'Hva kan jeg bruke i stedet for kefir eller kulturmelk?',
    beskrivelse: 'Kefir og kulturmelk kan erstatte hverandre, og yoghurt går også. Slik justerer du tykkelsen, ifølge MatPrat og TINE, og hva som skjer med natron.',
    ingress: 'Kefir og kulturmelk er så like at du ofte kan bytte. Forskjellen er hvor tykke de er.',
    svar: 'MatPrat sier at kefir og kulturmelk har mange likhetstrekk. Bruker du kulturmelk i en røre laget for kefir, kan du ha et par spiseskjeer (' + T('mel-ekstra') + ' ss) mel ekstra, fordi kefir er litt tykkere. Yoghurt går også hvis du rører den ut med litt vann.',
    steg: [['Bytt kefir mot kulturmelk', 'Legg til et par ss mel.'], ['Eller bruk yoghurt', 'Rør ut tykk yoghurt med vann til den ligner kefir.'], ['Sjekk natron', 'Har oppskriften natron, trenger den noe surt.']],
    kilder: ['mp-kefirkake', 'tine-protein', 'idun-heve'],
    seksjoner: [
      ['Tre bytter, og hva som endrer seg', kortListe([
        ['Kulturmelk i stedet for kefir', ['Forhold', 'Samme mengde. MatPrat foreslår ' + T('mel-ekstra') + ' ss mel ekstra i kakerøren.'], ['Dette endrer seg', 'Kefir er litt tykkere enn kulturmelk. Melet tar igjen for det. Kilden gjelder en kake, ikke en saus eller en drikke.']],
        ['Yoghurt i stedet for kefir', ['Forhold', 'Tykk yoghurt, som gresk eller tyrkisk, røres ut med litt vann til konsistensen er omtrent som kefir. MatPrat oppgir ingen mengder for vannet.'], ['Dette endrer seg', 'Smaken blir en annen, men syren er med. Det betyr noe når oppskriften har natron.']],
        ['Kefir eller kulturmelk i stedet for melk', ['Forhold', 'TINE sier at du kan bytte ut melken med fløte, kefir, kulturmelk eller andre melkeprodukter. Oppskriften deres bruker ' + T('pann-melk') + ' dl melk.'], ['Dette endrer seg', 'Kilden beskriver ikke hvordan smak og konsistens endres.']],
      ])],
      ['Når oppskriften har natron', p('Idun forklarer at natron reagerer med syre, for eksempel surmelk, som inneholder melkesyre. Kefir, kulturmelk og yoghurt er sure. Vanlig melk er det ikke. Skal du bytte ut en syrlig melkevare i en oppskrift med natron, er det derfor best å bytte til en annen syrlig vare. Det er vår lesning av Idun, ikke en regel de gir. Se <a href="/erstatning/natron/">natron i stedet for bakepulver</a> og <a href="/erstatning/bakepulver/">bakepulver i stedet for natron</a>.')],
      ...app('Kefir og kulturmelk står ofte bakerst i kjøleskapet.'),
    ],
    faq: [
      ['Er kefir og kulturmelk det samme?', 'Nei, men MatPrat sier at de har mange likhetstrekk. Kefir er litt tykkere enn kulturmelk.'],
      ['Kan jeg bruke yoghurt i stedet for kefir?', 'Ja, ifølge MatPrat. Tykk yoghurt røres ut med litt vann til konsistensen er omtrent som kefir.'],
      ['Kan jeg bruke vanlig melk i stedet for kulturmelk?', 'Det avhenger av oppskriften. Har den natron, trenger den noe surt, og vanlig melk er ikke surt.'],
    ],
  }),

  bakepulver: (T) => ({
    gruppe: 'Baking', kort: 'Natron kan ta over, men bare når oppskriften har en syre.',
    tittel: 'Natron i stedet for bakepulver: forhold og regel',
    h1: 'Hva kan jeg bruke i stedet for bakepulver?',
    beskrivelse: 'Idun oppgir at en teskje bakepulver kan erstattes med en fjerdedels teskje natron, men bare hvis oppskriften har en syre. Se forholdet og vekten.',
    ingress: 'Har du natron, men ikke bakepulver? Da kan du ofte klare deg. Det avhenger av om oppskriften har noe surt i seg.',
    svar: 'Idun oppgir at når oppskriften har en syre, for eksempel surmelk, kan ' + T('bp-ts') + ' ts bakepulver erstattes med ' + T('natron-ts') + ' ts natron. Har oppskriften ingen syre, kan natron ikke erstatte bakepulver.',
    steg: [['Se etter syre', 'Surmelk eller noe tilsvarende i ingredienslista?'], ['Regn om', T('bp-ts') + ' ts bakepulver blir ' + T('natron-ts') + ' ts natron.'], ['Ingen syre?', 'Da virker ikke natron alene.']],
    kilder: ['idun-heve', 'idun-omregning'],
    seksjoner: [
      ['Slik regner du om', kortListe([
        ['Natron når oppskriften har en syre', ['Forhold', T('bp-ts') + ' ts bakepulver kan erstattes med ' + T('natron-ts') + ' ts natron (Idun).'], ['Dette endrer seg', 'Natron reagerer med syren, for eksempel melkesyren i surmelk. Du bruker altså noe av syren i oppskriften i stedet for syren som ligger i bakepulveret.']],
        ['Natron når oppskriften ikke har syre', ['Forhold', 'Det går ikke, sier Idun, så lenge oppskriften ikke inneholder en form for syre.'], ['Dette endrer seg', 'Bakepulver har syre med i pakken, så du trenger ikke tilsette surmelk. Natron har ikke det.']],
      ])],
      ['Hvorfor bakepulver er enklere', p('Idun skriver at bakepulver inneholder syrer og natron, og at du derfor ikke trenger å tilsette surmelk eller andre sure ingredienser. Bakepulver reagerer i to trinn: i kontakt med væske og under steking. Bakepulver brukes ofte i muffins og formkaker, men også i deig til scones.')],
      ['Hvis oppskriften oppgir gram', p('Idun oppgir at en teskje bakepulver veier ' + T('bp-g-ts') + ' gram og en teskje natron ' + T('natron-g-ts') + ' gram. Veier du i stedet for å måle, må du ikke blande dem sammen: de har ikke lik vekt per teskje. Hornsalt er et tredje hevemiddel. Idun skriver at det passer best til flate kaker som stekes ved høy temperatur, og gir ikke noe forhold til bakepulver.')],
      ...app('Det er lett å overse hevemiddelet når du leser en oppskrift raskt.'),
    ],
    faq: [
      ['Hvor mye natron tilsvarer en teskje bakepulver?', 'Idun oppgir ' + T('natron-ts') + ' ts natron for ' + T('bp-ts') + ' ts bakepulver, når oppskriften har en syre.'],
      ['Kan jeg bruke natron uten surmelk?', 'Bare hvis oppskriften har en annen syre. Uten syre kan ikke natron erstatte bakepulver, sier Idun.'],
      ['Hva er hornsalt?', 'Et hevemiddel. Idun skriver at det er best egnet til flate kaker som stekes ved høy temperatur.'],
    ],
  }),

  natron: (T) => ({
    gruppe: 'Baking', kort: 'Bakepulver kan ta over, men du må bruke mer enn du ville brukt natron.',
    tittel: 'Bakepulver i stedet for natron: hva må du passe på?',
    h1: 'Kan jeg bruke bakepulver i stedet for natron?',
    beskrivelse: 'Idun sier at bakepulver kan erstatte natron, men at du må bruke en større mengde. Vi gjengir hva kilden sier og hva den ikke gir noe tall på.',
    ingress: 'Oppskriften sier natron, og du har bare bakepulver. Det går, men ikke i samme mengde.',
    svar: 'Idun skriver at bakepulver kan erstatte natron, siden bakepulver allerede inneholder natron. Du må bruke en større mengde bakepulver. Idun oppgir ikke hvor mye mer, så vi gir ikke et tall.',
    steg: [['Bytt', 'Bakepulver kan erstatte natron.'], ['Bruk mer', 'Idun sier en større mengde, men ikke hvor mye.'], ['Hold igjen på surmelken', 'Bakepulver har syre med.']],
    kilder: ['idun-heve', 'idun-omregning'],
    seksjoner: [
      ['Hva som er likt og hva som er ulikt', kortListe([
        ['Natron', ['Hva det er', 'Idun beskriver natron som et hvitt pulver, natriumkarbonat, som hovedsakelig brukes som hevemiddel i baking.'], ['Hva det trenger', 'Det reagerer med syrer, for eksempel surmelk. Derfor har mange natronoppskrifter surmelk.']],
        ['Bakepulver', ['Hva det er', 'En blanding som ifølge Idun vanligvis har ett eller to surhetsregulerende midler, en stivelse og natron.'], ['Hva det trenger', 'Ingenting ekstra. Bakepulver inneholder syrer, så du trenger ikke tilsette surmelk eller andre sure ingredienser.']],
      ])],
      ['Hvorfor du må bruke mer', p('Idun forklarer at bakepulver består av natron, syrer og stivelse. Natron er altså bare en del av pulveret. Vi har ikke funnet en norsk kilde som oppgir en faktor, og gir derfor ikke et tall.')],
      ['Vekt, hvis oppskriften bruker gram', p('Idun oppgir at en spiseskje natron veier ' + T('natron-g-ss') + ' gram og en spiseskje bakepulver ' + T('bp-g-ss') + ' gram. En teskje er ' + T('ts-ml') + ' milliliter. Tallene gjelder skjeer av samme størrelse, men de viser at de to pulverne ikke har lik vekt. Bruker oppskriften gram, kan du ikke bytte rett over.')],
      ...app('Det er lett å ta feil av hevemidlene når oppskriften er på et annet språk.'),
    ],
    faq: [
      ['Kan bakepulver erstatte natron?', 'Ja, ifølge Idun, siden bakepulver allerede inneholder natron. Du må bruke en større mengde bakepulver.'],
      ['Hvor mye mer bakepulver trenger jeg?', 'Idun oppgir ikke noe tall. Vi vil heller ikke gjette.'],
      ['Må jeg ha surmelk i røren?', 'Ikke når du bruker bakepulver. Idun sier at bakepulver inneholder syrer, så du trenger ikke tilsette surmelk eller andre sure ingredienser.'],
    ],
  }),

  gjaer: (T) => ({
    gruppe: 'Baking', kort: 'Fersk mot tørr gjær: en pakke mot en pose, og lenger heving.',
    tittel: 'Fersk gjær mot tørrgjær: slik bytter du',
    h1: 'Hva kan jeg bruke i stedet for fersk gjær eller tørrgjær?',
    beskrivelse: 'Idun oppgir at en pakke fersk gjær tilsvarer en pose tørrgjær. Se omregningen, hevetiden og hvor varm væsken kan være for hver type.',
    ingress: 'Fersk gjær og tørrgjær kan bytte plass. Omregningen er enkel, men heving og væsketemperatur er ulik.',
    svar: 'Idun oppgir at ' + T('pakke') + ' pakke fersk gjær tilsvarer ' + T('pose') + ' pose tørrgjær, og at en halv pakke fersk gjær tilsvarer ca. ' + T('halv-ts') + ' ts tørrgjær. Med tørrgjær må du regne med litt lenger hevetid.',
    steg: [['Regn om', T('pakke') + ' pakke fersk gjær er ' + T('pose') + ' pose tørrgjær.'], ['Regn lenger tid', 'Tørrgjær trenger litt lenger hevetid.'], ['Sjekk væsken', 'Under ' + T('vaeske-fersk') + ' grader for fersk, opptil ' + T('vaeske-torr') + ' grader for tørr.']],
    kilder: ['idun-gjaer-mengde', 'idun-gjaer', 'idun-baketips', 'idun-sporsmal', 'idun-heve'],
    seksjoner: [
      ['Omregning begge veier', kortListe([
        ['Tørrgjær i stedet for fersk gjær', ['Forhold', T('pakke') + ' pakke fersk gjær (' + T('pakke-g') + ' g) tilsvarer ' + T('pose') + ' pose tørrgjær. En halv pakke tilsvarer ca. ' + T('halv-ts') + ' ts tørrgjær. Idun oppgir at en pose rommer ca. ' + T('pose-ts') + ' ts.'], ['Dette endrer seg', 'Tørrgjær bruker lenger tid på å sette i gang heveprosessen, uansett væskens temperatur. Regn med litt lenger hevetid.']],
        ['Fersk gjær i stedet for tørrgjær', ['Forhold', 'Samme omregning motsatt vei: en pose tørrgjær tilsvarer en pakke fersk gjær.'], ['Dette endrer seg', 'Idun oppgir at væsken ikke bør bli varmere enn ' + T('vaeske-fersk') + ' grader med fersk gjær. Tørrgjær tåler væske opptil ' + T('vaeske-torr') + ' grader.']],
      ])],
      ['Slik rører du gjæren inn', p('Tørrgjær kan blandes direkte i de tørre ingrediensene. Elter du for hånd, er det en fordel å røre ut fersk gjær i væsken først, skriver Idun. Idun skriver også at du ikke trenger sukker i deigen for at den skal heve med gjær.')],
      ['Hva Idun råder til', p('Idun råder deg til å tenke ekstra nøye gjennom oppskriften før du velger en annen gjærtype enn den som står der. Vil du ha lengre holdbarhet på varen du kjøper, anbefaler de tørrgjær. Vi har ikke en kilde som sammenligner smaken på brødet.')],
      ...app('Gjær står ofte i oppskriften uten at du husker hvilken type du har.'),
    ],
    faq: [
      ['Hvor mye tørrgjær tilsvarer en pakke fersk gjær?', 'Idun oppgir en pose tørrgjær for en pakke fersk gjær på ' + T('pakke-g') + ' gram.'],
      ['Må jeg heve lenger med tørrgjær?', 'Ja, litt lenger, sier Idun.'],
      ['Kan jeg bruke varm væske med tørrgjær?', 'Idun oppgir at væsken kan være opptil ' + T('vaeske-torr') + ' grader med tørrgjær, men ikke over ' + T('vaeske-fersk') + ' grader med fersk gjær.'],
    ],
  }),

  smor: (T) => ({
    gruppe: 'Meieri', kort: 'Olje eller Melange uten melk i muffinsrøren, og hva smør og olje veier.',
    tittel: 'Hva kan jeg bruke i stedet for smør i baking?',
    h1: 'Hva kan jeg bruke i stedet for smør?',
    beskrivelse: 'Idun viser at olje eller Melange uten melk kan erstatte smør i muffinsrøren. Se hva som må endres i framgangsmåten, og hva smør og olje veier per dl.',
    ingress: 'Smøret er brukt opp midt i baketurnen. Idun viser to bytter, og det ene krever at du rører røren på en annen måte.',
    svar: 'Idun viser at olje kan erstatte smør i muffins, men at framgangsmåten da må endres: du tilsetter oljen vekselvis med sammenvispet egg. Idun nevner også Melange uten melk. Muffinsoppskriften deres bruker ' + T('muffins-smor') + ' g smeltet smør, og Melange er oppgitt som alternativ. Vi har ikke et tall for hvor mye olje det tilsvarer.',
    steg: [['Velg olje eller Melange', 'Begge står i Iduns muffinsoppskrift.'], ['Endre framgangsmåten ved olje', 'Tørre ingredienser først, så olje og egg vekselvis.'], ['Veie, ikke måle', 'Smør og olje veier ' + T('smor-dl') + ' g per dl.']],
    kilder: ['idun-muffins', 'idun-omregning'],
    seksjoner: [
      ['To bytter fra Idun', kortListe([
        ['Olje', ['Forhold', 'Idun gir ikke et tall som regner smør om til olje. Tabellen deres viser at en dl olje og en dl smeltet smør veier like mye, ' + T('olje-dl') + ' gram. Det sier at vekten er lik per dl, men Idun sier ikke at oppskriften blir lik.'], ['Dette endrer seg', 'Framgangsmåten. Du blander først alle tørre ingredienser i en bolle og tilsetter oljen vekselvis med sammenvispet egg.']],
        ['Melange uten melk', ['Forhold', 'I Iduns muffinsoppskrift står ' + T('muffins-smor') + ' g smeltet smør, og Melange uten melk er oppgitt som alternativ.'], ['Dette endrer seg', 'Idun skriver ikke noe om smak eller konsistens.']],
      ])],
      ['Når oppskriften oppgir skjeer', p('Idun oppgir at en spiseskje smeltet smør veier ' + T('smor-ss') + ' gram, og en dl veier ' + T('smor-dl') + ' gram. Det er tall for smeltet smør. Er smøret hardt, er vekten per skje ikke den samme, og vi har ikke en kilde for det.')],
      ...app('Det er enklere å se hva du har til overs i kjøleskapet enn å lete i skapene.'),
    ],
    faq: [
      ['Kan jeg bruke olje i stedet for smør i muffins?', 'Ja, Idun viser det. Framgangsmåten må endres litt, og oljen tilsettes vekselvis med egget.'],
      ['Hvor mye olje tilsvarer ' + T('muffins-smor') + ' gram smør?', 'Idun oppgir ikke det. Vi gir ikke et tall vi ikke har en kilde for.'],
      ['Veier olje og smør like mye?', 'Per dl gjør de det, ifølge Iduns tabell: ' + T('smor-dl') + ' gram for smeltet smør og ' + T('olje-dl') + ' gram for olje.'],
    ],
  }),

  floete: (T) => ({
    gruppe: 'Meieri', kort: 'Matfløte, kaffefløte og kremfløte: hva som tåler koking og hva som kan piskes.',
    tittel: 'Hva kan jeg bruke i stedet for fløte?',
    h1: 'Hva kan jeg bruke i stedet for fløte?',
    beskrivelse: 'Kremfløte, matfløte og kaffefløte er ulike. Se fettprosentene fra melk.no, hva som tåler koking, og hvorfor bare kremfløte kan piskes.',
    ingress: 'Fløte er ikke én vare. Hva du kan bytte til, avhenger av om du koker eller pisker.',
    svar: 'Melk.no oppgir at kremfløte har ' + T('krem-min') + ' til ' + T('krem-maks') + ' prosent fett, matfløte ' + T('mat-lett') + ' eller ' + T('mat-fyldig') + ' prosent, og kaffefløte ' + T('kaffe') + ' prosent. Bare kremfløte kan piskes. I mat kan matfløte ta over, og den med ' + T('mat-fyldig') + ' prosent tåler småkoking.',
    steg: [['Pisker du?', 'Da må det være kremfløte.'], ['Koker du?', 'Matfløte med ' + T('mat-fyldig') + ' prosent tåler småkoking.'], ['Bruker du kaffefløte?', 'Den tåler bare et raskt oppkok.']],
    kilder: ['melk-kremflote', 'melk-matflote', 'melk-kaffeflote'],
    seksjoner: [
      ['Tre typer, tre bruksområder', kortListe([
        ['Matfløte i stedet for kremfløte, i mat', ['Fett', T('mat-lett') + ' eller ' + T('mat-fyldig') + ' prosent, mot ' + T('krem-min') + ' til ' + T('krem-maks') + ' prosent i kremfløte.'], ['Dette endrer seg', 'Melk.no kaller matfløte en magrere fløte som passer til supper, sauser og gryteretter. Med ' + T('mat-fyldig') + ' prosent fett tåler den småkoking. Med ' + T('mat-lett') + ' prosent tåler den bare et raskt oppkok før den skiller seg. Den kan ikke piskes til krem.']],
        ['Kaffefløte i stedet for kremfløte, i mat', ['Fett', T('kaffe') + ' prosent.'], ['Dette endrer seg', 'Melk.no skriver at kaffefløte kan brukes i matlaging, men tåler bare et raskt oppkok før den skiller seg.']],
        ['Noe annet i stedet for kremfløte, til pisking', ['Svar', 'Melk.no skriver at det bare er kremfløte som kan vispes til krem til kaker og desserter. Matfløte kan ikke piskes.'], ['Dette endrer seg', 'Vi har ikke funnet en norsk fagkilde på et bytte som pisker like godt. Vi nevner derfor ingen.']],
      ])],
      ['Hvis du har fløte til overs', p('Melk.no foreslår å fryse fløte som blir til overs i isbitformer eller isbitposer. Du har da en fløteterning som går rett i sauser og supper.')],
      ...app('Fløten blir ofte stående i kjøleskapet til datoen nærmer seg.'),
    ],
    faq: [
      ['Kan jeg piske matfløte?', 'Nei. Melk.no skriver at matfløte ikke kan piskes til krem. Bare kremfløte kan det.'],
      ['Tåler kaffefløte koking?', 'Bare et raskt oppkok, før den skiller seg, ifølge melk.no.'],
      ['Hvor mye fett er det i kremfløte?', 'Melk.no oppgir ' + T('krem-min') + ' til ' + T('krem-maks') + ' prosent.'],
    ],
  }),

  'creme-fraiche': (T) => ({
    gruppe: 'Meieri', kort: 'Rømme, kvarg og matyoghurt: hva som tåler varme og hva som skiller seg.',
    tittel: 'Hva kan jeg bruke i stedet for crème fraîche?',
    h1: 'Hva kan jeg bruke i stedet for crème fraîche?',
    beskrivelse: 'Crème fraîche tåler koking. Se hva melk.no sier om rømme, kvarg og matyoghurt i varme retter, og når de må tilsettes først ved servering.',
    ingress: 'Det som gjør crème fraîche spesiell i mat, er at den ikke skiller seg når den koker. Det er også det som avgjør hva du kan bytte til.',
    svar: 'Melk.no skriver at crème fraîche ikke skiller seg ved koking. Rømme, kvarg og matyoghurt gjør det. De tåler ikke småkoking, og må tilsettes rett før servering. I kalde retter er alle tre fine alternativer.',
    steg: [['Er retten varm?', 'Da er crème fraîche lettest å ta over for.'], ['Har du rømme eller matyoghurt?', 'Rør den inn like før servering.'], ['Er retten kald?', 'Da går de fleste meierivarer.']],
    kilder: ['melk-cf', 'melk-suppe', 'melk-dress'],
    seksjoner: [
      ['Fire bytter i varm mat', kortListe([
        ['Rømme', ['Forhold', 'Melk.no oppgir ikke forhold. De sier at rømme må tilsettes varme retter like før servering.'], ['Dette endrer seg', 'Rømme er ikke kokestabil. Seterrømme tåler et raskt oppkok, men sprekker hvis den står og småkoker, skriver melk.no. Lettrømme må kun tilsettes like før servering.']],
        ['Matyoghurt', ['Forhold', 'Melk.no oppgir ingen mengder. Den har ' + T('matyoghurt-min') + ' til ' + T('matyoghurt-maks') + ' prosent fett.'], ['Dette endrer seg', 'Matyoghurt er ikke kokestabil og bør tilsettes varme retter mot slutten av koketiden eller ved servering. Melk.no skriver at den passer i gryteretter, supper og sauser.']],
        ['Kvarg (for eksempel Kesam)', ['Forhold', 'Ingen mengde oppgitt.'], ['Dette endrer seg', 'Kvarg skiller seg ved koking og egner seg derfor ikke i varme retter. Melk.no skriver at den egner seg best tilsatt i suppen ved servering.']],
        ['Lett crème fraîche', ['Fett', 'Melk.no oppgir at det finnes lette varianter med ' + T('lett') + ' prosent fett.'], ['Dette endrer seg', 'Melk.no skriver at de lette variantene også tåler småkoking, og at de er stabilisert for å holde konsistensen.']],
      ])],
      ['Hvorfor crème fraîche tåler varme', p('Melk.no forklarer at crème fraîche er homogenisert under høyt trykk for at den skal være kokestabil. Rømme er homogenisert under svært lavt trykk for at den skal skille ut fett ved tilberedning av rømmegrøt. Det er forskjellen du står overfor når du bytter.', 'Crème fraîche er også litt tynnere enn seterrømme. Det gjelder alle bytter den andre veien: se <a href="/erstatning/romme/">hva du kan bruke i stedet for rømme</a>.')],
      ...app('Det er enkelt å havne i en saus der du skulle hatt noe som tåler varme.'),
    ],
    faq: [
      ['Kan jeg bruke rømme i stedet for crème fraîche i en saus?', 'Bare hvis du rører den inn like før servering. Melk.no skriver at rømme ikke er kokestabil.'],
      ['Kan jeg bruke kvarg i stedet for crème fraîche?', 'Ikke i varme retter. Melk.no skriver at kvarg skiller seg ved koking. Den passer i kalde retter og kan røres inn ved servering.'],
      ['Hvorfor skiller ikke crème fraîche seg?', 'Melk.no skriver at den er homogenisert under høyt trykk for å være kokestabil.'],
    ],
  }),

  romme: (T) => ({
    gruppe: 'Meieri', kort: 'Crème fraîche, kvarg og matyoghurt, og hvorfor rømmegrøt er et unntak.',
    tittel: 'Hva kan jeg bruke i stedet for rømme?',
    h1: 'Hva kan jeg bruke i stedet for rømme?',
    beskrivelse: 'Crème fraîche, kvarg og matyoghurt kan ta over for rømme i mat og dressinger. Melk.no forklarer forskjellene, og hvorfor rømmegrøt er et unntak.',
    ingress: 'Rømme brukes kald, varm og i baking. Da blir byttet ulikt fra rett til rett.',
    svar: 'I kalde retter nevner melk.no kvarg som et magrere alternativ til rømme. Crème fraîche kan brukes i alle varme retter og i bakverk. Til rømmegrøt er det rømme som gjelder, siden den er laget for å skille ut fett.',
    steg: [['Kald rett?', 'Kvarg, matyoghurt eller crème fraîche.'], ['Varm rett?', 'Crème fraîche, som ikke skiller seg.'], ['Rømmegrøt?', 'Da skal det være rømme.']],
    kilder: ['melk-romme', 'melk-cf', 'melk-dress'],
    seksjoner: [
      ['Slik passer byttene', kortListe([
        ['Crème fraîche', ['Forhold', 'Melk.no oppgir ingen mengdeforhold. Crème fraîche kan brukes i alle varme retter, som sauser, supper, gryteretter, gratenger, bakverk og desserter.'], ['Dette endrer seg', 'Den er litt tynnere enn seterrømme. Melk.no oppgir at rømme med ' + T('romme-min') + ' til ' + T('romme-maks') + ' prosent fett er tykk og fyldig med frisk smak.']],
        ['Kvarg', ['Forhold', 'Ingen mengde oppgitt.'], ['Dette endrer seg', 'Melk.no kaller den et magrere alternativ til rømme i kalde retter, med fyldig og tykk konsistens og frisk, syrlig smak. Den skiller seg ved koking.']],
        ['Matyoghurt', ['Forhold', 'Ingen mengde oppgitt. Den har ' + T('matyoghurt-min') + ' til ' + T('matyoghurt-maks') + ' prosent fett.'], ['Dette endrer seg', 'Melk.no skriver at den egner seg svært godt i gryteretter, dressinger, dipp, supper, sauser, desserter, kaker og bakverk. Tilsett den mot slutten av koketiden eller ved servering.']],
      ])],
      ['Rømmegrøt er et unntak', p('Melk.no forklarer at rømme med ' + T('romme-min') + ' til ' + T('romme-maks') + ' prosent fett er homogenisert under svært lavt trykk for at den skal skille ut fett ved tilberedning av rømmegrøt. Crème fraîche er laget for å gjøre det motsatte. Vi har derfor ikke funnet en kilde som anbefaler crème fraîche til rømmegrøt.')],
      ['Når rømme skal i varm mat', p('Det motsatte spørsmålet er også vanlig: kan du bruke rømme i varm mat? Melk.no skriver at rømme ikke er kokestabil og må tilsettes varme retter like før servering. Se <a href="/erstatning/creme-fraiche/">crème fraîche i stedet for rømme</a>.')],
      ...app('Rømmen går ofte tom midt i en matlagingsøkt.'),
    ],
    faq: [
      ['Kan jeg bruke crème fraîche i stedet for rømme i baking?', 'Melk.no skriver at crème fraîche kan brukes i bakverk og desserter. Den er litt tynnere enn seterrømme.'],
      ['Kan jeg bruke kvarg i stedet for rømme?', 'I kalde retter, ja. Melk.no kaller kvarg et magrere alternativ til rømme der.'],
      ['Hva er forskjellen på rømme og crème fraîche?', 'Rømme er homogenisert så den skiller ut fett, og crème fraîche så den tåler koking, ifølge melk.no.'],
    ],
  }),

  melk: (T) => ({
    gruppe: 'Meieri', kort: 'Plantedrikker, kefir eller yoghurt i stedet for melk i røren.',
    tittel: 'Hva kan jeg bruke i stedet for melk i baking?',
    h1: 'Hva kan jeg bruke i stedet for melk i baking?',
    beskrivelse: 'Idun, TINE og melk.no viser hva som kan ta plassen til melk i en røre: havre-, ris- og soyadrikk, kefir, kulturmelk, rømme og yoghurt.',
    ingress: 'Melk i en røre kan ofte byttes, men smaken blir en annen.',
    svar: 'Idun viser at ris-, mandel- og havremelk kan erstatte melk i muffins, og at havremelk i pannekaker kan byttes med rismelk eller soyamelk. TINE sier at du kan bytte melk med fløte, kefir eller kulturmelk. Melk.no foreslår rømme, cottage cheese, yoghurt eller kvarg i stedet for litt av melken i vafler.',
    steg: [['Velg drikke eller melkevare', 'Plantedrikk, kefir, kulturmelk eller yoghurt.'], ['Regn med smak', 'Idun sier at smaken blir en litt annen.'], ['Bytt bare litt?', 'I vafler kan en del av melken byttes.']],
    kilder: ['idun-muffins', 'idun-pannekaker', 'tine-protein', 'melk-vafler'],
    seksjoner: [
      ['Fire bytter fra fire oppskrifter', kortListe([
        ['Ris-, mandel- eller havremelk', ['Forhold', 'Samme mengde som melken i oppskriften. Iduns muffinsoppskrift bruker ' + T('muffins-melk') + ' dl melk og oppgir ris-, mandel- eller havremelk som alternativ.'], ['Dette endrer seg', 'Kilden skriver ikke om smak her.']],
        ['Rismelk eller soyamelk i stedet for havremelk', ['Forhold', 'Iduns pannekakerøre uten egg og melk bruker ' + T('pann-havre') + ' dl havremelk og skriver at den kan byttes med blant annet rismelk eller soyamelk.'], ['Dette endrer seg', 'Idun skriver at smaken blir en litt annen når havremelken byttes.']],
        ['Fløte, kefir eller kulturmelk', ['Forhold', 'TINE sier at du kan bytte ut melken med det. Oppskriften deres bruker ' + T('pann-melk') + ' dl melk.'], ['Dette endrer seg', 'Kilden beskriver ikke endringen.']],
        ['Rømme, cottage cheese, yoghurt eller kvarg', ['Forhold', 'Melk.no sier at du kan erstatte litt av melken som står i vaffeloppskriften. De oppgir ikke hvor mye.'], ['Dette endrer seg', 'Kilden beskriver ikke endringen i konsistens.']],
      ])],
      ...app('Du ser lett hva du har av melkevarer, drikker og yoghurt når du åpner spiskammeret.'),
    ],
    faq: [
      ['Kan jeg bruke havremelk i stedet for melk?', 'Ja. Idun oppgir ris-, mandel- eller havremelk som alternativ i muffins.'],
      ['Hva skjer med smaken?', 'Idun skriver at smaken blir en litt annen når havremelk byttes mot ris- eller soyamelk.'],
      ['Kan jeg bytte melken med kefir?', 'TINE sier at du kan bytte ut melken med fløte, kefir, kulturmelk eller andre melkeprodukter i pannekaker.'],
    ],
  }),

  hvetemel: (T) => ({
    gruppe: 'Baking', kort: 'Glutenfritt mel, sammalt mel, havregryn og potetmel, og hva mel veier.',
    tittel: 'Hva kan jeg bruke i stedet for hvetemel?',
    h1: 'Hva kan jeg bruke i stedet for hvetemel?',
    beskrivelse: 'MatPrat, melk.no og Idun viser hva som kan ta over for hvetemel: glutenfritt mel, sammalt mel, havregryn og potetmel. Se også vekt per dl.',
    ingress: 'Mel er ikke bare mel. Hva du kan bytte til, avhenger av hva du bakker.',
    svar: 'MatPrat sier at mel i kaker kan erstattes med glutenfritt mel, og at det stort sett brukes samme melmengde. Melk.no viser at en del av hvetemelet i vafler kan byttes med sammalt hvetemel eller havregryn. Potetmel kan også brukes i en sukkerbunn.',
    steg: [['Kake?', 'Glutenfritt mel, stort sett samme mengde.'], ['Vafler?', 'Bytt en del med sammalt mel eller havregryn.'], ['Sukkerbrød?', 'Potetmel gir en lettere tekstur.']],
    kilder: ['mp-glutenfri', 'melk-vafler', 'melk-sukkerbrod', 'idun-omregning'],
    seksjoner: [
      ['Tre bytter', kortListe([
        ['Glutenfritt mel i kaker', ['Forhold', 'MatPrat: I kaker kan mel erstattes med glutenfritt mel. Stort sett brukes samme melmengde. Sjekk produsentens anvisninger.'], ['Dette endrer seg', 'MatPrat beskriver ikke endringen i smak eller konsistens for kaker. Siden er fra 2017.']],
        ['Sammalt hvetemel eller havregryn i vafler', ['Forhold', 'Melk.no sier at du kan erstatte deler av hvetemelet. De oppgir ikke hvor mye.'], ['Dette endrer seg', 'Melk.no skriver at grove vafler med havregryn smaker godt med ost og skinke, eller med brunost og litt syltetøy.']],
        ['Potetmel i en sukkerbunn', ['Forhold', 'Melk.nos oppskrift bruker ' + T('sukkerbunn-potetmel') + ' ss potetmel sammen med ' + T('sukkerbunn-hvetemel') + ' g hvetemel.'], ['Dette endrer seg', 'Potetmel absorberer og holder på fuktigheten i større grad enn hvetemel, og kaken får derfor en lettere tekstur og bedre hold, skriver melk.no.']],
      ])],
      ['Vekt, ikke volum', p('Idun oppgir at en dl hvetemel veier ' + T('hvetemel-dl') + ' gram, og at en dl potetmel veier ' + T('potetmel-dl') + ' gram. Bytter du mel etter volum, får du altså ikke samme vekt. Oppskrifter som oppgir gram, bør du veie. Vi har ikke tall for andre melsorter.')],
      ...app('Mel er den varen oppskrifter oftest endrer seg mest på.'),
    ],
    faq: [
      ['Kan jeg bruke samme mengde glutenfritt mel?', 'MatPrat skriver at det stort sett brukes samme melmengde i kaker, men at du bør sjekke produsentens anvisning.'],
      ['Hva veier en dl hvetemel?', 'Idun oppgir ' + T('hvetemel-dl') + ' gram.'],
      ['Hvorfor potetmel i sukkerbrød?', 'Melk.no skriver at potetmel holder på fuktigheten og gir en lettere tekstur og bedre hold i kaken.'],
    ],
  }),

  maisenna: (T) => ({
    gruppe: 'Matlaging', kort: 'Hvetemel eller potetmel til jevning, og hva som skiller seg.',
    tittel: 'Hva kan jeg bruke i stedet for maisenna?',
    h1: 'Hva kan jeg bruke i stedet for maisenna?',
    beskrivelse: 'TINE oppgir hvetemel eller maisenna til jevning av saus, og Idun sier potetmel kan erstatte maisenna i krem. Se mengdene og hva som skiller seg.',
    ingress: 'Maisenna jevner sauser og kremer. Hvetemel og potetmel kan gjøre samme jobb, men ikke likt.',
    svar: 'TINE oppgir til ' + T('saus-kraft') + ' dl kraft enten ' + T('saus-mel') + ' ss hvetemel eller ' + T('saus-mais-min') + ' til ' + T('saus-mais-maks') + ' ts maisenna. Idun sier at potetmel kan brukes i stedet for maisenna i vaniljekrem, men at den skiller seg lettere.',
    steg: [['Saus', 'Hvetemel i stedet for maisenna, i større mengde.'], ['Krem', 'Potetmel går, men bruk kremen samme dag.'], ['Varm opp', 'Jevningen må varmes for å tykne.']],
    kilder: ['tine-lyssaus', 'idun-vaniljekrem', 'snl-jevning'],
    seksjoner: [
      ['To bytter', kortListe([
        ['Hvetemel i stedet for maisenna, i lys saus', ['Forhold', 'TINE: til ' + T('saus-kraft') + ' dl kraft brukes ' + T('saus-mel') + ' ss hvetemel eller ' + T('saus-mais-min') + ' til ' + T('saus-mais-maks') + ' ts maisenna.'], ['Dette endrer seg', 'Du bruker mer mel enn maisenna, men tallene gjelder bare denne sausen. SNL beskriver en meljevning som like deler hvetemel og fett, typisk smør.']],
        ['Potetmel i stedet for maisenna, i krem', ['Forhold', 'Idun oppgir ikke noe forhold.'], ['Dette endrer seg', 'Idun skriver at potetmel kan brukes i stedet for maisenna, men skiller seg lettere. Vaniljekrem laget med potetmel bør derfor brukes samme dag.']],
      ])],
      ['Det gjelder for all jevning', p('SNL skriver at jevning av maisstivelse (maisenna) eller potetmel blandet med vann er glutenfri, i motsetning til meljevning. Jevningen må varmebehandles for at den skal tykne. Rør den ut og varm den opp.')],
      ...app('Det er lett å ha mel hjemme, men ikke maisenna, akkurat når sausen skal jevnes.'),
    ],
    faq: [
      ['Kan jeg bruke hvetemel i stedet for maisenna?', 'TINE gir begge i samme saus: ' + T('saus-mel') + ' ss hvetemel eller ' + T('saus-mais-min') + ' til ' + T('saus-mais-maks') + ' ts maisenna per ' + T('saus-kraft') + ' dl kraft.'],
      ['Kan jeg bruke potetmel i vaniljekrem?', 'Ja, ifølge Idun, men den skiller seg lettere og bør brukes samme dag.'],
      ['Må jevning varmes?', 'Ja. SNL skriver at jevningen må varmebehandles for at den skal tykne.'],
    ],
  }),

  sukker: (T) => ({
    gruppe: 'Sukker og smak', kort: 'Melis, demerarasukker, og hvorfor du bør veie.',
    tittel: 'Hva kan jeg bruke i stedet for sukker?',
    h1: 'Hva kan jeg bruke i stedet for sukker?',
    beskrivelse: 'Melis og demerarasukker kan ta over for vanlig sukker. Idun og Dansukker viser forskjellene, og hvorfor veiing gir mindre feil enn måling i dl.',
    ingress: 'Sukker er ikke bare hvitt sukker. Å bytte til melis eller brunt sukker er enkelt, hvis du veier.',
    svar: 'Idun oppgir ' + T('muffins-sukker') + ' g sukker eller melis i samme muffinsoppskrift, altså lik vekt. Per dl veier de derimot ulikt: ' + T('sukker-dl') + ' g for sukker og ' + T('melis-dl') + ' g for melis. Dansukker skriver at demerarasukker kan brukes på samme måte som vanlig sukker.',
    steg: [['Veie', 'Gram gir riktigere bytte enn dl.'], ['Melis', 'Samme vekt som sukker i Iduns muffins.'], ['Demerara', 'Kan brukes som vanlig sukker, med en annen smak.']],
    kilder: ['idun-muffins', 'idun-omregning', 'dan-demerara', 'melk-vafler'],
    seksjoner: [
      ['Tre bytter', kortListe([
        ['Melis i stedet for sukker', ['Forhold', 'Iduns muffinsoppskrift oppgir ' + T('muffins-sukker') + ' g sukker (eller melis). Samme vekt.'], ['Dette endrer seg', 'Per dl veier melis ' + T('melis-dl') + ' g og sukker ' + T('sukker-dl') + ' g. Måler du i dl, får du derfor mindre sukker i vekt med melis enn med sukker. Veier du, blir vekten lik.']],
        ['Demerarasukker i stedet for sukker', ['Forhold', 'Dansukker: det kan brukes på samme måte som vanlig sukker. Per dl veier det ' + T('demerara-dl') + ' g ifølge Idun.'], ['Dette endrer seg', 'Dansukker beskriver en gyllen farge og en mild smak med lette toner av karamell.']],
        ['Mindre sukker, eller ingenting', ['Forhold', 'Melk.no skriver at du i vaffelrøren kan droppe sukkeret, og at du med en moden banan kan la bananen være søtningen.'], ['Dette endrer seg', 'Kilden gir ikke mengder.']],
      ])],
      ['Se også', p('Mangler du brunt sukker? Se <a href="/erstatning/brun-farin/">brun farin og demerarasukker</a>. Mangler du vaniljesukker? Se <a href="/erstatning/vaniljesukker/">vaniljesukker</a>.')],
      ...app('Sukker i oppskriften er ofte oppgitt i dl, og vekten blir feil når sorten byttes.'),
    ],
    faq: [
      ['Kan jeg bruke melis i stedet for sukker?', 'Ja, i Iduns muffinsoppskrift står sukker eller melis med lik vekt.'],
      ['Hva veier en dl sukker?', 'Idun oppgir ' + T('sukker-dl') + ' gram. En dl melis veier ' + T('melis-dl') + ' gram.'],
      ['Kan jeg lage vafler uten sukker?', 'Melk.no skriver at du kan droppe sukkeret i vaffelrøren.'],
    ],
  }),

  'brun-farin': (T) => ({
    gruppe: 'Sukker og smak', kort: 'Demerarasukker og en blanding av farin og sukker.',
    tittel: 'Hva kan jeg bruke i stedet for brun farin?',
    h1: 'Hva kan jeg bruke i stedet for brun farin?',
    beskrivelse: 'Dansukker foreslår demerarasukker i stedet for brun farin og oppgir en blanding av farin og sukker. Se hva farin består av og hva den veier.',
    ingress: 'Brun farin er sukker med sirup. Det forklarer både byttene og hvorfor smaken er litt annerledes.',
    svar: 'Dansukker skriver at brun farin er en blanding av sukker og rørsukkersirup, og foreslår demerarasukker i stedet for brun farin i Irish coffee. De oppgir også at ' + T('blanding-farin') + ' g brun farin og ' + T('blanding-sukker') + ' g sukker gir ' + T('blanding-sum') + ' g lys farin.',
    steg: [['Demerara', 'Dansukkers forslag som erstatning.'], ['Lys farin', 'Bland brun farin og sukker.'], ['Veie', 'En dl farin veier ca. ' + T('farin-dl') + ' g.']],
    kilder: ['dan-farin', 'dan-demerara', 'idun-omregning'],
    seksjoner: [
      ['To bytter', kortListe([
        ['Demerarasukker', ['Forhold', 'Dansukker skriver at det kan brukes på samme måte som vanlig sukker, og foreslår det i stedet for brun farin i Irish coffee. De gir ikke et forhold for andre retter.'], ['Dette endrer seg', 'Gyllen farge og mild smak med lette toner av karamell. Dansukker beskriver brun farin med en krydret aroma.']],
        ['Brun farin og sukker, til lys farin', ['Forhold', 'Bland ' + T('blanding-farin') + ' g brun farin med ' + T('blanding-sukker') + ' g sukker, så får du ' + T('blanding-sum') + ' g lys farin.'], ['Dette endrer seg', 'Du får lys farin. Det hjelper når oppskriften ber om lys farin og du bare har brun farin og sukker.']],
      ])],
      ['Hva vi ikke har funnet', p('Vi har ikke funnet en norsk fagkilde som oppgir hvordan du lager brun farin av vanlig sukker og sirup, så vi gir ikke et forhold. Dansukker skriver at brun farin er en blanding av sukker og rørsukkersirup.')],
      ['Vekt per dl', p('Idun oppgir at en dl brun farin veier ca. ' + T('farin-dl') + ' gram og en dl sukker ' + T('sukker-dl') + ' gram. Veier du, bytter du på vekt. Måler du, bytter du ikke på vekt.')],
      ...app('Det er lettere å se hva slags sukker du har, enn å huske det.'),
    ],
    faq: [
      ['Kan jeg bruke demerarasukker i stedet for brun farin?', 'Dansukker foreslår det i Irish coffee, og skriver at det kan brukes på samme måte som vanlig sukker.'],
      ['Hva er brun farin laget av?', 'Dansukker skriver at den er en blanding av sukker og rørsukkersirup.'],
      ['Hva veier en dl brun farin?', 'Idun oppgir ca. ' + T('farin-dl') + ' gram.'],
    ],
  }),

  vaniljesukker: (T) => ({
    gruppe: 'Sukker og smak', kort: 'Vaniljeessens, vaniljestang, vaniljepulver og vanillinsukker.',
    tittel: 'Hva kan jeg bruke i stedet for vaniljesukker?',
    h1: 'Hva kan jeg bruke i stedet for vaniljesukker?',
    beskrivelse: 'Idun og Dr. Oetker oppgir hvor mye vaniljeessens, vaniljestang og vanillinsukker som tilsvarer vaniljesukker. Se forholdene og forskjellen på dem.',
    ingress: 'Vanilje kommer i mange former. Her er hva som tilsvarer hva, med tall fra Idun og Dr. Oetker.',
    svar: 'Idun oppgir at du i muffins kan bruke ' + T('idun-essens') + ' ts vaniljeessens, ' + T('idun-sukker') + ' ts vaniljesukker eller frøene fra en halv vaniljestang. Dr. Oetker sier at ' + T('poser') + ' poser vaniljesukker tilsvarer en pose vanillinsukker.',
    steg: [['Essens', T('idun-essens') + ' ts tilsvarer ' + T('idun-sukker') + ' ts vaniljesukker.'], ['Vaniljestang', 'Frøene fra en halv stang, i samme muffinsoppskrift.'], ['Vanillinsukker', 'En pose tilsvarer ' + T('poser') + ' poser vaniljesukker.']],
    kilder: ['idun-muffins', 'oetker-sukker', 'oetker-ekstrakt'],
    seksjoner: [
      ['Slik bytter du', kortListe([
        ['Vaniljeessens eller vaniljeekstrakt', ['Forhold', 'Idun: ' + T('idun-essens') + ' ts vaniljeessens i muffinsoppskriften svarer til ' + T('idun-sukker') + ' ts vaniljesukker.'], ['Dette endrer seg', 'Dr. Oetker skriver at vaniljeekstrakt og vaniljeessens er det samme. Tallene gjelder én oppskrift, ikke en generell regel.']],
        ['Vaniljestang', ['Forhold', 'Idun: frøene fra en halv vaniljestang i samme muffinsoppskrift. Dr. Oetker oppgir at en vaniljestang tilsvarer ' + T('stang-min') + ' til ' + T('stang-maks') + ' ts vaniljeekstrakt.'], ['Dette endrer seg', 'Dr. Oetker anbefaler vaniljestang hvis du vil bruke et produkt med vanilje.']],
        ['Vaniljepulver', ['Forhold', 'Dr. Oetker oppgir rundt ' + T('pulver-g') + ' gram pulver som erstatning for ' + T('pulver-ts') + ' ts essens.'], ['Dette endrer seg', 'Dr. Oetker råder deg til å passe på hvor mye du legger til når du bruker andre vaniljeprodukter som erstatning.']],
        ['Vanillinsukker', ['Forhold', 'Dr. Oetker: ' + T('poser') + ' poser vaniljesukker tilsvarer en pose vanillinsukker.'], ['Dette endrer seg', 'Vanillinsukker har en mer intens smak, skriver Dr. Oetker. Det er ikke det samme som vaniljesukker.']],
      ])],
      ['Hva er vaniljesukker?', p('Dr. Oetker beskriver vaniljesukker som en blanding av sukker og finmalt vaniljestang. Vanillinsukker er noe annet. Den enkleste erstatningen for vaniljesukker, ifølge dem, er vanillinsukker.')],
      ...app('Vanilje står i så mange former at oppskrifter ofte bruker et annet navn enn det du har.'),
    ],
    faq: [
      ['Hvor mye vaniljeessens tilsvarer vaniljesukker?', 'Iduns muffinsoppskrift gir ' + T('idun-essens') + ' ts essens eller ' + T('idun-sukker') + ' ts vaniljesukker.'],
      ['Er vaniljesukker og vanillinsukker det samme?', 'Nei. Dr. Oetker skriver at ' + T('poser') + ' poser vaniljesukker tilsvarer en pose vanillinsukker, som har en mer intens smak.'],
      ['Er vaniljeessens og vaniljeekstrakt det samme?', 'Ja, ifølge Dr. Oetker.'],
    ],
  }),

  hvitvin: (T) => ({
    gruppe: 'Matlaging', kort: 'Eplejuice i suppe og saus, med tall fra to MatPrat-oppskrifter.',
    tittel: 'Hva kan jeg bruke i stedet for hvitvin i mat?',
    h1: 'Hva kan jeg bruke i stedet for hvitvin i mat?',
    beskrivelse: 'To MatPrat-oppskrifter bruker eplejuice som alternativ til hvitvin, i en suppe og en pastasaus. Se mengdene, og hva vi ikke har tall for.',
    ingress: 'Mangler du hvitvin, eller vil du ikke bruke den? MatPrat har eplejuice som alternativ i to oppskrifter.',
    svar: 'MatPrat oppgir ' + T('suppe') + ' dl hvitvin eller eplejuice i en kantarellsuppe, og ca. ' + T('kalkun') + ' dl eplejuice eller hvitvin i en kalkunrett med gorgonzola og pasta. I begge er byttet like mye som vinen.',
    steg: [['Bytt', 'Eplejuice i samme mengde som vinen.'], ['Smak til', 'Kilden sier ikke noe om smaken.'], ['Se på retten', 'Tallene gjelder suppe og en kremet pastasaus.']],
    kilder: ['mp-kantarell', 'mp-kalkun'],
    seksjoner: [
      ['Hva kilden viser', kortListe([
        ['Eplejuice i en kremet suppe', ['Forhold', 'MatPrats kantarellsuppe: ' + T('suppe') + ' dl hvitvin eller eplejuice.'], ['Dette endrer seg', 'MatPrat beskriver ikke endringen i smak.']],
        ['Eplejuice i en pastasaus', ['Forhold', 'MatPrats kalkun med gorgonzola og pasta: ca. ' + T('kalkun') + ' dl eplejuice eller hvitvin.'], ['Dette endrer seg', 'MatPrat beskriver heller ikke her endringen i smak.']],
      ])],
      ['Det vi ikke har', p('Vi har ikke funnet en norsk fagkilde som sammenligner eplejuice og hvitvin i smak, eller som gir et forhold for andre retter, for eksempel gryteretter, risotto eller fisk. Derfor gir vi ikke et generelt bytteforhold, bare det to oppskrifter viser. Spør i appen under hvis du trenger en erstatning for en annen rett.')],
      ...app('Hvitvin er en vare mange vil ha et alternativ til.'),
    ],
    faq: [
      ['Kan jeg bruke eplejuice i stedet for hvitvin?', 'MatPrat gjør det i to oppskrifter, i samme mengde som vinen.'],
      ['Hvor mye eplejuice tilsvarer hvitvin?', 'I begge oppskriftene er mengden ' + T('suppe') + ' dl, eller ca. ' + T('kalkun') + ' dl, for begge deler.'],
      ['Smaker det likt?', 'Kildene våre sier ikke noe om det.'],
    ],
  }),

  'friske-og-torkede-urter': (T) => ({
    gruppe: 'Matlaging', kort: 'To ss friske er en ts tørkede, og timian er et unntak.',
    tittel: 'Fersk eller tørket urt: hvor mye skal du bruke?',
    h1: 'Hva kan jeg bruke i stedet for friske urter, og omvendt?',
    beskrivelse: 'MatPrat oppgir at to spiseskjeer friske urter tilsvarer en teskje tørkede. SNL viser hvorfor timian er et unntak. Se omregningen og hva som endrer seg.',
    ingress: 'Tørkede urter er sterkere enn friske, og det er grunnen til at mengden er mindre.',
    svar: 'MatPrat oppgir at ' + T('friske') + ' ss friske urter tilsvarer ' + T('torkede') + ' ts tørkede. Det er et utgangspunkt fra én oppskrift, og SNL skriver at tørket timian har en skarpere og mer intens smak, og bør brukes med større forsiktighet.',
    steg: [['Regn om', T('friske') + ' ss friske er ' + T('torkede') + ' ts tørkede.'], ['Smak til', 'Tørket timian kan lett bli dominerende.'], ['Tidspunkt', 'Tørket timian tåler lang koking.']],
    kilder: ['mp-urtesmor', 'mp-urtedressing', 'snl-timian'],
    seksjoner: [
      ['Slik bytter du', kortListe([
        ['Tørkede urter i stedet for friske', ['Forhold', 'MatPrats kryddersmør: ' + T('friske') + ' ss friske urter eller ' + T('torkede') + ' ts tørkede.'], ['Dette endrer seg', 'MatPrat skriver i en rømmedressing at tørkede urter kan erstatte friske. De oppgir ikke noe forhold der.']],
        ['Friske urter i stedet for tørkede', ['Forhold', 'Samme forhold motsatt vei: ' + T('torkede') + ' ts tørkede blir ' + T('friske') + ' ss friske.'], ['Dette endrer seg', 'Du bruker mer volum. Kilden beskriver ikke endringen i smak.']],
      ])],
      ['Timian er et eksempel på at urter er ulike', p('SNL skriver at tørket timian har en skarpere og mer intens smak enn frisk timian, og at den bør brukes med større forsiktighet fordi smaken lett kan bli dominerende. Samtidig tåler tørket timian varmebehandling og passer i retter som skal koke lenge. Vi har ikke kilder for andre urter, så for dem er omregningen ovenfor bare et utgangspunkt.')],
      ...app('Urter varierer mye i styrke, og det er greit å ha noe som kan hjelpe når du står midt i det.'),
    ],
    faq: [
      ['Hvor mye tørket urt tilsvarer fersk?', 'MatPrat oppgir ' + T('friske') + ' ss friske urter for ' + T('torkede') + ' ts tørkede, i en oppskrift på kryddersmør.'],
      ['Kan jeg bruke tørket timian i stedet for frisk?', 'Ja, men SNL skriver at den har skarpere og mer intens smak og bør brukes med større forsiktighet.'],
      ['Passer tørkede urter i gryteretter?', 'SNL skriver at tørket timian tåler varmebehandling og passer i retter som skal koke lenge.'],
    ],
  }),

  hvitlok: (T) => ({
    gruppe: 'Matlaging', kort: 'Hvitløkspulver mot fedd, i teskjeer og i vekt.',
    tittel: 'Hvitløkspulver i stedet for fersk hvitløk',
    h1: 'Hva kan jeg bruke i stedet for hvitløk?',
    beskrivelse: 'Toro oppgir at en vektdel hvitløkspulver tilsvarer fem vektdeler fersk hvitløk. Helios oppgir en halv teskje pulver per fedd. Se begge tallene.',
    ingress: 'Mangler du hvitløk, men har pulver? Da finnes det to tall å gå ut fra.',
    svar: 'Helios oppgir at ' + T('pulver-fedd') + ' ts hvitløkspulver tilsvarer ' + T('fedd') + ' hvitløksfedd. Toro oppgir at ' + T('vekt-pulver') + ' vektdel pulver tilsvarer ' + T('vekt-fersk') + ' vektdeler fersk hvitløk.',
    steg: [['Tell fedd', T('pulver-fedd') + ' ts pulver per fedd.'], ['Veie', T('vekt-pulver') + ' del pulver for ' + T('vekt-fersk') + ' deler fersk.'], ['Smak til', 'Kildene sier ikke noe om smaken.']],
    kilder: ['oda-hvitlok', 'toro-hvitlok'],
    seksjoner: [
      ['To måter å regne på', kortListe([
        ['Per fedd', ['Forhold', 'Helios: ' + T('pulver-fedd') + ' ts hvitløkspulver tilsvarer ' + T('fedd') + ' hvitløksfedd. Tallet står i produktbeskrivelsen hos Oda.'], ['Dette endrer seg', 'Fedd er ikke like store, og pakkebeskrivelsen sier ikke noe om smaken.']],
        ['Etter vekt', ['Forhold', 'Toro: ' + T('vekt-pulver') + ' vektdel hvitløkspulver tilsvarer ' + T('vekt-fersk') + ' vektdeler fersk hvitløk.'], ['Dette endrer seg', 'Vi har ikke kilder som sammenligner smaken eller hvordan pulveret oppfører seg i steking.']],
      ])],
      ['To produsenter, to uttrykk', p('Tallene kommer fra to ulike produsenter, og de er ikke direkte sammenlignbare: det ene er i teskjeer per fedd og det andre i vekt. Når du bruker pulver, er pakkens egen anvisning det mest presise.')],
      ...app('Hvitløk går ofte tom før man har skrevet det på handlelista.'),
    ],
    faq: [
      ['Hvor mye hvitløkspulver tilsvarer ett fedd?', 'Helios oppgir ' + T('pulver-fedd') + ' ts per hvitløksfedd.'],
      ['Hva er forholdet etter vekt?', 'Toro oppgir ' + T('vekt-pulver') + ' vektdel pulver for ' + T('vekt-fersk') + ' vektdeler fersk hvitløk.'],
      ['Smaker pulver likt som fersk hvitløk?', 'Kildene våre sier ikke noe om det.'],
    ],
  }),
};

// Samlesiden: grupper og tekst.
const RAKKEFOLGE = ['Baking', 'Meieri', 'Sukker og smak', 'Matlaging'];

export const NAV = {
  lenke: 'Alle bytter',
  innhold(sider) {
    const grupper = RAKKEFOLGE.map((g) => [g, sider.filter((s) => s.c.gruppe === g)]).filter(([, l]) => l.length);
    const navn = sider.map((s) => s.rad.navn.toLowerCase());
    return {
      tittel: 'Erstatning: hva kan jeg bruke i stedet?',
      h1: 'Hva kan jeg bruke i stedet for ...?',
      beskrivelse: 'Mangler du egg, smør, bakepulver eller gjær? Sidene gir bytter med forhold fra Idun, MatPrat, melk.no og andre norske kilder, og hva som endrer seg.',
      ingress: 'Mangler du noe midt i matlagingen? Her er byttene vi har funnet kilder på, med forholdene kilden oppgir.',
      svar: 'Velg varen du mangler: ' + og(navn) + '. Hver side sier hva du kan bruke, i hvilket forhold, og hva som endrer seg. Står ikke tallet hos en kilde, gir vi det ikke.',
      steg: [['Finn varen', 'Velg den du mangler.'], ['Les forholdet', 'Hver side har kilde og årstall.'], ['Sjekk oppskriften', 'Noen bytter gjelder bare ved bestemte ingredienser.']],
      seksjoner: [
        ['Velg varen du mangler', grupper.map(([g, l]) => `<h3>${g}</h3>${l.map((s) => `<div class="scenario"><h3><a href="${s.href}">${s.c.h1}</a></h3><p>${s.c.kort}</p></div>`).join('')}`).join('')],
        ['Slik er sidene laget', ul([
          '<strong>Tall med kilde.</strong> Hvert forhold kommer fra Idun, MatPrat, melk.no, TINE, Dansukker, Dr. Oetker, Toro eller SNL, med lenke og årstall nederst på siden. Sidene hos MatPrat og Idun har ikke alltid egen dato. Da står året vi leste siden.',
          '<strong>Uten kilde, uten tall.</strong> Der ingen kilde gir et forhold, sier siden det, i stedet for å gjette. Derfor har noen byttesider få tall.',
          '<strong>Ingen oppskrifter og ingen råd om mattrygghet eller allergi.</strong> Siden sier hva som kan byttes, ikke hva som er trygt eller ikke for deg.',
        ])],
        ['Se hva du har i spiskammeret', p('Legg inn det du har i <a href="/spiskammer-app/">spiskammeret</a> i Matlyst, så ser du hva du kan bytte med før du begynner. Se også <a href="/hva-kan-jeg-lage/">hva kan jeg lage med det jeg har</a> og <a href="/tom-kjoleskapet/">tøm kjøleskapet</a>.')],
        ['Bytt ut ingrediensen i Matlyst', p('Åpne en oppskrift i appen og bruk <strong>Spør Matlyst</strong> for å få forslag til en erstatning ut fra det du har. Du ser endringene før du lagrer, og kan angre dem. Spør Matlyst er en Pro-funksjon, bruker KI og har en månedlig kvote, så les resultatet før du lager maten.')],
      ],
      faq: [
        ['Hvorfor mangler noen vanlige bytter?', 'Vi tar bare med byttene vi har funnet i en norsk fagkilde. Der kildene ikke gir et forhold, ville vi heller ikke gi et.'],
        ['Er sidene gratis?', 'Ja, du trenger ikke appen for å bruke dem.'],
        ['Kan jeg få et bytte i appen?', 'Ja, med Spør Matlyst, som er en Pro-funksjon. Den bruker KI, så du bør lese resultatet.'],
      ],
    };
  },
};

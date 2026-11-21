// Text för familjen «steketid» (sv): tillagningstider. Varje mening återger vad en namngiven källa säger.
// Siffror skrivs aldrig här: h.t(fält) läser dem ur data.sv.json, och h.s(id) ger en hel mening ur källan, ordagrant.
// Källor: Svensk Fågel, Svenskt Kött, Svenska Ägg, Kronfågel, Findus och Arla. Tiderna är ungefärliga och gäller de recept och produkter källorna beskriver.
// Inga egna råd om mattrygghet: innertemperaturer återges som källan skriver dem. Undvik orden laga, steg, ugn, timer, plan, vecka, meny, köp, spara, recept, hitta i h2:
// scripts/app-bevis.mjs kopplar dem till appkort.

const T = '/sv/tillagningstid/';
const INNER = '/sv/innertemperatur/';
const L = (slug, text) => [`${T}${slug}/`, text];

export const TEKST = {
  kalkun: (h) => ({
    ord: 'kalkon',
    title: 'Hur länge ska kalkonen vara i ugnen? Tid och temperatur',
    h1: 'Hur länge ska kalkonen vara i ugnen?',
    description: `Svensk Fågel (2024) räknar med ${h.t('sf-kilo')} vid ${h.t('sf-temp')}, Christian Hellberg med ${h.t('h-kilo')}. Tre svenska källor sida vid sida, med innertemperatur.`,
    lead: `${h.k('sfjul')} räknar med ${h.t('sf-kilo')} vid ${h.t('sf-temp')}, efter ${h.t('sf-start')} i ugnen först. Kalkonen är klar när innertemperaturen har nått ${h.t('sf-klar')}. Källorna är inte överens om tiden, så tabellen visar dem sida vid sida.`,
    kilder: [
      `Om skinnet: ${h.s('folie')}`,
      `Om skyn: ${h.s('osa')}`,
      `${h.k('sfhellberg')} räknar med ${h.t('h-kilo')} efter en start på ${h.t('h-start')} i cirka ${h.t('h-start-tid')}. Kalkonen är klar vid ${h.t('h-klar')} vid lårbenet.`,
      `${h.k('arlakalkon')} sänker värmen till ${h.t('a-sank')} efter starten och anger ${h.t('a-klar')} intill lårbenet. Arla anger ingen tid per kilo.`,
    ],
    tabell: {
      tittel: 'Tre källor, sida vid sida', kilde: 'sfjul', intro: 'Alla tre är svenska och gäller en hel kalkon.',
      kolonner: ['Källa', 'Starten', 'Sedan', 'Tid', 'Klar vid'],
      rader: [
        ['Svensk Fågel, julrecept (2024)', { tekst: `${h.t('sf-start')}` }, { tekst: `${h.t('sf-temp')} varmluft` }, 'sf-kilo', 'sf-klar'],
        ['Christian Hellberg hos Svensk Fågel (2024)', { tekst: `${h.t('h-start')} i cirka ${h.t('h-start-tid')}` }, 'h-temp', 'h-kilo', 'h-klar'],
        ['Arla (2026)', 'a-temp', 'a-sank', null, 'a-klar'],
      ],
      etter: [`${h.k('sfjul')} föreslår att kalkonen tas ut vid ${h.t('sf-ut')} innertemperatur, och att den vilar minst ${h.t('sf-vila')} innan den delas.`],
    },
    faq: [
      ['Hur länge ska kalkonen vara i ugnen?', `${h.k('sfjul')} räknar med ${h.t('sf-kilo')} vid ${h.t('sf-temp')}, ${h.k('sfhellberg')} med ${h.t('h-kilo')} vid ${h.t('h-temp')}. Använd termometer.`],
      ['Vilken innertemperatur ska kalkonen ha?', `${h.k('sfjul')} och ${h.k('sfhellberg')} anger ${h.t('sf-klar')}, ${h.k('arlakalkon')} anger ${h.t('a-klar')}.`],
      ['Hur länge ska kalkonen vila?', `${h.k('sfjul')} anger minst ${h.t('sf-vila')} innan den delas.`],
    ],
    soster: [`${INNER}kalkon/`, 'Innertemperatur kalkon'],
    andre: [L('julskinka', 'Julskinka: tid och innertemperatur')],
  }),

  skinke: (h) => ({
    ord: 'julskinka',
    title: 'Julskinka: hur länge och till vilken innertemperatur?',
    h1: 'Julskinka: hur länge och till vilken innertemperatur?',
    description: `Svenskt Kött (2026) räknar med ${h.t('tid')} per kilo skinka. Termometern visar ${h.t('saftig')} för saftig, ${h.t('perfekt')} för perfekt och ${h.t('valtillagad')} för väl tillagad.`,
    lead: `${h.k('skjul')} räknar med ${h.t('tid')} per kilo skinka, beroende av form och storlek. Termometern är säkrare än klockan: ${h.t('perfekt')} är perfekt enligt källan.`,
    kilder: [
      `Om temperaturen: ${h.k('skjul')} anger ${h.t('saftig')} för riktigt saftig skinka, ${h.t('perfekt')} för perfekt och ${h.t('valtillagad')} för väl tillagad.`,
      `Om kokning: ${h.k('skkokt')} anger ${h.t('sjud')} per kilo när skinkan sjuds.`,
      `Om folie: samma recept anger ${h.t('folie')} per kilo när skinkan tillagas under folie i ugnen.`,
    ],
    tabell: {
      tittel: 'Tid per kilo skinka', kilde: 'skjul', intro: 'Båda sidorna är från Svenskt Kött.',
      kolonner: ['Hur', 'Tid per kilo'],
      rader: [['Enligt Svenskt Kött (artikel)', { tekst: `${h.t('tid')}` }], ['Sjuds, enligt receptet', { tekst: `${h.t('sjud')}` }], ['Under folie i ugnen, enligt receptet', { tekst: `${h.t('folie')}` }]],
      etter: ['Siffrorna gäller rå, rimmad skinka. Färdigkokt skinka behöver bara värmas och griljeras, och för den har vi ingen tid från en svensk källa.'],
    },
    faq: [
      ['Hur länge ska julskinkan vara i ugnen?', `${h.k('skjul')} räknar med ${h.t('tid')} per kilo, beroende av form och storlek.`],
      ['Vilken innertemperatur ska julskinkan ha?', `${h.k('skjul')} anger ${h.t('saftig')} för riktigt saftig, ${h.t('perfekt')} för perfekt och ${h.t('valtillagad')} för väl tillagad.`],
      ['Hur länge ska julskinkan sjuda?', `${h.k('skkokt')} anger ${h.t('sjud')} per kilo.`],
    ],
    soster: [`${INNER}`, 'Innertemperatur för kött och fågel'],
    andre: [L('kalkon', 'Hur länge ska kalkonen vara i ugnen?'), L('flaskstek', 'Fläskstek: tid och temperatur')],
  }),

  egg: (h) => ({
    ord: 'ägg',
    title: 'Koka ägg: hur länge ska ägget koka?',
    h1: 'Koka ägg: hur länge ska ägget koka?',
    description: `Svenska Ägg (2026) ger koktider för ett medelstort ägg, från ${h.t('kokt-min')} till ${h.t('kokt-maks')}. Ett ${h.n('k6')} minuters ägg har fast vita och rinnig gula, ett ${h.n('k9')} minuters ägg är hårdkokt.`,
    lead: `Svenska Ägg ger koktider från ${h.t('kokt-min')} till ${h.t('kokt-maks')} för ett medelstort ägg. Ett ${h.n('k6')} minuters ägg har fast vita och rinnig gula i mitten, och ett ${h.n('k8')} minuters ägg har fast men krämig gula.`,
    kilder: [
      `Om vattnet: ${h.s('sjuda')}`,
      `Om äggen: ${h.s('rum')}`,
      `Om för lång tid: ${h.s('lang')}`,
      `Om stekta ägg: ${h.k('agg')} anger ${h.t('stek')} i stekpannan. Pocherade ägg sjuder ${h.t('pochera')}.`,
    ],
    tabell: {
      tittel: 'Koktid och hur ägget blir', kilde: 'agg', intro: 'Tiderna gäller ett medelstort ägg.',
      kolonner: ['Koktid', 'Så blir ägget'],
      rader: [
        [h.t('k3'), { tekst: 'Vitan och gulan är lös.' }],
        [h.t('k4'), { tekst: 'Vitan är lite fastare men fortfarande lös. Gulan är lös och rinnig.' }],
        [h.t('k6'), { tekst: 'Vitan är fast, gulan är rinnig i mitten.' }],
        [h.t('k8'), { tekst: 'Vitan är fast, gulan är fast men krämig.' }],
        [h.t('k9'), { tekst: 'Både vitan och gulan är fasta.' }],
        [h.t('k11'), { tekst: 'Hårdkokt med ljusgul gula.' }],
      ],
    },
    faq: [
      ['Hur länge ska man koka ett ägg?', `Det beror på hur du vill ha det. ${h.k('agg')} anger ${h.t('k6')} för ett ägg med fast vita och rinnig gula, och ${h.t('k9')} när både vita och gula är fasta.`],
      ['Hur länge ska ett hårdkokt ägg koka?', `${h.k('agg')} anger ${h.t('k8')} för fast men krämig gula och ${h.t('k11')} för hårdkokt med ljusgul gula.`],
      ['Hur länge ska man steka ett ägg?', `${h.k('agg')} anger ${h.t('stek')}, eller tills äggvitan har stelnat.`],
    ],
    andre: [[`/sv/hallbarhet/agg/`, 'Hur länge håller ägg?']],
  }),

  roastbiff: (h) => ({
    ord: 'rostbiff',
    title: 'Hur länge ska rostbiffen vara i ugnen? Tid och temperatur',
    h1: 'Hur länge ska rostbiffen vara i ugnen?',
    description: `Svenskt Kött (2024): engelsk rostbiff vid ${h.t('eng-temp')} tar cirka ${h.t('eng-tid')}, fransk rostbiff vid ${h.t('fr-temp')} cirka ${h.t('fr-tid')}.`,
    lead: `Svenskt Kött anger cirka ${h.t('eng-tid')} vid ${h.t('eng-temp')} för engelsk rostbiff och cirka ${h.t('fr-tid')} vid ${h.t('fr-temp')} för fransk. Termometern är ett bättre instrument än klockan.`,
    kilder: [
      `Om termometern: ${h.s('term')}`,
      `Om fransk rostbiff: ${h.s('fransk')}`,
      `Om engelsk rostbiff: ${h.s('engelsk')}`,
      `Om varmluft: ${h.k('sktemp')} anger att man kan sänka temperaturen med ${h.t('luft')} med varmluftsugn jämfört med över- och undervärme.`,
    ],
    tabell: {
      tittel: 'Ugnstid enligt Svenskt Kött', kilde: 'sktemp', intro: 'Temperaturerna gäller ugn med över- och undervärme.',
      kolonner: ['Bit', 'Ugnstemperatur', 'Tid'],
      rader: [['Rostbiff, engelsk', 'eng-temp', 'eng-tid'], ['Rostbiff, fransk', 'fr-temp', 'fr-tid'], ['Nötstek', 'not-temp', { tekst: `${h.t('not')}` }]],
      etter: [`${h.k('skugn')} anger att köttet ska vila ${h.t('vila')} efter tillagningen, och att det bör tas fram ur kylen ${h.t('rum')} innan.`],
    },
    faq: [
      ['Hur länge ska rostbiff vara i ugnen?', `${h.k('sktemp')} anger cirka ${h.t('eng-tid')} vid ${h.t('eng-temp')} för engelsk rostbiff och cirka ${h.t('fr-tid')} vid ${h.t('fr-temp')} för fransk.`],
      ['Hur länge ska rostbiffen vila?', `${h.k('skugn')} anger ${h.t('vila')}.`],
      ['Vad är skillnaden på engelsk och fransk rostbiff?', `${h.s('fransk')}`],
    ],
    soster: [`${INNER}notkott-och-lamm/`, 'Innertemperatur nötkött och lamm'],
    andre: [L('lammstek', 'Lammstek: tid och temperatur'), L('biff-i-panna', 'Biff i stekpanna: tid per sida')],
  }),

  svinestek: (h) => ({
    ord: 'fläskstek',
    title: 'Fläskstek i ugn: hur länge och vilken temperatur?',
    h1: 'Fläskstek i ugn: hur länge och vilken temperatur?',
    description: `Svenskt Kött (2024) anger ${h.t('temp')} för bogbladsstek, karré, kotlettrad och skinkstek. Bogbladsstek tar cirka ${h.t('bog')}, karré cirka ${h.t('karre')}.`,
    lead: `Svenskt Kött anger ${h.t('temp')} för alla fyra fläskstekarna. Tiden går från cirka ${h.t('bog')} för bogbladsstek till cirka ${h.t('karre')} för karré.`,
    kilder: [
      `Om termometern: ${h.s('term')}`,
      `Om saltet: ${h.s('salt')}`,
      `Om skinkstek: i bloggen Skinkstekens hemlighet anger ${h.k('skskink')} ${h.t('blogg-temp')}, att köttet tas ut vid ${h.t('blogg-klar')} och vilar ${h.t('blogg-vila')}.`,
    ],
    tabell: {
      tittel: 'Ugnstid per fläskstek', kilde: 'sktemp', intro: 'Temperaturerna gäller ugn med över- och undervärme.',
      kolonner: ['Stek', 'Ugnstemperatur', 'Tid'],
      rader: [['Bogbladsstek', 'temp', { tekst: `cirka ${h.t('bog')}` }], ['Karré', 'temp', { tekst: `cirka ${h.t('karre')}` }], ['Kotlettrad', 'temp', { tekst: `cirka ${h.t('kotlettrad')}` }], ['Skinkstek', 'temp', { tekst: `cirka ${h.t('skinkstek')}` }]],
      etter: [`${h.k('skugn')} anger att köttet ska vila ${h.t('vila')} efter tillagningen.`],
    },
    faq: [
      ['Hur länge ska fläskstek vara i ugnen?', `${h.k('sktemp')} anger cirka ${h.t('bog')} för bogbladsstek och cirka ${h.t('karre')} för karré, vid ${h.t('temp')}.`],
      ['Vilken temperatur ska ugnen ha?', `${h.k('sktemp')} anger ${h.t('temp')} för fläskstek med över- och undervärme.`],
      ['Hur länge ska steken vila?', `${h.k('skugn')} anger ${h.t('vila')}.`],
    ],
    soster: [`${INNER}griskott/`, 'Innertemperatur griskött'],
    andre: [L('julskinka', 'Julskinka: tid och innertemperatur'), L('biff-i-panna', 'Karré och kotlett i stekpanna')],
  }),

  lammelar: (h) => ({
    ord: 'lammstek',
    title: 'Lammstek i ugn: hur länge och vilken temperatur?',
    h1: 'Lammstek i ugn: hur länge och vilken temperatur?',
    description: `Svenskt Kött (2024): lammstek och lammsadel vid ${h.t('temp')} tar cirka ${h.t('stek')}. Kalvstek tar ${h.t('kalv')}. Siffror från svensk källa.`,
    lead: `Svenskt Kött anger ${h.t('temp')} och cirka ${h.t('stek')} för både lammstek och lammsadel. Kalvstek står på samma temperatur men tar ${h.t('kalv')}.`,
    kilder: [
      `Om varmluft: ${h.s('luft')}`,
      `Om lammkotletter: ${h.k('sktemp')} anger ${h.t('kotlett')} i stekpanna för en kotlett på ${h.t('kotlett-tjock')}.`,
      `Om vilan: ${h.k('skugn')} anger att köttet ska vila ${h.t('vila')}.`,
    ],
    tabell: {
      tittel: 'Ugnstid enligt Svenskt Kött', kilde: 'sktemp', intro: 'Temperaturerna gäller ugn med över- och undervärme.',
      kolonner: ['Bit', 'Ugnstemperatur', 'Tid'],
      rader: [['Lammstek', 'temp', { tekst: `cirka ${h.t('stek')}` }], ['Lammsadel', 'temp', { tekst: `cirka ${h.t('sadel')}` }], ['Kalvstek', 'kalv-temp', 'kalv']],
    },
    faq: [
      ['Hur länge ska lammstek vara i ugnen?', `${h.k('sktemp')} anger cirka ${h.t('stek')} vid ${h.t('temp')}.`],
      ['Hur länge ska en lammsadel vara i ugnen?', `${h.k('sktemp')} anger cirka ${h.t('sadel')} vid ${h.t('temp')}.`],
      ['Hur länge ska lammkotletter stekas?', `${h.k('sktemp')} anger ${h.t('kotlett')} i stekpanna.`],
    ],
    soster: [`${INNER}notkott-och-lamm/`, 'Innertemperatur nötkött och lamm'],
    andre: [L('rostbiff', 'Hur länge ska rostbiffen vara i ugnen?'), L('biff-i-panna', 'Biff i stekpanna: tid per sida')],
  }),

  'biff-i-panna': (h) => ({
    ord: 'biff',
    title: 'Steka biff, karré och kotlett: tid per sida i stekpannan',
    h1: 'Steka biff, karré och kotlett: tid per sida',
    description: `Svenskt Kött (2024): biff eller entrecôte på ${h.t('tjock-biff')} tar ${h.t('biff')}, karré på ${h.t('tjock-karre')} tar ${h.t('karre')}. Tider per sida för sju sorters skivor.`,
    lead: `Svenskt Kött anger tid per sida efter hur tjock skivan är. En biff på ${h.t('tjock-biff')} tar ${h.t('biff')}, en karré på ${h.t('tjock-karre')} tar ${h.t('karre')}. Tiderna är ungefärliga.`,
    kilder: [
      `Om tiderna: ${h.s('tid')}`,
      `Om köttet: ${h.s('rum')}`,
      `Om vilan: ${h.k('sktemp')} anger att köttet bör vila ${h.t('vila')} innan du serverar eller skär upp det.`,
    ],
    tabell: {
      tittel: 'Tid per sida i stekpanna', kilde: 'sktemp', intro: 'Tjockleken och tiden står som Svenskt Kött anger dem.',
      kolonner: ['Skiva', 'Tjocklek', 'Tid per sida'],
      rader: [
        ['Biff eller entrecôte', 'tjock-biff', 'biff'], ['Skiva av rostbiff', 'tjock-rost', 'rost'], ['Lövbiff', 'tjock-lov', 'lov'],
        ['Karré', 'tjock-karre', 'karre'], ['Skinka', 'tjock-skinka', 'skinka'], ['Fläskkotlett', 'tjock-kotlett', 'kotlett'], ['Lammkotlett', 'tjock-biff', 'lamm'],
      ],
    },
    faq: [
      ['Hur länge ska man steka en biff?', `${h.k('sktemp')} anger ${h.t('biff')} för en biff eller entrecôte på ${h.t('tjock-biff')}.`],
      ['Hur länge ska man steka en fläskkotlett?', `${h.k('sktemp')} anger ${h.t('kotlett')} för en kotlett på ${h.t('tjock-kotlett')}.`],
      ['Ska köttet vila efter stekningen?', `${h.k('sktemp')} anger att köttet bör vila ${h.t('vila')}.`],
    ],
    soster: [`${INNER}notkott-och-lamm/`, 'Innertemperatur nötkött och lamm'],
    andre: [L('rostbiff', 'Hur länge ska rostbiffen vara i ugnen?'), L('flaskstek', 'Fläskstek i ugn')],
  }),

  'hel-kylling': (h) => ({
    ord: 'hel kyckling',
    title: 'Hel kyckling i ugn: hur länge och vilken temperatur?',
    h1: 'Hel kyckling i ugn: hur länge och vilken temperatur?',
    description: `Kronfågel (2026): hel kyckling i ugn på ${h.t('temp')} i cirka ${h.t('tid')}, eller tills innertemperaturen är ${h.t('klar')}. Svensk Fågel anger ${h.t('sf-hel')}.`,
    lead: `Kronfågel anger ${h.t('temp')} i cirka ${h.t('tid')}, eller tills termometern visar ${h.t('klar')}. Svensk Fågel anger ${h.t('sf-hel')} intill benet. Källorna skiljer sig några grader.`,
    kilder: [
      `Om termometern: ${h.s('term')}`,
      `Om skinnet: ${h.k('kron')} föreslår att kycklingen ösas ${h.t('os')} under tillagningstiden.`,
      `Om rimning: ${h.s('rimma')} ${h.k('kron')} anger att kycklingen ligger i ${h.t('rimtid')}.`,
    ],
    tabell: {
      tittel: 'Hel kyckling enligt två källor', kilde: 'kron', intro: 'Kronfågel anger tid och temperatur, Svensk Fågel anger innertemperaturen.',
      kolonner: ['Källa', 'Ugnstemperatur', 'Tid', 'Innertemperatur'],
      rader: [['Kronfågel (2026)', 'temp', 'tid', 'klar'], ['Svensk Fågel (2024)', null, null, 'sf-hel']],
    },
    faq: [
      ['Hur länge ska en hel kyckling vara i ugnen?', `${h.k('kron')} anger cirka ${h.t('tid')} vid ${h.t('temp')}, eller tills innertemperaturen är ${h.t('klar')}.`],
      ['Vilken innertemperatur ska hel kyckling ha?', `${h.k('kron')} anger ${h.t('klar')} och ${h.k('sfsakra')} anger ${h.t('sf-hel')}, båda intill benet.`],
    ],
    soster: [`${INNER}kyckling/`, 'Innertemperatur kyckling'],
    andre: [L('kycklingfile', 'Kycklingfilé: tid i stekpanna och ugn'), L('kalkon', 'Hur länge ska kalkonen vara i ugnen?')],
  }),

  kyllingfilet: (h) => ({
    ord: 'kycklingfilé',
    title: 'Kycklingfilé: hur länge i stekpanna och ugn?',
    h1: 'Kycklingfilé: hur länge i stekpanna och ugn?',
    description: `Kronfågel (2026): ${h.t('panna')} i stekpannan och sedan ugn på ${h.t('ugn')} tills innertemperaturen är ${h.t('klar')}. Arla (2026) anger cirka ${h.t('arla-tid')} vid ${h.t('arla-temp')}.`,
    lead: `Kronfågel anger ${h.t('panna')} i pannan och därefter ugn på ${h.t('ugn')} tills filén har ${h.t('klar')}. Arla anger cirka ${h.t('arla-tid')} vid ${h.t('arla-temp')} för ett recept med filé i ugn.`,
    kilder: [
      `Om frysta filéer: ${h.s('frys')} ${h.s('frystid')}`,
      `Om innertemperaturen: ${h.k('sfsakra')} anger ${h.t('sf-filet')} för kycklingfilé och lårfilé.`,
    ],
    tabell: {
      tittel: 'Kycklingfilé enligt två källor', kilde: 'kron', intro: 'Kronfågel beskriver stekning med ugn efteråt. Arla beskriver ett recept i ugn.',
      kolonner: ['Källa', 'Stekpanna', 'Ugnstemperatur', 'Tid i ugn', 'Innertemperatur'],
      rader: [['Kronfågel (2026)', 'panna', 'ugn', null, 'klar'], ['Arla (2026), recept med filé i ugn', null, 'arla-temp', 'arla-tid', 'arla-klar']],
      etter: [`${h.k('arlafile')} anger ${h.t('arla-temp')} för vanlig ugn, och ${h.t('arla-luft')} för varmluft.`],
    },
    faq: [
      ['Hur länge ska kycklingfilé stekas?', `${h.k('kron')} anger ${h.t('panna')} i stekpannan, och därefter ugn på ${h.t('ugn')} tills innertemperaturen är ${h.t('klar')}.`],
      ['Hur länge ska kycklingfilé vara i ugnen?', `${h.k('arlafile')} anger cirka ${h.t('arla-tid')} vid ${h.t('arla-temp')}, eller tills innertemperaturen är ${h.t('arla-klar')}.`],
      ['Kan man tillaga fryst kycklingfilé?', `${h.s('frys')}`],
    ],
    soster: [`${INNER}kyckling/`, 'Innertemperatur kyckling'],
    andre: [L('hel-kyckling', 'Hel kyckling i ugn'), [`/sv/airfryer/kycklingfile/`, 'Kycklingfilé i airfryer']],
  }),

  'laks-i-ovn': (h) => ({
    ord: 'lax',
    title: 'Lax i ugn: hur länge och vilken temperatur?',
    h1: 'Lax i ugn: hur länge och vilken temperatur?',
    description: `Findus (2026): laxfilé i ugn på ${h.t('f-temp')} i ${h.t('f-tid')}. Arla (2026): laxsida på ${h.t('ls-temp')} i cirka ${h.t('ls-tid')}. Tre svenska källor sida vid sida.`,
    lead: `Findus anger ${h.t('f-tid')} vid ${h.t('f-temp')} för en laxfilé. Arla anger cirka ${h.t('ls-tid')} vid ${h.t('ls-temp')} för en hel laxsida. Tiden beror på hur tjock fisken är.`,
    kilder: [
      `Om frusen lax: ${h.k('arlalaxsida')} anger ${h.t('fryst-temp')}, och ${h.t('fryst-tid')} tills innertemperaturen är ${h.t('fryst-klar')}.`,
      `Om hög värme: ${h.k('arlalax')} anger ${h.t('l-temp')} och cirka ${h.t('l-tid')}.`,
      `Om stekpanna: ${h.k('findus')} anger ${h.t('f-panna')} på varje sida.`,
    ],
    tabell: {
      tittel: 'Lax enligt tre källor', kilde: 'findus', intro: 'Källorna beskriver olika bitar, så tiderna är inte direkt jämförbara.',
      kolonner: ['Källa', 'Bit', 'Ugnstemperatur', 'Tid', 'Innertemperatur'],
      rader: [
        ['Findus (2026)', { tekst: 'Laxfilé' }, 'f-temp', 'f-tid', 'f-klar'],
        ['Arla (2026), laxsida', { tekst: 'Hel laxsida' }, 'ls-temp', { tekst: `cirka ${h.t('ls-tid')}` }, 'ls-klar'],
        ['Arla (2026), recept med lax', { tekst: 'Laxbitar i form' }, 'l-temp', { tekst: `cirka ${h.t('l-tid')}` }, null],
      ],
    },
    faq: [
      ['Hur länge ska lax vara i ugnen?', `${h.k('findus')} anger ${h.t('f-tid')} vid ${h.t('f-temp')} för laxfilé. ${h.k('arlalaxsida')} anger cirka ${h.t('ls-tid')} vid ${h.t('ls-temp')} för en laxsida.`],
      ['Vilken innertemperatur ska lax ha?', `${h.k('findus')} anger ${h.t('f-klar')} i mitten av filén, och ${h.k('arlalaxsida')} anger ${h.t('ls-klar')}.`],
      ['Kan man tillaga lax direkt från frysen?', `${h.k('arlalaxsida')} anger ${h.t('fryst-temp')} och ${h.t('fryst-tid')} för fryst lax.`],
    ],
    soster: [`/sv/airfryer/lax/`, 'Lax i airfryer'],
    andre: [L('koka-potatis', 'Koka potatis: hur länge?'), L('kycklingfile', 'Kycklingfilé: stekpanna och ugn')],
  }),

  potatis: (h) => ({
    ord: 'potatis',
    title: 'Koka potatis: hur länge ska potatisen koka?',
    h1: 'Koka potatis: hur länge ska potatisen koka?',
    description: `Arla (2026): små färskpotatisar kan koka ${h.t('farsk')}, stor fastpotatis upp till ${h.t('fast')}. Arla räknar med runt ${h.t('pp')} potatis per person.`,
    lead: `Arla anger att små färskpotatisar kan koka ${h.t('farsk')}, medan stor fastpotatis kan behöva upp till ${h.t('fast')}. Tiden beror på storlek och sort.`,
    kilder: [
      `Om storleken: ${h.s('lika')}`,
      `Om mängden: ${h.k('arlapotatis')} räknar med runt ${h.t('pp')} potatis per person.`,
    ],
    tabell: {
      tittel: 'Koktid enligt Arla', kilde: 'arlapotatis', intro: 'Arla anger två exempel och säger att tiden beror på storlek och sort.',
      kolonner: ['Potatis', 'Koktid'],
      rader: [['Små färskpotatisar', 'farsk'], ['Stor fastpotatis, upp till', 'fast']],
    },
    faq: [
      ['Hur länge ska potatis koka?', `${h.k('arlapotatis')} anger ${h.t('farsk')} för små färskpotatisar och upp till ${h.t('fast')} för stor fastpotatis.`],
      ['Hur mycket potatis per person?', `${h.k('arlapotatis')} räknar med runt ${h.t('pp')} per person.`],
    ],
    andre: [L('lax-i-ugn', 'Lax i ugn: tid och temperatur')],
  }),
};

export function nav({ data, rader, sti, h, p, esc }) {
  const kal = h(rader.find((r) => r.id === 'kalkun'));
  const ag = h(rader.find((r) => r.id === 'egg'));
  const rb = h(rader.find((r) => r.id === 'roastbiff'));
  const hk = h(rader.find((r) => r.id === 'hel-kylling'));
  const OVERSIKT = {
    kalkun: ['Per kilo', (x) => x.t('sf-kilo'), 'sfjul'],
    skinke: ['Per kilo', (x) => x.t('tid'), 'skjul'],
    egg: ['Ägg från lösa till hårdkokta', (x) => `${x.t('kokt-min')} till ${x.t('kokt-maks')}`, 'agg'],
    roastbiff: ['Engelsk rostbiff', (x) => `${x.t('eng-tid')} vid ${x.t('eng-temp')}`, 'sktemp'],
    svinestek: ['Bogbladsstek', (x) => `${x.t('bog')} vid ${x.t('temp')}`, 'sktemp'],
    lammelar: ['Lammstek', (x) => `${x.t('stek')} vid ${x.t('temp')}`, 'sktemp'],
    'biff-i-panna': ['Biff eller entrecôte, per sida', (x) => x.t('biff'), 'sktemp'],
    'hel-kylling': ['Hel kyckling', (x) => `${x.t('tid')} vid ${x.t('temp')}`, 'kron'],
    kyllingfilet: ['Kycklingfilé i stekpanna', (x) => x.t('panna'), 'kron'],
    'laks-i-ovn': ['Laxfilé i ugn', (x) => `${x.t('f-tid')} vid ${x.t('f-temp')}`, 'findus'],
    potatis: ['Små färskpotatisar', (x) => x.t('farsk'), 'arlapotatis'],
  };
  const radene = rader.map((r) => {
    const x = h(r);
    const [etikett, tekst, kilde] = OVERSIKT[r.id];
    return `<tr><td><a href="${sti(r)}">${esc(r.navn)}</a></td><td>${esc(etikett)}</td><td>${tekst(x)}</td><td>${x.k(kilde)}</td></tr>`;
  }).join('');
  return {
    title: 'Tillagningstider: hur länge ska maten vara i ugnen?',
    h1: 'Tillagningstider för kalkon, skinka, ägg, kyckling och mer',
    description: `Hur länge ska kalkonen vara i ugnen, hur länge ska ägget koka? ${rader.length} sidor med tider och temperaturer från Svensk Fågel, Svenskt Kött, Svenska Ägg, Kronfågel, Findus och Arla, med källa på varje siffra.`,
    lead: `Tiderna på de här sidorna kommer från svenska källor. Svensk Fågel räknar till exempel med ${kal.t('sf-kilo')} för kalkon, och Svenska Ägg anger ${ag.t('k6')} för ett ägg med rinnig gula. Tider är ungefärliga: termometern är säkrare än klockan.`,
    rik: [
      `<h2>Det här säger källorna</h2>${p([
        `${rb.k('sktemp')} anger att digitaltermometern är ett bättre instrument än klockan för att avgöra när köttet är klart.`,
        `${hk.k('kron')} anger ${hk.t('temp')} i cirka ${hk.t('tid')} för en hel kyckling, eller tills innertemperaturen är ${hk.t('klar')}.`,
      ])}`,
      `<h2>Tider för varje rätt</h2><p>Välj en rätt för alla tider, vad de bygger på och källorna. Källan står i sista kolumnen.</p><div class="table-wrap" tabindex="0" role="region" aria-label="Tillagningstider"><table class="sprik"><thead><tr><th scope="col">Rätt</th><th scope="col">Vad</th><th scope="col">Tid</th><th scope="col">Källa</th></tr></thead><tbody>${radene}</tbody></table></div>`,
      '<h2>Varor som inte finns här</h2><p>Vi anger bara en tid när vi har hittat den på en svensk källsida. För ris, ribba, julbord och mycket annat har vi inte hittat en tid hos en svensk källa som vi kan kontrollera, så de varorna har ingen egen sida.</p>',
      '<div class="related"><h2>Läs också</h2><ul><li><a href="/sv/innertemperatur/">Innertemperatur för kött och fågel</a></li><li><a href="/sv/airfryer/">Airfryer: tid och temperatur</a></li><li><a href="/sv/hallbarhet/">Hur länge håller maten i kylen?</a></li></ul></div>',
    ].join('\n'),
    faqTittel: 'Frågor om tillagningstider',
    faq: [
      ['Hur länge ska kalkonen vara i ugnen?', `${kal.k('sfjul')} räknar med ${kal.t('sf-kilo')} vid ${kal.t('sf-temp')}. Se sidan om kalkon för alla tre källorna.`],
      ['Hur länge ska man koka ett ägg?', `${ag.k('agg')} anger ${ag.t('k6')} för fast vita och rinnig gula, och ${ag.t('k9')} när både vita och gula är fasta.`],
      ['Är tiderna exakta?', 'Nej. Källorna skriver själva att tiderna är ungefärliga och att tjocklek, vikt och ugn påverkar. Mät innertemperaturen i stället för att gå på tiden.'],
    ],
  };
}

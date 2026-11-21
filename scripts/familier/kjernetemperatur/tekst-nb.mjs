// Teksten for familien «kjernetemperatur» (nb). Hver setning gjengir det kilden sier, med kilden nevnt; ingen egne råd.
// Mattilsynet først, MatPrat etterpå med årstall. Tall skrives aldri her: t(felt) henter dem fra data.nb.json, og s(id) henter en setning ordrett fra kilden.
// Sitatet bak hvert tall og hver setning står i datafila, og scripts/familier/steketid/kildekontroll.mjs sjekker det mot kilden.
// Der to kilder oppgir ulike tall, står begge. Vi velger ikke for leseren.

const TERMO = 'Et steketermometer måler kjernetemperaturen, altså temperaturen midt i kjøttet.';
const IKKE_MT = (h, id) => `Vi fant ingen egen kjernetemperatur for dette hos Mattilsynet. Tallene under er fra ${h.k(id)}.`;
const KILDE = (h, id, navn) => `<small>Kilde: ${h.k(id)}, «${navn}».</small>`;

export const TEKST = {
  kylling: (h) => ({
    ord: 'kylling',
    title: 'Kjernetemperatur kylling',
    h1: 'Kjernetemperatur kylling',
    description: `Mattilsynet skriver at gjennomstekt betyr minst ${h.t('mt-gjennom')} i kjernen. ${h.k('mp-kylling')} oppgir ${h.t('hel-gj')} for hel kylling, og ${h.k('mp-kyllingfilet')} oppgir ${h.t('art-ferdig')} for kyllingfilet.`,
    lead: `Mattilsynet (2023) skriver at «gjennomstekt» betyr en kjernetemperatur på minimum ${h.t('mt-gjennom')}. ${h.k('mp-kylling')} oppgir ${h.t('hel-gj')} for gjennomstekt kylling, og ${h.k('mp-kyllingfilet')} skriver at kyllingfilet er ferdig stekt på ${h.t('art-ferdig')}. Tallene er ikke like, så her står alle tre med kilde.`,
    blokker: [
      ['Dette sier Mattilsynet', h.p([
        h.s('mt-fjorfe'),
        `${h.k('mt-rykende')} skriver at ved ${h.t('mt-dor')} dør de aller fleste bakterier.`,
        h.s('mt-grill'),
        `${h.k('mt-sommer')} definerer «gjennomstekt» som en kjernetemperatur på minimum ${h.t('mt-gjennom')}.`,
      ])],
      ['Hel kylling og filet i tabellen', h.p([`${h.k('mp-kylling')} har en tabell over kjernetemperatur for ferdig tilberedt kylling:`]) + h.tabell({
        tittel: 'Kjernetemperatur for kylling, MatPrat',
        kolonner: ['Del', 'Medium pluss', 'Gjennomstekt'],
        rader: [['Hel kylling', 'hel-pluss', 'hel-gj'], ['Kyllingfilet uten ben', 'filet-pluss', 'filet-gj']],
      }) + h.p([KILDE(h, 'mp-kylling', 'Steke- og koketips for kylling')])],
      ['Kyllingfilet: artikkelen om saftig filet', h.p([`I artikkelen om saftig kyllingfilet skriver ${h.k('mp-kyllingfilet')} at filet er ferdig stekt på ${h.t('art-ferdig')}, og at temperaturen stiger ${h.t('art-stig')} mens kjøttet hviler.`]) + h.tabell({
        tittel: 'Kyllingfilet: ønsket resultat og kjernetemperatur, MatPrat',
        kolonner: ['Ønsket resultat', 'Kjernetemperatur'],
        rader: [['Ferdig stekt og saftig', 'art-ferdig'], ['Hvilet temperatur', 'art-hvilet'], [{ html: 'Risiko for tørr filet, over' }, 'art-tort']],
      }) + h.p([h.s('kylling-torr'), h.s('kylling-term')])],
      ['Grillet eller trukket filet', h.p([
        `På grillen oppgir ${h.k('mp-grill')} ${h.t('grill-filet')} for kyllingfilet. Filet som trekkes i buljong, har ${h.t('trekk')} som kjernetemperatur ifølge ${h.k('mp-kylling')}.`,
      ])],
    ],
    faq: [
      ['Hvilken temperatur skal kylling ha?', `Kildene oppgir ikke ett tall. Mattilsynet: gjennomstekt er minimum ${h.t('mt-gjennom')}. ${h.k('mp-kylling')}: gjennomstekt ${h.t('hel-gj')}, medium pluss ${h.t('hel-pluss')}. ${h.k('mp-kyllingfilet')}: ferdig stekt ${h.t('art-ferdig')}. Vi gjengir bare det kildene skriver.`],
      ['Stiger temperaturen etter at kyllingen er tatt ut?', `${h.k('mp-kyllingfilet')} skriver at temperaturen stiger ${h.t('art-stig')} under hviletiden for kyllingfilet.`],
      ['Hvor lenge skal kylling stekes?', 'Tid i ovn eller panne står på sidene om <a href="/steketid/hel-kylling/">hel kylling</a> og <a href="/steketid/kyllingfilet/">kyllingfilet</a>.'],
    ],
    soster: [['/steketid/hel-kylling/', 'Hvor lenge skal hel kylling stekes?'], ['/steketid/kyllingfilet/', 'Hvor lenge skal kyllingfilet stekes?']],
    andre: [['/kjernetemperatur/kalkun/', 'Kjernetemperatur kalkun'], ['/kjernetemperatur/kjottdeig/', 'Kjernetemperatur kjøttdeig og hamburger']],
  }),

  kalkun: (h) => ({
    ord: 'kalkun',
    title: 'Kjernetemperatur kalkun',
    h1: 'Kjernetemperatur kalkun',
    description: `Hel kalkun er ferdig på ${h.t('hel')} ifølge ${h.k('mp-kalkun')}, og kalkunfilet på ${h.t('filet')}. Mattilsynet skriver at gjennomstekt er minst ${h.t('mt-gjennom')}.`,
    lead: `Mattilsynet (2023) skriver at gjennomstekt betyr en kjernetemperatur på minimum ${h.t('mt-gjennom')}. ${h.k('mp-kalkun')} oppgir ${h.t('hel')} for hel kalkun og ${h.t('filet')} for kalkunfilet. Tallene er ikke like, og her står begge med kilde.`,
    blokker: [
      ['Dette sier Mattilsynet', h.p([
        h.s('mt-fjorfe'),
        h.s('mt-grill'),
        `${h.k('mt-sommer')} definerer «gjennomstekt» som en kjernetemperatur på minimum ${h.t('mt-gjennom')}. ${h.k('mt-rykende')} skriver at ved ${h.t('mt-dor')} dør de aller fleste bakterier.`,
      ])],
      ['Kalkun i tabellen', h.tabell({
        tittel: 'Kjernetemperatur for kalkun, MatPrat',
        kolonner: ['Del', 'Kjernetemperatur ferdig tilberedt'],
        rader: [['Hel kalkun', 'hel'], ['Kalkunfilet uten skinn', 'filet'], ['Kalkunfilet med skinn', 'filet-skinn'], ['Kalkunbiff', 'biff']],
      }) + h.p([KILDE(h, 'mp-kalkun', 'Steke- og koketips for kalkun')])],
      ['Kalkun i pose', h.p([
        `${h.k('mp-kalkun-pose')} skriver at kalkunen tas ut av ovnen når kjernetemperaturen i brystet er ${h.t('pose-ut')}. Den hviler minst ${h.t('pose-hvile')}, og temperaturen stiger til ${h.t('pose-ende', { ca: true })}.`,
        h.s('pose-ferdig'),
      ])],
      ['Hviletid for hel kalkun', h.p([`${h.k('mp-hel-kalkun')} skriver at kalkunen bør hvile i minst ${h.t('hvile')} før den skjæres opp.`])],
    ],
    faq: [
      ['Hvilken kjernetemperatur har en ferdig kalkun?', `${h.k('mp-kalkun')} oppgir ${h.t('hel')} for hel kalkun. Mattilsynet (2023) skriver at gjennomstekt er minimum ${h.t('mt-gjennom')}.`],
      ['Hva er kjernetemperaturen for kalkunfilet?', `${h.k('mp-kalkun')} oppgir ${h.t('filet')} både for filet med og uten skinn.`],
      ['Hvor lenge skal kalkunen stekes?', 'Se <a href="/steketid/kalkun/">hvor lenge kalkunen skal stekes</a>, med kalkulator for vekt.'],
    ],
    soster: [['/steketid/kalkun/', 'Hvor lenge skal kalkunen stekes?']],
    andre: [['/kjernetemperatur/kylling/', 'Kjernetemperatur kylling']],
  }),

  svinefilet: (h) => ({
    ord: 'svinefilet',
    title: 'Kjernetemperatur svinefilet',
    h1: 'Kjernetemperatur svinefilet',
    description: `${h.k('mp-svin')} oppgir medium ${h.t('ind-medium')}, medium pluss ${h.t('ind-pluss')} og gjennomstekt ${h.t('ind-gj')} for indrefilet og ytrefilet av svin. Mattilsynet: gjennomstekt er minst ${h.t('mt-gjennom')}.`,
    lead: `Mattilsynet (2023) skriver at «gjennomstekt» betyr minimum ${h.t('mt-gjennom')}. For indrefilet og ytrefilet av svin oppgir ${h.k('mp-svin')} tre trinn: medium ${h.t('ind-medium')}, medium pluss ${h.t('ind-pluss')} og gjennomstekt ${h.t('ind-gj')}.`,
    blokker: [
      ['Dette sier Mattilsynet', h.p([
        `${h.k('mt-sommer')} definerer «gjennomstekt» som en kjernetemperatur på minimum ${h.t('mt-gjennom')}.`,
        `${h.k('mt-rykende')} skriver at ved ${h.t('mt-dor')} dør de aller fleste bakterier.`,
        'Vi fant ingen egen kjernetemperatur for svinefilet hos Mattilsynet.',
      ])],
      ['Indrefilet og ytrefilet i tabellen', h.tabell({
        tittel: 'Kjernetemperatur for svinefilet, MatPrat',
        kolonner: ['Del', 'Medium', 'Medium pluss', 'Gjennomstekt'],
        rader: [['Indrefilet', 'ind-medium', 'ind-pluss', 'ind-gj'], ['Ytrefilet', 'ytre-medium', 'ytre-pluss', 'ytre-gj']],
      }) + h.p([`Begge stykkene brunes i panne og etterstekes i ovn på ${h.t('ovn')}, skriver ${h.k('mp-svin')}. En indrefilet på ${h.t('ind-g')} stekes i ca. ${h.t('ind-min')}, og en ytrefilet på ${h.t('ytre-kg')} i ca. ${h.t('ytre-min')}.`, KILDE(h, 'mp-svin', 'Steke- og koketips for svin')])],
      ['Svinefilet på grillen', h.p([
        `${h.k('mp-grill')} oppgir de samme tre trinnene for grillet svinefilet. Hel ytrefilet regnes med ca. ${h.t('grill-kilo')} per kilo, og skiver grilles ${h.t('grill-skiver')} på hver side.`,
      ])],
    ],
    faq: [
      ['Hva er kjernetemperaturen for svinefilet?', `${h.k('mp-svin')} oppgir medium ${h.t('ind-medium')}, medium pluss ${h.t('ind-pluss')} og gjennomstekt ${h.t('ind-gj')}, for både indrefilet og ytrefilet.`],
      ['Er indrefilet og ytrefilet det samme?', `De er to ulike stykker, men ${h.k('mp-svin')} oppgir samme kjernetemperaturer for begge.`],
      ['Hva sier Mattilsynet om gjennomstekt?', `${h.k('mt-sommer')} definerer gjennomstekt som en kjernetemperatur på minimum ${h.t('mt-gjennom')}.`],
    ],
    andre: [['/kjernetemperatur/svinestek/', 'Kjernetemperatur svinestek'], ['/kjernetemperatur/svinenakke/', 'Kjernetemperatur svinenakke']],
  }),

  svinestek: (h) => ({
    ord: 'svinestek',
    title: 'Kjernetemperatur svinestek',
    h1: 'Kjernetemperatur svinestek, skinkestek og svinekam',
    description: `Gjennomstekt svinestek er ${h.t('surret-gj')} ifølge ${h.k('mp-svin')}. Medium pluss er ${h.t('kam-pluss')} til ${h.t('surret-pluss')}, avhengig av stykket. Mattilsynet: gjennomstekt er minst ${h.t('mt-gjennom')}.`,
    lead: `Mattilsynet (2023) skriver at «gjennomstekt» betyr minimum ${h.t('mt-gjennom')}. ${h.k('mp-svin')} oppgir ${h.t('surret-gj')} for gjennomstekt svinestek, skinkestek og svinekam. For medium pluss varierer tallet med stykket.`,
    blokker: [
      ['Dette sier Mattilsynet', h.p([
        `${h.k('mt-sommer')} definerer «gjennomstekt» som en kjernetemperatur på minimum ${h.t('mt-gjennom')}. ${h.k('mt-rykende')} skriver at ved ${h.t('mt-dor')} dør de aller fleste bakterier.`,
        'Vi fant ingen egen kjernetemperatur for svinestek hos Mattilsynet.',
      ])],
      ['Svinestekene i tabellen', h.tabell({
        tittel: 'Kjernetemperatur for svinestek, MatPrat',
        kolonner: ['Stykke', 'Medium pluss', 'Gjennomstekt'],
        rader: [['Surret svinestek uten svor', 'surret-pluss', 'surret-gj'], ['Skinkestek med svor', 'skinke-pluss', 'skinke-gj'], ['Svinekam med svor', 'kam-pluss', 'kam-gj'], ['Røkt svinekam', 'rokt-pluss', 'rokt-gj']],
      }) + h.p([KILDE(h, 'mp-svin', 'Steke- og koketips for svin')])],
      ['Termometer og hviletid', h.p([h.s('svin-ferdig'), `${h.k('mp-svinestek')} skriver at steken hviler i ca. ${h.t('hvile')} før den skjæres.`])],
      ['Ribbe har ingen kjernetemperatur i tabellen', h.p([`I tabellen fra ${h.k('mp-svin')} står ribbe med mengde og steketid, men uten kjernetemperatur. Se <a href="/steketid/ribbe/">hvor lenge ribba skal stekes</a>.`])],
    ],
    faq: [
      ['Hvilken temperatur skal svinestek ha?', `${h.k('mp-svin')} oppgir ${h.t('surret-gj')} for gjennomstekt. Medium pluss er ${h.t('surret-pluss')} for surret stek og ${h.t('kam-pluss')} for skinkestek og svinekam.`],
      ['Hvor lang tid tar en svinestek?', 'Se <a href="/steketid/svinestek/">hvor lenge svinesteken skal stekes</a>, med tider per stykke.'],
      ['Hva med ribbe?', `${h.k('mp-svin')} oppgir ingen kjernetemperatur for ribbe, så vi har ikke noe tall for den.`],
    ],
    soster: [['/steketid/svinestek/', 'Hvor lenge skal svinesteken stekes?'], ['/steketid/ribbe/', 'Hvor lenge skal ribba stekes?']],
    andre: [['/kjernetemperatur/svinefilet/', 'Kjernetemperatur svinefilet']],
  }),

  svinenakke: (h) => ({
    ord: 'svinenakke',
    title: 'Kjernetemperatur svinenakke',
    h1: 'Kjernetemperatur svinenakke og pulled pork',
    description: `${h.k('mp-grill')} oppgir medium ${h.t('nakke-medium')} og gjennomstekt ${h.t('nakke-gj')} for svinenakke på grillen, og ${h.t('pulled')} for pulled pork.`,
    lead: `Mattilsynet (2023) definerer «gjennomstekt» som minimum ${h.t('mt-gjennom')}. For svinenakke på grillen oppgir ${h.k('mp-grill')} medium ${h.t('nakke-medium')} og gjennomstekt ${h.t('nakke-gj')}, og pulled pork av svinenakke har ${h.t('pulled')}.`,
    blokker: [
      ['Dette sier Mattilsynet', h.p([
        `${h.k('mt-sommer')} definerer «gjennomstekt» som en kjernetemperatur på minimum ${h.t('mt-gjennom')}. ${h.k('mt-rykende')} skriver at ved ${h.t('mt-dor')} dør de aller fleste bakterier.`,
        'Mattilsynet har ingen egen temperatur for pulled pork på sidene vi leste.',
      ])],
      ['Nakke og pulled pork i tabellen', h.tabell({
        tittel: 'Kjernetemperatur for svinenakke på grillen, MatPrat',
        kolonner: ['Rett', 'Medium', 'Gjennomstekt', 'Annet'],
        rader: [
          ['Svinenakke (nakkefilet)', 'nakke-medium', 'nakke-gj', { html: `${h.t('nakke-kg')} trenger ${h.t('nakke-tid')} ved ${h.t('nakke-grill')}` }],
          ['Pulled pork av svinenakke', null, null, { html: `${h.t('pulled')} i kjernen, på indirekte varme (${h.t('pulled-grill')}) i ca. fem timer` }],
          ['Koteletter', 'kotelett-medium', 'kotelett-gj', { html: `Grilles ${h.t('kotelett-tid')} på hver side` }],
        ],
      }) + h.p([KILDE(h, 'mp-grill', 'Grilltider, metoder og temperaturer')])],
    ],
    faq: [
      ['Hva er kjernetemperaturen for pulled pork?', `${h.k('mp-grill')} oppgir ${h.t('pulled')}. Det er et annet tall enn for nakke som skal skjæres i skiver.`],
      ['Hvor lang tid tar svinenakke på grillen?', `Ifølge ${h.k('mp-grill')} trenger ${h.t('nakke-kg')} svinenakke ${h.t('nakke-tid')} på grillen ved ${h.t('nakke-grill')}.`],
    ],
    andre: [['/kjernetemperatur/svinestek/', 'Kjernetemperatur svinestek'], ['/kjernetemperatur/svinefilet/', 'Kjernetemperatur svinefilet']],
  }),

  biff: (h) => ({
    ord: 'biff',
    title: 'Kjernetemperatur biff',
    h1: 'Kjernetemperatur biff',
    description: `${h.k('mp-storfe')} oppgir medium ${h.t('medium')} og gjennomstekt ${h.t('gj')} for biffer. På grillen er kjøttet rødt på ${h.t('rod')} og rosa på ${h.t('rosa')}. Mattilsynet om hele kjøttstykker.`,
    lead: `Mattilsynet skriver at når du steker hele kjøttstykker som biff, er det nok at overflaten blir godt stekt. ${h.k('mp-storfe')} oppgir for biffer medium ${h.t('medium')} og gjennomstekt ${h.t('gj')}.`,
    blokker: [
      ['Dette sier Mattilsynet', h.p([h.s('mt-hele'), h.s('mt-grill-biff'), h.s('mt-ham-biff')])],
      ['Biffer i tabellen', h.p([`${h.k('mp-storfe')} gjelder biffer på ${h.t('tykk')} tykkelse, som indrefilet, ytrefilet, flatbiff, mørbrad og entrecôte, stekt i panne:`]) + h.tabell({
        tittel: 'Kjernetemperatur for biff, MatPrat',
        kolonner: ['Grad', 'Kjernetemperatur'],
        rader: [['Medium', 'medium'], ['Gjennomstekt', 'gj']],
      }) + h.p([KILDE(h, 'mp-storfe', 'Steke- og koketips for storfekjøtt')])],
      ['Biff på grillen', h.p([`For hel ytrefilet på grillen skriver ${h.k('mp-grill')} at kjøttet er rødt på ${h.t('rod')}, rosa på ${h.t('rosa')} og godt stekt ved ${h.t('godt')}. Biffer grilles ${h.t('grill-pa')} på hver side.`])],
    ],
    faq: [
      ['Hvilken kjernetemperatur har medium stekt biff?', `${h.k('mp-storfe')} oppgir ${h.t('medium')} for medium.`],
      ['Hva er forskjellen på biff og kjøttdeig?', `${h.k('mt-hamburger')} skriver at bakteriene sitter på overflaten av et helt kjøttstykke, og at kvernet kjøtt fordeler dem i hele produktet. Se <a href="/kjernetemperatur/kjottdeig/">kjernetemperatur for kjøttdeig</a>.`],
      ['Hva med oksefilet, entrecôte og roastbiff?', 'De har egne sider: <a href="/kjernetemperatur/oksefilet/">oksefilet</a>, <a href="/kjernetemperatur/entrecote/">entrecôte</a> og <a href="/kjernetemperatur/roastbiff/">roastbiff</a>.'],
    ],
    andre: [['/kjernetemperatur/oksefilet/', 'Kjernetemperatur oksefilet'], ['/kjernetemperatur/entrecote/', 'Kjernetemperatur entrecôte']],
  }),

  roastbiff: (h) => ({
    ord: 'roastbiff',
    title: 'Kjernetemperatur roastbiff',
    h1: 'Kjernetemperatur roastbiff',
    description: `${h.k('mp-storfe')} oppgir ${h.t('ferdig')} som kjernetemperatur for roastbiff. I oppskriften er snittflaten rød ved ${h.t('rod')} og rosa ved ${h.t('rosa')}.`,
    lead: `${h.k('mp-storfe')} oppgir ${h.t('ferdig')} som kjernetemperatur for ferdig roastbiff. I oppskriften ${h.k('mp-roastbiff')} er snittflaten rød ved ${h.t('rod')} og rosa ved ${h.t('rosa')}.`,
    blokker: [
      ['Dette sier Mattilsynet', h.p([h.s('mt-hele'), 'Vi fant ingen egen kjernetemperatur for roastbiff hos Mattilsynet.'])],
      ['Roastbiff i tabellen', h.tabell({
        tittel: 'Kjernetemperatur for roastbiff, MatPrat',
        kolonner: ['Stykke', 'Kjernetemperatur ferdig tilberedt', 'Ovn'],
        rader: [['Roastbiff av ytrefilet, flatbiff eller mørbrad', 'ferdig', 'ovn']],
      }) + h.p([`Stykket brunes raskt i en varm panne. ${h.k('mp-storfe')} oppgir at ${h.t('kg')} stekes i ca. ${h.t('tid')} i ovnen.`, KILDE(h, 'mp-storfe', 'Steke- og koketips for storfekjøtt')])],
      ['Roastbiff i en annen kilde', h.p([`Oppskriften ${h.k('mp-roastbiff')} bruker ovn på ${h.t('opp-ovn')}. Der står det at snittflaten er rød når steketermometeret viser ${h.t('rod')}, og rosa ved ${h.t('rosa')}.`, h.s('roast-kald')])],
    ],
    faq: [
      ['Hvilken kjernetemperatur har roastbiff?', `${h.k('mp-storfe')} oppgir ${h.t('ferdig')}. I oppskriften fra ${h.k('mp-roastbiff')} er snittflaten rød ved ${h.t('rod')} og rosa ved ${h.t('rosa')}.`],
      ['Hvor lenge skal roastbiff stekes?', 'Se <a href="/steketid/roastbiff/">hvor lenge roastbiffen skal stekes</a>.'],
    ],
    soster: [['/steketid/roastbiff/', 'Hvor lenge skal roastbiffen stekes?']],
    andre: [['/kjernetemperatur/oksefilet/', 'Kjernetemperatur oksefilet'], ['/kjernetemperatur/biff/', 'Kjernetemperatur biff']],
  }),

  oksefilet: (h) => ({
    ord: 'oksefilet',
    title: 'Kjernetemperatur oksefilet',
    h1: 'Kjernetemperatur oksefilet',
    description: `For indrefilet og ytrefilet av storfe oppgir ${h.k('mp-storfe')} lite stekt ${h.t('filet-lite')}, medium ${h.t('filet-medium')}, medium pluss ${h.t('filet-pluss')} og gjennomstekt ${h.t('filet-gj')}.`,
    lead: `${h.k('mp-storfe')} oppgir fire trinn for filet av storfe: lite stekt ${h.t('filet-lite')}, medium ${h.t('filet-medium')}, medium pluss ${h.t('filet-pluss')} og gjennomstekt ${h.t('filet-gj')}. Mattilsynet skriver at det er nok at overflaten blir godt stekt når du steker hele kjøttstykker.`,
    blokker: [
      ['Dette sier Mattilsynet', h.p([h.s('mt-hele'), 'Vi fant ingen egen kjernetemperatur for oksefilet hos Mattilsynet.'])],
      ['Filet i tabellen', h.tabell({
        tittel: 'Kjernetemperatur for oksefilet, MatPrat',
        kolonner: ['Grad', 'Kjernetemperatur'],
        rader: [['Lite stekt', 'filet-lite'], ['Medium', 'filet-medium'], ['Medium pluss', 'filet-pluss'], ['Gjennomstekt', 'filet-gj']],
      }) + h.p([`Filet brunes raskt i panne og stekes i ovnen på ${h.t('ovn')}, skriver ${h.k('mp-storfe')}.`, KILDE(h, 'mp-storfe', 'Steke- og koketips for storfekjøtt')])],
      ['Filet på grillen og i fondue', h.p([
        `Hel indrefilet på grillen stekes ${h.t('grill-tid')} på indirekte varme under lokk, ifølge ${h.k('mp-grill')}. Filet er ferdig når termometeret viser ${h.t('grill-medium')}, hvis du vil ha den medium stekt.`,
        `Til fondue skjæres kjøttet i biter som stekes ${h.t('fondue')} i olje (${h.k('mp-storfe')}).`,
      ])],
    ],
    faq: [
      ['Hvilken kjernetemperatur har oksefilet medium?', `${h.k('mp-storfe')} oppgir ${h.t('filet-medium')} for medium og ${h.t('filet-pluss')} for medium pluss.`],
      ['Er oksefilet og indrefilet det samme?', `${h.k('mp-storfe')} samler indrefilet og ytrefilet i samme rad og oppgir de samme kjernetemperaturene for begge.`],
    ],
    andre: [['/kjernetemperatur/entrecote/', 'Kjernetemperatur entrecôte'], ['/kjernetemperatur/biff/', 'Kjernetemperatur biff'], ['/kjernetemperatur/roastbiff/', 'Kjernetemperatur roastbiff']],
  }),

  entrecote: (h) => ({
    ord: 'entrecôte',
    title: 'Kjernetemperatur entrecôte',
    h1: 'Kjernetemperatur entrecôte',
    description: `Helstekt entrecôte: lite stekt ${h.t('hel-lite')}, medium ${h.t('hel-medium')}, medium pluss ${h.t('hel-pluss')} og gjennomstekt ${h.t('hel-gj')}, ifølge ${h.k('mp-storfe')}. Hviletid ${h.t('hvile')}.`,
    lead: `For helstekt entrecôte oppgir ${h.k('mp-storfe')} fire trinn: lite stekt ${h.t('hel-lite')}, medium ${h.t('hel-medium')}, medium pluss ${h.t('hel-pluss')} og gjennomstekt ${h.t('hel-gj')}. Mattilsynet skriver at overflaten er det som må bli godt stekt på hele kjøttstykker.`,
    blokker: [
      ['Dette sier Mattilsynet', h.p([h.s('mt-hele'), 'Vi fant ingen egen kjernetemperatur for entrecôte hos Mattilsynet.'])],
      ['Helstekt entrecôte i tabellen', h.tabell({
        tittel: 'Kjernetemperatur for helstekt entrecôte, MatPrat',
        kolonner: ['Grad', 'Kjernetemperatur'],
        rader: [['Lite stekt', 'hel-lite'], ['Medium', 'hel-medium'], ['Medium pluss', 'hel-pluss'], ['Gjennomstekt', 'hel-gj']],
      }) + h.p([`Entrecôten brunes raskt i stekepanne og stekes i ovn på ${h.t('hel-ovn')}. ${h.k('mp-storfe')} oppgir at ${h.t('hel-kg')} stekes i ca. ${h.t('hel-t')} og ${h.t('hel-m')}.`, KILDE(h, 'mp-storfe', 'Steke- og koketips for storfekjøtt')])],
      ['Hviletid', h.p([`I oppskriften ${h.k('mp-entrecote')} hviler kjøttet i ${h.t('hvile')} før det skjæres i skiver. Steketermometeret stikkes midt i den tykkeste delen, og ovnen står på ${h.t('opp-ovn')}.`])],
    ],
    faq: [
      ['Hvilken kjernetemperatur har medium entrecôte?', `${h.k('mp-storfe')} oppgir ${h.t('hel-medium')} for medium og ${h.t('hel-pluss')} for medium pluss.`],
      ['Hvor lenge skal entrecôten hvile?', `${h.k('mp-entrecote')} oppgir ${h.t('hvile')} før den skjæres i skiver.`],
    ],
    andre: [['/kjernetemperatur/oksefilet/', 'Kjernetemperatur oksefilet'], ['/kjernetemperatur/biff/', 'Kjernetemperatur biff']],
  }),

  lammelar: (h) => ({
    ord: 'lammelår',
    title: 'Kjernetemperatur lammelår',
    h1: 'Kjernetemperatur lammelår og lammestek',
    description: `For lammestek oppgir ${h.k('mp-lammestek')} medium ${h.t('art-medium')}, medium pluss ${h.t('art-pluss')} og gjennomstekt ${h.t('art-gj')}. Hviletid ca. ${h.t('hvile')}.`,
    lead: `${h.k('mp-lammestek')} skriver at lammestek er medium stekt ved ${h.t('art-medium')}, medium pluss ved ${h.t('art-pluss')} og gjennomstekt ved ${h.t('art-gj')}. Stekene tas ut ved ønsket temperatur og hviler i ca. ${h.t('hvile')}.`,
    blokker: [
      ['Dette sier Mattilsynet', h.p([`Vi fant ingen egen kjernetemperatur for lammelår hos Mattilsynet. ${h.k('mt-sommer')} definerer «gjennomstekt» som en kjernetemperatur på minimum ${h.t('mt-gjennom')}. ${h.k('mp-lammestek')} oppgir ${h.t('art-gj')} for gjennomstekt lammestek.`])],
      ['Lammestek i tabellen', h.tabell({
        tittel: 'Kjernetemperatur for lammestek, MatPrat',
        kolonner: ['Stykke', 'Lite stekt', 'Medium', 'Medium pluss', 'Gjennomstekt'],
        rader: [['Lammestek med ben', null, 'ben-medium', 'ben-pluss', 'ben-gj'], ['Surret lammestek, benfri', 'surret-lite', 'surret-medium', 'surret-pluss', 'surret-gj']],
      }) + h.p([`Lettsaltet og røkt lammelår har ${h.t('rokt')} som kjernetemperatur, oppgir ${h.k('mp-lam')}.`, KILDE(h, 'mp-lam', 'Steke- og koketips for lammekjøtt')])],
      ['Slik måler du', h.p([h.s('lamb-rosa'), h.s('lamb-term')])],
      ['Lammelår med lang tid', h.p([`MatPrat (2019) viser en tabell for et lammelår på ${h.t('lang-kg', { ca: true })}. Målet i tabellen er en kjernetemperatur på ${h.t('lang')}. Se <a href="/steketid/lammelar/">hvor lenge lammelåret skal stekes</a>.`])],
    ],
    faq: [
      ['Hvilken temperatur har medium stekt lammelår?', `${h.k('mp-lammestek')} oppgir ${h.t('art-medium')} for medium og ${h.t('art-pluss')} for medium pluss.`],
      ['Hva er kjernetemperaturen for røkt lammelår?', `${h.k('mp-lam')} oppgir ${h.t('rokt')} for lettsaltet og røkt lammelår.`],
      ['Er lammelår og lammestek det samme?', `${h.k('mp-lammestek')} skriver at lammestek oftest lages av et helt lammelår. Du kan også kjøpe ferdig surret lammestek uten bein.`],
    ],
    soster: [['/steketid/lammelar/', 'Hvor lenge skal lammelåret stekes?']],
    andre: [['/kjernetemperatur/lammefilet/', 'Kjernetemperatur lammefilet og lammecarré']],
  }),

  lammefilet: (h) => ({
    ord: 'lammefilet',
    title: 'Kjernetemperatur lammefilet',
    h1: 'Kjernetemperatur lammefilet og lammecarré',
    description: `${h.k('mp-lam')} oppgir lite stekt ${h.t('ytre-lite')}, medium ${h.t('ytre-medium')}, medium pluss ${h.t('ytre-pluss')} og gjennomstekt ${h.t('ytre-gj')} for ytrefilet og lammecarré.`,
    lead: `For ytrefilet og lammecarré av lam oppgir ${h.k('mp-lam')} fire trinn: lite stekt ${h.t('ytre-lite')}, medium ${h.t('ytre-medium')}, medium pluss ${h.t('ytre-pluss')} og gjennomstekt ${h.t('ytre-gj')}.`,
    blokker: [
      ['Dette sier Mattilsynet', h.p([IKKE_MT(h, 'mp-lam')])],
      ['Filet og carré i tabellen', h.tabell({
        tittel: 'Kjernetemperatur for lammefilet og lammecarré, MatPrat',
        kolonner: ['Stykke', 'Lite stekt', 'Medium', 'Medium pluss', 'Gjennomstekt'],
        rader: [['Ytrefilet', 'ytre-lite', 'ytre-medium', 'ytre-pluss', 'ytre-gj'], ['Lammecarré', 'carre-lite', 'carre-medium', 'carre-pluss', 'carre-gj']],
      }) + h.p([`Ytrefileten brunes raskt og etterstekes i ovn på ${h.t('ytre-ovn')} i ca. ${h.t('ytre-tid')}. Lammecarré brunes og etterstekes også i ovn på ${h.t('ytre-ovn')}.`, KILDE(h, 'mp-lam', 'Steke- og koketips for lammekjøtt')])],
      ['Koteletter', h.p([`Lammekoteletter brunes raskt på sterk varme og etterstekes på svak varme i ca. ${h.t('kot-min')}, skriver ${h.k('mp-lam')}. Tabellen oppgir ingen kjernetemperatur for koteletter.`])],
    ],
    faq: [
      ['Hva er kjernetemperaturen for lammefilet?', `${h.k('mp-lam')} oppgir medium ${h.t('ytre-medium')} og gjennomstekt ${h.t('ytre-gj')} for ytrefilet.`],
      ['Er lammecarré det samme som lammefilet?', `Nei, de står som to rader i tabellen fra ${h.k('mp-lam')}, men med de samme kjernetemperaturene.`],
    ],
    andre: [['/kjernetemperatur/lammelar/', 'Kjernetemperatur lammelår']],
  }),

  kjottdeig: (h) => ({
    ord: 'kjøttdeig',
    title: 'Kjernetemperatur kjøttdeig og hamburger',
    h1: 'Kjernetemperatur kjøttdeig og hamburger',
    description: `Mattilsynet skriver at hamburger av kjøttdeig gjennomstekes til en kjernetemperatur over ${h.t('over')}. Ved grilling betyr gjennomstekt minimum ${h.t('mt-gjennom')}.`,
    lead: `Mattilsynet (2022) skriver at hamburgere av innkjøpt kjøttdeig gjennomstekes til en kjernetemperatur over ${h.t('over')}. I rådene om grilling (2023) betyr gjennomstekt en kjernetemperatur på minimum ${h.t('mt-gjennom')}. Tallene er ikke like, og her står begge med kilde.`,
    blokker: [
      ['Dette sier Mattilsynet', h.p([
        `${h.k('mt-hamburger')} skriver at hamburgere tradisjonelt gjennomstekes til en kjernetemperatur over ${h.t('over')}, og at varmebehandling til ${h.t('ok')} vil være godt nok.`,
        h.s('mt-ham-kvern'),
        h.s('mt-ham-gjennom'),
        h.s('mt-ham-utsatte'),
        `${h.k('mt-sommer')} definerer «gjennomstekt» som en kjernetemperatur på minimum ${h.t('mt-gjennom')}.`,
        h.s('mt-grill'),
      ])],
      ['Hamburger er ikke biff', h.p([h.s('mt-ham-biff'), 'Se <a href="/kjernetemperatur/biff/">kjernetemperatur for biff</a>.'])],
      ['Hamburger på grillen', h.p([`${h.k('mp-grill')} skriver at rå hamburgere og sliders grilles ${h.t('grill')} på hver side på sterk varme. Tabellen oppgir ingen kjernetemperatur for hamburger, så tallene over er fra Mattilsynet.`])],
      ['Oversikt over tallene på siden', h.tabell({
        tittel: 'Kjernetemperatur for kjøttdeig, Mattilsynet',
        kolonner: ['Hva', 'Tall'],
        rader: [[{ html: `Hamburger gjennomstekes til, over (${h.kp('mt-hamburger')})` }, 'over'], [{ html: `Gjennomstekt, minimum (${h.kp('mt-sommer')})` }, 'mt-gjennom'], [{ html: `Bakterier dør ved (${h.kp('mt-rykende')})` }, 'mt-dor']],
      })],
    ],
    faq: [
      ['Hvilken temperatur skal kjøttdeig ha?', `Mattilsynet oppgir to tall: en kjernetemperatur over ${h.t('over')} for hamburgere (2022) og minimum ${h.t('mt-gjennom')} for gjennomstekt ved grilling (2023).`],
      ['Kan man spise medium stekt hamburger?', h.s('mt-ham-utsatte')],
      ['Hvorfor må kjøttdeig gjennomstekes?', `${h.k('mt-hamburger')} skriver at bakteriene fordeles i hele produktet når kjøttet kvernes.`],
    ],
    andre: [['/kjernetemperatur/biff/', 'Kjernetemperatur biff'], ['/kjernetemperatur/kylling/', 'Kjernetemperatur kylling']],
  }),

  laks: (h) => ({
    ord: 'laks',
    title: 'Kjernetemperatur laks',
    h1: 'Kjernetemperatur laks',
    description: `${h.k('mp-fisk')} oppgir ca. ${h.t('fisk')} for fisk i ovn, eller lavere om du vil ha rå kjerne. I en laksoppskrift står ${h.t('glaze')}.`,
    lead: `I tabellen for fisk og skalldyr oppgir ${h.k('mp-fisk')} ca. ${h.t('fisk')} som kjernetemperatur, eller lavere om du vil ha en rå kjerne. ${h.k('mp-ingefarglaze')} oppgir ${h.t('glaze')} i en laksoppskrift. Tallene er ikke like, og her står begge.`,
    blokker: [
      ['Dette sier Mattilsynet', h.p([IKKE_MT(h, 'mp-fisk')])],
      ['Tabellen for fisk', h.tabell({
        tittel: 'Kjernetemperatur for fisk i ovn, MatPrat',
        kolonner: ['Rett', 'Ovn', 'Tid', 'Kjernetemperatur'],
        rader: [['Filet i ovn, tykkere stykker', 'fisk-ovn', 'fisk-tid', { felt: 'fisk', ca: true }]],
      }) + h.p(['Tabellen sier «eller lavere om du ønsker en rå kjerne».', KILDE(h, 'mp-fisk', 'Steke- og koketips for fisk og skalldyr')])],
      ['Laks med ingefærglaze', h.p([`Laksefilet med ingefærglaze står ${h.t('glaze-tid')} i ovnen på ${h.t('glaze-ovn')}. Oppskriften ${h.k('mp-ingefarglaze')} sier at kjernetemperaturen skal være ${h.t('glaze')}.`])],
      ['Slik ser du at laksen er ferdig', h.p([h.s('laks-rosa'), h.s('fisk-ferdig'), `${h.k('mp-fisk-kjokken')} skriver også at kjernetemperaturen er ca. ${h.t('kjokken')} for fisk, og noe lavere for enkelte fiskeslag.`])],
    ],
    faq: [
      ['Hvilken temperatur skal laks ha?', `${h.k('mp-fisk')} oppgir ca. ${h.t('fisk')} eller lavere for rå kjerne. ${h.k('mp-ingefarglaze')} oppgir ${h.t('glaze')} i en laksoppskrift.`],
      ['Hvor lenge skal laks stekes i ovn?', 'Se <a href="/steketid/laks-i-ovn/">hvor lenge laks skal stå i ovnen</a>.'],
      ['Hva sier Mattilsynet om laks?', 'Vi fant ingen kjernetemperatur for laks hos Mattilsynet.'],
    ],
    soster: [['/steketid/laks-i-ovn/', 'Hvor lenge skal laks stå i ovnen?']],
    andre: [['/kjernetemperatur/torsk/', 'Kjernetemperatur torsk']],
  }),

  torsk: (h) => ({
    ord: 'torsk',
    title: 'Kjernetemperatur torsk',
    h1: 'Kjernetemperatur torsk',
    description: `${h.k('mp-fisk')} oppgir ca. ${h.t('fisk')} for fisk i ovn, og ${h.t('kokt')} trekketid for kokt fisk i skiver. Torskefilet i ovn tar ${h.t('opp-tid')} ved ${h.t('opp-ovn')} i en oppskrift.`,
    lead: `Vi fant ingen egen kjernetemperatur for torsk. I tabellen for fisk og skalldyr oppgir ${h.k('mp-fisk')} ca. ${h.t('fisk')} for fisk i ovn, eller lavere om du vil ha en rå kjerne. Den kokte fisken har tid i stedet for temperatur: trekketid ${h.t('kokt')}.`,
    blokker: [
      ['Dette sier Mattilsynet', h.p([IKKE_MT(h, 'mp-fisk')])],
      ['Fisk og kokt fisk i tabellen', h.tabell({
        tittel: 'Kjernetemperatur og tid for fisk, MatPrat',
        kolonner: ['Rett', 'Tall'],
        rader: [['Fisk i ovn, kjernetemperatur', { felt: 'fisk', ca: true }], ['Kokt fisk i skiver, trekketid', 'kokt'], [{ html: `Kokt fisk, stykker tykkere enn ${h.t('kokt-tykk')}, trekketid` }, 'kokt-lenge']],
      }) + h.p([KILDE(h, 'mp-fisk', 'Steke- og koketips for fisk og skalldyr')])],
      ['Torskefilet i fatet', h.p([`Oppskriften ${h.k('mp-torsk')} setter fisken midt i ovnen på ${h.t('opp-ovn')} i ${h.t('opp-tid')}, avhengig av tykkelsen på stykkene.`, h.s('fisk-ferdig')])],
    ],
    faq: [
      ['Hvilken kjernetemperatur har torsk?', `Vi fant ingen egen temperatur for torsk. For fisk i ovn oppgir ${h.k('mp-fisk')} ca. ${h.t('fisk')}, eller lavere om du vil ha en rå kjerne.`],
      ['Hvor lenge trekker kokt torsk?', `Ifølge ${h.k('mp-fisk')} trekker fisk i skiver ${h.t('kokt')}. Stykker tykkere enn ${h.t('kokt-tykk')} trekker ${h.t('kokt-lenge')}.`],
    ],
    andre: [['/kjernetemperatur/laks/', 'Kjernetemperatur laks']],
  }),
};

/** Samlesiden: tabellen over alle råvarene, og en liste over det vi ikke har tall for. */
export function nav({ data, rader, sti, h, tabell, p, esc, k }) {
  const rad = (id) => rader.find((r) => r.id === id);
  const lenke = (id, tekst = rad(id).navn) => ({ html: `<a href="${sti(rad(id))}">${esc(tekst)}</a>` });
  const t1 = (id, ...cells) => {
    const hh = h(rad(id));
    return [lenke(id), ...cells.slice(0, 4).map((c) => (c ? { html: hh.t(c) } : null)), { html: hh.k(cells[4]) }];
  };
  const hH = (id) => h(rad(id));
  const rader1 = [
    ['kylling', null, null, 'hel-pluss', 'hel-gj', 'mp-kylling'],
    ['svinefilet', null, 'ind-medium', 'ind-pluss', 'ind-gj', 'mp-svin'],
    ['svinestek', null, null, 'surret-pluss', 'surret-gj', 'mp-svin'],
    ['svinenakke', null, 'nakke-medium', null, 'nakke-gj', 'mp-grill'],
    ['biff', null, 'medium', null, 'gj', 'mp-storfe'],
    ['oksefilet', 'filet-lite', 'filet-medium', 'filet-pluss', 'filet-gj', 'mp-storfe'],
    ['entrecote', 'hel-lite', 'hel-medium', 'hel-pluss', 'hel-gj', 'mp-storfe'],
    ['lammelar', 'surret-lite', 'surret-medium', 'surret-pluss', 'surret-gj', 'mp-lam'],
    ['lammefilet', 'ytre-lite', 'ytre-medium', 'ytre-pluss', 'ytre-gj', 'mp-lam'],
  ].map(([id, ...c]) => t1(id, ...c));
  const ett = (id, felt, hva, kilde, ca = false) => [lenke(id), { html: hH(id).t(felt, { ca }) }, { tekst: hva }, { html: hH(id).k(kilde) }];
  const rader2 = [
    ett('kalkun', 'hel', 'Hel kalkun', 'mp-kalkun'),
    ett('roastbiff', 'ferdig', 'Roastbiff, ferdig tilberedt', 'mp-storfe'),
    ett('kjottdeig', 'over', 'Hamburger gjennomstekes til, over', 'mt-hamburger'),
    ett('laks', 'fisk', 'Fisk i ovn, tabellen for fisk', 'mp-fisk', true),
    ett('torsk', 'fisk', 'Fisk i ovn, tabellen for fisk', 'mp-fisk', true),
  ];
  const mtH = hH('kjottdeig');
  return {
    title: 'Kjernetemperatur: tabell for kjøtt og fisk',
    description: `Kjernetemperatur for kylling, kalkun, svin, storfe, lam, kjøttdeig og fisk i én tabell. Mattilsynet først, så MatPrat med årstall. ${rader.length} råvarer, alle tall med kilde.`,
    h1: 'Kjernetemperatur: tabell for kjøtt og fisk',
    lead: `Her er kjernetemperaturen for kjøtt og fisk, samlet fra Mattilsynet og MatPrat. Mattilsynet skriver at «gjennomstekt» betyr minimum ${mtH.t('mt-gjennom')} (${mtH.kp('mt-sommer')}). Stekegradene under er fra MatPrat, med årstall. Der kildene oppgir ulike tall, står begge på varesiden.`,
    rik: [
      '<h2>Mattilsynets tall</h2>',
      p([
        `${mtH.k('mt-hamburger')} skriver at hamburgere gjennomstekes til en kjernetemperatur over ${mtH.t('over')}. ${mtH.k('mt-sommer')} definerer «gjennomstekt» som minimum ${mtH.t('mt-gjennom')}. ${mtH.k('mt-rykende')} skriver at ved ${mtH.t('mt-dor')} dør de aller fleste bakterier.`,
        hH('biff').s('mt-hele'),
      ]),
      '<h2>Kjøtt med ulike grader</h2>',
      p([`Tabellen viser kjernetemperaturen slik MatPrat oppgir den. «Ikke oppgitt» betyr at kilden ikke har et tall for den graden.`]),
      tabell(h(rad('kylling')), { tittel: 'Kjernetemperatur for kjøtt med stekegrader', kolonner: ['Råvare', 'Lite stekt', 'Medium', 'Medium pluss', 'Gjennomstekt', 'Kilde'], rader: rader1 }),
      '<h2>Råvarer med ett tall</h2>',
      p(['For disse oppgir kilden én temperatur, eller en annen type tall.']),
      tabell(h(rad('kylling')), { tittel: 'Kjernetemperatur for råvarer med ett tall', kolonner: ['Råvare', 'Temperatur', 'Hva tallet gjelder', 'Kilde'], rader: rader2 }),
      '<h2>Disse har vi ikke tall for</h2>',
      p([
        'Ribbe og pinnekjøtt: MatPrat oppgir ingen kjernetemperatur for dem i tabellene. Se <a href="/steketid/ribbe/">ribbe</a> og <a href="/steketid/pinnekjott/">pinnekjøtt</a> for steketid.',
        'And: kildene ligger langt fra hverandre, og vi tar den ikke med før vi har en sikker kilde.',
      ]),
      '<h2>Hvor lang tid tar det?</h2>',
      p(['Tid i ovnen står på sidene under <a href="/steketid/">steketid</a>, med lenke tilbake hit.']),
    ].join('\n'),
    faqTittel: 'Spørsmål om kjernetemperatur',
    faq: [
      ['Hva er kjernetemperatur?', TERMO],
      ['Hvorfor er tallene ulike fra kilde til kilde?', 'Mattilsynet og MatPrat oppgir ikke alltid de samme tallene. Vi viser begge og velger ikke for deg.'],
      ['Hvor lenge skal maten stekes?', 'Se <a href="/steketid/">oversikten over steketider</a>.'],
    ],
  };
}

// Teksten for familien «steketid» (nb). Hver setning gjengir det kilden sier, med kilden nevnt; ingen egne råd.
// Tider og ovnstemperaturer er fra MatPrat med årstall. Mattilsynet er nevnt først der de har noe om saken, ellers står det at vi ikke fant noe.
// Tall skrives aldri her: t(felt) henter dem fra data.nb.json, og s(id) henter en setning ordrett fra kilden.
// Sitatet bak hvert tall og hver setning står i datafila, og kildekontroll.mjs sjekker det mot kilden.

const KILDE = (h, id, navn) => `<small>Kilde: ${h.k(id)}, «${navn}».</small>`;
const INGEN_MT = (h, hva, id) => `Vi fant ingen steketid for ${hva} hos Mattilsynet. Tidene her er fra ${h.k(id)}.`;

export const TEKST = {
  ribbe: (h) => ({
    ord: 'ribbe',
    title: 'Hvor lenge skal ribba stekes?',
    h1: 'Hvor lenge skal ribba stekes?',
    description: `Ribba dampes ${h.t('damp')} ved ${h.t('damp-ovn')} og steker deretter ${h.t('stek')} ved ${h.t('stek-ovn')}, ifølge MatPrat (2025). Steketiden er lik uansett vekt. Hviletid ca. ${h.t('hvile')}.`,
    lead: `${h.k('mp-ribbe')} oppgir ca. ${h.t('damp')} damping ved ${h.t('damp-ovn')}, og deretter ca. ${h.t('stek')} steking ved ${h.t('stek-ovn')}. Kilden skriver at steketiden er like lang uansett om ribba veier lite eller mye.`,
    blokker: [
      ['Dette sier Mattilsynet', h.p([INGEN_MT(h, 'ribbe', 'mp-ribbe')])],
      ['Tid og temperatur trinn for trinn', h.tabell({
        tittel: 'Steketid for ribbe, MatPrat',
        kolonner: ['Trinn', 'Ovn', 'Tid'],
        rader: [['Damp under tett folie', 'damp-ovn', { felt: 'damp', ca: true }], ['Stek videre uten folie', 'stek-ovn', { felt: 'stek', ca: true }], ['Hvile etter steking', { tekst: 'Utenfor ovnen' }, { felt: 'hvile', ca: true }]],
      }) + h.p([KILDE(h, 'mp-ribbe', 'Slik steker du ribbe')])],
      ['Tiden følger ikke vekten', h.p([h.s('ribbe-vekt'), h.s('ribbe-tykk'), `Derfor har ribbe ingen kalkulator her: tiden i tabellen over gjelder både en liten og en stor ribbe. ${h.k('mp-ribbe')} regner ca. ${h.t('pp')} ribbe per person, og tabellen for svinekjøtt fra ${h.k('mp-svin')} oppgir ${h.t('ribbe-pp')}.`])],
      ['Sprø svor og folie', h.p([h.s('ribbe-folie'), `For sprø svor mot slutten skriver ${h.k('mp-ribbe')} at du kan sette panna høyere i ovnen og øke temperaturen til ${h.t('sprø-ovn')}, eller bruke ovnens grill. ${h.s('ribbe-snu')}`])],
      ['Salt på forhånd og tilberedning dagen før', h.p([`${h.k('mp-ribbe')} skriver at ribba gnis inn med salt og pepper ${h.t('salt')} før steking. Skal ribba stekes dagen før, varmes den opp ved ${h.t('varm-ovn')} i ca. ${h.t('varm')} like før servering.`])],
    ],
    faq: [
      ['Hvor lenge skal ribba stå i ovnen?', `${h.k('mp-ribbe')} oppgir ca. ${h.t('damp')} ved ${h.t('damp-ovn')} med folie, og så ca. ${h.t('stek')} ved ${h.t('stek-ovn')} uten folie.`],
      ['Hvilken kjernetemperatur har ribbe?', `${h.k('mp-svin')} oppgir ingen kjernetemperatur for ribbe i tabellen for svinekjøtt, så vi har ikke noe tall. <a href="/kjernetemperatur/svinestek/">Svinestek og svinekam</a> har egne tall.`],
      ['Må man snu ribba?', h.s('ribbe-snu')],
      ['Hvor lenge skal ribba hvile?', `${h.k('mp-ribbe')} oppgir ca. ${h.t('hvile')}, slik at kjøttsaften setter seg.`],
    ],
    soster: [['/kjernetemperatur/svinestek/', 'Kjernetemperatur svinestek']],
    andre: [['/julemiddag/', 'Julemiddag: plan, mengder og handleliste'], ['/steketid/pinnekjott/', 'Hvor lenge skal pinnekjøttet dampes?'], ['/mengde-per-person/ribbe/', 'Hvor mye ribbe per person?']],
  }),

  pinnekjott: (h) => ({
    ord: 'pinnekjøtt',
    title: 'Hvor lenge skal pinnekjøttet dampes?',
    h1: 'Hvor lenge skal pinnekjøttet vannes ut og dampes?',
    description: `Huskeregelen for pinnekjøtt er ${h.t('regel-u')} utvanning og ${h.t('regel-d')} damping, skriver ${h.k('mp-pinnekjott')}. Med tider for brunning, pølser og mengde per person.`,
    lead: `${h.k('mp-pinnekjott')} har en huskeregel for pinnekjøtt: ${h.t('regel-u')} utvanning og ${h.t('regel-d')} damping. Kjøttet er saltet og tørket, og må vannes ut før det tilberedes.`,
    blokker: [
      ['Dette sier Mattilsynet', h.p([INGEN_MT(h, 'pinnekjøtt', 'mp-pinnekjott')])],
      ['Utvanning, damping og brunning', h.tabell({
        tittel: 'Tid for pinnekjøtt, MatPrat',
        kolonner: ['Trinn', 'Tid', 'Merknad'],
        rader: [
          ['Vann ut i rikelig vann', { felt: 'utvann', ca: true }, { tekst: 'Romtemperatur' }],
          ['Damp på svak varme, tett lokk', { felt: 'damp', ca: true }, { tekst: 'Over en rist i en vid kjele' }],
          [{ html: 'Brun lett etter damping, artikkelen fra 2014' }, { felt: 'brun', ca: true }, { tekst: 'Høyt i ovnen på sterk varme eller grill' }],
          [{ html: 'Brun lett etter damping, tabellen for lam' }, { felt: 'tab-brun', ca: true }, { html: `Ovn ved ${h.t('tab-ovn')}` }],
        ],
      }) + h.p([`De to kildene oppgir ikke samme brunningstid. Begge står her. ${KILDE(h, 'mp-pinnekjott', 'Utvanning og damping av pinnekjøtt')} ${KILDE(h, 'mp-lam', 'Steke- og koketips for lammekjøtt')}`])],
      ['Små forskjeller i kildene', h.p([h.s('pinne-lunken'), h.s('pinne-sau'), h.s('pinne-rist'), `Pølser og vossakorv kan dampe sammen med pinnekjøttet de siste ${h.t('pølse')}.`])],
      ['Hvor mye pinnekjøtt per person', h.p([`Tabellen for lam fra ${h.k('mp-lam')} oppgir ${h.t('torr')} tørrvekt per person, eller ${h.t('torr-stor')} til storspisere. Utvannet vekt er ${h.t('utvannet')}, eller ${h.t('utvannet-stor')} til storspisere.`])],
    ],
    faq: [
      ['Hvor lenge skal pinnekjøttet vannes ut?', `${h.k('mp-pinnekjott')} oppgir ca. ${h.t('utvann')} i romtemperatur.`],
      ['Hvor lenge skal pinnekjøttet dampes?', `Ca. ${h.t('damp')} på svak varme, ifølge ${h.k('mp-pinnekjott')}.`],
      ['Hvilken kjernetemperatur har pinnekjøtt?', `${h.k('mp-pinnekjott')} oppgir ingen kjernetemperatur for pinnekjøtt, så vi har ikke noe tall.`],
    ],
    andre: [['/steketid/ribbe/', 'Hvor lenge skal ribba stekes?'], ['/julemiddag/', 'Julemiddag: plan, mengder og handleliste'], ['/mengde-per-person/pinnekjott/', 'Hvor mye pinnekjøtt per person?']],
  }),

  kalkun: (h) => ({
    ord: 'kalkun',
    title: 'Hvor lenge skal kalkunen stekes?',
    h1: 'Hvor lenge skal kalkunen stekes?',
    description: `MatPrat (2025) anbefaler ${h.t('per-kilo')} steketid ved ${h.t('ovn')}. En kalkun på ${h.t('ex-kg')} trenger ${h.t('ex-t')}. Regn ut tiden for din kalkun, og se hviletid.`,
    lead: `${h.k('mp-hel-kalkun')} anbefaler ${h.t('per-kilo')} steketid ved ${h.t('ovn')}. Det betyr at en kalkun på ${h.t('ex-kg')} trenger ${h.t('ex-t')} i ovnen. Skriv inn vekten under for å regne ut tiden.`,
    kalk: true,
    blokker: [
      ['Dette sier Mattilsynet', h.p([h.s('mt-fjorfe'), `Vi fant ingen steketid for kalkun hos Mattilsynet. Tidene her er fra ${h.k('mp-hel-kalkun')}. Kjernetemperaturen står på <a href="/kjernetemperatur/kalkun/">siden om kjernetemperatur for kalkun</a>.`])],
      ['Kalkulator: vekt til tid', h.p([`Kalkulatoren bruker regelen fra ${h.k('mp-hel-kalkun')}: ${h.t('per-kilo')} ved ${h.t('ovn')}. Tabellen i ${h.k('mp-kalkun')} gjelder en hel kalkun på ${h.t('kg-tab')}.`]) + '@@KALK@@' + h.p([`Er kalkunen fylt, skriver ${h.k('mp-hel-kalkun')} at man bør legge til ${h.t('fylt')} på steketiden. Kalkulatoren regner ikke med fyll.`])],
      ['Kalkun i pose og kalkunfilet', h.tabell({
        tittel: 'Steketid for kalkun, MatPrat',
        kolonner: ['Metode', 'Ovn', 'Tid'],
        rader: [
          ['Hel kalkun, vanlig steking', 'ovn', 'per-kilo'],
          ['Hel kalkun i stekepose', 'pose-ovn', 'pose-kilo'],
          ['Kalkunfilet i stekepose', 'filet-ovn', { felt: 'filet-tid', ca: true }],
          [{ html: `Kalkunfilet uten skinn på ${h.t('tab-filet-g')}, brunet og stekt` }, 'tab-filet', { felt: 'tab-filet-tid', ca: true }],
        ],
      }) + h.p([`Kildene til tabellen er ${h.k('mp-hel-kalkun')}, ${h.k('mp-kalkun-pose')} og ${h.k('mp-kalkun')}.`])],
      ['Hvile og sjekk', h.p([`${h.k('mp-hel-kalkun')} skriver at kalkunen bør hvile i minst ${h.t('hvile')} før den skjæres. ${h.s('kalkun-sjekk')} ${h.s('kalkun-lun')}`])],
      ['Hvor stor kalkun trenger du?', h.p([`${h.k('mp-hel-kalkun')} regner med ${h.t('pp')} kalkun per person.`])],
    ],
    faq: [
      ['Hvor lang tid tar det å steke en kalkun?', `${h.k('mp-hel-kalkun')} anbefaler ${h.t('per-kilo')} ved ${h.t('ovn')}. En kalkun på ${h.t('ex-kg')} trenger ${h.t('ex-t')}.`],
      ['Hvor lenge skal fylt kalkun stekes?', `${h.k('mp-hel-kalkun')} skriver at man bør legge til ${h.t('fylt')} på steketiden når kalkunen er fylt.`],
      ['Hvilken kjernetemperatur har kalkun?', `Se <a href="/kjernetemperatur/kalkun/">kjernetemperatur for kalkun</a>, der Mattilsynet og ${h.k('mp-kalkun')} er gjengitt.`],
    ],
    soster: [['/kjernetemperatur/kalkun/', 'Kjernetemperatur kalkun']],
    andre: [['/steketid/ribbe/', 'Hvor lenge skal ribba stekes?'], ['/julemiddag/', 'Julemiddag: plan, mengder og handleliste'], ['/mengde-per-person/kalkun/', 'Hvor mye kalkun per person?'], ['/nyttarsmiddag/', 'Nyttårsmiddag: kalkun, tider og mengder']],
  }),

  lammelar: (h) => ({
    ord: 'lammelår',
    title: 'Hvor lenge skal lammelåret stekes?',
    h1: 'Hvor lenge skal lammelåret stekes?',
    description: `Ved ${h.t('ovn')} stekes et lammelår på ${h.t('ben-kg')} i ca. ${h.t('ben-t')}, ifølge ${h.k('mp-lam')}. Med tider for benfri stek, langtidssteking og hviletid.`,
    lead: `${h.k('mp-lam')} oppgir at et lammelår med ben på ${h.t('ben-kg')} stekes i ca. ${h.t('ben-t')} ved ${h.t('ovn')}. En benfri, surret lammestek på ${h.t('surret-kg')} tar ca. ${h.t('surret-t')}.`,
    blokker: [
      ['Dette sier Mattilsynet', h.p([INGEN_MT(h, 'lammelår', 'mp-lam')])],
      ['Tid ved lav varme', h.tabell({
        tittel: 'Steketid for lammelår, MatPrat',
        kolonner: ['Stykke', 'Vekt', 'Tid ved samme ovnstemperatur'],
        rader: [
          ['Lammestek med ben', 'ben-kg', { felt: 'ben-t', ca: true }],
          ['Surret lammestek, benfri', 'surret-kg', { felt: 'surret-t', ca: true }],
          [{ html: 'Lammelår i artikkelen om lammestek' }, { felt: 'art-kg', ca: true }, { felt: 'art-t', ca: true }],
        ],
      }) + h.p([`Ovnen står på ${h.t('ovn')} i alle tre. ${h.k('mp-lam')} skriver at steker under ${h.t('surret-grense')} brunes raskt i stekepanne først. ${h.k('mp-lammestek')} skriver at tiden kan variere noe med tykkelsen på låret.`, KILDE(h, 'mp-lam', 'Steke- og koketips for lammekjøtt')])],
      ['Langtidssteking', h.p([`${h.k('mp-lammelar-lang')} har en tabell for et lammelår på ${h.t('lang-kg', { ca: true })}, til kjernetemperaturen er ${h.t('lang-ferdig')}.`]) + h.tabell({
        tittel: 'Langtidssteking av lammelår, MatPrat',
        kolonner: ['Ovnstemperatur', 'Steketid'],
        rader: [['lang-70', 'lang-70-t'], ['lang-80', 'lang-80-t'], ['lang-90', 'lang-90-t'], ['lang-100', 'lang-100-t'], ['lang-125', 'lang-125-t']].map(([a, b]) => [{ html: h.t(a) }, b]),
      }) + h.p([h.s('lamb-varier')])],
      ['Hvile og mengde', h.p([`Steken hviler i ca. ${h.t('hvile')} etter at den er tatt ut, ifølge ${h.k('mp-lammestek')}. Med en benfri lammestek regner ${h.k('mp-lammestek')} ca. ${h.t('pp')} per person. ${h.s('lamb-term')}`])],
      ['Hvorfor ingen kalkulator?', h.p([`${h.k('mp-lam')} gir tider for bestemte vekter, ikke en regel per kilo, og tidene vokser ikke jevnt med vekten. Derfor regner vi ikke ut en egen tid.`])],
    ],
    faq: [
      ['Hvor lenge skal lammelår stekes i ovnen?', `${h.k('mp-lam')} oppgir ca. ${h.t('ben-t')} for et lammelår med ben på ${h.t('ben-kg')} ved ${h.t('ovn')}.`],
      ['Hvor lenge skal en benfri lammestek stekes?', `Ca. ${h.t('surret-t')} for ${h.t('surret-kg')} ved ${h.t('ovn')}, ifølge ${h.k('mp-lam')}.`],
      ['Hvilken kjernetemperatur har lammelår?', 'Se <a href="/kjernetemperatur/lammelar/">kjernetemperatur for lammelår</a>.'],
    ],
    soster: [['/kjernetemperatur/lammelar/', 'Kjernetemperatur lammelår']],
    andre: [['/steketid/svinestek/', 'Hvor lenge skal svinesteken stekes?']],
  }),

  svinestek: (h) => ({
    ord: 'svinestek',
    title: 'Hvor lenge skal svinesteken stekes?',
    h1: 'Hvor lenge skal svinesteken stekes?',
    description: `Surret svinestek på ${h.t('kg')} stekes i ca. ${h.t('surret-t')} ved ${h.t('surret-ovn')}, ifølge ${h.k('mp-svin')}. Med tider for skinkestek, svinekam og røkt svinekam.`,
    lead: `${h.k('mp-svin')} oppgir at en surret svinestek uten svor på ${h.t('kg')} stekes i ca. ${h.t('surret-t')} ved ${h.t('surret-ovn')}. Stek med svor dampes først. Tidene for hvert stykke står under.`,
    blokker: [
      ['Dette sier Mattilsynet', h.p([INGEN_MT(h, 'svinestek', 'mp-svin')])],
      ['Tid for ulike svinesteker', h.tabell({
        tittel: 'Steketid for svinestek, MatPrat',
        kolonner: ['Stykke', 'Ovn', 'Tid'],
        rader: [
          ['Surret svinestek uten svor', 'surret-ovn', { felt: 'surret-t', ca: true }],
          [{ html: `Skinkestek med svor, etter ${h.t('skinke-damp')} damping ved ${h.t('skinke-damp-ovn')}` }, 'skinke-ovn', { felt: 'skinke-t', ca: true }],
          [{ html: `Svinekam med svor, etter samme damping` }, 'skinke-ovn', { felt: 'kam-t', ca: true }],
          ['Røkt svinekam, pakket i folie', 'rokt-ovn', { felt: 'rokt-t', ca: true }],
        ],
      }) + h.p([`Tidene gjelder stykker på ${h.t('kg')}. ${h.k('mp-svin')} skriver at du kan bruke grillen på slutten for å få svoren sprø.`, KILDE(h, 'mp-svin', 'Steke- og koketips for svin')])],
      ['Termometer og hvile', h.p([h.s('svin-ferdig'), `${h.k('mp-svinestek')} skriver at steken hviler i ca. ${h.t('hvile')} før den skjæres.`])],
      ['Hvorfor ingen kalkulator?', h.p([`${h.k('mp-svin')} oppgir tidene for stykker på ${h.t('kg')}, ikke en regel per kilo. Vi regner derfor ikke ut en egen tid for andre vekter.`])],
    ],
    faq: [
      ['Hvor lenge skal svinestek stekes?', `Surret svinestek på ${h.t('kg')} tar ca. ${h.t('surret-t')} ved ${h.t('surret-ovn')}, ifølge ${h.k('mp-svin')}.`],
      ['Hvor lenge skal skinkestek stekes?', `Etter ${h.t('skinke-damp')} damping ved ${h.t('skinke-damp-ovn')} stekes den ${h.t('skinke-t')} ved ${h.t('skinke-ovn')}, ifølge ${h.k('mp-svin')}.`],
      ['Hvilken kjernetemperatur har svinestek?', 'Se <a href="/kjernetemperatur/svinestek/">kjernetemperatur for svinestek</a>.'],
    ],
    soster: [['/kjernetemperatur/svinestek/', 'Kjernetemperatur svinestek']],
    andre: [['/steketid/ribbe/', 'Hvor lenge skal ribba stekes?'], ['/steketid/lammelar/', 'Hvor lenge skal lammelåret stekes?']],
  }),

  roastbiff: (h) => ({
    ord: 'roastbiff',
    title: 'Hvor lenge skal roastbiffen stekes?',
    h1: 'Hvor lenge skal roastbiffen stekes?',
    description: `${h.t('kg')} roastbiff stekes i ca. ${h.t('tid')} ved ${h.t('ovn')}, ifølge ${h.k('mp-storfe')}. I en oppskrift står ovnen på ${h.t('opp-ovn')}, og tiden styres av kjernetemperaturen.`,
    lead: `${h.k('mp-storfe')} oppgir at ${h.t('kg')} roastbiff stekes i ca. ${h.t('tid')} i ovn på ${h.t('ovn')}, etter at stykket er brunet raskt i varm panne. I en oppskrift fra ${h.k('mp-roastbiff')} står ovnen på ${h.t('opp-ovn')}.`,
    blokker: [
      ['Dette sier Mattilsynet', h.p([h.s('mt-hele'), 'Vi fant ingen steketid for roastbiff hos Mattilsynet.'])],
      ['To kilder, to temperaturer', h.tabell({
        tittel: 'Steketid for roastbiff, MatPrat',
        kolonner: ['Kilde', 'Ovn', 'Tid'],
        rader: [[{ html: h.k('mp-storfe') }, 'ovn', { html: `${h.t('kg')} stekes i ca. ${h.t('tid')}` }], [{ html: h.k('mp-roastbiff') }, 'opp-ovn', { tekst: 'Til ønsket kjernetemperatur' }]],
      }) + h.p([`Tiden i den første raden gjelder ${h.t('kg')}. ${h.k('mp-storfe')} regner med ${h.t('pp')} per person.`])],
      ['Kald roastbiff', h.p([h.s('roast-kald')])],
      ['Hvorfor ingen kalkulator?', h.p([`${h.k('mp-storfe')} oppgir tiden for ${h.t('kg')} og ikke en regel per kilo. Tiden følger heller kjernetemperaturen: se <a href="/kjernetemperatur/roastbiff/">kjernetemperatur for roastbiff</a>.`])],
    ],
    faq: [
      ['Hvor lenge skal roastbiff stekes?', `${h.k('mp-storfe')} oppgir ca. ${h.t('tid')} for ${h.t('kg')} ved ${h.t('ovn')}.`],
      ['Hvilken ovnstemperatur skal roastbiff ha?', `${h.k('mp-storfe')} oppgir ${h.t('ovn')} i tabellen for storfe, og ${h.k('mp-roastbiff')} oppgir ${h.t('opp-ovn')}. Begge står over.`],
    ],
    soster: [['/kjernetemperatur/roastbiff/', 'Kjernetemperatur roastbiff']],
    andre: [['/kjernetemperatur/biff/', 'Kjernetemperatur biff']],
  }),

  'hel-kylling': (h) => ({
    ord: 'hel kylling',
    title: 'Hvor lenge skal hel kylling stekes?',
    h1: 'Hvor lenge skal hel kylling stekes?',
    description: `En hel kylling på ${h.t('g')} stekes i ca. ${h.t('t')} og ${h.t('m')} ved ${h.t('ovn')}, ifølge ${h.k('mp-kylling')}. Med tider for lår, vinger og grillet kylling.`,
    lead: `${h.k('mp-kylling')} oppgir at en hel kylling på ${h.t('g')} stekes i ca. ${h.t('t')} og ${h.t('m')} ved ${h.t('ovn')}. Tabellen gir også tider for lår, vinger og grillet kylling.`,
    blokker: [
      ['Dette sier Mattilsynet', h.p([h.s('mt-fjorfe'), h.s('mt-grill'), `${h.k('mt-sommer')} definerer «gjennomstekt» som en kjernetemperatur på minimum ${h.t('mt-gjennom')}.`])],
      ['Tider for kylling', h.tabell({
        tittel: 'Steketid for kylling, MatPrat',
        kolonner: ['Del', 'Ovn', 'Tid'],
        rader: [
          [{ html: `Hel kylling på ${h.t('g')}` }, 'ovn', { html: `ca. ${h.t('t')} og ${h.t('m')}` }],
          ['Lår', 'lar-ovn', { felt: 'lar-t' }],
          ['Vinger, rå', 'ving-ovn', { felt: 'ving-t' }],
          ['Grillet hel kylling, varmes', 'grl-ovn', { felt: 'grl-t' }],
        ],
      }) + h.p([`${h.k('mp-kylling')} regner med ${h.t('pp')} kylling per person.`, KILDE(h, 'mp-kylling', 'Steke- og koketips for kylling')])],
      ['Hel kylling på grillen', h.p([`${h.k('mp-grill')} oppgir ${h.t('grill')} for en hel kylling på indirekte varme under lokk.`])],
      ['Hvorfor ingen kalkulator?', h.p([`${h.k('mp-kylling')} oppgir tiden for en kylling på ${h.t('g')}, ikke en regel per kilo. Derfor regner vi ikke ut en egen tid. For kalkun har ${h.k('mp-hel-kalkun')} en slik regel, og der finner du <a href="/steketid/kalkun/">en kalkulator</a>.`])],
    ],
    faq: [
      ['Hvor lenge skal hel kylling stekes?', `Ca. ${h.t('t')} og ${h.t('m')} for en kylling på ${h.t('g')} ved ${h.t('ovn')}, ifølge ${h.k('mp-kylling')}.`],
      ['Hvor lenge skal kyllinglår stekes?', `${h.k('mp-kylling')} oppgir ${h.t('lar-t')} ved ${h.t('lar-ovn')}.`],
      ['Hvilken kjernetemperatur har hel kylling?', 'Se <a href="/kjernetemperatur/kylling/">kjernetemperatur for kylling</a>.'],
    ],
    soster: [['/kjernetemperatur/kylling/', 'Kjernetemperatur kylling']],
    andre: [['/steketid/kyllingfilet/', 'Hvor lenge skal kyllingfilet stekes?'], ['/steketid/kalkun/', 'Hvor lenge skal kalkunen stekes?']],
  }),

  kyllingfilet: (h) => ({
    ord: 'kyllingfilet',
    title: 'Hvor lenge skal kyllingfilet stekes?',
    h1: 'Hvor lenge skal kyllingfilet stekes?',
    description: `Liten kyllingfilet tar ${h.t('liten')}, middels ${h.t('middels')} og stor ${h.t('stor')}, ifølge MatPrat (2026). Med pannetid, ovn og hviletid.`,
    lead: `${h.k('mp-kyllingfilet')} oppgir omtrentlig steketid etter størrelse: liten filet ${h.t('liten')}, middels ${h.t('middels')} og stor ${h.t('stor')}. Filetene stekes ${h.t('side')} på hver side, og etterstekes under lokk.`,
    blokker: [
      ['Dette sier Mattilsynet', h.p([h.s('mt-fjorfe'), `${h.k('mt-sommer')} definerer «gjennomstekt» som en kjernetemperatur på minimum ${h.t('mt-gjennom')}. ${h.k('mp-kyllingfilet')} oppgir ${h.t('ferdig')} for kyllingfilet. Begge tall står på <a href="/kjernetemperatur/kylling/">siden om kjernetemperatur for kylling</a>.`])],
      ['Tid etter størrelse', h.tabell({
        tittel: 'Steketid for kyllingfilet, MatPrat',
        kolonner: ['Størrelse', 'Omtrentlig steketid'],
        rader: [['Liten filet', 'liten'], ['Middels filet', 'middels'], ['Stor filet', 'stor']],
      }) + h.p([KILDE(h, 'mp-kyllingfilet', 'Hvordan steke saftig kyllingfilet')])],
      ['Slik gjør du i panne', h.p([`Stek filetene i cirka ${h.t('side')} på hver side. Legg på lokk og etterstek i ${h.t('etter')}, skriver ${h.k('mp-kyllingfilet')}. Filetene hviler ${h.t('hvile')} før servering. ${h.s('kylling-term')}`])],
      ['Mange filetter samtidig', h.p([`For mange filetter oppgir ${h.k('mp-kylling')} at de stekes først i panne, og så i ovn på ${h.t('ovn')} i ${h.t('ovn-t')}.`])],
      ['Kjernetemperaturen', h.p([`${h.k('mp-kyllingfilet')} skriver at filet er ferdig stekt på ${h.t('ferdig')}. ${h.s('kylling-torr')}`])],
    ],
    faq: [
      ['Hvor lenge skal kyllingfilet stekes i panne?', `${h.k('mp-kyllingfilet')}: ${h.t('side')} på hver side, så ${h.t('etter')} under lokk.`],
      ['Hvor lenge skal kyllingfilet hvile?', `${h.k('mp-kyllingfilet')} oppgir ${h.t('hvile')}.`],
      ['Hva er kjernetemperaturen for kyllingfilet?', `Se <a href="/kjernetemperatur/kylling/">kjernetemperatur for kylling</a>. ${h.k('mp-kyllingfilet')} oppgir ${h.t('ferdig')}, mens Mattilsynet definerer gjennomstekt som minimum ${h.t('mt-gjennom')}.`],
    ],
    soster: [['/kjernetemperatur/kylling/', 'Kjernetemperatur kylling']],
    andre: [['/steketid/hel-kylling/', 'Hvor lenge skal hel kylling stekes?']],
  }),

  'laks-i-ovn': (h) => ({
    ord: 'laks i ovn',
    title: 'Hvor lenge skal laks stå i ovnen?',
    h1: 'Hvor lenge skal laks stå i ovnen?',
    description: `${h.k('mp-fisk-kjokken')} oppgir ca. ${h.t('tid')} ved ${h.t('ovn')} for fiskefilet i ovn. En laksoppskrift bruker ${h.t('g-ovn')}. Tid avhenger av tykkelsen.`,
    lead: `Fiskefilet bakes i ovn på ${h.t('ovn')} i ca. ${h.t('tid')}, avhengig av tykkelsen, skriver ${h.k('mp-fisk-kjokken')}. En laksoppskrift fra MatPrat (2016) bruker ${h.t('g-ovn')} i ${h.t('g-tid')} og så ${h.t('g-mer')} til.`,
    blokker: [
      ['Dette sier Mattilsynet', h.p([INGEN_MT(h, 'laks i ovn', 'mp-fisk-kjokken')])],
      ['Tider for laks og fisk', h.tabell({
        tittel: 'Steketid for laks i ovn, MatPrat',
        kolonner: ['Metode', 'Ovn', 'Tid'],
        rader: [
          [{ html: `Fiskefilet i ovn, artikkelen fra ${h.kp('mp-fisk-kjokken')}` }, 'ovn', { felt: 'tid', ca: true }],
          [{ html: 'Filet i ovn, tykkere stykker, tabellen for fisk' }, 'tab-ovn', { felt: 'tab-tid', ca: true }],
          [{ html: 'Filet i folie' }, 'folie-ovn', { tekst: 'Temperaturen kan økes, ifølge artikkelen' }],
          [{ html: 'Laksefilet med ingefærglaze' }, 'g-ovn', { html: `${h.t('g-tid')}, og så ${h.t('g-mer')}` }],
          [{ html: `Helstekt fisk i folie, ${h.t('hel-kg')}` }, 'hel-ovn', { felt: 'hel-t', ca: true }],
        ],
      }) + h.p([`Porsjonen er ${h.t('tab-pp')} i tabellen for fisk. ${KILDE(h, 'mp-fisk', 'Steke- og koketips for fisk og skalldyr')}`])],
      ['Slik ser du at fisken er ferdig', h.p([h.s('fisk-ferdig'), h.s('laks-rosa')])],
      ['Kjernetemperaturen', h.p([`Tabellen for fisk oppgir ca. ${h.t('tab-kjerne')}, eller lavere om du vil ha en rå kjerne. Se <a href="/kjernetemperatur/laks/">kjernetemperatur for laks</a>.`])],
    ],
    faq: [
      ['Hvor lenge skal laks stå i ovnen?', `Fiskefilet bakes ca. ${h.t('tid')} ved ${h.t('ovn')}, avhengig av tykkelsen, ifølge ${h.k('mp-fisk-kjokken')}.`],
      ['Hvor lenge skal laks stå i ovnen i folie?', `${h.k('mp-fisk-kjokken')} skriver at temperaturen kan økes til ${h.t('folie-ovn')} når filetene er pakket i folie.`],
      ['Hvilken kjernetemperatur har laks?', 'Se <a href="/kjernetemperatur/laks/">kjernetemperatur for laks</a>.'],
    ],
    soster: [['/kjernetemperatur/laks/', 'Kjernetemperatur laks']],
    andre: [['/kjernetemperatur/torsk/', 'Kjernetemperatur torsk']],
  }),

  'bakt-potet': (h) => ({
    ord: 'bakt potet',
    title: 'Hvor lenge skal bakt potet stå i ovnen?',
    h1: 'Hvor lenge skal bakt potet stå i ovnen?',
    description: `Bakt potet i folie står ${h.t('tid')} ved ${h.t('ovn')}, ifølge ${h.k('mp-bakt-potet')}. Med tider for potet med olje, saltbakte poteter og hasselbackpoteter.`,
    lead: `${h.k('mp-bakt-potet')} oppgir at en bakt potet i folie stekes ${h.t('tid')} midt i ovnen på ${h.t('ovn')}, og kanskje lenger hvis poteten er stor. Poteten er ferdig når den gir lett etter.`,
    blokker: [
      ['Dette sier Mattilsynet', h.p([INGEN_MT(h, 'bakt potet', 'mp-bakt-potet')])],
      ['Fire måter å bake poteter på', h.tabell({
        tittel: 'Steketid for bakte poteter, MatPrat',
        kolonner: ['Metode', 'Ovn', 'Tid'],
        rader: [
          ['Bakt potet i folie', 'ovn', { felt: 'tid', ca: true }],
          [{ html: 'Bakt potet med olje' }, null, { felt: 'olje-tid', ca: true }],
          ['Saltbakte poteter', 'salt-ovn', { felt: 'salt-tid', ca: true }],
          ['Hasselbackpoteter', 'hassel-ovn', { felt: 'hassel-tid', ca: true }],
        ],
      }) + h.p([`Kildene er ${h.k('mp-bakt-potet')}, ${h.k('mp-potet-olje')}, ${h.k('mp-saltbakt')} og ${h.k('mp-hasselback')}. Oppskriften med olje oppgir ingen ovnstemperatur i teksten vi leste.`])],
      ['Slik gjør du', h.p([h.s('potet-stikk'), h.s('potet-folie'), h.s('potet-ferdig'), `${h.k('mp-bakt-potet')} regner ${h.t('pp')} bakepotet per person.`])],
    ],
    faq: [
      ['Hvor lenge skal bakt potet stå i ovnen?', `${h.k('mp-bakt-potet')} oppgir ${h.t('tid')} ved ${h.t('ovn')}, i folie.`],
      ['Hvordan vet jeg at bakt potet er ferdig?', h.s('potet-ferdig')],
      ['Hvor lenge skal saltbakte poteter stå i ovnen?', `Ca. ${h.t('salt-tid')} ved ${h.t('salt-ovn')}, ifølge ${h.k('mp-saltbakt')}.`],
    ],
    soster: [['/steketid/poteter-og-ris/', 'Hvor lenge skal poteter og ris koke?']],
    andre: [['/steketid/', 'Steketid for alle rettene']],
  }),

  egg: (h) => ({
    ord: 'egg',
    title: 'Hvor lenge skal egg koke?',
    h1: 'Hvor lenge skal egg koke?',
    description: `Bløtkokt egg koker ${h.t('blot')}, smilende egg ${h.t('smil')} og hardkokt egg ${h.t('hard')}, ifølge MatPrat (2026). Med avkjøling og hva som påvirker tiden.`,
    lead: `${h.k('mp-egg')} oppgir at bløtkokt egg koker ${h.t('blot')}, smilende egg ${h.t('smil')} og hardkokt egg ${h.t('hard')}. Eggene avkjøles raskt i kaldt vann etterpå.`,
    blokker: [
      ['Dette sier Mattilsynet', h.p([INGEN_MT(h, 'egg', 'mp-egg')])],
      ['Koketid for egg', h.tabell({
        tittel: 'Koketid for egg, MatPrat',
        kolonner: ['Egget', 'Koketid'],
        rader: [['Bløtkokt egg', 'blot'], ['Smilende egg', 'smil'], ['Hardkokt egg', 'hard']],
      }) + h.p([KILDE(h, 'mp-egg', 'Hvordan koke egg')])],
      ['Avkjøling', h.p([h.s('egg-kjol'), h.s('egg-hard-kjol')])],
      ['Hva påvirker koketiden?', h.p([h.s('egg-just'), `${h.k('mp-egg')} skriver at du kan måtte justere med ${h.t('just')} under disse forholdene.`])],
    ],
    faq: [
      ['Hvor lenge skal et egg koke?', `${h.t('blot')} for bløtkokt, ${h.t('smil')} for smilende og ${h.t('hard')} for hardkokt, ifølge ${h.k('mp-egg')}.`],
      ['Hvor lenge skal hardkokte egg avkjøles?', h.s('egg-hard-kjol')],
    ],
    andre: [['/steketid/poteter-og-ris/', 'Hvor lenge skal poteter og ris koke?'], ['/steketid/', 'Steketid for alle rettene']],
  }),

  'poteter-og-ris': (h) => ({
    ord: 'poteter og ris',
    title: 'Hvor lenge skal poteter og ris koke?',
    h1: 'Hvor lenge skal poteter og ris koke?',
    description: `Poteter koker ${h.t('potet')}, ifølge MatPrat (2019). Vanlig ris sjekkes etter ${h.t('hvit')}, fullkornsris trenger opptil ${h.t('fullkorn')}.`,
    lead: `${h.k('mp-poteter')} skriver at koketiden for poteter varierer med type og størrelse, fra ${h.t('potet')}. For langkornet ris, basmatiris og jasminris skriver ${h.k('mp-ris')} at du kan sjekke risen etter ${h.t('hvit')}.`,
    blokker: [
      ['Dette sier Mattilsynet', h.p([INGEN_MT(h, 'koking av poteter og ris', 'mp-poteter')])],
      ['Koketid for poteter og ris', h.tabell({
        tittel: 'Koketid for poteter og ris, MatPrat',
        kolonner: ['Hva', 'Koketid'],
        rader: [['Poteter', { felt: 'potet' }], ['Hvit ris, sjekk etter', 'hvit'], ['Fullkornsris, opptil', 'fullkorn'], ['Villris uten bløtlegging', 'vill']],
      }) + h.p([`${KILDE(h, 'mp-poteter', 'Hvordan koke poteter')} ${KILDE(h, 'mp-ris', 'Hvordan koke ris')}`])],
      ['Potetene', h.p([h.s('potet-sort')])],
      ['Risen', h.p([h.s('ris-lokk'), `For fullkornsris skriver ${h.k('mp-ris')} at koketiden er opptil ${h.t('fullkorn')}, og for villris rundt ${h.t('vill')} uten bløtlegging.`])],
    ],
    faq: [
      ['Hvor lenge skal poteter koke?', `${h.k('mp-poteter')}: ${h.t('potet')}, avhengig av type og størrelse.`],
      ['Hvor lenge skal ris koke?', `${h.k('mp-ris')} skriver at du kan sjekke vanlig ris etter ${h.t('hvit')}. Er den ikke ferdig, lar du den stå et par minutter til.`],
    ],
    soster: [['/steketid/bakt-potet/', 'Hvor lenge skal bakt potet stå i ovnen?']],
    andre: [['/steketid/egg/', 'Hvor lenge skal egg koke?']],
  }),
};

/** Samlesiden: tabellen over alle rettene. */
export function nav({ rader, sti, h, tabell, p, esc }) {
  const rad = (id) => rader.find((r) => r.id === id);
  const lenke = (id) => ({ html: `<a href="${sti(rad(id))}">${esc(rad(id).navn)}</a>` });
  const hh = (id) => h(rad(id));
  const t = (id, f, o) => hh(id).t(f, o);
  const rr = [
    [lenke('ribbe'), { html: `${t('ribbe', 'damp-ovn')} i ${t('ribbe', 'damp', { ca: true })}, så ${t('ribbe', 'stek-ovn')} i ${t('ribbe', 'stek', { ca: true })}` }, { html: `${t('ribbe', 'hvile', { ca: true })}` }, { html: hh('ribbe').k('mp-ribbe') }],
    [lenke('pinnekjott'), { html: `Utvanning ${t('pinnekjott', 'utvann', { ca: true })}, damping ${t('pinnekjott', 'damp', { ca: true })}` }, null, { html: hh('pinnekjott').k('mp-pinnekjott') }],
    [lenke('kalkun'), { html: `${t('kalkun', 'per-kilo')} ved ${t('kalkun', 'ovn')}` }, { html: t('kalkun', 'hvile') }, { html: hh('kalkun').k('mp-hel-kalkun') }],
    [lenke('lammelar'), { html: `${t('lammelar', 'ben-kg')} ved ${t('lammelar', 'ovn')}: ca. ${t('lammelar', 'ben-t')}` }, { html: `ca. ${t('lammelar', 'hvile')}` }, { html: hh('lammelar').k('mp-lam') }],
    [lenke('svinestek'), { html: `Surret stek på ${t('svinestek', 'kg')} ved ${t('svinestek', 'surret-ovn')}: ca. ${t('svinestek', 'surret-t')}` }, { html: `ca. ${t('svinestek', 'hvile')}` }, { html: hh('svinestek').k('mp-svin') }],
    [lenke('roastbiff'), { html: `${t('roastbiff', 'kg')} ved ${t('roastbiff', 'ovn')}: ca. ${t('roastbiff', 'tid')}` }, null, { html: hh('roastbiff').k('mp-storfe') }],
    [lenke('hel-kylling'), { html: `${t('hel-kylling', 'g')} ved ${t('hel-kylling', 'ovn')}: ca. ${t('hel-kylling', 't')} og ${t('hel-kylling', 'm')}` }, null, { html: hh('hel-kylling').k('mp-kylling') }],
    [lenke('kyllingfilet'), { html: `Liten ${t('kyllingfilet', 'liten')}, middels ${t('kyllingfilet', 'middels')}, stor ${t('kyllingfilet', 'stor')}` }, { html: t('kyllingfilet', 'hvile') }, { html: hh('kyllingfilet').k('mp-kyllingfilet') }],
    [lenke('laks-i-ovn'), { html: `Filet ved ${t('laks-i-ovn', 'ovn')}: ca. ${t('laks-i-ovn', 'tid')}` }, null, { html: hh('laks-i-ovn').k('mp-fisk-kjokken') }],
    [lenke('bakt-potet'), { html: `I folie ved ${t('bakt-potet', 'ovn')}: ${t('bakt-potet', 'tid')}` }, null, { html: hh('bakt-potet').k('mp-bakt-potet') }],
    [lenke('egg'), { html: `Bløtkokt ${t('egg', 'blot')}, hardkokt ${t('egg', 'hard')}` }, null, { html: hh('egg').k('mp-egg') }],
    [lenke('poteter-og-ris'), { html: `Poteter ${t('poteter-og-ris', 'potet')}, vanlig ris sjekkes etter ${t('poteter-og-ris', 'hvit')}` }, null, { html: hh('poteter-og-ris').k('mp-poteter') }],
  ];
  const k = hh('kalkun');
  return {
    title: 'Steketid: hvor lenge skal maten stekes?',
    description: `Steketid for ribbe, pinnekjøtt, kalkun, lammelår, svinestek, roastbiff, kylling, laks, bakt potet og egg. ${rader.length} retter med tid fra MatPrat (med årstall), og kalkulator for kalkun.`,
    h1: 'Steketid: hvor lenge skal maten stekes?',
    lead: `Her er steketidene for retter folk ofte lager, hentet fra MatPrat med årstall. Der kilden oppgir tid per kilo, finnes det en kalkulator. Kalkun er den eneste med slik regel: ${k.t('per-kilo')} ved ${k.t('ovn')}. Kjernetemperaturen står på <a href="/kjernetemperatur/">sidene om kjernetemperatur</a>, der Mattilsynet er gjengitt først.`,
    rik: [
      '<h2>Mattilsynet</h2>',
      p(['Vi fant ingen steketider hos Mattilsynet. Mattilsynet har råd om kjernetemperatur for fjørfe og kjøttdeig, og de står på sidene om kjernetemperatur.']),
      '<h2>Alle rettene</h2>',
      p(['Tidene er hentet fra MatPrat. «Ikke oppgitt» betyr at kilden ikke har et tall.']),
      tabell(hh('ribbe'), { tittel: 'Steketid for alle rettene', kolonner: ['Rett', 'Ovn og tid', 'Hvile', 'Kilde'], rader: rr }),
      '<h2>Hvorfor ingen kalkulator på de fleste sidene?</h2>',
      p(['Ribba steker like lenge uansett vekt, ifølge MatPrat. For de fleste andre rettene oppgir MatPrat tid for en bestemt vekt, ikke per kilo. Da regner vi ikke ut en tid selv.']),
      '<h2>Disse har vi holdt utenfor</h2>',
      p(['And: kilden oppgir en kjernetemperatur som ligger langt under det Mattilsynet skriver om fjørfe, og vi tar den ikke med før vi har en sikker kilde.']),
    ].join('\n'),
    faqTittel: 'Spørsmål om steketid',
    faq: [
      ['Hvor lenge skal ribba stekes?', 'Se <a href="/steketid/ribbe/">hvor lenge ribba skal stekes</a>. MatPrat oppgir damping og steking, og steketiden er lik uansett vekt.'],
      ['Hvor lenge skal kalkunen stekes?', `${k.k('mp-hel-kalkun')} anbefaler ${k.t('per-kilo')} ved ${k.t('ovn')}. Se <a href="/steketid/kalkun/">kalkulatoren</a>.`],
      ['Hvor finner jeg kjernetemperaturen?', 'På <a href="/kjernetemperatur/">sidene om kjernetemperatur</a>.'],
    ],
  };
}

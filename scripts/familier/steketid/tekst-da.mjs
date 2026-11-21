// Tekst til familien «steketid» (da): stegetider i ovnen og kogetider. Hver sætning gengiver, hvad en navngiven dansk kilde siger.
// Tal skrives aldrig her: h.t(felt) henter dem fra data.da.json, hvor hvert tal har sitatet fra kilden. Setninger fra kilden hentes ordret med h.s(id).
// Kilder: Madens Verden (tabellen over kernetemperatur og stegetid, 2026, og egne sider), Landbrug & Fødevarer (stegetider, 2018), Danish Crown (producent), Arla.
// Kernetemperaturen for kød står på /da/kernetemperatur/. Tiderne her er vejledende, og alle kilderne siger, at termometeret afgør.
// Undgå ordene køleskab, rester, plan, uge, find, gem, sådan, ovn, trin, lav, timer og opskrift i h2-overskrifter, undtagen i app-blokken: scripts/app-bevis.mjs ville ellers lægge appkort ind under dem.

const KERNE = '/da/kernetemperatur/';
const AF = '/da/airfryer/';
const HVOR = '/da/hvor-meget-pr-person/';
const S = '/da/stegetid/';
const L = (slug, tekst) => [`${S}${slug}/`, tekst];
const KOL = ['Hvad', 'Ovn', 'Tid', 'Kernetemperatur'];
const TID = 'Tider og temperaturer';

export const TEKST = {
  flaeskesteg: (h) => ({
    ord: 'flæskesteg',
    title: 'Hvor længe skal flæskestegen have i ovnen? Tid og temperatur',
    h1: 'Hvor længe skal flæskestegen have i ovnen?',
    description: `Madens Verden regner med ${h.t('tid', { ca: true })} ved ${h.t('ovn')}. Danish Crown giver ${h.t('dc-tid', { ca: true })} ved ${h.t('dc-temp')}. Her er tallene og kernetemperaturen.`,
    lead: `${h.k('mv-kerne')} regner med ${h.t('tid', { ca: true })} ved ${h.t('ovn')} i ovnen. Det er en pejling til planlægningen. Kernetemperaturen afgør, hvornår stegen er færdig.`,
    kilder: [
      `${h.k('mv-kerne')} skriver, at flæskesteg tages ud ved ${h.t('tagaf')} og ender på ${h.t('kerne')} efter hvile. Hviletiden er ${h.t('hvile')}.`,
      `${h.k('dc-flaesk')} giver en stegetid for en steg på ${h.t('dc-vaegt')}: først ${h.t('dc-forst')} med sværene nedad i kogende vand ved ${h.t('dc-temp')}, derefter ${h.t('dc-tid', { ca: true })} på rist, til kernetemperaturen er ${h.t('dc-kerne')}. Så skal stegen hvile ${h.t('dc-hvile')}.`,
      `${h.k('mv-stegeso')} har en langsom metode i stegeso: ${h.t('steso-temp')} i ${h.t('steso-tid')} for en steg på ${h.t('steso-vaegt')}.`,
      `${h.k('lf-stegning')} anbefaler ${h.t('lf-kerne')} i centrum, når flæskestegen serveres.`,
      `Madens Verden skriver om tiderne: ${h.s('termo', { med: false })}`,
    ],
    tabell: {
      tittel: TID, kilde: 'mv-kerne', intro: 'Tabellen sætter tre metoder side om side. Alle tal står hos kilderne under tabellen.', kolonner: KOL,
      rader: [
        ['Flæskesteg i ovn, Madens Verden', 'ovn', 'tid', 'kerne'],
        ['Flæskesteg i ovn, Danish Crown', 'dc-temp', 'dc-tid', 'dc-kerne'],
        ['Flæskesteg i stegeso', 'steso-temp', 'steso-tid', null],
      ],
      etter: [`Madens Verden skriver: ${h.s('vejl', { med: false })}`],
    },
    ekstra: [
      ['Kernetemperatur og hvile', h.p([
        `Tag stegen ud, når termometeret viser ${h.t('tagaf')}, og lad den hvile i ${h.t('hvile')}. Så stiger temperaturen til ${h.t('kerne')}, skriver ${h.k('mv-kerne')}.`,
        `Om hvilen skriver Madens Verden: ${h.s('hvile', { med: false })}`,
        'Sprøde svær og tid er to forskellige ting. Madens Verden skriver, at sværene også styres af overvarmen, og Danish Crown giver tips til svær på sin side. Se <a href="/da/kernetemperatur/flaeskesteg/">kernetemperatur for flæskesteg</a> for tallene hos Fødevarestyrelsen og Landbrug & Fødevarer.',
      ])],
    ],
    faq: [
      ['Hvor længe skal en flæskesteg have i ovnen?', `${h.k('mv-kerne')} regner med ${h.t('tid', { ca: true })} ved ${h.t('ovn')}. ${h.k('dc-flaesk')} giver ${h.t('dc-tid', { ca: true })} ved ${h.t('dc-temp')} for en steg på ${h.t('dc-vaegt')}.`],
      ['Hvilken kernetemperatur skal en flæskesteg have?', `${h.k('lf-stegning')} anbefaler ${h.t('lf-kerne')}, og ${h.k('mv-kerne')} skriver ${h.t('kerne')} efter hvile.`],
      ['Hvor længe skal en flæskesteg hvile?', `${h.k('mv-kerne')} skriver ${h.t('hvile')}, og ${h.k('dc-flaesk')} skriver ${h.t('dc-hvile')}.`],
      ['Kan man lave flæskesteg i airfryer?', `Ja. Se <a href="${AF}flaeskesteg/">flæskesteg i airfryer</a> med tider fra Danish Crown.`],
    ],
    soster: [KERNE + 'flaeskesteg/', 'Kernetemperatur for flæskesteg'],
    andre: [[AF + 'flaeskesteg/', 'Flæskesteg i airfryer'], [HVOR + 'flaeskesteg/', 'Hvor meget flæskesteg pr. person?'], L('and', 'Hvor længe skal anden have i ovnen?')],
  }),

  and: (h) => ({
    ord: 'and',
    title: 'Hvor længe skal anden have i ovnen? Stegetid for hel and',
    h1: 'Hvor længe skal anden have i ovnen?',
    description: `Madens Verden regner med ${h.t('tid', { ca: true })} ved ${h.t('ovn')} for en hel and, og tabellen skriver en kernetemperatur på ${h.t('kerne')}.`,
    lead: `En hel and skal have ${h.t('tid', { ca: true })} ved ${h.t('ovn')}, skriver ${h.k('mv-kerne')}. Termometeret i inderlåret afgør, hvornår den er færdig.`,
    kilder: [
      `${h.k('mv-kerne')} nævner hel and med en kernetemperatur på ${h.t('kerne')}. Anden tages ud ved ${h.t('tagaf')}, og hviletiden er ${h.t('hvile')}.`,
      `Om hvor man måler, skriver Madens Verden: ${h.s('laar', { med: false })}`,
      `Om hele fugle skriver tabellen: ${h.s('flere', { med: false })}`,
      `Andebryst står for sig i samme tabel: stegetiden efter brunning er ${h.t('brysttid')}, og kernetemperaturen er ${h.t('brysthvile')}. Tabellen kalder det en dansk forsigtighedsanbefaling.`,
    ],
    tabell: {
      tittel: TID, kilde: 'mv-kerne', intro: 'Tabellen viser hel and og andebryst i Madens Verdens oversigt.', kolonner: ['Hvad', 'Ovn', 'Tid', 'Kernetemperatur'],
      rader: [['Hel and', 'ovn', 'tid', 'kerne'], ['Andebryst (steg på skindsiden, færdiggør i ovn)', null, 'brysttid', 'brysthvile']],
      etter: [`Madens Verden skriver: ${h.s('vejl', { med: false })}`],
    },
    ekstra: [
      ['Hvile og måling', h.p([
        `Lad anden hvile ${h.t('hvile')} før udskæring. Tallet er fra ${h.k('mv-kerne')}.`,
        'Vi har ikke fundet en dansk kilde med en stegetid for gås eller for and i airfryer ud over andebryst. Se <a href="/da/airfryer/andebryst/">andebryst i airfryer</a>.',
      ])],
    ],
    faq: [
      ['Hvor længe skal en hel and stege?', `${h.k('mv-kerne')} regner med ${h.t('tid', { ca: true })} ved ${h.t('ovn')}.`],
      ['Hvilken kernetemperatur skal en and have?', `${h.k('mv-kerne')} skriver ${h.t('kerne')} i tabellen. ${h.s('laar')}`],
      ['Hvor længe skal en and hvile?', `${h.k('mv-kerne')} skriver ${h.t('hvile')}.`],
    ],
    soster: [KERNE + 'and/', 'Kernetemperatur for and'],
    andre: [L('flaeskesteg', 'Hvor længe skal flæskestegen have i ovnen?'), [AF + 'andebryst/', 'Andebryst i airfryer']],
  }),

  kalkun: (h) => ({
    ord: 'kalkun',
    title: 'Hvor længe skal en kalkun have i ovnen? Tid pr. kilo',
    h1: 'Hvor længe skal en kalkun have i ovnen?',
    description: `Madens Verden regner med ${h.t('k-tid', { ca: true })} ved ${h.t('k-temp')} for en hel kalkun og har en tabel for vægt. Kernetemperaturen er ${h.t('kerne')}.`,
    lead: `${h.k('mv-kalkun')} regner med ${h.t('k-tid', { ca: true })} ved ${h.t('k-temp')} og har en tabel for forskellige vægte. Madens Verdens oversigt regner med ${h.t('tid', { ca: true })} ved ${h.t('ovn')}.`,
    kilder: [
      `${h.k('mv-kalkun')} bruger ${h.t('k-tid', { ca: true })} ved ${h.t('k-temp')}, almindelig over- og undervarme. Kalkunen skal hvile ${h.t('k-hvile', { ca: true })} før udskæring.`,
      `${h.k('mv-kerne')} nævner hel kalkun med ${h.t('tid', { ca: true })} ved ${h.t('ovn')} og en hviletid på ${h.t('hvile')}. Kalkunbryst står for sig: ${h.t('brysttid', { ca: true })} ved ${h.t('brystovn')}.`,
      `Kernetemperaturen er ${h.t('kerne')}. Om målingen skriver tabellen: ${h.s('flere', { med: false })}`,
    ],
    tabell: {
      tittel: 'Stegetid efter vægt', kilde: 'mv-kalkun', intro: `Tabellen er Madens Verdens egen tommelfingerregel for en kalkun ved ${h.t('k-temp')}.`, kolonner: ['Kalkunens vægt', 'Vejledende stegetid'],
      rader: [['3 kg', { tekst: 'Ca. 2 timer og 15 minutter' }], ['4 kg', { tekst: 'Ca. 3 timer' }], ['5 kg', { tekst: 'Ca. 3 timer og 45 minutter' }], ['6 kg', { tekst: 'Ca. 4 timer og 30 minutter' }], ['7 kg', { tekst: 'Ca. 5 timer og 15 minutter' }], ['8 kg', { tekst: 'Ca. 6 timer' }]],
      etter: [`Madens Verden skriver: ${h.s('tabelnote', { med: false })}`],
    },
    ekstra: [
      ['Store kalkuner og kalkunbryst', h.p([
        'Madens Verden skriver, at store kalkuner ikke altid følger en lineær stegetid, og at de største fugle kan være færdige tidligere end tabellen siger. Begynd derfor at måle i god tid.',
        `Kalkunbryst har sin egen linje i oversigten: ${h.t('brysttid', { ca: true })} ved ${h.t('brystovn')}. Se også <a href="${HVOR}kalkun/">hvor meget kalkun der skal regnes pr. person</a>.`,
      ])],
    ],
    faq: [
      ['Hvor lang tid skal en kalkun have pr. kilo?', `${h.k('mv-kalkun')} regner med ${h.t('k-tid', { ca: true })} ved ${h.t('k-temp')}. ${h.k('mv-kerne')} regner med ${h.t('tid', { ca: true })} ved ${h.t('ovn')}.`],
      ['Hvilken kernetemperatur skal en kalkun have?', `${h.k('mv-kerne')} skriver ${h.t('kerne')}.`],
      ['Hvor længe skal kalkunen hvile?', `${h.k('mv-kalkun')} skriver ${h.t('k-hvile', { ca: true })}, og ${h.k('mv-kerne')} skriver ${h.t('hvile')}.`],
    ],
    soster: [KERNE + 'kalkun/', 'Kernetemperatur for kalkun'],
    andre: [[HVOR + 'kalkun/', 'Hvor meget kalkun pr. person?'], L('hel-kylling', 'Hvor længe skal en hel kylling have i ovnen?')],
  }),

  'hel-kylling': (h) => ({
    ord: 'hel kylling',
    title: 'Hvor længe skal en hel kylling have i ovnen? Tid og temperatur',
    h1: 'Hvor længe skal en hel kylling have i ovnen?',
    description: `Madens Verden regner med ${h.t('tid', { ca: true })} ved ${h.t('ovn')} for en hel kylling. Kernetemperaturen er ${h.t('kerne')}. Se tallene og hvor du måler.`,
    lead: `En hel kylling skal have ${h.t('tid', { ca: true })} ved ${h.t('ovn')}, skriver ${h.k('mv-kerne')}. Kernetemperaturen er ${h.t('kerne')}.`,
    kilder: [
      `${h.k('mv-kerne')} skriver om hel kylling: kernetemperatur ${h.t('kerne')}, tages ud ved ${h.t('tagaf')}, hviletid ${h.t('hvile')}.`,
      `Om hvor man måler, står der i tabellen: ${h.s('maal', { med: false })}`,
      `Og om hele fugle: ${h.s('flere', { med: false })}`,
    ],
    tabell: { tittel: TID, kilde: 'mv-kerne', intro: 'Tallene er fra Madens Verdens oversigt.', kolonner: ['Hvad', 'Ovn', 'Tid', 'Kernetemperatur'], rader: [['Hel kylling', 'ovn', 'tid', 'kerne']], etter: [`Madens Verden skriver: ${h.s('vejl', { med: false })}`] },
    ekstra: [
      ['Vil du bruge airfryer?', `<p>Hel kylling har sin egen side med tider for airfryer fra Madens Verden og Arla: <a href="${AF}hel-kylling/">hel kylling i airfryer</a>.</p>`],
    ],
    faq: [
      ['Hvor længe skal en hel kylling have i ovnen?', `${h.k('mv-kerne')} regner med ${h.t('tid', { ca: true })} ved ${h.t('ovn')}.`],
      ['Hvor skal man måle kernetemperaturen på en hel kylling?', h.s('maal')],
      ['Hvor længe skal kyllingen hvile?', `${h.k('mv-kerne')} skriver ${h.t('hvile')} i tabellen.`],
    ],
    soster: [KERNE + 'kylling/', 'Kernetemperatur for kylling'],
    andre: [L('kyllingebryst', 'Hvor længe skal kyllingebryst have i ovnen?'), [AF + 'hel-kylling/', 'Hel kylling i airfryer'], L('kalkun', 'Hvor længe skal en kalkun have i ovnen?')],
  }),

  kyllingfilet: (h) => ({
    ord: 'kyllingebryst',
    title: 'Hvor længe skal kyllingebryst have i ovnen eller på panden?',
    h1: 'Hvor længe skal kyllingebryst have i ovnen?',
    description: `Madens Verden skriver ${h.t('tid', { ca: true })} i alt for kyllingebryst på pande eller i ovn og ${h.t('laartid', { ca: true })} for kyllingelår ved ${h.t('laarovn')}. Kernetemperaturen er ${h.t('kerne')}.`,
    lead: `Kyllingebryst skal have typisk ${h.t('tid')} i alt, skriver ${h.k('mv-kerne')}. Kernetemperaturen er ${h.t('kerne')}.`,
    kilder: [
      `${h.k('mv-kerne')} skriver om kyllingebryst: ${h.t('tid')} i alt på pande eller i ovn, kernetemperatur ${h.t('kerne')} og hviletid ${h.t('hvile')}.`,
      `Kyllingelår står i samme tabel: ${h.t('laartid')} ved ${h.t('laarovn')} og en kernetemperatur på ${h.t('laarkerne')}. ${h.s('laarnote')}`,
    ],
    tabell: {
      tittel: TID, kilde: 'mv-kerne', intro: 'Tallene er fra Madens Verdens oversigt.', kolonner: ['Hvad', 'Ovn', 'Tid', 'Kernetemperatur'],
      rader: [['Kyllingebryst (pande eller ovn)', null, 'tid', 'kerne'], ['Kyllingelår', 'laarovn', 'laartid', 'laarkerne']],
      etter: [`Madens Verden skriver: ${h.s('vejl', { med: false })}`],
    },
    ekstra: [
      ['Airfryer og mængde', h.p([`Kyllingebryst i airfryer har sin egen side: <a href="${AF}kyllingebryst/">kyllingebryst i airfryer</a>.`, `Til hvor meget der skal regnes pr. person, se <a href="${HVOR}kylling/">hvor meget kylling pr. person</a>.`])],
    ],
    faq: [
      ['Hvor længe skal kyllingebryst steges?', `${h.k('mv-kerne')} skriver typisk ${h.t('tid')} i alt på pande eller i ovn.`],
      ['Hvilken kernetemperatur skal kyllingebryst have?', `${h.k('mv-kerne')} skriver ${h.t('kerne')}.`],
      ['Hvor længe skal kyllingelår have i ovnen?', `${h.k('mv-kerne')} skriver typisk ${h.t('laartid')} ved ${h.t('laarovn')}.`],
    ],
    soster: [KERNE + 'kylling/', 'Kernetemperatur for kylling'],
    andre: [[AF + 'kyllingebryst/', 'Kyllingebryst i airfryer'], L('hel-kylling', 'Hvor længe skal en hel kylling have i ovnen?')],
  }),

  roastbiff: (h) => ({
    ord: 'roastbeef',
    title: 'Hvor længe skal roastbeef have i ovnen? Kernetemperatur og tid',
    h1: 'Hvor længe skal roastbeef have i ovnen?',
    description: `Roastbeef steges ved ${h.t('ovn')} til kernetemperaturen er nået: ${h.t('medium')} til medium, skriver Madens Verden. Se tallene og hviletiden.`,
    lead: `Madens Verden giver ingen fast tid for roastbeef i ovnen, men siger ${h.t('ovn')} til kernetemperaturen er nået. Medium er ${h.t('medium')}.`,
    kilder: [
      `${h.k('mv-kerne')} skriver om roastbeef ved ${h.t('ovn')}: rød ${h.t('roed')}, medium ${h.t('medium')}, gennemstegt ${h.t('gennem')}. Roastbeef tages ud ved ${h.t('tagaf')} til medium og hviler ${h.t('hvile')}.`,
      `${h.k('lf-stegning')} anbefaler ${h.t('lf')} ved servering.`,
      `Oksefilet har en tid i samme tabel: ${h.t('filettid')} ved ${h.t('filet')}, afhængigt af tykkelsen.`,
      `Om eftervarmen skriver Madens Verden: ${h.s('eftervarme', { med: false })}`,
    ],
    tabell: {
      tittel: 'Roastbeef efter stegegrad', kilde: 'mv-kerne', intro: 'Roastbeef i ovn, tallene er fra Madens Verdens oversigt.', kolonner: ['Stegegrad', 'Kernetemperatur', 'Tages ud ved'],
      rader: [['Rød', 'roed', null], ['Medium', 'medium', 'tagaf'], ['Gennemstegt', 'gennem', null]],
      etter: [`Madens Verden skriver: ${h.s('vejl', { med: false })}`],
    },
    ekstra: [
      ['Hvile og folie', h.p([`Roastbeef skal hvile ${h.t('hvile')}. Madens Verden skriver: ${h.s('ingen', { med: false })}`, 'Vi har ikke fundet en dansk kilde med minutter pr. kilo for roastbeef, så der er ingen sådan regel her. Termometeret er vejen.'])],
    ],
    faq: [
      ['Hvor længe skal roastbeef i ovnen?', `${h.k('mv-kerne')} angiver ${h.t('ovn')} til kernetemperaturen er nået, og har ikke en fast tid.`],
      ['Hvilken kernetemperatur skal roastbeef have?', `${h.k('mv-kerne')}: rød ${h.t('roed')}, medium ${h.t('medium')}. ${h.k('lf-stegning')}: ${h.t('lf')}.`],
      ['Hvor længe skal roastbeef hvile?', `${h.k('mv-kerne')} skriver ${h.t('hvile')}.`],
    ],
    soster: [KERNE + 'roastbeef/', 'Kernetemperatur for roastbeef'],
    andre: [L('lammekoelle', 'Hvor længe skal en lammekølle have i ovnen?'), L('svinemoerbrad', 'Hvor længe skal svinemørbrad have i ovnen?')],
  }),

  lammelar: (h) => ({
    ord: 'lammekølle',
    title: 'Hvor længe skal en lammekølle have i ovnen? Tid pr. kilo',
    h1: 'Hvor længe skal en lammekølle have i ovnen?',
    description: `Rosa lammekølle skal have ${h.t('rosa-tid', { ca: true })} ved ${h.t('ovn')}, og medium ${h.t('medium-tid', { ca: true })}, skriver Madens Verden. Se kernetemperaturerne.`,
    lead: `${h.k('mv-kerne')} regner med ${h.t('rosa-tid', { ca: true })} for en rosa lammekølle og ${h.t('medium-tid', { ca: true })} til medium, begge ved ${h.t('ovn')}.`,
    kilder: [
      `${h.k('mv-kerne')} skriver om lammekølle: rosa har kernetemperaturen ${h.t('rosa-kerne')} og tages ud ved ${h.t('rosa-tagaf')}. Medium har ${h.t('medium-kerne')}. Hviletiden er ${h.t('hvile')}.`,
      `Madens Verden skriver også: ${h.s('rosa', { med: false })}`,
    ],
    tabell: {
      tittel: TID, kilde: 'mv-kerne', intro: 'Lammekølle i ovn, tallene er fra Madens Verdens oversigt.', kolonner: ['Stegegrad', 'Ovn', 'Tid', 'Kernetemperatur'],
      rader: [['Rosa', 'ovn', 'rosa-tid', 'rosa-kerne'], ['Medium', 'ovn', 'medium-tid', 'medium-kerne']],
      etter: [`Madens Verden skriver: ${h.s('vejl', { med: false })}`],
    },
    ekstra: [['Måling og hvile', h.p([`Lammekøllen skal hvile ${h.t('hvile')}. Tag den ud ved ${h.t('rosa-tagaf')}, hvis du vil have den rosa.`])]],
    faq: [
      ['Hvor længe skal en lammekølle have i ovnen?', `${h.k('mv-kerne')} regner med ${h.t('rosa-tid', { ca: true })} til rosa og ${h.t('medium-tid', { ca: true })} til medium ved ${h.t('ovn')}.`],
      ['Hvilken kernetemperatur skal en lammekølle have?', `${h.k('mv-kerne')}: rosa ${h.t('rosa-kerne')}, medium ${h.t('medium-kerne')}.`],
    ],
    soster: [KERNE + 'lammekoelle/', 'Kernetemperatur for lammekølle'],
    andre: [L('roastbeef', 'Hvor længe skal roastbeef have i ovnen?'), L('flaeskesteg', 'Hvor længe skal flæskestegen have i ovnen?')],
  }),

  svinemoerbrad: (h) => ({
    ord: 'svinemørbrad',
    title: 'Hvor længe skal svinemørbrad have i ovnen? Tid og temperatur',
    h1: 'Hvor længe skal svinemørbrad have i ovnen?',
    description: `Svinemørbrad skal have ${h.t('rosa-tid', { ca: true })} i ovnen ved ${h.t('ovn')} til rosa og ${h.t('gennem-tid', { ca: true })} til gennemstegt, skriver Madens Verden, efter brunning på panden.`,
    lead: `${h.k('mv-kerne')} skriver, at svinemørbrad brunes på panden og derefter får ${h.t('rosa-tid', { ca: true })} ved ${h.t('ovn')} til rosa.`,
    kilder: [
      `${h.k('mv-kerne')}: rosa svinemørbrad har kernetemperaturen ${h.t('rosa-kerne')}, gennemstegt ${h.t('gennem-kerne')}. Hviletiden er ${h.t('hvile')}.`,
      `${h.k('lf-stegning')} anbefaler ${h.t('lf')} for mørbrad af gris, når den serveres.`,
      `Om udskæringen skriver tabellen: ${h.s('kunhel', { med: false })}`,
    ],
    tabell: {
      tittel: TID, kilde: 'mv-kerne', intro: 'Svinemørbrad i ovn efter brunning på panden, tallene er fra Madens Verdens oversigt.', kolonner: ['Stegegrad', 'Ovn', 'Tid i ovnen', 'Kernetemperatur'],
      rader: [['Rosa', 'ovn', 'rosa-tid', 'rosa-kerne'], ['Gennemstegt', 'ovn', 'gennem-tid', 'gennem-kerne']],
      etter: [`Madens Verden skriver: ${h.s('vejl', { med: false })}`],
    },
    ekstra: [['Hvile', h.p([`Svinemørbrad skal hvile ${h.t('hvile')}, skriver ${h.k('mv-kerne')}.`])]],
    faq: [
      ['Hvor længe skal svinemørbrad have i ovnen?', `${h.k('mv-kerne')}: ${h.t('rosa-tid', { ca: true })} ved ${h.t('ovn')} til rosa, ${h.t('gennem-tid', { ca: true })} til gennemstegt.`],
      ['Hvilken kernetemperatur skal svinemørbrad have?', `${h.k('mv-kerne')}: ${h.t('rosa-kerne')} til rosa. ${h.k('lf-stegning')}: ${h.t('lf')}.`],
    ],
    soster: [KERNE + 'svinemoerbrad/', 'Kernetemperatur for svinemørbrad'],
    andre: [L('flaeskesteg', 'Hvor længe skal flæskestegen have i ovnen?'), L('roastbeef', 'Hvor længe skal roastbeef have i ovnen?')],
  }),

  egg: (h) => ({
    ord: 'æg',
    title: 'Hvor længe skal man koge æg? Blødkogt, smilende og hårdkogt',
    h1: 'Hvor længe skal man koge æg?',
    description: `Arla skriver ${h.t('arla-bloed')} til blødkogte æg, ${h.t('arla-smil')} til smilende og ${h.t('arla-haard')} til hårdkogte. Madens Verden regner med ${h.t('mv-haard')} til hårdkogte.`,
    lead: `Kilderne er ikke helt enige. Arla skriver ${h.t('arla-haard')} til hårdkogte æg, og Madens Verden skriver ${h.t('mv-haard')}. Her står begge, med hvad der gælder for størrelse.`,
    kilder: [
      `${h.k('arla-aeg')} skriver: blødkogte æg ${h.t('arla-bloed')}, smilende æg ${h.t('arla-smil')}, hårdkogte æg ${h.t('arla-haard')}. Æggene lægges i koldt vand, og tiden tælles fra vandet koger.`,
      `${h.k('mv-bloedkogt')} regner med ${h.t('mv-bloed', { ca: true })} til blødkogt, ${h.k('mv-smilende')} med ${h.t('mv-smil')} til smilende og ${h.k('mv-haardkogt')} med ${h.t('mv-haard')} til hårdkogt, for æg i størrelse M eller L.`,
      `Madens Verden skriver om størrelsen: ${h.s('mvstr', { med: false })} XL-æg kan have ${h.t('mv-xl')} ekstra, og små æg kan tages op ${h.t('mv-lille', { ca: true })} tidligere.`,
    ],
    tabell: {
      tittel: 'Kogetider for æg', kilde: 'arla-aeg', intro: 'Tabellen sætter de to kilder side om side.', kolonner: ['Æg', 'Arla', 'Madens Verden'],
      rader: [['Blødkogt', 'arla-bloed', { felt: 'mv-bloed', ca: true }], ['Smilende', 'arla-smil', 'mv-smil'], ['Hårdkogt', 'arla-haard', 'mv-haard']],
    },
    ekstra: [
      ['Koldt vand, kogende vand og afkøling', h.p([
        `Arla skriver: ${h.s('koldt', { med: false })}`,
        `Efter kogningen: ${h.s('afkol', { med: false })}`,
        `Om hårdkogte æg skriver Madens Verden: ${h.s('mvstart', { med: false })}`,
      ])],
      ['Æg der er lette at pille', h.p([`Arla skriver: ${h.s('pille', { med: false })}`, `Om smilende æg skriver Madens Verden: ${h.s('smil', { med: false })}`])],
    ],
    faq: [
      ['Hvor længe skal et hårdkogt æg koge?', `${h.k('arla-aeg')} skriver ${h.t('arla-haard')}, og ${h.k('mv-haardkogt')} skriver ${h.t('mv-haard')}. Tiden tælles fra vandet koger.`],
      ['Hvor længe skal et blødkogt æg koge?', `${h.k('arla-aeg')} skriver ${h.t('arla-bloed')}, og ${h.k('mv-bloedkogt')} skriver ${h.t('mv-bloed', { ca: true })} for M eller L.`],
      ['Hvor længe skal et smilende æg koge?', `${h.k('arla-aeg')} skriver ${h.t('arla-smil')}, og ${h.k('mv-smilende')} skriver ${h.t('mv-smil')}.`],
      ['Kan man koge æg i airfryer?', `Ja, se <a href="${AF}aeg/">æg i airfryer</a> med tider fra Madens Verden.`],
    ],
    andre: [[AF + 'aeg/', 'Æg i airfryer'], L('bagt-kartoffel', 'Hvor længe skal bagekartofler have i ovnen?')],
  }),

  'bakt-potet': (h) => ({
    ord: 'bagekartofler',
    title: 'Hvor længe skal bagekartofler have i ovnen? Tid efter størrelse',
    h1: 'Hvor længe skal bagekartofler have i ovnen?',
    description: `Madens Verden skriver ${h.t('lille')} for bagekartofler på ${h.t('lillevaegt')} og ${h.t('stor')} for ${h.t('storvaegt')}, ved ${h.t('temp')} varmluft. Se tabellen.`,
    lead: `Størrelsen bestemmer tiden. ${h.k('mv-kartoffel')} regner med ${h.t('lille')} for kartofler på ${h.t('lillevaegt')} og ${h.t('stor')} for ${h.t('storvaegt')}, ved ${h.t('temp')} varmluft.`,
    kilder: [
      `${h.k('mv-kartoffel')} forvarmer til ${h.t('temp')} varmluft. Store kartofler kan have brug for yderligere ${h.t('ekstra')}.`,
      `Om målingen skriver Madens Verden: ${h.s('spyd', { med: false })} Om tiderne: ${h.s('vejl', { med: false })}`,
    ],
    tabell: {
      tittel: 'Bagetid efter vægt', kilde: 'mv-kartoffel', intro: `Tiderne gælder ved ${h.t('temp')} varmluft.`, kolonner: ['Størrelse', 'Vægt pr. kartoffel', 'Vejledende bagetid'],
      rader: [['Lille', 'lillevaegt', 'lille'], ['Mellem', 'mellemvaegt', 'mellem'], ['Stor', 'storvaegt', 'stor']],
    },
    ekstra: [
      ['Folie og skind', h.p([`Madens Verden skriver om sølvpapir: ${h.s('folie', { med: false })} Derfor bages kartoflerne i opskriften uden folie.`, `Madens Verden: ${h.s('prik', { med: false })}`])],
    ],
    faq: [
      ['Hvor længe skal bagekartofler have i ovnen?', `${h.k('mv-kartoffel')} regner med ${h.t('lille')} for ${h.t('lillevaegt')}, ${h.t('mellem')} for ${h.t('mellemvaegt')} og ${h.t('stor')} for ${h.t('storvaegt')}, ved ${h.t('temp')} varmluft.`],
      ['Hvordan ved man, at bagekartofler er færdige?', h.s('spyd')],
    ],
    andre: [[AF + 'pommes-frites/', 'Pommes frites i airfryer'], L('laks-i-ovn', 'Hvor længe skal laks have i ovnen?')],
  }),

  'laks-i-ovn': (h) => ({
    ord: 'laks i ovn',
    title: 'Hvor længe skal laks have i ovnen? Tid og temperatur',
    h1: 'Hvor længe skal laks have i ovnen?',
    description: `En lakseside på ${h.t('vaegt', { ca: true })} skal have ${h.t('tid', { ca: true })} ved ${h.t('temp')} varmluft, skriver Madens Verden. Begynd at tjekke efter ${h.t('tjek', { ca: true })}.`,
    lead: `${h.k('mv-lakseside')} regner med ${h.t('tid', { ca: true })} ved ${h.t('temp')} varmluft for en lakseside på ${h.t('vaegt', { ca: true })}.`,
    kilder: [
      `${h.k('mv-lakseside')} skriver, at man bør begynde at tjekke laksen efter ${h.t('tjek', { ca: true })}. Vil du bruge et stegetermometer, kan du gå efter ${h.t('kerne', { ca: true })} i den tykkeste del.`,
      `Om tykkelsen skriver Madens Verden: ${h.s('tykt', { med: false })}`,
      `Og om hvornår laksen er færdig: ${h.s('flager', { med: false })}`,
    ],
    tabell: { tittel: TID, kilde: 'mv-lakseside', intro: 'Tallene gælder en hel lakseside i ovnen.', kolonner: ['Hvad', 'Ovn', 'Tid', 'Kernetemperatur'], rader: [['Hel lakseside', 'temp', 'tid', 'kerne']] },
    ekstra: [
      ['Gør laksen ikke tør', h.p([`Madens Verden skriver: ${h.s('taer', { med: false })}`, `Laks i airfryer har sin egen side: <a href="${AF}laks/">laks i airfryer</a>. Hvor meget laks der skal regnes pr. person, står på <a href="${HVOR}fisk/">hvor meget fisk pr. person</a>.`])],
    ],
    faq: [
      ['Hvor længe skal laks have i ovnen?', `${h.k('mv-lakseside')} regner med ${h.t('tid', { ca: true })} ved ${h.t('temp')} varmluft for en lakseside på ${h.t('vaegt', { ca: true })}.`],
      ['Hvilken kernetemperatur skal laks have?', `${h.k('mv-lakseside')} nævner ${h.t('kerne', { ca: true })} i den tykkeste del, hvis man vil have laksen grundigt gennemtilberedt. Vi har ikke fundet et tal fra Fødevarestyrelsen for laks.`],
      ['Hvordan ved man, at laksen er færdig?', h.s('flager')],
    ],
    andre: [[AF + 'laks/', 'Laks i airfryer'], [HVOR + 'fisk/', 'Hvor meget fisk pr. person?']],
  }),
};

const OVERSIKT = {
  flaeskesteg: [['Flæskesteg', 'tid']], and: [['Hel and', 'tid']], kalkun: [['Hel kalkun', 'tid']], 'hel-kylling': [['Hel kylling', 'tid']], kyllingfilet: [['Kyllingebryst', 'tid']],
  roastbiff: [['Roastbeef, medium (kernetemperatur)', 'medium']], lammelar: [['Lammekølle, rosa', 'rosa-tid']], svinemoerbrad: [['Svinemørbrad, rosa', 'rosa-tid']],
  egg: [['Hårdkogte æg (Arla)', 'arla-haard']], 'bakt-potet': [['Bagekartoffel, lille', 'lille']], 'laks-i-ovn': [['Hel lakseside', 'tid']],
};

export function nav({ rader, sti, h, p, esc }) {
  const flaesk = h(rader.find((r) => r.id === 'flaeskesteg'));
  const radene = rader.flatMap((r) => {
    const x = h(r);
    return (OVERSIKT[r.id] ?? []).map(([etikett, felt]) => `<tr><td><a href="${sti(r)}">${esc(r.navn)}</a></td><td>${esc(etikett)}</td><td>${x.t(felt)}</td><td>${x.k(r.tall[felt]?.kilde ?? r.tall[`${felt}-min`].kilde)}</td></tr>`);
  }).join('');
  return {
    title: 'Hvor længe skal maden have i ovnen? Stegetider med kilder',
    h1: 'Hvor længe skal maden have i ovnen?',
    description: 'Stegetid og kogetid for flæskesteg, and, kalkun, kylling, roastbeef, lammekølle, laks, bagekartofler og æg. Tal fra Madens Verden, Landbrug & Fødevarer, Danish Crown og Arla, med kilde på hvert tal.',
    lead: `${flaesk.k('mv-kerne')} skriver, at stegetiden kun er vejledende, og at termometeret afgør, hvornår kødet er færdigt. Hvert tal her står hos en navngiven kilde med årstal.`,
    rik: [
      `<h2>Det siger kilderne</h2>${p([
        `Madens Verden skriver: ${flaesk.s('termo', { med: false })}`,
        `Landbrug & Fødevarer skriver i sit ark om stegetider (${flaesk.k('lf-stegning')}) om anbefalet centrumtemperatur ved servering, og Madens Verden har en stor tabel med både kernetemperatur og stegetid (${flaesk.k('mv-kerne')}).`,
        'Vi skriver kun et tal, når vi selv har set det på kildens side. Mangler en vare, er det fordi, vi ikke fandt en dansk kilde med tallet.',
      ])}`,
      `<h2>Tider for alle retter</h2><p>Vælg en ret for tabellen, kilderne og kernetemperaturen. Tiderne er vejledende.</p><div class="table-wrap" tabindex="0" role="region" aria-label="Stegetider og kogetider"><table class="sprik"><thead><tr><th scope="col">Ret</th><th scope="col">Hvad tallet gælder</th><th scope="col">Tid</th><th scope="col">Kilde</th></tr></thead><tbody>${radene}</tbody></table></div>`,
      '<h2>Varer der ikke er med</h2><p>Der er ingen side om ribbensteg, medister, hel torsk eller rødspætte, fordi vi ikke fandt en dansk kilde med en tid, vi kunne kontrollere. Kernetemperaturen for flere slags kød står på siden om kernetemperatur.</p>',
      `<div class="related"><h2>Læs også</h2><ul><li><a href="${KERNE}">Kernetemperatur for kød og fjerkræ</a></li><li><a href="${AF}">Airfryer: tid og temperatur</a></li><li><a href="${HVOR}">Hvor meget mad pr. person?</a></li></ul></div>`,
    ].join('\n'),
    faqTittel: 'Spørgsmål om stegetid',
    faq: [
      ['Kan man stole på stegetiden?', `Madens Verden skriver: ${flaesk.s('vejl', { med: false })} Brug termometeret til at afgøre, hvornår stegen er færdig.`],
      ['Hvor længe skal flæskestegen have i ovnen?', `Madens Verden regner med ${flaesk.t('tid', { ca: true })} ved ${flaesk.t('ovn')}. Se <a href="${S}flaeskesteg/">flæskesteg i ovn</a>.`],
    ],
  };
}

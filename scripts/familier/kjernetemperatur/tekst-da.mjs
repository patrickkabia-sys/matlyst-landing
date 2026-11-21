// Tekst til familien «kjernetemperatur» (da): kernetemperatur for kød og fjerkræ. Hver sætning gengiver, hvad en navngiven kilde siger.
// Tal skrives aldrig her: h.t(felt) henter dem fra data.da.json, hvor hvert tal har sitatet fra kilden. Sætninger fra kilden hentes ordret med h.s(id).
// Kilder: Fødevarestyrelsen først (hakket kød og kylling), så Madens Verden (2026) og Landbrug & Fødevarer (voresmad.dk). Hvor kilderne oplyser forskellige tal, står begge.
// Fisk mangler: vi fandt ingen dansk kilde med en kernetemperatur for fisk, og siderne holdes ude. Ingen egne råd.
// Undgå ordene køleskab, rester, plan, uge, find, gem, sådan, timer og ovn i h2-overskrifter, undtagen i app-blokken (se holdbarhet/tekst-da.mjs).

const ROT = '/da/kernetemperatur/';
const K = (slug, tekst) => [`${ROT}${slug}/`, tekst];
const KOLONNER = ['Udskæring og stegegrad', 'Kernetemperatur'];
const MV_INTRO = (h) => `${h.k('mv-kerne')} har en tabel over kernetemperaturer. Her står rækkerne for denne vare:`;
const INGEN_FVST = (h, navn, ...ider) => `Vi fandt ingen kernetemperatur for ${navn} hos Fødevarestyrelsen. Tallene her er fra ${ider.map((i) => h.k(i)).join(' og ')}.`;
const MAAL = (h) => `Om at måle skriver ${h.k('mv-kerne')}: ${h.s('tykkeste', { med: false })}`;
const HELE = 'Tallene for hele kødstykker viser den ønskede stegegrad, ikke en sikkerhedsgrænse for alle.';

export const TEKST = {
  kylling: (h) => ({
    ord: 'kylling',
    title: 'Kernetemperatur kylling',
    h1: 'Kernetemperatur kylling',
    description: `Kylling skal gennemsteges til mindst ${h.t('min75')} i kernen, skriver ${h.k('mv-kerne')}: hel kylling og bryst ${h.t('hel')}, lår ${h.t('laar')}. Det siger Fødevarestyrelsen.`,
    lead: `${h.k('mv-kerne')} skriver, at fjerkræ bør gennemsteges til en kernetemperatur på mindst ${h.t('min75')}. Hel kylling og kyllingebryst står med ${h.t('hel')} og kyllingelår med ${h.t('laar')}.`,
    kilder: [
      `Fødevarestyrelsen skriver: ${h.s('gennemstegt', { med: false })} Styrelsen nævner ikke et tal for kylling på samme side, men skriver: ${h.s('rod', { med: false })}`,
      `${h.k('fvst-varm')} skriver også, at bakterier kan vokse, hvis temperaturen kommer under ${h.t('fvst-gr')}.`,
      `${h.k('mv-kerne')} skriver, at fjerkræ og hakket kød bør gennemsteges til en kernetemperatur på mindst ${h.t('min75')}.`,
      MAAL(h),
      `Om en hel kylling skriver Madens Verden: ${h.s('maal', { med: false })} Kernetemperaturen stiger ofte ${h.t('stig')}, mens kødet hviler.`,
    ],
    tabell: {
      tittel: 'Kernetemperatur i tal', kilde: 'mv-kerne', intro: MV_INTRO(h), kolonner: KOLONNER,
      rader: [['Hel kylling, gennemstegt', 'hel'], ['Kyllingebryst, gennemstegt', 'bryst'], ['Kyllingelår, gennemstegt', 'laar'], ['Kylling i airfryer, gennemstegt', 'airfryer']],
    },
    faq: [
      ['Hvilken kernetemperatur skal kylling have?', `${h.k('mv-kerne')} skriver mindst ${h.t('min75')} for fjerkræ, og ${h.t('laar')} for kyllingelår.`],
      ['Hvordan kan man se, at kyllingen er færdig?', `${h.k('fvst-varm')} skriver: ${h.s('rod', { med: false })}`],
      ['Hvor længe kan kogt kylling holde sig i køleskabet?', `Vi fandt ikke et tal for kylling. Se <a href="/da/holdbarhed/rester/">hvor længe rester af kød kan holde sig</a>.`],
    ],
    andre: [K('kalkun', 'Kernetemperatur kalkun'), K('hakket-koed', 'Kernetemperatur hakket kød')],
  }),

  kalkun: (h) => ({
    ord: 'kalkun',
    title: 'Kernetemperatur kalkun',
    h1: 'Kernetemperatur kalkun',
    description: `Hel kalkun og kalkunbryst står med ${h.t('hel')} i tabellen hos ${h.k('mv-kerne')}, og fjerkræ bør gennemsteges til mindst ${h.t('min75')}.`,
    lead: `${h.k('mv-kerne')} skriver, at fjerkræ bør gennemsteges til en kernetemperatur på mindst ${h.t('min75')}. Hel kalkun og kalkunbryst står begge med ${h.t('hel')}.`,
    kilder: [
      INGEN_FVST(h, 'kalkun', 'mv-kerne'),
      `Om en hel kalkun skriver ${h.k('mv-kerne')}: ${h.s('flere', { med: false })}`,
      MAAL(h),
      `Kernetemperaturen stiger ofte ${h.t('stig')}, mens kødet hviler, skriver Madens Verden.`,
    ],
    tabell: { tittel: 'Kernetemperatur i tal', kilde: 'mv-kerne', intro: MV_INTRO(h), kolonner: KOLONNER, rader: [['Hel kalkun, gennemstegt', 'hel'], ['Kalkunbryst, gennemstegt', 'bryst']] },
    faq: [
      ['Hvilken kernetemperatur skal kalkun have?', `${h.k('mv-kerne')} skriver ${h.t('hel')} for hel kalkun og kalkunbryst, og mindst ${h.t('min75')} for fjerkræ.`],
      ['Hvor skal man måle i en hel kalkun?', `${h.k('mv-kerne')} skriver: ${h.s('flere', { med: false })}`],
    ],
    andre: [K('kylling', 'Kernetemperatur kylling'), K('and', 'Kernetemperatur and')],
  }),

  and: (h) => ({
    ord: 'and',
    title: 'Kernetemperatur and',
    h1: 'Kernetemperatur and',
    description: `Hel and og andebryst står med ${h.t('hel')} i tabellen hos ${h.k('mv-kerne')}, og fjerkræ bør gennemsteges til mindst ${h.t('min75')}.`,
    lead: `${h.k('mv-kerne')} skriver, at fjerkræ bør gennemsteges til en kernetemperatur på mindst ${h.t('min75')}. Hel and og andebryst står begge med ${h.t('hel')}.`,
    kilder: [
      INGEN_FVST(h, 'and', 'mv-kerne'),
      `Tabellen mærker andebryst med en dansk forsigtighedsanbefaling og anbefaler at måle i inderlåret på en hel and.`,
      MAAL(h),
      `Kernetemperaturen stiger ofte ${h.t('stig')}, mens kødet hviler, skriver Madens Verden.`,
    ],
    tabell: { tittel: 'Kernetemperatur i tal', kilde: 'mv-kerne', intro: MV_INTRO(h), kolonner: KOLONNER, rader: [['Hel and, gennemstegt', 'hel'], ['Andebryst, gennemstegt', 'bryst']] },
    faq: [
      ['Hvilken kernetemperatur skal and have?', `${h.k('mv-kerne')} skriver ${h.t('hel')} for hel and og for andebryst.`],
      ['Gælder det samme som for kylling?', `Madens Verden skriver ${h.t('hel')} for begge. Se <a href="${ROT}kylling/">kernetemperatur for kylling</a>.`],
    ],
    andre: [K('kalkun', 'Kernetemperatur kalkun'), K('kylling', 'Kernetemperatur kylling')],
  }),

  svinefilet: (h) => ({
    ord: 'svinemørbrad',
    title: 'Kernetemperatur svinemørbrad',
    h1: 'Kernetemperatur svinemørbrad',
    description: `Svinemørbrad er rosa ved ${h.t('rosa')} og gennemstegt ved ${h.t('gennem')}, skriver ${h.k('mv-kerne')}. Landbrug & Fødevarer skriver ${h.t('lf')}.`,
    lead: `${h.k('mv-kerne')} skriver ${h.t('rosa')} for rosa svinemørbrad og ${h.t('gennem')} for gennemstegt. ${h.k('lf-stegning')} skriver ${h.t('lf')} for mørbrad fra gris. Tallene er ikke ens, og her står begge.`,
    kilder: [
      INGEN_FVST(h, 'svinemørbrad', 'mv-kerne', 'lf-stegning'),
      `Landbrug & Fødevarer skriver: ${h.s('lf-note', { med: false })}`,
      `Madens Verden skriver, at svinemørbrad kun kan serveres rosa som hel udskæring. ${HELE}`,
      `Kernetemperaturen stiger ofte ${h.t('stig')}, mens kødet hviler, skriver Madens Verden.`,
    ],
    tabell: {
      tittel: 'Kernetemperatur i tal', kilde: 'mv-kerne', intro: 'To danske kilder oplyser kernetemperatur for svinemørbrad:', kolonner: ['Kilde og stegegrad', 'Kernetemperatur'],
      rader: [['Madens Verden, rosa', 'rosa'], ['Madens Verden, gennemstegt', 'gennem'], ['Landbrug & Fødevarer, anbefalet ved servering', 'lf']],
    },
    faq: [
      ['Hvilken kernetemperatur skal svinemørbrad have?', `${h.k('mv-kerne')} skriver ${h.t('rosa')} for rosa og ${h.t('gennem')} for gennemstegt. ${h.k('lf-stegning')} skriver ${h.t('lf')}.`],
      ['Må svinemørbrad være rosa?', `${h.k('lf-stegning')} skriver: ${h.s('lf-note', { med: false })}`],
    ],
    andre: [K('flaeskesteg', 'Kernetemperatur flæskesteg og svinekam'), K('nakkesteg', 'Kernetemperatur nakkesteg')],
  }),

  svinestek: (h) => ({
    ord: 'flæskesteg',
    title: 'Kernetemperatur flæskesteg og svinekam',
    h1: 'Kernetemperatur flæskesteg',
    description: `Flæskesteg står med ${h.t('flaesk')} hos ${h.k('mv-kerne')} og ${h.t('lf-flaesk')} hos Landbrug & Fødevarer. Svinekam og kamsteg er rosa ved ${h.t('kam')}.`,
    lead: `${h.k('mv-kerne')} skriver ${h.t('flaesk')} for gennemstegt flæskesteg og ${h.t('kam')} for rosa svinekam og kamsteg. ${h.k('lf-stegning')} skriver ${h.t('lf-flaesk')} for flæskesteg og ${h.t('lf-ribben')} for ribbensteg.`,
    kilder: [
      INGEN_FVST(h, 'flæskesteg', 'mv-kerne', 'lf-stegning'),
      `Om termometeret skriver Landbrug & Fødevarer: ${h.s('lf-termo', { med: false })}`,
      `Madens Verden skriver, at det er hele udskæringer, der kan være rosa, og at de sprøde svær også styres af overvarme. ${HELE}`,
      `Kernetemperaturen stiger ofte ${h.t('stig')}, mens kødet hviler, skriver Madens Verden.`,
    ],
    tabell: {
      tittel: 'Kernetemperatur i tal', kilde: 'mv-kerne', intro: 'To danske kilder oplyser kernetemperatur for svinesteg:', kolonner: ['Kilde og udskæring', 'Kernetemperatur'],
      rader: [['Madens Verden, svinekam og kamsteg, rosa', 'kam'], ['Madens Verden, flæskesteg, gennemstegt', 'flaesk'], ['Landbrug & Fødevarer, flæskesteg', 'lf-flaesk'], ['Landbrug & Fødevarer, ribbensteg', 'lf-ribben']],
    },
    faq: [
      ['Hvilken kernetemperatur skal flæskesteg have?', `${h.k('mv-kerne')} skriver ${h.t('flaesk')}, og ${h.k('lf-stegning')} skriver ${h.t('lf-flaesk')}.`],
      ['Hvilken kernetemperatur skal ribbensteg have?', `${h.k('lf-stegning')} skriver ${h.t('lf-ribben')} for ribbensteg.`],
    ],
    andre: [K('svinemoerbrad', 'Kernetemperatur svinemørbrad'), K('nakkesteg', 'Kernetemperatur nakkesteg')],
  }),

  svinenakke: (h) => ({
    ord: 'nakkesteg',
    title: 'Kernetemperatur nakkesteg',
    h1: 'Kernetemperatur nakkesteg',
    description: `Nakkesteg står med ${h.t('lf-nakke')} hos Landbrug & Fødevarer, og nakkefilet og nakkekam med ${h.t('nakkefilet')} hos ${h.k('mv-kerne')}.`,
    lead: `${h.k('lf-stegning')} skriver ${h.t('lf-nakke')} for nakkesteg. ${h.k('mv-kerne')} skriver ${h.t('nakkefilet')} for nakkefilet og nakkekam, når kødet skal være mørt efter lang tid. Tallene er ikke ens, og her står begge.`,
    kilder: [
      INGEN_FVST(h, 'nakkesteg', 'mv-kerne', 'lf-stegning'),
      `Landbrug & Fødevarer skriver: ${h.s('lf-fedt', { med: false })}`,
      `Madens Verden skriver, at man for skærefast, mørt kød skal sigte mod den nedre del af intervallet.`,
      `Kernetemperaturen stiger ofte ${h.t('stig')}, mens kødet hviler, skriver Madens Verden.`,
    ],
    tabell: {
      tittel: 'Kernetemperatur i tal', kilde: 'mv-kerne', intro: 'To danske kilder oplyser kernetemperatur for nakke af gris:', kolonner: ['Kilde og udskæring', 'Kernetemperatur'],
      rader: [['Landbrug & Fødevarer, nakkesteg', 'lf-nakke'], ['Madens Verden, nakkefilet og nakkekam, mørt efter lang tid', 'nakkefilet']],
    },
    faq: [
      ['Hvilken kernetemperatur skal nakkesteg have?', `${h.k('lf-stegning')} skriver ${h.t('lf-nakke')}, og ${h.k('mv-kerne')} skriver ${h.t('nakkefilet')} for nakkefilet og nakkekam.`],
      ['Hvorfor er tallet højere end for svinemørbrad?', `${h.k('lf-stegning')} skriver: ${h.s('lf-fedt', { med: false })}`],
    ],
    andre: [K('flaeskesteg', 'Kernetemperatur flæskesteg'), K('svinemoerbrad', 'Kernetemperatur svinemørbrad')],
  }),

  biff: (h) => ({
    ord: 'bøf',
    title: 'Kernetemperatur bøf og entrecote',
    h1: 'Kernetemperatur bøf og entrecote',
    description: `Bøf, entrecote og ribeye er rød ved ${h.t('rod')}, medium ved ${h.t('medium')} og gennemstegt ved ${h.t('gennem')}, skriver ${h.k('mv-kerne')}.`,
    lead: `${h.k('mv-kerne')} skriver ${h.t('rod')} for rød bøf, ${h.t('mr')} for medium-rare, ${h.t('medium')} for medium og ${h.t('gennem')} for gennemstegt.`,
    kilder: [
      INGEN_FVST(h, 'bøf', 'mv-kerne'),
      `Madens Verden skriver: ${h.s('hel', { med: false })}`,
      MAAL(h),
      `Kernetemperaturen stiger ofte ${h.t('stig')}, mens kødet hviler, skriver Madens Verden.`,
    ],
    tabell: {
      tittel: 'Kernetemperatur i tal', kilde: 'mv-kerne', intro: MV_INTRO(h), kolonner: KOLONNER,
      rader: [['Rød', 'rod'], ['Medium-rare', 'mr'], ['Medium', 'medium'], ['Gennemstegt', 'gennem']],
    },
    faq: [
      ['Hvilken kernetemperatur har en medium bøf?', `${h.k('mv-kerne')} skriver ${h.t('medium')} for medium.`],
      ['Hvilken kernetemperatur har en gennemstegt bøf?', `${h.k('mv-kerne')} skriver ${h.t('gennem')} for gennemstegt.`],
    ],
    andre: [K('oksefilet', 'Kernetemperatur oksefilet'), K('roastbeef', 'Kernetemperatur roastbeef')],
  }),

  roastbiff: (h) => ({
    ord: 'roastbeef',
    title: 'Kernetemperatur roastbeef',
    h1: 'Kernetemperatur roastbeef',
    description: `Roastbeef er medium ved ${h.t('medium')} hos ${h.k('mv-kerne')}, og Landbrug & Fødevarer skriver ${h.t('lf')}. Her er også rød og gennemstegt.`,
    lead: `${h.k('mv-kerne')} skriver ${h.t('rod')} for rød roastbeef, ${h.t('medium')} for medium og ${h.t('gennem')} for gennemstegt. ${h.k('lf-stegning')} skriver ${h.t('lf')}. Tallene er ikke ens, og her står begge.`,
    kilder: [
      INGEN_FVST(h, 'roastbeef', 'mv-kerne', 'lf-stegning'),
      `Om eftervarme skriver Landbrug & Fødevarer, at centrumtemperaturen i kødet kan stige op til ${h.t('lf-stig')}, efter at det er taget ud af ovnen.`,
      `Madens Verden skriver: ${h.s('hvile-mv', { med: false })}`,
      `Kernetemperaturen stiger ofte ${h.t('stig')}, mens kødet hviler, skriver Madens Verden.`,
    ],
    tabell: {
      tittel: 'Kernetemperatur i tal', kilde: 'mv-kerne', intro: 'To danske kilder oplyser kernetemperatur for roastbeef:', kolonner: ['Kilde og stegegrad', 'Kernetemperatur'],
      rader: [['Madens Verden, rød', 'rod'], ['Madens Verden, medium', 'medium'], ['Madens Verden, gennemstegt', 'gennem'], ['Landbrug & Fødevarer, anbefalet ved servering', 'lf']],
    },
    faq: [
      ['Hvilken kernetemperatur skal roastbeef have?', `${h.k('mv-kerne')} skriver ${h.t('medium')} for medium, og ${h.k('lf-stegning')} skriver ${h.t('lf')}.`],
      ['Stiger temperaturen, når roastbeefen hviler?', `${h.k('mv-kerne')} skriver: ${h.s('hvile-mv', { med: false })}`],
    ],
    andre: [K('oksefilet', 'Kernetemperatur oksefilet'), K('boef', 'Kernetemperatur bøf')],
  }),

  oksefilet: (h) => ({
    ord: 'oksefilet',
    title: 'Kernetemperatur oksefilet og oksemørbrad',
    h1: 'Kernetemperatur oksefilet og oksemørbrad',
    description: `Oksemørbrad er medium ved ${h.t('mb-med')} hos ${h.k('mv-kerne')}, og Landbrug & Fødevarer skriver ${h.t('lf-moerbrad')} for oksemørbrad og oksefilet.`,
    lead: `${h.k('mv-kerne')} skriver ${h.t('mb-mr')} for medium-rare og ${h.t('mb-med')} for medium oksemørbrad. ${h.k('lf-stegning')} skriver ${h.t('lf-moerbrad')}. Tallene er ikke ens, og her står begge.`,
    kilder: [
      INGEN_FVST(h, 'oksefilet', 'mv-kerne', 'lf-stegning'),
      `Landbrug & Fødevarer skriver: ${h.s('lf-tor', { med: false })}`,
      `Kernetemperaturen stiger ofte ${h.t('stig')}, mens kødet hviler, skriver Madens Verden.`,
    ],
    tabell: {
      tittel: 'Kernetemperatur i tal', kilde: 'mv-kerne', intro: 'To danske kilder oplyser kernetemperatur for oksefilet og oksemørbrad:', kolonner: ['Kilde, udskæring og stegegrad', 'Kernetemperatur'],
      rader: [['Madens Verden, oksemørbrad, medium-rare', 'mb-mr'], ['Madens Verden, oksemørbrad, medium', 'mb-med'], ['Madens Verden, oksefilet og tyndsteg, medium-rare', 'fil-mr'], ['Madens Verden, oksefilet og tyndsteg, medium', 'fil-med'], ['Landbrug & Fødevarer, oksemørbrad', 'lf-moerbrad'], ['Landbrug & Fødevarer, oksefilet', 'lf-filet']],
    },
    faq: [
      ['Hvilken kernetemperatur skal oksemørbrad have?', `${h.k('mv-kerne')} skriver ${h.t('mb-med')} for medium, og ${h.k('lf-stegning')} skriver ${h.t('lf-moerbrad')}.`],
      ['Hvorfor må filet ikke steges for længe?', `${h.k('lf-stegning')} skriver: ${h.s('lf-tor', { med: false })}`],
    ],
    andre: [K('boef', 'Kernetemperatur bøf'), K('roastbeef', 'Kernetemperatur roastbeef')],
  }),

  lammelar: (h) => ({
    ord: 'lammekølle',
    title: 'Kernetemperatur lammekølle',
    h1: 'Kernetemperatur lammekølle',
    description: `Lammekølle er rosa ved ${h.t('rosa')} og medium ved ${h.t('medium')}, skriver ${h.k('mv-kerne')}. Lammeskank og lammebov står med ${h.t('skank')}.`,
    lead: `${h.k('mv-kerne')} skriver ${h.t('rosa')} for rosa lammekølle og ${h.t('medium')} for medium. Lammekrone og lammeculotte står med ${h.t('krone')}, og lammeskank og lammebov med ${h.t('skank')}.`,
    kilder: [
      INGEN_FVST(h, 'lam', 'mv-kerne'),
      `Madens Verden skriver: ${h.s('hele', { med: false })}`,
      `Madens Verden skriver: ${h.s('kulinarisk', { med: false })}`,
      `Kernetemperaturen stiger ofte ${h.t('stig')}, mens kødet hviler, skriver Madens Verden.`,
    ],
    tabell: {
      tittel: 'Kernetemperatur i tal', kilde: 'mv-kerne', intro: MV_INTRO(h), kolonner: KOLONNER,
      rader: [['Lammekølle, rosa', 'rosa'], ['Lammekølle, medium', 'medium'], ['Lammekrone og lammeculotte, rosa', 'krone'], ['Lammeskank og lammebov, mørt efter lang tid', 'skank']],
    },
    faq: [
      ['Hvilken kernetemperatur skal lammekølle have?', `${h.k('mv-kerne')} skriver ${h.t('rosa')} for rosa og ${h.t('medium')} for medium.`],
      ['Hvilken kernetemperatur skal lammeskank have?', `${h.k('mv-kerne')} skriver ${h.t('skank')} for lammeskank og lammebov.`],
    ],
    andre: [K('kalv', 'Kernetemperatur kalv'), K('oksefilet', 'Kernetemperatur oksefilet')],
  }),

  kalv: (h) => ({
    ord: 'kalv',
    title: 'Kernetemperatur kalvefilet og kalvesteg',
    h1: 'Kernetemperatur kalvefilet og kalvesteg',
    description: `Kalvefilet er rosa ved ${h.t('filet')} hos ${h.k('mv-kerne')}, og Landbrug & Fødevarer skriver ${h.t('lf')}. Kalvesteg er medium ved ${h.t('steg')}.`,
    lead: `${h.k('mv-kerne')} skriver ${h.t('filet')} for kalvefilet og kalvemørbrad, og ${h.t('steg')} for medium kalvesteg. ${h.k('lf-stegning')} skriver ${h.t('lf')} for kalvefilet. Tallene er ikke ens, og her står begge.`,
    kilder: [
      INGEN_FVST(h, 'kalv', 'mv-kerne', 'lf-stegning'),
      `Landbrug & Fødevarer skriver: ${h.s('lf-hele', { med: false })}`,
      `Kernetemperaturen stiger ofte ${h.t('stig')}, mens kødet hviler, skriver Madens Verden.`,
    ],
    tabell: {
      tittel: 'Kernetemperatur i tal', kilde: 'mv-kerne', intro: 'To danske kilder oplyser kernetemperatur for kalv:', kolonner: ['Kilde, udskæring og stegegrad', 'Kernetemperatur'],
      rader: [['Madens Verden, kalvefilet og kalvemørbrad, rosa', 'filet'], ['Madens Verden, kalvesteg, medium', 'steg'], ['Landbrug & Fødevarer, kalvefilet', 'lf']],
    },
    faq: [
      ['Hvilken kernetemperatur skal kalvefilet have?', `${h.k('mv-kerne')} skriver ${h.t('filet')}, og ${h.k('lf-stegning')} skriver ${h.t('lf')}.`],
      ['Hvilken kernetemperatur skal kalvesteg have?', `${h.k('mv-kerne')} skriver ${h.t('steg')} for medium kalvesteg.`],
    ],
    andre: [K('lammekoelle', 'Kernetemperatur lammekølle'), K('oksefilet', 'Kernetemperatur oksefilet')],
  }),

  kjottdeig: (h) => ({
    ord: 'hakket kød',
    title: 'Kernetemperatur hakket kød og hakkebøf',
    h1: 'Kernetemperatur hakket kød og hakkebøf',
    description: `Hakkebøf er gennemstegt ved en kernetemperatur på minimum ${h.t('fvst')}, skriver ${h.k('fvst-varm')}. Landbrug & Fødevarer skriver ${h.t('lf-hakket')}.`,
    lead: `${h.k('fvst-varm')} skriver, at hakkebøffen er helt gennemstegt, når den er gennemvarm med en kernetemperatur på minimum ${h.t('fvst')}. ${h.k('mv-kerne')} skriver ${h.t('min75')} for hakket kød, og ${h.k('lf-stegning')} skriver ${h.t('lf-hakket')}. Tallene er ikke ens, og her står alle tre.`,
    kilder: [
      `Fødevarestyrelsen skriver om hakket kød: ${h.s('bakterier', { med: false })}`,
      `Styrelsen skriver også: ${h.s('frikadeller', { med: false })}`,
      `${h.k('fvst-varm')} skriver, at bakterier kan vokse, hvis temperaturen kommer under ${h.t('under65')}.`,
      `Landbrug & Fødevarer skriver: ${h.s('lf-gennem', { med: false })}`,
      `Madens Verden skriver ved hakkebøf, at man ikke kan gå efter farven alene.`,
    ],
    tabell: {
      tittel: 'Kernetemperatur i tal', kilde: 'fvst-varm', intro: 'Tre danske kilder oplyser kernetemperatur for hakket kød:', kolonner: ['Kilde og vare', 'Kernetemperatur'],
      rader: [['Fødevarestyrelsen, hakkebøf, minimum', 'fvst'], ['Madens Verden, hakkebøf af oksekød', 'boef'], ['Madens Verden, frikadeller og kødboller', 'frikadeller'], ['Madens Verden, farsbrød og forloren hare', 'farsbroed'], ['Madens Verden, pølser af rå fars', 'polser'], ['Landbrug & Fødevarer, hakket kød og rullesteg', 'lf-hakket'], ['Landbrug & Fødevarer, industrielt marineret kød', 'lf-marineret']],
    },
    faq: [
      ['Hvilken kernetemperatur skal hakkebøf have?', `${h.k('fvst-varm')} skriver minimum ${h.t('fvst')}, og ${h.k('lf-stegning')} skriver ${h.t('lf-hakket')} for hakket kød.`],
      ['Må hakket kød være rosa?', `${h.k('lf-stegning')} skriver: ${h.s('lf-gennem', { med: false })}`],
      ['Hvor længe kan hakket kød holde sig i køleskabet?', 'Se <a href="/da/holdbarhed/hakket-koed/">hvor længe hakket kød kan holde sig</a>.'],
    ],
    soster: ['/da/holdbarhed/hakket-koed/', 'Hvor længe kan hakket kød holde sig i køleskabet?'],
    andre: [K('kylling', 'Kernetemperatur kylling'), ['/da/kan-man-fryse/hakket-koed/', 'Kan man fryse hakket kød?']],
  }),
};

const OVERSIKT = {
  kylling: [['Kylling, gennemstegt', 'hel']],
  kalkun: [['Kalkun, gennemstegt', 'hel']],
  and: [['And, gennemstegt', 'hel']],
  svinefilet: [['Svinemørbrad, rosa', 'rosa'], ['Svinemørbrad, gennemstegt', 'gennem']],
  svinestek: [['Flæskesteg, gennemstegt', 'flaesk'], ['Svinekam og kamsteg, rosa', 'kam']],
  svinenakke: [['Nakkesteg, Landbrug & Fødevarer', 'lf-nakke']],
  biff: [['Bøf og entrecote, medium', 'medium'], ['Bøf og entrecote, gennemstegt', 'gennem']],
  roastbiff: [['Roastbeef, medium', 'medium']],
  oksefilet: [['Oksemørbrad, medium', 'mb-med']],
  lammelar: [['Lammekølle, rosa', 'rosa'], ['Lammekølle, medium', 'medium']],
  kalv: [['Kalvefilet, rosa', 'filet'], ['Kalvesteg, medium', 'steg']],
  kjottdeig: [['Hakkebøf, minimum', 'fvst']],
};

export function nav({ rader, sti, h, p, esc }) {
  const kylling = h(rader.find((r) => r.id === 'kylling'));
  const deig = h(rader.find((r) => r.id === 'kjottdeig'));
  const radene = rader.flatMap((r) => {
    const x = h(r);
    return (OVERSIKT[r.id] ?? []).map(([etikett, felt]) => `<tr><td><a href="${sti(r)}">${esc(etikett)}</a></td><td>${x.t(felt)}</td><td>${x.k(r.tall[felt]?.kilde ?? r.tall[`${felt}-min`].kilde)}</td></tr>`);
  }).join('');
  return {
    title: 'Kernetemperatur: tabel for kød og fjerkræ med kilder',
    h1: 'Kernetemperatur for kød og fjerkræ',
    description: 'Kernetemperatur for kylling, kalkun, svin, okse, lam, kalv og hakket kød. Tal fra Fødevarestyrelsen, Madens Verden og Landbrug & Fødevarer, med kilde på hvert tal.',
    lead: `Kernetemperaturen er temperaturen midt i kødet. Madens Verden skriver, at fjerkræ og hakket kød bør gennemsteges til mindst ${kylling.t('min75')}. Hvert tal på siderne her står hos en navngiven kilde med årstal.`,
    rik: [
      `<h2>Hvad kilderne siger</h2>${p([
        `${deig.k('fvst-varm')} skriver: ${deig.s('bakterier', { med: false })} Styrelsen skriver også, at hakkebøffen er helt gennemstegt ved en kernetemperatur på minimum ${deig.t('fvst')}.`,
        `${kylling.k('fvst-varm')} skriver om kylling: ${kylling.s('gennemstegt', { med: false })}`,
        `${kylling.k('mv-kerne')} skriver: ${kylling.s('maal', { med: false })}`,
      ])}`,
      `<h2>Tal for alle udskæringer</h2><p>Vælg en vare for alle tal, kilderne bag dem og de andre sider. Kilden står i sidste kolonne.</p><div class="table-wrap" tabindex="0" role="region" aria-label="Kernetemperatur"><table class="sprik"><thead><tr><th scope="col">Vare og stegegrad</th><th scope="col">Kernetemperatur</th><th scope="col">Kilde</th></tr></thead><tbody>${radene}</tbody></table></div>`,
      '<h2>Varer der ikke er med</h2><p>Vi skriver kun et tal, når vi selv har fundet det hos en kilde og set det på siden. Fisk som laks og torsk mangler, fordi vi ikke fandt en dansk kilde med en kernetemperatur for dem.</p>',
      '<div class="related"><h2>Læs også</h2><ul><li><a href="/da/blog/kernetemperatur/">Kernetemperatur for lam, okse, svin, kylling og fisk</a></li><li><a href="/da/holdbarhed/">Hvor længe kan mad holde sig i køleskabet?</a></li></ul></div>',
    ].join('\n'),
    faqTittel: 'Spørgsmål om kernetemperatur',
    faq: [
      ['Hvad er kernetemperatur?', 'Kernetemperaturen er temperaturen midt i kødet, målt med et stegetermometer. ' + `${kylling.k('mv-kerne')} skriver: ${kylling.s('maal', { med: false })}`],
      ['Hvilken temperatur skal hakket kød og fjerkræ have?', `${kylling.k('mv-kerne')} skriver, at de bør gennemsteges til mindst ${kylling.t('min75')}.`],
    ],
  };
}

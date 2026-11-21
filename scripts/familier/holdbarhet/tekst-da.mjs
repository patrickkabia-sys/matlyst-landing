// Tekst til familien «holdbarhet» (da): hvor længe mad holder sig i køleskabet. Hver sætning gengiver, hvad en navngiven kilde siger.
// Tal skrives aldrig her: h.t(felt) henter dem fra data.da.json, hvor hvert tal har sitatet fra kilden.
// Setninger fra kilden hentes ordret med h.s(id). scripts/familier/holdbarhet/kildekontroll.mjs holdbarhet da kontrollerer sitaterne mod kildesiderne.
// Kilder: Fødevarestyrelsen først, så Forbrugerrådet Tænk (2025), Arla (2026) og Teknologisk Institut (2021). Ingen egne råd.
// Undgå ordene køleskab, rester, plan, uge, find, gem, sådan og ovn i h2-overskrifter, undtagen i app-blokken: scripts/app-bevis.mjs ville ellers lægge appkort ind under dem.

const KOELE = '/da/holdbarhed/';
const FRYS = '/da/kan-man-fryse/';
const F = (slug, tekst) => [`${FRYS}${slug}/`, tekst];
const R = (slug, tekst) => [`${KOELE}${slug}/`, tekst];

const KJOL = (h) => `${h.k('fvst-koel')} skriver, at temperaturen i køleskabet bør være højst ${h.t('kjol')}.`;
const KOLONNER = ['Vare', 'Tid i køleskabet'];
const TID = 'Holdbarhed i tal';
const INTRO = (h) => `${h.k('taenk-holdbarhed')} oplyser disse tider for køleskabet:`;

export const TEKST = {
  egg: (h) => ({
    ord: 'æg',
    title: 'Hvor længe kan æg holde sig i køleskabet?',
    h1: 'Hvor længe kan æg holde sig i køleskabet?',
    description: `Æg kan holde ${h.t('uger')} i køleskabet, skriver ${h.k('taenk-holdbarhed')}. Det siger kilderne om datomærkning og køleskabets temperatur.`,
    lead: `Æg skal opbevares i køleskab og kan holde ${h.t('uger')}, skriver ${h.k('taenk-holdbarhed')}. Æg kan ofte holde længere end datoen på pakken.`,
    kilder: [
      `${h.k('fvst-opbevar')} nævner æg blandt de varer, man bør opbevare i køleskabet. Vi fandt ikke et tal for, hvor længe, og tallet her er fra ${h.k('taenk-holdbarhed')}.`,
      KJOL(h),
      `Forbrugerrådet Tænk skriver: ${h.s('sanser', { med: false })}`,
      `Om datoen "bedst før" skriver Tænk: ${h.s('bedstfoer', { med: false })}`,
    ],
    tabell: { tittel: TID, kilde: 'taenk-holdbarhed', intro: INTRO(h), kolonner: KOLONNER, rader: [['Æg', 'uger']] },
    faq: [
      ['Skal æg opbevares i køleskabet?', `${h.k('taenk-holdbarhed')} skriver, at æg skal opbevares i køleskab og kan holde ${h.t('uger')}.`],
      ['Kan man spise æg efter datoen?', `${h.k('taenk-holdbarhed')} skriver: ${h.s('sanser', { med: false })}`],
      ['Kan man fryse æg?', `Vi fandt ikke et tal for æg i en dansk kilde, så der er ingen side om det. Se <a href="${FRYS}">hvad kilderne siger om frysning</a>.`],
    ],
    andre: [R('maelk', 'Hvor længe kan mælk holde sig i køleskabet?')],
  }),

  'hakket-koed': (h) => ({
    ord: 'hakket kød',
    title: 'Hvor længe kan hakket kød holde sig i køleskabet?',
    h1: 'Hvor længe kan hakket kød holde sig i køleskabet?',
    description: `Hakket kød kan holde sig op til ${h.t('dage')} i køleskabet, skriver ${h.k('taenk-holdbarhed')}. Det siger Fødevarestyrelsen om temperatur og bakterier.`,
    lead: `Hakket kød kan holde sig op til ${h.t('dage')} i køleskabet, skriver ${h.k('taenk-holdbarhed')}. Fødevarestyrelsen skriver, at køleskabet bør holde højst ${h.t('kjol')}.`,
    kilder: [
      KJOL(h),
      `Om hakket kød skriver Fødevarestyrelsen: ${h.s('bakterier', { med: false })}`,
      `Forbrugerrådet Tænk skriver om pakningen: ${h.s('pakning', { med: false })} Og om datoen: ${h.s('dato', { med: false })}`,
      `Tænk skriver om mærket sidste anvendelsesdato: ${h.s('sidste', { med: false })}`,
    ],
    tabell: { tittel: TID, kilde: 'taenk-holdbarhed', intro: INTRO(h), kolonner: KOLONNER, rader: [['Hakket kød, op til', 'dage']] },
    faq: [
      ['Hvor længe kan hakket kød ligge i køleskabet?', `${h.k('taenk-holdbarhed')} skriver, at hakket kød kan holde sig op til ${h.t('dage')} i køleskab.`],
      ['Hvor varmt skal hakket kød være, når det er færdigt?', 'Se <a href="/da/kernetemperatur/hakket-koed/">kernetemperatur for hakket kød</a>, med tal fra Fødevarestyrelsen.'],
      ['Kan man fryse hakket kød?', `Ja, kilderne har tider for det. Se <a href="${FRYS}hakket-koed/">kan man fryse hakket kød</a>.`],
    ],
    soster: F('hakket-koed', 'Kan man fryse hakket kød?'),
    andre: [['/da/kernetemperatur/hakket-koed/', 'Kernetemperatur for hakket kød'], R('rester', 'Hvor længe kan rester af kød holde sig?')],
  }),

  rester: (h) => ({
    ord: 'tilberedt kød',
    faqTittel: 'Spørgsmål og svar',
    title: 'Hvor længe kan rester holde sig i køleskabet?',
    h1: 'Hvor længe kan rester af kød holde sig i køleskabet?',
    description: `Tilberedt kød kan holde sig ${h.t('tilb')} i køleskabet, skriver ${h.k('taenk-holdbarhed')}. Teknologisk Institut skriver op til ${h.t('tek')}. Her er begge tal med kilde.`,
    lead: `Tilberedt kød kan holde sig ${h.t('tilb')} i køleskabet, hvis det er varmet grundigt igennem og kølet hurtigt ned, skriver ${h.k('taenk-holdbarhed')}. ${h.k('tek-sikker')} skriver op til ${h.t('tek')} ved højst ${h.t('kjol')}. De to kilder har forskellige tal, så begge står her.`,
    kilder: [
      `${h.k('fvst-koel')} skriver: ${h.s('rester5', { med: false })}`,
      `Om afkøling skriver Fødevarestyrelsen: ${h.s('portioner', { med: false })}`,
      `Om opvarmning skriver ${h.k('fvst-varm')}: ${h.s('varm', { med: false })} Samme side skriver, at bakterier kan vokse, hvis temperaturen kommer under ${h.t('vaekst')}.`,
      `Forbrugerrådet Tænk skriver: ${h.s('lufttaet', { med: false })}`,
    ],
    tabell: {
      tittel: TID, kilde: 'taenk-holdbarhed', intro: 'To danske kilder oplyser en tid for tilberedt kød:', kolonner: ['Kilde', 'Tid i køleskabet'],
      rader: [['Forbrugerrådet Tænk, tilberedt kød', 'tilb'], ['Teknologisk Institut, tilberedt gris og okse, op til', 'tek']],
      etter: [`Teknologisk Institut (2021) skriver det som sidste trin i en vejledning til sikker tilberedning af grise- og oksekød: spis kødet med det samme, eller opbevar det ved højst ${h.n('tek')} °C i op til ${h.t('tek')}. Tænk (2025) skriver om tilberedt kød generelt. Vi vælger ikke mellem de to tal.`],
    },
    faq: [
      ['Hvor længe kan kogt kød holde sig i køleskabet?', `${h.k('taenk-holdbarhed')} skriver ${h.t('tilb')}, hvis kødet er varmet grundigt igennem og kølet hurtigt ned. ${h.k('tek-sikker')} skriver op til ${h.t('tek')} ved højst ${h.t('kjol')}.`],
      ['Hvor varmt skal køleskabet være?', `${h.k('fvst-koel')} skriver, at temperaturen bør være højst ${h.t('kjol')}.`],
      ['Kan man fryse rester?', `Ja, kilderne har tider for færdige retter. Se <a href="${FRYS}rester/">kan man fryse rester og færdigretter</a>.`],
    ],
    soster: F('rester', 'Kan man fryse rester og færdigretter?'),
    andre: [R('hakket-koed', 'Hvor længe kan hakket kød holde sig?'), R('fisk', 'Hvor længe kan frisk fisk holde sig?'), ['/da/julefrokost/', 'Julefrokost derhjemme: plan, mængder og indkøbsliste']],
  }),

  fisk: (h) => ({
    ord: 'frisk fisk',
    title: 'Hvor længe kan frisk fisk holde sig i køleskabet?',
    h1: 'Hvor længe kan frisk fisk holde sig i køleskabet?',
    description: `Frisk fisk skal opbevares ved højst ${h.t('max2')}. Ved ${h.t('kjol')} kan den kun holde sig ${h.t('fem')}, skriver ${h.k('taenk-holdbarhed')}.`,
    lead: `Frisk fisk skal opbevares koldt, ved højst ${h.t('max2')}, skriver ${h.k('taenk-holdbarhed')}. Ved ${h.t('kjol')}, som er en typisk køleskabstemperatur, kan fisken kun holde sig ${h.t('fem')}.`,
    kilder: [
      KJOL(h),
      `Forbrugerrådet Tænk skriver om datoen: ${h.s('sidste2', { med: false })}`,
      `Om fisk, du køber hos fiskehandleren, skriver Tænk: ${h.s('fiskehandler', { med: false })}`,
      `Tænk skriver også: ${h.s('skaaret', { med: false })}`,
      `Om skaldyr skriver Tænk: ${h.s('skaldyr', { med: false })}`,
    ],
    tabell: {
      tittel: TID, kilde: 'taenk-holdbarhed', intro: INTRO(h), kolonner: ['Vare og temperatur', 'Tid'],
      rader: [['Frisk fisk, anbefalet temperatur, højst', 'max2'], ['Frisk fisk ved køleskabstemperatur', 'fem']],
    },
    faq: [
      ['Hvor længe kan frisk fisk ligge i køleskabet?', `${h.k('taenk-holdbarhed')} skriver, at fisk ved ${h.t('kjol')} kun kan holde sig ${h.t('fem')}.`],
      ['Hvor længe kan skaldyr holde sig?', `${h.k('taenk-holdbarhed')} skriver: ${h.s('skaldyr', { med: false })}`],
      ['Kan man fryse fisk?', `Ja, kilderne har tider for det. Se <a href="${FRYS}fisk/">kan man fryse fisk</a>.`],
    ],
    soster: F('fisk', 'Kan man fryse fisk?'),
    andre: [R('roeget-fisk', 'Hvor længe kan røget og gravad fisk holde sig?')],
  }),

  'roeget-fisk': (h) => ({
    ord: 'røget fisk',
    title: 'Hvor længe kan røget laks holde sig i køleskabet?',
    h1: 'Hvor længe kan røget laks og gravad laks holde sig i køleskabet?',
    description: `Røget laks holder ${h.t('laks')} efter åbning, og gravad laks ${h.t('gravad')}, skriver ${h.k('taenk-holdbarhed')}. Her er også makrel, sild og fiskekonserves.`,
    lead: `Røget laks holder ${h.t('laks')} efter åbning, mens gravad laks kun holder ${h.t('gravad')}, skriver ${h.k('taenk-holdbarhed')}.`,
    kilder: [
      KJOL(h),
      `Forbrugerrådet Tænk skriver: ${h.s('laenger', { med: false })}`,
      `Om fiskekonserves skriver Tænk: ${h.s('daase', { med: false })} Efter åbning holder konserves ${h.t('konserves')} i køleskabet.`,
    ],
    tabell: {
      tittel: TID, kilde: 'taenk-holdbarhed', intro: `${h.k('taenk-holdbarhed')} oplyser disse tider efter åbning:`, kolonner: ['Vare', 'Tid efter åbning'],
      rader: [['Røget laks', 'laks'], ['Gravad laks', 'gravad'], ['Røget makrel og sild', 'makrel'], ['Marinerede sild', 'sild'], ['Fiskekonserves', 'konserves']],
    },
    faq: [
      ['Hvor længe kan røget laks holde sig?', `${h.k('taenk-holdbarhed')} skriver ${h.t('laks')} efter åbning.`],
      ['Hvor længe kan gravad laks holde sig?', `${h.k('taenk-holdbarhed')} skriver, at gravad laks kun holder ${h.t('gravad')}.`],
      ['Hvor længe kan marinerede sild holde sig?', `${h.k('taenk-holdbarhed')} skriver ${h.t('sild')}, når glasset er åbnet.`],
    ],
    soster: F('fisk', 'Kan man fryse fisk?'),
    andre: [R('fisk', 'Hvor længe kan frisk fisk holde sig?')],
  }),

  ost: (h) => ({
    ord: 'ost',
    title: 'Hvor længe kan ost holde sig i køleskabet?',
    h1: 'Hvor længe kan ost holde sig i køleskabet?',
    description: `Skæreost og parmesan kan holde ${h.t('haard')} i køleskabet, og blød ost som brie og feta ${h.t('blod')}, skriver ${h.k('taenk-holdbarhed')}.`,
    lead: `Skæreost og parmesan kan holde ${h.t('haard')} i køleskabet, skriver ${h.k('taenk-holdbarhed')}. Camembert, brie, skimmelost, feta, smøreost og hytteost kan holde ${h.t('blod')}.`,
    kilder: [
      KJOL(h),
      `Forbrugerrådet Tænk skriver om opbevaringen: ${h.s('papir', { med: false })}`,
      `Tænk skriver også, at holdbarheden afhænger af, hvordan du bruger osten: ${h.s('osten', { med: false })}`,
    ],
    tabell: { tittel: TID, kilde: 'taenk-holdbarhed', intro: INTRO(h), kolonner: KOLONNER, rader: [['Skæreost og parmesan', 'haard'], ['Camembert, brie, skimmelost, feta, smøreost og hytteost', 'blod']] },
    faq: [
      ['Hvor længe kan skæreost holde sig?', `${h.k('taenk-holdbarhed')} skriver ${h.t('haard')} i køleskab.`],
      ['Hvor længe kan feta og brie holde sig?', `${h.k('taenk-holdbarhed')} skriver ${h.t('blod')} i køleskab for blød ost.`],
      ['Kan man fryse ost?', `Ja, Arla har tider for det. Se <a href="${FRYS}ost-og-smoer/">kan man fryse ost og smør</a>.`],
    ],
    soster: F('ost-og-smoer', 'Kan man fryse ost og smør?'),
    andre: [R('maelk', 'Hvor længe kan mælk og fløde holde sig?')],
  }),

  melk: (h) => ({
    ord: 'mælk',
    title: 'Hvor længe kan mælk holde sig i køleskabet?',
    h1: 'Hvor længe kan mælk holde sig i køleskabet efter åbning?',
    description: `Mælk kan holde ${h.t('maelk')} efter åbning, fløde ${h.t('floede')} og yoghurt ${h.t('yoghurt')}, skriver ${h.k('taenk-holdbarhed')}. Her er også smør.`,
    lead: `Mælk kan holde ${h.t('maelk')} i køleskabet, når den er åbnet, skriver ${h.k('taenk-holdbarhed')}. Fløde holder ${h.t('floede')} efter åbning, og det skriver ${h.k('arla-flode')} også.`,
    kilder: [
      `${h.k('fvst-vurder')} skriver om holdbarhed efter åbning: ${h.s('producent', { med: false })}`,
      KJOL(h),
      `Forbrugerrådet Tænk skriver om smør og margarine: ${h.s('indpakket', { med: false })}`,
    ],
    tabell: {
      tittel: TID, kilde: 'taenk-holdbarhed', intro: `${h.k('taenk-holdbarhed')} oplyser disse tider i køleskabet:`, kolonner: ['Vare', 'Tid i køleskabet'],
      rader: [['Mælk, åbnet', 'maelk'], ['Fløde, efter åbning', 'floede'], ['Yoghurt, skyr, cremefraiche og ymer, efter åbning', 'yoghurt'], ['Smør og margarine', 'smor']],
      etter: [`${h.k('arla-flode')} skriver også ${h.t('floede-arla')} for fløde, efter at emballagen er åbnet.`],
    },
    faq: [
      ['Hvor længe kan åbnet mælk holde sig?', `${h.k('taenk-holdbarhed')} skriver ${h.t('maelk')} i køleskab, når mælken er åbnet.`],
      ['Hvor længe kan smør holde sig i køleskabet?', `${h.k('taenk-holdbarhed')} skriver ${h.t('smor')} for smør og margarine.`],
      ['Hvad hvis pakken har en anden tid?', `${h.k('fvst-vurder')} skriver, at en anvisning fra producenten altid skal følges, og at maden skal opbevares ved ${h.t('kjol')}.`],
    ],
    soster: F('ost-og-smoer', 'Kan man fryse ost og smør?'),
    andre: [R('ost', 'Hvor længe kan ost holde sig?')],
  }),

  palegg: (h) => ({
    ord: 'pålæg',
    title: 'Hvor længe kan pålæg holde sig i køleskabet?',
    h1: 'Hvor længe kan pålæg holde sig i køleskabet?',
    description: `Skinke og rullepølse kan holde ${h.t('skinke')} efter åbning, leverpostej ${h.t('postej')} og spegepølse ${h.t('spege')}, skriver ${h.k('taenk-holdbarhed')}.`,
    lead: `Pålæg som skinke og rullepølse kan holde sig ${h.t('skinke')} i køleskabet, efter at emballagen er brudt, skriver ${h.k('taenk-holdbarhed')}. Leverpostej holder ${h.t('postej')}, og spegepølse holder cirka ${h.t('spege')}.`,
    kilder: [
      KJOL(h),
      `Forbrugerrådet Tænk skriver: ${h.s('roeget', { med: false })}`,
      `Om spegepølse skriver Tænk: ${h.s('spegepolse', { med: false })}`,
    ],
    tabell: {
      tittel: TID, kilde: 'taenk-holdbarhed', intro: `${h.k('taenk-holdbarhed')} oplyser disse tider efter åbning:`, kolonner: ['Vare', 'Tid efter åbning'],
      rader: [['Skinke og rullepølse', 'skinke'], ['Leverpostej', 'postej'], ['Spegepølse', 'spege']],
    },
    faq: [
      ['Hvor længe kan skinke holde sig i køleskabet?', `${h.k('taenk-holdbarhed')} skriver ${h.t('skinke')}, efter at emballagen er brudt.`],
      ['Hvor længe kan leverpostej holde sig?', `${h.k('taenk-holdbarhed')} skriver ${h.t('postej')} i køleskabet efter åbning.`],
      ['Hvor længe kan spegepølse holde sig?', `${h.k('taenk-holdbarhed')} skriver cirka ${h.t('spege')} i køleskab efter åbning.`],
    ],
    andre: [R('ost', 'Hvor længe kan ost holde sig?')],
  }),

  groentsager: (h) => ({
    ord: 'grøntsager',
    title: 'Hvor længe kan grøntsager holde sig i køleskabet?',
    h1: 'Hvor længe kan grøntsager holde sig i køleskabet?',
    description: `Agurk holder cirka ${h.t('agurk')}, gulerødder ${h.t('gulerod')} og blomkål cirka ${h.t('blomkaal')} i køleskabet, skriver ${h.k('taenk-holdbarhed')}.`,
    lead: `Agurk holder cirka ${h.t('agurk')} i køleskabet, gulerødder ${h.t('gulerod')} og blomkål cirka ${h.t('blomkaal')}, skriver ${h.k('taenk-holdbarhed')}. Her er tider for flere grøntsager og krydderurter.`,
    kilder: [
      `${h.k('fvst-opbevar')} skriver: ${h.s('kemi', { med: false })} Peberfrugter står blandt grøntsagerne i køleskabet, men med tilføjelsen »dog helst ${h.n('peber-temp')} grader«.`,
      KJOL(h),
      `Forbrugerrådet Tænk skriver: ${h.s('ikke-datomaerket', { med: false })}`,
    ],
    tabell: {
      tittel: TID, kilde: 'taenk-holdbarhed', intro: INTRO(h), kolonner: KOLONNER,
      rader: [['Agurk', 'agurk'], ['Gulerødder', 'gulerod'], ['Hovedsalat', 'salat'], ['Champignoner', 'champignon'], ['Peberfrugter', 'peber'], ['Asparges', 'asparges'], ['Ingefær', 'ingefaer'], ['Afskårne krydderurter', 'urter'], ['Blomkål', 'blomkaal']],
      etter: [`Om kartofler skriver Tænk, at de skal opbevares mørkt og køligt ved ${h.t('kartofler')}, for eksempel i en kold kælder.`],
    },
    faq: [
      ['Hvor længe kan gulerødder holde sig?', `${h.k('taenk-holdbarhed')} skriver ${h.t('gulerod')} i en pose med hul i køleskabet.`],
      ['Hvor længe kan salat holde sig?', `${h.k('taenk-holdbarhed')} skriver ${h.t('salat')} for et salathoved i en pose i køleskabet.`],
      ['Kan man fryse grøntsager?', `Ja, kilderne har tider for det. Se <a href="${FRYS}frugt-og-groentsager/">kan man fryse frugt og grøntsager</a>.`],
    ],
    soster: F('frugt-og-groentsager', 'Kan man fryse frugt og grøntsager?'),
    andre: [R('baer', 'Hvor længe kan jordbær og andre bær holde sig?')],
  }),

  baer: (h) => ({
    ord: 'bær',
    title: 'Hvor længe kan jordbær holde sig i køleskabet?',
    h1: 'Hvor længe kan jordbær og andre bær holde sig i køleskabet?',
    description: `Jordbær kan holde sig ${h.t('jordbaer')} i køleskabet ved ${h.t('jordbaer-temp')}, og blåbær ${h.t('blaabaer')} ved ${h.t('blaabaer-temp')}, skriver ${h.k('taenk-holdbarhed')}.`,
    lead: `Jordbær kan holde sig ${h.t('jordbaer')} i køleskabet ved ${h.t('jordbaer-temp')}, og blåbær ${h.t('blaabaer')} ved ${h.t('blaabaer-temp')}, skriver ${h.k('taenk-holdbarhed')}. Hindbær og ribs holder ${h.t('hindbaer')}.`,
    kilder: [
      KJOL(h),
      `Forbrugerrådet Tænk skriver om jordbær: ${h.s('spis-samme-dag', { med: false })}`,
      `Om hindbær skriver Tænk: ${h.s('indpakning', { med: false })}`,
    ],
    tabell: {
      tittel: TID, kilde: 'taenk-holdbarhed', intro: INTRO(h), kolonner: KOLONNER,
      rader: [['Jordbær', 'jordbaer'], ['Hindbær', 'hindbaer'], ['Blåbær', 'blaabaer'], ['Kirsebær', 'kirsebaer'], ['Ribs', 'ribs'], ['Brombær', 'brombaer']],
    },
    faq: [
      ['Hvor længe kan jordbær holde sig?', `${h.k('taenk-holdbarhed')} skriver ${h.t('jordbaer')} i køleskabet ved ${h.t('jordbaer-temp')}.`],
      ['Hvor længe kan blåbær holde sig?', `${h.k('taenk-holdbarhed')} skriver ${h.t('blaabaer')} ved en temperatur på ${h.t('blaabaer-temp')}.`],
      ['Kan man fryse bær?', `Ja, kilderne har tider for frugt og bær. Se <a href="${FRYS}frugt-og-groentsager/">kan man fryse frugt og grøntsager</a>.`],
    ],
    soster: F('frugt-og-groentsager', 'Kan man fryse frugt og grøntsager?'),
    andre: [R('groentsager', 'Hvor længe kan grøntsager holde sig?')],
  }),
};

// Hvad hver side bidrager med til oversigten: [etikett, felt].
const OVERSIKT = {
  egg: [['Æg', 'uger']],
  'hakket-koed': [['Hakket kød, op til', 'dage']],
  rester: [['Tilberedt kød', 'tilb']],
  fisk: [['Frisk fisk ved køleskabstemperatur', 'fem']],
  'roeget-fisk': [['Røget laks', 'laks'], ['Gravad laks', 'gravad']],
  ost: [['Skæreost og parmesan', 'haard'], ['Blød ost', 'blod']],
  melk: [['Mælk, åbnet', 'maelk'], ['Fløde, efter åbning', 'floede'], ['Smør', 'smor']],
  palegg: [['Skinke og rullepølse', 'skinke'], ['Leverpostej', 'postej']],
  groentsager: [['Gulerødder', 'gulerod'], ['Hovedsalat', 'salat']],
  baer: [['Jordbær', 'jordbaer'], ['Blåbær', 'blaabaer']],
};

export function nav({ rader, sti, h, p, esc }) {
  const forste = h(rader[0]);
  const mælk = h(rader.find((r) => r.id === 'melk'));
  const radene = rader.flatMap((r) => {
    const x = h(r);
    return (OVERSIKT[r.id] ?? []).map(([etikett, felt]) => `<tr><td><a href="${sti(r)}">${esc(etikett)}</a></td><td>${x.t(felt)}</td><td>${x.k(r.tall[felt]?.kilde ?? r.tall[`${felt}-min`].kilde)}</td></tr>`);
  }).join('');
  return {
    title: 'Hvor længe kan mad holde sig i køleskabet? Tider med kilder',
    h1: 'Hvor længe kan mad holde sig i køleskabet?',
    description: 'Hvor længe kan æg, hakket kød, fisk, ost, mælk, pålæg og grøntsager holde sig i køleskabet? Tider fra Forbrugerrådet Tænk, Arla og Teknologisk Institut, med kilde på hvert tal.',
    lead: `Fødevarestyrelsen skriver, at temperaturen i køleskabet bør være højst ${forste.t('kjol')}. Hvert tal på siderne her står hos en navngiven kilde med årstal.`,
    rik: [
      `<h2>Det siger kilderne</h2>${p([
        `${forste.k('fvst-koel')} skriver, at temperaturen i køleskabet bør være højst ${forste.t('kjol')}.`,
        'Fødevarestyrelsen har ikke selv tal for hvert enkelt produkt. Tiderne nedenfor er derfor fra Forbrugerrådet Tænk, Arla og Teknologisk Institut, hver med årstal.',
      ])}`,
      `<h2>Tider for alle varer</h2><p>Vælg en vare for hele tiden, kilderne bag den og de andre sider. Kilden står i sidste kolonne.</p><div class="table-wrap" tabindex="0" role="region" aria-label="Tider i køleskabet"><table class="sprik"><thead><tr><th scope="col">Vare</th><th scope="col">Tid i køleskabet</th><th scope="col">Kilde</th></tr></thead><tbody>${radene}</tbody></table></div>`,
      '<h2>Varer der ikke er med</h2><p>Vi skriver kun en tid, når vi selv har fundet den hos en kilde og set tallet på siden. Kogte ris og pasta, rå kylling og kogte æg mangler, fordi vi ikke fandt en dansk kilde med et tal for dem.</p>',
      `<div class="related"><h2>Læs også</h2><ul><li><a href="${FRYS}">Kan man fryse det? Tider i fryseren for alle varer</a></li><li><a href="/da/kernetemperatur/">Kernetemperatur for kød og fjerkræ</a></li></ul></div>`,
    ].join('\n'),
    faqTittel: 'Spørgsmål om køleskabets temperatur',
    faq: [
      ['Hvor varmt må et køleskab være?', `${forste.k('fvst-koel')} skriver, at temperaturen bør være højst ${forste.t('kjol')}.`],
      ['Hvor længe kan mad holde sig, når pakken er åbnet?', `${mælk.k('fvst-vurder')} skriver, at en anvisning fra producenten skal følges, for eksempel »åben: ${mælk.t('produkt3')} i køleskab ved ${mælk.n('kjol')} grader«, når den står på pakken.`],
    ],
  };
}

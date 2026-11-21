// Tekst til familien «erstatning» (da): hvad man kan bruge i stedet for en vare, man mangler. Hver sætning gengiver, hvad en navngiven dansk kilde siger.
// Tal skrives aldrig her: h.t(felt) henter dem fra data.da.json, hvor hvert tal har sitatet fra kilden. Setninger fra kilden hentes ordret med h.s(id).
// Kilder: Arla (2026), Madens Verden (2021 til 2026) og Dr. Oetker (producent). Ingen forhold, vi ikke har set på kildens side. Vi giver ingen egne råd om mad.
// Undgå ordene køleskab, rester, plan, uge, find, gem, sådan, ovn, trin, lav, timer og opskrift i h2-overskrifter, undtagen i app-blokken: scripts/app-bevis.mjs ville ellers lægge appkort ind under dem.

const E = '/da/erstatning/';
const L = (slug, tekst) => [`${E}${slug}/`, tekst];
const KOL = ['Erstatning', 'Det skriver kilden'];

export const TEKST = {
  egg: (h) => ({
    ord: 'æg',
    title: 'Erstatning for æg i bagning: det kan du bruge',
    h1: 'Hvad kan man bruge i stedet for æg i bagning?',
    description: `Madens Verden: en blanding af ${h.t('vand')} vand, ${h.t('bagepulver')} bagepulver og olie kan gøre det ud for ét æg. Banan, kartoffelmos, hørfrø og kikærtevand er andre forslag.`,
    lead: `${h.k('mv-erst')} skriver, at ${h.t('vand')} vand, ${h.t('bagepulver')} bagepulver og en spiseskefuld olie kan gøre det ud for ét æg. Her er også de andre forslag fra Madens Verden.`,
    kilder: [
      `Om hvad et æg gør i dejen, skriver Madens Verden: ${h.s('funktion', { med: false })}`,
      `${h.k('mv-erst')}: ${h.s('banan', { med: false })} ${h.s('kartofler', { med: false })}`,
      `${h.k('mv-vegan')} om hørfrø: ${h.s('hoerfroe', { med: false })} ${h.s('hoerfroe2', { med: false })}`,
    ],
    tabell: {
      tittel: 'Det kan stå i stedet for ét æg', kilde: 'mv-erst', intro: 'Mængderne er fra Madens Verdens to sider. Siderne er fra 2021, så tjek altid, om opskriften har sin egen anvisning.', kolonner: ['Erstatning', 'Mængde der svarer til ét æg'],
      rader: [
        ['Vand i blandingen med bagepulver og olie', 'vand'],
        ['Bagepulver i samme blanding', 'bagepulver'],
        ['Moset, moden banan', { tekst: 'En halv banan' }],
        ['Kartoffelmos', { tekst: 'To spiseskefulde' }],
        ['Kartoffelmel og vand', { tekst: 'To spiseskefulde mel og to spiseskefulde vand' }],
        ['Hørfrø i vand', { tekst: 'To spiseskefulde hørfrø i seks spiseskefulde vand' }],
        ['Loppefrøskaller i vand', { tekst: 'En teskefuld i tre spiseskefulde vand' }],
      ],
    },
    ekstra: [
      ['Kikærtevand til marengs', h.p([`${h.k('mv-vegan')} skriver: ${h.s('aquafaba', { med: false })}`])],
      ['Kartoffelmel i stedet', h.p([`Madens Verden skriver: ${h.s('kartoffelmel', { med: false })}`])],
    ],
    faq: [
      ['Hvad kan man bruge i stedet for æg i en kage?', `${h.k('mv-erst')} nævner en moset, moden banan og en blanding af ${h.t('vand')} vand, ${h.t('bagepulver')} bagepulver og olie.`],
      ['Hvor meget banan svarer til et æg?', `${h.k('mv-vegan')} skriver, at en halv banan kan erstatte et æg. Bananen binder kagen, brødet eller pandekagerne sammen, og man moser den først.`],
      ['Hvad kan man bruge i stedet for æggehvide?', `${h.k('mv-vegan')} skriver om kikærtevand: ${h.s('aquafaba', { med: false })}`],
    ],
    andre: [L('bagepulver', 'Erstatning for bagepulver'), L('smoer', 'Erstatning for smør'), [`/da/stegetid/aeg/`, 'Hvor længe skal man koge æg?']],
  }),

  'kulturmelk-og-kefir': (h) => ({
    ord: 'kærnemælk',
    title: 'Erstatning for kærnemælk: det kan du bruge i stedet',
    h1: 'Hvad kan man bruge i stedet for kærnemælk?',
    description: `Arla: kefir, yoghurt fortyndet med vand eller mælk med citronsaft eller eddike. Madens Verden nævner ymer, tykmælk, yoghurt og A38. Se hvorfor det er syren, der tæller.`,
    lead: `Arla og Madens Verden nævner samme familie af varer: surmælksprodukter. ${h.s('arla')}`,
    kilder: [
      `${h.k('arla-erst')} skriver om syren: ${h.s('arlasyre', { med: false })}`,
      `${h.k('mv-kaernemaelk')} skriver: ${h.s('mv', { med: false })}`,
      `Arla om forskellen på mælk og kærnemælk i bagning: ${h.s('natron', { med: false })} ${h.s('kompakt', { med: false })}`,
    ],
    tabell: {
      tittel: 'Det kan stå i stedet for kærnemælk', kilde: 'arla-erst', intro: 'Listerne er fra Arla og Madens Verden. Ingen af dem opgiver et forhold i gram eller deciliter.', kolonner: KOL,
      rader: [
        ['Kefir', { tekst: 'Arla nævner kefir' }],
        ['Yoghurt', { tekst: 'Arla: yoghurt fortyndet med lidt vand. Madens Verden nævner yoghurt' }],
        ['Mælk med citronsaft eller eddike', { tekst: 'Arla: mælk tilsat en smule citronsaft eller eddike' }],
        ['Ymer, tykmælk og A38', { tekst: 'Madens Verden nævner dem som andre surmælksprodukter' }],
        ['Almindelig mælk', { tekst: 'Madens Verden nævner den. Arla skriver, at resultatet ofte bliver mere kompakt' }],
      ],
    },
    ekstra: [
      ['Er kærnemælken for gammel?', h.p([`Madens Verden skriver, at kærnemælk bør opbevares ved højst ${h.t('kjol')}, og at den har en holdbarhed på op til ${h.t('holdbar')} efter åbning. Om gammel kærnemælk: ${h.s('mvsur', { med: false })}`])],
    ],
    faq: [
      ['Hvad kan man bruge i stedet for kærnemælk?', `${h.k('arla-erst')} nævner kefir, yoghurt fortyndet med lidt vand og mælk tilsat citronsaft eller eddike. ${h.k('mv-kaernemaelk')} nævner ymer, tykmælk, yoghurt og A38.`],
      ['Kan man bruge almindelig mælk i stedet for kærnemælk?', `${h.k('mv-kaernemaelk')} nævner almindelig mælk. ${h.k('arla-erst')} skriver: ${h.s('kompakt', { med: false })}`],
      ['Hvor længe holder kærnemælk efter åbning?', `${h.k('mv-kaernemaelk')} skriver op til ${h.t('holdbar')} ved højst ${h.t('kjol')}.`],
    ],
    andre: [L('natron', 'Erstatning for natron'), L('bagepulver', 'Erstatning for bagepulver'), L('creme-fraiche', 'Erstatning for creme fraiche')],
  }),

  bakepulver: (h) => ({
    ord: 'bagepulver',
    title: 'Erstatning for bagepulver: kan man bruge natron?',
    h1: 'Kan man bruge natron i stedet for bagepulver?',
    description: `Dr. Oetker: man kan godt erstatte bagepulver med natron, men det bedste er at følge opskriften. Madens Verden regner med ${h.t('mv-bp')} bagepulver og omkring en kvart teskefuld natron, plus syre.`,
    lead: `${h.k('oetker-haeve')} skriver: ${h.s('oetker', { med: false })}`,
    kilder: [
      `Dr. Oetker om smagen: ${h.s('bitter', { med: false })}`,
      `${h.k('mv-haeve')} regner med ${h.t('mv-bp')} bagepulver omkring en kvart teskefuld natron, plus syre. Om tiden: ${h.s('straks', { med: false })}`,
      `${h.k('mv-erst')}: ${h.s('mvsyre', { med: false })} ${h.s('halv', { med: false })}`,
    ],
    tabell: {
      tittel: 'Natron i stedet for bagepulver', kilde: 'mv-haeve', intro: 'Tabellen samler, hvad de tre kilder skriver.', kolonner: ['Hvem', 'Hvad der står'],
      rader: [
        ['Madens Verden', { tekst: 'Ja, men med justering: omkring en kvart teskefuld natron per teskefuld bagepulver, plus syre' }],
        ['Madens Verden (anden side)', { tekst: 'Brug kun halv portion natron i forhold til bagepulver' }],
        ['Dr. Oetker', { tekst: 'Det er bedst at anvende det, som opskriften foreskriver' }],
      ],
    },
    ekstra: [
      ['Hvilken syre skal der være?', h.p([`${h.k('oetker-natron')} skriver: ${h.s('syre', { med: false })}`, `Arla om natron: ${h.s('arla', { med: false })}`])],
      ['To kilder, to forhold', h.p([`Kilderne er ikke enige om mængden. Madens Verden nævner ${h.t('mv-bp')} bagepulver og omkring en kvart teskefuld natron på den ene side og en halv portion natron på den anden. Brug derfor opskriftens eget hævemiddel, når du kan.`])],
    ],
    faq: [
      ['Kan man erstatte bagepulver med natron?', `${h.k('oetker-haeve')} skriver: ${h.s('oetker', { med: false })}`],
      ['Hvorfor bliver kagen bitter med natron?', `${h.k('oetker-haeve')} skriver: ${h.s('bitter', { med: false })}`],
      ['Skal kagen bages med det samme?', `${h.k('mv-haeve')} skriver: ${h.s('straks', { med: false })}`],
    ],
    andre: [L('natron', 'Erstatning for natron'), L('kaernemaelk', 'Erstatning for kærnemælk')],
  }),

  natron: (h) => ({
    ord: 'natron',
    title: 'Erstatning for natron: kan man bruge bagepulver?',
    h1: 'Kan man bruge bagepulver i stedet for natron?',
    description: `Dr. Oetker: natron kan godt erstattes med bagepulver, men det er bedst at følge opskriften. Madens Verden regner med ${h.t('mv-nat')} natron svarende til ${h.t('mv-bp')} bagepulver.`,
    lead: `${h.k('oetker-natron')} skriver: ${h.s('oetker', { med: false })}`,
    kilder: [
      `${h.k('mv-haeve')} skriver, at ${h.t('mv-nat')} natron svarer til ${h.t('mv-bp')} bagepulver. ${h.s('smag', { med: false })}.`,
      `${h.k('mv-erst')}: ${h.s('dobbelt', { med: false })}`,
      `Om syren: ${h.s('syre', { med: false })}`,
    ],
    tabell: {
      tittel: 'Bagepulver i stedet for natron', kilde: 'mv-haeve', intro: 'To kilder, to forhold. De er ikke ens.', kolonner: ['Hvem', 'Svarer til natron'],
      rader: [['Madens Verden, hævemidler', 'mv-bp'], ['Madens Verden, erstatning', { tekst: 'Dobbelt dosis bagepulver' }], ['Dr. Oetker', { tekst: 'Det er bedst at anvende det, som opskriften foreskriver' }]],
    },
    ekstra: [
      ['Tid fra dej til ovn', h.p([`Madens Verden skriver om kemiske hævemidler: ${h.s('straks', { med: false })}`])],
      ['Hvad natron bruges til', h.p([`Arla skriver: ${h.s('arla', { med: false })}`])],
    ],
    faq: [
      ['Hvor meget bagepulver svarer til natron?', `${h.k('mv-haeve')} skriver, at ${h.t('mv-nat')} natron svarer til omkring ${h.t('mv-bp')} bagepulver. ${h.k('mv-erst')} skriver dobbelt dosis.`],
      ['Kan man erstatte natron med bagepulver?', `${h.k('oetker-natron')} skriver: ${h.s('oetker', { med: false })}`],
    ],
    andre: [L('bagepulver', 'Erstatning for bagepulver'), L('kaernemaelk', 'Erstatning for kærnemælk')],
  }),

  floete: (h) => ({
    ord: 'fløde',
    title: 'Erstatning for fløde i madlavning: mælk, creme fraiche og mere',
    h1: 'Hvad kan man bruge i stedet for fløde?',
    description: `Arla: mælk eller sødmælk kan bruges i mange retter, men resultatet bliver lettere. Madens Verden: creme fraiche ${h.t('cf')} er det sikreste valg til varme retter. Se hvad kilderne skriver.`,
    lead: `${h.k('arla-erst')} skriver: ${h.s('maelk', { med: false })}`,
    kilder: [
      `Arla om at justere resultatet: ${h.s('just', { med: false })}`,
      `Arla: ${h.s('soedmaelk', { med: false })}`,
      `${h.k('mv-cf')}: ${h.s('cfsauce', { med: false })} ${h.s('cfsmag', { med: false })} Til varme retter skriver Madens Verden, at creme fraiche ${h.t('cf')} er det sikreste valg.`,
    ],
    tabell: {
      tittel: 'Fløde og det, der kan stå i stedet', kilde: 'mv-floede', intro: 'Fedtprocenten er fra Madens Verden. Tabellen viser også, hvad kilderne skriver om hver erstatning.', kolonner: ['Vare', 'Fedt eller kommentar'],
      rader: [
        ['Madlavningsfløde', 'madlav'],
        ['Kaffefløde', 'kaffe'],
        ['Creme fraiche til varme retter', 'cf'],
        ['Mælk eller sødmælk', { tekst: 'Arla: lettere og mindre cremet resultat' }],
      ],
    },
    ekstra: [
      ['Piskefløde og madlavningsfløde', h.p([`Arla: ${h.s('piske', { med: false })}`, `Madens Verden om madlavningsfløde: ${h.s('madlav', { med: false })} ${h.s('ikkepiske', { med: false })}`])],
    ],
    faq: [
      ['Kan man bruge mælk i stedet for fløde?', `${h.k('arla-erst')} skriver: ${h.s('maelk', { med: false })}`],
      ['Kan man bruge creme fraiche i stedet for fløde?', `${h.k('mv-cf')} skriver: ${h.s('cfsauce', { med: false })} ${h.s('cfsmag', { med: false })}`],
      ['Hvor meget fedt er der i madlavningsfløde?', `${h.k('mv-floede')} skriver typisk ${h.t('madlav')} fedt.`],
    ],
    andre: [L('creme-fraiche', 'Erstatning for creme fraiche'), L('smoer', 'Erstatning for smør')],
  }),

  smor: (h) => ({
    ord: 'smør',
    title: 'Erstatning for smør i bagning: kan man bruge olie?',
    h1: 'Kan man bruge olie i stedet for smør?',
    description: `Madens Verden: brug ${h.t('olie')} olie per ${h.t('smor')} smør i kager og brød. Arla skriver, at olie giver en blød konsistens, mens smør giver smag og struktur.`,
    lead: `${h.k('mv-erst')} skriver, at man kun skal bruge ${h.t('olie')} olie per ${h.t('smor')} smør, når man erstatter smør med olie i kager og brød.`,
    kilder: [
      `${h.k('arla-erst')}: ${h.s('arla', { med: false })} ${h.s('arlaforskel', { med: false })}`,
      `Madens Verden om småkager: ${h.s('smaakager', { med: false })} ${h.s('kager', { med: false })}`,
      `Arla om valget: ${h.s('valg', { med: false })}`,
    ],
    tabell: { tittel: 'Olie i stedet for smør', kilde: 'mv-erst', intro: 'Forholdet er fra Madens Verden.', kolonner: ['Smør', 'Olie'], rader: [['Smør', 'smor'], ['Svarer til olie', 'olie']] },
    ekstra: [],
    faq: [
      ['Hvor meget olie svarer til smør?', `${h.k('mv-erst')} skriver ${h.t('olie')} olie per ${h.t('smor')} smør.`],
      ['Kan man bruge olie i småkager?', `Madens Verden skriver om småkager og cookies: ${h.s('smaakager', { med: false })}`],
    ],
    andre: [L('floede', 'Erstatning for fløde'), L('aeg', 'Erstatning for æg')],
  }),

  'creme-fraiche': (h) => ({
    ord: 'creme fraiche',
    title: 'Erstatning for creme fraiche: yoghurt, skyr og mere',
    h1: 'Hvad kan man bruge i stedet for creme fraiche?',
    description: `Arla: græsk yoghurt er et oplagt alternativ i dips og dressinger. Madens Verden: yoghurt naturel kan bruges i samme mængde i bagning. Se hvad der sker med smagen.`,
    lead: `${h.k('arla-erst')} skriver: ${h.s('arla', { med: false })} ${h.k('mv-cf')} skriver: ${h.s('bagning', { med: false })}`,
    kilder: [
      `Arla: ${h.s('arlayog', { med: false })} ${h.s('mayo', { med: false })}`,
      `${h.k('mv-cf')} om fedtprocenten: creme fraiche ${h.t('let')} til kolde retter, ${h.t('varm')} til varme retter. Fraiche med ${h.t('mager')} skiller lettere.`,
      `Madens Verden: ${h.s('mindre', { med: false })} ${h.s('sour', { med: false })}`,
    ],
    tabell: {
      tittel: 'Det kan stå i stedet for creme fraiche', kilde: 'mv-cf', intro: 'Listerne er fra Arla og Madens Verden.', kolonner: KOL,
      rader: [
        ['Græsk yoghurt', { tekst: 'Arla: oplagt alternativ i dips og dressinger' }],
        ['Yoghurt naturel', { tekst: 'Madens Verden: i bagning i samme mængde, men lidt mindre fyldigt' }],
        ['Skyr, yoghurt og creme fraiche i tzatziki', { tekst: 'Arla: justér smagen undervejs' }],
        ['Mayonnaise', { tekst: 'Arla: i dressinger, giver mere fedme og en anden smag' }],
      ],
    },
    ekstra: [
      ['Creme fraiche i varm mad', h.p([`Madens Verden skriver, at creme fraiche ${h.t('varm')} er det sikreste valg til varme retter, og at fraiche med ${h.t('mager')} skiller lettere. Til kolde retter vælger Madens Verden som regel ${h.t('let')}.`])],
    ],
    faq: [
      ['Kan man bruge yoghurt i stedet for creme fraiche?', `${h.k('mv-cf')} skriver: ${h.s('bagning', { med: false })}`],
      ['Kan man bruge græsk yoghurt i stedet for creme fraiche?', `${h.k('arla-erst')} skriver: ${h.s('arla', { med: false })}`],
    ],
    andre: [L('floete', 'Erstatning for fløde'), L('kaernemaelk', 'Erstatning for kærnemælk')],
  }),

  sukker: (h) => ({
    ord: 'sukker',
    title: 'Erstatning for sukker i bagning: sirup og honning',
    h1: 'Hvad kan man bruge i stedet for sukker i bagning?',
    description: `Madens Verden: ${h.t('sirup')} sirup svarer til ${h.t('sukker')} sukker, og honning bruges efter samme princip. Bag ved ${h.t('honning-ned')} i stedet for ${h.t('honning')} med honning.`,
    lead: `${h.k('mv-erst')} skriver, at du skal bruge ${h.t('sirup')} sirup som erstatning for ${h.t('sukker')} sukker. Honning følger samme princip.`,
    kilder: [
      `Madens Verden: ${h.s('sirup', { med: false })} ${h.s('regel', { med: false })}`,
      `Om honning: ${h.s('honning', { med: false })} ${h.s('temp', { med: false })} Eksemplet: hvis kagen skal have ${h.t('honning')}, så nøjes man med ${h.t('honning-ned')} til samme bagetid.`,
    ],
    tabell: { tittel: 'Sirup og honning i stedet for sukker', kilde: 'mv-erst', intro: 'Tallene er fra Madens Verdens side fra 2021.', kolonner: ['Hvad', 'Tal'], rader: [['Sukker', 'sukker'], ['Svarer til sirup', 'sirup'], ['Ovntemperatur med honning, fra', 'honning'], ['Ovntemperatur med honning, til', 'honning-ned']] },
    ekstra: [],
    faq: [
      ['Hvor meget sirup svarer til sukker?', `${h.k('mv-erst')} skriver ${h.t('sirup')} sirup per ${h.t('sukker')} sukker.`],
      ['Skal man bage ved en anden temperatur med honning?', `${h.k('mv-erst')} skriver: ${h.s('temp', { med: false })}`],
    ],
    andre: [L('aeg', 'Erstatning for æg'), L('smoer', 'Erstatning for smør')],
  }),
};

const OVERSIGT = {
  egg: ['Æg', 'Blanding af vand, bagepulver og olie, eller banan, kartoffelmos, hørfrø'], 'kulturmelk-og-kefir': ['Kærnemælk', 'Kefir, yoghurt med vand, mælk med citronsaft eller eddike, ymer, tykmælk, A38'],
  bakepulver: ['Bagepulver', 'Natron, plus en syre, og følg opskriften'], natron: ['Natron', 'Bagepulver i større mængde'], floete: ['Fløde', 'Mælk, sødmælk, creme fraiche, fortyndet piskefløde'],
  smor: ['Smør', 'Olie i kager og brød, mindre mængde'], 'creme-fraiche': ['Creme fraiche', 'Græsk yoghurt, yoghurt naturel, skyr, mayonnaise i dressinger'], sukker: ['Sukker', 'Sirup og honning, tre fjerdedele af mængden'],
};

export function nav({ rader, sti, h, p, esc }) {
  const forste = h(rader[0]);
  const radene = rader.map((r) => {
    const [etikett, svar] = OVERSIGT[r.id];
    h(r);
    return `<tr><td><a href="${sti(r)}">${esc(etikett)}</a></td><td>${esc(svar)}</td></tr>`;
  }).join('');
  return {
    title: 'Hvad kan man bruge i stedet for? Erstatning for æg, kærnemælk, bagepulver og mere',
    h1: 'Hvad kan man bruge i stedet for?',
    description: 'Erstatning for æg, kærnemælk, bagepulver, natron, fløde, smør, creme fraiche og sukker i madlavning og bagning. Forhold og råd fra Arla, Madens Verden og Dr. Oetker, med kilde på hvert tal.',
    lead: 'Mangler du en vare midt i en opskrift? Her er det, danske kilder skriver, at du kan bruge i stedet. Hvert forhold står hos en navngiven kilde med årstal, og vi skriver ikke egne råd.',
    rik: [
      `<h2>Det siger kilderne</h2>${p([
        `${forste.k('arla-erst')} skriver om erstatning for mejeriprodukter, og ${forste.k('mv-erst')} har en side om, hvad man kan bruge i stedet for sukker, æg og smør. ${forste.k('oetker-haeve')} skriver om hævemidler.`,
        'Kilderne er ikke altid enige om mængderne. Hvor de er uenige, viser siden begge forhold, og vi vælger ikke for dig.',
      ])}`,
      `<h2>Erstatning for alle varer</h2><p>Vælg den vare, du mangler.</p><div class="table-wrap" tabindex="0" role="region" aria-label="Erstatninger"><table class="sprik"><thead><tr><th scope="col">Du mangler</th><th scope="col">Kilderne nævner</th></tr></thead><tbody>${radene}</tbody></table></div>`,
      '<h2>Varer der ikke er med</h2><p>Der er ingen side om vaniljesukker, gær, mel eller hvidvin, fordi vi ikke fandt en dansk kilde med et forhold, vi kunne kontrollere på kildens egen side.</p>',
      `<div class="related"><h2>Læs også</h2><ul><li><a href="/da/stegetid/">Stegetid og kogetid</a></li><li><a href="/da/holdbarhed/">Holdbarhed for mad</a></li></ul></div>`,
    ].join('\n'),
    faqTittel: 'Spørgsmål om erstatning',
    faq: [
      ['Kan man altid bytte en vare med en anden i samme mængde?', `${forste.k('arla-erst')} skriver: ${h(rader.find((r) => r.id === 'kulturmelk-og-kefir')).s('ikkealtid', { med: false })}`],
    ],
  };
}

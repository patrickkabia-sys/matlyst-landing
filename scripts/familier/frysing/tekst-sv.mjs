// Text för familjen «frysing» (sv): kan man frysa det, och hur länge håller det. Varje mening återger vad en namngiven källa säger.
// Siffror skrivs aldrig här: h.t(fält) läser dem ur data.sv.json, och h.s(id) ger en hel mening ur källan, ordagrant.
// Livsmedelsverket skriver att det inte går att ange en särskild hållbarhetstid för fryst mat. Därför har många sidor bara temperaturen
// som siffra, och tiderna står bara där en källa anger dem (Svenskt Kött för kött). Inga egna råd.
// Undvik ord som kylskåp, rester, plan, vecka, meny, laga, steg, köp, spara, recept, hitta i h2: scripts/app-bevis.mjs kopplar dem till appkort.

const HOLD = '/sv/hallbarhet/';
const FRYS = '/sv/frysa/';
const INNER = '/sv/innertemperatur/';
const H = (slug, text) => [`${HOLD}${slug}/`, text];
const F = (slug, text) => [`${FRYS}${slug}/`, text];

const FRYSEN = (h) => `${h.k('frysa')} skriver att en lagom temperatur i frysen är ${h.t('fryser')}.`;
const KOLONNER = ['Vad', 'Siffra'];
const INGEN = (h) => `Källan skriver också: ${h.s('inget')}`;

export const TEKST = {
  kjott: (h) => ({
    ord: 'kött i frysen',
    title: 'Hur länge kan man ha kött i frysen?',
    h1: 'Hur länge kan man ha kött i frysen?',
    description: `Svenskt Kött (2023) anger för frysen vid ${h.t('fryser')}: griskött ${h.t('gris-feta')} till ${h.t('gris-magra')}, nötkött ${h.t('not')}, lammkött ${h.t('lamm')}, chark ${h.t('chark')}.`,
    lead: `Svenskt Kött anger olika tider för olika kött, vid ${h.t('fryser')}. Källan skriver att kött håller sig upp till ${h.t('ar')} i frysen, beroende på djurslag och styckningsdel.`,
    kilder: [
      h.s('ar'),
      `Om vad som händer: ${h.s('harskna')} ${h.s('harsket')}`,
      `Om fett: ${h.s('fett')}`,
      h.s('viltkott'),
      `Om infrysningen: ${h.s('snabbt')} ${h.s('paket')}`,
      h.s('datum'),
      `Om att tina: ${h.s('tina')} ${h.s('kylen')}`,
      INGEN(h),
    ],
    tabell: { tittel: 'Tider i frysen enligt Svenskt Kött', kilde: 'skforvara', intro: `${h.k('skforvara')} anger de här tiderna vid ${h.t('fryser')}:`, kolonner: ['Kött', 'Tid i frysen'], rader: [['Griskött, feta delar', 'gris-feta'], ['Griskött, magra delar', 'gris-magra'], ['Nötkött', 'not'], ['Lammkött, beroende på fetthalt', 'lamm'], ['Innanmat', 'innanmat'], ['Charkuterier', 'chark']] },
    faq: [
      ['Hur länge håller griskött i frysen?', `${h.k('skforvara')} anger ${h.t('gris-feta')} för feta delar och ${h.t('gris-magra')} för magra delar.`],
      ['Hur länge håller nötkött i frysen?', `${h.k('skforvara')} anger ${h.t('not')}.`],
      ['Är det farligt att äta kött som legat länge i frysen?', `${h.s('harsket')}`],
    ],
    soster: H('kjott', 'Hur länge håller kött och köttfärs i kylen?'),
    andre: [F('kottfars', 'Kan man frysa köttfärs?'), F('fisk', 'Kan man frysa fisk?')],
  }),

  kottfars: (h) => ({
    ord: 'köttfärs',
    title: 'Kan man frysa köttfärs?',
    h1: 'Kan man frysa köttfärs?',
    description: `Ja. Livsmedelsverket (2026) skriver att köttfärs går bra att frysa, i lufttät förpackning och märkt med datum. Köttfärs ska nå ${h.t('fars')} innertemperatur när den stekts.`,
    lead: `Ja. ${h.s('bra')}`,
    kilder: [
      `Om fettet: ${h.s('harskna')}`,
      h.s('portion'),
      `Svenskt Kött skriver: ${h.s('platta')}`,
      h.s('plast'),
      h.s('syre'),
      `Om att tina: ${h.s('tina')} ${h.s('vatten')}`,
      `Om bakterierna: ${h.s('vaknar')}`,
    ],
    tabell: { tittel: 'Siffrorna i källorna', kilde: 'kottfars', intro: `${h.k('kottfars')} och ${h.k('frysa')} anger de här siffrorna:`, kolonner: KOLONNER, rader: [['Temperatur i frysen', 'fryser'], ['Innertemperatur när köttfärs är genomstekt', 'fars']] },
    faq: [
      ['Hur tinar man köttfärs?', `${h.s('tina')}`],
      ['Behöver köttfärs genomstekas?', `${h.s('genomstek')} Se <a href="${INNER}kottfars/">Innertemperatur köttfärs</a>.`],
    ],
    soster: H('kjott', 'Hur länge håller kött och köttfärs i kylen?'),
    andre: [F('kott', 'Hur länge kan man ha kött i frysen?'), F('frysa-om', 'Kan man frysa om mat som har tinat?')],
  }),

  'frysa-om': (h) => ({
    ord: 'att frysa om mat',
    title: 'Kan man frysa om mat som har tinat?',
    h1: 'Kan man frysa om mat som har tinat?',
    description: `Ja, i flera fall. Livsmedelsverket skriver att tinad och tillagad mat går att frysa in igen, och tinad mat som inte tillagats om den tinats i kylskåp. Frysen ska hålla ${h.t('fryser')}.`,
    lead: `Livsmedelsverket skiljer på tre fall. ${h.s('tillagat')}`,
    kilder: [
      `Om mat som inte tillagats: ${h.s('otillagat')}`,
      `Om halvtinad mat: ${h.s('halv')}`,
      h.s('helt'),
      `Om att tina: ${h.s('tinakyl')} ${h.s('kallt')}`,
      h.s('mikron'),
      h.s('bakterier'),
      h.s('sinnen'),
    ],
    tabell: { tittel: 'Tre fall enligt Livsmedelsverket', kilde: 'frysa', intro: `${h.k('frysa')} skriver, med frysen vid ${h.t('fryser')}:`, kolonner: ['Maten', 'Kan frysas in igen?'], rader: [['Tinad och tillagad', { tekst: 'Ja' }], ['Tinad i kylskåp, inte tillagad', { tekst: 'Ja, men den blir torrare' }], ['Halvtinad, med iskristaller kvar', { tekst: 'Ja, enligt källan om elavbrott' }]] },
    faq: [
      ['Kan man frysa kött som har tinat?', `${h.s('otillagat')}`],
      ['Kan man frysa in halvtinad mat?', `${h.s('halv')}`],
    ],
    soster: H('elavbrott', 'Hur länge håller maten i kylen vid strömavbrott?'),
    andre: [F('matrester', 'Kan man frysa matrester?'), F('kott', 'Hur länge kan man ha kött i frysen?')],
  }),

  'frukt-og-gronnsaker': (h) => ({
    ord: 'frukt, bär och grönsaker',
    title: 'Kan man frysa frukt, bär och grönsaker?',
    h1: 'Kan man frysa frukt, bär och grönsaker?',
    description: `Ja. Enligt Livsmedelsverket (2026) håller bär, frukter och grönsaker ${h.t('ar')} eller mer i frysen. Frukt ska delas i mindre bitar och grönsaker förvällas först.`,
    lead: `Ja. ${h.s('ar')}`,
    kilder: [
      h.s('delas'),
      `Om grönsaker: ${h.s('forvall')}`,
      h.s('farlig'),
      h.s('blek'),
      h.s('skonhet'),
    ],
    tabell: { tittel: 'Tiden i frysen', kilde: 'forvara', intro: `${h.k('forvara')} anger den här tiden:`, kolonner: ['Vad', 'Tid'], rader: [['Bär, frukter och grönsaker', { tekst: `${h.t('ar')} eller mer` }]], etter: [FRYSEN(h)] },
    faq: [
      ['Måste man förvälla grönsaker innan man fryser dem?', `${h.s('forvall')}`],
      ['Blir frukt farlig av att ligga länge i frysen?', `${h.s('farlig')}`],
    ],
    soster: H('frukt-och-gront', 'Hur ska frukt och grönsaker förvaras?'),
    andre: [F('gurka-och-sallad', 'Kan man frysa gurka och sallad?')],
  }),

  'gurka-og-salat': (h) => ({
    ord: 'gurka och sallad',
    title: 'Kan man frysa gurka och sallad?',
    h1: 'Kan man frysa gurka och sallad?',
    description: `${h.k('frysa')} skriver att vissa bladgrönsaker och gurka får sin konsistens förstörd av frysning. Frysen ska hålla ${h.t('fryser')}.`,
    lead: `Livsmedelsverket skriver: ${h.s('sallad')}`,
    kilder: [
      `Om fryst mat i allmänhet: ${h.s('nastan')}`,
      h.s('inte'),
      `Om sallad som tappat spänsten: ${h.s('spaken')}`,
      h.s('omogen'),
      h.s('gryta'),
    ],
    tabell: { tittel: 'Källans besked', kilde: 'frysa', intro: `${h.k('frysa')} skriver, med frysen vid ${h.t('fryser')}:`, kolonner: ['Vara', 'Efter frysning'], rader: [['Gurka', { tekst: 'Konsistensen förstörs' }], ['Vissa bladgrönsaker', { tekst: 'Konsistensen förstörs' }]], etter: ['Källan anger inga tider för de här varorna.'] },
    faq: [
      ['Kan man frysa gurka?', `${h.s('sallad')}`],
      ['Är frusen sallad farlig att äta?', `${h.s('inte')}`],
    ],
    soster: F('frukt-och-gront', 'Kan man frysa frukt, bär och grönsaker?'),
    andre: [H('frukt-och-gront', 'Hur ska frukt och grönsaker förvaras?')],
  }),

  'melk-og-fil': (h) => ({
    ord: 'mjölk, grädde och fil',
    title: 'Kan man frysa mjölk, grädde och fil?',
    h1: 'Kan man frysa mjölk, grädde och fil?',
    description: `Mjölk och grädde kan frysas in, skriver Livsmedelsverket. Fil, yoghurt, majonnäs och crème fraiche skär sig. Lagom temperatur i frysen är ${h.t('fryser')}.`,
    lead: `Det beror på produkten. ${h.s('mjolk')}`,
    kilder: [
      h.s('gradde'),
      `Om fil och yoghurt: ${h.s('skarsig')} ${h.s('skar')}`,
      `Om ost: ${h.s('ost')}`,
      `Om att bedöma: ${h.s('lukta')}`,
    ],
    tabell: { tittel: 'Källans besked', kilde: 'forvara', intro: `${h.k('forvara')} och ${h.k('frysa')} skriver, med frysen vid ${h.t('fryser')}:`, kolonner: ['Vara', 'Efter frysning'], rader: [['Mjölk', { tekst: 'Kan frysas in' }], ['Grädde', { tekst: 'Svår att vispa, men går att laga med' }], ['Fil, yoghurt, crème fraiche', { tekst: 'Skär sig' }]], etter: ['Källorna anger inga tider för mejeriprodukter.'] },
    faq: [
      ['Kan man frysa grädde?', `${h.s('gradde')}`],
      ['Kan man frysa yoghurt?', `${h.s('skarsig')} ${h.s('skar')}`],
    ],
    soster: F('ost', 'Kan man frysa ost?'),
    andre: [F('agg', 'Kan man frysa ägg?')],
  }),

  ost: (h) => ({
    ord: 'ost',
    title: 'Kan man frysa ost?',
    h1: 'Kan man frysa ost?',
    description: `Ja. Livsmedelsverket (2026) skriver att ost går bra att frysa in, men att den blir lite smulig. Riv den gärna först, och frys vid ${h.t('fryser')}.`,
    lead: `Ja. ${h.s('frys')}`,
    kilder: [
      h.s('riv'),
      h.s('kanter'),
      `Om vilka ostar: ${h.s('skilja')}`,
      h.s('smalt'),
    ],
    tabell: { tittel: 'Siffrorna i källorna', kilde: 'ost', intro: `${h.k('ost')} och ${h.k('frysa')} anger de här siffrorna:`, kolonner: KOLONNER, rader: [['Temperatur i frysen', 'fryser'], ['Temperatur i kylen', 'kyl']], etter: ['Källorna anger ingen tid för ost i frysen.'] },
    faq: [
      ['Blir osten sämre av att frysas?', `${h.s('frys')}`],
      ['Hur använder man frusen ost?', `${h.s('riv')}`],
    ],
    soster: H('hardost', 'Hur länge håller hårdost i kylen?'),
    andre: [F('mjolk-och-fil', 'Kan man frysa mjölk, grädde och fil?')],
  }),

  egg: (h) => ({
    ord: 'ägg',
    title: 'Kan man frysa ägg?',
    h1: 'Kan man frysa ägg?',
    description: `Ja, men inte med skalet på. Livsmedelsverket (2026) skriver att äggvitor och äggulor som blir över går bra att frysa in, vid ${h.t('fryser')}.`,
    lead: `Ja, men inte i skalet. ${h.s('skal')}`,
    kilder: [
      h.s('vitor'),
      h.s('svinn'),
      `Om skälet: Livsmedelsverket (2026) skriver att ${h.s('expanderar')}`,
      `Om datumet på kartongen: ${h.s('datum')}`,
    ],
    tabell: { tittel: 'Källans besked', kilde: 'agg', intro: `${h.k('agg')} skriver, med frysen vid ${h.t('fryser')}:`, kolonner: ['Ägg', 'Kan frysas?'], rader: [['Äggvitor och äggulor som blivit över', { tekst: 'Ja' }], ['Ägg med skal', { tekst: 'Nej' }]], etter: ['Källan anger ingen tid för ägg i frysen.'] },
    faq: [
      ['Kan man frysa äggvita?', `${h.s('vitor')}`],
      ['Varför kan man inte frysa ägg i skalet?', `${h.s('skal')}`],
    ],
    soster: H('egg', 'Hur länge håller ägg i kylen?'),
    andre: [F('mjolk-och-fil', 'Kan man frysa mjölk, grädde och fil?')],
  }),

  brod: (h) => ({
    ord: 'bröd',
    title: 'Kan man frysa bröd?',
    h1: 'Kan man frysa bröd?',
    description: `Ja. Livsmedelsverket (2026) skriver att bröd går bra att frysa, gärna skivat. Mjukt bröd möglar ofta efter ungefär ${h.t('mogel')}. Frysen ska hålla ${h.t('fryser')}.`,
    lead: `Ja. ${h.s('frys')}`,
    kilder: [
      h.s('mjukt'),
      h.s('delaupp'),
      `Om kylen: ${h.s('kylen')}`,
      `Om hårt bröd: ${h.s('hart')}`,
      `Om mögel: ${h.s('mogligt')}`,
    ],
    tabell: { tittel: 'Siffrorna i källorna', kilde: 'brod', intro: `${h.k('brod')} och ${h.k('frysa')} anger de här siffrorna:`, kolonner: KOLONNER, rader: [['Temperatur i frysen', 'fryser'], ['Mjukt bröd, tills det ofta möglar', 'mogel']], etter: ['Källorna anger ingen tid för bröd i frysen.'] },
    faq: [
      ['Ska man skiva bröd innan man fryser det?', `${h.s('frys')}`],
      ['Kan man frysa mjukt bröd?', `${h.s('mjukt')}`],
    ],
    soster: H('brod', 'Hur länge håller bröd?'),
    andre: [F('matrester', 'Kan man frysa matrester?')],
  }),

  middagsrester: (h) => ({
    ord: 'matrester',
    title: 'Kan man frysa matrester?',
    h1: 'Kan man frysa matrester och matlådor?',
    description: `Ja. Livsmedelsverket (2026) skriver att nästan all mat passar bra att frysa in, vid ${h.t('fryser')} eller lägre. Maten ska svalna först.`,
    lead: `Ja, nästan all mat. ${h.s('lange')}`,
    kilder: [
      `Om fett: ${h.s('harskna')} ${h.s('haersk')}`,
      `Om infrysningen: ${h.s('snabb')}`,
      h.s('portion'),
      `Om att märka: ${h.s('marka')}`,
      INGEN(h),
      h.s('sinnen'),
    ],
    tabell: { tittel: 'Siffrorna i källorna', kilde: 'matlada', intro: `${h.k('matlada')} och ${h.k('avsvalning')} anger de här siffrorna:`, kolonner: KOLONNER, rader: [['Temperatur i frysen', 'fryser'], ['Mängd varm mat som ska svalna först', 'halv']] },
    faq: [
      ['Kan man frysa maten när den fortfarande är varm?', `${h.s('portion')}`],
      ['Hur länge håller mat i frysen?', `${h.s('inget')}`],
    ],
    soster: H('rester', 'Hur länge håller matrester i kylen?'),
    andre: [F('frysa-om', 'Kan man frysa om mat som har tinat?'), F('fisk', 'Kan man frysa fisk?')],
  }),

  fisk: (h) => ({
    ord: 'fisk',
    title: 'Kan man frysa fisk?',
    h1: 'Kan man frysa fisk?',
    description: `Ja. ${h.k('frysa')} skriver att kött och fisk med hög fetthalt, som lax, har kortare hållbarhet än magra som torsk. Frysen ska hålla ${h.t('fryser')}.`,
    lead: `Ja. ${h.s('fett')}`,
    kilder: [
      h.s('harskna'),
      h.s('inte'),
      `Om förpackning: ${h.s('inpack')} ${h.s('luft')}`,
      h.s('inga'),
      `Om parasiter: ${h.s('parasiter')}`,
      INGEN(h),
    ],
    tabell: { tittel: 'Källans besked', kilde: 'frysa', intro: `${h.k('frysa')} skriver, med frysen vid ${h.t('fryser')}:`, kolonner: ['Fisk', 'Hållbarhet i frysen'], rader: [['Fet fisk, till exempel lax', { tekst: 'Generellt kortare' }], ['Mager fisk, till exempel torsk', { tekst: 'Generellt längre' }]], etter: ['Källan anger ingen tid i antal månader för fisk.'] },
    faq: [
      ['Hur länge håller lax i frysen?', `${h.s('inget')} ${h.s('fett')}`],
      ['Dör parasiter i fisk av att frysas?', `${h.s('parasiter')}`],
    ],
    soster: F('kott', 'Hur länge kan man ha kött i frysen?'),
    andre: [F('matrester', 'Kan man frysa matrester?')],
  }),
};

const OVERSIKT = {
  kjott: ['Nötkött, tid i frysen', 'not'],
  kottfars: ['Köttfärs, innertemperatur när den stekts', 'fars'],
  'frysa-om': ['Temperatur i frysen', 'fryser'],
  'frukt-og-gronnsaker': ['Bär, frukter och grönsaker, tid i frysen', 'ar'],
  'gurka-og-salat': ['Temperatur i frysen', 'fryser'],
  'melk-og-fil': ['Temperatur i frysen', 'fryser'],
  ost: ['Temperatur i frysen', 'fryser'],
  egg: ['Temperatur i frysen', 'fryser'],
  brod: ['Mjukt bröd, tills det ofta möglar', 'mogel'],
  middagsrester: ['Temperatur i frysen', 'fryser'],
  fisk: ['Temperatur i frysen', 'fryser'],
};

export function nav({ data, rader, sti, h, p, esc }) {
  const kott = h(rader.find((r) => r.id === 'kjott'));
  const rester = h(rader.find((r) => r.id === 'middagsrester'));
  const radene = rader.map((r) => {
    const x = h(r);
    const [etikett, felt] = OVERSIKT[r.id];
    const kilde = r.tall[felt]?.kilde ?? r.tall[`${felt}-min`].kilde;
    return `<tr><td><a href="${sti(r)}">${esc(r.navn)}</a></td><td>${esc(etikett)}</td><td>${x.t(felt)}</td><td>${x.k(kilde)}</td></tr>`;
  }).join('');
  return {
    title: 'Kan man frysa det? Hur länge håller maten i frysen',
    h1: 'Kan man frysa det? Hur länge håller maten i frysen?',
    description: 'Kan man frysa köttfärs, ost, ägg, bröd, matrester och mer? Svar från Livsmedelsverket och Svenskt Kött, med källa på varje siffra. Vi skriver bara det källorna säger.',
    lead: `Livsmedelsverket skriver att det inte går att ange en särskild hållbarhetstid för fryst mat. Svenskt Kött anger tider för kött. Frysen ska hålla ${rester.t('fryser')}.`,
    rik: [
      `<h2>Det här säger källorna</h2>${p([
        `${rester.k('frysa')} skriver att en lagom temperatur i frysen är ${rester.t('fryser')}.`,
        rester.s('inget'),
        `${kott.k('skforvara')} anger för nötkött ${kott.t('not')} i frysen.`,
      ])}`,
      `<h2>Svar för varje vara</h2><p>Välj en vara för hela svaret, reglerna bakom det och källorna. Källan står i sista kolumnen.</p><div class="table-wrap" tabindex="0" role="region" aria-label="Frysning"><table class="sprik"><thead><tr><th scope="col">Vara</th><th scope="col">Vad</th><th scope="col">Siffra</th><th scope="col">Källa</th></tr></thead><tbody>${radene}</tbody></table></div>`,
      '<h2>Varor som inte finns här</h2><p>Vi anger bara en siffra när vi har hittat den på en svensk källsida. Livsmedelsverket anger inga tider för fryst mat, så sidorna för mat utanför kött visar bara temperaturen och vad källan säger om att frysa varan. Kyckling har ingen egen sida här.</p>',
      '<div class="related"><h2>Läs också</h2><ul><li><a href="/sv/hallbarhet/">Hur länge håller maten i kylen?</a></li><li><a href="/sv/innertemperatur/">Innertemperatur för kött och fågel</a></li></ul></div>',
    ].join('\n'),
    faqTittel: 'Frågor om att frysa mat',
    faq: [
      ['Hur länge håller mat i frysen?', `${rester.s('inget')}`],
      ['Vilken temperatur ska frysen ha?', `${rester.k('frysa')} skriver att en lagom temperatur i frysen är ${rester.t('fryser')}.`],
    ],
  };
}

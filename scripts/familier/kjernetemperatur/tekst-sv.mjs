// Text för familjen «kjernetemperatur» (sv): innertemperatur för kött och fågel. Varje mening återger vad en namngiven källa säger.
// Siffror skrivs aldrig här: h.t(fält) läser dem ur data.sv.json, och h.s(id) ger en hel mening ur källan, ordagrant.
// Källor: Svensk Fågel (kyckling, kalkon), Svenskt Kött (kött), Livsmedelsverket (kyckling, köttfärs). Siffrorna är svenska och inte översatta från norska:
// de skiljer sig från de norska, till exempel för kyckling. Fisk saknar en svensk källa med siffra och finns därför inte med. Inga egna råd.
// Undvik ord som laga, steg, ugn, timer, plan, vecka, meny, köp, spara, recept, hitta i h2: scripts/app-bevis.mjs kopplar dem till appkort.

const HOLD = '/sv/hallbarhet/';
const FRYS = '/sv/frysa/';
const INNER = '/sv/innertemperatur/';
const I = (slug, text) => [`${INNER}${slug}/`, text];

export const TEKST = {
  kylling: (h) => ({
    ord: 'kyckling',
    title: 'Innertemperatur kyckling: hel kyckling och filé',
    h1: 'Innertemperatur kyckling',
    description: `Svensk Fågel (2024): ${h.t('hel')} intill benet för hel kyckling och ${h.t('filet')} för kycklingfilé och lårfilé. Så säger källan, med Livsmedelsverkets råd om genomstekning.`,
    lead: `Svensk Fågel anger ${h.t('hel')} intill benet för hel kyckling och ${h.t('filet')} för kycklingfilé och kycklinglårfilé. Alla bakterier, även campylobacter, dör vid minst ${h.t('lag')}.`,
    kilder: [
      `Om att mäta: ${h.s('termometer')}`,
      `Om hur den ska se ut: ${h.s('rosa')}`,
      `Om köttsaften: ${h.s('saft')}`,
      `Om bakterien: ${h.s('genomstek')}`,
      h.s('fa'),
      h.s('farsk'),
      h.s('skolj'),
      h.s('hander'),
    ],
    tabell: { tittel: 'Innertemperatur enligt Svensk Fågel', kilde: 'sfdelar', intro: `${h.k('sfdelar')} anger de här temperaturerna:`, kolonner: ['Del', 'Innertemperatur'], rader: [['Hel kyckling, ben, lår och klubba', 'delar'], ['Bröstfilé och lårfilé', 'brost']], etter: [`${h.k('sfsakra')} anger att alla bakterier dör vid minst ${h.t('lag')}.`] },
    faq: [
      ['Vilken innertemperatur ska kyckling ha?', `${h.k('sfsakra')} anger ${h.t('hel')} intill benet för hel kyckling och ${h.t('filet')} för filé och lårfilé.`],
      ['Hur ser man att kycklingen är klar?', `${h.s('rosa')}`],
      ['Ska man skölja kycklingen?', `${h.s('skolj')}`],
    ],
    soster: I('kalkon', 'Innertemperatur kalkon'),
    andre: [I('vila', 'Vila och eftervärme'), I('kottfars', 'Innertemperatur köttfärs'), ['/sv/tillagningstid/hel-kyckling/', 'Hel kyckling i ugn: hur länge?'], ['/sv/airfryer/kycklingfile/', 'Kycklingfilé i airfryer']],
  }),

  kalkun: (h) => ({
    ord: 'kalkon',
    title: 'Innertemperatur kalkon: när är julkalkonen klar?',
    h1: 'Innertemperatur kalkon',
    description: `Svensk Fågel (2024): kalkonen är klar vid ${h.t('klar')} innertemperatur. Källan föreslår att den tas ut vid ${h.t('ut')} och vilar minst ${h.t('vila')}.`,
    lead: `Enligt ${h.k('sfjul')} är kalkonen klar när saften från lårköttet är genomskinlig och innertemperaturen har nått ${h.t('klar')}.`,
    kilder: [
      h.s('klar'),
      h.s('ut'),
      h.s('vila'),
      `I ett annat recept från Svensk Fågel (2024): ${h.s('lar')}`,
      h.s('folie'),
      `Om att värma: ${h.s('varm')}`,
    ],
    tabell: { tittel: 'Siffrorna i källorna', kilde: 'sfjul', intro: `${h.k('sfjul')} och ${h.k('sfhellberg')} anger de här siffrorna:`, kolonner: ['Vad', 'Siffra'], rader: [['Kalkonen är klar', 'klar'], ['Kan tas ut vid', 'ut'], ['Vila innan den delas, minst', 'vila']], etter: [`Det andra receptet anger också ${h.t('hellberg')} vid lårbenet.`] },
    faq: [
      ['Vilken innertemperatur ska kalkon ha?', `${h.k('sfjul')} anger ${h.t('klar')}.`],
      ['Hur länge ska kalkonen vila?', `${h.s('vila')}`],
    ],
    soster: I('kyckling', 'Innertemperatur kyckling'),
    andre: [I('vila', 'Vila och eftervärme'), ['/sv/tillagningstid/kalkon/', 'Hur länge ska kalkonen vara i ugnen?']],
  }),

  kjottdeig: (h) => ({
    ord: 'köttfärs',
    title: 'Innertemperatur köttfärs och hamburgare',
    h1: 'Innertemperatur köttfärs och hamburgare',
    description: `Köttfärs ska vara genomstekt, till ${h.t('fars')} innertemperatur, enligt Svenskt Kött (2024) och Livsmedelsverket (2026). Färg räcker inte som tecken.`,
    lead: `Köttfärs ska genomstekas till ${h.t('fars')} innertemperatur, enligt ${h.k('sktemp')}. ${h.k('kottfars')} skriver samma sak och varnar för att färgen kan lura.`,
    kilder: [
      h.s('farg'),
      `Om färs i skyddande atmosfär: Livsmedelsverket (2026) anger att färgen kan se färdig ut redan vid ${h.t('map')}. ${h.s('mapkontroll')}`,
      `Om att mäta: ${h.s('mat')}`,
      h.s('ytor'),
      h.s('smaka'),
      h.s('prov'),
    ],
    tabell: { tittel: 'Siffrorna i källorna', kilde: 'sktemp', intro: `${h.k('sktemp')} och ${h.k('kottfars')} anger de här siffrorna:`, kolonner: ['Vad', 'Siffra'], rader: [['Genomstekt köttfärs', 'fars'], ['Färgen kan se färdig ut redan vid (färs i skyddande atmosfär)', 'map']] },
    faq: [
      ['Vilken innertemperatur ska köttfärs ha?', `${h.k('sktemp')} anger ${h.t('fars')}.`],
      ['Räcker det att titta på färgen?', `${h.s('farg')}`],
      ['Kan man smaka på rå köttfärs?', `${h.s('smaka')}`],
    ],
    soster: [`${HOLD}kott/`, 'Hur länge håller kött och köttfärs i kylen?'],
    andre: [[`${FRYS}kottfars/`, 'Kan man frysa köttfärs?'], I('gris', 'Innertemperatur griskött')],
  }),

  gris: (h) => ({
    ord: 'griskött',
    title: 'Innertemperatur griskött',
    h1: 'Innertemperatur griskött',
    description: `Svenskt Kött (2024) anger ${h.t('genomstekt')} för genomstekt griskött. Vid ${h.t('torrt')} blir köttet torrt och grått. Det här säger källorna.`,
    lead: `Svenskt Kött anger ${h.t('genomstekt')} för genomstekt kött, och det gäller gris, nöt, lamm och färs. Vid ${h.t('torrt')} blir köttet torrt och grått.`,
    kilder: [
      `Om bakterier: ${h.s('yta')}`,
      h.s('helt'),
      `Svenskt Kött (2023) skriver att de allra flesta bakterier som kan göra oss sjuka dör vid ${h.t('bakterier')}.`,
      `Om trikiner: Svenskt Kött (2023) skriver att trikiner dör vid upphettning till mer än ${h.t('trikin')}. ${h.s('trikin')}`,
      h.s('torrt'),
      h.s('vila'),
    ],
    tabell: { tittel: 'Siffrorna i källorna', kilde: 'sktemp', intro: `${h.k('sktemp')} och ${h.k('skhygien')} anger de här siffrorna:`, kolonner: ['Vad', 'Siffra'], rader: [['Genomstekt griskött', 'genomstekt'], ['De flesta sjukdomsframkallande bakterier dör vid', 'bakterier'], ['Trikiner dör vid mer än', 'trikin'], ['Köttet blir torrt och grått vid', 'torrt']] },
    faq: [
      ['Vilken innertemperatur ska griskött ha?', `${h.k('sktemp')} anger ${h.t('genomstekt')} för genomstekt kött.`],
      ['När blir fläskkött torrt?', `${h.s('torrt')}`],
    ],
    soster: I('notkott-och-lamm', 'Innertemperatur nötkött och lamm'),
    andre: [I('kottfars', 'Innertemperatur köttfärs'), I('vila', 'Vila och eftervärme')],
  }),

  'not-og-lamm': (h) => ({
    ord: 'nötkött och lamm',
    title: 'Innertemperatur nötkött och lamm: rare, medium, well done',
    h1: 'Innertemperatur nötkött och lamm',
    description: `Svenskt Kött (2024) anger för nöt och lamm: rare ${h.t('rare')}, medium rare ${h.t('mrare')}, medium ${h.t('medium')} och genomstekt ${h.t('genomstekt')}.`,
    lead: `För omalet nötkött och lamm anger ${h.k('sktemp')} fyra grader: rare ${h.t('rare')}, medium rare ${h.t('mrare')}, medium ${h.t('medium')} och genomstekt ${h.t('genomstekt')}.`,
    kilder: [
      h.s('omalet'),
      h.s('yta'),
      `Om ehec: ${h.s('ehec')}`,
      h.s('rosa'),
      h.s('digital'),
      `Om termometern: ${h.s('tjockaste')}`,
      h.s('sida'),
      h.s('rumsvarmt'),
    ],
    tabell: { tittel: 'Innertemperatur enligt Svenskt Kött', kilde: 'sktemp', intro: `${h.k('sktemp')} anger de här temperaturerna för omalet nötkött och lamm:`, kolonner: ['Stekgrad', 'Innertemperatur'], rader: [['Rare, blodigt', 'rare'], ['Medium rare', 'mrare'], ['Medium', 'medium'], ['Well done, genomstekt', 'genomstekt']] },
    faq: [
      ['Vilken innertemperatur ska nötkött ha för medium?', `${h.k('sktemp')} anger ${h.t('medium')}.`],
      ['Vilken innertemperatur ska lamm ha?', `${h.k('sktemp')} anger samma temperaturer för lamm som för nötkött: rare ${h.t('rare')}, medium ${h.t('medium')} och genomstekt ${h.t('genomstekt')}.`],
      ['Kan man äta rosastekt kött?', `${h.s('rosa')}`],
    ],
    soster: I('gris', 'Innertemperatur griskött'),
    andre: [I('vila', 'Vila och eftervärme'), I('kottfars', 'Innertemperatur köttfärs')],
  }),

  vila: (h) => ({
    ord: 'vila och eftervärme',
    title: 'Hur länge ska köttet vila, och hur mycket stiger temperaturen?',
    h1: 'Hur länge ska köttet vila?',
    description: `Svenskt Kött (2023): mindre bitar vilar ${h.t('vilasma')} och stora bitar ${h.t('vilastora')}. Innertemperaturen stiger ${h.t('sma')} på små och ${h.t('stora')} på stora bitar.`,
    lead: `Enligt ${h.k('skhantera')} stiger innertemperaturen några grader medan köttet vilar. Därför bör man dra av ${h.t('sma')} på mindre bitar och ${h.t('stora')} på större köttbitar.`,
    kilder: [
      h.s('stiger'),
      h.s('saft'),
      h.s('folie'),
      `Om kalkon: ${h.s('kalkon')}`,
    ],
    tabell: { tittel: 'Siffrorna i källorna', kilde: 'skhantera', intro: `${h.k('skhantera')} och ${h.k('sfjul')} anger de här siffrorna:`, kolonner: ['Vad', 'Siffra'], rader: [['Dra av på mindre bitar, grader', 'sma'], ['Dra av på större bitar, grader', 'stora'], ['Vila för skivor och mindre bitar', 'vilasma'], ['Vila för stora bitar, som stek och rostbiff', 'vilastora'], ['Vila för hel kalkon, minst', 'kalkon']] },
    faq: [
      ['Hur länge ska en stek vila?', `${h.k('skhantera')} anger ${h.t('vilastora')} för hela stora bitar.`],
      ['Hur länge ska kalkon vila?', `${h.s('kalkon')}`],
    ],
    soster: I('notkott-och-lamm', 'Innertemperatur nötkött och lamm'),
    andre: [I('kalkon', 'Innertemperatur kalkon'), I('gris', 'Innertemperatur griskött')],
  }),
};

const OVERSIKT = {
  kylling: ['Hel kyckling, intill benet', 'hel'],
  kalkun: ['Kalkonen är klar', 'klar'],
  kjottdeig: ['Genomstekt köttfärs', 'fars'],
  gris: ['Genomstekt griskött', 'genomstekt'],
  'not-og-lamm': ['Medium', 'medium'],
  vila: ['Vila för stora bitar', 'vilastora'],
};

export function nav({ data, rader, sti, h, p, esc }) {
  const kyl = h(rader.find((r) => r.id === 'kylling'));
  const fars = h(rader.find((r) => r.id === 'kjottdeig'));
  const radene = rader.map((r) => {
    const x = h(r);
    const [etikett, felt] = OVERSIKT[r.id];
    const kilde = r.tall[felt]?.kilde ?? r.tall[`${felt}-min`].kilde;
    return `<tr><td><a href="${sti(r)}">${esc(r.navn)}</a></td><td>${esc(etikett)}</td><td>${x.t(felt)}</td><td>${x.k(kilde)}</td></tr>`;
  }).join('');
  return {
    title: 'Innertemperatur för kött och fågel, med källor',
    h1: 'Innertemperatur för kött och fågel',
    description: 'Innertemperatur för kyckling, kalkon, köttfärs, griskött, nötkött och lamm. Siffror från Svensk Fågel, Svenskt Kött och Livsmedelsverket, med källa på varje siffra.',
    lead: `Siffrorna på de här sidorna kommer från svenska källor. Svensk Fågel anger till exempel ${kyl.t('hel')} för hel kyckling intill benet och ${kyl.t('filet')} för filé. Hittar vi ingen siffra, skriver vi det.`,
    rik: [
      `<h2>Det här säger källorna</h2>${p([
        `${kyl.k('sfsakra')} anger ${kyl.t('hel')} intill benet för hel kyckling och ${kyl.t('filet')} för kycklingfilé och lårfilé.`,
        `${fars.k('sktemp')} anger att köttfärs ska vara genomstekt, till ${fars.t('fars')} innertemperatur.`,
      ])}`,
      `<h2>Siffror för varje sort</h2><p>Välj en sort för alla siffror, reglerna bakom dem och källorna. Källan står i sista kolumnen.</p><div class="table-wrap" tabindex="0" role="region" aria-label="Innertemperatur"><table class="sprik"><thead><tr><th scope="col">Sort</th><th scope="col">Vad</th><th scope="col">Siffra</th><th scope="col">Källa</th></tr></thead><tbody>${radene}</tbody></table></div>`,
      '<h2>Varor som inte finns här</h2><p>Vi anger bara en siffra när vi har hittat den på en svensk källsida. För fisk har vi inte hittat någon siffra hos en svensk myndighet eller branschorganisation, så fisk har ingen egen sida.</p>',
      '<div class="related"><h2>Läs också</h2><ul><li><a href="/sv/hallbarhet/">Hur länge håller maten i kylen?</a></li><li><a href="/sv/frysa/">Kan man frysa det?</a></li><li><a href="/sv/tillagningstid/">Tillagningstider: hur länge ska maten vara i ugnen?</a></li><li><a href="/sv/airfryer/">Airfryer: tid och temperatur</a></li><li><a href="/sv/hur-mycket-per-person/">Hur mycket mat per person?</a></li></ul></div>',
    ].join('\n'),
    faqTittel: 'Frågor om innertemperatur',
    faq: [
      ['Vilken innertemperatur ska kyckling ha?', `${kyl.k('sfsakra')} anger ${kyl.t('hel')} intill benet för hel kyckling och ${kyl.t('filet')} för filé och lårfilé.`],
      ['Vilken innertemperatur ska köttfärs ha?', `${fars.k('sktemp')} anger ${fars.t('fars')}.`],
    ],
  };
}

// Teksten for familien «holdbarhet» (nb). Hver setning gjengir det kilden sier, med kilden nevnt; ingen egne råd.
// Mattilsynet først, MatPrat etterpå med årstall. Tall skrives aldri her: t(felt) henter dem fra data.nb.json.
// Sitatet bak hvert tall står i datafila (merknad), og scripts/familier/holdbarhet/kildekontroll.mjs sjekker det mot kilden.

const POSE = 'I pose, skål eller kartong';
const KJOL = (h) => `Mattilsynet (2026) anbefaler at kjøleskapet holder under ${h.t('mt-kjol')}.`;
// Rådet om datomerking (Mattilsynet: «Holdbarhetsmerking» og «Slik kan du redusere matsvinnet»).
const PAKKEN = (h) => ['Står det noe på pakken, gjelder det', `<p>Følg datoen og rådene på emballasjen, skriver ${h.k('mt-matsvinn')}. Holdbarhetsdatoen gjelder bare når varen er uåpnet og oppbevart riktig, og varer merket «siste forbruksdag» bør du ikke spise etter datoen (${h.kp('mt-merking')}). Står det hvor mange dager varen holder etter åpning, er den ikke trygg etter så mange dager.</p>`];
const SISTE = (h) => `Mat som raskt blir dårlig, merkes «siste forbruksdag», skriver ${h.k('mt-oppbevaring')}. Bakterier vokser lett i kjøtt, melk, fisk og eggprodukter.`;
const HJEMME = (h) => `${h.k('mt-oppbevaring')} skriver at det ikke er mulig å gi én holdbarhetstid for hjemmelaget mat. Det som gjør at maten holder lenger, er rene og friske råvarer, god hygiene, rask nedkjøling, riktig temperatur og tett emballasje.`;
const AVKJOL = (h) => `Mat som er varmebehandlet og skal oppbevares kald, bør kjøles ned fra ${h.t('mt-avkjol-fra')} til ${h.t('mt-avkjol-til')} så raskt som mulig, og senest innen to timer.`;
const TINT = (h) => `Bruk varen samme dag som du tiner den, råder ${h.k('mt-merking')}.`;

export const TEKST = {
  egg: (h) => ({
    ord: 'egg',
    title: 'Hvor lenge holder egg seg i kjøleskapet?',
    h1: 'Hvor lenge holder egg seg i kjøleskapet?',
    description: `Hele, rå egg holder seg ${h.t('hele')} i kjøleskapet, ifølge ${h.k('mp-kjoleskap')}. Med tider for eggeplommer og eggehviter, og hva datoen på kartongen betyr.`,
    lead: `Hold kjøleskapet under ${h.t('mt-kjol')}, sier Mattilsynet. Hele, rå egg holder seg ${h.t('hele')} i kjøleskapet, ifølge ${h.k('mp-kjoleskap')}.`,
    mattilsynet: [
      `Pakkede egg er merket «best før». ${h.k('mt-egg')} skriver at det er norsk sedvane å sette holdbarheten til høyst ${h.t('mt-egg-dato')} etter at egget ble lagt.`,
      `«Best før» er en veiledning om hvor lenge kvaliteten holder seg i uåpnet pakke, og «best før» betyr ofte god etter (${h.kp('mt-merking')}). Bruk sansene: se, lukt og smak.`,
      'Gravide, personer med nedsatt immunforsvar og eldre skjøre personer skal alltid følge kostrådene, skriver Mattilsynet.',
      KJOL(h),
    ],
    tabell: {
      tittel: 'Egg i kjøleskapet', kilde: 'mp-kjoleskap', intro: `${h.k('mp-kjoleskap')} oppgir disse tidene i kjøleskapet:`,
      kolonner: ['Egg', 'Holdbarhet'],
      rader: [['Hele, rå egg', 'hele'], ['Eggeplommer og eggemasse', 'plommer'], ['Eggehviter', 'hviter']],
      etter: [
        `${h.k('mp-egg')} skriver at norske egg er holdbare og trygge langt ut over datoen på kartongen, så lenge de oppbevares kjølig. Spisekvaliteten går likevel ned etter hvert.`,
        `Ha eggene i kartongen. Den beskytter mot støt og mot lukt fra andre matvarer, skriver ${h.k('mp-kjoleskap')}.`,
      ],
    },
    faq: [
      ['Kan man spise egg etter best før-datoen?', `Ja, ifølge ${h.k('mp-egg')} er norske egg trygge langt ut over datoen så lenge de er oppbevart kjølig. Mattilsynet ber deg bruke sansene etter «best før».`],
      ['Hvor lenge holder eggeplommer seg i kjøleskapet?', `${h.t('plommer')}, ifølge ${h.k('mp-kjoleskap')}. Eggehviter holder seg ${h.t('hviter')}.`],
      ['Må egg stå i kjøleskapet?', `${h.k('mp-egg')} skriver at egg holder seg fint i minst en uke på benken hvis du bruker mye egg. Bruker du egg sjelden, bør de stå i kartongen i kjøleskapet.`],
    ],
    soster: ['/frysing/egg/', 'Kan man fryse egg?'],
    andre: [['/holdbarhet/kokte-egg/', 'Hvor lenge holder kokte egg seg?']],
  }),

  'kokte-egg': (h) => ({
    ord: 'kokte egg',
    title: 'Hvor lenge holder kokte egg seg i kjøleskapet?',
    h1: 'Hvor lenge holder kokte egg seg i kjøleskapet?',
    description: `Hardkokte egg holder seg ${h.t('hardkokte')} i kjøleskapet, og eggeretter like lenge, ifølge ${h.k('mp-kjoleskap')}. Med Mattilsynets råd om rask nedkjøling.`,
    lead: `Kjøl ned maten raskt, og hold kjøleskapet under ${h.t('mt-kjol')}, sier Mattilsynet. Hardkokte egg holder seg ${h.t('hardkokte')} i kjøleskapet, ifølge ${h.k('mp-kjoleskap')}.`,
    mattilsynet: [HJEMME(h), AVKJOL(h), KJOL(h)],
    tabell: {
      tittel: 'Kokte egg i kjøleskapet', kilde: 'mp-kjoleskap', intro: `${h.k('mp-kjoleskap')} oppgir disse tidene:`,
      kolonner: ['', POSE, 'Vakuumpakket'],
      rader: [['Hardkokte egg', 'hardkokte', null], ['Eggeretter', 'eggeretter-pose', 'eggeretter-vakuum']],
    },
    faq: [
      ['Kan man fryse kokte egg?', `${h.k('mp-egg')} skriver at egg kan fryses, men ikke i skallet. Se <a href="/frysing/egg/">frysing av egg</a>.`],
      ['Hvor lenge holder eggeretter seg i kjøleskapet?', `${h.t('eggeretter-pose')} i pose, skål eller kartong, og ${h.t('eggeretter-vakuum')} vakuumpakket, ifølge ${h.k('mp-kjoleskap')}.`],
    ],
    soster: ['/frysing/egg/', 'Kan man fryse egg?'],
    andre: [['/holdbarhet/egg/', 'Hvor lenge holder rå egg seg?']],
  }),

  'kokt-ris-og-pasta': (h) => ({
    ord: 'ris og pasta',
    title: 'Hvor lenge holder kokt ris og pasta seg i kjøleskapet?',
    h1: 'Hvor lenge holder kokt ris og pasta seg i kjøleskapet?',
    description: `Kokt ris og pasta holder seg ${h.t('ris')} i kjøleskapet hvis du kjøler den raskt ned, ifølge ${h.k('mp-ris')}. Mattilsynet sier hvorfor den ikke skal stå fremme.`,
    lead: `Ikke la kokt ris og pasta stå i romtemperatur, sier Mattilsynet. Kjøler du maten raskt ned, holder den seg ${h.t('ris')} i kjøleskapet, ifølge ${h.k('mp-ris')}.`,
    mattilsynet: [
      `${h.k('mt-ris')} skriver at du ikke bør oppbevare kokt ris eller kokt pasta i romtemperatur. Når risen står i romtemperatur (over ${h.t('mt-ris-rom')}), kan bakterien Bacillus cereus, som har overlevd kokingen, vokse og lage giftstoffer.`,
      'Giftstoffene er svært stabile. Selv om du koker eller steker risen etterpå, blir de ikke uskadelige.',
      'Det beste er å ikke koke mer ris eller pasta enn du trenger. Vil du ta vare på rester, bør de kjøles ned så raskt som mulig og settes i kjøleskapet.',
      AVKJOL(h),
    ],
    tabell: {
      tittel: 'Ris og pasta i kjøleskapet', kilde: 'mp-ris', intro: `${h.k('mp-ris')} oppgir denne tiden:`,
      kolonner: ['', 'Holdbarhet'],
      rader: [['Kokt ris og pasta, raskt nedkjølt', 'ris']],
    },
    faq: [
      ['Kan jeg lukte på risen for å sjekke om den er god?', `Nei. ${h.k('mt-ris')} skriver at verken bakteriene eller giftstoffene har lukt eller smak, så det hjelper ikke å lukte eller smake på maten.`],
      ['Kan jeg varme opp ris som har stått fremme?', 'Mattilsynet skriver at giftstoffene ikke blir uskadelige selv om du koker eller steker risen etterpå.'],
    ],
    soster: ['/frysing/', 'Hvor lenge kan mat ligge i fryseren?'],
    andre: [['/holdbarhet/rester/', 'Hvor lenge holder rester seg?']],
  }),

  'kjottdeig-og-kylling': (h) => ({
    ord: 'kjøttdeig og kylling',
    title: 'Hvor lenge holder kjøttdeig og kylling seg i kjøleskapet?',
    h1: 'Hvor lenge holder kjøttdeig og kylling seg i kjøleskapet?',
    description: `Kjøttdeig og rå kylling holder seg ${h.t('kjottdeig-pose')} i kjøleskapet og ${h.t('kjottdeig-vakuum')} vakuumpakket, ifølge ${h.k('mp-kjoleskap')}. Datoen på pakken gjelder først.`,
    lead: `Hold kjøleskapet under ${h.t('mt-kjol')}, sier Mattilsynet. Kjøttdeig og rå kylling holder seg ${h.t('kylling-pose')} i kjøleskapet, og ${h.t('kylling-vakuum')} vakuumpakket, ifølge ${h.k('mp-kjoleskap')}.`,
    mattilsynet: [
      SISTE(h),
      'Rått kjøtt kan inneholde smittestoffer. Hold det adskilt fra mat som er kokt eller klar til å spises, og pakk det godt inn så det ikke renner av.',
      `Kjøttdeig og fjærfe bør stekes gjennom (${h.kp('mt-kjokken')}).`,
      KJOL(h),
    ],
    tabell: {
      tittel: 'Kjøttdeig og kylling i kjøleskapet', kilde: 'mp-kjoleskap', intro: `${h.k('mp-kjoleskap')} oppgir disse tidene:`,
      kolonner: ['', POSE, 'Vakuumpakket'],
      rader: [['Kjøttdeig, karbonadedeig og medisterdeig', 'kjottdeig-pose', 'kjottdeig-vakuum'], ['Rå kylling og kalkun', 'kylling-pose', 'kylling-vakuum']],
      etter: [`Legg rått kjøtt, kylling og kjøttdeig nederst i kjøleskapet, der det er kaldest, skriver ${h.k('mp-kjoleskap')}.`],
    },
    ekstra: [PAKKEN(h)],
    faq: [
      ['Hvor lenge holder tint kjøttdeig seg i kjøleskapet?', TINT(h)],
      ['Er kyllingen dårlig hvis pakken lukter vondt?', `Ikke nødvendigvis. ${h.k('mt-kylling')} skriver at gassen i pakken kan lukte ubehagelig når du åpner den, men at lukta skal forsvinne med en gang. Lukter kjøttet fortsatt tydelig og skarpt lenge etter at pakken er åpnet, kan det være surt eller skjemt.`],
    ],
    soster: ['/frysing/kjottdeig-og-kylling/', 'Hvor lenge holder kjøttdeig og kylling i fryseren?'],
    andre: [['/holdbarhet/kjott/', 'Hvor lenge holder kjøtt seg?']],
  }),

  kjott: (h) => ({
    ord: 'kjøtt',
    title: 'Hvor lenge holder kjøtt seg i kjøleskapet?',
    h1: 'Hvor lenge holder kjøtt seg i kjøleskapet?',
    description: `Biff, stek, pølser og spekepølse: hvor lenge kjøttet holder seg i kjøleskapet, i pose og vakuumpakket, ifølge ${h.k('mp-kjoleskap')}. Datoen på pakken gjelder først.`,
    lead: `Hold kjøleskapet under ${h.t('mt-kjol')}, sier Mattilsynet. Biff og koteletter holder seg ${h.t('biff-pose')} i kjøleskapet og ${h.t('biff-vakuum')} vakuumpakket, ifølge ${h.k('mp-kjoleskap')}.`,
    mattilsynet: [
      SISTE(h),
      `Vakuumpakket kjøtt kan lukte litt akkurat når du åpner pakken, uten at det er dårlig (${h.kp('mt-merking')}). Lukta skal forsvinne med en gang, med mindre varen er skjemt (${h.kp('mt-kylling')}).`,
      KJOL(h),
    ],
    tabell: {
      tittel: 'Kjøtt i kjøleskapet', kilde: 'mp-kjoleskap', intro: `${h.k('mp-kjoleskap')} oppgir disse tidene:`,
      kolonner: ['', POSE, 'Vakuumpakket'],
      rader: [
        ['Stek, grytekjøtt og kjøtt til koking', 'stek-pose', 'stek-vakuum'],
        ['Koteletter og biff', 'biff-pose', 'biff-vakuum'],
        ['Lettsaltet og røkt kjøtt', 'lettsaltet-pose', 'lettsaltet-vakuum'],
        ['Røkte pølser', 'polser-pose', 'polser-vakuum'],
        ['Medisterpølser', 'medister-pose', 'medister-vakuum'],
        ['Skåret spekepølse', null, 'speke-skaret-vakuum'],
        ['Hel spekepølse', null, 'speke-hel-vakuum'],
      ],
      etter: [`Industripakket kjøtt bør ligge i originalemballasjen. Kjøtt fra ferskvaredisken bør tas ut av papiret, legges på et fat og dekkes til, skriver ${h.k('mp-kjoleskap')}.`],
    },
    ekstra: [PAKKEN(h)],
    faq: [
      ['Hvor bør kjøttet ligge i kjøleskapet?', `Nederst, der det er kaldest, skriver ${h.k('mp-kjoleskap')}. Der bør også rå fisk, kylling og kjøttdeig ligge.`],
      ['Hvor lenge holder spekepølse seg?', `Vakuumpakket holder hel spekepølse seg ${h.t('speke-hel-vakuum')} og skåret spekepølse ${h.t('speke-skaret-vakuum')}, ifølge ${h.k('mp-kjoleskap')}.`],
    ],
    soster: ['/frysing/kjott/', 'Hvor lenge kan kjøtt ligge i fryseren?'],
    andre: [['/holdbarhet/kjottdeig-og-kylling/', 'Hvor lenge holder kjøttdeig og kylling seg?']],
  }),

  skalldyr: (h) => ({
    ord: 'reker og skalldyr',
    title: 'Hvor lenge holder reker og skalldyr seg i kjøleskapet?',
    h1: 'Hvor lenge holder reker og skalldyr seg i kjøleskapet?',
    description: `Reker og andre skalldyr holder seg ${h.t('skalldyr')} i kjøleskapet, ifølge ${h.k('mp-fisk')}. Datoen på pakken gjelder først.`,
    lead: `Mattilsynet regner skalldyr som lettbedervelig mat. I kjøleskapet holder skalldyr seg bare ${h.t('skalldyr')}, ifølge ${h.k('mp-fisk')}.`,
    mattilsynet: [
      `${h.k('mt-sommer')} nevner fersk fisk og skalldyr som eksempler på lettbedervelig mat, sammen med melk, fløte og ferskt kjøtt.`,
      SISTE(h),
      KJOL(h),
    ],
    tabell: {
      tittel: 'Skalldyr i kjøleskapet', kilde: 'mp-fisk', intro: `${h.k('mp-fisk')} oppgir denne tiden ved vanlig kjøleskapstemperatur:`,
      kolonner: ['', 'Holdbarhet'],
      rader: [['Skalldyr', 'skalldyr']],
      etter: [`${h.k('mp-fisk')} skriver også at friske skalldyr bør varmebehandles så raskt som mulig.`],
    },
    ekstra: [PAKKEN(h)],
    faq: [['Hvor lenge holder tinte reker seg i kjøleskapet?', TINT(h)]],
    soster: ['/frysing/skalldyr/', 'Kan man fryse reker og skalldyr?'],
  }),

  rester: (h) => ({
    ord: 'rester',
    title: 'Hvor lenge holder rester seg i kjøleskapet?',
    h1: 'Hvor lenge holder rester seg i kjøleskapet?',
    description: `Mattilsynet sier at restemat holder seg ${h.t('rester')} i kjøleskapet. Slik kjøler du ned maten raskt nok, og når du bør fryse den i stedet.`,
    lead: `Restemat holder seg ${h.t('rester')} i kjøleskapet, sier Mattilsynet. Bruk sansene før du spiser den.`,
    mattilsynet: [
      `${h.k('mt-oppbevaring')} skriver at restemat holder seg i kjøleskapet i ${h.t('rester')}. Skal du ikke spise maten med det første, bør du fryse den med en gang.`,
      HJEMME(h),
      AVKJOL(h),
      'Del maten i mindre porsjoner når den skal kjøles ned, eller sett gryta i kaldt vann og rør rundt uten lokk. Ikke sett på lokk eller pakk inn maten mens den kjøles ned, for da slipper ikke varmen ut.',
      'Pakk inn restene eller legg dem i bokser med lokk, så de ikke smitter over på annen mat, tar smak eller tørker ut.',
      KJOL(h),
    ],
    tabell: {
      tittel: 'Rester i kjøleskapet', kilde: 'mt-oppbevaring', intro: `${h.k('mt-oppbevaring')} oppgir denne tiden:`,
      kolonner: ['', 'Holdbarhet'],
      rader: [['Restemat', 'rester']],
      etter: [`${h.k('mp-kjoleskap')} oppgir en lengre tid for middagsrester. Den bruker vi ikke, fordi den strider mot Mattilsynet.`],
    },
    faq: [
      ['Hvor lenge kan mat stå ute?', `${h.k('mt-oppbevaring')} skriver at mat bør kjøles ned og settes i kjøleskapet innen cirka to timer, enten det er rester, takeaway eller mat du nettopp har kjøpt.`],
      ['Kan jeg fryse restene?', 'Ja. Mattilsynet skriver at du bør fryse maten med en gang hvis du ikke skal spise den med det første. Se <a href="/frysing/middagsrester/">frysing av middagsrester</a>.'],
    ],
    soster: ['/frysing/middagsrester/', 'Kan man fryse middagsrester, gryter og suppe?'],
    andre: [['/holdbarhet/kokt-ris-og-pasta/', 'Hvor lenge holder kokt ris og pasta seg?']],
  }),
};

// Raden på samlesiden for hver vare: [etikett, felt i pose, felt vakuumpakket (eller null)].
const OVERSIKT = {
  egg: [['Hele, rå egg', 'hele', null], ['Eggeplommer', 'plommer', null], ['Eggehviter', 'hviter', null]],
  'kokte-egg': [['Hardkokte egg', 'hardkokte', null], ['Eggeretter', 'eggeretter-pose', 'eggeretter-vakuum']],
  'kokt-ris-og-pasta': [['Kokt ris og pasta', 'ris', null]],
  'kjottdeig-og-kylling': [['Kjøttdeig', 'kjottdeig-pose', 'kjottdeig-vakuum'], ['Rå kylling', 'kylling-pose', 'kylling-vakuum']],
  kjott: [['Biff og koteletter', 'biff-pose', 'biff-vakuum'], ['Stek og grytekjøtt', 'stek-pose', 'stek-vakuum'], ['Røkte pølser', 'polser-pose', 'polser-vakuum']],
  skalldyr: [['Reker og skalldyr', 'skalldyr', null]],
  rester: [['Restemat', 'rester', null]],
};

export function nav({ data, rader, sti, h, tabell, p, esc }) {
  const forste = h(rader[0]);
  const rester = rader.find((r) => r.id === 'rester');
  const radene = rader.flatMap((r) => {
    const x = h(r);
    return (OVERSIKT[r.id] ?? []).map(([etikett, pose, vakuum]) => `<tr><td><a href="${sti(r)}">${esc(etikett)}</a></td><td>${x.t(pose)}</td><td>${vakuum ? x.t(vakuum) : 'Ikke oppgitt'}</td><td>${x.k(r.tall[`${pose}-min`].kilde)}</td></tr>`);
  }).join('');
  const avvist = data.rader.filter((r) => r.status === 'avvist');
  const rest = rester ? h(rester) : null;
  return {
    title: 'Holdbarhet i kjøleskapet: tabell med kilder',
    h1: 'Hvor lenge holder maten seg i kjøleskapet?',
    description: 'Hvor lenge holder egg, kjøttdeig, kylling, ris og rester seg i kjøleskapet? Tider med kilde og lesedato på hvert tall, og Mattilsynets råd først.',
    lead: `Hold kjøleskapet under ${forste.t('mt-kjol')}, sier Mattilsynet. Her er hvor lenge vanlige varer holder seg i kjøleskapet, med kilde på hvert tall.`,
    rik: [
      `<h2>Dette sier Mattilsynet</h2>${p([
        `${forste.k('mt-oppbevaring')} anbefaler at kjøleskapet holder under ${forste.t('mt-kjol')}.`,
        rest ? `Restemat holder seg ${rest.t('rester')} i kjøleskapet. Bruk sansene før du spiser den.` : '',
        `Følg datoen og rådene på emballasjen (${forste.kp('mt-matsvinn')}). Holdbarhetsdatoen gjelder bare når varen er uåpnet og oppbevart riktig, og varer merket «siste forbruksdag» bør du ikke spise etter datoen (${forste.kp('mt-merking')}).`,
      ])}`,
      `<h2>Tider i kjøleskapet</h2><p>Trykk på en vare for flere tider, råd og kilder. Kilden står i siste kolonne.</p><div class="table-wrap" tabindex="0" role="region" aria-label="Tider i kjøleskapet"><table class="sprik"><thead><tr><th scope="col">Vare</th><th scope="col">I pose, skål eller kartong</th><th scope="col">Vakuumpakket</th><th scope="col">Kilde</th></tr></thead><tbody>${radene}</tbody></table></div>`,
      avvist.length ? `<h2>Dette er ikke med</h2><p>Vi tar bare med en tid når kildene er enige. Disse varene har derfor ingen egen side:</p><ul>${avvist.map((r) => `<li><strong>${esc(r.navn)}.</strong> ${esc(r.tekst.grunn)}</li>`).join('')}</ul>` : '',
      '<div class="related"><h2>Les også</h2><ul><li><a href="/frysing/">Hvor lenge kan mat ligge i fryseren?</a></li></ul></div>',
    ].filter(Boolean).join('\n'),
    faqTittel: 'Spørsmål om holdbarhet',
    faq: [
      ['Hvilken temperatur bør kjøleskapet ha?', `Under ${forste.t('mt-kjol')}, ifølge Mattilsynet.`],
      ['Hva er forskjellen på «best før» og «siste forbruksdag»?', '«Best før» er en veiledning om kvalitet, og maten er ofte god etter datoen. Varer merket «siste forbruksdag» bør du ikke spise etter datoen, skriver Mattilsynet.'],
    ],
  };
}

// Teksten for familien «frysing» (nb). Hver setning gjengir det kilden sier, med kilden nevnt; ingen egne råd.
// Mattilsynet først, MatPrat etterpå med årstall. Tall skrives aldri her: t(felt) henter dem fra data.nb.json.
// Tidene fra MatPrat tas bare med når de ligger innenfor Mattilsynets ramme (kvaliteten går ned etter 3 til 12 måneder);
// varene utenfor står som «avvist» i datafila og nevnes uten tall.

const MT = (h) => `${h.k('mt-oppbevaring')} skriver at du kan fryse nesten all mat før holdbarhetsdatoen og holde den trygg i årevis, men at kvaliteten går ned etter ${h.t('mt-kv')}, avhengig av varen. Fryseren skal holde ${h.t('mt-frys')} eller kaldere.`;
const START = (h) => `Mattilsynet sier du kan fryse nesten all mat, og at fryseren skal holde ${h.t('mt-frys')} eller kaldere.`;
const NOTE = (h) => `${h.k('mp-fryser')} skriver at tidene gjelder førsteklasses varer som er riktig behandlet ved innfrysing. Varen kan ligge lenger, men kvaliteten blir gradvis dårligere.`;
const FETT = (h) => `For kjøtt avhenger holdbarheten blant annet av fettinnholdet, skriver ${h.k('mt-oppbevaring')}. Fett harskner først, så magert kjøtt holder seg generelt lenger enn fett kjøtt.`;
const TINING = (h) => ['Tin i kjøleskapet', `<p>Tin frossen mat i kjøleskapet. Det går saktere, men er tryggere, skriver ${h.k('mt-oppbevaring')}. Du kan også tine maten i kaldt, rennende vann i tett emballasje, eller i mikrobølgeovn hvis den skal lages med en gang. Ikke tin lettbedervelig mat på kjøkkenbenken.</p>`];
const IKKE_IGJEN = (h) => `${h.k('mp-fryser')} skriver at ingen råvarer som har vært tint, skal fryses igjen før de er varmebehandlet.`;
const TID = 'Tid i fryseren';

export const TEKST = {
  ost: (h) => ({
    ord: 'frysing av ost',
    title: 'Kan man fryse ost, og hvor lenge holder den seg?',
    h1: 'Kan man fryse ost?',
    description: `Ja, fet ost og revet ost kan ligge ${h.t('fet')} i fryseren, ifølge ${h.k('mp-fryser')}. Mager ost egner seg ikke til frysing. Med Mattilsynets råd om fryseren.`,
    lead: `Ja. ${START(h)} Fet ost og revet ost holder seg ${h.t('fet')} i fryseren, ifølge ${h.k('mp-fryser')}. Mager ost egner seg ikke.`,
    mattilsynet: [MT(h)],
    tabell: { tittel: 'Ost i fryseren', kilde: 'mp-fryser', intro: `${h.k('mp-fryser')} skiller mellom fet og mager ost:`, kolonner: ['Ost', TID], rader: [['Fet ost og revet ost', 'fet'], ['Mager ost', { tekst: 'Egner seg ikke til frysing' }]], etter: [NOTE(h)] },
    faq: [['Hvilken ost egner seg ikke til frysing?', `Mager ost, skriver ${h.k('mp-fryser')}. Fet ost og revet ost kan fryses.`]],
    andre: [['/frysing/melk/', 'Kan man fryse melk, fløte og rømme?'], ['/frysing/smor/', 'Kan man fryse smør?']],
  }),

  melk: (h) => ({
    ord: 'melk, fløte og rømme',
    title: 'Kan man fryse melk, fløte og rømme?',
    h1: 'Kan man fryse melk, fløte og rømme?',
    description: `Ja, melk, fløte og rømme holder seg ${h.t('melk')} i fryseren, ifølge ${h.k('mp-fryser')}. Yoghurt egner seg derimot ikke. Med Mattilsynets råd om fryseren.`,
    lead: `Ja. ${START(h)} Melk, fløte og rømme holder seg ${h.t('melk')} i fryseren, ifølge ${h.k('mp-fryser')}.`,
    mattilsynet: [MT(h)],
    tabell: { tittel: 'Melk og fløte i fryseren', kilde: 'mp-fryser', intro: `${h.k('mp-fryser')} oppgir disse tidene for meieriprodukter:`, kolonner: ['', TID], rader: [['Melk, fløte og rømme', 'melk'], ['Yoghurt', { tekst: 'Egner seg ikke, bare hvis den skal serveres frossen' }]], etter: [NOTE(h)] },
    faq: [['Kan man fryse yoghurt?', `${h.k('mp-fryser')} skriver at yoghurt ikke egner seg til frysing, bare hvis den skal serveres frossen.`]],
    andre: [['/frysing/ost/', 'Kan man fryse ost?'], ['/frysing/smor/', 'Kan man fryse smør?']],
  }),

  smor: (h) => ({
    ord: 'frysing av smør',
    title: 'Kan man fryse smør, og hvor lenge holder det seg?',
    h1: 'Kan man fryse smør?',
    description: `Ja, smør og margarin holder seg ${h.t('smor')} i fryseren, ifølge ${h.k('mp-fryser')}. Med Mattilsynets råd om temperatur og kvalitet i fryseren.`,
    lead: `Ja. ${START(h)} Smør og margarin holder seg ${h.t('smor')} i fryseren, ifølge ${h.k('mp-fryser')}.`,
    mattilsynet: [MT(h)],
    tabell: { tittel: 'Smør i fryseren', kilde: 'mp-fryser', intro: `${h.k('mp-fryser')} gir smør og margarin samme tid:`, kolonner: ['', TID], rader: [['Smør og margarin', 'smor']], etter: [NOTE(h)] },
    faq: [['Kan man fryse margarin?', `Ja. ${h.k('mp-fryser')} oppgir samme tid for margarin som for smør: ${h.t('smor')}.`]],
    andre: [['/frysing/ost/', 'Kan man fryse ost?'], ['/frysing/melk/', 'Kan man fryse melk, fløte og rømme?']],
  }),

  egg: (h) => ({
    ord: 'frysing av egg',
    title: 'Kan man fryse egg, og hvor lenge holder de seg?',
    h1: 'Kan man fryse egg?',
    description: `Ja, men ikke i skallet. Sammenvispede rå egg holder seg ${h.t('hele')} i fryseren og eggehviter ${h.t('hviter')}, ifølge ${h.k('mp-fryser')}.`,
    lead: `Ja, men ikke i skallet. ${START(h)} Sammenvispede rå egg holder seg ${h.t('hele')} i fryseren, ifølge ${h.k('mp-fryser')}.`,
    mattilsynet: [MT(h)],
    tabell: {
      tittel: 'Egg i fryseren', kilde: 'mp-fryser', intro: `${h.k('mp-fryser')} oppgir disse tidene:`, kolonner: ['', TID],
      rader: [['Rå egg, sammenvispet', 'hele'], ['Rå eggehviter', 'hviter'], ['Eggeplommer', 'plommer'], ['Eggeretter, kokte eller stekte', 'eggeretter']],
      etter: [`Du kan vispe sammen hele egg og fryse dem, eller skille plomme og hvite og fryse dem hver for seg. ${h.k('mp-egg')} skriver at både plommen og hviten beholder egenskapene sine etter frysing.`, NOTE(h)],
    },
    faq: [
      ['Kan man fryse egg i skallet?', `Nei. ${h.k('mp-egg')} skriver at egg kan fryses, men ikke i skallet.`],
      ['Hvor lenge kan eggehviter ligge i fryseren?', `${h.t('hviter')}, ifølge ${h.k('mp-fryser')}.`],
    ],
    soster: ['/holdbarhet/egg/', 'Hvor lenge holder egg seg i kjøleskapet?'],
    andre: [['/holdbarhet/kokte-egg/', 'Hvor lenge holder kokte egg seg i kjøleskapet?']],
  }),

  brod: (h) => ({
    ord: 'frysing av brød',
    title: 'Kan man fryse brød, og hvor lenge holder det seg?',
    h1: 'Kan man fryse brød?',
    description: `Ja, brød og rundstykker holder seg ${h.t('brod')} i fryseren, ifølge ${h.k('mp-fryser')}. Med Mattilsynets råd om fryseren og om mugg på brød.`,
    lead: `Ja. ${START(h)} Brød og rundstykker holder seg ${h.t('brod')} i fryseren, ifølge ${h.k('mp-fryser')}.`,
    mattilsynet: [
      MT(h),
      `Brød regnes ikke som lettbedervelig mat. ${h.k('mt-oppbevaring')} skriver at misfarging, lukt, smak eller synlig mugg kan være tegn på at du ikke bør spise det.`,
      `Bakervarer som stort sett spises innen ${h.t('mt-unntak')}, som ferske brød, trenger ikke holdbarhetsdato (${h.kp('mt-merking')}).`,
    ],
    tabell: { tittel: 'Brød i fryseren', kilde: 'mp-fryser', intro: `${h.k('mp-fryser')} oppgir denne tiden:`, kolonner: ['', TID], rader: [['Brød og rundstykker', 'brod']], etter: [NOTE(h)] },
    faq: [['Hvor lenge holder brød seg i fryseren?', `${h.t('brod')}, ifølge ${h.k('mp-fryser')}. Brødet kan ligge lenger, men kvaliteten blir gradvis dårligere.`]],
    andre: [['/frysing/kaker/', 'Kan man fryse kaker?']],
  }),

  kaker: (h) => ({
    ord: 'frysing av kaker',
    title: 'Kan man fryse kaker, og hvor lenge holder de seg?',
    h1: 'Kan man fryse kaker?',
    description: `Ja, kaker og søt bakst holder seg ${h.t('sot')} i fryseren, og tørre kaker og kjeks ${h.t('torre')}, ifølge ${h.k('mp-fryser')}.`,
    lead: `Ja. ${START(h)} Kaker og søt bakst holder seg ${h.t('sot')} i fryseren, tørre kaker og kjeks ${h.t('torre')}, ifølge ${h.k('mp-fryser')}.`,
    mattilsynet: [MT(h)],
    tabell: {
      tittel: 'Kaker i fryseren', kilde: 'mp-fryser', intro: `${h.k('mp-fryser')} oppgir disse tidene:`, kolonner: ['', TID],
      rader: [['Kaker og søt bakst', 'sot'], ['Tørre kaker og kjeks', 'torre']],
      etter: [`Kaker med krem eller glasur er ikke med. ${h.k('mp-fryser')} oppgir en kortere tid for dem enn Mattilsynets ramme, så vi lar det tallet ligge.`, NOTE(h)],
    },
    faq: [['Hvor lenge kan tørre kaker og kjeks ligge i fryseren?', `${h.t('torre')}, ifølge ${h.k('mp-fryser')}.`]],
    andre: [['/frysing/brod/', 'Kan man fryse brød?']],
  }),

  'kjottdeig-og-kylling': (h) => ({
    ord: 'kjøttdeig og kylling',
    title: 'Hvor lenge holder kjøttdeig og kylling i fryseren?',
    h1: 'Hvor lenge holder kjøttdeig og kylling i fryseren?',
    description: `Kjøttdeig og kylling holder seg ${h.t('kjottdeig')} i fryseren, ifølge ${h.k('mp-fryser')}. Med Mattilsynets råd om fryseren og om trygg tining.`,
    lead: `${START(h)} Kjøttdeig og kylling holder seg ${h.t('kylling')} i fryseren, ifølge ${h.k('mp-fryser')}.`,
    mattilsynet: [MT(h), FETT(h)],
    tabell: {
      tittel: 'Kjøttdeig og kylling i fryseren', kilde: 'mp-fryser', intro: `${h.k('mp-fryser')} oppgir disse tidene:`, kolonner: ['', TID],
      rader: [['Kjøttdeig og karbonadedeig', 'kjottdeig'], ['Kylling', 'kylling']],
      etter: [`Kvernet kjøtt har stor overflate, og bakterieveksten og nedbrytningen går derfor fortere, skriver ${h.k('mp-fryser')}.`, `Kyllingkjøttdeig er ikke med. ${h.k('mp-fryser')} oppgir en kortere tid for den enn Mattilsynets ramme.`, NOTE(h)],
    },
    ekstra: [TINING(h)],
    faq: [
      ['Kan man fryse kjøttdeig som har vært tint?', IKKE_IGJEN(h)],
      ['Hvor lenge holder tint kjøttdeig?', `Bruk den samme dag som du tiner den, råder ${h.k('mt-merking')}.`],
    ],
    soster: ['/holdbarhet/kjottdeig-og-kylling/', 'Hvor lenge holder kjøttdeig og kylling seg i kjøleskapet?'],
    andre: [['/frysing/kjott/', 'Hvor lenge kan kjøtt ligge i fryseren?']],
  }),

  kjott: (h) => ({
    ord: 'kjøtt i fryseren',
    title: 'Hvor lenge kan kjøtt ligge i fryseren?',
    h1: 'Hvor lenge kan kjøtt ligge i fryseren?',
    description: `Storfe og lam holder seg ${h.t('storfe')} i fryseren, svinekjøtt med fett ${h.t('svin-fett')}, ifølge ${h.k('mp-fryser')}. Tider for pølser, spekemat og innmat.`,
    lead: `${START(h)} Storfe og lam holder seg ${h.t('lam')} i fryseren, svinekjøtt med fett bare ${h.t('svin-fett')}, ifølge ${h.k('mp-fryser')}.`,
    mattilsynet: [MT(h), FETT(h), 'Storfekjøtt og viltkjøtt holder seg for eksempel lenger enn salt kjøtt med mye fett, skriver Mattilsynet.'],
    tabell: {
      tittel: 'Kjøtt i fryseren', kilde: 'mp-fryser', intro: `${h.k('mp-fryser')} oppgir disse tidene:`, kolonner: ['', TID],
      rader: [['Storfekjøtt', 'storfe'], ['Lammekjøtt', 'lam'], ['Kalvekjøtt', 'kalv'], ['Svinekjøtt, magert', 'svin-magert'], ['Svinekjøtt med fett', 'svin-fett'], ['Spekemat', 'spekemat'], ['Medisterdeig', 'medisterdeig'], ['Pølser', 'polser'], ['Innmat', 'innmat']],
      etter: [`Kalkun, vilt og saltet kjøtt med mye fett er ikke med. ${h.k('mp-fryser')} oppgir tider for dem som ikke stemmer med Mattilsynets ramme.`, NOTE(h)],
    },
    ekstra: [TINING(h)],
    faq: [
      ['Kan man spise kjøtt som har ligget lenge i fryseren?', `${h.k('mp-kjott')} skriver at kjøttet kan spises, men at det neppe har beholdt den opprinnelige kvaliteten. Mattilsynet skriver at frossen mat holder seg trygg i årevis.`],
    ],
    soster: ['/holdbarhet/kjott/', 'Hvor lenge holder kjøtt seg i kjøleskapet?'],
    andre: [['/frysing/kjottdeig-og-kylling/', 'Hvor lenge holder kjøttdeig og kylling i fryseren?']],
  }),

  middagsrester: (h) => ({
    ord: 'frysing av rester',
    title: 'Kan man fryse middagsrester, gryter og suppe?',
    h1: 'Kan man fryse middagsrester, gryter og suppe?',
    description: `Ja, middagsrester, gryter og supper holder seg ${h.t('rester')} i fryseren, ifølge ${h.k('mp-fryser')}. Mattilsynet råder deg til å fryse restene med en gang.`,
    lead: `Ja. Skal du ikke spise restene med det første, bør du fryse dem med en gang, sier Mattilsynet. Middagsrester, gryter og supper holder seg ${h.t('rester')} i fryseren, ifølge ${h.k('mp-fryser')}.`,
    mattilsynet: [
      MT(h),
      `Skal du ikke spise maten med det første, bør du fryse den med en gang, skriver ${h.k('mt-oppbevaring')}. Ikke sett varm mat i fryseren: kjøl den ned, og frys den gjerne i mindre bokser.`,
      'Når du tiner og varmer opp frosne middagsrester i mikrobølgeovnen, må du røre slik at all maten blir gjennomvarm.',
    ],
    tabell: { tittel: 'Rester i fryseren', kilde: 'mp-fryser', intro: `${h.k('mp-fryser')} oppgir disse tidene:`, kolonner: ['', TID], rader: [['Middagsrester, gryter og supper', 'rester'], ['Kraft og buljong', 'kraft']], etter: [NOTE(h)] },
    faq: [['Kan man fryse suppe?', `Ja. Supper holder seg ${h.t('rester')} i fryseren, ifølge ${h.k('mp-fryser')}.`]],
    soster: ['/holdbarhet/rester/', 'Hvor lenge holder rester seg i kjøleskapet?'],
  }),

  fisk: (h) => ({
    ord: 'fisk i fryseren',
    title: 'Hvor lenge kan fisk ligge i fryseren?',
    h1: 'Hvor lenge kan fisk ligge i fryseren?',
    description: `Mager fisk som torsk holder seg ${h.t('mager', { ca: true })} i fryseren, fet fisk som laks ${h.t('fet', { ca: true })}, ifølge ${h.k('mp-fryser')}. Med Mattilsynets råd om sushi.`,
    lead: `${START(h)} Mager fisk som torsk og sei holder seg ${h.t('mager', { ca: true })} i fryseren, fet fisk som laks og makrell ${h.t('fet', { ca: true })}, ifølge ${h.k('mp-fryser')}.`,
    mattilsynet: [MT(h)],
    tabell: {
      tittel: 'Fisk i fryseren', kilde: 'mp-fryser', intro: `${h.k('mp-fryser')} deler fisken inn etter fettinnhold:`, kolonner: ['', TID],
      rader: [['Mager fisk: torsk, sei, lyr, kolje, breiflabb, rødspette, hvitting, hyse og brosme', { felt: 'mager', ca: true }], ['Halvfet fisk: uer, steinbit, røye, kveite og sjøørret', 'halvfet'], ['Fet fisk: makrell, laks, sild og ål', { felt: 'fet', ca: true }]],
      etter: [`Fisk som skal fryses, bør være så fersk som mulig, skriver ${h.k('mp-fryser')}.`, NOTE(h)],
    },
    ekstra: [TINING(h)],
    faq: [
      ['Må fisk til sushi fryses først?', `${h.k('mt-sushi')} skriver at villfisk som skal spises rå, skal dypfryses i minst ett døgn. Norsk oppdrettslaks og -ørret trenger ikke fryses først.`],
      ['Kan man fryse fisk som har vært tint?', IKKE_IGJEN(h)],
    ],
    andre: [['/frysing/skalldyr/', 'Kan man fryse reker og skalldyr?']],
  }),

  skalldyr: (h) => ({
    ord: 'reker og skalldyr',
    title: 'Kan man fryse reker og skalldyr?',
    h1: 'Kan man fryse reker og skalldyr?',
    description: `Ja, skalldyr holder seg ${h.t('skalldyr')} i fryseren, ifølge ${h.k('mp-fryser')}. Ferske blåskjell bør du derimot ikke fryse, sier Mattilsynet.`,
    lead: `Ja, men ferske blåskjell bør du ikke fryse, sier Mattilsynet. Skalldyr holder seg ${h.t('skalldyr')} i fryseren, ifølge ${h.k('mp-fryser')}.`,
    mattilsynet: [
      MT(h),
      `Ferske blåskjell bør ikke fryses, fordi det ødelegger kvaliteten, skriver ${h.k('mt-blaskjell')}. Det beste er å fryse ferdig dampede blåskjell. Vil du likevel fryse dem ferske, må du først sjekke at alle lever.`,
    ],
    tabell: { tittel: 'Skalldyr i fryseren', kilde: 'mp-fryser', intro: `${h.k('mp-fryser')} oppgir denne tiden:`, kolonner: ['', TID], rader: [['Skalldyr', 'skalldyr']], etter: [NOTE(h)] },
    faq: [['Kan man fryse blåskjell?', 'Ja, men helst ferdig dampet. Mattilsynet fraråder å fryse ferske blåskjell.']],
    soster: ['/holdbarhet/skalldyr/', 'Hvor lenge holder reker og skalldyr seg i kjøleskapet?'],
    andre: [['/frysing/fisk/', 'Hvor lenge kan fisk ligge i fryseren?']],
  }),

  baer: (h) => ({
    ord: 'frysing av bær',
    title: 'Kan man fryse bær, og hvor lenge holder de seg?',
    h1: 'Kan man fryse bær?',
    description: `Ja, bær holder seg ${h.t('baer')} i fryseren, ifølge ${h.k('mp-fryser')}. Mattilsynet råder deg til å koke importerte frosne bær før bruk i kald mat.`,
    lead: `Ja. ${START(h)} Bær holder seg ${h.t('baer')} i fryseren, ifølge ${h.k('mp-fryser')}.`,
    mattilsynet: [
      MT(h),
      `Det har vært flere utbrudd av norovirus og hepatitt A i Norden fra importerte frosne bær, skriver ${h.k('mt-baer')}. Virusene overlever godt i frosne bær, men dør ved varmebehandling. Mattilsynet råder deg derfor til å koke importerte frosne bær i ett minutt før du bruker dem i retter som ikke skal varmebehandles.`,
    ],
    tabell: { tittel: 'Bær i fryseren', kilde: 'mp-fryser', intro: `${h.k('mp-fryser')} oppgir denne tiden:`, kolonner: ['', TID], rader: [['Bær', 'baer']], etter: [NOTE(h)] },
    faq: [['Må frosne bær kokes?', 'Importerte frosne bær bør kokes i ett minutt hvis de skal i mat som ikke varmebehandles, råder Mattilsynet.']],
    andre: [['/frysing/frukt-og-gronnsaker/', 'Kan man fryse frukt og grønnsaker?']],
  }),

  'frukt-og-gronnsaker': (h) => ({
    ord: 'frukt og grønnsaker',
    title: 'Kan man fryse frukt og grønnsaker?',
    h1: 'Kan man fryse frukt og grønnsaker?',
    description: `Ja, frukt og grønnsaker holder seg ${h.t('fg')} i fryseren, og urter og sopp ${h.t('sopp')}, ifølge ${h.k('mp-fryser')}. Med Mattilsynets råd om skylling.`,
    lead: `Ja. ${START(h)} Frukt og grønnsaker holder seg ${h.t('fg')} i fryseren, ifølge ${h.k('mp-fryser')}.`,
    mattilsynet: [
      MT(h),
      `Skyll frukt, bær og grønnsaker grundig før du spiser dem, skriver ${h.k('mt-baer')}. Noen importerte varer bør også varmebehandles før de spises, blant annet minimais, sukkererter, asparges, krydderurter og frosne bær.`,
    ],
    tabell: {
      tittel: 'Frukt og grønnsaker i fryseren', kilde: 'mp-fryser', intro: `${h.k('mp-fryser')} oppgir disse tidene:`, kolonner: ['', TID],
      rader: [['Frukt og grønnsaker', 'fg'], ['Urter og bladgrønnsaker', 'urter'], ['Sopp', 'sopp']],
      etter: [`${h.k('mp-fryser')} merker alle tre med «bør varmebehandles».`, NOTE(h)],
    },
    faq: [['Hvor lenge kan sopp ligge i fryseren?', `${h.t('sopp')}, ifølge ${h.k('mp-fryser')}, som merker sopp med «bør varmebehandles».`]],
    andre: [['/frysing/baer/', 'Kan man fryse bær?']],
  }),
};

// Raden på samlesiden for hver vare: [etikett, felt, ca].
const OVERSIKT = {
  ost: [['Fet ost og revet ost', 'fet']], melk: [['Melk, fløte og rømme', 'melk']], smor: [['Smør og margarin', 'smor']],
  egg: [['Rå egg, sammenvispet', 'hele'], ['Rå eggehviter', 'hviter']], brod: [['Brød og rundstykker', 'brod']],
  kaker: [['Kaker og søt bakst', 'sot'], ['Tørre kaker og kjeks', 'torre']],
  'kjottdeig-og-kylling': [['Kjøttdeig', 'kjottdeig'], ['Kylling', 'kylling']],
  kjott: [['Storfekjøtt', 'storfe'], ['Lammekjøtt', 'lam'], ['Svinekjøtt, magert', 'svin-magert'], ['Svinekjøtt med fett', 'svin-fett'], ['Pølser', 'polser']],
  middagsrester: [['Middagsrester, gryter og supper', 'rester']],
  fisk: [['Mager fisk', 'mager', true], ['Halvfet fisk', 'halvfet'], ['Fet fisk', 'fet', true]],
  skalldyr: [['Skalldyr', 'skalldyr']], baer: [['Bær', 'baer']], 'frukt-og-gronnsaker': [['Frukt og grønnsaker', 'fg']],
};

export function nav({ data, rader, sti, h, p, esc }) {
  const forste = h(rader[0]);
  const radene = rader.flatMap((r) => {
    const x = h(r);
    return (OVERSIKT[r.id] ?? []).map(([etikett, felt, ca]) => `<tr><td><a href="${sti(r)}">${esc(etikett)}</a></td><td>${x.t(felt, { ca })}</td></tr>`);
  }).join('');
  const avvist = data.rader.filter((r) => r.status === 'avvist');
  const tining = TINING(forste);
  return {
    title: 'Hvor lenge kan mat ligge i fryseren? Tabell med kilder',
    h1: 'Hvor lenge kan mat ligge i fryseren?',
    description: 'Hvor lenge holder kjøtt, fisk, brød, ost og rester seg i fryseren? Tider fra MatPrat (2023), med Mattilsynets råd om frysing og tining.',
    lead: `${START(forste)} Her er hvor lenge vanlige varer holder kvaliteten i fryseren, med kilde på hvert tall.`,
    rik: [
      `<h2>Dette sier Mattilsynet</h2>${p([
        MT(forste),
        'Frys maten så raskt som mulig og før siste forbruksdag. Ikke sett varm mat i fryseren: kjøl den ned, og frys den gjerne i mindre bokser.',
        `Når du tar varen opp igjen, bør du bruke den samme dag som du tiner den (${forste.kp('mt-merking')}).`,
      ])}`,
      `<h2>${tining[0]}</h2>${tining[1]}`,
      `<h2>Tider i fryseren</h2><p>Trykk på en vare for flere tider, råd og kilder. Alle tidene er fra ${forste.k('mp-fryser')}.</p><div class="table-wrap" tabindex="0" role="region" aria-label="Tider i fryseren"><table class="sprik"><thead><tr><th scope="col">Vare</th><th scope="col">${TID}</th></tr></thead><tbody>${radene}</tbody></table></div>${p([NOTE(forste)])}`,
      avvist.length ? `<h2>Dette er ikke med</h2><p>Vi tar bare med en tid fra ${forste.k('mp-fryser')} når den ligger innenfor Mattilsynets ramme. Disse varene har derfor ingen tid her:</p><ul>${avvist.map((r) => `<li><strong>${esc(r.navn)}.</strong> ${esc(r.tekst.grunn)}</li>`).join('')}</ul><p>${forste.k('mp-fryser')} skriver også at yoghurt og mager ost ikke egner seg til frysing.</p>` : '',
      '<div class="related"><h2>Les også</h2><ul><li><a href="/holdbarhet/">Hvor lenge holder maten seg i kjøleskapet?</a></li></ul></div>',
    ].filter(Boolean).join('\n'),
    faqTittel: 'Spørsmål om frysing',
    faq: [
      ['Hvilken temperatur skal fryseren ha?', `Fryseren skal holde ${forste.t('mt-frys')} eller kaldere, ifølge Mattilsynet, som ber deg sjekke termometeret i fryseren.`],
      ['Er mat som har ligget lenge i fryseren farlig?', 'Mattilsynet skriver at du kan fryse nesten all mat før holdbarhetsdatoen og holde den trygg i årevis, men at kvaliteten går ned. Se, lukt og smak på frossen mat for å vurdere kvaliteten.'],
    ],
  };
}

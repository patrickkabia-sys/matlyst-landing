// Den handskrivna delen av sidorna för «mängd per person» (sv). Allt annat skrivs av malen från data.sv.json.
// Varje sida har `varianter` (valen i kalkylatorn och raderna i tabellen) och `tekst(h)`.
//   V(namn, ...delar): en variant. En del är ett talfält i datafilen, eller [minFält, maksFält] för ett intervall.
//   h ger siffrorna: h.t(fält) «75 g», h.r(min, maks) «75 till 125 g», h.n(fält) «75», h.sum(fält, 4) «300 g» för 4 personer,
//   h.sumR(min, maks, 4), h.k(källa) «Arla (2026)», h.sprik([[källa, beskrivning, text]]) en liten källtabell.
// Inga siffror skrivs för hand, bortsett från antalet personer i tabellen (2, 4, 6, 8, 10, 12). Varje siffra kommer från en svensk källa (Arla, Svenskt Kött, Kungsörnen).
// Ingen mening här påstår mer än källan säger. Barn: vi har ingen svensk källa för barnportioner, så sidorna säger det och ger ingen siffra för barn.
// Undvik orden laga, steg, ugn, timer, plan, vecka, meny, köp, spara, recept, hitta i h2: scripts/app-bevis.mjs kopplar dem till appkort.
const V = (navn, ...delar) => ({ navn, deler: delar });
const p = (...xs) => xs.filter(Boolean).map((x) => `<p>${x}</p>`).join('');
const BARN = 'Vi har inte hittat en svensk källa som anger hur mycket barn äter jämfört med vuxna. Därför räknar kalkylatorn personer, och vi ger ingen siffra för barn.';
const M = '/sv/hur-mycket-per-person/';
const S = (slug, text) => [`${M}${slug}/`, text];

export const TEKST = {
  ris: {
    varianter: [V('Okokt ris', 'pp')],
    tekst: (h) => ({
      title: 'Hur mycket ris per person? Kalkylator och tabell',
      h1: 'Hur mycket ris per person?',
      description: `Arla (2026) räknar ungefär ${h.t('pp')} okokt ris per portion. ${h.t('svall-okokt')} okokt ris blir ${h.t('svall-kokt')} kokt. Kalkylator, tabell för 2 till 12 personer och källa.`,
      lead: `Räkna ungefär ${h.t('pp')} okokt ris per person. Skriv in hur många som ska äta, så får du hela mängden.`,
      svar: `<b>Ungefär ${h.t('pp')} okokt ris per person</b>. Till 4 personer blir det ${h.sum('pp', 4)}.`,
      avsnitt: [
        ['Så mycket sväller riset', p(`${h.k('arlaris')}: ${h.s('svaller')} Arla anger att ${h.t('svall-okokt')} okokt ris blir ${h.t('svall-kokt')} kokt ris och räcker till ${h.r('port-min', 'port-maks')}.`)],
        ['Okokt eller kokt', p('Siffran gäller okokt ris, mätt före kokning. Hur mycket som blir kokt ser du i Arlas siffror ovan.', BARN)],
      ],
      faq: [
        ['Hur mycket ris per person?', `${h.k('arlaris')} anger ungefär ${h.t('pp')} okokt ris per portion.`],
        ['Hur mycket ris till 4 personer?', `Till 4 personer blir det ${h.sum('pp', 4)} okokt ris, enligt Arlas mått.`],
        ['Hur mycket ris till 10 personer?', `Till 10 personer blir det ${h.sum('pp', 10)} okokt ris.`],
      ],
      soster: [S('pasta', 'Hur mycket pasta per person?'), S('potatis', 'Hur mycket potatis per person?')],
    }),
  },

  pasta: {
    varianter: [V('Okokt pasta, Arlas mått', 'arla'), V('Tagliatelle, Kungsörnens mått', 'tag'), V('Normalportion, spann', ['vida-min', 'vida-maks'])],
    tekst: (h) => ({
      title: 'Hur mycket pasta per person? Kalkylator och tabell',
      h1: 'Hur mycket pasta per person?',
      description: `Arla (2026) räknar ${h.t('arla')} okokt pasta per portion, Kungsörnen (2026) ${h.t('tag')} tagliatelle. Kalkylator, tabell för 2 till 12 personer och källor.`,
      lead: `Arla räknar ${h.t('arla')} okokt pasta per person i sina recept, och Kungsörnen räknar ${h.t('tag')} tagliatelle per portion. Skriv in hur många som ska äta, så får du hela mängden.`,
      svar: `<b>${h.t('arla')} okokt pasta per person</b> enligt Arla. Till 4 personer blir det ${h.sum('arla', 4)}. Kungsörnen anger ${h.t('tag')} för tagliatelle.`,
      avsnitt: [
        ['Mät pastan utan våg', p(`${h.s('hal')} Arla skriver också: ${h.s('okokt')}`)],
        ['Det som ändrar mängden', p(`${h.k('arlapasta')} anger att en normalportion kan variera från ${h.r('vida-min', 'vida-maks')} okokt pasta per person. ${h.s('hungrig')}`, `Ofta nämns ${h.r('norm-min', 'norm-maks')} som normalportion, pastatillverkare anger ${h.r('span-min', 'span-maks')}, och ett standardmått på restauranger är ${h.t('rest')}.`, BARN)],
        ['Källorna sida vid sida', p('Arla och Kungsörnen ligger nära varandra, och spannet visar att det inte finns ett enda rätt mått.') + h.sprik([['arlapasta', 'Okokt pasta per portion i Arlas recept', h.t('arla')], ['arlapasta', 'Normalportion, spann', h.r('vida-min', 'vida-maks')], ['kungstag', 'Tagliatelle per portion', h.t('tag')]])],
      ],
      faq: [
        ['Hur mycket pasta per person?', `${h.k('arlapasta')} räknar ${h.t('arla')} okokt pasta per portion i sina recept.`],
        ['Hur mycket pasta till 4 personer?', `Till 4 personer blir det ${h.sum('arla', 4)} okokt pasta enligt Arlas mått, eller ${h.sum('tag', 4)} tagliatelle enligt Kungsörnen.`],
        ['Väger man pastan okokt eller kokt?', `${h.s('okokt')}`],
      ],
      soster: [S('ris', 'Hur mycket ris per person?'), S('kottfars', 'Hur mycket köttfärs per person?')],
    }),
  },

  poteter: {
    varianter: [V('Potatis', 'pp')],
    tekst: (h) => ({
      title: 'Hur mycket potatis per person? Kalkylator och tabell',
      h1: 'Hur mycket potatis per person?',
      description: `Arla (2026) räknar med runt ${h.t('pp')} potatis per person. Kalkylator, tabell för 2 till 12 personer och källa.`,
      lead: `Räkna med runt ${h.t('pp')} potatis per person. Skriv in hur många som ska äta, så får du hela mängden.`,
      svar: `<b>Runt ${h.t('pp')} potatis per person</b>. Till 4 personer blir det ${h.sum('pp', 4)}.`,
      avsnitt: [['Det som ändrar mängden', p(`${h.s('hunger')}`, 'Siffran gäller potatis som kokas. Skalet och eventuell skalning ändrar vikten, men det anger källan ingen siffra för.', BARN)]],
      faq: [
        ['Hur mycket potatis per person?', `${h.k('arlapotatis')} räknar med runt ${h.t('pp')} potatis per person.`],
        ['Hur mycket potatis till 4 personer?', `Till 4 personer blir det ${h.sum('pp', 4)} potatis.`],
      ],
      soster: [S('ris', 'Hur mycket ris per person?'), ['/sv/tillagningstid/koka-potatis/', 'Koka potatis: hur länge?']],
    }),
  },

  kjott: {
    varianter: [V('Rått kött utan ben', ['benfritt-min', 'benfritt-maks']), V('Rått kött med ben', ['ben-min', 'ben-maks']), V('Rått kött med mycket ben', ['mben-min', 'mben-maks']), V('Kokt eller stekt kött utan ben', ['kokt-min', 'kokt-maks']), V('Kokt eller stekt kött med ben', ['kokt-ben-min', 'kokt-ben-maks'])],
    tekst: (h) => ({
      title: 'Hur mycket kött per person? Kalkylator och tabell',
      h1: 'Hur mycket kött per person?',
      description: `Svenskt Kött (2026): ${h.r('benfritt-min', 'benfritt-maks')} benfritt kött per portion, ${h.r('ben-min', 'ben-maks')} med ben. Kalkylator, tabell för 2 till 12 personer och källa.`,
      lead: `Svenskt Kött anger ${h.r('benfritt-min', 'benfritt-maks')} benfritt kött per portion, och mer när köttet har ben. Skriv in hur många som ska äta, så får du hela mängden.`,
      svar: `<b>${h.r('benfritt-min', 'benfritt-maks')} benfritt kött per person</b>, ${h.r('ben-min', 'ben-maks')} med ben och ${h.r('mben-min', 'mben-maks')} med mycket ben. Till 4 personer blir det ${h.sumR('benfritt-min', 'benfritt-maks', 4)} benfritt.`,
      avsnitt: [
        ['Det som ändrar mängden', p(`Svenskt Kött anger mängd per portion för rått kött, för kokt eller stekt kött och för några färdiga rätter. Kokt eller stekt kött utan ben är ${h.r('kokt-min', 'kokt-maks')} per portion, och med ben ${h.r('kokt-ben-min', 'kokt-ben-maks')}. Lever, tunga och njure är ${h.t('lever')} per portion.`, BARN)],
        ['Mer exakta mängder per sort', p('Svenskt Kött har egna siffror per styckningsdel. Välj sorten du ska laga.') + `<ul><li><a href="${M}biff/">Nötkött och biff</a></li><li><a href="${M}svin/">Griskött</a></li><li><a href="${M}lam/">Lammkött</a></li><li><a href="${M}kottfars/">Köttfärs</a></li></ul>`],
      ],
      faq: [
        ['Hur mycket kött per person?', `${h.k('skinkop')} anger ${h.r('benfritt-min', 'benfritt-maks')} benfritt kött per portion, ${h.r('ben-min', 'ben-maks')} med ben och ${h.r('mben-min', 'mben-maks')} med mycket ben.`],
        ['Hur mycket kött till 4 personer?', `Till 4 personer blir det ${h.sumR('benfritt-min', 'benfritt-maks', 4)} benfritt kött enligt Svenskt Kött.`],
      ],
      soster: [S('biff', 'Hur mycket nötkött per person?'), S('svin', 'Hur mycket griskött per person?'), S('lam', 'Hur mycket lammkött per person?')],
    }),
  },

  biff: {
    varianter: [V('Entrecôte i bit', 'entre'), V('Biff utan kappa', 'biff-utan'), V('Biff med kappa', 'biff-med'), V('Oxfilé', 'file'), V('Stek', 'stek'), V('Rostbiff och rostas', 'rostbiff'), V('Grytbitar', 'gryt'), V('Framdelskött utan ben', 'fram-utan'), V('Framdelskött med ben', ['fram-med-min', 'fram-med-maks'])],
    tekst: (h) => ({
      title: 'Hur mycket biff och nötkött per person? Kalkylator och tabell',
      h1: 'Hur mycket biff och nötkött per person?',
      description: `Svenskt Kött (2026): ${h.t('biff-utan')} biff utan kappa och ${h.t('file')} oxfilé per person. Kalkylator, tabell för 2 till 12 personer och källa.`,
      lead: `Svenskt Kött anger ${h.t('biff-utan')} biff utan kappa, ${h.t('entre')} entrecôte och ${h.t('file')} oxfilé per person. Skriv in hur många som ska äta, så får du hela mängden.`,
      svar: `<b>${h.t('biff-utan')} biff utan kappa per person</b>, och ${h.t('biff-med')} med kappa. Oxfilé är ${h.t('file')}. Till 4 personer blir det ${h.sum('biff-utan', 4)} biff.`,
      avsnitt: [
        ['Det som ändrar mängden', p(`Biff utan kappa är ${h.t('biff-utan')}, och med kappa går det åt ${h.t('biff-med')}. Stek, rostbiff och rostas räknar Svenskt Kött som ${h.t('stek')} per portion. Grytbitar är ${h.t('gryt')} per person.`, `Framdelskött är ${h.t('fram-utan')} per person utan ben och ${h.r('fram-med-min', 'fram-med-maks')} med ben.`, BARN)],
      ],
      faq: [
        ['Hur mycket biff per person?', `${h.k('sknot')} anger ${h.t('biff-utan')} biff utan kappa och ${h.t('biff-med')} med kappa.`],
        ['Hur mycket oxfilé per person?', `${h.k('sknot')} anger ${h.t('file')} oxfilé per portion.`],
        ['Hur mycket nötkött till 4 personer?', `Till 4 personer blir det ${h.sum('biff-utan', 4)} biff utan kappa.`],
      ],
      soster: [S('kott', 'Hur mycket kött per person?'), ['/sv/tillagningstid/biff-i-panna/', 'Steka biff: tid per sida'], ['/sv/tillagningstid/rostbiff/', 'Hur länge ska rostbiffen vara i ugnen?']],
    }),
  },

  svin: {
    varianter: [V('Fläskfilé', 'file'), V('Bog utan ben', 'bog'), V('Karré med ben', 'karre-ben'), V('Karré utan ben', 'karre-fri'), V('Kotlettrad med fett och ben', 'kotlettrad'), V('Kotletter med ben', 'kotlett-ben'), V('Benfria kotletter', 'kotlett-fri'), V('Tunna revbensspjäll', 'spjall-tunna'), V('Skinkstek', 'stek')],
    tekst: (h) => ({
      title: 'Hur mycket griskött och fläsk per person? Kalkylator och tabell',
      h1: 'Hur mycket griskött per person?',
      description: `Svenskt Kött (2026): ${h.t('file')} för fläskfilé och ${h.t('karre-ben')} för karré med ben. Kalkylator, tabell för 2 till 12 personer och källa.`,
      lead: `Svenskt Kött anger för fläskfilé ${h.t('file')}, för karré med ben ${h.t('karre-ben')} och för bog utan ben ${h.t('bog')}. Skriv in hur många som ska äta, så får du hela mängden.`,
      svar: `<b>Fläskfilé: ${h.t('file')}</b>, alltså ${h.pp('file')} per person. Karré med ben: ${h.t('karre-ben')}. Skinkstek är ${h.t('stek')} per person.`,
      avsnitt: [
        ['Det som ändrar mängden', p(`Ben och fett ändrar mängden. ${h.k('skgris')} anger ${h.t('karre-ben')} karré med ben och ${h.t('karre-fri')} om karrén är benfri. Kotlettrad med fett och ben är ${h.t('kotlettrad')}, och renputsad ${h.t('kotlettrad-ren')}.`, `${h.s('fett')} Om filén: ${h.s('putsad')}`, BARN)],
      ],
      faq: [
        ['Hur mycket fläskfilé per person?', `${h.k('skgris')} anger ${h.t('file')} filé.`],
        ['Hur mycket karré per person?', `${h.k('skgris')} anger ${h.t('karre-ben')} karré med ben, och ${h.t('karre-fri')} om karrén är benfri.`],
        ['Hur mycket kotletter per person?', `${h.k('skgris')} anger ${h.t('kotlett-ben')} kotletter med ben, och ${h.t('kotlett-fri')} av benfri kotlett.`],
      ],
      soster: [S('kott', 'Hur mycket kött per person?'), S('julskinka', 'Hur mycket julskinka per person?'), ['/sv/tillagningstid/flaskstek/', 'Fläskstek i ugn: tid och temperatur']],
    }),
  },

  lam: {
    varianter: [V('Kokkött av lamm', ['kokkott-min', 'kokkott-maks']), V('Grytbitar av lamm', ['gryt-min', 'gryt-maks']), V('Lammentrecôte och lammstek', 'entre'), V('Fårfiol', 'fiol'), V('Bringa med ben', ['bringa-ben-min', 'bringa-ben-maks']), V('Urbenad bringa', 'bringa-fri')],
    tekst: (h) => ({
      title: 'Hur mycket lammkött per person? Kalkylator och tabell',
      h1: 'Hur mycket lammkött per person?',
      description: `Svenskt Kött (2026): ${h.t('entre')} lammstek eller lammentrecôte per person, och ${h.r('kokkott-min', 'kokkott-maks')} kokkött med ben. Kalkylator, tabell för 2 till 12 personer och källa.`,
      lead: `Svenskt Kött anger ${h.t('entre')} kött per person för lammentrecôte och lammstek, och ${h.r('kokkott-min', 'kokkott-maks')} för kokkött, eftersom det går bort fett och ben. Skriv in hur många som ska äta, så får du hela mängden.`,
      svar: `<b>${h.t('entre')} lammstek per person</b>. Kokkött är ${h.r('kokkott-min', 'kokkott-maks')}, och grytbitar ${h.r('gryt-min', 'gryt-maks')}. Till 4 personer blir det ${h.sum('entre', 4)} lammstek.`,
      avsnitt: [
        ['Det som ändrar mängden', p(`${h.s('fett')} Bringa med ben är ${h.r('bringa-ben-min', 'bringa-ben-maks')} per person, och urbenad bringa ${h.t('bringa-fri')}. Fårfiol är ${h.t('fiol')} per person.`, `För lammkotletter anger Svenskt Kött ${h.r('kotlett-min', 'kotlett-maks')} enkla lammkotletter per person, eller 2 dubbla.`, BARN)],
      ],
      faq: [
        ['Hur mycket lammkött per person?', `${h.k('sklamm')} anger ${h.t('entre')} per person för lammstek och entrecôte, och ${h.r('kokkott-min', 'kokkott-maks')} för kokkött.`],
        ['Hur många lammkotletter per person?', `${h.k('sklamm')} anger ${h.r('kotlett-min', 'kotlett-maks')} enkla lammkotletter per person.`],
      ],
      soster: [S('kott', 'Hur mycket kött per person?'), ['/sv/tillagningstid/lammstek/', 'Lammstek i ugn: tid och temperatur']],
    }),
  },

  kjottdeig: {
    varianter: [V('Köttfärs', ['fars-min', 'fars-maks']), V('Färsrätter', 'farsratt'), V('Köttfärssås', 'sas'), V('Köttgryta', 'gryta'), V('Pytt i panna', ['pytt-min', 'pytt-maks'])],
    tekst: (h) => ({
      title: 'Hur mycket köttfärs per person? Kalkylator och tabell',
      h1: 'Hur mycket köttfärs per person?',
      description: `Svenskt Kött (2026): ${h.r('fars-min', 'fars-maks')} köttfärs per portion, och ${h.t('sas')} färdig köttfärssås. Kalkylator, tabell för 2 till 12 personer och källa.`,
      lead: `Svenskt Kött anger ${h.r('fars-min', 'fars-maks')} köttfärs per portion. Färdig köttfärssås är ${h.t('sas')} per portion. Skriv in hur många som ska äta, så får du hela mängden.`,
      svar: `<b>${h.r('fars-min', 'fars-maks')} köttfärs per person</b>. Till 4 personer blir det ${h.sumR('fars-min', 'fars-maks', 4)}.`,
      avsnitt: [
        ['Det som ändrar mängden', p(`Färsrätter räknar Svenskt Kött som ${h.t('farsratt')} per portion, köttfärssås och köttgryta som ${h.t('sas')} och pytt i panna som ${h.r('pytt-min', 'pytt-maks')}.`, BARN)],
      ],
      faq: [
        ['Hur mycket köttfärs per person?', `${h.k('skinkop')} anger ${h.r('fars-min', 'fars-maks')} köttfärs per portion.`],
        ['Hur mycket köttfärs till 4 personer?', `Till 4 personer blir det ${h.sumR('fars-min', 'fars-maks', 4)}.`],
        ['Hur mycket köttfärssås per person?', `${h.k('skinkop')} anger ${h.t('sas')} per portion.`],
      ],
      soster: [S('pasta', 'Hur mycket pasta per person?'), S('kott', 'Hur mycket kött per person?'), ['/sv/innertemperatur/kottfars/', 'Innertemperatur köttfärs']],
    }),
  },

  skinke: {
    varianter: [V('Julskinka på ett julbord med många rätter', ['jul-min', 'jul-maks']), V('Egen skinka utan ben', 'sjalv-utan'), V('Egen skinka med ben', 'sjalv-med'), V('Färdiglagad skinka', 'farg'), V('Skinka som pålägg', 'skinka-pal'), V('Kassler utan ben', 'kassler'), V('Kassler med ben', 'kassler-ben')],
    tekst: (h) => ({
      title: 'Hur mycket julskinka per person? Kalkylator och tabell',
      h1: 'Hur mycket julskinka per person?',
      description: `Svenskt Kött (2026): ${h.r('jul-min', 'jul-maks')} per person på ett julbord med många rätter, och ${h.t('sjalv-utan')} när du lagar skinkan själv. Kalkylator, tabell för 2 till 12 personer och källor.`,
      lead: `På ett julbord med många rätter räcker ${h.r('jul-min', 'jul-maks')} julskinka per person, enligt Svenskt Kött. Lagar du skinkan själv är det ${h.t('sjalv-utan')} utan ben och ${h.t('sjalv-med')} med ben.`,
      svar: `<b>${h.r('jul-min', 'jul-maks')} julskinka per person</b> på ett julbord med många rätter. Egen skinka: ${h.t('sjalv-utan')} utan ben, ${h.t('sjalv-med')} med ben. Till 8 personer blir det ${h.sumR('jul-min', 'jul-maks', 8)} på ett julbord.`,
      avsnitt: [
        ['Det som ändrar mängden', p(`${h.k('skjul')} anger ${h.r('jul-min', 'jul-maks')} per person på ett traditionellt julbord där mycket annat står framdukat. ${h.k('skgris')} anger ${h.t('sjalv-utan')} per person utan ben och ${h.t('sjalv-med')} med ben när du lagar skinkan själv, och ${h.t('farg')} av färdiglagad skinka.`, `Som pålägg anger Svenskt Kött ${h.t('skinka-pal')} skinka per portion. Kassler är ${h.t('kassler')} utan ben och ${h.t('kassler-ben')} med ben. Skinkstek: ${h.s('stek')}`, BARN)],
      ],
      faq: [
        ['Hur mycket julskinka per person?', `${h.k('skjul')} anger ${h.r('jul-min', 'jul-maks')} per person på ett julbord med många rätter.`],
        ['Hur stor skinka behöver man när man lagar den själv?', `${h.k('skgris')} anger ${h.t('sjalv-utan')} per person utan ben och ${h.t('sjalv-med')} med ben.`],
        ['Hur mycket kassler per person?', `${h.k('skinkop')} anger ${h.t('kassler')} per portion utan ben och ${h.t('kassler-ben')} med ben.`],
      ],
      soster: [S('svin', 'Hur mycket griskött per person?'), ['/sv/tillagningstid/julskinka/', 'Julskinka: hur länge och till vilken innertemperatur?']],
    }),
  },

  korv: {
    varianter: [V('Korv, till exempel falukorv', 'korv'), V('Isterband', 'isterband'), V('Pölsa', ['polsa-min', 'polsa-maks']), V('Blodpudding', 'blod'), V('Sylta', ['sylta-min', 'sylta-maks']), V('Pålägg till smörgås', 'palagg')],
    tekst: (h) => ({
      title: 'Hur mycket korv per person? Kalkylator och tabell',
      h1: 'Hur mycket korv och charkuterier per person?',
      description: `Svenskt Kött (2026): ${h.t('korv')} korv, till exempel falukorv, per portion. Isterband ${h.t('isterband')}, pålägg ${h.t('palagg')}. Kalkylator, tabell för 2 till 12 personer och källa.`,
      lead: `Svenskt Kött anger ${h.t('korv')} korv, till exempel falukorv, per portion. Skriv in hur många som ska äta, så får du hela mängden.`,
      svar: `<b>${h.t('korv')} korv per person</b>, till exempel falukorv. Till 4 personer blir det ${h.sum('korv', 4)}.`,
      avsnitt: [['Det som ändrar mängden', p(`Isterband är ${h.t('isterband')} per portion, pölsa ${h.r('polsa-min', 'polsa-maks')}, blodpudding ${h.t('blod')} och sylta ${h.r('sylta-min', 'sylta-maks')}. Som pålägg till en smörgås anger Svenskt Kött ${h.t('palagg')}.`, BARN)]],
      faq: [
        ['Hur mycket korv per person?', `${h.k('skinkop')} anger ${h.t('korv')} korv, till exempel falukorv, per portion.`],
        ['Hur mycket pålägg per smörgås?', `${h.k('skinkop')} anger ${h.t('palagg')} per smörgås.`],
      ],
      soster: [S('kott', 'Hur mycket kött per person?'), S('kottfars', 'Hur mycket köttfärs per person?')],
    }),
  },

  laks: {
    varianter: [V('Gravad lax som huvudrätt', 'huvud'), V('Gravad lax som del av en buffé', 'buffe'), V('Gravad lax som förrätt', 'forratt')],
    tekst: (h) => ({
      title: 'Hur mycket lax per person? Kalkylator och tabell',
      h1: 'Hur mycket lax per person?',
      description: `Arla (2026): ${h.t('huvud')} gravad lax per person som huvudrätt, ${h.t('buffe')} på buffé och ${h.t('forratt')} som förrätt. Kalkylator, tabell för 2 till 12 personer och källa.`,
      lead: `Arla räknar med ${h.t('huvud')} gravad lax per person som huvudrätt, ${h.t('buffe')} som en del av en buffé och ${h.t('forratt')} som förrätt. Siffrorna gäller gravad lax.`,
      svar: `<b>${h.t('huvud')} gravad lax per person som huvudrätt</b>, ${h.t('buffe')} på buffé och ${h.t('forratt')} som förrätt. Till 4 personer blir det ${h.sum('huvud', 4)} som huvudrätt.`,
      avsnitt: [['Det som ändrar mängden', p(`${h.s('beror')} Siffrorna gäller gravad lax. För rå laxfilé har vi inte hittat en svensk källa med mängd per person, så den siffran saknas.`, BARN)]],
      faq: [
        ['Hur mycket gravad lax per person?', `${h.k('arlalax')} anger ${h.t('huvud')} som huvudrätt, ${h.t('buffe')} som en del av en buffé och ${h.t('forratt')} som förrätt.`],
        ['Hur mycket gravad lax till 8 personer?', `Som huvudrätt blir det ${h.sum('huvud', 8)}, och på en buffé ${h.sum('buffe', 8)}.`],
      ],
      soster: [['/sv/tillagningstid/lax-i-ugn/', 'Lax i ugn: tid och temperatur'], ['/sv/airfryer/lax/', 'Lax i airfryer']],
    }),
  },
};

/** Samlingssidan: rubrik, ingress, kort svar och avsnitt. `per` har varje rads första variant och källa. */
export function nav({ rader, h, per, p: pp, esc }) {
  const rad = (id) => rader.find((r) => r.id === id);
  const pasta = h(rad('pasta'));
  const ris = h(rad('ris'));
  const pot = h(rad('poteter'));
  const kott = h(rad('kjott'));
  const jul = h(rad('skinke'));
  const huvudKalla = per.find((x) => x.rad.id === 'pasta').kalla;
  return {
    title: 'Hur mycket mat per person? Kalkylator och tabell',
    description: `Hur mycket mat per person? Kalkylator och tabell för ${rader.length} varor, från ris och pasta till kött och julskinka, med källa på varje siffra från Arla, Svenskt Kött och Kungsörnen.`,
    h1: 'Hur mycket mat per person?',
    lead: 'Välj varan, skriv in hur många som ska äta, så får du hela mängden. Varje siffra är hämtad från en svensk källa.',
    kortsvar: `Arla räknar ${pasta.t('arla')} okokt pasta, ungefär ${ris.t('pp')} okokt ris och runt ${pot.t('pp')} potatis per person. Svenskt Kött anger ${kott.r('benfritt-min', 'benfritt-maks')} benfritt kött per portion.`,
    huvudKalla,
    avsnitt: [
      ['Så räknar vi', pp(
        'Varje siffra på sidorna är hämtad från en källa, och källan står med länk och år på sidan. Vi räknar inte ut egna siffror för vad som är lagom. Det enda vi gör är att multiplicera källans siffra per person med antalet personer.',
        'Där källorna anger mängden för flera personer, till exempel till 4 personer, delar vi den med antalet personer. Där källorna är oeniga visar sidan båda siffrorna.',
        'Barn: vi har inte hittat en svensk källa som anger hur mycket barn äter jämfört med vuxna. Därför räknar kalkylatorn personer, och vi ger ingen siffra för barn.',
      )],
      ['Till fest och helg', pp(`På ett traditionellt julbord anger Svenskt Kött ${jul.r('jul-min', 'jul-maks')} julskinka per person (${jul.kp('skjul')}).`) + `<ul><li><a href="${M}julskinka/">Hur mycket julskinka per person?</a></li><li><a href="${M}laks/">Hur mycket lax per person?</a></li></ul>`],
    ],
    faq: [
      ['Hur mycket pasta per person?', `${pasta.k('arlapasta')} räknar ${pasta.t('arla')} okokt pasta per portion i sina recept.`],
      ['Hur mycket ris per person?', `${ris.k('arlaris')} anger ungefär ${ris.t('pp')} okokt ris per portion.`],
      ['Hur mycket kött per person?', `${kott.k('skinkop')} anger ${kott.r('benfritt-min', 'benfritt-maks')} benfritt kött per portion, och mer när köttet har ben.`],
      ['Hur kommer det sig att barn inte finns i kalkylatorn?', 'Vi har inte hittat en svensk källa som anger hur mycket barn äter jämfört med vuxna. Vi hittar hellre inte på en siffra.'],
    ],
  };
}

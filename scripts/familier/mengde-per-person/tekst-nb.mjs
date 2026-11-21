// Den håndskrevne delen av sidene for «mengde per person» (nb). Alt annet skrives av malen fra data.nb.json.
// Hver side har `varianter` (valgene i kalkulatoren og radene i tabellen) og `tekst(h)`.
//   V(navn, ...deler): en variant. En del er et tallfelt i datafila, eller [minFelt, maksFelt] for et intervall.
//   h gir tallene: h.t(felt) «60 g», h.r(min, maks) «60 til 100 g», h.n(felt) «60», h.sum(felt, 4) «240 g» for 4 voksne,
//   h.sumR(min, maks, 4), h.k(kilde) «MatPrat (2023)», h.sprik([[kilde, beskrivelse, tekst]]) en liten kildetabell.
// Ingen tall skrives for hånd, bortsett fra antall personer fra tabellen (2, 4, 6, 8, 10, 12). Hvert tall kommer fra en kilde, og tallene i prosaen
// er de samme som kalkulatoren bruker. Ingen setning her skal påstå mer enn kilden sier.
const V = (navn, ...deler) => ({ navn, deler });
const BARN = (h) => `Små barn spiser ofte mindre. ${h.k('mp-julemat')} sier at du gjerne kan regne en halv porsjon til dem og en full porsjon til ungdom og voksne. Kalkulatoren gjør det: hvert barn teller som en halv voksen.`;
const SULT = (h) => `${h.k('mp-selskaper')} sier at du bør beregne litt mer mat hvis gjestene er sultne, og litt mindre hvis det er mange barn.`;
const BUFFET = (h) => `Står maten på en buffet med flere retter, regner ${h.k('mp-selskaper')} med ${h.t('buffet-kg')} poteter, ris og pasta til sammen til ${h.t('buffet-personer')}.`;
const p = (...xs) => xs.filter(Boolean).map((x) => `<p>${x}</p>`).join('');
const ul = (xs) => `<ul>${xs.map((x) => `<li>${x}</li>`).join('')}</ul>`;

export const TEKST = {
  ris: {
    varianter: [V('Tørr ris', 'pp-g', 'pp-dl')],
    tekst: (h) => ({
      title: 'Hvor mye ris per person? Kalkulator og tabell',
      h1: 'Hvor mye ris per person?',
      description: `MatPrat regner ${h.t('pp-dl')} tørr ris per person, omtrent ${h.t('pp-g')}. Kalkulator for voksne og barn, tabell for 2 til 12 personer og kilder.`,
      lead: `Regn ${h.t('pp-dl')} ris per person, omtrent ${h.t('pp-g')}. Skriv inn hvor mange som skal spise, så får du hele mengden.`,
      svar: `<b>${h.t('pp-dl')} tørr ris per person</b>, omtrent ${h.t('pp-g')}. Til 4 voksne blir det ${h.sum('pp-g', 4)}, eller ${h.sum('pp-dl', 4)}.`,
      avsnitt: [
        ['Det som endrer mengden', p(
          `${h.k('mp-porsjon')} sier at hvor mye du beregner per person, avhenger av hva du skal lage. Tallet står i MatPrats oversikt over poteter, ris og pasta til et måltid. Kilden skriver ikke «tørr» ved ris, men tallet står sammen med tørre varer som pasta, og vi leser det som tørr ris.`,
          BARN(h), BUFFET(h), SULT(h),
        )],
        ['Kildene side om side', p('Vi har to kilder for ris. De ligger nær hverandre, og vi bruker MatPrats tall fordi det er oppgitt både i dl og gram.')
          + h.sprik([['mp-porsjon', 'Ris, bulgur, couscous, perlegryn og quinoa, per person', `${h.t('pp-dl')}, omtrent ${h.t('pp-g')}`], ['hdir-porsjon', 'Ris, tørr, vekt per porsjon', h.t('hdir-g')]])],
      ],
      faq: [
        ['Hvor mye ris per person til middag?', `MatPrat regner ${h.t('pp-dl')} tørr ris, omtrent ${h.t('pp-g')}, per person (${h.kp('mp-porsjon')}).`],
        ['Hvor mye ris trenger jeg til 4 personer?', `Til 4 voksne blir det ${h.sum('pp-g', 4)}, eller ${h.sum('pp-dl', 4)}. Er det barn med, teller hvert barn som en halv voksen.`],
        ['Hvor mye ris trenger jeg til 10 personer?', `Til 10 voksne blir det ${h.sum('pp-g', 10)}, eller ${h.sum('pp-dl', 10)}.`],
        ['Er tallet for tørr eller kokt ris?', 'Vi leser det som tørr ris, målt før koking. MatPrat skriver ikke «tørr» ved ris, men tallet står i en liste sammen med tørre varer. Helsedirektoratets tabell oppgir tørr ris for sitt tall.'],
      ],
      soster: [['/mengde-per-person/pasta/', 'Hvor mye pasta per person?'], ['/mengde-per-person/poteter/', 'Hvor mye poteter per person?'], ['/mengde-per-person/mat-til-selskap/', 'Hvor mye mat til selskap?']],
    }),
  },

  pasta: {
    varianter: [V('Spagetti og tagliatelle, tørr', ['spag-min', 'spag-maks']), V('Makaroni og annen liten pasta, tørr', 'mak-g', 'mak-dl')],
    tekst: (h) => ({
      title: 'Hvor mye pasta per person? Kalkulator og tabell',
      h1: 'Hvor mye pasta per person?',
      description: `MatPrat regner ${h.r('spag-min', 'spag-maks')} tørr spagetti per person og ${h.t('mak-g')} makaroni. Kalkulator, tabell for 2 til 12 personer og kilder.`,
      lead: `Regn ${h.r('spag-min', 'spag-maks')} tørr spagetti eller tagliatelle per person. Liten pasta som makaroni regnes som ${h.t('mak-dl')}, omtrent ${h.t('mak-g')}.`,
      svar: `<b>${h.r('spag-min', 'spag-maks')} tørr spagetti per person</b>. Makaroni og annen liten pasta: ${h.t('mak-dl')}, omtrent ${h.t('mak-g')}. Til 4 voksne blir det ${h.sumR('spag-min', 'spag-maks', 4)} spagetti.`,
      avsnitt: [
        ['Mål pastaen uten vekt', p(
          `${h.k('mp-porsjon')} har to knep. Med hånden: tommel og pekefinger som danner et hull på størrelse med et kronestykke, tilsvarer en porsjon spagetti, ${h.t('tommel')}. Med redskap: mange pastasleiver har hull i midten, og det tilsvarer en porsjon pasta.`,
        )],
        ['Det som endrer mengden', p(
          `Spennet mellom ${h.t('spag-min')} og ${h.t('spag-maks')} er kildens egen. Regn nær det laveste når pastaen er en del av et stort måltid med mye tilbehør, og nær det høyeste når pastaen er hovedsaken. Det siste er vår lesning av spennet, ikke noe kilden sier.`,
          BARN(h), BUFFET(h),
        )],
        ['Kildene side om side', p('Helsedirektoratets tabell har egne tall for tørr pasta. De ligger i samme område som MatPrats.')
          + h.sprik([['mp-porsjon', 'Spagetti og tagliatelle, per person', h.r('spag-min', 'spag-maks')], ['hdir-porsjon', 'Spagetti, tørr, vekt per porsjon', h.t('hdir-spag')], ['mp-porsjon', 'Makaroni og annen liten pasta, per person', h.t('mak-g')], ['hdir-porsjon', 'Makaroni, tørr, vekt per porsjon', h.t('hdir-mak')], ['hdir-porsjon', 'Pasta, tørr, vekt per porsjon', h.t('hdir-pasta')]])],
      ],
      faq: [
        ['Hvor mye spagetti per person?', `MatPrat regner ${h.r('spag-min', 'spag-maks')} tørr spagetti per person (${h.kp('mp-porsjon')}).`],
        ['Hvor mye pasta til 4 personer?', `Med spagetti blir det ${h.sumR('spag-min', 'spag-maks', 4)} til 4 voksne. Med makaroni blir det ${h.sum('mak-g', 4)}, eller ${h.sum('mak-dl', 4)}.`],
        ['Hvor mye pasta til 10 personer?', `Med spagetti blir det ${h.sumR('spag-min', 'spag-maks', 10)} til 10 voksne.`],
        ['Hvordan måler jeg en porsjon spagetti uten vekt?', `MatPrat sier at tommel og pekefinger som danner et hull på størrelse med et kronestykke, tilsvarer ${h.t('tommel')}.`],
      ],
      soster: [['/mengde-per-person/ris/', 'Hvor mye ris per person?'], ['/mengde-per-person/kjottdeig/', 'Hvor mye kjøttdeig per person?'], ['/mengde-per-person/mat-til-selskap/', 'Hvor mye mat til selskap?']],
    }),
  },

  poteter: {
    varianter: [V('Poteter', 'pp'), V('Potetsalat på koldtbord', 'potetsalat')],
    tekst: (h) => ({
      title: 'Hvor mye poteter per person? Kalkulator og tabell',
      h1: 'Hvor mye poteter per person?',
      description: `MatPrat regner ${h.t('pp')} poteter per person, både til hverdags og til julemat. Kalkulator, tabell for 2 til 12 personer og kilder.`,
      lead: `Regn ${h.t('pp')} poteter per person. Skriv inn hvor mange dere er, så får du hele mengden.`,
      svar: `<b>${h.t('pp')} poteter per person.</b> Til 4 voksne blir det ${h.sum('pp', 4)}, og til 10 voksne ${h.sum('pp', 10)}.`,
      avsnitt: [
        ['Det som endrer mengden', p(
          `To MatPrat-sider gir det samme tallet: ${h.k('mp-porsjon')} og ${h.k('mp-julemat')}. Poteter står der som tilbehør, med ${h.t('pp')} per person.`,
          `MatPrat oppgir ikke om ${h.t('pp')} er rå eller kokt vekt. Helsedirektoratets tabell har ${h.t('hdir-kokt')} for en porsjon kokt potet, så du kan bruke den som sammenligning.`,
          `På et koldtbord er potetsalat én av flere retter. ${h.k('mp-koldtbord')} regner ${h.t('potetsalat')} per porsjon.`,
          BUFFET(h), BARN(h),
        )],
        ['Kildene side om side', h.sprik([['mp-porsjon', 'Poteter, per person (hverdag)', h.t('pp')], ['mp-julemat', 'Poteter, per person (julemat)', h.t('pp-jul')], ['hdir-porsjon', 'Potet, kokt, vekt per porsjon', h.t('hdir-kokt')]])],
      ],
      faq: [
        ['Hvor mye poteter per person?', `MatPrat regner ${h.t('pp')} poteter per person.`],
        ['Hvor mye poteter til 4 personer?', `Til 4 voksne blir det ${h.sum('pp', 4)}.`],
        ['Hvor mye poteter til 12 personer?', `Til 12 voksne blir det ${h.sum('pp', 12)}.`],
        ['Er det rå eller kokt vekt?', `MatPrat sier det ikke. Helsedirektoratets tabell gir ${h.t('hdir-kokt')} for en porsjon kokt potet.`],
      ],
      soster: [['/mengde-per-person/ris/', 'Hvor mye ris per person?'], ['/mengde-per-person/ribbe/', 'Hvor mye ribbe per person?'], ['/mengde-per-person/pinnekjott/', 'Hvor mye pinnekjøtt per person?']],
    }),
  },

  kjott: {
    varianter: [
      V('Kjøtt uten ben til gryteretter', 'gryte-uten'), V('Kjøtt med ben til gryteretter', 'gryte-med'), V('Kjøtt med mye ben, som fårikål og lammekoteletter', 'mye-ben'),
      V('Fileter og biffer', 'fileter'), V('Stek uten ben', 'stek-uten'), V('Stek med ben', ['stek-med-min', 'stek-med-maks']),
      V('Svinekoteletter', 'kotelett'), V('Kjøttdeig og karbonadedeig', ['deig-min', 'deig-maks']), V('Pølser', 'polser'), V('Spareribs', 'ribs'),
    ],
    tekst: (h) => ({
      title: 'Hvor mye kjøtt per person? Kalkulator og tabell',
      h1: 'Hvor mye kjøtt per person?',
      description: `Det kommer an på kjøttet: ${h.t('gryte-uten')} uten ben til gryte, ${h.t('fileter')} filet og biff, ${h.t('kotelett')} koteletter. Kalkulator og tabell etter MatPrat.`,
      lead: 'Hvor mye kjøtt du trenger, avhenger av om kjøttet har ben og hva du serverer til. Velg type i kalkulatoren, så får du mengden.',
      svar: `<b>Kjøtt uten ben:</b> ${h.t('gryte-uten')} til gryterett og ${h.t('fileter')} som filet eller biff. <b>Kjøtt med ben:</b> ${h.t('gryte-med')} til gryterett og ${h.t('kotelett')} som koteletter.`,
      avsnitt: [
        ['Det som endrer mengden', p(
          `${h.k('mp-mange')} sier at du må tenke på om det er rent kjøtt eller en stykningsdel med en del ben. Du bør også tenke over om du serverer kjøttet med lite eller mye tilbehør, og om tilbehøret er svært mettende.`,
          `${h.k('mp-porsjon')} kaller tallene cirkaberegninger. I mange retter kan mengden justeres ned, og kjøtt og fisk kan suppleres eller erstattes av andre proteiner. Der er kjøtt uten ben oppgitt til ${h.r('uten-ben-min', 'uten-ben-maks')} og kjøtt med ben til ${h.t('med-ben')}.`,
          BARN(h), SULT(h),
        )],
        ['Eldre og nyere tall', p(`Tabellen over følger ${h.k('mp-mange')}, som har flest typer. ${h.k('mp-porsjon')} er nyere og har færre linjer, og to av dem avviker: kjøttdeig er ${h.r('deig-min', 'deig-maks')} (nyere) mot ${h.t('deig-eldre')} (eldre), og kjøtt uten ben er ${h.r('uten-ben-min', 'uten-ben-maks')} (nyere) mot ${h.t('gryte-uten')} til gryteretter (eldre). Kalkulatoren bruker det nyere tallet der det finnes.`)],
      ],
      faq: [
        ['Hvor mye kjøtt per person til middag?', `Kjøtt uten ben: ${h.r('uten-ben-min', 'uten-ben-maks')}. Kjøtt med ben: ${h.t('med-ben')} (${h.kp('mp-porsjon')}).`],
        ['Hvor mye kjøtt til 4 personer?', `Med kjøtt uten ben til gryterett blir det ${h.sum('gryte-uten', 4)} til 4 voksne. Med ben blir det ${h.sum('gryte-med', 4)}.`],
        ['Hvor mye kjøtt til 10 personer?', `Med filet eller biff blir det ${h.sum('fileter', 10)} til 10 voksne.`],
        ['Hva er forskjellen på kjøtt med og uten ben?', 'Ben veier med, så kjøtt med ben trenger mer vekt per person. Derfor har MatPrat to tall: mindre for rent kjøtt og mer for en stykningsdel med ben.'],
      ],
      soster: [['/mengde-per-person/biff/', 'Hvor mye biff per person?'], ['/mengde-per-person/svin/', 'Hvor mye svin per person?'], ['/mengde-per-person/lam/', 'Hvor mye lam per person?'], ['/mengde-per-person/kjottdeig/', 'Hvor mye kjøttdeig per person?']],
    }),
  },

  biff: {
    varianter: [V('Fileter og biffer', 'fileter'), V('Stek uten ben', 'stek-uten'), V('Stek med ben', ['stek-med-min', 'stek-med-maks']), V('Roastbiff på koldtbord', 'roastbiff')],
    tekst: (h) => ({
      title: 'Hvor mye biff per person? Kalkulator og tabell',
      h1: 'Hvor mye biff per person?',
      description: `MatPrat regner ${h.t('fileter')} fileter og biffer per person, og ${h.t('roastbiff')} roastbiff per porsjon på koldtbord. Kalkulator og tabell.`,
      lead: `Regn ${h.t('fileter')} biff eller filet per person. Skal biffen skjæres opp på et koldtbord, regner MatPrat ${h.t('roastbiff')} per porsjon.`,
      svar: `<b>${h.t('fileter')} biff eller filet per person.</b> Til 4 voksne blir det ${h.sum('fileter', 4)}, og til 10 voksne ${h.sum('fileter', 10)}.`,
      avsnitt: [
        ['Biff som hovedrett eller som pålegg', p(
          `Som hovedrett står fileter og biffer med ${h.t('fileter')} hos ${h.k('mp-mange')}. En stek uten ben har samme tall, ${h.t('stek-uten')}, og en stek med ben er ${h.r('stek-med-min', 'stek-med-maks')}.`,
          `På et koldtbord er biffen bare én av mange retter. ${h.k('mp-koldtbord')} regner ${h.t('roastbiff')} roastbiff per porsjon.`,
        )],
        ['Det som endrer mengden', p(
          'Tilbehøret avgjør mye. MatPrat sier at du bør tenke over om du serverer kjøttet med lite eller mye tilbehør, og om tilbehøret er svært mettende.',
          BARN(h),
          `Til et selskap regner ${h.k('mp-mange')} ca. ${h.t('mat-total')} mat per person, hvor om lag halvparten er kjøtt eller fisk.`,
        )],
      ],
      faq: [
        ['Hvor mye biff per person?', `MatPrat regner ${h.t('fileter')} fileter og biffer per person.`],
        ['Hvor mye roastbiff per person?', `Som en del av et koldtbord regner MatPrat ${h.t('roastbiff')} per porsjon (${h.kp('mp-koldtbord')}).`],
        ['Hvor mye biff til 6 personer?', `Til 6 voksne blir det ${h.sum('fileter', 6)} biff eller filet.`],
      ],
      soster: [['/mengde-per-person/kjott/', 'Hvor mye kjøtt per person?'], ['/mengde-per-person/koldtbord/', 'Hvor mye mat til koldtbord?'], ['/mengde-per-person/svin/', 'Hvor mye svinekjøtt per person?']],
    }),
  },

  svin: {
    varianter: [V('Svinekoteletter', 'kotelett'), V('Skinkestek', 'skinkestek'), V('Ribbe', 'ribbe'), V('Spareribs', 'ribs'), V('Pølser', 'polser'), V('Røkt skinke på koldtbord', 'roket-skinke')],
    tekst: (h) => ({
      title: 'Hvor mye svinekjøtt per person? Kalkulator og tabell',
      h1: 'Hvor mye svinekjøtt per person?',
      description: `MatPrat regner ${h.t('kotelett')} svinekoteletter, ${h.t('skinkestek')} skinkestek og ${h.t('ribbe')} ribbe per person. Kalkulator og tabell for 2 til 12 personer.`,
      lead: `Svinekoteletter regnes som ${h.t('kotelett')} per person, skinkestek som ${h.t('skinkestek')} og ribbe som ${h.t('ribbe')}. Velg i kalkulatoren.`,
      svar: `<b>${h.t('kotelett')} svinekoteletter per person.</b> Skinkestek: ${h.t('skinkestek')}. Ribbe: ${h.t('ribbe')}. Spareribs: ${h.t('ribs')}.`,
      avsnitt: [
        ['Ulike deler, ulike tall', p(
          `Koteletter har ben og får ${h.t('kotelett')}. To MatPrat-sider gir det samme tallet, ${h.k('mp-mange')} og ${h.k('mp-porsjon')}. Skinkestek står hos ${h.k('mp-julemat')} sammen med andre steker, med ${h.t('skinkestek')}.`,
          `Spareribs er mest ben og er den største porsjonen i tabellen, ${h.t('ribs')}. Pølser regnes som ${h.t('polser')}. Røkt skinke som pålegg på et koldtbord er ${h.t('roket-skinke')} per porsjon (${h.kp('mp-koldtbord')}).`,
        )],
        ['Det som endrer mengden', p(
          'MatPrat sier at du bør tenke over om du serverer kjøttet med lite eller mye tilbehør. Det står ikke som en tallregel, så vi gir ikke et tillegg.',
          BARN(h),
        )],
      ],
      faq: [
        ['Hvor mye svinekoteletter per person?', `MatPrat regner ${h.t('kotelett')} svinekoteletter per person.`],
        ['Hvor mye skinkestek per person?', `${h.k('mp-julemat')} regner ${h.t('skinkestek')} per person for skinkestek og andre typer stek.`],
        ['Hvor mye svinekoteletter til 4 personer?', `Til 4 voksne blir det ${h.sum('kotelett', 4)}.`],
        ['Hvor mye ribbe per person?', `Se siden om ribbe. MatPrat regner ${h.t('ribbe')} per person.`],
      ],
      soster: [['/mengde-per-person/ribbe/', 'Hvor mye ribbe per person?'], ['/mengde-per-person/grillmat/', 'Hvor mye grillmat per person?'], ['/mengde-per-person/kjott/', 'Hvor mye kjøtt per person?']],
    }),
  },

  lam: {
    varianter: [V('Fårikål og lammekoteletter (kjøtt med mye ben)', 'mye-ben'), V('Stek med ben', ['stek-med-min', 'stek-med-maks']), V('Gryterett med kjøtt med ben', 'gryte-med'), V('Gryterett med kjøtt uten ben', 'gryte-uten'), V('Pinnekjøtt, tørrvekt', 'pinne-toer')],
    tekst: (h) => ({
      title: 'Hvor mye lammekjøtt per person? Kalkulator og tabell',
      h1: 'Hvor mye lammekjøtt per person?',
      description: `Fårikål og lammekoteletter regnes som ${h.t('mye-ben')} per person hos MatPrat. Kalkulator, tabell for 2 til 12 personer og kilder.`,
      lead: `For fårikål og lammekoteletter regner MatPrat ${h.t('mye-ben')} per person. MatPrat har ingen egen linje bare for lam, så andre typer må leses av tabellen for kjøtt.`,
      svar: `<b>${h.t('mye-ben')} per person</b> til fårikål og lammekoteletter. Til 4 voksne blir det ${h.sum('mye-ben', 4)}, og til 10 voksne ${h.sum('mye-ben', 10)}.`,
      avsnitt: [
        ['Hvilket tall passer til lammet?', p(
          `${h.k('mp-mange')} nevner lam bare i linjen «Kjøtt med mye ben (fårikål, lammekoteletter)»: ${h.t('mye-ben')}. Lam uten ben i en gryterett hører under «kjøtt uten ben til gryteretter», ${h.t('gryte-uten')}. En stek med ben er ${h.r('stek-med-min', 'stek-med-maks')}.`,
          `Hvilken linje som passer til din lammestek, er din vurdering. Kilden skriver ikke «lammestek».`,
        )],
        ['Pinnekjøtt er en egen sak', p(`Pinnekjøtt har egne tall og en egen side. Tørket pinnekjøtt regnes som ${h.t('pinne-toer')} per person (${h.kp('mp-julemat')}).`)],
        ['Det som endrer mengden', p(`Mye ben gir mer vekt per person. Derfor er tallet for fårikål og lammekoteletter høyere enn for kjøtt med ben i en gryterett, ${h.t('gryte-med')}.`, BARN(h))],
      ],
      faq: [
        ['Hvor mye lam per person til fårikål?', `MatPrat regner ${h.t('mye-ben')} per person for kjøtt med mye ben, som fårikål.`],
        ['Hvor mye lammekoteletter per person?', `Lammekoteletter står i samme linje som fårikål, ${h.t('mye-ben')} per person.`],
        ['Hvor mye lammekjøtt til 6 personer?', `Med ${h.t('mye-ben')} per person blir det ${h.sum('mye-ben', 6)} til 6 voksne.`],
        ['Hvor mye lammestek per person?', `MatPrat har ingen egen linje for lammestek. Linjen for stek med ben er ${h.r('stek-med-min', 'stek-med-maks')}.`],
      ],
      soster: [['/mengde-per-person/pinnekjott/', 'Hvor mye pinnekjøtt per person?'], ['/mengde-per-person/kjott/', 'Hvor mye kjøtt per person?'], ['/mengde-per-person/julemat/', 'Hvor mye julemat per person?']],
    }),
  },

  kjottdeig: {
    varianter: [V('Kjøttdeig og karbonadedeig', ['pp-min', 'pp-maks'])],
    tekst: (h) => ({
      title: 'Hvor mye kjøttdeig per person? Kalkulator og tabell',
      h1: 'Hvor mye kjøttdeig per person?',
      description: `MatPrat regner ${h.r('pp-min', 'pp-maks')} kjøttdeig eller karbonadedeig per porsjon. Kalkulator for voksne og barn, tabell for 2 til 12 personer.`,
      lead: `Regn ${h.r('pp-min', 'pp-maks')} kjøttdeig per person. Den eldre MatPrat-siden har ${h.t('pp-eldre')}, øverst i samme spenn.`,
      svar: `<b>${h.r('pp-min', 'pp-maks')} kjøttdeig per person.</b> Til 4 voksne blir det ${h.sumR('pp-min', 'pp-maks', 4)}.`,
      avsnitt: [
        ['Taco, lasagne og kjøttsaus', p(
          `MatPrat har ikke egne tall for taco, lasagne eller kjøttsaus. Tallet gjelder kjøttdeig og karbonadedeig per porsjon, og du bruker det for retten du lager. Med mye tilbehør, som i en taco, kan du ligge nær ${h.t('pp-min')}. Det er vår lesning, ikke noe kilden sier.`,
        )],
        ['Eldre og nyere tall', p(`${h.k('mp-porsjon')} oppgir ${h.r('pp-min', 'pp-maks')}. ${h.k('mp-mange')} oppgir ${h.t('pp-eldre')}. Kalkulatoren bruker det nyere spennet.`)],
        ['Det som endrer mengden', p(
          `${h.k('mp-porsjon')} kaller tallene cirkaberegninger. I mange retter kan mengden justeres ned, og kjøtt kan suppleres eller erstattes av andre proteiner.`,
          BARN(h),
        )],
      ],
      faq: [
        ['Hvor mye kjøttdeig per person?', `MatPrat regner ${h.r('pp-min', 'pp-maks')} kjøttdeig eller karbonadedeig per porsjon.`],
        ['Hvor mye kjøttdeig til taco for 4?', `MatPrat har ingen egen linje for taco. Med tallet for kjøttdeig blir det ${h.sumR('pp-min', 'pp-maks', 4)} til 4 voksne.`],
        ['Hvor mye kjøttdeig til 10 personer?', `Til 10 voksne blir det ${h.sumR('pp-min', 'pp-maks', 10)}.`],
        ['Hvor mye kjøttdeig til 6 personer?', `Til 6 voksne blir det ${h.sumR('pp-min', 'pp-maks', 6)}.`],
      ],
      soster: [['/mengde-per-person/pasta/', 'Hvor mye pasta per person?'], ['/mengde-per-person/kjott/', 'Hvor mye kjøtt per person?'], ['/mengde-per-person/grillmat/', 'Hvor mye grillmat per person?']],
    }),
  },

  kylling: {
    varianter: [V('Hel kylling', 'hel'), V('Kjøtt uten ben', ['uten-ben-min', 'uten-ben-maks']), V('Kjøtt med ben', 'med-ben')],
    tekst: (h) => ({
      title: 'Hvor mye kylling per person? Kalkulator og tabell',
      h1: 'Hvor mye kylling per person?',
      description: `MatPrat regner ${h.t('hel')} hel kylling per person. Kjøtt uten ben er ${h.r('uten-ben-min', 'uten-ben-maks')}. Kalkulator og tabell for 2 til 12 personer.`,
      lead: `For hel kylling regner MatPrat ${h.t('hel')} per person. Kjøtt uten ben regnes som ${h.r('uten-ben-min', 'uten-ben-maks')}.`,
      svar: `<b>Hel kylling: ${h.t('hel')} per person.</b> Til 4 voksne blir det ${h.sum('hel', 4)}. Kjøtt uten ben: ${h.r('uten-ben-min', 'uten-ben-maks')} per person.`,
      avsnitt: [
        ['Hel kylling eller bare kjøtt', p(
          `Tallet ${h.t('hel')} gjelder hel kylling, altså med ben og skinn. ${h.k('mp-porsjon')} har ingen egen linje for kyllingfilet eller lår. Linjen for kjøtt uten ben er ${h.r('uten-ben-min', 'uten-ben-maks')}, og for kjøtt med ben ${h.t('med-ben')}. Hvilken som passer til din del av kyllingen, er din vurdering.`,
          `Til sammenligning regner ${h.k('mp-julemat')} ${h.t('kalkun-hel')} per person for hel kalkun.`,
        )],
        ['Det som endrer mengden', p('Hvor mye du beregner, avhenger av hva du skal lage og om kjøttet har ben, sier MatPrat. Tilbehøret teller også.', BARN(h))],
      ],
      faq: [
        ['Hvor mye kylling per person?', `Hel kylling: ${h.t('hel')} per person. Kjøtt uten ben: ${h.r('uten-ben-min', 'uten-ben-maks')} (${h.kp('mp-porsjon')}).`],
        ['Hvor mye kylling til 4 personer?', `Med hel kylling blir det ${h.sum('hel', 4)} til 4 voksne.`],
        ['Hvor mye kylling til 10 personer?', `Med hel kylling blir det ${h.sum('hel', 10)} til 10 voksne.`],
        ['Hvor mye kyllingfilet per person?', `MatPrat har ingen egen linje for kyllingfilet. Linjen for kjøtt uten ben er ${h.r('uten-ben-min', 'uten-ben-maks')}.`],
      ],
      soster: [['/mengde-per-person/kalkun/', 'Hvor mye kalkun per person?'], ['/mengde-per-person/kjott/', 'Hvor mye kjøtt per person?'], ['/mengde-per-person/grillmat/', 'Hvor mye grillmat per person?']],
    }),
  },

  fisk: {
    varianter: [V('Fiskefilet', 'filet'), V('Fisk i skiver, med ben', ['skiver-min', 'skiver-maks']), V('Hel fisk', 'hel'), V('Fisk til forrett', ['forrett-min', 'forrett-maks'])],
    tekst: (h) => ({
      title: 'Hvor mye fisk per person? Kalkulator og tabell',
      h1: 'Hvor mye fisk per person?',
      description: `MatPrat regner ${h.t('filet')} fiskefilet per person. Fisk i skiver med ben er ${h.r('skiver-min', 'skiver-maks')}. Kalkulator og tabell for 2 til 12 personer.`,
      lead: `Regn ${h.t('filet')} fiskefilet per person. Har fisken ben eller er hel, må du regne mer.`,
      svar: `<b>${h.t('filet')} fiskefilet per person.</b> Til 4 voksne blir det ${h.sum('filet', 4)}. Fisk i skiver med ben: ${h.r('skiver-min', 'skiver-maks')}. Hel fisk: ${h.t('hel')}.`,
      avsnitt: [
        ['Filet, skiver og hel fisk', p(
          `${h.k('mp-porsjon')} har ${h.t('filet')} for fiskefilet og ${h.r('skiver-min', 'skiver-maks')} for fisk hel eller i skiver. ${h.k('mp-mange')} har ${h.t('hel')} for hel fisk til hovedrett.`,
          `Til forrett regner ${h.k('mp-mange')} ${h.r('forrett-min', 'forrett-maks')} røkelaks, gravlaks eller filet. MatPrat sier at du kan beregne mindre til forrett eller når du serverer flere småretter.`,
        )],
        ['Eldre og nyere tall', p(`For filet har MatPrat gitt flere tall. ${h.k('mp-porsjon')} og ${h.k('mp-julemat')} sier ${h.t('filet')}. ${h.k('mp-mange')} og ${h.k('mp-fisk')} sier ${h.r('filet-eldre-min', 'filet-eldre-maks')}. Kalkulatoren bruker ${h.t('filet')}, fra de nyeste sidene.`)],
        ['Det som endrer mengden', p('Fisk som er røkt, gravet eller fet får mindre porsjoner. Se egen side om laks.', BARN(h), SULT(h))],
      ],
      faq: [
        ['Hvor mye fisk per person?', `Fiskefilet: ${h.t('filet')} per person (${h.kp('mp-porsjon')}).`],
        ['Hvor mye fisk til 4 personer?', `Med fiskefilet blir det ${h.sum('filet', 4)} til 4 voksne.`],
        ['Hvor mye fisk til 10 personer?', `Med fiskefilet blir det ${h.sum('filet', 10)} til 10 voksne.`],
        ['Hvor mye hel fisk per person?', `MatPrat regner ${h.t('hel')} per person for hel fisk til hovedrett (${h.kp('mp-mange')}).`],
      ],
      soster: [['/mengde-per-person/laks/', 'Hvor mye laks per person?'], ['/mengde-per-person/reker-og-skalldyr/', 'Hvor mye reker per person?'], ['/mengde-per-person/lutefisk/', 'Hvor mye lutefisk per person?']],
    }),
  },

  laks: {
    varianter: [V('Laksefilet til middag', 'filet'), V('Røkelaks og gravlaks til forrett', ['forrett-min', 'forrett-maks'])],
    tekst: (h) => ({
      title: 'Hvor mye laks per person? Kalkulator og tabell',
      h1: 'Hvor mye laks per person?',
      description: `Til middag regner MatPrat ${h.t('filet')} fiskefilet per person. Røkelaks og gravlaks til forrett er ${h.r('forrett-min', 'forrett-maks')}. Kalkulator og tabell.`,
      lead: `Til middag kan du regne ${h.t('filet')} fiskefilet per person. Røkelaks og gravlaks til forrett regnes som ${h.r('forrett-min', 'forrett-maks')}.`,
      svar: `<b>Middag: ${h.t('filet')} per person.</b> <b>Forrett:</b> ${h.r('forrett-min', 'forrett-maks')} røkelaks, gravlaks eller filet. Til 6 voksne blir det ${h.sum('filet', 6)} til middag.`,
      avsnitt: [
        ['Laks er ikke egen linje til middag', p(
          `MatPrat har tall for fiskefilet, ikke en egen linje for laks til middag. ${h.k('mp-porsjon')} sier ${h.t('filet')} fiskefilet, og ${h.k('mp-mange')} sier ${h.r('filet-eldre-min', 'filet-eldre-maks')}. Til forrett nevner ${h.k('mp-mange')} røkelaks og gravlaks ved navn: ${h.r('forrett-min', 'forrett-maks')}.`,
        )],
        ['Fet og bearbeidet fisk: regn litt mindre', p(`${h.k('mp-fisk')} sier med kilde Norges sjømatråd at du bør beregne noe mindre porsjoner av bearbeidet fisk, som lettsaltet, varm- eller kaldrøkt fisk og gravet fisk, og av fet fisk som laks, kveite, sild og makrell. Siden har ikke et tall for hvor mye mindre, så vi lager ikke noe.`)],
        ['Det som endrer mengden', p(BARN(h), SULT(h))],
      ],
      faq: [
        ['Hvor mye laks per person til middag?', `MatPrat regner ${h.t('filet')} fiskefilet per person. Siden sier også at fet fisk som laks kan regnes i noe mindre porsjoner.`],
        ['Hvor mye røkelaks per person til forrett?', `${h.r('forrett-min', 'forrett-maks')} per person (${h.kp('mp-mange')}).`],
        ['Hvor mye laks til 4 personer?', `Til 4 voksne blir det ${h.sum('filet', 4)} til middag.`],
        ['Hvor mye gravlaks per person?', `Til forrett ${h.r('forrett-min', 'forrett-maks')} per person.`],
      ],
      soster: [['/mengde-per-person/fisk/', 'Hvor mye fisk per person?'], ['/mengde-per-person/koldtbord/', 'Hvor mye mat til koldtbord?'], ['/mengde-per-person/reker-og-skalldyr/', 'Hvor mye reker per person?']],
    }),
  },

  'reker-og-skalldyr': {
    varianter: [V('Reker med skall', ['reker-min', 'reker-maks']), V('Rensede reker til salat', ['reker-rene-min', 'reker-rene-maks']), V('Blåskjell til hovedrett', ['skjell-min', 'skjell-maks']), V('Blåskjell til forrett', 'skjell-forrett'), V('Krabbeklør og trollkrabbeklør', ['klo-min', 'klo-maks'])],
    tekst: (h) => ({
      title: 'Hvor mye reker per person? Skalldyr, kalkulator og tabell',
      h1: 'Hvor mye reker per person?',
      description: `Reker med skall regnes som ${h.r('reker-min', 'reker-maks')} per person til hovedrett. Rensede reker til salat er ${h.r('reker-rene-min', 'reker-rene-maks')}. Kalkulator og tabell.`,
      lead: `Til hovedrett regner MatPrat ${h.r('reker-min', 'reker-maks')} reker med skall per person. Rensede reker i en salat regnes som ${h.r('reker-rene-min', 'reker-rene-maks')}.`,
      svar: `<b>Reker med skall: ${h.r('reker-min', 'reker-maks')} per person.</b> Rensede reker til salat: ${h.r('reker-rene-min', 'reker-rene-maks')}. Til 4 voksne blir det ${h.sumR('reker-min', 'reker-maks', 4)} reker med skall.`,
      avsnitt: [
        ['Skalldyr du teller i stykker', p(
          `Noen skalldyr regnes i stykker. ${h.k('mp-mange')}: krabbe eller hummer ${h.t('krabbe-stk')} per person (${h.r('hummer-min', 'hummer-maks')} per stykk), sjøkreps ${h.r('sjokreps-min', 'sjokreps-maks')}. ${h.k('mp-fisk')}: kreps ${h.r('kreps-min', 'kreps-maks')}.`,
        )],
        ['Flere typer på samme bord', p('Skal du servere flere typer skalldyr sammen, bør du ifølge MatPrat halvere mengden av hver sort, eller redusere ytterligere etter hvor mange ulike typer du serverer.')],
        ['Det som endrer mengden', p(`Reker i skall veier med skallet, derfor er tallet langt høyere enn for rensede reker. Til forrett eller som del av flere småretter kan du beregne mindre.`, `Blåskjell regnes som ${h.r('skjell-min', 'skjell-maks')} til hovedrett og ${h.t('skjell-forrett')} til forrett.`, BARN(h))],
      ],
      faq: [
        ['Hvor mye reker per person?', `Med skall til hovedrett: ${h.r('reker-min', 'reker-maks')}. Rensede til salat: ${h.r('reker-rene-min', 'reker-rene-maks')}.`],
        ['Hvor mye reker til 4 personer?', `Med skall blir det ${h.sumR('reker-min', 'reker-maks', 4)} til 4 voksne.`],
        ['Hvor mye reker til 10 personer?', `Med skall blir det ${h.sumR('reker-min', 'reker-maks', 10)} til 10 voksne.`],
        ['Hvor mye blåskjell per person?', `Til hovedrett ${h.r('skjell-min', 'skjell-maks')}, til forrett ${h.t('skjell-forrett')}.`],
      ],
      soster: [['/mengde-per-person/fisk/', 'Hvor mye fisk per person?'], ['/mengde-per-person/laks/', 'Hvor mye laks per person?'], ['/mengde-per-person/koldtbord/', 'Hvor mye mat til koldtbord?']],
    }),
  },

  lutefisk: {
    varianter: [V('Lutefisk', 'pp'), V('Lutefisk, storspisere', 'storspiser'), V('Bacon til lutefisk', 'bacon'), V('Poteter til lutefisk', 'poteter')],
    tekst: (h) => ({
      title: 'Hvor mye lutefisk per person? Kalkulator og tabell',
      h1: 'Hvor mye lutefisk per person?',
      description: `MatPrat regner ${h.t('pp')} lutefisk per person, og ${h.t('storspiser')} for storspisere. Kalkulator og tabell for 2 til 12 personer, med bacon og poteter.`,
      lead: `Regn ${h.t('pp')} lutefisk per person, og ${h.t('storspiser')} for storspisere. Bacon til lutefisken er ${h.t('bacon')}.`,
      svar: `<b>${h.t('pp')} lutefisk per person</b>, og ${h.t('storspiser')} for storspisere. Til 4 voksne blir det ${h.sum('pp', 4)}.`,
      avsnitt: [
        ['Lutefisk med tilbehør', p(
          `${h.k('mp-julemat')} gir tall for hele måltidet: lutefisk ${h.t('pp')}, bacon ${h.t('bacon')} og poteter ${h.t('poteter')} per person.`,
        )],
        ['Eldre og nyere tall', p(`Den eldre siden ${h.k('mp-fisk')} har et bredere spenn for lutefisk, ${h.r('eldre-min', 'eldre-maks')}. Kalkulatoren bruker de nyere tallene, ${h.t('pp')} og ${h.t('storspiser')} for storspisere.`)],
        ['Det som endrer mengden', p('Storspisere får mer. For vanlige spisere gjelder det laveste tallet.', BARN(h), SULT(h))],
      ],
      faq: [
        ['Hvor mye lutefisk per person?', `${h.t('pp')} per person, og ${h.t('storspiser')} for storspisere (${h.kp('mp-julemat')}).`],
        ['Hvor mye lutefisk til 4 personer?', `Til 4 voksne blir det ${h.sum('pp', 4)}.`],
        ['Hvor mye lutefisk til 10 personer?', `Til 10 voksne blir det ${h.sum('pp', 10)}.`],
        ['Hvor mye bacon til lutefisk?', `${h.t('bacon')} per person.`],
      ],
      soster: [['/mengde-per-person/julemat/', 'Hvor mye julemat per person?'], ['/mengde-per-person/fisk/', 'Hvor mye fisk per person?'], ['/mengde-per-person/poteter/', 'Hvor mye poteter per person?']],
    }),
  },

  pinnekjott: {
    varianter: [V('Pinnekjøtt, tørrvekt', 'toer'), V('Pinnekjøtt, tørrvekt, storspisere', 'toer-storspiser'), V('Pinnekjøtt, utvannet', 'utvannet'), V('Pinnekjøtt, utvannet, storspisere', 'utvannet-storspiser'), V('Vossakorv som tilbehør', 'vossakorv'), V('Kålrotstappe', ['kalrot-min', 'kalrot-maks']), V('Poteter', 'poteter'), V('Saus', ['saus-min', 'saus-maks'])],
    tekst: (h) => ({
      title: 'Hvor mye pinnekjøtt per person? Kalkulator og tabell',
      h1: 'Hvor mye pinnekjøtt per person?',
      description: `MatPrat regner ${h.t('toer')} tørket pinnekjøtt per person, og ${h.t('utvannet')} utvannet. Storspisere ${h.t('toer-storspiser')} og ${h.t('utvannet-storspiser')}. Kalkulator og tabell.`,
      lead: `Regn ${h.t('toer')} tørket pinnekjøtt per person, eller ${h.t('utvannet')} hvis kjøttet er ferdig utvannet.`,
      svar: `<b>Tørket: ${h.t('toer')} per person</b>, ${h.t('toer-storspiser')} for storspisere. <b>Utvannet:</b> ${h.t('utvannet')}, ${h.t('utvannet-storspiser')} for storspisere. Til 6 voksne blir det ${h.sum('toer', 6)} tørket.`,
      avsnitt: [
        ['Tørket eller utvannet', p(
          `Tallene gjelder vekten på kjøttet slik du kjøper det. Tørket pinnekjøtt veier mindre, fordi vannet ikke er med ennå, og derfor er tallet for utvannet pinnekjøtt, ${h.t('utvannet')}, høyere enn tallet for tørket, ${h.t('toer')}.`,
          `${h.k('mp-julemat')} og ${h.k('mp-julefaq')} gir de samme tallene.`,
        )],
        ['Tilbehør til pinnekjøttet', p(`${h.k('mp-julemat')} regner per person ${h.t('vossakorv')} vossakorv, ${h.r('kalrot-min', 'kalrot-maks')} kålrotstappe, ${h.t('poteter')} poteter og ${h.r('saus-min', 'saus-maks')} saus.`)],
        ['Det som endrer mengden', p(BARN(h), 'MatPrat har et eget tall for storspisere, og det ligger høyere. Bruk det hvis du vet at gjestene spiser mye.')],
      ],
      faq: [
        ['Hvor mye pinnekjøtt per person?', `${h.t('toer')} tørket, ${h.t('toer-storspiser')} for storspisere. Utvannet og klart til damping: ${h.t('utvannet')}, ${h.t('utvannet-storspiser')} for storspisere.`],
        ['Hvor mye pinnekjøtt til 4 personer?', `Tørket blir det ${h.sum('toer', 4)} til 4 voksne. Utvannet blir det ${h.sum('utvannet', 4)}.`],
        ['Hvor mye pinnekjøtt til 10 personer?', `Tørket blir det ${h.sum('toer', 10)} til 10 voksne. Utvannet blir det ${h.sum('utvannet', 10)}.`],
        ['Hvor mye kålrotstappe til pinnekjøtt?', `${h.r('kalrot-min', 'kalrot-maks')} per person (${h.kp('mp-julemat')}).`],
      ],
      soster: [['/mengde-per-person/julemat/', 'Hvor mye julemat per person?'], ['/mengde-per-person/ribbe/', 'Hvor mye ribbe per person?'], ['/mengde-per-person/poteter/', 'Hvor mye poteter per person?']],
    }),
  },

  ribbe: {
    varianter: [V('Ribbe', 'pp'), V('Ribbe, med rester til frokost', 'frokost'), V('Ribbe med pølse og medisterkaker', 'med-polse'), V('Medisterkaker eller medisterpølse som tilbehør', ['medister-til-min', 'medister-til-maks']), V('Medister alene', 'medister-alene'), V('Surkål eller rødkål', ['surkal-min', 'surkal-maks']), V('Poteter', 'poteter'), V('Saus', ['saus-min', 'saus-maks']), V('Ekstra grønnsaker, som rosenkål', ['ekstra-min', 'ekstra-maks'])],
    tekst: (h) => ({
      title: 'Hvor mye ribbe per person? Kalkulator og tabell',
      h1: 'Hvor mye ribbe per person?',
      description: `MatPrat regner ${h.t('pp')} ribbe per person, og ${h.t('frokost')} hvis det skal bli nok til frokost også. Kalkulator og tabell for 2 til 12 personer.`,
      lead: `Regn ${h.t('pp')} ribbe per person. Vil du ha nok til frokost dagen etter også, regner MatPrat ${h.t('frokost')}.`,
      svar: `<b>${h.t('pp')} ribbe per person</b>, eller ${h.t('frokost')} med frokost. Serverer du pølse og medisterkaker, er ribbe ${h.t('med-polse')}. Til 6 voksne blir det ${h.sum('pp', 6)}.`,
      avsnitt: [
        ['Med eller uten pølse og medisterkaker', p(
          `${h.k('mp-julemat')} gir to tall for ribbe. Alene er det ${h.t('pp')}. Når du serverer pølse og medisterkaker til, regner siden ${h.t('med-polse')} ribbe. Medisterkaker eller medisterpølse som tilbehør til ribbe er ${h.r('medister-til-min', 'medister-til-maks')}, og alene er de ${h.t('medister-alene')}.`,
        )],
        ['Tilbehør', p(`Per person regner ${h.k('mp-julemat')} ${h.t('poteter')} poteter, ${h.r('surkal-min', 'surkal-maks')} surkål eller rødkål, ${h.r('ekstra-min', 'ekstra-maks')} ekstra grønnsaker som rosenkål og ${h.r('saus-min', 'saus-maks')} saus.`)],
        ['Det som endrer mengden', p(`Tallet ${h.t('frokost')} er MatPrats eget tall for en ribbe som også skal gi mat dagen etter. Kalkulatoren har det som egen linje.`, BARN(h), SULT(h))],
      ],
      faq: [
        ['Hvor mye ribbe per person?', `${h.t('pp')} per person, og ${h.t('frokost')} hvis det skal bli nok til frokost også (${h.kp('mp-julemat')}).`],
        ['Hvor mye ribbe til 4 personer?', `Til 4 voksne blir det ${h.sum('pp', 4)}.`],
        ['Hvor mye ribbe til 10 personer?', `Til 10 voksne blir det ${h.sum('pp', 10)}.`],
        ['Hvor mye ribbe til 12 personer?', `Til 12 voksne blir det ${h.sum('pp', 12)}.`],
      ],
      soster: [['/mengde-per-person/julemat/', 'Hvor mye julemat per person?'], ['/mengde-per-person/pinnekjott/', 'Hvor mye pinnekjøtt per person?'], ['/mengde-per-person/poteter/', 'Hvor mye poteter per person?']],
    }),
  },

  kalkun: {
    varianter: [V('Hel kalkun', 'hel'), V('Kalkunfilet eller kalkunbryst', 'filet'), V('Skinkestek, reinsdyrstek og andre steker', 'stek')],
    tekst: (h) => ({
      title: 'Hvor mye kalkun per person? Hel kalkun og filet',
      h1: 'Hvor mye kalkun per person?',
      description: `MatPrat regner ${h.t('hel')} hel kalkun per person og ${h.t('filet')} kalkunfilet. En kalkun på ${h.t('kilo-stor')} holder til ${h.t('personer-stor')}. Kalkulator og tabell.`,
      lead: `Regn ${h.t('hel')} hel kalkun per person, eller ${h.t('filet')} hvis du steker kalkunfilet eller kalkunbryst.`,
      svar: `<b>Hel kalkun: ${h.t('hel')} per person.</b> Kalkunfilet: ${h.t('filet')}. En kalkun på ${h.t('kilo-stor')} holder til ${h.t('personer-stor')}.`,
      avsnitt: [
        ['Hvor stor kalkun trenger du?', p(
          `MatPrat regner ${h.t('hel-faq')} per person, og viser regnestykket: en kalkun på ${h.t('kilo-stor')} holder til ${h.t('personer-stor')} (${h.kp('mp-julefaq')}). Til ${h.t('personer-stor')} i tabellen over står det samme tallet, ${h.sum('hel', 12)}.`,
        )],
        ['Når kalkunen ikke rekker', p(`Er dere ${h.t('til-bords')} til bords og har bare plass til én kalkun, foreslår MatPrat å kjøpe to ferske kalkunfileter i tillegg og steke dem ved siden av den hele kalkunen. Da har du en stor kalkun å bære inn, og skiver av filet i tillegg.`)],
        ['Det som endrer mengden', p(`Filet har ikke ben, derfor er tallet lavere: ${h.t('filet')} mot ${h.t('hel')} for hel kalkun. Andre steker, som skinkestek og reinsdyrstek, har også ${h.t('stek')}.`, BARN(h))],
      ],
      faq: [
        ['Hvor mye kalkun per person?', `Hel kalkun: ${h.t('hel')} per person. Kalkunfilet: ${h.t('filet')} (${h.kp('mp-julemat')}).`],
        ['Hvor mange spiser en kalkun på 6 kilo?', `MatPrat regner ${h.t('hel-faq')} per person, så en kalkun på ${h.t('kilo-stor')} holder til ${h.t('personer-stor')}.`],
        ['Hvor stor kalkun til 8 personer?', `Med ${h.t('hel')} per person blir det ${h.sum('hel', 8)} til 8 voksne.`],
        ['Hvor stor kalkun til 10 personer?', `Med ${h.t('hel')} per person blir det ${h.sum('hel', 10)} til 10 voksne.`],
      ],
      soster: [['/mengde-per-person/julemat/', 'Hvor mye julemat per person?'], ['/mengde-per-person/kylling/', 'Hvor mye kylling per person?'], ['/mengde-per-person/ribbe/', 'Hvor mye ribbe per person?']],
    }),
  },

  julemat: {
    varianter: [
      V('Ribbe', 'ribbe'), V('Ribbe med pølse og medisterkaker', 'ribbe-polse'), V('Medisterkaker som tilbehør til ribbe', ['medister-til-min', 'medister-til-maks']), V('Medisterkaker alene', 'medister-alene'),
      V('Pinnekjøtt, tørrvekt', 'pinne-toer'), V('Pinnekjøtt, utvannet', 'pinne-utvannet'), V('Hel kalkun', 'kalkun-hel'), V('Kalkunfilet', 'kalkun-filet'), V('Skinkestek, reinsdyrstek og andre steker', 'stek'),
      V('Lutefisk', 'lutefisk'), V('Juletorsk, fisk i skiver eller med ben', ['juletorsk-min', 'juletorsk-maks']), V('Fiskefilet', 'fiskefilet'), V('Rakfisk til forrett', 'rakfisk-forrett'), V('Rakfisk til hovedrett', 'rakfisk-hoved'),
      V('Poteter', 'poteter'), V('Saus', ['saus-min', 'saus-maks']), V('Kålrotstappe til pinnekjøtt', ['kalrot-min', 'kalrot-maks']), V('Surkål eller rødkål til ribbe', ['surkal-min', 'surkal-maks']), V('Ekstra grønnsaker, som rosenkål', ['ekstra-min', 'ekstra-maks']), V('Vossakorv som tilbehør', 'vossakorv'),
    ],
    tekst: (h) => ({
      title: 'Hvor mye julemat per person? Kalkulator for jul',
      h1: 'Hvor mye julemat per person?',
      description: `Ribbe ${h.t('ribbe')}, pinnekjøtt ${h.t('pinne-toer')}, kalkun ${h.t('kalkun-hel')}, lutefisk ${h.t('lutefisk')} per person. Kalkulator og tabell for julemat etter MatPrat (2025).`,
      lead: `Alle MatPrats tall for julemat på én side: ribbe, pinnekjøtt, kalkun, fisk og tilbehør. Velg retten i kalkulatoren.`,
      svar: `<b>Ribbe ${h.t('ribbe')}, pinnekjøtt ${h.t('pinne-toer')} tørket, hel kalkun ${h.t('kalkun-hel')}, lutefisk ${h.t('lutefisk')} per person.</b> Poteter: ${h.t('poteter')}.`,
      avsnitt: [
        ['Hovedretten', ul([
          `Ribbe: ${h.t('ribbe')}, og ${h.t('ribbe-polse')} når du serverer pølse og medisterkaker.`,
          `Pinnekjøtt: ${h.t('pinne-toer')} tørket, eller ${h.t('pinne-utvannet')} utvannet.`,
          `Kalkun: ${h.t('kalkun-hel')} for hel kalkun og ${h.t('kalkun-filet')} for filet eller bryst. Andre steker: ${h.t('stek')}.`,
          `Lutefisk: ${h.t('lutefisk')}. Juletorsk i skiver eller med ben: ${h.r('juletorsk-min', 'juletorsk-maks')}. Fiskefilet: ${h.t('fiskefilet')}.`,
          `Rakfisk: ${h.t('rakfisk-forrett')} til forrett og ${h.t('rakfisk-hoved')} til hovedrett.`,
        ])],
        ['Tilbehøret', p(`Poteter ${h.t('poteter')}, saus ${h.r('saus-min', 'saus-maks')}, kålrotstappe til pinnekjøtt ${h.r('kalrot-min', 'kalrot-maks')}, surkål eller rødkål til ribbe ${h.r('surkal-min', 'surkal-maks')} og ekstra grønnsaker som rosenkål ${h.r('ekstra-min', 'ekstra-maks')}. Vossakorv som tilbehør er ${h.t('vossakorv')}.`)],
        ['Det som endrer mengden', p(BARN(h), `Lager du mat til mange, jevner behovene seg ut, og da holder standardberegningene som regel veldig godt, ifølge ${h.k('mp-julemat')}.`, SULT(h))],
      ],
      faq: [
        ['Hvor mye julemat per person?', `Det kommer an på retten. Ribbe ${h.t('ribbe')}, pinnekjøtt ${h.t('pinne-toer')} tørket, hel kalkun ${h.t('kalkun-hel')} og lutefisk ${h.t('lutefisk')} (${h.kp('mp-julemat')}).`],
        ['Hvor mye julemat til 10 personer?', `Med ribbe blir det ${h.sum('ribbe', 10)} til 10 voksne. Med tørket pinnekjøtt blir det ${h.sum('pinne-toer', 10)}.`],
        ['Hvor mye poteter til julemiddagen?', `${h.t('poteter')} per person.`],
        ['Teller barn som en hel porsjon?', 'MatPrat sier at du gjerne kan regne en halv porsjon til små barn, og en full porsjon til ungdom og voksne.'],
      ],
      soster: [['/mengde-per-person/ribbe/', 'Hvor mye ribbe per person?'], ['/mengde-per-person/pinnekjott/', 'Hvor mye pinnekjøtt per person?'], ['/mengde-per-person/kalkun/', 'Hvor mye kalkun per person?'], ['/mengde-per-person/lutefisk/', 'Hvor mye lutefisk per person?']],
    }),
  },

  suppe: {
    varianter: [V('Suppe til forrett', 'forrett'), V('Suppe til hovedrett', ['hoved-min', 'hoved-maks'])],
    tekst: (h) => ({
      title: 'Hvor mye suppe per person? Kalkulator og tabell',
      h1: 'Hvor mye suppe per person?',
      description: `MatPrat regner ${h.t('forrett')} suppe per person til forrett og ${h.r('hoved-min', 'hoved-maks')} til hovedrett. Kalkulator og tabell for 2 til 12 personer.`,
      lead: `Til forrett regner du ${h.t('forrett')} suppe per person. Er suppen hovedretten, regner du ${h.r('hoved-min', 'hoved-maks')}.`,
      svar: `<b>Forrett: ${h.t('forrett')} per person. Hovedrett: ${h.r('hoved-min', 'hoved-maks')}.</b> Til 10 voksne blir det ${h.sum('forrett', 10)} til forrett og ${h.sumR('hoved-min', 'hoved-maks', 10)} til hovedrett.`,
      avsnitt: [
        ['Forrett eller hovedrett', p(
          `${h.k('mp-porsjon')} har ${h.t('forrett')} til forrett og ${h.r('hoved-min', 'hoved-maks')} til hovedrett, og sier at det siste avhenger av hva slags suppe det er. En kraftig suppe med mye i, som gryterett, ligger i den høye enden. Det siste er vår lesning av spennet.`,
        )],
        ['Eldre og nyere tall', p(`${h.k('mp-mange')} har ${h.t('forrett-eldre')} til forrett og ${h.t('hoved-eldre')} til hovedrett. Det er samme tall til forrett, og det eldre tallet til hovedrett ligger i bunnen av det nyere spennet.`)],
        ['Det som endrer mengden', p(BARN(h), SULT(h))],
      ],
      faq: [
        ['Hvor mye suppe per person til forrett?', `${h.t('forrett')} per person (${h.kp('mp-porsjon')}).`],
        ['Hvor mye suppe per person til hovedrett?', `${h.r('hoved-min', 'hoved-maks')} per person, avhengig av hva slags suppe det er.`],
        ['Hvor mye suppe til 8 personer?', `Til forrett blir det ${h.sum('forrett', 8)}. Til hovedrett blir det ${h.sumR('hoved-min', 'hoved-maks', 8)}.`],
        ['Hvor mye suppe til 12 personer?', `Til forrett blir det ${h.sum('forrett', 12)}. Til hovedrett blir det ${h.sumR('hoved-min', 'hoved-maks', 12)}.`],
      ],
      soster: [['/mengde-per-person/mat-til-selskap/', 'Hvor mye mat til selskap?'], ['/mengde-per-person/salat/', 'Hvor mye salat per person?'], ['/mengde-per-person/koldtbord/', 'Hvor mye mat til koldtbord?']],
    }),
  },

  salat: {
    varianter: [V('Salat og råkost', 'salat-raakost'), V('Grønnsaker til middag, minst', 'gronnsak-min'), V('Sopp', ['sopp-min', 'sopp-maks']), V('Grønn salat på koldtbord', 'gronn-koldtbord'), V('Dressing', ['dressing-min', 'dressing-maks'])],
    tekst: (h) => ({
      title: 'Hvor mye salat per person? Kalkulator og tabell',
      h1: 'Hvor mye salat per person?',
      description: `MatPrat regner ca. ${h.t('salat-raakost')} salat og råkost per person, og minst ${h.t('gronnsak-min')} grønnsaker til middag. Kalkulator og tabell for 2 til 12 personer.`,
      lead: `Regn ca. ${h.t('salat-raakost')} salat og råkost per person. På et koldtbord, hvor salaten er én av flere retter, regner MatPrat ${h.t('gronn-koldtbord')} per porsjon.`,
      svar: `<b>Ca. ${h.t('salat-raakost')} salat og råkost per person.</b> Til 4 voksne blir det ${h.sum('salat-raakost', 4)}. Dressing: ${h.r('dressing-min', 'dressing-maks')} per person.`,
      avsnitt: [
        ['Salat, grønnsaker og sopp', p(
          `${h.k('mp-porsjon')} sier at du til middag vanligvis beregner minimum ${h.t('gronnsak-min')} grønnsaker per porsjon. Salat og råkost regnes som ca. ${h.t('salat-raakost')}. Sopp regnes mellom ${h.t('sopp-min')} og ${h.t('sopp-maks')}, avhengig av om soppen blandes med andre ingredienser eller serveres alene.`,
          `Skal du bruke mer enn én grønnsak, fordeler du vekten på dem. MatPrats eksempel er ${h.t('delt-eks-kal')} kål, ${h.t('delt-eks-gulrot')} gulrot og ${h.t('delt-eks-erter')} sukkererter.`,
        )],
        ['På koldtbordet', p(`${h.k('mp-koldtbord')} regner ${h.t('gronn-koldtbord')} grønn salat per porsjon. Potetsalat og waldorfsalat er ${h.t('potetsalat')} og ${h.t('waldorf')}.`)],
        ['Dressing', p(`Dressing regnes som ${h.r('dressing-min', 'dressing-maks')} per person, avhengig av type (${h.kp('mp-porsjon')}). Den eldre siden ${h.k('mp-mange')} har ${h.t('dressing-eldre')}.`)],
        ['Det som endrer mengden', p(BARN(h))],
      ],
      faq: [
        ['Hvor mye salat per person?', `Ca. ${h.t('salat-raakost')} salat og råkost per person (${h.kp('mp-porsjon')}).`],
        ['Hvor mye grønnsaker per person til middag?', `Minimum ${h.t('gronnsak-min')} grønnsaker per porsjon.`],
        ['Hvor mye salat til 10 personer?', `Til 10 voksne blir det ${h.sum('salat-raakost', 10)}.`],
        ['Hvor mye dressing per person?', `${h.r('dressing-min', 'dressing-maks')}, avhengig av hva slags dressing det er.`],
      ],
      soster: [['/mengde-per-person/koldtbord/', 'Hvor mye mat til koldtbord?'], ['/mengde-per-person/poteter/', 'Hvor mye poteter per person?'], ['/mengde-per-person/mat-til-selskap/', 'Hvor mye mat til selskap?']],
    }),
  },

  grillmat: {
    varianter: [V('Pølser', 'polser'), V('Svinekoteletter', 'kotelett'), V('Kjøtt med ben', 'med-ben'), V('Kjøttdeig, for eksempel til burgere', ['deig-min', 'deig-maks']), V('Spareribs', 'ribs'), V('Hel kylling', 'kylling-hel'), V('Grønnsaker, minst', 'gronnsak-min'), V('Mat totalt, alt på bordet', 'mat-total')],
    tekst: (h) => ({
      title: 'Hvor mye grillmat per person? Kalkulator og tabell',
      h1: 'Hvor mye grillmat per person?',
      description: `Pølser ${h.t('polser')}, koteletter ${h.t('kotelett')}, spareribs ${h.t('ribs')} per person. Kalkulator og tabell for grillmat etter MatPrats mengdetall for kjøtt.`,
      lead: `MatPrat har ingen egen tabell for grillmat. Vi har satt sammen MatPrats tall for kjøtt som ofte havner på grillen, og regnet dem om til 2 til 12 personer.`,
      svar: `<b>Pølser ${h.t('polser')}, svinekoteletter ${h.t('kotelett')}, spareribs ${h.t('ribs')} per person.</b> Alt på bordet til sammen: ca. ${h.t('mat-total')} mat.`,
      avsnitt: [
        ['Tallene vi har satt sammen', p(
          `Tabellen under er fra ${h.k('mp-porsjon')} og ${h.k('mp-mange')}: pølser ${h.t('polser')}, svinekoteletter ${h.t('kotelett')}, kjøtt med ben ${h.t('med-ben')}, kjøttdeig ${h.r('deig-min', 'deig-maks')}, spareribs ${h.t('ribs')} og hel kylling ${h.t('kylling-hel')}.`,
          `At de passer til grillen, er vårt valg. Kilden sier bare hvor mye du beregner av hver type kjøtt.`,
        )],
        ['Resten av maten', p(`${h.k('mp-mange')} regner ca. ${h.t('mat-total')} mat per person til et selskap, hvor om lag halvparten er kjøtt eller fisk. Grønnsaker til middag er minimum ${h.t('gronnsak-min')} per porsjon (${h.kp('mp-porsjon')}).`)],
        ['Det som endrer mengden', p('Jo flere retter du har, jo mindre beregner du av hver, sier MatPrat. På grillen betyr det at du kan regne lavere når det er mye tilbehør og salat.', BARN(h), SULT(h))],
      ],
      faq: [
        ['Hvor mye grillmat per person?', `Det kommer an på hva du griller: pølser ${h.t('polser')}, svinekoteletter ${h.t('kotelett')}, spareribs ${h.t('ribs')}.`],
        ['Hvor mange pølser per person?', `MatPrat regner ${h.t('polser')} pølser per person.`],
        ['Hvor mye grillmat til 10 personer?', `Med pølser blir det ${h.sum('polser', 10)}. Med svinekoteletter blir det ${h.sum('kotelett', 10)}.`],
        ['Hvor mye kjøtt til burgere?', `MatPrat har ingen egen linje for burgere. Linjen for kjøttdeig er ${h.r('deig-min', 'deig-maks')} per person, og til 4 voksne blir det ${h.sumR('deig-min', 'deig-maks', 4)}.`],
      ],
      soster: [['/mengde-per-person/kjott/', 'Hvor mye kjøtt per person?'], ['/mengde-per-person/kjottdeig/', 'Hvor mye kjøttdeig per person?'], ['/mengde-per-person/salat/', 'Hvor mye salat per person?']],
    }),
  },

  koldtbord: {
    varianter: [
      V('Samlet mengde mat', ['total-min', 'total-maks']), V('Roastbiff', 'roastbiff'), V('Røkt skinke', 'roket-skinke'), V('Spekemat', 'spekemat'), V('Kokt ørret', 'orret'),
      V('Grønn salat', 'gronn-salat'), V('Potetsalat', 'potetsalat'), V('Waldorfsalat', 'waldorf'), V('Rømme', 'romme'), V('Pepperrotkrem', 'pepperrot'), V('Remulade', 'remulade'), V('Cumberlandsaus', 'cumberland'),
    ],
    tekst: (h) => ({
      title: 'Hvor mye mat til koldtbord per person? Kalkulator',
      h1: 'Hvor mye mat til koldtbord per person?',
      description: `MatPrat regner ${h.r('total-min', 'total-maks')} mat per person til koldtbord, hvor omtrent halvparten er kjøtt og fisk. Kalkulator og tabell med mengde per rett.`,
      lead: `Til koldtbord regner MatPrat ${h.r('total-min', 'total-maks')} mat per person, med tilbehør. Omtrent halvparten bør være fisk eller kjøtt.`,
      svar: `<b>${h.r('total-min', 'total-maks')} mat per person</b>, hvor omtrent halvparten er kjøtt og fisk. Til 10 voksne blir det altså ${h.sumR('total-min', 'total-maks', 10)}.`,
      avsnitt: [
        ['Mengde per rett', p(`MatPrat har egne tall for hver rett på et klassisk koldtbord. Per porsjon: roastbiff ${h.t('roastbiff')}, røkt skinke ${h.t('roket-skinke')}, spekemat ${h.t('spekemat')}, kokt ørret ${h.t('orret')}, grønn salat ${h.t('gronn-salat')}, potetsalat ${h.t('potetsalat')}, waldorfsalat ${h.t('waldorf')}, rømme ${h.t('romme')}, pepperrotkrem ${h.t('pepperrot')}, remulade ${h.t('remulade')} og cumberlandsaus ${h.t('cumberland')}. Karbonade med løk regnes som ${h.t('karbonade')} per porsjon, og eggerøre som ${h.t('egg')} egg.`)],
        ['Spekemat på koldtbordet', p(`Når spekemat er en del av et større koldtbord, holder det med ${h.r('spekemat-i-koldtbord-min', 'spekemat-i-koldtbord-maks')} per person, ifølge ${h.k('mp-koldtbord')}.`)],
        ['Det som endrer mengden', p(
          `MatPrat sier at mengden avhenger av hvor stort koldtbord du har, og at mengden kjøtt og fisk avhenger av tilbehøret. Så lenge total mengde mat er omtrent den samme, kan menyen tilpasses gjestene og anledningen.`,
          BARN(h), SULT(h),
        )],
      ],
      faq: [
        ['Hvor mye mat til koldtbord per person?', `${h.r('total-min', 'total-maks')} per person, inkludert tilbehør (${h.kp('mp-koldtbord')}).`],
        ['Hvor mye mat til koldtbord for 10 personer?', `${h.sumR('total-min', 'total-maks', 10)} til 10 voksne.`],
        ['Hvor mye roastbiff per person til koldtbord?', `${h.t('roastbiff')} per porsjon.`],
        ['Hvor mye spekemat til koldtbord?', `${h.r('spekemat-i-koldtbord-min', 'spekemat-i-koldtbord-maks')} per person når spekematen er en del av et større koldtbord.`],
      ],
      soster: [['/mengde-per-person/spekemat/', 'Hvor mye spekemat per person?'], ['/mengde-per-person/mat-til-selskap/', 'Hvor mye mat til selskap?'], ['/mengde-per-person/salat/', 'Hvor mye salat per person?']],
    }),
  },

  spekemat: {
    varianter: [
      V('Spekematanretning med lett tilbehør', 'lett'), V('Spekemat med mektig tilbehør', ['mektig-min', 'mektig-maks']), V('Rømmegrøt med spekemat', 'gror'), V('Tapasbord eller sharing', ['tapas-min', 'tapas-maks']),
      V('Spekeskinke som eneste kjøtt', 'skinke-alene'), V('Spekeskinke med godt tilbehør', ['skinke-tilbehor-min', 'skinke-tilbehor-maks']), V('Spekeskinke til tapasbordet', ['skinke-tapas-min', 'skinke-tapas-maks']), V('Spekemat på koldtbord', ['koldtbord-min', 'koldtbord-maks']),
    ],
    tekst: (h) => ({
      title: 'Hvor mye spekemat per person? Kalkulator og tabell',
      h1: 'Hvor mye spekemat per person?',
      description: `MatPrat regner ${h.t('lett')} spekemat per person som anretning, og ${h.r('tapas-min', 'tapas-maks')} på tapasbord. Kalkulator og tabell med fordeling på typer.`,
      lead: `Som spekematanretning med lett tilbehør regner MatPrat ${h.t('lett')} per person. Med mektig tilbehør er det ${h.r('mektig-min', 'mektig-maks')}.`,
      svar: `<b>${h.t('lett')} per person</b> med lett tilbehør, ${h.r('mektig-min', 'mektig-maks')} med mektig tilbehør, ${h.r('tapas-min', 'tapas-maks')} på tapasbord. Til 10 voksne blir det ${h.sum('lett', 10)} med lett tilbehør.`,
      avsnitt: [
        ['Tilbehøret styrer', p(
          `${h.k('mp-spekemat')} deler tallet etter hvordan du serverer. Med lett tilbehør som flatbrød, melon eller salat: ${h.t('lett')}. Med mektig tilbehør som potetsalat, focaccia, eggerøre og ost: ${h.r('mektig-min', 'mektig-maks')}. Rømmegrøt med spekemat: ${h.t('gror')}. Tapasbord: ${h.r('tapas-min', 'tapas-maks')}.`,
        )],
        ['Spekeskinke alene eller sammen med annet', p(`Er spekeskinke det eneste kjøttet, regner MatPrat ${h.t('skinke-alene')}. Med godt tilbehør er det ${h.r('skinke-tilbehor-min', 'skinke-tilbehor-maks')}, og på tapasbordet ${h.r('skinke-tapas-min', 'skinke-tapas-maks')}.`)],
        ['Fordeling på typer', p(`MatPrat gir et eksempel med fire typer. Per person er det ${h.t('fire-skinke')} spekeskinke uten ben og ${h.t('fire-fenalar')} hver av fenalår uten ben, salami og morrpølse. Siden sier at spekeskinke ofte er mest populært, så det lønner seg å beregne mest av den.`)],
        ['Det som endrer mengden', p('MatPrat sier at menn spiser mer enn damer, mens barn og eldre ofte spiser litt under gjennomsnittet. Jo flere ulike tilbehør du har, jo mindre trenger du av hver rett.', BARN(h))],
      ],
      faq: [
        ['Hvor mye spekemat per person?', `Med lett tilbehør ${h.t('lett')}, med mektig tilbehør ${h.r('mektig-min', 'mektig-maks')}, på tapasbord ${h.r('tapas-min', 'tapas-maks')} (${h.kp('mp-spekemat')}).`],
        ['Hvor mye spekemat til 10 personer?', `Med lett tilbehør blir det ${h.sum('lett', 10)}. På tapasbord blir det ${h.sumR('tapas-min', 'tapas-maks', 10)}.`],
        ['Hvor mye spekeskinke per person?', `Som eneste kjøtt ${h.t('skinke-alene')}, med godt tilbehør ${h.r('skinke-tilbehor-min', 'skinke-tilbehor-maks')}, på tapasbordet ${h.r('skinke-tapas-min', 'skinke-tapas-maks')}.`],
        ['Hvor mye spekemat på koldtbord?', `${h.r('koldtbord-min', 'koldtbord-maks')} per person når spekemat er en del av et større koldtbord (${h.kp('mp-koldtbord')}).`],
      ],
      soster: [['/mengde-per-person/koldtbord/', 'Hvor mye mat til koldtbord?'], ['/mengde-per-person/mat-til-selskap/', 'Hvor mye mat til selskap?'], ['/mengde-per-person/poteter/', 'Hvor mye poteter per person?']],
    }),
  },

  'mat-til-selskap': {
    varianter: [V('Mat totalt, alt på bordet', 'total'), V('Koldtbord, samlet mengde', ['koldtbord-min', 'koldtbord-maks']), V('Suppe til forrett', 'suppe-forrett'), V('Suppe til hovedrett', 'suppe-hoved'), V('Tynn saus', 'saus-tynn'), V('Tykk saus', 'saus-tykk'), V('Dressing', 'dressing')],
    tekst: (h) => ({
      title: 'Hvor mye mat per person til selskap? Kalkulator',
      h1: 'Hvor mye mat per person til selskap?',
      description: `MatPrat regner ca. ${h.t('total')} mat per person til selskap. Kalkulator og tabell for 2 til 12 personer, med fordeling på kjøtt, grønnsaker og poteter.`,
      lead: `En grei grunnregel er å regne ca. ${h.t('total')} mat per person. Sauser, dressing, pynt og tilbehør kommer i tillegg.`,
      svar: `<b>Ca. ${h.t('total')} mat per person.</b> Til ${h.t('personer-eks')} blir det ca. ${h.t('totalt-kg')}: ${h.t('kjott-kg')} kjøtt og fisk, ${h.t('gronnsak-kg')} grønnsaker og ${h.t('karbo-kg')} poteter, ris og pasta.`,
      avsnitt: [
        ['Eksempelet fra MatPrat: 20 personer', p(`${h.k('mp-selskaper')} regner et eksempel for ${h.t('personer-eks')}: ca. ${h.t('totalt-kg')} mat totalt, fordelt på ${h.t('kjott-kg')} rent kjøtt og fisk, ${h.t('gronnsak-kg')} grønnsaker og ${h.t('karbo-kg')} poteter, ris og pasta. Er det flere retter på en buffet, fordeler du mengdene utover rettene, slik at det til sammen blir den totale mengden.`)],
        ['Sauser, suppe og dressing', p(`Disse kommer i tillegg til grunnregelen. Per person regner ${h.k('mp-mange')} ${h.t('suppe-forrett')} suppe til forrett og ${h.t('suppe-hoved')} til hovedrett, ${h.t('saus-tynn')} tynn saus, ${h.t('saus-tykk')} tykk saus og ${h.t('dressing')} dressing.`)],
        ['Koldtbord og tapas', p(`Til koldtbord regner ${h.k('mp-koldtbord')} ${h.r('koldtbord-min', 'koldtbord-maks')} per person, inkludert tilbehør. Til tapas regner ${h.k('mp-mange')} ca. ${h.t('total-mange')}, og jo flere retter du har, jo mindre beregner du av hver.`)],
        ['Det som endrer mengden', p(SULT(h), 'På en buffet bør du også beregne litt ekstra av hver rett, slik at ikke alle fatene er tomme når gjestene har forsynt seg, sier MatPrat. Mange forsyner seg to eller tre ganger.', BARN(h))],
      ],
      faq: [
        ['Hvor mye mat per person til selskap?', `Ca. ${h.t('total')} per person, hvor om lag halvparten er kjøtt eller fisk (${h.kp('mp-selskaper')}).`],
        ['Hvor mye mat til 20 personer?', `Ca. ${h.t('totalt-kg')}: ${h.t('kjott-kg')} kjøtt og fisk, ${h.t('gronnsak-kg')} grønnsaker og ${h.t('karbo-kg')} poteter, ris og pasta.`],
        ['Hvor mye mat til 10 personer?', `Med ${h.t('total')} per person blir det ${h.sum('total', 10)} til 10 voksne.`],
        ['Teller barn som en hel person?', 'MatPrat sier at du gjerne kan regne en halv porsjon til små barn. Kalkulatoren bruker det.'],
      ],
      soster: [['/mengde-per-person/koldtbord/', 'Hvor mye mat til koldtbord?'], ['/mengde-per-person/spekemat/', 'Hvor mye spekemat per person?'], ['/mengde-per-person/julemat/', 'Hvor mye julemat per person?']],
    }),
  },
};

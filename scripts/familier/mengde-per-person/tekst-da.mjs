// Tekst til familien «mengde per person» (da): hvor meget mad man skal regne pr. person. Hver sætning gengiver, hvad en navngiven dansk kilde siger.
// Tal skrives aldrig her: h.t(felt), h.r(a, b) og h.sum(felt, antal) henter dem fra data.da.json, hvor hvert tal har sitatet fra kilden. Sætninger fra kilden hentes ordret med h.s(id).
// Kilder: Madens Verden (2024 til 2026), Arla (2026) og Danish Crown (producent, 2026). Ingen egne råd om, hvad der er nok: vi gengiver kilderne.
// varianter: { navn, deler: [felt eller [min, maks]] } med tal i g eller dl, som omregneren og tabellen bruger. Første variant er den, omregneren starter med.
// Undgå ordene køleskab, rester, plan, uge, find, gem, sådan, ovn, trin, lav, timer, opskrift, erstat og køb i h2-overskrifter, undtagen i app-blokken: scripts/app-bevis.mjs ville ellers lægge appkort ind under dem.

const R = '/da/hvor-meget-pr-person/';
const L = (slug, tekst) => [`${R}${slug}/`, tekst];

export const TEKST = {
  ris: {
    varianter: [
      { navn: 'Ris som tilbehør (Madens Verden)', deler: [['mv-g-min', 'mv-g-maks'], 'mv-dl'] },
      { navn: 'Ris (Arla)', deler: ['arla-g', 'arla-dl'] },
    ],
    tekst: (h) => ({
      ord: 'ris',
      title: 'Hvor meget ris pr. person? Omregner og tabel',
      h1: 'Hvor meget ris pr. person?',
      description: `Madens Verden: ${h.t('mv-dl')} ukogte ris pr. person, cirka ${h.r('mv-g-min', 'mv-g-maks')}. Arla regner med ca. ${h.t('arla-g')}. Omregner og tabel for to til tolv voksne.`,
      lead: `${h.k('mv-perperson')} regner med ${h.t('mv-dl')} ukogte ris pr. person, det vil sige cirka ${h.r('mv-g-min', 'mv-g-maks')}. ${h.k('arla-maengder')} regner med ca. ${h.t('arla-g')}.`,
      svar: `Cirka ${h.t('mv-dl')} ukogte ris pr. voksen, det vil sige ${h.r('mv-g-min', 'mv-g-maks')} (Madens Verden, 2025). Arla skriver ca. ${h.t('arla-g')} rå ris.`,
      avsnitt: [
        ['Det siger kilderne', p(
          `${h.k('mv-perperson')} skriver, at ris vejes eller måles tørre: ${h.t('mv-dl')} ukogte ris pr. person svarer normalt til ${h.r('mv-g-min', 'mv-g-maks')}, afhængigt af ristypen.`,
          `${h.k('arla-maengder')} regner med ${h.t('arla-g')} rå ris, svarende til ${h.t('arla-dl')}. Madens Verdens liste over gæster regner også med ${h.t('gaest-dl')} ukogte ris.`,
        )],
        ['Tørre eller kogte ris', p(h.s('vand'), h.s('gryde'))],
        ['Flere slags tilbehør', p(h.s('flere'), `Madens Verden om børn: ${h.s('barn', { med: false })}`)],
      ],
      faq: [
        ['Hvor mange gram ris pr. person?', `${h.k('mv-perperson')} skriver cirka ${h.r('mv-g-min', 'mv-g-maks')} ukogte ris, og ${h.k('arla-maengder')} skriver ca. ${h.t('arla-g')}.`],
        ['Hvor mange deciliter ris pr. person?', `Både Madens Verden og Arla regner med ${h.t('mv-dl')} ukogte ris pr. person.`],
        ['Skal ris vejes før eller efter kogning?', `Før kogning. ${h.s('vand')}`],
      ],
      soster: [L('pasta', 'Hvor meget pasta pr. person?'), L('kartofler', 'Hvor meget kartofler pr. person?')],
    }),
  },

  pasta: {
    varianter: [
      { navn: 'Tørret pasta som hovedret', deler: [['hoved-min', 'hoved-maks']] },
      { navn: 'Tørret pasta som tilbehør', deler: [['tilbehoer-min', 'tilbehoer-maks']] },
      { navn: 'Frisk pasta som hovedret (Madens Verden)', deler: [['frisk-min', 'frisk-maks']] },
      { navn: 'Frisk pasta (Arla)', deler: ['arla-frisk'] },
    ],
    tekst: (h) => ({
      ord: 'pasta',
      title: 'Hvor meget pasta pr. person? Omregner og tabel',
      h1: 'Hvor meget pasta pr. person?',
      description: `Madens Verden: ${h.r('hoved-min', 'hoved-maks')} tørret pasta som hovedret og ${h.r('frisk-min', 'frisk-maks')} frisk pasta pr. voksen. Arla skriver ${h.r('arla-toer-min', 'arla-toer-maks')} tørret og ${h.t('arla-frisk')} frisk.`,
      lead: `${h.k('mv-pasta')} regner med ${h.r('hoved-min', 'hoved-maks')} tørret pasta som hovedret pr. voksen og ${h.r('frisk-min', 'frisk-maks')} frisk. Alle mængder er for ukogt pasta.`,
      svar: `${h.r('hoved-min', 'hoved-maks')} tørret pasta som hovedret pr. voksen (Madens Verden, 2026). Arla skriver ${h.r('arla-toer-min', 'arla-toer-maks')}.`,
      avsnitt: [
        ['Det siger kilderne', p(
          `${h.k('mv-pasta')}: tørret pasta som tilbehør ${h.r('tilbehoer-min', 'tilbehoer-maks')}, tørret pasta til børn ${h.r('boern-min', 'boern-maks')}, frisk pasta som hovedret ${h.r('frisk-min', 'frisk-maks')}.`,
          `${h.k('arla-maengder')}: tørret pasta ${h.r('arla-toer-min', 'arla-toer-maks')} og frisk pasta ${h.t('arla-frisk')} pr. voksen. Madens Verdens liste over mad pr. person nævner ${h.r('mv-frisk-p', 'mv-frisk-p-maks')} frisk pasta, så de to sider fra Madens Verden er ikke ens.`,
        )],
        ['Til fire personer', p(`Madens Verden regner ${h.r('fire-toer-min', 'fire-toer-maks')} tørret pasta til fire voksne og ${h.r('fire-frisk-min', 'fire-frisk-maks')} frisk pasta til fire personer.`)],
        ['Tørret pasta bliver tungere', p(h.s('ukogt'), h.s('optag'), h.s('meget'))],
      ],
      faq: [
        ['Hvor mange gram pasta pr. person?', `${h.k('mv-pasta')} skriver ${h.r('hoved-min', 'hoved-maks')} tørret pasta som hovedret, og ${h.k('arla-maengder')} skriver ${h.r('arla-toer-min', 'arla-toer-maks')}.`],
        ['Hvor meget frisk pasta pr. person?', `${h.k('mv-pasta')} skriver ${h.r('frisk-min', 'frisk-maks')} som hovedret, og ${h.k('arla-maengder')} skriver ${h.t('arla-frisk')}.`],
        ['Hvor meget pasta skal børn have?', `${h.k('mv-pasta')} skriver ${h.r('boern-min', 'boern-maks')} tørret pasta til børn.`],
      ],
      soster: [L('ris', 'Hvor meget ris pr. person?'), L('hakket-koed', 'Hvor meget hakket kød pr. person?')],
    }),
  },

  poteter: {
    varianter: [
      { navn: 'Kogte kartofler', deler: [['kogte-min', 'kogte-maks']] },
      { navn: 'Kartoffelmos', deler: ['mos'] },
      { navn: 'Ovnstegte kartofler og pommes frites', deler: [['ovn-min', 'ovn-maks']] },
      { navn: 'Flødekartofler', deler: [['floede-min', 'floede-maks']] },
    ],
    tekst: (h) => ({
      ord: 'kartofler',
      title: 'Hvor meget kartofler pr. person? Omregner og tabel',
      h1: 'Hvor meget kartofler pr. person?',
      description: `Madens Verden: ${h.r('kogte-min', 'kogte-maks')} kogte kartofler pr. person og ${h.t('mos')} til kartoffelmos, i rå vægt. Arla skriver ${h.r('arla-min', 'arla-maks')} pr. voksen.`,
      lead: `${h.k('mv-perperson')} regner med ${h.r('kogte-min', 'kogte-maks')} rå kartofler pr. person til kogte kartofler og ${h.t('mos')} til kartoffelmos.`,
      svar: `${h.r('kogte-min', 'kogte-maks')} rå kartofler pr. voksen til kogte kartofler, og ${h.t('mos')} til kartoffelmos (Madens Verden, 2025). Arla skriver ${h.r('arla-min', 'arla-maks')}.`,
      avsnitt: [
        ['Det siger kilderne', p(
          `${h.k('mv-perperson')}: kogte kartofler ${h.r('kogte-min', 'kogte-maks')}, kartoffelmos ${h.t('mos')}, ovnstegte kartofler eller pommes frites ${h.r('ovn-min', 'ovn-maks')} og flødekartofler ${h.r('floede-min', 'floede-maks')}, alt i rå vægt.`,
          `${h.k('arla-maengder')} skriver ${h.r('arla-min', 'arla-maks')} pr. voksen. Madens Verdens liste over gæster regner med ${h.t('gaest')} før skrælning.`,
        )],
        ['Skrælning og svind', p(h.s('svind'), h.s('skraeld'))],
        ['Flere slags tilbehør', p(h.s('flere'), 'Børn mellem cirka fire og ti år regnes som en halv voksenportion, skriver Madens Verden.')],
      ],
      faq: [
        ['Hvor mange kartofler pr. person?', `${h.k('mv-perperson')} skriver ${h.r('kogte-min', 'kogte-maks')} til kogte kartofler, og ${h.k('arla-maengder')} skriver ${h.r('arla-min', 'arla-maks')}.`],
        ['Hvor mange kartofler til kartoffelmos?', `${h.k('mv-perperson')} anbefaler ${h.t('mos')} rå kartofler pr. person.`],
        ['Hvor mange kartofler til gæster?', `${h.k('mv-gaester')} regner med ${h.t('gaest')} før skrælning.`],
      ],
      soster: [L('ris', 'Hvor meget ris pr. person?'), L('flaeskesteg', 'Hvor meget flæskesteg pr. person?')],
    }),
  },

  flaeskesteg: {
    varianter: [
      { navn: 'Juleaften og gæstemiddag (Danish Crown)', deler: ['dc-jul'] },
      { navn: 'Hverdagsmåltid (Danish Crown)', deler: [['dc-hverdag-min', 'dc-hverdag-maks']] },
      { navn: 'Madens Verden', deler: [['mv-min', 'mv-maks']] },
      { navn: 'Arla, normal appetit', deler: [['arla-min', 'arla-maks']] },
      { navn: 'Arla, meget tilbehør', deler: [['arla-meget-min', 'arla-meget-maks']] },
      { navn: 'Arla, sultne gæster', deler: [['arla-sulten-min', 'arla-sulten-maks']] },
      { navn: 'Flæskestegssandwich (Danish Crown)', deler: [['dc-sandwich-min', 'dc-sandwich-maks']] },
    ],
    tekst: (h) => ({
      ord: 'flæskesteg',
      title: 'Hvor meget flæskesteg pr. person? Omregner til jul og gæster',
      h1: 'Hvor meget flæskesteg pr. person?',
      description: `Danish Crown regner med ${h.t('dc-jul')} rå flæskesteg pr. person til juleaften, og Madens Verden ${h.r('mv-min', 'mv-maks')}. Arla skriver ${h.r('arla-min', 'arla-maks')}. Omregner og tabel.`,
      lead: `Kilderne er ikke helt enige. ${h.k('dc-flaesk')} regner med ${h.t('dc-jul')} rå flæskesteg pr. voksen til juleaften, ${h.k('mv-flaesk')} med ${h.r('mv-min', 'mv-maks')} og ${h.k('arla-flaesk')} med ${h.r('arla-min', 'arla-maks')}.`,
      svar: `${h.t('dc-jul')} rå flæskesteg pr. voksen til juleaften eller gæstemiddag (Danish Crown, 2026). Madens Verden skriver ${h.r('mv-min', 'mv-maks')} og Arla ${h.r('arla-min', 'arla-maks')}.`,
      avsnitt: [
        ['Det siger kilderne', p(
          `${h.k('dc-flaesk')}: hverdagsmåltid ${h.r('dc-hverdag-min', 'dc-hverdag-maks')}, juleaften eller gæstemiddag ${h.t('dc-jul')} og flæskestegssandwich ${h.r('dc-sandwich-min', 'dc-sandwich-maks')}. Danish Crown er en producent, og tallene er rå vægt pr. voksen.`,
          `${h.k('mv-flaesk')} skriver ${h.r('mv-min', 'mv-maks')} rå flæskesteg pr. voksen. ${h.s('afhaenger')}`,
          `${h.k('arla-flaesk')} skriver ${h.r('arla-min', 'arla-maks')} rå steg pr. person, og ${h.r('arla-meget-min', 'arla-meget-maks')} ved meget tilbehør med forret og dessert. Til meget sultne gæster regner Arla med ${h.r('arla-sulten-min', 'arla-sulten-maks')}.`,
        )],
        ['Størrelsen på stegen', p(`${h.k('mv-flaesk')}: ${h.s('dagen', { med: false })}`, `Danish Crown skriver, at flæskesteg svinder cirka ${h.r('dc-svind-min', 'dc-svind-maks')} under tilberedning.`)],
        ['Tider for stegen', p('Hvor længe stegen skal i ovnen, står på <a href="/da/stegetid/flaeskesteg/">hvor længe skal flæskestegen have i ovnen</a>. Kernetemperaturen står på <a href="/da/kernetemperatur/flaeskesteg/">kernetemperatur for flæskesteg</a>.')],
      ],
      faq: [
        ['Hvor meget flæskesteg pr. person til juleaften?', `${h.k('dc-flaesk')} regner med ${h.t('dc-jul')} rå flæskesteg pr. voksen til juleaften eller gæstemiddag.`],
        ['Hvor stor skal en flæskesteg være til seks personer?', `${h.k('mv-flaesk')} skriver, at en flæskesteg på ${h.t('mv-steg')} passer godt til seks personer.`],
        ['Hvor meget flæskesteg til sandwich?', `${h.k('dc-flaesk')} skriver ${h.r('dc-sandwich-min', 'dc-sandwich-maks')} pr. person.`],
      ],
      soster: [['/da/stegetid/flaeskesteg/', 'Hvor længe skal flæskestegen have i ovnen?'], L('kartofler', 'Hvor meget kartofler pr. person?'), L('kalkun', 'Hvor meget kalkun pr. person?')],
    }),
  },

  kalkun: {
    varianter: [{ navn: 'Hel kalkun med ben og skrog', deler: ['hel'] }],
    tekst: (h) => ({
      ord: 'kalkun',
      title: 'Hvor meget kalkun pr. person? Omregner og tabel',
      h1: 'Hvor meget kalkun pr. person?',
      description: `Madens Verden regner med cirka ${h.t('hel')} hel kalkun pr. person, inklusive ben og skrog, når der også er kartofler, sovs og grøntsager. Omregner og tabel.`,
      lead: `${h.k('mv-kalkun')} regner med cirka ${h.t('hel')} hel kalkun pr. person, når der også serveres kartofler, sovs og grøntsager.`,
      svar: `Cirka ${h.t('hel')} hel kalkun pr. person, inklusive ben og skrog (Madens Verden, 2024).`,
      avsnitt: [
        ['Det siger kilden', p(`${h.k('mv-kalkun')} skriver: ${h.s('benskrog', { med: false })} ${h.s('mere', { med: false })}`, `Madens Verden giver tre eksempler: ${h.s('fire', { med: false })} ${h.s('fem', { med: false })}`)],
        ['Stegetid for kalkunen', p('Hvor lang tid en hel kalkun skal have i ovnen, står på <a href="/da/stegetid/kalkun/">hvor længe skal en kalkun have i ovnen</a>.')],
      ],
      faq: [
        ['Hvor stor skal en kalkun være til otte personer?', `${h.k('mv-kalkun')} skriver: ${h.s('fire', { med: false })}`],
        ['Hvor meget kalkun skal man regne pr. person?', `${h.k('mv-kalkun')} regner med cirka ${h.t('hel')} hel kalkun pr. person.`],
      ],
      soster: [['/da/stegetid/kalkun/', 'Hvor længe skal en kalkun have i ovnen?'], L('flaeskesteg', 'Hvor meget flæskesteg pr. person?')],
    }),
  },

  kylling: {
    varianter: [
      { navn: 'Kyllingebryst', deler: [['bryst-min', 'bryst-maks']] },
      { navn: 'Kød med ben', deler: [['ben-min', 'ben-maks']] },
      { navn: 'Råt kød (Arla)', deler: [['arla-min', 'arla-maks']] },
    ],
    tekst: (h) => ({
      ord: 'kylling',
      title: 'Hvor meget kylling pr. person? Omregner og tabel',
      h1: 'Hvor meget kylling pr. person?',
      description: `Madens Verden: ${h.r('bryst-min', 'bryst-maks')} kyllingebryst pr. person og ${h.r('ben-min', 'ben-maks')} kød med ben. Arla skriver ${h.r('arla-min', 'arla-maks')} råt kød pr. voksen. Omregner og tabel.`,
      lead: `${h.k('mv-perperson')} regner med ${h.r('bryst-min', 'bryst-maks')} kyllingebryst pr. person og ${h.r('ben-min', 'ben-maks')} råt kød med ben.`,
      svar: `${h.r('bryst-min', 'bryst-maks')} kyllingebryst pr. voksen (Madens Verden, 2025). Arla skriver ${h.r('arla-min', 'arla-maks')} råt kød pr. voksen.`,
      avsnitt: [
        ['Det siger kilderne', p(
          `${h.k('mv-perperson')}: kyllingebryst ${h.r('bryst-min', 'bryst-maks')} og kød med ben ${h.r('ben-min', 'ben-maks')}, i rå vægt.`,
          `${h.k('arla-maengder')} skriver ${h.r('arla-min', 'arla-maks')} råt kød pr. voksen og ${h.r('arla-boern-min', 'arla-boern-maks')} til børn.`,
        )],
        ['En hel kylling', p(h.s('hel'), h.s('stor'))],
        ['Stegetid for kyllingen', p('Tider for hel kylling og kyllingebryst står på <a href="/da/stegetid/hel-kylling/">hvor længe skal en hel kylling have i ovnen</a>.')],
      ],
      faq: [
        ['Hvor meget kyllingebryst pr. person?', `${h.k('mv-perperson')} skriver ${h.r('bryst-min', 'bryst-maks')} pr. person.`],
        ['Hvor stor skal en hel kylling være?', h.s('hel')],
        ['Hvor meget kød skal børn have?', `${h.k('arla-maengder')} skriver ${h.r('arla-boern-min', 'arla-boern-maks')} til børn.`],
      ],
      soster: [L('fisk', 'Hvor meget fisk pr. person?'), L('hakket-koed', 'Hvor meget hakket kød pr. person?')],
    }),
  },

  fisk: {
    varianter: [
      { navn: 'Fiskefilet uden ben', deler: [['filet-min', 'filet-maks']] },
      { navn: 'Mager fisk som torsk', deler: [['torsk-min', 'torsk-maks']] },
    ],
    tekst: (h) => ({
      ord: 'fisk',
      title: 'Hvor meget fisk pr. person? Omregner og tabel',
      h1: 'Hvor meget fisk pr. person?',
      description: `Madens Verden og Arla regner begge med ${h.r('filet-min', 'filet-maks')} rå fisk pr. voksen til en hovedret. Til torsk regner Madens Verden ${h.r('torsk-min', 'torsk-maks')}. Omregner og tabel.`,
      lead: `${h.k('mv-perperson')} og ${h.k('arla-maengder')} regner begge med ${h.r('filet-min', 'filet-maks')} rå fisk pr. voksen til en hovedret.`,
      svar: `${h.r('filet-min', 'filet-maks')} rå fiskefilet pr. voksen (Madens Verden, 2025, og Arla, 2026). Til børn skriver Arla ${h.r('arla-boern-min', 'arla-boern-maks')}.`,
      avsnitt: [
        ['Det siger kilderne', p(
          `${h.k('mv-perperson')} regner ${h.r('filet-min', 'filet-maks')} rå fisk pr. person til en fiskefilet uden ben, og ${h.r('torsk-min', 'torsk-maks')} til en mager fisk som torsk, hvis fisken er hoveddelen af måltidet.`,
          `${h.k('arla-maengder')} skriver ${h.r('arla-min', 'arla-maks')} rå fisk pr. voksen og ${h.r('arla-boern-min', 'arla-boern-maks')} til børn.`,
        )],
        ['Hel fisk og ben', p(h.s('hel'), h.s('ben'))],
        ['Laks', p(h.s('laks'), 'Tider for laks i ovn står på <a href="/da/stegetid/laks-i-ovn/">hvor længe skal laks have i ovnen</a>.')],
      ],
      faq: [
        ['Hvor meget fisk pr. person?', `${h.k('mv-perperson')} og ${h.k('arla-maengder')} regner med ${h.r('filet-min', 'filet-maks')} rå fisk pr. voksen.`],
        ['Hvor meget laks pr. person?', h.s('laks')],
        ['Hvor meget fisk skal børn have?', `${h.k('arla-maengder')} skriver ${h.r('arla-boern-min', 'arla-boern-maks')} til børn.`],
      ],
      soster: [['/da/stegetid/laks-i-ovn/', 'Hvor længe skal laks have i ovnen?'], L('kylling', 'Hvor meget kylling pr. person?')],
    }),
  },

  kjottdeig: {
    varianter: [
      { navn: 'Hakket kød', deler: [['mv-min', 'mv-maks']] },
      { navn: 'Gryderet med mange grøntsager', deler: [['gryde-min', 'gryde-maks']] },
    ],
    tekst: (h) => ({
      ord: 'hakket kød',
      title: 'Hvor meget hakket kød pr. person? Omregner og tabel',
      h1: 'Hvor meget hakket kød pr. person?',
      description: `Madens Verden og Arla regner begge med ${h.r('mv-min', 'mv-maks')} råt hakket kød pr. person. Til gryderetter med mange grøntsager skriver Madens Verden ${h.r('gryde-min', 'gryde-maks')}.`,
      lead: `${h.k('mv-perperson')} regner med ${h.r('mv-min', 'mv-maks')} råt hakket oksekød eller svinekød pr. person, og ${h.k('arla-maengder')} med ${h.r('arla-min', 'arla-maks')} i en ret med mange grøntsager, pasta eller ris.`,
      svar: `${h.r('mv-min', 'mv-maks')} råt hakket kød pr. voksen (Madens Verden, 2025). Til en gryderet med mange grøntsager skriver Madens Verden ${h.r('gryde-min', 'gryde-maks')}.`,
      avsnitt: [
        ['Det siger kilderne', p(h.s('brug'), h.s('arla'))],
        ['Til gryderetter', p(`${h.k('mv-perperson')} skriver, at man i gryderetter med mange grøntsager, bønner eller linser ofte kan reducere til ${h.r('gryde-min', 'gryde-maks')} kød pr. person.`)],
        ['Gennemstegt hakket kød', p('Kernetemperaturen for hakket kød står på <a href="/da/kernetemperatur/hakket-koed/">kernetemperatur for hakket kød</a>, med tal fra Fødevarestyrelsen.')],
      ],
      faq: [
        ['Hvor meget hakket kød pr. person?', `${h.k('mv-perperson')} skriver ${h.r('mv-min', 'mv-maks')} råt kød pr. person.`],
        ['Hvor meget hakket kød til en gryderet?', `${h.k('mv-perperson')} skriver ${h.r('gryde-min', 'gryde-maks')} pr. person, når der er mange grøntsager i retten.`],
      ],
      soster: [L('pasta', 'Hvor meget pasta pr. person?'), L('kylling', 'Hvor meget kylling pr. person?')],
    }),
  },

  groensager: {
    varianter: [
      { navn: 'Tilberedte grøntsager', deler: [['tilberedte-min', 'tilberedte-maks']] },
      { navn: 'Blandet salat', deler: [['salat-min', 'salat-maks']] },
      { navn: 'Grøntsager (Arla)', deler: [['arla-min', 'arla-maks']] },
      { navn: 'Blandet salat (Arla)', deler: [['arla-salat-min', 'arla-salat-maks']] },
    ],
    tekst: (h) => ({
      ord: 'grøntsager og salat',
      title: 'Hvor meget grøntsager og salat pr. person? Omregner og tabel',
      h1: 'Hvor meget grøntsager og salat pr. person?',
      description: `Madens Verden: ${h.r('tilberedte-min', 'tilberedte-maks')} tilberedte grøntsager og ${h.r('salat-min', 'salat-maks')} blandet salat pr. person. Arla skriver ${h.r('arla-min', 'arla-maks')} og ${h.r('arla-salat-min', 'arla-salat-maks')}.`,
      lead: `${h.k('mv-perperson')} regner med ${h.r('tilberedte-min', 'tilberedte-maks')} tilberedte grøntsager og ${h.r('salat-min', 'salat-maks')} blandet salat pr. person.`,
      svar: `${h.r('tilberedte-min', 'tilberedte-maks')} tilberedte grøntsager pr. voksen (Madens Verden, 2025). Arla skriver ${h.r('arla-min', 'arla-maks')}.`,
      avsnitt: [
        ['Det siger kilderne', p(
          `${h.k('mv-perperson')}: tilberedte grøntsager ${h.r('tilberedte-min', 'tilberedte-maks')} og blandet grøn salat ${h.r('salat-min', 'salat-maks')} pr. person.`,
          `${h.k('arla-maengder')}: grøntsager ${h.r('arla-min', 'arla-maks')} og blandet salat ${h.r('arla-salat-min', 'arla-salat-maks')} pr. voksen. Madens Verdens liste over gæster regner med mindst ${h.t('gaest')} salat og grøntsager.`,
        )],
        ['Frosne grøntsager', p(h.s('frosne'), h.s('flere'))],
      ],
      faq: [
        ['Hvor mange grøntsager pr. person?', `${h.k('mv-perperson')} skriver ${h.r('tilberedte-min', 'tilberedte-maks')}, og ${h.k('arla-maengder')} skriver ${h.r('arla-min', 'arla-maks')}.`],
        ['Hvor meget salat pr. person?', `${h.k('mv-perperson')} skriver ${h.r('salat-min', 'salat-maks')}, og ${h.k('arla-maengder')} skriver ${h.r('arla-salat-min', 'arla-salat-maks')}.`],
      ],
      soster: [L('kartofler', 'Hvor meget kartofler pr. person?'), L('gaester', 'Hvor meget mad pr. person til gæster?')],
    }),
  },

  'mat-til-selskap': {
    varianter: [
      { navn: 'Kød uden ben', deler: ['koed'] },
      { navn: 'Fiskefilet', deler: [['fisk-min', 'fisk-maks']] },
      { navn: 'Kartofler før skrælning', deler: ['kartofler'] },
      { navn: 'Tørret pasta', deler: ['pasta'] },
      { navn: 'Ukogte ris', deler: ['ris'] },
      { navn: 'Salat og grøntsager', deler: ['salat'] },
      { navn: 'Sovs', deler: ['sovs'] },
      { navn: 'Dessert', deler: [['dessert-min', 'dessert-maks']] },
    ],
    tekst: (h) => ({
      ord: 'mad til gæster',
      title: 'Hvor meget mad pr. person til gæster? Omregner og tabel',
      h1: 'Hvor meget mad pr. person til gæster?',
      description: `Madens Verden regner med ${h.t('koed')} kød uden ben, ${h.t('kartofler')} kartofler og ${h.t('sovs')} sovs pr. voksen til en middag med gæster. Børn tæller som en halv voksen.`,
      lead: `${h.k('mv-gaester')} regner med ${h.t('koed')} kød uden ben, ${h.t('kartofler')} kartofler før skrælning og ${h.t('sovs')} sovs pr. voksen til en middag.`,
      svar: `${h.t('koed')} kød uden ben, ${h.t('kartofler')} kartofler og ${h.t('sovs')} sovs pr. voksen (Madens Verden, 2025).`,
      avsnitt: [
        ['Det siger kilden', p(
          `${h.k('mv-gaester')}: kød uden ben ${h.t('koed')}, fiskefilet ${h.r('fisk-min', 'fisk-maks')}, kartofler ${h.t('kartofler')} før skrælning, tørret pasta ${h.t('pasta')}, ukogte ris ${h.t('ris')}, salat og grøntsager mindst ${h.t('salat')}, sovs ${h.t('sovs')}, dessert ${h.r('dessert-min', 'dessert-maks')}. Suppe som forret er ${h.r('suppe-min', 'suppe-maks')}, og anden forret cirka ${h.t('forret')}.`,
          `Børn: ${h.s('barn', { med: false })}`,
        )],
        ['Buffet', p(h.s('buffet'), `Det svarer til omkring ${h.r('buffet-min', 'buffet-maks')} af hver slags kød pr. person.`)],
        ['Tilpas til menuen', p(h.s('vejl'), h.s('mindre'))],
      ],
      faq: [
        ['Hvor meget mad pr. person til gæster?', `${h.k('mv-gaester')} regner med ${h.t('koed')} kød uden ben, ${h.t('kartofler')} kartofler og ${h.t('sovs')} sovs pr. voksen.`],
        ['Hvor gamle børn tæller som en halv portion?', `${h.k('mv-gaester')} skriver: ${h.s('barn', { med: false })}`],
        ['Hvor meget dessert pr. person?', `${h.k('mv-gaester')} skriver ${h.r('dessert-min', 'dessert-maks')} pr. voksen.`],
      ],
      soster: [L('flaeskesteg', 'Hvor meget flæskesteg pr. person?'), L('kartofler', 'Hvor meget kartofler pr. person?')],
    }),
  },
};

function p(...xs) { return xs.filter(Boolean).map((x) => `<p>${x}</p>`).join(''); }

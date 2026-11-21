// Tekst til familien «frysing» (da): kan man fryse det, og hvor længe holder det i fryseren. Hver sætning gengiver, hvad en navngiven kilde siger.
// Tal skrives aldrig her: h.t(felt) henter dem fra data.da.json, hvor hvert tal har sitatet fra kilden. Sætninger fra kilden hentes ordret med h.s(id).
// Hvor to kilder oplyser forskellige tal, står begge, og vi vælger ikke for læseren.
// Kilder: Forbrugerrådet Tænk (2025 og 2026), Madens Verden (2025), Arla (2026) og Fødevarestyrelsen (optøning). Ingen egne råd.
// Undgå ordene køleskab, rester, plan, uge, find, gem, sådan og ovn i h2-overskrifter, undtagen i app-blokken (se holdbarhet/tekst-da.mjs).

const KOELE = '/da/holdbarhed/';
const FRYS = '/da/kan-man-fryse/';
const F = (slug, tekst) => [`${FRYS}${slug}/`, tekst];
const R = (slug, tekst) => [`${KOELE}${slug}/`, tekst];

const FRYSER = (h) => `${h.k('taenk-nedfrys')} skriver, at fryseren skal være minimum ${h.t('frys18')}, for at maden kan opbevares sikkert.`;
const TID = 'Tid i fryseren';
const TAENK = (h) => `${h.k('taenk-holdbarhed')} oplyser disse tider i fryseren:`;
const KOL = ['Vare', 'Tid i fryseren'];
const KOL2 = ['Vare', 'Forbrugerrådet Tænk', 'Madens Verden'];
const OPT = (h) => `Om optøning skriver ${h.k('fvst-optoening')}: ${h.s('optoen', { med: false })}`;

export const TEKST = {
  kjott: (h) => ({
    ord: 'kød',
    title: 'Kan man fryse kød? Tid i fryseren for svin, okse og lam',
    h1: 'Kan man fryse kød?',
    description: `Ja. Magert svinekød holder cirka ${h.t('svin-mager')} i fryseren, fedt svinekød cirka ${h.t('svin-fedt')} og oksekød cirka ${h.t('okse')}, skriver ${h.k('taenk-holdbarhed')}. Madens Verden har andre tal.`,
    lead: `Ja, kød kan fryses. ${h.k('taenk-holdbarhed')} skriver cirka ${h.t('svin-mager')} for magert svinekød og cirka ${h.t('okse')} for oksekød. ${h.k('mv-fryser')} skriver ${h.t('mv-okse')} for oksekød i hele stykker. Tallene er ikke ens, og her står begge.`,
    kilder: [
      OPT(h),
      FRYSER(h),
      `Om fedt skriver Madens Verden: ${h.s('fedt', { med: false })} ${h.s('harsk', { med: false })}`,
      `Forbrugerrådet Tænk skriver: ${h.s('vejledende', { med: false })}`,
    ],
    tabell: {
      tittel: TID, kilde: 'taenk-holdbarhed', intro: 'To danske kilder oplyser tider i fryseren:', kolonner: KOL2,
      rader: [['Magert svinekød', { felt: 'svin-mager', ca: true }, { felt: 'mv-svin-mager', ca: true }], ['Fedt svinekød', { felt: 'svin-fedt', ca: true }, { felt: 'mv-svin-fedt', ca: true }], ['Oksekød i hele stykker', { felt: 'okse', ca: true }, 'mv-okse'], ['Lammekød', { felt: 'lam', ca: true }, 'mv-lam'], ['Pølser', 'poelser', 'mv-poelser'], ['Røget kød', 'roeget', null], ['Tilberedt kød', null, 'mv-tilb']],
      etter: [`Tænk (2025) og Madens Verden (2025) bruger ikke de samme inddelinger, og et felt kan derfor være tomt.`],
    },
    faq: [
      ['Hvor længe kan svinekød ligge i fryseren?', `${h.k('taenk-holdbarhed')} skriver cirka ${h.t('svin-mager')} for magert og cirka ${h.t('svin-fedt')} for fedt svinekød.`],
      ['Hvor længe kan oksekød ligge i fryseren?', `${h.k('taenk-holdbarhed')} skriver cirka ${h.t('okse')}, og ${h.k('mv-fryser')} skriver ${h.t('mv-okse')} for oksekød i hele stykker.`],
      ['Hvor længe kan kødet holde sig, når det er tøet op?', `Se <a href="${KOELE}rester/">hvor længe tilberedt kød kan holde sig i køleskabet</a>.`],
    ],
    soster: R('rester', 'Hvor længe kan rester af kød holde sig?'),
    andre: [F('hakket-koed', 'Kan man fryse hakket kød?'), F('kylling', 'Kan man fryse kylling?')],
  }),

  'hakket-koed': (h) => ({
    ord: 'hakket kød',
    title: 'Kan man fryse hakket kød? Så længe holder det i fryseren',
    h1: 'Kan man fryse hakket kød?',
    description: `Ja. Hakket kød holder cirka ${h.t('hak')} i fryseren og fars ${h.t('fars')}, skriver ${h.k('taenk-holdbarhed')}. Madens Verden skriver ${h.t('mv-okse')} for hakket oksekød.`,
    lead: `Ja, hakket kød kan fryses. ${h.k('taenk-holdbarhed')} skriver cirka ${h.t('hak')} for hakket kød og ${h.t('fars')} for fars. ${h.k('mv-fryser')} skriver ${h.t('mv-okse')} for hakket oksekød og ${h.t('mv-fars')} for fars med tilsatte ingredienser.`,
    kilder: [
      OPT(h),
      FRYSER(h),
      `Om hakket oksekød skriver Madens Verden: ${h.s('okse-faar', { med: false })} ${h.s('ikke-farlig', { med: false })}`,
    ],
    tabell: {
      tittel: TID, kilde: 'taenk-holdbarhed', intro: 'To danske kilder oplyser tider i fryseren:', kolonner: KOL2,
      rader: [['Hakket kød', { felt: 'hak', ca: true }, null], ['Hakket oksekød', null, 'mv-okse'], ['Hakket svinekød', null, 'mv-svin'], ['Fars', 'fars', null], ['Fars med tilsatte ingredienser', null, 'mv-fars']],
    },
    faq: [
      ['Hvor længe kan hakket kød ligge i fryseren?', `${h.k('taenk-holdbarhed')} skriver cirka ${h.t('hak')}, og ${h.k('mv-fryser')} skriver ${h.t('mv-okse')} for hakket oksekød.`],
      ['Bliver hakket kød farligt efter den tid?', `${h.k('mv-fryser')} skriver: ${h.s('ikke-farlig', { med: false })}`],
      ['Hvor længe kan hakket kød holde sig, når det ikke er frosset?', `Se <a href="${KOELE}hakket-koed/">hvor længe hakket kød kan holde sig i køleskabet</a>.`],
    ],
    soster: R('hakket-koed', 'Hvor længe kan hakket kød holde sig i køleskabet?'),
    andre: [F('koed', 'Kan man fryse kød?'), ['/da/kernetemperatur/hakket-koed/', 'Kernetemperatur for hakket kød']],
  }),

  kylling: (h) => ({
    ord: 'kylling',
    title: 'Kan man fryse kylling? Så længe holder den i fryseren',
    h1: 'Kan man fryse kylling?',
    description: `Ja. Kylling holder ${h.t('kylling')} i fryseren, skriver ${h.k('taenk-holdbarhed')}. Madens Verden skriver ${h.t('mv-hel')} for hel kylling og ${h.t('mv-stykker')} for kylling i stykker.`,
    lead: `Ja, kylling kan fryses. ${h.k('taenk-holdbarhed')} skriver ${h.t('kylling')}. ${h.k('mv-fryser')} skriver ${h.t('mv-hel')} for en hel kylling og ${h.t('mv-stykker')} for kylling i stykker.`,
    kilder: [
      OPT(h),
      FRYSER(h),
      `Om hel kylling og stykker skriver Madens Verden: ${h.s('hel', { med: false })} ${h.s('stykker', { med: false })}`,
      `Madens Verden skriver også: ${h.s('frostskade', { med: false })}`,
    ],
    tabell: {
      tittel: TID, kilde: 'taenk-holdbarhed', intro: 'To danske kilder oplyser tider i fryseren:', kolonner: KOL2,
      rader: [['Kylling', 'kylling', null], ['Hel kylling', null, 'mv-hel'], ['Kylling i stykker', null, 'mv-stykker']],
    },
    faq: [
      ['Hvor længe kan kylling ligge i fryseren?', `${h.k('taenk-holdbarhed')} skriver ${h.t('kylling')}.`],
      ['Hvor længe kan en hel kylling ligge i fryseren?', `${h.k('mv-fryser')} skriver ${h.t('mv-hel')} for en hel kylling.`],
      ['Hvor varmt skal kylling være, når den er færdig?', 'Se <a href="/da/kernetemperatur/kylling/">kernetemperatur for kylling</a>.'],
    ],
    soster: ['/da/kernetemperatur/kylling/', 'Kernetemperatur for kylling'],
    andre: [F('koed', 'Kan man fryse kød?'), F('hakket-koed', 'Kan man fryse hakket kød?')],
  }),

  fisk: (h) => ({
    ord: 'fisk',
    title: 'Kan man fryse fisk? Tid i fryseren for laks, torsk og fiskefars',
    h1: 'Kan man fryse fisk?',
    description: `Ja. Fed fisk som laks holder ${h.t('fed')} i fryseren og mager fisk som torsk ${h.t('mager')}, skriver ${h.k('taenk-holdbarhed')}. Madens Verden skriver det samme.`,
    lead: `Ja, fisk kan fryses. ${h.k('taenk-holdbarhed')} skriver ${h.t('fed')} for fed fisk og ${h.t('mager')} for mager fisk. ${h.k('mv-fryser')} skriver ${h.t('mv-fed')} for fed fisk som laks og ${h.t('mv-mager')} for mager fisk som torsk.`,
    kilder: [
      OPT(h),
      FRYSER(h),
      `Om fed og mager fisk skriver Madens Verden: ${h.s('fed-mager', { med: false })}`,
      `Madens Verden skriver også: ${h.s('frosset-koebt', { med: false })}`,
    ],
    tabell: {
      tittel: TID, kilde: 'taenk-holdbarhed', intro: 'To danske kilder oplyser tider i fryseren:', kolonner: KOL2,
      rader: [['Fed fisk, for eksempel laks', 'fed', 'mv-fed'], ['Mager fisk, for eksempel torsk', 'mager', 'mv-mager'], ['Røget fisk', { felt: 'roeget', ca: true }, { felt: 'mv-roeget', ca: true }], ['Fiskefars', 'fiskefars', null]],
    },
    faq: [
      ['Hvor længe kan laks ligge i fryseren?', `${h.k('taenk-holdbarhed')} skriver ${h.t('fed')} for fed fisk, og ${h.k('mv-fryser')} skriver ${h.t('mv-fed')} for fed fisk som laks.`],
      ['Hvor længe kan torsk ligge i fryseren?', `${h.k('taenk-holdbarhed')} skriver ${h.t('mager')} for mager fisk, og ${h.k('mv-fryser')} skriver ${h.t('mv-mager')} for mager fisk som torsk.`],
      ['Hvor længe kan frisk fisk holde sig i køleskabet?', `Se <a href="${KOELE}fisk/">hvor længe frisk fisk kan holde sig</a>.`],
    ],
    soster: R('fisk', 'Hvor længe kan frisk fisk holde sig i køleskabet?'),
    andre: [F('koed', 'Kan man fryse kød?')],
  }),

  middagsrester: (h) => ({
    ord: 'færdigretter',
    faqTittel: 'Spørgsmål og svar',
    title: 'Kan man fryse rester? Færdigretter og gryderetter i fryseren',
    h1: 'Kan man fryse rester og færdigretter?',
    description: `Ja. Færdige retter holder ${h.t('faerdige')} i fryseren, skriver ${h.k('taenk-holdbarhed')}. Madens Verden skriver ${h.t('mv-gryde')} for gryderetter og supper.`,
    lead: `Ja, færdige retter kan fryses. ${h.k('taenk-holdbarhed')} skriver ${h.t('faerdige')}, og ${h.k('mv-fryser')} skriver ${h.t('mv-gryde')} for færdige gryderetter og supper.`,
    kilder: [
      OPT(h),
      `Om opvarmning skriver ${h.k('fvst-varm')}: ${h.s('varm', { med: false })}`,
      FRYSER(h),
      `Forbrugerrådet Tænk skriver: ${h.s('rester', { med: false })}`,
      `Om portioner og afkøling skriver Madens Verden: ${h.s('portioner', { med: false })} ${h.s('koel', { med: false })}`,
      `Madens Verden skriver også: ${h.s('konsistens', { med: false })}`,
    ],
    tabell: {
      tittel: TID, kilde: 'taenk-holdbarhed', intro: 'To danske kilder oplyser tider i fryseren:', kolonner: KOL2,
      rader: [['Færdige retter', 'faerdige', null], ['Færdige gryderetter og supper', null, 'mv-gryde'], ['Tilberedt kød', null, 'mv-tilb']],
    },
    ekstra: [['Om kvalitet og sikkerhed', `<p>${h.k('taenk-holdbarhed')} skriver, at man ikke bliver syg af at spise mad, der har ligget længere i fryseren end den anbefalede tid, fordi bakterievækst stopper ved ${h.t('stop10')}. Maden bliver bare dårligere i kvalitet.</p>`]],
    faq: [
      ['Hvor længe kan en færdig ret ligge i fryseren?', `${h.k('taenk-holdbarhed')} skriver ${h.t('faerdige')}.`],
      ['Hvor længe kan suppe ligge i fryseren?', `${h.k('mv-fryser')} skriver ${h.t('mv-gryde')} for færdige gryderetter og supper.`],
      ['Hvor længe kan rester holde sig i køleskabet?', `Se <a href="${KOELE}rester/">hvor længe rester af kød kan holde sig</a>.`],
    ],
    soster: R('rester', 'Hvor længe kan rester af kød holde sig?'),
    andre: [F('koed', 'Kan man fryse kød?')],
  }),

  'frukt-og-gronnsaker': (h) => ({
    ord: 'frugt og grøntsager',
    title: 'Kan man fryse frugt og grøntsager? Tid i fryseren',
    h1: 'Kan man fryse frugt og grøntsager?',
    description: `Ja. Grøntsager holder ${h.t('groent')} i fryseren og frugt ${h.t('frugt')}, skriver ${h.k('taenk-holdbarhed')}. Madens Verden skriver ${h.t('mv-frugt')} for frugt og bær.`,
    lead: `Ja, frugt og grøntsager kan fryses. ${h.k('taenk-holdbarhed')} skriver ${h.t('groent')} for grøntsager og ${h.t('frugt')} for frugt. ${h.k('mv-fryser')} skriver ${h.t('mv-groent')} og ${h.t('mv-frugt')}.`,
    kilder: [
      FRYSER(h),
      `Om grøntsager skriver Madens Verden: ${h.s('blanchere', { med: false })}`,
      `Om frugt og bær skriver Madens Verden: ${h.s('bloedere', { med: false })}`,
    ],
    tabell: {
      tittel: TID, kilde: 'taenk-holdbarhed', intro: 'To danske kilder oplyser tider i fryseren:', kolonner: KOL2,
      rader: [['Grøntsager', 'groent', 'mv-groent'], ['Frugt og frugtprodukter', 'frugt', null], ['Frugt og bær', null, 'mv-frugt']],
    },
    faq: [
      ['Hvor længe kan grøntsager ligge i fryseren?', `${h.k('taenk-holdbarhed')} skriver ${h.t('groent')}, afhængig af emballagen og grøntsagstypen.`],
      ['Hvor længe kan bær ligge i fryseren?', `${h.k('mv-fryser')} skriver ${h.t('mv-frugt')} for frugt og bær.`],
      ['Hvor længe kan grøntsager holde sig i køleskabet?', `Se <a href="${KOELE}groentsager/">hvor længe grøntsager kan holde sig</a> og <a href="${KOELE}baer/">hvor længe bær kan holde sig</a>.`],
    ],
    soster: R('groentsager', 'Hvor længe kan grøntsager holde sig i køleskabet?'),
    andre: [R('baer', 'Hvor længe kan bær holde sig i køleskabet?')],
  }),

  brod: (h) => ({
    ord: 'brød',
    title: 'Kan man fryse brød? Så længe holder brød og kager i fryseren',
    h1: 'Kan man fryse brød og kager?',
    description: `Ja. Brød og boller holder ${h.t('brod')} i fryseren, og kager uden creme ${h.t('kager')}, skriver ${h.k('mv-fryser')}.`,
    lead: `Ja, brød og boller kan fryses. ${h.k('mv-fryser')} skriver ${h.t('brod')} for brød og boller og ${h.t('kager')} for kager uden creme.`,
    kilder: [
      FRYSER(h),
      `Om brød skriver Madens Verden: ${h.s('skiver', { med: false })} ${h.s('boller', { med: false })}`,
      `Madens Verden skriver også: ${h.s('tor', { med: false })}`,
    ],
    tabell: { tittel: TID, kilde: 'mv-fryser', intro: `${h.k('mv-fryser')} oplyser disse tider i fryseren:`, kolonner: KOL, rader: [['Brød og boller', 'brod'], ['Kager uden creme', 'kager']] },
    faq: [
      ['Hvor længe kan brød ligge i fryseren?', `${h.k('mv-fryser')} skriver ${h.t('brod')} for brød og boller.`],
      ['Kan man fryse kager?', `${h.k('mv-fryser')} oplyser ${h.t('kager')} for kager uden creme. For kager med creme fandt vi ikke et tal.`],
    ],
    andre: [F('kylling', 'Kan man fryse kylling?')],
  }),

  ost: (h) => ({
    ord: 'ost og smør',
    title: 'Kan man fryse ost og smør? Tid i fryseren',
    h1: 'Kan man fryse ost og smør?',
    description: `Ja. Skæreost med mindst ${h.t('fedt25')} fedt kan fryses i op til ${h.t('skaere')}, og smør i op til ${h.t('smor')}, skriver ${h.k('arla-ost')} og ${h.k('arla-smor')}.`,
    lead: `Ja. ${h.k('arla-ost')} skriver, at skæreoste med minimum ${h.t('fedt25')} fedt kan fryses i op til ${h.t('skaere')}. ${h.k('arla-smor')} skriver, at smør kan fryses i op til ${h.t('smor')}.`,
    kilder: [
      OPT(h),
      `Om ost skriver Arla: ${h.s('moden', { med: false })} ${h.s('portioner', { med: false })} ${h.s('optoe', { med: false })}`,
      `Om blød ost skriver Arla: ${h.s('bloede', { med: false })}`,
      `Om fløde skriver Arla: ${h.s('karton', { med: false })} ${h.s('floede', { med: false })}`,
      FRYSER(h),
    ],
    tabell: {
      tittel: TID, kilde: 'arla-ost', intro: 'Arla oplyser disse tider i fryseren:', kolonner: KOL,
      rader: [['Skæreost med mindst 25 % fedt', 'skaere'], ['Revet ost', 'revet'], ['Smør', 'smor']],
      etter: ['Arla skriver, at flødeoste og hårde oste som parmesan er uegnede til frysning, og at skimmelost bedst bruges til madlavning efter frysning.'],
    },
    faq: [
      ['Kan man fryse ost?', `${h.k('arla-ost')} skriver, at skæreoste med minimum ${h.t('fedt25')} fedt kan fryses i op til ${h.t('skaere')}.`],
      ['Kan man fryse smør?', `${h.k('arla-smor')} skriver, at smør kan fryses i op til ${h.t('smor')}.`],
      ['Kan man fryse fløde?', `${h.k('arla-flode')} skriver: ${h.s('floede', { med: false })}`],
    ],
    soster: R('ost', 'Hvor længe kan ost holde sig i køleskabet?'),
    andre: [R('maelk', 'Hvor længe kan mælk, fløde og smør holde sig?')],
  }),
};

const OVERSIKT = {
  kjott: [['Magert svinekød', 'svin-mager'], ['Oksekød', 'okse'], ['Lammekød', 'lam']],
  'hakket-koed': [['Hakket kød', 'hak']],
  kylling: [['Kylling', 'kylling']],
  fisk: [['Fed fisk, for eksempel laks', 'fed'], ['Mager fisk, for eksempel torsk', 'mager']],
  middagsrester: [['Færdige retter', 'faerdige']],
  'frukt-og-gronnsaker': [['Grøntsager', 'groent'], ['Frugt og frugtprodukter', 'frugt']],
  brod: [['Brød og boller', 'brod']],
  ost: [['Skæreost med mindst 25 % fedt', 'skaere'], ['Smør', 'smor']],
};

export function nav({ rader, sti, h, p, esc }) {
  const forste = h(rader[0]);
  const radene = rader.flatMap((r) => {
    const x = h(r);
    return (OVERSIKT[r.id] ?? []).map(([etikett, felt]) => `<tr><td><a href="${sti(r)}">${esc(etikett)}</a></td><td>${x.t(felt, { ca: ['svin-mager', 'okse', 'lam', 'hak'].includes(felt) })}</td><td>${x.k(r.tall[felt]?.kilde ?? r.tall[`${felt}-min`].kilde)}</td></tr>`);
  }).join('');
  return {
    title: 'Kan man fryse det? Tid i fryseren for kød, fisk, brød og mere',
    h1: 'Kan man fryse det? Tid i fryseren',
    description: 'Kan man fryse kød, fisk, brød, ost og grøntsager, og hvor længe holder de? Tider fra Forbrugerrådet Tænk, Madens Verden og Arla, med kilde på hvert tal.',
    lead: `Fryseren skal ifølge Forbrugerrådet Tænk være minimum ${forste.t('frys18')}. Hvert tal på siderne her står hos en navngiven kilde med årstal.`,
    rik: [
      `<h2>Hvad kilderne siger</h2>${p([
        `${forste.k('taenk-nedfrys')} skriver, at fryseren skal være minimum ${forste.t('frys18')}, for at maden kan opbevares sikkert.`,
        `Om optøning skriver ${forste.k('fvst-optoening')}: ${forste.s('optoen', { med: false })}`,
        'Fødevarestyrelsen har ikke selv tider for hver enkelt vare i fryseren. Tiderne nedenfor er derfor fra Forbrugerrådet Tænk, Madens Verden og Arla, hver med årstal.',
      ])}`,
      `<h2>Tider for alle varer</h2><p>Vælg en vare for hele tiden, kilderne bag den og de andre sider. Kilden står i sidste kolonne.</p><div class="table-wrap" tabindex="0" role="region" aria-label="Tider i fryseren"><table class="sprik"><thead><tr><th scope="col">Vare</th><th scope="col">Tid i fryseren</th><th scope="col">Kilde</th></tr></thead><tbody>${radene}</tbody></table></div>`,
      '<h2>Varer der ikke er med</h2><p>Vi skriver kun en tid, når vi selv har fundet den hos en kilde og set tallet på siden. Æg, mælk, skaldyr og kager med creme mangler, fordi vi ikke fandt en dansk kilde med et tal for dem.</p>',
      `<div class="related"><h2>Læs også</h2><ul><li><a href="${KOELE}">Hvor længe kan mad holde sig i køleskabet?</a></li></ul></div>`,
    ].join('\n'),
    faqTittel: 'Spørgsmål om fryseren',
    faq: [
      ['Hvor koldt skal en fryser være?', `${forste.k('taenk-nedfrys')} skriver, at fryseren skal være minimum ${forste.t('frys18')}.`],
      ['Hvordan tør man mad op?', `${forste.k('fvst-optoening')} skriver: ${forste.s('optoen', { med: false })}`],
    ],
  };
}

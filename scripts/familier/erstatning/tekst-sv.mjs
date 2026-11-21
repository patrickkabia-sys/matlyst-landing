// Text för familjen «erstatning» (sv): vad du kan använda i stället för en vara du saknar. Varje mening återger vad en namngiven svensk källa säger.
// Siffror skrivs aldrig här: h.t(fält) läser dem ur data.sv.json, och h.s(id) ger en hel mening ur källan, ordagrant.
// Källor: KronJäst (jäst), Kungsörnen (mjöl), Dansukker (socker) och Svenska Ägg (ägg). Där källorna inte ger en mängd står det, och sidan ger inget tal.
// Vi har inte hittat en svensk källa som kan kontrolleras med mängder för att ersätta ägg, filmjölk, smör, bakpulver eller grädde, så de varorna har ingen egen sida.
// Inga egna recept och inga råd om allergi. Undvik orden laga, steg, ugn, timer, plan, vecka, meny, köp, spara, recept, hitta i h2: scripts/app-bevis.mjs kopplar dem till appkort.

const E = '/sv/ersatta/';
const L = (slug, text) => [`${E}${slug}/`, text];

export const TEKST = {
  gjaer: (h) => ({
    ord: 'jäst',
    title: 'Ersätta färsk jäst med torrjäst: hur mycket?',
    h1: 'Ersätta färsk jäst med torrjäst: hur mycket?',
    description: `KronJäst (2026): ${h.t('torr-g')} torrjäst, ungefär ${h.t('torr-tsk')}, motsvarar ${h.t('farsk-g')} färsk jäst. Så säger jästtillverkaren, med källa.`,
    lead: `KronJäst säger att 1 paket torrjäst på ${h.t('torr-g')}, ungefär ${h.t('torr-tsk')}, motsvarar 1 paket färsk jäst på ${h.t('farsk-g')}.`,
    kilder: [
      `Om skillnaden: ${h.s('start')}`,
      `Om hur torrjäst blandas: ${h.s('instant')}`,
      `Om förvaring: ${h.s('frys')} ${h.k('kron')} anger också att en öppnad förpackning torrjäst bör förbrukas inom ${h.t('oppnad')}.`,
      `Om små mängder: ${h.k('kronlex')} anger att en knivsudd jäst är ungefär ${h.t('knivsudd')}.`,
    ],
    tabell: {
      tittel: 'Torrjäst och färsk jäst', kilde: 'kron', intro: 'KronJäst anger det här för sina egna produkter.',
      kolonner: ['Jäst', 'Mängd'],
      rader: [['Torrjäst, 1 paket', { tekst: `${h.t('torr-g')}, ungefär ${h.t('torr-tsk')}` }], ['Färsk jäst, 1 paket', 'farsk-g']],
      etter: ['Siffran gäller KronJästs produkter. För andra märken står mängden på förpackningen.'],
    },
    faq: [
      ['Hur mycket torrjäst motsvarar färsk jäst?', `${h.k('kron')} anger att 1 paket torrjäst på ${h.t('torr-g')}, ungefär ${h.t('torr-tsk')}, motsvarar 1 paket färsk jäst på ${h.t('farsk-g')}.`],
      ['Måste torrjäst aktiveras?', `${h.s('start')}`],
      ['Kan man frysa jäst?', `${h.s('frys')}`],
    ],
    soster: L('vaniljsocker', 'Ersätta vaniljsocker'),
    andre: [L('lantvetemjol', 'Ersätta lantvetemjöl')],
  }),

  hvetemel: (h) => ({
    ord: 'lantvetemjöl',
    title: 'Ersätta lantvetemjöl: Kungsörnens råd',
    h1: 'Vad kan man ersätta lantvetemjöl med?',
    description: `Kungsörnen (2026) rekommenderar ${h.t('vete')} Vetemjöl Special och ${h.t('rag')} Rågsikt som ersättning för lantvetemjöl, när du följer ett gammalt recept.`,
    lead: `Kungsörnen rekommenderar ${h.t('vete')} Vetemjöl Special och ${h.t('rag')} Rågsikt som ersättning för lantvetemjöl. Svaret kommer från Kungsörnens kundforum.`,
    kilder: [`Om resultatet: ${h.s('ger')}`],
    tabell: {
      tittel: 'Blandningen enligt Kungsörnen', kilde: 'kungs', intro: 'Svaret gäller en fråga om ett gammalt recept som anger lantvetemjöl.',
      kolonner: ['Mjöl', 'Andel'], rader: [['Vetemjöl Special', 'vete'], ['Rågsikt', 'rag']],
      etter: ['Källan är ett svar från Kungsörnen i kundforumet, inte en officiell mjölguide. Vi har inte hittat en svensk källa med mängder för att ersätta andra mjölsorter.'],
    },
    faq: [
      ['Vad kan man ersätta lantvetemjöl med?', `${h.k('kungs')} rekommenderar ${h.t('vete')} Vetemjöl Special och ${h.t('rag')} Rågsikt.`],
      ['Hur blir mjölet?', `${h.s('ger')}`],
    ],
    soster: L('jast', 'Ersätta färsk jäst med torrjäst'),
  }),

  'brun-farin': (h) => ({
    ord: 'brun farin',
    title: 'Ersätta strösocker med brun farin: samma mängd?',
    h1: 'Ersätta strösocker med brun farin: samma mängd?',
    description: `Dansukker (2026): strösocker kan bytas mot Brun Farin Strö i samma mängd, men smaken blir fylligare och färgen mörkare. Vikt per dl: ${h.t('stro-dl')} strösocker, ${h.t('far-dl')} farinsocker.`,
    lead: `Dansukker säger att du kan byta ut strösocker mot Brun Farin Strö i samma mängd. Smaken blir fylligare och färgen något mörkare. Farinsocker är fuktigare, så resultatet blir ett annat.`,
    kilder: [
      `Om Brun Farin Strö: ${h.s('samma')}`,
      `Om saftigheten: ${h.s('sirap')}`,
      `Om farinsocker: ${h.s('skillnad')}`,
      `Om melass: ${h.s('mel')}`,
    ],
    tabell: {
      tittel: 'Vikt per mått enligt Dansukker', kilde: 'dstro', intro: 'Volymmått och vikt, så du kan väga i stället för att mäta.',
      kolonner: ['Mått', 'Strösocker', 'Farinsocker'],
      rader: [['1 dl', 'stro-dl', 'far-dl'], ['1 msk', 'stro-msk', 'far-msk'], ['1 tsk', 'stro-tsk', 'far-tsk']],
      etter: [`${h.k('dfar')} är källan för farinsockret.`],
    },
    faq: [
      ['Kan man ersätta strösocker med brun farin?', `${h.s('samma')}`],
      ['Vad är skillnaden på farinsocker och strösocker?', `${h.s('skillnad')}`],
      ['Hur mycket väger 1 dl strösocker?', `${h.k('dstro')} anger ungefär ${h.t('stro-dl')}, och ${h.t('far-dl')} för farinsocker.`],
    ],
    soster: L('florsocker', 'Ersätta florsocker med strösocker'),
    andre: [L('vaniljsocker', 'Ersätta vaniljsocker')],
  }),

  florsocker: (h) => ({
    ord: 'florsocker',
    title: 'Ersätta florsocker med strösocker: går det?',
    h1: 'Ersätta florsocker med strösocker: går det?',
    description: `Dansukker (2026): florsocker kan ersättas med strösocker i vissa recept, men resultatet blir ofta annorlunda. ${h.t('hundra')} florsocker motsvarar ungefär ${h.t('hundra-dl')}.`,
    lead: `Dansukker säger att florsocker kan ersättas med strösocker i vissa recept, men att resultatet blir ofta annorlunda. ${h.t('hundra')} florsocker motsvarar ungefär ${h.t('hundra-dl')}.`,
    kilder: [
      `Om bytet: ${h.s('ersatt')}`,
      `Om skillnaden: ${h.s('grov')}`,
      `Om glasyr: ${h.s('glasyr')}`,
      `Om att smälta: ${h.s('smalta')}`,
    ],
    tabell: {
      tittel: 'Vikt per mått enligt Dansukker', kilde: 'dflor', intro: 'Florsocker är lätt, så samma volym väger mindre än strösocker.',
      kolonner: ['Mått', 'Florsocker', 'Strösocker'], rader: [['1 dl', 'flor-dl', 'stro-dl']],
      etter: [`${h.k('dflor')} anger att ${h.t('hundra')} florsocker motsvarar ungefär ${h.t('hundra-dl')}. Strösockrets vikt kommer från ${h.k('dstro')}.`],
    },
    faq: [
      ['Kan man ersätta florsocker med strösocker?', `${h.s('ersatt')}`],
      ['Hur många dl är 100 gram florsocker?', `${h.k('dflor')} anger att ${h.t('hundra')} florsocker motsvarar ungefär ${h.t('hundra-dl')}.`],
    ],
    soster: L('brun-farin', 'Ersätta strösocker med brun farin'),
    andre: [L('vaniljsocker', 'Ersätta vaniljsocker')],
  }),

  vaniljsukker: (h) => ({
    ord: 'vaniljsocker',
    title: 'Ersätta vaniljsocker med vaniljstång: hur mycket?',
    h1: 'Ersätta vaniljsocker: vaniljstång, vaniljpulver och mängd',
    description: `Dansukker (2026): vaniljsocker kan ersättas med vaniljstång tillsammans med strösocker, men mängd och sötma behöver justeras. Högst ${h.t('hogst')} vaniljsocker för ${h.t('portioner')}.`,
    lead: `Dansukker säger att vaniljsocker kan ersättas med vaniljstång, men att du då behöver justera både sötma och mängd. Källan anger högst ${h.t('hogst')} vaniljsocker för ${h.t('portioner')}.`,
    kilder: [
      `Om vaniljstång: ${h.s('stang')}`,
      `Om hur man byter: ${h.s('stang2')}`,
      `Om vaniljpulver: ${h.s('pulver')}`,
      `Om sötma: ${h.s('mer')}`,
    ],
    tabell: {
      tittel: 'Vikt per mått enligt Dansukker', kilde: 'dvan', intro: 'Dansukkers vaniljsocker.',
      kolonner: ['Mått', 'Vikt'], rader: [['1 dl', 'van-dl'], ['1 msk', 'van-msk'], ['1 tsk', 'van-tsk']],
      etter: ['Dansukker anger ingen exakt mängd vaniljstång som motsvarar en mängd vaniljsocker, så vi ger ingen.'],
    },
    faq: [
      ['Kan man ersätta vaniljsocker med vaniljstång?', `${h.s('stang')}`],
      ['Hur mycket vaniljsocker ska man använda?', `${h.k('dvan')} anger högst ${h.t('hogst')} för ${h.t('portioner')}.`],
      ['Vad är skillnaden på vaniljsocker och vaniljpulver?', `${h.s('pulver')}`],
    ],
    soster: L('florsocker', 'Ersätta florsocker med strösocker'),
    andre: [L('jast', 'Ersätta färsk jäst med torrjäst')],
  }),

  syltsocker: (h) => ({
    ord: 'syltsocker',
    title: 'Ersätta syltsocker med vanligt socker',
    h1: 'Vad kan man ersätta syltsocker med?',
    description: `Dansukker (2026): i stället för syltsocker kan du använda vanligt socker tillsammans med extra pektin eller pektinrika frukter. Vikt per dl: ${h.t('dl')}.`,
    lead: `Dansukker säger att du i stället för syltsocker kan använda vanligt socker tillsammans med extra pektin eller pektinrika frukter, som äpplen. Syltsocker väger ${h.t('dl')} per dl.`,
    kilder: [`Om bytet: ${h.s('istallet')}`, `Om gelé: ${h.s('gele')}`],
    tabell: { tittel: 'Vikt per mått enligt Dansukker', kilde: 'dsylt', intro: 'Dansukkers syltsocker.', kolonner: ['Mått', 'Vikt'], rader: [['1 dl', 'dl'], ['1 msk', 'msk'], ['1 tsk', 'tsk']] },
    faq: [['Vad kan man använda i stället för syltsocker?', `${h.s('istallet')}`], ['Kan man använda syltsocker till gelé?', `${h.s('gele')}`]],
    soster: L('brun-farin', 'Ersätta strösocker med brun farin'),
  }),

  egg: (h) => ({
    ord: 'ägg',
    title: 'Ägg i olika storlekar: vad räknar receptet med?',
    h1: 'Ägg i olika storlekar: vad räknar receptet med?',
    description: `Svenska Ägg (2026): recept räknar oftast med medelstora ägg, ${h.t('medel')}. Små ägg väger ${h.t('liten')}, stora ${h.t('stor')}. Det går cirka ${h.t('kilo')} medelstora ägg på ett kilo.`,
    lead: `Svenska Ägg säger att recept oftast är skrivna efter medelstora ägg, ${h.t('medel')}. Har du ägg i en annan storlek, ser du här hur mycket de väger.`,
    kilder: [
      `Om recepten: ${h.s('recept')}`,
      `Om större ägg: ${h.s('skal')}`,
      `Om vikt: ${h.k('sagg')} anger att medelvikten är ungefär ${h.t('snitt')}, och att det går cirka ${h.t('kilo')} medelstora ägg på ett kilo.`,
    ],
    tabell: {
      tittel: 'Äggstorlekar enligt Svenska Ägg', kilde: 'sagg', intro: 'Vikt per ägg.',
      kolonner: ['Storlek', 'Vikt'],
      rader: [['Små', 'liten'], ['Medelstora', 'medel'], ['Stora', 'stor'], ['Extra stora, över', 'xl']],
      etter: ['Vi har inte hittat en svensk källa med mängder för att ersätta ägg i bakning, till exempel med banan eller äppelmos. Därför handlar sidan bara om storleken, och vi ger ingen mängd för ersättningar.'],
    },
    faq: [
      ['Vilken äggstorlek räknar recept med?', `${h.s('recept')}`],
      ['Hur mycket väger ett ägg?', `${h.k('sagg')} anger att ett medelstort ägg väger ${h.t('medel')}, med en medelvikt på ungefär ${h.t('snitt')}.`],
      ['Hur många ägg går det på ett kilo?', `${h.k('sagg')} anger cirka ${h.t('kilo')} medelstora ägg.`],
    ],
    soster: [`/sv/tillagningstid/koka-agg/`, 'Koka ägg: hur länge?'],
    andre: [[`/sv/hallbarhet/agg/`, 'Hur länge håller ägg?']],
  }),
};

export function nav({ data, rader, sti, h, p, esc }) {
  const jast = h(rader.find((r) => r.id === 'gjaer'));
  const farin = h(rader.find((r) => r.id === 'brun-farin'));
  const OVERSIKT = {
    gjaer: ['Torrjäst per paket färsk jäst', (x) => `${x.t('torr-g')} per ${x.t('farsk-g')}`, 'kron'],
    hvetemel: ['Ersättning för lantvetemjöl', (x) => `${x.t('vete')} Vetemjöl Special och ${x.t('rag')} Rågsikt`, 'kungs'],
    'brun-farin': ['Strösocker mot Brun Farin Strö', () => 'Samma mängd', 'dbfs'],
    florsocker: ['100 g florsocker', (x) => x.t('hundra-dl'), 'dflor'],
    vaniljsukker: ['Högst per 4 portioner', (x) => `${x.t('hogst')}`, 'dvan'],
    syltsocker: ['Vikt per dl', (x) => x.t('dl'), 'dsylt'],
    egg: ['Medelstort ägg', (x) => x.t('medel'), 'sagg'],
  };
  const radene = rader.map((r) => {
    const x = h(r);
    const [etikett, tekst, kilde] = OVERSIKT[r.id];
    return `<tr><td><a href="${sti(r)}">${esc(r.navn)}</a></td><td>${esc(etikett)}</td><td>${tekst(x)}</td><td>${x.k(kilde)}</td></tr>`;
  }).join('');
  return {
    title: 'Ersätta ingredienser: vad kan man använda i stället?',
    h1: 'Ersätta ingredienser: vad kan man använda i stället?',
    description: `Vad kan man använda i stället för jäst, lantvetemjöl, florsocker eller vaniljsocker? ${rader.length} sidor med mängder från KronJäst, Kungsörnen, Dansukker och Svenska Ägg, med källa på varje siffra.`,
    lead: `Mängderna på de här sidorna kommer från svenska källor. KronJäst säger till exempel att ${jast.t('torr-g')} torrjäst motsvarar ${jast.t('farsk-g')} färsk jäst. Hittar vi ingen mängd, skriver vi det.`,
    rik: [
      `<h2>Det här säger källorna</h2>${p([
        `${jast.k('kron')} anger att 1 paket torrjäst på ${jast.t('torr-g')} motsvarar 1 paket färsk jäst på ${jast.t('farsk-g')}.`,
        `${farin.k('dbfs')} anger att strösocker kan bytas mot Brun Farin Strö i samma mängd.`,
      ])}`,
      `<h2>Mängder för varje vara</h2><p>Välj en vara för alla siffror, vad de bygger på och källorna. Källan står i sista kolumnen.</p><div class="table-wrap" tabindex="0" role="region" aria-label="Ersättningar"><table class="sprik"><thead><tr><th scope="col">Vara</th><th scope="col">Vad</th><th scope="col">Siffra</th><th scope="col">Källa</th></tr></thead><tbody>${radene}</tbody></table></div>`,
      '<h2>Varor som inte finns här</h2><p>Vi anger bara en mängd när vi har hittat den på en svensk källsida som vi kan kontrollera. För ägg i bakning, filmjölk, smör, bakpulver och grädde har vi inte hittat en sådan källa, så de har ingen egen sida. Vi hittar inte på egna mängder.</p>',
      '<div class="related"><h2>Läs också</h2><ul><li><a href="/sv/recept-pa-ingredienser/">Vad kan jag laga med det jag har hemma?</a></li><li><a href="/sv/hallbarhet/">Hur länge håller maten i kylen?</a></li></ul></div>',
    ].join('\n'),
    faqTittel: 'Frågor om ersättningar',
    faq: [
      ['Hur mycket torrjäst motsvarar färsk jäst?', `${jast.k('kron')} anger att ${jast.t('torr-g')} torrjäst motsvarar ${jast.t('farsk-g')} färsk jäst.`],
      ['Kan man byta strösocker mot brun farin?', `${farin.k('dbfs')} anger att du kan byta strösocker mot Brun Farin Strö i samma mängd, men att smaken blir fylligare och färgen något mörkare.`],
      ['Varför finns inte ägg, filmjölk och smör här?', 'Vi har inte hittat en svensk källa med mängder som vi kan kontrollera mot källsidan. Då skriver vi hellre att vi saknar siffran än hittar på en.'],
    ],
  };
}

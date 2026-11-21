// Text for the family «steketid» (en-US): how long to cook and thaw turkey, ham, roasts, chicken, lamb, and eggs.
// Every sentence restates what a named source says. Numbers are never written here: h.t(field) reads them from data.en.json,
// where each one carries a quote from the source, and h.s(id) quotes a sentence word for word. kildekontroll.mjs checks that every
// quote still stands on the source page. Sources: USDA FSIS (fsis-*), FoodSafety.gov (fs-chart), Oregon State Extension (osu-egg).
// Times are the sources' approximate times, and every page says the thermometer decides. No advice of our own.
// Avoid cook/heat/store/list/week/plan words in h2 headings that should not get an app card: scripts/app-bevis.mjs matches them.

const K = '/en/internal-temperature/';
const S = '/en/cooking-times/';
const FRIDGE = '/en/how-long-does-it-last/';
const FREEZE = '/en/can-you-freeze/';
const kk = (slug, text) => [`${K}${slug}/`, text];
const ss = (slug, text) => [`${S}${slug}/`, text];
const rr = (slug, text) => [`${FRIDGE}${slug}/`, text];
const ff = (slug, text) => [`${FREEZE}${slug}/`, text];
const THANKS = ['/en/holidays/thanksgiving/', 'Thanksgiving plan: timeline, portions, and oven schedule'];
const TERMO = kk('thermometer', 'How to use a food thermometer');

/** En rad i en tidstabell: etikett, vekt og tid fra feltene `${k}w` og `${k}t`. */
const radTid = (h, etikett, k) => [etikett, { html: h.t(`${k}w`) }, { html: h.t(`${k}t`) }];

export const TEKST = {
  kalkun: (h, { tabell, p, liste }) => ({
    ord: 'turkey',
    kalk: true,
    title: 'How long to cook a turkey: time by weight and calculator',
    h1: 'How long does it take to cook a turkey?',
    description: `${h.k('fsis-turkey')} gives roasting times by weight for a turkey in a ${h.t('ovn')} oven, stuffed and unstuffed. Type in the weight of your turkey to see the time, then check with a thermometer.`,
    lead: `FSIS gives turkey roasting times by weight band, at ${h.t('ovn')}. A 16 pound turkey, unstuffed, takes ${h.t('u3t')}. Type in your weight below. The turkey is done when a thermometer reads ${h.t('min')}, not when the timer rings.`,
    blokker: [
      ['Roasting time calculator', p([`The calculator looks your weight up in the ${h.k('fsis-turkey')} table below. FSIS gives a range for each band of weights, so you get a range back, not one exact minute. ${h.s('rask')}`]) + '@@KALK@@'],
      ['Roasting time by weight', tabell({
        tittel: 'Turkey roasting times at 325°F',
        kolonner: ['Whole turkey weight', 'Unstuffed', 'Stuffed'],
        rader: [1, 2, 3, 4, 5].map((i) => [h.t(`u${i}w`), { html: h.t(`u${i}t`) }, { html: h.t(`s${i}t`) }]),
      }) + h.note('fsis-turkey') + p([`A weight on the line between two bands, such as ${h.n('u2w-min')} or ${h.n('u2w-maks')} pounds, is in both rows.`])],
      ['Before it goes in the oven', p([
        `${h.k('fsis-turkey')} says to set the oven temperature no lower than ${h.t('lavest')}. ${h.s('forvarm')}`,
        h.s('tau'),
        `The turkey goes breast-side up on a flat wire rack in a shallow roasting pan, ${h.t('dyp')} deep. A tent of aluminum foil may go loosely over the breast for the first ${h.t('folie')}, then come off for browning.`,
      ])],
      ['Why your turkey may take longer or shorter', p([`${h.k('fsis-turkey-cook')} lists some of the reasons:`]) + liste([h.s('vari'), h.s('morkt'), h.s('pose'), h.s('ovnfeil')])],
      ['How to know it is done', p([
        `A whole turkey is safe at ${h.t('min')} throughout. ${h.s('bein')}`,
        `${h.k('fsis-turkey-cook')} says the bird should stand ${h.t('hvile')} before the stuffing comes out and it is carved, so the juices can set.`,
        h.s('fylling'),
        `More on the number and the spots: <a href="${K}turkey/">turkey internal temperature</a>.`,
      ])],
      ['A frozen turkey', p([h.s('frysttekst'), `${h.k('fsis-alt')} gives this rule for roasting from frozen: use the timing for the size of turkey you have, then add ${h.t('fryst')} of that time. ${h.s('sjekk')}`])],
    ],
    faq: [
      ['How long does a 16 pound turkey take to roast?', `${h.k('fsis-turkey')} gives ${h.t('u3t')} unstuffed, and ${h.t('s3t')} stuffed, for a whole turkey of ${h.t('u3w')}, at ${h.t('ovn')}.`],
      ['How long does a 10 pound turkey take?', `A turkey of ${h.t('u1w')} takes ${h.t('u1t')} unstuffed and ${h.t('s1t')} stuffed, says ${h.k('fsis-turkey')}.`],
      ['How long should the turkey rest?', `${h.k('fsis-turkey-cook')} says to let the bird stand ${h.t('hvile')} before carving.`],
      ['Is it safe to roast a turkey from frozen?', `${h.k('fsis-alt')} says it is safe to roast a turkey from the frozen state, but it will take longer. Add ${h.t('fryst')} to the time.`],
      ['Should the turkey be stuffed?', h.s('fylling')],
    ],
    soster: kk('turkey', 'Turkey internal temperature'),
    andre: [ss('thaw-turkey', 'How long to thaw a turkey'), ['/en/how-much-per-person/turkey/', 'How much turkey per person?'], ss('turkey-breast', 'How long to cook a turkey breast'), ss('turkey-legs-and-wings', 'How long to cook turkey legs, thighs, and wings'), ss('fried-smoked-grilled-turkey', 'How long to fry, grill, or smoke a turkey'), THANKS, rr('turkey-leftovers', 'How long do turkey leftovers last?')],
  }),

  kalkunbryst: (h, { tabell, p }) => ({
    ord: 'turkey breast',
    title: 'How long to cook a turkey breast, by weight',
    h1: 'How long does a turkey breast take to cook?',
    description: `A whole turkey breast of ${h.t('a1w')} takes ${h.t('a1t')} at ${h.t('ovn')}. A breast half of ${h.t('hw')} takes ${h.t('ht')}. Times from ${h.k('fsis-turkey')}.`,
    lead: `A whole turkey breast of ${h.t('a1w')} takes ${h.t('a1t')} in a ${h.t('ovn')} oven, says ${h.k('fsis-turkey')}. The breast is done at ${h.t('min')}.`,
    blokker: [
      ['The FSIS times for turkey breast', tabell({
        tittel: 'Turkey breast roasting times',
        kolonner: ['Cut', 'Weight', 'Time'],
        rader: [['Breast half', { html: h.t('hw') }, { html: h.t('ht') }], ['Whole breast', { html: h.t('a1w') }, { html: h.t('a1t') }], ['Whole breast', { html: h.t('a2w') }, { html: h.t('a2t') }]],
      }) + h.note('fsis-turkey') + p([`A whole breast of ${h.t('a2w')} also has a stuffed time in the table: ${h.t('a2s')}.`])],
      ['The setup', p([`FSIS says these times are for a turkey at ${h.t('ovn')}, in the oven temperature chart for whole birds. ${h.s('rack')}`, h.s('approx')])],
      ['When is it done?', p([`${h.k('fsis-turkey')} says a turkey is safe cooked to a minimum internal temperature of ${h.t('min')}. ${h.s('hoyere')} The bird stands ${h.t('hvile')} before carving, per ${h.k('fsis-turkey-cook')}.`])],
      ['In the microwave', p([`${h.k('fsis-turkey')} also gives microwave times for parts. A bone-in breast half on medium takes ${h.t('mikro')}.`])],
      ['A frozen breast', p([`${h.k('fsis-alt')} says to take the timing for your size and add ${h.t('fryst')} of that time when you roast from frozen.`])],
    ],
    faq: [
      ['How long does a 6 pound turkey breast take?', `A weight of ${h.t('a1w')} takes ${h.t('a1t')}. A breast of ${h.t('a2w')} takes ${h.t('a2t')}. A weight on the line between the two rows is in both. Source: ${h.k('fsis-turkey')}.`],
      ['What temperature is a turkey breast done?', `${h.t('min')}, measured with a food thermometer.`],
      ['How long does half a turkey breast take?', `${h.k('fsis-turkey')} gives ${h.t('ht')} for a breast half of ${h.t('hw')}.`],
    ],
    soster: ss('turkey', 'How long to cook a whole turkey, with calculator'),
    andre: [kk('turkey', 'Turkey internal temperature'), ss('turkey-legs-and-wings', 'How long to cook turkey legs, thighs, and wings'), ss('chicken-breast', 'How long to cook chicken breast')],
  }),

  kalkunlar: (h, { tabell, p }) => ({
    ord: 'turkey legs',
    title: 'How long to cook turkey legs, thighs, and wings',
    h1: 'How long do turkey drumsticks, thighs, and wings take?',
    description: `Turkey drumsticks take ${h.t('ds')}, thighs take ${h.t('ts')}, and wings take ${h.t('vs')} at ${h.t('ovn')}, says ${h.k('fsis-turkey')}. All parts are done at ${h.t('min')}.`,
    lead: `FSIS gives times for turkey parts at ${h.t('ovn')}: drumsticks ${h.t('ds')}, thighs ${h.t('ts')}, and wings ${h.t('vs')}. Each part is done at ${h.t('min')}.`,
    blokker: [
      ['The FSIS times for turkey parts', tabell({
        tittel: 'Turkey parts roasting times',
        kolonner: ['Part', 'Weight, each', 'Time'],
        rader: [['Drumsticks', { html: h.t('dw') }, { html: h.t('ds') }], ['Thighs', { html: h.t('tw') }, { html: h.t('ts') }], ['Wings and wing drumettes', { html: h.t('vw') }, { html: h.t('vs') }]],
      }) + h.note('fsis-turkey')],
      ['Read the table with care', p([h.s('approx'), `The oven temperature in the table is ${h.t('ovn')}. The weights are per piece, not for the whole package.`])],
      ['The safe temperature', p([`${h.k('fs-chart')} lists ${h.t('min')} for legs, thighs, and wings of chicken, turkey, and other poultry. See <a href="${K}turkey/">turkey internal temperature</a>.`])],
      ['From frozen', p([`${h.k('fsis-alt')} says to take the timing for your size and add ${h.t('fryst')} when you roast from frozen.`, `On a rack: ${h.s('flat')}`])],
    ],
    faq: [
      ['How long do turkey drumsticks take in the oven?', `${h.t('ds')} for drumsticks of ${h.t('dw')} each, at ${h.t('ovn')}, says ${h.k('fsis-turkey')}.`],
      ['How long do turkey thighs take?', `${h.t('ts')} for thighs of ${h.t('tw')} each.`],
      ['How long do turkey wings take?', `${h.t('vs')} for wings of ${h.t('vw')} each.`],
    ],
    soster: ss('turkey', 'How long to cook a whole turkey, with calculator'),
    andre: [ss('turkey-breast', 'How long to cook a turkey breast'), ss('chicken-thighs-and-wings', 'How long to cook chicken thighs and wings'), kk('turkey', 'Turkey internal temperature')],
  }),

  kalkunmetoder: (h, { tabell, p }) => ({
    ord: 'fried, grilled, and smoked turkey',
    title: 'How long to deep fry, grill, or smoke a turkey',
    h1: 'How long does a turkey take to fry, grill, or smoke?',
    description: `FSIS gives about ${h.t('fkg')} for a fried turkey, ${h.t('grill')} on a covered grill, and ${h.t('smokes')} in a smoker. Rules about size, oil, and thawing, from ${h.k('fsis-alt')}.`,
    lead: `${h.k('fsis-alt')} gives rules of thumb: ${h.t('fkg')} when deep frying, ${h.t('grill')} on a covered grill, and ${h.t('smokes')} in a smoker. Check the temperature with a thermometer every time.`,
    blokker: [
      ['The times in one table', tabell({
        tittel: 'Turkey cooking methods',
        kolonner: ['Method', 'Time', 'Heat'],
        rader: [['Deep fat frying', { html: h.t('fkg') }, { html: h.t('fyr') }], ['Covered charcoal grill', { html: h.t('grill') }, { html: `${h.t('luft')} air temperature` }], ['Smoker', { html: h.t('smokes') }, { html: `${h.t('luft')} air temperature` }], ['Microwave, medium', { html: h.t('mikro') }, { tekst: 'Not applicable' }]],
      }) + h.note('fsis-alt')],
      ['Deep fat frying', p([
        `${h.k('fsis-alt')} says the turkey should be ${h.t('fmaks')} or less, not stuffed, and completely thawed. The oil should cover the turkey by ${h.t('olje')}. ${h.s('vann')}`,
        h.s('ute'), h.s('kald'),
        `After frying, let it rest about ${h.t('fhvile')} before carving.`,
      ])],
      ['Grilling', p([`${h.k('fsis-alt')} describes a covered grill that cooks by indirect heat. In a charcoal grill, it says to keep the air temperature at ${h.t('luft')} and to replenish with about ${h.t('briketter')} every hour. ${h.s('gass')}`, h.s('myke')])],
      ['Smoking', p([`In a smoker, ${h.k('fsis-alt')} says to estimate ${h.t('smokes')}, and to add charcoal every ${h.t('kull')} as needed to keep ${h.t('luft')}.`])],
      ['Roaster oven and microwave', p([`A tabletop roaster oven should be preheated to at least ${h.t('roaster')}, with the lid on throughout. ${h.k('fsis-turkey')} says a whole turkey in the microwave takes ${h.t('mikro')} on medium, and that ${h.t('mikromaks')} is the maximum size most microwaves can accommodate.`])],
      ['Never from frozen, and never stuffed', p([h.s('ikkefryst'), h.s('fylt')])],
      ['Is it done?', p([`${h.k('fsis-alt')} says the turkey is safely cooked when the thermometer reaches ${h.t('min')} in the innermost part of the thigh and wing and the thickest part of the breast.`])],
    ],
    faq: [
      ['How long does it take to deep fry a turkey?', `About ${h.t('fkg')} at ${h.t('fyr')}, says ${h.k('fsis-alt')}. The turkey should be ${h.t('fmaks')} or less.`],
      ['How long does a turkey take on a charcoal grill?', `FSIS says to estimate ${h.t('grill')} on a covered grill.`],
      ['How long does it take to smoke a turkey?', `FSIS says to estimate ${h.t('smokes')}.`],
      ['Can I fry a frozen turkey?', h.s('ikkefryst')],
    ],
    soster: ss('turkey', 'How long to roast a whole turkey, with calculator'),
    andre: [ss('thaw-turkey', 'How long to thaw a turkey'), kk('turkey', 'Turkey internal temperature'), THANKS],
  }),

  tining: (h, { tabell, p }) => ({
    ord: 'thawing a turkey',
    kalk: true,
    title: 'How long to thaw a turkey: fridge and cold water times',
    h1: 'How long does it take to thaw a turkey?',
    description: `In the refrigerator, allow about ${h.t('dognet')} for each ${h.t('perlb')} of turkey. In cold water, allow ${h.t('vann')} per pound. Times by weight from ${h.k('fsis-thaw')}.`,
    lead: `In the refrigerator, FSIS says to allow about ${h.t('dognet')} for each ${h.t('perlb')}. In cold water it is about ${h.t('vann')} per pound. Pick the method and type in the weight below.`,
    blokker: [
      ['Thawing time calculator', p([`The calculator looks your weight up in the ${h.k('fsis-thaw')} tables below. A weight on a line between two rows is in both.`]) + '@@KALK@@'],
      ['Refrigerator thawing', p([`${h.k('fsis-thaw')} says to allow approximately ${h.t('dognet')} for each ${h.t('perlb')} in a refrigerator set at ${h.t('kjole')} or below.`]) + tabell({
        tittel: 'Refrigerator thawing times',
        kolonner: ['Whole turkey weight', 'Time in the refrigerator'],
        rader: [1, 2, 3, 4].map((i) => [h.t(`k${i}w`), { html: h.t(`k${i}t`) }]),
      }) + h.note('fsis-thaw') + p([`A thawed turkey can remain in the refrigerator for ${h.t('etter')} before cooking. ${h.s('rett')}`])],
      ['Cold water thawing', p([`${h.k('fsis-thaw')} says to allow about ${h.t('vann')} per pound. ${h.s('pose')} The water changes every ${h.t('skift')}.`]) + tabell({
        tittel: 'Cold water thawing times',
        kolonner: ['Whole turkey weight', 'Time in cold water'],
        rader: [1, 2, 3, 4].map((i) => [h.t(`v${i}w`), { html: h.t(`v${i}t`) }]),
      }) + p([h.s('nyfrys')])],
      ['Microwave thawing', p([`${h.k('fsis-thaw')} says to follow the microwave maker's instructions. ${h.s('mikro')}`])],
      ['What not to do', p([h.s('disk'), `${h.k('fsis-thaw')} adds that a package of frozen meat or poultry left thawing on the counter more than ${h.t('farelo')} is not at a safe temperature.`])],
      ['Three safe ways, and the first step', p([h.s('tre'), h.s('bunn'), h.s('bank')])],
    ],
    faq: [
      ['How many days does it take to thaw a 14 pound turkey?', `A weight of ${h.t('k2w')} takes ${h.t('k2t')} in the refrigerator, says ${h.k('fsis-thaw')}.`],
      ['How long does cold water thawing take?', `About ${h.t('vann')} per pound, with the water changed every ${h.t('skift')}.`],
      ['How long can a thawed turkey wait in the fridge?', `${h.t('etter')} before cooking, according to ${h.k('fsis-thaw')}.`],
      ['Can I thaw a turkey on the counter?', h.s('disk')],
    ],
    soster: ss('turkey', 'How long to roast a turkey, with calculator'),
    andre: [ss('turkey-breast', 'How long to cook a turkey breast'), ff('turkey-leftovers', 'Can you freeze turkey leftovers?'), THANKS],
  }),

  skinke: (h, { tabell, p }) => ({
    ord: 'ham',
    title: 'How long to cook a ham: minutes per pound by type',
    h1: 'How long does it take to cook a ham?',
    description: `A bone-in smoked ham that needs cooking takes ${h.t('c1t')} at ${h.t('ovn')}. A fully cooked ham takes ${h.t('d1t')}. The FSIS timetable by cut and weight, with temperatures.`,
    lead: `It depends on the ham. A whole, bone-in smoked ham that needs cooking takes ${h.t('c1t')}, and a fully cooked whole ham takes ${h.t('d1t')}. ${h.k('fsis-hams')} gives these at ${h.t('ovn')}.`,
    blokker: [
      ['Ham that needs cooking', tabell({
        tittel: 'Smoked ham, cook-before-eating',
        kolonner: ['Cut', 'Weight', 'Time'],
        rader: [radTid(h, 'Whole, bone in', 'c1'), radTid(h, 'Half, bone in', 'c2'), radTid(h, 'Shank or butt portion, bone in', 'c3'), radTid(h, 'Arm picnic shoulder, boneless', 'c4'), radTid(h, 'Shoulder roll (butt), boneless', 'c5')],
      }) + h.note('fsis-hams') + p([`It must reach ${h.t('rå')}, with a rest of ${h.t('hvile')}. ${h.s('cbe')}`])],
      ['Fully cooked ham', tabell({
        tittel: 'Smoked ham, fully cooked',
        kolonner: ['Cut', 'Weight', 'Time'],
        rader: [radTid(h, 'Whole, bone in', 'd1'), radTid(h, 'Half, bone in', 'd2'), radTid(h, 'Arm picnic shoulder, boneless', 'd3'), radTid(h, 'Canned ham, boneless', 'd4'), radTid(h, 'Vacuum packed, boneless', 'd5'), radTid(h, 'Spiral cut, whole or half', 'd6')],
      }) + p([`${h.s('ferdig')} Reheat hams packaged in USDA-inspected plants to ${h.t('opp')}. Leftover ham, or ham repackaged outside the plant, is reheated to ${h.t('anna')}.`])],
      ['Fresh ham', tabell({
        tittel: 'Fresh ham, uncooked',
        kolonner: ['Cut', 'Weight', 'Time'],
        rader: [radTid(h, 'Whole leg, bone in', 'f1'), radTid(h, 'Whole leg, boneless', 'f2'), radTid(h, 'Half, bone in', 'f3')],
      }) + p([`${h.k('fsis-hams')} also says fresh ham needs ${h.t('rå')} with a rest of ${h.t('hvile')}.`])],
      ['Spiral-sliced ham', p([`To reheat a spiral-sliced ham in a conventional oven, ${h.k('fsis-hams')} says to cover the whole ham or portion with heavy aluminum foil and heat at ${h.t('ovn')} for about ${h.t('spiral')}.`])],
      ['Country ham', p([h.s('landsalt'), `For cooking, the timetable says to soak ${h.t('landbad')} in the refrigerator, cover with water, and boil ${h.t('land')}. Then drain, glaze, and brown at ${h.t('landbak')} for ${h.t('landbaktid')}.`])],
    ],
    faq: [
      ['How long does a 10 pound ham take?', `A fully cooked whole ham of ${h.t('d1w')} takes ${h.t('d1t')}. A cook-before-eating whole ham of ${h.t('c1w')} takes ${h.t('c1t')}. Source: ${h.k('fsis-hams')}.`],
      ['How long does a spiral ham take?', `A spiral-cut ham of ${h.t('d6w')} takes ${h.t('d6t')} in the FSIS table. A spiral-sliced ham reheated under foil takes about ${h.t('spiral')}.`],
      ['What temperature should a ham reach?', `A cook-before-eating ham needs ${h.t('rå')}. A fully cooked ham packaged in a USDA-inspected plant is heated to ${h.t('opp')}. See <a href="${K}ham/">ham internal temperature</a>.`],
    ],
    soster: kk('ham', 'Ham internal temperature'),
    andre: [rr('ham', 'How long does ham last in the fridge?'), ff('ham', 'Can you freeze ham?'), ss('pork-roast', 'How long to cook a pork roast'), THANKS],
  }),

  roastbiff: (h, { tabell, p }) => ({
    ord: 'roast beef',
    title: 'How long to cook roast beef: minutes per pound',
    h1: 'How long does it take to cook roast beef?',
    description: `A bone-in rib roast takes ${h.t('ribt')} at ${h.t('ovn')}. Round or rump roast takes ${h.t('rt')}. FSIS times for rib roast, round roast, and tenderloin.`,
    lead: `A bone-in rib roast of ${h.t('ribw')} takes ${h.t('ribt')} at ${h.t('ovn')}, says ${h.k('fsis-beef')}. A round or rump roast takes ${h.t('rt')}. Roast beef is safe at ${h.t('min')}.`,
    blokker: [
      ['Times from the beef page', tabell({
        tittel: 'Beef roast times, FSIS beef page',
        kolonner: ['Roast', 'Weight', 'Time'],
        rader: [['Rib roast, bone in, at 325°F', { html: h.t('ribw') }, { html: h.t('ribt') }], ['Rib roast, boneless, rolled', { html: h.t('ribw') }, { html: `add ${h.t('bl')} to the times above` }], ['Round or rump roast, at 325°F', { html: h.t('rw') }, { html: h.t('rt') }], ['Tenderloin, whole, at ' + h.t('tovn'), { html: h.t('tw') }, { html: `${h.t('tt')} total` }]],
      }) + h.note('fsis-beef') + p([h.s('kjoleskap'), h.s('varierer')])],
      ['A second FSIS chart', tabell({
        tittel: 'Beef roast times, FSIS holiday chart',
        kolonner: ['Roast', 'Weight', 'Time'],
        rader: [['Rib roast, bone in', { html: h.t('hribw') }, { html: h.t('hribt') }], ['Rib roast, boneless', { html: h.t('hblw') }, { html: h.t('hblt') }], ['Eye round roast', { html: h.t('hew') }, { html: h.t('het') }], ['Tenderloin roast, half, at ' + h.t('tovn'), { html: h.t('htw') }, { html: `${h.t('htt')} total` }]],
      }) + h.note('fsis-holiday') + p([`The two FSIS pages do not give the same time for every cut. The bone-in rib roast is ${h.t('ribt')} on one and ${h.t('hribt')} on the other. Both are at ${h.t('ovn')}. Use the thermometer to settle it.`])],
      ['Why boneless takes longer', p([h.s('bone')])],
      ['Roasting basics', p([h.s('rack'), h.s('mager')])],
      ['When is it done?', p([`${h.k('fsis-beef')} says to cook raw beef steaks and roasts to a minimum internal temperature of ${h.t('min')}, and to rest the meat at least ${h.t('hvile')} before carving. See <a href="${K}roast-beef/">roast beef internal temperature</a>.`])],
    ],
    faq: [
      ['How long to cook a 5 pound rib roast?', `A bone-in rib roast of ${h.t('ribw')} takes ${h.t('ribt')} per ${h.k('fsis-beef')}. A 5 pound roast falls inside that weight range.`],
      ['How long for a beef tenderloin?', `A whole tenderloin of ${h.t('tw')} takes ${h.t('tt')} total at ${h.t('tovn')}, according to ${h.k('fsis-beef')}.`],
      ['How long does a round roast take?', `${h.t('rt')} for a roast of ${h.t('rw')} at ${h.t('ovn')}.`],
    ],
    soster: kk('roast-beef', 'Roast beef internal temperature'),
    andre: [ss('brisket-and-pot-roast', 'How long to cook brisket and pot roast'), ss('pork-roast', 'How long to cook a pork roast'), kk('steak', 'Steak internal temperature'), THANKS],
  }),

  svinestek: (h, { tabell, p }) => ({
    ord: 'pork roast',
    title: 'How long to cook a pork roast: minutes per pound',
    h1: 'How long does it take to cook a pork roast?',
    description: `A pork loin roast takes ${h.t('lt')} at ${h.t('ovn')}, and a Boston butt takes ${h.t('bt')}. FSIS times for loin, crown roast, fresh ham, tenderloin, and ribs.`,
    lead: `${h.k('fsis-pork')} gives ${h.t('lt')} for a loin roast of ${h.t('lw')} at ${h.t('ovn')}. A Boston butt takes ${h.t('bt')}. Pork is done at ${h.t('min')} with a rest.`,
    blokker: [
      ['Roasting times at 350°F', tabell({
        tittel: 'Pork roasting times, FSIS pork page',
        kolonner: ['Cut', 'Weight', 'Time'],
        rader: [radTid(h, 'Loin roast, bone-in or boneless', 'l'), ['Crown roast', { html: h.t('kw') }, { html: h.t('kt') }], radTid(h, 'Boston butt', 'b'), ['Fresh ham, whole leg, bone-in', { html: h.t('fw') }, { html: h.t('ft') }], ['Fresh ham, half, bone-in', { html: h.t('hw') }, { html: h.t('ht') }]],
      }) + h.note('fsis-pork') + p([`These are at ${h.t('ovn')}, in a shallow pan, uncovered. ${h.s('kjoleskap')} ${h.s('varierer')}`])],
      ['Tenderloin and ribs', tabell({
        tittel: 'Pork tenderloin and ribs',
        kolonner: ['Cut', 'Weight', 'Time'],
        rader: [['Tenderloin, roasted at ' + h.t('tov'), { html: h.t('tw') }, { html: `${h.t('tt')} total` }], ['Ribs, back, country-style, or spareribs', { html: h.t('ribw') }, { html: `${h.t('ribt')} or until fork tender` }]],
      })],
      ['A second FSIS chart at 325°F', tabell({
        tittel: 'Pork roasting times, FSIS holiday chart',
        kolonner: ['Cut', 'Weight', 'Time'],
        rader: [['Loin roast, bone-in', { html: h.t('hbw') }, { html: h.t('hbt') }], ['Loin roast, boneless', { html: h.t('hlw') }, { html: h.t('hlt') }]],
      }) + h.note('fsis-holiday') + p([`This chart is for ${h.t('h325')}, so its times differ from the ones at ${h.t('ovn')}. ${h.s('mager')}`])],
      ['Is it done?', p([`${h.k('fsis-pork')} says to cook raw pork steaks, chops, and roasts to ${h.t('min')} and rest the meat at least ${h.t('hvile')}. ${h.s('rosa')} See <a href="${K}pork/">pork internal temperature</a>.`])],
      ['A note on the numbers', p([h.s('kompilert')])],
    ],
    faq: [
      ['How long to cook a 4 pound pork loin?', `At ${h.t('ovn')}, ${h.k('fsis-pork')} gives ${h.t('lt')} for a loin roast of ${h.t('lw')}. At ${h.t('h325')}, ${h.k('fsis-holiday')} gives ${h.t('hbt')} for a bone-in loin of ${h.t('hbw')}.`],
      ['How long does a pork tenderloin take?', `${h.t('tt')} total, roasted at ${h.t('tov')}, for a tenderloin of ${h.t('tw')}, per ${h.k('fsis-pork')}.`],
      ['How long does a pork butt take?', `${h.t('bt')} for a Boston butt of ${h.t('bw')}, at ${h.t('ovn')}.`],
    ],
    soster: kk('pork', 'Pork internal temperature'),
    andre: [ss('ham', 'How long to cook a ham'), ss('roast-beef', 'How long to cook roast beef'), THANKS],
  }),

  'hel-kylling': (h, { tabell, p }) => ({
    ord: 'whole chicken',
    title: 'How long to roast a whole chicken, by size',
    h1: 'How long does it take to roast a whole chicken?',
    description: `A whole broiler-fryer of ${h.t('bw')} takes ${h.t('bt')} at ${h.t('ovn')}. A roasting hen of ${h.t('hw')} takes ${h.t('ht')}. FSIS times by bird, with a thermometer rule.`,
    lead: `A whole broiler-fryer of ${h.t('bw')} takes ${h.t('bt')} at ${h.t('ovn')}, per ${h.k('fsis-chicken')}. A bigger roasting hen takes ${h.t('ht')}. The chicken is done at ${h.t('min')}.`,
    blokker: [
      ['The FSIS chart for whole birds', tabell({
        tittel: 'Whole chicken roasting times at 350°F',
        kolonner: ['Bird', 'Weight', 'Roasting time'],
        rader: [radTid(h, 'Whole broiler-fryer', 'b'), radTid(h, 'Whole roasting hen', 'h'), radTid(h, 'Whole capon', 'k'), radTid(h, 'Whole Cornish hens', 'c')],
      }) + h.note('fsis-chicken') + p([`Times are for unstuffed birds. If stuffed, add an additional ${h.t('fylt')}. ${h.s('merk')}`])],
      ['Other ways to cook it', p([
        `The same chart gives simmering and grilling. A whole broiler-fryer simmers in ${h.t('bkok')}. A roasting hen on the grill, by the indirect method with a drip pan, takes ${h.t('hgrill')}.`,
        `In the microwave, FSIS says whole chicken takes ${h.t('mikro')} on medium-high, in an oven cooking bag or a covered microwavable pot, never stuffed.`,
      ])],
      ['Stuffing and the oven', p([h.s('fyll'), `${h.k('fsis-chicken')} says to cook a stuffed raw chicken right away in an oven set no lower than ${h.t('ovnlav')}.`])],
      ['From frozen', p([`${h.k('fsis-chicken')} says chicken can be cooked from frozen in the oven or on the stove, and the cooking time may be ${h.t('fryst', { ca: true })} longer. Thawing in cold water takes about ${h.t('tin')} for a whole broiler-fryer.`])],
      ['Is it done?', p([`${h.k('fsis-chicken')} recommends cooking whole chicken to ${h.t('min')}. ${h.s('spots')} ${h.s('rosa')} See <a href="${K}chicken/">chicken internal temperature</a>.`])],
      ['Do not wash it first', p([h.s('vasking'), h.s('delvis')])],
    ],
    faq: [
      ['How long does a 4 pound chicken take to roast?', `${h.t('bt')} for a whole broiler-fryer of ${h.t('bw')}, at ${h.t('ovn')}, says ${h.k('fsis-chicken')}.`],
      ['How long does a 6 pound roasting chicken take?', `${h.t('ht')} for a roasting hen of ${h.t('hw')}.`],
      ['How long does a stuffed chicken take?', `Add ${h.t('fylt')} to the time for an unstuffed bird. Do not microwave a stuffed chicken.`],
    ],
    soster: kk('chicken', 'Chicken internal temperature'),
    andre: [ss('chicken-breast', 'How long to cook chicken breast'), ss('chicken-thighs-and-wings', 'How long to cook chicken thighs and wings'), rr('cooked-chicken', 'How long does cooked chicken last?'), ff('raw-chicken', 'Can you freeze raw chicken?')],
  }),

  kyllingfilet: (h, { tabell, p }) => ({
    ord: 'chicken breast',
    title: 'How long to bake chicken breast: bone-in and boneless',
    h1: 'How long does it take to bake chicken breast?',
    description: `Boneless chicken breast halves of ${h.t('ubenw')} take ${h.t('ubent')} at ${h.t('ovn')}. Bone-in halves of ${h.t('benw')} take ${h.t('bent')}. FSIS times for baking, simmering, grilling, and the microwave.`,
    lead: `Boneless chicken breast halves of ${h.t('ubenw')} bake in ${h.t('ubent')} at ${h.t('ovn')}, says ${h.k('fsis-chicken')}. Bone-in halves of ${h.t('benw')} take ${h.t('bent')}. Done means ${h.t('min')}.`,
    blokker: [
      ['The FSIS times for chicken breast', tabell({
        tittel: 'Chicken breast cooking times',
        kolonner: ['Breast half', 'Size', 'Roast at 350°F', 'Simmer', 'Grill, each side'],
        rader: [['Bone-in', { html: h.t('benw') }, { html: h.t('bent') }, { html: h.t('bensim') }, { html: h.t('bengrill') }], ['Boneless', { html: h.t('ubenw') }, { html: h.t('ubent') }, { html: h.t('ubensim') }, { html: h.t('ubengrill') }]],
      }) + h.note('fsis-chicken')],
      ['In the microwave', p([`${h.k('fsis-chicken')} gives ${h.t('mikro')} on medium-high for boneless breast halves. ${h.s('mikroflat')} Allow ${h.t('stand')} standing time for a boneless breast, and ${h.t('standben')} for bone-in chicken.`])],
      ['Frozen breasts', p([`A 1 pound package of boneless breasts thaws in an hour or less in cold water, says ${h.k('fsis-chicken')}. ${h.s('fryskok')} In the oven or on the stove, the cooking time may be ${h.t('fryst', { ca: true })} longer.`])],
      ['The safe number', p([`${h.k('fsis-chicken')} says breasts, drumsticks, thighs, and wings should be cooked until they reach ${h.t('min')}. ${h.s('tykk')}`, h.s('rosa'), h.s('vask')])],
    ],
    faq: [
      ['How long does chicken breast take in the oven?', `${h.t('ubent')} for boneless halves of ${h.t('ubenw')}, and ${h.t('bent')} for bone-in halves of ${h.t('benw')}, at ${h.t('ovn')}.`],
      ['How long do I grill chicken breast?', `FSIS says ${h.t('ubengrill')} for boneless and ${h.t('bengrill')} for bone-in breast halves.`],
      ['What temperature is chicken breast done?', `${h.t('min')}, measured with a food thermometer. See <a href="${K}chicken/">chicken internal temperature</a>.`],
    ],
    soster: kk('chicken', 'Chicken internal temperature'),
    andre: [ss('whole-chicken', 'How long to roast a whole chicken'), ss('chicken-thighs-and-wings', 'How long to cook chicken thighs and wings'), ss('turkey-breast', 'How long to cook a turkey breast'), ff('raw-chicken', 'Can you freeze raw chicken?')],
  }),

  kyllinglar: (h, { tabell, p }) => ({
    ord: 'chicken thighs and wings',
    title: 'How long to cook chicken thighs, drumsticks, and wings',
    h1: 'How long do chicken thighs, drumsticks, and wings take?',
    description: `Chicken legs or thighs take ${h.t('lt')} at ${h.t('ovn')}, drumsticks take ${h.t('dt')}, and wings take ${h.t('vt')}. The FSIS chart, with simmering and grilling times.`,
    lead: `${h.k('fsis-chicken')} gives roasting times at ${h.t('ovn')}: legs or thighs ${h.t('lt')}, drumsticks ${h.t('dt')}, and wings ${h.t('vt')}. Each is done at ${h.t('min')}.`,
    blokker: [
      ['The FSIS chart', tabell({
        tittel: 'Chicken legs, drumsticks, and wings',
        kolonner: ['Piece', 'Size', 'Roast at 350°F', 'Simmer', 'Grill, each side'],
        rader: [['Legs or thighs', { html: h.t('lw') }, { html: h.t('lt') }, { html: h.t('lt') }, { html: h.t('lgrill') }], ['Drumsticks', { html: h.t('dw') }, { html: h.t('dt') }, { html: h.t('dsim') }, { html: h.t('dgrill') }], ['Wings or wingettes', { html: h.t('vw') }, { html: h.t('vt') }, { html: h.t('vsim') }, { html: h.t('vgrill') }]],
      }) + h.note('fsis-chicken')],
      ['Dark bones and dark meat', p([h.s('bein'), h.s('mork')])],
      ['In the microwave', p([h.s('mikro')])],
      ['From frozen', p([`${h.k('fsis-chicken')} says the cooking time may be ${h.t('fryst', { ca: true })} longer from frozen, and that a package of parts should thaw in about ${h.t('tin')} in cold water.`])],
      ['The safe number', p([`${h.k('fsis-chicken')} says breasts, drumsticks, thighs, and wings should be cooked until they reach ${h.t('min')}. ${h.s('vask')}`])],
    ],
    faq: [
      ['How long do chicken thighs take in the oven?', `${h.t('lt')} for legs or thighs of ${h.t('lw')}, at ${h.t('ovn')}, per ${h.k('fsis-chicken')}.`],
      ['How long do chicken wings take?', `${h.t('vt')} for wings or wingettes of ${h.t('vw')}.`],
      ['How long do drumsticks take?', `${h.t('dt')} for drumsticks of ${h.t('dw')}.`],
    ],
    soster: kk('chicken', 'Chicken internal temperature'),
    andre: [ss('chicken-breast', 'How long to cook chicken breast'), ss('whole-chicken', 'How long to roast a whole chicken'), ss('turkey-legs-and-wings', 'How long to cook turkey legs, thighs, and wings')],
  }),

  lammelar: (h, { tabell, p }) => ({
    ord: 'leg of lamb',
    title: 'How long to cook a leg of lamb: minutes per pound',
    h1: 'How long does it take to cook a leg of lamb?',
    description: `A bone-in leg of lamb of ${h.t('aw')} takes ${h.t('at')} at ${h.t('ovn')}. Boneless takes ${h.t('ct')}. FSIS times for leg, shoulder, crown roast, and chops.`,
    lead: `${h.k('fsis-lamb')} gives ${h.t('at')} for a bone-in leg of lamb of ${h.t('aw')} at ${h.t('ovn')}. A boneless rolled leg takes ${h.t('ct')}. Lamb is done at ${h.t('min')}.`,
    blokker: [
      ['The FSIS roasting times', tabell({
        tittel: 'Lamb roasting times at 325°F',
        kolonner: ['Cut', 'Weight', 'Time'],
        rader: [radTid(h, 'Leg, bone-in', 'a'), radTid(h, 'Leg, bone-in, larger', 'b'), radTid(h, 'Leg, boneless, rolled', 'c'), radTid(h, 'Shoulder roast or shank leg half', 's'), ['Breast, rolled, braised', { html: h.t('rw') }, { html: h.t('rt') }]],
      }) + h.note('fsis-lamb') + p([h.s('kjol'), h.s('vary')])],
      ['Crown roast and chops', p([`${h.k('fsis-holiday')} gives ${h.t('kt')} for a crown roast of ${h.t('kw')} at ${h.t('kov')}. For rib or loin chops, ${h.k('fsis-lamb')} gives ${h.t('kote')} under the broiler or on the grill.`])],
      ['Is it done?', p([`${h.k('fsis-lamb')} says to cook raw lamb steaks, chops, and roasts to ${h.t('min')} and rest them at least ${h.t('hvile')}. See <a href="${K}lamb/">lamb internal temperature</a>.`])],
      ['Cuts and yield', p([h.s('fell'), `After cooking a bone-in leg or roast, one pound of raw weight yields ${h.t('utbytte')} of edible meat, per ${h.k('fsis-lamb')}.`])],
      ['Do not stop halfway', p([h.s('delvis')])],
    ],
    faq: [
      ['How long to cook a 6 pound leg of lamb?', `${h.t('at')} for a bone-in leg of ${h.t('aw')}, at ${h.t('ovn')}, says ${h.k('fsis-lamb')}.`],
      ['How long does a boneless leg of lamb take?', `${h.t('ct')} for a boneless, rolled leg of ${h.t('cw')}.`],
      ['What temperature is lamb done?', `${h.t('min')} with a rest of ${h.t('hvile')}.`],
    ],
    soster: kk('lamb', 'Lamb internal temperature'),
    andre: [ss('roast-beef', 'How long to cook roast beef'), ss('pork-roast', 'How long to cook a pork roast'), THANKS],
  }),

  egg: (h, { tabell, p }) => ({
    ord: 'hard-boiled eggs',
    title: 'How long to boil eggs: hard-boiled egg times by size',
    h1: 'How long does it take to hard-boil an egg?',
    description: `Bring the water to a boil, take the pan off the heat, and leave the eggs in the hot water: ${h.t('m')} for medium, ${h.t('l')} for large, ${h.t('xl')} for extra large, says ${h.k('osu-egg')}.`,
    lead: `Oregon State Extension gives hard-cooked egg times by size: ${h.t('m')} for medium eggs, ${h.t('l')} for large, and ${h.t('xl')} for extra large. The eggs sit in hot water off the heat.`,
    blokker: [
      ['The method', p([
        `${h.k('osu-egg')} says to put the eggs in a single layer in a saucepan and add cold water to cover them by at least ${h.t('vann')}.`,
        h.s('kok'), h.s('av'), h.s('ligg'),
      ])],
      ['Time by egg size', tabell({
        tittel: 'Hard-cooked egg times',
        kolonner: ['Egg size', 'Time in the hot water'],
        rader: [['Medium', 'm'], ['Large', 'l'], ['Extra large', 'xl']],
      }) + h.note('osu-egg')],
      ['After the time is up', p([h.s('kjol'), `${h.k('osu-egg')} says to refrigerate within ${h.t('kjole')} of cooking, and to use peeled eggs within ${h.t('skrelt')} or refrigerate them in the shell for up to ${h.t('uker')}.`])],
      ['Peeling', p([`${h.k('osu-egg')} gives two tips. ${h.s('skall')} Also, refrigerate the eggs for ${h.t('gamle')} before cooking, which gives the two membranes inside the shell time to separate slightly.`])],
      ['A green ring', p([h.s('ring')])],
      ['At high altitude', p([h.s('hoyde')])],
    ],
    faq: [
      ['How long do you boil a large egg?', `${h.t('l')} in the hot water, after the water has come to a full boil and the pan is off the heat, says ${h.k('osu-egg')}.`],
      ['How long do you boil medium and extra large eggs?', `${h.t('m')} for medium and ${h.t('xl')} for extra large.`],
      ['How long do hard-boiled eggs last in the fridge?', `See <a href="${FRIDGE}hard-boiled-eggs/">how long hard-boiled eggs last</a>.`],
    ],
    soster: rr('hard-boiled-eggs', 'How long do hard-boiled eggs last in the fridge?'),
    andre: [ff('hard-boiled-eggs', 'Can you freeze hard-boiled eggs?'), kk('eggs', 'Egg dish internal temperature'), rr('eggs', 'How long do eggs last in the fridge?')],
  }),

  'corned-beef': (h, { tabell, p }) => ({
    ord: 'corned beef',
    title: 'How long to cook corned beef: oven, stove, slow cooker',
    h1: 'How long does it take to cook corned beef?',
    description: `FSIS gives ${h.t('perlb')} per pound for corned beef in the oven or on the stove, and ${h.t('sakte')} in a slow cooker on low. Oven bag, microwave, and a pink-color note.`,
    lead: `In the oven or on the stove, allow about ${h.t('perlb')} per pound. In a slow cooker, ${h.k('fsis-corned')} says ${h.t('sakte')} on low or ${h.t('sakteh')} on high. Raw corned beef is done at ${h.t('min')}.`,
    blokker: [
      ['The methods in one table', tabell({
        tittel: 'Corned beef cooking methods',
        kolonner: ['Method', 'Time'],
        rader: [['Oven', { html: `about ${h.t('perlb')} per pound at ${h.t('ovn')}` }], ['Stove, simmering', { html: `about ${h.t('perlb')} per pound` }], ['Oven cooking bag, brisket of ' + h.t('pose1w'), { html: h.t('pose1') }], ['Oven cooking bag, brisket of ' + h.t('pose2w'), { html: h.t('pose2') }], ['Slow cooker, low', 'sakte'], ['Slow cooker, high', 'sakteh'], ['Microwave, medium-low then high', 'mikro']],
      }) + h.note('fsis-corned')],
      ['Oven and stove', p([`${h.k('fsis-corned')} says to set the oven at ${h.t('ovn')} or no lower than ${h.t('ovnlav')}, with the brisket fat-side up, barely covered with water, and the container covered the whole time. On the stove, bring the water to a boil, reduce the heat, and simmer. Vegetables go in for the last ${h.t('gront')}.`])],
      ['Oven bag and slow cooker', p([`For the bag, the oven is preheated to ${h.t('posen')}. A brisket of ${h.t('pose1w')} takes ${h.t('pose1')}, and one of ${h.t('pose2w')} takes ${h.t('pose2')}. In the slow cooker, cook on high for the first hour, then ${h.t('sakte')} on the low setting or ${h.t('sakteh')} on high.`])],
      ['Why it takes long', p([h.s('langsom'), h.s('ingen'), h.s('fryst')])],
      ['Pink after cooking', p([h.s('rosa'), h.s('nitritt'), h.s('gaffel')])],
      ['Rest, slice, and leftovers', p([`${h.k('fsis-corned')} says to let the brisket stand about ${h.t('hvile')} after removing it from the heat. ${h.s('skjaer')} Reheat leftovers to ${h.t('rester')}.`])],
      ['The safe number', p([`${h.k('fsis-corned')} says to cook raw corned beef to a minimum internal temperature of ${h.t('min')}, and to rest it at least ${h.t('hvile3')}.`])],
    ],
    faq: [
      ['How long to boil corned beef per pound?', `About ${h.t('perlb')} per pound, simmering, says ${h.k('fsis-corned')}.`],
      ['How long does corned beef take in a slow cooker?', `${h.t('sakte')} on low or ${h.t('sakteh')} on high, after the first hour on high.`],
      ['Is pink corned beef done?', h.s('rosa')],
    ],
    soster: ss('brisket-and-pot-roast', 'How long to cook brisket and pot roast'),
    andre: [kk('roast-beef', 'Roast beef internal temperature'), rr('leftovers', 'How long do leftovers last?'), ss('roast-beef', 'How long to cook roast beef')],
  }),

  brisket: (h, { tabell, p }) => ({
    ord: 'brisket',
    title: 'How long to cook brisket, chuck roast, and short ribs',
    h1: 'How long does it take to braise a brisket or chuck roast?',
    description: `FSIS gives ${h.t('bt')} for a chuck roast or brisket of ${h.t('bw')}, braised at ${h.t('bov')}, and ${h.t('gryte')} for beef stew meat. Short ribs, and the safe temperature.`,
    lead: `${h.k('fsis-beef')} gives ${h.t('bt')} for a chuck roast or brisket of ${h.t('bw')}, braised at ${h.t('bov')}. Beef stew meat simmers ${h.t('gryte')}. The roast is safe at ${h.t('min')}.`,
    blokker: [
      ['The FSIS times for braised beef', tabell({
        tittel: 'Braised and simmered beef',
        kolonner: ['Cut', 'Size', 'Method', 'Time'],
        rader: [['Chuck roast or brisket', { html: h.t('bw') }, { html: `Braise at ${h.t('bov')}` }, { html: h.t('bt') }], ['Short ribs', { tekst: 'Cut 4 inches long and 2 inches thick' }, { html: `Braise at ${h.t('bov')}` }, { html: h.t('st') }], ['Stew or cross-cuts', { tekst: '1 to 1 1/2 inches thick' }, { tekst: 'Cover with liquid and simmer' }, { html: h.t('gryte') }]],
      }) + h.note('fsis-beef')],
      ['What braising means', p([`${h.k('fsis-lamb')} defines the word on its lamb page. ${h.s('braise')}`])],
      ['About the times', p([h.s('kjol'), h.s('varierer'), h.s('bruk')])],
      ['Brisket that is corned', p([h.s('corned'), `A corned brisket has its own times: see <a href="${S}corned-beef/">how long to cook corned beef</a>.`])],
      ['The safe number', p([`${h.k('fsis-beef')} says to cook raw beef steaks and roasts to ${h.t('min')} and to rest the meat at least ${h.t('hvile')}. Raw corned beef is held to ${h.t('corned')}.`])],
    ],
    faq: [
      ['How long to cook a 3 pound brisket?', `FSIS gives ${h.t('bt')} for a chuck roast or brisket of ${h.t('bw')}, braised at ${h.t('bov')}.`],
      ['How long do beef short ribs take?', `${h.t('st')} braised at ${h.t('bov')}.`],
      ['How long does beef stew meat take?', `${h.t('gryte')} simmered in liquid.`],
    ],
    soster: ss('corned-beef', 'How long to cook corned beef'),
    andre: [ss('roast-beef', 'How long to cook roast beef'), kk('roast-beef', 'Roast beef internal temperature'), kk('thermometer', 'How to use a food thermometer')],
  }),
};

// What each page adds to the overview table: [label, time field, weight or size field].
const OVERSIKT = {
  kalkun: [['Whole turkey, unstuffed', 'u3t', 'u3w']],
  kalkunbryst: [['Turkey breast, whole', 'a1t', 'a1w']],
  kalkunlar: [['Turkey drumsticks', 'ds', 'dw']],
  skinke: [['Ham, fully cooked, whole', 'd1t', 'd1w']],
  roastbiff: [['Rib roast, bone in', 'ribt', 'ribw']],
  svinestek: [['Pork loin roast', 'lt', 'lw']],
  'hel-kylling': [['Whole chicken', 'bt', 'bw']],
  kyllingfilet: [['Chicken breast, boneless', 'ubent', 'ubenw']],
  kyllinglar: [['Chicken thighs', 'lt', 'lw']],
  lammelar: [['Leg of lamb, bone in', 'at', 'aw']],
  egg: [['Hard-boiled egg, large', 'l', null]],
  brisket: [['Brisket or chuck roast', 'bt', 'bw']],
};

export function nav({ data, rader, sti, h, p, esc }) {
  const tur = rader.find((r) => r.id === 'kalkun');
  const t = h(tur);
  const radene = rader.flatMap((r) => {
    const x = h(r);
    return (OVERSIKT[r.id] ?? []).map(([etikett, tid, vekt]) => `<tr><td><a href="${sti(r)}">${esc(etikett)}</a></td><td>${vekt ? x.t(vekt) : 'Any size'}</td><td>${x.t(tid)}</td><td>${x.k(r.tall[`${tid}-min`]?.kilde ?? r.tall[tid].kilde)}</td></tr>`);
  }).join('');
  return {
    title: 'How long to cook it: times for turkey, ham, chicken, and more',
    h1: 'How long to cook turkey, ham, roasts, chicken, and eggs',
    description: 'How long to cook a turkey, ham, roast beef, pork roast, chicken, lamb, and hard-boiled eggs. Times from USDA FSIS and Oregon State Extension, with the source on every number. Thanksgiving calculators included.',
    lead: `The turkey times here come as a calculator: type the weight and see the FSIS range. A turkey, unstuffed, takes ${t.t('u3t')} at ${t.t('ovn')} if it weighs ${t.t('u3w')}. Every time is approximate. A thermometer decides when the food is done.`,
    rik: [
      `<h2>Thanksgiving turkey</h2>${p([
        `These pages cover the turkey. <a href="${sti(rader.find((r) => r.id === 'kalkun'))}">How long to roast a turkey</a> has the weight calculator, <a href="${sti(rader.find((r) => r.id === 'tining'))}">how long to thaw a turkey</a> has the fridge and cold water times, and there are pages for <a href="${sti(rader.find((r) => r.id === 'kalkunbryst'))}">turkey breast</a> and for <a href="${sti(rader.find((r) => r.id === 'kalkunmetoder'))}">frying, grilling, and smoking</a>.`,
        `${t.k('fsis-turkey')} says the times are approximate and should always be used with a properly placed food thermometer.`,
      ])}`,
      `<h2>Cooking times at a glance</h2><p>Pick a food for the full table, the rules behind it, and the sources. The source is in the last column.</p><div class="table-wrap" tabindex="0" role="region" aria-label="Cooking times"><table class="sprik"><thead><tr><th scope="col">Food</th><th scope="col">Size</th><th scope="col">Time</th><th scope="col">Source</th></tr></thead><tbody>${radene}</tbody></table></div>`,
      '<h2>Foods that are not here</h2><p>We list a time only when we found it on a federal or university extension page. Baked potatoes and rice have no page for that reason: we did not find a time for them on a source we could read.</p>',
      '<div class="related"><h2>Related pages</h2><ul><li><a href="/en/internal-temperature/">Safe internal temperatures for meat, poultry, and fish</a></li><li><a href="/en/how-long-does-it-last/">How long does food last in the fridge?</a></li><li><a href="/en/holidays/thanksgiving/">Thanksgiving plan</a></li></ul></div>',
    ].join('\n'),
    faqTittel: 'Questions about cooking times',
    faq: [
      ['Why are cooking times only approximate?', `${t.k('fsis-turkey')} says the times are approximate and should always be used with a properly placed food thermometer.`],
      ['How long does a turkey take to roast?', `${t.t('u3t')} for a whole, unstuffed turkey of ${t.t('u3w')} at ${t.t('ovn')}, per ${t.k('fsis-turkey')}.`],
    ],
  };
}

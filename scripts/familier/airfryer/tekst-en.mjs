// Text for the family «airfryer» (en-US). Every sentence restates what a named source says, with the source and year named. No advice of our own on food safety.
// Numbers are never written here: h.t(field) reads them from data.en.json, where each one carries a quote from the source.
// Statements without a number are quoted in the row's `tekst` (key «sourceid: topic»); h.u(key) records the source and fails if the quote is missing.
// scripts/familier/airfryer/kildekontroll.mjs en checks that every quote still stands on the source page.
// Sizes are written in words («one-inch», «two pounds»), because every digit on a page must come from the data file.
// Avoid the words cook, heat, oven, step, bake, roast, timer, day, week, plan, menu, list, store, shop, find, keep, recipes, how to, save, post, leftover and portion in h2 headings
// that are not the two app headings: scripts/app-bevis.mjs matches them to app cards.

export const celsius = (f) => Math.round(((f - 32) * 5) / 9);
const L = (slug, text) => [`/en/air-fryer/${slug}/`, text];
const SVAR_ADVARSEL = 'Treat the times as a place to start.';
const KJERNE_H = 'Core temperature: the thermometer decides, not the clock';
const TERMOMETER = (h) => `${h.u('cosori:termometer')}${h.u('cosori:indre')}${h.u('fsis-chart:termometer')}`;
const STARTPUNKT = (h) => `${h.u('cosori:varierer')}${h.u('msu:justere')}`;
const ROW = (h, kilde, etikett, felt) => [h.k(kilde), etikett, h.t(`${felt}-temp`), h.t(`${felt}-tid`)];
const KOLONNER = ['Source', 'Cut', 'Temperature', 'Time'];
const KOLONNER_MAT = ['Source', 'Food', 'Temperature', 'Time'];

/** Avsnittet om kjernetemperatur for kjøtt og fisk: tallet står i radens `kjerne`, og siden sier at temperaturen avgjør. */
const TEMP_LENKE = { chicken: 'chicken', salmon: 'fish and seafood', 'ground-beef': 'ground beef', pork: 'pork', steak: 'steak', '': 'all foods' };
const KJERNE = (h, innhold, temp = '') => [KJERNE_H, h.p(innhold, `${TERMOMETER(h)}The times above only tell you when to start checking. The temperature decides, not the clock.`, `See our <a href="/en/internal-temperature/${temp ? `${temp}/` : ''}">internal temperature chart for ${TEMP_LENKE[temp]}</a>.`)];

export const TEKST = {
  // ---------------------------------------------------------------- chicken
  kyllingfilet: (h) => ({
    ord: 'chicken breast',
    title: 'Air fryer chicken breast: time and temperature',
    h1: 'Air fryer chicken breast: time and temperature',
    description: `${h.k('cosori')} lists boneless chicken breast at ${h.t('c-temp')} for ${h.t('c-tid')}. Three sources side by side, and the USDA safe temperature of ${h.t('kjerne')}.`,
    lead: 'The sources do not agree on chicken breast. Cosori, Mississippi State Extension, and Philips give three different temperatures. Here they are side by side, with the year of each.',
    svar: `${h.k('cosori')} lists boneless breasts at ${h.t('c-temp')} for ${h.t('c-tid')}. ${h.k('msu')} gives ${h.t('m-temp')} for ${h.t('m-tid')}, and ${h.k('philips-book')} gives ${h.t('pb-temp')} for ${h.t('pb-tid')}. ${SVAR_ADVARSEL} ${h.k('fsis-chart')} sets the safe minimum for poultry at ${h.t('kjerne')}, measured with a thermometer.${STARTPUNKT(h)}`,
    tabell: {
      tittel: 'Chicken breast times from three sources', intro: 'Each row is one source. We do not average them.', kolonner: KOLONNER,
      rader: [
        ROW(h, 'cosori', 'Boneless, eight to ten ounces', 'c'),
        ROW(h, 'cosori', 'Thin-cut, five ounces', 'c-tynn'),
        ROW(h, 'cosori', 'Bone-in, ten ounces', 'c-ben'),
        ROW(h, 'msu', 'Size not given', 'm'),
        ROW(h, 'philips-book', 'Size not given', 'pb'),
      ],
      etter: [`${h.k('philips-book')} is the Philips US Airfryer recipe book, so it is the oldest source here.`],
    },
    avsnitt: [
      ['Why the numbers differ', h.p(
        `${h.k('cosori')} ties its times to the size of the breast and marks each row for flipping. A thin-cut breast is listed at ${h.t('c-tynn-tid')}, and a bone-in breast at ${h.t('c-ben-tid')}.`,
        `${h.k('msu')} and ${h.k('philips-book')} do not say how heavy the breast is, so their times are harder to compare. ${h.k('msu')} also says you may need to adjust times and temperatures for the size of the food and for your air fryer.`,
      )],
      ['Thin cuts finish sooner than a chart says', h.p(
        `${h.k('cosori')} says chicken cutlets and fish fillets under three quarters of an inch finish faster than expected, so check them sooner.${h.u('cosori:tykk')} It also says a timer is a cue to check, not a guarantee.${h.u('cosori:tid-cue')}`,
      )],
    ],
    kjerne: KJERNE(h, `${h.k('fsis-chart')} lists ${h.t('kjerne')} as the minimum internal temperature for all poultry, including breasts, measured with a food thermometer.`, 'chicken'),
    app: 'Save the chicken breast recipe you like in Matlyst, and put it on the day you want to make it.',
    faq: [
      ['Do I flip chicken breast in the air fryer?', `${h.k('cosori')} marks all three chicken breast rows for flipping. ${h.k('philips-book')} does not say.`],
      ['What temperature is chicken breast done at?', `${h.k('fsis-chart')} says ${h.t('kjerne')} for all poultry. Cosori says the internal temperature is what confirms the food is done, not the time.`],
      ['How long does frozen chicken breast take in the air fryer?', 'We did not find a source with air fryer times for raw frozen chicken breast, so we give none.'],
    ],
    les: [L('chicken-thighs', 'Chicken thighs and drumsticks in the air fryer'), L('chicken-wings', 'Chicken wings in the air fryer'), L('frozen-foods', 'Frozen foods in the air fryer')],
  }),

  kyllinglar: (h) => ({
    ord: 'chicken thighs',
    title: 'Air fryer chicken thighs: time and temperature',
    h1: 'Air fryer chicken thighs: time and temperature',
    description: `${h.k('cosori')} lists bone-in chicken thighs at ${h.t('c-ben-temp')} for ${h.t('c-ben-tid')}. Thighs and drumsticks from three sources, and the USDA ${h.t('kjerne')}.`,
    lead: 'Bone-in thighs, boneless thighs, and drumsticks all get different times. Here are the three sources side by side, with the year of each.',
    svar: `${h.k('cosori')} lists bone-in thighs at ${h.t('c-ben-temp')} for ${h.t('c-ben-tid')}, and boneless thighs for ${h.t('c-uten-tid')}. ${h.k('msu')} gives ${h.t('m-lar-temp')} for ${h.t('m-lar-tid')}. ${SVAR_ADVARSEL} ${h.k('fsis-chart')} sets the safe minimum for poultry legs and thighs at ${h.t('kjerne')}.${STARTPUNKT(h)}`,
    tabell: {
      tittel: 'Chicken thigh and drumstick times', intro: 'Each row is one source and one cut.', kolonner: KOLONNER,
      rader: [
        ROW(h, 'cosori', 'Thighs, bone-in', 'c-ben'),
        ROW(h, 'cosori', 'Thighs, boneless', 'c-uten'),
        ROW(h, 'cosori', 'Drumsticks, six pieces', 'c-kl'),
        ROW(h, 'msu', 'Thighs', 'm-lar'),
        ROW(h, 'msu', 'Drumsticks', 'm-kl'),
        ROW(h, 'philips-book', 'Drumsticks', 'pb-kl'),
      ],
    },
    avsnitt: [
      ['Bone-in takes longer than boneless', h.p(
        `${h.k('cosori')} lists boneless thighs at ${h.t('c-uten-tid')} and bone-in thighs at ${h.t('c-ben-tid')}, both at ${h.t('c-ben-temp')}. It also says bone-in cuts take longer than boneless cuts of the same weight, and to allow ${h.t('c-ben-mer')} more time.${h.u('cosori:ben')}`,
        `The other two sources do not separate bone-in from boneless.`,
      )],
      ['Drumsticks are not thighs', h.p(
        `${h.k('cosori')} lists drumsticks at ${h.t('c-kl-temp')} for ${h.t('c-kl-tid')}. ${h.k('msu')} lists them at ${h.t('m-kl-temp')} for ${h.t('m-kl-tid')}, and ${h.k('philips-book')} at ${h.t('pb-kl-temp')} for ${h.t('pb-kl-tid')}. The times are close, and the temperatures are not.`,
      )],
    ],
    kjerne: KJERNE(h, `${h.k('fsis-chart')} lists ${h.t('kjerne')} for all poultry, and names breasts, whole birds, legs, thighs, wings, ground poultry, giblets, and stuffing. It says to measure with a food thermometer.`, 'chicken'),
    app: 'Save your favorite chicken thigh recipe in Matlyst, and put it on the day you want to make it.',
    faq: [
      ['Are boneless chicken thighs faster in the air fryer?', `Yes in ${h.k('cosori')}: ${h.t('c-uten-tid')} for boneless, against ${h.t('c-ben-tid')} for bone-in.`],
      ['Do I flip chicken thighs?', `${h.k('cosori')} marks thighs and drumsticks for flipping.`],
      ['What temperature are chicken thighs done at?', `${h.k('fsis-chart')} says ${h.t('kjerne')} for thighs and legs.`],
    ],
    les: [L('chicken-breast', 'Chicken breast in the air fryer'), L('chicken-wings', 'Chicken wings in the air fryer')],
  }),

  kyllingvinger: (h) => ({
    ord: 'chicken wings',
    title: 'Air fryer chicken wings: time and temperature',
    h1: 'Air fryer chicken wings: time and temperature',
    description: `Chicken wings in the air fryer from five sources: ${h.t('c-temp')} for ${h.t('c-tid')} at Cosori, ${h.t('i-temp')} for ${h.t('i-tid')} at Instant Pot.`,
    lead: 'Five sources give five different answers for chicken wings, in both temperature and time. Here they are side by side.',
    svar: `${h.k('cosori')} lists wings at ${h.t('c-temp')} for ${h.t('c-tid')}. ${h.k('kitchenaid')} says ${h.t('k-temp')} for ${h.t('k-tid')}, and ${h.k('instant')} says ${h.t('i-temp')} for ${h.t('i-tid')}. ${SVAR_ADVARSEL} ${h.k('fsis-chart')} sets the safe minimum for poultry at ${h.t('kjerne')}.${STARTPUNKT(h)}`,
    tabell: {
      tittel: 'Chicken wing times from five sources', intro: 'Each row is one source. The sources do not agree, and we do not pick for you.', kolonner: ['Source', 'Batch', 'Temperature', 'Time'],
      rader: [
        ROW(h, 'cosori', 'Two pounds', 'c'),
        ROW(h, 'msu', 'Two pounds', 'm'),
        ROW(h, 'kitchenaid', 'Not given', 'k'),
        ROW(h, 'instant', 'Fresh wings, Air Fry', 'i'),
        ROW(h, 'philips-book', 'Not given', 'pb'),
      ],
    },
    avsnitt: [
      ['Why five sources give five answers', h.p(
        `The temperature goes from ${h.t('i-temp')} at ${h.k('instant')} and ${h.t('pb-temp')} at ${h.k('philips-book')} up to ${h.t('k-temp')} at ${h.k('kitchenaid')}. ${h.k('cosori')} and ${h.k('msu')} both list a two-pound batch at ${h.t('c-temp')}, but their times are ${h.t('c-tid')} and ${h.t('m-tid')}.`,
        `That gap is a reminder that wattage, basket size, and how many wings you load change the result. ${h.k('cosori')} says a full basket reduces airflow and makes the time longer.${h.u('cosori:lag')}`,
      )],
      ['Shake the basket and watch the fat', h.p(
        `${h.k('cosori')} marks wings for shaking. ${h.k('philips-book')} says to shake small items such as fries and wings once or twice during the time, and to empty the fat from the bottom now and then when you cook high-fat foods such as wings, to avoid excess smoke.${h.u('philips-book:ryst')}${h.u('philips-book:fett')}`,
      )],
    ],
    kjerne: KJERNE(h, `${h.k('fsis-chart')} lists ${h.t('kjerne')} as the minimum internal temperature for all poultry, wings included.`, 'chicken'),
    app: 'Save your wing recipe in Matlyst, and put it on game day.',
    faq: [
      ['What temperature should I air fry chicken wings at?', `It depends on the source: ${h.t('i-temp')} at ${h.k('instant')}, ${h.t('c-temp')} at ${h.k('cosori')}, and ${h.t('k-temp')} at ${h.k('kitchenaid')}.`],
      ['How long do chicken wings take?', `${h.k('msu')} says ${h.t('m-tid')} for two pounds, and ${h.k('instant')} says ${h.t('i-tid')}. The thermometer decides: ${h.t('kjerne')} for poultry, says ${h.k('fsis-chart')}.`],
      ['Do I need to preheat?', `${h.k('cosori')} says a preheat of ${h.t('c-forvarm')} is enough for most foods.`],
    ],
    les: [L('chicken-breast', 'Chicken breast in the air fryer'), L('chicken-thighs', 'Chicken thighs in the air fryer'), L('french-fries', 'French fries in the air fryer')],
  }),

  // ---------------------------------------------------------------- fish and seafood
  laks: (h) => ({
    ord: 'salmon',
    title: 'Air fryer salmon: time and temperature',
    h1: 'Air fryer salmon: time and temperature',
    description: `${h.k('cosori')} lists a one-inch salmon fillet at ${h.t('c-temp')} for ${h.t('c-tid')}. Three sources side by side, and the USDA safe temperature of ${h.t('kjerne')}.`,
    lead: 'Salmon times depend on how thick the fillet is. Three sources give three settings, and one of them uses the broil function. Here they are side by side.',
    svar: `${h.k('cosori')} lists a one-inch fillet at ${h.t('c-temp')} for ${h.t('c-tid')}, and a thin fillet for ${h.t('c-tynn-tid')}. ${h.k('msu')} gives ${h.t('m-temp')} for ${h.t('m-tid')} for a six-ounce fillet. ${SVAR_ADVARSEL} ${h.k('fsis-chart')} sets the safe minimum for fish at ${h.t('kjerne')}.${STARTPUNKT(h)}`,
    tabell: {
      tittel: 'Salmon fillet times from three sources', intro: 'Each row is one source and one thickness.', kolonner: ['Source', 'Fillet', 'Temperature', 'Time'],
      rader: [
        ROW(h, 'cosori', 'One inch thick', 'c'),
        ROW(h, 'cosori', 'Thin, half to three quarters of an inch', 'c-tynn'),
        ROW(h, 'msu', 'Six ounces', 'm'),
        ROW(h, 'instant', 'Fillet, Broil function', 'i'),
      ],
    },
    avsnitt: [
      ['Thickness sets the time', h.p(
        `${h.k('cosori')} lists ${h.t('c-tid')} for a one-inch fillet and ${h.t('c-tynn-tid')} for a thin one, both at ${h.t('c-temp')}. It says thin fish fillets finish faster than expected, so check them sooner.${h.u('cosori:tynn')}`,
      )],
      ['One source uses the broil function', h.p(
        `${h.k('instant')} lists salmon under its Broil function, not Air Fry, at ${h.t('i-temp')} for ${h.t('i-tid')}. Its rows for wings, fries, and shrimp use Air Fry, so check which function your own model calls for.`,
      )],
    ],
    kjerne: KJERNE(h, `${h.k('fsis-chart')} lists ${h.t('kjerne')} as the minimum internal temperature for fish and shellfish, measured with a food thermometer.`, 'salmon'),
    app: 'Save your salmon recipe in Matlyst, and put it on the day you want to make it.',
    faq: [
      ['Should I flip salmon in the air fryer?', `${h.k('cosori')} lists no flip or shake for salmon fillets. ${h.k('msu')} and ${h.k('instant')} do not say.`],
      ['What temperature is salmon done at?', `${h.k('fsis-chart')} says ${h.t('kjerne')} for fish and shellfish.`],
      ['Does the air fryer need a preheat for salmon?', 'The sources on this page do not give a preheat for salmon in particular. See the general preheat times on the main air fryer page.'],
    ],
    les: [L('shrimp', 'Shrimp in the air fryer'), L('frozen-foods', 'Frozen foods in the air fryer')],
  }),

  shrimp: (h) => ({
    ord: 'shrimp',
    title: 'Air fryer shrimp: time and temperature',
    h1: 'Air fryer shrimp: time and temperature',
    description: `${h.k('cosori')} lists large shrimp at ${h.t('c-temp')} for ${h.t('c-tid')}. Fresh and breaded shrimp from three sources, and the safe temperature of ${h.t('kjerne')}.`,
    lead: 'Shrimp is done in a few minutes, and the sources differ on the temperature. Fresh and breaded shrimp are listed apart here.',
    svar: `${h.k('cosori')} lists large shrimp at ${h.t('c-temp')} for ${h.t('c-tid')}. ${h.k('msu')} lists ${h.t('m-temp')} for ${h.t('m-tid')}, and ${h.k('instant')} lists ${h.t('i-temp')} for ${h.t('i-tid')}. ${SVAR_ADVARSEL} ${h.k('fsis-chart')} sets the safe minimum for shellfish at ${h.t('kjerne')}.${STARTPUNKT(h)}`,
    tabell: {
      tittel: 'Shrimp times from three sources', intro: 'Fresh and breaded shrimp are separate rows.', kolonner: KOLONNER_MAT,
      rader: [
        ROW(h, 'cosori', 'Large shrimp', 'c'),
        ROW(h, 'msu', 'Shrimp', 'm'),
        ROW(h, 'instant', 'Fresh shrimp', 'i'),
        ROW(h, 'cosori', 'Breaded shrimp', 'c-panert'),
        ROW(h, 'msu', 'Breaded shrimp, frozen', 'm-panert'),
      ],
    },
    avsnitt: [
      ['Fresh against breaded', h.p(
        `Breaded shrimp take longer. ${h.k('cosori')} lists ${h.t('c-panert-tid')} at ${h.t('c-panert-temp')}, and ${h.k('msu')} lists ${h.t('m-panert-tid')} under frozen food.`,
        `${h.k('cosori')} marks both large shrimp and breaded shrimp for shaking.`,
      )],
    ],
    kjerne: KJERNE(h, `${h.k('fsis-chart')} lists ${h.t('kjerne')} as the minimum internal temperature for fish and shellfish.`, ''),
    app: 'Save your shrimp recipe in Matlyst, and put it on the day you want to make it.',
    faq: [
      ['How long do shrimp take in the air fryer?', `${h.k('cosori')} says ${h.t('c-tid')} for large shrimp at ${h.t('c-temp')}. ${h.k('instant')} says ${h.t('i-tid')} at ${h.t('i-temp')}.`],
      ['Do I shake the basket?', `${h.k('cosori')} marks shrimp for shaking.`],
      ['What temperature are shrimp done at?', `${h.k('fsis-chart')} says ${h.t('kjerne')} for fish and shellfish.`],
    ],
    les: [L('salmon', 'Salmon in the air fryer'), L('frozen-foods', 'Frozen foods in the air fryer')],
  }),

  // ---------------------------------------------------------------- potatoes
  'pommes-frites': (h) => ({
    ord: 'french fries',
    title: 'Air fryer french fries: time and temperature',
    h1: 'Air fryer french fries: time and temperature',
    description: `Frozen french fries in the air fryer: ${h.t('c-tynn-temp')} for ${h.t('c-tynn-tid')} at Cosori, ${h.t('i-tynn-temp')} for ${h.t('i-tynn-tid')} at Instant Pot. Fresh fries too.`,
    lead: 'Frozen fries, thin or thick, and fresh fries cut at home. Six sources, and they do not agree. Here they are side by side, with the year of each.',
    svar: `For thin frozen fries, ${h.k('cosori')} says ${h.t('c-tynn-temp')} for ${h.t('c-tynn-tid')}, and ${h.k('philips-book')} says ${h.t('pb-tynn-temp')} for ${h.t('pb-tynn-tid')}. ${h.k('kitchenaid')} says ${h.t('k-temp')} for ${h.t('k-tid')}. ${SVAR_ADVARSEL}${STARTPUNKT(h)}`,
    tabell: {
      tittel: 'French fry times from six sources', intro: 'Each row is one source. Frozen fries first, then fresh ones.', kolonner: ['Source', 'Fries', 'Temperature', 'Time'],
      rader: [
        ROW(h, 'cosori', 'Frozen, thin cut', 'c-tynn'),
        ROW(h, 'msu', 'Frozen, thin', 'm-tynn'),
        ROW(h, 'instant', 'Thin cut', 'i-tynn'),
        ROW(h, 'philips-book', 'Thin, frozen', 'pb-tynn'),
        ROW(h, 'cosori', 'Frozen, thick cut', 'c-tykk'),
        ROW(h, 'msu', 'Frozen, thick', 'm-tykk'),
        ROW(h, 'instant', 'Thick cut', 'i-tykk'),
        ROW(h, 'philips-book', 'Thick, frozen', 'pb-tykk'),
        ROW(h, 'kitchenaid', 'Frozen, cut not given', 'k'),
        ROW(h, 'philips-book', 'Homemade fries', 'pb-hjemme'),
        ROW(h, 'cosori', 'Cubed potatoes, one-inch', 'c-poteter'),
      ],
    },
    avsnitt: [
      ['Frozen fries: thin or thick', h.p(
        `All the sources that separate them give thick fries a longer time than thin ones. At ${h.k('cosori')} it is ${h.t('c-tynn-tid')} for thin and ${h.t('c-tykk-tid')} for thick, and at ${h.k('msu')} it is ${h.t('m-tynn-tid')} against ${h.t('m-tykk-tid')}.`,
        `${h.k('cosori')} says most frozen foods go from the freezer to the basket with no thawing, and that most frozen items need no added oil.${h.u('cosori:cold')} It also says to avoid overcrowding frozen items.${h.u('cosori:crowd')}`,
      )],
      ['Fresh fries and potato cubes', h.p(
        `For fries cut at home, ${h.k('philips-book')} lists ${h.t('pb-hjemme-temp')} for ${h.t('pb-hjemme-tid')}. Its notes say to soak the cut potatoes for thirty minutes and add half a tablespoon of oil after drying.${h.u('philips-book:bløt')}`,
        `${h.k('cosori')} lists cubed potatoes, one-inch dice, at ${h.t('c-poteter-temp')} for ${h.t('c-poteter-tid')}, and marks them for shaking.`,
      )],
    ],
    app: 'Save your own fry and wedge recipes in Matlyst, and put them on the day you want to make them.',
    faq: [
      ['How long do frozen french fries take in the air fryer?', `It depends on the source and the cut: ${h.t('c-tynn-tid')} for thin fries at ${h.k('cosori')}, and ${h.t('i-tykk-tid')} for thick fries at ${h.k('instant')}.`],
      ['Do I shake the basket?', `${h.k('cosori')} marks fries for shaking, and ${h.k('philips-book')} marks fries for shaking halfway.`],
      ['Do I need to soak fresh fries?', `${h.k('philips-book')} says to soak homemade fries for thirty minutes and to add oil after drying. The other sources do not list fresh fries.`],
    ],
    les: [L('frozen-foods', 'Frozen foods in the air fryer'), L('baked-potato', 'Baked potato in the air fryer'), L('chicken-wings', 'Chicken wings in the air fryer')],
  }),

  'baked-potato': (h) => ({
    ord: 'baked potato',
    title: 'Air fryer baked potato: time and temperature',
    h1: 'Air fryer baked potato: time and temperature',
    description: `${h.k('idaho')} says ${h.t('id-temp')} for ${h.t('id-tid')}. ${h.k('cosori')} says ${h.t('c-temp')} for ${h.t('c-tid')}. Both side by side, with sweet potatoes.`,
    lead: 'A whole baked potato takes a long time, and the two sources that list it give very different times. Here are both, with the potato size that goes with each.',
    svar: `${h.k('idaho')} says ${h.t('id-temp')} for ${h.t('id-tid')}. ${h.k('cosori')} lists a whole potato of nine to ten ounces at ${h.t('c-temp')} for ${h.t('c-tid')}. ${SVAR_ADVARSEL} ${h.k('idaho')} says the potato is done when the inside reaches ${h.t('id-kjerne')}.`,
    tabell: {
      tittel: 'Potato times from two sources', intro: 'Cosori gives the potato size. The Idaho Potato Commission does not.', kolonner: ['Source', 'Potato', 'Temperature', 'Time'],
      rader: [
        ROW(h, 'idaho', 'Potatoes, size not given', 'id'),
        ROW(h, 'cosori', 'Whole, nine to ten ounces', 'c'),
        ROW(h, 'cosori', 'Sweet potato, whole, nine to ten ounces', 'c-soet'),
        ROW(h, 'msu', 'Sweet potatoes', 'm-soet'),
      ],
    },
    avsnitt: [
      ['Two sources, two times', h.p(
        `${h.k('idaho')} says the time depends on your appliance, the size of the potatoes, and how many you are making at once.${h.u('idaho:tid-avhenger')} ${h.k('cosori')} names a size and still lists a longer time at a lower temperature.`,
        `We do not know why they differ. Both are shown as they are written.`,
      )],
      ['Prepare the skin', h.p(
        `${h.k('idaho')} says to dry the skin well after washing, and to poke the potatoes a few times with a fork to let steam out.${h.u('idaho:stikk')} It says to check halfway and flip a potato that is getting very brown.${h.u('idaho:vend')}`,
      )],
      ['Doneness: the inside temperature', h.p(
        `${h.k('idaho')} says the best way to know a potato is done is when the internal temperature reaches ${h.t('id-kjerne')}. That is the sign the commission gives that the potato is done.`,
      )],
    ],
    app: 'Save your baked potato and topping ideas in Matlyst, and put them on the day you want to make them.',
    faq: [
      ['How long does a baked potato take in the air fryer?', `${h.k('idaho')} says ${h.t('id-tid')} at ${h.t('id-temp')}. ${h.k('cosori')} says ${h.t('c-tid')} at ${h.t('c-temp')}.`],
      ['How do I know a baked potato is done?', `${h.k('idaho')} says the internal temperature should reach ${h.t('id-kjerne')}.`],
      ['How long does a sweet potato take?', `${h.k('cosori')} lists ${h.t('c-soet-tid')} for a whole sweet potato, and ${h.k('msu')} lists ${h.t('m-soet-tid')}.`],
    ],
    les: [L('french-fries', 'French fries in the air fryer'), L('vegetables', 'Vegetables and broccoli in the air fryer')],
  }),

  // ---------------------------------------------------------------- meat
  bacon: (h) => ({
    ord: 'bacon',
    title: 'Air fryer bacon: time and temperature',
    h1: 'Air fryer bacon: time and temperature',
    description: `${h.k('cosori')} lists regular bacon at ${h.t('c-temp')} for ${h.t('c-tid')}. ${h.k('msu')} says ${h.t('m-temp')}. Regular and thick cut side by side.`,
    lead: 'Two sources list bacon in the air fryer, regular and thick cut. The times overlap and the temperatures do not. Here are both.',
    svar: `${h.k('cosori')} lists regular bacon at ${h.t('c-temp')} for ${h.t('c-tid')}, and thick cut for ${h.t('c-tykk-tid')}. ${h.k('msu')} lists ${h.t('m-temp')} for ${h.t('m-tid')} for regular and ${h.t('m-tykk-tid')} for thick. ${SVAR_ADVARSEL}${STARTPUNKT(h)}`,
    tabell: {
      tittel: 'Bacon times from two sources', intro: 'Each row is one source and one thickness.', kolonner: ['Source', 'Bacon', 'Temperature', 'Time'],
      rader: [
        ROW(h, 'cosori', 'Regular', 'c'),
        ROW(h, 'msu', 'Regular', 'm'),
        ROW(h, 'cosori', 'Thick cut', 'c-tykk'),
        ROW(h, 'msu', 'Thick cut', 'm-tykk'),
      ],
    },
    avsnitt: [
      ['Regular and thick cut', h.p(
        `Thick-cut bacon gets a longer time in both sources. ${h.k('cosori')} marks bacon for flipping.`,
        `${h.k('cosori')} says a preheat of ${h.t('c-forvarm')} is enough for most foods.`,
      )],
      ['Smoke and grease', h.p(
        `${h.k('msu')} says to add water or a slice of bread to the drawer of the air fryer to prevent smoking.${h.u('msu:sma')} ${h.k('ill')} says to add one to two teaspoons of water to the drawer before you air fry high-fat foods, to help prevent smoke.${h.u('ill:royk')}`,
      )],
    ],
    app: 'Save your breakfast and sandwich recipes in Matlyst, and put them on the day you want to make them.',
    faq: [
      ['How long does bacon take in the air fryer?', `${h.k('cosori')} says ${h.t('c-tid')} for regular bacon, and ${h.k('msu')} says ${h.t('m-tid')}.`],
      ['Do I flip bacon?', `${h.k('cosori')} marks bacon for flipping. ${h.k('msu')} does not say.`],
      ['What internal temperature is bacon done at?', 'We did not find a source with an air fryer doneness temperature for bacon, so we give none.'],
    ],
    les: [L('hot-dogs', 'Hot dogs in the air fryer'), L('hard-boiled-eggs', 'Hard-boiled eggs in the air fryer')],
  }),

  polser: (h) => ({
    ord: 'hot dogs',
    title: 'Air fryer hot dogs: time and temperature',
    h1: 'Air fryer hot dogs: time and temperature',
    description: `${h.k('instant-hd')} says ${h.t('i-temp')} for ${h.t('i-tid')}. ${h.k('cosori-hd')} says ${h.t('c-temp')} for ${h.t('c-tid')}, plus a short second round in the bun.`,
    lead: 'Hot dogs are already cooked, so the air fryer mostly heats them through and crisps the skin. Two manufacturers give almost the same setting.',
    svar: `${h.k('instant-hd')} says ${h.t('i-temp')} for ${h.t('i-tid')}, until browned and slightly crispy. ${h.k('cosori-hd')} says ${h.t('c-temp')} for ${h.t('c-tid')}, then ${h.t('c-bolle-tid')} more once the hot dogs are in the buns. ${SVAR_ADVARSEL}`,
    tabell: {
      tittel: 'Hot dog times from two manufacturers', intro: 'Both sources are recipes from the air fryer makers.', kolonner: ['Source', 'Step', 'Temperature', 'Time'],
      rader: [
        [h.k('instant-hd'), 'Hot dogs, until browned', h.t('i-temp'), h.t('i-tid')],
        [h.k('cosori-hd'), 'Hot dogs, first round', h.t('c-temp'), h.t('c-tid')],
        [h.k('cosori-hd'), 'In the buns, second round', h.t('c-bolle-temp'), h.t('c-bolle-tid')],
      ],
    },
    avsnitt: [
      ['Slits for crisp edges', h.p(
        `${h.k('instant-hd')} says to make shallow cuts in a crosshatch or parallel pattern, and that this makes each hot dog crispier.${h.u('instant-hd:snitt')} ${h.k('cosori-hd')} says the slits are optional, but they let the edges get extra crispy and hold the toppings better.${h.u('cosori-hd:snitt')}`,
      )],
      ['What the USDA says about hot dogs', h.p(
        `${h.k('fsis-hd')} says hot dogs are fully cooked, and that people at increased risk of foodborne illness should reheat hot dogs until steaming hot before eating, because of the risk of listeriosis.${h.u('fsis-hd:oppvarm')} The source gives no temperature in that passage, so we list none.`,
      )],
    ],
    app: 'Save your cookout and game day recipes in Matlyst, and put them on the day you want to make them.',
    faq: [
      ['How long do hot dogs take in the air fryer?', `${h.k('instant-hd')} says ${h.t('i-tid')} at ${h.t('i-temp')}. ${h.k('cosori-hd')} says ${h.t('c-tid')} at ${h.t('c-temp')}.`],
      ['Do I need to cut the hot dogs?', 'Both manufacturers say slits help the skin crisp. Cosori calls them optional.'],
      ['Are air fryer hot dogs already cooked?', `${h.k('fsis-hd')} says hot dogs are fully cooked, and says who should reheat them until steaming hot.`],
    ],
    les: [L('burgers', 'Burgers in the air fryer'), L('bacon', 'Bacon in the air fryer')],
  }),

  hamburger: (h) => ({
    ord: 'burgers',
    title: 'Air fryer burgers: time and temperature',
    h1: 'Air fryer burgers: time and temperature',
    description: `${h.k('cosori')} lists burgers at ${h.t('c-temp')} for ${h.t('c-tid')}. Two more sources differ a lot. The USDA minimum is ${h.t('kjerne')}.`,
    lead: 'The three sources give burgers three very different settings, from very hot to fairly low. Here they are side by side, with the USDA minimum for ground meat.',
    svar: `${h.k('cosori')} lists a four-ounce burger at ${h.t('c-temp')} for ${h.t('c-tid')}. ${h.k('msu')} lists ${h.t('m-temp')} for ${h.t('m-tid')}, and ${h.k('philips-book')} lists ${h.t('pb-temp')} for ${h.t('pb-tid')}. ${SVAR_ADVARSEL} ${h.k('fsis-chart')} sets the safe minimum for ground meats at ${h.t('kjerne')}.${STARTPUNKT(h)}`,
    tabell: {
      tittel: 'Burger times from three sources', intro: 'Each row is one source. We do not average them.', kolonner: ['Source', 'Patty', 'Temperature', 'Time'],
      rader: [
        ROW(h, 'cosori', 'Four ounces, half to three quarters of an inch', 'c'),
        ROW(h, 'msu', 'Four ounces', 'm'),
        ROW(h, 'philips-book', 'Size not given', 'pb'),
      ],
    },
    avsnitt: [
      ['A wide spread', h.p(
        `${h.k('cosori')} uses the highest temperature of the three and a time that runs from short to long. ${h.k('msu')} lists ${h.t('m-tid')} at a lower temperature. ${h.k('cosori')} marks burgers for flipping.`,
        `The sources do not explain the gap. ${h.k('cosori')} says thickness has the most direct effect on the time.${h.u('cosori:stortid')}`,
      )],
    ],
    kjerne: KJERNE(h, `${h.k('fsis-chart')} lists ${h.t('kjerne')} as the minimum internal temperature for ground meats, and ${h.t('kjerne-fjor')} for ground poultry, so a turkey or chicken burger has a different number.`, 'ground-beef'),
    app: 'Save your burger recipes in Matlyst, and put them on the day you want to make them.',
    faq: [
      ['How long do burgers take in the air fryer?', `${h.k('cosori')} says ${h.t('c-tid')} at ${h.t('c-temp')}, and ${h.k('msu')} says ${h.t('m-tid')} at ${h.t('m-temp')}.`],
      ['Do I flip burgers?', `${h.k('cosori')} marks burgers for flipping.`],
      ['What temperature are burgers done at?', `${h.k('fsis-chart')} says ${h.t('kjerne')} for ground meats and ${h.t('kjerne-fjor')} for ground poultry.`],
    ],
    les: [L('hot-dogs', 'Hot dogs in the air fryer'), L('steak', 'Steak in the air fryer'), L('pork-chops', 'Pork chops in the air fryer')],
  }),

  svinekoteletter: (h) => ({
    ord: 'pork chops',
    title: 'Air fryer pork chops: time and temperature',
    h1: 'Air fryer pork chops: time and temperature',
    description: `${h.k('cosori')} lists boneless pork chops at ${h.t('c-temp')} for ${h.t('c-tid')}. Three sources side by side, and the USDA minimum of ${h.t('kjerne')}.`,
    lead: 'Boneless and bone-in chops get different times, and the three sources use three different temperatures. Here they are side by side.',
    svar: `${h.k('cosori')} lists boneless chops at ${h.t('c-temp')} for ${h.t('c-tid')}, and bone-in chops for ${h.t('c-ben-tid')}. ${h.k('msu')} lists ${h.t('m-temp')} for ${h.t('m-tid')}. ${SVAR_ADVARSEL} ${h.k('fsis-chart')} sets the safe minimum for pork chops at ${h.t('kjerne')}, with a rest of at least ${h.t('hvile')}.${STARTPUNKT(h)}`,
    tabell: {
      tittel: 'Pork chop times from three sources', intro: 'Each row is one source and one cut.', kolonner: ['Source', 'Chop', 'Temperature', 'Time'],
      rader: [
        ROW(h, 'cosori', 'Boneless', 'c'),
        ROW(h, 'cosori', 'Bone-in', 'c-ben'),
        ROW(h, 'msu', 'Six and a half ounces', 'm'),
        ROW(h, 'philips-book', 'Size not given', 'pb'),
      ],
    },
    avsnitt: [
      ['Bone-in against boneless', h.p(
        `${h.k('cosori')} lists ${h.t('c-tid')} for boneless chops and ${h.t('c-ben-tid')} for bone-in, both at ${h.t('c-temp')}, and marks both for flipping.`,
        `${h.k('msu')} gives one time for a chop of six and a half ounces, without saying whether it has a bone.`,
      )],
    ],
    kjerne: KJERNE(h, `${h.k('fsis-chart')} lists ${h.t('kjerne')} for beef, pork, veal, and lamb steaks, chops, and roasts, and says to let them rest for at least ${h.t('hvile')}.`, 'pork'),
    app: 'Save your pork chop recipes in Matlyst, and put them on the day you want to make them.',
    faq: [
      ['How long do pork chops take in the air fryer?', `${h.k('cosori')} says ${h.t('c-tid')} for boneless chops. ${h.k('msu')} says ${h.t('m-tid')}.`],
      ['What temperature are pork chops done at?', `${h.k('fsis-chart')} says ${h.t('kjerne')}, and a rest of at least ${h.t('hvile')}.`],
      ['Do I flip pork chops?', `${h.k('cosori')} marks both chop rows for flipping.`],
    ],
    les: [L('steak', 'Steak in the air fryer'), L('burgers', 'Burgers in the air fryer')],
  }),

  biff: (h) => ({
    ord: 'steak',
    title: 'Air fryer steak: time and temperature',
    h1: 'Air fryer steak: time and temperature',
    description: `${h.k('cosori')} lists a one-inch strip steak at ${h.t('c-strip-temp')} for ${h.t('c-strip-tid')}. Four sources side by side, and the USDA minimum of ${h.t('kjerne')}.`,
    lead: 'Steak times depend on the cut and on how done you want it. The sources even disagree on the doneness temperature: Cosori lists a range, and the USDA lists one number.',
    svar: `${h.k('cosori')} lists a one-inch strip steak at ${h.t('c-strip-temp')} for ${h.t('c-strip-tid')}. ${h.k('kitchenaid')} says ${h.t('k-temp')} for ${h.t('k-tid')} for medium. ${SVAR_ADVARSEL} ${h.k('fsis-chart')} sets the safe minimum for steaks at ${h.t('kjerne')}, with a rest of at least ${h.t('hvile')}.${STARTPUNKT(h)}`,
    tabell: {
      tittel: 'Steak times from four sources', intro: 'Each row is one source and one cut.', kolonner: ['Source', 'Cut', 'Temperature', 'Time'],
      rader: [
        ROW(h, 'cosori', 'New York strip, one inch', 'c-strip'),
        ROW(h, 'cosori', 'Boneless ribeye, one inch', 'c-ribeye'),
        ROW(h, 'cosori', 'Flank steak, one inch', 'c-flank'),
        ROW(h, 'msu', 'Filet mignon, eight ounces', 'm-filet'),
        ROW(h, 'msu', 'Rib eye, eight ounces', 'm-ribeye'),
        ROW(h, 'msu', 'Flank steak, one and a half pounds', 'm-flank'),
        ROW(h, 'kitchenaid', 'Steak, cooked to medium', 'k'),
        ROW(h, 'philips-book', 'Steak, cut not given', 'pb'),
      ],
    },
    avsnitt: [
      ['Doneness: two sources, two answers', h.p(
        `${h.k('cosori')} lists the internal temperature of steak as ${h.t('c-onske')}, depending on preference. ${h.k('fsis-chart')} lists ${h.t('kjerne')} as the minimum for steaks, chops, and roasts, with a rest of at least ${h.t('hvile')}. The two do not match, so both are shown and we do not choose.`,
      )],
      ['Cuts and temperatures', h.p(
        `${h.k('cosori')} runs all its steaks at ${h.t('c-strip-temp')}, and ${h.k('msu')} runs its steaks at ${h.t('m-filet-temp')}. ${h.k('cosori')} marks steaks for flipping.`,
      )],
    ],
    kjerne: KJERNE(h, `${h.k('fsis-chart')} lists ${h.t('kjerne')} for beef, pork, veal, and lamb steaks, chops, and roasts, measured with a food thermometer.`, 'steak'),
    app: 'Save your steak dinner recipes in Matlyst, and put them on the day you want to make them.',
    faq: [
      ['How long does steak take in the air fryer?', `For a one-inch strip, ${h.k('cosori')} says ${h.t('c-strip-tid')}. ${h.k('kitchenaid')} says ${h.t('k-tid')} for medium.`],
      ['Do I flip steak?', `${h.k('cosori')} marks all its steaks for flipping.`],
      ['What temperature is steak done at?', `${h.k('fsis-chart')} says ${h.t('kjerne')}, with a rest. ${h.k('cosori')} lists ${h.t('c-onske')} depending on preference.`],
    ],
    les: [L('pork-chops', 'Pork chops in the air fryer'), L('burgers', 'Burgers in the air fryer')],
  }),

  // ---------------------------------------------------------------- vegetables and frozen
  gronnsaker: (h) => ({
    ord: 'vegetables',
    title: 'Air fryer broccoli and vegetables: time and temperature',
    h1: 'Air fryer broccoli and vegetables: time and temperature',
    description: `${h.k('cosori')} lists broccoli at ${h.t('c-brokkoli-temp')} for ${h.t('c-brokkoli-tid')}. Two more sources say ${h.t('m-brokkoli-temp')}. Seven vegetables side by side.`,
    lead: 'Broccoli, Brussels sprouts, carrots, cauliflower, green beans, zucchini, and asparagus. Cosori and Mississippi State Extension list them all, so they sit side by side here.',
    svar: `For broccoli, ${h.k('cosori')} says ${h.t('c-brokkoli-temp')} for ${h.t('c-brokkoli-tid')}. ${h.k('msu')} and ${h.k('kitchenaid')} both say ${h.t('m-brokkoli-temp')} for ${h.t('m-brokkoli-tid')}. ${SVAR_ADVARSEL}${STARTPUNKT(h)}`,
    tabell: {
      tittel: 'Broccoli times from three sources', intro: 'Broccoli is the one vegetable that three sources list.', kolonner: ['Source', 'Vegetable', 'Temperature', 'Time'],
      rader: [
        ROW(h, 'cosori', 'Broccoli, small florets', 'c-brokkoli'),
        ROW(h, 'msu', 'Broccoli', 'm-brokkoli'),
        ROW(h, 'kitchenaid', 'Broccoli', 'k-brokkoli'),
      ],
    },
    avsnitt: [
      ['Other vegetables, two sources', `${h.p('Cosori and Mississippi State Extension both list these vegetables. The temperatures differ, and so do the times.')}${h.tabell('Other vegetables from two sources', ['Source', 'Vegetable', 'Temperature', 'Time'], [
        ROW(h, 'cosori', 'Brussels sprouts, quartered', 'c-rosenkal'), ROW(h, 'msu', 'Brussels sprouts', 'm-rosenkal'),
        ROW(h, 'cosori', 'Carrots, sliced', 'c-gulrot'), ROW(h, 'msu', 'Carrots', 'm-gulrot'),
        ROW(h, 'cosori', 'Cauliflower, florets', 'c-blomkal'), ROW(h, 'msu', 'Cauliflower', 'm-blomkal'),
        ROW(h, 'cosori', 'Green beans, whole', 'c-bonner'), ROW(h, 'msu', 'Green beans', 'm-bonner'),
        ROW(h, 'cosori', 'Zucchini and squash, one-inch slices', 'c-squash'), ROW(h, 'msu', 'Zucchini', 'm-squash'),
        ROW(h, 'cosori', 'Asparagus, whole spears', 'c-asparges'), ROW(h, 'msu', 'Asparagus', 'm-asparges'),
      ])}`],
      ['What works and what does not', h.p(
        `${h.k('ill')} says frozen vegetables crisp better than raw ones, and that light leafy greens shift in the circulating air, which gives uneven results.${h.u('ill:frosne')}${h.u('ill:blad')}`,
        `${h.k('msu')} says not to cut vegetables too small, because they could fall through the basket and burn at the bottom.${h.u('msu:smaa')} ${h.k('cosori')} marks most vegetables for shaking.`,
      )],
    ],
    app: 'Save your side dish recipes in Matlyst, and put them on the day you want to make them.',
    faq: [
      ['How long does broccoli take in the air fryer?', `${h.k('cosori')} says ${h.t('c-brokkoli-tid')} at ${h.t('c-brokkoli-temp')}, and ${h.k('msu')} says ${h.t('m-brokkoli-tid')} at ${h.t('m-brokkoli-temp')}.`],
      ['Do I shake the basket?', `${h.k('cosori')} marks broccoli and most other vegetables for shaking.`],
      ['Can I air fry leafy greens?', `${h.k('ill')} says fresh greens shift in the circulating air and cook unevenly.`],
    ],
    les: [L('baked-potato', 'Baked potato in the air fryer'), L('french-fries', 'French fries in the air fryer')],
  }),

  'frossen-mat': (h) => ({
    ord: 'frozen foods',
    title: 'Air fryer frozen foods: time and temperature',
    h1: 'Air fryer frozen foods: time and temperature',
    description: `Chicken nuggets, mozzarella sticks, tater tots, and fish sticks in the air fryer, from four sources. ${h.k('cosori')} lists nuggets at ${h.t('c-nugg-temp')} for ${h.t('c-nugg-tid')}.`,
    lead: 'Chicken nuggets, mozzarella sticks, tater tots, and fish sticks, from four sources. Where two sources list the same food, they sit side by side.',
    svar: `${h.k('cosori')} lists chicken nuggets at ${h.t('c-nugg-temp')} for ${h.t('c-nugg-tid')}, and ${h.k('msu')} lists ${h.t('m-nugg-temp')} for ${h.t('m-nugg-tid')}. ${h.k('cosori')} says most frozen foods go straight from the freezer to the basket. ${SVAR_ADVARSEL}${STARTPUNKT(h)}`,
    tabell: {
      tittel: 'Frozen food times from four sources', intro: 'Each row is one source and one food.', kolonner: KOLONNER_MAT,
      rader: [
        ROW(h, 'cosori', 'Chicken nuggets', 'c-nugg'), ROW(h, 'msu', 'Chicken nuggets', 'm-nugg'), ROW(h, 'philips-book', 'Chicken nuggets', 'pb-nugg'),
        ROW(h, 'cosori', 'Mozzarella sticks', 'c-mozz'), ROW(h, 'msu', 'Mozzarella sticks', 'm-mozz'), ROW(h, 'kitchenaid', 'Mozzarella sticks', 'k-mozz'),
        ROW(h, 'cosori', 'Tater tots', 'c-tots'),
        ROW(h, 'cosori', 'Fish sticks', 'c-fisk'), ROW(h, 'msu', 'Fish sticks', 'm-fisk'), ROW(h, 'philips-book', 'Fish sticks', 'pb-fisk'),
      ],
      etter: ['These are the settings from the appliance makers and the extension service. They are not package directions. Follow the package of the food you bought.'],
    },
    avsnitt: [
      ['No thawing, one layer', h.p(
        `${h.k('cosori')} says most frozen foods can go straight from the freezer to the basket with no thawing.${h.u('cosori:tines')} It says ice crystals release moisture as they heat, and a full basket will steam the food instead of crisping it.${h.u('cosori:is')}`,
        `${h.k('cosori')} marks nuggets, tater tots, and most other frozen foods for shaking, and mozzarella sticks and fish sticks for flipping.`,
      )],
      ['Frozen cheese is the exception', h.p(
        `${h.k('ill')} says fresh cheese melts and becomes messy in an air fryer, and to use frozen and breaded cheese, such as frozen mozzarella sticks.${h.u('ill:ost')}`,
      )],
      ['Packaged foods and the conversion rule', h.p(
        `${h.k('philips-book')} gives a rule for pre-made packaged foods: take ${h.t('pb-grad')} off the conventional oven temperature and cut the time by ${h.t('pb-prosent')}.${h.u('philips-book:pakket')} See the <a href="/en/air-fryer/oven-to-air-fryer/">oven to air fryer page</a> for how that compares with the other rules.`,
      )],
    ],
    app: 'Frozen food is a quick weeknight fix. Put it on the days you need it in Matlyst.',
    faq: [
      ['Do I thaw frozen food before the air fryer?', `${h.k('cosori')} says most frozen foods can go straight from the freezer to the basket with no thawing.`],
      ['How long do chicken nuggets take?', `${h.k('cosori')} says ${h.t('c-nugg-tid')} at ${h.t('c-nugg-temp')}, ${h.k('msu')} says ${h.t('m-nugg-tid')} at ${h.t('m-nugg-temp')}, and ${h.k('philips-book')} says ${h.t('pb-nugg-tid')} at ${h.t('pb-nugg-temp')}.`],
      ['How long do tater tots take?', `${h.k('cosori')} says ${h.t('c-tots-tid')} at ${h.t('c-tots-temp')}. We found no second source for tater tots.`],
    ],
    les: [L('french-fries', 'French fries in the air fryer'), L('reheat-pizza-leftovers', 'Reheating pizza and leftovers in the air fryer')],
  }),

  egg: (h) => ({
    ord: 'hard-boiled eggs',
    title: 'Air fryer hard-boiled eggs: time and temperature',
    h1: 'Air fryer hard-boiled eggs: time and temperature',
    description: `${h.k('cosori-egg')} sets the air fryer to ${h.t('c-temp')} for ${h.t('c-tid')} for hard-boiled eggs, in a cold basket, then an ice bath. One manufacturer source.`,
    lead: 'We found one US manufacturer source with a time and temperature for hard-boiled eggs in the air fryer, so this page has one row, not a comparison.',
    svar: `${h.k('cosori-egg')} sets the air fryer to ${h.t('c-temp')} for ${h.t('c-tid')}, then moves the eggs to an ice bath. Its cooking chart says hard-boiled eggs are the exception to its three-minute preheat, and go into a cold basket. ${SVAR_ADVARSEL}`,
    tabell: {
      tittel: 'Hard-boiled egg time from one source', intro: 'The source is a recipe from the air fryer maker.', kolonner: ['Source', 'Food', 'Temperature', 'Time'],
      rader: [ROW(h, 'cosori-egg', 'Hard-boiled eggs', 'c')],
    },
    avsnitt: [
      ['Cold basket, then an ice bath', h.p(
        `${h.k('cosori')} says to put the eggs in a cold basket, since its usual preheat does not apply to hard-boiled eggs.${h.u('cosori:kald')} When the time is up, it says to put the eggs in an ice bath right away, to cool to room temperature.${h.u('cosori-egg:isbad')}`,
        `${h.k('cosori')} also says basket load, thickness, starting temperature, and moisture all affect the real time, so a time is only a starting point.${h.u('cosori:uenighet')}`,
      )],
    ],
    app: 'Save your egg salad and deviled egg recipes in Matlyst, and put them on the day you want to make them.',
    faq: [
      ['How long do hard-boiled eggs take in the air fryer?', `${h.k('cosori-egg')} says ${h.t('c-tid')} at ${h.t('c-temp')}.`],
      ['Do I preheat the air fryer for eggs?', `${h.k('cosori')} says hard-boiled eggs are the exception to its preheat, and go into a cold basket.`],
      ['Is there a softer egg time?', 'We found no US manufacturer source with times for soft or medium eggs, so we give none.'],
    ],
    les: [L('bacon', 'Bacon in the air fryer'), L('reheat-pizza-leftovers', 'Reheating pizza and leftovers in the air fryer')],
  }),

  'reheat-pizza-leftovers': (h) => ({
    ord: 'reheating',
    faqTittel: 'Questions about reheating',
    title: 'Reheat pizza in an air fryer: time and temperature',
    h1: 'Reheat pizza and leftovers in an air fryer: time and temperature',
    description: `${h.k('cosori-reheat')} reheats thin-crust pizza at ${h.t('pizza-tynn-temp')} for ${h.t('pizza-tynn-tid')}. Times for fries, chicken, steak, rice, and more, and the safe ${h.t('kjerne')}.`,
    lead: 'Cosori has reheating settings for pizza, fries, fried chicken, steak, rice, and pasta. Illinois Extension and the USDA say what temperature the food should reach.',
    svar: `${h.k('cosori-reheat')} reheats thin-crust pizza at ${h.t('pizza-tynn-temp')} for ${h.t('pizza-tynn-tid')}, and thick crust at ${h.t('pizza-tykk-temp')} for ${h.t('pizza-tykk-tid')}. ${h.k('ill')} says to set ${h.t('il-temp')} and heat until the food reaches ${h.t('kjerne')}. ${SVAR_ADVARSEL}`,
    seksjoner: [
      ['Pizza', `${h.p(`${h.k('cosori-reheat')} gives three settings, by the kind of slice.`)}${h.tabell('Pizza reheating times', ['Source', 'Slice', 'Temperature', 'Time'], [
        ROW(h, 'cosori-reheat', 'Thin crust', 'pizza-tynn'),
        ROW(h, 'cosori-reheat', 'Thick crust', 'pizza-tykk'),
        ROW(h, 'cosori-reheat', 'Toppings-heavy, to prevent burning', 'pizza-topp'),
      ])}`],
      ['Other foods, from the same Cosori guide', `${h.p('The guide lists many more foods. These are the most common ones.')}${h.tabell('Other reheating times', ['Source', 'Food', 'Temperature', 'Time'], [
        ROW(h, 'cosori-reheat', 'Thin-cut fries', 'pommes'),
        ROW(h, 'cosori-reheat', 'Fried chicken, bone-in pieces', 'kylling-ben'),
        ROW(h, 'cosori-reheat', 'Fried chicken, boneless tenders', 'kylling-tender'),
        ROW(h, 'cosori-reheat', 'Whole steak, flipped halfway', 'biff'),
        ROW(h, 'cosori-reheat', 'Rice', 'ris'),
        ROW(h, 'cosori-reheat', 'Lasagna, one slice', 'lasagne'),
        ROW(h, 'cosori-reheat', 'Pasta, one portion', 'pasta'),
      ])}${h.p(`${h.k('cosori')} says foods that need their crunch back, such as fries, wings, and breaded items, respond best to a higher temperature for a shorter time.${h.u('cosori:varmere')} ${h.k('cosori-reheat')} adds a splash of water or sauce for pasta, to keep it from drying out.${h.u('cosori-reheat:vann')}`)}`],
      ['Leftovers need to reach a safe temperature', h.p(
        `${h.k('ill')} says to set the air fryer to ${h.t('il-temp')} and cook until the food reaches an internal temperature of ${h.t('kjerne')}. ${h.k('fsis-chart')} lists ${h.t('fsis-rester')} for leftovers.`,
        `${TERMOMETER(h)}So the times above only tell you when to start checking. The temperature decides, not the clock.`,
        'See our <a href="/en/internal-temperature/leftovers/">internal temperature chart for leftovers</a>.',
      )],
    ],
    app: 'Matlyst lets you see what is left in your pantry, so leftovers get eaten before they go bad.',
    faq: [
      ['How long do you reheat pizza in an air fryer?', `${h.k('cosori-reheat')} says ${h.t('pizza-tynn-tid')} at ${h.t('pizza-tynn-temp')} for thin crust, and ${h.t('pizza-tykk-tid')} at ${h.t('pizza-tykk-temp')} for thick crust.`],
      ['What temperature should reheated food reach?', `${h.k('fsis-chart')} lists ${h.t('fsis-rester')} for leftovers, and ${h.k('ill')} says ${h.t('kjerne')} in the air fryer.`],
      ['Is reheating in the air fryer better than the microwave?', `${h.k('cosori-reheat')} says microwaving can make a pizza crust chewy, and that an air fryer can restore the crisp.${h.u('cosori-reheat:mikro')}`],
    ],
    les: [L('frozen-foods', 'Frozen foods in the air fryer'), L('french-fries', 'French fries in the air fryer')],
  }),
};

// ---------------------------------------------------------------------------- omregningssiden
/** Eksempelradene på omregningssiden, regnet med KitchenAids regel (ikke oppgitt av KitchenAid selv). Gir også alle tallene radene bruker, til tallvakten. */
export function OVN_TABELL(rad) {
  const grad = rad.tall['ka-grad'].verdi;
  const faktor = 1 - rad.tall['ka-prosent'].verdi / 100;
  const temper = [325, 350, 375, 400, 425, 450].map((ovn) => ({ ovn, af: ovn - grad }));
  const tider = [10, 20, 30, 45, 60].map((ovn) => ({ ovn, af: Math.round(ovn * faktor) }));
  const tall = [...temper.flatMap((x) => [x.ovn, x.af, celsius(x.ovn), celsius(x.af)]), ...tider.flatMap((x) => [x.ovn, x.af])];
  return { temper, tider, tall };
}

/** Vakten: KitchenAid og Illinois må være enige om regelen (25°F og 20 prosent) før omregneren bruker den. Ellers stopper bygget. */
export function kontrollerRegel(rad) {
  const t = (felt) => rad.tall[felt]?.verdi;
  if (t('ka-grad') < t('il-grad-min') || t('ka-grad') > (t('il-grad-maks') ?? t('il-grad-min'))) throw new Error(`omregner: KitchenAids ${t('ka-grad')}°F ligger utenfor Illinois-regelen ${t('il-grad-min')} til ${t('il-grad-maks')}°F`);
  if (t('ka-prosent') !== t('il-prosent')) throw new Error(`omregner: KitchenAid (${t('ka-prosent')} prosent) og Illinois (${t('il-prosent')} prosent) er ikke enige om tiden`);
}

/** Omregneren: statisk først (ingen tall), regelen og meldingene som data, så skriptet ikke har egne tall. Se airfryer-omregner.js. */
export function kalkulator(h, rad) {
  kontrollerRegel(rad);
  const data = {
    regel: { grad: rad.tall['ka-grad'].verdi, prosent: rad.tall['ka-prosent'].verdi },
    feilTemp: 'Enter the oven temperature in °F as a number.',
    feilTid: 'Enter the time in minutes as a number.',
    svar: ['In the air fryer: ', '{temp}°F ({tempC}°C)', ' for ', '{tid} minutes', '.'],
  };
  // Ingen class-attributter: stilen ligger i airfryer-omregner.css og velger på data-attributtene. Feltene er tomme, så siden ikke viser et tall uten kilde.
  return `<link rel="stylesheet" href="/airfryer-omregner.css"><script src="/airfryer-omregner.js" defer></script>
<form data-oaf onsubmit="return false" aria-label="Oven to air fryer converter">
  <div data-oaf-rad>
    <label><span>Oven temperature (°F)</span><input data-felt="temp" type="text" inputmode="numeric" autocomplete="off"></label>
    <label><span>Time in the oven (minutes)</span><input data-felt="tid" type="text" inputmode="numeric" autocomplete="off"></label>
  </div>
  <p data-oaf-svar data-felt="svar" role="status" aria-live="polite">Enter your oven temperature and time. The air fryer settings show here.</p>
  <p data-oaf-merk>A starting point. The rule is from ${h.k('kitchenaid')}, and ${h.k('ill')} gives the same numbers.</p>
  <script type="application/json" data-oaf-data>${JSON.stringify(data, null, 1)}</script>
</form>`;
}

TEKST['ovn-til-airfryer'] = (h, rad) => {
  const o = OVN_TABELL(rad);
  const tempRader = o.temper.map((x) => [`${x.ovn}°F (${celsius(x.ovn)}°C)`, `${x.af}°F (${celsius(x.af)}°C)`]);
  const tidRader = o.tider.map((x) => [`${x.ovn} minutes`, `${x.af} minutes`]);
  return {
    ord: 'oven conversion',
    title: 'Oven to air fryer conversion: temperature and time',
    h1: 'Oven to air fryer conversion: how to change temperature and time',
    description: `Enter the oven temperature and time. The rule: ${h.t('ka-grad')} lower and ${h.t('ka-prosent')} shorter, from ${h.k('kitchenaid')} and ${h.k('ill')}. Other rules side by side.`,
    lead: `Type in the temperature and time from an oven recipe, and get air fryer settings to start with. The rule is ${h.t('ka-grad')} lower and ${h.t('ka-prosent')} shorter. ${h.k('kitchenaid')} and ${h.k('ill')} agree on it. Treat the answer as a starting point.`,
    svar: `Take ${h.t('ka-grad')} off the oven temperature and cut the time by ${h.t('ka-prosent')}, says ${h.k('kitchenaid')}. ${h.k('ill')} says ${h.t('il-grad')} lower and ${h.t('il-prosent')} shorter. ${h.k('philips-book')} gives a different rule for packaged foods: ${h.t('pb-grad')} lower and half the time. ${SVAR_ADVARSEL}`,
    seksjoner: [
      ['Converter: temperature and time', `${h.p('Type in the temperature and the time from the oven recipe. The answer is a starting point, not a rule of nature.')}${kalkulator(h, rad)}`],
      ['The rules side by side', `${h.p('Three sources give three rules. They do not match, so all three are shown, with what each one is for.')}${h.tabell('Oven to air fryer rules from three sources', ['Source', 'For', 'Lower the temperature by', 'Change the time'], [
        [h.k('kitchenaid'), 'Conventional oven recipes', h.t('ka-grad'), `${h.t('ka-prosent')} shorter`],
        [h.k('ill'), 'Conventional oven recipes', h.t('il-grad'), `${h.t('il-prosent')} shorter`],
        [h.k('kitchenaid'), 'Deep frying recipes', h.t('ka-frit-grad'), 'The same time'],
        [h.k('philips-book'), 'Pre-made packaged foods', h.t('pb-grad'), `${h.t('pb-prosent')} shorter`],
      ])}${h.p(`${h.k('kitchenaid')} and ${h.k('ill')} agree for oven recipes, so the converter uses ${h.t('ka-grad')} and ${h.t('ka-prosent')}. ${h.k('ill')} allows a drop of up to ${h.t('il-grad-maks')}, and the converter does not go that far. ${h.k('philips-book')} is an older recipe book, and it says the exact times and temperatures vary by food.${h.u('philips-book:varierer')}`)}`],
      ['Examples, worked out with the rule', `${h.p(`These examples are our arithmetic, using the rule from ${h.k('kitchenaid')}. ${h.k('kitchenaid')} does not list them. The time is rounded to whole minutes.`)}${h.tabell('Oven temperature examples', ['Oven', 'Air fryer'], tempRader)}${h.tabell('Oven time examples', ['Time in the oven', 'Time in the air fryer'], tidRader)}`],
      ['What the converter does not do', h.p(
        `The converter takes ${h.t('ka-grad')} off the temperature and ${h.t('ka-prosent')} off the time, and shows Celsius. That is all. It does not know your air fryer, the size of the food, or whether the recipe is for a convection oven.`,
        `${h.k('cosori')} says wattage, chamber size, and airflow vary between models, so a generic chart may not give the same result in every air fryer.${h.u('cosori:modell')} It also says thickness has the most direct effect on the time.${h.u('cosori:stortid')}`,
      )],
      ['Warming up, shaking, and frozen foods', h.p(
        `${h.k('cosori')} says a preheat of ${h.t('c-forvarm')} is enough for most foods, ${h.k('ill')} says typically ${h.t('il-forvarm')}, and ${h.k('philips-book')} says ${h.t('pb-forvarm')}. ${h.k('instant')} recommends a preheat of ${h.t('i-forvarm')} or less.${h.u('instant:forvarm')}`,
        `${h.k('ill')} says to shake the basket or flip the food in the middle of the time.${h.u('ill:ryst')} ${h.k('cosori')} says frozen items generally need ${h.t('c-frozen-ekstra')} more, without any thawing.${h.u('cosori:frosen')}`,
      )],
    ],
    app: 'Have an oven recipe you want to make in the air fryer? Save it in Matlyst, and put it on the day you want to make it.',
    faq: [
      ['How much lower should the temperature be in an air fryer?', `${h.k('kitchenaid')} says ${h.t('ka-grad')} below the oven temperature, and ${h.k('ill')} says ${h.t('il-grad')}.`],
      ['How much shorter should the time be?', `${h.k('kitchenaid')} and ${h.k('ill')} both say ${h.t('ka-prosent')} shorter. ${h.k('philips-book')} says half the time for pre-made packaged foods.`],
      ['Does the same rule work for deep frying recipes?', `${h.k('kitchenaid')} says to take ${h.t('ka-frit-grad')} off the deep frying temperature and keep the same time.`],
      ['Do I preheat the air fryer?', `${h.k('cosori')}, ${h.k('ill')}, and ${h.k('philips-book')} all give a preheat of ${h.t('c-forvarm')}.`],
    ],
    les: [L('frozen-foods', 'Frozen foods in the air fryer'), L('chicken-breast', 'Chicken breast in the air fryer'), ['/en/blog/oven-to-air-fryer/', 'How to convert an oven recipe to an air fryer (blog)']],
  };
};

// ---------------------------------------------------------------------------- samleside
export function NAV({ rader, h, sti, tabell, p, esc }) {
  const rad = (id) => rader.find((x) => x.id === id);
  const t = (id) => h(rad(id));
  const lenke = (id, navn) => `<a href="${sti(rad(id))}">${esc(navn)}</a>`;
  const ovnRad = rad('ovn-til-airfryer');
  const ov = h(ovnRad);
  const kf = t('kyllingfilet'); const kl = t('kyllinglar'); const kv = t('kyllingvinger'); const la = t('laks'); const rk = t('shrimp');
  const pf = t('pommes-frites'); const bp = t('baked-potato'); const ba = t('bacon'); const po = t('polser'); const hb = t('hamburger');
  const sk = t('svinekoteletter'); const bi = t('biff'); const gr = t('gronnsaker'); const fm = t('frossen-mat'); const eg = t('egg'); const rh = t('reheat-pizza-leftovers');
  const hurtig = [
    [lenke('kyllingfilet', 'Chicken breast'), kf.k('cosori'), kf.t('c-temp'), kf.t('c-tid')],
    [lenke('kyllinglar', 'Chicken thighs, bone-in'), kl.k('cosori'), kl.t('c-ben-temp'), kl.t('c-ben-tid')],
    [lenke('kyllingvinger', 'Chicken wings'), kv.k('cosori'), kv.t('c-temp'), kv.t('c-tid')],
    [lenke('laks', 'Salmon fillet'), la.k('cosori'), la.t('c-temp'), la.t('c-tid')],
    [lenke('shrimp', 'Shrimp, large'), rk.k('cosori'), rk.t('c-temp'), rk.t('c-tid')],
    [lenke('pommes-frites', 'French fries, frozen thin cut'), pf.k('cosori'), pf.t('c-tynn-temp'), pf.t('c-tynn-tid')],
    [lenke('baked-potato', 'Baked potato'), bp.k('cosori'), bp.t('c-temp'), bp.t('c-tid')],
    [lenke('bacon', 'Bacon'), ba.k('cosori'), ba.t('c-temp'), ba.t('c-tid')],
    [lenke('polser', 'Hot dogs'), po.k('instant-hd'), po.t('i-temp'), po.t('i-tid')],
    [lenke('hamburger', 'Burgers'), hb.k('cosori'), hb.t('c-temp'), hb.t('c-tid')],
    [lenke('svinekoteletter', 'Pork chops, boneless'), sk.k('cosori'), sk.t('c-temp'), sk.t('c-tid')],
    [lenke('biff', 'Steak, one-inch strip'), bi.k('cosori'), bi.t('c-strip-temp'), bi.t('c-strip-tid')],
    [lenke('gronnsaker', 'Broccoli'), gr.k('cosori'), gr.t('c-brokkoli-temp'), gr.t('c-brokkoli-tid')],
    [lenke('frossen-mat', 'Chicken nuggets, frozen'), fm.k('cosori'), fm.t('c-nugg-temp'), fm.t('c-nugg-tid')],
    [lenke('egg', 'Hard-boiled eggs'), eg.k('cosori-egg'), eg.t('c-temp'), eg.t('c-tid')],
    [lenke('reheat-pizza-leftovers', 'Pizza, reheated thin crust'), rh.k('cosori-reheat'), rh.t('pizza-tynn-temp'), rh.t('pizza-tynn-tid')],
  ];
  const trygg = [
    ['Poultry: breasts, legs, thighs, wings', kf.k('fsis-chart'), kf.t('kjerne')],
    ['Ground meats', hb.k('fsis-chart'), hb.t('kjerne')],
    ['Ground poultry', hb.k('fsis-chart'), hb.t('kjerne-fjor')],
    ['Beef, pork, veal, and lamb steaks, chops, and roasts', bi.k('fsis-chart'), `${bi.t('kjerne')}, then rest at least ${bi.t('hvile')}`],
    ['Fish and shellfish', la.k('fsis-chart'), la.t('kjerne')],
    ['Leftovers', rh.k('fsis-chart'), rh.t('fsis-rester')],
  ];
  return {
    title: 'Air fryer cooking times and oven to air fryer converter',
    description: `Air fryer times and temperatures for chicken, salmon, fries, bacon, and more, with the source and year. A converter from oven recipes, and the safe temperatures.`,
    h1: 'Air fryer cooking times chart and oven to air fryer converter',
    lead: 'Times and temperatures for common foods in the air fryer, from named sources with the year. Where the sources disagree, you see both. Everything is a starting point.',
    svar: `Pick a food in the table for its time and temperature with source and year, or convert an oven recipe with the converter below. Where sources disagree, both are shown. ${SVAR_ADVARSEL} For meat, poultry, and fish, the thermometer decides, not the clock.`,
    seksjoner: [
      ['Converter: temperature and time', `${p('Type in the temperature and time from the oven recipe to get air fryer settings to start with.')}${kalkulator(ov, ovnRad)}`],
      ['Times and temperatures for common foods', `${p('Each row shows one source, with the year. Open a food to see every source we found for it. Times vary with the air fryer, the amount, and the thickness.')}${tabell('Times and temperatures for common foods', ['Food', 'Source', 'Temperature', 'Time'], hurtig)}`],
      ['Rules for converting a recipe', `${p(`${ov.k('kitchenaid')} says to take ${ov.t('ka-grad')} off the oven temperature and cut the time by ${ov.t('ka-prosent')}. ${ov.k('ill')} says the same, with a drop of up to ${ov.t('il-grad-maks')}. ${ov.k('philips-book')} gives ${ov.t('pb-grad')} lower and half the time for pre-made packaged foods.`)}${p(`See all three, with examples, on the ${lenke('ovn-til-airfryer', 'oven to air fryer page')}.`)}`],
      ['Warming up the air fryer', `${p(`${ov.k('cosori')} says a preheat of ${ov.t('c-forvarm')} is enough for most foods, and ${ov.k('ill')} says typically ${ov.t('il-forvarm')}. ${ov.k('philips-book')} says ${ov.t('pb-forvarm')}, and ${ov.k('instant')} says ${ov.t('i-forvarm')} or less. ${ov.k('cosori')} makes one exception: hard-boiled eggs go into a cold basket.${ov.u('cosori:egg-kald')}`)}`],
      ['Safe internal temperatures', `${p(`For poultry, meat, and fish the thermometer decides whether the food is done, not the clock. The times on our pages only say when to start checking. These are the minimums from ${kf.k('fsis-chart')}, measured with a food thermometer:`)}${tabell('USDA safe minimum internal temperatures', ['Food', 'Source', 'Minimum'], trygg)}${p('The USDA chart does not list bacon, hot dogs, vegetables, or potatoes, so we give no safe minimum for them.')}${p('For more foods, see our <a href="/en/internal-temperature/">internal temperature charts</a>.')}`],
      ['Reading the times', p(
        `${ov.k('cosori')} says cooking times may vary by food thickness, starting temperature, and basket load.${ov.u('cosori:varierer')} ${ov.k('msu')} says you may need to adjust times and temperatures for the size of the food and for your air fryer.${ov.u('msu:justere')}`,
        `${ov.k('cosori')} says a full basket reduces airflow and makes the time longer, so food should go in a single, even layer.${ov.u('cosori:lag')}`,
      )],
    ],
    app: 'Matlyst saves recipes from the web. Put them on the days of the weekly menu, and let the shopping list collect the groceries.',
    faqTittel: 'Questions about air fryer times',
    faq: [
      ['How long does chicken take in the air fryer?', `It depends on the cut. ${kf.k('cosori')} lists boneless chicken breast at ${kf.t('c-temp')} for ${kf.t('c-tid')}, and ${kv.k('cosori')} lists wings at ${kv.t('c-temp')} for ${kv.t('c-tid')}. The thermometer decides: ${kf.t('kjerne')} for poultry, says ${kf.k('fsis-chart')}.`],
      ['Do I need to preheat the air fryer?', `${ov.k('cosori')} says a preheat of ${ov.t('c-forvarm')} is enough for most foods. ${ov.k('philips-book')} says ${ov.t('pb-forvarm')}.`],
      ['How do I convert an oven recipe to an air fryer?', `${ov.k('kitchenaid')} says to take ${ov.t('ka-grad')} off the oven temperature and cut the time by ${ov.t('ka-prosent')}. The converter at the top of this page does that.`],
      ['What temperature should meat reach?', `${kf.k('fsis-chart')} lists ${kf.t('kjerne')} for poultry, ${hb.t('kjerne')} for ground meats, and ${bi.t('kjerne')} for steaks and chops. Fish and shellfish are ${la.t('kjerne')}.`],
    ],
  };
}

// Text for the family «holdbarhet» (en-US): how long food lasts in the fridge. Every sentence restates what a named source says.
// Numbers are never written here: h.t(field) reads them from data.en.json, where each one carries a quote from the source.
// scripts/familier/holdbarhet/kildekontroll.mjs checks that every quote still stands on the source page.
// Sources: FoodSafety.gov Cold Food Storage Chart (fs-chart), USDA FSIS (fsis-*), FDA (fda-lagring). No advice of our own.
// Avoid cook/heat/store/list/week/plan words in h2 headings: scripts/app-bevis.mjs would match them to unrelated app cards.

const FRIDGE_ROOT = '/en/how-long-does-it-last/';
const FREEZE_ROOT = '/en/can-you-freeze/';
const F = (slug, text) => [`${FREEZE_ROOT}${slug}/`, text];
const R = (slug, text) => [`${FRIDGE_ROOT}${slug}/`, text];

const KJOL = (h) => `${h.k('fs-chart')} writes its refrigerator times for a fridge at ${h.t('kjol')} or below.`;
const KORT = (h) => `${h.k('fs-chart')} says the short time limits for home-refrigerated foods "will help keep them from spoiling or becoming dangerous to eat."`;
const TWO = (h) => `${h.k('fsis-danger')} says never to leave food out of refrigeration over ${h.t('timer2')}. When the temperature is above ${h.t('varm')}, the limit is ${h.t('timer1')}.`;
const REHEAT = (h) => `${h.k('fsis-leftovers')} says leftovers should reach ${h.t('oppvarm')} when you reheat them, measured with a food thermometer.`;
const LOOK = (h) => `${h.k('fda-lagring')} says to check leftovers daily for spoilage, and that anything that looks or smells suspicious should be thrown out.`;
const WRAP = (h) => `${h.k('fsis-leftovers')} says to cover leftovers, wrap them in airtight packaging, or seal them in storage containers. That keeps bacteria out, holds in moisture, and stops leftovers from picking up odors from other food.`;
const SHALLOW = (h) => `To cool food fast, ${h.k('fsis-leftovers')} says to divide large amounts into shallow containers and cut large items into smaller portions.`;
const COLUMNS = ['Food', 'Time in the fridge'];
const TIMES = 'How long it lasts';
const LAST = (what) => `How long does ${what} last in the fridge?`;
const CHART = (h) => `${h.k('fs-chart')} lists these times for the refrigerator:`;

export const TEKST = {
  egg: (h) => ({
    ord: 'eggs',
    title: LAST('an egg'),
    h1: 'How long do eggs last in the fridge?',
    description: `Raw eggs in the shell last ${h.t('skall')} in the fridge, and raw egg whites and yolks last ${h.t('hviter')}, according to ${h.k('fs-chart')}. What the USDA and FDA add.`,
    lead: `Raw eggs in the shell last ${h.t('skall')} in the refrigerator, according to ${h.k('fs-chart')}. Raw egg whites and yolks that are out of the shell last ${h.t('hviter')}.`,
    kilder: [
      `${h.k('fsis-eggs')} says refrigerated eggs should not be left out more than ${h.t('ute')}.`,
      `${h.k('fsis-eggs')} also explains the dates on cartons: "EXP," "Sell By," and "Best if Used Before" are examples of code dates, and code dates on USDA graded eggs are optional.`,
      `${h.k('fda-lagring')} says to keep eggs in their carton in the refrigerator itself, not on the door, where the temperature is warmer.`,
      KJOL(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fs-chart', intro: CHART(h), kolonner: COLUMNS, rader: [['Raw eggs in the shell', 'skall'], ['Raw egg whites and yolks', 'hviter']], etter: [KORT(h)] },
    faq: [
      ['Do eggs have to be refrigerated?', `${h.k('fda-lagring')} says to store eggs in their carton in the refrigerator, and ${h.k('fsis-eggs')} says refrigerated eggs should not be left out more than ${h.t('ute')}.`],
      ['Can you freeze eggs?', `${h.k('fs-chart')} says not to freeze raw eggs in the shell. Beat the yolks and whites together, then freeze. See <a href="${FREEZE_ROOT}eggs/">can you freeze eggs</a>.`],
    ],
    soster: F('eggs', 'Can you freeze eggs?'),
    andre: [R('hard-boiled-eggs', 'How long do hard-boiled eggs last?')],
  }),

  'kokte-egg': (h) => ({
    ord: 'hard-boiled eggs',
    title: 'How long do hard-boiled eggs last in the fridge?',
    h1: 'How long do hard-boiled eggs last in the fridge?',
    description: `Hard-boiled eggs last ${h.t('hardkokt')} in the fridge, according to ${h.k('fs-chart')} and ${h.k('fsis-eggs')}. Refrigerate them within ${h.t('fsis-kjol')} of cooking.`,
    lead: `Hard-boiled eggs last ${h.t('hardkokt')} in the refrigerator. ${h.k('fsis-eggs')} says to refrigerate them within ${h.t('fsis-kjol')} of cooking.`,
    kilder: [
      `${h.k('fsis-eggs')} says hard-cooked eggs should be refrigerated within ${h.t('fsis-kjol')} of cooking and used within a week.`,
      `${h.k('fs-chart')} gives the same ${h.t('hardkokt')} for hard-cooked eggs and says they do not freeze.`,
      `${h.k('fsis-eggs')} also says it does not recommend eating hard-cooked eggs after hiding or playing with them, because bacteria picked up on the shells can be transferred to the edible part of the egg.`,
      TWO(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fs-chart', intro: CHART(h), kolonner: COLUMNS, rader: [['Hard-cooked eggs', 'hardkokt']], etter: [KJOL(h)] },
    faq: [
      ['Why do hard-boiled eggs spoil faster than fresh eggs?', `${h.k('fsis-eggs')} explains that hard-cooking leaves a thin layer of water on the egg surface under the shell, and that water gives bacteria a favorable environment.`],
      ['Can you eat hard-boiled eggs left out overnight?', `${h.k('fsis-eggs')} says hard-cooked eggs should be refrigerated within ${h.t('fsis-kjol')} of cooking. See also <a href="${FREEZE_ROOT}hard-boiled-eggs/">can you freeze hard-boiled eggs</a>.`],
    ],
    soster: F('hard-boiled-eggs', 'Can you freeze hard-boiled eggs?'),
    andre: [R('eggs', 'How long do raw eggs last?'), R('egg-salad', 'How long does egg salad last?')],
  }),

  rester: (h) => ({
    ord: 'leftovers',
    title: 'How long do leftovers last in the fridge?',
    h1: 'How long do leftovers last in the fridge?',
    description: `Leftovers can be kept in the refrigerator for ${h.t('lft')}, says ${h.k('fsis-leftovers')}. How to cool, wrap, and reheat them, with the rules of the USDA and FDA.`,
    lead: `Leftovers can be kept in the refrigerator for ${h.t('lft')}, says ${h.k('fsis-leftovers')}. Cooked meat and poultry get the same ${h.t('kokt-kjott')} on the ${h.k('fs-chart')} chart.`,
    kilder: [
      TWO(h),
      SHALLOW(h),
      WRAP(h),
      REHEAT(h),
      LOOK(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fsis-leftovers', intro: `${h.k('fsis-leftovers')} gives one time for leftovers in general:`, kolonner: COLUMNS, rader: [['Leftovers', 'lft'], ['Cooked meat or poultry', 'kokt-kjott']], etter: [KJOL(h)] },
    faq: [
      ['How long can leftovers sit out?', `${h.k('fsis-danger')} says never more than ${h.t('timer2')}, or ${h.t('timer1')} when the temperature is above ${h.t('varm')}.`],
      ['Can you freeze leftovers?', `Yes, says ${h.k('fsis-leftovers')}. See <a href="${FREEZE_ROOT}leftovers/">can you freeze leftovers</a>.`],
    ],
    soster: F('leftovers', 'Can you freeze leftovers?'),
    andre: [R('cooked-rice', 'How long does cooked rice last?'), R('soup', 'How long does soup last?')],
  }),

  'cooked-chicken': (h) => ({
    ord: 'chicken',
    title: LAST('cooked chicken'),
    h1: 'How long does cooked chicken last in the fridge?',
    description: `Cooked chicken and other cooked poultry last ${h.t('kokt')} in the fridge, according to ${h.k('fs-chart')}. So do chicken nuggets and patties. Rules for cooling and reheating.`,
    lead: `Cooked chicken lasts ${h.t('kokt')} in the refrigerator, according to ${h.k('fs-chart')}, which lists cooked meat or poultry under leftovers.`,
    kilder: [
      `${h.k('fsis-leftovers')} says to cook all poultry to an internal temperature of ${h.t('fjaerfe')}, as measured with a food thermometer, and that leftovers can be kept in the refrigerator for ${h.t('lft')}.`,
      TWO(h),
      WRAP(h),
      LOOK(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fs-chart', intro: CHART(h), kolonner: COLUMNS, rader: [['Cooked meat or poultry', 'kokt'], ['Chicken nuggets or patties', 'nuggets']], etter: [KJOL(h)] },
    faq: [
      ['How long does raw chicken last in the fridge?', `${h.k('fs-chart')} lists a shorter time for raw chicken. See <a href="${FRIDGE_ROOT}raw-chicken/">how long raw chicken lasts</a>.`],
      ['Can you freeze cooked chicken?', `${h.k('fs-chart')} lists a freezer time for cooked poultry. See <a href="${FREEZE_ROOT}cooked-chicken/">can you freeze cooked chicken</a>.`],
    ],
    soster: F('cooked-chicken', 'Can you freeze cooked chicken?'),
    andre: [R('raw-chicken', 'How long does raw chicken last?'), R('turkey-leftovers', 'How long do turkey leftovers last?')],
  }),

  'raw-chicken': (h) => ({
    ord: 'raw chicken',
    title: LAST('raw chicken'),
    h1: 'How long does raw chicken last in the fridge?',
    description: `Raw chicken, whole or in pieces, lasts ${h.t('hel')} in the fridge, according to ${h.k('fs-chart')}. The same time applies to raw turkey on the chart.`,
    lead: `Raw chicken lasts ${h.t('hel')} in the refrigerator, whole or in pieces, according to ${h.k('fs-chart')}. That is the shortest time on the chart for poultry.`,
    kilder: [
      `${h.k('fsis-leftovers')} says to cook all poultry to an internal temperature of ${h.t('fjaerfe')}, as measured with a food thermometer.`,
      `${h.k('fsis-danger')} says bacteria grow rapidly in the danger zone, so raw poultry should not sit out. The limit is ${h.t('timer2')}, or ${h.t('timer1')} above ${h.t('varm')}.`,
      KJOL(h),
      KORT(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fs-chart', intro: CHART(h), kolonner: COLUMNS, rader: [['Chicken or turkey, whole', 'hel'], ['Chicken or turkey, pieces', 'biter']] },
    faq: [
      ['Does the time start when you buy it or when you cook it?', `The chart gives the time for raw poultry in the refrigerator and does not say when the clock starts.`],
      ['How long does cooked chicken last?', `Longer. See <a href="${FRIDGE_ROOT}cooked-chicken/">how long cooked chicken lasts</a>.`],
    ],
    soster: F('raw-chicken', 'Can you freeze raw chicken?'),
    andre: [R('cooked-chicken', 'How long does cooked chicken last?'), R('ground-beef', 'How long does ground beef last?')],
  }),

  'ground-beef': (h) => ({
    ord: 'ground beef',
    title: LAST('ground beef'),
    h1: 'How long does ground beef last in the fridge?',
    description: `Hamburger and ground meats last ${h.t('deig')} in the fridge, according to ${h.k('fs-chart')}. The time covers ground beef, turkey, chicken, pork, lamb, and mixtures.`,
    lead: `Ground beef lasts ${h.t('deig')} in the refrigerator, according to ${h.k('fs-chart')}. The same line covers ground turkey, chicken, other poultry, veal, pork, lamb, and mixtures of them.`,
    kilder: [
      `${h.k('fs-chart')} puts ground meat among the shortest times on the whole chart, shorter than steaks, chops, or roasts.`,
      TWO(h),
      KJOL(h),
      KORT(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fs-chart', intro: CHART(h), kolonner: COLUMNS, rader: [['Hamburger and ground meats, ground poultry', 'deig']] },
    faq: [
      ['Is that the same for ground turkey?', `Yes. The chart line names ground turkey, chicken, other poultry, veal, pork, lamb, and mixtures of them, all with ${h.t('deig')}.`],
      ['Can you freeze ground beef?', `${h.k('fs-chart')} lists a freezer time. See <a href="${FREEZE_ROOT}ground-beef/">can you freeze ground beef</a>.`],
    ],
    soster: F('ground-beef', 'Can you freeze ground beef?'),
    andre: [R('steak', 'How long do steak and chops last?')],
  }),

  steak: (h) => ({
    ord: 'steak',
    title: LAST('raw steak'),
    h1: 'How long does steak last in the fridge?',
    description: `Raw steaks, chops, and roasts last ${h.t('steak')} in the fridge, according to ${h.k('fs-chart')}. What else the USDA and FDA say about fresh beef, veal, lamb, and pork.`,
    lead: `Raw steaks, chops, and roasts of beef, veal, lamb, and pork last ${h.t('steak')} in the refrigerator, according to ${h.k('fs-chart')}.`,
    kilder: [
      `${h.k('fsis-leftovers')} says to cook raw beef, pork, lamb, and veal steaks, chops, and roasts to a minimum internal temperature of ${h.t('rodt')}, as measured with a food thermometer.`,
      TWO(h),
      KJOL(h),
      KORT(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fs-chart', intro: CHART(h), kolonner: COLUMNS, rader: [['Steaks', 'steak'], ['Chops', 'kotelett'], ['Roasts', 'stek']], etter: [`Ground meat has a shorter time. See <a href="${FRIDGE_ROOT}ground-beef/">how long ground beef lasts</a>.`] },
    faq: [
      ['How long does cooked steak last?', `The chart lists cooked meat or poultry under leftovers. See <a href="${FRIDGE_ROOT}leftovers/">how long leftovers last</a>.`],
      ['Can you freeze steak?', `${h.k('fs-chart')} lists a freezer time for steaks, chops, and roasts. See <a href="${FREEZE_ROOT}steak/">can you freeze steak</a>.`],
    ],
    soster: F('steak', 'Can you freeze steak?'),
    andre: [R('ham', 'How long does ham last?')],
  }),

  'cooked-rice': (h) => ({
    ord: 'rice',
    title: LAST('cooked rice'),
    h1: 'How long does cooked rice last in the fridge?',
    description: `The federal sources do not give rice its own time. For leftovers in general, ${h.k('fsis-leftovers')} says ${h.t('lft')} in the fridge. Cooling and reheating rules.`,
    lead: `The ${h.k('fs-chart')} chart does not list rice by name. For leftovers in general, ${h.k('fsis-leftovers')} says ${h.t('lft')} in the refrigerator.`,
    kilder: [
      `Rice falls under the leftovers rule: ${h.k('fsis-leftovers')} says leftovers can be kept in the refrigerator for ${h.t('lft')}.`,
      TWO(h),
      SHALLOW(h),
      REHEAT(h),
      LOOK(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fsis-leftovers', intro: `${h.k('fsis-leftovers')} gives one time for leftovers, with no separate line for rice:`, kolonner: COLUMNS, rader: [['Leftovers, including cooked rice', 'lft']], etter: [KJOL(h)] },
    faq: [
      ['Is there a special rule for rice?', `Not on the ${h.k('fs-chart')} chart or in ${h.k('fsis-leftovers')}. Both speak of leftovers in general, and the rice time on this page comes from that rule.`],
      ['Can you freeze cooked rice?', `${h.k('fsis-leftovers')} says leftovers can be frozen. See <a href="${FREEZE_ROOT}cooked-rice/">can you freeze cooked rice</a>.`],
    ],
    soster: F('cooked-rice', 'Can you freeze cooked rice?'),
    andre: [R('cooked-pasta', 'How long does cooked pasta last?'), R('leftovers', 'How long do leftovers last?')],
  }),

  'cooked-pasta': (h) => ({
    ord: 'pasta',
    title: LAST('cooked pasta'),
    h1: 'How long does cooked pasta last in the fridge?',
    description: `Cooked pasta follows the leftovers rule of ${h.t('lft')} in the fridge, says ${h.k('fsis-leftovers')}. Macaroni salad lasts ${h.t('salat')} on the ${h.k('fs-chart')} chart.`,
    lead: `Plain cooked pasta is not on the chart, so the leftovers rule applies: ${h.t('lft')} in the refrigerator, says ${h.k('fsis-leftovers')}. Macaroni salad is listed, at ${h.t('salat')}.`,
    kilder: [
      `${h.k('fsis-leftovers')} says leftovers can be kept in the refrigerator for ${h.t('lft')}.`,
      `${h.k('fs-chart')} names macaroni salad together with egg, chicken, ham, and tuna salads at ${h.t('salat')}, and says they do not freeze well.`,
      REHEAT(h),
      WRAP(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fsis-leftovers', intro: `${h.k('fsis-leftovers')} and ${h.k('fs-chart')} give these times:`, kolonner: COLUMNS, rader: [['Leftovers, including cooked pasta', 'lft'], ['Macaroni salad', 'salat']], etter: [KJOL(h)] },
    faq: [
      ['Does sauce change the time?', `The sources give no separate time for pasta with sauce. They speak of leftovers in general, and soups and stews with vegetables or meat are listed at ${h.t('lft')} too. See <a href="${FRIDGE_ROOT}soup/">soup</a>.`],
      ['Can you freeze cooked pasta?', `${h.k('fsis-leftovers')} says leftovers can be frozen. See <a href="${FREEZE_ROOT}cooked-pasta/">can you freeze cooked pasta</a>.`],
    ],
    soster: F('cooked-pasta', 'Can you freeze cooked pasta?'),
    andre: [R('cooked-rice', 'How long does cooked rice last?'), R('egg-salad', 'How long do egg, chicken, and tuna salad last?')],
  }),

  soup: (h) => ({
    ord: 'soup',
    title: LAST('soup'),
    h1: 'How long does soup last in the fridge?',
    description: `Soups and stews with vegetables or meat last ${h.t('suppe')} in the fridge, according to ${h.k('fs-chart')}. How to cool a big pot and bring soup back to a boil.`,
    lead: `Soups and stews with vegetables or meat last ${h.t('suppe')} in the refrigerator, according to ${h.k('fs-chart')}.`,
    kilder: [
      `${h.k('fsis-leftovers')} uses soup as its example for cooling: a big pot takes a long time to cool, which gives bacteria time to multiply, so divide it into smaller containers.`,
      `${h.k('fsis-leftovers')} says to reheat sauces, soups, and gravies by bringing them to a rolling boil, and that leftovers should reach ${h.t('oppvarm')}.`,
      TWO(h),
      KJOL(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fs-chart', intro: CHART(h), kolonner: COLUMNS, rader: [['Soups and stews, vegetable or meat added', 'suppe']] },
    faq: [
      ['Can you put a hot pot of soup straight in the fridge?', `${h.k('fsis-leftovers')} says a big pot of soup takes a long time to cool, and advises dividing it into smaller containers so it cools quickly.`],
      ['Can you freeze soup?', `${h.k('fs-chart')} lists a freezer time. See <a href="${FREEZE_ROOT}soup/">can you freeze soup</a>.`],
    ],
    soster: F('soup', 'Can you freeze soup?'),
    andre: [R('leftovers', 'How long do leftovers last?')],
  }),

  pizza: (h) => ({
    ord: 'pizza',
    title: LAST('pizza'),
    h1: 'How long does pizza last in the fridge?',
    description: `Leftover pizza lasts ${h.t('pizza')} in the fridge, according to ${h.k('fs-chart')}. The leftovers rule of ${h.k('fsis-leftovers')} and how long pizza can sit out.`,
    lead: `Leftover pizza lasts ${h.t('pizza')} in the refrigerator, according to ${h.k('fs-chart')}, which lists pizza by name.`,
    kilder: [
      `${h.k('fsis-leftovers')} puts leftovers at ${h.t('lft')} in the refrigerator, which matches the pizza line on the chart.`,
      `${h.k('fda-lagring')} says the two-hour rule covers leftovers, doggie bags, and take-out foods.`,
      TWO(h),
      WRAP(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fs-chart', intro: CHART(h), kolonner: COLUMNS, rader: [['Pizza', 'pizza']], etter: [KJOL(h)] },
    faq: [
      ['Can pizza sit out overnight?', `No, going by ${h.k('fsis-danger')}: never leave food out of refrigeration over ${h.t('timer2')}.`],
      ['Can you freeze pizza?', `${h.k('fs-chart')} lists a freezer time. See <a href="${FREEZE_ROOT}pizza/">can you freeze pizza</a>.`],
    ],
    soster: F('pizza', 'Can you freeze pizza?'),
    andre: [R('leftovers', 'How long do leftovers last?')],
  }),

  bacon: (h) => ({
    ord: 'bacon',
    title: LAST('bacon'),
    h1: 'How long does bacon last in the fridge?',
    description: `Bacon lasts ${h.t('bacon')} in the fridge, according to ${h.k('fs-chart')}. The chart also lists raw sausage at ${h.t('raa-polse')} and fully cooked sausage at ${h.t('kokt-polse')}.`,
    lead: `Bacon lasts ${h.t('bacon')} in the refrigerator, according to ${h.k('fs-chart')}. Raw sausage has a much shorter time: ${h.t('raa-polse')}.`,
    kilder: [
      `${h.k('fs-chart')} groups bacon and sausage together. Raw sausage from chicken, turkey, pork, or beef lasts ${h.t('raa-polse')}, and fully cooked sausage lasts ${h.t('kokt-polse')}.`,
      TWO(h),
      KJOL(h),
      KORT(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fs-chart', intro: CHART(h), kolonner: COLUMNS, rader: [['Bacon', 'bacon'], ['Sausage, raw', 'raa-polse'], ['Sausage, fully cooked', 'kokt-polse']] },
    faq: [
      ['Is the time for opened and unopened bacon the same?', `The chart gives one line for bacon, ${h.t('bacon')}, and does not split it by package.`],
      ['Can you freeze bacon?', `${h.k('fs-chart')} lists a freezer time. See <a href="${FREEZE_ROOT}bacon/">can you freeze bacon</a>.`],
    ],
    soster: F('bacon', 'Can you freeze bacon?'),
    andre: [R('hot-dogs', 'How long do hot dogs last?'), R('deli-meat', 'How long does deli meat last?')],
  }),

  'deli-meat': (h) => ({
    ord: 'deli meat',
    title: LAST('deli meat'),
    h1: 'How long does deli meat last in the fridge?',
    description: `Opened or deli-sliced lunch meat lasts ${h.t('apnet')} in the fridge. Unopened packages last ${h.t('uapnet')}, according to ${h.k('fs-chart')}.`,
    lead: `Opened or deli-sliced luncheon meat lasts ${h.t('apnet')} in the refrigerator, according to ${h.k('fs-chart')}. An unopened package lasts ${h.t('uapnet')}.`,
    kilder: [
      `${h.k('fda-lagring')} says ready-to-eat foods such as luncheon meats should be used as soon as possible. The longer they are stored, the more chance Listeria can grow, especially if the refrigerator temperature is above ${h.t('listeria')}.`,
      `${h.k('fsis-leftovers')} says cold perishable food, such as a platter of deli meats, should be kept at ${h.t('kjol')} or below.`,
      TWO(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fs-chart', intro: CHART(h), kolonner: COLUMNS, rader: [['Luncheon meat, opened or deli sliced', 'apnet'], ['Luncheon meat, unopened package', 'uapnet']], etter: [KORT(h)] },
    faq: [
      ['Does the time start when you open it?', `The chart separates opened and deli-sliced meat (${h.t('apnet')}) from an unopened package (${h.t('uapnet')}).`],
      ['Can you freeze deli meat?', `${h.k('fs-chart')} lists a freezer time. See <a href="${FREEZE_ROOT}deli-meat/">can you freeze deli meat</a>.`],
    ],
    soster: F('deli-meat', 'Can you freeze deli meat?'),
    andre: [R('hot-dogs', 'How long do hot dogs last?'), R('ham', 'How long does ham last?')],
  }),

  'hot-dogs': (h) => ({
    ord: 'hot dogs',
    title: LAST('hot dogs'),
    h1: 'How long do hot dogs last in the fridge?',
    description: `Hot dogs last ${h.t('apnet')} once the package is opened and ${h.t('uapnet')} while it is sealed, according to ${h.k('fs-chart')}.`,
    lead: `An opened package of hot dogs lasts ${h.t('apnet')} in the refrigerator. An unopened package lasts ${h.t('uapnet')}, according to ${h.k('fs-chart')}.`,
    kilder: [
      `${h.k('fs-chart')} gives hot dogs their own lines, separate from luncheon meat, with one time for an opened package and one for an unopened package.`,
      TWO(h),
      KJOL(h),
      KORT(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fs-chart', intro: CHART(h), kolonner: COLUMNS, rader: [['Hot dogs, opened package', 'apnet'], ['Hot dogs, unopened package', 'uapnet']] },
    faq: [
      ['Do cooked hot dogs last as long?', `The chart gives times for opened and unopened packages only. For cooked leftovers, ${h.k('fsis-leftovers')} says ${h.t('lft')}.`],
      ['Can you freeze hot dogs?', `${h.k('fs-chart')} lists a freezer time. See <a href="${FREEZE_ROOT}hot-dogs/">can you freeze hot dogs</a>.`],
    ],
    soster: F('hot-dogs', 'Can you freeze hot dogs?'),
    andre: [R('bacon', 'How long does bacon last?'), R('deli-meat', 'How long does deli meat last?')],
  }),

  ham: (h) => ({
    ord: 'ham',
    title: LAST('ham'),
    h1: 'How long does ham last in the fridge?',
    description: `Whole cooked ham lasts ${h.t('hel')} in the fridge, and cooked ham slices last ${h.t('skiver')}, according to ${h.k('fs-chart')}. Fresh uncooked ham: ${h.t('fersk')}.`,
    lead: `A whole cooked ham that was wrapped at the store lasts ${h.t('hel')} in the refrigerator. Slices, halves, and spiral cuts last ${h.t('skiver')}, according to ${h.k('fs-chart')}.`,
    kilder: [
      `${h.k('fs-chart')} has a separate block for ham, with a line for each kind. Fresh, uncured, uncooked ham lasts ${h.t('fersk')}.`,
      `The chart also lists cured, vacuum-sealed, canned, country, and prosciutto-style hams. Some of those lines give the time as a "use by" date, so this page leaves them out.`,
      TWO(h),
      KJOL(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fs-chart', intro: CHART(h), kolonner: COLUMNS, rader: [['Fresh, uncured, uncooked ham', 'fersk'], ['Cooked ham, store-wrapped, whole', 'hel'], ['Cooked ham, store-wrapped, slices, half, or spiral cut', 'skiver']] },
    faq: [
      ['Does a spiral-cut ham last as long as a whole ham?', `No. The chart gives ${h.t('skiver')} for slices, half, and spiral cut, and ${h.t('hel')} for a whole cooked ham.`],
      ['Can you freeze ham?', `${h.k('fs-chart')} lists freezer times for each kind. See <a href="${FREEZE_ROOT}ham/">can you freeze ham</a>.`],
    ],
    soster: F('ham', 'Can you freeze ham?'),
    andre: [R('deli-meat', 'How long does deli meat last?'), R('turkey-leftovers', 'How long do turkey leftovers last?')],
  }),

  salmon: (h) => ({
    ord: 'salmon',
    title: LAST('salmon'),
    h1: 'How long does salmon last in the fridge?',
    description: `Fresh salmon and other fatty fish last ${h.t('fet')} in the fridge, according to ${h.k('fs-chart')}. Bluefish, catfish, mackerel, mullet, and tuna are on the same line.`,
    lead: `Salmon lasts ${h.t('fet')} in the refrigerator, according to ${h.k('fs-chart')}. The chart files salmon under fatty fish, with bluefish, catfish, mackerel, mullet, and tuna.`,
    kilder: [
      `${h.k('fs-chart')} splits fin fish into fatty and lean fish. This page uses the fatty fish line because salmon is named on it.`,
      TWO(h),
      KJOL(h),
      KORT(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fs-chart', intro: CHART(h), kolonner: COLUMNS, rader: [['Fatty fish: bluefish, catfish, mackerel, mullet, salmon, tuna', 'fet']] },
    faq: [
      ['Does cooked salmon last as long?', `The chart gives the time for fatty fish. Cooked fish falls under leftovers, where ${h.k('fsis-leftovers')} says ${h.t('lft')}.`],
      ['Can you freeze salmon?', `${h.k('fs-chart')} lists a freezer time. See <a href="${FREEZE_ROOT}salmon/">can you freeze salmon</a>.`],
    ],
    soster: F('salmon', 'Can you freeze salmon?'),
    andre: [R('shrimp', 'How long do shrimp last?')],
  }),

  skalldyr: (h) => ({
    ord: 'shrimp and shellfish',
    title: LAST('shrimp'),
    h1: 'How long does shrimp last in the fridge?',
    description: `Shrimp and crayfish last ${h.t('reker')} in the fridge, according to ${h.k('fs-chart')}. Fresh crab meat lasts ${h.t('krabbe')}, and shucked clams, mussels, oysters, and scallops ${h.t('skjell')}.`,
    lead: `Shrimp and crayfish last ${h.t('reker')} in the refrigerator, according to ${h.k('fs-chart')}. Other shellfish have their own lines.`,
    kilder: [
      `${h.k('fs-chart')} lists shellfish separately from fin fish. Fresh crab meat lasts ${h.t('krabbe')}, and shucked clams, mussels, oysters, and scallops last ${h.t('skjell')}.`,
      TWO(h),
      KJOL(h),
      KORT(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fs-chart', intro: CHART(h), kolonner: COLUMNS, rader: [['Shrimp and crayfish', 'reker'], ['Fresh crab meat', 'krabbe'], ['Shucked clams, mussels, oysters, and scallops', 'skjell']] },
    faq: [
      ['How long do cooked shrimp last?', `The chart lists shrimp, not cooked shrimp. Cooked food falls under leftovers, where ${h.k('fsis-leftovers')} says ${h.t('lft')}.`],
      ['Can you freeze shrimp?', `${h.k('fs-chart')} lists freezer times for shrimp and shellfish. See <a href="${FREEZE_ROOT}shrimp/">can you freeze shrimp</a>.`],
    ],
    soster: F('shrimp', 'Can you freeze shrimp and shellfish?'),
    andre: [R('salmon', 'How long does salmon last?')],
  }),

  'turkey-leftovers': (h) => ({
    ord: 'turkey leftovers',
    title: 'How long do Thanksgiving turkey leftovers last in the fridge?',
    h1: 'How long do turkey leftovers last in the fridge?',
    description: `Leftover turkey lasts ${h.t('kokt')} in the fridge, according to ${h.k('fs-chart')}. What the USDA says about the two-hour rule on a holiday table.`,
    lead: `Leftover turkey lasts ${h.t('kokt')} in the refrigerator, according to ${h.k('fs-chart')}. That is the time for cooked meat or poultry, and it matches the leftovers rule of ${h.k('fsis-leftovers')}.`,
    kilder: [
      `${h.k('fsis-danger')} says never to leave food out of refrigeration over ${h.t('timer2')}. When the temperature is above ${h.t('varm')}, the limit is ${h.t('timer1')}. On a holiday table, that is the clock for the whole meal.`,
      `${h.k('fsis-leftovers')} says leftovers can be kept in the refrigerator for ${h.t('lft')}, and that you should reheat them to ${h.t('oppvarm')}.`,
      SHALLOW(h),
      `A raw whole turkey has a much shorter time on the ${h.k('fs-chart')} chart: ${h.t('raa-hel')}.`,
    ],
    tabell: { tittel: TIMES, kilde: 'fs-chart', intro: CHART(h), kolonner: COLUMNS, rader: [['Cooked meat or poultry', 'kokt'], ['Raw turkey or chicken, whole', 'raa-hel']], etter: [KJOL(h)] },
    faq: [
      ['How long can the turkey sit on the table?', `Going by ${h.k('fsis-danger')}, no more than ${h.t('timer2')}, or ${h.t('timer1')} when it is above ${h.t('varm')}.`],
      ['Can you freeze turkey leftovers?', `${h.k('fs-chart')} lists a freezer time. See <a href="${FREEZE_ROOT}turkey-leftovers/">can you freeze turkey leftovers</a>.`],
    ],
    soster: F('turkey-leftovers', 'Can you freeze turkey leftovers?'),
    andre: [R('cooked-chicken', 'How long does cooked chicken last?'), R('pumpkin-pie', 'How long does pumpkin pie last?')],
  }),

  casseroles: (h) => ({
    ord: 'casseroles',
    title: LAST('a casserole'),
    h1: 'How long does casserole last in the fridge?',
    description: `Baked casseroles with eggs last ${h.t('egg')} in the fridge, and quiche lasts ${h.t('quiche')}, according to ${h.k('fs-chart')}. The general leftovers rule is ${h.t('lft')}.`,
    lead: `Casseroles with eggs last ${h.t('egg')} in the refrigerator after baking, according to ${h.k('fs-chart')}. Quiche with filling lasts ${h.t('quiche')}.`,
    kilder: [
      `${h.k('fs-chart')} lists casseroles that contain eggs, and quiche, with times counted from after baking.`,
      `For other casseroles, ${h.k('fsis-leftovers')} gives the leftovers rule: ${h.t('lft')} in the refrigerator.`,
      REHEAT(h),
      TWO(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fs-chart', intro: CHART(h), kolonner: COLUMNS, rader: [['Casseroles with eggs, after baking', 'egg'], ['Quiche with filling, after baking', 'quiche'], ['Leftovers in general', 'lft']] },
    faq: [
      ['Does every casserole follow the egg rule?', `The chart line is for casseroles with eggs. For other casseroles, use the leftovers time of ${h.t('lft')} from ${h.k('fsis-leftovers')}.`],
      ['Can you freeze casserole?', `${h.k('fs-chart')} lists a freezer time. See <a href="${FREEZE_ROOT}casseroles/">can you freeze casserole</a>.`],
    ],
    soster: F('casseroles', 'Can you freeze casserole?'),
    andre: [R('leftovers', 'How long do leftovers last?')],
  }),

  'egg-salad': (h) => ({
    ord: 'egg salad and deli salads',
    title: 'How long does egg salad last in the fridge?',
    h1: 'How long do egg salad, chicken salad, and tuna salad last in the fridge?',
    description: `Egg, chicken, ham, tuna, and macaroni salads last ${h.t('salat')} in the fridge, according to ${h.k('fs-chart')}. The same chart says they do not freeze well.`,
    lead: `Egg salad lasts ${h.t('salat')} in the refrigerator, according to ${h.k('fs-chart')}. One line covers egg, chicken, ham, tuna, and macaroni salads.`,
    kilder: [
      `${h.k('fda-lagring')} says to store refrigerated foods in covered containers or sealed storage bags.`,
      `${h.k('fsis-leftovers')} says cold perishable food, such as chicken salad, should be kept at ${h.t('kjol')} or below.`,
      TWO(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fs-chart', intro: CHART(h), kolonner: COLUMNS, rader: [['Egg, chicken, ham, tuna, and macaroni salads', 'salat']], etter: [KORT(h)] },
    faq: [
      ['Is store-bought salad different?', `The chart gives one line for these salads and does not separate store-bought from homemade.`],
      ['Can you freeze egg salad?', `The chart says these salads do not freeze well. See <a href="${FREEZE_ROOT}egg-salad/">can you freeze egg salad</a>.`],
    ],
    soster: F('egg-salad', 'Can you freeze egg salad?'),
    andre: [R('hard-boiled-eggs', 'How long do hard-boiled eggs last?'), R('cooked-pasta', 'How long does cooked pasta last?')],
  }),

  'pumpkin-pie': (h) => ({
    ord: 'pumpkin pie',
    title: LAST('pumpkin pie'),
    h1: 'How long does pumpkin pie last in the fridge?',
    description: `Baked pumpkin and pecan pies last ${h.t('pumpkin')} in the fridge, and custard and chiffon pies last ${h.t('custard')}, according to ${h.k('fs-chart')}.`,
    lead: `A baked pumpkin or pecan pie lasts ${h.t('pumpkin')} in the refrigerator, according to ${h.k('fs-chart')}. Custard and chiffon pies are listed at ${h.t('custard')}.`,
    kilder: [
      `${h.k('fs-chart')} counts these times from after baking.`,
      `${h.k('fda-lagring')} says to store refrigerated foods in covered containers or sealed storage bags.`,
      TWO(h),
      KJOL(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fs-chart', intro: CHART(h), kolonner: COLUMNS, rader: [['Pumpkin or pecan pie, after baking', 'pumpkin'], ['Custard and chiffon pie, after baking', 'custard']] },
    faq: [
      ['Does pumpkin pie need to be refrigerated?', `${h.k('fs-chart')} gives a refrigerator time for baked pumpkin pie, and ${h.k('fsis-danger')} says never to leave food out of refrigeration over ${h.t('timer2')}.`],
      ['Can you freeze pumpkin pie?', `${h.k('fs-chart')} lists a freezer time for pumpkin and pecan pie, and says custard and chiffon pies cannot be frozen. See <a href="${FREEZE_ROOT}pumpkin-pie/">can you freeze pumpkin pie</a>.`],
    ],
    soster: F('pumpkin-pie', 'Can you freeze pumpkin pie?'),
    andre: [R('turkey-leftovers', 'How long do turkey leftovers last?')],
  }),
};

// What each page adds to the overview table: [label, field].
const OVERSIKT = {
  egg: [['Raw eggs in the shell', 'skall'], ['Raw egg whites and yolks', 'hviter']],
  'kokte-egg': [['Hard-boiled eggs', 'hardkokt']],
  rester: [['Leftovers', 'lft']],
  'cooked-chicken': [['Cooked chicken', 'kokt']],
  'raw-chicken': [['Raw chicken, whole', 'hel']],
  'ground-beef': [['Ground beef', 'deig']],
  steak: [['Steak', 'steak']],
  'cooked-rice': [['Cooked rice (leftovers rule)', 'lft']],
  'cooked-pasta': [['Cooked pasta (leftovers rule)', 'lft'], ['Macaroni salad', 'salat']],
  soup: [['Soup and stew', 'suppe']],
  pizza: [['Pizza', 'pizza']],
  bacon: [['Bacon', 'bacon'], ['Sausage, raw', 'raa-polse']],
  'deli-meat': [['Deli meat, opened', 'apnet'], ['Deli meat, unopened', 'uapnet']],
  'hot-dogs': [['Hot dogs, opened', 'apnet'], ['Hot dogs, unopened', 'uapnet']],
  ham: [['Ham, cooked, whole', 'hel'], ['Ham, cooked, sliced', 'skiver']],
  salmon: [['Salmon', 'fet']],
  skalldyr: [['Shrimp', 'reker'], ['Crab meat', 'krabbe']],
  'turkey-leftovers': [['Turkey leftovers', 'kokt']],
  casseroles: [['Casserole with eggs', 'egg'], ['Quiche', 'quiche']],
  'egg-salad': [['Egg, chicken, or tuna salad', 'salat']],
  'pumpkin-pie': [['Pumpkin or pecan pie', 'pumpkin']],
};

export function nav({ data, rader, sti, h, p, esc }) {
  const forste = h(rader[0]);
  const rester = rader.find((r) => r.id === 'rester');
  const rest = h(rester);
  const radene = rader.flatMap((r) => {
    const x = h(r);
    return (OVERSIKT[r.id] ?? []).map(([etikett, felt]) => `<tr><td><a href="${sti(r)}">${esc(etikett)}</a></td><td>${x.t(felt)}</td><td>${x.k(r.tall[felt]?.kilde ?? r.tall[`${felt}-min`].kilde)}</td></tr>`);
  }).join('');
  return {
    title: 'How long does food last in the fridge? Chart with sources',
    h1: 'How long does food last in the fridge?',
    description: 'How long do chicken, rice, ground beef, eggs, leftovers, and more last in the fridge? Times from FoodSafety.gov, USDA, and FDA, with the source on every number.',
    lead: `Keep the fridge at ${forste.t('kjol')} or below. The federal chart on this page is written for that temperature. Every time below comes from a named source.`,
    rik: [
      `<h2>What the federal sources say</h2>${p([
        `${forste.k('fs-chart')} writes its refrigerator times for a fridge at ${forste.t('kjol')} or below.`,
        `${rest.k('fsis-leftovers')} says leftovers can be kept in the refrigerator for ${rest.t('lft')}.`,
        `${rest.k('fsis-danger')} says never to leave food out of refrigeration over ${rest.t('timer2')}, or ${rest.t('timer1')} when the temperature is above ${rest.t('varm')}.`,
      ])}`,
      `<h2>Times for every food</h2><p>Pick a food for the full times, the rules behind them, and the sources. The source is in the last column.</p><div class="table-wrap" tabindex="0" role="region" aria-label="Fridge times"><table class="sprik"><thead><tr><th scope="col">Food</th><th scope="col">Time in the fridge</th><th scope="col">Source</th></tr></thead><tbody>${radene}</tbody></table></div>`,
      '<h2>Foods that are not here</h2><p>We only list a time when we found it on a federal source page. Milk, cheese, and bread are not on the chart, so they have no page. Rice and pasta have no line of their own either, so their pages show the leftovers rule and say so.</p>',
      '<div class="related"><h2>Related pages</h2><ul><li><a href="/en/can-you-freeze/">Can you freeze it? Freezer times for every food</a></li></ul></div>',
    ].join('\n'),
    faqTittel: 'Questions about fridge times',
    faq: [
      ['What temperature should a refrigerator be?', `${forste.k('fs-chart')} writes its refrigerator times for ${forste.t('kjol')} or below, and ${forste.k('fda-lagring')} says the same.`],
      ['How long can food sit out before it goes in the fridge?', `${rest.k('fsis-danger')} says never more than ${rest.t('timer2')}, or ${rest.t('timer1')} when the temperature is above ${rest.t('varm')}.`],
    ],
  };
}

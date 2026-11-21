// Text for the family «frysing» (en-US): can you freeze it, and how long does it keep. Every sentence restates what a named source says.
// Numbers are never written here: h.t(field) reads them from data.en.json, where each one carries a quote from the source.
// FoodSafety.gov says its freezer times are for quality only. No advice of our own.
// Avoid cook/heat/store/list/week/plan words in h2 headings: scripts/app-bevis.mjs would match them to unrelated app cards.

const FRIDGE_ROOT = '/en/how-long-does-it-last/';
const FREEZE_ROOT = '/en/can-you-freeze/';
const R = (slug, text) => [`${FRIDGE_ROOT}${slug}/`, text];
const F = (slug, text) => [`${FREEZE_ROOT}${slug}/`, text];

const FREEZER = (h) => `${h.k('fs-chart')} writes its freezer times for a freezer at ${h.t('fryser')} or below.`;
const QUALITY = (h) => `${h.k('fs-chart')} says its freezer guidelines are for quality only, and that frozen foods stored continuously at ${h.t('fryser')} or below can be kept indefinitely.`;
const SAFE = (h) => `${h.k('fsis-freezing')} says food stored constantly at ${h.t('trygg')} will always be safe, and that only the quality suffers with lengthy freezer storage.`;
const BURN = (h) => `${h.k('fsis-freezing')} says freezer burn does not make food unsafe, merely dry in spots.`;
const WRAPMEAT = (h) => `${h.k('fsis-freezing')} says it is safe to freeze meat or poultry in its original packaging, but that this wrap is permeable to air, so quality may diminish over time. For long storage it advises an overwrap.`;
const TIGHT = (h) => `${h.k('fda-lagring')} says leftovers should be stored in tight containers.`;
const THAW = (h) => `${h.k('fsis-leftovers')} names three safe ways to thaw leftovers: in the refrigerator, in cold water, and in the microwave. After thawing, the food should be used within ${h.t('tint')} or can be refrozen.`;
const COLS = ['Food', 'Time in the freezer'];
const TIMES = 'Freezer times';
const CHART = (h) => `${h.k('fs-chart')} lists these times for the freezer:`;
const CAN = (what) => `Can you freeze ${what}?`;

export const TEKST = {
  egg: (h) => ({
    ord: 'freezing eggs',
    title: 'Can you freeze eggs? Raw eggs, whites, and yolks',
    h1: 'Can you freeze eggs?',
    description: `Yes, but not in the shell. Raw egg whites keep ${h.t('hviter')} in the freezer, according to ${h.k('fs-chart')}. Beat yolks and whites together first.`,
    lead: `Yes, but not in the shell. ${h.k('fs-chart')} says not to freeze raw eggs in the shell: beat the yolks and whites together, then freeze. Raw egg whites keep ${h.t('hviter')}.`,
    kilder: [
      `The same chart notes that yolks do not freeze well. It lists raw egg whites and yolks together at ${h.t('hviter')} in the freezer.`,
      SAFE(h),
      FREEZER(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fs-chart', intro: CHART(h), kolonner: COLS, rader: [['Raw eggs in the shell', { tekst: 'Do not freeze in the shell' }], ['Raw egg whites', 'hviter']], etter: [QUALITY(h)] },
    faq: [
      ['Can you freeze hard-boiled eggs?', `${h.k('fs-chart')} says no: hard-cooked eggs are marked "do not freeze." See <a href="${FREEZE_ROOT}hard-boiled-eggs/">can you freeze hard-boiled eggs</a>.`],
      ['What if an egg froze by accident in the shell?', `${h.k('fs-chart')} says to keep it frozen, then thaw it in the refrigerator, and to use it immediately after thawing. It also says to toss any frozen egg with a broken shell.`],
    ],
    soster: R('eggs', 'How long do eggs last in the fridge?'),
    andre: [F('hard-boiled-eggs', 'Can you freeze hard-boiled eggs?')],
  }),

  'kokte-egg': (h) => ({
    ord: 'freezing hard-boiled eggs',
    title: 'Can you freeze hard-boiled eggs?',
    h1: 'Can you freeze hard-boiled eggs?',
    description: `No. ${h.k('fs-chart')} marks hard-cooked eggs "do not freeze." They last ${h.t('kjoleskap')} in the fridge instead.`,
    lead: `No. ${h.k('fs-chart')} marks hard-cooked eggs "do not freeze." What the chart gives is the fridge time: ${h.t('kjoleskap')}.`,
    kilder: [
      `The chart row for hard-cooked eggs has a refrigerator time and the words "Do not freeze" in the freezer column.`,
      `${h.k('fsis-eggs')} says hard-cooked eggs should be refrigerated within two hours of cooking and used within a week.`,
      FREEZER(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fs-chart', intro: CHART(h), kolonner: ['Food', 'Time in the freezer', 'Time in the fridge'], rader: [['Hard-cooked eggs', { tekst: 'Do not freeze' }, 'kjoleskap']] },
    faq: [
      ['What can you freeze instead?', `${h.k('fs-chart')} lists raw egg whites for the freezer. See <a href="${FREEZE_ROOT}eggs/">can you freeze eggs</a>.`],
    ],
    soster: R('hard-boiled-eggs', 'How long do hard-boiled eggs last in the fridge?'),
    andre: [F('eggs', 'Can you freeze eggs?'), F('egg-salad', 'Can you freeze egg salad?'), ['/en/cooking-times/hard-boiled-eggs/', 'How long to boil eggs']],
  }),

  'cooked-chicken': (h) => ({
    ord: 'freezing chicken',
    title: CAN('cooked chicken') + ' How long it keeps',
    h1: 'Can you freeze cooked chicken?',
    description: `Yes. Cooked meat or poultry keeps ${h.t('kokt')} in the freezer, according to ${h.k('fs-chart')}. Chicken nuggets and patties keep ${h.t('nuggets')}.`,
    lead: `Yes. Cooked chicken keeps ${h.t('kokt')} in the freezer for best quality, according to ${h.k('fs-chart')}. ${h.k('fsis-leftovers')} gives leftovers ${h.t('lftfryst')}.`,
    kilder: [
      `The two sources give different ranges. ${h.k('fs-chart')} lists cooked meat or poultry at ${h.t('kokt')}, and ${h.k('fsis-leftovers')} says leftovers can be frozen for ${h.t('lftfryst')}.`,
      THAW(h),
      TIGHT(h),
      SAFE(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fs-chart', intro: CHART(h), kolonner: COLS, rader: [['Cooked meat or poultry', 'kokt'], ['Leftovers, per USDA FSIS', 'lftfryst'], ['Chicken nuggets or patties', 'nuggets']], etter: [QUALITY(h)] },
    faq: [
      ['Can you freeze raw chicken?', `Yes. See <a href="${FREEZE_ROOT}raw-chicken/">can you freeze raw chicken</a>.`],
      ['How long can thawed chicken stay in the fridge?', `${h.k('fsis-leftovers')} says leftovers should be used within ${h.t('tint')} after thawing, or can be refrozen.`],
    ],
    soster: R('cooked-chicken', 'How long does cooked chicken last in the fridge?'),
    andre: [F('raw-chicken', 'Can you freeze raw chicken?'), F('turkey-leftovers', 'Can you freeze turkey leftovers?')],
  }),

  'raw-chicken': (h) => ({
    ord: 'freezing raw chicken',
    title: CAN('raw chicken') + ' Whole and in pieces',
    h1: 'Can you freeze raw chicken?',
    description: `Yes. A whole raw chicken keeps ${h.t('hel')} in the freezer and chicken pieces keep ${h.t('biter')}, according to ${h.k('fs-chart')}.`,
    lead: `Yes. ${h.k('fs-chart')} lists ${h.t('hel')} for a whole chicken or turkey and ${h.t('biter')} for pieces.`,
    kilder: [
      WRAPMEAT(h),
      `${h.k('fsis-freezing')} says freezing to ${h.t('trygg')} inactivates microbes such as bacteria, yeasts, and molds, but that once thawed they can become active again.`,
      SAFE(h),
      FREEZER(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fs-chart', intro: CHART(h), kolonner: COLS, rader: [['Chicken or turkey, whole', 'hel'], ['Chicken or turkey, pieces', 'biter']], etter: [QUALITY(h)] },
    faq: [
      ['Does freezing kill bacteria on raw chicken?', `${h.k('fsis-freezing')} says freezing inactivates microbes, and that they can become active again once the food thaws.`],
      ['Can you freeze cooked chicken?', `Yes. See <a href="${FREEZE_ROOT}cooked-chicken/">can you freeze cooked chicken</a>.`],
    ],
    soster: R('raw-chicken', 'How long does raw chicken last in the fridge?'),
    andre: [F('cooked-chicken', 'Can you freeze cooked chicken?'), F('ground-beef', 'Can you freeze ground beef?'), ['/en/cooking-times/chicken-breast/', 'How long to cook chicken breast']],
  }),

  'ground-beef': (h) => ({
    ord: 'freezing ground beef',
    title: CAN('ground beef') + ' How long it keeps',
    h1: 'Can you freeze ground beef?',
    description: `Yes. Ground beef and other ground meats keep ${h.t('deig')} in the freezer, according to ${h.k('fs-chart')}. What the USDA says about freezer burn and packaging.`,
    lead: `Yes. Ground beef keeps ${h.t('deig')} in the freezer for best quality, according to ${h.k('fs-chart')}. The line also covers ground turkey, chicken, other poultry, veal, pork, lamb, and mixtures.`,
    kilder: [
      WRAPMEAT(h),
      BURN(h),
      SAFE(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fs-chart', intro: CHART(h), kolonner: COLS, rader: [['Hamburger and ground meats, ground poultry', 'deig']], etter: [QUALITY(h)] },
    faq: [
      ['Is freezer-burned beef safe?', `${h.k('fsis-freezing')} says freezer burn does not make food unsafe, merely dry in spots.`],
      ['Do steaks keep longer than ground beef?', `The chart lists ${h.t('deig')} for ground meat and a longer range for steaks. See <a href="${FREEZE_ROOT}steak/">can you freeze steak</a>.`],
    ],
    soster: R('ground-beef', 'How long does ground beef last in the fridge?'),
    andre: [F('steak', 'Can you freeze steak?'), ['/en/internal-temperature/ground-beef/', 'Ground beef and burger temperature']],
  }),

  steak: (h) => ({
    ord: 'freezing steak',
    title: CAN('steak') + ' Steaks, chops, and roasts',
    h1: 'Can you freeze steak?',
    description: `Yes. Raw steaks, chops, and roasts keep ${h.t('steak')} in the freezer, according to ${h.k('fs-chart')}. The range is wide, so the chart does not give one number.`,
    lead: `Yes. Raw steaks, chops, and roasts keep ${h.t('steak')} in the freezer, according to ${h.k('fs-chart')}.`,
    kilder: [
      WRAPMEAT(h),
      BURN(h),
      QUALITY(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fs-chart', intro: CHART(h), kolonner: COLS, rader: [['Steaks', 'steak'], ['Chops', 'kotelett'], ['Roasts', 'stek']], etter: [FREEZER(h)] },
    faq: [
      ['Why is the range so wide?', `The chart gives one range for the three cuts and does not explain it. It does say its freezer guidelines are for quality only.`],
      ['Can you freeze ground beef?', `Yes, with a shorter time. See <a href="${FREEZE_ROOT}ground-beef/">can you freeze ground beef</a>.`],
    ],
    soster: R('steak', 'How long does steak last in the fridge?'),
    andre: [F('ham', 'Can you freeze ham?'), ['/en/internal-temperature/steak/', 'Steak internal temperature']],
  }),

  bacon: (h) => ({
    ord: 'freezing bacon',
    title: CAN('bacon') + ' Bacon and sausage',
    h1: 'Can you freeze bacon?',
    description: `Yes. Bacon keeps ${h.t('bacon')} in the freezer, and raw sausage keeps ${h.t('raa-polse')}, according to ${h.k('fs-chart')}.`,
    lead: `Yes. Bacon keeps ${h.t('bacon')} in the freezer for best quality, according to ${h.k('fs-chart')}. Raw and fully cooked sausage keep ${h.t('raa-polse')}.`,
    kilder: [
      `${h.k('fs-chart')} puts bacon and sausage in one block. Raw sausage from chicken, turkey, pork, or beef keeps ${h.t('raa-polse')}, and so does fully cooked sausage.`,
      WRAPMEAT(h),
      SAFE(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fs-chart', intro: CHART(h), kolonner: COLS, rader: [['Bacon', 'bacon'], ['Sausage, raw', 'raa-polse'], ['Sausage, fully cooked', 'kokt-polse']], etter: [QUALITY(h)] },
    faq: [
      ['Does bacon keep as long in the freezer as in the fridge?', `No. ${h.k('fs-chart')} lists ${h.t('bacon')} for the freezer and a shorter time in the fridge. See <a href="${FRIDGE_ROOT}bacon/">how long bacon lasts in the fridge</a>.`],
    ],
    soster: R('bacon', 'How long does bacon last in the fridge?'),
    andre: [F('hot-dogs', 'Can you freeze hot dogs?'), F('deli-meat', 'Can you freeze deli meat?')],
  }),

  'hot-dogs': (h) => ({
    ord: 'freezing hot dogs',
    title: CAN('hot dogs') + ' Opened and unopened packages',
    h1: 'Can you freeze hot dogs?',
    description: `Yes. Hot dogs keep ${h.t('apnet')} in the freezer, opened or unopened, according to ${h.k('fs-chart')}.`,
    lead: `Yes. Hot dogs keep ${h.t('apnet')} in the freezer, whether the package is open or sealed, according to ${h.k('fs-chart')}.`,
    kilder: [
      `${h.k('fs-chart')} gives the same freezer time for an opened package and an unopened package. The fridge times differ.`,
      WRAPMEAT(h),
      BURN(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fs-chart', intro: CHART(h), kolonner: COLS, rader: [['Hot dogs, opened package', 'apnet'], ['Hot dogs, unopened package', 'uapnet']], etter: [QUALITY(h)] },
    faq: [
      ['Does it matter whether the package was opened?', `Not for the freezer time. ${h.k('fs-chart')} gives ${h.t('apnet')} for both. See <a href="${FRIDGE_ROOT}hot-dogs/">the fridge times for hot dogs</a>.`],
    ],
    soster: R('hot-dogs', 'How long do hot dogs last in the fridge?'),
    andre: [F('bacon', 'Can you freeze bacon?'), F('deli-meat', 'Can you freeze deli meat?')],
  }),

  'deli-meat': (h) => ({
    ord: 'freezing deli meat',
    title: CAN('deli meat') + ' Lunch meat in the freezer',
    h1: 'Can you freeze deli meat?',
    description: `Yes. Luncheon meat keeps ${h.t('apnet')} in the freezer, opened or unopened, according to ${h.k('fs-chart')}.`,
    lead: `Yes. Luncheon meat keeps ${h.t('apnet')} in the freezer, according to ${h.k('fs-chart')}, whether it is deli sliced, opened, or in an unopened package.`,
    kilder: [
      `${h.k('fs-chart')} lists luncheon meat with the same freezer time for an opened package, deli-sliced meat, and an unopened package.`,
      BURN(h),
      `${h.k('fsis-freezing')} advises freezing items you will not use quickly sooner rather than later.`,
    ],
    tabell: { tittel: TIMES, kilde: 'fs-chart', intro: CHART(h), kolonner: COLS, rader: [['Luncheon meat, opened or deli sliced', 'apnet'], ['Luncheon meat, unopened package', 'uapnet']], etter: [QUALITY(h)] },
    faq: [
      ['Is the fridge time shorter?', `Yes, by a lot. See <a href="${FRIDGE_ROOT}deli-meat/">how long deli meat lasts in the fridge</a>.`],
    ],
    soster: R('deli-meat', 'How long does deli meat last in the fridge?'),
    andre: [F('hot-dogs', 'Can you freeze hot dogs?'), F('ham', 'Can you freeze ham?')],
  }),

  ham: (h) => ({
    ord: 'freezing ham',
    title: CAN('ham') + ' Fresh and cooked ham',
    h1: 'Can you freeze ham?',
    description: `Yes. Fresh uncooked ham keeps ${h.t('fersk')} in the freezer, and cooked store-wrapped ham keeps ${h.t('hel')}, according to ${h.k('fs-chart')}.`,
    lead: `Yes. ${h.k('fs-chart')} lists a freezer time for each kind of ham. Fresh uncooked ham keeps ${h.t('fersk')}, cured ham to cook before eating keeps ${h.t('kuret')}, and cooked store-wrapped ham keeps ${h.t('hel')}.`,
    kilder: [
      `The chart gives cooked store-wrapped ham, whole or sliced, ${h.t('hel')}. Cured, cook-before-eating ham that has not been cooked gets ${h.t('kuret')}.`,
      WRAPMEAT(h),
      SAFE(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fs-chart', intro: CHART(h), kolonner: COLS, rader: [['Fresh, uncured, uncooked ham', 'fersk'], ['Cured, cook-before-eating, uncooked ham', 'kuret'], ['Cooked ham, store-wrapped, whole', 'hel'], ['Cooked ham, store-wrapped, slices, half, or spiral cut', 'skiver']], etter: [QUALITY(h)] },
    faq: [
      ['Can you freeze a spiral-cut ham?', `${h.k('fs-chart')} lists cooked store-wrapped slices, half, and spiral cut at ${h.t('skiver')}.`],
    ],
    soster: R('ham', 'How long does ham last in the fridge?'),
    andre: [F('turkey-leftovers', 'Can you freeze turkey leftovers?'), F('steak', 'Can you freeze steak?'), ['/en/cooking-times/ham/', 'How long to cook a ham']],
  }),

  rester: (h) => ({
    ord: 'freezing leftovers',
    title: CAN('leftovers') + ' How long they keep',
    h1: 'Can you freeze leftovers?',
    description: `Yes. Leftovers can be frozen for ${h.t('lftfryst')}, says ${h.k('fsis-leftovers')}. How to thaw them safely, and what to do with food that was already frozen.`,
    lead: `Yes. Leftovers can be frozen for ${h.t('lftfryst')}, says ${h.k('fsis-leftovers')}. Frozen leftovers are safe indefinitely, but they can lose moisture and flavor.`,
    kilder: [
      `${h.k('fsis-leftovers')} says that although frozen leftovers are safe indefinitely, they can lose moisture and flavor when kept in the freezer longer.`,
      THAW(h),
      `${h.k('fsis-leftovers')} says it is safe to refreeze any food left after reheating previously frozen leftovers to ${h.t('refrys')}.`,
      TIGHT(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fsis-leftovers', intro: `${h.k('fsis-leftovers')} and ${h.k('fs-chart')} give these times:`, kolonner: COLS, rader: [['Leftovers, per USDA FSIS', 'lftfryst'], ['Cooked meat or poultry, per the chart', 'kokt-kjott']], etter: [QUALITY(h)] },
    faq: [
      ['Can you refreeze thawed leftovers?', `${h.k('fsis-leftovers')} says leftovers thawed in the refrigerator can be refrozen, and that food thawed in the microwave can be refrozen after heating it to a safe temperature.`],
      ['Can you reheat frozen leftovers without thawing?', `${h.k('fsis-leftovers')} says it is safe, in a saucepan or microwave for soup or stew, or in the oven or microwave for casseroles. It takes longer than reheating thawed food.`],
    ],
    soster: R('leftovers', 'How long do leftovers last in the fridge?'),
    andre: [F('cooked-rice', 'Can you freeze cooked rice?'), F('soup', 'Can you freeze soup?')],
  }),

  'cooked-rice': (h) => ({
    ord: 'freezing rice',
    title: 'Can you freeze cooked rice? How long it keeps',
    h1: 'Can you freeze cooked rice?',
    description: `The federal sources do not list rice on its own. Leftovers in general can be frozen for ${h.t('lftfryst')}, says ${h.k('fsis-leftovers')}.`,
    lead: `The ${h.k('fs-chart')} chart does not list rice by name. For leftovers in general, ${h.k('fsis-leftovers')} says they can be frozen for ${h.t('lftfryst')}.`,
    kilder: [
      `Rice falls under the leftovers rule: ${h.k('fsis-leftovers')} says leftovers can be frozen for ${h.t('lftfryst')}.`,
      THAW(h),
      TIGHT(h),
      SAFE(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fsis-leftovers', intro: `${h.k('fsis-leftovers')} gives one time for leftovers, with no separate line for rice:`, kolonner: COLS, rader: [['Leftovers, including cooked rice', 'lftfryst']], etter: [QUALITY(h)] },
    faq: [
      ['Is there a special rule for freezing rice?', `Not on the ${h.k('fs-chart')} chart or in ${h.k('fsis-leftovers')}. They speak of leftovers in general.`],
      ['How long can rice stay in the fridge first?', `The leftovers rule says ${h.t('tint')} after thawing. For the fridge before freezing, see <a href="${FRIDGE_ROOT}cooked-rice/">how long cooked rice lasts</a>.`],
    ],
    soster: R('cooked-rice', 'How long does cooked rice last in the fridge?'),
    andre: [F('cooked-pasta', 'Can you freeze cooked pasta?'), F('leftovers', 'Can you freeze leftovers?')],
  }),

  'cooked-pasta': (h) => ({
    ord: 'freezing pasta',
    title: 'Can you freeze cooked pasta? And macaroni salad?',
    h1: 'Can you freeze cooked pasta?',
    description: `Plain pasta follows the leftovers rule: ${h.t('lftfryst')} in the freezer, says ${h.k('fsis-leftovers')}. ${h.k('fs-chart')} says macaroni salad does not freeze well.`,
    lead: `Cooked pasta is not on the chart, so the leftovers rule applies: ${h.t('lftfryst')} in the freezer, says ${h.k('fsis-leftovers')}. Macaroni salad is listed, and it "does not freeze well."`,
    kilder: [
      `${h.k('fsis-leftovers')} says leftovers can be frozen for ${h.t('lftfryst')}.`,
      `${h.k('fs-chart')} names macaroni salad together with egg, chicken, ham, and tuna salads, and says they do not freeze well.`,
      THAW(h),
      TIGHT(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fsis-leftovers', intro: `${h.k('fsis-leftovers')} and ${h.k('fs-chart')} give these answers:`, kolonner: COLS, rader: [['Leftovers, including cooked pasta', 'lftfryst'], ['Macaroni salad', { tekst: 'Does not freeze well' }]], etter: [QUALITY(h)] },
    faq: [
      ['Why does the chart say pasta salad does not freeze well?', `It gives no reason. It lists macaroni salad with egg, chicken, ham, and tuna salads, all marked "does not freeze well," and a fridge time of ${h.t('salat')}.`],
    ],
    soster: R('cooked-pasta', 'How long does cooked pasta last in the fridge?'),
    andre: [F('cooked-rice', 'Can you freeze cooked rice?'), F('egg-salad', 'Can you freeze egg salad?')],
  }),

  soup: (h) => ({
    ord: 'freezing soup',
    title: CAN('soup') + ' Soups and stews',
    h1: 'Can you freeze soup?',
    description: `Yes. Soups and stews with vegetables or meat keep ${h.t('suppe')} in the freezer, according to ${h.k('fs-chart')}.`,
    lead: `Yes. Soups and stews with vegetables or meat keep ${h.t('suppe')} in the freezer, according to ${h.k('fs-chart')}.`,
    kilder: [
      `${h.k('fsis-leftovers')} uses soup as its example for cooling food: divide a big pot into smaller containers so it cools quickly.`,
      `${h.k('fsis-leftovers')} says you can reheat frozen soup or stew without thawing, in a saucepan or the microwave.`,
      TIGHT(h),
      SAFE(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fs-chart', intro: CHART(h), kolonner: COLS, rader: [['Soups and stews, vegetable or meat added', 'suppe']], etter: [QUALITY(h)] },
    faq: [
      ['Can you put hot soup straight in the freezer?', `${h.k('fsis-leftovers')} says a big pot of soup takes a long time to cool, and advises dividing it into smaller containers so it cools quickly.`],
    ],
    soster: R('soup', 'How long does soup last in the fridge?'),
    andre: [F('leftovers', 'Can you freeze leftovers?'), F('casseroles', 'Can you freeze casserole?')],
  }),

  pizza: (h) => ({
    ord: 'freezing pizza',
    title: CAN('leftover pizza') + ' How long it keeps',
    h1: 'Can you freeze pizza?',
    description: `Yes. Leftover pizza keeps ${h.t('pizza')} in the freezer, according to ${h.k('fs-chart')}, which lists pizza by name.`,
    lead: `Yes. Leftover pizza keeps ${h.t('pizza')} in the freezer, according to ${h.k('fs-chart')}.`,
    kilder: [
      `${h.k('fs-chart')} lists pizza under leftovers, with a fridge time and a freezer time.`,
      THAW(h),
      `${h.k('fsis-leftovers')} says it is safe to reheat frozen leftovers without thawing, in the oven or microwave for casseroles and combination meals.`,
      TIGHT(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fs-chart', intro: CHART(h), kolonner: COLS, rader: [['Pizza', 'pizza']], etter: [QUALITY(h)] },
    faq: [
      ['How long does pizza last in the fridge instead?', `See <a href="${FRIDGE_ROOT}pizza/">how long pizza lasts in the fridge</a>.`],
    ],
    soster: R('pizza', 'How long does pizza last in the fridge?'),
    andre: [F('leftovers', 'Can you freeze leftovers?')],
  }),

  salmon: (h) => ({
    ord: 'freezing salmon',
    title: CAN('salmon') + ' Fatty fish in the freezer',
    h1: 'Can you freeze salmon?',
    description: `Yes. Salmon and other fatty fish keep ${h.t('fet')} in the freezer, according to ${h.k('fs-chart')}.`,
    lead: `Yes. Salmon keeps ${h.t('fet')} in the freezer, according to ${h.k('fs-chart')}. The chart files salmon under fatty fish, with bluefish, catfish, mackerel, mullet, and tuna.`,
    kilder: [
      `${h.k('fs-chart')} splits fin fish into fatty and lean fish. Lean fish such as cod, flounder, haddock, halibut, and sole have their own, longer freezer times on the chart.`,
      BURN(h),
      SAFE(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fs-chart', intro: CHART(h), kolonner: COLS, rader: [['Fatty fish: bluefish, catfish, mackerel, mullet, salmon, tuna', 'fet']], etter: [QUALITY(h)] },
    faq: [
      ['How long does salmon last in the fridge?', `See <a href="${FRIDGE_ROOT}salmon/">how long salmon lasts in the fridge</a>.`],
    ],
    soster: R('salmon', 'How long does salmon last in the fridge?'),
    andre: [F('shrimp', 'Can you freeze shrimp and shellfish?'), ['/en/internal-temperature/salmon/', 'What temperature is salmon done?']],
  }),

  skalldyr: (h) => ({
    ord: 'freezing shrimp and shellfish',
    title: CAN('shrimp') + ' Shrimp and shellfish',
    h1: 'Can you freeze shrimp and shellfish?',
    description: `Yes, shrimp and crayfish keep ${h.t('reker')} in the freezer, according to ${h.k('fs-chart')}. Crab meat keeps ${h.t('krabbe')}, and shucked shellfish ${h.t('skjell')}.`,
    lead: `Yes. Shrimp and crayfish keep ${h.t('reker')} in the freezer, according to ${h.k('fs-chart')}. The chart also lists fresh crab meat at ${h.t('krabbe')}.`,
    kilder: [
      `${h.k('fs-chart')} says shucked clams, mussels, oysters, and scallops keep ${h.t('skjell')} in the freezer. For live crab, lobster, clams, mussels, oysters, and scallops it says freezing is not recommended.`,
      BURN(h),
      SAFE(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fs-chart', intro: CHART(h), kolonner: COLS, rader: [['Shrimp and crayfish', 'reker'], ['Fresh crab meat', 'krabbe'], ['Shucked clams, mussels, oysters, and scallops', 'skjell']], etter: [QUALITY(h)] },
    faq: [
      ['Can you freeze live shellfish?', `${h.k('fs-chart')} says freezing is not recommended for live crab, lobster, clams, mussels, oysters, and scallops.`],
    ],
    soster: R('shrimp', 'How long do shrimp last in the fridge?'),
    andre: [F('salmon', 'Can you freeze salmon?')],
  }),

  'turkey-leftovers': (h) => ({
    ord: 'freezing turkey',
    title: CAN('Thanksgiving turkey leftovers') + ' How long they keep',
    h1: 'Can you freeze turkey leftovers?',
    description: `Yes. Cooked turkey keeps ${h.t('kokt')} in the freezer, according to ${h.k('fs-chart')}. ${h.k('fsis-leftovers')} gives leftovers ${h.t('lftfryst')}.`,
    lead: `Yes. Cooked turkey keeps ${h.t('kokt')} in the freezer, according to ${h.k('fs-chart')}. ${h.k('fsis-leftovers')} gives leftovers ${h.t('lftfryst')}.`,
    kilder: [
      `A raw whole turkey keeps ${h.t('raa-hel')} in the freezer, according to ${h.k('fs-chart')}. That is a different line from cooked turkey.`,
      THAW(h),
      `${h.k('fsis-thaw')} lists three ways to thaw a turkey: in the refrigerator, in cold water, and in the microwave oven.`,
      SAFE(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fs-chart', intro: `${h.k('fs-chart')} and ${h.k('fsis-leftovers')} give these times:`, kolonner: COLS, rader: [['Cooked meat or poultry', 'kokt'], ['Leftovers, per USDA FSIS', 'lftfryst'], ['Raw turkey or chicken, whole', 'raa-hel']], etter: [QUALITY(h)] },
    faq: [
      ['How long can turkey stay in the fridge before freezing?', `See <a href="${FRIDGE_ROOT}turkey-leftovers/">how long turkey leftovers last in the fridge</a>.`],
    ],
    soster: R('turkey-leftovers', 'How long do turkey leftovers last in the fridge?'),
    andre: [F('cooked-chicken', 'Can you freeze cooked chicken?'), F('pumpkin-pie', 'Can you freeze pumpkin pie?'), ['/en/cooking-times/thaw-turkey/', 'How long to thaw a turkey'], ['/en/internal-temperature/turkey/', 'Turkey internal temperature']],
  }),

  casseroles: (h) => ({
    ord: 'freezing casseroles',
    title: CAN('casserole') + ' How long it keeps',
    h1: 'Can you freeze casserole?',
    description: `Yes. Baked casseroles with eggs keep ${h.t('egg')} in the freezer, and quiche keeps ${h.t('quiche')}, according to ${h.k('fs-chart')}.`,
    lead: `Yes. Casseroles with eggs keep ${h.t('egg')} in the freezer after baking, according to ${h.k('fs-chart')}. Quiche with filling keeps ${h.t('quiche')}.`,
    kilder: [
      `${h.k('fs-chart')} counts the freezer time from after baking. For other casseroles, ${h.k('fsis-leftovers')} says leftovers can be frozen for ${h.t('lftfryst')}.`,
      `${h.k('fsis-leftovers')} says it is safe to reheat frozen casseroles and combination meals in the oven or microwave without thawing, though it takes longer.`,
      TIGHT(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fs-chart', intro: CHART(h), kolonner: COLS, rader: [['Casseroles with eggs, after baking', 'egg'], ['Quiche with filling, after baking', 'quiche'], ['Leftovers in general', 'lftfryst']], etter: [QUALITY(h)] },
    faq: [
      ['How long does casserole last in the fridge first?', `See <a href="${FRIDGE_ROOT}casseroles/">how long casserole lasts in the fridge</a>.`],
    ],
    soster: R('casseroles', 'How long does casserole last in the fridge?'),
    andre: [F('soup', 'Can you freeze soup?'), F('pumpkin-pie', 'Can you freeze pumpkin pie?')],
  }),

  'egg-salad': (h) => ({
    ord: 'freezing egg salad',
    title: CAN('egg salad') + ' And chicken or tuna salad',
    h1: 'Can you freeze egg salad?',
    description: `No. ${h.k('fs-chart')} says egg, chicken, ham, tuna, and macaroni salads do not freeze well. They last ${h.t('salat')} in the fridge.`,
    lead: `No. ${h.k('fs-chart')} says egg, chicken, ham, tuna, and macaroni salads "do not freeze well." What the chart does give is the fridge time: ${h.t('salat')}.`,
    kilder: [
      `The chart row covers all five salads at once, with ${h.t('salat')} in the refrigerator column and "Does not freeze well" in the freezer column.`,
      `${h.k('fsis-eggs')} says hard-cooked eggs are marked "do not freeze" on its chart too.`,
      FREEZER(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fs-chart', intro: CHART(h), kolonner: ['Food', 'Time in the freezer', 'Time in the fridge'], rader: [['Egg, chicken, ham, tuna, and macaroni salads', { tekst: 'Does not freeze well' }, 'salat']] },
    faq: [
      ['Can you freeze hard-boiled eggs for egg salad?', `No. ${h.k('fs-chart')} marks hard-cooked eggs "do not freeze." See <a href="${FREEZE_ROOT}hard-boiled-eggs/">can you freeze hard-boiled eggs</a>.`],
    ],
    soster: R('egg-salad', 'How long does egg salad last in the fridge?'),
    andre: [F('hard-boiled-eggs', 'Can you freeze hard-boiled eggs?'), F('cooked-pasta', 'Can you freeze cooked pasta?')],
  }),

  'pumpkin-pie': (h) => ({
    ord: 'freezing pumpkin pie',
    title: CAN('pumpkin pie') + ' Pumpkin, pecan, and custard pies',
    h1: 'Can you freeze pumpkin pie?',
    description: `Yes. Baked pumpkin and pecan pies keep ${h.t('pumpkin')} in the freezer, according to ${h.k('fs-chart')}. Custard and chiffon pies do not freeze.`,
    lead: `Yes. A baked pumpkin or pecan pie keeps ${h.t('pumpkin')} in the freezer, according to ${h.k('fs-chart')}. Custard and chiffon pies are marked "do not freeze."`,
    kilder: [
      `${h.k('fs-chart')} counts the time from after baking, and lists the pies in a block with eggs and egg dishes.`,
      FREEZER(h),
      SAFE(h),
    ],
    tabell: { tittel: TIMES, kilde: 'fs-chart', intro: CHART(h), kolonner: COLS, rader: [['Pumpkin or pecan pie, after baking', 'pumpkin'], ['Custard and chiffon pie, after baking', { tekst: 'Do not freeze' }]], etter: [QUALITY(h)] },
    faq: [
      ['How long does pumpkin pie last in the fridge?', `See <a href="${FRIDGE_ROOT}pumpkin-pie/">how long pumpkin pie lasts in the fridge</a>. Custard and chiffon pies last ${h.t('custard')} there.`],
    ],
    soster: R('pumpkin-pie', 'How long does pumpkin pie last in the fridge?'),
    andre: [F('turkey-leftovers', 'Can you freeze turkey leftovers?')],
  }),
};

const OVERSIKT = {
  egg: [['Raw egg whites', 'hviter']],
  'kokte-egg': [],
  'cooked-chicken': [['Cooked chicken', 'kokt']],
  'raw-chicken': [['Raw chicken, whole', 'hel'], ['Raw chicken, pieces', 'biter']],
  'ground-beef': [['Ground beef', 'deig']],
  steak: [['Steak, chops, roasts', 'steak']],
  bacon: [['Bacon', 'bacon'], ['Sausage', 'raa-polse']],
  'hot-dogs': [['Hot dogs', 'apnet']],
  'deli-meat': [['Deli meat', 'apnet']],
  ham: [['Ham, fresh, uncooked', 'fersk'], ['Ham, cooked', 'hel']],
  rester: [['Leftovers', 'lftfryst']],
  'cooked-rice': [['Cooked rice (leftovers rule)', 'lftfryst']],
  'cooked-pasta': [['Cooked pasta (leftovers rule)', 'lftfryst']],
  soup: [['Soup and stew', 'suppe']],
  pizza: [['Pizza', 'pizza']],
  salmon: [['Salmon', 'fet']],
  skalldyr: [['Shrimp', 'reker'], ['Crab meat', 'krabbe']],
  'turkey-leftovers': [['Cooked turkey', 'kokt']],
  casseroles: [['Casserole with eggs', 'egg'], ['Quiche', 'quiche']],
  'pumpkin-pie': [['Pumpkin or pecan pie', 'pumpkin']],
};
const IKKE = [
  ['hard-boiled-eggs', 'Hard-boiled eggs'],
  ['egg-salad', 'Egg, chicken, ham, tuna, and macaroni salads'],
  ['eggs', 'Raw eggs in the shell'],
  ['pumpkin-pie', 'Custard and chiffon pies'],
];

export function nav({ data, rader, sti, h, p, esc }) {
  const forste = h(rader[0]);
  const rester = h(rader.find((r) => r.id === 'rester'));
  const radene = rader.flatMap((r) => {
    const x = h(r);
    return (OVERSIKT[r.id] ?? []).map(([etikett, felt]) => `<tr><td><a href="${sti(r)}">${esc(etikett)}</a></td><td>${x.t(felt)}</td><td>${x.k(r.tall[felt]?.kilde ?? r.tall[`${felt}-min`].kilde)}</td></tr>`);
  }).join('');
  const nei = rader.filter((r) => IKKE.some(([slug]) => slug === r.slug));
  return {
    title: 'Can you freeze it? Freezer times for every food, with sources',
    h1: 'Can you freeze it? How long food keeps in the freezer',
    description: 'Can you freeze chicken, rice, ground beef, eggs, leftovers, and more? Freezer times from FoodSafety.gov and USDA, and the foods the chart says do not freeze.',
    lead: `Freezer times are about quality, not safety. ${forste.k('fs-chart')} says frozen foods stored continuously at ${forste.t('fryser')} or below can be kept indefinitely.`,
    rik: [
      `<h2>What the federal sources say</h2>${p([
        QUALITY(forste),
        SAFE(forste),
        `${rester.k('fsis-leftovers')} says leftovers can be frozen for ${rester.t('lftfryst')}.`,
      ])}`,
      `<h2>Times for every food</h2><p>Pick a food for the full times, the rules behind them, and the sources. The source is in the last column.</p><div class="table-wrap" tabindex="0" role="region" aria-label="Freezer times"><table class="sprik"><thead><tr><th scope="col">Food</th><th scope="col">Time in the freezer</th><th scope="col">Source</th></tr></thead><tbody>${radene}</tbody></table></div>`,
      `<h2>Foods that do not freeze well</h2><p>The chart marks these as foods that do not freeze, or do not freeze well:</p><ul>${nei.map((r) => `<li><a href="${sti(r)}">${esc(IKKE.find(([slug]) => slug === r.slug)[1])}</a></li>`).join('')}</ul>`,
      '<h2>Foods that are not here</h2><p>We only list a time when we found it on a federal source page. Milk, cheese, and bread are not on the chart, so they have no page.</p>',
      '<div class="related"><h2>Related pages</h2><ul><li><a href="/en/how-long-does-it-last/">How long does it last in the fridge? Times for every food</a></li></ul></div>',
    ].join('\n'),
    faqTittel: 'Questions about freezer times',
    faq: [
      ['What temperature should the freezer be?', `${forste.k('fs-chart')} writes its freezer times for ${forste.t('fryser')} or below.`],
      ['Is frozen food still safe after the time runs out?', `${forste.k('fs-chart')} says the freezer guidelines are for quality only. ${forste.k('fsis-freezing')} says food stored constantly at ${forste.t('trygg')} will always be safe, and only the quality suffers.`],
    ],
  };
}

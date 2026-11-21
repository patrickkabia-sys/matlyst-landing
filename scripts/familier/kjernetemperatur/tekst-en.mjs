// Text for the family «kjernetemperatur» (en-US): the safe internal temperature of meat, poultry, fish, and egg dishes.
// Every sentence restates what a named source says. Numbers are never written here: h.t(field) reads them from data.en.json,
// where each one carries a quote from the source, and h.s(id) quotes a sentence word for word. scripts/familier/steketid/kildekontroll.mjs
// checks that every quote still stands on the source page. Sources: FoodSafety.gov (fs-chart), USDA FSIS (fsis-*). No advice of our own.
// Doneness names like rare and medium are not here: no federal source we read names them. The FSIS minimum always comes first.
// Avoid cook/heat/store/list/week/plan words in h2 headings that should not get an app card: scripts/app-bevis.mjs matches them.

const K = '/en/internal-temperature/';
const S = '/en/cooking-times/';
const FRIDGE = '/en/how-long-does-it-last/';
const FREEZE = '/en/can-you-freeze/';
const kk = (slug, text) => [`${K}${slug}/`, text];
const ss = (slug, text) => [`${S}${slug}/`, text];
const rr = (slug, text) => [`${FRIDGE}${slug}/`, text];
const ff = (slug, text) => [`${FREEZE}${slug}/`, text];
const MEASURE = ['thermometer', 'How to use a food thermometer'];
const TERMO = kk(...MEASURE);

export const TEKST = {
  kylling: (h, { tabell, p }) => ({
    ord: 'chicken',
    title: 'Chicken internal temperature: when is chicken done?',
    h1: 'What internal temperature is chicken done?',
    description: `${h.k('fs-chart')} and ${h.k('fsis-chart')} both give ${h.t('min')} for chicken: whole bird, breasts, legs, thighs, and wings. Where to put the thermometer, and why color is not a test.`,
    lead: `Chicken is safe at ${h.t('min')}, measured with a food thermometer. That is the minimum from ${h.k('fs-chart')} for a whole bird, breasts, legs, thighs, and wings. ${h.k('fsis-chart')} gives the same number.`,
    blokker: [
      ['The number to reach', p([
        `${h.k('fs-chart')} lists ${h.t('min')} for chicken, turkey, and other poultry. The row covers a whole bird, breasts, legs, thighs, wings, ground poultry, giblets, sausage, and stuffing inside poultry.`,
        `${h.k('fsis-chart')} lists ${h.t('fsis')} for all poultry in its own chart. Two federal pages, one number.`,
        h.s('higher'),
      ])],
      ['Where to put the thermometer', p([h.s('spots')])],
      ['Pink meat and clear juices', p([`${h.k('fsis-chicken')} is direct about color: ${h.s('pink')}`, h.s('pinkwhy')])],
      ['The numbers in one table', tabell({
        tittel: 'Chicken temperatures',
        kolonner: ['What', 'Temperature'],
        rader: [['Minimum for chicken pieces and a whole bird', 'min'], ['Leftover chicken, when you reheat it', 'varm']],
      }) + h.note('fs-chart') + h.note('fsis-chicken')],
      ['Two more facts from FSIS', p([
        `${h.k('fsis-chicken')} says bacteria multiply rapidly at temperatures between ${h.t('fare-min')} and ${h.t('fare-maks')}. That is the range raw chicken must not sit in for long.`,
        `Chicken can go in the oven or on the stove from frozen. The same page says the cooking time may be ${h.t('fryst', { ca: true })} longer. The temperature to reach does not change.`,
        h.s('wash'),
      ])],
    ],
    faq: [
      ['Is chicken safe if it is a little pink?', `${h.k('fsis-chicken')} says the pink color in safely cooked chicken may be due to the hemoglobin in tissues, which can form a heat-stable color. Use a thermometer and look for ${h.t('min')}.`],
      ['What temperature should reheated chicken reach?', `${h.k('fsis-chicken')} says ready-prepared chicken can be eaten within ${h.t('dager')}, either cold or reheated to ${h.t('varm')}.`],
      ['Should I rinse chicken before cooking it?', h.s('wash')],
    ],
    soster: ss('whole-chicken', 'How long to cook a whole chicken'),
    andre: [ss('chicken-breast', 'How long to cook chicken breast'), rr('cooked-chicken', 'How long does cooked chicken last in the fridge?'), TERMO],
  }),

  kalkun: (h, { tabell, p }) => ({
    ord: 'turkey',
    title: 'Turkey internal temperature: when is it done?',
    h1: 'What internal temperature should a turkey reach?',
    description: `A whole turkey is done at ${h.t('min')}, says ${h.k('fs-chart')}. Where to put the thermometer, what to do about stuffing, how long to let it rest, and why turkey can stay pink.`,
    lead: `A turkey is done when the thickest part reads ${h.t('min')}. ${h.k('fs-chart')} and ${h.k('fsis-chart')} agree, and the FSIS Thanksgiving guide repeats it (${h.kp('fsis-thanks')}). Stuffing that cooks inside the bird has to reach the same number.`,
    blokker: [
      ['The number, from three federal pages', p([
        `${h.k('fs-chart')} lists ${h.t('min')} for a whole bird, breasts, legs, thighs, wings, ground poultry, and stuffing inside poultry.`,
        `${h.k('fsis-chart')} lists ${h.t('fsis')} for all poultry.`,
        h.s('any'),
      ])],
      ['Three spots to check', p([h.s('areas'), h.s('bone')])],
      ['Stuffing', p([
        `${h.k('fsis-turkey-cook')} says the turkey and the center of the stuffing must both reach ${h.t('stuffing')}.`,
        h.s('optimum'),
      ])],
      ['Resting the turkey', p([`${h.k('fsis-turkey-cook')} says to let the bird stand ${h.t('hvile')} before removing the stuffing and carving it, so the juices can set.`])],
      ['A pink turkey', p([`${h.k('fsis-pink')} says turkey can remain pink even after cooking to a safe minimum internal temperature of ${h.t('pinkt')}.`, h.s('smoked'), h.s('safe')])],
      ['Turkey numbers in one table', tabell({
        tittel: 'Turkey temperatures',
        kolonner: ['What', 'Number'],
        rader: [['Minimum internal temperature, whole bird', 'min'], ['Minimum for stuffing', 'stuffing'], ['Rest before carving', 'hvile'], ['Danger zone for raw or cooked turkey', 'fare']],
      }) + h.note('fs-chart') + h.note('fsis-turkey-cook') + h.note('fsis-thanks')],
    ],
    faq: [
      ['Where do I put the thermometer in a turkey?', `${h.k('fsis-thanks')} says to measure in three areas: the thickest part of the breast, the innermost part of the wing, and the innermost part of the thigh.`],
      ['Is it safe to eat turkey that is still pink?', `${h.k('fsis-pink')} says turkey can remain pink even after cooking to a safe minimum internal temperature of ${h.t('pinkt')}. Only a thermometer can tell you.`],
      ['Does the stuffing need to reach 165°F too?', `Yes. ${h.k('fsis-turkey-cook')} says the center of the stuffing must reach ${h.t('stuffing')}.`],
      ['How long should a turkey rest?', `${h.k('fsis-turkey-cook')} says to let the bird stand ${h.t('hvile')} before carving.`],
    ],
    soster: ss('turkey', 'How long to cook a turkey, by weight'),
    andre: [ss('thaw-turkey', 'How long to thaw a turkey'), ss('turkey-breast', 'How long to cook a turkey breast'), rr('turkey-leftovers', 'How long do turkey leftovers last?'), TERMO],
  }),

  kjottdeig: (h, { tabell, p }) => ({
    ord: 'ground beef',
    title: 'Ground beef and burger temperature: when is it done?',
    h1: 'What internal temperature is a hamburger done?',
    description: `Ground beef is safe at ${h.t('min')}, says ${h.k('fs-chart')}. Why a brown burger is not proof, and why FSIS says to measure through the patty.`,
    lead: `Cook ground beef and hamburgers to ${h.t('min')}. ${h.k('fs-chart')} gives that number for ground meat and sausage, and ${h.k('fsis-ground')} repeats it for ground beef.`,
    blokker: [
      ['The number to reach', p([
        `${h.k('fs-chart')} lists ${h.t('min')} for ground meat and sausage.`,
        `${h.k('fsis-chart')} lists ${h.t('fsis')} for ground meats.`,
        `${h.k('fsis-ground')} says to cook ground beef to a safe minimum internal temperature of ${h.t('ground')}, as measured with a food thermometer.`,
      ])],
      ['Why color is not enough', p([
        `${h.k('fsis-colorgb')} reports on research into patties. ${h.s('color')}`,
        `It adds that some patties looked well-done at internal temperatures as low as ${h.t('brun')}.`,
        h.s('only'),
      ])],
      ['A warning about hamburgers', p([`${h.k('fsis-done')} reports that ${h.s('fire')}`])],
      ["Don't cook it partway", p([`${h.k('fsis-ground')} asks the question on its page: ${h.s('partial')}`])],
      ['At a glance', tabell({
        tittel: 'Ground beef temperatures',
        kolonner: ['What', 'Temperature'],
        rader: [['Ground beef, hamburgers, ground meat', 'min'], ['Lowest reading at which a patty already looked well-done', 'brun']],
      }) + h.note('fs-chart') + h.note('fsis-colorgb')],
    ],
    faq: [
      ['What temperature should a hamburger reach?', `${h.t('min')}, according to ${h.k('fs-chart')} and ${h.k('fsis-ground')}.`],
      ['Can I trust the color of a burger?', `No. ${h.s('color')}`],
      ['Is ground beef different from a steak?', `Yes. ${h.k('fs-chart')} lists ${h.t('min')} for ground meat, while steaks, roasts, and chops are listed at a lower number with a rest time. See <a href="${K}steak/">steak</a>.`],
    ],
    soster: kk('steak', 'Steak internal temperature'),
    andre: [kk('meatloaf', 'Meatloaf internal temperature'), kk('ground-turkey', 'Ground turkey internal temperature'), rr('ground-beef', 'How long does ground beef last in the fridge?'), TERMO],
  }),

  kalkundeig: (h, { tabell, p }) => ({
    ord: 'ground turkey',
    title: 'Ground turkey internal temperature',
    h1: 'What temperature is ground turkey done?',
    description: `Ground turkey is safe at ${h.t('min')}, not the ${h.t('beef')} that ground beef gets. The numbers from ${h.k('fs-chart')}, ${h.k('fsis-chart')}, and ${h.k('fsis-done')}.`,
    lead: `Ground turkey needs ${h.t('min')}. Ground beef needs a lower number, ${h.t('beef')}. ${h.k('fs-chart')} puts ground poultry in the poultry row, not the ground meat row.`,
    blokker: [
      ['Poultry rules apply', p([
        `${h.k('fs-chart')} lists ${h.t('min')} for chicken, turkey, and other poultry, and the row includes ground poultry.`,
        `${h.k('fsis-chart')} has a separate line, ground poultry at ${h.t('fsis')}.`,
        `${h.k('fsis-done')} says it again: cook ground poultry to a safe minimum internal temperature of ${h.t('done')}, measured with a food thermometer.`,
      ])],
      ['Turkey burgers and meatballs', p([`The charts name ground poultry, so turkey burgers, turkey meatballs, and turkey meatloaf fall under the same number. ${h.s('sausage')}`])],
      ['Color tells you little', p([h.s('color')])],
      ['Ground turkey and ground beef side by side', tabell({
        tittel: 'Ground meat temperatures',
        kolonner: ['Product', 'Minimum temperature'],
        rader: [['Ground turkey and other ground poultry', 'min'], ['Ground beef, pork, and lamb', 'beef']],
      }) + h.note('fs-chart')],
    ],
    faq: [
      ['What temperature should ground turkey reach?', `${h.t('min')}, says ${h.k('fs-chart')}.`],
      ['Is ground turkey the same as ground beef?', `No. ${h.k('fs-chart')} lists ${h.t('beef')} for ground meat and ${h.t('min')} for ground poultry.`],
      ['Can I judge turkey burgers by color?', h.s('color')],
    ],
    soster: kk('ground-beef', 'Ground beef and burger temperature'),
    andre: [kk('turkey', 'Turkey internal temperature'), kk('meatloaf', 'Meatloaf internal temperature'), TERMO],
  }),

  kjottkake: (h, { tabell, p }) => ({
    ord: 'meatloaf',
    title: 'Meatloaf internal temperature: when is it done?',
    h1: 'What internal temperature is meatloaf done?',
    description: `Meatloaf made with beef, pork, or lamb is done at ${h.t('beef')}. A turkey or chicken meatloaf needs ${h.t('poultry')}. The sources are ${h.k('fsis-beef')}, ${h.k('fsis-pork')}, and ${h.k('fsis-lamb')}.`,
    lead: `Meatloaf made with ground beef, pork, or lamb is done at ${h.t('beef')}. If it is made with ground turkey or chicken, the number is ${h.t('poultry')}.`,
    blokker: [
      ['What each federal page says', p([
        `${h.k('fsis-beef')} recommends cooking hamburgers and ground beef mixtures such as meat loaf to ${h.t('beef')}.`,
        `${h.k('fsis-pork')} gives ${h.t('pork')} for ground pork mixtures such as meat loaf.`,
        `${h.k('fsis-lamb')} gives ${h.t('lamb')} for ground lamb mixtures such as meat loaf.`,
        `${h.k('fs-chart')} lists ${h.t('poultry')} for ground poultry.`,
      ])],
      ['Why the top can fool you', p([
        `${h.k('fsis-done')} writes about combination dishes: ${h.s('guess')}`,
        h.s('combo'),
      ])],
      ['The numbers in one table', tabell({
        tittel: 'Meatloaf by meat',
        kolonner: ['Meatloaf made with', 'Temperature'],
        rader: [['Beef', 'beef'], ['Pork', 'pork'], ['Lamb', 'lamb'], ['Turkey or chicken', 'poultry']],
      }) + h.note('fsis-beef') + h.note('fs-chart')],
    ],
    faq: [
      ['What temperature is a beef meatloaf done?', `${h.t('beef')}, according to ${h.k('fsis-beef')}.`],
      ['What temperature is a turkey meatloaf done?', `${h.t('poultry')}, because ${h.k('fs-chart')} lists ground poultry at that number.`],
      ['What if I mix beef and pork?', `${h.k('fsis-beef')} and ${h.k('fsis-pork')} both give ${h.t('beef')} for their ground meat, so a beef and pork loaf is covered by the same number. We found no federal page for a blend with poultry.`],
    ],
    soster: kk('ground-beef', 'Ground beef and burger temperature'),
    andre: [kk('ground-turkey', 'Ground turkey internal temperature'), kk('leftovers', 'Reheating temperature for leftovers and casseroles'), TERMO],
  }),

  biff: (h, { tabell, p }) => ({
    ord: 'steak',
    title: 'Steak internal temperature: the safe minimum',
    h1: 'What internal temperature is steak done?',
    description: `${h.k('fs-chart')} and ${h.k('fsis-chart')} list ${h.t('min')} plus a rest of ${h.t('hvile')} for beef steaks, roasts, and chops. What each source says about going higher.`,
    lead: `The federal minimum for a beef steak is ${h.t('min')}, followed by a rest of at least ${h.t('hvile')}. ${h.k('fs-chart')} and ${h.k('fsis-chart')} agree. Names like rare and medium are not in these sources.`,
    blokker: [
      ['The minimum', p([
        `${h.k('fs-chart')} lists ${h.t('min')} for steaks, roasts, and chops of beef, bison, veal, goat, and lamb, with a rest time of ${h.t('hvile')}.`,
        `${h.k('fsis-chart')} lists ${h.t('fsis')} and a rest of at least ${h.t('hvile')} for beef, pork, veal, and lamb steaks, chops, and roasts.`,
        `${h.k('fsis-beef')} words it for beef: ${h.s('rest')}`,
      ])],
      ['Going higher is your call', p([h.s('higher'), `That is the only guidance the federal sources give on doneness beyond the minimum. We do not list temperatures for rare, medium rare, or medium, because we did not find them on a federal or university extension page.`])],
      ['A pink center', p([h.s('pink')])],
      ['Grills and ovens vary', p([h.s('varies')])],
      ['Steak and ground beef are different', tabell({
        tittel: 'Beef temperatures',
        kolonner: ['Product', 'Minimum temperature'],
        rader: [['Steaks and roasts, then rest', 'min'], ['Ground beef and hamburgers', 'ground']],
      }) + h.note('fs-chart') + h.note('fsis-beef')],
    ],
    faq: [
      ['What temperature is a steak safe at?', `${h.t('min')} with a rest of ${h.t('hvile')}, per ${h.k('fs-chart')}.`],
      ['Is a medium rare steak safe?', `The federal sources give one minimum, ${h.t('min')}, and say consumers may choose to cook meat to higher temperatures for reasons of personal preference. They do not name doneness levels, so we cannot give a number for medium rare.`],
      ['Do I have to let a steak rest?', `${h.k('fs-chart')} lists a rest time of ${h.t('hvile')} for steaks, roasts, and chops.`],
    ],
    soster: kk('roast-beef', 'Roast beef internal temperature'),
    andre: [kk('ground-beef', 'Ground beef and burger temperature'), ss('roast-beef', 'How long to cook roast beef'), rr('steak', 'How long does steak last in the fridge?'), TERMO],
  }),

  roastbiff: (h, { tabell, p }) => ({
    ord: 'roast beef',
    title: 'Roast beef internal temperature: the safe minimum',
    h1: 'What internal temperature is a beef roast done?',
    description: `A raw beef roast is safe at ${h.t('min')} followed by a rest of ${h.t('hvile')}, says ${h.k('fs-chart')}. What FSIS adds about oven temperature and leaner beef.`,
    lead: `Cook a raw beef roast to ${h.t('min')} and rest it at least ${h.t('hvile')}. ${h.k('fsis-holiday')} words it for holiday roasts and says to have a thermometer on hand.`,
    blokker: [
      ['The minimum for roasts', p([
        `${h.k('fs-chart')} lists ${h.t('min')} for beef steaks, roasts, and chops, with a rest time of ${h.t('hvile')}.`,
        `${h.k('fsis-holiday')} says: ${h.s('rest')}`,
        `The same page words the beef rule this way: cook all raw beef and veal steaks, roasts, and chops to a minimum internal temperature of ${h.t('holiday')}, as measured with a food thermometer, before removing the meat from the heat source.`,
      ])],
      ['Use a thermometer on special roasts', p([h.s('tool'), h.s('lean')])],
      ['Oven temperature', p([`${h.k('fsis-holiday')} recommends ${h.t('ovn')} for roasting tender meats, to keep the meat tender and cut shrinkage. It also says USDA does not recommend an oven below ${h.t('lav')} for meat and poultry, because the food could stay in the danger zone too long.`])],
      ['The numbers in one table', tabell({
        tittel: 'Beef roast numbers',
        kolonner: ['What', 'Number'],
        rader: [['Minimum internal temperature', 'min'], ['Rest before carving', 'hvile'], ['Oven temperature FSIS gives for tender roasts', 'ovn']],
      }) + h.note('fs-chart') + h.note('fsis-holiday')],
    ],
    faq: [
      ['What internal temperature is a prime rib done?', `${h.k('fsis-holiday')} lists a rib roast under beef, so the federal minimum is ${h.t('min')} with a rest of ${h.t('hvile')}. Higher is a matter of personal preference.`],
      ['Does roast beef need to rest?', h.s('rest')],
      ['How long does a roast take?', `It depends on the cut and weight. FSIS gives minutes per pound on its own pages. See <a href="${S}roast-beef/">how long to cook roast beef</a>.`],
    ],
    soster: ss('roast-beef', 'How long to cook roast beef'),
    andre: [kk('steak', 'Steak internal temperature'), ss('brisket-and-pot-roast', 'How long to cook brisket and pot roast'), TERMO],
  }),

  svinestek: (h, { tabell, p }) => ({
    ord: 'pork',
    title: 'Pork internal temperature: chops, roasts, and ground',
    h1: 'What internal temperature is pork done?',
    description: `Pork chops, steaks, and roasts are safe at ${h.t('min')} plus a rest of ${h.t('hvile')}. Ground pork needs ${h.t('deig')}. Numbers from ${h.k('fs-chart')} and ${h.k('fsis-pork')}.`,
    lead: `Fresh pork chops, steaks, and roasts are done at ${h.t('min')}, then a rest of at least ${h.t('hvile')}. Ground pork is done at ${h.t('deig')}. Pork can still be pink at the safe number.`,
    blokker: [
      ['Chops, steaks, and roasts', p([
        `${h.k('fs-chart')} lists ${h.t('min')} for pork steaks, roasts, and chops, with a rest time of ${h.t('hvile')}.`,
        `${h.k('fsis-chart')} lists ${h.t('fsis')} for beef, pork, veal, and lamb steaks, chops, and roasts.`,
        h.s('higher'),
      ])],
      ['Ground pork and organ meats', p([`${h.k('fsis-pork')} recommends ${h.t('deig')} for ground pork patties and ground pork mixtures such as meat loaf. For organ and variety meats such as heart, kidney, liver, tongue, and chitterlings, it gives ${h.t('indre')}.`])],
      ['Pink pork', p([h.s('pink'), `${h.k('fsis-pork')} adds that if fresh pork has reached ${h.t('rosa')} throughout, even though it may still be pink in the center, it should be safe.`])],
      ['Why pork dries out', p([h.s('lean')])],
      ['After cooking', p([`${h.k('fsis-pork')} says to eat cooked pork within ${h.t('dager')}, either cold or reheated to ${h.t('varm')}.`])],
      ['The numbers in one table', tabell({
        tittel: 'Pork temperatures',
        kolonner: ['Pork product', 'Minimum temperature'],
        rader: [['Chops, steaks, roasts (then rest)', 'min'], ['Ground pork and meat loaf', 'deig'], ['Organ and variety meats', 'indre'], ['Cooked pork, when reheated', 'varm']],
      }) + h.note('fs-chart') + h.note('fsis-pork')],
    ],
    faq: [
      ['What temperature should pork chops reach?', `${h.t('min')} followed by a rest of ${h.t('hvile')}, according to ${h.k('fs-chart')}.`],
      ['Is pink pork safe?', `${h.k('fsis-pork')} says if fresh pork has reached ${h.t('rosa')} throughout, even though it may still be pink in the center, it should be safe.`],
      ['What about a pork tenderloin?', `${h.k('fsis-pork')} lists tenderloin in its pork roasting chart, under the heading that gives the ${h.t('pork')} rule for steaks, chops, and roasts. See <a href="${S}pork-roast/">how long to cook a pork roast</a>.`],
    ],
    soster: ss('pork-roast', 'How long to cook a pork roast'),
    andre: [kk('ham', 'Ham internal temperature'), kk('sausage', 'Sausage internal temperature'), TERMO],
  }),

  skinke: (h, { tabell, p }) => ({
    ord: 'ham',
    title: 'Ham internal temperature: raw, cooked, and reheated',
    h1: 'What internal temperature should a ham reach?',
    description: `A raw ham needs ${h.t('rå')} and a rest of ${h.t('hvile')}. A fully cooked ham from a USDA-inspected plant is reheated to ${h.t('anlegg')}. Numbers from ${h.k('fs-chart')} and ${h.k('fsis-hams')}.`,
    lead: `It depends on the ham. A raw or cook-before-eating ham needs ${h.t('rå')}. A fully cooked ham packaged in a USDA-inspected plant is reheated to ${h.t('anlegg')}. Other cooked hams are reheated to ${h.t('opp')}.`,
    blokker: [
      ['Two kinds of ham', p([h.s('two'), `${h.k('fsis-hams')} says cook-before-eating hams and fresh hams must reach ${h.t('rå')}, with a rest of ${h.t('hvile')}, before serving.`])],
      ['Reheating a cooked ham', p([
        `${h.k('fs-chart')} lists ${h.t('opp')} for precooked ham to reheat, with a note: reheat cooked hams packaged in USDA-inspected plants to ${h.t('anlegg')}.`,
        `${h.k('fsis-hams')} says the same, and adds that the oven should be no lower than ${h.t('ovn')}.`,
        `Leftover spiral-cut ham, or ham repackaged outside the plant, goes higher, to ${h.t('spiral')}.`,
      ])],
      ['Served cold', p([h.s('cold')])],
      ['The numbers in one table', tabell({
        tittel: 'Ham temperatures',
        kolonner: ['Type of ham', 'Temperature'],
        rader: [['Raw or cook-before-eating, then rest', 'rå'], ['Fully cooked, from a USDA-inspected plant, to reheat', 'anlegg'], ['Other cooked ham, to reheat', 'opp']],
      }) + h.note('fs-chart') + h.note('fsis-hams')],
    ],
    faq: [
      ['What temperature should a fully cooked ham reach?', `${h.k('fsis-hams')} says hams packaged in USDA-inspected plants should be heated to ${h.t('anlegg')}. Others are reheated to ${h.t('opp')}.`],
      ['What temperature is a raw ham done?', `${h.t('rå')} with a rest of ${h.t('hvile')}, according to ${h.k('fs-chart')}.`],
      ['Do I have to reheat a fully cooked ham?', h.s('cold')],
    ],
    soster: ss('ham', 'How long to cook a ham, by weight and type'),
    andre: [rr('ham', 'How long does ham last in the fridge?'), kk('pork', 'Pork internal temperature'), kk('leftovers', 'Reheating temperature for leftovers'), TERMO],
  }),

  lammelar: (h, { tabell, p }) => ({
    ord: 'lamb',
    title: 'Lamb internal temperature: chops, roasts, and ground',
    h1: 'What internal temperature is lamb done?',
    description: `Lamb steaks, chops, and roasts are done at ${h.t('lam')}, then a rest of ${h.t('hvile')}. Ground lamb needs ${h.t('deig')}. Numbers from ${h.k('fsis-lamb')} and ${h.k('fs-chart')}.`,
    lead: `Cook raw lamb steaks, chops, and roasts to ${h.t('lam')} and rest them at least ${h.t('hvile')}. Ground lamb is cooked to ${h.t('deig')}.`,
    blokker: [
      ['Steaks, chops, and roasts', p([
        `${h.k('fsis-lamb')} says: ${h.s('rest')}`,
        `${h.k('fs-chart')} lists ${h.t('min')} for beef, bison, veal, goat, and lamb steaks, roasts, and chops, with a rest time of ${h.t('hvile')}.`,
        `${h.k('fsis-chart')} lists ${h.t('fsis')} for beef, pork, veal, and lamb.`,
      ])],
      ['Ground lamb and organ meats', p([`${h.k('fsis-lamb')} recommends ${h.t('deig')} for lamb patties and ground lamb mixtures such as meat loaf. For organ and variety meats such as heart, kidney, liver, and tongue, it gives ${h.t('indre')}.`])],
      ['Cuts and the fell', p([h.s('leg'), h.s('fell')])],
      ['Ovens vary', p([h.s('vary')])],
      ['The numbers in one table', tabell({
        tittel: 'Lamb temperatures',
        kolonner: ['Lamb product', 'Minimum temperature'],
        rader: [['Steaks, chops, and roasts, then rest', 'lam'], ['Ground lamb and mixtures', 'deig'], ['Organ and variety meats', 'indre']],
      }) + h.note('fsis-lamb') + h.note('fs-chart')],
    ],
    faq: [
      ['What temperature is a leg of lamb done?', `${h.t('lam')} with a rest of at least ${h.t('hvile')}, according to ${h.k('fsis-lamb')}.`],
      ['Can lamb be pink in the middle?', `The federal sources set a minimum temperature, ${h.t('lam')}, not a color. Consumers may choose higher temperatures for personal preference, but the sources do not say what the center should look like.`],
      ['How long does a leg of lamb take?', `FSIS gives minutes per pound by cut. See <a href="${S}leg-of-lamb/">how long to cook a leg of lamb</a>.`],
    ],
    soster: ss('leg-of-lamb', 'How long to cook a leg of lamb'),
    andre: [kk('steak', 'Steak internal temperature'), kk('ground-beef', 'Ground beef and burger temperature'), TERMO],
  }),

  laks: (h, { tabell, p }) => ({
    ord: 'salmon',
    title: 'What temperature is salmon done? Fish internal temperature',
    h1: 'What temperature is salmon done?',
    description: `Salmon and other fish are done at ${h.t('min')}, or when the flesh is no longer translucent and separates easily with a fork. Shrimp, scallops, and clams, from ${h.k('fs-chart')}.`,
    lead: `Salmon is done at ${h.t('min')}. ${h.k('fs-chart')} also gives a visual option: cook until the flesh is no longer translucent and separates easily with a fork.`,
    blokker: [
      ['Fish', p([
        `${h.k('fs-chart')} lists whole fish and filets, such as salmon, tuna, tilapia, pollock, bass, cod, catfish, and trout, at ${h.t('min')}. It adds: ${h.s('fork')}`,
        `${h.k('fsis-chart')} lists ${h.t('fsis')} for fish and shellfish.`,
      ])],
      ['Shrimp, lobster, crab, and scallops', p([`${h.k('fs-chart')} gives no temperature here. ${h.s('shrimp')}`])],
      ['Clams, oysters, and mussels', p([h.s('clams'), `The rule is a sign, not a number.`])],
      ['The rules in one table', tabell({
        tittel: 'Seafood doneness',
        kolonner: ['Seafood', 'Rule'],
        rader: [['Fish, whole or filet', 'min'], ['Shrimp, lobster, crab, scallops', { tekst: 'Flesh is pearly or white, and opaque' }], ['Clams, oysters, mussels', { tekst: 'Shells open during cooking' }]],
      }) + h.note('fs-chart')],
    ],
    faq: [
      ['What internal temperature is salmon safe at?', `${h.t('min')}, or cook until the flesh is no longer translucent and separates easily with a fork, says ${h.k('fs-chart')}.`],
      ['How do I know shrimp is done?', h.s('shrimp')],
      ['Does the same number apply to tuna and cod?', `${h.k('fs-chart')} lists salmon, tuna, tilapia, pollock, bass, cod, catfish, and trout in one row at ${h.t('min')}.`],
    ],
    soster: rr('salmon', 'How long does salmon last in the fridge?'),
    andre: [ff('salmon', 'Can you freeze salmon?'), rr('shrimp', 'How long does shrimp last in the fridge?'), TERMO],
  }),

  egg: (h, { tabell, p }) => ({
    ord: 'egg dishes',
    title: 'Egg dish internal temperature: quiche, frittata, casseroles',
    h1: 'What internal temperature are egg dishes done?',
    description: `Egg dishes such as frittata and quiche are done at ${h.t('rett')}. Raw eggs cooked on their own should be firm. What ${h.k('fs-chart')} and ${h.k('fsis-eggs')} say.`,
    lead: `Cook egg dishes, such as a frittata or a quiche, to ${h.t('rett')}. For eggs cooked on their own, ${h.k('fs-chart')} says to cook until the yolk and the white are firm.`,
    blokker: [
      ['Egg dishes', p([
        `${h.k('fs-chart')} lists ${h.t('rett')} for egg dishes, such as frittata and quiche.`,
        `${h.k('fsis-chart')} lists ${h.t('fsis')} for eggs.`,
        `${h.k('fsis-eggs')} says to cook casseroles and other dishes containing eggs to a safe minimum internal temperature of ${h.t('gryte')}.`,
      ])],
      ['Eggs on their own', p([h.s('raw')])],
      ['Dishes with raw egg', p([`${h.k('fsis-eggs')} says: cook dishes containing raw eggs immediately, or refrigerate and cook within ${h.t('timer')}.`])],
      ['Meringue pies', p([`${h.k('fsis-eggs')} says meringue-topped pies should be safe if baked at ${h.t('marengs')} for about ${h.t('marengstid')}.`])],
      ['Hard-cooked eggs', p([h.s('ring')])],
      ['The numbers in one table', tabell({
        tittel: 'Egg temperatures',
        kolonner: ['Egg product', 'Number'],
        rader: [['Egg dishes (frittata, quiche)', 'rett'], ['Casseroles and dishes containing eggs', 'gryte'], ['Meringue pie, oven temperature', 'marengs'], ['Meringue pie, about', 'marengstid']],
      }) + h.note('fs-chart') + h.note('fsis-eggs')],
    ],
    faq: [
      ['What temperature is quiche done?', `${h.t('rett')}, says ${h.k('fs-chart')}, which lists quiche and frittata as examples of egg dishes.`],
      ['How do I know a fried egg is done?', h.s('raw')],
      ['How long can a raw egg dish wait before baking?', `${h.k('fsis-eggs')} says to cook it immediately, or refrigerate and cook within ${h.t('timer')}.`],
    ],
    soster: ss('hard-boiled-eggs', 'How long to boil eggs'),
    andre: [rr('eggs', 'How long do eggs last in the fridge?'), ff('eggs', 'Can you freeze eggs?'), rr('casseroles', 'How long do casseroles last in the fridge?')],
  }),

  rester: (h, { tabell, p }) => ({
    ord: 'leftovers',
    title: 'Reheating temperature for leftovers and casseroles',
    h1: 'What temperature should leftovers and casseroles reach?',
    description: `Leftovers and casseroles are reheated to ${h.t('rester')}, says ${h.k('fs-chart')}. Reheated ham and other cases, from ${h.k('fsis-chart')} and ${h.k('fsis-thanks')}.`,
    lead: `Reheat leftovers to ${h.t('rester')}. A casserole, with or without meat, also reaches ${h.t('gryte')}. ${h.k('fs-chart')} lists both numbers.`,
    blokker: [
      ['Two charts, one number', p([
        `${h.k('fs-chart')} lists ${h.t('rester')} for leftovers of any type, and ${h.t('gryte')} for casseroles, meat and meatless.`,
        `${h.k('fsis-chart')} lists ${h.t('fsis')} for leftovers and ${h.t('fsisgryte')} for casseroles.`,
        `${h.k('fsis-thanks')} says to reheat leftovers to ${h.t('thanks')} before you eat them.`,
      ])],
      ['Why casseroles get their own line', p([h.s('combo'), h.s('browned')])],
      ['Chicken and ham are special cases', p([
        `${h.k('fsis-chicken')} says ready-prepared chicken is eaten cold or reheated to ${h.t('kylling')}.`,
        `${h.k('fs-chart')} adds a note for ham: reheat cooked hams packaged in USDA-inspected plants to ${h.t('skinke')}. Other ham is reheated to ${h.t('rester')}.`,
      ])],
      ['The numbers in one table', tabell({
        tittel: 'Reheating temperatures',
        kolonner: ['Food', 'Reheat to'],
        rader: [['Leftovers, any type', 'rester'], ['Casseroles, meat and meatless', 'gryte'], ['Ham packaged in a USDA-inspected plant', 'skinke']],
      }) + h.note('fs-chart') + h.note('fsis-chart')],
    ],
    faq: [
      ['What temperature should I reheat leftovers to?', `${h.t('rester')}, according to ${h.k('fs-chart')} and ${h.k('fsis-chart')}.`],
      ['What temperature is a casserole done?', `${h.t('gryte')}, says ${h.k('fs-chart')}, for casseroles with or without meat.`],
      ['How long do leftovers keep in the fridge?', `See <a href="${FRIDGE}leftovers/">how long leftovers last</a> for the time limits from the same federal sources.`],
    ],
    soster: rr('leftovers', 'How long do leftovers last in the fridge?'),
    andre: [ff('leftovers', 'Can you freeze leftovers?'), rr('casseroles', 'How long do casseroles last?'), kk('ham', 'Ham internal temperature'), TERMO],
  }),

  polser: (h, { tabell, p }) => ({
    ord: 'sausage',
    title: 'Sausage internal temperature: pork, beef, and chicken',
    h1: 'What internal temperature is sausage done?',
    description: `Uncooked sausage made with beef, pork, lamb, or veal is done at ${h.t('kjott')}. Chicken and turkey sausage is done at ${h.t('fjar')}. From ${h.k('fsis-sausage')} and ${h.k('fs-chart')}.`,
    lead: `Sausage depends on the meat. Beef, pork, lamb, or veal sausage is cooked to ${h.t('kjott')}. Chicken or turkey sausage is cooked to ${h.t('fjar')}.`,
    blokker: [
      ['What FSIS says about sausage', p([
        `${h.k('fsis-sausage')} says that to prevent foodborne illness, uncooked sausages that contain ground beef, pork, lamb, or veal should be cooked to ${h.t('kjott')}. Uncooked sausages that contain ground turkey and chicken should be cooked to ${h.t('fjar')}.`,
      ])],
      ['What FoodSafety.gov says', p([`${h.k('fs-chart')} lists ground meat and sausage at ${h.t('chart')}. Its poultry row lists ${h.t('chartfjar')} and names sausage made from poultry in that row.`])],
      ['Cook-before-eating labels', p([`${h.k('fsis-sausage')} explains the label. When a sausage is partially cooked or looks cooked but still needs cooking for safety, FSIS requires extra labeling, with a statement such as "Cook before eating". Check the package before you assume a sausage is ready to eat.`])],
      ['The numbers in one table', tabell({
        tittel: 'Sausage temperatures',
        kolonner: ['Sausage made with', 'Temperature'],
        rader: [['Beef, pork, lamb, or veal', 'kjott'], ['Turkey or chicken', 'fjar']],
      }) + h.note('fsis-sausage') + h.note('fs-chart')],
    ],
    faq: [
      ['What temperature is pork sausage done?', `${h.t('kjott')}, according to ${h.k('fsis-sausage')}.`],
      ['What temperature is chicken sausage done?', `${h.t('fjar')}, according to ${h.k('fsis-sausage')}.`],
      ['Can I tell a sausage is done by its color?', `${h.k('fsis-done')} says appearance and color are not reliable indicators of safety or doneness. Use a thermometer.`],
    ],
    soster: kk('ground-beef', 'Ground beef and burger temperature'),
    andre: [kk('ground-turkey', 'Ground turkey internal temperature'), rr('bacon', 'How long does bacon last in the fridge?'), TERMO],
  }),

  termometer: (h, { tabell, p }) => ({
    ord: 'food thermometers',
    title: 'How to use a food thermometer: where to put it',
    h1: 'How do you use a food thermometer?',
    description: `Put the probe in the thickest part of the food, away from bone, fat, and gristle. Fast thermocouples read in ${h.t('fort')} to ${h.t('fort2')}. Advice from ${h.k('fsis-done')} and ${h.k('fsis-thermo')}.`,
    lead: `Put the thermometer in the thickest part of the food. Keep the tip away from bone, fat, and gristle. ${h.k('fsis-done')} says a thermometer is the only way to tell that harmful bacteria are destroyed.`,
    blokker: [
      ['Why use one', p([h.s('only'), `${h.k('fsis-done')} reports that ${h.t('hver')} of people consistently use a food thermometer.`])],
      ['Where it goes', p([h.s('thick'), h.s('tip')])],
      ['Types of thermometer', p([
        `${h.k('fsis-thermo')} describes the types. A thermocouple reads fastest: ${h.s('thin')}`,
        `It adds: ${h.s('thermocouple')} A thermistor takes roughly ${h.t('ti')} to register.`,
        `A liquid-filled thermometer is different. It stays in the food while cooking and should be inserted at least ${h.t('dyp')} deep in the thickest part, so it is not suited to thin foods.`,
      ])],
      ['Clean it', p([h.s('clean')])],
      ['The numbers to look for', tabell({
        tittel: 'Safe minimum temperatures',
        kolonner: ['Food', 'Minimum'],
        rader: [['Beef steaks, roasts, and chops (then rest)', 'kjott'], ['Ground meat and sausage', 'deig'], ['Poultry, whole or ground', 'fugl']],
      }) + h.note('fs-chart') + h.note('fsis-thermo')],
    ],
    faq: [
      ['Where do I put a thermometer in a chicken breast?', `${h.k('fsis-done')} says to insert it into the thickest part of the food, without touching bone, fat, or gristle. ${h.k('fsis-thermo')} says a thin probe can read thin foods such as hamburger patties, pork chops, and chicken breasts.`],
      ['How long does a thermocouple take to read?', `${h.k('fsis-thermo')} says within ${h.t('fort')} to ${h.t('fort2')}.`],
      ['Can I leave a thermometer in while cooking?', `It depends on the type. Liquid-filled thermometers are designed to remain in the food while it cooks. ${h.s('thermocouple')}`],
    ],
    soster: kk('chicken', 'Chicken internal temperature'),
    andre: [kk('turkey', 'Turkey internal temperature'), kk('steak', 'Steak internal temperature'), kk('ground-beef', 'Ground beef and burger temperature')],
  }),
};

// What each page adds to the overview table: [label, field].
const OVERSIKT = {
  kylling: [['Chicken', 'min']],
  kalkun: [['Turkey, whole bird', 'min']],
  kjottdeig: [['Ground beef and burgers', 'min']],
  kalkundeig: [['Ground turkey', 'min']],
  kjottkake: [['Meatloaf, beef or pork', 'beef']],
  biff: [['Steak', 'min']],
  roastbiff: [['Roast beef', 'min']],
  svinestek: [['Pork chops and roasts', 'min']],
  skinke: [['Ham, raw', 'rå'], ['Ham, fully cooked (reheat)', 'anlegg']],
  lammelar: [['Lamb', 'lam']],
  laks: [['Salmon and other fish', 'min']],
  egg: [['Egg dishes', 'rett']],
  rester: [['Leftovers', 'rester'], ['Casseroles', 'gryte']],
  polser: [['Sausage, beef, pork, or lamb', 'kjott'], ['Sausage, chicken or turkey', 'fjar']],
};

export function nav({ data, rader, sti, h, p, esc }) {
  const forste = h(rader.find((r) => r.id === 'kylling'));
  const radene = rader.flatMap((r) => {
    const x = h(r);
    return (OVERSIKT[r.id] ?? []).map(([etikett, felt]) => `<tr><td><a href="${sti(r)}">${esc(etikett)}</a></td><td>${x.t(felt)}</td><td>${x.k(r.tall[felt].kilde)}</td></tr>`);
  }).join('');
  const termo = rader.find((r) => r.id === 'termometer');
  return {
    title: 'Safe internal temperatures for meat, poultry, and fish',
    h1: 'Safe internal temperatures: chicken, turkey, beef, pork, and more',
    description: 'What internal temperature is chicken, turkey, steak, pork, ham, lamb, fish, and leftovers done? The federal minimums from FoodSafety.gov and USDA FSIS, with the source on every number.',
    lead: `The safe minimum for poultry is ${forste.t('min')}. Beef, pork, and lamb steaks, roasts, and chops are lower, with a rest. Pick a food for the full numbers, the rules behind them, and the sources.`,
    rik: [
      `<h2>What the federal sources say</h2>${p([
        `${forste.k('fs-chart')} says to always use a food thermometer to check whether meat has reached a safe minimum internal temperature, and that some meats also need rest time after cooking.`,
        `We list the federal minimum first on every page. Higher numbers for taste are your choice, and the sources say so.`,
      ])}`,
      `<h2>Minimum temperatures for every food</h2><p>Pick a food for the full page. The source is in the last column.</p><div class="table-wrap" tabindex="0" role="region" aria-label="Safe internal temperatures"><table class="sprik"><thead><tr><th scope="col">Food</th><th scope="col">Minimum temperature</th><th scope="col">Source</th></tr></thead><tbody>${radene}</tbody></table></div>`,
      `<h2>Foods and names that are not here</h2><p>We list a number only when we found it on a federal or university page. Steak doneness names such as rare and medium have no page of their own for that reason. ${termo ? `The <a href="${sti(termo)}">food thermometer page</a> covers where the probe goes.` : ''}</p>`,
      '<div class="related"><h2>Related pages</h2><ul><li><a href="/en/air-fryer/">Air fryer times and temperatures for common foods</a></li><li><a href="/en/cooking-times/">How long to cook it: times for turkey, ham, chicken, and more</a></li><li><a href="/en/how-long-does-it-last/">How long does food last in the fridge?</a></li></ul></div>',
    ].join('\n'),
    faqTittel: 'Questions about internal temperatures',
    faq: [
      ['Why use a food thermometer?', `${forste.k('fs-chart')} says to use one to check whether meat has reached a safe minimum internal temperature that is hot enough to kill the germs that cause food poisoning.`],
      ['What is the safe temperature for chicken and turkey?', `${forste.t('min')} for all poultry, according to ${forste.k('fs-chart')}.`],
    ],
  };
}

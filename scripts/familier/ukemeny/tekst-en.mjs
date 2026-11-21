// Text for the ukemeny family in US English (/en/weekly-meal-plans/). Written from the meaning, not translated from Norwegian.
// Numbers and quotes come from data.en.json (USDA FSIS); this file never writes a number itself.
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const and = (xs) => (xs.length > 2 ? `${xs.slice(0, -1).join(', ')}, and ${xs.at(-1)}` : xs.length === 2 ? `${xs[0]} and ${xs[1]}` : xs[0] ?? '');
const ul = (xs) => `<ul>${xs.map((x) => `<li>${x}</li>`).join('')}</ul>`;
const p = (...xs) => xs.map((x) => `<p>${x}</p>`).join('');
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const ONE = { days: 'day', months: 'month', hours: 'hour' };

export const T = {
  marked: 'en', rot: '/en/weekly-meal-plans/', lest: 'Accessed', anf: ['“', '”'],
  dato: (iso) => { const [a, m, d] = iso.split('-').map(Number); return `${MONTHS[m - 1]} ${d}, ${a}`; },
  tallNr: (v) => String(v),
  tallTekst: (x) => (x.enhet === '°F' ? `${x.verdi} °F` : `${x.verdi} ${x.verdi === 1 ? (ONE[x.enhet] ?? x.enhet) : x.enhet}`),
  kortNavn: (k) => (k.utgiver.startsWith('USDA') ? 'USDA FSIS' : k.utgiver),
  og: and,
  ord: ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven'],
  dagKort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  hjem: ['Home', '/en/'],
  eyebrowRot: 'Weekly meal plans',
  etikett: { hvorfor: 'Why this day', lagMer: 'Cook extra', rest: 'Uses leftovers', framgang: 'How to', oppskrift: 'Recipe' },
  oppskriftLenke: 'The recipe at Taste of Home',
  restLinje: (x) => `${cap(x.rest.hva)} from ${cap(x.rest.fra)}${x.rest.via === 'fryser' ? ', via the freezer' : ''}.${x.rest.iStedetFor ? ` Use it in place of ${x.rest.iStedetFor} in the recipe.` : ''}`,
  oversiktIntro: 'Days marked “leftovers” use something you cook extra earlier in the week. Below the table, each dinner has a note on why it’s on that day.',
  dagKolonne: 'Day', middagKolonne: 'Dinner', restMerke: 'leftovers',
  restKjede: (c, esc) => `<strong>${c.fra} to ${c.til}${c.via ? ', via the freezer' : ''}:</strong> ${esc(c.lagMer)} ${c.til} uses ${esc(c.hva)}.`,
  restRegler: 'Rules for the leftovers',
  hvorUke: 'this week', hvorNav: 'in our meal plans',
  regler: (h, hvor) => ul([
    `<strong>Cool food quickly.</strong> ${h.k('fsis-leftovers')} says leftovers must be refrigerated within ${h.t('kjol_tid')} of cooking, and to cool food rapidly. ${h.q('shallow')}`,
    `<strong>Keep the refrigerator at ${h.t('kjoleskap')} or below.</strong> ${h.k('fsis-leftovers')} gives ${h.t('kjoleskap')} or below as the safe refrigerator-storage temperature.`,
    `<strong>Leftovers keep ${h.t('rester_min').replace(' days', '')} to ${h.t('rester_maks')}.</strong> ${h.k('fsis-leftovers')} says leftovers can be kept in the refrigerator for ${h.t('rester_min').replace(' days', '')} to ${h.t('rester_maks')}. Leftovers ${hvor} are used within two days, or frozen.`,
    `<strong>Reheat to ${h.t('oppvarming')}.</strong> ${h.k('fsis-leftovers')} says to make sure leftovers reach ${h.t('oppvarming')}, measured with a food thermometer.`,
    `<strong>Freeze what you won’t eat soon.</strong> ${h.k('fsis-leftovers')} says leftovers can be frozen for ${h.t('fryser_min').replace(' months', '')} to ${h.t('fryser_maks')}.`,
    '<strong>No leftover rice or pasta.</strong> In our meal plans, rice and pasta are never saved for another day. They’re cooked fresh for each meal.',
  ]),
  listeIntro: 'The list has every item the seven recipes call for, grouped by the aisles in the store. Where a dinner uses leftovers, only what you need to buy on top of them is listed. The amounts are in the recipes. The days after each item show which dinners it is for. Buy fresh items for the end of the week closer to the day.',
  hjemmeFra: (basis) => `<strong>Check that you have:</strong> ${basis}. They aren’t on the list above.`,
  app: ({ egne, harEgne, lenker, over, gratis }) => p('Matlyst doesn’t make the meal plan for you, and the app doesn’t know what leftovers you have. What you get is a meal plan made of your own recipes, and one grocery list built from them. Here’s how to add the week:')
    + `<ol>
<li><strong>Save the recipes.</strong> Open each link above and share it with Matlyst, or paste the link into the app. Read more about <a href="/en/import-recipes/">importing recipes</a>.${harEgne ? ` There is no link for ${egne}. Type the steps above in as a recipe of your own.` : ''}</li>
<li><strong>Put them on the days.</strong> Open the <a href="/en/meal-plan-app/">meal plan</a> and put each recipe on the day it’s on here.</li>
<li><strong>Adjust the servings.</strong> Where the week says “cook extra,” raise the number of servings on that recipe before you shop.</li>
<li><strong>Add the week to the grocery list.</strong> Matlyst combines matching items into one line and groups the list by aisle (see the <a href="/en/shopping-list/">grocery list</a>). Before the items are added, you see the list and can uncheck what you get from the leftovers, such as the sauce in a dinner that uses the sauce from an earlier day.</li>
</ol>`
    + p(`<strong>Free or Pro:</strong> The meal plan and the grocery list are free. Importing from links is free for ${gratis} imports per calendar month, and this week has ${['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven'][lenker]} links${over ? '. On the free plan you can save the rest the next month, or type them in yourself' : ''}. With Matlyst Pro there is no such limit, and your household can share the meal plan and the grocery list.`),
  kildeIntro: (meny) => `${meny ? `The recipes are Taste of Home’s. We link to them and don’t reproduce them, and the links were opened ${meny.hentet}. The steps without a link are our own. ` : ''}The advice on leftovers, cooling, reheating, and freezing is from the USDA Food Safety and Inspection Service, the US federal agency for food safety.`,
  ingenTall: 'We list no prices, calories, or serving sizes, because we have no open source for them per dinner. Found a mistake, or has a link stopped working? Write to <a href="mailto:hei@matlyst-app.no">hei@matlyst-app.no</a>.',
  felleSpm: (h) => [
    ['How long do leftovers keep in the refrigerator?', `${h.k('fsis-leftovers')} says leftovers can be kept in the refrigerator for ${h.t('rester_min').replace(' days', '')} to ${h.t('rester_maks')}. Cool the food quickly and freeze what you won’t eat soon. The leftovers in this plan are used within two days.`],
    ['Can I save the meal plan in Matlyst?', 'Yes. Save the recipes, put them on the days in the meal plan, and add the week to the grocery list. Matlyst doesn’t make the plan for you, so you add it yourself.'],
  ],
  svar: ({ dager, rester, restOrd }) => `${cap(and(dager))}. ${rester === 0 ? 'None' : cap(restOrd)} of the dinners ${rester === 1 ? 'uses' : 'use'} leftovers from an earlier day, and the grocery list below has everything you need for the whole week.`,
  fyll: (a, h) => a.replace('{fryser}', `${h.t('fryser_min').replace(' months', '')} to ${h.t('fryser_maks')}`),
  sek: { dager: 'The meal plan day by day', rester: 'How to use the leftovers', liste: 'Grocery list for the whole week', app: 'Save the week in Matlyst', kilder: 'Sources', restRegler: 'Rules for the leftovers' },
  andre: 'More meal plans', alle: 'All meal plans',
  steg: [['Read through the week', 'Seven dinners, and which days make leftovers.'], ['Shop once', 'Use the grocery list, which is grouped by aisle.'], ['Cook extra where the week says to', 'Then dinner two days later is half made.']],
  stegTittel: 'How to use the meal plan', faqTittel: 'Questions about the meal plan',
  cta: 'Plan your week in Matlyst',
  elementNavn: (h1) => `${h1}: seven dinners`,
  navSvar: (names) => `Each meal plan has seven dinners with a link to the recipe, a plan for using the leftovers later in the week, and one grocery list grouped by aisle. Choose from ${names}.`,
  navFaq: (h) => [
    ['Are the meal plans free?', 'Yes. The pages are free to use, and you don’t need the app to follow them. The meal plan and the grocery list in Matlyst are free too.'],
    ['Is there a new meal plan every week?', 'No. These are fixed meal plans you can use whenever you like. Swap a dinner if you want, but keep the same gap between a dinner and the leftovers it makes.'],
    ['Why are there no prices or calories?', 'We only write numbers we have an open source for. Prices change from store to store and week to week, and we have no source for the nutrition in each dinner.'],
    ['How long do leftovers keep?', `${h.k('fsis-leftovers')} says leftovers can be kept in the refrigerator for ${h.t('rester_min').replace(' days', '')} to ${h.t('rester_maks')}. The leftovers in our meal plans are used within two days.`],
  ],
  nav: {
    title: 'Weekly meal plans: seven dinners with a grocery list',
    description: 'Ready-made weekly meal plans with seven dinners, leftovers planned in, and one grocery list by aisle: family, budget, vegetarian, for one, and comfort food.',
    h1: 'Weekly meal plans with a grocery list',
    lead: 'Seven dinners a week, set up so one dinner makes the next, with one grocery list for the whole week.',
    steg: [['Pick a meal plan', 'Family, budget, vegetarian, for one, or comfort food.'], ['Shop once', 'Use the combined grocery list.'], ['Use the leftovers', 'The week shows which days make extra.']],
    stegTittel: 'How to use the meal plans', faqTittel: 'Questions about the meal plans',
    velg: 'Pick a meal plan',
    velgIntro: 'Every meal plan runs from Monday to Sunday and is built the same way: the days, the leftovers, the grocery list, and the way into the app.',
    oppsett: 'How the meal plans are set up',
    punkter: [
      '<strong>Leftovers are planned in.</strong> Each week has days that make extra and days that use it. No leftover waits longer than two days in the refrigerator, and rice and pasta are never saved as leftovers.',
      '<strong>One grocery list for the whole week.</strong> Each item appears once, grouped by the same aisles as in Matlyst, with the days that need it.',
      '<strong>The recipes are Taste of Home’s.</strong> We link to them and don’t reproduce them. Where a dinner doesn’t need a recipe, we wrote a few short steps ourselves.',
      '<strong>No numbers without a source.</strong> We list no prices, calories, or serving sizes. The advice on leftovers and cooling is from the USDA Food Safety and Inspection Service.',
    ],
    egne: 'Plan with your own recipes',
    egneTekst: 'Would you rather use the recipes you already have? In the <a href="/en/meal-plan-app/">meal plan in Matlyst</a> you put your own recipes on the days and get one grocery list for the whole week, grouped by aisle. Matlyst doesn’t pick the dinners for you.',
  },
};

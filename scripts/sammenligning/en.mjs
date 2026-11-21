// Three neutral comparison pages for the US (en-US): /en/best-recipe-app/, /en/best-grocery-list-app/, /en/best-meal-planning-app/.
// Same generator as the Norwegian pages (sammenligning.mjs); this file only holds the US market: copy, field names and which apps.
// Every fact and quote is in apper.en.json, taken from the US App Store, Google Play (US) and each app's own website on 2026-11-21.
// kildekontroll.mjs en checks that every quote is still on the source page. Locked by test/sammenligning.test.mjs.
// Written from the meaning (matlyst-sprak, en-US), not translated from the Norwegian pages.
// What we say about Matlyst follows the other /en/ pages: metric by default, Units: US keeps the source's cups and °F, no conversion into cups.
import { lagSammenligning, p, ul } from './sammenligning.mjs';

const MAANEDER = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const langDato = (iso) => { const [a, m, d] = iso.split('-').map(Number); return `${MAANEDER[m - 1]} ${d}, ${a}`; };
// Serial comma, as in the rest of the English site.
const and = (xs) => (xs.length > 2 ? `${xs.slice(0, -1).join(', ')}, and ${xs.at(-1)}` : xs.join(' and '));

export const MARKED = {
  lang: 'en',
  datafil: new URL('./apper.en.json', import.meta.url),
  prefiks: '/en/',
  avsender: 'We make Matlyst, so we have a stake in this. That’s why every fact here has a source and a date.',
  ikke: 'Not stated',
  stier: Object.freeze({ oppskrift: 'best-recipe-app/', handleliste: 'best-grocery-list-app/', ukemeny: 'best-meal-planning-app/' }),
  langDato, kortDato: langDato, liste: and,
  felt: {
    plattformer: 'Platforms',
    enheter: 'US and metric units',
    gratis: 'Free',
    betalt: 'Paid',
    nett: 'Import from websites',
    sosiale: 'Import from social media',
    ukemeny: 'Meal plan',
    handleliste: 'Grocery list',
    deling: 'Sharing with your household',
    spiskammer: 'Pantry',
    saerpreg: 'Also worth knowing',
  },
  sideapper: {
    oppskrift: ['matlyst', 'paprika', 'recime', 'samsung', 'recipekeeper', 'crouton', 'mela', 'pestle'],
    handleliste: ['matlyst', 'anylist', 'bring', 'listonic', 'ourgroceries', 'outofmilk'],
    ukemeny: ['matlyst', 'paprika', 'samsung', 'anylist', 'plantoeat', 'recipekeeper', 'recime'],
  },
  tekst: {
    app: 'App',
    bestFor: 'Best for you if you',
    kilder: 'Sources',
    sjekket: 'checked',
    sjekketStor: 'Checked',
    eyebrow: 'Comparison',
    stegTittel: 'How to choose',
    faqTittel: 'Questions and answers',
    hvem: 'Who wrote this page',
    hvemTekst: (dato) => `Matlyst is one of the apps on this page. Everything we say about the other apps comes from their own App Store and Google Play listings and their own websites, and each card links there. Last checked ${dato}.`,
    valg: 'The short answer: pick by what you need',
    sammenligning: 'Side by side',
    tabellIntro: 'The table shows what each app says about itself. Swipe sideways in the table to see every column.',
    tabellTittel: 'What the apps say about themselves',
    enForEn: 'The apps one by one',
    slikValgte: 'How we chose',
    sidenavn: { oppskrift: 'recipe apps', handleliste: 'grocery list apps', ukemeny: 'meal planning apps' },
    andreSider: (lenker) => `We compared ${lenker} the same way.`,
    slikValgteTekst: (kategori, dato) => p(
      `We included apps that are in the US App Store and have ${kategori} as one of their main features. Most are on Google Play too. We used our own judgment to pick them, and an app that isn’t here isn’t necessarily worse.`,
      `Every fact comes from the app’s own listing in the US App Store, from Google Play in the US, and from the app’s own website. We checked them on ${dato}. Each card links to its sources.`,
    ) + ul([
      '<strong>Alphabetical order.</strong> The apps are listed by name, and the order isn’t a ranking.',
      '<strong>“Not stated”</strong> means we didn’t find it in the sources. It doesn’t mean the app can’t do it.',
      '<strong>No stars or ratings.</strong> They change from week to week, and they say little about what suits you.',
      '<strong>No prices in dollars.</strong> Prices change and can differ between the App Store and Google Play. You’ll see the price in the store before you buy.',
      '<strong>No logos or screenshots</strong> from other apps. The names belong to their owners, and Matlyst isn’t affiliated with any of them.',
    ]) + p('Did we get something wrong, or has an app changed? Email <a href="mailto:hei@matlyst-app.no">hei@matlyst-app.no</a>, and we’ll check the source and fix the page.'),
  },
  // guidePage (generer-lokalsider.mjs) adds the BreadcrumbList itself and builds FAQPage from the visible FAQ.
  skjemaer: ({ artikkel }) => [artikkel, 'faq'],
  sider: {
    oppskrift: {
      title: 'Best recipe apps, free and paid: 8 compared',
      description: 'Which recipe organizer app fits you? Eight recipe keeper apps compared on free plans, imports from websites and social media, US units, and sharing.',
      h1: 'Best recipe apps: eight recipe organizers compared',
      lead: 'Here are eight recipe apps you can get in the US, compared on what the apps say about themselves.',
      kategori: 'saving and organizing recipes',
      svar: 'No app is best for everyone. If you save from Instagram and TikTok, Matlyst, Pestle, ReciMe, and Recipe Keeper all say they do it, and Paprika does it with Premium. ReciMe’s free plan allows five imports a week. If you want one app on iPhone, Mac, Android, and Windows, look at Paprika or Recipe Keeper. If you only use Apple devices, Crouton and Mela are built for them, and Mela is a one-time purchase. If you want a big library of recipes to browse, Samsung Food has one.',
      valg: ul([
        '<strong>You save from Instagram and TikTok:</strong> Matlyst, Pestle, ReciMe, and Recipe Keeper say they import from both. Paprika does it with Premium.',
        '<strong>You want to use it for free:</strong> ReciMe allows five imports a week, Matlyst five a month, Paprika up to 50 recipes on one device, and Pestle 15 recipes.',
        '<strong>You don’t want a subscription:</strong> Mela unlocks everything with a one-time purchase. Recipe Keeper sells a Pro upgrade in the app, and Pestle has a lifetime option.',
        '<strong>You use a PC or Windows:</strong> Paprika and Recipe Keeper both run on Windows.',
        '<strong>You only use Apple devices:</strong> Crouton runs on iPhone, iPad, Mac, Apple Vision, and Apple Watch. Mela runs on iPhone, iPad, and Mac.',
        '<strong>You cook from US recipes and metric ones:</strong> Crouton, Paprika, Pestle, ReciMe, and Recipe Keeper say they convert units. Matlyst is metric by default, and with Units set to US it keeps the cups and °F a recipe uses.',
        '<strong>You want new recipes, not just your own:</strong> Samsung Food has a large library of public recipes.',
      ]),
      tabellFelt: ['plattformer', 'gratis', 'nett', 'sosiale', 'enheter', 'deling'],
      kortFelt: ['plattformer', 'enheter', 'gratis', 'betalt', 'nett', 'sosiale', 'ukemeny', 'handleliste', 'deling', 'saerpreg'],
      best: {
        matlyst: 'save from TikTok, Instagram, YouTube, and websites and want the meal plan, grocery list, and pantry in the same app.',
        paprika: 'want the same app on iPhone, Mac, Android, and Windows, and want it to work offline.',
        recime: 'save a lot from Instagram, TikTok, and Pinterest and want free imports every week.',
        samsung: 'want a big library of recipes to browse and a free meal plan.',
        recipekeeper: 'want to scan recipes from photos and PDFs, or move over from another recipe app.',
        crouton: 'only use Apple devices and want the app to build a meal plan from your own recipes.',
        mela: 'only use Apple devices and would rather pay once than subscribe.',
        pestle: 'save from Instagram and TikTok on an iPhone and like to cook hands-free or with someone over FaceTime.',
      },
      ekstra: [
        ['Save your own recipes, or find new ones', p('Most of these apps are built to <strong>save your own recipes</strong> from websites, social media, and photos. Samsung Food is also built to <strong>find new ones</strong> in its own library.',
          'What separates the rest is mostly where you find your recipes, which devices you use, and whether you want a subscription. If you want to test apps yourself, see <a href="/en/blog/choose-recipe-organizer-app/">how to choose a recipe organizer app</a>.')],
      ],
      iMatlyst: ['How to save a recipe and plan the week in Matlyst', p('If you pick Matlyst, share a link or a post from Instagram, TikTok, YouTube, or a website to Matlyst, or paste the link in the app. Check the draft before you save it, since AI reads the recipe and can get an amount wrong. Then put the recipe on a day in your meal plan, and the ingredients go to your grocery list.', 'See <a href="/en/import-recipes/">how importing works</a> and <a href="/en/recipe-book-app/">what the recipe app does</a>.')],
      steg: [['Think about where your recipes come from', 'Websites, Instagram, TikTok, or cookbooks.'], ['Check your devices and units', 'Make sure it runs on your phone and computer and handles cups the way you cook.'], ['Try the free version', 'Save five real recipes before you decide.']],
      faq: [
        ['What is the best recipe app?', 'It depends on what you need. If you save from Instagram and TikTok, look at Matlyst, Pestle, ReciMe, or Recipe Keeper. For free imports from social media every week, look at ReciMe. On a PC or Windows, look at Paprika or Recipe Keeper. If you’d rather pay once, look at Mela.'],
        ['Is there a free recipe organizer app?', 'Yes. Every app on this page is free to download. The free versions have different limits, such as five imports a week in ReciMe, five a month in Matlyst, 50 recipes on one device in Paprika, and 15 recipes in Pestle.'],
        ['Which recipe apps don’t need a subscription?', 'Mela unlocks all features with a one-time purchase. Recipe Keeper sells a Pro upgrade in the app, and Pestle Pro has a lifetime option. The others say they use a subscription or don’t state it.'],
        ['Which recipe apps handle both cups and metric?', 'Crouton, Paprika, Pestle, ReciMe, and Recipe Keeper say they convert units or measurements. Matlyst is metric by default, and with Units set to US it keeps the cups, ounces, and °F the recipe used.'],
        ['Why are there no stars or prices?', 'Ratings and prices change often. We only write what we can point to in the app’s own listing or website, with a date.'],
        ['Can this page be neutral if Matlyst made it?', 'We have a stake in this, and we say so at the top. That’s why every fact links to its source and has a date, so you can check it yourself.'],
      ],
      cta: 'Try Matlyst with your own recipes',
    },
    handleliste: {
      title: 'Best grocery list apps: 6 shared lists compared',
      description: 'Which grocery list app fits your household? Six apps compared on sharing, free plans, sorting by aisle, and lists made from recipes. With sources and dates.',
      h1: 'Best grocery list apps: six apps compared',
      lead: 'Here are six grocery list apps you can get in the US, compared on what the apps say about themselves.',
      kategori: 'a grocery list',
      svar: 'If you just want a shared list for free, Bring! and AnyList say making and sharing lists is free, and Listonic and OurGroceries are free list apps built for sharing. If you want deals from nearby stores on the list, Bring! shows them. If you want to order online, AnyList works with Walmart, Instacart, Kroger, and more. If you want the list made from your recipes and meal plan, look at Matlyst or AnyList.',
      valg: ul([
        '<strong>You want one shared list, for free:</strong> Bring! and AnyList say making and sharing lists is free. Listonic and OurGroceries are free to use, and both share lists across the household.',
        '<strong>You want the list made from recipes:</strong> Matlyst builds it from your saved recipes and meal plan. AnyList does too, and its meal plan takes AnyList Complete. OurGroceries adds a recipe’s ingredients in one tap.',
        '<strong>You want to order groceries online:</strong> AnyList lets you shop online at Walmart, Instacart, Kroger, and more.',
        '<strong>You want deals while you write the list:</strong> Bring! shows offers from stores near you.',
        '<strong>You keep an eye on the total:</strong> Listonic and Out of Milk add up the list, and AnyList does with AnyList Complete.',
        '<strong>You want a pantry list too:</strong> Matlyst and Out of Milk both have one.',
      ]),
      tabellFelt: ['plattformer', 'gratis', 'deling', 'handleliste'],
      kortFelt: ['plattformer', 'gratis', 'betalt', 'handleliste', 'deling', 'nett', 'ukemeny', 'spiskammer', 'saerpreg'],
      best: {
        matlyst: 'want the grocery list to come straight from your saved recipes and meal plan, and want to keep track of your pantry.',
        anylist: 'want a shared list with recipes and a meal plan in the same app, and like to order online.',
        bring: 'want a free shared list and offers from stores near you.',
        listonic: 'want a free shared list that works offline and adds up what the trip will cost.',
        ourgroceries: 'want a simple shared list your whole household joins with one email address.',
        outofmilk: 'want a grocery list, a pantry list, and a to-do list in one app.',
      },
      ekstra: [
        ['What sets these grocery list apps apart', p('There are two kinds of grocery list apps here. <strong>List apps</strong>, like Bring!, Listonic, OurGroceries, and Out of Milk, are built to share a list fast. <strong>Recipe apps with a grocery list</strong>, like Matlyst and AnyList, build the list from what you plan to cook.',
          'Matlyst also has its own page about <a href="/en/shopping-list/">the grocery list that comes from your recipes</a>.')],
      ],
      iMatlyst: ['How to plan the week and shop in Matlyst', p('If you pick Matlyst, put recipes on the days in your meal plan and send the whole week to the grocery list in one tap. The list is grouped by store section, and you can add your own items.', 'Read more about the <a href="/en/shopping-list/">grocery list</a> and the <a href="/en/meal-plan-app/">meal plan</a>.')],
      steg: [['Think about who shops', 'Just you, or the whole household on one list.'], ['Think about how you shop', 'One store, several stores, or online.'], ['Pick how the list gets made', 'Typed by hand, from deals, or from recipes.']],
      faq: [
        ['What is the best grocery list app?', 'It depends on how you shop. For a free shared list, look at Bring!, Listonic, or OurGroceries. To order online, look at AnyList. If the list should come from your recipes, look at Matlyst or AnyList.'],
        ['Which grocery list app can my family share?', 'All of these say you can share: AnyList, Bring!, Listonic, OurGroceries, and Out of Milk (by text or email). In Matlyst, sharing with your household takes Matlyst Pro.'],
        ['Is there a free grocery list app?', 'Yes. Every app on this page is free to download. Bring!, Listonic, and OurGroceries say their lists are free, and the grocery list in Matlyst is free. Some of the free apps show ads.'],
        ['Which grocery list apps sort by aisle?', 'AnyList, Bring!, Listonic, and OurGroceries say they sort the list by category or aisle, and AnyList and Bring! let you match it to your store. Out of Milk groups items into categories, and Matlyst groups the list by store section.'],
        ['Can this page be neutral if Matlyst made it?', 'We have a stake in this, and we say so at the top. That’s why every fact links to its source and has a date, so you can check it yourself.'],
      ],
      cta: 'Build your grocery list from recipes in Matlyst',
    },
    ukemeny: {
      title: 'Best meal planning apps: 7 meal planners compared',
      description: 'Which meal planner app fits your week? Seven apps compared on free plans, grocery lists from the plan, sharing, and whether the app plans for you.',
      h1: 'Best meal planning apps: seven meal planners compared',
      lead: 'Here are seven meal planning apps you can get in the US, compared on what the apps say about themselves.',
      kategori: 'a meal plan',
      svar: 'If you want to plan with your own recipes and get one grocery list for the week, Matlyst, Paprika, Plan to Eat, and Recipe Keeper do that, and AnyList does with AnyList Complete. If you want the app to make the plan, Samsung Food (with Samsung Food+) and Recipe Keeper say they can. If you plan around leftovers, Plan to Eat says it handles them. If you want it free, the meal plan is free in Matlyst, ReciMe, and Samsung Food.',
      valg: ul([
        '<strong>You plan with your own recipes:</strong> Matlyst, Paprika, Plan to Eat, and Recipe Keeper put your saved recipes on the days and send the week to the grocery list. AnyList does the same with AnyList Complete.',
        '<strong>You want the app to make the plan:</strong> Samsung Food+ offers weekly plans made with AI. Recipe Keeper can make a random plan from hints you give it.',
        '<strong>You plan leftovers and frozen meals:</strong> Plan to Eat says it does both.',
        '<strong>You plan breakfast and lunch too:</strong> ReciMe sorts the plan by breakfast, lunch, and dinner, and Paprika plans by day, week, or month.',
        '<strong>You want to use it for free:</strong> The meal plan is free in Matlyst, ReciMe, and Samsung Food. In AnyList it takes AnyList Complete, and Plan to Eat has a 14-day free trial.',
      ]),
      tabellFelt: ['gratis', 'ukemeny', 'handleliste', 'deling'],
      kortFelt: ['plattformer', 'gratis', 'betalt', 'ukemeny', 'handleliste', 'deling', 'spiskammer', 'saerpreg'],
      best: {
        matlyst: 'plan the week with recipes you saved from social media and websites, and want the meal plan and grocery list for free.',
        paprika: 'want to plan by day, week, or month and use the app on many devices.',
        samsung: 'want weekly plans made for you (with Samsung Food+) and a big library of recipes.',
        anylist: 'already keep your grocery list in AnyList and want the meal plan next to it.',
        plantoeat: 'plan around leftovers and frozen meals and share the plan with your family.',
        recipekeeper: 'want a random plan from your own recipes as a starting point.',
        recime: 'want a free meal plan for breakfast, lunch, and dinner, with groceries you can order in the app.',
      },
      ekstra: [
        ['Do you plan, or does the app?', p('That’s the biggest difference. In most of these apps, <strong>you</strong> pick the meals, and the app keeps track of the days and the grocery list. Some can also <strong>make the plan</strong> for you: Samsung Food with Samsung Food+ and Recipe Keeper say they do. Matlyst doesn’t make the plan for you.',
          'Read more about the <a href="/en/meal-plan-app/">meal plan in Matlyst</a>.')],
        ['What about Mealime?', p('Mealime isn’t on this list. Its own <a href="https://www.mealime.com/closing" rel="noopener">closing page</a> says Mealime was discontinued as of October 21, 2026, and points its users to Meals Hub in Albertsons Companies grocery apps.',
          'If you used Mealime and want your recipes somewhere you control, see <a href="/en/mealime-alternative/">how to move Mealime recipes</a>.')],
      ],
      iMatlyst: ['How to turn the week into a grocery list in Matlyst', p('If you pick Matlyst, put the recipes you’ve saved on the days in your meal plan. Then send the whole week to the grocery list in one tap, and the list is grouped by store section.', 'Read more about the <a href="/en/meal-plan-app/">meal plan</a> and the <a href="/en/shopping-list/">grocery list</a>.')],
      steg: [['Decide who picks the meals', 'You, or the app.'], ['Check the grocery list', 'Make sure the whole week becomes one list you can share.'], ['Try one week', 'Plan five dinners before you decide.']],
      faq: [
        ['What is the best meal planning app?', 'It depends on whether you want to plan yourself. With your own recipes, look at Matlyst, Paprika, Plan to Eat, or Recipe Keeper. If you want the app to make the plan, look at Samsung Food+ or Recipe Keeper. If you plan leftovers, look at Plan to Eat.'],
        ['Is there a free meal planner app?', 'Yes. The meal plan is free in Matlyst, ReciMe, and Samsung Food. Samsung Food says weekly plans made with AI need Samsung Food+.'],
        ['Does Matlyst make a meal plan for me?', 'No. You pick the recipes and put them on the days. Matlyst then sends the ingredients to one grocery list.'],
        ['Can my family share the meal plan?', 'Paprika (Premium), AnyList (Complete), Plan to Eat, Recipe Keeper, and Matlyst (Pro) say you can share. Samsung Food says you can share grocery lists.'],
        ['Is Mealime still available?', 'Mealime’s closing page says it was discontinued as of October 21, 2026, and points to Meals Hub in Albertsons Companies grocery apps.'],
        ['Can this page be neutral if Matlyst made it?', 'We have a stake in this, and we say so at the top. That’s why every fact links to its source and has a date, so you can check it yourself.'],
      ],
      cta: 'Plan your week in Matlyst',
    },
  },
};

export const { DATA, AVSENDER, STIER, apperPaSide, kilderForApp, sider } = lagSammenligning(MARKED);
export { langDato as kortDato, langDato };

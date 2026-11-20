// Flytteside for tidligere Mealime-brukere (en-US, bare engelsk). Skrevet 2026-11-20 for Patricks godkjenning.
// Fakta om Mealime står bare der mealime.com/closing sier det (lest 2026-11-20); om eksport vet vi ikke noe, og siden sier det.
// Matlyst har INGEN masseimport fra Mealime og ingen kontokobling (bare Paprika-filer). Lenkeimport av publiserte mealime.com-oppskrifter er testet 2026-11-20 (kontrolløren, engelsk QA-konto). Låst av test/mealime.test.mjs.
import { byggRik } from './../rik-sider.mjs';

const p = (...ps) => ps.map((t) => `<p>${t}</p>`).join('');
const ul = (...li) => `<ul>${li.map((t) => `<li>${t}</li>`).join('')}</ul>`;

const html = byggRik({
  svarTekst: 'The recipes Mealime published on mealime.com/recipes can still be brought into Matlyst by link, one at a time. Find the recipe, share or paste its link in Matlyst, and check the draft. We tested this on November 20, 2026. It could stop working if Mealime takes those pages down, so it’s worth doing soon. There’s no bulk import and no connection to your Mealime account, and recipes you created yourself in Mealime have no public page, so save those from a photo or screenshot (Pro) or type them in.',
  seksjoner: [
    ['What happened to Mealime', p(
      'This is what Mealime says on its own <a href="https://www.mealime.com/closing" rel="noopener">closing page</a>.')
      + ul(
        'Mealime was discontinued on October 21, 2026.',
        'Mealime’s recipes and meal-planning tools are moving to Meals Hub, which is available in Albertsons Companies grocery apps and on Albertsons store websites. Mealime says Meals Hub comes from the same core team and is free, including the recipes that used to be Pro.',
        'Paid subscriptions were wound down, and Pro subscribers were not charged any more subscription fees before the shutdown.',
        'Your account information does not transfer automatically. Some preferences have to be set up again in Meals Hub.',
        'Mealime says all personal data will be deleted when the app shuts down.')
      + p('If you shop at an Albertsons Companies store, Meals Hub is the route Mealime itself points to, and it may be the simplest thing to try first. The rest of this page is for people who want their recipes in a place they control.')],

    ['Bring a Mealime recipe into Matlyst by link', p(
      'Mealime’s published recipes are still open on <a href="https://www.mealime.com/recipes" rel="noopener">mealime.com/recipes</a>, where you can browse and search. Each recipe has its own page, and you can bring it into Matlyst one at a time.')
      + '<ol><li>Find the recipe on mealime.com/recipes and open it.</li>'
      + '<li>Share the page to Matlyst from the Share Sheet. Or copy the link, open <strong>Add recipe</strong> in Matlyst, choose <strong>Paste a link</strong>, and paste it.</li>'
      + '<li>Check the draft before you save it. Look over the amounts and ingredient names, and fix anything that needs fixing.</li></ol>'
      + p('We tested this on November 20, 2026, with two recipes from mealime.com. Both came in with ingredients, steps, and a photo, in about 7 and 12 seconds. One had 12 ingredients and 7 steps, the other 15 ingredients and 14 steps. The number of servings didn’t come along, so set it in the draft before you save.',
        'Mealime has shut down, and we don’t control its website. If Mealime takes those pages down, this stops working, so it’s worth saving the recipes you want soon.')],

    ['What Matlyst can and can’t bring over', p(
      'There’s no bulk Mealime import. Matlyst doesn’t connect to Mealime, it can’t read a Mealime account, and it never asks for your Mealime login. Matlyst is not affiliated with Mealime or Albertsons, and their names belong to their owners.',
      'Link import only reaches recipes that Mealime published. Recipes you created yourself in Mealime had no public page, so a link can’t reach them. Start with the recipes you cook most, not the whole collection, since each one comes over by hand.')],

    ['Your own recipes and other ways in', p('Pick whichever matches what you still have in front of you.')
      + '<h3>A photo or a screenshot</h3>'
      + p('If you have one of your own recipes on a screen, in a screenshot, or on a printout, choose <strong>Take a photo</strong> in Add recipe. Pick the photo or screenshot from your library, or photograph the page. If a recipe runs over several screenshots, add them all, in order. Photo import is a Matlyst Pro feature. Image quality affects the result, and Matlyst can misread quantities, so compare the draft with the original.')
      + '<h3>Type it in</h3>'
      + p('If you can copy the text, or you know the recipe by heart, choose <strong>Type it in</strong>, then paste or type the recipe. Matlyst sorts it into ingredients and steps.')
      + '<h3>An export from a third-party tool</h3>'
      + p('If you saved your recipes with a third-party export tool, Matlyst can’t read that file. Open the recipes in the tool, copy the text of each one, and paste it under Type it in. Or use the mealime.com links to the original recipes, where they exist.')
      + p('Imports can make mistakes, because AI reads the recipe. Look over amounts and ingredient names before you cook. Amounts are metric by default. Switch to <strong>Units: US</strong> in Settings and Matlyst keeps the cups, ounces, and degrees Fahrenheit the source used. It doesn’t convert metric recipes into cups for you.')],

    ['Can you export your recipes from Mealime?', p(
      'Mealime doesn’t offer an official export, and its closing page doesn’t mention one. On November 20, 2026, the Mealime web app was showing “Offline for Maintenance.” The published recipes on mealime.com/recipes were still online.',
      'So the recipes you can still reach are the published ones, and those you can bring over by link. A recipe you created yourself is only safe if you already have a screenshot or a copy. Mealime says personal data will be deleted at shutdown.')],

    ['What your week looks like in Matlyst', p(
      'Matlyst is built around recipes you save yourself, and it doesn’t build your week for you. If you want an app that picks the dinners, this isn’t that. You choose the recipes, and the app does the bookkeeping.')
      + '<h3>Meal plan</h3>'
      + p('Open <strong>Meal Plan</strong>, tap a day, and choose a saved recipe. Plan one dinner or the whole week. Read more about the <a href="/en/meal-plan-app/">meal plan</a>.')
      + '<h3>Grocery list</h3>'
      + p('Add one recipe, a day, or the whole week to the grocery list. Matching items go on one line, and the list is grouped by store section. When units differ, such as 1 cup in one recipe and 200 g in another, the amounts show together on that line, because Matlyst doesn’t guess how to convert them. Read more about the <a href="/en/shopping-list/">grocery list</a>.')
      + '<h3>Pantry</h3>'
      + p('Add what is in your kitchen, with an expiry date if the item has one. When you add a recipe to the grocery list, items already in your pantry are unselected and marked “In your pantry.” Read more about the <a href="/en/pantry-app/">pantry</a>.')
      + '<h3>Cooking and scaling</h3>'
      + p('Scale a recipe from 1 to 20 servings. Cook mode shows the steps as a checklist, suggests a timer when a step mentions a time, and keeps the screen awake. Cook mode needs an internet connection.')],

    ['What it costs', p(
      'Matlyst is free to start, with 5 imports per calendar month. Folders, search, the meal plan, and the grocery list are free. Photo import, Ask Matlyst, and creating a household are part of Matlyst Pro, and joining a household is free. The current Pro options are shown in the app before you buy.')
      + p('You can also export your recipes at any time, for free, as a Matlyst file (a zip with folders and photos) or as HTML, so the next move is easier than this one.')],
  ],
}).html;

export const side = {
  title: 'Mealime Alternative: Moving Your Recipes',
  description: 'Mealime’s published recipes still import into Matlyst by link, one at a time (tested November 20, 2026). Find a recipe, paste the link, check the draft.',
  eyebrow: 'After Mealime',
  h1: 'Mealime’s recipes are still online. Here’s how to save them in Matlyst.',
  lead: 'Find the recipe on mealime.com/recipes, share or paste the link in Matlyst, and check the draft. We tested it on November 20, 2026. It works one recipe at a time, and it could stop if Mealime takes the pages down.',
  publisert: '2026-11-20',
  schemas: ['article', 'faq'],
  forst: 'Do it soon, and start with the recipes you cook most.',
  stegTittel: 'The short version',
  steg: [
    ['Paste the link', 'Find the recipe on mealime.com/recipes and share or paste its link in Matlyst.'],
    ['Check the draft', 'Look over the amounts and ingredient names, and set the servings.'],
    ['Save your own recipes another way', 'Recipes you created yourself have no public page. Use a photo or screenshot (Pro), or type them in.'],
  ],
  alternativ: '',
  grense: '',
  seksjoner: [],
  faqTittel: 'Mealime questions',
  rik: html,
  faq: [
    ['What happened to Mealime?', 'According to its closing page, Mealime was discontinued on October 21, 2026, and its recipes and meal-planning tools are moving to Meals Hub in Albertsons Companies store apps.'],
    ['Can I import my Mealime recipes into Matlyst?', 'One at a time, by link, if Mealime published them on mealime.com/recipes. We tested it on November 20, 2026. There’s no bulk import, and Matlyst doesn’t connect to Mealime accounts. Recipes you created yourself have no public page, so save those from a photo or screenshot (Matlyst Pro) or type them in.'],
    ['Will the link import keep working?', 'We can’t promise it. It depends on Mealime keeping its recipe pages online, so save the recipes you want soon.'],
    ['Why is the number of servings missing?', 'In our test, the servings didn’t come along from mealime.com. Set the number of servings in the draft before you save the recipe.'],
    ['Can I export my recipes from Mealime?', 'Mealime doesn’t offer an official export, and its closing page doesn’t mention one. Published recipes are still on mealime.com/recipes, and you can bring those over by link.'],
    ['Does Matlyst ask for my Mealime login?', 'No. Matlyst never connects to your Mealime account or asks for your Mealime password.'],
    ['Can I save a recipe I made myself in Mealime?', 'Only from a copy you already have. With Matlyst Pro, take a photo or screenshot of it in Add recipe. Without Pro, choose Type it in and paste or type the recipe. Look over the draft against the original.'],
    ['Does Matlyst make a meal plan for me?', 'No. You choose the recipes and put them on the days you want. Matlyst then sends the ingredients to one grocery list.'],
    ['Does Matlyst have the same recipes Mealime had?', 'No. Matlyst works with the recipes you save yourself. Mealime says its recipes continue in Meals Hub.'],
    ['Is Matlyst free?', 'Matlyst is free to start, with 5 imports per calendar month. The meal plan and the grocery list are free. Photo import, Ask Matlyst, and creating a household are part of Matlyst Pro.'],
    ['Is Meals Hub an option?', 'Mealime’s closing page points to Meals Hub, which it says is free and available in Albertsons Companies apps. If you shop there, it may be the easiest thing to try. Matlyst is for people who want to keep their own recipes in one place.'],
  ],
  cta: 'Save your first recipe in Matlyst',
};

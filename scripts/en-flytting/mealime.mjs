// Flytteside for tidligere Mealime-brukere (en-US, bare engelsk). Skrevet 2026-11-20 for Patricks godkjenning.
// Fakta om Mealime står bare der mealime.com/closing sier det (lest 2026-11-20); om eksport vet vi ikke noe, og siden sier det.
// Matlyst har INGEN Mealime-import. Siden skal aldri påstå det (låst av test/mealime.test.mjs).
import { byggRik } from './../rik-sider.mjs';

const p = (...ps) => ps.map((t) => `<p>${t}</p>`).join('');
const ul = (...li) => `<ul>${li.map((t) => `<li>${t}</li>`).join('')}</ul>`;

const html = byggRik({
  svarTekst: 'Mealime was discontinued on October 21, 2026, and its closing page says the recipes are moving to Meals Hub, inside Albertsons Companies store apps. Matlyst has no Mealime import, so you bring recipes over one at a time: share or paste a link, take a photo or screenshot (a Pro feature), or type the recipe in. Then you can plan the week, build a grocery list, and keep a pantry in the same app.',
  seksjoner: [
    ['What happened to Mealime', p(
      'This is what Mealime says on its own <a href="https://www.mealime.com/closing" rel="noopener">closing page</a>.')
      + ul(
        'Mealime was discontinued on October 21, 2026.',
        'Mealime’s recipes and meal-planning tools are moving to Meals Hub, which is available in Albertsons Companies grocery apps and on Albertsons store websites. Mealime says Meals Hub comes from the same core team and is free, including the recipes that used to be Pro.',
        'Paid subscriptions were wound down, and Pro subscribers were not charged any more subscription fees before the shutdown.',
        'Your account information does not transfer automatically. Some preferences have to be set up again in Meals Hub.',
        'Mealime says all personal data will be deleted when the app shuts down.')
      + p('The closing page does not say anything about exporting your saved recipes. If you shop at an Albertsons Companies store, Meals Hub is the route Mealime itself points to, and it may be the simplest thing to try first. The rest of this page is for people who want their recipes in a place they control.')],

    ['What Matlyst can and can’t bring over', p(
      'Matlyst has no Mealime import. It doesn’t connect to Mealime, it can’t read a Mealime account, and it never asks for your Mealime login. Matlyst is not affiliated with Mealime or Albertsons, and their names belong to their owners.',
      'What Matlyst does do is turn a recipe you give it into an editable recipe: separate ingredients with amounts, numbered steps, and a photo when one is available. You give it each recipe in one of three ways, and you check the draft before you save it. That is slower than a bulk import, so it is worth starting with the recipes you cook most, not the whole collection.')],

    ['Three ways to bring a recipe across', p('Pick whichever matches what you still have in front of you.')
      + '<h3>1. Share or paste a link</h3>'
      + p('If the recipe has a page on the web, share it to Matlyst from the Share Sheet, or open <strong>Add recipe</strong> and paste the link. Matlyst reads the page and builds the recipe. Websites, Instagram, TikTok, and YouTube descriptions work. We haven’t tested links to Mealime’s own pages, so read the draft before you save it.')
      + '<h3>2. Take a photo or a screenshot</h3>'
      + p('If you have a recipe on your screen, a screenshot, or a printout, choose <strong>Take a photo</strong> in Add recipe. Pick the photo or screenshot from your library, or photograph the page. If a recipe runs over several screenshots, add them all, in order. Photo import is a Matlyst Pro feature. Image quality affects the result, and Matlyst can misread quantities, so compare the draft with the original.')
      + '<h3>3. Type it in</h3>'
      + p('If you can copy the text, or you know the recipe by heart, choose <strong>Type it in</strong>, then paste or type the recipe. Matlyst sorts it into ingredients and steps.')
      + p('Imports can make mistakes, because AI reads the recipe. Look over amounts and ingredient names before you cook. Amounts are metric by default. Switch to <strong>Units: US</strong> in Settings and Matlyst keeps the cups, ounces, and degrees Fahrenheit the source used. It doesn’t convert metric recipes into cups for you.')],

    ['Can you export your recipes from Mealime?', p(
      'We don’t know. The closing page doesn’t mention exporting, and we haven’t found an export option described by Mealime. Check whether Mealime lets you export your recipes, in the app’s settings or on its support pages, before you assume you can’t.',
      'Whether your saved recipes are still reachable also depends on your device and on Mealime, and we can’t check that for you. If you can still open any of them, in the app, in a browser, or in a screenshot you already took, use one of the three ways above now rather than later. Mealime says personal data will be deleted at shutdown.')],

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
  description: 'Mealime closed on October 21, 2026. See how to bring your recipes to Matlyst by link, photo, or text, and what the meal plan and grocery list do.',
  eyebrow: 'After Mealime',
  h1: 'Mealime has shut down. Here’s how to bring your recipes to Matlyst.',
  lead: 'There’s no Mealime import, so recipes move one at a time. Here’s what Mealime says about the shutdown, three ways to save a recipe, and what Matlyst gives you for the week.',
  publisert: '2026-11-20',
  schemas: ['article', 'faq'],
  forst: 'Start with the recipes you cook most.',
  stegTittel: 'The short version',
  steg: [
    ['Save the recipes you cook most', 'Share or paste a link, take a photo or screenshot (Pro), or type the recipe in.'],
    ['Check each draft', 'Look over the amounts and ingredient names before you save.'],
    ['Plan and shop', 'Put recipes on your meal plan and send the ingredients to one grocery list.'],
  ],
  alternativ: '',
  grense: '',
  seksjoner: [],
  faqTittel: 'Mealime questions',
  rik: html,
  faq: [
    ['What happened to Mealime?', 'According to its closing page, Mealime was discontinued on October 21, 2026, and its recipes and meal-planning tools are moving to Meals Hub in Albertsons Companies store apps.'],
    ['Can I import my Mealime recipes into Matlyst?', 'Not in bulk. Matlyst has no Mealime import and doesn’t connect to Mealime accounts. You can save recipes one at a time by sharing or pasting a link, with a photo or screenshot (Matlyst Pro), or by typing the recipe in.'],
    ['Can I export my recipes from Mealime?', 'We don’t know. Mealime’s closing page doesn’t mention exporting, so check Mealime’s settings and support pages. If you can still open your recipes, save the ones you want now.'],
    ['Does Matlyst ask for my Mealime login?', 'No. Matlyst never connects to your Mealime account or asks for your Mealime password.'],
    ['Can I save a Mealime recipe from a screenshot?', 'Yes, with Matlyst Pro. Save the screenshot to your photo library, choose Take a photo in Add recipe, and select the image. If the recipe runs over several screenshots, add them all in order, then compare the result with the original.'],
    ['Does Matlyst make a meal plan for me?', 'No. You choose the recipes and put them on the days you want. Matlyst then sends the ingredients to one grocery list.'],
    ['Does Matlyst have the same recipes Mealime had?', 'No. Matlyst works with the recipes you save yourself. Mealime says its recipes continue in Meals Hub.'],
    ['Is Matlyst free?', 'Matlyst is free to start, with 5 imports per calendar month. The meal plan and the grocery list are free. Photo import, Ask Matlyst, and creating a household are part of Matlyst Pro.'],
    ['Is Meals Hub an option?', 'Mealime’s closing page points to Meals Hub, which it says is free and available in Albertsons Companies apps. If you shop there, it may be the easiest thing to try. Matlyst is for people who want to keep their own recipes in one place.'],
  ],
  cta: 'Save your first recipe in Matlyst',
};

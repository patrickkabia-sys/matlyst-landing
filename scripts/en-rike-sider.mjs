// Lange engelske sider (utkast til Patricks godkjenning). Hver side legger felt oppå den
// tynne siden i en-appsider.mjs med samme path: `rik` (ferdig HTML med svar, innholdsfortegnelse
// og seksjoner), nye FAQ-svar og en ny tittel. Fakta kommer fra funksjonssjekken 18.11.2026;
// alt som ikke er bekreftet står ikke her.
import { bildeFigur, maskotGalleri } from './rik-sider.mjs';
import { animasjon, byggRik, founder, scenario, scenarioNotat, skjerm, telefoner } from './rik-sider.mjs';

export const RIK_DATO = '2026-11-18';

const p = (...ps) => ps.map((t) => `<p>${t}</p>`).join('');

const recipeBookApp = (() => {
  const { html } = byggRik({
    svarTekst: 'Matlyst is a recipe organizer app. Share a recipe from a website, an Instagram post, or a TikTok, or take a photo of one, and it becomes a clean list of ingredients and steps you can search, scale, plan, and shop from. It’s free to start.',
    seksjoner: [
      ['Why I built it', founder([
        'I never trained as a chef. I trained as a refrigeration technician.',
      ], 'Patrick, founder of Matlyst. Food is my love language. I just wanted to stop losing the recipes I cook it from.')
      + p('As an apprentice, my job took me into some of the best restaurant kitchens in my hometown. I was never the one cooking. I was the one fixing the walk-in cooler before the first order came in. From there I got a close look at how professionals work. Nothing is random. Everything has a place, a label, and a date.',
        'At home, my recipes lived in eight places: notes, OneNote, a recipe app, bookmarks, TikTok, Instagram, YouTube, and favorites. I had the cooking, but no system. So I built the system I had seen in those kitchens, for a normal family dinner.',
        'The rest of this page shows what that system does, step by step, and where it has limits.')],
      ['How it works in three steps', p('You don’t need to move your whole collection on day one. Start with the recipes you cook most.')
        + '<h3>1. Save it from wherever you found it</h3>'
        + p('Share a link or a post to Matlyst from the Share Sheet, or open the import screen and paste a URL. Matlyst reads the page or the caption and turns it into a recipe: ingredients with amounts, numbered steps, and a photo when one is available. Websites, Instagram, TikTok (including short links), and YouTube descriptions work. With Matlyst Pro you can also import from photos, up to 20 per recipe.')
        + '<h3>2. Check it and make it yours</h3>'
        + p('Read the recipe before you save it, and fix an amount, rename an ingredient, or add a note. Recipes in another language are translated to English. Amounts are metric by default. Switch to <strong>Units: US</strong> in Settings and Matlyst keeps the cups, ounces, and degrees Fahrenheit the source used. It does not convert metric recipes into cups for you.')
        + telefoner(skjerm('matlyst-import-screen-paste-link', 'The import screen: paste a link, take a photo, or type it in.'), skjerm('matlyst-settings-units-language', 'Settings with Units set to US and the language set to English.'))
        + '<h3>3. Find it again in seconds</h3>'
        + p('Search by title or ingredient, or open a folder. Type “garlic” and you see every saved recipe that uses it. Mark the ones you love as favorites, and keep the source link on each recipe, so you can go back to the creator.')],
      ['What a recipe organizer app should actually do', p('Most people already have a recipe collection. It’s just scattered: a note here, a screenshot there, a saved video you can no longer find. A good recipe organizer does four jobs.')
        + '<h3>It gathers everything in one place</h3>'
        + p('Recipes from websites, social posts, and photos are saved the same way, in folders you choose. Every recipe has the same layout, so you stop hunting through three apps to find the one you want.')
        + '<h3>It makes saved recipes findable</h3>'
        + p('A collection you can’t search is just a bigger pile. Search should work on ingredients, because that’s how you decide what to cook on a Tuesday night.')
        + '<h3>It turns recipes into a plan</h3>'
        + p('Add recipes to a weekly menu, and the ingredients go to one grocery list, combined and sorted by store section. Read more about the <a href="/en/meal-plan-app/">meal plan</a> and the <a href="/en/shopping-list/">grocery list from recipes</a>.')
        + animasjon({ fil: 'matlyst-meal-plan-to-grocery-list.mp4', plakat: 'matlyst-meal-plan-to-grocery-list-poster.webp', bredde: 540, hoyde: 1174, tekst: 'Recipes added to the weekly meal plan, then their ingredients sent to the grocery list.', bildetekst: 'From the weekly menu to one grocery list.' })
        + '<h3>It helps while you cook</h3>'
        + p('Cook mode shows the recipe as one checklist you can tick off as you go. When a step mentions a time, Matlyst suggests a timer, it keeps running in the background, and the screen stays awake. Cook mode needs an internet connection.')
        + animasjon({ fil: 'matlyst-cook-mode-timer-from-step.mp4', plakat: 'matlyst-cook-mode-timer-from-step-poster.webp', bredde: 540, hoyde: 1174, tekst: 'Cook mode suggesting a 25 minute timer from the step text, then the timer counting down.', bildetekst: 'A timer suggested from the step text.' })],
      ['Scale a recipe for more or fewer people', p('Change the number of servings from 1 to 20 and every amount scales with it. Scaling is linear, so check eggs, salt, and leavening yourself when you bake, because they don’t always scale in a straight line.')
        + animasjon({ fil: 'matlyst-recipe-servings-scale-4-to-6.mp4', plakat: 'matlyst-recipe-servings-scale-4-to-6-poster.webp', bredde: 540, hoyde: 1174, tekst: 'A recipe scaled from 4 servings to 6, with all ingredient amounts increasing.', bildetekst: 'The same recipe, 4 servings to 6.' })],
      ['Four situations, and what to do', scenarioNotat()
        + scenario('Say you saw a TikTok where the amounts are only spoken', {
          situasjon: 'A creator says “a good splash of soy and about two tablespoons of honey,” and the caption is just emojis.',
          galt: 'You screenshot the video, never rewatch it, and lose the recipe.',
          gjor: 'Share the video to your recipe app and read the result before you trust it.',
          tall: 'Matlyst reads the caption. It does not transcribe the video, so spoken amounts won’t be there.',
          matlyst: 'Share the video, check the draft, type in the amounts you heard, and save.' })
        + scenario('Say you inherited a handwritten family card', {
          situasjon: '“Butter the size of an egg,” a stained corner, slanted handwriting.',
          galt: 'The card lives in a drawer and nobody cooks from it.',
          gjor: 'Photograph it and import it as a recipe you can search and scale. Photo import is a Matlyst Pro feature.',
          tall: 'Handwriting is the hard case. Check every amount against the card before you save.',
          matlyst: 'Import from photo, then correct anything that was misread.' })
        + scenario('Say one recipe is saved in five places', {
          situasjon: 'A note, a bookmark, a screenshot, a pin, and a video.',
          galt: 'You can’t tell which version is the good one.',
          gjor: 'Keep one copy in one place, and add a note about what you changed.',
          matlyst: 'One recipe with the source link on it, and your own edits on top.' })
        + scenario('Say you’re planning dinners for a family of four', {
          situasjon: 'Five dinners, one budget, one trip to the store.',
          galt: 'Two recipes both need one onion, and you buy three.',
          gjor: 'Plan the week first, then shop from one merged list.',
          matlyst: 'Add the recipes to the weekly menu and open the grocery list. Matching items with the same unit are added together, and items already in your pantry start unchecked.' })],
      ['Swap an ingredient or make your own version', p('Out of buttermilk, or missing the fresh herb? Open the recipe and ask Ask Matlyst for a swap. “Use what I have” suggests replacements from the items in your pantry. You can also ask for a vegetarian, vegan, quicker, or smaller version, or type your own request, like “make it more exciting.”')
        + p('The changes appear as a list you can undo. When you save, choose <strong>Save a copy</strong>, which keeps the original and links back to its source marked “adapted,” or <strong>Replace</strong>, which overwrites your own recipe. Ask Matlyst is a Pro feature, it uses AI, and it has a monthly allowance. Check the result before you cook from it.')
        + telefoner(skjerm('matlyst-ask-matlyst-vegan-swap-changes', 'A vegan version shown as a list of changed ingredients, with Undo.'), skjerm('matlyst-ask-matlyst-save-copy-or-replace', 'The choice between Save a copy and Replace.'))],
      ['Your pantry, and the recipes you forgot', p('Matlyst can keep track of what you have at home. Search your saved recipes by an ingredient from the fridge and see which ones use it. On the free plan, the pantry shows 5 items. Read more about the <a href="/en/pantry-app/">pantry app</a>.')
        + p('One evening I had a jar of miso in the fridge, searched “miso,” and found a miso chicken recipe I had saved and forgotten. Dinner was decided in a couple of seconds. For my ADHD brain, that matters. Dinner is settled, and I can get on with the rest of the day.')
        + telefoner(skjerm('matlyst-pantry-expiry-dates', 'The pantry list with days left until each item expires.'))],
      ['Where a recipe app beats the other ways to keep recipes', p('Most people use a mix of the options below. Each one works for something, and each one breaks somewhere.')
        + '<div class="table-wrap"><table><thead><tr><th>Way of keeping recipes</th><th>What it does well</th><th>Where it breaks</th></tr></thead><tbody>'
        + '<tr><td>Screenshots and saved posts</td><td>Fast to save, no typing.</td><td>You can’t search by ingredient, can’t scale amounts, and the post can disappear.</td></tr>'
        + '<tr><td>A notes app or documents</td><td>Flexible, and it’s all yours.</td><td>Every recipe looks different, and nothing links to a shopping list.</td></tr>'
        + '<tr><td>Printed cards and cookbooks</td><td>Reliable in the kitchen, and full of family history.</td><td>One copy, easy to stain or lose, and no search.</td></tr>'
        + '<tr><td>A recipe organizer app</td><td>One layout for everything, searchable, scalable, tied to a meal plan and a grocery list.</td><td>You have to save the recipe once, and spoken amounts in videos still need typing in.</td></tr>'
        + '</tbody></table></div>'
        + p('If you are comparing apps, our guide on <a href="/en/blog/choose-recipe-organizer-app/">how to choose a recipe organizer app</a> lists what to look for, whichever one you pick.')],
      ['What Matlyst doesn’t do', p('A good tool says where it stops. Here is what to expect, so nothing surprises you in the kitchen.')
        + '<ul><li><strong>It reads captions, not audio.</strong> Matlyst does not transcribe videos. If the amounts are only spoken, type them in after importing.</li>'
        + '<li><strong>It doesn’t read comments.</strong> If a creator put the recipe in a comment or behind a link in the bio, copy it in by hand or share the link to the recipe page.</li>'
        + '<li><strong>One recipe per post.</strong> If a reel shows three recipes, you will need to split them yourself.</li>'
        + '<li><strong>It does not convert units on import.</strong> Metric is the default. Units: US keeps what the source used.</li>'
        + '<li><strong>AI can make mistakes.</strong> Matlyst uses AI to read and translate recipes, so check amounts and steps before you cook, especially from photos and handwriting.</li>'
        + '<li><strong>Cook mode needs an internet connection.</strong> Reading a saved recipe works offline for up to 30 days after the last sync.</li></ul>'],
      ['Common mistakes when organizing recipes', p('These are the ones that cost people the most time.')
        + '<ul><li><strong>Saving without reading.</strong> Amounts are the part that goes wrong. Read the draft once, every time.</li>'
        + '<li><strong>Keeping five copies.</strong> Pick one place. Add a note about what you changed so next time you don’t guess.</li>'
        + '<li><strong>Saving only the video.</strong> You will rewatch it every time you cook. Save the recipe instead.</li>'
        + '<li><strong>Building the perfect folder system first.</strong> Start with a few folders like Weeknights and Holidays, and add more only when you need them.</li>'
        + '<li><strong>Forgetting the source.</strong> Keep the link to the creator on the recipe, so you can find their other recipes later.</li></ul>'],
      ['Your recipes stay yours', p('You can export all your recipes any time, for free, as a Matlyst file (a zip with folders and photos) or as HTML. Moving from Paprika? <a href="/en/import-recipes-from-paprika/">Import your Paprika export</a>, and your categories become folders.')
        + p('You can read your recipes and grocery list offline for up to 30 days after the last sync. Editing and cook mode need a connection.')
        + telefoner(skjerm('matlyst-settings-export-recipes', 'Settings with free export of all recipes as a Matlyst file or HTML.'))],
      ['Plans, limits, and sharing', p('Matlyst is free to start: 5 imports per calendar month, and the pantry shows 5 items. Saving recipes, folders, search, the meal plan, and the grocery list all work on the free plan. Matlyst Pro adds more imports, photo import, Ask Matlyst, and creating a household.')
        + p('A Pro member can create a household for up to 6 people, and joining is free. The grocery list, the weekly menu, and the pantry are shared and update live for everyone. See the <a href="/en/shopping-list/">grocery list</a> page for how sharing works.')],
    ],
  });
  return html;
})();


const ill = (fil, tekst) => animasjon({ fil: `matlyst-${fil}.mp4`, plakat: `matlyst-${fil}-poster.webp`, bredde: 540, hoyde: 960, tekst, bildetekst: `${tekst} A simplified illustration, not a screen recording.` });

const instagram = byggRik({
  svarTekst: 'Open the post or reel, tap Share, choose Matlyst, and check the draft recipe it builds from the caption. Save it, and it becomes a searchable recipe with ingredients and steps, not a bookmark you will never find again. This works when the recipe is written in the caption.',
  seksjoner: [
    ['Three ways people save Instagram recipes, and where each breaks', p('Most people use one of these. All three work for a while, and then you need the recipe.')
      + '<h3>Instagram’s own Save button</h3>'
      + p('It’s quick, and the post stays in your Saved tab. The catch is that it’s a bookmark, not a recipe. You can’t search by ingredient, scale servings, or put it on a shopping list, and if the creator deletes the post, it’s gone.')
      + '<h3>A screenshot or a copied caption</h3>'
      + p('You keep the text, but a screenshot of a long caption is hard to read later, and copied text is a wall of words in a notes app. Neither can be searched the way a real recipe can.')
      + '<h3>Saving the reel to your camera roll</h3>'
      + p('You keep the video, but the amounts are often only spoken or flashed on screen for a second. You rewatch it every time you cook.')
      + '<h3>Sharing straight to a recipe app</h3>'
      + p('The post becomes a structured recipe with ingredients, amounts, and numbered steps. That is what the rest of this guide shows.')],
    ['How to save a recipe from Instagram, step by step', ill('share-instagram-post-to-matlyst', 'Sharing an Instagram post to Matlyst in a few taps.')
      + '<ol><li><strong>Open the post or reel</strong> that has the recipe in its caption.</li>'
      + '<li><strong>Tap the Share icon</strong> (the paper airplane), then choose <strong>Share to</strong> and pick <strong>Matlyst</strong> from the app list. If you don’t see it right away, scroll the app list.</li>'
      + '<li><strong>Wait a moment</strong> while Matlyst reads the caption.</li>'
      + '<li><strong>Read the draft.</strong> Compare the amounts and steps with the post.</li>'
      + '<li><strong>Fix anything that looks off,</strong> pick a folder, and save.</li></ol>'
      + p('Prefer not to use the share menu? Copy the post link, open <strong>Add recipe</strong> in Matlyst, and choose <strong>Paste a link</strong>. If you can copy the recipe text but the link can’t be read, paste the text under <strong>Type it in</strong>.')],
    ['What we found when we tested it', p('On November 18, 2026, we imported two real reels. A short caption with 5 ingredients and 5 steps came through as 5 of 5 ingredients and 5 of 5 steps. A long caption of 1,716 characters, with 18 ingredients in three groups, came through as 18 of 18 ingredients and 5 of 5 steps, even though Instagram cuts long captions off with “… more.”')
      + p('That is two reels, not a promise. Captions vary, so read the draft every time. Amounts are the part that goes wrong.')],
    ['When the recipe is not in the caption', p('Some creators put the recipe in a comment, behind a link in the bio, or only in the video. Here is what Matlyst can and can’t do.')
      + '<ul><li><strong>Recipe in a comment or a link in the bio.</strong> Matlyst doesn’t read comments. Copy the recipe from the comment and paste it under <strong>Type it in</strong>, or share the link if it goes to a recipe page.</li>'
      + '<li><strong>Recipe only spoken in the video.</strong> It does not transcribe speech or text shown only inside a reel. Watch once, then add the amounts yourself after importing.</li>'
      + '<li><strong>Several recipes in one reel.</strong> Matlyst imports one recipe per post. Split them by hand.</li>'
      + '<li><strong>Private, deleted, or restricted posts.</strong> Matlyst needs access to a public post, so these may not be readable.</li></ul>'],
    ['What to check in the draft before you save', p('Reading the draft takes a minute, and it is the step that decides whether the recipe works. Check these in order.')
      + '<ol><li><strong>Amounts and units.</strong> Does each ingredient have a number? A missing amount usually means the creator didn’t write one. Matlyst uses metric by default, so switch Units to US in Settings if you want cups and ounces kept as the source wrote them. Matlyst does not convert between them.</li>'
      + '<li><strong>Ingredient groups.</strong> Long captions often split ingredients into groups, such as sauce, filling, and topping. Make sure nothing landed in the wrong group.</li>'
      + '<li><strong>Oven temperature and times.</strong> These are easy to miss in a long caption. Compare them with the post.</li>'
      + '<li><strong>The steps.</strong> Are they in order, and is every step something you do? Cut anything that is a joke or a hashtag.</li>'
      + '<li><strong>Language.</strong> If the caption was in another language, the recipe is translated to English. Look at ingredient names you don’t recognize.</li></ol>'
      + p('Matlyst uses AI to read and translate recipes, and AI can make mistakes. That is why the draft comes first and saving comes second.')],
    ['After you save: what you can do with the recipe', p('A saved recipe is a normal Matlyst recipe, which means you get everything else too.')
      + '<ul><li><strong>Scale it</strong> from 1 to 20 servings.</li>'
      + '<li><strong>Plan it.</strong> Add it to the weekly menu, and send the ingredients to one grocery list, combined and sorted by store section.</li>'
      + '<li><strong>Cook from it.</strong> Cook mode shows the steps as a checklist and suggests timers from the step text. It needs an internet connection.</li>'
      + '<li><strong>Adapt it.</strong> With Ask Matlyst, a Pro feature, you can ask for a vegan, quicker, or smaller version and save it as a copy.</li>'
      + '<li><strong>Take it with you.</strong> Export every recipe for free as a Matlyst file or HTML.</li></ul>'
      + p('Matlyst is free to start, with 5 imports per calendar month. Matlyst Pro adds more imports and photo import.')],
    ['Four situations, and what to do', scenarioNotat()
      + scenario('Say the caption ends with “… more”', {
        situasjon: 'You see a pasta bake, tap, and the caption is cut off after the ingredients.',
        galt: 'You save the post and later find half a recipe.',
        gjor: 'Share the post and read the draft before you save it.',
        tall: 'In our test of a long caption, all 18 ingredients and 5 steps came through.',
        matlyst: 'Share, read the draft, add anything missing, and save.' })
      + scenario('Say the amounts are only in a voice-over', {
        situasjon: 'The creator says “two cups of flour” out loud and writes nothing.',
        galt: 'Matlyst reads the caption, not the audio, so there are no amounts to import.',
        gjor: 'Watch once, then type the amounts you hear into the recipe.',
        matlyst: 'Import the post, then edit the ingredient list and save.' })
      + scenario('Say you saved 40 recipes and can’t find the soup', {
        situasjon: 'Your Instagram Saved tab is a long grid of thumbnails.',
        galt: 'You scroll for ten minutes and give up.',
        gjor: 'Move the recipes you actually cook into a searchable collection.',
        matlyst: 'Search for “lentil,” or open a folder.' })
      + scenario('Say you want the recipe for six, not four', {
        situasjon: 'A creator cooks for four, and you have guests.',
        galt: 'You do the math in your head and misjudge the salt.',
        gjor: 'Scale the servings. It’s linear, so for baking, check eggs and leavening yourself.',
        matlyst: 'Change servings from 4 to 6, from 1 to 20 in total.' })],
    ['The real problem: no amounts', p('The most common reason a saved Instagram recipe is useless is that the creator never wrote down the amounts. Matlyst can’t invent them, and it shouldn’t. When you see “salt and pepper” with no quantity, or only “a splash of soy,” treat the draft as a starting point. Taste, adjust, and save your own amounts so next time you don’t guess.')],
    ['Respect for the creator', p('Every recipe saved from Instagram shows its source: the platform and the creator’s handle, in a badge on the recipe. Tap it to open the original post, or the creator’s profile if the post link is missing, so you can return for more of their recipes. I built it this way out of respect for the people who write the recipes. When you adapt a recipe with Ask Matlyst, the copy keeps the original source, marked “adapted.”')
      + p('Matlyst saves the structured recipe and the source link. It does not download the reel as a video file.')],
    ['Common mistakes', '<ul><li><strong>Saving without checking.</strong> Always read the draft once. Amounts are what goes wrong.</li>'
      + '<li><strong>Trusting a screenshot.</strong> It is a picture, not a recipe.</li>'
      + '<li><strong>Saving only the reel.</strong> You will rewatch it every time.</li>'
      + '<li><strong>Not keeping the source.</strong> Leave the creator’s link on the recipe.</li></ul>'
      + p('Once a recipe is saved, you can scale it, add it to your <a href="/en/meal-plan-app/">meal plan</a>, and send the ingredients to your <a href="/en/shopping-list/">grocery list</a>. Looking for the bigger picture? See the <a href="/en/recipe-book-app/">recipe organizer app</a> page, or save from <a href="/en/import-recipes-from-tiktok/">TikTok</a> and <a href="/en/import-recipes-from-photos/">photos</a> too.')],
  ],
}).html;

const tiktok = byggRik({
  svarTekst: 'Open the TikTok, tap Share, choose Matlyst, and review the draft recipe built from the video’s caption. Save it, and you can search it, scale it, and shop from it. This works when the recipe is written in the caption. Short links like vm.tiktok.com work too.',
  seksjoner: [
    ['Why TikTok’s own Favorites are not enough', p('Favorites keep the video, not the recipe. You rewatch 40 seconds every time you cook, you can’t search by ingredient, and if the creator deletes the video, your recipe is gone.')],
    ['How to save a recipe from TikTok, step by step', ill('share-tiktok-video-to-matlyst', 'Sharing a TikTok to Matlyst in a few taps.')
      + '<ol><li><strong>Open the TikTok</strong> that has the recipe in its caption.</li>'
      + '<li><strong>Tap Share,</strong> then choose <strong>Matlyst</strong>. If it isn’t visible, open the app list and pick it there. You can also copy the link and paste it under <strong>Paste a link</strong> in Matlyst.</li>'
      + '<li><strong>Wait a moment</strong> while Matlyst reads the caption.</li>'
      + '<li><strong>Read the draft.</strong> Compare the amounts and steps with the video.</li>'
      + '<li><strong>Fix anything that looks off,</strong> pick a folder, and save.</li></ol>'
      + p('Short links such as vm.tiktok.com, vt.tiktok.com, and tiktok.com/t/ are supported.')],
    ['When the caption has no recipe', p('Matlyst reads the caption, not the audio. It does not transcribe speech or text shown only inside the video. If a creator says “two tablespoons of honey” out loud and writes nothing, there is nothing to import. Create the recipe by hand with the amounts you hear, or look for a written version on the creator’s profile or website. A TikTok without any text can’t be imported.')],
    ['What to check in the draft before you save', p('Take a minute with the draft. It is the step that decides whether the recipe works when you cook it.')
      + '<ul><li><strong>Amounts and units.</strong> A missing number usually means the creator didn’t write one. Metric is the default, and Units: US keeps cups and ounces as the source wrote them.</li>'
      + '<li><strong>Steps in order.</strong> TikTok captions are short and sometimes jumbled. Move or delete steps until they match the video.</li>'
      + '<li><strong>Temperatures and times.</strong> Compare them with what the creator says or shows.</li>'
      + '<li><strong>Translated names.</strong> If the caption was in another language, the recipe is translated to English. Check ingredient names you don’t recognize.</li></ul>'
      + p('Matlyst uses AI to read and translate recipes, and AI can make mistakes. Read before you cook.')],
    ['After you save', p('The recipe is now a normal Matlyst recipe. Scale it from 1 to 20 servings, add it to your <a href="/en/meal-plan-app/">meal plan</a>, and send the ingredients to your <a href="/en/shopping-list/">grocery list</a>. Open it in cook mode for a checklist and timers suggested from the steps. The free plan includes 5 imports per calendar month, and Matlyst Pro adds more.')],
    ['Four situations, and what to do', scenarioNotat()
      + scenario('Say a 30 second video shows the amounts only on screen', {
        situasjon: 'The amounts flash by and are not in the caption.',
        galt: 'You squint, miss one, and guess.',
        gjor: 'Pause, write the amounts into a new recipe, and keep the video link as the source.',
        matlyst: 'Import the video, then type the amounts you saw and save.' })
      + scenario('Say you want to cook it for six, not two', {
        situasjon: 'The creator makes a single portion, and you have guests.',
        galt: 'You multiply by three in your head and lose track of the spices.',
        gjor: 'Scale the recipe. Scaling is linear, so for baking, check eggs and leavening yourself.',
        matlyst: 'Change the servings, from 1 to 20 in total.' })
      + scenario('Say you saved ten TikTok recipes this week', {
        situasjon: 'They are all in Favorites, in no order.',
        galt: 'On Tuesday you can’t find the chicken one.',
        gjor: 'Move the ones you will cook into folders, and search by ingredient.',
        matlyst: 'Save to a Weeknight folder, then search for “chicken.”' })
      + scenario('Say the creator writes “season to taste”', {
        situasjon: 'There is no amount for the salt, the lemon, or the chili.',
        galt: 'You over or under season and never remember how much you used.',
        gjor: 'Treat it as a starting point: add a pinch, taste, adjust.',
        matlyst: 'Edit the recipe to note your final amount, so next time you don’t guess.' })],
    ['Respect for the creator', p('Every recipe saved from TikTok shows the creator’s handle and a link back to the original video, or to the creator’s profile if the video link is missing. This is out of respect for the creator, and it lets you return for more of their recipes.')],
    ['Common mistakes', '<ul><li><strong>Not reading the draft before saving.</strong> Amounts are what goes wrong.</li>'
      + '<li><strong>Expecting amounts that were only spoken.</strong> Matlyst reads text, not audio.</li>'
      + '<li><strong>Saving the video link as the recipe.</strong> Save the recipe itself.</li></ul>'
      + p('More ways to save: <a href="/en/import-recipes-from-instagram/">Instagram</a>, <a href="/en/import-recipes-from-photos/">photos</a>, and the <a href="/en/recipe-book-app/">recipe organizer app</a> overview.')],
  ],
}).html;

const pantry = byggRik({
  svarTekst: 'Add what is in your kitchen, and Matlyst shows what you have, how many days are left on each item, and which of your saved recipes use it. Items already in your pantry start unchecked on your grocery list, so you don’t buy a second jar.',
  seksjoner: [
    ['Why a pantry list helps', p('Throwing food away is usually a memory problem, not a cooking problem. You forget the spinach exists, the leftovers get pushed to the back, and a week later it’s the bin. Writing it down once means you remember it.')
      + founder(['Now I search what is in my pantry, find the miso chicken I had saved, and dinner is decided in a couple of seconds.'], 'Patrick, founder of Matlyst. We eat our way out of the fridge instead of throwing food away.')],
    ['What the pantry does in Matlyst', '<h3>It keeps a list with days left</h3>'
      + p('Add an item with an expiry date and the pantry shows how many days are left, so the thing that goes off first is at the top of your mind. On the free plan, the pantry shows 5 items.')
      + telefoner(skjerm('matlyst-pantry-expiry-dates', 'The pantry list with days left until each item expires.'))
      + '<h3>It finds recipes you already saved</h3>'
      + p('Search your own recipes by an ingredient from the fridge, like “miso,” and see what you can cook. This is plain search, so it works without AI. See <a href="/en/recipes-by-ingredients/">recipes by ingredients</a> and <a href="/en/empty-the-fridge/">using up what’s in the fridge</a>.')
      + '<h3>It suggests dinners from what you have (Pro)</h3>'
      + p('In Ask Matlyst, “Use what I have” builds dinner ideas from the items in your pantry, with cooking times. It uses AI and has a monthly allowance, so read the result before you cook.')
      + telefoner(skjerm('matlyst-ask-matlyst-use-what-i-have', 'Ask Matlyst offering Use what I have, listing the pantry items.'), skjerm('matlyst-ask-matlyst-pantry-recipe-ideas', 'Three dinner ideas built from the pantry.'))
      + '<h3>It swaps what you’re missing</h3>'
      + p('Out of buttermilk? Open the recipe and ask Ask Matlyst for a swap that uses what is in your pantry. You see the changes as a list and can undo them.')
      + '<h3>It keeps duplicates off your grocery list</h3>'
      + p('Items already in your pantry start unchecked on the <a href="/en/shopping-list/">grocery list</a>, so you don’t buy another jar of what you already have. A pantry that updates live is also shared with your household if you have one.')],
    ['How to set up your pantry in ten minutes', p('You don’t need to log your whole kitchen. A short list you keep up to date beats a perfect list you abandon.')
      + '<ol><li><strong>Start with what spoils first.</strong> Fresh produce, dairy, opened jars, and anything you bought for one recipe and have left over.</li>'
      + '<li><strong>Add an expiry date where the package has one.</strong> For fresh food without a date, add the day you bought it and use your judgment.</li>'
      + '<li><strong>Add the freezer next.</strong> Log what is in it with a date, so the oldest goes first.</li>'
      + '<li><strong>Skip the staples</strong> you never run out of, like salt and oil, until you want them on the list.</li>'
      + '<li><strong>Update it when you shop and when you cook.</strong> Two minutes then saves you ten later.</li></ol>'
      + p('On the free plan, the pantry shows 5 items. That is enough to try the habit on the things that spoil first.')],
    ['Use the pantry and the meal plan together', p('The pantry is most useful when it feeds the plan. Here is the loop that works in a normal week.')
      + '<ol><li>Open the pantry and see what expires first.</li>'
      + '<li>Search your saved recipes for those ingredients, and put two or three on the <a href="/en/meal-plan-app/">meal plan</a>.</li>'
      + '<li>Send the ingredients to the grocery list. Items already in your pantry start unchecked, so you shop for the gaps.</li>'
      + '<li>Cook, and update the pantry.</li></ol>'
      + p('You still decide what goes on the plan. Matlyst doesn’t fill the week for you.')],
    ['Sharing a pantry with your household', p('A Pro member can create a household for up to 6 people, and joining is free. The grocery list, the weekly menu, and the pantry are shared and update live for everyone. The person who just used the last eggs can take them off the list, and the person at the store sees it.')],
    ['What Matlyst doesn’t do', '<ul><li><strong>It doesn’t scan barcodes.</strong> You add items by hand.</li>'
      + '<li><strong>It doesn’t know what is really in your fridge.</strong> The list is only as good as the last time you updated it.</li>'
      + '<li><strong>It doesn’t decide food safety for you.</strong> An expiry date is a guide. Use the storage rules below and your own judgment.</li></ul>'],
    ['How long food keeps', p('These are the basic numbers from FoodSafety.gov, the U.S. government’s food safety site. It also lists storage times for hundreds of specific foods.')
      + '<div class="table-wrap"><table><thead><tr><th>What</th><th>Rule</th></tr></thead><tbody>'
      + '<tr><td>Refrigerator temperature</td><td>40°F (4°C) or below</td></tr>'
      + '<tr><td>Freezer temperature</td><td>0°F (−18°C)</td></tr>'
      + '<tr><td>Leftover cooked meat or poultry, and pizza, in the fridge</td><td>3 to 4 days</td></tr>'
      + '</tbody></table></div>'
      + p('Source: <a href="https://www.foodsafety.gov/food-safety-charts/cold-food-storage-charts">FoodSafety.gov, cold food storage chart</a>, last reviewed September 19, 2023. Freezer times are for quality only. Food kept continuously at 0°F (−18°C) stays safe.')
      + p('One more habit from professional kitchens: raw meat goes on the lowest shelf, below food that won’t be cooked again, so nothing can drip onto it. As a refrigeration technician I saw it done on purpose, every day. It costs nothing, and it works.')],
    ['Four situations, and what to do', scenarioNotat()
      + scenario('Say you have half a grilled chicken, spinach, and rice', {
        situasjon: 'It’s 6 p.m. and nothing seems to “add up.”',
        galt: 'You order takeout and the chicken goes to the bin on Friday.',
        gjor: 'Search your recipes for “chicken” and “spinach,” or ask for ideas from what you have.',
        matlyst: 'Search by ingredient, or use Ask Matlyst, a Pro feature.' })
      + scenario('Say three things expire this week', {
        situasjon: 'A tub of yogurt, a bag of spinach, and a pack of chicken thighs.',
        galt: 'You buy groceries for five new dinners and the old ones go off.',
        gjor: 'Plan two dinners around the items that expire first.',
        tall: 'Leftover cooked meat or poultry keeps 3 to 4 days in the fridge, according to FoodSafety.gov.',
        matlyst: 'Add the items, check the days left, and put matching recipes on the meal plan.' })
      + scenario('Say your freezer is a mystery', {
        situasjon: 'Unlabeled bags at the bottom of the freezer.',
        galt: 'You don’t know what they are or how old they are.',
        gjor: 'Log what is in it, so the oldest goes first.',
        tall: 'Food kept continuously at 0°F (−18°C) stays safe, but quality drops over time, according to FoodSafety.gov.',
        matlyst: 'Add each item with a date.' })
      + scenario('Say it is the week before a trip', {
        situasjon: 'The fridge is half full and you leave on Saturday.',
        galt: 'You buy a full shop and come home to spoiled food.',
        gjor: 'Plan meals from the pantry and shop only for the gaps.',
        matlyst: 'Check the pantry, plan the week, and send only what is missing to the grocery list.' })],
    ['Common mistakes', '<ul><li><strong>Logging only fresh food.</strong> The freezer and the dry cupboard waste money too.</li>'
      + '<li><strong>Never updating the list.</strong> Remove items when they are used, or the list stops being true.</li>'
      + '<li><strong>Buying duplicates.</strong> Check the pantry before you shop.</li></ul>'
      + p('Next, see how a pantry fits with the <a href="/en/meal-plan-app/">meal plan</a> and the full <a href="/en/recipe-book-app/">recipe organizer app</a>.')],
  ],
}).html;

const shopping = byggRik({
  svarTekst: 'Add a recipe, or a whole planned week, to your Matlyst grocery list and the ingredients land on one list. Matching items with the same unit are added together, the list is sorted by store section, and items already in your pantry start unchecked.',
  seksjoner: [
    ['How to make a grocery list from recipes', animasjon({ fil: 'matlyst-meal-plan-to-grocery-list.mp4', plakat: 'matlyst-meal-plan-to-grocery-list-poster.webp', bredde: 540, hoyde: 1174, tekst: 'Recipes planned for the week, then their ingredients sent to one grocery list.', bildetekst: 'From the weekly menu to one grocery list.' })
      + '<ol><li><strong>Open a recipe or your meal plan.</strong> Pick one recipe, or a day or week you have planned.</li>'
      + '<li><strong>Add it to the grocery list.</strong> The ingredients go on the list, with the amounts the recipe calls for.</li>'
      + '<li><strong>Shop by section.</strong> Items are grouped by store section, like produce, dairy, and spices. Check them off as you go.</li></ol>'
      + p('It works with any recipe in Matlyst, whether you saved it from a website, TikTok, or Instagram, or typed it in yourself. You can also add things that aren’t in a recipe, like coffee and paper towels.')],
    ['What happens when two recipes need the same thing', p('Say two recipes both need an onion. You get one line for onions, not two. Matlyst adds matching items together when they use the same unit. When the units differ, like 1 cup of one thing and 200 g of another, the two lines sit side by side so you can decide, because it does not guess how to convert them.')
      + p('The list is sorted by store section, so you walk the store once instead of crossing it twice for the one thing you forgot.')],
    ['Plan first, shop once', p('A grocery list is only as good as the plan behind it. Put the week’s dinners on the <a href="/en/meal-plan-app/">meal plan</a>, add the whole week to the grocery list, and do one trip instead of three. If you want the bigger picture of saving, organizing, and cooking recipes, see the <a href="/en/recipe-book-app/">recipe organizer app</a>.')],
    ['Skip what you already have', p('Items already in your <a href="/en/pantry-app/">pantry</a> start unchecked on the list. That’s a reminder, not a rule: you see what you already have before you buy a second jar. Check the pantry before you shop, and update it when you cook.')],
    ['Share the list with your household', p('A Pro member can create a household for up to 6 people, and joining is free. The grocery list, the weekly menu, and the pantry are shared and update live for everyone. One person plans, another shops, and the person at the store checks things off for everyone.')],
    ['Three situations, and what to do', scenarioNotat()
      + scenario('Say you’re planning five dinners for a family of four', {
        situasjon: 'One budget, one trip to the store.',
        galt: 'Two recipes both need an onion and you buy three.',
        gjor: 'Plan the week first, then shop from one merged list.',
        matlyst: 'Add the recipes to the weekly menu, add the week to the grocery list, and shop by section.' })
      + scenario('Say your partner shops on the way home', {
        situasjon: 'You planned the week, and they are at the store.',
        galt: 'You text a list and half of it gets lost in the thread.',
        gjor: 'Share one live list.',
        matlyst: 'With a Pro household, the list is shared and updates for both of you. Joining is free.' })
      + scenario('Say you want to cook a recipe for seven, not four', {
        situasjon: 'Guests are coming.',
        galt: 'You scale the recipe in your head and under-buy.',
        gjor: 'Scale the servings first, then add the recipe to the list. Scaling is linear, so for baking, check eggs and leavening yourself.',
        matlyst: 'Change the servings, from 1 to 20 in total, then add it to the grocery list.' })],
    ['What the grocery list doesn’t do', '<ul><li><strong>It doesn’t order groceries.</strong> It’s a list, not a store.</li>'
      + '<li><strong>It doesn’t convert units for you.</strong> Same units are added together, and different units appear as separate lines.</li>'
      + '<li><strong>It can misread a recipe.</strong> Matlyst uses AI to read recipes from posts and photos, so check amounts before you rely on the list.</li></ul>'],
  ],
}).html;

const kjoperguide = byggRik({
  svarTekst: 'A good recipe organizer app saves recipes from the places you actually find them, makes them searchable by ingredient, scales the amounts, and connects to a meal plan and a grocery list. Test any app with five recipes from your own life before you commit. We make Matlyst, so we say where it fits and where it doesn’t.',
  seksjoner: [
    ['Who this guide is for', p('You have recipes in too many places: screenshots, bookmarks, saved reels, a notes app, a stack of printed cards. You want one place for them. This guide lists what to look for, how to test an app in ten minutes, and the mistakes people make when they choose.')
      + p('Full disclosure: we make Matlyst, a recipe organizer app. This guide doesn’t rank apps or name competitors. It gives you criteria that work for any app, and it says honestly where Matlyst fits and where it doesn’t.')],
    ['Ten things to look for in a recipe organizer app', '<h3>1. It saves recipes from where you really find them</h3>'
      + p('Make a list of your last ten recipe discoveries. Were they on websites, Instagram, TikTok, YouTube, a photo of a page, or a message from a friend? The app should handle most of your list with one or two taps.')
      + '<h3>2. It cleans the recipe up</h3>'
      + p('A saved link is not a recipe. You want ingredients with amounts and numbered steps in the same layout every time, with the ads and the life story gone.')
      + '<h3>3. It lets you check and edit</h3>'
      + p('Imports from social posts and photos can be wrong, especially amounts. You need to read the result before you save it, fix it, and add your own notes.')
      + '<h3>4. It searches by ingredient</h3>'
      + p('The question on a Tuesday night isn’t “what’s the title of that soup,” it’s “what can I make with chicken and spinach.” Search by ingredient is the feature that turns a pile into a tool.')
      + '<h3>5. It scales servings</h3>'
      + p('Look for scaling that changes every amount at once. Remember that scaling is linear, so baking still needs your judgment on eggs, salt, and leavening.')
      + '<h3>6. It handles your units</h3>'
      + p('If you cook from American recipes, you want cups, ounces, and degrees Fahrenheit kept as written. If you cook from metric recipes, you want grams. Check whether the app converts, keeps the source units, or does neither.')
      + '<h3>7. It connects to a meal plan and a grocery list</h3>'
      + p('Organizing is half the job. The payoff is adding the week’s recipes to a plan and getting one merged grocery list, sorted by store section.')
      + '<h3>8. It works in the kitchen</h3>'
      + p('Can you cook from it with messy hands? Look for a checklist or step view, timers, and a screen that stays awake. Check whether it works offline when your Wi-Fi is bad.')
      + '<h3>9. It lets you leave</h3>'
      + p('You should be able to export all your recipes, for free, in a format you can open elsewhere. If you can’t get your recipes out, you don’t own them.')
      + '<h3>10. It is honest about its limits and its price</h3>'
      + p('Read what is free and what isn’t before you save a hundred recipes. Look for a clear description of what the app can’t do, like reading text in videos or comments.')],
    ['A ten minute test you can run on any app', p('Don’t trust a feature list. Try five real recipes.')
      + '<ol><li><strong>A recipe from a website</strong> with a long story before the ingredients.</li>'
      + '<li><strong>A recipe from Instagram or TikTok</strong> where the recipe is in the caption.</li>'
      + '<li><strong>A recipe where the amounts are only spoken</strong> in a video. See what the app does, and whether it tells you honestly.</li>'
      + '<li><strong>A photo of a printed or handwritten recipe.</strong> Check every amount against the original.</li>'
      + '<li><strong>Two recipes that both need an onion.</strong> Add both to the grocery list and see what you get.</li></ol>'
      + p('Then search by an ingredient, scale one recipe to a different number of servings, and try to export everything. If any step takes more than a couple of minutes or leaves you unsure, that is useful information.')],
    ['What apps usually get wrong', '<ul><li><strong>Silent mistakes.</strong> An app that imports a recipe with a wrong amount and shows no draft step is more dangerous than one that asks you to check.</li>'
      + '<li><strong>Pretending to read video.</strong> Many creators only say the amounts out loud. An app should tell you when it can’t read them.</li>'
      + '<li><strong>Unit surprises.</strong> Some apps convert silently and round amounts in ways that wreck a recipe.</li>'
      + '<li><strong>No way out.</strong> Your recipe collection is years of work. Make sure you can take it with you.</li></ul>'],
    ['Four situations, and what to look for', scenarioNotat()
      + scenario('Say you save recipes mostly from Instagram and TikTok', {
        situasjon: 'Your Saved tabs are full and you can’t find anything.',
        galt: 'You choose an app that only saves website links.',
        gjor: 'Pick an app that reads captions from social posts, and test it with two real posts. Check what it does when the recipe is not in the caption.',
        matlyst: 'Matlyst reads captions from Instagram and TikTok. It does not transcribe video or read comments.' })
      + scenario('Say you inherited a box of handwritten cards', {
        situasjon: 'Faded ink, “a knob of butter,” and no oven temperatures.',
        galt: 'You trust the scan and cook from it.',
        gjor: 'Use an app with photo import, and check every amount against the card. Keep the original.',
        matlyst: 'Photo import is a Matlyst Pro feature, up to 20 photos per recipe, and the result should always be checked.' })
      + scenario('Say you cook for a family of five', {
        situasjon: 'Recipes serve four, and the grocery list is long.',
        galt: 'You scale in your head and run out of salt.',
        gjor: 'Look for scaling and a grocery list that combines matching items.',
        matlyst: 'Servings scale from 1 to 20, and matching items with the same unit are added together on the grocery list.' })
      + scenario('Say you share the cooking with a partner', {
        situasjon: 'One of you plans, the other shops.',
        galt: 'You text lists and lose half the items.',
        gjor: 'Look for a shared list that updates live.',
        matlyst: 'A Pro member creates a household for up to 6 people. The grocery list, weekly menu, and pantry update live, and joining is free.' })],
    ['Where Matlyst fits, and where it doesn’t', p('We built Matlyst to solve the problem described at the top of this guide. Here is the honest summary.')
      + '<div class="table-wrap"><table><thead><tr><th>Matlyst is a good fit if you…</th><th>It is probably not for you if you…</th></tr></thead><tbody>'
      + '<tr><td>save recipes from Instagram, TikTok, websites, or photos</td><td>need the app to transcribe what is said in videos</td></tr>'
      + '<tr><td>want a meal plan and a grocery list built from your own recipes</td><td>want an app to generate a full meal plan for you</td></tr>'
      + '<tr><td>want to search by ingredient and keep a pantry</td><td>need barcode scanning for pantry items</td></tr>'
      + '<tr><td>want free export of everything you save</td><td>only cook from printed cookbooks and never save anything digitally</td></tr>'
      + '</tbody></table></div>'
      + p('Matlyst is free to start, with 5 imports per calendar month. Read more on the <a href="/en/recipe-book-app/">recipe organizer app</a> page, or see how it works with <a href="/en/import-recipes-from-instagram/">Instagram</a>, <a href="/en/import-recipes-from-tiktok/">TikTok</a>, the <a href="/en/meal-plan-app/">meal plan</a>, and the <a href="/en/shopping-list/">grocery list</a>.')],
    ['Common mistakes when choosing', '<ul><li><strong>Choosing by feature list.</strong> Test with your own recipes.</li>'
      + '<li><strong>Moving everything on day one.</strong> Start with the ten recipes you cook most.</li>'
      + '<li><strong>Not reading the import.</strong> Always check amounts.</li>'
      + '<li><strong>Ignoring export.</strong> Test it before you rely on the app.</li></ul>'],
  ],
}).html;

const ourLogo = byggRik({
  svarTekst: 'Our logo is ml., written by hand like an item on a grocery list. ml stands for milliliter, the unit that shows up in almost every recipe. The orange dot is a small mascot that can turn into whatever the recipe needs: a measuring scale, a thermometer, an egg, a Christmas ornament, a snowflake.',
  seksjoner: [
    ['Why we changed the logo', p('Our first logo was a terracotta M. When my brother-in-law saw it, he said it looked like a Teams logo. I wanted a logo that belonged to food, and an M could belong to anything.')
      + bildeFigur('/images/maskot/logo-for-etter.webp', 1100, 520, 'The old terracotta M app icon next to the new beige ml. icon with an orange dot', 'The old M on the left, the new ml. on the right.')
      + p('We switched to the new logo in October 2026. It is the one you see in the app icon, in the header of this site, and at the end of every carousel we publish.')],
    ['What ml. means', p('Almost every recipe measures something in milliliters: milk, stock, oil, vanilla. So ml. is a small piece of kitchen language that anyone who cooks already reads without thinking. We wrote it by hand, the way you would jot something on a shopping list, so it looks like it belongs on a kitchen counter and not on a corporate slide.')
      + p('The name Matlyst is Norwegian for appetite. The logo is the other half of the idea: the measuring, planning side of cooking, next to the wanting.')],
    ['The dot that turns into anything', p('The orange dot is the part that moves. In our carousels, the last slide shows ml. and the dot changes into something that fits the topic. Here are some of them.')
      + maskotGalleri([
        { fil: 'ml-skala', tekst: 'The orange dot turns into a milliliter scale marked 1 ml, 2 ml, and 3 ml.', bildetekst: 'A milliliter scale, for baking and small measures.' },
        { fil: 'dl-skala', tekst: 'The orange dot turns into a deciliter scale marked 1 dl, 2 dl, and 3 dl.', bildetekst: 'A deciliter scale, for the bigger amounts.' },
        { fil: 'termometer-180', tekst: 'The orange dot turns into a thermometer reading 180 degrees Celsius.', bildetekst: 'A thermometer, for oven and core temperatures.' },
        { fil: 'egg', tekst: 'The orange dot turns into an egg with a zigzag crack.', bildetekst: 'An egg, for everything baked and boiled.' },
        { fil: 'julekule', tekst: 'The orange dot turns into a Christmas ornament hanging from a thread.', bildetekst: 'A Christmas ornament, for the holidays.' },
        { fil: 'snoflak', tekst: 'The orange dot turns into a snowflake.', bildetekst: 'A snowflake, for freezer and thawing tips.' },
        { fil: 'krydder', tekst: 'The orange dot breaks into a trail of sprinkles, like spices.', bildetekst: 'A scatter of spices.' },
        { fil: 'snakkeboble-en', tekst: 'The orange dot turns into a speech bubble that says EN.', bildetekst: 'A speech bubble, for translation and questions.' },
      ])
      + p('Each clip is the same character in a different costume. It is the dot at the end of ml. that stays orange while everything else is ink.')],
    ['The variants', p('The logo comes in four colorways: ink on beige, cream on ink, ink on orange with a white dot, and ink on sage. The orange dot stays the one bright spot, except on orange where it turns white.')
      + bildeFigur('/images/maskot/logo-varianter.webp', 660, 900, 'Four ml. logo variants: ink on beige, cream on black, ink on orange with a white dot, and ink on sage green, plus the ml. mark next to the word matlyst', 'The four colorways, and the mark next to the wordmark.')],
    ['Common questions', p('Short answers to the things people ask about the logo are in the questions below.')],
  ],
}).html;

export const rikeSider = {
  'recipe-book-app/': {
    title: 'Recipe organizer app: one home for every recipe',
    description: 'Save recipes from websites, Instagram, TikTok, and photos in one recipe organizer app. Scale servings, plan the week, and build a grocery list. Free to start.',
    h1: 'A recipe organizer app that keeps every recipe in one place',
    rik: recipeBookApp,
    faq: [
      ['Is there a free recipe organizer app?', 'Yes. Matlyst is free to start: 5 imports per calendar month, folders, search, the meal plan, and the grocery list. Matlyst Pro adds more imports, photo import, Ask Matlyst, and household sharing.'],
      ['Can I save recipes from Instagram and TikTok?', 'Yes, by sharing the post to Matlyst. It reads the recipe from the caption. It doesn’t transcribe what’s said in the video, so if the amounts are only spoken, add them by hand after importing.'],
      ['Can I scale a recipe to more servings?', 'Yes, from 1 to 20 servings. Scaling is linear, so check eggs and leavening yourself when you bake.'],
      ['Does it work offline?', 'You can read your recipes and shopping list offline for up to 30 days after the last sync. Cook mode and editing need a connection.'],
      ['Can I share recipes and a grocery list with my household?', 'Yes. A Pro member creates the household, up to 6 people can join, and joining is free. The grocery list, weekly menu, and pantry update live for everyone.'],
      ['Which units does it use?', 'Amounts are metric by default. Switch to Units: US in Settings and Matlyst keeps the cups, ounces, and degrees Fahrenheit the source used. Recipes in other languages are translated to English.'],
      ['Can I export my recipes?', 'Yes, for free, as a Matlyst file (a zip with folders and photos) or as HTML.'],
      ['Does Matlyst work on iPhone and Android?', 'Yes. Matlyst is on the App Store and Google Play.'],
    ],
  },
  'import-recipes-from-instagram/': {
    title: 'How to save recipes from Instagram (posts and reels)',
    description: 'Save a recipe from an Instagram post or reel by sharing it to Matlyst. Steps for iPhone and Android, what to do when the recipe is not in the caption, and common mistakes.',
    h1: 'How to save recipes from Instagram',
    rik: instagram,
  },
  'import-recipes-from-tiktok/': {
    title: 'How to save recipes from TikTok: step by step',
    description: 'Turn a TikTok recipe into ingredients and steps. Share the video to Matlyst, check the draft, and cook from it. Free to start.',
    h1: 'Turn a TikTok into a recipe you can actually cook',
    rik: tiktok,
  },
  'pantry-app/': {
    title: 'Pantry app: know what you have and cook it',
    description: 'A pantry app that shows what you have, how many days are left, and which of your saved recipes use it. Add items fast and waste less food.',
    eyebrow: 'Pantry',
    h1: 'A pantry app that turns what you have into dinner',
    lead: 'Add what is in your kitchen, check what to use first, and find the recipes you already saved that use it.',
    forst: 'Start with the fridge. You can add the freezer and the dry cupboard later.',
    stegTittel: 'How to use the pantry',
    steg: [
      ['Add what you have', 'Open the pantry and add items, with an expiry date if the item has one.'],
      ['Check what to use first', 'The pantry shows how many days are left on each item.'],
      ['Cook from it', 'Search your saved recipes by an ingredient, or ask Ask Matlyst for ideas from what you have, a Pro feature.'],
    ],
    alternativ: '',
    grense: '',
    seksjoner: [],
    faqTittel: 'Pantry questions',
    rik: pantry,
    faq: [
      ['Does Matlyst scan barcodes?', 'No. You add pantry items by hand.'],
      ['Is the pantry free?', 'On the free plan, the pantry shows 5 items. Matlyst Pro adds more, along with Ask Matlyst and household sharing.'],
      ['Can Matlyst suggest dinner from what I have?', 'Yes, with Matlyst Pro. In Ask Matlyst, Use what I have builds dinner ideas from your pantry. It uses AI and has a monthly allowance, so check the result before you cook.'],
      ['Does the pantry stop me from buying duplicates?', 'Items in your pantry start unchecked on your grocery list, so you can see what you already have before you shop.'],
      ['Does it work offline?', 'You can read your recipes and grocery list offline for up to 30 days after the last sync. Editing needs a connection.'],
      ['How long do leftovers keep in the fridge?', 'According to FoodSafety.gov, leftover cooked meat or poultry keeps 3 to 4 days in a refrigerator at 40°F (4°C) or below.'],
    ],
    cta: 'Start your pantry',
  },
  'shopping-list/': {
    title: 'Grocery list from recipes: one list for the week',
    description: 'Add recipes to Matlyst and the ingredients land on one grocery list, combined and sorted by store section. Skip what you already have. Free to start.',
    h1: 'A grocery list that comes straight from your recipes',
    rik: shopping,
    faq: [
      ['Is there a grocery list app that adds ingredients from recipes?', 'Yes. In Matlyst, you add a recipe or a planned day to the grocery list, and the ingredients go on the list with matching items combined.'],
      ['Is the Matlyst grocery list free?', 'Yes, the grocery list is free. Creating a household to share a live list takes Matlyst Pro, and joining one is free.'],
      ['Can I share my grocery list with my partner?', 'Yes. A Pro member creates a household for up to 6 people. The grocery list, weekly menu, and pantry update live for everyone, and joining is free.'],
      ['Does the list sort items by store section?', 'Yes. Items are grouped by store section, like produce, meat, and dairy.'],
      ['What happens when two recipes need the same ingredient?', 'Matlyst adds matching items together when they use the same unit. When the units differ, the lines sit side by side.'],
      ['Can I add items that aren’t in a recipe?', 'Yes. Tap + and type what you need.'],
      ['Does the list know what I already have at home?', 'Items already in your pantry start unchecked on the list, so you can see what you have before you buy it.'],
    ],
  },
  'blog/choose-recipe-organizer-app/': {
    title: 'How to choose a recipe organizer app',
    description: 'Ten things to look for in a recipe organizer app, a ten minute test you can run on any app, and the mistakes people make when they choose.',
    eyebrow: 'Buyer’s guide',
    h1: 'How to choose a recipe organizer app',
    lead: 'Ten things to look for, a ten minute test, and what apps usually get wrong. Written by the people who make Matlyst, with no ranking and no competitor names.',
    forst: 'Test with your own recipes, not a feature list.',
    stegTittel: 'How to test a recipe organizer app',
    steg: [
      ['Try five real recipes', 'A website recipe, a social post, a spoken-only video, a photo of a printed recipe, and two recipes that share an ingredient.'],
      ['Search, scale, and export', 'Search by an ingredient, scale one recipe, and try to export everything.'],
      ['Decide', 'If a step is slow or leaves you unsure, that is your answer.'],
    ],
    alternativ: '',
    grense: '',
    seksjoner: [],
    faqTittel: 'Choosing a recipe organizer app',
    rik: kjoperguide,
    faq: [
      ['What is the best way to organize recipes?', 'Keep them in one place, in the same layout, with a way to search them by ingredient. A recipe organizer app does that, and links your recipes to a meal plan and a grocery list.'],
      ['What should I look for in a recipe organizer app?', 'Look for saving from the places you actually find recipes, a draft you can check and edit, search by ingredient, scaling, unit handling, a meal plan and grocery list, offline reading, and free export.'],
      ['Should a recipe app read recipes from videos?', 'It should be honest about it. Many creators only say the amounts out loud. An app should tell you when it can’t read them, so you can add them yourself.'],
      ['Is a free recipe organizer app enough?', 'For many people, yes. Check what the free plan limits, such as imports per month, before you save a large collection.'],
      ['How do I move my recipes between apps?', 'Look for export in a format other apps can open, and for an import that reads other apps’ export files. Test both before you move everything.'],
    ],
    cta: 'Try it with your own recipes',
  },
  'our-logo/': {
    title: 'The story behind the Matlyst logo',
    description: 'Why Matlyst changed its logo to ml., short for milliliter, and how the orange dot became a mascot that turns into an egg, an ornament, a thermometer and more.',
    eyebrow: 'Our logo',
    h1: 'Why our logo is ml., and why the dot keeps changing',
    lead: 'A hand-written ml. for milliliter, and an orange dot that turns into whatever the recipe needs.',
    forst: 'The short version: food-related, hand-written, and a little playful.',
    stegTittel: 'What the logo is made of',
    steg: [
      ['Two letters', 'ml., short for milliliter, the unit in almost every recipe.'],
      ['Written by hand', 'Drawn the way you would write on a grocery list.'],
      ['One orange dot', 'A mascot that turns into a scale, a thermometer, an egg, or an ornament.'],
    ],
    alternativ: '',
    grense: '',
    seksjoner: [],
    faqTittel: 'Questions about the logo',
    rik: ourLogo,
    faq: [
      ['What does ml. stand for?', 'Milliliter, the unit that appears in almost every recipe.'],
      ['Why did Matlyst change its logo?', 'The first logo was a terracotta M that could belong to any app. The new logo is about food, which is what the app is about.'],
      ['When did the logo change?', 'In October 2026.'],
      ['Why is the dot orange?', 'The dot is the mascot. It stays orange while the rest of the logo is ink, and it turns into things like a thermometer, an egg, or a Christmas ornament in our carousels.'],
      ['What does Matlyst mean?', 'Matlyst is Norwegian for appetite.'],
    ],
    cta: 'Meet the dot in the app',
  },
};

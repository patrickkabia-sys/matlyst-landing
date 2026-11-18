// Ekstra seksjoner (1,5 ganger-regelen). Liste av [H2, HTML]. Settes inn før «Common mistakes» eller sist.
import { scenario, scenarioNotat } from '../rik-sider.mjs';

export const ekstra = [
  ['A criteria matrix: what good looks like in each category', '<p>The ten points above are easier to use if you can score an app against them. This matrix describes three levels for each category: what a weak app does, what an adequate one does, and what a strong one does. Use it with your own test recipes, not with the marketing page.</p>'
    + '<div class="table-wrap"><table><thead><tr><th>Category</th><th>Weak</th><th>Adequate</th><th>Strong</th></tr></thead><tbody>'
    + '<tr><td>Saving</td><td>Saves only web links</td><td>Saves from websites and one or two social platforms</td><td>Saves from the places you really find recipes, with a share action and a paste option</td></tr>'
    + '<tr><td>Cleaning up</td><td>Stores the link or a screenshot</td><td>Extracts ingredients and steps, but with inconsistent layout</td><td>Same layout every time, amounts separated from names, steps numbered</td></tr>'
    + '<tr><td>Checking</td><td>Saves automatically, no draft</td><td>Shows a draft you can edit</td><td>Shows a draft, lets you edit every field, and tells you when it could not read something</td></tr>'
    + '<tr><td>Search</td><td>Title only</td><td>Title and tags</td><td>Title, ingredients, and folders, fast on a large collection</td></tr>'
    + '<tr><td>Scaling</td><td>None</td><td>Doubles and halves</td><td>Any number of servings, with a clear note that baking needs your judgment</td></tr>'
    + '<tr><td>Units</td><td>Converts silently</td><td>Keeps the source units</td><td>Lets you choose, and says plainly what it does and does not convert</td></tr>'
    + '<tr><td>Planning</td><td>No meal plan</td><td>A calendar you fill by hand</td><td>A meal plan that feeds one grocery list</td></tr>'
    + '<tr><td>Grocery list</td><td>A plain checklist</td><td>Adds recipe ingredients</td><td>Merges matching items, sorts by store section, and knows what is in your pantry</td></tr>'
    + '<tr><td>Cooking</td><td>A wall of text</td><td>Readable steps</td><td>A step or checklist view, timers, a screen that stays awake, and honest notes about connection needs</td></tr>'
    + '<tr><td>Sharing</td><td>Send a link</td><td>Share a recipe</td><td>A shared list and plan that update live for the people you cook with</td></tr>'
    + '<tr><td>Ownership</td><td>No export</td><td>Export in a locked format</td><td>Free export in formats you can open elsewhere</td></tr>'
    + '<tr><td>Honesty</td><td>Vague limits</td><td>Limits listed somewhere</td><td>Limits stated up front, on the page you read before you sign up</td></tr>'
    + '</tbody></table></div>'
    + '<p>You do not need every category to be strong. Decide which three matter most to you, and require those to be strong. For someone who saves mainly from social media, that is saving, checking, and honesty. For someone who cooks for a household, it is planning, the grocery list, and sharing.</p>'
    + '<h3>How to score</h3>'
    + '<p>Give each category 0, 1, or 2 points for weak, adequate, and strong. Multiply the three categories that matter most to you by two. Add it up. The point is not the number. The point is that you looked at each category on purpose instead of falling for one nice feature.</p>'],

  ['Thirty questions to ask before you commit', '<p>Questions are cheaper than a lost collection. Ask them of the app, its help pages, and yourself. If you cannot find an answer in ten minutes, treat that as an answer.</p>'
    + '<h3>Saving and importing</h3>'
    + '<ol><li>Which sources can I save from, and which can I not?</li>'
    + '<li>Do I save by sharing a post, by pasting a link, or both?</li>'
    + '<li>What happens when the recipe is only spoken in a video?</li>'
    + '<li>Does it read comments, or only the caption?</li>'
    + '<li>What happens if a post contains more than one recipe?</li>'
    + '<li>Can I import from a photo, and how many photos per recipe?</li>'
    + '<li>Do I see a draft before the recipe is saved?</li>'
    + '<li>Does it say when it could not read something, or does it guess?</li></ol>'
    + '<h3>Editing and finding</h3>'
    + '<ol start="9"><li>Can I edit every field of an imported recipe?</li>'
    + '<li>Can I add my own notes without changing the original text?</li>'
    + '<li>Does the app keep the source link, so I can find the creator again?</li>'
    + '<li>Can I search by ingredient, not only by title?</li>'
    + '<li>How does search behave with a collection of several hundred recipes?</li>'
    + '<li>Can I organize into folders, and can one recipe live in more than one?</li></ol>'
    + '<h3>Cooking, planning, shopping</h3>'
    + '<ol start="15"><li>How many servings can I scale to, and what happens to amounts like “one egg”?</li>'
    + '<li>Does it keep cups, ounces, and °F, or convert, or neither?</li>'
    + '<li>Does the meal plan connect to the grocery list?</li>'
    + '<li>When two recipes need the same ingredient, does the list merge them?</li>'
    + '<li>Is the list sorted by store section?</li>'
    + '<li>Does the app know what I already have at home?</li>'
    + '<li>Does the cooking view keep the screen awake and offer timers?</li>'
    + '<li>What works without an internet connection, and for how long?</li></ol>'
    + '<h3>People, privacy, and leaving</h3>'
    + '<ol start="23"><li>Can I share a list and a plan with the people I cook with, and how many?</li>'
    + '<li>Does the person I invite need to pay?</li>'
    + '<li>Can I export everything, for free, in a format I can open elsewhere?</li>'
    + '<li>Does the export include photos and folders?</li>'
    + '<li>Where is my data stored, and can I delete my account and everything in it?</li></ol>'
    + '<h3>Honesty and cost</h3>'
    + '<ol start="28"><li>What is free, what is paid, and what is the limit on the free plan?</li>'
    + '<li>What does the app say it cannot do?</li>'
    + '<li>If AI is used, where, and what should I double check?</li></ol>'
    + '<p>Print this list or copy it into a note. Run it against two apps side by side, and you will know more after an hour than a month of reading reviews would tell you.</p>'],

  ['A 14 day trial plan', '<p>A recipe app only proves itself when you use it for real dinners. Fourteen days covers two weekends, one grocery trip you plan, and at least one night where you are too tired to think. This plan keeps the effort small, so you finish it.</p>'
    + '<div class="table-wrap"><table><thead><tr><th>Days</th><th>What to do</th><th>What you learn</th></tr></thead><tbody>'
    + '<tr><td>1 to 2</td><td>Import the five test recipes from the ten minute test, and read each draft closely</td><td>How accurate the import is, and how much editing you do</td></tr>'
    + '<tr><td>3 to 4</td><td>Import ten more of the recipes you cook most. Make folders only as you need them</td><td>How the app feels at a normal pace</td></tr>'
    + '<tr><td>5</td><td>Search by three ingredients you have at home. Scale one recipe</td><td>Whether search and scaling are fast enough to use on a busy evening</td></tr>'
    + '<tr><td>6 to 7</td><td>Plan the week: three dinners, one grocery list. Shop from the list</td><td>Whether the list is accurate, merged, and easy to use in a store</td></tr>'
    + '<tr><td>8 to 10</td><td>Cook two recipes from the cooking view, with one phone call or interruption</td><td>Whether the cooking view helps or gets in the way</td></tr>'
    + '<tr><td>11</td><td>Turn off Wi-Fi and try to read a recipe and your list</td><td>What works offline</td></tr>'
    + '<tr><td>12</td><td>Invite someone you cook with and use the shared list together</td><td>How sharing works in practice</td></tr>'
    + '<tr><td>13</td><td>Export everything and open the file</td><td>Whether you can leave</td></tr>'
    + '<tr><td>14</td><td>Write down what annoyed you and what you did not notice, then decide</td><td>Your answer</td></tr>'
    + '</tbody></table></div>'
    + '<p>If you run this plan with Matlyst on the free plan, the 5 imports per calendar month cover the five test recipes. The ten more on days 3 to 4 need Matlyst Pro, or a slower pace.</p>'
    + '<h3>Keep a three line log</h3>'
    + '<p>After each day, write one line for what worked, one for what annoyed you, and one for what you wish it did. By day 14, patterns show. If the same annoyance appears five times, it will not go away when you pay.</p>'
    + '<h3>Decide the exit rule in advance</h3>'
    + '<p>Before you start, write down what would make you stop. For example: “If more than one in five imports has a wrong amount I only notice while cooking, I stop.” Rules you write before you are attached are easier to follow than rules you invent afterward.</p>'],

  ['How to read a free plan', '<p>A free plan is a sample. The question is whether the sample is enough to know if the full product fits you, and whether what you build on the free plan stays usable if you decide not to pay.</p>'
    + '<h3>Find the limit and write it down</h3>'
    + '<p>Free plans limit one of a few things: how many recipes you can save in total, how many you can import per month, how many items a list holds, or which features are locked. These are very different. A monthly import limit means your collection can keep growing, slowly. A total recipe cap means the app becomes a dead end the day you reach it. Read which kind it is before you save your first recipe.</p>'
    + '<h3>Check what a limit does to what you already saved</h3>'
    + '<p>Ask what happens when you hit the limit. Does the app stop you from adding more, or does it hide what you already saved? A fair free plan lets you keep, read, and export everything you have already put in. A plan that holds your recipes hostage is not a free plan, it is a trial with a trap.</p>'
    + '<h3>Look for the features that are the actual product</h3>'
    + '<p>Check whether the thing you came for is free or locked. If you want a recipe app to search by ingredient and plan the week, and those are behind the paywall, the free plan will not tell you much about the product you would pay for.</p>'
    + '<h3>Look for the same limit in the other direction</h3>'
    + '<p>Some limits apply to the people you invite. If your partner needs to pay to use the shared list, that changes what a household really costs. Ask who pays, and for what.</p>'
    + '<h3>What a good free plan feels like</h3>'
    + '<p>You can import enough recipes to run the whole ten minute test and plan a week. The limits are written on the plan page in plain language. You can export what you saved. At no point does the app make you feel that your recipes are being held. Matlyst’s free plan allows 5 imports per calendar month, and the free pantry shows 5 items. Folders, search, the meal plan, and the grocery list work on the free plan. We say that here so you can judge it against the questions above.</p>'],

  ['Privacy and ownership: what to ask', '<p>A recipe collection is not sensitive in the way a bank account is, but it says a lot about you. It shows what you eat, who you cook for, and when. If you track a diet or cook around allergies, it says more. It is also years of your own work. Both are reasons to ask a few plain questions.</p>'
    + '<h3>Who owns the recipes?</h3>'
    + '<p>Recipes you write yourself are yours. Recipes saved from other people belong to their creators, and a good app keeps the source link so you can credit and find them. Check the terms to see what the app does with the content you put in, and look for a statement that you keep your rights.</p>'
    + '<h3>Can you leave with everything?</h3>'
    + '<p>Export is the most important ownership test. Look for these things:</p>'
    + '<ul><li>A format you can open without the app, such as HTML or a plain zip of files.</li>'
    + '<li>Photos included, not just text.</li>'
    + '<li>Folders and notes included, so your organization survives.</li>'
    + '<li>No fee for exporting, and no limit on how often you do it.</li>'
    + '<li>Export that is available without contacting support.</li></ul>'
    + '<p>Try an export during the 14 day trial. A feature you have not tested is a feature you do not have.</p>'
    + '<h3>What does the app collect?</h3>'
    + '<p>Read the privacy policy for what is collected, why, and who receives it. Look for plain statements about whether data is sold, whether it is used to train models, and how long it is kept. If the app uses AI, find out which features send your recipe text to an AI service and which do not.</p>'
    + '<h3>Can you delete everything?</h3>'
    + '<p>You should be able to delete your account and your data inside the app, without writing an email. Check that it is a real option before you need it.</p>'
    + '<h3>What if the app shuts down?</h3>'
    + '<p>Any app can disappear. That is why regular exports matter. Export once a quarter and keep the file somewhere you control. It takes a minute, and it turns a possible disaster into a nuisance.</p>'
    + '<p>With Matlyst you can export all your recipes any time, for free, as a Matlyst file (a zip with folders and photos) or as HTML.</p>'],

  ['How to test import from video, photos, and handwriting', '<p>Import is where apps differ most, and where marketing pages say the least. Do not rely on a demo. Run these three tests with material you have.</p>'
    + '<h3>Test 1: a video with the recipe in the caption</h3>'
    + '<p>Pick a reel or a TikTok where the creator wrote the full recipe in the caption. Share it to the app. A good result has every ingredient with an amount and every step in order. Compare the ingredient count with the caption, line by line. Note whether the app tells you what it could not read.</p>'
    + '<h3>Test 2: a video where the amounts are only spoken</h3>'
    + '<p>This is the test that separates honest apps from the rest. Pick a video where the creator says the amounts aloud and writes nothing. A correct answer is a draft with the ingredients but no invented numbers, or a clear message that nothing could be read. A wrong answer is a recipe with confident amounts that were never there. In Matlyst’s case, it reads the caption, not the audio, and it does not read comments.</p>'
    + '<h3>Test 3: a photo of a printed page</h3>'
    + '<p>Take a photo of a page from a cookbook in good light, straight from above. Import it. Check each amount, especially fractions, and each temperature. Then test a harder one: a photo of a handwritten card with a stain or two. Expect more mistakes. The question is not whether the app makes any, it is whether it makes them visible, so you can fix them before you cook.</p>'
    + '<h3>A scoring sheet you can copy</h3>'
    + '<div class="table-wrap"><table><thead><tr><th>Check</th><th>Pass</th><th>Fail</th></tr></thead><tbody>'
    + '<tr><td>Ingredient count matches the source</td><td>Same number, or a clear reason for the difference</td><td>Items missing or invented</td></tr>'
    + '<tr><td>Every amount matches</td><td>All match, or missing ones are shown as missing</td><td>Confident numbers that are not in the source</td></tr>'
    + '<tr><td>Steps in order</td><td>Same sequence as the source</td><td>Shuffled, merged, or invented steps</td></tr>'
    + '<tr><td>Temperatures and times</td><td>Present and correct</td><td>Dropped or changed</td></tr>'
    + '<tr><td>You could edit it</td><td>Every field editable before saving</td><td>You had to save first, or could not change a field</td></tr>'
    + '</tbody></table></div>'
    + '<p>Any app that uses AI to read recipes can make mistakes, and the good ones say so. Treat the draft as a first pass you check, not a finished recipe.</p>'],

  ['What to do with your old recipes: paper, notes, and screenshots', '<p>You do not have a blank slate. You have a drawer, a camera roll, a notes app, and a saved tab. This is how to bring each one in without losing your mind or the originals.</p>'
    + '<h3>Paper: cards, clippings, and cookbook pages</h3>'
    + '<ol><li>Pull out the ones you actually cook. Leave the rest in the drawer.</li>'
    + '<li>Photograph each one in good light, straight from above, with no shadow across the page.</li>'
    + '<li>Import the photo, or type the recipe in if it is short or the writing is hard to read. In Matlyst, photo import is a Pro feature under <strong>Take photo</strong>.</li>'
    + '<li>Check every amount against the paper.</li>'
    + '<li>Keep the original. A card in your grandmother’s handwriting is worth more than the digital copy. Write “checked” on the card, so you know it has been moved.</li></ol>'
    + '<h3>Notes apps and documents</h3>'
    + '<p>If the text is already a recipe, copy it and paste it under <strong>Type it in</strong>. If it is a long note with several recipes and chat in between, split it first so that each recipe is its own paste. Then check amounts, because copying can mix up lines. If you have a lot, do ten per sitting.</p>'
    + '<h3>Screenshots</h3>'
    + '<p>A screenshot of a recipe page can often be imported as a photo, but the original post is a better source because the text is cleaner. Look in the screenshot for a creator’s name or a site name, find the original, and share that. If the original is gone, import the screenshot and check carefully. Once a recipe is saved, delete the screenshot.</p>'
    + '<h3>Saved posts and favorites</h3>'
    + '<p>Go through the Saved tab and keep only what you would really cook. Share each keeper to the app, read the draft, and save. Do not save every post. Importing a hundred recipes you will never cook is just a more expensive pile.</p>'
    + '<h3>Bookmarks</h3>'
    + '<p>A bookmark folder of recipe links is the easiest to move: paste each link, check the draft, and delete the bookmark when you have saved the recipe. If a link is dead, the recipe is gone, and that is a good reminder of why you save the text and not just the link.</p>'
    + '<h3>Do it in order of value</h3>'
    + '<p>Start with the recipes you cook most, then the ones with sentimental weight, then everything else. By the time you reach everything else, you will find that you do not miss most of it.</p>'
    + '<p>If you are moving from another recipe app, check whether it can export, and see whether your new app can import that file. Matlyst imports exports from Paprika, and the categories become folders. More on that at <a href="/en/import-recipes-from-paprika/">importing from Paprika</a>.</p>'],

  ['What a recipe app costs over time', '<p>You can compare apps without talking about price, by looking at how the cost shows up over the years. Cost is not only money. It is also time, effort, and the risk of starting over.</p>'
    + '<h3>The four costs</h3>'
    + '<ul><li><strong>Money.</strong> A subscription, a one time purchase, or free with limits. Read what each period gets you, and whether a family needs one plan or several.</li>'
    + '<li><strong>Setup time.</strong> The hours you spend moving recipes in. A fast import and a clear draft make this cost small.</li>'
    + '<li><strong>Maintenance time.</strong> The minutes per week you spend checking, editing, and organizing. If an app needs half an hour a week, you will stop using it.</li>'
    + '<li><strong>Switching cost.</strong> What it takes to leave. This is where export matters. If you cannot export, the real price of the app is every recipe you saved.</li></ul>'
    + '<h3>Think in years, not months</h3>'
    + '<p>A collection grows. Imagine your use in three years: hundreds of recipes, a household of several people, a few years of meal plans. Which app still feels light then? Which one would you be afraid to leave? A cheap app that traps your data can cost more than an expensive one that lets you go.</p>'
    + '<h3>The paying question</h3>'
    + '<p>When you hit a paywall, ask what you get for it that you will use weekly. A feature you use every week is worth more than ten you try once. Look at what is locked, and count how often you would use it in a normal month.</p>'
    + '<h3>Watch for costs that grow</h3>'
    + '<p>Check whether the plan limits grow with your use. A cap on imports per month is easy to plan around. A cap that scales with the size of your household is not. Also check what happens if you stop paying: do you keep your recipes, and can you still read them?</p>'
    + '<h3>A free tier is a legitimate choice</h3>'
    + '<p>If your needs are small, a free plan may be all you need, and there is no shame in that. Use the trial plan to find out which side you are on before you decide.</p>'],

  ['When a plain notes app is enough', '<p>We make a recipe app, and we will still tell you this: you may not need one. A notes app works well for some people, and it is better to know that now than to pay for a tool you do not use.</p>'
    + '<h3>A notes app is probably enough if</h3>'
    + '<ul><li>You cook from fewer than thirty recipes, and you know them well.</li>'
    + '<li>You rarely save recipes from social media or websites, and you type most of them yourself.</li>'
    + '<li>You cook alone or for one other person, and you do not need a shared list.</li>'
    + '<li>You do not plan a week ahead, and you shop by looking in the fridge.</li>'
    + '<li>You enjoy typing recipes in your own words, and you never scale them.</li></ul>'
    + '<h3>How to make a notes app work as well as it can</h3>'
    + '<ol><li>Use one template for every recipe: title, source, servings, ingredients, steps, notes.</li>'
    + '<li>Put the main ingredient in the title or a tag, so search finds it.</li>'
    + '<li>Keep one note per recipe, never several recipes in one note.</li>'
    + '<li>Paste the source link into each note.</li>'
    + '<li>Make a folder for each meal type, and keep it short.</li></ol>'
    + '<h3>Where a notes app starts to hurt</h3>'
    + '<p>You will feel it when you do these things: scaling a recipe by hand and making an error, building a grocery list by copying ingredients from five notes, cooking with messy hands and scrolling a long note, or finding that the recipe you saved from a video has no amounts. If you feel that friction, the cost of staying is higher than the cost of moving.</p>'
    + '<h3>You can start with a notes app and move later</h3>'
    + '<p>Notes written with a consistent template are easy to move, because you can paste each one into a recipe app, under <strong>Type it in</strong> in Matlyst. A tidy notes app is a better starting point than a messy recipe app. If you are unsure, start by tidying what you have, and move the recipes you cook most.</p>'
    + '<p>If you have already tried one app and it did not stick, the problem is rarely the app. It is more often that nothing connected the recipes to a plan and a grocery list, which is the part that makes people open the app every week. See how <a href="/en/meal-plan-app/">a meal plan</a> and a <a href="/en/shopping-list/">grocery list</a> change that, and read more about <a href="/en/import-recipes/">importing recipes</a> in general.</p>'],

  ['Four more situations, and what to look for', scenarioNotat()
    + scenario('Say you are moving from a notes app with 200 recipes', {
      situasjon: 'A decade of notes in different formats, some with only a title and a link.',
      galt: 'You try to move all 200 in one weekend, burn out, and quit at recipe 40.',
      gjor: 'Move the 30 you cook most first. Cook from the new app for a month. Then move more, only when you actually need them.',
      matlyst: 'Paste each recipe under <strong>Type it in</strong>, or share the link, check the draft, and save to a folder. On the free plan that is 5 imports per calendar month, so a move this size is a Pro job.' })
    + scenario('Say you want to try three apps before choosing', {
      situasjon: 'Three apps, one weekend, and a lot of opinions online.',
      galt: 'You import different recipes into each app and cannot compare the results.',
      gjor: 'Use the same five test recipes in all three. Fill in the scoring sheet for each, and decide from the sheet.',
      matlyst: 'Run the ten minute test with five of your own recipes and see whether the draft, search, and grocery list fit your week.' })
    + scenario('Say you cook with a friend or relative once a week', {
      situasjon: 'You plan together by text and each of you buys half the groceries.',
      galt: 'The list lives in two chats and you buy the same item twice.',
      gjor: 'Look for a shared list that updates for both of you, and check whether the second person has to pay.',
      matlyst: 'A Pro member can create a household for up to 6 people, and joining is free. The grocery list, meal plan, and pantry update live.' })
    + scenario('Say you only cook from a few video creators', {
      situasjon: 'Most of your recipes come from three accounts that post short videos.',
      galt: 'You rely on saving the videos and find that the recipes are not searchable.',
      gjor: 'Test whether the app reads the caption well, and what it does when the recipe is not in the caption.',
      matlyst: 'Share the post, check the draft, and type in any amounts that were only spoken. Matlyst reads captions, not audio or comments.' })],
];

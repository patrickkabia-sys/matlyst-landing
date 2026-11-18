// Ekstra seksjoner (1,5 ganger-regelen). Liste av [H2, HTML]. Settes inn før «Common mistakes» eller sist.
import { scenario, scenarioNotat } from '../rik-sider.mjs';

export const ekstra = [
  ['How to move 100 recipes in one weekend', '<p>A big collection feels like a big job, so people put it off for years. It isn’t one big job. It’s a hundred small ones, and most of them take under two minutes. The trick is to do them in a fixed order, so you never stop to decide what comes next.</p>'
    + '<h3>Friday evening: gather and sort (45 minutes)</h3>'
    + '<p>Don’t import anything yet. Open every place your recipes live: the Saved tab on Instagram, TikTok Favorites, your bookmarks, your notes app, your camera roll, the drawer with the printed cards. In each place, scroll once and decide, recipe by recipe, whether you have cooked it or truly want to. Be strict. A recipe you saved three years ago and never opened is a memory, not a plan.</p>'
    + '<p>Write the keepers down in three piles: <strong>cooked and loved</strong>, <strong>cooked once, would repeat</strong>, and <strong>want to try</strong>. You can do this on paper. Aim for a list you can finish, not a list that makes you feel good.</p>'
    + '<h3>Saturday morning: import the loved pile (about 90 minutes)</h3>'
    + '<p>Start with the recipes you already cook. You know what they should taste like, so you will catch a wrong amount at a glance. Share each one to Matlyst, read the recipe it builds, fix what is off, and put it in a folder. On the free plan you get 5 imports per calendar month, so a move this size needs Matlyst Pro. Websites usually come through cleanest. Posts from Instagram and TikTok depend on what the creator wrote in the caption. Do the website recipes first and the social posts second, because the second group needs more reading.</p>'
    + '<p>Keep the pace steady and work in batches of ten. After each batch, stand up, get water, and look at what you saved. A short break resets your eyes, and amounts are exactly what tired eyes miss.</p>'
    + '<h3>Saturday afternoon: handle the awkward ones (60 minutes)</h3>'
    + '<p>These are the recipes that do not import in one tap: the handwritten cards, the posts where the amounts are only spoken, the recipe someone texted you. For cards and printed pages, use <strong>Take photo</strong> on the Add tab, a Matlyst Pro feature that reads up to 20 photos at a time, and compare every amount with the original. For a spoken recipe, import the post, then type the amounts you heard. For a text message, paste it under <strong>Type it in</strong>.</p>'
    + '<h3>Sunday: plan one week, then stop</h3>'
    + '<p>This is the step that proves the system works. Pick five recipes from your new collection, add them to the meal plan, and open the grocery list. If the list looks right, you are done. If something is off, you found it with five recipes instead of a hundred.</p>'
    + '<p>Do not import the “want to try” pile in the same weekend. Leave it in your old places, and move a recipe over only when you add it to a plan. That way your collection stays a list of food you actually make, and the “want to try” pile can’t bury it.</p>'
    + '<div class="table-wrap"><table><thead><tr><th>When</th><th>What</th><th>What you end with</th></tr></thead><tbody>'
    + '<tr><td>Friday evening</td><td>Gather places, sort into three piles</td><td>A written list of keepers</td></tr>'
    + '<tr><td>Saturday morning</td><td>Import the loved pile in batches of ten</td><td>Your core recipes, checked</td></tr>'
    + '<tr><td>Saturday afternoon</td><td>Photos, spoken recipes, texts</td><td>The awkward ones, typed or photographed</td></tr>'
    + '<tr><td>Sunday</td><td>Plan five dinners and open the grocery list</td><td>Proof that it works</td></tr>'
    + '</tbody></table></div>'],

  ['A folder structure that survives', '<p>Most folder systems die for one reason: they are built for a collection you wish you had. Build folders for the collection you have. A good rule is that a folder should hold enough recipes to be worth opening, and few enough that you can scan it without searching.</p>'
    + '<h3>Pick one way to divide, not three</h3>'
    + '<p>You can sort by meal (Weeknights, Weekends, Breakfast), by main ingredient (Chicken, Fish, Vegetarian), by occasion (Holidays, Birthdays), or by source (Grandma, Instagram). The mistake is mixing these in one level. If “Chicken” and “Weeknights” are both top-level folders, a chicken weeknight dinner belongs in both, and you will put it in one and look in the other.</p>'
    + '<p>Choose the question you ask most often when you are hungry. For most people it is “what kind of dinner is this?” That makes meal type the right top level. You can find the main ingredient with search, which is faster than any folder.</p>'
    + '<h3>A starter set</h3>'
    + '<ul><li><strong>Weeknights:</strong> 30 minutes or less, one pan, few ingredients.</li>'
    + '<li><strong>Weekends:</strong> longer cooks, projects, things for guests.</li>'
    + '<li><strong>Baking:</strong> anything where precision matters.</li>'
    + '<li><strong>Holidays:</strong> the recipes that come out once a year, which are the ones you most often lose.</li>'
    + '<li><strong>Family:</strong> cards and recipes from people, with the person’s name in the title or a note.</li></ul>'
    + '<p>Five folders is enough to start. Add a sixth only when you catch yourself saving three recipes in a row that have no home.</p>'
    + '<h3>When a folder gets too big</h3>'
    + '<p>If a folder holds more than you can scan, split it by the thing that actually separates the recipes in it. A Weeknights folder that has grown large might become “Weeknights: pasta” and “Weeknights: sheet pan.” Do the split during a quiet moment, not while you are hungry, and move recipes in one sitting so you do not end up with half the recipes in each place.</p>'
    + '<h3>Use favorites for the short list</h3>'
    + '<p>Folders answer “what kind of food.” Favorites answer “what do I trust.” Mark the recipes you would cook for guests without a test run. After a few months, that short list is the one you open most.</p>'],

  ['Names and notes: how to mark a recipe you changed', '<p>Every recipe you cook more than twice gets changed. You use less sugar, swap the herb, bake it five minutes longer in your oven. If you do not write that down, you will rediscover it next time, usually after a worse dinner.</p>'
    + '<h3>Keep the source on the recipe</h3>'
    + '<p>Matlyst keeps the source link on every imported recipe, and the title is written in the language you use the app in. The link makes it easy to find the original and give credit. Put your own changes in <strong>My notes</strong> on the recipe, and keep the title as a name you will search for.</p>'
    + '<h3>Write notes in a fixed pattern</h3>'
    + '<p>A note you can scan at 6 p.m. beats a paragraph you have to read. A pattern that works:</p>'
    + '<ul><li><strong>Changed:</strong> what you did differently, such as “half the sugar, extra lemon.”</li>'
    + '<li><strong>Why:</strong> one short reason, such as “too sweet for the kids.”</li>'
    + '<li><strong>Next time:</strong> one thing to try, such as “add chili at the end.”</li></ul>'
    + '<p>Date the note if the change took several tries. “Third try” tells you the recipe is settled.</p>'
    + '<h3>Edit the recipe, or save a copy</h3>'
    + '<p>If you want to keep the original untouched, ask Ask Matlyst, a Pro feature, for the change and choose Save a copy. The copy links back to the source and is marked “adapted,” so you always see which version is the creator’s and which is yours. If you are simply correcting your own recipe, choose Replace. For a change you make by hand, edit the ingredient or step directly and put the reason in a note.</p>'
    + '<p>Ask Matlyst uses AI, and it can get things wrong, so read the changed amounts before you cook from a copy.</p>'
    + '<h3>Mark the recipes you have fixed after a bad import</h3>'
    + '<p>If you corrected an amount because the draft was wrong, add one line to the note: “Amounts checked against the original.” When you open the recipe months later, you know you can trust it. A recipe without that line is one you have not yet cooked from.</p>'],

  ['What to check, by type of recipe', '<p>Different recipes go wrong in different places. Knowing where to look makes your check of the draft faster and more reliable.</p>'
    + '<div class="table-wrap"><table><thead><tr><th>Type of recipe</th><th>Where it usually goes wrong</th><th>What to check</th></tr></thead><tbody>'
    + '<tr><td>Website recipe</td><td>Ingredient groups merged, or a step lost between two pages</td><td>Count the steps against the page. Check that sauce and topping ingredients are still separate.</td></tr>'
    + '<tr><td>Instagram or TikTok caption</td><td>Missing amounts, steps that are really comments, hashtags in the text</td><td>Every ingredient has a number, every step is something you do, nothing from the hashtags is left.</td></tr>'
    + '<tr><td>Video with spoken amounts</td><td>No amounts at all, because the caption has none</td><td>Rewatch once and type what you hear. Note “amounts typed by ear.”</td></tr>'
    + '<tr><td>Baking recipe</td><td>One wrong amount of flour, sugar, or leavening changes the result</td><td>Check flour, liquid, leavening, and the oven temperature first. Scale with care.</td></tr>'
    + '<tr><td>Photo of a printed page</td><td>Misread numbers, such as 1/3 read as 1/8</td><td>Compare each fraction and each temperature with the photo, line by line.</td></tr>'
    + '<tr><td>Handwritten card</td><td>Missing quantities, abbreviations, faded ink</td><td>Read every line against the card. Keep the original, and add the missing temperature yourself.</td></tr>'
    + '<tr><td>Recipe from a message</td><td>Mixed units and loose phrases like “a handful”</td><td>Decide on a unit, and write what a “handful” means in your kitchen.</td></tr>'
    + '<tr><td>Recipe in another language</td><td>Ingredient names that were translated oddly</td><td>Read ingredient names aloud. If one sounds wrong, look it up before you shop.</td></tr>'
    + '</tbody></table></div>'
    + '<p>If you only have time for one check, check the amounts. A slightly awkward step is a nuisance. A wrong amount of salt or baking powder is a ruined dinner.</p>'],

  ['Before you cook, and after you cook', '<p>Most of what makes a kitchen feel calm happens before the heat goes on. Professional kitchens work this way: everything is ready, labeled, and in reach before service starts. You can do a small version of it at home, in about the time it takes the pan to heat.</p>'
    + '<h3>Before you cook</h3>'
    + '<ol><li><strong>Read the whole recipe once.</strong> A step like “marinate for two hours” is only useful if you read it at 2 p.m., not at 6.</li>'
    + '<li><strong>Set the servings.</strong> Change the number first, so every amount you read is the right one.</li>'
    + '<li><strong>Check the pantry and the fridge.</strong> Compare the ingredients with what you have. If you keep a pantry in Matlyst, the recipe marks the ingredients you already have. Anything missing goes on the grocery list, or gets a swap.</li>'
    + '<li><strong>Take out and measure.</strong> Put the ingredients on the counter in the order you will use them. This is the idea behind mise en place: what you need is ready before you start.</li>'
    + '<li><strong>Tap Start cooking.</strong> Cook mode shows the recipe as a checklist, keeps the screen awake, and suggests timers from the step text. It loads the recipe over the internet, so open it while you still have signal.</li></ol>'
    + '<h3>While you cook</h3>'
    + '<p>Tick off steps as you finish them, so a phone call does not cost you your place. Treat a suggested timer as a starting point. Your oven and your pan are not the creator’s, so judge by color, smell, and texture too.</p>'
    + '<h3>After you cook</h3>'
    + '<ol><li><strong>Write the note while you remember.</strong> One line: what you changed and what you would do next time. Thirty seconds now saves a rediscovery later.</li>'
    + '<li><strong>Mark a favorite if it earned one.</strong> Be honest. If you would not serve it to guests, it is not a favorite yet. If you keep a pantry, tap <strong>Update pantry</strong> in cook mode to remove what you used.</li>'
    + '<li><strong>Put leftovers away promptly.</strong> The fridge should be at 40°F (4°C) or colder, and the freezer at 0°F (-18°C). According to FoodSafety.gov, cooked meat and poultry leftovers keep for 3 to 4 days in the fridge.</li>'
    + '<li><strong>Label what you freeze.</strong> Name and date, always. The label you write today is the one that makes the oldest portion go first.</li></ol>'],

  ['When the draft looks wrong, check these', '<p>A bad draft is normal, and it is not a reason to give up on an app. Most problems come from the source, not the import. Work through these in order before you start retyping.</p>'
    + '<h3>The amounts are missing</h3>'
    + '<p>Open the original post or page. If the amounts are not there, they were never written down, and no app can invent them. If they are only spoken in a video, remember that Matlyst reads captions, not audio. Type what you hear, and add a note that you did.</p>'
    + '<h3>Half the recipe is missing</h3>'
    + '<p>Open the post and read the caption to the end. If the full recipe is there and the import still missed part of it, copy the caption and paste it under <strong>Type it in</strong>. If the recipe is in a comment, Matlyst does not read comments, so copy that text and paste it the same way. If it is behind a link in the bio, share the recipe page that link opens.</p>'
    + '<h3>Two recipes got mixed together</h3>'
    + '<p>Matlyst imports one recipe per post. If a reel shows several dishes, split them yourself: delete the second dish from the imported recipe, then add it as its own recipe under <strong>Type it in</strong>.</p>'
    + '<h3>The units look unfamiliar</h3>'
    + '<p>Look at <strong>Units</strong> in Settings. It has two choices, <strong>Metric</strong> and <strong>US</strong>, and it applies to new imports. With Metric, cups, ounces, and pounds from the source are converted to metric. With US, Matlyst keeps the source’s measurements and never converts between US and metric, so a recipe written in grams stays in grams. If the units look wrong, check the setting, then import the recipe again.</p>'
    + '<h3>The steps are out of order, or one is a joke</h3>'
    + '<p>Edit the steps directly. Delete anything that is not an action. Cook mode shows one checklist, so every extra line costs you a moment when your hands are full.</p>'
    + '<h3>The photo import misread a number</h3>'
    + '<p>This is the most common problem with handwriting and old print. Check every fraction and every temperature against the original, and retake the photo in better light if several lines are wrong. A photo taken straight from above, with no shadow across the page, reads best.</p>'
    + '<h3>You are still not sure</h3>'
    + '<p>If you cannot trust the draft after one pass, treat the recipe as unverified. Cook it once with the original beside you, correct what you learn, and write “checked” in My notes afterward.</p>'],

  ['More situations, and what to do', scenarioNotat()
    + scenario('Say you want to turn a recipe into your own', {
      situasjon: 'You have cooked a pasta bake four times and always change the same things.',
      galt: 'You keep the original recipe and remember your changes in your head. When you are tired, you cook it the old way.',
      gjor: 'Write the changes into the recipe once, with a short note on why, and keep the source link so the original is one tap away.',
      matlyst: 'Edit the ingredients and steps directly, add a note, and mark it as a favorite when it is settled.' })
    + scenario('Say you are cooking for a large group', {
      situasjon: 'A recipe for four needs to feed eleven.',
      galt: 'You multiply everything by three and your biggest pan no longer fits the amount.',
      gjor: 'Scale the servings and then look at pan size, oven space, and timing before you shop. Baking and seasoning need your judgment, because linear scaling is a starting point.',
      matlyst: 'Change servings from 4 to 11 on the recipe (it goes from 1 to 20), add it to the grocery list, and check the servings before you confirm.' })
    + scenario('Say you save a recipe for a night you are tired', {
      situasjon: 'It is Thursday, you are hungry, and you have 25 minutes.',
      galt: 'You scroll for a recipe you half remember and end up ordering food.',
      gjor: 'Keep a Weeknights folder of recipes you have already cooked, and add a note about how long they really took.',
      matlyst: 'Open Weeknights, or search for an ingredient you have, and cook from the checklist.' })
    + scenario('Say you share a kitchen with someone who cooks differently', {
      situasjon: 'You like it spicy, your partner does not.',
      galt: 'One of you edits the recipe and the other cannot tell what changed.',
      gjor: 'Write both versions in the notes, or keep a separate copy for one of you with a clear name.',
      matlyst: 'With Pro, ask Ask Matlyst for a milder version and choose Save a copy. The copy is marked “adapted,” so you can tell it from the original.' })],

  ['Kitchen habits that make a collection easier to keep', '<p>An organized collection is not a one-time project. It is a few small habits that cost almost nothing. These are borrowed from kitchens where a mistake is expensive, and scaled down to a family dinner.</p>'
    + '<h3>Everything has a place</h3>'
    + '<p>In a restaurant, you never ask where the butter is. A recipe collection works the same way. If you cannot say in one sentence which folder a recipe belongs in, the folder system needs a fix, not the recipe.</p>'
    + '<h3>Raw meat goes on the bottom shelf</h3>'
    + '<p>This is a fridge rule that also works as a planning rule. Plan the dinners with raw meat and fish early in the week, and cook them first. Store raw meat on the lowest shelf so nothing drips onto food that will not be cooked, and keep the fridge at 40°F (4°C) or colder.</p>'
    + '<h3>Rotate your stock</h3>'
    + '<p>Put the new thing behind the old thing. The same idea applies to recipes: when you add one, look at the oldest recipe in the folder and ask whether you have cooked it this year. If not, either schedule it or let it go.</p>'
    + '<h3>Label and date</h3>'
    + '<p>A container of leftovers without a date is a guessing game. Write the name and the day, and eat cooked meat and poultry within 3 to 4 days. Anything in the freezer should have a label too. Recipe notes with a date do the same job for your collection.</p>'
    + '<h3>Do a small review every month</h3>'
    + '<p>Once a month, spend ten minutes in your collection. Delete a recipe you will never cook, fix one with a wrong amount, and move one “want to try” into a plan. Ten minutes a month keeps a collection from turning back into a pile.</p>'
    + '<p>If you want to go further, read how the <a href="/en/meal-plan-app/">meal plan</a> uses your saved recipes, how the <a href="/en/shopping-list/">grocery list</a> combines them, and how the <a href="/en/pantry-app/">pantry</a> keeps track of what you have at home. When you are standing at the fridge, <a href="/en/recipes-by-ingredients/">searching recipes by ingredients</a> and <a href="/en/empty-the-fridge/">emptying the fridge</a> are the two habits that save the most food.</p>'],
];

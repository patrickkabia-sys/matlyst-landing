// Ekstra seksjoner (1,5 ganger-regelen). Liste av [H2, HTML]. Settes inn før «Common mistakes» eller sist.
import { scenario, scenarioNotat } from '../rik-sider.mjs';

export const ekstra = [
  ['A ten-minute Friday check', '<p>A pantry list stays true only if you look at it on a schedule. Pick one day, and make it the day before you plan the week or shop. Friday works well for many households because the weekend is when you cook more and shop more.</p>'
    + '<ol><li><strong>Open the pantry and read the days left.</strong> Start with whatever expires first. That is your cooking order for the next few days.</li>'
    + '<li><strong>Open the fridge and match it to the list.</strong> Anything in the fridge that is not on the list gets added. Anything on the list that is gone gets marked <strong>Used up</strong>.</li>'
    + '<li><strong>Look in the freezer.</strong> Is there something you forgot about? Put it on this week’s plan.</li>'
    + '<li><strong>Pick two dinners from what you found.</strong> Look at <strong>What can you make?</strong> in the pantry, or search your saved recipes by an ingredient, then put those recipes on the <a href="/en/meal-plan-app/">meal plan</a>.</li>'
    + '<li><strong>Only then write the grocery list.</strong> Send the planned recipes to the list and shop for the gaps.</li></ol>'
    + '<p>It takes about ten minutes once the list exists. The order matters: look first, plan second, shop last. Most wasted food comes from doing it the other way around.</p>'],

  ['First in, first out, at home', '<p>“First in, first out,” or FIFO, is how professional kitchens rotate stock. The oldest delivery gets used first, and the new one goes behind it. Patrick, who founded Matlyst, worked as a refrigeration technician and saw that rule applied in commercial kitchens. At home it needs no equipment, only a habit.</p>'
    + '<h3>What it looks like in your kitchen</h3>'
    + '<ul><li>When you unpack groceries, move the older package to the front and put the new one behind it.</li>'
    + '<li>Keep one shelf or one box for “eat this first.” Open jars, half a lemon, and the last two slices of ham go there.</li>'
    + '<li>In the freezer, write the date on every bag, and keep the oldest on top.</li>'
    + '<li>When you add an item to the pantry list, set <strong>Days until it expires</strong> from the date on the package. Matlyst does not guess this number for you, so the habit is yours.</li></ul>'
    + '<p>The list and the shelf do the same job. The shelf shows you what to grab, and the list tells you how many days are left. If you only do one of them, do the one you will actually keep up.</p>'],

  ['Where things live: fridge, cupboard, and freezer', '<p>Where you keep an item matters. Here is the short version. For storage times on a specific food, use the <a href="https://www.foodsafety.gov/food-safety-charts/cold-food-storage-charts">FoodSafety.gov storage chart</a>.</p>'
    + '<h3>The fridge</h3>'
    + '<p>Keep it at 40°F (4°C) or colder. In the commercial kitchens Patrick worked around, raw meat, poultry, and fish went on the lowest shelf so nothing could drip onto other food, and that rule works just as well at home. Cooked leftovers and ready-to-eat food go above them.</p>'
    + '<h3>The cupboard</h3>'
    + '<p>Dry goods like rice, pasta, flour, canned tomatoes, and spices belong here. In Matlyst, choose the category <strong>Dry goods</strong> for them, and they are saved without an expiration date, so they never crowd the top of the list.</p>'
    + '<h3>The freezer</h3>'
    + '<p>Keep it at 0°F (-18°C). Freeze food while it is still fresh, not on its last day, and check the FoodSafety.gov chart for how long a specific food keeps there.</p>'
    + '<h3>Why this belongs on your pantry list</h3>'
    + '<p>A list that says only “chicken” is not much help. A list that says “chicken thighs (freezer)” with a countdown beside it tells you where to look and how long you planned to keep it. The item name is free text, so add the place to the name if it helps. The category (Meat, Dairy, Vegetables, or Dry goods) decides the suggested number of days, and Dry goods get none.</p>'],

  ['How to organize the freezer so you actually use it', '<p>A freezer fails when you cannot see what is in it. Food at the bottom stays for months, and the same three things get used from the top. A few small changes fix that.</p>'
    + '<ol><li><strong>Keep the front for what goes first.</strong> A freezer packed to the lid hides its bottom layer. Put the oldest items where you see them when you open the door.</li>'
    + '<li><strong>Label with the name and the date.</strong> Use a marker on the bag or a strip of tape. “Chili, Mar 3” takes five seconds. An unlabeled bag is a guess later.</li>'
    + '<li><strong>Zones, not piles.</strong> One area for meat, one for vegetables, one for cooked meals, one for bread. Use a box or a bin for each.</li>'
    + '<li><strong>Freeze in portions.</strong> Portion sizes you will actually use, like two servings, so you thaw what you need and not a whole block.</li>'
    + '<li><strong>Put it on the list.</strong> Add each freezer item to your pantry with the number of days you plan to keep it. When the countdown gets short, you know to eat it soon.</li></ol>'
    + '<p>Remember that the free plan shows 5 items. If your freezer is large, start with the 5 oldest or the 5 you most want to use up, and see whether the habit sticks.</p>'],

  ['How days left work in Matlyst', '<p>The pantry does not read dates from packages. It counts down from a number you give it, so it helps to know exactly what it does with that number.</p>'
    + '<div class="table-wrap"><table><thead><tr><th>What you see</th><th>What it means</th><th>What to do</th></tr></thead><tbody>'
    + '<tr><td>A number of days</td><td>Days left until the expiration you set</td><td>Plan the lowest numbers first.</td></tr>'
    + '<tr><td>Use tomorrow!</td><td>One day left</td><td>Put it on tomorrow’s dinner.</td></tr>'
    + '<tr><td>Use today!</td><td>The countdown has reached today</td><td>Cook it tonight, or freeze it if that suits the food.</td></tr>'
    + '<tr><td>Expired</td><td>The date you set has passed</td><td>Judge the food itself, with the storage rules, your eyes, and your nose.</td></tr>'
    + '<tr><td>Dry goods</td><td>Saved without an expiration date</td><td>Nothing to watch. It stays on the list until you mark it used up.</td></tr>'
    + '</tbody></table></div>'
    + '<p>When you add an item by hand, you type the number in <strong>Days until it expires</strong>. Matlyst fills in the amount and unit for many common items, and names like rice or pasta are saved as Dry goods without a date. Items you check off the grocery list move into the pantry with a rough default based on whether they are meat, dairy, or vegetables. That default is not a reading of the package, so if a number is far off, remove the item and add it again with the right one.</p>'
    + '<p>If you turn on <strong>Expiration reminders</strong> in Settings, Matlyst sends a notification at 8 AM when something in your pantry expires today or tomorrow. The countdown is only as good as the number you entered, and it is a reminder, not a safety check. Cooked meat and poultry leftovers keep 3 to 4 days in the fridge, according to FoodSafety.gov.</p>'],

  ['A use-it-up week', '<p>Here is a sample week for a pantry that has a few things close to the date. It is an example of a method, not a fixed plan. Replace the foods with yours.</p>'
    + '<div class="table-wrap"><table><thead><tr><th>Day</th><th>What goes first</th><th>How</th></tr></thead><tbody>'
    + '<tr><td>Monday</td><td>Raw chicken, bought most recently</td><td>Cook it first, and make enough for tomorrow’s lunch.</td></tr>'
    + '<tr><td>Tuesday</td><td>Leftover cooked chicken, soft vegetables</td><td>Use them in a soup, a rice dish, or wraps. Cooked chicken keeps 3 to 4 days in the fridge, according to FoodSafety.gov.</td></tr>'
    + '<tr><td>Wednesday</td><td>Leafy greens, herbs</td><td>Use them in a salad, an omelet, or stirred into pasta.</td></tr>'
    + '<tr><td>Thursday</td><td>Dairy near its date, bread</td><td>Bake, make a sauce, or make toast and a spread.</td></tr>'
    + '<tr><td>Friday</td><td>The Friday check</td><td>Update the list, and move leftovers you will not eat into the freezer.</td></tr>'
    + '<tr><td>Weekend</td><td>Whatever is in the freezer</td><td>Thaw one thing, and plan the next shop around the gaps.</td></tr>'
    + '</tbody></table></div>'
    + '<p>The idea is to order dinners by the countdown. In Matlyst, the pantry lists items with the fewest days left first, and <strong>What can you make?</strong> or a search by ingredient finds saved recipes for them. See <a href="/en/empty-the-fridge/">how to empty the fridge</a> for more ways to cook from what you have.</p>'],

  ['What to log first', '<p>You will not log everything, and you should not try. Rank by how much you lose when it goes bad.</p>'
    + '<div class="table-wrap"><table><thead><tr><th>Log it</th><th>Why</th></tr></thead><tbody>'
    + '<tr><td>Fresh produce and herbs</td><td>Easy to forget in the drawer, and you often buy more than one recipe needs.</td></tr>'
    + '<tr><td>Meat, poultry, and fish</td><td>Costs the most to waste, so it is worth planning early in the week.</td></tr>'
    + '<tr><td>Dairy and opened jars</td><td>They are often pushed to the back after opening.</td></tr>'
    + '<tr><td>Leftovers</td><td>Easy to lose track of, and cooked meat and poultry keep 3 to 4 days in the fridge.</td></tr>'
    + '<tr><td>Freezer items</td><td>You will not remember them in a month without a date.</td></tr>'
    + '<tr><td>Dry staples</td><td>Last of all. They are saved without an expiration date, so log them only when you want them on the list.</td></tr>'
    + '</tbody></table></div>'],

  ['Six more situations', scenarioNotat()
    + scenario('Say you bought a big bag of spinach for one recipe', {
      situasjon: 'The recipe used a handful, and the rest is in the drawer.',
      galt: 'It goes soft in the drawer before you find a second use for it.',
      gjor: 'Plan a second use right away, like eggs, soup, or pasta.',
      matlyst: 'Add the spinach with its days left, then search your recipes for “spinach.”' })
    + scenario('Say a jar is open and you cannot remember when', {
      situasjon: 'There is a half-used jar of sauce at the back of the fridge.',
      galt: 'You do not know how old it is, so you either throw it out or risk it.',
      gjor: 'Write the opening date on the lid from now on.',
      matlyst: 'Add the jar and put “opened” and the date in the name, so you see how long it has been there.' })
    + scenario('Say you cooked a big pot of chicken soup', {
      situasjon: 'It makes eight servings, and you will eat three.',
      galt: 'The rest sits in the fridge until it is too late.',
      gjor: 'Cool it, portion it, and freeze what you will not eat in 3 to 4 days.',
      tall: 'Cooked meat and poultry leftovers keep 3 to 4 days in the fridge, according to FoodSafety.gov.',
      matlyst: 'Add the frozen portions to the pantry with the days you plan to keep them.' })
    + scenario('Say you are cooking for one this week', {
      situasjon: 'Recipes are written for four, and you do not want to eat the same dish all week.',
      galt: 'You buy full packs and half of them spoil.',
      gjor: 'Scale the recipe down, and check which ingredients you already have.',
      matlyst: 'Change the servings, then add only what is missing to the grocery list.' })
    + scenario('Say you got a box of groceries from a friend', {
      situasjon: 'A mix of produce you did not choose.',
      galt: 'You only know what you did not plan.',
      gjor: 'Log all of it, then plan around the things that spoil first.',
      matlyst: 'Add each item with its days left, and open What can you make? to see which saved recipes fit.' })
    + scenario('Say two people share a kitchen', {
      situasjon: 'You each buy groceries, and each assumes the other has the basics.',
      galt: 'You end up with three jars of mustard and no butter.',
      gjor: 'Keep one list that both of you can see.',
      matlyst: 'With a Pro household, the pantry is shared and updates live. Joining is free.' })],

  ['When the list is out of date', '<p>Every pantry list drifts. Do not treat it as failure, because it is the normal state of a list kept by hand. Here is what to do.</p>'
    + '<h3>You find items that are not on the list</h3>'
    + '<p>Add them now. Do not wait for a perfect moment. It takes a few seconds, and it is the cheapest time to do it.</p>'
    + '<h3>The list says you have something you do not</h3>'
    + '<p>Mark it <strong>Used up</strong>, and notice why. Did you use it and forget to update? If so, make updating part of cooking: after you cook, tap <strong>Update pantry</strong> in cook mode and pick what you used.</p>'
    + '<h3>You have not opened it in weeks</h3>'
    + '<p>Do not try to catch up. Tap <strong>Clear pantry</strong>, and start again with only the fresh food you want to use first. A short, true list is better than a long, old one. In a shared pantry, clearing also removes the items others added, so agree on it first.</p>'
    + '<h3>A date is wrong</h3>'
    + '<p>Remove the item and add it again with the right number of days. The countdown starts from what you entered, so a wrong number gives a wrong countdown.</p>'
    + '<h3>You are sharing the list and it is a mess</h3>'
    + '<p>Agree on one rule: whoever uses the last of something removes it. In a Pro household of up to 6 people, changes show up live for everyone, so a removal by one person is seen by the others.</p>'],

  ['What a pantry list does not solve', '<p>It helps to be honest about the limits, so you do not blame the list for things it cannot do.</p>'
    + '<ul><li><strong>It does not cook for you.</strong> A list of what you have does not tell you what to make, unless you search or ask. Planning is still your job.</li>'
    + '<li><strong>It does not change what you buy.</strong> If you buy ten things for one recipe every week, the list will show it, but it will not stop you.</li>'
    + '<li><strong>It cannot see inside your fridge.</strong> There is no barcode scanning. Items you check off the grocery list move in on their own, and Update pantry in cook mode removes what you used, but everything else changes only when you change it. It is only as true as your last update.</li>'
    + '<li><strong>It is not a food safety tool.</strong> It counts down from a number you entered. Whether food is still good to eat is a judgment you make with the storage rules, and with your eyes and nose.</li>'
    + '<li><strong>It does not replace a clean fridge.</strong> A fridge that is packed, warm, or never cleaned will cause waste that no list fixes.</li></ul>'
    + '<p>What it does do is make forgotten food visible. For many kitchens, that is most of the problem. If you also want a place for the recipes themselves, see the <a href="/en/recipe-book-app/">recipe organizer app</a>, and for a guide to choosing one, read <a href="/en/blog/choose-recipe-organizer-app/">how to choose a recipe organizer app</a>.</p>'],
];

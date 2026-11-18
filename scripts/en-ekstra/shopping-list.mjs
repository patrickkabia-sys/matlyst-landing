// Ekstra seksjoner (1,5 ganger-regelen). Liste av [H2, HTML]. Settes inn før «Common mistakes» eller sist.
import { scenario, scenarioNotat } from '../rik-sider.mjs';

export const ekstra = [
  ['Build the list from a meal plan', '<p>The most reliable grocery list is a by-product of a plan. If you write the list first, you buy what you remember. If you plan first, you buy what you will cook.</p>'
    + '<ol><li><strong>Check what you already have.</strong> Open your <a href="/en/pantry-app/">pantry</a> and look at what expires first. Plan those into the first dinners of the week.</li>'
    + '<li><strong>Fill the menu.</strong> Put recipes on the <a href="/en/meal-plan-app/">meal plan</a>. You do not need to plan every meal. Four or five dinners and a couple of lunches is a realistic week.</li>'
    + '<li><strong>Send the week to the list.</strong> On the meal plan, choose <strong>Add the whole week’s recipes to your grocery list</strong>. Before anything is added, you see the ingredients, and the ones already in your pantry start deselected and marked <strong>In your pantry</strong>. Tick any you still want. Matching items are added together when the unit is the same.</li>'
    + '<li><strong>Read the list once, before you leave.</strong> Remove what you have, and add the things that are not in a recipe, like coffee, bin bags, and breakfast.</li></ol>'
    + '<p>Matlyst does not fill the menu for you. You choose the recipes, and the list follows from them.</p>'],

  ['How to walk the store by section', '<p>The list is sorted by store section, such as produce, dairy, and spices, so you can move through the store in one pass. A few habits make that pass faster.</p>'
    + '<ul><li><strong>Walk the store in your own order.</strong> Most people have a route. Do the sections in the order you walk them, and check items off as you go.</li>'
    + '<li><strong>Do cold items last.</strong> Dairy, meat, and frozen food go in the cart at the end of the trip, so they spend less time out of the cold.</li>'
    + '<li><strong>Do not shop the same section twice.</strong> If you remember something from a section you already passed, add it to the list, and see whether it is worth going back.</li>'
    + '<li><strong>Use the checked state.</strong> Check items off as they go in the cart, so what is left is what you still need.</li></ul>'
    + '<p>One boundary is worth knowing: sections come from a general store layout, not from your store. If your store puts something in an unusual place, you may need to go back for it.</p>'],

  ['Duplicates, units, and why two amounts on one line is fine', '<p>The most common surprise on a merged list is one item with two amounts beside it. It is not a bug, and here is the logic behind it.</p>'
    + '<div class="table-wrap"><table><thead><tr><th>What the recipes call for</th><th>What you see</th></tr></thead><tbody>'
    + '<tr><td>2 carrots and 3 carrots</td><td>One line: carrots, 5</td></tr>'
    + '<tr><td>2 cups of flour and 1 cup of flour</td><td>One line: flour, 3 cups</td></tr>'
    + '<tr><td>1 cup of rice and 200 g of rice</td><td>One line: rice, 1 cup · 200 g</td></tr>'
    + '<tr><td>1 onion and 150 g of onion</td><td>One line: onion, 1 · 150 g</td></tr>'
    + '<tr><td>1 red onion and 1 onion</td><td>Two lines, because the names differ</td></tr>'
    + '</tbody></table></div>'
    + '<p>Matlyst puts items with the same name on one line, and the store section comes from that name. It adds the amounts together only when the unit matches. When the units differ, it does not guess how to convert, because a wrong guess is worse than showing both. You see both amounts side by side and decide. At the store, that usually takes a few seconds: you pick one bag of rice that covers both.</p>'
    + '<h3>How to keep your list tidy</h3>'
    + '<p>The units come from the recipes. If a line shows two amounts and you want one, tap the amount. Matlyst explains that the amounts are in different units and lets you enter one amount and unit to replace them. After that, the line shows a single amount.</p>'],

  ['A week with leftovers', '<p>A list that ignores leftovers will make you buy too much. Plan them in, and the list gets shorter.</p>'
    + '<ol><li><strong>Cook one thing twice.</strong> A roast chicken on Sunday becomes soup or wraps on Tuesday. Plan both on the menu, and you buy one chicken.</li>'
    + '<li><strong>Cook a double batch of a base.</strong> Rice, beans, or a sauce can feed two meals.</li>'
    + '<li><strong>Keep a night open.</strong> One dinner a week with no recipe is the night you eat leftovers, and the list stays smaller.</li>'
    + '<li><strong>Respect the window.</strong> Cooked meat and poultry leftovers keep 3 to 4 days in the fridge, according to FoodSafety.gov, so plan leftover dinners early in that window, or freeze them.</li></ol>'
    + '<p>If the leftover meals are not on the plan, they will not be eaten, and the list for next week will still include the ingredients you already have. A short check of the pantry before the next shop catches it.</p>'],

  ['Budget habits that need no prices', '<p>Matlyst does not track prices, and this page does not either. You can still shop with less waste, and most of the saving comes from habits, not from numbers.</p>'
    + '<ul><li><strong>Shop with a list, and stay on it.</strong> A list does not make you buy less, but it makes you buy on purpose.</li>'
    + '<li><strong>Shop once.</strong> Every extra trip adds items that were not on the plan.</li>'
    + '<li><strong>Check the pantry first.</strong> The cheapest food is what you already own.</li>'
    + '<li><strong>Plan one meal around the item that goes first.</strong> That is wasted food avoided, which is money kept.</li>'
    + '<li><strong>Look at one recipe at a time.</strong> If a recipe needs five things you will use once, ask whether another recipe uses them too.</li>'
    + '<li><strong>Keep a few cheap staples</strong> you can cook from, like rice, pasta, beans, and canned tomatoes, so a bad day does not become takeout.</li></ul>'],

  ['Before you leave for the store', '<p>A last check takes two minutes, and it catches most mistakes.</p>'
    + '<ol><li>Is every dinner on the menu on the list?</li>'
    + '<li>Did I check the pantry, so I am not buying what I have?</li>'
    + '<li>Did I look at the lines with different units, and decide?</li>'
    + '<li>Did I add the things that are not in a recipe, like breakfast, coffee, and cleaning supplies?</li>'
    + '<li>Is my phone charged, and do I have a signal at the store?</li>'
    + '<li>Does anyone else in the household need to add something?</li></ol>'
    + '<p>On signal: Matlyst keeps your saved recipes readable offline for up to 30 days, but changes need a connection, and a change made without one is not saved. If your store has poor coverage, open the list before you go in, and redo any check marks once you have signal again.</p>'],

  ['Running a shared list at home', '<p>A shared list works when everyone follows the same rules. A Pro member creates a household of up to 6 people. Joining is free. The grocery list, the meal plan, and the pantry update live for everyone.</p>'
    + '<ul><li><strong>One person plans, anyone can shop.</strong> The planner fills the menu, and whoever goes to the store uses the same list.</li>'
    + '<li><strong>Add as you notice.</strong> The person who finishes the milk adds it. Do not wait for the weekly meeting.</li>'
    + '<li><strong>Check off in the store, live.</strong> If two people shop at once, the checked items show up for both, so you do not buy the same thing twice.</li>'
    + '<li><strong>Let the list update the pantry.</strong> Checked items move to the shared pantry on their own about 15 seconds after they are checked off, with a chance to undo. So whoever shops also updates the pantry. On the free plan, items past the first 5 wait for Pro.</li></ul>'],

  ['Six more situations', scenarioNotat()
    + scenario('Say you have two recipes that both need garlic', {
      situasjon: 'One calls for 3 cloves, the other for 1 head.',
      galt: 'You buy two bulbs because you read the two amounts as two needs.',
      gjor: 'Read the line as one need, and buy one head, which covers both.',
      matlyst: 'Different units show side by side on one line, like “3 cloves · 1 head.” You decide.' })
    + scenario('Say you shop on Saturday and cook on Monday', {
      situasjon: 'The fresh herbs are for Monday, and the rest is for Wednesday.',
      galt: 'The herbs are limp by the time you cook.',
      gjor: 'Cook the fresh-herb recipe first, and put the sturdier recipes later in the week.',
      matlyst: 'Order the days on the meal plan, and the list follows the plan.' })
    + scenario('Say you want to cook a recipe for twelve', {
      situasjon: 'A family dinner with a big table.',
      galt: 'You multiply by hand and forget an ingredient.',
      gjor: 'Scale the servings, then add the recipe to the list.',
      matlyst: 'Change the servings on the recipe (anywhere from 1 to 20), then send it to the grocery list. For baking, check leavening and eggs yourself.' })
    + scenario('Say you are halfway through the store and remember something', {
      situasjon: 'You are in the dairy aisle and need lemons.',
      galt: 'You skip it, and you come back tomorrow.',
      gjor: 'Add it to the list on the spot.',
      matlyst: 'Add the item by hand, and it appears in its store section.' })
    + scenario('Say you already have half the ingredients', {
      situasjon: 'A recipe needs eight things, and you have four.',
      galt: 'You buy all eight to be safe.',
      gjor: 'Check the pantry, and buy only the gaps.',
      matlyst: 'When you add the recipe, ingredients already in your pantry start deselected and marked In your pantry, so only the gaps go on the list.' })
    + scenario('Say someone in the household has a different plan', {
      situasjon: 'One person cooks on Tuesday and wants different ingredients.',
      galt: 'They text you a list, and it gets lost.',
      gjor: 'Put their recipe on the shared menu.',
      matlyst: 'With a Pro household, the menu and the list are shared and live.' })],

  ['When the list looks wrong', '<h3>An item shows two amounts because the units differ</h3>'
    + '<p>This is expected. Matlyst adds amounts only when the unit is the same, and shows the others side by side on the same line. Decide how much to buy. If you want a single amount, tap it and enter one amount and unit to replace both.</p>'
    + '<h3>The same item is on two lines</h3>'
    + '<p>Lines are combined when the names match. “Red onion” and “onion” are different names, so they stay apart. Rename one of them if they are the same thing for you.</p>'
    + '<h3>An item is in the wrong section</h3>'
    + '<p>Sections are worked out from the name of the item, and some names are ambiguous. If it lands somewhere odd, you can still check it off wherever it appears. Renaming the item more plainly may help, because the section follows the name.</p>'
    + '<h3>An amount looks too high or too low</h3>'
    + '<p>Matlyst uses AI to read recipes from posts and photos, so it can misread an amount. Check the original recipe, and edit the amount in Matlyst.</p>'
    + '<h3>An ingredient you need is not on the list</h3>'
    + '<p>Check whether it is in your pantry. When you add a recipe, ingredients already in your pantry start deselected, as a suggestion, not a rule. If you need more than you have, tick it in that step next time, or add it to the list by hand now.</p>'
    + '<h3>You added the same recipe twice</h3>'
    + '<p>Matlyst replaces that recipe’s items instead of doubling them, so the list shows one set, at the servings you chose last. If you plan to cook it twice, set the servings high enough to cover both meals.</p>'
    + '<h3>Your partner cannot see the list</h3>'
    + '<p>Sharing needs a household, which a Pro member creates and up to 6 people can join. Joining is free. If you are in the household and still do not see changes, check that you are online, because live updates and editing need a connection.</p>'],
];

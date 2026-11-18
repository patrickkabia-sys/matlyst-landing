// Høytidsside: Thanksgiving-rester (en-US). Tall for matsikkerhet kommer fra FoodSafety.gov; ukeplanen er hjemmekjøkken-erfaring.
import { byggRik, scenario, scenarioNotat } from './../rik-sider.mjs';

const p = (...ps) => ps.map((t) => `<p>${t}</p>`).join('');
const ul = (...li) => `<ul>${li.map((t) => `<li>${t}</li>`).join('')}</ul>`;
const ol = (...li) => `<ol>${li.map((t) => `<li>${t}</li>`).join('')}</ol>`;
const h3 = (t) => `<h3>${t}</h3>`;
const tabell = (hode, rader) => `<table><thead><tr>${hode.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rader.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;

const rik = byggRik({
  svarTekst: 'Get Thanksgiving leftovers into the refrigerator within 2 hours, in shallow containers, and eat cooked turkey and other cooked poultry or meat within 3 to 4 days. Freeze what you will not eat by then. Reheat all leftovers to 165 °F (74 °C), measured with a food thermometer. Then spread the rest across the week with a plan, so nothing ends up in the bin.',
  seksjoner: [
    ['The leftovers problem, and why it is worth solving',
      p('Thanksgiving leftovers are a gift and a small hazard. On one side, you have a refrigerator full of food that is already cooked, seasoned, and ready to turn into five or six easy dinners. On the other side, it is a lot of food, in a lot of containers, that all began warm and all need to be cooled, stored, and reheated correctly.',
        'Most waste after a big meal does not come from people disliking the leftovers. It comes from three things: food that sat out too long and had to be thrown away, food pushed to the back of the refrigerator and forgotten, and a fourth day of the same plate that nobody wanted. All three are planning problems, and all three are fixable.',
        'The food safety numbers on this page come from FoodSafety.gov: the <a href="https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures">safe minimum internal temperatures</a>, the <a href="https://www.foodsafety.gov/keep-food-safe/4-steps-to-food-safety">four steps to food safety</a>, and the <a href="https://www.foodsafety.gov/food-safety-charts/cold-food-storage-charts">cold food storage charts</a>. The meal ideas, the weekly plan, and the container advice are home cooking experience, not official figures.',
        'If you are still planning the meal itself, start with <a href="/en/holidays/thanksgiving/">the Thanksgiving plan</a>. This page picks up when the plates are cleared.')],
    ['The first two hours: cooling and putting food away',
      p('The most important leftover rule is about time, and it starts before anyone has gone home. Perishable food should not sit out for more than 2 hours, and for only 1 hour if the temperature is above 90 °F (32 °C). The reason is that the range between 40 °F (4 °C) and 140 °F (60 °C) is the danger zone, where bacteria multiply quickly. A table of warm dishes in a warm room spends most of its time in that range.')
      + h3('A simple routine for the end of the meal')
      + ol('Set a timer for 2 hours when the food goes on the table, or at the moment you sit down. You will thank yourself later.',
        'When the first people start to slow down, clear the dishes you are done with. Do not wait for everyone to finish dessert.',
        'Carve the rest of the turkey off the bone, and put the meat in shallow containers. A big pile of meat in a deep dish stays warm in the center for a long time. Spread it thin.',
        'Divide the stuffing, potatoes, and other sides into shallow containers as well. Several shallow containers cool faster than one deep one.',
        'Put them in the refrigerator right away. You do not need to wait for the food to come to room temperature first. Shallow containers help it cool quickly inside the refrigerator.',
        'Keep your refrigerator at 40 °F (4 °C) or colder. If it was packed for days beforehand, make room before dinner by moving drinks to a cooler.')
      + h3('What counts as leftovers you should not keep')
      + p('If something sat out longer than 2 hours (or 1 hour in hot weather), the safe choice is to throw it away. That includes the pie that was out on the counter all afternoon, if it contains eggs or dairy. It is a hard rule to follow when the food looks fine, but you cannot see, smell, or taste whether bacteria have grown to a harmful level.',
        'Food kept hot at 140 °F (60 °C) or above on a warming tray or in a slow cooker is not in the danger zone. If you held the food that way the whole time, the 2-hour clock does not apply in the same way, but it is still wise to refrigerate promptly once everyone has eaten.')],
    ['How long leftovers keep in the refrigerator, and in the freezer',
      p('FoodSafety.gov gives 3 to 4 days in the refrigerator for cooked meat and poultry leftovers. That is your guide for the turkey, and it is a sensible target for the rest of the table: stuffing, gravy, potatoes, and casseroles that contain meat or poultry. Count from the day you cooked, not the day you opened the container.')
      + tabell(['Leftover', 'Refrigerator (40 °F / 4 °C or colder)', 'Freezer (0 °F / -18 °C or colder)'], [
        ['Cooked turkey and other cooked poultry or meat', '3 to 4 days', 'Freezer times are about quality, not safety, so the sooner you eat it the better it tastes.'],
        ['Stuffing and casseroles containing meat or poultry', '3 to 4 days', 'Freezes well, in portions you can reheat one at a time.'],
        ['Gravy', '3 to 4 days, and reheat it to 165 °F (74 °C) before serving', 'Freezes well in small containers or ice cube trays.'],
        ['Mashed potatoes and cooked vegetables', 'Plan on 3 to 4 days, the same window as the rest of the meal', 'Freeze in portions. Texture changes, and potatoes can get grainy. They work best folded into soups.'],
        ['Cranberry sauce, rolls, and pie', 'Plan to eat them within the same window', 'Rolls and pies freeze well. Cranberry sauce freezes in small containers.'],
      ])
      + p('The freezer column deserves a note. Food kept at 0 °F (-18 °C) stays safe, and freezer storage times are about quality, not safety. That is why we are not putting a hard number in the table for freezing. Older frozen food loses flavor and texture, and a turkey sandwich from a freezer-burned slice is a worse sandwich.')
      + h3('Do not run out the clock')
      + p('The most useful habit is to decide on day one what you will eat in the next three days and what goes straight to the freezer. Do it that night, while you are packing the containers. A sticky label with the date on every container costs ten seconds and prevents most arguments about whether something is still good.')
      + p('If you are not sure about a leftover, throw it out. The cost of the food is smaller than the cost of being sick.')],
    ['Freezing leftovers the right way',
      p('The best freezer strategy is to freeze early, not on day four. If you know you will not eat the turkey within a few days, freeze it on day one, when it is at its best.')
      + ul('<strong>Portion it.</strong> Freeze turkey in meal-sized bags or containers, not in one big lump you must thaw all at once. One dinner’s worth, flat, in a zip bag, thaws quickly.',
        '<strong>Remove the air.</strong> Press out the air from freezer bags, and leave a little space in rigid containers because liquids expand.',
        '<strong>Label with the date and the contents.</strong> A frozen bag of unknown beige food is how freezers get cleaned out in the spring.',
        '<strong>Freeze the broth.</strong> Simmer the carcass for stock, strain it, cool it quickly, and freeze it in containers. It is the base for a soup, and one of the best uses of the bird.',
        '<strong>Thaw in the refrigerator.</strong> The same rule as for the raw turkey applies. Thaw on the counter and you invite bacteria. Planning ahead is the whole trick: move tomorrow’s dinner to the refrigerator tonight.')
      + p('Some things freeze poorly. Dishes with a lot of raw vegetables, such as a fresh salad, turn to mush. Crisp toppings go soft. Cream-based sauces can separate. If you are not sure, freeze a small amount first and see how it reheats.')],
    ['Reheating safely: 165 °F every time',
      p('FoodSafety.gov’s guidance is the same for every kind of leftover: reheat them to 165 °F (74 °C). That covers leftovers of all kinds, and casseroles that contain meat or poultry. Use a food thermometer, and check the thickest part of the food, away from bone, fat, and the sides of the dish.')
      + ul('<strong>Reheat only what you will eat.</strong> Every time you cool and reheat food, you give bacteria another chance to grow. Take out a portion, and leave the rest cold.',
        '<strong>Stir and cover.</strong> Stir sauces and soups while you heat them, and cover dishes in the microwave so heat spreads evenly. In a microwave, let the food rest a minute and check the temperature again, since microwaves heat unevenly.',
        '<strong>Heat gravy on the stove.</strong> Bring it to a simmer on the stove and check that it reaches 165 °F (74 °C).',
        '<strong>Do not reheat in a slow cooker from cold.</strong> A slow cooker is for keeping hot food hot, not for bringing cold leftovers up to temperature. Heat the food on the stove or in the oven first, then keep it warm.')
      + p('Be careful with a plate you assembled at the table. If it sat in front of someone for an hour, it is not a leftover, it is a plate that has been in the danger zone. Throw it away.')],
    ['A week of leftover meals, so nothing gets forgotten',
      p('The easiest way to get through a big batch of leftovers is to decide what each night’s dinner is, before you get tired of the whole thing. Below is a home cooking plan. It is a set of ideas, not a prescription. Swap in what your family likes. The key is to change the form of the food, so Friday’s turkey does not feel like Thursday’s.')
      + tabell(['Day', 'Idea', 'Why it works'], [
        ['Thursday night', 'Quick plate for anyone still hungry, then pack everything away', 'Get food into containers inside the 2-hour window.'],
        ['Friday', 'The turkey sandwich: bread, turkey, cranberry sauce, a little stuffing, and a spread of mayonnaise or mustard', 'The classic. Cold, fast, and no one has to cook after the big day.'],
        ['Saturday', 'Turkey and gravy over toast, or a hot open-faced sandwich with mashed potatoes', 'Uses the gravy and potatoes while they are still good. Reheat to 165 °F (74 °C).'],
        ['Sunday', 'Turkey soup or turkey noodle soup, made from the carcass and leftover meat', 'Stretches the last of the meat, and the stock can go in the freezer.'],
        ['Monday', 'Turkey pot pie or turkey and vegetable casserole, with a crust from the freezer', 'Transforms the leftovers into something that does not taste like Thanksgiving.'],
        ['Tuesday', 'Stuffing waffles, stuffing muffins, or a stuffing and egg breakfast bake', 'Takes the stuffing out of the 3-to-4-day window, in a new form that you reheat to 165 °F (74 °C), or 160 °F (71 °C) for the egg dish.'],
        ['Wednesday', 'Turkey tacos, quesadillas, fried rice, or a grain bowl', 'A different flavor, using the last turkey, within the 3-to-4-day guidance for the first-cooked meat, or from the freezer.'],
      ])
      + p('If your turkey was cooked on Thursday, the 3 to 4 day window for the refrigerator ends around Sunday or Monday. That means the plan above should lean on the freezer. Anything you will not eat by Sunday should be frozen on Friday. The later days in the plan are best made with food you froze and thawed in the refrigerator.')
      + h3('More ideas that use up a specific leftover')
      + ul('<strong>Mashed potatoes:</strong> potato pancakes, a topping for a shepherd’s pie, or a thickener for a soup.',
        '<strong>Stuffing:</strong> stuffed mushrooms, a bed for baked chicken, or crisped into patties in a skillet.',
        '<strong>Cranberry sauce:</strong> stirred into yogurt or oatmeal, spread on a sandwich, or used in a glaze for pork.',
        '<strong>Sweet potatoes:</strong> mashed into pancake batter or muffins, or folded into a quick bread.',
        '<strong>Green bean casserole:</strong> reheated as a side, or stirred into a turkey and rice dish.',
        '<strong>Rolls:</strong> croutons, bread pudding, or turkey sliders.',
        '<strong>Pie:</strong> eat it for breakfast. We will not judge.')],
    ['Planning it in Matlyst',
      p('Once you have decided on the week, the question is where to keep it. A note on your phone works until you want to find a recipe, a quantity, and a grocery item at the same time. Matlyst is a recipe organizer app, and it can hold the plan.')
      + h3('Save the leftover recipes in a folder')
      + p('Share a turkey soup, a pot pie, or a sandwich idea from a website, Instagram, or TikTok to Matlyst, and it becomes a recipe you can search. Put them in a folder called Leftovers, so Friday’s decision is a tap. See <a href="/en/import-recipes/">how importing works</a>. Matlyst is free to start, with 5 imports per calendar month.')
      + h3('Put the dinners on the weekly menu')
      + p('The <a href="/en/meal-plan-app/">weekly menu</a> shows a recipe on each day. Drop Friday through Wednesday into it, and the week has a shape. When plans change, move a recipe to another day instead of rewriting the whole list.')
      + h3('Share the plan with your household')
      + p('A Pro member can create a household for up to 6 people, and joining is free. The weekly menu, the grocery list, and the pantry are shared and update live. When you cook a leftover meal, the person at home and the person at the store see the same plan. See the <a href="/en/shopping-list/">grocery list</a> page for how it works.')
      + h3('Use what I have, in Ask Matlyst')
      + p('If you are staring into the refrigerator and cannot decide, “Use what I have” in Ask Matlyst builds dinner ideas from the items in your <a href="/en/pantry-app/">pantry</a>. Add the turkey, the potatoes, the cranberry sauce, and the stuffing as pantry items, and you can ask for ideas that use them. It is a Pro feature, it uses AI, and it has a monthly allowance. Read each result before you cook from it. It does not know how long your leftovers have been in the refrigerator, so the 3-to-4-day rule is on you.')
      + p('Related pages: <a href="/en/empty-the-fridge/">empty the fridge</a> for planning around what you already have, and <a href="/en/recipes-by-ingredients/">recipes by ingredients</a> for searching your own saved recipes by what is on hand.')],
    ['Two “Say you …” scenarios',
      scenarioNotat()
      + scenario('Say you hosted 10 people and have a mountain of turkey', {
        situasjon: 'It is Thursday night. The turkey is carved, but the refrigerator is already full.',
        galt: 'You put the turkey into one big container, leave it on the counter to cool, and go to bed. By morning it has been out for hours.',
        gjor: 'Carve it that night, put the meat in shallow containers, refrigerate within 2 hours, and freeze half on Friday. Simmer the carcass for stock.',
        tall: 'Cooked turkey keeps 3 to 4 days in the refrigerator, according to FoodSafety.gov.',
        matlyst: 'Save a soup recipe and a pot pie recipe in a Leftovers folder, and put them on the weekly menu for Sunday and Monday.',
      })
      + scenario('Say you only have a refrigerator full of sides and no more turkey', {
        situasjon: 'The bird is gone, but there is stuffing, potatoes, green beans, and cranberry sauce.',
        galt: 'You eat the same plate for four days and throw out the last container.',
        gjor: 'Change the shape: stuffing waffles, potato pancakes, and cranberry sauce in oatmeal. Freeze portions you will not reach.',
        matlyst: 'Add the leftovers to your pantry, open Ask Matlyst, and choose “Use what I have.” Check the suggestions before you cook, and reheat anything with meat to 165 °F (74 °C).',
      })],
    ['A last check before you eat a leftover',
      p('Run through three questions. Was it in the refrigerator within 2 hours? Has it been 3 to 4 days or less? Will it reach 165 °F (74 °C) when you reheat it? If the answer to any is no, or you are not sure, throw it out. A small loss in the bin beats a bad weekend.',
        'If you are planning ahead for the next holiday, the same habits work for <a href="/en/holidays/christmas-dinner/">Christmas dinner</a>, <a href="/en/holidays/hanukkah/">Hanukkah</a>, and <a href="/en/holidays/new-years-eve/">New Year’s Eve</a>. If you cooked for friends, see <a href="/en/holidays/friendsgiving/">Friendsgiving</a>. To compare recipe apps before you pick one, read our guide to <a href="/en/blog/choose-recipe-organizer-app/">choosing a recipe organizer app</a>, and see <a href="/en/recipe-book-app/">the recipe organizer app</a> page for what Matlyst does.')],
  ],
});

export const side = {
  title: 'Thanksgiving Leftovers: Safe Storage and a Week of Meals',
  description: 'Store Thanksgiving leftovers safely: refrigerate within 2 hours, keep 3 to 4 days, freeze the rest, reheat to 165 °F, and plan a week of leftover meals.',
  eyebrow: 'After the feast',
  h1: 'Thanksgiving leftovers: store them safely and eat them all week',
  lead: 'How to cool, store, freeze, and reheat Thanksgiving leftovers, plus a week of meals that do not feel like the same plate.',
  forst: 'Refrigerate within 2 hours, eat within 3 to 4 days, freeze the rest, and reheat to 165 °F.',
  stegTittel: 'Three rules for safe leftovers',
  steg: [
    ['Refrigerate within 2 hours', 'Put leftovers in shallow containers and into a refrigerator at 40 °F or colder.'],
    ['Eat within 3 to 4 days or freeze', 'Cooked turkey and other cooked poultry keep 3 to 4 days in the refrigerator. Freeze what you will not eat by then.'],
    ['Reheat to 165 °F', 'Use a food thermometer in the thickest part, and reheat only the portion you will eat.'],
  ],
  alternativ: '',
  grense: '',
  seksjoner: [],
  faqTittel: 'Thanksgiving leftovers questions',
  rik: rik.html,
  faq: [
    ['How long do Thanksgiving leftovers last in the refrigerator?', 'Cooked turkey and other cooked meat and poultry keep 3 to 4 days in a refrigerator at 40 °F (4 °C) or colder, according to FoodSafety.gov.'],
    ['How long can Thanksgiving food sit out?', 'Perishable food should not sit out for more than 2 hours, or 1 hour if it is hotter than 90 °F (32 °C). After that, the safe choice is to throw it away.'],
    ['What temperature should I reheat leftovers to?', 'Reheat all leftovers to 165 °F (74 °C), measured with a food thermometer in the thickest part of the food.'],
    ['Can I freeze Thanksgiving leftovers?', 'Yes. Food kept at 0 °F (-18 °C) or colder stays safe, and freezer times are about quality. Freeze in meal-sized portions, and label them with the date.'],
    ['How should I thaw frozen leftovers?', 'Thaw them in the refrigerator, not on the counter. Plan ahead by moving tomorrow’s dinner to the refrigerator tonight.'],
    ['Should I cool leftovers before refrigerating them?', 'Divide them into shallow containers and put them in the refrigerator quickly, within 2 hours. Shallow containers help the food cool fast.'],
    ['Can I reheat leftovers more than once?', 'It is best to reheat only the portion you will eat. Each time food is cooled and reheated, bacteria get another chance to grow.'],
    ['Is it safe to eat turkey on day five?', 'The 3 to 4 day guidance is for the refrigerator. If you are not sure how long it has been, or it is past that window, throw it out, or freeze it earlier next time.'],
    ['What can I make with Thanksgiving leftovers?', 'Turkey sandwiches, turkey soup from the carcass, pot pie, tacos, fried rice, stuffing waffles, and potato pancakes are all common ideas.'],
    ['Can I put leftovers in a slow cooker to reheat them?', 'A slow cooker is for keeping hot food hot, not for bringing cold food up to temperature. Reheat on the stove or in the oven first, to 165 °F (74 °C).'],
    ['How does Matlyst help with leftovers?', 'You can save leftover recipes in a folder, put them on the weekly menu, and share the plan with a household. “Use what I have” in Ask Matlyst, a Pro feature that uses AI, suggests dinner ideas from your pantry.'],
    ['Is Ask Matlyst free?', 'Ask Matlyst is a Matlyst Pro feature. It uses AI and has a monthly allowance, so read the result before you cook from it.'],
  ],
  cta: 'Plan your leftovers in Matlyst',
};

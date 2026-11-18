// Høytidsside: New Year's Eve og New Year's Day (en-US).
import { byggRik, scenario, scenarioNotat } from './../rik-sider.mjs';

const p = (...ps) => ps.map((t) => `<p>${t}</p>`).join('');
const ul = (...li) => `<ul>${li.map((t) => `<li>${t}</li>`).join('')}</ul>`;
const ol = (...li) => `<ol>${li.map((t) => `<li>${t}</li>`).join('')}</ol>`;

const html = byggRik({
  svarTekst: 'For New Year’s Eve, pick a format first (a grazing table, a seated dinner, or a quiet dinner for two), then work backward from midnight. Choose food that holds well, make as much as you can the day before, keep hot food at 140 °F (60 °C) or warmer and cold food at 40 °F (4 °C) or colder, and plan what you will eat on New Year’s Day so the leftovers have a job. Then use the first week of January to empty the fridge and set up a simple plan for the month.',
  seksjoner: [
    ['Why New Year’s Eve food is its own kind of planning', p(
      'Most holiday meals have one moment: the dinner. New Year’s Eve has several. There is the early evening when people arrive and are hungry, the long stretch of the party where food needs to be easy to eat with one hand, the countdown, and then the next morning, when someone wants a real breakfast and a refrigerator full of half-used party food is waiting.',
      'That shape changes how you cook. The food has to be good at room temperature or easy to keep hot. It has to survive being picked at for hours. And it has to leave you with something sensible to do with it on January 1.',
      'This page is a practical plan, written from home-cooking experience. It covers choosing a format, building a finger food timeline, make-ahead strategy, rules of thumb for how much to make, how to run a seated dinner or a buffet, dinner for two, vegetarian options, New Year’s Day food, and emptying the fridge before the new year begins. The food safety numbers come from <a href="https://www.foodsafety.gov/keep-food-safe/4-steps-to-food-safety" rel="noopener">FoodSafety.gov</a>. If you are coming straight off another holiday, see the <a href="/en/holidays/christmas-dinner/">Christmas dinner</a> page, and for a different kind of festive table, see <a href="/en/holidays/hanukkah/">Hanukkah</a>.'
    )],

    ['Pick a format before you pick a menu', p('The single biggest decision is not what to cook. It is how people will eat. Each format has its own logic.') + ul(
      '<strong>A grazing table or finger food party.</strong> Guests come and go, eat standing up, and drink more than they eat. This format is forgiving, easy to scale, and mostly made ahead. It is the right choice for a crowd, a small space, or a host who wants to be at the party and not in the kitchen.',
      '<strong>A buffet.</strong> A few bigger dishes, put out together, with plates and cutlery. Good for a group that wants to sit and eat something substantial, and you do not have the time or staff to plate each dinner.',
      '<strong>A seated dinner.</strong> Courses, a table, and a timeline. It takes more work and more attention, but the evening feels like an occasion. Choose it for a smaller group, and only if you are comfortable serving food while talking.',
      '<strong>A dinner for two.</strong> A special meal at a normal pace, with a menu you actually enjoy cooking. We cover that below.',
      '<strong>No dinner at all.</strong> Some people go out for the evening and plan only the day after. That is a perfectly good plan, and the New Year’s Day section is for you.'
    ) + p('Tell guests the format in the invitation. “Come hungry for a full dinner” and “come for drinks and bites” lead to very different evenings, and people plan their own meals around the answer.')],

    ['Finger food that holds up for hours', p(
      'A good party bite is easy to eat with one hand, does not need a knife, tastes fine warm or at room temperature, and does not fall apart after sitting out a while. Most of the classics qualify for a reason.'
    ) + ul(
      '<strong>Things on a stick or skewer:</strong> meatballs, caprese skewers, shrimp, marinated vegetables. Skewers keep hands clean and portions obvious.',
      '<strong>Dips with something to dip:</strong> a warm cheese dip in a slow cooker, a bean dip, hummus, a cold spinach dip. Put out more to dip than you think you need, because the vessels run out before the dip does.',
      '<strong>Small sandwiches and sliders:</strong> assemble in a pan, bake together, and cut apart. Warm rolls hold their heat under foil.',
      '<strong>Baked things:</strong> puff pastry bites, stuffed mushrooms, cheese straws, mini quiches. They reheat well and look generous.',
      '<strong>Cold things that taste good cold:</strong> deviled eggs, a cheese and charcuterie board, marinated olives, pickles, crudités.',
      '<strong>Something sweet and small:</strong> chocolate bark, truffles, cookies, little tarts. Nobody wants a plated dessert late at night.',
      '<strong>One substantial thing:</strong> a pot of chili, a soup in mugs, a baked pasta, or a big tray of macaroni. People get hungry later than they think.'
    ) + p(
      'Aim for variety in texture and temperature. Crunchy, creamy, salty, and something fresh to cut through the rest. A board with only rich things is tiring by midnight.',
      'A rule of thumb from home cooking, not a rule from any authority: if the party starts in the early evening and is the only meal, people eat more than you expect. If it starts late and everyone has had dinner, they eat much less. Ask yourself whether this is dinner or a snack, and plan the volume accordingly.'
    )],

    ['A finger food timeline you can follow', p('Here is a working timeline. It runs backward from the time guests arrive, and it assumes most of the work is done before anyone shows up.') + ol(
      '<strong>Several days before:</strong> choose the menu, save the recipes, make the grocery list, and order or buy anything that is hard to find. Buy drinks and non-alcoholic options at the same time.',
      '<strong>Two days before:</strong> shop for perishables. Make anything that keeps well, such as a spiced nut mix, a pickle, or a dip that improves overnight. Clear room in the refrigerator for the party food.',
      '<strong>The day before:</strong> make cold dishes, assemble anything that can be baked from cold the next day, chop vegetables, and set out serving dishes with sticky notes on them saying what goes where. Set up the drink station.',
      '<strong>The morning of:</strong> prepare the baking sheets and the platters. Leave perishable food in the refrigerator until shortly before it is used or served, so the 2-hour clock does not start in the morning. Set out napkins and plates.',
      '<strong>An hour or two before guests arrive:</strong> bake the first round. Put anything that will be held hot into a slow cooker, chafing dish, or warm oven set at or above 140 °F (60 °C).',
      '<strong>As guests arrive:</strong> put out the cold dishes and the first hot dishes. Keep the rest in the kitchen.',
      '<strong>During the party:</strong> refill small amounts rather than putting everything out at once. Check the clock: perishable food should not sit out for more than 2 hours.',
      '<strong>Before midnight:</strong> put out the sweet things and sparkling drinks. Start tidying what you can so the morning is easier.',
      '<strong>After the countdown:</strong> put leftovers in shallow containers and into the refrigerator. Do it before bed, not in the morning.'
    )],

    ['Make-ahead: the thing that makes you a guest at your own party', p(
      'The host who enjoys the party is the host who cooked yesterday. Almost everything on a New Year’s Eve table can be made ahead if you choose it that way. Here is what works well.'
    ) + ul(
      '<strong>Dips and spreads</strong> often taste better after a night in the refrigerator, because the flavors settle. Make them the day before and bring them out to take the chill off.',
      '<strong>Marinated items</strong>, such as olives, vegetables, and cheese, are happy in the refrigerator for a day or two.',
      '<strong>Anything you assemble and bake:</strong> sliders, stuffed pastry, baked pasta. Put them in the pan, cover, and keep them cold. Bake on the day.',
      '<strong>Sauces</strong> can be made and reheated. A sauce that reheats poorly is a bad choice for a party.',
      '<strong>Desserts</strong> that set in the refrigerator, such as a cheesecake or a pot of mousse, are the easiest choice for a crowd.',
      '<strong>Soups, stews, and chili</strong> are best made a day ahead and reheated to 165 °F (74 °C), then held at 140 °F (60 °C) or warmer.'
    ) + p(
      'What not to make ahead: anything that has to be crisp (fried things, fresh puff pastry straight from the oven) loses its texture if held too long. Salads with dressing go limp. Anything with raw seafood needs to be cold and fresh, and should be bought as close to the day as possible. Leave those for the last hour, or choose something else.',
      'In Matlyst, put the party menu in one folder, then use <a href="/en/meal-plan-app/">meal plan</a> to place each recipe on the day you will make it. The day-before dishes go on the day before, the party dishes go on the party day, and the meal plan shows you the whole thing at a glance. If you live with other people, a household makes the meal plan, the grocery list, and the pantry shared and live. See <a href="/en/shopping-list/">the grocery list page</a> for how the list merges ingredients.'
    )],

    ['How much to make: rules of thumb, not rules', p(
      'Quantities are the part everyone worries about. There is no exact answer, because it depends on the guests, the time of day, and whether this is dinner. These are guidelines drawn from home-cooking experience, not from any authority.'
    ) + ul(
      '<strong>For a grazing party that is the only food,</strong> plan on several different savory items per person, and expect most guests to try everything. Variety beats volume.',
      '<strong>For a party after dinner,</strong> plan much less. A few bites, a board, and something sweet is enough.',
      '<strong>For dips,</strong> plan more to dip than dip. Chips, crackers, bread, and vegetables run out first.',
      '<strong>For the sweet things,</strong> plan on one or two small pieces each, and expect some people to skip them.',
      '<strong>For drinks,</strong> plan on a steady supply of non-alcoholic options, water, and ice. Ice is the thing that runs out. If guests are traveling home, keep sparkling water and something warm on offer.',
      '<strong>For leftovers,</strong> a little is a plus. Next-day food is welcome. A lot is a problem, because it is hard to store safely.'
    ) + p(
      'Matlyst can scale any saved recipe from 1 to 20 servings, in a straight line. Use it to resize a dip or a baked dish for your crowd. Then check the details by hand: baking powder, baking soda, and yeast do not always scale in a straight line, and strong spices and salt are easy to overshoot. Taste as you go.'
    )],

    ['Keeping party food safe', p(
      'A party is a long time to have food out. These are the points that matter, from <a href="https://www.foodsafety.gov/keep-food-safe/4-steps-to-food-safety" rel="noopener">FoodSafety.gov</a>.'
    ) + ul(
      '<strong>The danger zone is 40 °F (4 °C) to 140 °F (60 °C).</strong> Bacteria multiply fastest there, so keep food out of that range.',
      '<strong>Hot food stays at 140 °F (60 °C) or warmer.</strong> Use a chafing dish, a warming tray, a slow cooker on warm, or a low oven.',
      '<strong>Cold food stays at 40 °F (4 °C) or colder.</strong> Put cold dishes over ice or swap in a fresh bowl from the refrigerator every so often.',
      '<strong>Two hours is the limit</strong> for perishable food at room temperature, and one hour if the room is above 90 °F (32 °C). A party that lasts all night should put out small amounts and refill them, not leave one big platter out.',
      '<strong>Wash your hands for 20 seconds</strong> before you handle food, and use a separate cutting board for raw meat.',
      '<strong>Cook to the right temperature.</strong> Poultry and stuffing reach 165 °F (74 °C), and that includes ground poultry. Ground beef or pork, such as most meatballs, reaches 160 °F (71 °C). Use a food thermometer.',
      '<strong>Refrigerate leftovers</strong> in shallow containers, and reheat them to 165 °F (74 °C). Cooked meat and poultry keep for 3 to 4 days in the refrigerator.'
    ) + p('The simplest habit: the party is a rolling buffet, so put out a modest amount, and refill from the kitchen.')],

    ['Buffet or seated dinner', p(
      'If you are serving a meal rather than snacks, you have two main options. Neither is better, so choose the one that fits your space and your temperament.'
    ) + '<h3>A buffet</h3>' + p(
      'A buffet suits a group that mingles. Set up the table in a clear line, with plates at the start, mains and sides in the middle, and napkins and cutlery at the end. Use warming trays or slow cookers for hot dishes, and set cold dishes over ice. Label every dish for common allergens, and provide a separate spoon for each. Choose dishes that look fine after an hour: braises, baked pastas, roasted vegetables, grain salads. Avoid anything that needs a last-second sear.'
    ) + '<h3>A seated dinner</h3>' + p(
      'A seated dinner suits a smaller group and a host who likes to cook. Choose a menu where most of the work is done before the first course, and where only one or two things need attention while people eat. A slow braise, a roast, or a baked dish is the host’s best friend. A starter that is already on the table when guests sit down, a main from the oven, and a dessert that was set the day before gives you a meal with no panic.',
      'Plan the order of the evening with a simple list. When does the oven go on? When does the main come out to rest? When do you plate? A rest of the roast is your cue to serve the starter or refill drinks. Write the sequence on a sticky note, and stick it on the fridge.'
    )],

    ['A New Year’s Eve dinner for two', p(
      'Some of the best New Year’s Eves are quiet. A dinner for two is a good reason to cook something you would not make on a weeknight, without the pressure of a crowd.',
      'The idea is to choose a menu with a clear shape: a starter, a main, and something sweet, at an easy pace. Pick dishes where the hands-on work is front-loaded, so that you can sit down together. A pan-seared steak or fish with a sauce, a creamy pasta with something special on top, or a slow-cooked dish that fills the kitchen with its smell all afternoon all work. Choose a dessert that was made the day before.',
      'If a recipe is written for more people, you can scale it down in Matlyst, which handles 1 to 20 servings. Check the seasoning and the pan size when you do. A recipe cut in half may need a smaller pan, and the cooking time can change. Use a thermometer when the dish includes meat: poultry, including ground poultry, reaches 165 °F (74 °C), and other ground meat reaches 160 °F (71 °C).',
      'In cook mode, the recipe is a checklist you tick off as you go, Matlyst suggests a timer when a step mentions a time, and the screen stays awake. It needs an internet connection, so check your Wi-Fi before the evening gets going. Keep the phone on the counter and out of the way of the sauce.'
    )],

    ['Vegetarian New Year’s Eve', p(
      'A vegetarian guest should be able to fill a plate and feel part of the evening, not left with the side dishes. Ask guests about dietary needs in the invitation, and let them tell you what they eat. Then make at least one dish that is a full meal on its own.'
    ) + ul(
      'A baked pasta with vegetables and cheese, or a rich vegetable lasagna.',
      'A big pot of beans or lentils with good bread.',
      'Stuffed squash, peppers, or mushrooms.',
      'A grain bowl bar, with roasted vegetables, a sauce, and toppings, that lets guests build their own.',
      'A mushroom or vegetable tart, with a flaky crust.',
      'A cheese board that has fruit, nuts, and bread, with no meat touching anything.'
    ) + p(
      'On a grazing table, label which dishes are vegetarian. Keep the serving spoons separate, and avoid placing meat directly next to the vegetarian dishes. If a dish uses a stock or a topping that changes things, say so on the card. Ask, do not assume.'
    )],

    ['New Year’s Day: food, traditions, and the day after', p(
      'New Year’s Day is a different kind of food day. People are tired, the kitchen is full, and there may be guests who stayed over. It is also the one day when many households have their own traditions about what to eat.',
      'We will not tell you what to eat for luck. Many families have their own traditions, often from the region or country they come from, and they differ widely. Some serve a specific dish every year, some make a big breakfast, and some do not cook at all. If you have a tradition, keep it. If you do not, you can start one. A simple idea is to cook a single dish every year that you save in a folder, so the recipe is there next time.'
    ) + '<h3>Ideas for a low-effort New Year’s Day</h3>' + ul(
      '<strong>A slow cooker meal</strong> that you start in the morning and forget about. A pot of beans, a stew, or a braise looks after itself, and is easy to hold at 140 °F (60 °C) or warmer.',
      '<strong>A big breakfast or brunch</strong> made from what is already in the house. Eggs, toast, potatoes, and leftover vegetables go a long way.',
      '<strong>Soup from the leftovers.</strong> Cooked chicken or ham, vegetables, and a stock turn into a restorative pot.',
      '<strong>A baked dish</strong> that uses party leftovers, such as a strata or a casserole, reheated to 165 °F (74 °C).',
      '<strong>Sandwiches.</strong> The party’s sliders, rolls, and cold cuts turn into lunch.'
    ) + p(
      'Keep it simple. The goal is a warm meal, not a project. If you are a host, give yourself a break and do not cook an elaborate dinner. A sensible plan for the day after is to look at what you have and choose one or two meals from it.'
    )],

    ['Leftovers from the party', p(
      'The party is over, and the refrigerator is full of half-bowls. The safe routine is straightforward. Get perishable food into the refrigerator within 2 hours of being put out, which means the night of, not the morning after. Use shallow containers so food cools quickly, and keep the refrigerator at 40 °F (4 °C) or colder. If you plan to freeze something, the freezer should be at 0 °F (-18 °C) or colder. Cooked meat and poultry leftovers are good for 3 to 4 days in the refrigerator, so use them early, and reheat them to 165 °F (74 °C). If a dish was left out for more than 2 hours, do not keep it.',
      'For ideas on what to cook, <a href="/en/holidays/thanksgiving-leftovers/">Thanksgiving leftovers</a> has techniques that apply to any holiday spread, and <a href="/en/recipes-by-ingredients/">recipes by ingredients</a> lets you search the recipes you have saved for the item you are trying to use up.'
    )],

    ['Empty the fridge before the new year starts', p(
      'Many people like to start January with a clean refrigerator, a stocked pantry, and a plan. The week between Christmas and New Year’s is a good time for it.',
      'The idea is simple. Look at what you have. Cook from it. Buy only what fills the gaps.',
      'In Matlyst, the <a href="/en/pantry-app/">pantry</a> keeps a list of what you have at home. The free plan shows 5 items, and a household shares the list live. Combined with search by ingredient, you can ask a practical question: what can I make with what I have? The <a href="/en/recipes-by-ingredients/">recipes by ingredients</a> page explains how, and the <a href="/en/empty-the-fridge/">empty the fridge</a> page has a method for using up what is left before you shop.'
    ) + ol(
      '<strong>Look.</strong> Open the refrigerator, freezer, and pantry, and write down what needs to be used first.',
      '<strong>Search.</strong> Search your saved recipes by the first ingredient on the list. If nothing fits, try the next one.',
      '<strong>Plan.</strong> Put two or three of those recipes on the meal plan for the coming days.',
      '<strong>Shop for the gaps only.</strong> Add the recipes to the grocery list. Items already in your pantry are left unselected and marked “In your pantry”, but confirm what you really have by looking.',
      '<strong>Cook and update.</strong> When you finish a recipe in cook mode, tap Update pantry to take out what you used, so the pantry stays honest.'
    )],

    ['A simple plan for January', p(
      'After the holidays, most people want food that is plain, cheap, and fast, and a way to stop thinking about it. You do not need a program. You need a short plan.'
    ) + ul(
      '<strong>Pick a few recipes you already love</strong> and put them on the meal plan. Repetition is a feature.',
      '<strong>Make one big batch</strong> on a day off, such as a soup, a sauce, or a pot of grains, and eat from it during the week.',
      '<strong>Keep a folder called “Weeknights”</strong> with the dishes that actually get cooked. Move anything you did not make out of it after a month.',
      '<strong>Use the pantry</strong> to avoid buying what you already have.',
      '<strong>Do not try to change everything at once.</strong> One small habit, such as planning the week on Sunday, is worth more than a complete overhaul.'
    ) + p(
      'Matlyst’s meal plan, grocery list, and pantry work together. Choose the recipes for the week, add the whole week to the grocery list in one go, and the list is sorted by store section. Items you check off move to the pantry by themselves after 15 seconds, with an undo button. See the <a href="/en/meal-plan-app/">meal plan</a> page, and if you are choosing between apps, our guide on <a href="/en/blog/choose-recipe-organizer-app/">how to choose a recipe organizer app</a> is a place to start.'
    )],

    ['Save the recipes from the party', p(
      'Every party leaves you with a few recipes you want to make again. The cheese dip a friend brought, the cocktail snack from a reel, the dessert from a card. Do it while the memory is fresh.',
      'In Matlyst, you can <a href="/en/import-recipes/">import a recipe</a> from a website, share it from <a href="/en/import-recipes-from-instagram/">Instagram</a> or <a href="/en/import-recipes-from-tiktok/">TikTok</a> to Matlyst, or photograph a printed card (photo import is a Pro feature). Save it to a folder like “Party food.” The free plan includes 5 imports per calendar month.',
      'From Instagram and TikTok, Matlyst reads the caption, one recipe per post. It does not transcribe audio, read comments, or read carousel slides, so if a creator only says the amounts out loud, add them yourself. It uses AI to read and translate, and AI can make mistakes, so look over each recipe after it is imported. Browse the <a href="/en/recipe-book-app/">recipe book app</a> page to see how folders work.'
    )],

    ['Three scenarios', scenarioNotat() + scenario('Say you are hosting a grazing party', {
      situasjon: 'Say you are hosting a New Year’s Eve party for a mixed group in a small apartment, starting in the early evening.',
      galt: 'You plan a menu that needs the oven for every dish, so everything lands at the same time and the table is full of lukewarm food.',
      gjor: 'You pick a mix: two cold dishes, one dip in a slow cooker, one baked item, and one sweet. Everything but the baked item is made the day before. You put food out in small amounts and refill, and you keep the hot food at 140 °F (60 °C) or warmer.',
      matlyst: 'You save the menu to a folder, place each dish on the day you will make it in the meal plan, and use one grocery list sorted by store section.'
    }) + scenario('Say you are cooking for two', {
      situasjon: 'Say it is just the two of you, and you want a nice dinner without a stressful evening.',
      galt: 'You pick a recipe written for a crowd and cut it in half by eye, and the timing and the pan size no longer work.',
      gjor: 'You scale the recipe down to a dinner for two, check the pan size, and make dessert the day before. You check the main with a thermometer.',
      matlyst: 'Cook mode shows the recipe as a checklist, suggests a timer when a step mentions a time, and keeps the screen awake.'
    }) + scenario('Say the party is over and the refrigerator is full', {
      situasjon: 'Say it is January 1, and you have half a cheese board, some meatballs, a tub of dip, and a few vegetables.',
      galt: 'You put it all off until the weekend, and by then some of it is no longer safe to eat.',
      gjor: 'You moved the leftovers into shallow containers the night before. You use the meatballs first, since cooked meat keeps for 3 to 4 days in the refrigerator, and reheat them to 165 °F (74 °C).',
      matlyst: 'You search your saved recipes by ingredient and pick one that uses what you have, then add only the gaps to the grocery list.'
    })],

    ['What Matlyst doesn’t do', p('A tool should say where it stops. Here is what to expect.') + ul(
      'It does not plan a party for you. It holds your recipes, your lists, and your meal plan, and you make the choices.',
      'It does not tell you how much food to make. The quantities above are rules of thumb from home cooking.',
      'Scaling is linear, and it does not adjust baking powder, yeast, or seasoning on your behalf.',
      'From Instagram and TikTok, it reads the caption only. It does not transcribe videos, read comments, or read carousel slides.',
      'AI can make mistakes when it reads and translates recipes. Look over each recipe after it is imported.',
      'Cook mode needs an internet connection.',
      'Ask Matlyst is a Pro feature, uses AI, and has a monthly quota.'
    ) + p('Matlyst is free to start, with 5 imports per calendar month. Matlyst Pro adds photo import, Ask Matlyst, and creating a household for up to 6 people, which anyone can join for free. For another potluck-style gathering, see <a href="/en/holidays/friendsgiving/">Friendsgiving</a>, and for the holiday that comes before this one, see <a href="/en/holidays/thanksgiving/">Thanksgiving</a>.')],
  ],
}).html;

export const side = {
  title: 'New Year’s Eve Food: Plan the Party and the Day After',
  description: 'Plan New Year’s Eve food: finger food timeline, make-ahead dishes, buffet or seated dinner, dinner for two, New Year’s Day meals, and a January fridge reset.',
  eyebrow: 'Holidays',
  h1: 'New Year’s Eve food: plan the party, the day after, and January',
  lead: 'Choose a format, build a make-ahead timeline, keep party food safe, plan New Year’s Day, and clear the fridge for the new year. A practical guide, written from home-cooking experience.',
  forst: 'Work backward from midnight, and cook as much as you can the day before.',
  stegTittel: 'The short version',
  steg: [
    ['Pick the format', 'Grazing table, buffet, seated dinner, or dinner for two. Tell guests which one it is, and choose dishes that hold well.'],
    ['Make ahead and keep it safe', 'Cook what you can the day before. Hot food at 140 °F (60 °C) or warmer, cold food at 40 °F (4 °C) or colder, and nothing perishable out for more than 2 hours.'],
    ['Plan the day after', 'Use leftovers for New Year’s Day, then search your pantry and saved recipes to empty the fridge before you shop for January.'],
  ],
  alternativ: '',
  grense: '',
  seksjoner: [],
  faqTittel: 'New Year’s Eve food questions',
  rik: html,
  faq: [
    ['What food should I serve on New Year’s Eve?', 'Choose food that holds well and is easy to eat with one hand: dips, skewers, small sandwiches, baked bites, a cheese board, and something sweet. Add one substantial dish, such as chili or a baked pasta, if the party is also dinner.'],
    ['How do I plan a New Year’s Eve party menu?', 'Pick a format first (grazing table, buffet, or seated dinner), then work backward from the time guests arrive. Make as much as you can the day before, and place each recipe on the day you will cook it.'],
    ['What can I make ahead for New Year’s Eve?', 'Dips, marinated items, anything you assemble and bake on the day, sauces, soups, and chilled desserts all make ahead well. Anything that has to be crisp or served fresh, such as fried food or dressed salads, is better left until the last hour.'],
    ['How much food do I need for a party?', 'It depends on the guests and the time of day. As a home-cooking rule of thumb, a party that is the only meal needs several savory items per person and a lot of variety, while a party after dinner needs far less. Plan more to dip than dip, and keep ice and non-alcoholic drinks well stocked.'],
    ['How long can party food sit out?', 'Do not leave perishable food out for more than 2 hours, or 1 hour if it is above 90 °F (32 °C). Put out small amounts and refill from the kitchen rather than leaving one large platter out all night.'],
    ['How do I keep party food hot?', 'Keep hot food at 140 °F (60 °C) or warmer with a chafing dish, a warming tray, a slow cooker on warm, or a low oven. Reheat soups, stews, and casseroles to 165 °F (74 °C) before you put them out.'],
    ['Is a buffet or a seated dinner better for New Year’s Eve?', 'A buffet suits a larger group that mingles, and a seated dinner suits a smaller group and a host who likes to cook. Choose dishes that look good after an hour for a buffet, and a menu where most of the work is done in advance for a seated dinner.'],
    ['What should I cook for a New Year’s Eve dinner for two?', 'Choose a menu with a starter, a main, and something sweet, where the hands-on work comes early. Scale a recipe down to a dinner for two in Matlyst, check the pan size, make dessert the day before, and use a thermometer for meat.'],
    ['What are good vegetarian options for New Year’s Eve?', 'A baked pasta, a pot of beans or lentils, stuffed vegetables, a grain bowl bar, or a mushroom tart can each be a full meal. Ask guests about their dietary needs in the invitation and label the dishes.'],
    ['What should I eat on New Year’s Day?', 'Many families have their own traditions, so keep yours if you have one. If not, a slow cooker meal, a big breakfast, a soup from leftovers, or sandwiches from the party food are all easy.'],
    ['How long do New Year’s Eve leftovers last?', 'Refrigerate them within 2 hours in shallow containers at 40 °F (4 °C) or colder. Cooked meat and poultry leftovers last 3 to 4 days in the refrigerator. Reheat to 165 °F (74 °C), and freeze them at 0 °F (-18 °C) or colder if you will not use them in time.'],
    ['How do I empty the fridge before the new year?', 'List what needs to be used first, search your saved recipes by those ingredients, plan two or three meals, and add only the gaps to your grocery list. Matlyst’s pantry and search by ingredient help, and the free pantry shows 5 items.'],
    ['Can I scale a party recipe in Matlyst?', 'Yes, from 1 to 20 servings, in a straight line. Check baking powder, baking soda, yeast, salt, and strong spices by hand, and use more than one pan if the batch is large.'],
    ['Is Matlyst free?', 'Matlyst is free to start, with 5 imports per calendar month. Saving recipes, folders, search, the meal plan, and the grocery list work on the free plan. Photo import, Ask Matlyst, and creating a household are part of Matlyst Pro.'],
  ],
  cta: 'Plan your New Year in Matlyst',
};

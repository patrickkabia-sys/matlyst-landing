// Høytidsside: Hanukkah (en-US). Respektfull og nøktern: bare allment kjent; ingen tradisjoner eller regler funnet på.
import { byggRik, scenario, scenarioNotat } from './../rik-sider.mjs';

const p = (...ps) => ps.map((t) => `<p>${t}</p>`).join('');
const ul = (...li) => `<ul>${li.map((t) => `<li>${t}</li>`).join('')}</ul>`;
const ol = (...li) => `<ol>${li.map((t) => `<li>${t}</li>`).join('')}</ol>`;

const rik = byggRik({
  svarTekst: 'Hanukkah lasts eight nights, and in 2026 it begins at sundown on Friday, December 4 and runs through December 12. To cook for all eight without burning out, pick a small set of recipes, make the batters, sauces, and sides ahead where you can, and shop once for the whole week. Save the recipes to one folder in Matlyst, scale them to each night’s guest count, and use one grocery list for all eight nights.',
  seksjoner: [
    ['A short, respectful orientation', p(
      'This page is a cooking and planning guide. It is not a guide to how to observe Hanukkah, and we do not tell anyone how to keep the holiday. Families and communities observe it in different ways, and the right source for that is your own family, your community, or your rabbi.')
      + p('Here is what is widely known, so the planning below makes sense.')
      + ul(
        'Hanukkah lasts eight nights. In 2026 it begins at sundown on Friday, December 4, and runs through December 12.',
        'Many families light a menorah (also called a hanukkiah) each night, adding one more light as the nights go on.',
        'Foods fried in oil are a well-known part of the holiday, and the oil is often explained as a reference to the story of the holiday. Latkes (potato pancakes) and sufganiyot (jelly doughnuts) are the best-known examples.',
        'Many families also cook other dishes, and what is on the table differs from home to home.')
      + p('Because the first night falls on a Friday evening this year, some households will want to check how their own tradition handles the timing that evening. We do not give guidance on that. We only suggest you look at the calendar early, so that the first night’s cooking does not collide with anything else you do.')
      + p('The word is also spelled Chanukah in English. Either spelling is in common use.')],

    ['Cooking for eight nights without burning out', p(
      'The difficulty of Hanukkah cooking is not any one dinner. It is that the nights come back to back, many of the best-known dishes are fried, and frying is work that is best done close to serving time. Eight nights of frying and cleaning is a lot for anyone.')
      + p('The way through is to separate the food into three kinds.')
      + ul(
        '<strong>Fried food you cook fresh.</strong> This is the part you make on the night, and it is worth keeping to a small number of nights if you can.',
        '<strong>Make-ahead dishes.</strong> Braises, kugels, soups, salads, and baked dishes that can be made earlier and reheated, so most nights need only a short cooking job.',
        '<strong>Easy nights.</strong> A pot of soup, a baked dish, or a simple dinner with one fried item on the side. Not every night has to be a feast.')
      + p('You do not have to fry every night. Some families make latkes on one or two nights and do other dishes on the rest. That is your decision. Planning it on paper first is what keeps it manageable.')
      + p('In Matlyst you can lay the eight nights out in the <a href="/en/meal-plan-app/">weekly menu</a>, put each recipe on the night you will make it, and keep all the recipes in a folder called Hanukkah. The <a href="/en/recipe-book-app/">recipe book</a> saves recipes from websites, Instagram, and TikTok, so a family recipe you type in and a recipe you find on a blog sit in the same place. The free plan includes 5 imports per calendar month.')],

    ['An eight-night menu you can adapt', p(
      'This is a suggested plan, not a tradition. It is an example of how to spread the work so that no two heavy nights are next to each other. Swap anything for what your family makes.')
      + '<h3>Night 1 (Friday, December 4)</h3>'
      + p('Keep it simple. A make-ahead main such as a braised brisket or a roast chicken dish that has been prepared earlier, plus latkes if you want them, or a simple side.')
      + '<h3>Night 2</h3>'
      + p('A soup and a salad, with bread. A light night after the first.')
      + '<h3>Night 3</h3>'
      + p('Latkes, with applesauce and sour cream, and a green salad. This is a night to fry.')
      + '<h3>Night 4</h3>'
      + p('A baked pasta or a kugel, made earlier and reheated.')
      + '<h3>Night 5</h3>'
      + p('A one-pan chicken or fish dinner with roasted vegetables.')
      + '<h3>Night 6</h3>'
      + p('A second fried night, if you like: sufganiyot, or latkes made in a different style, such as with sweet potato or zucchini.')
      + '<h3>Night 7</h3>'
      + p('Leftovers night. Reheat what is in the refrigerator or freezer, and add something fresh.')
      + '<h3>Night 8 (Saturday, December 12)</h3>'
      + p('A bigger gathering, if you are hosting one, built mostly from dishes made earlier in the week.')
      + p('You can see how the plan is built: two fried nights, a few make-ahead nights, and a leftovers night. If you want more fried nights, put an easy night on each side of them.')],

    ['Latkes and sufganiyot: the fried classics', p(
      'Latkes are potato pancakes, and sufganiyot are filled doughnuts. Both are fried in oil, and both are a traditional part of the holiday for many families. Our job here is cooking, so we will stick to the cooking.')
      + '<h3>Latkes</h3>'
      + p('The basic idea is grated potato and onion, an egg to bind, a little flour or matzo meal, and salt, fried until crisp. The differences between recipes are in the details, and you will find a lot of opinions. Here are the practical points that most good recipes share.')
      + ul(
        '<strong>Get the water out.</strong> Squeeze the grated potato in a clean towel. Wet potato makes limp latkes and spatters in the oil.',
        '<strong>Work in batches and keep the batter moving.</strong> Grated potato darkens as it sits, so grate close to when you fry, or follow your recipe’s advice.',
        '<strong>Do not crowd the pan.</strong> Crowding drops the oil temperature and makes greasy latkes.',
        '<strong>Drain well.</strong> Put the cooked latkes on a rack or on paper towels, and add salt while they are hot.',
        '<strong>Keep them warm without losing the crisp.</strong> A rack on a baking sheet in a warm oven works better than stacking them. Food held warm should stay at 140 °F (60 °C) or warmer.')
      + '<h3>Sufganiyot</h3>'
      + p('Sufganiyot are yeast doughnuts, filled with jam or custard and dusted with sugar. They are a project. They need time for the dough to rise, a pot of oil, and a filling. Many cooks make the dough earlier, and fry and fill on the day. If you have never made them, try a small batch before the holiday, or choose a baked recipe or a store-bought version for the night.')
      + p('Because they use yeast, think carefully before you scale them. See the scaling section below.')],

    ['Other dishes families make', p(
      'Latkes and sufganiyot are not the only food on a Hanukkah table. Many families cook other dishes, and which ones depends on the family and where it comes from. We will not say what you should serve. Here are some examples that people commonly make, to help with planning. Use what is yours.')
      + ul(
        '<strong>Brisket,</strong> a braised beef dish that is often made ahead and sliced.',
        '<strong>Kugel,</strong> a baked pudding made with noodles or potatoes.',
        '<strong>Roast chicken,</strong> simple and easy to make for a crowd.',
        '<strong>Soups,</strong> which can be made and reheated.',
        '<strong>Roasted vegetables and salads,</strong> to go with fried food.',
        '<strong>Applesauce and sour cream,</strong> the usual toppings for latkes.',
        '<strong>Cookies and other sweets,</strong> made ahead.')
      + p('If you are cooking for guests, ask about their dietary practices before you decide the menu. Some households keep kosher, and the rules they follow differ. Some guests are vegetarian, or have allergies. Asking is respectful, and it is much easier than fixing a menu later. If you are not sure what a guest needs, ask them what they would like you to know.')],

    ['What to make ahead', p(
      'Make-ahead is the only way to keep eight nights from taking over your week. Here is a way to think about which dishes belong to which day.')
      + ul(
        '<strong>Weekend before.</strong> Cookie dough, a braise, a kugel that can be baked and reheated, soup, and sauces. Anything that freezes can be stored at 0 °F (-18 °C) or colder.',
        '<strong>During the week.</strong> Salads and dressings. Chop vegetables for the next night while you clean up from the last.',
        '<strong>On the night.</strong> The fried items, and one fresh vegetable. That is a short list.')
      + p('Keep everything labeled with the name and the date you made it. A label saves you from guessing in the middle of the week.')
      + p('If you make a braise or a casserole ahead, keep it in the refrigerator at 40 °F (4 °C) or colder, and reheat anything with meat or poultry to 165 °F (74 °C) before serving.')],

    ['Frying safely in a home kitchen', p(
      'We do not give oil temperatures here. Use your recipe for the temperature, and use a thermometer made for frying if you want to check it. These are general habits that apply to any frying at home.')
      + ul(
        '<strong>Never leave hot oil alone.</strong> Stay in the kitchen the whole time.',
        '<strong>Use a heavy, deep pot or pan,</strong> and do not fill it more than your recipe says. Oil rises when food goes in.',
        '<strong>Keep food dry.</strong> Water and hot oil spatter. Pat food dry before it goes in.',
        '<strong>Lower food in gently, away from you.</strong> Do not drop it in from a height.',
        '<strong>Keep a lid nearby.</strong> If oil catches fire, turn off the heat and cover the pan. Never use water on an oil fire.',
        '<strong>Keep children and pets out of the area,</strong> and turn pot handles inward.',
        '<strong>Let the oil cool completely</strong> before you move it or throw it away. Do not pour it down the drain.',
        '<strong>Keep a clear work area.</strong> Have your tray, your rack, and your tools ready before the oil is hot.')
      + p('Eight nights of frying has its own risk, which is tiredness. If you are worn out, make something else that night.')
      + '<h3>Managing the smell</h3>'
      + p('Frying leaves a smell in the house and on your hands and clothes. Open a window, use the range hood fan, and wash your hands with soap. Many cooks keep a pair of clothes just for frying, and some put on an apron. Wash cloth towels and aprons after each fry night. Plan to air out the kitchen before guests arrive, not after.')],

    ['Scaling recipes for the crowd', p(
      'Matlyst scales a recipe from 1 to 20 servings, and the scaling is linear. If you double the servings, every ingredient doubles. For latkes, that works well, because a latke recipe is mostly potatoes, onion, egg, and a small amount of binder. A few things are worth checking by hand.')
      + ul(
        '<strong>Salt and spices.</strong> Do not scale these blindly. Add less than the scaled amount, taste, and add more.',
        '<strong>The binder.</strong> Egg and flour or matzo meal hold the pancake together. After you scale, judge the batter by feel. If it is too wet, add a little more binder, and if it is too dry, the latkes will be dense.',
        '<strong>Yeast and baking powder.</strong> If a recipe uses yeast, as sufganiyot do, or baking powder, check the scaled amount against a recipe written for that size. Leavening does not always scale in a straight line.',
        '<strong>The pan and the oil.</strong> More batter means more batches, not a bigger pan. Plan the time for the batches.',
        '<strong>Fillings.</strong> A filling for doughnuts is often a jam or a custard. Check how much the scaled recipe makes, and whether you have enough.')
      + p('A rule of thumb from home cooking, not a tested number: for a few guests, count on each person eating several latkes, and plan on extra if they are the main part of the meal. If you serve latkes as a side with a heavier main, plan on fewer.')
      + p('After you scale, read the amounts once. If you change a recipe, add a note to the recipe, so next year you can make it the same way.')],

    ['One grocery list for eight nights', p(
      'It is easier to shop once, or twice at most, than eight times. Put every recipe on the weekly menu, and use one list. Matlyst combines the same ingredient in the same unit across recipes, shows different units next to each other, and sorts the list by store department. Items that are in your pantry start unchecked, so you can look at them and decide whether you need them.')
      + p('Here is a starter list for a menu like the one above. Replace it with your own.')
      + '<h3>Produce</h3>'
      + ul('Potatoes, onions, and garlic, which make up most of a latke menu.', 'Apples, if you are making applesauce.', 'Salad greens, carrots, and the vegetables for roasting.', 'Lemons, which are useful for dressings, fish, and chicken.')
      + '<h3>Dairy and eggs</h3>'
      + ul('Eggs, for latkes and baking.', 'Sour cream, butter, and any other dairy the menu needs.')
      + '<h3>Meat and fish</h3>'
      + ul('The main for the big night, such as a brisket or chicken, ordered ahead if you want a specific cut.', 'Whatever your one-pan dinner needs.')
      + '<h3>Pantry</h3>'
      + ul('Oil for frying, enough for each fry night. Check the recipe for how much.', 'Flour or matzo meal, salt, sugar, baking powder, and yeast if you are making doughnuts.', 'Jam or custard for filling, powdered sugar, spices, and stock for soups.', 'Candles for the menorah, if you need them.')
      + p('Shop for non-perishables in the first round, and for produce and dairy in the second. If your household shares a Matlyst account via a household, everyone sees the same list live, and one person can add an item while another is in the store. A Pro member can create a household for up to 6, and joining is free. See the <a href="/en/shopping-list/">shopping list page</a> and the <a href="/en/pantry-app/">pantry page</a>.')],

    ['Hosting on the nights you have company', p(
      'Some nights you will cook for family, and some nights you will have guests. The same habits that keep the week manageable also keep a gathering calm.')
      + ul(
        '<strong>Ask about diets and allergies first.</strong> Do it as soon as you invite someone.',
        '<strong>Let guests bring something.</strong> A salad, a dessert, a drink, or a side that can be served at room temperature. Ask which dishes need to be heated so you can plan the oven.',
        '<strong>Fry in small batches while people talk.</strong> Some hosts like to fry with guests nearby, and others finish all the frying before the guests arrive. Choose what works for the space and the people. Keep children away from the stove either way.',
        '<strong>Put out something to eat while you finish.</strong> A plate of toppings and a salad buy you time.',
        '<strong>Do not hold food too long.</strong> Hot food should stay at 140 °F (60 °C) or warmer, and nothing should sit out for more than 2 hours, or 1 hour if the room is hotter than 90 °F (32 °C).',
        '<strong>Wash your hands for 20 seconds,</strong> and use a separate board and knife for raw meat.')
      + p('If you are inviting people for a gathering that goes with the season, the same planning applies to <a href="/en/holidays/christmas-dinner/">Christmas dinner</a> and <a href="/en/holidays/new-years-eve/">New Year’s Eve</a>, which fall in the same few weeks.')],

    ['Leftovers, and fried food', p(
      'Fried food is best on the day, but leftovers happen. The safety rules are the same as for other leftovers.')
      + ul(
        'Refrigerate leftovers within 2 hours, or within 1 hour if the room is hotter than 90 °F (32 °C).',
        'Use shallow containers so food cools quickly.',
        'Keep your refrigerator at 40 °F (4 °C) or colder.',
        'Leftover cooked meat and poultry keep 3 to 4 days in the refrigerator.',
        'Reheat leftovers to 165 °F (74 °C). That applies to leftover latkes, kugel, brisket, and chicken alike.',
        'Thaw frozen food in the refrigerator, not on the counter.')
      + p('Reheating fried food in an oven or an air fryer brings back more crispness than a microwave does. A rack helps. Do not reheat the same food over and over.')
      + p('If you have a lot left, look at the <a href="/en/empty-the-fridge/">empty the fridge page</a> and <a href="/en/recipes-by-ingredients/">recipes by ingredients</a> to find ideas for the next meal. Leftover potatoes and brisket both turn into new dishes, as in a hash or a sandwich. Used cooking oil from frying is not a leftover. Let it cool fully, and dispose of it properly.')],

    ['Cook mode and a night-of plan', p(
      'On a fry night, write the plan backward from dinner time. A typical order is: set out the toppings and sides first, make the batter or prepare the dough, heat the oil, fry in batches while keeping finished ones on a rack, and serve.')
      + p('Matlyst has a <a href="/en/recipe-book-app/">cook mode</a> that shows the ingredients as a checklist, suggests timers from the step text, and keeps the screen awake while you cook. It needs an internet connection, so open the recipe before you start if your signal is weak. Ask Matlyst, available with Pro, can help adapt a recipe with AI, for example to swap an ingredient for a guest. It has a monthly quota, you can choose Save a copy or Replace, and the result is marked adapted. AI can make mistakes, so check the amounts and steps before you cook.')],

    ['Three scenarios', scenarioNotat('en')
      + scenario('Say you are cooking for your family of four for all eight nights', {
        situasjon: 'You want a special dinner each night, and you work during the day.',
        galt: 'You plan latkes for four nights, and by night three you are tired of frying.',
        gjor: 'You cut the fried nights to two, move a braise and a kugel to the weekend, and add a soup night and a leftovers night.',
        matlyst: 'You put each recipe on the night you will make it in the weekly menu, and use one grocery list for the week.',
      })
      + scenario('Say you are hosting twelve on the eighth night', {
        situasjon: 'You are making latkes and a main for a larger gathering.',
        galt: 'A single recipe makes enough for four, and the batches take a long time at the stove.',
        gjor: 'You scale the recipe, check the salt and the binder, and make the main and the sides ahead, so only the frying is left for the night. You ask your guests about their diets first, and ask a few of them to bring a salad and a dessert.',
        matlyst: 'You scale each recipe to 12 servings, read the amounts, and check the list.',
      })
      + scenario('Say you are cooking for yourself and one friend', {
        situasjon: 'You want to join in the holiday, but not make a big meal.',
        galt: 'Most recipes are written for a crowd, and you end up with a bowl of batter you will not use.',
        gjor: 'You pick one fried recipe, scale it down to two servings, and eat the rest of the week from a pot of soup.',
        matlyst: 'You scale the recipe to 2 servings and check the spices by taste.',
      })],

    ['Troubleshooting', ul(
      '<strong>The latkes are soggy.</strong> Squeeze the potatoes drier, do not crowd the pan, and drain on a rack.',
      '<strong>The latkes fall apart.</strong> The batter needs more binder, or the potatoes were too wet. Add a little more flour or matzo meal.',
      '<strong>The latkes are dark outside and raw inside.</strong> The oil was too hot, or the latkes are too thick. Lower the heat and make them thinner.',
      '<strong>The latkes are greasy.</strong> The oil was not hot enough, or the pan was crowded.',
      '<strong>The batter turned gray or brown.</strong> Grated potato darkens as it sits. Work in smaller batches.',
      '<strong>The doughnuts did not rise.</strong> The yeast may be old, or the dough was too cold. Check the yeast before you start.',
      '<strong>The kitchen smells of oil for days.</strong> Ventilate while you fry, wash the towels, and air the room.',
      '<strong>You are too tired to fry.</strong> Skip it. Serve the soup. The holiday does not depend on one pan.',
      '<strong>A guest cannot eat something.</strong> Ask what they can eat, and make or buy something that works. Do not guess.')],

    ['What Matlyst does not do', p('A good tool says where it stops.')
      + ul(
        '<strong>It does not tell you how to observe Hanukkah.</strong> It is a cooking and planning tool, not a source for religious practice.',
        '<strong>It does not give you oil temperatures or frying times.</strong> Use your recipe and a thermometer.',
        '<strong>It reads captions, not audio.</strong> If a creator only says the amounts in a video, type them in after you import.',
        '<strong>It does not read comments.</strong> If the recipe is in a comment or behind a link in the bio, copy it in or share the page link.',
        '<strong>AI can make mistakes.</strong> Check amounts and steps before you cook, especially from photos or family recipes you typed in.',
        '<strong>Cook mode needs an internet connection.</strong>',
        '<strong>The free plan has limits.</strong> You get 5 imports per calendar month. Photo import, Ask Matlyst, and creating a household are part of Matlyst Pro.')
      + p('For more, see <a href="/en/import-recipes-from-instagram/">importing from Instagram</a>, <a href="/en/import-recipes-from-tiktok/">TikTok</a>, and <a href="/en/import-recipes/">other sources</a>, or our guide on <a href="/en/blog/choose-recipe-organizer-app/">how to choose a recipe organizer app</a>.')],

    ['Common mistakes', ul(
      '<strong>Planning to fry every night.</strong> Eight nights of frying is a lot. Put make-ahead dishes between the fried nights.',
      '<strong>Skipping the squeeze.</strong> Wet potato is the usual reason latkes are limp.',
      '<strong>Leaving oil unattended.</strong> Stay in the kitchen.',
      '<strong>Scaling yeast and spices blindly.</strong> Check them by hand.',
      '<strong>Assuming what guests eat.</strong> Ask early.',
      '<strong>Leaving food out.</strong> More than 2 hours is too long.',
      '<strong>Buying eight nights of food in one cart without a plan.</strong> Plan the nights first, then shop.')],
  ],
});

export const side = {
  title: 'Hanukkah Cooking Plan: Eight Nights, Latkes, Shopping',
  description: 'Plan eight nights of Hanukkah cooking: latkes and sufganiyot, make-ahead dishes, safe frying habits, one grocery list for the whole week, and leftovers.',
  eyebrow: 'Holiday planner',
  h1: 'How to plan eight nights of Hanukkah cooking',
  lead: 'Hanukkah 2026 begins at sundown on Friday, December 4 and runs through December 12. A menu you can adapt, make-ahead tips, safe frying habits, and one grocery list for all eight nights.',
  forst: 'Fry on a few nights, make ahead for the rest.',
  stegTittel: 'Plan eight nights in three steps',
  steg: [
    ['Save and choose', 'Put your family recipes and new ideas in one folder, then give each night a job: fry, make-ahead, or easy.'],
    ['Scale and shop', 'Scale each recipe to the night’s guest count, then use one grocery list for the week.'],
    ['Make ahead, then cook', 'Make braises, kugels, and soups early, and cook the fried dishes close to serving, with safe frying habits.'],
  ],
  alternativ: '',
  grense: '',
  seksjoner: [],
  faqTittel: 'Hanukkah cooking questions',
  rik: rik.html,
  faq: [
    ['When is Hanukkah in 2026?', 'Hanukkah 2026 begins at sundown on Friday, December 4 and runs through December 12, which is eight nights.'],
    ['What foods are traditional at Hanukkah?', 'Foods fried in oil are a well-known part of the holiday, and latkes and sufganiyot are the best-known examples. Many families also cook other dishes, and it differs from home to home.'],
    ['How do I plan eight nights without getting worn out?', 'Fry on only a few nights, make braises, kugels, and soups ahead, and keep one night for leftovers. Write the plan out on paper before you shop.'],
    ['How do I make latkes crisp?', 'Squeeze the grated potato dry, do not crowd the pan, and drain the latkes on a rack. Work in small batches so the potato does not darken as it sits.'],
    ['Can I scale a latke recipe?', 'Yes. Matlyst scales recipes from 1 to 20 servings in a straight line. Check salt, spices, and the binder by hand, and plan for more batches rather than a bigger pan.'],
    ['Can I scale a doughnut recipe with yeast?', 'Be careful. Yeast and baking powder do not always scale in a straight line. Compare the scaled amount with a recipe written for that size.'],
    ['How do I fry safely at home?', 'Never leave hot oil alone, keep food dry, use a heavy deep pot, keep a lid within reach, and never put water on an oil fire. Keep children and pets away, and let used oil cool fully.'],
    ['What temperature should leftovers be reheated to?', 'Reheat leftovers to 165 °F (74 °C). That applies to leftover latkes, kugel, brisket, and chicken.'],
    ['How long can leftovers stay in the refrigerator?', 'Cooked meat and poultry keep 3 to 4 days in a refrigerator set to 40 °F (4 °C) or colder. Refrigerate within 2 hours of cooking.'],
    ['How long can food sit out for a gathering?', 'No more than 2 hours, or 1 hour if the room is hotter than 90 °F (32 °C). Keep hot food at 140 °F (60 °C) or warmer.'],
    ['What should I ask guests before I plan the menu?', 'Ask about dietary practices, such as keeping kosher or being vegetarian, and about allergies. Asking early is respectful and makes planning easier.'],
    ['Can my household share one list for all eight nights?', 'Yes. A Matlyst Pro member can create a household for up to 6 people. Joining is free, and the grocery list and weekly menu update live for everyone.'],
    ['Does Matlyst tell me how to observe the holiday?', 'No. Matlyst is a cooking and planning tool. For how to observe Hanukkah, ask your family, your community, or your rabbi.'],
  ],
  cta: 'Start your Hanukkah folder',
};

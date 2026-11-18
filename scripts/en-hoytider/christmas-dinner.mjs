// Høytidsside: Christmas dinner (en-US). Matsikkerhetstall fra FoodSafety.gov; ingen steke- eller tinetider.
import { byggRik, scenario, scenarioNotat } from './../rik-sider.mjs';

const p = (...ps) => ps.map((t) => `<p>${t}</p>`).join('');
const ul = (...li) => `<ul>${li.map((t) => `<li>${t}</li>`).join('')}</ul>`;
const ol = (...li) => `<ol>${li.map((t) => `<li>${t}</li>`).join('')}</ol>`;

const rik = byggRik({
  svarTekst: 'Plan Christmas dinner backward from the day: pick the menu four weeks out, order the roast early, shop in two rounds, make what you can ahead, and write a timeline for the day itself. Save every recipe to one folder in Matlyst, scale it to your guest count, and let one grocery list cover the whole menu. Christmas Eve and Christmas Day fall on December 24 and 25 this year.',
  seksjoner: [
    ['Start four weeks out: the plan on one page', p(
      'A Christmas dinner feels hard because it is dozens of small jobs that all land on one afternoon. The fix is not to cook faster. It is to move as many jobs as possible to other days, and to write the rest down so you are not holding it in your head.',
      'Four weeks before the big day is a good time to start, because the decisions that matter most are the ones that cost nothing yet: how many people are coming, what you will serve, and who is bringing what. Christmas Eve is December 24 and Christmas Day is December 25 this year, so count back from whichever evening you are hosting.')
      + p('Here is the one page you want by the end of the first week.')
      + ul(
        '<strong>The guest count.</strong> Adults, kids, and anyone who might add a plus one. Round up if you are unsure.',
        '<strong>The dietary list.</strong> Allergies, vegetarians, anyone who avoids pork or alcohol. Ask early and ask everyone. It is much easier to plan one extra dish than to fix a menu on the day.',
        '<strong>The menu.</strong> One main, two or three sides, a bread, a vegetable, a dessert, and drinks. That is plenty.',
        '<strong>The oven map.</strong> What goes in the oven, at what temperature, and in what order. Most Christmas dinners fail on oven space, not on skill.',
        '<strong>The helper list.</strong> Who is bringing what, and who is in charge of what on the day.')
      + p('If you save recipes as you find them, this page almost writes itself. Make a folder called Christmas 2026 in Matlyst and put every candidate in it. <a href="/en/recipe-book-app/">Matlyst saves recipes</a> from websites, Instagram, and TikTok, so the roast you saw in a video and the sides you found on a blog end up in the same place, with ingredients and numbered steps you can check. The free plan includes 5 imports per calendar month, which is enough to collect a short menu.')],

    ['A week-by-week timeline', p(
      'Use this as a skeleton and move things around to fit your own year. The pattern is what matters: decide first, order second, shop for long-life items third, shop for fresh items last, and cook what can be cooked ahead.')
      + '<h3>Four weeks out</h3>'
      + ul('Set the guest count and ask about allergies and diets.', 'Choose the main and the dessert, since these drive everything else.', 'Collect your recipes into one folder and read each one all the way through.')
      + '<h3>Three weeks out</h3>'
      + ul('Finish the menu. Cut anything that needs the oven at the same temperature as something else at the same time.', 'Order the roast from a butcher or the store if you want a specific size or cut, and ask about pickup days.', 'Check your equipment: a roasting pan, a rack, a meat thermometer that works, enough serving dishes, and enough chairs.')
      + '<h3>Two weeks out</h3>'
      + ul('Build the first grocery list: pantry items, baking supplies, drinks, anything canned or dry.', 'Make anything that freezes well, such as cookie dough, pie crust, or a sauce base. Freezer-safe means 0 °F (-18 °C) or colder.', 'Decide what guests will bring, and tell them.')
      + '<h3>One week out</h3>'
      + ul('Make the second grocery list: produce, dairy, bread, and anything else that spoils.', 'Clear space in the fridge. Throw out or eat what you do not need. A fridge that is already full is the most common hidden problem.', 'If your roast is frozen, plan to thaw it in the refrigerator, never on the counter. Follow the package instructions for how long that takes.')
      + '<h3>Two or three days out</h3>'
      + ul('Do the second shop.', 'Make the sides and desserts that keep well: cranberry sauce, soup, a pie, cookies, a make-ahead casserole.', 'Chop what you can. Store it in labeled containers.')
      + '<h3>The day before</h3>'
      + ul('Set the table, including serving spoons and the labels for each dish.', 'Prepare the roast for the oven if your recipe allows it, and keep it refrigerated.', 'Write the timeline for the day on paper and tape it where you can see it.')
      + p('In Matlyst, you can add the recipes to the <a href="/en/shopping-list/">grocery list</a> for the shopping rounds, and put each make-ahead recipe on the day you will cook it in the <a href="/en/meal-plan-app/">meal plan</a>. Planning a Christmas dinner is a week of small meals that happen to build to one big one, and seeing the days laid out makes the big one feel smaller.')],

    ['Build a menu that fits your oven', p(
      'Count your oven racks and your burners before you commit to a menu. A standard home kitchen has one oven and four burners. If your main roast needs the oven for hours, your sides have to come from the stovetop, a slow cooker, a microwave, or a make-ahead dish that can be reheated while the roast rests.')
      + p('That last part is the trick. A large roast needs to rest before you carve it, and that rest is when the oven is free for other things. Plan your hot sides to go in while the roast rests. Check your own recipe for how long it should rest.')
      + '<h3>A balanced menu, without a long list</h3>'
      + ul(
        '<strong>One main.</strong> Ham, turkey, or a beef roast are the most common. Pick one. Two mains double the work and the leftovers.',
        '<strong>One starchy side.</strong> Potatoes in some form, or rice, or stuffing. If you want two, make one of them in the slow cooker.',
        '<strong>One or two vegetable sides.</strong> One roasted, and one that is served cold or at room temperature.',
        '<strong>Something bright.</strong> A salad, pickles, a cranberry sauce, or a citrus dish. Rich food needs contrast.',
        '<strong>Bread.</strong> Rolls you bought are fine. Nobody remembers who baked them.',
        '<strong>Dessert.</strong> A pie or cake, plus a cookie tray. More on that below.')
      + p('When you collect recipes, read the whole ingredient list before you add the dish to the menu. A side that looks simple can need three specialty ingredients, a long soak, or a hot oven at the worst moment. The best dishes for a crowded day are the ones that are forgiving: they can wait in a warm oven or be reheated without falling apart.')],

    ['Scaling for different numbers of guests', p(
      'The most common question is how much to make. The honest answer is that it depends on the people, the rest of the menu, and whether you want leftovers. The rules below are rules of thumb from home cooking, not tested numbers, and your own crowd may eat more or less.')
      + ul(
        '<strong>A small table of 2 to 4.</strong> Cook a smaller cut instead of shrinking a big one. A ham or turkey breast, a small roast, or a stuffed vegetable dish does the job. Make two sides and a dessert. Leftovers will still be a lot, so plan for them.',
        '<strong>A family table of 6 to 10.</strong> This is the classic size. One main, three sides, two desserts. A common home-cook rule is roughly half a pound of boneless meat per adult, or closer to three quarters of a pound to one pound per person when the cut has the bone in. Add a little for a big eater and for leftovers.',
        '<strong>A big gathering of 12 to 20.</strong> Think in terms of two mains, or one main plus a larger vegetarian dish, and sides that can be made in big pans. Hot food for a crowd is limited by oven space, so lean on cold dishes, a slow cooker, and food that can sit at room temperature for a short while.')
      + p('Two ideas make scaling easier. First, scale the side dishes more than the main. Guests often eat more sides than you expect, and sides are cheap to make extra of. Second, do not scale a dessert by guessing. Baking is the part of the menu where ratios matter.')
      + p('Matlyst scales a recipe from 1 to 20 servings, and the scaling is linear: if you double the servings, every amount doubles. That is correct for most ingredients, but not for everything. Check these by hand before you cook a scaled recipe.')
      + ul(
        '<strong>Baking powder, baking soda, and yeast.</strong> They do not always scale in a straight line, especially when you go up a lot. Treat the scaled number as a starting point and compare it with a recipe made for that size.',
        '<strong>Salt, spices, and strong flavors.</strong> Add less than the scaled amount, then taste and add more. It is easier to add than to remove.',
        '<strong>Pan size and cooking time.</strong> Twice the filling in the same pan is not the same dish. A bigger batch needs a bigger pan or a second pan, and the time can change.',
        '<strong>Whole items.</strong> One and a half eggs does not exist. Round sensibly and decide what the recipe can tolerate.')
      + p('After you scale, read the amounts once. It takes a minute and it is the step that catches the odd result. Write what you changed under My notes on the recipe in <a href="/en/recipe-book-app/">Matlyst</a>, so next year you do not have to work it out again.')],

    ['The main roast: ham, turkey, beef, or something vegetarian', p(
      'We do not give roasting times on this page, because a time depends on the cut, the weight, your oven, and whether the meat is thawed. Use the time in your recipe or on the package as a guide, and use a thermometer as the judge. The temperatures below are the minimum safe internal temperatures from FoodSafety.gov.')
      + p('How to take a temperature: put a food thermometer into the thickest part of the meat, without touching bone, fat, or gristle, and check more than one spot for a large piece.')
      + '<h3>Ham</h3>'
      + ul(
        '<strong>Raw ham:</strong> 145 °F (63 °C), then rest for 3 minutes.',
        '<strong>Fully cooked ham that you are reheating:</strong> 165 °F (74 °C).',
        '<strong>Ham packaged in a USDA-inspected plant and marked as cooked:</strong> 140 °F (60 °C). Check the label on yours so you know which kind you have, because they are not the same.')
      + '<h3>Turkey and other poultry</h3>'
      + ul(
        'A whole turkey, the breast, the thighs, and the wings should all reach 165 °F (74 °C).',
        'If you cook stuffing inside the bird, the stuffing also needs to reach 165 °F (74 °C). Many cooks bake stuffing in a separate dish for this reason, and because it browns better.',
        'Check the thickest part of the breast and the thickest part of the thigh, away from the bone.')
      + '<h3>Beef, pork, and lamb roasts</h3>'
      + ul(
        'Roasts, steaks, and chops of beef, pork, and lamb: 145 °F (63 °C), then rest for 3 minutes.',
        'Ground meat and sausage: 160 °F (71 °C).')
      + '<h3>Fish</h3>'
      + ul('If you are serving a whole side of salmon or another fish as the main, the safe minimum is 145 °F (63 °C).')
      + '<h3>Egg dishes</h3>'
      + ul('Egg dishes such as a savory strata or a brunch bake should reach 160 °F (71 °C).')
      + '<h3>A vegetarian main that is not an afterthought</h3>'
      + p('If one guest does not eat meat, do not give them only the sides. A real main makes everyone at the table feel looked after. Good options include a stuffed squash, a mushroom and lentil wellington-style dish, a baked pasta, a big gratin, or a nut roast. Choose something that can be made ahead and reheated, and that does not need the oven at the same time as the roast.')
      + p('If you are cooking for a mixed table, label the dishes. A small card saying vegetarian, contains nuts, or contains dairy saves a lot of questions and protects anyone with an allergy.')
      + p('The thermometer rule matters for the vegetarian dish too if it contains egg, as in the case of a baked egg dish: 160 °F (71 °C) is the number for egg dishes.')],

    ['Sides that carry the meal', p(
      'Most guests remember the sides. They are also the part of the menu that you can make ahead with the least risk. Choose dishes in three groups, and notice which of them can be made before the day.')
      + '<h3>Dishes that improve when made ahead</h3>'
      + ul('Cranberry sauce and other relishes, which get better as the flavors settle.', 'Soups and gravy bases, which can be made and chilled.', 'Casseroles and gratins, which can be assembled and baked or reheated later.', 'Marinated or pickled vegetables.')
      + '<h3>Dishes that are best done on the day</h3>'
      + ul('Mashed potatoes, if you want them fluffy. You can peel and cut the potatoes ahead and keep them covered in cold water in the refrigerator.', 'Green vegetables, which lose color if they sit.', 'Gravy from the pan drippings, since it uses the roast.')
      + '<h3>Dishes that do not need you at all</h3>'
      + ul('A salad with the dressing on the side.', 'A cheese board or a tray of cold appetizers.', 'Bread and butter.')
      + p('Reheating matters for food safety. Cooked dishes that have been chilled should be brought back up to a hot temperature before serving, and any dish with meat or poultry in it should reach 165 °F (74 °C). Once hot dishes are on the table, they should be kept hot, at 140 °F (60 °C) or warmer, or put away within 2 hours.')
      + p('When you build the plan, notice how many of your sides need the same pan, the same burner, or the same oven slot. If two dishes need the oven at 350 °F and one needs 425 °F, change the recipe or make that dish ahead. That conflict, not a hard recipe, is the usual reason the table gets cold.')],

    ['Desserts, cakes, and the cookie tray', p(
      'Dessert is the best place to cook ahead, because most of it keeps well. Pick one showpiece and let the rest be easy.')
      + ul(
        '<strong>A pie or a cake.</strong> Make this the day before or earlier. Some pies and cakes freeze well. Check the recipe for the details, since we do not give storage times here.',
        '<strong>A trifle, mousse, or cheesecake.</strong> These need time in the refrigerator, so they are naturally make-ahead. They should stay at 40 °F (4 °C) or colder until you serve them.',
        '<strong>A cookie tray.</strong> A tray with four to six kinds looks generous, and it is a project that can be spread over weeks. Bake what freezes well early, and bake the delicate ones last.',
        '<strong>Something light.</strong> A bowl of citrus or poached fruit gives a break after a heavy meal.')
      + '<h3>How to build a cookie tray that looks good</h3>'
      + ul(
        'Mix shapes and colors: something round and plain, something with chocolate, something with a bit of jam, something with nuts, and one that looks festive.',
        'Include one kind without nuts, and say so on a small card.',
        'Bake in batches and cool completely before you stack or store them. Warm cookies soften the ones beneath them.',
        'Keep soft and crisp cookies apart, or the crisp ones lose their snap.')
      + p('When you scale a cookie recipe, look at the baking soda and the spices before you bake the whole batch, as covered above. If it is a recipe you have never made, bake one test cookie before you commit.')
      + p('If you keep your holiday baking in one folder, you can come back next year and see what worked. Add a line under My notes on the recipe about what you changed. A saved note beats a memory.')],

    ['Drinks', p(
      'Plan drinks like a dish, not like an afterthought. A good rule is to have one option for everyone: something hot, something cold, something non-alcoholic that feels special, and water on the table.')
      + ul(
        '<strong>Something hot.</strong> Coffee, tea, or cocoa. A pot of cocoa with toppings works well for kids and adults.',
        '<strong>A batch drink.</strong> A punch, a spiced cider, or a mulled drink that can be made ahead and kept warm or cold. Make a non-alcoholic version first, so everyone can have it, and add alcohol to the pitcher or glass only for guests who want it.',
        '<strong>Wine, beer, or spirits.</strong> If you serve alcohol, serve food with it and keep non-alcoholic choices easy to find. Make sure nobody who is driving is left guessing.',
        '<strong>Water.</strong> A pitcher on the table. It is the first thing people reach for and the last thing a host remembers.')
      + p('Ice is easy to forget and hard to find at the last minute. Buy it in the second shop, or make extra ahead. A cooler with ice can also hold cold drinks, which frees refrigerator space for food.')],

    ['Hosting without stress, and what guests can bring', p(
      'The best hosts are not the ones who do everything. They are the ones who decide what they will do, and let other people do the rest. When someone asks what they can bring, have an answer ready.')
      + ul(
        '<strong>A dish that travels well.</strong> A dessert, a salad, an appetizer, or a bread.',
        '<strong>A drink.</strong> A bottle, a case of sparkling water, or a pitcher of something non-alcoholic.',
        '<strong>Ice, napkins, or serving dishes.</strong> Unexciting, and useful.',
        '<strong>A job instead of a dish.</strong> Taking coats, pouring drinks, carrying plates, or washing up are real contributions. Ask for them.')
      + p('If guests are bringing food that needs to be heated, tell them in advance, and ask them to arrive with it ready. A hot dish that needs the oven and arrives at the last minute is the quiet way a plan falls apart. Ask which dishes need heat, and fit them into your oven map early.')
      + '<h3>Hosting without stress, in a handful of habits</h3>'
      + ul(
        'Write the day on paper. Seeing the plan removes the feeling that you have forgotten something.',
        'Do the hardest cooking first, and the plating last.',
        'Set out serving dishes with labels the day before, so you know what will go in each.',
        'Leave a small gap in the schedule. Something always runs late, and a gap means the whole day does not slide.',
        'Clean as you go. A clear counter is a calm kitchen.',
        'Let some things be good enough.')
      + p('Food safety is part of hosting. Wash your hands for 20 seconds before you cook and after you handle raw meat. Use separate cutting boards for raw meat and for food that will not be cooked. Do not leave food out for more than 2 hours, or more than 1 hour if the room is hotter than 90 °F (32 °C).')],

    ['Sharing the plan with your household', p(
      'If you cook with other people, the plan needs to live in a place everyone can see. A group chat full of screenshots does not work, because nobody can find anything.')
      + p('In Matlyst, a member with Pro can create a household for up to 6 people, and it is free for the others to join. The grocery list, the meal plan, and the pantry are shared and update live for everyone. That means one person can add oranges while another is in the store, and the list is always current. See the <a href="/en/shopping-list/">shopping list</a> page for how that works, and the <a href="/en/pantry-app/">pantry page</a> for the pantry.')
      + ul(
        '<strong>Split the shopping.</strong> One person takes the second shop for produce, another picks up the roast and the drinks. Everyone sees the same list, and an item one person checks off is checked for everyone. Checked items move to the pantry by themselves after 15 seconds, with an undo button.',
        '<strong>Split the cooking.</strong> Put each recipe on the meal plan for the day it will be made, and decide who is making it.',
        '<strong>Keep the pantry honest.</strong> When you add a recipe to the grocery list, items already in your pantry are left unselected and marked “In your pantry”, so you skip buying them twice. On the free plan, the pantry shows the first 5 items.')
      + p('The household is for the people in your home. If your sister is hosting and you are bringing a dish, use Share recipe to send her a link to it, and keep your own grocery list. You do not need to add her to your household for that.')],

    ['Cook mode and the day-of timeline', p(
      'On the day, a written timeline is the single most useful thing in the kitchen. Count backward from the time you want to eat. Include the roast resting time from your recipe, the reheating of make-ahead dishes, and a few quiet minutes for you.')
      + '<h3>A skeleton you can adapt</h3>'
      + ol(
        'Take out what needs to come to a cooler room temperature, if your recipe says so. Keep raw meat in the refrigerator until you are ready to cook it.',
        'Start the roast with enough time to finish and rest. Check the temperature with your thermometer, not just the clock.',
        'While the roast cooks, finish the sides that do not need the oven, and set out serving dishes.',
        'When the roast comes out, tent it loosely and let it rest. This is when the oven is free for reheating sides.',
        'Make the gravy, finish the vegetables, and warm the rolls.',
        'Carve, plate, and put the hot dishes on the table. Keep hot food at 140 °F (60 °C) or warmer if it will sit.',
        'Serve dessert later. While everyone is at the table, put leftovers in the refrigerator within 2 hours.')
      + p('Matlyst has a <a href="/en/recipe-book-app/">cook mode</a> for recipes. It shows the recipe as a checklist you tick off as you go, suggests timers from the step text, and keeps the screen awake while you cook. It needs an internet connection, so if your kitchen has weak signal, open the recipe before you start, and keep a paper copy of the timeline. Ask Matlyst, available with Pro, can help you adapt a recipe with AI, for example when a guest cannot eat an ingredient. It has a monthly quota, you can choose Save a copy or Replace, and the result is marked adapted. AI can make mistakes, so check the amounts and the steps before you cook.')],

    ['Leftovers', p(
      'Leftovers are part of the plan, not an accident. Decide in advance whether you want them. Many hosts do, because a day-after sandwich is one of the best parts of the holiday.')
      + p('The rules are the same ones that apply to everything else.')
      + ul(
        'Refrigerate leftovers within 2 hours, or within 1 hour if the room is hotter than 90 °F (32 °C).',
        'Divide large amounts into shallow containers so they cool quickly.',
        'Keep your refrigerator at 40 °F (4 °C) or colder, and your freezer at 0 °F (-18 °C) or colder.',
        'Cooked meat and poultry leftovers keep for 3 to 4 days in the refrigerator. If you do not think you will eat them in that time, freeze them.',
        'Reheat leftovers to 165 °F (74 °C). That includes casseroles and anything with meat or poultry in it.',
        'Thaw frozen leftovers in the refrigerator, not on the counter.')
      + p('Plan for the second meal before you start. Ham goes into sandwiches, soup, and breakfast hash. Turkey goes into pot pie, a rice dish, or a salad. Roast beef goes into sandwiches and a quick stew. Vegetables turn into frittatas or soup. If a recipe is more than you can use, send guests home with containers.')
      + p('For ideas, the <a href="/en/empty-the-fridge/">empty the fridge page</a> and <a href="/en/recipes-by-ingredients/">recipes by ingredients</a> help you build the next meal from what you have. If you are interested in how Thanksgiving leftovers work, our <a href="/en/holidays/thanksgiving-leftovers/">Thanksgiving leftovers guide</a> applies the same rules.')],

    ['Three scenarios', scenarioNotat('en')
      + scenario('Say you are hosting eight on Christmas Day', {
        situasjon: 'You have one oven, and the menu has a ham, scalloped potatoes, a green bean casserole, rolls, and a pie.',
        galt: 'The potatoes and the casserole both need the oven, and the ham will be in it for most of the afternoon.',
        gjor: 'You move the casserole and the pie to the day before, reheat the casserole while the ham rests, and make the potatoes in a slow cooker. You check the ham label to see which kind it is and use the temperature that matches.',
        matlyst: 'You save the five recipes to a Christmas folder, put each one on the meal plan for the day it will be made, and use one grocery list for all five.',
      })
      + scenario('Say you are cooking for two, and your partner is vegetarian', {
        situasjon: 'It is the two of you, and you still want it to feel like Christmas.',
        galt: 'A whole roast makes far too much, and a plate of only sides would feel like an afterthought for your partner.',
        gjor: 'You choose one special main for both of you, such as a stuffed squash, and make two sides and a small dessert. You scale the recipes down to two servings and check the spices by taste.',
        matlyst: 'You scale each recipe to 2 servings and read the amounts. You use the grocery list for one short shop.',
      })
      + scenario('Say you are one of four people helping with a dinner for sixteen', {
        situasjon: 'Four households are splitting the work, and one of them is hosting.',
        galt: 'Everyone is making plans in a group chat, two people are bringing the same side, and nobody knows who is buying the drinks.',
        gjor: 'You write the menu once, assign one dish per household, and assign drinks, ice, and dessert to named people. The host puts the oven map on paper.',
        matlyst: 'If the four of you live together, you can share a household list. If not, you send each other the recipes with Share recipe, and each person keeps their own list.',
      })],

    ['Troubleshooting on the day', ul(
        '<strong>The roast is done early.</strong> Tent it loosely and let it rest longer. Resting is forgiving. If the temperature has fallen, keep the meat covered, and reheat sliced meat with gravy to 165 °F (74 °C) if it is poultry or a reheated ham.',
        '<strong>The roast is not done on time.</strong> Do not serve it. Use the thermometer. Start with the sides and appetizers, and give people something to nibble on. Cutting a large roast into smaller pieces can cook it faster.',
        '<strong>The gravy is thin.</strong> Simmer it longer or whisk in a little flour or cornstarch mixed with cold water.',
        '<strong>The gravy is lumpy.</strong> Strain it.',
        '<strong>The potatoes are gluey.</strong> They were over-mixed. Serve them anyway, and use the leftovers for a pan of hash.',
        '<strong>Everything is cooling.</strong> Hot food should be kept at 140 °F (60 °C) or warmer. Use a warm oven, a slow cooker, or chafing dishes to hold dishes at that temperature, and check with the thermometer. Anything that drops below 140 °F (60 °C) counts toward the 2-hour limit.',
        '<strong>A guest has an allergy you did not know about.</strong> Check the ingredients, and offer plain food you know is safe. Do not guess.',
        '<strong>You are out of oven space.</strong> A slow cooker, a covered dish on the stove, a toaster oven, or a microwave can finish some dishes.',
        '<strong>You are out of time.</strong> Drop a side. Nobody will remember a missing dish, and everyone will remember a host who looked calm.')],

    ['What Matlyst does not do', p('A good tool says where it stops. Here is what to expect.')
      + ul(
        '<strong>It does not give you a roasting time.</strong> Times depend on the cut, the weight, and your oven. Use your recipe and a thermometer.',
        '<strong>It reads captions, not audio.</strong> From Instagram and TikTok, Matlyst reads the caption, one recipe per post, and not the slides of a carousel. If a creator only says the amounts in a video, type them in after you import.',
        '<strong>It does not read comments.</strong> If the recipe is in a comment or behind a link in the bio, copy it in or share the page link.',
        '<strong>AI can make mistakes.</strong> Matlyst uses AI to read and translate recipes. Check amounts and steps, especially from photos.',
        '<strong>Cook mode needs an internet connection.</strong> Open the recipe before you start if your connection is weak.',
        '<strong>The free plan has limits.</strong> You get 5 imports per calendar month. Photo import, Ask Matlyst, and creating a household are part of Matlyst Pro.')],

    ['Common mistakes', ul(
      '<strong>Deciding the menu too late.</strong> The menu drives the shopping, the ordering, and the oven map.',
      '<strong>Making two mains.</strong> You cook twice as much and have twice as many leftovers.',
      '<strong>Ignoring oven space.</strong> This is the most common reason dinner is late.',
      '<strong>Trusting the clock instead of a thermometer.</strong> Use a thermometer for every roast.',
      '<strong>Thawing on the counter.</strong> Use the refrigerator.',
      '<strong>Leaving food out.</strong> More than 2 hours is too long.',
      '<strong>Not asking about allergies.</strong> Ask everyone, early.',
      '<strong>Doing everything yourself.</strong> Let people bring something and help.')
      + p('For the neighboring holidays, see <a href="/en/holidays/new-years-eve/">New Year’s Eve</a>, <a href="/en/holidays/friendsgiving/">Friendsgiving</a>, and the <a href="/en/holidays/thanksgiving/">Thanksgiving planner</a>. If you are choosing an app for all of this, our guide on <a href="/en/blog/choose-recipe-organizer-app/">how to choose a recipe organizer app</a> lists what to look for. To bring in recipes from social media, see <a href="/en/import-recipes-from-instagram/">Instagram</a>, <a href="/en/import-recipes-from-tiktok/">TikTok</a>, or <a href="/en/import-recipes/">other sources</a>.')],
  ],
});

export const side = {
  title: 'Christmas Dinner Planner: Menu, Timeline, Leftovers',
  description: 'Plan Christmas dinner from four weeks out: menu, two grocery rounds, make-ahead dishes, safe roast temperatures, a timeline for the day, and leftovers.',
  eyebrow: 'Holiday planner',
  h1: 'How to plan Christmas dinner without the stress',
  lead: 'A four-week plan, a menu that fits one oven, safe temperatures for the roast, and a plan for the leftovers. Christmas Eve is December 24 and Christmas Day is December 25 this year.',
  forst: 'Decide the menu early, shop in two rounds, and cook ahead.',
  stegTittel: 'Plan Christmas dinner in three steps',
  steg: [
    ['Save and choose', 'Put every candidate recipe in one folder, then cut the menu to one main, a few sides, and a dessert.'],
    ['Scale and shop', 'Scale each recipe to your guest count, then use one grocery list in two rounds: dry goods first, fresh food last.'],
    ['Cook ahead, then follow a timeline', 'Make what keeps, write the day backward from dinner time, and check the roast with a thermometer.'],
  ],
  alternativ: '',
  grense: '',
  seksjoner: [],
  faqTittel: 'Christmas dinner questions',
  rik: rik.html,
  faq: [
    ['When should I start planning Christmas dinner?', 'About four weeks before. Set the guest count and the menu first, order the roast, and shop for long-life items before the fresh ones.'],
    ['What is a good Christmas dinner menu?', 'One main such as ham, turkey, or a beef roast, a starch, one or two vegetables, something bright like cranberry sauce, bread, and a dessert. Keep it to what your oven can handle.'],
    ['How do I scale recipes for more guests?', 'Matlyst scales a recipe from 1 to 20 servings in a straight line. Check baking powder, baking soda, yeast, salt, and spices by hand, and remember that pan size and cooking time can change.'],
    ['What temperature should turkey reach?', 'A whole turkey, the breast, thighs, and wings should reach 165 °F (74 °C) in the thickest part, without touching bone. Stuffing cooked inside the bird must reach 165 °F (74 °C) too.'],
    ['What temperature should ham reach?', 'Raw ham should reach 145 °F (63 °C) and rest for 3 minutes. Fully cooked ham being reheated should reach 165 °F (74 °C). Ham packaged in a USDA-inspected plant should reach 140 °F (60 °C).'],
    ['What temperature should a beef roast reach?', 'Beef, pork, and lamb roasts should reach 145 °F (63 °C), then rest for 3 minutes. Ground meat and sausage should reach 160 °F (71 °C).'],
    ['How long can food sit out at the table?', 'No more than 2 hours, or 1 hour if the room is hotter than 90 °F (32 °C). Keep hot food at 140 °F (60 °C) or warmer.'],
    ['How do I thaw a frozen roast safely?', 'In the refrigerator, not on the counter. Follow the instructions on the package for how long it needs.'],
    ['How long do Christmas leftovers last?', 'Cooked meat and poultry keep 3 to 4 days in a refrigerator set to 40 °F (4 °C) or colder. Refrigerate within 2 hours and reheat to 165 °F (74 °C).'],
    ['What should I ask guests to bring?', 'A dish that travels well, a drink, ice, or a job such as pouring drinks and washing up. Ask which dishes need heating so you can fit them into your oven plan.'],
    ['Can several people share one plan and shopping list?', 'Yes. A Matlyst Pro member can create a household for up to 6 people. Joining is free, and the grocery list, meal plan, and pantry update live for everyone.'],
    ['What do I do for a vegetarian guest?', 'Serve a real main, not only sides: a stuffed squash, a gratin, a baked pasta, or a nut roast. Make it ahead and label it on the table.'],
    ['Does Matlyst give roasting times?', 'No. Times depend on the cut, weight, and oven. Use your recipe as a guide and a thermometer as the judge.'],
  ],
  cta: 'Start your Christmas folder',
};

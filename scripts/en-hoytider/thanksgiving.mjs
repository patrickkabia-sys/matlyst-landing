// Høytidsside: Thanksgiving-planen (en-US). Tall for matsikkerhet kommer fra FoodSafety.gov; porsjonsråd er hjemmekjøkken-erfaring.
import { byggRik, scenario, scenarioNotat } from './../rik-sider.mjs';

const p = (...ps) => ps.map((t) => `<p>${t}</p>`).join('');
const ul = (...li) => `<ul>${li.map((t) => `<li>${t}</li>`).join('')}</ul>`;
const ol = (...li) => `<ol>${li.map((t) => `<li>${t}</li>`).join('')}</ol>`;
const h3 = (t) => `<h3>${t}</h3>`;
const tabell = (hode, rader) => `<table><thead><tr>${hode.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rader.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;

const rik = byggRik({
  svarTekst: 'Thanksgiving 2026 is Thursday, November 26. Plan backward from that day: decide the menu and the guest list three weeks out, order the turkey and shop in two rounds, thaw it in the refrigerator, cook ahead everything that reheats well, and give the oven one schedule. Save every recipe in one Matlyst folder, scale it to your guest count, and shop from one combined grocery list.',
  seksjoner: [
    ['Why a Thanksgiving plan beats a Thanksgiving recipe',
      p('Most Thanksgiving trouble is not a cooking problem. A turkey is not hard. A mashed potato is not hard. What goes wrong is that eight or ten dishes all want the same oven, the same four burners, and the same twenty minutes before the guests sit down. The cook who looks calm on the day usually did nothing clever that morning. They made decisions three weeks earlier and moved work out of Thursday.',
        'This page is a plan, not a menu. It works backward from the day, gives you rules of thumb for scaling the meal from 4 to 16 guests, shows how to fit a whole dinner into a single oven, and tells you what can be made days ahead. It also covers the food safety rules that matter most when a big bird and a lot of leftovers are involved.',
        'A note on the numbers. The food safety temperatures and holding times on this page come from FoodSafety.gov, and we link to the charts below. The portion guidance, the timelines, and the oven schedule are home cooking experience and common sense. They are rules of thumb, not official figures, so adjust them to your family, your appetites, and your recipes.',
        'Every dated step is counted from Thursday, November 26. If you are reading this late, skip ahead to the week you are in. Nothing here needs to be done in a perfect order, and a plan you start at T-minus-one-week still beats no plan.')],
    ['The T-minus timeline, from three weeks out to the day',
      p('Read the whole timeline once, then put the dates in a calendar or a note. If you use Matlyst, place each dish in the meal plan on the day you will cook it. The point of each step is to remove one decision from the final days.')
      + h3('Three weeks out: decide the shape of the day')
      + p('Settle the headcount, the time you want to eat, and the menu. Write the guest list with any allergies, dietary rules, and kids who will only eat rolls. Pick the dishes, and be strict about a ceiling. A good Thanksgiving table has one turkey, one or two starches, one or two vegetables, one cranberry, gravy, rolls, and one or two desserts. Every dish beyond that is a dish you will not be able to heat, plate, or enjoy.')
      + p('Choose the recipes now, and save them where you can find them at the stove. If a recipe lives in a screenshot, a bookmark, or a video you half remember, this is the week to turn it into a real recipe. See the section on saving and scaling below.')
      + h3('Two and a half weeks out: delegate and order')
      + p('Decide what guests will bring (more on that below) and send those requests early, while people still have empty calendars. Order the turkey if you are buying fresh or from a butcher, and ask when you can pick it up. If you are buying a frozen bird, you can buy it now and put it in the freezer, but you must know when to move it to the refrigerator. For thaw time, use the USDA’s Turkey Thawing Calculator, which FoodSafety.gov points to. We are not going to guess hours here, because the right number depends on the size of your bird.')
      + h3('Two weeks out: check your equipment')
      + p('Count what you own. A roasting pan with a rack, a reliable food thermometer, enough foil, serving dishes with matching serving spoons, a gravy boat or a pitcher, a big pot for potatoes, and room in the refrigerator. Borrow what you are missing, and buy a thermometer now if yours is old. The thermometer is the one tool the rest of the day depends on.')
      + p('Measure your refrigerator, too. A thawing turkey, a pot of cranberry sauce, trays of prepped vegetables, and drinks all need shelf space during the same few days. If it will be tight, plan a cooler for drinks and a second place for cold sides.')
      + h3('One week out: shop round one')
      + p('The first grocery run is for everything that lasts: canned goods, broth, flour, sugar, spices, baking supplies, foil, bags, paper goods, drinks, and the frozen turkey if you are not buying fresh. Doing this early spreads out the cost and means you are not the person fighting for the last can of pumpkin on Tuesday. The list structure is in its own section below.')
      + p('If your turkey is frozen, check the thawing calculator today, and set a reminder on your phone for the day it must go into the refrigerator.')
      + h3('Thaw day: start the turkey and the first ahead dishes')
      + p('A frozen turkey thaws in the refrigerator, not on the counter. FoodSafety.gov is clear that the refrigerator is the safest way to thaw. Put the bird on a tray or in a pan so juices cannot reach other food, on the bottom shelf. The USDA’s Turkey Thawing Calculator tells you which day this is for your bird. For a large turkey it can be several days before Thursday, so do not leave it to the weekend before and hope.')
      + p('Somewhere in this stretch, make cranberry sauce, which improves as it sits, and to bake any pie crust or shells you plan to freeze. Write down what is already done so you do not redo it on a tired Wednesday.')
      + h3('Two to three days out: shop round two')
      + p('The second grocery run is for everything fresh: produce, dairy, bread, and herbs. A fresh, unfrozen turkey is the exception. FoodSafety.gov’s cold storage chart gives a fresh whole turkey only 1 to 2 days in the refrigerator, so pick it up on Tuesday or Wednesday for a Thursday dinner. Shopping two or three days out beats shopping the day before, because the shelves are full and the lines are short. Buy a little extra butter, a little extra broth, and an extra onion. Those three are what people run out of.')
      + h3('Two days out: prep and make-ahead cooking')
      + p('Chop the onions, celery, and carrots for the stuffing and the gravy base. Cube the bread for stuffing and let it dry. Make the pies or the dessert that sets overnight. Assemble casseroles up to the point of baking, and keep them covered in the refrigerator. Make the make-ahead list below your project.')
      + h3('The day before: set the table and get the bird ready')
      + p('Set the table, lay out serving dishes with a sticky note on each saying what goes in it, clear a space for the turkey to rest, and charge your phone. Wash your hands for at least 20 seconds with soap and water before and after you touch raw poultry, and keep a separate cutting board for it. Do not wash the turkey. Washing raw poultry spreads bacteria around the sink and counter, and cooking to a safe temperature is what kills them.')
      + p('Finish dishes that reheat well: mashed potato base, green bean prep, rolls shaped and ready to bake, gravy base if you are using a make-ahead gravy. Put the plan for the day on paper and tape it where you cook.')
      + h3('The day: work from the clock, not from feelings')
      + p('The minute-by-minute schedule is in its own section. The short version: you choose the time the turkey comes out, then everything else is counted backward and forward from that moment. The turkey rests while the oven becomes free for the sides.')],
    ['How much to cook: scaling for 4, 8, 12, and 16 guests',
      p('These are rules of thumb from home cooking. They are not official guidance, and they are written to leave you with a day or two of leftovers, which most people want. If your family eats lightly or you have a lot of side dishes, go toward the lower number. If your guests include hungry teenagers, or you plan to send people home with plates, go toward the higher one.')
      + tabell(['Dish', 'Per guest (rule of thumb)', '4 guests', '8 guests', '12 guests', '16 guests'], [
        ['Turkey, bone-in', 'About 1 to 1.5 lb', '4 to 6 lb', '8 to 12 lb', '12 to 18 lb', '16 to 24 lb'],
        ['Potatoes, raw', 'About 1/2 lb', '2 lb', '4 lb', '6 lb', '8 lb'],
        ['Stuffing', 'About 3/4 cup cooked', '3 cups', '6 cups', '9 cups', '12 cups'],
        ['Gravy', 'About 1/4 cup', '1 cup', '2 cups', '3 cups', '4 cups'],
        ['Cranberry sauce', 'About 2 tablespoons', '1/2 cup', '1 cup', '1.5 cups', '2 cups'],
        ['Vegetable sides, total', 'About 1/2 cup per dish, per guest', '2 dishes', '3 dishes', '3 to 4 dishes', '4 dishes'],
        ['Rolls', '1 to 2', '6', '12', '18', '24'],
        ['Pie', 'One slice, maybe two', '1 pie', '2 pies', '3 pies', '4 pies'],
      ])
      + p('Two things the table hides. First, a bigger turkey is not always better. A very large bird takes a long time to thaw, a long time to cook, and is hard to fit in a home oven. At 12 or more guests, two smaller turkeys, or one turkey plus a turkey breast, can cook more evenly and fit the oven better. Second, the table counts guests, not appetites. Add a plate or two for people who arrive late and for the leftover plates you promised.')
      + h3('Scaling the dishes themselves')
      + p('Doubling a recipe is not always a clean doubling. Sauces and gravies scale easily. Casseroles need a bigger dish or two dishes, and baking time changes with depth, so rely on the temperature and the look, not the clock. Pie fillings can be doubled, but you need a second pie plate and your oven cannot bake four pies on one rack at once. For baked goods, be careful with leavening, salt, and spices, because they do not always scale in a perfectly straight line.')
      + p('In Matlyst you can change a recipe’s servings from 1 to 20 and every amount follows. Scaling is linear, which is correct for most Thanksgiving cooking and a trap for some baking, so check baking powder, baking soda, yeast, and strong spices yourself before you commit.')
      + p('If you are cooking for fewer than four, do not skip the holiday. A turkey breast, a smaller set of sides, and a single pie make a real Thanksgiving for two people, and the leftover planning is easier too.')],
    ['The grocery list, in two rounds and by store department',
      p('A single giant Thanksgiving grocery run is a mistake for two reasons: you will forget things, and fresh food bought a week early is worse by the time you cook it. Two rounds fixes both. Within each round, organize by store department so you walk the store once.')
      + h3('Round one: about a week out')
      + ul('<strong>Pantry and baking:</strong> flour, sugar, brown sugar, baking powder, baking soda, yeast, vanilla, cornstarch, spices, canned pumpkin, evaporated milk, stuffing bread if it is shelf stable, canned cranberry if you use it, broth.',
        '<strong>Frozen:</strong> the turkey if you are buying frozen, pie crusts, ice cream, frozen vegetables as a backup.',
        '<strong>Drinks:</strong> wine, sparkling water, juice, coffee, tea, ice.',
        '<strong>Household:</strong> foil, parchment, zip bags, containers for leftovers, paper towels, napkins, a disposable roasting pan if you need a second one.')
      + h3('Round two: 2 to 3 days out')
      + ul('<strong>Produce:</strong> potatoes, onions, celery, carrots, garlic, green beans, sweet potatoes, fresh herbs, lemons, apples, cranberries if fresh.',
        '<strong>Meat:</strong> bacon or sausage if a recipe needs it. Pick up a fresh turkey no more than 1 to 2 days before you cook it.',
        '<strong>Dairy and eggs:</strong> butter (more than you think), cream, milk, eggs, cheese.',
        '<strong>Bakery:</strong> rolls, bread for stuffing, if you are not baking your own.')
      + p('Check your cupboards against the list before you leave. The most common Thanksgiving shopping failure is not forgetting an ingredient, it is buying a third jar of cinnamon because you did not look.')
      + p('In Matlyst, you add each recipe to the <a href="/en/shopping-list/">grocery list</a> and the ingredients land on one list. The same item from several recipes shares one line. Amounts in the same unit are added together, and amounts in different units are shown together on that line, for example “1 cup · 200 g”. Tap the amount to tidy it into one. When you add a recipe, items already in your <a href="/en/pantry-app/">pantry</a> are left unselected and marked “In your pantry”, so you only add what you need. The list is sorted by store section. Add each recipe once you have scaled the servings, not before.')],
    ['Fitting a whole dinner into one oven',
      p('The oven is the bottleneck of every Thanksgiving. The turkey wants it for a long stretch, and almost everything else also wants it at the end. The fix is to separate what truly needs the oven from what can be cooked another way, then schedule the oven in blocks.')
      + h3('Take the load off the oven')
      + ul('Mashed potatoes, cranberry sauce, gravy, green beans, and glazed carrots can all be made on the stove.',
        'Casseroles, stuffing, and rolls can be made ahead and reheated in a short window after the turkey comes out.',
        'A slow cooker keeps mashed potatoes, soup, or cider warm without a burner or the oven. A second small appliance, like an air fryer or toaster oven, can handle a small dish.',
        'Pies can be baked the day before, so they leave the oven schedule entirely. Keep pumpkin and other custard-style pies in the refrigerator until shortly before dessert.')
      + h3('A single-oven schedule')
      + p('Every home oven is different, and a turkey’s cooking time depends on its size and whether it is stuffed, so we are not going to put times on the turkey here. The USDA’s Turkey Cooking Calculator, mentioned on FoodSafety.gov, gives you the range, and your thermometer decides. Choose a target time to carve (call it T). Work like this:')
      + ol('<strong>The turkey goes in first,</strong> early enough that, by the calculator’s range, it is done with a cushion before T. A turkey can rest and stay hot under foil while you finish everything else. A turkey that is late is a problem, a turkey that is early is just resting.',
        '<strong>While the turkey cooks,</strong> the oven is full, so use the stove and the slow cooker. Make the gravy base, boil and mash the potatoes, cook the vegetables, and keep them warm.',
        '<strong>When the turkey comes out,</strong> tent it with foil and put the oven to work. This short window is where most of your reheating happens. Casseroles and stuffing go in, rolls go in last.',
        '<strong>While the oven is busy,</strong> carve the turkey, make the gravy with the pan drippings, and put the table together.',
        '<strong>Right before T,</strong> everything comes out at once, and you carry it to the table. Sides that have to stay hot should not sit below 140 °F (60 °C).')
      + p('If your stuffing is cooked inside the bird, it must reach 165 °F (74 °C), same as the turkey. Many cooks avoid this by baking the stuffing in a separate dish, which also frees the bird’s cavity for faster, more even cooking and means you can make the stuffing ahead.')
      + p('If you simply cannot fit a dish, the answer is not a smaller oven schedule, it is a smaller menu. Cut the dish that is third on everyone’s list.')],
    ['The minute-by-minute plan for Thanksgiving Day',
      p('Write this out on paper using your own times. The structure below is counted from T, the time you plan to sit down, and the turkey’s start time comes from your calculator. Print it and tape it up, so you are not remembering a schedule while you are carving.')
      + tabell(['When', 'What'], [
        ['Early morning', 'Follow your recipe for when the turkey leaves the refrigerator. Put the thermometer where you can find it. Preheat the oven to your recipe’s temperature. Wash hands, and keep raw turkey away from everything else.'],
        ['Turkey in', 'Set a timer for the first temperature check at the earliest time the calculator allows, not the latest. Check in the thickest part of the breast and the thigh, without touching bone, fat, or gristle.'],
        ['Mid-morning', 'Cook the cranberry sauce if it is not already made. Set out the platters for the appetizers, and keep the food itself cold until guests arrive. Peel and cut the potatoes, and put them in cold water.'],
        ['Midday', 'Start the stovetop work: gravy base, vegetables ready to cook. Put drinks on ice. Check on your guests who are bringing dishes, and clear refrigerator space.'],
        ['When the turkey reads 165 °F (74 °C)', 'Take it out, tent it with foil, and set it where it can rest. The oven is free. Reheat casseroles and stuffing, and bake the rolls.'],
        ['Turkey resting', 'Boil and mash the potatoes, finish the vegetables, make the gravy from the pan drippings, and plate sides into the dishes you labeled yesterday.'],
        ['About 30 minutes before T', 'Carve. Move food to the table. Light the candles and fill the water glasses.'],
        ['T', 'Eat. Do not let anyone ask you to cook another thing.'],
        ['Within 2 hours of T', 'Put leftovers away. See the separate leftovers page for how.'],
      ])
      + p('Two rules save the day. First, do not trust the clock for doneness. A thermometer reading of 165 °F (74 °C) in the thickest part of the breast, the innermost part of the thigh, and the innermost part of the wing, without touching bone, tells you the turkey is safe. Second, keep hot food hot. Cooked food held between 40 °F (4 °C) and 140 °F (60 °C) is in the danger zone, where bacteria grow fast.')],
    ['What to cook ahead and what to cook on the day',
      p('Almost every recipe falls into one of three groups. Knowing which group it is in turns a stressful Thursday into a manageable one.')
      + h3('Cook ahead, even days in advance')
      + ul('Cranberry sauce, which tastes better after a night or two in the refrigerator.',
        'Pie crusts, pie fillings, and whole pies. Pumpkin, pecan, and apple all hold well. Keep custard-style pies cold.',
        'Rolls and dough, shaped and refrigerated, or baked and rewarmed.',
        'Stuffing components: dried bread cubes, chopped vegetables, cooked sausage. You can assemble the dish and refrigerate it before baking.',
        'Gravy base, made with turkey wings or stock, then finished with the pan drippings on the day.',
        'Casseroles, such as sweet potato or green bean, assembled without the topping that needs to stay crisp.')
      + h3('Cook the day before')
      + ul('Whole desserts that need to set.',
        'Mashed potato base, if you are willing to reheat it with extra butter and milk.',
        'Chopped and washed vegetables, bagged and refrigerated.',
        'Salads, undressed.')
      + h3('Cook on the day, because nothing else works')
      + ul('The turkey, obviously.',
        'Anything that must be crisp at the table, like a topping or fried onions.',
        'Gravy finished with the pan drippings.',
        'Rolls that must be hot.')
      + p('When you reheat made-ahead dishes, they need to be hot all the way through, and food that already had meat or poultry in it must come up to 165 °F (74 °C). Use the thermometer on casseroles, not just your eyes.')],
    ['Food safety for a big meal',
      p('Thanksgiving is one of the largest food safety tests of the year. It is a large piece of meat, a crowded refrigerator, many hands, and food that sits out while people talk. The rules are not complicated. These are drawn from FoodSafety.gov’s <a href="https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures">safe minimum internal temperatures</a>, <a href="https://www.foodsafety.gov/keep-food-safe/4-steps-to-food-safety">four steps to food safety</a>, and <a href="https://www.foodsafety.gov/food-safety-charts/cold-food-storage-charts">cold food storage charts</a>.')
      + h3('Cook to the right temperature, and use a thermometer')
      + ul('Whole turkey, breast, thighs, wings, ground poultry, giblets, and stuffing inside poultry: 165 °F (74 °C).',
        'Measure in the thickest part, without touching bone, fat, or gristle.',
        'If you are also serving other meats: beef, pork, and lamb roasts, steaks, and chops reach 145 °F (63 °C) with a 3-minute rest. Ground meat and sausage reach 160 °F (71 °C). Raw ham reaches 145 °F (63 °C) with a 3-minute rest, fully cooked ham from a plant inspected by USDA is reheated to 140 °F (60 °C), and other pre-cooked ham is reheated to 165 °F (74 °C). Fish reaches 145 °F (63 °C). Egg dishes such as quiche reach 160 °F (71 °C).')
      + h3('Thaw in the refrigerator')
      + p('Never thaw on the counter. The refrigerator is the safest way. Use the USDA’s Turkey Thawing Calculator, and put the turkey on a tray so it cannot drip onto other food.')
      + h3('Keep clean, and keep raw separate')
      + ul('Wash hands with soap and water for at least 20 seconds, before and after handling raw turkey.',
        'Use separate cutting boards for raw meat and for vegetables and bread.',
        'Do not wash the turkey. Washing spreads bacteria around your kitchen.',
        'Never put cooked food back on a plate that held the raw turkey.')
      + h3('Hot food hot, cold food cold')
      + ul('The danger zone is 40 °F (4 °C) to 140 °F (60 °C).',
        'Keep hot dishes at 140 °F (60 °C) or above, with a slow cooker, a warming tray, or a low oven.',
        'Do not leave perishable food out for more than 2 hours, or 1 hour if the temperature is above 90 °F (32 °C), for example if the meal is on a hot patio.',
        'Your refrigerator should be at 40 °F (4 °C) or colder, and your freezer at 0 °F (-18 °C) or colder.')
      + p('Put leftovers into shallow containers so they cool quickly, and get them into the refrigerator within the 2-hour window. For the full storage and reheating rules, see <a href="/en/holidays/thanksgiving-leftovers/">what to do with Thanksgiving leftovers</a>.')],
    ['Sharing the load: guests, potluck, and who does what',
      p('The host who does everything is usually exhausted and a little resentful by the time dessert arrives. Most guests want to help, and a clear job is kinder than a vague “bring anything.”')
      + h3('What to ask guests to bring')
      + ul('<strong>Desserts.</strong> They travel well, they do not need the oven, and everyone has a specialty.',
        '<strong>Cold sides and starters:</strong> a salad, a relish tray, deviled eggs, a cheese board.',
        '<strong>Drinks and ice.</strong> This frees up the refrigerator and your budget.',
        '<strong>A dish that suits their own diet.</strong> This is the easiest way to make sure a vegetarian, vegan, or gluten-free guest has a full plate.',
        'Do not ask guests to bring anything that needs oven time at your house, unless you have planned it into the schedule.')
      + h3('How to ask')
      + p('Be specific. “Could you bring a pie, any kind?” gets a pie. “Bring something!” gets three bags of chips. Write down who is bringing what in a shared place, so two people do not show up with the same green bean casserole. A group message or a shared note works. If you cook with a partner or housemates, a Matlyst household shares the grocery list, the meal plan, and the pantry live.')
      + h3('Jobs that are not cooking')
      + ul('One person handles drinks.',
        'One person greets guests and takes coats.',
        'One person plates and carries the dishes to the table.',
        'One person does dishes during the day so the sink is not a mountain at 5 p.m.',
        'One person carves, ideally not the host, so the host can finish the gravy.')
      + p('The cleanest way to ask for help is to hand people a job with a time on it. “Could you do drinks at 2?” is easy to say yes to.')],
    ['Three “Say you …” scenarios',
      scenarioNotat()
      + scenario('Say you are hosting for the first time, for 8 people', {
        situasjon: 'It is two weeks out. You have a rough idea of the menu from a family group chat and five recipes saved in three places.',
        galt: 'You shop once on Tuesday, find the turkey is frozen solid, and realize you have no thermometer.',
        gjor: 'Make a menu with one turkey, two sides on the stove, one casserole, rolls, and a store-bought pie. Buy the turkey now, check the USDA’s Turkey Thawing Calculator, and buy a thermometer.',
        tall: 'For 8 guests the rule-of-thumb table above suggests an 8 to 12 pound bird, around 4 pounds of potatoes, and 2 pies.',
        matlyst: 'Save the recipes into one Thanksgiving folder, set each one to 8 servings, add them all to the grocery list, and shop in two rounds.',
      })
      + scenario('Say you are cooking for 16 and your oven is a standard home oven', {
        situasjon: 'A big family is coming. One 24-pound turkey is on the shopping list.',
        galt: 'The giant bird barely fits the oven, takes forever to thaw, and leaves no room for anything else.',
        gjor: 'Cook two smaller turkeys, or a turkey and a turkey breast, and move all the sides to the stove, a slow cooker, and make-ahead casseroles. Use the thawing and cooking calculators for each bird.',
        tall: 'A smaller bird also gives you a better shot at an even result at the safe temperature of 165 °F (74 °C).',
        matlyst: 'Scale each recipe to 16 servings, check baking powder and yeast by hand, and let the household share the live grocery list so two people can shop at once.',
      })
      + scenario('Say you are making Thanksgiving in a small apartment kitchen', {
        situasjon: 'You have one oven, four small burners, and a tiny refrigerator.',
        galt: 'Everything is ready at once, and nothing fits in the refrigerator on Wednesday.',
        gjor: 'Choose dishes that cook in different ways: one oven dish, two stove dishes, one slow cooker dish. Ask guests to bring cold sides and desserts, and ask a neighbor or a friend to hold a cooler of drinks.',
        matlyst: 'Put the make-ahead recipes on Tuesday and Wednesday in the meal plan and the turkey on Thursday, so Thursday is only roasting, reheating, and carving.',
      })],
    ['When something goes wrong',
      p('Something will go slightly wrong. A calm response is a skill, and it is mostly knowing the usual fixes in advance.')
      + h3('The turkey is not done when the guests are ready')
      + p('Do not serve it undercooked. If your thermometer reads below 165 °F (74 °C) in the thickest part of the breast or thigh, it needs more time. You can speed things up by carving the turkey into parts, spreading the pieces on a pan, and putting them back in the oven. Smaller pieces heat faster, and the legs and thighs can cook while the breast stays moist. Serve the sides and appetizers first, and tell guests honestly that dinner is 20 minutes late. Nobody remembers the delay, but they will remember the undercooked turkey.')
      + h3('The turkey is done too early')
      + p('This is a good problem. Tent it with foil and put towels over the foil to keep it warm. A turkey can rest for a good while and be better for it. Keep an eye on the temperature, and if it will be much longer, carve it, cover the slices with gravy or broth, and keep it covered in a warm place at 140 °F (60 °C) or hotter.')
      + h3('The gravy is lumpy')
      + p('Pour it through a fine strainer. If it is still not smooth, a few seconds with an immersion blender will fix it. Thin it with a little warm broth if it is too thick. If it is too thin, simmer it longer, or whisk a little cornstarch into cold water and stir it in while it simmers.')
      + h3('The gravy is too salty')
      + p('Stretch it with unsalted broth or a splash of cream, or make a small second batch without salt and stir the two together. Next year, taste before you season.')
      + h3('The oven is full and a dish is not hot')
      + p('Move it to the stove or the slow cooker, or microwave it in a covered dish. Dishes with meat or poultry need to come to 165 °F (74 °C), so use the thermometer rather than guessing. If nothing works, serve the dish at the end, as a late second course. People will not mind.')
      + h3('You forgot an ingredient')
      + p('Stores are closed on Thanksgiving in many places, so a plan B matters. Ask a neighbor, or ask a guest who is on the way to stop. Most ingredients have a reasonable swap: butter for oil, broth for water, dried herbs for fresh. A common kitchen rule of thumb is about a third as much dried herb as fresh, so start low and taste.')
      + h3('Someone is a vegetarian and nobody told you')
      + p('Keep one dish that stands on its own, such as stuffing made with vegetable broth, a baked sweet potato, or a big roasted vegetable dish. A good rule is to make at least two sides that work for everyone at the table.')],
    ['How Matlyst helps you run Thanksgiving',
      p('Matlyst is a recipe organizer app for iPhone and Android. It does not cook the turkey, but it does take a large amount of paper-and-memory work off your plate. Here is how the pieces fit a holiday dinner, and where the limits are.')
      + h3('Save every recipe in one Thanksgiving folder')
      + p('Share a recipe from a website, an Instagram post, or a TikTok to Matlyst, or paste a link in the import screen, and it becomes a recipe with ingredients and steps. See <a href="/en/import-recipes/">how importing works</a>, and the pages for <a href="/en/import-recipes-from-instagram/">Instagram</a> and <a href="/en/import-recipes-from-tiktok/">TikTok</a>. Put every recipe in a folder called Thanksgiving, so on the day you are not hunting through your phone. Look over each recipe after it is imported, because a quick check is cheaper than a wrong amount of salt. From Instagram and TikTok, Matlyst reads the caption, not the audio, the comments, or the slides, and it takes one recipe per post. If the creator only says the amounts out loud, you add them yourself with Edit recipe. See the <a href="/en/recipe-book-app/">recipe organizer app</a> page for the full picture.')
      + p('Matlyst is free to start, with 5 imports per calendar month. Matlyst Pro adds more imports, photo import, Ask Matlyst, and the ability to create a household.')
      + h3('Scale the servings from 1 to 20')
      + p('Change the number of servings and every amount follows. It is a straight line, which is what you want for gravy, cranberry sauce, and potatoes. For baking, check the baking powder, baking soda, yeast, and spices yourself, because they are not always linear.')
      + h3('One grocery list for the whole menu')
      + p('Add each scaled recipe to the <a href="/en/shopping-list/">grocery list</a>. The same item from several recipes shares one line, amounts in the same unit are added together, and different units are shown together on the line until you tap the amount to tidy it. The list is sorted by store section, and when you add a recipe, anything already in your pantry is left unselected and marked “In your pantry”. Do round one and round two from the same list by checking things off as you go. Checked items move to your pantry by themselves after 15 seconds, with an undo button if you tapped the wrong one.')
      + h3('Plan the days with the meal plan')
      + p('The <a href="/en/meal-plan-app/">meal plan</a> lets you put recipes on each day. Use it for the week before Thanksgiving: cranberry sauce and pie crust on Monday, the pies on Wednesday, the turkey and sides on Thursday. You can then add a day’s recipes, or the whole week’s, to the grocery list in one go. It holds recipes, not chores or timers, so keep the shopping days and the prep list on paper.')
      + h3('Share it with the people you cook with')
      + p('A Pro member can create a household for up to 6 people, and joining is free. The grocery list, the meal plan, and the pantry update live for everyone, so one person can shop while another checks what is still on the list. A household is not required for any of the steps above, it just makes the shopping and the planning easier with a partner, a roommate, or a parent.')
      + h3('Cook mode on the day')
      + p('Cook mode shows a recipe as a checklist you tick off as you go. When a step mentions a time, Matlyst suggests a timer, it keeps running in the background, and the screen stays awake. Cook mode needs an internet connection, so check your Wi-Fi in the kitchen before the day, and keep a printed copy of the one recipe you cannot afford to lose.')
      + p('Without a connection, you can still read your saved recipes for up to 30 days. Changes, and cook mode, need the internet.')
      + h3('What Matlyst does not do')
      + ul('It does not know how long your turkey needs. Use the USDA’s calculators and your own thermometer.',
        'It does not time the whole dinner for you. Cook mode suggests timers from the steps in one recipe.',
        'It does not convert metric recipes to cups. Set Units to US in Settings and new imports keep the US measurements the source used.',
        'Ask Matlyst, which can suggest swaps, is a Pro feature, uses AI, has a monthly allowance, and its answers should always be checked before you cook.')],
    ['A last word before you start',
      p('You do not need to cook like a restaurant to have a good Thanksgiving. You need a short menu, a thermometer, a plan that starts early, and help from the people at your table. The turkey will be fine. The most memorable thing on the table is the people.',
        'When dinner is over, the next problem is the refrigerator full of leftovers. We have a separate page for that: <a href="/en/holidays/thanksgiving-leftovers/">Thanksgiving leftovers</a>. If you are hosting friends the weekend before, see <a href="/en/holidays/friendsgiving/">Friendsgiving</a>. If you are already thinking ahead, the same planning style works for <a href="/en/holidays/christmas-dinner/">Christmas dinner</a>, and for <a href="/en/holidays/hanukkah/">Hanukkah</a> and <a href="/en/holidays/new-years-eve/">New Year’s Eve</a>.',
        'If you want to compare recipe apps before you pick one for the holiday, our guide on <a href="/en/blog/choose-recipe-organizer-app/">how to choose a recipe organizer app</a> is written to be useful whichever app you choose.')],
  ],
});

export const side = {
  title: 'Thanksgiving Plan: Timeline, Portions & Oven Schedule',
  description: 'A Thanksgiving plan for November 26, 2026: a T-minus timeline, portions for 4 to 16 guests, a one-oven schedule, make-ahead dishes, and food safety rules.',
  eyebrow: 'Holiday plan',
  h1: 'The Thanksgiving plan: from three weeks out to the last pie',
  lead: 'A countdown timeline, portions for 4 to 16 guests, a one-oven schedule, and what to cook ahead. Thanksgiving is Thursday, November 26, 2026.',
  forst: 'Decide early, move work out of Thursday, and let a thermometer decide when the turkey is done.',
  stegTittel: 'Three moves that make Thanksgiving easy',
  steg: [
    ['Plan backward from the day', 'Set the menu and the guest list three weeks out, and shop in two rounds, one for pantry items and one for fresh food.'],
    ['Cook ahead and thaw in the refrigerator', 'Make cranberry sauce, pies, and casseroles ahead, and thaw the turkey in the refrigerator using the USDA calculator.'],
    ['Cook to 165 °F', 'Use a food thermometer in the thickest part, and keep hot food at 140 °F or hotter.'],
  ],
  alternativ: '',
  grense: '',
  seksjoner: [],
  faqTittel: 'Thanksgiving planning questions',
  rik: rik.html,
  faq: [
    ['When is Thanksgiving in 2026?', 'Thanksgiving 2026 is on Thursday, November 26. It falls on the fourth Thursday of November.'],
    ['How far ahead should I start planning Thanksgiving?', 'About three weeks out is a good start. That is enough time to settle the menu and guest list, order the turkey, and spread shopping across two rounds.'],
    ['How do I thaw a turkey safely?', 'Thaw it in the refrigerator, on a tray so it cannot drip on other food. FoodSafety.gov names the refrigerator as the safest way, and points to the USDA’s Turkey Thawing Calculator for how long your bird will take.'],
    ['What temperature should a turkey reach?', 'A whole turkey, and any stuffing cooked inside it, should reach 165 °F (74 °C), measured with a food thermometer in the thickest part without touching bone, fat, or gristle.'],
    ['Should I wash the turkey before cooking?', 'No. Washing raw poultry can spread bacteria around the sink and counter. Cooking it to 165 °F (74 °C) is what makes it safe.'],
    ['How much turkey do I need per person?', 'A common home cook rule of thumb is about 1 to 1.5 pounds of bone-in turkey per guest, which leaves some leftovers. It is not an official figure, so adjust for appetites.'],
    ['How do I fit a Thanksgiving dinner into one oven?', 'Cook as many dishes as you can on the stove or in a slow cooker, make casseroles and stuffing ahead, and reheat them in the window after the turkey comes out and is resting under foil.'],
    ['What can I make ahead for Thanksgiving?', 'Cranberry sauce, pie crusts and pies, dough for rolls, stuffing components, a gravy base, and assembled casseroles all do well ahead of time.'],
    ['How long can food sit out at Thanksgiving?', 'Do not leave perishable food out for more than 2 hours, or 1 hour if it is hotter than 90 °F (32 °C). Keep hot food at 140 °F (60 °C) or above.'],
    ['What should guests bring to Thanksgiving?', 'Desserts, cold sides, drinks, and a dish that fits their own diet are the easiest. Ask for something specific, and avoid dishes that need oven time at your house.'],
    ['Can Matlyst scale a recipe for a bigger Thanksgiving?', 'Yes, you can set the servings from 1 to 20 and every amount scales with it. Scaling is linear, so check baking powder, yeast, and spices yourself when you bake.'],
    ['How does Matlyst help with the Thanksgiving grocery list?', 'You add each recipe to one grocery list. The same item shares one line, amounts in the same unit are added together, different units are shown together on that line, and the list is sorted by store section.'],
    ['Can I share my Thanksgiving plan with my family in Matlyst?', 'Yes. A Pro member can create a household for up to 6 people, and joining is free. The grocery list, the meal plan, and the pantry update live for everyone.'],
  ],
  cta: 'Plan your Thanksgiving in Matlyst',
};

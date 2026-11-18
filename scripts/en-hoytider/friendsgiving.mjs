// Høytidsside: Friendsgiving (en-US).
import { byggRik, scenario, scenarioNotat } from './../rik-sider.mjs';

const p = (...ps) => ps.map((t) => `<p>${t}</p>`).join('');
const ul = (...li) => `<ul>${li.map((t) => `<li>${t}</li>`).join('')}</ul>`;
const ol = (...li) => `<ol>${li.map((t) => `<li>${t}</li>`).join('')}</ol>`;

const html = byggRik({
  svarTekst: 'A good Friendsgiving is a potluck with a plan. Pick a date, decide the main dish, split the rest into categories so nothing doubles up, ask about allergies and dietary needs before anyone shops, and keep hot food hot (140 °F / 60 °C or warmer) and cold food cold (40 °F / 4 °C or colder). Save every recipe in one place and share one grocery list, and the day mostly runs itself.',
  seksjoner: [
    ['What Friendsgiving is, and why it needs a plan', p(
      'Friendsgiving is Thanksgiving with friends instead of (or before) family. It is usually held in the week or two before the real holiday, often in a small apartment, and almost always as a potluck: one person hosts, and everyone brings a dish. There are no rules, which is the appeal and also the problem.',
      'Without a plan, you get what every potluck gets by default. Several people bring dessert. Nobody brings a vegetable. The oven is booked solid from the moment the first guest arrives, and the one dish that needed to be cooked at the host’s place is waiting on a pan someone forgot to bring. None of this is anybody’s fault. It happens because nobody was asked to coordinate.',
      'This page is the coordination. It covers how to split the menu, which questions to ask guests, how to scale a recipe for a big table, how to transport and hold food safely, how to set up a serving table in a small space, and what usually goes wrong. It is written from home-cooking experience, with food safety numbers taken from <a href="https://www.foodsafety.gov/keep-food-safe/4-steps-to-food-safety" rel="noopener">FoodSafety.gov</a>. If you are cooking the actual Thanksgiving dinner too, our <a href="/en/holidays/thanksgiving/">Thanksgiving guide</a> covers the full timeline, and the <a href="/en/holidays/thanksgiving-leftovers/">leftovers page</a> covers what to do the day after.'
    )],

    ['Step one: decide who is hosting what', p(
      'Before you send a single invitation, settle three things. It takes one short conversation.',
      '<strong>The date and the space.</strong> Count how many people your table, your sofa, and your floor can seat. Friendsgiving works best when everyone has somewhere to sit with a plate. If you have to choose between a bigger guest list and chairs for everyone, choose the chairs.',
      '<strong>The main dish.</strong> The host usually cooks it, because it is the one dish that needs the host’s oven, timing, and attention. It might be a turkey, a turkey breast, a roast chicken, a ham, or a vegetarian main. Pick one, tell people, and everything else can be built around it. Hosts who try to also bring a side, a dessert, and a drink end up cooking until the doorbell rings.',
      '<strong>The kitchen rules.</strong> Decide early what the oven and stovetop will be used for. If the main takes the oven for hours, tell guests that anything they bring must arrive ready to serve, or must reheat in a microwave or slow cooker. That one sentence in the invitation saves a lot of standing around the oven door.'
    )],

    ['Split the menu into categories, not into a free-for-all', p(
      'The simplest way to avoid duplicates is to assign categories instead of asking “what do you want to bring?” An open question gets you five pies. A category gets you a plan.',
      'A table that works for most groups looks like this.'
    ) + ul(
      '<strong>Starters and snacks:</strong> something people can eat standing up while the host finishes. Cheese and crackers, a dip, roasted nuts, a veggie platter.',
      '<strong>Potatoes or another starch:</strong> mashed, roasted, scalloped, or a rice dish. This is the category guests fight to claim.',
      '<strong>Stuffing or dressing:</strong> it needs a name from someone, because if it is nobody’s job it will not appear.',
      '<strong>Vegetable sides:</strong> green beans, roasted Brussels sprouts, carrots, a salad. Ask for at least two, and for one that is not heavy.',
      '<strong>Something cranberry or something sharp:</strong> a sauce, a relish, pickles. It balances the plate.',
      '<strong>Bread and rolls:</strong> easy, travels well, and nearly everyone is happy to take it.',
      '<strong>Dessert:</strong> one or two. More than that, and you have a leftovers problem.',
      '<strong>Drinks and ice:</strong> non-alcoholic options matter at least as much as anything else. Someone should be in charge of ice, because it runs out.',
      '<strong>Supplies:</strong> paper plates if you want them, napkins, foil, containers for leftovers. It is the least glamorous job and the one the host will thank you for.'
    ) + p(
      'Then let people choose within a category. Someone who loves making sweet potatoes signs up for the starch. Someone who cannot cook at all signs up for ice and napkins. That is a real contribution, and an honest one. Nobody should feel they have to bring something impressive.',
      'A shared document or a group chat message works for the sign-up. Put the categories in a list, ask people to reply with their name next to one, and pin the message. Keep the list in one place so people do not answer in four different threads.'
    )],

    ['Ask about allergies and dietary needs before anyone shops', p(
      'This is a question to ask, not a medical area to give advice on. Guests know their own needs best, and a short message early on prevents a stressful moment at the table.',
      'Send one message to the whole group before the sign-up closes. Something like: “Anything I should know about allergies or foods you avoid? Let me know by Sunday so we can plan around it.” Then, where it matters, ask the person who has an allergy how they would like it handled, rather than guessing.'
    ) + ul(
      '<strong>Ask everyone who is bringing a dish to list the main ingredients</strong> on a small card or in the group chat. People can then check for what they need to avoid without having to ask in front of everyone.',
      '<strong>Label the dishes.</strong> A folded index card with the name of the dish and its key ingredients is enough. Mark vegetarian and vegan dishes too.',
      '<strong>Use separate serving spoons for every dish.</strong> A spoon that travels from one bowl to another carries ingredients with it.',
      '<strong>If someone has a serious allergy, ask them directly</strong> what they are comfortable with. Some people prefer to bring their own dish, and that is their call to make.',
      '<strong>Have at least one dish that works for vegetarians</strong> and does not depend on anything else on the table. A hearty vegetable main or a bean dish does the job.'
    ) + p(
      'You are not responsible for making a medical judgment. You are responsible for asking, labeling, and making room. That is enough, and it is what a thoughtful host does.'
    )],

    ['Save every recipe in one place', p(
      'A potluck brings a lot of recipes. Some are from a grandmother’s index card, some are from a reel someone saw last week, some are from a blog. If each guest keeps theirs in a different place, nobody can find the one thing the host asked about the night before.',
      'In Matlyst, you can <a href="/en/import-recipes/">import a recipe</a> from a website, share it straight from <a href="/en/import-recipes-from-instagram/">Instagram</a> or <a href="/en/import-recipes-from-tiktok/">TikTok</a>, or photograph a printed card (photo import is a Pro feature). Put them all in one folder called something like “Friendsgiving,” and you have the whole menu in one view. Each recipe is a real recipe with ingredients and steps, not a bookmark. Search covers recipes, ingredients, tags, and sources, which helps when you want to know who is already bringing something with cranberries.',
      'From Instagram and TikTok, Matlyst reads the caption. It does not transcribe audio, read comments, or read the slides of a carousel, and it takes one recipe per post, so if a creator only says the amounts out loud, type them in after importing. Matlyst uses AI to read and translate recipes, which means it can make mistakes, so look over each recipe after it is imported. The free plan includes 5 imports per calendar month, which is plenty for a host who is saving the main dish and a few sides.',
      'If you want a longer look at keeping a collection organized, the guide on <a href="/en/blog/choose-recipe-organizer-app/">how to choose a recipe organizer app</a> lists what matters. If you want a place to keep the whole collection, the <a href="/en/recipe-book-app/">recipe book app</a> page explains how folders and search work.'
    )],

    ['One shared grocery list for the household', p(
      'If you live with other people, Friendsgiving shopping is where duplicate purchases happen. Two roommates both buy butter. Nobody buys foil. The host realizes late in the evening that there are no onions.',
      'Matlyst’s <a href="/en/shopping-list/">grocery list</a> merges ingredients from several recipes into one list. The same item shares one line. When two recipes use the same unit, the amounts are added together. When they use different units, both amounts are shown on that line, for example “1 cup · 200 g”, and Matlyst does not guess a conversion for you. Tap the amount to tidy it into one. The list is sorted by store section, so you walk the store once instead of crossing it three times.',
      'Matlyst Pro lets one person create a household of up to 6 people. Joining a household is free. Once you are in, the grocery list, the meal plan, and the pantry are shared and update live. One roommate adds the cranberries while another is standing in the produce aisle, and the second person sees it appear. When someone checks an item off, everyone sees it checked.',
      'When you add a recipe to the list, items already in your pantry, such as flour, oil, salt, and spices, are left unselected and marked “In your pantry”, so they do not land on the list unless you choose them. You still confirm what you really have by looking in the cupboard. Items you check off at the store move to the pantry by themselves after 15 seconds, with an undo button. The pantry on the free plan shows 5 items, and the <a href="/en/pantry-app/">pantry page</a> explains how it works in full.'
    )],

    ['Scaling a recipe to feed 12', p(
      'Most home recipes are written for a small family table. A potluck dish for a group of 12 is a different job, and the answer is not always “double it.”',
      'Matlyst scales a recipe from 1 to 20 servings. The scaling is linear, which means every ingredient is multiplied by the same factor. That works well for most savory dishes, such as roasted vegetables, mashed potatoes, a bean stew, or a big salad. It needs your attention in a few places.'
    ) + ul(
      '<strong>Leavening.</strong> Baking powder, baking soda, and yeast do not always scale in a straight line. A recipe for a large cake or batch of rolls may need a different approach, and an unusually big batch can behave differently from a small one. Check the quantity against the original and consider making two batches in two pans instead of one huge one.',
      '<strong>Salt and strong spices.</strong> Start with less than the scaled number and taste as you go. Cayenne, cloves, and chili are easy to overdo when multiplied.',
      '<strong>Pan size and cook time.</strong> A bigger volume needs a bigger pan or several pans, and the time changes. Use the time in the recipe as a starting point and check for doneness with a thermometer, not the clock.',
      '<strong>Liquids and thickeners.</strong> Gravies and sauces can behave differently in larger pots. Add the thickener slowly and let it cook before you add more.',
      '<strong>Your own equipment.</strong> If a recipe now requires a pot you do not own, split it into two pots, or choose a different dish.'
    ) + p(
      'The honest approach: scale in the app, then read the result like a cook. If a number looks odd, trust your judgment and adjust. Scaling is a starting point and not a guarantee.',
      'A useful rule of thumb from home cooking, not a rule from any authority: a potluck needs variety more than volume. Each guest takes a little of everything. A table with many dishes at modest size works better than a few huge ones. If you are bringing a side to a group of 12, plan for a decent serving of it, but do not feel you have to feed the whole table with one dish.'
    )],

    ['Cooking from the recipe on the day', p(
      'If you are cooking at home before you leave, or cooking at the host’s place, cook mode helps. It shows the steps as a checklist you tick off, with the ingredients a tap away, and the screen stays awake. When a step gives a time, Matlyst suggests a timer you start with a tap. Cook mode needs an internet connection, so if the host’s Wi-Fi is unreliable, read your recipe over before you go and screenshot what you need.',
      'If a question comes up in the middle of cooking, such as “can I use sour cream instead of yogurt,” Ask Matlyst can answer it about the recipe you have open. Ask Matlyst is a Pro feature, it uses AI, and it has a monthly quota. Treat its answer as a good suggestion, not a certainty, and use your own judgment.'
    )],

    ['Transporting food: hot stays hot, cold stays cold', p(
      'This is the part most people skip, and it is the part that matters most. Food safety guidance from <a href="https://www.foodsafety.gov/keep-food-safe/4-steps-to-food-safety" rel="noopener">FoodSafety.gov</a> describes a “danger zone” between 40 °F (4 °C) and 140 °F (60 °C), where bacteria can multiply quickly. Your goal when moving food is to spend as little time as possible in that range.',
      '<strong>For hot dishes:</strong> keep them at 140 °F (60 °C) or warmer. Wrap the dish in foil and then in towels, and put it in an insulated carrier or a box that fits it snugly. At the host’s place, move it to a slow cooker on the warm setting, a chafing dish, or a warming drawer if there is one. Skip the oven that is busy with the main. Check the temperature with a food thermometer if you are unsure.',
      '<strong>For cold dishes:</strong> keep them at 40 °F (4 °C) or colder. Use a cooler with ice or frozen gel packs, and keep the dish in the cooler until you are ready to put it out. On the serving table, set the bowl inside a larger bowl of ice if the dish will sit for a while.',
      '<strong>The 2-hour rule.</strong> Do not leave perishable food out for more than 2 hours. In hot weather, above 90 °F (32 °C), the limit is 1 hour. This covers the time on the serving table plus any time the dish spent at room temperature before it arrived. If your drive is long, factor that in.',
      '<strong>Bring a thermometer.</strong> If you only buy one thing for a potluck, buy a food thermometer. It tells you whether the dish is still at 140 °F (60 °C) or warmer when you arrive, and it takes the guessing out of reheating.',
      '<strong>Reheat to 165 °F (74 °C).</strong> If a casserole or leftover dish arrives lukewarm, reheat it to 165 °F (74 °C) before serving. Do not just warm it a bit.'
    )],

    ['Setting up the serving table in a small space', p(
      'A small apartment does not need a big table. It needs a flow. These are the things that make the difference.'
    ) + ul(
      '<strong>Serve in the order people eat.</strong> Plates at one end, then the main, starches, vegetables, sauces, bread, and finally utensils and napkins at the very end so no one has to hold them while serving. A one-way line avoids the pile-up in the middle.',
      '<strong>Use the whole room.</strong> Put drinks on a counter or a side table away from the food, so the line and the thirsty people are not in the same spot. Put dessert on a separate surface, and bring it out later.',
      '<strong>Keep hot dishes on trivets and heat sources.</strong> Slow cookers can sit on a countertop with the lid on until serving. A tray with a towel under a casserole dish protects the table.',
      '<strong>Give every dish its own serving utensil.</strong> This matters for allergies and for keeping the line moving.',
      '<strong>Label everything.</strong> Name cards on the dish, with a note for vegetarian, vegan, or common allergens. Guests can read them without asking.',
      '<strong>Offer to sit people.</strong> If there are fewer chairs than guests, tell people there is a first seating and a second, or use cushions on the floor. A plate on your lap is fine as long as there is a surface for the drink.'
    )],

    ['Borrowed pots, pans, and gear', p(
      'The hidden cost of a potluck is equipment. A host who owns one large roasting pan and two casserole dishes will be asked to hold twelve people’s worth of cooking. The solution is to ask, early and kindly, for what you need.'
    ) + ul(
      'Ask each guest to bring their dish in a container they can take home, or label what they lend you. Masking tape and a marker are the host’s best tools.',
      'Ask one guest to bring a slow cooker or an electric warming tray if you do not have one. Slow cookers are the potluck workhorse because they keep food at holding temperature without using the oven.',
      'Ask for serving spoons. You will always need more than you think.',
      'Ask for a cooler, ice packs, or a bag of ice if the group includes anything that needs to stay cold.',
      'Keep a list of who lent what. At the end of the night, put every borrowed item by the door in one pile, and say a quick thank you as people leave.'
    ) + p('Treat borrowed items the way you would treat borrowed books. Wash them before returning, and do not let the pan someone was fond of disappear in the dishwasher chaos.')],

    ['What usually goes wrong, and how to fix it', p('These are the problems that happen at almost every Friendsgiving. Knowing them in advance makes them cheaper.') + ul(
      '<strong>Too many desserts, no vegetables.</strong> Fix it with categories and a sign-up message. If it has already happened, put out a simple salad or roast a pan of vegetables yourself, which takes little effort.',
      '<strong>The oven is overbooked.</strong> Ask guests to bring dishes that are ready to serve, and use slow cookers, a microwave, or a stovetop burner for reheating. Stagger the timing, and put the dishes that need a final bake in a clear order.',
      '<strong>The dish arrives cold.</strong> Reheat it to 165 °F (74 °C) before serving, using a thermometer. Do not leave it on the counter to “warm up.”',
      '<strong>Food has been sitting out for hours.</strong> Perishable food should not stay out for more than 2 hours. Put out smaller amounts and refill from the kitchen. Keep the rest hot at 140 °F (60 °C) or warmer, or cold in the fridge, until needed.',
      '<strong>A guest cannot eat anything on the table.</strong> Ask early next time. For this one, find something you can quickly put together, and apologize without making it a scene.',
      '<strong>Too much food.</strong> It is a good problem. Set out containers and foil before dinner, and send people home with leftovers, with the safety notes below.',
      '<strong>Too little of the main dish.</strong> Have a backup, such as extra bread, a pot of soup, or pasta. Stretch the meal with sides.',
      '<strong>Nobody can find the serving spoon.</strong> Put out every utensil before the first guest arrives and label the dishes as they land.',
      '<strong>Someone forgot to bring their dish.</strong> Stay kind. Ask whether they can pick up something on the way, or give them a role: pouring drinks, handling the music, or washing up.'
    )],

    ['Leftovers and who takes what home', p(
      'This is the last step, and the one hosts most often get wrong at the end of the night because everyone is tired. Do it before dessert is finished if you can.',
      'The safety side first. Get leftovers into the refrigerator within 2 hours. Move leftovers into shallow containers so they cool quickly, rather than leaving them in a deep pot. Your refrigerator should be at 40 °F (4 °C) or colder, and your freezer at 0 °F (-18 °C) or colder. Leftover cooked meat and poultry are good in the refrigerator for 3 to 4 days. When you reheat any leftovers or casseroles, bring them to 165 °F (74 °C). Never thaw food on the counter.',
      'The social side. Each guest takes home what they brought, unless they say otherwise. The host sets out containers and foil, and anyone who wants to take a plate home can make one. Ask who has room in the refrigerator for what, and who is hungry the next day. Leftover turkey sandwiches are a tradition, and people tend to be generous when you offer.',
      'For ideas on what to cook with what is left, the <a href="/en/holidays/thanksgiving-leftovers/">Thanksgiving leftovers</a> page has a plan, and the <a href="/en/empty-the-fridge/">empty the fridge</a> page and <a href="/en/recipes-by-ingredients/">recipes by ingredients</a> page help you search your saved recipes for whatever is in the container.'
    )],

    ['Three scenarios from the potluck table', scenarioNotat() + scenario('Say you are hosting 12 in a one-bedroom', {
      situasjon: 'Say you are hosting Friendsgiving for 12 in a small apartment. You are cooking the turkey. Everyone else says they will “bring something.”',
      galt: 'Without a plan, the oven is full by mid-afternoon, three people bring a pie, and nobody brings a vegetable.',
      gjor: 'You send a message with categories and ask people to claim one. You ask for slow cookers from two friends. You ask about allergies and dietary needs in the same message. You set up the serving table in a one-way line on the kitchen counter.',
      matlyst: 'You save every recipe to a “Friendsgiving” folder, and your roommate, a member of your household, adds items to the shared grocery list as the plan comes together.'
    }) + scenario('Say you are bringing a side to someone else’s party', {
      situasjon: 'Say you signed up for mashed potatoes, and your recipe is written for a small family.',
      galt: 'You double it, but the pot is too small. You start boiling the potatoes at the last minute and arrive late and lukewarm.',
      gjor: 'You scale the recipe in the app to 12 servings, split it across two pots, and cook it ahead. You pack it hot in a towel-wrapped dish, and bring a thermometer to check it is at 140 °F (60 °C) or above when you arrive.',
      matlyst: 'The scaled recipe shows each ingredient multiplied; you taste for salt as you go, because strong seasonings do not always scale in a straight line.'
    }) + scenario('Say a guest has a food allergy', {
      situasjon: 'Say one of your guests tells you they have a food allergy, and you have not yet finalized the menu.',
      galt: 'If you guess, you might serve a dish that is not safe for them, or exclude them from the meal without asking.',
      gjor: 'You ask them directly what they are comfortable with. You label every dish, use separate spoons, and ask each cook to list main ingredients. If they prefer to bring their own dish, you make space for it.',
      matlyst: 'Because each recipe is saved as a real recipe with an ingredient list, you can search your recipes by ingredient and check what is in each dish.'
    })],

    ['A plan you can follow, from invitation to dishes', p('Here is the whole thing as a short timeline. Adjust it to your own calendar.') + ol(
      '<strong>Two to three weeks before:</strong> pick a date, count seats, decide the main dish, and send the invitation with the categories.',
      '<strong>Two weeks before:</strong> ask about allergies and dietary needs. Collect the sign-ups. Save your own recipes to a folder.',
      '<strong>One week before:</strong> confirm who is bringing what. Fill in gaps. If you are cooking a frozen turkey, check the USDA’s Turkey Thawing Calculator now, because the thaw can take days. Make a shared grocery list for your household and send out the equipment requests (slow cookers, serving spoons, ice).',
      '<strong>Two or three days before:</strong> shop, clear space in the refrigerator, and make anything that holds well, such as cranberry sauce.',
      '<strong>The day before:</strong> set up the serving table, label the plates and utensils, and prep vegetables. If you are cooking a turkey, it should already be thawing in the refrigerator.',
      '<strong>The day:</strong> cook the main, keep hot food at 140 °F (60 °C) or warmer, keep cold food at 40 °F (4 °C) or colder, and put food out in small batches.',
      '<strong>After dinner:</strong> put leftovers in shallow containers within 2 hours, hand out the containers, return borrowed gear, and run the dishwasher.'
    ) + p('The point of a plan is not control. It is that on the day you are able to enjoy your friends, because the part that usually goes wrong has already been handled.')],

    ['What Matlyst doesn’t do', p('A tool should say where it stops. Here is what to expect.') + ul(
      'From Instagram and TikTok, Matlyst reads the caption only. It does not transcribe audio, read comments, or read carousel slides, and it takes one recipe per post.',
      'It does not manage a guest list or send invitations. Use a group chat or a shared note for the sign-up.',
      'It does not know about your guests’ allergies. You ask them, and you check each recipe’s ingredient list.',
      'Scaling is linear. It does not adjust baking powder, yeast, or seasoning for you, so use your own judgment.',
      'AI can make mistakes when it reads and translates recipes. Look over each recipe after it is imported.',
      'Cook mode needs an internet connection.'
    ) + p('Matlyst is free to start, with 5 imports per calendar month. Matlyst Pro adds photo import, Ask Matlyst, and creating a household. If you are also planning your week around Friendsgiving, the <a href="/en/meal-plan-app/">meal plan</a> page shows how it works, and the <a href="/en/holidays/christmas-dinner/">Christmas dinner</a> page picks up where this one leaves off.')],
  ],
}).html;

export const side = {
  title: 'Friendsgiving: Plan a Potluck That Works',
  description: 'Plan Friendsgiving without the chaos: split the menu, ask about allergies, scale recipes for 12, keep food at safe temperatures, and handle leftovers.',
  eyebrow: 'Holidays',
  h1: 'Friendsgiving: how to plan a potluck that works',
  lead: 'Split the menu, ask the right questions, scale a recipe for a crowd, keep hot food hot and cold food cold, and send everyone home happy. A practical guide, written from home-cooking experience.',
  forst: 'A potluck works when each person has one clear job.',
  stegTittel: 'The short version',
  steg: [
    ['Assign categories', 'Give people a category (starch, vegetable, dessert, drinks, supplies) instead of asking what they want to bring. Ask about allergies and dietary needs in the same message.'],
    ['Save recipes and share one list', 'Put every recipe in one folder, scale to the crowd, and use one grocery list for the household so nothing gets bought twice.'],
    ['Keep food safe', 'Hot food at 140 °F (60 °C) or warmer, cold food at 40 °F (4 °C) or colder, and nothing perishable out for more than 2 hours.'],
  ],
  alternativ: '',
  grense: '',
  seksjoner: [],
  faqTittel: 'Friendsgiving questions',
  rik: html,
  faq: [
    ['What is Friendsgiving?', 'Friendsgiving is a Thanksgiving-style meal shared with friends instead of family, often held in the week or two before Thanksgiving. It is usually a potluck, where one person hosts and everyone brings a dish.'],
    ['How do you organize a Friendsgiving potluck?', 'Pick a date, decide the main dish, and assign categories such as starch, vegetables, bread, dessert, drinks, and supplies. Let guests choose within a category, and keep the sign-up in one place so dishes do not double up.'],
    ['What should the host make at Friendsgiving?', 'Usually the main dish, because it needs the host’s oven and attention. Guests bring the sides, dessert, drinks, and supplies. A host who also brings sides and dessert tends to be cooking when the guests arrive.'],
    ['How do I ask guests about allergies without making it awkward?', 'Send one message to the whole group before the sign-up closes and ask if there is anything you should know about allergies or foods people avoid. Ask anyone with a serious allergy directly how they would like it handled, and label every dish with its main ingredients.'],
    ['How do I keep potluck food safe?', 'Keep hot food at 140 °F (60 °C) or warmer and cold food at 40 °F (4 °C) or colder. Do not leave perishable food out for more than 2 hours, or 1 hour if it is above 90 °F (32 °C). Reheat leftovers and casseroles to 165 °F (74 °C).'],
    ['How do I keep a dish hot while I transport it?', 'Wrap the covered dish in foil and towels and carry it in an insulated bag or a snug box. At the party, move it to a slow cooker on warm, a chafing dish, or a warming drawer so it stays at 140 °F (60 °C) or warmer.'],
    ['How do I scale a recipe to feed 12?', 'Matlyst scales a recipe from 1 to 20 servings in a straight line. Check baking powder, baking soda, yeast, salt, and strong spices by hand, and use more than one pan or pot if the volume is too big for one.'],
    ['Can I share a grocery list with my roommates?', 'Yes. With Matlyst Pro, one person creates a household for up to 6 people, and joining is free. The grocery list, meal plan, and pantry are shared and update live for everyone in it.'],
    ['What do I do about leftovers?', 'Refrigerate them within 2 hours in shallow containers. Keep the refrigerator at 40 °F (4 °C) or colder, use cooked meat and poultry within 3 to 4 days, and reheat leftovers to 165 °F (74 °C). Let each guest take home what they brought, and set out containers for anyone who wants a plate.'],
    ['What if someone forgets to bring their dish?', 'Stay relaxed. Ask if they can pick something up on the way, or give them a job such as drinks, music, or cleanup. It is better to keep the evening friendly than to make it awkward.'],
    ['How do I save the recipes everyone is bringing?', 'Import each recipe into a Matlyst folder from a website, from Instagram or TikTok, or with a photo if you have Pro. You get one folder with every recipe, and search finds recipes by ingredient. Look over each recipe after import, because AI can make mistakes.'],
    ['Is Matlyst free to use for Friendsgiving?', 'Matlyst is free to start, with 5 imports per calendar month. Saving recipes, folders, search, the meal plan, and the grocery list work on the free plan. Creating a household, photo import, and Ask Matlyst are part of Matlyst Pro.'],
  ],
  cta: 'Plan your Friendsgiving in Matlyst',
};

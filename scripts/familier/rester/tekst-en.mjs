// Text for the family «rester» (en-US): what to make with what you have. Each page lists types of dishes, no recipes: the dish, why it works,
// and what else you need, in rough terms. The dishes are our suggestions and have no source. Storage appears only with numbers from US sources
// (FoodSafety.gov and USDA FSIS), the same numbers as the pages on how long food lasts and whether you can freeze it.
// Numbers are never typed here: h.t(field) reads them from data.en.json. Where no US source gives a number, the page says so and gives none.
import { kortListe, p, ul } from './bygg-flersprak.mjs';

const og = (xs) => (xs.length > 2 ? `${xs.slice(0, -1).join(', ')}, and ${xs.at(-1)}` : xs.join(' and '));
const retter = (list) => kortListe(list.map(([name, why, need]) => [name, ['Why it works', why], ['You also need', need]]));
export const STORE = 'How to store the rest';
const store = (...parts) => [STORE, parts.join('')];
const PANTRY = 'In the <a href="/en/pantry-app/">pantry</a> in Matlyst, you add what you have and see how many days are left on each item. ';
const SEARCH = 'Search the recipes you’ve saved for the ingredient and see which ones use it. It’s plain search, so it works without AI. ';
const COOK = '“Cook with what I have” in Ask Matlyst builds dinner ideas from the items in your pantry, with cooking times. It’s a Pro feature, uses AI, and has a monthly quota, so read the result before you start cooking.';
const app = (...parts) => [
  ['From the pantry to dinner', p(parts.filter((x) => x !== SEARCH).join(''))],
  ['Search your own recipes', p(`${SEARCH}Don’t have anything saved that fits? Import a recipe from a link and search it afterward.`)],
];
const NO_NUMBER = (what) => `We didn’t find a US source with a number for how long ${what} keep, so this page gives none.`;

export const TEKST = {
  kjottdeig: (h) => ({
    gruppe: 'Meat and fish', kort: 'Meat sauce, burgers, tacos, chili, meatloaf, and stuffed peppers.',
    tittel: 'What to make with ground beef',
    h1: 'What to make with ground beef',
    beskrivelse: 'Six kinds of dinner that fit a pound of ground beef, why they work, and what else you need. Plus how long FoodSafety.gov says ground beef keeps.',
    ingress: 'Ground beef is one of the easiest things to build a dinner around. You can brown it, shape it, or let it simmer.',
    svar: `Ground beef fits meat sauce, burgers, tacos, chili, meatloaf, and stuffed peppers. ${h.k('fs-chart')} says raw ground beef keeps ${h.t('deig')} in the refrigerator and ${h.t('frys')} in the freezer.`,
    steg: [['Pick a kind of dish', 'Sauce, burgers, tacos, chili, meatloaf, or peppers.'], ['Check what else you have', 'Tomatoes, onions, beans, pasta, or tortillas.'], ['Mind the clock', `Don’t leave it out more than ${h.t('timer2')}.`]],
    seksjoner: [
      ['Six dishes that fit', retter([
        ['Spaghetti with meat sauce', 'You brown the beef and let it simmer in tomatoes. A little meat goes a long way, and the sauce is easy to make in a big batch.', 'Canned tomatoes, onion, garlic, and spaghetti.'],
        ['Burgers', 'Shape patties and cook them in a pan or on a grill. Easy to portion for a crowd.', 'Buns, cheese, and whatever you like on top.'],
        ['Tacos', 'Season the beef and put the toppings on the table so everyone builds their own.', 'Taco seasoning, tortillas or shells, lettuce, tomatoes, and cheese.'],
        ['Chili', 'The beef adds body to a pot of beans and tomatoes. It’s a one-pot dinner that tastes better the next day.', 'Beans, canned tomatoes, onion, and chili powder.'],
        ['Meatloaf', 'Mixed with egg and breadcrumbs, the beef bakes into a loaf you can slice.', 'Eggs, breadcrumbs, onion, and a glaze such as ketchup.'],
        ['Stuffed peppers', 'The beef becomes the filling, with rice or beans to stretch it.', 'Bell peppers, rice, tomato sauce, and cheese.'],
      ])],
      store(
        p(`${h.k('fs-chart')} says to keep the refrigerator at ${h.t('kjol')} or below and gives ${h.t('deig')} for raw ground beef in the refrigerator and ${h.t('frys')} in the freezer.`),
        p(`${h.k('fsis-danger')} says never to leave food out of refrigeration over ${h.t('timer2')}.`),
      ),
      ...app(PANTRY, SEARCH, COOK),
    ],
    faq: [
      ['How long does raw ground beef keep in the fridge?', `${h.k('fs-chart')} says ${h.t('deig')}.`],
      ['Can I freeze ground beef?', `Yes. ${h.k('fs-chart')} gives ${h.t('frys')} in the freezer for ground beef.`],
      ['How long can ground beef sit out?', `${h.k('fsis-danger')} says never over ${h.t('timer2')}.`],
    ],
  }),

  kylling: (h) => ({
    gruppe: 'Meat and fish', kort: 'Sheet-pan chicken, stir-fry, soup, fajitas, chicken salad, and pasta bake.',
    tittel: 'What to make with chicken',
    h1: 'What to make with chicken',
    beskrivelse: 'Six kinds of dinner that fit raw or cooked chicken, plus what FoodSafety.gov and USDA say about how long it keeps and how hot it needs to get.',
    ingress: 'Chicken goes from stir-fry to soup. What you pick depends on whether it’s raw or already cooked.',
    svar: `Raw chicken fits sheet-pan dinners, stir-fry, soup, and fajitas. Cooked chicken fits salad and pasta bakes. ${h.k('fs-chart')} says raw whole chicken keeps ${h.t('raa')} in the refrigerator, and ${h.k('fsis-leftovers')} says cooked leftovers keep ${h.t('lft')}.`,
    steg: [['Raw or cooked?', 'Raw for the pan and the oven, cooked for salad.'], ['Check what else you have', 'Vegetables, rice, pasta, or tortillas.'], ['Cook it through', `${h.k('fsis-leftovers')}: cook poultry to ${h.t('fjaerfe')}.`]],
    seksjoner: [
      ['Six dishes that fit', retter([
        ['Sheet-pan chicken and vegetables', 'Everything goes on one pan and into the oven. You don’t have to stand at the stove.', 'Potatoes or other vegetables, oil, and seasoning.'],
        ['Stir-fry', 'Slice the chicken thin and cook it fast. It’s a good fit when you’re short on time and have vegetables to use up.', 'Vegetables, rice or noodles, and a sauce such as soy.'],
        ['Chicken soup', 'The chicken flavors the broth, and cooked chicken can be shredded in at the end.', 'Broth, carrots, celery, and noodles or rice.'],
        ['Fajitas', 'Strips of chicken cook quickly with peppers and onions, and everyone builds their own.', 'Peppers, onions, tortillas, and toppings.'],
        ['Chicken salad', 'Cooked chicken is already done. Shred or chop it and mix it with something creamy.', 'Mayonnaise or yogurt, celery, and bread or lettuce.'],
        ['Pasta bake', 'Cooked chicken goes into a creamy or tomato sauce with pasta and cheese.', 'Pasta, sauce, cheese, and something green.'],
      ])],
      store(
        p(`${h.k('fs-chart')} gives ${h.t('raa')} in the refrigerator for raw whole chicken. For cooked chicken, ${h.k('fsis-leftovers')} says leftovers keep ${h.t('lft')} in the refrigerator.`),
        p(`${h.k('fsis-leftovers')} says to cook all poultry to an internal temperature of ${h.t('fjaerfe')}, measured with a food thermometer, and to reheat leftovers to ${h.t('oppvarm')}.`),
      ),
      ...app(PANTRY, 'You can see how many days the chicken has left before you pick a dish. ', COOK),
    ],
    faq: [
      ['Can I use chicken I cooked yesterday?', `Yes. ${h.k('fsis-leftovers')} says leftovers keep ${h.t('lft')} in the refrigerator.`],
      ['How long does raw chicken keep?', `${h.k('fs-chart')} gives ${h.t('raa')} in the refrigerator for whole chicken.`],
      ['How hot should chicken get?', `${h.k('fsis-leftovers')} says ${h.t('fjaerfe')}, measured with a food thermometer.`],
    ],
  }),

  'rotisserie-chicken': (h) => ({
    gruppe: 'Meat and fish', kort: 'Chicken salad, quesadillas, soup, pot pie, sandwiches, and fried rice.',
    tittel: 'What to make with rotisserie chicken',
    h1: 'What to make with rotisserie chicken',
    beskrivelse: 'Six dinners that use a rotisserie chicken, and what USDA says about how long cooked chicken keeps, how to reheat it, and how long it can sit out.',
    ingress: 'A rotisserie chicken is a head start on dinner. Here’s what to do with it the next night, and the night after.',
    svar: `A rotisserie chicken fits chicken salad, quesadillas, soup, pot pie, sandwiches, and fried rice. ${h.k('fsis-leftovers')} says cooked chicken leftovers keep ${h.t('lft')} in the refrigerator or ${h.t('lftfryst')} in the freezer.`,
    steg: [['Pull the meat off', 'Do it while the chicken is still warm, then chill it.'], ['Pick a dish', 'Salad, quesadillas, soup, pot pie, or sandwiches.'], ['Reheat it hot', `${h.k('fsis-leftovers')}: ${h.t('oppvarm')}.`]],
    seksjoner: [
      ['Six dishes that fit', retter([
        ['Chicken salad', 'Shredded chicken, something creamy, and crunch. It works on bread, in a wrap, or on greens.', 'Mayonnaise or yogurt, celery, and bread or lettuce.'],
        ['Quesadillas', 'Shredded chicken and cheese in a tortilla, crisped in a pan. Dinner in ten minutes.', 'Tortillas, cheese, and salsa.'],
        ['Chicken noodle soup', 'Stir the shredded chicken into broth with vegetables and noodles at the end.', 'Broth, carrots, celery, and noodles.'],
        ['Chicken pot pie', 'The chicken goes into a creamy filling under a crust.', 'Pie crust or biscuits, frozen vegetables, and a white sauce.'],
        ['BBQ chicken sandwiches', 'Toss the shredded chicken in barbecue sauce and pile it onto buns.', 'Barbecue sauce, buns, and coleslaw.'],
        ['Fried rice', 'Cold rice and cooked chicken are the base. Everything else is whatever is in the fridge.', 'Rice, eggs, frozen vegetables, and soy sauce.'],
      ])],
      store(
        p(`${h.k('fsis-leftovers')} says leftovers can be kept in the refrigerator for ${h.t('lft')} or frozen for ${h.t('lftfryst')}.`),
        p(`${h.k('fsis-leftovers')} also says to reheat leftovers to ${h.t('oppvarm')}, measured with a food thermometer. And ${h.k('fsis-danger')} says never to leave food out of refrigeration over ${h.t('timer2')}.`),
      ),
      ...app(PANTRY, 'Add the chicken with the day you bought it, and you can see how many days are left. ', COOK),
    ],
    faq: [
      ['How long does rotisserie chicken last in the fridge?', `${h.k('fsis-leftovers')} says cooked leftovers keep ${h.t('lft')}.`],
      ['Can I freeze it?', `Yes. ${h.k('fsis-leftovers')} says ${h.t('lftfryst')}.`],
      ['How hot should I reheat it?', `${h.k('fsis-leftovers')} says ${h.t('oppvarm')}, measured with a food thermometer.`],
    ],
  }),

  egg: (h) => ({
    gruppe: 'Eggs and dairy', kort: 'Frittata, scrambled eggs, French toast, egg salad, and egg drop soup.',
    tittel: 'What to make with eggs',
    h1: 'What to make with eggs',
    beskrivelse: 'Dishes that fit eggs, hard-boiled eggs, and extra whites or yolks, plus how long FoodSafety.gov and USDA say each one keeps.',
    ingress: 'Eggs are more than breakfast. Here’s what to make, and what to do with extra whites and yolks.',
    svar: `Eggs fit frittata, scrambled eggs, French toast, egg salad, and egg drop soup. ${h.k('fs-chart')} says raw eggs in the shell keep ${h.t('skall')} in the refrigerator, raw whites and yolks ${h.t('hviter')}, and hard-cooked eggs ${h.t('hardkokt')}.`,
    steg: [['What do you have?', 'Whole eggs, hard-boiled eggs, or extra whites and yolks.'], ['Pick a dish', 'Frittata, scrambled, French toast, or salad.'], ['Watch the clock', `Refrigerated eggs shouldn’t be left out more than ${h.t('ute')}.`]],
    seksjoner: [
      ['Five dishes that fit', retter([
        ['Frittata', 'Eggs bake together with vegetables, cheese, and leftover meat. It’s good hot or cold, and it uses up odds and ends.', 'Vegetables or cooked meat, cheese, and milk.'],
        ['Scrambled eggs', 'The fastest option. Add whatever is in the fridge.', 'Butter or oil, and toast.'],
        ['French toast', 'Eggs and milk soak into bread and get pan-fried. A good home for stale bread.', 'Bread, milk, butter, and syrup.'],
        ['Egg salad', 'Hard-boiled eggs are already done. Chop them and mix with something creamy.', 'Mayonnaise or yogurt, mustard, and bread.'],
        ['Egg drop soup', 'Beaten eggs swirl into hot broth for a fast, light dinner.', 'Broth, scallions, and soy sauce.'],
      ])],
      store(
        p(`${h.k('fs-chart')} says raw eggs in the shell keep ${h.t('skall')} in the refrigerator, and raw egg whites and yolks keep ${h.t('hviter')}. Hard-cooked eggs keep ${h.t('hardkokt')}.`),
        p(`${h.k('fsis-eggs')} says refrigerated eggs should not be left out more than ${h.t('ute')}.`),
      ),
      ...app(PANTRY, SEARCH, 'Out of eggs for a recipe? Read <a href="/en/substitutes/">what you can use instead</a>. '),
    ],
    faq: [
      ['How long do hard-boiled eggs last?', `${h.k('fs-chart')} says ${h.t('hardkokt')} in the refrigerator.`],
      ['How long do extra egg whites keep?', `${h.k('fs-chart')} gives ${h.t('hviter')} for raw whites and yolks.`],
      ['How long can eggs sit out?', `${h.k('fsis-eggs')} says no more than ${h.t('ute')}.`],
    ],
  }),

  'kokte-poteter': (h) => ({
    gruppe: 'Produce and sides', kort: 'Breakfast hash, potato pancakes, soup, shepherd’s pie, and potato salad.',
    tittel: 'What to make with leftover potatoes',
    h1: 'What to make with leftover potatoes',
    beskrivelse: 'Five dinners that use cooked potatoes, mashed or baked, and what USDA says about how long leftovers keep and how to reheat them.',
    ingress: 'Cooked too many? Cold mashed or baked potatoes are some of the easiest leftovers to turn into something new.',
    svar: `Leftover potatoes fit breakfast hash, potato pancakes, soup, shepherd’s pie, and potato salad. ${h.k('fsis-leftovers')} says leftovers keep ${h.t('lft')} in the refrigerator.`,
    steg: [['Chill them fast', 'Don’t leave them out.'], ['Pick a dish', 'Hash, pancakes, soup, or pie.'], ['Reheat hot', `${h.k('fsis-leftovers')}: ${h.t('oppvarm')}.`]],
    seksjoner: [
      ['Five dishes that fit', retter([
        ['Breakfast hash', 'Diced cooked potatoes crisp up in a hot pan with onions and whatever meat you have. Top with an egg.', 'Onion, oil, eggs, and leftover meat or sausage.'],
        ['Potato pancakes', 'Mashed potatoes mixed with egg and flour fry up into crisp patties.', 'Egg, flour, onion, and oil for the pan.'],
        ['Potato soup', 'Cooked potatoes thicken a soup without much cream.', 'Broth, onion or leeks, cheese, and bacon if you like.'],
        ['Shepherd’s pie', 'Leftover mashed potatoes make the topping over a meat and vegetable filling.', 'Ground meat, vegetables, gravy, and butter.'],
        ['Potato salad', 'Cubes of cooked potato mix with a dressing while they are cold.', 'Mayonnaise or a vinaigrette, mustard, onion, and celery.'],
      ])],
      store(
        p(`${h.k('fsis-leftovers')} says leftovers can be kept in the refrigerator for ${h.t('lft')}. It also says to reheat them to ${h.t('oppvarm')}, measured with a food thermometer.`),
        p(`${h.k('fsis-danger')} says never to leave food out of refrigeration over ${h.t('timer2')}.`),
      ),
      ...app(PANTRY, 'Add the potatoes with the day you cooked them, and you can see how many days are left. ', COOK),
    ],
    faq: [
      ['How long do cooked potatoes keep in the fridge?', `${h.k('fsis-leftovers')} says leftovers keep ${h.t('lft')}.`],
      ['How long can cooked potatoes sit out?', `${h.k('fsis-danger')} says never over ${h.t('timer2')}.`],
      ['How do I reheat them?', `${h.k('fsis-leftovers')} says to reach ${h.t('oppvarm')}, measured with a food thermometer.`],
    ],
  }),

  ris: (h) => ({
    gruppe: 'Rice and pasta', kort: 'Fried rice, rice pudding, burrito bowls, soup, and stuffed peppers.',
    tittel: 'What to make with leftover rice',
    h1: 'What to make with leftover rice',
    beskrivelse: 'Five dinners that use cooked rice, plus how long USDA says leftovers keep in the refrigerator and freezer and how hot to reheat them.',
    ingress: 'Cold rice from last night is the start of tonight’s dinner. Here’s what to make with it.',
    svar: `Leftover rice fits fried rice, rice pudding, burrito bowls, soup, and stuffed peppers. ${h.k('fsis-leftovers')} says leftovers keep ${h.t('lft')} in the refrigerator or ${h.t('lftfryst')} in the freezer.`,
    steg: [['Chill it fast', 'Get it into the fridge soon after the meal.'], ['Pick a dish', 'Fried rice, pudding, bowls, soup, or peppers.'], ['Reheat hot', `${h.k('fsis-leftovers')}: ${h.t('oppvarm')}.`]],
    seksjoner: [
      ['Five dishes that fit', retter([
        ['Fried rice', 'Cold rice is what fried rice wants. It fries up separate instead of clumping, with whatever you have.', 'Eggs, frozen vegetables, soy sauce, and oil.'],
        ['Rice pudding', 'Cooked rice simmers with milk and sugar into a creamy dessert, so you skip cooking rice from scratch.', 'Milk, sugar, cinnamon, and raisins if you like.'],
        ['Burrito bowls', 'Rice is the base. Add beans, salsa, and cheese and you’re done.', 'Beans, salsa, cheese, and toppings such as avocado.'],
        ['Chicken and rice soup', 'Rice makes a soup heartier and soaks up the flavor of the broth.', 'Broth, vegetables, and cooked chicken.'],
        ['Stuffed peppers', 'Rice gives the filling body. You don’t have to cook anything new.', 'Bell peppers, ground meat or beans, tomato sauce, and cheese.'],
      ])],
      store(
        p(`${h.k('fsis-leftovers')} says leftovers can be kept in the refrigerator for ${h.t('lft')} or frozen for ${h.t('lftfryst')}.`),
        p(`${h.k('fsis-leftovers')} also says to reheat leftovers to ${h.t('oppvarm')}, measured with a food thermometer.`),
      ),
      ...app(PANTRY, 'Add the rice with the day you cooked it, and you can see how many days are left. ', COOK),
    ],
    faq: [
      ['How long does cooked rice keep in the fridge?', `${h.k('fsis-leftovers')} says leftovers keep ${h.t('lft')}.`],
      ['Can I freeze cooked rice?', `${h.k('fsis-leftovers')} says leftovers can be frozen for ${h.t('lftfryst')}.`],
      ['What’s best to make with rice from last night?', 'Fried rice is the classic. Soup and stuffed peppers are two other ways.'],
    ],
  }),

  pasta: (h) => ({
    gruppe: 'Rice and pasta', kort: 'Pasta salad, baked pasta, soup, and frittata from cooked pasta.',
    tittel: 'What to make with leftover pasta',
    h1: 'What to make with leftover pasta',
    beskrivelse: 'Four dinners that use cooked pasta, plus how long USDA and FoodSafety.gov say leftover pasta and pasta salads keep.',
    ingress: 'It’s easy to cook too much pasta. Here are four ways to give it a second life.',
    svar: `Leftover pasta fits pasta salad, baked pasta, soup, and frittata. ${h.k('fsis-leftovers')} says leftovers keep ${h.t('lft')} in the refrigerator or ${h.t('lftfryst')} in the freezer, and ${h.k('fs-chart')} says macaroni and other prepared salads keep ${h.t('salat')}.`,
    steg: [['Chill it fast', 'Into the fridge soon after the meal.'], ['Pick a dish', 'Salad, bake, soup, or frittata.'], ['Reheat hot', `${h.k('fsis-leftovers')}: ${h.t('oppvarm')}.`]],
    seksjoner: [
      ['Four dishes that fit', retter([
        ['Pasta salad', 'The pasta is done. Toss it with vegetables and a dressing and eat it cold, for instance packed for lunch.', 'Vegetables, a dressing, and something with protein such as ham or cheese.'],
        ['Baked pasta', 'Layer the pasta with sauce and cheese and bake it. It turns into a whole new dinner.', 'Tomato or cream sauce, mozzarella, and any leftover meat.'],
        ['Soup with pasta', 'Add the pasta to broth with vegetables, such as a quick minestrone.', 'Broth, beans, vegetables, and seasoning.'],
        ['Pasta frittata', 'Cooked pasta mixes with eggs and cheese and cooks like a thick omelet. Good when there’s only a little pasta left.', 'Eggs, cheese, and a few vegetables.'],
      ])],
      store(
        p(`${h.k('fsis-leftovers')} says leftovers can be kept in the refrigerator for ${h.t('lft')} or frozen for ${h.t('lftfryst')}. ${h.k('fs-chart')} gives ${h.t('salat')} for egg, chicken, ham, tuna, and macaroni salads.`),
        p(`${h.k('fsis-leftovers')} also says to reheat leftovers to ${h.t('oppvarm')}, measured with a food thermometer.`),
      ),
      ...app(PANTRY, 'Add the pasta with the day you cooked it, and you can see how many days are left. ', COOK),
    ],
    faq: [
      ['How long does cooked pasta keep in the fridge?', `${h.k('fsis-leftovers')} says leftovers keep ${h.t('lft')}.`],
      ['How long does pasta salad keep?', `${h.k('fs-chart')} gives ${h.t('salat')} for macaroni and other prepared salads.`],
      ['Can I freeze cooked pasta?', `${h.k('fsis-leftovers')} says leftovers can be frozen for ${h.t('lftfryst')}.`],
    ],
  }),

  laks: (h) => ({
    gruppe: 'Meat and fish', kort: 'Salmon cakes, salmon salad, pasta, rice bowls, and chowder.',
    tittel: 'What to make with salmon',
    h1: 'What to make with salmon',
    beskrivelse: 'Five dinners that fit salmon, fresh or cooked, plus how long USDA says leftovers keep and what FoodSafety.gov says about fatty fish in the freezer.',
    ingress: 'Salmon works for a weeknight dinner or a lunch the next day. Here’s what to make, and what to do with the rest.',
    svar: `Salmon fits salmon cakes, salmon salad, pasta, rice bowls, and chowder. ${h.k('fsis-leftovers')} says cooked leftovers keep ${h.t('lft')} in the refrigerator, and ${h.k('fs-chart')} gives ${h.t('fet')} in the freezer for fatty fish such as salmon.`,
    steg: [['Raw or cooked?', 'Raw for the oven, cooked for cakes and salad.'], ['Check what else you have', 'Rice, pasta, potatoes, or greens.'], ['Freeze the rest', 'Fatty fish keeps for a shorter time in the freezer.']],
    seksjoner: [
      ['Five dishes that fit', retter([
        ['Salmon cakes', 'Flaked cooked salmon mixes with egg and breadcrumbs and pan-fries into patties. A classic way to stretch a small fillet.', 'Egg, breadcrumbs, onion, and lemon.'],
        ['Salmon salad or sandwiches', 'Flake cold salmon and mix with something creamy for a quick lunch.', 'Mayonnaise or yogurt, celery, and bread or greens.'],
        ['Creamy salmon pasta', 'Cooked salmon warms in a cream sauce with pasta.', 'Pasta, cream or cream cheese, and spinach or peas.'],
        ['Salmon rice bowls', 'Flaked salmon over rice with vegetables and a drizzle of sauce.', 'Rice, cucumber or avocado, and soy sauce.'],
        ['Salmon chowder', 'Salmon adds flavor to a potato and corn soup. A little goes far.', 'Potatoes, corn, onion, and milk or cream.'],
      ])],
      store(
        p(`${h.k('fsis-leftovers')} says leftovers can be kept in the refrigerator for ${h.t('lft')}.`),
        p(`${h.k('fs-chart')} gives ${h.t('fet')} in the freezer for fatty fish such as bluefish, catfish, mackerel, mullet, salmon, and tuna.`),
      ),
      ...app(PANTRY, 'You can see how many days the salmon has left before you pick a dish. ', COOK),
    ],
    faq: [
      ['How long does cooked salmon keep in the fridge?', `${h.k('fsis-leftovers')} says leftovers keep ${h.t('lft')}.`],
      ['Can I freeze salmon?', `Yes. ${h.k('fs-chart')} gives ${h.t('fet')} in the freezer for fatty fish.`],
      ['What’s a good way to use a small piece of salmon?', 'Salmon cakes or a salad. Both stretch a small fillet.'],
    ],
  }),

  'turkey-leftovers': (h) => ({
    gruppe: 'Meat and fish', kort: 'Sandwiches, pot pie, soup, tetrazzini, and quesadillas from the turkey.',
    tittel: 'What to make with leftover turkey',
    h1: 'What to make with leftover turkey',
    beskrivelse: 'Six dinners that use leftover turkey, plus how long USDA says turkey leftovers keep, how to reheat them, and how long they can sit out.',
    ingress: 'The turkey outlasts the holiday. Here’s what to make with the rest.',
    svar: `Leftover turkey fits sandwiches, pot pie, soup, tetrazzini, quesadillas, and hash. ${h.k('fsis-leftovers')} says leftovers keep ${h.t('lft')} in the refrigerator or ${h.t('lftfryst')} in the freezer.`,
    steg: [['Carve it off the bone', 'Chill it soon after the meal.'], ['Pick a dish', 'Sandwiches, pie, soup, or tetrazzini.'], ['Reheat hot', `${h.k('fsis-leftovers')}: ${h.t('oppvarm')}.`]],
    seksjoner: [
      ['Six dishes that fit', retter([
        ['Turkey sandwiches', 'Sliced turkey goes straight onto bread. It’s the simplest way to use it, and cranberry sauce or stuffing makes it a classic.', 'Bread, cranberry sauce or mayonnaise, and lettuce.'],
        ['Turkey pot pie', 'The turkey goes into a creamy filling under a crust, with vegetables and gravy.', 'Pie crust or biscuits, vegetables, and gravy.'],
        ['Turkey soup', 'The carcass and bits of meat flavor the broth, and the sliced turkey goes in at the end.', 'Carrots, celery, onion, and noodles or rice.'],
        ['Turkey tetrazzini', 'Turkey, pasta, and a creamy sauce get baked under cheese.', 'Spaghetti, mushrooms, cream sauce, and Parmesan.'],
        ['Turkey quesadillas', 'Shredded turkey and cheese in a tortilla, crisped in a pan.', 'Tortillas, cheese, and salsa.'],
        ['Turkey hash', 'Diced turkey crisps in a pan with potatoes and onions. Top it with an egg.', 'Potatoes, onion, eggs, and oil.'],
      ])],
      store(
        p(`${h.k('fsis-leftovers')} says leftovers can be kept in the refrigerator for ${h.t('lft')} or frozen for ${h.t('lftfryst')}.`),
        p(`${h.k('fsis-leftovers')} also says to reheat leftovers to ${h.t('oppvarm')}, measured with a food thermometer.`),
      ),
      ...app(PANTRY, 'Add the turkey with the day you cooked it, and you can see how many days are left. ', COOK),
    ],
    faq: [
      ['How long does leftover turkey keep?', `${h.k('fsis-leftovers')} says ${h.t('lft')} in the refrigerator.`],
      ['Can I freeze leftover turkey?', `Yes. ${h.k('fsis-leftovers')} says ${h.t('lftfryst')} in the freezer.`],
      ['How do I reheat it?', `${h.k('fsis-leftovers')} says to reach ${h.t('oppvarm')}, measured with a food thermometer.`],
    ],
  }),

  'kokt-skinke': (h) => ({
    gruppe: 'Meat and fish', kort: 'Ham sandwiches, split pea soup, casserole, omelets, and mac and cheese.',
    tittel: 'What to make with leftover ham',
    h1: 'What to make with leftover ham',
    beskrivelse: 'Five dinners that use leftover ham, plus how long FoodSafety.gov says cooked ham keeps in the refrigerator and freezer.',
    ingress: 'A holiday ham goes a long way. Here’s what to make with what’s left.',
    svar: `Leftover ham fits sandwiches, split pea soup, casseroles, omelets, and mac and cheese. ${h.k('fs-chart')} says cooked, store-wrapped ham slices keep ${h.t('skiver')} in the refrigerator and ${h.t('frys')} in the freezer, and a whole one keeps ${h.t('hel')}.`,
    steg: [['See what’s left', 'Slices, chunks, or the bone.'], ['Pick a dish', 'Sandwiches, soup, casserole, or omelet.'], ['Store it right', 'Back in the fridge after the meal.']],
    seksjoner: [
      ['Five dishes that fit', retter([
        ['Ham sandwiches', 'Slices go straight onto bread. It’s the easiest way to use the rest.', 'Bread, cheese, and mustard.'],
        ['Split pea soup', 'The ham bone and the chunks of meat flavor a pot of split peas. A classic way to use the bone.', 'Split peas, carrots, onion, and broth or water.'],
        ['Ham and potato casserole', 'Diced ham bakes with potatoes and cheese in a creamy sauce.', 'Potatoes, cheese, and cream or milk.'],
        ['Omelet', 'Diced ham goes into an omelet in minutes.', 'Eggs, cheese, and a few vegetables.'],
        ['Mac and cheese with ham', 'Diced ham adds salt and body to a pot of macaroni and cheese.', 'Macaroni, cheese, milk, and butter.'],
      ])],
      store(
        p(`${h.k('fs-chart')} says cooked, store-wrapped ham slices keep ${h.t('skiver')} in the refrigerator and ${h.t('frys')} in the freezer. A whole cooked, store-wrapped ham keeps ${h.t('hel')} in the refrigerator.`),
      ),
      ...app(PANTRY, 'Add the ham with the day you opened it, and you can see how many days are left. ', COOK),
    ],
    faq: [
      ['How long does leftover ham keep?', `${h.k('fs-chart')} says ${h.t('skiver')} for cooked, store-wrapped slices.`],
      ['Can I freeze ham?', `Yes. ${h.k('fs-chart')} gives ${h.t('frys')} in the freezer for cooked slices.`],
      ['What can I do with a ham bone?', 'Split pea soup is the classic. The bone flavors the whole pot.'],
    ],
  }),

  floete: (h) => ({
    gruppe: 'Eggs and dairy', kort: 'Cream sauce, soup, whipped cream, pasta sauce, and scones.',
    tittel: 'What to make with heavy cream',
    h1: 'What to make with heavy cream',
    beskrivelse: 'Dishes that use up heavy cream, and what FoodSafety.gov and USDA say about the refrigerator temperature and how long food can sit out.',
    ingress: 'There’s often a little cream left in the carton. Here’s what to make with it.',
    svar: `Heavy cream fits Alfredo or pan sauce, soup, whipped cream, and scones. ${h.k('fs-chart')} says to keep the refrigerator at ${h.t('kjol')} or below. ${NO_NUMBER('opened cartons of cream')}`,
    steg: [['See how much you have', 'A splash or a full carton.'], ['Pick a dish', 'Sauce, soup, whipped cream, or scones.'], ['Keep it cold', 'Refrigerator at 40°F or below.']],
    seksjoner: [
      ['Five dishes that fit', retter([
        ['Alfredo or pan sauce', 'A splash of cream turns a pan sauce silky. Butter, cream, and cheese are enough for a pasta sauce.', 'Butter, Parmesan, and pasta.'],
        ['Cream soup', 'Cream at the end makes a soup smooth and rich, such as tomato or mushroom.', 'Vegetables or mushrooms, broth, and seasoning.'],
        ['Whipped cream', 'Beat it until it holds soft peaks. Good on pie, berries, or hot chocolate.', 'A little sugar and vanilla.'],
        ['Cream scones or biscuits', 'Cream stands in for butter and milk, so the dough comes together with few ingredients.', 'Flour, baking powder, sugar, and salt.'],
        ['Mashed potatoes', 'A few spoonfuls make mashed potatoes richer.', 'Potatoes, butter, and salt.'],
      ])],
      store(
        p(`${h.k('fs-chart')} says to keep the refrigerator at ${h.t('kjol')} or below. ${h.k('fsis-danger')} says never to leave food out of refrigeration over ${h.t('timer2')}.`),
        p(NO_NUMBER('opened cartons of cream')),
      ),
      ...app(PANTRY, SEARCH),
    ],
    faq: [
      ['How cold should the fridge be?', `${h.k('fs-chart')} says ${h.t('kjol')} or below.`],
      ['How long can cream sit out?', `${h.k('fsis-danger')} says never to leave food out of refrigeration over ${h.t('timer2')}.`],
      ['How long does an opened carton last?', NO_NUMBER('opened cartons of cream')],
    ],
  }),

  gulrotter: (h) => ({
    gruppe: 'Produce and sides', kort: 'Soup, carrot cake, slaw, roasted carrots, and muffins.',
    tittel: 'What to make with carrots',
    h1: 'What to make with carrots',
    beskrivelse: 'Dishes that use up carrots, even the bendy ones, and what FoodSafety.gov says about the refrigerator temperature.',
    ingress: 'Carrots keep a while, but a bag can get lost in the back of the fridge. Here’s what to make with them.',
    svar: `Carrots fit soup, carrot cake, slaw, roasted carrots, and muffins. ${h.k('fs-chart')} says to keep the refrigerator at ${h.t('kjol')} or below. ${NO_NUMBER('carrots')}`,
    steg: [['Look at the carrots', 'Bendy ones still work in soup.'], ['Pick a dish', 'Soup, cake, slaw, roasted, or muffins.'], ['Keep the fridge cold', 'Refrigerator at 40°F or below.']],
    seksjoner: [
      ['Five dishes that fit', retter([
        ['Carrot soup', 'Simmer the carrots until soft and blend. A good way to use bendy carrots.', 'Broth, onion, and ginger or orange if you like.'],
        ['Carrot cake', 'Grated carrots keep a cake moist, and a lot of carrots go in at once.', 'Flour, eggs, sugar, oil, and cinnamon.'],
        ['Carrot slaw', 'Grate them and toss with a dressing. A simple salad that goes with almost anything.', 'Oil, lemon or vinegar, and something crunchy such as nuts.'],
        ['Roasted carrots', 'Whole or halved carrots turn sweet in the oven. Not much work for a lot of flavor.', 'Oil, salt, and seasoning such as thyme.'],
        ['Carrot muffins', 'Grated carrots go into a batter with oats and spices.', 'Flour or oats, eggs, oil, and cinnamon.'],
      ])],
      store(
        p(`${h.k('fs-chart')} says to keep the refrigerator at ${h.t('kjol')} or below.`),
        p(NO_NUMBER('carrots')),
      ),
      ...app(PANTRY, SEARCH),
    ],
    faq: [
      ['How cold should the fridge be?', `${h.k('fs-chart')} says ${h.t('kjol')} or below.`],
      ['How long do carrots keep?', NO_NUMBER('carrots')],
      ['What can I do with bendy carrots?', 'Soup is the most obvious. Carrot cake and muffins are two other ways.'],
    ],
  }),
};

const GROUPS = ['Meat and fish', 'Eggs and dairy', 'Produce and sides', 'Rice and pasta'];

const GRENSE = 'Suggestions are a guide. Check quantities, storage dates and whether every ingredient is still safe to use.';

export const NAV = {
  lenke: 'What can I make?',
  innhold(sider) {
    const grupper = GROUPS.map((g) => [g, sider.filter((s) => s.c.gruppe === g)]).filter(([, l]) => l.length);
    return {
      tittel: 'What can I make with what I have?',
      h1: 'What can I make with what I have?',
      beskrivelse: 'Pick what you have left, from ground beef and chicken to potatoes, rice, and leftover turkey, and see which kinds of dishes fit and how long the rest keeps.',
      grense: GRENSE,
      ingress: 'Pick what you have and see which kinds of dishes fit. The app can also suggest dishes from what’s in your kitchen.',
      svar: `Pick what you have left: ${og(sider.map((s) => s.rad.navn))}. Each page lists kinds of dishes that fit, what else you need, and how long the rest keeps, with sources. The pages have no recipes.`,
      steg: [['Pick the item', 'Meat, eggs, produce, rice, or pasta.'], ['Read the dishes', 'Why they work and what else you need.'], ['Add it to your pantry', 'Matlyst finds recipes and suggestions.']],
      seksjoner: [
        ['From the pantry to dinner', p('Add what you have to the pantry, and Matlyst matches it against the recipes in your collection. You can see what you can make without a trip to the store.')],
        ['Search your own recipes', p('Type an ingredient, such as “ground beef,” into search in Matlyst and see which of your saved recipes use it. It’s plain search, so it works without AI.')],
        ['Pick what you have', grupper.map(([g, l]) => `<h3>${g}</h3>${l.map((s) => `<div class="scenario"><h3><a href="${s.href}">${s.c.h1}</a></h3><p>${s.c.kort}</p></div>`).join('')}`).join('')],
        ['Save food before it goes bad', p('Matlyst keeps an eye on the dates. When something is getting close, you get ideas for using it up, so less food ends up in the trash and more ends up on the plate.')],
        ['Fewer trips to the store', p('When you can see what you can already make, you skip the extra run. You buy less, throw out less, and use what you’ve already paid for.')],
        ['Good to know', p(GRENSE)],
        ['How the pages are made', ul([
          '<strong>No recipes.</strong> Each page has kinds of dishes, why they work, and what else you need, in rough terms.',
          '<strong>Storage only with a source.</strong> Numbers about storage come from FoodSafety.gov and USDA FSIS, with links at the bottom. Where we don’t have a source, the page says so and gives no number.',
          '<strong>The numbers are a guide.</strong> They come from the sources and are not a guarantee for a single item.',
        ])],
        ['More from Matlyst', p('See also <a href="/en/dinner-ideas/">dinner ideas every day</a>, <a href="/en/empty-the-fridge/">empty the fridge</a>, and the <a href="/en/pantry-app/">pantry app</a>. Missing an ingredient? See <a href="/en/substitutes/">what you can use instead</a>.')],
      ],
      faq: [
        ['Does ingredient search create new recipes?', 'No. It matches your own collection. Ask Matlyst can create or adapt a dish.'],
        ['Are the pages free?', 'Yes, you don’t need the app to use them. Searching your own recipes and the pantry are free too. Dinner ideas from the pantry are a Pro feature.'],
        ['Do the pages have recipes?', 'No. They list kinds of dishes that fit, why, and what else you need.'],
        ['Where do the numbers come from?', 'From FoodSafety.gov and USDA FSIS. The sources are listed at the bottom of each page.'],
      ],
    };
  },
};

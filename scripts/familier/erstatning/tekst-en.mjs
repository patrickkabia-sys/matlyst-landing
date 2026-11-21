// Text for the family «erstatning» (en-US): one function per ingredient. T(id) and E(id) read the numbers from data.en.json, so no number is typed by hand.
// Every ratio comes from a land-grant university extension service or King Arthur Baking, with the quote in the data file. Where sources disagree, the page shows both.
// Where the sources say nothing, the page says so and gives no number. No allergy advice. No recipes: the pages say what can be swapped, not how to make a dish.
// Avoid the words swap/list/cook/bake/plan/week/store/buy/find/recipes in headings except the two app headings: scripts/app-bevis.mjs matches them to app cards.
import { kortListe, og, p, ul } from './bygg-en.mjs';

const N = { csu: 'Colorado State Extension', usu: 'Utah State Extension', unl: 'Nebraska Extension', ndsu: 'NDSU Extension', tamu: 'Texas A&M AgriLife Extension', ill: 'Illinois Extension', msu: 'Montana State Extension', kaf: 'King Arthur Baking' };
const APP_FELLES = 'Open a recipe in the app and use <strong>Ask Matlyst</strong> to get a swap based on what you have in the pantry. Ask Matlyst is a Pro feature, uses AI, and has a monthly quota, so read the result before you start.';
// Two sections: the pantry (what you have) and Ask Matlyst (the swap itself). The headings decide which app cards the page gets.
const app = (intro) => [
  ["See what's in your pantry", p(intro, 'Add what you have to the <a href="/en/pantry-app/">pantry</a> in Matlyst. That way you know what you can swap in before you start.')],
  ['Swap the ingredient in Matlyst', p(APP_FELLES)],
];
const R = (id) => id; // related page ids, resolved by the builder

export const TEKST = {
  buttermilk: (T, E) => ({
    gruppe: 'Dairy', kort: 'Milk plus lemon juice or vinegar, cream of tartar, or thinned yogurt.', lenke: 'Buttermilk substitute',
    tittel: 'Buttermilk substitute: what to use and how much',
    h1: 'What can I substitute for buttermilk?',
    beskrivelse: 'Out of buttermilk? Nebraska Extension, Utah State, and King Arthur Baking give the ratios: milk with lemon juice or vinegar, cream of tartar, or thinned yogurt. See which works where.',
    ingress: 'Buttermilk is easy to replace with milk and something sour. It works best in cakes and quick breads.',
    svar: `${N.unl} says to stir ${E('syre')} of lemon juice or vinegar into regular milk to make ${E('kopp')} and let it stand ${E('stå-unl')}. ${N.kaf} says to let the milk stand ${T('stå-kaf-min')} to ${E('stå-kaf-maks')}, until it thickens slightly.`,
    steg: [['Pick an acid', 'Lemon juice, vinegar, cream of tartar, or yogurt.'], ['Mix and wait', 'Milk with an acid needs to stand before you use it.'], ['Check the recipe', 'Plain milk is a poor swap when the recipe uses baking soda.']],
    kilder: ['unl', 'kaf', 'usu', 'csu'],
    beslektet: ['bakepulver', 'sour-cream', 'melk', 'lemon-juice'],
    seksjoner: [
      ['Four ways to replace one cup of buttermilk', kortListe([
        ['Milk with lemon juice or vinegar', ['Ratio', `${N.unl}: ${E('syre')} lemon juice or vinegar plus enough regular milk to make ${E('kopp')}. Let it stand ${E('stå-unl')}.`], ['What changes', `${N.kaf} gives a longer wait, ${T('stå-kaf-min')} to ${E('stå-kaf-maks')}, and says the milk thickens very slightly and curdles.`]],
        ['Milk with cream of tartar', ['Ratio', `${N.kaf}: ${E('kremor')} of cream of tartar mixed with 1 cup of milk. Shake until it dissolves.`], ['What changes', `${N.usu} gives the same ratio.`]],
        ['Plain yogurt', ['Ratio', `${N.usu}: ${E('yoghurt')} of plain yogurt for 1 cup of buttermilk.`], ['What changes', 'Yogurt is thicker than buttermilk. The next swap thins it.']],
        ['Greek yogurt thinned with milk', ['Ratio', `${N.kaf}: ${T('gresk-del')} part yogurt to ${E('gresk-melk')} of 1% or skim milk. One small container (${E('gresk-beger')}) of Greek yogurt with ${E('gresk-melkkopp')} of milk makes 2 cups.`], ['What changes', `${N.kaf} found this the closest to buttermilk in flavor in simple recipes.`]],
      ])],
      ['When a replacement works and when it does not', p(`${N.kaf} tested these swaps in biscuits, pancakes, and a buttermilk cake. Its summary: the shorter a recipe's ingredient list, the less successful a buttermilk substitute will be. The tang of buttermilk shows most when it sits next to only flour, an egg, and fat.`, `The test also found that plain milk lacks buttermilk's acidity. In a cake leavened with baking soda it gave a darker, denser cake. If your recipe uses baking soda, use one of the acidic swaps above.`)],
      ...app("Buttermilk is a one-recipe ingredient that a lot of kitchens don't keep on hand."),
    ],
    faq: [
      ['Can I use plain milk instead of buttermilk?', `${N.kaf} says plain milk lacks buttermilk's acidity. In its test it gave a denser cake and flat-tasting biscuits.`],
      ['How long does the milk need to stand?', `${N.unl} says ${E('stå-unl')}. ${N.kaf} says ${T('stå-kaf-min')} to ${E('stå-kaf-maks')}.`],
      ['Can I use yogurt instead of buttermilk?', `Yes. ${N.usu} lists ${E('yoghurt')} of plain yogurt per cup of buttermilk, and ${N.kaf} thins Greek yogurt with milk.`],
    ],
  }),

  egg: (T, E) => ({
    gruppe: 'Baking', kort: 'Baking powder with vinegar, mayonnaise, flax, or applesauce, by what the egg does.', lenke: 'Egg substitute',
    tittel: 'Egg substitute for baking: what can I use instead of eggs?',
    h1: 'What can I use instead of eggs in baking?',
    beskrivelse: 'No eggs? Nebraska, Illinois, and Utah State extension list swaps with amounts, by what the egg does in the recipe: binding, lift, or moisture. Plus how much one egg measures.',
    ingress: 'An egg does more than one job in a cake. It binds, lifts, and adds moisture. The swap you pick depends on the job.',
    svar: `${N.unl} lists ${T('bp')} teaspoon baking powder plus ${E('eddik')} vinegar plus ${E('vaeske')} liquid for one whole egg, for baking only. It also lists ${E('mayo')} mayonnaise in cake batter and ${E('eggerstatning')} egg substitute.`,
    steg: [['Name the job', 'Binding, lift, or moisture.'], ['Pick the swap', 'Each one below is per whole egg.'], ['Expect a change', 'The sources say flavor and texture may change slightly.']],
    kilder: ['unl', 'ill', 'usu'],
    beslektet: ['bakepulver', 'buttermilk', 'melk', 'cake-flour'],
    seksjoner: [
      ['Replacements for one whole egg', kortListe([
        ['Baking powder, vinegar, and liquid', ['Ratio', `${N.unl}: ${T('bp')} teaspoon baking powder plus ${E('eddik')} vinegar plus ${E('vaeske')} liquid. For baking use only.`], ['What changes', 'This swap gives lift. The source says it is for baking only.']],
        ['Mayonnaise', ['Ratio', `${N.unl}: ${E('mayo')} mayonnaise, suitable for cake batter.`], ['What changes', 'The source names cake batter only.']],
        ['Commercial egg substitute', ['Ratio', `${N.unl} and ${N.ill}: ${E('eggerstatning')} egg substitute. Check the label for directions.`], ['What changes', 'The sources do not compare brands.']],
        ['Flax or chia seed', ['Ratio', `${N.ill}: ${E('lin')} flax or chia seed plus ${E('lin-vann')} water. Combine and let it sit 5 minutes.`], ['What changes', `${N.ill} lists this for binding and for lift.`]],
        ['Water, oil, and baking powder', ['Ratio', `${N.ill}: ${E('olje')} water plus ${E('olje')} oil plus ${E('olje-bp')} baking powder.`], ['What changes', `${N.ill} lists this one for lift.`]],
        ['Mashed fruit or puree', ['Ratio', `${N.ill}: ${E('moist')} mashed banana, mashed avocado, applesauce, pumpkin puree, sweet potato, mashed beans, or silken tofu.`], ['What changes', `${N.ill} lists these for moisture.`]],
        ['Two egg whites', ['Ratio', `${N.ill}: ${E('hor-hvit')}, as a general-purpose swap.`], ['What changes', 'The source does not say which recipes suit it.']],
      ])],
      ['What one egg measures', p(`${N.usu} gives these equivalents: 1 large egg is ${E('en-egg')}, and ${T('fem-egg')} large eggs make ${E('kopp')}. Use this when a recipe asks for a part of an egg and you need to measure it.`)],
      ['Why there is no single answer', p(`${N.ill} puts it plainly: depending upon the recipe and the function of the egg, certain options are better suited than others, as the flavor and texture may be slightly altered. For a cake that needs lift, use a swap that lifts. For a dense bar, a moist one may do.`)],
      ...app("It's easy to run out of eggs halfway through a recipe."),
    ],
    faq: [
      ['What is the easiest egg substitute for baking?', `${N.unl} lists ${T('bp')} teaspoon baking powder, ${E('eddik')} vinegar, and ${E('vaeske')} liquid per egg, for baking only.`],
      ['How much is one egg?', `${N.usu} gives ${E('en-egg')} for 1 large egg.`],
      ['Can I use mayonnaise instead of an egg?', `${N.unl} lists ${E('mayo')} mayonnaise per egg in cake batter.`],
    ],
  }),

  bakepulver: (T, E) => ({
    gruppe: 'Baking', kort: 'Baking soda plus cream of tartar, or soda plus something sour.', lenke: 'Baking powder substitute',
    tittel: 'Baking powder substitute: baking soda and cream of tartar',
    h1: 'What can I substitute for baking powder?',
    beskrivelse: 'Illinois, Colorado State, and Utah State extension give the ratio: 1/4 teaspoon baking soda plus 5/8 teaspoon cream of tartar for each teaspoon. Plus three other options and what to cut back.',
    ingress: 'Baking powder is baking soda with an acid already in it. To replace it, you supply the acid yourself.',
    svar: `${N.ill} says to use ${T('soda')} teaspoon baking soda and ${T('kremor')} teaspoon cream of tartar for each ${T('bp')} teaspoon of baking powder. ${N.csu} and ${N.usu} give the same ratio.`,
    steg: [['Check for cream of tartar', 'It is the acid in the main swap.'], ['No cream of tartar?', 'Soda with buttermilk, yogurt, or molasses also works, with less liquid.'], ['Mix just before use', 'Soda starts to react when it meets liquid.']],
    kilder: ['ill', 'csu', 'usu', 'msu'],
    beslektet: ['buttermilk', 'self-rising-flour', 'cornstarch', 'egg'],
    seksjoner: [
      ['Four ways to replace one teaspoon', kortListe([
        ['Baking soda and cream of tartar', ['Ratio', `${N.ill}: ${T('soda')} teaspoon baking soda plus ${T('kremor')} teaspoon cream of tartar.`], ['What changes', `${N.msu} lists ${E('msu-kremor')} of cream of tartar instead, so the sources differ a little here.`]],
        ['Baking soda, cream of tartar, and cornstarch', ['Ratio', `${N.csu}: ${T('melk-soda')} teaspoon baking soda, ${E('tre')} cream of tartar, and ${E('tre-maisenna')} cornstarch.`], ['What changes', 'The cornstarch keeps the mix dry.']],
        ['Soda with buttermilk, sour milk, or yogurt', ['Ratio', `${N.csu}: ${T('melk-soda')} teaspoon baking soda plus ${E('melk')} buttermilk, sour milk, or yogurt.`], ['What changes', `Decrease the liquid in the recipe by ${E('melk')}.`]],
        ['Soda with molasses', ['Ratio', `${N.csu}: ${T('melk-soda')} teaspoon baking soda plus ${E('melasse')} molasses.`], ['What changes', `Decrease the liquid in the recipe by ${T('melasse-vaeske-min')} to ${E('melasse-vaeske-maks')}.`]],
      ])],
      ['Why soda needs an acid', p(`${N.usu} explains that in order for carbon dioxide to be released and cause the product to rise, an acid ingredient must be present to react with the soda. Molasses is acidic enough that it releases carbon dioxide.`, 'That is why each swap above pairs the soda with something sour.')],
      ...app("Baking powder and baking soda sit side by side in the cupboard, and it's easy to grab the wrong one."),
    ],
    faq: [
      ['How much baking soda replaces baking powder?', `${N.ill} says ${T('soda')} teaspoon baking soda plus ${T('kremor')} teaspoon cream of tartar for each ${T('bp')} teaspoon of baking powder.`],
      ['Can I use baking soda alone?', `Not by itself. ${N.usu} says an acid ingredient must be present to react with the soda.`],
      ['Do I change the liquid?', `With buttermilk, sour milk, or yogurt, ${N.csu} says to decrease the liquid by ${E('melk')}. With molasses, by ${T('melasse-vaeske-min')} to ${E('melasse-vaeske-maks')}.`],
    ],
  }),

  gjaer: (T, E) => ({
    gruppe: 'Baking', kort: 'A package of active dry yeast, in teaspoons, and compressed yeast.', lenke: 'Yeast substitute',
    tittel: 'Yeast substitute: active dry, compressed, and package sizes',
    h1: 'What can I substitute for yeast?',
    beskrivelse: 'Extension sources give one package of active dry yeast as 2 1/4 or 2 1/2 teaspoons and say a compressed yeast cake can stand in for it. See the sizes and where the sources differ.',
    ingress: 'There is no pantry swap for yeast. What you can swap is one kind of yeast for another.',
    svar: `${N.unl} says ${E('komprimert-oz')} of compressed yeast equals 1 package (${E('pakke-oz')}) of active dry yeast, or ${E('pakke-ts-unl')} of active dry yeast. ${N.csu} gives one package as ${E('pakke-ts-csu')}.`,
    steg: [['Name your yeast', 'Active dry, compressed, or something else.'], ['Match the amount', 'One package is the unit the sources use.'], ['Check the package', 'Sources differ by a quarter teaspoon.']],
    kilder: ['unl', 'csu', 'usu', 'ndsu'],
    beslektet: ['bakepulver', 'buttermilk', 'melk'],
    seksjoner: [
      ['Replacements between yeasts', kortListe([
        ['Active dry for compressed', ['Ratio', `${N.unl}: for ${E('komprimert-oz')} of compressed yeast, use 1 package (${E('pakke-oz')}) of active dry yeast, or ${E('pakke-ts-unl')} of active dry yeast.`], ['What changes', `${N.csu} lists the same swap in the other direction: 1 package of active dry yeast (${T('pakke-oz')} ounce) or 1 compressed yeast cake.`]],
        ['One tablespoon of active dry yeast', ['Ratio', `${N.usu}: ${E('spiseskje')} of active dry yeast is 1 package of active dry yeast or 1 compressed yeast cake.`], ['What changes', `${N.ndsu} lists the cake as ${T('ndsu-kake')} ounce.`]],
      ])],
      ['Where the sources differ', p(`${N.unl} gives one package as ${E('pakke-ts-unl')}. ${N.csu} gives ${E('pakke-ts-csu')}. For a recipe that lists a package, go by the package. For a recipe in teaspoons, check the label on your jar.`)],
      ['What the sources do not cover', p('None of the extension sources we read give a ratio for instant or fresh yeast, so this page gives none. The package label is the best guide for those.')],
      ...app("Yeast jars have an expiration date, and it's easy to forget which one is open."),
    ],
    faq: [
      ['How much is one package of yeast?', `${N.unl} gives ${E('pakke-ts-unl')}. ${N.csu} gives ${E('pakke-ts-csu')}.`],
      ['Can I use compressed yeast instead of active dry?', `Yes. ${N.usu} lists 1 compressed yeast cake for 1 package of active dry yeast.`],
      ['What about instant yeast?', 'The sources we read do not give a ratio, so we do not give one.'],
    ],
  }),

  smor: (T, E) => ({
    gruppe: 'Dairy', kort: 'Margarine, shortening, oil, or lard, with a pinch of salt.', lenke: 'Butter substitute',
    tittel: 'Butter substitute: margarine, shortening, oil, or lard',
    h1: 'What can I use instead of butter?',
    beskrivelse: 'Utah State, Colorado State, and Nebraska extension list what replaces a cup of butter: margarine, shortening, lard, or oil, and when you add 1/2 teaspoon of salt.',
    ingress: 'Margarine is the easy swap. Shortening, lard, and oil work too, with a little salt.',
    svar: `${N.usu} says to use ${E('margarin')} of margarine for 1 cup of butter, or ${T('fett-min')} to ${E('fett-maks')} of hydrogenated fat plus ${E('salt')} of salt, or ${E('smult')} of lard or oil plus the same salt.`,
    steg: [['Match the cup', 'The ratios are per 1 cup of butter.'], ['Add the salt', 'Shortening, lard, and oil swaps add 1/2 teaspoon.'], ['Check melted butter', 'Oil can stand in for melted butter in equal amount.']],
    kilder: ['usu', 'unl', 'csu', 'ndsu'],
    beslektet: ['heavy-cream', 'sour-cream', 'melk', 'brun-farin'],
    seksjoner: [
      ['Replacements for one cup of butter', kortListe([
        ['Margarine', ['Ratio', `${N.usu}: ${E('margarin')} of margarine.`], ['What changes', `${N.unl} says regular margarine, and lists vegetable shortening for baking.`]],
        ['Shortening (hydrogenated fat)', ['Ratio', `${N.usu}: ${T('fett-min')} to ${E('fett-maks')} of hydrogenated fat plus ${E('salt')} of salt.`], ['What changes', 'The salt makes up for the salt in butter.']],
        ['Lard', ['Ratio', `${N.usu}: ${E('smult')} of lard plus ${E('salt')} of salt.`], ['What changes', 'Nothing more is said in the source.']],
        ['Oil', ['Ratio', `${N.usu}: ${E('olje')} of oil, and ${N.ndsu} adds the same salt.`], ['What changes', `${N.unl} says an equal amount of oil can stand in for melted butter when the recipe calls for it melted.`]],
        ['Clarified chicken fat', ['Ratio', `${N.usu}: ${E('kylling')} of clarified chicken fat.`], ['What changes', 'The source gives no more detail.']],
      ])],
      ['Melted butter is the easy case', p(`${N.unl}: an equal amount of oil can be substituted for a similar portion of melted butter if the recipe specifies using melted butter. If the recipe asks for creamed or cold butter, use one of the solid swaps instead.`)],
      ...app('Butter is a staple that runs out fast when you bake.'),
    ],
    faq: [
      ['Can I use oil instead of butter?', `${N.usu} lists ${E('olje')} of oil per cup, plus ${E('salt')} of salt. ${N.unl} says an equal amount works for melted butter.`],
      ['Can I use margarine instead of butter?', `Yes. ${N.usu} lists ${E('margarin')} of margarine for 1 cup of butter.`],
      ['Do I add salt?', `For shortening, lard, and oil, the sources add ${E('salt')} of salt per cup. For margarine, they do not.`],
    ],
  }),

  floete: (T, E) => ({
    gruppe: 'Dairy', kort: 'Milk plus butter, for baking only. It will not whip.', lenke: 'Heavy cream substitute',
    tittel: 'Heavy cream substitute: milk and butter',
    h1: 'What can I use instead of heavy cream?',
    beskrivelse: 'Colorado State, Utah State, and Illinois extension give the swap: 3/4 cup milk plus 1/3 cup butter per cup of heavy cream. It is for cooking and baking only and will not whip.',
    ingress: 'You can mix a heavy cream substitute from milk and butter. It does the job of fat in a recipe, but it will not whip.',
    svar: `${N.csu}, ${N.usu}, and ${N.ill} all give the same ratio: ${E('melk')} of milk plus ${E('smor')} of butter for each cup of heavy cream. It is for baking only and will not whip.`,
    steg: [['Melt and mix', 'Butter into milk.'], ['Use it for cooking and baking', 'The sources say baking and cooking only.'], ["Don't whip it", "It won't hold peaks."]],
    kilder: ['csu', 'usu', 'ill'],
    beslektet: ['half-and-half', 'sour-cream', 'smor', 'melk'],
    seksjoner: [
      ['The ratio for one cup', kortListe([
        ['Milk and butter', ['Ratio', `${E('melk')} of milk plus ${E('smor')} of butter (${N.csu}, ${N.usu}, ${N.ill}).`], ['What changes', `${N.csu} adds: for baking only, will not whip.`]],
      ])],
      ['What heavy cream is, by the numbers', p(`${N.csu} and ${N.usu} both describe heavy cream as ${T('fett-min')} to ${T('fett-maks')} percent fat. ${N.usu} says 1 cup of heavy cream gives ${T('pisket')} to ${E('pisket-maks')} when whipped.`, 'The milk and butter swap matches the fat, but not the way cream traps air. That is why every source adds that it will not whip.')],
      ...app('Cream has a short shelf life, and half a carton is easy to lose track of.'),
    ],
    faq: [
      ['Can I whip the milk and butter swap?', `No. ${N.csu} and ${N.ill} both say it will not whip.`],
      ['How much butter and milk per cup of cream?', `${E('melk')} of milk plus ${E('smor')} of butter, according to ${N.csu}, ${N.usu}, and ${N.ill}.`],
      ['Can I use it in soup or sauce?', `The sources say for use in cooking and baking. They do not name specific dishes.`],
    ],
  }),

  'half-and-half': (T, E) => ({
    gruppe: 'Dairy', kort: 'Evaporated milk, or milk plus butter. The sources give two butter amounts.', lenke: 'Half-and-half substitute',
    tittel: 'Half-and-half substitute: evaporated milk or milk and butter',
    h1: 'What can I use instead of half-and-half?',
    beskrivelse: 'Illinois, Utah State, Colorado State, and NDSU extension agree on evaporated milk, undiluted. For milk and butter, the sources give 3 tablespoons or 1 1/2 tablespoons of butter. See both.',
    ingress: 'The simplest swap is evaporated milk straight from the can. Milk plus butter also works, but the sources do not agree on how much butter.',
    svar: `${N.ill}, ${N.usu}, ${N.csu}, and ${N.ndsu} all list ${E('evap')} of undiluted evaporated milk for 1 cup of half-and-half.`,
    steg: [['Reach for the can', 'Undiluted evaporated milk, same amount.'], ['Or mix milk and butter', `Use ${E('usu-melk')} of milk with butter. Amounts differ by source.`], ['Use it in recipes', 'The sources say cooking and baking.']],
    kilder: ['ill', 'usu', 'csu', 'ndsu'],
    beslektet: ['heavy-cream', 'melk', 'smor', 'sour-cream'],
    seksjoner: [
      ['Replacements for one cup', kortListe([
        ['Evaporated milk', ['Ratio', `${E('evap')} of evaporated milk, undiluted (${N.ill}, ${N.usu}, ${N.csu}, ${N.ndsu}).`], ['What changes', 'Four sources agree on this one.']],
        ['Milk and butter', ['Ratio', `${N.usu}: ${E('usu-melk')} of milk plus ${E('usu-smor')} of butter or margarine. ${N.csu}: ${E('csu-melk')} of milk plus ${E('csu-smor')} of butter. ${N.ndsu}: ${E('usu-melk')} of whole milk plus ${E('ndsu-smor')} of butter or margarine.`], ['What changes', 'The sources differ on the butter. The more butter, the richer the result.']],
        ['Coffee cream and milk', ['Ratio', `${N.csu}: ${E('csu-kaffe')} of coffee cream plus ${E('csu-kaffe')} of milk.`], ['What changes', 'The source gives no more detail.']],
        ['Oil and milk', ['Ratio', `${N.ndsu}: ${E('ndsu-olje')} of oil plus milk to equal ${E('kopp')}.`], ['What changes', 'This one has no dairy fat.']],
      ])],
      ['Why the butter amounts differ', p(`${N.usu} and ${N.csu} describe half-and-half with slightly different fat ranges, and they give different butter amounts: ${E('usu-smor')} versus ${E('csu-smor')}. We show both rather than pick one. If your recipe is picky, start with the smaller amount.`)],
      ...app('Half-and-half is often bought for one dish and then forgotten.'),
    ],
    faq: [
      ['Can I use milk instead of half-and-half?', `Milk alone is thinner. The sources add butter: ${N.usu} lists ${E('usu-melk')} of milk plus ${E('usu-smor')} of butter.`],
      ['Does evaporated milk work?', `Yes. Four extension sources list ${E('evap')} of undiluted evaporated milk per cup.`],
      ['Why do the sources give different butter amounts?', `The sources don't explain it. ${N.usu} says ${E('usu-smor')}, ${N.csu} says ${E('csu-smor')}, and ${N.ndsu} says ${E('ndsu-smor')}.`],
    ],
  }),

  'sour-cream': (T, E) => ({
    gruppe: 'Dairy', kort: 'Plain yogurt cup for cup, or blended cottage cheese.', lenke: 'Sour cream substitute',
    tittel: 'Sour cream substitute: plain yogurt or cottage cheese',
    h1: 'What can I substitute for sour cream?',
    beskrivelse: 'Utah State, Montana State, and Colorado State extension list plain yogurt, blended cottage cheese, and evaporated milk with vinegar. Ratios per cup of sour cream.',
    ingress: 'Plain yogurt is the first swap in every source. Blended cottage cheese is the second.',
    svar: `${N.usu} says ${E('yoghurt')} of plain yogurt replaces 1 cup of sour cream. ${N.msu} adds ${E('cottage')} of cottage cheese blended with ${E('cottage-melk')} of milk and ${E('cottage-sitron')} of lemon juice.`,
    steg: [['Start with yogurt', 'Plain, in the same amount.'], ['Or blend cottage cheese', 'With a little milk and lemon juice.'], ['Check the recipe', 'The sources do not say which dishes suit each swap.']],
    kilder: ['usu', 'msu', 'csu'],
    beslektet: ['buttermilk', 'heavy-cream', 'half-and-half', 'smor'],
    seksjoner: [
      ['Replacements for one cup', kortListe([
        ['Plain yogurt', ['Ratio', `${N.usu}: ${E('yoghurt')} of plain yogurt.`], ['What changes', `${N.msu} gives the same.`]],
        ['Cottage cheese, blended', ['Ratio', `${N.msu}: ${E('cottage')} of cottage cheese blended with ${E('cottage-melk')} of milk and ${E('cottage-sitron')} of lemon juice.`], ['What changes', 'You blend it smooth first.']],
        ['Sour milk and butter', ['Ratio', `${N.usu}: ${E('sur-melk')} of sour milk plus ${E('smor')} of butter.`], ['What changes', `${N.csu} lists ${E('kefir')} of buttermilk or sour milk as well.`]],
        ['Evaporated milk and vinegar', ['Ratio', `${N.csu}: ${E('evap')} of evaporated milk plus ${E('evap-eddik')} of vinegar. Let it stand ${E('evap-min')} before using.`], ['What changes', 'The vinegar gives the tang.']],
      ])],
      ['What the sources do not say', p('The extension sources give ratios, not taste notes. They do not compare how each swap behaves on a baked potato, in a dip, or in a cake. Pick by what you have, and taste as you go.')],
      ...app('An open tub of sour cream is easy to forget about in the fridge.'),
    ],
    faq: [
      ['Can I use yogurt instead of sour cream?', `Yes. ${N.usu} and ${N.msu} both list ${E('yoghurt')} of plain yogurt per cup.`],
      ['Can I use cottage cheese?', `${N.msu}: ${E('cottage')} blended with ${E('cottage-melk')} of milk and ${E('cottage-sitron')} of lemon juice.`],
      ['Does the swap change by recipe?', 'The sources do not say. They give one ratio per swap.'],
    ],
  }),

  melk: (T, E) => ({
    gruppe: 'Dairy', kort: 'Evaporated milk with water, dry milk with water, or another milk.', lenke: 'Milk substitute',
    tittel: 'Milk substitute for cooking and baking',
    h1: 'What can I use instead of milk?',
    beskrivelse: 'Colorado State and Illinois extension list what stands in for 1 cup of milk: evaporated milk and water, powdered milk and water, other milks, or water with butter in baking.',
    ingress: 'Evaporated milk or powdered milk plus water will do. For baking, even water with a little butter is on the list.',
    svar: `${N.csu} says ${E('evap')} of evaporated milk plus ${E('evap-vann')} of water replaces 1 cup of whole milk. ${N.ill} lists ${E('pulver')} of instant powdered milk with ${E('pulver-vann')} of water.`,
    steg: [['Pick your milk', 'Canned, powdered, or a plant milk.'], ['Add water where needed', 'Evaporated and powdered milk are concentrated.'], ['Match the amount', 'Every ratio is per 1 cup.']],
    kilder: ['csu', 'ill'],
    beslektet: ['buttermilk', 'half-and-half', 'heavy-cream', 'smor'],
    seksjoner: [
      ['Replacements for one cup of whole milk', kortListe([
        ['Evaporated milk and water', ['Ratio', `${N.csu}: ${E('evap')} of evaporated milk plus ${E('evap-vann')} of water. ${N.ill} lists the same.`], ['What changes', 'Evaporated milk is concentrated, so the water thins it back.']],
        ['Powdered milk and water', ['Ratio', `${N.ill}: ${E('pulver')} of instant nonfat dry milk plus ${E('pulver-vann')} of water.`], ['What changes', 'This gives a nonfat milk.']],
        ['Skim, 2%, or reconstituted dry milk', ['Ratio', `${N.csu}: ${E('skummet')} of any of these.`], ['What changes', 'The fat content differs from whole milk.']],
        ['Soy or almond milk', ['Ratio', `${N.csu}: ${E('soya')} of soy or almond milk.`], ['What changes', 'The source gives no taste notes.']],
        ['Water and butter, in baking', ['Ratio', `${N.csu}: 1 cup of water plus ${E('vann-smor')} of butter.`], ['What changes', 'The source says in baking.']],
      ])],
      ['If the recipe wants sour milk', p(`${N.ill} lists ${E('eddik')} of lemon juice or vinegar plus enough regular milk to make 1 cup, left to sit 5 minutes, as a buttermilk swap. See the <a href="/en/substitutes/buttermilk/">buttermilk page</a>.`)],
      ...app('Milk can go bad before you finish the carton.'),
    ],
    faq: [
      ['Can I use water instead of milk?', `${N.csu} lists 1 cup of water plus ${E('vann-smor')} of butter, in baking.`],
      ['How much evaporated milk replaces a cup of milk?', `${N.csu}: ${E('evap')} of evaporated milk plus ${E('evap-vann')} of water.`],
      ['Can I use plant milk?', `${N.csu} lists ${E('soya')} of soy or almond milk per cup.`],
    ],
  }),

  'cake-flour': (T, E) => ({
    gruppe: 'Flour and thickeners', kort: 'All-purpose flour minus 2 tablespoons, and the way back.', lenke: 'Cake flour substitute',
    tittel: 'Cake flour substitute: all-purpose flour',
    h1: 'What can I use instead of cake flour?',
    beskrivelse: 'Nebraska and Colorado State extension say 1 cup of cake flour is 1 cup of all-purpose flour minus 2 tablespoons. Colorado State and Utah State give the swap the other way too.',
    ingress: 'All-purpose flour stands in for cake flour. You use a little less of it.',
    svar: `${N.unl} says to use ${E('kopp')} of all-purpose flour minus ${E('minus')} for each cup of cake flour. ${N.csu} writes the same swap as ${E('csu-oppskrift')}.`,
    steg: [['Measure the flour', 'Fill the cup with all-purpose flour.'], ['Take out two tablespoons', 'That is the whole swap.'], ['Going the other way?', 'Add two tablespoons of cake flour instead.']],
    kilder: ['unl', 'csu', 'usu'],
    beslektet: ['self-rising-flour', 'cornstarch', 'bakepulver', 'egg'],
    seksjoner: [
      ['Replacements in both directions', kortListe([
        ['All-purpose flour for cake flour', ['Ratio', `${N.unl}: ${E('kopp')} of all-purpose flour minus ${E('minus')}, for 1 cup of cake flour. ${N.csu}: ${E('csu-oppskrift')}, "1 cup less ${T('csu-minus')} Tbsp".`], ['What changes', 'The source gives no notes on texture.']],
        ['Cake flour for all-purpose flour', ['Ratio', `${N.csu}: ${E('motsatt')} of cake flour (1 cup plus ${E('motsatt-pluss')}) for 1 cup of all-purpose flour. ${N.usu} agrees: 1 cup plus ${E('usu-motsatt')} of cake flour.`], ['What changes', 'You use slightly more cake flour, because it is lighter.']],
        ['All-purpose flour for pastry flour', ['Ratio', `${N.csu}: ${E('pastry')} of all-purpose or bread flour for 1 cup of pastry flour.`], ['What changes', 'The source gives no more detail.']],
      ])],
      ['What the sources do not cover', p('The extension sources give amounts but do not explain why cake flour bakes differently, and they do not give a cornstarch version. This page sticks to what they say.')],
      ...app('Flour types are easy to mix up when the bags look alike.'),
    ],
    faq: [
      ['How do I make cake flour from all-purpose flour?', `${N.unl}: use 1 cup of all-purpose flour minus ${E('minus')}.`],
      ['How much cake flour replaces all-purpose flour?', `${N.csu} says ${E('motsatt')}, which is 1 cup plus ${E('motsatt-pluss')}.`],
      ['Is cake flour the same as pastry flour?', `The sources list them separately. ${N.csu} gives ${E('pastry')} of all-purpose flour for pastry flour.`],
    ],
  }),

  'self-rising-flour': (T, E) => ({
    gruppe: 'Flour and thickeners', kort: 'All-purpose flour with baking powder and salt. Three sources, three amounts.', lenke: 'Self-rising flour substitute',
    tittel: 'Self-rising flour substitute: all-purpose flour, baking powder, and salt',
    h1: 'What can I use instead of self-rising flour?',
    beskrivelse: 'Colorado State, Texas A&M, and Nebraska extension all say all-purpose flour with baking powder and salt, but they give 1 1/4, 1 1/2, and 1 1/2 teaspoons of baking powder. See all three.',
    ingress: 'Self-rising flour is all-purpose flour with baking powder and salt mixed in. The extension sources do not agree on how much.',
    svar: `${N.csu}: 1 cup of all-purpose flour plus ${E('csu-bp')} of baking powder and ${E('csu-salt')} of salt. ${N.tamu}: ${E('tamu-bp')} of baking powder and ${E('tamu-salt')} of salt. ${N.unl}: ${E('unl-bp')} and ${E('unl-salt')}, with ${E('unl-minus')} less flour.`,
    steg: [['Start with all-purpose flour', 'One cup for each cup of self-rising.'], ['Add baking powder and salt', 'The amounts differ by source.'], ['Whisk it together', 'So the leavening spreads evenly.']],
    kilder: ['csu', 'tamu', 'unl'],
    beslektet: ['bakepulver', 'cake-flour', 'cornstarch', 'egg'],
    seksjoner: [
      ['Three sources, three versions', kortListe([
        ['Colorado State Extension', ['Ratio', `1 cup of all-purpose flour plus ${E('csu-bp')} of baking powder plus ${E('csu-salt')} of salt.`], ['What changes', 'Least baking powder of the three.']],
        ['Texas A&M AgriLife Extension', ['Ratio', `1 cup of all-purpose flour plus ${E('tamu-bp')} of baking powder plus ${E('tamu-salt')} of salt.`], ['What changes', 'Same salt as Colorado State, more baking powder.']],
        ['Nebraska Extension', ['Ratio', `1 cup minus ${E('unl-minus')} of all-purpose flour plus ${E('unl-bp')} of baking powder plus ${E('unl-salt')} of salt.`], ['What changes', 'Takes out a little flour and uses more salt than the other two.']],
      ])],
      ['Which one should I use?', p('We do not pick one. All three are extension sources, and they differ by a quarter teaspoon of baking powder and up to a quarter teaspoon of salt. If your recipe already has its own baking powder and salt, the recipe wins.')],
      ...app('Self-rising flour is one of those bags that gets bought once.'),
    ],
    faq: [
      ['How much baking powder goes in self-rising flour?', `${N.csu} says ${E('csu-bp')} per cup. AgriLife Extension and ${N.unl} say ${E('tamu-bp')}.`],
      ['How much salt?', `${N.csu} and AgriLife Extension say ${E('csu-salt')}. ${N.unl} says ${E('unl-salt')}.`],
      ['Do I take out some flour?', `Only ${N.unl} does: it takes out ${E('unl-minus')} per cup.`],
    ],
  }),

  maisenna: (T, E) => ({
    gruppe: 'Flour and thickeners', kort: 'Twice as much flour. Tapioca and arrowroot also work.', lenke: 'Cornstarch substitute',
    tittel: 'Cornstarch substitute for thickening: flour, tapioca, or arrowroot',
    h1: 'What can I use instead of cornstarch?',
    beskrivelse: 'Illinois, Colorado State, Nebraska, and Montana State extension all say 2 tablespoons of all-purpose flour for each tablespoon of cornstarch. Tapioca and arrowroot also work.',
    ingress: 'To thicken a sauce, use twice as much flour as cornstarch. Four extension sources agree on this ratio.',
    svar: `${N.ill} says to use ${E('mel')} of all-purpose flour for each ${E('maisenna')} of cornstarch. ${N.csu} also lists ${E('tapioka')} of granular tapioca or ${E('arrowrot')} of arrowroot.`,
    steg: [['Double the amount', 'Flour thickens about half as well.'], ['Or pick tapioca or arrowroot', 'Both are on the Colorado State list.'], ['Use it as a thickener', 'The sources name thickening only.']],
    kilder: ['ill', 'csu', 'msu', 'usu'],
    beslektet: ['cake-flour', 'self-rising-flour', 'powdered-sugar', 'honey'],
    seksjoner: [
      ['Replacements for one tablespoon of cornstarch', kortListe([
        ['All-purpose flour', ['Ratio', `${E('mel')} of all-purpose flour (${N.ill}, ${N.csu}, ${N.msu}).`], ['What changes', 'You use twice as much by volume.']],
        ['Granular tapioca', ['Ratio', `${N.csu}: ${E('tapioka')} of granular tapioca.`], ['What changes', 'The source gives no more detail.']],
        ['Arrowroot', ['Ratio', `${N.csu}: ${E('arrowrot')} of arrowroot.`], ['What changes', 'This one is a one-to-one swap.']],
      ])],
      ['And the other direction', p(`If a recipe calls for flour as a thickener and you have cornstarch, ${N.usu} says ${E('motsatt-mel')} of flour is ${E('motsatt')} of cornstarch, potato starch, rice starch, or arrowroot.`)],
      ...app('Cornstarch comes in a small box, and it is easy to run out of.'),
    ],
    faq: [
      ['How much flour replaces cornstarch?', `${E('mel')} of all-purpose flour for each ${E('maisenna')} of cornstarch, according to ${N.ill}.`],
      ['Can I use arrowroot?', `Yes. ${N.csu} lists ${E('arrowrot')} of arrowroot per tablespoon of cornstarch.`],
      ['Is it for baking too?', 'The sources say for thickening. They do not cover baking.'],
    ],
  }),

  'brun-farin': (T, E) => ({
    gruppe: 'Sugar and sweeteners', kort: 'White sugar, with or without a little molasses.', lenke: 'Brown sugar substitute',
    tittel: 'Brown sugar substitute: white sugar and molasses',
    h1: 'What can I use instead of brown sugar?',
    beskrivelse: 'Utah State says granulated sugar cup for cup. Colorado State, Montana State, and Texas A&M say white sugar plus molasses: 1/4 cup per cup, or 2 tablespoons per 1/2 cup.',
    ingress: 'White sugar replaces brown sugar. Add molasses if you want the flavor and moisture back.',
    svar: `${N.usu} says ${E('hvit')} of granulated sugar replaces 1 cup of firmly packed brown sugar. ${N.csu} adds ${E('melasse')} of unsulphured molasses to the cup of sugar.`,
    steg: [['Measure the sugar', 'White, granulated, same amount.'], ['Add molasses', `${E('melasse')} per cup, or ${E('halv-melasse')} per ${E('halv')}.`], ['Pack it down', 'Brown sugar is measured firmly packed.']],
    kilder: ['usu', 'csu', 'msu', 'tamu'],
    beslektet: ['powdered-sugar', 'honey', 'smor', 'cornstarch'],
    seksjoner: [
      ['Replacements for one cup', kortListe([
        ['Granulated sugar', ['Ratio', `${N.usu}: ${E('hvit')} of granulated sugar.`], ['What changes', 'You lose the molasses flavor and some moisture. The source says only that it substitutes.']],
        ['Granulated sugar and molasses', ['Ratio', `${N.csu}: ${E('melasse-kopp')} of granulated sugar plus ${E('melasse')} of unsulphured molasses.`], ['What changes', `${N.msu} and ${N.tamu} give the same ratio per half cup: ${E('halv')} of white sugar plus ${E('halv-melasse')} of molasses.`]],
        ['Liquid brown sugar', ['Ratio', `${N.csu}: ${E('flytende')} of liquid brown sugar.`], ['What changes', 'This is a smaller amount than the dry sugar.']],
      ])],
      ['Why the molasses matters', p(`${N.csu} warns that substitutions with an acid factor, such as molasses, need to be neutralized to avoid changes in the flavor and texture of the product. If your recipe has baking soda, the soda may already do that.`, `For weight, ${N.usu} gives 1 pound of brown sugar as ${E('pund')} firmly packed.`)],
      ...app('Brown sugar goes hard in the bag.'),
    ],
    faq: [
      ['Can I use white sugar instead of brown sugar?', `Yes. ${N.usu} lists ${E('hvit')} of granulated sugar per cup.`],
      ['How much molasses do I add?', `${N.csu} says ${E('melasse')} per cup. ${N.msu} and AgriLife Extension say ${E('halv-melasse')} per ${E('halv')} of sugar.`],
      ['How many cups is a pound of brown sugar?', `${N.usu}: ${E('pund')}, firmly packed.`],
    ],
  }),

  'powdered-sugar': (T, E) => ({
    gruppe: 'Sugar and sweeteners', kort: 'Granulated sugar with cornstarch, ground fine. Two sources, two amounts.', lenke: 'Powdered sugar substitute',
    tittel: 'Powdered sugar substitute: granulated sugar and cornstarch',
    h1: 'What can I use instead of powdered sugar?',
    beskrivelse: 'Nebraska Extension says 1 cup of granulated sugar plus 1 tablespoon of cornstarch, ground in a food processor. Texas A&M says 1 teaspoon. Colorado State has a smaller amount for uses other than baking.',
    ingress: 'You can make powdered sugar from granulated sugar and a little cornstarch. The sources disagree on how much cornstarch.',
    svar: `${N.unl} says to process ${E('unl-sukker')} of granulated sugar with ${E('unl-maisenna')} of cornstarch. ${N.tamu} says ${E('tamu-maisenna')}. Process it until it is well blended and powdery.`,
    steg: [['Measure the sugar', 'Granulated, one cup.'], ['Add cornstarch', 'One teaspoon or one tablespoon, by source.'], ['Grind it', 'A food processor with the metal blade, until powdery.']],
    kilder: ['unl', 'tamu', 'csu'],
    beslektet: ['brun-farin', 'cornstarch', 'honey', 'smor'],
    seksjoner: [
      ['Two versions of the same replacement', kortListe([
        ['Nebraska Extension', ['Ratio', `${E('unl-sukker')} of granulated sugar plus ${E('unl-maisenna')} of cornstarch.`], ['What changes', 'Process in a food processor until it is well blended and powdery.']],
        ['Texas A&M AgriLife Extension', ['Ratio', `${E('unl-sukker')} of granulated white sugar plus ${E('tamu-maisenna')} of cornstarch.`], ['What changes', 'Also processed in a food processor.']],
        ['Colorado State Extension', ['Ratio', `${E('csu')} of granulated sugar for 1 cup of powdered sugar, for uses other than baking.`], ['What changes', 'This is a plain sugar swap, not a ground one. The source limits it to uses other than baking.']],
      ])],
      ['The other direction', p(`${N.csu} says ${E('motsatt')} of confectioners sugar can stand in for 1 cup of granulated sugar, for uses other than baking.`)],
      ...app('Powdered sugar is something many people have only at holiday time.'),
    ],
    faq: [
      ['How do I make powdered sugar?', `${N.unl}: process ${E('unl-sukker')} of granulated sugar with ${E('unl-maisenna')} of cornstarch until it is well blended and powdery.`],
      ['Why do the sources differ?', `${N.unl} says ${E('unl-maisenna')} of cornstarch and AgriLife Extension says ${E('tamu-maisenna')}. We show both.`],
      ['Can I use plain granulated sugar?', `${N.csu} says ${E('csu')} per cup, for uses other than baking.`],
    ],
  }),

  honey: (T, E) => ({
    gruppe: 'Sugar and sweeteners', kort: 'Sugar and water or liquid, and what honey replaces in turn.', lenke: 'Honey substitute',
    tittel: 'Honey substitute: sugar and liquid',
    h1: 'What can I use instead of honey?',
    beskrivelse: 'Utah State and Colorado State extension say 1 1/4 cups of sugar plus 1/4 cup of liquid for 1 cup of honey. They also say how much honey replaces sugar, and what to cut back.',
    ingress: 'Sugar plus a little liquid replaces honey. If you want it the other way, there is a ratio for that too.',
    svar: `${N.usu} says ${E('sukker')} of sugar plus ${E('vann')} of water for 1 cup of honey. ${N.csu} says ${E('csu-sukker')} of sugar plus ${E('csu-vaeske')} of the liquid the recipe calls for.`,
    steg: [['Measure the sugar', 'One and a quarter cups.'], ['Add liquid', 'Water, or a liquid the recipe already has.'], ['Going the other way?', 'Use less honey and cut back the liquid.']],
    kilder: ['usu', 'csu'],
    beslektet: ['brun-farin', 'powdered-sugar', 'cornstarch', 'smor'],
    seksjoner: [
      ['Replacements for one cup of honey', kortListe([
        ['Sugar and water', ['Ratio', `${N.usu}: ${E('sukker')} of sugar plus ${E('vann')} of water.`], ['What changes', 'You lose the flavor of honey.']],
        ['Sugar and recipe liquid', ['Ratio', `${N.csu}: ${E('csu-sukker')} of sugar plus ${E('csu-vaeske')} of the liquid called for in the recipe.`], ['What changes', 'Same amounts, and the liquid comes from the recipe.']],
        ['Corn syrup', ['Ratio', `${N.csu}: ${E('sirup')} of honey replaces 1 cup of corn syrup, so the swap works both ways.`], ['What changes', 'The source gives no more detail.']],
      ])],
      ['When honey replaces sugar', p(`${N.csu} says ${E('som-sukker')} of honey replaces 1 cup of sugar. Reduce the liquid in the recipe by ${E('som-sukker-vaeske')} for every cup of honey, and add a pinch of baking soda to neutralize the acidity.`, `${N.usu} says ${E('usu-som-sukker')} of honey, with the liquid cut back by ${E('usu-vaeske')}, and ${E('soda')} of soda for each cup of honey in baked goods.`)],
      ...app('Honey jars last for years, but only if you know where they are.'),
    ],
    faq: [
      ['How much sugar replaces honey?', `${N.usu} and ${N.csu} both say ${E('sukker')}, plus ${E('vann')} of liquid, per cup of honey.`],
      ['How much honey replaces sugar?', `${N.usu} says ${E('usu-som-sukker')} of honey for 1 cup of sugar. ${N.csu} says ${E('som-sukker')}. The sources differ.`],
      ['Do I change the liquid?', `Yes. ${N.csu} says reduce it by ${E('som-sukker-vaeske')} per cup of honey. ${N.usu} says ${E('usu-vaeske')}.`],
    ],
  }),

  hvitvin: (T, E) => ({
    gruppe: 'Savory dishes', kort: 'Apple or white grape juice in equal amount, or water with lemon juice and sugar.', lenke: 'White wine substitute',
    tittel: 'White wine substitute for cooking',
    h1: 'What can I use instead of white wine?',
    beskrivelse: 'Nebraska Extension says apple juice or white grape juice in the same amount. NDSU Extension gives a mix of water, lemon juice, and sugar for 1 cup of wine.',
    ingress: 'Mild juices stand in for white wine in the same amount. NDSU also gives a mix that uses water and lemon juice.',
    svar: `${N.unl} says to use the same amount of apple juice or white grape juice. ${N.ndsu} gives ${E('ndsu-vann')} of water, ${E('ndsu-sitron')} of lemon juice, and ${E('ndsu-sukker')} of sugar for 1 cup of wine.`,
    steg: [['Pick juice or a mix', 'Apple, white grape, or water with lemon and sugar.'], ['Use the same amount', 'The ratio is one to one for juice.'], ['Taste as you go', 'The sources do not describe flavor.']],
    kilder: ['unl', 'ndsu'],
    beslektet: ['red-wine', 'lemon-juice', 'broth', 'garlic'],
    seksjoner: [
      ['Two replacements', kortListe([
        ['Apple or white grape juice', ['Ratio', `${N.unl}: the same amount as the wine.`], ['What changes', 'The source gives no taste notes.']],
        ['Water, lemon juice, and sugar', ['Ratio', `${N.ndsu}: ${E('ndsu-vann')} of water, ${E('ndsu-sitron')} of lemon juice, and ${E('ndsu-sukker')} of sugar for ${E('kopp')} of wine.`], ['What changes', 'This gives sweet and sour without the grape.']],
      ])],
      ['What the sources do not cover', p('The extension sources do not compare these swaps in specific dishes, and they do not cover vinegar or broth. Taste as you go, and see the pages on <a href="/en/substitutes/broth/">broth</a> and <a href="/en/substitutes/lemon-juice/">lemon juice</a>.')],
      ...app('Wine for cooking is often a half bottle that goes unused.'),
    ],
    faq: [
      ['Can I use apple juice instead of white wine?', `Yes. ${N.unl} says the same amount of apple juice or white grape juice.`],
      ['How much water and lemon juice?', `${N.ndsu}: ${E('ndsu-vann')} of water, ${E('ndsu-sitron')} of lemon juice, and ${E('ndsu-sukker')} of sugar per ${E('kopp')} of wine.`],
      ['Does it taste the same?', 'The sources do not say.'],
    ],
  }),

  'red-wine': (T, E) => ({
    gruppe: 'Savory dishes', kort: 'Grape or cranberry juice in equal amount.', lenke: 'Red wine substitute',
    tittel: 'Red wine substitute for cooking',
    h1: 'What can I use instead of red wine?',
    beskrivelse: 'Nebraska Extension says grape juice or cranberry juice in the same amount as the red wine. NDSU Extension gives a water, lemon juice, and sugar mix for 1 cup of wine in general.',
    ingress: 'Grape or cranberry juice takes the place of red wine in the same amount.',
    svar: `${N.unl} says to use the same amount of grape juice or cranberry juice. ${N.ndsu} lists a mix for wine in general: ${E('ndsu-vann')} of water, ${E('ndsu-sitron')} of lemon juice, and ${E('ndsu-sukker')} of sugar for ${E('kopp')}.`,
    steg: [['Choose the juice', 'Grape or cranberry.'], ['Match the amount', 'Same amount as the wine.'], ['Taste as you go', 'The sources do not describe flavor.']],
    kilder: ['unl', 'ndsu'],
    beslektet: ['hvitvin', 'broth', 'lemon-juice', 'garlic'],
    seksjoner: [
      ['What to use', kortListe([
        ['Grape juice or cranberry juice', ['Ratio', `${N.unl}: the same amount as the red wine.`], ['What changes', 'The source gives no taste notes.']],
        ['Water, lemon juice, and sugar', ['Ratio', `${N.ndsu}, for wine in general: ${E('ndsu-vann')} of water, ${E('ndsu-sitron')} of lemon juice, and ${E('ndsu-sukker')} of sugar for ${E('kopp')}.`], ['What changes', 'The source does not name red wine. It lists wine without a color.']],
      ])],
      ['What the sources do not cover', p('We found one extension source for red wine, and it gives no number beyond equal amounts. It does not say which dishes suit each juice, so this page does not either. White wine has its own page: <a href="/en/substitutes/white-wine/">white wine substitute</a>.')],
      ...app('Red wine is rarely finished in one evening.'),
    ],
    faq: [
      ['Can I use grape juice instead of red wine?', `Yes. ${N.unl} says the same amount of grape juice or cranberry juice.`],
      ['Is there a ratio for water and lemon?', `${N.ndsu} lists ${E('ndsu-vann')} of water, ${E('ndsu-sitron')} of lemon juice, and ${E('ndsu-sukker')} of sugar for ${E('kopp')} of wine, with no color named.`],
      ['Does it taste the same?', 'The sources do not say.'],
    ],
  }),

  'lemon-juice': (T, E) => ({
    gruppe: 'Savory dishes', kort: 'Vinegar, half the amount. Plus what one lemon gives.', lenke: 'Lemon juice substitute',
    tittel: 'Lemon juice substitute: vinegar',
    h1: 'What can I use instead of lemon juice?',
    beskrivelse: 'Utah State and Colorado State extension say 1/2 teaspoon of vinegar for 1 teaspoon of lemon juice. Colorado State also gives what one lemon yields, and a lemon extract swap for zest.',
    ingress: 'Vinegar replaces lemon juice, but you use half as much.',
    svar: `${N.usu} and ${N.csu} both say ${E('eddik')} of vinegar for ${E('sitron')} of lemon juice. One lemon gives ${T('en-sitron-min')} to ${E('en-sitron-maks')} of juice, says ${N.csu}.`,
    steg: [['Use half as much', 'Vinegar is sharper.'], ['Count your lemons', 'One lemon gives one to three tablespoons.'], ['Need zest?', 'Lemon extract, half the amount.']],
    kilder: ['usu', 'csu', 'unl'],
    beslektet: ['buttermilk', 'hvitvin', 'bakepulver', 'garlic'],
    seksjoner: [
      ['Replacements and yields', kortListe([
        ['Vinegar', ['Ratio', `${N.usu} and ${N.csu}: ${E('eddik')} of vinegar for ${E('sitron')} of lemon juice.`], ['What changes', 'You use half as much.']],
        ['One whole lemon', ['Ratio', `${N.csu}: ${T('en-sitron-min')} to ${E('en-sitron-maks')} of juice, plus ${T('skall-min')} to ${E('skall-maks')} of grated rind.`], ['What changes', 'Lemons vary in size, and the source gives a range.']],
        ['Lemon extract for grated zest', ['Ratio', `${N.unl}: ${E('ekstrakt')} of lemon extract for 1 teaspoon of fresh grated lemon peel.`], ['What changes', 'The source gives no more detail.']],
      ])],
      ['Lemon juice as a replacement', p(`Lemon juice also stands in for other things. ${N.csu} lists ${E('kremor')} of lemon juice or vinegar for 1/2 teaspoon of cream of tartar. See also the <a href="/en/substitutes/buttermilk/">buttermilk page</a>, where lemon juice makes milk sour.`)],
      ...app("It's easy to be out of lemons right when a recipe calls for one."),
    ],
    faq: [
      ['How much vinegar replaces lemon juice?', `${N.usu} and ${N.csu}: ${E('eddik')} of vinegar for ${E('sitron')} of lemon juice.`],
      ['How much juice is in one lemon?', `${N.csu} says ${T('en-sitron-min')} to ${E('en-sitron-maks')}.`],
      ['What replaces lemon zest?', `${N.unl} lists ${E('ekstrakt')} of lemon extract per teaspoon of zest.`],
    ],
  }),

  'friske-og-torkede-urter': (T, E) => ({
    gruppe: 'Savory dishes', kort: 'One tablespoon fresh is one teaspoon dried, or half a teaspoon ground.', lenke: 'Fresh vs. dried herbs',
    tittel: 'Fresh vs. dried herbs: how much to use',
    h1: 'How much dried herb equals fresh?',
    beskrivelse: 'Colorado State and Nebraska extension say 1 tablespoon of fresh herbs is 1 teaspoon of dried leaf herbs. Nebraska and Texas A&M say 1/2 teaspoon if the herb is ground. Plus parsley, mint, dill, and chives.',
    ingress: 'Dried herbs are stronger, so you use less. A tablespoon of fresh is about a teaspoon of dried.',
    svar: `${N.csu} says ${E('csu')} of fresh herbs equals ${E('csu-torket')} of dried herbs. ${N.unl} says ${E('unl-torket')} of dried leaf herbs, or ${E('unl-malt')} of ground dried herbs.`,
    steg: [['Is it leaf or ground?', 'Ground herbs are stronger still.'], ['Use a third of the amount', 'One tablespoon fresh, one teaspoon dried.'], ['Check the herb', 'A few have their own ratios.']],
    kilder: ['csu', 'unl', 'tamu'],
    beslektet: ['garlic', 'lemon-juice', 'broth', 'hvitvin'],
    seksjoner: [
      ['The general ratio', kortListe([
        ['Dried leaf herbs for fresh', ['Ratio', `${N.csu} and ${N.unl}: ${E('csu-torket')} of dried leaf herbs for ${E('csu')} of fresh herbs.`], ['What changes', 'Dried herbs are stronger.']],
        ['Ground dried herbs for fresh', ['Ratio', `${N.unl}: ${E('unl-malt')} of ground dried herbs for ${E('csu')} of fresh, finely cut. ${N.tamu} gives the same.`], ['What changes', 'Ground is the strongest form.']],
      ])],
      ['Herbs with their own ratios', kortListe([
        ['Parsley', ['Ratio', `${N.csu}: ${E('persille')} of parsley flakes for ${E('csu')} of fresh parsley.`], ['What changes', 'Same as the general ratio.']],
        ['Mint', ['Ratio', `${N.csu}: ${E('mynte-torket')} of dried mint for ${E('mynte')} of fresh chopped mint.`], ['What changes', 'A bigger gap than the general ratio.']],
        ['Dill', ['Ratio', `${N.csu}: ${E('dill')} of dill seed for 1 head of fresh dill.`], ['What changes', 'Seed, not leaf.']],
        ['Chives', ['Ratio', `${N.csu}: ${E('gressloek')} of green onion tops for ${E('gressloek')} of chives.`], ['What changes', 'A fresh swap, not a dried one.']],
      ])],
      ...app('Fresh herbs wilt in days. Dried ones last much longer.'),
    ],
    faq: [
      ['How much dried herb equals one tablespoon of fresh?', `${E('csu-torket')} of dried leaf herbs, says ${N.csu}.`],
      ['What if the dried herb is ground?', `${N.unl} and AgriLife Extension say ${E('unl-malt')}.`],
      ['Does it work for every herb?', `The general ratio is a starting point. ${N.csu} lists dried mint, dill, and chives separately.`],
    ],
  }),

  hvitlok: (T, E) => ({
    gruppe: 'Savory dishes', kort: 'One clove is 1/8 teaspoon of garlic powder.', lenke: 'Garlic substitute',
    tittel: 'Garlic powder instead of fresh garlic',
    h1: 'What can I use instead of a garlic clove?',
    beskrivelse: 'Colorado State, Nebraska, and Texas A&M extension all say 1/8 teaspoon of garlic powder for 1 small clove of garlic. Colorado State adds garlic salt, with less salt in the dish.',
    ingress: 'Three extension sources agree: a small clove of garlic is 1/8 teaspoon of garlic powder.',
    svar: `${N.csu}, ${N.unl}, and ${N.tamu} all say ${E('pulver')} of garlic powder for 1 small clove of garlic. ${N.csu} also says instant minced garlic works in that amount.`,
    steg: [['Count the cloves', 'The ratio is per small clove.'], ['Use the powder', 'One eighth of a teaspoon each.'], ['Garlic salt?', 'Cut the salt in the recipe.']],
    kilder: ['csu', 'unl', 'tamu'],
    beslektet: ['friske-og-torkede-urter', 'broth', 'hvitvin', 'lemon-juice'],
    seksjoner: [
      ['Replacements for one small clove', kortListe([
        ['Garlic powder', ['Ratio', `${E('pulver')} (${N.csu}, ${N.unl}, ${N.tamu}).`], ['What changes', 'The sources do not describe flavor.']],
        ['Instant minced garlic', ['Ratio', `${N.csu}: ${E('pulver')}, the same as the powder.`], ['What changes', 'The source gives no more detail.']],
        ['Garlic salt', ['Ratio', `${N.csu}: ${T('salt-min')} to ${E('salt-maks')} of garlic salt.`], ['What changes', 'Reduce the amount of salt called for in the recipe.']],
      ])],
      ['A note on small cloves', p('The ratio in all three sources is for a small clove. Cloves vary a lot in size, so a big clove may need more powder. The sources do not say how much more.')],
      ...app('Garlic bulbs sprout if they sit too long.'),
    ],
    faq: [
      ['How much garlic powder equals one clove?', `${E('pulver')}, according to ${N.csu}, ${N.unl}, and AgriLife Extension.`],
      ['Can I use garlic salt?', `${N.csu}: ${T('salt-min')} to ${E('salt-maks')} of garlic salt, and use less salt in the recipe.`],
      ['What about a large clove?', 'The sources give the ratio for a small clove only.'],
    ],
  }),

  broth: (T, E) => ({
    gruppe: 'Savory dishes', kort: 'A bouillon cube or a teaspoon of broth base in a cup of water.', lenke: 'Broth substitute',
    tittel: 'Broth substitute: bouillon cube or powdered broth base',
    h1: 'What can I use instead of broth?',
    beskrivelse: 'Colorado State and NDSU extension say 1 bouillon cube or 1 teaspoon of powdered broth base, dissolved in 1 cup of water, replaces 1 cup of beef or chicken broth.',
    ingress: 'Bouillon dissolved in water makes a cup of broth. Powdered broth base works the same way.',
    svar: `${N.csu} says ${E('kube')} or ${E('pulver')} of powdered broth base, dissolved in ${E('vann')} of water, replaces 1 cup of beef or chicken broth. ${N.ndsu} says to use boiling water.`,
    steg: [['Pick a cube or powder', 'One cube or one teaspoon.'], ['Dissolve it', 'In one cup of water.'], ['Use it like broth', 'The sources give beef and chicken.']],
    kilder: ['csu', 'ndsu'],
    beslektet: ['hvitvin', 'garlic', 'friske-og-torkede-urter', 'red-wine'],
    seksjoner: [
      ['Replacements for one cup of beef or chicken broth', kortListe([
        ['Bouillon cube', ['Ratio', `${N.csu}: ${E('kube')} dissolved in ${E('vann')} of water. ${N.ndsu} says boiling water.`], ['What changes', 'The source gives no taste notes.']],
        ['Powdered broth base', ['Ratio', `${N.csu}: ${E('pulver')} (1 envelope) dissolved in ${E('vann')} of water. ${N.ndsu}: ${E('ndsu-pulver')} in ${E('ndsu-vann')} of boiling water.`], ['What changes', 'Same ratio from both sources.']],
        ['Canned or homemade broth', ['Ratio', `${N.ndsu}: ${E('ndsu-hermetikk')} of canned or homemade chicken broth or stock, when the recipe lists stock base.`], ['What changes', 'This is the way back from the concentrate.']],
      ])],
      ['What the sources do not cover', p('The extension sources do not cover vegetable broth or how salty a bouillon cube is. If your recipe adds salt, taste before you do.')],
      ...app('A carton of broth often gets opened for one cup, and the rest gets forgotten.'),
    ],
    faq: [
      ['How much bouillon makes one cup of broth?', `${N.csu}: ${E('kube')}, or ${E('pulver')} of powdered broth base, in ${E('vann')} of water.`],
      ['Should the water be hot?', `${N.ndsu} says boiling water.`],
      ['Does this work for beef and chicken?', `Yes. Both sources list beef or chicken broth.`],
    ],
  }),

  vanilla: (T, E) => ({
    gruppe: 'Baking', kort: 'Half a vanilla bean is one tablespoon of extract.', lenke: 'Vanilla extract substitute',
    tittel: 'Vanilla extract substitute: vanilla bean',
    h1: 'What can I use instead of vanilla extract?',
    beskrivelse: 'Colorado State Extension says half a vanilla bean replaces 1 tablespoon of vanilla extract. NDSU Extension says a 1-inch piece of bean, split and simmered in the recipe liquid, replaces 1 teaspoon.',
    ingress: 'A vanilla bean replaces extract. The sources give two ratios, one per piece of bean.',
    svar: `${N.csu} says ${E('bonne')} of a vanilla bean equals ${E('ekstrakt')} of vanilla extract. ${N.ndsu} says a ${E('ndsu-bit')} piece of bean, split and simmered in the liquid of the recipe, equals ${E('ndsu-ekstrakt')}.`,
    steg: [['Split the bean', 'NDSU says to split it.'], ['Simmer it', 'In the liquid of the recipe.'], ['Use the ratio', 'Half a bean per tablespoon of extract.']],
    kilder: ['csu', 'ndsu'],
    beslektet: ['egg', 'brun-farin', 'honey', 'powdered-sugar'],
    seksjoner: [
      ['Two ratios for the bean', kortListe([
        ['Half a bean', ['Ratio', `${N.csu}: ${E('bonne')} of a vanilla bean for ${E('ekstrakt')} of vanilla extract.`], ['What changes', 'The source gives no more detail.']],
        ['A one-inch piece', ['Ratio', `${N.ndsu}: a ${E('ndsu-bit')} piece of vanilla bean, split and simmered in the liquid of the recipe, for ${E('ndsu-ekstrakt')} of vanilla extract.`], ['What changes', 'The bean goes in the liquid, so this works for sauces, custards, and other warm liquids.']],
      ])],
      ['What the sources do not cover', p('Both extension sources start from a vanilla bean. They do not give a swap for extract when you have neither bean nor extract, and they do not cover vanilla paste or imitation vanilla. This page does not guess.')],
      ...app('Vanilla beans dry out in the pantry if they are not sealed.'),
    ],
    faq: [
      ['How much vanilla bean replaces extract?', `${N.csu}: ${E('bonne')} of a bean for ${E('ekstrakt')} of extract.`],
      ['What does NDSU say?', `A ${E('ndsu-bit')} piece, split and simmered in the liquid of the recipe, for ${E('ndsu-ekstrakt')} of extract.`],
      ['What about vanilla paste?', 'The sources do not cover it, so we do not give a ratio.'],
    ],
  }),
};

// Samlesiden: grupper og tekst.
const RAKKEFOLGE = ['Baking', 'Dairy', 'Sugar and sweeteners', 'Flour and thickeners', 'Savory dishes'];

export const NAV = {
  lenke: 'All substitutes',
  innhold(sider) {
    const grupper = RAKKEFOLGE.map((g) => [g, sider.filter((s) => s.c.gruppe === g)]).filter(([, l]) => l.length);
    const navn = sider.slice(0, 8).map((s) => s.rad.navn.toLowerCase());
    return {
      tittel: 'Ingredient substitutes: what can I use instead?',
      h1: 'What can I use instead of ...?',
      beskrivelse: 'Out of buttermilk, eggs, baking powder, or brown sugar? Each page gives the swap and the ratio from a university extension service or King Arthur Baking, and what changes.',
      ingress: 'Missing something in the middle of a recipe? Here are the swaps we found sources for, with the ratio each source gives.',
      svar: `Pick the ingredient you are missing: ${og(navn)}, and more. Each page says what to use, in what ratio, and what changes. If a source does not give a number, we do not give one either.`,
      steg: [['Find the ingredient', 'Pick the one you are missing.'], ['Read the ratio', 'Every page names its source and year.'], ['Check your recipe', 'Some swaps only work with certain ingredients.']],
      seksjoner: [
        ['Pick the ingredient you are missing', grupper.map(([g, l]) => `<h3>${g}</h3>${l.map((s) => `<div class="scenario"><h3><a href="${s.href}">${s.rad.navn}</a></h3><p>${s.c.kort}</p></div>`).join('')}`).join('')],
        ['How these pages are made', ul([
          '<strong>Numbers with sources.</strong> Every ratio comes from a land-grant university extension service (Colorado State, Utah State, Nebraska, NDSU, Texas A&M, Illinois, Montana State) or King Arthur Baking, with a link and a year at the bottom of the page. If a source page has no date, the year shown is the year we accessed it.',
          '<strong>No source, no number.</strong> Where no source gives a ratio, the page says so instead of guessing. Some pages have few numbers for that reason.',
          '<strong>Where sources disagree, you see both.</strong> A few swaps have two different amounts in two sources. We show them side by side.',
          '<strong>No recipes, and no allergy or food safety advice.</strong> The pages say what can be swapped, not what is safe for you.',
        ])],
        ["See what's in your pantry", p('Add what you have to the <a href="/en/pantry-app/">pantry</a> in Matlyst and see what you can swap in before you start.')],
        ['Swap the ingredient in Matlyst', p('Open a recipe in the app and use <strong>Ask Matlyst</strong> to get a swap based on what you have. Ask Matlyst is a Pro feature, uses AI, and has a monthly quota, so read the result before you start.')],
      ],
      faq: [
        ['Why are some common swaps missing?', 'We only include swaps we found in a university extension source or King Arthur Baking. If the sources give no ratio, we do not give one.'],
        ['Are these pages free?', 'Yes. You do not need the app to use them.'],
        ['Can the app suggest a swap?', 'Yes, with Ask Matlyst, a Pro feature. It uses AI, so read the result.'],
      ],
    };
  },
};

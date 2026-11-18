// Enhetsomregnere på engelsk: én side per enhetspar (ml til dl, cups til ml, °F til °C osv.) pluss en hub.
// Hver side har en kalkulator (site.js), en tabell, formel, kjøkkennotat, en grunn til å bruke Matlyst og lenker til beslektede omregninger.
import { ENHETER, allePar, enheterFor, konverter, parSti, parSlug, tall } from './enheter.mjs';
import { animasjon, byggRik, skjerm } from './rik-sider.mjs';

const esc = (s) => String(s).replace(/&/gu, '&amp;').replace(/</gu, '&lt;').replace(/"/gu, '&quot;');
const p = (...ps) => ps.map((t) => `<p>${t}</p>`).join('');
const stor = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const N = (id) => ENHETER[id].en;
const gruppeIds = (g) => enheterFor('en').filter((id) => ENHETER[id].gruppe === g);

const VERDIER = {
  ml: [5, 10, 15, 25, 50, 75, 100, 150, 200, 250, 300, 500, 750, 1000], cl: [1, 2, 3, 5, 10, 15, 20, 25, 33, 50, 75, 100], dl: [0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 7.5, 10],
  l: [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 5, 10], tsp: [0.25, 0.5, 1, 1.5, 2, 3, 4], tbsp: [0.5, 1, 1.5, 2, 3, 4, 5, 6, 8], oz: [1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 32],
  cups: [0.25, 0.33, 0.5, 0.67, 0.75, 1, 1.5, 2, 2.5, 3, 4, 5, 8], pints: [0.5, 1, 2, 3, 4], quarts: [0.5, 1, 2, 3, 4], gallons: [0.25, 0.5, 1, 2, 3, 5],
  g: [5, 10, 25, 50, 100, 150, 200, 250, 500, 750, 1000], kg: [0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 5, 10], 'oz-vekt': [1, 2, 3, 4, 6, 8, 10, 12, 16, 24, 32], lb: [0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 4, 5, 10],
  mm: [1, 2, 5, 10, 15, 20, 25, 30], cm: [5, 10, 15, 18, 20, 22, 23, 24, 25, 26, 28, 30, 35], inches: [1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 13, 14],
  c: [100, 120, 140, 150, 160, 170, 180, 190, 200, 220, 230, 250], f: [250, 275, 300, 325, 350, 375, 400, 425, 450, 475, 500],
};

// Hvor enheten dukker opp (til generisk kjøkkennotat).
const BRUK = {
  ml: 'metric recipes, measuring jugs, and most recipes from outside the United States', cl: 'drinks, cocktails, and some European recipes', dl: 'Nordic and some European recipes, where a deciliter is a common everyday measure',
  l: 'stock, soup, milk, and anything cooked in a large pot', tsp: 'US recipes for spices, baking powder, extracts, and small amounts of anything', tbsp: 'US recipes for oil, sauces, butter, and flour',
  oz: 'US recipes for liquids, and on US drink and sauce packaging', cups: 'US recipes, which measure most ingredients by volume', pints: 'US recipes for cream, ice cream, and berries', quarts: 'US recipes for stock, soup, and dairy', gallons: 'US milk, water, and large batch cooking',
  g: 'metric recipes, kitchen scales, and nutrition labels', kg: 'metric recipes for meat, potatoes, flour, and bulk buying', 'oz-vekt': 'US recipes and packaging for meat, cheese, chocolate, and canned goods', lb: 'US recipes and grocery packaging for meat, produce, and flour',
  mm: 'dough thickness and fine cuts', cm: 'baking pans, dough thickness, and knife cuts in metric recipes', inches: 'US baking pan sizes and dough thickness',
  c: 'recipes and ovens outside the United States', f: 'US recipes and most US ovens',
};

// Håndskrevne notater for de mest brukte parene (nøkkel «fra>til»).
const NOTE = {
  'ml>dl': 'Deciliters are everyday kitchen units in Nordic recipes, so a recipe that asks for 2 dl of milk means 200 ml. Many measuring jugs show both, so you can read the dl mark directly.',
  'dl>ml': 'A recipe that asks for 3 dl is asking for 300 ml. If your measuring jug only has milliliters, multiply by 100 and pour to that line.',
  'cups>ml': 'American recipes measure by the cup, but a US cup is not the cup you may have in the cupboard. A US cup is 236.6 ml. Many cookbooks round it to 240 ml, which is why you see both numbers. For baking, weighing is more reliable than any volume.',
  'ml>cups': 'When a metric recipe is written in milliliters and you only own US measuring cups, divide by 236.6. 250 ml is a little more than one US cup.',
  'tbsp>ml': 'A US tablespoon is 14.8 ml, which most recipes round to 15 ml. In Australia a tablespoon is 20 ml, so check where a recipe comes from before you convert.',
  'ml>tbsp': 'Small liquid amounts in metric recipes become tablespoons in US recipes. 15 ml is about one US tablespoon.',
  'tsp>ml': 'A US teaspoon is 4.9 ml, which recipes round to 5 ml. Use a level measuring spoon, not the spoon from the cutlery drawer, whose size varies a lot.',
  'ml>tsp': 'Five milliliters is about one US teaspoon. For tiny amounts of spices and extracts, measure with spoons rather than a jug.',
  'oz>ml': 'This page converts fluid ounces, a measure of volume. A US fluid ounce is 29.57 ml. Ounces on a bag of flour or a block of cheese measure weight instead, so use the ounces to grams converter for those.',
  'ml>oz': 'Milliliters to US fluid ounces: divide by 29.57. 250 ml is about 8.5 fl oz. Fluid ounces measure volume, while ounces on packaged food measure weight.',
  'oz-vekt>g': 'An ounce of weight is 28.35 grams, so 4 oz is about 113 g and 8 oz is about 227 g. This is the number you need for butter, cheese, chocolate, and meat in American recipes.',
  'g>oz-vekt': 'Grams to ounces: divide by 28.35. 100 g is about 3.5 oz, and 250 g is about 8.8 oz. Use a kitchen scale when you can; it is more accurate than a measuring cup.',
  'lb>g': 'A pound is 453.6 grams. A recipe for one pound of ground beef needs about 450 g, which is the common pack size in metric stores.',
  'g>lb': 'Grams to pounds: divide by 453.6. 500 g is about 1.1 lb. Shops in countries that use pounds often sell 1 lb packs where metric shops sell 450 g or 500 g.',
  'lb>kg': 'A pound is 0.4536 kilograms. Two pounds is just over 900 g, which is why a 1 kg pack is a little more than 2 lb.',
  'kg>lb': 'Kilograms to pounds: multiply by 2.205. A 1.5 kg chicken is about 3.3 lb, which helps when a US recipe lists chicken by the pound.',
  'f>c': 'Most US ovens and recipes use Fahrenheit. 350°F is 177°C, which most metric recipes round to 180°C. Fan ovens often run about 20°C lower, so check your oven manual too.',
  'c>f': 'Celsius to Fahrenheit: multiply by 9/5 and add 32. 180°C is 356°F, which US recipes round to 350°F. Always preheat fully before you bake.',
  'gallons>l': 'A US gallon is 3.785 liters. A British (imperial) gallon is bigger, 4.546 liters, so a gallon in a British recipe is not the same as one in an American recipe.',
  'l>gallons': 'Liters to US gallons: divide by 3.785. A 4 liter pot holds a little more than one gallon.',
  'cups>dl': 'A US cup is 2.37 dl. Recipes often round to 2.4 dl. If a Nordic recipe says 2.5 dl, that is a bit more than a US cup, and for forgiving recipes like soup that difference does not matter.',
  'dl>cups': 'Deciliters to US cups: divide by 2.366. Three deciliters is about 1.27 cups, so for most recipes one and a quarter cups.',
  'oz>cups': 'A US cup holds 8 fluid ounces, so 16 fl oz is 2 cups. This is volume, not weight: a cup of flour weighs about 4 oz, not 8.',
  'cups>oz': 'One US cup is 8 fluid ounces. Use this for liquids. For dry ingredients, cups and ounces of weight are not interchangeable.',
  'tbsp>tsp': 'There are 3 teaspoons in 1 US tablespoon, which is the easiest way to scale a spice amount up or down.',
  'tsp>tbsp': 'Three teaspoons make one US tablespoon. Four teaspoons are one tablespoon plus one teaspoon.',
  'cups>tbsp': 'There are 16 US tablespoons in 1 US cup. So a quarter cup is 4 tablespoons and a third of a cup is just over 5.',
  'inches>cm': 'An inch is exactly 2.54 centimeters. A 9 inch cake pan is about 23 cm and an 8 inch pan is about 20 cm, the sizes most recipes call for.',
  'cm>inches': 'Centimeters to inches: divide by 2.54. A 20 cm pan is about 8 inches and a 30 cm pan is about 12 inches.',
};


const FEIL = {
  volum: ['Using a coffee mug as a cup. A mug is rarely the size of a measuring cup, while a US cup is 236.6 ml.', 'Mixing up fluid ounces and ounces of weight. Fluid ounces measure volume, ounces on a package measure weight.', 'Assuming a US pint, quart, or gallon equals the British one. The imperial versions are about 20 percent larger.', 'Rounding too early. Convert the whole recipe first, then round the final amounts.', 'Measuring dry ingredients in a liquid jug, which packs them and gives you too much.'],
  vekt: ['Treating ounces on the package as fluid ounces. Weight and volume are different measures.', 'Using a cup for flour and expecting the same grams every time. Scooping packs flour; spooning and leveling gives less.', 'Rounding a pound to 500 g when the recipe is sensitive, like bread. A pound is 454 g.', 'Forgetting to zero the scale after adding the bowl.', 'Converting one ingredient and not the others, so the ratios drift.'],
  lengde: ['Measuring a pan from the outside rim instead of the inside.', 'Swapping a 9 inch pan for a 20 cm pan without checking, which is a different area.', 'Forgetting that a deeper pan needs a longer bake.', 'Reading mm as cm when rolling dough.', 'Not rounding to a pan size you can actually buy.'],
  temperatur: ['Using the Celsius number on a Fahrenheit oven, which is far too cool.', 'Forgetting to lower the temperature for a fan oven.', 'Trusting the oven dial instead of a thermometer.', 'Opening the door too often, which drops the temperature fast.', 'Converting a recipe that gives a gas mark without checking your own oven.'],
};
const MENTAL = {
  volum: 'A quick estimate: a US cup is a little less than a quarter liter, and a liter is a little more than four cups. Use the calculator for anything you will pour into a bowl.',
  vekt: 'A quick estimate: a pound is a little less than half a kilo, and a kilo is a little more than two pounds. An ounce is about 28 grams.',
  lengde: 'A quick estimate: an inch is about two and a half centimeters, and a 9 inch pan is about 23 cm.',
  temperatur: 'A quick estimate: double the Celsius number and add 30 for a rough Fahrenheit figure. It gets less accurate as the temperature goes up, so use the calculator for baking.',
};

function regelTekst(fra, til) {
  const a = ENHETER[fra]; const b = ENHETER[til];
  if (a.gruppe === 'temperatur') return fra === 'f' ? 'subtract 32, then multiply by 5/9' : 'multiply by 9/5, then add 32';
  const x = a.f / b.f;
  if (x >= 1) return `multiply by ${tall(x)}`;
  const inv = b.f / a.f;
  const rundt = Math.abs(inv - Math.round(inv)) < 1e-9;
  return rundt ? `divide by ${tall(inv)}` : `multiply by ${tall(x)} (or divide by ${tall(inv)})`;
}

function skjema(fra, til) {
  const g = ENHETER[fra].gruppe;
  const ids = gruppeIds(g);
  const data = Object.fromEntries(ids.map((id) => [id, g === 'temperatur' ? 0 : ENHETER[id].f]));
  const opt = (valgt) => ids.map((id) => `<option value="${id}"${id === valgt ? ' selected' : ''}>${esc(N(id).fl)} (${esc(N(id).kort)})</option>`).join('');
  const svar = `1 ${N(fra).kort} = ${tall(konverter(1, fra, til))} ${N(til).kort}`;
  return `<form class="omregner" data-gruppe="${g}" onsubmit="return false"><div class="omregner-rad">`
    + `<label>Amount<input type="number" inputmode="decimal" step="any" value="1" data-felt="verdi"></label>`
    + `<label>From<select data-felt="fra">${opt(fra)}</select></label>`
    + `<button type="button" class="omregner-bytt" data-handling="bytt" aria-label="Swap units">⇄</button>`
    + `<label>To<select data-felt="til">${opt(til)}</select></label></div>`
    + `<p class="omregner-svar" role="status" aria-live="polite" data-felt="svar">${esc(svar)}</p>`
    + `<script type="application/json" class="omregner-data">${JSON.stringify({ f: data, t: g === 'temperatur' })}</script></form>`;
}

function tabell(fra, til) {
  const rader = (VERDIER[fra] ?? [1, 2, 5, 10]).map((v) => `<tr><td>${tall(v)} ${N(fra).kort}</td><td>${tall(konverter(v, fra, til))} ${N(til).kort}</td></tr>`).join('');
  return `<div class="table-wrap"><table><thead><tr><th>${esc(stor(N(fra).fl))}</th><th>${esc(stor(N(til).fl))}</th></tr></thead><tbody>${rader}</tbody></table></div>`;
}

function eksempler(fra, til) {
  const vals = (VERDIER[fra] ?? [1, 2, 5]).filter((v) => v >= 1).slice(1, 4);
  const lista = (vals.length ? vals : [1, 2, 5]).map((v) => `<li><strong>${tall(v)} ${N(fra).kort}</strong> = ${tall(konverter(v, fra, til))} ${N(til).kort}</li>`).join('');
  return `<ul>${lista}</ul>`;
}

const MAALETIPS = {
  volum: p('Use a liquid measuring jug for liquids and level dry measures for dry ingredients. Read a jug at eye level on a flat surface, and level spoons and cups with the back of a knife. US, UK, and Australian measures with the same name are not always the same size, so check where a recipe comes from.'),
  vekt: p('A kitchen scale beats any measuring cup, especially for flour and sugar. Set the bowl on the scale, zero it, and add the ingredient. If you only have cups, remember that a cup of flour and a cup of sugar do not weigh the same.'),
  lengde: p('Measure a pan across the top from inside edge to inside edge, not across the outside rim. A pan one size off changes baking time, so check the cake earlier if yours is larger than the recipe says.'),
  temperatur: p('Oven dials are often inaccurate. An inexpensive oven thermometer tells you the real temperature. Fan ovens cook hotter, so many recipes suggest lowering the temperature when you use one.'),
};

function relaterte(fra, til) {
  const par = allePar();
  const sammeFra = par.filter(([a, b]) => a === fra && b !== til).slice(0, 5);
  const sammeTil = par.filter(([a, b]) => b === til && a !== fra).slice(0, 5);
  const alle = [[til, fra], ...sammeFra, ...sammeTil];
  return `<ul class="omregner-liste">${alle.map(([a, b]) => `<li><a href="/en/${parSti(a, b)}">${esc(N(a).kort)} to ${esc(N(b).kort)}</a>: ${esc(N(a).fl)} to ${esc(N(b).fl)}</a></li>`.replace('</a></a>', '</a>')).join('')}</ul>`;
}

const MATLYST = p('Converting by hand gets old fast, especially when a whole recipe is in the wrong units. When you import a recipe into Matlyst, you choose how amounts are shown. With <strong>Units</strong> set to <strong>Metric</strong> in Settings, cups, ounces, and pounds from a US recipe are converted to milliliters and grams as you import it. Set it to <strong>US</strong> and Matlyst keeps the source amounts as written. The setting applies to new imports.')
  + '<ul><li><strong>Import once, no math.</strong> Share a recipe from Instagram, TikTok, or a website, and check the draft before you save.</li><li><strong>Scale the servings.</strong> Change from 1 to 20 servings and every amount scales with it. Scaling is linear, so check baking and spices yourself.</li><li><strong>One grocery list.</strong> Matching items are combined and sorted by store section.</li></ul>'
  + p('Matlyst is free to start, with 5 imports per calendar month. Read more about the <a href="/en/recipe-book-app/">recipe organizer app</a>, or see how the <a href="/en/shopping-list/">grocery list</a> works.');

export function sideForPar(fra, til) {
  const F = N(fra); const T = N(til);
  const x = konverter(1, fra, til);
  const svar = `1 ${F.kort} = ${tall(x)} ${T.kort}. To convert ${F.fl} to ${T.fl}, ${regelTekst(fra, til)}.`;
  const note = NOTE[`${fra}>${til}`] ?? `${stor(F.fl)} are used in ${BRUK[fra]}. ${stor(T.fl)} are used in ${BRUK[til]}. That is why you convert whenever a recipe is written for one system and your tools use the other.`;
  const rik = byggRik({
    svarTekst: svar,
    seksjoner: [
      [`${stor(F.fl)} to ${T.fl} calculator`, skjema(fra, til)],
      [`${F.kort} to ${T.kort} conversion chart`, p(`The numbers below are the ones recipes use most. Find your amount in the left column.`) + tabell(fra, til)],
      [`How to convert ${F.fl} to ${T.fl}`, p(`The rule: ${regelTekst(fra, til)}. In a formula: ${T.kort} = ${ENHETER[fra].gruppe === 'temperatur' ? (fra === 'f' ? '(°F − 32) × 5/9'.replace('−', '-') : '°C × 9/5 + 32') : `${F.kort} × ${tall(x)}`}.`) + p('Three quick examples:') + eksempler(fra, til)],
      [`Where recipes use ${F.fl} and ${T.fl}`, p(note)],
      ['Measuring tips', MAALETIPS[ENHETER[fra].gruppe] + p(MENTAL[ENHETER[fra].gruppe])],
      ['Common mistakes when converting', `<ul>${FEIL[ENHETER[fra].gruppe].map((t) => `<li>${t}</li>`).join('')}</ul>`],
      ['Converting a whole recipe', p(`When a recipe is written in ${F.fl} and you cook in ${T.fl}, convert every amount in one pass and keep the ratios the same. Write the new amounts next to the old ones so you can check your work. If you scale the recipe up or down as well, convert first and scale second, so you do not round twice.`) + p('Doing this for one recipe is fine. Doing it for a hundred saved recipes is why people use an app.')],
      ['Stop converting by hand', MATLYST + skjerm('matlyst-settings-units-language', 'Matlyst Settings with Units set to US and the language set to English.') + animasjon({ fil: 'matlyst-recipe-servings-scale-4-to-6.mp4', plakat: 'matlyst-recipe-servings-scale-4-to-6-poster.webp', bredde: 540, hoyde: 1174, tekst: 'A recipe scaled from 4 servings to 6 in Matlyst, with all amounts increasing.', bildetekst: 'Change the servings and every amount follows.' })],
      ['Related conversions', relaterte(fra, til)],
    ],
  }).html;
  const q = (a, b) => [a, b];
  const faq = [
    q(`How many ${T.fl} are in 1 ${F.en}?`, `1 ${F.en} is ${tall(x)} ${T.fl}.`),
    q(`How many ${F.fl} are in 1 ${T.en}?`, `1 ${T.en} is ${tall(konverter(1, til, fra))} ${F.fl}.`),
    q(`How do I convert ${F.kort} to ${T.kort} without a calculator?`, `${stor(regelTekst(fra, til))}. For example, ${tall((VERDIER[fra] ?? [2]).find((v) => v >= 2) ?? 2)} ${F.kort} is ${tall(konverter((VERDIER[fra] ?? [2]).find((v) => v >= 2) ?? 2, fra, til))} ${T.kort}.`),
    q(`Is this conversion exact?`, ENHETER[fra].gruppe === 'temperatur' ? 'The formula is exact. Recipes usually round to the nearest 5 degrees.' : 'The factor is exact, but recipes usually round it, for example 236.6 ml for a US cup to 240 ml. Use the rounded number only when the recipe is forgiving.'),
    q(`What is ${F.kort} to ${T.kort} used for in cooking?`, `${stor(F.fl)} are used in ${BRUK[fra]}. ${stor(T.fl)} are used in ${BRUK[til]}.`),
    q(`Can I convert ${T.kort} back to ${F.kort}?`, `Yes. Use the swap button in the calculator, or open the ${T.kort} to ${F.kort} page. 1 ${T.en} is ${tall(konverter(1, til, fra))} ${F.fl}.`),
    q('Does Matlyst convert units in recipes?', 'When you import a recipe, Matlyst shows the amounts in metric or keeps the source amounts, depending on the Units setting in Settings. With Metric, cups, ounces, and pounds are converted to milliliters and grams. The setting applies to new imports.'),
  ];
  return {
    title: `Convert ${F.kort} to ${T.kort}: ${F.fl} to ${T.fl}`,
    description: `Convert ${F.fl} to ${T.fl} with a free calculator. 1 ${F.kort} = ${tall(x)} ${T.kort}. Includes a conversion chart, the formula, and kitchen tips.`,
    eyebrow: 'Unit converter',
    h1: `${stor(F.fl)} to ${T.fl} (${F.kort} to ${T.kort})`,
    lead: `${stor(F.fl)} to ${T.fl}, with a chart, the formula, and what to watch for in a recipe.`,
    forst: 'Type an amount, pick the units, and read the answer.',
    stegTittel: `How to convert ${F.fl} to ${T.fl}`,
    steg: [['Enter the amount', `Type the number of ${F.fl}.`], ['Check the units', `Make sure From is ${F.fl} and To is ${T.fl}.`], ['Read the answer', `The result appears as you type: 1 ${F.kort} = ${tall(x)} ${T.kort}.`]],
    alternativ: '', grense: '', seksjoner: [], faqTittel: `${F.kort} to ${T.kort} questions`, rik, faq,
    cta: 'Convert recipes in Matlyst',
  };
}

export const enhetsSider = Object.fromEntries(allePar().map(([fra, til]) => [parSti(fra, til), sideForPar(fra, til)]));
export const enhetsStier = Object.keys(enhetsSider);
export { parSlug };

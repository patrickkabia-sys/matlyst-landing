// Hvilke varer den engelske utgaven av «dl til gram» (cups to grams) har, og hvilken post i USDA SR Legacy hver av dem er.
// Alle tall leses i datasettet (se hent-usda.mjs), aldri her. Denne fila sier bare HVILKEN post og HVILKEN porsjon.
//   id: samme id som på norsk der varen er den samme (gir hreflang), ellers egen engelsk id.
//   navn: overskriftsformen. ord: formen i en setning. variant: hva posten er («all-purpose flour»).
//   fdcId: FDC-ID i SR Legacy. basis: 'cup' (vanlig) eller 'tsp' (hevemidler, som bare har teskje hos USDA).
//   porsjon: modifikatoren som brukes som grunnlag, ordrett fra datasettet (mengden må være 1).
//   ogsa: én post til som står i «USDA entries» (tall med b_ foran, tekst.fdcId2 og tekst.usdaNavn2). Bare der postene har samme grunnlagstall.
// Ikke med: cake flour, almond flour, kosher salt, chia seeds og Greek yogurt (se planen og kandidatlista).

export const VARER_EN = Object.freeze([
  { id: 'hvetemel', slug: 'flour', navn: 'Flour', ord: 'flour', variant: 'all-purpose flour', fdcId: 168894, basis: 'cup', porsjon: 'cup' },
  { id: 'bread-flour', slug: 'bread-flour', navn: 'Bread flour', ord: 'bread flour', variant: 'bread flour', fdcId: 168896, basis: 'cup', porsjon: 'cup' },
  { id: 'sammalt-hvetemel', slug: 'whole-wheat-flour', navn: 'Whole wheat flour', ord: 'whole wheat flour', variant: 'whole wheat flour', fdcId: 168893, basis: 'cup', porsjon: 'cup' },
  { id: 'maisstivelse', slug: 'cornstarch', navn: 'Cornstarch', ord: 'cornstarch', variant: 'cornstarch', fdcId: 169698, basis: 'cup', porsjon: 'cup' },
  { id: 'cornmeal', slug: 'cornmeal', navn: 'Cornmeal (whole-grain yellow)', ord: 'cornmeal', variant: 'whole-grain yellow cornmeal', fdcId: 169697, basis: 'cup', porsjon: 'cup' },
  { id: 'sukker', slug: 'sugar', navn: 'Sugar', ord: 'sugar', variant: 'granulated sugar', fdcId: 169655, basis: 'cup', porsjon: 'cup' },
  { id: 'brunt-sukker', slug: 'brown-sugar', navn: 'Brown sugar', ord: 'brown sugar', variant: 'packed brown sugar', fdcId: 168833, basis: 'cup', porsjon: 'cup packed' },
  { id: 'melis', slug: 'powdered-sugar', navn: 'Powdered sugar', ord: 'powdered sugar', variant: 'unsifted powdered sugar', fdcId: 169656, basis: 'cup', porsjon: 'cup unsifted' },
  { id: 'honey', slug: 'honey', navn: 'Honey', ord: 'honey', variant: 'honey', fdcId: 169640, basis: 'cup', porsjon: 'cup' },
  { id: 'maple-syrup', slug: 'maple-syrup', navn: 'Maple syrup', ord: 'maple syrup', variant: 'maple syrup', fdcId: 169661, basis: 'cup', porsjon: 'cup' },
  { id: 'molasses', slug: 'molasses', navn: 'Molasses', ord: 'molasses', variant: 'molasses', fdcId: 168820, basis: 'cup', porsjon: 'cup' },
  { id: 'smor', slug: 'butter', navn: 'Butter', ord: 'butter', variant: 'salted butter', fdcId: 173410, basis: 'cup', porsjon: 'cup' },
  { id: 'olive-oil', slug: 'olive-oil', navn: 'Olive oil', ord: 'olive oil', variant: 'olive oil', fdcId: 171413, basis: 'cup', porsjon: 'cup' },
  { id: 'vegetable-oil', slug: 'vegetable-oil', navn: 'Vegetable oil (soybean)', ord: 'vegetable oil', variant: 'vegetable (soybean) oil', fdcId: 172370, basis: 'cup', porsjon: 'cup' },
  { id: 'shortening', slug: 'shortening', navn: 'Shortening', ord: 'shortening', variant: 'vegetable shortening', fdcId: 173584, basis: 'cup', porsjon: 'cup' },
  { id: 'melk', slug: 'milk', navn: 'Milk', ord: 'milk', variant: 'whole milk', fdcId: 171265, basis: 'cup', porsjon: 'cup' },
  { id: 'flote', slug: 'heavy-cream', navn: 'Heavy cream', ord: 'heavy cream', variant: 'heavy whipping cream', fdcId: 170859, basis: 'cup', porsjon: 'cup, fluid (yields 2 cups whipped)' },
  { id: 'romme', slug: 'sour-cream', navn: 'Sour cream', ord: 'sour cream', variant: 'sour cream', fdcId: 171257, basis: 'cup', porsjon: 'cup' },
  { id: 'yogurt', slug: 'yogurt', navn: 'Yogurt', ord: 'yogurt', variant: 'plain whole-milk yogurt', fdcId: 171284, basis: 'cup', porsjon: 'cup (8 fl oz)' },
  { id: 'cottage-cheese', slug: 'cottage-cheese', navn: 'Cottage cheese', ord: 'cottage cheese', variant: 'small-curd cottage cheese', fdcId: 172179, basis: 'cup', porsjon: 'cup, small curd (not packed)' },
  { id: 'cream-cheese', slug: 'cream-cheese', navn: 'Cream cheese', ord: 'cream cheese', variant: 'cream cheese', fdcId: 173418, basis: 'cup', porsjon: 'cup' },
  { id: 'shredded-cheddar', slug: 'shredded-cheddar', navn: 'Shredded cheddar', ord: 'shredded cheddar', variant: 'shredded cheddar cheese', fdcId: 173414, basis: 'cup', porsjon: 'cup, shredded' },
  { id: 'grated-parmesan', slug: 'grated-parmesan', navn: 'Grated parmesan', ord: 'grated parmesan', variant: 'grated parmesan cheese', fdcId: 171247, basis: 'cup', porsjon: 'cup' },
  { id: 'water', slug: 'water', navn: 'Water', ord: 'water', variant: 'water', fdcId: 174158, basis: 'cup', porsjon: 'cup' },
  { id: 'havregryn', slug: 'rolled-oats', navn: 'Rolled oats', ord: 'rolled oats', variant: 'rolled oats', fdcId: 173904, basis: 'cup', porsjon: 'cup' },
  // Hvit og brun ris har samme tall (185 g per cup) og er derfor én side; den brune posten står i «USDA entries» (b_-tall i datafila).
  { id: 'ris', slug: 'rice', navn: 'Rice', ord: 'rice', variant: 'uncooked long-grain white or brown rice', fdcId: 168877, basis: 'cup', porsjon: 'cup', ogsa: { fdcId: 169703, porsjon: 'cup' } },
  { id: 'quinoa', slug: 'quinoa', navn: 'Quinoa', ord: 'quinoa', variant: 'uncooked quinoa', fdcId: 168874, basis: 'cup', porsjon: 'cup' },
  { id: 'lentils', slug: 'lentils', navn: 'Lentils', ord: 'lentils', variant: 'uncooked lentils', fdcId: 172420, basis: 'cup', porsjon: 'cup' },
  { id: 'black-beans', slug: 'black-beans', navn: 'Black beans', ord: 'black beans', variant: 'dried black beans', fdcId: 173734, basis: 'cup', porsjon: 'cup' },
  { id: 'kakao', slug: 'cocoa-powder', navn: 'Cocoa powder', ord: 'cocoa powder', variant: 'unsweetened cocoa powder', fdcId: 169593, basis: 'cup', porsjon: 'cup' },
  { id: 'chocolate-chips', slug: 'chocolate-chips', navn: 'Chocolate chips', ord: 'chocolate chips', variant: 'semisweet chocolate chips', fdcId: 167976, basis: 'cup', porsjon: 'cup chips (6 oz package)' },
  { id: 'peanut-butter', slug: 'peanut-butter', navn: 'Peanut butter', ord: 'peanut butter', variant: 'smooth peanut butter', fdcId: 174294, basis: 'cup', porsjon: 'cup' },
  { id: 'salt', slug: 'salt', navn: 'Salt', ord: 'salt', variant: 'table salt', fdcId: 173468, basis: 'cup', porsjon: 'cup' },
  { id: 'baking-powder', slug: 'baking-powder', navn: 'Baking powder', ord: 'baking powder', variant: 'double-acting baking powder', fdcId: 172804, basis: 'tsp', porsjon: 'tsp' },
  { id: 'baking-soda', slug: 'baking-soda', navn: 'Baking soda', ord: 'baking soda', variant: 'baking soda', fdcId: 175040, basis: 'tsp', porsjon: 'tsp' },
  { id: 'active-dry-yeast', slug: 'active-dry-yeast', navn: 'Active dry yeast', ord: 'active dry yeast', variant: 'active dry yeast', fdcId: 175043, basis: 'tsp', porsjon: 'tsp' },
  { id: 'rosiner', slug: 'raisins', navn: 'Raisins', ord: 'raisins', variant: 'dark seedless raisins', fdcId: 168165, basis: 'cup', porsjon: 'cup (not packed)' },
  { id: 'walnuts', slug: 'walnuts', navn: 'Walnuts', ord: 'walnuts', variant: 'chopped walnuts', fdcId: 170187, basis: 'cup', porsjon: 'cup, chopped' },
  { id: 'mandler', slug: 'almonds', navn: 'Almonds', ord: 'almonds', variant: 'whole almonds', fdcId: 170567, basis: 'cup', porsjon: 'cup, whole' },
  { id: 'shredded-coconut', slug: 'shredded-coconut', navn: 'Sweetened shredded coconut', ord: 'shredded coconut', variant: 'sweetened shredded coconut', fdcId: 168586, basis: 'cup', porsjon: 'cup, shredded' },
  { id: 'breadcrumbs', slug: 'breadcrumbs', navn: 'Breadcrumbs', ord: 'breadcrumbs', variant: 'dry plain breadcrumbs', fdcId: 174928, basis: 'cup', porsjon: 'cup' },
  { id: 'mashed-banana', slug: 'mashed-banana', navn: 'Mashed banana', ord: 'mashed banana', variant: 'mashed banana', fdcId: 173944, basis: 'cup', porsjon: 'cup, mashed' },
  { id: 'blueberries', slug: 'blueberries', navn: 'Blueberries', ord: 'blueberries', variant: 'raw blueberries', fdcId: 171711, basis: 'cup', porsjon: 'cup' },
]);

// Text for the family «mengde per person» (en-US): one entry per food or dish, with the variants the calculator and the table use and the prose per page.
// Numbers are never written here: h.t(field) and its siblings read them from data.en.json, where each one carries a quote from the source (kildekontroll.mjs checks the quotes).
// Sources: USDA FSIS, university extension services (Iowa State, South Dakota State, Nebraska), the National Turkey Federation, Whole Foods Market, and others named on each page.
// Where sources disagree, the page shows both. No advice of our own on what is enough: the pages only restate what a named source says.
// Avoid these words in h2 headings: how much, portion, guests, scale, servings, list, store, shop, buy, plan, week, day, menu, cook, roast, heat, step, find, keep, recipes, swap:
// scripts/app-bevis.mjs matches them to app cards. The two app headings come from mal-en.mjs.

const V = (navn, ...deler) => ({ navn, deler });
const FEST = '/en/how-much-per-person/meat-for-a-party/';
const L = (slug, text) => [`/en/how-much-per-person/${slug}/`, text];

export const TEKST = {
  kalkun: {
    varianter: [V('Whole turkey', 'usda'), V('Seconds or leftovers', ['ntf-sek-min', 'ntf-sek-maks']), V('Whole Foods Market, bone weight included', 'wf')],
    tekst: (h) => ({
      title: 'How much turkey per person? Calculator and chart',
      h1: 'How much turkey per person?',
      description: `${h.k('fsisturkey')} says to allow ${h.t('usda')} of turkey per person. The National Turkey Federation says ${h.r('ntf-sek-min', 'ntf-sek-maks')} for seconds or leftovers. Calculator and chart for 2 to 12 adults.`,
      lead: `Allow ${h.t('usda')} of turkey per person, says ${h.k('fsisturkey')}. For seconds or leftovers, ${h.k('ntf')} says ${h.r('ntf-sek-min', 'ntf-sek-maks')}.`,
      svar: `<b>${h.t('usda')} of turkey per person.</b> That is the figure from ${h.k('fsisturkey')} for a whole turkey. With seconds or leftovers, ${h.k('ntf')} says ${h.r('ntf-sek-min', 'ntf-sek-maks')}.`,
      avsnitt: [
        ['What the sources say', p(`Five sources, one range. The calculator uses the USDA figure.`) + h.sprik([
          ['fsisturkey', 'Turkey per person', h.t('usda')],
          ['ntf', 'At least, uncooked', h.t('ntf')],
          ['sdsu', 'USDA recommendation, approximately', h.t('sdsu')],
          ['wf', 'Per person, bone weight included', h.t('wf')],
          ['isuholiday', 'Bone-in meats and turkey, per serving', h.r('isu-min', 'isu-maks')],
        ])],
        ['Turkey for seconds and extras', p(`${h.k('ntf')} says that for the guest who is always reaching for seconds, or if you want to count on leftovers, ${h.r('ntf-sek-min', 'ntf-sek-maks')} per person is a safe bet.`, `That is the second row of the calculator. Pick it from the menu above the numbers.`)],
        ['A bigger group', p(`${h.k('ntf')} says that for a group that needs more than ${h.t('ntf-to-fugler')} of turkey, you may want to use two smaller birds to help with even cooking.`, 'The same page suggests a bone-in or boneless breast next to a whole bird, to add white meat for a group that falls in between.')],
      ],
      faq: [
        ['How many pounds of turkey for 10 people?', `With the USDA figure of ${h.t('usda')} per person, 10 adults need ${h.sum('usda', 10)}. For seconds or leftovers, ${h.sumR('ntf-sek-min', 'ntf-sek-maks', 10)}.`],
        ['Does the pound figure include the bone?', `${h.k('wf')} says its ${h.t('wf')} per person includes bone weight. ${h.k('fsisturkey')} gives its figure for a whole turkey.`],
        ['Do kids count?', 'The calculator counts each kid as half an adult, because Iowa State Extension lists half the adult amount per child.'],
      ],
      soster: [['/en/cooking-times/turkey/', 'How long to cook a turkey'], L('thanksgiving-dinner', 'Thanksgiving dinner: how much of everything?'), L('stuffing', 'How much stuffing per person?'), L('mashed-potatoes', 'How much mashed potatoes per person?'), L('ham', 'How much ham per person?')],
    }),
  },

  ham: {
    varianter: [V('Boneless ham', ['uten-ben-min', 'uten-ben-maks']), V('Bone-in ham', ['med-ben-min', 'med-ben-maks'])],
    tekst: (h) => ({
      title: 'How much ham per person? Boneless and bone-in',
      h1: 'How much ham per person?',
      description: `${h.k('fsisham')} says ${h.r('uten-ben-min', 'uten-ben-maks')} per serving of boneless ham and ${h.r('med-ben-min', 'med-ben-maks')} for bone-in ham. Calculator and chart for 2 to 12 adults.`,
      lead: `For a boneless ham, ${h.k('fsisham')} says ${h.r('uten-ben-min', 'uten-ben-maks')} per serving. For a bone-in ham, ${h.r('med-ben-min', 'med-ben-maks')}.`,
      svar: `<b>Boneless ham: ${h.r('uten-ben-min', 'uten-ben-maks')} per person. Bone-in ham: ${h.r('med-ben-min', 'med-ben-maks')}.</b> The USDA and South Dakota State Extension give the same ranges.`,
      avsnitt: [
        ['Two sources, the same numbers', p('The USDA Food Safety and Inspection Service and South Dakota State University Extension agree. The calculator uses the USDA figures.') + h.sprik([
          ['fsisham', 'Boneless ham, per serving', h.r('uten-ben-min', 'uten-ben-maks')],
          ['fsisham', 'Bone-in ham, per serving', h.r('med-ben-min', 'med-ben-maks')],
          ['sdsu', 'Boneless ham, per person', h.r('sdsu-uten-min', 'sdsu-uten-maks')],
          ['sdsu', 'Bone-in ham, per person', h.r('sdsu-med-min', 'sdsu-med-maks')],
        ])],
        ['Why ham needs less than turkey', p(`${h.k('sdsu')} explains that the amount per person is significantly less than turkey because ham has already been cooked, and it will not lose as much weight when you reheat it. Bone-in ham goes up by the weight of the bone.`)],
      ],
      faq: [
        ['How much bone-in ham for 12 people?', `${h.sumR('med-ben-min', 'med-ben-maks', 12)}, using ${h.k('fsisham')}.`],
        ['How much boneless ham for 8 people?', `${h.sumR('uten-ben-min', 'uten-ben-maks', 8)}, using ${h.k('fsisham')}.`],
        ['Why is the bone-in number higher?', `${h.k('sdsu')} says the serving goes up to account for the weight of the bone.`],
      ],
      soster: [L('turkey', 'How much turkey per person?'), L('thanksgiving-dinner', 'Thanksgiving dinner: how much of everything?'), L('prime-rib', 'How much prime rib per person?')],
    }),
  },

  'prime-rib': {
    varianter: [V('Boneless prime rib', ['uten-ben-min', 'uten-ben-maks']), V('Bone-in prime rib', 'ribbe'), V('Cooked beef serving (Beef Checkoff)', 'biwfd-porsjon')],
    tekst: (h) => ({
      title: 'How much prime rib per person? Bone-in and boneless',
      h1: 'How much prime rib per person?',
      description: `${h.k('sdsu')} says ${h.t('ribbe')} for bone-in prime rib and ${h.r('uten-ben-min', 'uten-ben-maks')} per person for boneless. Calculator and chart for 2 to 12 adults.`,
      lead: `For a bone-in prime rib, ${h.k('sdsu')} says ${h.t('ribbe')}. For a boneless prime rib, plan on ${h.r('uten-ben-min', 'uten-ben-maks')} per person.`,
      svar: `<b>Bone-in: ${h.t('ribbe')}. Boneless: ${h.r('uten-ben-min', 'uten-ben-maks')} per person.</b> The Beef Checkoff gives the same rib rule, and sizes its charts for ${h.t('biwfd-porsjon')} of cooked beef per person.`,
      avsnitt: [
        ['What the sources say', p('Two sources agree on the rib rule. The calculator uses South Dakota State Extension.') + h.sprik([
          ['sdsu', 'Bone-in prime rib', h.t('ribbe')],
          ['biwfd', 'Bone-in roast', h.t('biwfd-ribbe')],
          ['sdsu', 'Boneless prime rib, per person', h.r('uten-ben-min', 'uten-ben-maks')],
          ['biwfd', 'Cooked beef serving the chart is built on', h.t('biwfd-porsjon')],
        ])],
        ['Why the chart gives a smaller number', p(`${h.k('biwfd')} says each recommendation in its chart gives an approximate ${h.t('biwfd-porsjon')} serving of cooked beef per person, and that you may want a larger roast if you want second helpings or leftovers.`, `${h.k('sdsu')} gives ${h.r('uten-ben-min', 'uten-ben-maks')} for a boneless roast, which is a purchase weight before cooking.`)],
      ],
      faq: [
        ['How many ribs for 8 people?', `${h.k('sdsu')} says ${h.t('ribbe')}, so 8 adults need ${h.sum('ribbe', 8)}.`],
        ['How much boneless prime rib for 6 people?', `${h.sumR('uten-ben-min', 'uten-ben-maks', 6)}, using ${h.k('sdsu')}.`],
        ['Does the Beef Checkoff agree?', `On the rib rule, yes: ${h.t('biwfd-ribbe')}.`],
      ],
      soster: [L('ham', 'How much ham per person?'), L('turkey', 'How much turkey per person?'), L('thanksgiving-dinner', 'Thanksgiving dinner: how much of everything?')],
    }),
  },

  kylling: {
    varianter: [V('Bone-in chicken', ['ben-min', 'ben-maks']), V('Any protein at a party', ['fest-min', 'fest-maks'])],
    tekst: (h) => ({
      title: 'How much chicken per person? Bone-in and party amounts',
      h1: 'How much chicken per person?',
      description: `${h.k('isuholiday')} lists ${h.r('ben-min', 'ben-maks')} per serving for bone-in meats and poultry. For a party, ${h.k('isugrad')} lists ${h.r('fest-min', 'fest-maks')} of protein. Calculator and chart.`,
      lead: `Iowa State Extension lists ${h.r('ben-min', 'ben-maks')} per serving for bone-in meats such as poultry. At a party, its table lists ${h.r('fest-min', 'fest-maks')} of protein per person.`,
      svar: `<b>${h.r('ben-min', 'ben-maks')} of bone-in chicken per person</b> for a sit-down meal, says ${h.k('isuholiday')}. For a party, ${h.k('isugrad')} lists ${h.r('fest-min', 'fest-maks')} of any protein per person.`,
      avsnitt: [
        ['What the sources say', p('We found no extension source that names chicken by itself. Iowa State Extension groups poultry with other bony meats, and lists party protein without naming a meat. The page says exactly that.') + h.sprik([
          ['isuholiday', 'Bone-in meats and poultry, per serving', h.r('ben-min', 'ben-maks')],
          ['isugrad', 'Protein at a party, per person', h.r('fest-min', 'fest-maks')],
        ])],
        ['Where the bone-in figure comes from', p(`${h.k('isuholiday')} sorts meats by how much bone they have. Poultry sits with short ribs, spare ribs, shanks, and hocks, at ${h.r('ben-min', 'ben-maks')} per serving. Boneless cuts and ground meat get a smaller figure.`)],
      ],
      faq: [
        ['How much chicken for 10 adults?', `For a sit-down meal, ${h.sumR('ben-min', 'ben-maks', 10)} of bone-in chicken, using ${h.k('isuholiday')}.`],
        ['How much chicken for a party?', `${h.k('isugrad')} lists ${h.r('fest-min', 'fest-maks')} of protein per person. For 10 adults that is ${h.sumR('fest-min', 'fest-maks', 10)}.`],
        ['Is this the cooked or raw weight?', 'The sources say per serving or per person and do not state whether the weight is cooked or raw.'],
      ],
      soster: [L('turkey', 'How much turkey per person?'), L('meat-for-a-party', 'How much meat per person for a party?'), L('rice', 'How much rice per person?')],
    }),
  },

  'mashed-potatoes': {
    varianter: [V('Raw potatoes for mashed potatoes', 'rå'), V('Mashed potatoes, ready to serve', 'ferdig'), V('Potatoes as a side (Iowa State)', 'isu'), V('Raw potatoes for 1/2 cup servings (Idaho Potato Commission)', 'ipc')],
    tekst: (h) => ({
      title: 'How much mashed potatoes per person? Pounds and cups',
      h1: 'How much mashed potatoes per person?',
      description: `${h.k('wf')} says to buy ${h.t('rå')} of potatoes per person for mashed potatoes, or ${h.t('ferdig')} ready to serve. Calculator and chart for 2 to 12 adults.`,
      lead: `For mashed potatoes, ${h.k('wf')} says to buy ${h.t('rå')} of potatoes per guest. Ready to serve, it lists ${h.t('ferdig')} of potatoes or starch per person.`,
      svar: `<b>Buy ${h.t('rå')} of raw potatoes per person.</b> Ready to serve, plan on ${h.t('ferdig')} each. Iowa State Extension lists ${h.t('isu')} of potatoes per serving.`,
      avsnitt: [
        ['What the sources say', p('Three sources give three kinds of number: raw weight, cooked volume, and a serving weight. The calculator starts with the raw weight.') + h.sprik([
          ['wf', 'Raw potatoes for mashed potatoes, per guest', h.t('rå')],
          ['wf', 'Potatoes or starch, ready to serve', h.t('ferdig')],
          ['isuholiday', 'Potatoes, per serving', h.t('isu')],
          ['ipc', 'Raw potatoes for 100 half-cup servings', `${h.n('ipc')} lb`],
        ])],
        ['Raw weight and what you get', p(`${h.k('ipc')} says that 100 servings of 1/2 cup need ${h.n('ipc')} pounds of potatoes. The calculator divides that by 100 to give the amount for one half-cup serving.`, 'Whole Foods Market lists a bigger serving of potatoes at a holiday dinner.')],
      ],
      faq: [
        ['How many pounds of potatoes for 12 people?', `Using ${h.k('wf')}, 12 adults need ${h.sum('rå', 12)} of raw potatoes for mashed potatoes.`],
        ['How many cups of mashed potatoes for 8 people?', `${h.k('wf')} lists ${h.t('ferdig')} per person, so ${h.sum('ferdig', 8)} for 8 adults.`],
        ['Do the sources agree?', 'They measure different things: raw pounds, cooked cups, and a serving weight. The table shows each one.'],
      ],
      soster: [L('thanksgiving-dinner', 'Thanksgiving dinner: how much of everything?'), L('turkey', 'How much turkey per person?'), L('stuffing', 'How much stuffing per person?'), L('potato-salad', 'How much potato salad per person?')],
    }),
  },

  'potato-salad': {
    varianter: [V('Finished potato salad (Iowa State)', ['ferdig-min', 'ferdig-maks']), V('Any side dish at a party', ['side-min', 'side-maks']), V('Raw potatoes (Idaho Potato Commission)', 'ipc'), V('Raw potatoes with other sides (Idaho Potato Commission)', ['ipc-andre-min', 'ipc-andre-maks'])],
    tekst: (h) => ({
      title: 'How much potato salad per person? Pounds for a crowd',
      h1: 'How much potato salad per person?',
      description: `${h.k('isugrad')} says ${h.r('ferdig-min', 'ferdig-maks')} of finished potato salad for 50 people. The Idaho Potato Commission says ${h.t('ipc')} of potatoes for 100 half-cup servings.`,
      lead: `For 50 people, ${h.k('isugrad')} lists ${h.r('ferdig-min', 'ferdig-maks')} of finished potato salad. The calculator turns that into an amount per person.`,
      svar: `<b>${h.r('ferdig-min', 'ferdig-maks')} of finished potato salad for 50 people</b>, which is ${h.sumR('ferdig-min', 'ferdig-maks', 4)} for 4 adults. Raw, the Idaho Potato Commission says ${h.t('ipc')} for 100 half-cup servings.`,
      avsnitt: [
        ['What the sources say', p('Two kinds of number: finished salad for a party, and raw potatoes for half-cup servings.') + h.sprik([
          ['isugrad', 'Finished potato salad for 50 people', h.r('ferdig-min', 'ferdig-maks')],
          ['isugrad', 'Any side dish, per person', h.r('side-min', 'side-maks')],
          ['ipc', 'Raw potatoes for 100 half-cup servings', h.t('ipc')],
          ['ipc', 'Raw potatoes for 100 servings, with other sides', h.r('ipc-andre-min', 'ipc-andre-maks')],
        ])],
        ['When there are other sides', p(`The Idaho Potato Commission says that if the group has other choices for sides, you can get by with ${h.r('ipc-andre-min', 'ipc-andre-maks')} of raw potatoes for 100 servings, instead of the full ${h.t('ipc')}.`)],
      ],
      faq: [
        ['How much potato salad for 50 people?', `${h.k('isugrad')} lists ${h.r('ferdig-min', 'ferdig-maks')} of finished salad.`],
        ['How many pounds of potatoes for 100 people?', `${h.k('ipc')} says ${h.t('ipc')} for 100 half-cup servings.`],
        ['How much for a smaller group?', 'The calculator divides the source figure by the number of people and multiplies by yours.'],
      ],
      soster: [L('mashed-potatoes', 'How much mashed potatoes per person?'), L('vegetables', 'How much vegetables per person?'), L('burgers', 'How much ground beef for burgers?')],
    }),
  },

  stuffing: {
    varianter: [V('Stuffing baked in a casserole', 'kasserolle'), V('Whole Foods Market', 'wf')],
    tekst: (h) => ({
      title: 'How much stuffing per person? Cups and bird size',
      h1: 'How much stuffing per person?',
      description: `${h.k('fsisstuff')} says at least ${h.t('kasserolle')} of stuffing per person when baked in a casserole. Whole Foods Market says ${h.t('wf')}. Chart for a turkey by weight.`,
      lead: `For stuffing baked in a casserole, ${h.k('fsisstuff')} says at least ${h.t('kasserolle')} per person. ${h.k('wf')} lists ${h.t('wf')}.`,
      svar: `<b>At least ${h.t('kasserolle')} of stuffing per person.</b> That is the USDA figure for a casserole. Whole Foods Market lists ${h.t('wf')}. Stuffing a bird? See the chart by turkey weight below.`,
      avsnitt: [
        ['What the sources say', p('Two sources, two figures. The calculator starts with the USDA figure.') + h.sprik([
          ['fsisstuff', 'Stuffing baked in a casserole, at least', h.t('kasserolle')],
          ['fsisstuff', 'Stuffing for a small cut of meat, per serving', h.t('liten-bit')],
          ['wf', 'Stuffing, per person', h.t('wf')],
        ])],
        ['Stuffing inside a bird', p(`${h.k('fsisstuff')} says that when stuffing whole poultry, allow about ${h.r('fugl-min', 'fugl-maks')} of prepared stuffing per pound of raw poultry. Its chart by weight of the whole bird:`) + chart(h)],
      ],
      faq: [
        ['How much stuffing for 12 people?', `Using ${h.k('fsisstuff')}, at least ${h.sum('kasserolle', 12)}. Using ${h.k('wf')}, ${h.sum('wf', 12)}.`],
        ['How much stuffing goes in a 16-pound turkey?', `${h.k('fsisstuff')} lists ${h.r('fugl-16-min', 'fugl-16-maks')} for a bird of 16 to 20 pounds.`],
        ['Is this the cooked or the prepared amount?', `The USDA figures are for prepared stuffing, which is the stuffing mixed and ready to bake.`],
      ],
      soster: [L('turkey', 'How much turkey per person?'), L('thanksgiving-dinner', 'Thanksgiving dinner: how much of everything?'), L('mashed-potatoes', 'How much mashed potatoes per person?')],
    }),
  },

  ris: {
    varianter: [V('White or brown rice, cooked', 'hvit'), V('Basmati, jasmine, or quinoa, cooked', 'basmati'), V('Grain side at a holiday meal', 'isu')],
    tekst: (h) => ({
      title: 'How much rice per person? Cooked cups for adults and kids',
      h1: 'How much rice per person?',
      description: `${h.k('success')} says an adult serving of white or brown rice is ${h.t('hvit')} cooked, and ${h.t('basmati')} for basmati, jasmine, and quinoa. Calculator and chart for 2 to 12 adults.`,
      lead: `An adult serving of white or brown rice is ${h.t('hvit')} cooked, says ${h.k('success')}. For basmati, jasmine, and quinoa it is ${h.t('basmati')}.`,
      svar: `<b>${h.t('hvit')} of cooked white or brown rice per adult.</b> ${h.t('basmati')} for basmati, jasmine, and quinoa. Iowa State Extension lists ${h.t('isu')} of grain per serving at a holiday meal.`,
      avsnitt: [
        ['What the sources say', p('The numbers here are for cooked rice, except the Iowa State figure, where the source does not say.') + h.sprik([
          ['success', 'White or brown rice, adult serving', h.t('hvit')],
          ['success', 'Basmati, jasmine, quinoa, adult serving', h.t('basmati')],
          ['isuholiday', 'Grain, per serving', h.t('isu')],
        ])],
        ['Amounts for children', p(`${h.k('success')} lists these cooked amounts for children: ${h.t('barn-liten')} for toddlers, ${h.t('barn-4')} for ages 4 to 6, and ${h.t('barn-7')} for ages 7 to 10.`, 'The calculator counts each kid as half an adult, which is the Iowa State figure for all foods.')],
      ],
      faq: [
        ['How much rice for 6 adults?', `${h.sum('hvit', 6)} of cooked white or brown rice, using ${h.k('success')}.`],
        ['Is this cooked or dry rice?', `${h.k('success')} gives its figures as cooked rice.`],
        ['Why are basmati and jasmine smaller?', `The source lists ${h.t('basmati')} for them and does not explain why.`],
      ],
      soster: [L('pasta', 'How much pasta per person?'), L('chicken', 'How much chicken per person?'), L('vegetables', 'How much vegetables per person?')],
    }),
  },

  pasta: {
    varianter: [V('Dry pasta', 'tørr'), V('Cooked pasta', 'kokt')],
    tekst: (h) => ({
      title: 'How much pasta per person? Dry ounces and cooked cups',
      h1: 'How much pasta per person?',
      description: `${h.k('isupasta')} says ${h.t('tørr')} of dry pasta per person, which gives about ${h.t('kokt')} cooked. A pound is right for ${h.n('pund-folk')} people. Calculator and chart.`,
      lead: `Iowa State Extension, citing the USDA, says ${h.t('tørr')} of dry pasta per person. That gives about ${h.t('kokt')} of cooked pasta.`,
      svar: `<b>${h.t('tørr')} of dry pasta per person</b>, which is about ${h.t('kokt')} cooked. A pound of dry pasta is about right for ${h.n('pund-folk')} people.`,
      avsnitt: [
        ['What the sources say', p('Two sources describe the same serving from two sides: dry weight and cooked volume.') + h.sprik([
          ['isupasta', 'Dry pasta per person', h.t('tørr')],
          ['isupasta', 'Cooked pasta from that serving', h.t('kokt')],
          ['isupasta', 'Dry pasta, a one pound box', `${h.n('pund-folk')} people`],
          ['unl', 'Dry shapes such as spaghetti, penne, rotini', `${h.t('unl-oz')} dry gives about ${h.t('unl-kopp')} cooked`],
          ['unl', 'Egg noodles', `${h.t('unl-egg-oz')} dry gives about ${h.t('unl-egg-kopp')} cooked`],
        ])],
        ['Dry ounces to cups', p(`${h.k('unl')} cites the National Pasta Association: ${h.t('unl-oz')} of uncooked elbow macaroni, shells, rotini, spaghetti, linguine, and similar shapes all give about ${h.t('unl-kopp')} of cooked pasta. For egg noodles, ${h.t('unl-egg-oz')} uncooked gives about ${h.t('unl-egg-kopp')} cooked.`)],
      ],
      faq: [
        ['How much pasta for 8 people?', `${h.k('isupasta')} says a pound is about right. By the ounce, ${h.sum('tørr', 8)}.`],
        ['How many cups of cooked pasta per person?', `About ${h.t('kokt')}, according to ${h.k('isupasta')}.`],
        ['Is the serving the same for every shape?', `The sources give ${h.t('tørr')} dry, and Iowa State Extension says how to measure it by shape.`],
      ],
      soster: [L('rice', 'How much rice per person?'), L('salad', 'How much salad per person?'), L('meat-for-a-party', 'How much meat per person for a party?')],
    }),
  },

  salat: {
    varianter: [V('Salad (Whole Foods Market)', 'wf'), V('Salad or soup (Iowa State)', 'isu')],
    tekst: (h) => ({
      title: 'How much salad per person? Cups for a dinner',
      h1: 'How much salad per person?',
      description: `${h.k('wf')} lists ${h.t('wf')} of salad per person at a holiday dinner. ${h.k('isuholiday')} lists ${h.t('isu')} of salad or soup. Calculator and chart for 2 to 12 adults.`,
      lead: `${h.k('wf')} lists ${h.t('wf')} of salad per person. Iowa State Extension lists ${h.t('isu')} of salads or soups.`,
      svar: `<b>${h.t('wf')} of salad per person</b> at a big dinner, says ${h.k('wf')}. Iowa State Extension lists ${h.t('isu')} of salad or soup per person.`,
      avsnitt: [
        ['What the sources say', p('The two sources differ by a factor of two. The calculator starts with Whole Foods Market, and you can switch.') + h.sprik([
          ['wf', 'Salad, per person', h.t('wf')],
          ['isuholiday', 'Salads or soups, per person', h.t('isu')],
          ['wf', 'Soup, per person', h.t('wf-suppe')],
        ])],
        ['Why they differ', p('Whole Foods Market gives a figure for a holiday spread with many dishes, and counts salad as one of them. Iowa State Extension groups salads and soups together, so one cup covers either. Neither source says more than that.')],
      ],
      faq: [
        ['How much salad for 8 people?', `${h.sum('wf', 8)} using ${h.k('wf')}, or ${h.sum('isu', 8)} using ${h.k('isuholiday')}.`],
        ['How much soup per person?', `${h.k('wf')} lists ${h.t('wf-suppe')}.`],
        ['Is it dressed or undressed?', 'The sources do not say.'],
      ],
      soster: [L('vegetables', 'How much vegetables per person?'), L('pasta', 'How much pasta per person?'), L('thanksgiving-dinner', 'Thanksgiving dinner: how much of everything?')],
    }),
  },

  vegetables: {
    varianter: [V('Vegetable side (Whole Foods Market)', 'wf'), V('Vegetables (Iowa State)', 'isu'), V('Any side at a party (Iowa State)', ['side-min', 'side-maks'])],
    tekst: (h) => ({
      title: 'How much vegetables per person? Cups and ounces',
      h1: 'How much vegetables per person?',
      description: `${h.k('wf')} lists ${h.t('wf')} of a vegetable side per person. ${h.k('isuholiday')} lists ${h.t('isu')} of vegetables. Calculator and chart for 2 to 12 adults.`,
      lead: `${h.k('wf')} lists ${h.t('wf')} of a vegetable side per person. Iowa State Extension lists ${h.t('isu')} of vegetables per serving.`,
      svar: `<b>${h.t('wf')} of a vegetable side per person</b>, says ${h.k('wf')}. By weight, Iowa State Extension says ${h.t('isu')} of vegetables per serving, and ${h.r('side-min', 'side-maks')} for any side at a party.`,
      avsnitt: [
        ['What the sources say', p('A volume from a store, and weights from an extension service.') + h.sprik([
          ['wf', 'Veggie sides, per person', h.t('wf')],
          ['isuholiday', 'Vegetables, per serving', h.t('isu')],
          ['isugrad', 'Any side at a party, per person', h.r('side-min', 'side-maks')],
          ['isuholiday', 'Beans, per serving', h.t('isu-bonner')],
        ])],
        ['Vegetables next to other sides', p(`Iowa State Extension lists a serving by type of side: ${h.t('isu')} of vegetables or ${h.t('isu-bonner')} of beans, with separate weights for potatoes and grain. See <a href="/en/how-much-per-person/mashed-potatoes/">mashed potatoes</a> and <a href="/en/how-much-per-person/rice/">rice</a>.`)],
      ],
      faq: [
        ['How much vegetables for 10 people?', `${h.sum('wf', 10)} using ${h.k('wf')}.`],
        ['How many ounces of vegetables per person?', `${h.k('isuholiday')} says ${h.t('isu')}.`],
        ['Is this fresh or cooked weight?', 'The sources do not say.'],
      ],
      soster: [L('salad', 'How much salad per person?'), L('mashed-potatoes', 'How much mashed potatoes per person?'), L('rice', 'How much rice per person?')],
    }),
  },

  burgers: {
    varianter: [V('Burgers', ['min', 'maks']), V('Ground meat as the main dish (Iowa State)', ['isu-uten-min', 'isu-uten-maks'])],
    tekst: (h) => ({
      title: 'How much ground beef per person for burgers?',
      h1: 'How much ground beef for burgers?',
      description: `${h.k('isugrad')} lists ${h.r('min', 'maks')} of burger per person at a party. ${h.k('isuholiday')} lists ${h.r('isu-uten-min', 'isu-uten-maks')} of ground meat per serving. Calculator and chart.`,
      lead: `For burgers at a party, Iowa State Extension lists ${h.r('min', 'maks')} per person. For ground meat as a main dish, ${h.r('isu-uten-min', 'isu-uten-maks')}.`,
      svar: `<b>${h.r('min', 'maks')} of burger meat per person.</b> At a sit-down meal where ground meat is the main dish, ${h.k('isuholiday')} lists ${h.r('isu-uten-min', 'isu-uten-maks')}.`,
      avsnitt: [
        ['What the sources say', p('Both figures come from Iowa State Extension, from two different tables.') + h.sprik([
          ['isugrad', 'Burgers at a party, per person', h.r('min', 'maks')],
          ['isuholiday', 'Ground meat as the main dish, per serving', h.r('isu-uten-min', 'isu-uten-maks')],
        ])],
        ['Pounds of ground beef for a big group', p(`With ${h.k('isugrad')}, 4 adults need ${h.sumR('min', 'maks', 4)} of burger meat, and 12 adults need ${h.sumR('min', 'maks', 12)}. The table above has 2 to 12 adults.`, 'The source does not say whether this is raw or cooked weight.')],
      ],
      faq: [
        ['How much ground beef for 10 burgers?', `With ${h.k('isugrad')}, 10 adults need ${h.sumR('min', 'maks', 10)}.`],
        ['How big is one burger?', `${h.k('isugrad')} lists ${h.r('min', 'maks')} for a burger.`],
        ['Do kids eat a full burger?', 'The calculator counts each kid as half an adult.'],
      ],
      soster: [L('tacos', 'How much ground meat for tacos?'), L('meat-for-a-party', 'How much meat per person for a party?'), L('potato-salad', 'How much potato salad per person?')],
    }),
  },

  tacos: {
    varianter: [V('Tacos', ['min', 'maks']), V('Ground meat for tacos', ['kjott-min', 'kjott-maks'])],
    tekst: (h) => ({
      title: 'How much taco meat per person? Tacos and pounds',
      h1: 'How much ground meat for tacos?',
      description: `${h.k('isugrad')} lists ${h.r('min', 'maks')} per person and ${h.r('kjott-min', 'kjott-maks')} of ground meat for ${h.n('gjester')} people. Calculator and chart for 2 to 12 adults.`,
      lead: `Iowa State Extension lists ${h.r('min', 'maks')} per person. For ${h.n('gjester')} people that takes ${h.r('kjott-min', 'kjott-maks')} of ground meat.`,
      svar: `<b>${h.r('min', 'maks')} per person.</b> For ${h.n('gjester')} people, ${h.k('isugrad')} says ${h.r('kjott-min', 'kjott-maks')} of ground meat. The calculator turns that into an amount per person.`,
      avsnitt: [
        ['What the source says', p('One source, one table row, two ways to read it.') + h.sprik([
          ['isugrad', 'Tacos, per person', h.r('min', 'maks')],
          ['isugrad', `Ground meat for ${h.n('gjester')} people`, h.r('kjott-min', 'kjott-maks')],
        ])],
        ['From a party figure to your table', p(`The source gives pounds for ${h.n('gjester')} people. Divide by ${h.n('gjester')} for one person, and multiply by your group. For 8 adults, the calculator gives ${h.sumR('kjott-min', 'kjott-maks', 8)} of ground meat. The source does not say how much goes in one taco.`)],
      ],
      faq: [
        ['How much taco meat for 10 people?', `${h.sumR('kjott-min', 'kjott-maks', 10)} of ground meat, using ${h.k('isugrad')}.`],
        ['How many tacos per person?', `${h.r('min', 'maks')}.`],
        ['Does this include toppings?', 'No. The source gives the meat only.'],
      ],
      soster: [L('burgers', 'How much ground beef for burgers?'), L('meat-for-a-party', 'How much meat per person for a party?'), L('rice', 'How much rice per person?')],
    }),
  },

  'party-meat': {
    varianter: [V('Any protein', ['prot-min', 'prot-maks']), V('Sandwiches', 'sandwich'), V('Meatballs', ['kjottboller-min', 'kjottboller-maks']), V('All food, total weight', ['mat-min', 'mat-maks'])],
    tekst: (h) => ({
      title: 'How much meat per person for a party?',
      h1: 'How much meat per person for a party?',
      description: `${h.k('isugrad')} lists ${h.r('prot-min', 'prot-maks')} of protein per person at a party, ${h.t('sandwich')}, or ${h.r('kjottboller-min', 'kjottboller-maks')}. Total food: ${h.r('mat-min', 'mat-maks')} per guest.`,
      lead: `At a party, Iowa State Extension lists ${h.r('prot-min', 'prot-maks')} of protein per person, or ${h.t('sandwich')}. In all, plan for ${h.r('mat-min', 'mat-maks')} of food per guest.`,
      svar: `<b>${h.r('prot-min', 'prot-maks')} of protein per person</b>, or ${h.t('sandwich')} each, or ${h.r('kjottboller-min', 'kjottboller-maks')}. Iowa State Extension says plan for ${h.r('mat-min', 'mat-maks')} of food per guest in all.`,
      avsnitt: [
        ['What the source says', p('The numbers below are from one Iowa State Extension party guide. It also gives the raw meat needed for 50 people.') + h.sprik([
          ['isugrad', 'Protein, per person', h.r('prot-min', 'prot-maks')],
          ['isugrad', 'Sandwiches, per person', h.t('sandwich')],
          ['isugrad', 'Meatballs, per person', h.r('kjottboller-min', 'kjottboller-maks')],
          ['isugrad', `Raw meat for sandwiches, ${h.n('gjester')} people`, h.r('sandwich-kjott-min', 'sandwich-kjott-maks')],
          ['isugrad', `Raw meat for sliders, ${h.n('gjester')} people`, h.r('sliders-min', 'sliders-maks')],
          ['isugrad', `Raw meat for meatballs, ${h.n('gjester')} people`, h.r('kjottboller-lb-min', 'kjottboller-lb-maks')],
        ])],
        ['An open house', p(`${h.k('isugrad')} says that for an open house, where the guest count is uncertain, a common strategy is to plan for ${h.t('seksti')} of the guests invited.`)],
      ],
      faq: [
        ['How much meat for 50 people?', `For sandwiches, ${h.k('isugrad')} lists ${h.r('sandwich-kjott-min', 'sandwich-kjott-maks')} of raw meat. For sliders, ${h.r('sliders-min', 'sliders-maks')}.`],
        ['How much food per guest in total?', `${h.r('mat-min', 'mat-maks')}, says ${h.k('isugrad')}.`],
        ["What if I don't know how many people will come?", `The same source suggests planning for ${h.t('seksti')} of the guests invited at an open house.`],
      ],
      soster: [L('burgers', 'How much ground beef for burgers?'), L('tacos', 'How much ground meat for tacos?'), L('potato-salad', 'How much potato salad per person?')],
    }),
  },

  thanksgiving: {
    varianter: [V('Turkey', 'kalkun'), V('Stuffing', 'fyll'), V('Potatoes or starch', 'poteter'), V('Raw potatoes for mashed potatoes', 'poteter-rå'), V('Vegetable sides', 'gronnsaker'), V('Salad', 'salat'), V('Gravy', 'saus'), V('Soup', 'suppe'), V('Rolls', 'rundstykker'), V('Pie', 'pai'), V('Appetizers', 'forrett')],
    tekst: (h) => ({
      title: 'Thanksgiving dinner: how much food per person?',
      h1: 'How much food per person for Thanksgiving dinner?',
      description: `${h.k('wf')} lists ${h.t('kalkun')} of turkey, ${h.t('fyll')} of stuffing, ${h.t('poteter')} of potatoes, and ${h.t('saus')} of gravy per person. Calculator for every dish.`,
      lead: `${h.k('wf')} lists an amount per person for every dish on the table. Pick a dish in the calculator, enter your adults and kids, and you get the whole amount.`,
      svar: `<b>Per person: ${h.t('kalkun')} of turkey, ${h.t('fyll')} of stuffing, ${h.t('poteter')} of potatoes, ${h.t('gronnsaker')} of vegetables, and ${h.t('saus')} of gravy.</b> Source: ${h.k('wf')}.`,
      avsnitt: [
        ['Every dish, per person', p('One source, one table. For turkey, the Whole Foods figure includes bone weight.') + h.sprik([
          ['wf', 'Turkey', h.t('kalkun')],
          ['wf', 'Appetizers', h.t('forrett')],
          ['wf', 'Soup', h.t('suppe')],
          ['wf', 'Salad', h.t('salat')],
          ['wf', 'Stuffing', h.t('fyll')],
          ['wf', 'Potatoes or starch', h.t('poteter')],
          ['wf', 'Raw potatoes for mashed potatoes', h.t('poteter-rå')],
          ['wf', 'Vegetable sides', h.t('gronnsaker')],
          ['wf', 'Rolls', h.t('rundstykker')],
          ['wf', 'Gravy', h.t('saus')],
          ['wf', 'Pie', h.t('pai')],
          ['isuholiday', 'Dessert, per person', h.t('isu-dessert')],
          ['isuholiday', 'Bread, per person', h.r('isu-brod-min', 'isu-brod-maks')],
        ])],
        ['Where the other sources say something different', p(`For turkey, USDA FSIS and the National Turkey Federation give a lower figure: see <a href="/en/how-much-per-person/turkey/">how much turkey per person</a>. For potatoes, Iowa State Extension gives a weight per serving: see <a href="/en/how-much-per-person/mashed-potatoes/">mashed potatoes</a>.`)],
      ],
      faq: [
        ['How much food for 8 people?', `Using ${h.k('wf')}, 8 adults need ${h.sum('kalkun', 8)} of turkey, ${h.sum('fyll', 8)} of stuffing, ${h.sum('poteter', 8)} of potatoes, and ${h.sum('saus', 8)} of gravy.`],
        ['How many pounds of potatoes for mashed potatoes?', `${h.k('wf')} says ${h.t('poteter-rå')} per guest, so ${h.sum('poteter-rå', 10)} for 10 adults.`],
        ['How many pies?', `${h.k('wf')} lists ${h.t('pai')} of a 9-inch pie per person.`],
      ],
      soster: [L('turkey', 'How much turkey per person?'), L('stuffing', 'How much stuffing per person?'), L('mashed-potatoes', 'How much mashed potatoes per person?'), L('ham', 'How much ham per person?')],
    }),
  },
};

function p(...xs) { return xs.filter(Boolean).map((x) => `<p>${x}</p>`).join(''); }

/** The stuffing chart for a whole bird, from the numbers in the data file. */
function chart(h) {
  const rad = [['8 to 12 pounds', 'fugl-8'], ['12 to 16 pounds', 'fugl-12'], ['16 to 20 pounds', 'fugl-16'], ['20 to 24 pounds', 'fugl-20']];
  return `<div class="table-wrap" tabindex="0" role="region" aria-label="Stuffing by weight of the bird"><table class="sprik"><thead><tr><th scope="col">Weight of the bird</th><th scope="col">Prepared stuffing</th></tr></thead><tbody>${rad.map(([navn, f]) => `<tr><td>${navn}</td><td>${h.r(`${f}-min`, `${f}-maks`)}</td></tr>`).join('')}</tbody></table></div>`;
}

// Malen for «cups to grams» (en): sidene skrives fra data.en.json, og hvert tall på siden regnes ut på nytt fra datafila og sammenlignes på sin plass.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { lesData, publiserbare } from '../scripts/familier/felles.mjs';
import { KALK_EN, kalkHtmlEn, navSide, sideForRad, skjeAvvik, tillatteTall, tillatteTallNav, usdaPorsjoner, utregnetEn, visPorsjon } from '../scripts/familier/dl-til-gram/mal-en.mjs';
import { TEKST_EN } from '../scripts/familier/dl-til-gram/tekst-en.mjs';
import { VARER_EN } from '../scripts/familier/dl-til-gram/varer-en.mjs';
import { htmlTilTekst, synligTekst, tallUtenforData } from './hjelp/familievakt.mjs';
import { NORSKE_RESTORD } from './hjelp/restord.mjs';

const MAPPE = fileURLToPath(new URL('../scripts/familier/dl-til-gram/', import.meta.url));
const data = lesData(MAPPE, 'en');
const rader = publiserbare(data);
const rad = (id) => rader.find((r) => r.id === id);
const vare = (id) => VARER_EN.find((v) => v.id === id);
const erHevemiddel = (r) => r.tall.tsp !== undefined;
const sider = () => [['nav', navSide(data, rader)], ...rader.map((r) => [r.id, sideForRad(r, data, rader)])];

// Uavhengig utregning i testen (ikke importert fra malen). Gram fra 10 g som hele gram (halve opp), under 10 g to gjeldende sifre;
// andre enheter: 100 og over som heltall, 10 til 100 tre gjeldende sifre, under 10 to, uten «.0» til slutt.
const sig = (n, sifre) => {
  const d = Math.min(100, Math.max(0, sifre - 1 - Math.floor(Math.log10(Math.abs(n)))));
  const t = (Math.round(Number((n * 10 ** d).toPrecision(12))) / 10 ** d).toFixed(d);
  return t.includes('.') ? t.replace(/0+$/u, '').replace(/\.$/u, '') : t;
};
const gramT = (n) => (n >= 10 ? String(Math.round(Number(n.toPrecision(12)))) : sig(n, 2));
const andreT = (n) => (n >= 100 ? String(Math.round(n)) : sig(n, n >= 10 ? 3 : 2));
const OZ = 28.349523125;
const tall = (t) => String(t).match(/\d+(?:\.\d+)?/gu) ?? [];
// Som tall, men «1,000» er ett tall (amerikansk tusenskille i «1 kilogram (1,000 g)»).
const tallK = (t) => String(t).match(/\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?/gu) ?? [];
const ren = (html) => htmlTilTekst(html, { attributter: false }).replace(/\s+/gu, ' ').trim();
const blokk = (html, start) => html.match(new RegExp(`${start}[\\s\\S]*?</(?:table|ul|p)>`, 'u'))?.[0] ?? '';
const utenParentes = (navn) => navn.replace(/\s*\(Includes[^)]*\)/u, '');

/** Leser tabellene og tekstene ut av en generert side og sammenligner hvert tall på sin plass mot det som regnes ut fra datafila. */
function sjekkSide(r, s) {
  const tsp = r.tall.tsp !== undefined;
  const cup = tsp ? r.tall.tsp.verdi * 48 : r.tall.cup.verdi;
  const grunn = tsp ? r.tall.tsp.verdi : cup;
  const v = tall(vare(r.id).variant);
  const feil = [];
  const lik = (navn, faktisk, forventet) => { if (JSON.stringify(faktisk) !== JSON.stringify(forventet)) feil.push(`${navn}: ${JSON.stringify(faktisk)} mot ${JSON.stringify(forventet)}`); };
  const rad_ = (e, g) => [e, `${gramT(g)} g`, g / OZ >= 1 ? `${andreT(g / OZ)} oz` : '']; // ounces bare fra 1 oz
  const cups = [['1/4 cup', 1 / 4], ['1/3 cup', 1 / 3], ['1/2 cup', 1 / 2], ['2/3 cup', 2 / 3], ['3/4 cup', 3 / 4], ['1 cup', 1], ['2 cups', 2]];
  let forventet = tsp
    ? [['1/2 tsp', 1 / 96], ['1 tsp', 1 / 48], ['2 tsp', 1 / 24], ['1 tbsp', 1 / 16], ['1/4 cup', 1 / 4], ['1/2 cup', 1 / 2], ['1 cup', 1]].map(([e, b]) => rad_(e, cup * b))
    : [['1 tsp', 1 / 48], ['1 tbsp', 1 / 16], ...cups].map(([e, b]) => rad_(e, cup * b));
  lik('tabellen cups to grams', [...blokk(s.rik, '<table class="otabell">').matchAll(/<tr><td>([^<]*)<\/td><td>([^<]*)<\/td><td>([^<]*)<\/td><\/tr>/gu)].map((m) => [m[1], m[2], m[3]]), forventet);
  const eksG = tsp ? [5, 10, 25, 50] : [50, 100, 250, 500];
  lik('grams to cups', [...blokk(s.rik, '<ul class="eksempler">').matchAll(/<li><b>([^<]*)<\/b><span>([^<]*)<\/span><\/li>/gu)].map((m) => [m[1], m[2]]),
    eksG.map((g) => { const c = andreT(g / grunn); return [`${g} g`, tsp ? `${c} tsp` : `${c} ${c === '1' ? 'cup' : 'cups'}`]; }));
  const pundC = andreT(453.59237 / grunn);
  const pundTekst = s.rik.match(/<p>(1 pound of [^<]*)<\/p>/u)?.[1];
  if (tsp) lik('pund (ikke for hevemidler)', pundTekst, undefined);
  else lik('pund og kilo', tallK(ren(pundTekst)), ['1', '454', pundC, '1', '1,000', andreT(1000 / grunn)]);
  lik('formelen', s.rik.match(/<b>([\d.]+)<\/b><\/p>/u)?.[1], String(grunn));
  lik('avsnittet om gram til cups', tall(ren(s.rik.match(/<h2>Convert grams back to [a-z]+<\/h2><p>([\s\S]*?)<\/p>/u)?.[1])), [String(grunn), String(grunn)]);
  lik('ingen setning over tabellen', s.rik.match(/ in grams and ounces<\/h2>(<table)/u)?.[1], '<table');
  const ounces = andreT(grunn / OZ);
  // Tittelen: tallet i «(1 cup = 125 g)» regnes ut på nytt, og en tittel uten parentes har ingen tall (varenavnene har ingen sifre).
  const tm = /\(1 (cup|tsp) = ([\d.]+) g\)/u.exec(s.title);
  lik('tittelen', tm ? [tm[1], tm[2], tall(s.title).join(',')] : ['', '', tall(s.title).join(',')], tm ? [tsp ? 'tsp' : 'cup', gramT(grunn), `1,${gramT(grunn)}`] : ['', '', '']);
  lik('ingress', tall(s.lead), ['1', ...v, gramT(grunn), ounces]);
  lik('metabeskrivelse', tall(s.description), ['1', ...v, gramT(grunn), ounces]);
  lik('short answer', tall(ren(s.topp.match(/<p class="kortsvar">([\s\S]*?)<\/p>/u)?.[1])),
    tsp ? ['1', ...v, gramT(grunn), '1', gramT(cup / 16), '1', gramT(cup)] : ['1', ...v, gramT(cup), '1', gramT(cup / 16), '1', gramT(cup / 48)]);
  const ozTekst = s.rik.match(/<h2>Ounces and fluid ounces<\/h2>\s*<p>([\s\S]*?)<\/p>/u)?.[1];
  if (tsp) lik('ounces-avsnittet (ikke for hevemidler)', ozTekst, undefined);
  else lik('ounces-avsnittet', tall(ren(ozTekst)), ['1', '28.35', '8', '1', andreT(cup / OZ)]);
  const start = tsp ? gramT(2 * cup / 48) : gramT(2 * cup);
  lik('kalkulatorens eksempel', [s.topp.match(/<output[^>]*>([^<]*)<\/output>/u)?.[1], ren(s.topp.match(/class="kalksetning"[^>]*>([\s\S]*?)<\/p>/u)?.[1])],
    [start, `2 ${tsp ? 'tsp' : 'cups'} ${vare(r.id).ord} = ${start} g`]);
  const svar = s.faq.map(([, a]) => ren(a));
  const navn = tall(utenParentes(r.tekst.usdaNavn));
  lik('FAQ 1', tall(svar[0]), ['1', ...v, gramT(grunn), ounces]);
  assert.equal(/FDC|USDA/u.test(svar[0]), false, 'spørsmål 1 har hverken FDC-nummer eller kildenavn');
  lik('FAQ 2', tall(svar[1]), tsp ? ['10', ...v, andreT(10 / grunn), String(grunn)] : ['100', ...v, andreT(100 / grunn), String(cup)]);
  lik('FAQ 3', tall(svar[2]), tsp ? ['1', '3', gramT(cup / 16)] : ['1', gramT(cup / 16), '1', gramT(cup / 48)]);
  const t = TEKST_EN[r.id] ?? {};
  const naer = t.naer?.[0] && rad(t.naer[0]);
  const stick = Object.values(r.tall).find((x) => x.merknad === 'stick');
  if (stick) lik('FAQ 4, stick', tall(svar[3]), ['1', '113']);
  else if (t.alt) lik('FAQ 4, alternativ porsjon', tall(svar[3]), ['1', String(Object.values(r.tall).find((x) => x.merknad === t.alt.porsjon).verdi), String(r.tall.cup.verdi)]);
  else if (naer && (naer.tall.tsp ?? naer.tall.cup).verdi !== grunn) {
    const nv = tall(vare(naer.id).variant);
    const nTsp = naer.tall.tsp !== undefined;
    const nGrunn = nTsp ? naer.tall.tsp.verdi : naer.tall.cup.verdi;
    lik('FAQ 4, nær vare', tall(svar[3]), ['1', ...v, gramT(grunn), '1', ...nv, gramT(nGrunn)]);
  } else if (!tsp) lik('FAQ 4, ounces', tall(svar[3]), ['1', andreT(cup / OZ), '8']);
  else assert.equal(svar.length, 3, 'hevemidler uten nær vare har tre spørsmål');
  const tabeller = [...s.rik.matchAll(/<table class="sprik">[\s\S]*?<\/table>/gu)].map((m) => [...m[0].matchAll(/<td>[^<]*(?:<small>[^<]*<\/small>)?<\/td><td>([^<]*)<\/td>/gu)].map((x) => x[1]));
  lik('USDA-tabellene', tabeller, usdaVisning(r));
  return feil;
}

// De porsjonene USDA-tabellene skal vise, utledet uavhengig av malen fra postenes porsjoner i datafila: grunnlaget først, så de som sier noe om cups, skjeer, stick og pat.
// Raden kan ha en post til (nøklene med b_ foran), som får sin egen tabell.
function usdaVisning(r) {
  const skjules = /container|package|box|NLEA|slice|dash|cubic inch|brownulated|melted|^serving|^packet \(|^almond$|^(?:extra|small|medium|large)\b/u;
  const vis = (t) => {
    const m = /^(\d+(?:\.\d+)?) (.+)$/u.exec(t.merknad);
    const [mengde, mod] = m ? [Number(m[1]), m[2]] : [1, t.merknad];
    return !skjules.test(mod) && (mengde !== 1 || /^(?:cup|tbsp|tablespoon|tsp|teaspoon|stick|pat|fl oz|quart|ml|packet$)/u.test(mod));
  };
  const poster = (prefiks) => Object.entries(r.tall).filter(([k]) => k.startsWith('b_') === (prefiks === 'b_')).filter(([k, t]) => k === `${prefiks}cup` || k === `${prefiks}tsp` || vis(t)).map(([, t]) => `${t.verdi} g`);
  return [poster(''), ...(r.tekst.fdcId2 ? [poster('b_')] : [])];
}

/** Samlesiden: hver rad i tabellen (alle fire kolonner), tittel, beskrivelse, short answer og spørsmål regnes ut på nytt fra datafila. */
function sjekkNav(s) {
  const feil = [];
  const lik = (navn, faktisk, forventet) => { if (JSON.stringify(faktisk) !== JSON.stringify(forventet)) feil.push(`${navn}: ${JSON.stringify(faktisk)} mot ${JSON.stringify(forventet)}`); };
  const cupAv = (r) => (r.tall.tsp ? r.tall.tsp.verdi * 48 : r.tall.cup.verdi);
  const sortert = [...rader].sort((a, b) => a.navn.localeCompare(b.navn, 'en'));
  const forventet = sortert.map((r) => [r.slug, `${gramT(cupAv(r))} g`, `${andreT(cupAv(r) / OZ)} oz`, `${gramT(cupAv(r) / 16)} g`, `${gramT(cupAv(r) / 48)} g`]);
  const faktisk = [...blokk(s.rik, '<table class="varer">').matchAll(/<tr><td><a href="\/en\/tools\/cups-to-grams\/([^/"]+)\/">[^<]*<\/a><\/td><td>([^<]*)<\/td><td>([^<]*)<\/td><td>([^<]*)<\/td><td>([^<]*)<\/td><\/tr>/gu)].map((m) => m.slice(1, 6));
  lik('varetabellen', faktisk, forventet);
  lik('tittel', tall(s.title), [String(rader.length)]);
  lik('beskrivelse', tall(s.description), [String(rader.length)]);
  const hv = (id) => cupAv(rad(id));
  lik('short answer', tall(ren(s.topp.match(/<p class="kortsvar">([\s\S]*?)<\/p>/u)?.[1])), ['1', gramT(hv('hvetemel')), '1', gramT(hv('sukker')), '1', gramT(hv('smor'))]);
  lik('spørsmål 1', tall(s.faq[0][1]), ['1', gramT(hv('hvetemel')), '1', gramT(hv('sukker')), '1', gramT(hv('smor'))]);
  lik('spørsmål 2', tall(s.faq[1][1]), ['1', '1', gramT(hv('hvetemel')), '2', gramT(2 * hv('hvetemel'))]);
  lik('spørsmål 3', tall(s.faq[2][1]), ['1', '100', andreT(100 / hv('hvetemel'))]);
  const tung = [...rader].sort((a, b) => cupAv(b) - cupAv(a))[0];
  const lett = [...rader].sort((a, b) => cupAv(a) - cupAv(b))[0];
  lik('hvorfor veier ikke', tall(ren(s.rik.match(/<h2>Why[^<]*<\/h2><p>([\s\S]*?)<\/p>/u)?.[1])), ['1', gramT(cupAv(tung)), '1', gramT(cupAv(lett))]);
  return feil;
}

test('samlesiden: tabellen, tittelen og tekstene regnes ut på nytt fra datafila og stemmer på sin plass', () => {
  assert.deepEqual(sjekkNav(navSide(data, rader)), []);
});

test('bevis: salt endret fra 292 til 125 g i samlesidens tabell, og whole wheat flour fra 120 til 125 g i tittelen, gir rødt', () => {
  const nav = navSide(data, rader);
  assert.ok(nav.rik.includes('/salt/">Salt</a></td><td>292 g</td>'));
  const feilNav = sjekkNav({ ...nav, rik: nav.rik.replace('/salt/">Salt</a></td><td>292 g</td>', '/salt/">Salt</a></td><td>125 g</td>') });
  assert.ok(feilNav.length > 0 && feilNav[0].startsWith('varetabellen'), String(feilNav));
  for (const kolonne of [['<td>10.3 oz</td>', '<td>10.4 oz</td>'], ['<td>18 g</td><td>6.1 g</td>', '<td>18 g</td><td>6.2 g</td>']]) assert.ok(sjekkNav({ ...nav, rik: nav.rik.replace(...kolonne) }).length > 0, kolonne[0]);
  const hvete = rad('sammalt-hvetemel');
  const s = sideForRad(hvete, data, rader);
  assert.ok(s.title.includes('= 120 g'), s.title);
  assert.deepEqual(sjekkSide(hvete, s), []);
  const feil = sjekkSide(hvete, { ...s, title: s.title.replace('= 120 g', '= 125 g') });
  assert.ok(feil.some((f) => f.startsWith('tittelen')), String(feil));
  assert.ok(sjekkSide(hvete, { ...s, description: s.description.replace('120', '125') }).length > 0);
});

test('flour: svaret står i ingress, beskrivelse, short answer, tabell og kalkulator, og er det samme tallet', () => {
  const s = sideForRad(rad('hvetemel'), data, rader);
  assert.equal(s.lead, '1 cup of all-purpose flour weighs 125 g (4.4 oz). Type an amount to convert.');
  assert.match(s.description, /^1 cup of all-purpose flour weighs 125 g \(4\.4 oz\)\./u);
  assert.match(s.topp, /2 cups flour = 250 g/u);
  assert.match(s.topp, /<b>Short answer:<\/b> 1 cup of all-purpose flour is 125 g\. 1 tablespoon is 7\.8 g and 1 teaspoon is 2\.6 g, calculated from the cup weight\./u);
  assert.match(s.rik, /<tr><td>1\/4 cup<\/td><td>31 g<\/td><td>1\.1 oz<\/td><\/tr>/u);
  assert.match(s.rik, /<tr><td>1 cup<\/td><td>125 g<\/td><td>4\.4 oz<\/td><\/tr>/u);
  assert.equal(s.title, 'Flour: cups to grams (1 cup = 125 g)');
  assert.equal(s.h1, 'Flour: cups to grams');
  assert.match(s.rik, /<h2>Ounces and fluid ounces<\/h2>\s*<p>Fluid ounces measure volume, and ounces measure weight \(1 oz = 28\.35 g\)\. A cup holds 8 fl oz\. 1 cup of flour weighs 4\.4 oz\.<\/p>/u);
});

test('hvert tall på hver side regnes ut på nytt fra datafila og stemmer på sin plass', () => {
  for (const r of rader) assert.deepEqual(sjekkSide(r, sideForRad(r, data, rader)), [], r.id);
});

test('bevis: flour endret til 1, 120 eller 200 i en kopi av datafila gir rødt i den posisjonelle kontrollen', () => {
  const r = rad('hvetemel');
  const s = sideForRad(r, data, rader);
  for (const verdi of [1, 120, 200]) {
    const kopi = structuredClone(r);
    kopi.tall.cup.verdi = verdi;
    assert.ok(sjekkSide(kopi, s).length > 0, `${verdi}: siden er laget av 125, kontrollen utleder fra ${verdi}`);
  }
  assert.ok(s.rik.includes('<td>1 cup</td><td>125 g</td>'));
  for (const feilVerdi of [1, 120, 200]) {
    assert.ok(sjekkSide(r, { ...s, rik: s.rik.replace('<td>1 cup</td><td>125 g</td>', `<td>1 cup</td><td>${feilVerdi} g</td>`) })[0].startsWith('tabellen cups to grams'), String(feilVerdi));
  }
  assert.ok(sjekkSide(r, { ...s, lead: s.lead.replace('125', '120') }).length > 0);
  assert.ok(sjekkSide(r, { ...s, description: s.description.replace('125', '200') }).length > 0);
  assert.ok(sjekkSide(r, { ...s, topp: s.topp.replace('is 7.8 g', 'is 9 g') }).length > 0);
  assert.ok(sjekkSide(r, { ...s, faq: s.faq.map(([q, a]) => [q, a.replace('0.8', '0.9')]) }).length > 0);
});

test('tallvakten er stram: en tabellverdi på 120 eller 200 er ikke tillatt på flour-siden', () => {
  const r = rad('hvetemel');
  const s = sideForRad(r, data, rader);
  const tillatt = tillatteTall(r, data);
  for (const feilVerdi of ['90', '200', '27']) assert.equal(tillatt.has(feilVerdi), false, feilVerdi);
  for (const ok of ['125', '250', '31', '4.4', '168894', '2026', '137']) assert.equal(tillatt.has(ok), true, ok);
  assert.deepEqual(tallUtenforData({ ...s, rik: s.rik.replace('<td>1 cup</td><td>125 g</td>', '<td>1 cup</td><td>200 g</td>') }, tillatt), ['200']);
});

test('hvert tall på hver side er tillatt, og samlesiden har sin egen liste', () => {
  for (const r of rader) assert.deepEqual(tallUtenforData(sideForRad(r, data, rader), tillatteTall(r, data)), [], r.id);
  assert.deepEqual(tallUtenforData(navSide(data, rader), tillatteTallNav(data)), []);
});

test('hevemidlene har teaspoon først: ingress, kalkulator og tabell, og cup er utregnet', () => {
  const r = rad('baking-powder');
  const s = sideForRad(r, data, rader);
  assert.equal(s.lead, '1 teaspoon of double-acting baking powder or baking soda weighs 4.6 g (0.16 oz). Type an amount to convert.');
  assert.equal(s.h1, 'Baking powder and baking soda: teaspoons to grams');
  assert.match(s.topp, /<option value="tsp" selected>Teaspoons \(tsp\)<\/option>/u);
  assert.match(s.topp, /2 tsp baking powder or baking soda = 9\.2 g/u);
  assert.match(s.topp, /1 cup is 221 g, calculated from the teaspoon weight/u);
  assert.ok(s.rik.indexOf('<td>1 tsp</td>') > -1 && s.rik.indexOf('<td>1 tsp</td>') < s.rik.indexOf('<td>1 cup</td>') && s.rik.indexOf('<td>1/2 tsp</td>') < s.rik.indexOf('<td>1 tsp</td>'));
  assert.match(s.rik, /<td>tsp<small>Used in the calculator<\/small><\/td><td>4\.6 g<\/td>/u);
  assert.match(s.rik, /<td>0\.5 tsp<\/td><td>2\.3 g<\/td>/u);
  for (const id of ['baking-powder', 'active-dry-yeast']) assert.match(sideForRad(rad(id), data, rader).topp, /<option value="tsp" selected>/u, id);
});

test('smør: «stick» står i USDA-tabellen og i ett spørsmål, ikke i hovedtabellen; ingen andre varer har sticks', () => {
  const s = sideForRad(rad('smor'), data, rader);
  assert.equal(/<tr><td>1 stick/u.test(s.rik), false);
  assert.equal(s.rik.match(/<table class="otabell">[\s\S]*?<\/table>/u)[0].includes('stick'), false);
  assert.match(s.rik, /<tr><td>stick<\/td><td>113 g<\/td><\/tr>/u);
  assert.match(s.rik, /<tr><td>pat \(1&quot; sq, 1\/3&quot; high\)<\/td><td>5 g<\/td><\/tr>/u);
  assert.deepEqual(s.faq.find(([q]) => q === 'How many grams are in a stick of butter?'), ['How many grams are in a stick of butter?', 'USDA lists 1 stick of salted butter as 113 g.']);
  for (const [id, side] of sider().filter(([i]) => i !== 'smor')) assert.equal(/stick/iu.test(JSON.stringify(side)), false, id);
});

test('brown sugar bruker «cup packed» 220 overalt, og «cup unpacked» 145 står tydelig merket i USDA-tabellen og i ett spørsmål', () => {
  const s = sideForRad(rad('brunt-sukker'), data, rader);
  assert.match(s.lead, /^1 cup of packed brown sugar weighs 220 g \(7\.8 oz\)\./u);
  assert.match(s.topp, /2 cups brown sugar = 440 g/u);
  assert.match(s.rik, /<tr class="valgt"><td>cup packed<small>Used in the calculator<\/small><\/td><td>220 g<\/td><\/tr>/u);
  assert.match(s.rik, /<tr><td>cup unpacked<\/td><td>145 g<\/td><\/tr>/u);
  assert.match(s.faq[3][1], /^USDA lists 1 cup of unpacked brown sugar as 145 g\. Packed, it's 220 g, which is what this page uses\.$/u);
  assert.match(sideForRad(rad('melis'), data, rader).lead, /unsifted powdered sugar weighs 120 g/u);
});

test('USDA-tabellen: porsjoner med annen mengde står med mengden, og porsjoner som ikke sier noe om cups er utelatt', () => {
  const rik = (id) => sideForRad(rad(id), data, rader).rik;
  assert.match(rik('peanut-butter'), /<td>2 tbsp<\/td><td>32 g<\/td>/u);
  assert.match(rik('havregryn'), /<td>0\.33 cup<\/td><td>27 g<\/td>/u);
  assert.match(rik('cottage-cheese'), /<td>4 oz<\/td><td>113 g<\/td>/u);
  assert.match(rik('rosiner'), /<td>50 raisins<\/td><td>26 g<\/td>/u);
  assert.match(rik('smor'), /<td>pat \(1&quot;|<td>pat \(1" sq, 1\/3" high\)<\/td><td>5 g<\/td>/u);
  for (const [id, ikke] of [['mashed-banana', /NLEA|extra large|medium/u], ['rosiner', /miniature box|small box|oz \(60/u], ['sukker', /serving packet|cube/u], ['salt', /dash/u], ['mandler', />almond</u], ['shredded-cheddar', /slice|cubic inch|>oz</u], ['yogurt', /container/u], ['sukker', /serving/u], ['brunt-sukker', /brownulated/u], ['shredded-cheddar', /melted/u], ['maple-syrup', /serving/u]]) {
    assert.equal(ikke.test(rik(id).match(/<table class="sprik">[\s\S]*?<\/table>/u)[0]), false, id);
  }
  assert.match(rik('active-dry-yeast'), /<td>packet<\/td><td>7\.2 g<\/td>/u);
  assert.equal(visPorsjon('cup, whipped'), true);
  assert.equal(visPorsjon('packet (0.5 oz)'), false);
  assert.equal(visPorsjon('oz'), false);
  assert.equal(visPorsjon('2 tbsp'), true);
  assert.deepEqual(usdaPorsjoner(rad('hvetemel')).map(([e]) => e), ['cup']);
});

test('der USDAs eget tablespoon-tall avviker mer enn 10 prosent, sier siden begge tallene og at kalkulatoren bruker cup', () => {
  assert.deepEqual(rader.filter((r) => skjeAvvik(r).length).map((r) => r.id).sort(), ['grated-parmesan', 'romme']);
  const romme = sideForRad(rad('romme'), data, rader).rik;
  assert.match(romme, /<p>USDA lists 1 tbsp of sour cream as 12 g\. The calculator and the chart use the cup weight, which gives 14 g for 1 tbsp\.<\/p>/u);
  assert.match(sideForRad(rad('grated-parmesan'), data, rader).rik, /USDA lists 1 tbsp of grated parmesan as 5 g\. The calculator and the chart use the cup weight, which gives 6\.3 g for 1 tbsp\./u);
  for (const id of ['hvetemel', 'smor', 'salt', 'melk']) assert.equal(sideForRad(rad(id), data, rader).rik.includes('USDA lists 1 tbsp'), false, id);
});

test('«Ounces and fluid ounces» har tre setninger med ord for volum og vekt, og står ikke på hevemidlenes sider', () => {
  for (const r of rader) {
    const side = sideForRad(r, data, rader);
    const m = side.rik.match(/<h2>Ounces and fluid ounces<\/h2>\s*<p>([^<]*)<\/p>/u);
    if (erHevemiddel(r)) { assert.equal(m, null, r.id); continue; }
    assert.ok(m, r.id);
    assert.match(m[1], /^Fluid ounces measure volume, and ounces measure weight \(1 oz = 28\.35 g\)\. A cup holds 8 fl oz\. 1 cup of .+ weighs [\d.]+ oz\.$/u, r.id);
    assert.equal(side.rik.includes('Ounces: volume and weight'), false);
  }
  assert.deepEqual(sideForRad(rad('salt'), data, rader).faq[3], ['How many ounces does a cup of salt weigh?', "1 cup of salt weighs 10.3 oz. That's weight. By volume, a cup is 8 fl oz."]);
});

test('varianten står i ingress og beskrivelse, mens tittel og H1 beholder kortnavnet', () => {
  for (const [id, v, navn] of [['brunt-sukker', 'packed brown sugar', 'Brown sugar'], ['mandler', 'whole almonds', 'Almonds'], ['walnuts', 'chopped walnuts', 'Walnuts'], ['ris', 'uncooked long-grain white or brown rice', 'Rice'], ['melk', 'whole milk', 'Milk'], ['smor', 'salted butter', 'Butter']]) {
    const s = sideForRad(rad(id), data, rader);
    assert.ok(s.lead.includes(`of ${v} weighs`), id);
    assert.ok(s.description.includes(`of ${v} weighs`), id);
    assert.ok(s.h1.startsWith(`${navn}: `) && !s.h1.includes(v) || navn === v, id);
    assert.equal(s.title.includes(v), navn === v, id);
  }
  assert.equal(sideForRad(rad('vegetable-oil'), data, rader).h1, 'Vegetable oil (soybean): cups to grams');
});

test('USDA-postens navn står ordrett i USDA-tabellen og kildelinja, men uten «(Includes …)» i spørsmål og svar', () => {
  const s = sideForRad(rad('sammalt-hvetemel'), data, rader);
  const navn = "Wheat flour, whole-grain (Includes foods for USDA's Food Distribution Program)";
  assert.ok(s.rik.includes(`“${navn}.”`), 'USDA data: punktum innenfor anførselstegnet');
  assert.ok(s.topp.includes(`“Wheat flour, whole-grain.”`), 'kildelinja bruker kortnavnet, med punktum innenfor');
  assert.equal(/Includes/u.test(s.topp), false);
  for (const [q, a] of s.faq) assert.equal(/Includes/u.test(q + a), false);
});

test('titler høyst 60 tegn og beskrivelser 100 til 160, uten tankestrek, uten like titler og uten rester av markup', () => {
  const titler = new Set();
  for (const [navn, s] of sider()) {
    assert.ok(`${s.title} | Matlyst`.length <= 60, `${navn}: ${s.title.length + 10} tegn med « | Matlyst»: ${s.title}`);
    assert.ok(s.description.length >= 100 && s.description.length <= 160, `${navn}: beskrivelse ${s.description.length} tegn`);
    assert.equal(/[—–]/u.test(synligTekst(s)), false, `${navn}: tankestrek`);
    assert.equal(/undefined|NaN|\[object|<h2><\/h2>|null/u.test(synligTekst(s)), false, `${navn}: ugyldig tekst`);
    assert.equal(NORSKE_RESTORD.test(synligTekst(s)), false, `${navn}: norsk restord`);
    assert.equal(titler.has(s.title), false, `${navn}: lik tittel`);
    titler.add(s.title);
    assert.ok(s.faq.length >= 3 && s.faq.length <= 4, `${navn}: ${s.faq.length} spørsmål`);
    for (const [q, a] of s.faq) assert.ok(q.endsWith('?') && !/[<>]/u.test(q + a), `${navn}: ${q}`);
    assert.ok(s.h1.length > 0 && s.eyebrow && s.steg.length > 0, navn);
  }
});

test('titlene: «Flour: cups to grams (1 cup = 125 g)», for lang gir uten parentesen, hevemidlene uten, og lengden telles med « | Matlyst»', () => {
  assert.equal(sideForRad(rad('shredded-coconut'), data, rader).title, 'Sweetened shredded coconut: cups to grams');
  assert.equal(sideForRad(rad('cornmeal'), data, rader).title, 'Cornmeal (whole-grain yellow): cups to grams');
  assert.equal(sideForRad(rad('baking-powder'), data, rader).title, 'Baking powder and baking soda: teaspoons to grams');
  assert.equal(sideForRad(rad('sammalt-hvetemel'), data, rader).title, 'Whole wheat flour: cups to grams (1 cup = 120 g)');
  for (const r of rader.filter(erHevemiddel)) assert.equal(/\(1 /u.test(sideForRad(r, data, rader).title), false, r.id);
  for (const r of rader) assert.ok(`${sideForRad(r, data, rader).title} | Matlyst`.length <= 60, r.id);
  assert.equal(navSide(data, rader).title, `Cups to grams: chart for ${rader.length} ingredients`);
  assert.equal(navSide(data, rader).h1, 'Cups to grams');
});

test('strukturerte data: WebApplication, Article og faq, ingen HowTo og ingen brødsmuler (generatoren legger dem)', () => {
  const typer = (s) => s.schemas.map((x) => x['@type'] ?? x);
  assert.deepEqual(typer(sideForRad(rad('hvetemel'), data, rader)), ['WebApplication', 'Article', 'faq']);
  assert.deepEqual(typer(navSide(data, rader)), ['WebApplication', 'Article', 'ItemList', 'faq']);
  assert.equal(navSide(data, rader).schemas[2].numberOfItems, rader.length);
  const art = sideForRad(rad('hvetemel'), data, rader).schemas[1];
  assert.deepEqual(art.citation.map((c) => c.name), ['FoodData Central, SR Legacy']);
});

test('kilder: nummerert liste med utgiver, år, lenke og hentedato', () => {
  const s = sideForRad(rad('hvetemel'), data, rader);
  assert.match(s.rik, /<ol class="kilder" id="sources">/u);
  assert.match(s.rik, /U\.S\. Department of Agriculture, Agricultural Research Service\. FoodData Central, SR Legacy \(2019\)\. <a href="https:\/\/fdc\.nal\.usda\.gov\/" rel="noopener">fdc\.nal\.usda\.gov<\/a>\. Retrieved November 20, 2026\./u);
});

test('kalkulatorens data: varene står som [ord, gram per dl uavrundet], og kortformene er de avtalte', () => {
  const html = kalkHtmlEn({ rader, fast: rad('hvetemel') });
  const json = JSON.parse(html.match(/<script type="application\/json" class="kalk-data">([\s\S]*?)<\/script>/u)[1]);
  assert.deepEqual(json.varer, [['flour', 125 / 2.365882365]]);
  assert.equal(json.feil, 'Enter an amount, like 2 or 1/2.');
  assert.equal(json.brok, true);
  assert.deepEqual(json.kort, { cups: ['cup', 'cups'], tbsp: 'tbsp', tsp: 'tsp', floz: 'fl oz', ml: 'ml', g: 'g', oz: 'oz', lb: 'lb' });
  assert.deepEqual(json.steg, KALK_EN.steg);
  assert.deepEqual(json.steg.skje, ['1/2', '1', '2', '3', '4', '8']);
  assert.deepEqual(json.steg.floz, ['1', '2', '4', '6', '8', '16']);
  assert.match(html, /<b>Flour<\/b><\/span><a href="\/en\/tools\/cups-to-grams\/">Change ingredient<\/a>/u);
  for (const t of ['Cups', 'Tablespoons (tbsp)', 'Teaspoons (tsp)', 'Fluid ounces (fl oz)', 'Milliliters (ml)', 'Grams (g)', 'Ounces (oz)', 'Pounds (lb)']) assert.ok(html.includes(`>${t}</option>`), t);
  assert.match(html, /<button type="button" data-v="1\/4">1\/4 cup<\/button>.*<button type="button" data-v="1">1 cup<\/button><button type="button" data-v="2">2 cups<\/button>/u);
  const valg = kalkHtmlEn({ rader });
  assert.equal(JSON.parse(valg.match(/class="kalk-data">([\s\S]*?)<\/script>/u)[1]).varer.length, rader.length);
  assert.match(valg, /<option value="\d+" selected>Flour<\/option>/u);
});

test('samlesiden lister alle varene med lenke, med tabellen «What does 1 cup weigh?»', () => {
  const s = navSide(data, rader);
  for (const r of rader) assert.ok(s.rik.includes(`href="/en/tools/cups-to-grams/${r.slug}/"`), r.id);
  assert.match(s.rik, /<h2>What does 1 cup weigh\?<\/h2>/u);
  assert.match(s.rik, /<th scope="col">1 cup \(g\)<\/th><th scope="col">1 cup \(oz\)<\/th><th scope="col">1 tbsp \(g\)<\/th><th scope="col">1 tsp \(g\)<\/th>/u);
  assert.match(s.rik, /<td><a href="\/en\/tools\/cups-to-grams\/flour\/">Flour<\/a><\/td><td>125 g<\/td><td>4\.4 oz<\/td><td>7\.8 g<\/td><td>2\.6 g<\/td>/u);
  assert.match(s.topp, /<select data-felt="vare">/u);
  for (const h of ["Why cups don't all weigh the same", 'Where the numbers come from', 'Sources', 'Related conversions']) assert.ok(s.rik.includes(`<h2>${h}</h2>`), h);
});

test('appkortet har samme oppsett som det norske: overskrift, kort med tekst og telefonbilde, og bare setninger fra de engelske omregnersidene', () => {
  const oz = readFileSync(new URL('../en/tools/oz-to-ml/index.html', import.meta.url), 'utf8').replace(/<[^>]+>/gu, '');
  const bilder = JSON.parse(readFileSync(new URL('../images/en-guide/bilder.json', import.meta.url), 'utf8'));
  const alt = Object.values(bilder).find((v) => Object.values(v.files ?? {}).some((f) => f.file.startsWith('matlyst-settings-units-language-')))?.alt;
  for (const s of [sideForRad(rad('hvetemel'), data, rader), navSide(data, rader)]) {
    const kort = s.rik.match(/<h2>Stop converting by hand<\/h2>\s*<aside class="i-appen i-enheter">([\s\S]*?)<\/aside>/u)?.[1];
    assert.ok(kort, 'kortet står rett under overskriften');
    assert.match(kort, /<div class="i-appen-tekst"><p class="i-appen-tittel"><img src="\/images\/icon-64\.png" width="22" height="22" alt="">In Matlyst<\/p>/u);
    assert.match(kort, /<a class="more" href="\/en\/recipe-book-app\/">About the app<\/a>/u);
    assert.match(kort, /<div class="i-appen-media"><img class="tel" src="\/images\/en-guide\/matlyst-settings-units-language-400\.webp"/u);
    assert.ok(alt && kort.includes(`alt="${alt}"`), 'bildets alt-tekst står i bilder.json');
    for (const setning of kort.match(/<p>([^<]*)<\/p>/u)[1].split(/(?<=\.) /u)) assert.ok(oz.includes(setning), `setningen står på omregnersidene: ${setning}`);
  }
});

test('andre varer: åtte lenker pluss «All ingredients», aldri varen selv, nære varer først', () => {
  const s = sideForRad(rad('hvetemel'), data, rader);
  const b = s.rik.match(/<div class="related">[\s\S]*?<\/div>/u)[0];
  const lenker = [...b.matchAll(/href="([^"]+)"/gu)].map((m) => m[1]);
  assert.equal(lenker.length, 9);
  assert.equal(lenker.includes('/en/tools/cups-to-grams/flour/'), false);
  assert.equal(lenker.at(-1), '/en/tools/cups-to-grams/');
  assert.equal(lenker[0], '/en/tools/cups-to-grams/bread-flour/');
});

test('hver tekst-en-oppføring peker på en vare som finnes, og nære varer finnes', () => {
  for (const [id, t] of Object.entries(TEKST_EN)) {
    assert.ok(rad(id), id);
    for (const n of t.naer ?? []) assert.ok(rad(n), `${id} → ${n}`);
    assert.ok((t.naer ?? []).every((n) => vare(n).basis === vare(id).basis), `${id}: nære varer har samme grunnlag`);
  }
});

test('utregnetEn: tallreglene (hele gram, to gjeldende sifre under 10) og gram per dl uten avrunding', () => {
  const u = utregnetEn(rad('hvetemel'));
  assert.deepEqual(u.tabell[0], ['1 tsp', '2.6', ''], 'ounces bare fra 1 oz');
  assert.deepEqual(u.tabell.find(([e]) => e === '1/4 cup'), ['1/4 cup', '31', '1.1']);
  assert.deepEqual(u.tilbake, [[50, '0.4'], [100, '0.8'], [250, '2'], [500, '4']]);
  assert.equal(u.gPerDl, 125 / 2.365882365);
  assert.equal(u.oz, '4.4');
});

test('språk: spørsmålet om nær vare, nabolista, tablespoon-spørsmålet, hurtigknappene for teaspoon og amerikansk tegnsetting', () => {
  const faq = (id) => sideForRad(rad(id), data, rader).faq;
  assert.deepEqual(faq('hvetemel')[3], ['Does a cup of flour weigh the same as a cup of bread flour?', '1 cup of all-purpose flour weighs 125 g, and 1 cup of bread flour weighs 137 g.']);
  assert.deepEqual(faq('blueberries')[3].slice(0, 1), ['Does a cup of blueberries weigh the same as a cup of mashed banana?']);
  for (const [id, naer] of [['active-dry-yeast', 'baking-powder'], ['breadcrumbs', 'hvetemel'], ['rosiner', 'mandler'], ['shredded-coconut', 'mandler'], ['havregryn', 'ris']]) {
    assert.equal((TEKST_EN[id]?.naer ?? []).includes(naer), false, `${id} har ikke ${naer} som nabo`);
  }
  assert.equal(faq('active-dry-yeast').length, 3, 'hevemiddel uten nær vare: ingen ounces-spørsmål');
  assert.equal(faq('hvetemel')[2][0], 'How many grams are in a tablespoon of flour?');
  assert.equal(faq('hvetemel')[2][1], '1 tablespoon weighs 7.8 g, and 1 teaspoon weighs 2.6 g. Both are calculated from the cup weight.');
  assert.equal(faq('baking-powder')[2][1], '1 tablespoon is 3 teaspoons, so it weighs 14 g.');
  assert.equal(faq('baking-powder')[0][1], '1 teaspoon of double-acting baking powder or baking soda weighs 4.6 g (0.16 oz).');
  const kalkTsp = sideForRad(rad('baking-powder'), data, rader).topp;
  assert.match(kalkTsp, /data-v="1\/4">1\/4 tsp<\/button><button type="button" data-v="1\/2">1\/2 tsp<\/button><button type="button" data-v="3\/4">3\/4 tsp<\/button><button type="button" data-v="1">1 tsp<\/button><button type="button" data-v="1 1\/2">1 1\/2 tsp<\/button><button type="button" data-v="2">2 tsp<\/button>/u);
  assert.deepEqual(KALK_EN.steg.skje, ['1/2', '1', '2', '3', '4', '8'], 'tablespoon som før');
  assert.equal(KALK_EN.stegFor.tsp, 'tsp');
  // Punktum og komma står innenfor avsluttende anførselstegn, og ingen side har «.” » eller «”.» (punktum etter lukket anførselstegn).
  for (const [id, side] of sider()) assert.equal(/”[.,]/u.test(synligTekst(side)), false, `${id}: punktum eller komma utenfor anførselstegn`);
  assert.match(sideForRad(rad('smor'), data, rader).topp, /“Butter, salted\.”<\/p>/u);
  // 1 kilogram skrives med amerikansk tusenskille.
  assert.match(sideForRad(rad('hvetemel'), data, rader).rik, /1 kilogram \(1,000 g\) is 8 cups\./u);
  const nav = navSide(data, rader);
  assert.equal(nav.lead, "What a cup weighs depends on what's in it. Pick an ingredient, then type an amount to convert.");
  assert.match(nav.rik, /<p>Pick an ingredient for a full chart and grams to cups\.<\/p>/u);
  assert.match(nav.rik, /That's why each ingredient needs its own number\./u);
  assert.match(nav.rik, /USDA gives a teaspoon weight for baking powder, baking soda, and active dry yeast, so their cup weights are calculated from that\./u);
});

test('USDA data: overskrift, innledning og «Similar ingredients», og «USDA entries» er borte', () => {
  const rik = sideForRad(rad('hvetemel'), data, rader).rik;
  assert.match(rik, /<h2>USDA data<\/h2>\s*<p>USDA FoodData Central, SR Legacy, FDC ID 168894: “Wheat flour, white, all-purpose, enriched, bleached\.” Portions are listed in USDA's own wording\.<\/p>/u);
  assert.match(rik, /<p>Similar ingredients: <a href="[^"]+">Bread flour<\/a>, <a href="[^"]+">Whole wheat flour<\/a>\.<\/p>/u);
  for (const [id, side] of sider()) assert.equal(/USDA entries|Close entries|Every portion/u.test(JSON.stringify(side)), false, id);
});

test('varianten står i ingress, beskrivelse, short answer og spørsmål 1 (og i de få svarene som sammenligner), ellers brukes kortordet', () => {
  const ris = sideForRad(rad('ris'), data, rader);
  assert.equal(synligTekst(ris).split('uncooked long-grain white or brown rice').length - 1, 4);
  for (const r of rader) {
    const v = vare(r.id).variant;
    if (v === vare(r.id).ord) continue;
    const n = synligTekst(sideForRad(r, data, rader)).split(v).length - 1;
    assert.ok(n <= 6, `${r.id}: «${v}» står ${n} ganger`);
  }
});

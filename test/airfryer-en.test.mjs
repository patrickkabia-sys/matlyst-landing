// Familien «airfryer» på amerikansk engelsk (en-US): /en/air-fryer/ med omregner i Fahrenheit, omregningssiden og én side per søk.
// Tallene er hentet fra amerikanske kilder (Cosori, KitchenAid, Instant Pot, Philips, Mississippi State og Illinois Extension, USDA FSIS), ikke oversatt fra norsk.
// Fahrenheit først, Celsius i parentes. Omregningsregelen har navngitt kilde, kjøtt og fisk sier at termometeret avgjør. Den generelle tallvakten og likhetsvakten står i test/familier.test.mjs;
// sitatkontrollen mot kildene kjøres med scripts/familier/airfryer/kildekontroll.mjs en.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import { fileURLToPath } from 'node:url';
import { lesData, publiserbare } from '../scripts/familier/felles.mjs';
import { FAMILIER, familieForSti, familieGrupper, familieSider } from '../scripts/familier/register.mjs';
import { avvik } from '../scripts/familier/airfryer/kildekontroll.mjs';
import { hjelpere, tillatteTall } from '../scripts/familier/airfryer/mal-en.mjs';
import { kontrollerRegel, OVN_TABELL } from '../scripts/familier/airfryer/tekst-en.mjs';
import { synligTekst, tallUtenforData } from './hjelp/familievakt.mjs';

const ROT = fileURLToPath(new URL('..', import.meta.url));
const FAMILIE = FAMILIER.find((f) => f.id === 'airfryer');
const data = lesData(fileURLToPath(FAMILIE.mappe), 'en');
const rader = publiserbare(data);
const rad = (id) => rader.find((r) => r.id === id);
const sider = await familieSider('en', [FAMILIE]);
const html = (slug = '') => readFileSync(join(ROT, 'en/air-fryer', slug, 'index.html'), 'utf8');
const hoved = (slug = '') => html(slug).match(/<main[\s\S]*?<\/main>/u)?.[0] ?? '';
const tekst = (slug = '') => hoved(slug).replace(/<script[\s\S]*?<\/script>/gu, ' ').replace(/<[^>]+>/gu, ' ').replace(/&amp;/gu, '&').replace(/\s+/gu, ' ');

const SLUGS = ['oven-to-air-fryer', 'chicken-breast', 'chicken-thighs', 'chicken-wings', 'salmon', 'french-fries', 'bacon', 'hot-dogs', 'burgers', 'pork-chops', 'steak', 'shrimp', 'vegetables', 'baked-potato', 'frozen-foods', 'hard-boiled-eggs', 'reheat-pizza-leftovers'];
const ADRESSER = ['/en/air-fryer/', ...SLUGS.map((s) => `/en/air-fryer/${s}/`)];
// Radene der kilden gir en trygg kjernetemperatur (USDA FSIS), og feltet tallet står i.
const MED_KJERNE = { kyllingfilet: 'kjerne', kyllinglar: 'kjerne', kyllingvinger: 'kjerne', laks: 'kjerne', shrimp: 'kjerne', hamburger: 'kjerne', svinekoteletter: 'kjerne', biff: 'kjerne', 'reheat-pizza-leftovers': 'kjerne' };
const DOMENER = /^https:\/\/(?:www\.)?(?:cosori\.com|kitchenaid\.com|instantpot\.com|usa\.philips\.com|extension\.msstate\.edu|extension\.illinois\.edu|idahopotato\.com|fsis\.usda\.gov)\//u;

/** Brudd på temperaturregelen: en °C-verdi som ikke står i parentes rett etter en °F-verdi. */
export const temperaturBrudd = (t) => [...t.matchAll(/-?\d+\s?°C/gu)].filter((m) => !/\d°F \($/u.test(t.slice(Math.max(0, m.index - 8), m.index))).map((m) => m[0]);

test('adressene er låst: samleside, omregningssiden og 16 søkesider under /en/air-fryer/, alle i sitemap-en.xml med canonical', () => {
  assert.deepEqual(FAMILIE.markeder.en, { rot: 'air-fryer/' });
  assert.deepEqual(Object.keys(sider).map((s) => `/en/${s}`), ADRESSER);
  assert.equal(ADRESSER.length, 18);
  const kart = readFileSync(join(ROT, 'sitemap-en.xml'), 'utf8');
  for (const a of ADRESSER) {
    assert.match(kart, new RegExp(`<loc>https://matlyst-app\\.no${a}</loc>`, 'u'), a);
    assert.equal(familieForSti(a), 'airfryer', a);
    assert.match(html(a.replace('/en/air-fryer/', '')), new RegExp(`<link rel="canonical" href="https://matlyst-app\\.no${a}">`, 'u'), a);
  }
  assert.doesNotMatch(readFileSync(join(ROT, 'sitemap.xml'), 'utf8'), /\/en\/air-fryer\//u, 'det norske sitemapet har ingen engelske sider');
});

test('samlesiden står i llms.txt under de engelske sidene, enkeltsidene gjør det ikke', () => {
  const llms = readFileSync(join(ROT, 'llms.txt'), 'utf8');
  assert.match(llms, /\]\(https:\/\/matlyst-app\.no\/en\/air-fryer\/\)/u);
  assert.doesNotMatch(llms, /matlyst-app\.no\/en\/air-fryer\/[a-z]/u);
});

test('hvert tall har kilde hos en navngitt produsent, universitet eller myndighet, med sitat, lenke, årstall og lesedato', () => {
  for (const [id, k] of Object.entries(data.kilder)) {
    assert.match(k.adresse, DOMENER, id);
    assert.ok(k.aar >= 2013 && k.aar <= 2026, `${id}: år ${k.aar}`);
    assert.match(k.hentet, /^2026-\d\d-\d\d$/u, id);
  }
  let antall = 0;
  for (const r of rader) {
    for (const [felt, t] of Object.entries(r.tall)) {
      antall += 1;
      assert.ok(Object.hasOwn(data.kilder, t.kilde), `${r.id}/${felt}: kilden ${t.kilde} mangler`);
      assert.ok(t.merknad && t.merknad.length >= 10, `${r.id}/${felt}: mangler sitatet fra kilden`);
    }
    for (const [nokkel, sitat] of Object.entries(r.tekst ?? {})) {
      assert.ok(Object.hasOwn(data.kilder, nokkel.split(':')[0]), `${r.id}/${nokkel}: ukjent kilde`);
      assert.ok(sitat.length >= 10, `${r.id}/${nokkel}: mangler sitatet`);
    }
  }
  assert.ok(antall > 250, `bare ${antall} tall`);
});

test('avvik() er rød når et sitat ikke står hos kilden (sitatkontrollen kan bli rød)', () => {
  const prove = { rader: [{ id: 'x', tall: { a: { verdi: 390, enhet: '°F', kilde: 'k', merknad: 'Breasts | 390°F | 15–22 min' } }, tekst: { 'k:t': 'Internal temperature is what confirms food is done.' } }] };
  const kilde = 'Breasts | 390°F | 15–22 min Internal temperature is what confirms food is done.';
  assert.deepEqual(avvik(prove, { k: [kilde] }), []);
  assert.deepEqual(avvik(prove, { k: [kilde.replace('390', '400')] }).map((a) => a.felt), ['a']);
  assert.deepEqual(avvik(prove, { k: [kilde.replace('Internal', 'External')] }).map((a) => a.felt), ['k:t']);
});

test('hvert tall på hver side står i datafila, og Fahrenheit står først med Celsius i parentes', () => {
  for (const [nokkel, side] of Object.entries(sider)) {
    const r = rader.find((x) => nokkel === `air-fryer/${x.slug}/`);
    const tillatte = r ? tillatteTall(r, data) : new Set(rader.flatMap((x) => [...tillatteTall(x, data)]));
    assert.deepEqual(tallUtenforData(side, tillatte), [], nokkel);
    assert.deepEqual(temperaturBrudd(synligTekst(side)), [], nokkel);
  }
});

test('temperaturregelen kan bli rød: Celsius først eller uten parentes feiler', () => {
  assert.deepEqual(temperaturBrudd('Set it to 390°F (199°C) for a while.'), []);
  assert.deepEqual(temperaturBrudd('Set it to 199°C.'), ['199°C']);
  assert.deepEqual(temperaturBrudd('Set it to 199°C (390°F).'), ['199°C']);
});

test('malen kaster når et tall eller et utsagn ikke står i datafila (prosaen kan ikke skrive et tall uten kilde)', () => {
  const h = hjelpere(rad('kyllingfilet'), data);
  assert.match(h.t('c-temp'), /^390°F \(199°C\)$/u);
  assert.equal(h.t('c-tid'), '15 to 22 minutes');
  assert.throws(() => h.t('finnes-ikke'), /finnes ikke i datafila/u);
  assert.throws(() => h.k('finnes-ikke'), /finnes ikke i datafila/u);
  assert.throws(() => h.u('finnes:ikke'), /finnes ikke i datafila/u);
  // En forskjell i grader er ikke en temperatur: ingen Celsius.
  assert.equal(hjelpere(rad('ovn-til-airfryer'), data).t('ka-grad'), '25°F');
  assert.equal(hjelpere(rad('ovn-til-airfryer'), data).t('il-grad'), '25 to 30°F');
});

test('ingen norske kilder, ingen tankestrek, ingen emoji, kildeliste med lenke og lesedato, og ingen forfatterlinje eller Person-forfatter', () => {
  for (const a of ADRESSER) {
    const slug = a.replace('/en/air-fryer/', '');
    const t = tekst(slug);
    assert.doesNotMatch(t, /[—–]/u, a);
    assert.doesNotMatch(t, /\p{Extended_Pictographic}/u, a);
    assert.doesNotMatch(t, /Mattilsynet|MatPrat|Gilde|Findus|Patrick Kabia|kjøletekniker/u, a);
    const kilder = /<ol class="kilder" id="kilder">([\s\S]*?)<\/ol>/u.exec(html(slug))?.[1] ?? '';
    const punkter = [...kilder.matchAll(/<li>([\s\S]*?)<\/li>/gu)].map((m) => m[1]);
    assert.ok(punkter.length > 0, `${a}: mangler kildeliste`);
    for (const li of punkter) assert.match(li, /<a href="https:\/\/[^"]+" rel="noopener">[^<]+<\/a> \(\d{4}\)\. Accessed [A-Z][a-z]+ \d{1,2}, \d{4}\./u, a);
    assert.doesNotMatch(html(slug), /"@type":\s?"Person"/u, `${a}: engelske sider har ikke Person-forfatter`);
    assert.doesNotMatch(html(slug), /Av <a href="\/om\/">/u, a);
    // Siden sier at tidene er veiledende.
    assert.match(t, /starting point|place to start/u, `${a}: sier ikke at tidene er et utgangspunkt`);
  }
});

test('hver kilde en side bruker står i kildelista med lenke og år', () => {
  for (const r of rader) {
    const slug = r.slug;
    const liste = /<ol class="kilder" id="kilder">([\s\S]*?)<\/ol>/u.exec(html(slug))[1];
    const brukt = new Set([...Object.values(r.tall).map((t) => t.kilde), ...Object.keys(r.tekst ?? {}).map((n) => n.split(':')[0])]);
    // Kilder bare en delt sitatnøkkel (tekst) peker på, er ikke alltid nevnt på siden; men alle tall-kildene skal stå.
    for (const id of new Set(Object.values(r.tall).map((t) => t.kilde))) {
      const k = data.kilder[id];
      assert.ok(liste.includes(`href="${k.adresse}"`), `${r.id}: kilden ${id} mangler i kildelista`);
      assert.ok(liste.includes(`(${k.aar})`), `${r.id}: år for ${id}`);
    }
    assert.ok(brukt.size > 0, r.id);
  }
});

test('kjøtt, fisk og rester sier at termometeret avgjør, med USDA-tallet fra datafila', () => {
  for (const [id, felt] of Object.entries(MED_KJERNE)) {
    const r = rad(id);
    const side = tekst(r.slug);
    assert.match(side, /The temperature decides, not the clock\./u, id);
    assert.ok(side.includes(`${r.tall[felt].verdi}°F`), `${id}: ${r.tall[felt].verdi}°F står ikke på siden`);
    assert.match(side, /USDA FSIS \(2025\)|Illinois Extension \(2024\)/u, `${id}: sier ikke hvem som oppgir temperaturen`);
  }
  // Der kilden ikke har en kjernetemperatur, sier siden det i stedet for å gjette.
  assert.match(tekst('bacon'), /We did not find a source with an air fryer doneness temperature for bacon/u);
  assert.match(tekst(), /The USDA chart does not list bacon, hot dogs, vegetables, or potatoes/u);
  assert.match(tekst('hot-dogs'), /The source gives no temperature in that passage, so we list none/u);
});

test('kilder som spriker står side om side i samme tabell, hver med kildenavn og årstall', () => {
  const kf = hoved('chicken-breast').match(/<table class="sprik">[\s\S]*?<\/table>/u)[0];
  const r = rad('kyllingfilet');
  assert.match(kf, /Cosori \(2026\)<\/th><td>Boneless, eight to ten ounces<\/td><td>390°F \(199°C\)<\/td><td>15 to 22 minutes<\/td>/u);
  assert.match(kf, /Mississippi State Extension \(2024\)<\/th><td>Size not given<\/td><td>380°F \(193°C\)<\/td><td>12 minutes<\/td>/u);
  assert.match(kf, /Philips \(2013\)<\/th><td>Size not given<\/td><td>360°F \(182°C\)<\/td><td>10 to 15 minutes<\/td>/u);
  assert.equal(r.tall['c-temp'].verdi, 390);
  const biff = tekst('steak');
  assert.match(biff, /Cosori \(2026\) lists the internal temperature of steak as 130°F \(54°C\) to 145°F \(63°C\)/u);
  assert.match(biff, /USDA FSIS \(2025\) lists 145°F \(63°C\) as the minimum/u);
  const potet = hoved('baked-potato').match(/<table class="sprik">[\s\S]*?<\/table>/u)[0];
  assert.match(potet, /Idaho Potato Commission \(2019\)[\s\S]*400°F \(204°C\)[\s\S]*30 to 40 minutes[\s\S]*Cosori \(2026\)[\s\S]*385°F \(196°C\)[\s\S]*50 to 60 minutes/u);
  for (const slug of ['chicken-wings', 'french-fries', 'burgers', 'bacon', 'pork-chops', 'frozen-foods', 'vegetables']) {
    const kilderITabell = new Set([...hoved(slug).matchAll(/<th scope="row">([^<]+?) \(\d{4}\)<\/th>/gu)].map((m) => m[1]));
    assert.ok(kilderITabell.size >= 2, `${slug}: tabellen har bare én kilde`);
  }
});

test('omregningsregelen har navngitt kilde (KitchenAid og Illinois Extension), og de tre reglene står side om side', () => {
  const side = hoved('oven-to-air-fryer');
  const ovn = rad('ovn-til-airfryer');
  assert.equal(ovn.tall['ka-grad'].verdi, 25);
  assert.equal(ovn.tall['ka-prosent'].verdi, 20);
  const tab = side.match(/<table class="sprik">[\s\S]*?<\/table>/u)[0];
  assert.match(tab, /KitchenAid \(2026\)<\/th><td>Conventional oven recipes<\/td><td>25°F<\/td><td>20 percent shorter<\/td>/u);
  assert.match(tab, /Illinois Extension \(2024\)<\/th><td>Conventional oven recipes<\/td><td>25 to 30°F<\/td><td>20 percent shorter<\/td>/u);
  assert.match(tab, /Philips \(2013\)<\/th><td>Pre-made packaged foods<\/td><td>70°F<\/td><td>50 percent shorter<\/td>/u);
  const kilder = /<ol class="kilder" id="kilder">([\s\S]*?)<\/ol>/u.exec(side)[1];
  assert.match(kilder, /KitchenAid: <a href="https:\/\/www\.kitchenaid\.com\/[^"]+" rel="noopener">[^<]+<\/a> \(2026\)/u);
  assert.match(kilder, /University of Illinois Extension: <a href="https:\/\/extension\.illinois\.edu\/[^"]+" rel="noopener">[^<]+<\/a> \(2024\)/u);
  // Eksempelradene er regnet med regelen, og siden sier at de er vår utregning.
  assert.match(tekst('oven-to-air-fryer'), /These examples are our arithmetic, using the rule from KitchenAid \(2026\)/u);
  const o = OVN_TABELL(ovn);
  assert.deepEqual(o.temper.map((x) => x.af), o.temper.map((x) => x.ovn - 25));
  assert.deepEqual(o.tider.map((x) => x.af), [8, 16, 24, 36, 48]);
});

test('regelvakten er rød når KitchenAid og Illinois ikke er enige (ingen kilde som stemmer, ingen omregner)', () => {
  const ovn = rad('ovn-til-airfryer');
  kontrollerRegel(ovn);
  const brattere = structuredClone(ovn);
  brattere.tall['ka-grad'].verdi = 40;
  assert.throws(() => kontrollerRegel(brattere), /utenfor Illinois-regelen/u);
  const kortere = structuredClone(ovn);
  kortere.tall['ka-prosent'].verdi = 30;
  assert.throws(() => kontrollerRegel(kortere), /ikke enige om tiden/u);
});

// Kjører skriptet mot et minimalt DOM-uttrekk: to felt og en svarlinje.
function kjorOmregner(temp, tid, slug = 'oven-to-air-fryer') {
  const kode = readFileSync(join(ROT, 'airfryer-omregner.js'), 'utf8');
  const skjemaData = html(slug).match(/<script type="application\/json" data-oaf-data>([\s\S]*?)<\/script>/u)[1];
  const felt = (verdi) => ({ value: verdi, addEventListener: (n, f) => { felt.alle.push(f); } });
  felt.alle = [];
  const f1 = felt(String(temp)); const f2 = felt(String(tid));
  const svar = { textContent: '', replaceChildren(...d) { this.textContent = d.map((x) => x.textContent).join(''); } };
  const nye = [];
  const dok = {
    querySelectorAll: () => [{ querySelector: (v) => (v.includes('data-oaf-data') ? { textContent: skjemaData } : v.includes('"temp"') ? f1 : v.includes('"tid"') ? f2 : v.includes('"svar"') ? svar : null) }],
    createTextNode: (t) => ({ textContent: t }),
    createElement: () => { const e = { textContent: '' }; nye.push(e); return e; },
  };
  runInNewContext(kode, { document: dok });
  felt.alle[0]();
  return { svar: svar.textContent, fet: nye.map((e) => e.textContent) };
}

test('omregneren: 25°F lavere og 20 prosent kortere, Celsius i parentes, og meldinger når tallene mangler', () => {
  assert.deepEqual(kjorOmregner(400, 30).fet, ['375°F (191°C)', '24 minutes']);
  assert.deepEqual(kjorOmregner(350, 45).fet, ['325°F (163°C)', '36 minutes']);
  assert.deepEqual(kjorOmregner('425', '20').fet, ['400°F (204°C)', '16 minutes']);
  assert.deepEqual(kjorOmregner(400, 30, '').fet, ['375°F (191°C)', '24 minutes'], 'samlesiden har den samme omregneren');
  assert.match(kjorOmregner('abc', 30).svar, /Enter the oven temperature in °F as a number\./u);
  assert.match(kjorOmregner(20, 30).svar, /Enter the oven temperature/u);
  assert.match(kjorOmregner(400, 'x').svar, /Enter the time in minutes as a number\./u);
});

test('omregneren er statisk først: ingen tall i feltene, ingen class, regelen som data fra datafila', () => {
  for (const slug of ['', 'oven-to-air-fryer']) {
    const skjema = html(slug).match(/<form data-oaf[\s\S]*?<\/form>/u)[0];
    assert.doesNotMatch(skjema, /\sclass=/u, `${slug}: skjemaet har class`);
    assert.doesNotMatch(skjema, /\svalue=/u, `${slug}: feltene har en forhåndsverdi som ikke har kilde`);
    assert.match(skjema, /aria-live="polite"/u);
    const json = JSON.parse(skjema.match(/data-oaf-data>([\s\S]*?)<\/script>/u)[1]);
    assert.deepEqual(json.regel, { grad: rad('ovn-til-airfryer').tall['ka-grad'].verdi, prosent: rad('ovn-til-airfryer').tall['ka-prosent'].verdi });
    assert.match(skjema, /The rule is from KitchenAid \(2026\), and Illinois Extension \(2024\) gives the same numbers\./u);
  }
  assert.match(html('oven-to-air-fryer'), /<link rel="stylesheet" href="\/airfryer-omregner\.css">/u);
  assert.match(html('oven-to-air-fryer'), /<script src="\/airfryer-omregner\.js" defer><\/script>/u);
});

test('samme rad-id på nb og en gir hreflang, og en vare uten norsk motstykke står alene', () => {
  const grupper = familieGrupper();
  const g = (navn) => grupper.find((x) => x.id === navn);
  assert.deepEqual(g('auto-fam-airfryer-egg').sider, { nb: '/airfryer/egg/', sv: '/sv/airfryer/koka-agg/', da: '/da/airfryer/aeg/', en: '/en/air-fryer/hard-boiled-eggs/' });
  assert.deepEqual(g('auto-fam-airfryer-ovn-til-airfryer').sider, { nb: '/airfryer/ovn-til-airfryer/', sv: '/sv/airfryer/ugn-till-airfryer/', da: '/da/airfryer/ovn-til-airfryer/', en: '/en/air-fryer/oven-to-air-fryer/' });
  assert.deepEqual(g('auto-fam-airfryer-nav').sider, { nb: '/airfryer/', sv: '/sv/airfryer/', da: '/da/airfryer/', en: '/en/air-fryer/' });
  assert.deepEqual(g('auto-fam-airfryer-shrimp').sider, { en: '/en/air-fryer/shrimp/' });
  assert.deepEqual(g('auto-fam-airfryer-baked-potato').sider, { en: '/en/air-fryer/baked-potato/' });
  assert.deepEqual(g('auto-fam-airfryer-reheat-pizza-leftovers').sider, { en: '/en/air-fryer/reheat-pizza-leftovers/' });
  assert.match(html('chicken-breast'), /hreflang="nb-NO" href="https:\/\/matlyst-app\.no\/airfryer\/kyllingfilet\/"/u);
});

test('lenker: samlesiden lenker til alle sidene, hver side lenker til samlesiden og til bloggartikkelen, og bloggforsiden lenker til samlesiden', () => {
  const hub = html();
  for (const s of SLUGS) assert.ok(hub.includes(`href="/en/air-fryer/${s}/"`), `samlesiden lenker ikke til ${s}`);
  for (const s of SLUGS) {
    const side = html(s);
    assert.ok(side.includes('href="/en/air-fryer/"'), `${s}: lenker ikke til samlesiden`);
    assert.ok(side.includes('href="/en/blog/oven-to-air-fryer/"'), `${s}: lenker ikke til bloggartikkelen`);
  }
  assert.ok(readFileSync(join(ROT, 'en/blog/index.html'), 'utf8').includes('href="/en/air-fryer/"'), 'bloggforsiden lenker ikke til samlesiden');
  // Kjernetemperatur: hver kjøtt- og fiskeside lenker til riktig side under /en/internal-temperature/, og samlesiden til oversikten.
  const TEMP = { 'chicken-breast': 'chicken', 'chicken-thighs': 'chicken', 'chicken-wings': 'chicken', salmon: 'salmon', burgers: 'ground-beef', 'pork-chops': 'pork', steak: 'steak', 'reheat-pizza-leftovers': 'leftovers', shrimp: '' };
  for (const [s, t] of Object.entries(TEMP)) {
    assert.ok(html(s).includes(`href="/en/internal-temperature/${t ? `${t}/` : ''}"`), `${s}: lenker ikke til /en/internal-temperature/${t}`);
  }
  assert.ok(hub.includes('href="/en/internal-temperature/"'), 'samlesiden lenker ikke til temperaturoversikten');
});

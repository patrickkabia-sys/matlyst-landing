// Högtidssidorna /sv/julbord/ och /sv/nyarsmiddag/. Regeln är densamma som för /julebord/ och /nyttarsmiddag/ (test/hoytider-nb.test.mjs):
// VARJE siffra på sidan har källa, adress, datum och hämtdatum i en lista, och citatet från källan ligger i datafilen.
// Siffrorna är hämtade från svenska källor (Livsmedelsverket först), inte översatta från norska.
// Källorna öppnades och lästes 2026-11-21. Kontrollen mot nätet: node scripts/nb-jul/kildekontroll-hoytider.mjs sv
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { SIDEGRUPPER, alternativerFor } from '../scripts/locale-sider.mjs';
import { sidetype } from '../scripts/sidetyper.mjs';
import { lagMarked } from '../scripts/nb-jul/hoytid-felles.mjs';
import { avvik } from '../scripts/nb-jul/kildekontroll-hoytider.mjs';
import * as julbord from '../scripts/sv-jul/julbord.mjs';
import * as nyar from '../scripts/sv-jul/nyarsmiddag.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const { DATA, HENTET, HENTET_TEKST } = lagMarked('sv');
const SIDER = [
  { sti: '/sv/julbord/', nb: '/julebord/', da: '/da/julefrokost/', mod: julbord },
  { sti: '/sv/nyarsmiddag/', nb: '/nyttarsmiddag/', mod: nyar },
];

const synlig = (t) => t.replace(/<!--[\s\S]*?-->/gu, ' ').replace(/<script[\s\S]*?<\/script>/gu, ' ').replace(/<style[\s\S]*?<\/style>/gu, ' ')
  .replace(/<\/(?:h[1-6]|p|li|summary|div|section|header|th|td|dt|dd)>/gu, ' ¶ ').replace(/<[^>]+>/gu, ' ')
  .replace(/&#?\w+;/gu, (e) => ({ '&amp;': '&', '&quot;': '"', '&#39;': '’' })[e] ?? ' ').replace(/\s+/gu, ' ');
const utanBevis = (t) => t.replace(/<!-- app-bevis:start -->[\s\S]*?<!-- app-bevis:slutt -->/gu, ' ');
const MANADER = 'januari|februari|mars|april|maj|juni|juli|augusti|september|oktober|november|december';
const UTGIVARE = { 'Livsmedelsverket': /^lv-/u, 'Svenskt Kött': /^sk-/u, 'Svensk Fågel': /^sf-/u, 'Arla': /^arla-/u };
// Tal som inte är måttsiffror: datum, årtal, klockslag (uträknade från källans tider) och Matlysts egen omräkning (1 till 20 portioner).
const INTE_MATTAL = [/\b(?:Livsmedelsverket|Svenskt Kött|Svensk Fågel|Arla) \(\d{4}\)/gu, new RegExp(`\\b\\d{1,2} (?:${MANADER})(?: \\d{4})?`, 'gu'), /\b2026\b/gu, /\bkl\. \d{2}\.\d{2}\b/gu, /\bmellan 1 och 20 portioner\b/gu];

/** Tal i texten som varken står i `tall` (visningsform) eller är ett datum eller ett klockslag. */
export function tallUtanKalla(text, tall = DATA.tall) {
  let rest = text;
  for (const vis of [...new Set(Object.values(tall).map((x) => x.vis))].sort((a, b) => b.length - a.length)) rest = rest.split(vis).join(' ');
  for (const re of INTE_MATTAL) rest = rest.replace(re, ' ');
  return rest.match(/[^\s]*\d[^\s]*/gu) ?? [];
}

const celler = (tab) => [...tab.matchAll(/<tr>([\s\S]*?)<\/tr>/gu)].slice(1).map(([, r]) => [...r.matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gu)].map(([, c]) => c));
const fmt = (g) => (g >= 1000 ? `${g / 1000} kg`.replace('.', ',') : `${g} g`);

for (const { sti, nb, da, mod } of SIDER) {
  const html = readFileSync(join(ROOT, `${sti.slice(1)}index.html`), 'utf8');
  const hoved = html.match(/<main[\s\S]*?<\/main>/u)?.[0] ?? '';
  const kort = [...hoved.matchAll(/<div class="scenario" id="kilde-([^"]+)">([\s\S]*?)<\/div>/gu)].map(([, id, innehall]) => ({ id, innehall }));
  const tabeller = [...hoved.matchAll(/<table>[\s\S]*?<\/table>/gu)].map(([t]) => t);
  const brukt = mod.BRUKT();
  const prosa = (() => {
    let t = utanBevis(hoved);
    for (const k of kort) t = t.replace(`<div class="scenario" id="kilde-${k.id}">${k.innehall}</div>`, ' ');
    for (const tab of tabeller) t = t.replace(tab, ' ');
    return synlig(t);
  })();
  const tallSomBrukt = Object.fromEntries(brukt.tall.map((id) => [id, DATA.tall[id]]));

  test(`${sti}: egen sidgrupp med hreflang mot ${nb}, i sitemap-sv och llms.txt, och ingen annan språksitemap`, () => {
    const grupp = SIDEGRUPPER.find(({ sider }) => sider.sv === sti);
    assert.ok(grupp, 'saknas i SIDEGRUPPER');
    assert.deepEqual(grupp.sider, { nb, sv: sti, ...(da ? { da } : {}) });
    assert.deepEqual(alternativerFor(sti), [['nb-NO', nb], ['sv-SE', sti], ...(da ? [['da-DK', da]] : []), ['x-default', nb]]);
    assert.ok(html.includes(`<link rel="alternate" hreflang="nb-NO" href="https://matlyst-app.no${nb}">`));
    assert.ok(html.includes(`<link rel="alternate" hreflang="sv-SE" href="https://matlyst-app.no${sti}">`));
    assert.ok(html.includes(`<link rel="canonical" href="https://matlyst-app.no${sti}">`));
    for (const mapp of da ? ['en'] : ['da', 'en']) assert.doesNotMatch(readFileSync(join(ROOT, `sitemap-${mapp}.xml`), 'utf8'), new RegExp(sti.slice(4)));
    assert.match(readFileSync(join(ROOT, 'sitemap-sv.xml'), 'utf8'), new RegExp(`<loc>https://matlyst-app\\.no${sti}</loc>\\s*<lastmod>2026-11-2\\d</lastmod>`, 'u'));
    assert.ok(readFileSync(join(ROOT, 'llms.txt'), 'utf8').includes(`(https://matlyst-app.no${sti})`));
    assert.ok(readFileSync(join(ROOT, nb.slice(1), 'index.html'), 'utf8').includes(`<link rel="alternate" hreflang="sv-SE" href="https://matlyst-app.no${sti}">`), 'den norska sidan pekar hit');
  });

  test(`${sti}: sidtypen är guide-lang, titel och beskrivning har tillåten längd, ingen författarlinje (Organization) och appkortet finns`, () => {
    assert.equal(sidetype(sti, html), 'guide-lang');
    const titel = html.match(/<title>([^<]*)<\/title>/u)[1];
    const meta = html.match(/<meta name="description" content="([^"]*)">/u)[1];
    assert.ok(titel.length <= 60, `titel ${titel.length}`);
    assert.ok(meta.length >= 100 && meta.length <= 160, `meta ${meta.length}`);
    assert.doesNotMatch(html, /Av <a href="\/om\/">Patrick Kabia<\/a>/u);
    assert.match(html, /<!-- app-bevis:start -->/u);
    assert.match(html, /<html lang="sv"/u);
    assert.match(html, /<meta property="og:image" content="https:\/\/matlyst-app\.no\/images\/delebilde\//u);
  });

  test(`${sti}: strukturerade data är BreadcrumbList och Article på svenska med alla källor som citation, FAQPage från den synliga FAQ-en, aldrig HowTo`, () => {
    const schema = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gu)].flatMap(([, r]) => [JSON.parse(r)].flat());
    // Brödsmulorna kommer från generatorn (Hem > sidan); sidan själv lägger bara till Article.
    assert.deepEqual(schema.map((s) => s['@type']), ['BreadcrumbList', 'Article', 'FAQPage']);
    assert.deepEqual(schema[0].itemListElement.map((i) => i.item), ['https://matlyst-app.no/sv/', `https://matlyst-app.no${sti}`]);
    assert.equal(schema[1].inLanguage, 'sv');
    assert.equal(schema[1].datePublished, HENTET);
    assert.equal(schema[1].author['@type'], 'Organization');
    assert.deepEqual(schema[1].citation.map((c) => c.url), brukt.kilder.map((k) => DATA.kilder[k].url));
    assert.doesNotMatch(html, /HowTo/u);
    assert.equal(schema[2].mainEntity.length, mod.FAQ.length);
  });

  test(`${sti}: varje siffra har källa med adress, datum och hämtdatum, och står i listan hos sin källa`, () => {
    assert.deepEqual(kort.map((k) => k.id), brukt.kilder);
    for (const id of brukt.kilder) {
      const k = DATA.kilder[id];
      assert.match(k.url, /^https:\/\/(?:www\.livsmedelsverket\.se|svensktkott\.se|svenskfagel\.se|www\.arla\.se|kund\.arla\.se)\//u, id);
      const kortet = kort.find((x) => x.id === id).innehall;
      assert.ok(kortet.includes(`href="${k.url}"`) && kortet.includes(k.dato), id);
      assert.ok(kortet.includes(`<time datetime="${HENTET}">${HENTET_TEKST}</time>`), `${id}: hämtdatum`);
    }
    for (const [id, x] of Object.entries(tallSomBrukt)) {
      assert.ok(kort.find((k) => k.id === x.kilde).innehall.includes(`<li data-tall="${id}">${x.hva}: <strong>${x.vis}</strong></li>`), `${id} står inte i kortet hos ${x.kilde}`);
    }
    assert.equal([...hoved.matchAll(/data-tall="/gu)].length, brukt.tall.length);
  });

  test(`${sti}: ett tal utan källa ger rött, och prosan har inga tal utanför datafilen, datum och klockslag`, () => {
    assert.deepEqual(tallUtanKalla(prosa, tallSomBrukt), []);
    // Vakten kan bli röd.
    assert.deepEqual(tallUtanKalla('Stek kalkonen i 5 timmar.', tallSomBrukt), ['5']);
    assert.deepEqual(tallUtanKalla('Räkna 700 g per person. Nyårsafton är 31 december 2026, kl. 18.00.', tallSomBrukt), ['700']);
  });

  test(`${sti}: varje brukat tal visas i prosa eller tabell, och talen i FAQ-svaren står i datafilen`, () => {
    const alla = `${prosa} ${tabeller.map(synlig).join(' ')}`;
    for (const vis of new Set(Object.values(tallSomBrukt).map((x) => x.vis))) assert.ok(alla.includes(vis), `talet står inte på sidan: ${vis}`);
    for (const [q, a] of mod.FAQ) {
      assert.ok(hoved.includes(`<summary>${q}</summary>`), q);
      assert.ok(hoved.includes(`<p>${a}</p>`), q);
      assert.deepEqual(tallUtanKalla(a), [], q);
    }
  });

  test(`${sti}: texten har inget tankstreck, inga emojis, inga hälsopåståenden och inga konkurrenter`, () => {
    const text = synlig(utanBevis(hoved));
    assert.doesNotMatch(text, /(?<!\d)[–—]|[–—](?!\d)/u);
    assert.doesNotMatch(text, /\p{Extended_Pictographic}/u);
    assert.doesNotMatch(text, /\b(?:nyttig\w*|hälsa\w*|hälsosam\w*|kalori\w*|diet\w*|allergi\w*|förebygg\w*|skyddar|matförgiftning\w*|gravid\w*|magsjuk\w*)\b/iu);
    assert.doesNotMatch(text, /\b(?:Paprika|Mealime|Plan to Eat|Samsung Food|Whisk|Cookpad|Yummly)\b/u);
  });

  test(`${sti}: varje hänvisning till en källa har år, och året är källans eget`, () => {
    const intro = prosa.replace(/Livsmedelsverket är den svenska myndigheten för mat och livsmedel[^.]*\./gu, ' ').replace(/De andra källorna är Svenskt Kött, Svensk Fågel och Arla, och vi namnger dem med år varje gång\./u, ' ')
      .replace(/Tidslinjen följer Arlas julplanering/u, ' ').replace(/Livsmedelsverkets sidor som vi använder[^.]*\./u, ' ').replace(/Den här delen bygger därför på Svensk Fågel och Arla\./u, ' ')
      .replace(/Sidan hos Svenskt Kött nämner/u, ' ').replace(/Svenskt Kött anger/u, ' ').replace(/Svensk Fågels recept/gu, ' ').replace(/Vi hittade ingen svensk källa[^.]*\./u, ' ')
      .replace(/Listan följer julbordets klassiska rätter hos Arla \(\d{4}\)/u, ' ');
    assert.deepEqual([...intro.matchAll(/\b(?:Livsmedelsverket|Svenskt Kött|Svensk Fågel|Arla)\b(?! \(\d{4}\))/gu)].map((m) => intro.slice(m.index, m.index + 30)), []);
    for (const [namn, re] of Object.entries(UTGIVARE)) {
      const ar = new Set(Object.entries(DATA.kilder).filter(([id]) => re.test(id)).map(([, k]) => k.dato.match(/\d{4}/u)[0]));
      for (const m of intro.matchAll(new RegExp(`${namn} \\((\\d{4})\\)`, 'gu'))) assert.ok(ar.has(m[1]), `${namn} (${m[1]}) är inget årtal från en källa`);
    }
  });

  test(`${sti}: Matlyst-påståendena är bara det appen gör, och länkarna går till sidor som finns`, () => {
    assert.match(prosa, /Matlyst ger dig inga recept och inga/u);
    assert.match(prosa, /Matlyst skickar inga påminnelser om/u);
    assert.match(prosa, /fotoimport är en funktion i Matlyst Pro/u);
    assert.doesNotMatch(prosa, /Matlyst (?:påminner|varnar dig|skapar (?:en )?(?:meny|plan)|föreslår)/u);
    for (const lank of ['/sv/veckomeny-app/', '/sv/inkopslista/', '/sv/skafferi-app/', '/sv/hallbarhet/matrester/', '/sv/frysa/matrester/']) assert.ok(hoved.includes(`href="${lank}"`), lank);
    for (const [, href] of hoved.matchAll(/href="(\/[^"#?]*)"/gu)) assert.ok(existsSync(join(ROOT, href.slice(1), href.endsWith('/') ? 'index.html' : '')) || existsSync(join(ROOT, href.slice(1))), `länk utan fil: ${href}`);
  });
}

test('familjesidorna länkar hit, och sidorna länkar till familjerna och till varandra', () => {
  const las = (f) => readFileSync(join(ROOT, f), 'utf8');
  for (const f of ['sv/hur-mycket-per-person/julskinka', 'sv/hur-mycket-per-person/korv', 'sv/hur-mycket-per-person/lax', 'sv/tillagningstid/kalkon', 'sv/tillagningstid/julskinka']) {
    assert.ok(las(`${f}/index.html`).includes(f.includes('kalkon') ? 'href="/sv/nyarsmiddag/"' : 'href="/sv/julbord/"') || las(`${f}/index.html`).includes('href="/sv/nyarsmiddag/"'), f);
  }
  assert.ok(las('sv/hur-mycket-per-person/julskinka/index.html').includes('href="/sv/julbord/"'));
  assert.ok(las('sv/tillagningstid/julskinka/index.html').includes('href="/sv/julbord/"'));
  assert.ok(las('sv/tillagningstid/kalkon/index.html').includes('href="/sv/nyarsmiddag/"'));
  assert.ok(las('sv/innertemperatur/kalkon/index.html').includes('href="/sv/nyarsmiddag/"'));
  assert.ok(las('sv/veckomeny-app/index.html').includes('href="/sv/julbord/"'), 'veckomenysidan');
  assert.ok(las('sv/veckomeny-app/index.html').includes('href="/sv/nyarsmiddag/"'), 'veckomenysidan');
  for (const l of ['/sv/hur-mycket-per-person/julskinka/', '/sv/hur-mycket-per-person/lax/', '/sv/tillagningstid/julskinka/', '/sv/nyarsmiddag/']) assert.ok(las('sv/julbord/index.html').includes(`href="${l}"`), l);
  for (const l of ['/sv/hur-mycket-per-person/lax/', '/sv/tillagningstid/kalkon/', '/sv/innertemperatur/kalkon/', '/sv/julbord/']) assert.ok(las('sv/nyarsmiddag/index.html').includes(`href="${l}"`), l);
});

test('datafilen: varje citat har källa, och siffrorna i visningsformen står i citatet', () => {
  for (const [grupp, rader] of [['tall', DATA.tall], ['tekst', DATA.tekst]]) {
    for (const [id, x] of Object.entries(rader)) {
      assert.ok(DATA.kilder[x.kalla ?? x.kilde], `${grupp}/${id}: okänd källa`);
      assert.ok(x.sitat && x.sitat.length > 10, `${grupp}/${id}: citat saknas`);
      if (grupp === 'tall' && /\d/u.test(x.sitat)) for (const siffra of x.vis.match(/\d+/gu) ?? []) assert.ok(x.sitat.includes(siffra), `${id}: ${siffra} står inte i citatet`);
    }
  }
  for (const [id, k] of Object.entries(DATA.kilder)) assert.match(k.dato.match(/\d{4}/u)?.[0] ?? '', /^20\d\d$/u, id);
});

test('kontrollen mot källan hittar ett citat som inte står hos källan, och ett som saknar källtext', () => {
  const texter = Object.fromEntries(Object.keys(DATA.kilder).map((id) => [id, '']));
  assert.equal(avvik(DATA, texter).length, Object.keys(DATA.tall).length + Object.keys(DATA.tekst).length);
  const x = DATA.tall['skinka-jul'];
  assert.equal(avvik({ tall: { 'skinka-jul': x }, tekst: {} }, { 'sk-skinka': `... ${x.sitat} ...` }).length, 0);
  assert.equal(avvik({ tall: { 'skinka-jul': x }, tekst: {} }, { 'sk-skinka': x.sitat.replace('50–75', '50–95') }).length, 1);
  // Arla skriver ö som o och ett tecken för prickarna: NFC gör att citatet ändå hittas.
  assert.equal(avvik({ tall: { 'recept-buffe': DATA.tall['recept-buffe'] }, tekst: {} }, { 'arla-julbord': DATA.tall['recept-buffe'].sitat.normalize('NFD') }).length, 0);
});

test('julbord: mängdtabellerna är uträknade från siffrorna per person, oberoende av generatorn', () => {
  const html = readFileSync(join(ROOT, 'sv/julbord/index.html'), 'utf8');
  const tab = [...html.matchAll(/<table>[\s\S]*?<\/table>/gu)].map(([t]) => t);
  assert.equal(tab.length, 2);
  assert.deepEqual(celler(tab[0]), julbord.GAESTER_TOTALT.map((n) => [String(n), fmt(n * 50), fmt(n * 150)]));
  assert.equal(DATA.tall['buffe-rad'].g, 50);
  const rader = [['Julskinka', '50 till 75 g', [50, 75]], ['Köttbullar', '50 g', 50], ['Prinskorv', '50 g', 50], ['Revbensspjäll', '50 g', 50], ['Sill', '50 g', 50], ['Gravad lax', '100 g', 100], ['Janssons frestelse', '70 till 100 g', [70, 100]], ['Kokt potatis', '200 g', 200]];
  const kalla = ['Svenskt Kött (2025)', ...Array(4).fill('Svenskt Kött (2024), tumregel'), 'Arla (2026)', 'Arla (2026)', 'Arla (2026)'];
  const mangd = (g, n) => (Array.isArray(g) ? `${fmt(g[0] * n)} till ${fmt(g[1] * n)}` : fmt(g * n));
  assert.deepEqual(celler(tab[1]), rader.map(([namn, per, g], i) => [namn, per, mangd(g, 10), mangd(g, 20), kalla[i]]));
  // Tabellens tal står i datafilen.
  assert.deepEqual(DATA.tall['skinka-jul'].g, [50, 75]);
  assert.deepEqual(DATA.tall.jansson.g, [70, 100]);
  assert.equal(DATA.tall['lax-buffe'].g, 100);
  assert.equal(DATA.tall.potatis.g, 200);
});

test('julbord: tidslinjens veckodagar stämmer med 2026, och julafton är en torsdag', () => {
  const html = readFileSync(join(ROOT, 'sv/julbord/index.html'), 'utf8');
  const dag = ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag'];
  assert.equal(new Date(Date.UTC(2026, 11, 24)).getUTCDay(), 4, 'julafton 2026 är torsdag');
  // «Dan före dan» är 23 december (SO: «dagen före julafton»), inte 22 december.
  for (const [d, rubrik] of [[6, 'Tidigt i december, till exempel '], [17, 'En vecka före, '], [22, ''], [23, 'Dan före dan, '], [24, 'Julafton, ']]) {
    const v = dag[new Date(Date.UTC(2026, 11, d)).getUTCDay()];
    const vis = rubrik ? `${rubrik}${v}` : v[0].toUpperCase() + v.slice(1);
    assert.match(html, new RegExp(`<h3>${vis} ${d} december</h3>`, 'u'), `${d} december`);
  }
  assert.doesNotMatch(html, /dopparedan/u);
});

test('nyårsmiddag: mängder, steketid och tidslinje är uträknade oberoende, och datumen stämmer med veckodagarna 2026', () => {
  const html = readFileSync(join(ROOT, 'sv/nyarsmiddag/index.html'), 'utf8');
  const tab = [...html.matchAll(/<table>[\s\S]*?<\/table>/gu)].map(([t]) => t);
  assert.equal(tab.length, 3);
  assert.deepEqual(celler(tab[0]), nyar.GAESTER.map((n) => [String(n), `${fmt(n * 125)} till ${fmt(n * 150)}`, fmt(n * 175)]));
  assert.deepEqual(celler(tab[1]), nyar.GAESTER.map((n) => [String(n), fmt(n * 80), fmt(n * 200)]));
  // 20 minuter först, sedan 30 minuter per kilo (Svensk Fågel). Fyra kilo: 20 + 120 = 2 timmar 20. Fem kilo: 20 + 150 = 2 timmar 50. Vilan är minst 30 minuter, middag kl. 18.00.
  assert.deepEqual(celler(tab[2]), [['4 kg', '2 timmar', '2 timmar 20 minuter', 'kl. 15.10'], ['5 kg', '2 timmar 30 minuter', '2 timmar 50 minuter', 'kl. 14.40']]);
  assert.equal(DATA.tall['kalkon-start'].min, 20);
  assert.equal(DATA.tall['kalkon-kilo'].min, 30);
  assert.equal(DATA.tall['kalkon-vila'].min, 30);
  assert.equal(18 * 60 - 30 - (20 + 4 * 30), 15 * 60 + 10);
  assert.match(synlig(html), /ska den in i ugnen kl\. 15\.10/u);
  assert.match(synlig(html), /För en kalkon på fem kilo ger samma uträkning kl\. 14\.40/u);
  // Femkilostiden är vår egen uträkning efter Svensk Fågels regel, och sidan säger det rakt ut.
  assert.match(synlig(html), /Det har vi räknat ut själva efter Svensk Fågels regel/u);
  assert.match(synlig(html), /raden för fem kilo är vår uträkning, inte en uppgift från receptet/u);
  const nyarsafton = new Date(Date.UTC(2026, 11, 31));
  assert.equal(nyarsafton.getUTCDay(), 4, 'nyårsafton 2026 är torsdag');
  const dag = ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag'];
  for (const [tillbaka, rubrik] of [[3, 'Måndag 28 december, tre dagar före'], [2, 'Tisdag 29 december'], [1, 'Onsdag 30 december, dagen före'], [0, 'Nyårsafton, torsdag 31 december']]) {
    const d = new Date(nyarsafton.getTime() - tillbaka * 86400000);
    assert.ok(rubrik.toLowerCase().includes(dag[d.getUTCDay()]), `${rubrik}: ${dag[d.getUTCDay()]}`);
    assert.ok(html.includes(`<h3>${rubrik}</h3>`), rubrik);
  }
  const nyarsdagen = new Date(Date.UTC(2027, 0, 1));
  assert.equal(dag[nyarsdagen.getUTCDay()], 'fredag');
  assert.ok(html.includes('<h3>Nyårsdagen fredag 1 januari och dagarna efter</h3>'));
});

test('nyårsmiddag: källor som inte är överens visas öppet, och Svensk Fågels och Arlas innertemperatur står sida vid sida', () => {
  const html = readFileSync(join(ROOT, 'sv/nyarsmiddag/index.html'), 'utf8');
  const bitar = html.split(/<h2 /u).map(synlig);
  const kjarna = bitar.find((b) => b.startsWith('id="innertemperatur'));
  assert.ok(kjarna, 'avsnittet finns');
  assert.match(kjarna, /70 °C/u);
  assert.match(kjarna, /72 °C/u);
  assert.match(kjarna, /Siffrorna är inte lika, och vi avgör inte vilken som gäller/u);
  assert.ok(kjarna.indexOf('Svensk Fågel (2024)') > -1 && kjarna.indexOf('Arla (2026)') > kjarna.indexOf('Svensk Fågel (2024)'));
  // Livsmedelsverket står först för kyla och rester på julbordet, och Svenskt Kött och Arla bygger mängderna.
  const kyla = synlig(readFileSync(join(ROOT, 'sv/julbord/index.html'), 'utf8')).split('Kyla, tina och rester').pop().split('Så använder du Matlyst')[0];
  assert.ok(kyla.includes('Livsmedelsverket (2026)') && !/Arla|Svenskt Kött|Svensk Fågel/u.test(kyla.replace(/Läs mer[\s\S]*$/u, '')), 'kyla och rester bygger på Livsmedelsverket ensamt');
});

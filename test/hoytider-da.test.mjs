// De danske høytidssidene /da/julefrokost/ og /da/juleaften/. Regelen er den samme som for de norske (test/hoytider-nb.test.mjs):
// HVERT tall har kilde, adresse, dato og lesedato i en dataliste, og sitatet fra kilden ligger i datafila. Tallene er danske, aldri oversatt fra norsk.
// Kildene ble åpnet og lest 2026-11-21 (scripts/da-jul/kildekontroll-hoytider-da.mjs kontrollerer sitatene mot nettsidene, og trenger nett).
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { SIDEGRUPPER, alternativerFor } from '../scripts/locale-sider.mjs';
import { sidetype } from '../scripts/sidetyper.mjs';
import { DATA_DA as DATA, HENTET, HENTET_TEKST } from '../scripts/da-jul/felles-da.mjs';
import { avvik } from '../scripts/nb-jul/kildekontroll-hoytider.mjs';
import * as frokost from '../scripts/da-jul/julefrokost.mjs';
import * as aften from '../scripts/da-jul/juleaften.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const SIDER = [
  { sti: '/da/julefrokost/', nb: '/julebord/', mod: frokost },
  { sti: '/da/juleaften/', nb: '/julemiddag/', mod: aften },
];

const synlig = (t) => t.replace(/<!--[\s\S]*?-->/gu, ' ').replace(/<script[\s\S]*?<\/script>/gu, ' ').replace(/<style[\s\S]*?<\/style>/gu, ' ')
  .replace(/<\/(?:h[1-6]|p|li|summary|div|section|header|th|td|dt|dd)>/gu, ' ¶ ').replace(/<[^>]+>/gu, ' ')
  .replace(/&#?\w+;/gu, (e) => ({ '&amp;': '&', '&quot;': '"', '&#39;': '’' })[e] ?? ' ').replace(/\s+/gu, ' ');
const utenBevis = (t) => t.replace(/<!-- app-bevis:start -->[\s\S]*?<!-- app-bevis:slutt -->/gu, ' ');
const MAANEDER = 'januar|februar|marts|april|maj|juni|juli|august|september|oktober|november|december';
// Tall som ikke er mattall: datoer, årstall, klokkeslett (regnet ut fra kildens tider), kildehenvisninger med år og Matlysts egen skalering (1 til 20 portioner).
const KILDENAVN = 'Fødevarestyrelsen|Forbrugerrådet Tænk|Madens Verden|Arla|Danish Crown';
const IKKE_MATTALL = [new RegExp(`\\b(?:${KILDENAVN}) \\(\\d{4}\\)`, 'gu'), new RegExp(`\\b\\d{1,2}\\. (?:${MAANEDER})(?: \\d{4})?`, 'gu'), /\b2026\b/gu, /\bkl\. \d{2}\.\d{2}\b/gu, /\bfra 1 til 20 portioner\b/gu];

/** Tall i teksten som verken står i `tall` (visningsform) eller er en dato eller et klokkeslett. */
export function tallUtenKilde(tekst, tall = DATA.tall) {
  let rest = tekst;
  for (const vis of [...new Set(Object.values(tall).map((x) => x.vis))].sort((a, b) => b.length - a.length)) rest = rest.split(vis).join(' ');
  for (const re of IKKE_MATTALL) rest = rest.replace(re, ' ');
  return rest.match(/[^\s]*\d[^\s]*/gu) ?? [];
}

const celler = (tab) => [...tab.matchAll(/<tr>([\s\S]*?)<\/tr>/gu)].slice(1).map(([, r]) => [...r.matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gu)].map(([, c]) => c));
const fmt = (g) => (g >= 1000 ? `${String(Math.round(g) / 1000).replace('.', ',')} kg` : `${Math.round(g)} g`);
const les = (f) => readFileSync(join(ROOT, f), 'utf8');

for (const { sti, nb, mod } of SIDER) {
  const html = les(`${sti.slice(1)}index.html`);
  const hoved = html.match(/<main[\s\S]*?<\/main>/u)?.[0] ?? '';
  const kort = [...hoved.matchAll(/<div class="scenario" id="kilde-([^"]+)">([\s\S]*?)<\/div>/gu)].map(([, id, innhold]) => ({ id, innhold }));
  const tabeller = [...hoved.matchAll(/<table>[\s\S]*?<\/table>/gu)].map(([t]) => t);
  const brukt = mod.BRUKT();
  const prosa = (() => {
    let t = utenBevis(hoved);
    for (const k of kort) t = t.replace(`<div class="scenario" id="kilde-${k.id}">${k.innhold}</div>`, ' ');
    for (const tab of tabeller) t = t.replace(tab, ' ');
    return synlig(t);
  })();
  const tallSomBrukt = Object.fromEntries(brukt.tall.map((id) => [id, DATA.tall[id]]));

  test(`${sti}: samme sidegruppe som ${nb} (hreflang), i sitemap-da og llms.txt, og ingen annen sitemap`, () => {
    const gruppe = SIDEGRUPPER.find(({ sider }) => sider.da === sti);
    assert.ok(gruppe, 'mangler i SIDEGRUPPER');
    assert.deepEqual(gruppe.sider, { nb, da: sti });
    assert.deepEqual(alternativerFor(sti), [['nb-NO', nb], ['da-DK', sti], ['x-default', nb]]);
    for (const mappe of ['sv', 'en']) assert.doesNotMatch(les(`sitemap-${mappe}.xml`), new RegExp(`/da/${sti.split('/')[2]}/`));
    assert.match(les('sitemap-da.xml'), new RegExp(`<loc>https://matlyst-app\\.no${sti}</loc>\\s*<lastmod>2026-11-2\\d</lastmod>`, 'u'));
    assert.ok(les('llms.txt').includes(`(https://matlyst-app.no${sti})`));
    assert.match(html, new RegExp(`hreflang="nb-NO" href="https://matlyst-app\\.no${nb}"`, 'u'));
  });

  test(`${sti}: sidetypen er guide-lang, tittel og beskrivelse har lovlig lengde, ingen forfatterlinje, appkort og delebilde står der`, () => {
    assert.equal(sidetype(sti, html), 'guide-lang');
    const tittel = html.match(/<title>([^<]*)<\/title>/u)[1];
    const meta = html.match(/<meta name="description" content="([^"]*)">/u)[1];
    assert.ok(tittel.length <= 60, `tittel ${tittel.length}`);
    assert.ok(meta.length >= 100 && meta.length <= 160, `meta ${meta.length}`);
    assert.doesNotMatch(html, /Av <a href="\/om\/">/u);
    assert.doesNotMatch(JSON.stringify(mod.side.schemas), /"Person"/u);
    assert.match(html, /<!-- app-bevis:start -->/u);
    assert.match(html, /<meta property="og:image" content="https:\/\/matlyst-app\.no\/images\/delebilde\//u);
    assert.match(html, /<html lang="da"/u);
  });

  test(`${sti}: strukturerte data er BreadcrumbList, Article på dansk med alle kildene som citation, og FAQPage (som locale-pages krever), aldri HowTo`, () => {
    const skjema = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gu)].flatMap(([, r]) => [JSON.parse(r)].flat());
    assert.deepEqual(skjema.map((s) => s['@type']), ['BreadcrumbList', 'Article', 'FAQPage']);
    assert.equal(skjema[1].inLanguage, 'da');
    assert.equal(skjema[1].datePublished, HENTET);
    assert.equal(skjema[0].itemListElement[0].item, 'https://matlyst-app.no/da/');
    assert.deepEqual(skjema[1].citation.map((c) => c.url), brukt.kilder.map((k) => DATA.kilder[k].url));
    assert.doesNotMatch(html, /HowTo/u);
  });

  test(`${sti}: hvert tall har kilde med adresse, dato og lesedato, står i datalisten til sin kilde, og kildene er danske`, () => {
    assert.deepEqual(kort.map((k) => k.id), brukt.kilder);
    for (const id of brukt.kilder) {
      const k = DATA.kilder[id];
      assert.match(k.url, /^https:\/\/(?:www\.)?(?:foedevarestyrelsen\.dk|taenk\.dk|madensverden\.dk|arla\.dk|danishcrown\.com\/da-dk)\//u, id);
      const kortet = kort.find((x) => x.id === id).innhold;
      assert.ok(kortet.includes(`href="${k.url}"`) && kortet.includes(k.dato), id);
      assert.ok(kortet.includes(`<time datetime="${HENTET}">${HENTET_TEKST}</time>`), `${id}: lesedato`);
    }
    for (const [id, x] of Object.entries(tallSomBrukt)) {
      assert.ok(kort.find((k) => k.id === x.kilde).innhold.includes(`<li data-tall="${id}">${x.hva}: <strong>${x.vis}</strong></li>`), `${id} står ikke i kortet til ${x.kilde}`);
    }
    assert.equal([...hoved.matchAll(/data-tall="/gu)].length, brukt.tall.length);
  });

  test(`${sti}: Fødevarestyrelsen står først i kildelisten, og ett tall uten kilde gir rødt`, () => {
    assert.equal(brukt.kilder[0].startsWith('fvst-'), true);
    assert.deepEqual(tallUtenKilde(prosa, tallSomBrukt), []);
    // Vakten kan bli rød.
    assert.deepEqual(tallUtenKilde('Steg anden i 5 timer.', tallSomBrukt), ['5']);
    assert.deepEqual(tallUtenKilde('Regn 700 g pr. person. Juleaften er 24. december 2026, kl. 18.00.', tallSomBrukt), ['700']);
  });

  test(`${sti}: hvert brukt tall vises i prosa eller tabell, og tall i FAQ-svarene står i datafila`, () => {
    const alt = `${prosa} ${tabeller.map(synlig).join(' ')}`;
    for (const vis of new Set(Object.values(tallSomBrukt).map((x) => x.vis))) assert.ok(alt.includes(vis), `tallet står ikke på siden: ${vis}`);
    for (const [q, a] of mod.FAQ) {
      assert.ok(hoved.includes(`<summary>${q}</summary>`), q);
      assert.ok(hoved.includes(`<p>${a}</p>`), q);
      assert.deepEqual(tallUtenKilde(q, tallSomBrukt), [], q);
      assert.deepEqual(tallUtenKilde(a), [], q);
    }
  });

  test(`${sti}: ingen tankestrek, emoji, norske ord, ordet «nok», helsepåstander eller konkurrenter`, () => {
    const tekst = synlig(utenBevis(hoved));
    assert.doesNotMatch(tekst, /(?<!\d)[–—]|[–—](?!\d)/u);
    assert.doesNotMatch(tekst, /\p{Extended_Pictographic}/u);
    assert.doesNotMatch(tekst, /\bnok\b/iu, 'ordet «nok» ligner valutakoden NOK i locale-vakten');
    assert.doesNotMatch(html, /\b(?:NOK|SEK|DKK)\b|\d+\s*(?:kr(?![a-zåäöæø])|kroner\b)/iu);
    assert.doesNotMatch(tekst, /\b(?:Mattilsynet|MatPrat|oppskrift\w*|handleliste|kjøleskap\w*|ukemeny|middag\w*|regnemaskine\w*)\b/iu);
    assert.doesNotMatch(tekst, /\b(?:sund\w*|usund\w*|slank\w*|kalori\w*|diæt\w*|allergi\w*|forebyg\w*|beskytter|madforgiftning)\b/iu);
    assert.doesNotMatch(tekst, /\b(?:Paprika|Mealime|Plan to Eat|Samsung Food|Whisk|Cookpad|Yummly)\b/u);
  });

  test(`${sti}: hver henvisning til en kilde har år, og året er kildens eget`, () => {
    const intro = prosa.replace(/Fødevarestyrelsen er den danske myndighed for fødevaresikkerhed(?: og vi viser dens regler først|, og vi viser dens regler først)?\./u, ' ')
      .replace(/Fødevarestyrelsen er den danske myndighed for fødevaresikkerhed\. Madens Verden er en dansk madside, Forbrugerrådet Tænk er en forbrugerorganisation, og Arla og Danish Crown er danske fødevarevirksomheder\./u, ' ');
    assert.deepEqual([...intro.matchAll(new RegExp(`\\b(?:${KILDENAVN})\\b(?!s? \\(\\d{4}\\))(?!s )`, 'gu'))].map((m) => intro.slice(m.index, m.index + 40)), []);
    const aar = {};
    for (const id of brukt.kilder) (aar[DATA.kilder[id].navn.split(':')[0]] ??= new Set()).add(DATA.kilder[id].dato.match(/\d{4}/u)[0]);
    for (const m of intro.matchAll(new RegExp(`\\b(${KILDENAVN}) \\((\\d{4})\\)`, 'gu'))) assert.ok(aar[m[1]]?.has(m[2]), `${m[1]} (${m[2]}) er ikke et årstal fra en kilde`);
  });

  test(`${sti}: Matlyst-påstandene er bare det appen gør, og lenkene går til sider som finnes`, () => {
    assert.match(prosa, /Matlyst giver dig ingen opskrifter og ingen tider/u);
    assert.match(prosa, /Matlyst minder dig ikke om/u);
    assert.match(prosa, /fotoimport er en Matlyst Pro-funktion/u);
    assert.doesNotMatch(prosa, /Matlyst (?:minder dig om|giver dig besked|laver (?:en )?(?:menu|plan)|foreslår)/u);
    for (const lenke of ['/da/madplan-app/', '/da/indkoebsliste-app/', '/da/spisekammer-app/']) assert.ok(hoved.includes(`href="${lenke}"`), lenke);
    for (const [, href] of hoved.matchAll(/href="(\/[^"#?]*)"/gu)) assert.ok(existsSync(join(ROOT, href.slice(1), href.endsWith('/') ? 'index.html' : '')) || existsSync(join(ROOT, href.slice(1))), `lenke uten fil: ${href}`);
  });
}

test('familiesidene lenker hit, og sidene lenker til familiene og til hinanden', () => {
  for (const f of ['hvor-meget-pr-person/flaeskesteg', 'stegetid/and', 'stegetid/flaeskesteg', 'kernetemperatur/and', 'kernetemperatur/svinestek'.replace('svinestek', 'flaeskesteg')]) assert.ok(les(`da/${f}/index.html`).includes('href="/da/juleaften/"'), f);
  for (const f of ['hvor-meget-pr-person/gaester', 'holdbarhed/rester']) assert.ok(les(`da/${f}/index.html`).includes('href="/da/julefrokost/"'), f);
  for (const l of ['/da/hvor-meget-pr-person/flaeskesteg/', '/da/hvor-meget-pr-person/kartofler/', '/da/stegetid/and/', '/da/stegetid/flaeskesteg/', '/da/kernetemperatur/and/', '/da/kernetemperatur/flaeskesteg/']) assert.ok(les('da/juleaften/index.html').includes(`href="${l}"`), l);
  for (const l of ['/da/hvor-meget-pr-person/gaester/', '/da/holdbarhed/rester/', '/da/kan-man-fryse/']) assert.ok(les('da/julefrokost/index.html').includes(`href="${l}"`), l);
  assert.ok(les('da/julefrokost/index.html').includes('href="/da/juleaften/"'));
  assert.ok(les('da/juleaften/index.html').includes('href="/da/julefrokost/"'));
});

test('datafila: hvert sitat har kilde, og tallene i visningsformen står i sitatet', () => {
  for (const [gruppe, rader] of [['tall', DATA.tall], ['tekst', DATA.tekst]]) {
    for (const [id, x] of Object.entries(rader)) {
      assert.ok(DATA.kilder[x.kilde], `${gruppe}/${id}: ukjent kilde`);
      assert.ok(x.sitat && x.sitat.length > 10, `${gruppe}/${id}: sitat mangler`);
      if (gruppe === 'tall') for (const siffer of x.vis.match(/\d+/gu) ?? []) assert.ok(x.sitat.includes(siffer), `${id}: ${siffer} står ikke i sitatet`);
    }
  }
  for (const [id, k] of Object.entries(DATA.kilder)) assert.match(k.dato, /20\d\d/u, id);
});

test('kildekontrollen finner et sitat som ikke står hos kilden, og et som mangler kildetekst', () => {
  const tekster = Object.fromEntries(Object.keys(DATA.kilder).map((id) => [id, '']));
  const alle = Object.keys(DATA.tall).length + Object.keys(DATA.tekst).length;
  assert.equal(avvik(DATA, tekster).length, alle);
  const u = { tall: { 'g-kod': DATA.tall['g-kod'] }, tekst: {} };
  assert.equal(avvik(u, { 'mv-gaester': `... ${DATA.tall['g-kod'].sitat} ...` }).length, 0);
  assert.equal(avvik(u, { 'mv-gaester': DATA.tall['g-kod'].sitat.replace('200', '250') }).length, 1);
});

test('julefrokost: mengdetabellene er regnet ut fra tallene pr. person, uavhengig av generatoren', () => {
  const html = les('da/julefrokost/index.html');
  const tab = [...html.matchAll(/<table>[\s\S]*?<\/table>/gu)].map(([t]) => t);
  assert.equal(tab.length, 2);
  assert.deepEqual(DATA.tall['g-kod'].g, 200);
  assert.deepEqual(DATA.tall['g-buffet'].g, [65, 70]);
  assert.deepEqual(celler(tab[0]), frokost.GAESTER.map((n) => [String(n), fmt(n * 200), `${fmt(n * 65)} til ${fmt(n * 70)}`]));
  assert.deepEqual(celler(tab[1]), frokost.GAESTER.map((n) => [String(n), fmt(n * 150), fmt(n * 100), `${n} dl`, `${fmt(n * 130)} til ${fmt(n * 150)}`]));
  // Madens Verdens eget eksempel: 30 gæster giver seks kilo kød i alt.
  assert.equal(celler(tab[0]).find((r) => r[0] === '30')[1], '6 kg');
});

test('juleaften: mængder, stegetider og klokkeslæt er regnet ut uavhengig, og datoene stemmer med ukedagene i 2026', () => {
  const html = les('da/juleaften/index.html');
  const tab = [...html.matchAll(/<table>[\s\S]*?<\/table>/gu)].map(([t]) => t);
  assert.equal(tab.length, 4);
  assert.deepEqual(celler(tab[0]), aften.GAESTER.map((n) => [String(n), fmt(n * 300), `${fmt(n * 200)} til ${fmt(n * 300)}`, `${fmt(n * 200)} til ${fmt(n * 250)}`]));
  assert.deepEqual(celler(tab[1]), aften.GAESTER.map((n) => [String(n), `${fmt(n * 200)} til ${fmt(n * 250)}`, `${fmt(n * 150)} til ${fmt(n * 200)}`, `${n} dl`, `${fmt(n * 130)} til ${fmt(n * 150)}`]));
  // Og: en halv time pr. halve kilo (tallene i datafila). Hvile 30 minutter (kildens høyeste). Spisetid 18.00. Optøning fra kildens tabell.
  const opto = { 2: '1 til 2 døgn', 2.5: '1 til 2 døgn', 3: '2 til 3 døgn', 3.5: '2 til 3 døgn', 4: '3 til 4 døgn' };
  const timer = (min) => (min % 60 === 30 ? `${String(min / 60).replace('.', ',')} timer` : `${min / 60} timer`);
  const klokke = (min) => `kl. ${String(Math.floor(min / 60)).padStart(2, '0')}.${String(min % 60).padStart(2, '0')}`;
  const forventet = [2, 2.5, 3, 3.5, 4].map((kilo) => {
    const stek = kilo * 60;
    return [`${String(kilo).replace('.', ',')} kg`, opto[kilo], timer(stek), '20 til 30 minutter', klokke(18 * 60 - 30 - stek)];
  });
  assert.deepEqual(celler(tab[2]), forventet);
  assert.equal(DATA.tall['and-tid'].vis, '30 minutter pr. halve kilo');
  assert.equal(DATA.tall['and-tid'].min, 2 * 30, 'en halv time pr. halve kilo er en time pr. kilo');
  assert.equal(DATA.tall['tab-and-tid'].min, 60, 'det høyeste tallet i tabellen er det samme');
  // Flæskesteg: 1 time 15 ved 225 grader, hvile 15 minutter, spisetid 18.00: i ovnen kl. 16.30, skyen fra kl. 17.15.
  assert.deepEqual(celler(tab[3]), [['Svinekam på 1,5 kg', '225 °C varmluft', '1 time og 15 minutter', 'cirka 15 minutter', 'kl. 16.30']]);
  assert.equal(aften.FLAESK_START, 16 * 60 + 30);
  assert.equal(aften.FLAESK_SKY, 17 * 60 + 15);
  assert.equal(aften.AND_3KG_START, 14 * 60 + 30);
  assert.match(synlig(html), /i ovnen kl\. 14\.30\. Vend anden efter en time, altså kl\. 15\.30/u);
  assert.match(synlig(html), /i ovnen kl\. 16\.30\. Hæld skyen fra efter 45 minutter, altså kl\. 17\.15/u);
  // 1,5 kg og seks personer: 6 gange 250 g er 1,5 kg, det samme som Madens Verdens eksempel.
  assert.equal(6 * 250, 1500);
  const juleaften = new Date(Date.UTC(2026, 11, 24));
  assert.equal(juleaften.getUTCDay(), 4, 'juleaften 2026 er torsdag');
  const dag = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];
  for (const [tilbake, tittel] of [[21, 'Tre uger før'], [7, 'En uge før'], [3, 'Tre dage før'], [1, 'Dagen før'], [0, 'Juleaften'], [-1, 'Dagen efter']]) {
    const d = new Date(juleaften.getTime() - tilbake * 86400000);
    assert.match(html, new RegExp(`<h3>${tittel}, ${dag[d.getUTCDay()]} ${d.getUTCDate()}\\. december</h3>`, 'u'), tittel);
  }
  assert.equal(DATA.tall['opto-3'].d, 3, 'tre døgn før: mandag 21. december');
});

test('Fødevarestyrelsen står før Madens Verden der begge omtaler det samme, og kilder som er uenige vises åpent', () => {
  const html = synlig(les('da/juleaften/index.html'));
  const fjer = html.split('Kernetemperatur, køling og rester').pop();
  assert.ok(fjer.indexOf('Fødevarestyrelsen (2026) skriver, at fisk og fjerkræ') > -1 && fjer.indexOf('Fødevarestyrelsen (2026) skriver, at fisk og fjerkræ') < fjer.indexOf('Madens Verden (2023) går efter'), 'fjerkræ: Fødevarestyrelsen først');
  assert.match(html, /kilderne er ikke enige/u);
  assert.match(html, /Arla \(2026\) skriver, at du kan stege den næsten færdig dagen før/u);
  assert.match(html, /Danish Crown \(2026\) skriver, at du sagtens kan lave den dagen før/u);
  assert.match(html, /står side om side, og det højeste tal står først\. Danish Crown \(2026\) regner 300 g/u);
  assert.match(html, /Det højeste tal er en time pr\. kilo/u);
});

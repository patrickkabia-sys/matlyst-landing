// Høytidssidene /julebord/ og /nyttarsmiddag/ (bare norsk). Regelen er den samme som for /julemiddag/:
// HVERT tall på siden har kilde, adresse, dato og hentedato i en dataliste, og sitatet fra kilden ligger i datafila.
// Kildene ble åpnet og lest 2026-11-21 (kildekontroll-hoytider.mjs kontrollerer sitatene mot nettsidene, og trenger nett).
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { SIDEGRUPPER, alternativerFor } from '../scripts/locale-sider.mjs';
import { sidetype } from '../scripts/sidetyper.mjs';
import { DATA, HENTET, HENTET_TEKST } from '../scripts/nb-jul/hoytid-felles.mjs';
import { avvik } from '../scripts/nb-jul/kildekontroll-hoytider.mjs';
import * as julebord from '../scripts/nb-jul/julebord.mjs';
import * as nyttar from '../scripts/nb-jul/nyttarsmiddag.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const SIDER = [
  { sti: '/julebord/', mod: julebord },
  { sti: '/nyttarsmiddag/', mod: nyttar },
];

const synlig = (t) => t.replace(/<!--[\s\S]*?-->/gu, ' ').replace(/<script[\s\S]*?<\/script>/gu, ' ').replace(/<style[\s\S]*?<\/style>/gu, ' ')
  .replace(/<\/(?:h[1-6]|p|li|summary|div|section|header|th|td|dt|dd)>/gu, ' ¶ ').replace(/<[^>]+>/gu, ' ')
  .replace(/&#?\w+;/gu, (e) => ({ '&amp;': '&', '&quot;': '"', '&#39;': '’' })[e] ?? ' ').replace(/\s+/gu, ' ');
const utenBevis = (t) => t.replace(/<!-- app-bevis:start -->[\s\S]*?<!-- app-bevis:slutt -->/gu, ' ');
const MAANEDER = 'januar|februar|mars|april|mai|juni|juli|august|september|oktober|november|desember';
// Tall som ikke er mattall: datoer, årstall, klokkeslett (regnet ut fra kildens tider) og Matlysts egen omregning (1 til 20 porsjoner).
const IKKE_MATTALL = [/\b(?:MatPrat|Mattilsynet) \(\d{4}\)/gu, new RegExp(`\\b\\d{1,2}\\. (?:${MAANEDER})(?: \\d{4})?`, 'gu'), /\b2026\b/gu, /\bkl\. \d{2}\.\d{2}\b/gu, /\bfra 1 til 20 porsjoner\b/gu];

/** Tall i teksten som verken står i `tall` (visningsform) eller er en dato eller et klokkeslett. */
export function tallUtenKilde(tekst, tall = DATA.tall) {
  let rest = tekst;
  for (const vis of [...new Set(Object.values(tall).map((x) => x.vis))].sort((a, b) => b.length - a.length)) rest = rest.split(vis).join(' ');
  for (const re of IKKE_MATTALL) rest = rest.replace(re, ' ');
  return rest.match(/[^\s]*\d[^\s]*/gu) ?? [];
}

for (const { sti, mod } of SIDER) {
  const html = readFileSync(join(ROOT, `${sti.slice(1)}index.html`), 'utf8');
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
  const celler = (tab) => [...tab.matchAll(/<tr>([\s\S]*?)<\/tr>/gu)].slice(1).map(([, r]) => [...r.matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gu)].map(([, c]) => c));
  const tallSomBrukt = Object.fromEntries(brukt.tall.map((id) => [id, DATA.tall[id]]));

  test(`${sti}: egen sidegruppe med bare norsk, i sitemap og llms.txt, og ingen annen sitemap`, () => {
    const gruppe = SIDEGRUPPER.find(({ sider }) => sider.nb === sti);
    assert.ok(gruppe, 'mangler i SIDEGRUPPER');
    assert.deepEqual(Object.keys(gruppe.sider), ['nb']);
    assert.deepEqual(alternativerFor(sti), [['nb-NO', sti], ['x-default', sti]]);
    assert.doesNotMatch(html, /<script\b[^>]*\bsrc\s*=\s*["']?\/locale\.js(?![\w.])/iu);
    for (const mappe of ['sv', 'da', 'en']) assert.doesNotMatch(readFileSync(join(ROOT, `sitemap-${mappe}.xml`), 'utf8'), new RegExp(sti.replaceAll('/', '')));
    assert.match(readFileSync(join(ROOT, 'sitemap.xml'), 'utf8'), new RegExp(`<loc>https://matlyst-app\\.no${sti}</loc>\\s*<lastmod>2026-11-2\\d</lastmod>`, 'u'));
    assert.ok(readFileSync(join(ROOT, 'llms.txt'), 'utf8').includes(`(https://matlyst-app.no${sti})`));
  });

  test(`${sti}: sidetypen er guide-lang, tittel og beskrivelse har lovlig lengde, forfatterlinje og appkort står der`, () => {
    assert.equal(sidetype(sti, html), 'guide-lang');
    const tittel = html.match(/<title>([^<]*)<\/title>/u)[1];
    const meta = html.match(/<meta name="description" content="([^"]*)">/u)[1];
    assert.ok(tittel.length <= 60, `tittel ${tittel.length}`);
    assert.ok(meta.length >= 100 && meta.length <= 160, `meta ${meta.length}`);
    assert.match(html, /Av <a href="\/om\/">Patrick Kabia<\/a>/u);
    assert.match(html, /<!-- app-bevis:start -->/u);
    assert.match(html, /<meta property="og:image" content="https:\/\/matlyst-app\.no\/images\/delebilde\//u);
  });

  test(`${sti}: strukturerte data er BreadcrumbList og Article med alle kildene som citation, aldri HowTo`, () => {
    const skjema = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gu)].flatMap(([, r]) => [JSON.parse(r)].flat());
    assert.deepEqual(skjema.map((s) => s['@type']), ['BreadcrumbList', 'Article']);
    assert.equal(skjema[1].datePublished, HENTET);
    assert.deepEqual(skjema[1].citation.map((c) => c.url), brukt.kilder.map((k) => DATA.kilder[k].url));
    assert.doesNotMatch(html, /HowTo|FAQPage/u);
  });

  test(`${sti}: hvert tall har kilde med adresse, dato og hentedato, og står i datalisten til sin kilde`, () => {
    assert.deepEqual(kort.map((k) => k.id), brukt.kilder);
    for (const id of brukt.kilder) {
      const k = DATA.kilder[id];
      assert.match(k.url, /^https:\/\/www\.(?:matprat|mattilsynet)\.no\//u, id);
      const kortet = kort.find((x) => x.id === id).innhold;
      assert.ok(kortet.includes(`href="${k.url}"`) && kortet.includes(k.dato), id);
      assert.ok(kortet.includes(`<time datetime="${HENTET}">${HENTET_TEKST}</time>`), `${id}: hentedato`);
    }
    for (const [id, x] of Object.entries(tallSomBrukt)) {
      assert.ok(kort.find((k) => k.id === x.kilde).innhold.includes(`<li data-tall="${id}">${x.hva}: <strong>${x.vis}</strong></li>`), `${id} står ikke i kortet til ${x.kilde}`);
    }
    assert.equal([...hoved.matchAll(/data-tall="/gu)].length, brukt.tall.length);
  });

  test(`${sti}: ett tall uten kilde gir rødt, prosaen har ingen tall utenfor datafila, datoer og klokkeslett`, () => {
    assert.deepEqual(tallUtenKilde(prosa, tallSomBrukt), []);
    // Vakten kan bli rød.
    assert.deepEqual(tallUtenKilde('Stek kalkunen i 5 timer.', tallSomBrukt), ['5']);
    assert.deepEqual(tallUtenKilde('Regn 700 g per person. Nyttårsaften er 31. desember 2026, kl. 18.00.', tallSomBrukt), ['700']);
  });

  test(`${sti}: hvert brukt tall vises i prosa eller tabell, og tall i FAQ-svarene står i datafila`, () => {
    const alt = `${prosa} ${tabeller.map(synlig).join(' ')}`;
    for (const vis of new Set(Object.values(tallSomBrukt).map((x) => x.vis))) assert.ok(alt.includes(vis), `tallet står ikke på siden: ${vis}`);
    for (const [q, a] of mod.FAQ) {
      assert.ok(hoved.includes(`<summary>${q}</summary>`), q);
      assert.ok(hoved.includes(`<p>${a}</p>`), q);
      assert.deepEqual(tallUtenKilde(a), [], q);
    }
  });

  test(`${sti}: teksten har ingen tankestrek, ingen emoji, ingen helsepåstander og ingen konkurrenter`, () => {
    const tekst = synlig(utenBevis(hoved));
    assert.doesNotMatch(tekst, /(?<!\d)[–—]|[–—](?!\d)/u);
    assert.doesNotMatch(tekst, /\p{Extended_Pictographic}/u);
    assert.doesNotMatch(tekst, /\b(?:sunn|usunn|sunt|slank\w*|kalori\w*|diett\w*|allergi\w*|forebygg\w*|beskytter|bra for helsen|matforgiftning)\b/iu);
    assert.doesNotMatch(tekst, /\b(?:Paprika|Mealime|Plan to Eat|Samsung Food|Whisk|Cookpad|Yummly)\b/u);
    for (const s of tekst.split(/\s*¶\s*|(?<=[.!?])\s+/u).filter((x) => /MatPrat/u.test(x))) assert.match(s, /MatPrat \(\d{4}\)|MatPrat er Opplysningskontoret|^MatPrat: /u, s);
  });

  test(`${sti}: hver henvisning til MatPrat og Mattilsynet har år, og året er kildens eget`, () => {
    const intro = prosa.replace(/Mattilsynet er den norske myndigheten for mattrygghet, og MatPrat er Opplysningskontoret for egg og kjøtt\./u, ' ').replace(/Mattilsynet er den norske myndigheten for mattrygghet,? og vi viser dens regler først\./u, ' ').replace(/Mattilsynet er myndigheten for mattrygghet, og står først\./u, ' ');
    assert.deepEqual([...intro.matchAll(/\b(?:MatPrat|Mattilsynet)\b(?! \(\d{4}\))/gu)].map((m) => intro.slice(m.index, m.index + 30)), []);
    const aar = { MatPrat: new Set(), Mattilsynet: new Set() };
    for (const [id, k] of Object.entries(DATA.kilder)) if (brukt.kilder.includes(id)) aar[id.startsWith('mp-') ? 'MatPrat' : 'Mattilsynet'].add(k.dato.match(/\d{4}/u)[0]);
    for (const [navn, set] of Object.entries(aar)) for (const m of intro.matchAll(new RegExp(`${navn} \\((\\d{4})\\)`, 'gu'))) assert.ok(set.has(m[1]), `${navn} (${m[1]}) er ikke et årstall fra en kilde`);
  });

  test(`${sti}: Matlyst-påstandene er bare det appen gjør, og lenkene går til sider som finnes`, () => {
    assert.match(prosa, /Matlyst gir deg ingen oppskrifter og ingen/u);
    assert.match(prosa, /Matlyst varsler ikke om/u);
    assert.match(prosa, /bildeimport er en Matlyst Pro-funksjon/u);
    assert.doesNotMatch(prosa, /Matlyst (?:minner|varsler deg|lager (?:en )?(?:meny|plan)|foreslår)/u);
    for (const lenke of ['/ukemeny/', '/handleliste/', '/spiskammer-app/', '/om/', '/holdbarhet/rester/', '/frysing/'].filter((l) => !(l.startsWith('/holdbarhet') || l === '/frysing/') || sti === '/julebord/' || l === '/holdbarhet/rester/')) assert.ok(hoved.includes(`href="${lenke}"`), lenke);
    for (const [, href] of hoved.matchAll(/href="(\/[^"#?]*)"/gu)) assert.ok(existsSync(join(ROOT, href.slice(1), href.endsWith('/') ? 'index.html' : '')) || existsSync(join(ROOT, href.slice(1))), `lenke uten fil: ${href}`);
  });
}

test('familiesidene på main lenker hit, og sidene lenker til familiene', () => {
  const les = (f) => readFileSync(join(ROOT, f), 'utf8');
  for (const f of ['mengde-per-person/kalkun', 'mengde-per-person/julemat', 'steketid/kalkun', 'kjernetemperatur/kalkun']) assert.ok(les(`${f}/index.html`).includes('href="/nyttarsmiddag/"'), f);
  for (const f of ['mengde-per-person/julemat', 'mengde-per-person/koldtbord', 'mengde-per-person/spekemat', 'mengde-per-person/mat-til-selskap']) assert.ok(les(`${f}/index.html`).includes('href="/julebord/"'), f);
  for (const l of ['/mengde-per-person/kalkun/', '/steketid/kalkun/', '/kjernetemperatur/kalkun/']) assert.ok(les('nyttarsmiddag/index.html').includes(`href="${l}"`), l);
  for (const l of ['/mengde-per-person/koldtbord/', '/mengde-per-person/spekemat/', '/mengde-per-person/mat-til-selskap/']) assert.ok(les('julebord/index.html').includes(`href="${l}"`), l);
});

test('julemiddag-siden lenker til begge, og begge lenker tilbake', () => {
  const jul = readFileSync(join(ROOT, 'julemiddag/index.html'), 'utf8');
  for (const sti of ['/julebord/', '/nyttarsmiddag/']) assert.ok(jul.includes(`href="${sti}"`), sti);
  for (const { sti } of SIDER) assert.ok(readFileSync(join(ROOT, `${sti.slice(1)}index.html`), 'utf8').includes('href="/julemiddag/"'), sti);
  assert.ok(readFileSync(join(ROOT, 'ukemeny/index.html'), 'utf8').includes('href="/julebord/"'));
});

test('datafila: hvert sitat har kilde, og tallene i visningsformen står i sitatet (eller er skrevet med ord i kilden)', () => {
  for (const [gruppe, rader] of [['tall', DATA.tall], ['tekst', DATA.tekst]]) {
    for (const [id, x] of Object.entries(rader)) {
      assert.ok(DATA.kilder[x.kilde], `${gruppe}/${id}: ukjent kilde`);
      assert.ok(x.sitat && x.sitat.length > 10, `${gruppe}/${id}: sitat mangler`);
      if (gruppe === 'tall' && /\d/u.test(x.sitat)) for (const siffer of x.vis.match(/\d+/gu) ?? []) assert.ok(x.sitat.includes(siffer), `${id}: ${siffer} står ikke i sitatet`);
    }
  }
});

test('kildekontrollen finner et sitat som ikke står hos kilden, og et som mangler kildetekst', () => {
  const tekster = Object.fromEntries(Object.entries(DATA.kilder).map(([id]) => [id, '']));
  const alle = [...Object.keys(DATA.tall), ...Object.keys(DATA.tekst)].length;
  assert.equal(avvik(DATA, tekster).length, alle);
  const kb = DATA.tall['kb-total'].sitat;
  assert.equal(avvik({ tall: { 'kb-total': DATA.tall['kb-total'] }, tekst: {} }, { 'mp-koldtbord': `... ${kb} ...` }).length, 0);
  assert.equal(avvik({ tall: { 'kb-total': DATA.tall['kb-total'] }, tekst: {} }, { 'mp-koldtbord': kb.replace('500-600', '500-700') }).length, 1);
});

test('julebord: mengdetabellene er regnet ut fra tallene per person, uavhengig av generatoren', () => {
  const html = readFileSync(join(ROOT, 'julebord/index.html'), 'utf8');
  const tab = [...html.matchAll(/<table>[\s\S]*?<\/table>/gu)].map(([t]) => t);
  const celler = (t) => [...t.matchAll(/<tr>([\s\S]*?)<\/tr>/gu)].slice(1).map(([, r]) => [...r.matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gu)].map(([, c]) => c));
  const fmt = (g) => (g >= 1000 ? `${g / 1000} kg`.replace('.', ',') : `${g} g`);
  assert.equal(tab.length, 2);
  assert.deepEqual(celler(tab[0]), julebord.GJESTER_TOTALT.map((n) => [String(n), `${fmt(n * 500)} til ${fmt(n * 600)}`, `${fmt(n * 250)} til ${fmt(n * 300)}`]));
  assert.deepEqual(DATA.tall['kb-total'].g, [500, 600]);
  const retter = [['Roastbiff', 60], ['Røkt skinke', 60], ['Spekemat', 60], ['Kokt ørret', 60], ['Karbonade med løk', 1, 'stk'], ['Eggerøre', 1, 'egg'], ['Grønn salat', 40], ['Potetsalat', 40], ['Waldorfsalat', 40], ['Rømme', 20], ['Pepperrotkrem', 20], ['Remulade', 10], ['Cumberlandsaus', 10]];
  assert.deepEqual(celler(tab[1]), retter.map(([navn, mengde, enhet]) => [navn, enhet ? `${mengde} ${enhet}` : `${mengde} g`, ...[10, 20].map((n) => (enhet ? `${n * mengde} ${enhet}` : fmt(n * mengde)))]));
});

test('nyttarsmiddag: mengder, steketid og tidslinje er regnet ut uavhengig, og datoene stemmer med ukedagene i 2026', () => {
  const html = readFileSync(join(ROOT, 'nyttarsmiddag/index.html'), 'utf8');
  const tab = [...html.matchAll(/<table>[\s\S]*?<\/table>/gu)].map(([t]) => t);
  const celler = (t) => [...t.matchAll(/<tr>([\s\S]*?)<\/tr>/gu)].slice(1).map(([, r]) => [...r.matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gu)].map(([, c]) => c));
  const fmt = (g) => (g >= 1000 ? `${g / 1000} kg`.replace('.', ',') : `${g} g`);
  assert.equal(tab.length, 3);
  assert.deepEqual(celler(tab[0]), nyttar.GJESTER.map((n) => [String(n), fmt(n * 500), fmt(n * 600)]));
  const saus = (n) => `${String(n * 0.75).replace('.', ',')} til ${n} dl`;
  assert.deepEqual(celler(tab[1]), nyttar.GJESTER.map((n) => [String(n), fmt(n * 200), fmt(n * 200), saus(n)]));
  // 30 minutter per kilo: 5, 6 og 7 kilo er 2 t 30, 3 t og 3 t 30. Fylt kalkun legger til 30 til 45 minutter. 500 g per person gir 10, 12 og 14 gjester.
  assert.deepEqual(celler(tab[2]), [['5 kg', '2 timer 30 minutter', '3 timer til 3 timer 15 minutter', '10 gjester'], ['6 kg', '3 timer', '3 timer 30 minutter til 3 timer 45 minutter', '12 gjester'], ['7 kg', '3 timer 30 minutter', '4 timer til 4 timer 15 minutter', '14 gjester']]);
  assert.equal(DATA.tall['kalkun-6kg-tid'].vis, '3 timer', 'samme som kildens eget eksempel');
  assert.equal(nyttar.MIDDAG_MIN - nyttar.HVILE_MIN - nyttar.STEK_6KG_MIN, 14 * 60 + 40);
  assert.match(synlig(html), /må den altså inn i ovnen kl\. 14\.40/u);
  const nyttarsaften = new Date(Date.UTC(2026, 11, 31));
  assert.equal(nyttarsaften.getUTCDay(), 4, 'nyttårsaften 2026 er torsdag');
  const dag = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];
  for (const [tilbake, tittel] of [[21, 'Tre uker før'], [7, 'Én uke før'], [3, 'Tre dager før'], [1, 'Dagen før'], [0, 'Nyttårsaften']]) {
    const d = new Date(nyttarsaften.getTime() - tilbake * 86400000);
    assert.match(html, new RegExp(`<h3>${tittel}, ${dag[d.getUTCDay()]} ${d.getUTCDate()}\\. desember</h3>`, 'u'), tittel);
  }
});

test('Mattilsynet står før MatPrat der begge omtaler det samme, og motstridende kjernetemperatur vises åpent', () => {
  const html = readFileSync(join(ROOT, 'nyttarsmiddag/index.html'), 'utf8');
  const biter = html.split(/<h2 /u).map(synlig);
  const kjerne = biter.find((b) => b.startsWith('id="kjernetemperatur'));
  assert.ok(kjerne, 'seksjonen finnes');
  const mt = kjerne.indexOf('Mattilsynet (2022)');
  const mp = kjerne.indexOf('MatPrat (2025)');
  assert.ok(mt > -1 && mp > -1 && mt < mp, 'Mattilsynet først');
  assert.match(kjerne, /minimum 75 grader/u);
  assert.match(kjerne, /68 °C/u);
  assert.match(kjerne, /Tallene er ikke like, og vi avgjør ikke/u);
  const kjol = synlig(readFileSync(join(ROOT, 'julebord/index.html'), 'utf8')).split('Kjøling, varmholding og rester').pop().split('Slik bruker du Matlyst')[0];
  assert.ok(kjol.includes('Mattilsynet (2026)') && !kjol.includes('MatPrat'), 'mattrygghet i julebordet bygger på Mattilsynet alene');
});

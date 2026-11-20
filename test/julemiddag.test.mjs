// Julemiddagsiden (/julemiddag/, bare norsk). Regelen: HVERT tall på siden har kilde, adresse og hentedato i en dataliste.
// Kildene (MatPrat og Mattilsynet) ble åpnet og lest 2026-11-20. Riskrem og andre tall uten kilde er tatt ut.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { SIDEGRUPPER, alternativerFor } from '../scripts/locale-sider.mjs';
import { sidetype } from '../scripts/sidetyper.mjs';
import { DAMP_START_KL, FAQ, GJESTER, HENTET, HENTET_TEKST, KILDER, MIDDAG_KL, TALL, UTVANN_START_KL } from '../scripts/nb-jul/julemiddag.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const STI = '/julemiddag/';
const html = readFileSync(join(ROOT, 'julemiddag/index.html'), 'utf8');
const hoved = html.match(/<main[\s\S]*?<\/main>/u)?.[0] ?? '';

const synlig = (t) => t.replace(/<!--[\s\S]*?-->/gu, ' ').replace(/<script[\s\S]*?<\/script>/gu, ' ').replace(/<style[\s\S]*?<\/style>/gu, ' ')
  .replace(/<\/(?:h[1-6]|p|li|summary|div|section|header|th|td|dt|dd)>/gu, ' ¶ ').replace(/<[^>]+>/gu, ' ')
  .replace(/&#?\w+;/gu, (e) => ({ '&amp;': '&', '&quot;': '"', '&#39;': '’' })[e] ?? ' ').replace(/\s+/gu, ' ');

// Delene som er verifisert hver for seg: kildekortene (datalistene) og tabellene (regnet ut fra tallene).
const kort = [...hoved.matchAll(/<div class="scenario" id="kilde-([^"]+)">([\s\S]*?)<\/div>/gu)].map(([, id, innhold]) => ({ id, innhold }));
const tabeller = [...hoved.matchAll(/<table>[\s\S]*?<\/table>/gu)].map(([t]) => t);
// App-bevisblokkene er sidens skall (ikke tall om mat) og har egne bildetekster.
const utenBevis = (t) => t.replace(/<!-- app-bevis:start -->[\s\S]*?<!-- app-bevis:slutt -->/gu, ' ');
const prosa = (() => {
  let t = utenBevis(hoved);
  for (const k of kort) t = t.replace(`<div class="scenario" id="kilde-${k.id}">${k.innhold}</div>`, ' ');
  for (const tab of tabeller) t = t.replace(tab, ' ');
  return synlig(t);
})();

const MAANEDER = 'januar|februar|mars|april|mai|juni|juli|august|september|oktober|november|desember';
// Tall som ikke er mattall: datoer, årstallet, klokkeslett regnet ut fra kildens 30 og 3 timer, og Matlysts egen omregning (1 til 20 porsjoner).
const IKKE_MATTALL = [/\b(?:MatPrat|Mattilsynet) \(\d{4}\)/gu, new RegExp(`\\b\\d{1,2}\\. (?:${MAANEDER})(?: \\d{4})?`, 'gu'), /\b2026\b/gu, /\bkl\. \d{2}\b/gu, /\bfra 1 til 20 porsjoner\b/gu];

/** Tall i teksten som verken står i TALL eller er en dato eller et klokkeslett. */
export function tallUtenKilde(tekst) {
  let rest = tekst;
  for (const vis of [...new Set(TALL.map((x) => x.vis))].sort((a, b) => b.length - a.length)) rest = rest.split(vis).join(' ');
  for (const re of IKKE_MATTALL) rest = rest.replace(re, ' ');
  return rest.match(/[^\s]*\d[^\s]*/gu) ?? [];
}

test('siden er egen sidegruppe med bare norsk, og hreflang har bare nb og x-default', () => {
  const gruppe = SIDEGRUPPER.find(({ sider }) => sider.nb === STI);
  assert.ok(gruppe, 'mangler i SIDEGRUPPER');
  assert.deepEqual(Object.keys(gruppe.sider), ['nb']);
  assert.deepEqual(alternativerFor(STI), [['nb-NO', STI], ['x-default', STI]]);
  assert.doesNotMatch(html, /<script src="\/locale\.js"/u);
  for (const mappe of ['sv', 'da', 'en']) assert.doesNotMatch(readFileSync(join(ROOT, `sitemap-${mappe}.xml`), 'utf8'), /julemiddag/u);
  assert.match(readFileSync(join(ROOT, 'sitemap.xml'), 'utf8'), /<loc>https:\/\/matlyst-app\.no\/julemiddag\/<\/loc>\s*<lastmod>2026-11-20<\/lastmod>/u);
});

test('sidetypen er guide-lang, tittel og beskrivelse har lovlig lengde', () => {
  assert.equal(sidetype(STI, html), 'guide-lang');
  const tittel = html.match(/<title>([^<]*)<\/title>/u)[1];
  const meta = html.match(/<meta name="description" content="([^"]*)">/u)[1];
  assert.ok(tittel.length <= 60, `tittel ${tittel.length}`);
  assert.ok(meta.length >= 100 && meta.length <= 160, `meta ${meta.length}`);
});

test('strukturerte data er BreadcrumbList og Article med alle kildene som citation, aldri HowTo', () => {
  const skjema = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gu)].flatMap(([, r]) => [JSON.parse(r)].flat());
  assert.deepEqual(skjema.map((s) => s['@type']), ['BreadcrumbList', 'Article']);
  const artikkel = skjema[1];
  assert.equal(artikkel.datePublished, HENTET);
  assert.equal(artikkel.inLanguage, 'nb');
  assert.deepEqual(artikkel.citation.map((c) => c.url), Object.values(KILDER).map((k) => k.url));
  assert.doesNotMatch(html, /HowTo|FAQPage/u);
});

test('hvert tall har en kilde med adresse, dato og hentedato, og står i dataliste-kortet til sin kilde', () => {
  assert.equal(HENTET, '2026-11-20');
  assert.deepEqual(kort.map((k) => k.id), Object.keys(KILDER));
  for (const [id, k] of Object.entries(KILDER)) {
    assert.match(k.url, /^https:\/\/www\.(?:matprat|mattilsynet)\.no\//u, id);
    assert.ok(k.dato.length > 5, id);
    const kortet = kort.find((x) => x.id === id).innhold;
    assert.ok(kortet.includes(`href="${k.url}"`), `${id}: adresse mangler`);
    assert.ok(kortet.includes(k.dato), `${id}: dato på kilden mangler`);
    assert.ok(kortet.includes(`<time datetime="${HENTET}">${HENTET_TEKST}</time>`), `${id}: hentedato mangler`);
    assert.ok(kortet.includes('<dl>') && kortet.includes('<dt>Adresse</dt>'), `${id}: ikke en dataliste`);
  }
  for (const x of TALL) {
    assert.ok(KILDER[x.kilde], `tall uten kilde: ${x.id}`);
    assert.ok(kort.find((k) => k.id === x.kilde).innhold.includes(`<li data-tall="${x.id}">${x.hva}: <strong>${x.vis}</strong></li>`), `${x.id} står ikke i kortet til ${x.kilde}`);
  }
  assert.equal([...hoved.matchAll(/data-tall="/gu)].length, TALL.length);
});

test('ett tall uten kilde gir rødt: prosaen har ingen tall utenfor TALL, datoer og klokkeslett', () => {
  assert.deepEqual(tallUtenKilde(prosa), []);
  // Vakten kan bli rød.
  assert.deepEqual(tallUtenKilde('Stek ribba til 72 °C kjernetemperatur.'), ['72']);
  assert.deepEqual(tallUtenKilde('Ribbe 350 g per person.'), ['350']);
  assert.deepEqual(tallUtenKilde('Ribbe 300 g per person. Julaften er 24. desember 2026, middag kl. 17.'), []);
  assert.deepEqual(tallUtenKilde('Rester holder seg 5 dager.'), ['5']);
});

test('hvert tall i TALL brukes faktisk på siden (ingen kilde for tall som ikke vises)', () => {
  for (const vis of new Set(TALL.map((x) => x.vis))) assert.ok(prosa.includes(vis), `tallet står ikke i teksten: ${vis}`);
});

test('mengdetabellene er regnet ut fra tallene per person, uavhengig av generatoren', () => {
  const g = (id) => TALL.find((x) => x.id === id).g;
  const celler = (tab) => [...tab.matchAll(/<tr>([\s\S]*?)<\/tr>/gu)].slice(1).map(([, r]) => [...r.matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gu)].map(([, c]) => c));
  const fmt = (gram) => (gram >= 1000 ? `${gram / 1000} kg`.replace('.', ',') : `${gram} g`);
  assert.equal(tabeller.length, 2);
  assert.deepEqual(celler(tabeller[0]), GJESTER.map((n) => [String(n), fmt(n * 300), fmt(n * 400), fmt(n * 200)]));
  assert.equal(g('ribbe'), 300); assert.equal(g('pk-torr'), 400); assert.equal(g('poteter'), 200);
  const saus = (n) => `${String(n * 0.75).replace('.', ',')} dl til ${n} dl`;
  assert.deepEqual(celler(tabeller[1]), GJESTER.map((n) => [String(n), saus(n), `${fmt(n * 80)} til ${fmt(n * 100)}`]));
});

test('tidslinjen regnes fra middagstid, 30 timers utvanning og 3 timers damping, og datoene stemmer med ukedagene i 2026', () => {
  assert.equal(MIDDAG_KL, 17);
  assert.equal(DAMP_START_KL, 14);
  assert.equal(UTVANN_START_KL, 8);
  assert.match(prosa, /kl\. 08/u);
  assert.match(prosa, /kl\. 14/u);
  assert.match(prosa, /kl\. 17/u);
  const julaften = new Date(Date.UTC(2026, 11, 24));
  assert.equal(julaften.getUTCDay(), 4, 'julaften 2026 er torsdag');
  const dag = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];
  for (const [tilbake, tittel] of [[21, 'Tre uker før'], [7, 'En uke før'], [4, 'Fire dager før'], [3, 'Tre dager før'], [1, 'Dagen før']]) {
    const d = new Date(julaften.getTime() - tilbake * 86400000);
    assert.match(hoved, new RegExp(`<h3>${tittel}, ${dag[d.getUTCDay()]} ${d.getUTCDate()}\\. desember</h3>`, 'u'), tittel);
  }
});

test('teksten har ingen tankestrek, ingen emoji, ingen helsepåstander og ingen konkurrenter', () => {
  const tekst = synlig(utenBevis(hoved));
  assert.doesNotMatch(tekst, /(?<!\d)[–—]|[–—](?!\d)/u);
  assert.doesNotMatch(tekst, /\p{Extended_Pictographic}/u);
  assert.doesNotMatch(tekst, /\b(?:sunn|usunn|sunt|slank\w*|kalori\w*|diett\w*|allergi\w*|forebygg\w*|beskytter|bra for helsen|matforgiftning)\b/iu);
  assert.doesNotMatch(tekst, /\b(?:Paprika|Mealime|Plan to Eat|Samsung Food|Whisk|Cookpad|Yummly|Mattilsynet anbefaler deg)\b/u);
  // MatPrat står bare som kilde, og alltid med år.
  for (const s of tekst.split(/\s*¶\s*|(?<=[.!?])\s+/u).filter((x) => /MatPrat/u.test(x))) assert.match(s, /MatPrat \(\d{4}\)|MatPrat er Opplysningskontoret|^MatPrat: /u, s);
});

test('Matlyst-påstandene er bare det appen gjør: ingen oppskrifter eller steketider, ingen varsler', () => {
  assert.match(prosa, /Matlyst gir deg ingen oppskrifter og ingen steketider/u);
  assert.match(prosa, /Matlyst varsler ikke om tining, utvanning eller steketider/u);
  assert.match(prosa, /bildeimport er en Matlyst Pro-funksjon/u);
  assert.doesNotMatch(prosa, /Matlyst (?:minner|varsler deg|lager (?:en )?(?:meny|plan)|foreslår)/u);
  for (const sti of ['/ukemeny/', '/handleliste/', '/spiskammer-app/', '/om/']) assert.ok(hoved.includes(`href="${sti}"`), sti);
});

test('hver FAQ er synlig, og tall i svarene står i TALL', () => {
  for (const [q, a] of FAQ) {
    assert.ok(hoved.includes(`<summary>${q}</summary>`), q);
    assert.ok(hoved.includes(`<p>${a}</p>`), q);
    assert.deepEqual(tallUtenKilde(a), [], q);
  }
});

test('riskrem står ikke på siden med tall (ingen kilde funnet)', () => {
  assert.doesNotMatch(prosa, /riskrem.*\d|\d.*riskrem/iu);
});

// Kildehenvisningene i teksten har alltid år, og året er kildens eget (utgitt, gjennomgått eller publisert).
const AAR = { MatPrat: new Set(Object.entries(KILDER).filter(([id]) => id.startsWith('mp-')).map(([, k]) => k.dato.match(/\d{4}/u)[0])), Mattilsynet: new Set(Object.entries(KILDER).filter(([id]) => id.startsWith('mt-')).map(([, k]) => k.dato.match(/\d{4}/u)[0])) };
export function henvisningerUtenAar(tekst) {
  return [...tekst.matchAll(/\b(?:MatPrat|Mattilsynet)\b(?! \(\d{4}\))/gu)].map((m) => tekst.slice(m.index, m.index + 30));
}
const prosaUtenKildeintro = prosa.replace(/Mattilsynet er den norske myndigheten for mattrygghet, og MatPrat er Opplysningskontoret for egg og kjøtt\./u, ' ');

test('hver henvisning til MatPrat og Mattilsynet i teksten har år, og året er kildens eget', () => {
  assert.deepEqual(henvisningerUtenAar(prosaUtenKildeintro), []);
  for (const [navn, aar] of Object.entries(AAR)) {
    for (const m of prosaUtenKildeintro.matchAll(new RegExp(`${navn} \\((\\d{4})\\)`, 'gu'))) assert.ok(aar.has(m[1]), `${navn} (${m[1]}) er ikke et årstall fra en kilde`);
  }
  assert.ok(AAR.MatPrat.has('2014') && AAR.MatPrat.has('2025') && AAR.Mattilsynet.has('2026') && AAR.Mattilsynet.has('2023'));
  assert.match(prosa, /MatPrat \(2014\) sier at utvanning tar ca\. 30 timer i romtemperatur/u);
  // Vakten kan bli rød.
  assert.deepEqual(henvisningerUtenAar('MatPrat sier at ribbe tines.'), ['MatPrat sier at ribbe tines.']);
  assert.deepEqual(henvisningerUtenAar('Mattilsynet sier at fryseren skal være kald.'), ['Mattilsynet sier at fryseren s']);
  assert.deepEqual(henvisningerUtenAar('MatPrat (2025) sier at ribbe tines. Mattilsynet (2026) sier noe.'), []);
});

// Mattilsynet først: der begge kildene omtaler samme sak, står Mattilsynets regel før MatPrat, i hver seksjon eller hvert spørsmål der begge står.
const SAKER = [
  ['avkjøling av ribbe som lages dagen før', /kjøles fra 60 °C til 10 °C/u, /steke ribba ferdig dagen før/u],
  ['utvanning av pinnekjøtt', /trives og formerer seg raskt ved temperaturer fra 8 til 60 grader/u, /utvanning(?: tar)? ca\. 30 timer/u],
  ['tining i kjøleskap', /tining i kjøleskap er tryggere/u, /tas ut av fryseren og tines i ett døgn/u],
  ['frysing', /kvaliteten i fryseren går ned/u, /Rå ribbe: MatPrat/u],
  ['frysing av ferdig ribbe', /fryse restemat med en gang/u, /fraråder å fryse ferdigstekt ribbe/u],
  ['oppvarming og kjernetemperatur', /over 70 grader i flere minutter/u, /gir ingen kjernetemperatur for ribbe/u],
];
const biter = (html) => html.split(/<h2 |<details/u).map(synlig);
export function saksrekkefolge(html, saker = SAKER) {
  return saker.map(([navn, forst, sist]) => {
    const sammen = biter(html).filter((b) => forst.test(b) && sist.test(b));
    return { navn, antall: sammen.length, feil: sammen.filter((b) => b.search(forst) > b.search(sist)).length };
  });
}
test('Mattilsynet står før MatPrat i alle saker der begge omtaler det samme', () => {
  const utenBeviset = utenBevis(hoved);
  for (const r of saksrekkefolge(utenBeviset)) {
    assert.ok(r.antall > 0, `${r.navn}: fant ikke begge kildene i samme avsnitt, så vakten vokter ingenting`);
    assert.equal(r.feil, 0, `${r.navn}: MatPrat står foran Mattilsynet`);
  }
  // Vakten kan bli rød: byttet rekkefølge gir feil.
  const byttet = '<h2 id="x"><p>MatPrat (2025) sier at du kan steke ribba ferdig dagen før.</p><p>Mattilsynet (2026) sier at mat kjøles fra 60 °C til 10 °C.</p>';
  assert.equal(saksrekkefolge(byttet, [SAKER[0]])[0].feil, 1);
  assert.equal(saksrekkefolge(byttet.split('</p><p>').reverse().join('</p><p>'), [SAKER[0]])[0].feil, 0);
});

test('MatPrats råd om å kjøle ribba på benken er tatt ut, fordi det ikke er i tråd med Mattilsynets rett til to timer', () => {
  assert.doesNotMatch(prosa, /avkjøles på kjøkkenbenken|skjæres kald i serveringsstykker/u);
  assert.match(prosa, /Mattilsynet \(2026\) sier at varm, hjemmelaget mat skal kjøles fra 60 °C til 10 °C så raskt som mulig, men senest i løpet av to timer\./u);
});

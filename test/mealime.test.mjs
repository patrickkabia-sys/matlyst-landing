// Flyttesiden for tidligere Mealime-brukere (/en/mealime-alternative/). Bare engelsk.
// Matlyst har ingen masseimport fra Mealime og ingen kontokobling (bare Paprika-filer og Matlysts egen eksport).
// Lenkeimport av publiserte oppskrifter fra mealime.com er TESTET 2026-11-20 (to oppskrifter, engelsk QA-konto), og siden skal si det med dato.
// Kilden for Mealimes egne fakta er mealime.com/closing (lest 2026-11-20).
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { NORSKE_RESTORD } from './hjelp/restord.mjs';
import { SIDEGRUPPER, alternativerFor } from '../scripts/locale-sider.mjs';
import { sidetype } from '../scripts/sidetyper.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const STI = '/en/mealime-alternative/';
const html = readFileSync(join(ROOT, 'en/mealime-alternative/index.html'), 'utf8');

const utenKommentarer = (t) => t.replace(/<!--[\s\S]*?-->/gu, ' ');
const synlig = (t) => utenKommentarer(t)
  .replace(/<script[\s\S]*?<\/script>/gu, ' ').replace(/<style[\s\S]*?<\/style>/gu, ' ')
  // Blokkslutt blir ¶, så en overskrift aldri smelter sammen med neste setning og låner dens negasjon.
  .replace(/<\/(?:h[1-6]|p|li|summary|div|section|header)>/gu, ' ¶ ')
  .replace(/<[^>]+>/gu, ' ').replace(/&#?\w+;/gu, (e) => ({ '&amp;': '&', '&quot;': '"', '&#39;': '’', '&rsquo;': '’' })[e] ?? ' ').replace(/\s+/gu, ' ');

// Sider fra <main> til </main>: bare sidens eget innhold, ikke skall og bunntekst.
const hoved = html.match(/<main[\s\S]*?<\/main>/u)?.[0] ?? '';
const tekst = synlig(hoved);

// Delt opp i setninger, så en negasjon i en annen setning aldri redder en påstand.
export const setninger = (t) => t.split(/\s*¶\s*|(?<=[.?!])\s+(?=[A-Z“"])/u).map((s) => s.trim()).filter(Boolean);
const NEGASJON = /\b(?:no|not|never|n[’']t|cannot|can[’']t|don[’']t|doesn[’']t|haven[’']t|isn[’']t|aren[’']t|won[’']t)\b/iu;

// Setninger som nevner både Mealime og import skal være nektende, spørsmål, eller handle om lenker (én om gangen).
// Alt annet (masseimport, «import your Mealime recipes», kontokobling) er en påstand vi ikke kan stå inne for.
export function importPaastander(t) {
  return setninger(t).filter((s) => /mealime/iu.test(s) && /\bimport/iu.test(s) && !s.endsWith('?') && !NEGASJON.test(s) && !/\b(?:link|links|one at a time)\b/iu.test(s));
}

test('siden finnes som egen sidegruppe med bare engelsk, og alle tre andre språk mangler', () => {
  const gruppe = SIDEGRUPPER.find(({ sider }) => sider.en === STI);
  assert.ok(gruppe, 'mangler i SIDEGRUPPER');
  assert.deepEqual(Object.keys(gruppe.sider), ['en']);
  for (const mappe of ['sv', 'da']) assert.equal(existsSync(join(ROOT, mappe, 'mealime-alternative')), false);
  assert.equal(existsSync(join(ROOT, 'mealime-alternative')), false);
});

test('hreflang har bare en og x-default, og siden er ikke i språkkartet for omdirigering', () => {
  assert.deepEqual(alternativerFor(STI), [['en', STI], ['x-default', STI]]);
  const lenker = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/gu)].map(([, k, h]) => [k, h]);
  assert.deepEqual(lenker, [['en', `https://matlyst-app.no${STI}`], ['x-default', `https://matlyst-app.no${STI}`]]);
  assert.doesNotMatch(html, /<script\b[^>]*\bsrc\s*=\s*["']?\/locale\.js(?![\w.])/iu);
});

test('siden står i det engelske sidekartet, men ikke i de andre', () => {
  const en = readFileSync(join(ROOT, 'sitemap-en.xml'), 'utf8');
  assert.match(en, /<loc>https:\/\/matlyst-app\.no\/en\/mealime-alternative\/<\/loc>\s*<lastmod>2026-11-20<\/lastmod>/u);
  for (const fil of ['sitemap.xml', 'sitemap-sv.xml', 'sitemap-da.xml']) assert.doesNotMatch(readFileSync(join(ROOT, fil), 'utf8'), /mealime/iu, fil);
});

test('sidetypen er guide-lang, og tittel og beskrivelse har lovlig lengde', () => {
  assert.equal(sidetype(STI, html), 'guide-lang');
  const tittel = html.match(/<title>([^<]*)<\/title>/u)[1];
  const meta = html.match(/<meta name="description" content="([^"]*)">/u)[1];
  assert.ok(tittel.length <= 60, `tittel ${tittel.length}`);
  assert.ok(meta.length >= 100 && meta.length <= 160, `meta ${meta.length}`);
  assert.match(tittel, /Mealime/u);
});

test('strukturerte data er BreadcrumbList, Article og FAQPage, aldri HowTo', () => {
  const skjema = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gu)].flatMap(([, r]) => [JSON.parse(r)].flat());
  assert.deepEqual(skjema.map((s) => s['@type']), ['BreadcrumbList', 'Article', 'FAQPage']);
  const artikkel = skjema[1];
  assert.equal(artikkel.datePublished, '2026-11-20');
  assert.equal(artikkel.inLanguage, 'en');
  assert.ok(artikkel.headline.length <= 110);
  assert.doesNotMatch(html, /HowTo/u);
  const faq = skjema[2].mainEntity;
  assert.ok(faq.length >= 5);
  for (const { name, acceptedAnswer } of faq) {
    assert.ok(hoved.includes(`<summary>${name}</summary>`), `spørsmål ikke synlig: ${name}`);
    assert.ok(hoved.includes(`<p>${acceptedAnswer.text}</p>`), `svar ikke synlig: ${name}`);
  }
});

test('teksten har ingen tankestrek, ingen norske restord og ingen superlativer', () => {
  assert.doesNotMatch(tekst, /(?<!\d)[–—]|[–—](?!\d)/u);
  assert.doesNotMatch(tekst, NORSKE_RESTORD);
  assert.doesNotMatch(tekst, /\b(?:best|better than|number one|#1|top[- ]rated|leading|unbeatable|perfect)\b/iu);
});

test('ingen pris i kroner eller dollar', () => {
  assert.doesNotMatch(tekst, /[$€£]\s?\d|\d\s?(?:kr\b|NOK|USD|dollars?|\$)|\bper (?:month|year)\b.*\d/iu);
  assert.match(tekst, /free to start, with 5 imports per calendar month/u);
});

test('siden sier at det ikke finnes masseimport eller kontokobling, og påstår aldri det motsatte', () => {
  assert.match(tekst, /There’s no bulk Mealime import\./u);
  assert.deepEqual(importPaastander(tekst), []);
  assert.match(tekst, /Matlyst doesn’t connect to Mealime, it can’t read a Mealime account, and it never asks for your Mealime login\./u);
  assert.doesNotMatch(tekst, /\.mealime|one[- ]click|one tap|automatically (?:import|transfer)|import (?:all|every|your whole|your entire)/iu);
  // Kontokobling og innlogging hos Mealime nevnes bare for å si nei.
  for (const s of setninger(tekst).filter((x) => /mealime/iu.test(x) && /\b(?:connect|log ?in|sign in|password|account)/iu.test(x) && !x.endsWith('?'))) {
    if (/Mealime says|Mealime[’']s closing page|Your account information|Mealime or Albertsons|Mealime web app/u.test(s)) continue;
    assert.match(s, NEGASJON, s);
  }
});

test('siden sier at lenkeimport fra mealime.com er testet, med dato, og at den kan slutte å virke', () => {
  assert.match(tekst, /We tested this on November 20, 2026, with two recipes from mealime\.com\./u);
  assert.match(tekst, /If Mealime takes those pages down, this stops working/u);
  assert.match(tekst, /The number of servings didn’t come along, so set it in the draft/u);
  assert.match(tekst, /Recipes you created yourself in Mealime had no public page/u);
  assert.match(tekst, /Matlyst can’t read that file/u);
  assert.match(hoved, /href="https:\/\/www\.mealime\.com\/recipes" rel="noopener"/u);
  const kort = synlig(hoved.match(/<header[\s\S]*?<\/header>/u)[0]);
  assert.match(kort, /We tested it on November 20, 2026/u);
  const meta = html.match(/<meta name="description" content="([^"]*)">/u)[1];
  assert.match(meta, /tested November 20, 2026/u);
  assert.doesNotMatch(tekst, /haven[’']t tested|have not tested/iu);
  // Ingen navn på tredjepartsverktøyet eller lenke til det.
  assert.doesNotMatch(html, /chrome\.google\.com|chromewebstore|Recipe Exporter/iu);
});

test('påstandsvakten kan bli rød: usanne import-påstander gir treff, nektende og lenkesetninger gjør ikke', () => {
  assert.equal(importPaastander('Import your Mealime recipes in one tap.').length, 1);
  assert.equal(importPaastander('Matlyst can import all your Mealime recipes with your account.').length, 1);
  assert.equal(importPaastander('Matlyst has a Mealime importer.').length, 1);
  assert.equal(importPaastander('There’s no bulk Mealime import.').length, 0);
  assert.equal(importPaastander('Can I import my Mealime recipes into Matlyst?').length, 0);
  assert.equal(importPaastander('Matlyst can import a Mealime recipe by link.').length, 0);
});

test('eksport: ingen offisiell eksport, appen er offline, og de publiserte oppskriftene er på nettet', () => {
  assert.match(tekst, /Mealime doesn’t offer an official export, and its closing page doesn’t mention one\./u);
  assert.match(tekst, /“Offline for Maintenance\.”/u);
  assert.match(tekst, /published recipes on mealime\.com\/recipes were still online/u);
  assert.doesNotMatch(tekst, /We don’t know/u);
});

test('Mealime-fakta følger mealime.com/closing og lenker dit', () => {
  assert.match(tekst, /discontinued on October 21, 2026/u);
  assert.match(tekst, /Meals Hub/u);
  assert.match(tekst, /personal data will be deleted/u);
  assert.match(hoved, /href="https:\/\/www\.mealime\.com\/closing" rel="noopener"/u);
});

test('siden lenker til produktsidene den beskriver, og Paprika-siden lenker hit', () => {
  for (const sti of ['/en/meal-plan-app/', '/en/shopping-list/', '/en/pantry-app/']) assert.ok(hoved.includes(`href="${sti}"`), sti);
  assert.match(readFileSync(join(ROOT, 'en/import-recipes-from-paprika/index.html'), 'utf8'), /href="\/en\/mealime-alternative\/"/u);
});

test('siden finnes i «All guides» i bunnen, men ikke i hovedhyllene', () => {
  const pantry = readFileSync(join(ROOT, 'en/pantry-app/index.html'), 'utf8');
  const guider = pantry.match(/<!-- guider:bunn -->[\s\S]*?<!-- \/guider:bunn -->/u)[0];
  assert.match(guider, /<a href="\/en\/mealime-alternative\/">Mealime Alternative: Moving Your Recipes<\/a>/u);
  assert.doesNotMatch(pantry.replace(guider, ''), /mealime/iu);
  assert.doesNotMatch(readFileSync(join(ROOT, 'en/index.html'), 'utf8'), /mealime/iu);
});

test('produktpåstandene stemmer med de andre engelske sidene', () => {
  // Fotoimport er Pro; meny og handleliste er gratis; Matlyst lager ikke planen for deg.
  assert.match(tekst, /Photo import is a Matlyst Pro feature/u);
  assert.match(tekst, /Matlyst is free to start/u);
  assert.match(tekst, /doesn’t build your week for you/u);
  assert.match(tekst, /Units: US/u);
  assert.doesNotMatch(tekst, /meal plans? (?:for you|automatically)|generates? (?:a )?(?:meal )?plans?|barcode|nutrition|calorie/iu);
});

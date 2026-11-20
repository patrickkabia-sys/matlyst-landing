// Flyttesiden for tidligere Mealime-brukere (/en/mealime-alternative/). Bare engelsk, og aldri en påstand om Mealime-import:
// Matlyst har ingen Mealime-import (bare Paprika-filer). Kilden for Mealimes egne fakta er mealime.com/closing (lest 2026-11-20).
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { NORSKE_RESTORD } from './hjelp/restord.mjs';
import { SIDEGRUPPER, alternativerFor, byggLocalePageMap } from '../scripts/locale-sider.mjs';
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

// Setninger som nevner både Mealime og import skal være nektende eller spørsmål. Eksportert så beviset under kan bruke den.
export function importPaastander(t) {
  return setninger(t).filter((s) => /mealime/iu.test(s) && /\bimport/iu.test(s) && !s.endsWith('?') && !NEGASJON.test(s));
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
  assert.equal(byggLocalePageMap()[STI], undefined);
  assert.doesNotMatch(html, /<script src="\/locale\.js"/u);
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

test('siden sier ærlig at det ikke finnes Mealime-import, og påstår aldri det motsatte', () => {
  assert.match(tekst, /Matlyst has no Mealime import/u);
  assert.deepEqual(importPaastander(tekst), []);
  // Ingen kjente filformater eller kontolenking som ville antydet en direkteimport.
  assert.doesNotMatch(tekst, /\.mealime|one[- ]click|automatically (?:import|transfer)/iu);
  // Kontokobling og innlogging hos Mealime nevnes bare for å si nei.
  for (const s of setninger(tekst).filter((x) => /mealime/iu.test(x) && /\b(?:connect|log ?in|sign in|password|account)/iu.test(x) && !x.endsWith('?'))) {
    if (/Mealime says|Mealime[’']s closing page|Your account information|Mealime or Albertsons/u.test(s)) continue;
    assert.match(s, NEGASJON, s);
  }
});

test('påstandsvakten kan bli rød: en usann import-påstand gir treff, en nektende setning gjør ikke', () => {
  assert.equal(importPaastander('Import your Mealime recipes in one tap.').length, 1);
  assert.equal(importPaastander('Matlyst can import Mealime recipes. It is fast.').length, 1);
  assert.equal(importPaastander('Matlyst has no Mealime import.').length, 0);
  assert.equal(importPaastander('Can I import my Mealime recipes into Matlyst?').length, 0);
});

test('siden sier at vi ikke vet om Mealime lar deg eksportere, og gjetter ikke', () => {
  assert.match(tekst, /We don’t know\./u);
  assert.match(tekst, /Check whether Mealime lets you export your recipes/u);
  const eksport = setninger(tekst).filter((s) => /mealime/iu.test(s) && /\bexport/iu.test(s) && !s.endsWith('?'));
  for (const s of eksport) assert.match(s, /don[’']t|doesn[’']t|haven[’']t|Check whether|not mention|can[’']t/iu, s);
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

test('siden står ikke i bunnteksten på andre sider (en annen app nevnt ved navn)', () => {
  assert.doesNotMatch(readFileSync(join(ROOT, 'en/pantry-app/index.html'), 'utf8'), /mealime/iu);
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

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { TEKST } from '../scripts/forside-tekst.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const t = TEKST.nb, alt = JSON.stringify(t);

test('overskrift, steg og kilder er de som er godkjent', () => {
  assert.equal(t.h1, 'Oppskrifter du faktisk lager.');
  assert.deepEqual(t.steg, ['Trykk på papirflyet', 'Trykk Del til', 'Velg Matlyst', 'Velg mappe og trykk Lagre', 'Matlyst henter oppskriften', 'Ferdig. Ingredienser, steg og bilde.']);
  assert.deepEqual(t.stegtider, [0, 2.5, 6.0, 9.7, 13.3, 16.5]);
  assert.deepEqual(t.kilder.map((k) => k.navn), ['Instagram', 'TikTok', 'YouTube', 'Facebook', 'Nettsider', 'Matblogger', 'Bildegalleri', 'Kokebøker']);
  assert.equal(t.bunnlinje, 'Den oppskriften du lagret? Lag den i kveld.');
});

test('pris: gratis og Pro følger llms.txt, uten kroner og uten «ubegrenset»', () => {
  assert.equal(t.pris.gratis.linje, '5 importer i måneden.');
  assert.deepEqual(t.pris.gratis.punkter, ['Ukemeny og handleliste', 'Skaler porsjoner', 'Lag maten steg for steg']);
  assert.equal(t.pris.pro.linje, 'Uten grensen på fem importer.');
  assert.deepEqual(t.pris.pro.punkter, ['Lagre fra bilder og kokebøker', 'Spør Matlyst', 'Næringsinnhold per porsjon', 'Del med husstanden, opptil 6']);
  assert.equal(t.pris.pro.fot, 'Prisen ser du i appen før du kjøper.');
  assert.equal(t.pris.vernord, 'Vi har bedre ting å gjøre enn å spore deg. Nyt maten din.');
  assert.equal(t.pris.vern, 'Matlyst sporer deg ikke for reklame. Ingen annonser, ingen salg av data.');
  assert.doesNotMatch(alt, /ubegrenset|\d\s?kr\b|kroner/i);
});

test('seks spørsmål, alle med spørsmålstegn', () => {
  assert.equal(t.svar.sporsmal.length, 6);
  for (const { q, a } of t.svar.sporsmal) { assert.match(q, /\?$/); assert.ok(a.length > 20); }
});

test('teksten følger skrivereglene', () => {
  // En tankestrek mellom to sifre er et tallområde («16–22. nov 2026») og er lov.
  assert.doesNotMatch(alt, /(?<!\d)[–—]|[–—](?!\d)/, 'tankestrek');
  assert.doesNotMatch(alt, /kopp/i);
  assert.doesNotMatch(alt, /\b(beste?|nr\. ?1|nummer én)\b/i, 'superlativ');
  assert.doesNotMatch(alt, /\d+ vurderinger/, 'antall vurderinger vises ikke');
  assert.equal(t.vurdering, '5,0 av 5 i App Store');
});

test('rettene og kildene peker på filer og ikoner som finnes i planen', () => {
  assert.deepEqual(t.kokebok.retter.map((r) => r.fil), ['butterchicken', 'laks', 'focaccia', 'ramen', 'kanelboller', 'taco', 'tomatpasta', 'sjokoladekake']);
  assert.deepEqual(t.kilder.map((k) => k.ikon), ['instagram', 'tiktok', 'youtube', 'facebook', 'nettsider', 'matblogger', 'bildegalleri', 'kokeboker']);
  assert.equal(t.eksempler.svar.length, 4);
  assert.equal(t.eksempler.husstander.length, 3);
});

// Gullmønsteret: forventningen utledes fra prototypen, ikke hardkodes her.
test('hver tekst en besøkende kan lese i prototypens <main> finnes i TEKST.nb', () => {
  const html = readFileSync(`${root}docs/superpowers/prototyper/2026-11-18-forside.html`, 'utf8');
  const main = html.match(/<main[\s>][\s\S]*?<\/main>/);
  if (!main) throw new Error('Fant ikke <main> i prototypen');
  const avkodet = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');
  const tekster = [...new Set(
    main[0]
      .replace(/<script[\s\S]*?<\/script>/g, '')
      .replace(/<style[\s\S]*?<\/style>/g, '')
      .replace(/<svg[\s\S]*?<\/svg>/g, '')
      .split(/<[^>]*>/)
      .map((s) => avkodet(s).trim())
      .filter((s) => /\p{L}/u.test(s)),
  )];
  assert.ok(tekster.length > 50, `for få tekster funnet i <main>: ${tekster.length}`);

  // Bladene i TEKST.nb, ett per linje, så en tekst må finnes hel i én verdi.
  const blader = [];
  (function samle(v) {
    if (typeof v === 'string') blader.push(v);
    else if (Array.isArray(v)) v.forEach(samle);
    else if (v && typeof v === 'object') Object.values(v).forEach(samle);
  })(t);
  const lager = blader.join('\n');

  const unntak = new Map([
    ['Endringer (3)', 'settes sammen av etiketten «Endringer» og antallet i eksemplet'],
  ]);
  const mangler = tekster.filter((s) => !lager.includes(s) && !unntak.has(s));
  assert.deepEqual(mangler, [], 'tekster i prototypen som ikke finnes i TEKST.nb');
  for (const [s] of unntak) assert.ok(tekster.includes(s), `unntaket «${s}» finnes ikke lenger i prototypen`);
});

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { TEKST, EKSEMPELSTIER, fyll } from '../scripts/forside-tekst.mjs';

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

// ---------- Plassholdere og eksempelstier ----------

test('fyll() fyller plassholdere og kaster ved manglende eller ukjent plassholder', () => {
  assert.equal(fyll(t.spor.kort.endringer, { antall: 3 }), 'Endringer (3)');
  assert.equal(fyll(t.spor.kort.byttet, { fra: 'a', til: 'b' }), 'Byttet a med b');
  assert.equal(fyll('uten plassholder'), 'uten plassholder');
  assert.throws(() => fyll(t.spor.kort.byttet, { fra: 'a' }), /Mangler plassholder \{til\}/);
  assert.throws(() => fyll(t.spor.kort.endringer, { antall: 3, feil: 1 }), /Ukjent plassholder \{feil\}/);
});

test('plassholdere finnes bare i de dokumenterte tekstene', () => {
  const funnet = {};
  (function gaa(v, sti) {
    if (typeof v === 'string') { const m = [...v.matchAll(/\{(\w+)\}/g)].map((x) => x[1]); if (m.length) funnet[sti] = m.sort(); }
    else if (Array.isArray(v)) v.forEach((x, i) => gaa(x, `${sti}[${i}]`));
    else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) gaa(x, sti ? `${sti}.${k}` : k);
  })(t, '');
  assert.deepEqual(funnet, {
    'spor.kort.endringer': ['antall'],
    'spor.kort.byttet': ['fra', 'til'],
    'spor.kort.fjernet': ['vare'],
    'spor.kort.omskrevet': ['steg'],
    'middag.husstand.telling': ['ledige', 'n'],
  });
});

test('alle eksempelstier peker på en verdi som finnes', () => {
  assert.ok(EKSEMPELSTIER.length > 0);
  for (const sti of EKSEMPELSTIER) {
    const verdi = sti.split('.').reduce((v, k) => (v == null ? undefined : v[k]), t);
    assert.notEqual(verdi, undefined, `eksempelsti «${sti}» finnes ikke i TEKST.nb`);
  }
});

// ---------- Gullmønsteret: forventningen utledes fra prototypen ----------

const html = readFileSync(`${root}docs/superpowers/prototyper/2026-11-18-forside.html`, 'utf8').replace(/<!--[\s\S]*?-->/g, '');

function region(navn, re, fjern = []) {
  const m = html.match(re);
  if (!m) throw new Error(`Fant ikke «${navn}» i prototypen`);
  return fjern.reduce((h, r) => h.replace(r, ''), m[0]);
}
const regioner = {
  main: region('main', /<main[\s>][\s\S]*?<\/main>/),
  topp: region('header.topp', /<header class="topp">[\s\S]*?<\/header>/, [/<nav class="panel"[\s\S]*?<\/nav>/]),
  bunn: region('section.bunn', /<section class="bunn"[\s\S]*?<\/section>/),
  under: region('footer.under', /<footer class="under">[\s\S]*?<\/footer>/),
  fast: region('div.fast', /<div class="fast"[^>]*>[\s\S]*?<\/div>/),
  hent: region('dialog.hent', /<dialog class="hent"[\s\S]*?<\/dialog>/),
};

const avkod = (s) => s.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const rens = (s) => avkod(s).replace(/\s+/g, ' ').trim();

// Alt en besøkende (eller en skjermleser) kan lese i en region: tekstnoder og aria-label/alt.
// Attributtene hentes FØR svg fjernes, for QR-koden og flagget har aria-label på selve svg-en.
// Fet skrift og understreking midt i en setning gir ingen skille («<b>5,0</b> av 5»).
function lesbare(h) {
  const attributter = [...h.matchAll(/\s(?:aria-label|alt)="([^"]+)"/g)].map((m) => rens(m[1]));
  const noder = h
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<svg[\s\S]*?<\/svg>/g, '')
    .replace(/<\/?(?:b|u)(?:\s[^>]*)?>/g, '')
    .split(/<[^>]*>/)
    .map(rens);
  return [...attributter, ...noder];
}
// Tekster uten bokstaver (rene tall, klokkeslett, tegn som − og +) hoppes over.
const harBokstav = (s) => /\p{L}/u.test(s);

// Bladene i TEKST.nb, pluss maler fylt med eksempelverdiene fra `eksempler`.
const bladene = new Set();
(function samle(v) {
  if (typeof v === 'string') bladene.add(rens(v));
  else if (Array.isArray(v)) v.forEach(samle);
  else if (v && typeof v === 'object') Object.values(v).forEach(samle);
})(t);
for (const svar of t.eksempler.svar) {
  bladene.add(fyll(t.spor.kort.endringer, { antall: svar.antall }));
  for (const e of svar.endringer) {
    if (e.byttet) bladene.add(fyll(t.spor.kort.byttet, e.byttet));
    if (e.fjernet) bladene.add(fyll(t.spor.kort.fjernet, { vare: e.fjernet }));
    if (e.omskrevet) bladene.add(fyll(t.spor.kort.omskrevet, { steg: e.omskrevet }));
  }
}
for (const h of t.eksempler.husstander) bladene.add(fyll(t.middag.husstand.telling, { n: h.folk.length, ledige: 6 - h.folk.length }));

// 2 til 4 blad etter hverandre, skilt av ett mellomrom eller ingenting.
function sammensatt(tekst, igjen = 4) {
  if (igjen === 0) return false;
  for (let i = 1; i < tekst.length; i++) {
    if (!bladene.has(tekst.slice(0, i))) continue;
    const rest = tekst.slice(i).replace(/^ /, '');
    if (bladene.has(rest) || sammensatt(rest, igjen - 1)) return true;
  }
  return false;
}

// Kort og eksplisitt: tekster som ikke er et blad og ikke settes sammen av blad.
const unntak = new Map([
  ['mat', 'ordmerket «matlyst» er satt i to deler (mat + lyst); et varemerke som ikke oversettes'],
  ['lyst', 'ordmerket «matlyst» er satt i to deler (mat + lyst); et varemerke som ikke oversettes'],
]);

test('hver tekst en besøkende kan lese finnes ordrett i TEKST.nb', () => {
  const funnet = new Set();
  const mangler = [];
  for (const [navn, h] of Object.entries(regioner)) {
    for (const tekst of new Set(lesbare(h))) {
      if (!harBokstav(tekst)) continue;
      if (unntak.has(tekst)) { funnet.add(tekst); continue; }
      if (!bladene.has(tekst) && !sammensatt(tekst)) mangler.push(`${navn}: ${tekst}`);
    }
  }
  assert.deepEqual(mangler, [], 'tekster i prototypen som ikke finnes ordrett i TEKST.nb');
  for (const [tekst] of unntak) assert.ok(funnet.has(tekst), `unntaket «${tekst}» finnes ikke lenger i prototypen`);
});

// Rekkefølge: hver liste en besøkende leser i rekkefølge følger prototypen.
const alle = (re, h) => [...h.matchAll(re)].map((m) => rens(m[1]));

test('rekkefølgen på listene følger prototypen', () => {
  // Ikoner (svg) står inne i mange elementer og tas bort først.
  const utenSvg = (h) => h.replace(/<svg[\s\S]*?<\/svg>/g, '');
  const main = utenSvg(regioner.main), topp = utenSvg(regioner.topp);
  const bane = main.match(/<div class="bane">\s*(<ul>[\s\S]*?<\/ul>)/)[1];
  const kort = [...main.matchAll(/<article class="rute[^"]*"[^>]*>[\s\S]*?<h3>([^<]*)<\/h3>/g)].map((m) => rens(m[1]));
  const planer = [...main.matchAll(/<article class="plan[^"]*"[\s\S]*?<\/article>/g)].map((m) => [...m[0].matchAll(/<li>([^<]*)<\/li>/g)].map((x) => rens(x[1])));
  const retter = main.match(/<ul class="retter">[\s\S]*?<\/ul>/)[0];
  const sjekk = [
    ['steg', alle(/<span>([^<]*)<\/span>/g, main.match(/<ol class="steg"[\s\S]*?<\/ol>/)[0]), t.steg],
    ['stegtider', [...main.matchAll(/data-t="([\d.]+)"/g)].map((m) => Number(m[1])), t.stegtider],
    ['kilder', alle(/<span>([^<]*)<\/span>/g, bane), t.kilder.map((k) => k.navn)],
    ['rettenes titler', alle(/<h3>([^<]*)<\/h3>/g, retter), t.kokebok.retter.map((r) => r.tittel)],
    ['rettenes tider', [...retter.matchAll(/<span>([^<]*)<\/span>/g)].map((m) => rens(m[1])), t.kokebok.retter.map((r) => r.tid)],
    ['forslag', alle(/<button type="button" class="forslag"[^>]*>([^<]*)<\/button>/g, main), t.spor.forslag],
    ['kortenes titler', kort, ['skaler', 'lag', 'ukemeny', 'handle', 'husstand'].map((k) => t.middag[k].tittel)],
    ['gratispunkter', planer[0], t.pris.gratis.punkter],
    ['Pro-punkter', planer[1], t.pris.pro.punkter],
    ['spørsmål', alle(/<summary>([^<]*)<\/summary>/g, main), t.svar.sporsmal.map((x) => x.q)],
    ['svar', [...main.matchAll(/<\/summary><p>([^<]*)<\/p>/g)].map((m) => rens(m[1])), t.svar.sporsmal.map((x) => x.a)],
    ['følg-lenker', [...topp.match(/<nav class="folg"[\s\S]*?<\/nav>/)[0].matchAll(/<a href="#([^"]*)">([^<]*)<\/a>/g)].map((m) => `${m[1]}|${rens(m[2])}`), t.folg.lenker.map((l) => `${l.mal}|${l.tekst}`)],
    ['ukedager', alle(/<span>([^<]*)<\/span>/g, main.match(/<div class="a-ukedager">[\s\S]*?<\/div>/)[0]), t.middag.ukemeny.ukedager],
  ];
  for (const [navn, fraPrototype, fraTekst] of sjekk) {
    assert.ok(fraPrototype.length > 0, `fant ingen «${navn}» i prototypen`);
    assert.deepEqual(fraTekst, fraPrototype, `rekkefølgen på «${navn}»`);
  }
});

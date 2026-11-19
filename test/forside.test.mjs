import { krevIngenBrukerpause, krevIngenCssPause } from './hjelp/bevegelsesvern.mjs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { forside, kjor } from '../scripts/forside.mjs';
import { TEKST } from '../scripts/forside-tekst.mjs';
const rot = fileURLToPath(new URL('..', import.meta.url));
const les = (fil) => readFileSync(join(rot, fil), 'utf8');
const html = les('index.html');

test('index.html er nøyaktig det generatoren lager', () => {
  assert.equal(html, forside('nb'));
});

test('hodet er urørt: tittel, beskrivelse, hreflang og skjema', () => {
  assert.match(html, /<title>Matlyst: oppskriftsappen for iPhone og Android<\/title>/);
  assert.match(html, /<meta name="description" content="Oppskriftsappen som oversetter og tilpasser oppskriftene dine\. /);
  for (const [kode, href] of [['nb-NO', '/'], ['sv-SE', '/sv/'], ['da-DK', '/da/'], ['en', '/en/'], ['x-default', '/en/']]) assert.match(html, new RegExp(`<link rel="alternate" hreflang="${kode}" href="https://matlyst-app\\.no${href}">`));
  assert.match(html, /"ratingValue": "5\.0", "ratingCount": "12"/);
  assert.match(html, /"@type":\s*"Organization"/);
  assert.match(html, /<meta name="theme-color" content="#FFFFFF">/);
});

test('siden laster de nye stilarkene og ikke det gamle', () => {
  for (const fil of ['/tokens.css', '/skall.css', '/forside.css', '/language-switcher.css']) assert.match(html, new RegExp(`<link rel="stylesheet" href="${fil}">`));
  assert.doesNotMatch(html, /href="\/styles\.css"/);
  for (const fil of ['/locale.js', '/language-switcher.js', '/site.js', '/skall.js', '/forside.js']) assert.match(html, new RegExp(`<script src="${fil}" defer></script>`));
});

test('toppen: én H1, ingress, knapp, stjerner og seks steg', () => {
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.match(html, /<h1[^>]*>Oppskrifter du faktisk lager\.<\/h1>/);
  assert.match(html, /<p class="lead">Fra en Reel, en nettside eller et bilde av bestemors kort\. Matlyst gjør dem om til ingredienser og steg\.<\/p>/);
  assert.deepEqual([...html.matchAll(/class="st" data-t="([\d.]+)"/g)].map((m) => +m[1]), [0, 2.5, 6.0, 9.7, 13.3, 16.5]);
  assert.match(html, /5,0<\/b> av 5 i App Store/);
});

test('filmen har plakat, faste mål og ingen kontroller', () => {
  const film = html.match(/<div class="film"[\s\S]*?<\/div>/)[0];
  assert.match(film, /<video[^>]*poster="\/images\/forside\/film\/import-nb-plakat\.webp"[^>]*muted[^>]*playsinline[^>]*loop/);
  assert.doesNotMatch(film, /<button|controls/);
});

test('ingenting på siden kan stoppes', () => {
  assert.doesNotMatch(html, /class="[^"]*\b(pause|spillav|filmknapp)\b/);
  assert.doesNotMatch(html, />\s*(Pause|Spill av|Stopp)\s*</);
});

test('nøyaktig to språkvelgere, og aria-current="page" bare der', () => {
  assert.equal((html.match(/class="language-switcher(?: [^"]*)?"/g) ?? []).length, 2);
  assert.equal((html.match(/aria-current="page"/g) ?? []).length, 2);
});

test('uten JavaScript står overskriften synlig', () => {
  const css = les('forside.css');
  assert.doesNotMatch(css, /^\.hero h1\s*\{[^}]*(visibility:\s*hidden|opacity:\s*0)/m, 'bare .js-varianten kan skjule den');
});

test('nedlastingsdelen finnes og har ingen e-postfelt', () => {
  assert.match(html, /<section class="bunn" id="last-ned"/);
  assert.doesNotMatch(html, /<form\b|type="email"/);
});

test('følgemenyen har fem lenker, og hver peker på en del som finnes', () => {
  const meny = html.match(/<nav class="folg"[\s\S]*?<\/nav>/)[0];
  const lenker = [...meny.matchAll(/<a href="#([\w-]+)">([^<]+)<\/a>/g)].map(([, id, tekst]) => [id, tekst]);
  assert.deepEqual(lenker.map((l) => l[1]), ['Lagre', 'Spør Matlyst', 'Lag maten', 'Pris', 'Spørsmål']);
  assert.deepEqual(lenker.map((l) => l[0]), ['lagre', 'spor', 'middag', 'pris', 'svar']);
  for (const [id] of lenker) assert.match(html, new RegExp(`id="${id}"`));
});

test('kildene på båndet er de godkjente, og lista står fire ganger', () => {
  const lister = [...html.match(/<div class="band"[\s\S]*?<\/div>\s*<\/div>/)[0].matchAll(/<ul[^>]*>([\s\S]*?)<\/ul>/g)];
  assert.equal(lister.length, 4);
  assert.deepEqual([...lister[0][1].matchAll(/<span>([^<]+)<\/span>/g)].map((m) => m[1]), TEKST.nb.kilder.map((k) => k.navn));
  assert.equal(lister.filter((l) => /^<ul[^>]*aria-hidden="true"/.test(l[0])).length, 3);
});

test('ukjent språk gir en tydelig feil', () => {
  assert.throws(() => forside('sv'), /Mangler.*sv/);
});

test('manglende tekst kaster med nøkkelstien, også i lister', () => {
  for (const [objekt, nokkel, sti] of [[TEKST.nb, 'h1', 'nb.h1'], [TEKST.nb.kilder[0], 'navn', 'nb.kilder.0.navn'], [TEKST.nb.folg.lenker[0], 'tekst', 'nb.folg.lenker.0.tekst']]) {
    const gammel = objekt[nokkel];
    try {
      delete objekt[nokkel];
      assert.throws(() => forside('nb'), (feil) => feil.message.includes(sti));
    } finally { objekt[nokkel] = gammel; }
  }
});

test('tom vurdering fjerner hele linja med stjernene', () => {
  const gammel = TEKST.nb.vurdering;
  try {
    TEKST.nb.vurdering = '';
    assert.doesNotMatch(forside('nb'), /class="bevis"|class="stjerner"/);
  } finally { TEKST.nb.vurdering = gammel; }
  assert.match(forside('nb'), /class="bevis"/);
  assert.match(forside('nb'), /class="stjerner"/);
});

test('generatoren bruker tekstkilden og skjermer HTML-tegn', () => {
  const gammel = TEKST.nb.ingress;
  try {
    TEKST.nb.ingress = 'Prøve <tekst> & "tegn"';
    assert.ok(forside('nb').includes('Prøve &lt;tekst&gt; &amp; &quot;tegn&quot;'));
  } finally { TEKST.nb.ingress = gammel; }
});

test('nedlastingsknappene og sideskallet står i avtalt rekkefølge', () => {
  assert.deepEqual([...html.matchAll(/data-hent="([^"]+)"/g)].map((m) => m[1]), ['topp', 'helt', 'bunn', 'fast']);
  assert.match(html, /<a class="knapp" href="\/app" data-hent="helt">/);
  assert.match(html, /<body data-app-uttrykk="1">/);
  assert.match(html, /<main id="hovedinnhold">/);
  assert.match(html, /rel="apple-touch-icon"/);
  assert.doesNotMatch(html, /id="dl-bar"|class="hero-stage"|Relaterte guider/);
});

test('filmen lastes direkte med metadata og faste mål', () => {
  const video = html.match(/<video\b[^>]*>/)[0];
  assert.match(video, /src="\/images\/forside\/film\/import-nb.mp4"/);
  assert.match(video, /preload="metadata"/);
  assert.match(video, /width="628" height="1300"/);
});

test('kjor skriver samme dokument i valgt rot og tåler mellomrom i stien', () => {
  const mappe = mkdtempSync(join(tmpdir(), 'matlyst forside '));
  try {
    kjor(mappe);
    assert.equal(readFileSync(join(mappe, 'index.html'), 'utf8'), forside('nb'));
  } finally { rmSync(mappe, { recursive: true, force: true }); }
});

for (const fil of ['forside.js', 'skall.js']) {
  test(`${fil}: brukerhåndterere og hjelperne deres kan ikke pause`, () => {
    krevIngenBrukerpause(les(fil), fil);
  });
}

test('forside.css: hover, trykk og fokus kan ikke pause', () => {
  krevIngenCssPause(les('forside.css'));
});

test('kokeboka har åtte retter med mål, tom alt-tekst, sen lasting og KI-merke', () => {
  const del = html.match(/<section class="kokebok"[\s\S]*?<\/section>/)?.[0] ?? '';
  const bilder = [...del.matchAll(/<img [^>]+>/g)].map((m) => m[0]);
  assert.equal(bilder.length, 8);
  for (const b of bilder) assert.match(b, /src="\/images\/forside\/mat\/[\w-]+\.webp" alt="" width="520" height="680" loading="lazy" decoding="async"/);
  assert.match(del, /<p class="kimerke">Bildene er laget med KI\.<\/p>/);
  assert.match(del, /<h2[^>]*>Din egen kokebok<\/h2>/);
  assert.match(del, /id="retterom"/);
});

test('Spør Matlyst har fire forslag og sier hva som er gratis', () => {
  const del = html.match(/<section class="spor[^"]*" id="spor"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.deepEqual([...del.matchAll(/class="forslag"[^>]*>([^<]+)</g)].map((m) => m[1]), ['Gjør denne vegansk', 'Jeg ønsker en lavkarbo-versjon', 'Bytt ut fløten', 'Bruk det jeg har i spiskammeret']);
  assert.match(del, /Spørsmål om en oppskrift er gratis\. Å skrive den om krever Matlyst Pro\./);
  assert.match(del, /Matlyst bruker KI\. Sjekk alltid oppskriften\./);
});

test('kokebok og svar leser nøstede tekstnøkler og validerer plassholderne', () => {
  for (const [objekt, nokkel, sti] of [[TEKST.nb.kokebok.retter[0], 'tittel', 'nb.kokebok.retter.0.tittel'], [TEKST.nb.spor.kort, 'kopi', 'nb.spor.kort.kopi'], [TEKST.nb.spor.kort, 'merkeStart', 'nb.spor.kort.merkeStart'], [TEKST.nb.spor.kort, 'merkeSlutt', 'nb.spor.kort.merkeSlutt'], [TEKST.nb.eksempler.svar[0].endringer[0].byttet, 'fra', 'nb.eksempler.svar.0.endringer.0.byttet.fra']]) {
    const gammel = objekt[nokkel];
    try { delete objekt[nokkel]; assert.throws(() => forside('nb'), (feil) => feil.message.includes(sti)); }
    finally { objekt[nokkel] = gammel; }
  }
  const gammel = TEKST.nb.spor.kort.byttet;
  try {
    TEKST.nb.spor.kort.byttet = '{ukjent}';
    assert.throws(() => forside('nb'), /Mangler plassholder/);
    TEKST.nb.spor.kort.byttet = '{fra}';
    assert.throws(() => forside('nb'), /Ukjent plassholder/);
    TEKST.nb.spor.kort.byttet = 'Erstatt {fra} med {til}';
    assert.match(forside('nb'), /Erstatt <b>kyllingfilet<\/b> med <b>kikerter<\/b>/);
  } finally { TEKST.nb.spor.kort.byttet = gammel; }
});

const seksjon = (klasse) => html.match(new RegExp(`<section class="${klasse}[^\"]*"[\\s\\S]*?</section>`))?.[0] ?? '';
const renTekst = (s) => s.replace(/<[^>]+>/g, '').replaceAll('&amp;', '&').trim();

test('fem kort i godkjent rekkefølge', () => {
  assert.match(seksjon('del'), /id="middag"/);
  assert.match(seksjon('del'), /id="trio"/);
  assert.deepEqual([...seksjon('del').matchAll(/<h3[^>]*>([^<]+)<\/h3>/g)].map((m) => m[1]), ['Skaler', 'Lag maten', 'Ukemeny', 'Handle', 'Husstand']);
  assert.deepEqual([...seksjon('del').matchAll(/data-inn="([vh])"/g)].map((m) => m[1]), ['v', 'h', 'v', 'v', 'h']);
});

test('det gamle funksjoner-ankeret omslutter middag og de fem kortene', () => {
  const del = html.match(/<div id="funksjoner">\s*(<section\b[^>]*id="middag"[\s\S]*?<\/section>)\s*<\/div>/)?.[1];
  assert.ok(del, 'funksjoner skal ligge rundt middag, slik at begge ankrene virker');
  assert.equal((html.match(/id="funksjoner"/g) ?? []).length, 1);
  assert.deepEqual([...del.matchAll(/<h3[^>]*>([^<]+)<\/h3>/g)].map((m) => m[1]), ['Skaler', 'Lag maten', 'Ukemeny', 'Handle', 'Husstand']);
});

test('pris: to kort, personvernlinje, og ingen kroner på siden', () => {
  const del = seksjon('pris');
  assert.equal((del.match(/class="plan(?: pro)?"/g) ?? []).length, 2);
  for (const tekst of ['Hva koster det?', '5 importer i måneden.', 'Uten grensen på fem importer.', 'Skriv om oppskrifter med Spør Matlyst', 'Matlyst sporer deg ikke for reklame. Ingen annonser, ingen salg av data.']) assert.ok(del.includes(tekst), tekst);
  assert.match(del, /<p class="vernord">Vi har bedre ting å gjøre enn å spore deg\. Nyt maten din\.<\/p>/);
  assert.match(del, /<a href="\/personvern\.html">/);
  assert.match(del, /M5 12\.5l4\.5 4\.5L19 7\.5/);
  const synlig = renTekst(html.replace(/<script[\s\S]*?<\/script>/g, ' '));
  assert.doesNotMatch(synlig, /\d\s?kr\b|kroner|ubegrenset|kopper/i);
  assert.doesNotMatch(synlig.replace(/(?<=\d)[–—](?=\d)/g, ''), /[–—]/);
});

test('synlige spørsmål og svar er identiske med ett FAQPage-skjema i hodet', () => {
  const synlig = [...seksjon('ofte').matchAll(/<details[^>]*>\s*<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>/g)].map(([, q, a]) => ({ q: renTekst(q), a: renTekst(a) }));
  const skjemaer = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1])).filter((s) => s['@type'] === 'FAQPage');
  assert.equal(synlig.length, 6);
  assert.equal(skjemaer.length, 1);
  assert.ok(html.indexOf('"FAQPage"') < html.indexOf('</head>'));
  assert.deepEqual(skjemaer[0].mainEntity.map((e) => ({ q: e.name, a: e.acceptedAnswer.text })), synlig);
});

test('ingen H2 ligner H1, og ingen overskrift gjentar et ord', () => {
  const ord = (s) => renTekst(s).toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
  const a = new Set(ord(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)[1]));
  for (const [, tekst] of html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)) {
    const b = new Set(ord(tekst));
    assert.ok([...a].filter((o) => b.has(o)).length / new Set([...a, ...b]).size < .75, tekst);
  }
  for (const [, tekst] of html.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/g)) {
    const ordene = ord(tekst);
    for (let i = 1; i < ordene.length; i++) assert.notEqual(ordene[i], ordene[i - 1], tekst);
  }
});

test('kort, pris og spørsmål bruker den kastende tekstleseren og fyll', () => {
  for (const [objekt, nokkel, sti] of [[TEKST.nb.middag.skaler.ingredienser[0], 'navn', 'middag.skaler.ingredienser.0.navn'], [TEKST.nb.middag.lag, 'start', 'middag.lag.start'], [TEKST.nb.middag.ukemeny, 'uke', 'middag.ukemeny.uke'], [TEKST.nb.middag.handle.ark, 'oppdater', 'middag.handle.ark.oppdater'], [TEKST.nb.eksempler.husstander[1].varer[0], 'eier', 'eksempler.husstander.1.varer.0.eier'], [TEKST.nb.pris.pro, 'linje', 'pris.pro.linje'], [TEKST.nb.svar.sporsmal[0], 'a', 'svar.sporsmal.0.a']]) {
    const gammel = objekt[nokkel];
    try { delete objekt[nokkel]; assert.throws(() => forside('nb'), (e) => e.message.includes(sti)); }
    finally { objekt[nokkel] = gammel; }
  }
  const gammel = TEKST.nb.middag.husstand.telling;
  try { TEKST.nb.middag.husstand.telling = '{ukjent}'; assert.throws(() => forside('nb'), /Mangler plassholder/); }
  finally { TEKST.nb.middag.husstand.telling = gammel; }
  for (const h of TEKST.nb.eksempler.husstander) assert.notEqual(6 - h.folk.length, 1);
  assert.equal((seksjon('del').match(/<template class="hus-eksempel"/g) ?? []).length, 3);
});

test('Spør Matlyst har tilgjengelig forspann og svarbeskrivelse fra hver mal', () => {
  assert.match(seksjon('spor'), /<p class="felt"><span class="kun-skjermleser">Eksempel på hva du kan be om/);
  assert.doesNotMatch(seksjon('spor'), /<p class="felt" aria-label/);
  const maler = [...seksjon('spor').matchAll(/<template class="spor-eksempel"[^>]*data-aria="([^"]+)"/g)];
  assert.equal(maler.length, 4);
  assert.equal(new Set(maler.map((m) => m[1])).size, 4);
});

test('forsidens fargeliteraler er erstattet med tokens også når de har alfa', () => {
  assert.doesNotMatch(les('forside.css'), /#[\da-f]{3,8}\b|rgba?\(\s*\d/gi);
});

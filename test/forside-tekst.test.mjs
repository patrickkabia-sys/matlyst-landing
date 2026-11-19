import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { TEKST, EKSEMPELSTIER, fyll } from '../scripts/forside-tekst.mjs';
import { SKALLTEKST } from '../scripts/skall-tekst.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
// Forsidens egne tekster og skalltekstene har hver sin eier, men siden leses som én.
const t = { ...TEKST.nb, ...SKALLTEKST.nb }, alt = JSON.stringify(t);

test('forsidens tekster og skalltekstene har ingen felles nøkler', () => {
  assert.deepEqual(Object.keys(TEKST.nb).filter((k) => k in SKALLTEKST.nb), []);
});

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
  assert.deepEqual(t.pris.pro.punkter, ['Lagre fra bilder og kokebøker', 'Skriv om oppskrifter med Spør Matlyst', 'Næringsinnhold per porsjon', 'Del med husstanden, opptil 6']);
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
  assert.throws(() => fyll('{antall}', { antall: undefined }), /ingen verdi/);
  assert.throws(() => fyll('{antall}', { antall: null }), /ingen verdi/);
  assert.throws(() => fyll('{feil-navn}', {}), /Ugyldig plassholder/);
});

test('plassholdere finnes bare i de dokumenterte tekstene', () => {
  const funnet = {};
  (function gaa(v, sti) {
    if (typeof v === 'string') { const m = [...v.matchAll(/\{(\w+)\}/g)].map((x) => x[1]); if (m.length) funnet[sti] = m.sort(); }
    else if (Array.isArray(v)) v.forEach((x, i) => gaa(x, `${sti}[${i}]`));
    else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) gaa(x, sti ? `${sti}.${k}` : k);
  })(t, '');
  assert.deepEqual(funnet, {
    'spor.kort.svarAria': ['forklaring', 'oppskrift'],
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

const html = readFileSync(`${root}docs/superpowers/prototyper/2026-11-18-forside.html`, 'utf8')
  .replace(/<!--[\s\S]*?-->/g, '')
  // Ordmerket «matlyst» er satt i to deler i markupen. Det er en logo, ikke tekst.
  .replace(/mat<em>lyst<\/em>/g, '');

function region(navn, re, endre = (h) => h) {
  const m = html.match(re);
  if (!m) throw new Error(`Fant ikke «${navn}» i prototypen`);
  return endre(m[0]);
}
const seksjon = (klasse) => region(`section.${klasse}`, new RegExp(`<section class="${klasse}[ "][\\s\\S]*?<\\/section>`));
const regioner = {
  main: region('main', /<main[\s>][\s\S]*?<\/main>/),
  // Menypanelet: bare åpningstaggen (med sin egen aria-label) beholdes. Hyllene bor i scripts/hyller.mjs.
  topp: region('header.topp', /<header class="topp">[\s\S]*?<\/header>/, (h) => h.replace(/(<nav class="panel"[^>]*>)[\s\S]*?<\/nav>/, '$1</nav>')),
  bunn: region('section.bunn', /<section class="bunn"[\s\S]*?<\/section>/),
  under: region('footer.under', /<footer class="under">[\s\S]*?<\/footer>/),
  fast: region('div.fast', /<div class="fast"[^>]*>[\s\S]*?<\/div>/),
  hent: region('dialog.hent', /<dialog class="hent"[\s\S]*?<\/dialog>/),
};

const avkod = (s) => s.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const rens = (s) => avkod(s).replace(/\s+/g, ' ').trim();
// Tekster uten bokstaver (rene tall, klokkeslett, tegn som − og +) hoppes over.
const harBokstav = (s) => /\p{L}/u.test(s);

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
  return [...attributter, ...noder].filter(harBokstav);
}

// Bladene i TEKST.nb med sti, for eksempel ['middag.skaler.tittel', 'Skaler'].
function blader(v, sti = '', ut = []) {
  if (typeof v === 'string') ut.push([sti, v]);
  else if (Array.isArray(v)) v.forEach((x, i) => blader(x, sti ? `${sti}.${i}` : String(i), ut));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) blader(x, sti ? `${sti}.${k}` : k, ut);
  return ut;
}
const hent = (sti) => sti.split('.').reduce((v, k) => v[k], t);

// Strenger i modulen som aldri vises som tekst: ankre, ikon-id-er, filnavn, språkkoder,
// og tidsuttrykket som allerede står inne i stegteksten.
const IKKE_TEKST = /(^|\.)(mal|ikon|fil|kode|tidsuttrykk)$/;

// Det første svaret i Spør Matlyst (alle endringene og forklaringen) står ferdig i markupen;
// de tre andre tegnes av scriptet.
const forsteSvar = t.eksempler.svar[0];

// Regiontabellen: hvilken del av prototypen hører til hvilke nøkler i TEKST.nb.
//   nokler  nøkkelgruppene på øverste nivå som vises i regionen
//   utelatt stier (regex) som finnes i modulen men tegnes bare av scriptet, ikke i markupen
//   fylt    maler med plassholdere, fylt med eksempelverdiene som står i markupen
//   ekstra  enkeltstier utenfor nøklene (eksempeltekster som markupen viser ferdig)
//   teller  hvor mange ganger en sti (prefiks) vises i regionen når den er lagret én gang
const REGIONER = [
  { navn: 'header', html: regioner.topp, nokler: ['topp', 'folg'],
    utelatt: [/^topp\.hopp$/], // skiplenken står ikke i prototypen; låst i skall.test.mjs
  },
  {
    navn: 'hero', html: seksjon('hero'),
    nokler: ['h1', 'ingress', 'knapp', 'vurdering', 'stegAria', 'steg', 'filmAria', 'kildetittel', 'kilderAria', 'kilder'],
    teller: { kilder: 4 }, // båndet står i fire kopier så det kan rulle sømløst; tre er skjult for skjermlesere
  },
  { navn: 'kokebok', html: seksjon('kokebok'), nokler: ['kokebok'] },
  {
    navn: 'spor', html: seksjon('spor'), nokler: ['spor'],
    // Ordmerket fjernes også fra prototypen over; endrer vises bare under bytte.
    utelatt: [/^spor\.kort\.(endrer|merkeStart|merkeSlutt)$/],
    fylt: [['spor.kort.endringer', { antall: forsteSvar.antall }], ...forsteSvar.endringer.map((e) => ['spor.kort.byttet', e.byttet])],
    ekstra: ['eksempler.svar.0.forklaring'],
    teller: { 'spor.forslag.0': 2 }, // første forslag står også som ferdig skrevet tekst i feltet
  },
  {
    navn: 'middag', html: seksjon('del'), nokler: ['middag'],
    utelatt: [
      /^middag\.skaler\.ingredienser\.\d+\.mengder\.[12]$/, // mengdene ved 5 og 6 porsjoner tegnes av scriptet
      /^middag\.handle\.varer\.\d+\.mengder\.1$/, // mengden ved 6 porsjoner tegnes av scriptet
      /^middag\.husstand\.(listehode|maltid)$/, // husstandskortet tegnes helt av scriptet
    ],
    teller: { 'middag.ukemeny.maltid': 2 }, // «Middag» står på begge de planlagte rettene
  },
  { navn: 'pris', html: seksjon('pris'), nokler: ['pris'] },
  { navn: 'ofte', html: seksjon('ofte'), nokler: ['svar'] },
  {
    navn: 'bunn', html: regioner.bunn, nokler: ['bunn', 'bunnlinje'],
    // «bunn.guider» finnes ikke i prototypen; låst i skall.test.mjs.
    utelatt: [/^bunn\.guider$/],
  },
  { navn: 'footer', html: regioner.under, nokler: ['under', 'sprak'] },
  { navn: 'fast', html: regioner.fast, nokler: ['fast'] },
  { navn: 'dialog', html: regioner.hent, nokler: ['hent'] },
];
// Nøkkelgrupper som ikke har noen region: eksempeltekster tegnet av scriptet (bortsett fra
// forklaringen over). Kontrollert for hånd, ikke maskinelt.
const UREGIONERT = [
  'eksempler', 'stegtider',
  'innhold', // vises ikke på forsiden; låst i skall.test.mjs
  'samtykke', // banneret står ikke i prototypen; teksten er låst i skall.test.mjs mot dagens index.html
];

const PROTOTYPEUNNTAK = [
  // prototypen sier Vilkår; gruppa inneholder også Personvern og Informasjonskapsler, så navnet er Juridisk
  { region: 'footer', attributt: /(<div class="underlinje">\s*<nav aria-label=")([^"]*)(")/g, fra: 'Vilkår', til: 'Juridisk', sti: 'under.vilkarAria' },
];

function medPrototypeunntak(r) {
  let html = r.html;
  for (const unntak of PROTOTYPEUNNTAK.filter((u) => u.region === r.navn)) {
    const treff = [...html.matchAll(unntak.attributt)];
    assert.equal(treff.length, 1, `${r.navn}: unntaket gjelder nøyaktig én nav-etikett`);
    assert.equal(treff[0][2], unntak.fra, `${r.navn}: prototypens etikett er endret`);
    assert.equal(hent(unntak.sti), unntak.til, `${unntak.sti}: tekstfilas etikett er endret`);
    html = html.replace(unntak.attributt, (_, start, verdi, slutt) => start + unntak.til + slutt);
  }
  return html;
}

function modulTekster(r) {
  const ut = [];
  const legg = (tekst, antall = 1) => { for (let i = 0; i < antall; i++) ut.push(tekst); };
  for (const [sti, v] of blader(t)) {
    if (!r.nokler.includes(sti.split('.')[0])) continue;
    if (IKKE_TEKST.test(sti)) continue;
    if ((r.utelatt ?? []).some((re) => re.test(sti))) continue;
    if (v.includes('{')) continue; // maler tas bare med via `fylt`
    const tellerSti = Object.keys(r.teller ?? {}).find((k) => sti === k || sti.startsWith(`${k}.`));
    legg(rens(v), tellerSti ? r.teller[tellerSti] : 1);
  }
  for (const [sti, verdier] of r.fylt ?? []) legg(rens(fyll(hent(sti), verdier)));
  for (const sti of r.ekstra ?? []) legg(rens(hent(sti)));
  return ut.filter(harBokstav).sort();
}

test('hver nøkkelgruppe i TEKST.nb hører til en region eller er et kjent unntak', () => {
  const kartlagt = new Set([...REGIONER.flatMap((r) => r.nokler), ...UREGIONERT]);
  assert.deepEqual(Object.keys(t).filter((k) => !kartlagt.has(k)), [], 'nøkkelgrupper uten region');
  for (const k of kartlagt) assert.ok(k in t, `regiontabellen nevner «${k}» som ikke finnes i TEKST.nb`);
});

for (const r of REGIONER) {
  test(`region ${r.navn}: tekstene i prototypen og i TEKST.nb er de samme, like mange ganger`, () => {
    const prototype = lesbare(medPrototypeunntak(r)).sort();
    const modul = modulTekster(r);
    assert.ok(prototype.length > 0, `leste ingen tekst fra «${r.navn}» i prototypen`);
    assert.ok(modul.length > 0, `ingen tekst i TEKST.nb for «${r.navn}»`);
    // Multimengder: forskjellen i hver retning, så en dobbel eller manglende tekst vises.
    const trekkFra = (a, b) => { const rest = [...b]; return a.filter((x) => { const i = rest.indexOf(x); if (i < 0) return true; rest.splice(i, 1); return false; }); };
    assert.deepEqual({ kunPrototype: trekkFra(prototype, modul), kunModul: trekkFra(modul, prototype) }, { kunPrototype: [], kunModul: [] }, `region ${r.navn}`);
    assert.deepEqual(modul, prototype);
  });
}

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

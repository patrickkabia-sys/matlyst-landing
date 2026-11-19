import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { utenKommentarer, klasserUtenRegel, klasserIVelgere, velgerliste, regler } from './hjelp/klassedekning.mjs';

const les = (f) => readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
const css = utenKommentarer(les('side.css'));
const tokens = utenKommentarer(les('tokens.css'));
const skall = utenKommentarer(les('skall.css'));
const velgere = velgerliste(css);

test('side.css har delene i rekkefølge', () => {
  const rå = les('side.css');
  const navn = ['Grunnstil', 'Omregner', 'Lang guide', 'Kort guide', 'Eldre sider', 'Blogg', 'Juss'];
  const pos = navn.map((n) => rå.indexOf(`/* == ${n} == */`));
  assert.ok(pos.every((p) => p > -1), `mangler del: ${pos}`);
  assert.deepEqual([...pos].sort((a, b) => a - b), pos);
});

test('side.css bruker bare tokens fra tokens.css, uten heksverdier', () => {
  const definert = new Set([...tokens.matchAll(/(--[\w-]+)\s*:/gu)].map((m) => m[1]));
  const brukt = [...css.matchAll(/var\((--[\w-]+)/gu)].map((m) => m[1]);
  assert.deepEqual(brukt.filter((t) => !definert.has(t)), []);
  assert.deepEqual(css.match(/#[0-9a-fA-F]{3,8}\b/gu) ?? [], []);
  assert.deepEqual(css.match(/\b(?:hsla?|hwb|lab|lch|oklab|oklch|color)\(/gu) ?? [], [], 'bare tokens; color-mix(var(...)) er lov');
  assert.deepEqual([...css.matchAll(/(?:color|background(?:-color)?|border(?:-[a-z]+)*|fill|stroke|outline(?:-color)?)\s*:[^;}]*\b(white|black|red|green|blue|gray|grey|orange|purple|pink|brown|yellow)\b/gu)].map((m) => m[0]), []);
  assert.deepEqual([...css.matchAll(/rgba?\(\s*(?!var\()[^)]*\)/gu)].map((m) => m[0]), []);
});

test('skriftstørrelser i side.css er i rem', () => {
  assert.deepEqual([...css.matchAll(/font(?:-size)?:[^;}]*?\d+(?:\.\d+)?px/gu)].map((m) => m[0]), []);
});

test('side.css rører ikke skallet', () => {
  assert.deepEqual(velgere.filter((v) => /(^|[\s>+~])(nav|footer)(?![\w-])|\.(topp|panel|reol|fag|faghode|bunn|bunnrad|alle-guider|under|underlinje|fast|hent|henttittel|side|kort|blad|knapp|cookie|ck-btn|merke|ordmerke)(?![\w-])/u.test(v)), []);
});

test('bevegelse står stille ved redusert bevegelse', () => {
  const med = /@media\s*\(prefers-reduced-motion:\s*reduce\)/u;
  for (const [navn, kilde] of [['side.css', css], ['skall.css', skall]]) {
    const harBevegelse = /(transition|animation)\s*:/u.test(kilde.replace(/@media\s*\(prefers-reduced-motion[^{]*\{[\s\S]*?\}\s*\}/u, ''));
    if (harBevegelse) assert.match(kilde, med, `${navn} har bevegelse uten reduce-regel`);
  }
});

test('klassedekningen ser en klasse uten regel', () => {
  assert.ok(klasserUtenRegel('guide-kort', {}).length > 0);
});

test('grunnstilen dekker kjernen i hver byggekloss', () => {
  for (const velger of ['.locale-page-hero', '.locale-prose', '.answer', '.table-wrap', '.i-appen', '.app-cta', '.page-cta', '.faq', '.related', '.omregner-liste', '.steps', '.step']) {
    assert.ok(velgere.some((v) => v.includes(velger)), `ingen regel for ${velger}`);
  }
});

test('bannerstilen i skall.css er på plass', () => {
  assert.ok(/\.cookie\b[^{}]*\{[^}]*border-radius:\s*28px/u.test(skall));
  assert.ok(regler(skall).some((r) => /\.ck-btn\b/u.test(r.velger)));
  assert.match(skall, /\.cookie h3/u);
});

test('godta og avvis har samme regler i skall.css (grovt; den beregnede testen tar bredder)', () => {
  const normalisert = (navn) => regler(skall)
    .filter((r) => r.velger.split(',').some((v) => new RegExp(`\\.${navn}(?![\\w-])`, 'u').test(v)))
    .map((r) => JSON.stringify([r.velger.split(',').map((v) => v.trim().replace(/\.ck-(accept|reject)(?![\w-])/gu, '.ck-X')).sort(), r.kropp.replace(/\s+/gu, '')]))
    .sort();
  const godta = normalisert('ck-accept');
  assert.ok(godta.length > 0, 'ingen regel for .ck-accept');
  assert.deepEqual(normalisert('ck-reject'), godta);
});

test('klasseleseren leser bare velgere', () => {
  assert.deepEqual([...klasserIVelgere('.a,.b > .c[href$=".pdf"]{background:url(x.webp);margin:1.5rem}@media (min-width:1px){.d{color:red}}')].sort(), ['a', 'b', 'c', 'd']);
});

test('velgerlisten tar med den første regelen inne i @media', () => {
  assert.deepEqual(velgerliste('@media (min-width:1px){.a{x:y}.b{x:y}}'), ['.a', '.b']);
});

test('skriftstørrelser bruker ikke vw (følger ikke tekststørrelsen)', () => {
  assert.deepEqual([...css.matchAll(/font-size:[^;}]*\dvw/gu)].map((m) => m[0]), []);
});

test('omregnersidene har stil for alle klassene i innholdet', () => {
  assert.deepEqual(klasserUtenRegel('omregner', {
    'omregner-data': 'bare data for kalkulatoren i site.js',
    'disp': 'skriftvalg på overskrifter, ingen egen regel', 'has-toc': 'markør; innholdsfortegnelsen skjules', 'toc-title': 'skjules sammen med .toc',
    'i-import': 'velger bilde i app-bevis', 'i-kokemodus': 'velger bilde i app-bevis',
    'i-mapper': 'velger bilde i app-bevis', 'i-skalering': 'velger bilde i app-bevis', 'i-enheter': 'velger bilde i app-bevis',
  }), []);
});

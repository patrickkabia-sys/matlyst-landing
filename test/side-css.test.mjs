import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { utenKommentarer, klasserUtenRegel } from './hjelp/klassedekning.mjs';

const les = (f) => readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
const css = utenKommentarer(les('side.css'));
const tokens = utenKommentarer(les('tokens.css'));
const skall = utenKommentarer(les('skall.css'));
const velgere = [...css.matchAll(/(?:^|\})\s*([^{}@]+)\{/gu)].flatMap((m) => m[1].split(',').map((v) => v.trim()));

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

test('bannerstilen i skall.css er på plass og knappene er like', () => {
  const regel = (v) => new RegExp(`${v.replace(/[.\[\]]/gu, '\\$&')}[^{}]*\\{[^}]*\\}`, 'u').exec(skall)?.[0] ?? '';
  assert.ok(/\.cookie\b[^{}]*\{[^}]*border-radius:\s*28px/u.test(skall));
  assert.ok(regel('.ck-btn').length > 0);
  assert.ok(!/\.ck-reject[^{}]*\{[^}]*(background:\s*none|background:\s*transparent|opacity)/u.test(skall), 'avvis skal ha lik vekt som godta');
  assert.match(skall, /\.cookie h3/u);
});

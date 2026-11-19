// Tjenestesidene: stilarkene, og at sidene som bærer signerte tokens aldri får skall, site.js, banner eller måling.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { alleSider, tjenestefamilie, erUtrullet } from '../scripts/sidetyper.mjs';
import { utenKommentarer } from './hjelp/klassedekning.mjs';
import { effektiv } from './hjelp/knappevekt.mjs';

const rot = new URL('..', import.meta.url).pathname;
const les = (f) => readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
const familie = (navn) => alleSider(rot).filter((s) => tjenestefamilie(s.sti) === navn);
const tokensFør = (h, ark) => h.indexOf('href="/tokens.css"') > -1 && h.indexOf('href="/tokens.css"') < h.indexOf(`href="${ark}"`);

test('de tre avmeldingsfamiliene har de forventede sidene', () => {
  assert.equal(familie('avmeld').length, 4);
  assert.equal(familie('bekreft').length, 1);
  assert.equal(familie('vervekort').length, 4);
});

test('avmelding og bekreftelse laster tokens og tjeneste.css, ikke styles.css', () => {
  const sider = [...familie('avmeld'), ...familie('bekreft'), ...familie('vervekort')];
  assert.equal(sider.length, 9);
  for (const s of sider) {
    const h = les(s.fil);
    assert.ok(tokensFør(h, '/avmeld.css'), s.sti);
    assert.ok(h.indexOf('href="/tjeneste.css"') > h.indexOf('href="/tokens.css"') && h.indexOf('href="/tjeneste.css"') < h.indexOf('href="/avmeld.css"'), s.sti);
    assert.doesNotMatch(h, /href="\/styles\.css"/, s.sti);
  }
});

test('tokenbærende sider får aldri skall, site.js, banner eller måling', () => {
  const sider = [...familie('avmeld'), ...familie('bekreft'), ...familie('vervekort'), ...familie('auth')];
  assert.equal(sider.length, 9 + familie('auth').length);
  assert.ok(familie('auth').length > 0);
  for (const s of sider) {
    const h = les(s.fil);
    for (const f of ['/site.js', '/skall.js', 'id="cookie"', 'skall:topp', 'data-hent', 'posthog', 'googletagmanager']) assert.ok(!h.includes(f), `${s.sti}: ${f}`);
  }
});

test('de utrullede tjenestefamiliene har nøklene sine', () => {
  const ute = (sti) => erUtrullet(sti, les(sti.replace(/^\//u, '') + 'index.html'));
  assert.ok(ute('/avmeld/'));
  assert.ok(ute('/bekreft/'));
  assert.ok(ute('/v/'));
  assert.ok(ute('/en/v/'));
});

test('tjeneste.css har delene i rekkefølge', () => {
  const rå = les('tjeneste.css');
  const navn = ['Felles', 'Avmeld', 'Auth og app', 'Kampanje og feil'];
  const pos = navn.map((n) => rå.indexOf(`/* == ${n} == */`));
  assert.ok(pos.every((p) => p > -1), `mangler del: ${pos}`);
  assert.deepEqual([...pos].sort((a, b) => a - b), pos);
});

test('tjeneste.css, avmeld.css og vervekort.css bruker bare tokens eller egne variabler', () => {
  const tokens = utenKommentarer(les('tokens.css'));
  for (const fil of ['tjeneste.css', 'avmeld.css', 'v/vervekort.css', 'tiktok-auth.css', '404.css']) {
    const css = utenKommentarer(les(fil));
    const definert = new Set([...tokens.matchAll(/(--[\w-]+)\s*:/gu), ...css.matchAll(/(--[\w-]+)\s*:/gu)].map((m) => m[1]));
    const brukt = [...css.matchAll(/var\((--[\w-]+)/gu)].map((m) => m[1]);
    assert.ok(brukt.length > 5, `${fil}: bruker nesten ingen tokens`);
    assert.deepEqual(brukt.filter((v) => !definert.has(v)), [], fil);
    assert.deepEqual(css.match(/#[0-9a-fA-F]{3,8}\b/gu) ?? [], [], `${fil}: heksverdier`);
    assert.deepEqual([...css.matchAll(/rgba?\(\s*(?!var\()[^)]*\)/gu)].map((m) => m[0]), [], fil);
    assert.deepEqual([...css.matchAll(/font(?:-size)?:[^;}]*?\d+(?:\.\d+)?px/gu)].map((m) => m[0]), [], `${fil}: tekst i px`);
    assert.doesNotMatch(css, /@font-face/u, fil);
  }
  assert.deepEqual([...utenKommentarer(les('avmeld.css')).matchAll(/(--[\w-]+)\s*:/gu)], [], 'avmeld.css har egne variabler');
});

test('knappen er en svart pille på 44 px med lysere svart ved peker over, og vinner over dagens regler', () => {
  const css = utenKommentarer(les('tjeneste.css'));
  const regel = (velger) => css.split('}').map((r) => r.split('{')).find(([v]) => v?.replace(/\s+/gu, ' ').split(/,(?![^(]*\))/u).some((x) => x.trim() === velger))?.[1] ?? '';
  for (const v of ['body.avmeld-rot .avmeld-knapp', 'body.avmeld-rot #knapp', 'body[data-tjeneste] .avmeld-knapp', 'body[data-tjeneste] #knapp']) {
    const k = regel(v);
    assert.match(k, /background:var\(--blekk\)/u, v);
    assert.match(k, /min-height:44px/u, v);
    assert.match(k, /border-radius:999px/u, v);
    assert.match(regel(`${v}:hover`), /background:var\(--blekk-lys\)/u, v);
  }
  assert.match(regel('body.avmeld-rot .vk-butikker a'), /min-height:44px/u);
});

test('auth og app laster tokens og tjeneste.css, og alle variabler er definert', () => {
  assert.equal(familie('auth').length, 4);
  assert.equal(familie('app').length, 1);
  for (const s of [...familie('auth'), ...familie('app')]) {
    const h = les(s.fil);
    assert.match(h, /href="\/tokens\.css"[\s\S]*href="\/tjeneste\.css"/u, s.sti);
    assert.doesNotMatch(h, /href="\/styles\.css"/u, s.sti);
    assert.ok(h.indexOf('href="/tjeneste.css"') < (h.indexOf('href="/tiktok-auth.css"') === -1 ? Infinity : h.indexOf('href="/tiktok-auth.css"')), `${s.sti}: tjeneste.css før tiktok-auth.css`);
  }
  const auth = utenKommentarer(les('tiktok-auth.css'));
  const definert = new Set([...utenKommentarer(les('tokens.css')).matchAll(/(--[\w-]+)\s*:/gu), ...auth.matchAll(/(--[\w-]+)\s*:/gu)].map((m) => m[1]));
  assert.ok(definert.has('--pad'), '--pad defineres i tiktok-auth.css selv');
  assert.deepEqual([...auth.matchAll(/var\((--[\w-]+)/gu)].map((m) => m[1]).filter((v) => !definert.has(v)), []);
  for (const gammel of ['--ink', '--ink-soft', '--line', '--line-soft', '--sand', '--cream']) assert.doesNotMatch(auth, new RegExp(`var\\(${gammel}\\b`, 'u'), gammel);
});

test('/app/ har ingen egne fargevariabler, ingen mørk modus og ingen sporing', () => {
  const h = les('app/index.html');
  const stil = h.match(/<style>([\s\S]*?)<\/style>/u)[1];
  assert.doesNotMatch(stil, /--cream|--ink|prefers-color-scheme|#[0-9a-fA-F]{3,8}\b|font-family|font-size:\s*[\d.]+px/u);
  assert.deepEqual([...stil.matchAll(/var\((--[\w-]+)/gu)].map((m) => m[1]).filter((v) => !les('tokens.css').includes(`${v}:`)), []);
  for (const f of ['/site.js', '/skall.js', 'id="cookie"', '/locale.js', 'posthog', 'googletagmanager']) assert.ok(!h.includes(f), f);
});

test('kampanjesidene og 404 laster tokens og tjeneste.css', () => {
  assert.equal(familie('kampanje').length, 5);
  assert.equal(familie('feil').length, 1);
  for (const s of [...familie('kampanje'), ...familie('feil')]) {
    const h = les(s.fil);
    assert.match(h, /href="\/tokens\.css"[\s\S]*href="\/tjeneste\.css"/u, s.sti);
    assert.doesNotMatch(h, /href="\/styles\.css"/u, s.sti);
    assert.match(h, /data-tjeneste="(kampanje|feil)"/u, s.sti);
  }
  const f404 = les('404.html');
  assert.ok(f404.indexOf('href="/tjeneste.css"') < f404.indexOf('href="/404.css"'), '404.css må komme etter tjeneste.css');
});

test('kampanjesidene beholder site.js og samtykkebanner, og de innebygde stilene bruker tokens', () => {
  for (const s of familie('kampanje')) {
    const h = les(s.fil);
    assert.match(h, /<script src="\/site\.js"/u, s.sti);
    assert.match(h, /id="cookie"/u, s.sti);
    for (const [, stil] of h.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gu)) {
      assert.doesNotMatch(stil, /var\(--(?:ink|ink-soft|cream|sand|sand-2|line|orange|pad)\b/u, s.sti);
      assert.doesNotMatch(stil, /font-family|#[0-9a-fA-F]{3,8}\b|font-size:\s*[\d.]+px/u, s.sti);
      const definert = new Set([...les('tokens.css').matchAll(/(--[\w-]+)\s*:/gu)].map((m) => m[1]));
      assert.deepEqual([...stil.matchAll(/var\((--[\w-]+)/gu)].map((m) => m[1]).filter((v) => !definert.has(v)), [], s.sti);
    }
  }
});

test('samtykkeknappene på kampanjesidene veier likt', () => {
  const rå = utenKommentarer(les('tjeneste.css'));
  // Reglene er avgrenset med body[data-tjeneste="kampanje"]; effektiv() leser de blanke klassevelgerne.
  const css = rå.replaceAll('body[data-tjeneste="kampanje"] ', '');
  const godta = effektiv(css, 'ck-accept');
  const avvis = effektiv(css, 'ck-reject');
  assert.ok(Object.keys(godta).length > 4, 'fant ingen stil for «Godta»');
  assert.deepEqual(avvis, godta);
  assert.deepEqual(effektiv(css, 'ck-reject', 'hover'), effektiv(css, 'ck-accept', 'hover'));
  assert.deepEqual(effektiv(css, 'ck-reject', 'focus-visible'), effektiv(css, 'ck-accept', 'focus-visible'));
  assert.match(godta.background, /var\(--blekk\)/u);
  assert.equal(rå.includes('body[data-tjeneste="kampanje"] .ck-reject'), true, 'avvisknappen har en regel under kampanje');
  for (const s of familie('kampanje')) {
    const h = les(s.fil);
    assert.match(h, /class="ck-btn ck-accept"/u, s.sti);
    assert.match(h, /class="ck-btn ck-reject"/u, s.sti);
  }
});

test('de kopierte banner- og stegreglene følger kildene i skall.css og side.css', () => {
  const kamp = utenKommentarer(les('tjeneste.css')).replaceAll('body[data-tjeneste="kampanje"] ', '');
  const skall = utenKommentarer(les('skall.css'));
  for (const velger of ['.cookie{', '.cookie[hidden]{', '.ck-btn,.ck-accept,.ck-reject{', '.cookie-actions{', '.cookie p{']) {
    const linje = (css) => css.split('\n').find((l) => l.startsWith(velger));
    assert.ok(linje(skall), `skall.css mangler ${velger}`);
    assert.equal(linje(kamp), linje(skall), velger);
  }
});

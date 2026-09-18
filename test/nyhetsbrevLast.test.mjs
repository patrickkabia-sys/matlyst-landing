import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import test from 'node:test';

const ROT = new URL('..', import.meta.url).pathname;
const index = readFileSync(join(ROT, 'index.html'), 'utf8');
const siteJs = readFileSync(join(ROT, 'site.js'), 'utf8');

function* html(dir) {
  for (const navn of readdirSync(dir)) {
    if (navn === 'node_modules' || navn === '.git' || navn === 'fonts') continue;
    const sti = join(dir, navn);
    if (statSync(sti).isDirectory()) yield* html(sti);
    else if (navn.endsWith('.html')) yield sti;
  }
}

test('ingen side laster nyhetsbrevskjemaet fra markupen', () => {
  const brudd = [...html(ROT)].filter((f) =>
    /<script[^>]+src=["'][^"']*(eocampaign|emailoctopus)/iu.test(readFileSync(f, 'utf8')),
  );
  assert.deepEqual(brudd, [], `laster EmailOctopus ved sidelast: ${brudd.join(', ')}`);
});

test('ingen side har et tredjeparts-skript i markupen i det hele tatt', () => {
  const brudd = [];
  for (const f of [...html(ROT)]) {
    for (const m of readFileSync(f, 'utf8').matchAll(/<script[^>]+src=["']([^"']+)["']/gu)) {
      if (/^https?:/u.test(m[1])) brudd.push(`${f}: ${m[1]}`);
    }
  }
  assert.deepEqual(brudd, [], `eksterne skript i markupen: ${brudd.join(', ')}`);
});

test('forsiden viser et rent HTML-felt i påvente av skjemaet', () => {
  assert.match(index, /id="nyhetsbrev-skjema"/u);
  assert.match(index, /data-eo-form="[0-9a-f-]{36}"/u);
  assert.match(index, /<input[^>]+type="email"/u);
  assert.match(index, /Meld meg på/u);
});

test('site.js laster skjemaet, og først etter en uttrykkelig handling', () => {
  const funksjon = siteJs.match(/function lastNyhetsbrev\s*\([^)]*\)\s*\{[\s\S]*?\n  \}/u)?.[0];
  assert.ok(funksjon, 'fant ikke lastNyhetsbrev() i site.js');
  assert.match(funksjon, /eocampaign1\.com/u, 'lastNyhetsbrev henter ikke skjemaet');

  // Lastinga skal henge på en brukerhandling, ikke på sidelast. Kallene til
  // lastNyhetsbrev skal derfor alle stå inne i en hendelseslytter.
  const kall = [...siteJs.matchAll(/lastNyhetsbrev\(/gu)].map((m) => m.index);
  assert.ok(kall.length >= 2, 'lastNyhetsbrev kalles ikke fra noen handling');
  const lyttere = [...siteJs.matchAll(/addEventListener\(\s*'(focusin|submit|click|pointerdown)'/gu)].map(
    (m) => m.index,
  );
  const definisjon = siteJs.indexOf('function lastNyhetsbrev');
  for (const i of kall) {
    if (i === definisjon + 'function '.length) continue;
    const forrigeLytter = Math.max(...lyttere.filter((l) => l < i), -1);
    assert.notEqual(forrigeLytter, -1, `kall til lastNyhetsbrev uten en handling foran seg (posisjon ${i})`);
  }
});

test('brukeren får beskjed hvis skjemaet ikke lar seg laste', () => {
  const funksjon = siteJs.match(/function lastNyhetsbrev\s*\([^)]*\)\s*\{[\s\S]*?\n  \}/u)[0];
  assert.match(funksjon, /onerror|'error'/u, 'ingen feilhåndtering på skriptlastinga');
  assert.match(siteJs, /function visNyhetsbrevFeil/u, 'ingen funksjon som viser feilen');
  assert.match(index, /id="nyhetsbrev-feil"/u, 'ingen feilmelding i markupen');
  assert.match(index, /role="alert"/u, 'feilmeldingen varsles ikke til skjermlesere');
});

test('feilmeldingen er på norsk og uten tankestrek som skilletegn', () => {
  const feil = index.match(/<p[^>]*id="nyhetsbrev-feil"[\s\S]*?<\/p>/u)?.[0];
  assert.ok(feil, 'fant ikke feilmeldingen');
  assert.doesNotMatch(feil, /[–—]/u);
  assert.match(feil, /Prøv/u);
});

test('personvernerklæringen sier at skjemaet først lastes når du bruker det', () => {
  const personvern = readFileSync(join(ROT, 'personvern.html'), 'utf8');
  assert.match(personvern, /først når du tar i e-postfeltet/u);
  assert.match(personvern, /reCAPTCHA/u);
});

test('lenka i feilmeldingen holder AA mot flata den står på', () => {
  // Terrakotta pa sand gir 3,75:1 og faller under AA for vanlig tekst.
  // Feilmeldinga bruker derfor tekstfargen, med understrek som markor.
  const css = readFileSync(join(ROT, 'styles.css'), 'utf8');
  const regel = css.match(/\.nl-feil a\{([^}]*)\}/u)?.[1];
  assert.ok(regel, 'fant ingen regel for lenka i feilmeldingen');
  assert.match(regel, /color:var\(--ink\)/u);
  assert.match(regel, /text-decoration:underline/u);
});

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import test from 'node:test';
import { farge, forhold } from './hjelp/kontrast.mjs';

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

// ⚠️ Forgjengeren til denne testen krevde bare at det stod en hendelseslytter
// TIDLIGERE i fila enn kallet. site.js har lyttere langt oppe i
// samtykkekoden, sa et ubetinget lastNyhetsbrev() pa toppniva, altsa lasting
// ved sidelast, passerte gront. Na klippes lytterens funksjonskropp ut med
// klammetelling, og kallet ma sta INNI den.
function funksjonskropp(kilde, fra) {
  const start = kilde.indexOf('{', fra);
  let dybde = 0;
  for (let i = start; i < kilde.length; i++) {
    if (kilde[i] === '{') dybde++;
    else if (kilde[i] === '}' && --dybde === 0) return [start, i];
  }
  throw new Error('fant ikke slutten pa funksjonskroppen');
}

function lytterkropper() {
  const kropper = [];
  for (const m of siteJs.matchAll(
    /addEventListener\(\s*'(focusin|submit|click|pointerdown|keydown)'\s*,\s*function\s*\([^)]*\)\s*\{/gu,
  )) {
    kropper.push(funksjonskropp(siteJs, m.index));
  }
  return kropper;
}

test('site.js laster skjemaet, og først etter en uttrykkelig handling', () => {
  const definisjon = siteJs.indexOf('function lastNyhetsbrev');
  assert.notEqual(definisjon, -1, 'fant ikke lastNyhetsbrev() i site.js');
  const [kroppStart, kroppSlutt] = funksjonskropp(siteJs, definisjon);
  const funksjon = siteJs.slice(kroppStart, kroppSlutt);
  assert.match(funksjon, /eocampaign1\.com/u, 'lastNyhetsbrev henter ikke skjemaet');

  const kropper = lytterkropper();
  assert.ok(kropper.length > 0, 'site.js har ingen hendelseslyttere');

  const kall = [...siteJs.matchAll(/lastNyhetsbrev\(/gu)]
    .map((m) => m.index)
    .filter((i) => i !== definisjon + 'function '.length)
    .filter((i) => i < kroppStart || i > kroppSlutt);

  assert.ok(kall.length >= 1, 'ingenting kaller lastNyhetsbrev');
  for (const i of kall) {
    const inni = kropper.some(([a, b]) => i > a && i < b);
    assert.ok(
      inni,
      `lastNyhetsbrev kalles utenfor enhver hendelseslytter (posisjon ${i}): ` +
        `«${siteJs.slice(Math.max(0, i - 60), i + 20).split('\n').pop()}»`,
    );
  }
});

test('det er feltet brukeren tar i som utløser lastinga', () => {
  const kropper = lytterkropper().filter(([a, b]) =>
    siteJs.slice(a, b).includes('lastNyhetsbrev('),
  );
  assert.ok(kropper.length >= 2, 'bade fokus og innsending skal utlose lastinga');
  const typer = [...siteJs.matchAll(
    /plassholder\.addEventListener\(\s*'(\w+)'/gu,
  )].map((m) => m[1]);
  assert.deepEqual(typer.sort(), ['focusin', 'submit']);
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

test('«Meld meg på»-knappen holder AA, både plassholderen og EmailOctopus sin', () => {
  // Knappen arvet aksentoransje med hvit tekst, 3,21:1. Regelen gjelder begge
  // skjemaene, siden EmailOctopus sitt eget submit-felt treffes av den samme.
  const css = readFileSync(join(ROT, 'styles.css'), 'utf8');
  const regel = css.match(/\.newsletter-eo input\[type=submit\][^{]*\{([^}]*)\}/u)?.[1];
  assert.ok(regel, 'fant ingen regel for påmeldingsknappen');
  const flate = farge(regel.match(/background:([^;]+)/u)[1], css);
  const tekst = farge(regel.match(/color:([^;]+)/u)[1], css);
  const r = forhold(tekst, flate);
  assert.ok(r >= 4.5, `påmeldingsknappen har ${r.toFixed(2)}:1, AA krever 4,5:1`);
});

// Handlingsporten star, men da ma brukeren vite hva handlinga utloser FOR hen
// tar i feltet, ikke etterpa.
test('teksten ved feltet sier hva påmeldingen laster inn', () => {
  const note = index.match(/<p class="nl-note"[^>]*id="nyhetsbrev-vilkar"[\s\S]*?<\/p>/u)?.[0];
  assert.ok(note, 'fant ingen opplysningstekst ved feltet');
  assert.match(note, /EmailOctopus/u);
  assert.match(note, /reCAPTCHA/u);
  assert.doesNotMatch(note, /[–—]/u);
  // Feltet skal peke på teksten, ellers finnes den bare visuelt.
  assert.match(index, /<input[^>]+aria-describedby="nyhetsbrev-vilkar"/u);
  assert.match(siteJs, /setAttribute\('aria-describedby', 'nyhetsbrev-vilkar'\)/u);

  // Opplysninga er pakrevd, sa den skal vaere lesbar. Den sto i --ink-faint,
  // 2,72:1 mot flata.
  const css = readFileSync(join(ROT, 'styles.css'), 'utf8');
  const regel = css.match(/\.nl-note\{([^}]*)\}/u)?.[1];
  const flate = farge(css.match(/\.newsletter\{[^}]*background:([^;}]+)/u)[1], css);
  const tekstfarge = farge(regel.match(/color:([^;]+)/u)[1], css);
  assert.match(
    tekstfarge,
    /^#[0-9A-Fa-f]{3,8}$/u,
    `opplysningsteksten bruker ${tekstfarge}, som ikke kan kontrastmales; bruk en hex-token`,
  );
  const r = forhold(tekstfarge, flate);
  assert.ok(r >= 4.5, `opplysningsteksten har ${r.toFixed(2)}:1, AA krever 4,5:1`);
});

test('reCAPTCHA er navngitt i mottakerlista, ikke bare i nyhetsbrevavsnittet', () => {
  const personvern = readFileSync(join(ROT, 'personvern.html'), 'utf8');
  const lista = personvern.match(/Hvem vi deler med \(databehandlere\)[\s\S]*?<\/ul>/u)?.[0];
  assert.ok(lista, 'fant ikke mottakerlista');
  assert.match(lista, /reCAPTCHA/u, 'reCAPTCHA står ikke i mottakerlista');
  assert.match(personvern, /<h2 id="nettstedet">/u, 'lenka fra forsiden har ingen ankerpunkt');
});

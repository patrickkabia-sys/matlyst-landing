import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import test from 'node:test';
import { kodepunkter } from './hjelp/woff2.mjs';
import { alleSider } from '../scripts/sidetyper.mjs';

const ROT = new URL('..', import.meta.url).pathname;

function* html(dir) {
  for (const navn of readdirSync(dir)) {
    // docs publiseres ikke (se _config.yml, låst av interneFiler.test.mjs). Der ligger
    // prototyper som laster skrifter utenfra, og de når aldri en besøkende.
    if (navn === 'node_modules' || navn === '.git' || navn === 'fonts' || navn === 'docs') continue;
    const sti = join(dir, navn);
    if (statSync(sti).isDirectory()) yield* html(sti);
    else if (navn.endsWith('.html')) yield sti;
  }
}

const css = () => readFileSync(join(ROT, 'styles.css'), 'utf8');
// Stilarkene som deklarerer @font-face for sidene. Nye ark legges til her.
const STILARK = ['styles.css', 'tokens.css'];
const stilark = () => STILARK.map((f) => readFileSync(join(ROT, f), 'utf8')).join('\n');

// Alt vi faktisk skriver pa norsk: store og sma bokstaver, aeoa, tall og den
// tegnsettinga sidene bruker. Dette er egenskapen vakten finnes for.
const NORSK = [
  ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  ...'abcdefghijklmnopqrstuvwxyz',
  ...'æøåÆØÅ',
  ...'0123456789',
  ...' .,!?:;\'«»&%()-',
].map((c) => c.codePointAt(0));

function ansikter() {
  return [...stilark().matchAll(/@font-face\s*\{([^}]*)\}/gu)].map(([, kropp]) => {
    const felt = (navn) => kropp.match(new RegExp(`${navn}:\\s*([^;]+)`, 'u'))?.[1].trim();
    const omrader = (felt('unicode-range') ?? '')
      .split(',')
      .map((d) => d.trim().replace(/^U\+/iu, ''))
      .filter(Boolean)
      .map((d) => {
        const [fra, til] = d.split('-');
        return [parseInt(fra, 16), parseInt(til ?? fra, 16)];
      });
    return {
      familie: felt('font-family')?.replace(/'/gu, ''),
      stil: felt('font-style') ?? 'normal',
      vekt: felt('font-weight') ?? '400',
      fil: felt('src')?.match(/url\(([^)]+)\)/u)?.[1].replace(/['"]/gu, ''),
      omrader,
      kropp,
    };
  });
}

const iOmrade = (cp, omrader) => omrader.some(([a, b]) => cp >= a && cp <= b);
const sti = (url) => join(ROT, url.replace(/^\//u, ''));

test('ingen side laster fonter fra en tredjepart', () => {
  const brudd = [...html(ROT)].filter((f) =>
    /fonts\.(googleapis|gstatic)\.com/.test(readFileSync(f, 'utf8')),
  );
  assert.deepEqual(brudd, [], `laster Google Fonts: ${brudd.join(', ')}`);
});

test('stilarket henter ingen font fra en tredjepart', () => {
  assert.doesNotMatch(stilark(), /fonts\.(googleapis|gstatic)\.com/u);
  assert.doesNotMatch(stilark(), /@import/u);
});

test('stilarket definerer begge fontene lokalt med font-display: swap', () => {
  const a = ansikter();
  assert.ok(a.length >= 6, `fant bare ${a.length} @font-face i styles.css`);
  const familier = new Set(a.map((f) => f.familie));
  assert.ok(familier.has('Fraunces'), 'Fraunces mangler som @font-face');
  assert.ok(familier.has('DM Sans'), 'DM Sans mangler som @font-face');
  for (const f of a) assert.match(f.kropp, /font-display:\s*swap/u, `@font-face uten swap: ${f.fil}`);
});

test('hver fontfil som stilarket peker på finnes i repoet', () => {
  for (const f of ansikter()) {
    assert.ok(f.fil, 'et @font-face mangler src');
    assert.ok(existsSync(sti(f.fil)), `fontfil mangler i repoet: ${f.fil}`);
  }
});

// ⚠️ Denne testen er grunnen til at fila finnes. Forgjengeren sjekket bare at
// fontfila la pa disken, og var gronn mens alle fire Fraunces-filene manglet
// hele basis-latin: de nedlastede filene var latin-ext og vietnamese, feilnavnet.
// Nettleseren avslorer det ikke: document.fonts.check() ser pa unicode-range og
// innlastingsstatus, aldri pa om fonten har et glyf for tegnet.
test('fonten som dekker vanlig tekst kan faktisk tegne norsk', () => {
  const latinske = ansikter().filter((f) => iOmrade(0x41, f.omrader));
  assert.ok(latinske.length >= 3, `bare ${latinske.length} ansikter dekker vanlige bokstaver`);

  for (const f of latinske) {
    const dekket = kodepunkter(sti(f.fil));
    const mangler = NORSK.filter((cp) => !dekket.has(cp)).map((cp) => String.fromCodePoint(cp));
    assert.deepEqual(
      mangler,
      [],
      `${f.familie} ${f.stil} (${f.fil}) mangler glyf for: ${mangler.join('')}`,
    );
  }
});

test('hver familie og stil sidene bruker har et ansikt som tegner norsk', () => {
  const dekker = new Set(
    ansikter()
      .filter((f) => {
        if (!iOmrade(0x41, f.omrader)) return false;
        const d = kodepunkter(sti(f.fil));
        return NORSK.every((cp) => d.has(cp));
      })
      .map((f) => `${f.familie}/${f.stil}`),
  );
  for (const par of ['Fraunces/normal', 'Fraunces/italic', 'DM Sans/normal']) {
    assert.ok(dekker.has(par), `${par} har ingen fil som kan tegne norsk tekst`);
  }
});

test('hver fontfil holder seg innenfor sitt eget unicode-range', () => {
  for (const f of ansikter()) {
    const dekket = [...kodepunkter(sti(f.fil))];
    // Ordmerke-delsettet har med vilje bare noen få bokstaver. Da er kravet at fila
    // dekker hele sitt eget unicode-range, ikke at den har hundre tegn.
    const iRange = f.omrader.reduce((n, [a, b]) => n + (b - a + 1), 0);
    assert.ok(iRange > 0, `${f.fil} har ikke noe unicode-range, da sjekkes ingenting`);
    if (iRange < 100) {
      const utenforSmaa = dekket.filter((cp) => !iOmrade(cp, f.omrader));
      assert.deepEqual(utenforSmaa, [], `${f.fil} har tegn utenfor sitt eget unicode-range`);
      const mangler = f.omrader.flatMap(([a, b]) => Array.from({ length: b - a + 1 }, (_, i) => a + i)).filter((cp) => !dekket.includes(cp));
      assert.deepEqual(mangler, [], `${f.fil} mangler tegn fra sitt eget unicode-range`);
      continue;
    }
    assert.ok(dekket.length >= 100, `${f.fil} har bare ${dekket.length} tegn, er fila tom?`);
    // Subsettene deler noen fa basisglyfer (mellomrom, «A» som grunnform for
    // sammensatte tegn). Mer enn en handfull utenfor betyr at fila horer til et
    // annet subsett enn regelen sier, slik latin-ext og vietnamese gjorde.
    const utenfor = dekket.filter((cp) => !iOmrade(cp, f.omrader));
    assert.ok(
      utenfor.length <= 10,
      `${f.fil} har ${utenfor.length} tegn utenfor sitt unicode-range, feil fil for denne regelen?`,
    );
  }
});

test('lisensen følger fontfilene', () => {
  for (const fil of ['fonts/fraunces-OFL.txt', 'fonts/dm-sans-OFL.txt']) {
    const tekst = readFileSync(join(ROT, fil), 'utf8');
    assert.match(tekst, /SIL Open Font License/u, `${fil} ser ikke ut som en OFL-lisens`);
  }
});

test('alle vektene sidene bruker er dekket av de lokale fontene', () => {
  const a = ansikter();
  function dekker(familie, stil, vekt) {
    return a.some((f) => {
      if (f.familie !== familie || f.stil !== stil) return false;
      const w = f.vekt.trim().split(/\s+/u).map(Number);
      const [min, maks] = w.length === 2 ? w : [w[0], w[0]];
      return vekt >= min && vekt <= maks;
    });
  }
  for (const vekt of [300, 400, 500]) assert.ok(dekker('Fraunces', 'normal', vekt), `Fraunces normal ${vekt} mangler`);
  for (const vekt of [300, 400]) assert.ok(dekker('Fraunces', 'italic', vekt), `Fraunces kursiv ${vekt} mangler`);
  for (const vekt of [300, 400, 500, 600]) assert.ok(dekker('DM Sans', 'normal', vekt), `DM Sans ${vekt} mangler`);
});

function fontFaces(tekst) {
  return [...tekst.matchAll(/@font-face\s*\{[^}]*\}/gu)].map((m) => m[0].replace(/\s+/gu, ''));
}

// Ingen publisert side har eget stilark i markupen lenger: de tre norske juridiske
// sidene var de siste, og lenker nå tokens.css via skallet. @font-face hører
// hjemme i styles.css og tokens.css, så skrifter kan ikke drive fra hverandre.
test('ingen publisert side har @font-face i en <style>-blokk', () => {
  const sider = alleSider(ROT);
  assert.ok(sider.length >= 800, `alleSider ga bare ${sider.length} sider`);
  const brudd = sider.filter((s) => [...readFileSync(join(ROT, s.fil), 'utf8').matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/giu)].some((m) => /@font-face/u.test(m[1]))).map((s) => s.sti);
  assert.deepEqual(brudd, []);
});

test('vakten ser en @font-face i en <style>-blokk', () => {
  const fiks = (h) => [...h.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/giu)].some((m) => /@font-face/u.test(m[1]));
  assert.equal(fiks('<head><style>@font-face{font-family:x}</style></head>'), true);
  assert.equal(fiks('<head><style>a{b:c}</style><p>@font-face</p></head>'), false);
});

test('avmeld.css har ingen @font-face, og hver side som laster avmeld.css, laster tokens.css før den', () => {
  assert.deepEqual(fontFaces(readFileSync(join(ROT, 'avmeld.css'), 'utf8')), []);
  const sider = alleSider(ROT).filter((s) => readFileSync(join(ROT, s.fil), 'utf8').includes('href="/avmeld.css"'));
  assert.equal(sider.length, 9, 'fire avmeldingssider, bekreftelsen og fire vervekort');
  for (const s of sider) {
    const h = readFileSync(join(ROT, s.fil), 'utf8');
    const tokens = h.indexOf('href="/tokens.css"');
    assert.ok(tokens > -1 && tokens < h.indexOf('href="/avmeld.css"'), `${s.sti}: tokens.css må komme før avmeld.css`);
  }
});

test('personvernerklæringen sier ikke lenger at nettstedet henter skriftene fra Google', () => {
  const tekst = readFileSync(join(ROT, 'personvern.html'), 'utf8');
  // Nettstedet selvhoster skriftene, og e-postene fra appen bruker systemfonter (#601).
  const nettstedet = tekst.slice(tekst.indexOf('id="nettstedet"'), tekst.indexOf('<h2', tekst.indexOf('id="nettstedet"') + 1));
  assert.doesNotMatch(nettstedet, /Google Fonts/u);
  assert.match(nettstedet, /Skriftene ligger på vår egen server/u);
  assert.doesNotMatch(tekst, /Google Fonts/u);
});

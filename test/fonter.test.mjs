import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import test from 'node:test';
import { kodepunkter } from './hjelp/woff2.mjs';

const ROT = new URL('..', import.meta.url).pathname;

function* html(dir) {
  for (const navn of readdirSync(dir)) {
    if (navn === 'node_modules' || navn === '.git' || navn === 'fonts') continue;
    const sti = join(dir, navn);
    if (statSync(sti).isDirectory()) yield* html(sti);
    else if (navn.endsWith('.html')) yield sti;
  }
}

const css = () => readFileSync(join(ROT, 'styles.css'), 'utf8');

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
  return [...css().matchAll(/@font-face\s*\{([^}]*)\}/gu)].map(([, kropp]) => {
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
  assert.doesNotMatch(css(), /fonts\.(googleapis|gstatic)\.com/u);
  assert.doesNotMatch(css(), /@import/u);
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

// Fire sider har egne, fullstendige stilark i markupen og lenker ikke
// /styles.css. De trenger derfor sine egne @font-face. Testen sammenligner dem
// mot styles.css i stedet for å gjenta mønsteret, slik at et par som driver fra
// hverandre blir rødt.
const SIDER_MED_EGET_STILARK = ['personvern.html', 'slett-konto.html', 'vilkar.html', 'avmeld/index.html'];

function fontFaces(tekst) {
  return [...tekst.matchAll(/@font-face\s*\{[^}]*\}/gu)].map((m) => m[0].replace(/\s+/gu, ''));
}

test('sidene med eget stilark har nøyaktig de samme @font-face som styles.css', () => {
  const fasit = fontFaces(css());
  assert.ok(fasit.length >= 6, `styles.css har bare ${fasit.length} @font-face`);
  for (const side of SIDER_MED_EGET_STILARK) {
    const tekst = readFileSync(join(ROT, side), 'utf8');
    assert.ok(!/href="\/?styles\.css"/u.test(tekst), `${side} lenker nå styles.css, oppdater lista i testen`);
    assert.deepEqual(fontFaces(tekst), fasit, `${side} har andre @font-face enn styles.css`);
  }
});

test('personvernerklæringen sier ikke lenger at skriftene hentes fra Google', () => {
  const tekst = readFileSync(join(ROT, 'personvern.html'), 'utf8');
  assert.doesNotMatch(tekst, /Google Fonts/u);
  assert.match(tekst, /Skriftene ligger på vår egen server/u);
});

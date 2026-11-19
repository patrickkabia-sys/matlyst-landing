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

// @font-face bor bare i tokens.css. Alle andre ark bruker skriftene derfra.
const STILARK = ['tokens.css'];
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

test('stilarket definerer alle fontene lokalt med font-display: swap', () => {
  const a = ansikter();
  assert.ok(a.length >= 6, `fant bare ${a.length} @font-face i tokens.css`);
  const familier = new Set(a.map((f) => f.familie));
  for (const navn of ['Schibsted Grotesk', 'IBM Plex Mono', 'Fraunces', 'DM Sans', 'Fraunces Ordmerke']) assert.ok(familier.has(navn), `${navn} mangler som @font-face`);
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

// Fontbruken avledes fra stilarkene og sidene, ikke fra en fast liste: står det Fraunces kursiv
// eller DM Sans 300 i et stilark, er det stilarket som rettes, ikke testen.
const BRUKSARK = ['tokens.css', 'skall.css', 'side.css', 'forside.css', 'tjeneste.css', 'avmeld.css', 'tiktok-auth.css', '404.css', 'v/vervekort.css'];
const uten = (t) => t.replace(/\/\*[\s\S]*?\*\//gu, '');
const GENERISKE = new Set(['serif', 'sans-serif', 'monospace', 'system-ui', 'ui-monospace', 'ui-serif', 'ui-sans-serif', 'ui-rounded', 'inherit', 'initial', 'unset', '-apple-system', 'blinkmacsystemfont', 'sfmono-regular']);

function variabler() {
  const t = uten(readFileSync(join(ROT, 'tokens.css'), 'utf8'));
  return Object.fromEntries([...t.matchAll(/(--[\w-]+)\s*:\s*([^;}]+)/gu)].map(([, n, v]) => [n, v.trim()]));
}

function forsteFamilie(verdi, vars) {
  let v = verdi.trim();
  for (let i = 0; i < 5; i++) v = v.replace(/var\((--[\w-]+)\s*(?:,[^)]*)?\)/gu, (_, n) => vars[n] ?? '');
  const f = v.split(',')[0].trim().replace(/^['"]|['"]$/gu, '').trim();
  return f && !GENERISKE.has(f.toLowerCase()) ? f : null;
}

const vektTall = (v) => ({ bold: 700, normal: 400 }[v] ?? Number(v));

// Alle kombinasjoner familie/stil/vekt som en regel faktisk ber om. Vekt og stil regnes bare når regelen setter dem.
// En regel uten egen familie arver: familien slås opp på regelens forelder-velger i samme ark (`.ordmerke em`
// arver `.ordmerke`), ellers regnes den mot hovedfamilien i rammen (--f).
export function bruk(kilde, vars, hvor) {
  const rader = [];
  for (const [, velger, kropp] of uten(kilde).replace(/@font-face\s*\{[^}]*\}/gu, '').matchAll(/([^{}@]+)\{([^{}]*)\}/gu)) {
    if (/^\s*$/u.test(velger)) continue;
    const dekl = (navn) => kropp.match(new RegExp(`(?:^|[;\\s])${navn}\\s*:\\s*([^;]+)`, 'u'))?.[1].trim();
    const kort = kropp.match(/(?:^|[;\s])font\s*:\s*([^;]+)/u)?.[1].trim();
    let familie = dekl('font-family'), vekt = dekl('font-weight'), stil = dekl('font-style');
    if (kort && !/^(inherit|initial|unset|[a-z-]+\(.*\)\s*$)/u.test(kort)) {
      const m = kort.match(/^((?:italic|oblique|normal)\s+)?((?:\d{3}|bold|normal)\s+)?(?:[\d.]+(?:px|rem|em|%|pt)|clamp\([^)]*\)|[a-z-]+)(?:\s*\/\s*[^\s]+)?\s+(.+)$/u);
      if (m) { stil ??= m[1]?.trim(); vekt ??= m[2]?.trim(); familie ??= m[3]; }
    }
    if (!familie && !vekt && !stil) continue;
    if (vekt && (/^(bolder|lighter|inherit|initial|unset)$/u.test(vekt) || !Number.isFinite(vektTall(vekt)))) vekt = undefined;
    rader.push({ velgere: velger.split(',').map((v) => v.trim()), familie: familie ? forsteFamilie(familie, vars) : undefined, eksplisitt: Boolean(familie), vekt, stil });
  }
  const medFamilie = new Map(rader.filter((r) => r.eksplisitt && r.familie).flatMap((r) => r.velgere.map((v) => [v, r.familie])));
  const forelder = (v) => v.replace(/\s*(?:[>+~]\s*|\s)[^\s>+~]+$/u, '');
  const ut = [];
  for (const r of rader) {
    if (r.eksplisitt && !r.familie) continue; // generisk familie, ingen webfont
    for (const v of r.velgere) {
      const fam = r.eksplisitt ? r.familie : (medFamilie.get(forelder(v)) ?? forsteFamilie('var(--f)', vars));
      if (!r.vekt && !r.stil && !r.eksplisitt) continue;
      ut.push({ familie: fam, stil: r.stil === 'oblique' ? 'italic' : r.stil ?? 'normal', vekt: r.vekt ? vektTall(r.vekt) : undefined, hvor: `${hvor} ${v.slice(0, 70)}`, eksplisittFamilie: r.eksplisitt });
    }
  }
  return ut;
}

function alleBruk() {
  const vars = variabler();
  const ut = [];
  for (const f of BRUKSARK) if (existsSync(join(ROT, f))) ut.push(...bruk(readFileSync(join(ROT, f), 'utf8'), vars, f));
  for (const s of alleSider(ROT)) {
    for (const m of readFileSync(join(ROT, s.fil), 'utf8').matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/giu)) ut.push(...bruk(m[1], vars, s.sti));
  }
  return ut;
}

const dekkerVekt = (a, { familie, stil, vekt }) => a.some((f) => {
  if (f.familie !== familie || f.stil !== stil) return false;
  if (vekt === undefined) return true;
  const w = f.vekt.trim().split(/\s+/u).map(Number);
  const [min, maks] = w.length === 2 ? w : [w[0], w[0]];
  return vekt >= min && vekt <= maks;
});

test('vakten leser bruk fra regler, også i kortskrift og via var()', () => {
  const v = variabler();
  assert.deepEqual(bruk('a{font:500 15px/1.55 var(--f)}b{font-family:"DM Sans",sans-serif;font-weight:300}c{font-family:Fraunces;font-style:italic}', v, 't').map((x) => [x.familie, x.stil, x.vekt]),
    [['Schibsted Grotesk', 'normal', 500], ['DM Sans', 'normal', 300], ['Fraunces', 'italic', undefined]]);
  assert.deepEqual(bruk('.m{font-family:\'Fraunces Ordmerke\';font-style:italic}.m em{font-weight:400}', v, 't').map((x) => [x.familie, x.stil, x.vekt]),
    [['Fraunces Ordmerke', 'italic', undefined], ['Fraunces Ordmerke', 'normal', 400]]);
});

test('hver kombinasjon av familie, stil og vekt som stilarkene og sidene ber om er dekket av et @font-face i tokens.css', () => {
  const a = ansikter();
  const bruket = alleBruk();
  assert.ok(bruket.length > 40, `fant bare ${bruket.length} fontbruk, leser vakten noe?`);
  const familier = new Set(a.map((f) => f.familie));
  const mangler = bruket.filter((b) => b.familie && familier.has(b.familie) && !dekkerVekt(a, b));
  assert.deepEqual(mangler.map((b) => `${b.familie} ${b.stil} ${b.vekt}: ${b.hvor}`), []);
  const ukjente = bruket.filter((b) => b.eksplisittFamilie && b.familie && !familier.has(b.familie));
  assert.deepEqual(ukjente.map((b) => `${b.familie}: ${b.hvor}`), [], 'en familie uten @font-face i tokens.css');
});

test('hver familie som bærer tekst har et ansikt som tegner norsk, og ordmerket har bare tegnene matlys', () => {
  const a = ansikter();
  for (const familie of new Set(['Schibsted Grotesk', 'DM Sans', 'Fraunces', ...alleBruk().filter((b) => b.eksplisittFamilie && b.familie && b.familie !== 'Fraunces Ordmerke' && b.familie !== 'IBM Plex Mono').map((b) => b.familie)])) {
    const dekker = a.filter((f) => f.familie === familie && iOmrade(0x41, f.omrader) && NORSK.every((cp) => kodepunkter(sti(f.fil)).has(cp)));
    assert.ok(dekker.length > 0, `${familie} har ingen fil som kan tegne norsk tekst`);
  }
  const ordmerke = a.filter((f) => f.familie === 'Fraunces Ordmerke');
  assert.ok(ordmerke.length > 0);
  const tegn = ordmerke.flatMap((f) => f.omrader.flatMap(([x, y]) => Array.from({ length: y - x + 1 }, (_, i) => String.fromCodePoint(x + i)))).sort().join('');
  assert.equal(tegn, [...'matlys'].sort().join(''));
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

function fontFaces(tekst) {
  return [...tekst.matchAll(/@font-face\s*\{[^}]*\}/gu)].map((m) => m[0].replace(/\s+/gu, ''));
}

// Ingen publisert side har eget stilark i markupen lenger: de tre norske juridiske
// sidene var de siste, og lenker nå tokens.css via skallet. @font-face hører
// hjemme i tokens.css, så skrifter kan ikke drive fra hverandre.
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

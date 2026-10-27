// EmailOctopus fases ut (vedtak 19.10): nettskjemaet på forsida fjernes sammen med
// Google reCAPTCHA, forsida har bare nedlastingsknapper, og nyhetsbrevet er for
// appbrukere og sendes via Resend.
// Erstatter test/nyhetsbrevLast.test.mjs, som voktet det utsatte skjemaet.
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

import { lesSide } from './hjelp/side.mjs';

const ROT = new URL('..', import.meta.url).pathname;
const les = (sti) => readFileSync(join(ROT, sti), 'utf8');
const utenKommentarer = (kilde) => kilde.replace(/\/\*[\s\S]*?\*\//gu, '').replace(/(^|[^:])\/\/.*$/gmu, '$1').replace(/<!--[\s\S]*?-->/gu, '');

function* filer(dir, endelser) {
  for (const navn of readdirSync(dir)) {
    if (['node_modules', '.git', 'fonts', 'images', 'test', 'qa', 'docs'].includes(navn)) continue;
    const sti = join(dir, navn);
    if (statSync(sti).isDirectory()) yield* filer(sti, endelser);
    else if (endelser.some((e) => navn.endsWith(e))) yield sti;
  }
}

const PERSONVERN = {
  nb: 'personvern.html',
  sv: 'sv/integritet/index.html',
  da: 'da/privatliv/index.html',
  en: 'en/privacy/index.html',
};

test('ingen side, intet skript og ingen juridisk tekst nevner EmailOctopus eller reCAPTCHA', () => {
  const brudd = [...filer(ROT, ['.html', '.js', '.css', '.mjs'])]
    .filter((f) => /emailoctopus|eocampaign|recaptcha/iu.test(utenKommentarer(readFileSync(f, 'utf8'))))
    .map((f) => f.slice(ROT.length));
  assert.deepEqual(brudd, []);
  for (const [kode, sti] of Object.entries(PERSONVERN)) {
    assert.doesNotMatch(lesSide(sti), /EmailOctopus|reCAPTCHA/u, `${kode}: ${sti}`);
  }
});

test('ingen side har et tredjeparts-skript i markupen', () => {
  const brudd = [];
  for (const f of filer(ROT, ['.html'])) {
    for (const m of readFileSync(f, 'utf8').matchAll(/<script[^>]+src=["']([^"']+)["']/gu)) {
      if (/^https?:/u.test(m[1])) brudd.push(`${f.slice(ROT.length)}: ${m[1]}`);
    }
  }
  assert.deepEqual(brudd, []);
});

test('forsida har nedlastingsknapper der skjemaet sto, og ingen e-postfelt', () => {
  const index = les('index.html');
  assert.doesNotMatch(index, /<form\b/u);
  assert.doesNotMatch(index, /type="email"/u);
  assert.doesNotMatch(index, /id="nyhetsbrev/u);
  const seksjon = index.match(/<section class="last-ned" id="last-ned">[\s\S]*?<\/section>/u)?.[0];
  assert.ok(seksjon, 'fant ikke nedlastingsseksjonen');
  assert.match(seksjon, /href="https:\/\/apps\.apple\.com\/no\/app\/matlyst\/id6762563515"/u);
  assert.match(seksjon, /href="https:\/\/play\.google\.com\/store\/apps\/details\?id=app\.matlyst"/u);
  // Seksjonen står mellom husstand og personvern, der skjemaet sto.
  const pos = (m) => { const i = index.indexOf(m); assert.ok(i > -1, m); return i; };
  assert.ok(pos('id="husstand"') < pos('id="last-ned"'));
  assert.ok(pos('id="last-ned"') < pos('<section class="manifesto reveal" id="personvern">'));
});

test('site.js og styles.css har ingen rester av skjemaet', () => {
  const site = utenKommentarer(les('site.js'));
  assert.doesNotMatch(site, /lastNyhetsbrev|nyhetsbrev|newsletter/iu);
  const css = les('styles.css');
  assert.doesNotMatch(css, /\.newsletter|\.nl-|emailoctopus/iu);
  assert.match(css, /\.last-ned \.store-badges\{justify-content:center\}/u);
});

test('nyhetsbrevet beskrives som for appbrukere og sendt via Resend, på alle språk', () => {
  const krav = {
    nb: [/Nyhetsbrevet er for brukere av appen/u, /Nyhetsbrevet sendes via Resend/u],
    sv: [/Nyhetsbrevet är för användare av appen/u, /skickas via Resend/u],
    da: [/Nyhedsbrevet er for brugere af appen/u, /sendes via Resend/u],
    en: [/The newsletter is for app users/u, /sent through Resend/u],
  };
  for (const [kode, mønstre] of Object.entries(krav)) {
    const html = lesSide(PERSONVERN[kode]);
    for (const m of mønstre) assert.match(html, m, `${kode}: ${m}`);
  }
});

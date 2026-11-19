import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { forside } from '../scripts/forside.mjs';
import { TEKST } from '../scripts/forside-tekst.mjs';
import { NORSKE_RESTORD } from './hjelp/restord.mjs';

const rot = fileURLToPath(new URL('..', import.meta.url));
const SPRAK = ['sv', 'da', 'en'];
const hodeFasit = JSON.parse(readFileSync(join(rot, 'test/fasit/forside-hode.json'), 'utf8'));
const sider = { sv: 'sv/index.html', da: 'da/index.html', en: 'en/index.html' };

// Alle stier i en tekstgruppe, med lister som [i]. Verdien tas med for tekster.
function stier(verdi, sti = '', ut = new Map()) {
  if (Array.isArray(verdi)) verdi.forEach((x, i) => stier(x, `${sti}[${i}]`, ut));
  else if (verdi && typeof verdi === 'object') for (const [k, x] of Object.entries(verdi)) stier(x, sti ? `${sti}.${k}` : k, ut);
  else ut.set(sti, verdi);
  return ut;
}
const plassholdere = (tekst) => (typeof tekst === 'string' ? [...tekst.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort() : []);
// folg.aria står i de tre private tekstfilene, men nb og generatoren bruker den ikke.
const UBRUKT_EKSTRA = new Set(['folg.aria']);

for (const sprak of SPRAK) {
  test(`${sprak}: samme nøkler og plassholdere som nb, og omvendt`, () => {
    const nb = stier(TEKST.nb), andre = stier(TEKST[sprak]);
    assert.deepEqual([...nb.keys()].filter((s) => !andre.has(s)), [], 'mangler i språket');
    assert.deepEqual([...andre.keys()].filter((s) => !nb.has(s) && !UBRUKT_EKSTRA.has(s)), [], 'ekstra i språket');
    for (const [sti, verdi] of nb) {
      assert.equal(typeof andre.get(sti), typeof verdi, `type: ${sti}`);
      assert.deepEqual(plassholdere(andre.get(sti)), plassholdere(verdi), `plassholdere: ${sti}`);
    }
  });

  test(`${sprak}: ingen tankestrek og ingen norske ord i teksten`, () => {
    for (const [sti, verdi] of stier(TEKST[sprak])) {
      if (typeof verdi !== 'string') continue;
      // En tankestrek mellom to sifre er et tallområde og er lov.
      assert.doesNotMatch(verdi, /(?<!\d)[–—]|[–—](?!\d)/u, `tankestrek: ${sti}`);
      assert.doesNotMatch(verdi.replace(/\{\w+\}/g, ''), NORSKE_RESTORD, `norsk ord: ${sti}`);
      assert.doesNotMatch(verdi, /\b(?:Velg|Trykk|Lagre|Spør|Ferdig|Hvitløk|kyllinggryte)\b/u, `norsk ord: ${sti}`);
    }
  });

  test(`${sprak}: siden har hodet fra før, med hvit theme-color`, () => {
    const f = hodeFasit[sprak], html = forside(sprak);
    const hode = html.slice(html.indexOf('<head>'), html.indexOf('</head>'));
    assert.match(html, new RegExp(`<html lang="${f.lang}">`));
    let pos = -1;
    for (const linje of f.seo) {
      const venter = linje.replace('content="#F7F3EC"', 'content="#FFFFFF"');
      const treff = hode.indexOf(venter, pos + 1);
      assert.ok(treff > pos, `hodelinje mangler eller står i feil rekkefølge: ${venter.slice(0, 90)}`);
      pos = treff;
    }
    assert.ok(hode.includes(f.software), 'SoftwareApplication-skjemaet er endret');
    assert.ok(hode.includes(f.org), 'Organization-skjemaet er endret');
    assert.equal((hode.match(/name="theme-color"/g) || []).length, 1);
  });

  test(`${sprak}: ${sider[sprak]} er nøyaktig det generatoren lager`, () => {
    assert.equal(readFileSync(join(rot, sider[sprak]), 'utf8'), forside(sprak));
  });

  test(`${sprak}: bare språkets egen tekst står i det synlige, og kalenderen starter på mandag`, () => {
    const html = forside(sprak);
    assert.match(html, new RegExp(`<h1>${TEKST[sprak].h1.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/’/g, '(?:’|&#39;)')}</h1>`));
    assert.doesNotMatch(html.replace(/<script[\s\S]*?<\/script>/g, ''), />\s*Oppskrifter du faktisk lager\./);
    // Nov 2026 starter på en søndag: seks tomme ruter før dag 1 når uka starter mandag.
    assert.match(html, /<div class="a-kr(?: valgt)?"><span class=""><\/span>(?:<span class=""><\/span>){5}<span class="">1<\/span>/);
  });
}

test('hvert språk har sin egen film og de samme stegtidene som nb', () => {
  for (const sprak of ['nb', ...SPRAK]) {
    const html = forside(sprak);
    assert.ok(html.includes(`src="/images/forside/film/import-${sprak}.mp4"`), sprak);
    assert.ok(html.includes(`poster="/images/forside/film/import-${sprak}-plakat.webp"`), sprak);
    assert.deepEqual(TEKST[sprak].stegtider, [0, 2.5, 6.0, 9.7, 13.3, 16.5], sprak);
  }
});

test('alle fire språk viser vurderingslinja som på norsk, og en har egne bilder 9 til 12', () => {
  const html = forside('en');
  const linje = { nb: '<b>5,0</b> av 5 i App Store', sv: '<b>5,0</b> av 5 i App Store', da: '<b>5,0</b> ud af 5 i App Store', en: '<b>5.0</b> out of 5 on the App Store' };
  for (const [sprak, tekst] of Object.entries(linje)) assert.ok(forside(sprak).includes(`<span>${tekst}</span>`), sprak);
  for (let n = 1; n <= 12; n++) {
    const fil = String(n).padStart(2, '0');
    const mappe = n >= 9 ? 'folk-en' : 'folk';
    assert.ok(html.includes(`data-n="${n}" src="/images/forside/${mappe}/${fil}.webp"`), `ansikt ${n} peker på ${mappe}`);
    assert.ok(!html.includes(`data-n="${n}" src="/images/forside/${n >= 9 ? 'folk' : 'folk-en'}/${fil}.webp"`), `ansikt ${n} peker ikke på feil mappe`);
  }
  for (const sprak of ['sv', 'da', 'nb']) assert.doesNotMatch(forside(sprak), /folk-en/);
});

test('bildene i folk-en finnes og er 132 x 132 webp', () => {
  for (const n of ['09', '10', '11', '12']) {
    const fil = join(rot, 'images/forside/folk-en', `${n}.webp`);
    assert.ok(existsSync(fil), `${n}.webp mangler`);
    const b = readFileSync(fil);
    assert.equal(b.toString('latin1', 0, 4), 'RIFF');
    assert.equal(b.toString('latin1', 8, 12), 'WEBP');
    // VP8 (lossy): bredde og høyde i 14 bits fra byte 26 og 28.
    assert.equal(b.readUInt16LE(26) & 0x3fff, 132);
    assert.equal(b.readUInt16LE(28) & 0x3fff, 132);
  }
});

test('en bruker amerikanske mål (cups), ikke metriske', () => {
  const alt = JSON.stringify(TEKST.en);
  assert.match(alt, /\bcups?\b/);
  assert.doesNotMatch(alt, /\b\d+\s?(?:dl|ml|msk|kg)\b/);
});

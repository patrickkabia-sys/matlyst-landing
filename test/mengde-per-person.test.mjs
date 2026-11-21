// «Mengde per person» (/mengde-per-person/, bare norsk): adressene er låst, hvert tall har sitat fra en kilde,
// kalkulatoren i site.js regner likt som tabellene (regn.mjs), og sidene på disk har det malen gir.
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { lesData, publiserbare } from '../scripts/familier/felles.mjs';
import { FAMILIER, familieForSti } from '../scripts/familier/register.mjs';
import { avvik, kildetekst } from '../scripts/familier/mengde-per-person/kildekontroll.mjs';
import { PERSONER, START, delTekst, setning, variantDeler } from '../scripts/familier/mengde-per-person/regn.mjs';
import { TEKST } from '../scripts/familier/mengde-per-person/tekst-nb.mjs';

const ROT = fileURLToPath(new URL('..', import.meta.url));
const FAMILIE = FAMILIER.find((f) => f.id === 'mengde-per-person');
const data = lesData(fileURLToPath(FAMILIE.mappe), 'nb');
const rader = publiserbare(data);
const html = (sti) => readFileSync(join(ROT, sti, 'index.html'), 'utf8');
const hoved = (sti) => html(sti).match(/<main[\s\S]*?<\/main>/u)?.[0] ?? '';
const siteJs = readFileSync(join(ROT, 'site.js'), 'utf8');

// Adressene er låst: en endring her er en bevisst adresseendring (og trenger omdirigering når sidene er publisert).
const SLUGS = ['biff', 'fisk', 'grillmat', 'julemat', 'kalkun', 'kjott', 'kjottdeig', 'koldtbord', 'kylling', 'laks', 'lam', 'lutefisk', 'mat-til-selskap', 'pasta', 'pinnekjott', 'poteter', 'reker-og-skalldyr', 'ribbe', 'ris', 'salat', 'spekemat', 'suppe', 'svin'];
const ADRESSER = ['/mengde-per-person/', ...SLUGS.map((s) => `/mengde-per-person/${s}/`)];

test('adresselås: samleside og 23 sider (nb), alle i sitemap.xml og bare der, og de norske adressene står ikke i de andre språkenes sitemap (engelsk har egen test)', () => {
  assert.deepEqual(FAMILIE.markeder, { nb: { rot: 'mengde-per-person/' }, en: { rot: 'how-much-per-person/' } });
  assert.deepEqual(['/mengde-per-person/', ...rader.map((r) => `/mengde-per-person/${r.slug}/`)].sort(), [...ADRESSER].sort());
  const kart = readFileSync(join(ROT, 'sitemap.xml'), 'utf8');
  for (const a of ADRESSER) {
    assert.match(kart, new RegExp(`<loc>https://matlyst-app\\.no${a}</loc>`, 'u'), a);
    assert.equal(familieForSti(a), 'mengde-per-person', a);
    assert.match(html(a.slice(1)), new RegExp(`<link rel="canonical" href="https://matlyst-app\\.no${a}">`, 'u'), a);
  }
  // Bare <loc>: engelsk sitemap har de norske adressene som hreflang-alternativ, men ingen av dem som egen side.
  for (const mk of ['sv', 'da', 'en']) assert.doesNotMatch(readFileSync(join(ROT, `sitemap-${mk}.xml`), 'utf8'), /<loc>[^<]*mengde-per-person/u, mk);
});

test('samlesiden står i llms.txt, enkeltsidene gjør det ikke', () => {
  const llms = readFileSync(join(ROT, 'llms.txt'), 'utf8');
  assert.match(llms, /\]\(https:\/\/matlyst-app\.no\/mengde-per-person\/\)/u);
  assert.doesNotMatch(llms, /matlyst-app\.no\/mengde-per-person\/[a-z]/u);
});

test('hver rad har tekst og omvendt, og hvert tall har sitat og kilde med lenke og år', () => {
  assert.deepEqual(Object.keys(TEKST).sort(), rader.map((r) => r.id).sort());
  for (const r of rader) {
    assert.equal(r.tall.barn.verdi, 0.5, `${r.id}: barn teller en halv porsjon`);
    for (const [felt, t] of Object.entries(r.tall)) {
      assert.ok(t.merknad && t.merknad.length > 5, `${r.id}/${felt}: sitat mangler`);
      const k = data.kilder[t.kilde];
      assert.match(k.adresse, /^https:\/\//u);
      assert.ok(k.aar >= 2014 && k.aar <= 2026, `${t.kilde}: år`);
    }
  }
});

test('kildekontrollen blir rød når et sitat ikke står hos kilden, og grønn når alle gjør det', () => {
  const tekster = {};
  for (const r of data.rader) {
    for (const t of Object.values(r.tall)) tekster[t.kilde] = `${tekster[t.kilde] ?? ''} ${t.merknad}`;
    for (const [n, s] of Object.entries(r.tekst ?? {})) if (n.startsWith('sitat:')) tekster[n.split(':')[1]] = `${tekster[n.split(':')[1]] ?? ''} ${s}`;
  }
  assert.deepEqual(avvik(data, tekster), []);
  const endret = structuredClone(tekster);
  endret['mp-porsjon'] = endret['mp-porsjon'].replaceAll('Ris, bulgur, couscous, perlegryn og quinoa | 1 dl (ca 60 g)', 'Ris | 1 dl (ca 70 g)');
  const feil = avvik(data, endret);
  assert.ok(feil.some((f) => f.id === 'ris' && f.felt === 'pp-g'), JSON.stringify(feil));
  assert.deepEqual(avvik(data, {}).length > 0, true, 'uten kildetekst er alt avvik');
  assert.equal(kildetekst('<table><tr><td>Ribbe</td><td>300 g</td></tr></table>').includes('Ribbe | 300 g'), true);
});

test('tallene på sidene er kildens tall: sentrale tall står i data og på siden', () => {
  const nb = (id, felt) => data.rader.find((r) => r.id === id).tall[felt].verdi;
  assert.equal(nb('ris', 'pp-g'), 60);
  assert.equal(nb('ribbe', 'pp'), 300);
  assert.equal(nb('pinnekjott', 'toer'), 400);
  assert.equal(nb('kalkun', 'hel'), 500);
  assert.match(hoved('mengde-per-person/ribbe'), /Til 6 voksne blir det 1,8 kg\./u);
  assert.match(hoved('mengde-per-person/ris'), /<td>600 g<br>1 liter<\/td>/u);
});

// Regnereglene i site.js (blokken mellom porsjon:start og porsjon:slutt) er en kopi av regn.mjs. Her kjøres kopien mot originalen.
function siteRegler(kilde = siteJs) {
  const a = kilde.indexOf('// porsjon:start');
  const b = kilde.indexOf('// porsjon:slutt');
  assert.ok(a > -1 && b > a, 'markørene porsjon:start og porsjon:slutt må finnes i site.js');
  return new Function(`${kilde.slice(a, b)}\nreturn { delTekst, deler, setningTekst };`)();
}
const TEKSTER = { voksen: 'voksen', voksne: 'voksne', barn: 'barn', og: 'og', trenger: 'trenger', eller: 'eller', til: 'til' };

test('kalkulatoren i site.js regner likt som regn.mjs for alle varianter, mange antall og barn', () => {
  const js = siteRegler();
  let antall = 0;
  for (const r of rader) {
    const varianter = TEKST[r.id].varianter.map((v) => ({ navn: v.navn, deler: v.deler.map((d) => { const [a, b] = Array.isArray(d) ? d : [d, d]; return { min: r.tall[a].verdi, maks: r.tall[b].verdi, enhet: r.tall[a].enhet }; }) }));
    for (const v of varianter) {
      const vd = { n: v.navn, d: v.deler.map((d) => [d.min, d.maks, d.enhet]) };
      for (const voksne of [0, 1, 2, 3, 4, 7, 10, 12, 25, 100, 999]) {
        for (const barn of [0, 1, 2, 5, 13]) {
          assert.deepEqual(js.deler(vd, voksne, barn, 0.5, 'til'), variantDeler(v, voksne, barn, 0.5, 'til'), `${r.id}/${v.navn} ${voksne}+${barn}`);
          assert.equal(js.setningTekst(vd, voksne, barn, 0.5, TEKSTER), setning(v, voksne, barn, 0.5, TEKSTER), `${r.id}/${v.navn} ${voksne}+${barn}`);
          antall += 1;
        }
      }
    }
  }
  assert.ok(antall > 3000, `kontrollerte ${antall}`);
});

test('kalkulatorvakten kan bli rød: en kopi med annen grense for kg gir andre svar', () => {
  const ødelagt = siteJs.replace("g: { stor: 'kg', faktor: 1000,", "g: { stor: 'kg', faktor: 2000,");
  assert.notEqual(ødelagt, siteJs);
  const js = siteRegler(ødelagt);
  assert.notEqual(js.delTekst(1200, 1200, 'g', 'til'), delTekst(1200, 1200, 'g', 'til'));
  assert.equal(siteRegler(siteJs).delTekst(1200, 1200, 'g', 'til'), '1,2 kg');
});

test('tallskrivemåten: g og kg, dl og liter, intervaller', () => {
  assert.equal(delTekst(240, 240, 'g'), '240 g');
  assert.equal(delTekst(1000, 1000, 'g'), '1 kg');
  assert.equal(delTekst(999.6, 999.6, 'g'), '1 kg');
  assert.equal(delTekst(1875, 1875, 'g'), '1,88 kg');
  assert.equal(delTekst(0.75, 0.75, 'dl'), '0,75 dl');
  assert.equal(delTekst(9.9, 9.9, 'dl'), '9,9 dl');
  assert.equal(delTekst(10, 10, 'dl'), '1 liter');
  assert.equal(delTekst(48, 72, 'dl'), '4,8 til 7,2 liter');
  assert.equal(delTekst(800, 1200, 'g'), '800 g til 1,2 kg');
  assert.equal(delTekst(600, 800, 'g'), '600 til 800 g');
  assert.deepEqual(PERSONER, [2, 4, 6, 8, 10, 12]);
  assert.deepEqual(START, { voksne: 4, barn: 0 });
});

test('hver side har kalkulator med riktig startsvar, tabell med seks kolonner, kilder og lenker som finnes', () => {
  for (const a of ADRESSER) {
    const side = hoved(a.slice(1));
    assert.match(side, /<form class="kalk" data-kalk="porsjon"/u, a);
    const json = JSON.parse(side.match(/<script type="application\/json" class="kalk-data">([\s\S]*?)<\/script>/u)[1]);
    assert.equal(json.b, 0.5, a);
    assert.deepEqual(json.s, [...PERSONER], a);
    const v0 = { navn: json.v[0].n, deler: json.v[0].d.map(([min, maks, enhet]) => ({ min, maks, enhet })) };
    const start = variantDeler(v0, START.voksne, START.barn, json.b, 'til');
    assert.ok(side.includes(`>${start[0]}</output>`), `${a}: startsvaret ${start[0]}`);
    assert.ok(side.includes(setning(v0, START.voksne, START.barn, json.b, TEKSTER).replace(/&/gu, '&amp;')), `${a}: setningen`);
    // Kolonnene 2, 4, 6, 8, 10 og 12 står i tabellen.
    if (a !== '/mengde-per-person/') assert.match(side, /<th scope="col">Antall voksne<\/th><th scope="col">2<\/th><th scope="col">4<\/th><th scope="col">6<\/th><th scope="col">8<\/th><th scope="col">10<\/th><th scope="col">12<\/th>/u, a);
    assert.match(side, /<ol class="kilder" id="kilder"><li>/u, a);
    assert.match(side, /href="https:\/\/www\.(?:matprat|helsedirektoratet)\.no\//u, a);
    for (const [, href] of side.matchAll(/href="(\/mengde-per-person\/[^"]*)"/gu)) assert.ok(ADRESSER.includes(href), `${a}: lenken ${href} finnes ikke`);
    if (a !== '/mengde-per-person/') assert.match(side, /href="\/mengde-per-person\/">Alle mengder per person</u, `${a}: lenke til samlesiden`);
  }
});

test('samlesiden lenker til alle sidene, og siden lenkes fra dl til gram og ukemeny', () => {
  const nav = hoved('mengde-per-person');
  for (const s of SLUGS) assert.match(nav, new RegExp(`<a href="/mengde-per-person/${s}/">`, 'u'), s);
  assert.match(html('verktoy/dl-til-gram'), /href="\/mengde-per-person\/"/u);
  assert.match(html('ukemeny'), /href="\/mengde-per-person\/"/u);
});

test('ingen tankestrek og ingen emoji i sidene', () => {
  for (const a of ADRESSER) {
    const tekst = hoved(a.slice(1)).replace(/<script[\s\S]*?<\/script>/gu, '');
    assert.doesNotMatch(tekst, /[—–]/u, a);
    assert.doesNotMatch(tekst, /\p{Extended_Pictographic}/u, a);
  }
});

test('forfatterlinje står på alle sidene i familien', () => {
  for (const a of ADRESSER) assert.match(hoved(a.slice(1)), /Av <a href="\/om\/">Patrick Kabia<\/a>, kjøletekniker/u, a);
});

test('datafila er den som ligger i mappa, og sidene finnes på disk', () => {
  assert.ok(existsSync(join(ROT, 'mengde-per-person', 'index.html')));
  assert.equal(rader.length, 23);
});

// Airfryer (/airfryer/, norsk; det engelske markedet /en/air-fryer/ har egen test i airfryer-en.test.mjs): adressene er låst, hvert tall har kilde og sitat, to kilder som spriker står side om side,
// kjøtt og fisk sier at kjernetemperaturen avgjør, og omregneren regner etter Arlas tabell (og er rød når tabellen ikke følger regelen).
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import { fileURLToPath } from 'node:url';
import { lesData, publiserbare } from '../scripts/familier/felles.mjs';
import { FAMILIER, familieForSti } from '../scripts/familier/register.mjs';
import { avvik, kildetekst, norm } from '../scripts/familier/airfryer/kildekontroll.mjs';
import { hjelpere } from '../scripts/familier/airfryer/mal-nb.mjs';
import { kontrollerRegel } from '../scripts/familier/airfryer/tekst-nb.mjs';

const ROT = fileURLToPath(new URL('..', import.meta.url));
const FAMILIE = FAMILIER.find((f) => f.id === 'airfryer');
const data = lesData(fileURLToPath(FAMILIE.mappe), 'nb');
const rader = publiserbare(data);
const html = (sti) => readFileSync(join(ROT, sti, 'index.html'), 'utf8');
const hoved = (sti) => html(sti).match(/<main[\s\S]*?<\/main>/u)?.[0] ?? '';
const tekst = (sti) => hoved(sti).replace(/<script[\s\S]*?<\/script>/gu, ' ').replace(/<[^>]+>/gu, ' ').replace(/&amp;/gu, '&').replace(/\s+/gu, ' ');

// Adressene er låst: en endring her er en bevisst adresseendring (og trenger omdirigering når sidene er publisert).
const SLUGS = ['ovn-til-airfryer', 'kyllingfilet', 'kyllinglar', 'kyllingvinger', 'laks', 'torsk', 'pommes-frites', 'potetbater', 'bacon', 'polser', 'hamburger', 'kjottboller', 'gronnsaker', 'svinekoteletter', 'frossen-mat', 'fiskepinner', 'egg', 'biff', 'ribbe'];
const ADRESSER = ['/airfryer/', ...SLUGS.map((s) => `/airfryer/${s}/`)];
// Radene der kilden oppgir en kjernetemperatur, og tallet som skal stå på siden.
const MED_KJERNE = { kyllingfilet: 'kjerne', kyllinglar: 'kjerne', kyllingvinger: 'kjerne', laks: 'kjerne', torsk: 'kjerne', hamburger: 'kjerne', kjottboller: 'kjerne', svinekoteletter: 'kjerne', ribbe: 'kjerne', biff: 'kjerne-gjennom', polser: 'mt-kjerne' };

// Radene som også finnes på engelsk (samme rad-id) og derfor har hreflang en. Resten av de norske sidene står alene.
const MED_EN = new Set(['ovn-til-airfryer', 'kyllingfilet', 'kyllinglar', 'kyllingvinger', 'laks', 'pommes-frites', 'bacon', 'polser', 'hamburger', 'gronnsaker', 'svinekoteletter', 'frossen-mat', 'egg', 'biff']);

// Radene som også finnes på dansk (samme rad-id) og derfor har hreflang da.
const MED_DA = new Set(['ovn-til-airfryer', 'kyllingfilet', 'kyllinglar', 'laks', 'pommes-frites', 'bacon', 'kjottboller', 'egg']);

test('adresselås: familien gir nøyaktig de tjue adressene, og alle står i sitemap.xml med canonical og hreflang bare mot en der raden finnes på engelsk', () => {
  assert.deepEqual(FAMILIE.markeder.nb, { rot: 'airfryer/' });
  assert.deepEqual(['/airfryer/', ...rader.map((r) => `/airfryer/${r.slug}/`)], ADRESSER);
  const kart = readFileSync(join(ROT, 'sitemap.xml'), 'utf8');
  for (const a of ADRESSER) {
    assert.match(kart, new RegExp(`<loc>https://matlyst-app\\.no${a}</loc>`, 'u'), a);
    assert.equal(familieForSti(a), 'airfryer', a);
    assert.match(html(a.slice(1)), new RegExp(`<link rel="canonical" href="https://matlyst-app\\.no${a}">`, 'u'), a);
    assert.doesNotMatch(html(a.slice(1)), /hreflang="sv/u, `${a}: ingen svensk side`);
    const id = a === '/airfryer/' ? 'nav' : rader.find((r) => `/airfryer/${r.slug}/` === a).id;
    const harEn = id === 'nav' || MED_EN.has(id);
    assert.equal(/hreflang="en"/u.test(html(a.slice(1))), harEn, `${a}: hreflang en bare der raden finnes på engelsk`);
    assert.equal(/hreflang="da-DK"/u.test(html(a.slice(1))), id === 'nav' || MED_DA.has(id), `${a}: hreflang da bare der raden finnes på dansk`);
  }
  for (const mk of ['sv', 'da']) assert.doesNotMatch(readFileSync(join(ROT, `sitemap-${mk}.xml`), 'utf8'), /<loc>https:\/\/matlyst-app\.no\/airfryer\//u, mk);
  // Det engelske sitemapet har de norske sidene bare som hreflang-alternativer, aldri som egne adresser (<loc>).
  assert.doesNotMatch(readFileSync(join(ROT, 'sitemap-en.xml'), 'utf8'), /<loc>[^<]*\/airfryer\//u);
});

test('samlesiden står i llms.txt, enkeltsidene gjør det ikke', () => {
  const llms = readFileSync(join(ROT, 'llms.txt'), 'utf8');
  assert.match(llms, /\]\(https:\/\/matlyst-app\.no\/airfryer\/\)/u);
  assert.doesNotMatch(llms, /matlyst-app\.no\/airfryer\/[a-z]/u);
});

test('hvert tall har sitat fra kilden, og kilden har adresse, år og dato (kilde med lenke og årstall)', () => {
  assert.ok(rader.length === SLUGS.length, 'alle radene er kontrollert');
  let antall = 0;
  for (const r of rader) {
    for (const [felt, t] of Object.entries(r.tall)) {
      antall += 1;
      assert.ok(t.merknad && t.merknad.length >= 8, `${r.id}/${felt}: sitat mangler`);
      assert.ok(data.kilder[t.kilde], `${r.id}/${felt}: ukjent kilde`);
    }
    for (const [nokkel, sitat] of Object.entries(r.tekst ?? {})) {
      assert.ok(data.kilder[nokkel.split(':')[0]], `${r.id}/${nokkel}: ukjent kilde`);
      assert.ok(sitat.length >= 8, `${r.id}/${nokkel}: sitat mangler`);
    }
  }
  assert.ok(antall > 250, `bare ${antall} tall`);
  for (const [id, k] of Object.entries(data.kilder)) {
    assert.match(k.adresse, /^https:\/\//u, id);
    assert.ok(k.aar >= 2010 && k.aar <= 2026, `${id}: år ${k.aar}`);
    assert.match(k.hentet, /^2026-\d\d-\d\d$/u, id);
  }
});

test('hver side har kildelista med alle kildene tallene kommer fra, og sier at tidene er veiledende', () => {
  for (const r of rader) {
    const side = hoved(`airfryer/${r.slug}`);
    const brukt = new Set([...Object.values(r.tall).map((t) => t.kilde), ...Object.keys(r.tekst ?? {}).map((n) => n.split(':')[0])]);
    const kilder = side.match(/<ol class="kilder" id="kilder">([\s\S]*?)<\/ol>/u)?.[1] ?? '';
    for (const id of brukt) {
      const k = data.kilder[id];
      assert.ok(kilder.includes(`href="${k.adresse}"`), `${r.id}: kilden ${id} mangler i kildelista`);
      assert.ok(kilder.includes(`(${k.aar})`), `${r.id}: år for ${id}`);
    }
    assert.match(tekst(`airfryer/${r.slug}`), /veiledende/u, `${r.id}: «veiledende» står ikke på siden`);
  }
  assert.match(tekst('airfryer'), /veiledende/u);
});

test('hver kilde en side nevner ved navn, står i kildelista med lenke og år', () => {
  const navn = { MatPrat: 'MatPrat (Opplysningskontoret for egg og kjøtt)', Philips: 'Philips', Gilde: 'Gilde', Findus: 'Findus', Lerøy: 'Lerøy', 'Godt.no': 'Godt.no', 'Fredriksstad Blad': 'Fredriksstad Blad', Arla: 'Arla' };
  for (const a of ADRESSER) {
    const side = hoved(a.slice(1));
    const liste = side.match(/<ol class="kilder" id="kilder">([\s\S]*?)<\/ol>/u)[1];
    const lesetekst = side.slice(0, side.indexOf('<h2 id="kilder">')).replace(/<script[\s\S]*?<\/script>/gu, ' ').replace(/<[^>]+>/gu, ' ');
    for (const [kort, utgiver] of Object.entries(navn)) {
      if (!new RegExp(`(?:^|[^\\p{L}])${kort.replace('.', '\\.')}(?![\\p{L}])`, 'u').test(lesetekst)) continue;
      assert.ok(liste.includes(`${utgiver}: <a href="https://`), `${a}: ${kort} er nevnt, men står ikke i kildelista`);
    }
  }
});

test('to kilder som spriker står side om side i samme tabell, hver med kildenavn', () => {
  const kf = hoved('airfryer/kyllingfilet');
  const tab = kf.match(/<table class="sprik">[\s\S]*?<\/table>/u)[0];
  assert.match(tab, /MatPrat \(2022\)<\/th><td>200 °C<\/td><td>6 minutter på hver side/u);
  assert.match(tab, /Philips \(2021\)<\/th><td>180 °C<\/td><td>20 til 25 minutter/u);
  const bacon = hoved('airfryer/bacon').match(/<table class="sprik">[\s\S]*?<\/table>/u)[0];
  assert.match(bacon, /MatPrat \(2022\)[\s\S]*5 minutter[\s\S]*Fredriksstad Blad \(2026\)[\s\S]*7 til 10 minutter/u);
  const forvarming = hoved('airfryer').match(/<h2 id="forvarming-kildene-er-uenige">[\s\S]*?<\/table>/u)[0];
  assert.match(forvarming, /Philips[\s\S]*Du trenger ikke å forvarme apparatet[\s\S]*Findus[\s\S]*Forvarm airfryeren til 200 °C/u);
});

test('kjøtt og fisk sier at kjernetemperaturen avgjør, med tallet fra kilden', () => {
  for (const [id, felt] of Object.entries(MED_KJERNE)) {
    const r = rader.find((x) => x.id === id);
    const side = tekst(`airfryer/${id}`);
    assert.match(side, /kjernetemperaturen som avgjør/u, id);
    assert.ok(side.includes(`${r.tall[felt].verdi} °C`), `${id}: kjernetemperaturen ${r.tall[felt].verdi} °C står ikke på siden`);
  }
  // Mattilsynet står først (og med minimum 75 grader) der de omtaler maten; MatPrat etterpå, og begge side om side der de er uenige (hamburger).
  for (const id of ['kyllingfilet', 'kyllinglar', 'kyllingvinger', 'polser', 'hamburger', 'kjottboller']) {
    const side = tekst(`airfryer/${id}`);
    const kjerne = side.slice(side.indexOf('Kjernetemperatur: det avgjør'));
    assert.match(kjerne, /Mattilsynet \(2023\)[\s\S]*minimum 75 °C/u, `${id}: Mattilsynets 75 °C står ikke i kjernetemperaturdelen`);
  }
  const burger = tekst('airfryer/hamburger');
  assert.match(burger, /Mattilsynet \(2023\)\s+minimum 75 °C[\s\S]*MatPrat \(2023\)\s+70 °C/u, 'hamburger: begge kildene står i tabellen, Mattilsynet først');
  // Bacon har ingen kilde for kjernetemperatur, og siden sier det i stedet for å gjette.
  assert.match(tekst('airfryer/bacon'), /ikke funnet en kilde med kjernetemperatur/u);
  assert.match(tekst('airfryer'), /kjernetemperaturen som avgjør om maten er ferdig/u);
});

test('tall uten kilde holdes ute: karbonader og torskefilet har ingen tid, siden sier hvorfor', () => {
  assert.match(tekst('airfryer/hamburger'), /ikke funnet en kilde med tid for karbonader/u);
  assert.match(tekst('airfryer/torsk'), /ikke funnet en kilde for ren torskefilet/u);
});

test('forfatterlinje, ingen tankestrek og ingen emoji på sidene', () => {
  for (const a of ADRESSER) {
    const side = html(a.slice(1));
    assert.equal([...side.matchAll(/Av <a href="\/om\/">Patrick Kabia<\/a>, kjøletekniker/gu)].length, 1, a);
    assert.doesNotMatch(tekst(a.slice(1)), /[—–]/u, `${a}: tankestrek`);
    assert.doesNotMatch(tekst(a.slice(1)), /\p{Extended_Pictographic}/u, `${a}: emoji`);
  }
});

test('hvert sitat står i kildeteksten: avvik() er rød når sitatet endres eller mangler', () => {
  const kilde = kildetekst('<p>Stek på <b>180 °C</b> , i 10 minutter.</p><table><tr><td>Laksefilet</td><td>10 min på 180 °C</td></tr></table>');
  assert.ok(norm(kilde).includes('Laksefilet | 10 min på 180 °C'));
  const prøve = { rader: [{ id: 'x', tall: { a: { verdi: 180, enhet: '°C', kilde: 'k', merknad: 'Stek på 180 °C, i 10 minutter.' }, b: { verdi: 10, enhet: 'min', kilde: 'k', merknad: 'Laksefilet | 10 min på 180 °C' } }, tekst: { 'k: tema': 'i 10 minutter' } }] };
  assert.deepEqual(avvik(prøve, { k: [norm(kilde)] }), []);
  prøve.rader[0].tall.b.merknad = 'Laksefilet | 10 min på 200 °C';
  prøve.rader[0].tekst['k: tema'] = 'i 12 minutter';
  assert.deepEqual(avvik(prøve, { k: [norm(kilde)] }).map((a) => a.felt), ['b', 'k: tema']);
  assert.deepEqual(avvik(prøve, {}).length, 3, 'en kilde uten tekst gir avvik på alt');
});

test('malen kaster når et tall ikke står i datafila (prosaen kan ikke skrive et tall uten kilde)', () => {
  const h = hjelpere(rader.find((r) => r.id === 'laks'), data);
  assert.match(h.t('mp-temp'), /^180 °C$/u);
  assert.throws(() => h.t('finnes-ikke'), /finnes ikke i datafila/u);
  assert.throws(() => h.k('finnes-ikke'), /finnes ikke i datafila/u);
});

test('omregningsregelen kontrolleres mot datafila: en tabell der tiden ikke er en femtedel kortere stopper bygget', () => {
  const ovn = rader.find((r) => r.id === 'ovn-til-airfryer');
  kontrollerRegel(hjelpere(ovn, data));
  const feil = structuredClone(ovn);
  feil.tall['arla-175-af-tid'].verdi = 17;
  assert.throws(() => kontrollerRegel(hjelpere(feil, data)), /ikke en femtedel kortere/u);
  const varmere = structuredClone(ovn);
  varmere.tall['arla-190-af'].verdi = 195;
  assert.throws(() => kontrollerRegel(hjelpere(varmere, data)), /ikke lavere/u);
});

// Kjører skriptet mot et minimalt DOM-uttrekk: to felt og en svarlinje.
function kjorOmregner(temp, tid) {
  const kode = readFileSync(join(ROT, 'airfryer-omregner.js'), 'utf8');
  const skjemaData = html('airfryer/ovn-til-airfryer').match(/<script type="application\/json" data-oaf-data>([\s\S]*?)<\/script>/u)[1];
  const lyttere = {};
  const felt = (verdi) => ({ value: verdi, addEventListener: (n, f) => { lyttere[`${verdi}${n}`] = f; (felt.alle ??= []).push(f); } });
  const f1 = felt(String(temp)); const f2 = felt(String(tid));
  const svar = { textContent: '', children: [], replaceChildren(...d) { this.children = d; this.textContent = d.map((x) => x.textContent).join(''); } };
  const nye = [];
  const dok = {
    querySelectorAll: () => [{ querySelector: (v) => (v.includes('data-oaf-data') ? { textContent: skjemaData } : v.includes('"temp"') ? f1 : v.includes('"tid"') ? f2 : v.includes('"svar"') ? svar : null) }],
    createTextNode: (t) => ({ textContent: t }),
    createElement: () => { const e = { textContent: '' }; nye.push(e); return e; },
  };
  felt.alle = [];
  runInNewContext(kode, { document: dok });
  felt.alle[0]();
  return { svar: svar.textContent, fet: nye.map((e) => e.textContent) };
}

test('omregneren: rader i Arlas tabell gir raden, mellom radene regnes lineært, og utenfor tabellen kommer en melding', () => {
  assert.deepEqual(kjorOmregner(175, 20).fet, ['165 °C', '16 minutter']);
  assert.deepEqual(kjorOmregner(225, 60).fet, ['200 °C', '48 minutter']);
  assert.deepEqual(kjorOmregner(150, 10).fet, ['135 °C', '8 minutter']);
  // Midt mellom 175 (165) og 190 (175): 182,5 gir 170. Tiden er en femtedel kortere.
  assert.deepEqual(kjorOmregner('182,5', 25).fet, ['170 °C', '20 minutter']);
  assert.match(kjorOmregner(100, 20).svar, /dekker 150 til 225/u);
  assert.match(kjorOmregner(300, 20).svar, /dekker 150 til 225/u);
  assert.match(kjorOmregner(200, 'abc').svar, /som et tall/u);
});

test('omregneren er statisk først: eksempelet er en rad fra Arlas tabell, skjemaet har ingen class og ingen tall utenfor datafila', () => {
  for (const sti of ['airfryer', 'airfryer/ovn-til-airfryer']) {
    const skjema = html(sti).match(/<form data-oaf[\s\S]*?<\/form>/u)[0];
    assert.doesNotMatch(skjema, /\sclass=/u, `${sti}: skjemaet har class`);
    assert.match(skjema, /value="175"/u);
    assert.match(skjema, /value="20"/u);
    assert.match(skjema, /<strong>165 °C<\/strong> i <strong>16 minutter<\/strong>/u);
    assert.match(skjema, /aria-live="polite"/u);
  }
  const ovn = html('airfryer/ovn-til-airfryer');
  assert.match(ovn, /<link rel="stylesheet" href="\/airfryer-omregner\.css">/u);
  assert.match(ovn, /<script src="\/airfryer-omregner\.js" defer><\/script>/u);
});

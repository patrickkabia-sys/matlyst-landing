// Ukemenyene (/ukemenyer/, bare norsk): adressene er låst, hver side har sju dager i rekkefølge,
// og handlelista på den publiserte siden dekker nøyaktig varene rettene i menyer.nb.json trenger.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { lesData, publiserbare } from '../scripts/familier/felles.mjs';
import { FAMILIER, familieForSti } from '../scripts/familier/register.mjs';
import { DAGER, lesMenyer, validerMenyer } from '../scripts/familier/ukemeny/meny.mjs';

const ROT = fileURLToPath(new URL('..', import.meta.url));
const FAMILIE = FAMILIER.find((f) => f.id === 'ukemeny');
const MENYER = lesMenyer();
const rader = publiserbare(lesData(fileURLToPath(FAMILIE.mappe), 'nb'));
const html = (sti) => readFileSync(join(ROT, sti, 'index.html'), 'utf8');
const hoved = (sti) => html(sti).match(/<main[\s\S]*?<\/main>/u)?.[0] ?? '';

// Adressene er låst: en endring her er en bevisst adresseendring (og trenger omdirigering når sidene er publisert).
const ADRESSER = ['/ukemenyer/', '/ukemenyer/familie/', '/ukemenyer/billig/', '/ukemenyer/vegetar/', '/ukemenyer/for-en/', '/ukemenyer/husmannskost/'];

test('adresselås: familien gir nøyaktig de seks adressene, og alle står i sitemap.xml', () => {
  assert.deepEqual(FAMILIE.markeder, { nb: { rot: 'ukemenyer/' } });
  assert.deepEqual(['/ukemenyer/', ...rader.map((r) => `/ukemenyer/${r.slug}/`)], ADRESSER);
  const kart = readFileSync(join(ROT, 'sitemap.xml'), 'utf8');
  for (const a of ADRESSER) {
    assert.match(kart, new RegExp(`<loc>https://matlyst-app\\.no${a}</loc>`, 'u'), a);
    assert.equal(familieForSti(a), 'ukemeny', a);
    assert.match(html(a.slice(1)), new RegExp(`<link rel="canonical" href="https://matlyst-app\\.no${a}">`, 'u'), a);
  }
  for (const mk of ['sv', 'da', 'en']) assert.doesNotMatch(readFileSync(join(ROT, `sitemap-${mk}.xml`), 'utf8'), /ukemenyer/u, mk);
  // Produktsiden /ukemeny/ er appens funksjonsside og hører ikke til familien.
  assert.equal(familieForSti('/ukemeny/'), null);
});

test('samlesiden står i llms.txt, enkeltsidene gjør det ikke', () => {
  const llms = readFileSync(join(ROT, 'llms.txt'), 'utf8');
  assert.match(llms, /\]\(https:\/\/matlyst-app\.no\/ukemenyer\/\)/u);
  assert.doesNotMatch(llms, /matlyst-app\.no\/ukemenyer\/[a-z]/u);
});

test('hver ukemeny har sju dager, mandag til søndag, i data og på siden', () => {
  assert.deepEqual(rader.map((r) => r.id).sort(), Object.keys(MENYER.menyer).sort(), 'én meny per rad');
  for (const r of rader) {
    const meny = MENYER.menyer[r.id];
    assert.deepEqual(meny.dager.map((x) => x.dag), DAGER, r.id);
    const kort = [...hoved(`ukemenyer/${r.slug}`).matchAll(/<div class="scenario" id="dag-([a-z]+)"><h3>([^<]+)<\/h3>/gu)];
    assert.deepEqual(kort.map(([, id]) => id), DAGER.map((d) => d.replace('ø', 'o')), r.id);
    assert.deepEqual(kort.map(([, , h]) => h.split(':')[0].toLowerCase()), DAGER, r.id);
  }
});

test('handlelista på siden dekker nøyaktig varene rettene trenger, i riktig hylle', () => {
  for (const r of rader) {
    const meny = MENYER.menyer[r.id];
    const side = hoved(`ukemenyer/${r.slug}`);
    const paaSiden = new Map();
    for (const [, hylle, liste] of side.matchAll(/<ul class="handleliste" data-hylle="([^"]+)">([\s\S]*?)<\/ul>/gu)) {
      for (const [, vare] of liste.matchAll(/<li data-vare="([^"]+)">/gu)) {
        assert.ok(!paaSiden.has(vare), `${r.id}: ${vare} står to ganger`);
        paaSiden.set(vare.replace(/&amp;/gu, '&'), hylle.replace(/&amp;/gu, '&'));
      }
    }
    const trengs = new Set(meny.dager.flatMap((x) => x.varer));
    assert.ok(trengs.size > 0, r.id);
    assert.deepEqual([...paaSiden.keys()].sort(), [...trengs].sort(), `${r.id}: lista og rettene er ulike`);
    for (const [vare, hylle] of paaSiden) assert.equal(hylle, MENYER.varer[vare], `${r.id}: ${vare}`);
  }
});

test('hver dag lenker til oppskriften sin eller har egen framgangsmåte', () => {
  for (const r of rader) {
    const side = hoved(`ukemenyer/${r.slug}`);
    for (const x of MENYER.menyer[r.id].dager) {
      if (x.oppskrift) assert.ok(side.includes(`href="${x.oppskrift}"`), `${r.id}/${x.dag}`);
      else assert.ok(x.framgang.every((s) => side.includes(s)), `${r.id}/${x.dag}`);
    }
  }
});

test('ingen tankestrek som skilletegn i de publiserte sidene', () => {
  for (const a of ADRESSER) {
    const tekst = hoved(a.slice(1)).replace(/<script[\s\S]*?<\/script>/gu, ' ').replace(/<[^>]+>/gu, ' ');
    assert.doesNotMatch(tekst, /[—–]/u, a);
  }
});

test('valideringen er rød for en rest som er for gammel, en vare uten hylle og en uke uten sju dager', () => {
  const kopi = () => structuredClone(JSON.parse(readFileSync(new URL('../scripts/familier/ukemeny/menyer.nb.json', import.meta.url), 'utf8')));
  assert.doesNotThrow(() => validerMenyer(kopi()));
  const gammel = kopi();
  gammel.menyer.familie.dager[3].rest.fra = 'mandag';
  gammel.menyer.familie.dager[0].lagMer = 'Lag mer.';
  assert.throws(() => validerMenyer(gammel), /3 dager gammel/u);
  const utenHylle = kopi();
  utenHylle.menyer.billig.dager[0].varer.push('safran');
  assert.throws(() => validerMenyer(utenHylle), /«safran» har ingen hylle/u);
  const seks = kopi();
  seks.menyer.vegetar.dager.pop();
  assert.throws(() => validerMenyer(seks));
  const begge = kopi();
  begge.menyer['for-en'].dager[6].oppskrift = 'https://www.matprat.no/oppskrifter/familien/spagetti-bolognese/';
  assert.throws(() => validerMenyer(begge), /enten oppskrift eller framgang/u);
});

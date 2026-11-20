// Data for «cups to grams»: radene lages av USDA SR Legacy og kontrolleres mot datasettet.
// Utdraget er seks poster kopiert uendret fra datasettet (flour, brown sugar, baking powder, baking soda, butter, salt).
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { lesData, publiserbare } from '../scripts/familier/felles.mjs';
import { lagDataEn, radFraUsda } from '../scripts/familier/dl-til-gram/hent-usda.mjs';
import { avvikUsda, manglerUsda } from '../scripts/familier/dl-til-gram/kontroller-usda.mjs';
import { VARER_EN } from '../scripts/familier/dl-til-gram/varer-en.mjs';

const MAPPE = fileURLToPath(new URL('../scripts/familier/dl-til-gram/', import.meta.url));
const sr = JSON.parse(readFileSync(new URL('./fiksturer/dl-til-gram/sr-legacy-utdrag.json', import.meta.url), 'utf8')).SRLegacyFoods;
const vare = (id) => VARER_EN.find((v) => v.id === id);

test('flour: cup er 125 g med kilde, og postens navn og FDC-ID følger raden', () => {
  const rad = radFraUsda(vare('hvetemel'), sr);
  assert.deepEqual(rad.tall.cup, { verdi: 125, enhet: 'g', kilde: 'usda', merknad: 'cup' });
  assert.equal(rad.status, 'utkast');
  assert.equal(rad.tekst.fdcId, '168894');
  assert.equal(rad.tekst.usdaNavn, 'Wheat flour, white, all-purpose, enriched, bleached');
  assert.equal(rad.tekst.variant, 'all-purpose flour');
});

test('brown sugar bruker «cup packed» 220, og «cup unpacked» 145 er en egen porsjon', () => {
  const rad = radFraUsda(vare('brunt-sukker'), sr);
  assert.deepEqual(rad.tall.cup, { verdi: 220, enhet: 'g', kilde: 'usda', merknad: 'cup packed' });
  const andre = Object.entries(rad.tall).filter(([k]) => k.startsWith('p_')).map(([, t]) => [t.merknad, t.verdi]);
  assert.ok(andre.some(([m, v]) => m === 'cup unpacked' && v === 145), JSON.stringify(andre));
  assert.equal(andre.length, 4, 'alle fem porsjonene i posten, minus den som brukes');
});

test('baking powder har teskje som grunnlag og ingen cup', () => {
  const rad = radFraUsda(vare('baking-powder'), sr);
  assert.equal(rad.tall.tsp.verdi, 4.6);
  assert.equal(rad.tall.tsp.merknad, 'tsp');
  assert.equal(rad.tall.cup, undefined);
  // «0.5 tsp» (2.3 g) er en egen porsjon med mengden i etiketten, ikke blandet med grunnlaget.
  assert.deepEqual(rad.tall.p_1, { verdi: 2.3, enhet: 'g', kilde: 'usda', merknad: '0.5 tsp' });
});

test('butter har «stick» 113 g blant porsjonene', () => {
  const rad = radFraUsda(vare('smor'), sr);
  assert.equal(rad.tall.cup.verdi, 227);
  assert.ok(Object.values(rad.tall).some((t) => t.merknad === 'stick' && t.verdi === 113));
});

test('en vare med ukjent FDC-ID, eller en porsjon som ikke finnes, gir null', () => {
  assert.equal(radFraUsda({ ...vare('hvetemel'), fdcId: 1 }, sr), null);
  assert.equal(radFraUsda({ ...vare('hvetemel'), porsjon: 'cup, sifted' }, sr), null);
  assert.equal(radFraUsda({ ...vare('baking-powder'), porsjon: 'cup' }, sr), null, 'baking powder har ingen cup');
});

test('avvik mot kilden navngir vare, felt og begge tall', () => {
  const data = structuredClone(lesData(MAPPE, 'en'));
  data.rader.find((r) => r.id === 'hvetemel').tall.cup.verdi = 120;
  assert.deepEqual(avvikUsda(data, sr), [{ id: 'hvetemel', felt: 'cup', iFila: 120, iKilden: 125 }]);
});

test('en porsjon som ikke finnes i kilden, og et endret postnavn, er avvik; kontrollen endrer ikke inndata', () => {
  const data = structuredClone(lesData(MAPPE, 'en'));
  const hvete = data.rader.find((r) => r.id === 'hvetemel');
  hvete.tall.cup.merknad = 'cup, sifted';
  hvete.tekst.usdaNavn = 'Noe annet';
  const for_ = JSON.stringify(data);
  const felt = avvikUsda(data, sr).map((a) => `${a.id}/${a.felt}`);
  assert.deepEqual(felt, ['hvetemel/usdaNavn', 'hvetemel/cup']);
  assert.equal(JSON.stringify(data), for_);
});

test('rader som ikke er i utdraget meldes som mangel, ikke som avvik', () => {
  const data = lesData(MAPPE, 'en');
  const mangler = manglerUsda(data, sr).map((m) => m.id);
  assert.ok(mangler.includes('honey'));
  assert.equal(mangler.includes('hvetemel'), false);
  assert.deepEqual(avvikUsda(data, sr), []);
});

test('datafila er gyldig for markedet en, med minst 38 kontrollerte rader', () => {
  const data = lesData(MAPPE, 'en');
  assert.equal(data.familie, 'dl-til-gram');
  assert.equal(data.marked, 'en');
  assert.ok(publiserbare(data).length >= 38, `${publiserbare(data).length} kontrollerte`);
  assert.equal(data.rader.length, VARER_EN.length);
});

test('kilden i datafila er USDA SR Legacy med utgiver, år, adresse og hentedato', () => {
  const { kilder } = lesData(MAPPE, 'en');
  assert.deepEqual(Object.keys(kilder), ['usda']);
  assert.deepEqual(kilder.usda, {
    navn: 'FoodData Central, SR Legacy',
    utgiver: 'U.S. Department of Agriculture, Agricultural Research Service',
    aar: 2019,
    adresse: 'https://fdc.nal.usda.gov/',
    hentet: '2026-11-20',
  });
});

test('hver rad er en vare i varelista, med grunnlaget lista sier og kilden usda', () => {
  const data = lesData(MAPPE, 'en');
  for (const rad of data.rader) {
    const v = vare(rad.id);
    assert.ok(v, rad.id);
    assert.equal(rad.slug, v.slug, rad.id);
    assert.equal(rad.navn, v.navn, rad.id);
    assert.equal(rad.tekst.fdcId, String(v.fdcId), rad.id);
    assert.equal(rad.tekst.variant, v.variant, rad.id);
    assert.equal(rad.tall[v.basis].merknad, v.porsjon, rad.id);
    assert.equal(rad.tall[v.basis === 'cup' ? 'tsp' : 'cup'], undefined, `${rad.id}: bare ett grunnlag`);
    for (const t of Object.values(rad.tall)) assert.equal(t.kilde, 'usda', rad.id);
  }
});

test('hevemidlene har teskje som grunnlag, alle andre cup', () => {
  const data = lesData(MAPPE, 'en');
  for (const rad of data.rader) {
    const hevemiddel = ['baking-powder', 'active-dry-yeast'].includes(rad.id);
    assert.equal(rad.tall.tsp !== undefined, hevemiddel, rad.id);
    assert.equal(rad.tall.cup !== undefined, !hevemiddel, rad.id);
  }
});

test('rad-id: de 16 koblede varene har norske id-er, resten egne som ikke finnes på norsk', () => {
  const nb = lesData(MAPPE, 'nb').rader.map((r) => r.id);
  const en = lesData(MAPPE, 'en').rader.map((r) => r.id);
  const koblet = ['hvetemel', 'sammalt-hvetemel', 'havregryn', 'sukker', 'brunt-sukker', 'melis', 'maisstivelse', 'kakao', 'smor', 'melk', 'flote', 'romme', 'salt', 'ris', 'rosiner', 'mandler'];
  assert.deepEqual(en.filter((id) => nb.includes(id)).sort(), [...koblet].sort());
  for (const id of koblet) assert.ok(nb.includes(id) && en.includes(id), id);
});

test('de utelatte varene er ikke med, og lagDataEn gir like mange rader som varer mot utdraget', () => {
  const data = lesData(MAPPE, 'en');
  for (const ute of ['cake-flour', 'almond-flour', 'kosher-salt', 'chia-seeds', 'greek-yogurt']) assert.equal(data.rader.some((r) => r.id === ute), false, ute);
  const { data: lite, utenRad } = lagDataEn(sr, '2026-11-20');
  assert.equal(lite.rader.length, 5);
  assert.equal(utenRad.length, VARER_EN.length - 5);
});

test('baking powder og baking soda er én rad med to poster: soda står som b_-tall, og kontrollen leser begge postene', () => {
  const rad = radFraUsda(vare('baking-powder'), sr);
  assert.equal(rad.tekst.fdcId, '172804');
  assert.equal(rad.tekst.fdcId2, '175040');
  assert.equal(rad.tekst.usdaNavn2, 'Leavening agents, baking soda');
  assert.deepEqual(rad.tall.b_tsp, { verdi: 4.6, enhet: 'g', kilde: 'usda', merknad: 'tsp' });
  assert.deepEqual(rad.tall.b_p_1, { verdi: 2.3, enhet: 'g', kilde: 'usda', merknad: '0.5 tsp' });
  assert.equal(rad.tall.tsp.verdi, rad.tall.b_tsp.verdi, 'samme tall er grunnen til at de er én side');
  const data = structuredClone(lesData(MAPPE, 'en'));
  data.rader.find((r) => r.id === 'baking-powder').tall.b_tsp.verdi = 4.5;
  assert.deepEqual(avvikUsda(data, sr), [{ id: 'baking-powder', felt: 'b_tsp', iFila: 4.5, iKilden: 4.6 }]);
  assert.equal(lesData(MAPPE, 'en').rader.some((r) => r.id === 'brown-rice' || r.id === 'baking-soda'), false);
});

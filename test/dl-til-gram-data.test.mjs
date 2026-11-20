// Data for familien «dl til gram»: radene lages av kildene, og kontrolleres mot kilden.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { lesData, publiserbare } from '../scripts/familier/felles.mjs';
import { radFraKilde } from '../scripts/familier/dl-til-gram/hent.mjs';
import { avvik, manglerAndrePoster, manglerIKilden } from '../scripts/familier/dl-til-gram/kontroller.mjs';
import { VARER } from '../scripts/familier/dl-til-gram/varer.mjs';

const MAPPE = fileURLToPath(new URL('../scripts/familier/dl-til-gram/', import.meta.url));
const foods = JSON.parse(readFileSync(new URL('./fiksturer/dl-til-gram/foods-utdrag.json', import.meta.url), 'utf8'));
const vare = (id) => VARER.find((v) => v.id === id);

test('en vare med dl-porsjon blir en rad med kilde', () => {
  const rad = radFraKilde(vare('hvetemel'), foods);
  assert.deepEqual(rad.tall.dl, { verdi: 55, enhet: 'g', kilde: 'matvaretabellen' });
  assert.equal(rad.status, 'utkast');
  assert.equal(rad.tekst.matvaretabell, 'Hvetemel, siktet');
});

test('rapporttall og USDA-tall får egen kilde og blir hentet fra varelista', () => {
  const rad = radFraKilde(vare('hvetemel'), foods);
  assert.deepEqual(rad.tall.ss_toppet, { verdi: 9, enhet: 'g', kilde: 'rapport-2015' });
  assert.deepEqual(rad.tall.ts_toppet, { verdi: 4, enhet: 'g', kilde: 'rapport-2015' });
  assert.equal(rad.tall.dl_usda.verdi, 53); // 125 / 2.365882 = 52,8
  assert.equal(rad.tall.dl_usda.kilde, 'usda');
  assert.equal(rad.tekst.rapportnavn, 'Hvetemel, siktet');
  assert.equal(rad.tekst.usdaFdcId, '168936');
});

test('en vare uten rapport eller USDA får ingen slike tall', () => {
  const rad = radFraKilde({ ...vare('hvetemel'), rapport: undefined, usda: undefined }, foods);
  assert.deepEqual(Object.keys(rad.tall), ['dl']);
});

test('en vare uten dl-porsjon blir ingen rad', () => {
  assert.equal(radFraKilde({ id: 'x', slug: 'x', navn: 'X', ord: 'x', matvaretabell: 'Finnes ikke' }, foods), null);
  assert.equal(radFraKilde(vare('honning'), foods), null, 'honning har ingen dl-porsjon i API-et');
});

test('avvik mot kilden navngir vare, felt og begge tall', () => {
  const data = structuredClone(lesData(MAPPE, 'nb'));
  data.rader.find((r) => r.id === 'hvetemel').tall.dl.verdi = 56;
  assert.deepEqual(avvik(data, foods), [{ id: 'hvetemel', felt: 'dl', iFila: 56, iKilden: 55 }]);
});

test('kontrollen endrer ikke datafila den får inn', () => {
  const data = structuredClone(lesData(MAPPE, 'nb'));
  data.rader.find((r) => r.id === 'sukker').tall.dl.verdi = 1;
  const for_ = JSON.stringify(data);
  avvik(data, foods);
  assert.equal(JSON.stringify(data), for_);
});

test('en matvare som ikke finnes i kilden meldes som mangel, ikke som stille treff', () => {
  const data = structuredClone(lesData(MAPPE, 'nb'));
  const mangler = manglerIKilden(data, foods).map((m) => m.id);
  assert.ok(mangler.includes('havregryn'), 'havregryn er ikke i utdraget');
  assert.equal(mangler.includes('hvetemel'), false);
});

test('datafila er gyldig, og alt i utdraget stemmer med kilden', () => {
  const data = lesData(MAPPE, 'nb');
  assert.ok(publiserbare(data).length >= 20);
  assert.deepEqual(avvik(data, foods), []);
});

test('hvert tall i datafila er et av tallene varelista og kilden gir', () => {
  const data = lesData(MAPPE, 'nb');
  for (const rad of data.rader) {
    const v = vare(rad.id);
    assert.ok(v, rad.id);
    assert.equal(rad.tekst.matvaretabell, v.matvaretabell, rad.id);
    assert.equal(rad.tall.ss_toppet?.verdi, v.rapport?.ss, `${rad.id} ss`);
    assert.equal(rad.tall.ts_toppet?.verdi, v.rapport?.ts, `${rad.id} ts`);
    assert.equal(rad.tall.dl_usda?.verdi, v.usda ? Math.round(v.usda.gPerCup / 2.365882) : undefined, `${rad.id} usda`);
  }
});

test('kildene i datafila har navn, utgiver, år, adresse og hentedato', () => {
  const data = lesData(MAPPE, 'nb');
  assert.deepEqual(Object.keys(data.kilder).sort(), ['matvaretabellen', 'rapport-2015', 'usda']);
  assert.equal(data.kilder.matvaretabellen.hentet, '2026-11-20');
});

test('andre poster: hver post varelista nevner, står i datafila med vekt fra kilden', () => {
  const data = lesData(MAPPE, 'nb');
  for (const v of VARER.filter((x) => x.ogsa)) {
    const rad = data.rader.find((r) => r.id === v.id);
    if (!rad) continue;
    assert.deepEqual(JSON.parse(rad.tekst.andrePoster).map(([navn]) => navn), v.ogsa, v.id);
  }
});

test('en annen post som avviker fra kilden navngis, og en som mangler meldes', () => {
  const data = structuredClone(lesData(MAPPE, 'nb'));
  const hvete = data.rader.find((r) => r.id === 'hvetemel');
  hvete.tekst.andrePoster = JSON.stringify([['Hvetemel, siktet', 99], ['Finnes ikke', 1]]);
  assert.deepEqual(avvik(data, foods), [{ id: 'hvetemel', felt: 'annen post «Hvetemel, siktet»', iFila: 99, iKilden: 55 }]);
  assert.deepEqual(manglerAndrePoster(data, foods).filter((m) => m.id === 'hvetemel'), [{ id: 'hvetemel', matvaretabell: 'Finnes ikke' }]);
});

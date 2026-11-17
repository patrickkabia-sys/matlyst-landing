import assert from 'node:assert/strict';
import {
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import {
  dekrypterPrivat,
  krypterPrivat,
  lesPrivat,
  lesSeoDataNokkel,
  PrivatTilstandFeil,
  skrivPrivat,
  tomPrivatTilstand,
} from '../seo-motor/privat.mjs';

const TESTNOKKEL = readFileSync(
  new URL('../seo-motor/test/fixtures/seo-data-nokkel.txt', import.meta.url),
  'utf8',
).trim();
const ANNEN_NOKKEL = Buffer.alloc(32, 1).toString('base64');

function midlertidigFil(t) {
  const mappe = mkdtempSync(join(tmpdir(), 'matlyst-seo-privat-'));
  t.after(() => rmSync(mappe, { recursive: true, force: true }));
  return join(mappe, 'privat.enc');
}

test('privat tilstand går autentisert rundtur', (t) => {
  const fil = midlertidigFil(t);
  const data = {
    ...tomPrivatTilstand(),
    emneko: [{ id: 'e-hemmelig', sokeord: 'særpreget gryterettsøk', score: 42 }],
  };

  skrivPrivat(fil, data, TESTNOKKEL);

  const konvolutt = JSON.parse(readFileSync(fil, 'utf8'));
  assert.deepEqual(Object.keys(konvolutt).sort(), ['auth_tag', 'chiffertekst', 'iv', 'versjon']);
  assert.equal(Buffer.from(konvolutt.iv, 'base64').length, 12);
  assert.equal(Buffer.from(konvolutt.auth_tag, 'base64').length, 16);
  assert.deepEqual(lesPrivat(fil, TESTNOKKEL), data);
});

test('hver private skriving bruker ny IV', () => {
  const data = tomPrivatTilstand();

  const første = krypterPrivat(data, TESTNOKKEL);
  const andre = krypterPrivat(data, TESTNOKKEL);

  assert.notEqual(første.iv, andre.iv);
  assert.notEqual(første.chiffertekst, andre.chiffertekst);
});

test('feil nøkkel avvises uten tom reserve', () => {
  const konvolutt = krypterPrivat({ ...tomPrivatTilstand(), gsc: [{ hemmelig: true }] }, TESTNOKKEL);

  assert.throws(
    () => dekrypterPrivat(konvolutt, ANNEN_NOKKEL),
    (feil) => feil instanceof PrivatTilstandFeil
      && feil.kode === 'privat-tilstand-ugyldig',
  );
});

test('ødelagt privat fil avvises uten ny start', (t) => {
  const fil = midlertidigFil(t);
  writeFileSync(fil, '{ødelagt');

  assert.throws(
    () => lesPrivat(fil, TESTNOKKEL),
    (feil) => feil instanceof PrivatTilstandFeil
      && feil.kode === 'privat-tilstand-ugyldig',
  );
});

test('ukjent privat versjon avvises', () => {
  const konvolutt = { ...krypterPrivat(tomPrivatTilstand(), TESTNOKKEL), versjon: 2 };

  assert.throws(
    () => dekrypterPrivat(konvolutt, TESTNOKKEL),
    (feil) => feil instanceof PrivatTilstandFeil
      && feil.kode === 'privat-tilstand-ugyldig',
  );
});

test('manglende privat fil starter med tom kø', (t) => {
  const fil = midlertidigFil(t);

  assert.deepEqual(lesPrivat(fil, TESTNOKKEL), {
    emneko: [],
    gsc: [],
    forslag: [],
    ytelse: [],
    forslagKjoringer: {},
  });
});

test('manglende eller ugyldig SEO_DATA_NOKKEL nektes', () => {
  assert.throws(
    () => lesSeoDataNokkel({ tørt: false, tillatNokkelring: false, miljø: {} }),
    (feil) => feil.kode === 'seo-data-nokkel-mangler',
  );
  assert.throws(
    () => lesSeoDataNokkel({
      tørt: false,
      tillatNokkelring: false,
      miljø: { SEO_DATA_NOKKEL: Buffer.alloc(31).toString('base64') },
    }),
    (feil) => feil.kode === 'seo-data-nokkel-ugyldig',
  );
});

test('tørrkjøring bruker den faste fixture-nøkkelen', () => {
  assert.equal(
    lesSeoDataNokkel({ tørt: true, tillatNokkelring: false, miljø: {} }),
    TESTNOKKEL,
  );
});

test('lokal nøkkelhenting faller tilbake til macOS-nøkkelringen', () => {
  const kall = [];
  const nøkkel = lesSeoDataNokkel({
    tørt: false,
    tillatNokkelring: true,
    miljø: {},
    finnNokkelring: (kommando, argumenter) => {
      kall.push([kommando, argumenter]);
      return `${ANNEN_NOKKEL}\n`;
    },
  });

  assert.equal(nøkkel, ANNEN_NOKKEL);
  assert.deepEqual(kall, [[
    'security',
    ['find-generic-password', '-s', 'matlyst-seo-data', '-w'],
  ]]);
});

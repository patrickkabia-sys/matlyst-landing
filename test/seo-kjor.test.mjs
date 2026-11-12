import assert from 'node:assert/strict';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';

import { kjor } from '../seo-motor/kjor.mjs';
import { lesPrivat, skrivPrivat, tomPrivatTilstand } from '../seo-motor/privat.mjs';

const TESTNOKKEL = readFileSync(
  new URL('../seo-motor/test/fixtures/seo-data-nokkel.txt', import.meta.url),
  'utf8',
).trim();
const SÆRPREGET = 'SÆRPREGET-HEMMELIG-SØK-94721';

function skrivJson(fil, data) {
  mkdirSync(join(fil, '..'), { recursive: true });
  writeFileSync(fil, `${JSON.stringify(data, null, 2)}\n`);
}

function privatEmne() {
  return {
    id: 'e-a1b2c3d4e5f60708',
    sprak: 'nb',
    sokeord: SÆRPREGET,
    score: 90,
    passform: 3,
    proxy: 30,
    tagger: ['rester', 'middag'],
    appkobling: 'bruk-det-jeg-har',
    tema: 'rester i nye måltider',
    vinkel: 'bruke det som finnes hjemme før nye varer kjøpes',
    slug: 'bruk-rester-i-middag',
    kilde_ider: ['mattilsynet'],
  };
}

function lagRot(t, { medKø = true, publisert = [], sperre = null } = {}) {
  const mappe = mkdtempSync(join(tmpdir(), 'matlyst-seo-kjor-'));
  t.after(() => rmSync(mappe, { recursive: true, force: true }));
  mkdirSync(join(mappe, 'seo-data'), { recursive: true });
  cpSync(new URL('../seo-data/sprak/', import.meta.url), join(mappe, 'seo-data', 'sprak'), { recursive: true });
  cpSync(new URL('../seo-data/grenser.json', import.meta.url), join(mappe, 'seo-data', 'grenser.json'));
  cpSync(new URL('../seo-data/forbudt.json', import.meta.url), join(mappe, 'seo-data', 'forbudt.json'));
  cpSync(new URL('../seo-data/kilder.json', import.meta.url), join(mappe, 'seo-data', 'kilder.json'));
  skrivJson(join(mappe, 'seo-data', 'publisert.json'), publisert);
  if (sperre) skrivJson(join(mappe, 'seo-data', 'sperre.json'), sperre);
  writeFileSync(join(mappe, 'index.html'), '<title>Matlyst</title><meta name="description" content="Forsiden"><body>Matlyst</body>');
  writeFileSync(join(mappe, 'sitemap.xml'), '<?xml version="1.0"?><urlset><url><loc>https://matlyst-app.no/</loc></url></urlset>');
  const rot = pathToFileURL(`${mappe}/`);
  skrivPrivat(new URL('seo-data/privat.enc', rot), {
    ...tomPrivatTilstand(),
    emneko: medKø ? [privatEmne()] : [],
  }, TESTNOKKEL);
  return { mappe, rot };
}

function avhengigheter(rot, overstyr = {}) {
  return {
    rot,
    nokkel: TESTNOKKEL,
    gsc: async () => [],
    forslag: async ({ språkfil, sprak }) => ({
      rå: språkfil['forslagsfrø'].map((frø) => ({ frø: frø.tekst, forslag: [`${frø.tekst} tips`] })),
      kandidater: språkfil['forslagsfrø'].map((frø) => ({
        sokeord: `${frø.tekst} tips`,
        sprak,
        frø,
        forslagAntall: 1,
        kilde: 'forslag',
      })),
    }),
    ...overstyr,
  };
}

function offentligeJson(mappe) {
  const dataRot = join(mappe, 'seo-data');
  return readdirSync(dataRot, { recursive: true })
    .map(String)
    .filter((navn) => navn.endsWith('.json'))
    .filter((navn) => !navn.startsWith('sprak/'))
    .filter((navn) => !['grenser.json', 'forbudt.json', 'kilder.json'].includes(navn))
    .map((navn) => [navn, readFileSync(join(dataRot, navn), 'utf8')]);
}

test('av gjør ingenting og krever ingen nøkkel', async (t) => {
  const { mappe, rot } = lagRot(t);
  const før = readdirSync(mappe, { recursive: true }).map(String).sort();

  const resultat = await kjor({
    tid: new Date('2026-11-12T04:00:00Z'),
    modus: 'av',
    tørt: false,
    avh: { rot },
  });

  assert.equal(resultat.resultat, 'av');
  assert.deepEqual(readdirSync(mappe, { recursive: true }).map(String).sort(), før);
});

test('aktiv modus uten nøkkel nektes med statuskode', async (t) => {
  const { rot } = lagRot(t);

  const resultat = await kjor({
    tid: new Date('2026-11-12T04:00:00Z'),
    modus: 'utkast',
    tørt: false,
    avh: { rot, miljø: {} },
  });

  assert.equal(resultat.resultat, 'feil');
  assert.equal(resultat.statuskode, 'seo-data-nokkel-mangler');
});

test('motoren skriver generalisert bestilling og offentlig driftslogg', async (t) => {
  const { mappe, rot } = lagRot(t);

  const resultat = await kjor({
    tid: new Date('2026-11-12T04:00:00Z'),
    modus: 'utkast',
    tørt: true,
    avh: avhengigheter(rot),
  });

  assert.equal(resultat.resultat, 'bestilling');
  assert.equal(resultat.slug, 'bruk-rester-i-middag');
  const bestillingFil = join(mappe, 'seo-data', 'bestillinger', '2026-11-12-nb-bruk-rester-i-middag.json');
  assert.equal(existsSync(bestillingFil), true);
  const bestilling = JSON.parse(readFileSync(bestillingFil, 'utf8'));
  assert.equal(bestilling.emne, 'En praktisk veiledning om rester i nye måltider.');
  assert.equal(bestilling.vinkel, 'Vis hvordan leseren kan bruke det som finnes hjemme før nye varer kjøpes.');
  for (const [navn, innhold] of offentligeJson(mappe)) {
    assert.doesNotMatch(innhold, new RegExp(SÆRPREGET, 'u'), navn);
    assert.doesNotMatch(innhold, /"(?:sokeord|visninger|klikk|score|poeng|volum)"/u, navn);
  }
});

test('andre kjøring samme Oslo-døgn lager ikke ny bestilling', async (t) => {
  const { mappe, rot } = lagRot(t);
  const avh = avhengigheter(rot);

  await kjor({ tid: new Date('2026-11-12T04:00:00Z'), modus: 'utkast', tørt: true, avh });
  const andre = await kjor({ tid: new Date('2026-11-12T12:00:00Z'), modus: 'utkast', tørt: true, avh });

  assert.equal(andre.resultat, 'tom');
  assert.equal(andre.statuskode, 'daglig-grense');
  assert.equal(readdirSync(join(mappe, 'seo-data', 'bestillinger')).length, 1);
});

test('motoren lager ikke bestilling når ukesgrensen er nådd', async (t) => {
  const publisert = Array.from({ length: 7 }, (_, indeks) => ({
    dato: `2026-11-${String(9 + (indeks % 3)).padStart(2, '0')}`,
    emne_id: `e-publisert-${indeks}`,
    sprak: 'nb',
    slug: `publisert-${indeks}`,
    sti: `/blogg/publisert-${indeks}/`,
  }));
  const { mappe, rot } = lagRot(t, { publisert });

  const resultat = await kjor({
    tid: new Date('2026-11-12T04:00:00Z'),
    modus: 'utkast',
    tørt: true,
    avh: avhengigheter(rot),
  });

  assert.equal(resultat.resultat, 'tom');
  assert.equal(resultat.statuskode, 'ukentlig-grense');
  assert.equal(existsSync(join(mappe, 'seo-data', 'bestillinger')), false);
});

test('mandag henter hvert forslagsfrø høyst én gang selv ved ny kjøring', async (t) => {
  const { rot } = lagRot(t, { medKø: false });
  const kall = [];
  const avh = avhengigheter(rot, {
    forslag: async ({ språkfil, sprak }) => {
      for (const frø of språkfil['forslagsfrø']) kall.push(`${sprak}:${frø.tekst}`);
      return { rå: [], kandidater: [] };
    },
  });

  await kjor({ tid: new Date('2026-11-09T04:00:00Z'), modus: 'utkast', tørt: true, avh });
  await kjor({ tid: new Date('2026-11-09T05:00:00Z'), modus: 'utkast', tørt: true, avh });

  assert.equal(kall.length, new Set(kall).size);
  assert.equal(kall.length, 32);
  const privat = lesPrivat(new URL('seo-data/privat.enc', rot), TESTNOKKEL);
  assert.ok(privat.forslagKjoringer['2026-11-09']);
});

test('mandag lagrer aggregert ytelse bare i privat tilstand', async (t) => {
  const { rot } = lagRot(t, { medKø: false });

  await kjor({
    tid: new Date('2026-11-09T04:00:00Z'),
    modus: 'utkast',
    tørt: true,
    avh: avhengigheter(rot, {
      gsc: async () => [
        { sokeord: 'hemmelig ett', land: 'nor', klikk: 3, visninger: 40, plassering: 12 },
        { sokeord: 'hemmelig to', land: 'nor', klikk: 2, visninger: 60, plassering: 18 },
      ],
    }),
  });

  const privat = lesPrivat(new URL('seo-data/privat.enc', rot), TESTNOKKEL);
  assert.deepEqual(privat.ytelse, [{
    dato: '2026-11-09',
    antall: 2,
    klikk: 5,
    visninger: 100,
  }]);
});

test('forslagsfeil blir sikker statuskode og stopper uten retry', async (t) => {
  const { mappe, rot } = lagRot(t, { medKø: false });
  let kall = 0;
  const feil = new Error('rå hemmelig nettverksfeil');
  feil.kode = 'forslag-feil';
  feil.httpStatus = 503;

  const resultat = await kjor({
    tid: new Date('2026-11-09T04:00:00Z'),
    modus: 'utkast',
    tørt: true,
    avh: avhengigheter(rot, {
      forslag: async () => {
        kall += 1;
        throw feil;
      },
    }),
  });

  assert.equal(kall, 1);
  assert.equal(resultat.resultat, 'feil');
  assert.equal(resultat.statuskode, 'forslag-feil');
  assert.equal(resultat.http_status, 503);
  assert.doesNotMatch(readFileSync(join(mappe, 'seo-data', 'logg', '2026-11-09.json'), 'utf8'), /rå hemmelig/u);
});

test('feil privat nøkkel gir privat-tilstand-ugyldig og overskriver ikke filen', async (t) => {
  const { rot } = lagRot(t);
  const fil = new URL('seo-data/privat.enc', rot);
  const før = readFileSync(fil, 'utf8');

  const resultat = await kjor({
    tid: new Date('2026-11-12T04:00:00Z'),
    modus: 'utkast',
    tørt: false,
    avh: avhengigheter(rot, { nokkel: Buffer.alloc(32, 9).toString('base64') }),
  });

  assert.equal(resultat.statuskode, 'privat-tilstand-ugyldig');
  assert.equal(readFileSync(fil, 'utf8'), før);
});

test('aktiv sperre tvinger på-modus til utkast', async (t) => {
  const { rot } = lagRot(t, {
    sperre: { dato: '2026-11-11', grunnkode: 'tre-avvisninger-pa-rad' },
  });

  const resultat = await kjor({
    tid: new Date('2026-11-12T04:00:00Z'),
    modus: 'på',
    tørt: true,
    avh: avhengigheter(rot),
  });

  assert.equal(resultat.modus, 'utkast');
  assert.equal(resultat.resultat, 'bestilling');
});

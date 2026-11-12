import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { hentDataForSeo, TakNådd } from '../seo-motor/dataforseo.mjs';
import { lesData } from '../seo-motor/skjema.mjs';
import { byggKo } from '../seo-motor/sokeord.mjs';

const fixtureRot = new URL('../seo-motor/test/fixtures/', import.meta.url);
const gscKandidater = JSON.parse(readFileSync(new URL('gsc.json', fixtureRot), 'utf8'));
const dataforseoSvar = JSON.parse(readFileSync(new URL('dataforseo.json', fixtureRot), 'utf8'));
const tomtNettsted = { sider: [] };
const forbudt = {
  domener: ['matprat.no', 'godt.no', 'nom.no'],
  navn: ['Matprat', 'Godt.no', 'Nom'],
  helseord: [],
};
const grenser = { vanskelighetMaks: 35 };

test('poeng sorterer køen', () => {
  const kandidater = [
    { sokeord: 'rolig middag', land: 'nor', volum: 100, vanskelighet: 10 },
    { sokeord: 'rask middag', land: 'nor', volum: 80, vanskelighet: 0 },
  ];
  const passform = new Map([
    ['rolig middag', { passform: 1, tagger: ['middag'] }],
    ['rask middag', { passform: 2, tagger: ['middag'] }],
  ]);

  const resultat = byggKo({
    kandidater,
    passform,
    nettsted: tomtNettsted,
    forbudt,
    grenser,
    brukt: [],
  });

  assert.deepEqual(resultat.ko.map(({ sokeord }) => sokeord), ['rask middag', 'rolig middag']);
  assert.deepEqual(resultat.ko.map(({ poeng }) => poeng), [160, 90]);
});

test('forbudt merkenavn forkastes', () => {
  const resultat = byggKo({
    kandidater: [{ sokeord: 'Matprat rester', land: 'nor', volum: 100, vanskelighet: 10 }],
    passform: new Map([['Matprat rester', { passform: 3, tagger: ['rester'] }]]),
    nettsted: tomtNettsted,
    forbudt,
    grenser,
    brukt: [],
  });

  assert.deepEqual(resultat, { ko: [], styrkEksisterende: [] });
});

test('for vanskelig forkastes', () => {
  const resultat = byggKo({
    kandidater: [{ sokeord: 'vanskelig middag', land: 'nor', volum: 1000, vanskelighet: 36 }],
    passform: new Map([['vanskelig middag', { passform: 3, tagger: ['middag'] }]]),
    nettsted: tomtNettsted,
    forbudt,
    grenser,
    brukt: [],
  });

  assert.deepEqual(resultat.ko, []);
});

test('overlapp går til styrkEksisterende', () => {
  const kandidat = { sokeord: 'koketider for ris og pasta', land: 'nor', volum: 200, vanskelighet: 10 };
  const resultat = byggKo({
    kandidater: [kandidat],
    passform: new Map([[kandidat.sokeord, { passform: 3, tagger: ['koketider'] }]]),
    nettsted: { sider: [{ tittel: 'Koketider for pasta og ris' }] },
    forbudt,
    grenser,
    brukt: [],
  });

  assert.deepEqual(resultat.ko, []);
  assert.deepEqual(resultat.styrkEksisterende, [kandidat.sokeord]);
});

test('GSC-plassering 8–30 tas med, 1–7 ikke', () => {
  const passform = new Map(gscKandidater.map(({ sokeord }) => [
    sokeord,
    { passform: 2, tagger: ['rester'] },
  ]));

  const resultat = byggKo({
    kandidater: gscKandidater,
    passform,
    nettsted: tomtNettsted,
    forbudt,
    grenser,
    brukt: [],
  });

  assert.deepEqual(resultat.ko.map(({ sokeord }) => sokeord), ['middag av rester']);
});

test('GSC-kandidater fra land uten støttet språk forkastes', () => {
  const kandidater = [
    { sokeord: 'rask middag', land: 'nor', visninger: 100, plassering: 12 },
    { sokeord: 'schnelles abendessen', land: 'deu', visninger: 500, plassering: 12 },
  ];
  const passform = new Map(kandidater.map(({ sokeord }) => [
    sokeord,
    { passform: 3, tagger: ['middag'] },
  ]));

  const resultat = byggKo({
    kandidater,
    passform,
    nettsted: tomtNettsted,
    forbudt,
    grenser,
    brukt: [],
  });

  assert.deepEqual(resultat.ko.map(({ id }) => id), ['rask-middag-nb']);
});

test('helseord fra forbudt.json forkastes fra køen', () => {
  const sokeord = 'kalorier middag';
  const resultat = byggKo({
    kandidater: [{ sokeord, land: 'nor', volum: 100, vanskelighet: 10 }],
    passform: new Map([[sokeord, { passform: 3, tagger: ['middag'] }]]),
    nettsted: tomtNettsted,
    forbudt: lesData('forbudt.json'),
    grenser,
    brukt: [],
  });

  assert.deepEqual(resultat.ko, []);
});

test('taket stopper før neste forespørsel', async () => {
  const opprinneligFetch = globalThis.fetch;
  const kall = [];
  globalThis.fetch = async (url, valg) => {
    kall.push({ url, valg });
    return {
      ok: true,
      status: 200,
      json: async () => dataforseoSvar,
    };
  };

  try {
    await assert.rejects(
      hentDataForSeo({
        login: 'bruker',
        passord: 'hemmelig',
        frø: ['rester', 'ukemeny'],
        land: 'nor',
        tak: 1,
      }),
      (feil) => feil instanceof TakNådd,
    );
    assert.equal(kall.length, 1);
  } finally {
    globalThis.fetch = opprinneligFetch;
  }
});

test('DataForSEO-applikasjonsfeil kaster i stedet for å gi tomt resultat', async () => {
  const opprinneligFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: true,
    status: 200,
    json: async () => ({
      status_code: 20_000,
      status_message: 'Ok.',
      tasks: [{
        status_code: 40_200,
        status_message: 'Payment Required.',
        result: null,
      }],
    }),
  });

  try {
    await assert.rejects(
      hentDataForSeo({
        login: 'bruker',
        passord: 'hemmelig',
        frø: ['rester'],
        land: 'nor',
        tak: 1,
      }),
      /Payment Required/u,
    );
  } finally {
    globalThis.fetch = opprinneligFetch;
  }
});

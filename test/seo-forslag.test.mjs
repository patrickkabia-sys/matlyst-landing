import assert from 'node:assert/strict';
import test from 'node:test';

import { ForslagFeil, hentForslag } from '../seo-motor/forslag.mjs';

const språkfil = {
  forslagslokale: { hl: 'no', gl: 'no' },
  'forslagsfrø': [
    {
      tekst: 'middag med rester',
      passform: 3,
      tagger: ['rester'],
      appkobling: 'bruk-det-jeg-har',
      tema: 'rester i nye måltider',
      vinkel: 'bruke det som finnes hjemme',
      slug: 'bruk-rester-i-middag',
      kilde_ider: ['mattilsynet'],
    },
    {
      tekst: 'enkel ukemeny',
      passform: 2,
      tagger: ['ukemeny'],
      appkobling: 'ukemeny',
      tema: 'en oversiktlig ukemeny',
      vinkel: 'planlegge noen få middager',
      slug: 'enkel-ukemeny',
      kilde_ider: [],
    },
  ],
};

test('autocomplete bruker Firefox-endepunktet én gang per frø', async () => {
  const kall = [];
  const resultat = await hentForslag({
    sprak: 'nb',
    språkfil,
    hent: async (url) => {
      kall.push(url);
      const frø = new URL(url).searchParams.get('q');
      return { status: 200, data: [frø, [`${frø} i dag`, `${frø} raskt`]] };
    },
  });

  assert.equal(kall.length, 2);
  assert.deepEqual(kall.map((url) => {
    const parsed = new URL(url);
    return {
      origin: parsed.origin,
      path: parsed.pathname,
      client: parsed.searchParams.get('client'),
      hl: parsed.searchParams.get('hl'),
      gl: parsed.searchParams.get('gl'),
      q: parsed.searchParams.get('q'),
    };
  }), [
    {
      origin: 'https://suggestqueries.google.com',
      path: '/complete/search',
      client: 'firefox',
      hl: 'no',
      gl: 'no',
      q: 'middag med rester',
    },
    {
      origin: 'https://suggestqueries.google.com',
      path: '/complete/search',
      client: 'firefox',
      hl: 'no',
      gl: 'no',
      q: 'enkel ukemeny',
    },
  ]);
  assert.equal(resultat.rå.length, 2);
  assert.equal(resultat.kandidater.length, 4);
  assert.equal(resultat.kandidater[0].forslagAntall, 2);
  assert.equal(resultat.kandidater[0].sprak, 'nb');
});

test('autocomplete-feil gir forslag-feil uten retry', async () => {
  let kall = 0;

  await assert.rejects(
    hentForslag({
      sprak: 'nb',
      språkfil,
      hent: async () => {
        kall += 1;
        return { status: 503, data: null };
      },
    }),
    (feil) => feil instanceof ForslagFeil
      && feil.kode === 'forslag-feil'
      && feil.httpStatus === 503,
  );
  assert.equal(kall, 1);
});

test('ugyldig autocomplete-format gir forslag-feil', async () => {
  await assert.rejects(
    hentForslag({
      sprak: 'nb',
      språkfil: { ...språkfil, 'forslagsfrø': språkfil['forslagsfrø'].slice(0, 1) },
      hent: async () => ({ status: 200, data: { forslag: [] } }),
    }),
    (feil) => feil instanceof ForslagFeil
      && feil.kode === 'forslag-feil'
      && feil.httpStatus === 200,
  );
});

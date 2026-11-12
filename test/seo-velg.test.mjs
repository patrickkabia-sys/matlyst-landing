import assert from 'node:assert/strict';
import test from 'node:test';

import { byggLenker } from '../seo-motor/lenker.mjs';
import { lesNettsted } from '../seo-motor/nettsted.mjs';
import { lesData } from '../seo-motor/skjema.mjs';
import { velgEmne } from '../seo-motor/velg.mjs';

const nbEmne = { id: 'rester-nb', sprak: 'nb', sokeord: 'rester', score: 200 };
const svEmne = { id: 'rester-sv', sprak: 'sv', sokeord: 'rester', score: 100 };
const ny = {
  slug: 'ny-restemiddag',
  sprak: 'nb',
  tagger: ['rester', 'middag'],
  sti: '/blogg/ny-restemiddag/',
  tittel: 'Lag en ny middag av restene',
  appkobling: 'ukemeny',
  sprakfil: {
    appkoblingSti: { ukemeny: '/ukemeny/' },
    appCta: { ukemeny: { tittel: 'Planlegg middagen i ukemenyen' } },
  },
};

test('velger høyest poeng', () => {
  assert.equal(velgEmne([svEmne, nbEmne], []), nbEmne);
});

test('hopper over brukt emne', () => {
  const publisert = [{ emne_id: 'rester-nb', sprak: 'nb', dato: '2026-11-10' }];

  assert.equal(velgEmne([nbEmne, svEmne], publisert), svEmne);
});

test('femte nb på sju dager hoppes over', () => {
  const publisert = [
    { emne_id: 'eldre-nb-1', sprak: 'nb', dato: '2026-11-01' },
    { emne_id: 'eldre-sv-1', sprak: 'sv', dato: '2026-11-02' },
    { emne_id: 'eldre-nb-2', sprak: 'nb', dato: '2026-11-03' },
    { emne_id: 'eldre-da-1', sprak: 'da', dato: '2026-11-04' },
    { emne_id: 'eldre-nb-3', sprak: 'nb', dato: '2026-11-05' },
    { emne_id: 'eldre-en-1', sprak: 'en', dato: '2026-11-06' },
    { emne_id: 'eldre-nb-4', sprak: 'nb', dato: '2026-11-07' },
  ];

  assert.equal(velgEmne([nbEmne, svEmne], publisert), svEmne);
});

test('tom kø gir null', () => {
  assert.equal(velgEmne([], []), null);
});

test('lenker bare til samme språk', () => {
  const artikler = [
    {
      slug: 'norsk-restemat',
      sprak: 'nb',
      tagger: ['rester'],
      sti: '/blogg/norsk-restemat/',
      tittel: 'Norsk restemat',
    },
    {
      slug: 'svensk-restmat',
      sprak: 'sv',
      tagger: ['rester', 'middag'],
      sti: '/sv/blogg/svensk-restmat/',
      tittel: 'Svensk restmat',
    },
  ];

  const resultat = byggLenker(artikler, ny);

  assert.deepEqual(resultat.nyLenker, [
    { sti: '/blogg/norsk-restemat/', tittel: 'Norsk restemat' },
    { sti: '/ukemeny/', tittel: 'Planlegg middagen i ukemenyen' },
  ]);
  assert.deepEqual([...resultat.lesOgså], [[
    'norsk-restemat',
    { sti: '/blogg/ny-restemiddag/', tittel: 'Lag en ny middag av restene' },
  ]]);
});

test('maks fire lenker', () => {
  const artikler = Array.from({ length: 6 }, (_, indeks) => ({
    slug: `restemat-${indeks}`,
    sprak: 'nb',
    tagger: ['rester', 'middag'],
    sti: `/blogg/restemat-${indeks}/`,
    tittel: `Restemat ${indeks}`,
  }));

  const resultat = byggLenker(artikler, ny);

  assert.equal(resultat.nyLenker.length, 4);
  assert.deepEqual(resultat.nyLenker.at(-1), {
    sti: '/ukemeny/',
    tittel: 'Planlegg middagen i ukemenyen',
  });
});

test('reelle språkfiler har gyldige appkoblingSti', () => {
  const nettsted = lesNettsted(new URL('../', import.meta.url));

  for (const sprak of ['nb', 'sv', 'da', 'en']) {
    const sprakfil = lesData(`sprak/${sprak}.json`);
    for (const appkobling of Object.keys(sprakfil.appCta)) {
      const resultat = byggLenker([], { ...ny, sprak, sprakfil, appkobling });
      const appLenke = resultat.nyLenker.at(-1);

      assert.equal(appLenke.sti, sprakfil.appkoblingSti[appkobling]);
      assert.equal(nettsted.stier.has(appLenke.sti), true, `${sprak}:${appkobling}`);
    }
  }
});

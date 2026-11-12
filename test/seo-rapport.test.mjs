import assert from 'node:assert/strict';
import test from 'node:test';

import { nattrapport, postRapport, ukerapport } from '../seo-motor/rapport.mjs';

test('natt med publisering viser lenke og kostnad', () => {
  const tekst = nattrapport({
    dato: '2026-11-12',
    modus: 'på',
    resultat: 'publisert',
    emne: 'koketid for egg',
    sti: '/blogg/koketid-for-egg/',
    prUrl: 'https://github.com/matlyst/landing/pull/42',
    kostnadUsd: 0.037,
  });

  assert.match(tekst, /\[\/blogg\/koketid-for-egg\/\]\(https:\/\/matlyst-app\.no\/blogg\/koketid-for-egg\/\)/u);
  assert.match(tekst, /\[PR #42\]\(https:\/\/github\.com\/matlyst\/landing\/pull\/42\)/u);
  assert.match(tekst, /\$0\.037/u);
});

test('avvisning viser grunnene', () => {
  const tekst = nattrapport({
    dato: '2026-11-12',
    modus: 'utkast',
    resultat: 'avvist',
    grunner: ['Tittelen er for lang', 'Ukjent kilde K9'],
    kostnadUsd: 0.021,
  });

  assert.match(tekst, /Tittelen er for lang/u);
  assert.match(tekst, /Ukjent kilde K9/u);
});

test('utkast viser PR uten offentlig artikkellenke', () => {
  const tekst = nattrapport({
    dato: '2026-11-12',
    modus: 'utkast',
    resultat: 'utkast',
    sti: '/blogg/koketid-for-egg/',
    prUrl: 'https://github.com/matlyst/landing/pull/42',
    kostnadUsd: 0.037,
  });

  assert.match(tekst, /\[PR #42\]/u);
  assert.doesNotMatch(tekst, /matlyst-app\.no\/blogg/u);
});

test('avvist rapport viser ikke offentlig artikkellenke', () => {
  const tekst = nattrapport({
    dato: '2026-11-12',
    modus: 'på',
    resultat: 'avvist',
    sti: '/blogg/koketid-for-egg/',
    grunner: ['npm test feilet'],
    kostnadUsd: 0.037,
  });

  assert.doesNotMatch(tekst, /matlyst-app\.no\/blogg/u);
});

test('sperre nevnes tydelig', () => {
  const tekst = nattrapport({
    dato: '2026-11-12',
    modus: 'utkast',
    resultat: 'sperret',
    grunner: ['Tre avvisninger på rad'],
    kostnadUsd: 0,
  });

  assert.match(tekst, /SPERRE/u);
  assert.match(tekst, /Tre avvisninger på rad/u);
});

test('ukerapport viser topp 10', () => {
  const ko = Array.from({ length: 12 }, (_, indeks) => ({
    id: `emne-${indeks + 1}`,
    sokeord: `søkeord ${indeks + 1}`,
    sprak: 'nb',
    poeng: 120 - indeks,
  }));
  const tekst = ukerapport({
    ytelse: [{ sti: '/blogg/egg/', visninger: 200, klikk: 18, plassering: 9.4 }],
    ko,
    kostnadUke: 0.142,
  });

  assert.match(tekst, /\/blogg\/egg\//u);
  assert.match(tekst, /søkeord 10/u);
  assert.doesNotMatch(tekst, /søkeord 11/u);
  assert.match(tekst, /\$0\.142/u);
});

test('postRapport lager issue når den mangler', async () => {
  const kall = [];
  const gh = async (args) => {
    kall.push(args);
    if (args[0] === 'issue' && args[1] === 'list') return '[]';
    if (args[0] === 'issue' && args[1] === 'create') return 'https://github.com/matlyst/landing/issues/17';
    return '';
  };

  await postRapport('Nattlig rapport', { issueTittel: 'SEO-autopilot', gh });

  assert.deepEqual(kall[0], ['issue', 'list', '--search', 'SEO-autopilot in:title', '--json', 'number']);
  assert.deepEqual(kall[1], ['issue', 'create', '--title', 'SEO-autopilot', '--body', 'Samlet rapporttråd for SEO-autopiloten.']);
  assert.deepEqual(kall[2], ['issue', 'comment', '17', '--body', 'Nattlig rapport']);
});

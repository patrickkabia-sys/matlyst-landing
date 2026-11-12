import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  chmodSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import {
  lagRapporttekst,
  nattrapport,
  postRapport,
  ukerapport,
} from '../seo-motor/rapport.mjs';

const HEMMELIG = 'SÆRPREGET-SØKEORD-ALDRI-OFFENTLIG';

test('nattrapport viser bare drift, bestilling, slug, koder og antall', () => {
  const tekst = nattrapport({
    dato: '2026-11-12',
    modus: 'utkast',
    resultat: 'bestilling',
    statuskode: 'bestilling-opprettet',
    bestilling_id: '2026-11-12-nb-restemiddag',
    slug: 'restemiddag',
    grunnkoder: ['ingen-kilder'],
    antall: { gsc: 4, forslag: 8, ko: 2, bestillinger: 1 },
    sokeord: HEMMELIG,
    visninger: 987654,
    klikk: 12345,
    score: 777,
  });

  assert.match(tekst, /bestilling-opprettet/u);
  assert.match(tekst, /2026-11-12-nb-restemiddag/u);
  assert.match(tekst, /restemiddag/u);
  assert.match(tekst, /ingen-kilder/u);
  assert.match(tekst, /GSC[^\n]*4/u);
  assert.doesNotMatch(tekst, new RegExp(HEMMELIG, 'u'));
  assert.doesNotMatch(tekst, /987654|12345|777/u);
});

test('ukerapport viser bare offentlige antall og statuskoder', () => {
  const tekst = ukerapport({
    statuskoder: ['bestilling-opprettet', 'ko-tom'],
    antall: { levert: 2, avvist: 1, bestillinger: 3, ytelsesrader: 4 },
    ytelse: [{ sokeord: HEMMELIG, visninger: 999, klikk: 88 }],
    ko: [{ sokeord: HEMMELIG, score: 500 }],
  });

  assert.match(tekst, /bestilling-opprettet/u);
  assert.match(tekst, /ko-tom/u);
  assert.match(tekst, /2/u);
  assert.match(tekst, /Ytelsesrader[^\n]*4/u);
  assert.doesNotMatch(tekst, new RegExp(HEMMELIG, 'u'));
  assert.doesNotMatch(tekst, /999|88|500/u);
});

test('mandagsrapport bruker bare radantallet fra privat ytelse', () => {
  const tekst = lagRapporttekst(new URL('../', import.meta.url), '2026-11-09', {
    ytelse: [{ dato: '2026-11-09', antall: 4, klikk: 7654321, visninger: 9876543 }],
  });

  assert.match(tekst, /Ytelsesrader[^\n]*4/u);
  assert.doesNotMatch(tekst, /7654321|9876543/u);
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

test('rapport-CLI skjuler rå feil fra gh', (t) => {
  const mappe = mkdtempSync(join(tmpdir(), 'matlyst-seo-rapport-'));
  t.after(() => rmSync(mappe, { recursive: true, force: true }));
  const gh = join(mappe, 'gh');
  writeFileSync(gh, '#!/bin/sh\necho "SÆRPREGET RÅ GH-FEIL" >&2\nexit 1\n');
  chmodSync(gh, 0o755);
  const nokkel = readFileSync(
    new URL('../seo-motor/test/fixtures/seo-data-nokkel.txt', import.meta.url),
    'utf8',
  ).trim();

  const resultat = spawnSync(process.execPath, ['seo-motor/rapport.mjs'], {
    cwd: new URL('../', import.meta.url),
    env: {
      ...process.env,
      DATO: '2026-11-09',
      SEO_DATA_NOKKEL: nokkel,
      PATH: `${mappe}:${process.env.PATH}`,
    },
    encoding: 'utf8',
  });

  assert.equal(resultat.status, 1);
  assert.match(resultat.stdout, /rapport-feil/u);
  assert.doesNotMatch(`${resultat.stdout}\n${resultat.stderr}`, /SÆRPREGET RÅ GH-FEIL/u);
});

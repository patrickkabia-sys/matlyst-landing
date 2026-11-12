import assert from 'node:assert/strict';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';

import {
  avvis,
  levering,
  pushfeil,
  rapporter,
  ukekostnad,
} from '../seo-motor/etterbehandle.mjs';

function skrivJson(fil, data) {
  mkdirSync(join(fil, '..'), { recursive: true });
  writeFileSync(fil, `${JSON.stringify(data, null, 2)}\n`);
}

function lesJson(fil) {
  return JSON.parse(readFileSync(fil, 'utf8'));
}

function lagRot(t) {
  const mappe = mkdtempSync(join(tmpdir(), 'matlyst-seo-etterbehandle-'));
  t.after(() => rmSync(mappe, { recursive: true, force: true }));
  cpSync(new URL('../seo-data/sprak/', import.meta.url), join(mappe, 'seo-data', 'sprak'), { recursive: true });
  return { mappe, rot: pathToFileURL(`${mappe}/`) };
}

test('avvis flytter artikkelen, renser publisert og oppdaterer loggen', (t) => {
  const { mappe, rot } = lagRot(t);
  const artikkel = { slug: 'god-pasta', sprak: 'nb', tittel: 'God pasta' };
  const artikkelfil = join(mappe, 'blogg-kilde', 'auto', 'nb', 'god-pasta.json');
  skrivJson(artikkelfil, artikkel);
  skrivJson(join(mappe, 'seo-data', 'publisert.json'), [
    { slug: 'behold-meg' },
    { slug: 'god-pasta' },
  ]);
  skrivJson(join(mappe, 'seo-data', 'logg', '2026-11-12.json'), {
    dato: '2026-11-12',
    resultat: 'publisert',
    sti: '/blogg/god-pasta/',
  });

  avvis(rot, { byggutfall: 'failure', dato: '2026-11-12', slug: 'god-pasta' });

  assert.equal(existsSync(artikkelfil), false);
  assert.deepEqual(lesJson(join(mappe, 'seo-data', 'avvist', '2026-11-12-god-pasta.json')), {
    artikkel,
    grunner: ['nettstedbygget feilet'],
  });
  assert.deepEqual(lesJson(join(mappe, 'seo-data', 'publisert.json')), [{ slug: 'behold-meg' }]);
  assert.deepEqual(lesJson(join(mappe, 'seo-data', 'logg', '2026-11-12.json')), {
    dato: '2026-11-12',
    resultat: 'avvist',
    grunner: ['nettstedbygget feilet'],
  });
});

test('tredje avvisning på rad sperrer autopiloten', (t) => {
  const { mappe, rot } = lagRot(t);
  skrivJson(join(mappe, 'seo-data', 'publisert.json'), [{ slug: 'god-pasta' }]);
  skrivJson(join(mappe, 'seo-data', 'logg', '2026-11-10.json'), { dato: '2026-11-10', resultat: 'avvist' });
  skrivJson(join(mappe, 'seo-data', 'logg', '2026-11-11.json'), { dato: '2026-11-11', resultat: 'avvist' });
  skrivJson(join(mappe, 'seo-data', 'logg', '2026-11-12.json'), {
    dato: '2026-11-12',
    resultat: 'publisert',
    sti: '/blogg/god-pasta/',
  });

  avvis(rot, { byggutfall: 'success', dato: '2026-11-12', slug: 'god-pasta' });

  assert.deepEqual(lesJson(join(mappe, 'seo-data', 'sperre.json')), {
    dato: '2026-11-12',
    grunn: 'tre avvisninger på rad',
  });
  assert.deepEqual(lesJson(join(mappe, 'seo-data', 'logg', '2026-11-12.json')), {
    dato: '2026-11-12',
    resultat: 'sperret',
    grunner: ['npm test feilet', 'tre avvisninger på rad'],
  });
});

test('levering markerer feilet utkast-PR og fjerner publisert-raden', (t) => {
  const { mappe, rot } = lagRot(t);
  skrivJson(join(mappe, 'seo-data', 'publisert.json'), [{ slug: 'behold-meg' }, { slug: 'god-pasta' }]);
  skrivJson(join(mappe, 'seo-data', 'logg', '2026-11-12.json'), { dato: '2026-11-12', resultat: 'publisert' });

  levering(rot, {
    dato: '2026-11-12',
    modus: 'utkast',
    prutfall: 'failure',
    prUrl: '',
    publiseringsutfall: '',
    slug: 'god-pasta',
  });

  assert.deepEqual(lesJson(join(mappe, 'seo-data', 'publisert.json')), [{ slug: 'behold-meg' }]);
  assert.deepEqual(lesJson(join(mappe, 'seo-data', 'logg', '2026-11-12.json')), {
    dato: '2026-11-12',
    resultat: 'feil',
    grunner: ['oppretting av utkast-PR feilet'],
  });
});

test('levering markerer feilet publisering i på-modus', (t) => {
  const { mappe, rot } = lagRot(t);
  skrivJson(join(mappe, 'seo-data', 'publisert.json'), [{ slug: 'god-pasta' }]);
  skrivJson(join(mappe, 'seo-data', 'logg', '2026-11-12.json'), { dato: '2026-11-12', resultat: 'publisert' });

  levering(rot, {
    dato: '2026-11-12',
    modus: 'på',
    prutfall: '',
    prUrl: '',
    publiseringsutfall: 'failure',
    slug: 'god-pasta',
  });

  assert.deepEqual(lesJson(join(mappe, 'seo-data', 'publisert.json')), [{ slug: 'god-pasta' }]);
  assert.deepEqual(lesJson(join(mappe, 'seo-data', 'logg', '2026-11-12.json')), {
    dato: '2026-11-12',
    resultat: 'feil',
    grunner: ['push til main feilet'],
  });
});

test('levering med PR-url gir resultat utkast', (t) => {
  const { mappe, rot } = lagRot(t);
  skrivJson(join(mappe, 'seo-data', 'publisert.json'), [{ slug: 'god-pasta' }]);
  skrivJson(join(mappe, 'seo-data', 'logg', '2026-11-12.json'), { dato: '2026-11-12', resultat: 'publisert' });

  levering(rot, {
    dato: '2026-11-12',
    modus: 'utkast',
    prutfall: 'success',
    prUrl: 'https://github.com/matlyst/landing/pull/42',
    publiseringsutfall: '',
    slug: 'god-pasta',
  });

  assert.deepEqual(lesJson(join(mappe, 'seo-data', 'logg', '2026-11-12.json')), {
    dato: '2026-11-12',
    resultat: 'utkast',
    prUrl: 'https://github.com/matlyst/landing/pull/42',
  });
});

test('pushfeil skiller artikkelpublisering fra ren driftsstatus', (t) => {
  const { mappe, rot } = lagRot(t);
  skrivJson(join(mappe, 'seo-data', 'logg', '2026-11-12.json'), { dato: '2026-11-12', resultat: 'publisert' });

  pushfeil(rot, { dato: '2026-11-12', modus: 'på', motorresultat: 'publisert' });

  assert.deepEqual(lesJson(join(mappe, 'seo-data', 'logg', '2026-11-12.json')), {
    dato: '2026-11-12',
    resultat: 'feil',
    grunner: ['push av artikkel og driftsstatus feilet'],
  });

  pushfeil(rot, { dato: '2026-11-12', modus: 'utkast', motorresultat: 'publisert' });

  assert.deepEqual(lesJson(join(mappe, 'seo-data', 'logg', '2026-11-12.json')), {
    dato: '2026-11-12',
    resultat: 'feil',
    grunner: ['push av driftsstatus feilet'],
  });
});

test('ukekostnad summerer bare de siste sju dagene til og med sluttdatoen', (t) => {
  const { mappe, rot } = lagRot(t);
  const rader = [
    { dato: '2026-11-05', kostnadUsd: 10 },
    { dato: '2026-11-06', kostnadUsd: 0.01 },
    { dato: '2026-11-09', kostnadUsd: 0.02 },
    { dato: '2026-11-12', kostnadUsd: 0.04 },
    { dato: '2026-11-13', kostnadUsd: 20 },
  ];
  for (const rad of rader) {
    skrivJson(join(mappe, 'seo-data', 'logg', `${rad.dato}.json`), rad);
  }

  assert.equal(ukekostnad(rot, '2026-11-12'), 0.07);
});

test('mandagsrapport bruker ukekostnaden og poster gjennom rapporthjelperen', async (t) => {
  const { mappe, rot } = lagRot(t);
  skrivJson(join(mappe, 'seo-data', 'emnekø.json'), []);
  skrivJson(join(mappe, 'seo-data', 'logg', '2026-11-02.json'), {
    dato: '2026-11-02',
    modus: 'utkast',
    resultat: 'utkast',
    kostnadUsd: 10,
  });
  skrivJson(join(mappe, 'seo-data', 'logg', '2026-11-03.json'), {
    dato: '2026-11-03',
    modus: 'utkast',
    resultat: 'utkast',
    kostnadUsd: 0.03,
  });
  skrivJson(join(mappe, 'seo-data', 'logg', '2026-11-09.json'), {
    dato: '2026-11-09',
    modus: 'utkast',
    resultat: 'utkast',
    kostnadUsd: 0.04,
  });
  const kall = [];
  const gh = async (args) => {
    kall.push(args);
    return args[1] === 'list' ? '[{"number":17}]' : '';
  };

  await rapporter(rot, { dato: '2026-11-09', gh });

  assert.equal(kall.length, 2);
  assert.deepEqual(kall[0], ['issue', 'list', '--search', 'SEO-autopilot in:title', '--json', 'number']);
  assert.equal(kall[1][0], 'issue');
  assert.equal(kall[1][1], 'comment');
  assert.equal(kall[1][2], '17');
  assert.match(kall[1][4], /SEO-autopilot – ukesrapport/u);
  assert.match(kall[1][4], /\$0\.070/u);
  assert.doesNotMatch(kall[1][4], /\$10\.070/u);
});

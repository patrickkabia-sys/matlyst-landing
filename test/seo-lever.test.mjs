import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
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

import { artikkelSha256, lever } from '../seo-motor/lever.mjs';
import { lesPrivat, skrivPrivat, tomPrivatTilstand } from '../seo-motor/privat.mjs';

const FIXTURER = new URL('../seo-motor/test/fixtures/lever/', import.meta.url);
const TESTNOKKEL = readFileSync(
  new URL('../seo-motor/test/fixtures/seo-data-nokkel.txt', import.meta.url),
  'utf8',
).trim();

function skrivJson(fil, data) {
  mkdirSync(join(fil, '..'), { recursive: true });
  writeFileSync(fil, `${JSON.stringify(data, null, 2)}\n`);
}

function sha256(fil) {
  return createHash('sha256').update(readFileSync(fil)).digest('hex');
}

function lagRot(t, {
  beslutning = 'GODKJENT',
  grunner = [],
  gransking = true,
  publisert = [],
  tidligereAvvisninger = [],
} = {}) {
  const mappe = mkdtempSync(join(tmpdir(), 'matlyst-seo-lever-'));
  t.after(() => rmSync(mappe, { recursive: true, force: true }));
  const rot = pathToFileURL(`${mappe}/`);
  cpSync(new URL('../seo-data/sprak/', import.meta.url), join(mappe, 'seo-data', 'sprak'), { recursive: true });
  cpSync(new URL('../seo-data/forbudt.json', import.meta.url), join(mappe, 'seo-data', 'forbudt.json'));
  cpSync(new URL('../seo-data/kilder.json', import.meta.url), join(mappe, 'seo-data', 'kilder.json'));
  skrivJson(join(mappe, 'seo-data', 'grenser.json'), {
    tittelMaksTegn: 60,
    metaMinTegn: 120,
    metaMaksTegn: 160,
    brodtekstMinOrd: 20,
    brodtekstMaksOrd: 1200,
    seksjonerMin: 3,
    seksjonerMaks: 6,
    faqMin: 3,
    faqMaks: 5,
    overlappMaks: 0.5,
    artiklerMaksPerUke: 7,
  });
  skrivJson(join(mappe, 'seo-data', 'publisert.json'), publisert);
  for (const dato of tidligereAvvisninger) {
    skrivJson(join(mappe, 'seo-data', 'logg', `${dato}.json`), {
      dato,
      modus: 'lokal',
      resultat: 'avvist',
      statuskode: 'gransking-avvist',
      grunnkoder: ['gransking-avvist'],
      antall: { avvist: 1 },
    });
  }
  if (tidligereAvvisninger.length > 0) {
    skrivJson(join(mappe, 'seo-data', 'logg', 'avvisningsrekke.json'), {
      dato: tidligereAvvisninger.at(-1),
      modus: 'lokal',
      resultat: 'avvist-rekke',
      statuskode: 'avvisning-registrert',
      grunnkoder: [],
      antall: { avvist: tidligereAvvisninger.length },
    });
  }
  const bestillingFil = join(mappe, 'seo-data', 'bestillinger', '2026-11-12-nb-bruk-rester-i-middag.json');
  const artikkelFil = join(mappe, 'artikkel.json');
  const granskingFil = join(mappe, 'gransking.json');
  cpSync(new URL('bestilling.json', FIXTURER), bestillingFil);
  cpSync(new URL('artikkel.json', FIXTURER), artikkelFil);
  if (gransking) {
    skrivJson(granskingFil, {
      beslutning,
      grunner,
      artikkel_sha256: sha256(artikkelFil),
    });
  }
  skrivPrivat(new URL('seo-data/privat.enc', rot), {
    ...tomPrivatTilstand(),
    emneko: [{ id: 'e-a1b2c3d4e5f60708', sokeord: 'HEMMELIG RÅSØK', score: 90 }],
  }, TESTNOKKEL);
  writeFileSync(join(mappe, 'index.html'), '<title>Matlyst</title><meta name="description" content="Forsiden"><body>Matlyst</body>');
  writeFileSync(join(mappe, 'sitemap.xml'), '<?xml version="1.0"?><urlset><url><loc>https://matlyst-app.no/</loc></url></urlset>');
  return { mappe, rot, bestillingFil, artikkelFil, granskingFil };
}

function hentKilde() {
  return {
    status: 200,
    tekst: readFileSync(new URL('kilde.html', FIXTURER), 'utf8'),
  };
}

test('artikkelSha256 hasher de eksakte filbytene', (t) => {
  const { artikkelFil } = lagRot(t);

  assert.equal(artikkelSha256(artikkelFil), sha256(artikkelFil));
  assert.match(artikkelSha256(artikkelFil), /^[a-f0-9]{64}$/u);
});

test('grønn levering skriver bloggkilde og driftsstatus og sletter bestillingen', async (t) => {
  const { mappe, rot, bestillingFil, artikkelFil, granskingFil } = lagRot(t);

  const resultat = await lever({
    bestillingFil,
    artikkelFil,
    granskingFil,
    rot,
    nokkel: TESTNOKKEL,
    hent: async () => hentKilde(),
    tid: new Date('2026-11-12T10:00:00Z'),
  });

  assert.deepEqual(resultat, { exitCode: 0, statuskode: 'levert', slug: 'bruk-rester-i-middag' });
  assert.equal(existsSync(bestillingFil), false);
  const lagret = JSON.parse(readFileSync(join(
    mappe,
    'blogg-kilde',
    'auto',
    'nb',
    'bruk-rester-i-middag.json',
  )));
  assert.equal(lagret.publisert, '2026-11-12');
  assert.deepEqual(lagret.kilder, [{
    id: 'mattilsynet',
    url: 'https://www.mattilsynet.no/mat-og-drikke',
    tekst: 'Følg de offisielle rådene når du vurderer oppbevarte rester.',
  }]);
  const publisert = JSON.parse(readFileSync(join(mappe, 'seo-data', 'publisert.json')));
  assert.deepEqual(publisert, [{
    dato: '2026-11-12',
    emne_id: 'e-a1b2c3d4e5f60708',
    sprak: 'nb',
    slug: 'bruk-rester-i-middag',
    sti: '/blogg/bruk-rester-i-middag/',
  }]);
  assert.deepEqual(lesPrivat(new URL('seo-data/privat.enc', rot), TESTNOKKEL).emneko, []);
});

test('levering avviser når ukesgrensen er nådd', async (t) => {
  const publisert = Array.from({ length: 7 }, (_, indeks) => ({
    dato: `2026-11-${String(9 + (indeks % 3)).padStart(2, '0')}`,
    emne_id: `e-publisert-${indeks}`,
    sprak: 'nb',
    slug: `publisert-${indeks}`,
    sti: `/blogg/publisert-${indeks}/`,
  }));
  const { mappe, rot, bestillingFil, artikkelFil, granskingFil } = lagRot(t, { publisert });

  const resultat = await lever({
    bestillingFil,
    artikkelFil,
    granskingFil,
    rot,
    nokkel: TESTNOKKEL,
    hent: async () => hentKilde(),
    tid: new Date('2026-11-12T10:00:00Z'),
  });

  assert.equal(resultat.exitCode, 1);
  assert.equal(resultat.statuskode, 'ukentlig-grense');
  assert.equal(existsSync(bestillingFil), true);
  assert.equal(existsSync(join(mappe, 'blogg-kilde', 'auto', 'nb', 'bruk-rester-i-middag.json')), false);
});

test('manglende gransking stopper levering og beholder bestillingen', async (t) => {
  const { mappe, rot, bestillingFil, artikkelFil, granskingFil } = lagRot(t, { gransking: false });

  const resultat = await lever({
    bestillingFil,
    artikkelFil,
    granskingFil,
    rot,
    nokkel: TESTNOKKEL,
    hent: async () => hentKilde(),
    tid: new Date('2026-11-12T10:00:00Z'),
  });

  assert.equal(resultat.exitCode, 1);
  assert.equal(resultat.statuskode, 'gransking-mangler');
  assert.equal(existsSync(bestillingFil), true);
  assert.equal(existsSync(join(mappe, 'seo-data', 'avvist', '2026-11-12-bruk-rester-i-middag.json')), true);
});

test('AVVIST gransking lagrer grunnene lokalt og gir exit 1', async (t) => {
  const { mappe, rot, bestillingFil, artikkelFil, granskingFil } = lagRot(t, {
    beslutning: 'AVVIST',
    grunner: ['Teksten høres oversatt ut.'],
  });

  const resultat = await lever({
    bestillingFil,
    artikkelFil,
    granskingFil,
    rot,
    nokkel: TESTNOKKEL,
    hent: async () => hentKilde(),
    tid: new Date('2026-11-12T10:00:00Z'),
  });

  assert.equal(resultat.exitCode, 1);
  assert.equal(resultat.statuskode, 'gransking-avvist');
  const avvist = JSON.parse(readFileSync(join(mappe, 'seo-data', 'avvist', '2026-11-12-bruk-rester-i-middag.json')));
  assert.equal(Object.hasOwn(avvist, 'granskingsgrunner'), false);
  assert.doesNotMatch(JSON.stringify(avvist), /HEMMELIG RÅSØK/u);
});

test('granskingsgrunn med råsøk blir ikke offentlig eller skrevet rått til terminalresultatet', async (t) => {
  const { mappe, rot, bestillingFil, artikkelFil, granskingFil } = lagRot(t, {
    beslutning: 'AVVIST',
    grunner: ['Artikkelen gjentar HEMMELIG RÅSØK ordrett.'],
  });

  const resultat = await lever({
    bestillingFil,
    artikkelFil,
    granskingFil,
    rot,
    nokkel: TESTNOKKEL,
    hent: async () => hentKilde(),
    tid: new Date('2026-11-12T10:00:00Z'),
  });

  assert.doesNotMatch(JSON.stringify(resultat), /HEMMELIG RÅSØK/u);
  assert.doesNotMatch(
    readFileSync(join(mappe, 'seo-data', 'avvist', '2026-11-12-bruk-rester-i-middag.json'), 'utf8'),
    /HEMMELIG RÅSØK/u,
  );
});

test('vernkode inneholder aldri dynamisk kilde-id', async (t) => {
  const { mappe, rot, bestillingFil, artikkelFil, granskingFil } = lagRot(t);
  const artikkel = JSON.parse(readFileSync(artikkelFil, 'utf8'));
  artikkel.pastander[0].kilde_id = 'HEMMELIG RÅSØK';
  skrivJson(artikkelFil, artikkel);
  skrivJson(granskingFil, {
    beslutning: 'GODKJENT',
    grunner: [],
    artikkel_sha256: sha256(artikkelFil),
  });

  const resultat = await lever({
    bestillingFil,
    artikkelFil,
    granskingFil,
    rot,
    nokkel: TESTNOKKEL,
    hent: async () => hentKilde(),
    tid: new Date('2026-11-12T10:00:00Z'),
  });

  assert.equal(resultat.statuskode, 'vern-ukjent-kilde-id');
  assert.doesNotMatch(JSON.stringify(resultat), /HEMMELIG RÅSØK/u);
  assert.doesNotMatch(readFileSync(join(mappe, 'seo-data', 'logg', '2026-11-12.json'), 'utf8'), /HEMMELIG RÅSØK/u);
  assert.doesNotMatch(
    readFileSync(join(mappe, 'seo-data', 'avvist', '2026-11-12-bruk-rester-i-middag.json'), 'utf8'),
    /HEMMELIG RÅSØK/u,
  );
});

test('tredje avvisning på rad skriver offentlig sperre', async (t) => {
  const { mappe, rot, bestillingFil, artikkelFil, granskingFil } = lagRot(t, {
    beslutning: 'AVVIST',
    grunner: ['Vinkelen er ikke tydelig nok.'],
    tidligereAvvisninger: ['2026-11-10', '2026-11-11'],
  });

  const resultat = await lever({
    bestillingFil,
    artikkelFil,
    granskingFil,
    rot,
    nokkel: TESTNOKKEL,
    hent: async () => hentKilde(),
    tid: new Date('2026-11-12T10:00:00Z'),
  });

  assert.equal(resultat.exitCode, 1);
  assert.deepEqual(JSON.parse(readFileSync(join(mappe, 'seo-data', 'sperre.json'))), {
    dato: '2026-11-12',
    grunnkode: 'tre-avvisninger-pa-rad',
  });
  const logg = JSON.parse(readFileSync(join(mappe, 'seo-data', 'logg', '2026-11-12.json')));
  assert.equal(logg.resultat, 'sperret');
  assert.equal(logg.statuskode, 'tre-avvisninger-pa-rad');
});

test('tre avvisninger samme dag skriver sperre', async (t) => {
  const { mappe, rot, bestillingFil, artikkelFil, granskingFil } = lagRot(t, {
    beslutning: 'AVVIST',
    grunner: ['Vinkelen er ikke tydelig nok.'],
  });

  for (let forsøk = 0; forsøk < 3; forsøk += 1) {
    await lever({
      bestillingFil,
      artikkelFil,
      granskingFil,
      rot,
      nokkel: TESTNOKKEL,
      hent: async () => hentKilde(),
      tid: new Date('2026-11-12T10:00:00Z'),
    });
  }

  assert.equal(existsSync(join(mappe, 'seo-data', 'sperre.json')), true);
  const rekke = JSON.parse(readFileSync(join(mappe, 'seo-data', 'logg', 'avvisningsrekke.json')));
  assert.equal(rekke.antall.avvist, 3);
});

test('ett endret tegn etter gransking gir gransking-gjelder-annen-versjon', async (t) => {
  const { rot, bestillingFil, artikkelFil, granskingFil } = lagRot(t);
  const artikkel = JSON.parse(readFileSync(artikkelFil, 'utf8'));
  artikkel.ingress = artikkel.ingress.replace('enkel', 'ledig');
  skrivJson(artikkelFil, artikkel);

  const resultat = await lever({
    bestillingFil,
    artikkelFil,
    granskingFil,
    rot,
    nokkel: TESTNOKKEL,
    hent: async () => hentKilde(),
    tid: new Date('2026-11-12T10:00:00Z'),
  });

  assert.equal(resultat.exitCode, 1);
  assert.equal(resultat.statuskode, 'gransking-gjelder-annen-versjon');
});

test('leverer aldri et annet minneutkast ved filbytte under kildehenting', async (t) => {
  const { mappe, rot, bestillingFil, artikkelFil, granskingFil } = lagRot(t);
  const opprinnelig = readFileSync(artikkelFil, 'utf8');
  const endret = JSON.parse(opprinnelig);
  endret.ingress = endret.ingress.replace('en enkel', 'en ryddig');
  skrivJson(artikkelFil, endret);
  const endretTekst = readFileSync(artikkelFil, 'utf8');
  skrivJson(granskingFil, {
    beslutning: 'GODKJENT',
    grunner: [],
    artikkel_sha256: sha256(artikkelFil),
  });
  writeFileSync(artikkelFil, opprinnelig);

  const resultat = await lever({
    bestillingFil,
    artikkelFil,
    granskingFil,
    rot,
    nokkel: TESTNOKKEL,
    hent: async () => {
      writeFileSync(artikkelFil, endretTekst);
      return hentKilde();
    },
    tid: new Date('2026-11-12T10:00:00Z'),
  });

  assert.equal(resultat.exitCode, 1);
  assert.equal(resultat.statuskode, 'gransking-gjelder-annen-versjon');
  assert.equal(existsSync(join(mappe, 'blogg-kilde', 'auto', 'nb', 'bruk-rester-i-middag.json')), false);
});

test('feil privat nøkkel stopper før offentlige leveringsfiler skrives', async (t) => {
  const { mappe, rot, bestillingFil, artikkelFil, granskingFil } = lagRot(t);

  const resultat = await lever({
    bestillingFil,
    artikkelFil,
    granskingFil,
    rot,
    nokkel: Buffer.alloc(32, 9).toString('base64'),
    hent: async () => hentKilde(),
    tid: new Date('2026-11-12T10:00:00Z'),
  });

  assert.deepEqual(resultat, { exitCode: 2, statuskode: 'privat-tilstand-ugyldig' });
  assert.deepEqual(JSON.parse(readFileSync(join(mappe, 'seo-data', 'publisert.json'))), []);
  assert.equal(existsSync(join(mappe, 'blogg-kilde')), false);
  assert.equal(existsSync(join(mappe, 'seo-data', 'logg')), false);
  assert.equal(existsSync(bestillingFil), true);
});

test('fast vern avviser før lag 2', async (t) => {
  const { rot, bestillingFil, artikkelFil, granskingFil } = lagRot(t);
  const artikkel = JSON.parse(readFileSync(artikkelFil, 'utf8'));
  artikkel.tittel = 'x'.repeat(61);
  skrivJson(artikkelFil, artikkel);
  skrivJson(granskingFil, {
    beslutning: 'GODKJENT',
    grunner: [],
    artikkel_sha256: sha256(artikkelFil),
  });

  const resultat = await lever({
    bestillingFil,
    artikkelFil,
    granskingFil,
    rot,
    nokkel: TESTNOKKEL,
    hent: async () => hentKilde(),
    tid: new Date('2026-11-12T10:00:00Z'),
  });

  assert.equal(resultat.exitCode, 1);
  assert.match(resultat.statuskode, /^vern-/u);
});

test('ugyldig artikkel-JSON gir exit 2 uten avvist utkast', async (t) => {
  const { mappe, rot, bestillingFil, artikkelFil, granskingFil } = lagRot(t);
  writeFileSync(artikkelFil, '{ugyldig');

  const resultat = await lever({
    bestillingFil,
    artikkelFil,
    granskingFil,
    rot,
    nokkel: TESTNOKKEL,
    hent: async () => hentKilde(),
    tid: new Date('2026-11-12T10:00:00Z'),
  });

  assert.equal(resultat.exitCode, 2);
  assert.equal(resultat.statuskode, 'ugyldig-inndata');
  assert.equal(existsSync(join(mappe, 'seo-data', 'avvist')), false);
});

test('ugyldig nested artikkelform gir exit 2 uten stackkrasj', async (t) => {
  const { mappe, rot, bestillingFil, artikkelFil, granskingFil } = lagRot(t);
  const artikkel = JSON.parse(readFileSync(artikkelFil, 'utf8'));
  artikkel.seksjoner = 1;
  skrivJson(artikkelFil, artikkel);

  const resultat = await lever({
    bestillingFil,
    artikkelFil,
    granskingFil,
    rot,
    nokkel: TESTNOKKEL,
    hent: async () => hentKilde(),
    tid: new Date('2026-11-12T10:00:00Z'),
  });

  assert.deepEqual(resultat, { exitCode: 2, statuskode: 'ugyldig-inndata' });
  assert.equal(existsSync(join(mappe, 'seo-data', 'avvist')), false);
});

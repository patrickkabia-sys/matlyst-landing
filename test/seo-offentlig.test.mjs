import assert from 'node:assert/strict';
import {
  mkdtempSync,
  readFileSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';

import {
  lesOffentlig,
  OffentligTilstandFeil,
  skrivOffentlig,
  validerOffentlig,
} from '../seo-motor/offentlig.mjs';

const dokumenter = {
  publisert: [{
    dato: '2026-11-12',
    emne_id: 'e-a1b2c3d4e5f6',
    sprak: 'nb',
    slug: 'bruk-rester-i-middag',
    sti: '/blogg/bruk-rester-i-middag/',
  }],
  logg: {
    dato: '2026-11-12',
    modus: 'utkast',
    resultat: 'bestilling',
    statuskode: 'bestilling-opprettet',
    grunnkoder: [],
    sprak: 'nb',
    slug: 'bruk-rester-i-middag',
    bestilling_id: '2026-11-12-nb-bruk-rester-i-middag',
    antall: { gsc: 4, forslag: 8, ko: 2, bestillinger: 1 },
  },
  bestilling: {
    dato: '2026-11-12',
    sprak: 'nb',
    emne_id: 'e-a1b2c3d4e5f6',
    slug: 'bruk-rester-i-middag',
    emne: 'Praktiske måter å bruke rester i nye måltider.',
    vinkel: 'Hjelp leseren å planlegge et konkret restemåltid.',
    appkoblinger: ['bruk-det-jeg-har'],
    kilde_ider: ['mattilsynet'],
    krav: {
      ord_min: 600,
      ord_maks: 1200,
      seksjoner_min: 3,
      seksjoner_maks: 6,
      faq_min: 3,
      faq_maks: 5,
      sprakregler_ref: 'seo-data/sprak/nb.json',
    },
  },
  avvist: {
    dato: '2026-11-12',
    sprak: 'nb',
    slug: 'bruk-rester-i-middag',
    emne_id: 'e-a1b2c3d4e5f6',
    grunnkoder: ['gransking-avvist'],
    artikkel: {
      sprak: 'nb',
      emne_id: 'e-a1b2c3d4e5f6',
      slug: 'bruk-rester-i-middag',
      tittel: 'Bruk restene i en ny middag',
      meta: 'x'.repeat(120),
      ingress: 'Begynn med restene du har.',
      seksjoner: [{ type: 'avsnitt', overskrift: 'Se over restene', tekst: 'Bruk maten.' }],
      faq: [{ sporsmal: 'Hva starter jeg med?', svar: 'Se hva du har.' }],
      pastander: [{ tekst: 'Følg kilderådet.', kilde_id: 'mattilsynet' }],
      appkobling: 'bruk-det-jeg-har',
      tagger: ['rester'],
      kilder: [{ id: 'mattilsynet', url: 'https://www.mattilsynet.no/' }],
      lenker: [{ sti: '/hva-kan-jeg-lage/', tittel: 'Bruk det du har' }],
    },
  },
  sperre: {
    dato: '2026-11-12',
    grunnkode: 'tre-avvisninger-pa-rad',
  },
};

test('alle offentlige dokumenttyper godtar bare sine driftsfelt', () => {
  for (const [type, data] of Object.entries(dokumenter)) {
    assert.doesNotThrow(() => validerOffentlig(type, data), type);
  }
});

test('søkeord og måledata avvises rekursivt i offentlig tilstand', () => {
  for (const nøkkel of ['sokeord', 'søkeord', 'klikk', 'visninger', 'score', 'poeng', 'volum']) {
    const data = structuredClone(dokumenter.avvist);
    data.artikkel[nøkkel] = 'SÆRPREGET HEMMELIG VERDI';
    assert.throws(
      () => validerOffentlig('avvist', data),
      (feil) => feil instanceof OffentligTilstandFeil
        && feil.kode === 'offentlig-tilstand-ugyldig',
      nøkkel,
    );
  }
});

test('ukjente nøkler avvises i bestilling og krav', () => {
  const medRåttSøk = { ...dokumenter.bestilling, raw_query: 'hemmelig' };
  const medUkjentKrav = structuredClone(dokumenter.bestilling);
  medUkjentKrav.krav.ukjent_felt = 10;

  assert.throws(() => validerOffentlig('bestilling', medRåttSøk), OffentligTilstandFeil);
  assert.throws(() => validerOffentlig('bestilling', medUkjentKrav), OffentligTilstandFeil);
});

test('offentlig skriveport validerer og skriver riktig mappe', (t) => {
  const mappe = mkdtempSync(join(tmpdir(), 'matlyst-seo-offentlig-'));
  t.after(() => rmSync(mappe, { recursive: true, force: true }));
  const rot = pathToFileURL(`${mappe}/`);

  const fil = skrivOffentlig(rot, 'bestilling', '2026-11-12-nb-bruk-rester-i-middag.json', dokumenter.bestilling);

  assert.deepEqual(lesOffentlig(fil, null), dokumenter.bestilling);
  assert.deepEqual(
    JSON.parse(readFileSync(join(mappe, 'seo-data', 'bestillinger', '2026-11-12-nb-bruk-rester-i-middag.json'))),
    dokumenter.bestilling,
  );
  assert.throws(
    () => skrivOffentlig(rot, 'logg', '../utenfor.json', dokumenter.logg),
    OffentligTilstandFeil,
  );
});

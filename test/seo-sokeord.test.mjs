import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';

import { lesData } from '../seo-motor/skjema.mjs';
import { byggKo, lagBestilling } from '../seo-motor/sokeord.mjs';

const tomtNettsted = { sider: [] };
const forbudt = {
  domener: ['matprat.no', 'godt.no', 'nom.no'],
  navn: ['Matprat', 'Godt.no', 'Nom'],
  helseord: { nb: ['kalorier'] },
};
const frø = {
  tekst: 'middag med rester',
  passform: 3,
  tagger: ['rester', 'middag'],
  appkobling: 'bruk-det-jeg-har',
  tema: 'rester i nye måltider',
  vinkel: 'bruke det som finnes hjemme før nye varer kjøpes',
  slug: 'bruk-rester-i-middag',
  kilde_ider: ['mattilsynet'],
};
const språkfiler = {
  nb: {
    'forslagsfrø': [frø],
    bestillingsmal: {
      emne: 'En praktisk veiledning om {{tema}}.',
      vinkel: 'Vis hvordan leseren kan {{vinkel}}.',
    },
  },
};
const EMNE_ID_NOKKEL = Buffer.alloc(32, 7);

function byggEmne(sokeord, emneIdNokkel = EMNE_ID_NOKKEL) {
  return byggKo({
    kandidater: [{
      sokeord,
      sprak: 'nb',
      frø,
      forslagAntall: 1,
      kilde: 'forslag',
    }],
    språkfiler,
    nettsted: tomtNettsted,
    forbudt,
    brukt: [],
    emneIdNokkel,
  }).ko[0];
}

test('emne-id er ikke den forutsigbare sha256-avledningen av råsøket', () => {
  const sokeord = 'middag med rester';
  const gammelId = `e-${createHash('sha256')
    .update(`nb\0${sokeord}`, 'utf8')
    .digest('hex')
    .slice(0, 16)}`;

  assert.equal(byggEmne(sokeord).id, 'e-3a615ba50043beb5');
  assert.notEqual(byggEmne(sokeord).id, gammelId);
});

test('samme emne-id-nøkkel og samme normaliserte søk gir samme id', () => {
  assert.equal(
    byggEmne('  MIDDAG MED RESTER  ').id,
    byggEmne('middag med rester').id,
  );
});

test('en annen emne-id-nøkkel gir en annen id', () => {
  assert.notEqual(
    byggEmne('middag med rester', EMNE_ID_NOKKEL).id,
    byggEmne('middag med rester', Buffer.alloc(32, 8)).id,
  );
});

test('score er passform ganger forslagantall eller GSC-visninger', () => {
  const kandidater = [
    {
      sokeord: 'middag av rester',
      sprak: 'nb',
      frø,
      forslagAntall: 7,
      kilde: 'forslag',
    },
    {
      sokeord: 'rester til middag',
      land: 'nor',
      visninger: 11,
      plassering: 12,
      kilde: 'gsc',
    },
  ];

  const resultat = byggKo({
    kandidater,
    språkfiler,
    nettsted: tomtNettsted,
    forbudt,
    brukt: [],
    emneIdNokkel: EMNE_ID_NOKKEL,
  });

  assert.equal(resultat.ko.length, 1);
  assert.equal(resultat.ko[0].sokeord, 'rester til middag');
  assert.equal(resultat.ko[0].passform, 3);
  assert.equal(resultat.ko[0].proxy, 11);
  assert.equal(resultat.ko[0].score, 33);
  assert.match(resultat.ko[0].id, /^e-[a-f0-9]{16}$/u);
});

test('GSC-plassering utenfor 8–30 og forbudt innhold forkastes', () => {
  const kandidater = [
    { sokeord: 'middag med rester', land: 'nor', visninger: 20, plassering: 7, kilde: 'gsc' },
    { sokeord: 'Matprat middag med rester', land: 'nor', visninger: 20, plassering: 12, kilde: 'gsc' },
    { sokeord: 'kalorier i middag med rester', land: 'nor', visninger: 20, plassering: 12, kilde: 'gsc' },
  ];

  const resultat = byggKo({
    kandidater,
    språkfiler,
    nettsted: tomtNettsted,
    forbudt,
    brukt: [],
    emneIdNokkel: EMNE_ID_NOKKEL,
  });

  assert.deepEqual(resultat.ko, []);
});

test('overlapp med eksisterende side går ikke i kø', () => {
  const kandidat = {
    sokeord: 'middag med rester',
    sprak: 'nb',
    frø,
    forslagAntall: 9,
    kilde: 'forslag',
  };

  const resultat = byggKo({
    kandidater: [kandidat],
    språkfiler,
    nettsted: { sider: [{ tittel: 'Middag med rester' }] },
    forbudt,
    brukt: [],
    emneIdNokkel: EMNE_ID_NOKKEL,
  });

  assert.deepEqual(resultat.ko, []);
});

test('bestillingen generaliserer emnet uten råsøk eller måledata', () => {
  const emne = byggKo({
    kandidater: [{
      sokeord: 'SÆRPREGET råsøk om gårsdagens ris',
      sprak: 'nb',
      frø,
      forslagAntall: 10,
      kilde: 'forslag',
    }],
    språkfiler,
    nettsted: tomtNettsted,
    forbudt,
    brukt: [],
    emneIdNokkel: EMNE_ID_NOKKEL,
  }).ko[0];

  const bestilling = lagBestilling(emne, språkfiler.nb, {
    brodtekstMinOrd: 600,
    brodtekstMaksOrd: 1200,
    seksjonerMin: 3,
    seksjonerMaks: 6,
    faqMin: 3,
    faqMaks: 5,
  }, '2026-11-12');
  const offentlig = JSON.stringify(bestilling);

  assert.deepEqual(bestilling, {
    dato: '2026-11-12',
    sprak: 'nb',
    emne_id: emne.id,
    slug: 'bruk-rester-i-middag',
    emne: 'En praktisk veiledning om rester i nye måltider.',
    vinkel: 'Vis hvordan leseren kan bruke det som finnes hjemme før nye varer kjøpes.',
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
  });
  assert.doesNotMatch(offentlig, /SÆRPREGET|råsøk|forslagAntall|visninger|score/u);
});

test('publisert generalisert slug sperrer nye råsøk fra samme tema', () => {
  const resultat = byggKo({
    kandidater: [{
      sokeord: 'middag med rester på ny måte',
      sprak: 'nb',
      kilde: 'forslag',
      forslagAntall: 5,
    }],
    språkfiler,
    nettsted: tomtNettsted,
    forbudt,
    brukt: [{ emne_id: 'e-annen-sporring', sprak: 'nb', slug: 'bruk-rester-i-middag' }],
    emneIdNokkel: EMNE_ID_NOKKEL,
  });

  assert.deepEqual(resultat.ko, []);
});

test('alle språk har 8–12 innfødte frø med deterministisk metadata', () => {
  for (const sprak of ['nb', 'sv', 'da', 'en']) {
    const språkfil = lesData(`sprak/${sprak}.json`);
    const forslagFrø = språkfil['forslagsfrø'];
    assert.ok(forslagFrø.length >= 8 && forslagFrø.length <= 12, sprak);
    assert.ok(språkfil.forslagslokale.hl, sprak);
    assert.ok(språkfil.forslagslokale.gl, sprak);
    assert.ok(språkfil.bestillingsmal.emne.includes('{{tema}}'), sprak);
    assert.ok(språkfil.bestillingsmal.vinkel.includes('{{vinkel}}'), sprak);
    for (const metadata of forslagFrø) {
      assert.ok(metadata.tekst && metadata.tema && metadata.vinkel && metadata.slug, sprak);
      assert.ok([1, 2, 3].includes(metadata.passform), sprak);
      assert.ok(metadata.tagger.length > 0 && metadata.appkobling, sprak);
      assert.ok(Array.isArray(metadata.kilde_ider), sprak);
    }
  }
});

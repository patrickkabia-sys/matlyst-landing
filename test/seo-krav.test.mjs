import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import * as skjema from '../seo-motor/skjema.mjs';
import { byggKo, lagBestilling } from '../seo-motor/sokeord.mjs';
import { velgEmne } from '../seo-motor/velg.mjs';
import { sjekkFast } from '../seo-motor/vern.mjs';

const fixture = (navn) => JSON.parse(readFileSync(
  new URL(`../seo-motor/test/fixtures/lever/${navn}.json`, import.meta.url), 'utf8',
));
const grenser = skjema.lesData('grenser.json');
const sprakfiler = Object.fromEntries(['nb', 'sv', 'da', 'en'].map((sprak) => [
  sprak, skjema.lesData(`sprak/${sprak}.json`),
]));
const kontekst = {
  nettsted: { sider: [], stier: new Set() },
  forbudt: { domener: [], navn: [] },
  sprakfiler,
  grenser,
};

function bestilling(krav = {}) {
  const grunnlag = fixture('bestilling');
  return { ...grunnlag, krav: { ...grunnlag.krav, ord_min: 600, ...krav } };
}

function artikkel(antallOrd, seksjoner = 3, faq = 3) {
  const grunnlag = fixture('artikkel');
  grunnlag.kilder = [{ id: 'mattilsynet', url: 'https://www.mattilsynet.no/mat-og-drikke' }];
  grunnlag.seksjoner = Array.from({ length: seksjoner }, (_, indeks) => ({
    type: 'avsnitt',
    overskrift: 'Middag',
    tekst: Array.from({ length: indeks === 0 ? antallOrd - seksjoner * 2 + 1 : 1 }, () => 'du').join(' '),
  }));
  grunnlag.faq = Array.from({ length: faq }, () => grunnlag.faq[0]);
  assert.equal(grunnlag.seksjoner.flatMap(({ overskrift, tekst }) => [overskrift, tekst])
    .join(' ').split(' ').length, antallOrd);
  return grunnlag;
}

test('bestilling med 3200 ord godtar 3000 og avviser 3300', () => {
  const kontekstMedBestilling = { ...kontekst, bestilling: bestilling({ ord_maks: 3200 }) };
  assert.deepEqual(sjekkFast(artikkel(3000), kontekstMedBestilling), { ok: true, grunner: [] });
  assert.deepEqual(sjekkFast(artikkel(3300), kontekstMedBestilling), {
    ok: false, grunner: ['skjema: brødtekst'],
  });
  assert.deepEqual(sjekkFast(artikkel(3000), kontekst), {
    ok: false, grunner: ['skjema: brødtekst'],
  });
});

test('vern bruker bestillingens minste ordantall', () => {
  assert.deepEqual(sjekkFast(artikkel(700), {
    ...kontekst, bestilling: bestilling({ ord_min: 800 }),
  }), { ok: false, grunner: ['skjema: brødtekst'] });
});

test('vern bruker bestillingens seksjonsgrenser og FAQ-grenser', () => {
  const kontekstMedBestilling = { ...kontekst, bestilling: bestilling({
    seksjoner_min: 7, seksjoner_maks: 8, faq_min: 6, faq_maks: 7,
  }) };
  assert.deepEqual(sjekkFast(artikkel(700, 8, 7), kontekstMedBestilling), { ok: true, grunner: [] });
  for (const [seksjoner, faq, felt] of [[6, 6, 'seksjoner'], [9, 6, 'seksjoner'], [7, 5, 'faq'], [7, 8, 'faq']]) {
    assert.deepEqual(sjekkFast(artikkel(700, seksjoner, faq), kontekstMedBestilling), {
      ok: false, grunner: [`skjema: ${felt}`],
    });
  }
});

test('globale strukturgrenser gjelder uten bestilling', () => {
  for (const [seksjoner, faq, felt] of [[2, 3, 'seksjoner'], [7, 3, 'seksjoner'], [3, 2, 'faq'], [3, 6, 'faq']]) {
    assert.deepEqual(sjekkFast(artikkel(700, seksjoner, faq), kontekst), {
      ok: false, grunner: [`skjema: ${felt}`],
    });
  }
});

test('bestilling kan senke seksjonsminimum og be om ingen FAQ', () => {
  assert.deepEqual(sjekkFast(artikkel(700, 1, 0), { ...kontekst, bestilling: bestilling({
    seksjoner_min: 1, seksjoner_maks: 1, faq_min: 0, faq_maks: 0,
  }) }), { ok: true, grunner: [] });
});

test('bestilling og artikkel godtas på de absolutte takene', () => {
  const ordre = bestilling({ ord_maks: 4500, seksjoner_maks: 14, faq_maks: 10 });
  assert.equal(skjema.BestillingSkjema.safeParse(ordre).success, true);
  assert.deepEqual(sjekkFast(artikkel(4500, 14, 10), { ...kontekst, bestilling: ordre }), {
    ok: true, grunner: [],
  });
});

for (const [felt, verdi, tak] of [['ord_maks', 4501, 4500], ['seksjoner_maks', 15, 14], ['faq_maks', 11, 10]]) {
  test(`bestillingsskjema avviser ${felt} over absolutt tak med norsk feil`, () => {
    const resultat = skjema.BestillingSkjema.safeParse(bestilling({ [felt]: verdi }));
    assert.equal(resultat.success, false);
    assert.ok(resultat.error.issues.some((problem) => problem.path.join('.') === `krav.${felt}`
      && problem.message.includes(`kan ikke være større enn ${tak}`)));
  });
}

for (const [ord, seksjoner, faq, felt] of [[4501, 3, 3, 'brødtekst'], [700, 15, 3, 'seksjoner'], [700, 3, 11, 'faq']]) {
  test(`vern avviser ${felt} over absolutt tak selv med feil bestilling`, () => {
    const romsligeGrenser = { ...grenser, brodtekstMaksOrd: 9000, seksjonerMaks: 30, faqMaks: 30 };
    const ordre = bestilling({ ord_maks: 9000, seksjoner_maks: 30, faq_maks: 30 });
    for (const valgtBestilling of [ordre, undefined]) {
      assert.deepEqual(sjekkFast(artikkel(ord, seksjoner, faq), {
        ...kontekst, grenser: romsligeGrenser, bestilling: valgtBestilling,
      }), { ok: false, grunner: [`skjema: ${felt}`] });
    }
  });
}

for (const [min, maks] of [['ord_min', 'ord_maks'], ['seksjoner_min', 'seksjoner_maks'], ['faq_min', 'faq_maks']]) {
  test(`bestillingsskjema avviser ${min} større enn ${maks}`, () => {
    const resultat = skjema.BestillingSkjema.safeParse(bestilling({ [min]: 5, [maks]: 4 }));
    assert.equal(resultat.success, false);
    assert.match(resultat.error.message, /minimum kan ikke være større enn maksimum/u);
    assert.equal(skjema.BestillingSkjema.safeParse(bestilling({ [min]: 4, [maks]: 4 })).success, true);
  });
}

const fro = {
  tekst: 'middag med rester', passform: 3, tagger: ['rester', 'middag'],
  appkobling: 'bruk-det-jeg-har', tema: 'rester i nye måltider',
  vinkel: 'bruke det som finnes hjemme før nye varer kjøpes',
  slug: 'bruk-rester-i-middag', kilde_ider: ['mattilsynet'],
};

function ko(kandidat = {}) {
  return byggKo({
    kandidater: [{ sokeord: fro.tekst, sprak: 'nb', frø: fro, forslagAntall: 1, ...kandidat }],
    språkfiler: sprakfiler, nettsted: kontekst.nettsted, forbudt: kontekst.forbudt,
    brukt: [], emneIdNokkel: Buffer.alloc(32, 7),
  }).ko;
}

test('lengdemål følger køelementet gjennom lagring og valg til bestillingen', () => {
  const lengdemaal = { ord_min: 1800, ord_maks: 3200, seksjoner_maks: 10, faq_maks: 8 };
  const lagretKo = JSON.parse(JSON.stringify(ko({ lengdemaal })));
  const emne = velgEmne(lagretKo, []);
  assert.deepEqual(emne.lengdemaal, lengdemaal);
  assert.deepEqual(lagBestilling(emne, sprakfiler.nb, grenser, '2026-11-12').krav, {
    ord_min: 1800, ord_maks: 3200, seksjoner_min: 3, seksjoner_maks: 10,
    faq_min: 3, faq_maks: 8, sprakregler_ref: 'seo-data/sprak/nb.json',
  });
});

test('lengdemål fra forslagsfrø følger med i køen', () => {
  assert.deepEqual(ko({ frø: { ...fro, lengdemaal: { ord_maks: 3200 } } })[0].lengdemaal, { ord_maks: 3200 });
});

test('delvis lengdemål bruker globale verdier for manglende felt', () => {
  const emne = { ...ko()[0], lengdemaal: { ord_maks: 3200 } };
  assert.deepEqual(lagBestilling(emne, sprakfiler.nb, grenser, '2026-11-12').krav, {
    ord_min: 600, ord_maks: 3200, seksjoner_min: 3, seksjoner_maks: 6,
    faq_min: 3, faq_maks: 5, sprakregler_ref: 'seo-data/sprak/nb.json',
  });
});

test('køskjema beholder lengdemål og avviser ugyldige grenser', () => {
  const emne = ko()[0];
  const lengdemaal = { ord_min: 4500, ord_maks: 4500, seksjoner_maks: 14, faq_maks: 10 };
  assert.deepEqual(skjema.EmneSkjema.parse({ ...emne, lengdemaal }).lengdemaal, lengdemaal);
  for (const ugyldig of [
    { ord_min: 4501 }, { ord_maks: 4501 }, { seksjoner_maks: 15 }, { faq_maks: 11 },
    { ord_min: 2000, ord_maks: 1900 }, { ord_min: 1300 }, { ord_maks: 599 },
    { seksjoner_maks: 2 }, { faq_maks: 2 }, { ord_min: -1 }, { ord_maks: 1.5 },
  ]) {
    assert.equal(skjema.EmneSkjema.safeParse({ ...emne, lengdemaal: ugyldig }).success, false, JSON.stringify(ugyldig));
    assert.throws(() => lagBestilling({ ...emne, lengdemaal: ugyldig }, sprakfiler.nb, grenser, '2026-11-12'));
    assert.throws(() => ko({ lengdemaal: ugyldig }));
  }
});

test('bestilling uten lengdemål er byte-lik eksisterende leveringsfixture', () => {
  const emne = { ...ko()[0], id: 'e-a1b2c3d4e5f60708' };
  assert.equal(Object.hasOwn(emne, 'lengdemaal'), false);
  const resultat = lagBestilling(emne, sprakfiler.nb, { ...grenser, brodtekstMinOrd: 20 }, '2026-11-12');
  assert.deepEqual(Buffer.from(JSON.stringify(resultat)), Buffer.from(JSON.stringify(fixture('bestilling'))));
});

test('uten bestilling kan tørrkjøring fortsatt senke globalt ordminimum', () => {
  assert.deepEqual(sjekkFast(artikkel(30), {
    ...kontekst, grenser: { ...grenser, brodtekstMinOrd: 20 },
  }), { ok: true, grunner: [] });
});

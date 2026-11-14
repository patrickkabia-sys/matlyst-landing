import assert from 'node:assert/strict';
import test from 'node:test';
import { lesSide as les } from './hjelp/side.mjs';

// KI-samtykket i 1.13.0 (docs/juridisk/ki-samtykke-oppstart-2026-11.md i appen) forutsetter at
// erklæringen sier at Spør Matlyst sender spiskammeret og en smaksprofil på hver forespørsel.
// Tallene speiler MAKS i supabase/functions/_shared/sporMatlyst/skjema.ts (spiskammer 40,
// smaksprofil 300) og SMAKSPROFIL_MAKS_OPPSKRIFTER (200) i lib/smaksprofil.ts.
const SIDER = {
  nb: ['personvern.html', [/Spiskammeret:/u, /smaksprofil/u, /opptil 40/u, /300 tegn/u, /200 oppskriftene/u, /hvordan du lager mat/u, /Titler, ingredienser\s+og annet innhold/u, /allergi, helse og tro tas ikke med/u]],
  sv: ['sv/integritet/index.html', [/Skafferiet:/u, /smakprofil/u, /upp till 40/u, /300 tecken/u, /200 recept/u, /hur du lagar mat/u, /Titlar, ingredienser/u, /allergier, hälsa och tro tas inte med/u]],
  da: ['da/privatliv/index.html', [/Spisekammeret:/u, /smagsprofil/u, /op til 40/u, /300 tegn/u, /200 opskrifter/u, /din madlavning/u, /Titler, ingredienser/u, /allergi, helbred og tro kommer ikke med/u]],
  en: ['en/privacy/index.html', [/your pantry/u, /taste profile/u, /up to 40/u, /300 characters/u, /200 recipes/u, /how you cook/u, /Recipe titles, ingredients/u, /allergies, health or religious beliefs isn’t included/u]],
};

// Helsefilteret (matlyst #824) fjerner allergi, intoleranse, «tåler ikke» og tro fra profilen,
// så eksemplene skal ikke vise slike opplysninger.
const IKKE = /tåler koriander|tål koriander|can’t eat cilantro|glutenfri|gluten-free/u;

for (const [sprak, [fil, monstre]] of Object.entries(SIDER)) {
  test(`${sprak}: smaksprofil-avsnittet bruker ikke helseeksempler`, () => {
    const html = les(fil);
    const start = html.search(/smaksprofil:|smakprofil:|smagsprofil:|What Ask Matlyst sends/u);
    assert.ok(start > -1, `${sprak}: fant ikke avsnittet`);
    assert.doesNotMatch(html.slice(start, start + 1500), IKKE);
  });

  test(`${sprak}: personvernet sier hva Spør Matlyst sender (spiskammer og smaksprofil)`, () => {
    const html = les(fil);
    for (const m of monstre) assert.match(html, m, `${sprak} mangler ${m}`);
  });
}

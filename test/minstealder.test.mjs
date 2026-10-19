// Minstealder for eget samtykke til analyse og KI (vedtak 14.10): 13 i Norge og
// Sverige, 15 i Danmark, 16 for «annet land». Speiler SAMTYKKE_ALDER_BY_LAND i
// appens lib/sprak/koder.ts ({ NO: 13, DK: 15, SE: 13, ZZ: 16 }).
import assert from 'node:assert/strict';
import test from 'node:test';

import { lesSide } from './hjelp/side.mjs';

const tekst = (html) => html.replace(/<[^>]+>/gu, ' ').replace(/\s+/gu, ' ');

const KRAV = {
  'personvern.html': [/Norge: 13 år/u, /Sverige: 13 år/u, /Danmark: 15 år/u, /Annet land: 16 år/u],
  'vilkar.html': [/Norge: 13 år/u, /Sverige: 13 år/u, /Danmark: 15 år/u, /Annet land: 16 år/u],
  'sv/integritet/index.html': [/13 år om du bor i Sverige eller Norge, 15 år om du bor i Danmark och 16 år om du bor i ett annat land/u],
  'da/privatliv/index.html': [/mindst 15 år, hvis du bor i Danmark, 13 år, hvis du bor i Norge eller Sverige, og 16 år, hvis du bor i et andet land/u],
  'en/privacy/index.html': [/13 in Norway and Sweden, 15 in Denmark and 16 in any other country/u],
};

test('minstealderen for eget samtykke står med alle fire landvalg', () => {
  for (const [sti, mønstre] of Object.entries(KRAV)) {
    const t = tekst(lesSide(sti));
    for (const m of mønstre) assert.match(t, m, `${sti}: ${m}`);
  }
});

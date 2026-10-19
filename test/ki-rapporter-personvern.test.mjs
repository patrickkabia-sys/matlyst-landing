// «Rapporter KI-innhold» (appens ki_rapporter, datakartet 13.10): hva som lagres,
// grunnlaget og 12 måneders lagringstid skal stå i personvernerklæringen på alle språk.
import assert from 'node:assert/strict';
import test from 'node:test';

import { lesSide } from './hjelp/side.mjs';

const tekst = (html) => html.replace(/<[^>]+>/gu, ' ').replace(/\s+/gu, ' ');

const KRAV = {
  'personvern.html': [/Rapporter om KI-innhold/u, /berettiget interesse \(art\. 6 f\) i å holde KI-innholdet trygt/u, /slettes etter 12 måneder/u],
  'sv/integritet/index.html': [/Rapporter om AI-innehåll/u, /artikel 6\.1 f/u, /raderas efter tolv månader/u],
  'da/privatliv/index.html': [/Rapporter om AI-indhold/u, /litra f, i at holde AI-indholdet sikkert/u, /slettes efter 12 måneder/u],
  'en/privacy/index.html': [/Reporting AI content/u, /Art\. 6\(1\)\(f\)\)/u, /deleted after 12 months/u],
};

test('rapporter om KI-innhold er beskrevet på alle språk', () => {
  for (const [sti, mønstre] of Object.entries(KRAV)) {
    const t = tekst(lesSide(sti));
    for (const m of mønstre) assert.match(t, m, `${sti}: ${m}`);
  }
});

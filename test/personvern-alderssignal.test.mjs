import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const ROOT = new URL('..', import.meta.url).pathname;
const les = (fil) => readFileSync(join(ROOT, fil), 'utf8');

// Alderssignalet (Texas SB 2420) i appen: docs/alderssignal.md i matlyst-repoet.
// Erklæringen skal på alle språk si at alderen ikke lagres, at en installasjons-ID
// lagres for å følge en forelders tilbaketrekking, og hvilket rettslig grunnlag som brukes.
const SIDER = {
  nb: ['personvern.html', [/lagrer\s+ikke alderen eller aldersgruppen din/u, /ID for installasjonen/u, /art\. 6 nr\. 1 bokstav f/u]],
  da: ['da/privatliv/index.html', [/Din alder og din aldersgruppe gemmes ikke/u, /id for installationen/u, /artikel 6, stk\. 1, litra f, i at overholde/u]],
  sv: ['sv/integritet/index.html', [/Din ålder och åldersgrupp sparas inte/u, /id för installationen/u, /artikel 6\.1 f, att följa lagarna/u]],
  en: ['en/privacy/index.html', [/We don't store your age or age range/u, /installation ID/u, /Art\. 6\(1\)\(f\)\) in following the laws/u]],
};

for (const [sprak, [fil, krav]] of Object.entries(SIDER)) {
  test(`alderssignalet er beskrevet på ${sprak}`, () => {
    const html = les(fil);
    assert.match(html, /id="alderssignal"/u);
    for (const k of krav) assert.match(html, k);
  });
}

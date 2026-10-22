import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const ROOT = new URL('..', import.meta.url).pathname;
const les = (fil) => readFileSync(join(ROOT, fil), 'utf8');

// Sikkerhet i personvernet og ansvarsbegrensning i vilkårene (22.10.2026). Ansvaret for et
// sikkerhetsbrudd kan ikke fraskrives (GDPR art. 82), så teksten skal beskrive tiltakene,
// love varsling etter art. 33 og 34 og holde ufravikelig lov utenfor begrensningen.
const PERSONVERN = {
  nb: ['personvern.html', [/id="sikkerhet"/u, /72 timer/u, /art\. 33 og 34/u]],
  da: ['da/privatliv/index.html', [/id="sikkerhed"/u, /72 timer/u, /artikel 33 og 34/u]],
  sv: ['sv/integritet/index.html', [/id="sakerhet"/u, /72 timmar/u, /artiklarna 33 och 34/u]],
  en: ['en/privacy/index.html', [/id="security"/u, /72 hours/u, /Articles 33 and 34 of the GDPR/u]],
};
const VILKAR = {
  nb: ['vilkar.html', [/indirekte tap/u, /grov uaktsomhet/u, /ufravikelig lov/u]],
  da: ['da/vilkaar/index.html', [/indirekte tab/u, /groft uagtsomt/u, /ufravigelig lovgivning/u]],
  sv: ['sv/villkor/index.html', [/indirekt skada/u, /grov vårdslöshet/u, /tvingande lag/u]],
  en: ['en/terms/index.html', [/indirect loss/u, /gross negligence/u, /cannot be limited by law/u]],
};

for (const [navn, sider] of [['personvern', PERSONVERN], ['vilkår', VILKAR]]) {
  for (const [sprak, [fil, krav]] of Object.entries(sider)) {
    test(`${navn} har sikkerhet og ansvar på ${sprak}`, () => {
      const html = les(fil);
      for (const k of krav) assert.match(html, k);
    });
  }
}

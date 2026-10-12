import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const ROOT = new URL('..', import.meta.url).pathname;
const les = (sti) => readFileSync(join(ROOT, sti), 'utf8');

// nb dekkes av personvern-underleverandorer-nb.test.mjs. Her: sv, da og en, som genereres
// fra scripts/generer-lokalsider.mjs og skal ha samme innhold.
const SIDER = {
  sv: 'sv/integritet/index.html',
  da: 'da/privatliv/index.html',
  en: 'en/privacy/index.html',
};

test('sv, da og en nevner underleverandørene og dataflytene', () => {
  for (const [sprak, fil] of Object.entries(SIDER)) {
    const html = les(fil);
    for (const navn of ['Resend', 'Google Fonts', 'Firebase Cloud Messaging', 'Expo', 'Pwned Passwords', 'YouTube Data API', 'TikTok', 'Meta', 'SHA-1', '48', 'hei@matlyst-app.no']) {
      assert.ok(html.includes(navn), `${sprak}: mangler ${navn}`);
    }
  }
});

// Resend og Expo var aktive på dataprivacyframework.gov/list 13.10.2026.
test('Resend og Expo står under Data Privacy Framework på alle språk', () => {
  const dpf = {
    sv: /Resend \(mejl\) och Expo \(notiser och appuppdateringar\): EU–US Data Privacy Framework/u,
    da: /Resend \(e-mails\) og Expo \(notifikationer og appopdateringer\) i USA sker på grundlag af EU-US Data Privacy Framework/u,
    en: /Data Privacy Framework, with Standard Contractual Clauses where it does not apply:<\/strong> Apple, Google, Meta, RevenueCat, Resend and Expo\./u,
  };
  for (const [sprak, fil] of Object.entries(SIDER)) assert.match(les(fil), dpf[sprak], sprak);
});

test('sist oppdatert er 13. oktober 2026 på sv, da og en', () => {
  assert.match(les(SIDER.sv), /Senast uppdaterad 13 oktober 2026/u);
  assert.match(les(SIDER.da), /Senest opdateret 13\. oktober 2026/u);
  assert.match(les(SIDER.en), /Last updated 13 October 2026/u);
});

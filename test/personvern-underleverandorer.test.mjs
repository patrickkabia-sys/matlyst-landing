import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const ROOT = new URL('..', import.meta.url).pathname;
const les = (sti) => readFileSync(join(ROOT, sti), 'utf8');

const SIDER = {
  nb: 'personvern.html',
  sv: 'sv/integritet/index.html',
  da: 'da/privatliv/index.html',
  en: 'en/privacy/index.html',
};

// Dataflytene i appen (supabase/functions/_shared/email.ts, expoPush.ts, recipeImage.ts,
// youtube.ts, check-password-breach, app.json googleServicesFile og updates.url) skal stå
// i personvernteksten på alle fire språk.
test('alle språk nevner underleverandørene og dataflytene fra 12.10', () => {
  for (const [sprak, fil] of Object.entries(SIDER)) {
    const html = les(fil);
    for (const navn of ['Resend', 'Google Fonts', 'Firebase Cloud Messaging', 'Expo', 'Pwned Passwords', 'YouTube Data API', 'TikTok', 'Meta']) {
      assert.ok(html.includes(navn), `${sprak}: mangler ${navn}`);
    }
    assert.ok(html.includes('SHA-1'), `${sprak}: passordsjekken skal forklare hashen`);
    assert.ok(html.includes('48'), `${sprak}: påminnelsen etter 48 timer`);
  }
});

test('Resend står ikke med et overføringsgrunnlag som ikke er avklart', () => {
  assert.doesNotMatch(les(SIDER.en), /RevenueCat and Resend/u);
});

test('sist oppdatert er 12. oktober 2026 på alle språk', () => {
  assert.match(les(SIDER.nb), /Sist oppdatert 12\. oktober 2026/u);
  assert.match(les(SIDER.sv), /Senast uppdaterad 12 oktober 2026/u);
  assert.match(les(SIDER.da), /Senest opdateret 12\. oktober 2026/u);
  assert.match(les(SIDER.en), /Last updated 12 October 2026/u);
});

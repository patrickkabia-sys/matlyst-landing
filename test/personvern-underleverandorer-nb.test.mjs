import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const ROOT = new URL('..', import.meta.url).pathname;
const nb = readFileSync(join(ROOT, 'personvern.html'), 'utf8');

// Dataflytene i appen (supabase/functions/_shared/email.ts, expoPush.ts, recipeImage.ts,
// youtube.ts, check-password-breach, app.json googleServicesFile og updates.url).
test('personvernerklæringen nevner underleverandørene og dataflytene fra 12.10', () => {
  for (const navn of ['Resend', 'Google Fonts', 'Firebase Cloud Messaging', 'Expo', 'Pwned Passwords', 'YouTube Data API', 'TikTok', 'Meta', 'SHA-1', '48 timer']) {
    assert.ok(nb.includes(navn), `mangler ${navn}`);
  }
  assert.match(nb, /Sist oppdatert 12\. oktober 2026/u);
});

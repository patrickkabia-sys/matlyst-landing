import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const ROOT = new URL('..', import.meta.url).pathname;
const nb = readFileSync(join(ROOT, 'personvern.html'), 'utf8');

// Dataflytene i appen (supabase/functions/_shared/email.ts og Auth-SMTP, expoPush.ts, apns.ts,
// recipeImage.ts, youtube.ts, check-password-breach, app.json googleServicesFile og updates.url).
test('personvernerklæringen nevner underleverandørene og dataflytene', () => {
  for (const navn of ['Resend', 'Google Fonts', 'Firebase Cloud Messaging', 'Expo', 'Pwned Passwords', 'YouTube Data API', 'TikTok', 'Meta', 'SHA-1', '48 timer', 'Live Activity']) {
    assert.ok(nb.includes(navn), `mangler ${navn}`);
  }
  assert.match(nb, /e-poster for innlogging/u);
  assert.match(nb, /sporingskoder/u);
  assert.match(nb, /tilfeldig ID som er fast for installasjonen/u);
  assert.doesNotMatch(nb, /plattformene får ingen opplysninger om deg/u);
  assert.match(nb, /Sist oppdatert 13\. oktober 2026/u);
});

// Resend og Expo var aktive på dataprivacyframework.gov/list 13.10.2026.
test('Resend og Expo står i DPF-raden for overføring', () => {
  const rad = nb.match(/<li><strong>USA: EU-US Data Privacy Framework[^]*?<\/li>/u)[0];
  for (const navn of ['Resend', 'Expo']) assert.ok(rad.includes(navn), `DPF-raden mangler ${navn}`);
});

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const ROOT = new URL('..', import.meta.url).pathname;
const nb = readFileSync(join(ROOT, 'personvern.html'), 'utf8');

// Dataflytene i appen (supabase/functions/_shared/email.ts og Auth-SMTP, expoPush.ts, apns.ts,
// recipeImage.ts, youtube.ts, check-password-breach, app.json googleServicesFile og updates.url).
test('personvernerklæringen nevner underleverandørene og dataflytene', () => {
  for (const navn of ['Resend', 'GitHub', 'Firebase Cloud Messaging', 'Expo', 'Pwned Passwords', 'YouTube Data API', 'TikTok', 'Meta', 'SHA-1', '48 timer', 'Live Activity']) {
    assert.ok(nb.includes(navn), `mangler ${navn}`);
  }
  assert.match(nb, /e-poster for innlogging/u);
  assert.match(nb, /sporingskoder/u);
  assert.match(nb, /tilfeldig ID som er fast for installasjonen/u);
  assert.doesNotMatch(nb, /plattformene får ingen opplysninger om deg/u);
  assert.match(nb, /Sist oppdatert 22\. oktober 2026/u);
});

// YouTube API Services Developer Policies III.A.2 b–c og III.D.2: erklæringen må si at appen
// bruker YouTube API Services, lenke til Googles personvernerklæring og til Googles
// sikkerhetsinnstillinger. Setningen om YouTubes vilkår i egne vilkår (III.A.1) testes i
// vilkar-youtube.test.mjs.
test('YouTube API Services er opplyst med lenker, og spillelistebildene fra i.ytimg.com', () => {
  assert.ok(nb.includes('href="https://security.google.com/settings/security/permissions"'));
  assert.match(nb, /ber ikke om tilgang til Google- eller\s+YouTube-kontoen din/u);
  assert.match(nb, /Matlyst bruker YouTube API Services/u);
  assert.ok(nb.includes('href="https://www.youtube.com/t/terms"'));
  assert.ok(nb.includes('href="https://policies.google.com/privacy"'));
  assert.match(nb, /i\.ytimg\.com/u);
});

// TikTok er en selvstendig mottaker av en offentlig lenke, ikke databehandler.
test('TikTok står ikke i leverandørlista', () => {
  const liste = nb.slice(nb.indexOf('Hvem vi deler med'), nb.indexOf('Lagring på enheten din'));
  assert.doesNotMatch(liste, /TikTok/u);
  assert.match(nb, /Expo og Apple eller Google får push-tokenet/u);
});

// Resend og Expo var aktive på dataprivacyframework.gov/list 13.10.2026.
test('Resend og Expo står i DPF-raden for overføring', () => {
  const rad = nb.match(/<li><strong>USA: EU-US Data Privacy Framework[^]*?<\/li>/u)[0];
  for (const navn of ['Resend', 'Expo']) assert.ok(rad.includes(navn), `DPF-raden mangler ${navn}`);
});

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
    for (const navn of ['Resend', 'GitHub', 'Firebase Cloud Messaging', 'Expo', 'Pwned Passwords', 'YouTube Data API', 'TikTok', 'Meta', 'SHA-1', '48', 'hei@matlyst-app.no']) {
      assert.ok(html.includes(navn), `${sprak}: mangler ${navn}`);
    }
  }
});

test('sv, da og en låser formuleringene fra Opus-kontrollen', () => {
  const krav = {
    sv: [/Matlyst använder YouTube API Services/u, /spårningskoder/u, /slumpmässigt id som hör till just den installationen/u, /mejl för inloggning \(/u, /Expo och Apple eller Google får din push-token/u, /i\.ytimg\.com/u],
    da: [/Matlyst bruger YouTube API Services/u, /sporingskoder/u, /tilfældigt id, der er knyttet til netop denne installation/u, /e-mails til login \(/u, /Expo og Apple eller Google får dit push-token/u, /i\.ytimg\.com/u, /og dermed får Google din IP-adresse/u],
    en: [/Matlyst uses YouTube API Services/u, /tracking codes/u, /random ID that stays the same for your installation/u, /sign-in emails, such as/u, /Expo and Apple or Google receive the push token/u, /i\.ytimg\.com/u],
  };
  for (const [sprak, fil] of Object.entries(SIDER)) {
    const html = les(fil);
    for (const m of krav[sprak]) assert.match(html, m, sprak);
    assert.ok(html.includes('href="https://www.youtube.com/t/terms"'), `${sprak}: YouTubes vilkår`);
    assert.ok(html.includes('href="https://policies.google.com/privacy"'), `${sprak}: Googles personvernerklæring`);
    assert.ok(html.includes('href="https://security.google.com/settings/security/permissions"'), `${sprak}: Googles sikkerhetsinnstillinger`);
  }
});

test('TikTok står ikke som leverandør eller i overføringsavsnittet', () => {
  assert.doesNotMatch(les(SIDER.sv), /TikTok får länken/u);
  assert.doesNotMatch(les(SIDER.da), /TikTok får linket/u);
  assert.doesNotMatch(les(SIDER.en), /<strong>TikTok:<\/strong>/u);
});

// Resend og Expo var aktive på dataprivacyframework.gov/list 13.10.2026.
test('Resend og Expo står under Data Privacy Framework på alle språk', () => {
  const dpf = {
    sv: /Resend \(mejl\), Expo \(notiser och appuppdateringar\) och GitHub \(statusfilen\): EU–US Data Privacy Framework/u,
    da: /Resend \(e-mails\), Expo \(notifikationer og appopdateringer\) og GitHub \(statusfilen\) i USA sker på grundlag af EU-US Data Privacy Framework/u,
    en: /Data Privacy Framework, with Standard Contractual Clauses where it does not apply:<\/strong> Apple, Google, Meta, RevenueCat, Resend, Expo and GitHub\./u,
  };
  for (const [sprak, fil] of Object.entries(SIDER)) assert.match(les(fil), dpf[sprak], sprak);
});

test('sist oppdatert er 19. oktober 2026 på sv, da og en', () => {
  assert.match(les(SIDER.sv), /Senast uppdaterad 19 oktober 2026/u);
  assert.match(les(SIDER.da), /Senest opdateret 19\. oktober 2026/u);
  assert.match(les(SIDER.en), /Last updated 19 October 2026/u);
});

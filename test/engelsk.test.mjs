import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

const ROOT = new URL('..', import.meta.url).pathname;
const les = (sti) => readFileSync(join(ROOT, sti.endsWith('/') ? `${sti}index.html` : sti), 'utf8');

// Stiene appen og e-postene allerede lenker til (matlyst-master:
// supabase/functions/_shared/juridiskeLenker.ts og lib/sprak/en/epost.ts).
const APPENS_STIER = ['en/privacy/', 'en/terms/', 'en/import-recipes/', 'en/unsubscribe/'];

test('de engelske stiene appen lenker til finnes', () => {
  for (const sti of APPENS_STIER) assert.ok(existsSync(join(ROOT, sti, 'index.html')), sti);
  assert.match(les('en/terms/'), /<section id="alder">/u);
});

test('juridiske sider viser ingen interne markører eller utkastmerking', () => {
  for (const sti of ['en/privacy/', 'en/terms/']) {
    const html = les(sti);
    assert.doesNotMatch(html, /UTKAST|\[(?:JURIST|VERIFISER|DATE)|\[overgang|Del 4/iu, sti);
  }
});

test('engelsk personvern nevner de samme leverandørene som norsk, og ingen som er faset ut', () => {
  const norsk = les('personvern.html');
  const engelsk = les('en/privacy/');
  const leverandorer = ['Supabase', 'Apple', 'Google', 'Anthropic Ireland, Limited', 'RevenueCat', 'Sentry', 'PostHog', 'Resend', 'Expo', 'Firebase', 'GitHub', 'YouTube', 'Google Analytics'];
  for (const navn of leverandorer) {
    assert.ok(norsk.includes(navn), `norsk mangler ${navn}`);
    assert.ok(engelsk.includes(navn), `engelsk mangler ${navn}`);
  }
  for (const navn of ['Gemini', 'EmailOctopus', 'reCAPTCHA', 'Meta Pixel', 'Pixel']) {
    assert.ok(!engelsk.includes(navn), `engelsk nevner ${navn}`);
  }
});

test('engelsk personvern og vilkår har ingen USA- eller UK-avsnitt (bølge 2), angrerett i EØS og Sveits', () => {
  const personvern = les('en/privacy/');
  const vilkar = les('en/terms/');
  for (const html of [personvern, vilkar]) {
    assert.doesNotMatch(html, /United Kingdom|\bUK\b|UK GDPR|California|CCPA|COPPA|US states|arbitration|class action/iu);
  }
  assert.match(vilkar, /In the EEA and Switzerland, you have a 14-day right of withdrawal/u);
});

test('engelske sider har engelsk sitemap i robots.txt', () => {
  assert.match(les('robots.txt'), /^Sitemap: https:\/\/matlyst-app\.no\/sitemap-en\.xml$/mu);
  const xml = les('sitemap-en.xml');
  for (const sti of ['en/', 'en/import-recipes/', 'en/privacy/', 'en/terms/']) {
    assert.match(xml, new RegExp(`<loc>https://matlyst-app\\.no/${sti}</loc>`, 'u'), sti);
  }
  assert.doesNotMatch(xml, /en\/unsubscribe/u);
});

function besok(url, { sprak = ['en-US'], lagret = null, agent = 'Mozilla/5.0' } = {}) {
  const { pathname, search, hash } = new URL(url, 'https://matlyst-app.no');
  const lager = new Map(lagret ? [['matlyst-sprak', lagret]] : []);
  const omdirigert = [];
  let vedLast = null;
  const document = { readyState: 'loading', cookie: '' };
  const window = {
    document,
    location: { pathname, search, hash, replace: (til) => omdirigert.push(til) },
    navigator: { languages: sprak, language: sprak[0], userAgent: agent },
    localStorage: { getItem: (k) => lager.get(k) ?? null, setItem: (k, v) => lager.set(k, v) },
    addEventListener: (navn, handler) => { if (navn === 'load') vedLast = handler; },
  };
  vm.runInNewContext(les('locale.js'), { window, URLSearchParams });
  vedLast?.();
  return { til: omdirigert[0] ?? null, lagret: lager.get('matlyst-sprak') ?? null };
}

test('engelsk og ukjent språk blir på siden brukeren åpnet', () => {
  assert.equal(besok('/').til, null);
  assert.equal(besok('/', { sprak: ['de-DE', 'fr'] }).til, null);
  assert.equal(besok('/vilkar.html', { sprak: ['es-ES'] }).til, null);
  assert.equal(besok('/sv/integritet/', { sprak: ['ja-JP'] }).til, null);
  assert.equal(besok('/en/', { sprak: ['en-GB'] }).til, null);
  assert.equal(besok('/', { sprak: ['en-US', 'nb-NO'] }).til, null);
  assert.equal(besok('/', { sprak: ['de-DE', 'nn'] }).til, null);
  assert.equal(besok('/', { sprak: ['en-US', 'sv-SE'] }).til, null);
  assert.equal(besok('/en/', { sprak: ['da-DK'] }).til, null);
});

test('ukjent språk på en side uten engelsk motstykke blir der den er', () => {
  assert.equal(besok('/ukemeny/', { sprak: ['de-DE'] }).til, null);
  assert.equal(besok('/sv/enkel-middag/', { sprak: ['fr-FR'] }).til, null);
});

test('søkemotorer omdirigeres ikke automatisk', () => {
  const googlebot = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
  assert.equal(besok('/', { agent: googlebot }).til, null);
  assert.equal(besok('/sv/', { agent: googlebot }).til, null);
  assert.equal(besok('/', { agent: 'Mozilla/5.0 (compatible; bingbot/2.0)' }).til, null);
});

test('engelsk som aktivt valg lagres uten å tvinge senere direkte URL-er', () => {
  assert.deepEqual(besok('/en/?sprak=en', { sprak: ['nb-NO'] }), { til: null, lagret: 'en' });
  assert.equal(besok('/', { sprak: ['nb-NO'], lagret: 'en' }).til, null);
  assert.equal(besok('/vilkar.html', { sprak: ['nb-NO'], lagret: 'en' }).til, null);
  assert.equal(besok('/en/privacy/', { sprak: ['en-US'], lagret: 'da' }).til, null);
});

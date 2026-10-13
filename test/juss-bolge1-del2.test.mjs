// Juss bølge 1, del 2 (13.10.2026): matlogg fra 18 år (app #605), Gemini ut (app #607)
// og avstemming mot docs/juridisk/datakart.md i appen.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const ROOT = new URL('..', import.meta.url).pathname;
const les = (sti) => readFileSync(join(ROOT, sti), 'utf8');

const SPRAK = {
  nb: {
    dpf: /Resend, Expo og GitHub\. Overføringen bygger på/u,
    personvern: 'personvern.html', vilkar: 'vilkar.html',
    atten: /minst 18 år<\/strong>, uansett hvilket land du bor i/u,
    vilkarAtten: /krever at du er minst 18 år, uansett hvilket\s+land du bor i/u,
    skjult: /beholder vi matloggen og\s+kalorimålet, men skjuler dem og stopper nye føringer til du bekrefter at du er minst 18 år/u,
    instagram: /Hver gang appen starter, henter den også\s+forsiden til Instagram/u,
    status: 'status.matlyst-app.no',
  },
  sv: {
    dpf: /och GitHub \(statusfilen\): EU–US Data Privacy Framework/u,
    personvern: 'sv/integritet/index.html', vilkar: 'sv/villkor/index.html',
    atten: /Matlogg och kalorimål kräver att du är minst 18 år, oavsett var du bor/u,
    vilkarAtten: /Matlogg och kalorimål kräver att du är minst 18 år, oavsett var du bor/u,
    skjult: /sparar vi matloggen och kalorimålet, men döljer dem/u,
    instagram: /Varje gång appen startar hämtar den också Instagrams startsida/u,
    status: 'status.matlyst-app.no',
  },
  da: {
    dpf: /og GitHub \(statusfilen\) i USA sker på grundlag af EU-US Data Privacy Framework/u,
    personvern: 'da/privatliv/index.html', vilkar: 'da/vilkaar/index.html',
    atten: /Madlog og kaloriemål kræver, at du er mindst 18 år, uanset hvor du bor/u,
    vilkarAtten: /Madlog og kaloriemål kræver, at du er mindst 18 år, uanset hvor du bor/u,
    skjult: /beholder vi madloggen og kaloriemålet, men skjuler dem/u,
    instagram: /Hver gang appen starter, henter den også Instagrams forside/u,
    status: 'status.matlyst-app.no',
  },
  en: {
    dpf: /Data Privacy Framework, with Standard Contractual Clauses where it does not apply:<\/strong> Apple, Google, Meta, RevenueCat, Resend, Expo and GitHub/u,
    personvern: 'en/privacy/index.html', vilkar: 'en/terms/index.html',
    atten: /you must confirm that you are at least 18, wherever you live/u,
    vilkarAtten: /The food log and calorie goal require you to be at least 18, wherever you live/u,
    skjult: /we keep your food log and calorie goal but hide them/u,
    instagram: /Each time the app starts, it also loads the Instagram home page/u,
    status: 'status.matlyst-app.no',
  },
};

test('matlogg og kalorimål krever 18 år på alle språk, og eldre matlogger skjules til 18+ er bekreftet', () => {
  for (const [kode, s] of Object.entries(SPRAK)) {
    const personvern = les(s.personvern);
    assert.match(personvern, s.atten, `${kode}: 18 år i personvern`);
    assert.match(personvern, s.skjult, `${kode}: eldre matlogg skjules`);
    assert.match(les(s.vilkar), s.vilkarAtten, `${kode}: 18 år i vilkårene`);
  }
});

test('Gemini er ute av erklæringer og vilkår på alle språk', () => {
  for (const s of Object.values(SPRAK)) {
    for (const fil of [s.personvern, s.vilkar]) assert.doesNotMatch(les(fil), /Gemini/u, fil);
  }
});

test('datakartet: ingen feilsøkingslogg eller Google Fonts i e-post, men Instagram fra telefonen og statusfila hos GitHub', () => {
  for (const [kode, s] of Object.entries(SPRAK)) {
    const html = les(s.personvern);
    assert.doesNotMatch(html, /feilsøkingslogg|felsökningslogg|fejlfindingslogge|troubleshooting log|Google Fonts/iu, kode);
    assert.match(html, s.instagram, `${kode}: Instagram-forhåndskallet`);
    assert.ok(html.includes(s.status) && html.includes('GitHub'), `${kode}: statusfila hos GitHub`);
    assert.match(html, /EmailOctopus/u, `${kode}: nyhetsbrevlista`);
    assert.match(html, s.dpf, `${kode}: GitHub i DPF-punktet`);
    assert.doesNotMatch(html, /hvert femte minutt mens den er i bruk|var femte minut medan den används|hvert femte minut, mens den er i brug|every five minutes while you use it/u, `${kode}: statussjekken`);
  }
});

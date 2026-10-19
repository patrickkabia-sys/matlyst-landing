// Granskingen av #23 (20.10): sv og da skal si det samme som nb og en, uten
// interne filnavn, uten art. 6.1 c som ingen behandling bruker, med fødselsår,
// og uten USA/Storbritannia, som kommer i bølge 2.
import assert from 'node:assert/strict';
import test from 'node:test';

import { lesSide } from './hjelp/side.mjs';

const tekst = (html) => html.replace(/<!--[\s\S]*?-->/gu, ' ').replace(/<script[\s\S]*?<\/script>/gu, ' ').replace(/<[^>]+>/gu, ' ').replace(/\s+/gu, ' ');

const SIDER = {
  nb: 'personvern.html',
  sv: 'sv/integritet/index.html',
  da: 'da/privatliv/index.html',
  en: 'en/privacy/index.html',
};

// Samme temaer på alle fire språk.
const TEMAER = {
  profilSynlig: { nb: /synlige for andre innloggede brukere/u, sv: /syns för andra inloggade användare/u, da: /kan ses af andre brugere, der er logget ind/u, en: /visible to other signed-in users/u },
  utklipp: { nb: /utklippstavle/u, sv: /Länkar från urklipp/u, da: /Links fra udklipsholder/u, en: /clipboard/u },
  spiskammer: { nb: /holdbarhetsdato/u, sv: /bäst före-datum/u, da: /holdbarhedsdato/u, en: /best-before date/u },
  enhet: { nb: /Lagring på enheten din/u, sv: /Lagring på telefonen/u, da: /Lagring på telefonen/u, en: /Storage on your device/u },
  sperre: { nb: /reservere deg mot at innholdet ditt/u, sv: /spärra import av ditt innehåll/u, da: /spærre for import af dit indhold/u, en: /block imports of your content/u },
  kopi: { nb: /Last ned personopplysningene mine/u, sv: /Ladda ner mina personuppgifter/u, da: /Download mine personoplysninger/u, en: /download a copy of your data yourself/u },
  svarfrist: { nb: /innen 30 dager/u, sv: /inom 30 dagar/u, da: /inden 30 dage/u, en: /within 30 days/u },
  kiFeil: { nb: /KI-svar kan være feil/u, sv: /AI-svar kan vara fel/u, da: /AI-svar kan være forkerte/u, en: /AI answers can be wrong/u },
  fodselsar: { nb: /fødselsdato eller fødselsår/u, sv: /födelsedatum eller födelseår/u, da: /fødselsdato eller dit fødselsår/u, en: /date of birth or year of birth/u },
  endringer: { nb: /Vi kan oppdatere denne erklæringen/u, sv: /Vi kan uppdatera den här policyn/u, da: /Vi kan opdatere denne politik/u, en: /We may update this policy/u },
};

test('personvernerklæringen dekker de samme temaene på nb, sv, da og en', () => {
  for (const [tema, perSprak] of Object.entries(TEMAER)) {
    for (const [kode, m] of Object.entries(perSprak)) assert.match(tekst(lesSide(SIDER[kode])), m, `${kode}: ${tema}`);
  }
});

test('ingen interne filnavn i brukerteksten', () => {
  for (const [kode, sti] of Object.entries(SIDER)) {
    assert.doesNotMatch(tekst(lesSide(sti)), /site\.js/u, `${kode}: site.js`);
  }
});

// Konto-ID og e-post beholdes til slettingen hos leverandørene er fullført.
// Grunnlaget er art. 6.1 c (GDPR art. 17 og 19), likt på alle språk og bare der.
test('restopplysninger under sletting har art. 6.1 c som grunnlag på alle språk', () => {
  const krav = {
    nb: /til slettingen er fullført\. Ikke noe annet, og ikke lenger enn det tar\. Grunnlaget er rettslig forpliktelse \(art\. 6 nr\. 1 bokstav c\), fordi vi må fullføre slettingen hos leverandørene etter GDPR art\. 17 og 19\./u,
    sv: /Inget annat, och inte längre än så\. Den rättsliga grunden är rättslig förpliktelse enligt artikel 6\.1 c, eftersom vi måste slutföra raderingen hos leverantörerna enligt artiklarna 17 och 19 i GDPR\./u,
    da: /Intet andet, og ikke længere end nødvendigt\. Retsgrundlaget er retlig forpligtelse efter artikel 6, stk\. 1, litra c, fordi vi skal gennemføre sletningen hos leverandørerne efter artikel 17 og 19 i GDPR\./u,
    en: /Nothing else, and no longer than it takes\. The legal basis is legal obligation \(Art\. 6\(1\)\(c\)\), because GDPR Articles 17 and 19 require us to complete the deletion at our providers\./u,
  };
  const c = /6 nr\. 1 bokstav c|6\.1 c|litra c|6\(1\)\(c\)/gu;
  for (const [kode, m] of Object.entries(krav)) {
    const t = tekst(lesSide(SIDER[kode]));
    assert.match(t, m, kode);
    assert.equal(t.match(c)?.length, 1, `${kode}: art. 6.1 c skal stå én gang, i slettesetningen`);
  }
});

test('personvern, vilkår og slett konto har samme dato på alle språk', () => {
  const sider = ['personvern.html', 'vilkar.html', 'slett-konto.html', 'sv/integritet/index.html', 'sv/villkor/index.html', 'sv/radera-konto/index.html', 'da/privatliv/index.html', 'da/vilkaar/index.html', 'da/slet-konto/index.html', 'en/privacy/index.html', 'en/terms/index.html'];
  const datoer = new Set(sider.map((sti) => {
    const m = tekst(lesSide(sti)).match(/(?:Sist oppdatert|Senast uppdaterad|Senest opdateret|Last updated) (\d{1,2})\.? (oktober|October) 2026/u);
    assert.ok(m, `${sti}: fant ingen dato`);
    return m[1];
  }));
  assert.deepEqual([...datoer], ['20']);
});

test('engelsk har ingen avsnitt for USA eller Storbritannia (bølge 2)', () => {
  const t = tekst(lesSide(SIDER.en)) + tekst(lesSide('en/terms/index.html'));
  assert.doesNotMatch(t, /United Kingdom|UK GDPR|the UK|COPPA|California|CCPA|Washington My Health/u);
});

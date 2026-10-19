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

test('ingen interne filnavn og ingen art. 6.1 c i brukerteksten', () => {
  for (const [kode, sti] of Object.entries(SIDER)) {
    const t = tekst(lesSide(sti));
    assert.doesNotMatch(t, /site\.js/u, `${kode}: site.js`);
    assert.doesNotMatch(t, /6\.1 c|litra c|6 nr\. 1 bokstav c|6\(1\)\(c\)/u, `${kode}: art. 6.1 c`);
  }
});

test('engelsk har ingen avsnitt for USA eller Storbritannia (bølge 2)', () => {
  const t = tekst(lesSide(SIDER.en)) + tekst(lesSide('en/terms/index.html'));
  assert.doesNotMatch(t, /United Kingdom|UK GDPR|the UK|COPPA|California|CCPA|Washington My Health/u);
});

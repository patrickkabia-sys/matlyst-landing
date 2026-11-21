// Låser de 714 omregneradressene (710 parsider og 4 samlesider på nb, sv, da og en). Adressene er søkbare og indeksert, og endres ikke.
// Fasiten er utledet av allePar og parSti fra koden slik den sto før omregnerne fikk kalkulatorkortet.
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { enhetsStierNb } from '../scripts/nb-enhetssider.mjs';
import { enhetsStierSv } from '../scripts/sv-enhetssider.mjs';
import { enhetsStierDa } from '../scripts/da-enhetssider.mjs';
import { enhetsStier } from '../scripts/en-enhetssider.mjs';
import { rikeSider } from '../scripts/en-rike-sider.mjs';

const rot = fileURLToPath(new URL('..', import.meta.url));
const fasit = JSON.parse(readFileSync(new URL('./fasit/omregner-adresser.json', import.meta.url), 'utf8'));

// Generatorenes stier uten innledende skråstrek, med språkets mappeprefiks. Samlesiden på engelsk bor i en-rike-sider.
const fraGeneratorene = () => [
  ...enhetsStierNb.map((s) => `/${s}`),
  ...enhetsStierSv.map((s) => `/sv/${s}`),
  ...enhetsStierDa.map((s) => `/da/${s}`),
  ...enhetsStier.map((s) => `/en/${s}`),
  ...Object.keys(rikeSider).filter((s) => s === 'tools/unit-converter/').map((s) => `/en/${s}`),
].sort();

test('de 714 omregneradressene er uendret', () => {
  assert.equal(fasit.length, 714);
  assert.equal(new Set(fasit).size, 714, 'fasiten har dublett');
  const gen = fraGeneratorene();
  assert.equal(gen.length, 714);
  assert.deepEqual(gen, fasit);
});

test('hver adresse finnes som fil med seg selv som canonical', () => {
  for (const adresse of fasit) {
    const fil = `${rot}${adresse.slice(1)}index.html`;
    assert.ok(existsSync(fil), `${adresse}: index.html mangler`);
    const html = readFileSync(fil, 'utf8');
    const canonical = /<link rel="canonical" href="([^"]*)"/u.exec(html)?.[1];
    assert.equal(canonical, `https://matlyst-app.no${adresse}`, adresse);
  }
});

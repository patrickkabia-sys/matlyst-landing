import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const les = (sti) => readFileSync(fileURLToPath(new URL(`../${sti}`, import.meta.url)), 'utf8');
// Kommentarer siterer det de forbyr, så de strippes før mønstrene søkes.
const utenKommentarer = (tekst) => tekst.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`\\])\/\/.*$/gm, '$1');
const kilde = utenKommentarer(les('scripts/generer-lokalsider.mjs'));
const kropp = (navn) => {
  const m = kilde.match(new RegExp(`function ${navn}\\([\\s\\S]*?\\n\\}`));
  assert.ok(m, navn);
  return m[0];
};

test('L bruker skallets språkvelger gjennom en adapter', () => {
  assert.match(kilde, /import \{[^}]*\bsprakvelger as skallSprakvelger\b[^}]*\} from '\.\/skall\.mjs'/);
  assert.match(kilde, /const sprakvelger = \(gruppe, aktivtSprak, plassering\) => skallSprakvelger\(aktivtSprak, plassering === 'top' \? 'topp' : 'bunn', gruppe\.sider\)/);
  assert.doesNotMatch(kilde, /sprakvelgerMeta|etikett: '(NO|SV|DA|EN)'/);
});

test('L legger ikke kommentarpar rundt språkvelgeren selv', () => {
  const m = kropp('medSprakvelgere');
  for (const plass of ['top', 'bottom']) assert.match(m, new RegExp(`= sprakvelger\\(gruppe, aktivtSprak, '${plass}'\\);`));
  assert.doesNotMatch(m, /`<!-- språkvelger:/);
});

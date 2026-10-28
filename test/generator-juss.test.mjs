import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

// Juss-PR-ene retter vilkår og personvern direkte i HTML. Skriver generatoren over
// en eksisterende juridisk side, rulles rettelsene stille tilbake (skjedde nesten 2026-10-28).
const kilde = readFileSync(new URL('../scripts/generer-lokalsider.mjs', import.meta.url), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//gu, '')
  .replace(/^\s*\/\/.*$/gmu, '');

test('generatoren skriver aldri over en eksisterende juridisk side', () => {
  const lokke = kilde.match(/for \(const key of Object\.keys\(legal\[lang\]\)\) \{([\s\S]*?)\n {2}\}/u);
  assert.ok(lokke, 'fant ikke løkken over juridiske sider');
  const kropp = lokke[1];
  const sjekk = kropp.indexOf('existsSync(fil)');
  const skriv = kropp.indexOf('write(sti, legalPage(lang,key))');
  assert.ok(sjekk > -1, 'løkken sjekker ikke om fila finnes');
  assert.ok(skriv > -1, 'løkken skriver ikke nye juridiske sider');
  assert.ok(sjekk < skriv, 'sjekken må komme før skrivingen');
  assert.match(kropp, /if \(existsSync\(fil\)\)[^\n]*\n\s*else write\(sti, legalPage/u);
  assert.doesNotMatch(kropp.replace(/else write\(sti, legalPage\(lang,key\)\)/u, ''), /write\(/u);
});

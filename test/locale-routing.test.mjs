import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const source = readFileSync(new URL('../locale.js', import.meta.url), 'utf8');

function lastInn() {
  const context = { globalThis: {}, URLSearchParams };
  vm.runInNewContext(source, context);
  return context.globalThis.MatlystLocale;
}

test('språklisten velger første språk Matlyst støtter', () => {
  const { velgSprak } = lastInn();
  assert.equal(velgSprak(['sv-SE', 'en'], null), 'sv');
  assert.equal(velgSprak(['en-GB', 'da'], null), 'da');
  assert.equal(velgSprak(['nb-NO'], null), 'nb');
  assert.equal(velgSprak(['en-US'], null), null);
});

test('lagret språk overstyrer nettleserspråket', () => {
  assert.equal(lastInn().velgSprak(['sv-SE'], 'da'), 'da');
});

test('side uten motstykke omdirigeres ikke', () => {
  assert.equal(lastInn().finnMaalsti('/ukjent/', 'sv', {}), null);
});

test('omdirigeringstabellen er tom fram til lanseringscommiten', () => {
  assert.deepEqual(Object.keys(lastInn().LOCALE_PAGE_MAP), []);
});

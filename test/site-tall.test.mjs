// Delt tallesing og tallformat i site.js: omregneren og kalkulatorkortet bruker de samme to funksjonene.
// site.js kjøres i node:vm med et minimalt document; funksjonene ligger på window.MatlystTall.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const kilde = readFileSync(new URL('../site.js', import.meta.url), 'utf8');

function lastSite(lang = 'nb') {
  const document = {
    documentElement: { lang },
    querySelectorAll: () => [],
    querySelector: () => null,
    getElementById: () => null,
    addEventListener() {},
    createElement: () => ({}),
    head: { appendChild() {} },
    title: '',
  };
  const sandbox = {
    document,
    IntersectionObserver: class { observe() {} unobserve() {} },
    matchMedia: () => ({ matches: false, addEventListener() {} }),
    navigator: { userAgent: '' },
    location: { pathname: '/', reload() {} },
    localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    setTimeout,
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(kilde, sandbox);
  return sandbox.window.MatlystTall ?? {};
}

const { tolkTall, visTall } = lastSite();

test('site.js legger de to funksjonene på window.MatlystTall', () => {
  assert.equal(typeof tolkTall, 'function');
  assert.equal(typeof visTall, 'function');
});

test('tolkTall leser hele inntastingen eller gir null', () => {
  assert.equal(tolkTall('2,5', true), 2.5);
  assert.equal(tolkTall('1.000', true), 1000);
  assert.equal(tolkTall('1,000', false), 1000);
  assert.equal(tolkTall('1 000', true), 1000);
  assert.equal(tolkTall('1,5,2', true), null);
  assert.equal(tolkTall('abc', true), null);
  assert.equal(tolkTall('', true), null);
  assert.equal(tolkTall('  ', true), null);
  assert.equal(tolkTall('2.5', true), 2.5);
  assert.equal(tolkTall('0.125', true), 0.125);
});

test('tolkTall tolker fortegn, men avgjør ikke om negativt er lov (det gjør den som bruker tallet)', () => {
  assert.equal(tolkTall('-2', true), -2);
  assert.equal(tolkTall('+2', true), 2);
});

test('visTall følger omregnerens tallformat, med språkets desimaltegn og uten tusenskille', () => {
  assert.equal(visTall(0.42268, true), '0,4227');
  assert.equal(visTall(1234.5, true), '1235');
  assert.equal(visTall(1234.5, false), '1235');
  assert.equal(visTall(0.42268, false), '0.4227');
  assert.equal(visTall(250, true), '250');
  assert.equal(visTall(12.3456, true), '12,35');
  assert.equal(visTall(Infinity, true), '');
  assert.equal(visTall(NaN, true), '');
});

test('visTall med færre gjeldende sifre gir færre desimaler', () => {
  assert.equal(visTall(1.8181, true, 2), '1,8');
  assert.equal(visTall(0.5, true, 2), '0,5');
});

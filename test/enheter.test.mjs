import assert from 'node:assert/strict';
import test from 'node:test';
import { ENHETER, allePar, konverter, parSlug, tall } from '../scripts/enheter.mjs';
import { enhetsSider } from '../scripts/en-enhetssider.mjs';

const naer = (a, b, tol = 1e-6) => assert.ok(Math.abs(a - b) <= tol * Math.max(1, Math.abs(b)), `${a} != ${b}`);

test('definisjonene stemmer med kjente verdier', () => {
  naer(konverter(1, 'cups', 'ml'), 236.5882365);
  naer(konverter(1, 'gallons', 'l'), 3.785411784);
  naer(konverter(1, 'lb', 'g'), 453.59237);
  naer(konverter(1, 'oz-vekt', 'g'), 28.349523125);
  naer(konverter(1, 'inches', 'cm'), 2.54);
  naer(konverter(1, 'tbsp', 'ml'), 14.78676478125);
  naer(konverter(1, 'tsp', 'ml'), 4.92892159375);
  naer(konverter(1, 'dl', 'ml'), 100);
  naer(konverter(250, 'ml', 'dl'), 2.5);
  naer(konverter(16, 'tbsp', 'cups'), 1, 1e-9);
  naer(konverter(3, 'tsp', 'tbsp'), 1, 1e-9);
  naer(konverter(8, 'oz', 'cups'), 1, 1e-9);
});

test('temperatur', () => {
  naer(konverter(100, 'c', 'f'), 212);
  naer(konverter(350, 'f', 'c'), 176.6666667);
  naer(konverter(-40, 'c', 'f'), -40);
});

test('omregning begge veier gir tilbake startverdien', () => {
  for (const [a, b] of allePar()) naer(konverter(konverter(7.5, a, b), b, a), 7.5, 1e-9);
});

test('formatering av tall uten unødvendige nuller', () => {
  assert.equal(tall(2.5), '2.5');
  assert.equal(tall(236.5882365), '236.6');
  assert.equal(tall(0.0123456), '0.01235');
  assert.equal(tall(1000), '1000');
});

test('en side per par, unike adresser, og hver side har kalkulator, tabell, Matlyst-grunn og FAQ', () => {
  const par = allePar();
  assert.equal(Object.keys(enhetsSider).length, par.length);
  assert.equal(new Set(par.map(([a, b]) => parSlug(a, b))).size, par.length);
  for (const [sti, s] of Object.entries(enhetsSider)) {
    assert.match(sti, /^tools\/[a-z-]+-to-[a-z-]+\/$/u);
    assert.ok(s.title.length <= 60, `${sti}: tittel ${s.title.length}`);
    assert.ok(s.description.length >= 100 && s.description.length <= 160, `${sti}: meta ${s.description.length}`);
    assert.match(s.rik, /class="omregner"/u, sti);
    assert.match(s.rik, /<table>/u, sti);
    assert.match(s.rik, /Stop converting by hand/u, sti);
    assert.match(s.rik, /Metric/u, sti);
    assert.ok(s.faq.length >= 7, sti);
    assert.doesNotMatch(s.rik, /[–—]/u, sti);
  }
});

test('enheter i samme gruppe kan regnes mellom, andre grupper kaster', () => {
  assert.throws(() => konverter(1, 'ml', 'g'));
  assert.ok(ENHETER.ml && ENHETER.f);
});

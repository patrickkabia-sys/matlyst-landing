import assert from 'node:assert/strict';
import test from 'node:test';
import { ENHETER, FLERTALL, HURTIG, HURTIG_BROK, KORT_ETIKETTER, START, allePar, enheterFor, enhetsKort, konverter, parSlug, tall } from '../scripts/enheter.mjs';
import { enhetsSider } from '../scripts/en-enhetssider.mjs';
import { presisTekst } from '../scripts/kalk-kort.mjs';

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

test('tall følger presisTekst', () => {
  assert.equal(tall(2.5), '2.5');
  assert.equal(tall(236.5882365), '236.6');
  assert.equal(tall(0.0123456), '0.01235');
  assert.equal(tall(1000), '1000');
  assert.equal(tall(0.00422675), '0.004227', 'fire gjeldende sifre også under 0,1');
  assert.equal(tall(3785.411784), '3785');
  assert.equal(tall(0), '0');
  assert.equal(tall(NaN), '');
  for (const n of [0.5, 7.25, 123.456, 0.000123456, 98765.4321, -0.4]) assert.equal(tall(n), presisTekst(n, 4), String(n));
});

const LANG = ['nb', 'sv', 'da', 'en'];
const verdi = (t) => (t.includes('/') ? t.split(' ').reduce((s, d) => s + (d.includes('/') ? Number(d.split('/')[0]) / Number(d.split('/')[1]) : Number(d)), 0) : Number(t.replace(',', '.')));

test('HURTIG har seks stigende mengder for hver enhet på hvert språk', () => {
  for (const lang of LANG) {
    for (const id of enheterFor(lang)) {
      const h = HURTIG[id];
      assert.ok(Array.isArray(h) && h.length === 6, `${lang} ${id}: seks mengder`);
      for (let i = 1; i < 6; i++) assert.ok(h[i] > h[i - 1], `${lang} ${id}: stigende`);
    }
  }
  for (const [id, h] of Object.entries(HURTIG_BROK)) {
    assert.equal(h.length, 6, id);
    for (let i = 1; i < 6; i++) assert.ok(verdi(h[i]) > verdi(h[i - 1]), `brøk ${id}: stigende`);
  }
  assert.deepEqual(Object.keys(HURTIG_BROK).sort(), ['cups', 'tbsp', 'tsp']);
  assert.deepEqual(HURTIG_BROK.cups, ['1/4', '1/3', '1/2', '1', '2', '4']);
  assert.deepEqual(START, { c: 180, f: 350 });
});

const kortData = (html) => JSON.parse(/<script type="application\/json" class="kalk-data">([\s\S]*?)<\/script>/u.exec(html)[1]);
const synlig = (html, felt) => new RegExp(`data-felt="${felt}"[^>]*>([^<]*)<`, 'u').exec(html)[1];

test('enhetsKort: data og statisk eksempel henger sammen', () => {
  // nb cups til dl. Ordformen følger FLERTALL (som blir «cup» når navnene byttes), tallene følger kilden.
  const nb = enhetsKort('nb', 'cups', 'dl');
  const d = kortData(nb);
  assert.match(nb, /^<form class="kalk" data-kalk="enhet" /u);
  assert.doesNotMatch(nb, /kalkvare/u);
  assert.equal(d.sifre, 4);
  assert.equal(d.beholdMengde, true);
  assert.equal(d.affin, undefined);
  assert.equal(d.negativ, undefined);
  assert.equal(d.brok, undefined);
  assert.equal(d.varer, undefined);
  assert.deepEqual(d.kort.cups, FLERTALL.nb.cups);
  assert.equal(d.kort.dl, 'dl');
  const valgt = [...nb.matchAll(/<select data-felt="fra">([\s\S]*?)<\/select>/gu)][0][1];
  const ids = [...valgt.matchAll(/<option value="([^"]+)"/gu)].map((m) => m[1]);
  assert.deepEqual(ids, enheterFor('nb').filter((id) => ENHETER[id].gruppe === 'volum'));
  for (const id of ids) assert.ok(d.stegFor[id] && d.steg[d.stegFor[id]]?.length === 6, id);
  assert.deepEqual(d.steg.dl, ['0,5', '1', '2', '3', '5', '10']);
  assert.equal(d.feil, KORT_ETIKETTER.nb.feil);
  assert.equal(synlig(nb, 'svar'), '2,366');
  assert.equal(synlig(nb, 'setning'), `1 ${FLERTALL.nb.cups[0]} = 2,366 dl`);
  assert.equal(d.ml.cups, 236.5882365);
  assert.deepEqual(d.g, {});
  // hurtigknappene i HTML er de samme som dataene
  assert.deepEqual([...nb.matchAll(/<button type="button" data-v="([^"]+)"/gu)].map((m) => m[1]), d.steg.cups);

  // nb celsius til fahrenheit
  const t = enhetsKort('nb', 'c', 'f');
  const td = kortData(t);
  assert.deepEqual(td.affin.c, [1, 0]);
  assert.ok(Math.abs(td.affin.f[0] - 5 / 9) < 1e-15 && Math.abs(td.affin.f[1] + 160 / 9) < 1e-13);
  assert.equal(td.negativ, true);
  assert.deepEqual(td.ml, {});
  assert.deepEqual(td.g, {});
  assert.match(t, /data-felt="mengde" type="text" inputmode="decimal" autocomplete="off" value="180"/u);
  assert.equal(synlig(t, 'setning'), '180 °C = 356 °F');

  // fahrenheit starter på 350
  assert.equal(synlig(enhetsKort('nb', 'f', 'c'), 'setning'), '350 °F = 176,7 °C');

  // vekt og lengde: faktorene ligger i riktig felt
  assert.deepEqual(kortData(enhetsKort('nb', 'lb', 'g')).g, { g: 1, kg: 1000, 'oz-vekt': 28.349523125, lb: 453.59237 });
  assert.equal(kortData(enhetsKort('nb', 'inches', 'cm')).ml.inches, 25.4);

  // en cups til ml: brøker, punktum og hurtigmengder som brøker
  const en = enhetsKort('en', 'cups', 'ml');
  const ed = kortData(en);
  assert.equal(ed.brok, true);
  assert.deepEqual(ed.steg.cups, HURTIG_BROK.cups);
  assert.deepEqual(ed.steg.tbsp, HURTIG_BROK.tbsp);
  assert.deepEqual(ed.steg.dl, ['0.5', '1', '2', '3', '5', '10'], 'enheter uten brøk har punktum');
  assert.equal(synlig(en, 'setning'), '1 cup = 236.6 ml');
  assert.match(en, /Amount/u);
  assert.deepEqual(kortData(enhetsKort('en', 'ml', 'dl')).steg.ml, ['50', '100', '150', '250', '500', '1000']);

  // ids avgrenser valglista (samlesidene)
  const hub = enhetsKort('nb', 'cups', 'ml', { ids: ['ml', 'dl', 'cups'] });
  assert.deepEqual([...[...hub.matchAll(/<select data-felt="fra">([\s\S]*?)<\/select>/gu)][0][1].matchAll(/<option value="([^"]+)"/gu)].map((m) => m[1]), ['ml', 'dl', 'cups']);
});

test('enhetsKort: hvert par på hvert språk har gyldig kort', () => {
  for (const lang of LANG) {
    assert.equal(typeof KORT_ETIKETTER[lang].aria(ENHETER.ml[lang], ENHETER.dl[lang]), 'string');
    for (const [fra, til] of allePar(lang)) {
      const html = enhetsKort(lang, fra, til);
      const d = kortData(html);
      const valg = [...html.matchAll(/<select data-felt="til">([\s\S]*?)<\/select>/gu)][0][1];
      for (const m of valg.matchAll(/<option value="([^"]+)"/gu)) assert.equal(d.steg[d.stegFor[m[1]]].length, 6, `${lang} ${fra}>${til} ${m[1]}`);
      assert.match(html, new RegExp(`<option value="${til}" selected>`, 'u'), `${lang} ${fra}>${til}`);
      assert.doesNotMatch(html, /[–—]/u);
      assert.ok(synlig(html, 'svar') !== '', `${lang} ${fra}>${til}: statisk svar`);
    }
  }
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

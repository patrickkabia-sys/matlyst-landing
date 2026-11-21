// Den delte kortkoden (scripts/kalk-kort.mjs): tallregelen med fire sifre og skjelettet uten varerad.
import assert from 'node:assert/strict';
import test from 'node:test';
import * as felles from '../scripts/familier/dl-til-gram/felles-mal.mjs';
import * as kort from '../scripts/kalk-kort.mjs';
import { presisTekst, kalkSkjelett } from '../scripts/kalk-kort.mjs';

test('presisTekst: fire gjeldende sifre, heltall fra 1000, aldri 0 for et tall som ikke er 0', () => {
  for (const [n, t] of [[236.5882365, '236.6'], [453.59237, '453.6'], [2.54, '2.54'], [0.2365882365, '0.2366'],
    [0.00422675, '0.004227'], [3785.411784, '3785'], [999.96, '1000'], [60566.6, '60567'], [0, '0'], [-0.4, '-0.4'], [100, '100']]) assert.equal(presisTekst(n), t, String(n));
  assert.equal(presisTekst(2.3658823, 4, { komma: true }), '2,366');
  assert.equal(presisTekst(0.00422675, 4, { komma: true }), '0,004227');
});

test('presisTekst: antall sifre kan velges, og halve runder opp også når flyttallet ligger like under', () => {
  assert.equal(presisTekst(1.005, 3), '1.01');
  assert.equal(presisTekst(2.675, 3), '2.68');
  assert.equal(presisTekst(12345.5, 4), '12346');
  assert.equal(presisTekst(12345.678, 7), '12346', '1000 og over er heltall uansett antall sifre');
  assert.equal(presisTekst(-12345.678, 7), '-12346');
});

test('felles-mal eksporterer det samme som før', () => {
  for (const navn of ['esc', 'tallI', 'sigTekst', 'gramTekst', 'mengdeTekst', 'PIL', 'BYTT', 'kalkSkjelett']) {
    assert.ok(navn in kort, `kalk-kort mangler ${navn}`);
    assert.equal(felles[navn], kort[navn], navn);
  }
});

const stub = {
  etiketter: { aria: 'Kalkulator: A til B', mengde: 'Mengde', fra: 'Fra', til: 'Til', bytt: 'Bytt', vanlige: 'Vanlige' },
  enheter: [['a', 'A'], ['b', 'B']], fra: 'a', til: 'b', data: { ml: {}, g: {} },
  start: { mengde: '1', svar: '2', setning: '1 a = 2 b', hurtig: [['1', '1 a']] },
};

test('kalkSkjelett: type blir data-kalk, og tom vareHtml gir ingen tom rad', () => {
  const uten = kalkSkjelett({ ...stub, vareHtml: '', type: 'enhet' });
  assert.match(uten, /^<form class="kalk" data-kalk="enhet" /u);
  assert.doesNotMatch(uten, /kalkvare/u);
  assert.match(uten, /aria-label="Kalkulator: A til B">\n {2}<div class="kalkrad">/u, 'ingen tom linje der varerada var');
  const med = kalkSkjelett({ ...stub, vareHtml: '<div class="kalkvare">V</div>' });
  assert.match(med, /data-kalk="volumvekt"/u, 'standardtypen er familiens');
  assert.match(med, /aria-label="Kalkulator: A til B">\n {2}<div class="kalkvare">V<\/div>\n {2}<div class="kalkrad">/u);
});

// Flertall i omregnerens svar: formene bor i enheter.mjs (FLERTALL), står i hver sides egne data
// (omregner-data, feltet `o`) og site.js har ingen formtabell selv. Testen låser sidene mot kilden.
// MIDLERTIDIG AVSLÅTT (oppgave 3): de norske sidene har kalkulatorkortet (form.kalk), ikke den gamle omregneren (omregner-data), og «kopp» er byttet med «cup».
// Filen slettes i oppgave 6; bøyingen vokter da test/omregner-sider.test.mjs og kalk-enhet.spec.mjs. Se docs/superpowers/plans/2026-11-21-omregnere-kalkulatorkort.md, oppgave 6.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { ENHETER, FLERTALL, omregnerData, ordFor } from '../scripts/enheter.mjs';
import { oppdater, svarMedOrd } from '../scripts/omregner-flertall.mjs';

const ROT = new URL('..', import.meta.url).pathname;
const filer = (m) => readdirSync(m).flatMap((n) => { const s = join(m, n); return statSync(s).isDirectory() ? filer(s) : n === 'index.html' ? [s] : []; });
const SIDER = ['verktoy', 'sv/verktyg', 'da/vaerktoejer', 'en/tools'].flatMap((m) => filer(join(ROT, m)));

test.skip('hver omregnerside har ordformene fra kilden i sine egne data, og svaret følger dem', () => {
  let medData = 0, medFlertall = 0;
  for (const fil of SIDER) {
    const html = readFileSync(fil, 'utf8');
    if (!html.includes('class="omregner-data"')) continue;
    medData++;
    const lang = /<html\b[^>]*\blang="([a-z]{2})/u.exec(html)[1];
    const data = JSON.parse(/class="omregner-data">([^<]*)</u.exec(html)[1]);
    assert.deepEqual(data, omregnerData(lang, data.f, data.t), fil);
    assert.equal(oppdater(html), html, `${fil} er ikke på linje med kilden`);
    if (data.o) medFlertall++;
  }
  assert.ok(medData >= 700, `forventet minst 700 omregnere, fant ${medData}`);
  assert.ok(medFlertall >= 600, `forventet minst 600 sider med flertall, fant ${medFlertall}`);
});

test.skip('svaret på siden bruker entall for nøyaktig 1 og flertall ellers', () => {
  const f = { ml: 1, cups: 236.5882365 };
  assert.equal(svarMedOrd('nb', f, '1 kopp = 236,6 ml'), '1 kopp = 236,6 ml');
  assert.equal(svarMedOrd('nb', f, '1 ml = 0,00423 kopp'), '1 ml = 0,00423 kopper');
  assert.equal(svarMedOrd('sv', f, '1 ml = 0,00423 kopp'), '1 ml = 0,00423 koppar');
  assert.equal(svarMedOrd('da', f, '1 ml = 0,00423 kop'), '1 ml = 0,00423 kopper');
  assert.equal(svarMedOrd('en', f, '1 ml = 0.00423 cup'), '1 ml = 0.00423 cups');
  assert.equal(svarMedOrd('en', f, '1 cup = 236.6 ml'), '1 cup = 236.6 ml');
  assert.equal(ordFor('en', 'cups', 1), 'cup');
  assert.equal(ordFor('en', 'cups', 1.5), 'cups');
  assert.equal(ordFor('nb', 'ml', 5), 'ml');
});

test.skip('entallsformen er sidens egen korte skrivemåte, og site.js har ingen formtabell', () => {
  for (const [lang, ider] of Object.entries(FLERTALL)) {
    for (const [id, [entall, flertall]] of Object.entries(ider)) {
      assert.notEqual(entall, flertall === entall ? '' : flertall, `${lang}/${id}`);
      if (!(id === 'inches')) assert.equal(entall, ENHETER[id][lang].kort, `${lang}/${id}: entall er enhetens kortform`);
    }
  }
  const js = readFileSync(join(ROT, 'site.js'), 'utf8');
  for (const form of Object.values(FLERTALL).flatMap((i) => Object.values(i).flat())) {
    if (form.length > 3) assert.ok(!new RegExp(`['"\`]${form}['"\`]`, 'u').test(js), `site.js hardkoder «${form}»`);
  }
  assert.match(js, /data\.o\[sel\.value\]/u);
});

test.skip('negative tall: −1 er entall i generatoren (samme regel som site.js)', () => {
  assert.equal(ordFor('en', 'cups', -1), 'cup');
  assert.equal(ordFor('en', 'cups', -2), 'cups');
  assert.equal(ordFor('nb', 'cups', -1), 'kopp');
  assert.equal(ordFor('sv', 'cups', -1.5), 'koppar');
  assert.equal(ordFor('da', 'cups', -1), 'kop');
  assert.match(readFileSync(join(ROT, 'site.js'), 'utf8'), /Math\.abs\(Number\(tall\(n\)\)\) === 1/u);
});

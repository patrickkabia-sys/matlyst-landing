import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { alleSider } from '../scripts/sidetyper.mjs';
import { rendre, trekkUt } from '../scripts/skall-paa.mjs';

const rot = fileURLToPath(new URL('..', import.meta.url));
// 875 sider utenom /: 872 undersider og de tre utenlandske forsidene.
// Også de utenlandske forsidene prøves, så ingen av brevets 875 sider faller utenfor.
const sider = alleSider(rot).filter((s) => s.sti !== '/');

test('uttrekk kaster for nøyaktig tjenestesidene i registeret', (t) => {
  const kast = [];
  for (const s of sider) {
    try { trekkUt(readFileSync(join(rot, s.fil), 'utf8'), s.sti); }
    catch (feil) { kast.push({ sti: s.sti, grunn: feil.message }); }
  }
  t.diagnostic(`${sider.length} sider utenom /: ${sider.length - kast.length} uttrekk og ${kast.length} kast`);
  for (const feil of kast) t.diagnostic(`${feil.sti}: ${feil.grunn}`);
  assert.deepEqual(kast.map((s) => s.sti).sort(), sider.filter((s) => s.type === 'tjeneste').map((s) => s.sti).sort());
});

test('alle sider utenom norsk forside rendres to ganger i minnet uten kast eller endrede bytes', (t) => {
  const utrullet = new Set(sider.map((s) => s.nokkel));
  const kast = [], ulike = [];
  for (const s of sider) {
    try {
      const en = rendre(readFileSync(join(rot, s.fil), 'utf8'), s.sti, utrullet);
      if (s.type !== 'tjeneste') {
        assert.ok(en.includes('<!-- skall:topp -->') && en.includes('<!-- skall:bunn -->'), `${s.sti}: mangler rendret skall`);
      }
      const to = rendre(en, s.sti, utrullet);
      if (en !== to) ulike.push(s.sti);
    } catch (feil) { kast.push({ sti: s.sti, grunn: feil.message }); }
  }
  t.diagnostic(`${sider.length} sider utenom /: ${kast.length} kast, ${ulike.length} ulike og ${sider.length - kast.length - ulike.length} byte-identiske`);
  assert.deepEqual(kast, []);
  assert.deepEqual(ulike, []);
});

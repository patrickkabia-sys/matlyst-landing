// PR-utvalget: håndskrevne sider i sin helhet, tre per generert familie og språk,
// eksempelsidene, og sidene PR-en selv endrer.
import assert from 'node:assert/strict';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { alleSider, erGenerertFamilie } from '../scripts/sidetyper.mjs';
import { utvalg, utrulledeTyper } from './playwright/hjelp/utvalg.mjs';

const ROT = fileURLToPath(new URL('..', import.meta.url));

// Kontrollen går over alle familiene i alleSider(), ikke bare de som finnes i resultatet:
// en familie som faller helt ut av utvalget skal gi rødt.
export function kontrollerUtvalg(rader, sider) {
  const perFam = Map.groupBy(rader, (r) => `${sider.get(r.sti).familie}|${r.sprak}`);
  const alle = Map.groupBy([...sider.values()], (s) => `${s.familie}|${s.sprak}`);
  for (const [nokkel, iAlt] of alle) {
    if (nokkel.startsWith('null|')) continue;
    const liste = perFam.get(nokkel) ?? [];
    if (!erGenerertFamilie(nokkel.split('|')[0])) {
      // Håndskrevne: hver side er med.
      assert.equal(liste.length, iAlt.filter((s) => rader.some((r) => r.sti === s.sti)).length, nokkel);
      continue;
    }
    // Små familier (temperatur har to sider per språk) tas hele. Eksempelsiden kan gi én ekstra.
    assert.ok(liste.length >= Math.min(3, iAlt.length) && liste.length <= 4, `${nokkel}: ${liste.length} av ${iAlt.length}`);
  }
}
test('PR-utvalget har tre per generert familie og språk, og alt det håndskrevne', () => {
  const rader = utvalg({ revisjon: 'pr', endret: [] });
  const sider = new Map(alleSider(ROT).map((s) => [s.sti, s]));
  kontrollerUtvalg(rader, sider);
  // Datadrevne familier av typen guide-lang (ukemenyene, holdbarhet, frysing) er generert og tas med som utvalg, ikke hele.
  const handskrevne = [...sider.values()].filter((s) => ['guide-lang', 'guide-kort', 'blogg', 'juss'].includes(s.type) && !erGenerertFamilie(s.familie));
  for (const s of handskrevne) assert.ok(rader.some((r) => r.sti === s.sti), s.sti);
  assert.ok(rader.length < 355, `utvalget er ${rader.length} sider`);
});
test('kontrollen blir rød når en hel generert familie mangler i utvalget', () => {
  const rader = utvalg({ revisjon: 'pr', endret: [] });
  const sider = new Map(alleSider(ROT).map((s) => [s.sti, s]));
  const utenVolum = rader.filter((r) => sider.get(r.sti).familie !== 'omregner:volum');
  assert.ok(utenVolum.length < rader.length);
  assert.throws(() => kontrollerUtvalg(utenVolum, sider), /omregner:volum/u);
});
test('utvalget er likt fra kjøring til kjøring', () => {
  assert.deepEqual(utvalg({ revisjon: 'pr', endret: [] }), utvalg({ revisjon: 'pr', endret: [] }));
});
test('endrede sider tas med, med tak per familie og språk', () => {
  const nbVolum = alleSider(ROT).filter((s) => s.familie === 'omregner:volum' && s.sprak === 'nb');
  const stier = new Set(nbVolum.map((s) => s.sti));
  const rader = utvalg({ revisjon: 'pr', endret: nbVolum.map((s) => s.fil) });
  const antall = rader.filter((r) => stier.has(r.sti)).length;
  assert.ok(antall >= 40 && antall <= 44, String(antall));
});
test('slettede filer og filer som ikke er sider hoppes over', () => {
  assert.doesNotThrow(() => utvalg({ revisjon: 'pr', endret: ['verktoy/finnes-ikke/index.html', 'side.css', ''] }));
});
test('hver utrullet type har minst én side i PR-utvalget', () => {
  const typer = new Set(utvalg({ revisjon: 'pr', endret: [] }).map((r) => r.type));
  for (const t of utrulledeTyper()) assert.ok(typer.has(t), t);
});
test('REVISJON_ENDRET leses fra fil, og mangler fila er lista tom', async () => {
  const { mkdtempSync, writeFileSync, rmSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const gammel = process.env.REVISJON_ENDRET;
  const mappe = mkdtempSync(join(tmpdir(), 'utvalg-'));
  try {
    const volum = alleSider(ROT).filter((s) => s.familie === 'omregner:volum' && s.sprak === 'nb');
    writeFileSync(join(mappe, 'endret.txt'), `${volum.map((s) => s.fil).join('\n')}\n`);
    process.env.REVISJON_ENDRET = join(mappe, 'endret.txt');
    const med = utvalg({ revisjon: 'pr' }).length;
    process.env.REVISJON_ENDRET = join(mappe, 'finnes-ikke.txt');
    const uten = utvalg({ revisjon: 'pr' }).length;
    assert.ok(med > uten, `${med} mot ${uten}`);
    assert.equal(uten, utvalg({ revisjon: 'pr', endret: [] }).length);
  } finally {
    if (gammel === undefined) delete process.env.REVISJON_ENDRET; else process.env.REVISJON_ENDRET = gammel;
    rmSync(mappe, { recursive: true, force: true });
  }
});

import assert from 'node:assert/strict';
import { cpSync, readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import test from 'node:test';
import { kjor, forhandsvis } from '../scripts/skall-paa.mjs';

const rot = fileURLToPath(new URL('..', import.meta.url));
const fil = 'verktoy/kopp-til-dl/index.html';
const original = readFileSync(join(rot, fil), 'utf8');
function oppsett(t) {
  const tmp = mkdtempSync(join(tmpdir(), 'skall-trygg-'));
  t.after(() => rmSync(tmp, { recursive: true, force: true }));
  const inne = join(tmp, 'rot'), ute = join(tmp, 'rot-utenfor');
  mkdirSync(join(inne, dirname(fil)), { recursive: true });
  mkdirSync(ute);
  writeFileSync(join(inne, fil), original);
  writeFileSync(join(ute, 'index.html'), original);
  return { inne, ute };
}

test('kjor og forhåndsvisning hopper over symlenkede kildefiler og mapper', (t) => {
  const { inne, ute } = oppsett(t);
  symlinkSync(join(ute, 'index.html'), join(inne, 'verktoy/lenke.html'));
  symlinkSync(ute, join(inne, 'verktoy/lenkemappe'));
  assert.deepEqual(kjor(inne, new Set(['omregner'])), [fil]);
  assert.equal(forhandsvis(inne).length, 1);
  assert.equal(readFileSync(join(ute, 'index.html'), 'utf8'), original);
});

for (const modus of ['kjor', 'forhandsvis']) for (const tjeneste of [false, true]) {
  test(`${modus} leser ikke en kilde som blir symlenke etter skanningen (${tjeneste ? 'tjeneste' : 'omregner'})`, (t) => {
    const { inne, ute } = oppsett(t);
    cpSync(join(rot, 'scripts'), join(inne, 'scripts'), { recursive: true });
    const kilde = tjeneste ? 'tiktok-auth/index.html' : fil;
    if (tjeneste) {
      mkdirSync(join(inne, 'tiktok-auth'));
      writeFileSync(join(inne, kilde), readFileSync(join(rot, kilde)));
    }
    // Byttet skjer etter ekte skanning, før kjøreren får listen. Slik prøves
    // kjørerens eget vern også når alleSider allerede hopper over symlenker.
    const register = join(inne, 'scripts/sidetyper.mjs');
    writeFileSync(register, readFileSync(register, 'utf8').replace('export function alleSider(rot)', 'function skannSider(rot)') + `
import { rmSync as fjernTestfil, symlinkSync as lenkTestfil } from 'node:fs';
export function alleSider(rot) {
  const sider = skannSider(rot);
  fjernTestfil(join(rot, ${JSON.stringify(kilde)}));
  lenkTestfil(${JSON.stringify(join(ute, 'index.html'))}, join(rot, ${JSON.stringify(kilde)}));
  return sider;
}
`);
    const program = `
import fs from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
const les = fs.readFileSync;
fs.readFileSync = function (fil, ...valg) {
  if (fs.realpathSync(fil) === fs.realpathSync(${JSON.stringify(join(ute, 'index.html'))})) throw new Error('Leste utenfor roten');
  return les(fil, ...valg);
};
syncBuiltinESMExports();
const skall = await import(${JSON.stringify(join(inne, 'scripts/skall-paa.mjs'))});
const resultat = skall.${modus}(${JSON.stringify(inne)}, new Set(['omregner', 'tjeneste:auth']));
console.log(JSON.stringify(resultat));
`;
    const resultat = JSON.parse(execFileSync('/opt/homebrew/bin/node', ['--input-type=module', '-e', program], { encoding: 'utf8' }));
    assert.equal(resultat.length, tjeneste ? 1 : 0);
    assert.equal(readFileSync(join(ute, 'index.html'), 'utf8'), original);
  });
}

for (const variant of ['fil', 'manglende fil', 'mappe', 'qa', 'kart']) {
  test(`forhåndsvisning skriver ikke gjennom symlenke i målet: ${variant}`, (t) => {
    const { inne, ute } = oppsett(t);
    const mal = join(inne, 'qa/forhandsvisning');
    if (variant === 'qa') symlinkSync(ute, join(inne, 'qa'));
    else {
      mkdirSync(join(mal, dirname(fil)), { recursive: true });
      if (variant === 'mappe') {
        rmSync(join(mal, 'verktoy'), { recursive: true });
        symlinkSync(ute, join(mal, 'verktoy'));
      } else if (variant === 'kart') symlinkSync(join(ute, 'index.html'), join(mal, 'kart.json'));
      else symlinkSync(join(ute, variant === 'fil' ? 'index.html' : 'mangler.html'), join(mal, fil));
    }
    const kart = forhandsvis(inne);
    if (variant !== 'kart') assert.deepEqual(kart, [], 'usikre mål må ikke stå i kartet');
    assert.equal(readFileSync(join(ute, 'index.html'), 'utf8'), original);
    for (const navn of ['mangler.html', 'kopp-til-dl', 'forhandsvisning', 'kart.json']) assert.equal(existsSync(join(ute, navn)), false, navn);
    assert.equal(readFileSync(join(inne, fil), 'utf8'), original);
  });
}

test('kjor sjekker kilden på nytt før skriving hvis den byttes etter lesing', (t) => {
  const { inne, ute } = oppsett(t);
  cpSync(join(rot, 'scripts'), join(inne, 'scripts'), { recursive: true });
  const program = `
import fs from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
const les = fs.readFileSync, kilde = ${JSON.stringify(join(inne, fil))};
let antall = 0;
fs.readFileSync = function (fil, ...valg) {
  const innhold = les(fil, ...valg);
  if (String(fil) === kilde && ++antall === 2) {
    fs.rmSync(kilde);
    fs.symlinkSync(${JSON.stringify(join(ute, 'index.html'))}, kilde);
  }
  return innhold;
};
syncBuiltinESMExports();
const { kjor } = await import(${JSON.stringify(join(inne, 'scripts/skall-paa.mjs'))});
console.log(JSON.stringify(kjor(${JSON.stringify(inne)}, new Set(['omregner']))));
if (antall !== 2) throw new Error('Kildebyttet ble ikke prøvd');
`;
  assert.deepEqual(JSON.parse(execFileSync('/opt/homebrew/bin/node', ['--input-type=module', '-e', program], { encoding: 'utf8' })), []);
  assert.equal(readFileSync(join(ute, 'index.html'), 'utf8'), original);
});

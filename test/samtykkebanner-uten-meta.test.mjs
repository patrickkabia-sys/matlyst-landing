// Meta Pixel er fjernet (vedtak 13.10). Ingen samtykkebanner på noen side eller
// noe språk skal nevne Meta Pixel eller Facebook.
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const ROT = new URL('..', import.meta.url).pathname;

function* html(dir) {
  for (const navn of readdirSync(dir)) {
    if (['node_modules', '.git', 'fonts', 'images', 'test', 'qa', 'docs'].includes(navn)) continue;
    const sti = join(dir, navn);
    if (statSync(sti).isDirectory()) yield* html(sti);
    else if (navn.endsWith('.html')) yield sti;
  }
}

test('ingen samtykkebanner nevner Meta Pixel eller Facebook', () => {
  let bannere = 0;
  const brudd = [];
  for (const fil of html(ROT)) {
    const kilde = readFileSync(fil, 'utf8');
    const start = kilde.indexOf('<div class="cookie"');
    if (start === -1) continue;
    const slutt = kilde.indexOf('id="ck-reject"', start);
    assert.ok(slutt > start, `${fil}: fant ikke slutten på banneret`);
    bannere++;
    if (/meta pixel|facebook|fbq/iu.test(kilde.slice(start, slutt))) brudd.push(fil.slice(ROT.length));
  }
  assert.ok(bannere >= 40, `fant bare ${bannere} bannere`);
  assert.deepEqual(brudd, []);
});

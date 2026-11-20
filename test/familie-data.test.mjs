// Dataskjemaet for sidefamilier: bare tall med kilde slipper gjennom, og feilen navngir raden.
import assert from 'node:assert/strict';
import { copyFileSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { kilderFor, lesData, publiserbare, validerData } from '../scripts/familier/felles.mjs';

const FIKS = new URL('./fiksturer/familier/', import.meta.url);
const PROEVE = fileURLToPath(new URL('proeve/', FIKS));
const rod = (navn) => JSON.parse(readFileSync(new URL(`rode/${navn}.json`, FIKS), 'utf8'));

test('den grønne fiksturen går gjennom på begge markeder', () => {
  const nb = lesData(PROEVE, 'nb');
  const en = lesData(PROEVE, 'en');
  assert.equal(nb.familie, 'proeve');
  assert.equal(nb.rader.length, 3);
  assert.equal(en.rader.length, 2);
});

test('bare kontrollerte rader er publiserbare', () => {
  const nb = lesData(PROEVE, 'nb');
  assert.deepEqual(publiserbare(nb).map((r) => r.id), ['provemel', 'provesukker']);
  assert.deepEqual(nb.rader.filter((r) => r.status === 'utkast').map((r) => r.id), ['provesalt']);
});

test('kilder for rader er de radene faktisk bruker, i rekkefølgen de først nevnes', () => {
  const nb = lesData(PROEVE, 'nb');
  assert.deepEqual(kilderFor(nb, [nb.rader[0]]).map((k) => k.navn), ['Prøvetabellen', 'Prøveboka']);
  assert.deepEqual(kilderFor(nb, [nb.rader[1]]).map((k) => k.navn), ['Prøvetabellen']);
  assert.deepEqual(kilderFor(nb, [nb.rader[1], nb.rader[0]]).map((k) => k.navn), ['Prøvetabellen', 'Prøveboka']);
});

// Hver rød fiksturs rad (eller kilde) som meldingen skal navngi.
const RODE = {
  'tall-uten-kilde': 'provemel',
  'kilde-uten-hentedato': 'provemel',
  'kilde-uten-https': 'provemel',
  'lik-slug': 'provesukker',
  'lik-id': 'provemel',
  'kontrollert-uten-dato': 'provemel',
  'rad-uten-tall': 'provesukker',
  'ukjent-kilde': 'provemel',
  'prototypekilde-constructor': 'provemel',
  'prototypekilde-toString': 'provemel',
  'prototypekilde-proto': 'provemel',
  'prototypekilde-hoved-constructor': 'provemel',
  'prototypekilde-hoved-toString': 'provemel',
  'prototypekilde-hoved-proto': 'provemel',
};

test('de røde fiksturene er alle med i oversikten', () => {
  const filer = readdirSync(new URL('rode/', FIKS)).map((f) => f.replace(/\.json$/u, '')).sort();
  assert.deepEqual(filer, Object.keys(RODE).sort());
});

for (const [navn, radId] of Object.entries(RODE)) {
  test(`rød fikstur ${navn} stopper bygget og navngir raden`, () => {
    assert.throws(
      () => validerData(rod(navn)),
      (feil) => {
        assert.ok(feil instanceof Error);
        assert.ok(feil.message.startsWith(`rode/nb/${radId}:`), feil.message);
        if (navn.startsWith('prototypekilde')) assert.match(feil.message, /ikke finnes i kilder/u);
        return true;
      },
    );
  });
}

test('en datafil som sier et annet marked enn filnavnet, avvises', () => {
  const mappe = mkdtempSync(join(tmpdir(), 'familie-data-'));
  try {
    copyFileSync(join(PROEVE, 'data.nb.json'), join(mappe, 'data.sv.json'));
    assert.throws(() => lesData(mappe, 'sv'), /proeve\/sv\/data: .*marked «nb»/u);
    assert.throws(() => lesData(mappe, 'da'), { code: 'ENOENT' });
  } finally {
    rmSync(mappe, { recursive: true, force: true });
  }
});

test('en grønn fikstur med ett tall endret til rød feiler (vakten kan bli rød)', () => {
  const d = JSON.parse(readFileSync(new URL('proeve/data.nb.json', FIKS), 'utf8'));
  assert.doesNotThrow(() => validerData(d));
  delete d.rader[1].tall.gramPerDl.kilde;
  assert.throws(() => validerData(d), /^Error: proeve\/nb\/provesukker:/u);
});

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { HYLLER } from '../scripts/hyller.mjs';

const rot = fileURLToPath(new URL('..', import.meta.url));
const bilde = (sti) => join(rot, 'images/forside', sti);
const FILER = [
  ...['nb', 'sv', 'da', 'en'].flatMap((l) => [`film/import-${l}.mp4`, `film/import-${l}-plakat.webp`]),
  'mat/butterchicken.webp', 'mat/laks.webp', 'mat/focaccia.webp', 'mat/ramen.webp',
  'mat/kanelboller.webp', 'mat/taco.webp', 'mat/tomatpasta.webp', 'mat/sjokoladekake.webp',
  'mat/mini-butter.webp', 'mat/mini-taco.webp',
  'folk/01.webp', 'folk/02.webp', 'folk/03.webp', 'folk/04.webp',
  'folk/05.webp', 'folk/06.webp', 'folk/07.webp', 'folk/08.webp',
  'folk/09.webp', 'folk/10.webp', 'folk/11.webp', 'folk/12.webp',
  'logo/01.webp', 'logo/02.webp', 'logo/03.webp', 'logo/04.webp',
  'logo/05.webp', 'logo/06.webp', 'logo/07.webp', 'logo/08.webp',
  'logo/09.webp', 'logo/10.webp', 'logo/11.webp', 'logo/12.webp',
  'logo/13.webp', 'logo/14.webp', 'logo/15.webp', 'logo/16.webp',
  'logo/17.webp', 'logo/18.webp', 'logo/19.webp', 'logo/20.webp',
  'logo/21.webp', 'logo/22.webp', 'logo/23.webp', 'logo/24.webp',
  'logo/25.webp', 'logo/26.webp', 'logo/27.webp', 'logo/28.webp',
  'logo/29.webp', 'logo/30.webp', 'logo/31.webp', 'logo/32.webp',
  'logo/33.webp', 'logo/34.webp', 'logo/35.webp', 'logo/36.webp',
  'logo/37.webp', 'logo/38.webp', 'logo/39.webp', 'logo/40.webp',
  'logo/3eef40.webp', 'logo/77b354.webp', 'logo/a201c1.webp',
  'logo/b3fdbf.webp', 'logo/e99f71.webp',
  'kule.png', 'qr-app.svg',
];

test('alle filene forsiden bruker, finnes', () => {
  for (const sti of FILER) assert.ok(existsSync(bilde(sti)), sti);
});

test('filmen er under 2,5 MB og plakaten under 100 kB', () => {
  for (const l of ['nb', 'sv', 'da', 'en']) {
    assert.ok(statSync(bilde(`film/import-${l}.mp4`)).size < 2_500_000, `${l}: filmen er for stor`);
    assert.ok(statSync(bilde(`film/import-${l}-plakat.webp`)).size < 100_000, `${l}: plakaten er for stor`);
  }
});

test('QR-koden er en SVG med 25 ruter i hver retning', () => {
  assert.match(readFileSync(bilde('qr-app.svg'), 'utf8'), /<svg\b[^>]*\bviewBox="0 0 25 25"/u);
});

test('QR-koden er identisk med den dekodede koden til https://matlyst-app.no/app', () => {
  // Endres QR-koden, skal den dekodes og SHA-256-verdien oppdateres.
  const sum = createHash('sha256').update(readFileSync(bilde('qr-app.svg'))).digest('hex');
  assert.equal(sum, '6cc25d005e0ff6d4d72ba928c420229133f2482c1362836666d4ae87ea12b131');
});

test('QR-koden har SVG-navnerom og fast farge når den lastes som bilde', () => {
  const svg = readFileSync(bilde('qr-app.svg'), 'utf8');
  assert.match(svg, /<svg\b[^>]*\bxmlns="http:\/\/www\.w3\.org\/2000\/svg"/u);
  assert.match(svg, /<path\b[^>]*\bfill="#141210"/u);
  assert.doesNotMatch(svg, /currentColor/iu);
});

test('hver flis i HYLLER.nb finnes i images/forside/logo', () => {
  assert.ok(HYLLER.nb.length > 0, 'hyllelista er tom');
  for (const { flis } of HYLLER.nb) assert.ok(existsSync(bilde(`logo/${flis}`)), flis);
});

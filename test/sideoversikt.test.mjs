// docs/SIDEOVERSIKT.md genereres av scripts/sideoversikt.mjs. Testen vokter at tallene stemmer med sitemapene, at hver familie i
// registeret har en rad, at fila er stabil, og at den aldri havner i sitemap, llms.txt eller den publiserte sida.
import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FAMILIER } from '../scripts/familier/register.mjs';
import { KJEDE } from '../scripts/kjede.mjs';
import { SITEMAPER } from '../scripts/lastmod.mjs';
import { UTFIL, byggOversikt, lesSitemap } from '../scripts/sideoversikt.mjs';

const rot = fileURLToPath(new URL('..', import.meta.url));
const doc = byggOversikt(rot);
const adresseLinjer = (tekst) => {
  const fra = tekst.indexOf('\n## Alle adresser');
  assert.ok(fra > -1, 'avsnittet «Alle adresser» finnes');
  return tekst.slice(fra).split('\n').filter((l) => /^- https:\/\/matlyst-app\.no\//u.test(l));
};

test('antall adresser i dokumentet er lik antall i sitemapene, og hver adresse står én gang', () => {
  const sitemap = SITEMAPER.flatMap((f) => [...readFileSync(join(rot, f), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/gu)].map((m) => m[1]));
  assert.ok(sitemap.length > 500, 'sitemapene ble lest');
  const linjer = adresseLinjer(doc).map((l) => l.slice(2).split(' ')[0]);
  assert.equal(linjer.length, sitemap.length);
  assert.deepEqual([...linjer].sort(), [...sitemap].sort());
  assert.match(doc, new RegExp(`Sider i sitemap: \\*\\*${sitemap.length}\\*\\*`, 'u'));
});

test('hver familie i registeret har en rad i tabellen', () => {
  assert.ok(FAMILIER.length >= 2);
  for (const f of FAMILIER) assert.match(doc, new RegExp(`^\\| familie:${f.id} \\|`, 'mu'), `familie ${f.id} mangler rad`);
});

test('en familie som kommer i registeret får rad uten at noe annet endres', () => {
  const ny = { id: 'ny-familie-uten-sider', sidetype: 'guide-lang', markeder: { nb: { rot: 'ny-familie-uten-sider/' } } };
  const tekst = byggOversikt(rot, [...FAMILIER, ny]);
  assert.match(tekst, /^\| familie:ny-familie-uten-sider \|/mu);
  assert.equal(adresseLinjer(tekst).length, adresseLinjer(doc).length);
});

test('hver adresse har gruppe, og radene har rot per språk, antall og siste endring', () => {
  assert.match(doc, /### Uten gruppe\n\n(Ingen\.|Adresser i sitemap)/u);
  assert.match(doc, /^\| Gruppe \| Hva \| Type \| Rot nb \| Rot sv \| Rot da \| Rot en \| Generator \/ innholdskilde \| Datafil \| Siste endring \|$/mu);
  assert.match(doc, /^\| forside \|.*`\/` \(1\) \| `\/sv\/` \(1\) \| `\/da\/` \(1\) \| `\/en\/` \(1\) \|/mu);
  // Tom celle betyr «finnes ikke»: julemiddag finnes på norsk og dansk (juleaften), ikke på svensk og engelsk.
  assert.match(doc, /^\| julemiddag \|[^|]*\|[^|]*\| `\/julemiddag\/` \(1\) \| {2}\| `\/da\/juleaften\/` \(1\) \| {2}\|/mu);
  assert.match(doc, /### Familier og grupper som mangler på et språk[\s\S]*\| julemiddag \| nb, da \| sv, en \|/u);
});

test('en ukjent adresse havner i «Uten gruppe» i stedet for å forsvinne', () => {
  const m = mkdtempSync(join(tmpdir(), 'sideoversikt-'));
  try {
    for (const f of SITEMAPER) writeFileSync(join(m, f), '<urlset></urlset>');
    writeFileSync(join(m, 'sitemap.xml'), '<urlset><url><loc>https://matlyst-app.no/helt-ukjent/</loc><lastmod>2026-01-01</lastmod></url></urlset>');
    mkdirSync(join(m, 'helt-ukjent'));
    writeFileSync(join(m, 'helt-ukjent/index.html'), '<!doctype html><title>Ukjent</title><main>x</main>');
    mkdirSync(join(m, 'scripts'));
    const tekst = byggOversikt(m);
    assert.match(tekst, /### Uten gruppe\n\nAdresser i sitemap[^\n]*\n\n- https:\/\/matlyst-app\.no\/helt-ukjent\//u);
    assert.equal(adresseLinjer(tekst).length, 1);
  } finally {
    rmSync(m, { recursive: true, force: true });
  }
});

test('dokumentet er uendret ved ny kjøring og har ingen genereringsdato', () => {
  assert.equal(byggOversikt(rot), doc);
  const datoer = doc.split('\n## Alle adresser')[0].match(/\d{4}-\d{2}-\d{2}/gu) ?? [];
  const sitemapDatoer = new Set(lesSitemap(rot).map((s) => s.lastmod));
  for (const d of datoer) assert.ok(sitemapDatoer.has(d), `datoen ${d} kommer ikke fra en lastmod i sitemapene`);
});

test('den lagrede fila er lik det generatoren gir nå', () => {
  assert.ok(existsSync(join(rot, UTFIL)), 'kjør node scripts/sideoversikt.mjs');
  assert.equal(readFileSync(join(rot, UTFIL), 'utf8'), doc);
});

test('sideoversikt er siste trinn i kjeden og fila publiseres ikke', () => {
  assert.equal(KJEDE.at(-1), 'sideoversikt');
  const config = readFileSync(join(rot, '_config.yml'), 'utf8');
  assert.match(config, /^\s+-\s+docs\s*$/mu, 'docs ligger i exclude i _config.yml');
  assert.ok(UTFIL.startsWith('docs/'));
  for (const f of [...SITEMAPER, 'sitemap-index.xml', 'llms.txt']) assert.ok(!/SIDEOVERSIKT/iu.test(readFileSync(join(rot, f), 'utf8')), `${f} nevner sideoversikten`);
});

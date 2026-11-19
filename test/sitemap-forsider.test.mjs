import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { kopier } from '../scripts/kjedeproeve.mjs';

const repoRot = fileURLToPath(new URL('..', import.meta.url));

// Forsidene skrives av forside.mjs, ikke av generer-lokalsider. De skal likevel stå i språksitemapen
// når sitemapene bygges på nytt. Kjøres i en temp-kopi, aldri mot arbeidskopien.
test('språksitemapene har forsiden etter at generer-lokalsider er kjørt', () => {
  const kopi = mkdtempSync(join(tmpdir(), 'matlyst-sitemap-'));
  try {
    kopier(repoRot, kopi);
    execFileSync(process.execPath, ['scripts/generer-lokalsider.mjs'], { cwd: kopi, stdio: 'pipe' });
    for (const sprak of ['sv', 'da', 'en']) {
      const xml = readFileSync(join(kopi, `sitemap-${sprak}.xml`), 'utf8');
      const blokk = xml.match(new RegExp(`<url>\\s*<loc>https://matlyst-app\\.no/${sprak}/</loc>[\\s\\S]*?</url>`, 'u'))?.[0];
      assert.ok(blokk, `/${sprak}/ mangler i sitemap-${sprak}.xml`);
      for (const kode of ['nb-NO', 'sv-SE', 'da-DK', 'en', 'x-default']) assert.match(blokk, new RegExp(`hreflang="${kode}"`, 'u'), `${sprak}: ${kode}`);
    }
  } finally { rmSync(kopi, { recursive: true, force: true }); }
});

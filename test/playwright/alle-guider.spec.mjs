// «Alle guider» i hylledelen: tom boks er usynlig og ute av tilgjengelighetstreet,
// og en boks med guideblokk er synlig og sammenfoldet.
import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { settInn } from '../../scripts/guidelenker.mjs';

const BLOKK = '<!-- guider:bunn --><div class="f-guider" role="navigation" aria-label="Guider"><a href="/importer-oppskrifter/">Importer oppskrifter</a></div><!-- /guider:bunn -->';

test('tom «Alle guider» er display:none og ikke i tilgjengelighetstreet', async ({ page }) => {
  await page.goto('/');
  const boks = page.locator('details.alle-guider');
  await expect(boks).toHaveCount(1);
  expect(await boks.evaluate((e) => getComputedStyle(e).display)).toBe('none');
  await expect(boks.locator('summary')).toBeHidden();
  const tre = await page.locator('body').ariaSnapshot();
  expect(tre).not.toContain('Alle guider');
  await expect(page.getByRole('group', { name: 'Alle guider' })).toHaveCount(0);
});

test('«Alle guider» med guideblokk er synlig og sammenfoldet', async ({ page }) => {
  const html = settInn(readFileSync(new URL('../../index.html', import.meta.url), 'utf8'), BLOKK);
  await page.route('**/', (rute) => (new URL(rute.request().url()).pathname === '/' ? rute.fulfill({ contentType: 'text/html', body: html }) : rute.fallback()));
  await page.goto('/');
  const boks = page.locator('details.alle-guider');
  expect(await boks.evaluate((e) => getComputedStyle(e).display)).not.toBe('none');
  await expect(boks.locator('summary')).toBeVisible();
  expect(await boks.evaluate((e) => e.open)).toBe(false);
  await expect(boks.locator('.f-guider a')).toBeHidden();
  await boks.locator('summary').click();
  await expect(boks.locator('.f-guider a')).toBeVisible();
  expect(await page.locator('body').ariaSnapshot()).toContain('Alle guider');
});

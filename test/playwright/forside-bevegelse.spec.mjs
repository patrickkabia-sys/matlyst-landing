import { test, expect } from '@playwright/test';
import { STI, SPRAK } from './hjelp/sprak.mjs';

test.use({ viewport: { width: 1280, height: 800 }, reducedMotion: 'no-preference' });

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('matlyst-consent', 'denied'));
  await page.goto(STI);
});

async function rullTil(page, velger) {
  await page.locator(velger).evaluate((element) => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
}

test('filmen står utenfor bildet og spiller når den kommer tilbake', async ({ page }) => {
  const film = page.locator('.film video');
  await expect.poll(() => film.evaluate((video) => video.paused)).toBe(false);
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await expect.poll(() => film.evaluate((video) => video.getBoundingClientRect().bottom)).toBeLessThan(0);
  await expect.poll(() => film.evaluate((video) => video.paused)).toBe(true);
  await rullTil(page, '.film');
  await expect.poll(() => film.evaluate((video) => video.paused)).toBe(false);
});

test('samlebåndet står utenfor bildet og går når det kommer tilbake', async ({ page }) => {
  const bane = page.locator('.bane');
  await rullTil(page, '.band');
  await expect(bane).toHaveCSS('animation-play-state', 'running');
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await expect.poll(() => bane.evaluate((element) => element.getBoundingClientRect().bottom)).toBeLessThan(0);
  await expect(bane).toHaveCSS('animation-play-state', 'paused');
  await rullTil(page, '.band');
  await expect(bane).toHaveCSS('animation-play-state', 'running');
});

test('trykk og peker over filmen og båndet stopper ikke bevegelsen', async ({ page }) => {
  const film = page.locator('.film video');
  await rullTil(page, '.film');
  await film.hover();
  await film.click();
  await expect.poll(() => film.evaluate((video) => video.paused)).toBe(false);
  await rullTil(page, '.band');
  await page.locator('.band').hover();
  await page.locator('.band').click();
  await expect(page.locator('.bane')).toHaveCSS('animation-play-state', 'running');
});

test('redusert bevegelse viser at stegene er inaktive og holder filmen stille', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const knapp of await page.locator('.st').all()) {
    await expect(knapp).toHaveAttribute('aria-disabled', 'true');
    await expect(knapp).toHaveCSS('cursor', 'default');
  }
  await page.locator('.st').nth(3).click({ force: true });
  const film = page.locator('.film video');
  await expect.poll(() => film.evaluate((video) => video.paused)).toBe(true);
  await expect(film).not.toHaveAttribute('src');
  await rullTil(page, '.band');
  await expect(page.locator('.bane')).toHaveCSS('animation-name', 'none');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await rullTil(page, '.film');
  await expect(page.locator('.st').first()).not.toHaveAttribute('aria-disabled', 'true');
  await expect.poll(() => film.evaluate((video) => video.paused)).toBe(false);
});

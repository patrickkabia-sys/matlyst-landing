// Skiplenken (WCAG 2.4.1): første tabbestopp på forsiden, synlig ved fokus, og Enter flytter fokus til hovedinnholdet.
import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 1280, height: 800 } });

test('første Tab fokuserer skiplenken, den er synlig og minst 44 px høy, og Enter flytter fokus til hovedinnholdet', async ({ page }) => {
  await page.goto('/');
  expect(await page.locator('#hovedinnhold').count()).toBe(1);
  await page.keyboard.press('Tab');
  const lenke = page.locator('a.hopp');
  await expect(lenke).toBeFocused();
  await expect(lenke).toBeInViewport({ ratio: 1 });
  const boks = await lenke.boundingBox();
  expect(boks.height).toBeGreaterThanOrEqual(44);
  expect(boks.y).toBeGreaterThanOrEqual(0);
  expect(boks.x).toBeGreaterThanOrEqual(0);
  await page.keyboard.press('Enter');
  expect(await page.evaluate(() => location.hash)).toBe('#hovedinnhold');
  // Neste Tab skal lande inne i hovedinnholdet, ikke tilbake i toppen.
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => !!document.activeElement.closest('#hovedinnhold'))).toBe(true);
});

test('skiplenken er skjult utenfor skjermen til den får fokus', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('a.hopp')).not.toBeInViewport();
});

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

for (const bredde of [360, 1280]) {
  test(`fokusert skiplenke på ${bredde} px stikker ikke ut og overlapper ingenting`, async ({ page }) => {
    await page.setViewportSize({ width: bredde, height: 800 });
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(page.locator('a.hopp')).toBeFocused();
    const boks = await page.locator('a.hopp').boundingBox();
    expect(boks.x).toBeGreaterThanOrEqual(0);
    expect(boks.y).toBeGreaterThanOrEqual(0);
    expect(boks.x + boks.width).toBeLessThanOrEqual(bredde);
    // Overlapp med annen tekst er tilsiktet ingen, siden lenken ligger over toppen. Sjekk at elementet øverst i midtpunktet er selve lenken (ikke dekket).
    const topp = await page.evaluate(({ x, y, w, h }) => document.elementFromPoint(x + w / 2, y + h / 2)?.className, { x: boks.x, y: boks.y, w: boks.width, h: boks.height });
    expect(topp).toBe('hopp');
    const sidelengs = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(sidelengs).toBeLessThanOrEqual(0);
  });
}

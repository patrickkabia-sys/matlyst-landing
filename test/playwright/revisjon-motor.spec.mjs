import { test, expect } from '@playwright/test';
import { revider, samleFeil, skalering, zoom } from './hjelp/revisjon.mjs';

const FIKSTUR = '/test/fixtures/revisjon-rod.html';

test('revisjonen ser rulling, tekst utenfor boksen, overlapp og konsollfeil', async ({ page, baseURL }) => {
  test.skip(!!process.env.BASE_URL, 'fiksturen finnes bare lokalt');
  const feil = samleFeil(page, new URL(baseURL).origin);
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(FIKSTUR);
  const r = await revider(page);
  expect(r.sidelengs).toBeGreaterThan(0);
  expect(r.utenforBoks.length).toBeGreaterThan(0);
  expect(r.overlapp.length).toBeGreaterThan(0);
  expect(feil.konsoll.length).toBeGreaterThan(0);
  expect(feil.fremmede).toEqual(['https://example.com/x.png']);
});

test('storTekst dobler rem-tekst og lar px-tekst stå', async ({ page }) => {
  test.skip(!!process.env.BASE_URL, 'fiksturen finnes bare lokalt');
  await page.goto(FIKSTUR);
  const [rem, px] = await Promise.all(['#rem', '#px'].map(async (v) => (await skalering(page, v))[0].faktor));
  expect(rem).toBeGreaterThanOrEqual(1.9);
  expect(px).toBeLessThan(1.1);
});

test('zoom 200 % gjør px-tekst dobbelt så stor på skjermen', async ({ browser }) => {
  test.skip(!!process.env.BASE_URL, 'fiksturen finnes bare lokalt');
  const side = await zoom(browser, FIKSTUR, 2);
  expect(await side.evaluate(() => innerWidth)).toBe(640);
  expect(await side.evaluate(() => devicePixelRatio)).toBe(2);
});

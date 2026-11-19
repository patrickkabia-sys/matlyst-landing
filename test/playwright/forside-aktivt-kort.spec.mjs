// Patrick 19.11: kortene spiller ikke før man ser på dem. Et kort er aktivt når minst 60 % er i bildet (på mobil med stabel også udekket).
// Aktivt: starter fra steg 0. Ikke aktivt: stopper og nullstilles til startbildet. Testet med page.clock.
import { test, expect } from '@playwright/test';
import { STI } from './hjelp/sprak.mjs';
import { TEKST } from '../../scripts/forside-tekst.mjs';
import { SPRAK } from './hjelp/sprak.mjs';
const T = TEKST[SPRAK];

const klar = async (browser, baseURL, { bredde = 1280, hoyde = 800 } = {}) => {
  const ctx = await browser.newContext({ baseURL, viewport: { width: bredde, height: hoyde }, reducedMotion: 'no-preference' });
  await ctx.addInitScript(() => { try { localStorage.setItem('matlyst-consent', 'denied'); } catch {} });
  const page = await ctx.newPage();
  await page.clock.install();
  await page.goto(STI);
  await page.addStyleTag({ content: '#cookie{display:none!important}' });
  return { ctx, page };
};
const start = T.middag.demo.porsjoner[0], andre = T.middag.demo.porsjoner[1];
const antall = (page) => page.locator('#demoSkaler .antall').textContent();
const midt = (page, velger) => page.evaluate((v) => document.querySelector(v).scrollIntoView({ block: 'center', behavior: 'instant' }), velger);
const kjor = async (page, ms) => { for (let t = 0; t < ms; t += 250) await page.clock.runFor(250); };

test('et kort som ikke er aktivt, har ikke flyttet seg fra startbildet etter 20 sekunder', async ({ browser, baseURL }) => {
  const { ctx, page } = await klar(browser, baseURL);
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(300);
  await kjor(page, 20000);
  expect(await antall(page)).toBe(start);
  expect(await page.locator('#demoLag').evaluate((e) => e.querySelector('.a-lagscene').classList.contains('timer'))).toBe(false);
  expect(await page.locator('#demoPlan').evaluate((e) => e.classList.contains('aapen'))).toBe(false);
  expect(await page.locator('#sporTekst').textContent()).toBe(T.spor.forslag[0]);
  await ctx.close();
});

test('når kortet blir aktivt starter det fra steg 0, og forlater man det og kommer tilbake, starter det forfra', async ({ browser, baseURL }) => {
  const { ctx, page } = await klar(browser, baseURL);
  await midt(page, '#demoSkaler');
  await page.waitForTimeout(400);
  await kjor(page, 1500);
  expect(await antall(page), 'før steg 1 (2,4 s)').toBe(start);
  await kjor(page, 1500);
  expect(await antall(page), 'etter steg 1').toBe(andre);
  // Forlat kortet: nullstilles til startbildet og står stille.
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(400);
  expect(await antall(page), 'nullstilt').toBe(start);
  await kjor(page, 6000);
  expect(await antall(page), 'står stille utenfor').toBe(start);
  // Tilbake: forfra (ikke videre fra steg 1).
  await midt(page, '#demoSkaler');
  await page.waitForTimeout(400);
  await kjor(page, 1000);
  expect(await antall(page), 'begynner forfra').toBe(start);
  await kjor(page, 2500);
  expect(await antall(page)).toBe(andre);
  await ctx.close();
});

test('stabelen på mobil: bare det øverste kortet spiller', async ({ browser, baseURL }) => {
  const { ctx, page } = await klar(browser, baseURL, { bredde: 390, hoyde: 664 });
  await page.evaluate(() => { const trio = document.getElementById('trio'), r = [...trio.querySelectorAll(':scope > .rute')], gap = parseFloat(getComputedStyle(trio).rowGap) || 0; scrollTo(0, trio.getBoundingClientRect().top + scrollY + r[0].offsetHeight + gap - parseFloat(getComputedStyle(r[1]).top)); });
  await page.waitForTimeout(500);
  await page.clock.runFor(100);
  await expect(page.locator('#trio > .rute').nth(0)).toHaveClass(/dekket/);
  await kjor(page, 4500);
  // Kort 2 (Lag maten) er øverst og spiller: tidtakeren åpnes etter ca. 3,4 s. Kort 1 (Skaler) er dekket og står i startbildet.
  expect(await page.locator('#demoLag .a-lagscene').evaluate((e) => e.classList.contains('timer'))).toBe(true);
  expect(await antall(page)).toBe(start);
  await ctx.close();
});

test('Spør Matlyst spiller bare når en flate er minst 60 % i bildet, og starter forfra', async ({ browser, baseURL }) => {
  const { ctx, page } = await klar(browser, baseURL);
  await midt(page, '.sporflate');
  await page.waitForTimeout(400);
  await page.clock.runFor(60);
  const delvis = await page.locator('#sporTekst').textContent();
  expect(delvis.length, 'skriver').toBeLessThan(T.spor.forslag[0].length);
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(400);
  expect(await page.locator('#sporTekst').textContent(), 'nullstilt til startbildet').toBe(T.spor.forslag[0]);
  await kjor(page, 5000);
  expect(await page.locator('#sporTekst').textContent()).toBe(T.spor.forslag[0]);
  await ctx.close();
});

test('lav skjerm (1280 x 320): Husstand-demoen starter likevel (60 % av det minste av kortets og skjermens høyde)', async ({ browser, baseURL }) => {
  const { ctx, page } = await klar(browser, baseURL, { bredde: 1280, hoyde: 320 });
  expect(await page.locator('#demoHus').evaluate((e) => e.closest('.rute').offsetHeight), 'kortet er høyere enn skjermen').toBeGreaterThan(320);
  await midt(page, '#demoHus');
  await page.waitForTimeout(500);
  await expect(page.locator('#demoHus').locator('..')).toHaveClass(/i-bildet/);
  // Demoen går: etter 4,8 sekunder er den ferdig lagt inn (steg 3), og ny husstand etter 7,8 sekunder.
  await kjor(page, 3000);
  expect(await page.locator('#demoHus .a-folk img.la-inn, #demoHus .a-innrad:not(.skjult)').count()).toBeGreaterThan(0);
  await ctx.close();
});

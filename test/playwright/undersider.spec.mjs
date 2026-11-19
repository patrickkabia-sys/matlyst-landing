// Undersidene: omregneren og den faste knappen. Adressene leses fra forhåndsvisningens kart.json
// til typene er rullet ut; ellers brukes de ekte stiene.
import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';

const kart = JSON.parse(readFileSync(new URL('../../qa/forhandsvisning/kart.json', import.meta.url), 'utf8'));
const adresse = (sti) => kart.find((s) => s.sti === sti)?.url ?? sti;

test('omregneren regner fortsatt, med samme tallformat som før', async ({ page }) => {
  await page.goto(adresse('/verktoy/kopp-til-dl/'));
  await page.locator('[data-felt=verdi]').fill('2');
  await expect(page.locator('[data-felt=svar]')).toContainText('4.732');
});

test('omregneren bytter enheter og svaret brytes i stedet for å kuttes', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto(adresse('/verktoy/kopp-til-dl/'));
  await page.locator('[data-felt=verdi]').fill('1500');
  const fra = await page.locator('[data-felt=fra]').inputValue();
  await page.locator('[data-handling=bytt]').click();
  expect(await page.locator('[data-felt=til]').inputValue()).toBe(fra);
  const svar = page.locator('[data-felt=svar]');
  await expect(svar).toContainText('1500');
  const boks = await svar.evaluate((e) => ({ s: e.scrollWidth, b: e.clientWidth }));
  expect(boks.s).toBeLessThanOrEqual(boks.b);
  const knapp = await page.locator('[data-handling=bytt]').boundingBox();
  expect(knapp.width).toBeGreaterThanOrEqual(44);
  expect(knapp.height).toBeGreaterThanOrEqual(44);
});

test('omregneren: ingen innholdsfortegnelse, og feltene er minst 44 px', async ({ page }) => {
  await page.goto(adresse('/verktoy/kopp-til-dl/'));
  await expect(page.locator('.toc')).toBeHidden();
  for (const sel of ['[data-felt=verdi]', '[data-felt=fra]', '[data-felt=til]']) {
    expect((await page.locator(sel).boundingBox()).height).toBeGreaterThanOrEqual(44);
  }
});

async function fastKnappForlop(page, sti, start) {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto(adresse(sti));
  await expect(page.locator('#fast')).not.toHaveClass(/\bvis\b/);
  await page.locator(start).first().evaluate((e) => scrollTo(0, e.getBoundingClientRect().bottom + scrollY + 10));
  await expect(page.locator('#fast')).toHaveClass(/\bvis\b/);
  await page.locator('.bunn [data-hent]').scrollIntoViewIfNeeded();
  await expect(page.locator('#fast')).not.toHaveClass(/\bvis\b/);
}

test('fast knapp: skjult i toppen, synlig når helten er forbi, skjult før knappen i bunnen', async ({ page }) => {
  await fastKnappForlop(page, '/lagre-oppskrifter-fra-instagram/', 'header.locale-page-hero');
});

test('fast knapp virker på en eldre side der nedlastingsboksen står utenfor main', async ({ page }) => {
  await fastKnappForlop(page, '/finn-oppskrifter/', '.blad .hero');
});

import { test, expect } from '@playwright/test';
import { STI, SPRAK } from './hjelp/sprak.mjs';
import { TEKST, fyll } from '../../scripts/forside-tekst.mjs';
const T = TEKST[SPRAK];

const rullTil = async (page, velger) => {
  await page.locator(velger).evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
};
const tilstand = (page) => page.locator('.spor').evaluate((el) => ({
  tekst: el.querySelector('#sporTekst').textContent,
  svar: el.querySelector('#sporListe').innerHTML,
  antall: el.querySelector('#sporAntall').textContent,
}));

test.use({ viewport: { width: 1280, height: 800 }, reducedMotion: 'no-preference' });
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('matlyst-consent', 'denied'));
  await page.goto(STI);
});

test('kokeboka har 72 og 52 pikslers luft etter samlebåndet', async ({ page }) => {
  for (const [bredde, luft] of [[1280, 72], [390, 52]]) {
    await page.setViewportSize({ width: bredde, height: 800 });
    const avstand = await page.evaluate(() => document.querySelector('.kokebok h2')?.getBoundingClientRect().top - document.querySelector('.band').getBoundingClientRect().bottom);
    expect(Math.abs(avstand - luft)).toBeLessThanOrEqual(2);
  }
});

test('kokebokraden følger rullingen bare på PC mens seksjonen er synlig', async ({ page }) => {
  const rad = page.locator('.retter');
  await expect(rad).toHaveCount(1);
  const plass = () => rad.evaluate((el) => getComputedStyle(el).transform);
  await rullTil(page, '.retterom');
  await expect(page.locator('.retterom')).toHaveClass(/koblet/);
  // Første plassering må være ferdig, ellers kan den forveksles med rulling.
  await expect.poll(plass).not.toBe('none');
  const tidligere = await plass();
  await page.evaluate(() => window.scrollBy({ top: 100, behavior: 'instant' }));
  await expect.poll(plass).not.toBe(tidligere);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(150);
  const utenfor = await plass();
  await page.evaluate(() => window.scrollBy({ top: 50, behavior: 'instant' }));
  await page.waitForTimeout(150);
  expect(await plass()).toBe(utenfor);
  await page.setViewportSize({ width: 390, height: 844 });
  await rullTil(page, '.retterom');
  await expect(page.locator('.retterom')).not.toHaveClass(/koblet/);
  await rad.evaluate((el) => { el.scrollLeft = 240; });
  await expect.poll(() => rad.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
  expect(await plass()).toBe('none');
});

test('skriving, glød og skjeletter gir valgt svar og fortsetter i loop etter trykk og hover', async ({ page }) => {
  await rullTil(page, '.sporflate');
  await page.locator('.forslag').nth(2).click();
  await expect(page.locator('#sporTekst')).toHaveText(T.spor.forslag[2]);
  await expect(page.locator('.felt')).toHaveClass(/ferdig/);
  await expect(page.locator('.sk')).toHaveCount(3);
  await expect(page.locator('#sporListe .a-endr')).toHaveCount(T.eksempler.svar[2].endringer.length);
  await page.locator('.forslag').nth(2).hover();
  await expect(page.locator('.forslag').nth(3)).toHaveAttribute('aria-pressed', 'true', { timeout: 10000 });
  await expect(page.locator('#sporListe .a-endr')).toHaveCount(T.eksempler.svar[3].endringer.length);
  await expect(page.locator('.forslag').first()).toHaveAttribute('aria-pressed', 'true', { timeout: 10000 });
});

test('skriving og svar fryses utenfor bildet og fortsetter ved retur', async ({ page }) => {
  await rullTil(page, '.sporflate');
  await page.locator('.forslag').nth(1).click();
  await page.waitForTimeout(250);
  const delvis = await page.locator('#sporTekst').textContent();
  expect(delvis.length).toBeGreaterThan(0);
  expect(delvis.length).toBeLessThan(T.spor.forslag[1].length);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(150);
  const skrift = await tilstand(page);
  await page.waitForTimeout(1500);
  expect(await tilstand(page)).toEqual(skrift);
  await rullTil(page, '.sporflate');
  await expect(page.locator('.sk')).toHaveCount(3);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(150);
  const skjelett = await tilstand(page);
  await page.waitForTimeout(2200);
  expect(await tilstand(page)).toEqual(skjelett);
  await rullTil(page, '.sporflate');
  await expect(page.locator('#sporListe .a-endr')).toHaveCount(T.eksempler.svar[1].endringer.length);
});

test('redusert bevegelse viser første svar ferdig og kobler fra rulling også ved endring', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await rullTil(page, '.sporflate');
  await expect(page.locator('#sporTekst')).toHaveText(T.spor.forslag[0]);
  await expect(page.locator('#sporListe .a-endr')).toHaveCount(T.eksempler.svar[0].endringer.length);
  await expect(page.locator('.sk')).toHaveCount(0);
  const stille = await tilstand(page);
  await page.waitForTimeout(1500);
  expect(await tilstand(page)).toEqual(stille);
  await expect(page.locator('.retterom')).not.toHaveClass(/koblet/);
  await expect(page.locator('.virvel')).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.felt')).toHaveCSS('animation-name', 'none');
  expect(await page.locator('#sporTekst').evaluate((el) => getComputedStyle(el, '::after').animationName)).toBe('none');
  await page.locator('.forslag').nth(3).click();
  await expect(page.locator('#sporListe .a-endr')).toHaveCount(T.eksempler.svar[3].endringer.length);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('.forslag').first()).toHaveAttribute('aria-pressed', 'true', { timeout: 10000 });
});

test('seksjonene har lokale ressurser, feilfri konsoll og plass på alle skjermbredder', async ({ page }) => {
  const feil = [], eksterne = [];
  page.on('pageerror', (e) => feil.push(e.message));
  page.on('console', (e) => { if (e.type() === 'error') feil.push(e.text()); });
  page.on('request', (r) => { if (new URL(r.url()).host !== '127.0.0.1:4173') eksterne.push(r.url()); });
  await page.reload();
  for (const bredde of [320, 360, 390, 768, 1280]) {
    await page.setViewportSize({ width: bredde, height: 844 });
    for (const velger of ['.kokebok', '.spor']) {
      await rullTil(page, velger);
      await expect(page.locator(velger)).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(bredde);
    }
    for (const knapp of await page.locator('.forslag').all()) {
      const boks = await knapp.boundingBox();
      expect(boks.height).toBeGreaterThanOrEqual(44);
      expect(boks.x).toBeGreaterThanOrEqual(0);
      expect(boks.x + boks.width).toBeLessThanOrEqual(bredde);
    }
  }
  expect(feil).toEqual([]);
  expect(eksterne).toEqual([]);
});

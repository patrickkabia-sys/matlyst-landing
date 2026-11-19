import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
const rot = join(fileURLToPath(new URL('..', import.meta.url)), '..');
const rullTil = async (page, velger) => page.locator(velger).evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
const bilde = (page, velger) => page.locator(velger).evaluate((el) => el.innerHTML);
// i-bildet settes av IntersectionObserver og kan komme et øyeblikk etter rullingen på en treg maskin; den er ikke animasjonstilstand.
const stillbilde = async (page, velger) => (await bilde(page, velger)).replaceAll(' i-bildet', '');
// Overgangene her måles i ekte tid (CSS-overganger følger ikke page.clock). En travel CI-maskin kan bomme på et vindu på 100 ms.
test.describe.configure({ retries: process.env.CI ? 2 : 0 });
test.use({ viewport: { width: 1280, height: 800 }, reducedMotion: 'no-preference' });

test('hvert kort går i loop, fryses utenfor bildet og sveipes inn bare én gang', async ({ page }) => {
  test.setTimeout(90000);
  await page.goto('/');
  await page.clock.install();
  for (const [velger, tid, slutt, start] of [
    ['#demoSkaler', 4500, ['.antall', '6'], ['.antall', '4']],
    ['#demoLag', 14500, ['.a-steg', null], ['.a-tid', '10:00']],
    ['#demoPlan', 4000, [null, null], [null, null]],
    ['#demoHandle', 12500, ['[data-m]', '7 fedd'], ['[data-m]', '6 fedd']],
  ]) {
    await page.reload();
    await rullTil(page, velger);
    const kort = page.locator(velger).locator('..');
    await expect(kort).toHaveClass(/i-bildet/);
    const innflyging = await kort.evaluate((el) => el.getAnimations().map((a) => a.effect.getKeyframes()[0].transform));
    expect(innflyging).toEqual([velger === '#demoLag' ? 'translateX(96px)' : 'translateX(-96px)']);
    await page.clock.runFor(1100);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await expect(kort).not.toHaveClass(/i-bildet/);
    const frosset = await bilde(page, velger);
    await page.clock.runFor(2500);
    expect(await bilde(page, velger)).toBe(frosset);
    await rullTil(page, velger);
    await expect(kort).toHaveClass(/i-bildet/);
    await page.clock.runFor(tid - 1100);
    if (velger === '#demoLag') await expect(page.locator('#demoLag .a-steg').first()).toHaveClass(/ferdig/);
    else if (velger === '#demoPlan') await expect(page.locator(velger)).toHaveClass(/aapen/);
    else await expect(page.locator(velger).locator(slutt[0]).first()).toHaveText(slutt[1]);
    await page.clock.runFor(velger === '#demoLag' ? 5000 : velger === '#demoHandle' ? 6500 : velger === '#demoPlan' ? 6800 : 5000);
    if (velger === '#demoPlan') await expect(page.locator(velger)).not.toHaveClass(/aapen/);
    else await expect(page.locator(velger).locator(start[0]).first()).toHaveText(start[1]);
    expect(await kort.evaluate((el) => el.getAnimations().length)).toBe(0);
  }
});

test('husstandsvalg og hover lar neste husstand komme og alle har to ledige plasser', async ({ page }) => {
  await page.goto('/');
  await page.clock.install();
  await rullTil(page, '#demoHus');
  const knapper = page.locator('.a-husvelg button');
  await knapper.nth(1).click();
  await knapper.nth(1).hover();
  await expect(page.locator('.a-husflate')).toContainText('Hytteturen');
  await page.clock.runFor(3000);
  await expect(page.locator('.a-husflate .ny')).not.toHaveClass(/skjult/);
  await page.clock.runFor(5000);
  await expect(knapper.nth(2)).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.a-hus small')).toHaveText('4 av 6 · 2 plasser ledige');
  await page.clock.runFor(8000);
  await expect(knapper.first()).toHaveAttribute('aria-pressed', 'true');
});

test('redusert bevegelse viser alle kort ferdig og svarbeskrivelsen følger valgt svar', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('#demoSkaler .antall')).toHaveText('6');
  await expect(page.locator('#demoLag .a-steg').first()).toHaveClass(/ferdig/);
  await expect(page.locator('#demoPlan')).toHaveClass(/aapen/);
  await expect(page.locator('#demoHandle [data-m]').first()).toHaveText('7 fedd');
  await expect(page.locator('.a-husflate .ny')).not.toHaveClass(/skjult/);
  await page.clock.install();
  await rullTil(page, '#demoHus');
  const ferdig = await stillbilde(page, '#trio');
  await page.clock.runFor(20000);
  expect(await stillbilde(page, '#trio')).toBe(ferdig);
  await rullTil(page, '#spor');
  await page.locator('.forslag').nth(2).click();
  await expect(page.locator('#sporSvar')).toHaveAttribute('aria-label', /Kokosmelk gir samme fylde/);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await rullTil(page, '#demoSkaler');
  await expect(page.locator('#demoSkaler').locator('..')).toHaveClass(/i-bildet/);
  await page.clock.runFor(4600);
  await expect(page.locator('#demoSkaler .antall')).toHaveText('6');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('#demoPlan')).toHaveClass(/aapen/);
});

test('hele siden har lokal trafikk, feilfri konsoll, fungerende mål og plass på fem bredder', async ({ page }) => {
  const feil = [], eksterne = [];
  page.on('pageerror', (e) => feil.push(e.message));
  page.on('console', (e) => { if (e.type() === 'error') feil.push(e.text()); });
  page.on('request', (r) => { if (new URL(r.url()).host !== '127.0.0.1:4173') eksterne.push(r.url()); });
  await page.goto('/');
  for (const bredde of [320, 360, 390, 768, 1280]) {
    await page.setViewportSize({ width: bredde, height: 844 });
    for (const velger of ['.hero', '.kokebok', '.spor', '#demoSkaler', '#demoLag', '#demoPlan', '#demoHandle', '#demoHus', '.pris', '.ofte', '.bunn', '.under']) {
      await rullTil(page, velger);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(bredde);
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const knapp of await page.locator('.a-husvelg button, .svarliste summary, .vern a').all()) {
      const b = await knapp.boundingBox();
      expect(b.height).toBeGreaterThanOrEqual(44); expect(b.width).toBeGreaterThanOrEqual(44);
      expect(b.x).toBeGreaterThanOrEqual(0); expect(b.x + b.width).toBeLessThanOrEqual(bredde);
    }
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  }
  for (const lenke of await page.locator('#folg a').all()) expect(await page.locator(await lenke.getAttribute('href')).count()).toBe(1);
  await expect(page.locator('[aria-current="page"]')).toHaveCount(2);
  expect(await page.locator('body').innerText()).not.toContain('undefined');
  expect(feil).toEqual([]); expect(eksterne).toEqual([]);
});

// Prototypen får lokale fonter under kontrollen. Originalfilen røres ikke.
async function visPrototype(page) {
  const html = readFileSync(join(rot, 'docs/superpowers/prototyper/2026-11-18-forside.html'), 'utf8');
  await page.route('**/t8-prototype', (route) => route.fulfill({ contentType: 'text/html; charset=utf-8', body: html.replace(/<link rel="stylesheet" href="https:[^>]+>/, '<link rel="stylesheet" href="/tokens.css">').replace('<meta name="claude:viewport-fit-sides" content="cover">', '<meta name="viewport" content="width=device-width,initial-scale=1">').replaceAll('src="mat/butter.webp"', 'src="/images/forside/mat/butterchicken.webp"').replaceAll('src="mat/', 'src="/images/forside/mat/').replaceAll("'mat/butter.webp'", "'/images/forside/mat/butterchicken.webp'").replaceAll("'mat/", "'/images/forside/mat/").replaceAll("'folk/", "'/images/forside/folk/").replaceAll("'img/", "'/images/forside/logo/").replaceAll('src="img/', 'src="/images/forside/logo/') }));
  await page.goto('/t8-prototype');
}

test('pris og spørsmål er like prototypen linje for linje etter skript', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const tekster = {};
  for (const type of ['t8', 'proto8']) {
    if (type === 't8') await page.goto('/'); else await visPrototype(page);
    await page.evaluate(() => { document.querySelector('#cookie')?.remove(); });
    await page.evaluate(() => document.fonts.ready);
    // Åpne svarene slik at også avsnittene sammenlignes etter skriptkjøring.
    await page.locator('.ofte details').evaluateAll((els) => els.forEach((el) => { el.open = true; }));
    tekster[type] = await page.locator('.pris,.ofte').allInnerTexts();
    await page.locator('.ofte details').evaluateAll((els) => els.forEach((el) => { el.open = false; }));
  }
  expect(tekster.t8.map((t) => t.split('\n').filter(Boolean))).toEqual(tekster.proto8.map((t) => t.split('\n').filter(Boolean)));
});

test('pågående kalenderovergang fryses uten å hoppe til slutten utenfor bildet', async ({ page }) => {
  await page.goto('/');
  await rullTil(page, '#demoPlan');
  await expect(page.locator('#demoPlan')).toHaveClass(/aapen/);
  await page.waitForTimeout(100);
  const les = () => page.locator('#demoPlan .a-kal').evaluate((el) => Number(getComputedStyle(el).opacity));
  const foer = await les();
  expect(foer).toBeLessThan(.85);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(page.locator('#demoPlan').locator('..')).not.toHaveClass(/i-bildet/);
  // pause() fullføres ved neste bilderamme; mål først når nettleseren har bekreftet pausen.
  await page.locator('#demoPlan').evaluate((el) => Promise.all(el.getAnimations({ subtree: true }).map((a) => a.ready)));
  const ute = await les();
  expect(ute - foer).toBeLessThan(.15);
  await page.waitForTimeout(1000);
  expect(await les()).toBeCloseTo(ute, 2);
  await rullTil(page, '#demoPlan');
  await expect.poll(les).toBeGreaterThan(ute);
});

test('endring av bevegelsesvalg starter ikke overgangene i kort utenfor bildet', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const les = () => page.locator('#demoPlan .a-kal').evaluate((el) => ({ opacity: getComputedStyle(el).opacity, hoyde: el.getBoundingClientRect().height, animasjoner: el.getAnimations().filter((a) => a.playState === 'running').length }));
  const foer = await les();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.waitForTimeout(200);
  expect(await les()).toEqual(foer);
  await rullTil(page, '#demoPlan');
  await expect(page.locator('#demoPlan')).not.toHaveClass(/aapen/);
  await expect(page.locator('#demoPlan')).toHaveClass(/aapen/, { timeout: 5000 });
});

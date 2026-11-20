import { test, expect } from '@playwright/test';
import { STI, SPRAK } from './hjelp/sprak.mjs';

test.use({ viewport: { width: 1280, height: 800 }, reducedMotion: 'no-preference' });
// Filmen og bevegelsesvalget følger ekte tid og ekte avspilling (ikke page.clock). En travel CI-maskin kan bomme én gang.
test.describe.configure({ retries: process.env.CI ? 2 : 0 });

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

// Bevegelsesendringer midt i økta (felles avstemming i forside.js).
// Chromium kan miste «change» til en MediaQueryList når siden leser .matches mellom at innstillingen byttes og at hendelsen leveres.
// To utgaver: «tapt» sluker change-hendelsen for forsidens lyttere (tvinger fram situasjonen hver gang), «ekte» lar nettleseren avgjøre.
// CPU_STRUPING=10 kjører «ekte» under CDP-struping (slik kappløpet ble målt), uten at testen ellers endres.
const struping = Number(process.env.CPU_STRUPING || 0);
const slukChange = () => {
  const orig = window.matchMedia.bind(window);
  window.matchMedia = (q) => {
    const m = orig(q);
    if (/prefers-reduced-motion/.test(q)) {
      const leggTil = m.addEventListener.bind(m);
      m.addEventListener = (type, f, o) => { if (type !== 'change') leggTil(type, f, o); };
    }
    return m;
  };
};
async function struP(page) {
  if (!struping) return;
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: struping });
}

for (const tapt of [true, false]) {
  const navn = tapt ? 'uten change-hendelse' : 'med ekte change-hendelse';
  test.describe(`bevegelse slås av og på mens siden er åpen, ${navn}`, () => {
    test.beforeEach(async ({ page }) => {
      if (tapt) await page.addInitScript(slukChange);
      await page.reload();
      await struP(page);
    });

    // Spør Matlyst styres av page.clock, slik at «midt i skrivingen» og «i lasteskjelettet» er faste punkter og ikke avhenger av maskinens hastighet.
    test('Spør Matlyst står ferdig når redusert bevegelse slås på midt i skrivingen', async ({ page }) => {
      await page.clock.install();
      await rullTil(page, '#spor');
      await expect(page.locator('#spor')).toHaveClass(/i-bildet/);
      const tekst = page.locator('#sporTekst');
      const onsket = await page.locator('.forslag').first().textContent();
      await page.clock.runFor(250);
      expect((await tekst.textContent()).length).toBeGreaterThan(0);
      expect(await tekst.textContent()).not.toBe(onsket);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.clock.runFor(100);
      await expect.poll(async () => { await page.clock.runFor(50); return tekst.textContent(); }, { timeout: 5000 }).toBe(onsket);
      await expect(page.locator('#spor .sk')).toHaveCount(0);
      await expect(page.locator('#spor .a-svar')).not.toHaveClass(/endrer/);
    });

    test('Spør Matlyst går ut av lasteskjelettet når redusert bevegelse slås på', async ({ page }) => {
      await page.clock.install();
      await rullTil(page, '#spor');
      await expect(page.locator('#spor')).toHaveClass(/i-bildet/);
      await page.locator('.forslag').nth(1).click();
      await page.clock.runFor(1500);
      await expect(page.locator('#spor .sk').first()).toBeVisible();
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.clock.runFor(100);
      await expect.poll(async () => { await page.clock.runFor(50); return page.locator('#spor .sk').count(); }, { timeout: 5000 }).toBe(0);
      await expect(page.locator('#spor .a-svar')).not.toHaveClass(/endrer/);
    });

    test('filmen får kilden tilbake og spiller når redusert bevegelse slås av', async ({ page }) => {
      const film = page.locator('.film video');
      await rullTil(page, '.film');
      await expect.poll(() => film.evaluate((v) => v.paused)).toBe(false);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      // Under tapt hendelse oppdages endringen ved første rulling.
      await page.evaluate(() => window.scrollBy({ top: 1, behavior: 'instant' }));
      await expect(film).not.toHaveAttribute('src', { timeout: 5000 });
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.evaluate(() => window.scrollBy({ top: -1, behavior: 'instant' }));
      await expect(film).toHaveAttribute('src', /.+/, { timeout: 5000 });
      await expect.poll(() => film.evaluate((v) => v.paused), { timeout: 8000 }).toBe(false);
      // Kilden lastes bare én gang per endring.
      expect(await film.evaluate((v) => performance.getEntriesByName(v.currentSrc).length)).toBeLessThanOrEqual(2);
    });
  });
}

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

test('omregneren bytter enheter og regner det omvendte; svaret brytes i stedet for å kuttes', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto(adresse('/verktoy/kopp-til-dl/'));
  const fraFelt = page.locator('[data-felt=fra]');
  const tilFelt = page.locator('[data-felt=til]');
  const svar = page.locator('[data-felt=svar]');
  await page.locator('[data-felt=verdi]').fill('1500');
  const fra = await fraFelt.inputValue();
  const til = await tilFelt.inputValue();
  const f = JSON.parse(await page.locator('.omregner-data').textContent()).f;
  const tall = (n) => { const a = Math.abs(n); return String(Number(n.toFixed(a >= 1000 ? 0 : a >= 100 ? 1 : a >= 10 ? 2 : a >= 1 ? 3 : a >= 0.1 ? 4 : 5))); };
  const kort = async (felt) => felt.evaluate((e) => e.options[e.selectedIndex].text.replace(/^.*\(([^)]+)\)$/u, '$1'));
  await page.locator('[data-handling=bytt]').click();
  expect(await fraFelt.inputValue()).toBe(til);
  expect(await tilFelt.inputValue()).toBe(fra);
  const ut = 1500 * f[til] / f[fra];
  await expect(svar).toHaveText(`1500 ${await kort(fraFelt)} = ${tall(ut)} ${await kort(tilFelt)}`);
  const boks = await svar.evaluate((e) => ({ s: e.scrollWidth, b: e.clientWidth }));
  expect(boks.s).toBeLessThanOrEqual(boks.b);
  const knapp = await page.locator('[data-handling=bytt]').boundingBox();
  expect(knapp.width).toBeGreaterThanOrEqual(44);
  expect(knapp.height).toBeGreaterThanOrEqual(44);
});

test('omregneren: tab-rekkefølge, tilgjengelige navn og synlig fokus', async ({ page }) => {
  await page.goto(adresse('/verktoy/kopp-til-dl/'));
  await page.locator('[data-felt=verdi]').focus();
  for (const sel of ['[data-felt=verdi]', '[data-felt=fra]', '[data-handling=bytt]', '[data-felt=til]']) {
    const el = page.locator(sel);
    await expect(el).toBeFocused();
    const navn = await el.evaluate((e) => (e.getAttribute('aria-label') || e.labels?.[0]?.firstChild?.textContent || e.textContent || '').trim());
    expect(navn.length, `${sel} mangler navn`).toBeGreaterThan(0);
    const ring = await el.evaluate((e) => {
      const stil = getComputedStyle(e);
      const kort = e.closest('label') ? getComputedStyle(e.closest('label')) : null;
      return { outline: parseFloat(stil.outlineWidth) * (stil.outlineStyle === 'none' ? 0 : 1), skygge: kort ? kort.boxShadow : stil.boxShadow };
    });
    expect(ring.outline > 0 || (ring.skygge && ring.skygge !== 'none'), `${sel} mangler synlig fokus`).toBe(true);
    await page.keyboard.press('Tab');
  }
});

test('omregneren: skjemaet holder seg inne i skjermen med dobbel tekststørrelse på 1280 px', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Page.setFontSizes', { fontSizes: { standard: 32 } });
  await page.goto(adresse('/verktoy/kopp-til-dl/'));
  const boks = await page.locator('form.omregner').boundingBox();
  expect(boks.x).toBeGreaterThanOrEqual(0);
  expect(boks.x + boks.width).toBeLessThanOrEqual(1280);
  const hoyre = await page.evaluate(() => document.querySelector('form.omregner').scrollWidth - document.querySelector('form.omregner').clientWidth);
  expect(hoyre).toBeLessThanOrEqual(0);
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

test('fast knapp: en underside uten helt bruker header.topp som start, ikke 600 px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  // Fiktur: samme side uten helt og uten h1, så ingen av startkandidatene finnes.
  await page.route('**/verktoy/kopp-til-dl/**', async (rute) => {
    const svar = await rute.fetch();
    const html = (await svar.text())
      .replace(/<header class="locale-page-hero">[\s\S]*?<\/header>/u, '')
      .replace(/<h1\b[\s\S]*?<\/h1>/gu, '');
    await rute.fulfill({ response: svar, body: html });
  });
  await page.goto(adresse('/verktoy/kopp-til-dl/'));
  expect(await page.locator('.blad :is(header.locale-page-hero, header.hero, div.hero, main h1)').count()).toBe(0);
  await expect(page.locator('#fast')).not.toHaveClass(/\bvis\b/);
  const topp = await page.locator('header.topp').evaluate((e) => e.getBoundingClientRect().bottom + scrollY);
  expect(topp).toBeLessThan(300);
  await page.evaluate((y) => scrollTo(0, y), topp + 40);
  await expect(page.locator('#fast')).toHaveClass(/\bvis\b/);
});

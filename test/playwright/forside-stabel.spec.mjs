// Patrick 19.11: kortstabling på mobil for rutene i #trio. Av som standard; slås på med klassen `stabel` på #trio.
import { test, expect } from '@playwright/test';
import { STI } from './hjelp/sprak.mjs';

const rullInn = (page) => page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 400) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 20)); } scrollTo(0, 0); });
const mobil = async (browser, baseURL, { bredde = 390, hoyde = 664, redusert = 'reduce', stabel = true } = {}) => {
  const ctx = await browser.newContext({ baseURL, viewport: { width: bredde, height: hoyde }, reducedMotion: redusert });
  const page = await ctx.newPage();
  await page.goto(STI);
  await page.addStyleTag({ content: '#cookie{display:none!important}' });
  await rullInn(page);
  if (stabel) await page.evaluate(() => document.getElementById('trio').classList.add('stabel'));
  return { ctx, page };
};
// Rullestilling der rute nr i (fra 0) står i sin egen posisjon i stabelen.
const rullTilRute = (page, i) => page.evaluate((n) => {
  const trio = document.getElementById('trio'), ruter = [...trio.children], gap = parseFloat(getComputedStyle(trio).rowGap) || 0;
  const naturlig = trio.getBoundingClientRect().top + scrollY + ruter.slice(0, n).reduce((sum, el) => sum + el.offsetHeight + gap, 0);
  scrollTo(0, naturlig - parseFloat(getComputedStyle(ruter[n]).top));
}, i);

test('standard er AV: ingen stabel-klasse i HTML-en, og rutene står i normal flyt', async ({ browser, baseURL }) => {
  const { ctx, page } = await mobil(browser, baseURL, { stabel: false });
  expect(await page.locator('#trio').getAttribute('class')).not.toContain('stabel');
  const pos = await page.locator('#trio > .rute').evaluateAll((r) => r.map((e) => getComputedStyle(e).position));
  expect(pos).toEqual(['static', 'static', 'static', 'static', 'static']);
  await ctx.close();
});

test('med klassen: rutene er sticky under toppen + 8 px, forskjøvet 6 px per kort, ugjennomsiktige, og den neste ligger over', async ({ browser, baseURL }) => {
  const { ctx, page } = await mobil(browser, baseURL);
  const m = await page.locator('#trio > .rute').evaluateAll((r) => r.map((e) => { const s = getComputedStyle(e); return { pos: s.position, top: s.top, bg: s.backgroundColor, z: s.zIndex, mt: s.scrollMarginTop }; }));
  expect(m.map((x) => x.pos)).toEqual(Array(5).fill('sticky'));
  expect(m.map((x) => x.top)).toEqual(['80px', '86px', '92px', '98px', '104px']);
  expect(m.map((x) => x.mt)).toEqual(m.map((x) => x.top));
  for (const x of m) { expect(x.bg).toMatch(/^rgb\(/u); expect(x.bg).not.toMatch(/rgba|, 0\)/u); }
  // Dokumentrekkefølgen avgjør lagene: rute 2 (indeks 1) ligger over rute 1 der de overlapper.
  await rullTilRute(page, 1);
  const over = await page.evaluate(() => { const r = [...document.querySelectorAll('#trio > .rute')], b = r[1].getBoundingClientRect(), p = document.elementFromPoint(b.left + b.width / 2, b.top + 40); return { i: r.findIndex((e) => e.contains(p)), topp1: r[0].getBoundingClientRect().top, topp2: b.top }; });
  expect(over.i).toBe(1);
  expect(over.topp2 - over.topp1, 'forskyvning mellom kortene').toBeCloseTo(6, 0);
  await ctx.close();
});

for (const [bredde, hoyde] of [[390, 664], [360, 640]]) {
  test(`hver stablet rute er høyst 100svh minus toppen minus 16 px (ellers kan bunnen aldri ses), ${bredde} x ${hoyde}`, async ({ browser, baseURL }) => {
    const { ctx, page } = await mobil(browser, baseURL, { bredde, hoyde });
    const ledig = hoyde - 72 - 16;
    const hoyder = await page.locator('#trio > .rute').evaluateAll((r) => r.map((e) => e.getBoundingClientRect().height));
    for (const [i, h] of hoyder.entries()) expect(h, `rute ${i + 1} er ${h} px, ledig ${ledig}`).toBeLessThanOrEqual(ledig);
    await ctx.close();
  });
}

test('en rute som er dekket av den neste står stille; den øverste går', async ({ browser, baseURL }) => {
  test.setTimeout(90_000);
  const { ctx, page } = await mobil(browser, baseURL, { redusert: 'no-preference' });
  await rullTilRute(page, 1);
  await expect(page.locator('#trio > .rute').nth(0)).toHaveClass(/dekket/);
  await expect(page.locator('#trio > .rute').nth(1)).not.toHaveClass(/dekket/);
  const kjorende = (i) => page.locator('#trio > .rute').nth(i).evaluate((r) => r.getAnimations({ subtree: true }).filter((a) => a.playState === 'running').length);
  await page.waitForTimeout(2500);
  // Dekket: ingen kjørende animasjoner over flere sekunder (Skaler-løkka har ellers trykk etter 2,4 og 4,3 sekunder).
  for (let t = 0; t < 6; t++) { expect(await kjorende(0), 'dekket rute kjører animasjoner').toBe(0); await page.waitForTimeout(700); }
  // Øverste (Lag maten): kjører animasjoner innen 8 sekunder.
  await expect.poll(() => kjorende(1), { timeout: 25_000 }).toBeGreaterThan(0);
  // Rulles tilbake slik at den første er øverst igjen, går den igjen.
  await rullTilRute(page, 0);
  await expect(page.locator('#trio > .rute').nth(0)).not.toHaveClass(/dekket/);
  await expect.poll(() => kjorende(0), { timeout: 25_000 }).toBeGreaterThan(0);
  await ctx.close();
});

test('uten stabelklassen dekkes ingen ruter', async ({ browser, baseURL }) => {
  const { ctx, page } = await mobil(browser, baseURL, { stabel: false });
  await rullTilRute(page, 1).catch(() => {});
  await page.evaluate(() => scrollTo(0, document.getElementById('trio').getBoundingClientRect().top + scrollY + 900));
  await page.waitForTimeout(300);
  expect(await page.locator('#trio > .rute.dekket').count()).toBe(0);
  await ctx.close();
});

test('fokus på et element i en dekket rute ruller ruta fram', async ({ browser, baseURL }) => {
  const { ctx, page } = await mobil(browser, baseURL);
  await page.evaluate(() => { const b = document.createElement('button'); b.id = 'prove'; b.textContent = 'prøve'; document.querySelector('#trio > .rute .rutetekst').append(b); });
  await rullTilRute(page, 2);
  await expect(page.locator('#trio > .rute').nth(0)).toHaveClass(/dekket/);
  await page.locator('#prove').focus();
  await expect.poll(() => page.locator('#trio > .rute').nth(0).evaluate((r) => r.getBoundingClientRect().top)).toBeCloseTo(80, 0);
  await expect(page.locator('#trio > .rute').nth(0)).not.toHaveClass(/dekket/);
  await ctx.close();
});

test('redusert bevegelse: stablingen er der, men uten overgangseffekter', async ({ browser, baseURL }) => {
  const { ctx, page } = await mobil(browser, baseURL, { redusert: 'reduce' });
  const m = await page.locator('#trio > .rute').evaluateAll((r) => r.map((e) => ({ pos: getComputedStyle(e).position, overgang: getComputedStyle(e).transitionDuration, anim: e.getAnimations().length })));
  for (const x of m) { expect(x.pos).toBe('sticky'); expect(x.overgang).toMatch(/^0s(, 0s)*$/u); expect(x.anim).toBe(0); }
  await ctx.close();
});

test('PC: klassen gjør ingenting', async ({ browser, baseURL }) => {
  const ctx = await browser.newContext({ baseURL, viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(STI);
  await page.evaluate(() => document.getElementById('trio').classList.add('stabel'));
  expect(await page.locator('#trio > .rute').evaluateAll((r) => r.map((e) => getComputedStyle(e).position))).toEqual(Array(5).fill('static'));
  await ctx.close();
});

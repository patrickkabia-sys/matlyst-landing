// Patrick 19.11: rullingen er nettleserens egen, og det som følger rullingen glir mot målet (slik Apple gjør). Ingen layoutskift under rulling.
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { STI } from './hjelp/sprak.mjs';

test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });

test('ingen wheel-lytter og ingen preventDefault på rullehendelser i skall.js og forside.js (statisk)', () => {
  for (const fil of ['skall.js', 'forside.js']) {
    const kode = readFileSync(new URL(`../../${fil}`, import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//gu, '').replace(/(^|[^:])\/\/.*$/gmu, '$1');
    expect(kode, `${fil}: wheel-lytter`).not.toMatch(/addEventListener\(\s*['"](?:wheel|mousewheel|DOMMouseScroll)['"]/u);
    expect(kode, `${fil}: preventDefault i wheel- eller touchmove-lytter`).not.toMatch(/(?:wheel|touchmove)[\s\S]{0,200}preventDefault\(/u);
    expect(kode, `${fil}: onwheel`).not.toMatch(/onwheel|passive:\s*false/u);
  }
});

for (const sti of [STI, '/lagre-oppskrifter-fra-instagram/', '/verktoy/kopp-til-ml/']) {
  test(`0 layoutskift under rulling med musehjul på ${sti} (1440 x 900)`, async ({ browser, baseURL }) => {
    test.setTimeout(90_000);
    const ctx = await browser.newContext({ baseURL, viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
    await ctx.addInitScript(() => { try { localStorage.setItem('matlyst-consent', 'denied'); } catch {} window.__ls = []; try { new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__ls.push({ v: e.value, kilder: (e.sources || []).map((s) => `${s.node?.nodeName}.${s.node?.className}`) }))).observe({ type: 'layout-shift', buffered: true }); } catch {} });
    const page = await ctx.newPage();
    await page.goto(sti, { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);
    await page.evaluate(() => { window.__ls.length = 0; });
    const cdp = await ctx.newCDPSession(page);
    await page.mouse.move(700, 450);
    for (let i = 0; i < 70; i++) { await cdp.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 700, y: 450, deltaX: 0, deltaY: 100 }); await page.waitForTimeout(60); }
    await page.waitForTimeout(400);
    // Skrivemarkøren i Spør Matlyst-feltet gir støy under 1e-6 når teksten vokser; alt over 1e-4 er et ekte layoutskift.
    const skift = (await page.evaluate(() => window.__ls)).filter((e) => e.v > 1e-4);
    expect(skift, 'layoutskift under rulling').toEqual([]);
    await ctx.close();
  });
}

test('kokebokraden glir mot målet uten hopp og uten sprett, og stopper når den er framme', async ({ page }) => {
  await page.goto(STI);
  await page.evaluate(() => { document.querySelector('#cookie')?.remove(); });
  await page.evaluate(() => document.querySelector('.kokebok').scrollIntoView({ block: 'start', behavior: 'instant' }));
  await page.waitForTimeout(700);
  const x = () => page.evaluate(() => new DOMMatrixReadOnly(getComputedStyle(document.querySelector('.kokebok .retter')).transform).m41);
  const x0 = await x();
  await page.evaluate(() => { window.__x = []; const rad = document.querySelector('.kokebok .retter'); const t = () => { window.__x.push(new DOMMatrixReadOnly(getComputedStyle(rad).transform).m41); if (!window.__s) requestAnimationFrame(t); }; requestAnimationFrame(t); window.scrollBy({ top: 300, behavior: 'instant' }); });
  await page.waitForTimeout(1500);
  const rekke = await page.evaluate(() => { window.__s = true; return window.__x; });
  const slutt = await x();
  expect(Math.abs(slutt - x0), 'raden flyttet seg').toBeGreaterThan(20);
  const total = slutt - x0, steg = rekke.slice(1).map((v, i) => v - rekke[i]).filter((d) => Math.abs(d) > 1e-6);
  expect(steg.length, 'glir over flere bilderuter').toBeGreaterThanOrEqual(5);
  expect(steg.every((d) => Math.sign(d) === Math.sign(total)), 'ingen sprett (alle steg samme retning)').toBe(true);
  expect(Math.max(...steg.map(Math.abs)), 'første steg er ikke et hopp').toBeLessThanOrEqual(Math.abs(total) * 0.25);
  // Stoppet: ingen bevegelse de siste bilderutene.
  expect(Math.abs(rekke.at(-1) - rekke.at(-10))).toBeLessThan(0.11);
});

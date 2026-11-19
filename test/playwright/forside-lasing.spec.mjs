// Patrick 19.11: ett sveip er ett kort (stabelen på mobil med berøring). Ekte berøringssveip i Chromium (CDP synthesizeScrollGesture);
// i WebKit styres rullehendelsene syntetisk (touchstart + programmatisk rulling), siden Playwright ikke har berøringssveip der.
import { test, expect, webkit } from '@playwright/test';
import { STI } from './hjelp/sprak.mjs';

const mobil = async (browser, baseURL, { redusert = 'no-preference', berøring = true } = {}) => {
  const ctx = await browser.newContext({ baseURL, viewport: { width: 390, height: 664 }, hasTouch: berøring, isMobile: berøring, deviceScaleFactor: 2, reducedMotion: redusert });
  await ctx.addInitScript(() => { try { localStorage.setItem('matlyst-consent', 'denied'); } catch {} });
  const page = await ctx.newPage();
  await page.goto(STI);
  await page.addStyleTag({ content: '#cookie{display:none!important}' });
  await page.waitForTimeout(600);
  return { ctx, page };
};
const tilKort = (page, i) => page.evaluate((n) => { const trio = document.getElementById('trio'), r = [...trio.querySelectorAll(':scope > .rute')], gap = parseFloat(getComputedStyle(trio).rowGap) || 0; scrollTo(0, trio.getBoundingClientRect().top + scrollY + r.slice(0, n).reduce((t, e) => t + e.offsetHeight + gap, 0) - parseFloat(getComputedStyle(r[n]).top)); }, i);
const sveip = async (ctx, page, dist, fart) => { const c = await ctx.newCDPSession(page); await c.send('Input.synthesizeScrollGesture', { x: 200, y: 500, yDistance: -dist, speed: fart, gestureSourceType: 'touch' }); await page.waitForTimeout(1600); };
const topper = (page) => page.evaluate(() => [...document.querySelectorAll('#trio > .rute')].map((r) => Math.round(r.getBoundingClientRect().top)));
// Kort i er «landet» når det står i sin stabelposisjon: 12 px + 6 px per kort fra toppen.
const staar = (t, i) => Math.abs(t[i] - (12 + 6 * i)) <= 2;

test('ett vanlig sveip flytter nøyaktig ett kort, også et kraftig sveip', async ({ browser, baseURL }) => {
  test.setTimeout(90_000);
  const { ctx, page } = await mobil(browser, baseURL);
  await tilKort(page, 0); await page.waitForTimeout(500);
  expect(staar(await topper(page), 0)).toBe(true);
  for (const [i, dist, fart] of [[1, 200, 800], [2, 300, 1200], [3, 900, 6000], [4, 1800, 9000]]) {
    await sveip(ctx, page, dist, fart);
    const t = await topper(page);
    expect(staar(t, i), `etter sveip ${dist}/${fart} skal kort ${i + 1} stå 12 px (+6 per kort) fra toppen: ${t}`).toBe(true);
  }
  await ctx.close();
});

test('sveip oppover flytter ett kort tilbake', async ({ browser, baseURL }) => {
  const { ctx, page } = await mobil(browser, baseURL);
  await tilKort(page, 3); await page.waitForTimeout(500);
  await sveip(ctx, page, -250, 900);
  expect(staar(await topper(page), 2)).toBe(true);
  await sveip(ctx, page, -1500, 9000);
  expect(staar(await topper(page), 1), 'kraftig sveip oppover stopper på forrige kort').toBe(true);
  await ctx.close();
});

test('fra siste kort kommer man videre til Spør Matlyst, og ovenfra inn i stabelen går fritt', async ({ browser, baseURL }) => {
  const { ctx, page } = await mobil(browser, baseURL);
  await tilKort(page, 4); await page.waitForTimeout(500);
  const y = await page.evaluate(() => scrollY);
  await sveip(ctx, page, 900, 6000);
  const m = await page.evaluate(() => ({ y: scrollY, spor: document.getElementById('spor').getBoundingClientRect().top }));
  expect(m.y, 'siste kort holder ikke fast').toBeGreaterThan(y + 400);
  expect(m.spor).toBeLessThan(664);
  // Ovenfra inn i stabelen: fritt, uten hopp til første kort (en sveipdistanse på 220 gir omtrent 220 px).
  await page.evaluate(() => { const t = document.getElementById('trio'); scrollTo(0, t.getBoundingClientRect().top + scrollY - 664 + 100); });
  await page.waitForTimeout(500);
  const y2 = await page.evaluate(() => scrollY);
  await sveip(ctx, page, 220, 800);
  const d = (await page.evaluate(() => scrollY)) - y2;
  expect(d, `ovenfra inn går fritt (flyttet ${d})`).toBeGreaterThan(150);
  expect(d).toBeLessThan(330);
  await ctx.close();
});

test('ingen låsing på resten av siden, og ikke på PC', async ({ browser, baseURL }) => {
  const { ctx, page } = await mobil(browser, baseURL);
  const y0 = await page.evaluate(() => scrollY);
  await sveip(ctx, page, 230, 800);
  const d = (await page.evaluate(() => scrollY)) - y0;
  expect(d, `toppen av siden: ${d}`).toBeGreaterThan(150); expect(d).toBeLessThan(330);
  await ctx.close();
  const pc = await browser.newContext({ baseURL, viewport: { width: 1280, height: 800 } });
  const p = await pc.newPage(); await p.goto(STI);
  expect(await p.evaluate(() => matchMedia('(pointer:coarse)').matches)).toBe(false);
  await p.evaluate(() => document.getElementById('trio').scrollIntoView({ block: 'start', behavior: 'instant' }));
  const cdp = await pc.newCDPSession(p);
  const y1 = await p.evaluate(() => scrollY);
  await p.mouse.move(600, 400);
  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 600, y: 400, deltaX: 0, deltaY: 100 });
  await p.waitForTimeout(800);
  expect((await p.evaluate(() => scrollY)) - y1, 'PC: vanlig hjulrulling').toBeCloseTo(100, 0);
  await pc.close();
});

test('redusert bevegelse: kortet hopper direkte (ingen glidning)', async ({ browser, baseURL }) => {
  const { ctx, page } = await mobil(browser, baseURL, { redusert: 'reduce' });
  await tilKort(page, 0); await page.waitForTimeout(300);
  const c = await ctx.newCDPSession(page);
  await c.send('Input.synthesizeScrollGesture', { x: 200, y: 500, yDistance: -900, speed: 6000, gestureSourceType: 'touch' });
  await page.waitForTimeout(500);
  expect(staar(await topper(page), 1), 'neste kort er på plass uten å vente på en glidning').toBe(true);
  await ctx.close();
});

test('WebKit: touchstart og en lang rulling stopper på neste kort (reserven i forside.js)', async () => {
  test.setTimeout(90_000);
  const b = await webkit.launch();
  const ctx = await b.newContext({ baseURL: `http://127.0.0.1:4173`, viewport: { width: 390, height: 664 }, hasTouch: true, isMobile: true, reducedMotion: 'no-preference' });
  await ctx.addInitScript(() => { try { localStorage.setItem('matlyst-consent', 'denied'); } catch {} });
  const page = await ctx.newPage();
  await page.goto(STI);
  await page.addStyleTag({ content: '#cookie{display:none!important}' });
  await page.waitForTimeout(800);
  expect(await page.evaluate(() => matchMedia('(pointer:coarse)').matches), 'WebKit-emuleringen har berøring').toBe(true);
  await tilKort(page, 0); await page.waitForTimeout(400);
  for (const [i, lengde] of [[1, 200], [2, 900], [3, 1800]]) {
    await page.evaluate(() => document.dispatchEvent(new Event('touchstart', { bubbles: true })));
    await page.evaluate((l) => scrollBy({ top: l, behavior: 'instant' }), lengde);
    await page.evaluate(() => document.dispatchEvent(new Event('touchend', { bubbles: true })));
    await page.waitForTimeout(1800);
    const t = await topper(page);
    expect(staar(t, i), `WebKit: kort ${i + 1} skal stå 12 px (+6 per kort) fra toppen: ${t}`).toBe(true);
  }
  await b.close();
});

// Retterunde 3: reserven virker bare på rulling som startet med berøring i stabelen og kort tid etter at fingeren er løftet.
test('trykk uten rulling etterfulgt av et ankerhopp langt ned trekker ikke siden tilbake til et kort', async ({ browser, baseURL }) => {
  const { ctx, page } = await mobil(browser, baseURL);
  await tilKort(page, 2); await page.waitForTimeout(500);
  await page.touchscreen.tap(200, 300);
  await page.waitForTimeout(200);
  await page.evaluate(() => { location.hash = '#pris'; });
  await page.waitForTimeout(2500);
  const m = await page.evaluate(() => ({ y: scrollY, pris: document.getElementById('pris').getBoundingClientRect().top }));
  expect(Math.abs(m.pris), `siden står ved #pris (${m.pris})`).toBeLessThan(120);
  await ctx.close();
});

test('en finger som holdes nede i ro i 300 ms gir ingen korreksjon', async ({ browser, baseURL }) => {
  const { ctx, page } = await mobil(browser, baseURL);
  await tilKort(page, 1); await page.waitForTimeout(500);
  const c = await ctx.newCDPSession(page);
  await c.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 200, y: 400 }] });
  await page.evaluate(() => scrollBy({ top: 250, behavior: 'instant' }));
  await page.waitForTimeout(300);
  const y = await page.evaluate(() => scrollY);
  await page.waitForTimeout(600);
  expect(await page.evaluate(() => scrollY), 'ingen korreksjon mens fingeren er nede').toBe(y);
  await c.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await ctx.close();
});

test('redusert bevegelse: reserven er av, rullingen er fri', async ({ browser, baseURL }) => {
  const { ctx, page } = await mobil(browser, baseURL, { redusert: 'reduce' });
  await tilKort(page, 0); await page.waitForTimeout(300);
  const y0 = await page.evaluate(() => scrollY);
  await sveip(ctx, page, 230, 800);
  const d = (await page.evaluate(() => scrollY)) - y0;
  expect(d, `fri rulling (${d})`).toBeGreaterThan(150); expect(d).toBeLessThan(330);
  await ctx.close();
});

// Retterunde 3: stabling og låsing er bare på når hvert kort får plass i ledig høyde.
test('liggende telefon (667 x 375): stabelen er av, kortene ligger vanlig under hverandre, og rullingen er fri', async ({ browser }) => {
  const ctx = await browser.newContext({ baseURL: 'http://127.0.0.1:4173', viewport: { width: 667, height: 375 }, hasTouch: true, isMobile: true, reducedMotion: 'no-preference' });
  await ctx.addInitScript(() => { try { localStorage.setItem('matlyst-consent', 'denied'); } catch {} });
  const page = await ctx.newPage();
  await page.goto(STI);
  await page.addStyleTag({ content: '#cookie{display:none!important}' });
  await page.waitForTimeout(800);
  expect(await page.locator('#trio').getAttribute('class')).not.toContain('stabel');
  const m = await page.locator('#trio > .rute').evaluateAll((r) => r.map((e) => ({ pos: getComputedStyle(e).position, t: e.getBoundingClientRect().top + scrollY, h: e.offsetHeight })));
  expect(m.map((x) => x.pos)).toEqual(Array(5).fill('static'));
  for (let i = 1; i < 5; i++) expect(m[i].t, 'ingenting skjult bak et annet kort').toBeGreaterThanOrEqual(m[i - 1].t + m[i - 1].h - 1);
  await page.evaluate(() => document.getElementById('trio').scrollIntoView({ block: 'start', behavior: 'instant' }));
  const y0 = await page.evaluate(() => scrollY);
  const c = await ctx.newCDPSession(page);
  await c.send('Input.synthesizeScrollGesture', { x: 300, y: 300, yDistance: -120, speed: 600, gestureSourceType: 'touch' });
  await page.waitForTimeout(1500);
  const d = (await page.evaluate(() => scrollY)) - y0;
  expect(d, `fri rulling (${d})`).toBeGreaterThan(80); expect(d).toBeLessThan(160);
  await ctx.close();
});

test('200 % tekst: stabelen slås av, og slås på igjen når teksten er normal', async ({ browser, baseURL }) => {
  const { ctx, page } = await mobil(browser, baseURL);
  expect(await page.locator('#trio').getAttribute('class')).toContain('stabel');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  await expect.poll(() => page.locator('#trio').getAttribute('class'), { timeout: 4000 }).not.toContain('stabel');
  expect(await page.locator('#trio > .rute').evaluateAll((r) => r.map((e) => getComputedStyle(e).position))).toEqual(Array(5).fill('static'));
  await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
  await expect.poll(() => page.locator('#trio').getAttribute('class'), { timeout: 4000 }).toContain('stabel');
  await ctx.close();
});

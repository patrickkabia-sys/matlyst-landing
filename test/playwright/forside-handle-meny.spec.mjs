// Patrick 19.11: «hold inne»-menyen i Handle-flisen skal ligge helt innenfor flisen og skjermen på mobil, og retten som holdes skal stå helt synlig.
import { test, expect } from '@playwright/test';
import { STI } from './hjelp/sprak.mjs';

for (const [bredde, hoyde] of [[390, 664], [360, 640], [320, 640]]) {
  test(`Handle: menyen og den holdte retten ligger innenfor flisen og skjermen, ${bredde} x ${hoyde}`, async ({ browser, baseURL }) => {
    test.setTimeout(60_000);
    const ctx = await browser.newContext({ baseURL, viewport: { width: bredde, height: hoyde }, reducedMotion: 'no-preference' });
    const page = await ctx.newPage();
    await page.clock.install();
    await page.goto(STI);
    await page.addStyleTag({ content: '#cookie{display:none!important}' });
    await page.evaluate(() => document.getElementById('demoHandle').closest('.rute').scrollIntoView({ block: 'center', behavior: 'instant' }));
    let vist = false;
    for (let t = 0; t < 80 && !vist; t++) { await page.clock.runFor(250); vist = await page.locator('#demoHandle .a-meny.vis').count() > 0; }
    expect(vist, 'menyen ble aldri vist').toBe(true);
    await page.clock.runFor(500);
    const m = await page.evaluate(() => {
      const app = document.getElementById('demoHandle'), rute = app.closest('.rute'), meny = app.querySelector('.a-meny'), rett = app.querySelector('.handle-rett'), rad = app.querySelector('.a-merker');
      const r = (e) => { const b = e.getBoundingClientRect(); return { l: b.left, t: b.top, r: b.right, b: b.bottom }; };
      return { meny: r(meny), rett: r(rett), rute: r(rute), rad: r(rad), vw: innerWidth, side: document.documentElement.scrollWidth, tapp: r(app.querySelector('.a-tapp i')) };
    });
    const inni = (a, b, navn, luft = 0) => { expect(a.l, `${navn} venstre`).toBeGreaterThanOrEqual(b.l + luft - 0.5); expect(a.r, `${navn} høyre`).toBeLessThanOrEqual(b.r - luft + 0.5); };
    inni(m.meny, m.rute, 'menyen i flisen'); inni(m.meny, { l: 0, r: m.vw }, 'menyen på skjermen');
    inni(m.rett, m.rute, 'retten i flisen'); inni(m.rett, { l: 0, r: m.vw }, 'retten på skjermen'); inni(m.rett, m.rad, 'retten i sveiperaden');
    expect(m.meny.t).toBeGreaterThanOrEqual(m.rute.t - 0.5); expect(m.meny.b).toBeLessThanOrEqual(m.rute.b + 0.5);
    expect(m.side, 'ingen sidelengs rulling').toBeLessThanOrEqual(bredde);
    await ctx.close();
  });
}

test('Handle: raden går tilbake til start når løkka begynner på nytt, og Husstand-valget er synlig i raden', async ({ browser, baseURL }) => {
  const ctx = await browser.newContext({ baseURL, viewport: { width: 360, height: 640 }, reducedMotion: 'no-preference' });
  const page = await ctx.newPage();
  await page.clock.install();
  await page.goto(STI);
  await page.addStyleTag({ content: '#cookie{display:none!important}' });
  await page.evaluate(() => document.getElementById('demoHandle').closest('.rute').scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.clock.runFor(3500);
  expect(await page.locator('#demoHandle .a-merker').evaluate((e) => e.scrollLeft)).toBeGreaterThan(0);
  // Når løkka starter på nytt (rundt 17 sekunder), går raden tilbake til start.
  let tilbake = false;
  for (let i = 0; i < 100 && !tilbake; i++) { await page.clock.runFor(250); tilbake = (await page.locator('#demoHandle .a-merker').evaluate((e) => e.scrollLeft)) === 0; }
  expect(tilbake, 'raden gikk aldri tilbake til start').toBe(true);
  // Husstand: den valgte knappen er synlig i raden etter klikk
  await page.evaluate(() => document.getElementById('demoHus').closest('.rute').scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.locator('.a-husvelg button').nth(2).click();
  await page.clock.runFor(800);
  const k = await page.evaluate(() => { const b = document.querySelectorAll('.a-husvelg button')[2].getBoundingClientRect(), r = document.querySelector('.a-husvelg').getBoundingClientRect(); return { v: b.left - r.left, h: r.right - b.right }; });
  expect(k.v).toBeGreaterThanOrEqual(-1); expect(k.h).toBeGreaterThanOrEqual(-1);
  await ctx.close();
});

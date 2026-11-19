// Patrick 19.11: forsidens fliser skal få plass på en mobilskjerm (under 720 px; PC er uendret).
// Kjøres per språk (FORSIDE_SPRAK), som de andre forsidetestene.
import { test, expect } from '@playwright/test';
import { STI } from './hjelp/sprak.mjs';
import { forHoyeFliserPaaMobil } from './hjelp/revisjon.mjs';

test.use({ reducedMotion: 'reduce' });
const rullInn = (page) => page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 400) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 20)); } scrollTo(0, 0); });
const mobil = async (page, bredde = 390, hoyde = 664) => { await page.setViewportSize({ width: bredde, height: hoyde }); await page.goto(STI); await rullInn(page); await page.addStyleTag({ content: '#cookie{display:none!important}' }); };

for (const [bredde, hoyde] of [[390, 664], [360, 640]]) {
  test(`hver flis (fem ruter og to Spør Matlyst-fliser) er høyst 100svh minus toppen minus luft, i alle varianter, ${bredde} x ${hoyde}`, async ({ page }) => {
    await mobil(page, bredde, hoyde);
    expect(await page.locator('#trio article.rute').count()).toBe(5);
    expect(await page.locator('.spor .to > *').count()).toBe(2);
    expect(await forHoyeFliserPaaMobil(page)).toEqual([]);
  });
}

test('husstand: én rett i stedet for to, valgene på én sveipbar linje uten sidelengs rulling av siden', async ({ page }) => {
  await mobil(page);
  const m = await page.evaluate(() => {
    const rad = document.querySelector('.a-husvelg'), s = getComputedStyle(rad);
    return { ruller: s.overflowX, snap: s.scrollSnapType, nowrap: s.flexWrap, bredere: rad.scrollWidth > rad.clientWidth, knapper: rad.querySelectorAll('button').length, scrollbar: s.scrollbarWidth, side: document.documentElement.scrollWidth, maltider: [...document.querySelectorAll('.a-husflate .a-maltid')].filter((e) => e.getBoundingClientRect().height > 0).length };
  });
  expect(m.ruller).toBe('auto'); expect(m.snap).toContain('x'); expect(m.nowrap).toBe('nowrap'); expect(m.scrollbar).toBe('none');
  expect(m.knapper).toBe(3); expect(m.bredere, 'raden kan sveipes').toBe(true);
  expect(m.side).toBeLessThanOrEqual(390);
  expect(m.maltider, 'én rett vises').toBe(1);
  // Tastatur: Tab flytter fokus til neste knapp i raden, og knappen er synlig i sveiperaden etter fokus (raden ruller den fram).
  await page.locator('.a-husvelg button').first().focus();
  await page.keyboard.press('Tab'); await page.keyboard.press('Tab');
  expect(await page.evaluate(() => document.activeElement === document.querySelectorAll('.a-husvelg button')[2])).toBe(true);
  await expect.poll(() => page.evaluate(() => document.querySelector('.a-husvelg').scrollLeft), { timeout: 4000 }).toBeGreaterThan(0);
  await page.waitForTimeout(300);
  const synlig = await page.evaluate(() => { const k = document.activeElement.getBoundingClientRect(), r = document.querySelector('.a-husvelg').getBoundingClientRect(); return { venstre: k.left - r.left, hoyre: r.right - k.right, rullet: document.querySelector('.a-husvelg').scrollLeft }; });
  expect(synlig.venstre, 'knappen er innenfor raden til venstre').toBeGreaterThanOrEqual(-1);
  expect(synlig.hoyre, 'knappen er innenfor raden til høyre').toBeGreaterThanOrEqual(-1);
  expect(synlig.rullet, 'raden rullet').toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  // Husstandene med handleliste: varene står alle sammen, ingen er klippet bort
  await page.locator('.a-husvelg button').nth(1).click();
  expect(await page.locator('.a-husflate .a-vare:visible').count()).toBeGreaterThanOrEqual(5);
});

test('Spør Matlyst: to fliser, forslagene på én sveipbar linje, to endringer, og småteksten og KI-merknaden er synlige', async ({ page }) => {
  await mobil(page);
  const m = await page.evaluate(() => {
    const [a, b] = [...document.querySelectorAll('.spor .to > *')], rad = document.querySelector('.forslagrad'), s = getComputedStyle(rad);
    const synlig = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'; };
    return {
      ulike: a !== b && a.getBoundingClientRect().bottom <= b.getBoundingClientRect().top + 1,
      kuleI: a.contains(document.querySelector('.kule')), h2I: a.contains(document.querySelector('.spor h2')), felt: a.contains(document.querySelector('.felt')), forslag: a.contains(rad),
      svarI: b.contains(document.querySelector('.a-svar')), smaatt: a.contains(document.querySelector('.smaatt')) && synlig(document.querySelector('.smaatt')), ki: b.contains(document.querySelector('.a-ki')) && synlig(document.querySelector('.a-ki')),
      ruller: s.overflowX, nowrap: s.flexWrap, scrollbar: s.scrollbarWidth, bredere: rad.scrollWidth > rad.clientWidth,
      endringer: [...document.querySelectorAll('#sporListe .a-endr')].filter(synlig).length, etikett: document.querySelector('#sporAntall').textContent, valg: document.querySelectorAll('.a-valg span').length,
      bakgrunn: [getComputedStyle(a).backgroundImage !== 'none', getComputedStyle(b).backgroundImage !== 'none'], side: document.documentElement.scrollWidth,
    };
  });
  expect(m.ulike).toBe(true);
  expect([m.kuleI, m.h2I, m.felt, m.forslag, m.svarI, m.smaatt, m.ki]).toEqual([true, true, true, true, true, true, true]);
  expect(m.ruller).toBe('auto'); expect(m.nowrap).toBe('nowrap'); expect(m.scrollbar).toBe('none'); expect(m.bredere).toBe(true);
  expect(m.endringer, 'to endringer i stedet for tre').toBe(2);
  expect(m.etikett, 'etiketten teller de to som vises').toContain('2');
  expect(m.etikett).not.toContain('3');
  expect(m.valg).toBe(2);
  expect(m.bakgrunn).toEqual([true, true]);
  expect(m.side).toBeLessThanOrEqual(390);
});

test('Spør Matlyst: skrivingen og svaret går i loop som før (nettleseren løper uten redusert bevegelse)', async ({ browser, baseURL }) => {
  const ctx = await browser.newContext({ baseURL, viewport: { width: 390, height: 664 }, reducedMotion: 'no-preference' });
  const page = await ctx.newPage();
  await page.goto(STI);
  await page.addStyleTag({ content: '#cookie{display:none!important}' });
  await page.evaluate(() => document.getElementById('spor').scrollIntoView({ block: 'start', behavior: 'instant' }));
  await expect(page.locator('#spor')).toHaveClass(/i-bildet/);
  await expect.poll(() => page.locator('#sporTekst').textContent(), { timeout: 8000 }).not.toBe('');
  await expect(page.locator('.felt')).toHaveClass(/ferdig/, { timeout: 10000 });
  await ctx.close();
});

test('den faste knappen skjules mens #trio eller #spor er i bildet, og kommer tilbake etterpå (bare forsiden)', async ({ browser, baseURL }) => {
  const ctx = await browser.newContext({ baseURL, viewport: { width: 390, height: 664 }, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(STI);
  await page.locator('#ck-reject').click();
  const vis = () => page.locator('#fast').evaluate((el) => el.classList.contains('vis'));
  await page.evaluate(() => document.querySelector('.kilder').scrollIntoView({ block: 'center', behavior: 'instant' }));
  await expect.poll(vis).toBe(true);
  for (const id of ['spor', 'trio']) {
    await page.evaluate((i) => { const r = document.getElementById(i).getBoundingClientRect(); scrollTo(0, scrollY + r.top + r.height / 2 - innerHeight / 2); }, id);
    await expect.poll(vis, { message: `#${id} i bildet` }).toBe(false);
    await expect(page.locator('#fast')).toHaveAttribute('inert');
  }
  await page.evaluate(() => document.getElementById('pris').scrollIntoView({ block: 'center', behavior: 'instant' }));
  await expect.poll(vis, { message: 'etter flisene' }).toBe(true);
  await expect(page.locator('#fast')).not.toHaveAttribute('inert');
  await ctx.close();
});

test('PC er uendret: to kolonner i Spør Matlyst, retter og husvalg brytes, to retter i husstand', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(STI);
  const m = await page.evaluate(() => ({
    kol: getComputedStyle(document.querySelector('.spor .to')).gridTemplateColumns.split(' ').length,
    flate: getComputedStyle(document.querySelector('.sporflate')).paddingTop,
    husvelg: getComputedStyle(document.querySelector('.a-husvelg')).flexWrap, forslag: getComputedStyle(document.querySelector('.forslagrad')).flexWrap,
    maltider: [...document.querySelectorAll('.a-husflate .a-maltid')].filter((e) => e.getBoundingClientRect().height > 0).length,
    kule: document.querySelector('.kule').getBoundingClientRect().width,
  }));
  expect(m).toEqual({ kol: 2, flate: '72px', husvelg: 'wrap', forslag: 'wrap', maltider: 2, kule: 116 });
});

test('under 380 px vises bare avataren på husstandsvarene, og navnet er tilgjengelig (ikke display:none)', async ({ page }) => {
  await mobil(page, 360, 640);
  await page.locator('.a-husvelg button').nth(1).click();
  const m = await page.evaluate(() => [...document.querySelectorAll('.a-husflate .a-eier')].map((e) => {
    const n = e.querySelector('.a-navn'), s = getComputedStyle(n), r = n.getBoundingClientRect();
    return { navn: n.textContent.trim(), display: s.display, visibility: s.visibility, bredde: Math.round(r.width), ariaHidden: !!n.closest('[aria-hidden="true"]'), boks: Math.round(e.getBoundingClientRect().width) };
  }));
  expect(m.length).toBeGreaterThanOrEqual(5);
  for (const x of m) {
    expect(x.navn.length, 'navnet står i DOM').toBeGreaterThan(1);
    expect(x.display, 'ikke display:none').not.toBe('none'); expect(x.visibility).toBe('visible'); expect(x.ariaHidden).toBe(false);
    expect(x.bredde, 'visuelt skjult').toBeLessThanOrEqual(1); expect(x.boks, 'bare avataren synes').toBeLessThanOrEqual(30);
  }
  // Over 380 px står navnet synlig.
  await page.setViewportSize({ width: 390, height: 664 });
  expect(await page.locator('.a-husflate .a-navn').first().evaluate((e) => e.getBoundingClientRect().width)).toBeGreaterThan(20);
});

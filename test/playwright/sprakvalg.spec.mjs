import { expect, test } from '@playwright/test';

async function nySide(browser, locale) {
  const context = await browser.newContext({ locale });
  const page = await context.newPage();
  return { context, page };
}

for (const [locale, maal] of [['sv-SE', '/sv/'], ['da-DK', '/da/']]) {
  test(`${locale} sendes én gang fra norsk forside til ${maal}`, async ({ browser, baseURL }) => {
    const { context, page } = await nySide(browser, locale);
    await page.goto('/');
    await expect(page).toHaveURL(`${baseURL}${maal}`);
    await page.waitForTimeout(100);
    await expect(page).toHaveURL(`${baseURL}${maal}`);
    // Forsiden er bygget av skallet: toppvelgeren ligger i menypanelet og vises når menyen åpnes.
    await expect(page.locator('.language-switcher-top')).toHaveCount(1);
    await page.locator('.language-switcher-bottom').scrollIntoViewIfNeeded();
    await expect(page.locator('.language-switcher-bottom')).toBeVisible();
    await context.close();
  });
}

for (const locale of ['nb-NO', 'en-US']) {
  test(`${locale} blir på den norske siden`, async ({ browser, baseURL }) => {
    const { context, page } = await nySide(browser, locale);
    await page.goto('/');
    await page.waitForTimeout(100);
    await expect(page).toHaveURL(`${baseURL}/`);
    await context.close();
  });
}

test('direkte svensk og dansk URL omdirigeres aldri', async ({ browser, baseURL }) => {
  const { context, page } = await nySide(browser, 'nb-NO');
  for (const sti of ['/sv/', '/da/privatliv/']) {
    await page.goto(sti);
    await page.waitForTimeout(100);
    await expect(page).toHaveURL(`${baseURL}${sti}`);
  }
  await context.close();
});

test('valg av norsk huskes og hindrer senere automatisk omdirigering', async ({ browser, baseURL }) => {
  const { context, page } = await nySide(browser, 'sv-SE');
  await page.goto('/?sprak=nb');
  await expect.poll(() => page.evaluate(() => ({
    valgt: localStorage.getItem('matlyst-sprak'),
    vurdert: localStorage.getItem('matlyst-sprak-vurdert'),
  }))).toEqual({ valgt: 'nb', vurdert: '1' });
  await page.goto('/personvern.html');
  await page.waitForTimeout(100);
  await expect(page).toHaveURL(`${baseURL}/personvern.html`);
  await context.close();
});

test('toppvelgeren og bunnvelgeren virker med tastatur', async ({ browser, baseURL }) => {
  const { context, page } = await nySide(browser, 'en-US');
  await page.goto('/');

  const dansk = page.locator('.language-switcher-top a[aria-label="Dansk"]');
  const meny = page.locator('#menyknapp');
  // Fra toppen av siden med Tab, ikke fokus() direkte.
  for (let i = 0; i < 10 && !(await meny.evaluate((el) => el === document.activeElement)); i++) await page.keyboard.press('Tab');
  await expect(meny).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(meny).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Escape');
  await expect(meny).toBeFocused();
  await expect(meny).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('Enter');
  await expect(meny).toHaveAttribute('aria-expanded', 'true');
  for (let i = 0; i < 60 && !(await dansk.evaluate((el) => el === document.activeElement)); i++) await page.keyboard.press('Tab');
  await expect(dansk).toBeFocused();
  // Fulle navn står som synlig tekst i velgeren.
  await expect(dansk).toHaveText('Dansk');
  await expect(page.locator('.language-switcher-top a[aria-label="English"]')).toHaveText('English');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(`${baseURL}/da/`);

  const norsk = page.locator('.language-switcher-bottom a[aria-label="Norsk"]');
  await norsk.focus();
  await expect(norsk).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(`${baseURL}/`);
  await context.close();
});

const SKJERM = '.superpowers/sdd/2026-11-19-undersider-skall-og-grunnstil/skjerm';
for (const bredde of [360, 390, 768]) {
  test(`toppvelgeren med menyen åpen: fulle navn uten brekk, 2 x 2 under 720 px (${bredde} px)`, async ({ browser }) => {
    const context = await browser.newContext({ locale: 'nb-NO', viewport: { width: bredde, height: 800 } });
    await context.addInitScript(() => { try { localStorage.setItem('matlyst-consent', 'rejected'); } catch {} });
    const page = await context.newPage();
    await page.goto('/');
    await page.locator('#menyknapp').click();
    await page.waitForTimeout(600);
    const velger = page.locator('.language-switcher-top');
    await velger.scrollIntoViewIfNeeded();
    const celler = await velger.locator('a').evaluateAll((as) => as.map((a) => {
      const r = a.getBoundingClientRect();
      const m = document.createRange(); m.selectNodeContents(a);
      return { x: r.x, y: r.y, w: r.width, h: r.height, tekstLinjer: m.getClientRects().length, tekst: a.textContent };
    }));
    expect(celler.map((c) => c.tekst)).toEqual(['Norsk', 'Svenska', 'Dansk', 'English']);
    for (const c of celler) {
      expect(c.w, c.tekst).toBeGreaterThanOrEqual(44);
      expect(c.h, c.tekst).toBeGreaterThanOrEqual(44);
      expect(c.tekstLinjer, `${c.tekst} brytes`).toBe(1);
    }
    const rader = new Set(celler.map((c) => Math.round(c.y)));
    expect(rader.size).toBe(bredde < 721 ? 2 : 1);
    if (bredde < 721) {
      expect(Math.round(celler[0].y)).toBe(Math.round(celler[1].y));
      expect(Math.round(celler[2].y)).toBe(Math.round(celler[3].y));
      expect(celler[0].x).toBeCloseTo(celler[2].x, 0);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    if (bredde !== 390) await page.screenshot({ path: `${SKJERM}/t4-sprakvelger-${bredde}.png` });
    await context.close();
  });
}

test('bunnvelgeren på 360 px: ingen brekk, 44 px mål, ingen sidelengs rulling', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'nb-NO', viewport: { width: 360, height: 800 } });
  const page = await context.newPage();
  await page.goto('/');
  const celler = await page.locator('.language-switcher-bottom a').evaluateAll((as) => as.map((a) => {
    const r = a.getBoundingClientRect();
    const m = document.createRange(); m.selectNodeContents(a);
    return { w: r.width, h: r.height, tekstLinjer: m.getClientRects().length, tekst: a.textContent, hoyre: r.right };
  }));
  for (const c of celler) {
    expect(c.w, c.tekst).toBeGreaterThanOrEqual(44);
    expect(c.h, c.tekst).toBeGreaterThanOrEqual(44);
    expect(c.tekstLinjer, `${c.tekst} brytes`).toBe(1);
    expect(c.hoyre).toBeLessThanOrEqual(360);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await context.close();
});

test('Tab ut av menypanelet lukker menyen', async ({ browser }) => {
  const { context, page } = await nySide(browser, 'nb-NO');
  await page.goto('/');
  const meny = page.locator('#menyknapp');
  await meny.focus();
  await page.keyboard.press('Enter');
  await expect(meny).toHaveAttribute('aria-expanded', 'true');
  // English er siste fokuserbare element i panelet; neste Tab går ut av det.
  await page.locator('.language-switcher-top a[aria-label="English"]').focus();
  await page.keyboard.press('Tab');
  await expect(meny).toHaveAttribute('aria-expanded', 'false');
  await context.close();
});

test('toppvelgeren virker med tastatur på /verktoy/kopp-til-dl/', async ({ browser }) => {
  const { context, page } = await nySide(browser, 'nb-NO');
  await page.goto('/verktoy/kopp-til-dl/');
  const meny = page.locator('#menyknapp');
  await meny.focus();
  await page.keyboard.press('Enter');
  await expect(meny).toHaveAttribute('aria-expanded', 'true');
  // På undersidene står språkene i rekkefølgen English, Norsk, Svenska, Dansk: Dansk er siste fokuserbare i panelet.
  await page.locator('.language-switcher-top a').last().focus();
  await page.keyboard.press('Tab');
  await expect(meny).toHaveAttribute('aria-expanded', 'false');
  await context.close();
});

test('velgeren bruker riktig motstykke på personvernsiden', async ({ browser, baseURL }) => {
  const { context, page } = await nySide(browser, 'en-US');
  await page.goto('/personvern.html');
  // Den mørke bunnen er klebrig bak arket og avdekkes først når siden er rullet helt ned. Den lange
  // personvernsiden ligger «i bildet» uten å være det, så testen ruller som en leser gjør.
  const sv = page.locator('.under .language-switcher-bottom a[aria-label="Svenska"]');
  await expect(sv).toHaveCount(1);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await sv.click();
  await expect(page).toHaveURL(`${baseURL}/sv/integritet/`);
  await context.close();
});

// Den klebrige mørke bunnen må nås slik en bruker gjør: med musehjul og med tastatur.
test('personvernsiden: bunnvelgeren nås med musehjul og vanlig klikk, uten scrollIntoView', async ({ browser, baseURL }) => {
  const { context, page } = await nySide(browser, 'en-US');
  await page.goto('/personvern.html');
  const sv = page.locator('.under .language-switcher-bottom a[aria-label="Svenska"]');
  await expect(sv).toHaveCount(1);
  await page.mouse.move(640, 400);
  for (let i = 0; i < 80 && !(await page.evaluate(() => window.scrollY + innerHeight >= document.documentElement.scrollHeight - 1)); i++) await page.mouse.wheel(0, 3000);
  await expect.poll(() => page.evaluate(() => window.scrollY + innerHeight >= document.documentElement.scrollHeight - 1)).toBe(true);
  const boks = await sv.boundingBox();
  const treff = await page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.closest('a')?.getAttribute('aria-label'), { x: boks.x + boks.width / 2, y: boks.y + boks.height / 2 });
  expect(treff).toBe('Svenska');
  await page.mouse.click(boks.x + boks.width / 2, boks.y + boks.height / 2);
  await expect(page).toHaveURL(`${baseURL}/sv/integritet/`);
  await context.close();
});

test('personvernsiden: bunnvelgeren nås med Tab og Enter', async ({ browser, baseURL }) => {
  const { context, page } = await nySide(browser, 'en-US');
  await page.goto('/personvern.html');
  let fokus = null;
  for (let i = 0; i < 400; i++) {
    await page.keyboard.press('Tab');
    fokus = await page.evaluate(() => { const a = document.activeElement; return a?.closest?.('.under .language-switcher-bottom') ? a.getAttribute('aria-label') : null; });
    if (fokus === 'Svenska') break;
  }
  expect(fokus).toBe('Svenska');
  const synlig = await page.evaluate(() => { const r = document.activeElement.getBoundingClientRect(); const e = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return e?.closest('a') === document.activeElement; });
  expect(synlig, 'lenken med fokus er ikke dekket av arket').toBe(true);
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(`${baseURL}/sv/integritet/`);
  await context.close();
});

test('språkbytte på avmeldingssiden bevarer token og norsk valg', async ({ browser, baseURL }) => {
  const { context, page } = await nySide(browser, 'sv-SE');
  await page.goto('/avmeld/?u=bruker&s=signatur');
  // Tokenet følger med i lenka, men avmeld.js fjerner u og s fra adresselinja
  // straks siden har lest dem. Lenkene viser derfor at tokenet ble med, og
  // URL-en viser at det ikke ble stående.
  await expect(page.locator('.language-switcher-top a[aria-label="Svenska"]'))
    .toHaveAttribute('href', '/sv/avregistrera/?u=bruker&s=signatur&sprak=sv');
  await page.locator('.language-switcher-top a[aria-label="Svenska"]').click();
  await expect(page).toHaveURL(`${baseURL}/sv/avregistrera/?sprak=sv`);
  await expect(page.locator('.language-switcher-top a[aria-label="Norsk"]'))
    .toHaveAttribute('href', '/avmeld/?u=bruker&s=signatur&sprak=nb');
  await page.locator('.language-switcher-top a[aria-label="Norsk"]').click();
  await expect(page).toHaveURL(`${baseURL}/avmeld/?sprak=nb`);
  await page.goto('/');
  await page.waitForTimeout(100);
  await expect(page).toHaveURL(`${baseURL}/`);
  await context.close();
});

test('TikTok-koden følger med til den funksjonelle språkversjonen', async ({ browser, baseURL }) => {
  const { context, page } = await nySide(browser, 'nb-NO');
  await page.goto('/tiktok-auth/?code=kort-kode');
  await page.locator('.language-switcher-top a[aria-label="Dansk"]').click();
  await expect(page).toHaveURL(`${baseURL}/da/tiktok-auth/?code=kort-kode&sprak=da`);
  await expect(page.locator('#kode')).toHaveText('kort-kode');
  await expect(page.locator('#boks')).toBeVisible();
  await context.close();
});

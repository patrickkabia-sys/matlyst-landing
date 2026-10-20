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
    await expect(page.locator('.language-switcher-top')).toBeVisible();
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
  await dansk.focus();
  await expect(dansk).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(`${baseURL}/da/?sprak=da`);

  const norsk = page.locator('.language-switcher-bottom a[aria-label="Norsk"]');
  await norsk.focus();
  await expect(norsk).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(`${baseURL}/?sprak=nb`);
  await context.close();
});

test('velgeren bruker riktig motstykke på personvernsiden', async ({ browser, baseURL }) => {
  const { context, page } = await nySide(browser, 'en-US');
  await page.goto('/personvern.html');
  await page.locator('.language-switcher-bottom a[aria-label="Svenska"]').click();
  await expect(page).toHaveURL(`${baseURL}/sv/integritet/?sprak=sv`);
  await context.close();
});

test('språkbytte på avmeldingssiden bevarer token og norsk valg', async ({ browser, baseURL }) => {
  const { context, page } = await nySide(browser, 'sv-SE');
  await page.goto('/avmeld/?u=bruker&s=signatur');
  await page.locator('.language-switcher-top a[aria-label="Svenska"]').click();
  await expect(page).toHaveURL(`${baseURL}/sv/avregistrera/?u=bruker&s=signatur&sprak=sv`);
  await page.locator('.language-switcher-top a[aria-label="Norsk"]').click();
  await expect(page).toHaveURL(`${baseURL}/avmeld/?u=bruker&s=signatur&sprak=nb`);
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

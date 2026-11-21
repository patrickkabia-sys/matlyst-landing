// Tabellen og kalkulatorkortet på samme omregnerside skal si det samme. Forventningen leses ut av siden selv:
// hver mengde i tabellens venstre kolonne tastes inn i kortet, og kortets svar skal være tallet i høyre kolonne.
// Uten JavaScript står svarsetningen ferdig utregnet og er lik den kortet viser med JavaScript.
// Sidene (ett par per enhetsgruppe og språk, 16 ekte sider) utledes av adressereglene i scripts/enheter.mjs.
import { test, expect } from '@playwright/test';
import { parSti } from '../../scripts/enheter.mjs';

const PREFIKS = { nb: '/', sv: '/sv/', da: '/da/', en: '/en/' };
const PAR = [['cups', 'dl'], ['oz-vekt', 'g'], ['inches', 'cm'], ['c', 'f']]; // volum, vekt, lengde, temperatur
const SIDER = Object.keys(PREFIKS).flatMap((lang) => PAR.map(([fra, til]) => ({ lang, sti: `${PREFIKS[lang]}${parSti(fra, til, lang)}` })));

test('16 sider: fire grupper på fire språk', () => {
  expect(SIDER).toHaveLength(16);
  expect(new Set(SIDER.map((s) => s.sti)).size).toBe(16);
});

/** Første ord i en tabellcelle: tallet foran enheten («0,5915 dl» gir «0,5915», «212 °F» gir «212»). */
const tallet = (celle) => celle.trim().split(/\s+/u)[0];

for (const { lang, sti } of SIDER) {
  test(`${sti}: kortets svar er likt høyre kolonne i tabellen for hver mengde i venstre`, async ({ page }) => {
    await page.goto(sti);
    const kort = 'form.kalk[data-kalk="enhet"]';
    await expect(page.locator(kort)).toHaveCount(1);
    const rader = await page.$$eval('.locale-prose table tbody tr', (trs) => trs.map((r) => [...r.cells].map((c) => c.textContent.trim())));
    expect(rader.length, 'tabellen har rader').toBeGreaterThanOrEqual(8);
    const mengde = page.locator(`${kort} [data-felt=mengde]`), svar = page.locator(`${kort} [data-felt=svar]`);
    for (const [venstre, hoyre] of rader) {
      await mengde.fill(tallet(venstre));
      await expect(svar, `${sti}: ${venstre} skal bli ${hoyre}`).toHaveText(tallet(hoyre));
      await expect(mengde).not.toHaveAttribute('aria-invalid', 'true');
    }
  });

  test(`${sti}: uten JavaScript står svarsetningen ferdig utregnet og er lik den med JavaScript`, async ({ browser, baseURL, page }) => {
    const uten = await browser.newContext({ baseURL, javaScriptEnabled: false });
    const sUten = await uten.newPage();
    await sUten.goto(sti);
    const statisk = (await sUten.locator('form.kalk [data-felt=setning]').textContent()).trim();
    const statiskSvar = (await sUten.locator('form.kalk [data-felt=svar]').textContent()).trim();
    const kortSvar = (await sUten.locator('p.kortsvar').textContent()).trim();
    await uten.close();
    expect(statisk, 'en ferdig setning «mengde enhet = svar enhet»').toMatch(/^\S+ \S.* = \S+ \S.*$/u);
    expect(statiskSvar).toMatch(/^-?[\d.,]+$/u);
    expect(statisk.includes(` = ${statiskSvar} `) || statisk.includes(` = ${statiskSvar}`), 'svartallet står i setningen').toBe(true);
    expect(kortSvar.includes(`${statisk}.`), 'kort svar åpner med kortets setning').toBe(true);
    // Med JavaScript: samme setning når kortet regner ut startmengden selv.
    await page.goto(sti);
    const startmengde = await page.locator('form.kalk [data-felt=mengde]').inputValue();
    await page.locator('form.kalk [data-felt=mengde]').fill('7');
    await page.locator('form.kalk [data-felt=mengde]').fill(startmengde);
    await expect(page.locator('form.kalk [data-felt=setning]'), `${lang}: samme setning med og uten JavaScript`).toHaveText(statisk);
    await expect(page.locator('form.kalk [data-felt=svar]')).toHaveText(statiskSvar);
  });
}

// Tabellene på varesidene og kalkulatoren på samme side skal si det samme. Forventningen leses ut av siden selv:
// hver rad i «fra dl til gram» og hvert eksempel i «Fra gram til dl» tastes inn i kalkulatoren, og svaret skal være teksten i tabellen.
import { test, expect } from '@playwright/test';

const ENHET = { ts: 'ts', ss: 'ss', dl: 'dl', liter: 'l', g: 'g', kg: 'kg' };
// «0,5 dl», «1 ts», «1 liter», «100 g»: mengde og enhet.
const les = (tekst) => {
  const [mengde, enhet] = tekst.trim().split(/\s+/u);
  return { mengde, enhet: ENHET[enhet] };
};

for (const side of ['hvetemel', 'salt', 'sirup']) {
  test(`kalkulatoren og tabellene på ${side}-siden gir samme svar`, async ({ page }) => {
    await page.goto(`/verktoy/dl-til-gram/${side}/`);
    const f = 'form.kalk';
    const svar = page.locator(`${f} [data-felt=svar]`);
    const tabell = await page.$$eval('table.otabell tbody tr', (rader) => rader.map((r) => [...r.cells].map((c) => c.textContent.trim())));
    const eksempler = await page.$$eval('ul.eksempler li', (li) => li.map((l) => [l.querySelector('b').textContent.trim(), l.querySelector('span').textContent.trim()]));
    expect(tabell.length, 'tabellen fra dl til gram').toBeGreaterThanOrEqual(9);
    expect(eksempler.length, 'eksemplene fra gram til dl').toBe(4);
    for (const [etikett, gram] of tabell) {
      const { mengde, enhet } = les(etikett);
      await page.selectOption(`${f} [data-felt=fra]`, enhet);
      await page.selectOption(`${f} [data-felt=til]`, 'g');
      await page.fill(`${f} [data-felt=mengde]`, mengde);
      await expect(svar, `${side}: ${etikett}`).toHaveText(gram.replace(/\s*g$/u, ''));
    }
    for (const [etikett, dl] of eksempler) {
      const { mengde, enhet } = les(etikett);
      await page.selectOption(`${f} [data-felt=fra]`, enhet);
      await page.selectOption(`${f} [data-felt=til]`, 'dl');
      await page.fill(`${f} [data-felt=mengde]`, mengde);
      await expect(svar, `${side}: ${etikett}`).toHaveText(dl.replace(/\s*dl$/u, ''));
    }
  });
}

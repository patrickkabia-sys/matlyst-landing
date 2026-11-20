// Tabellene på de engelske varesidene og kalkulatoren på samme side skal si det samme. Forventningen leses ut av siden selv:
// hver rad i «cups to grams» tastes inn i kalkulatoren (også brøkene), og svaret i gram og ounces skal være teksten i tabellen.
// Det samme gjelder hvert eksempel i «Convert grams back».
import { test, expect } from '@playwright/test';

const ENHET = { tsp: 'tsp', tbsp: 'tbsp', cup: 'cups', cups: 'cups', g: 'g' };
// «1/4 cup», «1 tsp», «50 g»: mengde og enhet.
const les = (tekst) => {
  const m = /^(\d+(?:\.\d+)?(?:\/\d+)?) (tsp|tbsp|cups?|g)$/u.exec(tekst.trim());
  return m ? { mengde: m[1], enhet: ENHET[m[2]] } : null;
};

for (const side of ['flour', 'butter', 'salt', 'baking-powder', 'rice']) {
  test(`kalkulatoren og tabellene på ${side}-siden gir samme svar`, async ({ page }) => {
    await page.goto(`/en/tools/cups-to-grams/${side === 'baking-powder' ? 'baking-powder-and-baking-soda' : side}/`);
    const f = 'form.kalk';
    const svar = page.locator(`${f} [data-felt=svar]`);
    const tabell = await page.$$eval('table.otabell tbody tr', (rader) => rader.map((r) => [...r.cells].map((c) => c.textContent.trim())));
    const eksempler = await page.$$eval('ul.eksempler li', (li) => li.map((l) => [l.querySelector('b').textContent.trim(), l.querySelector('span').textContent.trim()]));
    expect(tabell.length, 'tabellen cups to grams').toBeGreaterThanOrEqual(7);
    expect(eksempler.length, 'eksemplene fra gram').toBe(4);
    let prov = 0;
    for (const [etikett, gram, ounces] of tabell) {
      const rad = les(etikett);
      expect(rad, `tabellraden «${etikett}» har mengde og enhet`).not.toBeNull();
      prov += 1;
      await page.selectOption(`${f} [data-felt=fra]`, rad.enhet);
      await page.fill(`${f} [data-felt=mengde]`, rad.mengde);
      await page.selectOption(`${f} [data-felt=til]`, 'g');
      await expect(svar, `${side}: ${etikett} i gram`).toHaveText(gram.replace(/\s*g$/u, ''));
      // Ounces står bare fra 1 oz; en tom celle betyr at tabellen ikke sier noe (kalkulatoren viser da en verdi under 1).
      if (ounces === '') { await page.selectOption(`${f} [data-felt=til]`, 'oz'); expect(Number(await svar.textContent()), `${side}: ${etikett} er under 1 oz`).toBeLessThan(1); continue; }
      await page.selectOption(`${f} [data-felt=til]`, 'oz');
      await expect(svar, `${side}: ${etikett} i ounces`).toHaveText(ounces.replace(/\s*oz$/u, ''));
    }
    expect(prov, 'alle radene ble tastet inn').toBe(tabell.length);
    for (const [etikett, mengde] of eksempler) {
      const rad = les(etikett);
      await page.selectOption(`${f} [data-felt=fra]`, 'g');
      await page.fill(`${f} [data-felt=mengde]`, rad.mengde);
      await page.selectOption(`${f} [data-felt=til]`, side === 'baking-powder' ? 'tsp' : 'cups');
      await expect(svar, `${side}: ${etikett}`).toHaveText(mengde.replace(/\s*(?:cups?|tsp)$/u, ''));
    }
  });
}

test('brøkene gir samme svar som desimaltallet, og setningen gjengir brøken', async ({ page }) => {
  await page.goto('/en/tools/cups-to-grams/flour/');
  const f = 'form.kalk';
  await page.fill(`${f} [data-felt=mengde]`, '1/2');
  await expect(page.locator(`${f} [data-felt=setning]`)).toHaveText('1/2 cup flour = 63 g');
  await page.fill(`${f} [data-felt=mengde]`, '1 1/2');
  await expect(page.locator(`${f} [data-felt=setning]`)).toHaveText('1 1/2 cups flour = 188 g');
});

// Som kalk-tabell.spec.mjs, for «dl till gram» (sv) og «dl til gram» (da): tabellene på varesidene og kalkulatoren på samme side skal si det samme.
// Hver rad i tabellen (også kryddmått på svensk) og hvert eksempel fra gram tastes inn i kalkulatoren, og svaret skal være teksten på siden.
import { test, expect } from '@playwright/test';

const SPRAK = {
  sv: { rot: '/sv/verktyg/dl-till-gram/', sider: ['vetemjol', 'salt', 'sirap'], enhet: { krm: 'krm', tsk: 'tsk', msk: 'msk', dl: 'dl', liter: 'l', g: 'g', kg: 'kg' }, antall: 10 },
  da: { rot: '/da/vaerktoejer/dl-til-gram/', sider: ['hvedemel', 'salt', 'sirup'], enhet: { tsk: 'tsk', spsk: 'spsk', dl: 'dl', liter: 'l', g: 'g', kg: 'kg' }, antall: 9 },
};

for (const [sprak, { rot, sider, enhet, antall }] of Object.entries(SPRAK)) {
  // «0,5 dl», «1 tsk», «1 liter», «100 g»: mengde og enhet.
  const les = (tekst) => {
    const [mengde, e] = tekst.trim().split(/\s+/u);
    return { mengde, enhet: enhet[e] };
  };
  for (const side of sider) {
    test(`${sprak}: kalkulatoren og tabellene på ${side}-siden gir samme svar`, async ({ page }) => {
      await page.goto(`${rot}${side}/`);
      const f = 'form.kalk';
      const svar = page.locator(`${f} [data-felt=svar]`);
      const tabell = await page.$$eval('table.otabell tbody tr', (rader) => rader.map((r) => [...r.cells].map((c) => c.textContent.trim())));
      const eksempler = await page.$$eval('ul.eksempler li', (li) => li.map((l) => [l.querySelector('b').textContent.trim(), l.querySelector('span').textContent.trim()]));
      expect(tabell.length, 'tabellen fra dl til gram').toBe(antall);
      expect(eksempler.length, 'eksemplene fra gram til dl').toBe(4);
      for (const [etikett, gram] of tabell) {
        const { mengde, enhet: e } = les(etikett);
        expect(e, `enheten i «${etikett}» finnes i kalkulatoren`).toBeTruthy();
        await page.selectOption(`${f} [data-felt=fra]`, e);
        await page.selectOption(`${f} [data-felt=til]`, 'g');
        await page.fill(`${f} [data-felt=mengde]`, mengde);
        await expect(svar, `${side}: ${etikett}`).toHaveText(gram.replace(/\s*g$/u, ''));
      }
      for (const [etikett, dl] of eksempler) {
        const { mengde, enhet: e } = les(etikett);
        await page.selectOption(`${f} [data-felt=fra]`, e);
        await page.selectOption(`${f} [data-felt=til]`, 'dl');
        await page.fill(`${f} [data-felt=mengde]`, mengde);
        await expect(svar, `${side}: ${etikett}`).toHaveText(dl.replace(/\s*dl$/u, ''));
      }
    });
  }
}

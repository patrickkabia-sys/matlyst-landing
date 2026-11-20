// Kalkulatorkortet på ekte sider (vareside og samleside): hele kortet kan brukes med tastaturet alene, i fornuftig rekkefølge, og fokus er alltid synlig.
import { test, expect } from '@playwright/test';

const SIDER = [
  ['hvetemel', '/verktoy/dl-til-gram/hvetemel/', ['a', 'mengde', 'fra', 'bytt', 'til', 'hurtig', 'hurtig', 'hurtig', 'hurtig', 'hurtig', 'hurtig']],
  ['samleside', '/verktoy/dl-til-gram/', ['vare', 'mengde', 'fra', 'bytt', 'til', 'hurtig', 'hurtig', 'hurtig', 'hurtig', 'hurtig', 'hurtig']],
];

// Navnet på det fokuserte elementet i kortet: data-felt, «hurtig» for hurtigknappene, «a» for lenka.
const naa = (page) => page.evaluate(() => {
  const e = document.activeElement;
  if (!e || !e.closest('form.kalk')) return null;
  if (e.closest('.hurtig')) return 'hurtig';
  return e.getAttribute('data-felt') || e.tagName.toLowerCase();
});
// Fokusringen kan ligge på selve elementet eller på rammen rundt (label, kalkside, kalkvare).
const synligFokus = (page) => page.evaluate(() => {
  const e = document.activeElement;
  const kjede = [e, e.closest('label'), e.closest('.kalkside'), e.closest('.kalkvare')].filter(Boolean);
  return kjede.some((x) => { const s = getComputedStyle(x); return (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || s.boxShadow !== 'none'; });
});

for (const [navn, sti, rekkefolge] of SIDER) {
  test.describe(`tastatur på ${navn}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(sti);
      await page.locator('#ck-reject').click({ timeout: 2000 }).catch(() => {});
      // Start rett foran kortet: fokus på siste element før skjemaet, så Tab går inn i det.
      await page.evaluate(() => { const k = document.querySelector('form.kalk'); const t = document.createElement('span'); t.tabIndex = 0; t.id = 'for-kortet'; k.before(t); t.focus(); });
    });

    test('Tab går gjennom hele kortet i rekkefølge, og fokus er synlig på hvert stopp', async ({ page }) => {
      const sett = [];
      for (let i = 0; i < rekkefolge.length; i++) {
        await page.keyboard.press('Tab');
        sett.push(await naa(page));
        expect(await synligFokus(page), `fokus synlig på stopp ${i + 1} (${sett.at(-1)})`).toBe(true);
      }
      expect(sett).toEqual(rekkefolge);
      await page.keyboard.press('Tab');
      expect(await naa(page), 'etter siste hurtigknapp forlater fokus kortet').toBeNull();
      await page.keyboard.press('Shift+Tab');
      expect(await naa(page)).toBe('hurtig');
    });

    test('mengde, hurtigknapper, enheter og bytteknapp kan brukes uten mus', async ({ page }) => {
      const f = 'form.kalk';
      const svar = page.locator(`${f} [data-felt=svar]`);
      const setning = page.locator(`${f} [data-felt=setning]`);
      // Mengde: skriv.
      await page.locator(`${f} [data-felt=mengde]`).focus();
      await page.keyboard.press('ControlOrMeta+A');
      await page.keyboard.type('3');
      const [ord, dl] = await page.locator(f).evaluate((k) => { const v = k.querySelector('[data-felt=vare]'); return JSON.parse(k.querySelector('.kalk-data').textContent).varer[v ? Number(v.value) : 0]; });
      await expect(svar).toHaveText(String(3 * dl));
      // Til-enhet: bokstaven «k» velger Kilo (kg), «g» velger Gram (g) igjen.
      await page.locator(`${f} [data-felt=til]`).focus();
      await page.keyboard.press('k');
      await expect(page.locator(`${f} [data-felt=til]`)).toHaveValue('kg');
      await page.waitForTimeout(1100); // «k» og «g» rett etter hverandre ville blitt lest som søket «kg»
      await page.keyboard.press('g');
      await expect(page.locator(`${f} [data-felt=til]`)).toHaveValue('g');
      // Hurtigknapp: Tab til den fjerde og Enter. Mengden blir knappens verdi.
      await page.locator(`${f} [data-felt=til]`).focus();
      for (let i = 0; i < 4; i++) await page.keyboard.press('Tab');
      const verdi = await page.evaluate(() => document.activeElement.dataset.v);
      await page.keyboard.press('Enter');
      await expect(page.locator(`${f} [data-felt=mengde]`)).toHaveValue(verdi);
      await expect(page.locator(`${f} .hurtig button[aria-pressed=true]`)).toHaveCount(1);
      // Bytteknappen med mellomrom og Enter: retningen snus, og to ganger gir utgangspunktet.
      await page.locator(`${f} [data-felt=bytt]`).focus();
      await page.keyboard.press('Space');
      await expect(page.locator(`${f} [data-felt=fra]`)).toHaveValue('g');
      await page.keyboard.press('Enter');
      await expect(page.locator(`${f} [data-felt=fra]`)).toHaveValue('dl');
      await expect(page.locator(`${f} [data-felt=til]`)).toHaveValue('g');
      // Bytteknappen setter mengden til 2 når fra-enheten er dl, så svaret er utgangspunktet i kortet.
      await expect(setning).toHaveText(`2 dl ${ord} = ${2 * dl} g`);
    });

    test('ugyldig inntasting leses opp som veiledning, og setningen er et statusfelt', async ({ page }) => {
      const f = 'form.kalk';
      await page.locator(`${f} [data-felt=mengde]`).focus();
      await page.keyboard.press('ControlOrMeta+A');
      await page.keyboard.type('abc');
      await expect(page.locator(`${f} [data-felt=mengde]`)).toHaveAttribute('aria-invalid', 'true');
      await expect(page.locator(`${f} [data-felt=setning]`)).toHaveText('Skriv inn en mengde, for eksempel 2 eller 2,5.');
      await expect(page.locator(`${f} [data-felt=setning]`)).toHaveAttribute('role', 'status');
      await expect(page.locator(`${f} [data-felt=setning]`)).toHaveAttribute('aria-live', 'polite');
    });
  });
}

// Samlesidens varevalg: byttes med tastaturet, og svaret følger varen.
test('samlesiden: varevalget kan byttes med tastaturet', async ({ page }) => {
  await page.goto('/verktoy/dl-til-gram/');
  await page.locator('#ck-reject').click({ timeout: 2000 }).catch(() => {});
  const vare = page.locator('form.kalk [data-felt=vare]');
  await vare.focus();
  await page.keyboard.type('Sirup');
  await expect(page.locator('form.kalk [data-felt=setning]')).toHaveText('2 dl sirup = 280 g');
});

// Kalkulatorkortet uten varerad (data-kalk="enhet"): volum, vekt, lengde og temperatur, fire gjeldende sifre og bytte som beholder mengden.
// Fiksturen har fire skjemaer: #volum (cups til dl), #vekt (lb til g), #lengde (tomme til cm) og #temp (°C til °F, med affin og negativ).
import { test, expect } from '@playwright/test';
import { HURTIG_BROK, KORT_ETIKETTER } from '../../scripts/enheter.mjs';
import { presisTekst } from '../../scripts/kalk-kort.mjs';

const FIKSTUR = '/test/playwright/fiksturer/kalk-enhet.html';
const FEIL = 'Skriv inn en mengde, for eksempel 2 eller 2,5.';

test.beforeEach(async ({ page }) => { await page.goto(FIKSTUR); });

const setning = (page, id) => page.locator(`#${id} [data-felt=setning]`);
const svar = (page, id) => page.locator(`#${id} [data-felt=svar]`);
const skriv = (page, id, tekst) => page.fill(`#${id} [data-felt=mengde]`, tekst);

test('volum: fire gjeldende sifre og bøyd enhet', async ({ page }) => {
  await skriv(page, 'volum', '1');
  await expect(setning(page, 'volum')).toHaveText('1 cup = 2,366 dl');
  await skriv(page, 'volum', '2');
  await expect(setning(page, 'volum')).toHaveText('2 cups = 4,732 dl');
  await expect(svar(page, 'volum')).toHaveText('4,732');
});

test('vekt: gram følger sifre, ikke gramregelen', async ({ page }) => {
  await skriv(page, 'vekt', '1');
  await expect(setning(page, 'vekt')).toHaveText('1 lb = 453,6 g');
  await skriv(page, 'vekt', '3');
  await expect(setning(page, 'vekt')).toHaveText('3 lb = 1361 g');
});

test('lengde regnes i ml-feltet', async ({ page }) => {
  await skriv(page, 'lengde', '1');
  await expect(setning(page, 'lengde')).toHaveText('1 tomme = 2,54 cm');
  await skriv(page, 'lengde', '9');
  await expect(setning(page, 'lengde')).toHaveText('9 tommer = 22,86 cm');
});

test('temperatur er affin begge veier', async ({ page }) => {
  await expect(setning(page, 'temp')).toHaveText('180 °C = 356 °F');
  await page.click('#temp [data-felt=bytt]');
  await expect(setning(page, 'temp')).toHaveText('180 °F = 82,22 °C');
  await page.click('#temp [data-felt=bytt]');
  await skriv(page, 'temp', '0');
  await expect(setning(page, 'temp')).toHaveText('0 °C = 32 °F');
});

test('minusgrader er gyldige bare med negativ', async ({ page }) => {
  await skriv(page, 'temp', '-18');
  await expect(setning(page, 'temp')).toHaveText('-18 °C = -0,4 °F');
  await expect(page.locator('#temp [data-felt=mengde]')).not.toHaveAttribute('aria-invalid', 'true');
  await skriv(page, 'volum', '-1');
  await expect(setning(page, 'volum')).toHaveText(FEIL);
  await expect(page.locator('#volum [data-felt=mengde]')).toHaveAttribute('aria-invalid', 'true');
});

test('svært små svar blir aldri 0', async ({ page }) => {
  await page.selectOption('#volum [data-felt=fra]', 'ml');
  await page.selectOption('#volum [data-felt=til]', 'gallons');
  await skriv(page, 'volum', '0,01');
  await expect(setning(page, 'volum')).toHaveText('0,01 ml = 0,000002642 gallon');
});

test('1000 og over er heltall', async ({ page }) => {
  await page.selectOption('#volum [data-felt=fra]', 'gallons');
  await page.selectOption('#volum [data-felt=til]', 'ml');
  await skriv(page, 'volum', '16');
  await expect(svar(page, 'volum')).toHaveText('60567');
  await expect(setning(page, 'volum')).toHaveText('16 gallon = 60567 ml');
});

test('bytte beholder mengden og bytter hurtigmengdene', async ({ page }) => {
  await skriv(page, 'volum', '3');
  await page.click('#volum [data-felt=bytt]');
  await expect(page.locator('#volum [data-felt=mengde]')).toHaveValue('3');
  await expect(page.locator('#volum [data-felt=fra]')).toHaveValue('dl');
  const knapper = page.locator('#volum .hurtig button');
  await expect(knapper).toHaveText(['0,5 dl', '1 dl', '2 dl', '3 dl', '5 dl', '10 dl']);
  await expect(knapper.nth(3)).toHaveAttribute('aria-pressed', 'true');
  await expect(knapper.nth(2)).toHaveAttribute('aria-pressed', 'false');
});

test('skjema uten varer settes opp', async ({ page }) => {
  for (const id of ['volum', 'vekt', 'lengde', 'temp']) {
    await skriv(page, id, '5');
    await expect(setning(page, id), id).toContainText('5 ');
    await expect(svar(page, id), id).not.toHaveText('');
  }
});

// Kortet uten varerad: ingen vannrett rulling og ingen trykkflate under 44 px, også med det lengste enhetsnavnet (#lang).
for (const bredde of [360, 390, 1280]) {
  test(`trykkflater minst 44 px og ingen sidelengs rulling på ${bredde} px, også med lange enhetsnavn`, async ({ page }) => {
    await page.setViewportSize({ width: bredde, height: 800 });
    await page.goto(FIKSTUR);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), 'sidelengs rulling').toBe(true);
    const smaa = await page.evaluate(() => [...document.querySelectorAll('form.kalk input, form.kalk select, form.kalk button')]
      .map((e) => [e.closest('form').id, e.getAttribute('data-felt') || e.textContent.trim(), Math.round(e.getBoundingClientRect().height)])
      .filter(([, , h]) => h < 44));
    expect(smaa, 'trykkflater under 44 px').toEqual([]);
    // Det lange navnet avkortes med ellipse i stedet for å bryte raden eller kortet.
    const lang = await page.evaluate(() => {
      const kort = document.querySelector('#lang').getBoundingClientRect();
      return [...document.querySelectorAll('#lang .kalkenhet')].map((e) => {
        const r = e.getBoundingClientRect();
        return { inne: r.left >= kort.left - 1 && r.right <= kort.right + 1, ellipse: getComputedStyle(e.querySelector('select')).textOverflow };
      });
    });
    for (const l of lang) { expect(l.inne, 'enhetsvalget ligger innenfor kortet').toBe(true); expect(l.ellipse).toBe('ellipsis'); }
  });
}

// Lange svar (opptil 11 tegn, som «0,000002642») skal vises hele i svarsiden, uten ellipse og uten å stikke ut av boksen, på alle bredder.
// Skriften krymper med tegnantallet (--tegn satt fra site.js) i stedet for at tallet klippes.
for (const bredde of [320, 360, 768, 1000, 1280, 1600]) {
  test(`svaret på 11 tegn ligger innenfor boksen sin og er helt synlig på ${bredde} px`, async ({ page }) => {
    await page.setViewportSize({ width: bredde, height: 900 });
    await page.goto(FIKSTUR);
    await page.selectOption('#volum [data-felt=fra]', 'ml');
    await page.selectOption('#volum [data-felt=til]', 'gallons');
    for (const [mengde, tall] of [['0,01', '0,000002642'], ['1', '0,0002642'], ['16', '0,004227']]) {
      await skriv(page, 'volum', mengde);
      await expect(svar(page, 'volum')).toHaveText(tall);
      const m = await page.evaluate(() => {
        const o = document.querySelector('#volum output[data-felt=svar]');
        const boks = o.closest('.kalkside').getBoundingClientRect();
        const r = document.createRange(); r.selectNodeContents(o);
        const tekst = r.getBoundingClientRect();
        return { scroll: o.scrollWidth, klient: o.clientWidth, skrift: parseFloat(getComputedStyle(o).fontSize), tekstHoyre: tekst.right, boksHoyre: boks.right, sidelengs: document.documentElement.scrollWidth <= document.documentElement.clientWidth };
      });
      expect(m.scroll, `${mengde}: svaret er klippet`).toBeLessThanOrEqual(m.klient);
      expect(m.tekstHoyre, `${mengde}: svaret stikker ut av boksen`).toBeLessThanOrEqual(m.boksHoyre);
      expect(m.skrift, `${mengde}: skriften er lesbar`).toBeGreaterThanOrEqual(24);
      expect(m.sidelengs).toBe(true);
    }
  });
}

test('kortet uten varerad har ikke tom luft øverst', async ({ page }) => {
  // Første barn er selve raden: ingen skjult eller tom blokk over den, og polstringen er kortets egen.
  const topp = await page.evaluate(() => {
    const kort = document.querySelector('#volum');
    const rad = kort.querySelector('.kalkrad');
    return { forste: kort.firstElementChild === rad, avstand: Math.round(rad.getBoundingClientRect().top - kort.getBoundingClientRect().top), polstring: parseFloat(getComputedStyle(kort).paddingTop) };
  });
  expect(topp.forste).toBe(true);
  expect(topp.avstand).toBe(topp.polstring);
});

// Engelsk: kortet tar brøker (brok: true) og har brøker som hurtigmengder for cups. Egen fikstur fordi kortet leser document.documentElement.lang.
test.describe('engelsk kort med brøker', () => {
  const EN = '/test/playwright/fiksturer/kalk-enhet-en.html';
  const CUP = 236.5882365;
  test.beforeEach(async ({ page }) => { await page.goto(EN); });

  test('en brøk og et blandet tall regnes om, og enheten kan byttes uten at brøken forsvinner', async ({ page }) => {
    await skriv(page, 'cups', '1 1/2');
    await expect(setning(page, 'cups')).toHaveText(`1 1/2 cups = ${presisTekst(1.5 * CUP, 4)} ml`);
    await skriv(page, 'cups', '1/2');
    await expect(setning(page, 'cups')).toHaveText(`1/2 cup = ${presisTekst(0.5 * CUP, 4)} ml`);
    await page.click('#cups [data-felt=bytt]');
    await expect(page.locator('#cups [data-felt=mengde]')).toHaveValue('1/2');
    await expect(setning(page, 'cups')).toHaveText(`1/2 ml = ${presisTekst(0.5 / CUP, 4)} cups`);
    await expect(page.locator('#cups [data-felt=mengde]')).not.toHaveAttribute('aria-invalid', 'true');
  });

  test('hurtigknappene for cups er brøker og fyller feltet med brøken', async ({ page }) => {
    await expect(page.locator('#cups .hurtig button')).toHaveText(HURTIG_BROK.cups.map((v) => `${v} ${v === '1' ? 'cup' : v.includes('/') && Number(v.split('/')[0]) < Number(v.split('/')[1]) ? 'cup' : 'cups'}`));
    await page.click('#cups .hurtig button[data-v="1/3"]');
    await expect(page.locator('#cups [data-felt=mengde]')).toHaveValue('1/3');
    await expect(setning(page, 'cups')).toHaveText(`1/3 cup = ${presisTekst(CUP / 3, 4)} ml`);
    await expect(page.locator('#cups .hurtig button[data-v="1/3"]')).toHaveAttribute('aria-pressed', 'true');
  });

  test('en ugyldig brøk gir veiledningen på engelsk', async ({ page }) => {
    await skriv(page, 'cups', '1/0');
    await expect(page.locator('#cups [data-felt=mengde]')).toHaveAttribute('aria-invalid', 'true');
    await expect(setning(page, 'cups')).toHaveText(KORT_ETIKETTER.en.feil);
  });

  test('temperatur tar desimaler med punktum og er affin', async ({ page }) => {
    await expect(setning(page, 'temp')).toHaveText(`350 °F = ${presisTekst((350 - 32) * 5 / 9, 4)} °C`);
    await skriv(page, 'temp', '-40');
    await expect(setning(page, 'temp')).toHaveText('-40 °F = -40 °C');
  });
});

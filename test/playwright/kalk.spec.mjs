// Kalkulatorkortet (form.kalk): regner mens du skriver, bytter retning, har hurtigknapper og tåler ugyldig inntasting.
// Fiksturen har to skjemaer: #fast (fast vare, hvetemel 55 g per dl) og #valg (varevalg: hvetemel 55 og sukker 90).
import { test, expect } from '@playwright/test';

const FIKSTUR = '/test/playwright/fiksturer/kalk.html';
const FEIL = 'Skriv inn en mengde, for eksempel 2 eller 2,5.';

test.beforeEach(async ({ page }) => { await page.goto(FIKSTUR); });

test('regner mens du skriver', async ({ page }) => {
  await page.fill('#fast [data-felt=mengde]', '3');
  await expect(page.locator('#fast [data-felt=setning]')).toHaveText('3 dl hvetemel = 165 g');
});

test('varevalg bytter vekten', async ({ page }) => {
  await page.selectOption('#valg [data-felt=vare]', '1');
  await page.fill('#valg [data-felt=mengde]', '2,5');
  await expect(page.locator('#valg [data-felt=setning]')).toHaveText('2,5 dl sukker = 225 g');
});

test('bytt retning, og tilbake igjen', async ({ page }) => {
  await page.click('#fast [data-felt=bytt]');
  await expect(page.locator('#fast [data-felt=setning]')).toHaveText('100 g hvetemel = 1,8 dl');
  await page.click('#fast [data-felt=bytt]');
  await expect(page.locator('#fast [data-felt=setning]')).toHaveText('2 dl hvetemel = 110 g');
});

test('samme enhet og vekt til vekt trenger ikke varens vekt (varen «Uten vekt» har ingen gram per dl)', async ({ page }) => {
  const f = '#valg';
  await page.selectOption(`${f} [data-felt=vare]`, '2');
  await page.selectOption(`${f} [data-felt=til]`, 'dl');
  await expect(page.locator(`${f} [data-felt=svar]`)).toHaveText('2');
  await expect(page.locator(`${f} [data-felt=setning]`)).toHaveText('2 dl mystisk = 2 dl');
  await page.selectOption(`${f} [data-felt=til]`, 'ml');
  await expect(page.locator(`${f} [data-felt=svar]`)).toHaveText('200');
  await page.selectOption(`${f} [data-felt=fra]`, 'g');
  await page.selectOption(`${f} [data-felt=til]`, 'kg');
  await page.fill(`${f} [data-felt=mengde]`, '500');
  await expect(page.locator(`${f} [data-felt=svar]`)).toHaveText('0,5');
});

test('kryssing uten vekt gir veiledningen, og kryssing med vekt regner via gram per dl', async ({ page }) => {
  const f = '#valg';
  await page.selectOption(`${f} [data-felt=vare]`, '2');
  await page.selectOption(`${f} [data-felt=til]`, 'g');
  await expect(page.locator(`${f} [data-felt=setning]`)).toHaveText(FEIL);
  await expect(page.locator(`${f} [data-felt=svar]`)).toHaveText('');
  await page.selectOption(`${f} [data-felt=vare]`, '0');
  await expect(page.locator(`${f} [data-felt=setning]`)).toHaveText('2 dl hvetemel = 110 g');
});

test('små tall avrundes til to gjeldende sifre uten tak på desimaler, og blir aldri 0', async ({ page }) => {
  const f = '#fast';
  await page.selectOption(`${f} [data-felt=fra]`, 'g');
  await page.selectOption(`${f} [data-felt=til]`, 'kg');
  for (const [inn, ut] of [['0,005', '0,000005'], ['0,004', '0,000004'], ['1', '0,001'], ['1234', '1,2'], ['12345', '12,3'], ['150000', '150']]) {
    await page.fill(`${f} [data-felt=mengde]`, inn);
    await expect(page.locator(`${f} [data-felt=svar]`), `${inn} g til kg`).toHaveText(ut);
  }
  // 1 ts hvetemel til kg: 5 ml er 0,05 dl, og 55 g per dl gir 2,75 g, altså 0,00275 kg, som skrives med to gjeldende sifre (halve runder opp).
  await page.selectOption(`${f} [data-felt=fra]`, 'ts');
  await page.fill(`${f} [data-felt=mengde]`, '1');
  await expect(page.locator(`${f} [data-felt=svar]`)).toHaveText('0,0028');
});

test('svarsetningen gjengir mengden slik den ble tolket, bare svaret avrundes', async ({ page }) => {
  const f = '#fast';
  const setning = page.locator(`${f} [data-felt=setning]`);
  await page.fill(`${f} [data-felt=mengde]`, '1,25');
  await expect(setning).toHaveText('1,25 dl hvetemel = 69 g');
  await page.fill(`${f} [data-felt=mengde]`, '2,50');
  await expect(setning).toHaveText('2,5 dl hvetemel = 138 g');
  await page.fill(`${f} [data-felt=mengde]`, '0,5');
  await expect(setning).toHaveText('0,5 dl hvetemel = 28 g');
  await page.fill(`${f} [data-felt=mengde]`, '1.000');
  await expect(setning).toHaveText('1000 dl hvetemel = 55000 g');
});

test('svar i gram: hele gram fra 1 g, to gjeldende sifre under 1 g; andre enheter: 100 og over som heltall, ellers tre og to gjeldende sifre', async ({ page }) => {
  const f = '#fast';
  const svar = page.locator(`${f} [data-felt=svar]`);
  // 55 g per dl. Gram: 0,5 dl er 27,5 g (opp til 28), 1 ts er 2,75 g (3), 1 ss er 8,25 g (8).
  for (const [fra, mengde, ut] of [['dl', '0,5', '28'], ['ts', '1', '3'], ['ss', '1', '8'], ['dl', '0,01', '0,55'], ['dl', '0,015', '0,83'], ['dl', '0,02', '1']]) {
    await page.selectOption(`${f} [data-felt=fra]`, fra);
    await page.selectOption(`${f} [data-felt=til]`, 'g');
    await page.fill(`${f} [data-felt=mengde]`, mengde);
    await expect(svar, `${mengde} ${fra} til g`).toHaveText(ut);
  }
  // Andre enheter: gram til dl. 100 g er 1,818 dl (1,8), 500 g er 9,09 dl (9,1), 1000 g er 18,18 dl (18,2), 6000 g er 109 dl.
  await page.selectOption(`${f} [data-felt=fra]`, 'g');
  await page.selectOption(`${f} [data-felt=til]`, 'dl');
  for (const [mengde, ut] of [['100', '1,8'], ['500', '9,1'], ['1000', '18,2'], ['5500', '100'], ['6000', '109'], ['55', '1']]) {
    await page.fill(`${f} [data-felt=mengde]`, mengde);
    await expect(svar, `${mengde} g til dl`).toHaveText(ut);
  }
});

test('tusenskille leses likt som i omregneren: mellomrom, hardt mellomrom og punktum gir 1000', async ({ page }) => {
  const f = '#fast';
  for (const inn of ['1 000', '1\u00a0000', '1.000']) {
    await page.fill(`${f} [data-felt=mengde]`, inn);
    await expect(page.locator(`${f} [data-felt=setning]`), inn).toHaveText('1000 dl hvetemel = 55000 g');
    await expect(page.locator(`${f} [data-felt=mengde]`)).not.toHaveAttribute('aria-invalid', 'true');
  }
});

test('ødelagte skjemaer hoppes over uten feil, og det hele skjemaet virker', async ({ page }) => {
  const feil = [];
  page.on('console', (m) => { if (m.type() === 'error') feil.push(m.text()); });
  page.on('pageerror', (e) => feil.push(String(e)));
  await page.goto('/test/playwright/fiksturer/kalk-defekt.html');
  await page.fill('#hel [data-felt=mengde]', '3');
  await expect(page.locator('#hel [data-felt=setning]')).toHaveText('3 dl hvetemel = 165 g');
  await page.click('#hel [data-felt=bytt]');
  await expect(page.locator('#hel [data-felt=setning]')).toHaveText('100 g hvetemel = 1,8 dl');
  // De ødelagte beholder det statiske svaret, og trykk på dem gjør ingenting galt.
  for (const id of ['uten-svar', 'ugyldig-json', 'null-data', 'uten-data']) {
    await expect(page.locator(`#${id} [data-felt=setning]`)).toHaveText('2 dl hvetemel = 110 g');
    await page.fill(`#${id} [data-felt=mengde]`, '3');
    await expect(page.locator(`#${id} [data-felt=setning]`)).toHaveText('2 dl hvetemel = 110 g');
  }
  expect(feil).toEqual([]);
});

for (const tekst of ['', 'abc', '1,5,2', '-2']) {
  test(`ugyldig inntasting «${tekst}» gir veiledning, ikke et tall`, async ({ page }) => {
    await page.fill('#fast [data-felt=mengde]', tekst);
    await expect(page.locator('#fast [data-felt=setning]')).toHaveText(FEIL);
    await expect(page.locator('#fast [data-felt=mengde]')).toHaveAttribute('aria-invalid', 'true');
    const svar = await page.locator('#fast [data-felt=svar]').textContent();
    expect(svar).not.toMatch(/NaN|\bg\b/u);
    for (const k of await page.locator('#fast .hurtig button').all()) await expect(k).toHaveAttribute('aria-pressed', 'false');
  });
}

test('gyldig inntasting fjerner feilmerket igjen', async ({ page }) => {
  await page.fill('#fast [data-felt=mengde]', 'abc');
  await expect(page.locator('#fast [data-felt=mengde]')).toHaveAttribute('aria-invalid', 'true');
  await page.fill('#fast [data-felt=mengde]', '3');
  await expect(page.locator('#fast [data-felt=mengde]')).not.toHaveAttribute('aria-invalid', 'true');
});

test('hurtigknappene følger fra-enheten og viser valgt mengde', async ({ page }) => {
  await page.click('#fast .hurtig button:nth-child(4)');
  await expect(page.locator('#fast [data-felt=svar]')).toHaveText('165');
  await expect(page.locator('#fast .hurtig button:nth-child(4)')).toHaveAttribute('aria-pressed', 'true');
  await page.selectOption('#fast [data-felt=fra]', 'g');
  await expect(page.locator('#fast .hurtig button').first()).toHaveText('50 g');
  await page.selectOption('#fast [data-felt=fra]', 'kg');
  await expect(page.locator('#fast .hurtig button').first()).toHaveText('0,25 kg');
  await page.selectOption('#fast [data-felt=fra]', 'ml');
  await expect(page.locator('#fast .hurtig button').first()).toHaveText('25 ml');
});

test('svarsetningen er en høflig statusmelding, og svarfeltet leses ikke opp en gang til', async ({ page }) => {
  await expect(page.locator('#fast [data-felt=setning]')).toHaveAttribute('role', 'status');
  await expect(page.locator('#fast [data-felt=svar]')).toHaveAttribute('aria-live', 'off');
});

test('uten JavaScript står det ferdig utregnede eksempelet der', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const p = await ctx.newPage();
  await p.goto(FIKSTUR);
  await expect(p.locator('#fast [data-felt=svar]')).toHaveText('110');
  await expect(p.locator('#fast [data-felt=setning]')).toHaveText('2 dl hvetemel = 110 g');
  await ctx.close();
});

test('bytteknappen roterer ikke ved redusert bevegelse', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto(FIKSTUR);
  const varighet = await p.locator('#fast .bytt').evaluate((e) => getComputedStyle(e).transitionDuration);
  expect(varighet.split(',').every((v) => parseFloat(v) <= 0.01)).toBe(true);
  await ctx.close();
});

for (const bredde of [360, 390, 1280]) {
  test(`alt i kortet er minst 44 px å trykke på, og ingenting ruller sidelengs på ${bredde} px`, async ({ page }) => {
    await page.setViewportSize({ width: bredde, height: 800 });
    await page.goto(FIKSTUR);
    const mal = await page.evaluate(() => {
      const smaa = [];
      for (const e of document.querySelectorAll('.kalk button, .kalk select, .kalk input, .kalk a')) {
        const r = e.getBoundingClientRect();
        if (r.width < 44 || r.height < 44) smaa.push(`${e.tagName.toLowerCase()}.${e.className || e.getAttribute('data-felt')} ${Math.round(r.width)}x${Math.round(r.height)}`);
      }
      return { smaa, side: document.documentElement.scrollWidth, vindu: innerWidth };
    });
    expect(mal.smaa).toEqual([]);
    expect(mal.side).toBeLessThanOrEqual(mal.vindu);
  });
}

test('fokus er synlig på hvert element i kortet', async ({ page }) => {
  const mal = await page.evaluate(async () => {
    const ut = [];
    const skjema = document.querySelector('#fast');
    for (const e of skjema.querySelectorAll('input, select, button, a')) {
      e.focus({ focusVisible: true });
      // Fokusringen kan ligge på selve elementet eller på rammen rundt (label, kalkside).
      const kjede = [e, e.closest('label'), e.closest('.kalkside')].filter(Boolean);
      const synlig = kjede.some((x) => { const s = getComputedStyle(x); return (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || s.boxShadow !== 'none'; });
      if (!synlig) ut.push(`${e.tagName.toLowerCase()} ${e.getAttribute('data-felt') || e.textContent.trim()}`);
    }
    return ut;
  });
  expect(mal).toEqual([]);
});

test('hurtigradene ruller i sin egen rad på 360 px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto(FIKSTUR);
  const rad = await page.locator('#fast .hurtig').evaluate((e) => ({ overflow: getComputedStyle(e).overflowX, bredere: e.scrollWidth > e.clientWidth }));
  expect(rad.overflow).toBe('auto');
  expect(rad.bredere).toBe(true);
});

test('de to sidene stables på mobil og står side om side på PC', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto(FIKSTUR);
  const [a, b] = await page.locator('#fast .kalkside').evaluateAll((l) => l.map((e) => e.getBoundingClientRect().toJSON()));
  expect(b.top).toBeGreaterThan(a.bottom - 1);
  await page.setViewportSize({ width: 1280, height: 800 });
  const [c, d] = await page.locator('#fast .kalkside').evaluateAll((l) => l.map((e) => e.getBoundingClientRect().toJSON()));
  expect(d.left).toBeGreaterThan(c.right);
  const kort = await page.locator('#fast').boundingBox();
  expect(kort.width).toBeLessThanOrEqual(920);
});

// Engelsk skjema (kalk-en.html): brøker, entall og flertall, hurtigmengder per enhet og bytteverdi.
// Fiksturen har #fast (flour, 125 g per cup) og #utenvekt (en vare uten vekt). Skjemaer uten de nye feltene er som på norsk (siste test).
test.describe('engelsk skjema', () => {
  const EN = '/test/playwright/fiksturer/kalk-en.html';
  const FEIL_EN = 'Enter an amount, like 2 or 1/2.';
  test.beforeEach(async ({ page }) => { await page.goto(EN); });

  test('brøker regnes, og setningen gjengir brøken', async ({ page }) => {
    for (const [inn, setning] of [['1/2', '1/2 cup flour = 63 g'], ['1 1/2', '1 1/2 cups flour = 188 g'], ['3/4', '3/4 cup flour = 94 g'], ['2', '2 cups flour = 250 g'], ['1.5', '1.5 cups flour = 188 g'], ['1', '1 cup flour = 125 g'], ['0.8', '0.8 cups flour = 100 g'], ['0', '0 cups flour = 0 g'], ['1  1 / 2', '1 1/2 cups flour = 188 g'], [' 3 /4 ', '3/4 cup flour = 94 g'], ['2/2', '2/2 cup flour = 125 g'], ['3/2', '3/2 cups flour = 188 g']]) {
      await page.fill('#fast [data-felt=mengde]', inn);
      await expect(page.locator('#fast [data-felt=setning]'), inn).toHaveText(setning);
      await expect(page.locator('#fast [data-felt=mengde]')).not.toHaveAttribute('aria-invalid', 'true');
    }
  });

  for (const tekst of ['1/0', '1/', '/2', '1 2', '1/2/3', '-1/2', '1 1/', '1/2 3', 'a/b']) {
    test(`«${tekst}» gir veiledning`, async ({ page }) => {
      await page.fill('#fast [data-felt=mengde]', tekst);
      await expect(page.locator('#fast [data-felt=setning]')).toHaveText(FEIL_EN);
      await expect(page.locator('#fast [data-felt=svar]')).toHaveText('');
      await expect(page.locator('#fast [data-felt=mengde]')).toHaveAttribute('aria-invalid', 'true');
    });
  }

  // Brøkledd har høyst seks sifre; alt som gir et uendelig eller ikke-endelig tall er ugyldig.
  for (const tekst of ['9007199254740993/2', `1/1${'0'.repeat(309)}`, '1234567/2', '1/1234567', '1234567 1/2', '1 1234567/2']) {
    test(`brøkledd over seks sifre «${tekst.slice(0, 20)}» gir veiledning`, async ({ page }) => {
      await page.fill('#fast [data-felt=mengde]', tekst);
      await expect(page.locator('#fast [data-felt=setning]')).toHaveText(FEIL_EN);
      await expect(page.locator('#fast [data-felt=mengde]')).toHaveAttribute('aria-invalid', 'true');
    });
  }
  test('brøk med seks sifre i leddene er gyldig', async ({ page }) => {
    await page.fill('#fast [data-felt=mengde]', '999999/2');
    await expect(page.locator('#fast [data-felt=setning]')).toHaveText('999999/2 cups flour = 62499938 g');
    await expect(page.locator('#fast [data-felt=mengde]')).not.toHaveAttribute('aria-invalid', 'true');
  });

  test('entall og flertall gjelder også svaret', async ({ page }) => {
    await page.selectOption('#fast [data-felt=fra]', 'g');
    await page.selectOption('#fast [data-felt=til]', 'cups');
    await page.fill('#fast [data-felt=mengde]', '125');
    await expect(page.locator('#fast [data-felt=setning]')).toHaveText('125 g flour = 1 cup');
    await page.fill('#fast [data-felt=mengde]', '100');
    await expect(page.locator('#fast [data-felt=setning]')).toHaveText('100 g flour = 0.8 cups');
    await page.fill('#fast [data-felt=mengde]', '250');
    await expect(page.locator('#fast [data-felt=setning]')).toHaveText('250 g flour = 2 cups');
  });

  test('gram til ounces og pounds, og fluid ounces er volum', async ({ page }) => {
    await page.selectOption('#fast [data-felt=til]', 'oz');
    await expect(page.locator('#fast [data-felt=setning]')).toHaveText('2 cups flour = 8.8 oz');
    await page.selectOption('#fast [data-felt=til]', 'lb');
    await expect(page.locator('#fast [data-felt=setning]')).toHaveText('2 cups flour = 0.55 lb');
    await page.selectOption('#fast [data-felt=til]', 'oz');
    await page.selectOption('#fast [data-felt=fra]', 'floz'); await page.fill('#fast [data-felt=mengde]', '8');
    await expect(page.locator('#fast [data-felt=setning]')).toHaveText('8 fl oz flour = 4.4 oz');
    // Fluid ounces til ounces krysser fra volum til vekt og trenger vekten; uten den er det veiledningen.
    await page.selectOption('#utenvekt [data-felt=fra]', 'floz'); await page.selectOption('#utenvekt [data-felt=til]', 'oz');
    await expect(page.locator('#utenvekt [data-felt=setning]')).toHaveText(FEIL_EN);
    // Fluid ounces til fluid ounces og ounces til gram er samme slag og trenger ikke vekten.
    await page.selectOption('#utenvekt [data-felt=til]', 'floz');
    await expect(page.locator('#utenvekt [data-felt=setning]')).toHaveText('2 fl oz mystery = 2 fl oz');
    await page.selectOption('#utenvekt [data-felt=fra]', 'oz');
    await page.selectOption('#utenvekt [data-felt=til]', 'g');
    await expect(page.locator('#utenvekt [data-felt=setning]')).toHaveText('2 oz mystery = 57 g');
  });

  test('hurtigknappene følger enheten, med brøker for cups', async ({ page }) => {
    await expect(page.locator('#fast .hurtig button')).toHaveText(['1/4 cup', '1/3 cup', '1/2 cup', '3/4 cup', '1 cup', '2 cups']);
    await page.click('#fast .hurtig button:nth-child(3)');
    await expect(page.locator('#fast [data-felt=svar]')).toHaveText('63');
    await expect(page.locator('#fast .hurtig button:nth-child(3)')).toHaveAttribute('aria-pressed', 'true');
    // aria-pressed sammenligner tallverdier: «0.5» og «1/2» er samme mengde.
    await page.fill('#fast [data-felt=mengde]', '0.5');
    await expect(page.locator('#fast .hurtig button:nth-child(3)')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#fast .hurtig button:nth-child(4)')).toHaveAttribute('aria-pressed', 'false');
    await page.selectOption('#fast [data-felt=fra]', 'tbsp');
    await expect(page.locator('#fast .hurtig button')).toHaveText(['1 tbsp', '2 tbsp', '3 tbsp', '4 tbsp', '6 tbsp', '8 tbsp']);
    await page.selectOption('#fast [data-felt=fra]', 'oz');
    await expect(page.locator('#fast .hurtig button').first()).toHaveText('1 oz');
    await page.selectOption('#fast [data-felt=fra]', 'cups');
    await page.click('#fast .hurtig button:nth-child(5)');
    await expect(page.locator('#fast [data-felt=setning]')).toHaveText('1 cup flour = 125 g');
  });

  test('bytte setter mengden fra byttTil, og tilbake', async ({ page }) => {
    await page.click('#fast [data-felt=bytt]');
    await expect(page.locator('#fast [data-felt=setning]')).toHaveText('100 g flour = 0.8 cups');
    await page.click('#fast [data-felt=bytt]');
    await expect(page.locator('#fast [data-felt=setning]')).toHaveText('1 cup flour = 125 g');
    await page.selectOption('#fast [data-felt=fra]', 'oz'); await page.selectOption('#fast [data-felt=til]', 'floz');
    await page.click('#fast [data-felt=bytt]');
    await expect(page.locator('#fast [data-felt=setning]')).toHaveText('8 fl oz flour = 4.4 oz');
  });

  test('uten JavaScript står det ferdig utregnede eksempelet der', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const p = await ctx.newPage();
    await p.goto(EN);
    await expect(p.locator('#fast [data-felt=setning]')).toHaveText('2 cups flour = 250 g');
    await ctx.close();
  });

  for (const bredde of [360, 390, 1280]) {
    test(`trykkflater minst 44 px og ingen sidelengs rulling på ${bredde} px, også med brøkknappene`, async ({ page }) => {
      await page.setViewportSize({ width: bredde, height: 800 });
      await page.goto(EN);
      const mal = await page.evaluate(() => {
        const smaa = [];
        for (const e of document.querySelectorAll('.kalk button, .kalk select, .kalk input, .kalk a')) {
          const r = e.getBoundingClientRect();
          if (r.width < 44 || r.height < 44) smaa.push(`${e.tagName.toLowerCase()}.${e.className || e.getAttribute('data-felt')} ${Math.round(r.width)}x${Math.round(r.height)}`);
        }
        return { smaa, side: document.documentElement.scrollWidth, vindu: innerWidth };
      });
      expect(mal.smaa).toEqual([]);
      expect(mal.side).toBeLessThanOrEqual(mal.vindu);
    });
  }

  test('mellomrommet i et blandet tall har synlig bredde: «1 1/2» er minst 0,2 em bredere enn «11/2» i feltets egen skrift', async ({ page }) => {
    const em = await page.locator('#fast [data-felt=mengde]').evaluate((felt) => {
      const stil = getComputedStyle(felt);
      const maal = (tekst) => {
        const e = document.createElement('span');
        Object.assign(e.style, { position: 'absolute', visibility: 'hidden', whiteSpace: 'pre', font: stil.font, letterSpacing: stil.letterSpacing, wordSpacing: stil.wordSpacing });
        e.textContent = tekst;
        document.body.append(e);
        const b = e.getBoundingClientRect().width;
        e.remove();
        return b;
      };
      return (maal('1 1/2') - maal('11/2')) / parseFloat(stil.fontSize);
    });
    expect(em).toBeGreaterThanOrEqual(0.2);
  });

  test('norsk skjema uten de nye feltene er som før: brøk er ugyldig, og «1 000» er 1000', async ({ page }) => {
    await page.goto(FIKSTUR);
    await page.fill('#fast [data-felt=mengde]', '1/2');
    await expect(page.locator('#fast [data-felt=mengde]')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#fast [data-felt=setning]')).toHaveText(FEIL);
    await page.fill('#fast [data-felt=mengde]', '1 000');
    await expect(page.locator('#fast [data-felt=setning]')).toHaveText('1000 dl hvetemel = 55000 g');
  });
});

// Undersidene: omregneren og den faste knappen. Adressene leses fra forhåndsvisningens kart.json
// til typene er rullet ut; ellers brukes de ekte stiene.
import { existsSync, readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';

// qa/ er gitignorert: i CI og etter utrulling finnes ikke kartet, og da gjelder de ekte stiene.
const kartFil = new URL('../../qa/forhandsvisning/kart.json', import.meta.url);
const kart = existsSync(kartFil) ? JSON.parse(readFileSync(kartFil, 'utf8')) : [];
const adresse = (sti) => kart.find((s) => s.sti === sti)?.url ?? sti;

test('omregneren regner fortsatt, med samme tallformat som før', async ({ page }) => {
  await page.goto(adresse('/verktoy/kopp-til-dl/'));
  await page.locator('[data-felt=verdi]').fill('2');
  await expect(page.locator('[data-felt=svar]')).toContainText('4.732');
});

test('omregneren bytter enheter og regner det omvendte; svaret brytes i stedet for å kuttes', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto(adresse('/verktoy/kopp-til-dl/'));
  const fraFelt = page.locator('[data-felt=fra]');
  const tilFelt = page.locator('[data-felt=til]');
  const svar = page.locator('[data-felt=svar]');
  await page.locator('[data-felt=verdi]').fill('1500');
  const fra = await fraFelt.inputValue();
  const til = await tilFelt.inputValue();
  const f = JSON.parse(await page.locator('.omregner-data').textContent()).f;
  const tall = (n) => { const a = Math.abs(n); return String(Number(n.toFixed(a >= 1000 ? 0 : a >= 100 ? 1 : a >= 10 ? 2 : a >= 1 ? 3 : a >= 0.1 ? 4 : 5))); };
  const kort = async (felt) => felt.evaluate((e) => e.options[e.selectedIndex].text.replace(/^.*\(([^)]+)\)$/u, '$1'));
  await page.locator('[data-handling=bytt]').click();
  expect(await fraFelt.inputValue()).toBe(til);
  expect(await tilFelt.inputValue()).toBe(fra);
  const ut = 1500 * f[til] / f[fra];
  await expect(svar).toHaveText(`1500 ${await kort(fraFelt)} = ${tall(ut)} ${await kort(tilFelt)}`);
  const boks = await svar.evaluate((e) => ({ s: e.scrollWidth, b: e.clientWidth }));
  expect(boks.s).toBeLessThanOrEqual(boks.b);
  const knapp = await page.locator('[data-handling=bytt]').boundingBox();
  expect(knapp.width).toBeGreaterThanOrEqual(44);
  expect(knapp.height).toBeGreaterThanOrEqual(44);
});

test('omregneren: tab-rekkefølge, tilgjengelige navn og synlig fokus', async ({ page }) => {
  await page.goto(adresse('/verktoy/kopp-til-dl/'));
  await page.locator('[data-felt=verdi]').focus();
  for (const sel of ['[data-felt=verdi]', '[data-felt=fra]', '[data-handling=bytt]', '[data-felt=til]']) {
    const el = page.locator(sel);
    await expect(el).toBeFocused();
    const navn = await el.evaluate((e) => (e.getAttribute('aria-label') || e.labels?.[0]?.firstChild?.textContent || e.textContent || '').trim());
    expect(navn.length, `${sel} mangler navn`).toBeGreaterThan(0);
    const ring = await el.evaluate((e) => {
      const stil = getComputedStyle(e);
      const kort = e.closest('label') ? getComputedStyle(e.closest('label')) : null;
      return { outline: parseFloat(stil.outlineWidth) * (stil.outlineStyle === 'none' ? 0 : 1), skygge: kort ? kort.boxShadow : stil.boxShadow };
    });
    expect(ring.outline > 0 || (ring.skygge && ring.skygge !== 'none'), `${sel} mangler synlig fokus`).toBe(true);
    await page.keyboard.press('Tab');
  }
});

test('omregneren: skjemaet holder seg inne i skjermen med dobbel tekststørrelse på 1280 px', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Page.setFontSizes', { fontSizes: { standard: 32 } });
  await page.goto(adresse('/verktoy/kopp-til-dl/'));
  const boks = await page.locator('form.omregner').boundingBox();
  expect(boks.x).toBeGreaterThanOrEqual(0);
  expect(boks.x + boks.width).toBeLessThanOrEqual(1280);
  const hoyre = await page.evaluate(() => document.querySelector('form.omregner').scrollWidth - document.querySelector('form.omregner').clientWidth);
  expect(hoyre).toBeLessThanOrEqual(0);
});

test('omregneren: ingen innholdsfortegnelse, og feltene er minst 44 px', async ({ page }) => {
  await page.goto(adresse('/verktoy/kopp-til-dl/'));
  await expect(page.locator('.toc')).toBeHidden();
  for (const sel of ['[data-felt=verdi]', '[data-felt=fra]', '[data-felt=til]']) {
    expect((await page.locator(sel).boundingBox()).height).toBeGreaterThanOrEqual(44);
  }
});

async function fastKnappForlop(page, sti, start) {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto(adresse(sti));
  // Uten forhåndsvisning (CI) har en side som ikke er rullet ut ennå ingen fast knapp; testen gjelder fra utrullingen.
  test.skip(adresse(sti) === sti && (await page.locator('#fast').count()) === 0, `${sti} er ikke rullet ut og forhåndsvisningen mangler`);
  await expect(page.locator('#fast')).not.toHaveClass(/\bvis\b/);
  await page.locator(start).first().evaluate((e) => scrollTo(0, e.getBoundingClientRect().bottom + scrollY + 10));
  await expect(page.locator('#fast')).toHaveClass(/\bvis\b/);
  await page.locator('.bunn [data-hent]').scrollIntoViewIfNeeded();
  await expect(page.locator('#fast')).not.toHaveClass(/\bvis\b/);
}

test('fast knapp: skjult i toppen, synlig når helten er forbi, skjult før knappen i bunnen', async ({ page }) => {
  await fastKnappForlop(page, '/lagre-oppskrifter-fra-instagram/', 'header.locale-page-hero');
});

test('fast knapp virker på en eldre side der nedlastingsboksen står utenfor main', async ({ page }) => {
  await fastKnappForlop(page, '/finn-oppskrifter/', '.blad .hero');
});

test('fast knapp: en underside uten helt bruker header.topp som start, ikke 600 px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  // Fiktur: samme side uten helt og uten h1, så ingen av startkandidatene finnes.
  await page.route('**/verktoy/kopp-til-dl/**', async (rute) => {
    const svar = await rute.fetch();
    const html = (await svar.text())
      .replace(/<header class="locale-page-hero">[\s\S]*?<\/header>/u, '')
      .replace(/<h1\b[\s\S]*?<\/h1>/gu, '');
    await rute.fulfill({ response: svar, body: html });
  });
  await page.goto(adresse('/verktoy/kopp-til-dl/'));
  expect(await page.locator('.blad :is(header.locale-page-hero, header.hero, div.hero, main h1)').count()).toBe(0);
  await expect(page.locator('#fast')).not.toHaveClass(/\bvis\b/);
  const topp = await page.locator('header.topp').evaluate((e) => e.getBoundingClientRect().bottom + scrollY);
  expect(topp).toBeLessThan(300);
  await page.evaluate((y) => scrollTo(0, y), topp + 40);
  await expect(page.locator('#fast')).toHaveClass(/\bvis\b/);
});

// Måling på en utrullet verktøyside: samme beacon-kontrakt som forsiden. Analyse stubbes ved nettverksgrensen.
for (const [navn, valg, plass, visning] of [
  ['side-cta', { width: 390, height: 844 }, 'side-cta', 'lenke'],
  ['topp (QR-vindu)', { width: 1280, height: 800 }, 'topp', 'qr'],
]) test(`omregner: ${navn} gir download_click med cta_location bare etter Godta`, async ({ browser }) => {
  const sti = '/verktoy/kopp-til-dl/';
  const context = await browser.newContext({ viewport: valg, hasTouch: valg.width < 600 });
  const page = await context.newPage(), sendt = [], verter = [];
  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === '127.0.0.1') return route.continue();
    verter.push(url.hostname);
    if (url.pathname === '/static/array.js') return route.fulfill({ contentType: 'application/javascript', body: `window.posthog.capture = (navn, egenskaper, valg) => fetch('https://eu.i.posthog.com/t9-stubb', {method:'POST', body:JSON.stringify({navn,egenskaper,valg})});` });
    if (url.pathname === '/t9-stubb') sendt.push(route.request().postDataJSON());
    return route.fulfill({ contentType: 'application/javascript', body: '', headers: { 'access-control-allow-origin': '*' } });
  });
  await page.goto(sti);
  const hindreNavigering = () => page.evaluate(() => document.addEventListener('click', (e) => { if (e.target.closest('[data-hent]')) e.preventDefault(); }));
  await hindreNavigering();
  const klikk = async () => {
    await page.locator(`[data-hent="${plass}"]`).first().scrollIntoViewIfNeeded();
    await page.locator(`[data-hent="${plass}"]`).first().click();
    if (visning === 'qr') { await expect(page.locator('#hent')).toBeVisible(); await page.keyboard.press('Escape'); await expect(page.locator('#hent')).not.toBeVisible(); }
  };
  // Uten samtykke: ingen kall og ingen eksterne verter.
  await page.locator('#ck-reject').click();
  await klikk();
  expect(sendt).toEqual([]); expect(verter).toEqual([]);
  await page.evaluate(() => localStorage.removeItem('matlyst-consent'));
  await page.reload();
  await hindreNavigering();
  await page.locator('#ck-accept').click();
  await page.waitForFunction(() => window.posthog?.capture.toString().includes('t9-stubb'));
  await klikk();
  await expect.poll(() => sendt).toEqual([{ navn: 'download_click', egenskaper: { page_path: sti, cta_location: plass, visning }, valg: { transport: 'sendBeacon' } }]);
  await context.close();
});

// Lange guider (oppgave 11).
const GUIDE = '/lagre-oppskrifter-fra-instagram/';
test('innholdsfortegnelsen foldes på mobil og står åpen på PC', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(GUIDE);
  const knapp = page.locator('.toc-knapp');
  await expect(knapp).toHaveCount(1);
  await expect(knapp).toHaveAttribute('aria-expanded', 'false');
  const liste = page.locator('.toc ol');
  await expect(knapp).toHaveAttribute('aria-controls', (await liste.getAttribute('id')));
  await expect(liste).toBeHidden();
  await knapp.click();
  await expect(knapp).toHaveAttribute('aria-expanded', 'true');
  await expect(liste).toBeVisible();
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(page.locator('.toc-knapp')).toHaveCount(0);
  await expect(liste).toBeVisible();
});

test('innholdsfortegnelsen er åpen uten JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(GUIDE);
  await expect(page.locator('.toc ol')).toBeVisible();
  await context.close();
});

test('et trykk i innholdsfortegnelsen legger ikke overskriften under toppen', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(GUIDE);
  const lenke = page.locator('.toc a').nth(2), id = (await lenke.getAttribute('href')).slice(1);
  await lenke.click();
  await page.waitForTimeout(300);
  const topp = await page.locator('header.topp').boundingBox(), h2 = await page.locator(`[id="${id}"]`).boundingBox();
  expect(h2.y).toBeGreaterThanOrEqual(topp.y + topp.height);
  const visning = page.viewportSize().height;
  expect(h2.y, 'overskriften må ligge i visningsområdet etter klikket').toBeLessThan(visning);
  expect(h2.y + h2.height).toBeGreaterThan(0);
});

for (const bredde of [390, 1280]) test(`lange guider: figurer, filmer og bilder holder seg i lesekolonnen på ${bredde} px, og appkortene har innhold`, async ({ page }) => {
  await page.setViewportSize({ width: bredde, height: 900 });
  await page.goto(GUIDE);
  const r = await page.evaluate(() => {
    const k = document.querySelector('.locale-prose').getBoundingClientRect();
    const ut = [...document.querySelectorAll('.locale-prose :is(figure, video, img, aside.i-appen)')].filter((e) => { const b = e.getBoundingClientRect(); return b.left < k.left - 1 || b.right > k.right + 1; }).map((e) => e.tagName + '.' + e.className);
    const kort = [...document.querySelectorAll('aside.i-appen')].map((a) => { const m = a.querySelector('.i-appen-media :is(img, video)').getBoundingClientRect(); return { bredde: m.width, hoyde: m.height, kortHoyde: a.getBoundingClientRect().height }; });
    return { ut, kort };
  });
  // Beregnet stil beviser at guide-lang-reglene treffer en ekte guide (en feil sidetype i avgrensningen gir 540 px her).
  const filmer = await page.evaluate(() => [...document.querySelectorAll('.locale-prose video')].map((v) => ({ maks: getComputedStyle(v).maxWidth, radius: getComputedStyle(v).borderTopLeftRadius, bredde: v.getBoundingClientRect().width })));
  expect(filmer.length).toBeGreaterThan(0);
  for (const f of filmer) { expect(f.maks).toMatch(/^(300|200)px$/); expect(f.radius).toBe('24px'); expect(f.bredde).toBeLessThanOrEqual(300); }
  expect(r.ut).toEqual([]);
  expect(r.kort.length).toBeGreaterThan(0);
  for (const k of r.kort) { expect(k.bredde).toBeGreaterThan(100); expect(k.bredde).toBeLessThanOrEqual(200); expect(k.kortHoyde).toBeLessThan(k.hoyde + 200 + 400); }
});

// Hver film vises for seg: samme prosedyre uten og med reduce, så null avspillinger med reduce betyr noe.
async function spillAvFilmer(page) {
  const antall = await page.locator('video').count();
  const spilt = [];
  for (let i = 0; i < antall; i++) {
    const v = page.locator('video').nth(i);
    await v.scrollIntoViewIfNeeded();
    await v.evaluate((e) => { e.scrollIntoView({ block: 'center' }); });
    await page.waitForTimeout(700);
    spilt.push(await v.evaluate((e) => !e.paused));
    await v.evaluate((e) => e.pause());
  }
  return { antall, spilt };
}
test('filmer spiller når de vises uten redusert bevegelse (kontroll for testen under)', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(GUIDE);
  const r = await spillAvFilmer(page);
  expect(r.antall).toBeGreaterThan(0);
  expect(r.spilt.some(Boolean), 'minst én film skal starte uten reduce').toBe(true);
});

test('redusert bevegelse: ingen film spiller', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(GUIDE);
  const r = await spillAvFilmer(page);
  expect(r.antall).toBeGreaterThan(0);
  expect(r.spilt.filter(Boolean)).toEqual([]);
});

// Korte guider: beregnet stil på ekte sider beviser at velgerne treffer (regelteksten alene beviser ingenting).
const KORT = { steg: '/importer-fra-koket/', middag: '/middagsforslag/' };
for (const bredde of [390, 1280]) test(`korte guider: steg, ideliste og kildepille treffer ekte sider på ${bredde} px`, async ({ page }) => {
  await page.setViewportSize({ width: bredde, height: 900 });
  await page.goto(adresse(KORT.steg));
  const steg = await page.evaluate(() => [...document.querySelectorAll('.locale-prose > ol > li')].map((li) => {
    const b = getComputedStyle(li, '::before');
    return { liste: getComputedStyle(li.parentElement).listStyleType, innhold: b.content, bg: b.backgroundColor, radius: b.borderTopLeftRadius, w: b.width };
  }));
  expect(steg.length).toBeGreaterThan(0);
  steg.forEach((s, i) => { expect(s.liste).toBe('none'); expect(s.innhold).toBe("counter(steg)"); expect(s.bg).toBe('rgb(20, 18, 16)'); expect(s.radius).toBe('50%'); expect(s.w).toBe('32px'); });
  const pille = await page.evaluate(() => { const a = document.querySelector('.locale-prose > p > a[rel~="noopener"]:only-child'); if (!a) return null; const c = getComputedStyle(a); return { r: c.borderTopLeftRadius, d: c.display, h: a.getBoundingClientRect().height, u: c.textDecorationLine }; });
  expect(pille).not.toBeNull();
  expect(pille.r).toBe('999px'); expect(pille.d).toBe('inline-flex'); expect(pille.h).toBeGreaterThanOrEqual(48); expect(pille.u).toBe('none');
  await page.goto(adresse(KORT.middag));
  const ide = await page.evaluate(() => [...document.querySelectorAll('ul.ide-liste')].map((u) => ({ kol: getComputedStyle(u).gridTemplateColumns.split(' ').length, bg: getComputedStyle(u.firstElementChild).backgroundColor, radius: getComputedStyle(u.firstElementChild).borderTopLeftRadius, ut: u.scrollWidth - u.clientWidth })));
  expect(ide.length).toBeGreaterThan(0);
  for (const u of ide) { expect(u.kol).toBe(bredde >= 721 ? 2 : 1); expect(u.bg).toBe('rgb(245, 243, 239)'); expect(u.radius).toBe('24px'); expect(u.ut).toBeLessThanOrEqual(0); }
});

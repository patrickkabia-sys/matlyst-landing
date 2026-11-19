import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { visPrototype, lesTekst, harPrototypebilder } from '../hjelpere/forside-prototype.mjs';
const rot = join(fileURLToPath(new URL('..', import.meta.url)), '..');
const rullTil = (page, velger) => page.locator(velger).evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
test.use({ viewport: { width: 1280, height: 800 } });

for (const bredde of [320, 360, 390, 768, 1280]) {
  test(`hele siden på ${bredde} px har ingen konsollfeil, sidelengs rulling eller fremmede verter før samtykke`, async ({ page }) => {
    const feil = [], fremmede = [];
    page.on('pageerror', (e) => feil.push(e.message));
    page.on('console', (e) => { if (e.type() === 'error') feil.push(e.text()); });
    page.on('request', (r) => { if (new URL(r.url()).hostname !== '127.0.0.1') fremmede.push(r.url()); });
    await page.setViewportSize({ width: bredde, height: 800 });
    await page.goto('/');
    for (const velger of ['.hero', '.kokebok', '.spor', '#demoSkaler', '#demoLag', '#demoPlan', '#demoHandle', '#demoHus', '.pris', '.ofte', '.bunn', 'footer.under']) {
      await rullTil(page, velger);
      await page.waitForTimeout(100);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(bredde);
    }
    expect(feil).toEqual([]);
    expect(fremmede).toEqual([]);
  });
}

test('filmen går, og steg 4 hopper til rundt 9,7 sekunder', async ({ page }) => {
  await page.goto('/');
  const film = page.locator('.film video');
  await expect.poll(() => film.evaluate((v) => v.paused)).toBe(false);
  await page.locator('.st').nth(3).click();
  await expect.poll(() => film.evaluate((v) => v.currentTime)).toBeGreaterThanOrEqual(9.7);
  expect(await film.evaluate((v) => v.currentTime)).toBeLessThan(11.5);
});

test('PC: QR-vinduet åpnes, Escape lukker og gir fokus tilbake', async ({ page }) => {
  await page.goto('/');
  const knapp = page.locator('[data-hent="helt"]');
  await knapp.click();
  await expect(page.locator('#hent')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#hent')).not.toBeVisible();
  await expect(knapp).toBeFocused();
});

test('mobil: vanlig app-lenke og fast knapp som kommer og går', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const page = await context.newPage();
  await page.goto('/');
  await page.locator('#ck-reject').click();
  await expect(page.locator('#fast')).not.toHaveClass(/vis/);
  await rullTil(page, '.kokebok');
  await expect(page.locator('#fast')).toHaveClass(/vis/);
  await expect(page.locator('#fast')).not.toHaveAttribute('inert');
  await page.route('**/app', (r) => r.fulfill({ contentType: 'text/html', body: 'Appmålet' }));
  await page.locator('[data-hent="fast"]').click();
  await expect(page).toHaveURL(/\/app$/);
  await page.goto('/');
  await rullTil(page, '.bunnrad');
  await expect(page.locator('#fast')).not.toHaveClass(/vis/);
  await expect(page.locator('#fast')).toHaveAttribute('inert');
  await context.close();
});

test('trykk på film, kort og bånd lar løkkene fortsette', async ({ page }) => {
  await page.goto('/');
  const film = page.locator('.film video');
  await film.click();
  await expect.poll(() => film.evaluate((v) => v.paused)).toBe(false);
  const start = await film.evaluate((v) => v.currentTime);
  await expect.poll(() => film.evaluate((v) => v.currentTime)).toBeGreaterThan(start);
  await rullTil(page, '.band');
  await page.locator('.band').click();
  const posisjon = await page.locator('.bane').evaluate((el) => getComputedStyle(el).transform);
  await expect.poll(() => page.locator('.bane').evaluate((el) => getComputedStyle(el).transform)).not.toBe(posisjon);
  await page.locator('#ck-reject').click();
  await page.clock.install();
  await rullTil(page, '#demoSkaler');
  await expect(page.locator('#demoSkaler').locator('..')).toHaveClass(/i-bildet/);
  await page.locator('#demoSkaler').dispatchEvent('click');
  await page.clock.runFor(4600);
  await expect(page.locator('#demoSkaler .antall')).toHaveText('6');
  await page.clock.runFor(5000);
  await expect(page.locator('#demoSkaler .antall')).toHaveText('4');
});

test('redusert bevegelse holder film og bånd stille og overskriften ferdig', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.hero h1')).toBeVisible();
  await expect(page.locator('.hero h1')).toHaveText('Oppskrifter du faktisk lager.');
  await expect(page.locator('.film video')).not.toHaveAttribute('src');
  expect(await page.locator('.film video').evaluate((v) => v.paused)).toBe(true);
  await rullTil(page, '.band');
  await expect(page.locator('.bane')).toHaveCSS('animation-name', 'none');
});

test('uten JavaScript virker bunnvelger, åpne hyller og alle nedlastingslenker', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.route('**/app', (r) => r.fulfill({ contentType: 'text/html', body: 'Appmålet' }));
  await page.goto('/');
  await expect(page.locator('.hero h1')).toBeVisible();
  await expect(page.locator('#panel')).not.toBeVisible();
  for (const lenke of await page.locator('#bunnreol a').all()) await expect(lenke).toBeVisible();
  for (const plass of ['topp', 'helt', 'bunn', 'fast']) {
    await page.goto('/');
    const lenke = page.locator(`[data-hent="${plass}"]`);
    await expect(lenke).toHaveAttribute('href', '/app');
    // Den faste kopien vises bare med JavaScript; også dens opprinnelige href testes som navigasjon.
    if (plass === 'fast') await page.goto(await lenke.getAttribute('href'));
    else await lenke.click();
    await expect(page).toHaveURL(/\/app$/);
  }
  for (const [sprak, sti] of [['Svenska', '/sv/'], ['Dansk', '/da/'], ['English', '/en/'], ['Norsk', '/']]) {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await page.locator(`.language-switcher-bottom a[aria-label="${sprak}"]`).click();
    expect(new URL(page.url()).pathname).toBe(sti);
  }
  await context.close();
});

test('200 prosent tekst på 390 px holder kortenes tekst innenfor boksene', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  // Siden bruker px. Dobling av rotstørrelsen alene forstørrer derfor ikke teksten.
  await page.evaluate(() => {
    const alle = [...document.querySelectorAll('body *')];
    const storrelser = alle.map((el) => parseFloat(getComputedStyle(el).fontSize));
    alle.forEach((el, i) => { el.style.fontSize = `${storrelser[i] * 2}px`; });
  });
  const utenfor = await page.locator('.rett, .rute, .plan, .svarliste, .sporflate').evaluateAll((kort) => kort.flatMap((el) => {
    const b = el.getBoundingClientRect(), feil = [];
    const vandrer = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (vandrer.nextNode()) {
      const node = vandrer.currentNode;
      if (!node.textContent.trim() || node.parentElement.closest('template, [aria-hidden="true"], .kun-skjermleser')) continue;
      let skjult = false;
      for (let forelder = node.parentElement; forelder && forelder !== el; forelder = forelder.parentElement) {
        const stil = getComputedStyle(forelder);
        if (stil.opacity === '0' || stil.visibility === 'hidden') skjult = true;
      }
      if (skjult) continue;
      const range = document.createRange(); range.selectNodeContents(node);
      for (const r of range.getClientRects()) if (r.width && (r.left < b.left - 1 || r.right > b.right + 1)) feil.push(node.textContent.trim());
    }
    return feil;
  }));
  expect(utenfor).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('mobilmenyen åpnes og lukkes, og bunnhyllene foldes ut', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const meny = page.locator('#menyknapp');
  await meny.click(); await expect(meny).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape'); await expect(meny).toHaveAttribute('aria-expanded', 'false');
  const hylle = page.locator('#bunnreol .fag').first();
  await expect(hylle.locator('ul')).not.toBeVisible();
  await hylle.locator('button').click();
  await expect(hylle.locator('ul')).toBeVisible();
  await expect(hylle.locator('button')).toHaveAttribute('aria-expanded', 'true');
});

test('1280 × 800 viser hele telefonen uten rulling', async ({ page }) => {
  await page.goto('/');
  const b = await page.locator('.film').boundingBox();
  expect(b.y).toBeGreaterThanOrEqual(0); expect(b.y + b.height).toBeLessThanOrEqual(800);
});

test('390 px har overskrift, knapp, stjerner, telefon og ingress i riktig rekkefølge', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto('/');
  const bokser = [];
  for (const velger of ['.hero h1', '.hero .valg', '.hero .bevis', '.film', '.hero > p']) bokser.push(await page.locator(velger).boundingBox());
  for (let i = 1; i < bokser.length; i++) expect(bokser[i].y).toBeGreaterThanOrEqual(bokser[i - 1].y + bokser[i - 1].height - 1);
});

test('punktumet kommer minst 400 ms etter siste bokstav', async ({ page }) => {
  await page.addInitScript(() => {
    window.tegntider = [];
    new MutationObserver((rader) => rader.forEach((rad) => {
      if (rad.target.matches?.('.hero h1 .tegn.inne')) window.tegntider.push({ tegn: rad.target.textContent, tid: performance.now() });
    })).observe(document, { subtree: true, attributes: true, attributeFilter: ['class'] });
  });
  await page.goto('/');
  await expect.poll(() => page.evaluate(() => window.tegntider.at(-1)?.tegn)).toBe('.');
  const tider = await page.evaluate(() => window.tegntider.slice(-2));
  expect(tider[1].tid - tider[0].tid).toBeGreaterThanOrEqual(400);
});

for (const [bredde, luft] of [[1280, 72], [390, 52]]) test(`bånd og kokebok har ${luft} px luft på ${bredde} px`, async ({ page }) => {
  await page.setViewportSize({ width: bredde, height: 800 }); await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const avstander = await page.evaluate(() => {
    const kilde = document.querySelector('.kilder').getBoundingClientRect();
    const siste = document.querySelector(innerWidth > 1000 ? '.film' : '.hero > p').getBoundingClientRect();
    const kokebok = document.querySelector('.kokebok h2').getBoundingClientRect();
    return [kilde.top - siste.bottom, kokebok.top - kilde.bottom];
  });
  for (const avstand of avstander) expect(Math.abs(avstand - luft)).toBeLessThanOrEqual(2);
});

test('filmen holder plassen når videofilen ikke kan lastes', async ({ page }) => {
  await page.goto('/'); const foer = await page.locator('.film').boundingBox();
  await page.route('**/*.mp4', (r) => r.abort()); await page.reload();
  const etter = await page.locator('.film').boundingBox();
  expect(etter.height).toBeCloseTo(foer.height, 1); expect(etter.height).toBeGreaterThan(500);
});

for (const [navn, valg, plasser, visning] of [
  ['PC', { width: 1280, height: 800 }, ['topp', 'helt', 'bunn'], 'qr'],
  ['mobil', { width: 390, height: 844 }, ['topp', 'helt', 'bunn', 'fast'], 'lenke'],
]) test(`${navn}: download_click sendes med beacon og plassering bare etter Godta`, async ({ browser }) => {
  const context = await browser.newContext({ viewport: valg, hasTouch: navn === 'mobil' });
  const page = await context.newPage(), sendt = [], verter = [];
  // All ekstern trafikk stoppes ved nettverksgrensen. Ingen analyse går til ekte verter.
  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === '127.0.0.1') return route.continue();
    verter.push(url.hostname);
    if (url.pathname === '/static/array.js') return route.fulfill({ contentType: 'application/javascript', body: `window.posthog.capture = (navn, egenskaper, valg) => fetch('https://eu.i.posthog.com/t9-stubb', {method:'POST', body:JSON.stringify({navn,egenskaper,valg})});` });
    if (url.pathname === '/t9-stubb') sendt.push(route.request().postDataJSON());
    return route.fulfill({ contentType: 'application/javascript', body: '', headers: { 'access-control-allow-origin': '*' } });
  });
  await page.goto('/');
  // Behold dokumentet ved mobilklikk slik at samtykket kan gis i samme økt.
  await page.evaluate(() => document.addEventListener('click', (e) => { if (e.target.closest('[data-hent]')) e.preventDefault(); }));
  const klikk = async (plass) => {
    if (plass === 'fast') await rullTil(page, '.kokebok');
    await page.locator(`[data-hent="${plass}"]`).click();
    if (visning === 'qr') { await expect(page.locator('#hent')).toBeVisible(); await page.keyboard.press('Escape'); await expect(page.locator('#hent')).not.toBeVisible(); }
  };
  await klikk('topp');
  expect(sendt).toEqual([]); expect(verter).toEqual([]);
  // Avvis deretter slik at banneret ikke dekker fastknappen. Dette gir ikke samtykke.
  await page.locator('#ck-reject').click();
  for (const plass of plasser) await klikk(plass);
  expect(sendt).toEqual([]); expect(verter).toEqual([]);
  await page.evaluate(() => localStorage.removeItem('matlyst-consent'));
  await page.reload();
  await page.evaluate(() => document.addEventListener('click', (e) => { if (e.target.closest('[data-hent]')) e.preventDefault(); }));
  await page.locator('#ck-accept').click();
  await page.waitForFunction(() => window.posthog?.capture.toString().includes('t9-stubb'));
  for (const plass of plasser) await klikk(plass);
  await expect.poll(() => sendt).toEqual(plasser.map((plass) => ({ navn: 'download_click', egenskaper: { page_path: '/', cta_location: plass, visning }, valg: { transport: 'sendBeacon' } })));
  expect(await page.evaluate(() => window.dataLayer.filter((rad) => rad[0] === 'event').map((rad) => [rad[1], rad[2]]))).toEqual(plasser.map((plass) => ['download_click', { page_path: '/', cta_location: plass, visning, transport_type: 'beacon' }]));
  await context.close();
});

test('prisplaner, personvern og svar glir inn én gang og står stille ved redusert bevegelse', async ({ page }) => {
  await page.goto('/');
  for (const [velger, fra] of [['.plan:not(.pro)', 'translateX(-96px)'], ['.plan.pro', 'translateX(96px)'], ['.vernblokk', 'translateY(28px)'], ['.svarliste', 'translateY(28px)']]) {
    await page.reload(); await rullTil(page, velger);
    await expect.poll(() => page.locator(velger).evaluate((el) => el.getAnimations().map((a) => a.effect.getKeyframes()[0].transform))).toEqual([fra]);
    await page.waitForTimeout(1200); await rullTil(page, '.hero'); await rullTil(page, velger);
    expect(await page.locator(velger).evaluate((el) => el.getAnimations().length)).toBe(0);
  }
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.reload(); await rullTil(page, '.pris');
  expect(await page.locator('.plan,.vernblokk,.svarliste').evaluateAll((els) => els.flatMap((el) => el.getAnimations()))).toEqual([]);
});

// Hvert unntak erstatter en nøyaktig sekvens og må fortsatt være nødvendig.
const unntak = [
  // Skjermleserledeteksten er lagt til i oppgave 7; innerText tar med visuelt skjult tekst.
  { seksjon: '.spor', fra: ['Gjør denne vegansk', 'Gjør denne vegansk'], til: ['Eksempel på hva du kan be om:', 'Gjør denne vegansk', 'Gjør denne vegansk'] },
  // Sluttilstanden viser seks porsjoner, som pålagt i oppgave 8; prototypens ark blir stående på fire.
  { seksjon: '.del', fra: ['Antall porsjoner', '−', '4', '+'], til: ['Antall porsjoner', '−', '6', '+'] },
  // Spec 10: kalkulatorer som ennå ikke finnes, får ingen lenke. Heller ikke oversikten finnes.
  { seksjon: '.bunn', fra: ['Dl til gram', 'Porsjoner', 'Kakeform', 'Steketid', 'Pizzadeig', 'Gjær', 'Alle kalkulatorer'], til: [] },
  // Det vedtatte sideskallet bruker korte språkkoder i begge velgerne.
  { seksjon: 'footer.under', fra: ['Norsk', 'Svenska', 'Dansk', 'English'], til: ['NO', 'SV', 'DA', 'EN'] },
];
// Prototypens prøvestripe ligger utenfor de åtte seksjonene. «Juridisk» er en aria-label,
// ikke innerText; den kontrolleres allerede eksplisitt i test/forside-tekst.test.mjs.
function medUnntak(prototype, bygd) {
  const fasit = structuredClone(prototype);
  for (const u of unntak) {
    const indeks = fasit[u.seksjon].flatMap((_, i, linjer) => JSON.stringify(linjer.slice(i, i + u.fra.length)) === JSON.stringify(u.fra) ? [i] : []);
    expect(indeks, `unntaket skal treffe nøyaktig én gang: ${u.seksjon} ${u.fra}`).toHaveLength(1);
    expect(bygd[u.seksjon], `fjern overflødig unntak i ${u.seksjon}`).not.toEqual(prototype[u.seksjon]);
    fasit[u.seksjon].splice(indeks[0], u.fra.length, ...u.til);
  }
  return fasit;
}
test('hele sidens synlige tekst følger prototypen og lagret fasit etter skriptkjøring', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/'); const bygd = await lesTekst(page);
  const lagret = JSON.parse(readFileSync(join(rot, 'test/fasit/forside-nb-tekst.json'), 'utf8'));
  expect(bygd).toEqual(medUnntak(lagret, bygd));
  if (!harPrototypebilder()) {
    const melding = 'Prototypesammenligning hoppet over: private bilder mangler. Hele siden er kontrollert mot lagret prototypefasit.';
    testInfo.annotations.push({ type: 'prototype', description: melding }); console.log(melding); return;
  }
  await visPrototype(page); const prototype = await lesTekst(page);
  expect(prototype).toEqual(lagret);
  expect(bygd).toEqual(medUnntak(prototype, bygd));
});

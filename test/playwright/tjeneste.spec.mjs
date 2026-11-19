// Tjenestesidene: beregnet stil på ekte sider, så en velger som ikke treffer, blir rød.
// Sidene lastes uten skall, site.js og banner; her ser vi at stilen likevel er nettstedets.
import { test, expect } from '@playwright/test';

const BLEKK = 'rgb(20, 18, 16)';
const BLEKK_LYS = 'rgb(43, 39, 35)';
const FLATE = 'rgb(255, 255, 255)';
const HYLLE = 'rgb(245, 243, 239)';
const BREDDER = [390, 1280];

const AVMELD = [['nb', '/avmeld/?u=x&s=y'], ['sv', '/sv/avregistrera/?u=x&s=y'], ['da', '/da/afmeld/?u=x&s=y'], ['en', '/en/unsubscribe/?u=x&s=y']];
const KODE = '?k=A1B2C3';
const VERVEKORT = [['nb', `/v/${KODE}`], ['sv', `/sv/v/${KODE}`], ['da', `/da/v/${KODE}`], ['en', `/en/v/${KODE}`]];
const BEKREFT = `/bekreft/?u=${encodeURIComponent('https://uaryzmqvoqljjwqvgzoi.supabase.co/auth/v1/verify?token=abc&type=signup')}`;

async function grunnstil(page) {
  return page.evaluate(() => {
    const s = getComputedStyle(document.body);
    const merke = document.querySelector('.nav-brand, .brand');
    const m = merke ? getComputedStyle(merke) : null;
    return { skrift: s.fontFamily, bakgrunn: s.backgroundColor, farge: s.color, merke: m ? { skrift: m.fontFamily, hoyde: merke.getBoundingClientRect().height } : null, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
  });
}

for (const bredde of BREDDER) {
  for (const [sprak, sti] of [...AVMELD, ['bekreft', BEKREFT], ...VERVEKORT.map(([s, u]) => [`vervekort-${s}`, u])]) {
    test(`tjeneste ${sprak} ${bredde}: Schibsted på hvitt, ordmerket, ingen sidelengs rulling`, async ({ page }) => {
      await page.setViewportSize({ width: bredde, height: 900 });
      await page.goto(sti);
      await expect(page.locator('.nav-brand, .brand')).toHaveCount(1);
      const g = await grunnstil(page);
      expect(g.skrift).toContain('Schibsted Grotesk');
      expect(g.bakgrunn).toBe(FLATE);
      expect(g.farge).toBe(BLEKK);
      expect(g.merke.skrift).toContain('Fraunces Ordmerke');
      expect(g.merke.hoyde).toBeGreaterThanOrEqual(44);
      expect(g.overflow).toBeLessThanOrEqual(0);
    });
  }
}

for (const [sprak, sti] of AVMELD) {
  test(`avmelding ${sprak}: knappene er svarte piller på minst 44 px, og kortet er hylla`, async ({ page }) => {
    await page.goto(sti);
    const knapper = page.locator('.avmeld-knapp');
    expect(await knapper.count()).toBeGreaterThanOrEqual(2);
    for (const stil of await knapper.evaluateAll((es) => es.map((e) => { const s = getComputedStyle(e); return { bg: s.backgroundColor, farge: s.color, radius: s.borderTopLeftRadius, hoyde: s.minHeight, skrift: s.fontFamily }; }))) {
      expect(stil).toMatchObject({ bg: BLEKK, farge: FLATE, hoyde: '44px' });
      expect(parseFloat(stil.radius)).toBeGreaterThan(40);
      expect(stil.skrift).toContain('Schibsted Grotesk');
    }
    const kort = await page.locator('.avmeld-kort').first().evaluate((e) => ({ bg: getComputedStyle(e).backgroundColor, r: getComputedStyle(e).borderTopLeftRadius }));
    expect(kort).toEqual({ bg: HYLLE, r: '28px' });
    const tittel = await page.locator('.avmeld-title').first().evaluate((e) => ({ vekt: getComputedStyle(e).fontWeight, storrelse: getComputedStyle(e).fontSize }));
    expect(tittel.vekt).toBe('700');
    expect(parseFloat(tittel.storrelse)).toBeGreaterThanOrEqual(32);
    const gjeldende = await page.locator('.language-switcher-top a[aria-current="page"]').evaluate((e) => ({ bg: getComputedStyle(e).backgroundColor, farge: getComputedStyle(e).color, h: e.getBoundingClientRect().height }));
    expect(gjeldende).toMatchObject({ bg: BLEKK, farge: FLATE });
    expect(gjeldende.h).toBeGreaterThanOrEqual(44);
  });
}

test('bekreftelsen: knappen er svart pille, lysere ved peker over, og bunnen er dempet', async ({ page }) => {
  await page.goto(BEKREFT);
  const knapp = page.locator('#knapp');
  await expect(knapp).toBeVisible();
  const eske = await knapp.boundingBox();
  expect(eske.height).toBeGreaterThanOrEqual(44);
  expect(await knapp.evaluate((e) => getComputedStyle(e).backgroundColor)).toBe(BLEKK);
  expect(await knapp.evaluate((e) => getComputedStyle(e).textDecorationLine)).toBe('none');
  await knapp.hover();
  await expect.poll(() => knapp.evaluate((e) => getComputedStyle(e).backgroundColor)).toBe(BLEKK_LYS);
  const fot = await page.locator('.bekreft-fot a').evaluate((e) => ({ h: e.getBoundingClientRect().height, farge: getComputedStyle(e).color }));
  expect(fot.h).toBeGreaterThanOrEqual(44);
  expect(fot.farge).toBe(BLEKK);
});

test('vervekortet: kopier-knappen er svart pille, koden står i mono, og butikkmerkene har 44 px flate', async ({ page }) => {
  await page.goto(`/v/${KODE}`);
  await page.setViewportSize({ width: 1280, height: 900 });
  const kopier = page.locator('#kopier');
  await expect(kopier).toBeVisible();
  expect(await kopier.evaluate((e) => getComputedStyle(e).backgroundColor)).toBe(BLEKK);
  await kopier.hover();
  await expect.poll(() => kopier.evaluate((e) => getComputedStyle(e).backgroundColor)).toBe(BLEKK_LYS);
  expect((await kopier.boundingBox()).height).toBeGreaterThanOrEqual(44);
  expect(await page.locator('#kode').evaluate((e) => getComputedStyle(e).fontFamily)).toContain('IBM Plex Mono');
  const butikker = page.locator('.vk-butikker a');
  expect(await butikker.count()).toBe(2);
  for (const b of await butikker.all()) expect((await b.boundingBox()).height).toBeGreaterThanOrEqual(44);
});

test('avmeldingssiden på 390 px: toppen brytes i to rader og språkvelgeren holder seg inne i skjermen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  for (const [, sti] of AVMELD) {
    await page.goto(sti);
    const velger = await page.locator('.language-switcher-top').boundingBox();
    expect(velger.x).toBeGreaterThanOrEqual(0);
    expect(velger.x + velger.width).toBeLessThanOrEqual(390);
    await expect(page.locator('.nav-right a.link, nav .nav-back')).toBeHidden();
  }
});

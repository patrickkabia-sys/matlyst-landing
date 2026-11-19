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

// TikTok-retursidene og /app/
const AUTH = [['nb', '/tiktok-auth/'], ['sv', '/sv/tiktok-auth/'], ['da', '/da/tiktok-auth/'], ['en', '/en/tiktok-auth/']];
const FEIL = 'rgb(196, 52, 52)';

for (const bredde of BREDDER) {
  for (const [sprak, sti] of AUTH) {
    test(`auth ${sprak} ${bredde}: kodeboksen, knappen og toppen har nettstedets stil`, async ({ page }) => {
      await page.setViewportSize({ width: bredde, height: 900 });
      await page.goto(`${sti}?code=abc123&scopes=user.info.basic`);
      await expect(page.locator('.nav-brand, .brand')).toHaveCount(1);
      await expect(page.locator('#boks')).toBeVisible();
      const g = await grunnstil(page);
      expect(g.skrift).toContain('Schibsted Grotesk');
      expect(g.bakgrunn).toBe(FLATE);
      expect(g.merke.skrift).toContain('Fraunces Ordmerke');
      expect(g.overflow).toBeLessThanOrEqual(0);
      const h1 = await page.locator('.auth h1').evaluate((e) => ({ vekt: getComputedStyle(e).fontWeight, skrift: getComputedStyle(e).fontFamily }));
      expect(h1.vekt).toBe('700');
      expect(h1.skrift).toContain('Schibsted Grotesk');
      const boks = await page.locator('.auth .box').evaluate((e) => ({ bg: getComputedStyle(e).backgroundColor, r: getComputedStyle(e).borderTopLeftRadius }));
      expect(boks).toEqual({ bg: HYLLE, r: '28px' });
      const kode = await page.locator('.auth code').evaluate((e) => ({ skrift: getComputedStyle(e).fontFamily, bg: getComputedStyle(e).backgroundColor }));
      expect(kode.skrift).toContain('IBM Plex Mono');
      expect(kode.bg).toBe(FLATE);
      const knapp = page.locator('#kopier');
      expect(await knapp.evaluate((e) => getComputedStyle(e).backgroundColor)).toBe(BLEKK);
      expect((await knapp.boundingBox()).height).toBeGreaterThanOrEqual(44);
      await knapp.hover();
      await expect.poll(() => knapp.evaluate((e) => getComputedStyle(e).backgroundColor)).toBe(BLEKK_LYS);
    });
  }
}

test('auth: feilsvaret får feilfargen, og siden uten kode viser hjelpeteksten', async ({ page }) => {
  await page.goto('/tiktok-auth/?error=access_denied');
  expect(await page.locator('.auth h1').evaluate((e) => getComputedStyle(e).color)).toBe(FEIL);
  await page.goto('/tiktok-auth/');
  await expect(page.locator('#boks')).toBeHidden();
  expect(await page.locator('.auth h1').evaluate((e) => getComputedStyle(e).color)).toBe(BLEKK);
});

test('auth: koden kan fortsatt kopieres', async ({ browser }) => {
  const ctx = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
  const side = await ctx.newPage();
  await side.goto('/tiktok-auth/?code=abc123');
  await side.locator('#kopier').click();
  expect(await side.evaluate(() => navigator.clipboard.readText())).toBe('abc123');
  await ctx.close();
});

for (const bredde of BREDDER) {
  test(`app ${bredde}: Schibsted på hvitt, svarte pillemerker på minst 44 px, begge butikkene synlige på PC`, async ({ page }) => {
    await page.setViewportSize({ width: bredde, height: 800 });
    await page.goto('/app/');
    const g = await grunnstil(page);
    expect(g.skrift).toContain('Schibsted Grotesk');
    expect(g.bakgrunn).toBe(FLATE);
    expect(g.farge).toBe(BLEKK);
    expect(g.overflow).toBeLessThanOrEqual(0);
    const knapper = page.locator('a.store');
    await expect(knapper).toHaveCount(2);
    for (const k of await knapper.all()) {
      await expect(k).toBeVisible();
      expect((await k.boundingBox()).height).toBeGreaterThanOrEqual(44);
      expect(await k.evaluate((e) => ({ bg: getComputedStyle(e).backgroundColor, farge: getComputedStyle(e).color, r: parseFloat(getComputedStyle(e).borderTopLeftRadius) }))).toMatchObject({ bg: BLEKK, farge: FLATE });
      expect(await k.evaluate((e) => parseFloat(getComputedStyle(e).borderTopLeftRadius))).toBeGreaterThan(40);
    }
    expect(await page.locator('h1').evaluate((e) => getComputedStyle(e).fontWeight)).toBe('700');
  });
}

// Kampanjesidene og 404
const LOKALE_TIKTOK = [['sv', '/sv/tiktok/'], ['da', '/da/tiktok/'], ['en', '/en/tiktok/']];

for (const bredde of BREDDER) {
  for (const [navn, sti] of [['christine', '/christine/'], ['tiktok', '/tiktok/']]) {
    test(`kampanje ${navn} ${bredde}: Schibsted, ordmerket og svarte pillemerker`, async ({ page }) => {
      await page.setViewportSize({ width: bredde, height: 900 });
      await page.goto(sti);
      await expect(page.locator('.nav-brand')).toHaveCount(1);
      const g = await grunnstil(page);
      expect(g.skrift).toContain('Schibsted Grotesk');
      expect(g.bakgrunn).toBe(FLATE);
      expect(g.merke.skrift).toContain('Fraunces Ordmerke');
      expect(g.overflow).toBeLessThanOrEqual(0);
      const h1 = await page.locator('main h1').evaluate((e) => ({ vekt: getComputedStyle(e).fontWeight, skrift: getComputedStyle(e).fontFamily, str: parseFloat(getComputedStyle(e).fontSize) }));
      expect(h1.vekt).toBe('700');
      expect(h1.skrift).toContain('Schibsted Grotesk');
      expect(h1.str).toBe(bredde <= 640 ? 36 : 48);
      const butikker = page.locator('a.store');
      await expect(butikker).toHaveCount(2);
      for (const b of await butikker.all()) {
        expect((await b.boundingBox()).height).toBeGreaterThanOrEqual(44);
        expect(await b.evaluate((e) => ({ bg: getComputedStyle(e).backgroundColor, farge: getComputedStyle(e).color }))).toEqual({ bg: BLEKK, farge: FLATE });
        expect(await b.evaluate((e) => parseFloat(getComputedStyle(e).borderTopLeftRadius))).toBeGreaterThan(40);
      }
      const ios = await butikker.nth(0).boundingBox();
      const android = await butikker.nth(1).boundingBox();
      expect(Math.abs(ios.width - android.width)).toBeLessThan(1);
    });
  }
}

test('kampanje /tiktok/: tre steg med svarte tallsirkler fra grunnstilen', async ({ page }) => {
  await page.goto('/tiktok/');
  const steg = page.locator('.steps > .step');
  await expect(steg).toHaveCount(3);
  for (const s of await steg.all()) {
    const b = await s.locator('> b').evaluate((e) => ({ bg: getComputedStyle(e).backgroundColor, w: e.getBoundingClientRect().width, r: getComputedStyle(e).borderTopLeftRadius, pos: getComputedStyle(e).position }));
    expect(b).toMatchObject({ bg: BLEKK, w: 32, pos: 'absolute' });
    expect(parseFloat(b.r)).toBeGreaterThan(10);
    expect(await s.evaluate((e) => getComputedStyle(e).paddingLeft)).toBe('52px');
  }
});

for (const bredde of BREDDER) {
  for (const [sprak, sti] of LOKALE_TIKTOK) {
    test(`kampanje ${sprak} ${bredde}: lesekolonne, topp, bunn og et banner der begge valg veier likt`, async ({ page }) => {
      await page.setViewportSize({ width: bredde, height: 900 });
      await page.goto(sti);
      await expect(page.locator('main.legal-doc')).toHaveCount(1);
      await expect(page.locator('nav .brand')).toHaveCount(1);
      await expect(page.locator('footer')).toHaveCount(1);
      const g = await grunnstil(page);
      expect(g.skrift).toContain('Schibsted Grotesk');
      expect(g.merke.skrift).toContain('Fraunces Ordmerke');
      expect(g.overflow).toBeLessThanOrEqual(0);
      const kol = await page.locator('main.legal-doc').evaluate((e) => ({ b: e.getBoundingClientRect().width, str: getComputedStyle(e).fontSize }));
      expect(kol.str).toBe('19px');
      // Lesekolonne: 68ch pluss gutter på PC, hele bredden på mobil.
      if (bredde > 900) { expect(kol.b).toBeLessThan(900); expect(kol.b).toBeGreaterThan(600); } else expect(kol.b).toBe(bredde);
      const h1 = await page.locator('main.legal-doc h1').evaluate((e) => ({ vekt: getComputedStyle(e).fontWeight, str: parseFloat(getComputedStyle(e).fontSize), skrift: getComputedStyle(e).fontFamily }));
      expect(h1).toMatchObject({ vekt: '700', str: bredde <= 700 ? 32 : 38 });
      expect(h1.skrift).toContain('Schibsted Grotesk');
      const lenker = await page.locator('footer .f-l a:not([aria-label])').evaluateAll((es) => es.map((e) => e.getBoundingClientRect().height));
      expect(lenker.length).toBeGreaterThan(2);
      for (const h of lenker) expect(h).toBeGreaterThanOrEqual(44);
      const banner = page.locator('#cookie');
      await expect(banner).toBeVisible();
      const stil = (sel) => page.locator(sel).evaluate((e) => { const s = getComputedStyle(e); return { bg: s.backgroundColor, farge: s.color, kant: s.borderTopColor, vekt: s.fontWeight, str: s.fontSize, rad: s.borderTopLeftRadius, h: e.getBoundingClientRect().height }; });
      const godta = await stil('#cookie .ck-accept');
      const avvis = await stil('#cookie .ck-reject');
      expect(godta.bg).toBe(BLEKK);
      expect(avvis).toEqual(godta);
      expect(godta.h).toBeGreaterThanOrEqual(44);
    });
  }
}

test('404: Schibsted, svart pille, 44 px lenker og en bunn med ordmerket', async ({ page }) => {
  for (const bredde of BREDDER) {
    await page.setViewportSize({ width: bredde, height: 900 });
    await page.goto('/404.html');
    await expect(page.locator('nav .brand')).toHaveCount(1);
    await expect(page.locator('footer .brand')).toHaveCount(1);
    const g = await grunnstil(page);
    expect(g.skrift).toContain('Schibsted Grotesk');
    expect(g.bakgrunn).toBe(FLATE);
    expect(g.merke.skrift).toContain('Fraunces Ordmerke');
    expect(g.overflow).toBeLessThanOrEqual(0);
    expect(await page.locator('.not-found-card h1').evaluate((e) => ({ vekt: getComputedStyle(e).fontWeight, str: parseFloat(getComputedStyle(e).fontSize) }))).toEqual({ vekt: '700', str: bredde <= 520 ? 36 : 48 });
    const handling = page.locator('.not-found-action:not(.secondary)');
    expect(await handling.evaluate((e) => getComputedStyle(e).backgroundColor)).toBe(BLEKK);
    expect((await handling.boundingBox()).height).toBeGreaterThanOrEqual(44);
    await handling.hover();
    await expect.poll(() => handling.evaluate((e) => getComputedStyle(e).backgroundColor)).toBe(BLEKK_LYS);
    const sekundaer = await page.locator('.not-found-action.secondary').evaluate((e) => ({ bg: getComputedStyle(e).backgroundColor, kant: getComputedStyle(e).borderTopColor, farge: getComputedStyle(e).color }));
    expect(sekundaer).toEqual({ bg: 'rgba(0, 0, 0, 0)', kant: 'rgb(230, 226, 219)', farge: BLEKK });
    for (const l of await page.locator('.not-found-links a').all()) expect((await l.boundingBox()).height).toBeGreaterThanOrEqual(44);
    expect(await page.locator('.not-found-code').evaluate((e) => getComputedStyle(e).color)).toBe('rgb(176, 59, 0)');
  }
});

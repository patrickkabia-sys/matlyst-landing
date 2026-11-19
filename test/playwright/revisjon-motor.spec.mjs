import { test, expect } from '@playwright/test';
import { revider, samleFeil, skalering, storTekst, zoom, feilFor } from './hjelp/revisjon.mjs';

const F = (n) => `/test/fixtures/revisjon-${n}.html`;
const lokalt = () => test.skip(!!process.env.BASE_URL, 'fiksturene finnes bare lokalt');
const ORIGIN = 'http://127.0.0.1:4173';
const skriftPx = (page) => page.evaluate(() => getComputedStyle(document.documentElement).fontSize);
const tomt = { sidelengs: 0, utenforBoks: [], overlapp: [], iframer: [] };

test.describe('revisjonsmotoren, røde fikstur', () => {
  test('rod fikstur: rulling, boks, overlapp og konsollfeil med riktig art', async ({ page, baseURL }) => {
    lokalt();
    const feil = samleFeil(page, new URL(baseURL).origin);
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto(F('rod'));
    const r = await revider(page);
    expect(r.sidelengs).toBeGreaterThan(0);
    expect(r.utenforBoks.some((x) => x.includes('#klipp'))).toBe(true);
    expect(r.overlapp.some((x) => x.includes('#a') && x.includes('#b'))).toBe(true);
    expect(feil.konsoll.some((x) => x.includes('rød'))).toBe(true);
    expect(feil.fremmede).toEqual(['https://example.com/x.png']);
  });

  test('grønn kontroll: ren side gir null funn av alle slag', async ({ page, baseURL }) => {
    lokalt();
    const feil = samleFeil(page, new URL(baseURL).origin);
    await page.setViewportSize({ width: 390, height: 600 });
    await page.goto(F('ren'));
    expect(await revider(page)).toEqual(tomt);
    expect(feil).toEqual({ konsoll: [], fremmede: [], mangler: [] });
  });

  test('hidden-boks i rullbar forfar er fortsatt klippet', async ({ page }) => {
    lokalt();
    await page.goto(F('klipp'));
    const r = await revider(page);
    expect(r.utenforBoks).toHaveLength(1);
    expect(r.utenforBoks[0]).toContain('#klipp');
    expect(r.overlapp).toEqual([]);
  });

  test('fast tekst som ikke er krom over vanlig tekst er rød, krom er unntatt', async ({ page }) => {
    lokalt();
    await page.setViewportSize({ width: 390, height: 600 });
    await page.goto(F('fast'));
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const r = await revider(page);
    expect(r.overlapp.some((x) => x.includes('#fast'))).toBe(true);
    expect(r.overlapp.some((x) => x.includes('.topp'))).toBe(false);
  });

  test('sticky-overskrift som dekker innhold først etter rulling blir rød', async ({ page }) => {
    lokalt();
    await page.setViewportSize({ width: 390, height: 500 });
    await page.goto(F('sticky'));
    // ved øverste posisjon alene finnes ingen overlapp
    const r = await revider(page);
    expect(r.overlapp.some((x) => x.includes('header'))).toBe(true);
  });

  test('details åpnes og kontrolleres', async ({ page }) => {
    lokalt();
    await page.goto(F('details'));
    const r = await revider(page);
    expect(r.utenforBoks).toHaveLength(1);
    expect(r.utenforBoks[0]).toContain('#boks');
  });

  test('tilsiktetKlipp slipper tekst i samlebånd, uten valget er den rød', async ({ page }) => {
    lokalt();
    await page.goto(F('tilsiktet'));
    expect((await revider(page)).utenforBoks).toHaveLength(1);
    expect((await revider(page, { tilsiktetKlipp: ['.band'] })).utenforBoks).toEqual([]);
  });

  test('iframe som sprenger bredden rapporteres, men revideres ikke innvendig', async ({ page }) => {
    lokalt();
    await page.setViewportSize({ width: 390, height: 600 });
    await page.goto(F('iframe'));
    const r = await revider(page);
    expect(r.iframer).toHaveLength(1);
    expect(r.iframer[0]).toContain('#video');
  });
});

test.describe('samleren', () => {
  test('avbrutt media er ikke mangel, avbrutt bilde og 404 er det; pageerror er konsollfeil', async ({ page, baseURL }) => {
    lokalt();
    await page.route('**/media-avbrutt.mp4', (r) => r.abort('aborted'));
    await page.route('**/bilde-avbrutt.png', (r) => r.abort('aborted'));
    const feil = samleFeil(page, new URL(baseURL).origin);
    await page.goto(F('media'));
    await page.waitForTimeout(500);
    expect(feil.mangler.some((x) => x.includes('media-avbrutt'))).toBe(false);
    expect(feil.mangler.some((x) => x.includes('bilde-avbrutt'))).toBe(true);
    expect(feil.mangler.some((x) => x.startsWith('404') && x.includes('finnes-ikke'))).toBe(true);

    await page.goto(F('sidefeil'));
    await page.waitForTimeout(200);
    expect(feil.konsoll.some((x) => x.includes('bom-ufanget'))).toBe(true);
  });

  test('forespørsel 500 ms etter last kommer med i revisjonen', async ({ page, baseURL }) => {
    lokalt();
    const feil = samleFeil(page, new URL(baseURL).origin);
    await page.goto(F('sen'));
    expect(feil.fremmede).toEqual([]);
    await revider(page);
    expect(feil.fremmede).toEqual(['https://example.com/sen.png']);
  });

  test('zoom med opphav samler fra første navigasjon', async ({ browser }) => {
    lokalt();
    const side = await zoom(browser, F('rod'), 2, 1280, { opphav: ORIGIN });
    await side.waitForTimeout(300);
    expect(feilFor(side).fremmede).toEqual(['https://example.com/x.png']);
    await side.reload();
    expect(feilFor(side).fremmede.length).toBeGreaterThanOrEqual(1);
  });
});

test.describe('tekststørrelse og zoom', () => {
  test('storTekst dobler rem-tekst og lar px-tekst stå', async ({ page }) => {
    lokalt();
    await page.goto(F('rod'));
    const [rem, px] = await Promise.all(['#rem', '#px'].map(async (v) => (await skalering(page, v))[0].faktor));
    expect(rem).toBeGreaterThanOrEqual(1.9);
    expect(px).toBeLessThan(1.1);
  });

  test('skalering nullstiller til 16 px også når omlastingen feiler', async ({ page }) => {
    lokalt();
    await page.goto(F('rod'));
    const ekte = page.reload.bind(page);
    let n = 0;
    page.reload = async (...a) => {
      if (++n === 2) throw new Error('omlasting feilet');
      return ekte(...a);
    };
    await expect(skalering(page, '#rem')).rejects.toThrow('omlasting feilet');
    page.reload = ekte;
    await page.reload();
    expect(await skriftPx(page)).toBe('16px');
  });

  test('storTekst nullstilles ved navigasjon til annen adresse', async ({ page }) => {
    lokalt();
    await page.goto(F('rod'));
    await storTekst(page);
    await page.reload();
    expect(await skriftPx(page)).toBe('32px');
    await page.goto(F('ren'));
    await page.waitForTimeout(200);
    await page.reload();
    expect(await skriftPx(page)).toBe('16px');
  });

  test('zoom 200 % gjør px-tekst dobbelt så stor på skjermen', async ({ browser }) => {
    lokalt();
    const side = await zoom(browser, F('rod'), 2);
    expect(await side.evaluate(() => innerWidth)).toBe(640);
    expect(await side.evaluate(() => devicePixelRatio)).toBe(2);
  });
});

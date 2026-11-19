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

  test('visuelt skjult skiplenke teller ikke; samme lenke synlig ved fokus og ut av boksen er rød', async ({ page }) => {
    lokalt();
    await page.setViewportSize({ width: 390, height: 600 });
    await page.goto(F('hopp'));
    expect(await revider(page)).toEqual(tomt);
    await page.goto(`${F('hopp')}`);
    await page.evaluate(() => { document.querySelector('.blad').classList.add('rod'); document.querySelector('.hopp').focus(); });
    const r = await revider(page);
    expect(r.utenforBoks.some((x) => x.includes('a.hopp'))).toBe(true);
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

  test('tekst i legitim vannrett rullboks flagges ikke mot sidebredden', async ({ page }) => {
    lokalt();
    await page.setViewportSize({ width: 390, height: 600 });
    await page.goto(F('rullboks'));
    expect(await revider(page)).toEqual(tomt);
  });

  test('tekst som stikker ut under sidekortet (.blad) er rød, kort som rommer innholdet er grønt', async ({ page }) => {
    lokalt();
    await page.goto(F('blad-ut'));
    const r = await revider(page);
    expect(r.utenforBoks.some((x) => x.includes('#ut'))).toBe(true);
    await page.goto(F('blad-ok'));
    expect(await revider(page)).toEqual(tomt);
  });

  test('overlapp på 100 x 1 px er rød', async ({ page }) => {
    lokalt();
    await page.goto(F('tynt'));
    const r = await revider(page);
    expect(r.overlapp.some((x) => x.includes('#a') && x.includes('#b'))).toBe(true);
  });

  test('klippet tekst i samlebånd overlapper ikke naboen den ikke dekker', async ({ page }) => {
    lokalt();
    await page.goto(F('klippnabo'));
    const r = await revider(page, { tilsiktetKlipp: ['.band'] });
    expect(r.overlapp).toEqual([]);
    expect(r.utenforBoks).toEqual([]);
  });

  for (const [w, h, rod] of [[1, 1, false], [2, 2, false], [3, 2, true], ['full', 3, true]]) {
    test(`overlappflate ${w} x ${h} px er ${rod ? 'rød' : 'grønn'} (grense: over 4 px²)`, async ({ page }) => {
      lokalt();
      await page.goto(F('areal') + `?w=${w}&h=${h}`);
      const r = await revider(page);
      expect(r.overlapp.some((x) => x.includes('#a') && x.includes('#b'))).toBe(rod);
    });
  }

  test('overlapp på 0,4 px høyde over full bredde er rød (flate 40 px² og mer)', async ({ browser, baseURL }) => {
    lokalt();
    const context = await browser.newContext({ baseURL, deviceScaleFactor: 5, viewport: { width: 390, height: 600 } });
    const page = await context.newPage();
    await page.goto(F('areal') + '?w=full&h=0.4');
    const r = await revider(page);
    await context.close();
    expect(r.overlapp.some((x) => x.includes('#a') && x.includes('#b'))).toBe(true);
  });

  for (const [dekke, rod, navn] of [
    ['ugj', false, 'tekst under et ugjennomsiktig kort er grønn'],
    ['', true, 'to synlige tekster oppå hverandre er røde'],
    ['op', true, 'tekst under lag med opacity .5 er rød'],
    ['alfa', true, 'tekst under lag med halvgjennomsiktig bakgrunn er rød'],
  ]) {
    test(`okklusjon: ${navn}`, async ({ page }) => {
      lokalt();
      await page.goto(F('dekket') + `?dekke=${dekke}`);
      const r = await revider(page);
      expect(r.overlapp.some((x) => x.includes('#under') && x.includes('#over'))).toBe(rod);
    });
  }

  test('okklusjon: synlig tekst med pointer-events:none oppå ugjennomsiktig bakgrunn er rød', async ({ page }) => {
    lokalt();
    await page.goto(F('pekerlos'));
    const r = await revider(page);
    expect(r.overlapp.some((x) => x.includes('#a') && x.includes('#b'))).toBe(true);
    expect(await page.evaluate(() => [...document.querySelectorAll('[style]')].length)).toBe(0);
  });

  test('okklusjon: pointer-events:none!important i stilarket taper mot målingen, rød; inline-verdi settes tilbake', async ({ page }) => {
    lokalt();
    await page.goto(F('pekerviktig'));
    const r = await revider(page);
    expect(r.overlapp.some((x) => x.includes('#a') && x.includes('#b'))).toBe(true);
    expect(await page.evaluate(() => { const s = document.getElementById('a').style; return s.getPropertyValue('pointer-events') + '|' + s.getPropertyPriority('pointer-events'); })).toBe('none|');
    expect(await page.evaluate(() => document.getElementById('b').hasAttribute('style'))).toBe(false);
  });

  test('rullboks på 200 px i 100 px overflow:clip-kort er rød, i bredt nok kort grønn', async ({ page }) => {
    lokalt();
    await page.setViewportSize({ width: 390, height: 600 });
    await page.goto(F('rullkort'));
    const r = await revider(page);
    expect(r.utenforBoks).toHaveLength(1);
    expect(r.utenforBoks[0]).toContain('#rad');
    await page.goto(F('rullkort') + '?bred');
    expect(await revider(page)).toEqual(tomt);
  });

  for (const [q, rod, navn] of [
    ['', false, 'tekst klippet bare av den fritatte boksen er grønn'],
    ['?indre', true, 'indre overflow:hidden-boks som klipper tekst er rød'],
    ['?kort', true, 'synlig del av den fritatte boksen klippet av ytre kort er rød'],
    ['?yklipp', true, 'boks som bare klipper loddrett kutter ikke vannrett: 200 px tekst i 150 px kort er rød'],
  ]) {
    test(`tilsiktetKlipp fritar bare selve boksen: ${navn}`, async ({ page }) => {
      lokalt();
      await page.setViewportSize({ width: 600, height: 600 });
      await page.goto(F('tilsiktet-indre') + q);
      const r = await revider(page, { tilsiktetKlipp: ['.band'] });
      expect(r.utenforBoks.some((x) => x.includes('#t'))).toBe(rod);
    });
  }

  test('rullrad inni overflow:clip-kort er grønn, bred tekst som ikke ruller i samme kort er rød', async ({ page }) => {
    lokalt();
    await page.setViewportSize({ width: 390, height: 600 });
    await page.goto(F('rullrad'));
    const r = await revider(page);
    expect(r.utenforBoks).toHaveLength(1);
    expect(r.utenforBoks[0]).toContain('#bred');
  });

  test('okklusjon: ugjennomsiktig .fast (krom) dekker to overlappende tekster, grønn', async ({ page }) => {
    lokalt();
    await page.goto(F('fastdekk'));
    expect((await revider(page)).overlapp).toEqual([]);
    // uten at kromflaten skjuler noe er paret en ekte overlapp
    await page.addStyleTag({ content: '.fast{display:none}' });
    expect((await revider(page)).overlapp.some((x) => x.includes('#a') && x.includes('#b'))).toBe(true);
  });

  test('okklusjon: .fast med 80 % hvit og uskarphet skjuler, uten uskarphet gjør den ikke det', async ({ page }) => {
    lokalt();
    await page.goto(F('fastuskarp'));
    expect((await revider(page)).overlapp).toEqual([]);
    await page.goto(F('fastuskarp') + '?klar');
    expect((await revider(page)).overlapp.some((x) => x.includes('#a') && x.includes('#b'))).toBe(true);
  });

  for (const [blur, rod] of [[0, true], [2, true], [8, false], [18, false]]) {
    test(`okklusjon: 80 % hvit med blur(${blur}px) ${rod ? 'dekker ikke, rød' : 'dekker, grønn'}`, async ({ page }) => {
      lokalt();
      await page.goto(F('fastuskarp') + `?blur=${blur}`);
      expect((await revider(page)).overlapp.some((x) => x.includes('#a') && x.includes('#b'))).toBe(rod);
    });
  }

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

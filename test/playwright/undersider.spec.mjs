// Undersidene: omregnerne (kalkulatorkortet på de ekte sidene) og den faste knappen. Adressene leses fra forhåndsvisningens kart.json
// til typene er rullet ut; ellers brukes de ekte stiene.
import { existsSync, readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { presisTekst } from '../../scripts/kalk-kort.mjs';

// qa/ er gitignorert: i CI og etter utrulling finnes ikke kartet, og da gjelder de ekte stiene.
const kartFil = new URL('../../qa/forhandsvisning/kart.json', import.meta.url);
const kart = existsSync(kartFil) ? JSON.parse(readFileSync(kartFil, 'utf8')) : [];
const adresse = (sti) => kart.find((s) => s.sti === sti)?.url ?? sti;


// Enhetsomregnerne bruker kalkulatorkortet (form.kalk, data-kalk="enhet") rett under ingressen. Forventningene utledes av sidens egne kalk-data
// (faktorer, bøyde former, antall sifre), aldri av kopierte tall. Eldre omregner (form.omregner) finnes ikke lenger.
const KALK = 'form.kalk[data-kalk="enhet"]';
const lesData = (page) => page.locator(`${KALK} .kalk-data`).evaluate((e) => JSON.parse(e.textContent));
const komma = (lang) => (lang === 'en' ? '.' : ',');
const tallTekst = (n, lang, data) => presisTekst(n, data.sifre).replace('.', komma(lang));
const ordFor = (data, id, entall) => { const k = data.kort[id]; return Array.isArray(k) ? k[entall ? 0 : 1] : (k ?? id); };
const faktor = (data, id) => (id in data.ml ? data.ml[id] : data.g[id]);
const regn = (data, n, fra, til) => {
  if (data.affin && data.affin[fra] && data.affin[til]) { const [aF, bF] = data.affin[fra], [aT, bT] = data.affin[til]; return (n * aF + bF - bT) / aT; }
  return n * faktor(data, fra) / faktor(data, til);
};
/** Setningen kortet skal vise, utledet av dataene: «2 cups = 4,732 dl». */
const setningFor = (data, lang, n, fra, til) => {
  const ut = tallTekst(regn(data, n, fra, til), lang, data);
  return `${tallTekst(n, lang, data)} ${ordFor(data, fra, n === 1)} = ${ut} ${ordFor(data, til, ut === '1')}`;
};

const SPRAK_SIDER = [
  { sprak: 'nb', sti: '/verktoy/kopp-til-dl/', ml: '/verktoy/kopp-til-ml/', temp: '/verktoy/celsius-til-fahrenheit/', hub: '/verktoy/enhetsomregner/' },
  { sprak: 'sv', sti: '/sv/verktyg/kopp-till-dl/', ml: '/sv/verktyg/kopp-till-ml/', temp: '/sv/verktyg/celsius-till-fahrenheit/', hub: '/sv/verktyg/enhetsomvandlare/' },
  { sprak: 'da', sti: '/da/vaerktoejer/kop-til-dl/', ml: '/da/vaerktoejer/kop-til-ml/', temp: '/da/vaerktoejer/celsius-til-fahrenheit/', hub: '/da/vaerktoejer/enhedsomregner/' },
  { sprak: 'en', sti: '/en/tools/cups-to-dl/', ml: '/en/tools/cups-to-ml/', temp: '/en/tools/c-to-f/', hub: '/en/tools/unit-converter/' },
];

test('omregneren regner, med fire gjeldende sifre', async ({ page }) => {
  await page.goto(adresse('/verktoy/kopp-til-dl/'));
  const data = await lesData(page);
  await page.locator(`${KALK} [data-felt=mengde]`).fill('2');
  await expect(page.locator(`${KALK} [data-felt=svar]`)).toHaveText(tallTekst(regn(data, 2, 'cups', 'dl'), 'nb', data));
  await expect(page.locator(`${KALK} [data-felt=setning]`)).toHaveText(setningFor(data, 'nb', 2, 'cups', 'dl'));
  expect(setningFor(data, 'nb', 2, 'cups', 'dl'), 'vakten ser det samme som siden').toBe('2 cups = 4,732 dl');
});

test('omregneren regner det omvendte når enhetene byttes; mengden står, og svaret brytes i stedet for å kuttes på 360 px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto(adresse('/verktoy/kopp-til-dl/'));
  const data = await lesData(page);
  const fraFelt = page.locator(`${KALK} [data-felt=fra]`), tilFelt = page.locator(`${KALK} [data-felt=til]`);
  await page.locator(`${KALK} [data-felt=mengde]`).fill('1500');
  const fra = await fraFelt.inputValue(), til = await tilFelt.inputValue();
  await page.locator(`${KALK} [data-felt=bytt]`).click();
  expect(await fraFelt.inputValue()).toBe(til);
  expect(await tilFelt.inputValue()).toBe(fra);
  await expect(page.locator(`${KALK} [data-felt=mengde]`), 'mengden står ved bytte').toHaveValue('1500');
  await expect(page.locator(`${KALK} [data-felt=setning]`)).toHaveText(setningFor(data, 'nb', 1500, til, fra));
  await expect(page.locator(`${KALK} [data-felt=svar]`)).toHaveText(tallTekst(regn(data, 1500, til, fra), 'nb', data));
  for (const felt of ['svar', 'setning']) {
    const boks = await page.locator(`${KALK} [data-felt=${felt}]`).evaluate((e) => ({ s: e.scrollWidth, b: e.clientWidth }));
    expect(boks.s, `${felt} kuttes ikke`).toBeLessThanOrEqual(boks.b);
  }
  const knapp = await page.locator(`${KALK} [data-felt=bytt]`).boundingBox();
  expect(knapp.width).toBeGreaterThanOrEqual(44);
  expect(knapp.height).toBeGreaterThanOrEqual(44);
});

test('bytte: hurtigmengdene bytter til den nye fra-enhetens mengder, og aria-pressed følger mengden', async ({ page }) => {
  await page.goto(adresse('/verktoy/kopp-til-dl/'));
  const data = await lesData(page);
  await page.locator(`${KALK} [data-felt=mengde]`).fill('3');
  await page.locator(`${KALK} [data-felt=bytt]`).click();
  const steg = data.steg[data.stegFor.dl];
  const knapper = page.locator(`${KALK} .hurtig button`);
  await expect(knapper).toHaveText(steg.map((v) => `${v} ${ordFor(data, 'dl', Number(v.replace(',', '.')) === 1)}`));
  const i3 = steg.indexOf('3');
  expect(i3, 'tre er en hurtigmengde for dl').toBeGreaterThan(-1);
  await expect(knapper.nth(i3)).toHaveAttribute('aria-pressed', 'true');
  await expect(knapper.nth(i3 === 0 ? 1 : 0)).toHaveAttribute('aria-pressed', 'false');
});

// Bøying per språk, med formene fra sidens egne data (kalk-data.kort) og aldri fra JS: «1 cup», «2 cups».
for (const { sprak, sti } of SPRAK_SIDER) {
  test(`omregneren (${sprak}): entall for 1 og flertall ellers, med formene fra sidens data`, async ({ page }) => {
    await page.goto(sti);
    const data = await lesData(page);
    const [entall, flertall] = data.kort.cups;
    expect([entall, flertall].every((s) => typeof s === 'string' && s.length > 0), 'formene står i sidens data').toBe(true);
    expect(entall).not.toBe(flertall);
    const setning = page.locator(`${KALK} [data-felt=setning]`), mengde = page.locator(`${KALK} [data-felt=mengde]`);
    const d = komma(sprak);
    await expect(setning).toHaveText(new RegExp(`^1 ${entall} = `, 'u'));
    for (const [inn, ut, ord] of [['1500', '1500', flertall], ['2', '2', flertall], ['0.5', `0${d}5`, flertall]]) {
      await mengde.fill(inn);
      await expect(setning).toHaveText(new RegExp(`^${ut} ${ord} = `, 'u'));
    }
    // To cups er én pint (entall på høyre side).
    await page.locator(`${KALK} [data-felt=til]`).selectOption('pints');
    await mengde.fill('2');
    await expect(setning).toHaveText(setningFor(data, sprak, 2, 'cups', 'pints'));
    expect(ordFor(data, 'pints', true)).toBeTruthy();
    await expect(setning).toHaveText(new RegExp(`^2 ${flertall} = 1 ${ordFor(data, 'pints', true)}$`, 'u'));
    await mengde.fill('4');
    await expect(setning).toHaveText(new RegExp(`^4 ${flertall} = 2 ${ordFor(data, 'pints', false)}$`, 'u'));
    await page.locator(`${KALK} [data-felt=til]`).selectOption('ml');
    await expect(setning).toHaveText(setningFor(data, sprak, 4, 'cups', 'ml'));
    await expect(setning).toHaveText(new RegExp(`^4 ${flertall} = 946${d}4 ml$`, 'u'));
  });
}

// Kortet står i heroen rett under ingressen og er høyst 920 px bredt (designspec 16.8). Tallet får plass også med sju sifre.
for (const bredde of [390, 1001, 1280, 1600]) {
  test(`omregneren på ${bredde} px: kortet står rett under ingressen i heroen, høyst 920 px bredt, og tallet får plass`, async ({ page }) => {
    await page.setViewportSize({ width: bredde, height: 900 });
    for (const { sti, hub } of SPRAK_SIDER) for (const adr of [sti, hub]) {
      await page.goto(adr);
      const m = await page.evaluate(() => {
        const f = document.querySelector('form.kalk'), x = (e) => e.getBoundingClientRect();
        const hero = f.parentElement, lead = f.previousElementSibling;
        return { heroKlasse: hero.matches('header.locale-page-hero'), leadKlasse: lead?.matches('p.lead') ?? false, bredde: x(f).width, venstre: x(f).left, hoyre: x(f).right, vindu: document.documentElement.clientWidth, leadBunn: lead ? x(lead).bottom : null, kortTopp: x(f).top, sidelengs: document.documentElement.scrollWidth - document.documentElement.clientWidth };
      });
      expect(m.heroKlasse, `${adr}: kortet ligger i header.locale-page-hero`).toBe(true);
      expect(m.leadKlasse, `${adr}: elementet rett over kortet er ingressen (p.lead)`).toBe(true);
      expect(m.kortTopp, `${adr}: kortet kommer etter ingressen`).toBeGreaterThanOrEqual(m.leadBunn);
      expect(m.bredde, `${adr}: kortet er høyst 920 px bredt`).toBeLessThanOrEqual(920.5);
      expect(m.venstre).toBeGreaterThanOrEqual(0); expect(m.hoyre).toBeLessThanOrEqual(m.vindu);
      expect(m.sidelengs, `${adr}: ingen sidelengs rulling`).toBeLessThanOrEqual(0);
      await page.locator(`${KALK} [data-felt=mengde]`).fill('1234567');
      const klipp = await page.locator(`${KALK} [data-felt=mengde]`).evaluate((e) => e.scrollWidth - e.clientWidth);
      expect(klipp, `${adr}: sju sifre klippes ikke`).toBeLessThanOrEqual(0);
    }
  });
}

// Desimaltegnet i svaret følger sidens språk (lang), og inntastingen tåler både komma og punktum.
for (const { sprak, ml } of SPRAK_SIDER) {
  const d = komma(sprak);
  test(`omregneren (${sprak}): desimaltegnet er «${d}», og både komma og punktum kan skrives inn`, async ({ page }) => {
    await page.goto(ml);
    const data = await lesData(page);
    const mengde = page.locator(`${KALK} [data-felt=mengde]`), setning = page.locator(`${KALK} [data-felt=setning]`), svar = page.locator(`${KALK} [data-felt=svar]`);
    expect(await page.evaluate(() => document.documentElement.lang)).toMatch(/^(nb|sv|da|en)/u);
    for (const innskrevet of ['1,5', '1.5']) {
      await mengde.fill(innskrevet);
      await expect(setning).toHaveText(setningFor(data, sprak, 1.5, 'cups', 'ml'));
      await expect(svar).toHaveText(tallTekst(1.5 * data.ml.cups, sprak, data));
    }
    expect(await svar.textContent()).toBe(`354${d}9`);
    await mengde.fill('1500');
    expect(await svar.textContent(), 'heltall fra 1000, uten tusenskille').toBe(String(Math.round(1500 * data.ml.cups)));
    // Serverens HTML (hentet uten skript) og skriptets svar for samme mengde (1) er identiske.
    const html = await (await page.request.get(ml)).text();
    const server = /data-felt="setning"[^>]*>([^<]*)</u.exec(html)[1].replace(/&amp;/gu, '&');
    await mengde.fill('1');
    expect(await setning.textContent(), 'server og skript har ulikt svar for 1').toBe(server);
  });
}

// Hele inntastingen valideres (testtabell for alle fire språk). Forventet: mengden slik kortet viser den (tallet som ble skrevet, med språkets desimaltegn),
// eller null = ugyldig (veiledningen, aria-invalid). Kortet viser mengden som skrevet (ikke avrundet), og engelsk tar brøker: der er mellomrom mellom sifre
// ikke tusenskille («1 500» er ugyldig, «1 1/2» er halvannen).
const NORDISK = [['1,5', '1,5'], ['1.5', '1,5'], ['1.500', '1500'], ['1 500', '1500'], ['1 500', '1500'], ['1 500', '1500'], ['1.500,25', '1500,25'], ['1,500', '1,5'], ['12.345', '12345'], ['1234.567', '1234,567'], ['1.500.000', '1500000'], ['12.34', '12,34'], ['+2', '2'], ['0,5', '0,5'], ['1,5,2', null], ['1.5.2', null], ['1,5.2', null], ['2cups', null], ['abc', null], ['1 5 0', '150'], ['--1', null], ['1,.5', null], ['1,500.5', null], ['1.0500', '1,05'], ['0.125', '0,125'], ['0,125', '0,125'], ['0.5', '0,5'], ['00.125', '0,125'], ['.125', '0,125']];
const ENGELSK = [['1.5', '1.5'], ['1,5', '1.5'], ['1,500', '1500'], ['1 500', null], ['1\u00a0500', null], ['1\u202f500', null], ['1,500.25', '1500.25'], ['1.500', '1.5'], ['12,345', '12345'], ['1234,567', '1234.567'], ['1,500,000', '1500000'], ['12.34', '12.34'], ['0.5', '0.5'], ['1 1/2', '1 1/2'], ['1/2', '1/2'], ['1,5,2', null], ['1.5.2', null], ['1.500,5', null], ['2cups', null], ['abc', null], ['--1', null], ['0.125', '0.125'], ['0,125', '0.125'], ['00.125', '0.125'], ['.125', '0.125']];
for (const { sprak, ml } of SPRAK_SIDER) {
  test(`omregneren (${sprak}): hele inntastingen valideres, delsvar finnes ikke`, async ({ page }) => {
    await page.goto(ml);
    const data = await lesData(page);
    const mengde = page.locator(`${KALK} [data-felt=mengde]`), svar = page.locator(`${KALK} [data-felt=svar]`), setning = page.locator(`${KALK} [data-felt=setning]`);
    for (const [inn, forventet] of sprak === 'en' ? ENGELSK : NORDISK) {
      await mengde.fill(inn);
      const tekst = await setning.textContent(), ugyldig = await mengde.getAttribute('aria-invalid');
      if (forventet === null) { expect(tekst, `«${inn}» skal gi veiledningen`).toBe(data.feil); expect(await svar.textContent(), `«${inn}» skal gi tomt svar`).toBe(''); expect(ugyldig, `«${inn}» aria-invalid`).toBe('true'); }
      else { expect(tekst.startsWith(`${forventet} `), `«${inn}» skal gi ${forventet}, ga «${tekst}»`).toBe(true); expect(ugyldig, `«${inn}» er gyldig`).toBeNull(); }
    }
    // Tomt felt: veiledning og aria-invalid, aldri et delsvar.
    await mengde.fill('');
    expect(await svar.textContent()).toBe('');
    // På en volumside er minus ugyldig: veiledningen og aria-invalid, ikke et svar.
    for (const minus of ['-1', '-2']) {
      await mengde.fill(minus);
      expect(await setning.textContent(), `«${minus}» på en volumside gir veiledningen`).toBe(data.feil);
      expect(await mengde.getAttribute('aria-invalid')).toBe('true');
      expect(await svar.textContent()).toBe('');
    }
  });
  test(`omregneren (${sprak}): på temperatursiden er minusgrader gyldige`, async ({ page }) => {
    await page.goto(SPRAK_SIDER.find((s) => s.sprak === sprak).temp);
    const data = await lesData(page);
    expect(data.negativ, 'negative tall er slått på i sidens data').toBe(true);
    const mengde = page.locator(`${KALK} [data-felt=mengde]`);
    await mengde.fill('-18');
    await expect(page.locator(`${KALK} [data-felt=setning]`)).toHaveText(setningFor(data, sprak, -18, 'c', 'f'));
    expect(setningFor(data, sprak, -18, 'c', 'f')).toBe(`-18 °C = -0${komma(sprak)}4 °F`);
    expect(await mengde.getAttribute('aria-invalid')).toBeNull();
  });
}

test('omregneren: tab-rekkefølgen er mengde, fra, bytt, til og hurtigmengdene, med navn og synlig fokus', async ({ page }) => {
  await page.goto(adresse('/verktoy/kopp-til-dl/'));
  await page.locator('#ck-reject').click({ timeout: 2000 }).catch(() => {});
  await page.evaluate(() => { const k = document.querySelector('form.kalk'); const t = document.createElement('span'); t.tabIndex = 0; k.before(t); t.focus(); });
  const rekkefolge = ['mengde', 'fra', 'bytt', 'til', 'hurtig', 'hurtig', 'hurtig', 'hurtig', 'hurtig', 'hurtig'];
  const sett = [];
  for (let i = 0; i < rekkefolge.length; i++) {
    await page.keyboard.press('Tab');
    const m = await page.evaluate(() => {
      const e = document.activeElement;
      if (!e.closest('form.kalk')) return null;
      const stil = getComputedStyle(e), ramme = e.closest('label') ? getComputedStyle(e.closest('label')) : null, side = e.closest('.kalkside') ? getComputedStyle(e.closest('.kalkside')) : null;
      const navn = (e.getAttribute('aria-label') || e.labels?.[0]?.textContent || e.textContent || '').trim();
      const ring = (s) => s && ((s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || s.boxShadow !== 'none');
      return { rolle: e.closest('.hurtig') ? 'hurtig' : e.getAttribute('data-felt'), navn, fokus: Boolean(ring(stil) || ring(ramme) || ring(side)) };
    });
    expect(m, `stopp ${i + 1} ligger i kortet`).not.toBeNull();
    sett.push(m.rolle);
    expect(m.navn.length, `stopp ${i + 1} (${m.rolle}) mangler navn`).toBeGreaterThan(0);
    expect(m.fokus, `stopp ${i + 1} (${m.rolle}) mangler synlig fokus`).toBe(true);
  }
  expect(sett).toEqual(rekkefolge);
});

for (const bredde of [360, 1280]) {
  test(`omregneren: trykkflatene er minst 44 px på ${bredde} px`, async ({ page }) => {
    await page.setViewportSize({ width: bredde, height: 800 });
    await page.goto(adresse('/verktoy/kopp-til-dl/'));
    const smaa = await page.evaluate(() => [...document.querySelectorAll('form.kalk input, form.kalk select, form.kalk button')]
      .map((e) => { const r = e.getBoundingClientRect(); return [e.getAttribute('data-felt') || e.textContent.trim(), Math.round(r.width), Math.round(r.height)]; })
      .filter(([, b, h]) => h < 44 || b < 44));
    expect(smaa, 'trykkflater under 44 px').toEqual([]);
  });
}

test('omregneren: kortet holder seg inne i skjermen med dobbel tekststørrelse på 1280 px', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Page.setFontSizes', { fontSizes: { standard: 32 } });
  await page.goto(adresse('/verktoy/kopp-til-dl/'));
  const boks = await page.locator('form.kalk').boundingBox();
  expect(boks.x).toBeGreaterThanOrEqual(0);
  expect(boks.x + boks.width).toBeLessThanOrEqual(1280);
  const hoyre = await page.evaluate(() => document.querySelector('form.kalk').scrollWidth - document.querySelector('form.kalk').clientWidth);
  expect(hoyre).toBeLessThanOrEqual(0);
});

test('omregneren: kortet holder seg inne i siden på 360 px, også med forstørret tekst', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Page.setFontSizes', { fontSizes: { standard: 32 } });
  for (const { sti } of SPRAK_SIDER) {
    await page.goto(sti);
    const m = await page.evaluate(() => { const r = document.querySelector('form.kalk').getBoundingClientRect(); return { venstre: r.left, hoyre: r.right, vindu: document.documentElement.clientWidth, sidelengs: document.documentElement.scrollWidth - document.documentElement.clientWidth }; });
    expect(m.venstre, sti).toBeGreaterThanOrEqual(0);
    expect(m.hoyre, sti).toBeLessThanOrEqual(m.vindu);
    expect(m.sidelengs, `${sti}: ingen sidelengs rulling`).toBeLessThanOrEqual(0);
  }
});

test('omregneren: ingen innholdsfortegnelse, svarboks eller gammel omregner på noen av sidene', async ({ page }) => {
  for (const { sti, hub } of SPRAK_SIDER) for (const adr of [sti, hub]) {
    await page.goto(adr);
    for (const sel of ['.toc', '.answer', 'form.omregner']) expect(await page.locator(sel).count(), `${adr}: ${sel}`).toBe(0);
    expect(await page.locator(KALK).count(), `${adr}: ett kalkulatorkort`).toBe(1);
  }
});

// Bytteknappen: ved redusert bevegelse beveger den seg ikke (ingen overgang), ellers dreies den med en overgang. Verdiene byttes uansett straks.
test('bytteknappen: ved prefers-reduced-motion: reduce beveger den seg ikke, men verdiene byttes', async ({ browser, baseURL }) => {
  const sti = '/verktoy/kopp-til-ml/';
  const mål = async (reducedMotion) => {
    const ctx = await browser.newContext({ baseURL, viewport: { width: 1280, height: 800 }, reducedMotion });
    const page = await ctx.newPage();
    await page.goto(sti);
    const til0 = await page.locator(`${KALK} [data-felt=til]`).inputValue();
    await page.locator(`${KALK} [data-felt=bytt]`).click();
    const m = await page.evaluate(() => {
      const knapp = document.querySelector('form.kalk [data-felt=bytt]');
      return { animasjoner: knapp.getAnimations().length, varighet: getComputedStyle(knapp).transitionDuration, fra: document.querySelector('form.kalk [data-felt=fra]').value };
    });
    expect(m.fra, 'verdiene er byttet med en gang').toBe(til0);
    await ctx.close();
    return m;
  };
  const rolig = await mål('reduce');
  expect(rolig.animasjoner, 'ingen pågående bevegelse').toBe(0);
  expect(rolig.varighet.split(',').every((v) => parseFloat(v) === 0), `ingen overgang: ${rolig.varighet}`).toBe(true);
  // Kontroll for testen: uten redusert bevegelse beveger knappen seg, ellers sier testen over ingenting.
  const vanlig = await mål('no-preference');
  expect(vanlig.animasjoner, 'knappen dreies med en overgang uten redusert bevegelse').toBeGreaterThan(0);
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

// Beregnet: to kolonner fra 1000 px (ikke under), og ingen post krysser en kolonnekant.
for (const [bredde, kolonner] of [[999, 1], [1000, 2], [1280, 2]]) {
  test(`innholdsfortegnelsen har ${kolonner} kolonne(r) på ${bredde} px, og ingen post deles`, async ({ page }) => {
    await page.setViewportSize({ width: bredde, height: 900 });
    await page.goto(GUIDE);
    const m = await page.evaluate(() => {
      const ol = document.querySelector('.toc ol'), r = ol.getBoundingClientRect(), st = getComputedStyle(ol);
      const li = [...ol.children].map((e) => { const b = e.getBoundingClientRect(); return { x: Math.round(b.left), y: Math.round(b.top), b: Math.round(b.width), h: Math.round(b.height), avoid: getComputedStyle(e).breakInside }; });
      return { antall: li.length, bredde: r.width, kolonner: st.columnCount === 'auto' ? 1 : Number(st.columnCount), li };
    });
    expect(m.antall).toBeGreaterThanOrEqual(4);
    expect(m.kolonner).toBe(kolonner);
    expect(new Set(m.li.map((l) => l.x)).size, 'antall x-posisjoner').toBe(kolonner);
    if (kolonner === 2) {
      for (const l of m.li) { expect(l.avoid).toBe('avoid'); expect(l.b, 'en post er smalere enn halve listen').toBeLessThanOrEqual(m.bredde / 2); expect(l.h).toBeGreaterThanOrEqual(44); }
      // Radene fordeles: begge kolonner har poster, og første kolonne er minst like lang som den andre.
      const venstre = m.li.filter((l) => l.x === Math.min(...m.li.map((q) => q.x))).length;
      expect(venstre).toBeGreaterThanOrEqual(m.antall - venstre);
      expect(venstre).toBeLessThan(m.antall);
    }
  });
}

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

test('lange guider på 1280 px: prosa og FAQ har samme kolonne, og kortene flukter med helten (±1 px)', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/handleliste/');
  const boks = await page.evaluate(() => Object.fromEntries(['.locale-page-hero', '.locale-prose', '.faq', '.app-cta', '.page-cta'].map((v) => { const e = document.querySelector(v); const b = e?.getBoundingClientRect(); return [v, b ? { venstre: b.left, bredde: b.width } : null]; })));
  for (const [velger, b] of Object.entries(boks)) expect(b, `${velger} finnes ikke på guiden`).not.toBeNull();
  expect(Math.abs(boks['.faq'].venstre - boks['.locale-prose'].venstre), `FAQ ${boks['.faq'].venstre} mot prosa ${boks['.locale-prose'].venstre}`).toBeLessThanOrEqual(1);
  expect(Math.abs(boks['.faq'].bredde - boks['.locale-prose'].bredde), 'FAQ og prosa har ulik bredde').toBeLessThanOrEqual(1);
  // Kortene bryter bevisst ut av lesekolonnen og følger heltens venstrekant.
  for (const kort of ['.app-cta', '.page-cta']) expect(Math.abs(boks[kort].venstre - boks['.locale-page-hero'].venstre), `${kort} har ikke heltens venstrekant`).toBeLessThanOrEqual(1);
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
  for (const f of filmer) { expect(f.maks).toMatch(/^(300|200|124)px$|^min\(100%, 300px\)$/); expect(f.radius).toBe('24px'); expect(f.bredde).toBeLessThanOrEqual(300); }
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
  // Tallet i sirkelen er list-item-telleren. Beregnet innhold er bare uttrykket, så tallene måles som piksler:
  // hver sirkel sammenlignes med den samme sirkelen tegnet med tallet som bokstav.
  const steg = await page.evaluate(() => [...document.querySelectorAll('.locale-prose > ol > li')].map((li) => {
    const b = getComputedStyle(li, '::before');
    return { liste: getComputedStyle(li.parentElement).listStyleType, visning: getComputedStyle(li).display, innhold: b.content, bg: b.backgroundColor, radius: b.borderTopLeftRadius, w: b.width };
  }));
  expect(steg.length).toBeGreaterThanOrEqual(3);
  steg.forEach((s) => { expect(s.liste).toBe('none'); expect(s.visning).toBe('list-item'); expect(s.innhold).toBe('counter(list-item)'); expect(s.bg).toBe('rgb(20, 18, 16)'); expect(s.radius).toBe('50%'); expect(s.w).toBe('32px'); });
  const sirkler = async () => {
    const ut = [];
    for (let i = 0; i < 3; i++) {
      const li = page.locator('.locale-prose > ol > li').nth(i);
      await li.scrollIntoViewIfNeeded();
      const b = await li.boundingBox();
      ut.push((await page.screenshot({ clip: { x: b.x, y: b.y, width: 32, height: 32 } })).toString('base64'));
    }
    return ut;
  };
  const tegnMed = async (tall) => {
    const h = await page.addStyleTag({ content: tall.map((t, i) => `.locale-prose > ol:first-of-type > li:nth-child(${i + 1})::before{content:"${t}" !important}`).join('') });
    const ut = await sirkler();
    await h.evaluate((e) => e.remove());
    return ut;
  };
  const faktisk = await sirkler();
  expect(faktisk).toEqual(await tegnMed([1, 2, 3]));
  expect(faktisk[0]).not.toEqual(faktisk[1]);
  // ol[start] flytter tallene; reversed og li[value] gir en vanlig liste uten stegstil. Nettleseren leser attributtene ved innlasting, så siden lastes på nytt.
  const medAttributter = async (fra, til) => {
    await page.route('**/*', async (route) => {
      if (route.request().resourceType() !== 'document') return route.continue();
      const svar = await route.fetch();
      await route.fulfill({ response: svar, body: (await svar.text()).replace(fra, til) });
    });
    await page.goto(adresse(KORT.steg));
    await page.unroute('**/*');
  };
  await medAttributter('<section class="prose locale-prose"><h2>Slik gjør du det</h2><ol>', '<section class="prose locale-prose"><h2>Slik gjør du det</h2><ol start="5">');
  expect(await sirkler()).toEqual(await tegnMed([5, 6, 7]));
  await medAttributter('<section class="prose locale-prose"><h2>Slik gjør du det</h2><ol>', '<section class="prose locale-prose"><h2>Slik gjør du det</h2><ol reversed>');
  const utenSteg = () => page.evaluate(() => { const li = document.querySelector('.locale-prose > ol > li'); return { liste: getComputedStyle(li.parentElement).listStyleType, innhold: getComputedStyle(li, '::before').content }; });
  expect(await utenSteg()).toEqual({ liste: 'decimal', innhold: 'none' });
  await medAttributter(/<ol><li>/u, '<ol><li value="9">');
  expect(await utenSteg()).toEqual({ liste: 'decimal', innhold: 'none' });
  const pille = await page.evaluate(() => { const a = document.querySelector('.locale-prose > p > a[rel~="noopener"]:only-child'); if (!a) return null; const c = getComputedStyle(a); return { r: c.borderTopLeftRadius, d: c.display, h: a.getBoundingClientRect().height, u: c.textDecorationLine }; });
  expect(pille).not.toBeNull();
  expect(pille.r).toBe('999px'); expect(pille.d).toBe('inline-flex'); expect(pille.h).toBeGreaterThanOrEqual(48); expect(pille.u).toBe('none');
  await page.goto(adresse(KORT.middag));
  const ide = await page.evaluate(() => [...document.querySelectorAll('ul.ide-liste')].map((u) => ({ kol: getComputedStyle(u).gridTemplateColumns.split(' ').length, bg: getComputedStyle(u.firstElementChild).backgroundColor, radius: getComputedStyle(u.firstElementChild).borderTopLeftRadius, ut: u.scrollWidth - u.clientWidth })));
  expect(ide.length).toBeGreaterThan(0);
  for (const u of ide) { expect(u.kol).toBe(bredde >= 721 ? 2 : 1); expect(u.bg).toBe('rgb(245, 243, 239)'); expect(u.radius).toBe('24px'); expect(u.ut).toBeLessThanOrEqual(0); }
});

// Eldre sider: beregnet stil på de fire ekte sidene. Hver velger må treffe, ellers beviser regelteksten ingenting.
const GAMMEL = ['/importer-fra-matprat/', '/finn-oppskrifter/', '/hva-kan-jeg-lage/', '/skapere/'];
// Forventet antall per side. Et manglende element skal gi rødt, ikke en tom løkke eller et hoppet `if`.
const FORVENTET = {
  '/importer-fra-matprat/': { fig: 0, cta: 1, faq: 1, feat: 1, rel: 1, knapp: 1 },
  '/finn-oppskrifter/': { fig: 1, cta: 1, faq: 0, feat: 1, rel: 1, knapp: 1 },
  '/hva-kan-jeg-lage/': { fig: 0, cta: 1, faq: 0, feat: 1, rel: 1, knapp: 1 },
  '/skapere/': { fig: 0, cta: 0, faq: 1, feat: 0, rel: 0, knapp: 0 },
};
for (const bredde of [390, 1280]) for (const sti of GAMMEL) test(`eldre side ${sti}: topp, kort, kolonne og knapper har ny stil på ${bredde} px`, async ({ page }) => {
  await page.setViewportSize({ width: bredde, height: 900 });
  await page.goto(adresse(sti));
  const antall = await page.evaluate(() => ({ fig: document.querySelectorAll('main.prose figure').length, cta: document.querySelectorAll('.page-cta').length, faq: document.querySelectorAll('.faq').length, feat: document.querySelectorAll('.feat').length, rel: document.querySelectorAll('.related').length, knapp: document.querySelectorAll('.hero-actions > a.knapp').length }));
  expect(antall, `elementer på ${sti}`).toEqual(FORVENTET[sti]);
  const m = await page.evaluate(() => {
    const st = (e, p) => getComputedStyle(e)[p];
    const hero = document.querySelector('.hero');
    const h1 = hero.querySelector('h1');
    const feat = document.querySelector('.feat');
    const prose = document.querySelector('main.prose');
    const faq = document.querySelector('.faq');
    const cta = document.querySelector('.page-cta');
    const knapp = document.querySelector('.hero-actions > a.knapp');
    return {
      heroAlign: st(hero, 'textAlign'), h1Barn: h1.children.length, h1Lh: parseFloat(st(h1, 'lineHeight')) / parseFloat(st(h1, 'fontSize')), h1Rem: parseFloat(st(h1, 'fontSize')),
      heroBredde: hero.getBoundingClientRect().width,
      feat: feat && { r: st(feat, 'borderTopLeftRadius'), bg: st(feat, 'backgroundImage').includes('radial-gradient'), bg2: st(feat, 'backgroundColor'), kol: st(feat, 'gridTemplateColumns').split(' ').length, em: st(feat.querySelector('h2 em'), 'fontStyle') },
      prose: { w: prose.getBoundingClientRect().width, max: st(prose, 'maxWidth') },
      faqW: faq && faq.getBoundingClientRect().width, ctaR: cta && st(cta, 'borderTopLeftRadius'),
      knapp: knapp && { h: knapp.getBoundingClientRect().height, bg: st(knapp, 'backgroundColor') },
      vindu: innerWidth, kant: [...document.querySelectorAll('.faq, .page-cta, .related')].map((e) => e.getBoundingClientRect()).map((r) => [r.left, innerWidth - r.right]),
      cta: cta && { bg: st(cta, 'backgroundImage'), r: st(cta, 'borderTopLeftRadius'), pad: st(cta, 'paddingTop'), mt: parseFloat(st(cta, 'marginTop')), harH2: !!cta.querySelector('h2') },
      fig: [...document.querySelectorAll('main.prose figure')].map((f) => { const i = f.querySelector('img'); const r = i.getBoundingClientRect(); const fr = f.querySelector('figcaption').getBoundingClientRect(); return { w: r.width, r: st(i, 'borderTopLeftRadius'), mitt: Math.abs((r.left + r.right) / 2 - innerWidth / 2), under: fr.top >= r.bottom - 1 }; }),
      rel: [...document.querySelectorAll('.related')].map((x) => { const ul = x.querySelector('ul'); const a = x.querySelector('li a'); const li = x.querySelector('li'); return { align: st(x, 'textAlign'), disp: st(ul, 'display'), kol: st(ul, 'gridTemplateColumns').split(' ').length, bT: st(ul, 'borderTopWidth'), bB: st(li, 'borderBottomWidth'), vekt: st(a, 'fontWeight'), uline: st(a, 'textDecorationLine'), brad: st(a, 'borderTopLeftRadius'), bord: st(a, 'borderTopWidth'), ulBredde: ul.getBoundingClientRect().width, hoyde: a.getBoundingClientRect().height }; }),
    };
  });
  expect(m.heroAlign).toBe('center');
  expect(m.h1Barn, 'h1 er en tekstnode, ikke spans (spans gir overlapp i revisjonen ved normal linjeavstand)').toBe(0);
  expect(m.h1Lh).toBeCloseTo(1.05, 2);
  for (const f of m.fig) { expect(f.w).toBeLessThanOrEqual(300); expect(f.r).toBe('24px'); expect(f.mitt).toBeLessThan(2); expect(f.under).toBe(true); }
  for (const r of m.rel) { expect(r.align).not.toBe('center'); expect(r.disp).toBe('grid'); expect(r.kol).toBe(bredde >= 721 ? 2 : 1); expect(r.bT).toBe('1px'); expect(r.bB).toBe('1px'); expect(Number(r.vekt)).toBeGreaterThanOrEqual(700); expect(r.uline).toBe('underline'); expect(r.brad).toBe('0px'); expect(r.bord).toBe('0px'); expect(r.hoyde).toBeGreaterThanOrEqual(44); }
  if (m.cta) { expect(m.cta.harH2).toBe(false); expect(m.cta.bg).toBe('none'); expect(m.cta.r).toBe('0px'); expect(m.cta.pad).toBe('0px'); expect(m.cta.mt).toBeGreaterThanOrEqual(72); }
  expect(m.h1Rem).toBeGreaterThanOrEqual(bredde >= 1201 ? 62 : bredde >= 721 ? 46 : 38);
  expect(m.heroBredde).toBeLessThanOrEqual(m.vindu);
  expect(m.prose.max).not.toBe('none');
  expect(m.prose.w).toBeLessThanOrEqual(bredde);
  for (const [v, h] of m.kant) { expect(v).toBeGreaterThanOrEqual(16); expect(h).toBeGreaterThanOrEqual(16); }
  if (sti !== '/skapere/') {
    expect(m.feat.r).toBe(bredde >= 721 ? '40px' : '32px');
    expect(m.feat.bg).toBe(true);
    expect(m.feat.bg2).toBe('rgb(245, 243, 239)');
    // Regelen «alt får plass på en mobilskjerm»: teksten til venstre og telefonen til høyre også på mobil.
    expect(m.feat.kol).toBe(2);
    expect(m.feat.em).toBe('normal');
    expect(m.knapp.h).toBeGreaterThanOrEqual(44);
    expect(m.knapp.bg).toBe('rgb(20, 18, 16)');
  } else {
    expect(m.feat).toBeNull();
  }
});

test('eldre side: kortet ser ut som appkortet på en guide', async ({ page }) => {
  const kort = async (sti, velger) => { await page.goto(adresse(sti)); return page.evaluate((v) => { const e = document.querySelector(v); const c = getComputedStyle(e); return [c.backgroundImage, c.backgroundColor, c.borderTopLeftRadius]; }, velger); };
  const gammel = await kort('/finn-oppskrifter/', '.feat');
  const ny = await kort('/lagre-oppskrifter-fra-instagram/', '.i-appen');
  expect(gammel).toEqual(ny);
});

for (const bredde of [390, 1280]) test(`eldre side: forstørret tekst vokser i overskrift og tekst på ${bredde} px`, async ({ page }) => {
  await page.setViewportSize({ width: bredde, height: 900 });
  await page.goto(adresse('/finn-oppskrifter/'));
  const mål = () => page.evaluate(() => ['.hero h1', '.hero .lead', '.feat-text h2', 'main.prose h2', 'main.prose p'].map((v) => parseFloat(getComputedStyle(document.querySelector(v)).fontSize)));
  const for_ = await mål();
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  const etter = await mål();
  etter.forEach((x, i) => expect(x / for_[i]).toBeGreaterThanOrEqual(1.9));
});

// Samtykket: Godta lagrer granted, «Bare nødvendige» lagrer denied, og tilbaketrekking fra bunnen sletter valget så banneret kommer tilbake.
const LAGRING = 'matlyst-consent';
const lagret = (page) => page.evaluate((k) => localStorage.getItem(k), LAGRING);
async function utenFremmede(page) { await page.route((u) => !['127.0.0.1', 'localhost'].includes(u.hostname), (r) => r.abort()); }

test('eldre side: Godta lagrer granted, og tilbaketrekking fra bunnen sletter valget og viser banneret', async ({ page }) => {
  await utenFremmede(page);
  await page.goto(adresse('/finn-oppskrifter/'));
  await expect(page.locator('#cookie')).toBeVisible();
  expect(await lagret(page)).toBeNull();
  await page.locator('#ck-accept').click();
  await expect(page.locator('#cookie')).toBeHidden();
  expect(await lagret(page)).toBe('granted');
  await page.locator('footer.under [data-consent-withdraw]').click();
  await expect(page.locator('#cookie')).toBeVisible();
  expect(await lagret(page)).toBeNull();
});

test('eldre side: Bare nødvendige lagrer denied, og tilbaketrekking fra bunnen viser banneret igjen', async ({ page }) => {
  await utenFremmede(page);
  await page.goto(adresse('/finn-oppskrifter/'));
  await expect(page.locator('#cookie')).toBeVisible();
  await page.locator('#ck-reject').click();
  await expect(page.locator('#cookie')).toBeHidden();
  expect(await lagret(page)).toBe('denied');
  await page.goto(adresse('/finn-oppskrifter/'));
  await expect(page.locator('#cookie')).toBeHidden();
  await page.locator('footer.under [data-consent-withdraw]').click();
  await expect(page.locator('#cookie')).toBeVisible();
  expect(await lagret(page)).toBeNull();
});

// «Relaterte guider» er felles for alle sidetyper: en rolig liste, ikke piller. Lang tekst brytes i raden, ikke i en pille.
for (const bredde of [390, 1280]) for (const sti of ['/lagre-oppskrifter-fra-instagram/', '/importer-fra-koket/', '/finn-oppskrifter/', '/hva-kan-jeg-lage/']) test(`relaterte guider er en venstrejustert liste på ${sti} ved ${bredde} px`, async ({ page }) => {
  await page.setViewportSize({ width: bredde, height: 900 });
  await page.goto(adresse(sti));
  const r = await page.evaluate(() => { const x = document.querySelector('.related'); if (!x) return null; const ul = x.querySelector('ul'); const a = x.querySelector('li a'); const st = (e, p) => getComputedStyle(e)[p]; return { disp: st(ul, 'display'), kol: st(ul, 'gridTemplateColumns').split(' ').length, align: st(x, 'textAlign'), brad: st(a, 'borderTopLeftRadius'), vekt: st(a, 'fontWeight'), linje: st(x.querySelector('li'), 'borderBottomWidth'), venstre: a.getBoundingClientRect().left - ul.getBoundingClientRect().left }; });
  expect(r).not.toBeNull();
  expect(r).toMatchObject({ disp: 'grid', align: 'start', brad: '0px', vekt: '700', linje: '1px' });
  expect(r.kol).toBe(bredde >= 721 ? 2 : 1);
  expect(r.venstre).toBeLessThan(2);
});

// Bloggen: beregnet stil på ekte sider beviser at velgerne treffer.
const BLOGG = { indeks: '/blogg/', artikkel: '/blogg/koketider/', merknad: '/blogg/erstatte-egg/' };
for (const bredde of [390, 1280]) test(`bloggen: kort, forsidebilde, tabell, galleri, appkort og flere-rad treffer ekte sider på ${bredde} px`, async ({ page }) => {
  await page.setViewportSize({ width: bredde, height: 900 });
  await page.goto(adresse(BLOGG.indeks));
  const kort = await page.evaluate(() => {
    const ul = document.querySelector('ul.blogg-kort');
    const li = [...ul.children];
    const a = li[0].querySelector('a');
    return { antall: li.length, kol: getComputedStyle(ul).gridTemplateColumns.split(' ').length, bg: getComputedStyle(li[0]).backgroundColor, radius: getComputedStyle(li[0]).borderTopLeftRadius, klipp: getComputedStyle(li[0]).overflow, hoyde: a.getBoundingClientRect().height, bildeRadiusUte: getComputedStyle(li[0].querySelector('img')).borderTopLeftRadius, ut: document.documentElement.scrollWidth - document.documentElement.clientWidth };
  });
  expect(kort.antall).toBeGreaterThanOrEqual(8);
  expect(kort.kol).toBe(bredde >= 1001 ? 3 : 1);
  expect(kort.bg).toBe('rgb(245, 243, 239)'); expect(kort.radius).toBe('24px'); expect(kort.klipp).toBe('hidden');
  expect(kort.hoyde).toBeGreaterThanOrEqual(44); expect(kort.ut).toBeLessThanOrEqual(0);

  await page.goto(adresse(BLOGG.artikkel));
  const m = await page.evaluate(() => {
    const boks = (el) => { const r = el.getBoundingClientRect(); return { x: Math.round(r.left), w: Math.round(r.width) }; };
    const prose = document.querySelector('article.blogg-artikkel .locale-prose');
    const fig = document.querySelector('figure.blogg-forside');
    const tabell = prose.querySelector('table.blogg-tabell');
    const rad = document.querySelector('.blogg-galleri-rad');
    const cta = document.querySelector('.app-cta');
    const knapp = cta.querySelector('a[data-hent="app-cta"]');
    const flere = document.querySelector('.blogg-flere li a');
    const tdSist = tabell.querySelector('tr td:last-child');
    return {
      prose: boks(prose), fig: boks(fig), tabell: boks(tabell),
      figRadius: getComputedStyle(fig.querySelector('img')).borderTopLeftRadius,
      tabellStrek: getComputedStyle(tabell.querySelector('tbody th')).borderBottomStyle, tdAlign: getComputedStyle(tdSist).textAlign, tdVekt: getComputedStyle(tdSist).fontWeight,
      radOverflow: getComputedStyle(rad).overflowX, radSnap: getComputedStyle(rad).scrollSnapType, radBredere: rad.scrollWidth > rad.clientWidth, radFokus: rad.tabIndex, radBilde: getComputedStyle(rad.querySelector('img')).borderTopLeftRadius,
      ctaKol: getComputedStyle(cta).gridTemplateColumns.split(' ').length, ctaRadius: getComputedStyle(cta).borderTopLeftRadius,
      bildeX: cta.querySelector('.app-cta-bilde').getBoundingClientRect().left > cta.querySelector('.app-cta-tekst h2').getBoundingClientRect().left + 100,
      knappH: knapp.getBoundingClientRect().height, knappKlasse: knapp.className,
      flereRadius: getComputedStyle(flere).borderTopLeftRadius, flereDisplay: getComputedStyle(flere).display, flereKant: getComputedStyle(flere).borderBottomWidth,
      ut: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  expect(m.fig).toEqual(m.prose); expect(m.tabell).toEqual(m.prose);
  expect(m.figRadius).toBe('24px'); expect(m.tabellStrek).toBe('solid'); expect(m.tdAlign).toBe('right'); expect(m.tdVekt).toBe('700');
  expect(m.radOverflow).toBe('auto'); expect(m.radSnap).toContain('mandatory'); expect(m.radFokus).toBe(0); expect(m.radBilde).toBe('24px');
  expect(m.radBredere).toBe(bredde < 721);
  expect(m.ctaKol).toBe(2); expect(m.ctaRadius).toBe(bredde >= 721 ? '40px' : '32px'); expect(m.bildeX).toBe(true);
  expect(m.knappH).toBeGreaterThanOrEqual(44); expect(m.knappKlasse).toContain('knapp');
  if (bredde >= 721) { expect(m.flereRadius).toBe('999px'); expect(m.flereKant).toBe('1px'); } else { expect(m.flereRadius).toBe('0px'); expect(m.flereDisplay).toBe('flex'); }
  expect(m.ut).toBeLessThanOrEqual(0);

  await page.goto(adresse(BLOGG.merknad));
  const merknad = await page.evaluate(() => { const s = document.querySelector('.locale-prose td .merknad'); const c = getComputedStyle(s); return { s: c.fontSize, v: c.fontWeight, f: c.color }; });
  expect(merknad).toEqual({ s: '15px', v: '400', f: 'rgb(95, 89, 82)' });
});

// Juridiske sider: beregnet stil på ekte sider beviser at velgerne treffer. Tallene i forventningene er
// antall elementer i selve dokumentene; et manglende element gir rødt før stilen sjekkes.
const JUSS = [
  { sti: '/personvern.html', main: 'main.doc', kicker: '.doc-kicker', tittel: 'h1.doc-title', dato: '.doc-updated', ingress: '.doc-intro', kort: '.callout', kortAntall: 2, lister: 14 },
  { sti: '/vilkar.html', main: 'main.doc', kicker: '.doc-kicker', tittel: 'h1.doc-title', dato: '.doc-updated', ingress: '.doc-intro', kort: '.callout', kortAntall: 1, lister: 2 },
  { sti: '/slett-konto.html', main: 'main.doc', kicker: '.doc-kicker', tittel: 'h1.doc-title', dato: '.doc-updated', ingress: '.doc-intro', kort: '.callout', kortAntall: 1, lister: 1 },
  { sti: '/sv/integritet/', main: 'main.legal-doc', kicker: 'header .eyebrow', tittel: 'header h1', dato: '.legal-updated', ingress: 'header .lead', kort: '.legal-callout', kortAntall: 1, lister: 3 },
  { sti: '/da/privatliv/', main: 'main.legal-doc', kicker: 'header .eyebrow', tittel: 'header h1', dato: '.legal-updated', ingress: 'header .lead', kort: '.legal-callout', kortAntall: 1, lister: 3 },
  { sti: '/en/privacy/', main: 'main.legal-doc', kicker: 'header .eyebrow', tittel: 'header h1', dato: '.legal-updated', ingress: 'header .lead', kort: '.legal-callout', kortAntall: 1, lister: 7 },
];
for (const bredde of [390, 1280]) for (const j of JUSS) test(`juss: ${j.sti} har lesekolonne, dempet overlinje og dato, ett kort og rolige lister på ${bredde} px`, async ({ page }) => {
  await page.setViewportSize({ width: bredde, height: 900 });
  await page.goto(adresse(j.sti));
  const antall = await page.evaluate((j) => ({
    main: document.querySelectorAll(j.main).length, kicker: document.querySelectorAll(j.main + ' ' + j.kicker).length, tittel: document.querySelectorAll(j.main + ' ' + j.tittel).length,
    dato: document.querySelectorAll(j.main + ' ' + j.dato).length, ingress: document.querySelectorAll(j.main + ' ' + j.ingress).length,
    kort: document.querySelectorAll(j.main + ' ' + j.kort).length, lister: document.querySelectorAll(j.main + ' ul:not([class])').length,
  }), j);
  expect(antall).toEqual({ main: 1, kicker: 1, tittel: 1, dato: 1, ingress: 1, kort: j.kortAntall, lister: j.lister });
  const m = await page.evaluate((j) => {
    const h = (sel) => document.querySelector(j.main + ' ' + sel);
    const c = (el) => getComputedStyle(el);
    const main = document.querySelector(j.main);
    const r = main.getBoundingClientRect();
    const kort = h(j.kort);
    const li = h('ul:not([class]) li');
    const piller = [...document.querySelectorAll(j.main + ' li a, ' + j.main + ' ul a')].filter((a) => c(a).borderTopLeftRadius === '999px' || c(a).borderTopWidth !== '0px');
    const h2 = document.querySelector(j.main + ' > h2, ' + j.main + ' > section > h2');
    return {
      sidetype: document.body.dataset.sidetype, bredde: Math.round(r.width), venstre: Math.round(r.left), hoyre: Math.round(document.documentElement.clientWidth - r.right),
      fontMain: c(main).fontSize, linjeMain: c(main).lineHeight,
      margKicker: c(h(j.kicker)).marginTop, margIngress: c(h(j.ingress)).marginTop, margDato: c(h(j.dato)).marginTop,
      kicker: { f: c(h(j.kicker)).color, s: c(h(j.kicker)).fontSize, v: c(h(j.kicker)).fontWeight }, dato: { f: c(h(j.dato)).color, s: c(h(j.dato)).fontSize },
      ingress: { f: c(h(j.ingress)).color, s: c(h(j.ingress)).fontSize }, tittel: c(h(j.tittel)).fontSize, tittelLinje: c(h(j.tittel)).lineHeight, tittelMarg: c(h(j.tittel)).marginTop,
      kort: { bg: c(kort).backgroundColor, radius: c(kort).borderTopLeftRadius },
      kortH2: kort.querySelector('h2') ? c(kort.querySelector('h2')).marginTop : '0px', h2: c(h2).fontSize, punkt: getComputedStyle(li, '::before').borderTopLeftRadius, listeStil: c(li.parentElement).listStyleType,
      piller: piller.length, ut: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      lenkeStrek: c(h('p a')).textDecorationLine,
      andreKort: [...document.querySelectorAll(j.main + ' *')].filter((e) => !e.matches(j.kort) && c(e).backgroundColor !== 'rgba(0, 0, 0, 0)' && !e.closest(j.kort)).length,
    };
  }, j);
  expect(m.sidetype).toBe('juss');
  expect(m.bredde).toBeLessThanOrEqual(bredde >= 1001 ? 860 : bredde);
  if (bredde >= 1001) expect(Math.abs(m.venstre - m.hoyre)).toBeLessThanOrEqual(1);
  expect(m.fontMain).toBe('19px');
  expect([m.margKicker, m.margIngress, m.margDato]).toEqual(['0px', '18px', '14px']);
  expect(m.kicker).toEqual({ f: 'rgb(95, 89, 82)', s: '15px', v: '500' });
  expect(m.dato).toEqual({ f: 'rgb(95, 89, 82)', s: '15px' });
  expect(m.ingress).toEqual({ f: 'rgb(95, 89, 82)', s: '20px' });
  expect(m.tittel).toBe(bredde >= 721 ? '38px' : '32px');
  expect(m.tittelLinje).toBe(bredde >= 721 ? '39.9px' : '33.6px'); expect(m.tittelMarg).toBe('6px');
  expect(m.kort).toEqual({ bg: 'rgb(245, 243, 239)', radius: '28px' });
  expect(m.kortH2).toBe('0px'); expect(m.h2).toBe('26px'); expect(m.punkt).toBe('50%'); expect(m.listeStil).toBe('none');
  expect(m.piller).toBe(0); expect(m.andreKort).toBe(0); expect(m.lenkeStrek).toContain('underline');
  expect(m.ut).toBeLessThanOrEqual(0);
});

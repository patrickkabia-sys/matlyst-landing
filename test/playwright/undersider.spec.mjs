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

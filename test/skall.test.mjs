import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { effektiv } from './hjelp/knappevekt.mjs';
import { topp, hylledel, morkBunn, nedlasting, samtykke, sprakvelger } from '../scripts/skall.mjs';

const rot = fileURLToPath(new URL('..', import.meta.url));
const lenker = (html) => [...html.matchAll(/<a href="([^"]+)"[^>]*><span>([^<]+)<\/span><\/a>/g)].map(([, href, tekst]) => `${tekst}|${href}`);

test('menyen og bunnen har nøyaktig de samme hyllene og lenkene', () => {
  const meny = topp('nb', { sprakvelger: '' }), bunn = hylledel('nb');
  assert.ok(lenker(bunn).length > 20);
  assert.deepEqual(lenker(bunn), lenker(meny.match(/<nav class="panel"[\s\S]*?<\/nav>/)[0]));
});

test('skallet har ingen døde lenker', () => {
  for (const del of [topp('nb', { sprakvelger: '' }), hylledel('nb'), morkBunn('nb', { sprakvelger: '' })]) assert.doesNotMatch(del.replace(/<a [^>]*data-consent-withdraw[^>]*>[\s\S]*?<\/a>/g, ''), /href="#"/);
});

test('alle nedlastingsknapper går til /app og sier hvor de står', () => {
  const alle = topp('nb', { sprakvelger: '' }) + hylledel('nb') + nedlasting('nb');
  const knapper = [...alle.matchAll(/<a [^>]*data-hent="([^"]*)"[^>]*>/g)];
  assert.deepEqual(knapper.map((k) => k[1]), ['topp', 'bunn', 'fast']);
  for (const [tagg] of knapper) assert.match(tagg, /href="\/app"/);
});

test('språkvelgeren følger mønsteret de andre sidene bruker', () => {
  const sider = { nb: '/', sv: '/sv/', da: '/da/', en: '/en/' };
  const html = sprakvelger('nb', 'bunn', sider);
  assert.match(html, /^<!-- språkvelger:bunn --><span class="language-switcher language-switcher-bottom" role="navigation" aria-label="Språk">/);
  assert.match(html, /href="\/" lang="nb"[^>]*aria-current="page"/);
  for (const [kode, href] of Object.entries(sider)) assert.equal(html.split(`href="${href}" lang="${kode}"`).length - 1, 1);
});

test('samtykkebanneret har begge knappene, og bunnen har lenka som trekker samtykket', () => {
  assert.match(samtykke('nb'), /id="cookie"[\s\S]*class="ck-btn ck-accept"[^>]*>Godta<[\s\S]*class="ck-btn ck-reject"[^>]*>Bare nødvendige</);
  assert.match(morkBunn('nb', { sprakvelger: '' }), /<a href="#" data-consent-withdraw>Informasjonskapsler<\/a>/);
});

test('den mørke bunnen har flagg, e-post og ordmerke', () => {
  const html = morkBunn('nb', { sprakvelger: '' });
  assert.match(html, /© 2026 Matlyst\. Laget i Norge/);
  assert.match(html, /aria-label="Norsk flagg"/);
  assert.match(html, /hei@matlyst-app\.no/);
  assert.match(html, /class="[^"]*ordmerke[^"]*"[^>]*>mat<em>lyst<\/em>/);
});

test('samtykkeknappene veier likt i skall.css', () => {
  const css = readFileSync(join(rot, 'skall.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  assert.ok(Object.keys(effektiv(css, 'ck-accept')).length > 0);
  for (const tilstand of [undefined, 'hover', 'focus-visible']) {
    assert.deepEqual(effektiv(css, 'ck-accept', tilstand), effektiv(css, 'ck-reject', tilstand));
  }
});

test('hylledelen er et tilgjengelig nedlastingsmål også uten JavaScript', () => {
  const html = hylledel('nb');
  assert.match(html, /<section class="bunn" id="last-ned" aria-label="Alt på Matlyst">/);
  assert.doesNotMatch(html, /<button|\shidden(?:[\s>])|aria-expanded="false"/);
  assert.equal((html.match(/class="fag aapen"/g) || []).length, 6);
});

test('følgemenyen er valgfri og tar tekst og lenker fra siden', () => {
  assert.doesNotMatch(topp('nb', { sprakvelger: '' }), /id="folg"/);
  const html = topp('nb', { sprakvelger: '', folg: [{ href: '/guide/#steg', tekst: 'Tips & råd' }] });
  assert.match(html, /<nav class="folg" id="folg" aria-label="På denne siden"><i class="folgmerke" aria-hidden="true"><\/i><a href="\/guide\/#steg">Tips &amp; råd<\/a>/);
  assert.doesNotMatch(html, /aria-current="page"/);
});

test('skallet beholder de to språkvelgerne og samtykketeksten fra dagens side', () => {
  const index = readFileSync(join(rot, 'index.html'), 'utf8');
  const sider = { nb: '/', sv: '/sv/', da: '/da/', en: '/en/' };
  for (const plass of ['topp', 'bunn']) {
    const dagens = index.match(new RegExp(`<!-- språkvelger:${plass} -->[\\s\\S]*?<!-- /språkvelger:${plass} -->`))[0];
    assert.equal(sprakvelger('nb', plass, sider), dagens);
  }
  assert.equal(samtykke('nb'), index.match(/<div class="cookie" id="cookie" hidden>[\s\S]*?<\/div>\s*<\/div>/)[0]);
});

test('alle skallbilder har mål og alternativtekst, og bildene under toppen lastes sent', () => {
  for (const [html, sent] of [[topp('nb', { sprakvelger: '' }), false], [hylledel('nb'), true], [nedlasting('nb'), true]]) {
    const bilder = [...html.matchAll(/<img\b[^>]*>/g)];
    assert.ok(bilder.length);
    for (const [bilde] of bilder) {
      assert.match(bilde, /width="\d+"/); assert.match(bilde, /height="\d+"/); assert.match(bilde, /alt="[^"]*"/);
      if (sent) assert.match(bilde, /loading="lazy"/);
    }
  }
  assert.match(nedlasting('nb'), /src="\/images\/forside\/qr-app.svg" width="176" height="176" alt="QR-kode til matlyst-app.no\/app"/);
});

// Nettleseren kjører det ekte skallet. Lokale filer serveres uten nettverkstilgang.
import { after } from 'node:test';
import { chromium } from '@playwright/test';
let nettleser;
after(async () => nettleser?.close());
const sideHtml = (innhold = '<main style="height:1400px"><a class="knapp" href="/app" data-hent="innhold">Last ned gratis</a></main>') => {
  const sider = { nb: '/', sv: '/sv/', da: '/da/', en: '/en/' };
  return `<!doctype html><html lang="nb"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/tokens.css"><link rel="stylesheet" href="/skall.css"><link rel="stylesheet" href="/language-switcher.css"><body><div class="side"><div class="kort"><div class="blad">${topp('nb', { sprakvelger: sprakvelger('nb', 'topp', sider) })}${innhold}</div>${hylledel('nb')}</div>${morkBunn('nb', { sprakvelger: sprakvelger('nb', 'bunn', sider) })}${nedlasting('nb')}${samtykke('nb')}</div><script src="/skall.js"></script></body></html>`;
};
async function prove(t, { html = sideHtml(), ...valg } = {}) {
  nettleser ??= await chromium.launch();
  const kontekst = await nettleser.newContext({ viewport: { width: 1280, height: 800 }, ...valg });
  t.after(() => kontekst.close());
  const side = await kontekst.newPage();
  const feil = [], foresporsler = [];
  side.on('pageerror', (e) => feil.push(e.message));
  side.on('console', (m) => { if (m.type() === 'error') feil.push(m.text()); });
  await side.route('**/*', async (rute) => {
    const url = new URL(rute.request().url());
    foresporsler.push(url.pathname);
    assert.equal(url.origin, 'http://skall.test');
    if (url.pathname === '/') return rute.fulfill({ contentType: 'text/html', body: html });
    if (url.pathname === '/app') return rute.fulfill({ contentType: 'text/html', body: 'App' });
    const typer = { css: 'text/css', js: 'text/javascript', webp: 'image/webp', svg: 'image/svg+xml', woff2: 'font/woff2' };
    await rute.fulfill({ contentType: typer[url.pathname.split('.').pop()], body: readFileSync(join(rot, url.pathname)) });
  });
  await side.clock.install();
  await side.goto('http://skall.test/');
  await side.evaluate(() => document.fonts.ready);
  return { side, feil, foresporsler };
}

test('menyen lukkes med Escape og mobilhyllene virker etter breddebytte', async (t) => {
  const { side } = await prove(t, { viewport: { width: 390, height: 760 } });
  await side.locator('#menyknapp').click();
  assert.equal(await side.locator('#panel').isVisible(), true);
  await side.locator('#panel .fagknapp').nth(0).click();
  assert.equal(await side.locator('#panel .fagknapp').nth(0).getAttribute('aria-expanded'), 'true');
  await side.locator('#panel .fagknapp').nth(1).click();
  assert.equal(await side.locator('#panel .fagknapp').nth(0).getAttribute('aria-expanded'), 'false');
  await side.locator('#panel .fag').nth(1).locator('a').first().focus();
  await side.keyboard.press('Escape');
  assert.equal(await side.locator('#panel').isVisible(), false);
  assert.equal(await side.locator('#menyknapp').evaluate((e) => e === document.activeElement), true);
  await side.locator('#menyknapp').click();
  await side.locator('main').click({ position: { x: 5, y: 700 } });
  assert.equal(await side.locator('#panel').isVisible(), false);
  const bunn = side.locator('#bunnreol .fagknapp').first();
  assert.equal(await bunn.getAttribute('aria-expanded'), 'false');
  await bunn.click();
  assert.equal(await bunn.getAttribute('aria-expanded'), 'true');
  await side.setViewportSize({ width: 1280, height: 800 });
  await side.waitForFunction(() => !document.querySelector('#bunnreol button'));
  assert.equal(await side.locator('#bunnreol ul:visible').count(), 6);
  await side.setViewportSize({ width: 390, height: 760 });
  await side.waitForFunction(() => document.querySelector('#bunnreol button'));
  assert.equal(await bunn.getAttribute('aria-expanded'), 'false');
});

test('QR åpnes bare på PC og lenka virker med berøring og uten showModal', async (t) => {
  const { side } = await prove(t, { reducedMotion: 'reduce' });
  await side.locator('[data-hent="topp"]').click();
  assert.equal(await side.locator('#hent').evaluate((e) => e.open), true);
  const luft = await side.locator('.qr').evaluate((e) => {
    const s = getComputedStyle(e); return [s.paddingTop, s.paddingRight, s.paddingBottom, s.paddingLeft].map(parseFloat);
  });
  assert.ok(luft.every((n) => n >= 16));
  assert.equal(await side.locator('.qr img').evaluate((e) => e.getBoundingClientRect().width), 176);
  await side.keyboard.press('Escape');
  assert.equal(await side.locator('#hent').evaluate((e) => e.open), false);
  assert.equal(await side.locator('[data-hent="topp"]').evaluate((e) => e === document.activeElement), true);
  await side.evaluate(() => { document.querySelector('#hent').showModal = undefined; });
  await side.locator('[data-hent="topp"]').click();
  assert.equal(new URL(side.url()).pathname, '/app');
  const mobil = await prove(t, { hasTouch: true });
  await mobil.side.locator('[data-hent="topp"]').click();
  assert.equal(new URL(mobil.side.url()).pathname, '/app');
});

test('fast knapp følger innholdsknappen og bruker 600 px når den mangler', async (t) => {
  for (const utenKnapp of [false, true]) {
    const { side } = await prove(t, { viewport: { width: 390, height: 760 }, ...(utenKnapp ? { html: sideHtml('<main style="height:2400px"></main>') } : {}) });
    const synlig = () => side.locator('#fast').evaluate((e) => e.classList.contains('vis') && !e.inert);
    assert.equal(await synlig(), false);
    await side.evaluate((y) => new Promise((ferdig) => { addEventListener('scroll', ferdig, { once: true }); scrollTo(0, y); }), utenKnapp ? 599 : 300);
    await side.clock.runFor(32);
    assert.equal(await synlig(), !utenKnapp);
    if (utenKnapp) {
      await side.evaluate(() => new Promise((ferdig) => { addEventListener('scroll', ferdig, { once: true }); scrollTo(0, 600); })); await side.clock.runFor(32);
      assert.equal(await synlig(), true);
    }
    await side.locator('.bunnrad [data-hent]').scrollIntoViewIfNeeded();
    await side.waitForFunction(() => !document.querySelector('#fast').classList.contains('vis'), null, { timeout: 1500 });
    assert.equal(await synlig(), false);
  }
});

test('logoen venter 1800 ms, går i loop og står stille ved redusert bevegelse', async (t) => {
  const { side, foresporsler } = await prove(t);
  const logo = side.locator('#merke img').first();
  const forst = await logo.getAttribute('src');
  await side.locator('#merke').hover();
  await side.clock.runFor(1700);
  assert.equal(foresporsler.includes('/images/forside/logo/01.webp'), false);
  assert.equal(await logo.getAttribute('src'), forst);
  await side.mouse.move(500, 500);
  await side.clock.runFor(3300);
  await side.waitForFunction(() => document.querySelector('#merke img').getAttribute('src') !== '/images/forside/logo/14.webp');
  assert.equal(foresporsler.includes('/images/forside/logo/40.webp'), true);
  const rolig = await prove(t, { reducedMotion: 'reduce' });
  await rolig.side.locator('#merke').hover();
  await rolig.side.clock.runFor(10000);
  assert.equal(await rolig.side.locator('#merke img').first().getAttribute('src'), forst);
  assert.equal(rolig.foresporsler.includes('/images/forside/logo/01.webp'), false);
});

test('skallet tåler manglende deler og bunnhyllene er åpne uten JavaScript', async (t) => {
  for (const html of ['<!doctype html><script src="/skall.js"></script>', sideHtml().replace(/<nav class="panel"[\s\S]*?<\/nav>/, '').replace(/<dialog[\s\S]*?<\/dialog>/, '').replace(/<div class="fast"[\s\S]*?<\/div>/, '')]) {
    const { side, feil } = await prove(t, { html });
    await side.clock.runFor(6000);
    assert.deepEqual(feil, []);
  }
  const { side } = await prove(t, { javaScriptEnabled: false, viewport: { width: 390, height: 760 } });
  assert.equal(await side.locator('#bunnreol ul:visible').count(), 6);
  await side.locator('[data-hent="topp"]').click();
  assert.equal(new URL(side.url()).pathname, '/app');
});

test('skallet har ingen sideveis rulling, små trykkflater eller konsollfeil', async (t) => {
  const { side, feil } = await prove(t);
  assert.equal(await side.locator('[aria-current="page"]').count(), 2);
  assert.equal(await side.locator('.under .language-switcher [aria-current]').evaluate((e) => getComputedStyle(e).color), 'rgb(233, 229, 222)');
  assert.equal(await side.locator('.under .language-switcher [aria-current]').evaluate((e) => getComputedStyle(e).boxShadow), 'none');
  for (const bredde of [360, 390, 768, 1280]) {
    await side.setViewportSize({ width: bredde, height: 800 });
    await side.locator('#menyknapp').click();
    await side.evaluate(() => { document.querySelector('#cookie').hidden = false; });
    assert.equal(await side.evaluate(() => document.documentElement.scrollWidth - innerWidth), 0, `${bredde} px`);
    const smaa = await side.locator('a:visible, button:visible').evaluateAll((elementer) => elementer.filter((e) => !e.closest('[inert]') && (e.getBoundingClientRect().height < 44 || e.getBoundingClientRect().width < 44)).map((e) => e.outerHTML));
    assert.deepEqual(smaa, [], `${bredde} px: små trykkflater`);
    await side.keyboard.press('Escape');
    await side.evaluate(() => { document.querySelector('#cookie').hidden = true; });
  }
  assert.deepEqual(feil, []);
});


test('skallet uten samtykkebanner legger ikke til overskrifter', () => {
  const html = topp('nb', { sprakvelger: '' }) + hylledel('nb') + morkBunn('nb', { sprakvelger: '' }) + nedlasting('nb');
  assert.doesNotMatch(html, /<h[1-6]\b/i);
});

test('hyllene har avsnitt som navn og navngitte lenkelister i meny og bunn', () => {
  const navn = ['Appen', 'Lagre oppskrifter', 'Middag', 'Verktøy', 'Kjøkkentips', 'Matlyst'];
  for (const [html, meny] of [[topp('nb'), true], [hylledel('nb'), false]]) {
    const hyller = [...html.matchAll(/<p class="faghode">([\s\S]*?)<\/p><ul aria-label="([^"]+)">/g)];
    assert.deepEqual(hyller.map(([, , label]) => label), navn);
    for (const [, hode, label] of hyller) {
      assert.ok(hode.includes(`<span>${label}</span>`));
      assert.doesNotMatch(hode, /<div\b/);
      if (meny) assert.match(hode, /<button type="button" class="fagknapp" aria-expanded="true">/);
    }
  }
});

test('QR-tittelen navngir dialogen og beholder typografien som avsnitt', async (t) => {
  const { side } = await prove(t, { reducedMotion: 'reduce' });
  await side.locator('[data-hent="topp"]').click();
  assert.equal(await side.getByRole('dialog', { name: 'Skann med telefonen', exact: true }).count(), 1);
  assert.equal(await side.locator('p.henttittel#hentTittel').count(), 1);
  const stil = await side.locator('#hentTittel').evaluate((e) => {
    const s = getComputedStyle(e);
    return [s.marginTop, s.marginBottom, s.fontSize, s.fontWeight, s.lineHeight, s.letterSpacing, s.textWrap, s.color];
  });
  assert.deepEqual(stil, ['24px', '0px', '26px', '700', '29.9px', '-0.728px', 'balance', 'rgb(20, 18, 16)']);
});

test('juridiske lenker ligger i navigasjonen Juridisk', async (t) => {
  const { side } = await prove(t);
  assert.deepEqual(await side.getByRole('navigation', { name: 'Juridisk', exact: true }).locator('a').allTextContents(), ['Personvern', 'Vilkår', 'Informasjonskapsler']);
});

test('Tab går fra menyknappen til panelet før Last ned', async (t) => {
  for (const width of [390, 1280]) {
    const { side } = await prove(t, { viewport: { width, height: 800 }, reducedMotion: 'reduce' });
    await side.locator('#menyknapp').focus();
    await side.keyboard.press('Enter');
    await side.keyboard.press('Tab');
    assert.equal(await side.locator('#panel').evaluate((e) => e.contains(document.activeElement)), true);
    assert.equal(await side.locator('#panel').isVisible(), true);
  }
});

test('menyen lukkes når fokus forlater knappen og panelet', async (t) => {
  const { side } = await prove(t, { reducedMotion: 'reduce' });
  await side.locator('#menyknapp').focus();
  await side.keyboard.press('Enter');
  await side.locator('#panel a').first().focus();
  await side.keyboard.press('Shift+Tab');
  assert.equal(await side.locator('#menyknapp').evaluate((e) => e === document.activeElement), true);
  assert.equal(await side.locator('#panel').isVisible(), true);
  await side.keyboard.press('Shift+Tab');
  assert.equal(await side.locator('#panel').isVisible(), false);
  await side.locator('#menyknapp').click();
  await side.locator('#panel a').last().focus();
  await side.keyboard.press('Tab');
  assert.equal(await side.locator('[data-hent="topp"]').evaluate((e) => e === document.activeElement), true);
  assert.equal(await side.locator('#panel').isVisible(), false);
});

test('klikk utenfor lukker menyen også når fokus blir på menyknappen', async (t) => {
  const { side } = await prove(t, { reducedMotion: 'reduce' });
  // Hindrer bare nettleserens fokusflytting, slik at klikkvakten prøves alene.
  await side.locator('main').evaluate((e) => e.addEventListener('mousedown', (hendelse) => hendelse.preventDefault()));
  await side.locator('#menyknapp').focus();
  await side.keyboard.press('Enter');
  await side.locator('main').click({ position: { x: 5, y: 700 } });
  assert.equal(await side.locator('#menyknapp').evaluate((e) => e === document.activeElement), true);
  assert.equal(await side.locator('#panel').isVisible(), false);
});

test('hylleoverskriften beholder fokus begge veier over 721 px', async (t) => {
  for (const velger of ['#panel', '#bunnreol']) {
    const { side } = await prove(t, { viewport: { width: 720, height: 800 }, reducedMotion: 'reduce' });
    if (velger === '#panel') await side.locator('#menyknapp').click();
    const hode = side.locator(`${velger} .fagknapp`).first();
    await hode.focus();
    for (const width of [721, 720]) {
      await side.setViewportSize({ width, height: 800 });
      await side.waitForFunction(({ velger, tagg }) => (document.querySelector(`${velger} .fagknapp`).tagName === 'BUTTON') === (tagg === 'BUTTON'), { velger, tagg: width === 721 ? 'SPAN' : 'BUTTON' });
      assert.equal(await hode.evaluate((e) => e === document.activeElement), true, `${velger}, ${width} px`);
      assert.equal(await side.locator(`${velger} p.faghode > ${width === 721 ? 'span' : 'button'}.fagknapp`).count(), 6);
      assert.equal(await side.locator(`${velger} .faghode div`).count(), 0);
      if (velger === '#panel') assert.equal(await side.locator('#panel').isVisible(), true);
    }
  }
});

// WCAG-kontrast mot den faktiske flaten, også når lenkebakgrunnen er gjennomsiktig.
async function sprakstil(lenke) {
  return lenke.evaluate((e) => {
    const stil = getComputedStyle(e);
    const rgb = (farge) => farge.match(/[\d.]+/g).map(Number);
    let flate = [255, 255, 255];
    const forfedre = [];
    for (let node = e; node; node = node.parentElement) forfedre.unshift(node);
    for (const node of forfedre) {
      const [r, g, b, alfa = 1] = rgb(getComputedStyle(node).backgroundColor);
      flate = [r, g, b].map((kanal, i) => kanal * alfa + flate[i] * (1 - alfa));
    }
    const luminans = (farge) => farge.map((v) => v / 255).map((v) => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
    const tekstLys = luminans(rgb(stil.color)), flateLys = luminans(flate);
    return { farge: stil.color, bakgrunn: stil.backgroundColor, skygge: stil.boxShadow, omriss: stil.outlineColor, kontrast: (Math.max(tekstLys, flateLys) + .05) / (Math.min(tekstLys, flateLys) + .05) };
  });
}

for (const [sted, velger] of [['menyen', '#panel'], ['bunnen', '.under']]) {
  test(`språkvelgeren i ${sted} har skallfarger og lesbar kontrast i alle tilstander`, async (t) => {
    for (const width of [390, 1280]) for (const omvendt of [false, true]) {
      const html = omvendt ? sideHtml().replace('<link rel="stylesheet" href="/skall.css"><link rel="stylesheet" href="/language-switcher.css">', '<link rel="stylesheet" href="/language-switcher.css"><link rel="stylesheet" href="/skall.css">') : sideHtml();
      const { side } = await prove(t, { html, viewport: { width, height: 800 }, reducedMotion: 'reduce' });
      if (sted === 'menyen') await side.locator('#menyknapp').click();
      for (const sprak of ['sv', 'nb']) for (const tilstand of ['vanlig', 'hover', 'focus-visible']) {
        const lenke = side.locator(`${velger} .language-switcher a[lang="${sprak}"]`);
        await side.mouse.move(0, 0);
        if (sted === 'menyen') await side.locator('#menyknapp').focus();
        else await side.evaluate(() => document.activeElement?.blur());
        if (tilstand === 'hover') await lenke.hover();
        if (tilstand === 'focus-visible') {
          await side.keyboard.press('Tab');
          if (sted === 'menyen' && !await side.locator('#panel').isVisible()) await side.locator('#menyknapp').press('Enter');
          await lenke.focus();
          assert.equal(await lenke.evaluate((e) => e.matches(':focus-visible')), true);
        }
        const stil = await sprakstil(lenke);
        const aktiv = sprak === 'nb', meny = sted === 'menyen';
        const farge = meny ? (aktiv ? 'rgb(255, 255, 255)' : 'rgb(20, 18, 16)') : 'rgb(233, 229, 222)';
        const bakgrunn = meny ? (aktiv ? 'rgb(20, 18, 16)' : 'rgb(255, 255, 255)') : (tilstand === 'vanlig' ? 'rgba(0, 0, 0, 0)' : 'rgb(20, 18, 16)');
        const melding = `${sted}, ${width} px, omvendt=${omvendt}, ${sprak}, ${tilstand}`;
        assert.ok(stil.kontrast >= 4.5, `${melding}: kontrast ${stil.kontrast}`);
        assert.equal(stil.farge, farge, melding);
        assert.equal(stil.bakgrunn, bakgrunn, melding);
        assert.equal(stil.skygge, 'none', melding);
        if (tilstand === 'focus-visible') assert.equal(stil.omriss, meny ? 'rgb(20, 18, 16)' : 'rgb(233, 229, 222)', melding);
      }
    }
  });
}

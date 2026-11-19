import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { effektiv } from './hjelp/knappevekt.mjs';
import { topp, hylledel, morkBunn, nedlasting, samtykke, sprakvelger } from '../scripts/skall.mjs';
import { SKALLTEKST, SPRAKVALG, BUTIKK } from '../scripts/skall-tekst.mjs';
import { TEKST } from '../scripts/forside-tekst.mjs';
import { lesCommon } from './hjelp/lokalsider-kilde.mjs';
import { HYLLETEKST, LOKALE_KILDER, LOKALE_LENKER } from '../scripts/hyller.mjs';
import { SIDEGRUPPER } from '../scripts/locale-sider.mjs';
import { NORSKE_RESTORD } from './hjelp/restord.mjs';

const rot = fileURLToPath(new URL('..', import.meta.url));
const les = (sti) => readFileSync(join(rot, sti), 'utf8');
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
async function prove(t, { html = sideHtml(), frys = false, ...valg } = {}) {
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
  // clock.install() lar tiden gå i sanntid. En treg CI-maskin kan da bruke opp en hel nedtelling
  // mellom sidelast og første runFor; `frys` stopper klokka så testen eier hvert millisekund.
  await side.clock.install({ time: 0 });
  if (frys) await side.clock.pauseAt(1000);
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
  const { side, foresporsler } = await prove(t, { frys: true });
  const logo = side.locator('#merke img').first();
  const forst = await logo.getAttribute('src');
  await side.locator('#merke').hover();
  await side.clock.runFor(1700);
  assert.equal(foresporsler.includes('/images/forside/logo/01.webp'), false);
  assert.equal(await logo.getAttribute('src'), forst);
  await side.mouse.move(500, 500);
  await side.clock.runFor(3300);
  // Klokka står: bildet lastes i sanntid, så byttet (170 ms etter lastet) drives fram steg for steg.
  let byttet = false;
  for (let i = 0; i < 50 && !byttet; i++) {
    await side.clock.runFor(200);
    byttet = await side.evaluate(() => document.querySelector('#merke img').getAttribute('src') !== '/images/forside/logo/14.webp');
    if (!byttet) await side.waitForTimeout(50);
  }
  assert.ok(byttet, 'logoen byttet ikke form');
  assert.equal(foresporsler.includes('/images/forside/logo/40.webp'), true);
  const rolig = await prove(t, { reducedMotion: 'reduce', frys: true });
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
    const smaa = await side.locator('a:visible, button:visible').evaluateAll((elementer) => elementer.filter((e) => !e.closest('[inert]') && !e.matches('.hopp:not(:focus)') && (e.getBoundingClientRect().height < 44 || e.getBoundingClientRect().width < 44)).map((e) => e.outerHTML));
    assert.deepEqual(smaa, [], `${bredde} px: små trykkflater`);
    await side.keyboard.press('Escape');
    await side.evaluate(() => { document.querySelector('#cookie').hidden = true; });
  }
  assert.deepEqual(feil, []);
});


// Banneret er sidens eget innhold (B4) og kan ha en overskrift, så det holdes utenfor.
const skallUtenBanner = (s) => topp(s, {}) + hylledel(s) + morkBunn(s, {}) + nedlasting(s);
const alleDeler = (s) => skallUtenBanner(s) + samtykke(s);

test('skallet uten samtykkebanner legger ikke til overskrifter', () => {
  assert.doesNotMatch(skallUtenBanner('nb'), /<h[1-6]\b/i);
  for (const ul of skallUtenBanner('nb').match(/<ul\b[^>]*>/g)) assert.match(ul, /aria-label="[^"]+"/);
});

test('ingen tekst i skallet står i forside-tekst.mjs', () => {
  for (const k of ['topp', 'sprak', 'bunn', 'bunnlinje', 'under', 'fast', 'hent']) assert.ok(!(k in TEKST.nb), k);
});

test('morkBunn: samtykkelenka kan slås av', () => {
  assert.match(morkBunn('nb', {}), /data-consent-withdraw/);
  assert.doesNotMatch(morkBunn('nb', { samtykkelenke: false }), /data-consent-withdraw/);
  assert.equal(morkBunn('nb', { samtykkelenke: true }), morkBunn('nb', {}));
});

// Fiksturen er skallet slik det så ut før tekstene ble flyttet og guideplassen kom til.
const DETALJER = (summary) => `<details class="alle-guider"><summary>${summary}</summary><!-- guider:plass --></details>`;
test('bokmålsskallet er øyeblikksbildet pluss guideplassen, og ingenting annet', () => {
  const før = les('test/fixtures/skall-nb.html.fiks');
  assert.equal(før.split('<div class="bunnrad">').length, 2, 'øyeblikksbildet har nøyaktig én .bunnrad');
  assert.equal(alleDeler('nb'), før.replace('<div class="bunnrad">', `${DETALJER(SKALLTEKST.nb.bunn.guider)}<div class="bunnrad">`));
});

test('en ferdig guideblokk står i detaljene', () => {
  const blokk = '<!-- guider:bunn --><div class="f-guider">x</div><!-- /guider:bunn -->';
  assert.ok(hylledel('nb', { guider: blokk }).includes(`<summary>${SKALLTEKST.nb.bunn.guider}</summary>${blokk}</details>`));
  assert.ok(!hylledel('nb', { guider: blokk }).includes('guider:plass'));
});

test('«Alle guider» er den nye teksten i hylledelen', () => {
  assert.equal(SKALLTEKST.nb.bunn.guider, 'Alle guider');
  assert.equal(SKALLTEKST.nb.bunn.knapp, 'Last ned gratis');
  assert.equal(SKALLTEKST.nb.innhold.knapp, 'Last ned gratis');
});

test('språkvalg og butikklenker er data for alle fire språk', () => {
  for (const kode of ['nb', 'sv', 'da', 'en']) {
    assert.ok(SPRAKVALG.aria[kode] && SPRAKVALG.navn[kode], kode);
    assert.match(BUTIKK[kode].apple, /^https:\/\/apps\.apple\.com\/(?:(?:no|se|dk)\/)?app\/matlyst\/id6762563515$/);
    assert.match(BUTIKK[kode].google, /^https:\/\/play\.google\.com\/store\/apps\/details\?id=app\.matlyst/);
  }
  assert.deepEqual(SKALLTEKST.nb.sprak, { aria: 'Språk', valg: Object.entries(SPRAKVALG.navn).map(([kode, navn]) => ({ kode, navn })) });
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

for (const width of [1280, 390]) for (const flate of ['polstring', 'tom flate ved hyllelisten']) {
  test(`menyen forblir åpen etter klikk på ${flate} ved ${width} px`, async (t) => {
    const { side } = await prove(t, { viewport: { width, height: 800 }, reducedMotion: 'reduce' });
    await side.locator('#menyknapp').click();
    const panel = side.locator('#panel');
    assert.equal(await panel.isVisible(), true);
    if (flate !== 'polstring') {
      if (width === 390) await side.locator('#panel .fagknapp').first().click();
      await side.locator('#panel .fag a').first().focus();
    }
    const punkt = await panel.evaluate((e, flate) => {
      if (flate === 'polstring') {
        const r = e.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + parseFloat(getComputedStyle(e).paddingTop) / 2 };
      }
      // Luften over lenkelisten er en ekte tom flate inne i den åpne hyllen.
      const liste = e.querySelector('.fag ul'), r = liste.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top - parseFloat(getComputedStyle(liste).marginTop) / 2 };
    }, flate);
    assert.equal(await side.evaluate(({ punkt, flate }) => {
      const mal = document.elementFromPoint(punkt.x, punkt.y);
      return flate === 'polstring' ? mal?.id === 'panel' : !!mal?.closest('#panel .fag.aapen') && !mal.closest('a, button');
    }, { punkt, flate }), true, 'Klikket må treffe tom flate inne i panelet');
    await side.mouse.click(punkt.x, punkt.y);
    assert.equal(await panel.isVisible(), true, 'Et klikk på tom flate skal beholde den åpne menyen');
    assert.equal(await side.locator('#menyknapp').getAttribute('aria-expanded'), 'true');
  });
}

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

test('språkvelgeren viser fulle navn, beholder etikettene og eier ett kommentarpar', () => {
  const html = sprakvelger('da', 'topp', { nb: '/', sv: '/sv/', da: '/da/', en: '/en/' });
  assert.match(html, /^<!-- språkvelger:topp --><span class="language-switcher language-switcher-top" role="navigation" aria-label="Sprog">/);
  assert.match(html, /<!-- \/språkvelger:topp -->$/);
  assert.equal(html.split('<!-- språkvelger:topp -->').length - 1, 1);
  for (const [kode, navn] of Object.entries(SPRAKVALG.navn)) assert.match(html, new RegExp(`lang="${kode}"[^>]*aria-label="${navn}"[^>]*>${navn}</a>`));
});

test('butikklenkene på sv, da og en er de L bruker', () => {
  for (const s of ['sv', 'da', 'en']) assert.deepEqual(BUTIKK[s], { apple: lesCommon(s).appStore, google: lesCommon(s).play });
});

// ---------- svensk, dansk og amerikansk engelsk ----------

for (const s of ['sv', 'da', 'en']) {
  test(`${s}: menyen og bunnen har de samme hyllene og lenkene`, () => {
    assert.ok(lenker(hylledel(s)).length > 15);
    assert.deepEqual(lenker(hylledel(s)), lenker(topp(s, {}).match(/<nav class="panel"[\s\S]*?<\/nav>/)[0]));
  });
  test(`${s}: skallet uten banner legger ikke til overskrifter`, () => { assert.doesNotMatch(skallUtenBanner(s), /<h[1-6]\b/i); });
  test(`${s}: samtykkebanneret til sider uten banner er ordrett L sitt`, () => {
    const c = lesCommon(s), html = samtykke(s);
    for (const del of [c.consent, `>${c.accept}<`, `>${c.reject}<`]) assert.ok(html.includes(del), del);
    assert.doesNotMatch(html, /<h[1-6]\b/i);
  });
  test(`${s}: logo, personvern og vilkår lenker til sidene på språket`, () => {
    const g = (id) => SIDEGRUPPER.find((x) => x.id === id).sider[s];
    assert.match(topp(s, {}), new RegExp(`class="merke" href="${g('forside')}"`));
    for (const id of ['personvern', 'vilkar']) assert.match(morkBunn(s, {}), new RegExp(`href="${g(id)}"`));
  });
  test(`${s}: personvern og vilkår har samme ord som L`, () => {
    const c = lesCommon(s);
    assert.deepEqual(SKALLTEKST[s].under.lenker.slice(0, 2), [c.privacy, c.terms]);
    assert.deepEqual(BUTIKK[s], { apple: c.appStore, google: c.play });
  });
  test(`${s}: skalltekstene følger skrivereglene og plassen`, () => {
    const html = alleDeler(s) + topp(s, { folg: [{ href: '#a', tekst: 'Navn' }] });
    // Synlig tekst og attributtverdiene som skjermlesere og nettlesere viser.
    const synlig = [html.replace(/<[^>]+>/g, ' '), ...[...html.matchAll(/\b(?:aria-label|alt|title)="([^"]*)"/g)].map((m) => m[1])].join(' ');
    assert.doesNotMatch(synlig, /[–—]/);
    assert.doesNotMatch(synlig, /\b(kopp|kopper|kop|koppar)\b/i);
    assert.doesNotMatch(synlig, NORSKE_RESTORD);
    const t = SKALLTEKST[s];
    for (const [verdi, maks] of [[t.topp.folgAria, 24], [t.topp.meny, 8], [t.topp.lastNed, 10], [t.bunn.knapp, 18], [t.fast.knapp, 18], [t.innhold.knapp, 18], [t.bunn.guider, 20], [t.bunnlinje, 50], [t.hent.tittel, 28], [t.hent.ingress, 90]]) assert.ok(verdi.length <= maks, verdi);
  });
}

// Låser de leverte tekstene mot fasiten (generert én gang fra språkfilene). Koden kan ha flere nøkler enn fasiten.
const delmengde = (forventet, faktisk, sti = '') => {
  if (forventet !== null && typeof forventet === 'object') {
    for (const [k, v] of Object.entries(forventet)) delmengde(v, faktisk?.[k], `${sti}.${k}`);
  } else assert.equal(faktisk, forventet, sti);
};
for (const s of ['sv', 'da', 'en']) {
  test(`${s}: skall- og hylletekstene er de leverte`, () => {
    const fasit = JSON.parse(les(`test/fasit/skalltekst-${s}.json`));
    delmengde(fasit.skall, SKALLTEKST[s], 'skall');
    delmengde(fasit.hyller, HYLLETEKST[s], 'hyller');
    assert.equal(Object.keys(HYLLETEKST[s].lenker).length - Object.keys(fasit.hyller.lenker).length, LOKALE_KILDER[s].length + (LOKALE_LENKER[s]?.tips?.length ?? 0));
  });
}
test('følgemenyen har sitt eget navn på hvert språk', () => {
  for (const [s, navn] of [['nb', 'På denne siden'], ['sv', 'På den här sidan'], ['da', 'På denne side'], ['en', 'On this page']]) {
    assert.match(topp(s, { folg: [{ href: '#a', tekst: 'A' }] }), new RegExp(`<nav class="folg" id="folg" aria-label="${navn}">`));
  }
});

test('topp() har skiplenken som første element i hvert språk, med teksten fra dagens undersider', () => {
  const forventet = { nb: 'Hopp til innholdet', sv: 'Hoppa till innehållet', da: 'Spring til indholdet', en: 'Skip to content' };
  for (const [sprak, tekst] of Object.entries(forventet)) {
    const html = topp(sprak, { sprakvelger: '' });
    assert.ok(html.startsWith(`<a class="hopp" href="#hovedinnhold">${tekst}</a>`), `${sprak}: skiplenken må stå først`);
    assert.equal(SKALLTEKST[sprak].topp.hopp, tekst);
  }
});

const utenKommentarer = (kilde) => kilde.replace(/\/\*[\s\S]*?\*\//gu, '');

test('guider-panelet er skjult til det åpnes: markupen har hidden og skall.css setter ikke display på .panel', () => {
  assert.match(topp('nb', { sprakvelger: '' }), /<nav class="panel"[^>]*\shidden[\s>]/u);
  const css = utenKommentarer(les('skall.css'));
  const panelregler = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/gu)].filter(([, v]) => v.split(',').some((d) => /(^|[\s>+~])\.panel(?![\w-])(?:\[[^\]]*\]|:[\w-]+)*\s*$/u.test(d)));
  assert.ok(panelregler.length > 0, 'fant ingen regler for .panel selv');
  const medDisplay = panelregler.filter(([, v, kropp]) => /(^|[;\s])display\s*:/u.test(kropp) && !v.split(',').every((d) => /\[hidden\]/u.test(d)));
  assert.deepEqual(medDisplay.map((m) => m[1].trim()), [], '.panel kan ikke sette display uten [hidden]-unntak');
});

test('toppen er sticky fra 1001 px med tett bakgrunn og uten backdrop-filter (ga doble bilderuter), og har en reserve ved redusert gjennomsiktighet', () => {
  const css = utenKommentarer(les('skall.css'));
  const blokk = css.match(/@media \(min-width:1001px\)\s*\{([\s\S]*?)\n\}/u);
  assert.ok(blokk, 'mangler @media (min-width:1001px)');
  const topp1001 = blokk[1].match(/\.topp\s*\{([^}]*)\}/u);
  assert.ok(topp1001, 'mangler .topp i bredskjermsblokken');
  assert.match(topp1001[1], /position:\s*sticky/u);
  assert.match(topp1001[1], /background:\s*rgb\(255 255 255 \/ \.94\)/u);
  assert.doesNotMatch(topp1001[1], /backdrop-filter/u);
  // Ingen flate som ligger over rullende innhold har backdrop-filter (bare dialogens ::backdrop).
  const alle = ['skall.css', 'forside.css'].map((f) => utenKommentarer(les(f))).join('\n').replace(/\.hent::backdrop\{[^}]*\}/u, '');
  assert.doesNotMatch(alle, /backdrop-filter/u, 'backdrop-filter gir hakkete rulling');
  const reserve = css.match(/@media \(prefers-reduced-transparency:\s*reduce\)\s*\{([^{}]*\{[^}]*\})\s*\}/u);
  assert.ok(reserve, 'mangler reserve for redusert gjennomsiktighet');
  assert.match(reserve[1], /\.topp/u);
  assert.match(reserve[1], /background:\s*var\(--flate\)/u);
});

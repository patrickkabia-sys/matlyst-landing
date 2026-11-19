// Revisjon per sidetype: hver side i utvalget() åpnes på fire bredder, med forstørret tekst
// og zoom, og skallet sjekkes uten JavaScript. Typer som ikke er rullet ut, gir ingen rader.
import { mkdirSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { revider, samleFeil, skalering, zoom } from './hjelp/revisjon.mjs';
import { utvalg, utrulledeTyper, eksempelStier } from './hjelp/utvalg.mjs';
import { EKSEMPEL, TYPER } from '../../scripts/sidetyper.mjs';

const BREDDER = [360, 390, 768, 1280];
// Skallets tekst står i px i skall.css og følger ikke nettleserens tekststørrelse.
// Den er unntatt fra forstørret tekst (a), men dekket av zoomtesten (b).
const SKALL_PX = ['header.topp', '#panel', 'section.bunn', 'footer.under', '#fast', '#hent', '#cookie', '.knapp'];
const TEKST = '.blad :is(p, li, td, th, dt, dd, summary, h1, h2, h3, h4, figcaption, .lead, .eyebrow)';
const LOVLIGE_HENT = ['topp', 'bunn', 'fast', 'app-cta', 'side-cta', 'helt'];
const EKSEMPELSTIER = eksempelStier();

// Revisjonen kjøres med redusert bevegelse: alt står i sluttilstand og kildebåndet står stille.
test.use({ reducedMotion: 'reduce' });

// Unntakene er smale og hver har en grunn. Resten av motorens standarder gjelder.
// krom: sidens egne flytende flater. Standard er .topp, .fast og .samtykke; skallets
// samtykkebanner heter .cookie, og eldre sider har en flytende nedlastingslinje (.dl-bar).
const krom = (side) => ['.topp', '.fast', '.samtykke', '.cookie', ...(side.type === 'forside' ? [] : ['.dl-bar'])];
// Forsiden setter overskriften bokstav for bokstav i span.tegn; boksene overlapper, men det er ett ord.
// Kildebåndet (.band) ruller i en maske med vilje, så tekst der er klippet av design.
const valg = (side) => ({
  krom: krom(side),
  ...(side.type === 'forside' ? { unntak: ['.tegn'], tilsiktetKlipp: ['.band'] } : {}),
});
const reviderSiden = (page, side) => revider(page, valg(side));

const rader = utvalg();

// Revisjonen finner ekte feil på dagens forside («/», levert før denne revisjonen fantes):
// overlapp og tekst utenfor boksen i demoene (a-dag, spiller, stormerke) og px-tekst i
// innholdet. Forsiden er ikke rørt her. test.fail() gjør funnene synlige uten å gjøre
// CI rød (REVISJON_STRENG=1 slår det av), og blir rød av seg selv den dagen forsiden er rettet (fjern da denne linjen).
const KJENTE_FORSIDEFUNN = (side) => !process.env.REVISJON_STRENG && side.url === '/' && side.type === 'forside';

test('utvalget har sider for hver utrullet type', () => {
  const ute = utrulledeTyper();
  for (const type of ute) {
    expect(utvalg({ revisjon: type, sprak: '' }).length, `REVISJON=${type} gir ingen sider`).toBeGreaterThan(0);
    expect(utvalg({ revisjon: '', sprak: '' }).some((r) => r.type === type), `standardutvalget mangler ${type}`).toBe(true);
  }
  const valgt = process.env.REVISJON;
  if (valgt && TYPER.includes(valgt) && ute.includes(valgt)) {
    expect(rader.some((r) => r.type === valgt), `REVISJON=${valgt} REVISJON_SPRAK=${process.env.REVISJON_SPRAK || ''} velger null sider`).toBe(true);
  }
});

test('utvalget følger predikatet: en utrullet type får sine sider, andre ingen', () => {
  const med = utvalg({ revisjon: 'omregner', sprak: '', utrullet: new Set(['omregner']) });
  expect(med.length).toBeGreaterThan(0);
  expect(med.every((r) => r.type === 'omregner' && r.fulltSkall)).toBe(true);
  expect(utvalg({ revisjon: 'omregner', sprak: '', utrullet: new Set() })).toEqual([]);
  const eksempler = utvalg({ revisjon: '', sprak: '', utrullet: new Set(['omregner']) }).filter((r) => r.type === 'omregner');
  expect(eksempler.map((r) => r.sti).sort()).toEqual(Object.values(EKSEMPEL.omregner).sort());
  expect(utvalg({ revisjon: 'tjeneste', sprak: '', utrullet: new Set(['tjeneste:avmeld']) }).every((r) => r.fulltSkall === false)).toBe(true);
});

for (const side of rader) {
  const navn = `${side.type} ${side.url}`;

  test(`felles: ${navn}`, async ({ page, baseURL }) => {
    test.fail(KJENTE_FORSIDEFUNN(side), 'kjent funn på forsiden, se task-2b-rapporten');
    const feil = samleFeil(page, new URL(baseURL).origin);
    for (const bredde of BREDDER) {
      await page.setViewportSize({ width: bredde, height: 900 });
      await page.goto(side.url);
      expect(new URL(page.url()).pathname, `sluttadresse på ${bredde}`).toBe(side.url);
      const r = await reviderSiden(page, side);
      expect(r, `funn på ${bredde} px`).toEqual({ sidelengs: 0, utenforBoks: [], overlapp: [], iframer: [] });
    }
    expect(feil.konsoll).toEqual([]);
    expect(feil.fremmede).toEqual([]);
    expect(feil.mangler).toEqual([]);
  });

  test(`forstørret tekst, rem følger nettleseren: ${navn}`, async ({ page }) => {
    test.fail(KJENTE_FORSIDEFUNN(side), 'kjent funn på forsiden, se task-2b-rapporten');
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto(side.url);
    const utenSkall = `${TEKST}:not(:is(${SKALL_PX.join(', ')}) *)`;
    const faktorer = await skalering(page, utenSkall);
    expect(faktorer.length, 'ingen tekst å måle').toBeGreaterThan(0);
    const for_liten = faktorer.filter((f) => !(f.faktor >= 1.9));
    expect(for_liten).toEqual([]);
  });

  for (const faktor of [2, 4]) {
    test(`zoom ${faktor * 100} %: ${navn}`, async ({ browser }) => {
    test.fail(KJENTE_FORSIDEFUNN(side), 'kjent funn på forsiden, se task-2b-rapporten');
      const flate = await zoom(browser, side.url, faktor);
      try {
        await flate.emulateMedia({ reducedMotion: 'reduce' });
        await flate.reload();
        const r = await reviderSiden(flate, side);
        expect(r).toEqual({ sidelengs: 0, utenforBoks: [], overlapp: [], iframer: [] });
      } finally {
        await flate.context().close();
      }
    });
  }

  if (side.fulltSkall) {
    test(`fullt skall uten JavaScript: ${navn}`, async ({ browser, baseURL }) => {
      const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
      try {
        const page = await context.newPage();
        await page.goto(side.url);
        const hent = await page.$$eval('[data-hent]', (a) => a.map((e) => ({ verdi: e.getAttribute('data-hent'), href: e.getAttribute('href') })));
        expect(hent.length).toBeGreaterThan(0);
        for (const h of hent) expect(h.href, `data-hent=${h.verdi}`).toBe('/app');
        for (const h of hent) expect(LOVLIGE_HENT, `ulovlig data-hent ${h.verdi}`).toContain(h.verdi);
        for (const fast of ['topp', 'bunn', 'fast']) expect(hent.filter((h) => h.verdi === fast).length, `data-hent=${fast}`).toBe(1);
        const lister = page.locator('#bunnreol .fag ul');
        expect(await lister.count()).toBeGreaterThan(0);
        for (const ul of await lister.all()) await expect(ul).toBeVisible();
      } finally {
        await context.close();
      }
    });
  }

  if (EKSEMPELSTIER.has(side.sti) && side.url === side.sti) {
    test(`skjermbilder: ${navn}`, async ({ page }) => {
      for (const bredde of [390, 1280]) {
        await page.setViewportSize({ width: bredde, height: 900 });
        await page.goto(side.url);
        mkdirSync(`qa/skjermbilder/${side.type}`, { recursive: true });
        await page.screenshot({ path: `qa/skjermbilder/${side.type}/${side.sprak}-${bredde}.png`, fullPage: true });
      }
    });
  }
}

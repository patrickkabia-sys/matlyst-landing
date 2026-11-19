import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { trekkUt, ctaOmrader, byttButikkmerker } from '../scripts/skall-paa.mjs';
import { alleSider } from '../scripts/sidetyper.mjs';
import { SKALLTEKST } from '../scripts/skall-tekst.mjs';
import { overskrifter } from './hjelp/overskrifter.mjs';
import { lesCommon } from './hjelp/lokalsider-kilde.mjs';

const rot = fileURLToPath(new URL('..', import.meta.url));
const fiks = (navn) => readFileSync(join(rot, 'test/fixtures/skall-paa', `${navn}.html.fiks`), 'utf8');
const STI = {
  'omregner-nb': '/verktoy/kopp-til-dl/',
  'omregner-nb-generert': '/verktoy/kopp-til-dl/',
  'lang-sv': '/sv/spara-recept-fran-instagram/',
  'kort-en': '/en/meal-plan-app/',
  'blogg-artikkel-da': '/da/blog/kernetemperatur/',
  'blogg-indeks-nb': '/blogg/',
  'juss-nb': '/vilkar.html',
  'juss-en': '/en/terms/',
  'gammel-nb': '/finn-oppskrifter/',
  'gammel-skapere': '/skapere/',
  'uten-guider': '/verktoy/kopp-til-dl/',
};
const FULLE = Object.keys(STI);

// Grensene leses uavhengig av uttrekkets kode, uten å normalisere innholdet.
function gammeltInnhold(html) {
  if (html.includes('<!-- skall:topp -->')) {
    return html.split('<!-- /skall:topp -->')[1].split('<!-- skall:bunn -->')[0];
  }
  return html.split(/<body\b[^>]*>/u)[1].split('</nav>').slice(1).join('</nav>').split('<footer')[0];
}

// Bare butikkbokser i de tillatte områdene maskeres.
function masker(innhold, type) {
  let ut = innhold;
  for (const o of ctaOmrader(innhold, type).reverse()) {
    ut = ut.slice(0, o.start) + ut.slice(o.start, o.slutt).replace(/<div class="store-badges">[\s\S]*?<\/div>|<a class="knapp" href="\/app" data-hent="[a-z-]+">[^<]*<\/a>/gu, '§') + ut.slice(o.slutt);
  }
  return ut;
}

test('innholdet er likt bortsett fra butikkmerkene i de tillatte områdene', () => {
  for (const f of FULLE) {
    const d = trekkUt(fiks(f), STI[f]);
    assert.equal(d.innhold, gammeltInnhold(fiks(f)), f);
    assert.equal(masker(byttButikkmerker(d.innhold, d.sprak, d.type), d.type), masker(gammeltInnhold(fiks(f)), d.type), f);
  }
});

test('en butikkboks utenfor nedlastingsboksene står urørt', () => {
  const boks = '<div class="store-badges"><a class="btn-store" href="https://apps.apple.com/x">A</a></div>';
  const innhold = `<p>x</p>${boks}<section class="page-cta"><h2 class="disp">Hent</h2>${boks}</section>`;
  const ut = byttButikkmerker(innhold, 'nb', 'guide-kort');
  assert.ok(ut.startsWith(`<p>x</p>${boks}`));
  assert.ok(ut.endsWith('<section class="page-cta"><h2 class="disp">Hent</h2><a class="knapp" href="/app" data-hent="side-cta">Last ned gratis</a></section>'));
});

test('B1: begge CTA-formene og helten får knappen, og omformingen er idempotent', () => {
  for (const [f, verdi] of [['kort-en', 'side-cta'], ['blogg-artikkel-da', 'app-cta'], ['gammel-nb', 'side-cta'], ['gammel-nb', 'helt'], ['lang-sv', 'side-cta'], ['omregner-nb-generert', 'side-cta']]) {
    const d = trekkUt(fiks(f), STI[f]);
    const ut = byttButikkmerker(d.innhold, d.sprak, d.type);
    assert.ok(ut.includes(`<a class="knapp" href="/app" data-hent="${verdi}">${SKALLTEKST[d.sprak].innhold.knapp}</a>`), `${f} ${verdi}`);
    assert.equal(byttButikkmerker(ut, d.sprak, d.type), ut, f);
  }
  const d = trekkUt(fiks('gammel-skapere'), STI['gammel-skapere']);
  assert.equal(byttButikkmerker(d.innhold, 'nb', 'guide-gammel'), d.innhold);
});

test('overskriftene er de samme før og etter', () => {
  for (const f of FULLE) {
    const d = trekkUt(fiks(f), STI[f]);
    assert.deepEqual(overskrifter(byttButikkmerker(d.innhold, d.sprak, d.type)), overskrifter(gammeltInnhold(fiks(f))), f);
  }
});

test('overskriftshjelperen normaliserer tagger og mellomrom og beholder rekkefølge og nivå', () => {
  assert.deepEqual(overskrifter('<h2 id="x">  Omregningstabell: <em>kopp</em>\n til dl </h2><p>Ikke med</p><h1>Mat<em>lyst</em></h1><h6>Siste</h6>'), ['h2:Omregningstabell: kopp til dl', 'h1:Matlyst', 'h6:Siste']);
});

test('begge norske bannerfamilier og de lokale tas med ordrett', () => {
  for (const f of ['omregner-nb', 'omregner-nb-generert']) {
    assert.match(trekkUt(fiks(f), STI[f]).banner, /^<div class="cookie" id="cookie" hidden><div class="cookie-inner" id="samtykke"><p>Vi bruker nødvendig lagring[\s\S]*<\/div><\/div><\/div>$/u);
  }
  assert.match(trekkUt(fiks('gammel-nb'), STI['gammel-nb']).banner, /^<div class="cookie" id="cookie" hidden>\s*<h3>Vi bruker informasjonskapsler<\/h3>[\s\S]*Bare nødvendige<\/button>\s*<\/div>\s*<\/div>$/u);
  for (const [f, sprak] of [['lang-sv', 'sv'], ['blogg-artikkel-da', 'da'], ['juss-en', 'en']]) {
    assert.ok(trekkUt(fiks(f), STI[f]).banner.includes(lesCommon(sprak).consent), f);
  }
  for (const f of FULLE.filter((f) => f !== 'juss-nb')) {
    const html = fiks(f);
    const forventet = html.slice(html.indexOf('<div class="cookie" id="cookie"'), html.indexOf('<script src="/site.js"')).trimEnd();
    assert.equal(trekkUt(html, STI[f]).banner, forventet, f);
  }
  assert.equal(trekkUt(fiks('juss-nb'), STI['juss-nb']).banner, null);
});

test('site.js gjenkjennes med og uten defer og med andre attributter', () => {
  for (const f of ['gammel-nb', 'omregner-nb']) assert.equal(trekkUt(fiks(f), STI[f]).harSiteJs, true, f);
  assert.equal(trekkUt(fiks('juss-nb'), STI['juss-nb']).harSiteJs, false);
  const html = fiks('juss-nb').replace('</body>', '<script defer src="/site.js" data-test="ja">\n </script></body>');
  assert.equal(trekkUt(html, STI['juss-nb']).harSiteJs, true);
  assert.equal(trekkUt(html.replace('src="/site.js"', 'src="/annen.js"'), STI['juss-nb']).harSiteJs, false);
});

test('guideblokker og språkvelgere bevares ordrett med markørene', () => {
  for (const f of FULLE) {
    const html = fiks(f), d = trekkUt(html, STI[f]);
    for (const [navn, verdi] of [['guider:bunn', d.guider], ['språkvelger:topp', d.sprakvelgere.topp], ['språkvelger:bunn', d.sprakvelgere.bunn]]) {
      assert.equal(verdi, html.match(new RegExp(`<!-- ${navn} -->[\\s\\S]*?<!-- /${navn} -->`, 'u'))?.[0] ?? '', `${f}: ${navn}`);
    }
  }
});

test('en side uten guideblokk eller språkvelgere gir tomme strenger', () => {
  const html = fiks('uten-guider').replace(/<!-- språkvelger:(topp|bunn) -->[\s\S]*?<!-- \/språkvelger:\1 -->/gu, '');
  const d = trekkUt(html, STI['uten-guider']);
  assert.equal(d.guider, '');
  assert.deepEqual(d.sprakvelgere, { topp: '', bunn: '' });
});

test('kropp bevarer dokumentet gjennom body og halen bevarer skript uten banner og gammel fast linje', () => {
  for (const f of FULLE) {
    const html = fiks(f), d = trekkUt(html, STI[f]);
    assert.equal(d.kropp, html.match(/^[\s\S]*?<body\b[^>]*>/u)[0], f);
    const forventet = html.split('</footer>')[1].replace(d.banner ?? '§mangler§', '').replace(/<!-- app-uttrykk:start -->[\s\S]*?<!-- app-uttrykk:slutt -->/gu, '');
    assert.equal(d.hale, forventet, f);
    assert.ok(d.hale.includes('</body>'), f);
  }
});

test('skallmarkørene avgrenser innhold og hale selv med nav og footer i innholdet', () => {
  const kropp = '<!DOCTYPE html><html lang="sv"><head></head><body data-locale="sv">';
  const innhold = '\n<main><nav>Innholdsmeny</nav><p>Bevares</p><footer>Artikkelfot</footer></main>\n';
  const hale = '<script src="/site.js" defer></script><script>lokal()</script></body></html>';
  const html = `${kropp}<!-- skall:topp --><div><nav>Topp</nav><!-- /skall:topp -->${innhold}<!-- skall:bunn --></div><footer>Bunn</footer><!-- /skall:bunn -->${hale}`;
  const d = trekkUt(html, '/sv/verktyg/kopp-till-dl/');
  assert.equal(d.innhold, innhold);
  assert.equal(d.kropp, kropp);
  assert.equal(d.hale, hale);
  assert.equal(d.sprak, 'sv');
  assert.equal(d.type, 'omregner');
});

test('manglende grenser gir feil med stien', () => {
  const sti = '/verktoy/kopp-til-dl/';
  for (const html of ['<body><main>x</main><footer></footer></body>', '<body><nav></nav><main>x</main></body>', '<nav></nav><footer></footer>', '<body><!-- skall:topp --><nav></nav><footer></footer>', '<body><!-- skall:topp --><!-- /skall:topp --><nav></nav><footer></footer>', '<body><!-- skall:topp --><!-- /skall:topp --><!-- skall:bunn --><footer></footer>']) {
    assert.throws(() => trekkUt(html, sti), (feil) => feil instanceof Error && feil.message.includes(sti), html);
  }
});

test('CTA-områdene har eksakte grenser også med nøstede tagger av samme navn', () => {
  const app = '<section class="app-cta"><section><p>x</p></section><div>y</div></section>';
  const side = '<div class="page-cta"><div><div>x</div></div></div>';
  const helt = '<header class="hero has-stage"><header>x</header><div>y</div></header>';
  const innhold = `før${app}mellom${side}${helt}etter`;
  const forventet = [app, side, helt].map((blokk, i) => ({ start: innhold.indexOf(blokk), slutt: innhold.indexOf(blokk) + blokk.length, verdi: ['app-cta', 'side-cta', 'helt'][i] }));
  assert.deepEqual(ctaOmrader(innhold, 'guide-gammel'), forventet);
  assert.deepEqual(ctaOmrader(innhold, 'guide-kort'), forventet.slice(0, 2));
  assert.deepEqual(ctaOmrader('<header class="heroic">x</header><section class="app-cta-ekstra">x</section><div class="page-cta-ekstra">x</div>', 'guide-gammel'), []);
});

test('hele butikkboksen erstattes ved nøsting og en eksisterende knapp står urørt', () => {
  const knapp = '<a class="knapp" href="/app" data-hent="side-cta">Last ned gratis</a>';
  const html = '<div class="page-cta"><div class="store-badges"><div><a>A</a></div><a>B</a></div><p>Etter</p></div>';
  assert.equal(byttButikkmerker(html, 'nb', 'guide-gammel'), `<div class="page-cta">${knapp}<p>Etter</p></div>`);
  const ferdig = `<div class="page-cta">${knapp}<p>Etter</p></div>`;
  assert.equal(byttButikkmerker(ferdig, 'nb', 'guide-gammel'), ferdig);
});

test('tjenestesider forgrenes før rammen letes etter', () => {
  assert.throws(() => trekkUt(fiks('tjeneste-404'), '/404.html'), /tjeneste/u);
  assert.throws(() => trekkUt('uten ramme', '/404.html'), /tjeneste/u);
});

test('alle undersider prøves og bare tjenestesider kaster som avtalt', (t) => {
  const sider = alleSider(rot).filter((s) => s.type !== 'forside');
  const kast = [], uventede = [];
  let vellykkede = 0;
  for (const s of sider) {
    const html = readFileSync(join(rot, s.fil), 'utf8');
    let d;
    try { d = trekkUt(html, s.sti); }
    catch (feil) {
      kast.push({ sti: s.sti, type: s.type, grunn: feil.message });
      if (s.type !== 'tjeneste' || !feil.message.includes('tjeneste')) uventede.push(kast.at(-1));
      continue;
    }
    vellykkede++;
    assert.notEqual(s.type, 'tjeneste', s.sti);
    assert.equal(d.sprak, s.sprak, s.sti);
    assert.equal(d.type, s.type, s.sti);
    assert.equal(d.innhold, gammeltInnhold(html), s.sti);
    const ut = byttButikkmerker(d.innhold, d.sprak, d.type);
    assert.equal(masker(ut, d.type), masker(d.innhold, d.type), s.sti);
    assert.deepEqual(overskrifter(ut), overskrifter(d.innhold), s.sti);
    assert.equal(byttButikkmerker(ut, d.sprak, d.type), ut, s.sti);
  }
  t.diagnostic(`${sider.length} undersider prøvd; ${vellykkede} uttrekk; ${kast.length} kast; ${uventede.length} uventede kast.`);
  for (const feil of kast) t.diagnostic(`${feil.sti}: ${feil.grunn}`);
  assert.ok(sider.length > 800);
  assert.deepEqual(uventede, []);
  assert.equal(kast.length, sider.filter((s) => s.type === 'tjeneste').length);
});

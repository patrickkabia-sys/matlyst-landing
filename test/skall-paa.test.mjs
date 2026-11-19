import assert from 'node:assert/strict';
import { existsSync, readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync, statSync, cpSync, realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import test from 'node:test';
import * as skall from '../scripts/skall-paa.mjs';
import { alleSider, erUtrullet, tjenestefamilie } from '../scripts/sidetyper.mjs';
import { gruppeForSti } from '../scripts/locale-sider.mjs';
import { sprakvelger, samtykke } from '../scripts/skall.mjs';
import { settInn } from '../scripts/guidelenker.mjs';
import { overskrifter } from './hjelp/overskrifter.mjs';

const rot = fileURLToPath(new URL('..', import.meta.url));
const les = (fil) => readFileSync(join(rot, fil), 'utf8');
const fiks = (navn) => les(`test/fixtures/skall-paa/${navn}.html.fiks`);
const alle = alleSider(rot);
const sider = alle.filter((s) => s.type !== 'forside');
const ALLE = new Set(sider.map((s) => s.nokkel).filter((n) => n !== 'tjeneste:verifisering'));
const STI = { 'omregner-nb': '/verktoy/kopp-til-dl/', 'juss-nb': '/vilkar.html', 'gammel-nb': '/finn-oppskrifter/', 'lang-sv': '/sv/spara-recept-fran-instagram/', 'uten-guider': '/verktoy/kopp-til-dl/' };
const rendre = (...args) => { assert.equal(typeof skall.rendre, 'function', 'rendre må eksporteres'); return skall.rendre(...args); };
const STIL = '<!-- skall:stil --><link rel="stylesheet" href="/tokens.css"><link rel="stylesheet" href="/skall.css"><link rel="stylesheet" href="/side.css"><script src="/skall.js" defer></script><link rel="apple-touch-icon" href="/images/apple-touch-icon.png"><!-- /skall:stil -->';
const TJENESTESTIL = '<!-- skall:stil --><link rel="stylesheet" href="/tokens.css"><link rel="stylesheet" href="/tjeneste.css"><link rel="apple-touch-icon" href="/images/apple-touch-icon.png"><!-- /skall:stil -->';

// Taggstabelen beholder bare klassene som beskriver rammen.
function strukturtre(html, klasser) {
  const ut = [], stabel = [{ barn: ut }];
  const tomme = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
  const utenRaatekst = html.replace(/<!--[^]*?-->|<(script|style)\b[^>]*>[^]*?<\/\1>/gu, '');
  for (const m of utenRaatekst.matchAll(/<(\/?)([a-z][\w-]*)\b([^>]*)>/gu)) {
    const [, slutt, tagg, attr] = m;
    if (slutt) {
      const i = stabel.findLastIndex((x) => x.tagg === tagg);
      if (i > 0) stabel.length = i;
      continue;
    }
    const klasse = (attr.match(/\bclass="([^"]*)"/u)?.[1].split(/\s+/u) ?? []).find((k) => klasser.includes(k));
    let barn = stabel.at(-1).barn;
    if (klasse) { const node = [klasse, []]; barn.push(node); barn = node[1]; }
    if (!tomme.has(tagg) && !attr.endsWith('/')) stabel.push({ tagg, barn });
  }
  return ut;
}

test('uttrekk prøves på alle undersider og alle kast rapporteres', (t) => {
  const kast = [];
  for (const s of sider) {
    try { skall.trekkUt(les(s.fil), s.sti); }
    catch (feil) { kast.push({ sti: s.sti, type: s.type, grunn: feil.message }); }
  }
  t.diagnostic(`${sider.length} sider; ${sider.length - kast.length} uttrekk; ${kast.length} kast.`);
  for (const feil of kast) t.diagnostic(`${feil.sti}: ${feil.grunn}`);
  // Ruling 42: alle tjenester skal kaste, og ingen andre typer får kaste.
  assert.deepEqual(kast.map((s) => s.sti).sort(), sider.filter((s) => s.type === 'tjeneste').map((s) => s.sti).sort());
  // Brevet sier 875, men registeret er kilden til hvilke filer som faktisk finnes.
  assert.ok(sider.length > 800, 'hele sideregisteret må være med');
});

test('to kjøringer gir like bytes, for alle sider i minnet', (t) => {
  const kast = [], ulike = [];
  let like = 0;
  for (const s of sider) {
    try { const en = rendre(les(s.fil), s.sti, ALLE); if (rendre(en, s.sti, ALLE) === en) like++; else ulike.push(s.sti); }
    catch (feil) { kast.push(`${s.sti}: ${feil.message}`); }
  }
  t.diagnostic(`${sider.length} sider; ${kast.length} kast; ${like} byte-identiske; ${ulike.length} ulike.`);
  assert.deepEqual(kast, []);
  assert.deepEqual(ulike, []);
});

test('overskriftene er de samme før og etter på alle sider', () => {
  for (const s of sider) assert.deepEqual(overskrifter(rendre(les(s.fil), s.sti, ALLE)), overskrifter(les(s.fil)), s.sti);
});

test('banneret står ordrett, og bare der det sto', () => {
  for (const s of sider.filter((x) => x.type !== 'tjeneste')) assert.equal(skall.trekkUt(rendre(les(s.fil), s.sti, ALLE), s.sti).banner, skall.trekkUt(les(s.fil), s.sti).banner, s.sti);
});

test('nestingen er prototypens: fast knapp, QR-vindu og banner inne i .side', () => {
  assert.deepEqual(strukturtre(rendre(fiks('omregner-nb'), STI['omregner-nb'], ALLE), ['side', 'kort', 'blad', 'topp', 'bunn', 'under', 'fast', 'hent', 'cookie']),
    [['side', [['kort', [['blad', [['topp', []]]], ['bunn', []]]], ['under', []], ['fast', []], ['hent', []], ['cookie', []]]]]);
});

test('én stilblokk og ett ikon, også ved gjentatt kjøring og fra alle innganger', () => {
  for (const f of ['omregner-nb', 'juss-nb', 'gammel-nb', 'lang-sv']) {
    const en = rendre(fiks(f), STI[f], ALLE), to = rendre(en, STI[f], ALLE);
    for (const ut of [en, to]) {
      for (const borte of ['class="nav-right"', 'id="dl-bar"', 'class="f-kolonner"', 'href="/styles.css"', 'data-app-uttrykk', '@font-face']) assert.ok(!ut.includes(borte), `${f}: ${borte}`);
      assert.equal(ut.split('<!-- skall:stil -->').length - 1, 1, f);
      assert.equal((ut.match(/rel="apple-touch-icon"/gu) ?? []).length, 1, f);
      assert.ok(ut.includes(STIL), f);
      assert.ok(ut.indexOf('<!-- /skall:stil -->') < ut.indexOf('</head>'), f);
    }
  }
});

test('stilblokken bruker avtalt plass og rydder alle gamle ikoner og stiler', () => {
  const grunn = fiks('uten-guider');
  for (const [hode, forventet] of [
    ['A<!-- skall:stil -->gammelt<!-- /skall:stil -->B<link rel="stylesheet" href="/styles.css">C', `A${STIL}BC`],
    ['A<link rel="stylesheet" href="/styles.css">B<style>@font-face{}</style>C', `A${STIL}BC`],
    ['A<style>@font-face{}</style>B', `A${STIL}B`],
    ['A<style>.behold{color:red}</style>B', `A<style>.behold{color:red}</style>B${STIL}`],
  ]) {
    const html = grunn.replace(/<head>[^]*?<\/head>/u, `<head><link href="/gammelt.png" rel='apple-touch-icon'>${hode}<link rel="apple-touch-icon" href="/annet.png"></head>`);
    const en = rendre(html, STI['uten-guider'], ALLE);
    assert.ok(en.includes(`<head>${forventet}</head>`), hode);
    assert.equal(rendre(en, STI['uten-guider'], ALLE), en, hode);
  }
});

test('guidene: begge kjørerekkefølger gir samme side, også uten blokk fra før', () => {
  const ny = '<!-- guider:bunn --><div class="f-guider">x</div><!-- /guider:bunn -->';
  for (const f of ['lang-sv', 'uten-guider']) {
    const h = fiks(f), sti = STI[f];
    assert.equal(rendre(settInn(h, ny), sti, ALLE), settInn(rendre(h, sti, ALLE), ny), f);
    assert.match(settInn(rendre(h, sti, ALLE), ny), /<details class="alle-guider"><summary>[^<]+<\/summary><!-- guider:bunn -->/u);
  }
});

test('språkvelgerne bruker gruppen, og bevares ordrett uten gruppe', () => {
  for (const s of sider.filter((s) => s.type !== 'tjeneste' || !['vervekort', 'verifisering'].includes(tjenestefamilie(s.sti)))) {
    const html = les(s.fil), ut = rendre(html, s.sti, ALLE), gruppe = gruppeForSti(s.sti);
    for (const plass of ['topp', 'bunn']) {
      const gammel = html.match(new RegExp(`<!-- språkvelger:${plass} -->[^]*?<!-- /språkvelger:${plass} -->`, 'u'))?.[0] ?? '';
      if (gruppe && (s.type !== 'tjeneste' || gammel)) assert.ok(ut.includes(sprakvelger(s.sprak, plass, gruppe.sider)), `${s.sti}: ${plass}`);
      else if (gammel) assert.ok(ut.includes(gammel), `${s.sti}: ${plass}`);
    }
  }
  const sti = '/verktoy/uten-gruppe/', html = fiks('omregner-nb');
  const ut = rendre(html, sti, ALLE);
  assert.deepEqual(skall.trekkUt(ut, sti).sprakvelgere, skall.trekkUt(html, sti).sprakvelgere);
});

test('body beholder andre attributter og får nøyaktig én sidetype', () => {
  const html = fiks('uten-guider').replace(/<body\b[^>]*>/u, '<body class="min" data-app-uttrykk="1" data-sidetype="gammel" lang="nb">');
  const ut = rendre(html, STI['uten-guider'], ALLE);
  assert.match(ut, /<body class="min" lang="nb" data-sidetype="omregner">/u);
  assert.equal(rendre(ut, STI['uten-guider'], ALLE), ut);
});

test('samtykke opprettes bare når site.js finnes, og hale og innhold bevares', () => {
  const sti = STI['juss-nb'], html = fiks('juss-nb');
  const ut = rendre(html, sti, ALLE);
  assert.doesNotMatch(ut, /id="cookie"|data-consent-withdraw/u);
  assert.equal(skall.trekkUt(ut, sti).innhold, skall.trekkUt(html, sti).innhold.replace('<main class="doc">', '<main class="doc" id="hovedinnhold">'));
  assert.equal(skall.trekkUt(ut, sti).hale, skall.trekkUt(html, sti).hale);
  const med = rendre(html.replace('</body>', '<script src="/site.js" defer></script></body>'), sti, ALLE);
  assert.equal(skall.trekkUt(med, sti).banner, samtykke('nb'));
  assert.match(med, /data-consent-withdraw/u);
  assert.equal(rendre(med, sti, ALLE), med);
});

test('sider uten utrulling og beskyttede tjenester returneres uendret', () => {
  for (const s of sider) assert.equal(rendre(les(s.fil), s.sti, new Set()), les(s.fil), s.sti);
  for (const s of sider.filter((s) => ['tjeneste:vervekort', 'tjeneste:verifisering'].includes(s.nokkel))) assert.equal(rendre(les(s.fil), s.sti, new Set([s.nokkel])), les(s.fil), s.sti);
});

test('tjenester får bare tjenestestil, familie og nye språkvelgere', () => {
  for (const hode of ['A<link rel="stylesheet" href="/styles.css">B<link rel="stylesheet" href="/egen.css">', 'A<link rel="stylesheet" href="/egen.css">', 'A']) {
    const html = `<!doctype html><html><head>${hode}</head><body class="egen"><h1>Behold</h1><script>egen()</script></body></html>`;
    const ut = rendre(html, '/404.html', ALLE);
    const forventet = hode.includes('/styles.css') ? hode.replace('<link rel="stylesheet" href="/styles.css">', TJENESTESTIL) : hode.includes('/egen.css') ? hode.replace('<link', `${TJENESTESTIL}<link`) : hode + TJENESTESTIL;
    assert.equal(ut, html.replace(hode, forventet).replace('<body class="egen">', '<body class="egen" data-sidetype="tjeneste" data-tjeneste="feil">'));
    assert.equal(rendre(ut, '/404.html', ALLE), ut);
  }
});

test('hver utrullet side er nøyaktig det skall-paa lager', () => {
  assert.deepEqual(sider.filter((s) => erUtrullet(s.sti, les(s.fil)) && rendre(les(s.fil), s.sti) !== les(s.fil)).map((s) => s.sti), [], 'kjør: node scripts/skall-paa.mjs');
});
test('ingen side laster styles.css, og ingen generator kan skrive lenken igjen', () => {
  assert.equal(existsSync(join(rot, 'styles.css')), false, 'styles.css er slettet');
  assert.ok(alle.length > 800, `fant bare ${alle.length} sider`);
  assert.deepEqual(alle.filter((s) => /styles\.css/u.test(les(s.fil))).map((s) => s.sti), []);
  for (const skript of ['scripts/generer-norske-importguider.mjs', 'scripts/generer-lokalsider.mjs']) {
    const kilde = les(skript);
    assert.match(kilde, /\$\{STIL\}/u, `${skript} skriver ikke skallets stilblokk`);
    assert.doesNotMatch(kilde, /href="\/styles\.css"/u, `${skript} skriver fortsatt styles.css`);
  }
});
test('utrullede sider med fullt skall har nedlasting i toppen, i bunnen og fast på mobil', () => {
  for (const s of sider.filter((x) => x.type !== 'tjeneste' && erUtrullet(x.sti, les(x.fil)))) for (const v of ['topp', 'bunn', 'fast']) assert.equal(les(s.fil).split(`data-hent="${v}"`).length - 1, 1, `${s.sti}: ${v}`);
});
test('kjor skriver bare endrede filer i valgt rot og er idempotent', (t) => {
  assert.equal(typeof skall.kjor, 'function', 'kjor må eksporteres');
  const mappe = mkdtempSync(join(tmpdir(), 'skall-paa-'));
  t.after(() => rmSync(mappe, { recursive: true, force: true }));
  mkdirSync(join(mappe, 'verktoy/kopp-til-dl'), { recursive: true });
  const fil = 'verktoy/kopp-til-dl/index.html';
  writeFileSync(join(mappe, fil), fiks('omregner-nb'));
  writeFileSync(join(mappe, 'index.html'), '<html><body>Forside</body></html>');
  const uendretTid = statSync(join(mappe, 'index.html')).mtimeMs;
  assert.deepEqual(skall.kjor(mappe, ALLE), [fil]);
  assert.equal(readFileSync(join(mappe, fil), 'utf8'), rendre(fiks('omregner-nb'), STI['omregner-nb'], ALLE));
  const tid = statSync(join(mappe, fil)).mtimeMs;
  assert.deepEqual(skall.kjor(mappe, ALLE), []);
  assert.equal(statSync(join(mappe, fil)).mtimeMs, tid);
  assert.equal(statSync(join(mappe, 'index.html')).mtimeMs, uendretTid);
});

test('CLI skriver faktisk rendring ved utrulling og lar andre sider stå', (t) => {
  assert.equal(JSON.parse(les('package.json')).scripts.skall, 'node scripts/skall-paa.mjs');
  // Utrulling endres bare i kopien. Forventningen kommer fra resultatkontrakten.
  const mappe = realpathSync(mkdtempSync(join(tmpdir(), 'skall-cli-')));
  t.after(() => rmSync(mappe, { recursive: true, force: true }));
  cpSync(join(rot, 'scripts'), join(mappe, 'scripts'), { recursive: true });
  const fil = join(mappe, 'verktoy/kopp-til-dl/index.html');
  mkdirSync(join(mappe, 'verktoy/kopp-til-dl'), { recursive: true });
  writeFileSync(fil, fiks('omregner-nb'));
  writeFileSync(join(mappe, 'vilkar.html'), fiks('juss-nb'));
  // Kopien starter uten utrulling uansett hva repoet har rullet ut, så testen vokter CLI-en og ikke registerets stand.
  const register = join(mappe, 'scripts/sidetyper.mjs');
  const UTRULLET_REGEL = /export const UTRULLET = new Set\([^)]*\);/;
  assert.match(readFileSync(register, 'utf8'), UTRULLET_REGEL);
  writeFileSync(register, readFileSync(register, 'utf8').replace(UTRULLET_REGEL, 'export const UTRULLET = new Set();'));
  const kjorCli = () => execFileSync(process.execPath, [join(mappe, 'scripts/skall-paa.mjs')], { cwd: tmpdir(), encoding: 'utf8' });
  assert.equal(kjorCli(), 'skall-paa: 0 sider oppdatert\n');
  assert.equal(readFileSync(fil, 'utf8'), fiks('omregner-nb'));
  writeFileSync(register, readFileSync(register, 'utf8').replace('export const UTRULLET = new Set();', "export const UTRULLET = new Set(['omregner']);"));
  assert.equal(kjorCli(), 'skall-paa: 1 sider oppdatert\n');
  const ut = readFileSync(fil, 'utf8');
  assert.notEqual(ut, fiks('omregner-nb'));
  for (const del of ['<!-- skall:topp -->', '<!-- skall:bunn -->', 'data-sidetype="omregner"', 'href="/skall.css"', 'class="hopp"']) assert.ok(ut.includes(del), del);
  assert.ok(!ut.includes('href="/styles.css"'));
  assert.deepEqual(overskrifter(ut), overskrifter(fiks('omregner-nb')));
  assert.equal(readFileSync(join(mappe, 'vilkar.html'), 'utf8'), fiks('juss-nb'));
  assert.equal(execFileSync(process.execPath, [join(mappe, 'scripts/skall-paa.mjs')], { cwd: tmpdir(), encoding: 'utf8' }), 'skall-paa: 0 sider oppdatert\n');
  assert.equal(readFileSync(fil, 'utf8'), ut);
});

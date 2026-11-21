import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { rendre, trekkUt } from '../scripts/skall-paa.mjs';
import { alleSider, EKSEMPEL } from '../scripts/sidetyper.mjs';
import { SKALLTEKST } from '../scripts/skall-tekst.mjs';
import { HYLLETEKST, lokaliserHyller, synligeLenker } from '../scripts/hyller.mjs';
import { gruppeForSti } from '../scripts/locale-sider.mjs';

const rot = fileURLToPath(new URL('..', import.meta.url));
const sider = alleSider(rot).filter((s) => s.type !== 'forside');
const utrullet = new Set(sider.map((s) => s.nokkel));
const les = (s) => readFileSync(join(rot, s.fil), 'utf8');
const rendret = sider.map((s) => ({ ...s, foer: les(s), etter: rendre(les(s), s.sti, utrullet) }));
const fulltSkall = rendret.filter((s) => !['forside', 'tjeneste'].includes(s.type));
const ren = (h) => h.replace(/<!--[^]*?-->|<(script|style)\b[^>]*>[^]*?<\/\1>/giu, '');
const attr = (h, navn) => new RegExp(`\\s${navn}\\s*=\\s*(["'])(.*?)\\1`, 'iu').exec(h)?.[2];
const tekst = (h) => ren(h).replace(/<[^>]+>/gu, ' ').replace(/\s+/gu, ' ').trim();
const skjerm = (s) => String(s).replace(/[&<>"']/gu, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Leser dokumentrekkefølgen uten nettleser. Kommentarer, skript og stiltekst
// teller ikke som elementer, og tomme HTML-elementer legges ikke på stabelen.
function elementer(html) {
  const ut = [], stabel = [];
  const tomme = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
  for (const [tagg, slutt, navn] of ren(html).matchAll(/<(\/?)([a-z][\w-]*)\b[^>]*>/giu)) {
    const n = navn.toLowerCase();
    if (slutt) {
      const i = stabel.lastIndexOf(n);
      if (i >= 0) stabel.length = i;
    } else {
      ut.push({ navn: n, tagg, forfedre: [...stabel] });
      if (!tomme.has(n) && !tagg.endsWith('/>')) stabel.push(n);
    }
  }
  return ut;
}

for (const sprak of ['nb', 'sv', 'da', 'en']) {
  test(`${sprak}: hver skalltekst og hvert tekstlig attributt følger sidens språk`, () => {
    const side = sider.find((s) => s.sti === EKSEMPEL.omregner[sprak]);
    assert.ok(side, sprak);
    // Fjern bare det gamle banneret for å prøve samtykke()-grenen i rendereren.
    // Ordrett bevaring av eksisterende bannere prøves på alle sider i skall-paa.test.
    const original = les(side), d = trekkUt(original, side.sti);
    assert.ok(d.banner, 'eksemplet skal ha et gammelt banner');
    const ut = rendre(original.replace(d.banner, ''), side.sti, utrullet);
    const deler = [...ut.matchAll(/<!-- skall:(topp|bunn) -->([^]*?)<!-- \/skall:\1 -->/gu)].map((m) => m[2]);
    assert.equal(deler.length, 2);
    // Guideblokken er sidens bevarte innhold, ikke nye skalltekster.
    assert.ok(d.guider && deler[1].includes(d.guider));
    const skall = deler.join('').replace(d.guider, '');
    const t = SKALLTEKST[sprak], h = lokaliserHyller(sprak, HYLLETEKST[sprak]);
    const hylletekst = h.flatMap((x) => [x.navn, ...synligeLenker(x).map((l) => l.tekst)]);
    const spraknavn = Object.keys(gruppeForSti(side.sti).sider).map((kode) => t.sprak.valg.find((v) => v.kode === kode).navn);
    const forventet = [
      t.topp.hopp, 'mat', 'lyst', t.topp.meny, ...hylletekst, ...spraknavn, t.topp.lastNed,
      ...hylletekst, t.bunn.guider, t.bunnlinje, t.bunn.knapp,
      'mat', 'lyst', ...t.under.lenker, ...spraknavn, t.under.laget, t.under.epost,
      t.fast.knapp, t.hent.tittel, t.hent.ingress, ...t.hent.butikker,
      ...(t.samtykke.overskrift ? [t.samtykke.overskrift] : []),
      t.samtykke.tekst, t.samtykke.lenke, '.', t.samtykke.godta, t.samtykke.avvis,
    ];
    assert.equal(tekst(skall), forventet.map(skjerm).join(' '));
    const etiketter = [...ren(skall).matchAll(/\s(aria-label|alt|title)\s*=\s*(["'])(.*?)\2/gu)].map((m) => [m[1], m[3]]);
    const aria = (...verdier) => verdier.map((v) => ['aria-label', skjerm(v)]);
    const hyller = h.flatMap((x) => [['alt', ''], ...aria(x.navn)]);
    assert.deepEqual(etiketter, [
      ...aria(t.topp.merkeAria), ['alt', ''], ['alt', ''], ...aria(t.topp.menyAria, t.topp.panelAria),
      ...hyller, ...aria(t.sprak.aria, ...spraknavn), ...aria(t.bunn.aria, t.bunn.menyAria),
      ...hyller, ...aria(t.under.vilkarAria, t.sprak.aria, ...spraknavn, t.under.flaggAlt, t.hent.lukkAria),
      ['alt', skjerm(t.hent.qrAlt)],
    ]);
    const knapper = [...ut.matchAll(/<a\b[^>]*data-hent="side-cta"[^>]*>([^]*?)<\/a>/gu)];
    assert.ok(knapper.length > 0, 'butikkmerkene i eksemplet må være byttet');
    for (const [, knapp] of knapper) assert.equal(tekst(knapp), skjerm(t.innhold.knapp));
  });
}

// Alle tekster i et språks skalltekster, rekursivt (strenger i objekter og lister).
const strenger = (v) => typeof v === 'string' ? [v] : v && typeof v === 'object' ? Object.values(v).flatMap(strenger) : [];

// Rendrer ett eksempel og henter ut skallet (topp og bunn) uten sidens egne guideblokk.
function skalldeler(side) {
  const original = les(side), d = trekkUt(original, side.sti);
  const ut = rendre(d.banner ? original.replace(d.banner, '') : original, side.sti, utrullet);
  const deler = [...ut.matchAll(/<!-- skall:(topp|bunn) -->([^]*?)<!-- \/skall:\1 -->/gu)].map((m) => m[2]);
  assert.equal(deler.length, 2, side.sti);
  return deler.join('').replace(d.guider, '');
}

// Alle synlige tekster og alle aria-label/alt/title i skallet må høre til sidens språk.
export function sprakAvvik(skall, sprak, sti) {
  const t = SKALLTEKST[sprak], h = lokaliserHyller(sprak, HYLLETEKST[sprak]);
  const lov = new Set([...strenger(t), ...h.flatMap((x) => [x.navn, ...synligeLenker(x).map((l) => l.tekst)]), 'mat', 'lyst', '.', ''].map(skjerm));
  const synlig = ren(skall).split(/<[^>]+>/u).map((x) => x.replace(/\s+/gu, ' ').trim()).filter(Boolean);
  const etiketter = [...ren(skall).matchAll(/\s(?:aria-label|alt|title)\s*=\s*(["'])(.*?)\1/gu)].map((m) => m[2]);
  return [...synlig, ...etiketter].filter((x) => !lov.has(x)).map((x) => `${sti} (${sprak}): «${x}»`);
}

test('språkvakten dekker alle ikke-tjenestetyper i alle språk de finnes på', () => {
  let antall = 0;
  for (const type of ['omregner', 'guide-lang', 'guide-kort', 'guide-gammel', 'blogg', 'juss']) {
    for (const sprak of ['nb', 'sv', 'da', 'en']) {
      const sti = EKSEMPEL[type]?.[sprak];
      if (!sti) { assert.ok(type === 'guide-gammel' && sprak !== 'nb', `${type} mangler eksempel på ${sprak}`); continue; }
      const side = sider.find((s) => s.sti === sti);
      assert.ok(side, `${type}/${sprak}: ${sti}`);
      assert.equal(side.sprak, sprak, sti);
      const skall = skalldeler(side);
      assert.ok(skall.includes(skjerm(SKALLTEKST[sprak].topp.hopp)), `${sti}: skallet må ha hopp-lenka på ${sprak}`);
      assert.deepEqual(sprakAvvik(skall, sprak, sti), []);
      antall++;
    }
  }
  assert.equal(antall, 6 * 4 - 3, 'seks typer på fire språk, guide-gammel bare på nb');
});

test('språkvakten slår ut når en bloggside har skall på feil språk', () => {
  const side = sider.find((s) => s.sti === EKSEMPEL.blogg.sv);
  const nb = SKALLTEKST.nb.topp.hopp;
  assert.notEqual(nb, SKALLTEKST.sv.topp.hopp);
  const skall = skalldeler(side).replace(skjerm(SKALLTEKST.sv.topp.hopp), skjerm(nb)).replace(skjerm(SKALLTEKST.sv.topp.meny), skjerm(SKALLTEKST.nb.topp.meny));
  assert.ok(sprakAvvik(skall, 'sv', side.sti).length > 0);
});

test('canonical, hreflang og JSON-LD er byte-identiske på alle sider', () => {
  const seo = (h) => [...h.matchAll(/<link\b[^>]*>|<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[^]*?<\/script>/giu)]
    .map((m) => m[0]).filter((x) => x.startsWith('<script') || attr(x, 'rel') === 'canonical' || attr(x, 'hreflang') !== undefined);
  for (const s of rendret) assert.deepEqual(seo(s.etter), seo(s.foer), s.sti);
});

test('rendringen lager ingen nye doble id-er på noen side', () => {
  const antall = (h) => {
    const ids = new Map();
    for (const e of elementer(h)) {
      const id = attr(e.tagg, 'id');
      if (id !== undefined) ids.set(id, (ids.get(id) ?? 0) + 1);
    }
    return ids;
  };
  for (const s of rendret) {
    const foer = antall(s.foer);
    for (const [id, n] of antall(s.etter)) assert.ok(n <= Math.max(1, foer.get(id) ?? 0), `${s.sti}: ${id} forekommer ${n} ganger`);
  }
});

test('alle 1032 sider med fullt skall har nøyaktig ett banner-landemerke', () => {
  assert.equal(fulltSkall.length, 1032);
  for (const s of fulltSkall) {
    const bannere = elementer(s.etter).filter((e) => attr(e.tagg, 'role') === 'banner'
      || (e.navn === 'header' && !attr(e.tagg, 'role') && !e.forfedre.some((n) => ['article', 'aside', 'main', 'nav', 'section'].includes(n))));
    assert.equal(bannere.length, 1, s.sti);
    assert.equal(attr(bannere[0].tagg, 'class'), 'topp', s.sti);
  }
});

test('alle 1032 sider med fullt skall har én hopp-lenke og ett eksisterende mål', () => {
  assert.equal(fulltSkall.length, 1032);
  for (const s of fulltSkall) {
    const alle = elementer(s.etter);
    const lenker = alle.filter((e) => e.navn === 'a' && (
      (attr(e.tagg, 'class') ?? '').split(/\s+/u).some((k) => ['hopp', 'skip-link'].includes(k))
      || attr(e.tagg, 'href') === '#hovedinnhold'));
    assert.equal(lenker.length, 1, s.sti);
    assert.equal(attr(lenker[0].tagg, 'href'), '#hovedinnhold', s.sti);
    assert.equal(alle.filter((e) => attr(e.tagg, 'id') === 'hovedinnhold').length, 1, s.sti);
  }
});

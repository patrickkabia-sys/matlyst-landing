// Juss bølge 1 (13.10.2026): B1, Meta Pixel ut og B21 (kontaktpunkt etter DSA).
// Se matlyst-kontroll/rapporter/juss-plan-global.md.
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import test from 'node:test';

const ROOT = new URL('..', import.meta.url).pathname;
const les = (sti) => readFileSync(join(ROOT, sti), 'utf8');

const SPRAK = {
  nb: {
    personvern: 'personvern.html',
    sletting: 'slett-konto.html',
    vilkar: 'vilkar.html',
    sprakene: /norsk, svensk, dansk eller engelsk/u,
  },
  sv: {
    personvern: 'sv/integritet/index.html',
    sletting: 'sv/radera-konto/index.html',
    vilkar: 'sv/villkor/index.html',
    sprakene: /svenska, norska, danska eller engelska/u,
  },
  da: {
    personvern: 'da/privatliv/index.html',
    sletting: 'da/slet-konto/index.html',
    vilkar: 'da/vilkaar/index.html',
    sprakene: /dansk, norsk, svensk eller engelsk/u,
  },
  en: {
    personvern: 'en/privacy/index.html',
    sletting: 'en/privacy/index.html',
    vilkar: 'en/terms/index.html',
    sprakene: /English, Norwegian, Swedish or Danish/u,
  },
};
const ANDRE_SPRAK = ['sv', 'da', 'en'].filter((k) => !(k in SPRAK));

function filer(mappe, endelser, ut = []) {
  for (const navn of readdirSync(mappe)) {
    if (['.git', 'node_modules', 'test', 'qa', 'images', 'fonts'].includes(navn)) continue;
    const sti = join(mappe, navn);
    if (statSync(sti).isDirectory()) filer(sti, endelser, ut);
    else if (endelser.some((e) => navn.endsWith(e))) ut.push(sti);
  }
  return ut;
}
const kodefiler = () => filer(ROOT, ['.html', '.js', '.mjs']);
const sider = () => filer(ROOT, ['.html']).filter((f) => !ANDRE_SPRAK.some((k) => relative(ROOT, f).startsWith(`${k}/`)));

const HOBBY = /hobby|fritidsprosjekt|sideprosjekt|sidoprojekt|sideprojekt|personlig(t)? (prosjekt|projekt)|personal project|side project|pet project/iu;
const KOSTHOLD = /\ballergi(er)?\b|\ballergies\b|kostholdsvalg|kostval|kostvalg|kostpræferencer|dietary (choices|preferences)/iu;

test('B1: ingen side kaller Matlyst et hobbyprosjekt eller et personlig prosjekt', () => {
  for (const fil of sider()) {
    assert.doesNotMatch(readFileSync(fil, 'utf8'), HOBBY, relative(ROOT, fil));
  }
});

test('B1: personvern og sletting nevner ikke allergier eller kostholdsvalg som noe vi behandler', () => {
  for (const s of Object.values(SPRAK)) {
    assert.doesNotMatch(les(s.personvern), KOSTHOLD, s.personvern);
    assert.doesNotMatch(les(s.sletting), KOSTHOLD, s.sletting);
  }
  assert.match(les('personvern.html'), /Preferanser du oppgir: mål og måleenheter/u);
});

test('Meta Pixel er fjernet fra alle skript og sider', () => {
  for (const fil of kodefiler()) {
    const innhold = readFileSync(fil, 'utf8');
    assert.ok(!innhold.includes('fbq('), `${relative(ROOT, fil)}: fbq(`);
    assert.ok(!innhold.includes('connect.facebook.net'), `${relative(ROOT, fil)}: connect.facebook.net`);
  }
  for (const fil of sider()) {
    assert.doesNotMatch(readFileSync(fil, 'utf8'), /Meta Pixel/iu, relative(ROOT, fil));
  }
});

test('B21: vilkårene har kontaktpunkt etter DSA, språk og adresse for å melde ulovlig innhold', () => {
  for (const s of Object.values(SPRAK)) {
    const html = les(s.vilkar);
    assert.match(html, /DSA/u, `${s.vilkar}: DSA`);
    assert.match(html, s.sprakene, `${s.vilkar}: språk`);
    const ulovlig = html.match(/id="ulovlig-innhold"[\s\S]*?<\/p>/u)?.[0];
    assert.ok(ulovlig, `${s.vilkar}: avsnitt om ulovlig innhold`);
    assert.match(ulovlig, /mailto:hei@matlyst-app\.no/u, `${s.vilkar}: adresse`);
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { alleSider, TYPER } from '../scripts/sidetyper.mjs';
import { utenKommentarer, klasserUtenRegel, klasserIVelgere, velgerliste, regler } from './hjelp/klassedekning.mjs';

const les = (f) => readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
const css = utenKommentarer(les('side.css'));
const tokens = utenKommentarer(les('tokens.css'));
const skall = utenKommentarer(les('skall.css'));
const velgere = velgerliste(css);

test('side.css har delene i rekkefølge', () => {
  const rå = les('side.css');
  const navn = ['Grunnstil', 'Omregner', 'Lang guide', 'Kort guide', 'Eldre sider', 'Blogg', 'Juss'];
  const pos = navn.map((n) => rå.indexOf(`/* == ${n} == */`));
  assert.ok(pos.every((p) => p > -1), `mangler del: ${pos}`);
  assert.deepEqual([...pos].sort((a, b) => a - b), pos);
});

test('side.css bruker bare tokens fra tokens.css, uten heksverdier', () => {
  const definert = new Set([...tokens.matchAll(/(--[\w-]+)\s*:/gu)].map((m) => m[1]));
  const brukt = [...css.matchAll(/var\((--[\w-]+)/gu)].map((m) => m[1]);
  assert.deepEqual(brukt.filter((t) => !definert.has(t)), []);
  assert.deepEqual(css.match(/#[0-9a-fA-F]{3,8}\b/gu) ?? [], []);
  assert.deepEqual(css.match(/\b(?:hsla?|hwb|lab|lch|oklab|oklch|color)\(/gu) ?? [], [], 'bare tokens; color-mix(var(...)) er lov');
  assert.deepEqual([...css.matchAll(/(?:color|background(?:-color)?|border(?:-[a-z]+)*|fill|stroke|outline(?:-color)?)\s*:[^;}]*\b(white|black|red|green|blue|gray|grey|orange|purple|pink|brown|yellow)\b/gu)].map((m) => m[0]), []);
  assert.deepEqual([...css.matchAll(/rgba?\(\s*(?!var\()[^)]*\)/gu)].map((m) => m[0]), []);
});

test('skriftstørrelser i side.css er i rem', () => {
  assert.deepEqual([...css.matchAll(/font(?:-size)?:[^;}]*?\d+(?:\.\d+)?px/gu)].map((m) => m[0]), []);
});

test('side.css rører ikke skallet', () => {
  assert.deepEqual(velgere.filter((v) => /(^|[\s>+~])(nav|footer)(?![\w-])|\.(topp|panel|reol|fag|faghode|bunn|bunnrad|alle-guider|under|underlinje|fast|hent|henttittel|side|kort|blad|knapp|cookie|ck-btn|merke|ordmerke)(?![\w-])/u.test(v)), []);
});

test('bevegelse står stille ved redusert bevegelse', () => {
  const med = /@media\s*\(prefers-reduced-motion:\s*reduce\)/u;
  for (const [navn, kilde] of [['side.css', css], ['skall.css', skall]]) {
    const harBevegelse = /(transition|animation)\s*:/u.test(kilde.replace(/@media\s*\(prefers-reduced-motion[^{]*\{[\s\S]*?\}\s*\}/u, ''));
    if (harBevegelse) assert.match(kilde, med, `${navn} har bevegelse uten reduce-regel`);
  }
});

test('klassedekningen ser en klasse uten regel', () => {
  assert.ok(klasserUtenRegel('guide-kort', {}).includes('disp'));
});

test('grunnstilen dekker kjernen i hver byggekloss', () => {
  for (const velger of ['.locale-page-hero', '.locale-prose', '.answer', '.table-wrap', '.i-appen', '.app-cta', '.page-cta', '.faq', '.related', '.omregner-liste', '.steps', '.step']) {
    assert.ok(velgere.some((v) => v.includes(velger)), `ingen regel for ${velger}`);
  }
});

test('bannerstilen i skall.css er på plass', () => {
  assert.ok(/\.cookie\b[^{}]*\{[^}]*border-radius:\s*28px/u.test(skall));
  assert.ok(regler(skall).some((r) => /\.ck-btn\b/u.test(r.velger)));
  assert.match(skall, /\.cookie h3/u);
});

test('godta og avvis har samme regler i skall.css (grovt; den beregnede testen tar bredder)', () => {
  const normalisert = (navn) => regler(skall)
    .filter((r) => r.velger.split(',').some((v) => new RegExp(`\\.${navn}(?![\\w-])`, 'u').test(v)))
    .map((r) => JSON.stringify([r.velger.split(',').map((v) => v.trim().replace(/\.ck-(accept|reject)(?![\w-])/gu, '.ck-X')).sort(), r.kropp.replace(/\s+/gu, '')]))
    .sort();
  const godta = normalisert('ck-accept');
  assert.ok(godta.length > 0, 'ingen regel for .ck-accept');
  assert.deepEqual(normalisert('ck-reject'), godta);
});

test('klasseleseren leser bare velgere', () => {
  assert.deepEqual([...klasserIVelgere('.a,.b > .c[href$=".pdf"]{background:url(x.webp);margin:1.5rem}@media (min-width:1px){.d{color:red}}')].sort(), ['a', 'b', 'c', 'd']);
});

test('velgerlisten tar med den første regelen inne i @media', () => {
  assert.deepEqual(velgerliste('@media (min-width:1px){.a{x:y}.b{x:y}}'), ['.a', '.b']);
});

test('skriftstørrelser bruker ikke vw (følger ikke tekststørrelsen)', () => {
  assert.deepEqual([...css.matchAll(/font-size:[^;}]*\dvw/gu)].map((m) => m[0]), []);
});

test('omregnersidene har stil for alle klassene i innholdet', () => {
  assert.deepEqual(klasserUtenRegel('omregner', {
    'omregner-data': 'bare data for kalkulatoren i site.js',
    'disp': 'skriftvalg på overskrifter, ingen egen regel', 'has-toc': 'markør; innholdsfortegnelsen skjules', 'toc-title': 'skjules sammen med .toc',
    'i-import': 'velger bilde i app-bevis', 'i-kokemodus': 'velger bilde i app-bevis',
    'i-mapper': 'velger bilde i app-bevis', 'i-skalering': 'velger bilde i app-bevis', 'i-enheter': 'velger bilde i app-bevis',
  }), []);
});

test('lange guider har stil for alle klassene i innholdet', () => {
  assert.deepEqual(klasserUtenRegel('guide-lang', {
    'disp': 'skriftvalg på overskrifter, ingen egen regel', 'has-toc': 'markør på lesekolonnen',
    'i-ask': 'velger bilde i app-bevis', 'i-eksport': 'velger bilde i app-bevis', 'i-enheter': 'velger bilde i app-bevis',
    'i-import': 'velger bilde i app-bevis', 'i-kokemodus': 'velger bilde i app-bevis', 'i-liste': 'velger bilde i app-bevis',
    'i-mapper': 'velger bilde i app-bevis', 'i-pantry': 'velger bilde i app-bevis', 'i-plan': 'velger bilde i app-bevis',
    'i-skalering': 'velger bilde i app-bevis',
  }), []);
});

test('lange guider: filmer og bilder i lesekolonnen har en regel som tvinger dem inn i bredden', () => {
  const rå = les('side.css');
  const del = rå.slice(rå.indexOf('/* == Lang guide == */'), rå.indexOf('/* == Kort guide == */'));
  assert.ok(del.length > 100);
  assert.match(del, /\.locale-prose :is\(video,\.tel\)\{[^}]*width:100%[^}]*max-width:300px/u);
});

test('korte guider har stil for alle klassene i innholdet', () => {
  assert.deepEqual(klasserUtenRegel('guide-kort', { 'disp': 'skriftvalg på overskrifter, ingen egen regel' }), []);
});

test('korte guider: stegene, idelisten og kildepillen er avgrenset til guide-kort', () => {
  const rå = les('side.css');
  const start = rå.indexOf('/* == Kort guide == */');
  const slutt = rå.indexOf('/* == Eldre sider == */');
  assert.ok(start > -1 && slutt > start);
  const del = utenKommentarer(rå.slice(start, slutt));
  assert.ok(regler(del).length >= 6);
  for (const r of regler(del)) for (const v of r.velger.split(',')) assert.ok(v.trim().startsWith('body[data-sidetype="guide-kort"] '), `ikke avgrenset: ${v.trim()}`);
  assert.ok(!/counter-(reset|increment)/u.test(del), 'stegtelleren er list-item-telleren, som følger start, reversed og li[value]');
  for (const nokkel of ['content:counter(list-item)', ':not([reversed]):not(:has(> li[value]))', 'ul.ide-liste{display:grid;grid-template-columns:repeat(2', 'a[rel~="noopener"]:only-child{display:inline-flex']) assert.ok(del.includes(nokkel), `mangler ${nokkel}`);
});

test('de eldre sidene har stil for alle klassene i innholdet', () => {
  assert.deepEqual(klasserUtenRegel('guide-gammel', { 'disp': 'skriftvalg på overskrifter, ingen egen regel' }), []);
});

test('de eldre sidene: alle regler i delen er avgrenset til guide-gammel, og tekst står i rem', () => {
  const rå = les('side.css');
  const start = rå.indexOf('/* == Eldre sider == */');
  const slutt = rå.indexOf('/* == Blogg == */');
  assert.ok(start > -1 && slutt > start);
  const del = utenKommentarer(rå.slice(start, slutt));
  assert.ok(regler(del).length >= 15);
  for (const r of regler(del)) for (const v of r.velger.split(',')) assert.ok(v.trim().startsWith('body[data-sidetype="guide-gammel"] '), `ikke avgrenset: ${v.trim()}`);
  assert.deepEqual(del.match(/font(?:-size)?:[^;}]*?\d+(?:\.\d+)?(?:px|vw)/gu) ?? [], []);
  for (const nokkel of ['.hero h1{margin', 'main.prose figure img{width:100%;max-width:300px', '.page-cta:not(:has(h2)){', '.feat{display:grid', '.feat-text h2{margin', 'main.prose a.more{', '.page-cta:not(main *){width:calc(']) assert.ok(del.includes(nokkel), `mangler ${nokkel}`);
});

test('hver sidetype side.css avgrenser til finnes, og en ekte side bærer den', () => {
  const typer = new Set([...css.matchAll(/data-sidetype="([^"]+)"/gu)].map((m) => m[1]));
  assert.ok(typer.has('guide-lang') && typer.has('omregner') && typer.has('guide-kort') && typer.has('guide-gammel'), 'forventet avgrensning mangler');
  const sider = alleSider(new URL('..', import.meta.url).pathname);
  for (const t of typer) {
    assert.ok(TYPER.includes(t), `ukjent sidetype i side.css: ${t}`);
    const side = sider.find((s) => s.type === t);
    assert.ok(side, `ingen side av typen ${t}`);
    assert.ok(les(side.fil).includes(`data-sidetype="${t}"`), `${side.sti} mangler data-sidetype="${t}"`);
  }
});

test('relaterte guider er en rolig liste i Grunnstil, ikke piller', () => {
  const rå = les('side.css');
  const del = utenKommentarer(rå.slice(rå.indexOf('/* == Grunnstil == */'), rå.indexOf('/* == Omregner == */')));
  const ul = regler(del).find((r) => r.velger === '.related ul');
  assert.ok(ul && /display:grid/u.test(ul.kropp) && /border-top:1px solid var\(--linje\)/u.test(ul.kropp));
  const a = regler(del).find((r) => r.velger === '.related li a');
  assert.ok(a && /font-weight:700/u.test(a.kropp) && /text-decoration:underline/u.test(a.kropp));
  assert.ok(!/border-radius|border:1px/u.test(a.kropp), 'ingen pille');
  assert.ok(!/text-align:center/u.test(regler(del).find((r) => r.velger === '.related').kropp));
  assert.ok(/@media \(min-width:721px\)\{\.related ul\{grid-template-columns:1fr 1fr/u.test(del));
});

test('bloggsidene har stil for alle klassene i innholdet', () => {
  assert.deepEqual(klasserUtenRegel('blogg', {
    'disp': 'skriftvalg på overskrifter, ingen egen regel',
    'blogg-artikkel': 'omslag rundt hele artikkelen, ingen egen stil',
  }), []);
});

test('bloggen: kilder i autoartikler (bare i generert innhold, ikke på de 33 sidene) har en regel', () => {
  assert.ok(klasserIVelgere(les('side.css')).has('blogg-kilder'));
});

test('bloggen: reglene er avgrenset til blogg, tekst står i rem, og delen har alle sine deler', () => {
  const rå = les('side.css');
  const start = rå.indexOf('/* == Blogg == */');
  const slutt = rå.indexOf('/* == Juss == */');
  assert.ok(start > -1 && slutt > start);
  const del = utenKommentarer(rå.slice(start, slutt));
  assert.ok(regler(del).length >= 20);
  for (const r of regler(del)) for (const v of r.velger.split(',')) assert.ok(v.trim().startsWith('body[data-sidetype="blogg"] '), `ikke avgrenset: ${v.trim()}`);
  assert.deepEqual([...del.matchAll(/font-size:[^;}]*px/gu)].map((m) => m[0]), [], 'tekststørrelser i rem, ikke px');
  for (const nokkel of ['ul.blogg-kort{display:grid;grid-template-columns:repeat(3', 'border-radius:24px;overflow:hidden', 'figure.blogg-forside{max-width:68ch', '.merknad{font-size:.9375rem', 'scroll-snap-type:x mandatory', '.blogg-flere li a{display:inline-flex']) assert.ok(del.includes(nokkel), `mangler ${nokkel}`);
});

test('bloggen: galleriraden er fokuserbar, ellers kan tastaturet ikke sveipe den', () => {
  const rot = new URL('..', import.meta.url).pathname;
  let rader = 0, galleri = 0;
  for (const s of alleSider(rot).filter((x) => x.type === 'blogg')) {
    const html = readFileSync(new URL(`../${s.fil}`, import.meta.url), 'utf8');
    const startTagger = [...html.matchAll(/<[a-z][^<>]*>/gu)].map((m) => m[0]);
    const rad = startTagger.filter((t) => /\sclass="([^"]*\s)?blogg-galleri-rad(\s[^"]*)?"/u.test(t));
    galleri += startTagger.filter((t) => /\sclass="([^"]*\s)?blogg-galleri(\s[^"]*)?"/u.test(t)).length;
    rader += rad.length;
    for (const t of rad) assert.equal(t.match(/\stabindex="[^"]*"/gu)?.length, 1, `${s.sti}: nøyaktig ett tabindex`), assert.match(t, /\stabindex="0"/u, s.sti);
  }
  assert.ok(rader >= 29, `forventet minst 29 galleririder, fant ${rader}`);
  assert.equal(rader, galleri, 'én rad per galleri');
  assert.match(les('scripts/blogg.mjs'), /<div class="blogg-galleri-rad" tabindex="0">/u);
});

test('de juridiske sidene har stil for alle klassene i innholdet', () => {
  assert.deepEqual(klasserUtenRegel('juss', {
    'disp': 'skriftvalg på overskrifter, ingen egen regel',
  }), []);
});

test('juss: reglene er avgrenset til juss, tekst står i rem, og delen har alle sine deler', () => {
  const rå = les('side.css');
  const start = rå.indexOf('/* == Juss == */');
  assert.ok(start > -1);
  const del = utenKommentarer(rå.slice(start));
  assert.ok(regler(del).length >= 18, `forventet minst 18 regler, fant ${regler(del).length}`);
  // :is(a,b) har komma inni parentesen; bare komma på øverste nivå skiller velgere.
  const toppnivaa = (v) => { const ut = []; let dybde = 0, ny = ''; for (const c of v) { if (c === '(') dybde++; if (c === ')') dybde--; if (c === ',' && dybde === 0) { ut.push(ny.trim()); ny = ''; } else ny += c; } return [...ut, ny.trim()]; };
  for (const r of regler(del)) for (const v of toppnivaa(r.velger)) assert.ok(v.startsWith('body[data-sidetype="juss"] '), `ikke avgrenset: ${v}`);
  assert.deepEqual([...del.matchAll(/font(?:-size)?:[^;}]*px/gu)].map((m) => m[0]), [], 'tekststørrelser i rem, ikke px');
  assert.ok(!/(^|[\s>+~])(nav|footer)(?![\w-])/u.test(del), 'juss rører ikke skallet');
  for (const nokkel of ['main.legal-doc{max-width:68ch', '.doc-kicker', '.doc-updated', '.legal-updated', '.legal-callout', 'border-radius:28px', 'background:var(--hylle)', 'ul:not([class])']) assert.ok(del.includes(nokkel), `mangler ${nokkel}`);
});

test('juss: bare kortet har bakgrunn, og lister med lenke blir aldri piller', () => {
  const del = utenKommentarer(les('side.css').slice(les('side.css').indexOf('/* == Juss == */')));
  const medBakgrunn = regler(del).filter((r) => /background(?:-color)?:/u.test(r.kropp) && !/::(?:before|after)/u.test(r.velger)).map((r) => r.velger);
  for (const v of medBakgrunn) assert.match(v, /callout/u, `bare kortet skal ha bakgrunn, men: ${v}`);
  assert.ok(medBakgrunn.length >= 1, 'kortet har ingen bakgrunn');
  assert.ok(!/border-radius:999px/u.test(del), 'ingen piller i juss');
});

test('juss: de tolv sidene har nøyaktig den kjente lesekolonnen, uten innsatt wrapper', () => {
  const rot = new URL('..', import.meta.url).pathname;
  const sider = alleSider(rot).filter((s) => s.type === 'juss');
  assert.equal(sider.length, 12);
  for (const s of sider) {
    const html = les(s.fil);
    const mains = [...html.matchAll(/<main\b[^>]*>/gu)].map((m) => m[0]);
    assert.equal(mains.length, 1, s.sti);
    assert.match(mains[0], /\sclass="(doc|legal-doc)"/u, s.sti);
    assert.ok(html.includes('data-sidetype="juss"'), `${s.sti} er ikke rendret med juss`);
    assert.ok(html.includes('<link rel="stylesheet" href="/side.css">'), s.sti);
  }
});

test('juss: innerHTML i main.doc og main.legal-doc er byte for byte lik fasiten (wrapper eller tekstendring gir rødt)', () => {
  const fasit = JSON.parse(les('test/fasit/juss-innerhtml.json'));
  const sider = alleSider(new URL('..', import.meta.url).pathname).filter((x) => x.type === 'juss');
  assert.equal(sider.length, 12);
  assert.deepEqual(Object.keys(fasit).sort(), sider.map((x) => x.fil).sort());
  for (const s of sider) {
    const html = les(s.fil);
    const start = /<main\b[^>]*\bclass="(?:doc|legal-doc)"[^>]*>/u.exec(html);
    assert.ok(start, s.sti);
    const slutt = html.indexOf('</main>', start.index + start[0].length);
    assert.ok(slutt > -1, s.sti);
    const inne = html.slice(start.index + start[0].length, slutt);
    assert.equal(createHash('sha256').update(inne).digest('hex'), fasit[s.fil], `${s.sti}: innholdet i main er endret (tekst eller innsatt wrapper)`);
  }
});

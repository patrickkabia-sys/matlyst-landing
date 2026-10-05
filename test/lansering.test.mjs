import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const ROOT = new URL('..', import.meta.url).pathname;
const les = (path) => readFileSync(join(ROOT, path), 'utf8');

function finnHtml(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? finnHtml(path) : entry.name === 'index.html' ? [path] : [];
  });
}

const urlTilFil = (href) => {
  const path = new URL(href).pathname;
  return join(ROOT, path.endsWith('/') ? `${path}index.html` : path);
};

test('robots.txt tillater alt og peker på norsk, svensk og dansk sitemap', () => {
  const robots = les('robots.txt');
  assert.match(robots, /^User-agent: \*\nAllow: \/\n/u);
  for (const navn of ['sitemap.xml', 'sitemap-sv.xml', 'sitemap-da.xml']) {
    assert.match(robots, new RegExp(`^Sitemap: https://matlyst-app\\.no/${navn.replace('.', '\\.')}$`, 'mu'), navn);
    assert.ok(existsSync(join(ROOT, navn)), navn);
  }
});

for (const lang of ['sv', 'da']) {
  test(`sitemap-${lang}.xml har alle indekserbare ${lang}-sider med lastmod og gjensidige alternativer`, () => {
    const xml = les(`sitemap-${lang}.xml`);
    assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>\n<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9" xmlns:xhtml="http:\/\/www\.w3\.org\/1999\/xhtml">/u);
    const blokker = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/gu)].map(([, blokk]) => blokk);
    const loc = blokker.map((blokk) => blokk.match(/<loc>([^<]+)<\/loc>/u)[1]);
    const forventet = finnHtml(join(ROOT, lang))
      .map((fil) => readFileSync(fil, 'utf8'))
      .filter((html) => !html.includes('content="noindex'))
      .map((html) => html.match(/<link rel="canonical" href="([^"]+)">/u)[1])
      .sort();
    assert.equal(forventet.length, 21);
    assert.deepEqual([...loc].sort(), forventet);
    for (const blokk of blokker) {
      const side = blokk.match(/<loc>([^<]+)<\/loc>/u)[1];
      assert.match(blokk, /<loc>[^<]+<\/loc>\s*<lastmod>2026-10-05<\/lastmod>/u, side);
      const html = readFileSync(urlTilFil(side), 'utf8');
      assert.doesNotMatch(html, /content="noindex/u, side);
      const iSitemap = [...blokk.matchAll(/hreflang="([^"]+)" href="([^"]+)"/gu)].map(([, k, h]) => `${k} ${h}`).sort();
      const iHtml = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/gu)].map(([, k, h]) => `${k} ${h}`).sort();
      assert.deepEqual(iSitemap, iHtml, side);
      for (const linje of iSitemap) assert.ok(existsSync(urlTilFil(linje.split(' ')[1])), linje);
    }
  });
}

test('det norske sitemapet er fortsatt bare norske sider', () => {
  assert.doesNotMatch(les('sitemap.xml'), /matlyst-app\.no\/(?:sv|da)\//u);
});


test('forsidene har posisjoneringen i ingress og meta description, uten superlativer', () => {
  const forsider = [
    ['index.html', 'Oppskriftsappen som oversetter og tilpasser oppskriftene dine.'],
    ['sv/index.html', 'Receptappen som översätter och anpassar dina recept.', 'Matlyst översätter och anpassar dina recept.'],
    ['da/index.html', 'Opskriftsappen, der oversætter og tilpasser dine opskrifter.', 'Matlyst oversætter og tilpasser dine opskrifter.'],
  ];
  const superlativ = /(?<!\p{L})(?:beste?|bedste|bästa?|best|nr\. ?1|nummer (?:1|én|en|ett)|#1)(?!\p{L})/iu;
  for (const [fil, posisjonering, ingress = posisjonering] of forsider) {
    const html = les(fil);
    assert.ok(html.match(/<meta name="description" content="([^"]+)"/u)[1].startsWith(posisjonering), `${fil}: meta description`);
    assert.ok(html.match(/<p class="lead">([^<]+)<\/p>/u)[1].startsWith(ingress), `${fil}: ingress`);
    const synlig = html.replace(/<script[\s\S]*?<\/script>/gu, ' ').replace(/<[^>]+>/gu, ' ');
    assert.doesNotMatch(synlig, superlativ, fil);
    assert.doesNotMatch(html.match(/<head>[\s\S]*?<\/head>/u)[0], superlativ, `${fil}: head`);
  }
});

test('lanseringsstatusen er oppdatert og samsvarer mellom JSON og markdown', () => {
  const status = JSON.parse(les('locale-readiness.json'));
  assert.equal(status.status_dato, '2026-10-05');
  for (const lang of ['sv', 'da']) {
    assert.equal(status[lang].public, true, lang);
    assert.ok(Object.keys(status[lang].lukket).length > 0, lang);
    assert.ok('apple_store_listing' in status[lang].apne, lang);
  }
  const md = les('LOCALE-READINESS.md');
  assert.match(md, /Merge av PR #9 er lanseringen/u);
  assert.equal((md.match(/^- \[ \]/gmu) ?? []).length, Object.keys(status.sv.apne).length);
});

test('llms.txt er skandinavisk, posisjonert og uten udokumenterte påstander', () => {
  const llms = les('llms.txt');
  assert.match(llms, /^# Matlyst\n\n> Matlyst er oppskriftsappen for å oversette og tilpasse oppskrifter\./u);
  for (const seksjon of ['## Norsk', '## Dansk', '## Svenska', '## English']) assert.ok(llms.includes(`\n${seksjon}\n`), seksjon);
  assert.ok(llms.includes('5,0 i App Store (12 vurderinger, Norge, per 5. oktober 2026)'));
  for (const sprak of ['norsk bokmål (nb)', 'dansk (da)', 'svensk (sv)']) assert.ok(llms.includes(sprak), sprak);
  for (const navn of ['Spør Matlyst', 'Spørg Matlyst', 'Fråga Matlyst']) assert.ok(llms.includes(navn), navn);
  assert.match(llms, /metriske mål/u);
  assert.doesNotMatch(llms, /Alt på norsk|oversettes[^.\n]*til norsk|(?<!\p{L})(?:beste?|bedste|bästa?|best|nr\. ?1)(?!\p{L})|håndskrev|handskriv|håndskrift|ubegrenset|unlimited|Pinterest|PDF/iu);
  const lenker = [...llms.matchAll(/https:\/\/matlyst-app\.no(\/[^\s)]*)/gu)].map(([, sti]) => sti);
  for (const sti of ['/sv/', '/da/', '/sv/importera-recept/', '/da/importer-opskrifter/', '/sv/veckomeny-app/', '/da/madplan-app/']) {
    assert.ok(lenker.includes(sti), sti);
  }
  for (const sti of lenker) {
    const fil = join(ROOT, sti.endsWith('/') ? `${sti}index.html` : sti);
    assert.ok(existsSync(fil), `${sti} finnes ikke`);
  }
});

test('produktpåstandene i llms.txt har kodebevis i produktpaastander.md', () => {
  const qa = les('qa/sv-da/produktpaastander.md');
  const del = qa.slice(qa.indexOf('## llms.txt og forsidene'));
  assert.ok(del.length > 0);
  const rader = del.split('\n').filter((linje) => /^\| (?!Påstand|---)/u.test(linje));
  assert.ok(rader.length >= 15, `${rader.length} rader`);
  for (const rad of rader) assert.equal(rad.split(' | ').length, 2, rad);
  for (const krav of ['Oversetting', 'Metriske', 'Spør Matlyst / Spørg Matlyst / Fråga Matlyst', 'Tilpassing', 'Fem gratis', '5,0 i App Store']) {
    assert.ok(rader.some((rad) => rad.includes(krav)), krav);
  }
});

test('llms.txt beskriver lanseringstilstanden etter #536', () => {
  const llms = les('llms.txt');
  assert.doesNotMatch(llms, /foreløpig på norsk|indtil videre på norsk|tills vidare på norska|currently written in Norwegian|Ugemenu/u);
  const dansk = llms.slice(llms.indexOf('\n## Dansk\n'), llms.indexOf('\n## Svenska\n'));
  assert.match(dansk, /planlægger du ugen i Madplan/u);
  assert.match(dansk, /Spørg Matlyst[^.]*svarene kommer på dansk/u);
  assert.match(llms.slice(llms.indexOf('\n## Svenska\n')), /Fråga Matlyst[^.]*svaren kommer på svenska/u);
  const qa = les('qa/sv-da/produktpaastander.md');
  assert.ok((qa.match(/forutsetter #536/gu) ?? []).length >= 3);
  assert.match(qa, /origin\/feat\/f2-spor-matlyst-da-sv/u);
  assert.match(qa, /Håndskrevne oppskrifter[^\n]*import-recipe\/index\.ts:1318/u);
});

test('#9 merges ikke før #536 er merget og deployet', () => {
  assert.match(les('LOCALE-READINESS.md'), /#9 merges ikke før #536 er merget og edge-funksjonen er deployet/u);
  assert.match(JSON.parse(les('locale-readiness.json')).forutsetning, /#536/u);
});

test('alle vurderingstall sier 5,0 og 12 vurderinger', () => {
  assert.match(les('index.html'), /"ratingValue": "5\.0", "ratingCount": "12"/u);
  assert.match(les('sv/index.html'), /5,0 i norska App Store den 5 oktober 2026, baserat på 12 betyg\./u);
  assert.match(les('da/index.html'), /5,0 i den norske App Store den 5\. oktober 2026, baseret på 12 vurderinger\./u);
  assert.ok(les('llms.txt').includes('5,0 i App Store (12 vurderinger, Norge, per 5. oktober 2026)'));
  for (const fil of ['index.html', 'sv/index.html', 'da/index.html', 'llms.txt']) {
    assert.doesNotMatch(les(fil), /"ratingCount": "(?!12")|\b(?!12\b)\d+ (?:vurderinger|betyg|ratings)\b/u, fil);
  }
});

test('nb-forsiden: grammatisk importsetning, presis handleliste og ny posisjonering i JSON-LD', () => {
  const html = les('index.html');
  const setning = 'Importer fra en lenke, en video eller et bilde, også av håndskrevne oppskrifter. Planlegg uka og send ukas ingredienser til handlelista.';
  for (const felt of [/<meta name="description" content="([^"]+)"/u, /<meta property="og:description" content="([^"]+)"/u, /<meta name="twitter:description" content="([^"]+)"/u, /"description": "([^"]+)"/u]) {
    const verdi = html.match(felt)[1];
    assert.ok(verdi.startsWith(`Oppskriftsappen som oversetter og tilpasser oppskriftene dine. ${setning}`), verdi);
  }
  assert.doesNotMatch(html, /skrive seg selv|også håndskrevne,|\buken\b/u);
  const ingress = html.match(/<p class="lead">([^<]+)<\/p>/u)[1];
  assert.equal((ingress.match(/oversett/gu) ?? []).length, 1, ingress);
});

test('sv/da-forsiden gjentar ikke posisjoneringen i overlinje og ingress', () => {
  for (const [fil, ord] of [['sv/index.html', 'Receptappen'], ['da/index.html', 'Opskriftsappen']]) {
    const html = les(fil);
    assert.ok(html.match(/<p class="eyebrow hero-eyebrow">([^<]+)<\/p>/u)[1].startsWith(ord), fil);
    assert.ok(!html.match(/<p class="lead">([^<]+)<\/p>/u)[1].startsWith(ord), fil);
  }
});

test('Spør Matlyst-sidene sier at spørsmål er gratis og endringer krever Pro', () => {
  assert.ok(les('da/middagsforslag/index.html').includes('Det er gratis at stille spørgsmål om en opskrift. Når Spørg Matlyst skal lave eller ændre opskrifter, kræver det Matlyst Pro.'));
  assert.ok(les('sv/vad-ska-jag-laga/index.html').includes('Det är gratis att ställa frågor om ett recept. När Fråga Matlyst ska skapa eller ändra recept krävs Matlyst Pro.'));
  const qa = les('qa/sv-da/produktpaastander.md');
  assert.match(qa, /\/da\/middagsforslag\/[^\n]*sporMatlyst\/skjema\.ts:390-391/u);
  assert.match(qa, /send ukas ingredienser til handlelista[^\n]*ukemeny\.tsx:593-599/u);
});

test('llms.txt følger lenkeformatet og lokal bøying', () => {
  const llms = les('llms.txt');
  const urler = [...llms.matchAll(/https?:\/\/[^\s)]+/gu)];
  assert.ok(urler.length > 15);
  for (const { index } of urler) assert.equal(llms.slice(index - 2, index), '](', `rå URL ved ${index}`);
  for (const linje of llms.split('\n').filter((l) => l.includes('](http'))) {
    assert.match(linje, /^- \[[^\]]+\]\(https:\/\/matlyst-app\.no\/[^)]*\): \S/u, linje);
  }
  for (const tekst of ['til Indkøbslisten', 'i Spisekammeret', 'till Inköpslistan', 'i Skafferiet', 'tilpasse portioner, og svarene kommer på dansk.', 'anpassa portioner, och svaren kommer på svenska.', 'når kilden er kjent']) {
    assert.ok(llms.includes(tekst), tekst);
  }
});

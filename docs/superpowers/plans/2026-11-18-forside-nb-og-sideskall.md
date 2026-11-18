# Forsiden på bokmål og det nye sideskallet: byggeplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Den norske forsiden (`/`) bygges etter den godkjente prototypen, på tokens og sideskall-komponenter som resten av nettstedet kan ta i bruk etterpå.

**Architecture:** Forsiden skrives av en ny generator (`scripts/forside.mjs`) som setter sammen sideskallet (`scripts/skall.mjs`) og seksjonene, med tekst fra én fil per språk. Utseendet ligger i tre nye stilark (`tokens.css`, `skall.css`, `forside.css`) og to skript (`skall.js`, `forside.js`). Ingen annen side endres i denne planen: de 875 andre sidene laster fortsatt `styles.css`.

**Tech Stack:** Statisk HTML, CSS og JavaScript uten byggesteg. Node 22 og `node --test` for enhetstester. Playwright (Chromium) for nettlesertester. GitHub Pages med Jekyll publiserer repoet.

**Spec:** `docs/superpowers/specs/2026-11-18-nettside-designsystem-design.md` (versjon 3, godkjent 18.11.2026). Prototypen ligger i `docs/superpowers/prototyper/2026-11-18-forside.html` og er fasit for utseende og oppførsel. Les begge før første oppgave.

Dette er steg 1 av 7 i specens punkt 13. Steg 2 til 7 får egne planer.

## Beslutninger Patrick må bekrefte

Prototypen er godkjent, men fem steder kolliderer den med regler som alt er låst i repoet. Planen bygger på standardvalget under. Si fra før bygging hvis noe skal være annerledes.

| # | Kollisjon | Standardvalg i planen |
|---|---|---|
| A | `test/lansering.test.mjs` krever at ingressen (`<p class="lead">`) begynner med «Oppskriftsappen som oversetter og tilpasser oppskriftene dine.» Prototypens ingress er «Fra en Reel, en nettside eller et bilde av bestemors kort. Matlyst gjør dem om til ingredienser og steg.» | Prototypens ingress vinner. Posisjoneringen blir stående i tittel, metabeskrivelse og JSON-LD, og testen endres til å kreve den der for bokmål. |
| B | `test/seo-pages.test.mjs` forbyr «ubegrenset import» på importsiden: Pro-løftet skal ikke love et grenseløst system. Prototypen sier «Så mange importer du vil.» | Pro-kortet får «Uten grensen på fem importer.» Ordet «ubegrenset» brukes ikke. |
| C | Prototypens Verktøy-hylle lenker til seks kalkulatorer som ikke finnes. | En lenke vises først når siden finnes. De seks står i hylledataene med `finnes: false` og tegnes ikke. |
| D | Specen sier at vurderingen hentes fra App Store ved bygging (mitt valg). Repoet har i dag en fast verdi som er låst av `test/lansering.test.mjs`. | Fast verdi, låst av samme test. «5,0 av 5 i App Store» på siden, `"ratingCount": "12"` bare i JSON-LD. Ingen henting ved bygging. |
| E | Alle sider med `site.js` må ha samtykkebanner og en lenke som trekker samtykket tilbake. Prototypen har «Informasjonskapsler» i bunnen. | «Informasjonskapsler» er lenka som trekker samtykket (`data-consent-withdraw`). Banneret beholdes uendret i tekst. |

## Global Constraints

- Ingen adresse endres. `<title>`, metabeskrivelse, Open Graph, `canonical`, `hreflang` og `MobileApplication`-skjemaet på forsiden står ordrett som i dag. Unntak: `theme-color` blir `#FFFFFF`.
- Ingen andre sider enn `index.html` endres i innhold. `styles.css` røres ikke.
- Farger, skrifter, radier og avstander: bare verdiene i specens punkt 6. Ingen andre verdier i `tokens.css`, `skall.css` eller `forside.css`.
- Skrifter lastes fra `fonts/` som woff2. Ingen forespørsel til Google Fonts eller noen annen vert før samtykke.
- Ordmerket: små bokstaver, «mat» i Fraunces kursiv 300 og «lyst» i Fraunces kursiv 400 i `#FF5500`, optisk størrelse 144.
- Alt går i loop, og ingenting kan stoppes. Ingen pauseknapp og ingen pause ved trykk, verken på film, kort eller samlebånd. Ved `prefers-reduced-motion: reduce` står alt stille.
- Ingen kronebeløp. Ingen konkurrenter nevnes unntatt Paprika, og da bare om flytting. Ingen tankestrek (`–` eller `—`) som skilletegn i synlig tekst. «Cups», ikke «kopper».
- Ingen pris, kilde eller funksjon påstås uten at den stemmer med `llms.txt`.
- Trykkflater er minst 44 px. Siden ruller aldri sidelengs på 360, 390, 768 eller 1280 px.
- Butikkmerker: forsiden bruker svart knapp, ikke butikkmerker. Klassen `btn-store` brukes ikke.
- Alle `<img>` har `width`, `height` og `alt`. Bilder under første skjerm har `loading="lazy"`.
- Brytpunkter: 720 px og 1000 px.
- Kommandoer: `npm test` (enhetstester) og `npm run test:e2e` (Playwright). Begge skal være grønne før hver commit.
- Arbeid i et arbeidstre uten æ, ø eller å i stien. Flere eldre tester leser filer via `new URL(...).pathname` og feiler ellers.

## Review Focus

1. **JavaScript er blokkert eller feiler.** Overskriften står ferdig skrevet, filmen viser plakatbildet, alle nedlastingsknapper går til `/app`, og hyllene i bunnen står åpne på mobil. (Oppgave 4 og 6)
2. **Redusert bevegelse er slått på.** Ingenting beveger seg, og ingen flate står tom eller halvferdig. (Oppgave 9)
3. **Smal skjerm og stor tekst.** På 320 px bredde og ved 200 % tekststørrelse ruller siden ikke sidelengs, og ingen tekst ligger over annen tekst. (Oppgave 9)
4. **Berøringsskjerm og innebygde nettlesere** (Instagram, TikTok, Facebook). Nedlastingsknappen åpner ikke QR-vinduet, men går til `/app`. (Oppgave 4)
5. **Tregt nett.** Filmen er ikke ferdig lastet: plakatbildet står, stegene kan leses, og ingenting hopper når filmen kommer. (Oppgave 6)
6. **Før samtykke.** Siden gjør ingen forespørsel til andre verter enn sin egen. (Oppgave 9)

---

## Filstruktur

| Fil | Ansvar |
|---|---|
| `tokens.css` | `@font-face` og alle tokens. Ingen velgere utenom `:root`. |
| `skall.css` | Topp, hyllemeny, hylledel, mørk bunn, kortet og bladet, knapp, QR-vindu, fast knapp, samtykkebanner. |
| `forside.css` | Seksjonene på forsiden og appens flater. |
| `skall.js` | Meny, trekkspill på mobil, påskeegget i logoen, QR-vindu, fast knapp. |
| `forside.js` | Overskrift som skrives, følgemeny, film med steg, samlebånd, kokebok, Spør Matlyst, de fem kortene. |
| `scripts/hyller.mjs` | Data: de seks hyllene med lenker, per språk. |
| `scripts/skall.mjs` | HTML for sideskallet. |
| `scripts/forside-tekst.mjs` | All tekst på forsiden, per språk. Bare `nb` i denne planen. |
| `scripts/forside.mjs` | Setter sammen og skriver `index.html`. |
| `images/forside/` | Film, plakat, matbilder, profilbilder, logoformer, kula, QR-kode. |
| `fonts/` | Nye woff2-filer og lisensfiler. |

Kildene til bilder og film ligger i `~/matlyst-privat/seo-matlyst/2026-11-18/nettfilm/`. Kopier derfra, ikke lag nye.

---

### Task 1: Skrifter og tokens

**Files:**
- Create: `tokens.css`
- Create: `fonts/schibsted-grotesk-latin.woff2`, `fonts/schibsted-grotesk-latin-ext.woff2`, `fonts/schibsted-grotesk-OFL.txt`
- Create: `fonts/ibm-plex-mono-500-latin.woff2`, `fonts/ibm-plex-mono-OFL.txt`
- Create: `fonts/fraunces-ordmerke.woff2`
- Modify: `test/fonter.test.mjs` (tar med `tokens.css`)
- Test: `test/tokens.test.mjs`

**Interfaces:**
- Produces: tilpassede egenskaper på `:root` med nøyaktig disse navnene: `--flate`, `--hylle`, `--linje`, `--blekk`, `--blekk-lys`, `--dempet`, `--a-flate`, `--a-tekst`, `--a-dempet`, `--a-oransje`, `--a-knapp`, `--a-merke`, `--a-gronn`, `--kule1`, `--kule2`, `--kule3`, `--f`, `--mono`, `--ut`. Skriftfamiliene heter `'Schibsted Grotesk'`, `'IBM Plex Mono'`, `'Fraunces'`, `'DM Sans'` og `'Fraunces Ordmerke'`.

- [ ] **Step 1: Skriv testen som feiler**

```js
// test/tokens.test.mjs
const css = les('tokens.css');
const verdi = (navn) => css.match(new RegExp(`--${navn}:\\s*([^;]+);`))?.[1].trim();

test('tokens har verdiene fra specens punkt 6', () => {
  assert.deepEqual(
    ['flate', 'hylle', 'linje', 'blekk', 'blekk-lys', 'dempet', 'a-tekst', 'a-dempet', 'a-oransje', 'a-knapp', 'a-merke', 'a-gronn'].map(verdi),
    ['#FFFFFF', '#F5F3EF', '#E6E2DB', '#141210', '#2B2723', '#5F5952', '#1A1714', '#69645E', '#B03B00', '#B34600', '#FF5500', '#146B3A'],
  );
});

test('tekstfargene holder AA mot flatene de står på', () => {
  for (const [tekst, flate] of [['dempet', 'flate'], ['dempet', 'hylle'], ['blekk', 'hylle'], ['a-dempet', 'a-flate'], ['a-oransje', 'a-flate'], ['a-gronn', 'a-flate']]) {
    assert.ok(kontrast(verdi(tekst), verdi(flate)) >= 4.5, `${tekst} på ${flate}`);
  }
  assert.ok(kontrast('#A8A199', verdi('blekk')) >= 4.5, 'støttetekst på mørk bunn');
  assert.ok(kontrast('#FFFFFF', verdi('a-knapp')) >= 4.5, 'hvit tekst på fylt knapp');
});

test('hver skriftfil finnes, og ingen skrift hentes utenfra', () => {
  const kilder = [...css.matchAll(/url\(([^)]+)\)/g)].map((m) => m[1].replace(/["']/g, ''));
  assert.ok(kilder.length >= 6);
  for (const sti of kilder) { assert.match(sti, /^\/fonts\/[\w-]+\.woff2$/); assert.ok(existsSync(join(rot, sti))); }
  assert.doesNotMatch(css, /googleapis|gstatic/);
});

test('tokens.css har ingen velgere utenom :root og @font-face', () => {
  assert.deepEqual([...css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/(^|\})\s*([^{}@]+)\{/g)].map((m) => m[2].trim()).filter((v) => v !== ':root'), []);
});
```

`kontrast(a, b)` er WCAG-formelen for relativ luminans. Skriv den i testfila. `rot` leses med `fileURLToPath`, ikke `.pathname`.

`test/fonter.test.mjs` finnes fra før og vokter `styles.css`: at skriftene ligger lokalt, har `font-display: swap`, og at delsettene dekker alle tegn vi skriver på de fire språkene. Legg `tokens.css` inn i de samme testene (gjør `css()` om til en liste over stilark) i stedet for å skrive reglene på nytt.

- [ ] **Step 2: Kjør testen og se den feile**

Run: `node --test test/tokens.test.mjs`
Expected: FAIL, `tokens.css` finnes ikke.

- [ ] **Step 3: Hent skriftene**

Schibsted Grotesk (variabel, vekt 400 til 700) og IBM Plex Mono 500 hentes som woff2 i delsettene `latin` og `latin-ext` fra kildene bak Google Fonts, med lisensfil ved siden av, slik `fonts/dm-sans-OFL.txt` alt gjør. `fraunces-ordmerke.woff2` lages med `pyftsubset` fra Fraunces kursiv: bare tegnene `matlys`, optisk størrelse låst til 144, vektaksen beholdt fra 300 til 400. Kontroller først med `fonttools varLib.instancer` om `fonts/fraunces-latin.woff2` og `fonts/dm-sans-latin.woff2` dekker vekt 500 og 600 (Fraunces) og 400 til 700 (DM Sans). Dekker de ikke det, legg til filene som mangler etter samme navnemønster.

- [ ] **Step 4: Skriv `tokens.css`**

`@font-face` for hver fil med `font-display: swap` og `unicode-range` som i `styles.css`. Deretter `:root` med tokenene. Verdiene står i specens punkt 6 og i `:root` i prototypen. `--kule1`, `--kule2`, `--kule3` er `#F9C8B3`, `#EFC5D4`, `#BEB4DF`. `--ut` er `cubic-bezier(.16,1,.3,1)`.

- [ ] **Step 5: Kjør testen og se den bestå**

Run: `node --test test/tokens.test.mjs test/fonter.test.mjs`
Expected: PASS.

- [ ] **Step 6: Bevis at kontrasttesten kan bli rød**

Sett `--dempet` til `#9A948C`, kjør testen, se den feile på «dempet på flate», og sett verdien tilbake.

- [ ] **Step 7: Commit**

```bash
git add tokens.css fonts test/tokens.test.mjs test/fonter.test.mjs
git commit -m "tokens og skrifter for det nye uttrykket"
```

---

### Task 2: Hylledataene

**Files:**
- Create: `scripts/hyller.mjs`
- Test: `test/hyller.test.mjs`

**Interfaces:**
- Produces: `export const HYLLER = { nb: Hylle[] }` der `Hylle = { id: string, navn: string, flis: string, lenker: Lenke[] }` og `Lenke = { tekst: string, href: string, finnes?: false }`. `export function synligeLenker(hylle: Hylle): Lenke[]` returnerer lenkene uten `finnes: false`.

- [ ] **Step 1: Skriv testen som feiler**

```js
test('bokmål har de seks hyllene i specens rekkefølge', () => {
  assert.deepEqual(HYLLER.nb.map((h) => h.navn), ['Appen', 'Lagre oppskrifter', 'Middag', 'Verktøy', 'Kjøkkentips', 'Matlyst']);
});

test('hver synlige lenke peker på en side som finnes', () => {
  for (const hylle of HYLLER.nb) for (const { tekst, href } of synligeLenker(hylle)) {
    if (/^https?:/.test(href)) continue;
    assert.ok(existsSync(join(rot, href.endsWith('/') ? `${href}index.html` : href)), `${hylle.navn}: ${tekst} (${href})`);
  }
});

test('de seks kalkulatorene som ikke finnes, vises ikke', () => {
  const verktoy = HYLLER.nb.find((h) => h.id === 'verktoy');
  assert.deepEqual(verktoy.lenker.filter((l) => l.finnes === false).map((l) => l.tekst), ['Dl til gram', 'Porsjoner', 'Kakeform', 'Steketid', 'Pizzadeig', 'Gjær']);
  assert.ok(!synligeLenker(verktoy).some((l) => l.finnes === false));
});

test('ingen hylle sier kopper', () => {
  assert.doesNotMatch(JSON.stringify(HYLLER.nb), /kopp/i);
});
```

- [ ] **Step 2: Kjør testen og se den feile**

Run: `node --test test/hyller.test.mjs`
Expected: FAIL, modulen finnes ikke.

- [ ] **Step 3: Skriv `scripts/hyller.mjs`**

Lenketekstene står i `nav.panel` i prototypen. Adressene finner du ved å slå opp sidene i repoet: prototypen har `href="#"` overalt. Finnes det ingen side for en lenke, får den `finnes: false`. `flis` er filnavnet i `images/forside/logo/` (oppgave 3).

- [ ] **Step 4: Kjør testen og se den bestå**

Run: `node --test test/hyller.test.mjs`
Expected: PASS, 4 tester.

- [ ] **Step 5: Commit**

```bash
git add scripts/hyller.mjs test/hyller.test.mjs
git commit -m "hylledata for meny og bunn"
```

---

### Task 3: Bilder, film og QR-kode

**Files:**
- Create: `images/forside/film/import-nb.mp4`, `images/forside/film/import-nb-plakat.webp`
- Create: `images/forside/mat/*.webp` (8 rettebilder og 2 miniatyrer), `images/forside/folk/01.webp` til `12.webp`, `images/forside/logo/01.webp` til `40.webp`, `images/forside/kule.png`, `images/forside/qr-app.svg`
- Test: `test/forside-bilder.test.mjs`

**Interfaces:**
- Produces: filene over, med disse navnene. Rettebildene heter `butterchicken`, `laks`, `focaccia`, `ramen`, `kanelboller`, `taco`, `tomatpasta`, `sjokoladekake`.

- [ ] **Step 1: Skriv testen som feiler**

```js
test('alle filene forsiden bruker, finnes', () => {
  for (const sti of FILER) assert.ok(existsSync(join(rot, 'images/forside', sti)), sti);
});
test('filmen er under 2,5 MB og plakaten under 100 kB', () => {
  assert.ok(statSync(join(rot, 'images/forside/film/import-nb.mp4')).size < 2_500_000);
  assert.ok(statSync(join(rot, 'images/forside/film/import-nb-plakat.webp')).size < 100_000);
});
test('QR-koden er en SVG med 25 ruter i hver retning', () => {
  assert.match(les('images/forside/qr-app.svg'), /viewBox="0 0 25 25"/);
});
```

`FILER` er lista over alle filnavnene i tabellen over, skrevet ut i testen.

- [ ] **Step 2: Kjør testen og se den feile**

Run: `node --test test/forside-bilder.test.mjs`
Expected: FAIL, filene finnes ikke.

- [ ] **Step 3: Kopier filene**

Fra `~/matlyst-privat/seo-matlyst/2026-11-18/nettfilm/`. Filmen heter der `film/import-nb-telefon.mp4`. QR-koden står som innebygd SVG i `dialog.hent` i prototypen: skriv den ut som egen fil.

- [ ] **Step 4: Skann QR-koden med en telefon**

Åpne `images/forside/qr-app.svg` på skjermen og skann. Den skal åpne `https://matlyst-app.no/app`. Ingen test kan bevise dette, så skriv resultatet i commit-meldingen.

- [ ] **Step 5: Kjør testen og se den bestå, og kjør vakten for interne filer**

Run: `node --test test/forside-bilder.test.mjs test/interneFiler.test.mjs`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add images/forside test/forside-bilder.test.mjs
git commit -m "bilder, film og QR-kode til forsiden"
```

---

### Task 4: Sideskallet

**Files:**
- Create: `scripts/skall.mjs`, `skall.css`, `skall.js`
- Test: `test/skall.test.mjs`

**Interfaces:**
- Consumes: `HYLLER`, `synligeLenker` (oppgave 2). Tokens (oppgave 1).
- Produces fra `scripts/skall.mjs`:
  - `topp(sprak: string, valg: { folg?: { href: string, tekst: string }[], sprakvelger: string }): string`
  - `hylledel(sprak: string): string`
  - `morkBunn(sprak: string, valg: { sprakvelger: string }): string`
  - `nedlasting(sprak: string): string` (QR-vinduet og den faste knappen)
  - `samtykke(sprak: string): string`
  - `sprakvelger(sprak: string, plass: 'topp' | 'bunn', sider: Record<string, string>): string`
- Produces i HTML: nedlastingsknapper har `data-hent="<plassering>"` og `href="/app"`. Menyen har `id="panel"`, bunnhyllene `id="bunnreol"`, QR-vinduet `id="hent"`, den faste knappen `id="fast"`.

- [ ] **Step 1: Skriv testen som feiler**

```js
const lenker = (html) => [...html.matchAll(/<a href="([^"]+)"[^>]*><span>([^<]+)<\/span><\/a>/g)].map(([, href, tekst]) => `${tekst}|${href}`);

test('menyen og bunnen har nøyaktig de samme hyllene og lenkene', () => {
  const meny = topp('nb', { sprakvelger: '' }), bunn = hylledel('nb');
  assert.ok(lenker(bunn).length > 20);
  assert.deepEqual(lenker(bunn), lenker(meny.match(/<nav class="panel"[\s\S]*?<\/nav>/)[0]));
});

test('skallet har ingen døde lenker', () => {
  for (const del of [topp('nb', { sprakvelger: '' }), hylledel('nb'), morkBunn('nb', { sprakvelger: '' })]) assert.doesNotMatch(del, /href="#"/);
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

test('samtykkeknappene veier likt i skall.css', () => { /* samme sammenligning som test/samtykkeVekt.test.mjs, mot skall.css */ });
```

Den siste testen: trekk hjelpefunksjonene `regler` og `effektiv` ut av `test/samtykkeVekt.test.mjs` til `test/hjelp/knappevekt.mjs` så begge testene bruker dem. Ikke kopier dem.

- [ ] **Step 2: Kjør testen og se den feile**

Run: `node --test test/skall.test.mjs`
Expected: FAIL, modulen finnes ikke.

- [ ] **Step 3: Skriv `scripts/skall.mjs`**

Markupen står i prototypen: `header.topp`, `nav.panel`, `section.bunn`, `footer.under`, `div.fast`, `dialog.hent`. Forskjeller fra prototypen:
- `href="#"` byttes med ekte adresser. «Personvern» går til `/personvern.html`, «Vilkår» til `/vilkar.html`.
- Språkpillene i menypanelet og språklenkene i den mørke bunnen byttes med `sprakvelger(...)`. Følg nøyaktig markupen som står etter `<!-- språkvelger:topp -->` i dagens `index.html`.
- Hyllene tegnes fra `HYLLER` gjennom `synligeLenker`. Menyen og bunnen kaller samme funksjon.
- I HTML-en står hyllene i bunnen åpne. `skall.js` folder dem sammen på mobil. Da virker de uten JavaScript.
- QR-koden settes inn som `<img src="/images/forside/qr-app.svg" width="176" height="176" alt="QR-kode til matlyst-app.no/app">`.

- [ ] **Step 4: Skriv `skall.css` og `skall.js`**

Flytt reglene fra prototypens `<style>` og `<script>` for disse delene: `.side`, `.kort`, `.blad`, `.under`, `.topp`, `.merke`, `.ordmerke`, `.menyknapp`, `.panel`, `.reol`, `.fag`, `.bunn`, `.bunnrad`, `.knapp`, `.hent`, `.fast`. Legg til samtykkebanneret (`.cookie`, `.ck-btn`, `.ck-accept`, `.ck-reject`) i det nye uttrykket: begge knappene får samme stil. `skall.js` gjør disse tingene og ikke mer: åpne og lukke menyen, folde hyllene på mobil (meny og bunn), bytte logoform hvert 3. sekund, åpne QR-vinduet når `matchMedia('(min-width:1001px) and (hover:hover) and (pointer:fine)')` treffer og `dialog.showModal` finnes, og vise den faste knappen. Skriptet skal tåle at et element mangler på siden.

- [ ] **Step 5: Kjør testen og se den bestå**

Run: `node --test test/skall.test.mjs test/samtykkeVekt.test.mjs`
Expected: PASS.

- [ ] **Step 6: Bevis at hylletesten kan bli rød**

Fjern én lenke fra bunnen i `hylledel` med et midlertidig filter, kjør testen, se «menyen og bunnen har nøyaktig de samme» feile, og fjern filteret.

- [ ] **Step 7: Commit**

```bash
git add scripts/skall.mjs skall.css skall.js test/skall.test.mjs test/hjelp/knappevekt.mjs test/samtykkeVekt.test.mjs
git commit -m "sideskall: topp, hyllemeny, bunn i tre lag og nedlasting"
```

---

### Task 5: Teksten på forsiden

**Files:**
- Create: `scripts/forside-tekst.mjs`
- Test: `test/forside-tekst.test.mjs`

**Interfaces:**
- Produces: `export const TEKST = { nb: { ... } }` med disse nøklene: `h1`, `ingress`, `knapp`, `vurdering`, `steg` (6 strenger), `stegtider` (6 tall), `kildetittel`, `kilder` (8 objekter `{ navn, ikon }`), `kokebok` (`{ tittel, ingress, kimerke, retter: { fil, tittel, tid }[] }`), `spor`, `middag`, `pris` (`{ tittel, ingress, gratis, pro, vern }`), `svar` (`{ tittel, sporsmal: { q, a }[] }`), `bunnlinje`, `folg`.

- [ ] **Step 1: Skriv testen som feiler**

```js
const t = TEKST.nb, alt = JSON.stringify(t);

test('overskrift, steg og kilder er de som er godkjent', () => {
  assert.equal(t.h1, 'Oppskrifter du faktisk lager.');
  assert.deepEqual(t.steg, ['Trykk på papirflyet', 'Trykk Del til', 'Velg Matlyst', 'Velg mappe og trykk Lagre', 'Matlyst henter oppskriften', 'Ferdig. Ingredienser, steg og bilde.']);
  assert.deepEqual(t.stegtider, [0, 2.5, 6.0, 9.7, 13.3, 16.5]);
  assert.deepEqual(t.kilder.map((k) => k.navn), ['Instagram', 'TikTok', 'YouTube', 'Facebook', 'Nettsider', 'Matblogger', 'Bildegalleri', 'Kokebøker']);
  assert.equal(t.bunnlinje, 'Den oppskriften du lagret? Lag den i kveld.');
});

test('pris: gratis og Pro følger llms.txt, uten kroner og uten «ubegrenset»', () => {
  assert.equal(t.pris.gratis.linje, '5 importer i måneden.');
  assert.deepEqual(t.pris.gratis.punkter, ['Ukemeny og handleliste', 'Skaler porsjoner', 'Lag maten steg for steg']);
  assert.equal(t.pris.pro.linje, 'Uten grensen på fem importer.');
  assert.deepEqual(t.pris.pro.punkter, ['Lagre fra bilder og kokebøker', 'Spør Matlyst', 'Næringsinnhold per porsjon', 'Del med husstanden, opptil 6']);
  assert.equal(t.pris.pro.fot, 'Prisen ser du i appen før du kjøper.');
  assert.doesNotMatch(alt, /ubegrenset|\d\s?kr\b|kroner/i);
});

test('seks spørsmål, alle med spørsmålstegn', () => {
  assert.equal(t.svar.sporsmal.length, 6);
  for (const { q, a } of t.svar.sporsmal) { assert.match(q, /\?$/); assert.ok(a.length > 20); }
});

test('teksten følger skrivereglene', () => {
  assert.doesNotMatch(alt, /[–—]/, 'tankestrek');
  assert.doesNotMatch(alt, /kopp/i);
  assert.doesNotMatch(alt, /\b(beste?|nr\. ?1|nummer én)\b/i, 'superlativ');
  assert.doesNotMatch(alt, /\d+ vurderinger/, 'antall vurderinger vises ikke');
  assert.equal(t.vurdering, '5,0 av 5 i App Store');
});
```

- [ ] **Step 2: Kjør testen og se den feile**

Run: `node --test test/forside-tekst.test.mjs`
Expected: FAIL, modulen finnes ikke.

- [ ] **Step 3: Skriv `scripts/forside-tekst.mjs`**

Teksten kopieres ordrett fra prototypen. To unntak: Pro-linja er «Uten grensen på fem importer.» (beslutning B), og antallet vurderinger er ikke med (beslutning D).

- [ ] **Step 4: Kjør testen og se den bestå**

Run: `node --test test/forside-tekst.test.mjs`
Expected: PASS, 4 tester.

- [ ] **Step 5: Commit**

```bash
git add scripts/forside-tekst.mjs test/forside-tekst.test.mjs
git commit -m "teksten på forsiden, bokmål"
```

---

### Task 6: Generatoren og toppen av forsiden

**Files:**
- Create: `scripts/forside.mjs`, `forside.css`, `forside.js`
- Modify: `index.html` (skrives av generatoren)
- Modify: `test/lansering.test.mjs` (testene «forsidene har posisjoneringen» og «nb-forsiden: grammatisk importsetning»)
- Modify: `test/nyhetsbrev-utfasing.test.mjs:52-60`
- Test: `test/forside.test.mjs`

**Interfaces:**
- Consumes: alt fra `scripts/skall.mjs` (oppgave 4) og `TEKST` (oppgave 5).
- Produces: `export function forside(sprak: 'nb'): string` (hele dokumentet) og `export function kjor(rot: string): void` (skriver `index.html`). Kommando: `node scripts/forside.mjs`. Seksjonene bygges av egne funksjoner i samme fil med navnene `hode`, `helt`, `kilder`, `kokebok`, `spor`, `middag`, `pris`, `svar`. De tre siste fylles i oppgave 7 og 8. I denne oppgaven returnerer de tom streng.
- Produces i HTML: `<body data-app-uttrykk="1">`, `<main id="hovedinnhold">`, `section.hero`, `id="lagre"` på filmen, `id="band"`, `id="last-ned"` på hylledelen. Følgemenyen i toppen lenker til `#lagre`, `#spor`, `#middag`, `#pris` og `#svar`. De fire siste målene kommer i oppgave 7 og 8, så de tre testene som krever dem, er røde til da.

- [ ] **Step 1: Skriv testen som feiler**

```js
const html = les('index.html');

test('index.html er nøyaktig det generatoren lager', () => {
  assert.equal(html, forside('nb'));
});

test('hodet er urørt: tittel, beskrivelse, hreflang og skjema', () => {
  assert.match(html, /<title>Matlyst: oppskriftsappen for iPhone og Android<\/title>/);
  assert.match(html, /<meta name="description" content="Oppskriftsappen som oversetter og tilpasser oppskriftene dine\. /);
  for (const [kode, href] of [['nb-NO', '/'], ['sv-SE', '/sv/'], ['da-DK', '/da/'], ['en', '/en/'], ['x-default', '/en/']]) assert.match(html, new RegExp(`<link rel="alternate" hreflang="${kode}" href="https://matlyst-app\\.no${href}">`));
  assert.match(html, /"ratingValue": "5\.0", "ratingCount": "12"/);
  assert.match(html, /"@type":\s*"Organization"/);
  assert.match(html, /<meta name="theme-color" content="#FFFFFF">/);
});

test('siden laster de nye stilarkene og ikke det gamle', () => {
  for (const fil of ['/tokens.css', '/skall.css', '/forside.css', '/language-switcher.css']) assert.match(html, new RegExp(`<link rel="stylesheet" href="${fil}">`));
  assert.doesNotMatch(html, /href="\/styles\.css"/);
  for (const fil of ['/locale.js', '/language-switcher.js', '/site.js', '/skall.js', '/forside.js']) assert.match(html, new RegExp(`<script src="${fil}" defer></script>`));
});

test('toppen: én H1, ingress, knapp, stjerner og seks steg', () => {
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.match(html, /<h1[^>]*>Oppskrifter du faktisk lager\.<\/h1>/);
  assert.match(html, /<p class="lead">Fra en Reel, en nettside eller et bilde av bestemors kort\. Matlyst gjør dem om til ingredienser og steg\.<\/p>/);
  assert.deepEqual([...html.matchAll(/class="st" data-t="([\d.]+)"/g)].map((m) => +m[1]), [0, 2.5, 6.0, 9.7, 13.3, 16.5]);
  assert.match(html, /5,0<\/b> av 5 i App Store/);
});

test('filmen har plakat, faste mål og ingen kontroller', () => {
  const film = html.match(/<div class="film"[\s\S]*?<\/div>/)[0];
  assert.match(film, /<video[^>]*poster="\/images\/forside\/film\/import-nb-plakat\.webp"[^>]*muted[^>]*playsinline[^>]*loop/);
  assert.doesNotMatch(film, /<button|controls/);
});

test('ingenting på siden kan stoppes', () => {
  assert.doesNotMatch(html, /class="[^"]*\b(pause|spillav|filmknapp)\b/);
  assert.doesNotMatch(html, />\s*(Pause|Spill av|Stopp)\s*</);
});

test('nøyaktig to språkvelgere, og aria-current="page" bare der', () => {
  assert.equal((html.match(/class="language-switcher(?: [^"]*)?"/g) ?? []).length, 2);
  assert.equal((html.match(/aria-current="page"/g) ?? []).length, 2);
});

test('uten JavaScript står overskriften synlig', () => {
  const css = les('forside.css');
  assert.doesNotMatch(css, /^\.hero h1\s*\{[^}]*(visibility:\s*hidden|opacity:\s*0)/m, 'bare .js-varianten kan skjule den');
});

test('nedlastingsdelen finnes og har ingen e-postfelt', () => {
  assert.match(html, /<section class="bunn" id="last-ned"/);
  assert.doesNotMatch(html, /<form\b|type="email"/);
});

test('følgemenyen har fem lenker, og hver peker på en del som finnes', () => {
  const meny = html.match(/<nav class="folg"[\s\S]*?<\/nav>/)[0];
  const lenker = [...meny.matchAll(/<a href="#([\w-]+)">([^<]+)<\/a>/g)].map(([, id, tekst]) => [id, tekst]);
  assert.deepEqual(lenker.map((l) => l[1]), ['Lagre', 'Spør Matlyst', 'Lag maten', 'Pris', 'Spørsmål']);
  assert.deepEqual(lenker.map((l) => l[0]), ['lagre', 'spor', 'middag', 'pris', 'svar']);
  assert.match(html, /id="lagre"/);
});

test('kildene på båndet er de godkjente, og lista står fire ganger', () => {
  const lister = [...html.match(/<div class="band"[\s\S]*?<\/div>\s*<\/div>/)[0].matchAll(/<ul[^>]*>([\s\S]*?)<\/ul>/g)];
  assert.equal(lister.length, 4);
  assert.deepEqual([...lister[0][1].matchAll(/<span>([^<]+)<\/span>/g)].map((m) => m[1]), TEKST.nb.kilder.map((k) => k.navn));
  assert.equal(lister.filter((l) => /aria-hidden="true"/.test(l[0])).length, 3);
});
```

- [ ] **Step 2: Kjør testen og se den feile**

Run: `node --test test/forside.test.mjs`
Expected: FAIL, `forside` er ikke eksportert.

- [ ] **Step 3: Skriv `scripts/forside.mjs` med `hode`, `helt` og `kilder`**

`hode()` kopierer `<head>` fra dagens `index.html` ordrett, bytter stilark og skript, og tar med `Organization`-skjemaet som `scripts/app-uttrykk.mjs` (`organisasjonSkjema`) setter inn i dag. Importer funksjonen derfra, ikke kopier JSON-en. `<body>` får `data-app-uttrykk="1"`, så `scripts/app-uttrykk.mjs` hopper over siden. Rekkefølgen i `<body>`: `div.side` > `div.kort` > `div.blad` (topp, `main`) > hylledel > mørk bunn > nedlasting > samtykke. Prototypens stripe øverst (`div.prove`) er ikke med.

Overskriften skrives inn av `forside.js`. For å unngå at den først vises ferdig og så skrives på nytt: `html.js .hero h1:not(.klar){visibility:hidden}`. `forside.js` setter klassen `klar` når tegnene er pakket inn, og et tidsur på 1,5 sekunder setter den uansett.

- [ ] **Step 4: Flytt CSS og JavaScript for toppen, filmen og båndet**

Fra prototypen til `forside.css` og `forside.js`: `.hero`, `.bevis`, `.stjerner`, `.importflyt`, `.film`, `.steg`, `.st`, `.kilder`, `.band`, `.bane`, `.folg`, og skriptblokkene for overskriften, følgemenyen, filmen og båndet. Filmen lastes med vanlig `src` og `preload="metadata"`. Test i Safari at et trykk på et steg hopper riktig. Virker det ikke, bruk prototypens `hent()`.

- [ ] **Step 5: Oppdater de to eldre testene**

`test/lansering.test.mjs`: i «forsidene har posisjoneringen» kreves ingressen fortsatt for `sv` og `da`, men ikke for `index.html` (beslutning A). I «nb-forsiden: grammatisk importsetning» fjernes de to linjene om `<p class="lead">` og «oversett». Resten av testen står.
`test/nyhetsbrev-utfasing.test.mjs`: seksjonen hentes med `/<section class="bunn" id="last-ned"[\s\S]*?<\/section>/`, og det kreves en `data-hent`-knapp i den i stedet for butikkmerker.
Skriv i commit-meldingen hvorfor hver test er endret.

- [ ] **Step 6: Kjør generatoren og alle testene**

Run: `node scripts/forside.mjs && npm test`
Expected: PASS. Feiler `test/locale-pages.test.mjs` eller `test/landing9Runde3.test.mjs` på `index.html`, er det forsiden som skal rettes, ikke testen.

- [ ] **Step 7: Kjør de andre generatorene og se at forsiden står urørt**

Run, én om gangen: `node scripts/app-uttrykk.mjs`, `node scripts/guidelenker.mjs`, `node scripts/lenker-sett.mjs`. Etter hver: `git status --short`.
Expected: ingen endring i `index.html`. Skriver en av dem over forsiden, skal den generatoren hoppe over rotsiden. Legg da til en test for det i generatorens egen testfil. Endrer en generator andre filer, er det gammel drift: forkast med `git checkout -- .` (ikke `index.html`), og nevn det i PR-en. Ikke kjør `scripts/generer-lokalsider.mjs`: den skriver over sider som er rettet for hånd.

- [ ] **Step 8: Commit**

```bash
git add scripts/forside.mjs forside.css forside.js index.html test/forside.test.mjs test/lansering.test.mjs test/nyhetsbrev-utfasing.test.mjs
git commit -m "forsiden: generator, topp, importfilm og samlebånd"
```

---

### Task 7: Kokeboka og Spør Matlyst

**Files:**
- Modify: `scripts/forside.mjs` (`kokebok`, `spor`), `forside.css`, `forside.js`, `index.html`
- Test: `test/forside.test.mjs`

**Interfaces:**
- Consumes: `TEKST.nb.kokebok`, `TEKST.nb.spor`.
- Produces i HTML: `section.kokebok` med `id="retterom"`, `section.spor` med `id="spor"`.

- [ ] **Step 1: Legg til testene som feiler**

```js
test('kokeboka har åtte retter med mål, tom alt-tekst, sen lasting og KI-merke', () => {
  const del = html.match(/<section class="kokebok"[\s\S]*?<\/section>/)[0];
  const bilder = [...del.matchAll(/<img [^>]+>/g)].map((m) => m[0]);
  assert.equal(bilder.length, 8);
  for (const b of bilder) assert.match(b, /src="\/images\/forside\/mat\/[\w-]+\.webp" alt="" width="520" height="680" loading="lazy"/);
  assert.match(del, /<p class="kimerke">Bildene er laget med KI\.<\/p>/);
  assert.match(del, /<h2[^>]*>Din egen kokebok<\/h2>/);
});

test('Spør Matlyst har fire forslag og sier hva som er gratis', () => {
  const del = html.match(/<section class="spor[^"]*" id="spor"[\s\S]*?<\/section>/)[0];
  assert.deepEqual([...del.matchAll(/class="forslag"[^>]*>([^<]+)</g)].map((m) => m[1]), ['Gjør denne vegansk', 'Jeg ønsker en lavkarbo-versjon', 'Bytt ut fløten', 'Bruk det jeg har i spiskammeret']);
  assert.match(del, /Spørsmål om en oppskrift er gratis\. Å skrive den om krever Matlyst Pro\./);
  assert.match(del, /Matlyst bruker KI\. Sjekk alltid oppskriften\./);
});
```

- [ ] **Step 2: Kjør og se dem feile**

Run: `node --test test/forside.test.mjs`
Expected: FAIL på de to nye testene.

- [ ] **Step 3: Fyll `kokebok()` og `spor()`, og flytt CSS og JavaScript**

Fra prototypen: `.kokebok`, `.retterom`, `.retter`, `.rett`, `.kimerke`, `.spor`, `.sporflate`, `.kule` med barn, `.felt`, `.forslag`, `.a-svar` med barn, `.sk`, `.skl`, og skriptblokkene for kokeboka og Spør Matlyst. Svarene i Spør Matlyst er eksempler skrevet for hånd (specens punkt 12). La dem stå som i prototypen, med en kommentar i `scripts/forside-tekst.mjs` om at de skal byttes mot ekte svar fra appen.

- [ ] **Step 4: Kjør generatoren og testene**

Run: `node scripts/forside.mjs && npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/forside.mjs forside.css forside.js index.html test/forside.test.mjs
git commit -m "forsiden: kokeboka og Spør Matlyst"
```

---

### Task 8: De fem kortene, pris og spørsmål

**Files:**
- Modify: `scripts/forside.mjs` (`middag`, `pris`, `svar`), `forside.css`, `forside.js`, `index.html`
- Test: `test/forside.test.mjs`

**Interfaces:**
- Consumes: `TEKST.nb.middag`, `TEKST.nb.pris`, `TEKST.nb.svar`.
- Produces i HTML: `section.del` med `id="middag"` og `id="trio"` på rutenettet, `section.pris` med `id="pris"`, `section.ofte` med `id="svar"`, og ett `FAQPage`-skjema i `<head>`.

- [ ] **Step 1: Legg til testene som feiler**

```js
test('fem kort i godkjent rekkefølge', () => {
  const del = html.match(/<section class="del[^"]*" id="middag"[\s\S]*?<\/section>/)[0];
  assert.deepEqual([...del.matchAll(/<h3[^>]*>([^<]+)<\/h3>/g)].map((m) => m[1]), ['Skaler', 'Lag maten', 'Ukemeny', 'Handle', 'Husstand']);
});

test('pris: to kort, personvernlinje, og ingen kroner på siden', () => {
  const del = html.match(/<section class="pris[^"]*" id="pris"[\s\S]*?<\/section>/)[0];
  assert.match(del, /<h2[^>]*>Hva koster det\?<\/h2>/);
  assert.match(del, /5 importer i måneden\./);
  assert.match(del, /Uten grensen på fem importer\./);
  assert.match(del, /Matlyst sporer deg ikke for reklame\. Ingen annonser, ingen salg av data\./);
  assert.match(del, /<a href="\/personvern\.html">/);
  const synlig = html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ');
  assert.doesNotMatch(synlig, /\d\s?kr\b|kroner|ubegrenset/i);
  assert.doesNotMatch(synlig, /[–—]/);
});

test('synlige spørsmål og svar er identiske med FAQPage-skjemaet', () => {
  const synlig = [...html.matchAll(/<details[^>]*>\s*<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>/g)].map(([, q, a]) => ({ q: q.replace(/<[^>]+>/g, '').trim(), a: a.replace(/<[^>]+>/g, '').trim() }));
  const skjema = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1])).find((s) => s['@type'] === 'FAQPage');
  assert.equal(synlig.length, 6);
  assert.deepEqual(skjema.mainEntity.map((e) => ({ q: e.name, a: e.acceptedAnswer.text })), synlig);
});

test('ingen H2 ligner H1, og ingen overskrift gjentar et ord', () => { /* samme regler som test/landing9Runde3.test.mjs:49 og test/locale-pages.test.mjs:127, mot index.html */ });
```

- [ ] **Step 2: Kjør og se dem feile**

Run: `node --test test/forside.test.mjs`
Expected: FAIL på de fire nye testene.

- [ ] **Step 3: Fyll `middag()`, `pris()` og `svar()`, og flytt CSS og JavaScript**

Fra prototypen: `.del`, `.bento`, `.rute`, alle `.a-`-klassene for de fem kortene, `.pris`, `.prisvalg`, `.plan`, `.vern`, `.ofte`, `.svarliste`, og skriptblokkene for kortene. `FAQPage`-skjemaet lages av `svar()` fra de samme `{ q, a }`-parene som den synlige lista, så de ikke kan bli ulike. Navn, mengder og datoer i kortene er eksempler (specens punkt 12): la dem stå som i prototypen.

- [ ] **Step 4: Kjør generatoren og testene**

Run: `node scripts/forside.mjs && npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/forside.mjs forside.css forside.js index.html test/forside.test.mjs
git commit -m "forsiden: fem kort, pris og spørsmål og svar"
```

---

### Task 9: Nettlesertester og måling

**Files:**
- Create: `test/playwright/forside.spec.mjs`
- Modify: `site.js` (klikkmåling)
- Test: `test/forside-maling.test.mjs`

**Interfaces:**
- Consumes: den ferdige forsiden.
- Produces i `site.js`: hendelsen `download_click` med egenskapene `page_path`, `cta_location` (verdien i `data-hent`) og `visning` (`'qr'` eller `'lenke'`). Sendes bare etter samtykke, gjennom den eksisterende `capture`.

- [ ] **Step 1: Skriv nettlesertestene**

```js
for (const bredde of [320, 360, 390, 768, 1280]) test(`ingen sidelengs rulling og ingen feil i konsollen på ${bredde} px`, async ({ page }) => { /* scrollWidth <= innerWidth etter rulling til bunnen */ });

test('før samtykke går ingen forespørsel til andre verter', async ({ page }) => { /* samle page.on('request'), krev at alle har vert 127.0.0.1 */ });

test('filmen går, og et trykk på steg 4 hopper til rundt 9,7 sekunder', async ({ page }) => { /* currentTime mellom 9.7 og 11.5 */ });

test('PC: nedlastingsknappen åpner QR-vinduet, Escape lukker det, og fokus går tilbake til knappen', async ({ page }) => {});

test('mobil: nedlastingsknappen er en vanlig lenke til /app, og den faste knappen kommer og går', async ({ page }) => { /* viewport 390, hasTouch: true */ });

test('trykk på film, kort og bånd stopper ingenting', async ({ page }) => { /* klikk hver av dem, vent, krev at video.paused er false og at båndet har flyttet seg */ });

test('redusert bevegelse: filmen står, båndet står, og overskriften er ferdig skrevet', async ({ page }) => { /* emulateMedia({ reducedMotion: 'reduce' }) */ });

test('uten JavaScript: overskriften synes, hyllene i bunnen er åpne på mobil, og knappene går til /app', async ({ browser }) => { /* newContext({ javaScriptEnabled: false }) */ });

test('200 % tekst på 390 px: ingen tekst ligger utenfor sin boks', async ({ page }) => { /* sett font-size 200 % på html, sammenlign scrollWidth og clientWidth for hvert kort */ });

test('menyen åpnes og lukkes, og hyllene i bunnen foldes ut på mobil', async ({ page }) => {});

test('1280 × 800: hele telefonen synes uten å rulle', async ({ page }) => { /* .film: top >= 0 og bottom <= 800 */ });

test('390 px: rekkefølgen i toppen er overskrift, knapp, stjerner, telefon, ingress', async ({ page }) => { /* sammenlign getBoundingClientRect().top for de fem */ });

test('punktumet i overskriften kommer minst 400 ms etter siste bokstav', async ({ page }) => {});

test('kokeboka står like langt under båndet som båndet står under telefonen', async ({ page }) => { /* 72 px på 1280, 52 px på 390, pluss minus 2 */ });

test('filmen holder plassen sin før den er lastet', async ({ page }) => { /* page.route('**/*.mp4', (r) => r.abort()), krev at .film har samme høyde som når filmen lastes */ });
```

- [ ] **Step 2: Kjør dem og rett det de finner**

Run: `npm run test:e2e -- forside`
Expected: PASS. Det som feiler, rettes i `skall.css`, `forside.css`, `skall.js` eller `forside.js`. Testene endres ikke for å bli grønne.

- [ ] **Step 3: Skriv testen for klikkmålingen, se den feile, og legg målingen i `site.js`**

```js
test('site.js måler nedlastingsklikk bare gjennom capture, med plassering', () => {
  const js = les('site.js');
  assert.match(js, /closest\('\[data-hent\]'\)/);
  assert.match(js, /capture\('download_click'/);
  assert.doesNotMatch(js.replace(/function capture[\s\S]*?\n  \}/, ''), /posthog\.capture\(/, 'all måling skal gå gjennom capture, som sjekker samtykket');
});
```

Run: `node --test test/forside-maling.test.mjs`
Expected: FAIL før endringen, PASS etter.

- [ ] **Step 4: Mål ytelse og tilgjengelighet**

Run: `npx lighthouse http://127.0.0.1:4173/ --form-factor=mobile --only-categories=performance,accessibility --quiet`
Expected: ytelse minst 90, tilgjengelighet minst 95. Lim tallene inn i PR-beskrivelsen. Tilgjengelighet under 95 skal rettes. Unntaket er funnet om at bevegelse ikke kan stoppes: det er et valgt avvik (specens punkt 9) og nevnes i PR-en.

- [ ] **Step 5: Ta skjermbilder til PR-en**

Hele siden på 390 og 1280 px, og QR-vinduet. Legg dem i PR-beskrivelsen.

- [ ] **Step 6: Commit**

```bash
git add test/playwright/forside.spec.mjs test/forside-maling.test.mjs site.js skall.css forside.css skall.js forside.js
git commit -m "forsiden: nettlesertester og måling av nedlastingsklikk"
```

---

## Etter siste oppgave

- [ ] Åpne PR mot `main` med skjermbildene, Lighthouse-tallene og lista over de fem beslutningene (A til E).
- [ ] Ikke merge. Patrick ser forsiden på en ekte iPhone og en ekte Android-telefon først, og skanner QR-koden.
- [ ] Etter merge: kontroller at `https://matlyst-app.no/` svarer 200, at `/tokens.css`, `/skall.css` og `/forside.css` svarer 200, og at en underside (`/handleliste/`) ser ut som før.
- [ ] Før og etter: noter klikk og visninger for forsiden i Search Console, og se på dem igjen etter to uker (specens punkt 11).

## Det planen ikke dekker

- Forsiden på svensk, dansk og engelsk (steg 2). `TEKST`, `HYLLER` og filmen har plass til flere språk, men bare `nb` fylles.
- Sideskallet på undersidene (steg 3). `scripts/skall.mjs` er skrevet for det, men ingen underside kaller den ennå.
- Guide, omregner og de seks nye kalkulatorene (steg 4 og 5).
- Ekte svar i Spør Matlyst og ekte matbilder (specens punkt 12).

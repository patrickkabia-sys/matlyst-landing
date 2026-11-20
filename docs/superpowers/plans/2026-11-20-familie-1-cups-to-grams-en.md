# Familie 1 på engelsk, cups to grams: utforming og byggeplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Mål:** En engelsk samleside og rundt 45 varesider for USA som svarer på «how many grams in a cup of flour», i gram og ounces, med kalkulator øverst og USDA som kilde på hvert tall.

**Arkitektur:** Samme familie som den norske (`scripts/familier/dl-til-gram/`), med markedet `en`: egen vareliste, egen datafil hentet fra USDAs nedlastbare datasett, og egen mal. Kalkulatorkortet utvides med fire valgfrie datafelt (brøker, entall og flertall, hurtigmengder per enhet, bytteverdi) slik at norske sider er uendret. Den engelske generatoren får samme toppfelt som den norske.

**Teknologi:** Node 22, `node --test`, Playwright. Ingen nye avhengigheter.

**Spec:** Denne fila (avsnittet «Utforming»). Forbilde: den norske familien, live på `/verktoy/dl-til-gram/`, og planen `2026-11-20-familie-1-dl-til-gram.md`. Kildegrunnlaget ligger i `~/matlyst-privat/seo-matlyst/2026-11-19-sokeord/familie1-dl-til-gram/kilder/` (`usda-sr-legacy-2018-04.json`, `usda-foundation-2026-10-29.json`, `usda-kandidater.json`).

## Utforming

### Adresser og omfang
- Samleside `/en/tools/cups-to-grams/`, vareside `/en/tools/cups-to-grams/<item>/` (for eksempel `/en/tools/cups-to-grams/flour/`).
- Én side per vare. Siden dekker cups, tablespoons og teaspoons, svarer i gram og ounces, og regner begge veier.
- Svensk og dansk er ikke med.

### Kilde
- Eneste kilde på sidene: USDA FoodData Central, datasettet SR Legacy (2018, publisert 2019), offentlig eie (CC0). Kildelinja følger USDAs foreslåtte sitat: «U.S. Department of Agriculture, Agricultural Research Service. FoodData Central, SR Legacy. fdc.nal.usda.gov.» med hentedato.
- King Arthur Bakings vekttabell publiseres ikke og siteres ikke (vilkårene forbyr gjengivelse). Den brukes bare som intern rimelighetskontroll.
- Hvert tall leses fra datasettet med FDC-ID og porsjonens ordrette betegnelse («cup», «cup, packed», «cup, sifted», «stick»). En vare uten cup-porsjon (eller teaspoon-porsjon for hevemidler) blir ikke en side.
- Tablespoon og teaspoon i kalkulator og tabell regnes ut fra cup-tallet (1 cup = 16 tbsp = 48 tsp) og merkes som utregnet. Der USDA har egne tall for tablespoon eller teaspoon, står de i tabellen «USDA entries» med USDAs betegnelse, ikke i kalkulatoren. Slik viser kalkulator og tabell alltid samme tall.
- Hevemidler (baking powder, baking soda, active dry yeast) har bare teaspoon hos USDA. Der er teaspoon grunnlaget, og cup er utregnet.
- Ingen måleråd eller forklaringer som ikke står i kilden. Ett unntak som er ren regning og hører hjemme her: en cup er 8 fluid ounces i volum, og siden sier hva den veier i ounces («A cup of flour holds 8 fluid ounces but weighs 4.4 ounces.»).

### Varene
Kandidater med entydig post i SR Legacy (se `usda-kandidater.json` for FDC-ID-er): all-purpose flour, bread flour, whole wheat flour, cornstarch, cornmeal, granulated sugar, brown sugar, powdered sugar, honey, maple syrup, molasses, butter, olive oil, vegetable oil, shortening, milk, heavy cream, sour cream, yogurt, cottage cheese, cream cheese, shredded cheddar, grated parmesan, water, rolled oats, white rice, brown rice, quinoa, lentils, black beans, cocoa powder, chocolate chips, peanut butter, salt, baking powder, baking soda, active dry yeast, raisins, walnuts, almonds, shredded coconut, breadcrumbs, mashed banana, blueberries.

- Ikke med: cake flour (USDAs tall er likt bread flour og lite troverdig), almond flour, kosher salt, chia seeds og Greek yogurt (ingen cup-porsjon).
- Varer med flere porsjoner i samme post viser alle i «USDA entries» og bruker én i kalkulatoren: brown sugar (packed), powdered sugar (unsifted), raisins (not packed), cottage cheese (small curd), almonds (whole), walnuts (chopped), cheddar (shredded), chocolate chips (standard chips). Hvilken som brukes, står i ingressen.
- Navnet på siden sier hva posten er der det ikke er opplagt: «Vegetable oil (soybean)», «Sweetened shredded coconut», «Cornmeal (whole-grain yellow)», «Rolled oats».

### Kobling mot de norske sidene
Samme rad-id på norsk og engelsk gir hreflang mellom sidene. Det gjøres bare der varen er den samme: hvetemel (flour), sammalt-hvetemel (whole-wheat-flour), havregryn (rolled-oats), sukker (sugar), brunt-sukker (brown-sugar), melis (powdered-sugar), maisstivelse (cornstarch), kakao (cocoa-powder), smor (butter), melk (milk), flote (heavy-cream), romme (sour-cream), salt (salt), ris (white-rice), rosiner (raisins), mandler (almonds). Alle andre engelske rader får egne id-er og står alene. Samlesidene kobles. Tallene er ulike på de to språkene, fordi kildene er ulike; det er riktig og skal ikke jevnes ut.

### Varesiden, ovenfra og ned
1. Eyebrow «Tools › Cups to grams».
2. H1 «Flour: cups to grams». Ingress med svaret i begge enheter: «1 cup of all-purpose flour weighs 125 g (4.4 oz). Type an amount to convert.»
3. Kalkulatoren: varen fast med lenka «Change ingredient», mengde (tar også brøker som 1/2 og 1 1/2), fra og til (cups, tablespoons, teaspoons, fluid ounces, milliliters, grams, ounces, pounds), bytteknapp, seks hurtigknapper (1/4, 1/3, 1/2, 3/4, 1, 2 for cups), og svarsetningen «1/2 cup flour = 63 g».
4. Short answer med cup, tablespoon og teaspoon, og kildelinje.
5. To kort: «Flour, cups to grams» (1 tsp, 1 tbsp, 1/4, 1/3, 1/2, 2/3, 3/4, 1 og 2 cups, med kolonner for gram og ounces) og «Grams to cups» (formel og 50 g, 100 g, 250 g, 500 g).
6. Appkortet (engelsk tekst fra dagens omregnersider).
7. «Ounces: volume and weight»: to setninger og tallene (8 fl oz i volum, vekten i oz).
8. «USDA entries»: postens navn, FDC-ID og alle porsjonene posten har, med den som brukes uthevet. Nære poster (bread flour på flour-siden) lenkes som egne varer.
9. Sources.
10. Other ingredients: åtte lenker pluss «All ingredients».
11. Questions (generatoren legger dem sist): tre til fire, i ren tekst uten lenker, med `FAQPage` slik de engelske testene krever.

Smør får i tillegg «1 stick = 113 g» i tabellen og ett spørsmål om sticks, fra USDAs porsjon «stick».

### Samlesiden
H1 «Cups to grams». Kalkulator med ingrediensvalg (standard flour). Tabellen «What does 1 cup weigh?» med alle varer: 1 cup i gram, 1 cup i ounces, 1 tbsp og 1 tsp i gram. Deretter appkort, «Why a cup does not weigh the same» (volum mot vekt, to tall fra datafila), «How we calculated», questions, sources, related conversions.

### Titler
- Vareside: «Flour: cups to grams and ounces (1 cup = 125 g)», høyst 60 tegn; for lang, så uten «and ounces».
- Samleside: «Cups to grams: calculator and chart for 44 ingredients» (tallet følger antallet).
- Beskrivelse 100 til 160 tegn, med tallet i.

### Tallregler
Som på norsk, med punktum: gram fra 1 g og opp som hele tall; alt annet med to gjeldende sifre under 10, tre fra 10 til 100, heltall fra 100. Ounces følger «alt annet» (4.4 oz, 16 oz). Ingen tusenskille.

### Språk
Amerikansk engelsk, skrevet med skillen `matlyst-sprak` (en-US) og gransket av Opus. Enhetsord som på dagens engelske omregnersider: «cups», «tablespoons (tbsp)», «teaspoons (tsp)», «fluid ounces (fl oz)», «ounces (oz)», «pounds (lb)». «1 cup», «2 cups», «1/2 cup».

## Felles krav

- Norske sider skal være bytelike etter oppgave 1 og 2 (`kjede-fasit`), bortsett fra hreflang på de norske familiesidene når koblingen slås på i oppgave 5.
- Ett tall på en side uten grunnlag i datafila gir rød test. Kalkulator og tabell skal gi samme tall, låst av en Playwright-test som utleder forventningen fra siden.
- All kode, kommentarer og commit-meldinger på norsk bokmål uten tankestrek. Sidenes tekst på amerikansk engelsk, uten tankestrek (— og –) som skilletegn.
- Designspecen gjelder (tokens, rem, 44 px, WCAG AA).
- Ingenting publiseres før Patrick har sett forhåndsvisningen.
- Bygging: Sonnet. Gransking: Codex på tall og kode, Opus på språk.

## Det granskeren skal se etter

1. **Brøker.** «1/2», «1 1/2», «3/4» skal regnes; «1/0», «1/», «/2», «1 2» og «1/2/3» skal gi veiledningen, ikke et tall. Test i oppgave 1.
2. **Entall og flertall.** «1 cup», «1/2 cup», «2 cups», «1.5 cups», «0.8 cups», «1 1/2 cups». Kortformene er «cup/cups», «tbsp», «tsp», «fl oz», «g», «oz», «lb»; bare cup bøyes. Test i oppgave 1.
3. **Fluid ounces mot ounces.** Fra «fl oz» til «oz» er volum til vekt og trenger varens vekt; de to må aldri behandles som samme enhet. Test i oppgave 1.
4. **Norske sider uendret.** Et skjema uten de nye datafeltene skal oppføre seg nøyaktig som i dag, også for «1/2» (ugyldig på norsk). Test i oppgave 1.
5. **Post med flere porsjoner.** Brown sugar har «cup packed» og «cup unpacked»: kalkulator, ingress, tabell og spørsmål må bruke samme porsjon, og den andre må stå tydelig merket. Test i oppgave 4.

---

### Oppgave 1: Kalkulatorkortet for engelske sider (PR F)

**Filer:**
- Endre: `site.js` (kalk-delen), `docs/superpowers/specs/2026-11-18-nettside-designsystem-design.md` (punkt 16.8)
- Endre: `test/playwright/kalk.spec.mjs`
- Lag: `test/playwright/fiksturer/kalk-en.html`

**Grensesnitt:** fire valgfrie felt i `kalk-data`. Mangler de, er oppførselen som i dag.

```json
{
  "brok": true,
  "kort": { "cups": ["cup", "cups"], "tbsp": "tbsp" },
  "stegFor": { "cups": "cup", "tbsp": "skje", "tsp": "skje", "floz": "floz", "ml": "ml", "g": "g", "oz": "oz", "lb": "lb" },
  "byttTil": { "cups": "1", "tbsp": "1", "tsp": "1", "floz": "8", "ml": "100", "g": "100", "oz": "4", "lb": "1" }
}
```

- `brok`: mengden kan skrives som `a/b` eller `n a/b` (heltall, nevner over 0). Svarsetningen gjengir brøken slik den ble skrevet, normalisert («1 1/2»). Ellers brukes `tolkTall` som før.
- `kort[e]` som liste er `[entall, flertall]`: entall når mengden er nøyaktig 1, eller en brøk under 1 skrevet som brøk («1/2 cup»). Alt annet er flertall, også desimaltall under 1 («0.8 cups», «1.5 cups», «1 1/2 cups»). Gjelder svarsetningen og hurtigknappene, på begge sider av likhetstegnet.
- `stegFor[e]` peker på en nøkkel i `steg`. Finnes feltet, kreves bare de gruppene det peker på (ikke `volum`, `ml`, `g`, `kg`).
- `byttTil[e]` er mengden som settes når `e` blir fra-enhet ved bytte.
- Enhetene i `ml` og `g` er fritt valgte nøkler: `floz` (29.5735295625 ml) er volum, `oz` (28.349523125 g) og `lb` (453.59237 g) er vekt.

- [ ] **Steg 1: Skriv de røde testene** mot `kalk-en.html` (`<html lang="en">`, flour med 125 g per cup regnet til gram per dl, og en vare uten vekt):

```js
test('brøker regnes, og setningen gjengir brøken', async ({ page }) => {
  for (const [inn, setning] of [['1/2', '1/2 cup flour = 63 g'], ['1 1/2', '1 1/2 cups flour = 188 g'], ['3/4', '3/4 cup flour = 94 g'], ['2', '2 cups flour = 250 g'], ['1.5', '1.5 cups flour = 188 g']]) {
    await page.fill('#fast [data-felt=mengde]', inn);
    await expect(page.locator('#fast [data-felt=setning]')).toHaveText(setning);
  }
});
for (const tekst of ['1/0', '1/', '/2', '1 2', '1/2/3', '-1/2']) {
  test(`«${tekst}» gir veiledning`, async ({ page }) => {
    await page.fill('#fast [data-felt=mengde]', tekst);
    await expect(page.locator('#fast [data-felt=setning]')).toHaveText('Enter an amount, like 2 or 1/2.');
  });
}
test('gram til ounces og pounds, og fluid ounces er volum', async ({ page }) => {
  await page.selectOption('#fast [data-felt=til]', 'oz');
  await expect(page.locator('#fast [data-felt=setning]')).toHaveText('2 cups flour = 8.8 oz');
  await page.selectOption('#fast [data-felt=fra]', 'floz'); await page.fill('#fast [data-felt=mengde]', '8');
  await expect(page.locator('#fast [data-felt=setning]')).toHaveText('8 fl oz flour = 4.4 oz');
  await page.selectOption('#utenvekt [data-felt=fra]', 'floz'); await page.selectOption('#utenvekt [data-felt=til]', 'oz');
  await expect(page.locator('#utenvekt [data-felt=setning]')).toHaveText('Enter an amount, like 2 or 1/2.');
});
test('hurtigknappene følger enheten, med brøker for cups', async ({ page }) => {
  await expect(page.locator('#fast .hurtig button')).toHaveText(['1/4 cup', '1/3 cup', '1/2 cup', '3/4 cup', '1 cup', '2 cups']);
  await page.click('#fast .hurtig button:nth-child(3)');
  await expect(page.locator('#fast [data-felt=svar]')).toHaveText('63');
  await expect(page.locator('#fast .hurtig button:nth-child(3)')).toHaveAttribute('aria-pressed', 'true');
});
test('bytte setter mengden fra byttTil, og tilbake', async ({ page }) => {
  await page.click('#fast [data-felt=bytt]');
  await expect(page.locator('#fast [data-felt=setning]')).toHaveText('100 g flour = 0.8 cups');
});
test('norsk skjema uten de nye feltene er som før: brøk er ugyldig', async ({ page }) => {
  await page.goto('/test/playwright/fiksturer/kalk.html');
  await page.fill('#fast [data-felt=mengde]', '1/2');
  await expect(page.locator('#fast [data-felt=mengde]')).toHaveAttribute('aria-invalid', 'true');
});
```

- [ ] **Steg 2: Kjør** `npx playwright test kalk`. Forventet: rødt.
- [ ] **Steg 3: Bygg de fire feltene i `site.js`.** `tolkTall` og omregneren røres ikke.
- [ ] **Steg 4: Kjør** `npm test`, `npx playwright test kalk undersider`. Forventet: grønt, `kjede-fasit` uten avvik.
- [ ] **Steg 5: Utvid punkt 16.8 i designspecen** med de fire feltene. Maks åtte linjer.
- [ ] **Steg 6: Commit** `kalkulatorkortet: brøker, entall og flertall, og hurtigmengder per enhet`.

### Oppgave 2: Toppfelt i den engelske generatoren, og delt malkode (PR F)

**Filer:**
- Endre: `scripts/generer-lokalsider.mjs` (`guidePage`, ca. linje 728)
- Lag: `scripts/familier/dl-til-gram/felles-mal.mjs`
- Endre: `scripts/familier/dl-til-gram/mal-nb.mjs` (bruker de delte funksjonene)
- Endre: `test/side-topp.test.mjs`, `test/dl-til-gram-mal.test.mjs`

**Grensesnitt:**
- `guidePage(lang, v)`: `v.topp` skrives rett før `</header>` i heroen. En side med `topp` får `prose locale-prose` uten `has-toc`. Sider uten `topp` er bytelike.
- `felles-mal.mjs` eksporterer det som er språknøytralt i dag: `sigTekst(n, sifre)`, `gramTekst(n, { komma })`, `mengdeTekst(n, { komma })`, `esc(tekst)`, `tallI(tekst)`, ikonene `PIL` og `BYTT`, og `kalkSkjelett({ id, etiketter, enheter, fra, til, data, start, vareHtml })` som gir `<form class="kalk">…</form>`. `etiketter` er `{ aria, mengde, fra, til, bytt, vanlige }`.
- `mal-nb.mjs` gir nøyaktig samme HTML som før.

- [ ] **Steg 1: Skriv de røde testene:** en engelsk side med `topp` får skjemaet mellom `class="lead"` og `<section class="prose locale-prose">`, uten `has-toc`; en engelsk side uten `topp` er tegn for tegn lik den publiserte (`en/tools/cups-to-ml/index.html`, hero og åpningen av lesedelen); `gramTekst(27.5, { komma: false }) === '28'`, `mengdeTekst(4.409, { komma: false }) === '4.4'`, `mengdeTekst(0.8, { komma: true }) === '0,8'`.
- [ ] **Steg 2: Kjør** testene. Forventet: rødt.
- [ ] **Steg 3: Legg til `topp` i `guidePage`, trekk ut `felles-mal.mjs` og la `mal-nb.mjs` bruke den.**
- [ ] **Steg 4: Kjør** `npm test`. Forventet: grønt, og `kjede-fasit` uten avvik (de norske familiesidene er bytelike).
- [ ] **Steg 5: Commit** `familier: toppfelt på engelsk og delt malkode`.

### Oppgave 3: Tall fra USDA, og kontroll mot datasettet (PR G)

**Filer:**
- Lag: `scripts/familier/dl-til-gram/varer-en.mjs`, `hent-usda.mjs`, `kontroller-usda.mjs`, `data.en.json`
- Lag: `test/dl-til-gram-data-en.test.mjs`, `test/fiksturer/dl-til-gram/sr-legacy-utdrag.json`

**Grensesnitt:**
- `VARER_EN`: `{ id, slug, navn, ord, fdcId, basis: 'cup' | 'tsp', porsjon: string, vis?: string[] }`. `porsjon` er modifikatoren som brukes, ordrett fra datasettet. `navn` er overskriftsformen («Flour»), `ord` formen i en setning («flour»), og raden bærer `tekst.variant` («all-purpose flour», «packed brown sugar»).
- `radFraUsda(vare, sr) → Rad | null`. Tall: `cup` eller `tsp` (grunnlaget, kilde `usda`), og hver øvrig porsjon i posten som `p_<n>` med modifikatoren i `merknad`. Radens `tekst` har `usdaNavn` og `fdcId`.
- `avvikUsda(data, sr) → { id, felt, iFila, iKilden }[]`. Kommandolinjen tar `--fil <sti til SR Legacy-JSON>`; datasettet (210 MB) legges ikke i repoet. Uten avvik settes status `kontrollert`.
- Kilden i datafila: `usda` med navn «FoodData Central, SR Legacy», utgiver «U.S. Department of Agriculture, Agricultural Research Service», år 2019, adresse `https://fdc.nal.usda.gov/`, hentet i dag.
- Hvert tall leses fra datasettet. `usda-kandidater.json` er et forslag til FDC-ID-er, ikke en kilde for tall.

- [ ] **Steg 1: Skriv de røde testene** mot et ekte utdrag (fem poster uendret fra SR Legacy, blant dem brown sugar med to cup-porsjoner og baking powder uten cup): rad for flour har `cup` 125 med kilde; brown sugar bruker «cup packed» 220 og har «cup unpacked» 145 som egen porsjon; baking powder har basis `tsp`; en vare med ukjent FDC-ID gir `null`; et endret tall gir avvik som navngir vare, felt og begge tall; datafila er gyldig og har minst 38 kontrollerte rader.
- [ ] **Steg 2: Kjør** testen. Forventet: rødt.
- [ ] **Steg 3: Bygg, kjør hent og kontroll mot datasettet.** Gjør så en uavhengig etterkontroll med et engangsskript utenfor repoet som slår opp hver rad på nytt og skriver vare, tall i fila og tall i kilden side om side.
- [ ] **Steg 4: Kjør** `npm test`. Forventet: grønt.
- [ ] **Steg 5: Commit** `cups to grams: tall fra USDA, kontrollert mot datasettet`, med hvor mange varer som ble rader og hvilke som falt bort.

### Oppgave 4: Engelsk mal og tekst (PR G)

**Filer:**
- Lag: `scripts/familier/dl-til-gram/mal-en.mjs`, `tekst-en.mjs`
- Lag: `test/dl-til-gram-mal-en.test.mjs`

**Grensesnitt:**
- Bruker: `felles-mal.mjs` og `topp` (oppgave 2), datafeltene fra oppgave 1, malkontrakten (`navSide`, `sideForRad`, `tillatteTall`, `tillatteTallNav`), `webApplikasjon`, `artikkel`, `elementliste` fra `skjema.mjs`.
- `utregnetEn(rad) → { gPerCup, oz, tbsp, tsp, tabell: [etikett, gram, ounces][], tilbake: [gram, cups][] }`. Gram per dl til kalkulatoren er `gPerCup / 2.365882365`, uavrundet.
- `schemas`: `[webApplikasjon(…), artikkel(…), 'faq']` (generatoren legger brødsmulene selv). Samlesiden får også `elementliste`.
- Spørsmål og svar er ren tekst uten HTML.

- [ ] **Steg 1: Skriv de røde testene:** flour: «1 cup of all-purpose flour weighs 125 g (4.4 oz)» i ingress og beskrivelse, «1/2 cup flour = 63 g» i `topp`, raden «1/4 cup» med 31 g og 1.1 oz; butter har raden «1 stick» med 113 g; brown sugar bruker 220 overalt og viser «cup unpacked» 145 i «USDA entries»; baking powder viser teaspoon først; ingen side har «undefined», «NaN» eller tom overskrift; titler høyst 60 tegn, beskrivelser 100 til 160; posisjonell kontroll av hvert tall i tabellene, ingress, short answer, beskrivelse og spørsmål mot datafila (endre flour til 1, 120 og 200 i en kopi og se rødt); `schemas` har `WebApplication`, `Article` og strengen `'faq'`, og ingen `HowTo`.
- [ ] **Steg 2: Kjør** testen. Forventet: rødt.
- [ ] **Steg 3: Bygg malen og skriv tekstene** med `matlyst-sprak` (en-US).
- [ ] **Steg 4: Kjør** testen. Forventet: grønt.
- [ ] **Steg 5: Commit** `cups to grams: engelsk mal og tekst`.

### Oppgave 5: Markedet inn i registeret, og sidene på disk (PR G)

**Filer:**
- Endre: `scripts/familier/register.mjs` (`markeder.en = { rot: 'tools/cups-to-grams/' }`), `scripts/hyller.mjs` (`HYLLETEKST.en`: «Cups to grams»)
- Endre: tellende tester (hyller, sidetyper, sitemap)
- Lag: `en/tools/cups-to-grams/**/index.html` (skrives av kjeden), `test/playwright/kalk-tabell-en.spec.mjs`

- [ ] **Steg 1: Legg inn markedet og kjør kjeden.** Forventet i `git status`: nye filer under `en/tools/cups-to-grams/`; `sitemap-en.xml`, `llms.txt`, lastmod-kart; hyllelenka på engelske sider; og hreflang på de norske familiesidene som nå har engelsk motstykke (samlesiden og de 16 koblede varene). Ingenting annet. Sv og da skal være urørt. De tre håndskrevne avmeldingssidene tilbakestilles som sist.
- [ ] **Steg 2: Kjør** `npm test` og oppdater tellingene. `test/familier.test.mjs` og `test/locale-pages.test.mjs` skal være grønne for de nye sidene.
- [ ] **Steg 3: Kalkulator mot tabell.** `kalk-tabell-en.spec.mjs` på flour, butter og salt: hver rad i tabellen tastes inn i kalkulatoren (også brøkene), og svaret i gram og ounces skal være samme tekst som i tabellen.
- [ ] **Steg 4: Mål likheten** (`forLike` for markedet `en`), legg de fem laveste i PR-en, og løft sider under 0,2 med innhold fra datasettet, aldri ved å senke terskelen.
- [ ] **Steg 5: Kjør** sidekontrollen på de nye sidene og hele e2e-suiten lokalt.
- [ ] **Steg 6: Commit** `cups to grams: samleside og varesider på engelsk`.

### Oppgave 6: Gransking, forhåndsvisning og publisering

- [ ] **Steg 1:** Codex gransker tall og kode. Opus gransker språket som amerikansk redaktør (`matlyst-sprak`, en-US). Retterunde.
- [ ] **Steg 2:** Lighthouse mobil på samlesiden og flour: tilgjengelighet 100 og SEO 100.
- [ ] **Steg 3:** Skjermbilder (samleside, flour, butter, brown sugar, baking powder på 390 og 1280 px) og lokal adresse til Patrick. Vent på ja.
- [ ] **Steg 4:** Etter sammenslåing: kontroller sidene på nettstedet, bekreft IndexNow, og sett datoer for indeksmåling etter én og to uker.

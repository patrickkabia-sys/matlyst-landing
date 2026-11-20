# De 714 enhetsomregnerne: kalkulatorkortet øverst og «cups» i teksten

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Alle 714 enhetsomregnere (710 parsider og 4 samlesider på nb, sv, da og en) får det nye kalkulatorkortet (`form.kalk`) rett under ingressen, og «cups» som hovedord i synlig tekst på nb, sv og da, uten at en eneste adresse endres.

**Architecture:** Kortet i `site.js` lærer enhetsomregning gjennom fire valgfrie felt i `kalk-data` (lengde, temperatur, fire gjeldende sifre, mengden beholdes ved bytte), så sidene i familien «dl til gram» er bytelike. Kortets HTML og tallregel flyttes til en delt modul som de fire generatorene (`scripts/<språk>-enhetssider.mjs`) bruker gjennom feltet `topp`. Den gamle omregneren (`form.omregner`), stilen dens og etterbehandlingen `omregner-flertall` fjernes når ingen side bruker dem.

**Tech Stack:** Node (ESM, `node --test`), Playwright 1.63, statisk HTML på GitHub Pages. Ingen nye avhengigheter.

**Spec:** `docs/superpowers/specs/2026-11-18-nettside-designsystem-design.md` punkt 10, 16.4, 16.7 og 16.8, og prototypen `docs/superpowers/prototyper/2026-11-18-omregner.html` (kalkulatoren øverst som svaret). Søkevolum: `~/matlyst-privat/seo-matlyst/2026-11-19-sokeord/C-volum-{no,se,dk}.csv`.

## Global Constraints

- **Ingenting publiseres før etter indeksmålingen 04.12.2026 og Patricks ja.** `main` publiseres av GitHub Pages, så grenen `feat/omregnere-kalkkort` merges ikke før oppgave 8. PR-en står som utkast.
- **Adressene er urørt.** `SLUGDEL`, `TIL`, `VERKTOY`, `parSlug` og `parSti` i `scripts/enheter.mjs` endres ikke. «kopp», «kop» og «kopp-till» blir stående i adressene. Canonical og hreflang er som før.
- **Sidene i familien «dl til gram» (nb og en) er bytelike** før og etter. Bevis: `node scripts/kjedeproeve.mjs alle` viser ingen avvik under `verktoy/dl-til-gram/` og `en/tools/cups-to-grams/`.
- En generator kjøres aldri alene mot arbeidskopien. Sidene bygges med `scripts/kjede.mjs`, og prøves med `node scripts/kjedeproeve.mjs alle` (designspec 16.7).
- All tekst i kortet kommer fra sidens egne data (`kalk-data`). `site.js` får ingen språkstrenger.
- Ingen tankestrek som skilletegn. Ingen påstand uten kilde: faktorene er definisjoner og står allerede i `scripts/enheter.mjs`; ingen nye tall eller forklaringer legges til.
- Tekst på sv, da og nb skrives og granskes etter skillen `matlyst-sprak` (fire roller), aldri oversatt setning for setning.
- Hver ny test bevises rød ved et bevisst brudd før den regnes (designspec 16.7).
- Arbeidstre: `~/Documents/Apps/matlyst-traer/landing-omregnere` (uten æ i stien), gren `feat/omregnere-kalkkort` fra `origin/main`. `npm ci` i treet, ikke symlenke.
- Kommandoer: `npm test` (enhetstester), `npx playwright test <fil>` (nettlesertester), `REVISJON=alle npx playwright test revisjon.spec` (0 røde før forhåndsvisning).

## Avgjørelser (tatt i planen, vises Patrick i forhåndsvisningen)

1. **Hovedord per språk etter søkevolum.** nb «cups» («cups til dl» 316 mot «kopp til dl» 32 per måned), sv «cup» («cup till dl» 3 162 mot «kopp till dl» 32), da «cup» («cup til dl» 316). Mengder bøyes på alle tre språk: «1 cup», «2 cups».
2. **«Kopp» beholdes som biord** to steder per relevant side, fordi folk også spør slik («hvor mange dl er en kopp» 316 på norsk, «hur många dl är en kopp» på svensk): én forklarende setning («En cup er en amerikansk kopp, 236,6 ml») og ett spørsmål i spørsmål og svar på sidene mellom cups og dl. Ingen andre steder.
3. **Svarboksen blir «Kort svar» under kortet.** Innholdet i dagens `.answer` flyttes til `<p class="kortsvar">` i `topp`, som på sidene for dl til gram. Seksjonen «Kalkulator», svarboksen og innholdsfortegnelsen går ut av lesedelen.
4. **Tall: fire gjeldende sifre, 1000 og over som heltall,** i kortet, tabellene og teksten (samme regel alle steder). Det endrer bare tall under 0,1 fra i dag («0,00423» blir «0,004227»).
5. **Startmengden er 1,** unntatt temperatur: 180 for celsius og 350 for fahrenheit. Bytteknappen beholder mengden. Negative tall er lov bare for temperatur.
6. **Samlesidene** (enhetsomregner på fire språk) får kortet med volumenhetene, som i dag, og listene under.
7. **Engelske sider** får brøker i kortet (`brok: true`), som cups to grams.

## Filstruktur

| Fil | Ansvar |
|---|---|
| `site.js` | Kortet lærer `affin`, `negativ`, `sifre`, `beholdMengde`; `varer` blir valgfritt. Til slutt fjernes løkka over `form.omregner` (tallfunksjonene blir stående). |
| `scripts/kalk-kort.mjs` (ny) | Språknøytral kortkode: `esc`, `tallI`, `sigTekst`, `gramTekst`, `mengdeTekst`, `presisTekst`, `PIL`, `BYTT`, `kalkSkjelett`. Flyttet fra `scripts/familier/dl-til-gram/felles-mal.mjs`, som reeksporterer dem uendret. |
| `scripts/enheter.mjs` | `tall` følger `presisTekst`; nye `HURTIG`, `START`, `KORT_ETIKETTER`, `enhetsKort`; nye navn for `cups` på nb, sv og da. |
| `scripts/rik-sider.mjs` | Ny `byggLese` (lesedel uten svarboks og innholdsfortegnelse). |
| `scripts/{nb,sv,da,en}-enhetssider.mjs`, `scripts/en-rike-sider.mjs` (samlesiden) | `topp` med kort og kort svar, lesedel uten kalkulatorseksjon, «cups» i teksten, eksportert `KOPP_BIORD`. |
| `side.css` | Kortet uten varerad; stilen for `form.omregner` og `.omregner-*` (unntatt `.omregner-liste`) fjernes til slutt. |
| `scripts/omregner-flertall.mjs`, `test/omregner-flertall.test.mjs` | Slettes; `scripts/kjede.mjs` og `test/kjede-fasit.test.mjs` følger. |
| `test/fasit/omregner-adresser.json`, `test/omregner-adresser.test.mjs` (nye) | Låser de 714 adressene. |
| `test/playwright/fiksturer/kalk-enhet.html`, `test/playwright/kalk-enhet.spec.mjs`, `test/playwright/kalk-tabell-enhet.spec.mjs` (nye) | Kortets nye felt, og at tabellene på ekte sider er like kortets svar. |
| `test/omregner-sider.test.mjs` (ny) | Sidenes oppbygning og «cups»-regelen på alle fire språk. |
| Designspec 16.4 og 16.8 | Skrives om etter det som er bygget. |

## Review Focus

1. **Minusgrader:** «-18» i celsius gir «-0,4 °F», ikke veiledningen; på en volumside gir «-1» veiledningen. (Oppgave 1.)
2. **Svært små svar blir aldri «0»:** 0,01 ml til gallon viser et tall som ikke er 0. (Oppgave 1.)
3. **Bytte midt i bruk:** mengden står, hurtigknappene bytter til den nye fra-enhetens mengder, og `aria-pressed` følger tallet. (Oppgave 1.)
4. **Uten JavaScript** står et riktig, ferdig utregnet eksempel på hver side, likt det kortet regner ut. (Oppgave 3 og 7.)
5. **Lange enhetsnavn på 360 px** («Amerikanske spiseskjeer (tbsp)») bryter ikke kortet eller siden sidelengs. (Oppgave 7, revisjonen.)

---

### Task 1: Kalkulatorkortet lærer enhetsomregning

**Files:**
- Modify: `site.js` (blokken «Kalkulatorkortet (form.kalk)»)
- Create: `test/playwright/fiksturer/kalk-enhet.html`, `test/playwright/kalk-enhet.spec.mjs`
- Modify: `docs/superpowers/specs/2026-11-18-nettside-designsystem-design.md` (16.8, nye punkter under «valgfrie felt»)

**Interfaces:**
- Produces (valgfrie felt i `script.kalk-data`; mangler de, er oppførselen som i dag):
  - `affin: { [enhet]: [a, b] }`. Grunnverdi = `n * a + b`. Når både fra og til står i `affin`: `ut = (n * aFra + bFra - bTil) / aTil`. Celsius er `[1, 0]`, fahrenheit `[5/9, -160/9]`.
  - `negativ: true`. Negative mengder er gyldige.
  - `sifre: 4`. Svaret skrives slik for alle enheter (også gram): 0 er «0»; absoluttverdi 1000 og over som heltall (halve runder opp, rund på tolv gjeldende sifre først); ellers `sifre` gjeldende sifre uten overflødige nuller og uten tak på desimaler. Språkets desimaltegn.
  - `beholdMengde: true`. Bytteknappen bytter fra og til og lar mengden stå.
  - `varer` kan mangle. Da er vareordet tomt, og kryssing mellom `ml` og `g` gir veiledningen.
  - `ml` holder faktorene for gruppen som ikke er vekt (volum eller lengde). En temperaturside har `ml: {}` og `g: {}`.
- Consumes: `window.MatlystTall.tolkTall`, dagens `stegFor`, `steg`, `kort` og `brok`.

- [ ] **Step 1: Lag fiksturen `kalk-enhet.html`** etter mønsteret i `test/playwright/fiksturer/kalk.html` (`<html lang="nb">`, `side.css`, `site.js`), med fire skjemaer uten varerad, alle med `sifre: 4`, `beholdMengde: true`, `stegFor` som peker hver enhet på seg selv og seks hurtigmengder per enhet:
  - `#volum`: `ml: { ml: 1, dl: 100, cups: 236.5882365, gallons: 3785.411784 }`, `g: {}`, `kort: { cups: ['cup', 'cups'], gallons: 'gallon' }`, fra `cups`, til `dl`, mengde 1.
  - `#vekt`: `ml: {}`, `g: { g: 1, lb: 453.59237 }`, fra `lb`, til `g`.
  - `#lengde`: `ml: { mm: 1, cm: 10, inches: 25.4 }`, `g: {}`, `kort: { inches: ['tomme', 'tommer'] }`, fra `inches`, til `cm`.
  - `#temp`: `ml: {}`, `g: {}`, `affin: { c: [1, 0], f: [0.5555555555555556, -17.77777777777778] }`, `negativ: true`, `kort: { c: '°C', f: '°F' }`, fra `c`, til `f`, mengde 180.

- [ ] **Step 2: Skriv de feilende testene i `kalk-enhet.spec.mjs`** (les svarsetningen `[data-felt=setning]` og `[data-felt=svar]`):

```js
test('volum: fire gjeldende sifre og bøyd enhet', …)      // «1 cup = 2,366 dl»; mengde 2 gir «2 cups = 4,732 dl»
test('vekt: gram følger sifre, ikke gramregelen', …)       // «1 lb = 453,6 g»
test('lengde regnes i ml-feltet', …)                       // «1 tomme = 2,54 cm»; 9 gir «9 tommer = 22,86 cm»
test('temperatur er affin begge veier', …)                 // 180 °C = 356 °F; bytt: 180 °F = 82,22 °C; 0 °C = 32 °F
test('minusgrader er gyldige bare med negativ', …)         // #temp «-18» gir «-18 °C = -0,4 °F», uten aria-invalid; #volum «-1» gir veiledningen og aria-invalid="true"
test('svært små svar blir aldri 0', …)                     // #volum: 0,01 ml til gallons gir «0,000002642 gallon»
test('1000 og over er heltall', …)                         // #volum: 16 gallons til ml gir «60567 ml»
test('bytte beholder mengden og bytter hurtigmengdene', …) // #volum mengde 3, bytt: feltet er fortsatt «3», knappene viser dl-mengdene, aria-pressed følger tallet
test('skjema uten varer settes opp', …)                    // alle fire har svar etter lasting
```

- [ ] **Step 3: Kjør og se dem feile.** Run: `npx playwright test kalk-enhet.spec` Expected: FAIL (skjemaene hoppes over fordi `varer` mangler).

- [ ] **Step 4: Bygg feltene i `site.js`.** `ok` krever ikke lenger `varer`; `regn` velger affin regning når begge enheter står i `data.affin`; `gyldig` er `n !== null && (n >= 0 || data.negativ)`; svaret går gjennom en ny `presis(n, sifre)` når `data.sifre` finnes, ellers `svarTekst` som i dag; bytteknappen hopper over mengdesettingen når `data.beholdMengde`. Entall på svarsiden er fortsatt «svaret vises som 1».

- [ ] **Step 5: Kjør testene.** Run: `npx playwright test kalk-enhet.spec kalk.spec kalk-tabell.spec kalk-tabell-en.spec kalk-tastatur.spec && npm test` Expected: PASS, uten endringer i de gamle spesifikasjonene.

- [ ] **Step 6: Bevis rød.** Fjern affin-grenen midlertidig, se temperaturtesten feile, gjenopprett.

- [ ] **Step 7: Oppdater designspec 16.8** med de fem feltene (ordlyden fra Interfaces) og `kalk-enhet.spec.mjs` i «Låst av». Commit: `Kalkulatorkortet: lengde, temperatur, fire sifre og bytte som beholder mengden`.

---

### Task 2: Delt kortkode, tallregel, hurtigmengder og adresselås

**Files:**
- Create: `scripts/kalk-kort.mjs`, `test/kalk-kort.test.mjs`, `test/fasit/omregner-adresser.json`, `test/omregner-adresser.test.mjs`
- Modify: `scripts/familier/dl-til-gram/felles-mal.mjs` (blir `export * from '../../kalk-kort.mjs'` pluss det som bare familien bruker), `scripts/enheter.mjs`, `test/enheter.test.mjs`, `side.css`

**Interfaces:**
- Produces:
  - `scripts/kalk-kort.mjs`: alt `felles-mal.mjs` eksporterer i dag, pluss `presisTekst(n, sifre = 4, { komma = false } = {}) → string` (regelen fra oppgave 1) og `kalkSkjelett({ …, type = 'volumvekt' })` der `type` blir `data-kalk`, og `vareHtml` kan være tom streng.
  - `scripts/enheter.mjs`:
    - `tall(n) → string` er nå `presisTekst(n, 4)` (punktum; generatorene setter komma selv som før).
    - `HURTIG: { [enhet]: number[6] }` og `HURTIG_BROK: { cups, tbsp, tsp: string[6] }` (bare engelsk).
    - `START: { c: 180, f: 350 }` (alle andre enheter starter på 1).
    - `KORT_ETIKETTER: { [lang]: { aria(F, T), mengde, fra, til, bytt, vanlige, feil } }`.
    - `enhetsKort(lang, fra, til, { ids } = {}) → string`: ferdig `form.kalk` med `data-kalk="enhet"`, enhetene i gruppen til `fra` (eller `ids`), valgtekst «Flertallsnavn (kort)» som i dag, `kort` fra `FLERTALL` som `[entall, flertall]`, `stegFor`, `steg`, `sifre: 4`, `beholdMengde: true`, `negativ` og `affin` bare for temperatur, `brok: true` bare for `en`, og et statisk eksempel regnet med `konverter` og `tall`.

Hurtigmengdene (seks per enhet):

| Enhet | Mengder | Enhet | Mengder |
|---|---|---|---|
| ml | 50, 100, 150, 250, 500, 1000 | oz | 1, 2, 4, 8, 12, 16 |
| cl | 1, 2, 4, 10, 33, 75 | cups | 0,25, 0,5, 1, 2, 3, 4 |
| dl | 0,5, 1, 2, 3, 5, 10 | pints | 0,5, 1, 2, 3, 4, 8 |
| l | 0,5, 1, 1,5, 2, 3, 5 | quarts | 0,5, 1, 2, 3, 4, 6 |
| krm | 1, 2, 3, 4, 5, 10 | gallons | 0,25, 0,5, 1, 2, 3, 5 |
| ts, tsk | 0,5, 1, 2, 3, 4, 5 | g | 50, 100, 150, 250, 500, 1000 |
| ss, msk, spsk | 0,5, 1, 2, 3, 4, 6 | kg | 0,25, 0,5, 1, 1,5, 2, 5 |
| tsp | 0,25, 0,5, 1, 2, 3, 4 | oz-vekt | 1, 2, 4, 8, 12, 16 |
| tbsp | 0,5, 1, 2, 3, 4, 8 | lb | 0,25, 0,5, 1, 2, 3, 5 |
| mm | 1, 2, 5, 10, 20, 30 | c | 100, 150, 180, 200, 220, 250 |
| cm | 5, 10, 18, 20, 24, 30 | f | 300, 325, 350, 375, 400, 450 |
| inches | 1, 6, 8, 9, 10, 12 | | |

`HURTIG_BROK` (engelsk): cups `1/4, 1/3, 1/2, 1, 2, 4`; tbsp `1/2, 1, 2, 3, 4, 8`; tsp `1/4, 1/2, 1, 2, 3, 4`.

- [ ] **Step 1: Lås adressene først, fra uendret kode.** Skriv `test/fasit/omregner-adresser.json`: sortert liste over alle 714 adresser (`/verktoy/…/`, `/sv/verktyg/…/`, `/da/vaerktoejer/…/`, `/en/tools/…/`, de fire samlesidene medregnet), utledet av `allePar(lang)` og `parSti` slik koden står på `origin/main`. Skriv `test/omregner-adresser.test.mjs`:

```js
test('de 714 omregneradressene er uendret', …)   // generatorenes stier (enhetsStierNb, …Sv, …Da, enhetsStier + de fire samlesidene) er nøyaktig fasiten, og lengden er 714
test('hver adresse finnes som fil med seg selv som canonical', …)   // index.html finnes, og <link rel="canonical"> peker på https://matlyst-app.no<adresse>
```

Bevis rød: endre `SLUGDEL.nb.cups` til `'cups'` midlertidig, se testen feile, gjenopprett.

- [ ] **Step 2: Skriv de feilende testene i `test/kalk-kort.test.mjs` og `test/enheter.test.mjs`:**

```js
test('presisTekst: fire gjeldende sifre, heltall fra 1000, aldri 0 for et tall som ikke er 0', () => {
  for (const [n, t] of [[236.5882365, '236.6'], [453.59237, '453.6'], [2.54, '2.54'], [0.2365882365, '0.2366'],
    [0.00422675, '0.004227'], [3785.411784, '3785'], [999.96, '1000'], [60566.6, '60567'], [0, '0'], [-0.4, '-0.4'], [100, '100']]) assert.equal(presisTekst(n), t);
  assert.equal(presisTekst(2.3658823, 4, { komma: true }), '2,366');
});
test('felles-mal eksporterer det samme som før', …)        // navnene esc, tallI, sigTekst, gramTekst, mengdeTekst, PIL, BYTT, kalkSkjelett finnes og er de samme funksjonene
test('HURTIG har seks stigende mengder for hver enhet på hvert språk', …)
test('enhetsKort: data og statisk eksempel henger sammen', …)
  // nb cups→dl: data-kalk="enhet", ingen .kalkvare, kalk-data har sifre 4, beholdMengde true, ingen affin, kort.cups er to former,
  // stegFor dekker hver enhet i fra-listen, statisk svar «2,366» og setning «1 cup = 2,366 dl»
  // nb c→f: affin og negativ finnes, mengde «180», setning «180 °C = 356 °F»
  // en cups→ml: brok true, steg.cups er HURTIG_BROK.cups
test('tall følger presisTekst', …)                          // erstatter «formatering av tall uten unødvendige nuller»
```

- [ ] **Step 3: Kjør og se dem feile.** Run: `npm test` Expected: FAIL på de nye testene.

- [ ] **Step 4: Bygg.** Flytt koden til `scripts/kalk-kort.mjs`, legg til `presisTekst` og `type`, la `felles-mal.mjs` reeksportere. I `enheter.mjs`: `tall`, `HURTIG`, `HURTIG_BROK`, `START`, `KORT_ETIKETTER` og `enhetsKort`. Etikettene: nb «Mengde», «Fra», «Til», «Bytt enheter», «Vanlige mengder», feil «Skriv inn en mengde, for eksempel 2 eller 2,5.»; en «Amount», «From», «To», «Swap units», «Common amounts», «Enter an amount, for example 2 or 1/2.»; sv og da skrives i oppgave 4 (legg inn nb som midlertidig verdi merket `// oppgave 4`, og la testen i oppgave 4 kreve at de er byttet). `aria`: «Kalkulator: {F.fl} til {T.fl}» og tilsvarende.

- [ ] **Step 5: Stil for kort uten varerad.** I `side.css`: kortet skal se riktig ut uten `.kalkvare` (ingen tom luft øverst), og lange valgtekster avkortes med ellipse i stedet for å bryte raden. Legg en påstand i `test/playwright/kalk-enhet.spec.mjs`: på 360 px bredde har siden ingen vannrett rulling, og hver trykkflate i kortet er minst 44 px høy.

- [ ] **Step 6: Kjør alt.** Run: `npm test && npx playwright test kalk` Expected: PASS. Kjør `node scripts/kjedeproeve.mjs alle` og bekreft at sidene under `verktoy/dl-til-gram/` og `en/tools/cups-to-grams/` er uten avvik (omregnerne kan avvike på tall under 0,1; det er ventet og rettes i oppgave 7).

- [ ] **Step 7: Commit.** `Delt kortkode, tallregel med fire sifre, hurtigmengder og lås på de 714 adressene`.

---

### Task 3: Norske omregnere (nb): kortet øverst og «cups»

**Files:**
- Modify: `scripts/nb-enhetssider.mjs`, `scripts/enheter.mjs` (bare `ENHETER.cups.nb` og `FLERTALL.nb.cups`), `scripts/rik-sider.mjs`
- Create: `test/omregner-sider.test.mjs`
- Modify: `test/enheter.test.mjs:40` (kravet «kalkulator» blir `form.kalk` i `topp`)

**Interfaces:**
- Consumes: `enhetsKort`, `tall`, `START` (oppgave 2).
- Produces:
  - `byggLese({ seksjoner }) → string` i `rik-sider.mjs`: `<h2 id="…">` og innhold for hver seksjon, uten svarboks og uten innholdsfortegnelse (samme `slugg` som `byggRik`).
  - `sideForPar(fra, til)` gir i tillegg `topp: enhetsKort('nb', fra, til) + '\n<p class="kortsvar"><b>Kort svar:</b> …</p>'`, der teksten er dagens `svar` («1 cup = 2,366 dl. Skal du regne om cups til desiliter, gang med 2,366.»). `rik` er `byggLese` av dagens seksjoner uten den første («Kalkulator: …»).
  - `ENHETER.cups.nb = { en: 'cup', fl: 'cups', kort: 'cups' }`, `FLERTALL.nb.cups = ['cup', 'cups']`.
  - `export const KOPP_BIORD` i `nb-enhetssider.mjs`: de nøyaktige setningene der «kopp» får stå (forklaringssetningen i `DEF.cups` og spørsmålet med svar på sidene `cups>dl` og `dl>cups`).
  - Samlesiden `verktoy/enhetsomregner/`: `topp: enhetsKort('nb', 'cups', 'ml', { ids: gruppeIds('volum') })`, og setningen «Kalkulatoren her regner om volum. For vekt, lengde og temperatur bruker du listene under.» som første avsnitt i lesedelen.

- [ ] **Step 1: Skriv de feilende testene i `test/omregner-sider.test.mjs`** (tabelldrevet per språk; denne oppgaven slår på `nb`, oppgave 4 og 5 legger til resten). Synlig tekst er HTML uten tagger, `<script>` og attributter. Forventningene utledes av kilden, ikke kopieres:

```js
test('nb: hver parside har kortet i topp og ingen gammel omregner', …)
  // topp inneholder nøyaktig ett form.kalk med data-kalk="enhet" og ett p.kortsvar; rik og topp har ingen form.omregner, .answer eller .toc
test('nb: kortets statiske eksempel er det generatoren regner ut', …)
  // for hvert par: setningen i topp er `${start} ${ordFor} = ${tall(konverter(start, fra, til))} ${ordFor}` med komma, start fra START eller 1
test('nb: lesedelen begynner med tabellen og har de åtte seksjonene i dagens rekkefølge', …)
test('nb: «cups» er hovedordet på sidene med cups', …)
  // title, h1 og description inneholder «cups»; «kopp» står ikke i title, h1, description eller kortet
test('nb: «kopp» står bare i setningene i KOPP_BIORD', …)
  // fjern hver KOPP_BIORD-setning fra den synlige teksten på alle 203 sider; etterpå finnes ikke /kopp/iu. Krev først at minst én side inneholder hver setning.
test('nb: titler er høyst 60 tegn og beskrivelser 100 til 160', …)
test('nb: ingen tankestrek i synlig tekst', …)
```

- [ ] **Step 2: Kjør og se dem feile.** Run: `node --test test/omregner-sider.test.mjs` Expected: FAIL.

- [ ] **Step 3: Bygg.** `byggLese`; `topp` og ny `rik` i `sideForPar` og på samlesiden; `skjema()` slettes. Bytt navnene for `cups`, og gå gjennom hver forekomst av «kopp» i `nb-enhetssider.mjs` (27 treff: `BRUK`, `DEF`, `NOTE`, `FEIL`, `MAALETIPS`, `MENTAL`, `UTVID`, `MATLYST`, samlesiden og spørsmålene): skriv «cups» der det er enheten, og la «kaffekopp» bli «kaffekrus» eller omskrives der ordet handler om koppen i skapet. Ordlyden skrives etter `matlyst-sprak`. Stegteksten («Kontroller at Fra er …») beholdes.

- [ ] **Step 4: Kjør testene.** Run: `npm test` Expected: PASS. `test/omregner-flertall.test.mjs` kan feile her; den slettes i oppgave 6, så merk den midlertidig med `test.skip` og en kommentar som viser til oppgave 6.

- [ ] **Step 5: Bevis rød.** Sett «kopp» tilbake i én `NOTE`-setning, se biord-testen feile, gjenopprett.

- [ ] **Step 6: Commit.** `Norske omregnere: kalkulatorkortet øverst, kort svar og cups i teksten`.

---

### Task 4: Svenske og danske omregnere

**Files:**
- Modify: `scripts/sv-enhetssider.mjs`, `scripts/da-enhetssider.mjs`, `scripts/sv-rike-sider.mjs` (4 treff på «kopp»), `scripts/enheter.mjs` (`ENHETER.cups.sv`, `.da`, `FLERTALL.sv.cups`, `.da.cups`, `KORT_ETIKETTER.sv`, `.da`), `test/omregner-sider.test.mjs`

**Interfaces:**
- Consumes: `enhetsKort`, `byggLese`.
- Produces: samme form som oppgave 3 for `sideForPar`, samlesidene (`sv/verktyg/enhetsomvandlare/`, `da/vaerktoejer/enhedsomregner/`) og `KOPP_BIORD` per fil. `ENHETER.cups.sv = { en: 'cup', fl: 'cups', kort: 'cup' }`, `ENHETER.cups.da = { en: 'cup', fl: 'cups', kort: 'cup' }`, `FLERTALL.sv.cups = FLERTALL.da.cups = ['cup', 'cups']`.

- [ ] **Step 1: Slå på `sv` og `da` i `test/omregner-sider.test.mjs`** (samme sju tester; hovedordet er «cup» i tittel og H1, og biordet er /kopp/iu på svensk og /\bkop(pe[rn]?)?\b/iu på dansk), pluss:

```js
test('sv og da: kortets etiketter er på språket', …)   // KORT_ETIKETTER.sv og .da er ikke like nb, og kalk-data.feil bruker språkets eksempel
```

- [ ] **Step 2: Kjør og se dem feile.** Run: `node --test test/omregner-sider.test.mjs` Expected: FAIL for sv og da.

- [ ] **Step 3: Skriv teksten etter `matlyst-sprak`** (Translator, Term Researcher, Reviewer, Revision). Etikettene i kortet, kort svar, forklaringssetningen og spørsmålet med «kopp», og hver forekomst av «kopp» og «kop» i de to filene. Svensk feilmelding og dansk feilmelding bruker komma i eksempelet («2 eller 2,5»).

- [ ] **Step 4: Bygg** `topp` og ny `rik` i begge filer, og slett `skjema()`.

- [ ] **Step 5: Kjør testene.** Run: `npm test` Expected: PASS.

- [ ] **Step 6: Commit.** `Svenske og danske omregnere: kalkulatorkortet øverst og cup i teksten`.

---

### Task 5: Engelske omregnere

**Files:**
- Modify: `scripts/en-enhetssider.mjs`, `scripts/en-rike-sider.mjs` (samlesiden `tools/unit-converter/`, `enhetsHub`), `test/omregner-sider.test.mjs`

**Interfaces:**
- Consumes: `enhetsKort('en', …)` (med `brok` og `HURTIG_BROK`), `byggLese`.
- Produces: `topp` med kort og `<p class="kortsvar"><b>Short answer:</b> …</p>` (dagens `svar`), `rik` uten seksjonen «… calculator». Teksten ellers er uendret; engelsk bruker «cups» fra før.

- [ ] **Step 1: Slå på `en` i `test/omregner-sider.test.mjs`** (testene for kort i topp, statisk eksempel med punktum, seksjonsrekkefølge, titler og tankestrek), pluss:

```js
test('en: kortet tar brøker og har brøker som hurtigmengder for cups, tbsp og tsp', …)
```

- [ ] **Step 2: Kjør og se dem feile.** Run: `node --test test/omregner-sider.test.mjs` Expected: FAIL for en.

- [ ] **Step 3: Bygg** i begge filer, og slett `skjema()` i `en-enhetssider.mjs`.

- [ ] **Step 4: Kjør testene.** Run: `npm test` Expected: PASS. Legg en brøktest til `kalk-enhet.spec.mjs` med et engelsk skjema i fiksturen (`<div lang>` holder ikke, kortet leser `document.documentElement.lang`): lag `test/playwright/fiksturer/kalk-enhet-en.html` med cups til ml, og test at «1 1/2» gir «1 1/2 cups = 354.9 ml» og at enheten kan byttes uten at brøken forsvinner.

- [ ] **Step 5: Commit.** `Engelske omregnere: kalkulatorkortet øverst med brøker`.

---

### Task 6: Fjern den gamle omregneren

**Files:**
- Modify: `site.js` (løkka `for (const skjema of document.querySelectorAll('form.omregner'))` ut; `tolkTall`, `visTall` og `window.MatlystTall` står), `side.css` (reglene for `form.omregner`, `.omregner-rad`, `.omregner-bytt`, `.omregner-svar` og `body[data-sidetype="omregner"] .toc` ut; `.omregner-liste` står), `scripts/kjede.mjs` (`omregner-flertall` ut av `ETTERBEHANDLING`), `test/kjede-fasit.test.mjs`, `test/side-css.test.mjs`, `test/site-tall.test.mjs` (bare om den viser til omregnerløkka), `scripts/enheter.mjs` (`omregnerData` og `ordFor` ut hvis ingen bruker dem), designspec 16.4
- Delete: `scripts/omregner-flertall.mjs`, `test/omregner-flertall.test.mjs`
- Regenerate: `test/fixtures/skall-paa/omregner-nb.html.fiks` og `omregner-nb-generert.html.fiks` etter oppgave 7 steg 1 (fikstur av en ekte side)

- [ ] **Step 1: Skriv den feilende vakta** i `test/omregner-sider.test.mjs`:

```js
test('ingen kode for den gamle omregneren står igjen', …)
  // uten kommentarer: site.js og side.css inneholder ikke «form.omregner», «omregner-rad», «omregner-svar» eller «omregner-data»;
  // scripts/kjede.mjs nevner ikke omregner-flertall; filen scripts/omregner-flertall.mjs finnes ikke
```

- [ ] **Step 2: Kjør og se den feile.** Run: `node --test test/omregner-sider.test.mjs` Expected: FAIL.

- [ ] **Step 3: Fjern koden og filene,** og rett testene som låste dem (`kjede-fasit` linje 15 og 18, `side-css` linje 86 til 89). Hver endret test skal fortsatt vokte noe: `kjede-fasit` beholder rekkefølgekravene for de andre stegene, og `side-css` krever stil for klassene som nå står på omregnersidene (`kalk`, `kalkrad`, `kalkside`, `kalktall`, `kalkenhet`, `hurtig`, `kalksetning`, `kortsvar`).

- [ ] **Step 4: Skriv om designspec 16.4:** bytteanimasjonen, flertall og tallesing beskrives nå av 16.8; 16.4 sier at enhetsomregnerne bruker kalkulatorkortet med `data-kalk="enhet"`, fire gjeldende sifre, mengden som står ved bytte, og «cups» som hovedord med «kopp» som biord (avgjørelse 1 og 2).

- [ ] **Step 5: Kjør alt.** Run: `npm test && npx playwright test kalk` Expected: PASS.

- [ ] **Step 6: Commit.** `Fjern den gamle omregneren: skript, stil, etterbehandling og tester`.

---

### Task 7: Bygg sidene, gransk og vis Patrick

**Files:**
- Regenerate: alle 714 `index.html` under `verktoy/`, `sv/verktyg/`, `da/vaerktoejer/`, `en/tools/` (bare omregnerne), sidekartene og `scripts/lastmod-kart.json` gjennom byggekjeden
- Create: `test/playwright/kalk-tabell-enhet.spec.mjs`
- Modify: `test/fasit/kjede-kjente-avvik.json` bare hvis et avvik er ventet og forklart

- [ ] **Step 1: Kjør byggekjeden** slik `scripts/kjede.mjs` beskriver, og deretter `node scripts/kjedeproeve.mjs alle`. Expected: 0 avvik. Bekreft med `git status --short | grep -v -E '^( M|\?\?) (verktoy|sv/verktyg|da/vaerktoejer|en/tools)/'` at ingen sider utenfor omregnerne er endret, bortsett fra sidekart, lastmod og `llms.txt`, og at `git diff --stat -- verktoy/dl-til-gram en/tools/cups-to-grams` er tom.

- [ ] **Step 2: Skriv `kalk-tabell-enhet.spec.mjs`** mot de bygde sidene (lokal tjener, `test/playwright/hjelp/tjener.py`): for ett par per gruppe og språk (16 sider, blant dem `/verktoy/kopp-til-dl/`, `/verktoy/celsius-til-fahrenheit/`, `/sv/verktyg/kopp-till-dl/`, `/da/vaerktoejer/kop-til-dl/`, `/en/tools/cups-to-ml/`) skrives hver mengde i tabellens venstre kolonne inn i kortet, og kortets svar skal være likt tallet i høyre kolonne. Uten JavaScript (`javaScriptEnabled: false`) skal svarsetningen stå ferdig utregnet. Bevis rød ved å endre ett tall i en bygd side midlertidig.

- [ ] **Step 3: Full kontroll.** Run: `npm test && npx playwright test && REVISJON=alle npx playwright test revisjon.spec` Expected: 0 røde (revisjonen dekker 360 px, 200 og 400 % zoom, uten JavaScript og forstørret tekst). Lighthouse på mobil for `/verktoy/kopp-til-dl/` og `/en/tools/cups-to-ml/`: tilgjengelighet og SEO 100, ytelse ikke under dagens.

- [ ] **Step 4: Gransking.** Codex (`codex exec -m gpt-6-astra`) gransker tallene og `site.js` parallelt; Opus gransker språket på nb, sv, da og en etter `matlyst-sprak`; Fable ser skjermbildene (360, 768 og 1280 px, alle fire grupper og en samleside per språk). Funn rettes i egne commits med test.

- [ ] **Step 5: Push og utkast.** Push grenen og åpne PR som **utkast** med teksten «Merges ikke før etter indeksmålingen 04.12». CI skal være grønn.

- [ ] **Step 6: Forhåndsvisning til Patrick.** Lokal tjener `python3 test/playwright/hjelp/tjener.py 4273`, skjermbilder samlet på én side, og valgkort for avgjørelse 1 til 6. Ingen merge.

---

### Task 8: Publisering (tidligst etter 04.12, etter Patricks ja)

- [ ] **Step 1: Porten.** Indeksmålingen 04.12 for de 30 norske og 43 engelske familiesidene er lest og ført i minnet, og Patrick har sagt ja til forhåndsvisningen.
- [ ] **Step 2: Rebase på `origin/main` og kjør byggekjeden på nytt,** så `lastmod` får publiseringsdagen og ikke byggedagen. `node scripts/kjedeproeve.mjs alle` gir 0 avvik, og hele testpakka er grønn.
- [ ] **Step 3: Merge (squash) når CI er grønn.**
- [ ] **Step 4: Kontroll på nettstedet:** fire sider per språk gir 200 med uendret canonical, kortet regner riktig på mobil og PC, ren konsoll, og `curl -s https://matlyst-app.no/sitemap.xml | grep -c verktoy/` er uendret fra før.
- [ ] **Step 5: IndexNow.** Arbeidsflyten sender høyst 500 adresser per kjøring, og 714 er endret. Bekreft status 200, og send resten med en manuell kjøring av `scripts/indexnow.mjs`.
- [ ] **Step 6: Mål** visninger og plass for «cups til dl», «cup till dl», «cup til dl» og «hvor mange dl er en kopp» i søkeordloggen etter én og to uker, og rydd arbeidstreet.

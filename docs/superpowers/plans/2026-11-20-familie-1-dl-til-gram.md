# Familie 1, dl til gram (nb): utforming og byggeplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Mål:** En samleside og rundt 25 varesider på norsk som svarer på «1 dl hvetemel i gram» med kalkulator øverst, tabell og kilde på hvert tall.

**Arkitektur:** Første oppføring i familieregisteret fra grunnmuren. Tallene hentes fra Matvaretabellens åpne API med et skript, og kontrolleres mot kilden av et annet. Sidene får en ny kalkulatorblokk (`form.kalk`) som deler tallesing med dagens omregner. Malen skriver bare tall som kan regnes ut fra datafila.

**Teknologi:** Node 22, `node --test`, Playwright. Ingen nye avhengigheter.

**Spec:** Denne fila (avsnittet «Utforming» under) og prototypen https://claude.ai/artifact/NZuFPp4etbankbKvWVZN28, kildefil i `~/matlyst-privat/seo-matlyst/2026-11-19-sokeord/familie1-dl-til-gram/dl-til-gram.html`. Patrick så prototypen 20.11.2026: «Det er veldig bra». Overordnet plan: `~/matlyst-privat/seo-matlyst/2026-11-19-sokeord/PLAN-bred-synlighet.md`.

**Forutsetter:** `2026-11-20-grunnmur-for-sidefamilier.md` er bygget og slått sammen (PR A, B og C).

## Utforming

### Adresser og omfang
- Samleside: `/verktoy/dl-til-gram/`. Vareside: `/verktoy/dl-til-gram/<vare>/`, for eksempel `/verktoy/dl-til-gram/hvetemel/`.
- Én side per vare. Siden dekker dl, ss og ts, og begge retninger (gram til dl), så det lages ingen egne sider per enhet.
- Bare norsk i denne planen. Engelsk (cups to grams, USDA som hovedkilde) får egen plan når den norske er ute og målt.
- De 714 omregnerne som finnes røres ikke. Kalkulatoren øverst og «cups» på dem er en egen runde etterpå, med adressene uendret.

### Kilder
| Bruk | Kilde | Vilkår |
|---|---|---|
| Vekt per dl (tallet siden bruker) | Matvaretabellen 2026, Mattilsynet. `https://www.matvaretabellen.no/api/nb/foods.json`, feltet `portions` med `portionUnit: "dl"` | CC BY 4.0. Kildelinje: «Matvaretabellen 2026. Mattilsynet. www.matvaretabellen.no» |
| Toppet spiseskje og teskje (ligger i datafila, vises ikke) | «Mål, vekt og porsjonsstørrelser for matvarer» (2015), Mattilsynet, Universitetet i Oslo og Helsedirektoratet, IS-2286 | Ingen lisens oppgitt. Enkelttall gjengis med kilde |
| Sammenligning der kildene spriker | USDA FoodData Central, SR Legacy (2019) | Offentlig eie (CC0) |

- Der kildene spriker, bruker siden Matvaretabellens tall, viser de andre side om side og sier hvilket som brukes.
- Spiseskje og teskje regnes ut fra dl-tallet som strøkne mål (15 ml og 5 ml) og merkes som utregnet. Rapporten fra 2015 målte toppede skjeer; de tallene ligger i datafila, men vises ikke.
- Ingen måleråd eller påstander som ikke står i en kilde. Teksten sier hva tallet er, hvor det kommer fra og hvordan det er regnet.
- Toppet spiseskje og teskje fra rapporten vises ikke: tallene lar seg ikke skille fra strøkne mål (Patrick 20.11.2026: ingen e-post til kilden).

### Varesiden, ovenfra og ned
1. Brødsmulesti: Verktøy › Dl til gram.
2. H1 «Hvetemel: dl til gram». Ingress med svaret: «1 dl hvetemel veier 55 g. Skriv inn mengden, så ser du vekten med en gang.»
3. Kalkulatoren. Varen står fast øverst i kortet med lenka «Bytt vare» til samlesiden. Felt: mengde, fra-enhet og til-enhet (dl, ss, ts, ml, liter, cups, gram, kilo), bytteknapp, seks hurtigknapper som følger fra-enheten, og en svarsetning («2 dl hvetemel = 110 g»).
4. Kort svar med dl, ss og ts, og kildelinje rett under.
5. To kort: tabell fra dl til gram (1 ts, 1 ss, 0,5 dl, 1, 2, 3, 4, 5 dl, 1 liter) og «Fra gram til dl» med formel og fire eksempler (100 g, 250 g, 500 g, 1 kg).
6. Appkortet «Slutt å regne om for hånd» (som på omregnersidene).
7. «Hvorfor kildene ikke er helt enige»: tabell med kildene side om side, valgt kilde uthevet. Vises bare når raden har tall fra mer enn én kilde eller en nær variant i samme kilde.
8. «Strøken eller toppet skje»: tas ikke med (se Kilder).
9. Spørsmål og svar: tre til fire, alle med tall fra datafila.
10. Kilder: nummerert liste med utgiver, år, lenke og hentedato.
11. Andre varer: åtte lenker pluss «Alle varer».

### Samlesiden
Som varesiden, men: H1 «Dl til gram», kalkulatoren har varevalg (standard hvetemel), og under kort svar står tabellen «Hva veier 1 dl?» med alle varer (1 dl, 1 ss, 1 ts) der hvert varenavn lenker til varesiden. Deretter appkort, «Hvorfor veier ikke 1 dl det samme?», «Slik har vi regnet», spørsmål og svar, kilder, beslektede omregninger.

### Titler
- Vareside: tittel «1 dl <vare> i gram: regn om dl, ss og ts» (høyst 60 tegn, ellers «1 dl <vare> i gram: dl, ss og ts»). Beskrivelse 100 til 160 tegn med tallet i.
- Samleside: tittel «Dl til gram: kalkulator og tabell for 25 varer» (tallet følger antall publiserte varer). 

### Tallregler
- Vekt per dl: heltallet fra kilden, uendret.
- Utregnede verdier i tekst og tabeller: `Math.round`, minst 1. Gram til dl: én desimal.
- Kalkulatoren: 100 og over som heltall, 10 til 100 med tre gjeldende sifre, under 10 med to. Desimalkomma, ingen tusenskille.

## Felles krav

- Ett tall på siden uten grunnlag i datafila gir rød test (`tillatteTall`).
- All tekst på norsk bokmål, uten tankestrek som skilletegn, i samme tone som dagens omregnersider. Tekst som går til Patrick skrives med skillen `matlyst-sprak` og granskes av Opus.
- Designspecen gjelder: verdier fra `tokens.css`, tekst i rem, trykkflater minst 44 px, WCAG AA. Ingen nye farger.
- Ingenting publiseres før Patrick har sett forhåndsvisningen (oppgave 7).
- Bygging: Sonnet. Gransking: Codex parallelt, Opus på tekst og helhet.

## Det granskeren skal se etter

1. **Inntasting som ikke er et tall.** Tomt felt, «abc», «1,5,2» og negativt tall skal gi svarsetningen «Skriv inn en mengde, for eksempel 2 eller 2,5.», aldri «NaN» eller «0 g». «1 000» (mellomrom eller hardt mellomrom som tusenskille) og «1.000» er 1000, som i omregneren. Test i oppgave 3.
2. **Samme enhet begge veier, og vekt til vekt.** Dl til dl og gram til kilo skal regne riktig uten varens vekt. Bytteknappen to ganger skal gi utgangspunktet. Test i oppgave 3.
3. **Uten JavaScript.** Siden skal gi svaret likevel: ingress, kort svar og tabeller står i HTML-en, og kalkulatoren viser et ferdig utregnet eksempel. Test i oppgave 5.
4. **Vare som mangler noe.** En vare uten sammenligningskilde eller uten skjetall i rapporten skal gi en side uten de avsnittene, ikke tomme overskrifter eller «undefined». Test i oppgave 5.
5. **Kilden endrer et tall.** Når Matvaretabellen oppdateres og et tall avviker fra datafila, skal kontrollskriptet si hvilken vare og hvilke to tall, og ikke skrive over noe. Test i oppgave 1.

---

### Oppgave 1: Data fra kilden, og kontroll mot kilden

**Filer:**
- Lag: `scripts/familier/dl-til-gram/hent.mjs`, `scripts/familier/dl-til-gram/kontroller.mjs`, `scripts/familier/dl-til-gram/varer.mjs`
- Lag: `scripts/familier/dl-til-gram/data.nb.json`
- Lag: `test/dl-til-gram-data.test.mjs`, `test/fiksturer/dl-til-gram/foods-utdrag.json`

**Grensesnitt:**
- Bruker: `validerData`, `lesData`, `publiserbare` fra `scripts/familier/felles.mjs`.
- `varer.mjs`: `export const VARER`, lista over hvilke varer familien skal ha: `{ id, slug, navn, ord, matvaretabell: string, rapport?: string, usda?: { fdcId: number, navn: string, gPerCup: number } }`. `navn` er overskriftsformen («Hvetemel»), `ord` er formen midt i en setning («hvetemel»), `matvaretabell` er matvarens navn i API-et, ordrett.
- `hent.mjs`: `radFraKilde(vare, foods) → Rad | null` (ren funksjon, `null` når varen ikke har dl-porsjon i API-et) og kommandolinje som henter API-et og skriver `data.nb.json` med status `utkast`. Tall per rad: `dl` (g, kilde `matvaretabellen`), og når de finnes `ss_toppet`, `ts_toppet` (kilde `rapport-2015`) og `dl_usda` (g per dl, `gPerCup / 2.365882`, avrundet til heltall, kilde `usda`).
- `kontroller.mjs`: `avvik(data, foods) → { id, felt, iFila, iKilden }[]` og kommandolinje. Uten avvik setter den `status: 'kontrollert'` og `kontrollert: <dagens dato>` på radene og oppdaterer `hentet` på kilden. Med avvik skriver den lista, endrer ingenting og avslutter med kode 1.
- Kandidater (30): hvetemel, sammalt hvetemel, rugmel, havregryn, sukker, brunt sukker, melis, potetmel, maisstivelse, kakao, kokosmasse, mandelmel, smør, margarin, olje, melk, fløte, rømme, honning, sirup, salt, ris (jasminris), grøtris, linser (røde), rosiner, mandler, chiafrø, sesamfrø, bulgur, couscous. En vare uten dl-porsjon i API-et blir ikke en side; den gjettes aldri.
- Rapporttallene og USDA-tallene ligger lest ut i `~/matlyst-privat/seo-matlyst/2026-11-19-sokeord/familie1-dl-til-gram/kilder/` (rapporten som tekst, API-svaret fra 20.11). USDA-verdiene leses fra SR Legacy-nedlastingen (`https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_sr_legacy_food_json_2018-04.zip`), aldri fra hukommelsen. Hvert rapporttall kontrolleres mot teksten av to uavhengige lesere (bygger og gransker) før raden får status `kontrollert`.

- [ ] **Steg 1: Skriv de røde testene** mot et utdrag av API-svaret i `test/fiksturer/dl-til-gram/foods-utdrag.json` (fem ekte matvarer, én uten dl-porsjon):

```js
test('en vare med dl-porsjon blir en rad med kilde', () => {
  const rad = radFraKilde(VARER.find((v) => v.id === 'hvetemel'), foods);
  assert.deepEqual(rad.tall.dl, { verdi: 55, enhet: 'g', kilde: 'matvaretabellen' });
  assert.equal(rad.status, 'utkast');
});
test('en vare uten dl-porsjon blir ingen rad', () => {
  assert.equal(radFraKilde({ id: 'x', slug: 'x', navn: 'X', ord: 'x', matvaretabell: 'Finnes ikke' }, foods), null);
});
test('avvik mot kilden navngir vare og begge tall', () => {
  const data = structuredClone(lesData(MAPPE, 'nb'));
  data.rader.find((r) => r.id === 'hvetemel').tall.dl.verdi = 56;
  assert.deepEqual(avvik(data, foods), [{ id: 'hvetemel', felt: 'dl', iFila: 56, iKilden: 55 }]);
});
test('datafila er gyldig, og alt som er kontrollert stemmer med utdraget', () => {
  const data = lesData(MAPPE, 'nb');
  assert.ok(publiserbare(data).length >= 20);
  assert.deepEqual(avvik(data, foods).filter((a) => foods.some((f) => f.foodName === a.navn)), []);
});
```

- [ ] **Steg 2: Kjør** `node --test test/dl-til-gram-data.test.mjs`. Forventet: rødt.
- [ ] **Steg 3: Bygg `varer.mjs`, `hent.mjs` og `kontroller.mjs`.** Kjør `node scripts/familier/dl-til-gram/hent.mjs`, så `kontroller.mjs`.
- [ ] **Steg 4: Kjør** testen. Forventet: grønt. Skriv i commit-meldingen hvor mange av de 30 som ble rader, og hvilke som falt bort.
- [ ] **Steg 5: Commit** `dl til gram: tall fra Matvaretabellen, kontrollert mot kilden`.

### Oppgave 2: Delt tallesing i `site.js`

**Filer:**
- Endre: `site.js:143-246`
- Lag: `test/site-tall.test.mjs`

**Grensesnitt:**
- Lager, på modulnivå i `site.js` (inne i samme IIFE, men utenfor løkka over `form.omregner`): `tolkTall(tekst, komma: boolean) → number | null` og `visTall(n, komma: boolean, sifre = 4) → string`. Dagens `tolk` og `tall` i omregneren kaller disse. Oppførselen i omregneren er uendret (designspec §16.4 er låst av tester).
- For testing: `site.js` legger de to funksjonene på `window.MatlystTall`.

- [ ] **Steg 1: Skriv testene** (kjører `site.js` i `node:vm` med et minimalt `document`): `tolkTall('2,5', true) === 2.5`, `tolkTall('1.000', true) === 1000`, `tolkTall('1,000', false) === 1000`, `tolkTall('1,5,2', true) === null`, `tolkTall('abc', true) === null`, `tolkTall('', true) === null`, `visTall(0.42268, true) === '0,4227'`, `visTall(1234.5, true) === '1235'`.
- [ ] **Steg 2: Kjør** `node --test test/site-tall.test.mjs`. Forventet: rødt.
- [ ] **Steg 3: Trekk ut funksjonene.** Ingen annen endring.
- [ ] **Steg 4: Kjør** `npm test` og `npx playwright test undersider`. Forventet: grønt.
- [ ] **Steg 5: Commit** `site.js: tallesing og tallformat som delte funksjoner`.

### Oppgave 3: Kalkulatorblokken `form.kalk`

**Filer:**
- Endre: `site.js`, `side.css`
- Endre: `docs/superpowers/specs/2026-11-18-nettside-designsystem-design.md` (nytt punkt under §16: «Kalkulatorkortet»)
- Lag: `test/playwright/kalk.spec.mjs`, `test/playwright/fiksturer/kalk.html`

**Grensesnitt:**
- Bruker: `tolkTall`, `visTall` fra oppgave 2.
- HTML-kontrakten (malen i oppgave 5 skriver den, `site.js` leser den):

```html
<form class="kalk" data-kalk="volumvekt" onsubmit="return false" aria-label="…">
  <div class="kalkvare">…fast vare med lenke, eller <select data-felt="vare">…</div>
  <div class="kalkrad">
    <div class="kalkside"><label class="kalktall"><span class="skjult">Mengde</span><input data-felt="mengde" type="text" inputmode="decimal" autocomplete="off" value="2"></label>
      <label class="kalkenhet"><span class="skjult">Fra</span><select data-felt="fra">…</select></label></div>
    <button type="button" class="bytt" data-felt="bytt" aria-label="Bytt retning">…</button>
    <div class="kalkside til"><output class="kalktall" data-felt="svar">110</output>
      <label class="kalkenhet"><span class="skjult">Til</span><select data-felt="til">…</select></label></div>
  </div>
  <div class="hurtig" role="group" aria-label="Vanlige mengder"><button type="button" data-v="0,5">0,5 dl</button>…(seks)</div>
  <p class="kalksetning" data-felt="setning" role="status" aria-live="polite">2 dl hvetemel = 110 g</p>
  <script type="application/json" class="kalk-data">{"varer":[["hvetemel",55]],"ml":{"dl":100,"ss":15,"ts":5,"ml":1,"l":1000,"cups":236.5882365},"g":{"g":1,"kg":1000},"kort":{"dl":"dl","cups":"cups"},"steg":{"volum":["0,5","1","2","3","5","10"],"ml":["25","50","100","250","500","1000"],"g":["50","100","150","250","500","1000"],"kg":["0,25","0,5","1","1,5","2","5"]},"feil":"Skriv inn en mengde, for eksempel 2 eller 2,5."}</script>
</form>
```

  `varer` er `[ord, gramPerDl][]`; med `select[data-felt="vare"]` er valgets `value` indeksen, uten er det første vare. All tekst kommer fra `kalk-data`, så `site.js` har ingen språkstrenger.
- Regning: alt går via gram. Volum til gram er `ml[enhet] / 100 * gramPerDl`; vekt er `g[enhet]`.
- Bytteknappen bytter fra og til, og setter mengden til 100 når fra blir gram, 1 når fra blir kilo, ellers 2.
- Utseende: klassene `.kalk`, `.kalkvare`, `.kalkrad`, `.kalkside`, `.kalktall`, `.kalkenhet`, `.bytt`, `.hurtig`, `.kalksetning` hentes fra prototypens stilark og skrives i `side.css` med verdier fra `tokens.css` og størrelser i rem. Kortet står rett under ingressen, midtstilt, høyst 920 px bredt. På mobil stables de to sidene, og hurtigknappene ruller sidelengs i sin egen rad.

- [ ] **Steg 1: Skriv de røde Playwright-testene** mot fiksturen (en side med to skjemaer: fast vare, og varevalg med hvetemel 55 og sukker 90):

```js
test('regner mens du skriver', async ({ page }) => {
  await page.fill('#fast [data-felt=mengde]', '3');
  await expect(page.locator('#fast [data-felt=setning]')).toHaveText('3 dl hvetemel = 165 g');
});
test('varevalg bytter vekten', async ({ page }) => {
  await page.selectOption('#valg [data-felt=vare]', '1');
  await page.fill('#valg [data-felt=mengde]', '2,5');
  await expect(page.locator('#valg [data-felt=setning]')).toHaveText('2,5 dl sukker = 225 g');
});
test('bytt retning, og tilbake igjen', async ({ page }) => {
  await page.click('#fast [data-felt=bytt]');
  await expect(page.locator('#fast [data-felt=setning]')).toHaveText('100 g hvetemel = 1,8 dl');
  await page.click('#fast [data-felt=bytt]');
  await expect(page.locator('#fast [data-felt=setning]')).toHaveText('2 dl hvetemel = 110 g');
});
test('samme enhet og vekt til vekt trenger ikke varens vekt', async ({ page }) => {
  await page.selectOption('#fast [data-felt=til]', 'dl');
  await expect(page.locator('#fast [data-felt=svar]')).toHaveText('2');
  await page.selectOption('#fast [data-felt=fra]', 'g'); await page.selectOption('#fast [data-felt=til]', 'kg');
  await page.fill('#fast [data-felt=mengde]', '500');
  await expect(page.locator('#fast [data-felt=svar]')).toHaveText('0,5');
});
for (const tekst of ['', 'abc', '1,5,2', '-2']) {
  test(`ugyldig inntasting «${tekst}» gir veiledning, ikke et tall`, async ({ page }) => {
    await page.fill('#fast [data-felt=mengde]', tekst);
    await expect(page.locator('#fast [data-felt=setning]')).toHaveText('Skriv inn en mengde, for eksempel 2 eller 2,5.');
    await expect(page.locator('#fast [data-felt=mengde]')).toHaveAttribute('aria-invalid', 'true');
  });
}
test('hurtigknappene følger fra-enheten og viser valgt mengde', async ({ page }) => {
  await page.click('#fast .hurtig button:nth-child(4)');
  await expect(page.locator('#fast [data-felt=svar]')).toHaveText('165');
  await expect(page.locator('#fast .hurtig button:nth-child(4)')).toHaveAttribute('aria-pressed', 'true');
  await page.selectOption('#fast [data-felt=fra]', 'g');
  await expect(page.locator('#fast .hurtig button').first()).toHaveText('50 g');
});
test('alt i kortet er minst 44 px høyt å trykke på, og ingenting ruller sidelengs på 360 px', async ({ page }) => { /* mål hver knapp, select og lenke; scrollWidth <= innerWidth */ });
```

- [ ] **Steg 2: Kjør** `npx playwright test kalk`. Forventet: rødt.
- [ ] **Steg 3: Bygg blokken i `site.js` og stilen i `side.css`.** `test/side-css.test.mjs` krever en regel for hver klasse.
- [ ] **Steg 4: Kjør** `npm test` og `npx playwright test kalk`. Forventet: grønt.
- [ ] **Steg 5: Skriv punktet i designspecen** (hva kortet er, feltene, reglene over, at det står under ingressen). Maks tolv linjer.
- [ ] **Steg 6: Commit** `kalkulatorkortet: form.kalk med varevalg, bytte og hurtigknapper`.

### Oppgave 4: Plass til kalkulatoren øverst på siden

**Filer:**
- Endre: `scripts/generer-norske-importguider.mjs` (`side(v)`, ca. linje 91)
- Lag: `test/side-topp.test.mjs`

**Grensesnitt:**
- Sideobjektet får det valgfrie feltet `topp: string` (HTML). `side(v)` skriver det inne i `<header class="locale-page-hero">`, rett etter ingressen og eventuell forfatterlinje. Sider uten `topp` er bytelike med i dag.
- En side med `topp` får ingen innholdsfortegnelse og ingen svarboks fra `byggRik`; malen bygger `rik` selv.

- [ ] **Steg 1: Skriv den røde testen:** en side med `topp: '<form class="kalk"></form>'` gir HTML der skjemaet står mellom `class="lead"` og `<section class="prose`; en side uten `topp` gir nøyaktig samme HTML som før (sammenlign mot `verktoy/dl-til-kopp/index.html` via `kjede-fasit`).
- [ ] **Steg 2: Kjør** `node --test test/side-topp.test.mjs`. Forventet: rødt.
- [ ] **Steg 3: Legg til feltet.**
- [ ] **Steg 4: Kjør** `npm test`. Forventet: grønt, `kjede-fasit` uten avvik.
- [ ] **Steg 5: Commit** `generator: valgfritt toppfelt under ingressen`.

### Oppgave 5: Malen og tekstene

**Filer:**
- Lag: `scripts/familier/dl-til-gram/mal-nb.mjs`, `scripts/familier/dl-til-gram/tekst-nb.mjs`
- Endre: `side.css` (klassene `.kortsvar`, `.kilde`, `.sprik`, `.kilder`, `.varer`, `.varerull`, `.oto`, `.okort`, `.otabell`, `.formel`, `.eksempler` hentes fra prototypen der de ikke finnes)
- Lag: `test/dl-til-gram-mal.test.mjs`

**Grensesnitt:**
- Bruker: malkontrakten fra grunnmuren (`navSide`, `sideForRad`, `tillatteTall`), `webApplikasjon`, `artikkel`, `brodsmuler`, `elementliste` fra `scripts/familier/skjema.mjs`, `kilderFor` fra `felles.mjs`, feltet `topp` fra oppgave 4, HTML-kontrakten fra oppgave 3.
- `mal-nb.mjs` eksporterer også `utregnet(rad) → { dl, ss, ts, tabell: [etikett, gram][], tilbake: [gram, dl][] }` (alle avrundinger ett sted) og `kalkHtml({ rader, fast?: rad })`.
- `tekst-nb.mjs`: `export const TEKST: { [radId]: { variant?: string, sprik?: string, ekstraSpm?: [sporsmal, svar][] } }`. Det er den håndskrevne delen per vare: én setning om hvilken variant tallet gjelder («siktet hvetemel»), og én til to setninger til avsnittet om kildene når de spriker. Hver setning skal kunne belegges med et tall i datafila eller en betegnelse i kilden.
- Strukturerte data: varesiden får brødsmuler, `WebApplication` og `Article` med kildene som `citation`. Samlesiden får i tillegg `ItemList` over varesidene. Ingen `HowTo`, ingen `FAQPage`.
- Rekkefølge, titler og tallregler: som i «Utforming».
- `tillatteTall` må dekke alt vakten leser etter retterunden i grunnmuren: tittel, beskrivelse, H1, toppfeltet, attributter som `value` og `data-v`, og tallene i `kalk-data` (også enhetsfaktorene). Tusenskille skrives med hardt mellomrom og regnes som ett tall.

- [ ] **Steg 1: Skriv de røde testene:**

```js
test('hvetemel: svaret står i ingress, kort svar, tabell og kalkulator, og er det samme tallet', () => {
  const s = sideForRad(rad('hvetemel'), data, rader);
  assert.match(s.lead, /1 dl hvetemel veier 55 g/u);
  assert.match(s.topp, /2 dl hvetemel = 110 g/u);
  assert.match(s.rik, /<td>1 dl<\/td><td>55 g<\/td>/u);
  assert.equal(s.title.length <= 60, true);
  assert.ok(s.description.length >= 100 && s.description.length <= 160);
});
test('utregningene følger tallreglene', () => {
  assert.deepEqual(utregnet({ tall: { dl: { verdi: 55 } } }).tilbake, [[100, '1,8'], [250, '4,5'], [500, '9,1'], [1000, '18,2']]);
  assert.equal(utregnet({ tall: { dl: { verdi: 55 } } }).ss, 8);
  assert.equal(utregnet({ tall: { dl: { verdi: 35 } } }).ts, 2);
});
test('en vare uten sammenligning og uten skjetall får ingen tomme avsnitt', () => {
  const s = sideForRad(radUtenEkstra, data, rader);
  for (const forbudt of ['Hvorfor kildene', 'toppet', 'undefined', 'NaN', '<h2></h2>']) assert.equal(s.rik.includes(forbudt), false, forbudt);
});
test('siden svarer uten JavaScript', () => {
  const s = sideForRad(rad('hvetemel'), data, rader);
  assert.match(s.topp, /<output[^>]*>110<\/output>/u);
  assert.match(s.rik, /<table class="otabell">/u);
});
test('hvert tall på hver side kan regnes ut fra datafila', () => {
  for (const r of rader) assert.deepEqual(tallUtenforData(sideForRad(r, data, rader), tillatteTall(r, data)), [], r.id);
});
test('samlesiden lister alle varene med lenke, og tittelen har riktig antall', () => {
  const s = navSide(data, rader);
  for (const r of rader) assert.ok(s.rik.includes(`href="/verktoy/dl-til-gram/${r.slug}/"`), r.id);
  assert.ok(s.title.includes(`${rader.length} varer`));
});
test('strukturerte data: kalkulator og artikkel med kilder, ingen HowTo', () => {
  const typer = sideForRad(rad('hvetemel'), data, rader).schemas.map((x) => x['@type']);
  assert.deepEqual(typer, ['BreadcrumbList', 'WebApplication', 'Article']);
});
```

- [ ] **Steg 2: Kjør** `node --test test/dl-til-gram-mal.test.mjs`. Forventet: rødt.
- [ ] **Steg 3: Bygg malen.** Skriv `tekst-nb.mjs` for alle publiserbare rader med skillen `matlyst-sprak`.
- [ ] **Steg 4: Kjør** testen. Forventet: grønt.
- [ ] **Steg 5: Commit** `dl til gram: mal, tekster og strukturerte data`.

### Oppgave 6: Inn i registeret, og sidene på disk

**Filer:**
- Endre: `scripts/familier/register.mjs` (første oppføring: `{ id: 'dl-til-gram', sidetype: 'omregner', markeder: { nb: { rot: 'verktoy/dl-til-gram/' } } }`)
- Endre: `scripts/hyller.mjs:54` (fjern `finnes: false` på dl til gram)
- Endre: `test/hyller.test.mjs` (antall skjulte lenker går fra sju til seks, synlige lenker opp tilsvarende), `test/sidetyper.test.mjs` (antallene)
- Lag: `verktoy/dl-til-gram/**/index.html` (skrives av kjeden), oppdatert `sitemap.xml`, `llms.txt`, `scripts/lastmod-kart.json`

- [ ] **Steg 1: Legg inn oppføringen og kjør kjeden** på arbeidskopien (rekkefølgen i `scripts/kjede.mjs`). Forventet: nye filer bare under `verktoy/dl-til-gram/`, pluss sidekart, `llms.txt`, lastmod-kart og bunnmenyen på nb-sidene (hyllelenka). Sv, da og en skal ikke få lenka (siden finnes bare på norsk); bekreft med `git status`.
- [ ] **Steg 1b: `llms.txt`.** Røyktesten i grunnmuren viste at nye familiesider ikke kommer i `llms.txt` av seg selv (`scripts/llms.mjs` tar bare verktøyhuben for omregnere). Utvid `llms.mjs` så samlesiden til hver registrerte familie tas med (ikke hver vareside), med test i `test/llms.test.mjs`.
- [ ] **Steg 2: Kjør** `npm test`. Forventet: rødt bare på de tellende testene (hyller, sidetyper). Oppdater tallene, kjør på nytt: grønt, og `test/familier.test.mjs` grønn for den ekte familien.
- [ ] **Steg 3: Mål likheten.** Skriv ut `forLike(sider, 0)` for familien (andelen unik tekst per side) og legg tabellen i PR-en. Ligger noen under 0,2: gjør sidene mer ulike gjennom innhold som finnes i kildene (kildesammenligning, variant, skjetall), ikke ved å senke terskelen. Sett den endelige terskelen i `test/familier.test.mjs` med én linje begrunnelse.
- [ ] **Steg 4: Kjør** `REVISJON=pr npx playwright test revisjon.spec` med de nye sidene i `REVISJON_ENDRET`. Forventet: grønt på 360, 390, 768 og 1280 px, forstørret tekst og zoom.
- [ ] **Steg 5: Commit** `dl til gram: samleside og varesider på norsk`.

### Oppgave 7: Forhåndsvisning, tilgjengelighet og måling

**Filer:**
- Lag: `qa/skjermbilder/dl-til-gram/` (skjermbilder, ikke publisert)
- Endre (i repoet matlyst, gren fra `master`): søkeordloggens gruppering, så `/verktoy/dl-til-gram/` vises som egen familie i fanen «Nett»

- [ ] **Steg 1: Tilgjengelighet.** Kjør Lighthouse (mobil) på samlesiden og én vareside: tilgjengelighet 100, SEO 100. Tastatur: hele kalkulatoren kan brukes uten mus, fokus er synlig, svarsetningen leses opp (`role="status"`). Kontrast AA på alt i kortet, også den mørke svarsiden.
- [ ] **Steg 2: Forhåndsvisning til Patrick.** Skjermbilder av samlesiden og tre varesider (hvetemel, kakao, smør) på 390 og 1280 px, og en lokal adresse han kan åpne. Legg dem i PR-en. Vent på hans ja.
- [ ] **Steg 3: Grunnlinje.** Noter i PR-en hva Search Console viser for «dl til gram»-ordene i dag (fra søkeordloggen), så virkningen kan måles.
- [ ] **Steg 4: Etter sammenslåing:** bekreft at IndexNow sendte de nye adressene, be om indeksering av samlesiden i Search Console, og sett to datoer i notatet: indeksmåling etter én og to uker. Porten er 70 prosent indeksert etter to uker før neste familie går ut.

---

## Etter planen

Engelsk (cups to grams) planlegges når den norske er ute. Kalkulatoren øverst og «cups» på de 714 gamle omregnerne er en egen runde som gjenbruker `form.kalk`.

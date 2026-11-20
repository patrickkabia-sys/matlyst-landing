# Grunnmur for sidefamilier: byggeplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Mål:** Nettsted og bygg skal tåle 1 500 til 2 000 nye datadrevne sider: lett `locale.js`, sidekontroll som følger endringen, og et familieregister der bare tall med kilde blir sider.

**Arkitektur:** Språkforslaget leser sidens egne hreflang-lenker, så kartet på 120 KB forsvinner. Sidekontrollen på PR-er går på et utvalg per familie og språk pluss sidene PR-en endrer; full kontroll går ukentlig og når delt stil, skall eller skript endres. Familier er mapper under `scripts/familier/` med én datafil per marked og én malmodul per språk, koblet inn i de to stedene generatorene alt leser fra (`rike-sider-register.mjs` og `SIDEGRUPPER`).

**Teknologi:** Node 22 (ESM, `node --test`), zod 4 (finnes), Playwright 1.63, GitHub Actions. Ingen nye avhengigheter.

**Spec:** `~/matlyst-privat/seo-matlyst/2026-11-19-sokeord/PLAN-bred-synlighet.md`, avsnittet «Steg 2: Grunnmur for bredden» (sju punkter). Designspec for nettstedet: `docs/superpowers/specs/2026-11-18-nettside-designsystem-design.md`.

**Avvik fra specen, med vilje:** Punkt 6 (kalkulatorblokken `form.kalk` i `site.js`) bygges ikke her. Formen på blokken avhenger av utformingen av familie 1, som ikke er godkjent ennå, så den hører hjemme i byggeplanen for familie 1 sammen med delt tallesing. Koblingen til `scripts/hyller.mjs` trengs heller ikke her: `lokaliserHyller` slår opp via `gruppeForSti`, så hyllene virker av seg selv når familiens sider står i `SIDEGRUPPER`. Selve hyllelenka slås på når første familie finnes.

## Felles krav

- Tre PR-er, i denne rekkefølgen: A (oppgave 1), B (oppgave 2 og 3), C (oppgave 4 til 7). Hver fra egen gren ut fra `main`, i arbeidstre under `~/Documents/Apps/matlyst-traer/` (uten æ, ellers blir testene røde).
- Ingen publisert side skal endre synlig innhold. Etter hver oppgave skal `node --test test/kjede-fasit.test.mjs` være grønn uten nye oppføringer i `test/fasit/kjede-kjente-avvik.json`. Unntak: oppgave 1 endrer `locale.js`.
- All tekst på norsk bokmål, uten tankestrek som skilletegn. Kommentarer i koden på norsk, som resten av repoet.
- Hver ny vakt skal være sett rød: testen har en rød fikstur ved siden av den grønne.
- `npm test` og `npx playwright test sprakvalg` skal være grønne før hver PR.
- Bygging: Sonnet. Gransking: Codex parallelt, Opus på det som går til Patrick.

## Det granskeren skal se etter

1. **Adresser uten egen side i kartet.** `/personvern` (uten `.html`) og `/index.html` ble før sendt videre via aliaser i kartet. De skal fortsatt sendes til svensk og dansk side. Test i oppgave 1.
2. **Hreflang som ikke er til å stole på.** En lenke med annen vert, tom `href` eller ugyldig adresse skal gi «ingen videresending», aldri en feil i konsollen og aldri en videresending ut av nettstedet. Test i oppgave 1.
3. **Grønn kontroll uten sider.** Et PR-utvalg skal aldri være tomt: hver utrullet type har minst én side, også når PR-en ikke endrer HTML. Test i oppgave 2.
4. **PR som sletter eller flytter sider, eller der git ikke finner basen.** Filer i endringslista som ikke finnes lenger hoppes over. Finner arbeidsflyten ikke basen (grunn klone, gren fra en gaffel), kjører den full kontroll, ikke utvalg. Test i oppgave 2 og 3.
5. **Datarad som nesten er riktig.** Status `kontrollert` med ett tall uten kilde, to rader med samme adresse, eller en kilde uten hentedato skal stoppe bygget med radens id i feilmeldingen. Test i oppgave 4.

---

### Oppgave 1: `locale.js` uten sidekart (PR A)

**Filer:**
- Endre: `locale.js` (håndskrevet fra nå, ca. 4 KB)
- Endre: `scripts/generer-lokalsider.mjs:964-973` (fjern innskrivingen av kartet)
- Endre: `scripts/locale-sider.mjs` (fjern `byggLocalePageMap` hvis ingen bruker den etterpå)
- Endre: `scripts/kjede.mjs` (ta `locale.js` ut av `EKSTRA_FILER`)
- Endre: `test/locale-routing.test.mjs`, `test/hreflang-gjensidig.test.mjs:84`, `test/engelsk.test.mjs:135-185`, `test/mealime.test.mjs:50`, `test/julemiddag.test.mjs:49`, `test/om.test.mjs:31`
- Endre: `LOCALE-READINESS.md`, `locale-readiness.json`, `qa/sv-da/README.md` (beskrivelsen av kartet)

**Grensesnitt:**
- Lager: `window.MatlystLocale = { STORAGE_KEY, DECISION_KEY, normaliserSprak, foreslaSprak, lesAlternativer, finnMaalsti, erNorskSide }`.
  - `lesAlternativer(document, base) → { sprak: 'nb'|'sv'|'da'|'en', sti: string }[]` leser `link[rel="alternate"][hreflang]`, hopper over `x-default` og ukjente språk, og tar bare `pathname` fra `href` (løst mot `base`).
  - `finnMaalsti(maalSprak, alternativer) → string | null`.
  - `erNorskSide(sti, alternativer) → boolean`: stien starter ikke med `/sv`, `/da` eller `/en`, og sidene har et `nb`-alternativ.
- `LOCALE_PAGE_MAP` finnes ikke lenger, verken i fila eller på `MatlystLocale`.
- Oppførselen i `start()` er uendret: roboter, `?sprak=`, lagret valg, bare primærspråk, bare svensk og dansk, `location.replace(sti + search + hash)`.

- [ ] **Steg 1: Skriv om testhjelperen og de røde testene.** `besok()` i `test/locale-routing.test.mjs` får et valg `alternativer` (liste av `[hreflang, href]`) og gir `document.querySelectorAll` som returnerer dem; standard er hreflang-lenkene lest fra den ekte HTML-fila for stien, så testene går mot publiserte sider. Nye tester:

```js
test('locale.js bærer ikke lenger noe sidekart', () => {
  assert.equal(source.includes('LOCALE_PAGE_MAP'), false);
  assert.ok(Buffer.byteLength(source) < 6000);
});
test('adresser uten endelse sendes videre som før', () => {
  assert.equal(besok('/personvern', { sprak: 'da-DK' }).til, '/da/privatliv/');
  assert.equal(besok('/index.html', { sprak: 'sv-SE' }).til, '/sv/');
});
test('hreflang som ikke er til å stole på gir ingen videresending', () => {
  for (const href of ['', 'https://eksempel.no/sv/', 'http://[', 'javascript:alert(1)']) {
    const r = besok('/', { sprak: 'sv-SE', alternativer: [['nb-NO', 'https://matlyst-app.no/'], ['sv-SE', href]] });
    assert.ok(r.til === null || r.til.startsWith('/'), href);
    assert.equal(/^\/\//u.test(r.til ?? ''), false, href);
  }
});
```

  Testen «LOCALE_PAGE_MAP er bygd fra den samme tabellen» (`:122`) og `hreflang-gjensidig.test.mjs:84` slettes; gjensidigheten låses alt av `hreflang-gjensidig.test.mjs:40`. Testene i mealime, julemiddag og om som sier «siden står ikke i kartet» skrives om til «siden har ikke `<script src="/locale.js"`».
- [ ] **Steg 2: Kjør** `node --test test/locale-routing.test.mjs test/engelsk.test.mjs`. Forventet: rødt på de nye testene.
- [ ] **Steg 3: Skriv om `locale.js`** etter grensesnittet over. `https://eksempel.no/sv/` gir stien `/sv/` (bare `pathname` brukes, det er vernet mot videresending ut av nettstedet). En `href` som ikke lar seg tolke hoppes over i `try/catch`.
- [ ] **Steg 4: Fjern innskrivingen** i `generer-lokalsider.mjs` og `locale.js` fra `EKSTRA_FILER`. Slett `byggLocalePageMap` hvis `grep -rn byggLocalePageMap scripts test` er tomt etterpå. Reglene for hvilke sider som får script-taggen (`skalHaRedirect`) røres ikke.
- [ ] **Steg 5: Kjør** `npm test` og `npx playwright test sprakvalg`. Forventet: grønt. `sprakvalg.spec.mjs` skal ikke endres; den er beviset på at oppførselen er lik.
- [ ] **Steg 6: Mål og skriv i PR-en:** størrelsen på `locale.js` før og etter, og Lighthouse mobil for `/verktoy/dl-til-kopp/` før og etter.
- [ ] **Steg 7: Commit** `locale.js: språkforslaget leser sidens hreflang, kartet på 120 KB er borte`.

### Oppgave 2: Familie i sideregisteret og PR-utvalg (PR B)

**Filer:**
- Endre: `scripts/sidetyper.mjs`
- Endre: `test/playwright/hjelp/utvalg.mjs`
- Endre: `test/sidetyper.test.mjs`, `test/playwright/revisjon.spec.mjs:46-101` (metatestene)
- Lag: `test/utvalg-pr.test.mjs`

**Grensesnitt:**
- Lager i `sidetyper.mjs`: `familie(sti, html) → string`. Regler, i rekkefølge:
  1. Type `omregner` og `gruppeForSti(sti).id` er `auto-enhet-<fra>-<til>` → `omregner:<ENHETER[fra].gruppe>` (`volum`, `vekt`, `lengde`, `temperatur`).
  2. Type `omregner` ellers → `omregner:nav`.
  3. Alle andre → `nokkel(sti, html)`.

  Oppgave 5 legger en regel foran disse (`fam:<id>`). `alleSider()` får feltet `familie` på hver rad.
- Lager i `sidetyper.mjs`: `erGenerertFamilie(familie) → boolean`, sann for `omregner:*` unntatt `omregner:nav`, og for `fam:*`.
- Lager i `utvalg.mjs`: modusen `REVISJON=pr`. `utvalg({ revisjon: 'pr', endret?: string[] })`; uten `endret` leses fillista fra fila `process.env.REVISJON_ENDRET` (én sti per linje, relativ til repoet), og mangler den er lista tom. Konstanter: `PER_FAMILIE = 3`, `ENDRET_TAK = 40`.

**PR-utvalget er unionen av:**
1. Alle klare sider i familier som ikke er genererte (guider, blogg, juss, tjeneste: 157 sider i dag).
2. For hver generert familie og hvert språk: de `PER_FAMILIE` første sidene, sortert på `sha1(sti)`.
3. Alle eksempelsidene (`eksempelStier()`), `/` og bloggindeksene, som i standardutvalget.
4. Endrede sider: hver sti i `endret` som er en klar side. Per generert familie og språk tas høyst `ENDRET_TAK`, sortert på `sha1(sti)`. Stier som ikke finnes lenger hoppes over.

- [ ] **Steg 1: Skriv de røde testene** i `test/utvalg-pr.test.mjs`:

```js
test('PR-utvalget har tre per generert familie og språk, og alt det håndskrevne', () => {
  const rader = utvalg({ revisjon: 'pr', endret: [] });
  const sider = new Map(alleSider(ROT).map((s) => [s.sti, s]));
  const perFam = Map.groupBy(rader, (r) => `${sider.get(r.sti).familie}|${r.sprak}`);
  for (const [nokkel, liste] of perFam) {
    if (!erGenerertFamilie(nokkel.split('|')[0])) continue;
    const iAlt = [...sider.values()].filter((s) => `${s.familie}|${s.sprak}` === nokkel).length;
    // Små familier (temperatur har to sider per språk) tas hele. Eksempelsiden kan gi én ekstra.
    assert.ok(liste.length >= Math.min(3, iAlt) && liste.length <= 4, nokkel);
  }
  const handskrevne = [...sider.values()].filter((s) => ['guide-lang', 'guide-kort', 'blogg', 'juss'].includes(s.type));
  for (const s of handskrevne) assert.ok(rader.some((r) => r.sti === s.sti), s.sti);
  assert.ok(rader.length < 260, `utvalget er ${rader.length} sider`);
});
test('utvalget er likt fra kjøring til kjøring', () => {
  assert.deepEqual(utvalg({ revisjon: 'pr', endret: [] }), utvalg({ revisjon: 'pr', endret: [] }));
});
test('endrede sider tas med, med tak per familie og språk', () => {
  const nbVolum = alleSider(ROT).filter((s) => s.familie === 'omregner:volum' && s.sprak === 'nb');
  const stier = new Set(nbVolum.map((s) => s.sti));
  const rader = utvalg({ revisjon: 'pr', endret: nbVolum.map((s) => s.fil) });
  const antall = rader.filter((r) => stier.has(r.sti)).length;
  assert.ok(antall >= 40 && antall <= 44, String(antall));
});
test('slettede filer og filer som ikke er sider hoppes over', () => {
  assert.doesNotThrow(() => utvalg({ revisjon: 'pr', endret: ['verktoy/finnes-ikke/index.html', 'side.css', ''] }));
});
test('hver utrullet type har minst én side i PR-utvalget', () => {
  const typer = new Set(utvalg({ revisjon: 'pr', endret: [] }).map((r) => r.type));
  for (const t of utrulledeTyper()) assert.ok(typer.has(t), t);
});
```

  I `test/sidetyper.test.mjs`: hver side har en `familie`, og fordelingen for omregnere er låst (`omregner:nav` er nøyaktig 4).
- [ ] **Steg 2: Kjør** `node --test test/utvalg-pr.test.mjs test/sidetyper.test.mjs`. Forventet: rødt, `familie` og modusen `pr` finnes ikke.
- [ ] **Steg 3: Bygg `familie()` og `erGenerertFamilie()`** i `sidetyper.mjs`, og modusen `pr` i `utvalg.mjs`.
- [ ] **Steg 4: Kjør testene** på nytt, så `REVISJON=pr npx playwright test revisjon.spec --list | tail -1` og skriv antallet i commit-meldingen. Forventet: grønt, under 260 sider.
- [ ] **Steg 5: Commit** `revisjon: PR-utvalg per familie og språk pluss endrede sider`.

### Oppgave 3: Arbeidsflyten velger omfang (PR B)

**Filer:**
- Lag: `scripts/revisjon-omfang.mjs`
- Endre: `.github/workflows/revisjon.yml`
- Lag: `test/revisjon-omfang.test.mjs`

**Grensesnitt:**
- Lager: `omfang(filer: string[] | null) → 'full' | 'pr'`. `null` (git fant ikke basen) gir `full`. Én fil som treffer `FULL_MONSTRE` gir `full`.
- `FULL_MONSTRE` (eksportert): `*.css` og `*.js` i rota, `fonts/`, `scripts/skall*.mjs`, `scripts/sidetyper.mjs`, `scripts/rik-sider.mjs`, `scripts/generer-*.mjs`, `scripts/familier/felles.mjs`, `scripts/familier/skjema.mjs`, `test/playwright/`, `playwright.config.mjs`, `.github/workflows/revisjon.yml`.
- Kommandolinje: `git diff --name-only <base>...HEAD | node scripts/revisjon-omfang.mjs` skriver `full` eller `pr`. Feiler `git diff`, kalles skriptet med `--ukjent` og skriver `full`.

**Arbeidsflyten etter endringen:**
- Utløsere: `pull_request`, `schedule` (`cron: '0 4 * * 1'`, mandag morgen) og `workflow_dispatch`.
- Jobb `omfang`: `actions/checkout` med `fetch-depth: 0`, regner ut modus, lagrer endringslista som artefakt `endret`. Ved `schedule` og `workflow_dispatch` er modus alltid `full`.
- Jobb `utvalg` (`if: modus == 'pr'`): to skår, `REVISJON=pr`, `REVISJON_ENDRET=endret.txt`, `--workers=4`.
- Jobb `full` (`if: modus == 'full'`): tolv skår, `REVISJON=alle`, `--workers=4`, tidsgrense 30 min. Matrisen per type og språk fjernes; skårene tåler at familiene vokser.
- Før sammenslåing: sjekk med `gh api repos/{owner}/{repo}/branches/main/protection` om jobbnavnene i dag er påkrevde kontroller. Er de det, skriv i PR-en hvilke navn Patrick må bytte.

- [ ] **Steg 1: Skriv de røde testene:**

```js
test('delt stil, skall og skript gir full kontroll', () => {
  for (const f of ['side.css', 'tokens.css', 'site.js', 'skall.js', 'scripts/skall-paa.mjs', 'scripts/sidetyper.mjs',
    'scripts/generer-lokalsider.mjs', 'scripts/familier/felles.mjs', 'test/playwright/revisjon.spec.mjs', 'fonts/x.woff2']) {
    assert.equal(omfang([f]), 'full', f);
  }
});
test('sider, data og maler for én familie gir utvalg', () => {
  for (const f of ['verktoy/dl-til-kopp/index.html', 'scripts/familier/dl-til-gram/data.nb.json',
    'scripts/familier/dl-til-gram/mal-nb.mjs', 'scripts/nb-enhetssider.mjs', 'README.md', 'sitemap.xml']) {
    assert.equal(omfang([f]), 'pr', f);
  }
});
test('ukjent grunnlag gir full kontroll', () => {
  assert.equal(omfang(null), 'full');
});
test('arbeidsflyten har ukentlig kjøring, omfangsjobb og ingen typematrise', () => {
  const yml = readFileSync(join(ROT, '.github/workflows/revisjon.yml'), 'utf8');
  assert.match(yml, /schedule:\s*\n\s*- cron: '0 4 \* \* 1'/u);
  assert.match(yml, /fetch-depth: 0/u);
  assert.match(yml, /REVISJON: pr/u);
  assert.match(yml, /REVISJON: alle/u);
  assert.equal(/type: omregner/u.test(yml), false);
});
```

- [ ] **Steg 2: Kjør** `node --test test/revisjon-omfang.test.mjs`. Forventet: rødt.
- [ ] **Steg 3: Bygg skriptet og skriv om arbeidsflyten.**
- [ ] **Steg 4: Kjør** `npm test`. Åpne PR B og les av i Actions: PR-en rører `test/playwright/` og `revisjon.yml`, så den skal selv gå i modus `full` med tolv skår. Skriv kjøretiden per skår i PR-en. Kjør så `gh workflow run revisjon.yml --ref <gren>` og bekreft at også den går full.
- [ ] **Steg 5: Commit** `revisjon: full kontroll ukentlig og ved delte endringer, utvalg ellers`.

### Oppgave 4: Dataskjema med kildekrav (PR C)

**Filer:**
- Lag: `scripts/familier/felles.mjs`
- Lag: `test/fiksturer/familier/proeve/data.nb.json`, `data.en.json` (grønne) og `test/fiksturer/familier/rode/*.json` (én per feil)
- Lag: `test/familie-data.test.mjs`

**Grensesnitt (zod):**

```js
Kilde   = { navn: string, utgiver: string, aar: int, adresse: 'https://…', hentet: 'ÅÅÅÅ-MM-DD' }
Tall    = { verdi: number, enhet: string, kilde: string, andre?: { verdi: number, kilde: string }[], merknad?: string }
Rad     = { id: /^[a-z0-9-]+$/, slug: /^[a-z0-9-]+$/, navn: string, status: 'kontrollert' | 'utkast' | 'avvist',
            kontrollert?: 'ÅÅÅÅ-MM-DD', oppdatert: 'ÅÅÅÅ-MM-DD', tall: Record<string, Tall>, tekst?: Record<string, string> }
Data    = { familie: string, marked: 'nb' | 'sv' | 'da' | 'en', kilder: Record<string, Kilde>, rader: Rad[] }
```

- `validerData(obj) → Data`, kaster `Error` der meldingen begynner med `<familie>/<marked>/<rad-id>:`. I tillegg til skjemaet: hver `tall.kilde` og `andre[].kilde` finnes i `kilder`; `id` og `slug` er unike; `tall` har minst ett tall; rad med status `kontrollert` har `kontrollert`-dato.
- `lesData(mappe, marked) → Data` leser `data.<marked>.json`.
- `publiserbare(data) → Rad[]`, bare status `kontrollert`.
- `kilderFor(data, rader) → Kilde[]`, kildene radene faktisk bruker, i den rekkefølgen de først nevnes.

Samme `id` i to markeders datafiler betyr «samme vare»; det er det som gir hreflang mellom språkene. En rad uten motstykke er en side på ett språk.

- [ ] **Steg 1: Skriv fiksturene og de røde testene.** Den grønne fiksturen har tre rader på `nb` (to `kontrollert`, én `utkast`) og to på `en`, med oppdiktede varer («prøvemel») så ingen tar tallene for ekte. Røde fiksturer, én fil hver: `tall-uten-kilde`, `kilde-uten-hentedato`, `kilde-uten-https`, `lik-slug`, `kontrollert-uten-dato`, `rad-uten-tall`. Testen krever for hver rød fil at `validerData` kaster og at meldingen navngir raden.
- [ ] **Steg 2: Kjør** `node --test test/familie-data.test.mjs`. Forventet: rødt, modulen finnes ikke.
- [ ] **Steg 3: Bygg `felles.mjs`.**
- [ ] **Steg 4: Kjør** testen. Forventet: grønt.
- [ ] **Steg 5: Commit** `familier: dataskjema der bare tall med kilde slipper gjennom`.

### Oppgave 5: Familieregisteret og koblingene (PR C)

**Filer:**
- Lag: `scripts/familier/register.mjs`
- Lag: `test/fiksturer/familier/proeve/mal-nb.mjs`, `mal-en.mjs`
- Endre: `scripts/rike-sider-register.mjs`, `scripts/locale-sider.mjs`, `scripts/sidetyper.mjs`
- Endre: `test/sidetyper.test.mjs:25-29` (antallene regnes med familiene)
- Lag: `test/familie-register.test.mjs`

**Grensesnitt:**
- Bruker: `lesData`, `publiserbare` fra oppgave 4; `familie()` fra oppgave 2.
- Registeroppføring: `{ id: string, sidetype: 'omregner' | 'guide-lang', mappe: URL, markeder: { [marked]: { rot: string } } }`. `rot` er stien uten språkmappe og uten ledende skråstrek, for eksempel `verktoy/dl-til-gram/`.
- `export const FAMILIER = Object.freeze([])`. Den er tom til første familie bygges.
- Malmodul `mal-<marked>.mjs` i familiens mappe eksporterer:
  - `navSide(data, rader) → sideobjekt` (familiens samleside, på `rot`),
  - `sideForRad(rad, data, rader) → sideobjekt` (på `<rot><rad.slug>/`),
  - `tillatteTall(rad, data) → Set<string>` (hvert tall malen får skrive på radens side, ferdig formatert; brukes av vakten i oppgave 7).

  `sideobjekt` er det samme som `sideForPar` i `scripts/nb-enhetssider.mjs:220` returnerer, med `publisert: rad.oppdatert` og `schemas` satt (oppgave 6).
- Alle funksjonene tar registeret som siste parameter, med `FAMILIER` som standard, så testene kan gi fiksturen:
  - `await familieSider(marked, familier?) → { [sti]: sideobjekt }`
  - `familieGrupper(familier?) → { id, sider }[]`, id `auto-fam-<familie>-nav` og `auto-fam-<familie>-<rad.id>`. Synkron: leser bare datafilene.
  - `familieForSti(sti, familier?) → string | null`, med full sti (`/verktoy/dl-til-gram/hvetemel/`, `/en/tools/cups-to-grams/flour/`).
  - `familieAntall(familier?) → { omregner: number, 'guide-lang': number }`.
- `register.mjs` importerer aldri `sidetyper.mjs` eller `locale-sider.mjs` (de importerer registeret).

**Koblingene:**
- `rike-sider-register.mjs`: `RIKE[marked]` får `...await familieSider(marked)` sist.
- `locale-sider.mjs`: `SIDEGRUPPER` får `...familieGrupper()` etter `enhetsGrupper()`.
- `sidetyper.mjs`: `familie()` får regelen `familieForSti(sti)` → `fam:<id>` først.

- [ ] **Steg 1: Skriv de røde testene** mot fiksturen `proeve` (rot `verktoy/proeve/` på nb, `tools/proeve/` på en):

```js
test('bare kontrollerte rader blir sider, pluss samlesiden', async () => {
  const sider = await familieSider('nb', [PROEVE]);
  assert.deepEqual(Object.keys(sider).sort(), ['verktoy/proeve/', 'verktoy/proeve/provemel/', 'verktoy/proeve/provesukker/']);
});
test('samme id på to markeder gir én sidegruppe med begge språk', () => {
  const g = familieGrupper([PROEVE]).find((x) => x.id === 'auto-fam-proeve-provemel');
  assert.deepEqual(g.sider, { nb: '/verktoy/proeve/provemel/', en: '/en/tools/proeve/test-flour/' });
});
test('rad på ett marked gir gruppe med ett språk', () => {
  const g = familieGrupper([PROEVE]).find((x) => x.id === 'auto-fam-proeve-provesukker');
  assert.deepEqual(Object.keys(g.sider), ['nb']);
});
test('sti slås opp til familie, og nabostier gjør det ikke', () => {
  assert.equal(familieForSti('/verktoy/proeve/provemel/', [PROEVE]), 'proeve');
  assert.equal(familieForSti('/verktoy/proeve-annet/', [PROEVE]), null);
  assert.equal(familieForSti('/verktoy/dl-til-kopp/', [PROEVE]), null);
});
test('hvert sideobjekt har feltene generatorene krever', async () => {
  for (const s of Object.values(await familieSider('nb', [PROEVE]))) {
    for (const felt of ['title', 'description', 'eyebrow', 'h1', 'lead', 'steg', 'rik', 'faq', 'cta', 'publisert', 'schemas']) assert.ok(s[felt], felt);
  }
});
test('tomt register endrer ingenting', async () => {
  assert.deepEqual(await familieSider('nb'), {});
  assert.deepEqual(familieGrupper(), []);
});
```

- [ ] **Steg 2: Kjør** `node --test test/familie-register.test.mjs`. Forventet: rødt.
- [ ] **Steg 3: Bygg registeret og fiksturmalene, og legg inn de tre koblingene.** Fiksturmalene er korte, men gir ekte sideobjekter (de brukes igjen i oppgave 7).
- [ ] **Steg 4: Kjør** `npm test`. Forventet: grønt, og `kjede-fasit` uten avvik (registeret er tomt, så ingen fil skal endre seg).
- [ ] **Steg 5: Røyktest med fiksturen gjennom generatoren.** Kjør kjeden i en kopi (`scripts/kjedeproeve.mjs` viser hvordan) med fiksturen lagt i `FAMILIER`, og bekreft for hånd at `verktoy/proeve/provemel/index.html` blir skrevet med hreflang til `/en/tools/proeve/test-flour/`, står i `sitemap.xml`, og får typen `omregner` og familien `fam:proeve`. Skriv funnene i PR-en. Avviker noe fra det denne planen antar om generatorene, stopp og meld fra før du retter.
- [ ] **Steg 6: Commit** `familier: register, malkontrakt og kobling til generatorene`.

### Oppgave 6: Strukturerte data per familie (PR C)

**Filer:**
- Lag: `scripts/familier/skjema.mjs`
- Endre: `scripts/generer-lokalsider.mjs` (`guidePage`, ca. linje 720)
- Lag: `test/familie-skjema.test.mjs`

**Grensesnitt:**
- `brodsmuler(ledd: { navn, adresse }[]) → object` (`BreadcrumbList`)
- `webApplikasjon({ navn, beskrivelse, adresse, sprak }) → object` (`WebApplication`, `applicationCategory: 'UtilitiesApplication'`, `operatingSystem: 'Any'`, `offers` med pris 0, `isAccessibleForFree: true`)
- `artikkel({ tittel, beskrivelse, adresse, sprak, publisert, endret, kilder: Kilde[], forfatter? }) → object` (`Article` med én `citation` per kilde: `CreativeWork` med `name`, `publisher`, `url`, `datePublished` lik året). `forfatter` er personobjektet fra `scripts/forfatter.mjs`; uten den brukes organisasjonen fra `scripts/organisasjon.mjs`.
- `elementliste({ navn, adresse, elementer: { navn, adresse }[] }) → object` (`ItemList`)
- `guidePage(lang, v)`: et element i `v.schemas` som er et objekt skrives ut som det er, etter brødsmulene. Tekstnavnene (`'article'`, `'faq'`, `'howto'`) virker som før. Den norske generatoren tar alt imot ferdige objekter.
- Ingen av funksjonene lager `HowTo` eller `FAQPage`.

- [ ] **Steg 1: Skriv de røde testene:** hver bygger gir riktig `@type` og `@context`; `artikkel` med to kilder gir to `citation` med `url` og `publisher`; `guidePage('en', side)` med ett objekt i `schemas` gir JSON-LD der objektet står uendret og der `HowTo` ikke finnes; en side med `schemas: ['article', 'faq']` gir nøyaktig det samme som før endringen (sammenlign mot `en/mealime-alternative/index.html`).
- [ ] **Steg 2: Kjør** `node --test test/familie-skjema.test.mjs`. Forventet: rødt.
- [ ] **Steg 3: Bygg `skjema.mjs` og utvid `guidePage`.** Eksporter `guidePage` hvis den ikke er eksportert.
- [ ] **Steg 4: Kjør** `npm test`. Forventet: grønt, `kjede-fasit` uten avvik.
- [ ] **Steg 5: Commit** `familier: WebApplication, Article med kilder og ItemList, uten HowTo`.

### Oppgave 7: Vaktene for alle familier (PR C)

**Filer:**
- Lag: `test/hjelp/familievakt.mjs`
- Lag: `test/familier.test.mjs`
- Lag: `test/fiksturer/familier/rode-sider/` (sideobjekter som skal felle hver vakt)

**Grensesnitt:**
- Bruker: `FAMILIER`, `familieSider`, `familieGrupper` (oppgave 5), `lesData`, `publiserbare` (oppgave 4), `restord` fra `test/hjelp/restord.mjs`, `alleSider` fra `scripts/sidetyper.mjs`.
- `synligTekst(side) → string`: `lead`, `forst`, `rik`, `steg` og `faq` uten HTML-tagger, `<script>` og `<style>`.
- `tallUtenforData(side, tillatte: Set<string>) → string[]`: hvert tall i `synligTekst` (`/\d+(?:[.,]\d+)?/gu`, med hardt mellomrom som tusenskille slått sammen) som ikke står i `tillatte`.
- `forLike(sider: { sti, tekst }[], terskel = 0.2) → { sti, unik }[]`: for hver side, andelen ordfemmere (fem ord på rad, små bokstaver) som ikke finnes på noen annen side i lista. Sider under terskelen returneres.
- `dupliserte(sider, felt: 'title' | 'h1' | 'description') → string[][]`.
- `sideMotData(familie, rot) → { manglerFil: string[], manglerRad: string[] }`: publiserbare rader uten fil på disk, og filer under familiens rot uten rad.

Terskelen 0,2 er et startpunkt. Byggeplanen for familie 1 måler den mot de ekte sidene og setter den endelige verdien med begrunnelse; den senkes aldri for å få en rød test grønn.

- [ ] **Steg 1: Skriv de røde fiksturene og testene.** For hver vakt én fikstur som skal felle den og én som skal passere: en side med tallet «137» som ikke står i `tillatteTall`; tre sider der bare varenavnet er byttet ut (skal felles av `forLike`); to sider med lik tittel; en engelsk side med ordet «oppskrift» i synlig tekst; en publiserbar rad uten fil. Testen `test/familier.test.mjs` har to deler:
  1. «Vaktene kan bli røde»: kjører hver vakt mot fiksturene.
  2. «Familiene i registeret»: for hver oppføring i `FAMILIER` og hvert marked: `validerData` går gjennom, `tallUtenforData` er tom for hver side, `forLike` er tom, `dupliserte` er tom for tittel, H1 og beskrivelse, `restord` er tom på sv, da og en, og `sideMotData` er tom. Med tomt register er del 2 grønn uten å gjøre noe; en egen test krever at del 2 faktisk kjører når fiksturen gis som register (så den ikke blir grønn av å hoppe over alt).
- [ ] **Steg 2: Kjør** `node --test test/familier.test.mjs`. Forventet: rødt.
- [ ] **Steg 3: Bygg `familievakt.mjs`.**
- [ ] **Steg 4: Kjør** `npm test`. Forventet: grønt.
- [ ] **Steg 5: Skriv et kort avsnitt** «Sidefamilier» i `docs/superpowers/specs/2026-11-18-nettside-designsystem-design.md` (etter §13): hvor data, maler og register ligger, at bare kontrollerte rader blir sider, og hvilke vakter som gjelder. Maks femten linjer.
- [ ] **Steg 6: Commit** `familier: vakter for kilder, tall, likhet, restord og samsvar med data`.

---

## Etter planen

Grunnmuren er ferdig når de tre PR-ene er slått sammen, den ukentlige kontrollen har gått grønt én gang, og `locale.js` er målt på nettstedet etter publisering. Da kan byggeplanen for familie 1 (dl til gram) kjøres: den legger første oppføring i `FAMILIER`, bygger `form.kalk` og slår på hyllelenka.

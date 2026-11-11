# SEO-autopilot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** En nattlig GitHub Actions-jobb i matlyst-landing finner søk, skriver én artikkel på nb/sv/da/en-US med Haiku, kontrollerer den og publiserer den (eller lager PR i `utkast`).

**Architecture:** Små Node-moduler i `seo-motor/` som bare snakker via filer i `seo-data/` og `blogg-kilde/auto/`. Ren logikk (velger, vern, lenker, kø) er rene funksjoner med injiserte avhengigheter; IO (Search Console, DataForSEO, kilder, Anthropic, GitHub) ligger i tynne adaptere. `scripts/blogg.mjs` utvides til å rendre auto-artiklene med samme mal som i dag.

**Tech Stack:** Node 22 (ESM, `.mjs`), `node:test`, `@anthropic-ai/sdk` + `zod` (`client.messages.parse` + `zodOutputFormat`), `google-auth-library` (Search Console), `fetch` (DataForSEO, kilder), GitHub Actions + `gh`.

**Spec:** `docs/superpowers/specs/2026-11-11-seo-autopilot-design.md`

## Global Constraints

- Modell: `claude-haiku-5-5` for alle kall. Ingen andre modeller.
- Ingen hardkodet tekst eller modellinstruks i `.mjs`: all språktekst i `seo-data/sprak/<kode>.json`, instrukser i `seo-data/instrukser/*.md`.
- Språk: `nb`, `sv`, `da`, `en` (en = en-US). Adresserøtter fra `BLOGGROT` i `scripts/blogg.mjs`.
- Aldri lenke til eller nevne domener/navn i `seo-data/forbudt.json` (start: matprat.no, godt.no, nom.no, «Matprat», «Godt.no», «Nom»).
- Ingen retry-løkker: én kjøring per natt, feil → ingen publisering, grunn i rapporten. Anthropic-klienten lages med `maxRetries: 0`.
- Maks én publisering per kalenderdøgn i `Europe/Oslo`.
- Brødtekst 600–1 200 ord; tittel ≤ 60 tegn; meta 120–160 tegn; 3–6 seksjoner; 3–5 FAQ.
- Startmodus `utkast`. `på` settes bare manuelt etter Patricks ja.
- Kostnadstak ≈ $10/mnd; DataForSEO-tak i `seo-data/grenser.json` (`dataforseoMaksForesporslerPerUke: 40`).
- Tester ligger som `test/seo-*.test.mjs` slik at `npm test` (`node --test test/*.test.mjs`) plukker dem opp.
- Agenter: aldri `source .env.local`; bruk bare variablene oppgaven trenger.

## Review Focus

1. Modellen returnerer HTML/skript i tekstfelt → rendreren escaper alt; bare `<b>`-fri ren tekst kommer ut (test i Task 9: `auto-artikkel escaper HTML i modellfelt`).
2. Slug med æ/ø/å/ä/ö eller tegn → ASCII-slug (`ø→o`, `æ→ae`, `å→a`, `ä→a`, `ö→o`), kollisjon avvises (test i Task 3: `slugify gir ascii og vern avviser kollisjon`).
3. Kildesida gir 403/tom tekst → ingen artikkel, grunnen `kilder: ingen utdrag` i loggen (test i Task 5: `tom kilde gir ingen utdrag`).
4. Emnet finnes bare på ett språk → hreflang-gruppen har ett medlem og gir ingen lenker til sider som ikke finnes (test i Task 9: `enspråklig auto-artikkel får ingen hreflang til andre språk`).
5. Manuell `workflow_dispatch` samme døgn som cron, og døgnskille rundt sommertid → andre kjøring publiserer ikke (test i Task 2: `andre kjøring samme Oslo-døgn nektes` med `2026-03-29T00:30:00Z` og `2026-03-29T23:30:00Z`).

---

### Task 1: Grunnmur — avhengigheter, data og artikkelskjema

**Files:**
- Modify: `package.json` (deps: `@anthropic-ai/sdk`, `zod`, `google-auth-library`; script `"seo": "node seo-motor/kjor.mjs"`)
- Create: `seo-motor/skjema.mjs`
- Create: `seo-data/grenser.json`, `seo-data/forbudt.json`, `seo-data/frø.json`, `seo-data/kilder.json`, `seo-data/emnekø.json` (`[]`), `seo-data/publisert.json` (`[]`), `seo-data/sprak/{nb,sv,da,en}.json`, `seo-data/instrukser/{passform,skriv,gransk}.md`
- Test: `test/seo-skjema.test.mjs`

**Interfaces:**
- Produces: `ArtikkelSkjema` (zod) med felt `sprak` (enum nb|sv|da|en), `emne_id` (string), `slug`, `tittel`, `meta`, `ingress`, `seksjoner[]` (`{type:'avsnitt',overskrift,tekst}` | `{type:'tabell',overskrift,rader:[[string,string]]}` | `{type:'liste',overskrift,punkter:string[]}`), `faq[]` (`{sporsmal,svar}`), `pastander[]` (`{tekst,kilde_id}`), `appkobling` (enum `import|ukemeny|handleliste|bruk-det-jeg-har|kokemodus`), `tagger: string[]`. `GranskSkjema`: `{beslutning:'GODKJENT'|'AVVIST', grunn:string}`. `PassformSkjema`: `{vurderinger:[{sokeord,passform:0|1|2|3,tagger:string[]}]}`.
- Produces: `lesData(navn: string, rot?: URL) -> any` (leser `seo-data/<navn>`).
- Produces: språkfil-format `{ stemme: string[], unngå: string[], typografi: string[], britiskeOrd?: string[], helseord: string[], appCta: {<appkobling>: {tittel, tekst}}, stoppord: string[] }`.
- Produces: `kilder.json` format `{ <sprak>: [{ id, domene, url, tagger: string[] }] }` med Mattilsynet/Matvaretabellen (nb), Livsmedelsverket (sv), Fødevarestyrelsen (da), USDA FSIS/FDA (en).

- [ ] **Step 1:** Skriv `test/seo-skjema.test.mjs`: `ArtikkelSkjema godtar gyldig artikkel` (fixture inline), `ArtikkelSkjema avviser ukjent appkobling`, `alle fire språkfiler har samme nøkler i appCta`, `en.json har britiskeOrd med minst tick, the shop, expiry`, `forbudt.json inneholder matprat.no, godt.no, nom.no`.
- [ ] **Step 2:** `npm install @anthropic-ai/sdk zod google-auth-library` og kjør `node --test test/seo-skjema.test.mjs` → FAIL (modul mangler).
- [ ] **Step 3:** Lag `seo-motor/skjema.mjs` og datafilene. Språkfilenes regler hentes fra `~/.claude/skills/matlyst-sprak/` og Henriettes ordvalg (minnet `matlyst-dansk-ordlyd-henriette`); en-US: amerikansk stavemåte, °F først med °C i parentes, cups. Instruksmalene bruker plassholdere `{{sprakregler}}`, `{{emne}}`, `{{utdrag}}`, `{{appkoblinger}}`.
- [ ] **Step 4:** `node --test test/seo-skjema.test.mjs` → PASS. Kjør `npm test` → alle eksisterende tester fortsatt PASS.
- [ ] **Step 5:** Commit `seo: grunnmur for autopiloten (skjema, data, språkregler)`.

### Task 2: Modus, sperre og døgngrense

**Files:**
- Create: `seo-motor/modus.mjs`
- Test: `test/seo-modus.test.mjs`

**Interfaces:**
- Produces: `lesModus({ variabel: string|undefined, sperre: object|null }) -> 'av'|'utkast'|'på'` — ukjent/tom variabel → `'av'`; `sperre` satt og variabel `'på'` → `'utkast'`.
- Produces: `osloDato(tid: Date) -> 'YYYY-MM-DD'` (via `Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Oslo'})`).
- Produces: `kanPublisere(publisert: {dato:string}[], tid: Date) -> boolean`.
- Produces: `tellAvvisningerPåRad(logg: {resultat:'publisert'|'utkast'|'avvist'|'tom'|'feil'}[]) -> number` og `skalSperre(antall) -> antall >= 3`.

- [ ] **Step 1:** Tester: `ukjent variabel gir av`, `sperre tvinger utkast`, `andre kjøring samme Oslo-døgn nektes` (publisert `[{dato: osloDato(new Date('2026-03-29T00:30:00Z'))}]`, `kanPublisere(..., new Date('2026-03-29T21:30:00Z')) === false`, og `new Date('2026-03-29T22:30:00Z')` → `true`), `tre avvisninger på rad gir sperre`, `tom kø teller ikke som avvisning`.
- [ ] **Step 2:** Kjør → FAIL.
- [ ] **Step 3:** Implementer `seo-motor/modus.mjs`.
- [ ] **Step 4:** Kjør `node --test test/seo-modus.test.mjs` → PASS.
- [ ] **Step 5:** Commit `seo: modus, sperre og én publisering per døgn`.

### Task 3: Nettstedsindeks og faste vernsjekker

**Files:**
- Create: `seo-motor/nettsted.mjs`, `seo-motor/sprakgjenkjenning.mjs`, `seo-motor/vern.mjs`
- Test: `test/seo-vern.test.mjs`, fixtures i `seo-motor/test/fixtures/artikler/`

**Interfaces:**
- Produces: `lesNettsted(rot: URL) -> { sider: {sti, tittel, meta, tekst}[], stier: Set<string> }` (fra `sitemap*.xml` + `<title>`/`<meta name="description">`/brødtekst i hver `index.html`).
- Produces: `slugify(tekst: string) -> string`.
- Produces: `ordOverlapp(a: string, b: string) -> number` (Jaccard på normaliserte ord uten stoppord, 0–1).
- Produces: `gjenkjennSprak(tekst: string, stoppord: Record<sprak,string[]>) -> sprak` (flest stoppord-treff).
- Produces: `sjekkFast(artikkel, { nettsted, forbudt, sprakfiler, grenser }) -> { ok: boolean, grunner: string[] }` — de sju sjekkene i specen; overlapp-terskel `grenser.overlappMaks = 0.5`; «hvert tall i brødteksten finnes i en påstand»: alle `/\d+([.,–-]\d+)?/` i seksjoner/faq må forekomme i `pastander[].tekst`.

- [ ] **Step 1:** Tester, én per sjekk med en fixture som feiler og én gyldig som passerer: `gyldig artikkel passerer`, `for lang tittel avvises`, `slugify gir ascii og vern avviser kollisjon` (`slugify('Rømmegrøt på 10 min')==='rommegrot-pa-10-min'`), `nesten-duplikat avvises`, `lenke til matprat.no avvises`, `død intern lenke avvises`, `tall uten påstand avvises`, `ukjent kilde_id avvises`, `svensk tekst merket da avvises`, `en-tekst med «the shop» avvises`, `helseord avvises`.
- [ ] **Step 2:** Kjør → FAIL.
- [ ] **Step 3:** Implementer de tre modulene. `lesNettsted` tar inn `rot` så testen kan bruke repo-roten.
- [ ] **Step 4:** Kjør `node --test test/seo-vern.test.mjs` → PASS.
- [ ] **Step 5:** Commit `seo: faste vernsjekker`.

### Task 4: Claude-klient

**Files:**
- Create: `seo-motor/claude.mjs`
- Test: `test/seo-claude.test.mjs`

**Interfaces:**
- Produces: `lagKlient({ apiKey }) -> Anthropic` med `maxRetries: 0`.
- Produces: `kallStrukturert(klient, { instruks: string, innhold: string, skjema: ZodSchema, effort: 'low'|'medium', maxTokens?: number }) -> Promise<{ data, usage: {input, output, cacheLes}, kostnadUsd: number }>` — `client.messages.parse({ model: 'claude-haiku-5-5', max_tokens: maxTokens ?? 16000, system: [{type:'text', text: instruks, cache_control:{type:'ephemeral'}}], messages:[{role:'user',content:innhold}], output_config:{ effort, format: zodOutputFormat(skjema) } })`. Kaster `KallFeil` med `grunn` ved `stop_reason` `refusal`/`max_tokens` eller `parsed_output === null`. Kostnad: $0.10/M inn, $0.50/M ut, cache-les $0.01/M.
- Produces: `fyllMal(mal: string, verdier: Record<string,string>) -> string` (kaster ved manglende plassholder).

- [ ] **Step 1:** Tester med falsk klient (`{ messages: { parse: async () => fakeSvar } }`): `returnerer data og kostnad`, `refusal gir KallFeil`, `null parsed_output gir KallFeil`, `fyllMal kaster ved manglende verdi`, `modell er claude-haiku-5-5` (sjekk argumentet den falske klienten fikk).
- [ ] **Step 2:** Kjør → FAIL. **Step 3:** Implementer. **Step 4:** Kjør → PASS.
- [ ] **Step 5:** Commit `seo: Haiku-klient med strukturert svar og kostnad`.

### Task 5: Kildehenter

**Files:**
- Create: `seo-motor/kilder.mjs`
- Test: `test/seo-kilder.test.mjs`, fixtures `seo-motor/test/fixtures/kilder/*.html`

**Interfaces:**
- Consumes: `kilder.json` (Task 1).
- Produces: `hentUtdrag(emne: {sprak, tagger, sokeord}, kilder, hent: (url)=>Promise<{status,tekst}>) -> Promise<{ id: 'K1'.., url, tekst }[]>` — velg kilder med felles tagg (maks 3), strip HTML, del i avsnitt, behold avsnitt med ord fra `sokeord`/`tagger`, maks 12 utdrag à ≤ 600 tegn. Bare URL-er fra `kilder.json`; status ≠ 200 hoppes over.

- [ ] **Step 1:** Tester: `velger kilder med felles tagg`, `tom kilde gir ingen utdrag` (status 403 og tom body → `[]`), `utdrag nummereres K1..`, `henter aldri utenfor kilder.json`.
- [ ] **Step 2–4:** FAIL → implementer → PASS.
- [ ] **Step 5:** Commit `seo: kildeutdrag fra offentlige kilder`.

### Task 6: Skribent og gransker

**Files:**
- Create: `seo-motor/skriv.mjs`, `seo-motor/gransk.mjs`
- Test: `test/seo-skriv.test.mjs`

**Interfaces:**
- Consumes: `kallStrukturert`, `fyllMal` (Task 4); `ArtikkelSkjema`, `GranskSkjema` (Task 1); utdrag (Task 5).
- Produces: `skrivArtikkel(klient, { emne, utdrag, sprakfil, mal }) -> Promise<{artikkel, kostnadUsd}>` — effort `medium`; setter `sprak`, `emne_id` og `slug = slugify(artikkel.slug)` etter svaret.
- Produces: `granskArtikkel(klient, { artikkel, utdrag, sprakfil, mal }) -> Promise<{godkjent: boolean, grunn: string, kostnadUsd}>` — effort `low`.

- [ ] **Step 1:** Tester med falsk klient: `skribenten sender språkregler og utdrag i instruksen`, `slug normaliseres`, `gransker AVVIST gir godkjent=false med grunn`.
- [ ] **Step 2–4:** FAIL → implementer → PASS.
- [ ] **Step 5:** Commit `seo: skribent og gransker`.

### Task 7: Søkeordsfinner og emnekø

**Files:**
- Create: `seo-motor/sokeord.mjs`, `seo-motor/gsc.mjs`, `seo-motor/dataforseo.mjs`
- Test: `test/seo-sokeord.test.mjs`, fixtures `seo-motor/test/fixtures/{gsc,dataforseo}.json`

**Interfaces:**
- Produces: `hentGsc({ tjenestekonto, nettsted:'sc-domain:matlyst-app.no', fra, til }) -> Promise<{sokeord, land, visninger, plassering}[]>` (Search Analytics `searchanalytics.query`, dimensjoner `query,country`).
- Produces: `hentDataForSeo({ login, passord, frø, land, tak }) -> Promise<{sokeord, land, volum, vanskelighet}[]>` — kaster `TakNådd` før forespørsel nr. `tak+1`; land→sprak: `nor→nb, swe→sv, dnk→da, usa→en`.
- Produces: `byggKo({ kandidater, passform, nettsted, forbudt, grenser, brukt }) -> Emne[]` hvor `Emne = { id, sprak, sokeord, volum, vanskelighet, passform, tagger, poeng }`, `poeng = volum * passform * (1 - vanskelighet/100)`; forkast `passform===0`, `vanskelighet > grenser.vanskelighetMaks (35)`, forbudte ord, helseord, og søk med `ordOverlapp > 0.5` mot eksisterende tittel (legges i `styrkEksisterende[]`). Returnerer `{ ko: Emne[] (sortert synkende), styrkEksisterende }`. `id` = `slugify(sokeord)` + `-` + `sprak`.
- Produces: `vurderPassform(klient, kandidater, mal) -> Promise<Map<sokeord,{passform,tagger}>>` (ett kall, effort `low`).

- [ ] **Step 1:** Tester for `byggKo`: `poeng sorterer køen`, `forbudt merkenavn forkastes`, `for vanskelig forkastes`, `overlapp går til styrkEksisterende`, `GSC-plassering 8–30 tas med, 1–7 ikke`; for `hentDataForSeo`: `taket stopper før neste forespørsel` (falsk `fetch`).
- [ ] **Step 2–4:** FAIL → implementer → PASS.
- [ ] **Step 5:** Commit `seo: søkeordsfinner og emnekø`.

### Task 8: Velger og internlenker

**Files:**
- Create: `seo-motor/velg.mjs`, `seo-motor/lenker.mjs`
- Test: `test/seo-velg.test.mjs`

**Interfaces:**
- Produces: `velgEmne(ko: Emne[], publisert: {emne_id, sprak, dato}[]) -> Emne|null` — høyest poeng, ikke brukt, og språket har < 4 av de siste 7 publiseringene.
- Produces: `byggLenker(artikler: {slug, sprak, tagger, sti}[], ny: {...}) -> { nyLenker: {sti, tittel}[] (2–4), lesOgså: Map<slug, {sti,tittel}> }` — samme språk, flest felles tagger, deretter nyeste; pluss én fast app/guide-sti per `appkobling` fra språkfila (`appkoblingSti`).

- [ ] **Step 1:** Tester: `velger høyest poeng`, `hopper over brukt emne`, `femte nb på sju dager hoppes over`, `tom kø gir null`, `lenker bare til samme språk`, `maks fire lenker`.
- [ ] **Step 2–4:** FAIL → implementer → PASS.
- [ ] **Step 5:** Commit `seo: emnevalg og internlenker`.

### Task 9: Publisering i bloggen

**Files:**
- Modify: `scripts/blogg.mjs` (nye eksporter, `bloggGrupper`, `indeksMain`)
- Modify: `scripts/generer-norske-importguider.mjs:120-140` og `scripts/generer-lokalsider.mjs:835-845` (rendre auto-artikler + sidekart)
- Modify: `llms.txt`-genereringen (eller fila direkte hvis den er håndskrevet: legg til seksjon «Auto»-artikler bygd av `blogg.mjs`)
- Test: `test/seo-blogg.test.mjs`

**Interfaces:**
- Consumes: artikkel-JSON i `blogg-kilde/auto/<sprak>/<slug>.json` (Task 1-skjema + `lenker`, `lesOgså`, `publisert` dato).
- Produces: `autoArtikler(lang) -> { lang, path, title, description, auto: artikkel }[]`; `autoArtikkelMain(a, knapper) -> string`; `autoArtikkelSchema(a) -> object[]` (BreadcrumbList, Article med `datePublished`, FAQPage); `bloggGrupper()` får grupper `auto-<emne_id>` med bare språkene som finnes.
- Rendering: all modelltekst gjennom `esc()` (escaper `& < > " '`); seksjoner som `<h2>` + `<p>`/`<table class="blogg-tabell">`/`<ul>`; kilder som `<ol class="blogg-kilder">`; CTA via `appCta(lang, {appCtaTittel, appCtaTekst, bilde})` med tekst fra språkfila; `indeksMain` lister auto-artikler etter karusellene.

- [ ] **Step 1:** Tester (med fixture-artikkel skrevet til en midlertidig `blogg-kilde/auto` via injisert rot): `auto-artikkel får h1, seksjoner, faq og kilder`, `auto-artikkel escaper HTML i modellfelt` (`tittel: 'Ris <script>x</script>'` → ingen `<script>` i HTML), `FAQPage-schema har alle spørsmål`, `enspråklig auto-artikkel får ingen hreflang til andre språk`, `bloggforsiden lenker til auto-artikkelen`, `sidekartet for språket har auto-artikkelen`.
- [ ] **Step 2:** Kjør → FAIL.
- [ ] **Step 3:** Implementer; gi `autoArtikler` en valgfri `rot`-parameter for testen.
- [ ] **Step 4:** Kjør `node scripts/generer-norske-importguider.mjs && node scripts/generer-lokalsider.mjs && npm test` → alt PASS, og `git status` viser ingen endrede HTML-filer når `blogg-kilde/auto/` er tom (ingen regresjon).
- [ ] **Step 5:** Commit `seo: bloggen rendrer auto-artikler`.

### Task 10: Rapport

**Files:**
- Create: `seo-motor/rapport.mjs`
- Test: `test/seo-rapport.test.mjs`

**Interfaces:**
- Produces: `nattrapport(logg: { dato, modus, resultat, emne?, sti?, prUrl?, grunner?: string[], kostnadUsd }) -> string` (markdown, norsk, tekst fra `seo-data/sprak/nb.json` → `rapport`-nøkler).
- Produces: `ukerapport({ ytelse: {sti, visninger, klikk, plassering}[], ko: Emne[], kostnadUke }) -> string` (topp 10 i køen).
- Produces: `postRapport(tekst, { issueTittel: 'SEO-autopilot', gh: (args)=>Promise<string> })` — finner issuen med `gh issue list --search "SEO-autopilot in:title"`, lager den hvis den mangler, kommenterer med `gh issue comment`.

- [ ] **Step 1:** Tester: `natt med publisering viser lenke og kostnad`, `avvisning viser grunnene`, `sperre nevnes tydelig`, `ukerapport viser topp 10`, `postRapport lager issue når den mangler` (falsk `gh`).
- [ ] **Step 2–4:** FAIL → implementer → PASS.
- [ ] **Step 5:** Commit `seo: nattlig og ukentlig rapport`.

### Task 11: Orkestrering, tørrkjøring og workflow

**Files:**
- Create: `seo-motor/kjor.mjs`, `.github/workflows/seo-autopilot.yml`, `seo-motor/test/fixtures/tørt/` (lagrede API-svar)
- Test: `test/seo-kjor.test.mjs`

**Interfaces:**
- Consumes: alt over.
- Produces: `kjor({ tid, modus, tørt, avh }) -> Promise<Logg>` der `avh` = `{ gsc, dataforseo, hent, klient, gh, rot }` (ekte eller fra fixtures). Rekkefølge: modus `av` → returner; mandag → søkeordsfinner (skriver `emnekø.json`); `kanPublisere` → `velgEmne` → `hentUtdrag` (tom → `avvist`) → `skrivArtikkel` → `sjekkFast` → `granskArtikkel` → skriv `blogg-kilde/auto/...` + lenker + `publisert.json` + `seo-data/logg/<dato>.json`; avvist → `seo-data/avvist/<dato>-<slug>.json`; `skalSperre` → skriv `seo-data/sperre.json`. Kaster aldri ut av `kjor`: feil blir `resultat:'feil'` med grunn.
- CLI: `node seo-motor/kjor.mjs [--tørt]` skriver `seo-resultat.json` (`{resultat, modus, slug?}`) for workflowen.
- Workflow: `schedule: cron '0 3 * * *'` + `workflow_dispatch`; `permissions: contents: write, pull-requests: write, issues: write`; `concurrency: seo-autopilot`; steg: checkout → node 22 → `npm ci` → `node seo-motor/kjor.mjs` (env fra secrets + `vars.SEO_AUTOPILOT`) → rebuild (`node scripts/generer-norske-importguider.mjs && node scripts/generer-lokalsider.mjs`) → `npm test` → hvis `resultat=publisert` og modus `på`: commit `seo: <tittel> (autopilot)` og push til main; modus `utkast`: gren `seo-autopilot/<dato>` + `gh pr create`; alltid commit logg/avvist/sperre → rapport. Feil i `npm test` → ingen push av artikkelen, utkastet flyttes til `avvist/`.

- [ ] **Step 1:** Tester med fixtures: `av gjør ingenting`, `tørt i utkast skriver artikkel og logg uten nettverk`, `avvist fra vern skriver avvist-fil`, `tredje avvisning skriver sperre`, `feil i kilde gir resultat feil og ingen artikkel`, `ingen nye forsøk etter avvisning` (falsk klient kalt nøyaktig én gang for skriving).
- [ ] **Step 2–4:** FAIL → implementer → PASS. Kjør `node seo-motor/kjor.mjs --tørt` lokalt → `seo-resultat.json` med `resultat` satt, `git status` viser bare forventede filer; rydd dem etterpå.
- [ ] **Step 5:** Commit `seo: orkestrering og nattlig workflow (utkast)`.

### Task 12: Drift — nøkler og første ekte kjøring (krever Patrick)

**Files:**
- Modify: `SEO-SEARCH-CONSOLE.md` (tjenestekonto som bruker med lesetilgang)

- [ ] **Step 1:** Be Patrick (valgkort) om ja til: DataForSEO-konto (forhåndsbetalt, minste påfyll), egen Anthropic-nøkkel `matlyst-landing-seo` med forbrukstak $10/mnd, Google-tjenestekonto med lesetilgang i Search Console.
- [ ] **Step 2:** Legg inn secrets `GSC_SERVICE_ACCOUNT_JSON`, `DATAFORSEO_LOGIN`, `DATAFORSEO_PASSWORD`, `ANTHROPIC_API_KEY_LANDING` og variabelen `SEO_AUTOPILOT=utkast` (`gh secret set` / `gh variable set`). Ingen nøkler fra `.env.local`.
- [ ] **Step 3:** Kjør `gh workflow run seo-autopilot.yml` én gang manuelt. Forventet: én PR `seo-autopilot/<dato>` eller en rapportkommentar med avvisningsgrunn; kostnad i rapporten < $0.10.
- [ ] **Step 4:** Kontroller PR-en (språk, fakta mot kilder, rendering på telefonbredde) og rapporter til Patrick. Start 14-dagersperioden.

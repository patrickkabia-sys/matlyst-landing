# Gratis og lokal SEO-autopilot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Erstatt den betalte, LLM-drevne Actions-autopiloten med gratis emnefunn, kryptert privat tilstand, offentlige bestillinger og lokal, hashbundet levering.

**Architecture:** Actions samler GSC/autocomplete i `privat.enc`, velger deterministisk og skriver én tillatelseslistet bestilling. Lokal hovedøkt skriver artikkelen, en separat kontrollør lager hashbundet gransking, og `lever.mjs` kjører kilder og faste vern før bloggkilden oppdateres. Offentlige data går gjennom én skriveport; privat data går gjennom én AES-256-GCM-modul.

**Tech Stack:** Node 22 ESM, `node:test`, `node:crypto`, eksisterende `zod` og `google-auth-library`, GitHub Actions og `gh`; ingen nye avhengigheter.

**Spec:** `docs/superpowers/specs/2026-11-11-seo-autopilot-design.md`

## Global Constraints

- Semikolon i JavaScript; ingen nye avhengigheter og ingen nettverk i tester.
- Ingen hardkodet brukertekst i `.mjs`; meldinger og maler ligger i `seo-data/sprak/*.json`.
- Ingen betalte datakilder, modellnøkkel eller LLM-kall i Actions.
- Offentlige logger/filer må aldri inneholde søkeord, klikk, visninger eller score.
- Feil gir stabile status-/grunnkoder, aldri rå feiltekst på stdout/stderr eller i issue.
- Maks én bestilling per Oslo-døgn, språkandel maks 4/7, sperre etter tre avvisninger.
- TDD for alle atferdsendringer; hver ny test skal observeres rød før implementasjon.
- Ingen push.

## Review Focus

1. Endret artikkel etter gransking må gi `gransking-gjelder-annen-versjon` og exit 1 — Task 4-test.
2. Feil nøkkel/ødelagt eller fremtidig privat konvolutt må aldri gi tom ny tilstand — Task 1-test.
3. Særpregede fixture-søkeord må ikke finnes i stdout/stderr eller noen offentlig JSON — Task 5-test.
4. To mandagskjøringer må ikke kalle samme autocomplete-frø mer enn én gang i privat mandagsstatus — Task 3-test.
5. Workflowen må statuscommitte med nøyaktig én pull/rebase og aldri bygge, teste, publisere eller lage PR — Task 5-test.

---

### Task 1: Kryptert privat tilstand og nøkkelhenting

**Files:**
- Create: `seo-motor/privat.mjs`, `seo-motor/vis-privat.mjs`, `seo-motor/test/fixtures/seo-data-nokkel.txt`
- Test: `test/seo-privat.test.mjs`

**Interfaces:**
- `tomPrivatTilstand() -> { emneko, gsc, forslag, ytelse, forslagKjoringer }`.
- `krypterPrivat(data, nokkel, tilfeldig?) -> envelope`, `dekrypterPrivat(envelope, nokkel) -> data`.
- `lesPrivat(fil, nokkel)`, der manglende fil gir tom tilstand og alle integritets-/versjonsfeil kaster `PrivatTilstandFeil('privat-tilstand-ugyldig')`.
- `skrivPrivat(fil, data, nokkel)` bruker ny 12-byte IV.
- `lesSeoDataNokkel({ tørt, tillatNokkelring, miljø })` validerer eksakt 32 dekodede byte og bruker fixture/keychain etter reglene.

- [ ] Skriv tester for rundtur, ulik IV, feil nøkkel, ødelagt fil, ukjent versjon, manglende fil og manglende nøkkel.
- [ ] Kjør `node --test test/seo-privat.test.mjs`; forvent rødt fordi modul mangler.
- [ ] Implementer minimal modul og lokal visnings-CLI.
- [ ] Kjør måltest og `npm test`; forvent grønt.

### Task 2: Tillatelseslistet offentlig tilstand og sikker rapport

**Files:**
- Create: `seo-motor/offentlig.mjs`
- Modify: `seo-motor/filer.mjs`, `seo-motor/rapport.mjs`, `seo-data/sprak/nb.json`
- Test: `test/seo-offentlig.test.mjs`, `test/seo-rapport.test.mjs`

**Interfaces:**
- `skrivOffentlig(rot, type, filnavn, data)` og `validerOffentlig(type, data)` med dokumenttypene `publisert`, `logg`, `avvist`, `bestilling`, `sperre`.
- Rekursiv kontroll av tillatte nøkler; søkedatafeltene avvises i alle dokumenter.
- `nattrapport`/`ukerapport` viser bare status, id/slug, PR, grunnkoder og antall.

- [ ] Skriv røde tester som avviser søkedata i alle offentlige typer og som viser at rapporter ikke gjengir privat innhold.
- [ ] Implementer tillatelseslisten og sikker rapporttekst fra språkfilen.
- [ ] Kjør måltestene og `npm test`; forvent grønt.

### Task 3: Gratis emnefunn og offentlige bestillinger

**Files:**
- Create: `seo-motor/forslag.mjs`
- Modify: `seo-motor/sokeord.mjs`, `seo-motor/kjor.mjs`, `seo-motor/gsc.mjs`, `seo-motor/skjema.mjs`, `seo-motor/velg.mjs`, `seo-data/sprak/*.json`, `seo-data/grenser.json`, fixtures/tests
- Delete: eldre nettverks-, skrive- og granskingsmoduler, gammel frø-/køtilstand, passforminstruks, tilhørende fixtures og tester

**Interfaces:**
- `hentForslag({ språkfil, hent })` gjør ett kall per frø uten retry og returnerer rå svar/kandidater eller `ForslagFeil('forslag-feil', httpStatus)`.
- `byggKo` bruker deterministisk frømetadata og `score = passform * proxy`; GSC-proxy er visninger, forslag-proxy er antall forslag fra frøsvaret.
- `lagBestilling(emne, språkfil, grenser, dato)` returnerer nøyaktig bestillingsskjemaet uten råsøk/måledata.
- `kjor` leser/skriver privat tilstand, respekterer døgn/språk/sperre og skriver offentlig bestilling/logg.

- [ ] Skriv røde tester for URL-parametre, ett kall per frø, `forslag-feil`, scoreformel, generalisert bestilling og manglende aktiv nøkkel.
- [ ] Implementer autocomplete, deterministisk kø og bestilling; flytt 8–12 frø med metadata til hver språkfil.
- [ ] Fjern betalt datakode, LLM-kode, avhengighet, fixtures og tester; behold `skriv.md`/`gransk.md` som lokale sjekklister.
- [ ] Kjør måltestene og `npm test`; forvent grønt.

### Task 4: Hashbundet lokal levering

**Files:**
- Create: `seo-motor/lever.mjs`, `seo-data/instrukser/lokal-lokke.md`, leveringsfixtures
- Modify: `seo-motor/kilder.mjs`, `seo-motor/skjema.mjs`, `seo-motor/vern.mjs`, `seo-motor/lenker.mjs`
- Test: `test/seo-lever.test.mjs`

**Interfaces:**
- `artikkelSha256(fil) -> 64 hex` hasher eksakte filbytes.
- `lever({ bestillingFil, artikkelFil, granskingFil, rot, nokkel, hent, tid }) -> { exitCode, statuskode, slug? }`.
- Godkjent: hent tillatte kilde-ID-er, `sjekkFast`, gransking/hash, bloggkilde, publisert/logg/private queue, slett bestilling.
- Avvist: offentlig avvist/logg/sperre, behold bestilling, skriv grunner lokalt, exit 1. Ugyldig input gir exit 2.

- [ ] Skriv røde tester for manglende/avvist gransking, kilde/fast vern, grønn levering og én-tegnsendring etter gransking.
- [ ] Implementer levering og lokal-løkke-instruks; kontrolløren beskrives som ny Opus-agent uten skrivekontekst.
- [ ] Kjør måltestene og `npm test`; forvent grønt.

### Task 5: Workflow, personvernintegrasjon og dokumentasjon

**Files:**
- Modify: `.github/workflows/seo-autopilot.yml`, `seo-motor/rapport.mjs`, `test/seo-kjor.test.mjs`
- Delete: eldre etterbehandlingsmodul og tilhørende test
- Modify: denne planen og specen for endelig samsvar

**Interfaces:**
- Workflow: modusvakt, Node/install, motor, statuscommit av `seo-data`, én pull/rebase, push, issue-rapport; permissions bare contents/issues write.
- CLI-logger: bare antall, id/slug og koder.

- [ ] Skriv røde underprosesstester med særpregede søkeord som kontrollerer stdout/stderr og alle offentlige JSON-filer etter motor + levering.
- [ ] Skriv røde workflowtester for manglende hemmelighet, fravær av build/test/publish/PR og én rebase.
- [ ] Implementer workflow/CLI-rapport, fjern død etterbehandling og oppdater dokumentasjonen.
- [ ] Kjør `npm test`, `node seo-motor/kjor.mjs --tørt` uten miljø og tørr `lever.mjs` med fixtures; rydd genererte filer.
- [ ] Verifiser slettede filer, avhengigheter, `git diff --check` og ren `git status --short` etter commits.

### Task 12: Drift — to hemmeligheter og modus

**Krever Patrick:**

- [ ] Legg GSC-tjenestekontoen med lesetilgang inn som GitHub-hemmeligheten `GSC_SERVICE_ACCOUNT_JSON`.
- [ ] Generer en tilfeldig 32-byte nøkkel i base64, legg den inn som GitHub-hemmeligheten `SEO_DATA_NOKKEL`, og lagre samme verdi lokalt i macOS-nøkkelringen med tjenestenavnet `matlyst-seo-data`. Nøkkelen skal ikke lagres i repoet eller gis som CLI-argument.
- [ ] Sett startmodus med `gh variable set SEO_AUTOPILOT --body utkast`.
- [ ] Start workflowen manuelt én gang og kontroller at bare `seo-data` statuscommittes, og at issuen viser driftsfelt og antall uten søkedata.

## Commit-struktur

1. `seo: krypter privat og begrens offentlig autopilotdata` (Task 1–2).
2. `seo: gjør autopiloten gratis med lokal levering` (Task 3–5 kode og sletting).
3. `docs: beskriv gratis lokal SEO-autopilot` (spec, plan og lokal løkke hvis den ikke følger leveringskoden).

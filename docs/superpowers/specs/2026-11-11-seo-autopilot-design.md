# SEO-autopilot for matlyst-app.no — design

Dato: 11.11.2026. Endret 12.11.2026 etter ny retning fra Patrick.

## Mål

Autopiloten skal finne relevante matemner gratis og forberede én offentlig bestilling per Oslo-døgn. GitHub Actions bruker Search Console og Googles søkeforslag, men skriver aldri artikler og gjør ingen LLM-kall. Artiklene skrives og granskes lokalt av separate agenter før `lever.mjs` legger et godkjent resultat i bloggkilden.

Repoet er offentlig. Søkeord, klikk, visninger, score, rå forslag og rå API-data skal derfor bare ligge kryptert i `seo-data/privat.enc`. Offentlige filer og jobb-/issue-logger inneholder bare driftsfelt.

## Vedtak

| Spørsmål | Vedtak |
|---|---|
| Pris | Gratis: ingen betalte datakilder, modellnøkkel eller LLM-kall i Actions |
| Emnefunn | Search Console og Google autocomplete, bare mandager |
| Tempo | Høyst én bestilling per Oslo-døgn; språkbalanse maks 4 av de siste 7 |
| Actions | Oppdaterer privat kø, velger emne, skriver bestilling, statuscommitter og rapporterer |
| Lokal løkke | Claude-hovedøkta skriver; en ny Opus-kontrollør uten skrivekontekst gransker; `lever.mjs` avgjør |
| Publisering | `lever.mjs` publiserer ikke; hovedøkta lager PR i `utkast` eller committer til `main` i `på` |
| Stopp | `SEO_AUTOPILOT=av` avslutter umiddelbart; sperre tvinger `på` til `utkast` |

## Emnefunn og kø

Hvert språk har 8–12 innfødte matfrø i `seo-data/sprak/<kode>.json`. Mandager gjør motoren høyst ett kall per frø til:

`https://suggestqueries.google.com/complete/search?client=firefox&hl=<hl>&gl=<gl>&q=<frø>`

Det finnes ingen retry-løkke. HTTP- eller formatfeil får statuskoden `forslag-feil`. Search Console leser de siste 28 dagene per land som før. Kandidater kobles deterministisk til frømetadata med passform, tagger og tillatt appkobling; navngitte matsider og helse-, slanke- og allergiemner forkastes.

**Score = passform × proxy.** For GSC er proxy antall visninger. For autocomplete er proxy antall forslag i svaret fra frøet som ga kandidaten. Ingen volum- eller vanskelighetsdata finnes. Den rå kandidaten, score, rå GSC-rader og rå forslag lagres bare i den private tilstanden.

## Bestillinger

Motoren velger høyest score som ikke er brukt, respekterer maks 4 av de siste 7 på samme språk og skriver `seo-data/bestillinger/<dato>-<sprak>-<slug>.json`. Bestillingen har bare:

- `dato`, `sprak`, `emne_id`, `slug`;
- `emne` og `vinkel`, generalisert med én språkspesifikk mal fra frømetadata og aldri kopiert fra råsøket;
- `appkoblinger`, `kilde_ider` og `krav` med ord-, seksjons-, FAQ- og språkregelkrav.

Den inneholder aldri søkeord, klikk, visninger, score eller andre måledata.

## Lokal levering

`node seo-motor/lever.mjs <bestilling.json> <artikkel.json> --gransking <gransking.json>` har to lag:

1. Offisielle kilder angitt i bestillingen hentes og knyttes til artikkelens `kilder`; deretter kjøres `vern.mjs`/`sjekkFast` mot nettstedet.
2. En gransking med `beslutning`, `grunner` og `artikkel_sha256` må være godkjent. Hashen er SHA-256 av artikkelfilens eksakte byteinnhold da den ble gransket. Endres filen, blir grunnkoden `gransking-gjelder-annen-versjon`.

Godkjent levering skriver `blogg-kilde/auto/<sprak>/<slug>.json` med publiseringsdato, oppdaterer `publisert.json` og dagens logg, oppdaterer den private køen og sletter bestillingen. Avvist levering skriver utkastet under `seo-data/avvist/`, oppdaterer logg og sperrer etter tre avvisninger på rad. Exit-koder er 0 levert, 1 avvist og 2 ugyldig inndata.

## Offentlig og privat tilstand

`seo-motor/offentlig.mjs` er eneste skriveport for `publisert.json`, `logg/`, `avvist/`, `bestillinger/` og `sperre.json`. En dokumenttype-spesifikk tillatelsesliste avviser ukjente felt. Avviste utkast kan inneholde artikkeltekst og lokale granskingsgrunner, men aldri søkedata.

`seo-data/privat.enc` er AES-256-GCM-kryptert med en 32-byte base64-nøkkel fra `SEO_DATA_NOKKEL`. Hver skriving bruker ny tilfeldig 12-byte IV. Konvolutten lagrer versjon, IV, auth-tag og chiffertekst. Feil nøkkel, ødelagt fil eller ukjent versjon gir `privat-tilstand-ugyldig`; tilstanden nullstilles aldri. Manglende fil betyr tom kø. Aktiv modus uten nøkkel nektes.

Lokalt henter `lever.mjs` og `vis-privat.mjs` nøkkelen fra miljøet eller macOS-nøkkelringen (`security find-generic-password -s matlyst-seo-data -w`). Nøkkelen tas aldri som CLI-argument. `--tørt` bruker fixture-nøkkelen.

## Logger og rapport

Stdout/stderr viser bare antall, slug/bestillings-id og statuskoder. De viser aldri søkeord, klikk, visninger, score eller rå feilmeldinger. Issue-rapporten viser bare status, slug eller bestillings-id, eventuell PR-lenke, grunnkoder og antall; ukesrapporten får kun antall ytelsesrader fra den private tilstanden. `vis-privat.mjs` er den lokale veien til kø og full ytelse.

## Workflow og drift

Workflowen beholder cron, manuell start, concurrency, moduslesing og `contents: write`/`issues: write`. `av` avslutter før Node-oppsett. Aktiv kjøring krever `GSC_SERVICE_ACCOUNT_JSON` og `SEO_DATA_NOKKEL`, kjører motoren, committer bare `seo-data` til `main`, gjør én `git pull --rebase` før push og rapporterer i issuen. Den bygger, tester, publiserer eller oppretter ikke PR-er.

Task 12 består av GSC-tjenestekontoen, `SEO_DATA_NOKKEL` som GitHub-hemmelighet og lokalt nøkkelringselement, samt `gh variable set SEO_AUTOPILOT --body utkast`.

## Grenser og testing

Ukesgrensen på artikler og sperre etter tre avvisninger består. Betalingsgrenser og kostnadsrapportering er fjernet. Tester bruker fixtures og aldri nettverk. Obligatorisk sluttkontroll er `npm test`, `node seo-motor/kjor.mjs --tørt` uten miljøvariabler og en tørr `lever.mjs`-kjøring med fixtures.

# SEO-autopilot for matlyst-app.no — design

Dato: 11.11.2026. Godkjent i brainstorming med Patrick (alle fem deler).

## Mål

En egen, billig variant av Soro (trysoro.com) for matlyst-app.no. Motoren finner søk folk faktisk gjør i Norge, Sverige, Danmark og USA, skriver én nyttig artikkel per døgn på riktig språk, kontrollerer den og publiserer den selv. Målet er organisk trafikk fra Google og KI-søk som blir til nedlastinger av appen.

**Suksess:**
- Etter 14 dager i `utkast`: minst 10 av 14 utkast godkjent av vernet, og Claudes stikkprøver finner ingen faktafeil og ingen tekst som høres oversatt ut.
- Etter 8 uker i `på`: auto-artiklene har visninger i Search Console i minst tre av fire land. Hvis ikke, stoppes motoren eller kursen legges om. Den skaleres ikke opp på håp.

## Vedtak

| Spørsmål | Vedtak |
|---|---|
| Automatisering | Autopilot med vern. Publiserer selv når vernet er grønt og gir en daglig rapport. **Uttrykkelig unntak** fra regelen om at hvert offentlige steg krever Patricks ja. Unntaket gjelder bare auto-artikler i `/blogg/`-rotene, og bare etter at Patrick har sagt ja til å gå fra `utkast` til `på`. |
| Søkedata | Search Console (gratis) + DataForSEO (betaling per kall) |
| Tempo | Én artikkel per døgn, fordelt på alle fire språk |
| Omfang | Nye artikler + internlenker mellom auto-artikler. Håndskrevne sider røres ikke. |
| Kjøremiljø | GitHub Actions i matlyst-landing (offentlig repo, derfor $0 i minutter) |
| Modell | Haiku 5.5 både som skribent og som gransker (Matlysts regel: Haiku på alt) |
| Kostnadstak | Rundt $10 per måned totalt, med hardt tak i koden for DataForSEO |

## Oppbygging

Alt nytt ligger i `seo-motor/` (kode) og `seo-data/` (tilstand og regler). Enhetene snakker sammen bare gjennom filer i repoet.

| Enhet | Fil | Leser | Skriver |
|---|---|---|---|
| Søkeordsfinner | `seo-motor/sokeord.mjs` | Search Console API, DataForSEO, `sitemap.xml` | `seo-data/emnekø.json` |
| Velger | `seo-motor/velg.mjs` | emnekøen, `seo-data/publisert.json` | dagens emne (ett) |
| Kildehenter | `seo-motor/kilder.mjs` | `seo-data/kilder.json` (tillatte domener per land) | kildeutdrag for emnet |
| Skribent | `seo-motor/skriv.mjs` | emnet, `seo-data/sprak/<kode>.json`, kildeutdrag | `blogg-kilde/auto/<kode>/<slug>.json` |
| Vern | `seo-motor/vern.mjs` | utkastet og hele nettstedet | godkjent eller avvist, med grunn |
| Publisering | `scripts/blogg.mjs` (utvidet) | `blogg-kilde/auto/**` | HTML, sidekart, bloggforside, `llms.txt` |
| Internlenker | `seo-motor/lenker.mjs` | emnetagger for alle auto-artikler | lenkeblokker i auto-artiklenes JSON |
| Rapport | `seo-motor/rapport.mjs` | dagens logg, Search Console | kommentar i GitHub-issuen «SEO-autopilot» |
| Orkestrering | `seo-motor/kjor.mjs` | `SEO_AUTOPILOT`, ukedag | kaller enhetene i rekkefølge |

**Kjøring:** `.github/workflows/seo-autopilot.yml` kjører hver natt kl. 03:00 UTC (04:00 norsk vintertid) og kan også startes manuelt (`workflow_dispatch`). Søkeordsfinneren kjører bare mandager.

**Tilstand:** Bare i git: `seo-data/emnekø.json`, `seo-data/publisert.json`, `seo-data/avvist/`, `seo-data/logg/<dato>.json`. Motoren har ingen database og ingen tilgang til appens prod.

**Hemmeligheter** (GitHub-secrets i matlyst-landing):
- `GSC_SERVICE_ACCOUNT_JSON`: tjenestekonto som bare har lesetilgang til Search Console-eiendommen matlyst-app.no.
- `DATAFORSEO_LOGIN`, `DATAFORSEO_PASSWORD`.
- `ANTHROPIC_API_KEY_LANDING`: en egen nøkkel med eget forbrukstak, atskilt fra appens nøkkel.
- `GITHUB_TOKEN` (innebygd) med `contents: write`, `pull-requests: write`, `issues: write`.

**Stoppbryter:** Repo-variabelen `SEO_AUTOPILOT`:
- `av`: jobben avslutter med en gang.
- `utkast`: skriver, kjører vernet og lager en PR. Publiserer ikke.
- `på`: commit direkte til main når vernet er grønt.

Startverdi: `utkast`.

## Søkeord og valg av emne

**Kilder (mandager):**
1. Search Console: søk de siste 28 dagene per land (NO/SE/DK/US) der snittplasseringen er 8–30, eller der søket ikke har en egen side.
2. DataForSEO: søkeordforslag ut fra frølista per språk i `seo-data/frø.json`. Temaene er middagsideer, rester, oppbevaring, omregning, handleliste, ukemeny, airfryer og kjøkkentips. Vi henter månedlig volum og vanskelighetsgrad per land. Hardt tak: maks antall forespørsler per uke settes i `seo-data/grenser.json`, og kjøringen stopper når taket er nådd.

**Poeng** = volum × passform (0–3) × vinnbarhet.
- Passform: Haiku gir karakterer til søkene i én samlet forespørsel per uke, ut fra om søket naturlig kan ende i en appfunksjon. 0 forkastes.
- Vinnbarhet: 1 − vanskelighetsgrad/100. Søk over grensen i `grenser.json` hoppes over.

**Filtre før søket kommer i køen:**
- Søk eller tekst som nevner matprat, godt.no, nom eller andre navngitte matsider fra `seo-data/forbudt.json` forkastes.
- Søk med samme intensjon som en eksisterende side (ordoverlapp mot titler og slugger over terskel) får ikke ny artikkel. De logges som «styrk eksisterende», og det gjøres ingenting automatisk med dem.
- Helse-, slanke- og allergiemner forkastes (ordliste per språk i `forbudt.json`).

**Valg hvert døgn:** Emnet med høyest poeng som ikke er brukt. Samme språk får maks 4 av de siste 7 publiseringene. Er køen tom, publiseres ingenting, og det står i rapporten.

## Skriving og språk

**Artikkelformat (JSON):** `sprak`, `slug`, `tittel`, `meta`, `ingress`, `seksjoner[]` (type `avsnitt` | `tabell` | `liste`), `faq[]` (3–5), `kilder[]`, `appkobling`, `tagger[]`, `pastander[]` (hver påstand med `kilde_id`). Brødteksten er 600–1 200 ord. Svaret på søket står i ingressen. Det skal ikke være fyllprosa.

**Ikke oversatt:** Hver artikkel skrives direkte på ett språk, ut fra emnet og søket i landet. Språkreglene ligger i `seo-data/sprak/<nb|sv|da|en>.json`: stemme, ord som skal unngås, typografi og mål (en-US: °F, cups, amerikanske ord). Reglene er hentet fra matlyst-sprak-skillen og Henriettes danske ordvalg. Ingen tekst eller modellinstruks er hardkodet i `.mjs`-filene; instruksmalene ligger i `seo-data/instrukser/`.

**Fakta:** `kilder.mjs` henter de relevante sidene fra tillatte kilder i `seo-data/kilder.json` (Mattilsynet, Matvaretabellen, Livsmedelsverket, Fødevarestyrelsen, USDA/FSIS, FDA). Ut fra dem lages nummererte utdrag. Hvert tall og hvert råd om mattrygghet i artikkelen skal stå i `pastander[]` og peke på et utdrag. Kildene vises nederst i artikkelen.

**App-kobling:** én av fem faste verdier: `import`, `ukemeny`, `handleliste`, `bruk-det-jeg-har`, `kokemodus`. CTA-teksten hentes fra språkfilene og vises med `app-cta.mjs`.

**KI-søk:** svaret står først, artikkelen har FAQPage- og Article-schema (med `datePublished` og kilder) og `llms.txt` lister alle artiklene.

**Bilder:** Ingen i første versjon. Hvert språk har ett felles delingsbilde.

## Vern

Vernet har to lag. Hvis én sjekk feiler, publiseres ingenting den natten. Utkastet lagres i `seo-data/avvist/<dato>-<slug>.json` med en grunn. **Ingen nye forsøk** samme natt.

**Lag 1: faste sjekker**
1. Skjemaet stemmer, og alle lengder er innenfor grensene.
2. Tittel (maks 60 tegn) og meta (120–160 tegn) er unike på nettstedet.
3. Slug-en er ny, og artikkelen er ikke for lik noen eksisterende side (ordoverlapp under terskel).
4. Ingen forbudte domener eller navn fra `forbudt.json`. Alle interne lenker peker på sider som finnes.
5. Hver post i `pastander[]` har et `kilde_id` som finnes, og hvert tall i brødteksten finnes i en påstand.
6. Språkgjenkjenning stemmer med `sprak`. en-US-tekster inneholder ingen britiske ord fra ordlista.
7. Ingen helse-, slanke- eller allergiord.

**Lag 2: Haiku-gransker** (en separat forespørsel, med instruks om å avvise ved tvil)
- Høres teksten innfødt ut, eller avslører den kalkering eller oversettelse?
- Stemmer hver påstand med utdraget den peker på?
- Er teksten nyttig for den som søker, eller er det tynn fyll?
- Svaret er `GODKJENT` eller `AVVIST: <grunn>`. Granskeren foreslår ingen rettinger, så det blir ingen fiksrunde.

**Bremser:**
- Maks én publisering per døgn, håndhevet i `kjor.mjs` mot `publisert.json`.
- 3 avvisninger på rad: motoren committer `seo-data/sperre.json` som tvinger `utkast` uansett variabel (GITHUB_TOKEN kan ikke endre repo-variabler), og varsler i rapporten. Sperren fjernes manuelt.
- De første 14 dagene: `utkast`. Etterpå legger Claude fram tallene, og Patrick sier ja før den settes til `på`.

## Publisering og internlenker

- `blogg.mjs` leser i tillegg `blogg-kilde/auto/**` og bruker samme mal, adresserøtter (`BLOGGROT`), hreflang (der samme emne finnes på flere språk), sidekart og bloggforside som dagens artikler.
- I `på` committer motoren til main med meldingen `seo: <tittel> (autopilot)`. I `utkast` lager den en PR fra grenen `seo-autopilot/<dato>`.
- `lenker.mjs` gir hver ny artikkel 2–4 lenker til beslektede auto-artikler på samme språk (felles tagger) og én lenke til en app- eller guideside. Den legger også til «Les også» i eksisterende auto-artikler. Håndskrevne sider røres ikke.

## Rapport

En kommentar i den faste issuen «SEO-autopilot» i matlyst-landing. GitHub varsler Patrick om den.
- **Hver natt:** emne, språk, lenke til artikkel eller PR (eller avvisningsgrunn), tokens og kostnad.
- **Mandager:** visninger, klikk og plassering for auto-artiklene, de 10 øverste i køen og kostnad for uka.

## Feilhåndtering

- Feil i et API (Search Console, DataForSEO, Anthropic, en kilde): jobben avslutter uten publisering, og feilen står i rapporten. Ingen retry-løkke.
- Feil i bygget eller testene etter at artikkelen er lagt inn: ingen commit til main. Utkastet lagres i `avvist/`.
- En dårlig artikkel som har sluppet gjennom: `git revert` av autopilot-commiten, og slug-en føres i `forbudt.json` så den ikke skrives igjen.

## Testing

- Enhetstester med `node:test` for vernet (hver sjekk med testfiler som passerer og som feiler), velgeren (poeng, språkfordeling, tom kø), internlenkene og stoppbryteren. Testene kjører i den eksisterende `test.yml`.
- `node seo-motor/kjor.mjs --tørt`: hele løpet med lagrede API-svar fra `seo-motor/test/fixtures/`. Ingen nettverk og ingen commit.
- Én manuell kjøring i `utkast` via `workflow_dispatch` før cron-jobben slås på.

## Utenfor omfang (første versjon)

- Endring av titler, meta eller tekst på håndskrevne sider.
- Bilder per artikkel.
- Oppdatering av gamle auto-artikler, bortsett fra «Les også»-lenker.
- Andre språk enn nb/sv/da/en-US.

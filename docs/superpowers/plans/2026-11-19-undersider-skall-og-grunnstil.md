# Undersidene i nytt skall og ny grunnstil: byggeplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Alle indekserbare undersider på fire språk får sideskallet fra forsiden (topp, hyllemeny, bunn i tre lag, nedlasting) og en ny grunnstil for byggeklossene de alt har. Tekst, overskrifter, strukturerte data og adresser står urørt; det eneste innholdet som endres, er butikkmerkene i nedlastingsboksene (B1).

**Architecture:** Et nytt etterbehandlingsskript, `scripts/skall-paa.mjs`, rendrer skallet på nytt hver gang det kjøres: det leser gammel eller ny ramme, tar innholdet og sidens eget samtykkebanner med seg, og skriver rammen fra `scripts/skall.mjs`. Alle tekster i skallet har én eier, `scripts/skall-tekst.mjs`. Utseendet på innholdet ligger i `side.css` (bare tokens fra `tokens.css`). Utrullingen går sidetype for sidetype, styrt av settet `UTRULLET`; typer som ikke er rullet ut, oppfører seg nøyaktig som i dag.

**Tech Stack:** Statisk HTML, CSS og JavaScript uten byggesteg. Node 22 og `node --test`. Playwright (Chromium). GitHub Pages med Jekyll. GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-11-18-nettside-designsystem-design.md` (versjon 3) og tillegget `docs/superpowers/specs/2026-11-19-undersider-designnotat.md`. Prototypen for undersider er `docs/superpowers/prototyper/2026-11-18-omregner.html`: stilen fra `/* ===== Omregnersiden ===== */` er fasit for kalkulator, tabell, appkort, lesekolonne, spørsmål og piller. Kartet er `kart-undersider.md` og granskingen er `plan-undersider-codex-gransking.md`, i samme mappe. Les alt før første oppgave.

Dette er steg 3 i specens punkt 13, utvidet med grunnstilen fra designnotatet. Kalkulatoren øverst, «cups» i synlig omregnertekst og de seks nye kalkulatorene er et senere steg. Forsidene på svensk, dansk og engelsk er et eget løp; oppgave 20 venter på det.

**Forutsetning:** Planen `2026-11-18-forside-nb-og-sideskall.md` er merget til `main`, inkludert dens oppgave 9 (måling av `[data-hent]` i `site.js`) og rettingen av `scripts/skall.mjs` etter B2. I denne checkouten finnes ennå ikke `scripts/forside.mjs` eller `test/forside.test.mjs`. Oppgave 3, steg 0, kontrollerer de faktiske grensesnittene etter merge før noe bygges. Arbeid i et nytt arbeidstre fra `main`, uten æ, ø eller å i stien.

## Beslutninger

Bekreftet av Patrick 18.11.2026, med kontrollørens vedtak B1 til B6 og tilleggsvedtak samme dag. Patrick bekreftet B3 og publiseringsmåten 19.11.

1. **Form endres, innhold ikke.** Unntaket er B1. Ingen generator (N = `scripts/generer-norske-importguider.mjs`, L = `scripts/generer-lokalsider.mjs`) kjøres mot arbeidskopien. Tester som kjører dem i en midlertidig kopi (`test/seo-blogg.test.mjs`), står, og kjører hele etterbehandlingskjeden etterpå (oppgave 7).
2. **Skallet rendres av `skall-paa` hver gang.** To kjøringer gir like bytes, og en endring i skallfunksjonene når alle utrullede sider ved neste kjøring.
3. **Ett nytt stilark, `side.css`.** `styles.css` slettes først når forsidene sv, da og en er flyttet (B6, oppgave 20).
4. **Rekkefølge:** omregnere, lange og korte guider, eldre norske sider, blogg, juridiske sider, tjenestesider.
5. **Tre språk til i skallet.** Tekstene skrives av språkspesialisten fra meningen. Engelsk er amerikansk engelsk.
6. **Omregnerne beholder `form.omregner`** og får bare ny stil. Tallformatet fra `site.js` (`4.732`) endres ikke.
7. **Ingenting kan stoppes**, alt respekterer `prefers-reduced-motion`, ingen skrift eller skript fra en annen vert, ingen kronebeløp, ingen tankestrek som skilletegn i synlig tekst.
8. **Tester som låser den gamle rammen, oppdateres med vilje.** Egenskapen de vokter, voktes fortsatt.
9. **Hver oppgave ender med maskinsjekk og bilder.**
10. **Bygger og gransker** står på hver oppgave; den andre modellfamilien gransker.
- **B1.** Butikkmerkene i `.app-cta` og `.page-cta` (både `section` og eldre `div`) byttes med svart knapp `<a class="knapp" href="/app" data-hent="…">`. Lenkene til App Store og Google Play står i QR-vinduet. Avgrenset, idempotent omforming; resten av innholdet er byte for byte likt.
- **B2.** Skallet legger ingen overskrifter til. Hyllenavn er `<p class="faghode">`, QR-tittelen er `<p class="henttittel" id="hentTittel">`, og hver hylles `<ul>` har `aria-label` med hyllenavnet.
- **B3.** Guideblokka (`.f-guider`, eid av `scripts/guidelenker.mjs`) står i hylledelen, i en sammenfoldet `<details class="alle-guider">` med lokal «Alle guider». Bekreftet av Patrick 19.11.
- **B4.** Samtykkebanneret på undersidene beholder teksten siden har i dag, ordrett. `skall-paa` flytter sidens eget banner; bare stilen er ny. `samtykke(sprak)` brukes bare der en side laster `site.js` uten å ha banner.
- **B5.** Undersidene får fast nedlastingsknapp på mobil (erstatter `#dl-bar`). Ingen følgemeny. Knappen vises når sidens topp (helten) er rullet ut, og skjules før knappen i hylledelen kommer til syne.
- **B6.** `styles.css` slettes etter forsidene sv, da og en (eget løp).
- **Tekstene har én eier:** `scripts/skall-tekst.mjs` (`SKALLTEKST.nb|sv|da|en`).
- **Språkvelgeren** viser fulle navn (Norsk, Svenska, Dansk, English) i skallet og i L, med uendrede `aria-label`. Toppvelgeren ligger i menypanelet.
- **Måling:** klikk på `[data-hent]` og åpning av QR-vinduet måles av `site.js` gjennom samtykkestyrt `capture` (`download_click`, `cta_location`, `visning`). Hver plassering har egen `data-hent`-verdi. Sider uten `site.js` sender ingenting.
- **Overgang:** typer som ikke er rullet ut, virker som i dag, også om noen genererer dem på nytt. `app-uttrykk` behandler dem som før til siste type er flyttet (oppgave 19).

## Global Constraints

- Ingen adresse endres. Ingenting i innholdet endres utover B1. Innholdet er alt mellom `<!-- /skall:topp -->` og `<!-- skall:bunn -->`, eller på sider uten markører alt mellom første `</nav>` etter `<body` og første `<footer` etter det.
- `<head>` endres bare innenfor `<!-- skall:stil -->…<!-- /skall:stil -->`, ved fjerning av `<link rel="stylesheet" href="/styles.css">`, ved fjerning av den innebygde `<style>` med `@font-face` på de tre norske juridiske sidene, og ved at nøyaktig én `apple-touch-icon` sikres på sider med fullt skall.
- `/language-switcher.css`, `/language-switcher.js`, `/locale.js` og `/site.js` står der de står i dag. Ingen side som ikke har `site.js` i dag, får det. `locale.js` endres ikke; de enspråklige omregnerne som mangler det i dag, får det ikke.
- `side.css` og `tjeneste.css` bruker bare tilpassede egenskaper fra `tokens.css`. Ingen heksfarger og ingen `rgb(` uten `var(`. Skriftstørrelser i `side.css` skrives i `rem`, så nettleserens tekststørrelse virker.
- Ingen `style=`-attributter. Ingen forespørsel til en annen vert før samtykke.
- Brytpunkter 720 px og 1000 px. Lesekolonne maks 68 tegn, brødtekst 19 px (1,1875 rem) med linjeavstand 1,6, H2 26 til 34 px, seksjonsluft 112 px på PC og 72 px på mobil, kort `--hylle` med 32 px radius uten skygge.
- Ingen fliser, koder eller oransje i innholdet. Oransje bare i ordmerket og inne i appens egne flater.
- Trykkflater minst 44 px. Ingen sidelengs rulling på 360, 390, 768 og 1280 px.
- Ingen pauseknapp. Videoene fra `app-bevis` har `controls` i HTML-en, som `site.js` fjerner når filmen spiller av seg selv. Ved redusert bevegelse og uten JavaScript står filmen stille, og `controls` er da en startknapp. Dette endres ikke.
- Ett predikat avgjør om en side er rullet ut: `erUtrullet(sti, html)` i `scripts/sidetyper.mjs`, på utrullingsnøkler (sidetype, eller `tjeneste:<familie>`). Rendereren, vaktene, `app-uttrykk` og revisjonen bruker bare det.
- `data-hent`-verdier på undersider: `topp`, `bunn`, `fast` (skallet), `app-cta`, `side-cta`, `helt` (innholdet). Ingen andre.
- Svensk, dansk og engelsk tekst inneholder ingen av de norske restordene `test/locale-pages.test.mjs` forbyr.
- `npm test` og `npm run test:e2e` er grønne før hver commit.

## Review Focus

1. **En generator kjøres etter `skall-paa`**, for eksempel L, som alltid skriver `/en/delete-account/`. Forventet: siden er brukbar med gammel ramme (fordi `app-uttrykk` fortsatt behandler den hvis typen ikke er rullet ut), og CI blir rødt med «kjør: node scripts/skall-paa.mjs» hvis typen er rullet ut. (Oppgave 7a og 7b)
2. **JavaScript er blokkert.** Hyllene og «Alle guider» i bunnen står åpne eller kan åpnes uten skript, alle nedlastingsknapper er lenker til `/app`, innholdsfortegnelsen står åpen. (Oppgave 2b)
3. **Forstørret tekst.** Nettleserens standard skriftstørrelse på 32 px og zoom til 200 % og 400 %: ingen sidelengs rulling, ingen tekst utenfor sin boks, ingen tekst oppå annen tekst. (Oppgave 2a og 2b)
4. **Ankerlenker under klebrig topp.** Overskriften står synlig under toppen etter et trykk i innholdsfortegnelsen. (Oppgave 11)
5. **Tokenbærende sider.** Avmelding, bekreftelse, TikTok-auth og vervekort får aldri `site.js`, `skall.js`, samtykkebanner eller `data-hent`. (Oppgave 16 og 17)

---

## Hva som kan gå galt

Kartets punkt 8(b) nevner tre ting. Slik håndterer planen dem:

1. **Delt sannhetskilde.** Planen rører ingen innholdskilde. `skall-paa` leser den ferdige fila, uansett hvilken generator som skrev den sist, og en test sammenligner hver utrullet fil med `rendre(fil)`. Typer som ikke er rullet ut, får fortsatt gammel behandling av `app-uttrykk`, så en regenerering mens utrullingen pågår gir en side som virker som i dag.
2. **Strengbasert sammenkobling.** `skall-paa` eier bare sine egne kommentarpar. Guideblokka har en avtalt plass (`<!-- guider:plass -->`) som `guidelenker.settInn()` kjenner, og begge kjørerekkefølger testes. Banneret og `site.js` gjenkjennes strukturelt (balanserte `div`-er, `src` uavhengig av andre attributter), ikke med eksakte strenger. Alle sider kjøres gjennom `rendre` i minnet i hver testkjøring.
3. **Ulike skall og tekniske unntak.** Hver fil får én sidetype. Tjenestesidene forgrenes før rammen letes etter, og hver tjenestefamilie får egen oppgave. Vervekortene behandles bare gjennom sin generator. Egne tester vokter at tokenbærende sider ikke får analyse eller skall.

---

## Filstruktur

| Fil | Ansvar |
|---|---|
| `scripts/sidetyper.mjs` | Sidetype og utrullingsnøkkel per fil, `erUtrullet`, liste over publiserbare sider, eksempelsider, `UTRULLET`. |
| `scripts/kjedeproeve.mjs` | Kjører etterbehandlingskjeden i en midlertidig kopi og sammenligner. |
| `scripts/skall-tekst.mjs` | Alle tekster i skallet og butikklenkene, per språk. Eneste eier. |
| `scripts/hyller.mjs` | Hylledata. `HYLLETEKST` og `lokaliserHyller`; `HYLLER.sv/da/en` avledes. |
| `scripts/skall.mjs` | HTML for skallet. Leser tekst fra `skall-tekst.mjs`. `sprakvelger` brukes også av L. |
| `scripts/skall-paa.mjs` | Uttrekk, B1-omforming og rendering. Eneste skript som skriver skallet på undersider. |
| `scripts/guidelenker.mjs` | Får plassen `<!-- guider:plass -->` i `settInn`. |
| `scripts/generer-lokalsider.mjs` | `medSprakvelgere` bruker `sprakvelger` fra `skall.mjs`. Ingen annen endring. |
| `scripts/app-uttrykk.mjs` | Hopper over utrullede typer; krymper til forsidene sv, da, en i oppgave 19. |
| `side.css` | Ny stil for byggeklossene i innholdet. |
| `tjeneste.css` | Grunnlag for de smale tjenestesidene, per familie. |
| `skall.js` | To nye deler: startsignal for fast knapp på undersider, innholdsfortegnelse som foldes på mobil. |
| `test/playwright/hjelp/revisjon.mjs`, `test/playwright/revisjon-motor.spec.mjs` | Revisjonsmotoren og dens selvtester. |
| `test/playwright/revisjon.spec.mjs`, `test/playwright/hjelp/utvalg.mjs` | Revisjonen per side: felles kontroller, forstørret tekst, fullt skall, skjermbilder. |
| `.github/workflows/revisjon.yml` | Full revisjon, delt per type og språk. |
| `test/hjelp/klassedekning.mjs`, `test/hjelp/overskrifter.mjs`, `test/hjelp/lokalsider-kilde.mjs`, `test/hjelp/restord.mjs` | Delte testhjelpere. |
| `test/fixtures/skall-paa/*.html.fiks` | Gamle sider som fiksturer. Endelsen `.fiks` gjør at etterbehandlerne (som skanner etter `.html`) ikke rører dem. |
| `qa/skjermbilder/`, `qa/forhandsvisning/` (med `kart.json`) | Bilder og forhåndsvisninger for granskeren. Ignoreres av git; `qa/` er alt utelatt av Jekyll. |

---

## Fast avslutning for hver utrulling

Oppgave 10 til 18 ender med disse stegene («Avslutning A til G»). `<nøkkel>` er oppgavens utrullingsnøkkel, `<type>` sidetypen.

- **A.** Run: `node scripts/skall-paa.mjs` Expected: `skall-paa: N sider oppdatert`, der N er antall sider av typen.
- **B.** Run: `node scripts/skall-paa.mjs` Expected: `skall-paa: 0 sider oppdatert`.
- **C.** Kjeden i en isolert kopi: Run: `node scripts/kjedeproeve.mjs <nøkkel>` (oppgave 7b). Den kopierer repoet til en midlertidig mappe uten `.git`, kjører `guidelenker`, `lenker-sett`, `skall-paa`, `app-uttrykk`, `app-bevis`, `bilde-attributter` og `sprak-signaler` der, og sammenligner sidene av typen med arbeidskopien. Expected: `0 avvik for <nøkkel>`. Avvik på andre sider skrives ut og nevnes i PR-en; de forkastes ikke.
- **D.** Run: `npm test` Expected: PASS.
- **E.** Run: `REVISJON=<type> npx playwright test revisjon.spec --workers=4` Expected: 0 failed. (CI kjører det samme i oppdelte jobber.)
- **F.** Run: `npm run revisjon` Expected: PASS, og `qa/skjermbilder/<type>/<sprak>-<390|1280>.png` finnes for hvert språk typen har. Lighthouse på mobil for eksempelsiden på bokmål: ytelse minst 90, tilgjengelighet minst 95. Tallene og bildene i PR-en.
- **G.** Commit. Meldingen sier hvilke tester som er endret og hva de vokter nå.

---

### Task 1: Sideregisteret og utrullingspredikatet

**Bygger: Codex.** Gransker: Claude.

**Files:**
- Create: `scripts/sidetyper.mjs`, `test/sidetyper.test.mjs`

**Interfaces:**
- Produces:
  - `export const TYPER = ['forside', 'omregner', 'guide-lang', 'guide-kort', 'guide-gammel', 'blogg', 'juss', 'tjeneste']`
  - `export function sidetype(sti: string, html: string): Sidetype`, kaster `Error('Ukjent sidetype: <sti>')`.
  - `export function sidetypeEllerNull(sti: string, html: string): Sidetype | null` (for skript som også ser filer utenfor registeret, som `app-uttrykk` og testfiksturer med `/x/`).
  - `export function tjenestefamilie(sti: string): 'avmeld' | 'bekreft' | 'vervekort' | 'auth' | 'app' | 'kampanje' | 'feil' | 'verifisering' | null`
  - **Utrullingsnøkkel:** `export function nokkel(sti: string, html: string): string | null` gir typen, eller `tjeneste:<familie>` for tjenestesider, eller `null` når `sidetypeEllerNull` gir `null`.
  - `export const UTRULLET: Set<string>` med utrullingsnøkler, tomt i denne oppgaven. Oppgave 10 til 18 legger til nøkler (`omregner`, `guide-lang`, …, `tjeneste:avmeld`, `tjeneste:bekreft`, `tjeneste:vervekort`, `tjeneste:auth`, `tjeneste:app`, `tjeneste:kampanje`, `tjeneste:feil`). `tjeneste:verifisering` legges aldri til.
  - **Ett predikat:** `export function erUtrullet(sti: string, html: string, utrullet: ReadonlySet<string> = UTRULLET): boolean`. Rendereren, vaktene i testene, `app-uttrykk` og revisjonen bruker bare dette. Ingen av dem slår opp i `UTRULLET` direkte.
  - `export function alleSider(rot: string): { sti, fil, sprak, type, nokkel }[]`. Utelater mapper som begynner med punktum (`.superpowers/` har HTML), `node_modules`, `docs`, `test`, `scripts`, `seo-motor`, `seo-data`, `blogg-kilde`, `qa`, `test-results`, `playwright-report`. 876 filer i dag.
  - `export const EKSEMPEL: Record<Sidetype, Partial<Record<Sprak, string>>>`, `export const BLOGGINDEKS: Record<Sprak, string>`.

Regler i `sidetype`, i rekkefølge: (1) `/`, `/sv/`, `/da/`, `/en/` er `forside`. (2) `tjenestefamilie(sti) !== null` er `tjeneste`: gruppene `avmeld`, `tiktok-auth`, `tiktok-stotte`, `christine` i `SIDEGRUPPER`, `/v/` og motstykkene, `/bekreft/`, `/app/`, `/404.html`, de to verifiseringsfilene. (3) Gruppene `personvern`, `vilkar`, `slett-konto` er `juss`. (4) Sti under `/verktoy/`, `/sv/verktyg/`, `/da/vaerktoejer/`, `/en/tools/` er `omregner`. (5) `/importer-fra-matprat/`, `/finn-oppskrifter/`, `/hva-kan-jeg-lage/`, `/skapere/` er `guide-gammel`. (6) `class="blogg-artikkel` eller `class="blogg-kort"` er `blogg`. (7) `class="prose locale-prose has-toc"` er `guide-lang`. (8) `class="locale-page-hero"` er `guide-kort`. Reglene ser aldri på rammen.

`EKSEMPEL` fra `SIDEGRUPPER`: `omregner` fra `auto-enhet-cups-dl`, `guide-lang` fra `instagram-oppskrifter`, `guide-kort` fra `ukemeny`, `blogg` fra `blogg-eggtest`, `juss` fra `personvern`, `tjeneste` fra `avmeld`, `forside` fra `forside`. `guide-gammel` er `{ nb: '/finn-oppskrifter/' }`. `BLOGGINDEKS` fra gruppa `blogg`.

- [ ] **Step 1: Skriv testen som feiler**

```js
// test/sidetyper.test.mjs
const sider = alleSider(rot);
const type = (sti) => sider.find((s) => s.sti === sti)?.type;

test('hver publiserbar HTML-fil får én type og én nøkkel', () => {
  assert.equal(sider.length, 876, 'nye sider: forklar endringen i commit-meldingen og rett tallet');
  for (const s of sider) { assert.ok(TYPER.includes(s.type), s.sti); assert.ok(s.nokkel, s.sti); }
  assert.ok(!sider.some((s) => s.fil.includes('/.')));
});
test('omregnerne er alle parene pluss fire hubber', () => {
  const par = ['nb', 'sv', 'da', 'en'].reduce((n, l) => n + allePar(l).length, 0);
  assert.equal(sider.filter((s) => s.type === 'omregner').length, par + 4);
});
test('typene har de målte antallene', () => {
  assert.deepEqual(TYPER.map((t) => sider.filter((s) => s.type === t).length), [4, 714, 31, 56, 4, 33, 12, 22]);
});
test('kjente sider får riktig type', () => {
  for (const [sti, forventet] of [
    ['/', 'forside'], ['/verktoy/kopp-til-dl/', 'omregner'], ['/en/tools/unit-converter/', 'omregner'],
    ['/lagre-oppskrifter-fra-instagram/', 'guide-lang'], ['/en/holidays/thanksgiving/', 'guide-lang'], ['/blogg/velg-oppskriftsapp/', 'guide-lang'],
    ['/ukemeny/', 'guide-kort'], ['/importer-oppskrifter/', 'guide-kort'], ['/finn-oppskrifter/', 'guide-gammel'],
    ['/blogg/koketider/', 'blogg'], ['/da/blog/', 'blogg'], ['/personvern.html', 'juss'], ['/en/delete-account/', 'juss'],
    ['/avmeld/', 'tjeneste'], ['/v/', 'tjeneste'], ['/404.html', 'tjeneste'], ['/sv/tiktok/', 'tjeneste'],
  ]) assert.equal(type(sti), forventet, sti);
});
test('en side med både bloggartikkel og has-toc er blogg', () => {
  const html = '<html lang="nb"><body><article class="blogg-artikkel"><section class="prose locale-prose has-toc"></section></article></body></html>';
  assert.equal(sidetype('/blogg/x/', html), 'blogg');
});
test('nøkkel og predikat: type for vanlige sider, familie for tjenester, null utenfor registeret', () => {
  assert.equal(nokkel('/verktoy/kopp-til-dl/', les('verktoy/kopp-til-dl/index.html')), 'omregner');
  assert.equal(nokkel('/da/afmeld/', les('da/afmeld/index.html')), 'tjeneste:avmeld');
  assert.equal(nokkel('/x/', '<html lang="nb"><body></body></html>'), null);
  assert.equal(erUtrullet('/da/afmeld/', les('da/afmeld/index.html'), new Set(['tjeneste:avmeld'])), true);
  assert.equal(erUtrullet('/en/tiktok-auth/', les('en/tiktok-auth/index.html'), new Set(['tjeneste:avmeld'])), false);
  assert.equal(erUtrullet('/x/', '<html><body></body></html>', new Set(TYPER)), false);
});
test('hver eksempelside har typen den står som', () => {
  for (const [t, perSprak] of Object.entries(EKSEMPEL)) for (const sti of Object.values(perSprak)) assert.equal(type(sti), t, sti);
});
test('ukjent side kaster med stien, og EllerNull gir null', () => {
  assert.throws(() => sidetype('/ingenting/', '<html lang="nb"><body></body></html>'), /\/ingenting\//);
  assert.equal(sidetypeEllerNull('/ingenting/', '<html lang="nb"><body></body></html>'), null);
});
```

- [ ] **Step 2: Kjør og se den feile.** Run: `node --test test/sidetyper.test.mjs` Expected: FAIL, modulen finnes ikke.
- [ ] **Step 3: Skriv `scripts/sidetyper.mjs`.**
- [ ] **Step 4: Kjør og se den bestå.** Expected: PASS, 8 tester.
- [ ] **Step 5: Bevis at regelrekkefølgen kan bli rød.** Bytt regel 6 og 7: «en side med både bloggartikkel og has-toc er blogg» feiler (de 876 ekte sidene treffer aldri begge, så bare fiksturen kan vise det). Sett tilbake.
- [ ] **Step 6: Bilder.** Ingen side endres. Antallene per type og språk står i commit-meldingen.
- [ ] **Step 7: Commit**

```bash
git add scripts/sidetyper.mjs test/sidetyper.test.mjs
git commit -m "sideregister og ett predikat for hva som er rullet ut"
```

---

### Task 2a: Revisjonsmotoren

**Bygger: Codex.** Gransker: Claude.

**Files:**
- Create: `test/playwright/hjelp/revisjon.mjs`, `test/playwright/revisjon-motor.spec.mjs`, `test/fixtures/revisjon-rod.html`
- Modify: `playwright.config.mjs` (`baseURL` fra `BASE_URL` når den er satt, og da ingen `webServer`)

**Interfaces:**
- Produces fra `test/playwright/hjelp/revisjon.mjs`:
  - `export async function revider(page, { unntak = [] } = {}): Promise<{ sidelengs: number, utenforBoks: string[], overlapp: string[] }>`
  - `export function samleFeil(page, opphav: string): { konsoll: string[], fremmede: string[], mangler: string[] }`. `opphav` er `new URL(baseURL).origin`; en forespørsel er fremmed når dens origin er en annen. Lyttere settes før første `goto`.
  - `export async function storTekst(page): Promise<void>` (CDP `Page.setFontSizes({ fontSizes: { standard: 32 } })`, nettleserens tekststørrelse på 200 %).
  - `export async function skalering(page, utvalg: string): Promise<{ element: string, faktor: number }[]>`: faktor mellom beregnet `font-size` med og uten `storTekst` for hvert tekstelement som treffer `utvalg`.
  - `export async function zoom(browser, sti: string, faktor: 2 | 4, fraBredde = 1280): Promise<Page>`: emulert nettleserzoom (visningsbredde `fraBredde / faktor`, `deviceScaleFactor: faktor`).

Kontrollene i `revider`: sidelengs rulling (`scrollWidth - innerWidth`); tekst utenfor boks (tekstens `Range`-rektangel mer enn 1 px utenfor nærmeste forelder med `overflow` ulik `visible`, eller utenfor `.blad`/`body`; unntatt tekst i rullbar boks, usynlige og visuelt skjulte elementer, `.skip-link` og velgerne i `unntak`); overlapp (to synlige tekstblader overlapper med mer enn 4 px² uten å være forelder og barn; sortert på `top`).

- [ ] **Step 1: Skriv selvtestene**

```js
// test/playwright/revisjon-motor.spec.mjs
test('revisjonen ser rulling, tekst utenfor boksen, overlapp og konsollfeil', async ({ page, baseURL }) => {
  test.skip(!!process.env.BASE_URL, 'fiksturen finnes bare lokalt');
  const feil = samleFeil(page, new URL(baseURL).origin);
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto('/test/fixtures/revisjon-rod.html');
  const r = await revider(page);
  expect(r.sidelengs).toBeGreaterThan(0);
  expect(r.utenforBoks.length).toBeGreaterThan(0);
  expect(r.overlapp.length).toBeGreaterThan(0);
  expect(feil.konsoll.length).toBeGreaterThan(0);
  expect(feil.fremmede).toEqual(['https://example.com/x.png']);
});
test('storTekst dobler rem-tekst og lar px-tekst stå', async ({ page }) => {
  test.skip(!!process.env.BASE_URL);
  await page.goto('/test/fixtures/revisjon-rod.html');
  const [rem, px] = await Promise.all(['#rem', '#px'].map(async (v) => (await skalering(page, v))[0].faktor));
  expect(rem).toBeGreaterThanOrEqual(1.9);
  expect(px).toBeLessThan(1.1);
});
test('zoom 200 % gjør px-tekst dobbelt så stor på skjermen', async ({ browser }) => {
  test.skip(!!process.env.BASE_URL);
  const side = await zoom(browser, '/test/fixtures/revisjon-rod.html', 2);
  expect(await side.evaluate(() => innerWidth)).toBe(640);
  expect(await side.evaluate(() => devicePixelRatio)).toBe(2);
});
```

`test/fixtures/revisjon-rod.html`: en boks på 2000 px, en boks med `overflow:hidden` og for lang tekst, to absolutt plasserte avsnitt oppå hverandre, `#rem` med `font-size:1rem`, `#px` med `font-size:16px`, et bilde fra `https://example.com/x.png`, og `console.error('rød')`. Stil i `<style>`. Ingen butikklenke, så etterbehandlerne rører den ikke.

- [ ] **Step 2: Kjør og se den feile.** Run: `npx playwright test revisjon-motor` Expected: FAIL, hjelperen finnes ikke.
- [ ] **Step 3: Skriv hjelperen og `BASE_URL` i konfigurasjonen.**
- [ ] **Step 4: Kjør og se den bestå.** Expected: PASS, 3 tester.
- [ ] **Step 5: Bevis at origin-sjekken er riktig.** Kjør `BASE_URL=https://matlyst-app.no npx playwright test revisjon-motor`: alle tre hoppes over, og ingen feil. Kjør så den første testen lokalt med `opphav` satt til `https://matlyst-app.no`: `fremmede` får også `127.0.0.1`-forespørslene, og testen feiler. Sett tilbake.
- [ ] **Step 6: Commit**

```bash
git add test/playwright/hjelp/revisjon.mjs test/playwright/revisjon-motor.spec.mjs test/fixtures/revisjon-rod.html playwright.config.mjs
git commit -m "revisjonsmotor: rulling, boks, overlapp, tekststørrelse, zoom og fremmede verter"
```

---

### Task 2b: Revisjonsspesifikasjonen, forhåndsvisningen og CI

**Bygger: Codex.** Gransker: Claude.

**Files:**
- Create: `test/playwright/revisjon.spec.mjs`, `test/playwright/hjelp/utvalg.mjs`, `.github/workflows/revisjon.yml`
- Modify: `package.json` (`"revisjon": "playwright test revisjon.spec --pass-with-no-tests"`), `.gitignore` (`qa/skjermbilder/`, `qa/forhandsvisning/`)

**Interfaces:**
- Consumes: `revider`, `samleFeil`, `storTekst`, `skalering`, `zoom` (2a); `alleSider`, `erUtrullet`, `EKSEMPEL`, `BLOGGINDEKS` (1).
- **Forhåndsvisningskontrakten** (produseres av `skall-paa --forhandsvis` i oppgave 7b, leses her): mappa `qa/forhandsvisning/` speiler stiene (`qa/forhandsvisning/verktoy/kopp-til-dl/index.html`) og har `qa/forhandsvisning/kart.json` = `[{ sti: '/verktoy/kopp-til-dl/', url: '/qa/forhandsvisning/verktoy/kopp-til-dl/', type: 'omregner', sprak: 'nb' }, …]`. Hver forhåndsvisning har `<meta name="robots" content="noindex">`, mangler `<script src="/locale.js">` (så ingen omdirigering skjer fra en adresse som ikke står i tabellen), og har ellers canonical og `hreflang` urørt. Ressursene (`/tokens.css`, `/skall.css`, `/side.css`, `/skall.js`, bilder) hentes fra roten av repoet.
- Produces fra `test/playwright/hjelp/utvalg.mjs`: `export function utvalg(): { sti, url, type, sprak, fulltSkall: boolean }[]`. `REVISJON` ikke satt: eksempelsidene der `erUtrullet` er sann, pluss `/` og `BLOGGINDEKS` når blogg er rullet ut. `REVISJON=<type>`: alle sider av typen der `erUtrullet` er sann (filtrert på `REVISJON_SPRAK`). `REVISJON=alle`: alle utrullede sider. `REVISJON=forhandsvisning`: radene i `kart.json`. Tjenestefamilier er med i forhåndsvisningen og i full revisjon (`REVISJON=alle`, `REVISJON=tjeneste`) først når `erUtrullet` gir sann for deres nøkkel, altså etter oppgave 16 til 18; før det har de ingen `tjeneste.css` å laste. `fulltSkall` er sann for alle utrullede typer unntatt `tjeneste`. Verifiseringsfilene er aldri med. `url` er adressen som åpnes (lik `sti` unntatt i forhåndsvisning).

Testene i `revisjon.spec.mjs`, for hver rad i `utvalg()`:
- **felles:** fire bredder (360, 390, 768, 1280), `revider` uten funn, sluttadressen lik `url`, `samleFeil(page, origin)` tom.
- **forstørret tekst:** (a) `skalering(page, '.blad :is(p, li, td, th, dt, dd, summary, h1, h2, h3, h4, figcaption, .lead, .eyebrow)')` på 390 px: hver faktor er minst 1,9, unntatt elementer inne i `SKALL_PX` (under). (b) `zoom(…, 2)` og `zoom(…, 4)`: `revider` uten funn. Zoom forstørrer også `px`-tekst, så hele grensesnittet, skallet med, er dekket av (b).
- **fullt skall (bare `fulltSkall`):** uten JavaScript er alle `[data-hent]` lenker til `/app` og `#bunnreol .fag ul` er synlig; `data-hent`-verdiene er en delmengde av de seks lovlige, og `topp`, `bunn`, `fast` står nøyaktig én gang.
- **utvalget er ikke tomt for utrullede typer:** én test utenfor løkka, `test('utvalget har sider for hver utrullet type', …)`, krever for hver type der minst én side har `erUtrullet` sann (og for `REVISJON=<type>` når typen er rullet ut) at `utvalg()` har minst én rad av typen. Den feiler hvis revisjonen velger null sider for en type som er rullet ut, så `--pass-with-no-tests` ikke kan skjule et tomt utvalg.
- **skjermbilder:** eksempelsidene på 390 og 1280 px, `fullPage`, til `qa/skjermbilder/<type>/<sprak>-<bredde>.png`.

`SKALL_PX = ['header.topp', '#panel', 'section.bunn', 'footer.under', '#fast', '#hent', '#cookie', '.knapp']`: skallets tekst er satt i `px` i `skall.css` (forsideløpets fil, etter specens skriftstørrelser), og følger derfor ikke nettleserens tekststørrelse. Den er unntatt fra (a), men dekket av zoomtesten (b). Å skrive `skall.css` om til `rem` står som punkt i poleringsløpet («Det planen ikke dekker»).

- [ ] **Step 1: Skriv spesifikasjonen og utvalget.**
- [ ] **Step 2: Kjør.** Run: `npm run revisjon` Expected: PASS for `/` (ingenting er rullet ut ennå). Bilder i `qa/skjermbilder/forside/`.
- [ ] **Step 3: Bevis at utvalget følger predikatet.** Legg `omregner` midlertidig i `UTRULLET`: `utvalg()` gir fire omregnersider til (eksemplene), og «felles» feiler på dem fordi de ikke har nytt skall og bruker `styles.css`-tekst i `px`. Sett tilbake.
- [ ] **Step 4: CI.** `.github/workflows/revisjon.yml` kjører på alle `pull_request` (ingen stifilter, så endringer i revisjonstestene, `sidetyper.mjs`, `hyller.mjs`, skallfilene og stilarkene alltid utløser den). Matrise: `omregner` × `nb`, `sv`, `da`, `en`, og `guide-lang`, `guide-kort`, `guide-gammel`, `blogg`, `juss`, `tjeneste` uten språkfilter. Hver jobb: `REVISJON=${{ matrix.type }} REVISJON_SPRAK=${{ matrix.sprak }} npx playwright test revisjon.spec --workers=4 --pass-with-no-tests`, `timeout-minutes: 30`. Typer som ikke er rullet ut, gir 0 tester og grønt. `test.yml` kjører fortsatt utvalget.
- [ ] **Step 5: Commit**

```bash
git add test/playwright/revisjon.spec.mjs test/playwright/hjelp/utvalg.mjs .github/workflows/revisjon.yml package.json .gitignore
git commit -m "revisjon per sidetype, forhåndsvisningskontrakt og CI-jobber"
```

---

### Task 3: Skalltekstene får én eier

**Bygger: Codex.** Gransker: Claude.

**Files:**
- Create: `scripts/skall-tekst.mjs`, `test/fixtures/skall-nb.html.fiks`
- Modify: `scripts/skall.mjs`, `scripts/forside-tekst.mjs`, `scripts/forside.mjs`, `scripts/guidelenker.mjs`, `skall.css` (bare `.alle-guider`)
- Test: `test/skall.test.mjs`, `test/forside-tekst.test.mjs`, `test/guidelenker.test.mjs`

**Interfaces:**
- Consumes: `scripts/skall.mjs` og `scripts/forside-tekst.mjs` slik de står etter forsideløpet. Per 19.11 (commit 64fd2223 og 7365f90d) skriver `skall.mjs` ingen overskrifter (`p.faghode`, `p.henttittel#hentTittel`, `aria-label` på hver hyllas `ul`), lenkegruppa i bunnen heter «Juridisk», og menypanelet står rett etter menyknappen og lukkes ved fokus ut og klikk utenfor.
- Produces fra `scripts/skall-tekst.mjs`:
  - `export const SPRAKVALG = { aria: { nb: 'Språk', sv: 'Språk', da: 'Sprog', en: 'Language' }, navn: { nb: 'Norsk', sv: 'Svenska', da: 'Dansk', en: 'English' } }`. Dette er data, ikke oversatt tekst: verdiene er de `sprakvelgerMeta` i L bruker i dag. Fylles for alle fire språk her, så oppgave 4 kan bruke dem.
  - `export const BUTIKK` for alle fire språk, skrevet inn som verdier: `nb` `https://apps.apple.com/no/app/matlyst/id6762563515` og `https://play.google.com/store/apps/details?id=app.matlyst`; `sv` `https://apps.apple.com/se/app/matlyst/id6762563515` og `…?id=app.matlyst&hl=sv&gl=SE`; `da` `/dk/` og `&hl=da&gl=DK`; `en` `https://apps.apple.com/app/matlyst/id6762563515` og `&hl=en`. Det er verdiene i `common` i L i dag; oppgave 4 låser likheten med en test.
  - `export const SKALLTEKST = { nb: {...} }` med nøklene som flyttes fra `TEKST.nb` i `forside-tekst.mjs`, med samme navn og form: `topp` (`merkeAria`, `meny`, `menyAria`, `panelAria`, `lastNed`), `sprak` (avledet: `{ aria: SPRAKVALG.aria.nb, valg: [{ kode, navn }…] }`), `bunn` (`aria`, `menyAria`), `bunnlinje`, `under` (`vilkarAria` = «Juridisk», `lenker[3]`, `laget`, `flaggAlt`, `epost`), `fast` (`knapp`), `hent` (`lukkAria`, `qrAlt`, `tittel`, `ingress`, `butikker[2]`), og `samtykke` (`overskrift?`, `tekst`, `godta`, `avvis`; bare for sider som laster `site.js` uten banner). Nye nøkler i steg 6: `bunn.knapp`, `bunn.guider`, `innhold.knapp`.
  - `scripts/forside-tekst.mjs` beholder bare forsidens egne nøkler (`folg`, `h1`, `ingress`, `knapp` i helten, `vurdering`, `steg`, `kilder`, `kokebok`, `spor`, `middag`, `pris`, `svar`, `eksempler`, `stegtider` med flere). `forside.mjs` får skalltekstene bare gjennom `skall.mjs`.
- Produces fra `scripts/skall.mjs`:
  - `morkBunn(sprak, { sprakvelger = '', samtykkelenke = true } = {})`: `samtykkelenke: false` utelater `<a … data-consent-withdraw>`; standard er som i dag.
  - `hylledel(sprak, { guider = '' } = {})`: skriver etter `#bunnreol` og før `.bunnrad`: `<details class="alle-guider"><summary>${bunn.guider}</summary>${guider || '<!-- guider:plass -->'}</details>`.
  - Alle andre signaturer som i dag; alle valgobjekter har standardverdien `{}`.
- Produces fra `scripts/guidelenker.mjs`: `settInn(html, ny)` erstatter eksisterende `guider:bunn`-blokk; ellers `<!-- guider:plass -->`; ellers foran `</footer>` som i dag.

- [ ] **Step 0: Kontroller grensesnittene etter merge.** Les `scripts/skall.mjs`, `scripts/forside.mjs`, `test/forside.test.mjs` og `test/skall.test.mjs`. Avviker de fra det som står over, stopp og meld fra.
- [ ] **Step 1: Ta øyeblikksbildet før noe endres.** Skriv `topp('nb', {}) + hylledel('nb') + morkBunn('nb', {}) + nedlasting('nb') + samtykke('nb')` til `test/fixtures/skall-nb.html.fiks`.
- [ ] **Step 2: Skriv testene for tekstflyttingen**

```js
// test/skall.test.mjs
const skallUtenBanner = (s) => topp(s, {}) + hylledel(s) + morkBunn(s, {}) + nedlasting(s);
const alleDeler = (s) => skallUtenBanner(s) + samtykke(s);

// Samme skille som dagens «skallet uten samtykkebanner legger ikke til overskrifter»:
// banneret er sidens eget innhold (B4) og kan ha en overskrift.
test('skallet uten samtykkebanner legger ikke til overskrifter', () => {
  assert.doesNotMatch(skallUtenBanner('nb'), /<h[1-6]\b/i);
  for (const ul of skallUtenBanner('nb').match(/<ul\b[^>]*>/g)) assert.match(ul, /aria-label="[^"]+"/);
});
test('ingen tekst i skallet står i forside-tekst.mjs', () => {
  for (const k of ['topp', 'sprak', 'bunn', 'bunnlinje', 'under', 'fast', 'hent']) assert.ok(!(k in TEKST.nb), k);
});
test('morkBunn: samtykkelenka kan slås av', () => {
  assert.match(morkBunn('nb', {}), /data-consent-withdraw/);
  assert.doesNotMatch(morkBunn('nb', { samtykkelenke: false }), /data-consent-withdraw/);
  assert.equal(morkBunn('nb', { samtykkelenke: true }), morkBunn('nb', {}));
});
test('bokmålsskallet er byte for byte som før tekstene ble flyttet', () => {
  assert.equal(alleDeler('nb'), les('test/fixtures/skall-nb.html.fiks'));
});
```

`test/forside-tekst.test.mjs`: `t` blir `{ ...TEKST.nb, ...SKALLTEKST.nb }`, med en ny første test som krever at de to objektene ikke har felles nøkler på øverste nivå. Regionene står; nøkkelgruppene er `header` `['topp', 'folg']`, `footer` `['under', 'sprak']`, `fast` `['fast']`, `dialog` `['hent']`, `bunn` `['bunn', 'bunnlinje', 'knapp']` (uendret i dette steget). `samtykke` står i `UREGIONERT` med kommentar. Testen «hver nøkkelgruppe … hører til en region» går over begge modulene.

- [ ] **Step 3: Kjør og se dem feile, flytt nøklene, kjør og se dem bestå.** Run: `node --test test/skall.test.mjs test/forside-tekst.test.mjs` Expected: først FAIL på «ingen tekst i skallet» og `morkBunn`, så PASS, med øyeblikksbildet uendret.
- [ ] **Step 4: Skriv testene for B3 og de nye nøklene**

```js
// test/skall.test.mjs (øyeblikkstesten endres til en avgrenset, forventet endring)
const DETALJER = (summary) => `<details class="alle-guider"><summary>${summary}</summary><!-- guider:plass --></details>`;
test('bokmålsskallet er øyeblikksbildet pluss guideplassen, og ingenting annet', () => {
  const før = les('test/fixtures/skall-nb.html.fiks');
  assert.equal(før.split('<div class="bunnrad">').length, 2, 'øyeblikksbildet har nøyaktig én .bunnrad');
  assert.equal(alleDeler('nb'), før.replace('<div class="bunnrad">', `${DETALJER(SKALLTEKST.nb.bunn.guider)}<div class="bunnrad">`));
});
test('en ferdig guideblokk står i detaljene', () => {
  const blokk = '<!-- guider:bunn --><div class="f-guider">x</div><!-- /guider:bunn -->';
  assert.ok(hylledel('nb', { guider: blokk }).includes(`<summary>${SKALLTEKST.nb.bunn.guider}</summary>${blokk}</details>`));
});
test('«Alle guider» er den nye teksten i hylledelen', () => {
  assert.equal(SKALLTEKST.nb.bunn.guider, 'Alle guider');
  assert.equal(SKALLTEKST.nb.bunn.knapp, 'Last ned gratis');
  assert.equal(SKALLTEKST.nb.innhold.knapp, 'Last ned gratis');
});

// test/guidelenker.test.mjs
test('settInn bruker plassen i hylledelen når blokka mangler, og er idempotent', () => {
  const html = `${hylledel('nb')}<footer></footer>`;
  const ny = '<!-- guider:bunn --><div class="f-guider">x</div><!-- /guider:bunn -->';
  const ut = settInn(html, ny);
  assert.ok(ut.indexOf(ny) > ut.indexOf('<summary>') && ut.indexOf(ny) < ut.indexOf('</details>'));
  assert.equal(settInn(ut, ny), ut);
  assert.ok(!ut.includes('<!-- guider:plass -->'));
});
```

`test/forside-tekst.test.mjs`: region `bunn` får `nokler: ['bunn', 'bunnlinje']` (ikke lenger `knapp`, som i bunnen nå er `bunn.knapp`), og `utelatt: [/^bunn\.guider$/]` med kommentaren «finnes ikke i prototypen; låst i skall.test.mjs». `innhold` legges i `UREGIONERT` («vises ikke på forsiden; låst i skall.test.mjs»). Tekst- og antallslåsene for de andre regionene står.

- [ ] **Step 5: Kjør og se dem feile.** Run: `node --test test/skall.test.mjs test/forside-tekst.test.mjs test/guidelenker.test.mjs` Expected: FAIL på de nye testene.
- [ ] **Step 6: Legg til `bunn.knapp`, `bunn.guider`, `innhold.knapp`, endre `hylledel` og `settInn`, og stil `.alle-guider`.** Sammenfoldet som standard, `summary` minst 44 px, lenkene som en dempet rad. En tom `<details>` (bare plassmerket) skjules med `.alle-guider:not(:has(.f-guider)){display:none}`.
- [ ] **Step 7: Kjør generatoren og testene.** Run: `node scripts/forside.mjs && npm test` Expected: PASS. Kjør `node scripts/guidelenker.mjs`; har forsiden en guideblokk, står den nå i detaljene.
- [ ] **Step 8: Bevis at vaktene kan bli røde.** (a) Gjør ett hyllenavn til `<h3>`: overskriftstesten feiler. (b) Legg `topp` tilbake i `TEKST.nb`: «ingen tekst i skallet» feiler. (c) Endre ett tegn i `bunnlinje`: «øyeblikksbildet pluss guideplassen» feiler. Sett tilbake.
- [ ] **Step 9: Bilder.** Run: `npm run revisjon`. Forsiden med «Alle guider» sammenfoldet og åpnet.
- [ ] **Step 10: Commit**

```bash
git add scripts/skall-tekst.mjs scripts/skall.mjs scripts/forside-tekst.mjs scripts/forside.mjs scripts/guidelenker.mjs skall.css index.html test
git commit -m "skalltekstene får én eier, og guidene får plass i hylledelen"
```

---

### Task 4: Hyller per språk og språkvelger med fulle navn

**Bygger: Codex.** Gransker: Claude.

**Files:**
- Create: `test/hjelp/lokalsider-kilde.mjs`, `test/generator-sprakvelger.test.mjs`
- Modify: `scripts/hyller.mjs`, `scripts/skall.mjs`, `scripts/generer-lokalsider.mjs` (bare språkvelgerdelen), `test/playwright/sprakvalg.spec.mjs`, `index.html` (ny språkvelger)
- Test: `test/hyller.test.mjs`, `test/skall.test.mjs`, `test/seo-blogg.test.mjs`

**Interfaces:**
- Consumes: `SPRAKVALG`, `BUTIKK` (oppgave 3).
- Produces fra `scripts/hyller.mjs`: `HYLLETEKST` (nøkkel i `lenker` er bokmålslenkas `href`) og `lokaliserHyller(sprak, tekst): Hylle[]` (lenkene får `nbHref`). Ekstern `href` står; intern slås opp i `SIDEGRUPPER` og får `finnes: false` når siden på språket eller fila mangler; `href` med `#` krever `id="<anker>"` i målfila; `finnes: false` på bokmål arves; manglende tekst kaster `Error` med `mangler tekst` og `nbHref`.
- Produces fra `scripts/skall.mjs`: `sprakvelger(sprak, plass: 'topp'|'bunn', sider)` leser bare `SPRAKVALG` (ikke `SKALLTEKST`, så den virker før oppgave 5). Synlig tekst er fullt navn, `aria-label` per lenke er uendret (Norsk, Svenska, Dansk, English), gruppeetiketten er `SPRAKVALG.aria[sprak]`. Funksjonen eier kommentarparet `<!-- språkvelger:<plass> -->…<!-- /språkvelger:<plass> -->`.
- Produces i `scripts/generer-lokalsider.mjs` (K4): L beholder kallformen `sprakvelger(gruppe, aktivtSprak, plassering)` med `plassering` `'top'|'bottom'`, men den lokale funksjonen blir en tynn adapter: `const sprakvelger = (gruppe, aktivtSprak, plassering) => skallSprakvelger(aktivtSprak, plassering === 'top' ? 'topp' : 'bunn', gruppe.sider);` med `import { sprakvelger as skallSprakvelger } from './skall.mjs'`. I `medSprakvelgere` blir `const topp = sprakvelger(gruppe, aktivtSprak, 'top')` og `const bunn = sprakvelger(gruppe, aktivtSprak, 'bottom')`, uten L sine egne kommentarer rundt. Mønstrene som finner gamle blokker (`toppMonster`, `bunnMonster`) står. `sprakvelgerMeta` fjernes. L kjøres ikke mot arbeidskopien.
- Produces fra `test/hjelp/lokalsider-kilde.mjs`: `lesCommon(sprak)` leser `const common = {` i kildeteksten til L og returnerer `{ appStore, play, consent, accept, reject, privacy, terms, withdraw }`.

- [ ] **Step 1: Skriv testene som feiler**

```js
// test/hyller.test.mjs
const falsk = () => ({ navn: Object.fromEntries(HYLLER.nb.map((h) => [h.id, `N:${h.id}`])), lenker: Object.fromEntries(HYLLER.nb.flatMap((h) => h.lenker.map((l) => [l.href, `T:${l.href}`]))) });
const finn = (hyller, id, nbHref) => hyller.find((h) => h.id === id).lenker.find((l) => l.nbHref === nbHref);
test('lokaliserHyller henter adressene fra SIDEGRUPPER', () => { /* /handleliste/ → /sv/inkopslista/, kopp-til-dl → /sv/verktyg/kopp-till-dl/, /personvern.html → /sv/integritet/, YouTube urørt */ });
test('en lenke uten side på språket vises ikke', () => { /* koketider: finnes === false nøyaktig når gruppa mangler språket */ });
test('Spør Matlyst vises bare når forsiden på språket har delen', () => { /* /#spor mot id="spor" i <sprak>/index.html */ });
test('manglende tekst kaster med adressen', () => { /* /ukemeny/ fjernet → /mangler tekst.*\/ukemeny\// */ });

// test/skall.test.mjs
test('språkvelgeren viser fulle navn, beholder etikettene og eier ett kommentarpar', () => {
  const html = sprakvelger('da', 'topp', { nb: '/', sv: '/sv/', da: '/da/', en: '/en/' });
  assert.match(html, /^<!-- språkvelger:topp --><span class="language-switcher language-switcher-top" role="navigation" aria-label="Sprog">/);
  assert.match(html, /<!-- \/språkvelger:topp -->$/);
  assert.equal(html.split('<!-- språkvelger:topp -->').length - 1, 1);
  for (const [kode, navn] of Object.entries(SPRAKVALG.navn)) assert.match(html, new RegExp(`lang="${kode}"[^>]*aria-label="${navn}"[^>]*>${navn}</a>`));
});
test('butikklenkene på sv, da og en er de L bruker', () => {
  for (const s of ['sv', 'da', 'en']) assert.deepEqual(BUTIKK[s], { ios: lesCommon(s).appStore, play: lesCommon(s).play });
});

// test/generator-sprakvelger.test.mjs
const kilde = utenKommentarer(les('scripts/generer-lokalsider.mjs'));
const kropp = (navn) => { const m = kilde.match(new RegExp(`function ${navn}\\([\\s\\S]*?\\n\\}`)); assert.ok(m, navn); return m[0]; };
test('L bruker skallets språkvelger gjennom en adapter', () => {
  assert.match(kilde, /import \{[^}]*\bsprakvelger as skallSprakvelger\b[^}]*\} from '\.\/skall\.mjs'/);
  assert.match(kilde, /const sprakvelger = \(gruppe, aktivtSprak, plassering\) => skallSprakvelger\(aktivtSprak, plassering === 'top' \? 'topp' : 'bunn', gruppe\.sider\)/);
  assert.doesNotMatch(kilde, /sprakvelgerMeta|etikett: '(NO|SV|DA|EN)'/);
});
test('L legger ikke kommentarpar rundt språkvelgeren selv', () => {
  const m = kropp('medSprakvelgere');
  for (const plass of ['top', 'bottom']) assert.match(m, new RegExp(`= sprakvelger\\(gruppe, aktivtSprak, '${plass}'\\);`));
  assert.doesNotMatch(m, /`<!-- språkvelger:/);
});
```

`test/seo-blogg.test.mjs` kjører N og L i en midlertidig kopi. Ny test der: «den genererte autoartikkelen og bloggforsiden har hver språkvelger nøyaktig én gang, med nøyaktig ett kommentarpar» (`split('<!-- språkvelger:topp -->')`, `split('<!-- /språkvelger:topp -->')` og tilsvarende for bunn gir lengde 2, og `class="language-switcher` står to ganger). Dette er testen som faktisk kjører adapteren.

`test/playwright/sprakvalg.spec.mjs`, «toppvelgeren og bunnvelgeren virker med tastatur» (vokter tastaturbruk av begge velgerne): Tab til `#menyknapp`, Enter, krev `aria-expanded="true"`, Tab videre til `.language-switcher-top a[aria-label="Dansk"]` (panelet står rett etter knappen) og krev fokus; Tab ut av panelet lukker menyen (`aria-expanded="false"`); bunnvelgeren som før. Kjøres på `/`, og på `/verktoy/kopp-til-dl/` fra oppgave 10 (`test.skip` med kommentar til da).

- [ ] **Step 2: Kjør og se dem feile.**
- [ ] **Step 3: Skriv `lokaliserHyller`, endre `sprakvelger`, og legg inn adapteren i L.**
- [ ] **Step 4: Kjør.** Run: `node scripts/forside.mjs && npm test && npx playwright test sprakvalg` Expected: PASS. `test/locale-pages.test.mjs` står uendret grønn.
- [ ] **Step 5: Bevis at adaptertesten kan bli rød.** Pakk `const topp = …` i L inn i egne `<!-- språkvelger:topp -->`-kommentarer igjen: «L legger ikke kommentarpar…» og testen i `seo-blogg` feiler (to par). Sett tilbake.
- [ ] **Step 6: Bilder.** `npm run revisjon`; forsiden med menyen åpen og fulle språknavn.
- [ ] **Step 7: Commit**

```bash
git add scripts test index.html
git commit -m "hyller per språk, og språkvelger med fulle navn i skallet og i L"
```

---

### Task 5: Språk: skallet og hyllene på svensk, dansk og engelsk

**Bygger: Claude (språkspesialist, `matlyst-sprak`).** Gransker: Codex (tester og plass), pluss skillens egen Reviewer-rolle.

**Files:**
- Modify: `scripts/skall-tekst.mjs` (`SKALLTEKST.sv/da/en`), `scripts/hyller.mjs` (`HYLLETEKST.sv/da/en`)
- Create: `test/hjelp/restord.mjs` (lista flyttes ut av `test/locale-pages.test.mjs`, som importerer den)
- Test: `test/skall.test.mjs`, `test/hyller.test.mjs`

**Interfaces:**
- Consumes: nøklene fra oppgave 3. `SPRAKVALG` og `BUTIKK` er alt fylt; språkspesialisten rører dem ikke.
- Produces: `SKALLTEKST.sv/da/en` og `HYLLETEKST.sv/da/en`, så alle skallfunksjoner virker på fire språk.

Hver tekst skrives fra meningen. Engelsk er amerikansk engelsk. Ingen tankestrek.

**Skalltekstene** (bokmål viser meningen, ikke kilden):

| Nøkkel | Bokmål | Hvor og hvor mye plass |
|---|---|---|
| `topp.merkeAria` | Matlyst, til forsiden | `aria-label` på logoen. |
| `topp.meny` | Meny | Synlig på menyknappen på PC, skjult under 720 px. Maks 8 tegn. |
| `topp.menyAria` | Meny | `aria-label` på menyknappen. |
| `topp.panelAria` | Hovedmeny | `aria-label` på menypanelet. |
| `topp.lastNed` | Last ned | Liten svart pille øverst til høyre. Maks 10 tegn (360 px). |
| `bunn.aria` | Alt på Matlyst | `aria-label` på hylledelen. |
| `bunn.menyAria` | Bunnmeny | `aria-label` på hyllene i bunnen. |
| `bunn.knapp` | Last ned gratis | Svart knapp under hyllene. Maks 18 tegn. |
| `bunn.guider` | Alle guider | Teksten på den sammenfoldede guidelista i hylledelen. Maks 20 tegn. |
| `bunnlinje` | Den oppskriften du lagret? Lag den i kveld. | Én linje over nedlastingsknappen nederst. Dytt fra «lagret» til «lag». Maks 50 tegn. |
| `under.vilkarAria` | Juridisk | `aria-label` på lenkegruppa (personvern, vilkår, informasjonskapsler) i den mørke bunnen. |
| `under.lenker[0]` | Personvern | Lenke. Samme ord som `privacy` i `common` i L. |
| `under.lenker[1]` | Vilkår | Lenke. Samme ord som `terms` i `common` i L. |
| `under.lenker[2]` | Informasjonskapsler | Lenke som åpner samtykkevalget igjen. |
| `under.laget` | © 2026 Matlyst. Laget i Norge | Før det norske flagget. |
| `under.flaggAlt` | Norsk flagg | `aria-label` på flagget. |
| `fast.knapp` | Last ned gratis | Fast knapp nederst på mobil. Maks 18 tegn. |
| `hent.lukkAria` | Lukk | `aria-label` på krysset i QR-vinduet. |
| `hent.qrAlt` | QR-kode til matlyst-app.no/app | `alt` på QR-koden. Adressen står uendret. |
| `hent.tittel` | Skann med telefonen | Tittel i QR-vinduet (ikke overskrift, B2). Maks 28 tegn. |
| `hent.ingress` | Kameraet tar deg til riktig butikk, enten du har iPhone eller Android. | Maks 90 tegn. |
| `innhold.knapp` | Last ned gratis | Knappen som erstatter butikkmerkene i nedlastingsboksene (B1). Maks 18 tegn. |
| `samtykke` | | **Ikke skriv ny tekst.** `tekst`, `godta`, `avvis` er `consent`, `accept`, `reject` fra `common` i L, ordrett. Ingen `overskrift`. Brukes bare på sider uten eget banner. |

**Hyllenavn** (`HYLLETEKST.<sprak>.navn`, maks 18 tegn): `appen` Appen, `lagre` Lagre oppskrifter, `middag` Middag, `verktoy` Verktøy, `tips` Kjøkkentips, `matlyst` Matlyst (står likt). Navnet brukes også som `aria-label` på hyllas liste.

**Lenketekster** (`HYLLETEKST.<sprak>.lenker`, nøkkel er bokmålsadressen, maks 24 tegn, skal virke uten hyllenavnet over). Alle får tekst, også de skjulte.

| Bokmålsadresse | Bokmål | Merknad |
|---|---|---|
| `/oppskriftsbok-app/` | Oppskriftsapp | |
| `/importer-oppskrifter/` | Importer oppskrifter | |
| `/ukemeny/` | Ukemeny | Dansk side heter «madplan». |
| `/handleliste/` | Handleliste | |
| `/spiskammer-app/` | Spiskammer | |
| `/#spor` | Spør Matlyst | Funksjonsnavn. Engelsk «Ask Matlyst» (låst i `test/engelsk.test.mjs`). |
| `/finn-oppskrifter/` | Finn oppskrifter | |
| `/lagre-oppskrifter-fra-instagram/` | Instagram | Navn. |
| `/lagre-oppskrifter-fra-tiktok/` | TikTok | Navn. |
| `/importer-fra-matprat/` | Matprat | Navn. |
| `/importer-fra-koket/` | Köket.se | Navn. |
| `/handskrevne-oppskrifter/` | Bilder og kokebøker | Import fra foto og kokebok. |
| `/bytt-fra-paprika/` | Paprika | Navn. Bare om flytting. |
| `/middagsforslag/` | Middagsforslag | |
| `/enkel-middag/` | Enkel middag | |
| `/tom-kjoleskapet/` | Tøm kjøleskapet | |
| `/hva-kan-jeg-lage/` | Hva kan jeg lage? | Spørsmål. |
| `/verktoy/enhetsomregner/` | Enhetsomregner | |
| `/verktoy/kopp-til-dl/` | Cups til dl | «Cups», aldri kopp, kopper, kop, koppar. |
| `/verktoy/dl-til-kopp/` | Dl til cups | Som over. |
| `/verktoy/celsius-til-fahrenheit/` | Celsius til Fahrenheit | |
| `/verktoy/dl-til-gram/`, `/porsjoner/`, `/kakeform/`, `/steketid/`, `/pizzadeig/`, `/gjaer/`, `/verktoy/` | Dl til gram, Porsjoner, Kakeform, Steketid, Pizzadeig, Gjær, Alle kalkulatorer | Skjult til sidene finnes. |
| `/blogg/doble-oppskrift/` | Doble en oppskrift | |
| `/blogg/er-egget-ferskt/` | Er egget ferskt? | |
| `/blogg/erstatte-egg/` | Erstatte egg | Finnes ikke på engelsk; vises ikke der. |
| `/blogg/kjernetemperatur/` | Kjernetemperatur | |
| `/blogg/koketider/` | Koketider | Finnes ikke på sv og da; vises ikke der. |
| `/blogg/` | Alle kjøkkentips | |
| `/skapere/` | For matskapere | |
| fire eksterne kontoer | Instagram, TikTok, YouTube, Pinterest | Navn. |
| `/personvern.html` | Personvern | Samme ord som `under.lenker[0]`. |

- [ ] **Step 1: Skriv testene som feiler**

```js
// test/skall.test.mjs
for (const s of ['sv', 'da', 'en']) {
  test(`${s}: menyen og bunnen har de samme hyllene og lenkene`, () => {
    assert.ok(lenker(hylledel(s)).length > 15);
    assert.deepEqual(lenker(hylledel(s)), lenker(topp(s, {}).match(/<nav class="panel"[\s\S]*?<\/nav>/)[0]));
  });
  test(`${s}: skallet uten banner legger ikke til overskrifter`, () => { assert.doesNotMatch(skallUtenBanner(s), /<h[1-6]\b/i); });
  test(`${s}: samtykkebanneret til sider uten banner er ordrett L sitt`, () => {
    const c = lesCommon(s), html = samtykke(s);
    for (const del of [c.consent, `>${c.accept}<`, `>${c.reject}<`]) assert.ok(html.includes(del), del);
  });
  test(`${s}: logo, personvern og vilkår lenker til sidene på språket`, () => {
    const g = (id) => SIDEGRUPPER.find((x) => x.id === id).sider[s];
    assert.match(topp(s, {}), new RegExp(`class="merke" href="${g('forside')}"`));
    for (const id of ['personvern', 'vilkar']) assert.match(morkBunn(s, {}), new RegExp(`href="${g(id)}"`));
  });
  test(`${s}: skalltekstene følger skrivereglene og plassen`, () => {
    const synlig = alleDeler(s).replace(/<[^>]+>/g, ' ');
    assert.doesNotMatch(synlig, /[–—]/);
    assert.doesNotMatch(synlig, /\b(kopp|kopper|kop|koppar)\b/i);
    assert.doesNotMatch(synlig, NORSKE_RESTORD);
    const t = SKALLTEKST[s];
    for (const [verdi, maks] of [[t.topp.meny, 8], [t.topp.lastNed, 10], [t.bunn.knapp, 18], [t.fast.knapp, 18], [t.innhold.knapp, 18], [t.bunn.guider, 20], [t.bunnlinje, 50], [t.hent.tittel, 28], [t.hent.ingress, 90]]) assert.ok(verdi.length <= maks, verdi);
  });
}
// test/hyller.test.mjs
for (const s of ['sv', 'da', 'en']) test(`${s}: hver hylle og lenke har tekst, og hver synlige lenke finnes`, () => { /* seks hyller, navn ≤ 18, tekst ≤ 24, filen finnes */ });
```

- [ ] **Step 2: Kjør og se dem feile.** Expected: `RangeError` for sv, da og en.
- [ ] **Step 3: Skriv tekstene etter `matlyst-sprak`.** Translator, Term Researcher, Reviewer, Revision, én runde per språk. Term Researcher sjekker mot `lib/sprak/<kode>/tekster.json` i app-repoet og `common` i L.
- [ ] **Step 4: Kjør og se dem bestå.** Run: `node --test test/skall.test.mjs test/hyller.test.mjs test/locale-pages.test.mjs` Expected: PASS.
- [ ] **Step 5: Bevis at plass-testen kan bli rød.** Gjør `SKALLTEKST.da.topp.lastNed` 14 tegn lang, se testen feile, sett tilbake.
- [ ] **Step 6: Bilder.** Skriv en prøveside per språk til `qa/forhandsvisning/skall-<sprak>/index.html` (skallet rundt en `<main>` med én H1), legg dem i `kart.json` med `type: 'forside'` og `fulltSkall` usann, og ta bilder på 360 og 1280 px med menyen, «Alle guider» og QR-vinduet åpent.
- [ ] **Step 7: Commit**

```bash
git add scripts/skall-tekst.mjs scripts/hyller.mjs test
git commit -m "skallet og hyllene på svensk, dansk og engelsk"
```

---

### Task 6: `skall-paa`, del 1: uttrekk, bevaring og B1

**Bygger: Codex.** Gransker: Claude.

**Files:**
- Create: `scripts/skall-paa.mjs` (uttrekk og omforming), `test/skall-paa-uttrekk.test.mjs`, `test/hjelp/overskrifter.mjs`
- Create: `test/fixtures/skall-paa/` med disse sidene kopiert fra repoet, endelse `.html.fiks`: `omregner-nb` (`/verktoy/kopp-til-dl/`), `lang-sv` (`/sv/spara-recept-fran-instagram/`), `kort-en` (`/en/meal-plan-app/`), `blogg-artikkel-da` (`/da/blog/kernetemperatur/`), `blogg-indeks-nb` (`/blogg/`), `juss-nb` (`/vilkar.html`), `juss-en` (`/en/terms/`), `gammel-nb` (`/finn-oppskrifter/`), `gammel-skapere` (`/skapere/`), `uten-guider` (`omregner-nb` med `guider:bunn`-blokka fjernet), `tjeneste-404` (`/404.html`), og `omregner-nb-generert`: siden slik N skriver den før noen etterbehandler, laget ved å kjøre N i en midlertidig kopi av repoet (som `seo-blogg` gjør) og kopiere fila derfra.

**Interfaces:**
- Consumes: `sidetype`, `tjenestefamilie` (1), `SKALLTEKST.<sprak>.innhold.knapp` (3 og 5).
- Produces fra `scripts/skall-paa.mjs`:
  - `export function trekkUt(html: string, sti: string): Deler` der `Deler = { sprak, type, kropp, innhold, banner: string | null, harSiteJs: boolean, guider: string, sprakvelgere: { topp: string, bunn: string }, hale: string }`. Kaster for `tjeneste`.
  - `export function ctaOmrader(innhold: string, type: Sidetype): { start: number, slutt: number, verdi: 'app-cta' | 'side-cta' | 'helt' }[]`: elementene som åpner med `<section class="app-cta"`, `<section class="page-cta"` eller `<div class="page-cta"` (avgrenset med balanserte tagger av samme navn), og på `guide-gammel` også `header.hero`.
  - `export function byttButikkmerker(innhold: string, sprak: Sprak, type: Sidetype): string` (B1): i hvert område fra `ctaOmrader` erstattes hele `<div class="store-badges">…</div>` med `<a class="knapp" href="/app" data-hent="${verdi}">${innhold.knapp}</a>`. En `.store-badges` utenfor områdene står urørt. Står knappen alt, gjør funksjonen ingenting.
- Produces fra `test/hjelp/overskrifter.mjs`: `export function overskrifter(html): string[]` (`'h2:Omregningstabell: kopp til dl'`; tekst normalisert for mellomrom og tagger).

Regler for `trekkUt`:
- **Innhold:** med `<!-- skall:topp -->` er det mellom `<!-- /skall:topp -->` og `<!-- skall:bunn -->`. Ellers mellom første `</nav>` etter `<body` og første `<footer` etter det. Mangler en av dem, kaster den `Error` med stien.
- **`site.js`:** `/<script\b[^>]*\bsrc="\/site\.js"[^>]*>\s*<\/script>/`.
- **Banner:** elementet som åpner med `<div` og har `id="cookie"`, avgrenset ved å telle `div` til balanse. Begge norske familier (generert: tre `</div>`; eldre: `h3 + p + div.cookie-actions`, to `</div>`) og de lokale gjenkjennes slik, og tas med ordrett.
- **Språkvelgere og guider:** blokkene mellom sine markører, ordrett, eller tom streng.

Variasjonen på de eldre sidene (M2): `/importer-fra-matprat/`, `/finn-oppskrifter/` og `/hva-kan-jeg-lage/` har butikkmerker i `header.hero` og en `div.page-cta`. `/skapere/` har ingen av delene; der endrer B1 ingenting.

- [ ] **Step 1: Skriv testene som feiler**

```js
// test/skall-paa-uttrekk.test.mjs
const FULLE = ['omregner-nb', 'lang-sv', 'kort-en', 'blogg-artikkel-da', 'blogg-indeks-nb', 'juss-nb', 'juss-en', 'gammel-nb', 'gammel-skapere', 'uten-guider'];
// Maskerer bare butikkboksene innenfor de tillatte områdene, med samme avgrensning som produksjonen.
const masker = (innhold, type) => { let ut = innhold; for (const o of ctaOmrader(innhold, type).reverse()) ut = ut.slice(0, o.start) + ut.slice(o.start, o.slutt).replace(/<div class="store-badges">[\s\S]*?<\/div>|<a class="knapp" href="\/app" data-hent="[a-z-]+">[^<]*<\/a>/g, '§') + ut.slice(o.slutt); return ut; };

test('innholdet er likt bortsett fra butikkmerkene i de tillatte områdene', () => {
  for (const f of FULLE) { const d = trekkUt(fiks(f), STI[f]); const ut = byttButikkmerker(d.innhold, d.sprak, d.type); assert.equal(masker(ut, d.type), masker(gammeltInnhold(fiks(f)), d.type), f); }
});
test('en butikkboks utenfor nedlastingsboksene står urørt', () => {
  const innhold = '<p>x</p><div class="store-badges"><a class="btn-store" href="https://apps.apple.com/x">A</a></div><section class="page-cta"><h2 class="disp">Hent</h2><div class="store-badges"><a class="btn-store" href="https://apps.apple.com/x">A</a></div></section>';
  const ut = byttButikkmerker(innhold, 'nb', 'guide-kort');
  assert.ok(ut.startsWith('<p>x</p><div class="store-badges"><a class="btn-store" href="https://apps.apple.com/x">A</a></div>'));
  assert.match(ut, /<section class="page-cta"><h2 class="disp">Hent<\/h2><a class="knapp" href="\/app" data-hent="side-cta">Last ned gratis<\/a><\/section>/);
});
test('B1: begge CTA-formene og helten får knappen, og omformingen er idempotent', () => {
  for (const [f, verdi] of [['kort-en', 'side-cta'], ['blogg-artikkel-da', 'app-cta'], ['gammel-nb', 'side-cta'], ['gammel-nb', 'helt']]) {
    const d = trekkUt(fiks(f), STI[f]); const ut = byttButikkmerker(d.innhold, d.sprak, d.type);
    assert.match(ut, new RegExp(`<a class="knapp" href="/app" data-hent="${verdi}">${SKALLTEKST[d.sprak].innhold.knapp}</a>`), `${f} ${verdi}`);
    assert.equal(byttButikkmerker(ut, d.sprak, d.type), ut);
  }
  const d = trekkUt(fiks('gammel-skapere'), STI['gammel-skapere']);
  assert.equal(byttButikkmerker(d.innhold, 'nb', 'guide-gammel'), d.innhold);
});
test('overskriftene er de samme før og etter', () => { /* overskrifter(byttButikkmerker(...)) == overskrifter(gammeltInnhold(...)) for FULLE */ });
test('begge norske bannerfamilier og de lokale tas med ordrett', () => {
  assert.match(trekkUt(fiks('omregner-nb'), STI['omregner-nb']).banner, /^<div class="cookie" id="cookie" hidden><div class="cookie-inner" id="samtykke"><p>Vi bruker nødvendig lagring[\s\S]*<\/div><\/div><\/div>$/);
  assert.match(trekkUt(fiks('gammel-nb'), STI['gammel-nb']).banner, /^<div class="cookie" id="cookie" hidden>\s*<h3>Vi bruker informasjonskapsler<\/h3>[\s\S]*Bare nødvendige<\/button>\s*<\/div>\s*<\/div>$/);
  assert.ok(trekkUt(fiks('lang-sv'), STI['lang-sv']).banner.includes(lesCommon('sv').consent));
  assert.equal(trekkUt(fiks('juss-nb'), STI['juss-nb']).banner, null);
});
test('site.js gjenkjennes med og uten defer', () => { /* gammel-nb (uten defer) og omregner-nb (med) er true, juss-nb false */ });
test('en side uten guideblokk gir tom guider', () => { assert.equal(trekkUt(fiks('uten-guider'), STI['uten-guider']).guider, ''); });
test('tjenestesider forgrenes før rammen letes etter', () => { assert.throws(() => trekkUt(fiks('tjeneste-404'), '/404.html'), /tjeneste/); });
```

`fiks(navn)` leser fiksturen; `STI` er tabellen over; `gammeltInnhold` bruker samme grenseregel som `trekkUt`, skrevet uavhengig i testen.

- [ ] **Step 2: Kjør og se dem feile.** Run: `node --test test/skall-paa-uttrekk.test.mjs`
- [ ] **Step 3: Skriv `trekkUt`, `ctaOmrader` og `byttButikkmerker`.**
- [ ] **Step 4: Kjør og se dem bestå.**
- [ ] **Step 5: Bevis at vaktene kan bli røde.** (a) Avgrens banneret med tre faste `</div>`: den eldre familien feiler. (b) La `byttButikkmerker` bytte alle `.store-badges`: «en butikkboks utenfor…» feiler. (c) La den også fjerne `<h2 class="disp">` i CTA-en: overskriftstesten feiler. Sett tilbake.
- [ ] **Step 6: Bilder.** Ingen side endres. Bilder tas i oppgave 7b, når forhåndsvisningen finnes.
- [ ] **Step 7: Commit**

```bash
git add scripts/skall-paa.mjs test/skall-paa-uttrekk.test.mjs test/hjelp/overskrifter.mjs test/fixtures/skall-paa
git commit -m "skall-paa: uttrekk av innhold, banner og blokker, og knapp i stedet for butikkmerker"
```

---

### Task 7a: `skall-paa`, del 2: rendering og idempotens

**Bygger: Codex.** Gransker: Claude.

**Files:**
- Modify: `scripts/skall-paa.mjs` (rendering, `kjor`, CLI uten forhåndsvisning)
- Create: `test/skall-paa.test.mjs`
- Modify: `package.json` (`"skall": "node scripts/skall-paa.mjs"`)

**Interfaces:**
- Consumes: `trekkUt`, `byttButikkmerker` (6), skallfunksjonene (3 til 5), `settInn` (3), `nokkel`, `erUtrullet` (1).
- Produces fra `scripts/skall-paa.mjs`:
  - `export function rendre(html: string, sti: string, utrullet: ReadonlySet<string> = UTRULLET): string`. Returnerer `html` uendret når `erUtrullet(sti, html, utrullet)` er usann.
  - `export function kjor(rot: string, utrullet = UTRULLET): string[]` (endrede filer). Går over `alleSider(rot)`.
  - CLI: `node scripts/skall-paa.mjs` skriver `skall-paa: N sider oppdatert`.
- Markører: `<!-- skall:stil -->`, `<!-- skall:topp -->`, `<!-- skall:bunn -->` med `/`-motstykker. `<body>` får `data-sidetype="<type>"` og mister `data-app-uttrykk="1"`.

`rendre` for fullt skall:
1. `trekkUt`, så `byttButikkmerker(innhold, sprak, type)`.
2. **Språkvelgere:** `sprakvelger(sprak, plass, gruppe.sider)` når siden har gruppe i `SIDEGRUPPER`; ellers de gamle blokkene ordrett.
3. **Kropp** (samme nesting som prototypen og testsiden i dagens `test/skall.test.mjs`: fast knapp, QR-vindu og banner står inne i `.side`): `kropp` + `<!-- skall:topp --><div class="side"><div class="kort"><div class="blad">${topp(sprak, { sprakvelger: topp })}<!-- /skall:topp -->` + innhold + `<!-- skall:bunn --></div>${hylledel(sprak, { guider })}</div>${morkBunn(sprak, { sprakvelger: bunn, samtykkelenke: harSiteJs })}${nedlasting(sprak)}${banner ?? (harSiteJs ? samtykke(sprak) : '')}</div><!-- /skall:bunn -->` + `hale`.
4. **Hode:** én stabil blokk, bygget likt hver gang: `<!-- skall:stil --><link rel="stylesheet" href="/tokens.css"><link rel="stylesheet" href="/skall.css"><link rel="stylesheet" href="/side.css"><script src="/skall.js" defer></script><link rel="apple-touch-icon" href="/images/apple-touch-icon.png"><!-- /skall:stil -->`. Før blokka settes inn, fjernes alle `<link rel="apple-touch-icon"…>` utenfor den, `/styles.css`, den innebygde `<style>` med `@font-face` (de tre norske juridiske sidene) og en eventuell gammel blokk. Plassen er den første av: der blokka sto, der `/styles.css` sto, der den innebygde stilen sto, foran `</head>`. Siden har da nøyaktig én blokk og ett ikon, uansett inngang. `skall-paa` eier `apple-touch-icon` på utrullede sider; `topp()` eier logoen.

`rendre` for `tjeneste` (brukt fra oppgave 16): bare hodet, med blokka `<!-- skall:stil --><link rel="stylesheet" href="/tokens.css"><link rel="stylesheet" href="/tjeneste.css"><!-- /skall:stil -->` (der `/styles.css` sto, ellers foran første stilark, ellers foran `</head>`), `data-tjeneste="<familie>"` på `<body>`, og språkvelgerne rendret som over. `tjeneste:vervekort` og `tjeneste:verifisering` returneres alltid uendret (vervekortene skrives av sin generator).

- [ ] **Step 1: Skriv testene som feiler**

```js
// test/skall-paa.test.mjs
const ALLE = new Set(alleSider(rot).map((s) => s.nokkel).filter((n) => n !== 'forside' && n !== 'tjeneste:verifisering'));
const sider = alleSider(rot).filter((s) => s.type !== 'forside');

test('to kjøringer gir like bytes, for alle sider i minnet', () => {
  for (const s of sider) { const en = rendre(les(s.fil), s.sti, ALLE); assert.equal(rendre(en, s.sti, ALLE), en, s.sti); }
});
test('overskriftene er de samme før og etter på alle sider', () => {
  for (const s of sider) assert.deepEqual(overskrifter(rendre(les(s.fil), s.sti, ALLE)), overskrifter(les(s.fil)), s.sti);
});
test('banneret står ordrett, og bare der det sto', () => {
  for (const s of sider.filter((x) => x.type !== 'tjeneste')) assert.equal(trekkUt(rendre(les(s.fil), s.sti, ALLE), s.sti).banner, trekkUt(les(s.fil), s.sti).banner, s.sti);
});
test('nestingen er prototypens: fast knapp, QR-vindu og banner inne i .side', () => {
  const ramme = (html) => strukturtre(html, ['side', 'kort', 'blad', 'topp', 'bunn', 'under', 'fast', 'hent', 'cookie']); // nøstet liste av klasser, bygget med en taggstabel
  assert.deepEqual(ramme(rendre(fiks('omregner-nb'), STI['omregner-nb'], ALLE)),
    [['side', [['kort', [['blad', [['topp', []]]], ['bunn', []]]], ['under', []], ['fast', []], ['hent', []], ['cookie', []]]]]);
});
test('én stilblokk og ett ikon, også ved gjentatt kjøring og fra alle innganger', () => {
  for (const f of ['omregner-nb', 'juss-nb', 'gammel-nb', 'lang-sv']) {
    const en = rendre(fiks(f), STI[f], ALLE), to = rendre(en, STI[f], ALLE);
    for (const ut of [en, to]) {
      for (const borte of ['class="nav-right"', 'id="dl-bar"', 'class="f-kolonner"', 'href="/styles.css"', 'data-app-uttrykk', '@font-face']) assert.ok(!ut.includes(borte), `${f}: ${borte}`);
      assert.equal(ut.split('<!-- skall:stil -->').length - 1, 1, f);
      assert.equal((ut.match(/rel="apple-touch-icon"/g) ?? []).length, 1, f);
      assert.ok(ut.indexOf('<!-- /skall:stil -->') < ut.indexOf('</head>'), f);
    }
  }
});
test('guidene: begge kjørerekkefølger gir samme side, også uten blokk fra før', () => {
  const ny = '<!-- guider:bunn --><div class="f-guider">x</div><!-- /guider:bunn -->';
  for (const f of ['lang-sv', 'uten-guider']) {
    const h = fiks(f), sti = STI[f];
    assert.equal(rendre(settInn(h, ny), sti, ALLE), settInn(rendre(h, sti, ALLE), ny), f);
    assert.match(settInn(rendre(h, sti, ALLE), ny), /<details class="alle-guider"><summary>[^<]+<\/summary><!-- guider:bunn -->/);
  }
});
test('hver utrullet side er nøyaktig det skall-paa lager', () => {
  assert.deepEqual(sider.filter((s) => erUtrullet(s.sti, les(s.fil)) && rendre(les(s.fil), s.sti) !== les(s.fil)).map((s) => s.sti), [], 'kjør: node scripts/skall-paa.mjs');
});
test('ingen utrullet side laster styles.css', () => {
  assert.deepEqual(sider.filter((s) => erUtrullet(s.sti, les(s.fil)) && /href="\/styles\.css"/.test(les(s.fil))).map((s) => s.sti), []);
});
// Erstatter «hver indekserbar side har nedlastingsknapp og fast linje» i app-uttrykk.test.mjs,
// som hoppet over sider uten class="nav-right" (de tre norske juridiske sidene).
test('utrullede sider med fullt skall har nedlasting i toppen, i bunnen og fast på mobil', () => {
  for (const s of sider.filter((x) => x.type !== 'tjeneste' && erUtrullet(x.sti, les(x.fil)))) for (const v of ['topp', 'bunn', 'fast']) assert.equal(les(s.fil).split(`data-hent="${v}"`).length - 1, 1, `${s.sti}: ${v}`);
});
test('overgang: indekserbare sider som ikke er rullet ut, har den faste linja som før', () => {
  for (const s of sider.filter((x) => x.type !== 'tjeneste' && !erUtrullet(x.sti, les(x.fil)))) {
    const h = les(s.fil);
    if (!/<meta name="robots" content="[^"]*noindex/.test(h) && /apps\.apple\.com/.test(h)) assert.ok(h.includes('id="dl-bar"'), s.sti);
  }
});
```

- [ ] **Step 2: Kjør og se dem feile.** Run: `node --test test/skall-paa.test.mjs`
- [ ] **Step 3: Skriv rendering, `kjor` og CLI.**
- [ ] **Step 4: Kjør og se dem bestå.** Run: `npm test && node scripts/skall-paa.mjs && git status --short` Expected: PASS, `0 sider oppdatert`.
- [ ] **Step 5: Bevis at vaktene kan bli røde.** (a) Mellomrom etter `<!-- /skall:topp -->` bare når markøren finnes: idempotenstesten feiler. (b) La ikonet stå utenfor blokka når det fantes i inngangen: «én stilblokk og ett ikon» feiler på `vilkar` ved andre kjøring. (c) Legg `omregner` i `UTRULLET` uten å kjøre skriptet: «hver utrullet side…» feiler med 714 stier. Sett tilbake.
- [ ] **Step 6: Bilder.** Ingen side endres; bilder i 7b.
- [ ] **Step 7: Commit**

```bash
git add scripts/skall-paa.mjs test/skall-paa.test.mjs package.json
git commit -m "skall-paa: rendering med stabil stilblokk og idempotens"
```

---

### Task 7b: `skall-paa`, del 3: overgang, generatorkjede og forhåndsvisning

**Bygger: Codex.** Gransker: Claude.

**Files:**
- Modify: `scripts/skall-paa.mjs` (`--forhandsvis`), `scripts/app-uttrykk.mjs` (overgangsvakt og skanneområde), `test/app-uttrykk.test.mjs`, `test/seo-blogg.test.mjs`
- Create: `scripts/kjedeproeve.mjs`, `side.css` (bare `/* == Grunnstil == */`-kommentaren; fylles i oppgave 8, men finnes så forhåndsvisningen ikke får 404)
- Test: `test/app-uttrykk-overgang.test.mjs` (ny)

**Interfaces:**
- Produces fra `scripts/skall-paa.mjs`: `kjor(rot, utrullet, { forhandsvis }: { forhandsvis?: string } = {})`. Med `forhandsvis` rendres eksempelsidene for alle nøkler unntatt tjenestefamilier som ikke er rullet ut (`erUtrullet` avgjør; `tjeneste.css` finnes først fra oppgave 16) og skrives etter forhåndsvisningskontrakten i oppgave 2b (speilet sti, `kart.json`, `noindex`, uten `locale.js`). CLI: `node scripts/skall-paa.mjs --forhandsvis qa/forhandsvisning`.
- Produces fra `scripts/app-uttrykk.mjs` (K5): `behandle(html, sti, utrullet = UTRULLET)`; første linje `if (erUtrullet(sti, html, utrullet)) return html;`. `erUtrullet` gir `false` for alt `sidetypeEllerNull` ikke kjenner (`/x/`, fiksturer), så slike sider behandles som i dag. `kjor(rot)` går over `alleSider(rot)` i stedet for sin egen `htmlFiler`, så dokumentasjon, tester og `qa` ikke lenger skannes.
- Produces fra `scripts/kjedeproeve.mjs`: `node scripts/kjedeproeve.mjs <nøkkel>` kopierer repoet til en midlertidig mappe uten `.git` (med lenke til `node_modules`), kjører `guidelenker`, `lenker-sett`, `skall-paa`, `app-uttrykk`, `app-bevis`, `bilde-attributter` og `sprak-signaler` der, og sammenligner sidene med nøkkelen med arbeidskopien. Skriver `0 avvik for <nøkkel>` eller lista, og avslutter med kode 1 ved avvik i nøkkelen.

- [ ] **Step 1: Skriv testene som feiler**

```js
// test/app-uttrykk-overgang.test.mjs
const generert = fiks('omregner-nb-generert'); // slik N skriver siden, uten noen etterbehandling
const sti = '/verktoy/kopp-til-dl/';

test('en regenerert side av en type som ikke er rullet ut, får hele den gamle behandlingen', () => {
  const ut = behandle(generert, sti, new Set());
  for (const del of ['class="nav-meny"', 'class="nav-dl"', 'class="f-kolonner"', 'id="dl-bar"', 'class="brand-ml"', 'data-app-uttrykk="1"']) assert.ok(ut.includes(del), del);
});
test('en utrullet type røres ikke', () => {
  assert.equal(behandle(generert, sti, new Set(['omregner'])), generert);
});
test('en side utenfor registeret behandles som før', () => {
  const side = '<html lang="nb"><head></head><body><nav><div class="nav-right"></div></nav><main><a href="https://apps.apple.com/app/matlyst/id1">a</a><a href="https://play.google.com/store/apps/details?id=app.matlyst">p</a></main><footer></footer></body></html>';
  assert.match(behandle(side, '/x/', new Set(TYPER)), /class="nav-dl"/);
});
test('kjor skanner bare publiserbare sider', () => {
  const kilde = utenKommentarer(les('scripts/app-uttrykk.mjs'));
  assert.match(kilde, /alleSider\(/);
  assert.doesNotMatch(kilde, /function htmlFiler/);
});
```

`test/app-uttrykk.test.mjs`: testen «hver indekserbar side har nedlastingsknapp og fast linje» fjernes (erstattet i `test/skall-paa.test.mjs`, oppgave 7a). De andre står uendret, med `/x/` som før.

`test/seo-blogg.test.mjs`, `byggMidlertidigNettsted()`: etter N og L kjøres `guidelenker`, `lenker-sett`, `skall-paa`, `app-uttrykk`, `app-bevis`, `bilde-attributter` og `sprak-signaler` i den midlertidige kopien. «auto-artikkel får ikke forbudte merkenavn fra guidebunnteksten» vokter at autoartikkelen ikke får kilde- og konkurrentnavn fra guidelista; den sjekker nå bare innholdet (`trekkUt(html, sti).innhold`), fordi hyllene i skallet med vilje lenker til Matprat-guiden. Ny test: «den genererte autoartikkelen er det skall-paa lager» (aktiv når `erUtrullet` gir sann for den, dvs. fra oppgave 14).

- [ ] **Step 2: Kjør og se dem feile.** Run: `node --test test/app-uttrykk-overgang.test.mjs test/app-uttrykk.test.mjs test/seo-blogg.test.mjs`
- [ ] **Step 3: Skriv overgangsvakten, skanneområdet, `kjedeproeve.mjs` og `--forhandsvis`.**
- [ ] **Step 4: Kjør og se dem bestå.** Run: `npm test && node scripts/app-uttrykk.mjs && git status --short` Expected: PASS, `app-uttrykk: 0 sider oppdatert`.
- [ ] **Step 5: Bevis at overgangsvakten kan bli rød.** Fjern første linje i `behandle`: «en utrullet type røres ikke» feiler. Sett tilbake.
- [ ] **Step 6: Bilder.** Run: `node scripts/skall-paa.mjs --forhandsvis qa/forhandsvisning && REVISJON=forhandsvisning npx playwright test revisjon.spec --grep skjermbilder`. Innholdet er ustylet (tom `side.css`); granskeren ser at skallet står riktig rundt det, at «Alle guider» ligger i hylledelen og at B1-knappen står i boksen med tittelen sin.
- [ ] **Step 7: Commit**

```bash
git add scripts/skall-paa.mjs scripts/kjedeproeve.mjs scripts/app-uttrykk.mjs side.css test
git commit -m "skall-paa: overgang mot app-uttrykk, kjede i kopi og forhåndsvisning"
```

---

### Task 8: Grunnstilen

**Bygger: Codex.** Gransker: Claude.

**Files:**
- Modify: `side.css` (fyller `/* == Grunnstil == */`), `skall.css` (bannerstil for begge familier)
- Create: `test/side-css.test.mjs`, `test/hjelp/klassedekning.mjs`

**Interfaces:**
- Produces: `side.css` med delene, i rekkefølge: `/* == Grunnstil == */` (her), `/* == Omregner == */` (9), `/* == Lang guide == */` (11), `/* == Kort guide == */` (12), `/* == Eldre sider == */` (13), `/* == Blogg == */` (14), `/* == Juss == */` (15). Typeavhengige regler velges med `body[data-sidetype="<type>"]`.
- Produces fra `test/hjelp/klassedekning.mjs`: `export function klasserUtenRegel(type: Sidetype, unntak: Record<string, string>): string[]` (klassene i innholdet på alle sider av typen, minus klasser som står som `.klasse` i en velger i `side.css` eller `skall.css`, minus `unntak`). Innholdet leses med `trekkUt`.

| Klasse i dag | Nytt utseende | Prototypens regel |
|---|---|---|
| `header.locale-page-hero` med `.eyebrow`, `h1.disp`, `.lead` | Midtstilt topp. Overlinje `--dempet`, 15 px, uten versaler. H1 38 til 62 px. Ingress 20 px (18 på mobil), maks 44 tegn. | `.ohelt`, `.sti` |
| `section.prose.locale-prose`, `main.prose` | Lesekolonne maks 68 tegn, 19 px, linjeavstand 1,6. H2 26 til 34 px, 64 px over (48 på mobil). `h2[id], h3[id]` får `scroll-margin-top` lik toppens høyde + 16 px. Lenker i brødtekst understreket. | `.lese`, `.punkter` |
| `.answer` | 19 px, midtstilt, maks 52 tegn. | `.kortsvar` |
| `.table-wrap > table`, `table` i `.locale-prose` | `--blekk`-strek under hodet, `--linje` mellom radene, siste kolonne høyrestilt og fet. `.table-wrap` ruller sidelengs i egen boks. | `.otabell` |
| `aside.i-appen` | Kort, 40 px radius, svak toning i hjørnene (`--kule1`, `--kule3`), bildet til høyre på PC, under på mobil. | `.oappkort` |
| `.app-cta`, `.page-cta` (med B1-knappen) | Samme kort. Knappen er skallets `.knapp`. | `.oappkort` |
| `.faq` med `details`/`summary` | `--linje` mellom spørsmålene, pluss som blir kryss (`::after`). | `.svarliste` |
| `.related`, `.omregner-liste` | Rad med piller, 48 px. | `.kjede` |
| `.steps > .step` | Nummererte steg med svart sirkel. | |
| `.cookie` (sidens eget banner, begge familier) | Ny stil i `skall.css`: samme kort som forsidens banner, like knapper (`samtykkeVekt`). Den eldre familiens `h3` får samme stil som tittelen i forsidens banner. | |

- [ ] **Step 1: Skriv testene som feiler**

```js
// test/side-css.test.mjs
const css = utenKommentarer(les('side.css'));
const velgere = [...css.matchAll(/(?:^|\})\s*([^{}@]+)\{/g)].flatMap((m) => m[1].split(',').map((v) => v.trim()));
test('side.css bruker bare tokens fra tokens.css', () => { /* alle var(--x) definert i tokens.css; ingen heks; ingen rgb( uten var( */ });
test('skriftstørrelser i side.css er i rem', () => { assert.deepEqual([...css.matchAll(/font(?:-size)?:[^;}]*?\d+(?:\.\d+)?px/g)].map((m) => m[0]), []); });
test('side.css rører ikke skallet', () => {
  assert.deepEqual(velgere.filter((v) => /(^|[\s>+~])(nav|footer)(?![\w-])|\.(topp|panel|reol|fag|faghode|bunn|bunnrad|alle-guider|under|underlinje|fast|hent|henttittel|side|kort|blad|knapp|cookie|ck-btn|merke|ordmerke)(?![\w-])/.test(v)), []);
});
test('bevegelse står stille ved redusert bevegelse', () => { /* som før */ });
test('klassedekningen ser en klasse uten regel', () => { assert.ok(klasserUtenRegel('guide-kort', {}).length > 0); });
```

- [ ] **Step 2: Kjør og se dem feile.** Run: `node --test test/side-css.test.mjs`
- [ ] **Step 3: Skriv grunnstilen og bannerstilen.**
- [ ] **Step 4: Kjør og se dem bestå.**
- [ ] **Step 5: Bevis at tokenvakten kan bli rød.** Skriv `color:#B03B00` i en regel, se den feile, fjern.
- [ ] **Step 6: Bilder og revisjon av forhåndsvisningen.** Run: `node scripts/skall-paa.mjs --forhandsvis qa/forhandsvisning && REVISJON=forhandsvisning npx playwright test revisjon.spec` Expected: PASS for grunnstilens felles kontroller på alle forhåndsvisninger, unntatt klassene som får regler i 9 og 11 til 15 (de står som kjent avvik i PR-en). Granskeren godkjenner grunnstilen før omregnerne.
- [ ] **Step 7: Commit**

```bash
git add side.css skall.css test/side-css.test.mjs test/hjelp/klassedekning.mjs
git commit -m "grunnstilen for undersidene"
```

---

### Task 9: Omregneren og den faste knappen på undersider

**Bygger: Codex.** Gransker: Claude.

**Files:**
- Modify: `side.css` (`/* == Omregner == */`), `skall.js` (startsignal for fast knapp)
- Test: `test/side-css.test.mjs`, `test/playwright/undersider.spec.mjs` (ny)

**Interfaces:**
- Produces i `skall.js` (B5): når `document.body.dataset.sidetype` finnes, er startpunktet første treff av `.blad :is(header.locale-page-hero, header.hero, main.doc .doc-title, main.legal-doc > header, main h1)`, ellers `header.topp`. Den faste knappen vises når startpunktets underkant er over skjermen, og skjules når `.bunn [data-hent]` er mindre enn 40 px under skjermkanten. Forsiden (uten `data-sidetype`) beholder dagens regel. `skall.js` sender ingen målinger.
- Omregneren (bare `body[data-sidetype="omregner"]`): `form.omregner` er et grått kort (`--hylle`, 32 px radius, 28 px innvendig, 14 px på mobil). `.omregner-rad` er et rutenett: PC `minmax(0,1.2fr) minmax(0,1fr) auto minmax(0,1fr)`; under 720 px står Mengde over Fra, så knappen, så Til. Feltene er hvite flater med 24 px radius og minst 44 px; tallet i Mengde er stort (2,75 til 4,5 rem). `.omregner-bytt` er en sirkel på 52 px. `.omregner-svar` står i en `--blekk`-flate med lys tekst, 1,75 til 2,75 rem, fet, og brytes i stedet for å kuttes. `.toc` skjules.

- [ ] **Step 1: Skriv testene som feiler**

```js
// test/side-css.test.mjs
test('omregnersidene har stil for alle klassene i innholdet', () => {
  assert.deepEqual(klasserUtenRegel('omregner', {
    'omregner-data': 'bare data for kalkulatoren i site.js',
    'i-mapper': 'velger bilde i app-bevis', 'i-skalering': 'velger bilde i app-bevis', 'i-enheter': 'velger bilde i app-bevis',
  }), []);
});

// test/playwright/undersider.spec.mjs. Adressene leses fra qa/forhandsvisning/kart.json til typene er rullet ut,
// deretter fra de ekte stiene (hjelperen adresse(sti) velger).
test('omregneren regner fortsatt, med samme tallformat som før', async ({ page }) => {
  await page.goto(adresse('/verktoy/kopp-til-dl/'));
  await page.locator('[data-felt=verdi]').fill('2');
  await expect(page.locator('[data-felt=svar]')).toContainText('4.732');
});
test('fast knapp: skjult i toppen, synlig når helten er forbi, skjult før knappen i bunnen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto(adresse('/lagre-oppskrifter-fra-instagram/'));
  await expect(page.locator('#fast')).not.toHaveClass(/\bvis\b/);
  await page.locator('header.locale-page-hero').evaluate((e) => scrollTo(0, e.getBoundingClientRect().bottom + scrollY + 10));
  await expect(page.locator('#fast')).toHaveClass(/\bvis\b/);
  await page.locator('.bunn [data-hent]').scrollIntoViewIfNeeded();
  await expect(page.locator('#fast')).not.toHaveClass(/\bvis\b/);
});
test('fast knapp virker på en eldre side der nedlastingsboksen står utenfor main', async ({ page }) => { /* samme forløp på /finn-oppskrifter/ med header.hero som start */ });
```

- [ ] **Step 2: Kjør og se dem feile.**
- [ ] **Step 3: Skriv omregnerstilen og startsignalet.**
- [ ] **Step 4: Kjør og se dem bestå.** Run: `node scripts/skall-paa.mjs --forhandsvis qa/forhandsvisning && node --test test/side-css.test.mjs && npx playwright test undersider`
- [ ] **Step 5: Bevis at fastknapp-testen kan bli rød.** La startsignalet bruke `main [data-hent]` igjen, se testen på den eldre siden feile, sett tilbake.
- [ ] **Step 6: Bilder.** Forhåndsvisningen av omregneren på 360, 390 og 1280 px, med tallene 2 og 1500 i feltet.
- [ ] **Step 7: Commit**

```bash
git add side.css skall.js test
git commit -m "omregneren i ny stil og fast knapp som passer undersidene"
```

---

### Task 10: Utrulling: omregnerne (714 sider)

**Bygger: Codex.** Gransker: Claude.

**Files:**
- Modify: `scripts/sidetyper.mjs` (`UTRULLET` får `omregner`), sidene under `verktoy/`, `sv/verktyg/`, `da/vaerktoejer/`, `en/tools/`, `test/playwright/sprakvalg.spec.mjs` (fjern `test.skip` fra oppgave 4)

- [ ] **Step 1: Skriv testen som feiler.** Legg `omregner` i `UTRULLET`. Run: `node --test test/skall-paa.test.mjs` Expected: FAIL på «hver utrullet side er nøyaktig det skall-paa lager» (714 stier).
- [ ] **Step 2: Avslutning A til F.** A: `skall-paa: 714 sider oppdatert`. Kjør også `npx playwright test sprakvalg undersider`. `test/locale-pages.test.mjs`, `test/enheter.test.mjs`, `test/app-bevis.test.mjs`, `test/guidelenker.test.mjs`, `test/bilde-attributter.test.mjs` og `test/hreflang-gjensidig.test.mjs` står grønne uendret.
- [ ] **Step 3: Sjekk målingen.** På `/verktoy/kopp-til-dl/` med samtykke gitt: et klikk på `data-hent="side-cta"` og en åpning av QR-vinduet fra `data-hent="topp"` gir hver sin `download_click` med riktig `cta_location` (les `capture`-kallene med en stubbet `posthog` i en nettlesertest i `test/playwright/undersider.spec.mjs`). Uten samtykke: ingen kall.
- [ ] **Step 4: Avslutning G**

```bash
git add scripts/sidetyper.mjs verktoy sv/verktyg da/vaerktoejer en/tools test
git commit -m "omregnerne i nytt skall og ny stil"
```

---

### Task 11: Lange guider og høytider (31 sider)

**Bygger: Codex.** Gransker: Claude.

**Files:**
- Modify: `side.css` (`/* == Lang guide == */`), `skall.js` (innholdsfortegnelse), `scripts/sidetyper.mjs` (`guide-lang`), de 31 sidene
- Test: `test/side-css.test.mjs`, `test/playwright/undersider.spec.mjs`

**Interfaces:**
- Produces i `skall.js`: under 720 px får hver `.toc` en `button.toc-knapp` med `aria-expanded` og `aria-controls`, laget av teksten i `.toc-title`, og lista skjules til knappen trykkes. Over 720 px og uten JavaScript står lista åpen. Ingenting skjer når `.toc` mangler.

| Klasse | Nytt utseende |
|---|---|
| `.toc` | Rolig liste i grått kort (28 px radius), sammenfoldet på mobil. |
| `.answer` | Grått kort, 28 px radius. |
| `.scenario` med `h3 + dl`, `.scenario-note` | Grått kort; `dl` i to kolonner på PC, stablet på mobil. |
| `.founder` | Grått kort med bilde (24 px radius) til venstre på PC, over teksten på mobil. |
| `.phones`, `.shot`, `figure`, `.prose video` | Bilde eller film med 24 px radius innenfor lesekolonnen. |

- [ ] **Step 1: Skriv testene som feiler**

```js
test('lange guider har stil for alle klassene i innholdet', () => { assert.deepEqual(klasserUtenRegel('guide-lang', { /* grunn per klasse */ }), []); });

// test/playwright/undersider.spec.mjs
test('innholdsfortegnelsen foldes på mobil og står åpen på PC', async ({ page }) => { /* som i forrige versjon av planen: aria-expanded false, ol skjult, klikk, synlig; 1280 px: ingen .toc-knapp */ });
test('et trykk i innholdsfortegnelsen legger ikke overskriften under toppen', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/lagre-oppskrifter-fra-instagram/');
  const lenke = page.locator('.toc a').nth(2), id = (await lenke.getAttribute('href')).slice(1);
  await lenke.click();
  const topp = await page.locator('header.topp').boundingBox(), h2 = await page.locator(`[id="${id}"]`).boundingBox();
  expect(h2.y).toBeGreaterThanOrEqual(topp.y + topp.height);
});
test('redusert bevegelse: ingen film spiller', async ({ page }) => { /* emulateMedia reduce; alle video.paused === true etter scrollIntoView */ });
```

- [ ] **Step 2: Kjør og se dem feile.**
- [ ] **Step 3: Skriv CSS og delen i `skall.js`.**
- [ ] **Step 4: Legg `guide-lang` i `UTRULLET` og gjør Avslutning A til F.** A: `31 sider oppdatert`.
- [ ] **Step 5: Bevis at ankertesten kan bli rød.** Fjern `scroll-margin-top`, se den feile, sett tilbake.
- [ ] **Step 6: Avslutning G.**

---

### Task 12: Korte guider, middag, kilder og skapere (56 sider)

**Bygger: Codex.** Gransker: Claude.

**Files:**
- Modify: `side.css` (`/* == Kort guide == */`), `scripts/sidetyper.mjs` (`guide-kort`), de 56 sidene, `test/seo-pages.test.mjs`
- Test: `test/side-css.test.mjs`

| Klasse | Nytt utseende |
|---|---|
| `ol` rett etter `h2` i `.locale-prose` | Nummererte steg med svart sirkel (`counter`), ingen ny markup. |
| `ul.ide-liste` (middag) | Rutenett av grå kort, to kolonner på PC, én på mobil. |
| Kildelenka i kildeguidene | Pille. |

- [ ] **Step 1: Skriv testen som feiler, og oppdater `seo-pages`.** `klasserUtenRegel('guide-kort', {…})` er tom. `test/seo-pages.test.mjs`, «skip-lenken peker på et hovedlandemerke som omslutter sideinnholdet», vokter at `main` omslutter alt innhold. Første assertion står. Den andre blir `assert.match(importerSide, /<section class="page-cta">[\s\S]*<\/section><\/main>\s*<!-- skall:bunn -->/u)`, og en tredje krever `data-hent="side-cta"` inne i `section.page-cta` (B1 bevarer boksen).
- [ ] **Step 2: Kjør og se dem feile.**
- [ ] **Step 3: Skriv CSS-en.**
- [ ] **Step 4: Legg `guide-kort` i `UTRULLET` og gjør Avslutning A til F.** A: `56 sider oppdatert`. `test/engelsk.test.mjs` og `test/lansering.test.mjs` står grønne uendret.
- [ ] **Step 5: Avslutning G.**

---

### Task 13: De fire eldre norske sidene

**Bygger: Claude** (vurdering). Gransker: Codex.

**Files:**
- Modify: `side.css` (`/* == Eldre sider == */`), `scripts/sidetyper.mjs` (`guide-gammel`), `importer-fra-matprat/index.html`, `finn-oppskrifter/index.html`, `hva-kan-jeg-lage/index.html`, `skapere/index.html`
- Test: `test/side-css.test.mjs`, `test/playwright/undersider.spec.mjs`

Sidene har `header.hero#hovedinnhold`, `section.feat`, `main.prose`, FAQ og `div.page-cta` hver for seg mellom toppen og bunnen; alt er innhold. De laster `site.js` uten `defer` og har det eldre banneret med `h3`. Beslutningene tas her, med bilder før og etter for hver side:
- `header.hero` blir midtstilt topp. `h1.disp` med `span.a`, `span.it` vises som vanlig H1, uten kursiv.
- Butikkmerkene i `.hero-actions` er byttet med `data-hent="helt"` (oppgave 6) på Matprat, finn oppskrifter og hva kan jeg lage; knappen står under ingressen. `/skapere/` har verken butikkmerker i helten eller `div.page-cta` (hero, `main.prose` og FAQ); der er det bare stilen som endres.
- `section.feat` blir et kort som `aside.i-appen`.
- `main.prose` blir lesekolonnen.
- Innebygde `<script>`-blokker står. Viser de til `#nav`, noteres det i PR-en; skriptet endres ikke.

- [ ] **Step 1: Skriv testene som feiler**

```js
test('de eldre sidene har stil for alle klassene i innholdet', () => { assert.deepEqual(klasserUtenRegel('guide-gammel', { /* grunn per klasse */ }), []); });
// test/playwright/undersider.spec.mjs
test('eldre side: banneret virker, og samtykket kan trekkes tilbake fra bunnen', async ({ page }) => {
  await page.goto('/finn-oppskrifter/');
  await expect(page.locator('#cookie')).toBeVisible();
  await page.locator('#ck-reject').click();
  await expect(page.locator('#cookie')).toBeHidden();
  await page.locator('footer.under [data-consent-withdraw]').click();
  await expect(page.locator('#cookie')).toBeVisible();
});
```

- [ ] **Step 2: Kjør og se dem feile.**
- [ ] **Step 3: Skriv CSS-en, side for side, med bilder før og etter.**
- [ ] **Step 4: Legg `guide-gammel` i `UTRULLET` og gjør Avslutning A til F.** A: `4 sider oppdatert`. Bilder av alle fire sider i `qa/skjermbilder/guide-gammel/<side>-<bredde>.png`.
- [ ] **Step 5: Avslutning G.**

---

### Task 14: Bloggen (33 sider)

**Bygger: Codex.** Gransker: Claude.

**Files:**
- Modify: `side.css` (`/* == Blogg == */`), `scripts/sidetyper.mjs` (`blogg`), sidene av typen `blogg`
- Test: `test/side-css.test.mjs`, `test/seo-blogg.test.mjs`

| Klasse | Nytt utseende |
|---|---|
| `ul.blogg-kort` | Rutenett av grå kort med bilde (24 px radius), tittel og dato. Tre kolonner på PC, én på mobil. |
| `figure.blogg-forside` | Bilde med 24 px radius i lesekolonnens bredde. |
| `table.blogg-tabell` | Som tabellen i grunnstilen. |
| `.blogg-galleri`, `.blogg-galleri-rad` | Bilderad som sveipes i egen boks på mobil. |
| `.app-cta` med `.app-cta-bilde`, `.app-cta-tekst` | Kortet fra grunnstilen, bildet til høyre på PC. B1-knappen `app-cta`. |
| `.blogg-flere` | Rad med piller. |
| `.merknad` | `--dempet`, 15 px. |

Bloggindeksene har ingen nedlastingsboks i dag og får nedlasting bare fra skallet. Artiklene har `.app-cta`, som får knappen. Revisjonen bruker begge eksemplene (`EKSEMPEL.blogg` og `BLOGGINDEKS`).

- [ ] **Step 1: Skriv testene som feiler.** `klasserUtenRegel('blogg', {…})` er tom. I `test/seo-blogg.test.mjs`: «den genererte autoartikkelen er det skall-paa lager» blir aktiv nå som `blogg` er i `UTRULLET`.
- [ ] **Step 2: Kjør og se dem feile.**
- [ ] **Step 3: Skriv CSS-en.**
- [ ] **Step 4: Legg `blogg` i `UTRULLET` og gjør Avslutning A til F.** A: `33 sider oppdatert`. `test/blogg.test.mjs` står grønn uendret (krever `class="app-cta"`, som står).
- [ ] **Step 5: Avslutning G.**

---

### Task 15: Juridiske sider (12 sider)

**Bygger: Codex.** Gransker: Claude.

**Files:**
- Modify: `side.css` (`/* == Juss == */`), `scripts/sidetyper.mjs` (`juss`), `personvern.html`, `vilkar.html`, `slett-konto.html` og gruppene `personvern`, `vilkar`, `slett-konto` på sv, da, en
- Modify: `test/fonter.test.mjs`
- Test: `test/side-css.test.mjs`, `test/playwright/sprakvalg.spec.mjs`

| Klasse | Nytt utseende |
|---|---|
| `main.doc` med `.doc-kicker`, `h1.doc-title`, `.doc-intro`, `.doc-updated` (nb) | Ren lesekolonne. Overlinje og dato i `--dempet`. |
| `main.legal-doc` med `header`, `section`, `.legal-updated` (sv, da, en) | Samme lesekolonne. |
| `.callout`, `.legal-callout` | Det eneste kortet: `--hylle`, 28 px radius. |

De norske juridiske sidene har verken `site.js` eller banner i dag, og får det ikke; bunnen får da ikke lenka «Informasjonskapsler». Nedlastingsknappene står, men sender ingen måling (ingen `site.js`). Ingen wrapper settes inn i den juridiske teksten.

- [ ] **Step 1: Skriv testene som feiler, og oppdater `fonter`.** `klasserUtenRegel('juss', {…})` er tom. `test/fonter.test.mjs`, «sidene med eget stilark har nøyaktig de samme @font-face som styles.css», vokter at skrifter ikke driver fra hverandre mellom stilark. Ingen publisert side har eget stilark lenger. Ny form: «ingen publisert side har @font-face i en <style>-blokk», som går over `alleSider(ROT)` (ikke over `docs/`, `test/fixtures/` eller prototyper).
- [ ] **Step 2: Kjør og se dem feile.**
- [ ] **Step 3: Skriv CSS-en.**
- [ ] **Step 4: Legg `juss` i `UTRULLET` og gjør Avslutning A til F.** A: `12 sider oppdatert`. `npx playwright test sprakvalg`: «velgeren bruker riktig motstykke på personvernsiden» står grønn med bunnvelgeren i den mørke bunnen.
- [ ] **Step 5: Bevis at tekstlåsene fortsatt ser HTML-en.** Bytt «72 timer» med «72 dager» i `personvern.html`, kjør `node --test test/sikkerhet-og-ansvar.test.mjs`, se den feile, sett tilbake.
- [ ] **Step 6: Avslutning G.**

---

### Task 16: Tjeneste: avmelding, bekreftelse og vervekort (`avmeld.css`-familien)

**Bygger: Codex.** Gransker: Claude.

**Files:**
- Create: `tjeneste.css` (delene `/* == Felles == */` og `/* == Avmeld == */`), `test/tjeneste.test.mjs`
- Modify: `avmeld.css`, `v/vervekort.css`, `scripts/vervekort/generer.mjs`, `v/index.html` og motstykkene (fra generatoren), `scripts/sidetyper.mjs` (`UTRULLET` får `tjeneste:avmeld`, `tjeneste:bekreft` og `tjeneste:vervekort`; de andre tjenestefamiliene er ikke rullet ut, og `erUtrullet` gir usann for dem)
- Modify: `test/fonter.test.mjs`, `test/avmeld-sprak.test.mjs`

**Interfaces:**
- Produces: `tjeneste.css` `/* == Felles == */`: skrift `var(--f)`, `--blekk` på `--flate`, ordmerket, knappestil (svart pille, 44 px, `--blekk-lys` ved peker over). `/* == Avmeld == */`: reglene i `avmeld.css` flyttes ikke, men `avmeld.css` får tokens i stedet for egne farger og variabler, og mister sine `@font-face` (de kommer fra `tokens.css`). Velgerne beholder `.avmeld-rot`-isoleringen; knappestilen gjelder `.avmeld-knapp`, `#knapp` og `.vk-butikker a`, med `body.avmeld-rot` i velgeren så den vinner over dagens regler.
- Vervekort: `side(lang)` får `<link rel="stylesheet" href="/tokens.css">` og `<link rel="stylesheet" href="/tjeneste.css">` foran `avmeld.css`. CSP `'self'` dekker dem. Kjør `node scripts/vervekort/generer.mjs`.
- `/avmeld/`, `/sv/avregistrera/`, `/da/afmeld/`, `/en/unsubscribe/`, `/bekreft/`: `rendre` (lett). De lokale avmeldingssidene mister `/styles.css`; det de brukte derfra (topp med ordmerke og språkvelger), ligger i `/* == Avmeld == */`.

- [ ] **Step 1: Skriv testene som feiler, og oppdater de gamle**

```js
// test/tjeneste.test.mjs
const familie = (navn) => alleSider(rot).filter((s) => tjenestefamilie(s.sti) === navn);
test('avmelding og bekreftelse laster tokens og tjeneste.css, ikke styles.css', () => {
  for (const s of [...familie('avmeld'), ...familie('bekreft'), ...familie('vervekort')]) {
    const h = les(s.fil);
    assert.ok(h.indexOf('href="/tokens.css"') > -1 && h.indexOf('href="/tokens.css"') < h.indexOf('href="/avmeld.css"'), s.sti);
    assert.match(h, /href="\/tjeneste\.css"/, s.sti);
    assert.doesNotMatch(h, /href="\/styles\.css"/, s.sti);
  }
});
test('tokenbærende sider får aldri skall, site.js, banner eller måling', () => {
  for (const s of [...familie('avmeld'), ...familie('bekreft'), ...familie('vervekort'), ...familie('auth')]) {
    const h = les(s.fil);
    for (const f of ['/site.js', '/skall.js', 'id="cookie"', 'skall:topp', 'data-hent', 'posthog', 'googletagmanager']) assert.ok(!h.includes(f), `${s.sti}: ${f}`);
  }
});
test('tjeneste.css og avmeld.css bruker bare tokens eller egne variabler', () => {
  for (const fil of ['tjeneste.css', 'avmeld.css', 'v/vervekort.css']) { /* hver var(--x) er definert i tokens.css eller i samme fil; ingen heks utenfor :root i fila */ }
});
```

- `test/fonter.test.mjs`, «avmeld.css har de samme lokale fontene som styles.css» (vokter samme skrift på avmeldingssidene): ny form «avmeld.css har ingen @font-face, og hver side som laster avmeld.css, laster tokens.css før den».
- `test/avmeld-sprak.test.mjs`, «alle sidene bruker klassene fra det felles stilarket»: står, med et nytt krav om at ingen avmeldingsside laster `/styles.css`.
- `test/vervekort.test.mjs` endres ikke: fila er byte for byte `side(lang)` etter at generatoren er kjørt, og «bare `vervekort.js`» gjelder skript, ikke stilark.

- [ ] **Step 2: Kjør og se dem feile.** Run: `node --test test/tjeneste.test.mjs test/fonter.test.mjs test/avmeld-sprak.test.mjs test/vervekort.test.mjs`
- [ ] **Step 3: Skriv stilen, endre generatoren og kjør den, legg de tre nøklene i `UTRULLET`.**
- [ ] **Step 4: Avslutning A til F.** A: `skall-paa: 5 sider oppdatert` (fire avmeldingssider og bekreftelsen; vervekortene skrives av generatoren). Kjør også `npx playwright test avmeld-hjelp bekreft vervekort sprakvalg`: alle grønne, også «språkbytte på avmeldingssiden bevarer token og norsk valg» (`language-switcher.js` bevarer signerte parametere uendret).
- [ ] **Step 5: Bevis at tokenvakten kan bli rød.** Legg `<script src="/site.js" defer></script>` midlertidig i `en/unsubscribe/index.html`, se testen feile, ta den ut.
- [ ] **Step 6: Avslutning G.**

---

### Task 17: Tjeneste: TikTok-auth og butikkvideresendingen

**Bygger: Codex.** Gransker: Claude.

**Files:**
- Modify: `tiktok-auth.css`, `tjeneste.css` (`/* == Auth og app == */`), `app/index.html` (bare innebygd `<style>`: farger og skrift til tokens), `scripts/sidetyper.mjs` (`UTRULLET` får `tjeneste:auth` og `tjeneste:app`), de fire TikTok-auth-sidene og `/app/`
- Test: `test/tjeneste.test.mjs`

**Interfaces:**
- `tiktok-auth.css` bruker i dag `--pad`, `--ink-soft`, `--line`, `--sand` fra `styles.css`. De byttes: `--ink-soft` → `--dempet`, `--line` → `--linje`, `--sand` → `--hylle`, og `--pad` defineres i fila selv (`max(16px, env(safe-area-inset-left, 0px))`). Toppen på de lokale auth-sidene (gammel `nav` med ordmerke og språkvelger) får regler i `/* == Auth og app == */`, avgrenset med `body[data-tjeneste="auth"]`.
- `/app/` har ingen stilark i dag. Den får blokka foran `</head>`; den innebygde stilen beholdes, men farger og skrift peker på tokens.

- [ ] **Step 1: Skriv testene som feiler**

```js
test('auth og app laster tokens og tjeneste.css, og alle variabler er definert', () => {
  for (const s of [...familie('auth'), ...familie('app')]) {
    const h = les(s.fil);
    assert.match(h, /href="\/tokens\.css"[\s\S]*href="\/tjeneste\.css"/, s.sti);
    assert.doesNotMatch(h, /href="\/styles\.css"/, s.sti);
  }
  const definert = new Set([...les('tokens.css').matchAll(/(--[\w-]+)\s*:/g), ...les('tiktok-auth.css').matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));
  assert.deepEqual([...les('tiktok-auth.css').matchAll(/var\((--[\w-]+)/g)].map((m) => m[1]).filter((v) => !definert.has(v)), []);
});
```

- [ ] **Step 2: Kjør og se den feile.**
- [ ] **Step 3: Skriv stilen og legg nøklene i `UTRULLET`.**
- [ ] **Step 4: Avslutning A til F.** A: `5 sider oppdatert`. `npx playwright test sprakvalg app-lenke`: «TikTok-koden følger med til den funksjonelle språkversjonen» og «PC blir stående og viser begge butikkene» står grønne. `test/locale-pages.test.mjs` «alle TikTok-retursidene viser og kan kopiere autorisasjonskoden» står grønn.
- [ ] **Step 5: Bevis at variabeltesten kan bli rød.** Legg tilbake `var(--sand)`, se den feile, rett.
- [ ] **Step 6: Avslutning G.**

---

### Task 18: Tjeneste: kampanjesidene og 404

**Bygger: Codex.** Gransker: Claude.

**Files:**
- Modify: `tjeneste.css` (`/* == Kampanje og feil == */`), `404.css`, `404.html`, `christine/index.html` og `tiktok/index.html` (bare innebygd `<style>`: farger og skrift til tokens), `scripts/sidetyper.mjs` (`UTRULLET` får `tjeneste:kampanje` og `tjeneste:feil`), `/sv/tiktok/`, `/da/tiktok/`, `/en/tiktok/`
- Modify: `test/404.test.mjs`
- Test: `test/tjeneste.test.mjs`

**Interfaces:**
- De lokale TikTok-mellomlandingene har gammel `nav`, `footer` og samtykkebanner og laster `site.js`. De beholder alt; `/* == Kampanje og feil == */` gir dem det de brukte fra `styles.css`: toppen med ordmerke og språkvelger, `main.legal-doc` som lesekolonne, bunnen med lenker, og banneret (samme regler som `.cookie` i `skall.css`, kopiert inn med `body[data-tjeneste="kampanje"]` foran, og vektet likt etter `samtykkeVekt`).
- `/christine/` og `/tiktok/` (nb) har mest innebygd stil; den beholdes med tokens. `.steps > .step` på `/tiktok/` får stilen fra grunnstilen kopiert inn under `body[data-tjeneste="kampanje"]`.
- `404.html` laster i dag `styles.css` og `404.css`; den får `tokens.css`, `tjeneste.css`, `404.css`. `404.css` bruker tokens.

- [ ] **Step 1: Skriv testene som feiler, og oppdater `404`**

```js
test('kampanjesidene og 404 laster tokens og tjeneste.css', () => { /* som i oppgave 17, for familiene kampanje og feil */ });
test('samtykkeknappene på kampanjesidene veier likt', () => { /* regler og effektiv fra test/hjelp/knappevekt.mjs, mot tjeneste.css */ });
```

`test/404.test.mjs`, «404-siden er noindex, tilgjengelig og bruker nettstedets design», vokter at 404 bruker felles design: `href="/styles.css"` blir `href="/tokens.css"` og `href="/tjeneste.css"`. Resten står.

- [ ] **Step 2: Kjør og se dem feile.**
- [ ] **Step 3: Skriv stilen og legg nøklene i `UTRULLET`.**
- [ ] **Step 4: Avslutning A til F.** A: `6 sider oppdatert` (404, Christine, fire TikTok-sider). `test/locale-pages.test.mjs` «alle sider som laster site.js har samtykkebanner…» og «støttesider er noindex» står grønne.
- [ ] **Step 5: Avslutning G.**

---

### Task 19: `app-uttrykk` krymper til de tre forsidene

**Bygger: Codex.** Gransker: Claude.

**Forutsetning:** Alle utrullingsnøkler unntatt `forside` og `tjeneste:verifisering` er i `UTRULLET`.

**Files:**
- Create: `scripts/organisasjon.mjs`
- Modify: `scripts/app-uttrykk.mjs`, `scripts/forside.mjs` (importlinja), `test/app-uttrykk.test.mjs`

**Interfaces:**
- `scripts/organisasjon.mjs`: `export const SOSIALE` og `export const organisasjonSkjema(lang, urler)`, flyttet ordrett. `app-uttrykk.mjs` og `forside.mjs` importerer derfra.
- `behandle(html, sti)` gjør bare noe for `/sv/`, `/da/`, `/en/`.

| Del av `app-uttrykk.mjs` | Nå | Når forsidene sv, da, en er flyttet |
|---|---|---|
| `SOSIALE`, `organisasjonSkjema` | Til `scripts/organisasjon.mjs` | Står der |
| `scene`, `rader`, `ALT`, `KORTTEKST`, `IMPORT_BILDE` | Står, bare for de tre forsidene | Slettes |
| `navMeny`, `nedlastingsKnapp`, `nedlastingsLinje`, `bunnKolonner`, `sosialeIkoner`, `HYLLE`, `ETIKETT`, `TEKSTER`, logo og `apple-touch-icon` | Står, bare for de tre forsidene | Slettes. `skall-paa` eier `apple-touch-icon`, `topp()` eier logoen |
| `behandle`, `kjor` | Bare de tre forsidene | Slettes med fila |
| `data-app-uttrykk="1"` | Står igjen på `/` og `/sv/`, `/da/`, `/en/` (fire filer, mot 841 før planen) | Forsvinner med forsideløpet |

- [ ] **Step 1: Oppdater testene og se dem feile.** `test/app-uttrykk-overgang.test.mjs` (oppgave 7b) erstattes: den nye testen «bare de tre forsidene behandles» krever at `behandle` på `/sv/`, `/da/` og `/en/` (fra deres nåværende filer med markør og app-uttrykk-blokker fjernet) gir `class="nav-dl"` og `id="dl-bar"`, og at `behandle` på `omregner-nb-generert` (`/verktoy/kopp-til-dl/`), på `/x/` og på hver side i `alleSider` utenom de tre returnerer inngangen uendret. «alle språk får nedlastingsknapp og fast linje, og behandlingen er idempotent» kjøres med `sti` `/sv/`, `/da/`, `/en/`. Ny: «en underside røres ikke» (`behandle(side('nb'), '/x/') === side('nb')`). Ny: «organisasjonsskjemaet er det samme etter flyttingen» med dagens utdata limt inn som fasit før flyttingen. «noindex-sider…» kjøres med `/en/`.
- [ ] **Step 2: Flytt og begrens.** `const FORSIDER_IGJEN = new Set(['/sv/', '/da/', '/en/'])`; første linje `if (!FORSIDER_IGJEN.has(sti)) return html;`. Overgangsvakten fra oppgave 7b og parameteren `utrullet` i `behandle` fjernes.
- [ ] **Step 3: Kjør.** Run: `npm test && node scripts/app-uttrykk.mjs && node scripts/forside.mjs && git status --short` Expected: PASS, `0 sider oppdatert`, ingen endret HTML. Fjern overgangsvakten «indekserbare sider som ikke er rullet ut, har den faste linja» fra `test/skall-paa.test.mjs` (alle er rullet ut).
- [ ] **Step 4: Bevis at begrensningen kan bli rød.** Kommenter ut linja, se «en underside røres ikke» feile, sett tilbake.
- [ ] **Step 5: Bilder.** `npm run revisjon`; forsidene sv, da, en ser ut som før.
- [ ] **Step 6: Commit**

```bash
git add scripts/organisasjon.mjs scripts/app-uttrykk.mjs scripts/forside.mjs test
git commit -m "app-uttrykk eier bare forsidene sv, da og en"
```

---

### Task 20: `styles.css` slettes

**Bygger: Codex.** Gransker: Claude.

**Forutsetning (B6):** Forsidene sv, da og en er flyttet i sitt eget løp, og `app-uttrykk.mjs` er slettet der. Kontroll: `node -e "import('./scripts/sidetyper.mjs').then(({alleSider})=>{const s=alleSider('.').filter(x=>/href=\"\/styles\.css\"/.test(require('fs').readFileSync(x.fil,'utf8')));console.log(s.length,s.map(x=>x.sti))})"` gir `0 []`. Kontrollen går over publiserbare sider, ikke over fiksturer og prototyper.

**Files:**
- Delete: `styles.css`
- Modify: `site.js`, `language-switcher.css`, testene i tabellen under

**`site.js` etter slettingen:** samtykke, PostHog og GA etter samtykke, butikkmåling, `download_click`, video og kalkulator står. Disse delene fjernes, fordi de ikke lenger finner noe: `#nav`/`body > nav` (klebrigheten kommer fra `skall.css`), `#dl-bar` (erstattet av `#fast`), `.nav-dl[data-dl]` (`/app` velger butikk), `.nav-meny-knapp`/`#nav-panel` (`skall.js` eier menyen). Før det: sjekk at ingen tjenesteside fortsatt har gammel `nav` som trenger `site.js` (de lokale TikTok-sidene har `nav` men bare stilen fra `tjeneste.css`, ingen skriptavhengighet).

**Testene som endres:**

| Test | Vokter | Ny form |
|---|---|---|
| `app-uttrykk.test.mjs` | Gammel ramme | Slettes med `app-uttrykk.mjs` (forsideløpet). «Guider-panelet er skjult til det åpnes» blir i `test/skall.test.mjs`: `topp()` gir `<nav class="panel"…hidden>`, og `skall.css` setter ikke `display` på `.panel` uten `[hidden]`-unntak. «Toppen får bakgrunn ved rulling» blir: `skall.css` har `.topp` med `position:sticky` og `backdrop-filter` i `@media (min-width:1001px)` og en reserve i `prefers-reduced-transparency`. |
| `lange-sider-css.test.mjs` (fem tester) | Komponentene, ingen nav/footer, felles venstrekant, definerte tokens, redusert bevegelse | Fila slettes. `test/side-css.test.mjs` har fire av kravene. Venstrekanten blir en revisjonstest: på `guide-lang`-eksemplene på 1280 px har `.locale-prose`, `.faq`, `.app-cta` og `.page-cta` samme venstrekant (±1 px). |
| `samtykkeVekt.test.mjs` | Knappene i banneret veier likt | Leser `skall.css` og `tjeneste.css`. |
| `nyhetsbrev-utfasing.test.mjs`, «site.js og styles.css har ingen rester» | Ingen rest av skjemaet | Samme krav mot `site.js`, `tokens.css`, `skall.css`, `side.css`, `tjeneste.css`. Kravet om `.last-ned .store-badges` fjernes (den delen av forsiden finnes ikke). |
| `interneFiler.test.mjs` | Nødvendige filer publiseres | `styles.css` byttes med `tokens.css`, `skall.css`, `side.css`, `skall.js`, `tjeneste.css`. |
| `language-switcher.test.mjs`, «footerens lenkerekke brytes på mobil» | Bunnvelgeren gjør ikke siden bredere | `skall.css` har `.under .language-switcher` med `flex-wrap:wrap`; revisjonen på 360 px vokter resultatet. Reglene for `footer .f-l` og `footer .footer-links` fjernes fra `language-switcher.css` hvis ingen publisert side har dem. |
| `skall-paa.test.mjs` | Overgangen | «ingen side laster styles.css» over alle sider. |
| `fonter.test.mjs` | Se under | Se under |

**`test/fonter.test.mjs` når `styles.css` går.** `STILARK` blir `['tokens.css']`. Disse kravene feiler da, fordi `tokens.css` bare har Schibsted Grotesk 400 til 700, IBM Plex Mono 500, Fraunces normal 500 til 600, DM Sans 400 til 700 og `Fraunces Ordmerke` kursiv 300 til 400 med bare tegnene i ordmerket:
- «hver familie og stil sidene bruker har et ansikt som tegner norsk»: `Fraunces/italic` finnes ikke som tekstskrift.
- «alle vektene sidene bruker er dekket»: Fraunces normal 300 og 400, Fraunces kursiv 300 og 400, DM Sans 300.
- «stilarket definerer begge fontene lokalt» og de som leser `css()` (`styles.css`).

Ny form, avledet fra bruken i stedet for en fast liste: testen samler alle `font-family`/`font-weight`/`font-style`-kombinasjoner i `tokens.css`, `skall.css`, `side.css`, `forside.css`, `tjeneste.css`, `avmeld.css`, `tiktok-auth.css`, `404.css`, `v/vervekort.css` og innebygde `<style>` på publiserte sider, og krever at hver er dekket av et `@font-face` i `tokens.css`, og at familiene som bærer tekst (`Schibsted Grotesk`, `DM Sans`, `Fraunces`) tegner norsk. `Fraunces Ordmerke` krever bare tegnene `matlys`. Står det Fraunces kursiv eller DM Sans 300 i et stilark da, er det stilarket som rettes (til `Fraunces Ordmerke` for ordmerket, ellers til en vekt som finnes), ikke testen.

- [ ] **Step 1: Endre testene og se dem feile.** Run: `npm test` Expected: FAIL på kravene som peker på `styles.css`, og på fontbruk som ikke er dekket.
- [ ] **Step 2: Rett fontbrukerne, slett `styles.css` og de døde delene.**
- [ ] **Step 3: Kjør alt.** Run: `npm test && REVISJON=alle npx playwright test revisjon.spec --workers=4 && npm run test:e2e` Expected: PASS.
- [ ] **Step 4: Bevis at fontvakten kan bli rød.** Skriv `font-weight:300` på en `DM Sans`-regel i `side.css`, se den feile, fjern.
- [ ] **Step 5: Commit**

```bash
git rm styles.css
git add site.js language-switcher.css side.css test
git commit -m "styles.css er borte: alle sider bruker tokens, skall og side"
```

---

## Hvor hvert vedtak bygges og voktes

| Vedtak | Bygges i | Voktes av |
|---|---|---|
| B1 knapp i stedet for butikkmerker | 6 (`ctaOmrader`, `byttButikkmerker`), 7a, 10 til 15 | `skall-paa-uttrekk`: «B1: begge CTA-formene og helten…», «innholdet er likt bortsett fra…», «en butikkboks utenfor nedlastingsboksene står urørt»; `seo-pages` (12) |
| B2 ingen overskrifter i skallet | 3 (kontroll), 7a | `skall.test`: «skallet uten samtykkebanner legger ikke til overskrifter» (banneret unntatt, B4); `skall-paa.test`: «overskriftene er de samme før og etter på alle sider» |
| B3 guidene i hylledelen (bekreftet 19.11) | 3 (`hylledel`, `settInn`), 7a | `skall.test`: «øyeblikksbildet pluss guideplassen», «en ferdig guideblokk står i detaljene»; `guidelenker.test`: «settInn bruker plassen…»; `skall-paa.test`: «guidene: begge kjørerekkefølger…» |
| B4 sidens eget banner | 6 (`trekkUt`), 7a, 8 (stil) | `skall-paa-uttrekk`: «begge norske bannerfamilier…»; `skall-paa.test`: «banneret står ordrett…»; `undersider.spec`: eldre side (13) |
| B5 fast knapp, ingen følgemeny | 9 (`skall.js`), 7a | `undersider.spec`: «fast knapp: skjult i toppen…», eldre side; `skall-paa.test`: «utrullede sider med fullt skall har nedlasting…» |
| B6 sletting etter forsidene | 20 | Forutsetningskontrollen og «ingen side laster styles.css» |
| Én teksteier | 3, 5 | `skall.test`: «ingen tekst i skallet står i forside-tekst.mjs»; `forside-tekst.test` (ingen felles nøkler, `bunn.guider` og `innhold` med presist unntak) |
| Språkvelger med fulle navn (K4) | 3 (`SPRAKVALG`), 4 | `skall.test`: «språkvelgeren viser fulle navn…»; `generator-sprakvelger.test` (adapter, ingen egne kommentarpar); `seo-blogg.test` (ett par per velger i L-output); `sprakvalg.spec` |
| Måling | 2b, 10 | Revisjonen: «fullt skall» (`data-hent`-verdiene); `undersider.spec`: måling med og uten samtykke (10); `tjeneste.test`: «tokenbærende sider…» |
| Ett utrullingspredikat (K7) | 1, 7a, 7b, 2b | `sidetyper.test`: «nøkkel og predikat…»; alle vakter i `skall-paa.test` og `app-uttrykk-overgang.test` bruker `erUtrullet` |
| Generatorer bare i kopi | 6 (fikstur), 7b | `seo-blogg.test` med hele kjeden; `kjedeproeve.mjs`; `app-uttrykk-overgang.test` med N-generert fikstur |
| Overgang | 7b, 19 | `app-uttrykk-overgang.test`: «en regenerert side … får hele den gamle behandlingen»; overgangsvakten i `skall-paa.test` |

## Etter siste oppgave

Publisering skjer steg for steg så snart testene er grønne, med livekontroll etter hver publisering (Patrick 19.11). Ingen venting på manuell telefonsjekk. Hver utrullingsoppgave (10 til 18) er én PR som kan publiseres alene. Oppgave 1 til 9 går inn i PR-en for oppgave 10. Oppgave 19 er egen PR etter oppgave 18. Oppgave 20 er egen PR etter forsideløpet.

**Publiseringsrekkefølge:** 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20. Neste PR publiseres når livekontrollen for den forrige er grønn.

**Etter hver publisering:**
- [ ] Svarer 200: `/tokens.css`, `/skall.css`, `/side.css`, `/skall.js`, `/images/forside/qr-app.svg`, `/images/apple-touch-icon.png`, de seks flisene i `HYLLER` under `/images/forside/logo/`, og eksempelsidene for typen på alle språk.
- [ ] Etter 16 til 18 også `/tjeneste.css`, `/avmeld/`, `/en/unsubscribe/`, `/bekreft/`, `/tiktok-auth/`, `/app/`, `/v/`, `/christine/`, `/sv/tiktok/`, `/404.html`.
- [ ] Livekontroll: `BASE_URL=https://matlyst-app.no npx playwright test revisjon.spec --grep felles` for eksempelsidene (oppgave 2a legger `BASE_URL` inn; fremmede verter regnes da mot `https://matlyst-app.no`), pluss `curl -sI` på filene over. Rødt: `git revert` av PR-en og ny publisering.
- [ ] PostHog: `download_click` kommer inn med `cta_location` `side-cta` og `app-cta` fra undersidene.
- [ ] Search Console: klikk og visninger for typen to uker før og etter.

**Etter oppgave 20:**
- [ ] `/styles.css` svarer 404. Det er den eneste gamle filen som forsvinner. `/images/icon-64.png` brukes fortsatt av `app-bevis` og svarer 200.

## Det planen ikke dekker

- Forsidene sv, da og en (eget løp; må være ferdig før oppgave 20).
- Kalkulatoren øverst, «cups» i synlig omregnertekst, tallformatet i kalkulatoren og de seks nye kalkulatorene.
- Revisjon av farger og skriftstørrelser mot tokenene (poleringsløpet).
- **Poleringspunkt: skallets tekst i `rem`.** `skall.css` (forsideløpets fil) setter skallets tekst i `px`. Den følger derfor ikke nettleserens tekststørrelse og er unntatt fra kravet om 1,9 ganger forstørring (`SKALL_PX` i oppgave 2b). Den er dekket av zoomtesten på 200 % og 400 %. I poleringsløpet skrives `skall.css` om til `rem`, og `SKALL_PX` tømmes.
- Endringer i N og L utover språkvelgeren.

---

## Åpne spørsmål til Patrick

1. **Knappen i de eldre norske heltene.** B1 nevner `.app-cta` og `.page-cta`. De fire eldre norske sidene har også butikkmerker i helten. *Standard:* samme knapp der (`data-hent="helt"`), så alle undersider ser like ut.
2. **Måling på de norske juridiske sidene.** De har ikke `site.js`, så nedlastingsknappene der måles ikke. *Standard:* slik det er; ingen analyse på juridiske sider.

---

## Avviste funn

Ingen funn er avvist, verken i første gransking eller i regranskingen (K1 til K7, V1 til V5, Interfaces-avvikene, M1 til M3, funn 14 og rekkefølgen). Tre merknader krevde ingen endring og står her så de ikke ser glemt ut:
- **«`locale.js` trenger normalt ingen omskriving.»** Enig. Planen endrer det ikke. Forhåndsvisningene (oppgave 2b) utelater det bare fordi deres adresser ikke står i tabellen.
- **«Innholdsgrensen fungerer.»** Enig. Grensen står; tjenestesider forgrenes før den brukes (oppgave 6).
- **«Forutsetningen er ikke oppfylt i denne checkouten.»** Ventet: forsideløpet bygges nå. Oppgave 3, steg 0, kontrollerer grensesnittene etter merge.

---

## Egengransking

**Specdekning.** Punkt 7 (sideskallet): 3 til 9. Punkt 10 (cups, tankestrek, restord, lenke vises når siden finnes): 4 og 5. Punkt 11 (revisjon på fire bredder i CI, hyllelikhet, Lighthouse, Search Console): 2a, 2b, 5, Avslutning F og «Etter siste oppgave». Designnotatets byggeklosser: 8, 9, 11 til 15. Tjenestesidene: 16 til 18. Gamle stiler: 20. B1 til B6 og tilleggsvedtakene: tabellen «Hvor hvert vedtak bygges og voktes»; hvert vedtak har en navngitt oppgave og en navngitt test.

**Rekkefølge.** Språkvelgerdataene (`SPRAKVALG`, `BUTIKK`) fylles i 3, før 4 bruker dem; språkspesialisten (5) rører dem ikke. Forhåndsvisningskontrakten står i 2b og produseres i 7b, som også lager en tom `side.css`, så forhåndsvisningen har alle ressurser før grunnstilen (8) fyller den.

**Typekonsistens.** `erUtrullet(sti, html, utrullet)` og `nokkel` (1) brukes av `rendre` og `kjor` (7a), `behandle` i `app-uttrykk` (7b), `utvalg` (2b) og vaktene; ingen slår opp i `UTRULLET` direkte. `UTRULLET` holder utrullingsnøkler; 10 til 15 legger til typer, 16 til 18 legger til `tjeneste:<familie>`. `trekkUt(html, sti)`, `ctaOmrader(innhold, type)` og `byttButikkmerker(innhold, sprak, type)` (6) brukes av `rendre` (7a). `rendre(html, sti, utrullet)` og `kjor(rot, utrullet, { forhandsvis })` brukes likt i 7a til 18. `hylledel(sprak, { guider = '' } = {})` og `morkBunn(sprak, { sprakvelger = '', samtykkelenke = true } = {})` lages i 3 og brukes i 7a. `sprakvelger(sprak, 'topp'|'bunn', sider)` (4) eier kommentarparet og brukes i 7a og, via adapteren, i L. `SKALLTEKST`-nøklene i 3 er de samme i 5. `samleFeil(page, opphav)` (2a) brukes med `baseURL` sin origin i 2b. `data-hent`-verdiene er de seks i Global Constraints overalt.

**Proporsjon.** 22 oppgaver (2 og 7 er delt etter regranskingen). Planen er lengre enn specen fordi den dekker 876 sider, fem nye skript, endringer i fire eksisterende og femten testfiler. Kodeblokkene er tester og signaturer. Oppgave 10 til 18 viser til «Fast avslutning» i stedet for å gjenta stegene.

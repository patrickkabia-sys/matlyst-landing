# Forsidene på svensk, dansk og engelsk: byggeplan (løkke C)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/sv/`, `/da/` og `/en/` bygges av samme generator som den norske forsiden (`scripts/forside.mjs`), med tekstene som er skrevet og gransket per språk, så hele nettstedet har én identitet.

**Architecture:** `TEKST` i `scripts/forside-tekst.mjs` får `sv`, `da` og `en` med samme nøkkelstruktur som `nb`. `SPRAK` i `scripts/forside.mjs` får de tre språkene med hode (metadata) tatt ordrett fra dagens sider. Filmen er per språk. Til slutt slettes `scripts/app-uttrykk.mjs`, som bare eide disse tre sidene.

**Spec:** `docs/superpowers/specs/2026-11-18-nettside-designsystem-design.md`. Tekstkilder: `~/matlyst-privat/seo-matlyst/2026-11-18/sprak/forside-{sv,da,en}.mjs` med rapporter og granskinger i samme mappe.

## Vedtak

| # | Spørsmål | Vedtak | Hvem |
|---|---|---|---|
| 1 | Film | Ny film per språk, rendret i samme stil som nb (språk, Instagram og Matlyst på målspråket). Filene ligger i `images/forside/film/import-{sv,da,en}.mp4` med plakat. | Patrick 19.11 |
| 2 | Bilder på engelsk | Egne bilder: husstanden «Friendsgiving» (ansikt 9 til 12) bruker `images/forside/folk-en/09.webp` til `12.webp`, uten bunad. | Patrick 19.11 |
| 3 | Vurderingslinja | Vises på alle fire språk som på norsk: nb og sv «5,0 av 5 i App Store», da «5,0 ud af 5 i App Store», en «5.0 out of 5 on the App Store». JSON-LD som i dag. | Patrick 19.11 (erstatter første ruling) |
| 4 | Ukestart på /en/ | Mandag, som appen. | Ruling |
| 5 | FAQ-tilleggene på /en/ (captionkrav, US-enheter) | Står. De gjør svaret riktig for amerikanske brukere. | Ruling |
| 6 | Tekstvalg merket SMAK/USIKKER i rapportene | Tekstene står slik granskingene endte. Innfødt lesing før lansering er anbefalt, ikke blokkerende. | Ruling |

## Global Constraints

- `<title>`, metabeskrivelse, Open Graph, `canonical`, `hreflang` og `MobileApplication`-skjemaet på hver av de tre sidene står ordrett som i dag. Unntak: `theme-color` blir `#FFFFFF`.
- Samme regler som den norske forsiden: tokens, ingen tankestrek i synlig tekst, ingen kronebeløp, 44 px trykkflater, ingen sidelengs rulling på 360, 390, 768, 1280, alt går i loop og står stille ved redusert bevegelse, lokale skrifter.
- Ett språk per side. Ingen norsk tekst på sv, da eller en.
- Hver tekst kommer fra `TEKST[sprak]`; ingen tekst hardkodes i generatoren.

## Oppgaver

### C1: Tekstene inn

- [ ] `TEKST.sv`, `TEKST.da`, `TEKST.en` i `scripts/forside-tekst.mjs`, kopiert fra de private filene.
- [ ] Test: hver nøkkel og plassholder i `nb` finnes i hvert språk, og omvendt .
- [ ] Test: ingen tankestrek, ingen norske restord (liste fra `test/fasit/`), «cups» der språket bruker det.
- [ ] `en`: ansikt 9 til 12 peker på `folk-en`. Bildene ligger i `~/matlyst-privat/seo-matlyst/2026-11-18/nettfilm/folk-en/` som png; lagres som 132 x 132 webp.

### C2: Generatoren skriver tre nye sider

- [ ] `SPRAK.sv`, `SPRAK.da`, `SPRAK.en` med hode fra dagens `sv/index.html`, `da/index.html`, `en/index.html` (ordrett; test sammenligner mot git-versjonen før endringen).
- [ ] `forsteUkedag: 1` på alle.
- [x] Filmen er per språk (C3 levert): `import-<språk>.mp4` og `-plakat.webp`, `stegtider` som nb.
- [ ] Forsidetestene (`test/playwright/forside*.spec.mjs`) kjøres for alle fire språk der de gjelder innhold som finnes på alle.
- [ ] Revisjon `REVISJON=forside` grønn på alle fire, og Lighthouse mobil på `/en/`.

### C3: Filmene

- [ ] Når Patricks opptak ligger i `nettfilm/film/import-{sv,da,en}.mp4`: klipp og kod som den norske (628 x 1300, h264, under 2 MB), lag plakat (webp), og sett `stegtider` per språk etter når hvert steg skjer i opptaket.
- [ ] Testen for steg 4 som hopper til riktig tid kjøres per språk.

### C4: app-uttrykk slettes

- [x] `scripts/app-uttrykk.mjs` og testene for den slettes; `data-app-uttrykk` finnes ikke på noen side.
- [x] Kjedeprøven og `npm test` grønne.

Publisering: én PR når C1 til C4 er grønne, eller C1, C2 og C4 som én PR med norsk film hvis Patrick sier ja til det.

# QA for svenske og danske sider

Landing #9 er en upublisert leveranse. **Merge er selve publiseringen** og skal ikke skje før Patrick uttrykkelig sier «lanser». Det finnes ingen skjult forhåndsvisning.

Kontrollert 2026-10-05 på branchen `feat/sv-da-lansering`.

- `skjermbilder/` inneholder alle 48 sider ved 390 × 844 og 1280 × 900, totalt 96 PNG-er.
- Sidene er generert fra `scripts/generer-lokalsider.mjs`.
- Hele skjermmatrisen regenereres med `scripts/qa-lokalsider.sh`. Skriptet bruker en server på `BASE_URL` (standard `http://127.0.0.1:4173`) hvis den svarer, og starter ellers en statisk server selv. Det stopper hvis en side ikke laster (`main` med `h1` mangler).
- `node --test test/*.test.mjs` (69 tester) kontrollerer språk, slugs, canonical, gjensidig hreflang, JSON-LD, noindex, stoppliste, badge-innhold og -beskjæring, FAQ-samsvar, ordrette produktpåstander, klagevei, artikkel 9, ulike H1/H2, «del … med Matlyst», ulike skjermbilder og tom omdirigeringstabell.
- `runde2-sjekkliste.md` har én verifisert rad for hvert punkt i QA-rapporten fra runde 3 (`2026-10-05-landing9-claude-qa-runde3.md`).
- Lighthouse 12.8.2 på mobil: svensk forside 100 tilgjengelighet / 100 SEO; dansk forside 100 / 100.
- `sitemap.xml` inneholder ikke `/sv/` eller `/da/` før Patrick sier «lanser».
- De fem tilfeldige importene fra hver lokal kildeside er ikke kjørt. De krever testkonto og står som lanseringsport i `lokale-kilder.md`.

Skjermbildene viser branchens upubliserte HTML. De er ikke bevis på publisering, butikkoppsett eller Search Console-konfigurasjon.
- Butikklenkene er testlenker i upublisert innhold og skal ikke gå live før Patrick sier «lanser».
- Alle sider bruker Apples og Googles offisielle engelske butikkmerker. Landskodene i lenkene (`SE`/`DK`) er beholdt.
- Alle sider som laster `site.js` har samtykkebanner med like tydelige valg og lenke for å trekke samtykket tilbake.
- FAQ-spørsmålene i synlig HTML og JSON-LD er samme tekst. Kildesider har bare synlig innhold og brødsmuledata; de har ingen skjult FAQ i JSON-LD.

## Juridiske kilder og datoer

- Identitet og adresse: den godkjente identiteten i `matlyst-landing-jus-da-sv` (`personvern.html`/`vilkar.html`), lest 2026-10-05: Patrick Omassa Kabia, Vollebekkveien 2J, 0598 Oslo, Norge, hei@matlyst-app.no.
- Fortrydelsesret/ångerrätt, automatisk fornyelse og oppsigelse: `docs/juridisk/kilder/forbruker.md`, lest 2026-10-05, supplert med den lokale teksten i generatoren.
- Klagevei: Forbruger Europa (DA) og Konsument Europa (SV) hjelper med tvister mot virksomheter i Norge. I Norge mekler Forbrukertilsynet, og saker om angrerett kan deretter bringes inn for Forbrukerklageutvalget. URL-er, sitater og lesedato står i `juridiske-kilder.md`.
- Overføringer: samme grunnlag per mottaker som `personvern.html` («Overføring ut av EØS»), lest 2026-10-05.
- Juridiske sider og støttesider på sv/da har bare `sv-SE`/`da-DK` som hreflang. `nb-NO`/`x-default` er fjernet, fordi de norske sidene ikke lenker tilbake før «lanser».

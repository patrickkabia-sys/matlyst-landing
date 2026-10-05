# QA for svenske og danske sider

Landing #9 er en upublisert leveranse. **Merge er selve publiseringen** og skal ikke skje før Patrick uttrykkelig sier «lanser». Det finnes ingen skjult forhåndsvisning.

Kontrollert 2026-10-05 på branchen `feat/sv-da-lansering`.

- `skjermbilder/` inneholder alle 48 sider ved 390 × 844 og 1280 × 900, totalt 96 PNG-er.
- Sidene er generert fra `scripts/generer-lokalsider.mjs`.
- Hele skjermmatrisen regenereres mot en lokal server med `scripts/qa-lokalsider.sh`.
- `node --test test/*.test.mjs` (62 tester) kontrollerer språk, slugs, canonical, gjensidig hreflang, JSON-LD, noindex, stoppliste, badge-innhold, FAQ-samsvar og tom omdirigeringstabell.
- `runde2-sjekkliste.md` har én verifiserbar rad for hvert punkt i QA-rapporten fra retterunde 2.
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
- Dansk klagevei: Forbruger Europa hjelper med klager mot virksomheter i Norge; Forbrukerrådet gir råd i Norge, og Forbrukerklageutvalget er angitt som norsk klageinstans. Svensk side viser samme norske vei. URL-er og lesedato står i `juridiske-kilder.md`.
- Overføringer: GDPR artikkel 6 og 13(1)(f), samt leverandørgrunnlagene dokumentert i generatorens lokale personverntekst, lest 2026-10-05. Hver mottaker og mekanismen er nevnt per mottaker.

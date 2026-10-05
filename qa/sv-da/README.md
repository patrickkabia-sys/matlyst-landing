# QA for svenske og danske sider

Kontrollert 2026-10-05 på branchen `feat/sv-da-lansering`.

- `skjermbilder/` inneholder alle 48 sider ved 390 × 844 og 1280 × 900, totalt 96 PNG-er.
- Sidene er generert fra `scripts/generer-lokalsider.mjs`.
- Hele skjermmatrisen regenereres mot en lokal server med `scripts/qa-lokalsider.sh`.
- `node --test test/*.test.mjs` kontrollerer språk, slugs, canonical, gjensidig hreflang, JSON-LD, noindex, stoppliste og tom omdirigeringstabell.
- Lighthouse 12.8.2 på mobil: svensk forside 100 tilgjengelighet / 100 SEO; dansk forside 100 / 100.
- `sitemap.xml` inneholder ikke `/sv/` eller `/da/` før Patrick sier «lanser».
- De fem tilfeldige importene fra hver lokal kildeside er ikke kjørt. De krever testkonto og står som lanseringsport i `lokale-kilder.md`.

Skjermbildene viser branchens upubliserte HTML. De er ikke bevis på publisering, butikkoppsett eller Search Console-konfigurasjon.
- Butikklenkene er testlenker i upublisert innhold og skal ikke gå live før Patrick sier «lanser».

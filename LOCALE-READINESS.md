# Danmark og Sverige

Status per 5. oktober 2026: sidene under `/sv/` og `/da/` ligger ferdige i PR #9 (`feat/sv-da-lansering`). **Merge av PR #9 er lanseringen.** Før Patrick sier «lanser» er ingen sv/da-side publisert. Den maskinlesbare statusen ligger i `locale-readiness.json`.

**Regel: #9 merges ikke før #536 er merget og edge-funksjonen er deployet.** `llms.txt` og `qa/sv-da/produktpaastander.md` beskriver lanseringstilstanden: Spørg/Fråga Matlyst svarer på dansk og svensk, og den danske funksjonen heter Madplan. Begge deler kommer med #536 (`feat/f2-spor-matlyst-da-sv`).

Det som skjer ved merge, ligger allerede i PR-en:

- 48 sider generert fra `scripts/generer-lokalsider.mjs` (24 per språk, tre støttesider med `noindex`).
- `sitemap-sv.xml` og `sitemap-da.xml` (21 indekserbare sider hver) er oppført i `robots.txt`. `sitemap.xml` er fortsatt bare norsk.
- Gjensidig `hreflang` (`nb-NO`, `sv-SE`, `da-DK`, `x-default`) mellom forsiden, personvern, vilkår og slett konto og deres sv/da-motparter. Funksjonssidene har bare `sv-SE`/`da-DK`.
- Automatisk språk: `LOCALE_PAGE_MAP` i `locale.js` genereres fra hreflang-parene. `?sprak=` vinner og lagres, deretter lagret valg, deretter telefonens eller nettleserens språk. Norsk språk blir på norsk. TikTok-retursidene omdirigeres aldri.
- `llms.txt` med posisjonering og dokumenterte fakta på norsk, dansk, svensk og engelsk (belegg i `qa/sv-da/produktpaastander.md`).

## Lukket

- [x] Lokale juridiske sider på svensk og dansk. Kontrollørens runde 4 (5. oktober 2026) hadde ingen alvorlige funn. Det er ikke gjort noen advokatgjennomgang.
- [x] Samtykkebanner med like tydelige valg før analyseverktøy lastes.
- [x] Selvhostede fonter.
- [x] Gjensidig hreflang og språksitemaps.
- [x] Automatisk språk med brukerens eget valg først.

## Åpent, ikke verifisert i dette repoet

- [ ] App Store-oppføringer med lokaliserte metadata for Danmark og Sverige.
- [ ] Google Play-oppføringer med lokaliserte metadata for Danmark og Sverige.
- [ ] Evalueringssett for oppskriftsimport på dansk og svensk. Appen oversetter til profilspråket (nb, da, sv), men kvaliteten er ikke dokumentert her.
- [ ] Appens juridiske lenker peker til norske adresser for alle språk (`constants/legal.ts` i appen). Nettstedets automatiske språk sender danske og svenske enheter videre. Lokale lenker i appen er en egen endring.
- [ ] Full WCAG AA-gjennomgang med tastatur og skjermleser.
- [ ] Bekreft at `personvern.html` og `vilkar.html` (27. september 2026) fortsatt stemmer med appen.

Ingen av punktene over skal omgås med antatte adresser, foreløpige butikkadresser eller udokumenterte språkfunksjoner.

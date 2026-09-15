# Danmark og Sverige

Status per 15. september 2026: forhåndsvisning, ikke klar for offentlig publisering.

Sidene ligger under `_previews/`, som er eksplisitt utelatt fra GitHub Pages i `_config.yml`. Dermed publiseres de ikke dersom arbeidsgrenen senere merges. De framtidige sidene under `/da/` og `/sv/` skal beholde `noindex, nofollow` og skal ikke legges i sitemap før alle harde blokker er lukket. Den maskinlesbare statusen ligger i `locale-readiness.json`.

## Harde blokker

- [x] Bruk den eksisterende offentlige identitetsadressen fra Google Play. Verifisert 15. september 2026 og godkjent av Patrick for gjenbruk i lokale juridiske sider.
- [ ] Oppdater den norske personvernerklæringen og vilkårene til faktisk produktatferd.
- [ ] Få danske og svenske juridiske tekster godkjent, med identitet, adresse, klagevei og forbrukerrettigheter.
- [ ] Verifiser Apple App Store-oppføringer for Danmark og Sverige.
- [ ] Verifiser Google Play-oppføringer og lokaliserte metadata for Danmark og Sverige.
- [ ] Verifiser oppskriftsinnhold på dansk og svensk i importkjeden med et representativt evalueringssett.
- [ ] Oppdater appens juridiske lenker slik at dansk og svensk UI åpner juridiske sider på samme språk.
- [ ] Lag samtykkeflate med like tydelige valg før analyseverktøy lastes.
- [ ] Bruk selvhostede fonter på de lokale offentlige sidene.
- [ ] Verifiser WCAG AA for tekst, fokus, tastatur og skjermleser.

## Publiseringsgate

Når blokkene er lukket:

1. Fjern løste blokker fra riktig marked i `locale-readiness.json`, med bevis i PR-beskrivelsen.
2. Flytt markedet fra `_previews/` til riktig offentlig rotmappe.
3. Endre `public` til `true` for riktig marked i `locale-readiness.json`.
4. Fjern `noindex, nofollow` fra markedets sider.
5. Legg inn verifiserte butikklenker, uten å hardkode priser på nettstedet.
6. Legg inn godkjente juridiske lenker på samme språk.
7. Legg til gjensidig `hreflang` for `nb-NO`, `da-DK`, `sv-SE` og `x-default`.
8. Legg de offentlige adressene i `sitemap.xml` med korrekt dato.
9. Kjør Node-testene og HTML-validering.
10. Gjennomfør visuell QA på mobil og bred skjerm.
11. Få en ny Astra-granskning før merge.

Ingen av punktene over skal omgås med antatte adresser, foreløpige butikkadresser eller udokumenterte språkfunksjoner.

# Lokal løkke for SEO-artikler

1. Les neste JSON-fil i `seo-data/bestillinger/`, språkfila den viser til og sjekklista i `skriv.md`.
2. La Claude-hovedøkta skrive artikkel-JSON lokalt. Bruk bare bestillingens generaliserte emne, tillatte appkoblinger og offisielle kilde-ID-er.
3. Start en ny Opus-kontrollør uten skrivekonteksten. Gi den bestillingen, artikkelen, språkfila, de offisielle kildene og `gransk.md`. Kontrolløren skriver `GODKJENT` eller `AVVIST`, grunner og SHA-256 for de eksakte artikkelfil-bytene.
4. Kjør `node seo-motor/lever.mjs <bestilling.json> <artikkel.json> --gransking <gransking.json>`. Endres artikkelen etter kontrollen, må en ny kontrollør granske den nye filen.
5. Ved grønt kjører hovedøkta `node scripts/generer-norske-importguider.mjs`, `node scripts/generer-lokalsider.mjs` og `npm test`. Kontroller at artikkelens HTML, bloggindeks og sidekart er oppdatert.
6. Først etter grønn bygging og test lager hovedøkta PR fra `seo-autopilot/<dato>` i `utkast`, eller committer til `main` i `på`. `lever.mjs` gjør aldri commit, push, PR eller publisering selv. Ved rødt beholdes bestillingen for en senere, ny skrive- og granskingsrunde.

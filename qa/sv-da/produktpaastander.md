# Produktpåstander per side

Kontrollert mot appens `origin/master` `2613d17d3173676a0eb6229a16b3e534a670a946`, lest 2026-10-05. Påstanden er sitert ordrett fra sidens avsnitt «Bra att veta» / «Godt at vide» (kildesider: «Källa och ansvar» / «Kilde og ansvar»).

| Side | Påstand som må holde (ordrett sitat) | Kodebevis |
|---|---|---|
| /sv/importera-recept/ | Utan Pro kan du importera fem recept via länk per månad. | `lib/importEngine.ts:201-229`, `app/(tabs)/legg-til.tsx` |
| /sv/hitta-recept/ | Mappar och favoriter ger fler vägar tillbaka till rätter du vill laga igen. | `hooks/useRecipeSearch.ts:53-94`, `hooks/usePantryRecipes.ts` |
| /sv/inkopslista/ | När en vara bockas av kan den flyttas till Skafferi. Hushållsdelning kräver Matlyst Pro. | `app/(tabs)/grocery.tsx:285-367`, `hooks/useGrocery.ts` |
| /sv/handskrivna-recept/ | Fotoimport kräver Matlyst Pro. Du kan skriva in var receptet kommer ifrån, till exempel ”Mormors receptbok”. | `lib/importEngine.ts:201-229`, `app/(tabs)/legg-til.tsx` |
| /sv/recept-pa-ingredienser/ | Förslagen är ett hjälpmedel. Kontrollera alltid mängderna, hållbarheten och att varorna fortfarande går att äta. | `hooks/useRecipeSearch.ts:53-94`, `hooks/usePantryRecipes.ts` |
| /sv/vad-ska-jag-laga/ | Fråga Matlyst kräver Matlyst Pro. | `hooks/useRecommendations.ts:76-131`, `hooks/useSporMatlyst.ts:118-221` |
| /sv/veckomeny-app/ | Veckomenyn och den vanliga inköpslistan kan användas utan Pro. Hushållsdelning kräver Pro. | `app/(tabs)/ukemeny.tsx:371-433`, `app/recipe-picker.tsx` |
| /sv/byt-fran-paprika/ | Matlyst har ingen koppling till Paprika och garanterar inte att alla fält kan flyttas automatiskt. | `components/RecipeFileImport.tsx`, `lib/importEngine.ts:248-270` |
| /sv/receptbok-app/ | Du bestämmer över innehållet. Källan visas på importerade recept när den finns. | `hooks/useRecipes.ts:169-199`, `hooks/useRecipeSearch.ts:53-94` |
| /sv/spara-recept-fran-instagram/ | Källan följer med. Privat eller otillgängligt innehåll kan inte alltid importeras. | `lib/importEngine.ts:201-229`, `app/(tabs)/legg-til.tsx` |
| /sv/spara-recept-fran-tiktok/ | Privat, borttaget eller geografiskt spärrat innehåll kan inte alltid läsas. | `lib/importEngine.ts:201-229`, `app/(tabs)/legg-til.tsx` |
| /sv/skafferi-app/ | I gratisversionen rymmer Skafferi ett begränsat antal varor. Med Pro får du plats med fler. | `hooks/usePantry.ts:247-276`, `hooks/usePantryRecipes.ts` |
| /sv/tom-kylskapet/ | Matlyst kan inte avgöra om en vara är säker att äta. Kontrollera lukt, utseende, datum och förvaring själv. | `hooks/usePantry.ts:247-276`, `hooks/usePantryRecipes.ts` |
| /sv/enkel-middag/ | Tänk köttbullar med potatis, ugnsbakad lax eller en snabb pastarätt – vardagsrätter du sparar en gång och lagar igen och igen. | `hooks/useRecipes.ts:169-199`, `hooks/useRecipeSearch.ts:53-94` |
| /sv/receptskapare/ | En skapare kan kontakta hei@matlyst-app.no om frågor, rättelse eller blockering av import från en källa. Matlyst gör inte anspråk på skaparens text eller bilder. | `lib/source.ts:20-74`, `lib/source.ts:84-107` |
| /da/importer-opskrifter/ | Uden Pro kan du importere fem links om måneden. | `lib/importEngine.ts:201-229`, `app/(tabs)/legg-til.tsx` |
| /da/find-opskrifter/ | Mapper og favoritter giver flere veje tilbage til de retter, du vil lave igen. | `hooks/useRecipeSearch.ts:53-94`, `hooks/usePantryRecipes.ts` |
| /da/indkoebsliste-app/ | Når en vare krydses af, kan den flyttes til Spisekammeret. Deling i en husstand kræver Matlyst Pro. | `app/(tabs)/grocery.tsx:285-367`, `hooks/useGrocery.ts` |
| /da/haandskrevne-opskrifter/ | Fotoimport kræver Matlyst Pro. Du kan selv notere, hvor opskriften stammer fra. | `lib/importEngine.ts:201-229`, `app/(tabs)/legg-til.tsx` |
| /da/opskrifter-ud-fra-ingredienser/ | Forslagene er kun vejledende. Tjek mængder, holdbarhed, og om varerne stadig kan bruges. | `hooks/useRecipeSearch.ts:53-94`, `hooks/usePantryRecipes.ts` |
| /da/middagsforslag/ | Spørg Matlyst kræver Matlyst Pro. | `hooks/useRecommendations.ts:76-131`, `hooks/useSporMatlyst.ts:118-221` |
| /da/madplan-app/ | Deling af Madplan og Indkøbsliste i en husstand kræver Matlyst Pro. | `app/(tabs)/ukemeny.tsx:371-433`, `app/recipe-picker.tsx` |
| /da/skift-fra-paprika/ | Matlyst har ingen tilknytning til Paprika og garanterer ikke, at alle felter kan flyttes automatisk. | `components/RecipeFileImport.tsx`, `lib/importEngine.ts:248-270` |
| /da/opskrifts-app/ | Du bestemmer over indholdet. Kilden vises på importerede opskrifter, når den findes. | `hooks/useRecipes.ts:169-199`, `hooks/useRecipeSearch.ts:53-94` |
| /da/gem-opskrifter-fra-instagram/ | Kilden følger med. Privat eller utilgængeligt indhold kan ikke altid importeres. | `lib/importEngine.ts:201-229`, `app/(tabs)/legg-til.tsx` |
| /da/gem-opskrifter-fra-tiktok/ | Privat, slettet eller geografisk blokeret indhold kan ikke altid læses. | `lib/importEngine.ts:201-229`, `app/(tabs)/legg-til.tsx` |
| /da/spisekammer-app/ | I gratisversionen er der plads til et begrænset antal varer. Med Pro er der plads til flere. | `hooks/usePantry.ts:247-276`, `hooks/usePantryRecipes.ts` |
| /da/toem-koeleskabet/ | Matlyst kan ikke afgøre, om en vare er sikker at spise. Kontrollér selv lugt, udseende, dato og opbevaring. | `hooks/usePantry.ts:247-276`, `hooks/usePantryRecipes.ts` |
| /da/nem-mad/ | Det kan være frikadeller med kartofler, en hurtig pastaret eller laks i ovnen – retter, du allerede kender. | `hooks/useRecipes.ts:169-199`, `hooks/useRecipeSearch.ts:53-94` |
| /da/opskriftsskabere/ | En skaber kan skrive til hei@matlyst-app.no om spørgsmål, rettelser eller blokering af import fra en kilde. | `lib/source.ts:20-74`, `lib/source.ts:84-107` |
| /sv/koket/ | Matlyst visar källänken när den kan läsas. Matlyst samarbetar inte med Köket.se och gör inte anspråk på deras texter eller bilder. | `lib/importEngine.ts:201-229`, `lib/source.ts:20-74` |
| /sv/landleys-kok/ | Matlyst visar källänken när den kan läsas. Matlyst samarbetar inte med Landleys Kök och gör inte anspråk på deras texter eller bilder. | `lib/importEngine.ts:201-229`, `lib/source.ts:20-74` |
| /da/alletiders-kogebog/ | Matlyst viser kildelinket, når det kan læses. Matlyst samarbejder ikke med Alletiders Kogebog og gør ikke krav på deres tekster eller billeder. | `lib/importEngine.ts:201-229`, `lib/source.ts:20-74` |
| /da/dr-mad/ | Matlyst viser kildelinket, når det kan læses. Matlyst samarbejder ikke med DR Mad og gør ikke krav på deres tekster eller billeder. | `lib/importEngine.ts:201-229`, `lib/source.ts:20-74` |

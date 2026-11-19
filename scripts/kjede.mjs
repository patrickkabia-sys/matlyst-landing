// Byggekjeden for sidene: generatorene først, så etterbehandlingen. Rekkefølgen er regelen.
// Alle skript skriver til rotmappen de ligger i, så kjeden kjøres bare i en kopi (scripts/kjedeproeve.mjs) eller bevisst på arbeidskopien.
// generer-norske-importguider og generer-lokalsider skriver også blogg, enhetssider (omregner) og guider; forside.mjs skriver de fire forsidene.
export const GENERATORER = ['generer-norske-importguider', 'generer-lokalsider'];
// Etterbehandling: lenker, skall, appbevis, bildeattributter, språksignaler og omregnerens ordformer.
// forside.mjs står SIST: forsidene har eget skall og skal ikke få lenkeblokker fra de andre trinnene.
export const ETTERBEHANDLING = ['guidelenker', 'lenker-sett', 'skall-paa', 'app-bevis', 'bilde-attributter', 'sprak-signaler', 'omregner-flertall', 'forside'];
export const KJEDE = [...GENERATORER, ...ETTERBEHANDLING];
// Filer utenfor sidene som generatorene også skriver, og som sammenlignes.
export const EKSTRA_FILER = ['llms.txt', 'locale.js', 'sitemap.xml', 'sitemap-sv.xml', 'sitemap-da.xml', 'sitemap-en.xml'];

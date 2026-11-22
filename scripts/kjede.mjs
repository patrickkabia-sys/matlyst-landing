// Byggekjeden for sidene: generatorene først, så etterbehandlingen. Rekkefølgen er regelen.
// Alle skript skriver til rotmappen de ligger i, så kjeden kjøres bare i en kopi (scripts/kjedeproeve.mjs) eller bevisst på arbeidskopien.
// generer-norske-importguider og generer-lokalsider skriver også blogg, enhetssider (omregner) og guider; forside.mjs skriver de fire forsidene.
export const GENERATORER = ['generer-norske-importguider', 'generer-lokalsider'];
// Etterbehandling: lenker, skall, appbevis, bildeattributter og språksignaler.
// delebilde.mjs gir sider med det felles bildet delebildet for sin type og sitt språk (images/delebilde/, laget av delebilde-render.mjs, som ikke er i kjeden).
// hanna-innhold.mjs setter forsidens stjerner, importfilm og kildebånd inn i kampanjesidene /hanna/ og lager importfilm.css/js fra forside.css/js.
// forside.mjs står SIST av sidetrinnene: forsidene har eget skall og skal ikke få lenkeblokker fra de andre trinnene.
// lastmod.mjs setter ekte lastmod i sidekartene fra de ferdige sidene (se scripts/lastmod.mjs).
// llms.mjs skriver llms.txt fra de ferdige sidene og må derfor stå etter alle trinn som endrer tittel eller beskrivelse.
// sideoversikt.mjs skriver docs/SIDEOVERSIKT.md fra sitemapene og de ferdige sidene, og står derfor aller sist.
export const ETTERBEHANDLING = ['guidelenker', 'lenker-sett', 'skall-paa', 'app-bevis', 'bilde-attributter', 'sprak-signaler', 'delebilde', 'hanna-innhold', 'forside', 'lastmod', 'llms', 'sideoversikt'];
export const KJEDE = [...GENERATORER, ...ETTERBEHANDLING];
// Filer utenfor sidene som generatorene også skriver, og som sammenlignes.
export const EKSTRA_FILER = ['llms.txt', 'sitemap.xml', 'sitemap-sv.xml', 'sitemap-da.xml', 'sitemap-en.xml', 'sitemap-index.xml', 'docs/SIDEOVERSIKT.md'];

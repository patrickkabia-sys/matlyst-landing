#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { legal, liste } from './juridisk-tekster.mjs';
import { SIDEGRUPPER, SPRAKREKKEFOLGE, alternativerFor, byggLocalePageMap, filForSti, gruppeForSti } from './locale-sider.mjs';

const base = 'https://matlyst-app.no';
const common = {
  sv: {
    locale: 'sv_SE', market: 'Sverige', home: 'Hem', skip: 'Hoppa till innehållet',
    features: 'Funktioner', legal: 'Integritet och villkor', download: 'Hämta Matlyst',
    appStore: 'https://apps.apple.com/se/app/matlyst/id6762563515',
    play: 'https://play.google.com/store/apps/details?id=app.matlyst&hl=sv&gl=SE',
    footer: 'Recept, matplanering och inköpslista.',
    langLabel: 'Språk', privacy: 'Integritet', terms: 'Villkor',
    navLabel: 'Huvudnavigering', termsPath: 'villkor/', privacyPath: 'integritet/', withdraw: 'Ändra samtycke',
    consent: 'Vi använder nödvändig lagring för att webbplatsen ska fungera. Om du säger ja använder vi även kakor för analys (PostHog, Google Analytics). Läs mer i vår <a href="/sv/integritet/">integritetspolicy</a>.',
    accept: 'Godkänn', reject: 'Bara nödvändiga',
    contactHeading: 'Kontakt', contactText: 'Frågor och begäranden skickas till', more: 'Läs mer',
  },
  da: {
    locale: 'da_DK', market: 'Danmark', home: 'Forside', skip: 'Spring til indholdet',
    features: 'Funktioner', legal: 'Vilkår og privatliv', download: 'Hent Matlyst',
    appStore: 'https://apps.apple.com/dk/app/matlyst/id6762563515',
    play: 'https://play.google.com/store/apps/details?id=app.matlyst&hl=da&gl=DK',
    footer: 'Opskrifter, madplan og indkøbsliste.',
    langLabel: 'Sprog', privacy: 'Privatliv', terms: 'Vilkår',
    navLabel: 'Hovednavigation', termsPath: 'vilkaar/', privacyPath: 'privatliv/', withdraw: 'Skift samtykke',
    consent: 'Vi bruger nødvendig lagring, for at siden virker. Siger du ja, bruger vi også analyse (PostHog og Google Analytics) til at forbedre Matlyst. Læs mere i vores <a href="/da/privatliv/">privatlivspolitik</a>.',
    accept: 'Acceptér', reject: 'Kun nødvendige',
    contactHeading: 'Kontakt', contactText: 'Spørgsmål og anmodninger sendes til', more: 'Læs mere',
  },
  en: {
    locale: 'en_GB', market: 'International', home: 'Home', skip: 'Skip to content',
    features: 'Features', legal: 'Privacy and terms', download: 'Get Matlyst',
    appStore: 'https://apps.apple.com/app/matlyst/id6762563515',
    play: 'https://play.google.com/store/apps/details?id=app.matlyst&hl=en',
    footer: 'Recipes, meal planning and shopping lists.',
    langLabel: 'Language', privacy: 'Privacy', terms: 'Terms',
    navLabel: 'Main navigation', termsPath: 'terms/', privacyPath: 'privacy/', withdraw: 'Change consent',
    consent: 'We use essential storage to make this site work. If you say yes, we also use cookies for analytics (PostHog, Google Analytics). Read more in our <a href="/en/privacy/">privacy policy</a>.',
    accept: 'Accept', reject: 'Essential only',
    contactHeading: 'Contact', contactText: 'Send questions and requests to', more: 'Read more',
  },
};
// Språkene nettstedet genererer sider for. Bokmål er håndskrevet og ligger i roten.
const SPRAK = SPRAKREKKEFOLGE.filter((sprak) => common[sprak]);

const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const json = (value) => JSON.stringify(value).replaceAll('<', '\\u003c');
const avsnitt = (...ps) => ps.map((p) => `<p>${p}</p>`).join('');

function sideSti(lang, path = '') {
  return `/${lang}/${path}`;
}

function alternateLinks(sti) {
  return alternativerFor(sti)
    .map(([kode, href]) => `<link rel="alternate" hreflang="${kode}" href="${base}${href}">`)
    .join('\n');
}

function nav(lang, activePath = '') {
  const c = common[lang];
  const sti = sideSti(lang, activePath);
  const gruppe = gruppeForSti(sti);
  const bytter = Object.entries(gruppe.sider).map(([sprak, href]) => {
    const etikett = sprak === 'nb' ? 'NO' : sprak.toUpperCase();
    return `<a href="${href}?sprak=${sprak}" lang="${sprak}" ${sprak === lang ? 'aria-current="page"' : ''}>${etikett}</a>`;
  }).join('\n      ');
  return `<a class="skip-link" href="#hovedinnhold">${c.skip}</a>
<nav aria-label="${c.navLabel}">
  <a href="/${lang}/" class="brand">Mat<em>lyst</em></a>
  <div class="nav-right">
    <a class="link" href="/${lang}/#funktioner">${c.features}</a>
    <span class="language-switcher" aria-label="${c.langLabel}">
      ${bytter}
    </span>
  </div>
</nav>`;
}

function footer(lang) {
  const c = common[lang];
  return `<footer>
  <a href="/${lang}/" class="brand">Mat<em>lyst</em></a>
  <div class="f-l"><a href="/${lang}/${c.termsPath}">${c.terms}</a><a href="/${lang}/${c.privacyPath}">${c.privacy}</a><a href="#samtykke" data-consent-withdraw>${c.withdraw}</a><a href="mailto:hei@matlyst-app.no">${c.contactHeading}</a></div>
  <span class="c">© 2026 Matlyst · ${c.footer}</span>
</footer>${consentBanner(lang)}`;
}

function consentBanner(lang) {
  const c = common[lang];
  return `<div class="cookie" id="cookie" hidden><div class="cookie-inner" id="samtykke"><p>${c.consent}</p><div class="cookie-actions"><button class="ck-btn ck-accept" id="ck-accept" type="button">${c.accept}</button><button class="ck-btn ck-reject" id="ck-reject" type="button">${c.reject}</button></div></div></div>`;
}

function head({ lang, path = '', title, description, image = '/images/og.jpg', noindex = false, schema }) {
  const c = common[lang];
  const canonical = `${base}/${lang}/${path}`;
  const sti = sideSti(lang, path);
  const gruppe = gruppeForSti(sti);
  const brukerSprakredirect = gruppe.redirect !== false && Object.keys(gruppe.sider).length > 1;
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow'}">
<link rel="canonical" href="${canonical}">
${alternateLinks(sti)}
<meta name="theme-color" content="#F7F3EC">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${base}${image}">
<meta property="og:image:alt" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Matlyst">
<meta property="og:locale" content="${c.locale}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${base}${image}">
<meta name="twitter:image:alt" content="${esc(description)}">
<link rel="icon" type="image/png" href="/images/icon.png">
<link rel="stylesheet" href="/styles.css">
${schema ? `<script type="application/ld+json">${json(schema)}</script>` : ''}
${brukerSprakredirect ? '<script src="/locale.js"></script>' : ''}
</head>`;
}

function storeButtons(lang) {
  const c = common[lang];
  return `<div class="store-badges">
<a class="btn-store" href="${c.appStore}" rel="noopener"><img src="/images/appstore-badge.svg" alt="Download on the App Store"></a>
<a class="btn-store" href="${c.play}" rel="noopener"><img src="/images/googleplay-badge-en.png" alt="Get it on Google Play"></a>
</div>`;
}

// Forsidetekst per språk. Kort uten sti har ingen egen side på språket ennå.
const hjem = {
  sv: {
    title: 'Receptapp för vardagen | Matlyst Sverige',
    description: 'Receptappen som översätter och anpassar dina recept. Importera från webben, Instagram, TikTok eller ett foto, planera veckans middagar och gör en inköpslista.',
    eyebrow: 'Receptappen för vardagen',
    h1: 'Recepten du sparar,<br><span class="it">klara för vardagen.</span>',
    lead: 'Matlyst översätter och anpassar dina recept. Spara dem från en länk, en video eller ett foto.',
    overviewEyebrow: 'Ett lugnare kök',
    overviewH2: 'Från inspiration till <em>middag</em>.',
    overview: 'Importera recept från webben, Instagram, TikTok eller ett foto. Ordna dem i mappar och hitta dem igen när det är dags att laga mat.',
    steps: [
      ['Samla recepten', 'Källan följer med när ett recept importeras.'],
      ['Planera själv', 'Välj recept till veckans dagar. Du bestämmer själv vad som ska stå på bordet varje dag.'],
      ['Handla med överblick', 'Skicka ingredienser från recepten till inköpslistan.'],
    ],
    cards: [
      ['Importera recept', 'Länk, video eller foto blir ett recept du kan använda.', 'importera-recept/'],
      ['Veckomeny', 'Lägg egna recept på de dagar som passar.', 'veckomeny-app/'],
      ['Inköpslista', 'Samla ingredienser och egna varor på samma lista.', 'inkopslista/'],
      ['Fråga Matlyst', 'Fråga om receptet eller anpassa en rätt.', 'vad-ska-jag-laga/'],
    ],
    houseAlt: 'Två personer planerar mat tillsammans',
    houseEyebrow: 'Ett kök med överblick',
    houseH2: 'Samma plan<br><em>för hela hushållet.</em>',
    house: 'Med Matlyst Pro kan ett hushåll dela recept, Veckomeny, Inköpslista och Skafferi.',
    ctaH2: 'Ditt kök.<br><em>Dina recept.</em>',
    rating: '5,0 i norska App Store den 5 oktober 2026, baserat på 12 betyg.',
  },
  da: {
    title: 'Opskriftsapp til hverdagen | Matlyst Danmark',
    description: 'Opskriftsappen, der oversætter og tilpasser dine opskrifter. Importér fra nettet, Instagram, TikTok eller et foto, planlæg ugens aftensmad, og lav en indkøbsliste.',
    eyebrow: 'Opskriftsappen til hverdagen',
    h1: 'Dine opskrifter,<br><span class="it">klar til hverdagen.</span>',
    lead: 'Matlyst oversætter og tilpasser dine opskrifter. Gem dem fra et link, en video eller et foto.',
    overviewEyebrow: '',
    overviewH2: 'Fra inspiration til <em>aftensmad</em>.',
    overview: 'Importér opskrifter fra nettet, Instagram, TikTok eller et foto. Saml dem i mapper, og find dem igen, når det er tid til at lave mad.',
    steps: [
      ['Saml opskrifterne', 'Kilden følger med, når en opskrift importeres.'],
      ['Planlæg selv', 'Vælg opskrifter til ugens dage. Du bestemmer selv, hvad der skal på bordet hver dag.'],
      ['Køb ind med overblik', 'Send ingredienser fra opskrifterne til Indkøbslisten.'],
    ],
    cards: [
      ['Importér opskrifter', 'Link, video eller foto bliver til en opskrift, du kan bruge.', 'importer-opskrifter/'],
      ['Madplan', 'Læg dine egne opskrifter på de dage, der passer.', 'madplan-app/'],
      ['Indkøbsliste', 'Saml ingredienser og egne varer på den samme liste.', 'indkoebsliste-app/'],
      ['Spørg Matlyst', 'Stil spørgsmål om opskriften, eller find <a href="/da/nem-mad/">nem mad</a>.', 'middagsforslag/'],
    ],
    houseAlt: 'To personer planlægger mad sammen',
    houseEyebrow: 'Et køkken med overblik',
    houseH2: 'Den samme plan<br><em>for hele husstanden.</em>',
    house: 'Med Matlyst Pro kan en husstand dele opskrifter, Madplan, Indkøbsliste og Spisekammer.',
    ctaH2: 'Dit køkken.<br><em>Dine opskrifter.</em>',
    rating: '5,0 i den norske App Store den 5. oktober 2026, baseret på 12 vurderinger.',
  },
  en: {
    title: 'The recipe app for everyday cooking | Matlyst',
    description: 'Save recipes from websites, Instagram, TikTok or a photo. Matlyst gives you the ingredients and method in English, helps you plan the week and builds your shopping list.',
    eyebrow: 'The recipe app for everyday cooking',
    h1: 'Every recipe you save,<br><span class="it">ready to cook.</span>',
    lead: 'Save a recipe from a link, a video or a photo. Matlyst pulls out the ingredients and method and puts them in English, whatever language the original was in.',
    overviewEyebrow: 'A calmer kitchen',
    overviewH2: 'From inspiration to <em>dinner</em>.',
    overview: 'Import recipes from the web, Instagram, TikTok or a photo. Sort them into folders and find them again when it’s time to cook.',
    steps: [
      ['Collect your recipes', 'Every recipe you import keeps a link to where it came from.'],
      ['Plan your week', 'Pick recipes for the days ahead. You decide what ends up on the table.'],
      ['Shop without guesswork', 'Send the ingredients from your recipes straight to the shopping list.'],
    ],
    cards: [
      ['Import recipes', 'A link, a video or a photo becomes a recipe you can cook from.', 'import-recipes/'],
      ['Meal plan', 'Put your own recipes on the days that suit you.'],
      ['Shopping list', 'Your recipe ingredients and everything else you need, all on one list.'],
      ['Ask Matlyst', 'Ask about a recipe or get help adapting a dish.'],
    ],
    houseAlt: 'Two people planning meals together',
    houseEyebrow: 'Cooking for more than one',
    houseH2: 'One plan<br><em>for the whole household.</em>',
    house: 'With Matlyst Pro, your household shares the meal plan, shopping list and pantry in real time.',
    ctaH2: 'Your kitchen.<br><em>Your recipes.</em>',
    rating: 'Rated 5.0 on the Norwegian App Store on 5 October 2026, from 12 ratings.',
  },
};

function home(lang) {
  const c = common[lang];
  const t = hjem[lang];
  const { title, description } = t;
  const schema = {
    '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'Matlyst',
    applicationCategory: 'LifestyleApplication', operatingSystem: 'iOS, Android',
    description, url: `${base}/${lang}/`,
  };
  return `${head({ lang, title, description, nb: '/', schema })}<body data-locale="${lang}">
${nav(lang, '', '', '/')}
<main id="hovedinnhold">
<header class="hero locale-home-hero" data-section="hero">
  <div><p class="eyebrow hero-eyebrow">${t.eyebrow}</p>
  <h1 class="disp">${t.h1}</h1></div>
  <div class="hero-side"><p class="lead">${t.lead}</p>${storeButtons(lang)}</div>
</header>
<section class="manifesto" id="funktioner" data-section="overview">
  <div>${t.overviewEyebrow ? `<p class="eyebrow">${t.overviewEyebrow}</p>` : ''}<h2 class="disp">${t.overviewH2}</h2>
  <p class="answer">${t.overview}</p></div>
  <div class="steps">
${t.steps.map(([h, d], i) => `    <div class="step"><div class="n">0${i + 1}</div><div><div class="h">${h}</div><div class="d">${d}</div></div></div>`).join('\n')}
  </div>
</section>
<section class="locale-grid" aria-label="${c.features}">
  ${t.cards.map(([h,p,u]) => `<article class="locale-card"><h2 class="disp">${h}</h2><p>${p}</p>${u ? `<a class="more" href="/${lang}/${u}">${c.more} →</a>` : ''}</article>`).join('')}
</section>
<section class="house" data-section="household"><img src="/images/life/life-household-1400.webp" width="1408" height="3050" alt="${t.houseAlt}" loading="lazy"><div class="house-text"><p class="eyebrow">${t.houseEyebrow}</p><h2 class="disp">${t.houseH2}</h2><p>${t.house}</p></div></section>
<section class="cta"><p class="eyebrow">Matlyst</p><h2 class="disp">${t.ctaH2}</h2><p>${t.rating}</p>${storeButtons(lang)}<div class="wordmark" aria-hidden="true">Mat<em>lyst</em></div></section>
</main>${footer(lang)}<script src="/site.js" defer></script></body></html>`;
}


function legalPage(lang, key) {
  const d = legal[lang][key];
  const description = d.intro;
  const breadcrumb = {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[
    {'@type':'ListItem',position:1,name:common[lang].home,item:`${base}/${lang}/`},
    {'@type':'ListItem',position:2,name:d.h1,item:`${base}/${lang}/${d.path}`},
  ]};
  return `${head({lang,path:d.path,title:d.title,description,schema:breadcrumb})}<body data-locale="${lang}">
${nav(lang,d.path)}
<main id="hovedinnhold" class="legal-doc">
${d.utkast ? `<!-- ${d.utkast} -->\n` : ''}<header><p class="eyebrow">${common[lang].legal}</p><h1 class="disp">${d.h1}</h1><p class="lead">${d.intro}</p><p class="legal-updated">${d.oppdatert}</p></header>
${d.sections.map(([h,p])=>`<section${key === 'terms' && h.startsWith('2.') ? ' id="alder"' : ''}><h2>${h}</h2>${p.startsWith('<') ? p : `<p>${p}</p>`}</section>`).join('\n')}
<section class="legal-callout"><h2>${common[lang].contactHeading}</h2><p>${common[lang].contactText} <a href="mailto:hei@matlyst-app.no">hei@matlyst-app.no</a>.</p></section>
</main>${footer(lang)}<script src="/site.js" defer></script></body></html>`;
}

const featurePages = {
  sv: [
    ['importera-recept/','Importera recept till en app','Importera recept från en länk, Instagram, TikTok eller ett foto och samla dem i Matlyst.','Importera recept','Skicka en länk eller dela innehållet med Matlyst. Appen tolkar ingredienser och steg, och visar källan på receptet.','Länkimport ingår med fem importer per månad utan Pro. Fotoimport kräver Matlyst Pro.','Kan jag importera från en webbsida?','Ja. Klistra in länken eller dela den med Matlyst.'],
    ['hitta-recept/','Hitta mina recept','Sök i din egen receptsamling efter namn, ingrediens, kategori eller källa.','Hitta tillbaka till det du sparat','Sökningen gäller recepten i din samling. Filter hjälper dig att begränsa listan utan att blanda in recept från webben.','Mappar och favoriter ger fler vägar tillbaka till rätter du vill laga igen.','Söker Matlyst på hela webben?','Nej. Den här sökningen gäller din egen receptsamling.'],
    ['inkopslista/','Inköpslista från recept','Skicka ingredienser från recept och veckomeny till en gemensam inköpslista.','En inköpslista från dina recept','Välj ett recept eller en hel planerad dag. Ingredienserna läggs i listan, där du också kan skriva in egna varor.','När en vara bockas av kan den flyttas till Skafferi. Hushållsdelning kräver Matlyst Pro.','Är inköpslistan gratis?','Den vanliga inköpslistan kan användas utan Pro. Hushållsdelning är en Pro-funktion.'],
    ['handskrivna-recept/','Digitalisera handskrivna recept','Fotografera ett receptkort och gör texten sökbar i din receptsamling.','Från receptkort till digital kokbok','Fotoimporten tolkar titel, ingredienser och steg. Kontrollera resultatet innan du sparar, särskilt svårläst handstil och mängder.','Fotoimport kräver Matlyst Pro. Originalets källa kan beskrivas i receptet.','Blir all handstil rätt?','Nej. Resultatet beror på bilden och handstilen och ska alltid kontrolleras.'],
    ['recept-pa-ingredienser/','Vad kan jag laga med dessa ingredienser?','Hitta recept i din egen samling som passar ingredienserna du har hemma.','Sök med det som finns hemma','Skriv ingredienser eller använd Skafferi. Matlyst jämför med recepten du redan har sparat och visar relevanta träffar.','Förslagen är ett hjälpmedel. Kontrollera alltid att du faktiskt har rätt mängd och att varorna är användbara.','Skapar sökningen nya recept?','Nej. Den matchar mot recept i din egen samling. Fråga Matlyst kan skapa eller anpassa en rätt.'],
    ['vad-ska-jag-laga/','Vad ska jag laga till middag?','Få middagsförslag från egna recept och fråga Matlyst när du vill anpassa en rätt.','Middagsförslag från din samling','På Hem visas förslag från din egen receptsamling. Skafferi kan hjälpa till att lyfta fram rätter som passar det du har.','Fråga Matlyst kan skapa eller ändra recept. Den funktionen följer appens Pro-gate.','Varifrån kommer förslagen?','Från recepten du har sparat och de uppgifter appen har om Skafferi.'],
    ['veckomeny-app/','Matplanering och inköpslista','Planera veckans middagar med egna recept och skicka ingredienserna till inköpslistan.','Planera veckan själv','Välj ett recept för varje dag du vill planera. Matlyst skapar inte en färdig vecka automatiskt.','Veckomenyn och den vanliga inköpslistan kan användas utan Pro. Hushållsdelning kräver Pro.','Gör Matlyst veckomenyn åt mig?','Nej. Du väljer själv recept och dagar.'],
    ['byt-fran-paprika/','Alternativ till Paprika Recipe Manager','Flytta dina recept med Matlysts import och kontrollera varje resultat innan du sparar.','Byt utan att lova en magisk flytt','Matlyst kan importera recept från länkar och filer som appen stöder. Exakt flöde beror på hur recepten kan exporteras från din nuvarande app.','Matlyst har ingen koppling till Paprika och garanterar inte att alla fält kan flyttas automatiskt.','Finns en direktkoppling till Paprika?','Nej. Använd export- och importmöjligheterna som apparna erbjuder.'],
    ['receptbok-app/','Egen kokbok i en app','Samla egna och importerade recept i mappar, med favoriter, anteckningar och källa.','Din digitala kokbok','Spara familjerecept, länkar du hittar och rätter du gör ofta på samma ställe. Mappar och sökning håller samlingen användbar.','Du bestämmer över innehållet. Källan visas på importerade recept när den finns.','Kan jag lägga in egna recept?','Ja. Du kan skriva in ett recept själv eller importera från källor som stöds.'],
    ['spara-recept-fran-instagram/','Spara recept från Instagram','Dela en offentlig reel med Matlyst och kontrollera receptet innan du sparar.','Från reel till recept','Använd Instagrams delningsmeny och välj Matlyst. När importen kan läsa innehållet får du ingredienser och steg i ett redigerbart recept.','Källan följer med. Privat eller otillgängligt innehåll kan inte alltid importeras.','Är Matlyst knutet till Instagram?','Nej. Matlyst använder den länk eller delning du själv skickar.'],
    ['spara-recept-fran-tiktok/','Spara TikTok-recept','Dela en TikTok-video från ett offentligt konto med Matlyst och samla receptet med källan kvar.','Spara när du hittar något gott','Välj Matlyst i delningsmenyn. Kontrollera mängder och steg innan receptet sparas i din samling.','Privat, borttaget eller geografiskt spärrat innehåll kan inte alltid läsas.','Behålls länken till videon?','Ja, när källan är tillgänglig sparas den tillsammans med receptet.'],
    ['skafferi-app/','Skafferi-app för recept','Håll koll på varor hemma och hitta recept som passar innan maten blir gammal.','Det du har, synligt','Lägg in varor manuellt eller flytta avbockade inköp till Skafferi. Förslag kan sedan använda innehållet som underlag.','Gratisnivån visar ett begränsat antal skafferivaror; Pro öppnar mer kapacitet.','Är lagersaldot exakt?','Bara om du håller Skafferi uppdaterat. Matlyst känner inte av varorna automatiskt.'],
    ['tom-kylskapet/','Töm kylskåpet med recept','Använd det du redan har genom att matcha Skafferi mot din egen receptsamling.','Börja med det som finns','Se vilka sparade recept som passar varorna hemma och vilka ingredienser som saknas. Det minskar onödiga extraköp.','Matlyst kan inte avgöra om en vara är säker att äta. Kontrollera lukt, utseende, datum och förvaring själv.','Kan Matlyst avgöra om maten fortfarande är bra?','Nej. Du ansvarar alltid för att bedöma maten.'],
    ['enkel-middag/','Enkel middag från det du har','Planera enkel middag med egna recept, Skafferi, Veckomeny och Inköpslista.','Enklare vardagsmiddag','Välj en snabb rätt du redan tycker om, planera den till rätt dag och skicka det som saknas till listan.','Exempel som köttbullar med potatis, ugnslax eller en enkel pastarätt är inspiration, inte färdiga recept på sidan.','Vad är en enkel vardagsmiddag?','En rätt med tydliga steg, rimlig tid och råvaror du faktiskt har eller lätt kan köpa.'],
    ['receptskapare/','Matlyst för receptskapare','Så visar Matlyst källa, hanterar import och tar emot begäran från rättighetshavare.','Källan ska vara tydlig','Importerade recept behåller källänken när den finns.','En skapare kan kontakta hei@matlyst-app.no för frågor, rättelse eller blockering av import från en källa.','Kan en skapare stoppa import?','Ja. Kontakta oss med källan och underlag så behandlar vi begäran.'],
  ],
  da: [
    ['importer-opskrifter/','Importér opskrifter til en app','Importér opskrifter fra et link, Instagram, TikTok eller et foto, og saml dem i Matlyst.','Importér opskrifter','Send et link, eller del indholdet med Matlyst. Appen tolker ingredienser og trin og viser kilden på opskriften.','Linkimport omfatter fem importer om måneden uden Pro. Fotoimport kræver Matlyst Pro.','Kan jeg importere fra en hjemmeside?','Ja. Indsæt linket, eller del det med Matlyst.'],
    ['find-opskrifter/','Find mine opskrifter','Søg i din egen opskriftssamling efter navn, ingrediens, kategori eller kilde.','Find tilbage til det, du har gemt','Søgningen gælder opskrifterne i din samling. Filtre begrænser listen uden at blande opskrifter fra nettet ind.','Mapper og favoritter giver flere veje tilbage til de retter, du vil lave igen.','Søger Matlyst på hele nettet?','Nej. Denne søgning gælder din egen opskriftssamling.'],
    ['indkoebsliste-app/','Fælles indkøbsliste fra opskrifter','Send ingredienser fra opskrifter og Madplan til én indkøbsliste.','En indkøbsliste fra dine opskrifter','Vælg en opskrift eller en planlagt dag. Ingredienserne føjes til listen, hvor du også kan skrive egne varer.','Når en vare krydses af, kan den flyttes til Spisekammeret. Deling i en husstand kræver Matlyst Pro.','Er indkøbslisten gratis?','Den almindelige indkøbsliste kan bruges uden Pro. Deling i en husstand er en Pro-funktion.'],
    ['haandskrevne-opskrifter/','Scan håndskrevne opskrifter','Fotografér et opskriftskort, og gør teksten søgbar i din opskriftssamling.','Fra opskriftskort til digital kogebog','Fotoimporten tolker titel, ingredienser og trin. Kontrollér resultatet før lagring, især ved svær håndskrift og mængder.','Fotoimport kræver Matlyst Pro. Den oprindelige kilde kan beskrives på opskriften.','Bliver al håndskrift læst korrekt?','Nej. Resultatet afhænger af billedet og håndskriften og skal altid kontrolleres.'],
    ['opskrifter-ud-fra-ingredienser/','Opskrifter ud fra ingredienser','Find opskrifter i din egen samling, der passer til de ingredienser, du har derhjemme.','Søg med det, du har derhjemme','Skriv ingredienser, eller brug Spisekammeret. Matlyst sammenligner med opskrifterne, du allerede har gemt.','Forslagene er hjælp. Kontrollér mængder, holdbarhed og om varerne kan bruges.','Laver søgningen nye opskrifter?','Nej. Den matcher din egen samling. Spørg Matlyst kan lave eller tilpasse en ret.'],
    ['middagsforslag/','Hvad skal jeg lave til aftensmad?','Få middagsforslag fra egne opskrifter, og brug Spørg Matlyst til at tilpasse en ret.','Middagsforslag med sammenhæng','På Forsiden vises forslag fra din opskriftssamling. Spisekammeret kan hjælpe med at fremhæve retter, der passer til det, du har.','Spørg Matlyst kan lave eller ændre opskrifter. Funktionen følger appens Pro-gate.','Hvor kommer forslagene fra?','Fra opskrifter, du har gemt, og oplysninger i Spisekammeret.'],
    ['madplan-app/','Madplan-app med indkøbsliste','Planlæg ugens aftensmad med egne opskrifter, og send ingredienserne til indkøbslisten.','Planlæg ugen selv','Vælg en opskrift til hver dag, du vil planlægge. Du bestemmer selv, hvad der skal på bordet hver dag.','Madplanen og den almindelige indkøbsliste kan bruges uden Pro. Deling i en husstand kræver Pro.','Er madplanen og indkøbslisten gratis?','Madplanen og den almindelige indkøbsliste kan bruges uden Pro. Du vælger selv opskrifter og dage.'],
    ['skift-fra-paprika/','Alternativ til Paprika Recipe Manager','Flyt dine opskrifter med Matlysts import, og kontrollér hvert resultat, før du gemmer det.','Skift uden løfter om en magisk flytning','Matlyst kan importere links og filer, som appen understøtter. Det konkrete forløb afhænger af eksporten fra din nuværende app.','Matlyst har ingen tilknytning til Paprika og garanterer ikke, at alle felter kan flyttes automatisk.','Er der en direkte forbindelse til Paprika?','Nej. Brug de eksport- og importmuligheder, som tjenesterne tilbyder.'],
    ['opskrifts-app/','App til egne opskrifter','Saml egne og importerede opskrifter i mapper med favoritter, noter og kilde.','Din digitale kogebog','Gem familieopskrifter, links og retter, du laver ofte, på samme sted. Mapper og søgning holder samlingen anvendelig.','Du bestemmer over indholdet. Kilden vises på importerede opskrifter, når den findes.','Kan jeg skrive mine egne opskrifter ind?','Ja. Du kan skrive en opskrift selv eller importere fra en understøttet kilde.'],
    ['gem-opskrifter-fra-instagram/','Gem opskrifter fra Instagram','Del en offentlig reel med Matlyst, og kontrollér opskriften, før du gemmer den.','Fra reel til opskrift','Brug Instagrams delingsmenu, og vælg Matlyst. Når indholdet kan læses, får du ingredienser og trin i en redigerbar opskrift.','Kilden følger med. Privat eller utilgængeligt indhold kan ikke altid importeres.','Har Matlyst tilknytning til Instagram?','Nej. Matlyst bruger det link eller den deling, du selv sender.'],
    ['gem-opskrifter-fra-tiktok/','Gem TikTok-opskrifter','Del en TikTok-video fra en offentlig konto med Matlyst, og saml opskriften med kilden bevaret.','Gem, når du finder noget godt','Vælg Matlyst i delingsmenuen. Kontrollér mængder og trin, før opskriften gemmes.','Privat, slettet eller geografisk blokeret indhold kan ikke altid læses.','Bevares linket til videoen?','Ja, når kilden er tilgængelig, gemmes den med opskriften.'],
    ['spisekammer-app/','Spisekammer-app til opskrifter','Hold styr på varer hjemme, og find opskrifter, der passer, før maden bliver gammel.','Det, du har, samlet','Tilføj varer manuelt, eller flyt afkrydsede indkøb til Spisekammeret. Forslag kan derefter bruge indholdet som grundlag.','Gratisniveauet viser et begrænset antal varer; Pro giver mere kapacitet.','Er beholdningen altid præcis?','Kun hvis du holder Spisekammeret opdateret. Matlyst registrerer ikke varer automatisk.'],
    ['toem-koeleskabet/','Tøm køleskabet med opskrifter','Brug det, du har, ved at matche Spisekammeret med din egen opskriftssamling.','Begynd med det, du har derhjemme','Se, hvilke gemte opskrifter der passer til de varer, du har derhjemme, og hvilke ingredienser der mangler.','Matlyst kan ikke afgøre, om en vare er sikker at spise. Kontrollér selv lugt, udseende, dato og opbevaring.','Giver Matlyst en holdbarhedsgaranti?','Nej. Du har altid ansvaret for at vurdere maden.'],
    ['nem-mad/','Nem mad til hverdagen','Planlæg nem mad med egne opskrifter, Spisekammeret, Madplanen og Indkøbslisten.','Nem aftensmad med overblik','Vælg en hurtig ret, du allerede kan lide, læg den på den rigtige dag, og send det, du mangler, til listen.','Frikadeller med kartofler, en pastaret eller ovnbagt laks er eksempler, ikke færdige opskrifter på siden.','Hvad er nem mad til hverdag?','En ret med tydelige trin, rimelig tid og råvarer, du har eller let kan købe.'],
    ['opskriftsskabere/','Matlyst for opskriftsskabere','Sådan viser Matlyst kilden, håndterer import og modtager henvendelser fra rettighedshavere.','Kilden skal være tydelig','Importerede opskrifter beholder kildelinket, når det findes. Matlyst gør ikke krav på skaberens tekst eller billeder.','En skaber kan skrive til hei@matlyst-app.no om spørgsmål, rettelser eller blokering af import fra en kilde.','Kan en skaber stoppe import?','Ja. Kontakt os med kilde og dokumentation, så behandler vi henvendelsen.'],
  ],
};

const featureOverrides = {
    sv: {
      'importera-recept/': { title:'Importera recept till appen', p2:'Utan Pro kan du importera fem recept via länk per månad.' },
      'inkopslista/': { description:'Skicka ingredienser från recept och veckomeny till en och samma inköpslista.', p1:'Välj ett recept eller en hel planerad dag. Ingredienserna läggs till i listan, där du också kan skriva in egna varor.' },
      'handskrivna-recept/': { q:'Klarar appen all handstil?', p2:'Fotoimport kräver Matlyst Pro. Du kan skriva in var receptet kommer ifrån, till exempel ”Mormors receptbok”.' },
      'recept-pa-ingredienser/': { p1:'Skriv in ingredienser eller utgå från Skafferi.', p2:'Förslagen är ett hjälpmedel. Kontrollera alltid mängderna, hållbarheten och att varorna fortfarande går att äta.' },
      'vad-ska-jag-laga/': { h1:'Middagsförslag från dina egna recept', p2:'Det är gratis att ställa frågor om ett recept. När Fråga Matlyst ska skapa eller ändra recept krävs Matlyst Pro.', p1:'På fliken Hem visas förslag från din egen receptsamling. Skafferi kan hjälpa till att lyfta fram rätter som passar det du har.' },
      'veckomeny-app/': { title:'Veckomeny-app: planera veckans middagar', h1:'Veckomeny: planera veckans middagar', h2:'Så fungerar Veckomeny' },
      'byt-fran-paprika/': { h1:'Byt från Paprika – och kontrollera varje recept', p1:'Matlyst kan importera recept från länkar och filer som appen stöder. Exakt hur det går till beror på vilka exportmöjligheter din nuvarande app har.', q:'Finns det en direktkoppling till Paprika?' },
      'receptbok-app/': { p1:'Spara familjerecept, länkar du hittar och rätter du gör ofta på samma ställe. Med mappar och sökning är det lätt att hitta runt i samlingen.' },
      'spara-recept-fran-instagram/': { description:'Spara recept från Instagram i Matlyst och kontrollera dem innan du lagar maten.', p1:'Dela en reel från ett offentligt konto med Matlyst och kontrollera receptet innan du sparar.' },
      'spara-recept-fran-tiktok/': { a:'Ja. Länken sparas med receptet när videon är tillgänglig.' },
      'skafferi-app/': { title:'Skafferi-app för recept', description:'Håll koll på varor hemma och hitta recept som passar innan varorna blir gamla.', h1:'Överblick över det du har', p1:'Lägg in varor manuellt eller flytta avbockade inköp till Skafferi. Sedan kan Matlyst föreslå recept utifrån det du har hemma.', p2:'I gratisversionen rymmer Skafferi ett begränsat antal varor. Med Pro får du plats med fler.', q:'Vet appen exakt vad jag har hemma?' },
      'enkel-middag/': { h1:'Enkel middag från det du har', h2:'Från sparat recept till middag', description:'Planera en enkel middag med dina egna recept, det du har i Skafferi och en färdig inköpslista.', p1:'Välj en snabb rätt du redan tycker om och lägg in den på en dag som passar. Skicka sedan det som saknas till listan.', p2:'Tänk köttbullar med potatis, ugnsbakad lax eller en snabb pastarätt – vardagsrätter du sparar en gång och lagar igen och igen.', },
      'receptskapare/': { description:'Så visar Matlyst källan, hanterar import och tar emot begäranden från rättighetshavare.', p2:'En skapare kan kontakta hei@matlyst-app.no om frågor, rättelse eller blockering av import från en källa. Matlyst gör inte anspråk på skaparens text eller bilder.' },
    },
    da: {
      'importer-opskrifter/': { title:'Importér opskrifter til din opskriftsapp', p2:'Uden Pro kan du importere fem links om måneden.' },
      'indkoebsliste-app/': { p1:'Vælg en opskrift eller en planlagt dag. Ingredienserne lægges på Indkøbslisten, hvor du også kan skrive egne varer.', q:'Er Indkøbsliste gratis?', a:'Ja. Du kan bruge Indkøbsliste uden Pro. Deling i en husstand er en Pro-funktion.' },
      'haandskrevne-opskrifter/': { p1:'Fotoimporten tolker titel, ingredienser og trin. Tjek resultatet, før du gemmer – især mængderne, og når håndskriften er svær at læse.', p2:'Fotoimport kræver Matlyst Pro. Du kan selv notere, hvor opskriften stammer fra.' },
      'opskrifter-ud-fra-ingredienser/': { p1:'Skriv ingredienser, eller brug Spisekammeret. Matlyst sammenligner dem med de opskrifter, du allerede har gemt.', p2:'Forslagene er kun vejledende. Tjek mængder, holdbarhed, og om varerne stadig kan bruges.' },
      'middagsforslag/': { title:'Forslag til aftensmad fra dine egne opskrifter', h1:'Forslag til aftensmad fra dine egne opskrifter', h2:'Forslag fra din egen samling', p1:'På Hjem vises forslag fra din opskriftssamling. Spisekammeret kan hjælpe med at fremhæve retter, der passer til det, du har. Se også <a href="/da/nem-mad/">nem mad</a>.', p2:'Det er gratis at stille spørgsmål om en opskrift. Når Spørg Matlyst skal lave eller ændre opskrifter, kræver det Matlyst Pro.' },
      'madplan-app/': { description:'Planlæg ugens aftensmad med egne opskrifter, og send ingredienserne til Indkøbslisten.', p1:'Vælg en opskrift til de dage, du vil planlægge. Du bestemmer selv, hvad der skal på bordet.', p2:'Deling af Madplan og Indkøbsliste i en husstand kræver Matlyst Pro.', q:'Er Madplan og Indkøbsliste gratis?', a:'Ja. Du kan bruge Madplan og Indkøbsliste uden Pro.' },
      'skift-fra-paprika/': { description:'Flyt dine opskrifter med Matlysts import, og kontrollér hvert resultat, før du gemmer det.', h1:'Skift til Matlyst – uden tomme løfter', p1:'Matlyst kan importere links og filer, som appen understøtter. Det konkrete forløb afhænger af eksporten fra din nuværende app.' },
      'opskrifts-app/': { p1:'Gem familieopskrifter, links og retter, du laver ofte, på samme sted. Med mapper og søgning er det let at finde rundt i samlingen.' },
      'gem-opskrifter-fra-instagram/': { description:'Gem opskrifter fra Instagram i Matlyst, og kontrollér dem, før du laver mad.', p1:'Del en reel fra en offentlig konto med Matlyst, og kontrollér opskriften, før du gemmer den.' },
      'gem-opskrifter-fra-tiktok/': { a:'Ja. Linket gemmes med opskriften, når videoen er tilgængelig.' },
      'spisekammer-app/': { title:'Spisekammer-app til opskrifter', description:'Hold styr på varerne derhjemme, og find opskrifter, der passer, før maden skal smides ud.', h1:'Overblik over det, du har', p1:'Tilføj varer manuelt, eller flyt afkrydsede indkøb til Spisekammeret. Så kan forslagene tage udgangspunkt i det.', p2:'I gratisversionen er der plads til et begrænset antal varer. Med Pro er der plads til flere.', },
      'nem-mad/': { h1:'Nem mad til hverdagen', h2:'Fra gemt opskrift til aftensmad', p1:'Vælg en hurtig ret, du allerede kan lide, læg den på en dag, der passer, og send det, du mangler, til listen.', p2:'Det kan være frikadeller med kartofler, en hurtig pastaret eller laks i ovnen – retter, du allerede kender.' },
    },
};

function featureValues(lang, row) {
  const [path,title,description,h1,p1,p2,q,a] = row;
  return { path, title, description, h1, h2: title, p1, p2, q, a, ...featureOverrides[lang]?.[path] };
}

function featurePage(lang, row) {
  const values = featureValues(lang, row);
  const { path } = values;
  const faq = {'@context':'https://schema.org','@type':'FAQPage',mainEntity:[{'@type':'Question',name:values.q,acceptedAnswer:{'@type':'Answer',text:values.a}}]};
  const crumbs = {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[
    {'@type':'ListItem',position:1,name:common[lang].home,item:`${base}/${lang}/`},
    {'@type':'ListItem',position:2,name:values.h1,item:`${base}/${lang}/${path}`},
  ]};
  const sectionLabel = lang === 'sv' ? 'Bra att veta' : 'Godt at vide';
  return `${head({lang,path,title:`${values.title} | Matlyst`,description:values.description,schema:[crumbs,faq]})}<body data-locale="${lang}">
${nav(lang,path)}<main id="hovedinnhold"><header class="locale-page-hero"><p class="eyebrow">Matlyst</p><h1 class="disp">${values.h1}</h1><p class="lead">${values.description}</p></header>
<section class="prose locale-prose"><h2>${values.h2}</h2><p>${values.p1}</p><h2>${sectionLabel}</h2><p>${values.p2}</p></section>
<section class="faq"><h2>${lang === 'sv' ? 'Vanliga frågor' : 'Ofte stillede spørgsmål'}</h2><details open><summary>${values.q}</summary><p>${values.a}</p></details></section>
<section class="page-cta"><h2 class="disp">${lang === 'sv' ? 'Få ordning på vardagsmaten med Matlyst' : 'Få styr på hverdagen med Matlyst'}</h2>${storeButtons(lang)}</section></main>${footer(lang)}<script src="/site.js" defer></script></body></html>`;
}

const sourcePages = {
  sv: [
    ['koket/','Spara recept från Köket.se','Så sparar du ett recept från Köket.se i Matlyst, med källan kvar.','Köket.se','https://www.koket.se/'],
    ['landleys-kok/','Spara recept från Landleys Kök','Så sparar du ett recept från Landleys Kök i Matlyst, med källan kvar.','Landleys Kök','https://www.landleyskok.se/'],
  ],
  da: [
    ['alletiders-kogebog/','Gem opskrifter fra Alletiders Kogebog','Sådan gemmer du en opskrift fra Alletiders Kogebog i Matlyst med kilden bevaret.','Alletiders Kogebog','https://www.dk-kogebogen.dk/'],
    ['dr-mad/','Gem opskrifter fra DR Mad','Sådan gemmer du en opskrift fra DR Mad i Matlyst med kilden bevaret.','DR Mad','https://www.dr.dk/mad'],
  ],
};

function sourcePage(lang, row) {
  const [path,title,description,source,sourceUrl] = row;
  const sv = lang === 'sv';
  const crumbs = {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[
    {'@type':'ListItem',position:1,name:common[lang].home,item:`${base}/${lang}/`},
    {'@type':'ListItem',position:2,name:title,item:`${base}/${lang}/${path}`},
  ]};
  return `${head({lang,path,title:`${title} | Matlyst`,description,schema:crumbs})}<body data-locale="${lang}">
${nav(lang,path)}<main id="hovedinnhold"><header class="locale-page-hero"><p class="eyebrow">${sv ? 'Spara med källan kvar' : 'Gem med kilden bevaret'}</p><h1 class="disp">${title}</h1><p class="lead">${description}</p></header>
<section class="prose locale-prose"><h2>${sv ? 'Så gör du' : 'Sådan gør du'}</h2><ol><li>${sv ? `Öppna ett recept från ${source}.` : `Åbn en opskrift fra ${source}.`}</li><li>${sv ? 'Dela länken med Matlyst eller klistra in den i importen.' : 'Del linket med Matlyst, eller indsæt det i importen.'}</li><li>${sv ? 'Kontrollera ingredienser, mängder och steg innan du sparar.' : 'Kontrollér ingredienser, mængder og trin, før du gemmer den.'}</li></ol>
<h2>${sv ? 'Källa och ansvar' : 'Kilde og ansvar'}</h2><p>${sv ? `Matlyst visar källänken när den kan läsas. Matlyst samarbetar inte med ${source} och gör inte anspråk på deras texter eller bilder.` : `Matlyst viser kildelinket, når det kan læses. Matlyst samarbejder ikke med ${source} og gør ikke krav på deres tekster eller billeder.`}</p><p><a href="${sourceUrl}" rel="noopener">${sv ? `Besök ${source}` : `Besøg ${source}`}</a></p></section>
<section class="page-cta"><h2 class="disp">${sv ? 'Spara recepten där du lagar maten' : 'Gem dine yndlingsopskrifter ét sted'}</h2>${storeButtons(lang)}</section></main>${footer(lang)}<script src="/site.js" defer></script></body></html>`;
}

const supportPages = {
  sv: [
    ['avregistrera/','Avregistrera dig från nyhetsbrevet','Avregistrera dig via länken längst ned i e-postmeddelandet eller kontakta hei@matlyst-app.no.'],
    ['tiktok/','TikTok och Matlyst','Den här sidan används när du delar en länk till en TikTok-video från ett offentligt konto med Matlyst. Privat eller borttaget innehåll kan inte alltid läsas.'],
    ['tiktok-auth/','TikTok-anslutning','Teknisk retursida för TikTok-anslutning i Matlyst.'],
  ],
  da: [
    ['afmeld/','Afmeld nyhedsbrevet','Afmeld dig via linket nederst i e-mailen, eller skriv til hei@matlyst-app.no.'],
    ['tiktok/','TikTok og Matlyst','Denne side bruges, når du deler et link til en TikTok-video fra en offentlig konto med Matlyst. Privat eller slettet indhold kan ikke altid læses.'],
    ['tiktok-auth/','TikTok-forbindelse','Teknisk returside til TikTok-forbindelse i Matlyst.'],
  ],
};

function supportPage(lang, row) {
  const [path,title,text] = row;
  const schema = {'@context':'https://schema.org','@type':'WebPage',name:title,url:`${base}/${lang}/${path}`};
  return `${head({lang,path,title:`${title} | Matlyst`,description:text,noindex:true,schema})}<body data-locale="${lang}">${nav(lang,path)}<main id="hovedinnhold" class="legal-doc"><header><p class="eyebrow">Matlyst</p><h1 class="disp">${title}</h1><p class="lead">${text}</p></header></main>${footer(lang)}<script src="/site.js" defer></script></body></html>`;
}

const avmeldTekst = {
  sv: {
    kicker: 'Nyhetsbrev',
    tittel: 'Vill du <em>avregistrera dig</em>?',
    intro: 'Då slutar nyhetsbrevet att komma. Det skickas varannan vecka med ett tips och det som är nytt i appen. Ditt konto påverkas inte.',
    knapp: 'Avregistrera mig',
    venter: 'Avregistrerar …',
    ferdigTittel: 'Du är <em>avregistrerad</em>',
    ferdig: 'Vi skickar inga fler nyhetsbrev till dig.',
    angre: 'Om du ändrar dig kan du slå på nyhetsbrevet igen under Profil i appen.',
    manglerTittel: 'Den här länken saknar <em>något</em>',
    mangler: 'Adressen verkar ha tappat en del på vägen. Öppna länken från e-postmeddelandet igen eller skriv till',
    utenJs: 'Din webbläsare kör inte JavaScript. Knappen nedan gör samma sak, men tar dig till en enklare bekräftelsesida.',
    feil: 'Det gick inte just nu. Försök igen eller skriv till',
    emne: 'Avregistrera%20mig%20från%20nyhetsbrevet',
  },
  da: {
    kicker: 'Nyhedsbrev',
    tittel: 'Vil du <em>afmelde dig</em>?',
    intro: 'Så stopper nyhedsbrevet, som sendes hver anden uge med et tip og nyt fra appen. Din konto ændres ikke.',
    knapp: 'Afmeld mig',
    venter: 'Afmelder …',
    ferdigTittel: 'Du er <em>afmeldt</em>',
    ferdig: 'Vi sender dig ikke flere nyhedsbreve.',
    angre: 'Skifter du mening, kan du slå nyhedsbrevet til igen under Profil i appen.',
    manglerTittel: 'Der mangler <em>noget</em> i linket',
    mangler: 'Adressen ser ud til at have mistet en del undervejs. Åbn linket fra e-mailen igen, eller skriv til',
    utenJs: 'Din browser kører ikke JavaScript. Knappen nedenfor gør det samme, men fører dig til en enklere bekræftelsesside.',
    feil: 'Det lykkedes ikke lige nu. Prøv igen, eller skriv til',
    emne: 'Afmeld%20mig%20nyhedsbrevet',
  },
};

function avmeldPage(lang, row) {
  const [path,title,description] = row;
  const tekst = avmeldTekst[lang];
  const schema = {'@context':'https://schema.org','@type':'WebPage',name:title,url:`${base}/${lang}/${path}`};
  const kontakt = `<a href="mailto:hei@matlyst-app.no?subject=${tekst.emne}">hei@matlyst-app.no</a>`;
  const sideHode = head({lang,path,title:`${title} | Matlyst`,description,noindex:true,schema})
    // Avmeldingstokenet (u/s) står i URL-en: ingen analyse, ingen samtykkebanner,
    // ingen referrer og ingen indeksering eller lenkefølging (som nb /avmeld/).
    .replace('<meta name="robots" content="noindex, follow">', '<meta name="robots" content="noindex, nofollow">\n<meta name="referrer" content="no-referrer">')
    .replace('</head>', '<link rel="stylesheet" href="/avmeld.css">\n</head>');
  return `${sideHode}<body data-locale="${lang}">${nav(lang,path)}<main id="hovedinnhold" class="avmeld-doc">
<section id="bekreft" hidden><p class="avmeld-kicker">${tekst.kicker}</p><h1 class="avmeld-title">${tekst.tittel}</h1><p class="avmeld-intro">${tekst.intro}</p><div class="avmeld-kort"><button class="avmeld-knapp" id="meldAv" type="button">${tekst.knapp}</button><p class="avmeld-status" id="status" data-venter="${tekst.venter}" role="status" aria-live="polite"></p></div></section>
<section id="ferdig" hidden><p class="avmeld-kicker">${tekst.kicker}</p><h1 class="avmeld-title">${tekst.ferdigTittel}</h1><p class="avmeld-intro">${tekst.ferdig}</p><p class="avmeld-intro">${tekst.angre}</p></section>
<section id="mangler" hidden><p class="avmeld-kicker">${tekst.kicker}</p><h1 class="avmeld-title">${tekst.manglerTittel}</h1><p class="avmeld-intro">${tekst.mangler} ${kontakt}.</p></section>
<noscript><p class="avmeld-kicker">${tekst.kicker}</p><h1 class="avmeld-title">${tekst.tittel}</h1><p class="avmeld-intro">${tekst.utenJs}</p><form class="avmeld-kort" method="POST" id="reserve" action="https://uaryzmqvoqljjwqvgzoi.supabase.co/functions/v1/avmeld"><input type="hidden" name="List-Unsubscribe" value="One-Click"><button class="avmeld-knapp" type="submit">${tekst.knapp}</button></form></noscript>
<template id="feilmelding">${tekst.feil} ${kontakt}.</template>
</main><script src="/avmeld.js" defer></script></body></html>`;
}


// Veiledningen som e-postene lenker til («See how to save a recipe»).
const veiledninger = {
  en: [{
    path: 'import-recipes/',
    title: 'How to import recipes from Instagram, TikTok and the web',
    description: 'Save a recipe from Instagram, TikTok, YouTube or any website in a few taps. Matlyst gives you the ingredients and method in English, ready for your meal plan and shopping list.',
    eyebrow: 'Recipe import',
    h1: 'Save a recipe from Instagram, TikTok or any website',
    lead: 'Found something you want to cook? Share it with Matlyst and you get the recipe with its ingredients and method, in English, ready for your meal plan and shopping list.',
    forst: 'Before your first import, open Matlyst once and accept the AI notice. Matlyst uses AI to read and translate recipes.',
    stegTittel: 'Save your first recipe',
    steg: [
      ['Find the recipe', 'Open the post, video or web page with the recipe on Instagram, TikTok, YouTube or a food blog.'],
      ['Share it to Matlyst', 'Tap <strong>Share</strong> and choose <strong>Matlyst</strong>. Pick a folder if you like, then tap <strong>Save</strong>. Matlyst fetches the recipe in the background.'],
      ['Check it over', 'Open the recipe in Matlyst and look over the ingredients and method before you start cooking.'],
    ],
    alternativ: 'Prefer to paste? Copy the link, open <strong>Add recipe</strong> in Matlyst and choose <strong>Paste a link</strong>. Tap <strong>Get recipe</strong>, then <strong>Save recipe</strong>.',
    grense: 'Matlyst can only read what’s publicly visible in a post. If a post is private, or the recipe isn’t in the caption, copy the text and paste it under <strong>Type it in</strong> instead.',
    seksjoner: [
      ['Four ways to add a recipe', liste([
        '<strong>A link:</strong> paste the address of a recipe from any website or food blog.',
        '<strong>A video or post:</strong> share a reel or video from Instagram, TikTok or YouTube straight to Matlyst.',
        '<strong>A photo:</strong> snap a cookbook page, a magazine or a handwritten card. Photo import needs Matlyst Pro.',
        '<strong>Text:</strong> paste or type a recipe straight into the app.',
      ])],
      ['In English, whatever the original language', avsnitt('Matlyst translates the ingredients and method into your app’s language, so with the app in English, every recipe arrives in English. It uses metric units unless you switch to US units in Settings. A link to the source stays with the recipe, so you can always find your way back to the person who made it.')],
      ['Put your recipes to work', avsnitt('Sort your recipes into folders and find them again when it’s time to decide what to cook. Add a recipe to your meal plan and send its ingredients to your shopping list.')],
    ],
    faqTittel: 'Questions and answers',
    faq: [
      ['How do I save a recipe from Instagram or TikTok?', 'Tap Share on the post or video and choose Matlyst. Pick a folder if you like and tap Save. The recipe is ready in Matlyst a few seconds later.'],
      ['Are recipes in other languages translated?', 'Yes. The ingredients and method are translated into your app language. Metric units are the default, and you can switch to US units in Settings.'],
      ['Can I save a handwritten recipe?', 'Yes, with Matlyst Pro. Take a photo and Matlyst reads the text and adds it, just like a recipe from the web.'],
      ['What does it cost?', 'You get 5 free link imports a month. Matlyst Pro removes that limit and adds photo import. The current price and terms are shown in the app before you buy.'],
    ],
    cta: 'Start with one recipe',
  }],
};

function guidePage(lang, v) {
  const faq = {'@context':'https://schema.org','@type':'FAQPage',mainEntity:v.faq.map(([q,a]) => ({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))};
  const howTo = {'@context':'https://schema.org','@type':'HowTo',name:v.stegTittel,step:v.steg.map(([name,text],i) => ({'@type':'HowToStep',position:i+1,name,text:text.replace(/<[^>]+>/gu,'')}))};
  const crumbs = {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[
    {'@type':'ListItem',position:1,name:common[lang].home,item:`${base}/${lang}/`},
    {'@type':'ListItem',position:2,name:v.h1,item:`${base}/${lang}/${v.path}`},
  ]};
  return `${head({lang,path:v.path,title:`${v.title} | Matlyst`,description:v.description,schema:[crumbs,howTo,faq]})}<body data-locale="${lang}">
${nav(lang,v.path)}<main id="hovedinnhold"><header class="locale-page-hero"><p class="eyebrow">${v.eyebrow}</p><h1 class="disp">${v.h1}</h1><p class="lead">${v.lead}</p></header>
<section class="prose locale-prose"><h2>${v.stegTittel}</h2><p>${v.forst}</p><ol>${v.steg.map(([h,p]) => `<li><strong>${h}.</strong> ${p}</li>`).join('')}</ol><p>${v.alternativ}</p><p>${v.grense}</p>
${v.seksjoner.map(([h,body]) => `<h2>${h}</h2>${body}`).join('\n')}</section>
<section class="faq"><h2>${v.faqTittel}</h2>${v.faq.map(([q,a],i) => `<details${i === 0 ? ' open' : ''}><summary>${q}</summary><p>${a}</p></details>`).join('')}</section>
<section class="page-cta"><h2 class="disp">${v.cta}</h2>${storeButtons(lang)}</section></main>${footer(lang)}<script src="/site.js" defer></script></body></html>`;
}

supportPages.en = [
  ['unsubscribe/', 'Unsubscribe from the newsletter', 'Unsubscribe with the link at the bottom of any Matlyst newsletter, or email hei@matlyst-app.no.'],
];

avmeldTekst.en = {
  kicker: 'Newsletter',
  tittel: 'Want to <em>unsubscribe</em>?',
  intro: 'You’ll stop getting the Matlyst newsletter, which comes every other week with a tip and what’s new in the app. Your account stays exactly as it is.',
  knapp: 'Unsubscribe me',
  venter: 'Unsubscribing…',
  ferdigTittel: 'You’re <em>unsubscribed</em>',
  ferdig: 'We won’t send you any more newsletters.',
  angre: 'Changed your mind? You can turn the newsletter back on under Profile in the app.',
  manglerTittel: 'This link is <em>incomplete</em>',
  mangler: 'Part of the address seems to have gone missing on the way. Some email apps split long links. Open the link from the email again, or write to',
  utenJs: 'Your browser isn’t running JavaScript. The button below does the same thing, but takes you to a simpler confirmation page.',
  feil: 'That didn’t work just now. Try again, or write to',
  emne: 'Unsubscribe%20me%20from%20the%20newsletter',
};

const lokaleSider = [];
function write(path, content) {
  const file = fileURLToPath(new URL(path, import.meta.url));
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
  if (SPRAK.some((sprak) => path.startsWith(`../${sprak}/`)) && path.endsWith('index.html')) lokaleSider.push(content);
}

for (const lang of SPRAK) {
  write(`../${lang}/index.html`, home(lang));
  for (const key of Object.keys(legal[lang])) {
    const d = legal[lang][key];
    write(`../${lang}/${d.path}index.html`, legalPage(lang,key));
  }
  for (const row of featurePages[lang] ?? []) write(`../${lang}/${row[0]}index.html`, featurePage(lang,row));
  for (const v of veiledninger[lang] ?? []) write(`../${lang}/${v.path}index.html`, guidePage(lang,v));
  for (const row of sourcePages[lang] ?? []) write(`../${lang}/${row[0]}index.html`, sourcePage(lang,row));
  for (const row of supportPages[lang] ?? []) {
    const innhold = gruppeForSti(`/${lang}/${row[0]}`)?.id === 'avmeld'
      ? avmeldPage(lang,row)
      : supportPage(lang,row);
    write(`../${lang}/${row[0]}index.html`, innhold);
  }
}

// Norske og lokale sider får hreflang fra den samme tabellen som språkredirecten.
// Dette gjør også eldre, håndskrevne norske sider gjensidige uten å endre innholdet deres.
for (const gruppe of SIDEGRUPPER) {
  for (const sti of Object.values(gruppe.sider)) {
    const fil = fileURLToPath(new URL(`../${filForSti(sti)}`, import.meta.url));
    if (!existsSync(fil)) throw new Error(`Finner ikke tabellført side: ${sti}`);
    let html = readFileSync(fil, 'utf8');
    const canonical = `<link rel="canonical" href="${base}${sti}">`;
    const eksisterendeCanonical = html.match(/^(\s*)<link rel="canonical" href="[^"]+">/mu);
    const innrykk = eksisterendeCanonical?.[1] ?? '';
    const forventedeAlternativer = alternateLinks(sti).split('\n').map((linje) => `${innrykk}${linje}`);
    const faktiskeAlternativer = [...html.matchAll(/^\s*<link rel="alternate" hreflang="[^"]+" href="[^"]+">\s*$/gmu)]
      .map(([linje]) => linje.trimEnd());
    const skalHaRedirect = gruppe.redirect !== false && Object.keys(gruppe.sider).length > 1;
    const harRedirect = html.includes('<script src="/locale.js"></script>');
    const erOppdatert = eksisterendeCanonical?.[0].trim() === canonical
      && JSON.stringify(faktiskeAlternativer) === JSON.stringify(forventedeAlternativer)
      && harRedirect === skalHaRedirect;
    if (erOppdatert) continue;

    html = html
      // [ \t] og ikke \s: \s spiser linjeskiftet og innrykket på neste linje, så
      // annenhver innrykkede lenke ble stående igjen.
      .replace(/^[ \t]*<link rel="alternate" hreflang="[^"]+" href="[^"]+">[ \t]*\n?/gmu, '')
      .replace(/^[ \t]*<script src="\/locale\.js"><\/script>[ \t]*\n?/gmu, '');
    if (eksisterendeCanonical) {
      html = html.replace(eksisterendeCanonical[0], `${innrykk}${canonical}`);
    } else {
      html = html.replace(/(<meta name="viewport"[^>]*>\n)/u, `$1${canonical}\n`);
    }
    const teknisk = [`${innrykk}${canonical}`, ...forventedeAlternativer];
    if (skalHaRedirect) teknisk.push(`${innrykk}<script src="/locale.js"></script>`);
    html = html.replace(`${innrykk}${canonical}`, teknisk.join('\n'));
    writeFileSync(fil, html);
  }
}

// Ett sitemap per språk. Sider med noindex (støttesidene) tas ikke med.
const sistEndret = { en: '2026-10-20' };
for (const lang of SPRAK) {
  const urls = lokaleSider
    .filter((html) => html.includes(`<html lang="${lang}">`) && !html.includes('content="noindex'))
    .map((html) => {
      const loc = html.match(/<link rel="canonical" href="([^"]+)">/u)[1];
      const alternativer = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/gu)]
        .map(([, kode, href]) => `    <xhtml:link rel="alternate" hreflang="${kode}" href="${href}"/>`);
      return [`  <url>`, `    <loc>${loc}</loc>`, `    <lastmod>${sistEndret[lang] ?? '2026-10-05'}</lastmod>`, ...alternativer, `  </url>`].join('\n');
    })
    .sort();
  write(`../sitemap-${lang}.xml`, ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">', ...urls, '</urlset>'].join('\n') + '\n');
}

// Automatisk språk bygges direkte fra den samme sidetabellen som hreflang.
const sidekart = byggLocalePageMap();
const kartTekst = Object.keys(sidekart).sort()
  .map((sti) => `    ${JSON.stringify(sti)}: ${JSON.stringify(sidekart[sti]).replaceAll(',', ', ').replaceAll(':', ': ')},`)
  .join('\n');
const localeFil = fileURLToPath(new URL('../locale.js', import.meta.url));
const localeKilde = readFileSync(localeFil, 'utf8');
const nyLocale = localeKilde.replace(/var LOCALE_PAGE_MAP = Object\.freeze\(\{[\s\S]*?\}\);/u, `var LOCALE_PAGE_MAP = Object.freeze({\n${kartTekst}\n  });`);
if (nyLocale === localeKilde && !localeKilde.includes(kartTekst)) throw new Error('Fant ikke LOCALE_PAGE_MAP i locale.js');
writeFileSync(localeFil, nyLocale);

const norskeAvsnitt = {
  'importera-recept/': 'Send en lenke eller del innholdet til Matlyst. Appen tolker ingredienser og fremgangsmåte og viser kilden på oppskriften.',
  'hitta-recept/': 'Søk i oppskriftene i din egen samling. Filtre avgrenser listen uten å blande inn oppskrifter fra nettet.',
  'inkopslista/': 'Velg en oppskrift eller en planlagt dag. Ingrediensene legges i handlelisten, der du også kan skrive inn egne varer.',
  'handskrivna-recept/': 'Bildeimporten tolker tittel, ingredienser og fremgangsmåte. Kontroller resultatet før du lagrer.',
  'recept-pa-ingredienser/': 'Skriv ingredienser eller bruk Spiskammeret. Matlyst sammenligner med oppskriftene du allerede har lagret.',
  'vad-ska-jag-laga/': 'På Hjem vises forslag fra din egen oppskriftsamling. Spiskammeret kan løfte fram retter som passer det du har.',
  'veckomeny-app/': 'Velg en oppskrift for hver dag du vil planlegge. Matlyst lager ikke en ferdig uke automatisk.',
  'byt-fran-paprika/': 'Matlyst kan importere lenker og filer som appen støtter. Flyttingen avhenger av eksporten fra den gamle appen.',
  'receptbok-app/': 'Samle familieoppskrifter, lenker og retter du lager ofte på samme sted. Mapper og søk holder samlingen oversiktlig.',
  'spara-recept-fran-instagram/': 'Bruk Instagrams delingsmeny og velg Matlyst. Kontroller ingredienser og steg før du lagrer.',
  'spara-recept-fran-tiktok/': 'Velg Matlyst i delingsmenyen. Kildelenken lagres sammen med oppskriften når innholdet er tilgjengelig.',
  'skafferi-app/': 'Legg inn varer manuelt eller flytt avkryssede innkjøp til Spiskammeret. Forslag kan bruke innholdet som grunnlag.',
  'tom-kylskapet/': 'Se hvilke lagrede oppskrifter som passer varene hjemme, og hvilke ingredienser som mangler.',
  'enkel-middag/': 'Velg en enkel rett du allerede liker, planlegg den på riktig dag og send det som mangler til handlelisten.',
  'receptskapare/': 'Importerte oppskrifter beholder kildelenken når den finnes. Matlyst gjør ikke krav på skaperens tekst eller bilder.',
};
const sammenheng = ['# Funksjonssider: norsk, svensk og dansk', '', 'Kontrollgrunnlag generert 2026-10-05. Hver rad viser samme produktløfte med lokal formulering.', '', '| Norsk | Svensk | Dansk |', '|---|---|---|'];
for (const sv of featurePages.sv) {
  const gruppe = gruppeForSti(`/sv/${sv[0]}`);
  const daSti = gruppe?.sider.da?.replace(/^\/da\//u, '');
  const da = featurePages.da.find((row) => row[0] === daSti);
  if (!da) continue;
  const svValues = featureValues('sv', sv);
  const daValues = featureValues('da', da);
  sammenheng.push(`| ${norskeAvsnitt[sv[0]]} | **${svValues.h1}:** ${svValues.p1} | **${daValues.h1}:** ${daValues.p1} |`);
}
write('../qa/sv-da/funksjoner-side-for-side.md', sammenheng.join('\n') + '\n');

function bevis(path) {
  if (/import|instagram|tiktok|handskriv|haandskrev/.test(path)) return '`lib/importEngine.ts:201-229`, `app/(tabs)/legg-til.tsx`';
  if (/hitta|find|recept-pa|opskrifter-ud/.test(path)) return '`hooks/useRecipeSearch.ts:53-94`, `hooks/usePantryRecipes.ts`';
  if (/inkop|indkoeb/.test(path)) return '`app/(tabs)/grocery.tsx:285-367`, `hooks/useGrocery.ts`';
  if (/veckomeny|madplan/.test(path)) return '`app/(tabs)/ukemeny.tsx:371-433`, `app/recipe-picker.tsx`';
  if (/skafferi|spisekammer|kylskap|koeleskab/.test(path)) return '`hooks/usePantry.ts:247-276`, `hooks/usePantryRecipes.ts`';
  if (/vad-ska|middagsforslag/.test(path)) return '`hooks/useRecommendations.ts:76-131`, `hooks/useSporMatlyst.ts:118-221`, `supabase/functions/_shared/sporMatlyst/skjema.ts:390-391` (gratis: bare spørsmål i en oppskrift)';
  if (/paprika/.test(path)) return '`components/RecipeFileImport.tsx`, `lib/importEngine.ts:248-270`';
  if (/receptskapare|opskriftsskabere/.test(path)) return '`lib/source.ts:20-74`, `lib/source.ts:84-107`';
  return '`hooks/useRecipes.ts:169-199`, `hooks/useRecipeSearch.ts:53-94`';
}
const paastander = ['# Produktpåstander per side', '', 'Kontrollert mot appens `origin/master` `2613d17d3173676a0eb6229a16b3e534a670a946`, lest 2026-10-05. Påstanden er sitert ordrett fra sidens avsnitt «Bra att veta» / «Godt at vide» (kildesider: «Källa och ansvar» / «Kilde og ansvar»).', '', '| Side | Påstand som må holde (ordrett sitat) | Kodebevis |', '|---|---|---|'];
for (const lang of ['sv','da']) for (const row of featurePages[lang]) {
  const claim = featureValues(lang, row).p2;
  paastander.push(`| /${lang}/${row[0]} | ${claim} | ${bevis(row[0])} |`);
}
for (const lang of ['sv','da']) for (const row of sourcePages[lang]) {
  paastander.push(`| /${lang}/${row[0]} | ${lang === 'sv' ? `Matlyst visar källänken när den kan läsas. Matlyst samarbetar inte med ${row[3]} och gör inte anspråk på deras texter eller bilder.` : `Matlyst viser kildelinket, når det kan læses. Matlyst samarbejder ikke med ${row[3]} og gør ikke krav på deres tekster eller billeder.`} | \`lib/importEngine.ts:201-229\`, \`lib/source.ts:20-74\` |`);
}
paastander.push('', '## llms.txt og forsidene', '', 'Kontrollert mot appens `origin/master` `1692bc59`, lest 2026-10-05 (bare lesing). Rader merket «forutsetter #536» er kontrollert mot PR-grenen `origin/feat/f2-spor-matlyst-da-sv` (`b051ac02`, lest 2026-10-05, bare lesing) og stemmer først når #536 er merget og edge-funksjonen er deployet. Ikke tatt med i llms.txt fordi belegg mangler: Pinterest, PDF- og tekstfiler.', '', '| Påstand | Kodebevis |', '|---|---|');
paastander.push('| Plattformer: iOS (iPhone og iPad) og Android | `app.json:24-25` (`"supportsTablet": true`), `app.json:76` (`"android"`) |');
paastander.push('| Import fra nettside/matblogg, Instagram, TikTok og YouTube | `lib/sprak/tekster/nb.ts:1205`, `da.ts:453`, `sv.ts:453` («Fra Instagram, TikTok, YouTube eller en matblogg»); `lib/importEngine.ts:121-126`; `supabase/functions/import-recipe/index.ts:33,1478` (YouTube) |');
paastander.push('| Import fra Facebook | `supabase/functions/import-recipe/index.ts:1406` (`isMeta` matcher instagram.com, facebook.com og fb.watch); `lib/importEngine.ts:124` |');
paastander.push('| Delingsmenyen på iOS og Android | `app.json:142-158` (share extension), `plugins/withAndroidShareActivity.js:57` (`android.intent.action.SEND`) |');
paastander.push('| Bilde av oppskrift fra kokebok, blad eller skjerm | `lib/sprak/tekster/nb.ts:1209`, `da.ts:457`, `sv.ts:457` |');
paastander.push('| Eksportfil fra Paprika Recipe Manager | `components/RecipeFileImport.tsx:258` |');
paastander.push("| Oversetting til brukerens språk nb, da eller sv | `lib/sprak/koder.ts:24` (`SPRAK = ['nb', 'da', 'sv']`); `supabase/functions/import-recipe/index.ts:826-831` (`velgImportSprak(language, profile.app_language)`) |");
paastander.push('| Metriske mål som standard; kan beholde amerikanske mål | `supabase/migrations/20260419000000_unit_system_and_delete_account.sql:3` (default `metric`); `supabase/functions/_shared/sprak.ts:176-177, 200-201, 224-225`; `app/innstillinger.tsx:141` |');
paastander.push('| Spør Matlyst / Spørg Matlyst / Fråga Matlyst | `lib/sprak/tekster/nb.ts:1187`, `da.ts:435`, `sv.ts:435` |');
paastander.push('| Tilpassing: bytte, fjerne, legge til ingredienser og endre porsjoner | `supabase/functions/_shared/sporMatlyst/prompt.ts:27-28` (master); forutsetter #536: `prompt.ts:109` på PR-grenen |');
paastander.push('| Spørsmål om en oppskrift er gratis; å lage eller endre oppskrifter med Spør Matlyst krever Pro (/sv/vad-ska-jag-laga/, /da/middagsforslag/, llms.txt) | `supabase/functions/spor-matlyst/index.ts:89-92`; `supabase/functions/_shared/sporMatlyst/skjema.ts:390-391` |');
paastander.push('| Spør/Spørg/Fråga Matlyst svarer på brukerens språk (nb, da, sv) — forutsetter #536 | PR-grenen: `hooks/useSporMatlyst.ts:54,122` (sender `sprak`), `supabase/functions/_shared/sporMatlyst/skjema.ts:235` (godtar bare nb/da/sv), `supabase/functions/spor-matlyst/index.ts:89,122` (`byggSystemtekst(f.sprak)`), `supabase/functions/_shared/sporMatlyst/prompt.ts:116-126` («All user-visible text … must be in ${lokal.navn}»). På master er funksjonen nb-only (`skjema.ts:8`) |');
paastander.push('| Madplan (da), Veckomeny (sv), Indkøbsliste/Inköpslista og Spisekammer/Skafferi — forutsetter #536 | PR-grenen: `lib/sprak/tekster/da.ts:94,201` (`Madplan`), `da.ts:109,203` (`Spisekammer`, `Indkøbsliste`); `sv.ts:94,109,203` (`Veckomeny`, `Skafferi`, `Inköpslista`). På master heter den danske funksjonen `Ugemenu` |');
paastander.push('| Håndskrevne oppskrifter (nb-forsiden, /sv/handskrivna-recept/, /da/haandskrevne-opskrifter/) | Generell bildeavlesning, ikke nevnt spesifikt: `supabase/functions/import-recipe/index.ts:1318` («Analyser bildet og ekstraher oppskriften som JSON», samme linje på master og PR-grenen); `lib/sprak/tekster/nb.ts:1209` («Skann en oppskrift fra kokebok, blad eller skjerm»). Verken prompt eller UI nevner håndskrift |');
paastander.push('| Kokemodus holder skjermen våken | `hooks/useCookSession.ts:137`; `lib/keepAwake.ts` |');
paastander.push('| Planlegg uka og send ukas ingredienser til handlelista (nb-forsiden; «la handlelista skrive seg selv» på /ukemeny/) | `app/(tabs)/ukemeny.tsx:593-599` (knappen `handleAddWeekToGrocery`, `ukemeny.leggUkeIHandleliste`): ett trykk legger ukas ingredienser i handlelista. Handlelisten fylles ikke uten at brukeren trykker |');
paastander.push('| Fem gratis importer i måneden | `constants/limits.ts:5` (`FREE_IMPORT_LIMIT = 5`) |');
paastander.push("| Bildeimport krever Pro | `app/(tabs)/legg-til.tsx:879` (`kilde === 'bilde' && fotoGate === 'låst'`) |");
paastander.push('| Ingen reklame, ingen annonsenettverk | `package.json` har ingen annonse-SDK (bare RevenueCat, PostHog, Sentry og Expo) |');
paastander.push('| 5,0 i App Store (12 vurderinger, Norge, per 5. oktober 2026) | Ikke i koden: tallet er oppgitt av Patrick 2026-10-05 og bekreftet med iTunes-oppslag (id 6762563515, country=no: snitt 5, 12 vurderinger) 2026-10-05. Står på `sv/index.html`, `da/index.html` og i JSON-LD på `index.html` (`ratingCount` 12) |');
write('../qa/sv-da/produktpaastander.md', paastander.join('\n') + '\n');

write('../qa/sv-da/juridiske-kilder.md', [
  '# Juridiske kilder for sv/da', '',
  'Kontrollert 2026-10-05. Tekstene skal ikke leses som juridisk godkjenning; de viser hvilket faktisk grunnlag generatoren bruker. Kolonnen «Sidetekst» siterer generatoren.', '',
  '| Påstand | Sidetekst | Kilde | Lest |', '|---|---|---|---|',
  '| Identitet og geografisk adresse | «Patrick Omassa Kabia, Vollebekkveien 2J, 0598 Oslo, Norge» | `matlyst-landing-jus-da-sv/personvern.html` og `vilkar.html`, hei@matlyst-app.no | 2026-10-05 |',
  '| Ångerrätt og fortrydelsesret | villkor §5 / vilkaar §5 | `matlyst-plan1/docs/juridisk/kilder/forbruker.md`, avsnittene om App Store/Google Play og distanseavtaler | 2026-10-05 |',
  '| Gratis prøveperiode på én uke og oppsigelse senest 24 timer før utløp | SV/DA §5: årsabonnementet kan begynne med én gratis uke og går over til betalt årsabonnement hvis det ikke sies opp innen fristen | App Store Connect, abonnement 00002 i Sverige og Danmark, kontrollert av Claude 2026-10-05 | 2026-10-05 |',
  '| Forbruger Europa hjelper gratis med klager mot virksomheter i Norge | DA §8: «kan du få gratis hjælp hos Forbruger Europa, som også hjælper med klager mod virksomheder i Norge» | https://forbrugereuropa.dk/klag/ («Vi tilbyder gratis hjælp, når du som forbruger får problemer med en virksomhed i et andet europæisk land»; dekker EU, Island, Norge og Storbritannia) | 2026-10-05 |',
  '| Konsument Europa medler med virksomheter i Norge | SV §8: «kontakta Konsument Europa, som kan medla i tvister med företag i Norge» | https://www.konsumenteuropa.se/ («Medling med företag som har sitt säte i ett annat EU-land, Island eller Norge», kostnadsfritt) | 2026-10-05 |',
  '| Forbrukertilsynet mekler i Norge, ikke Forbrukerrådet | DA: «I Norge kan Forbrukertilsynet mægle»; SV: «I Norge kan Forbrukertilsynet medla» | https://www.forbrukerradet.no/her-klager-du/ (Forbrukertilsynet kan mekle; fører meklingen ikke fram, kan saken tas videre til Forbrukerklageutvalget) | 2026-10-05 |',
  '| Forbrukerklageutvalget behandler etter mekling saker om kjøp av varer, håndverkertjenester og angrerett | DA: «en sag om fortrydelsesret kan derefter indbringes for Forbrukerklageutvalget»; SV: «ett ärende om ångerrätt kan därefter prövas av Forbrukerklageutvalget» | https://www.forbrukertilsynet.no/forbrukerklageutvalget/ («saker som gjeld kjøp av varer, håndverkartenester og angrerett»; saken må ha vært meklet i Forbrukartilsynet) | 2026-10-05 |',
  '| Forbrukeren kan saksøke i eget land | SV §8: «Du kan också väcka talan vid domstol i Sverige.»; DA §8: «Du kan også anlægge sag ved en domstol i Danmark.» | Luganokonvensjonen 2007, som Norge er part i: forbrukeren kan saksøke i sin egen bostedsstat. https://lagen.nu/prop/2008/09:205 (prop. 2008/09:205 En ny Luganokonvention) | 2026-10-05 |',
  '| Overføringsgrunnlag per mottaker | integritet «Leverantörer och överföring» / privatliv «Leverandører og overførsel» | `personvern.html`, «Overføring ut av EØS»: EU uten overføring (Supabase, PostHog, Sentry), SCC (Anthropic, ikke DPF-sertifisert), DPF og subsidiært SCC (Apple, Google, Meta, RevenueCat, Resend, Expo, GitHub) | 2026-10-05 |',
  '| Helseopplysninger | «artikel 9.2 a» / «artikel 9, stk. 2, litra a» | `personvern.html`, «Formål og rettslig grunnlag» og «Matlogg og kalorimål» | 2026-10-05 |',
].join('\n') + '\n');

const kildeQa = ['# Lokale kildesider', '', 'Kontrollert 2026-10-05. Sidene beskriver import av offentlige URL-er og påstår ikke samarbeid.', '', '| Side | Offisiell kilde | Fem tilfeldige importer |', '|---|---|---|'];
for (const lang of ['sv','da']) for (const row of sourcePages[lang]) {
  kildeQa.push(`| /${lang}/${row[0]} | ${row[4]} | Ikke kjørt: krever testkonto og er en lanseringsport |`);
}
write('../qa/sv-da/lokale-kilder.md', kildeQa.join('\n') + '\n');

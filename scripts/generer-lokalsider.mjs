#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
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

const legal = {
  sv: {
    terms: {
      oppdatert:'Senast uppdaterad 13 oktober 2026',
      path:'villkor/', title:'Användarvillkor | Matlyst', h1:'Användarvillkor',
      intro:'Villkoren gäller när du använder Matlyst. Matlyst tillhandahålls av Patrick Omassa Kabia, Vollebekkveien 2J, 0598 Oslo, Norge. Kontakta oss på hei@matlyst-app.no om något är oklart.',
      sections:[
        ['1. Användning av tjänsten','Du ansvarar för att uppgifterna i kontot är riktiga och för aktiviteten på kontot. Matlyst får inte användas olagligt, för att göra intrång i andras rättigheter eller för att försöka kringgå säkerheten. Matlyst använder YouTube API Services. När du importerar från YouTube godkänner du att du är bunden av <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener">YouTubes användarvillkor</a>.'],
    ['2. Ålder, samtycke och AI','Vissa funktioner kräver åldersbekräftelse och ett separat samtycke innan innehåll skickas till en AI-leverantör. Du kan använda övriga delar av appen utan detta samtycke.'],
        ['3. Innehåll och rättigheter','Du behåller rättigheterna till recepten och annat innehåll du lägger in. Du ger Matlyst den begränsade rätt som behövs för att lagra, visa, bearbeta och säkerhetskopiera innehållet åt dig.'],
        ['4. Upphovsrätt och borttagning','Importera bara innehåll som du har rätt att använda. Rättighetshavare kan kontakta hei@matlyst-app.no. Vi kan stoppa import från en källa eller ta bort innehåll när det krävs.'],
        ['5. Abonnemang och betalning','Abonnemanget förnyas automatiskt tills du säger upp det. Årsabonnemanget kan börja med en gratis provperiod på en vecka. Provperioden övergår i ett betalt abonnemang om du inte säger upp det senast 24 timmar innan den tar slut. Du säger upp det i inställningarna för ditt Apple-konto eller i Google Play, och det gäller då till den betalda periodens slut. Du har 14 dagars ångerrätt enligt lagen om distansavtal och avtal utanför affärslokaler, räknat från den dag avtalet ingås. Ångerrätten kan upphöra när du uttryckligen begär att tjänsten ska börja levereras direkt och samtidigt godtar att du därmed förlorar ångerrätten. Köpet görs hos Apple eller Google, som hanterar betalning, ångerrätt och eventuell återbetalning enligt den lag som gäller för dig.'],
        ['6. Ansvar','Matlyst hjälper till med planering och matlagning men ersätter inte professionell rådgivning. Kontrollera allergener, hållbarhetstid och säker tillagning själv. Vi ansvarar inte för indirekt skada om inte tvingande lag föreskriver annat.'],
        ['7. Ändringar och avslut','Vi kan ändra tjänsten och villkoren. Väsentliga ändringar meddelas i god tid innan de börjar gälla, i appen eller via e-post. Om du inte godtar ändringarna kan du säga upp avtalet. Du kan sluta använda tjänsten och radera kontot när som helst.'],
        ['8. Lag och klagomål','Norsk lag gäller i den utsträckning tvingande svensk konsumenträtt inte ger dig ett starkare skydd. Kontakta oss först. Om vi inte kommer överens kan du kontakta Konsument Europa, som kan medla i tvister med företag i Norge. I Norge kan Forbrukertilsynet (norsk konsumentmyndighet) medla, och ett ärende om ångerrätt kan därefter prövas av Forbrukerklageutvalget (norsk nämnd för konsumenttvister). Du kan också väcka talan vid domstol i Sverige.'],
        ['9. Kontakt och kontaktpunkt','<p>Både användare och myndigheter kan kontakta oss på <a href="mailto:hei@matlyst-app.no">hei@matlyst-app.no</a>. Det är vår kontaktpunkt enligt rättsakten om digitala tjänster (DSA, artiklarna 11 och 12). Du kan skriva till oss på svenska, norska, danska eller engelska.</p><p id="ulovlig-innhold"><strong>Anmälan om olagligt innehåll.</strong> Om du anser att något i Matlyst är olagligt, till exempel ett recept, en bild, ett användarnamn eller ett svar från AI, mejlar du <a href="mailto:hei@matlyst-app.no">hei@matlyst-app.no</a>. Skriv var innehållet finns (länk, recept eller användarnamn), varför du anser att det är olagligt och hur vi når dig. Vi bekräftar att vi har tagit emot anmälan, bedömer den så snart vi kan och ger dig besked. Gäller det upphovsrätt, se punkt 4.</p>'],
      ],
    },
    privacy: {
      oppdatert:'Senast uppdaterad 13 oktober 2026',
      path:'integritet/', title:'Integritetspolicy | Matlyst', h1:'Integritetspolicy',
      intro:'Patrick Omassa Kabia är personuppgiftsansvarig för Matlyst och driver appen som privatperson i Norge. Kontakt: Vollebekkveien 2J, 0598 Oslo, Norge, hei@matlyst-app.no.',
      sections:[
        ['Tre löften','Vi säljer inte dina personuppgifter. Recept används inte för att träna allmänna AI-modeller. Analys på webbplatsen och i appen kräver samtycke.'],
        ['Uppgifter vi behandlar','Vi behandlar uppgifter om ditt konto och din inloggning, profil och inställningar, recept och bilder, Veckomeny, Inköpslista, Skafferi, feedback, tekniska loggar och de uppgifter du aktivt skickar till import eller Fråga Matlyst. Matlogg och kalorimål behandlas bara med ditt uttryckliga samtycke.'],
        ['Ändamål och rättslig grund','Avtal enligt GDPR artikel 6.1 b används för konto, inloggningsmejl, synkronisering, import, tackmejlet vid köp, appuppdateringar och funktionerna du begär. Berättigat intresse enligt artikel 6.1 f används för säkerhet, lösenordskontrollen och nödvändig felsökning, för välkomstmejlet och påminnelsen efter registreringen och för att hantera feedback du skickar. Samtycke enligt artikel 6.1 a används för analys, personliga dagliga middagsförslag från AI och pushnotiser. Matlogg och kalorimål behandlas bara med ditt uttryckliga samtycke enligt artikel 6.1 a och artikel 9.2 a. Rättslig förpliktelse enligt artikel 6.1 c används där lag kräver det.'],
        ['AI-behandling','När du har godkänt AI-funktionen skickas det innehåll som behövs för din begäran till Anthropic Ireland, Limited, som nämns i samtyckestexten. Äldre konton utan den nya bekräftelsen använder tills vidare Google (Gemini API) som huvudleverantör och Anthropic som reserv. Vi använder inte recept eller frågor för att träna allmänna modeller. Du kan återkalla samtycket när som helst i appens inställningar.'],
        ['Import från sociala medier','När du importerar från Instagram, TikTok eller YouTube hämtar vår server bildtext, miniatyrbild och vem som har lagt upp inlägget från plattformen. Instagramlänken skickas då till Meta, TikTok-länken till TikTok och id:t för videon eller spellistan till Google (YouTube Data API). Det är vår server som frågar, så vi skickar inte ditt konto-id, din e-postadress eller din IP-adress. Länkar från Instagram och TikTok skickas som du delade dem, och delningslänkar kan innehålla plattformens egna spårningskoder. Matlyst använder YouTube API Services. När du importerar från YouTube godkänner du <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener">YouTubes användarvillkor</a>. Se även <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Googles integritetspolicy</a>. Importerar du en hel spellista visar appen videornas miniatyrbilder direkt från YouTubes servrar (i.ytimg.com), och då får Google din IP-adress. Matlyst ber inte om åtkomst till ditt Google- eller YouTube-konto för importen. Vilka appar du har gett åtkomst kan du se och ta bort i <a href="https://security.google.com/settings/security/permissions" target="_blank" rel="noopener">Googles säkerhetsinställningar</a>.'],
        ['Pushnotiser och appuppdateringar','Om du tillåter notiser levereras de via Expo i USA, som skickar dem vidare via Apple på iOS och Google Firebase Cloud Messaging på Android. Förloppet för en import på låsskärmen (liveaktivitet) skickar vår server direkt till Apple. Expo och Apple eller Google får din push-token och texten i notisen, till exempel namnet på ett recept. Firebase används bara för att leverera notiser, inte för analys. Appen hämtar också uppdateringar från Expos servrar, och då får Expo din IP-adress, vilken appversion och plattform du använder och ett slumpmässigt id som hör till just den installationen.'],
        ['E-post från Matlyst','Vi skickar några olika sorters mejl från appen: mejl för inloggning (bekräftelse av kontot, länk för nytt lösenord och bekräftelse när du byter e-postadress), ett välkomstmejl när du har registrerat dig, ett tackmejl när du köper Matlyst Pro, en påminnelse 48 timmar efter registreringen om du ännu inte har sparat något recept och ett besked när feedback du har skickat har publicerats eller åtgärdats. Alla skickas via Resend i USA, som får din e-postadress, ditt förnamn om mejlet använder det och själva innehållet. Påminnelsen skickas bara en gång. Vill du inte ha den kan du invända genom att svara på ett mejl från oss eller skriva till hei@matlyst-app.no. Välkomstmejlet, tackmejlet och påminnelsen hämtar typsnitt från Google Fonts. Om ditt e-postprogram visar externt innehåll får Google din IP-adress när du öppnar mejlet.'],
        ['Lösenordskontroll','När du väljer ett lösenord kontrollerar vi om det finns med i kända dataläckor. Vår server beräknar en SHA-1-hash av lösenordet och skickar bara de fem första tecknen till tjänsten Pwned Passwords (Have I Been Pwned). Tjänsten svarar med de läckta hashvärden som börjar på samma sätt, och jämförelsen görs hos oss. Varken lösenordet, hela hashvärdet eller din e-postadress lämnar vår server.'],
        ['Webbplats och lokal lagring','Webbplatsen använder nödvändig lokal lagring för språkval och ditt samtyckesval i matlyst-sprak och matlyst-consent. PostHog och Google Analytics laddas först efter ett aktivt samtycke. Du kan återkalla analyssamtycket via länken Ändra samtycke längst ned på sidan. På den norska webbplatsen används EmailOctopus för nyhetsbrev, och Google reCAPTCHA laddas först när du fyller i nyhetsbrevsformuläret.'],
        ['Leverantörer och överföring','Supabase, PostHog och Sentry lagrar uppgifterna inom EU (ingen överföring). Apple (inloggning, köp och notiser på iOS), Google (inloggning, köp, notiser på Android, Gemini, Google Analytics, reCAPTCHA och typsnitt i våra mejl), Meta, RevenueCat, Resend (mejl) och Expo (notiser och appuppdateringar): EU–US Data Privacy Framework, i andra hand standardavtalsklausuler. EmailOctopus: Storbritanniens adekvansbeslut. Anthropic: standardavtalsklausuler (inte certifierat enligt Data Privacy Framework).'],
        ['Lagring och radering','Konto och innehåll lagras tills du raderar kontot. Tekniska felsökningsloggar raderas efter 90 dagar och Sentry-rapporter efter 30 dagar. Push-token raderas vid utloggning eller kontoradering. Feedback sparas så länge kontot finns eller tills du ber oss radera den. Statistik i PostHog samlas bara in medan ditt samtycke gäller; redan insamlad statistik raderas när du raderar kontot eller ber oss om det. Din e-postadress hos EmailOctopus sparas tills du avregistrerar dig från nyhetsbrevet eller raderar kontot. Om du återkallar samtycket till matloggen raderas matloggen och kalorimålet nollställs. Samtycke till analys kan återkallas när som helst.'],
        ['Dina rättigheter','Du har rätt att begära tillgång till, rättelse och radering av dina uppgifter, begränsning av behandlingen och dataportabilitet. Du har också rätt att invända mot viss behandling och att återkalla ett samtycke. Kontakta hei@matlyst-app.no. Eftersom Matlyst är etablerat i Norge är Datatilsynet i Norge (datatilsynet.no) ledande tillsynsmyndighet. Du kan klaga hos Datatilsynet i Norge eller hos din lokala tillsynsmyndighet, Integritetsskyddsmyndigheten (imy.se).'],
        ['Ålder och samtycke','I Sverige är åldersgränsen 13 år för att själv samtycka till de digitala funktioner som kräver samtycke. För detta lagrar vi land, bekräftad åldersgräns och tidpunkt – inte födelsedatum.'],
      ],
    },
    delete: {
      oppdatert:'Senast uppdaterad 5 oktober 2026',
      path:'radera-konto/', title:'Radera konto | Matlyst', h1:'Radera ditt konto',
      intro:'Du kan radera Matlyst-kontot och innehållet permanent. Ett abonnemang måste sägas upp separat i App Store eller Google Play.',
      sections:[
        ['Radera i appen','Öppna Matlyst, gå till Inställningar och välj Radera konto. Bekräfta åtgärden. Kontot och innehållet raderas och du loggas ut.'],
        ['Om du inte kan logga in','Mejla hei@matlyst-app.no från adressen som hör till kontot. Vi kontrollerar din identitet och behandlar din begäran inom 30 dagar.'],
        ['Det som raderas','Konto, profil, recept, mappar, bilder, anteckningar, Veckomeny, Inköpslista, Skafferi, hushållsmedlemskap, feedback och push-token raderas. Krypterade säkerhetskopior rensas automatiskt inom 30 dagar.'],
      ],
    },
  },
  da: {
    terms: {
      oppdatert:'Senest opdateret 13. oktober 2026',
      path:'vilkaar/', title:'Brugervilkår | Matlyst', h1:'Brugervilkår',
      intro:'Vilkårene gælder, når du bruger Matlyst. Matlyst udbydes af Patrick Omassa Kabia, Vollebekkveien 2J, 0598 Oslo, Norge. Skriv til hei@matlyst-app.no, hvis noget er uklart.',
      sections:[
        ['1. Brug af tjenesten','Du er ansvarlig for, at oplysningerne på kontoen er korrekte, og for aktiviteten på kontoen. Matlyst må ikke bruges ulovligt, til at krænke andres rettigheder eller til at omgå sikkerheden. Matlyst bruger YouTube API Services. Når du importerer fra YouTube, accepterer du at være bundet af <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener">YouTubes servicevilkår</a>.'],
        ['2. Alder, samtykke og AI','Nogle funktioner kræver aldersbekræftelse og et særskilt samtykke, før indhold sendes til en AI-leverandør. Du kan bruge resten af appen uden dette samtykke.'],
        ['3. Indhold og rettigheder','Du beholder rettighederne til opskrifter og andet indhold, du lægger ind. Du giver Matlyst den begrænsede ret, der er nødvendig for at lagre, vise, behandle og sikkerhedskopiere indholdet for dig.'],
        ['4. Ophavsret og fjernelse','Importér kun indhold, du har ret til at bruge. Rettighedshavere kan kontakte hei@matlyst-app.no. Vi kan stoppe import fra en kilde eller fjerne indhold, når det er nødvendigt.'],
        ['5. Abonnement og betaling','Abonnementet fornyes automatisk, indtil du opsiger det. Årsabonnementet kan begynde med en gratis prøveperiode på 1 uge. Prøveperioden fortsætter som et betalt årsabonnement, hvis du ikke opsiger senest 24 timer før prøveperiodens udløb. Du opsiger det i indstillingerne for din Apple-konto eller i Google Play, og abonnementet løber så til udgangen af den betalte periode. Du har 14 dages fortrydelsesret efter forbrugeraftaleloven, regnet fra den dag, aftalen indgås. Fortrydelsesretten kan bortfalde, når du udtrykkeligt beder om, at leveringen starter straks, og samtidig anerkender, at du dermed mister fortrydelsesretten. Købet sker hos Apple eller Google, som håndterer betaling, fortrydelse og eventuel refusion efter den lov, der gælder for dig.'],
        ['6. Ansvar','Matlyst hjælper med planlægning og madlavning, men erstatter ikke professionel rådgivning. Kontrollér selv allergener, holdbarhed og sikker tilberedning. Vi hæfter ikke for indirekte tab, medmindre ufravigelig lovgivning bestemmer andet.'],
        ['7. Ændringer og ophør','Vi kan ændre tjenesten og vilkårene. Væsentlige ændringer meddeles i appen eller pr. e-mail i god tid, før de træder i kraft. Hvis du ikke accepterer ændringerne, kan du opsige aftalen. Du kan stoppe med at bruge tjenesten og slette kontoen når som helst.'],
        ['8. Lovvalg og klage','Norsk ret gælder, i det omfang ufravigelig dansk forbrugerret ikke giver dig bedre beskyttelse. Kontakt os først. Hvis vi ikke finder en løsning, kan du få gratis hjælp hos Forbruger Europa, som også hjælper med klager mod virksomheder i Norge. I Norge kan Forbrukertilsynet (norsk forbrugermyndighed) mægle, og en sag om fortrydelsesret kan derefter indbringes for Forbrukerklageutvalget (norsk klagenævn for forbrugersager). Du kan også anlægge sag ved en domstol i Danmark.'],
        ['9. Kontakt og kontaktpunkt','<p>Både brugere og myndigheder kan kontakte os på <a href="mailto:hei@matlyst-app.no">hei@matlyst-app.no</a>. Det er vores kontaktpunkt efter forordningen om digitale tjenester (DSA, artikel 11 og 12). Du kan skrive til os på dansk, norsk, svensk eller engelsk.</p><p id="ulovlig-innhold"><strong>Anmeldelse af ulovligt indhold.</strong> Mener du, at noget i Matlyst er ulovligt, fx en opskrift, et billede, et brugernavn eller et svar fra AI, så skriv til <a href="mailto:hei@matlyst-app.no">hei@matlyst-app.no</a>. Fortæl, hvor indholdet ligger (link, opskrift eller brugernavn), hvorfor du mener, det er ulovligt, og hvordan vi kan kontakte dig. Vi bekræfter, at vi har modtaget din anmeldelse, vurderer den så hurtigt som muligt og giver dig besked. Gælder det ophavsret, så se punkt 4.</p>'],
      ],
    },
    privacy: {
      oppdatert:'Senest opdateret 13. oktober 2026',
      path:'privatliv/', title:'Privatlivspolitik | Matlyst', h1:'Privatlivspolitik',
      intro:'Patrick Omassa Kabia er dataansvarlig for Matlyst og driver appen som privatperson i Norge. Kontakt: Vollebekkveien 2J, 0598 Oslo, Norge, hei@matlyst-app.no.',
      sections:[
        ['Tre løfter','Vi sælger ikke dine personoplysninger. Opskrifter bruges ikke til at træne generelle AI-modeller. Analyse på hjemmesiden og i appen kræver samtykke.'],
        ['Oplysninger, vi behandler','Vi behandler oplysninger om din konto og dit login, din profil og dine indstillinger, opskrifter og billeder, Madplan, Indkøbsliste, Spisekammer, feedback, tekniske logge og de oplysninger, du aktivt sender til import eller Spørg Matlyst. Madlog og kaloriemål behandles kun med udtrykkeligt samtykke efter GDPR artikel 9, stk. 2, litra a.'],
        ['Formål og retsgrundlag','Aftale efter GDPR artikel 6, stk. 1, litra b bruges til konto, login-mails, synkronisering, import, takkemailen ved køb, appopdateringer og de funktioner, du beder om. Legitim interesse efter artikel 6, stk. 1, litra f bruges til sikkerhed, adgangskodetjekket og nødvendig fejlfinding, til velkomstmailen og påmindelsen efter oprettelsen og til at håndtere feedback, du sender. Samtykke efter artikel 6, stk. 1, litra a bruges til analyse, personlige daglige middagsforslag fra AI og push-notifikationer. Madlog og kaloriemål behandles kun med dit udtrykkelige samtykke efter artikel 6, stk. 1, litra a, og artikel 9, stk. 2, litra a. Retlig forpligtelse efter artikel 6, stk. 1, litra c bruges, hvor loven kræver det.'],
        ['AI-behandling','Når du har godkendt AI-funktionen, sendes det indhold, der er nødvendigt for din anmodning, til Anthropic Ireland, Limited, der er nævnt i samtykketeksten. Ældre konti uden den nye bekræftelse bruger indtil videre Google (Gemini API) som primær leverandør og Anthropic som reserve. Vi bruger ikke opskrifter eller spørgsmål til at træne generelle modeller. Du kan trække samtykket tilbage i appens indstillinger.'],
        ['Import fra sociale medier','Når du importerer fra Instagram, TikTok eller YouTube, henter vores server billedtekst, miniaturebillede og navnet på den, der har lagt indholdet op, fra platformen. Instagram-linket sendes derfor til Meta, TikTok-linket til TikTok og id’et på videoen eller playlisten til Google (YouTube Data API). Det er vores server, der spørger, så vi sender ikke dit konto-id, din e-mailadresse eller din IP-adresse. Links fra Instagram og TikTok sendes, som du delte dem, og delingslinks kan indeholde platformens egne sporingskoder. Matlyst bruger YouTube API Services. Når du importerer fra YouTube, accepterer du <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener">YouTubes servicevilkår</a>. Se også <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Googles privatlivspolitik</a>. Importerer du en hel playliste, viser appen videoernes miniaturebilleder direkte fra YouTubes servere (i.ytimg.com), og dermed får Google din IP-adresse. Matlyst beder ikke om adgang til din Google- eller YouTube-konto for at importere. De adgange, du har givet apps, kan du se og tilbagekalde i <a href="https://security.google.com/settings/security/permissions" target="_blank" rel="noopener">Googles sikkerhedsindstillinger</a>.'],
        ['Push-notifikationer og appopdateringer','Tillader du notifikationer, leveres de via Expo i USA, som sender dem videre via Apple på iOS og Google Firebase Cloud Messaging på Android. Fremskridtet for en import på låseskærmen (liveaktivitet) sender vores server direkte til Apple. Expo og Apple eller Google får dit push-token og teksten i notifikationen, fx navnet på en opskrift. Firebase bruges kun til at levere notifikationer, ikke til analyse. Appen henter også opdateringer fra Expos servere, og så får Expo din IP-adresse, oplysninger om, hvilken appversion og platform du bruger, og et tilfældigt id, der er knyttet til netop denne installation.'],
        ['E-mails fra Matlyst','Vi sender nogle få typer e-mails fra appen: e-mails til login (bekræftelse af kontoen, link til ny adgangskode og bekræftelse, når du skifter e-mailadresse), en velkomstmail, når du har oprettet en konto, en takkemail, når du køber Matlyst Pro, én påmindelse 48 timer senere, hvis du endnu ikke har gemt en opskrift, og en besked, når feedback, du har sendt, er blevet offentliggjort eller rettet. Alle sendes via Resend i USA, som får din e-mailadresse, dit fornavn, hvis mailen bruger det, og selve indholdet. Påmindelsen sendes kun én gang. Vil du ikke have den, kan du gøre indsigelse ved at svare på en mail fra os eller skrive til hei@matlyst-app.no. Velkomstmailen, takkemailen og påmindelsen henter skrifttyper fra Google Fonts. Viser dit mailprogram eksternt indhold, får Google din IP-adresse, når du åbner mailen.'],
        ['Tjek af adgangskode','Når du vælger en adgangskode, tjekker vi, om den findes i kendte datalæk. Vores server beregner en SHA-1-hash af adgangskoden og sender kun de første fem tegn til tjenesten Pwned Passwords (Have I Been Pwned). Tjenesten svarer med de lækkede hashværdier, der begynder på samme måde, og sammenligningen sker hos os. Hverken adgangskoden, hele hashværdien eller din e-mailadresse forlader vores server.'],
        ['Hjemmesiden og lokal lagring','Hjemmesiden bruger nødvendig lokal lagring til sprogvalg og dit samtykkevalg i matlyst-sprak og matlyst-consent. PostHog og Google Analytics indlæses først efter et aktivt samtykke. Du kan trække analysesamtykket tilbage via «Skift samtykke» nederst på siden. På den norske hjemmeside bruges EmailOctopus til nyhedsbreve, og Google reCAPTCHA indlæses først, når du udfylder nyhedsbrevsformularen.'],
        ['Leverandører og overførsel','Supabase, PostHog og Sentry lagrer oplysningerne i EU (ingen overførsel). Apple og Google bruges til login, køb og notifikationer. Overførsel til Apple, Google (herunder Gemini, Firebase Cloud Messaging og skrifttyper i vores mails), Meta, RevenueCat, Resend (e-mails) og Expo (notifikationer og appopdateringer) i USA sker på grundlag af EU-US Data Privacy Framework og ellers standardkontraktbestemmelser. Anthropic er ikke certificeret, og overførslen dertil sker på grundlag af standardkontraktbestemmelser. EmailOctopus er omfattet af Storbritanniens tilstrækkelighedsafgørelse.'],
        ['Opbevaring og sletning','Konto og indhold opbevares, til du sletter kontoen. Tekniske fejlfindingslogge slettes efter 90 dage og Sentry-rapporter efter 30 dage. Push-token slettes ved logout eller kontosletning. Feedback gemmes, så længe kontoen findes, eller til du beder os slette den. Statistik hos PostHog indsamles kun, mens dit samtykke gælder; allerede indsamlet statistik slettes, når du sletter kontoen, eller hvis du beder os om det. Din e-mailadresse hos EmailOctopus gemmes, til du afmelder nyhedsbrevet eller sletter kontoen. Trækker du samtykket til madloggen tilbage, slettes madloggen, og kaloriemålet nulstilles. Samtykke til analyse kan trækkes tilbage når som helst.'],
        ['Dine rettigheder','Du har ret til at bede om indsigt i, rettelse og sletning af dine oplysninger, begrænsning af behandlingen og dataportabilitet. Du har også ret til at gøre indsigelse mod visse behandlinger og trække et samtykke tilbage. Skriv til hei@matlyst-app.no. Da Matlyst er etableret i Norge, er Datatilsynet i Norge (datatilsynet.no) ledende tilsynsmyndighed. Du kan klage til Datatilsynet i Norge eller til din lokale tilsynsmyndighed, Datatilsynet i Danmark (datatilsynet.dk).'],
        ['Alder og samtykke','I Danmark skal du være mindst 15 år for selv at give samtykke til de funktioner i Matlyst, der kræver samtykke. Vi gemmer det land, du har valgt, din bekræftelse af aldersgrænsen og tidspunktet, men ikke din fødselsdato.'],
      ],
    },
    delete: {
      oppdatert:'Senest opdateret 5. oktober 2026',
      path:'slet-konto/', title:'Slet konto | Matlyst', h1:'Slet din konto',
      intro:'Du kan slette Matlyst-kontoen og indholdet permanent. Et abonnement skal opsiges særskilt i App Store eller Google Play.',
      sections:[
        ['Slet i appen','Åbn Matlyst, gå til Indstillinger, og vælg Slet konto. Bekræft handlingen. Kontoen og indholdet slettes, og du logges ud.'],
        ['Hvis du ikke kan logge ind','Skriv til hei@matlyst-app.no fra den adresse, der hører til kontoen. Vi kontrollerer din identitet og behandler din anmodning inden 30 dage.'],
        ['Det, der slettes','Konto, profil, opskrifter, mapper, billeder, noter, Madplan, Indkøbsliste, Spisekammer, husstandsmedlemskab, feedback og push-token slettes. Krypterede sikkerhedskopier slettes automatisk senest 30 dage efter sletningen.'],
      ],
    },
  },
};

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
    .replace('</head>', '<link rel="stylesheet" href="/avmeld.css">\n</head>');
  return `${sideHode}<body data-locale="${lang}">${nav(lang,path)}<main id="hovedinnhold" class="avmeld-doc">
<section id="bekreft" hidden><p class="avmeld-kicker">${tekst.kicker}</p><h1 class="avmeld-title">${tekst.tittel}</h1><p class="avmeld-intro">${tekst.intro}</p><div class="avmeld-kort"><button class="avmeld-knapp" id="meldAv" type="button">${tekst.knapp}</button><p class="avmeld-status" id="status" data-venter="${tekst.venter}" role="status" aria-live="polite"></p></div></section>
<section id="ferdig" hidden><p class="avmeld-kicker">${tekst.kicker}</p><h1 class="avmeld-title">${tekst.ferdigTittel}</h1><p class="avmeld-intro">${tekst.ferdig}</p><p class="avmeld-intro">${tekst.angre}</p></section>
<section id="mangler" hidden><p class="avmeld-kicker">${tekst.kicker}</p><h1 class="avmeld-title">${tekst.manglerTittel}</h1><p class="avmeld-intro">${tekst.mangler} ${kontakt}.</p></section>
<noscript><p class="avmeld-kicker">${tekst.kicker}</p><h1 class="avmeld-title">${tekst.tittel}</h1><p class="avmeld-intro">${tekst.utenJs}</p><form class="avmeld-kort" method="POST" id="reserve" action="https://uaryzmqvoqljjwqvgzoi.supabase.co/functions/v1/avmeld"><input type="hidden" name="List-Unsubscribe" value="One-Click"><button class="avmeld-knapp" type="submit">${tekst.knapp}</button></form></noscript>
<template id="feilmelding">${tekst.feil} ${kontakt}.</template>
</main>${footer(lang)}<script src="/avmeld.js" defer></script><script src="/site.js" defer></script></body></html>`;
}

// Engelsk (internasjonalt). Juridiske sider bygger på matlyst-kontroll/specs/2026-10-11-juss-global-utkast.md
// og er UTKAST til juristen har lest dem (Patrick: «We review the legal stuff in the end»).
const UTKAST_EN = 'UTKAST: venter på endelig juridisk gjennomgang før publisering. Grunnlag: matlyst-kontroll/specs/2026-10-11-juss-global-utkast.md. Åpne [JURIST]- og [VERIFISER]-punkter står i PR-teksten.';
const liste = (punkter) => `<ul>${punkter.map((p) => `<li>${p}</li>`).join('')}</ul>`;
const avsnitt = (...ps) => ps.map((p) => `<p>${p}</p>`).join('');

legal.en = {
  terms: {
    utkast: UTKAST_EN,
    oppdatert: 'Last updated 13 October 2026',
    path: 'terms/', title: 'Terms of Use | Matlyst', h1: 'Terms of Use',
    intro: 'By using Matlyst you agree to these terms. Matlyst is provided by Patrick Omassa Kabia, Vollebekkveien 2J, 0598 Oslo, Norway. If anything here is unclear, email hei@matlyst-app.no.',
    sections: [
      ['1. Using Matlyst', 'Matlyst is a meal-planning service for personal, non-commercial use. You are responsible for the content you import and store, including your right to import it, and for not breaching the terms of the site or service it comes from. You agree not to use Matlyst unlawfully. Matlyst uses YouTube API Services. By importing from YouTube, you agree to be bound by the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener">YouTube Terms of Service</a>.'],
      ['2. Age, consent and AI', avsnitt(
        'Matlyst has no general age limit. Some features (analytics, the food log and AI sharing) require you to confirm the minimum age for the country you live in, as described in the <a href="/en/privacy/">Privacy Policy</a>. Confirming your age does not give you the right to enter into every agreement or buy a subscription without permission from a parent or guardian where that is needed.',
        'Matlyst uses AI to read, categorise and translate recipes and to answer questions. When you import from a photo, the image may be processed by AI to read the recipe, so please don’t send private information the recipe doesn’t need. AI output can be wrong. Always check allergens, food safety and instructions yourself.',
        'The food log and calorie goal are optional. Besides the age confirmation, they need your separate, explicit consent to the processing of health data (GDPR Art. 9(2)(a)). You can withdraw that consent in Settings: your food log is then deleted and your calorie goal reset. You can also withdraw consent to analytics and keep using the rest of the app.')],
      ['3. Intellectual property', 'Recipes and photos you import may be protected by copyright and belong to others. Matlyst fetches such content only for your private, personal use and keeps it in a private collection that is not made public. You get no right to republish or commercially exploit imported content. You may use recipes and dinner suggestions generated by AI freely for personal purposes.'],
      ['4. Copyright and takedown', 'If you hold rights to content fetched through Matlyst and believe it infringes your copyright, email hei@matlyst-app.no with the work and where it was taken from, the basis for your rights or authority, and your contact details. For valid requests, we remove access and block imports from the source as quickly as practical. We may block sources permanently and suspend users who repeatedly breach these terms.'],
      ['5. Subscription and payment', avsnitt(
        'Matlyst Pro is billed monthly or yearly and renews automatically until you cancel. The yearly plan may start with a free one-week trial, which becomes a paid yearly plan unless you cancel at least 24 hours before it ends. You cancel in your Apple account settings or in Google Play, and Pro keeps working until the end of the period you have paid for. Purchases are made through Apple or Google, which handle payment, cancellation and any refund under the law that applies to you.',
        'In the EEA, the UK and Switzerland, you have a 14-day right of withdrawal from the day the agreement is made. You can lose it if you expressly ask for the service to start immediately and acknowledge that you lose the right.')],
      ['6. Disclaimer and limitation of liability', 'Recipes and nutritional information are imported from third parties or generated by AI and are for guidance only. Matlyst does not guarantee the accuracy of nutrition calculations, ingredient lists or allergen information. If you have food allergies or special dietary needs, always check the information against reliable sources. Best-before dates in the pantry are estimates, not guarantees. Nothing in these terms limits liability that cannot be limited by law.'],
      ['7. Changes to the service', 'We may change, limit or discontinue features. We give reasonable notice of material changes in the app or by email.'],
      ['8. Governing law and disputes', 'These terms are governed by Norwegian law. This does not take away the mandatory consumer protection of the country where you live. We always try to resolve a dispute with you directly first. If that fails, disputes may be brought before Oslo District Court, but as a consumer you can always take a case to the courts where you live.'],
      ['9. Contact and point of contact', '<p>Users and authorities can contact us at <a href="mailto:hei@matlyst-app.no">hei@matlyst-app.no</a>. This is our single point of contact under the EU Digital Services Act (DSA, Articles 11 and 12). You can write to us in English, Norwegian, Swedish or Danish.</p><p id="ulovlig-innhold"><strong>Reporting illegal content.</strong> If you believe something in Matlyst is illegal, such as a recipe, an image, a username or an AI answer, email <a href="mailto:hei@matlyst-app.no">hei@matlyst-app.no</a>. Tell us where it is (a link, the recipe or the username), why you believe it is illegal and how we can reach you. We will confirm that we have received your report, assess it as quickly as we can and let you know our decision. For copyright, see section 4.</p>'],
    ],
  },
  privacy: {
    utkast: UTKAST_EN,
    oppdatert: 'Last updated 13 October 2026',
    path: 'privacy/', title: 'Privacy Policy | Matlyst', h1: 'Privacy Policy',
    intro: 'Matlyst is a food app for importing, organising and cooking recipes. We collect only the data the app needs to work, and we never sell it. This policy explains what we collect, why, who we share it with and what rights you have. It covers the Matlyst app and the website matlyst-app.no.',
    sections: [
      ['In short: three promises', liste([
        '<strong>Usage analytics stay off until you say yes.</strong> No usage statistics are sent before you agree in the app, and you can withdraw at any time. We do send crash reports to keep the app stable. They never include your name, email or recipes.',
        '<strong>You never pay for privacy.</strong> The free version and Matlyst Pro have exactly the same privacy. Pro gives you features, not privacy.',
        '<strong>No ads, no data sales.</strong> Matlyst shows no advertising, has no ad networks in the app and never sells your personal data.',
      ])],
      ['1. Who is responsible', 'Matlyst is run by a private individual in Norway. The controller of your personal data is Patrick Omassa Kabia, Vollebekkveien 2J, 0598 Oslo, Norway. Contact: hei@matlyst-app.no.'],
      ['2. What we process', avsnitt(
        '<strong>Account.</strong> Your email and password if you sign up with email. Your Apple ID if you use Sign in with Apple; Apple shares your name and email and lets you hide your email. Your Google account if you use Sign in with Google; Google shares your name and email. The first time you open the app, it creates an anonymous account automatically, so your content is stored safely from the start. You can link it to an email address, Apple ID or Google account later.',
        '<strong>Profile and visibility.</strong> Name, username and profile photo, all optional. Your goals and measurement units, also optional. Your name, username and photo are visible to other signed-in users who search for you, follow you or share a household with you. You can remove them at any time.',
        '<strong>Consent records.</strong> For analytics, the food log and AI sharing, we store your country of residence, the minimum age you confirmed and the time of each consent. We do not store your date of birth or year of birth.',
        '<strong>Your content.</strong> Recipes you import or create, folders, favourites, ratings, notes, meal plans, shopping lists, your pantry, and the household you plan with.',
        '<strong>Food log and calorie goal (optional, health data).</strong> If you turn on the food log, we process meals, calories, nutrients and your calorie goal. This requires separate, explicit consent and confirmation of the minimum age for your country. You can withdraw consent in Settings. Your food log is then deleted and the calorie goal is reset.',
        '<strong>Imports.</strong> When you import a recipe, the link, image, text or file you choose is sent to our server to extract and translate the recipe. When you import from Instagram, TikTok or YouTube, our server asks the platform for the caption, the thumbnail and who posted it. The Instagram link goes to Meta, the TikTok link to TikTok, and the ID of the YouTube video or playlist to Google (YouTube Data API). Our server makes the request, so we don’t send your account ID, email address or IP address. Instagram and TikTok links are sent as you shared them, and share links can contain the platform’s own tracking codes. Matlyst uses YouTube API Services. By importing from YouTube, you agree to the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener">YouTube Terms of Service</a>. See also the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Google Privacy Policy</a>. When you import a whole playlist, the app shows the video thumbnails straight from YouTube’s servers (i.ytimg.com), so Google receives your IP address. Matlyst doesn’t ask for access to your Google or YouTube account to import. You can see and revoke the access you’ve given apps in <a href="https://security.google.com/settings/security/permissions" target="_blank" rel="noopener">Google’s security settings</a>.',
        '<strong>Technical data.</strong>',
      ) + liste([
        'A troubleshooting log in our own database, tied to your account ID. It is deleted automatically after 90 days.',
        'Crash reports (Sentry), without your name, email or user ID.',
        'A push token if you allow notifications. Notifications are delivered through Expo, which passes them on via Apple on iOS and Google Firebase Cloud Messaging on Android. Progress for an import on your Lock Screen (Live Activity) is sent by our server directly to Apple. Expo and Apple or Google receive the push token and the text of the notification, such as the name of a recipe. Firebase is used only to deliver notifications, not for analytics.',
        'App updates. The app downloads updates from Expo’s servers, so Expo sees your IP address, which app version and platform you use, and a random ID that stays the same for your installation.',
        'App version and device information.',
        'Usage statistics (PostHog), only with your consent. They are pseudonymous, not anonymous: they are linked to your randomly generated account ID.',
      ]) + avsnitt(
        '<strong>Emails.</strong> We send a few kinds of email from the app: sign-in emails, such as confirming your account, a link to reset your password and confirming a change of email address; a welcome when you sign up; a thank-you when you buy Matlyst Pro; one reminder 48 hours after sign-up if you haven’t saved a recipe yet; and a note when feedback you sent has been published or fixed. All of them go out through Resend (USA), which receives your email address, your first name where the email uses it, and the content of the email. The reminder is sent only once. If you don’t want it, you can object by replying to any email from us or writing to hei@matlyst-app.no. The welcome, thank-you and reminder emails load fonts from Google Fonts, so if your email app shows external content, Google receives your IP address when you open the email.',
        '<strong>Password check.</strong> When you choose a password, we check whether it has turned up in known data breaches. Our server makes a SHA-1 hash of the password and sends only the first five characters to the Pwned Passwords service (Have I Been Pwned). The service replies with the leaked hashes that start the same way, and we do the comparison ourselves. Your password, the full hash and your email address never leave our server.',
        '<strong>Feedback.</strong> When you send feedback in the app, we store your text, category, status and limited technical context. You decide whether to attach a screenshot. Published feedback is shown without your name, email, screenshot or technical context.',
        '<strong>Clipboard.</strong> Only if you turn it on, the app looks for a link on your clipboard to suggest an import. This happens on your device, the app reads nothing but web addresses, and nothing is sent until you choose to import.',
        '<strong>Pantry and best-before dates.</strong> When you tick items off your shopping list, they can be added to your pantry with an estimated best-before date based on the type of food. The estimate is a guide, not a guarantee, and you can change or delete pantry items at any time.')],
      ['3. Why we process it', avsnitt('We rely on these legal bases under the GDPR:') + liste([
        '<strong>Contract (Art. 6(1)(b)):</strong> import, storage, planning, sync and the Pro subscription; showing your profile to other users if you fill it in; sign-in emails, the thank-you for your purchase and app updates.',
        '<strong>Legitimate interest (Art. 6(1)(f)):</strong> keeping the service stable and secure with the troubleshooting log, crash reports and the password check; the welcome email and the one reminder after sign-up; and handling feedback you send.',
        '<strong>Consent (Art. 6(1)(a)):</strong> usage analytics in the app and on the website, personalised daily dinner suggestions and push notifications.',
        '<strong>Explicit consent (Art. 6(1)(a) and Art. 9(2)(a)):</strong> the food log and calorie goal.',
      ])],
      ['4. Artificial intelligence', avsnitt(
        'Matlyst uses AI to read, categorise and translate recipes, to answer questions in Ask Matlyst and to suggest dinners. Content you choose to send to an AI feature (text, images, files, questions) is processed by Anthropic Ireland, Limited. Older accounts that have not yet confirmed the current AI notice still use Google (Gemini API) as the main provider, with Anthropic as a fallback, until they confirm.') + liste([
        'Whenever you use Ask Matlyst, you are talking to an AI, not a person. AI-generated content is labelled in the app.',
        'We use the providers through paid APIs. They use your content only to answer you, may keep it for a limited period to detect abuse, and do not use it to train AI models.',
        'Please don’t send private information the recipe doesn’t need.',
        'Before you allow AI sharing, you confirm the minimum age for your country (see section 12). You can use the rest of the app without it.',
        'AI answers can be wrong. Always check allergens, food safety and instructions involving heat or sharp tools yourself. Younger users should ask a responsible adult for help with these.',
      ])],
      ['5. Who we share data with', avsnitt('We never sell your data. We use these providers:') + liste([
        '<strong>Supabase:</strong> database, sign-in and file storage (EU/EEA).',
        '<strong>Anthropic Ireland, Limited:</strong> AI processing (Ireland and USA).',
        '<strong>Google (Gemini API):</strong> AI processing for older accounts (USA).',
        '<strong>Apple:</strong> Sign in with Apple, the App Store, purchases and iOS notifications (USA).',
        '<strong>Google:</strong> Sign in with Google, Google Play, purchases, Android notifications (Firebase Cloud Messaging), YouTube import lookups, fonts in our emails (Google Fonts) and website analytics with your consent (USA).',
        '<strong>RevenueCat:</strong> subscription management (USA).',
        '<strong>Expo:</strong> delivery of push notifications and app updates (USA).',
        '<strong>Resend:</strong> the emails we send from the app, such as sign-in and welcome emails (USA).',
        '<strong>Sentry:</strong> crash reports (EU, Frankfurt).',
        '<strong>PostHog:</strong> product analytics with your consent (EU).',
        '<strong>EmailOctopus:</strong> newsletter (UK).',
        '<strong>Google (reCAPTCHA):</strong> bot check on the newsletter sign-up form. It loads only when you start filling in the email field, and Google then receives your IP address (USA).',
        '<strong>Meta:</strong> Instagram import lookups (USA).',
        '<strong>Have I Been Pwned (Pwned Passwords):</strong> password breach check, using only the start of a hash.',
      ])],
      ['6. International transfers', liste([
        '<strong>No transfer:</strong> Supabase, PostHog and Sentry (EU).',
        '<strong>United Kingdom:</strong> EmailOctopus, under the EU adequacy decision for the UK.',
        '<strong>United States, Standard Contractual Clauses (Art. 46):</strong> Anthropic.',
        '<strong>United States, EU-US Data Privacy Framework, with Standard Contractual Clauses where it does not apply:</strong> Apple, Google, Meta, RevenueCat, Resend and Expo.',
      ])],
      ['7. Storage on your device', 'To work offline, the app keeps a local copy of your recipes, ingredients and recipe photos, as well as your sign-in session and settings. Everything stays in the app’s protected storage and is deleted when you sign out.'],
      ['8. The website', 'The website uses essential local storage to remember your language and your consent choice (matlyst-sprak and matlyst-consent). PostHog and Google Analytics load only after you actively consent. You can withdraw that consent with the Change consent link at the bottom of every page. The Norwegian site uses EmailOctopus for its newsletter, and Google reCAPTCHA loads only when you fill in the newsletter form. Our fonts are served from our own server, so no third party receives your IP address when a page loads.'],
      ['9. Opt-out requests from rights holders', avsnitt(
        'If you are a food creator, blogger or photographer, you can ask us to block imports of your content. Email hei@matlyst-app.no with the handle or domain you want blocked.',
        'We store the handle or domain, the time of the request and the email address it came from, but not your IP address. We need the handle or domain for the block to work, and we keep the email address as a record of who asked for it, so we can reply and show why the block exists. Our legal basis is legitimate interest (Art. 6(1)(f)) in being able to honour and document requests from rights holders. If you’d rather we didn’t keep your email address, say so and we’ll keep only the handle or domain and the time.',
        'We keep the record for as long as the block stands. If you ask us to lift it, we delete the whole record, including your email address. A block applies from the moment it is in place and does not remove recipes already imported. If you find content of yours that is already in Matlyst, tell us in the same email and we’ll remove it.')],
      ['10. How long we keep data', liste([
        'Account, profile and content: until you delete your account.',
        'Food log: deleted when you withdraw consent.',
        'Troubleshooting log: 90 days.',
        'Crash reports: 30 days.',
        'Push token: until you sign out or delete your account.',
        'Analytics: collected only while your consent stands, and deleted when you delete your account.',
        'Feedback: while your account exists, or until you ask us to delete it. You can delete your own feedback while it is under review or has been declined.',
        'Newsletter: until you unsubscribe or delete your account.',
        'Opt-out requests from rights holders: for as long as the opt-out stands.',
        'While a deletion is still going through at one of our providers, we keep your account ID, and your email address if needed, until it is complete. Nothing else, and no longer than it takes.',
      ]) + avsnitt('You delete your account in Settings → Delete account. That removes your account, all your content and photos, and the data we sent to PostHog, EmailOctopus and RevenueCat. You cancel your subscription yourself with Apple or Google.')],
      ['11. Your rights', 'You can ask for access to your data, correction, deletion, a copy of your data (portability) and restriction of processing. You can object to processing based on legitimate interest and withdraw consent at any time. You can download a copy of your data yourself in Settings. For anything else, email hei@matlyst-app.no; we reply within 30 days. You can complain to the Norwegian Data Protection Authority (datatilsynet.no) or to the authority where you live. See the regional additions below.'],
      ['12. Age and consent', 'Matlyst has no general age limit. To give your own consent to analytics, the food log or AI sharing, you confirm the minimum age for the country you live in, which the app shows you. We store the country, the age you confirmed and the time, never your date of birth. We have no parental consent flow. Without the age confirmation, you can still use the rest of the app, but not the feature that needs it.'],
      ['13. Regional additions', avsnitt(
        '<strong>European Economic Area and Switzerland.</strong> Everything above applies. The lead supervisory authority is Datatilsynet, the Norwegian Data Protection Authority. You can also complain to the authority where you live. In Switzerland, the Federal Act on Data Protection applies, and you can complain to the Federal Data Protection and Information Commissioner (FDPIC).',
        '<strong>United Kingdom.</strong> We process your data under the UK GDPR and the Data Protection Act 2018. You can complain to the Information Commissioner’s Office (ico.org.uk).',
        '<strong>United States.</strong>') + liste([
        '<em>Children (COPPA).</em> Matlyst is not directed at children under 13. Users under 13 cannot give their own consent to analytics, the food log or AI sharing. If we learn that we hold personal data from a child under 13 beyond what the basic app needs, we delete it. Parents can contact hei@matlyst-app.no.',
        '<em>California (CCPA/CPRA).</em> We do not sell or share personal information as the CCPA defines it, and we do not use sensitive personal information to infer characteristics about you. California residents have the right to know, delete, correct and limit, and the right not to be discriminated against for using these rights. Send requests to hei@matlyst-app.no.',
        '<em>Consumer health data (such as the Washington My Health My Data Act and Nevada SB 370).</em> The food log and calorie goal may be consumer health data. We collect them only with your consent, use them only to provide the feature you turned on, never sell them, and delete them when you ask.',
      ]) + avsnitt('<strong>Other countries.</strong> We apply the same protections everywhere. If local law gives you more rights, you have them. Contact hei@matlyst-app.no.')],
      ['14. Changes', 'We may update this policy. For material changes, we update the date and tell you in the app or by email.'],
    ],
  },
};

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
const sistEndret = { en: '2026-10-11' };
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
  '| Overføringsgrunnlag per mottaker | integritet «Leverantörer och överföring» / privatliv «Leverandører og overførsel» | `personvern.html`, «Overføring ut av EØS»: EU uten overføring (Supabase, PostHog, Sentry), adekvans (EmailOctopus), SCC (Anthropic, ikke DPF-sertifisert), DPF og subsidiært SCC (Apple, Google inkl. Gemini, Meta, RevenueCat) | 2026-10-05 |',
  '| Helseopplysninger | «artikel 9.2 a» / «artikel 9, stk. 2, litra a» | `personvern.html`, «Formål og rettslig grunnlag» og «Matlogg og kalorimål» | 2026-10-05 |',
].join('\n') + '\n');

const kildeQa = ['# Lokale kildesider', '', 'Kontrollert 2026-10-05. Sidene beskriver import av offentlige URL-er og påstår ikke samarbeid.', '', '| Side | Offisiell kilde | Fem tilfeldige importer |', '|---|---|---|'];
for (const lang of ['sv','da']) for (const row of sourcePages[lang]) {
  kildeQa.push(`| /${lang}/${row[0]} | ${row[4]} | Ikke kjørt: krever testkonto og er en lanseringsport |`);
}
write('../qa/sv-da/lokale-kilder.md', kildeQa.join('\n') + '\n');

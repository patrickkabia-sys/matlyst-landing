// App-bevis: hver lang side får skjermbilder eller animasjon av appen der teksten beskriver en funksjon.
// Kjøres ETTER generatorene (etter app-uttrykk): node scripts/app-bevis.mjs
// Regel (Patrick 18.11.2026): vi viser alltid appen når teksten handler om en funksjon, og hvert bilde har en grunn
// (billedtekst som sier hva leseren ser). Tekstvegger uten visning av appen er ikke interessante.
// Idempotent: blokkene ligger mellom markører og skrives på nytt.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SIDEGRUPPER } from './locale-sider.mjs';

const START = '<!-- app-bevis:start -->';
const SLUTT = '<!-- app-bevis:slutt -->';
const UTELATT = new Set(['node_modules', '.git', 'test-results', 'playwright-report']);
const G = '/images/en-guide';
const manifest = JSON.parse(readFileSync(new URL('../images/en-guide/bilder.json', import.meta.url), 'utf8'));
const altFor = (base) => Object.values(manifest).find((v) => v.files && Object.values(v.files).some((f) => f.file.startsWith(`${base}-`)))?.alt ?? base;
const esc = (s) => s.replace(/&/gu, '&amp;').replace(/"/gu, '&quot;').replace(/</gu, '&lt;');

const TITTEL = { nb: 'I Matlyst', sv: 'I Matlyst', da: 'I Matlyst', en: 'In Matlyst' };

// nøkkel: [rekkefølge-regex per språk, billedtekst per språk, lenke-gruppe]
const REGLER = [
  ['pantry', { en: /pantry|fridge|leftover|use up|use it up/iu, nb: /spiskammer|kjøleskap|rester|bruk opp|matsvinn/iu, sv: /skafferi|kylskåp|rester|matsvinn/iu, da: /spisekammer|køleskab|rester|madspild/iu }, { en: 'The pantry shows how many days are left on each item.', nb: 'Spiskammeret viser hvor mange dager det er igjen på hver vare.', sv: 'Skafferiet visar hur många dagar det är kvar på varje vara.', da: 'Spisekammeret viser, hvor mange dage der er tilbage på hver vare.' }, 'spiskammer', ['en', 'nb', 'sv', 'da']],
  ['skalering', { en: /scal|servings|crowd|quantit|how much|portion|guests/iu }, { en: 'Change the servings and every amount follows.' }, 'oppskrifts-app', ['en']],
  ['liste', { en: /grocery|shopping|shop|buy|store|list/iu, nb: /handleliste|handle|kjøp|butikk/iu, sv: /inköpslista|handla|köp|butik/iu, da: /indkøbsliste|handl|køb|butik/iu },
    { en: 'Every recipe you plan lands on one list, sorted by store section.', nb: 'Hver oppskrift du planlegger havner på én liste, sortert etter butikkavdeling.', sv: 'Varje recept du planerar hamnar på en lista, sorterad efter butiksavdelning.', da: 'Hver opskrift, du planlægger, havner på én liste, sorteret efter butiksafdeling.' }, 'handleliste', ['en', 'nb', 'sv', 'da']],
  ['plan', { en: /plan|timeline|schedule|menu|week|day|ahead|make-ahead/iu, nb: /\bplan|ukemeny|\bmeny|\buke\b|tidslinje/iu, sv: /\bplan|veckomeny|\bmeny|\bvecka|tidslinje/iu, da: /\bplan|madplan|\bmenu|\buge\b|tidslinje/iu },
    { en: 'Put each recipe on the day you will cook it.', nb: 'Legg hver oppskrift på dagen du skal lage den.', sv: 'Lägg varje recept på dagen du ska laga det.', da: 'Læg hver opskrift på dagen, du skal lave den.' }, 'ukemeny', ['en', 'nb', 'sv', 'da']],
  ['kokemodus', { en: /cook|oven|stove|roast|timer|step|bake|heat/iu, nb: /kokemodus|\blag(e|er)?\b|\bstek|timer|tidtaker|\bsteg|\bovn/iu, sv: /matlagningsläge|\blaga\b|timer|\bsteg|\bugn/iu, da: /madlavningstilstand|\blav(e|er)?\b|timer|\btrin|\bovn/iu },
    { en: 'Cook mode turns the steps into a checklist and suggests timers.', nb: 'Kokemodus gjør stegene til en sjekkliste og foreslår tidtakere.', sv: 'Matlagningsläget gör stegen till en checklista och föreslår timers.', da: 'Madlavningstilstanden gør trinnene til en tjekliste og foreslår timere.' }, 'oppskrifts-app', ['en', 'nb', 'sv', 'da']],
  ['ask', { en: /swap|ask matlyst|substitut|adapt|vegan/iu, nb: /bytt|erstatt|spør matlyst|vegansk/iu, sv: /byt|ersätt|fråga matlyst|vegansk/iu, da: /byt|erstat|spørg matlyst|vegansk/iu }, { en: 'Ask Matlyst can swap ingredients and shows the changes so you can undo them. It is a Pro feature.', nb: 'Spør Matlyst kan bytte ingredienser og viser endringene før du lagrer. Det er en Pro-funksjon.', sv: 'Fråga Matlyst kan byta ingredienser och visar ändringarna innan du sparar. Det är en Pro-funktion.', da: 'Spørg Matlyst kan bytte ingredienser og viser ændringerne, før du gemmer. Det er en Pro-funktion.' }, 'oppskrifts-app', ['en', 'nb', 'sv', 'da']],
  ['eksport', { en: /export|leave|own your|yours/iu, nb: /eksport|ta med deg|dine egne/iu, sv: /export|ta med dig|dina egna/iu, da: /eksport|tag med dig|dine egne/iu }, { en: 'Export all your recipes for free.', nb: 'Eksporter alle oppskriftene dine gratis.', sv: 'Exportera alla dina recept gratis.', da: 'Eksportér alle dine opskrifter gratis.' }, 'oppskrifts-app', ['en', 'nb', 'sv', 'da']],
  ['mapper', { en: /folder|organiz|collection|find|search|library|keep|gather|recipes/iu, nb: /mapp|samle|finn|oppskrift|søk/iu, sv: /mapp|samla|hitta|recept|sök/iu, da: /mapp|samle|find|opskrift|søg/iu },
    { en: 'Keep every recipe in folders you can search.', nb: 'Samle alle oppskriftene i mapper du kan søke i.', sv: 'Samla alla recept i mappar du kan söka i.', da: 'Saml alle opskrifterne i mapper, du kan søge i.' }, 'oppskrifts-app', ['en', 'nb', 'sv', 'da']],
  ['import', { en: /import|save|step by step|how to|caption|post|reel/iu, nb: /importer|lagre|slik|innlegg|tre måter/iu, sv: /importera|spara|så sparar|inlägg/iu, da: /importér|importer|gem|sådan|opslag/iu },
    { en: 'Paste a link or share a post, then check the draft before you save.', nb: 'Lim inn en lenke eller del et innlegg, og kontroller utkastet før du lagrer.', sv: 'Klistra in en länk eller dela ett inlägg och kontrollera utkastet innan du sparar.', da: 'Indsæt et link eller del et opslag, og tjek udkastet, før du gemmer.' }, 'importer-oppskrifter', ['en', 'nb', 'sv', 'da']],
];

const MEDIA = {
  en: {
    pantry: { type: 'bilde', base: 'matlyst-pantry-expiry-dates' },
    skalering: { type: 'video', fil: 'matlyst-recipe-servings-scale-4-to-6' },
    liste: { type: 'video', fil: 'matlyst-meal-plan-to-grocery-list' },
    plan: { type: 'bilde', base: 'matlyst-meal-plan-week' },
    kokemodus: { type: 'video', fil: 'matlyst-cook-mode-timer-from-step' },
    ask: { type: 'bilde', base: 'matlyst-ask-matlyst-vegan-swap-changes' },
    eksport: { type: 'bilde', base: 'matlyst-settings-export-recipes' },
    mapper: { type: 'tel', n: '04', alt: 'Matlyst folders screen with recipes sorted into folders' },
    import: { type: 'bilde', base: 'matlyst-import-screen-paste-link' },
  },
  nb: { pantry: { type: 'lok', base: 'pantry-expiry-dates', alt: 'Spiskammeret i Matlyst med antall dager igjen på hver vare' }, liste: { type: 'lok', base: 'grocery-list-sections', alt: 'Handlelista i Matlyst sortert etter butikkavdeling' }, plan: { type: 'lok', base: 'meal-plan-week', alt: 'Ukemenyen i Matlyst med middager lagt på hver dag' }, kokemodus: { type: 'lok', base: 'cook-mode-timer', alt: 'Kokemodus i Matlyst med tidtaker på 10 minutter fra et steg' }, mapper: { type: 'lok', base: 'recipe-folders', alt: 'Mapper i Matlyst med oppskrifter samlet' }, ask: { type: 'lok', base: 'ask-matlyst-swap-changes', alt: 'Spør Matlyst viser endringene i en oppskrift før du overskriver eller lager en kopi' }, eksport: { type: 'lok', base: 'settings-export-recipes', alt: 'Innstillinger i Matlyst med eksport av oppskrifter' }, import: { type: 'ill', alt: 'Illustrasjon: del et innlegg til Matlyst' } },
  sv: { pantry: { type: 'lok', base: 'pantry-expiry-dates', alt: 'Skafferiet i Matlyst med antal dagar kvar på varje vara' }, liste: { type: 'lok', base: 'grocery-list-sections', alt: 'Inköpslistan i Matlyst sorterad efter butiksavdelning' }, plan: { type: 'lok', base: 'meal-plan-week', alt: 'Veckomenyn i Matlyst med middagar lagda på varje dag' }, kokemodus: { type: 'lok', base: 'cook-mode-timer', alt: 'Matlagningsläget i Matlyst med en timer på 10 minuter från ett steg' }, mapper: { type: 'lok', base: 'recipe-folders', alt: 'Mappar i Matlyst med samlade recept' }, ask: { type: 'lok', base: 'ask-matlyst-swap-changes', alt: 'Fråga Matlyst visar ändringarna i ett recept innan du skriver över eller gör en kopia' }, eksport: { type: 'lok', base: 'settings-export-recipes', alt: 'Inställningar i Matlyst med export av recept' }, import: { type: 'ill', alt: 'Illustration: dela ett inlägg med Matlyst' } },
  da: { pantry: { type: 'lok', base: 'pantry-expiry-dates', alt: 'Spisekammeret i Matlyst med antal dage tilbage på hver vare' }, liste: { type: 'lok', base: 'grocery-list-sections', alt: 'Indkøbslisten i Matlyst sorteret efter butiksafdeling' }, plan: { type: 'lok', base: 'meal-plan-week', alt: 'Madplanen i Matlyst med aftensmad lagt på hver dag' }, kokemodus: { type: 'lok', base: 'cook-mode-timer', alt: 'Madlavningstilstanden i Matlyst med en timer på 10 minutter fra et trin' }, mapper: { type: 'lok', base: 'recipe-folders', alt: 'Mapper i Matlyst med samlede opskrifter' }, ask: { type: 'lok', base: 'ask-matlyst-swap-changes', alt: 'Spørg Matlyst viser ændringerne i en opskrift, før du overskriver eller laver en kopi' }, eksport: { type: 'lok', base: 'settings-export-recipes', alt: 'Indstillinger i Matlyst med eksport af opskrifter' }, import: { type: 'ill', alt: 'Illustration: del et opslag med Matlyst' } },
};

const sti = (id, lang) => SIDEGRUPPER.find((g) => g.id === id)?.sider[lang] ?? null;
const LENKETEKST = { nb: 'Les mer', sv: 'Läs mer', da: 'Læs mere', en: 'Read more' };

function mediaHtml(lang, nokkel) {
  const m = MEDIA[lang]?.[nokkel];
  if (!m) return null;
  if (m.type === 'bilde') {
    const alt = esc(altFor(m.base));
    return `<img class="tel" src="${G}/${m.base}-400.webp" srcset="${G}/${m.base}-400.webp 400w, ${G}/${m.base}-800.webp 800w" sizes="200px" width="400" height="870" loading="lazy" decoding="async" alt="${alt}">`;
  }
  if (m.type === 'video') return `<video class="tel" controls muted loop playsinline preload="none" poster="${G}/${m.fil}-poster.webp" width="540" height="1174" aria-label="${esc(altFor(m.fil))}" data-autoplay><source src="${G}/${m.fil}.mp4" type="video/mp4"></video>`;
  if (m.type === 'lok') return `<img class="tel" src="${G}/${lang}/matlyst-${m.base}-400.webp" srcset="${G}/${lang}/matlyst-${m.base}-400.webp 400w, ${G}/${lang}/matlyst-${m.base}-800.webp 800w" sizes="200px" width="400" height="867" loading="lazy" decoding="async" alt="${esc(m.alt)}">`;
  if (m.type === 'tel') return `<img class="tel" src="/images/app/${lang}/tel-${m.n}.webp" width="536" height="1108" loading="lazy" decoding="async" alt="${esc(m.alt)}">`;
  if (m.type === 'ill') return `<video class="tel" controls muted loop playsinline preload="none" poster="${G}/${lang}/matlyst-share-instagram-post-to-matlyst-poster.webp" width="540" height="960" aria-label="${esc(m.alt)}" data-autoplay><source src="${G}/${lang}/matlyst-share-instagram-post-to-matlyst.mp4" type="video/mp4"></video>`;
  return null;
}

export function blokk(lang, nokkel, tekst, lenkeSti) {
  const media = mediaHtml(lang, nokkel);
  if (!media) return null;
  return `${START}<aside class="i-appen i-${nokkel}"><div class="i-appen-tekst"><p class="i-appen-tittel"><img src="/images/icon-64.png" width="22" height="22" alt="">${TITTEL[lang]}</p><p>${tekst}</p>${lenkeSti ? `<a class="more" href="${lenkeSti}">${LENKETEKST[lang]}</a>` : ''}</div><div class="i-appen-media">${media}</div></aside>${SLUTT}`;
}

const STRIPP = new RegExp(`${START}[\\s\\S]*?${SLUTT}`, 'gu');
const H2 = /<h[23](?: id="[^"]*")?>([\s\S]*?)<\/h[23]>/gu;

export function behandle(html, lang, egenSti = '') {
  if (!/class="prose locale-prose has-toc"/u.test(html) || /<meta name="robots" content="[^"]*noindex/iu.test(html)) return html;
  let ut = html.replace(STRIPP, '');
  const brukt = new Set();
  const treff = [];
  for (const m of ut.matchAll(H2)) {
    if (/^<dl>/u.test(ut.slice(m.index + m[0].length, m.index + m[0].length + 8))) continue;
    const tekst = m[1].replace(/<[^>]+>/gu, ' ');
    for (const [nokkel, regex, captions, gruppe, sprak] of REGLER) {
      if (brukt.has(nokkel) || !sprak.includes(lang) || !regex[lang]?.test(tekst) || !MEDIA[lang]?.[nokkel]) continue;
      brukt.add(nokkel);
      treff.push({ pos: m.index + m[0].length, nokkel, tekst: captions[lang], lenke: sti(gruppe, lang) });
      break;
    }
  }
  const valgt = treff.slice(0, 6);
  // Bakfra, så posisjonene står.
  for (const t of valgt.reverse()) {
    const b = blokk(lang, t.nokkel, t.tekst, t.lenke === egenSti ? null : t.lenke);
    const slutt = ut.indexOf('</p>', t.pos);
    if (!b || slutt < 0) continue;
    ut = `${ut.slice(0, slutt + 4)}${b}${ut.slice(slutt + 4)}`;
  }
  return ut;
}

function htmlFiler(mappe) {
  return readdirSync(mappe, { withFileTypes: true }).flatMap((d) => {
    if (d.isDirectory()) return UTELATT.has(d.name) ? [] : htmlFiler(join(mappe, d.name));
    return d.name.endsWith('.html') ? [join(mappe, d.name)] : [];
  });
}

export function kjor(rot) {
  const endret = [];
  for (const fil of htmlFiler(rot)) {
    const html = readFileSync(fil, 'utf8');
    const lang = html.match(/<html[^>]*\slang="([^"]+)"/u)?.[1];
    const sprak = lang === 'no' ? 'nb' : lang;
    if (!MEDIA[sprak]) continue;
    const kanon = html.match(/<link rel="canonical" href="https:\/\/matlyst-app\.no([^"]+)"/u)?.[1] ?? '';
    const ny = behandle(html, sprak, kanon);
    if (ny !== html) { writeFileSync(fil, ny); endret.push(relative(rot, fil)); }
  }
  return endret;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(`app-bevis: ${kjor(fileURLToPath(new URL('..', import.meta.url))).length} sider oppdatert`);
}

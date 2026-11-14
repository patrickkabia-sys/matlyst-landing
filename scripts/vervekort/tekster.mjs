// Tekstene til vervekortet (/v/ på fire språk) og OG-bildene.
//
// Skrevet fra meningen etter skillen matlyst-sprak, ikke oversatt fra bokmål.
// Språkrapporten med begrunnelser og kilder: docs/sprak/2026-11-14-vervekort.md.
// Jusvurderingen av forhåndsvisningskortet: docs/vervekort-jus.md.
//
// Fakta sidene lover, slått opp i app-repoet 2026-11-14 (origin/master e25ea0ffd):
// - Koden skrives i feltet auth.vervKode i registreringsskjemaet for e-post
//   (components/onboarding2/Registrering.tsx og app/auth/register.tsx). Apple- og
//   Google-registreringen har ikke feltet, derfor «med e-post».
// - Vennen får BONUS_IMPORTER = 5 bonusimporter (lib/vervebonus.ts), oppå
//   månedskvoten (bonusPott legges til, tilgjengeligeImporter). Ververen får ingenting.
//
// ⚠️ Ingen tekst her taler på vegne av den som deler lenka, og ingen er en ferdig
// delingstekst. Kortet beskriver hvor lenka går (PR 20b, docs/vervekort-jus.md).

export const SPRAK = ['nb', 'sv', 'da', 'en'];

export const BASE = 'https://matlyst-app.no';

export const TEKSTER = {
  nb: {
    htmlLang: 'nb',
    ogLocale: 'nb_NO',
    sti: '/v/',
    hjem: '/',
    tittel: 'Du er invitert til Matlyst',
    beskrivelse: 'Oppskriftsappen som lagrer oppskrifter fra nettet, Instagram og TikTok. Lenken åpner App Store eller Google Play.',
    bildeAlt: 'Matlyst-logoen og teksten «Du er invitert til Matlyst» ved siden av en tallerken pasta i tomatsaus med basilikum.',
    intro: 'Med Matlyst lagrer du oppskrifter fra nettet, Instagram og TikTok, og bruker dem til ukemeny og handleliste.',
    stegTittel: 'Slik kommer du i gang',
    steg1: 'Last ned Matlyst fra App Store eller Google Play.',
    steg2: 'Lag en konto med e-post, og skriv koden i feltet «Vervekode». Da får du 5 ekstra gratisimporter.',
    kodeEtikett: 'Vervekode',
    kopier: 'Kopier',
    kopiert: 'Kopiert',
    kopierFeil: 'Marker koden og kopier den selv.',
    utenKode: 'Fikk du en vervekode i meldingen? Skriv den inn når du lager en konto med e-post.',
    butikker: 'Last ned Matlyst',
    lesMer: 'Les mer om Matlyst',
    domene: 'matlyst-app.no',
  },
  sv: {
    htmlLang: 'sv',
    ogLocale: 'sv_SE',
    sti: '/sv/v/',
    hjem: '/sv/',
    tittel: 'Du är inbjuden till Matlyst',
    beskrivelse: 'Receptappen som sparar recept från webben, Instagram och TikTok. Länken öppnar App Store eller Google Play.',
    bildeAlt: 'Matlysts logotyp och texten ”Du är inbjuden till Matlyst” bredvid en tallrik pasta i tomatsås med basilika.',
    intro: 'Med Matlyst sparar du recept från webben, Instagram och TikTok och använder dem i veckomenyn och inköpslistan.',
    stegTittel: 'Så kommer du igång',
    steg1: 'Hämta Matlyst i App Store eller Google Play.',
    steg2: 'Skapa ett konto med e-post och skriv in koden i fältet ”Värvningskod”. Då får du 5 extra gratisimporter.',
    kodeEtikett: 'Värvningskod',
    kopier: 'Kopiera',
    kopiert: 'Kopierad',
    kopierFeil: 'Markera koden och kopiera den själv.',
    utenKode: 'Fick du en värvningskod i meddelandet? Skriv in den när du skapar ett konto med e-post.',
    butikker: 'Hämta Matlyst',
    lesMer: 'Läs mer om Matlyst',
    domene: 'matlyst-app.no',
  },
  da: {
    htmlLang: 'da',
    ogLocale: 'da_DK',
    sti: '/da/v/',
    hjem: '/da/',
    tittel: 'Du er inviteret til Matlyst',
    beskrivelse: 'Opskriftsappen, der gemmer opskrifter fra nettet, Instagram og TikTok. Linket åbner App Store eller Google Play.',
    bildeAlt: 'Matlysts logo og teksten »Du er inviteret til Matlyst« ved siden af en tallerken pasta i tomatsauce med basilikum.',
    intro: 'Med Matlyst gemmer du opskrifter fra nettet, Instagram og TikTok og bruger dem til madplanen og indkøbslisten.',
    stegTittel: 'Sådan kommer du i gang',
    steg1: 'Hent Matlyst i App Store eller Google Play.',
    steg2: 'Opret en konto med e-mail, og skriv koden i feltet »Henvisningskode«. Så får du 5 ekstra gratisimporter.',
    kodeEtikett: 'Henvisningskode',
    kopier: 'Kopier',
    kopiert: 'Kopieret',
    kopierFeil: 'Marker koden, og kopier den selv.',
    utenKode: 'Fik du en henvisningskode i beskeden? Skriv den, når du opretter en konto med e-mail.',
    butikker: 'Hent Matlyst',
    lesMer: 'Læs mere om Matlyst',
    domene: 'matlyst-app.no',
  },
  en: {
    htmlLang: 'en',
    ogLocale: 'en_US',
    sti: '/en/v/',
    hjem: '/en/',
    tittel: 'You’re invited to try Matlyst',
    beskrivelse: 'The recipe app that saves recipes from websites, Instagram, and TikTok. This link opens the App Store or Google Play.',
    bildeAlt: 'The Matlyst logo and the words “You’re invited to try Matlyst” next to a bowl of pasta in tomato sauce with basil.',
    intro: 'Matlyst saves recipes from websites, Instagram, and TikTok so you can plan your meals and build your grocery list.',
    stegTittel: 'How to get started',
    steg1: 'Get Matlyst from the App Store or Google Play.',
    steg2: 'Sign up with email and enter the code in the “Referral code” field. You’ll get 5 extra free imports.',
    kodeEtikett: 'Referral code',
    kopier: 'Copy',
    kopiert: 'Copied',
    kopierFeil: 'Select the code and copy it.',
    utenKode: 'Got a referral code in the message? Enter it when you sign up with email.',
    butikker: 'Get Matlyst',
    lesMer: 'Learn more about Matlyst',
    domene: 'matlyst-app.no',
  },
};

export const bildeSti = (lang) => `/images/v/vervekort-${lang}.png`;
export const bildeUrl = (lang) => `${BASE}${bildeSti(lang)}`;

// All synlig tekst i sideskallet (meny, hylledel, mørk bunn, QR-vindu, fast knapp og
// samtykkebanner), ett språk per gren under SKALLTEKST. Skallet (scripts/skall.mjs) bygges
// av denne modulen, og forsiden henter skalltekstene bare gjennom skallet.
// Oversettere jobber fra MENINGEN: kommentaren over hver gruppe sier hvor teksten står.
// Hyllenavn og hyllelenker i menyen bor i scripts/hyller.mjs.

// Språkvelgerens navn. Dette er data, ikke oversatt tekst: språkene står alltid på sitt eget
// språk, og etiketten («Språk») er verdiene språkvelgeren allerede bruker.
export const SPRAKVALG = {
  aria: { nb: 'Språk', sv: 'Språk', da: 'Sprog', en: 'Language' },
  navn: { nb: 'Norsk', sv: 'Svenska', da: 'Dansk', en: 'English' },
};

// Butikklenkene i QR-vinduet. Egennavn og adresser, ikke oversatt tekst.
// Verdiene er de samme som `common` i locale.js; en test låser likheten.
export const BUTIKK = {
  nb: { apple: 'https://apps.apple.com/no/app/matlyst/id6762563515', google: 'https://play.google.com/store/apps/details?id=app.matlyst' },
  sv: { apple: 'https://apps.apple.com/se/app/matlyst/id6762563515', google: 'https://play.google.com/store/apps/details?id=app.matlyst&hl=sv&gl=SE' },
  da: { apple: 'https://apps.apple.com/dk/app/matlyst/id6762563515', google: 'https://play.google.com/store/apps/details?id=app.matlyst&hl=da&gl=DK' },
  en: { apple: 'https://apps.apple.com/app/matlyst/id6762563515', google: 'https://play.google.com/store/apps/details?id=app.matlyst&hl=en' },
};

const sprakvalg = (kode) => ({
  aria: SPRAKVALG.aria[kode],
  valg: Object.keys(SPRAKVALG.navn).map((k) => ({ kode: k, navn: SPRAKVALG.navn[k] })),
});

export const SKALLTEKST = {
  nb: {
    // ---------- Toppen av siden ----------
    topp: {
      // Logoen øverst til venstre. Skjermleserlabel for lenken til forsiden.
      merkeAria: 'Matlyst, til forsiden',
      // Knappen som åpner hovedmenyen på små skjermer og ved siden av nedlastingsknappen.
      meny: 'Meny',
      menyAria: 'Meny',
      // Navnet på selve menypanelet, for skjermlesere.
      panelAria: 'Hovedmeny',
      // Den lille knappen øverst til høyre. Åpner nedlasting.
      lastNed: 'Last ned',
    },

    // Språkvelgeren, i menyen og i bunnen. Avledet fra SPRAKVALG.
    sprak: sprakvalg('nb'),

    // ---------- Bunnen av siden ----------
    // Skjermlesernavn på bunnseksjonen og på menyen i den.
    bunn: {
      aria: 'Alt på Matlyst',
      menyAria: 'Bunnmeny',
      // Nedlastingsknappen i bunnen, ved siden av oppfordringen.
      knapp: 'Last ned gratis',
      // Den sammenfoldede lenkegruppa med alle guidene, rett under hyllene.
      guider: 'Alle guider',
    },
    // Siste oppfordring rett over bunnmenyen, ved siden av nedlastingsknappen.
    bunnlinje: 'Den oppskriften du lagret? Lag den i kveld.',
    // Fotlinjen nederst. Gruppa heter Juridisk og samler personvern, vilkår og informasjonskapsler.
    under: {
      vilkarAria: 'Juridisk',
      lenker: ['Personvern', 'Vilkår', 'Informasjonskapsler'],
      // Opphavslinje nederst. Flaggbildet vises rett etter teksten, med et mellomrom
      // mellom (mellomrommet ligger i siden, ikke i strengen). Oversettes som en vanlig setning.
      laget: '© 2026 Matlyst. Laget i Norge',
      // Skjermlesertekst for flaggbildet etter opphavslinjen.
      flaggAlt: 'Norsk flagg',
      epost: 'hei@matlyst-app.no',
    },
    // Den faste knappen som glir inn nederst på skjermen når man har rullet forbi
    // den første knappen og ennå ikke nådd den siste.
    fast: {
      knapp: 'Last ned gratis',
    },

    // Nedlastingsknappen i sidens eget innhold (ikke i skallet): undersidene bruker den
    // som første knapp, så den faste knappen vet når den skal vike.
    innhold: {
      knapp: 'Last ned gratis',
    },

    // QR-vinduet som åpnes når man trykker på en nedlastingsknapp på stor skjerm.
    // På mobil går knappene rett til butikken.
    hent: {
      // Skjermlesertekst for krysset øverst i vinduet som lukker det.
      lukkAria: 'Lukk',
      // Skjermlesertekst for QR-koden (et bilde). Koden peker til nedlastingssiden.
      qrAlt: 'QR-kode til matlyst-app.no/app',
      // Overskriften i vinduet, rett under QR-koden. Oppfordrer til å skanne koden med telefonkameraet.
      tittel: 'Skann med telefonen',
      // Forklaringen rett under overskriften, i én eller to korte linjer: hva som skjer når man skanner.
      ingress: 'Kameraet tar deg til riktig butikk, enten du har iPhone eller Android.',
      // Navnene på de to knappene nederst i vinduet, som fører til hver sin butikk. Egennavn, oversettes ikke.
      butikker: ['App Store', 'Google Play'],
    },

    // Samtykkebanneret. Bare for sider som laster site.js uten eget banner.
    // `tekst` står foran lenka, `lenke` er lenketeksten (til personvernerklæringen), og et punktum følger.
    samtykke: {
      overskrift: 'Vi bruker informasjonskapsler',
      tekst: 'Vi måler hva som fungerer, slik at vi kan forbedre Matlyst. Du bestemmer. Les mer i',
      lenke: 'personvernerklæringen',
      godta: 'Godta',
      avvis: 'Bare nødvendige',
    },
  },
};

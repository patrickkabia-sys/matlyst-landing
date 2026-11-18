// Hylledata: de seks «hyllene» som både menyen og bunnen tegnes fra.
// Lenketekstene og rekkefølgen følger det godkjente forside-prototypet.
// `flis` er filnavnet i images/forside/logo/. En lenke uten side har `finnes: false`
// og vises ikke (se synligeLenker), men beholdes med forventet adresse.

export const HYLLER = {
  nb: [
    {
      id: 'appen', navn: 'Appen', flis: '14.webp',
      lenker: [
        { tekst: 'Oppskriftsapp', href: '/oppskriftsbok-app/' },
        { tekst: 'Importer oppskrifter', href: '/importer-oppskrifter/' },
        { tekst: 'Ukemeny', href: '/ukemeny/' },
        { tekst: 'Handleliste', href: '/handleliste/' },
        { tekst: 'Spiskammer', href: '/spiskammer-app/' },
        { tekst: 'Spør Matlyst', href: '/#spor' },
        { tekst: 'Finn oppskrifter', href: '/finn-oppskrifter/' },
      ],
    },
    {
      id: 'lagre', navn: 'Lagre oppskrifter', flis: 'e99f71.webp',
      lenker: [
        { tekst: 'Instagram', href: '/lagre-oppskrifter-fra-instagram/' },
        { tekst: 'TikTok', href: '/lagre-oppskrifter-fra-tiktok/' },
        { tekst: 'Matprat', href: '/importer-fra-matprat/' },
        { tekst: 'Köket.se', href: '/importer-fra-koket/' },
        { tekst: 'Bilder og kokebøker', href: '/handskrevne-oppskrifter/' },
        { tekst: 'Paprika', href: '/bytt-fra-paprika/' },
      ],
    },
    {
      id: 'middag', navn: 'Middag', flis: 'a201c1.webp',
      lenker: [
        { tekst: 'Middagsforslag', href: '/middagsforslag/' },
        { tekst: 'Enkel middag', href: '/enkel-middag/' },
        { tekst: 'Tøm kjøleskapet', href: '/tom-kjoleskapet/' },
        { tekst: 'Hva kan jeg lage?', href: '/hva-kan-jeg-lage/' },
      ],
    },
    {
      id: 'verktoy', navn: 'Verktøy', flis: '3eef40.webp',
      lenker: [
        { tekst: 'Enhetsomregner', href: '/verktoy/enhetsomregner/' },
        // Sidene heter fortsatt «kopp» i adressen; teksten sier «cups».
        { tekst: 'Cups til dl', href: '/verktoy/kopp-til-dl/' },
        { tekst: 'Dl til cups', href: '/verktoy/dl-til-kopp/' },
        { tekst: 'Celsius til Fahrenheit', href: '/verktoy/celsius-til-fahrenheit/' },
        { tekst: 'Dl til gram', href: '/verktoy/dl-til-gram/', finnes: false },
        { tekst: 'Porsjoner', href: '/verktoy/porsjoner/', finnes: false },
        { tekst: 'Kakeform', href: '/verktoy/kakeform/', finnes: false },
        { tekst: 'Steketid', href: '/verktoy/steketid/', finnes: false },
        { tekst: 'Pizzadeig', href: '/verktoy/pizzadeig/', finnes: false },
        { tekst: 'Gjær', href: '/verktoy/gjaer/', finnes: false },
        { tekst: 'Alle kalkulatorer', href: '/verktoy/', finnes: false },
      ],
    },
    {
      id: 'tips', navn: 'Kjøkkentips', flis: '77b354.webp',
      lenker: [
        { tekst: 'Doble en oppskrift', href: '/blogg/doble-oppskrift/' },
        { tekst: 'Er egget ferskt?', href: '/blogg/er-egget-ferskt/' },
        { tekst: 'Erstatte egg', href: '/blogg/erstatte-egg/' },
        { tekst: 'Kjernetemperatur', href: '/blogg/kjernetemperatur/' },
        { tekst: 'Koketider', href: '/blogg/koketider/' },
        { tekst: 'Alle kjøkkentips', href: '/blogg/' },
      ],
    },
    {
      id: 'matlyst', navn: 'Matlyst', flis: 'b3fdbf.webp',
      lenker: [
        { tekst: 'For matskapere', href: '/skapere/' },
        { tekst: 'Instagram', href: 'https://www.instagram.com/matlyst_app/' },
        { tekst: 'TikTok', href: 'https://www.tiktok.com/@matlyst.appen' },
        { tekst: 'YouTube', href: 'https://www.youtube.com/@matlyst' },
        { tekst: 'Pinterest', href: 'https://www.pinterest.com/matlystapp/' },
        { tekst: 'Personvern', href: '/personvern.html' },
      ],
    },
  ],
};

export function synligeLenker(hylle) {
  return hylle.lenker.filter((l) => l.finnes !== false);
}

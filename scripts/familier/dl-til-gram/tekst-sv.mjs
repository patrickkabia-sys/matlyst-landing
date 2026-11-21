// Den handskrivna delen av sidorna för «dl till gram» (sv). Allt annat skrivs av malen från datafilen (data.sv.json).
//   variant: varan så som Matvaretabellen beskriver den, på läsbar svenska. Används i kort svar och källrad.
//   flytende: true för vätskor (mjölk, grädde, olja, sirap). Då skrivs skedarna utan «struken».
//   naer: id för närliggande varor. Den första får en fråga, och alla står först i «Fler ingredienser».
// Ingen mening här ska påstå mer än källan, och inga tal skrivs för hand: talen kommer från datafilen.
export const TEKST = {
  hvetemel: { variant: 'siktat vetemjöl', naer: ['sammalt-hvetemel', 'rugmel'] },
  'sammalt-hvetemel': { variant: 'fullkornsvetemjöl (fint eller grovt)', naer: ['hvetemel'] },
  rugmel: { variant: 'siktat rågmjöl', naer: ['hvetemel'] },
  havregryn: { variant: 'havregryn' },
  sukker: { variant: 'vitt socker', naer: ['brunt-sukker', 'melis'] },
  'brunt-sukker': { variant: 'farinsocker', naer: ['sukker'] },
  melis: { variant: 'florsocker', naer: ['sukker'] },
  potetmel: { variant: 'potatismjöl (potatisstärkelse)', naer: ['maisstivelse'] },
  maisstivelse: { variant: 'majsstärkelse', naer: ['potetmel'] },
  kakao: { variant: 'kakaopulver' },
  kokosmasse: { variant: 'osötad kokosmassa' },
  mandelmel: { variant: 'mandelmjöl', naer: ['mandler'] },
  smor: { variant: 'smör', naer: ['margarin'] },
  margarin: { variant: 'hårt margarin', naer: ['smor'] },
  olje: { variant: 'solrosolja', flytende: true },
  melk: { variant: 'helmjölk', flytende: true, naer: ['flote'] },
  flote: { variant: 'vispgrädde med 37 % fett', flytende: true, naer: ['romme'] },
  romme: { variant: 'norsk seterrømme med 35 % fett', naer: ['flote'] },
  sirup: { variant: 'sirap', flytende: true },
  salt: { variant: 'bordssalt' },
  ris: { variant: 'okokt jasminris (polerat)', naer: ['grotris'] },
  grotris: { variant: 'okokt grötris (koktid 1 timme)', naer: ['ris'] },
  'rode-linser': { variant: 'torkade röda linser' },
  rosiner: { variant: 'russin' },
  mandler: { variant: 'mandel', naer: ['mandelmel'] },
  chiafro: { variant: 'torkade chiafrön' },
  sesamfro: { variant: 'sesamfrön med skal' },
  bulgur: { variant: 'torr bulgur', naer: ['couscous'] },
  couscous: { variant: 'torr couscous', naer: ['bulgur'] },
};

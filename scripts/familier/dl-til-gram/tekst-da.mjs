// Den håndskrevne del af siderne til «dl til gram» (da). Alt andet skrives af malen fra datafilen (data.da.json).
//   variant: varen, som Matvaretabellen beskriver den, på læsbar dansk. Bruges i kort svar og kildelinje.
//   flytende: true for væsker (mælk, fløde, olie, sirup). Så skrives skeerne uden «afstrøget».
//   naer: id på nærliggende varer. Den første får et spørgsmål, og alle står først i «Flere ingredienser».
// Ingen sætning her må påstå mere end kilden, og ingen tal skrives i hånden: tallene kommer fra datafilen.
export const TEKST = {
  hvetemel: { variant: 'almindeligt hvedemel', naer: ['sammalt-hvetemel', 'rugmel'] },
  'sammalt-hvetemel': { variant: 'fuldkornshvedemel (fint eller groft)', naer: ['hvetemel'] },
  rugmel: { variant: 'sigtet rugmel', naer: ['hvetemel'] },
  havregryn: { variant: 'havregryn' },
  sukker: { variant: 'hvidt sukker', naer: ['brunt-sukker', 'melis'] },
  'brunt-sukker': { variant: 'brun farin', naer: ['sukker'] },
  melis: { variant: 'flormelis', naer: ['sukker'] },
  potetmel: { variant: 'kartoffelmel (kartoffelstivelse)', naer: ['maisstivelse'] },
  maisstivelse: { variant: 'majsstivelse', naer: ['potetmel'] },
  kakao: { variant: 'kakaopulver' },
  kokosmasse: { variant: 'usødet kokosmel' },
  mandelmel: { variant: 'mandelmel', naer: ['mandler'] },
  smor: { variant: 'smør', naer: ['margarin'] },
  margarin: { variant: 'hård margarine', naer: ['smor'] },
  olje: { variant: 'solsikkeolie', flytende: true },
  melk: { variant: 'sødmælk', flytende: true, naer: ['flote'] },
  flote: { variant: 'piskefløde med 37 % fedt', flytende: true, naer: [] },
  sirup: { variant: 'sirup', flytende: true },
  salt: { variant: 'bordsalt' },
  ris: { variant: 'ukogt jasminris (poleret)', naer: ['grotris'] },
  grotris: { variant: 'ukogt grødris (kogetid 1 time)', naer: ['ris'] },
  'rode-linser': { variant: 'tørrede røde linser' },
  rosiner: { variant: 'rosiner' },
  mandler: { variant: 'mandler', naer: ['mandelmel'] },
  chiafro: { variant: 'tørrede chiafrø' },
  sesamfro: { variant: 'sesamfrø med skal' },
  bulgur: { variant: 'tør bulgur', naer: ['couscous'] },
  couscous: { variant: 'tør couscous', naer: ['bulgur'] },
};

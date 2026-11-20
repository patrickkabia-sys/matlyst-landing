// Den håndskrevne delen av sidene for «dl til gram» (nb). Alt annet skrives av malen fra datafila.
//   variant: navnet på varen slik den står i Matvaretabellen, på lesbar form. Brukes i kort svar og kildelinje.
//   flytende: true for væsker (melk, fløte, olje, sirup). Da skrives skjeene uten «strøken».
//   naer: rad-id-er for nære varer i samme familie. Den første får et spørsmål, og alle står først i «Andre varer».
//   ekstraSpm: [spørsmål, svar][] som legges bak de vanlige. Svar uten tall som ikke står i datafila.
// Ingen setning her skal påstå mer enn kilden sier, og ingen tall skrives for hånd: tallene kommer fra datafila.
export const TEKST = {
  hvetemel: { variant: 'siktet hvetemel', naer: ['sammalt-hvetemel', 'rugmel'] },
  'sammalt-hvetemel': { variant: 'sammalt hvetemel (fint eller grovt)', naer: ['hvetemel'] },
  rugmel: { variant: 'siktet rugmel', naer: ['hvetemel'] },
  havregryn: { variant: 'havregryn' },
  sukker: { variant: 'hvitt sukker', naer: ['brunt-sukker', 'melis'] },
  'brunt-sukker': { variant: 'brunt sukker', naer: ['sukker'] },
  melis: { variant: 'melis', naer: ['sukker'] },
  potetmel: { variant: 'potetmel (potetstivelse)', naer: ['maisstivelse'] },
  maisstivelse: { variant: 'maisstivelse', naer: ['potetmel'] },
  kakao: { variant: 'kakaopulver' },
  kokosmasse: { variant: 'usøtet kokosmasse' },
  mandelmel: { variant: 'mandelmel', naer: ['mandler'] },
  smor: { variant: 'smør', naer: ['margarin'] },
  margarin: { variant: 'hard margarin', naer: ['smor'] },
  olje: { variant: 'solsikkeolje', flytende: true },
  melk: { variant: 'helmelk', flytende: true, naer: ['flote'] },
  flote: { variant: 'kremfløte med 37 % fett', flytende: true, naer: ['romme'] },
  romme: { variant: 'seterrømme med 35 % fett', naer: ['flote'] },
  sirup: { variant: 'sirup', flytende: true },
  salt: { variant: 'bordsalt' },
  ris: { variant: 'tørr, polert jasminris', naer: ['grotris'] },
  grotris: { variant: 'tørr grøtris med 1 times koketid', naer: ['ris'] },
  'rode-linser': { variant: 'tørre røde linser' },
  rosiner: { variant: 'rosiner' },
  mandler: { variant: 'mandler', naer: ['mandelmel'] },
  chiafro: { variant: 'tørket chiafrø' },
  sesamfro: { variant: 'sesamfrø med skall' },
  bulgur: { variant: 'tørr bulgur', naer: ['couscous'] },
  couscous: { variant: 'tørr couscous', naer: ['bulgur'] },
};

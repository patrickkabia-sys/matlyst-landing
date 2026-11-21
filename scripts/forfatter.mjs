// Registeret over norske sider som har Patrick Kabia som forfatter: synlig linje «Av Patrick Kabia, kjøletekniker»
// og author (Person med @id fra om-siden) i Article. ÉT sted å utvide: legg stien til i FORFATTER_SIDER, eller roten til en hel familie i FORFATTER_ROTER.
// Bare sider om kjøling og mat (holdbarhet, frysing, kjernetemperatur, koketider). Ikke app- eller importguidene.
// Låst av test/forfatter.test.mjs: forfatter står på alle sider i lista og bare på dem.
export const BASE = 'https://matlyst-app.no';
export const PERSON_ID = `${BASE}/om/#patrick-kabia`;
export const FORFATTER_SIDER = Object.freeze([
  'julemiddag/',
  'blogg/kjernetemperatur/',
  'blogg/mat-i-fryseren/',
  'blogg/koketider/',
  'blogg/rester-i-kjoleskapet/',
]);

// Sidefamilier der hver side har forfatteren (scripts/familier/): alt under roten.
export const FORFATTER_ROTER = Object.freeze(['holdbarhet/', 'frysing/', 'mengde-per-person/', 'kjernetemperatur/', 'steketid/']);

export const harForfatter = (path) => {
  const sti = String(path).replace(/^\//u, '');
  return FORFATTER_SIDER.includes(sti) || FORFATTER_ROTER.some((rot) => sti.startsWith(rot));
};
export const forfatterPerson = () => ({ '@type': 'Person', '@id': PERSON_ID, name: 'Patrick Kabia', url: `${BASE}/om/` });
export const FORFATTERLINJE = '<p class="eyebrow">Av <a href="/om/">Patrick Kabia</a>, kjøletekniker</p>';

// Registeret over norske sider som har Patrick Kabia som forfatter: synlig linje «Av Patrick Kabia, kjøletekniker»
// og author (Person med @id fra om-siden) i Article. ÉT sted å utvide: legg stien til i FORFATTER_SIDER.
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

export const harForfatter = (path) => FORFATTER_SIDER.includes(String(path).replace(/^\//u, ''));
export const forfatterPerson = () => ({ '@type': 'Person', '@id': PERSON_ID, name: 'Patrick Kabia', url: `${BASE}/om/` });
export const FORFATTERLINJE = '<p class="eyebrow">Av <a href="/om/">Patrick Kabia</a>, kjøletekniker</p>';

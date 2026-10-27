// Engelsk er internasjonalt (ingen region), derfor bare «en».
export const SPRAKKODER = Object.freeze({ nb: 'nb-NO', sv: 'sv-SE', da: 'da-DK', en: 'en' });
export const SPRAKREKKEFOLGE = Object.freeze(Object.keys(SPRAKKODER));

// Én kilde for sider som faktisk dekker samme funksjon eller hensikt.
// x-default peker på engelsk når det finnes (besøkende med andre språk), ellers på
// bokmål, ellers på gruppens første språk.
export const SIDEGRUPPER = Object.freeze([
  { id: 'forside', sider: { nb: '/', sv: '/sv/', da: '/da/', en: '/en/' } },
  { id: 'importer-oppskrifter', sider: { nb: '/importer-oppskrifter/', sv: '/sv/importera-recept/', da: '/da/importer-opskrifter/', en: '/en/import-recipes/' } },
  { id: 'finn-oppskrifter', sider: { nb: '/finn-oppskrifter/', sv: '/sv/hitta-recept/', da: '/da/find-opskrifter/' } },
  { id: 'handleliste', sider: { nb: '/handleliste/', sv: '/sv/inkopslista/', da: '/da/indkoebsliste-app/' } },
  { id: 'handskrevne-oppskrifter', sider: { nb: '/handskrevne-oppskrifter/', sv: '/sv/handskrivna-recept/', da: '/da/haandskrevne-opskrifter/', en: '/en/import-recipes-from-photos/' } },
  { id: 'oppskrifter-fra-ingredienser', sider: { nb: '/hva-kan-jeg-lage/', sv: '/sv/recept-pa-ingredienser/', da: '/da/opskrifter-ud-fra-ingredienser/' } },
  { id: 'middagsforslag', sider: { nb: '/middagsforslag/', sv: '/sv/vad-ska-jag-laga/', da: '/da/middagsforslag/' } },
  { id: 'ukemeny', sider: { nb: '/ukemeny/', sv: '/sv/veckomeny-app/', da: '/da/madplan-app/' } },
  { id: 'bytt-fra-paprika', sider: { nb: '/bytt-fra-paprika/', sv: '/sv/byt-fran-paprika/', da: '/da/skift-fra-paprika/', en: '/en/import-recipes-from-paprika/' } },
  { id: 'skapere', sider: { nb: '/skapere/', sv: '/sv/receptskapare/', da: '/da/opskriftsskabere/' } },
  { id: 'personvern', sider: { nb: '/personvern.html', sv: '/sv/integritet/', da: '/da/privatliv/', en: '/en/privacy/' } },
  { id: 'vilkar', sider: { nb: '/vilkar.html', sv: '/sv/villkor/', da: '/da/vilkaar/', en: '/en/terms/' } },
  { id: 'slett-konto', sider: { nb: '/slett-konto.html', sv: '/sv/radera-konto/', da: '/da/slet-konto/' } },
  { id: 'avmeld', redirect: false, sider: { nb: '/avmeld/', sv: '/sv/avregistrera/', da: '/da/afmeld/', en: '/en/unsubscribe/' } },
  { id: 'tiktok-stotte', sider: { nb: '/tiktok/', sv: '/sv/tiktok/', da: '/da/tiktok/' } },
  { id: 'tiktok-auth', redirect: false, sider: { nb: '/tiktok-auth/', sv: '/sv/tiktok-auth/', da: '/da/tiktok-auth/' } },

  { id: 'oppskrifts-app', sider: { sv: '/sv/receptbok-app/', da: '/da/opskrifts-app/' } },
  { id: 'instagram-oppskrifter', sider: { nb: '/lagre-oppskrifter-fra-instagram/', sv: '/sv/spara-recept-fran-instagram/', da: '/da/gem-opskrifter-fra-instagram/', en: '/en/import-recipes-from-instagram/' } },
  { id: 'tiktok-oppskrifter', sider: { nb: '/lagre-oppskrifter-fra-tiktok/', sv: '/sv/spara-recept-fran-tiktok/', da: '/da/gem-opskrifter-fra-tiktok/', en: '/en/import-recipes-from-tiktok/' } },
  { id: 'spiskammer', sider: { sv: '/sv/skafferi-app/', da: '/da/spisekammer-app/' } },
  { id: 'tom-kjoleskapet', sider: { sv: '/sv/tom-kylskapet/', da: '/da/toem-koeleskabet/' } },
  { id: 'enkel-middag', sider: { sv: '/sv/enkel-middag/', da: '/da/nem-mad/' } },

  { id: 'matprat', sider: { nb: '/importer-fra-matprat/' } },
  { id: 'christine', sider: { nb: '/christine/' } },
  { id: 'sara', sider: { nb: '/sara/' } },
  { id: 'koket', sider: { sv: '/sv/koket/' } },
  { id: 'landleys-kok', sider: { sv: '/sv/landleys-kok/' } },
  { id: 'alletiders-kogebog', sider: { da: '/da/alletiders-kogebog/' } },
  { id: 'dr-mad', sider: { da: '/da/dr-mad/' } },
]);

const GRUPPE_FOR_STI = new Map(SIDEGRUPPER.flatMap((gruppe) =>
  Object.values(gruppe.sider).map((sti) => [sti, gruppe])));

export function gruppeForSti(sti) {
  return GRUPPE_FOR_STI.get(sti) ?? null;
}

export function alternativerFor(sti) {
  const gruppe = gruppeForSti(sti);
  if (!gruppe) throw new Error(`Mangler sidegruppe for ${sti}`);
  const alternativer = SPRAKREKKEFOLGE
    .filter((sprak) => gruppe.sider[sprak])
    .map((sprak) => [SPRAKKODER[sprak], gruppe.sider[sprak]]);
  const standard = ['en', ...SPRAKREKKEFOLGE].find((sprak) => gruppe.sider[sprak]);
  return [...alternativer, ['x-default', gruppe.sider[standard]]];
}

export function byggLocalePageMap() {
  const kart = {};
  for (const gruppe of SIDEGRUPPER) {
    if (gruppe.redirect === false || Object.keys(gruppe.sider).length < 2) continue;
    const rad = Object.fromEntries(SPRAKREKKEFOLGE
      .filter((sprak) => gruppe.sider[sprak])
      .map((sprak) => [sprak, gruppe.sider[sprak]]));
    for (const sti of Object.values(gruppe.sider)) {
      kart[sti] = rad;
      if (sti.endsWith('.html')) kart[sti.slice(0, -'.html'.length)] = rad;
      if (sti === '/') kart['/index.html'] = rad;
    }
  }
  return Object.fromEntries(Object.entries(kart).sort(([a], [b]) => a.localeCompare(b)));
}

export function filForSti(sti) {
  if (sti === '/') return 'index.html';
  if (sti.endsWith('.html')) return sti.slice(1);
  return `${sti.slice(1)}index.html`;
}

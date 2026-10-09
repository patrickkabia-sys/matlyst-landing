const SPRAKKODER = Object.freeze({ nb: 'nb-NO', sv: 'sv-SE', da: 'da-DK' });
const SPRAKREKKEFOLGE = Object.freeze(['nb', 'sv', 'da']);

// Én kilde for sider som faktisk dekker samme funksjon eller hensikt.
// x-default peker på bokmål når det finnes, ellers på gruppens første språk.
export const SIDEGRUPPER = Object.freeze([
  { id: 'forside', sider: { nb: '/', sv: '/sv/', da: '/da/' } },
  { id: 'importer-oppskrifter', sider: { nb: '/importer-oppskrifter/', sv: '/sv/importera-recept/', da: '/da/importer-opskrifter/' } },
  { id: 'finn-oppskrifter', sider: { nb: '/finn-oppskrifter/', sv: '/sv/hitta-recept/', da: '/da/find-opskrifter/' } },
  { id: 'handleliste', sider: { nb: '/handleliste/', sv: '/sv/inkopslista/', da: '/da/indkoebsliste-app/' } },
  { id: 'handskrevne-oppskrifter', sider: { nb: '/handskrevne-oppskrifter/', sv: '/sv/handskrivna-recept/', da: '/da/haandskrevne-opskrifter/' } },
  { id: 'oppskrifter-fra-ingredienser', sider: { nb: '/hva-kan-jeg-lage/', sv: '/sv/recept-pa-ingredienser/', da: '/da/opskrifter-ud-fra-ingredienser/' } },
  { id: 'middagsforslag', sider: { nb: '/middagsforslag/', sv: '/sv/vad-ska-jag-laga/', da: '/da/middagsforslag/' } },
  { id: 'ukemeny', sider: { nb: '/ukemeny/', sv: '/sv/veckomeny-app/', da: '/da/madplan-app/' } },
  { id: 'bytt-fra-paprika', sider: { nb: '/bytt-fra-paprika/', sv: '/sv/byt-fran-paprika/', da: '/da/skift-fra-paprika/' } },
  { id: 'skapere', sider: { nb: '/skapere/', sv: '/sv/receptskapare/', da: '/da/opskriftsskabere/' } },
  { id: 'personvern', sider: { nb: '/personvern.html', sv: '/sv/integritet/', da: '/da/privatliv/' } },
  { id: 'vilkar', sider: { nb: '/vilkar.html', sv: '/sv/villkor/', da: '/da/vilkaar/' } },
  { id: 'slett-konto', sider: { nb: '/slett-konto.html', sv: '/sv/radera-konto/', da: '/da/slet-konto/' } },
  { id: 'avmeld', redirect: false, sider: { nb: '/avmeld/', sv: '/sv/avregistrera/', da: '/da/afmeld/' } },
  { id: 'tiktok-stotte', sider: { nb: '/tiktok/', sv: '/sv/tiktok/', da: '/da/tiktok/' } },
  { id: 'tiktok-auth', redirect: false, sider: { nb: '/tiktok-auth/', sv: '/sv/tiktok-auth/', da: '/da/tiktok-auth/' } },

  { id: 'oppskrifts-app', sider: { sv: '/sv/receptbok-app/', da: '/da/opskrifts-app/' } },
  { id: 'instagram-oppskrifter', sider: { sv: '/sv/spara-recept-fran-instagram/', da: '/da/gem-opskrifter-fra-instagram/' } },
  { id: 'tiktok-oppskrifter', sider: { sv: '/sv/spara-recept-fran-tiktok/', da: '/da/gem-opskrifter-fra-tiktok/' } },
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
  return [...alternativer, ['x-default', gruppe.sider.nb ?? gruppe.sider.sv ?? gruppe.sider.da]];
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

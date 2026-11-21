// Engelsk er internasjonalt (ingen region), derfor bare «en».
import { bloggGrupper } from './blogg.mjs';
import { allePar, parSti } from './enheter.mjs';
import { familieGrupper } from './familier/register.mjs';

export const SPRAKKODER = Object.freeze({ nb: 'nb-NO', sv: 'sv-SE', da: 'da-DK', en: 'en' });
export const SPRAKREKKEFOLGE = Object.freeze(Object.keys(SPRAKKODER));

// Én kilde for sider som faktisk dekker samme funksjon eller hensikt.
// x-default peker på engelsk når det finnes (besøkende med andre språk), ellers på
// bokmål, ellers på gruppens første språk.
// Én sidegruppe per enhetspar på tvers av språk (samme innhold, ulike adresser).
function enhetsGrupper() {
  const prefiks = { en: '/en/', nb: '/', sv: '/sv/', da: '/da/' };
  const kart = new Map();
  for (const lang of ['en', 'nb', 'sv', 'da']) {
    for (const [fra, til] of allePar(lang)) {
      const nokkel = `${fra}>${til}`;
      const g = kart.get(nokkel) ?? { id: `auto-enhet-${fra}-${til}`, sider: {} };
      g.sider[lang] = `${prefiks[lang]}${parSti(fra, til, lang)}`;
      kart.set(nokkel, g);
    }
  }
  return [...kart.values()];
}

export const SIDEGRUPPER = Object.freeze([
  { id: 'forside', sider: { nb: '/', sv: '/sv/', da: '/da/', en: '/en/' } },
  { id: 'importer-oppskrifter', sider: { nb: '/importer-oppskrifter/', sv: '/sv/importera-recept/', da: '/da/importer-opskrifter/', en: '/en/import-recipes/' } },
  { id: 'finn-oppskrifter', sider: { nb: '/finn-oppskrifter/', sv: '/sv/hitta-recept/', da: '/da/find-opskrifter/', en: '/en/find-recipes/' } },
  { id: 'handleliste', sider: { nb: '/handleliste/', sv: '/sv/inkopslista/', da: '/da/indkoebsliste-app/', en: '/en/shopping-list/' } },
  { id: 'handskrevne-oppskrifter', sider: { nb: '/handskrevne-oppskrifter/', sv: '/sv/handskrivna-recept/', da: '/da/haandskrevne-opskrifter/', en: '/en/import-recipes-from-photos/' } },
  { id: 'oppskrifter-fra-ingredienser', sider: { nb: '/hva-kan-jeg-lage/', sv: '/sv/recept-pa-ingredienser/', da: '/da/opskrifter-ud-fra-ingredienser/', en: '/en/recipes-by-ingredients/' } },
  { id: 'middagsforslag', sider: { nb: '/middagsforslag/', sv: '/sv/vad-ska-jag-laga/', da: '/da/middagsforslag/', en: '/en/dinner-ideas/' } },
  { id: 'ukemeny', sider: { nb: '/ukemeny/', sv: '/sv/veckomeny-app/', da: '/da/madplan-app/', en: '/en/meal-plan-app/' } },
  { id: 'bytt-fra-paprika', sider: { nb: '/bytt-fra-paprika/', sv: '/sv/byt-fran-paprika/', da: '/da/skift-fra-paprika/', en: '/en/import-recipes-from-paprika/' } },
  { id: 'skapere', sider: { nb: '/skapere/', sv: '/sv/receptskapare/', da: '/da/opskriftsskabere/', en: '/en/recipe-creators/' } },
  { id: 'personvern', sider: { nb: '/personvern.html', sv: '/sv/integritet/', da: '/da/privatliv/', en: '/en/privacy/' } },
  { id: 'vilkar', sider: { nb: '/vilkar.html', sv: '/sv/villkor/', da: '/da/vilkaar/', en: '/en/terms/' } },
  { id: 'slett-konto', sider: { nb: '/slett-konto.html', sv: '/sv/radera-konto/', da: '/da/slet-konto/', en: '/en/delete-account/' } },
  { id: 'avmeld', redirect: false, sider: { nb: '/avmeld/', sv: '/sv/avregistrera/', da: '/da/afmeld/', en: '/en/unsubscribe/' } },
  { id: 'tiktok-stotte', sider: { nb: '/tiktok/', sv: '/sv/tiktok/', da: '/da/tiktok/', en: '/en/tiktok/' } },
  { id: 'tiktok-auth', redirect: false, sider: { nb: '/tiktok-auth/', sv: '/sv/tiktok-auth/', da: '/da/tiktok-auth/', en: '/en/tiktok-auth/' } },

  { id: 'oppskrifts-app', sider: { nb: '/oppskriftsbok-app/', sv: '/sv/receptbok-app/', da: '/da/opskrifts-app/', en: '/en/recipe-book-app/' } },
  { id: 'instagram-oppskrifter', sider: { nb: '/lagre-oppskrifter-fra-instagram/', sv: '/sv/spara-recept-fran-instagram/', da: '/da/gem-opskrifter-fra-instagram/', en: '/en/import-recipes-from-instagram/' } },
  { id: 'tiktok-oppskrifter', sider: { nb: '/lagre-oppskrifter-fra-tiktok/', sv: '/sv/spara-recept-fran-tiktok/', da: '/da/gem-opskrifter-fra-tiktok/', en: '/en/import-recipes-from-tiktok/' } },
  { id: 'spiskammer', sider: { nb: '/spiskammer-app/', sv: '/sv/skafferi-app/', da: '/da/spisekammer-app/', en: '/en/pantry-app/' } },
  { id: 'tom-kjoleskapet', sider: { nb: '/tom-kjoleskapet/', sv: '/sv/tom-kylskapet/', da: '/da/toem-koeleskabet/', en: '/en/empty-the-fridge/' } },
  { id: 'auto-velg-oppskriftsapp', sider: { nb: '/blogg/velg-oppskriftsapp/', sv: '/sv/blogg/valj-receptapp/', da: '/da/blog/vaelg-opskriftsapp/', en: '/en/blog/choose-recipe-organizer-app/' } },
  { id: 'auto-hoytid-thanksgiving', sider: { en: '/en/holidays/thanksgiving/' } },
  { id: 'auto-hoytid-thanksgiving-leftovers', sider: { en: '/en/holidays/thanksgiving-leftovers/' } },
  { id: 'auto-hoytid-christmas-dinner', sider: { en: '/en/holidays/christmas-dinner/' } },
  { id: 'auto-hoytid-hanukkah', sider: { en: '/en/holidays/hanukkah/' } },
  { id: 'auto-hoytid-new-years-eve', sider: { en: '/en/holidays/new-years-eve/' } },
  { id: 'auto-hoytid-friendsgiving', sider: { en: '/en/holidays/friendsgiving/' } },
  { id: 'auto-hoytider', sider: { en: '/en/holidays/' } },
  // Flytteside for tidligere Mealime-brukere: bare engelsk (USA). «auto-»-prefikset gir variabel språkdekning i hreflang-testen.
  { id: 'auto-mealime-alternative', sider: { en: '/en/mealime-alternative/' } },
  // Bare norsk: julemiddagsplanen og om-siden. «auto-»-prefikset gir variabel språkdekning i hreflang-testen.
  { id: 'auto-julemiddag', sider: { nb: '/julemiddag/' } },
  { id: 'auto-om', sider: { nb: '/om/' } },
  // Bare norsk: de nøytrale sammenligningssidene (scripts/nb-sammenligning/).
  { id: 'auto-beste-oppskriftsapp', sider: { nb: '/beste-oppskriftsapp/' } },
  { id: 'auto-beste-handleliste-app', sider: { nb: '/beste-handleliste-app/' } },
  { id: 'auto-beste-ukemeny-app', sider: { nb: '/beste-ukemeny-app/' } },
  { id: 'enkel-middag', sider: { nb: '/enkel-middag/', sv: '/sv/enkel-middag/', da: '/da/nem-mad/', en: '/en/easy-dinner/' } },

  { id: 'matprat', sider: { nb: '/importer-fra-matprat/', sv: '/sv/matprat/', da: '/da/matprat/', en: '/en/matprat/' } },
  { id: 'christine', sider: { nb: '/christine/' } },
  { id: 'koket', sider: { nb: '/importer-fra-koket/', sv: '/sv/koket/', da: '/da/koket/', en: '/en/koket/' } },
  { id: 'landleys-kok', sider: { nb: '/importer-fra-landleys-kok/', sv: '/sv/landleys-kok/', da: '/da/landleys-kok/', en: '/en/landleys-kok/' } },
  { id: 'alletiders-kogebog', sider: { nb: '/importer-fra-alletiders-kokebok/', sv: '/sv/alletiders-kogebog/', da: '/da/alletiders-kogebog/', en: '/en/alletiders-cookbook/' } },
  { id: 'dr-mad', sider: { nb: '/importer-fra-dr-mat/', sv: '/sv/dr-mad/', da: '/da/dr-mad/', en: '/en/dr-food/' } },
  { id: 'auto-enhetsomregner', sider: { en: '/en/tools/unit-converter/', nb: '/verktoy/enhetsomregner/', sv: '/sv/verktyg/enhetsomvandlare/', da: '/da/vaerktoejer/enhedsomregner/' } },
  ...enhetsGrupper(),
  ...familieGrupper(),
  ...bloggGrupper(),
]);

// Sti til gruppe. Samme sti i to grupper ville overskrevet den ene stille, så det stopper bygget.
export function byggStiOppslag(grupper) {
  const kart = new Map();
  for (const gruppe of grupper) {
    for (const sti of Object.values(gruppe.sider)) {
      if (kart.has(sti)) throw new Error(`Sti i to sidegrupper: ${sti} står i både «${kart.get(sti).id}» og «${gruppe.id}»`);
      kart.set(sti, gruppe);
    }
  }
  return kart;
}

const GRUPPE_FOR_STI = byggStiOppslag(SIDEGRUPPER);

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

export function filForSti(sti) {
  if (sti === '/') return 'index.html';
  if (sti.endsWith('.html')) return sti.slice(1);
  return `${sti.slice(1)}index.html`;
}

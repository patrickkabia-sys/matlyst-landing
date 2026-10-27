(function (global) {
  'use strict';

  var STORAGE_KEY = 'matlyst-sprak';
  // Generert av scripts/generer-lokalsider.mjs fra hreflang-parene. Ikke rediger for hånd.
  // Rekkefølge: ?sprak= vinner og lagres, deretter lagret valg, deretter nettleserens språk.
  var LOCALE_PAGE_MAP = Object.freeze({
    "/": {"nb": "/", "sv": "/sv/", "da": "/da/", "en": "/en/"},
    "/bytt-fra-paprika/": {"nb": "/bytt-fra-paprika/", "sv": "/sv/byt-fran-paprika/", "da": "/da/skift-fra-paprika/", "en": "/en/import-recipes-from-paprika/"},
    "/da/": {"nb": "/", "sv": "/sv/", "da": "/da/", "en": "/en/"},
    "/da/alletiders-kogebog/": {"nb": "/importer-fra-alletiders-kokebok/", "sv": "/sv/alletiders-kogebog/", "da": "/da/alletiders-kogebog/", "en": "/en/alletiders-cookbook/"},
    "/da/dr-mad/": {"nb": "/importer-fra-dr-mat/", "sv": "/sv/dr-mad/", "da": "/da/dr-mad/", "en": "/en/dr-food/"},
    "/da/find-opskrifter/": {"nb": "/finn-oppskrifter/", "sv": "/sv/hitta-recept/", "da": "/da/find-opskrifter/", "en": "/en/find-recipes/"},
    "/da/gem-opskrifter-fra-instagram/": {"nb": "/lagre-oppskrifter-fra-instagram/", "sv": "/sv/spara-recept-fran-instagram/", "da": "/da/gem-opskrifter-fra-instagram/", "en": "/en/import-recipes-from-instagram/"},
    "/da/gem-opskrifter-fra-tiktok/": {"nb": "/lagre-oppskrifter-fra-tiktok/", "sv": "/sv/spara-recept-fran-tiktok/", "da": "/da/gem-opskrifter-fra-tiktok/", "en": "/en/import-recipes-from-tiktok/"},
    "/da/haandskrevne-opskrifter/": {"nb": "/handskrevne-oppskrifter/", "sv": "/sv/handskrivna-recept/", "da": "/da/haandskrevne-opskrifter/", "en": "/en/import-recipes-from-photos/"},
    "/da/importer-opskrifter/": {"nb": "/importer-oppskrifter/", "sv": "/sv/importera-recept/", "da": "/da/importer-opskrifter/", "en": "/en/import-recipes/"},
    "/da/indkoebsliste-app/": {"nb": "/handleliste/", "sv": "/sv/inkopslista/", "da": "/da/indkoebsliste-app/", "en": "/en/shopping-list/"},
    "/da/koket/": {"nb": "/importer-fra-koket/", "sv": "/sv/koket/", "da": "/da/koket/", "en": "/en/koket/"},
    "/da/landleys-kok/": {"nb": "/importer-fra-landleys-kok/", "sv": "/sv/landleys-kok/", "da": "/da/landleys-kok/", "en": "/en/landleys-kok/"},
    "/da/madplan-app/": {"nb": "/ukemeny/", "sv": "/sv/veckomeny-app/", "da": "/da/madplan-app/", "en": "/en/meal-plan-app/"},
    "/da/matprat/": {"nb": "/importer-fra-matprat/", "sv": "/sv/matprat/", "da": "/da/matprat/", "en": "/en/matprat/"},
    "/da/middagsforslag/": {"nb": "/middagsforslag/", "sv": "/sv/vad-ska-jag-laga/", "da": "/da/middagsforslag/", "en": "/en/dinner-ideas/"},
    "/da/nem-mad/": {"nb": "/enkel-middag/", "sv": "/sv/enkel-middag/", "da": "/da/nem-mad/", "en": "/en/easy-dinner/"},
    "/da/opskrifter-ud-fra-ingredienser/": {"nb": "/hva-kan-jeg-lage/", "sv": "/sv/recept-pa-ingredienser/", "da": "/da/opskrifter-ud-fra-ingredienser/", "en": "/en/recipes-by-ingredients/"},
    "/da/opskrifts-app/": {"nb": "/oppskriftsbok-app/", "sv": "/sv/receptbok-app/", "da": "/da/opskrifts-app/", "en": "/en/recipe-book-app/"},
    "/da/opskriftsskabere/": {"nb": "/skapere/", "sv": "/sv/receptskapare/", "da": "/da/opskriftsskabere/", "en": "/en/recipe-creators/"},
    "/da/privatliv/": {"nb": "/personvern.html", "sv": "/sv/integritet/", "da": "/da/privatliv/", "en": "/en/privacy/"},
    "/da/skift-fra-paprika/": {"nb": "/bytt-fra-paprika/", "sv": "/sv/byt-fran-paprika/", "da": "/da/skift-fra-paprika/", "en": "/en/import-recipes-from-paprika/"},
    "/da/slet-konto/": {"nb": "/slett-konto.html", "sv": "/sv/radera-konto/", "da": "/da/slet-konto/", "en": "/en/delete-account/"},
    "/da/spisekammer-app/": {"nb": "/spiskammer-app/", "sv": "/sv/skafferi-app/", "da": "/da/spisekammer-app/", "en": "/en/pantry-app/"},
    "/da/tiktok/": {"nb": "/tiktok/", "sv": "/sv/tiktok/", "da": "/da/tiktok/", "en": "/en/tiktok/"},
    "/da/toem-koeleskabet/": {"nb": "/tom-kjoleskapet/", "sv": "/sv/tom-kylskapet/", "da": "/da/toem-koeleskabet/", "en": "/en/empty-the-fridge/"},
    "/da/vilkaar/": {"nb": "/vilkar.html", "sv": "/sv/villkor/", "da": "/da/vilkaar/", "en": "/en/terms/"},
    "/en/": {"nb": "/", "sv": "/sv/", "da": "/da/", "en": "/en/"},
    "/en/alletiders-cookbook/": {"nb": "/importer-fra-alletiders-kokebok/", "sv": "/sv/alletiders-kogebog/", "da": "/da/alletiders-kogebog/", "en": "/en/alletiders-cookbook/"},
    "/en/delete-account/": {"nb": "/slett-konto.html", "sv": "/sv/radera-konto/", "da": "/da/slet-konto/", "en": "/en/delete-account/"},
    "/en/dinner-ideas/": {"nb": "/middagsforslag/", "sv": "/sv/vad-ska-jag-laga/", "da": "/da/middagsforslag/", "en": "/en/dinner-ideas/"},
    "/en/dr-food/": {"nb": "/importer-fra-dr-mat/", "sv": "/sv/dr-mad/", "da": "/da/dr-mad/", "en": "/en/dr-food/"},
    "/en/easy-dinner/": {"nb": "/enkel-middag/", "sv": "/sv/enkel-middag/", "da": "/da/nem-mad/", "en": "/en/easy-dinner/"},
    "/en/empty-the-fridge/": {"nb": "/tom-kjoleskapet/", "sv": "/sv/tom-kylskapet/", "da": "/da/toem-koeleskabet/", "en": "/en/empty-the-fridge/"},
    "/en/find-recipes/": {"nb": "/finn-oppskrifter/", "sv": "/sv/hitta-recept/", "da": "/da/find-opskrifter/", "en": "/en/find-recipes/"},
    "/en/import-recipes-from-instagram/": {"nb": "/lagre-oppskrifter-fra-instagram/", "sv": "/sv/spara-recept-fran-instagram/", "da": "/da/gem-opskrifter-fra-instagram/", "en": "/en/import-recipes-from-instagram/"},
    "/en/import-recipes-from-paprika/": {"nb": "/bytt-fra-paprika/", "sv": "/sv/byt-fran-paprika/", "da": "/da/skift-fra-paprika/", "en": "/en/import-recipes-from-paprika/"},
    "/en/import-recipes-from-photos/": {"nb": "/handskrevne-oppskrifter/", "sv": "/sv/handskrivna-recept/", "da": "/da/haandskrevne-opskrifter/", "en": "/en/import-recipes-from-photos/"},
    "/en/import-recipes-from-tiktok/": {"nb": "/lagre-oppskrifter-fra-tiktok/", "sv": "/sv/spara-recept-fran-tiktok/", "da": "/da/gem-opskrifter-fra-tiktok/", "en": "/en/import-recipes-from-tiktok/"},
    "/en/import-recipes/": {"nb": "/importer-oppskrifter/", "sv": "/sv/importera-recept/", "da": "/da/importer-opskrifter/", "en": "/en/import-recipes/"},
    "/en/koket/": {"nb": "/importer-fra-koket/", "sv": "/sv/koket/", "da": "/da/koket/", "en": "/en/koket/"},
    "/en/landleys-kok/": {"nb": "/importer-fra-landleys-kok/", "sv": "/sv/landleys-kok/", "da": "/da/landleys-kok/", "en": "/en/landleys-kok/"},
    "/en/matprat/": {"nb": "/importer-fra-matprat/", "sv": "/sv/matprat/", "da": "/da/matprat/", "en": "/en/matprat/"},
    "/en/meal-plan-app/": {"nb": "/ukemeny/", "sv": "/sv/veckomeny-app/", "da": "/da/madplan-app/", "en": "/en/meal-plan-app/"},
    "/en/pantry-app/": {"nb": "/spiskammer-app/", "sv": "/sv/skafferi-app/", "da": "/da/spisekammer-app/", "en": "/en/pantry-app/"},
    "/en/privacy/": {"nb": "/personvern.html", "sv": "/sv/integritet/", "da": "/da/privatliv/", "en": "/en/privacy/"},
    "/en/recipe-book-app/": {"nb": "/oppskriftsbok-app/", "sv": "/sv/receptbok-app/", "da": "/da/opskrifts-app/", "en": "/en/recipe-book-app/"},
    "/en/recipe-creators/": {"nb": "/skapere/", "sv": "/sv/receptskapare/", "da": "/da/opskriftsskabere/", "en": "/en/recipe-creators/"},
    "/en/recipes-by-ingredients/": {"nb": "/hva-kan-jeg-lage/", "sv": "/sv/recept-pa-ingredienser/", "da": "/da/opskrifter-ud-fra-ingredienser/", "en": "/en/recipes-by-ingredients/"},
    "/en/shopping-list/": {"nb": "/handleliste/", "sv": "/sv/inkopslista/", "da": "/da/indkoebsliste-app/", "en": "/en/shopping-list/"},
    "/en/terms/": {"nb": "/vilkar.html", "sv": "/sv/villkor/", "da": "/da/vilkaar/", "en": "/en/terms/"},
    "/en/tiktok/": {"nb": "/tiktok/", "sv": "/sv/tiktok/", "da": "/da/tiktok/", "en": "/en/tiktok/"},
    "/enkel-middag/": {"nb": "/enkel-middag/", "sv": "/sv/enkel-middag/", "da": "/da/nem-mad/", "en": "/en/easy-dinner/"},
    "/finn-oppskrifter/": {"nb": "/finn-oppskrifter/", "sv": "/sv/hitta-recept/", "da": "/da/find-opskrifter/", "en": "/en/find-recipes/"},
    "/handleliste/": {"nb": "/handleliste/", "sv": "/sv/inkopslista/", "da": "/da/indkoebsliste-app/", "en": "/en/shopping-list/"},
    "/handskrevne-oppskrifter/": {"nb": "/handskrevne-oppskrifter/", "sv": "/sv/handskrivna-recept/", "da": "/da/haandskrevne-opskrifter/", "en": "/en/import-recipes-from-photos/"},
    "/hva-kan-jeg-lage/": {"nb": "/hva-kan-jeg-lage/", "sv": "/sv/recept-pa-ingredienser/", "da": "/da/opskrifter-ud-fra-ingredienser/", "en": "/en/recipes-by-ingredients/"},
    "/importer-fra-alletiders-kokebok/": {"nb": "/importer-fra-alletiders-kokebok/", "sv": "/sv/alletiders-kogebog/", "da": "/da/alletiders-kogebog/", "en": "/en/alletiders-cookbook/"},
    "/importer-fra-dr-mat/": {"nb": "/importer-fra-dr-mat/", "sv": "/sv/dr-mad/", "da": "/da/dr-mad/", "en": "/en/dr-food/"},
    "/importer-fra-koket/": {"nb": "/importer-fra-koket/", "sv": "/sv/koket/", "da": "/da/koket/", "en": "/en/koket/"},
    "/importer-fra-landleys-kok/": {"nb": "/importer-fra-landleys-kok/", "sv": "/sv/landleys-kok/", "da": "/da/landleys-kok/", "en": "/en/landleys-kok/"},
    "/importer-fra-matprat/": {"nb": "/importer-fra-matprat/", "sv": "/sv/matprat/", "da": "/da/matprat/", "en": "/en/matprat/"},
    "/importer-oppskrifter/": {"nb": "/importer-oppskrifter/", "sv": "/sv/importera-recept/", "da": "/da/importer-opskrifter/", "en": "/en/import-recipes/"},
    "/index.html": {"nb": "/", "sv": "/sv/", "da": "/da/", "en": "/en/"},
    "/lagre-oppskrifter-fra-instagram/": {"nb": "/lagre-oppskrifter-fra-instagram/", "sv": "/sv/spara-recept-fran-instagram/", "da": "/da/gem-opskrifter-fra-instagram/", "en": "/en/import-recipes-from-instagram/"},
    "/lagre-oppskrifter-fra-tiktok/": {"nb": "/lagre-oppskrifter-fra-tiktok/", "sv": "/sv/spara-recept-fran-tiktok/", "da": "/da/gem-opskrifter-fra-tiktok/", "en": "/en/import-recipes-from-tiktok/"},
    "/middagsforslag/": {"nb": "/middagsforslag/", "sv": "/sv/vad-ska-jag-laga/", "da": "/da/middagsforslag/", "en": "/en/dinner-ideas/"},
    "/oppskriftsbok-app/": {"nb": "/oppskriftsbok-app/", "sv": "/sv/receptbok-app/", "da": "/da/opskrifts-app/", "en": "/en/recipe-book-app/"},
    "/personvern": {"nb": "/personvern.html", "sv": "/sv/integritet/", "da": "/da/privatliv/", "en": "/en/privacy/"},
    "/personvern.html": {"nb": "/personvern.html", "sv": "/sv/integritet/", "da": "/da/privatliv/", "en": "/en/privacy/"},
    "/skapere/": {"nb": "/skapere/", "sv": "/sv/receptskapare/", "da": "/da/opskriftsskabere/", "en": "/en/recipe-creators/"},
    "/slett-konto": {"nb": "/slett-konto.html", "sv": "/sv/radera-konto/", "da": "/da/slet-konto/", "en": "/en/delete-account/"},
    "/slett-konto.html": {"nb": "/slett-konto.html", "sv": "/sv/radera-konto/", "da": "/da/slet-konto/", "en": "/en/delete-account/"},
    "/spiskammer-app/": {"nb": "/spiskammer-app/", "sv": "/sv/skafferi-app/", "da": "/da/spisekammer-app/", "en": "/en/pantry-app/"},
    "/sv/": {"nb": "/", "sv": "/sv/", "da": "/da/", "en": "/en/"},
    "/sv/alletiders-kogebog/": {"nb": "/importer-fra-alletiders-kokebok/", "sv": "/sv/alletiders-kogebog/", "da": "/da/alletiders-kogebog/", "en": "/en/alletiders-cookbook/"},
    "/sv/byt-fran-paprika/": {"nb": "/bytt-fra-paprika/", "sv": "/sv/byt-fran-paprika/", "da": "/da/skift-fra-paprika/", "en": "/en/import-recipes-from-paprika/"},
    "/sv/dr-mad/": {"nb": "/importer-fra-dr-mat/", "sv": "/sv/dr-mad/", "da": "/da/dr-mad/", "en": "/en/dr-food/"},
    "/sv/enkel-middag/": {"nb": "/enkel-middag/", "sv": "/sv/enkel-middag/", "da": "/da/nem-mad/", "en": "/en/easy-dinner/"},
    "/sv/handskrivna-recept/": {"nb": "/handskrevne-oppskrifter/", "sv": "/sv/handskrivna-recept/", "da": "/da/haandskrevne-opskrifter/", "en": "/en/import-recipes-from-photos/"},
    "/sv/hitta-recept/": {"nb": "/finn-oppskrifter/", "sv": "/sv/hitta-recept/", "da": "/da/find-opskrifter/", "en": "/en/find-recipes/"},
    "/sv/importera-recept/": {"nb": "/importer-oppskrifter/", "sv": "/sv/importera-recept/", "da": "/da/importer-opskrifter/", "en": "/en/import-recipes/"},
    "/sv/inkopslista/": {"nb": "/handleliste/", "sv": "/sv/inkopslista/", "da": "/da/indkoebsliste-app/", "en": "/en/shopping-list/"},
    "/sv/integritet/": {"nb": "/personvern.html", "sv": "/sv/integritet/", "da": "/da/privatliv/", "en": "/en/privacy/"},
    "/sv/koket/": {"nb": "/importer-fra-koket/", "sv": "/sv/koket/", "da": "/da/koket/", "en": "/en/koket/"},
    "/sv/landleys-kok/": {"nb": "/importer-fra-landleys-kok/", "sv": "/sv/landleys-kok/", "da": "/da/landleys-kok/", "en": "/en/landleys-kok/"},
    "/sv/matprat/": {"nb": "/importer-fra-matprat/", "sv": "/sv/matprat/", "da": "/da/matprat/", "en": "/en/matprat/"},
    "/sv/radera-konto/": {"nb": "/slett-konto.html", "sv": "/sv/radera-konto/", "da": "/da/slet-konto/", "en": "/en/delete-account/"},
    "/sv/recept-pa-ingredienser/": {"nb": "/hva-kan-jeg-lage/", "sv": "/sv/recept-pa-ingredienser/", "da": "/da/opskrifter-ud-fra-ingredienser/", "en": "/en/recipes-by-ingredients/"},
    "/sv/receptbok-app/": {"nb": "/oppskriftsbok-app/", "sv": "/sv/receptbok-app/", "da": "/da/opskrifts-app/", "en": "/en/recipe-book-app/"},
    "/sv/receptskapare/": {"nb": "/skapere/", "sv": "/sv/receptskapare/", "da": "/da/opskriftsskabere/", "en": "/en/recipe-creators/"},
    "/sv/skafferi-app/": {"nb": "/spiskammer-app/", "sv": "/sv/skafferi-app/", "da": "/da/spisekammer-app/", "en": "/en/pantry-app/"},
    "/sv/spara-recept-fran-instagram/": {"nb": "/lagre-oppskrifter-fra-instagram/", "sv": "/sv/spara-recept-fran-instagram/", "da": "/da/gem-opskrifter-fra-instagram/", "en": "/en/import-recipes-from-instagram/"},
    "/sv/spara-recept-fran-tiktok/": {"nb": "/lagre-oppskrifter-fra-tiktok/", "sv": "/sv/spara-recept-fran-tiktok/", "da": "/da/gem-opskrifter-fra-tiktok/", "en": "/en/import-recipes-from-tiktok/"},
    "/sv/tiktok/": {"nb": "/tiktok/", "sv": "/sv/tiktok/", "da": "/da/tiktok/", "en": "/en/tiktok/"},
    "/sv/tom-kylskapet/": {"nb": "/tom-kjoleskapet/", "sv": "/sv/tom-kylskapet/", "da": "/da/toem-koeleskabet/", "en": "/en/empty-the-fridge/"},
    "/sv/vad-ska-jag-laga/": {"nb": "/middagsforslag/", "sv": "/sv/vad-ska-jag-laga/", "da": "/da/middagsforslag/", "en": "/en/dinner-ideas/"},
    "/sv/veckomeny-app/": {"nb": "/ukemeny/", "sv": "/sv/veckomeny-app/", "da": "/da/madplan-app/", "en": "/en/meal-plan-app/"},
    "/sv/villkor/": {"nb": "/vilkar.html", "sv": "/sv/villkor/", "da": "/da/vilkaar/", "en": "/en/terms/"},
    "/tiktok/": {"nb": "/tiktok/", "sv": "/sv/tiktok/", "da": "/da/tiktok/", "en": "/en/tiktok/"},
    "/tom-kjoleskapet/": {"nb": "/tom-kjoleskapet/", "sv": "/sv/tom-kylskapet/", "da": "/da/toem-koeleskabet/", "en": "/en/empty-the-fridge/"},
    "/ukemeny/": {"nb": "/ukemeny/", "sv": "/sv/veckomeny-app/", "da": "/da/madplan-app/", "en": "/en/meal-plan-app/"},
    "/vilkar": {"nb": "/vilkar.html", "sv": "/sv/villkor/", "da": "/da/vilkaar/", "en": "/en/terms/"},
    "/vilkar.html": {"nb": "/vilkar.html", "sv": "/sv/villkor/", "da": "/da/vilkaar/", "en": "/en/terms/"},
  });

  var DECISION_KEY = 'matlyst-sprak-vurdert';

  function normaliserSprak(verdi) {
    var kode = String(verdi || '').toLowerCase().split('-')[0];
    if (kode === 'sv' || kode === 'da' || kode === 'en') return kode;
    if (kode === 'nb' || kode === 'nn' || kode === 'no') return 'nb';
    return null;
  }

  // Bare nettleserens primærspråk brukes til førstegangsvalget. Sekundære
  // Accept-Language-verdier skal ikke overstyre siden brukeren ba om.
  function foreslaSprak(verdi) {
    var sprak = normaliserSprak(verdi);
    return sprak === 'sv' || sprak === 'da' ? sprak : null;
  }

  // Søkemotorer omdirigeres ikke automatisk. Klientkontrollen skjer først
  // etter at siden er lastet; hreflang og x-default styrer indekseringen.
  var ROBOT = /bot|crawl|spider|slurp|lighthouse/i;

  function finnMaalsti(sti, maalSprak, tabell) {
    var rad = (tabell || LOCALE_PAGE_MAP)[sti];
    return rad && rad[maalSprak] ? rad[maalSprak] : null;
  }

  function erNorskSide(sti, tabell) {
    var rad = (tabell || LOCALE_PAGE_MAP)[sti];
    return Boolean(rad && rad.nb && !/^\/(?:sv|da|en)(?:\/|$)/i.test(sti));
  }

  function lesCookie(nokkel) {
    if (!global.document) return null;
    var navn = encodeURIComponent(nokkel) + '=';
    var deler = String(global.document.cookie || '').split(';');
    for (var i = 0; i < deler.length; i += 1) {
      var del = deler[i].trim();
      if (del.indexOf(navn) === 0) return decodeURIComponent(del.slice(navn.length));
    }
    return null;
  }

  function lesValg(nokkel) {
    try {
      var verdi = global.localStorage.getItem(nokkel);
      if (verdi) return verdi;
    } catch (e) {}
    return lesCookie(nokkel);
  }

  function lagreValg(nokkel, verdi) {
    try { global.localStorage.setItem(nokkel, verdi); } catch (e) {}
    if (global.document) {
      try {
        global.document.cookie = encodeURIComponent(nokkel) + '=' + encodeURIComponent(verdi)
          + '; Max-Age=31536000; Path=/; SameSite=Lax';
      } catch (e) {}
    }
  }

  function start() {
    if (!global.location || !global.navigator) return;
    if (ROBOT.test(global.navigator.userAgent || '')) return;
    var param = new URLSearchParams(global.location.search).get('sprak');
    var eksplisitt = normaliserSprak(param);
    if (eksplisitt) {
      lagreValg(STORAGE_KEY, eksplisitt);
      lagreValg(DECISION_KEY, '1');
      return;
    }
    if (!erNorskSide(global.location.pathname, LOCALE_PAGE_MAP)) return;
    if (lesValg(DECISION_KEY) || lesValg(STORAGE_KEY)) {
      lagreValg(DECISION_KEY, '1');
      return;
    }

    var valgt = foreslaSprak(global.navigator.language);
    lagreValg(DECISION_KEY, '1');
    if (!valgt) return;
    var maal = finnMaalsti(global.location.pathname, valgt, LOCALE_PAGE_MAP);
    if (!maal || maal === global.location.pathname) return;
    lagreValg(STORAGE_KEY, valgt);
    global.location.replace(maal + global.location.search + global.location.hash);
  }

  global.MatlystLocale = {
    STORAGE_KEY: STORAGE_KEY,
    DECISION_KEY: DECISION_KEY,
    LOCALE_PAGE_MAP: LOCALE_PAGE_MAP,
    normaliserSprak: normaliserSprak,
    foreslaSprak: foreslaSprak,
    finnMaalsti: finnMaalsti,
    erNorskSide: erNorskSide,
  };
  if (global.document && typeof global.addEventListener === 'function') {
    if (global.document.readyState === 'complete') start();
    else global.addEventListener('load', start, { once: true });
  }
})(typeof window === 'undefined' ? globalThis : window);

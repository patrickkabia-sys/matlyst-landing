(function (global) {
  'use strict';

  var STORAGE_KEY = 'matlyst-sprak';
  // Generert av scripts/generer-lokalsider.mjs fra hreflang-parene. Ikke rediger for hånd.
  // Rekkefølge: ?sprak= vinner og lagres, deretter lagret valg, deretter nettleserens språk.
  var LOCALE_PAGE_MAP = Object.freeze({
    "/": {"nb": "/", "sv": "/sv/", "da": "/da/"},
    "/avmeld/": {"nb": "/avmeld/", "sv": "/sv/avregistrera/", "da": "/da/afmeld/"},
    "/bytt-fra-paprika/": {"nb": "/bytt-fra-paprika/", "sv": "/sv/byt-fran-paprika/", "da": "/da/skift-fra-paprika/"},
    "/da/": {"nb": "/", "sv": "/sv/", "da": "/da/"},
    "/da/afmeld/": {"nb": "/avmeld/", "sv": "/sv/avregistrera/", "da": "/da/afmeld/"},
    "/da/find-opskrifter/": {"nb": "/finn-oppskrifter/", "sv": "/sv/hitta-recept/", "da": "/da/find-opskrifter/"},
    "/da/gem-opskrifter-fra-instagram/": {"sv": "/sv/spara-recept-fran-instagram/", "da": "/da/gem-opskrifter-fra-instagram/"},
    "/da/gem-opskrifter-fra-tiktok/": {"sv": "/sv/spara-recept-fran-tiktok/", "da": "/da/gem-opskrifter-fra-tiktok/"},
    "/da/haandskrevne-opskrifter/": {"nb": "/handskrevne-oppskrifter/", "sv": "/sv/handskrivna-recept/", "da": "/da/haandskrevne-opskrifter/"},
    "/da/importer-opskrifter/": {"nb": "/importer-oppskrifter/", "sv": "/sv/importera-recept/", "da": "/da/importer-opskrifter/"},
    "/da/indkoebsliste-app/": {"nb": "/handleliste/", "sv": "/sv/inkopslista/", "da": "/da/indkoebsliste-app/"},
    "/da/madplan-app/": {"nb": "/ukemeny/", "sv": "/sv/veckomeny-app/", "da": "/da/madplan-app/"},
    "/da/middagsforslag/": {"nb": "/middagsforslag/", "sv": "/sv/vad-ska-jag-laga/", "da": "/da/middagsforslag/"},
    "/da/nem-mad/": {"sv": "/sv/enkel-middag/", "da": "/da/nem-mad/"},
    "/da/opskrifter-ud-fra-ingredienser/": {"nb": "/hva-kan-jeg-lage/", "sv": "/sv/recept-pa-ingredienser/", "da": "/da/opskrifter-ud-fra-ingredienser/"},
    "/da/opskrifts-app/": {"sv": "/sv/receptbok-app/", "da": "/da/opskrifts-app/"},
    "/da/opskriftsskabere/": {"nb": "/skapere/", "sv": "/sv/receptskapare/", "da": "/da/opskriftsskabere/"},
    "/da/privatliv/": {"nb": "/personvern.html", "sv": "/sv/integritet/", "da": "/da/privatliv/"},
    "/da/skift-fra-paprika/": {"nb": "/bytt-fra-paprika/", "sv": "/sv/byt-fran-paprika/", "da": "/da/skift-fra-paprika/"},
    "/da/slet-konto/": {"nb": "/slett-konto.html", "sv": "/sv/radera-konto/", "da": "/da/slet-konto/"},
    "/da/spisekammer-app/": {"sv": "/sv/skafferi-app/", "da": "/da/spisekammer-app/"},
    "/da/tiktok/": {"nb": "/tiktok/", "sv": "/sv/tiktok/", "da": "/da/tiktok/"},
    "/da/toem-koeleskabet/": {"sv": "/sv/tom-kylskapet/", "da": "/da/toem-koeleskabet/"},
    "/da/vilkaar/": {"nb": "/vilkar.html", "sv": "/sv/villkor/", "da": "/da/vilkaar/"},
    "/finn-oppskrifter/": {"nb": "/finn-oppskrifter/", "sv": "/sv/hitta-recept/", "da": "/da/find-opskrifter/"},
    "/handleliste/": {"nb": "/handleliste/", "sv": "/sv/inkopslista/", "da": "/da/indkoebsliste-app/"},
    "/handskrevne-oppskrifter/": {"nb": "/handskrevne-oppskrifter/", "sv": "/sv/handskrivna-recept/", "da": "/da/haandskrevne-opskrifter/"},
    "/hva-kan-jeg-lage/": {"nb": "/hva-kan-jeg-lage/", "sv": "/sv/recept-pa-ingredienser/", "da": "/da/opskrifter-ud-fra-ingredienser/"},
    "/importer-oppskrifter/": {"nb": "/importer-oppskrifter/", "sv": "/sv/importera-recept/", "da": "/da/importer-opskrifter/"},
    "/index.html": {"nb": "/", "sv": "/sv/", "da": "/da/"},
    "/middagsforslag/": {"nb": "/middagsforslag/", "sv": "/sv/vad-ska-jag-laga/", "da": "/da/middagsforslag/"},
    "/personvern": {"nb": "/personvern.html", "sv": "/sv/integritet/", "da": "/da/privatliv/"},
    "/personvern.html": {"nb": "/personvern.html", "sv": "/sv/integritet/", "da": "/da/privatliv/"},
    "/skapere/": {"nb": "/skapere/", "sv": "/sv/receptskapare/", "da": "/da/opskriftsskabere/"},
    "/slett-konto": {"nb": "/slett-konto.html", "sv": "/sv/radera-konto/", "da": "/da/slet-konto/"},
    "/slett-konto.html": {"nb": "/slett-konto.html", "sv": "/sv/radera-konto/", "da": "/da/slet-konto/"},
    "/sv/": {"nb": "/", "sv": "/sv/", "da": "/da/"},
    "/sv/avregistrera/": {"nb": "/avmeld/", "sv": "/sv/avregistrera/", "da": "/da/afmeld/"},
    "/sv/byt-fran-paprika/": {"nb": "/bytt-fra-paprika/", "sv": "/sv/byt-fran-paprika/", "da": "/da/skift-fra-paprika/"},
    "/sv/enkel-middag/": {"sv": "/sv/enkel-middag/", "da": "/da/nem-mad/"},
    "/sv/handskrivna-recept/": {"nb": "/handskrevne-oppskrifter/", "sv": "/sv/handskrivna-recept/", "da": "/da/haandskrevne-opskrifter/"},
    "/sv/hitta-recept/": {"nb": "/finn-oppskrifter/", "sv": "/sv/hitta-recept/", "da": "/da/find-opskrifter/"},
    "/sv/importera-recept/": {"nb": "/importer-oppskrifter/", "sv": "/sv/importera-recept/", "da": "/da/importer-opskrifter/"},
    "/sv/inkopslista/": {"nb": "/handleliste/", "sv": "/sv/inkopslista/", "da": "/da/indkoebsliste-app/"},
    "/sv/integritet/": {"nb": "/personvern.html", "sv": "/sv/integritet/", "da": "/da/privatliv/"},
    "/sv/radera-konto/": {"nb": "/slett-konto.html", "sv": "/sv/radera-konto/", "da": "/da/slet-konto/"},
    "/sv/recept-pa-ingredienser/": {"nb": "/hva-kan-jeg-lage/", "sv": "/sv/recept-pa-ingredienser/", "da": "/da/opskrifter-ud-fra-ingredienser/"},
    "/sv/receptbok-app/": {"sv": "/sv/receptbok-app/", "da": "/da/opskrifts-app/"},
    "/sv/receptskapare/": {"nb": "/skapere/", "sv": "/sv/receptskapare/", "da": "/da/opskriftsskabere/"},
    "/sv/skafferi-app/": {"sv": "/sv/skafferi-app/", "da": "/da/spisekammer-app/"},
    "/sv/spara-recept-fran-instagram/": {"sv": "/sv/spara-recept-fran-instagram/", "da": "/da/gem-opskrifter-fra-instagram/"},
    "/sv/spara-recept-fran-tiktok/": {"sv": "/sv/spara-recept-fran-tiktok/", "da": "/da/gem-opskrifter-fra-tiktok/"},
    "/sv/tiktok/": {"nb": "/tiktok/", "sv": "/sv/tiktok/", "da": "/da/tiktok/"},
    "/sv/tom-kylskapet/": {"sv": "/sv/tom-kylskapet/", "da": "/da/toem-koeleskabet/"},
    "/sv/vad-ska-jag-laga/": {"nb": "/middagsforslag/", "sv": "/sv/vad-ska-jag-laga/", "da": "/da/middagsforslag/"},
    "/sv/veckomeny-app/": {"nb": "/ukemeny/", "sv": "/sv/veckomeny-app/", "da": "/da/madplan-app/"},
    "/sv/villkor/": {"nb": "/vilkar.html", "sv": "/sv/villkor/", "da": "/da/vilkaar/"},
    "/tiktok/": {"nb": "/tiktok/", "sv": "/sv/tiktok/", "da": "/da/tiktok/"},
    "/ukemeny/": {"nb": "/ukemeny/", "sv": "/sv/veckomeny-app/", "da": "/da/madplan-app/"},
    "/vilkar": {"nb": "/vilkar.html", "sv": "/sv/villkor/", "da": "/da/vilkaar/"},
    "/vilkar.html": {"nb": "/vilkar.html", "sv": "/sv/villkor/", "da": "/da/vilkaar/"},
  });

  function normaliserSprak(verdi) {
    var kode = String(verdi || '').toLowerCase().split('-')[0];
    if (kode === 'sv' || kode === 'da') return kode;
    if (kode === 'nb' || kode === 'nn' || kode === 'no') return 'nb';
    return null;
  }

  function velgSprak(sprakliste, lagret) {
    var valgt = normaliserSprak(lagret);
    if (valgt) return valgt;
    for (var i = 0; i < (sprakliste || []).length; i += 1) {
      valgt = normaliserSprak(sprakliste[i]);
      if (valgt) return valgt;
    }
    return null;
  }

  function finnMaalsti(sti, maalSprak, tabell) {
    var rad = (tabell || LOCALE_PAGE_MAP)[sti];
    return rad && rad[maalSprak] ? rad[maalSprak] : null;
  }

  function start() {
    if (!global.location || !global.navigator) return;
    var param = new URLSearchParams(global.location.search).get('sprak');
    var eksplisitt = normaliserSprak(param);
    if (eksplisitt) {
      try { global.localStorage.setItem(STORAGE_KEY, eksplisitt); } catch (e) {}
      return;
    }
    var lagret = null;
    try { lagret = global.localStorage.getItem(STORAGE_KEY); } catch (e) {}
    var valgt = velgSprak(global.navigator.languages || [global.navigator.language], lagret);
    var maal = finnMaalsti(global.location.pathname, valgt, LOCALE_PAGE_MAP);
    if (maal && maal !== global.location.pathname) global.location.replace(maal + global.location.search + global.location.hash);
  }

  global.MatlystLocale = {
    STORAGE_KEY: STORAGE_KEY,
    LOCALE_PAGE_MAP: LOCALE_PAGE_MAP,
    normaliserSprak: normaliserSprak,
    velgSprak: velgSprak,
    finnMaalsti: finnMaalsti,
  };
  start();
})(typeof window === 'undefined' ? globalThis : window);

(function (global) {
  'use strict';

  var STORAGE_KEY = 'matlyst-sprak';
  // Generert av scripts/generer-lokalsider.mjs fra hreflang-parene. Ikke rediger for hånd.
  // Rekkefølge: ?sprak= vinner og lagres, deretter lagret valg, deretter nettleserens språk.
  var LOCALE_PAGE_MAP = Object.freeze({
    "/": {"nb": "/", "sv": "/sv/", "da": "/da/", "en": "/en/"},
    "/bytt-fra-paprika/": {"nb": "/bytt-fra-paprika/", "sv": "/sv/byt-fran-paprika/", "da": "/da/skift-fra-paprika/", "en": "/en/import-recipes-from-paprika/"},
    "/da/": {"nb": "/", "sv": "/sv/", "da": "/da/", "en": "/en/"},
    "/da/find-opskrifter/": {"nb": "/finn-oppskrifter/", "sv": "/sv/hitta-recept/", "da": "/da/find-opskrifter/"},
    "/da/gem-opskrifter-fra-instagram/": {"nb": "/lagre-oppskrifter-fra-instagram/", "sv": "/sv/spara-recept-fran-instagram/", "da": "/da/gem-opskrifter-fra-instagram/", "en": "/en/import-recipes-from-instagram/"},
    "/da/gem-opskrifter-fra-tiktok/": {"nb": "/lagre-oppskrifter-fra-tiktok/", "sv": "/sv/spara-recept-fran-tiktok/", "da": "/da/gem-opskrifter-fra-tiktok/", "en": "/en/import-recipes-from-tiktok/"},
    "/da/haandskrevne-opskrifter/": {"nb": "/handskrevne-oppskrifter/", "sv": "/sv/handskrivna-recept/", "da": "/da/haandskrevne-opskrifter/", "en": "/en/import-recipes-from-photos/"},
    "/da/importer-opskrifter/": {"nb": "/importer-oppskrifter/", "sv": "/sv/importera-recept/", "da": "/da/importer-opskrifter/", "en": "/en/import-recipes/"},
    "/da/indkoebsliste-app/": {"nb": "/handleliste/", "sv": "/sv/inkopslista/", "da": "/da/indkoebsliste-app/"},
    "/da/madplan-app/": {"nb": "/ukemeny/", "sv": "/sv/veckomeny-app/", "da": "/da/madplan-app/"},
    "/da/middagsforslag/": {"nb": "/middagsforslag/", "sv": "/sv/vad-ska-jag-laga/", "da": "/da/middagsforslag/"},
    "/da/nem-mad/": {"sv": "/sv/enkel-middag/", "da": "/da/nem-mad/"},
    "/da/opskrifter-ud-fra-ingredienser/": {"nb": "/hva-kan-jeg-lage/", "sv": "/sv/recept-pa-ingredienser/", "da": "/da/opskrifter-ud-fra-ingredienser/"},
    "/da/opskrifts-app/": {"sv": "/sv/receptbok-app/", "da": "/da/opskrifts-app/"},
    "/da/opskriftsskabere/": {"nb": "/skapere/", "sv": "/sv/receptskapare/", "da": "/da/opskriftsskabere/"},
    "/da/privatliv/": {"nb": "/personvern.html", "sv": "/sv/integritet/", "da": "/da/privatliv/", "en": "/en/privacy/"},
    "/da/skift-fra-paprika/": {"nb": "/bytt-fra-paprika/", "sv": "/sv/byt-fran-paprika/", "da": "/da/skift-fra-paprika/", "en": "/en/import-recipes-from-paprika/"},
    "/da/slet-konto/": {"nb": "/slett-konto.html", "sv": "/sv/radera-konto/", "da": "/da/slet-konto/"},
    "/da/spisekammer-app/": {"sv": "/sv/skafferi-app/", "da": "/da/spisekammer-app/"},
    "/da/tiktok/": {"nb": "/tiktok/", "sv": "/sv/tiktok/", "da": "/da/tiktok/"},
    "/da/toem-koeleskabet/": {"sv": "/sv/tom-kylskapet/", "da": "/da/toem-koeleskabet/"},
    "/da/vilkaar/": {"nb": "/vilkar.html", "sv": "/sv/villkor/", "da": "/da/vilkaar/", "en": "/en/terms/"},
    "/en/": {"nb": "/", "sv": "/sv/", "da": "/da/", "en": "/en/"},
    "/en/import-recipes-from-instagram/": {"nb": "/lagre-oppskrifter-fra-instagram/", "sv": "/sv/spara-recept-fran-instagram/", "da": "/da/gem-opskrifter-fra-instagram/", "en": "/en/import-recipes-from-instagram/"},
    "/en/import-recipes-from-paprika/": {"nb": "/bytt-fra-paprika/", "sv": "/sv/byt-fran-paprika/", "da": "/da/skift-fra-paprika/", "en": "/en/import-recipes-from-paprika/"},
    "/en/import-recipes-from-photos/": {"nb": "/handskrevne-oppskrifter/", "sv": "/sv/handskrivna-recept/", "da": "/da/haandskrevne-opskrifter/", "en": "/en/import-recipes-from-photos/"},
    "/en/import-recipes-from-tiktok/": {"nb": "/lagre-oppskrifter-fra-tiktok/", "sv": "/sv/spara-recept-fran-tiktok/", "da": "/da/gem-opskrifter-fra-tiktok/", "en": "/en/import-recipes-from-tiktok/"},
    "/en/import-recipes/": {"nb": "/importer-oppskrifter/", "sv": "/sv/importera-recept/", "da": "/da/importer-opskrifter/", "en": "/en/import-recipes/"},
    "/en/privacy/": {"nb": "/personvern.html", "sv": "/sv/integritet/", "da": "/da/privatliv/", "en": "/en/privacy/"},
    "/en/terms/": {"nb": "/vilkar.html", "sv": "/sv/villkor/", "da": "/da/vilkaar/", "en": "/en/terms/"},
    "/finn-oppskrifter/": {"nb": "/finn-oppskrifter/", "sv": "/sv/hitta-recept/", "da": "/da/find-opskrifter/"},
    "/handleliste/": {"nb": "/handleliste/", "sv": "/sv/inkopslista/", "da": "/da/indkoebsliste-app/"},
    "/handskrevne-oppskrifter/": {"nb": "/handskrevne-oppskrifter/", "sv": "/sv/handskrivna-recept/", "da": "/da/haandskrevne-opskrifter/", "en": "/en/import-recipes-from-photos/"},
    "/hva-kan-jeg-lage/": {"nb": "/hva-kan-jeg-lage/", "sv": "/sv/recept-pa-ingredienser/", "da": "/da/opskrifter-ud-fra-ingredienser/"},
    "/importer-oppskrifter/": {"nb": "/importer-oppskrifter/", "sv": "/sv/importera-recept/", "da": "/da/importer-opskrifter/", "en": "/en/import-recipes/"},
    "/index.html": {"nb": "/", "sv": "/sv/", "da": "/da/", "en": "/en/"},
    "/lagre-oppskrifter-fra-instagram/": {"nb": "/lagre-oppskrifter-fra-instagram/", "sv": "/sv/spara-recept-fran-instagram/", "da": "/da/gem-opskrifter-fra-instagram/", "en": "/en/import-recipes-from-instagram/"},
    "/lagre-oppskrifter-fra-tiktok/": {"nb": "/lagre-oppskrifter-fra-tiktok/", "sv": "/sv/spara-recept-fran-tiktok/", "da": "/da/gem-opskrifter-fra-tiktok/", "en": "/en/import-recipes-from-tiktok/"},
    "/middagsforslag/": {"nb": "/middagsforslag/", "sv": "/sv/vad-ska-jag-laga/", "da": "/da/middagsforslag/"},
    "/personvern": {"nb": "/personvern.html", "sv": "/sv/integritet/", "da": "/da/privatliv/", "en": "/en/privacy/"},
    "/personvern.html": {"nb": "/personvern.html", "sv": "/sv/integritet/", "da": "/da/privatliv/", "en": "/en/privacy/"},
    "/skapere/": {"nb": "/skapere/", "sv": "/sv/receptskapare/", "da": "/da/opskriftsskabere/"},
    "/slett-konto": {"nb": "/slett-konto.html", "sv": "/sv/radera-konto/", "da": "/da/slet-konto/"},
    "/slett-konto.html": {"nb": "/slett-konto.html", "sv": "/sv/radera-konto/", "da": "/da/slet-konto/"},
    "/sv/": {"nb": "/", "sv": "/sv/", "da": "/da/", "en": "/en/"},
    "/sv/byt-fran-paprika/": {"nb": "/bytt-fra-paprika/", "sv": "/sv/byt-fran-paprika/", "da": "/da/skift-fra-paprika/", "en": "/en/import-recipes-from-paprika/"},
    "/sv/enkel-middag/": {"sv": "/sv/enkel-middag/", "da": "/da/nem-mad/"},
    "/sv/handskrivna-recept/": {"nb": "/handskrevne-oppskrifter/", "sv": "/sv/handskrivna-recept/", "da": "/da/haandskrevne-opskrifter/", "en": "/en/import-recipes-from-photos/"},
    "/sv/hitta-recept/": {"nb": "/finn-oppskrifter/", "sv": "/sv/hitta-recept/", "da": "/da/find-opskrifter/"},
    "/sv/importera-recept/": {"nb": "/importer-oppskrifter/", "sv": "/sv/importera-recept/", "da": "/da/importer-opskrifter/", "en": "/en/import-recipes/"},
    "/sv/inkopslista/": {"nb": "/handleliste/", "sv": "/sv/inkopslista/", "da": "/da/indkoebsliste-app/"},
    "/sv/integritet/": {"nb": "/personvern.html", "sv": "/sv/integritet/", "da": "/da/privatliv/", "en": "/en/privacy/"},
    "/sv/radera-konto/": {"nb": "/slett-konto.html", "sv": "/sv/radera-konto/", "da": "/da/slet-konto/"},
    "/sv/recept-pa-ingredienser/": {"nb": "/hva-kan-jeg-lage/", "sv": "/sv/recept-pa-ingredienser/", "da": "/da/opskrifter-ud-fra-ingredienser/"},
    "/sv/receptbok-app/": {"sv": "/sv/receptbok-app/", "da": "/da/opskrifts-app/"},
    "/sv/receptskapare/": {"nb": "/skapere/", "sv": "/sv/receptskapare/", "da": "/da/opskriftsskabere/"},
    "/sv/skafferi-app/": {"sv": "/sv/skafferi-app/", "da": "/da/spisekammer-app/"},
    "/sv/spara-recept-fran-instagram/": {"nb": "/lagre-oppskrifter-fra-instagram/", "sv": "/sv/spara-recept-fran-instagram/", "da": "/da/gem-opskrifter-fra-instagram/", "en": "/en/import-recipes-from-instagram/"},
    "/sv/spara-recept-fran-tiktok/": {"nb": "/lagre-oppskrifter-fra-tiktok/", "sv": "/sv/spara-recept-fran-tiktok/", "da": "/da/gem-opskrifter-fra-tiktok/", "en": "/en/import-recipes-from-tiktok/"},
    "/sv/tiktok/": {"nb": "/tiktok/", "sv": "/sv/tiktok/", "da": "/da/tiktok/"},
    "/sv/tom-kylskapet/": {"sv": "/sv/tom-kylskapet/", "da": "/da/toem-koeleskabet/"},
    "/sv/vad-ska-jag-laga/": {"nb": "/middagsforslag/", "sv": "/sv/vad-ska-jag-laga/", "da": "/da/middagsforslag/"},
    "/sv/veckomeny-app/": {"nb": "/ukemeny/", "sv": "/sv/veckomeny-app/", "da": "/da/madplan-app/"},
    "/sv/villkor/": {"nb": "/vilkar.html", "sv": "/sv/villkor/", "da": "/da/vilkaar/", "en": "/en/terms/"},
    "/tiktok/": {"nb": "/tiktok/", "sv": "/sv/tiktok/", "da": "/da/tiktok/"},
    "/ukemeny/": {"nb": "/ukemeny/", "sv": "/sv/veckomeny-app/", "da": "/da/madplan-app/"},
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

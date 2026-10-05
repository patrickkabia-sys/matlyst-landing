(function (global) {
  'use strict';

  var STORAGE_KEY = 'matlyst-sprak';
  // Publiseringsport: fylles fra hreflang-parene i samme commit som sv/da lanseres.
  var LOCALE_PAGE_MAP = Object.freeze({});

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
    if (maal && maal !== global.location.pathname) global.location.replace(maal);
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

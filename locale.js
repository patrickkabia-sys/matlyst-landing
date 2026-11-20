(function (global) {
  'use strict';

  // Språkforslaget leser sidens egne hreflang-lenker i <head>, så det finnes
  // ikke noe sidekart her. Siden som lastes er selv kilden til motstykkene.
  // Rekkefølge: ?sprak= vinner og lagres, deretter lagret valg, deretter nettleserens språk.
  var STORAGE_KEY = 'matlyst-sprak';
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

  // Leser <link rel="alternate" hreflang>. x-default og ukjente språk hoppes over.
  // Bare lenker til matlyst-app.no eller sidens egen vert (verten i base) tas med, og
  // bare pathname brukes. En annen vert, et annet skjema eller en ugyldig adresse kan
  // dermed aldri sende brukeren ut av nettstedet.
  function lesAlternativer(dok, base) {
    var resultat = [];
    var basisVert = '';
    try { basisVert = new URL(base).hostname; } catch (e) {}
    var lenker;
    try { lenker = dok.querySelectorAll('link[rel="alternate"][hreflang]'); } catch (e) { return resultat; }
    for (var i = 0; i < lenker.length; i += 1) {
      try {
        var sprak = normaliserSprak(lenker[i].getAttribute('hreflang'));
        var href = lenker[i].getAttribute('href');
        if (!sprak || !href) continue;
        var url = new URL(href, base);
        if (url.protocol !== 'https:' && url.protocol !== 'http:') continue;
        if (url.hostname !== 'matlyst-app.no' && url.hostname !== basisVert) continue;
        var sti = url.pathname;
        if (sti.charAt(0) !== '/' || sti.charAt(1) === '/') continue;
        resultat.push({ sprak: sprak, sti: sti });
      } catch (e) {}
    }
    return resultat;
  }

  function finnMaalsti(maalSprak, alternativer) {
    for (var i = 0; i < alternativer.length; i += 1) {
      if (alternativer[i].sprak === maalSprak) return alternativer[i].sti;
    }
    return null;
  }

  function erNorskSide(sti, alternativer) {
    if (/^\/(?:sv|da|en)(?:\/|$)/i.test(sti)) return false;
    return finnMaalsti('nb', alternativer) !== null;
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
    var alternativer = lesAlternativer(global.document, global.location.href || ('https://matlyst-app.no' + global.location.pathname));
    if (!erNorskSide(global.location.pathname, alternativer)) return;
    if (lesValg(DECISION_KEY) || lesValg(STORAGE_KEY)) {
      lagreValg(DECISION_KEY, '1');
      return;
    }

    var valgt = foreslaSprak(global.navigator.language);
    lagreValg(DECISION_KEY, '1');
    if (!valgt) return;
    var maal = finnMaalsti(valgt, alternativer);
    if (!maal || maal === global.location.pathname) return;
    lagreValg(STORAGE_KEY, valgt);
    global.location.replace(maal + global.location.search + global.location.hash);
  }

  global.MatlystLocale = {
    STORAGE_KEY: STORAGE_KEY,
    DECISION_KEY: DECISION_KEY,
    normaliserSprak: normaliserSprak,
    foreslaSprak: foreslaSprak,
    lesAlternativer: lesAlternativer,
    finnMaalsti: finnMaalsti,
    erNorskSide: erNorskSide,
  };
  if (global.document && typeof global.addEventListener === 'function') {
    if (global.document.readyState === 'complete') start();
    else global.addEventListener('load', start, { once: true });
  }
})(typeof window === 'undefined' ? globalThis : window);

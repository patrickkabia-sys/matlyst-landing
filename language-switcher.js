(function (global) {
  'use strict';

  var STORAGE_KEY = 'matlyst-sprak';
  var DECISION_KEY = 'matlyst-sprak-vurdert';

  function lagre(nokkel, verdi) {
    try { global.localStorage.setItem(nokkel, verdi); } catch (e) {}
    try {
      global.document.cookie = encodeURIComponent(nokkel) + '=' + encodeURIComponent(verdi)
        + '; Max-Age=31536000; Path=/; SameSite=Lax';
    } catch (e) {}
  }

  function sprakFraLenke(lenke) {
    try {
      return new URL(lenke.getAttribute('href'), global.location.origin).searchParams.get('sprak');
    } catch (e) {
      return null;
    }
  }

  function medGjeldendeParametere(lenke, sprak) {
    try {
      var maal = new URL(lenke.getAttribute('href'), global.location.origin);
      var parametere = new URLSearchParams(global.location.search);
      parametere.delete('sprak');
      maal.search = parametere.toString();
      maal.searchParams.set('sprak', sprak);
      maal.hash = global.location.hash || '';
      lenke.setAttribute('href', maal.pathname + maal.search + maal.hash);
    } catch (e) {}
  }

  var eksplisitt = new URLSearchParams(global.location.search).get('sprak');
  if (/^(?:nb|sv|da|en)$/u.test(eksplisitt || '')) {
    lagre(STORAGE_KEY, eksplisitt);
    lagre(DECISION_KEY, '1');
  }

  var lenker = global.document.querySelectorAll('.language-switcher a[href]');
  for (var i = 0; i < lenker.length; i += 1) {
    (function (lenke) {
      var sprak = sprakFraLenke(lenke);
      if (!sprak) return;
      medGjeldendeParametere(lenke, sprak);
      lenke.addEventListener('click', function () {
        lagre(STORAGE_KEY, sprak);
        lagre(DECISION_KEY, '1');
      });
    })(lenker[i]);
  }
})(window);

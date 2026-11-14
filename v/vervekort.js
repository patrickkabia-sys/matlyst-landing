// Vervekortet: /v/?k=KODE (og /sv/v/, /da/v/, /en/v/). Felles for alle fire språk.
//
// ⚠️ Rammer (vokst fram av jus og personvern, se docs/vervekort-jus.md):
// - Ingen forhåndshenting, ingen tredjepart, ingen analyse. CSP i sida sier 'self'.
// - Koden går ALDRI inn i DOM-en som HTML. Den valideres mot ^[A-F0-9]{6}$ og
//   settes med textContent. Alt annet i spørrestrengen ignoreres.
// - Play-lenka har INGEN referrer i dag (REFERRER_PA = false). Appen leser ikke
//   Install Referrer, og koden skal ikke sendes til Google før et vedtak sier det.
//   Slås den på, får bare en gyldig kode referrer=matlyst_kode%3DKODE.
// - iPhone/iPad (også iPad som melder seg som Mac) → App Store, Android → Google
//   Play, med location.replace. Alle andre ser sida og velger selv.
// Vokter: test/playwright/vervekort.spec.mjs.
(function () {
  'use strict';

  var KODE = /^[A-F0-9]{6}$/;
  var APP_STORE = 'https://apps.apple.com/app/matlyst/id6762563515';
  var PLAY = 'https://play.google.com/store/apps/details?id=app.matlyst';
  // ⚠️ AV. Slås bare på etter et vedtak (personvern: koden går da til Google).
  var REFERRER_PA = false;

  function lesKode() {
    try {
      var k = new URLSearchParams(window.location.search).get('k');
      return typeof k === 'string' && KODE.test(k) ? k : null;
    } catch (e) {
      return null;
    }
  }

  function plattform() {
    var ua = navigator.userAgent || '';
    if (/Android/i.test(ua)) return 'android';
    if (/iPhone|iPad|iPod/.test(ua)) return 'ios';
    // iPadOS 13+ melder seg som Mac i Safari. Ekte Mac har ingen berøringspunkter.
    if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) return 'ios';
    return 'annet';
  }

  function playLenke(kode) {
    return REFERRER_PA && kode ? PLAY + '&referrer=' + encodeURIComponent('matlyst_kode=' + kode) : PLAY;
  }

  function kopier(kode, knapp, status) {
    function ferdig() { status.textContent = knapp.getAttribute('data-kopiert'); }
    function feilet() { status.textContent = knapp.getAttribute('data-feil'); }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(kode).then(ferdig, feilet);
        return;
      }
    } catch (e) { /* faller til feilet */ }
    feilet();
  }

  function start() {
    var kode = lesKode();
    var play = document.getElementById('play');
    if (play) play.setAttribute('href', playLenke(kode));

    if (kode) {
      var felt = document.getElementById('kode');
      var knapp = document.getElementById('kopier');
      var status = document.getElementById('status');
      felt.textContent = kode;
      document.getElementById('medKode').hidden = false;
      document.querySelector('.vervekort').classList.add('har-kode');
      knapp.addEventListener('click', function () { kopier(kode, knapp, status); });
    }

    var p = plattform();
    if (p === 'ios') window.location.replace(APP_STORE);
    else if (p === 'android') window.location.replace(playLenke(kode));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
}());

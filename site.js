const nav = document.getElementById('nav');
if (nav) addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 20), { passive: true });

const io = new IntersectionObserver((es) => {
  es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// --- Samtykke + PostHog + Meta Pixel (lastes KUN etter «Godta») ---
(function () {
  var PIXEL_ID = '35960255793618130';
  var KEY = 'matlyst-consent';
  var banner = document.getElementById('cookie');

  function loadPixel() {
    if (window.fbq) return;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', PIXEL_ID);
    fbq('track', 'PageView');
  }
  function loadPostHog() {
    if (window.posthog && window.posthog.__loaded) return;
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    posthog.init('phc_CWwce4KPGsWLSJXZ6LTCiLSswwt45Er4mVVz5pihj3oh', {
      api_host: 'https://eu.i.posthog.com',
      person_profiles: 'identified_only',
      disable_session_recording: true,
      capture_pageview: true
    });
  }
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function hide() { if (banner) { banner.classList.add('hide'); setTimeout(function () { banner.hidden = true; }, 520); } }
  function loadGA() {
    if (window.gtag) return;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=G-X3J7DVSH2R';
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', 'G-X3J7DVSH2R');
  }

  var consent = get();
  if (consent === 'granted') { loadPixel(); loadPostHog(); loadGA(); }
  else if (!consent && banner) banner.hidden = false;

  // Tilbaketrekking (GDPR art. 7(3): skal vaere like enkelt som a gi samtykke).
  // Nullstiller valget og laster siden pa nytt, slik at ingen av skriptene kjorer
  // videre i okten. Uten reload ville piksel, GA og PostHog blitt vaerende til
  // brukeren selv navigerte bort -- altsa ikke en reell tilbaketrekking.
  function withdraw() {
    try { localStorage.removeItem(KEY); } catch (e) {}
    try { if (window.posthog && posthog.opt_out_capturing) posthog.opt_out_capturing(); } catch (e) {}
    location.reload();
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-consent-withdraw]');
    if (!t) return;
    e.preventDefault();
    withdraw();
  });

  var accept = document.getElementById('ck-accept');
  var reject = document.getElementById('ck-reject');
  if (accept) accept.addEventListener('click', function () { set('granted'); loadPixel(); loadPostHog(); loadGA(); hide(); });
  if (reject) reject.addEventListener('click', function () { set('denied'); hide(); });

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    if (a.href && a.href.indexOf('apps.apple.com') > -1) {
      if (window.fbq) fbq('track', 'Lead', { content_name: 'App Store' });
      if (window.posthog) posthog.capture('appstore_click');
    } else if (a.href && a.href.indexOf('play.google.com') > -1) {
      if (window.fbq) fbq('track', 'Lead', { content_name: 'Google Play' });
      if (window.posthog) posthog.capture('play_click');
    } else if (a.getAttribute('href') === '#nyhetsbrev') {
      if (window.fbq) fbq('trackCustom', 'NyhetsbrevIntent');
      if (window.posthog) posthog.capture('newsletter_intent');
    }
  });

  document.addEventListener('submit', function (e) {
    if (e.target && e.target.classList && e.target.classList.contains('emailoctopus-form')) {
      if (window.fbq) fbq('track', 'Lead', { content_name: 'Nyhetsbrev' });
      if (window.posthog) posthog.capture('newsletter_signup');
    }
  }, true);
})();

// --- Nyhetsbrev: EmailOctopus lastes KUN etter en uttrykkelig handling ---
// Skjemaet la tidligere som <script src> i markupen og gikk til EmailOctopus,
// Google reCAPTCHA og Google Fonts ved hver sidelast, for brukeren hadde
// svart pa samtykkebanneret. Fram til brukeren tar i feltet viser vi derfor et
// rent HTML-felt uten tredjepart, og laster det ekte skjemaet forst da.
(function () {
  var vert = document.getElementById('nyhetsbrev-skjema');
  if (!vert) return;
  var plassholder = document.getElementById('nyhetsbrev-plassholder');
  var feil = document.getElementById('nyhetsbrev-feil');
  var startet = false;

  function visNyhetsbrevFeil() {
    startet = false;
    if (feil) feil.hidden = false;
    if (plassholder) plassholder.hidden = false;
  }

  function ekteSkjema() {
    return vert.querySelector('form:not(.nl-plassholder)');
  }

  function lastNyhetsbrev() {
    if (startet || ekteSkjema()) return;
    startet = true;
    if (feil) feil.hidden = true;
    var id = vert.getAttribute('data-eo-form');
    var s = document.createElement('script');
    s.async = true;
    s.setAttribute('data-form', id);
    s.src = 'https://eocampaign1.com/form/' + id + '.js';
    s.onerror = visNyhetsbrevFeil;
    vert.appendChild(s);
    // Et skript som svarer 200 med sol kan fortsatt la vaere a tegne skjemaet.
    // Da skal brukeren fa beskjed, ikke et felt som ikke gjor noe.
    setTimeout(function () { if (!ekteSkjema()) visNyhetsbrevFeil(); }, 10000);
  }

  // Nar EmailOctopus har tegnet skjemaet sitt, tar det over for plassholderen,
  // og e-posten brukeren allerede hadde skrevet folger med.
  var speider = new MutationObserver(function () {
    var skjema = ekteSkjema();
    if (!skjema) return;
    speider.disconnect();
    if (feil) feil.hidden = true;
    var felt = skjema.querySelector('input[type=email]');
    var skrevet = plassholder ? plassholder.querySelector('input[type=email]').value : '';
    if (plassholder) plassholder.remove();
    if (felt) {
      if (skrevet) felt.value = skrevet;
      // Opplysninga om EmailOctopus og reCAPTCHA folger med til EmailOctopus
      // sitt eget felt, sa den ogsa leses opp der.
      felt.setAttribute('aria-describedby', 'nyhetsbrev-vilkar');
      felt.focus();
    }
  });
  speider.observe(vert, { childList: true, subtree: true });

  if (plassholder) {
    plassholder.addEventListener('focusin', function () { lastNyhetsbrev(); });
    plassholder.addEventListener('submit', function (e) {
      e.preventDefault();
      lastNyhetsbrev();
    });
  }
})();

// «Last ned» i navigasjonen står som App Store-lenke i markupen. Det er riktig
// for de fleste, og det gjør at knappen virker uten JavaScript. På Android er
// den samme lenka en blindvei, så der byttes den til Google Play. Merkene i
// heroen og nederst på sida viser begge butikkene uansett, så dette gjelder
// bare snarveien i toppen.
(function () {
  if (!/android/i.test(navigator.userAgent)) return;
  var PLAY = 'https://play.google.com/store/apps/details?id=app.matlyst';
  document.querySelectorAll('a.nav-cta[href*="apps.apple.com"]').forEach(function (a) {
    a.href = PLAY;
  });
})();

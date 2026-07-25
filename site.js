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
    posthog.init('phc_CnHuX3D6byju4qDSyVXQ9PQJZ6VxY7xFrCgtBTiiqeTr', {
      api_host: 'https://eu.i.posthog.com',
      person_profiles: 'identified_only',
      disable_session_recording: true,
      capture_pageview: true
    });
  }
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function hide() { if (banner) { banner.classList.add('hide'); setTimeout(function () { banner.hidden = true; }, 520); } }

  var consent = get();
  if (consent === 'granted') { loadPixel(); loadPostHog(); }
  else if (!consent && banner) banner.hidden = false;

  var accept = document.getElementById('ck-accept');
  var reject = document.getElementById('ck-reject');
  if (accept) accept.addEventListener('click', function () { set('granted'); loadPixel(); loadPostHog(); hide(); });
  if (reject) reject.addEventListener('click', function () { set('denied'); hide(); });

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    if (a.href && a.href.indexOf('apps.apple.com') > -1) {
      if (window.fbq) fbq('track', 'Lead', { content_name: 'App Store' });
      if (window.posthog) posthog.capture('appstore_click');
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

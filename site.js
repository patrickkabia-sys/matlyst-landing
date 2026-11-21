const io = new IntersectionObserver((es) => {
  es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// --- Samtykke + PostHog + Google Analytics (lastes KUN etter «Godta») ---
(function () {
  var KEY = 'matlyst-consent';
  var banner = document.getElementById('cookie');

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

  function ctaLocation(a) {
    if (a.classList.contains('nav-cta')) return 'navigation';
    if (a.closest('.hero')) return 'hero';
    if (a.closest('.page-cta')) return 'page_cta';
    if (a.closest('footer')) return 'footer';
    return 'other';
  }

  function eventProperties(a, destination) {
    var bilde = a.querySelector('img[alt]');
    var tekst = a.getAttribute('aria-label') || (bilde && bilde.alt) || a.textContent || '';
    return {
      page_path: location.pathname,
      page_title: document.title,
      cta_location: ctaLocation(a),
      link_text: tekst.replace(/\s+/g, ' ').trim().slice(0, 80) || null,
      destination_store: destination || null
    };
  }

  function capture(name, properties) {
    if (get() !== 'granted') return;
    if (name === 'download_click') {
      if (window.posthog) window.posthog.capture(name, properties, { transport: 'sendBeacon' });
      if (window.gtag) window.gtag('event', name, Object.assign({}, properties, { transport_type: 'beacon' }));
      return;
    }
    if (window.posthog) window.posthog.capture(name, properties);
    if (window.gtag) window.gtag('event', name, properties);
  }

  var consent = get();
  if (consent === 'granted') { loadPostHog(); loadGA(); }
  else if (!consent && banner) banner.hidden = false;

  // Tilbaketrekking (GDPR art. 7(3): skal vaere like enkelt som a gi samtykke).
  // Nullstiller valget og laster siden pa nytt, slik at ingen av skriptene kjorer
  // videre i okten. Uten reload ville GA og PostHog blitt vaerende til
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
  if (accept) accept.addEventListener('click', function () { set('granted'); loadPostHog(); loadGA(); hide(); });
  if (reject) reject.addEventListener('click', function () { set('denied'); hide(); });

  document.addEventListener('click', function (e) {
    var hent = e.target.closest('[data-hent]');
    if (hent) {
      var d = document.getElementById('hent');
      capture('download_click', {
        page_path: location.pathname,
        cta_location: hent.dataset.hent,
        visning: d && d.open ? 'qr' : 'lenke'
      });
    }
    var a = e.target.closest('a');
    if (!a) return;
    if (a.href && a.href.indexOf('apps.apple.com') > -1) {
      capture('appstore_click', eventProperties(a, 'app_store'));
    } else if (a.href && a.href.indexOf('play.google.com') > -1) {
      capture('play_click', eventProperties(a, 'google_play'));
    }
  });
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

// Korte animasjoner: spill når de er synlige, aldri ved redusert bevegelse (da vises plakat og kontroller).
(() => {
  const filmer = document.querySelectorAll('video[data-autoplay]');
  if (!filmer.length) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver((poster) => {
    for (const p of poster) {
      if (p.isIntersecting) p.target.play().catch(() => {});
      else p.target.pause();
    }
  }, { threshold: 0.4 });
  for (const film of filmer) {
    film.removeAttribute('controls');
    film.preload = 'metadata';
    obs.observe(film);
  }
})();

// Delte tallfunksjoner for kalkulatorkortet (form.kalk): å lese og å skrive tall.
(() => {
  // Legges på window.MatlystTall, slik at kortet og testene når dem.
  // visTall: antall desimaler følger størrelsen (4 gjeldende sifre som standard). Færre sifre gir færre desimaler.
  // Språkets desimaltegn (sidens lang): komma på nb, sv og da, punktum på en. Ingen tusenskille, slik sidene ellers skriver tall.
  const visTall = (n, komma, sifre = 4) => {
    if (!Number.isFinite(n)) return '';
    const a = Math.abs(n);
    const d = Math.max(0, (a >= 1000 ? 0 : a >= 100 ? 1 : a >= 10 ? 2 : a >= 1 ? 3 : a >= 0.1 ? 4 : 5) - (4 - sifre));
    const t = String(Number(n.toFixed(d)));
    return komma ? t.replace('.', ',') : t;
  };
  // Hele inntastingen valideres. Gyldig: valgfritt fortegn, sifre, valgfritt tusenskille og høyst ett desimaltegn.
  // Mellomrom (også hardt og smalt) mellom sifre er tusenskille. Språkets tusenskille er punktum på nb, sv og da og komma på en:
  // «1.500» er 1500 på norsk og «1,500» er 1500 på engelsk (nøyaktig tre sifre etter, og ett til tre foran). Ellers er komma og punktum desimaltegn.
  // Gir null for alt som ikke er ett tall. Fortegn tolkes, men om negativt er lov avgjør den som bruker tallet.
  const tolkTall = (tekst, komma) => {
    const TUSEN = komma ? '.' : ',';
    const t = String(tekst).trim().replace(/(?<=\d)[   ](?=\d)/gu, '');
    const m = /^([+-]?)(\d*(?:[.,]\d*)*)$/u.exec(t);
    if (!m || !/\d/u.test(m[2])) return null;
    const grupper = m[2].split(/[.,]/u), skilletegn = m[2].match(/[.,]/gu) || [];
    // En tusengruppe krever ett til tre sifre foran som ikke begynner med 0 («0.125» og «0,125» er desimaltall på alle språk).
    const tusen = (g) => g.length > 0 && g[0].length >= 1 && g[0].length <= 3 && g[0][0] !== '0' && g.slice(1).every((x) => x.length === 3);
    let tall = '';
    if (skilletegn.length === 0) tall = grupper[0];
    else if (skilletegn.every((c) => c === skilletegn[0])) {
      if (skilletegn.length >= 2) { if (skilletegn[0] !== TUSEN || !tusen(grupper)) return null; tall = grupper.join(''); }
      else if (skilletegn[0] === TUSEN && tusen(grupper)) tall = grupper.join('');
      else tall = `${grupper[0] || '0'}.${grupper[1] || '0'}`;
    } else {
      const siste = skilletegn[skilletegn.length - 1];
      const foran = grupper.slice(0, -1);
      if (siste === TUSEN || skilletegn.slice(0, -1).some((c) => c !== TUSEN) || !tusen(foran)) return null;
      tall = `${foran.join('')}.${grupper[grupper.length - 1] || '0'}`;
    }
    return Number(`${m[1] === '-' ? '-' : ''}${tall}`);
  };
  window.MatlystTall = { tolkTall, visTall };
})();

// Kalkulatorkortet (form.kalk): regner mens du skriver. Volum regnes mot volum via ml og vekt mot vekt via gram, direkte.
// Bare kryssing mellom volum og vekt bruker varens gram per dl: ml[enhet] / 100 * gram per dl, og mangler vekten (eller er den 0), vises veiledningen.
// All tekst (enhetsnavn, hurtigmengder, veiledning) kommer fra skjemaets egne data (script.kalk-data), så filen har ingen språkstrenger.
// Valgfrie datafelt gir engelske skjemaer og enhetsomregnerne det de trenger, og skjemaer uten dem oppfører seg som før:
// brok (mengden kan skrives «1/2» eller «1 1/2»), kort[e] som [entall, flertall], stegFor[e] (hvilken hurtiggruppe enheten bruker) og byttTil[e] (mengden ved bytte).
// Enhetsomregning uten vare: affin[e] = [a, b] (temperatur), negativ (negative mengder er gyldige), sifre (gjeldende sifre i svaret), beholdMengde (bytte lar mengden stå), og varer kan mangle.
// Tallesing er den delte tolkTall (window.MatlystTall). Skrivemåten av svaret har ikke tak på antall desimaler (visTall har det), så små tall aldri blir 0.
(() => {
  const skjemaer = document.querySelectorAll('form.kalk:not([data-kalk="porsjon"]):not([data-kalk="band"])');
  if (!skjemaer.length || !window.MatlystTall) return;
  const { tolkTall } = window.MatlystTall;
  const KOMMA = ['nb', 'no', 'nn', 'sv', 'da'].includes((document.documentElement.lang || 'en').slice(0, 2).toLowerCase());
  const komma = (t) => (KOMMA ? t.replace('.', ',') : t);
  // Svaret i gram: hele gram fra 10 g (halve runder opp), og to gjeldende sifre under 10 g (4,6 og 0,52).
  // Alle andre enheter: 100 og over som heltall, 10 til 100 med tre gjeldende sifre, under 10 med to. Ingen tak på desimaler, og aldri 0 for et tall som ikke er 0.
  // Sidefamilienes maler (scripts/familier/dl-til-gram/mal-nb.mjs) skriver tabellene etter samme regel, låst av kalk-tabell.spec.mjs.
  const svarTekst = (n, enhet) => {
    const a = Math.abs(n);
    if (a === 0) return '0';
    // Halve runder opp også når flyttallet ligger like under: rund på tolv gjeldende sifre først.
    if (enhet === 'g' && a >= 10) return komma(String(Math.round(Number(n.toPrecision(12)))));
    if (a >= 100) return komma(String(Math.round(Number(n.toPrecision(12)))));
    const sifre = a >= 10 && enhet !== 'g' ? 3 : 2;
    const desimaler = Math.min(100, Math.max(0, sifre - 1 - Math.floor(Math.log10(a))));
    const t = (Math.round(Number((n * 10 ** desimaler).toPrecision(12))) / 10 ** desimaler).toFixed(desimaler);
    return komma(t.includes('.') ? t.replace(/0+$/u, '').replace(/\.$/u, '') : t);
  };
  // Svaret med `sifre` gjeldende sifre (felt `sifre` i kalk-data), for alle enheter også gram: 1000 og over som heltall (halve runder opp), ellers uten overflødige nuller og uten tak på desimaler, så små tall aldri blir 0.
  // Samme regel som presisTekst i scripts/kalk-kort.mjs, låst av kalk-tabell-enhet.spec.mjs.
  const presis = (n, sifre) => {
    const a = Math.abs(n);
    if (a === 0) return '0';
    if (a >= 1000) return komma(String(Math.round(Number(n.toPrecision(12)))));
    const desimaler = Math.min(100, Math.max(0, sifre - 1 - Math.floor(Math.log10(a))));
    const t = (Math.round(Number((n * 10 ** desimaler).toPrecision(12))) / 10 ** desimaler).toFixed(desimaler);
    return komma(t.includes('.') ? t.replace(/0+$/u, '').replace(/\.$/u, '') : t);
  };
  // Mengden gjengis slik den ble tolket, uten avrunding og uten overflødige nuller.
  const mengdeTekst = (n) => {
    const t = String(n);
    return komma(/e/u.test(t) ? n.toLocaleString('en', { useGrouping: false, maximumFractionDigits: 20 }) : t);
  };
  // Mengden som tall, med brøk når skjemaet tillater det: a/b eller n a/b (heltall, nevner over 0, valgfritt mellomrom rundt skråstreken).
  // Gir { n, tekst, entall } eller null. tekst er brøken normalisert («1 1/2»). entall er sant for nøyaktig 1 og for en ekte brøk under 1 skrevet som brøk («3/4»).
  // Heltall, teller og nevner har høyst seks sifre (ellers er brøken ugyldig). Brøken kan ha minus rett foran («-1/2», «-1 1/2»); regn() godtar det bare med `negativ`. Med brøk slått på er mellomrom mellom sifre ikke tusenskille («1 2» er ugyldig), ellers ville «1 2» blitt 12.
  const tolkMengde = (tekst, brok) => {
    const t = String(tekst).trim();
    if (brok) {
      const m = /^(-)?(?:(\d{1,6})\s+)?(\d{1,6})\s*\/\s*(\d{1,6})$/u.exec(t);
      if (m) {
        const [, minus, hel, a, b] = m;
        // Fortegnet tolkes alltid; regn() avviser negative mengder uten `negativ`, så en negativ brøk er da ugyldig som et negativt desimaltall.
        if (Number(b) === 0) return null;
        const abs = Number(hel || 0) + Number(a) / Number(b);
        const n = minus ? -abs : abs;
        return { n, tekst: `${minus || ''}${hel === undefined ? '' : `${Number(hel)} `}${Number(a)}/${Number(b)}`, entall: n === 1 || (hel === undefined && n > 0 && n < 1) };
      }
      if (/\d\s+\d/u.test(t) || t.includes('/')) return null;
    }
    const n = tolkTall(t, KOMMA);
    // Et tall som ikke er endelig (for eksempel 400 sifre) er ugyldig, med eller uten brøk.
    return n === null || !Number.isFinite(n) ? null : { n, tekst: null, entall: n === 1 };
  };
  for (const skjema of skjemaer) {
    // Hvert skjema settes opp for seg: et ødelagt skjema hoppes over (det statiske svaret i HTML-en blir stående), og resten virker.
    try {
      const data = JSON.parse(skjema.querySelector('.kalk-data').textContent);
      const felt = (navn) => skjema.querySelector(`[data-felt="${navn}"]`);
      const mengde = felt('mengde'), fra = felt('fra'), til = felt('til'), svar = felt('svar'), setning = felt('setning'), bytt = felt('bytt'), vare = felt('vare');
      const hurtig = [...skjema.querySelectorAll('.hurtig button')];
      // Med stegFor kreves bare gruppene den peker på (og hver fra-enhet må peke på en), ellers de fire faste gruppene.
      const grupper = data && data.stegFor && fra ? [...fra.options].map((o) => data.stegFor[o.value]) : ['volum', 'ml', 'g', 'kg'];
      // `varer` kan mangle (enhetsomregning uten vare); står den der, må den ha minst én vare.
      const ok = data && (data.varer === undefined || (Array.isArray(data.varer) && data.varer.length)) && data.ml && data.g && data.steg && typeof data.feil === 'string'
        && grupper.every((g) => Array.isArray(data.steg[g]) && data.steg[g].length >= hurtig.length)
        && mengde && fra && til && svar && setning && bytt;
      if (!ok) continue;
      const brok = Boolean(data.brok);
      // Enhetens kortform: en streng, eller [entall, flertall] (bare der enheten bøyes, som «cup» og «cups»).
      const kort = (e, entall) => {
        const k = data.kort && data.kort[e];
        return Array.isArray(k) ? k[entall ? 0 : 1] : (k || e);
      };
      // Setningen under er den som leses opp; selve svarfeltet står utenfor opplesingen.
      svar.setAttribute('aria-live', 'off');
      const regn = () => {
        const [ord, gramPerDl] = (data.varer && data.varer[vare ? Number(vare.value) : 0]) || [];
        const m = tolkMengde(mengde.value, brok);
        const n = m ? m.n : null;
        // Negativt (unntatt med `negativ`) og alt som ikke er ett tall gir veiledning, aldri et delsvar.
        const gyldig = n !== null && (n >= 0 || Boolean(data.negativ));
        let ut = NaN;
        const aff = data.affin;
        if (gyldig && aff && aff[fra.value] && aff[til.value]) {
          // Affin enhet (temperatur): grunnverdi = n * a + b, og svaret går tilbake gjennom til-enhetens a og b.
          const [aF, bF] = aff[fra.value], [aT, bT] = aff[til.value];
          ut = (n * aF + bF - bT) / aT;
        } else if (gyldig) {
          const fraVekt = fra.value in data.g, tilVekt = til.value in data.g;
          const grunn = (e) => (e in data.g ? data.g[e] : data.ml[e]);
          if (fraVekt === tilVekt) ut = n * grunn(fra.value) / grunn(til.value);
          else if (gramPerDl > 0) ut = fraVekt ? n * data.g[fra.value] * 100 / gramPerDl / data.ml[til.value] : n * data.ml[fra.value] / 100 * gramPerDl / data.g[til.value];
        }
        if (gyldig) mengde.removeAttribute('aria-invalid'); else mengde.setAttribute('aria-invalid', 'true');
        if (Number.isFinite(ut)) {
          const utTekst = data.sifre ? presis(ut, data.sifre) : svarTekst(ut, til.value);
          svar.textContent = utTekst;
          // Tegnantallet styrer skriftstørrelsen i svarsiden (side.css), så et langt svar vises helt i stedet for å klippes.
          svar.style.setProperty('--tegn', String(Math.max(utTekst.length, 1)));
          setning.textContent = [`${m.tekst || mengdeTekst(n)} ${kort(fra.value, m.entall)}`, ord, `= ${utTekst} ${kort(til.value, utTekst === '1')}`].filter(Boolean).join(' ');
        } else {
          svar.textContent = '';
          svar.style.removeProperty('--tegn');
          setning.textContent = data.feil;
        }
        const gruppe = data.stegFor ? data.stegFor[fra.value] : fra.value in data.g ? (fra.value === 'kg' ? 'kg' : 'g') : (fra.value === 'ml' ? 'ml' : 'volum');
        const steg = data.steg[gruppe];
        hurtig.forEach((k, i) => {
          const h = tolkMengde(steg[i], brok);
          k.dataset.v = steg[i];
          k.textContent = `${steg[i]} ${kort(fra.value, h ? h.entall : false)}`;
          k.setAttribute('aria-pressed', String(gyldig && h !== null && h.n === n));
        });
      };
      for (const el of [mengde, fra, til, vare]) if (el) el.addEventListener(el === mengde ? 'input' : 'change', regn);
      hurtig.forEach((k) => k.addEventListener('click', () => { mengde.value = k.dataset.v; regn(); }));
      bytt.addEventListener('click', () => {
        const f = fra.value; fra.value = til.value; til.value = f;
        bytt.classList.toggle('snudd');
        if (!data.beholdMengde) mengde.value = data.byttTil && data.byttTil[fra.value] !== undefined ? data.byttTil[fra.value] : fra.value === 'g' ? '100' : fra.value === 'kg' ? '1' : '2';
        regn();
      });
      regn();
    } catch { /* hopp over dette skjemaet */ }
  }
})();

// Vekt-til-tid med tabellbånd (form.kalk[data-kalk="band"]): kilden gir tid per vektgruppe, ikke per pound, så vekten slås opp i bandene i skjemaets data.
// data.band = [{ navn, enhet: [entall, flertall], band: [{ a: vektFra, b: vektTil, c: tidFra, d: tidTil }] }]; språkstrengene (feil, til, to, og, lb) står i dataene. Filen har ingen språkstrenger.
// En vekt på grensen mellom to rader står i begge, og da vises begge radene. Brøker i svaret: kvarter og halve (2 1/4, 3 1/2).
(() => {
  const skjemaer = document.querySelectorAll('form.kalk[data-kalk="band"]');
  if (!skjemaer.length || !window.MatlystTall) return;
  const { tolkTall } = window.MatlystTall;
  const brok = (n) => {
    const hel = Math.floor(n), f = Math.round((n - hel) * 100) / 100;
    const b = { 0.25: '1/4', 0.5: '1/2', 0.75: '3/4' }[f];
    return f === 0 ? String(hel) : b ? (hel ? `${hel} ${b}` : b) : String(n);
  };
  for (const skjema of skjemaer) {
    try {
      const data = JSON.parse(skjema.querySelector('.kalk-data').textContent);
      const felt = (navn) => skjema.querySelector(`[data-felt="${navn}"]`);
      const mengde = felt('mengde'), til = felt('til'), svar = felt('svar'), setning = felt('setning'), vare = felt('vare');
      const hurtig = [...skjema.querySelectorAll('.hurtig button')];
      if (!(data && Array.isArray(data.band) && data.band.length && data.t && typeof data.t.feil === 'string' && mengde && til && svar && setning)) continue;
      svar.setAttribute('aria-live', 'off');
      const spenn = (a, b) => (a === b ? brok(a) : `${brok(a)} ${data.t.til} ${brok(b)}`);
      const tid = (a, b, e) => `${spenn(a, b)} ${b <= 1 ? e[0] : e[1]}`;
      const regn = () => {
        const sett = data.band[vare ? vare.selectedIndex : 0];
        const n = tolkTall(mengde.value, false);
        const treff = n === null ? [] : sett.band.filter((b) => n >= b.a && n <= b.b);
        til.options[0].textContent = sett.enhet[1];
        hurtig.forEach((k) => k.setAttribute('aria-pressed', String(n !== null && Number(k.dataset.v) === n)));
        if (!treff.length) {
          mengde.setAttribute('aria-invalid', 'true'); svar.textContent = ''; svar.style.removeProperty('--tegn'); setning.textContent = data.t.feil;
          return;
        }
        mengde.removeAttribute('aria-invalid');
        const lo = Math.min(...treff.map((b) => b.c)), hi = Math.max(...treff.map((b) => b.d));
        const utTekst = spenn(lo, hi);
        svar.textContent = utTekst;
        svar.style.setProperty('--tegn', String(Math.max(utTekst.length, 1)));
        const vekt = `${n} ${n === 1 ? data.t.lb[0] : data.t.lb[1]}, ${sett.navn.toLowerCase()}`;
        setning.textContent = treff.length === 1
          ? `${vekt}: ${tid(treff[0].c, treff[0].d, sett.enhet)}`
          : `${vekt}: ${data.t.to} ${tid(treff[0].c, treff[0].d, sett.enhet)} ${data.t.og} ${tid(treff[1].c, treff[1].d, sett.enhet)}`;
      };
      for (const el of [mengde, vare]) if (el) el.addEventListener(el === mengde ? 'input' : 'change', regn);
      hurtig.forEach((k) => k.addEventListener('click', () => { mengde.value = k.dataset.v; regn(); }));
      regn();
    } catch { /* hopp over dette skjemaet */ }
  }
})();

// Mengde per person (form.kalk[data-kalk="porsjon"]): voksne og barn gir hele mengden fra kildens tall per person.
// Varianter, tall og tekster kommer fra skjemaets egne data (script.kalk-data): v = [{ n: navn, d: [[min, maks, enhet]] }], b = barnets andel av en voksen, t = tekstene.
// Reglene mellom «porsjon:start» og «porsjon:slutt» er de samme som i scripts/familier/mengde-per-person/regn.mjs (tabellene på sidene skrives med den),
// og test/mengde-per-person.test.mjs kjører denne blokken mot regn.mjs. Siden finnes bare på norsk, så desimaltegnet er komma.
(() => {
  const skjemaer = document.querySelectorAll('form.kalk[data-kalk="porsjon"]');
  if (!skjemaer.length || !window.MatlystTall) return;
  // porsjon:start
  const ENH = { g: { stor: 'kg', faktor: 1000, d: [0, 2] }, dl: { stor: 'liter', faktor: 10, d: [2, 2] } };
  const rund = (n, d) => Math.round(Number((n * 10 ** d).toPrecision(12))) / 10 ** d;
  const pent = (n, d) => {
    const t = rund(n, d).toFixed(d);
    return (t.includes('.') ? t.replace(/0+$/u, '').replace(/\.$/u, '') : t).replace('.', ',');
  };
  const del = (n, enhet) => {
    const e = ENH[enhet];
    if (rund(n, e.d[0]) >= e.faktor) return { tall: pent(n / e.faktor, e.d[1]), enhet: e.stor };
    return { tall: pent(n, e.d[0]), enhet };
  };
  const delTekst = (min, maks, enhet, til) => {
    const a = del(min, enhet);
    if (maks === min) return `${a.tall} ${a.enhet}`;
    const b = del(maks, enhet);
    return a.enhet === b.enhet ? `${a.tall} ${til} ${b.tall} ${b.enhet}` : `${a.tall} ${a.enhet} ${til} ${b.tall} ${b.enhet}`;
  };
  const totalt = (perPerson, voksne, barn, faktor) => perPerson * (voksne + faktor * barn);
  const deler = (v, voksne, barn, faktor, til) => v.d.map(([min, maks, enhet]) => delTekst(totalt(min, voksne, barn, faktor), totalt(maks, voksne, barn, faktor), enhet, til));
  const setningTekst = (v, voksne, barn, faktor, t) => `${v.n}: ${voksne} ${voksne === 1 ? t.voksen : t.voksne}${barn > 0 ? ` ${t.og} ${barn} ${barn === 1 && t.ettBarn ? t.ettBarn : t.barn}` : ''} ${t.trenger} ${deler(v, voksne, barn, faktor, t.til).join(` ${t.eller} `)}.`;
  // porsjon:slutt
  for (const skjema of skjemaer) {
    // Hvert skjema settes opp for seg: et ødelagt skjema hoppes over (det statiske svaret i HTML-en blir stående), og resten virker.
    try {
      const data = JSON.parse(skjema.querySelector('.kalk-data').textContent);
      const felt = (navn) => skjema.querySelector(`[data-felt="${navn}"]`);
      const voksne = felt('voksne'), barn = felt('barn'), svar = felt('svar'), setning = felt('setning'), vare = felt('vare');
      const hurtig = [...skjema.querySelectorAll('.hurtig button')];
      if (!(data && Array.isArray(data.v) && data.v.length && typeof data.b === 'number' && data.t && typeof data.t.feil === 'string' && voksne && barn && svar && setning)) continue;
      svar.setAttribute('aria-live', 'off');
      // Hele tall fra 0 til 10 000. Alt annet gir veiledning, aldri et delsvar.
      const heltall = (el) => {
        const n = window.MatlystTall.tolkTall(el.value, true);
        return n !== null && Number.isInteger(n) && n >= 0 && n <= 10000 ? n : null;
      };
      const regn = () => {
        const v = data.v[vare ? vare.selectedIndex : 0];
        const a = heltall(voksne), b = heltall(barn);
        for (const [el, n] of [[voksne, a], [barn, b]]) { if (n === null) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid'); }
        if (a === null || b === null) {
          svar.textContent = '';
          svar.style.removeProperty('--tegn');
          setning.textContent = data.t.feil;
        } else {
          const tekst = deler(v, a, b, data.b, data.t.til)[0];
          svar.textContent = tekst;
          // Tegnantallet styrer skriftstørrelsen i svarflaten (side.css), så et langt svar vises helt i stedet for å klippes.
          svar.style.setProperty('--tegn', String(Math.max(tekst.length, 1)));
          setning.textContent = setningTekst(v, a, b, data.b, data.t);
        }
        hurtig.forEach((k) => k.setAttribute('aria-pressed', String(a !== null && Number(k.dataset.v) === a)));
      };
      for (const el of [voksne, barn]) el.addEventListener('input', regn);
      if (vare) vare.addEventListener('change', regn);
      hurtig.forEach((k) => k.addEventListener('click', () => { voksne.value = k.dataset.v; regn(); }));
      regn();
    } catch { /* hopp over dette skjemaet */ }
  }
})();

// How much per person, English (form.kalk[data-kalk="portion"]): adults and kids give the whole amount from the source's figure per person.
// Same data shape as the Norwegian block above: v = [{ n: name, d: [[min, max, unit]] }], b = a kid's share of an adult, t = the texts.
// The rules between «portion:start» and «portion:slutt» are the same as in scripts/familier/mengde-per-person/regn-en.mjs (the tables on the pages are written with it),
// and test/mengde-per-person-en.test.mjs runs this block against regn-en.mjs. US measures first, metric in parentheses; the decimal mark is a point.
(() => {
  const skjemaer = document.querySelectorAll('form.kalk[data-kalk="portion"]');
  if (!skjemaer.length || !window.MatlystTall) return;
  // portion:start
  const CUP_ML = 240;
  const COUNT = { sandwich: 'sandwiches' };
  const FRAC = { 0.125: '1/8', 0.25: '1/4', 0.375: '3/8', 0.5: '1/2', 0.625: '5/8', 0.75: '3/4', 0.875: '7/8' };
  const round = (n, d) => Math.round(Number((n * 10 ** d).toPrecision(12))) / 10 ** d;
  const plain = (n, d) => {
    const t = round(n, d).toFixed(d);
    return t.includes('.') ? t.replace(/0+$/u, '').replace(/\.$/u, '') : t;
  };
  const cups = (n) => {
    const q = Math.round(n * 8) / 8;
    const whole = Math.floor(q);
    const f = FRAC[q - whole];
    if (!f) return String(whole);
    return whole ? `${whole} ${f}` : f;
  };
  const frak = (n) => {
    const whole = Math.floor(n + 1e-9);
    const rest = n - whole;
    if (rest < 0.005) return String(whole);
    for (const d of [2, 3, 4, 8]) {
      const k = Math.round(rest * d);
      if (k > 0 && k < d && Math.abs(rest * d - k) < 0.03) return whole ? `${whole} ${k}/${d}` : `${k}/${d}`;
    }
    return plain(n, 2);
  };
  const metricWeight = (g) => (g >= 1000 ? `${plain(g / 1000, 1)} kg` : `${Math.round(g / 5) * 5} g`);
  const metricVolume = (ml) => (ml >= 1000 ? `${plain(ml / 1000, 1)} L` : `${Math.round(ml / 10) * 10} mL`);
  const del = (n, unit) => {
    if (unit === 'lb') return { tall: frak(n), enhet: 'lb', metrisk: metricWeight(n * 453.6) };
    if (unit === 'oz') return { tall: plain(n, 1), enhet: 'oz', metrisk: metricWeight(n * 28.35) };
    if (unit === 'cup') return { tall: cups(n), enhet: n > 1 ? 'cups' : 'cup', metrisk: metricVolume(Math.round(n * 8) / 8 * CUP_ML) };
    const flertall = COUNT[unit] || `${unit}s`;
    const t = plain(n, 1);
    return { tall: t, enhet: Number(t) > 1 ? flertall : unit, metrisk: null };
  };
  const delTekst = (min, maks, unit, til) => {
    let u = unit, a0 = min, b0 = maks;
    if (u === 'oz' && round(maks, 1) >= 16) { u = 'lb'; a0 = min / 16; b0 = maks / 16; }
    const a = del(a0, u);
    if (b0 === a0) return a.metrisk ? `${a.tall} ${a.enhet} (${a.metrisk})` : `${a.tall} ${a.enhet}`;
    const b = del(b0, u);
    if (!a.metrisk) return `${a.tall} ${til} ${b.tall} ${b.enhet}`;
    return `${a.tall} ${til} ${b.tall} ${b.enhet} (${a.metrisk} ${til} ${b.metrisk})`;
  };
  const totalt = (perPerson, adults, kids, share) => perPerson * (adults + share * kids);
  const deler = (v, adults, kids, share, til) => v.d.map(([min, maks, enhet]) => delTekst(totalt(min, adults, kids, share), totalt(maks, adults, kids, share), enhet, til));
  const setningTekst = (v, adults, kids, share, t) => `${v.n}: ${adults} ${adults === 1 ? t.adult : t.adults}${kids > 0 ? ` ${t.and} ${kids} ${kids === 1 ? t.kid : t.kids}` : ''} ${adults + kids === 1 ? t.needs : t.need} ${deler(v, adults, kids, share, t.to).join(` ${t.or} `)}.`;
  // portion:slutt
  for (const skjema of skjemaer) {
    // Each form is set up on its own: a broken form is skipped (the static answer in the HTML stays), and the rest work.
    try {
      const data = JSON.parse(skjema.querySelector('.kalk-data').textContent);
      const felt = (navn) => skjema.querySelector(`[data-felt="${navn}"]`);
      const voksne = felt('voksne'), barn = felt('barn'), svar = felt('svar'), setning = felt('setning'), vare = felt('vare');
      const hurtig = [...skjema.querySelectorAll('.hurtig button')];
      if (!(data && Array.isArray(data.v) && data.v.length && typeof data.b === 'number' && data.t && typeof data.t.error === 'string' && voksne && barn && svar && setning)) continue;
      svar.setAttribute('aria-live', 'off');
      // Whole numbers from 0 to 10,000. Anything else gives guidance, never a partial answer.
      const heltall = (el) => {
        const n = window.MatlystTall.tolkTall(el.value, true);
        return n !== null && Number.isInteger(n) && n >= 0 && n <= 10000 ? n : null;
      };
      const regn = () => {
        const v = data.v[vare ? vare.selectedIndex : 0];
        const a = heltall(voksne), b = heltall(barn);
        for (const [el, n] of [[voksne, a], [barn, b]]) { if (n === null) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid'); }
        if (a === null || b === null) {
          svar.textContent = '';
          svar.style.removeProperty('--tegn');
          setning.textContent = data.t.error;
        } else {
          // The big answer is the US amount; the metric amount stands in the sentence below.
          const tekst = deler(v, a, b, data.b, data.t.to)[0].replace(/ \([^)]*\)/gu, '');
          svar.textContent = tekst;
          // The character count drives the font size of the answer (side.css), so a long answer is shown in full instead of clipped.
          svar.style.setProperty('--tegn', String(Math.max(tekst.length, 1)));
          setning.textContent = setningTekst(v, a, b, data.b, data.t);
        }
        hurtig.forEach((k) => k.setAttribute('aria-pressed', String(a !== null && Number(k.dataset.v) === a)));
      };
      for (const el of [voksne, barn]) el.addEventListener('input', regn);
      if (vare) vare.addEventListener('change', regn);
      hurtig.forEach((k) => k.addEventListener('click', () => { voksne.value = k.dataset.v; regn(); }));
      regn();
    } catch { /* skip this form */ }
  }
})();

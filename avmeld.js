(function () {
  'use strict';

  // Sida er ren kulisse rundt ETT kall. All logikk — signaturen, idempotensen,
  // vernet mot at en e-postskanner melder folk av — bor i edge-funksjonen
  // `avmeld`. Her ligger bare adressen brukeren tør å lese.
  //
  // ⚠️ Hvorfor sida finnes: den ekte lenka går til
  // <prosjekt-id>.supabase.co, et vertsnavn ingen kjenner igjen, med en UUID
  // og en 43-tegns signatur etter seg. Den er trygg og ser ut som svindel.
  var FUNKSJON = 'https://uaryzmqvoqljjwqvgzoi.supabase.co/functions/v1/avmeld';
  var q = new URLSearchParams(location.search);
  var u = q.get('u') || '';
  var s = q.get('s') || '';
  // Hjelpemailen (tips om å komme i gang) har t=hjelp i lenka. Den velger bare
  // hvilken av de ferdige tekstvariantene i HTML-en som vises; ingenting fra
  // adressen settes inn i sida. Hvilken liste som meldes av, avgjør serveren av
  // signaturen (avmeldLenke.ts, avmeldTokenType), aldri av t.
  var ende = q.get('t') === 'hjelp' ? '-hjelp' : '';
  // Tokenet skal ikke bli stående i adresselinja, historikken eller et
  // skjermbilde. Det er lest over; fjern u og s og behold resten.
  if (q.has('u') || q.has('s')) {
    try {
      var rest = new URLSearchParams(location.search);
      rest.delete('u');
      rest.delete('s');
      var sok = rest.toString();
      history.replaceState(history.state, '', location.pathname + (sok ? '?' + sok : '') + location.hash);
    } catch (e) {}
  }
  // Formkravene speiler avmeldLenke.ts. De er en høflighetssjekk, ikke et
  // vern: serveren verifiserer signaturen uansett hva vi slipper videre.
  var gyldigForm = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(u)
    && /^[A-Za-z0-9_-]{43}$/.test(s);

  function vis(id) {
    ['bekreft', 'ferdig', 'mangler'].forEach(function (navn) {
      [navn, navn + '-hjelp'].forEach(function (variant) {
        var el = document.getElementById(variant);
        if (el) el.hidden = variant !== id + ende;
      });
    });
  }

  if (!gyldigForm) {
    vis('mangler');
    return;
  }

  vis('bekreft');
  var url = FUNKSJON + '?u=' + encodeURIComponent(u) + '&s=' + encodeURIComponent(s);
  var reserve = document.getElementById('reserve');
  if (reserve) reserve.action = url;

  var knapp = document.getElementById('meldAv' + ende);
  var status = document.getElementById('status' + ende);
  var feil = document.getElementById('feilmelding' + ende);
  knapp.addEventListener('click', function () {
    knapp.disabled = true;
    status.className = 'avmeld-status';
    status.textContent = status.dataset.venter;

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      // RFC 8058-kroppen. Den ber funksjonen svare kort i stedet for med sin
      // egen HTML-side, som er nettopp det vi vil her: kvitteringen er vår.
      body: 'List-Unsubscribe=One-Click',
    }).then(function (svar) {
      if (svar.ok) {
        vis('ferdig');
        return;
      }
      throw new Error('avmeld feilet');
    }).catch(function () {
      // Aldri en teknisk kode til brukeren. Én vei videre som alltid virker.
      knapp.disabled = false;
      status.className = 'avmeld-status avmeld-feil';
      status.innerHTML = feil.innerHTML;
    });
  });
}());

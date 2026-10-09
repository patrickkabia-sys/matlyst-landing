(function () {
  'use strict';

  var FUNKSJON = 'https://uaryzmqvoqljjwqvgzoi.supabase.co/functions/v1/avmeld';
  var q = new URLSearchParams(location.search);
  var u = q.get('u') || '';
  var s = q.get('s') || '';
  var gyldigForm = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(u)
    && /^[A-Za-z0-9_-]{43}$/.test(s);

  function vis(id) {
    ['bekreft', 'ferdig', 'mangler'].forEach(function (navn) {
      document.getElementById(navn).hidden = navn !== id;
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

  var knapp = document.getElementById('meldAv');
  var status = document.getElementById('status');
  var feil = document.getElementById('feilmelding');
  knapp.addEventListener('click', function () {
    knapp.disabled = true;
    status.className = 'fot';
    status.textContent = status.dataset.venter;

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'List-Unsubscribe=One-Click',
    }).then(function (svar) {
      if (svar.ok) {
        vis('ferdig');
        return;
      }
      throw new Error('avmeld feilet');
    }).catch(function () {
      knapp.disabled = false;
      status.className = 'fot feil';
      status.innerHTML = feil.innerHTML;
    });
  });
}());
